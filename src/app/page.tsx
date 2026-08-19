import type { Metadata } from 'next'
import { ORGANIZATION_ID } from '@/lib/seo/site'
import { TOOL_COUNT } from '@/lib/toolMeta'
import AppleHome from '@/components/AppleHome'
import SitePopularTools from '@/components/SitePopularTools'
import SiteUseCases from '@/components/SiteUseCases'
import SitePrivacyNote from '@/components/SitePrivacyNote'
import SitePricingPreview from '@/components/SitePricingPreview'
import LazyHomeScroll from '@/components/LazyHomeScroll'
import LazyHomeAllTools from '@/components/LazyHomeAllTools'
import SiteFAQ, { FAQ_ITEMS } from '@/components/SiteFAQ'
import SiteCTA from '@/components/SiteCTA'
import SiteFooter from '@/components/SiteFooter'
import MobileEditorShortcut from '@/components/MobileEditorShortcut'

export const metadata: Metadata = {
  title: { absolute: `EditPDF AI: Free Online PDF Editor & ${TOOL_COUNT}+ PDF Tools` },
  description: `EditPDF AI provides ${TOOL_COUNT}+ free online PDF tools to edit, fill, sign, merge, compress and convert PDFs. Core tools need no account and files stay private.`,
  applicationName: 'EditPDF AI',
  // No `alternates.canonical` here on purpose — Next.js's metadata resolver
  // hardcodes root-path URLs down to a bare origin (drops the trailing
  // slash) regardless of what string is passed in, and flipping the site-wide
  // `trailingSlash` config to work around it would change every other page's
  // URLs too. The canonical tag below is rendered manually instead, just for
  // this one page, so it can be the exact required https://www.editpdfai.com/.
  openGraph: {
    title: `EditPDF AI: Free Online PDF Editor & ${TOOL_COUNT}+ PDF Tools`,
    description: `EditPDF AI provides ${TOOL_COUNT}+ free online PDF tools to edit, fill, sign, merge, compress and convert PDFs. Core tools need no account and files stay private.`,
    type: 'website',
    url: 'https://www.editpdfai.com/',
    siteName: 'EditPDF AI',
    images: [{
      url: '/social/home-constellation.png',
      width: 1200,
      height: 630,
      alt: 'EditPDF AI — One PDF. 35 ways forward.',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `EditPDF AI: Free Online PDF Editor & ${TOOL_COUNT}+ PDF Tools`,
    description: `EditPDF AI provides ${TOOL_COUNT}+ free online PDF tools to edit, fill, sign, merge, compress and convert PDFs. Core tools need no account and files stay private.`,
    images: ['/social/home-constellation.png'],
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://www.editpdfai.com/#webapp',
    name: 'EditPDF AI',
    url: 'https://www.editpdfai.com/',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    provider: { '@id': ORGANIZATION_ID },
    featureList: [
      'Edit and annotate PDF files',
      'Fill and sign PDF forms',
      'Merge, split, compress and organize PDF pages',
      'Convert PDF files to and from common document formats',
      'OCR, translate and summarize PDF documents with AI',
    ],
    offers: [
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', url: 'https://www.editpdfai.com/pdf-editor' },
      { '@type': 'Offer', name: 'Pro', price: '1', priceCurrency: 'USD', url: 'https://www.editpdfai.com/pricing' },
    ],
    description: `Use ${TOOL_COUNT}+ online PDF tools to edit, sign, fill, merge, compress and convert documents. Core tools need no account.`,
  },
  // Organization + WebSite are rendered site-wide by <SiteJsonLd /> in the
  // root layout (src/app/layout.tsx) — not repeated here, to avoid two
  // Organization/WebSite entities describing the same site on this page.
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.editpdfai.com/#faq',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

export default function HomePage() {
  return (
    <>
      {/* Rendered directly rather than via `alternates.canonical` — see the
          comment on the metadata export above for why. Next.js hoists any
          <link>/<meta> rendered in a Server Component's tree into <head>. */}
      <link rel="canonical" href="https://www.editpdfai.com/" />
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <main id="main-content">
        <AppleHome />
        <SitePopularTools />
        <LazyHomeScroll />
        <LazyHomeAllTools />
        <SiteUseCases />
        <SitePrivacyNote />
        <SitePricingPreview />
        <SiteFAQ />
        <SiteCTA />
      </main>
      <SiteFooter />
      <MobileEditorShortcut />
    </>
  )
}
