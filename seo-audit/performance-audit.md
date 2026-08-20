# EditPDF AI production-mode performance audit

Audit date: 20 August 2026

## Method

- Audited a local `next build` served with `next start`, not the development server.
- Captured the baseline before making performance changes.
- Ran Lighthouse 12.8.2 three times per route with its simulated mobile profile (412 × 823 CSS pixels, 4× CPU slowdown) and used the median.
- Rebuilt the application and repeated the same three-run measurement after implementation.
- Used Lighthouse Total Blocking Time as a repeatable lab responsiveness proxy. Interaction to Next Paint is a field metric and is not produced by a navigation-only Lighthouse run. The PageSpeed Insights field-data request could not be completed because the API quota was exhausted, so production INP still needs CrUX or Google Search Console data.
- Performed separate 390 × 844 rendered-browser checks for horizontal overflow, server-rendered headings/content, skip-link targets, deferred PDF runtime, on-demand editor activation, and merger file selection.

## Before and after

Times are milliseconds. Transfer and JavaScript values are decimal kilobytes. Scores, timing, and transfer size are medians of three runs.

| Route | Perf. | A11y | FCP | LCP | TBT | CLS | JS transferred | Total transferred |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Homepage | 94 → 92 | 96 → 100 | 991 → 934 | 3,116 → 3,361 | 37 → 46 | 0 → 0 | 494.8 → 377.0 kB | 639.8 → 496.0 kB |
| PDF Editor | 90 → 91 | 96 → 96 | 957 → 936 | 3,597 → 3,520 | 39 → 50 | 0 → 0 | 412.5 → 370.2 kB | 516.5 → 472.9 kB |
| AI PDF Form Filler | 93 → 92 | 94 → 96 | 949 → 993 | 3,237 → 3,414 | 37 → 52 | 0 → 0 | 434.3 → 329.4 kB | 544.1 → 437.5 kB |
| PDF Merger | 92 → 93 | 94 → 96 | 762 → 769 | 3,318 → 3,223 | 45 → 41 | 0 → 0 | 407.7 → 365.5 kB | 506.7 → 464.5 kB |
| PDF Compressor | 92 → 93 | 94 → 96 | 767 → 769 | 3,326 → 3,219 | 42 → 32 | 0 → 0 | 407.2 → 365.0 kB | 505.9 → 463.2 kB |
| PDF Viewer | 88 → 91 | 94 → 96 | 766 → 771 | 3,915 → 3,384 | 32 → 71 | 0 → 0 | 408.8 → 366.5 kB | 508.3 → 465.5 kB |
| Extract-pages guide | 96 → 97 | 94 → 96 | 912 → 915 | 2,759 → 2,614 | 84 → 28 | 0 → 0 | 423.6 → 238.5 kB | 557.9 → 344.5 kB |

The homepage and AI form Lighthouse performance scores moved down slightly because their simulated LCP/TBT medians varied upward even though both transferred and executed materially less JavaScript. The report keeps those regressions visible rather than treating the score alone as the outcome. CLS remained zero on every route.

## Three largest improvements

1. **Guide route isolation and prefetch control.** The guide now transfers 185.1 kB less JavaScript (43.7%), 213.4 kB less overall (38.2%), makes 11 fewer requests, and reduced median TBT from 84 ms to 28 ms. Browser verification found no PDF/editor runtime and no route-prefetch tags on the rendered guide.
2. **Homepage route/runtime deferral.** Removing eager tool-route prefetches and application-only modal/result runtime cut homepage JavaScript by 117.7 kB (23.8%), total transfer by 143.8 kB (22.5%), requests from 45 to 29, and main-thread work by 198 ms (14.4%).
3. **True on-demand AI editor loading.** Removing the AI form's 1.2-second idle preload means the editor chunk is requested only on pointer/focus intent or activation. The landing page now transfers 104.9 kB less JavaScript and reports 98.6 kB less unused JavaScript. A rendered-browser check confirmed no editor runtime after idle, followed by a working editor dialog after the CTA was activated.

Disabling Clerk's prefetched UI contributed about 45 kB of third-party transfer reduction on every audited route. The base Clerk runtime still loads because authentication is provided by the root layout.

## Findings by area

### Core Web Vitals and responsiveness

- LCP is text on every audited route, not a hero image. The simulated LCP remains above 2.5 seconds on all seven routes, with the guide closest at 2.61 seconds. Render-blocking CSS is only about 13.2 kB and Lighthouse estimates little benefit from further CSS inlining.
- Navigation TBT remains low in absolute terms (28–71 ms), although the viewer's post-change median was 39 ms higher and should be watched in field data.
- CLS is 0 for all routes. Existing image dimensions, stable tool shells, and reserved editor/loading layouts are working.
- INP requires real-user interaction data. Use Google Search Console Core Web Vitals or CrUX after deployment; lab TBT is not an INP substitute.

### JavaScript, unused code, and hydration

- The production build reports 88.6 kB of framework JavaScript shared by all routes. Route first-load output is 103 kB for guides, 207 kB for the homepage, 222 kB for the AI form, and 257–262 kB for the representative PDF tools.
- PDF.js, pdf-lib, the editor, and processing workers were already loaded at the point of upload or action on PDF Editor, Merger, Compressor, and Viewer. Those boundaries were preserved.
- The incorrect exception was AI PDF Form Filler, which preloaded the full editor after 1.2 seconds even without intent. That preload was removed; pointer/focus intent and CTA activation still preload or open it.
- Post-change unused-JavaScript estimates are about 118 kB on tool routes and 92 kB on the guide. The largest remaining common cost is the root authentication runtime plus shared client UI/icon code.
- The root authentication provider still hydrates public guides. Removing that last cost safely would require an App Router route-group/layout split so authenticated and application routes keep Clerk while guide/company layouts do not. That architectural change was not made in this risk-controlled pass.
- Core guide and tool SEO content remains present in server-rendered HTML. Dynamic imports apply to application runtime and client-only processing UI, not the indexable copy.

### CSS, fonts, and images

- The stylesheet transfer is about 13.2 kB. Lighthouse marks roughly 11.2–11.8 kB unused on individual tool/guide routes because one compact global stylesheet serves many page variants. The transfer is small enough that a risky route-by-route CSS rewrite is not justified by this audit.
- Two self-hosted `next/font` WOFF2 files total 65.2 kB. Both are preloaded, use `font-display`, and Lighthouse reports no font-display failure.
- Audited routes use the small SVG logo or CSS/interface graphics rather than large hero raster images. Next.js `Image` usage has explicit intrinsic dimensions and responsive sizing; Lighthouse found no image-delivery opportunity.

### Third parties and analytics

- Clerk is the material third-party script. Median third-party transfer fell from about 128 kB to about 83 kB after disabling Clerk UI prefetch. Base authentication remains available.
- Google Analytics and Cloudflare Web Analytics now use `lazyOnload` when configured. Route page-view tracking is scheduled with `requestIdleCallback`, with a delayed fallback.
- Local Lighthouse runs did not exercise production-only analytics credentials. Network behavior with the real production environment must be checked after deployment.

### Motion, mobile layout, and accessibility

- The existing global reduced-motion media query collapses animation/transition duration. The AI form also stops its rotating demo when `prefers-reduced-motion: reduce` matches and exposes a pause control.
- At 390 × 844, the homepage, AI form, guide, and merger had no horizontal overflow. The multi-file merger reached its enabled two-file state, and the AI editor opened on demand.
- Lighthouse accessibility improved from 96 to 100 on the homepage and from 94 to 96 on the AI form, Merger, Compressor, Viewer, and guide. Fixes include valid skip targets, matched visible/accessibility names, valid list roles, and higher-contrast shared labels.
- Remaining Lighthouse failures are legacy color-contrast cases: 33 on PDF Editor, 20 on AI Form Filler, 16 on Merger, 15 on Compressor, 11 on Viewer, and 5 on the guide. These mostly involve small muted labels and decorative accent text and should be handled in a dedicated palette pass with visual review.

## Verification

- `npx tsc --noEmit`: passed.
- `npm run build`: passed; Next.js 14.2.35 compiled, linted/type-checked, and generated 110 static pages.
- SEO/production QA: 112 of 113 passed on the first full run; the one footer accessible-name expectation was reconciled and its complete five-test file then passed.
- Responsive suite: all 420 general tool-shell checks passed. Nine phone-workspace tests passed across Chromium, Firefox, and WebKit. The 27 non-phone executions of those explicitly phone-only assertions are now skipped rather than producing invalid failures.
- Rendered browser: server headings and skip targets present; no horizontal overflow; no PDF runtime on homepage/guide; AI editor activates on demand; merger accepts two files and enables its merge action.

## Deployment follow-up

1. Verify INP and LCP in Google Search Console/CrUX after enough post-deployment traffic is available.
2. Confirm production analytics requests begin only after load/idle and do not introduce consent or main-thread regressions.
3. Run a real-device upload/export smoke test for Editor, Merger, Compressor, and Viewer, including a large and image-heavy PDF.
4. Consider a separate public/authenticated route-layout split if removing the remaining Clerk runtime from guides and company pages is worth the architectural change.
5. Address the remaining low-contrast legacy labels in a visually reviewed accessibility pass.
