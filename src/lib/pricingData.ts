import { FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'

export const PRICING_FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account settings at any time — your Pro access continues until the end of the billing period, then reverts to Free.',
  },
  {
    q: 'What counts as an AI use?',
    a: 'One AI use means one server-backed AI action, such as a form fill, summary, translation, OCR page scan, mind map, quiz, or AI-assisted conversion. Core browser operations are not counted, but remain subject to browser memory and tool-specific input limits.',
  },
  {
    q: 'Do I need an account to use the free tools?',
    a: `Core browser workflows require no account. AI-assisted actions require a free account, which includes ${FREE_AI_DAILY_LIMIT} metered actions per UTC day without a credit card.`,
  },
  {
    q: 'What payment methods are accepted?',
    a: 'The checkout uses Stripe Payment Element. Card fields are handled by Stripe; EditPDF AI stores subscription and Stripe customer identifiers rather than card numbers.',
  },
]
