import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scan to PDF Online Free — Camera Document Scanner',
  description: 'Turn your camera into a document scanner. Capture paper documents, auto-detect edges, fix perspective, and export a clean multi-page PDF. Free, no signup, runs entirely in your browser.',
  keywords: 'scan to PDF, camera scanner, document scanner online, phone scanner, scan document to PDF free, perspective correction scanner',
  alternates: { canonical: 'https://www.editpdfai.com/scan-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Scan to PDF Online Free — Camera Document Scanner',
    description: 'Capture paper documents with your camera, auto-crop and straighten them, and save a multi-page PDF. Free and private — nothing leaves your browser.',
    type: 'website',
    url: 'https://www.editpdfai.com/scan-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/scan-to-pdf.png', width: 1200, height: 630, alt: 'Scan to PDF — Camera Document Scanner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scan to PDF Online Free — Camera Document Scanner',
    description: 'Capture paper documents with your camera and export a clean multi-page PDF. Free, no signup needed.',
    images: ['/social/scan-to-pdf.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Scan to PDF',
  url: 'https://www.editpdfai.com/scan-to-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Turn your camera into a document scanner. Capture paper documents, auto-detect edges, fix perspective, and export a clean multi-page PDF.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
