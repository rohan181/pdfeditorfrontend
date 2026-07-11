import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML to PDF Converter Online Free — Webpage to PDF',
  description: 'Convert HTML files or web pages to PDF online for free. Paste HTML code or a URL and download a perfectly rendered PDF. Supports CSS styling. No signup.',
  keywords: 'HTML to PDF, convert HTML to PDF online free, webpage to PDF, website to PDF, HTML file to PDF, URL to PDF',
  alternates: { canonical: 'https://editpdfai.com/html-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'HTML to PDF Converter Online Free — Webpage to PDF',
    description: 'Convert HTML code or web pages to PDF instantly. Supports CSS styling. Free, no signup.',
    type: 'website',
    url: 'https://editpdfai.com/html-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'HTML to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML to PDF Converter Online Free',
    description: 'Convert HTML or web pages to PDF instantly. Supports CSS. Free, no signup.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HTML to PDF Converter',
  url: 'https://editpdfai.com/html-to-pdf',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert HTML files or web pages to PDF online for free. Supports CSS styling.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
