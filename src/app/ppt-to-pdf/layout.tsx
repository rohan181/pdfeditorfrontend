import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PowerPoint to PDF Converter Online Free — PPTX to PDF',
  description: 'Convert PowerPoint presentations to PDF online for free. Upload PPTX or PPT and get a perfect PDF with all slides. Preserves fonts, images and animations.',
  keywords: 'PowerPoint to PDF, PPTX to PDF, PPT to PDF online free, convert presentation to PDF, slideshow to PDF',
  alternates: { canonical: 'https://www.editpdfai.com/ppt-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PowerPoint to PDF Converter Online Free — PPTX to PDF',
    description: 'Convert PowerPoint PPTX and PPT files to PDF instantly. Preserves all slides. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/ppt-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PowerPoint to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PowerPoint to PDF Converter Online Free',
    description: 'Convert PowerPoint slides to PDF instantly. Free, no signup needed.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PowerPoint to PDF Converter',
  url: 'https://www.editpdfai.com/ppt-to-pdf',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PowerPoint presentations to PDF online for free. Preserves fonts, images and all slides.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
