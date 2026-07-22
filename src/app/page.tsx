import type { Metadata } from 'next'
import AppleHome from '@/components/AppleHome'
import SitePopularTools from '@/components/SitePopularTools'
import SiteUseCases from '@/components/SiteUseCases'
import SitePrivacyNote from '@/components/SitePrivacyNote'
import SitePricingPreview from '@/components/SitePricingPreview'
import LazyHomeScroll from '@/components/LazyHomeScroll'
import LazyHomeAllTools from '@/components/LazyHomeAllTools'
import SiteFAQ from '@/components/SiteFAQ'
import SiteCTA from '@/components/SiteCTA'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: { absolute: 'Free Online PDF Editor – Edit, Sign, Fill & Convert | EditPDF AI' },
  description: 'Edit smarter. Finish faster. AI-powered PDF editor with 35+ tools — edit, sign, OCR, translate, summarise and fill forms. Free, no account needed.',
  keywords: 'AI PDF editor, edit PDF online, fill PDF forms, sign PDF, PDF form filler, AI document editor, editpdfai',
  alternates: { canonical: 'https://www.editpdfai.com' },
  openGraph: {
    title: 'Free Online PDF Editor – Edit, Sign, Fill & Convert | EditPDF AI',
    description: 'Edit smarter. Finish faster. AI-powered PDF editor with 35+ tools — free, no account needed.',
    type: 'website',
    url: 'https://www.editpdfai.com',
    siteName: 'EditPDF AI',
    images: [{
      url: '/social/home.png',
      width: 1200,
      height: 630,
      alt: 'EditPDF AI — Free online PDF editor with 35+ tools',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online PDF Editor — Edit, Sign, Fill & Convert',
    description: 'Edit smarter with 35+ PDF tools for editing, signing, OCR, conversion and AI workflows.',
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
    description: 'Edit smarter. Finish faster. AI-powered PDF editor with 35+ tools — free, no account needed.',
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
    </>
  )
}
