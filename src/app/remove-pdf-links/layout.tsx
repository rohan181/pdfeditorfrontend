import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remove Links from PDF Online - Disable All Clickable Links',
  description: 'Remove web, email, page, file, form, and JavaScript link annotations from a PDF locally while preserving visible page content.',
  keywords: 'remove links from PDF, disable PDF hyperlinks, delete PDF links, remove clickable links PDF, PDF link remover',
  alternates: { canonical: 'https://www.editpdfai.com/remove-pdf-links' },
  openGraph: {
    title: 'Remove PDF Links Online - Private Browser Tool',
    description: 'Create a link-free PDF copy without uploading the document or changing visible link text.',
    url: 'https://www.editpdfai.com/remove-pdf-links',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remove PDF Links Online',
    description: 'Disable clickable PDF link annotations privately in your browser.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Remove PDF Links - EditPDF AI',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/remove-pdf-links',
  description: 'A private browser-based tool that removes clickable Link annotations from PDF pages while preserving visible document content.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Remove web and email links',
    'Remove internal page jumps',
    'Remove file and form actions',
    'Remove JavaScript link annotations',
    'Preserve visible PDF content',
    'Verify that no page links remain',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Remove PDF Links', item: 'https://www.editpdfai.com/remove-pdf-links' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
