export interface ToolMeta {
  slug: string
  name: string
  desc: string
}

const toolMeta: ToolMeta[] = [
  { slug: 'pdf-splitter',       name: 'PDF Splitter',         desc: 'Split a PDF into separate files by page range' },
  { slug: 'pdf-merger',         name: 'PDF Merger',           desc: 'Combine multiple PDFs into one document' },
  { slug: 'pdf-compressor',     name: 'PDF Compressor',       desc: 'Reduce PDF file size without losing quality' },
  { slug: 'pdf-signer',         name: 'PDF Signer',           desc: 'Sign any PDF electronically in seconds' },
  { slug: 'pdf-watermark',      name: 'PDF Watermark',        desc: 'Add text or image watermarks to every page' },
  { slug: 'pdf-password-lock',  name: 'PDF Password Lock',    desc: 'Encrypt your PDF with AES-256 password protection' },
  { slug: 'image-to-pdf',       name: 'Image to PDF',         desc: 'Convert JPG, PNG, and other images into a PDF' },
  { slug: 'word-to-pdf',        name: 'Word to PDF',          desc: 'Convert Word documents to PDF with layout preserved' },
  { slug: 'pdf-to-word',        name: 'PDF to Word',          desc: 'Convert PDF into an editable Word document' },
  { slug: 'pdf-to-excel',       name: 'PDF to Excel',         desc: 'Extract tables from PDF into a spreadsheet' },
  { slug: 'pdf-to-images',      name: 'PDF to Images',        desc: 'Convert PDF pages to JPG or PNG images' },
  { slug: 'pdf-to-ppt',         name: 'PDF to PowerPoint',    desc: 'Turn PDF pages into editable PowerPoint slides' },
  { slug: 'excel-to-pdf',       name: 'Excel to PDF',         desc: 'Convert Excel spreadsheets to PDF format' },
  { slug: 'ppt-to-pdf',         name: 'PowerPoint to PDF',    desc: 'Save presentation slides as a PDF file' },
  { slug: 'html-to-pdf',        name: 'HTML to PDF',          desc: 'Convert webpages or HTML files to PDF' },
  { slug: 'txt-to-pdf',         name: 'TXT to PDF',           desc: 'Convert plain text files into formatted PDFs' },
  { slug: 'odt-to-pdf',         name: 'ODT to PDF',           desc: 'Convert LibreOffice documents to PDF' },
  { slug: 'rtf-to-pdf',         name: 'RTF to PDF',           desc: 'Convert Rich Text Format files to PDF' },
  { slug: 'pdf-ocr',            name: 'PDF OCR',              desc: 'Extract text from scanned PDFs and images' },
  { slug: 'pdf-summarizer',     name: 'PDF Summarizer',       desc: 'Get an AI-generated summary of any PDF' },
  { slug: 'pdf-translator',     name: 'PDF Translator',       desc: 'Translate PDF documents into 50+ languages' },
  { slug: 'pdf-redactor',       name: 'PDF Redactor',         desc: 'Permanently remove sensitive content from PDFs' },
  { slug: 'pdf-annotate',       name: 'PDF Annotate',         desc: 'Highlight, comment, and mark up PDF documents' },
  { slug: 'pdf-form-builder',   name: 'PDF Form Builder',     desc: 'Create fillable PDF forms with drag-and-drop fields' },
  { slug: 'ai-pdf-form-filler', name: 'AI PDF Form Filler',   desc: 'Autofill any PDF form using AI in seconds' },
  { slug: 'mind-map',           name: 'PDF Mind Map',         desc: 'Generate a visual mind map from any PDF' },
  { slug: 'quiz-creator',       name: 'Quiz Creator',         desc: 'Create quiz questions automatically from a PDF' },
  { slug: 'pdf-editor',         name: 'PDF Editor',           desc: 'Edit text, images, and pages in any PDF' },
  { slug: 'pdf-viewer',         name: 'PDF Viewer',           desc: 'Open and read any PDF in your browser' },
  { slug: 'pdf-cropper',        name: 'PDF Cropper',          desc: 'Crop and trim PDF page margins and borders' },
  { slug: 'rotate-pdf',         name: 'Rotate PDF',           desc: 'Fix page orientation in any PDF instantly' },
  { slug: 'extract-pages',      name: 'Extract Pages',        desc: 'Pull specific pages from a PDF into a new file' },
  { slug: 'delete-pages',       name: 'Delete Pages',         desc: 'Remove unwanted pages from a PDF' },
  { slug: 'add-page-numbers',   name: 'Add Page Numbers',     desc: 'Number the pages of any PDF document' },
  { slug: 'pdf-page-manager',   name: 'PDF Page Manager',     desc: 'Reorder, rotate, and delete pages all in one place' },
]

export const toolMetaMap = Object.fromEntries(toolMeta.map(t => [t.slug, t]))

export default toolMeta
