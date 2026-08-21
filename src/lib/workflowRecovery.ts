import type { ToolWorkflowState } from '@/lib/toolWorkflowState'

export const WORKFLOW_RECOVERY_EVENT = 'editpdfai:workflow-recovery'
export const WORKFLOW_RECOVERY_DISMISS_EVENT = 'editpdfai:workflow-recovery-dismiss'

export type RecoverableWorkflowState = Extract<
  ToolWorkflowState,
  'network-failure' | 'ai-service-failure'
>

export interface WorkflowRecoveryDetail {
  id: string
  state: RecoverableWorkflowState
  retry: () => Promise<boolean>
  cancel: () => void
}
