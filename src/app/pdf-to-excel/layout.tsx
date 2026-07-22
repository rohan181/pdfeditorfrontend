import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to Excel Converter Online Free — PDF to XLSX',
  description: 'Convert PDF tables and data to Excel spreadsheets online for free. Get an editable XLSX file with accurate rows and columns. AI-powered extraction. No signup.',
  keywords: 'PDF to Excel, PDF to XLSX, convert PDF to Excel online free, PDF table to Excel, PDF to spreadsheet converter',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-to-excel' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF to Excel Converter Online Free — PDF to XLSX',
    description: 'Convert PDF tables to editable Excel XLSX instantly. AI-powered accuracy. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-to-excel',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF to Excel Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Excel Converter Online Free',
    description: 'Convert PDF tables to editable Excel spreadsheets instantly. AI-powered. Free, no signup.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF to Excel Converter',
  url: 'https://www.editpdfai.com/pdf-to-excel',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert PDF tables and data to Excel spreadsheets online for free. AI-powered extraction.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
