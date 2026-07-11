import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Form Builder Online Free — Create Fillable PDF Forms',
  description: 'Build fillable PDF forms online for free. Add text fields, checkboxes, dropdowns, signatures and more. Create professional forms without any design software.',
  keywords: 'PDF form builder, create fillable PDF, make PDF form online, PDF form creator, fillable PDF builder, online form creator PDF',
  alternates: { canonical: 'https://editpdfai.com/pdf-form-builder' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF Form Builder Online Free — Create Fillable PDF Forms',
    description: 'Create professional fillable PDF forms with text fields, checkboxes, signatures and more. Free online.',
    type: 'website',
    url: 'https://editpdfai.com/pdf-form-builder',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF Form Builder Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Form Builder Online Free',
    description: 'Create professional fillable PDF forms with drag-and-drop. Free, no signup needed.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Form Builder',
  url: 'https://editpdfai.com/pdf-form-builder',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Build fillable PDF forms online for free. Add text fields, checkboxes, dropdowns, signatures and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
