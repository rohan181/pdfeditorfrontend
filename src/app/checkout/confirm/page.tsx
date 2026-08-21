'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, CircleX } from 'lucide-react'
import { PRO_BILLING_SUMMARY, PRO_PRICE_DISPLAY } from '@/lib/pricing'

type ConfirmationState = 'loading' | 'success' | 'cancelled' | 'failure'

function ConfirmInner() {
  const params = useSearchParams()
  const [state, setState] = useState<ConfirmationState>('loading')
  const [message, setMessage] = useState('Confirming your subscription with Stripe. Do not close this page yet.')

  useEffect(() => {
    const setupIntentId = params.get('setup_intent')
    const redirectStatus = params.get('redirect_status')

    if (redirectStatus === 'failed') {
      setMessage('Stripe could not confirm the payment details. No Pro access was added. Review your payment method and try again.')
      setState('failure')
      return
    }
    if (!setupIntentId || redirectStatus !== 'succeeded') {
      setMessage('Checkout was not completed. No subscription was created and your existing plan is unchanged.')
      setState('cancelled')
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20_000)
    fetch('/api/subscription/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setupIntentId }),
      signal: controller.signal,
    })
      .then(async response => ({ response, data: await response.json().catch(() => ({})) }))
      .then(({ response, data }) => {
        if (response.ok && (data.status === 'active' || data.status === 'trialing')) {
          setMessage(`Pro is active. ${PRO_BILLING_SUMMARY}`)
          setState('success')
        } else {
          setMessage('Your payment details were received, but Pro could not be activated. Your account has not been marked as Pro. Retry or contact support if the problem continues.')
          setState('failure')
        }
      })
      .catch(error => {
        setMessage((error as Error)?.name === 'AbortError'
          ? 'Subscription activation took too long. Check your dashboard before trying again so you do not create a duplicate subscription.'
          : 'The connection was interrupted while activating Pro. Check your dashboard before trying again.')
        setState('failure')
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [params])

  const icon = state === 'success'
    ? <CheckCircle2 size={34} aria-hidden="true" />
    : state === 'cancelled'
      ? <CircleX size={34} aria-hidden="true" />
      : state === 'failure'
        ? <AlertCircle size={34} aria-hidden="true" />
        : <span className="checkout-spinner" aria-hidden="true" />

  const heading = state === 'success'
    ? 'Pro is active'
    : state === 'cancelled'
      ? 'Checkout cancelled'
      : state === 'failure'
        ? 'Subscription not activated'
        : 'Activating Pro'

  return (
    <main className="checkout-confirm-page">
      <section className={`checkout-confirm-card is-${state}`} role={state === 'failure' ? 'alert' : 'status'} aria-live="polite" aria-busy={state === 'loading'}>
        <div className="checkout-confirm-icon">{icon}</div>
        <p className="checkout-eyebrow">EditPDF AI Pro · {PRO_PRICE_DISPLAY}/month</p>
        <h1>{heading}</h1>
        <p>{message}</p>

        {state === 'success' && (
          <div className="checkout-confirm-actions">
            <Link href="/dashboard?upgraded=1" className="is-primary">View Pro dashboard</Link>
            <Link href="/ai-pdf-form-filler">Open an AI tool</Link>
          </div>
        )}
        {state === 'cancelled' && (
          <div className="checkout-confirm-actions">
            <Link href="/pricing?checkout=cancelled" className="is-primary">Return to pricing</Link>
            <Link href="/pdf-editor">Use a Free tool</Link>
          </div>
        )}
        {state === 'failure' && (
          <div className="checkout-confirm-actions">
            <Link href="/dashboard" className="is-primary">Check current plan</Link>
            <Link href="/checkout">Retry checkout</Link>
            <Link href="/support">Contact support</Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default function ConfirmPage() {
  return <Suspense><ConfirmInner /></Suspense>
}
