import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { ORGANIZATION_ID } from '@/lib/seo/site'

export const metadata = buildToolMetadata(TOOL_METADATA['pdf-editor'])

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/pdf-editor#webapp',
  name: 'PDF Editor',
  url: 'https://www.editpdfai.com/pdf-editor',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', name: 'Free PDF Editor', price: '0', priceCurrency: 'USD', url: 'https://www.editpdfai.com/pdf-editor' },
  provider: { '@id': ORGANIZATION_ID },
  image: 'https://www.editpdfai.com/social/pdf-editor.png',
  description: 'Edit any PDF online — add text, images, shapes, highlights, signatures and stamps. Rotate, reorder and delete pages. Free, no signup.',
  featureList: ['Text editing', 'Image insertion', 'Shapes', 'Highlights', 'Signatures', 'Stamps', 'Page management', 'PDF annotations'],
  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
  inLanguage: 'en',
}

// FAQPage schema for this page is generated inline in page.tsx (from the
// same `FAQS` array that renders the visible FAQ section — single source of
// truth, can't drift out of sync). Not re-declared here.

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com/' },
    { '@type': 'ListItem', position: 2, name: 'Free Online PDF Editor', item: 'https://www.editpdfai.com/pdf-editor' },
  ],
}

export default function PDFEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  )
}
