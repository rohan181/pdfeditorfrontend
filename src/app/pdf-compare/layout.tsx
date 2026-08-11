import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare PDF Files Online - Find Visual and Text Changes',
  description: 'Compare two PDFs page by page to find visible, textual, page-size, and page-count changes. Free private browser processing with clear difference maps.',
  keywords: 'compare PDF, PDF comparison, compare two PDFs, PDF diff, find PDF changes, visual PDF comparison, document comparison online',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-compare' },
  openGraph: {
    title: 'Compare PDF Files Online - Find Every Page Change',
    description: 'Review visual and textual differences between two PDFs without uploading either document.',
    url: 'https://www.editpdfai.com/pdf-compare',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare PDF Files Online',
    description: 'Find visual and text changes page by page with private browser processing.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Compare PDF - EditPDF AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/pdf-compare',
  description: 'A private browser-based tool for comparing visible and textual changes between two PDF files.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Page-by-page visual PDF comparison',
    'PDF text change detection',
    'Added and removed page detection',
    'Three comparison sensitivity levels',
    'Local browser processing',
    'Downloadable CSV comparison report',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Compare PDF', item: 'https://www.editpdfai.com/pdf-compare' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
