import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Page Manager — Reorder, Delete & Add PDF Pages Online',
  description: 'Manage PDF pages online for free. Drag to reorder, delete unwanted pages, add blank pages and rotate individual pages. No software install required.',
  keywords: 'PDF page manager, reorder PDF pages, delete PDF pages, add page to PDF, rearrange PDF pages, PDF page organizer',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-page-manager' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF Page Manager — Reorder, Delete & Add PDF Pages Online',
    description: 'Drag to reorder, delete or add pages to any PDF. Free, works instantly in your browser.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-page-manager',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF Page Manager Online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Page Manager Online',
    description: 'Reorder, delete or add pages to any PDF instantly. Free, no signup needed.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Page Manager',
  url: 'https://www.editpdfai.com/pdf-page-manager',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Manage PDF pages online for free. Drag to reorder, delete unwanted pages, add blank pages and rotate individual pages.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
