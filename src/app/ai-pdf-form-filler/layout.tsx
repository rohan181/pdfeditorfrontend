import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI PDF Form Filler — Fill & Edit PDF Forms Online Free',
  description:
    'Fill PDF forms instantly with AI. Auto-detect fields, type text, add signatures, and download — no registration required. The fastest AI PDF form filler online.',
  keywords:
    'AI PDF form filler, fill PDF forms online, PDF form auto-fill, edit PDF free, PDF form filler AI, fill PDF online, sign PDF forms, PDF editor free',
  alternates: { canonical: 'https://editpdfai.com/ai-pdf-form-filler' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI PDF Form Filler — Fill & Edit PDF Forms Online Free',
    description:
      'Fill PDF forms instantly with AI. Auto-detect fields, type text, add signatures, and download — no registration required.',
    type: 'website',
    url: 'https://editpdfai.com/ai-pdf-form-filler',
    siteName: 'EditPDF AI',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AI PDF Form Filler — Fill & Edit PDF Forms Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI PDF Form Filler — Fill & Edit PDF Forms Online Free',
    description:
      'Fill PDF forms instantly with AI. Auto-detect fields, type text, add signatures, and download — no registration required.',
    images: ['/opengraph-image'],
  },
}

// FAQ questions & answers must EXACTLY match the visible FAQS array in page.tsx
const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an AI PDF form filler?',
      acceptedAnswer: { '@type': 'Answer', text: 'An AI PDF form filler detects input fields in a PDF and fills them automatically based on context you provide. You describe your details once and AI populates the entire form instantly — no clicking each field manually.' },
    },
    {
      '@type': 'Question',
      name: 'Is it free to use?',
      acceptedAnswer: { '@type': 'Answer', text: 'Free to start — includes 5 AI uses per day. Core PDF tools (edit, sign, merge, compress) are always free with no limits. Upgrade to Pro for unlimited AI uses.' },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account?',
      acceptedAnswer: { '@type': 'Answer', text: 'No account needed. Your browser handles everything locally — documents never leave your device unless you trigger an AI feature, which only sends the relevant text context.' },
    },
    {
      '@type': 'Question',
      name: 'What types of PDFs are supported?',
      acceptedAnswer: { '@type': 'Answer', text: 'Both interactive PDF forms (AcroForms) and flat or scanned PDFs are supported. For scanned documents, the built-in OCR engine detects field positions automatically.' },
    },
    {
      '@type': 'Question',
      name: 'Is my document data secure?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your files are processed entirely in your browser and are never stored on our servers. AI features send only the relevant text context — never the raw file — and no data is retained.' },
    },
    {
      '@type': 'Question',
      name: 'Can I add a digital signature?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Draw a freehand signature, type your name, or upload a signature image. Place it anywhere with drag-and-drop precision.' },
    },
  ],
}

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI PDF Form Filler',
  url: 'https://editpdfai.com/ai-pdf-form-filler',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Fill PDF forms instantly with AI. Auto-detect fields, add text, draw signatures, and download — free, no registration.',
  featureList: 'AI Form Filling, E-Signatures, PDF Annotation, PDF OCR, Field Auto-Detection, Page Management',
  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1247',
    bestRating: '5',
    worstRating: '1',
  },
}

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'AI PDF Form Filler', item: 'https://editpdfai.com/ai-pdf-form-filler' },
  ],
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  )
}
