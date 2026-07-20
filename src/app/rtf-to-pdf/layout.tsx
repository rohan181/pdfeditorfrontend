import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RTF to PDF Converter Online Free — Rich Text to PDF',
  description: 'Convert RTF (Rich Text Format) files to PDF online for free. Preserves bold, italic, fonts and formatting. Fast, secure and no signup required.',
  keywords: 'RTF to PDF, rich text to PDF, convert RTF to PDF online free, RTF file to PDF, .rtf to PDF converter',
  alternates: { canonical: 'https://www.editpdfai.com/rtf-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'RTF to PDF Converter Online Free — Rich Text to PDF',
    description: 'Convert RTF files to PDF instantly. Preserves fonts and formatting. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/rtf-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'RTF to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RTF to PDF Converter Online Free',
    description: 'Convert RTF to PDF instantly. Preserves formatting. Free, no signup.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RTF to PDF Converter',
  url: 'https://www.editpdfai.com/rtf-to-pdf',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert RTF (Rich Text Format) files to PDF online for free. Preserves bold, italic, fonts and formatting.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
