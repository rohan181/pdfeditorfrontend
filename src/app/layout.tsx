import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono, Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import UpgradeGateProvider from '@/components/UpgradeGateProvider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-jakarta', display: 'swap' })
const dm = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dm', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mono', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'EditPDF AI — AI-Powered PDF Editor & Document Suite', template: '%s | EditPDF AI' },
  description: 'Edit, sign, annotate and AI-fill PDF forms online. The fastest AI PDF editor with intelligent form detection, e-signatures and instant completion.',
  keywords: 'AI PDF editor, edit PDF online, fill PDF forms, sign PDF, PDF form filler, AI document editor, PDF annotator, PDF OCR, PDF compressor, editpdfai',
  authors: [{ name: 'EditPDF AI', url: 'https://editpdfai.com' }],
  creator: 'EditPDF AI',
  publisher: 'EditPDF AI',
  category: 'technology',
  metadataBase: new URL('https://editpdfai.com'),
  alternates: {
    canonical: 'https://editpdfai.com',
  },
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
    title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
    description: 'Edit, sign, annotate and AI-fill PDF forms online. Intelligent form detection and instant completion.',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EditPDF AI — AI-Powered PDF Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@editpdfai',
    creator: '@editpdfai',
    title: 'EditPDF AI — AI-Powered PDF Editor',
    description: 'Edit, sign and AI-fill PDF forms online. Intelligent form detection and instant completion.',
    images: ['/og-image.png'],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${jakarta.variable} ${dm.variable} ${mono.variable} ${inter.variable}`}>
        <body style={{ fontFamily: 'var(--font-dm), system-ui, sans-serif' }}>
          <UpgradeGateProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
