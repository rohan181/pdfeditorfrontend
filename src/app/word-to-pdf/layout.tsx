import ToolStructuredData from '@/components/ToolStructuredData'
import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['word-to-pdf'])

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolStructuredData slug="word-to-pdf" />
      {children}
    </>
  )
}
