import { MetadataRoute } from 'next'

const BASE = 'https://editpdfai.com'

function url(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  lastModified = '2025-01-01',
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified, changeFrequency, priority }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Home ──────────────────────────────────────────────────────────────────
    url('/',                    1.0, 'weekly',   '2025-06-01'),

    // ── Flagship tools ────────────────────────────────────────────────────────
    url('/ai-pdf-form-filler',  0.95, 'monthly', '2025-05-01'),
    url('/pdf-editor',          0.95, 'monthly', '2025-05-01'),
    url('/pdf-viewer',          0.90, 'monthly', '2025-04-01'),
    url('/pdf-cropper',         0.85, 'monthly', '2025-04-01'),

    // ── AI-powered tools ──────────────────────────────────────────────────────
    url('/pdf-ocr',             0.85, 'monthly', '2025-04-01'),
    url('/pdf-summarizer',      0.85, 'monthly', '2025-04-01'),
    url('/mind-map',            0.85, 'monthly', '2025-04-01'),
    url('/pdf-translator',      0.85, 'monthly', '2025-04-01'),
    url('/quiz-creator',        0.85, 'monthly', '2025-04-01'),
    url('/pdf-redactor',        0.80, 'monthly', '2025-04-01'),

    // ── Core PDF utilities ────────────────────────────────────────────────────
    url('/pdf-compressor',      0.85, 'monthly', '2025-04-01'),
    url('/pdf-merger',          0.85, 'monthly', '2025-04-01'),
    url('/pdf-splitter',        0.85, 'monthly', '2025-04-01'),
    url('/pdf-signer',          0.85, 'monthly', '2025-04-01'),
    url('/pdf-form-builder',    0.80, 'monthly', '2025-04-01'),
    url('/pdf-page-manager',    0.80, 'monthly', '2025-04-01'),
    url('/pdf-annotate',        0.80, 'monthly', '2025-04-01'),

    // ── Page-level editing ────────────────────────────────────────────────────
    url('/rotate-pdf',          0.75, 'monthly', '2025-04-01'),
    url('/extract-pages',       0.75, 'monthly', '2025-04-01'),
    url('/delete-pages',        0.75, 'monthly', '2025-04-01'),
    url('/add-page-numbers',    0.75, 'monthly', '2025-04-01'),

    // ── Security & protection ─────────────────────────────────────────────────
    url('/pdf-password-lock',   0.80, 'monthly', '2025-04-01'),
    url('/pdf-watermark',       0.80, 'monthly', '2025-04-01'),

    // ── Convert to PDF ────────────────────────────────────────────────────────
    url('/image-to-pdf',        0.80, 'monthly', '2025-04-01'),
    url('/excel-to-pdf',        0.75, 'monthly', '2025-04-01'),
    url('/word-to-pdf',         0.80, 'monthly', '2025-04-01'),
    url('/txt-to-pdf',          0.75, 'monthly', '2025-04-01'),
    url('/rtf-to-pdf',          0.75, 'monthly', '2025-04-01'),
    url('/odt-to-pdf',          0.75, 'monthly', '2025-04-01'),
    url('/html-to-pdf',         0.75, 'monthly', '2025-04-01'),
    url('/ppt-to-pdf',          0.75, 'monthly', '2025-04-01'),

    // ── Convert from PDF ──────────────────────────────────────────────────────
    url('/pdf-to-word',         0.80, 'monthly', '2025-04-01'),
    url('/pdf-to-excel',        0.80, 'monthly', '2025-04-01'),
    url('/pdf-to-images',       0.75, 'monthly', '2025-04-01'),
    url('/pdf-to-ppt',          0.75, 'monthly', '2025-04-01'),

    // ── Legal & support ───────────────────────────────────────────────────────
    url('/pricing',             0.70, 'monthly', '2025-04-01'),
    url('/contact',             0.50, 'yearly',  '2025-01-01'),
    url('/privacy',             0.40, 'yearly',  '2025-01-01'),
    url('/terms',               0.40, 'yearly',  '2025-01-01'),
  ]
}
