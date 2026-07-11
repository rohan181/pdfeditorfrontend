import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — EditPDF AI',
  description: 'Read the EditPDF AI terms of service. Understand the conditions of use for our PDF editing, conversion and AI tools.',
  alternates: { canonical: 'https://editpdfai.com/terms' },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
