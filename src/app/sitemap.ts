import { MetadataRoute } from 'next'

const BASE = 'https://www.editpdfai.com'

function url(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  // Real last-touched date for this route's page.tsx/layout.tsx (or the
  // shared data file, for /guides/[slug]), derived from `git log -1
  // --format=%cs -- <files>` at the time this list was last regenerated —
  // not a placeholder and not "now" on every request. Regenerate by rerunning
  // that command per route; there is no automatic build-time refresh, since
  // git history depth isn't guaranteed in every deploy environment.
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, changeFrequency, priority, ...(lastModified ? { lastModified } : {}) }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Home ──────────────────────────────────────────────────────────────────
    // Root path uses a trailing slash to match the homepage's canonical tag
    // (alternates.canonical: 'https://www.editpdfai.com/') — keep these two in
    // sync or the sitemap and canonical disagree on the "real" homepage URL.
    url('/', 1.0, 'weekly', '2026-08-14'),

    // ── Flagship tools ────────────────────────────────────────────────────────
    url('/ai-pdf-form-filler', 0.95, 'monthly', '2026-08-14'),
    url('/pdf-editor', 0.95, 'monthly', '2026-08-14'),
    url('/pdf-viewer', 0.90, 'monthly', '2026-08-12'),
    url('/pdf-cropper', 0.85, 'monthly', '2026-08-12'),

    // ── AI-powered tools ──────────────────────────────────────────────────────
    url('/pdf-ocr', 0.85, 'monthly', '2026-08-06'),
    url('/pdf-summarizer', 0.85, 'monthly', '2026-08-06'),
    url('/chat-with-pdf', 0.90, 'monthly', '2026-08-13'),
    url('/mind-map', 0.85, 'monthly', '2026-08-06'),
    url('/pdf-translator', 0.85, 'monthly', '2026-08-12'),
    url('/quiz-creator', 0.85, 'monthly', '2026-08-06'),
    url('/pdf-redactor', 0.80, 'monthly', '2026-08-14'),

    // ── Core PDF utilities ────────────────────────────────────────────────────
    url('/pdf-compressor', 0.85, 'monthly', '2026-08-14'),
    url('/pdf-merger', 0.85, 'monthly', '2026-08-14'),
    url('/pdf-splitter', 0.85, 'monthly', '2026-08-14'),
    url('/pdf-signer', 0.85, 'monthly', '2026-08-14'),
    url('/pdf-form-builder', 0.80, 'monthly', '2026-08-14'),
    url('/pdf-page-manager', 0.80, 'monthly', '2026-08-14'),
    url('/pdf-annotate', 0.80, 'monthly', '2026-08-13'),

    // ── Page-level editing ────────────────────────────────────────────────────
    url('/rotate-pdf', 0.75, 'monthly', '2026-08-06'),
    url('/extract-pages', 0.75, 'monthly', '2026-08-14'),
    url('/delete-pages', 0.75, 'monthly', '2026-08-06'),
    url('/add-page-numbers', 0.75, 'monthly', '2026-08-06'),
    url('/pdf-page-labels', 0.80, 'monthly', '2026-08-11'),

    // ── Security & protection ─────────────────────────────────────────────────
    url('/pdf-password-lock', 0.80, 'monthly', '2026-08-14'),
    url('/pdf-unlock', 0.80, 'monthly', '2026-08-11'),
    url('/pdf-repair', 0.80, 'monthly', '2026-08-11'),
    url('/pdf-flatten', 0.80, 'monthly', '2026-08-11'),
    url('/pdf-compare', 0.80, 'monthly', '2026-08-11'),
    url('/remove-pdf-metadata', 0.80, 'monthly', '2026-08-11'),
    url('/extract-pdf-attachments', 0.80, 'monthly', '2026-08-11'),
    url('/extract-pdf-images', 0.80, 'monthly', '2026-08-11'),
    url('/export-pdf-form-data', 0.80, 'monthly', '2026-08-11'),
    url('/extract-pdf-bookmarks', 0.80, 'monthly', '2026-08-11'),
    url('/pdf-bookmarks-manager', 0.80, 'monthly', '2026-08-11'),
    url('/extract-pdf-links', 0.80, 'monthly', '2026-08-11'),
    url('/remove-pdf-links', 0.80, 'monthly', '2026-08-11'),
    url('/export-pdf-comments', 0.80, 'monthly', '2026-08-11'),
    url('/pdf-watermark', 0.80, 'monthly', '2026-08-14'),

    // ── Convert to PDF ────────────────────────────────────────────────────────
    url('/image-to-pdf', 0.80, 'monthly', '2026-08-14'),
    url('/scan-to-pdf', 0.80, 'monthly', '2026-08-14'),
    url('/excel-to-pdf', 0.75, 'monthly', '2026-08-06'),
    url('/word-to-pdf', 0.80, 'monthly', '2026-08-14'),
    url('/txt-to-pdf', 0.75, 'monthly', '2026-07-22'),
    url('/rtf-to-pdf', 0.75, 'monthly', '2026-07-22'),
    url('/odt-to-pdf', 0.75, 'monthly', '2026-07-22'),
    url('/html-to-pdf', 0.75, 'monthly', '2026-08-12'),
    url('/ppt-to-pdf', 0.75, 'monthly', '2026-08-06'),

    // ── Convert from PDF ──────────────────────────────────────────────────────
    url('/pdf-to-word', 0.80, 'monthly', '2026-08-12'),
    url('/pdf-to-excel', 0.80, 'monthly', '2026-07-26'),
    url('/pdf-to-images', 0.75, 'monthly', '2026-07-22'),
    url('/pdf-to-ppt', 0.75, 'monthly', '2026-08-12'),

    // ── Guides ────────────────────────────────────────────────────────────────
    url('/guides', 0.75, 'weekly', '2026-08-06'),
    url('/guides/how-to-edit-a-pdf-without-adobe', 0.70, 'monthly', '2026-07-20'),
    url('/guides/how-to-reduce-pdf-file-size', 0.70, 'monthly', '2026-07-20'),
    url('/guides/how-to-fill-out-a-pdf-form-automatically', 0.70, 'monthly', '2026-07-20'),
    url('/guides/how-to-sign-a-pdf-online', 0.70, 'monthly', '2026-07-20'),
    url('/guides/how-to-make-a-scanned-pdf-searchable', 0.70, 'monthly', '2026-07-20'),
    url('/guides/pdf-vs-word-which-format-to-use', 0.65, 'monthly', '2026-07-20'),
    url('/guides/how-to-merge-pdf-files', 0.70, 'monthly', '2026-07-20'),
    url('/guides/how-to-redact-sensitive-information-from-a-pdf', 0.70, 'monthly', '2026-07-20'),

    // ── Legal & support ───────────────────────────────────────────────────────
    url('/pricing', 0.70, 'monthly', '2026-08-14'),
    url('/about', 0.55, 'yearly', '2026-08-13'),
    url('/contact', 0.50, 'yearly', '2026-08-13'),
    url('/support', 0.45, 'yearly', '2026-08-13'),
    url('/privacy', 0.40, 'yearly', '2026-08-14'),
    url('/terms', 0.40, 'yearly', '2026-08-14'),
  ]
}
