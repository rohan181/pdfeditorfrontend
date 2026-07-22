import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Excel to PDF Converter Online Free — XLSX to PDF',
  description: 'Convert Excel spreadsheets to PDF online for free. Upload XLSX or XLS files and download a perfectly formatted PDF. Preserves tables and data. No signup.',
  keywords: 'Excel to PDF, XLSX to PDF, convert Excel to PDF online free, XLS to PDF converter, spreadsheet to PDF',
  alternates: { canonical: 'https://www.editpdfai.com/excel-to-pdf' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Excel to PDF Converter Online Free — XLSX to PDF',
    description: 'Convert Excel XLSX and XLS files to PDF instantly. Preserves tables and formatting. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/excel-to-pdf',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/excel-to-pdf.png', width: 1200, height: 630, alt: 'Excel to PDF Converter Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excel to PDF Converter Online Free',
    description: 'Convert Excel spreadsheets to PDF instantly. Free, no signup needed.',
    images: ['/social/excel-to-pdf.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Excel to PDF Converter',
  url: 'https://www.editpdfai.com/excel-to-pdf',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert Excel spreadsheets to PDF online for free. Preserves tables and formatting.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
