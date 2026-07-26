import type { Metadata } from 'next'
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
  title: { absolute: 'Free PDF Tools Online — Edit, Sign & Convert' },
  description: 'Use 35+ free online PDF tools to edit, sign, fill, merge, compress and convert PDFs. Core tools need no account; AI tools include five free daily uses.',
  keywords: 'PDF editor, PDF converter, free online PDF tools, edit PDF online for free without signup, edit and sign PDF online free, merge PDF files online, compress PDF without losing quality, convert PDF to Word online, fill PDF forms online, AI PDF tools, EditPDF AI',
  alternates: { canonical: 'https://www.editpdfai.com' },
  openGraph: {
    title: 'Free Online PDF Tools — Edit, Sign, Fill & Convert',
    description: 'Use 35+ online PDF tools to edit, sign, fill, merge, compress and convert PDFs. Core tools are free with no account.',
    type: 'website',
    url: 'https://www.editpdfai.com',
    siteName: 'EditPDF AI',
    images: [{
      url: '/social/home.png',
      width: 1200,
      height: 630,
      alt: 'EditPDF AI — 35+ free online PDF tools',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online PDF Tools — Edit, Sign, Fill & Convert',
    description: 'Use 35+ PDF tools for editing, signing, filling, OCR, compression, conversion and AI workflows.',
    images: ['/social/home.png'],
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://www.editpdfai.com/#webapp',
    name: 'EditPDF AI',
    url: 'https://www.editpdfai.com',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    provider: { '@id': 'https://www.editpdfai.com/#organization' },
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
    description: 'Use 35+ online PDF tools to edit, sign, fill, merge, compress and convert documents. Core tools are free with no account.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.editpdfai.com/#organization',
    name: 'EditPDF AI',
    alternateName: 'EditPDF',
    url: 'https://www.editpdfai.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.editpdfai.com/logo-square.svg',
      contentUrl: 'https://www.editpdfai.com/logo-square.svg',
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
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.editpdfai.com/#website',
    name: 'EditPDF AI',
    url: 'https://www.editpdfai.com',
    inLanguage: 'en',
    publisher: { '@id': 'https://www.editpdfai.com/#organization' },
    hasPart: [
      { '@id': 'https://www.editpdfai.com/pdf-editor', '@type': 'WebPage', name: 'PDF Editor' },
      { '@id': 'https://www.editpdfai.com/pdf-compressor', '@type': 'WebPage', name: 'PDF Compressor' },
      { '@id': 'https://www.editpdfai.com/pdf-merger', '@type': 'WebPage', name: 'PDF Merger' },
      { '@id': 'https://www.editpdfai.com/pdf-signer', '@type': 'WebPage', name: 'PDF Signer' },
      { '@id': 'https://www.editpdfai.com/pdf-ocr', '@type': 'WebPage', name: 'PDF OCR Scanner' },
      { '@id': 'https://www.editpdfai.com/ai-pdf-form-filler', '@type': 'WebPage', name: 'AI PDF Form Filler' },
    ],
  },
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
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AppleHome />
      <SitePopularTools />
      <LazyHomeScroll />
      <LazyHomeAllTools />
      <SiteUseCases />
      <SitePrivacyNote />
      <SitePricingPreview />
      <SiteFAQ />
      <SiteCTA />
      <SiteFooter />
      <MobileEditorShortcut />
    </>
  )
}
