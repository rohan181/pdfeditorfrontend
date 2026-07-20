import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to PowerPoint Converter Online Free — PDF to PPTX',
  description: 'Convert PDF to editable PowerPoint presentations online for free. Each PDF page becomes a slide. Preserves text, images and layout. No signup, works in browser.',
  keywords: 'PDF to PowerPoint, PDF to PPTX, convert PDF to PPT online free, PDF to presentation, PDF to slides converter',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-to-ppt' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF to PowerPoint Converter Online Free — PDF to PPTX',
    description: 'Convert PDF to editable PowerPoint PPTX slides. Preserves text and images. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-to-ppt',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF to PowerPoint Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to PowerPoint Converter Online Free',
    description: 'Convert PDF to editable PowerPoint slides instantly. Free, no signup.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF to PowerPoint Converter',
  url: 'https://www.editpdfai.com/pdf-to-ppt',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PDF to editable PowerPoint presentations online for free.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
