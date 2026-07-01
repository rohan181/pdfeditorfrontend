import type { Metadata } from 'next'
import AppleHome from '@/components/AppleHome'

export const metadata: Metadata = {
  title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
  description: 'Edit, sign, annotate and AI-fill PDF forms online. The fastest AI PDF editor with intelligent form detection, e-signatures and instant completion.',
  keywords: 'AI PDF editor, edit PDF online, fill PDF forms, sign PDF, PDF form filler, AI document editor, editpdfai',
  alternates: { canonical: 'https://editpdfai.com' },
  openGraph: {
    title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
    description: 'Edit, sign and AI-fill PDF forms online. Intelligent form detection and instant completion.',
    type: 'website',
    url: 'https://editpdfai.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EditPDF AI',
  url: 'https://editpdfai.com',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'AI-powered PDF editor with 35+ tools. Edit, sign, annotate and AI-fill PDF forms online.',
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppleHome />
    </>
  )
}
