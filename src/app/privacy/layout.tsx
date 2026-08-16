import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['privacy'])

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
