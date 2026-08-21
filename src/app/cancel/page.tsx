'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'
import { PRO_CANCELLATION_SUMMARY, PRO_REFUND_SUMMARY } from '@/lib/pricing'

const PLAN_CHANGES = [
  `Your shared AI allowance returns to ${FREE_AI_DAILY_LIMIT} actions per UTC day`,
  'AI tools and AI-assisted conversions remain available through the Free allowance',
  'Core browser PDF workflows remain free without an account',
  'Tool-specific input and processing limits do not change',
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
      if (!res.ok) { setError('Cancellation could not be scheduled. Your subscription is still active. Please retry.'); setLoading(false); return }
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
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 60, width: 'auto', display: 'block' }} priority />
        </Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
          ← Dashboard
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

        {stage === 'cancelled' ? (
          /* ── Success state ── */
          <div role="status" style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ width: 72, height: 72, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
              👋
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1d1d1f', margin: '0 0 12px', letterSpacing: '-.03em' }}>
              Cancellation scheduled
            </h1>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 8px', lineHeight: 1.6 }}>
              Your Pro access continues until the end of this billing period.
            </p>
            <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 32px' }}>
              After that your account returns to Free. Cancellation does not create a partial refund for unused time.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/pricing')}
                style={{ padding: '12px 24px', borderRadius: 10, border: '1.5px solid #d1d5db', background: '#fff', color: '#374151', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Review plan options
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
                    What changes at the end of your billing period:
                  </p>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PLAN_CHANGES.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151', padding: '10px 14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <p style={{ margin: '0 0 20px', padding: '12px 14px', borderRadius: 10, background: '#f8fafc', color: '#64748b', fontSize: 12.5, lineHeight: 1.55 }}>
                {PRO_CANCELLATION_SUMMARY} {PRO_REFUND_SUMMARY}
              </p>

              {error && (
                <div role="alert" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#dc2626' }}>
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
