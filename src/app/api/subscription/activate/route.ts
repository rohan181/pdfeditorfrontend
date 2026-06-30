import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { setupIntentId } = await req.json()
    if (!setupIntentId) return Response.json({ error: 'setupIntentId required' }, { status: 400 })

    const stripeKey = process.env.STRIPE_SECRET_KEY
    const priceId = process.env.STRIPE_PRO_PRICE_ID
    if (!stripeKey || !priceId) return Response.json({ error: 'Stripe not configured' }, { status: 500 })

    const stripe = new Stripe(stripeKey)

    // Get the SetupIntent to find the payment method and customer
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)
    if (!setupIntent.payment_method) {
      return Response.json({ error: 'No payment method on SetupIntent' }, { status: 400 })
    }

    const customerId = setupIntent.customer as string
    const paymentMethodId = setupIntent.payment_method as string

    // Set as default payment method on customer
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    // Create the subscription with the saved payment method
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
    })

    // Update Supabase
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_sub_id: subscription.id,
      status: subscription.status === 'active' ? 'active' : subscription.status,
      price_id: priceId,
    }, { onConflict: 'user_id' })

    return Response.json({ status: subscription.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[activate]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
