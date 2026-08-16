# EditPDF AI — AEO Baseline Audit

**Scope:** every public route in the repository, audited against the code (page.tsx, layout.tsx, toolSeoData.ts, routes.ts, the actual API routes and Web Worker implementations behind each tool) — not just the rendered copy. **Audit only: no production code was changed to produce this report**, per the brief for this phase.

**Method:** 74 page routes were discovered and classified (67 indexable + 7 correctly-private). They were split into 5 batches and independently audited in parallel by separate reviewers against a fixed rubric (crawlability, indexability, canonical correctness, rendered-HTML availability, page purpose, search intent, direct-answer presence, heading structure, factual accuracy vs. implementation, content uniqueness, author/reviewer, sources, last-reviewed date, internal links, structured data, brand consistency, citation-readiness), each scored 0–100 on five dimensions and issues tagged Critical/High/Medium/Low. One inconsistency between batches was found and corrected during compilation (noted below). Full detail lives in `page-inventory.csv` (one row per page) and `content-gaps.csv` (one row per issue, 110 rows total).

## Headline numbers

| | |
|---|---|
| Public page routes discovered | 74 (67 indexable, 7 correctly noindexed) |
| API routes (not pages, correctly disallowed in robots.ts) | 28 |
| Total issues logged | 110 — 31 Critical, 26 High, 24 Medium, 29 Low |
| Pages with at least one Critical issue | 28 |
| Pages fully clean (no issues found) | 21 |

Average scores across all 67 indexable pages: **discoverability 79**, **answer clarity 79**, **factual trust 71**, **content uniqueness 74**, **citation readiness 65**. Factual trust and citation readiness are the two weakest dimensions site-wide, and both are dragged down by a small number of severe, concentrated problems rather than being uniformly weak — the median page scores well above these averages; a handful of pages score very low and pull the mean down.

## The five systemic findings (fix these first — they're mechanical and repeat across many pages)

### 1. Duplicate/conflicting JSON-LD on 37 of 51 tool pages (Critical/High, the single biggest issue by page-count)
A prior session fixed this exact bug pattern on 17 pages (documented in project memory) and it was expected to be the model going forward. It has regressed or was never finished: **37 tool pages** still have `layout.tsx` hand-rolling its own `WebApplication` JSON-LD *while* `page.tsx` also renders `<ToolSEOSection>` with its default `SoftwareApplication`/`FAQPage`/`BreadcrumbList`/`HowTo` schema — two disconnected, independently-maintained descriptions of the same page/entity, with no shared `@id`. On the file-format converters (13 pages) this is compounded by the two blocks also disagreeing on the tool's *name* (e.g. "Excel to PDF Converter" vs. "Excel to PDF").

Three pages show the correct pattern and should be the template for the fix: **`pdf-page-labels`** and **`chat-with-pdf`** (rely on `ToolSEOSection` alone, no `layout.tsx` schema), and **`pdf-editor`** (keeps its richer bespoke `layout.tsx` schema and explicitly passes `includeSchema={false}` to suppress `ToolSEOSection`'s). `ai-pdf-form-filler` uses a third, fully bespoke pattern that also works cleanly.

Affected: pdf-viewer, pdf-cropper, pdf-ocr, pdf-summarizer, mind-map, pdf-translator, quiz-creator, pdf-redactor, pdf-compressor, pdf-merger, pdf-splitter, pdf-signer, pdf-form-builder, pdf-page-manager, pdf-annotate, rotate-pdf, extract-pages, delete-pages, add-page-numbers, pdf-password-lock, pdf-unlock, pdf-repair, pdf-flatten, pdf-watermark, and all 13 document/image converters (image-to-pdf through pdf-to-ppt).

*Calibration note:* the security-tools batch's initial pass didn't flag this pattern on pdf-unlock/pdf-repair/pdf-flatten/pdf-watermark (it does exist on those pages) — corrected during compilation so the count above is consistent with how the same structural pattern was graded everywhere else.

### 2. Fabricated or unverifiable capability claims served as structured fact (Critical, highest business risk)
Several pages don't just have marketing exaggeration — they assert specific, checkable capabilities in FAQ copy *and in FAQPage JSON-LD* that the actual code doesn't do:
- **`pdf-redactor`** (the most serious single finding in the audit): describes an "AI scanner" that automatically detects names/emails/phone numbers/financial data. There is no AI, no detection, and no server call anywhere in the component — it's a manual draw-to-redact tool. This is on a legal/compliance-sensitive topic (redaction), which raises the stakes.
- **`excel-to-pdf` / `word-to-pdf` / `rtf-to-pdf` / `odt-to-pdf`**: each claims formatting (colors, merged cells, charts, images, headers/footers) is preserved. Verified against the actual conversion code: none of them parse or preserve that data — only raw text converts.
- **`ppt-to-pdf`**: the page's *own visible UI disclaimer* ("images are omitted") directly contradicts its FAQ, its meta description, and its `layout.tsx` schema, all of which claim images and animations ARE preserved — a four-way self-contradiction on one URL.
- **`pdf-to-word` / `pdf-to-excel`**: metadata says "No signup required"; the API routes behind them hard-require a signed-in account (401 if not).
- **`quiz-creator` / `pdf-summarizer` / `mind-map`**: each advertises a Pro-tier capability (question-count limits, "unlimited"/"any length" documents) that doesn't exist anywhere in the client UI or the server route — every user gets the same flat limit regardless of tier.

### 3. Pricing contradiction spanning three surfaces (Critical, real trust/legal exposure)
`/pricing` advertises an Annual plan (-25%, $9/year) with matching `Product` JSON-LD. `/terms` §5 flatly states "Pro subscriptions are billed monthly." The checkout flow (`/checkout`, `create-subscription`, `create-setup-intent`) has no annual price ID anywhere in the code and hardcodes "$1.00/month." This isn't a copy inconsistency — the advertised discount doesn't appear to be purchasable at all.

### 4. Organization/entity structured data exists in exactly one place (Medium-High, affects entity trust site-wide)
`Organization`/`WebSite` JSON-LD is rendered **only on the homepage**, inline in `page.tsx`. A stale comment on `/about` claims a site-wide `<SiteJsonLd />` component renders it "in the root layout" — no such component exists anywhere in the codebase. As a direct result, `/about`, `/support`, `/privacy`, and `/terms` carry **zero** structured data. `/support` in particular has 10 ready-made FAQ pairs and no `FAQPage` schema — the single cleanest missed opportunity found in the audit.

### 5. Near-duplicate templated content across two tool clusters (Medium, content-uniqueness risk)
- The 5-tool page-editing cluster (rotate-pdf, extract-pages, delete-pages, add-page-numbers, pdf-page-manager) shares a near-identical whatIs/FAQ rhetorical template, varying only the operation noun.
- The document-converter cluster (excel/word/txt/rtf/odt-to-pdf) shares the same pattern, and one page (`pdf-to-ppt`) has a literal leftover copy-paste artifact from `pdf-to-word`'s FAQ ("...rebuild the document as Word").

## What's genuinely strong (worth protecting, not rewriting)

- **`chat-with-pdf`, `ai-pdf-form-filler`, `pdf-editor`** are the best-executed pages site-wide: single schema source, every factual claim spot-checked against the real implementation and verified accurate (citation validation, file-size limits, "never leaves your device" for pdf-editor with AI features explicitly disabled).
- **`/privacy`** is the most factually careful page on the entire site — it correctly distinguishes client-side processing from the `/api/*` AI routes, separates "text sent" from "page image sent" per tool, and was verified line-by-line against `Analytics.tsx`'s actual config. No contradictions found.
- Most of the security/extraction tools (pdf-unlock, pdf-repair, pdf-compare, remove-pdf-metadata, the four extract-pdf-* pages, remove-pdf-links, export-pdf-comments) are honest about real limitations rather than overclaiming, and their privacy claims check out against the actual Web Workers behind them.
- All 8 published guides are genuinely distinct, non-templated, editorially real content — not thin reskins of tool-page FAQs — with visible "Updated" dates and org-level authorship. Their main weakness is unsourced statistics (Adobe pricing, compression %, OCR accuracy %, cited legislation) rather than thinness.
- `robots.ts`, `sitemap.ts`, and all 7 private routes (`dashboard`, `manage-subscription`, `checkout`, `checkout/confirm`, `cancel`, `sign-in`, `sign-up`) were verified correctly noindexed and gated — no accidental exposure of private/account pages found.

## Page-type breakdown

| Page type | Count | Notes |
|---|---|---|
| PDF tool | 37 | client-side, no AI |
| AI tool | 11 | ai-pdf-form-filler, pdf-editor(AI disabled), pdf-ocr, pdf-summarizer, chat-with-pdf, mind-map, pdf-translator, quiz-creator, pdf-to-word, pdf-to-excel, pdf-to-ppt |
| Converter (PDF tool subtype) | 13 | image/scan/excel/word/txt/rtf/odt/html/ppt-to-pdf + pdf-to-images |
| Tutorial (guide) | 9 | 1 hub + 8 articles |
| Trust/legal | 3 | about, privacy, terms |
| Pricing | 1 | |
| Help/support | 2 | contact, support |
| Homepage | 1 | |
| Category/hub | 1 | guides |
| Private/non-indexable | 7 | all correctly noindexed |

## Brand consistency note

Four AI-tool pages (`pdf-ocr`, `mind-map`, `pdf-translator`, `quiz-creator`) name the underlying model ("Claude") directly in visible copy, while the site's other AI tools (`chat-with-pdf`, `pdf-summarizer`, `ai-pdf-form-filler`) describe it generically as "AI." This is inconsistent brand voice and unnecessarily exposes a swappable implementation detail as a product claim.

## Next steps

This phase produced the audit only. `content-gaps.csv` is the actionable backlog (101 rows, sorted by nothing — treat Critical rows first). The user's subsequent phases (question-and-intent map, brand-entity reconciliation, tool-page content rewrite, tutorials, comparisons, trust/claims pass, structured-data engineering, technical indexing) will consume this baseline and are expected to fix most of what's listed here — the duplicate-schema bug and the fabricated-capability claims in particular should be prioritized early since they're both high-blast-radius and mechanically simple to fix once decided on an approach.
