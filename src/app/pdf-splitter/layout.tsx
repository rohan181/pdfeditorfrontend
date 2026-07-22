import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Split PDF Online Free — Extract Pages from PDF',
  description: 'Split a PDF into multiple files online for free. Extract specific pages, split by range, or separate every page. No install, works in your browser.',
  keywords: 'split PDF, split PDF online free, extract pages from PDF, PDF splitter, divide PDF, separate PDF pages',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-splitter' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Split PDF Online Free — Extract Pages from PDF',
    description: 'Split any PDF by page range or extract individual pages. Free, no signup needed.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-splitter',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-splitter.png', width: 1200, height: 630, alt: 'Split PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Online Free',
    description: 'Extract pages or split any PDF into multiple files. Free, instant, no signup.',
    images: ['/social/pdf-splitter.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Splitter',
  url: 'https://www.editpdfai.com/pdf-splitter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Split a PDF into multiple files online for free. Extract specific pages, split by range, or separate every page.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
