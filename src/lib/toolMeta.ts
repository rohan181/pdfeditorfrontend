export interface ToolMeta {
  slug: string
  name: string
  desc: string
  access: 'core' | 'metered-ai' | 'core-with-ai'
}

const AI_ONLY_TOOL_SLUGS = new Set([
  'ai-pdf-form-filler',
  'chat-with-pdf',
  'mind-map',
  'pdf-ocr',
  'pdf-summarizer',
  'pdf-to-excel',
  'pdf-to-ppt',
  'pdf-to-word',
  'pdf-translator',
  'quiz-creator',
])

const CORE_WITH_AI_TOOL_SLUGS = new Set(['pdf-editor', 'pdf-form-builder'])

const rawToolMeta: Omit<ToolMeta, 'access'>[] = [
  { slug: 'pdf-splitter',       name: 'PDF Splitter',         desc: 'Split a PDF into separate files by page range' },
  { slug: 'pdf-merger',         name: 'PDF Merger',           desc: 'Combine multiple PDFs into one document' },
  { slug: 'pdf-compressor',     name: 'PDF Compressor',       desc: 'Reduce PDF file size with adjustable image quality' },
  { slug: 'pdf-signer',         name: 'PDF Signer',           desc: 'Place a typed, drawn, or uploaded signature on a PDF' },
  { slug: 'pdf-watermark',      name: 'PDF Watermark',        desc: 'Add text or image watermarks to every page' },
  { slug: 'pdf-password-lock',  name: 'PDF Password Lock',    desc: 'Encrypt your PDF with AES-256 password protection' },
  { slug: 'pdf-unlock',         name: 'Unlock PDF',           desc: 'Remove a known password from an authorized PDF' },
  { slug: 'pdf-repair',         name: 'Repair PDF',           desc: 'Recover and rebuild a damaged PDF structure' },
  { slug: 'pdf-flatten',        name: 'Flatten PDF',          desc: 'Make PDF forms and annotations permanent' },
  { slug: 'pdf-compare',        name: 'Compare PDF',          desc: 'Find visual and text changes between two PDFs' },
  { slug: 'remove-pdf-metadata', name: 'Remove PDF Metadata',  desc: 'Strip hidden properties and identifiers from a PDF' },
  { slug: 'extract-pdf-attachments', name: 'Extract PDF Attachments', desc: 'Download files embedded inside a PDF' },
  { slug: 'extract-pdf-images', name: 'Extract PDF Images', desc: 'Recover bitmap images used inside PDF pages' },
  { slug: 'export-pdf-form-data', name: 'Export PDF Form Data', desc: 'Download fillable PDF field data as CSV or JSON' },
  { slug: 'extract-pdf-bookmarks', name: 'Extract PDF Bookmarks', desc: 'Export a PDF outline tree and page destinations' },
  { slug: 'pdf-bookmarks-manager', name: 'PDF Bookmarks Manager', desc: 'Add, edit, organize, or remove PDF bookmarks' },
  { slug: 'pdf-page-labels', name: 'PDF Page Labels', desc: 'Set Roman numerals, prefixes, letters, and numbering ranges' },
  { slug: 'extract-pdf-links', name: 'Extract PDF Links', desc: 'Audit clickable links, destinations, and page locations' },
  { slug: 'remove-pdf-links', name: 'Remove PDF Links', desc: 'Disable clickable links while preserving visible page content' },
  { slug: 'export-pdf-comments', name: 'Export PDF Comments', desc: 'Download comments, highlights, markup, authors, and replies' },
  { slug: 'image-to-pdf',       name: 'Image to PDF',         desc: 'Convert JPG, PNG, and other images into a PDF' },
  { slug: 'scan-to-pdf',        name: 'Scan to PDF',          desc: 'Use your camera to scan documents into a PDF' },
  { slug: 'word-to-pdf',        name: 'Word to PDF',          desc: 'Rebuild supported DOCX content in a new PDF layout' },
  { slug: 'pdf-to-word',        name: 'PDF to Word',          desc: 'Convert PDF into an editable Word document' },
  { slug: 'pdf-to-excel',       name: 'PDF to Excel',         desc: 'Extract tables from PDF into a spreadsheet' },
  { slug: 'pdf-to-images',      name: 'PDF to Images',        desc: 'Convert PDF pages to JPG or PNG images' },
  { slug: 'pdf-to-ppt',         name: 'PDF to PowerPoint',    desc: 'Draft an editable PowerPoint outline from extracted PDF text' },
  { slug: 'excel-to-pdf',       name: 'Excel to PDF',         desc: 'Convert Excel spreadsheets to PDF format' },
  { slug: 'ppt-to-pdf',         name: 'PowerPoint to PDF',    desc: 'Rebuild supported PPTX slide text as PDF pages' },
  { slug: 'html-to-pdf',        name: 'HTML to PDF',          desc: 'Convert pasted or uploaded HTML into an image-based PDF' },
  { slug: 'txt-to-pdf',         name: 'TXT to PDF',           desc: 'Convert plain text files into formatted PDFs' },
  { slug: 'odt-to-pdf',         name: 'ODT to PDF',           desc: 'Convert LibreOffice documents to PDF' },
  { slug: 'rtf-to-pdf',         name: 'RTF to PDF',           desc: 'Convert Rich Text Format files to PDF' },
  { slug: 'pdf-ocr',            name: 'PDF OCR',              desc: 'Extract text from scanned or image-based PDFs' },
  { slug: 'pdf-summarizer',     name: 'PDF Summarizer',       desc: 'Create an AI-generated summary from extracted PDF text' },
  { slug: 'chat-with-pdf',      name: 'Chat with PDF',         desc: 'Ask questions and get answers with page citations' },
  { slug: 'pdf-translator',     name: 'PDF Translator',       desc: 'Translate PDF documents into 77 languages' },
  { slug: 'pdf-redactor',       name: 'PDF Redactor',         desc: 'Place opaque cover boxes over selected PDF areas' },
  { slug: 'pdf-annotate',       name: 'PDF Annotate',         desc: 'Highlight, comment, and mark up PDF documents' },
  { slug: 'pdf-form-builder',   name: 'PDF Form Builder',     desc: 'Create fillable PDF forms with drag-and-drop fields' },
  { slug: 'ai-pdf-form-filler', name: 'AI PDF Form Filler',   desc: 'Suggest values for detected PDF form fields with AI' },
  { slug: 'mind-map',           name: 'PDF Mind Map',         desc: 'Generate a visual mind map from extracted PDF text' },
  { slug: 'quiz-creator',       name: 'Quiz Creator',         desc: 'Create quiz questions automatically from a PDF' },
  { slug: 'pdf-editor',         name: 'PDF Editor',           desc: 'Add text, images, annotations, and page changes to PDFs' },
  { slug: 'pdf-viewer',         name: 'PDF Viewer',           desc: 'Open and read compatible PDF files in your browser' },
  { slug: 'pdf-cropper',        name: 'PDF Cropper',          desc: 'Crop and trim PDF page margins and borders' },
  { slug: 'rotate-pdf',         name: 'Rotate PDF',           desc: 'Rotate PDF pages by 90, 180, or 270 degrees' },
  { slug: 'extract-pages',      name: 'Extract Pages',        desc: 'Pull specific pages from a PDF into a new file' },
  { slug: 'delete-pages',       name: 'Delete Pages',         desc: 'Remove unwanted pages from a PDF' },
  { slug: 'add-page-numbers',   name: 'Add Page Numbers',     desc: 'Add configurable numbering to PDF pages' },
  { slug: 'pdf-page-manager',   name: 'PDF Page Manager',     desc: 'Reorder, rotate, and delete pages all in one place' },
]

const toolMeta: ToolMeta[] = rawToolMeta.map(tool => ({
  ...tool,
  access: AI_ONLY_TOOL_SLUGS.has(tool.slug)
    ? 'metered-ai'
    : CORE_WITH_AI_TOOL_SLUGS.has(tool.slug)
      ? 'core-with-ai'
      : 'core',
}))

export const toolMetaMap = Object.fromEntries(toolMeta.map(t => [t.slug, t]))

// Single source of truth for "how many tools does this site have" copy —
// Import this instead of hardcoding a catalogue total so the number cannot drift from
// the actual registry as tools are added or removed.
export const TOOL_COUNT = toolMeta.length
export const AI_TOOL_COUNT = toolMeta.filter(tool => tool.access !== 'core').length
export const CORE_TOOL_COUNT = toolMeta.filter(tool => tool.access !== 'metered-ai').length

export default toolMeta
