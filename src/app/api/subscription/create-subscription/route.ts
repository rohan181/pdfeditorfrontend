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

    // Create subscription with default_incomplete so it requires payment confirmation
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
      },
      collection_method: 'charge_automatically',
    })

    // Retrieve the invoice directly to get the payment_intent
    const invoiceId = subscription.latest_invoice as string
    if (!invoiceId) {
      return Response.json({ error: 'No invoice on subscription' }, { status: 500 })
    }

    const invoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ['payment_intent'],
    })

    const paymentIntent = (invoice as unknown as { payment_intent: Stripe.PaymentIntent | null }).payment_intent
    const clientSecret = paymentIntent?.client_secret ?? null

    console.log('[create-subscription] sub:', subscription.id, 'status:', subscription.status)
    console.log('[create-subscription] invoice:', invoice.id, 'status:', invoice.status)
    console.log('[create-subscription] pi:', paymentIntent?.id ?? 'null', 'secret present:', !!clientSecret)

    if (!clientSecret) {
      return Response.json({
        error: `No client secret — invoice status: ${invoice.status}, pi: ${paymentIntent?.id ?? 'null'}, pi_status: ${paymentIntent?.status ?? 'null'}`,
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
