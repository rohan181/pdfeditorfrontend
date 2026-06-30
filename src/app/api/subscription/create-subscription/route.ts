import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
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

    const invoice = subscription.latest_invoice as Stripe.Invoice & { payment_intent: Stripe.PaymentIntent } | null
    const clientSecret = invoice?.payment_intent?.client_secret ?? null

    console.log('[create-subscription] sub status:', subscription.status)
    console.log('[create-subscription] invoice id:', invoice?.id ?? 'null')
    console.log('[create-subscription] payment_intent id:', invoice?.payment_intent?.id ?? 'null')
    console.log('[create-subscription] client_secret present:', !!clientSecret)

    if (!clientSecret) {
      return Response.json({
        error: `No client secret — sub status: ${subscription.status}, invoice: ${invoice?.id ?? 'null'}, pi: ${invoice?.payment_intent?.id ?? 'null'}`,
      }, { status: 500 })
    }

    // Pre-create Supabase record so the webhook can update it by stripe_customer_id
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_sub_id: subscription.id,
      status: 'incomplete',
      price_id: priceId,
    }, { onConflict: 'user_id' })

    return Response.json({ clientSecret })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[create-subscription]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
