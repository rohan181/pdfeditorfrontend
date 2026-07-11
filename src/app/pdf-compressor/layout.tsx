import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress PDF Online Free — Reduce PDF File Size',
  description: 'Compress PDF files online for free. Reduce PDF size without losing quality. Shrink large PDFs for email, upload, or sharing in seconds.',
  keywords: 'compress PDF, reduce PDF size, shrink PDF, PDF compressor, compress PDF online free, reduce PDF file size',
  alternates: { canonical: 'https://editpdfai.com/pdf-compressor' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Compress PDF Online Free — Reduce PDF File Size',
    description: 'Reduce PDF file size without losing quality. Free, instant, no signup required.',
    type: 'website',
    url: 'https://editpdfai.com/pdf-compressor',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Compress PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF Online Free',
    description: 'Shrink any PDF file instantly without losing quality.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Compressor',
  url: 'https://editpdfai.com/pdf-compressor',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Compress PDF files online for free. Reduce PDF size without losing quality.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
