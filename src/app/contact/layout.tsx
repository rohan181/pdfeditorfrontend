import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Contact Us | EditPDF AI' },
  description: "Get in touch with the EditPDF AI team. We're here to help with questions about our PDF tools, billing, or feedback.",
  keywords: 'contact EditPDF AI, EditPDF AI support, PDF tool help, editpdfai contact',
  alternates: { canonical: 'https://editpdfai.com/contact' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact Us | EditPDF AI',
    description: "Get in touch with the EditPDF AI team for help with PDF tools, billing, or feedback.",
    type: 'website',
    url: 'https://editpdfai.com/contact',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Contact EditPDF AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | EditPDF AI',
    description: "Get in touch with the EditPDF AI team for help with PDF tools, billing, or feedback.",
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact EditPDF AI',
  url: 'https://editpdfai.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'EditPDF AI',
    url: 'https://editpdfai.com',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@editpdfai.com',
      contactType: 'customer support',
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
