'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const FEATURES = [
  'Unlimited AI uses — no daily resets',
  'AI form autofill, summarizer & translator',
  'PDF Mind Map & quiz creator',
  'PDF → Word, Excel, PowerPoint',
  'Priority processing',
]

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirm`,
      },
    })

    // Only reaches here on error — success redirects automatically
    if (stripeError) {
      setError(stripeError.message ?? 'Payment setup failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 24 }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#dc2626',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: '100%', padding: '15px 0', borderRadius: 12, border: 'none',
          background: loading ? '#6b7280' : 'linear-gradient(135deg,#0891b2,#0e7490)',
          color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'opacity .2s',
        }}
      >
        {loading ? 'Processing…' : 'Subscribe — $1.00/month'}
      </button>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
        No contracts · Cancel anytime · Secured by Stripe
      </p>
    </form>
  )
}

export default function CheckoutPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) { router.push('/sign-in'); return }

    fetch('/api/subscription/create-setup-intent', { method: 'POST' })
      .then(async r => {
        const text = await r.text()
        try {
          const data = JSON.parse(text)
          if (data.clientSecret) setClientSecret(data.clientSecret)
          else setFetchError(data.error ?? `Server error (${r.status})`)
        } catch {
          setFetchError(`Server error (${r.status}): ${text.slice(0, 120)}`)
        }
      })
      .catch(err => setFetchError(`Network error: ${err?.message ?? 'unknown'}`))
  }, [isLoaded, isSignedIn, router])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'var(--font-dm,system-ui,sans-serif)' }}>

      {/* Nav */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo.png" alt="EditPDF AI" style={{ height: 48, width: 'auto', display: 'block' }} />
        </Link>
        <Link href="/pricing" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to pricing
        </Link>
      </nav>

      {/* Main */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 28, alignItems: 'start' }}>

        {/* Left — Order summary */}
        <div>
          <div style={{ background: '#1d1d1f', borderRadius: 24, padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 220, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(8,145,178,.4),transparent 70%)', pointerEvents: 'none' }} />

            <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 800, padding: '4px 10px', letterSpacing: '.05em', marginBottom: 20 }}>
              MOST POPULAR
            </span>

            <p style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 8px' }}>EditPDF AI Pro</p>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 800, color: '#fff', letterSpacing: '-.04em', lineHeight: 1 }}>$1</span>
              <span style={{ fontSize: 15, color: '#6b7280', paddingBottom: 8 }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 28px' }}>Billed monthly · Cancel anytime</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#e5e7eb' }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid #374151', paddingTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: '#9ca3af' }}>EditPDF AI Pro</span>
                <span style={{ fontSize: 14, color: '#e5e7eb', fontWeight: 600 }}>$1.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Total due today</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>$1.00</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
            {['256-bit SSL', 'Powered by Stripe', 'Cancel anytime'].map(t => (
              <span key={t} style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#10b981' }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Payment form */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1d1d1f', margin: '0 0 6px', letterSpacing: '-.03em' }}>
            Payment details
          </h2>

          {user?.primaryEmailAddress?.emailAddress && (
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px' }}>
              Subscribing as <strong style={{ color: '#374151' }}>{user.primaryEmailAddress.emailAddress}</strong>
            </p>
          )}

          {fetchError ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '16px', fontSize: 14, color: '#dc2626' }}>
              {fetchError}
            </div>
          ) : !clientSecret ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[80, 48, 48, 56].map((h, i) => (
                <div key={i} style={{ height: h, background: '#f3f4f6', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#0891b2',
                    colorBackground: '#ffffff',
                    colorText: '#1d1d1f',
                    borderRadius: '10px',
                    fontFamily: 'system-ui, sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
