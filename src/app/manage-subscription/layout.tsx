import { metadataFor } from '@/lib/seo/routes'

export const metadata = metadataFor('manage-subscription')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
