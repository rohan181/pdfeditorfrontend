import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['txt-to-pdf'])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/txt-to-pdf#webapp',
  provider: { '@id': 'https://www.editpdfai.com/#organization' },
  name: 'TXT to PDF Converter',
  url: 'https://www.editpdfai.com/txt-to-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert plain text TXT files to PDF online for free. Choose font, size and margins.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
