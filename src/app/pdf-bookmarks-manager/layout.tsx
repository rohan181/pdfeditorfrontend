import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Bookmarks Manager Online - Add, Edit and Remove Bookmarks',
  description: 'Add, rename, nest, reorder, retarget, open, close, or delete PDF bookmarks and download a new PDF with private browser processing.',
  keywords: 'PDF bookmarks manager, add PDF bookmarks, edit PDF bookmarks, remove PDF bookmarks, organize PDF outline',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-bookmarks-manager' },
  openGraph: {
    title: 'PDF Bookmarks Manager Online - Private Outline Editor',
    description: 'Edit a PDF outline tree and download a new navigable PDF without uploading the document.',
    url: 'https://www.editpdfai.com/pdf-bookmarks-manager',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Bookmarks Manager Online',
    description: 'Add, rename, nest, reorder, retarget, and delete PDF bookmarks locally in your browser.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF Bookmarks Manager - EditPDF AI',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/pdf-bookmarks-manager',
  description: 'A private browser-based editor for adding, renaming, nesting, reordering, retargeting, and deleting PDF outline bookmarks.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Add root and child PDF bookmarks',
    'Rename and retarget bookmarks',
    'Move bookmarks among siblings',
    'Choose open or closed outline state',
    'Delete individual bookmarks or the complete outline',
    'Preserve supported web, external PDF, and named actions',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'PDF Bookmarks Manager', item: 'https://www.editpdfai.com/pdf-bookmarks-manager' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
