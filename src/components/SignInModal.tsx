'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('signin-needed', show)
    return () => window.removeEventListener('signin-needed', show)
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
          maxWidth: 400, width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: '#1d1d1f',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="white"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', margin: '0 0 8px', letterSpacing: '-.03em' }}>
          Sign in to continue
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px', lineHeight: 1.6 }}>
          Create a free account to use AI tools.<br/>
          5 free AI uses every day, no credit card required.
        </p>

        <button
          onClick={() => { setOpen(false); router.push('/sign-in') }}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 12,
            background: '#1d1d1f', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10,
          }}
        >
          Sign in
        </button>
        <button
          onClick={() => { setOpen(false); router.push('/sign-up') }}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 12,
            background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10,
          }}
        >
          Create free account
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
