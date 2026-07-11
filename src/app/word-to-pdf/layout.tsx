import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Word to PDF Converter Online Free — DOCX to PDF',
  description: 'Convert Word documents to PDF online for free. Upload DOCX or DOC files and get a perfect PDF instantly. Preserves fonts, formatting and images. No signup.',
  keywords: 'Word to PDF, DOCX to PDF, convert Word to PDF online free, DOC to PDF converter, Microsoft Word to PDF',
  alternates: { canonical: 'https://editpdfai.com/word-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Word to PDF Converter Online Free — DOCX to PDF',
    description: 'Convert Word DOCX and DOC files to PDF instantly. Preserves formatting. Free, no signup.',
    type: 'website',
    url: 'https://editpdfai.com/word-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Word to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word to PDF Converter Online Free',
    description: 'Convert Word to PDF instantly. Preserves fonts and formatting. Free, no signup.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Word to PDF Converter',
  url: 'https://editpdfai.com/word-to-pdf',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert Word documents to PDF online for free. Preserves fonts, formatting and images.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
