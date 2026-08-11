import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flatten PDF Online - Make Forms and Annotations Permanent',
  description: 'Flatten PDF form fields or bake every visible page element into a consistent copy. Free private browser processing with no file upload or account.',
  keywords: 'flatten PDF, flatten PDF form, flatten annotations, make PDF non editable, flatten PDF online, bake PDF comments',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-flatten' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Flatten PDF Online - Make Forms and Annotations Permanent',
    description: 'Choose a quality-preserving form flatten or a complete visual flatten. Free and private in your browser.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-flatten',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EditPDF AI Flatten PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flatten PDF Online - Make Forms and Annotations Permanent',
    description: 'Flatten PDF forms and visible annotations privately in your browser.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flatten PDF',
  url: 'https://www.editpdfai.com/pdf-flatten',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Make PDF form fields or every visible page element permanent using private browser processing.',
  featureList: 'Quality-preserving form flattening, full visual flattening, signature detection, local browser processing, no file upload',
  browserRequirements: 'Requires JavaScript. Works in current versions of Chrome, Firefox, Safari, and Edge.',
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com' },
    { '@type': 'ListItem', position: 2, name: 'Flatten PDF', item: 'https://www.editpdfai.com/pdf-flatten' },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  )
}
