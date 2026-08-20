import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { ORGANIZATION_ID } from '@/lib/seo/site'
import JsonLd from '@/components/JsonLd'
import { buildWebPageStructuredData } from '@/lib/seo/structuredData'

export const metadata = buildToolMetadata(TOOL_METADATA['contact'])

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="contact-page-structured-data"
        data={buildWebPageStructuredData({
          path: '/contact',
          name: 'Contact EditPDF AI',
          description: 'Contact EditPDF AI for product support, billing questions, privacy requests, bug reports and feature feedback.',
          type: 'ContactPage',
          mainEntityId: ORGANIZATION_ID,
        })}
      />
      {children}
    </>
  )
}
