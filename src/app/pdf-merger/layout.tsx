import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merge PDF Files Online Free — Combine PDFs in One Click',
  description: 'Merge multiple PDF files into one document online for free. Drag, reorder and combine any number of PDFs. Fast, secure and no signup required.',
  keywords: 'merge PDF, combine PDF, join PDF files, merge PDF online free, PDF merger, combine PDF files',
  alternates: { canonical: 'https://editpdfai.com/pdf-merger' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Merge PDF Files Online Free — Combine PDFs in One Click',
    description: 'Drag and drop PDFs to merge them into a single document. Free, no signup, works in your browser.',
    type: 'website',
    url: 'https://editpdfai.com/pdf-merger',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Merge PDF Files Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Files Online Free',
    description: 'Combine multiple PDFs into one document instantly. No signup required.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Merger',
  url: 'https://editpdfai.com/pdf-merger',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Merge multiple PDF files into one document online for free. Drag, reorder and combine any number of PDFs.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
