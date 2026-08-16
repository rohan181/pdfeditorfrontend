import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['pdf-to-excel'])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/pdf-to-excel#webapp',
  provider: { '@id': 'https://www.editpdfai.com/#organization' },
  name: 'PDF to Excel Converter',
  url: 'https://www.editpdfai.com/pdf-to-excel',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PDF tables and data to Excel spreadsheets online for free. AI-powered extraction.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
