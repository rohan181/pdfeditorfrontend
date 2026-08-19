import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { ORGANIZATION_ID } from '@/lib/seo/site'

export const metadata = buildToolMetadata(TOOL_METADATA['ppt-to-pdf'])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/ppt-to-pdf#webapp',
  provider: { '@id': ORGANIZATION_ID },
  name: 'PowerPoint to PDF Converter',
  url: 'https://www.editpdfai.com/ppt-to-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PowerPoint presentations to PDF online for free. Preserves fonts, images and all slides.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
