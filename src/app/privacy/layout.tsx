import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | EditPDF AI' },
  description: 'Read the EditPDF AI privacy policy. Learn how we handle your data, what we collect, and your rights under GDPR and CCPA.',
  keywords: 'EditPDF AI privacy policy, data privacy, GDPR, CCPA, PDF tool privacy',
  alternates: { canonical: 'https://editpdfai.com/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | EditPDF AI',
    description: 'Read the EditPDF AI privacy policy. Learn how we handle your data and your rights under GDPR and CCPA.',
    type: 'website',
    url: 'https://editpdfai.com/privacy',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EditPDF AI Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | EditPDF AI',
    description: 'Read the EditPDF AI privacy policy. Learn how we handle your data and your rights under GDPR and CCPA.',
    images: ['/opengraph-image'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
