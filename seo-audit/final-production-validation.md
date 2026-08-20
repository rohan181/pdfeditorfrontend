# EditPDF AI final production SEO and AEO validation

Validated against the optimized Next.js production build on 20 August 2026. This is a local production-mode validation of the code in this workspace, not a crawl of the deployed Vercel release.

## Outcome

- 70 canonical, indexable URLs return HTTP 200 and appear exactly once in `sitemap.xml`.
- Every indexable URL has a unique title, unique meta description, one H1, an absolute self-referencing canonical, index/follow behavior, complete Open Graph and Twitter metadata, parseable JSON-LD, meaningful server-rendered content, and labeled internal links.
- The internal-link crawl found no remaining HTTP errors after correcting the obsolete `/delete-pdf-pages` link.
- Seven private or application-only routes are excluded from the sitemap and configured `noindex, follow`; unauthenticated `/dashboard` now redirects to `/sign-in` instead of returning 404.
- Unknown routes render the custom recovery page with a real HTTP 404 and `noindex`.
- The crawler, metadata, schema, product-messaging, tool-content, trust, responsive, and priority PDF-workflow tests pass.

## Final route table

`Pass` means the route passed status, metadata, H1, SSR content, descriptive-link, broken-link, structured-data, product-claim, and mobile-shell checks applicable to that route.

| URL | Indexable? | Title | Canonical | Schema | Sitemap? | Content status | Issues remaining |
|---|---:|---|---|---|---:|---|---|
| / | Yes | EditPDF AI: Free Online PDF Editor & 51 PDF Tools | https://www.editpdfai.com | Organization, WebSite, WebPage, WebApplication, FAQPage | Yes | Pass | None |
| /about | Yes | About EditPDF AI — PDF Tools & Data Handling | https://www.editpdfai.com/about | Organization, AboutPage | Yes | Pass | None |
| /guides | Yes | PDF Guides & How-To Articles \| EditPDF AI | https://www.editpdfai.com/guides | Organization, CollectionPage, ItemList, BreadcrumbList | Yes | Pass | None |
| /pdf-merger | Yes | Merge PDF Files Online Free — Combine PDFs in One Click | https://www.editpdfai.com/pdf-merger | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-splitter | Yes | Split PDF Online Free — Separate PDF Files by Range | https://www.editpdfai.com/pdf-splitter | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-watermark | Yes | Add a Watermark to PDF Online Free | https://www.editpdfai.com/pdf-watermark | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /add-page-numbers | Yes | Add Page Numbers to PDF Online Free — Number PDF Pages | https://www.editpdfai.com/add-page-numbers | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /ai-pdf-form-filler | Yes | AI PDF Form Filler — Autofill PDF Forms Online | https://www.editpdfai.com/ai-pdf-form-filler | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /chat-with-pdf | Yes | Chat with PDF Online - AI Answers with Page Citations | https://www.editpdfai.com/chat-with-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /contact | Yes | Contact Us \| EditPDF AI | https://www.editpdfai.com/contact | Organization, ContactPage | Yes | Pass | None |
| /delete-pages | Yes | Delete PDF Pages Online Free — Remove Pages from PDF | https://www.editpdfai.com/delete-pages | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /excel-to-pdf | Yes | Excel to PDF Converter Online Free — XLSX to PDF | https://www.editpdfai.com/excel-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /export-pdf-comments | Yes | Export PDF Comments Online - Download Annotations as CSV or JSON | https://www.editpdfai.com/export-pdf-comments | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /export-pdf-form-data | Yes | Export PDF Form Data Online - Download CSV or JSON | https://www.editpdfai.com/export-pdf-form-data | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /extract-pages | Yes | Extract PDF Pages Online Free — Save Specific Pages as PDF | https://www.editpdfai.com/extract-pages | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /extract-pdf-attachments | Yes | Extract PDF Attachments Online - Download Embedded Files | https://www.editpdfai.com/extract-pdf-attachments | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /extract-pdf-bookmarks | Yes | Extract PDF Bookmarks Online - Export Outline to CSV or JSON | https://www.editpdfai.com/extract-pdf-bookmarks | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /extract-pdf-images | Yes | Extract Images from PDF Online - Download Embedded Pictures | https://www.editpdfai.com/extract-pdf-images | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /extract-pdf-links | Yes | Extract PDF Links Online - Export URLs and Page Destinations | https://www.editpdfai.com/extract-pdf-links | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /html-to-pdf | Yes | HTML to PDF Converter Online Free — HTML File to PDF | https://www.editpdfai.com/html-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /image-to-pdf | Yes | Image to PDF Converter Online Free — JPG, PNG to PDF | https://www.editpdfai.com/image-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /mind-map | Yes | AI Mind Map Generator from PDF — Visualise Any Document | https://www.editpdfai.com/mind-map | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /odt-to-pdf | Yes | ODT to PDF Converter Online Free — OpenDocument to PDF | https://www.editpdfai.com/odt-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-annotate | Yes | Annotate PDF Online — Highlight, Comment & Draw | https://www.editpdfai.com/pdf-annotate | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-bookmarks-manager | Yes | PDF Bookmarks Manager Online - Add, Edit and Remove Bookmarks | https://www.editpdfai.com/pdf-bookmarks-manager | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-compare | Yes | Compare PDF Files Online - Find Visual and Text Changes | https://www.editpdfai.com/pdf-compare | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-compressor | Yes | Compress PDF Online Free — Reduce PDF File Size | https://www.editpdfai.com/pdf-compressor | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-cropper | Yes | Crop PDF Pages Online Free — Trim PDF Margins | https://www.editpdfai.com/pdf-cropper | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-editor | Yes | Edit a PDF Without Adobe Acrobat — Free Online PDF Editor | https://www.editpdfai.com/pdf-editor | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-flatten | Yes | Flatten PDF Online - Make Forms and Annotations Permanent | https://www.editpdfai.com/pdf-flatten | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-form-builder | Yes | PDF Form Builder Online Free — Create Fillable PDF Forms | https://www.editpdfai.com/pdf-form-builder | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-ocr | Yes | PDF OCR Online Free — Extract Text from Scanned PDF | https://www.editpdfai.com/pdf-ocr | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-page-labels | Yes | PDF Page Labels Online - Roman Numerals, Prefixes and Sections | https://www.editpdfai.com/pdf-page-labels | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-page-manager | Yes | PDF Page Manager — Reorder, Delete & Add Pages | https://www.editpdfai.com/pdf-page-manager | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-password-lock | Yes | PDF Password Lock — Password Protect PDF Free Online | https://www.editpdfai.com/pdf-password-lock | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-redactor | Yes | Cover Sensitive PDF Content Online — Add Opaque Marks | https://www.editpdfai.com/pdf-redactor | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-repair | Yes | Repair PDF Online - Recover a Damaged PDF | https://www.editpdfai.com/pdf-repair | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-signer | Yes | PDF E-Signer Online Free — Add a Signature to PDF | https://www.editpdfai.com/pdf-signer | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-summarizer | Yes | AI PDF Summarizer Online — Summarize PDF Documents | https://www.editpdfai.com/pdf-summarizer | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-to-excel | Yes | PDF to Excel Converter Online — Export Tables to XLS | https://www.editpdfai.com/pdf-to-excel | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-to-images | Yes | PDF to Image Converter Online Free — PDF to JPG, PNG | https://www.editpdfai.com/pdf-to-images | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-to-ppt | Yes | PDF to PowerPoint Online — Create an Editable PPTX | https://www.editpdfai.com/pdf-to-ppt | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-to-word | Yes | PDF to Word Converter Online — Editable DOC File | https://www.editpdfai.com/pdf-to-word | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-translator | Yes | AI PDF Translator — Translate PDFs Online | https://www.editpdfai.com/pdf-translator | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-unlock | Yes | Unlock PDF Online - Remove a Known PDF Password | https://www.editpdfai.com/pdf-unlock | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pdf-viewer | Yes | PDF Viewer Online Free — Open & Read PDF in Browser | https://www.editpdfai.com/pdf-viewer | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /ppt-to-pdf | Yes | PowerPoint to PDF Converter Online Free — PPTX to PDF | https://www.editpdfai.com/ppt-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /pricing | Yes | Pricing & Plans \| EditPDF AI | https://www.editpdfai.com/pricing | Organization, WebPage, FAQPage | Yes | Pass | None |
| /privacy | Yes | Privacy Policy \| EditPDF AI | https://www.editpdfai.com/privacy | Organization | Yes | Pass | None |
| /quiz-creator | Yes | AI Quiz Creator from PDF — Generate Practice Questions | https://www.editpdfai.com/quiz-creator | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /remove-pdf-links | Yes | Remove Links from PDF Online - Disable All Clickable Links | https://www.editpdfai.com/remove-pdf-links | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /remove-pdf-metadata | Yes | Remove PDF Metadata Online - Clean Hidden Document Properties | https://www.editpdfai.com/remove-pdf-metadata | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /rotate-pdf | Yes | Rotate PDF Online Free — Rotate Pages in Seconds | https://www.editpdfai.com/rotate-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /rtf-to-pdf | Yes | RTF to PDF Converter Online Free — Rich Text to PDF | https://www.editpdfai.com/rtf-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /scan-to-pdf | Yes | Scan to PDF Online Free — Camera Document Scanner | https://www.editpdfai.com/scan-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /support | Yes | Help & Support \| EditPDF AI | https://www.editpdfai.com/support | Organization | Yes | Pass | None |
| /terms | Yes | Terms of Service \| EditPDF AI | https://www.editpdfai.com/terms | Organization | Yes | Pass | None |
| /txt-to-pdf | Yes | TXT to PDF Converter Online Free — Text File to PDF | https://www.editpdfai.com/txt-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /word-to-pdf | Yes | Word to PDF Converter Online Free — DOCX to PDF | https://www.editpdfai.com/word-to-pdf | Organization, WebPage, WebApplication, BreadcrumbList, FAQPage | Yes | Pass | None |
| /guides/how-to-edit-a-pdf-without-adobe | Yes | How to Edit a PDF Without Adobe Acrobat — Free & Online | https://www.editpdfai.com/guides/how-to-edit-a-pdf-without-adobe | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-reduce-pdf-file-size | Yes | How to Reduce PDF File Size Online — Compression Guide | https://www.editpdfai.com/guides/how-to-reduce-pdf-file-size | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-fill-out-a-pdf-form-automatically | Yes | How to Fill a PDF Form with AI — Review Suggested Fields | https://www.editpdfai.com/guides/how-to-fill-out-a-pdf-form-automatically | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-sign-a-pdf-online | Yes | How to Sign a PDF Online Free — No Adobe, No Printing | https://www.editpdfai.com/guides/how-to-sign-a-pdf-online | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-make-a-scanned-pdf-searchable | Yes | How to Make a Scanned PDF Searchable with OCR | https://www.editpdfai.com/guides/how-to-make-a-scanned-pdf-searchable | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/pdf-vs-word-which-format-to-use | Yes | PDF vs Word: Which Format to Use and When | https://www.editpdfai.com/guides/pdf-vs-word-which-format-to-use | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-merge-pdf-files | Yes | How to Merge PDF Files in a Browser — Free Guide | https://www.editpdfai.com/guides/how-to-merge-pdf-files | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-redact-sensitive-information-from-a-pdf | Yes | Covering PDF Content vs Secure Redaction — Safety Guide | https://www.editpdfai.com/guides/how-to-redact-sensitive-information-from-a-pdf | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-extract-pages-from-a-pdf | Yes | How to Extract Pages from a PDF into a New File | https://www.editpdfai.com/guides/how-to-extract-pages-from-a-pdf | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-reorder-pages-in-a-pdf | Yes | How to Reorder PDF Pages and Save the New Sequence | https://www.editpdfai.com/guides/how-to-reorder-pages-in-a-pdf | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /guides/how-to-combine-images-into-one-pdf | Yes | How to Combine JPG and PNG Images into One PDF | https://www.editpdfai.com/guides/how-to-combine-images-into-one-pdf | Organization, WebPage, Article, BreadcrumbList | Yes | Pass | None |
| /sign-in | No | Sign In to EditPDF AI | — | Organization | No | Pass — noindex, follow | None |
| /sign-up | No | Create an EditPDF AI Account | — | Organization | No | Pass — noindex, follow | None |
| /dashboard | No | — | — | — | No | Pass — 307 to noindex sign-in when signed out | Authenticated content requires deployed-origin verification |
| /manage-subscription | No | Manage Subscription — EditPDF AI | — | Organization | No | Pass — 307 to noindex sign-in when signed out | Authenticated content requires deployed-origin verification |
| /checkout | No | Subscription Checkout — EditPDF AI | — | Organization | No | Pass — noindex, follow | Payment completion requires a Stripe test transaction |
| /checkout/confirm | No | Confirming Payment — EditPDF AI | — | Organization | No | Pass — noindex, follow | Payment completion requires a Stripe test transaction |
| /cancel | No | Subscription Status — EditPDF AI | — | Organization | No | Pass — noindex, follow | Subscription state requires an authenticated test account |

## Crawling and redirect controls

Final `robots.txt`:

```text
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /trpc/

Sitemap: https://www.editpdfai.com/sitemap.xml
```

- Sitemap URL: `https://www.editpdfai.com/sitemap.xml`
- Sitemap URL count: 70
- Excluded page routes: `/sign-in`, `/sign-up`, `/dashboard`, `/manage-subscription`, `/checkout`, `/checkout/confirm`, `/cancel`
- Non-page surfaces excluded from crawling: `/api/*`, `/trpc/*`
- No synthetic `lastModified` dates are emitted. Guide dates remain absent until verified editorial data exists.
- HTTP, non-www, alternate-host, and trailing-slash variants redirect once with HTTP 308 to `https://www.editpdfai.com`; query strings survive the redirect but never enter canonicals.
- Unauthenticated `/dashboard` redirects once with HTTP 307 to `/sign-in?redirect_url=%2Fdashboard`.
- Canonical destinations return 200, with no redirect loops or second normalization hop.

## Problems corrected during final validation

1. Added a custom, useful 404 page and verified the actual HTTP 404 plus `noindex` response.
2. Replaced unsafe claims that the PDF Redactor permanently removes underlying data. The implementation draws opaque rectangles; the page, guide, registry, related links, homepage cards, metadata, FAQs, and JSON-LD now say so and warn against using it for secure redaction.
3. Replaced the PDF Watermarker's unsupported “Free Forever” message and contradictory 100 MB claim with the implemented access and device-dependent limit language.
4. Corrected AI form, OCR, merger, editor, and sensitive-content guide claims that overstated automation, language coverage, capacity, pricing comparisons, or output guarantees.
5. Corrected the broken `/delete-pdf-pages` guide link to `/delete-pages`.
6. Changed the signed-out dashboard behavior from a 404 to an intentional sign-in redirect.
7. Added a repeatable full-route production validation suite and a standard Next.js lint gate.

## Quality gates

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | Pass |
| `npm run lint` | Pass with pre-existing non-blocking warnings |
| `npm run build` | Pass; 110 static pages generated and build-time lint/type phase completed |
| Production SEO/AEO QA | 187 passed |
| Priority PDF workflow journeys | 6 passed; generated PDFs validated with QPDF |
| Responsive suite | 429 passed, 27 intentionally skipped outside the phone-only workspace cases |
| Manual phone-width browser review | Pass at 390 × 844 for homepage, PDF Editor, AI Form Filler, a guide, and custom 404 |

The lint warnings predate this final SEO validation and concern raw `<img>` elements used for browser-generated PDF previews/signatures, one signer font-loading warning, and four React hook dependency warnings. They are not build failures, but the hook warnings should be reviewed separately with functional regression coverage before changing editor behavior.

## Remaining manual and owner checks

- Deploy this exact build, then use Google Search Console to submit the sitemap, inspect representative canonicals, and monitor Page Indexing and Enhancement reports.
- Run Google's Rich Results Test or the Schema Markup Validator against deployed representative homepage, tool, guide, and pricing URLs. Local tests validate JSON syntax, entity relationships, visible FAQ parity, and the absence of fabricated ratings, reviews, offers, authors, awards, or founding data.
- Verify signed-in dashboard, subscription management, and full Stripe test-mode success/cancel flows on the configured production hostname. Clerk correctly rejects production keys on localhost, so authenticated UI state could not be visually exercised in the local browser.
- Confirm CDN/Vercel redirects for raw HTTP and every owned alternate hostname after deployment; middleware behavior passed locally with forwarded production headers.
- Review dependency upgrades separately. `npm audit --omit=dev` reports 10 production dependency advisories, including the installed Next.js 14 and PDF.js 3 lines. Fixes require major framework/PDF.js upgrades and are outside this SEO-only change; they should not be addressed without dedicated PDF regression work.

