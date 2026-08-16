import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['ai-pdf-form-filler'])

// FAQPage schema for this page is generated inline in page.tsx (from the
// same `FAQS` array that renders the visible FAQ section — single source of
// truth, can't drift out of sync). Not re-declared here.

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/ai-pdf-form-filler#webapp',
  name: 'AI PDF Form Filler',
  url: 'https://www.editpdfai.com/ai-pdf-form-filler',
  image: 'https://www.editpdfai.com/social/ai-pdf-form-filler.png',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      url: 'https://www.editpdfai.com/ai-pdf-form-filler',
      description: 'Five AI uses per day with a free account.',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '1',
      priceCurrency: 'USD',
      url: 'https://www.editpdfai.com/pricing',
      description: 'Unlimited AI uses with the Pro plan.',
    },
  ],
  provider: {
    '@type': 'Organization',
    '@id': 'https://www.editpdfai.com/#organization',
    name: 'EditPDF AI',
    url: 'https://www.editpdfai.com',
  },
  description: 'Autofill PDF forms with AI, review detected fields, add a signature, and download the completed document. A free account includes five AI uses per day.',
  featureList: ['AI form filling', 'E-signatures', 'PDF annotation', 'PDF OCR', 'Field auto-detection', 'Page management'],
  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
  inLanguage: 'en',
}

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'AI PDF Form Filler', item: 'https://www.editpdfai.com/ai-pdf-form-filler' },
  ],
}

const jsonLdHowTo = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': 'https://www.editpdfai.com/ai-pdf-form-filler#how-to',
  name: 'How to fill a PDF form online with AI',
  description: 'Upload a PDF form, provide your details, review the AI-filled fields, add a signature and download the completed PDF.',
  totalTime: 'PT2M',
  tool: [
    { '@type': 'HowToTool', name: 'EditPDF AI Form Filler' },
    { '@type': 'HowToTool', name: 'A web browser' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload your PDF',
      text: 'Choose an interactive, flat or scanned PDF form. The document loads in your browser.',
      url: 'https://www.editpdfai.com/ai-pdf-form-filler#how',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Describe your details',
      text: 'Enter your information in plain language. AI matches the information to the corresponding form fields.',
      url: 'https://www.editpdfai.com/ai-pdf-form-filler#how',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Review, sign and download',
      text: 'Review every filled field, correct anything necessary, add your signature and export the completed PDF.',
      url: 'https://www.editpdfai.com/ai-pdf-form-filler#how',
    },
  ],
}

const jsonLdWebPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.editpdfai.com/ai-pdf-form-filler#webpage',
  url: 'https://www.editpdfai.com/ai-pdf-form-filler',
  name: 'AI PDF Form Filler — Autofill PDF Forms Online',
  description: 'Autofill interactive, flat and scanned PDF forms with AI, review each field, sign and download.',
  inLanguage: 'en',
  isPartOf: { '@id': 'https://www.editpdfai.com/#website' },
  about: { '@id': 'https://www.editpdfai.com/ai-pdf-form-filler#webapp' },
  mainEntity: { '@id': 'https://www.editpdfai.com/ai-pdf-form-filler#webapp' },
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      {children}
    </>
  )
}
