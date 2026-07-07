import { headers } from 'next/headers'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    console.error('[stripe-webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  let body: string
  let signature: string
  try {
    body = await req.text()
    signature = (await headers()).get('stripe-signature') ?? ''
  } catch (err) {
    console.error('[stripe-webhook] Failed to read request body:', err)
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = new Stripe(stripeKey)
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return Response.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  console.log('[stripe-webhook] Processing event:', event.type, event.id)

  try {
    switch (event.type) {

      // ── One-time checkout (old hosted checkout flow) ────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        if (!userId || !session.subscription || !session.customer) break

        const { error } = await supabaseAdmin.from('subscriptions').upsert({
          user_id:            userId,
          stripe_customer_id: String(session.customer),
          stripe_sub_id:      String(session.subscription),
          status:             'active',
          price_id:           session.metadata?.priceId ?? '',
        }, { onConflict: 'user_id' })

        if (error) console.error('[stripe-webhook] checkout.session.completed upsert error:', error)
        break
      }

      // ── Subscription created (new Elements flow) ────────────────────────────
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId
        if (!userId) break

        const priceId = sub.items.data[0]?.price?.id ?? ''
        const { error } = await supabaseAdmin.from('subscriptions').upsert({
          user_id:            userId,
          stripe_customer_id: String(sub.customer),
          stripe_sub_id:      sub.id,
          status:             sub.status === 'active' ? 'active' : sub.status,
          price_id:           priceId,
        }, { onConflict: 'user_id' })

        if (error) console.error('[stripe-webhook] customer.subscription.created upsert error:', error)
        break
      }

      // ── Subscription updated (plan change, renewal, cancellation) ───────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: sub.status, stripe_sub_id: sub.id })
          .eq('stripe_customer_id', String(sub.customer))

        if (error) console.error('[stripe-webhook] customer.subscription.updated error:', error)
        break
      }

      // ── Subscription deleted / cancelled ────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_customer_id', String(sub.customer))

        if (error) console.error('[stripe-webhook] customer.subscription.deleted error:', error)
        break
      }

      // ── Invoice paid (confirms recurring payment succeeded) ─────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
        const subId = invoice.subscription
          ?? (invoice as any).parent?.subscription_details?.subscription
        if (!subId || !invoice.customer) break

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'active', stripe_sub_id: String(subId) })
          .eq('stripe_customer_id', String(invoice.customer))

        if (error) console.error('[stripe-webhook] invoice.payment_succeeded error:', error)
        break
      }

      // ── Invoice payment failed (card declined, insufficient funds) ──────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.customer) break

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', String(invoice.customer))

        if (error) console.error('[stripe-webhook] invoice.payment_failed error:', error)
        break
      }

      default:
        // Unhandled event type — acknowledged, not processed
        break
    }
  } catch (err) {
    // Log but still return 200 so Stripe doesn't disable the webhook.
    // The event has been received; a retry would not fix a processing bug.
    console.error('[stripe-webhook] Unhandled exception while processing', event.type, ':', err)
  }

  return new Response('ok', { status: 200 })
}
