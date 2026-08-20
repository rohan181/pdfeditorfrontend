import { metadataFor } from '@/lib/seo/routes'

export const metadata = metadataFor('sign-up')

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
