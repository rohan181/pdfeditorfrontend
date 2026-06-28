import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceId } = await req.json()
  if (!priceId) return Response.json({ error: 'priceId required' }, { status: 400 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return Response.json({ error: 'Stripe not configured' }, { status: 500 })

  const stripe = new Stripe(stripeKey)
  const origin = req.headers.get('origin') ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId },
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/pricing`,
  })

  return Response.json({ url: session.url })
}
