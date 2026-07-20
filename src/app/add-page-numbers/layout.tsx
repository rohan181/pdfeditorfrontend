import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Page Numbers to PDF Online Free — Number PDF Pages',
  description: 'Add page numbers to PDF documents online for free. Choose position, font, size and starting number. Apply to all pages or a custom range. No install needed.',
  keywords: 'add page numbers to PDF, number PDF pages online, PDF page numbering, add footer to PDF, PDF page numbers free',
  alternates: { canonical: 'https://www.editpdfai.com/add-page-numbers' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Add Page Numbers to PDF Online Free',
    description: 'Add customisable page numbers to any PDF online. Choose position, font and range. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/add-page-numbers',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Add Page Numbers to PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Page Numbers to PDF Online Free',
    description: 'Add page numbers to any PDF instantly. Customise position, font and range. Free online.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Add Page Numbers to PDF',
  url: 'https://www.editpdfai.com/add-page-numbers',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Add page numbers to PDF documents online for free. Choose position, font, size and starting number.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
