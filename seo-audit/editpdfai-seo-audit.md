# EditPDF AI — Technical SEO Audit

**Domain:** https://editpdfai.com (canonical host: `www.editpdfai.com`)
**Audited:** repository inspection of `pdfeditorfrontend` (local working tree, branch `main`)
**Method:** static analysis of the actual source (route files, `layout.tsx` metadata, `sitemap.ts`, `robots.ts`, `middleware.ts`), cross-checked against the production build output (`npm run build`). No data was guessed — every claim below cites a file path.

---

## 1. Stack detection

| | |
|---|---|
| Framework | Next.js `14.2.x` (from `package.json`) |
| Router | **App Router** (`src/app/` tree with `page.tsx`/`layout.tsx` segment files — no `pages/` directory exists) |
| React | `18.3.x` |
| TypeScript | strict mode (`tsconfig.json` → `"strict": true`) |
| Rendering | Overwhelmingly **static** — `npm run build` marks nearly every route `○ (Static)`; `/guides/[slug]` is `● (SSG)` via `generateStaticParams`; only `/dashboard`, auth pages, and `/api/*` are `ƒ (Dynamic)` |
| Auth | Clerk (`@clerk/nextjs`), enforced in `src/middleware.ts` |
| Deployment | Vercel (`vercel.json` sets long-lived `Cache-Control` for `_next/static`, `/social/*`, `/fonts/*`) |
| Payments | Stripe |

Nearly every tool page follows the same pattern: a `'use client'` `page.tsx` (the interactive tool) paired with a sibling **server-component** `layout.tsx` that owns all `<head>` metadata and JSON-LD — this is the correct App Router pattern for a client-heavy page that still needs static, crawlable metadata.

---

## 2. Route inventory

**74 public, non-API routes** were found (66 top-level `page.tsx` files + 8 dynamic `/guides/[slug]` articles). Full per-route data is in [`page-inventory.csv`](./page-inventory.csv) — every row is a real route pulled from the filesystem, not a sample.

| | Count |
|---|---|
| Total routes audited | 74 |
| Indexable (`robots: index:true`, reachable) | 67 |
| Intentionally `noindex` | 7 — `/cancel`, `/checkout`, `/checkout/confirm`, `/dashboard`, `/manage-subscription`, `/sign-in/*`, `/sign-up/*` |
| In `sitemap.ts` | 67 / 67 indexable routes — **100% coverage, zero orphaned sitemap entries** |
| Sitemap ⟷ noindex conflicts | **0** |
| API routes (`/api/*`, excluded from this audit, all blocked in `robots.ts`) | 22 |

The 7 noindex routes are all legitimately private/transactional (checkout flow, dashboard, auth) and are correctly excluded from `sitemap.ts`.

---

## 3. Findings

Severity: **Critical** (breaks indexing/sharing for real users) · **High** (meaningfully hurts rankings or CTR) · **Medium** (best-practice gap, limited impact) · **Low** (cosmetic/consistency)

### 🔴 Critical

**C1 — Homepage had no `<link rel="canonical">` tag.**
`src/app/layout.tsx` set `metadataBase` but never `alternates.canonical`. `src/app/sitemap.ts` has a comment explicitly warning this must stay in sync with the homepage's canonical (`"keep these two in sync or the sitemap and canonical disagree on the 'real' homepage URL"`) — the invariant it describes was not actually implemented.
**Fixed — and revised once during implementation:** the first attempt added `alternates: { canonical: 'https://www.editpdfai.com/' }` to `src/app/layout.tsx`. That produced a *second*, conflicting bug: Next.js's metadata resolver hardcodes root-path (`/`) canonical URLs down to a bare origin — it silently strips the trailing slash regardless of the string passed in — so the root-layout canonical rendered as `https://www.editpdfai.com` (no slash), the wrong URL. The final fix instead hand-renders `<link rel="canonical" href="https://www.editpdfai.com/" />` directly in `src/app/page.tsx`'s JSX (bypassing the metadata API just for this one page) and leaves `src/app/layout.tsx` with no `alternates.canonical` at all, so nothing cascades down to conflict with it. Every other route sets its own `alternates.canonical` explicitly via the centralized `buildToolMetadata()` generator (built in the follow-up implementation pass — see `/seo-audit/metadata-implementation-report.md`), so none of them depend on root's value either way. Caught and confirmed via the automated regression test added for that pass (`tests/qa/seo-metadata.spec.ts`), which asserts exactly one canonical link per route.

### 🟠 High

**H1 — `/scan-to-pdf` Open Graph/Twitter image pointed at a file that doesn't exist.**
`src/app/scan-to-pdf/layout.tsx` referenced `/social/scan-to-pdf.png`; that file is absent from `public/social/` (confirmed against a directory listing of all 36 files actually in `public/social/`). Any social share of this page (Slack, Twitter/X, LinkedIn, iMessage preview) would show a broken image.
**Fixed:** repointed both `openGraph.images` and `twitter.images` to `/opengraph-image` (the existing dynamic, branded 1200×630 OG image route already used as the site-wide fallback in `src/app/opengraph-image.tsx`). A dedicated hand-designed card for this page is still worth commissioning later — this is a functional fix, not a design upgrade.

**H2 — Stale content on `/pdf-compressor` described server-side processing that no longer exists.**
Both the visible on-page copy (`src/lib/toolSeoData.ts`) and the FAQ said the compressor "uploads your file over HTTPS to run Ghostscript on our server." The tool was migrated to a 100%-client-side Web Worker earlier in this engagement (`src/workers/pdf-compressor` path) — the server round-trip no longer happens. This is a genuine accuracy problem: it overstates a privacy/security weakness that isn't true, and if a user checked network traffic and found no upload, the mismatch would read as untrustworthy copy.
**Fixed:** rewrote the `whatIs`, `steps`, and the relevant FAQ answer to describe local, in-browser re-encoding.

### 🟡 Medium

**M1 — 8 tool pages had zero inbound internal links.**
`chat-with-pdf`, `pdf-repair`, `extract-pdf-images`, `export-pdf-form-data`, `pdf-page-labels`, `remove-pdf-links`, `export-pdf-comments`, `html-to-pdf` were not referenced in any other tool's `related:` block in `src/lib/toolSeoData.ts` — reachable only via the homepage tool grid / sitemap, not via contextual in-content links. This is exactly the kind of orphaning that suppresses internal PageRank flow to secondary tools.
**Fixed:** added 2 contextual inbound links per orphaned tool from the most semantically related sibling pages (16 edits total across `toolSeoData.ts`). Verified with a link-graph script: **0 tools with zero inbound links remain.**

**M2 — Three meta descriptions exceeded Google's ~155–160 char truncation point.**
`pdf-editor` (197 chars — a description I had just lengthened earlier in this engagement), `scan-to-pdf` (185 chars), `chat-with-pdf` (163 chars). Content past the truncation point is invisible in the SERP snippet, wasting the tail end of the sentence.
**Fixed:** trimmed all three to 143–151 chars while keeping the core value proposition.

**M3 — `/checkout/confirm` had no metadata of its own.**
No `export const metadata` and no sibling `layout.tsx`, unlike `/cancel` and `/checkout` which both have one. In practice this page's `noindex` was **already safely inherited** from the parent `/checkout/layout.tsx` (`robots: {index:false}` cascades down the App Router layout tree) and from the `Disallow: /checkout` rule in `robots.ts` — so this was never actually an indexing risk, just an inherited generic "Checkout — EditPDF AI" browser-tab title on a page that's really a payment-confirmation step.
**Fixed:** added `src/app/checkout/confirm/layout.tsx` with its own title and an explicit (now redundant-but-defensive) `noindex`, matching the sibling pattern.

### ⚪ Low

**L1 — 12 tool pages omit an explicit `robots:` key**, relying on inheriting `index:true` from `src/app/layout.tsx` rather than declaring it themselves (`chat-with-pdf`, `export-pdf-comments`, `export-pdf-form-data`, `extract-pdf-attachments`, `extract-pdf-bookmarks`, `extract-pdf-images`, `extract-pdf-links`, `pdf-bookmarks-manager`, `pdf-compare`, `pdf-page-labels`, `remove-pdf-links`, `remove-pdf-metadata`). Functionally correct — root's default is `index:true, follow:true` — but inconsistent with the other 54 indexable pages, which all declare it explicitly. **Not changed**: 12 more edits for zero behavioral difference; flagging for awareness only.

**L2 — `/privacy`, `/support`, `/terms` carry no JSON-LD.** Reasonable for legal/support pages (no natural `SoftwareApplication`/`FAQPage` fit), but a `WebPage` schema would be a trivial, low-effort addition. Not implemented — genuinely low value.

---

## 4. Checks that came back clean (evidence, not assumption)

- **Duplicate titles**: 0 across all 74 routes (exact-string comparison).
- **Duplicate meta descriptions**: not found in the same pass.
- **Thin content**: 0 tool pages under 200 words of on-page SEO copy (`whatIs` + `users` + `faqs` + `steps` combined); the shortest is `pdf-repair` at 372 words.
- **Missing image alt text**: 0 across all 22 `<Image>`/`<img>` usages in `src/app` and `src/components` (script-verified, not sampled).
- **Multiple `<h1>` per page**: 0 real cases. The scan initially flagged 3 tool pages (`html-to-pdf`, `odt-to-pdf`, `pdf-to-ppt`) — each is a false positive, verified by reading the surrounding code:
  - `html-to-pdf`: the second `<h1>` is inside a JS template-literal string (`SAMPLE_HTML`) used as default content for the HTML→PDF converter's own iframe preview — it's a separate document, not part of the parent page's DOM.
  - `odt-to-pdf` / `pdf-to-ppt`: the second `<h1>` only renders after a user uploads and converts a file client-side (a live document/slide preview) — never present in the crawlable default state, since Googlebot does not fill file inputs.
- **Sitemap/robots conflicts**: 0. Every `sitemap.ts` entry is indexable; every indexable route is in the sitemap.
- **Orphaned sitemap entries** (URL in sitemap with no matching route): 0.

---

## 5. Not yet done (explicitly out of scope for this pass, per agreed sequencing)

The user requested 7 total workstreams; this audit is #1. Status as of this update:

- ~~Centralized typed metadata generator~~ — **done**, see `/seo-audit/metadata-implementation-report.md` (`src/lib/seo/metadata.ts` + `src/lib/seo/routes.ts`, applied to every indexable route).
- ~~Formal automated tests asserting no missing/duplicate title/description/canonical/H1~~ — **done**, `tests/qa/seo-metadata.spec.ts`.
- Per-page content/keyword-cannibalization pass with a formal keyword map — **still pending**.
- Sitemap `lastModified` accuracy (many entries still carry placeholder `2026-01-01` dates rather than real last-touched dates — see `src/app/sitemap.ts`) — **still pending**.
- Structured-data audit beyond what's inventoried here (schema *validity*, not just presence) — **still pending**.
- Internal-link *hub* architecture (category pages), vs. the flat related-tools cross-linking fixed in M1 — **still pending**.
- Lighthouse-measured Core Web Vitals baseline + optimization — **still pending**.

## 6. Verification

```
npx tsc --noEmit -p .     # clean, 0 errors outside pre-existing test-file issues
npm run build              # clean, exit 0, no new warnings
```

No functionality was changed — every fix in this pass was metadata, static SEO copy, or an added `layout.tsx` for a page that had none.
