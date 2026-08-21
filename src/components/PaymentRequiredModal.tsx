'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import ToolWorkflowStatus from '@/components/ToolWorkflowStatus'
import { useModalFocusTrap } from '@/hooks/useModalFocusTrap'

export default function PaymentRequiredModal() {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('payment-needed', show)
    return () => window.removeEventListener('payment-needed', show)
  }, [])

  useModalFocusTrap(open, dialogRef, () => setOpen(false), closeButtonRef)

  if (!open) return null

  const close = () => setOpen(false)

  return (
    <div className="mobile-modal-backdrop workflow-state-modal" onClick={close}>
      <div ref={dialogRef} className="mobile-modal-surface workflow-state-modal-surface" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" tabIndex={-1} onClick={event => event.stopPropagation()}>
        <button ref={closeButtonRef} type="button" className="workflow-state-modal-close" onClick={close} aria-label="Close payment required dialog">
          <X size={18} aria-hidden="true" />
        </button>
        <ToolWorkflowStatus
          state="payment-required"
          headingId="payment-modal-title"
          preserveMessage="No payment has been made and your current work remains in this tab."
        />
        <div className="workflow-state-modal-actions">
          <button type="button" className="ui-button ui-button--pro" onClick={() => { close(); router.push('/pricing') }}>
            View pricing
          </button>
          <button type="button" className="ui-button ui-button--secondary" onClick={close}>
            Keep using Free tools
          </button>
        </div>
      </div>
    </div>
  )
}
