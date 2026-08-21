'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AI_TOOL_COUNT } from '@/lib/toolMeta'
import { FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'
import ToolWorkflowStatus from '@/components/ToolWorkflowStatus'
import { useModalFocusTrap } from '@/hooks/useModalFocusTrap'

export default function UpgradeModal() {
  const [open, setOpen] = useState(false)
  const upgradeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('upgrade-needed', show)
    return () => window.removeEventListener('upgrade-needed', show)
  }, [])

  useModalFocusTrap(open, dialogRef, () => setOpen(false), upgradeButtonRef)

  if (!open) return null

  return (
    <div
      className="mobile-modal-backdrop"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={() => setOpen(false)}
    >
      <div
        ref={dialogRef}
        className="mobile-modal-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 20, padding: '36px 32px',
          maxWidth: 420, width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        <ToolWorkflowStatus
          state="usage-limit-reached"
          heading="Daily limit reached"
          headingId="upgrade-modal-title"
          message={`You have used the ${FREE_AI_DAILY_LIMIT} AI actions included with Free for this UTC day. Pro removes the daily AI-action cap; tool-specific limits still apply.`}
          preserveMessage="Your selected document and settings remain in this tab."
        />

        {/* Feature list */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 18px', marginTop: 18, marginBottom: 24, textAlign: 'left' }}>
          {['No daily AI-action cap', `AI actions across ${AI_TOOL_COUNT} tools`, 'Same documented tool limits', 'No daily quota reset required'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 13, color: '#374151' }}>
              <span style={{ color: '#0891b2', fontWeight: 700, fontSize: 15 }}>✓</span> {f}
            </div>
          ))}
        </div>

        <button
          ref={upgradeButtonRef}
          type="button"
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
          type="button"
          onClick={() => setOpen(false)}
          style={{
            width: '100%', padding: '11px 0', borderRadius: 12,
            background: 'transparent', color: '#9ca3af', border: '1.5px solid #e5e7eb',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Continue with Free tools
        </button>
      </div>
    </div>
  )
}
