import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-jakarta', display: 'swap' })
const dm = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dm', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'EditPDF AI — AI-Powered PDF Editor & Document Suite', template: '%s | EditPDF AI' },
  description: 'Edit, sign, annotate and AI-fill PDF forms online. The fastest AI PDF editor with intelligent form detection, e-signatures and instant completion.',
  keywords: 'AI PDF editor, edit PDF online, fill PDF forms, sign PDF, PDF form filler, AI document editor, editpdfai',
  authors: [{ name: 'EditPDF AI' }],
  creator: 'EditPDF AI',
  metadataBase: new URL('https://editpdfai.com'),
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    siteName: 'EditPDF AI',
    title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
    description: 'Edit, sign, annotate and AI-fill PDF forms online. Intelligent form detection and instant completion.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@editpdfai',
    title: 'EditPDF AI — AI-Powered PDF Editor',
    description: 'Edit, sign and AI-fill PDF forms online. Intelligent form detection and instant completion.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dm.variable} ${mono.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
