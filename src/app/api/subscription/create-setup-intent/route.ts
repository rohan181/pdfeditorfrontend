import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) return Response.json({ error: 'Stripe not configured' }, { status: 500 })

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

      // Pre-save customer ID so activate route can look up userId by customerId
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        status: 'incomplete',
        price_id: process.env.STRIPE_PRO_PRICE_ID ?? '',
      }, { onConflict: 'user_id' })
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: { userId },
    })

    return Response.json({ clientSecret: setupIntent.client_secret })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[create-setup-intent]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
