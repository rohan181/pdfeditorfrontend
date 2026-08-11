import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Export PDF Form Data Online - Download CSV or JSON',
  description: 'Read fillable PDF fields and export their values, types, flags, options, and page locations as CSV or JSON with private browser processing.',
  keywords: 'export PDF form data, PDF form to CSV, PDF form to JSON, extract PDF fields, AcroForm data export',
  alternates: { canonical: 'https://www.editpdfai.com/export-pdf-form-data' },
  openGraph: {
    title: 'Export PDF Form Data Online - Private CSV and JSON Export',
    description: 'Inspect AcroForm fields and download structured form data without uploading the PDF.',
    url: 'https://www.editpdfai.com/export-pdf-form-data',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Export PDF Form Data Online',
    description: 'Download fillable PDF field data as safe CSV or structured JSON with local browser processing.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Export PDF Form Data - EditPDF AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/export-pdf-form-data',
  description: 'A private browser-based tool for inspecting AcroForm fields and exporting form data as CSV or JSON.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Export PDF form data to CSV',
    'Export PDF form data to JSON',
    'Read text, checkbox, radio, dropdown, and list fields',
    'Report field flags, options, widgets, and page locations',
    'Omit cryptographic signature contents',
    'Protect CSV output from spreadsheet formula execution',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Export PDF Form Data', item: 'https://www.editpdfai.com/export-pdf-form-data' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
