import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['contact'])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact EditPDF AI',
  url: 'https://www.editpdfai.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'EditPDF AI',
    url: 'https://www.editpdfai.com',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@editpdfai.com',
      contactType: 'customer support',
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
