import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { ORGANIZATION_ID } from '@/lib/seo/site'

export const metadata = buildToolMetadata(TOOL_METADATA['contact'])

// mainEntity references the Organization by @id rather than repeating it —
// the full entity (name, contactPoint, etc.) is already rendered on this
// page by <SiteJsonLd /> in the root layout.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact EditPDF AI',
  url: 'https://www.editpdfai.com/contact',
  mainEntity: { '@id': ORGANIZATION_ID },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
