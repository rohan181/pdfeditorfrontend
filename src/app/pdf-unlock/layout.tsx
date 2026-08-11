import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unlock PDF Online - Remove a Known PDF Password',
  description: 'Remove password protection from a PDF you own. Free, private browser processing with no file upload, no account, and no loss of quality.',
  keywords: 'unlock PDF, remove PDF password, decrypt PDF, remove PDF restrictions, unlock PDF online, password protected PDF',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-unlock' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Unlock PDF Online - Remove a Known PDF Password',
    description: 'Remove a known PDF password privately in your browser. Free, no upload, no account.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-unlock',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EditPDF AI Unlock PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlock PDF Online - Remove a Known PDF Password',
    description: 'Remove a known PDF password privately in your browser.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unlock PDF',
  url: 'https://www.editpdfai.com/pdf-unlock',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Remove password protection from an authorized PDF locally in the browser.',
  featureList: 'Known-password PDF decryption, local WebAssembly processing, no file upload, quality-preserving output',
  browserRequirements: 'Requires JavaScript and WebAssembly. Works in current versions of Chrome, Firefox, Safari, and Edge.',
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Unlock PDF', item: 'https://www.editpdfai.com/pdf-unlock' },
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

