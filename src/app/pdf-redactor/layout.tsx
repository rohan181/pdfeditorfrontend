import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Redact PDF Online Free — Permanently Remove Sensitive Text',
  description: 'Redact sensitive information from PDF files online for free. Permanently black out names, addresses, SSNs and confidential data. Secure, no server upload.',
  keywords: 'redact PDF, PDF redaction, remove sensitive text PDF, black out PDF text, PDF redactor, redact PDF online free, GDPR redaction',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-redactor' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Redact PDF Online Free — Permanently Remove Sensitive Text',
    description: 'Permanently black out sensitive text and data from any PDF. Free, secure, no server upload.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-redactor',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Redact PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redact PDF Online Free',
    description: 'Permanently remove sensitive information from any PDF. Secure, no server upload.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Redactor',
  url: 'https://www.editpdfai.com/pdf-redactor',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Redact sensitive information from PDF files online for free. Permanently black out names, addresses, SSNs and confidential data.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
