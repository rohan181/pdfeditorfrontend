'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, Check, ShieldCheck } from 'lucide-react'
import {
  PRO_BILLING_SUMMARY,
  PRO_CANCELLATION_SUMMARY,
  PRO_PRICE_DISPLAY,
  PRO_REFUND_SUMMARY,
} from '@/lib/pricing'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const FEATURES = [
  'Everything available on Free',
  'No daily AI-action cap',
  'AI form fill, summaries, translation, OCR, chat, mind maps, and quizzes',
  'AI-assisted PDF to Word, Excel, and PowerPoint',
  'The same documented tool limits still apply',
]

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!stripe || !elements || loading) return

    setLoading(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/confirm` },
    })

    if (stripeError) {
      setError(stripeError.message ?? 'The payment details could not be confirmed. Review them and try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={loading}>
      <div className="checkout-payment-element"><PaymentElement options={{ layout: 'tabs' }} /></div>

      {error && (
        <div className="checkout-error" role="alert">
          <AlertCircle size={19} aria-hidden="true" />
          <div><strong>Payment could not be completed</strong><span>{error}</span></div>
        </div>
      )}

      <button type="submit" className="checkout-submit" disabled={!stripe || loading}>
        {loading ? 'Confirming payment details…' : `Subscribe — ${PRO_PRICE_DISPLAY}/month`}
      </button>
      <p className="checkout-submit-note">{PRO_BILLING_SUMMARY} No payment is submitted until you press Subscribe.</p>
      <Link href="/pricing?checkout=cancelled" className="checkout-cancel-link">Cancel checkout and return to pricing</Link>
    </form>
  )
}

export default function CheckoutPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [alreadyPro, setAlreadyPro] = useState(false)
  const [preparing, setPreparing] = useState(false)

  const prepareCheckout = useCallback(async () => {
    setPreparing(true)
    setFetchError(null)
    setAlreadyPro(false)
    setClientSecret(null)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)

    try {
      const response = await fetch('/api/subscription/create-setup-intent', { method: 'POST', signal: controller.signal })
      const data = await response.json().catch(() => ({}))
      if (response.status === 409 && data.code === 'already_pro') {
        setAlreadyPro(true)
        router.replace('/manage-subscription')
      } else if (response.ok && data.clientSecret) {
        setClientSecret(data.clientSecret)
      } else {
        setFetchError('Checkout could not be prepared. Your plan has not changed. Please try again.')
      }
    } catch (error) {
      const timedOut = (error as Error)?.name === 'AbortError'
      setFetchError(timedOut
        ? 'Checkout preparation took too long. Your plan has not changed. Please retry.'
        : 'The connection was interrupted. Your plan has not changed. Please retry.')
    } finally {
      window.clearTimeout(timeout)
      setPreparing(false)
    }
  }, [router])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.replace('/sign-in')
      return
    }
    void prepareCheckout()
  }, [isLoaded, isSignedIn, prepareCheckout, router])

  return (
    <div className="checkout-page">
      <nav className="checkout-nav" aria-label="Checkout navigation">
        <Link href="/" className="checkout-logo"><Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" priority /></Link>
        <Link href="/pricing">← Back to pricing</Link>
      </nav>

      <main className="checkout-layout">
        <section className="checkout-summary" aria-labelledby="checkout-plan-heading">
          <p className="checkout-eyebrow">EditPDF AI Pro</p>
          <h1 id="checkout-plan-heading">Review your subscription</h1>
          <div className="checkout-price"><strong>{PRO_PRICE_DISPLAY}</strong><span>per month</span></div>
          <p>{PRO_BILLING_SUMMARY}</p>

          <ul>
            {FEATURES.map(feature => <li key={feature}><Check size={16} aria-hidden="true" /><span>{feature}</span></li>)}
          </ul>

          <dl className="checkout-total">
            <div><dt>EditPDF AI Pro</dt><dd>{PRO_PRICE_DISPLAY}</dd></div>
            <div><dt>Total due today</dt><dd>{PRO_PRICE_DISPLAY} USD</dd></div>
          </dl>
        </section>

        <section className="checkout-form-card" aria-labelledby="payment-details-heading">
          <span className="checkout-secure-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
          <h2 id="payment-details-heading">Payment details</h2>
          {user?.primaryEmailAddress?.emailAddress && <p className="checkout-account">Subscribing as <strong>{user.primaryEmailAddress.emailAddress}</strong></p>}

          {alreadyPro ? (
            <div className="checkout-state" role="status">
              <h3>You already have Pro</h3>
              <p>No second checkout was created. Opening your subscription settings…</p>
              <Link href="/manage-subscription">Manage subscription</Link>
            </div>
          ) : fetchError ? (
            <div className="checkout-state is-error" role="alert">
              <AlertCircle size={24} aria-hidden="true" />
              <h3>Checkout is unavailable</h3>
              <p>{fetchError}</p>
              <button type="button" onClick={() => void prepareCheckout()}>Retry checkout preparation</button>
              <Link href="/pricing?checkout=cancelled">Return to pricing</Link>
            </div>
          ) : preparing || !clientSecret ? (
            <div className="checkout-loading" role="status" aria-live="polite">
              <span className="checkout-spinner" aria-hidden="true" />
              <strong>Preparing secure checkout</strong>
              <p>This should take only a moment. No payment has been made.</p>
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#315fce', colorBackground: '#ffffff', colorText: '#1d1d1f',
                    borderRadius: '10px', fontFamily: 'system-ui, sans-serif', fontSizeBase: '16px',
                  },
                },
              }}
            >
              <CheckoutForm />
            </Elements>
          )}

          <div className="checkout-policy-summary">
            <p><strong>Cancellation:</strong> {PRO_CANCELLATION_SUMMARY}</p>
            <p><strong>Refunds:</strong> {PRO_REFUND_SUMMARY}</p>
            <p>By subscribing, you agree to the <Link href="/terms">Terms of Service</Link>.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
