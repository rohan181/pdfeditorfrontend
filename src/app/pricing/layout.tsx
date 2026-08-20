import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import JsonLd from '@/components/JsonLd'
import { PRICING_FAQS } from '@/lib/pricingData'
import { PRODUCT_ACCESS_SUMMARY } from '@/lib/productMessaging'
import {
  buildFaqStructuredData,
  buildWebPageStructuredData,
} from '@/lib/seo/structuredData'

export const metadata = buildToolMetadata(TOOL_METADATA['pricing'])

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="pricing-page-structured-data"
        data={buildWebPageStructuredData({
          path: '/pricing',
          name: 'EditPDF AI Pricing',
          description: PRODUCT_ACCESS_SUMMARY,
        })}
      />
      <JsonLd
        id="pricing-faq-structured-data"
        data={buildFaqStructuredData('/pricing', PRICING_FAQS)}
      />
      {children}
    </>
  )
}
