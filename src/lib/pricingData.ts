import { FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'
import {
  AI_CONVERSION_ACCESS_SUMMARY,
  AI_USE_DEFINITION,
  PRO_BILLING_SUMMARY,
  PRO_CANCELLATION_SUMMARY,
  PRO_REFUND_SUMMARY,
} from '@/lib/pricing'

export const PRICING_FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: PRO_CANCELLATION_SUMMARY,
  },
  {
    q: 'What counts as an AI use?',
    a: AI_USE_DEFINITION,
  },
  {
    q: 'Do I need an account to use the free tools?',
    a: `Core browser workflows require no account. AI-assisted actions require a free account, which includes ${FREE_AI_DAILY_LIMIT} metered actions per UTC day without a credit card.`,
  },
  {
    q: 'Which conversions require Pro?',
    a: AI_CONVERSION_ACCESS_SUMMARY,
  },
  {
    q: 'How is Pro billed, and what is the refund policy?',
    a: `${PRO_BILLING_SUMMARY} ${PRO_REFUND_SUMMARY}`,
  },
  {
    q: 'What payment methods are accepted?',
    a: 'The checkout uses Stripe Payment Element. Card fields are handled by Stripe; EditPDF AI stores subscription and Stripe customer identifiers rather than card numbers.',
  },
]
