import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Mind Map Generator from PDF — Visualise Any Document',
  description: 'Generate visual mind maps from any PDF with AI. Turn reports, research papers, books and notes into structured, interactive mind maps in seconds. Free online.',
  keywords: 'AI mind map generator, PDF to mind map, mind map from PDF, AI mind map, visual mind map generator, PDF visualiser',
  alternates: { canonical: 'https://www.editpdfai.com/mind-map' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI Mind Map Generator from PDF — Visualise Any Document',
    description: 'Turn any PDF into an interactive visual mind map with AI. Free online, no signup needed.',
    type: 'website',
    url: 'https://www.editpdfai.com/mind-map',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/mind-map.png', width: 1200, height: 630, alt: 'AI Mind Map Generator from PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Mind Map Generator from PDF',
    description: 'Turn any PDF into a visual mind map with AI. Free online, no signup.',
    images: ['/social/mind-map.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Mind Map Generator',
  url: 'https://www.editpdfai.com/mind-map',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Generate visual mind maps from any PDF with AI. Turn reports, research papers and notes into structured mind maps.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
