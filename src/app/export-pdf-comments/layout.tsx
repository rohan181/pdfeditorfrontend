import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Export PDF Comments Online - Download Annotations as CSV or JSON',
  description: 'Extract PDF comments, highlights, notes, stamps, drawings, authors, dates, and replies into CSV or JSON locally in your browser.',
  keywords: 'export PDF comments, extract PDF annotations, PDF comments to CSV, PDF annotations JSON, download PDF highlights',
  alternates: { canonical: 'https://www.editpdfai.com/export-pdf-comments' },
  openGraph: {
    title: 'Export PDF Comments Online - Private Annotation Audit',
    description: 'Inspect PDF review annotations and download structured CSV or JSON without uploading the document.',
    url: 'https://www.editpdfai.com/export-pdf-comments',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Export PDF Comments Online',
    description: 'Audit PDF comments, markup, authors, dates, and replies locally.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Export PDF Comments - EditPDF AI',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/export-pdf-comments',
  description: 'A private browser-based extractor for PDF comments, review markup, authors, dates, replies, rectangles, and structured exports.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Extract sticky notes and text boxes',
    'Extract highlights and text markup',
    'Extract stamps, ink, and shapes',
    'Preserve reply relationships',
    'Report authors, dates, and page coordinates',
    'Export CSV or JSON',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Export PDF Comments', item: 'https://www.editpdfai.com/export-pdf-comments' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
