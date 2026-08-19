import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { ORGANIZATION_ID } from '@/lib/seo/site'

export const metadata = buildToolMetadata(TOOL_METADATA['pdf-to-word'])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/pdf-to-word#webapp',
  provider: { '@id': ORGANIZATION_ID },
  name: 'PDF to Word Converter',
  url: 'https://www.editpdfai.com/pdf-to-word',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PDF to editable Word documents online for free. Preserves text, tables and layout.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
