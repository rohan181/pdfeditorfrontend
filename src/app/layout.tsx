import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ApplicationRuntime from '@/components/ApplicationRuntime'
import Analytics from '@/components/Analytics'
import SiteJsonLd from '@/components/SiteJsonLd'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SITE_DEFAULT_SEO } from '@/lib/seo/routes'
import { PRODUCTION_ORIGIN } from '@/lib/seo/site'
import './globals.css'

// Two font families only — Jakarta for headings (LCP-critical), DM Sans for body/UI
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: 'variable', variable: '--font-jakarta', display: 'swap' })
const dm = DM_Sans({ subsets: ['latin'], weight: 'variable', variable: '--font-dm', display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  ...buildPageMetadata(SITE_DEFAULT_SEO),
  category: 'technology',
  metadataBase: new URL(PRODUCTION_ORIGIN),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
          <SiteJsonLd />
        </head>
        <body style={{ fontFamily: 'var(--font-dm), system-ui, sans-serif' }}>
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          {children}
          <ApplicationRuntime />
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
