export type ToolWorkflowState =
  | 'empty'
  | 'drag-over'
  | 'file-selected'
  | 'uploading'
  | 'processing'
  | 'success'
  | 'unsupported-file'
  | 'oversized-file'
  | 'password-protected'
  | 'corrupted-pdf'
  | 'network-failure'
  | 'ai-service-failure'
  | 'usage-limit-reached'
  | 'authentication-required'
  | 'payment-required'
  | 'cancelled'
  | 'retry'

export type ToolWorkflowTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'pro'

export interface ToolWorkflowStateContent {
  heading: string
  message: string
  nextAction: string
  tone: ToolWorkflowTone
  assertive?: boolean
}

export const TOOL_WORKFLOW_STATES: Record<ToolWorkflowState, ToolWorkflowStateContent> = {
  empty: {
    heading: 'Choose a file to begin',
    message: 'Select a supported file from this device or drop it into the upload area.',
    nextAction: 'Choose file',
    tone: 'neutral',
  },
  'drag-over': {
    heading: 'Release to add this file',
    message: 'Drop the file here and it will be checked before any processing begins.',
    nextAction: 'Add file',
    tone: 'info',
  },
  'file-selected': {
    heading: 'File ready',
    message: 'The file passed the available browser checks. Review the options, then start processing.',
    nextAction: 'Continue',
    tone: 'success',
  },
  uploading: {
    heading: 'Sending required content',
    message: 'Keep this tab open while the content required for this action is sent securely.',
    nextAction: 'Cancel upload',
    tone: 'info',
  },
  processing: {
    heading: 'Processing your document',
    message: 'Keep this tab open. You can cancel without changing the original file.',
    nextAction: 'Cancel processing',
    tone: 'info',
  },
  success: {
    heading: 'Your result is ready',
    message: 'Preview the result if available, then download a new copy to this device.',
    nextAction: 'Download result',
    tone: 'success',
  },
  'unsupported-file': {
    heading: 'This file type is not supported',
    message: 'The selected file does not match the formats accepted by this tool.',
    nextAction: 'Choose another file',
    tone: 'error',
    assertive: true,
  },
  'oversized-file': {
    heading: 'This file is too large',
    message: 'The selected file is larger than this tool can accept in one task.',
    nextAction: 'Choose a smaller file',
    tone: 'error',
    assertive: true,
  },
  'password-protected': {
    heading: 'Unlock this PDF first',
    message: 'This PDF requires a password. Use the known password to create an unlocked copy, then return here.',
    nextAction: 'Open Unlock PDF',
    tone: 'warning',
    assertive: true,
  },
  'corrupted-pdf': {
    heading: 'This PDF could not be read',
    message: 'The file appears damaged or incomplete. Keep the original and try creating a repaired copy.',
    nextAction: 'Open Repair PDF',
    tone: 'error',
    assertive: true,
  },
  'network-failure': {
    heading: 'The connection was interrupted',
    message: 'Your selected file and settings are still here. Check the connection and retry this request.',
    nextAction: 'Retry',
    tone: 'error',
    assertive: true,
  },
  'ai-service-failure': {
    heading: 'AI could not complete this request',
    message: 'The AI service is temporarily unavailable. Your selected file and settings remain in this tab.',
    nextAction: 'Retry AI action',
    tone: 'error',
    assertive: true,
  },
  'usage-limit-reached': {
    heading: 'Daily AI limit reached',
    message: 'No work was removed. Wait for the Free allowance to reset or review Pro access.',
    nextAction: 'View Pro options',
    tone: 'pro',
    assertive: true,
  },
  'authentication-required': {
    heading: 'Sign in to continue',
    message: 'This AI action requires an account. Your document and settings remain in this tab.',
    nextAction: 'Sign in',
    tone: 'warning',
    assertive: true,
  },
  'payment-required': {
    heading: 'Pro is required for this action',
    message: 'Your current document and settings are preserved. Review the plan before deciding whether to upgrade.',
    nextAction: 'View pricing',
    tone: 'pro',
    assertive: true,
  },
  cancelled: {
    heading: 'Processing cancelled',
    message: 'The original file was not changed. Your selected file and settings are ready if you want to retry.',
    nextAction: 'Retry',
    tone: 'warning',
  },
  retry: {
    heading: 'Ready to retry',
    message: 'Your selected file and settings have been preserved. Start the same action again when ready.',
    nextAction: 'Retry',
    tone: 'info',
  },
}

export function classifyToolWorkflowError(error: unknown, status?: number): ToolWorkflowState {
  if (status === 401) return 'authentication-required'
  if (status === 402 || status === 403) return 'payment-required'
  if (status === 429) return 'usage-limit-reached'
  if (status !== undefined && status >= 500) return 'ai-service-failure'

  const value = error instanceof Error ? error : new Error(String(error ?? ''))
  const message = value.message.toLowerCase()

  if (value.name === 'AbortError' || /cancelled|canceled|aborted/.test(message)) return 'cancelled'
  if (/password|encrypted|encryption/.test(message)) return 'password-protected'
  if (/too large|oversized|file size|exceeds?.*(limit|maximum)|maximum.*size/.test(message)) return 'oversized-file'
  if (/unsupported|file type|format|pdf files? only|upload a pdf/.test(message)) return 'unsupported-file'
  if (/corrupt|damaged|malformed|invalid.*pdf|pdf.*invalid|could not read|failed to parse|missing pdf|empty pdf|pdf file is empty|unexpected end/.test(message)) return 'corrupted-pdf'
  if (/failed to fetch|network|offline|connection|load failed|internet connection/.test(message)) return 'network-failure'
  if (/\bai\b|model|service unavailable|server error|temporarily unavailable/.test(message)) return 'ai-service-failure'
  return 'retry'
}

export function safeWorkflowErrorDetail(error: unknown) {
  if (!(error instanceof Error)) return ''
  const message = error.message.trim()
  if (!message || /stack|trace|webpack|node_modules|^error\b|api[_ -]?key|anthropic|claude|supabase|stripe|internal server|fake worker|dynamically imported|invalid ai response|parse json/i.test(message)) return ''
  return message.length > 180 ? `${message.slice(0, 177)}…` : message
}
