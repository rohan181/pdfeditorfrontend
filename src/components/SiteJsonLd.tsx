import { PRODUCTION_ORIGIN, ORGANIZATION_ID, WEBSITE_ID } from '@/lib/seo/site'

// Renders the Organization + WebSite entities once, site-wide, from the root
// layout — every other JSON-LD block on the site (ToolSEOSection's
// SoftwareApplication, the hand-rolled WebApplication blocks in tool
// layout.tsx files) references these by `@id` instead of repeating them, so
// they need to actually be present on every page for that reference to
// resolve outside the homepage document.
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'EditPDF AI',
  alternateName: ['EditPDFAI', 'EditPDF'],
  url: `${PRODUCTION_ORIGIN}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${PRODUCTION_ORIGIN}/logo-square.svg`,
    contentUrl: `${PRODUCTION_ORIGIN}/logo-square.svg`,
    width: 512,
    height: 512,
  },
  sameAs: [
    'https://twitter.com/editpdfai',
    'https://www.linkedin.com/company/editpdfai/',
    'https://www.trustpilot.com/review/editpdfai.com',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@editpdfai.com',
    contactType: 'customer support',
  },
}

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'EditPDF AI',
  url: `${PRODUCTION_ORIGIN}/`,
  inLanguage: 'en',
  publisher: { '@id': ORGANIZATION_ID },
  hasPart: [
    { '@id': `${PRODUCTION_ORIGIN}/pdf-editor`, '@type': 'WebPage', name: 'PDF Editor' },
    { '@id': `${PRODUCTION_ORIGIN}/pdf-compressor`, '@type': 'WebPage', name: 'PDF Compressor' },
    { '@id': `${PRODUCTION_ORIGIN}/pdf-merger`, '@type': 'WebPage', name: 'PDF Merger' },
    { '@id': `${PRODUCTION_ORIGIN}/pdf-signer`, '@type': 'WebPage', name: 'PDF Signer' },
    { '@id': `${PRODUCTION_ORIGIN}/pdf-ocr`, '@type': 'WebPage', name: 'PDF OCR Scanner' },
    { '@id': `${PRODUCTION_ORIGIN}/ai-pdf-form-filler`, '@type': 'WebPage', name: 'AI PDF Form Filler' },
  ],
}

export default function SiteJsonLd() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  )
}
