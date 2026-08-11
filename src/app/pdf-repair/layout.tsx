import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Repair PDF Online - Recover a Damaged PDF',
  description: 'Repair recoverable PDF structure errors privately in your browser. Free local processing with no file upload, no account, and no change to the original file.',
  keywords: 'repair PDF, fix corrupted PDF, recover damaged PDF, PDF recovery, fix broken PDF, repair PDF online',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-repair' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Repair PDF Online - Recover a Damaged PDF',
    description: 'Rebuild recoverable PDF structure errors privately in your browser. Free, no upload, no account.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-repair',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EditPDF AI Repair PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repair PDF Online - Recover a Damaged PDF',
    description: 'Repair recoverable PDF structure errors privately in your browser.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Repair PDF',
  url: 'https://www.editpdfai.com/pdf-repair',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Repair recoverable structural errors in a PDF locally in the browser.',
  featureList: 'PDF structure recovery, cross-reference reconstruction, local WebAssembly processing, no file upload, content-preserving output',
  browserRequirements: 'Requires JavaScript and WebAssembly. Works in current versions of Chrome, Firefox, Safari, and Edge.',
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Repair PDF', item: 'https://www.editpdfai.com/pdf-repair' },
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
