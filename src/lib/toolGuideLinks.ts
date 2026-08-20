export interface ToolGuideLink {
  href: `/guides/${string}`
  label: string
}

export const TOOL_GUIDES: Readonly<Record<string, readonly ToolGuideLink[]>> = {
  'pdf-editor': [{ href: '/guides/how-to-edit-a-pdf-without-adobe', label: 'How to edit a PDF without Adobe Acrobat' }],
  'pdf-viewer': [{ href: '/guides/pdf-vs-word-which-format-to-use', label: 'PDF vs Word: which document format should you use?' }],
  'pdf-compressor': [{ href: '/guides/how-to-reduce-pdf-file-size', label: 'How to reduce PDF file size and manage image quality' }],
  'ai-pdf-form-filler': [{ href: '/guides/how-to-fill-out-a-pdf-form-automatically', label: 'How to fill out a PDF form automatically with AI' }],
  'pdf-signer': [{ href: '/guides/how-to-sign-a-pdf-online', label: 'How to sign a PDF online without printing' }],
  'pdf-ocr': [{ href: '/guides/how-to-make-a-scanned-pdf-searchable', label: 'How to make a scanned PDF searchable' }],
  'pdf-merger': [{ href: '/guides/how-to-merge-pdf-files', label: 'How to merge PDF files in a browser' }],
  'pdf-splitter': [{ href: '/guides/how-to-merge-pdf-files', label: 'How to merge separated PDF files into one document' }],
  'extract-pages': [{ href: '/guides/how-to-extract-pages-from-a-pdf', label: 'How to extract selected pages into a new PDF' }],
  'pdf-page-manager': [{ href: '/guides/how-to-reorder-pages-in-a-pdf', label: 'How to reorder PDF pages and save the new sequence' }],
  'pdf-redactor': [{ href: '/guides/how-to-redact-sensitive-information-from-a-pdf', label: 'How to cover PDF content and verify sensitive data removal' }],
  'word-to-pdf': [{ href: '/guides/pdf-vs-word-which-format-to-use', label: 'PDF vs Word: which document format should you use?' }],
  'pdf-to-word': [{ href: '/guides/pdf-vs-word-which-format-to-use', label: 'PDF vs Word: which document format should you use?' }],
  'pdf-summarizer': [{ href: '/guides/how-to-make-a-scanned-pdf-searchable', label: 'Make scanned PDF text searchable before summarizing it' }],
  'pdf-translator': [{ href: '/guides/how-to-make-a-scanned-pdf-searchable', label: 'Make a scanned PDF searchable before translating it' }],
  'image-to-pdf': [
    { href: '/guides/how-to-combine-images-into-one-pdf', label: 'How to combine JPG and PNG images into one PDF' },
    { href: '/guides/how-to-make-a-scanned-pdf-searchable', label: 'Make an image-based PDF searchable with OCR' },
  ],
  'quiz-creator': [{ href: '/guides/how-to-make-a-scanned-pdf-searchable', label: 'Prepare scanned PDF text before creating a quiz' }],
}
