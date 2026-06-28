'use client'
import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For occasional users',
    features: [
      '5 AI operations per day',
      'All core PDF tools (unlimited)',
      'PDF editing, compression, merge/split',
      'E-signature',
    ],
    cta: 'Get started',
    href: '/sign-up',
    priceId: null,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For power users',
    features: [
      'Unlimited AI operations',
      'All core PDF tools (unlimited)',
      'AI form autofill & chat fill',
      'PDF → Word, Excel, PowerPoint',
      'AI summarizer & translator',
      'Mind map generator',
      'Priority processing',
    ],
    cta: 'Upgrade to Pro',
    href: '#',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '',
    highlight: true,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(priceId: string) {
    setLoading(priceId)
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-8 inline-block">
          ← Back to tools
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Simple, honest pricing</h1>
          <p className="text-slate-500 text-lg">All core PDF tools free forever. Pay only for AI features.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlight
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-600 border-transparent text-white shadow-2xl shadow-violet-200'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="mb-6">
                <p className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-violet-200' : 'text-slate-500'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-violet-200' : 'text-slate-400'}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${plan.highlight ? 'text-violet-200' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={plan.highlight ? 'text-violet-200' : 'text-violet-600'}>✓</span>
                    <span className={plan.highlight ? 'text-violet-100' : 'text-slate-700'}>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.priceId ? (
                <button
                  onClick={() => handleUpgrade(plan.priceId!)}
                  disabled={loading === plan.priceId}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition bg-white text-violet-700 hover:bg-violet-50 disabled:opacity-60"
                >
                  {loading === plan.priceId ? 'Redirecting...' : plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.href}
                  className="block w-full py-3 rounded-xl font-semibold text-sm text-center transition bg-slate-900 text-white hover:bg-slate-700"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          No contracts. Cancel anytime. Powered by Stripe.
        </p>
      </div>
    </div>
  )
}
