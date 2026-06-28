import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return Response.json({ error: 'Stripe not configured' }, { status: 500 })

  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data?.stripe_customer_id) {
    return Response.json({ error: 'No active subscription found' }, { status: 404 })
  }

  const stripe = new Stripe(stripeKey)
  const origin = req.headers.get('origin') ?? 'http://localhost:3000'

  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${origin}/dashboard`,
  })

  return Response.redirect(session.url, 303)
}
