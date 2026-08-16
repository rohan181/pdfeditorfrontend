import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['extract-pages'])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/extract-pages#webapp',
  provider: { '@id': 'https://www.editpdfai.com/#organization' },
  name: 'Extract PDF Pages',
  url: 'https://www.editpdfai.com/extract-pages',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Extract specific pages from a PDF online for free. Save selected pages as a new PDF document.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
