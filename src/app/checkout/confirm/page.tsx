'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupIntentId = params.get('setup_intent')
    const redirectStatus = params.get('redirect_status')

    if (!setupIntentId || redirectStatus !== 'succeeded') {
      setError('Payment setup was not completed. Please try again.')
      setStatus('error')
      return
    }

    fetch('/api/subscription/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setupIntentId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          setStatus('error')
        } else {
          router.replace('/dashboard?upgraded=1')
        }
      })
      .catch(() => {
        setError('Network error. Please contact support.')
        setStatus('error')
      })
  }, [params, router])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f5f5f7', fontFamily: 'var(--font-dm,system-ui,sans-serif)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: '0 24px' }}>
        {status === 'loading' ? (
          <>
            <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ fontSize: 16, color: '#6b7280', fontWeight: 500 }}>Activating your Pro subscription…</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1d1d1f', margin: '0 0 10px' }}>Something went wrong</h2>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>{error}</p>
            <a href="/checkout" style={{
              display: 'inline-block', padding: '12px 24px', borderRadius: 10,
              background: '#1d1d1f', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}>Try again</a>
          </>
        )}
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  )
}
