import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — EditPDF AI Support',
  description: 'Get in touch with the EditPDF AI team. We\'re here to help with questions about our PDF tools, billing, or feedback.',
  alternates: { canonical: 'https://editpdfai.com/contact' },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
