import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Pricing & Plans | EditPDF AI' },
  description: 'Compare EditPDF AI free and Pro plans. Upgrade for unlimited AI form filling, OCR, translation, mind maps, quiz creation and priority processing. Cancel anytime.',
  keywords: 'EditPDF AI pricing, PDF editor plans, AI PDF editor price, EditPDF AI Pro, PDF tool subscription',
  alternates: { canonical: 'https://editpdfai.com/pricing' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pricing & Plans | EditPDF AI',
    description: 'Compare free and Pro plans. Unlimited AI tools, OCR, translation and more with Pro. Cancel anytime.',
    type: 'website',
    url: 'https://editpdfai.com/pricing',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EditPDF AI Pricing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Plans | EditPDF AI',
    description: 'Compare free and Pro plans. Unlimited AI tools with Pro. Cancel anytime.',
    images: ['/opengraph-image'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
