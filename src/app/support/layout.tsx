import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support — EditPDF AI Help Center',
  description: 'Find answers to common questions about EditPDF AI tools, billing and account management. Contact support if you need further help.',
  alternates: { canonical: 'https://editpdfai.com/support' },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
