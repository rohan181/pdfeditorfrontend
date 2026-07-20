import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI PDF Translator Online Free — Translate PDF to Any Language',
  description: 'Translate PDF documents to 50+ languages with AI. Preserve the original layout and formatting. Translate contracts, reports and forms in seconds. Free online.',
  keywords: 'PDF translator, translate PDF online, PDF translation AI, translate PDF to English, PDF to Spanish, AI document translator, translate PDF free',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-translator' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI PDF Translator Online Free — Translate PDF to Any Language',
    description: 'Translate any PDF to 50+ languages with AI while preserving the original layout. Free online.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-translator',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'AI PDF Translator Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI PDF Translator Online Free',
    description: 'Translate any PDF to 50+ languages with AI. Preserves layout and formatting. Free online.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI PDF Translator',
  url: 'https://www.editpdfai.com/pdf-translator',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Translate PDF documents to 50+ languages with AI. Preserve the original layout and formatting.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
