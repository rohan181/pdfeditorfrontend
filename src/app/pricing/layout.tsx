import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['pricing'])

const pricingSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'EditPDF AI Pro',
    description: 'Unlimited access to EditPDF AI tools, OCR, translation, summaries, mind maps and AI form filling.',
    brand: { '@type': 'Brand', name: 'EditPDF AI' },
    offers: [
      { '@type': 'Offer', name: 'Monthly plan', price: '1.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.editpdfai.com/pricing' },
      { '@type': 'Offer', name: 'Annual plan', price: '9.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.editpdfai.com/pricing' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ['Can I cancel anytime?', 'Yes. Cancel from your account settings at any time. Pro access continues until the end of the billing period.'],
      ['What counts as an AI use?', 'One AI use is one AI-powered action. Non-AI PDF tools are always unlimited.'],
      ['Do I need an account to use the free tools?', 'Core PDF tools require no account. AI tools require a free account with five AI uses per day.'],
      ['What payment methods are accepted?', 'All major credit and debit cards are accepted securely through Stripe.'],
    ].map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })),
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {pricingSchema.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      {children}
    </>
  )
}
