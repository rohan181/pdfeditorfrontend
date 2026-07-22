import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crop PDF Pages Online Free — Trim PDF Margins',
  description: 'Crop PDF pages online for free. Trim margins, remove whitespace or crop to a specific area. Works on single pages or the entire document. No install needed.',
  keywords: 'crop PDF, trim PDF margins, crop PDF pages online, PDF cropper, remove white border PDF, crop PDF free',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-cropper' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Crop PDF Pages Online Free — Trim PDF Margins',
    description: 'Trim margins and crop any PDF page online. Free, no signup, works instantly in your browser.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-cropper',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-cropper.png', width: 1200, height: 630, alt: 'Crop PDF Pages Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crop PDF Pages Online Free',
    description: 'Trim margins and crop any PDF page instantly. Free, no signup needed.',
    images: ['/social/pdf-cropper.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Cropper',
  url: 'https://www.editpdfai.com/pdf-cropper',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Crop PDF pages online for free. Trim margins, remove whitespace or crop to a specific area.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
