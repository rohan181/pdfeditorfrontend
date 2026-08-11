import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Extract Images from PDF Online - Download Embedded Pictures',
  description: 'Extract unique bitmap images from PDF pages as lossless PNG files. Preserve transparency and download images individually or as a ZIP.',
  keywords: 'extract images from PDF, download PDF images, PDF image extractor, extract pictures from PDF, embedded PDF images',
  alternates: { canonical: 'https://www.editpdfai.com/extract-pdf-images' },
  openGraph: {
    title: 'Extract Images from PDF Online - Private Bitmap Extractor',
    description: 'Recover embedded bitmap images without rendering complete PDF pages. Free local browser processing.',
    url: 'https://www.editpdfai.com/extract-pdf-images',
    siteName: 'EditPDF AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract Images from PDF Online',
    description: 'Download unique embedded PDF images as lossless PNG files without uploading the document.',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Extract Images from PDF - EditPDF AI',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  url: 'https://www.editpdfai.com/extract-pdf-images',
  description: 'A private browser-based tool for finding and extracting bitmap images used inside PDF pages.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Extract PDF Image XObjects',
    'Extract inline PDF bitmap images',
    'Lossless PNG output',
    'Preserve supported transparency',
    'Deduplicate repeated images',
    'Track image pages and placements',
    'Download multiple images as ZIP',
    'Local browser processing',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Extract Images from PDF', item: 'https://www.editpdfai.com/extract-pdf-images' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {children}
  </>
}
