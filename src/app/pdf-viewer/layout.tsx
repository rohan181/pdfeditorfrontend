import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Viewer Online Free — Open & Read PDF in Browser',
  description: 'View PDF files online for free. Open, zoom, search and navigate any PDF in your browser. Fast, secure and works without any software installation.',
  keywords: 'PDF viewer online, open PDF online, view PDF in browser, free PDF viewer, read PDF online, PDF reader online',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-viewer' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF Viewer Online Free — Open & Read PDF in Browser',
    description: 'Open and read any PDF in your browser. Zoom, search and navigate instantly. Free, no install.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-viewer',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-viewer.png', width: 1200, height: 630, alt: 'PDF Viewer Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Viewer Online Free',
    description: 'Open, zoom and read any PDF in your browser. Free, no install needed.',
    images: ['/social/pdf-viewer.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Viewer',
  url: 'https://www.editpdfai.com/pdf-viewer',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'View PDF files online for free. Open, zoom, search and navigate any PDF in your browser.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
