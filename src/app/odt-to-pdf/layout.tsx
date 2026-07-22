import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ODT to PDF Converter Online Free — OpenDocument to PDF',
  description: 'Convert ODT (OpenDocument Text) files to PDF online for free. Works with LibreOffice and OpenOffice documents. Fast, accurate and no signup required.',
  keywords: 'ODT to PDF, OpenDocument to PDF, convert ODT to PDF online free, LibreOffice to PDF, OpenOffice to PDF',
  alternates: { canonical: 'https://www.editpdfai.com/odt-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'ODT to PDF Converter Online Free — OpenDocument to PDF',
    description: 'Convert ODT OpenDocument files to PDF instantly. Works with LibreOffice and OpenOffice. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/odt-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/odt-to-pdf.png', width: 1200, height: 630, alt: 'ODT to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ODT to PDF Converter Online Free',
    description: 'Convert ODT files to PDF instantly. Works with LibreOffice. Free, no signup.',
    images: ['/social/odt-to-pdf.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ODT to PDF Converter',
  url: 'https://www.editpdfai.com/odt-to-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert ODT (OpenDocument Text) files to PDF online for free.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
