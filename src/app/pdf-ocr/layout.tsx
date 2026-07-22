import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF OCR Online Free — Extract Text from Scanned PDF',
  description: 'Convert scanned PDFs and images to searchable, editable text with AI OCR. Supports 100+ languages. Fast, accurate and free online — no install required.',
  keywords: 'PDF OCR, OCR PDF online free, extract text from PDF, scanned PDF to text, OCR PDF, PDF text extraction, convert scanned PDF',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-ocr' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF OCR Online Free — Extract Text from Scanned PDF',
    description: 'Convert scanned PDFs to searchable text with AI OCR. Supports 100+ languages. Free, no install.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-ocr',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF OCR — Extract Text from Scanned PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF OCR Online Free',
    description: 'Convert scanned PDFs to searchable editable text with AI OCR. Free, no install.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF OCR',
  url: 'https://www.editpdfai.com/pdf-ocr',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert scanned PDFs and images to searchable, editable text with AI OCR. Supports 100+ languages.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
