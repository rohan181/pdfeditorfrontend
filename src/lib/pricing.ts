import { FREE_AI_DAILY_LIMIT } from './productMessaging'

export const PRO_MONTHLY_PRICE_USD = 1
export const PRO_PRICE_DISPLAY = `US$${PRO_MONTHLY_PRICE_USD.toFixed(2)}`
export const PRO_BILLING_FREQUENCY = 'month'
export const PRO_BILLING_SUMMARY = `${PRO_PRICE_DISPLAY} billed monthly in USD as a recurring subscription.`

export const AI_USE_DEFINITION =
  'One AI use is counted when an AI-backed request is submitted to a metered EditPDF AI server route. Examples include a form-detection or form-fill request, summary, translation, mind map, quiz, AI-assisted conversion, or each PDF page sent for OCR. A workflow can use more than one action when it makes separate AI requests. Browser-only PDF operations do not count.'

export const AI_CONVERSION_ACCESS_SUMMARY =
  `No conversion currently requires Pro. PDF to Word, PDF to Excel, and PDF to PowerPoint require a signed-in account and use the shared ${FREE_AI_DAILY_LIMIT}-action Free allowance. Pro removes that daily cap; the same conversion input and processing limits still apply.`

export const PRO_CANCELLATION_SUMMARY =
  'Cancel from account settings at any time. Pro access continues through the current billing period, then the account returns to Free. Cancellation does not create a partial refund for unused time.'

export const PRO_REFUND_SUMMARY =
  'Refund requests are accepted within 7 days of the first subscription payment. Renewals are not refundable.'

export const PRO_AUTH_REQUIREMENT =
  'An EditPDF AI account and sign-in are required before checkout. No payment is taken until the subscription is confirmed.'
