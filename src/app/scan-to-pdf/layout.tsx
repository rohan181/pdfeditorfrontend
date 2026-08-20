import ToolStructuredData from '@/components/ToolStructuredData'
import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['scan-to-pdf'])

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolStructuredData slug="scan-to-pdf" />
      {children}
    </>
  )
}
