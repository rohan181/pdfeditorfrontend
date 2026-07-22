import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TXT to PDF Converter Online Free — Text File to PDF',
  description: 'Convert plain text TXT files to PDF online for free. Choose font, size and margins. Download a clean, formatted PDF in seconds. No signup required.',
  keywords: 'TXT to PDF, text to PDF, convert TXT to PDF online free, plain text to PDF, text file to PDF converter',
  alternates: { canonical: 'https://www.editpdfai.com/txt-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'TXT to PDF Converter Online Free — Text File to PDF',
    description: 'Convert plain text TXT files to clean PDFs. Choose font and formatting. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/txt-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'TXT to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TXT to PDF Converter Online Free',
    description: 'Convert plain text files to PDF instantly. Free, no signup needed.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TXT to PDF Converter',
  url: 'https://www.editpdfai.com/txt-to-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert plain text TXT files to PDF online for free. Choose font, size and margins.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
