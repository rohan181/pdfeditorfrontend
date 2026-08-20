import { metadataFor } from '@/lib/seo/routes'

export const metadata = metadataFor('sign-in')

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
