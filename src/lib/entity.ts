export const SUPPORT_EMAIL = 'support@editpdfai.com'

export const TRUSTPILOT_PROFILE_URL =
  'https://www.trustpilot.com/review/editpdfai.com'

export const LEGAL_LAST_UPDATED_ISO = '2026-08-20'
export const LEGAL_LAST_UPDATED_LABEL = 'August 20, 2026'

export const PUBLIC_OPERATOR_DISCLOSURE =
  'EditPDF AI is the public product name. The website does not currently publish a verified legal operator name, business registration, office address, or team location.'

export function supportMailto(subject?: string) {
  return subject
    ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${SUPPORT_EMAIL}`
}
