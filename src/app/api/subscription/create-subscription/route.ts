import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRO_PRICE_ID
  if (!stripeKey || !priceId) return Response.json({ error: 'Stripe not configured' }, { status: 500 })

  const stripe = new Stripe(stripeKey)

  // Get or create Stripe customer
  const { data: existing } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()

  let customerId = existing?.stripe_customer_id as string | undefined

  if (!customerId) {
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    })
    customerId = customer.id
  }

  // Create subscription (payment_behavior: default_incomplete gives us a client_secret)
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  })

  const invoice = subscription.latest_invoice as Stripe.Invoice & { payment_intent: Stripe.PaymentIntent }
  const clientSecret = invoice.payment_intent?.client_secret

  // Pre-create Supabase record so the webhook can update it by stripe_customer_id
  await supabaseAdmin.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_sub_id: subscription.id,
    status: 'incomplete',
    price_id: priceId,
  }, { onConflict: 'user_id' })

  return Response.json({ clientSecret })
}
