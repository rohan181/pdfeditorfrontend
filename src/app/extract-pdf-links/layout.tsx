import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Extract PDF Links Online - Export URLs and Page Destinations',
  description: 'Find web, email, internal-page, external-PDF, and other clickable links in a PDF, then export a safe CSV or JSON audit locally.',
  keywords: 'extract PDF links, find links in PDF, export PDF URLs, PDF hyperlink checker, audit PDF links',
  alternates: { canonical: 'https://www.editpdfai.com/extract-pdf-links' },
  openGraph: {
    title: 'Extract PDF Links Online - Private Link Annotation Audit',
    description: 'Inspect clickable PDF annotations and export their targets without uploading the document or opening any link.',
    url: 'https://www.editpdfai.com/extract-pdf-links',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract PDF Links Online',
    description: 'Audit PDF link annotations and download CSV or JSON locally in your browser.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Extract PDF Links - EditPDF AI',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/extract-pdf-links',
  description: 'A private browser-based inspector for PDF link annotations, destinations, rectangles, and safe CSV or JSON export.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Extract web and email links',
    'Resolve internal PDF destinations',
    'Classify external PDF and file actions',
    'Report page and rectangle coordinates',
    'Flag JavaScript actions without executing them',
    'Export CSV or JSON',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Extract PDF Links', item: 'https://www.editpdfai.com/extract-pdf-links' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
