import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Page Labels Online - Roman Numerals, Prefixes and Sections',
  description: 'Add or edit PDF page labels with decimal numbers, Roman numerals, letters, prefixes, and section restarts using private browser processing.',
  keywords: 'PDF page labels, edit PDF page labels, Roman numeral PDF pages, PDF page number labels, PDF prefix pages',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-page-labels' },
  openGraph: {
    title: 'PDF Page Labels Online - Private Label Range Editor',
    description: 'Create viewer navigation labels for PDF front matter, chapters, appendices, and numbered sections without changing page artwork.',
    url: 'https://www.editpdfai.com/pdf-page-labels',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Page Labels Online',
    description: 'Set PDF page labels, prefixes, styles, and numbering restarts locally in your browser.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF Page Labels - EditPDF AI',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/pdf-page-labels',
  description: 'A private browser-based editor for PDF page-label ranges, numbering styles, prefixes, and starting values.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Decimal page labels',
    'Uppercase and lowercase Roman numerals',
    'Uppercase and lowercase alphabetic labels',
    'Custom label prefixes',
    'Multiple ranges and numbering restarts',
    'Restore standard PDF page labels',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'PDF Page Labels', item: 'https://www.editpdfai.com/pdf-page-labels' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
