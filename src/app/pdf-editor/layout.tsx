import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'

export const metadata = buildToolMetadata(TOOL_METADATA['pdf-editor'])

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://www.editpdfai.com/pdf-editor#webapp',
  name: 'PDF Editor',
  url: 'https://www.editpdfai.com/pdf-editor',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', name: 'Free PDF Editor', price: '0', priceCurrency: 'USD', url: 'https://www.editpdfai.com/pdf-editor' },
  provider: { '@type': 'Organization', '@id': 'https://www.editpdfai.com/#organization', name: 'EditPDF AI', url: 'https://www.editpdfai.com' },
  image: 'https://www.editpdfai.com/social/pdf-editor.png',
  description: 'Edit any PDF online — add text, images, shapes, highlights, signatures and stamps. Rotate, reorder and delete pages. Free, no signup.',
  featureList: ['Text editing', 'Image insertion', 'Shapes', 'Highlights', 'Signatures', 'Stamps', 'Page management', 'PDF annotations'],
  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
  inLanguage: 'en',
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How can I edit a PDF online for free without signing up?', acceptedAnswer: { '@type': 'Answer', text: 'Upload your file to the free PDF Editor and start editing immediately. There is no subscription, credit card or account required. Add text, images, annotations or signatures, then download the completed PDF.' } },
    { '@type': 'Question', name: 'Can I edit a scanned PDF?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can add text, highlights, drawings, signatures and other content over a scanned PDF. Use the separate PDF OCR tool when you need to extract selectable text from scanned pages.' } },
    { '@type': 'Question', name: 'Can I add a digital signature?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Draw a freehand signature, type your name in a handwriting style, or upload a signature image and place it anywhere on the document with drag-and-drop precision.' } },
    { '@type': 'Question', name: 'Is my file uploaded to a server?', acceptedAnswer: { '@type': 'Answer', text: 'No. All editing happens locally inside your browser. Your PDF never leaves your device — nothing is stored or transmitted.' } },
    { '@type': 'Question', name: 'Can I reorder or delete pages?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Open the Page Manager panel to drag pages into any order, rotate individual pages, delete unwanted ones, or insert blank pages anywhere.' } },
    { '@type': 'Question', name: 'What is the difference between this and the AI Form Filler?', acceptedAnswer: { '@type': 'Answer', text: 'The PDF Editor focuses on manual editing — text, images, shapes, signatures and page management. The AI Form Filler adds conversational AI that detects and auto-fills form fields from your context.' } },
  ],
}

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.editpdfai.com/' },
    { '@type': 'ListItem', position: 2, name: 'Free Online PDF Editor', item: 'https://www.editpdfai.com/pdf-editor' },
  ],
}

export default function PDFEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  )
}
