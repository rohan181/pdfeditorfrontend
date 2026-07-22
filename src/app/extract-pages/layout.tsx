import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Extract PDF Pages Online Free — Save Specific Pages as PDF',
  description: 'Extract specific pages from a PDF online for free. Save selected pages as a new PDF document. Works instantly in your browser — no install, no signup.',
  keywords: 'extract PDF pages, extract pages from PDF, save PDF pages, PDF page extractor, extract specific pages PDF online free',
  alternates: { canonical: 'https://www.editpdfai.com/extract-pages' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Extract PDF Pages Online Free — Save Specific Pages as PDF',
    description: 'Extract and save specific pages from any PDF as a new document. Free, instant, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/extract-pages',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/extract-pages.png', width: 1200, height: 630, alt: 'Extract PDF Pages Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract PDF Pages Online Free',
    description: 'Save specific pages from any PDF as a new document. Free, instant, no signup.',
    images: ['/social/extract-pages.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Extract PDF Pages',
  url: 'https://www.editpdfai.com/extract-pages',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Extract specific pages from a PDF online for free. Save selected pages as a new PDF document.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
