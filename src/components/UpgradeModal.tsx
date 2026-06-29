'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UpgradeModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('upgrade-needed', show)
    return () => window.removeEventListener('upgrade-needed', show)
  }, [])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 20, padding: '36px 32px',
          maxWidth: 420, width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg,#0891b2,#0e7490)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', margin: '0 0 8px', letterSpacing: '-.03em' }}>
          Daily limit reached
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>
          You've used your free AI credit for today.<br/>
          Upgrade to <strong style={{ color: '#0891b2' }}>Pro</strong> for unlimited access to all AI tools.
        </p>

        {/* Feature list */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
          {['Unlimited AI uses', 'All 19 AI tools', 'Priority processing', 'No daily resets'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 13, color: '#374151' }}>
              <span style={{ color: '#0891b2', fontWeight: 700, fontSize: 15 }}>✓</span> {f}
            </div>
          ))}
        </div>

        <button
          onClick={() => { setOpen(false); router.push('/pricing') }}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 12,
            background: '#1d1d1f', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10,
          }}
        >
          Upgrade to Pro
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{
            width: '100%', padding: '11px 0', borderRadius: 12,
            background: 'transparent', color: '#9ca3af', border: '1.5px solid #e5e7eb',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
