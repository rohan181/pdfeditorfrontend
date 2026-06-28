import { headers } from 'next/headers'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = (await headers()).get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    const stripe = new Stripe(stripeKey)
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return Response.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    if (!userId || !session.subscription || !session.customer) return new Response('ok')

    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: String(session.customer),
      stripe_sub_id: String(session.subscription),
      status: 'active',
      price_id: session.metadata?.priceId ?? '',
    }, { onConflict: 'user_id' })
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const status = sub.status === 'active' ? 'active' : sub.status
    await supabaseAdmin
      .from('subscriptions')
      .update({ status, stripe_sub_id: sub.id })
      .eq('stripe_customer_id', String(sub.customer))
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_customer_id', String(sub.customer))
  }

  return new Response('ok')
}
