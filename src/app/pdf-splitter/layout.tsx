import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Split PDF Online Free — Separate PDF Files by Range',
  description: 'Split a PDF into multiple files online for free. Separate every page or divide one PDF into custom page ranges directly in your browser.',
  keywords: 'split PDF, split PDF online free, PDF splitter, divide PDF into multiple files, separate PDF pages by range',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-splitter' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Split PDF Online Free — Separate Files by Range',
    description: 'Split a PDF into separate files by custom page range or divide every page. Free, no signup needed.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-splitter',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-splitter.png', width: 1200, height: 630, alt: 'Split PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Online Free',
    description: 'Split any PDF into multiple files by page range. Free, instant and no signup.',
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
  description: 'Split a PDF into multiple files online by custom page range or separate every page.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
