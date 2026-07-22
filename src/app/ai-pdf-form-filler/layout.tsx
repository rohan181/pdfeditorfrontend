import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI PDF Form Filler — Autofill Any PDF Form Free Online',
  description:
    'Autofill W-9s, job applications, tax forms and other PDFs with AI. Paste details once, review every field, then sign and download. Five free uses daily.',
  keywords:
    'AI PDF form filler, autofill PDF forms, fill PDF forms online free, PDF form autofill, AI form filling, fill W-9 online, fill PDF job application, fill tax form PDF, PDF filler no Adobe, auto fill PDF forms AI',
  alternates: { canonical: 'https://www.editpdfai.com/ai-pdf-form-filler' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'AI PDF Form Filler — Autofill Any PDF Form Free Online',
    description:
      'Autofill PDF forms with AI, review every field, add a signature and download. A free account includes five AI uses daily.',
    type: 'website',
    url: 'https://www.editpdfai.com/ai-pdf-form-filler',
    siteName: 'EditPDF AI',
    images: [
      {
        url: '/social/ai-pdf-form-filler.png',
        width: 1200,
        height: 630,
        alt: 'AI PDF Form Filler — Autofill Any PDF Form Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI PDF Form Filler — Autofill Any PDF Form Free Online',
    description:
      'Autofill PDF forms with AI, review every field, sign and download. A free account includes five AI uses daily.',
    images: ['/social/ai-pdf-form-filler.png'],
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
      acceptedAnswer: { '@type': 'Answer', text: 'A free account is required to use AI features. Sign in to get 5 free AI uses per day — no credit card needed. Upgrade to Pro for unlimited use. Your PDF is always processed in your browser and never stored.' },
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
    {
      '@type': 'Question',
      name: 'Can it fill a W-9, 1099, or tax form automatically?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. W-9, 1099, and other IRS tax forms are standard PDFs that the AI handles well. Paste your name, EIN/SSN, address, and tax classification once and the AI fills every matching field. Download the completed form and sign.' },
    },
    {
      '@type': 'Question',
      name: 'How do I fill a PDF form online without Adobe Acrobat?',
      acceptedAnswer: { '@type': 'Answer', text: 'Upload your PDF to EditPDF AI, use the AI form filler to auto-detect and fill all fields, add a signature if needed, then download. No Adobe Acrobat subscription or desktop software required — everything runs free in your browser.' },
    },
    {
      '@type': 'Question',
      name: "What's the difference between a fillable and a non-fillable PDF?",
      acceptedAnswer: { '@type': 'Answer', text: 'A fillable PDF (AcroForm) has interactive fields you can click and type into. A non-fillable or flat PDF is an image or static layout with no interactive fields. Our AI handles both: AcroForms are filled natively, and flat PDFs are filled using text overlays positioned by AI over the detected form areas.' },
    },
    {
      '@type': 'Question',
      name: 'Can it fill a scanned PDF form?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. For scanned paper forms that have been saved as image-based PDFs, the built-in OCR engine first extracts the layout and field positions. AI then fills the detected fields using text overlays. The result is a completed PDF that looks identical to a manually filled paper form.' },
    },
  ],
}

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
