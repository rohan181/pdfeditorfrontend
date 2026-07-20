'use client'
import { useEffect, useState } from 'react'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { X, Sparkles, Lock } from 'lucide-react'

export default function SignInModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('signin-needed', show)
    return () => window.removeEventListener('signin-needed', show)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  const close = () => setOpen(false)

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.52)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 24, padding: '40px 36px',
          maxWidth: 420, width: '100%', textAlign: 'center', position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06)',
          animation: 'simo-in .22s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <style>{`
          @keyframes simo-in { from { opacity:0; transform:scale(.92) translateY(10px) } to { opacity:1; transform:none } }
        `}</style>

        {/* Close */}
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 30, height: 30, borderRadius: '50%',
            background: '#f3f4f6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9ca3af',
          }}
        >
          <X size={14} strokeWidth={2.5} />
        </button>

        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 22px',
          boxShadow: '0 8px 28px rgba(124,58,237,.32)',
        }}>
          <Sparkles size={28} color="#fff" strokeWidth={1.8} />
        </div>

        {/* Headline */}
        <h2 style={{
          fontSize: 23, fontWeight: 800, color: '#1d1d1f',
          letterSpacing: '-0.04em', lineHeight: 1.15, margin: '0 0 10px',
          fontFamily: 'var(--font-jakarta,system-ui,sans-serif)',
        }}>
          Sign in to use AI tools
        </h2>

        <p style={{
          fontSize: 14, color: '#6b7280', lineHeight: 1.65, margin: '0 0 28px',
          fontFamily: 'var(--font-dm,system-ui,sans-serif)',
        }}>
          AI features are free — get <strong style={{ color: '#1d1d1f', fontWeight: 700 }}>5 uses every day</strong> with a free account.
          No credit card required.
        </p>

        {/* Sign In */}
        <SignInButton mode="modal">
          <button
            onClick={close}
            style={{
              display: 'block', width: '100%', padding: '13px 0',
              borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
              color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 10,
              boxShadow: '0 4px 18px rgba(124,58,237,.3)',
              fontFamily: 'var(--font-dm,system-ui,sans-serif)',
              letterSpacing: '-0.02em',
            }}
          >
            Sign in
          </button>
        </SignInButton>

        {/* Sign Up */}
        <SignUpButton mode="modal">
          <button
            onClick={close}
            style={{
              display: 'block', width: '100%', padding: '13px 0',
              borderRadius: 12, border: '1.5px solid #e5e7eb', cursor: 'pointer',
              background: '#fff', color: '#1d1d1f', fontSize: 15, fontWeight: 700,
              marginBottom: 12,
              fontFamily: 'var(--font-dm,system-ui,sans-serif)',
              letterSpacing: '-0.02em',
            }}
          >
            Create free account
          </button>
        </SignUpButton>

        {/* Trust */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          fontSize: 11.5, color: '#9ca3af',
          fontFamily: 'var(--font-dm,system-ui,sans-serif)',
        }}>
          <Lock size={11} strokeWidth={2} />
          Free forever · No card needed · Cancel anytime
        </div>
      </div>
    </div>
  )
}
