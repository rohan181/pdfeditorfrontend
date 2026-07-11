import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to Word Converter Online Free — PDF to DOCX',
  description: 'Convert PDF to editable Word documents online for free. Get a DOCX file that preserves text, tables and layout. Fast, accurate AI conversion. No signup needed.',
  keywords: 'PDF to Word, PDF to DOCX, convert PDF to Word online free, PDF to DOC, PDF to editable Word, PDF converter',
  alternates: { canonical: 'https://editpdfai.com/pdf-to-word' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF to Word Converter Online Free — PDF to DOCX',
    description: 'Convert any PDF to an editable Word DOCX file. Preserves text, tables and layout. Free, no signup.',
    type: 'website',
    url: 'https://editpdfai.com/pdf-to-word',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF to Word Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Word Converter Online Free',
    description: 'Convert PDF to editable Word DOCX instantly. Preserves layout. Free, no signup.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF to Word Converter',
  url: 'https://editpdfai.com/pdf-to-word',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PDF to editable Word documents online for free. Preserves text, tables and layout.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
