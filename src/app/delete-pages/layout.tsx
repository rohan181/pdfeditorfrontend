import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delete PDF Pages Online Free — Remove Pages from PDF',
  description: 'Delete pages from a PDF online for free. Select and remove single pages, multiple pages or a page range. Download the cleaned PDF instantly. No signup needed.',
  keywords: 'delete PDF pages, remove pages from PDF, delete page PDF online free, remove PDF page, PDF page remover',
  alternates: { canonical: 'https://www.editpdfai.com/delete-pages' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Delete PDF Pages Online Free — Remove Pages from PDF',
    description: 'Remove unwanted pages from any PDF instantly. Free, no signup, works in your browser.',
    type: 'website',
    url: 'https://www.editpdfai.com/delete-pages',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Delete PDF Pages Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delete PDF Pages Online Free',
    description: 'Remove unwanted pages from any PDF instantly. Free, no signup.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Delete PDF Pages',
  url: 'https://www.editpdfai.com/delete-pages',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Delete pages from a PDF online for free. Select and remove single pages, multiple pages or a page range.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
