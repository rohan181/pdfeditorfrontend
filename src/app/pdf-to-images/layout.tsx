import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to Image Converter Online Free — PDF to JPG, PNG',
  description: 'Convert PDF pages to high-quality JPG or PNG images online for free. Extract every page as an image or choose specific pages. No signup, works in browser.',
  keywords: 'PDF to image, PDF to JPG, PDF to PNG, convert PDF to image online free, PDF page to image, export PDF as image',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-to-images' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF to Image Converter Online Free — PDF to JPG, PNG',
    description: 'Convert PDF pages to high-quality JPG or PNG images. Free, instant, no signup needed.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-to-images',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-to-images.png', width: 1200, height: 630, alt: 'PDF to Image Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Image Converter Online Free',
    description: 'Convert PDF pages to JPG or PNG images instantly. Free, no signup.',
    images: ['/social/pdf-to-images.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF to Image Converter',
  url: 'https://www.editpdfai.com/pdf-to-images',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PDF pages to high-quality JPG or PNG images online for free.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
