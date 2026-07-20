import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI PDF Summarizer Online Free — Summarize Any PDF Instantly',
  description: 'Summarize any PDF document with AI in seconds. Get concise key points, chapter summaries and action items from long reports, research papers and contracts.',
  keywords: 'AI PDF summarizer, summarize PDF online, PDF summary AI, PDF to summary, summarize document online, AI document summarizer',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-summarizer' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI PDF Summarizer Online Free — Summarize Any PDF Instantly',
    description: 'Get AI-powered summaries of any PDF in seconds. Key points, chapter breakdowns and action items.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-summarizer',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'AI PDF Summarizer Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI PDF Summarizer Online Free',
    description: 'Summarize any PDF with AI in seconds. Key points, summaries and action items.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI PDF Summarizer',
  url: 'https://www.editpdfai.com/pdf-summarizer',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Summarize any PDF document with AI in seconds. Get concise key points, chapter summaries and action items.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
