import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { SpeedInsights } from '@vercel/speed-insights/next'
import UpgradeGateProvider from '@/components/UpgradeGateProvider'
import './globals.css'

// Two font families only — Jakarta for headings (LCP-critical), DM Sans for body/UI
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-jakarta', display: 'swap' })
const dm = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-dm', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'EditPDF AI — Edit smarter. Finish faster.', template: '%s | EditPDF AI' },
  description: 'Edit smarter. Finish faster. AI-powered PDF editor with 35+ tools — edit, sign, OCR, translate, summarise and fill forms. Free, no account needed.',
  keywords: 'AI PDF editor, edit PDF online, fill PDF forms, sign PDF, PDF form filler, AI document editor, PDF annotator, PDF OCR, PDF compressor, editpdfai',
  authors: [{ name: 'EditPDF AI', url: 'https://editpdfai.com' }],
  creator: 'EditPDF AI',
  publisher: 'EditPDF AI',
  category: 'technology',
  metadataBase: new URL('https://editpdfai.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://editpdfai.com',
    siteName: 'EditPDF AI',
    title: 'EditPDF AI — Edit smarter. Finish faster.',
    description: 'Edit smarter. Finish faster. AI-powered PDF editor with 35+ tools — free, no account needed.',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'EditPDF AI — Edit smarter. Finish faster.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@editpdfai',
    creator: '@editpdfai',
    title: 'EditPDF AI — Edit smarter. Finish faster.',
    description: 'Edit smarter. Finish faster. AI-powered PDF editor with 35+ tools — free, no account needed.',
    images: ['/opengraph-image'],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${jakarta.variable} ${dm.variable}`}>
        <head>
          {/* next/font self-hosts Google Fonts — no external font CDN needed */}
          <link rel="preconnect" href="https://clerk.editpdfai.com" />
          <link rel="dns-prefetch" href="https://js.stripe.com" />
          <link rel="dns-prefetch" href="https://api.anthropic.com" />
        </head>
        <body style={{ fontFamily: 'var(--font-dm), system-ui, sans-serif' }}>
          <UpgradeGateProvider />
          {children}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
