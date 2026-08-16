# EditPDF AI — Core Web Vitals Report

**Date:** 2026-08-16 · **Build:** production build (`npm run build && npm run start`, port 3100) · **Method:** real, measured metrics — not estimated, not simulated Lighthouse scores copied from elsewhere.

## Methodology (so this is reproducible, not just asserted)

Lighthouse itself wasn't installed (avoiding an unnecessary new dependency per the project's existing constraints) — instead, this uses **Playwright's Chromium** (already a devDependency, already used by this repo's own `tests/responsive/*.spec.ts`) driven directly via the Chrome DevTools Protocol, reading the **same native browser APIs Lighthouse itself reads**:

- `PerformanceObserver({ type: 'largest-contentful-paint' })` → real LCP timing **and the actual DOM element** that triggered it (tag/id/class), not a guess.
- `PerformanceObserver({ type: 'layout-shift' })` → real CLS score, summed only over shifts without recent user input (matches the official CLS spec).
- `PerformanceObserver({ type: 'longtask' })` → Total Blocking Time proxy (sum of each task's duration past the 50ms threshold).
- One real interaction (click on the first visible button/link) with `click → next-paint` timing, as a lab approximation of INP. **This is not the same as field/CrUX INP** — no automated lab test fully replicates INP, which is defined over real user interaction patterns — so treat this number as a rough responsiveness signal, not a certified INP score.

Device/network emulation matches Lighthouse's own mobile defaults: **412×823 viewport, DPR 2.625, "Slow 4G" throttling (1.6 Mbps down / 750 Kbps up / 150ms RTT), 4× CPU slowdown.** Full script: `measure.js` (available on request — not committed to the repo, this was a one-off measurement tool, not product code).

Each route was measured twice (cold Chromium instance per run, cache disabled by nature of a fresh context) to check for stability before drawing conclusions.

## Results — both runs

| Route | Template | LCP (run 1 / run 2) | CLS | TBT | Interaction lat. | LCP element |
|---|---|---|---|---|---|---|
| `/` | Homepage | 1120ms / 1156ms | 0 | 100–111ms | 43–45ms | `<p class="home-hero-title">` (text, not an image) |
| `/ai-pdf-form-filler` | Flagship AI tool, heaviest editor UI | 912ms / 904ms | 0.0012 | 25–29ms | 34–43ms | `<p class="hero-sub">` (text) |
| `/pdf-form-builder` | Heaviest First Load JS of any tool page (267kB, per build output) | 864ms / 812ms | 0.0008 | 5–9ms | 23–30ms | `<p>` (text) |
| `/pdf-merger` | Representative simple utility/converter template | 828ms / 804ms | 0.0015 | 0–4ms | 21–31ms | `<p>` (text) |
| `/guides/how-to-edit-a-pdf-without-adobe` | Guide/content page, mostly static | 828ms / 828ms | 0 | 1–7ms | 17–22ms | `<p>` (text) |

**Against your targets, on throttled mobile, every route tested:**

| Metric | Target (p75) | Measured range | Verdict |
|---|---|---|---|
| LCP | ≤ 2,500ms | 804–1,156ms | ✅ 2.2–3.1× under target |
| CLS | ≤ 0.1 | 0–0.0015 | ✅ ~65× under target |
| TBT (INP proxy) | — | 0–111ms | ✅ well under the ~200ms INP budget |

## Why it's already this good — and what was verified, not assumed

This isn't a lucky baseline. Two things were checked directly against the source, not inferred from the good numbers:

**1. Heavy PDF libraries are already fully code-split.** Checked every `page.tsx` for static top-level imports of `pdf-lib`, `pdfjs-dist`, `mammoth`, `jszip`, `@techstark/opencv-js`, `@neslinesli93/qpdf-wasm`:
```
Static top-level imports of these libs in page.tsx: 0 (2 matches were `import type`, erased at compile time — zero runtime cost)
Dynamic import() calls of these libs across src/: 45
```
Every one of these libraries is already loaded on-demand, not bundled into the initial page load. This is exactly what your brief's task #7 asked for — it was already done, evidently by the same prior session that did the CSS/Framer Motion performance pass referenced in project memory.

**2. Third-party scripts are already deferred correctly.** `src/components/Analytics.tsx` loads Google Analytics, Cloudflare Web Analytics, and PostHog via `next/script` with `strategy="afterInteractive"` — none of them block the initial render.

**3. The 26 raw `<img>` tags found (bypassing `next/image`) are all legitimate exceptions, not bugs.** Every one renders **client-generated content that appears only after a user uploads and processes a file** — canvas-rendered PDF page thumbnails, signature data URLs, watermark previews, extracted-image results (`src/app/pdf-signer/page.tsx`, `pdf-watermark/page.tsx`, `pdf-splitter/page.tsx`, `extract-pdf-images/page.tsx`, etc.). These are Blob/Data URLs from in-browser file processing — `next/image`'s optimizer can't process them anyway (they're not resolvable static assets), and none of them appear in the initial-load LCP path measured above (confirmed: every LCP element was hero text, never an image). Most already carry `loading="lazy"`.

**4. Fonts, static rendering, and caching** were already covered by the prior session's dedicated performance pass (see project memory: two self-hosted font families via `next/font`, `display: swap`, Framer Motion infinite animations converted to CSS `@keyframes`, Server Component extraction for FAQ/pricing/testimonials sections). This session's `npm run build` output confirms nearly every route is still `○ (Static)` or `● (SSG)`, and `vercel.json`'s long-lived cache headers for `_next/static`/`/social/*`/`/fonts/*` are unchanged.

## What this means for your task list

| Your requirement | Status |
|---|---|
| 1. Baseline Lighthouse-equivalent measurement before editing | ✅ Done — table above |
| 2. Real LCP element per template | ✅ Done — all text, not images |
| 3–5. Fonts/hero assets/images, `next/image`, explicit dimensions | ✅ Verified — no LCP-path images exist; the one initial-load hero content is text with self-hosted swapped fonts |
| 6–7. Reduce unnecessary client JS; dynamic-import heavy libraries | ✅ Verified already satisfied (evidence above) |
| 8. SEO text in server-rendered HTML | ✅ Already confirmed earlier this session (structured-data audit) |
| 9. Break up long main-thread tasks | ✅ Already low — TBT 0–111ms measured |
| 10. Remove unused dependencies (only after proving unused) | ⚠️ **Not done this pass** — proving a dependency is genuinely unused (not just unimported in the files I sampled) needs a full-repo import graph, which is a separate, careful piece of work; not attempted given the current numbers show no bundle-size problem to justify the risk |
| 11. Defer third-party scripts | ✅ Already correct (`afterInteractive`) |
| 12. Caching/static generation | ✅ Already correct, unchanged |
| 13. Preserve accessibility/functionality | ✅ N/A — no code was changed this pass; nothing to regress |
| 14. Run build + measure after | ✅ Two full measurement runs shown above, both post-build |

## Bottom line

**No code changes were made in this pass.** The honest finding, backed by two independent measurement runs against a real production build under throttled mobile conditions, is that this site's Core Web Vitals are already comfortably within target on every template tested — a direct result of the prior session's performance work (documented in project memory) plus already-disciplined dynamic-import practices in the tool code. Manufacturing "optimizations" against numbers that are already 2–65× better than target would be effort spent without a measurable problem to fix, and risks introducing regressions for no benefit — so nothing was touched.

**What would still be worth doing, if you want deeper coverage:**
- Run the same measurement against 2–3 more templates not sampled here (a document-conversion tool, an OCR/AI tool with heavier initial UI, the pricing page) to confirm the pattern holds site-wide rather than on 5 examples.
- A full unused-dependency audit (item 10) — safe to do, just needs its own careful pass with a real import-graph tool rather than a manual grep, since guessing wrong here means breaking a production import.
- Field data (real-user CrUX/Search Console Core Web Vitals report) once there's enough traffic — lab numbers this good are a strong signal, not a guarantee of real-world INP, which depends on actual user devices and interaction patterns this test can't fully replicate.

## Verification commands

```bash
npm run build && PORT=3100 npm run start   # production server
# then, with Playwright already installed as a devDependency:
NODE_PATH=./node_modules node measure.js http://localhost:3100
```
