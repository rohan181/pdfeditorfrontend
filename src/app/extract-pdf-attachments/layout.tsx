import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Extract PDF Attachments Online - Download Embedded Files',
  description: 'Find and download files embedded inside a PDF. Extract document attachments, associated files, and file annotations privately in your browser.',
  keywords: 'extract PDF attachments, download embedded PDF files, PDF attachment extractor, extract files from PDF, PDF embedded files',
  alternates: { canonical: 'https://www.editpdfai.com/extract-pdf-attachments' },
  openGraph: {
    title: 'Extract PDF Attachments Online - Private Embedded File Extractor',
    description: 'Recover files embedded inside a PDF and download them individually or as a ZIP without uploading the document.',
    url: 'https://www.editpdfai.com/extract-pdf-attachments',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract PDF Attachments Online',
    description: 'Download embedded PDF files individually or as a ZIP with private browser processing.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Extract PDF Attachments - EditPDF AI',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/extract-pdf-attachments',
  description: 'A private browser-based tool for extracting document attachments, associated files, and file annotations from PDFs.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Extract PDF document attachments',
    'Extract PDF associated files',
    'Extract file-annotation attachments',
    'Download attachments individually',
    'Download multiple attachments as a ZIP',
    'Sanitize unsafe attachment filenames',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Extract PDF Attachments', item: 'https://www.editpdfai.com/extract-pdf-attachments' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
