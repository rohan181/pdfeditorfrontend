import { MetadataRoute } from 'next'

const BASE = 'https://www.editpdfai.com'

function url(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  _lastModified = '2026-07-19',
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, changeFrequency, priority }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Home ──────────────────────────────────────────────────────────────────
    url('/',                    1.0, 'weekly',   '2026-07-22'),

    // ── Flagship tools ────────────────────────────────────────────────────────
    url('/ai-pdf-form-filler',  0.95, 'monthly', '2026-07-19'),
    url('/pdf-editor',          0.95, 'monthly', '2026-07-19'),
    url('/pdf-viewer',          0.90, 'monthly', '2026-01-01'),
    url('/pdf-cropper',         0.85, 'monthly', '2026-01-01'),

    // ── AI-powered tools ──────────────────────────────────────────────────────
    url('/pdf-ocr',             0.85, 'monthly', '2026-01-01'),
    url('/pdf-summarizer',      0.85, 'monthly', '2026-01-01'),
    url('/mind-map',            0.85, 'monthly', '2026-01-01'),
    url('/pdf-translator',      0.85, 'monthly', '2026-01-01'),
    url('/quiz-creator',        0.85, 'monthly', '2026-01-01'),
    url('/pdf-redactor',        0.80, 'monthly', '2026-01-01'),

    // ── Core PDF utilities ────────────────────────────────────────────────────
    url('/pdf-compressor',      0.85, 'monthly', '2026-01-01'),
    url('/pdf-merger',          0.85, 'monthly', '2026-01-01'),
    url('/pdf-splitter',        0.85, 'monthly', '2026-01-01'),
    url('/pdf-signer',          0.85, 'monthly', '2026-07-19'),
    url('/pdf-form-builder',    0.80, 'monthly', '2026-01-01'),
    url('/pdf-page-manager',    0.80, 'monthly', '2026-01-01'),
    url('/pdf-annotate',        0.80, 'monthly', '2026-01-01'),

    // ── Page-level editing ────────────────────────────────────────────────────
    url('/rotate-pdf',          0.75, 'monthly', '2026-01-01'),
    url('/extract-pages',       0.75, 'monthly', '2026-01-01'),
    url('/delete-pages',        0.75, 'monthly', '2026-01-01'),
    url('/add-page-numbers',    0.75, 'monthly', '2026-01-01'),

    // ── Security & protection ─────────────────────────────────────────────────
    url('/pdf-password-lock',   0.80, 'monthly', '2026-01-01'),
    url('/pdf-watermark',       0.80, 'monthly', '2026-01-01'),

    // ── Convert to PDF ────────────────────────────────────────────────────────
    url('/image-to-pdf',        0.80, 'monthly', '2026-01-01'),
    url('/excel-to-pdf',        0.75, 'monthly', '2026-01-01'),
    url('/word-to-pdf',         0.80, 'monthly', '2026-01-01'),
    url('/txt-to-pdf',          0.75, 'monthly', '2026-01-01'),
    url('/rtf-to-pdf',          0.75, 'monthly', '2026-01-01'),
    url('/odt-to-pdf',          0.75, 'monthly', '2026-01-01'),
    url('/html-to-pdf',         0.75, 'monthly', '2026-01-01'),
    url('/ppt-to-pdf',          0.75, 'monthly', '2026-01-01'),

    // ── Convert from PDF ──────────────────────────────────────────────────────
    url('/pdf-to-word',         0.80, 'monthly', '2026-01-01'),
    url('/pdf-to-excel',        0.80, 'monthly', '2026-01-01'),
    url('/pdf-to-images',       0.75, 'monthly', '2026-01-01'),
    url('/pdf-to-ppt',          0.75, 'monthly', '2026-01-01'),

    // ── Guides ────────────────────────────────────────────────────────────────
    url('/guides',                                          0.75, 'weekly',  '2026-07-19'),
    url('/guides/how-to-edit-a-pdf-without-adobe',          0.70, 'monthly', '2026-07-19'),
    url('/guides/how-to-reduce-pdf-file-size',              0.70, 'monthly', '2026-07-19'),
    url('/guides/how-to-fill-out-a-pdf-form-automatically', 0.70, 'monthly', '2026-07-19'),
    url('/guides/how-to-sign-a-pdf-online',                 0.70, 'monthly', '2026-07-19'),
    url('/guides/how-to-make-a-scanned-pdf-searchable',     0.70, 'monthly', '2026-07-19'),
    url('/guides/pdf-vs-word-which-format-to-use',          0.65, 'monthly', '2026-07-19'),
    url('/guides/how-to-merge-pdf-files',                   0.70, 'monthly', '2026-07-19'),
    url('/guides/how-to-redact-sensitive-information-from-a-pdf', 0.70, 'monthly', '2026-07-19'),

    // ── Legal & support ───────────────────────────────────────────────────────
    url('/pricing',             0.70, 'monthly', '2026-07-19'),
    url('/about',               0.55, 'yearly',  '2026-07-19'),
    url('/contact',             0.50, 'yearly',  '2026-01-01'),
    url('/support',             0.45, 'yearly',  '2026-01-01'),
    url('/privacy',             0.40, 'yearly',  '2026-01-01'),
    url('/terms',               0.40, 'yearly',  '2026-01-01'),
  ]
}
