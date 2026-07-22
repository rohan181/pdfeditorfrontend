import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const tools = [
  ['home', 'Free Online PDF Editor', '35+ PDF Tools', '#2563EB', 'PDF'],
  ['pdf-editor', 'Edit PDFs Online', 'Edit & Annotate', '#2563EB', 'EDIT'],
  ['pdf-viewer', 'View PDF Files Online', 'Edit & Annotate', '#2563EB', 'VIEW'],
  ['pdf-annotate', 'Annotate PDFs Online', 'Edit & Annotate', '#0EA5E9', 'NOTE'],
  ['ai-pdf-form-filler', 'Fill PDF Forms with AI', 'AI Tools', '#7C3AED', 'AI'],
  ['pdf-ocr', 'Extract Text with PDF OCR', 'AI Tools', '#7C3AED', 'OCR'],
  ['pdf-summarizer', 'Summarize PDFs with AI', 'AI Tools', '#8B5CF6', 'AI'],
  ['pdf-translator', 'Translate PDF Documents', 'AI Tools', '#7C3AED', 'A↔'],
  ['mind-map', 'Create Mind Maps from PDFs', 'AI Tools', '#A855F7', 'MAP'],
  ['quiz-creator', 'Create Quizzes from PDFs', 'AI Tools', '#7C3AED', 'QUIZ'],
  ['pdf-compressor', 'Compress PDF Files Online', 'Organize', '#D97706', 'ZIP'],
  ['pdf-merger', 'Merge PDF Files Online', 'Organize', '#D97706', 'MERGE'],
  ['pdf-splitter', 'Split PDF Files Online', 'Organize', '#E11D48', 'SPLIT'],
  ['pdf-page-manager', 'Organize PDF Pages', 'Page Tools', '#F97316', 'PAGES'],
  ['pdf-cropper', 'Crop PDF Pages Online', 'Page Tools', '#0D9488', 'CROP'],
  ['rotate-pdf', 'Rotate PDF Pages Online', 'Page Tools', '#F97316', 'ROTATE'],
  ['extract-pages', 'Extract Pages from PDFs', 'Page Tools', '#D97706', 'PAGES'],
  ['delete-pages', 'Delete PDF Pages Online', 'Page Tools', '#DC2626', 'DELETE'],
  ['add-page-numbers', 'Add PDF Page Numbers', 'Page Tools', '#F97316', '1·2·3'],
  ['pdf-signer', 'Sign PDF Documents Online', 'Protect & Sign', '#0D9488', 'SIGN'],
  ['pdf-watermark', 'Add Watermarks to PDFs', 'Protect & Sign', '#2563EB', 'MARK'],
  ['pdf-redactor', 'Redact Sensitive PDF Content', 'Protect & Sign', '#374151', 'REDACT'],
  ['pdf-password-lock', 'Password Protect PDFs', 'Protect & Sign', '#DC2626', 'LOCK'],
  ['pdf-form-builder', 'Create Fillable PDF Forms', 'Organize', '#0369A1', 'FORM'],
  ['pdf-to-word', 'Convert PDF to Word', 'Convert', '#16A34A', 'DOCX'],
  ['pdf-to-excel', 'Convert PDF to Excel', 'Convert', '#15803D', 'XLSX'],
  ['pdf-to-ppt', 'Convert PDF to PowerPoint', 'Convert', '#D97706', 'PPTX'],
  ['pdf-to-images', 'Convert PDF Pages to Images', 'Convert', '#DB2777', 'IMG'],
  ['word-to-pdf', 'Convert Word to PDF', 'Convert', '#2563EB', 'PDF'],
  ['excel-to-pdf', 'Convert Excel to PDF', 'Convert', '#059669', 'PDF'],
  ['ppt-to-pdf', 'Convert PowerPoint to PDF', 'Convert', '#B45309', 'PDF'],
  ['image-to-pdf', 'Convert Images to PDF', 'Convert', '#7C3AED', 'PDF'],
  ['txt-to-pdf', 'Convert Text to PDF', 'Convert', '#6366F1', 'PDF'],
  ['rtf-to-pdf', 'Convert RTF to PDF', 'Convert', '#B45309', 'PDF'],
  ['odt-to-pdf', 'Convert ODT to PDF', 'Convert', '#059669', 'PDF'],
  ['html-to-pdf', 'Convert HTML to PDF', 'Convert', '#0891B2', 'PDF'],
]

const root = process.cwd()
const outputDir = path.join(root, 'public', 'social')
const originalLogo = await fs.readFile(path.join(root, 'public', 'logo-v2.svg'))
const originalLogoData = originalLogo.toString('base64')
await fs.mkdir(outputDir, { recursive: true })

const escapeXml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

for (const [slug, title, category, accent, symbol] of tools) {
  const safeTitle = escapeXml(title)
  const safeCategory = escapeXml(category.toUpperCase())
  const safeSymbol = escapeXml(symbol)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F8FAFC"/>
          <stop offset="1" stop-color="#EEF2FF"/>
        </linearGradient>
        <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#2563EB"/>
          <stop offset="1" stop-color="#7C3AED"/>
        </linearGradient>
        <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(1000 110) rotate(135) scale(430 430)">
          <stop stop-color="${accent}" stop-opacity=".22"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#0F172A" flood-opacity=".12"/>
        </filter>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <g opacity=".34">
        ${Array.from({ length: 20 }, (_, row) => Array.from({ length: 38 }, (_, col) => `<circle cx="${30 + col * 32}" cy="${22 + row * 32}" r="1" fill="#94A3B8"/>`).join('')).join('')}
      </g>

      <image href="data:image/svg+xml;base64,${originalLogoData}" x="54" y="38" width="340" height="90" preserveAspectRatio="xMinYMid meet"/>

      <g transform="translate(72 190)">
        <rect width="160" height="34" rx="17" fill="${accent}" fill-opacity=".10" stroke="${accent}" stroke-opacity=".25"/>
        <text x="80" y="23" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="1.4" fill="${accent}">${safeCategory}</text>
        <text x="0" y="112" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="750" letter-spacing="-2.2" fill="#0F172A">${safeTitle}</text>
        <text x="0" y="168" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" fill="#475569">Fast, private, and easy to use in your browser.</text>
        <g transform="translate(0 218)">
          <circle cx="7" cy="7" r="7" fill="#10B981"/>
          <path d="m3.5 7 2.3 2.3 4.7-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="26" y="13" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#334155">No installation required</text>
          <circle cx="262" cy="7" r="7" fill="#10B981"/>
          <path d="m258.5 7 2.3 2.3 4.7-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="281" y="13" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#334155">Works online</text>
        </g>
      </g>

      <g transform="translate(840 160)" filter="url(#shadow)">
        <rect width="280" height="310" rx="38" fill="#fff" stroke="#E2E8F0" stroke-width="2"/>
        <rect x="34" y="34" width="212" height="242" rx="24" fill="${accent}" fill-opacity=".08" stroke="${accent}" stroke-opacity=".18" stroke-width="2"/>
        <path d="M82 82h88l48 48v100a18 18 0 0 1-18 18H82a18 18 0 0 1-18-18V100a18 18 0 0 1 18-18Z" fill="#fff" stroke="${accent}" stroke-width="7" stroke-linejoin="round"/>
        <path d="M170 82v48h48" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="86" y="153" width="110" height="52" rx="14" fill="${accent}"/>
        <text x="141" y="186" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${safeSymbol.length > 5 ? 15 : 21}" font-weight="800" letter-spacing=".5" fill="#fff">${safeSymbol}</text>
      </g>

      <rect x="0" y="614" width="1200" height="16" fill="url(#brand)"/>
      <text x="1128" y="570" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#64748B">editpdfai.com</text>
    </svg>`

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(outputDir, `${slug}.png`))
}

console.log(`Generated ${tools.length} social images in ${outputDir}`)
