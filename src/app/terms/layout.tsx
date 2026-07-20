import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Terms of Service | EditPDF AI' },
  description: 'Read the EditPDF AI terms of service. Understand the conditions of use for our PDF editing, conversion, and AI tools.',
  keywords: 'EditPDF AI terms of service, terms of use, PDF tool terms, user agreement',
  alternates: { canonical: 'https://www.editpdfai.com/terms' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Terms of Service | EditPDF AI',
    description: 'Read the EditPDF AI terms of service and conditions of use for our PDF and AI tools.',
    type: 'website',
    url: 'https://www.editpdfai.com/terms',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EditPDF AI Terms of Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | EditPDF AI',
    description: 'Read the EditPDF AI terms of service and conditions of use for our PDF and AI tools.',
    images: ['/opengraph-image'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
