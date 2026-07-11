'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOSING = [
  'Unlimited AI uses (back to 5/day)',
  'AI form autofill & chat fill',
  'AI summarizer & translator',
  'PDF Mind Map generator',
  'PDF → Word, Excel, PowerPoint',
  'AI OCR & quiz creator',
  'Priority processing',
]

type Stage = 'confirm' | 'cancelled'

export default function CancelPage() {
  const router = useRouter()
  const [stage, setStage]   = useState<Stage>('confirm')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setStage('cancelled')
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'var(--font-dm,system-ui,sans-serif)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="lg-cn" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4F7FFA"/><stop offset="100%" stopColor="#8B3FEC"/></linearGradient></defs>
            <path d="M5,2 L19,2 L27,10 L27,26 Q27,28 25,28 L5,28 Q3,28 3,26 L3,4 Q3,2 5,2 Z" fill="white" stroke="url(#lg-cn)" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M19,2 L19,10 L27,10" fill="none" stroke="url(#lg-cn)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="22" x2="20" y2="11" stroke="url(#lg-cn)" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="8" cy="23" r="1.8" fill="url(#lg-cn)"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#0D1B4B', letterSpacing: '-.03em' }}>
            EditPDF<span style={{ marginLeft: 2, background: 'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
          ← Dashboard
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

        {stage === 'cancelled' ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ width: 72, height: 72, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
              👋
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1d1d1f', margin: '0 0 12px', letterSpacing: '-.03em' }}>
              Subscription cancelled
            </h1>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 8px', lineHeight: 1.6 }}>
              Your Pro access continues until the end of this billing period.
            </p>
            <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 32px' }}>
              After that your account reverts to the Free plan.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/pricing')}
                style={{ padding: '12px 24px', borderRadius: 10, border: '1.5px solid #d1d5db', background: '#fff', color: '#374151', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Resubscribe
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#1d1d1f', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>

        ) : (
          /* ── Confirm state ── */
          <div style={{ maxWidth: 560, width: '100%' }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: '36px 32px', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,.06)', marginBottom: 16 }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, background: '#fef2f2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  ⚠️
                </div>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1d1d1f', margin: 0, letterSpacing: '-.03em' }}>
                    Cancel your Pro subscription?
                  </h1>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>
                    You'll lose access to these features at the end of your billing period:
                  </p>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {LOSING.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151', padding: '10px 14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => router.push('/dashboard')}
                  style={{ flex: 1, minWidth: 140, padding: '14px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                >
                  Keep Pro
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  style={{ flex: 1, minWidth: 140, padding: '14px 0', borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff', color: loading ? '#9ca3af' : '#ef4444', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Cancelling…' : 'Cancel subscription'}
                </button>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>
              Changed your mind?{' '}
              <Link href="/dashboard" style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
                Go back to dashboard
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
