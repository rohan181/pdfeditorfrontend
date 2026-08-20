import JsonLd from '@/components/JsonLd'
import { buildToolStructuredData } from '@/lib/seo/structuredData'

export default function ToolStructuredData({ slug }: { slug: string }) {
  return (
    <JsonLd
      id={`tool-structured-data-${slug}`}
      data={buildToolStructuredData(slug)}
    />
  )
}
