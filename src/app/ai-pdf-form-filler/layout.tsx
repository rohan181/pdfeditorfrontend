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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
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
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is an AI PDF form filler?', acceptedAnswer: { '@type': 'Answer', text: 'An AI PDF form filler detects input fields in a PDF and fills them automatically based on context you provide. Instead of clicking each field manually, you describe your details once and AI populates the entire form instantly.' } },
    { '@type': 'Question', name: 'Is it completely free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — 100% free with no hidden fees, no subscription and no credit card required. Open your PDF and start editing immediately.' } },
    { '@type': 'Question', name: 'Do I need to create an account or sign up?', acceptedAnswer: { '@type': 'Answer', text: 'No account needed. Your browser handles everything locally — your documents never leave your device unless you trigger an AI feature.' } },
    { '@type': 'Question', name: 'What types of PDFs are supported?', acceptedAnswer: { '@type': 'Answer', text: 'Both interactive PDF forms (AcroForms) and flat or scanned PDFs are supported. For scanned documents, the built-in OCR engine detects field positions automatically.' } },
    { '@type': 'Question', name: 'Is my document data secure?', acceptedAnswer: { '@type': 'Answer', text: 'Your files are processed entirely in your browser and are never stored on our servers. AI features send only the relevant text context and no data is retained after the request.' } },
    { '@type': 'Question', name: 'Can I add a digital signature to my PDF?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Draw a freehand signature, type your name in a handwriting style, or upload a signature image and place it anywhere on the document.' } },
  ],
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      {children}
    </>
  )
}
