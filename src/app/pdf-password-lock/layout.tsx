import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Password Lock — Password Protect PDF Free Online',
  description: 'Add a password to any PDF instantly. Encrypt your PDF with 128-bit security in your browser — free, no upload, no account required.',
  keywords: 'PDF password lock, password protect PDF, encrypt PDF, PDF security, lock PDF online, PDF password free',
  alternates: { canonical: 'https://editpdfai.com/pdf-password-lock' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF Password Lock — Password Protect PDF Free Online',
    description: 'Add a password to any PDF instantly. 128-bit encryption, free, no account.',
    type: 'website',
    url: 'https://editpdfai.com/pdf-password-lock',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF Password Lock' }],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
