import JsonLd from '@/components/JsonLd'
import { ORGANIZATION_STRUCTURED_DATA } from '@/lib/seo/structuredData'

export default function SiteJsonLd() {
  return <JsonLd id="organization-structured-data" data={ORGANIZATION_STRUCTURED_DATA} />
}
