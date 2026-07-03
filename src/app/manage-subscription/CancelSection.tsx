'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LOSING = [
  'Unlimited AI uses per day',
  'AI Form Filler & smart autofill',
  'PDF Summarizer & Translator',
  'PDF Mind Map & Quiz Creator',
  'PDF → Word, Excel, PowerPoint',
  'AI OCR scanner',
  'Priority processing',
]

export default function CancelSection({ cancelAtPeriodEnd }: { cancelAtPeriodEnd: boolean }) {
  const router = useRouter()
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [done, setDone]     = useState(false)

  if (cancelAtPeriodEnd || done) {
    return (
      <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⏳</span>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#92400e' }}>Cancellation scheduled</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#a16207', lineHeight: 1.5 }}>
            Your Pro access continues until the end of your billing period. After that your account reverts to the Free plan.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: '#0891b2', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Resubscribe →
          </button>
        </div>
      </div>
    )
  }

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setDone(true)
      setOpen(false)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', background: 'none', border: '1.5px solid #fecaca', borderRadius: 10, padding: '8px 16px', cursor: 'pointer' }}>
          Cancel subscription
        </button>
      ) : (
        <div style={{ background: '#fff', border: '1.5px solid #fecaca', borderRadius: 16, padding: '24px' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: '#1d1d1f' }}>Cancel Pro subscription?</h3>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            You'll lose access to these features at the end of your billing period:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {LOSING.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', padding: '8px 12px', background: '#fafafa', borderRadius: 8, border: '1px solid #f3f4f6' }}>
                <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0, fontSize: 11 }}>✕</span>
                {f}
              </li>
            ))}
          </ul>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setOpen(false)}
              style={{ flex: 1, minWidth: 120, padding: '12px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Keep Pro
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              style={{ flex: 1, minWidth: 120, padding: '12px 0', borderRadius: 10, border: '1.5px solid #fecaca', background: '#fff', color: loading ? '#9ca3af' : '#ef4444', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Cancelling…' : 'Yes, cancel'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
