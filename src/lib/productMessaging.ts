import { AI_TOOL_COUNT, CORE_TOOL_COUNT, TOOL_COUNT } from './toolMeta'

export const FREE_AI_DAILY_LIMIT = 5

export const PRODUCT_ACCESS_SUMMARY =
  `EditPDF AI has ${TOOL_COUNT} active tools. ${CORE_TOOL_COUNT} include browser-based core workflows that can be used without an account. Signed-in free accounts can use up to ${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day; Pro removes that daily cap. Tool-specific input and processing limits still apply.`

export const FREE_AI_ACCESS_LABEL =
  `Signed-in Free: up to ${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day`

export const PRO_AI_ACCESS_LABEL =
  'Pro: no daily AI-action cap; tool-specific limits still apply'

export const AI_ACCESS_SUMMARY =
  `${FREE_AI_ACCESS_LABEL}. ${PRO_AI_ACCESS_LABEL}.`

export const CORE_ACCESS_SUMMARY =
  'Core browser workflow: no account required; browser, device, and tool-specific limits apply.'

export const TOOL_CATALOGUE_SUMMARY =
  `${TOOL_COUNT} active tools · ${CORE_TOOL_COUNT} with core browser workflows · ${AI_TOOL_COUNT} with AI-assisted actions`

export const AI_ACCURACY_DISCLAIMER =
  'AI output can be inaccurate or incomplete. Review results against the source document before relying on them, especially for legal, medical, financial, or other high-stakes use.'

export const PROCESSING_PRIVACY_SUMMARY =
  'Core browser tools process selected files on your device. AI features may send extracted text, rendered page images, uploaded images, or a PDF to EditPDF AI server routes and configured processing providers when the feature requires it. The application does not write document content to its database or object storage.'

export const BROWSER_PROCESSING_SUMMARY =
  'Core editing and page tools identified as browser-based process the selected document on your device and do not send its contents through an EditPDF AI document-processing route. Some tools load required code, workers, or fonts from third-party content delivery networks.'

export const CONVERSION_PROCESSING_SUMMARY =
  'Conversion processing depends on the tool. Browser-based conversions rebuild the output on your device. AI-assisted PDF-to-Word, PDF-to-Excel, and PDF-to-PowerPoint actions send extracted text through an EditPDF AI server route to the configured AI provider.'

export const OCR_PROCESSING_SUMMARY =
  'PDF OCR opens and renders the source PDF in your browser. When a page needs OCR, the rendered page image is sent through an EditPDF AI server route to the configured AI provider; the application does not deliberately store the source PDF or OCR image in its database or object storage.'

export const AI_PROCESSING_SUMMARY =
  `AI tools send only the content required for the selected action, which can include extracted text, rendered page images, uploaded images, or a PDF, through EditPDF AI server routes to configured processing providers. ${AI_ACCURACY_DISCLAIMER}`
