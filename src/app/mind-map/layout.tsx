import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { ORGANIZATION_ID } from '@/lib/seo/site'

export const metadata = buildToolMetadata(TOOL_METADATA['mind-map'])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/mind-map#webapp',
  provider: { '@id': ORGANIZATION_ID },
  name: 'AI Mind Map Generator',
  url: 'https://www.editpdfai.com/mind-map',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Generate visual mind maps from any PDF with AI. Turn reports, research papers and notes into structured mind maps.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
