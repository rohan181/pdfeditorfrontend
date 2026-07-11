import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — EditPDF AI',
  description: 'Read the EditPDF AI privacy policy. Learn how we handle your data, what we collect and your rights under GDPR and CCPA.',
  alternates: { canonical: 'https://editpdfai.com/privacy' },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
