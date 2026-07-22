import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Editor — Edit, Annotate & Sign PDFs Online Free',
  description:
    'Edit any PDF online for free. Add text, images, shapes, highlights, signatures and stamps. Rotate, reorder and delete pages. No signup, no install — works in your browser.',
  keywords:
    'PDF editor, edit PDF online, annotate PDF, sign PDF, add text to PDF, PDF page editor, free PDF editor, PDF markup, PDF annotator',
  alternates: { canonical: 'https://www.editpdfai.com/pdf-editor' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'PDF Editor — Edit, Annotate & Sign PDFs Online Free',
    description:
      'Add text, images, shapes, signatures and stamps to any PDF. Reorder and rotate pages. Free, no signup.',
    type: 'website',
    url: 'https://www.editpdfai.com/pdf-editor',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/pdf-editor.png', width: 1200, height: 630, alt: 'PDF Editor — Edit PDFs Online Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Editor — Edit, Annotate & Sign PDFs Online Free',
    description: 'Add text, images, shapes, signatures and stamps to any PDF. Free, no signup required.',
    images: ['/social/pdf-editor.png'],
  },
}

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Editor',
  url: 'https://www.editpdfai.com/pdf-editor',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Edit any PDF online — add text, images, shapes, highlights, signatures and stamps. Rotate, reorder and delete pages. Free, no signup.',
  featureList: 'Text Editing, Image Insertion, Shapes, Highlights, Signatures, Stamps, Page Management, Annotations',
  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Can I edit any PDF for free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The PDF Editor is completely free with no subscription or account required. Upload any PDF and start editing immediately.' } },
    { '@type': 'Question', name: 'Does the PDF editor work on scanned documents?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The built-in OCR engine can process scanned and image-based PDFs, making them fully editable.' } },
    { '@type': 'Question', name: 'Can I add a signature to my PDF?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Draw a freehand signature, type your name, or upload a signature image and place it anywhere on the document.' } },
    { '@type': 'Question', name: 'Is my file stored on your servers?', acceptedAnswer: { '@type': 'Answer', text: 'No. All editing happens locally in your browser. Your PDF is never uploaded or stored on any server.' } },
    { '@type': 'Question', name: 'Can I reorder or delete pages?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Use the Page Manager to drag pages into any order, rotate them, delete unwanted ones, or add blank pages.' } },
  ],
}

export default function PDFEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      {children}
    </>
  )
}
