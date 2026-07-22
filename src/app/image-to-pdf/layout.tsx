import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to PDF Converter Online Free — JPG, PNG to PDF',
  description: 'Convert JPG, PNG, WebP and other images to PDF online for free. Combine multiple images into one PDF. Adjust size, orientation and margins. No signup needed.',
  keywords: 'image to PDF, JPG to PDF, PNG to PDF, convert image to PDF online free, photo to PDF, picture to PDF converter',
  alternates: { canonical: 'https://www.editpdfai.com/image-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Image to PDF Converter Online Free — JPG, PNG to PDF',
    description: 'Convert JPG, PNG and other images to PDF online for free. Combine multiple images into one PDF.',
    type: 'website',
    url: 'https://www.editpdfai.com/image-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/image-to-pdf.png', width: 1200, height: 630, alt: 'Image to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to PDF Converter Online Free',
    description: 'Convert JPG, PNG and other images to PDF instantly. Free, no signup needed.',
    images: ['/social/image-to-pdf.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Image to PDF Converter',
  url: 'https://www.editpdfai.com/image-to-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert JPG, PNG, WebP and other images to PDF online for free. Combine multiple images into one PDF.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
