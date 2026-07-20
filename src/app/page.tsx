import type { Metadata } from 'next'
import AppleHome from '@/components/AppleHome'
import SitePopularTools from '@/components/SitePopularTools'
import SiteUseCases from '@/components/SiteUseCases'
import SitePrivacyNote from '@/components/SitePrivacyNote'
import SitePricingPreview from '@/components/SitePricingPreview'
import HomeScroll from '@/components/HomeScroll'
import HomeAllTools from '@/components/HomeAllTools'
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
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EditPDF AI',
    url: 'https://www.editpdfai.com',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Edit smarter. Finish faster. AI-powered PDF editor with 35+ tools — free, no account needed.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EditPDF AI',
    alternateName: 'EditPDF',
    url: 'https://www.editpdfai.com',
    logo: 'https://www.editpdfai.com/logo.png',
    sameAs: [
      'https://twitter.com/editpdfai',
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
    name: 'EditPDF AI',
    url: 'https://www.editpdfai.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.editpdfai.com/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
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
      <SiteUseCases />
      <SitePrivacyNote />
      <SitePricingPreview />
      <HomeScroll />
      <HomeAllTools />
      <SiteFAQ />
      <SiteCTA />
      <SiteFooter />
    </>
  )
}
