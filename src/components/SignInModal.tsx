'use client'
import { useEffect, useRef, useState } from 'react'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { X, Lock } from 'lucide-react'
import { FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'
import ToolWorkflowStatus from '@/components/ToolWorkflowStatus'
import { useModalFocusTrap } from '@/hooks/useModalFocusTrap'

export default function SignInModal() {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('signin-needed', show)
    return () => window.removeEventListener('signin-needed', show)
  }, [])

  useModalFocusTrap(open, dialogRef, () => setOpen(false), closeButtonRef)

  if (!open) return null

  const close = () => setOpen(false)

  return (
    <div
      className="mobile-modal-backdrop"
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.52)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        ref={dialogRef}
        className="mobile-modal-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-in-modal-title"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 24, padding: '40px 36px',
          maxWidth: 420, width: '100%', textAlign: 'center', position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06)',
        }}
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 44, height: 44, borderRadius: '50%',
            background: '#f3f4f6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9ca3af',
          }}
        >
          <X size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <ToolWorkflowStatus
          state="authentication-required"
          heading="Sign in to use AI tools"
          headingId="sign-in-modal-title"
          message={`A signed-in free account includes ${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day. No credit card is required.`}
          preserveMessage="Your selected document and settings remain in this tab."
        />

        <div style={{ height: 18 }} aria-hidden="true" />

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
          <Lock size={11} strokeWidth={2} aria-hidden="true" />
          Free account · No card needed · {FREE_AI_DAILY_LIMIT} AI actions per UTC day
        </div>
      </div>
    </div>
  )
}
