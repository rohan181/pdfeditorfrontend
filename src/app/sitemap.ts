import { MetadataRoute } from 'next'

const BASE = 'https://editpdfai.com'

type Freq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

function url(
  path: string,
  priority: number,
  changeFrequency: Freq = 'monthly',
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency, priority }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Home ──────────────────────────────────────────────────────────────────
    url('/',                    1.0, 'weekly'),

    // ── Flagship tools ────────────────────────────────────────────────────────
    url('/ai-pdf-form-filler',  0.95, 'monthly'),
    url('/pdf-editor',          0.95, 'monthly'),
    url('/pdf-viewer',          0.90, 'monthly'),
    url('/pdf-cropper',         0.85, 'monthly'),

    // ── AI-powered tools ──────────────────────────────────────────────────────
    url('/pdf-ocr',             0.85, 'monthly'),
    url('/pdf-summarizer',      0.85, 'monthly'),
    url('/mind-map',            0.85, 'monthly'),
    url('/pdf-translator',      0.85, 'monthly'),
    url('/quiz-creator',        0.85, 'monthly'),
    url('/pdf-redactor',        0.80, 'monthly'),

    // ── Core PDF utilities ────────────────────────────────────────────────────
    url('/pdf-compressor',      0.85, 'monthly'),
    url('/pdf-merger',          0.85, 'monthly'),
    url('/pdf-splitter',        0.85, 'monthly'),
    url('/pdf-signer',          0.85, 'monthly'),
    url('/pdf-form-builder',    0.80, 'monthly'),
    url('/pdf-page-manager',    0.80, 'monthly'),
    url('/pdf-annotate',        0.80, 'monthly'),

    // ── Page-level editing ────────────────────────────────────────────────────
    url('/rotate-pdf',          0.75, 'monthly'),
    url('/extract-pages',       0.75, 'monthly'),
    url('/delete-pages',        0.75, 'monthly'),
    url('/add-page-numbers',    0.75, 'monthly'),

    // ── Security & protection ─────────────────────────────────────────────────
    url('/pdf-password-lock',   0.80, 'monthly'),
    url('/pdf-watermark',       0.80, 'monthly'),

    // ── Convert to PDF ────────────────────────────────────────────────────────
    url('/image-to-pdf',        0.80, 'monthly'),
    url('/excel-to-pdf',        0.75, 'monthly'),
    url('/word-to-pdf',         0.80, 'monthly'),
    url('/txt-to-pdf',          0.75, 'monthly'),
    url('/rtf-to-pdf',          0.75, 'monthly'),
    url('/odt-to-pdf',          0.75, 'monthly'),
    url('/html-to-pdf',         0.75, 'monthly'),
    url('/ppt-to-pdf',          0.75, 'monthly'),

    // ── Convert from PDF ──────────────────────────────────────────────────────
    url('/pdf-to-word',         0.80, 'monthly'),
    url('/pdf-to-excel',        0.80, 'monthly'),
    url('/pdf-to-images',       0.75, 'monthly'),
    url('/pdf-to-ppt',          0.75, 'monthly'),
  ]
}
