import { metadataFor } from '@/lib/seo/routes'

export const metadata = metadataFor('checkout-confirm')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
