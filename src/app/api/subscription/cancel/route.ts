import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) return Response.json({ error: 'Stripe not configured' }, { status: 500 })

    const { data } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_sub_id, stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!data?.stripe_sub_id) {
      return Response.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const stripe = new Stripe(stripeKey)

    // Cancel at period end — user keeps Pro access until the billing cycle ends
    // Supabase stays 'active'; the customer.subscription.deleted webhook
    // will flip it to 'canceled' when Stripe actually ends the subscription
    await stripe.subscriptions.update(data.stripe_sub_id, {
      cancel_at_period_end: true,
    })

    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[cancel]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
