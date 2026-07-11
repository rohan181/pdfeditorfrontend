import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign PDF Online Free — eSign Documents Instantly',
  description: 'Sign PDF documents online for free. Draw, type or upload your signature and place it anywhere on the PDF. No account required — sign and download instantly.',
  keywords: 'sign PDF online, eSign PDF, electronic signature PDF, PDF signer, digital signature PDF, sign PDF free',
  alternates: { canonical: 'https://editpdfai.com/pdf-signer' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sign PDF Online Free — eSign Documents Instantly',
    description: 'Draw, type or upload a signature and sign any PDF for free. No account needed.',
    type: 'website',
    url: 'https://editpdfai.com/pdf-signer',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Sign PDF Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign PDF Online Free',
    description: 'Draw, type or upload your signature and sign any PDF instantly. Free, no account needed.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Signer',
  url: 'https://editpdfai.com/pdf-signer',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Sign PDF documents online for free. Draw, type or upload your signature and place it anywhere on the PDF.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
