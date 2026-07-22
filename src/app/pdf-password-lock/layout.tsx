import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Password Lock — Password Protect PDF Free Online',
  description: 'Add a password to any PDF instantly. Encrypt your PDF with AES-256 security in your browser — free, no upload, no account required.',
  keywords: 'PDF password lock, password protect PDF, encrypt PDF, PDF security, lock PDF online, PDF password free, AES-256 PDF encryption',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-password-lock' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF Password Lock — Password Protect PDF Free Online',
    description: 'Add a password to any PDF instantly. AES-256 encryption, free, no account, no upload.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-password-lock',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF Password Lock' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Password Lock — Password Protect PDF Free Online',
    description: 'Add a password to any PDF instantly. AES-256 encryption, free, no account.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Password Lock',
  url: 'https://www.editpdfai.com/pdf-password-lock',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Add a password to any PDF instantly with AES-256 encryption. Free, runs in your browser, no account required.',
  featureList: 'AES-256 PDF encryption, open password, permissions password, browser-based processing',
  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'PDF Password Lock', item: 'https://www.editpdfai.com/pdf-password-lock' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  )
}
