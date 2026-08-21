'use client'

import { useEffect, useState } from 'react'
import ToolWorkflowStatus from '@/components/ToolWorkflowStatus'
import {
  WORKFLOW_RECOVERY_DISMISS_EVENT,
  WORKFLOW_RECOVERY_EVENT,
  type WorkflowRecoveryDetail,
} from '@/lib/workflowRecovery'

export default function WorkflowRecoveryNotice() {
  const [recovery, setRecovery] = useState<WorkflowRecoveryDetail | null>(null)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    const show = (event: Event) => {
      setRecovery((event as CustomEvent<WorkflowRecoveryDetail>).detail)
      setRetrying(false)
    }
    const dismiss = (event: Event) => {
      const id = (event as CustomEvent<string>).detail
      setRecovery(current => !id || current?.id === id ? null : current)
      setRetrying(false)
    }

    window.addEventListener(WORKFLOW_RECOVERY_EVENT, show)
    window.addEventListener(WORKFLOW_RECOVERY_DISMISS_EVENT, dismiss)
    return () => {
      window.removeEventListener(WORKFLOW_RECOVERY_EVENT, show)
      window.removeEventListener(WORKFLOW_RECOVERY_DISMISS_EVENT, dismiss)
    }
  }, [])

  if (!recovery) return null

  const retry = async () => {
    setRetrying(true)
    const recovered = await recovery.retry()
    if (recovered) setRecovery(null)
    else setRetrying(false)
  }

  const cancel = () => {
    recovery.cancel()
    setRecovery(null)
  }

  return (
    <aside className="workflow-recovery-notice" aria-label="Request recovery">
      <ToolWorkflowStatus
        state={retrying ? 'retry' : recovery.state}
        heading={retrying ? 'Retrying your request' : undefined}
        message={retrying
          ? 'Your file and settings are still here while EditPDF AI tries the same action again.'
          : undefined}
        preserveMessage="The selected file and current settings remain in this tab."
        primaryLabel={retrying ? undefined : recovery.state === 'ai-service-failure' ? 'Retry AI action' : 'Retry'}
        onPrimary={retrying ? undefined : retry}
        cancelLabel="Cancel request"
        onCancel={cancel}
      />
    </aside>
  )
}
