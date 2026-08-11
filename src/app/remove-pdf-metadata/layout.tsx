import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remove PDF Metadata Online - Clean Hidden Document Properties',
  description: 'Remove PDF properties, XMP packets, document IDs, page metadata, and optional annotation identity data privately in your browser.',
  keywords: 'remove PDF metadata, clean PDF metadata, delete PDF properties, remove PDF author, PDF privacy cleaner, remove XMP metadata',
  alternates: { canonical: 'https://www.editpdfai.com/remove-pdf-metadata' },
  openGraph: {
    title: 'Remove PDF Metadata Online - Private Document Cleaner',
    description: 'Clean hidden PDF properties and identifiers locally without changing page quality.',
    url: 'https://www.editpdfai.com/remove-pdf-metadata',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remove PDF Metadata Online',
    description: 'Strip hidden document properties, XMP metadata, and identifiers with private browser processing.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Remove PDF Metadata - EditPDF AI',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/remove-pdf-metadata',
  description: 'A private browser-based tool for removing common metadata and hidden identifiers from PDF files.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Remove PDF document properties',
    'Remove XMP metadata streams',
    'Remove PDF document identifiers',
    'Remove page and object metadata references',
    'Optionally remove annotation identity fields',
    'Preserve page quality and interactive form fields',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Remove PDF Metadata', item: 'https://www.editpdfai.com/remove-pdf-metadata' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
