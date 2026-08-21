import { metadataFor } from '@/lib/seo/routes'
import JsonLd from '@/components/JsonLd'
import {
  buildFaqStructuredData,
  buildHomepageStructuredData,
} from '@/lib/seo/structuredData'
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
import SiteNav from '@/components/SiteNav'

export const metadata = metadataFor('home')

export default function HomePage() {
  return (
    <>
      <JsonLd id="homepage-structured-data" data={buildHomepageStructuredData()} />
      <JsonLd id="homepage-faq-structured-data" data={buildFaqStructuredData('/', FAQ_ITEMS)} />
      <SiteNav />
      <main id="main-content">
        <AppleHome />
        <SitePopularTools />
        <LazyHomeAllTools />
        <LazyHomeScroll />
        <SitePrivacyNote />
        <SiteUseCases />
        <SitePricingPreview />
        <SiteFAQ />
        <SiteCTA />
      </main>
      <SiteFooter />
      <MobileEditorShortcut />
    </>
  )
}
