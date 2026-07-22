import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Watermarker — Add Text & Image Watermarks to PDFs Free',
  description:
    'Add custom text or image watermarks to any PDF online for free. Control position, opacity, angle, font size and color. No signup, no install — works in your browser.',
  keywords:
    'PDF watermark, add watermark to PDF, watermark PDF online, text watermark, image watermark, free PDF watermark tool, PDF stamp, watermark remover',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-watermark' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF Watermarker — Add Text & Image Watermarks to PDFs Free',
    description:
      'Add custom text or image watermarks to any PDF. Control opacity, angle, position and color. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-watermark',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-watermark.png', width: 1200, height: 630, alt: 'PDF Watermarker — Add Watermarks Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Watermarker — Add Text & Image Watermarks to PDFs Free',
    description: 'Add custom text or image watermarks to any PDF. Free, no signup required.',
    images: ['/social/pdf-watermark.png'],
  },
}

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Watermarker',
  url: 'https://www.editpdfai.com/pdf-watermark',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Add custom text or image watermarks to any PDF online. Control opacity, angle, position, color and font size. Free, no signup.',
  featureList: 'Text Watermarks, Image Watermarks, Opacity Control, Angle Control, Position Control, Color Selection, Font Size, Batch All Pages',
  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Can I add a watermark to every page at once?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Apply a watermark to all pages simultaneously or choose specific pages.' } },
    { '@type': 'Question', name: 'Can I control the opacity of the watermark?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Use the opacity slider to set the watermark from fully visible to nearly invisible.' } },
    { '@type': 'Question', name: 'Can I rotate the watermark text?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Set any rotation angle — the classic diagonal watermark is the default at 45°.' } },
    { '@type': 'Question', name: 'Is my PDF uploaded to your servers?', acceptedAnswer: { '@type': 'Answer', text: 'No. All processing happens locally in your browser. Your file is never sent to any server.' } },
    { '@type': 'Question', name: 'Can I add an image as a watermark?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Upload any PNG or JPG image as a watermark and control its size, position and opacity.' } },
  ],
}

export default function PDFWatermarkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      {children}
    </>
  )
}
