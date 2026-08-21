'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  CircleStop,
  CloudOff,
  CreditCard,
  FileCheck2,
  FileLock2,
  FileQuestion,
  FileUp,
  LoaderCircle,
  LogIn,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import {
  TOOL_WORKFLOW_STATES,
  type ToolWorkflowState,
} from '@/lib/toolWorkflowState'

interface AccurateProgress {
  value: number
  max?: number
  label: string
}

interface ToolWorkflowStatusProps {
  state: ToolWorkflowState
  heading?: string
  message?: string
  detail?: string
  preserveMessage?: string
  progress?: AccurateProgress
  primaryLabel?: string
  secondaryLabel?: string
  cancelLabel?: string
  onPrimary?: () => void | Promise<void>
  onSecondary?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
  compact?: boolean
  className?: string
  headingId?: string
}

const ICONS = {
  empty: FileUp,
  'drag-over': FileUp,
  'file-selected': FileCheck2,
  uploading: LoaderCircle,
  processing: LoaderCircle,
  success: CheckCircle2,
  'unsupported-file': FileQuestion,
  'oversized-file': ShieldAlert,
  'password-protected': FileLock2,
  'corrupted-pdf': AlertTriangle,
  'network-failure': CloudOff,
  'ai-service-failure': Sparkles,
  'usage-limit-reached': Sparkles,
  'authentication-required': LogIn,
  'payment-required': CreditCard,
  cancelled: CircleStop,
  retry: RefreshCcw,
} satisfies Record<ToolWorkflowState, typeof FileUp>

const ERROR_STATES = new Set<ToolWorkflowState>([
  'unsupported-file',
  'oversized-file',
  'password-protected',
  'corrupted-pdf',
  'network-failure',
  'ai-service-failure',
  'usage-limit-reached',
  'authentication-required',
  'payment-required',
])

export default function ToolWorkflowStatus({
  state,
  heading,
  message,
  detail,
  preserveMessage,
  progress,
  primaryLabel,
  secondaryLabel,
  cancelLabel,
  onPrimary,
  onSecondary,
  onCancel,
  compact = false,
  className = '',
  headingId,
}: ToolWorkflowStatusProps) {
  const content = TOOL_WORKFLOW_STATES[state]
  const Icon = ICONS[state]
  const [activeAction, setActiveAction] = useState<'primary' | 'secondary' | 'cancel' | null>(null)
  const [downloadStarted, setDownloadStarted] = useState(false)
  const downloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isBusyState = state === 'uploading' || state === 'processing'

  useEffect(() => () => {
    if (downloadTimer.current) clearTimeout(downloadTimer.current)
  }, [])

  useEffect(() => {
    setActiveAction(null)
    setDownloadStarted(false)
  }, [state])

  const accurateProgress = useMemo(() => {
    if (!progress || !Number.isFinite(progress.value)) return null
    const max = Number.isFinite(progress.max) && (progress.max ?? 0) > 0 ? progress.max! : 100
    return { value: Math.max(0, Math.min(progress.value, max)), max, label: progress.label }
  }, [progress])

  const runAction = async (
    kind: 'primary' | 'secondary' | 'cancel',
    action?: () => void | Promise<void>,
    label?: string,
  ) => {
    if (!action || activeAction || downloadStarted) return
    const isDownload = /download/i.test(label ?? '')
    setActiveAction(kind)
    try {
      await action()
      if (isDownload) {
        setDownloadStarted(true)
        downloadTimer.current = setTimeout(() => setDownloadStarted(false), 1800)
      }
    } catch {
      // The parent workflow remains responsible for rendering its classified
      // recovery state. Never surface an unhandled rejection or stack trace.
    } finally {
      setActiveAction(null)
    }
  }

  const resolvedPrimaryLabel = primaryLabel ?? content.nextAction
  const primaryIsDownload = /download/i.test(resolvedPrimaryLabel)
  const rootRole = ERROR_STATES.has(state) ? 'alert' : 'status'

  return (
    <section
      className={`tool-workflow-status tone-${content.tone}${compact ? ' is-compact' : ''}${className ? ` ${className}` : ''}`}
      data-workflow-state={state}
      role={rootRole}
      aria-live={content.assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-busy={isBusyState || Boolean(activeAction) || undefined}
    >
      <div className="tool-workflow-status-icon" aria-hidden="true">
        <Icon size={compact ? 18 : 22} className={isBusyState ? 'is-active' : ''} />
      </div>
      <div className="tool-workflow-status-body">
        <h3 id={headingId}>{heading ?? content.heading}</h3>
        <p>{message ?? content.message}</p>
        {detail && <p className="tool-workflow-status-detail">{detail}</p>}
        {preserveMessage && (
          <p className="tool-workflow-status-preserve"><FileCheck2 size={14} aria-hidden="true" /> {preserveMessage}</p>
        )}

        {accurateProgress ? (
          <div className="tool-workflow-status-progress">
            <div><span>{accurateProgress.label}</span><strong>{Math.round((accurateProgress.value / accurateProgress.max) * 100)}%</strong></div>
            <progress value={accurateProgress.value} max={accurateProgress.max}>{accurateProgress.value}</progress>
          </div>
        ) : (state === 'uploading' || state === 'processing') ? (
          <p className="tool-workflow-status-unknown-progress">A reliable percentage is not available for this step.</p>
        ) : null}

        {(onPrimary || onSecondary || onCancel) && (
          <div className="tool-workflow-status-actions">
            {onPrimary && (
              <button
                type="button"
                className={`tool-workflow-status-primary${primaryIsDownload ? ' dl-btn' : ''}`}
                disabled={Boolean(activeAction || downloadStarted)}
                onClick={() => void runAction('primary', onPrimary, resolvedPrimaryLabel)}
              >
                {downloadStarted ? 'Download started' : activeAction === 'primary' ? 'Working…' : resolvedPrimaryLabel}
              </button>
            )}
            {onSecondary && (
              <button
                type="button"
                className="tool-workflow-status-secondary"
                disabled={Boolean(activeAction)}
                onClick={() => void runAction('secondary', onSecondary, secondaryLabel)}
              >
                {activeAction === 'secondary' ? 'Working…' : secondaryLabel}
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                className="tool-workflow-status-cancel"
                disabled={Boolean(activeAction)}
                onClick={() => void runAction('cancel', onCancel, cancelLabel)}
              >
                {activeAction === 'cancel' ? 'Cancelling…' : cancelLabel ?? 'Cancel'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
