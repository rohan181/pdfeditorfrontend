import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI PDF Translator — Translate PDFs Online',
  description: 'Translate PDF documents into 77 languages with AI. Translate contracts, reports and forms in seconds, then download the result online.',
  keywords: 'PDF translator, translate PDF online, PDF translation AI, translate PDF to English, PDF to Spanish, AI document translator, translate PDF free',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-translator' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI PDF Translator Online Free — Translate PDF to Any Language',
    description: 'Translate any PDF into 77 languages with AI. Translate documents online and download the result.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-translator',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-translator.png', width: 1200, height: 630, alt: 'AI PDF Translator Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI PDF Translator Online Free',
    description: 'Translate any PDF into 77 languages with AI and download the result online.',
    images: ['/social/pdf-translator.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI PDF Translator',
  url: 'https://www.editpdfai.com/pdf-translator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Translate PDF documents into 77 languages with AI and download the result online.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
