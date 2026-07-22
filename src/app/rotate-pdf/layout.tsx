import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rotate PDF Online Free — Rotate Pages in Seconds',
  description: 'Rotate PDF pages online for free. Rotate a single page, all pages, or a custom range — 90°, 180° or 270°. Works in your browser, no install needed.',
  keywords: 'rotate PDF, rotate PDF pages online, turn PDF, flip PDF, rotate PDF free, rotate PDF 90 degrees',
  alternates: { canonical: 'https://www.editpdfai.com/rotate-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Rotate PDF Online Free — Rotate Pages in Seconds',
    description: 'Rotate any PDF page 90°, 180° or 270°. Works instantly in your browser — no install, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/rotate-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/rotate-pdf.png', width: 1200, height: 630, alt: 'Rotate PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotate PDF Online Free',
    description: 'Rotate any PDF page 90°, 180° or 270° instantly in your browser.',
    images: ['/social/rotate-pdf.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Rotate PDF',
  url: 'https://www.editpdfai.com/rotate-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Rotate PDF pages online for free. Rotate a single page, all pages, or a custom range — 90°, 180° or 270°.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
