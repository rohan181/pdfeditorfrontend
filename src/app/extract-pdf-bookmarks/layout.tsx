import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Extract PDF Bookmarks Online - Export Outline to CSV or JSON',
  description: 'Read a PDF bookmark hierarchy, resolve page destinations, and export the document outline as CSV or JSON with private browser processing.',
  keywords: 'extract PDF bookmarks, export PDF outline, PDF bookmarks to CSV, PDF bookmarks to JSON, read PDF table of contents',
  alternates: { canonical: 'https://www.editpdfai.com/extract-pdf-bookmarks' },
  openGraph: {
    title: 'Extract PDF Bookmarks Online - Private Outline Exporter',
    description: 'Inspect nested PDF bookmarks and download their hierarchy and destinations without uploading the document.',
    url: 'https://www.editpdfai.com/extract-pdf-bookmarks',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract PDF Bookmarks Online',
    description: 'Export PDF bookmark trees and resolved page destinations as CSV or JSON locally in your browser.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Extract PDF Bookmarks - EditPDF AI',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/extract-pdf-bookmarks',
  description: 'A private browser-based tool for reading PDF outline trees and exporting bookmark data as CSV or JSON.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Preserve nested PDF bookmark hierarchy',
    'Resolve direct PDF page destinations',
    'Resolve legacy and name-tree named destinations',
    'Classify web and external PDF actions without opening them',
    'Export flat CSV and hierarchical JSON',
    'Protect CSV cells from spreadsheet formula execution',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Extract PDF Bookmarks', item: 'https://www.editpdfai.com/extract-pdf-bookmarks' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
