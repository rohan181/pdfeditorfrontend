import toolMeta, { type ToolMeta } from './toolMeta'
import { FREE_AI_DAILY_LIMIT } from './productMessaging'

export type ToolCategoryId =
  | 'ai'
  | 'edit'
  | 'convert'
  | 'organize'
  | 'compress'
  | 'protect'
  | 'extract'

export interface ToolCategory {
  id: ToolCategoryId
  label: string
  shortLabel: string
  description: string
  color: string
  searchTerms: readonly string[]
  slugs: readonly string[]
}

export const TOOL_CATEGORIES: readonly ToolCategory[] = [
  {
    id: 'ai',
    label: 'AI tools',
    shortLabel: 'AI',
    description: 'Understand documents, automate forms, and create study material with AI-assisted workflows.',
    color: '#6D28D9',
    searchTerms: ['ai', 'artificial intelligence', 'smart', 'automate', 'understand', 'study'],
    slugs: ['ai-pdf-form-filler', 'chat-with-pdf', 'mind-map', 'pdf-ocr', 'pdf-summarizer', 'quiz-creator'],
  },
  {
    id: 'edit',
    label: 'Edit and annotate',
    shortLabel: 'Edit',
    description: 'Open, edit, review, compare, annotate, and build fillable PDF documents.',
    color: '#1D4ED8',
    searchTerms: ['edit', 'annotate', 'highlight', 'comment', 'mark up', 'review', 'view', 'read', 'form'],
    slugs: ['pdf-editor', 'pdf-viewer', 'pdf-annotate', 'pdf-form-builder', 'pdf-compare'],
  },
  {
    id: 'convert',
    label: 'Convert',
    shortLabel: 'Convert',
    description: 'Transform PDFs to and from documents, spreadsheets, presentations, images, and text formats.',
    color: '#047857',
    searchTerms: ['convert', 'transform', 'word', 'docx', 'excel', 'xlsx', 'spreadsheet', 'powerpoint', 'ppt', 'slides', 'image', 'jpg', 'png', 'text'],
    slugs: [
      'image-to-pdf', 'scan-to-pdf', 'word-to-pdf', 'pdf-to-word', 'pdf-to-excel', 'pdf-to-images',
      'pdf-to-ppt', 'excel-to-pdf', 'ppt-to-pdf', 'html-to-pdf', 'txt-to-pdf', 'odt-to-pdf',
      'rtf-to-pdf', 'pdf-translator',
    ],
  },
  {
    id: 'organize',
    label: 'Organize pages',
    shortLabel: 'Pages',
    description: 'Combine, separate, reorder, rotate, crop, number, and manage PDF pages and bookmarks.',
    color: '#C2410C',
    searchTerms: ['organize', 'pages', 'reorder', 'arrange', 'combine', 'join', 'split', 'separate', 'rotate', 'crop', 'delete', 'number', 'bookmark'],
    slugs: [
      'pdf-splitter', 'pdf-merger', 'pdf-cropper', 'rotate-pdf', 'extract-pages', 'delete-pages',
      'add-page-numbers', 'pdf-page-manager', 'pdf-page-labels', 'pdf-bookmarks-manager',
    ],
  },
  {
    id: 'compress',
    label: 'Compress',
    shortLabel: 'Compress',
    description: 'Reduce PDF file size with clear image-quality controls.',
    color: '#B45309',
    searchTerms: ['compress', 'shrink', 'reduce', 'file size', 'smaller', 'email', 'optimize'],
    slugs: ['pdf-compressor'],
  },
  {
    id: 'protect',
    label: 'Protect and sign',
    shortLabel: 'Protect',
    description: 'Sign, encrypt, unlock, redact, watermark, flatten, repair, and clean PDF files.',
    color: '#B91C1C',
    searchTerms: ['protect', 'secure', 'sign', 'signature', 'e-sign', 'encrypt', 'decrypt', 'password', 'unlock', 'redact', 'private', 'watermark', 'repair'],
    slugs: [
      'pdf-signer', 'pdf-password-lock', 'pdf-unlock', 'pdf-redactor', 'pdf-watermark',
      'pdf-flatten', 'remove-pdf-metadata', 'pdf-repair',
    ],
  },
  {
    id: 'extract',
    label: 'Extract and export',
    shortLabel: 'Extract',
    description: 'Export embedded files, images, form data, bookmarks, links, and comments from PDFs.',
    color: '#0E7490',
    searchTerms: ['extract', 'export', 'download', 'attachments', 'embedded', 'images', 'form data', 'csv', 'json', 'bookmarks', 'links', 'comments'],
    slugs: [
      'extract-pdf-attachments', 'extract-pdf-images', 'export-pdf-form-data', 'extract-pdf-bookmarks',
      'extract-pdf-links', 'remove-pdf-links', 'export-pdf-comments',
    ],
  },
] as const

// These are explicit product priorities already covered by the priority-tool
// journeys and public content plan. They are not inferred usage rankings.
export const PRODUCT_PRIORITY_TOOL_SLUGS = [
  'pdf-editor',
  'pdf-merger',
  'pdf-compressor',
  'pdf-signer',
  'ai-pdf-form-filler',
  'pdf-viewer',
  'pdf-splitter',
  'pdf-ocr',
] as const

const TOOL_SEARCH_SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  'ai-pdf-form-filler': ['autofill form', 'fill application', 'complete form', 'w9', 'tax form'],
  'chat-with-pdf': ['ask questions', 'answer questions', 'page citations', 'talk to document'],
  'mind-map': ['brainstorm', 'diagram', 'visual notes', 'concept map'],
  'pdf-ocr': ['scan text', 'recognize text', 'make searchable pdf', 'searchable pdf', 'image text'],
  'pdf-summarizer': ['summary', 'summarise', 'shorten', 'key points'],
  'quiz-creator': ['questions', 'flashcards', 'test', 'study'],
  'pdf-editor': ['add text', 'type on pdf', 'change pdf', 'add image'],
  'pdf-viewer': ['open pdf', 'read pdf', 'preview pdf'],
  'pdf-annotate': ['highlight', 'comment', 'markup', 'draw on pdf'],
  'pdf-form-builder': ['fillable form', 'form fields', 'create form'],
  'pdf-compare': ['diff', 'differences', 'changes', 'compare versions'],
  'pdf-merger': ['combine pdf', 'join pdf', 'bundle files'],
  'pdf-splitter': ['separate pdf', 'divide pdf', 'page ranges'],
  'pdf-page-manager': ['reorder pages', 'arrange pages', 'move pages'],
  'pdf-cropper': ['trim margins', 'crop pages', 'remove border'],
  'rotate-pdf': ['turn pages', 'orientation', 'landscape', 'portrait'],
  'extract-pages': ['save selected pages', 'pull pages', 'copy pages'],
  'delete-pages': ['remove pages', 'drop pages'],
  'add-page-numbers': ['number pages', 'pagination', 'footer numbers'],
  'pdf-page-labels': ['roman numerals', 'page prefix', 'numbering ranges'],
  'pdf-bookmarks-manager': ['outline', 'table of contents', 'toc', 'manage bookmarks'],
  'pdf-compressor': ['shrink pdf', 'reduce size', 'smaller pdf', 'email attachment'],
  'pdf-signer': ['signature', 'add signature', 'esign', 'e-sign', 'sign document'],
  'pdf-password-lock': ['encrypt pdf', 'secure pdf', 'add password'],
  'pdf-unlock': ['decrypt pdf', 'remove password', 'open locked pdf'],
  'pdf-redactor': ['hide sensitive information', 'black out text', 'censor'],
  'pdf-watermark': ['stamp pdf', 'logo watermark', 'confidential mark'],
  'pdf-flatten': ['make annotations permanent', 'flatten form fields'],
  'remove-pdf-metadata': ['privacy', 'strip properties', 'remove author', 'clean pdf'],
  'pdf-repair': ['fix corrupted pdf', 'damaged pdf', 'broken pdf'],
  'image-to-pdf': ['jpg to pdf', 'png to pdf', 'photos to pdf'],
  'scan-to-pdf': ['camera scan', 'photograph document', 'paper to pdf'],
  'word-to-pdf': ['docx to pdf', 'document to pdf'],
  'pdf-to-word': ['pdf to docx', 'editable document'],
  'pdf-to-excel': ['pdf table to spreadsheet', 'xlsx', 'table extraction'],
  'pdf-to-images': ['pdf to jpg', 'pdf to png', 'export pages'],
  'pdf-to-ppt': ['pdf to slides', 'pdf to powerpoint', 'presentation'],
  'excel-to-pdf': ['xlsx to pdf', 'spreadsheet to pdf', 'csv to pdf'],
  'ppt-to-pdf': ['slides to pdf', 'powerpoint to pdf', 'pptx to pdf'],
  'html-to-pdf': ['web page to pdf', 'code to pdf'],
  'txt-to-pdf': ['text to pdf', 'plain text'],
  'odt-to-pdf': ['libreoffice to pdf', 'open document'],
  'rtf-to-pdf': ['rich text to pdf'],
  'pdf-translator': ['translate document', 'language conversion'],
  'extract-pdf-attachments': ['embedded files', 'download attachment'],
  'extract-pdf-images': ['save images', 'recover pictures', 'download images'],
  'export-pdf-form-data': ['fields to csv', 'fields to json', 'form responses'],
  'extract-pdf-bookmarks': ['export outline', 'bookmark destinations'],
  'extract-pdf-links': ['audit urls', 'list links', 'hyperlinks'],
  'remove-pdf-links': ['disable hyperlinks', 'strip links'],
  'export-pdf-comments': ['export annotations', 'review comments', 'markup report'],
}

const categoryBySlug = new Map<string, ToolCategory>()
for (const category of TOOL_CATEGORIES) {
  for (const slug of category.slugs) categoryBySlug.set(slug, category)
}

export const toolsBySlug = new Map(toolMeta.map(tool => [tool.slug, tool]))

export function getToolCategory(slug: string) {
  return categoryBySlug.get(slug)
}

export function getCategoryHref(category: ToolCategory | ToolCategoryId) {
  const id = typeof category === 'string' ? category : category.id
  return `/#tools-${id}`
}

export function getCategoryTools(category: ToolCategory) {
  return category.slugs.map(slug => toolsBySlug.get(slug)).filter((tool): tool is ToolMeta => Boolean(tool))
}

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim()
}

export function getToolSearchText(tool: ToolMeta) {
  const category = getToolCategory(tool.slug)
  return normalize([
    tool.name,
    tool.desc,
    tool.slug,
    category?.label ?? '',
    ...(category?.searchTerms ?? []),
    ...(TOOL_SEARCH_SYNONYMS[tool.slug] ?? []),
  ].join(' '))
}

export function searchTools(query: string, tools: readonly ToolMeta[] = toolMeta) {
  const ignoredWords = new Set(['a', 'an', 'the', 'to', 'for', 'from', 'on', 'with', 'my'])
  const terms = normalize(query).split(' ').filter(term => term && !ignoredWords.has(term))
  if (!terms.length) return [...tools]
  return tools.filter(tool => {
    const haystack = getToolSearchText(tool)
    return terms.every(term => haystack.includes(term))
  })
}

export function getToolAccessPresentation(access: ToolMeta['access']) {
  if (access === 'core') {
    return {
      badges: [{ label: 'Free', kind: 'free' as const }],
      summary: 'Core workflow · no account required',
    }
  }
  if (access === 'core-with-ai') {
    return {
      badges: [{ label: 'Free', kind: 'free' as const }, { label: 'AI', kind: 'ai' as const }],
      summary: `Optional AI · ${FREE_AI_DAILY_LIMIT}/UTC day on Free · Pro removes the cap`,
    }
  }
  return {
    badges: [{ label: 'AI', kind: 'ai' as const }],
    summary: `${FREE_AI_DAILY_LIMIT}/UTC day on Free · Pro removes the cap`,
  }
}
