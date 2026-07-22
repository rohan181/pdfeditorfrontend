import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Annotate PDF Online Free — Highlight, Comment & Mark Up PDFs',
  description: 'Annotate PDF documents online for free. Highlight text, add comments, draw shapes, sticky notes and freehand markup. Works in your browser, no install needed.',
  keywords: 'annotate PDF, highlight PDF online, PDF annotation, PDF markup, comment on PDF, PDF highlighter, PDF sticky notes online',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-annotate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Annotate PDF Online Free — Highlight, Comment & Mark Up PDFs',
    description: 'Highlight, comment and draw on any PDF online for free. No signup, works in your browser.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-annotate',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-annotate.png', width: 1200, height: 630, alt: 'Annotate PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Annotate PDF Online Free',
    description: 'Highlight, comment and mark up any PDF instantly. Free, no signup needed.',
    images: ['/social/pdf-annotate.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Annotate',
  url: 'https://www.editpdfai.com/pdf-annotate',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Annotate PDF documents online for free. Highlight text, add comments, draw shapes, sticky notes and freehand markup.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
