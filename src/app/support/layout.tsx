import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Help & Support | EditPDF AI' },
  description: 'Find answers to common questions about EditPDF AI tools, billing, and account management. Contact support if you need further help.',
  keywords: 'EditPDF AI support, PDF tool help, EditPDF AI help center, PDF editor support',
  alternates: { canonical: 'https://www.editpdfai.com/support' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Help & Support | EditPDF AI',
    description: 'Find answers to common questions about EditPDF AI tools, billing, and account management.',
    type: 'website',
    url: 'https://www.editpdfai.com/support',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EditPDF AI Support' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help & Support | EditPDF AI',
    description: 'Find answers to common questions about EditPDF AI tools, billing, and account management.',
    images: ['/opengraph-image'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
