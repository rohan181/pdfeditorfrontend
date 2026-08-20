# EditPDF AI SEO content plan

## Scope and publishing standard

This is a deliberately small, 12-guide roadmap across eight topic clusters. It is not a request to publish all 12 at once. The first three guides are implemented; the remaining nine are briefs that should be written only after search-performance data and product verification support them.

Each guide has one primary landing page and one dominant intent. A guide should not be published unless its workflow has been tested against the current product, its factual claims have named evidence, and it gives a reader substantially more help than the landing page alone. Search Console query overlap should be reviewed after each release group before another guide with a related intent is added.

Existing guides already occupy these intents and should not be recreated: editing a PDF without Adobe, reducing PDF size, automatically filling a PDF form, signing a PDF online, making a scanned PDF searchable, choosing PDF versus Word, merging PDFs, and redacting PDF content.

## Priority order

| Priority | Cluster | Proposed guide | Primary landing page | Status | Why it earns a place |
|---:|---|---|---|---|---|
| 1 | Merge and organize PDF | Extract selected PDF pages into one file | `/extract-pages` | Implemented | Narrow transactional intent, directly demonstrable workflow, and clearly distinct from splitting or deleting pages. |
| 2 | Merge and organize PDF | Reorder PDF pages and save the sequence | `/pdf-page-manager` | Implemented | High task completion value and a distinct page-management workflow that includes rotation, deletion, and multiple source PDFs. |
| 3 | PDF conversion | Combine JPG and PNG images into one PDF | `/image-to-pdf` | Implemented | Concrete multi-file conversion intent with useful decisions about page size, order, margins, orientation, and quality. |
| 4 | PDF privacy and security | Password-protect a PDF in the browser | `/pdf-password-lock` | Planned | Transactional security task with room for an honest explanation of encryption, password handling, and limitations. |
| 5 | PDF conversion | Convert PDF to Word and understand formatting changes | `/pdf-to-word` | Planned | Commercially relevant conversion query narrowed to the reader's main risk: what will and will not remain editable. |
| 6 | Edit PDF | Add or replace text in a PDF | `/pdf-editor` | Planned | Specific editing job with stronger task intent than another broad “edit PDF” article. |
| 7 | AI document understanding | Summarize a long PDF and verify the summary | `/pdf-summarizer` | Planned | Transactional AI intent with differentiated value from a verification checklist and explicit accuracy limits. |
| 8 | Fill and sign PDF | Electronic signature versus digital signature | `/pdf-signer` | Planned | Supports signer selection without repeating the existing step-by-step signing guide; requires jurisdiction-sensitive sourcing. |
| 9 | OCR and scanned PDFs | Copy text from a scanned PDF | `/pdf-ocr` | Planned | Specific outcome adjacent to, but separable from, the existing searchable-PDF guide. Publish only if query overlap remains low. |
| 10 | AI document understanding | Ask questions about a PDF and check page citations | `/chat-with-pdf` | Planned | Useful long-tail task tied to a working AI tool and grounded in verification rather than generic AI promotion. |
| 11 | PDF privacy and security | Remove PDF metadata before sharing | `/remove-pdf-metadata` | Planned | Specific privacy task with practical inspection and verification steps; claims must be limited to fields the code actually removes. |
| 12 | Compress PDF | Stop PDF compression from making text blurry | `/pdf-compressor` | Planned | Troubleshooting intent distinct from the existing general size-reduction guide; publish only if Search Console supports the subtopic. |

The opportunity assessment is directional rather than a fabricated traffic forecast. A live search snapshot showed a dominant [Adobe page-reordering tool](https://www.adobe.com/acrobat/online/rearrange-pdf.html) for the broad term, while narrower results also included a [school-district page-extraction handout](https://www.mcsdk12.org/wp-content/uploads/2023/04/Extracting-Pages-in-a-PDF-Using-Adobe.pdf) and [William & Mary image-to-PDF instructions](https://www.wm.edu/as/facultyresources/dept-prog-administration/additional-resources/how_to_combine_pictures_as_pdf_files.pdf). That supports long-tail, task-completion briefs, but ranking difficulty and volume still need validation in Search Console and a trusted keyword dataset before later publication.

## Detailed guide briefs

### 1. How to extract pages from a PDF into a new file

- **Cluster:** Merge and organize PDF
- **Primary keyword:** how to extract pages from a PDF
- **Search intent:** Transactional how-to; create one new PDF from selected pages.
- **Target reader:** A user who needs to share or retain only certain pages without altering the source file.
- **Recommended URL:** `/guides/how-to-extract-pages-from-a-pdf`
- **Unique title:** How to Extract Pages from a PDF into a New File
- **Meta description:** Select one page, non-consecutive pages or a range from a PDF and save them as one new file. Learn the browser workflow, limits and privacy details.
- **H1:** How to Extract Pages from a PDF into a New File
- **Main questions:** What is the difference between extracting, splitting, and deleting pages? How do ranges work? What order will selected pages use? What PDF features may need checking afterward? What are the browser limits? Where does processing happen?
- **Primary tool CTA:** Extract selected pages with the PDF Page Extractor.
- **Primary landing page:** `/extract-pages`
- **Internal links:** `/pdf-page-manager`, `/pdf-splitter`, `/delete-pdf-pages`, `/guides/how-to-merge-pdf-files`.
- **Evidence or sources required:** Current extractor UI and `pdf-lib` page-copy implementation; range parser tests; browser memory/error behavior; `pdf-lib` documentation for `copyPages`; a test corpus covering links, forms, bookmarks, rotated pages, and signed PDFs.
- **Cannibalization risk:** **Low.** Keep the guide focused on copying selected pages into one file. Do not retarget the existing merge guide or make it a general split-PDF article.

### 2. How to reorder PDF pages and save the new sequence

- **Cluster:** Merge and organize PDF
- **Primary keyword:** how to reorder pages in a PDF
- **Search intent:** Transactional how-to; correct page sequence and save a reorganized PDF.
- **Target reader:** Someone repairing a scan, report, submission, or bundle whose pages are out of order.
- **Recommended URL:** `/guides/how-to-reorder-pages-in-a-pdf`
- **Unique title:** How to Reorder PDF Pages and Save the New Sequence
- **Meta description:** Drag PDF page thumbnails into a new order, rotate or delete pages, and save the result. Learn how page order, numbering and local processing work.
- **H1:** How to Reorder PDF Pages and Save the New Sequence
- **Main questions:** What changes when page objects are reordered? Does visible page numbering change? Can pages from multiple PDFs be interleaved? Can pages be rotated or deleted in the same session? What should be checked after saving? Where does processing occur?
- **Primary tool CTA:** Arrange pages with the PDF Page Manager.
- **Primary landing page:** `/pdf-page-manager`
- **Internal links:** `/extract-pages`, `/pdf-merger`, `/rotate-pdf`, `/add-page-numbers`.
- **Evidence or sources required:** Current page-manager controls and Web Worker; `pdf-lib` copy/rotation behavior; visual and structural test PDFs; verification that blank-page insertion is not present; tests for multiple source documents.
- **Cannibalization risk:** **Low to medium.** The existing merge guide should remain about combining complete files. This guide must stay page-level and explain why page order differs from printed numbering.

### 3. How to combine JPG and PNG images into one PDF

- **Cluster:** PDF conversion
- **Primary keyword:** combine JPG and PNG into one PDF
- **Search intent:** Transactional how-to; turn several ordered images into one PDF.
- **Target reader:** A mobile or desktop user assembling scans, receipts, screenshots, notes, or photos for submission or sharing.
- **Recommended URL:** `/guides/how-to-combine-images-into-one-pdf`
- **Unique title:** How to Combine JPG and PNG Images into One PDF
- **Meta description:** Combine JPG, PNG and other supported images into one ordered PDF. Learn how page size, orientation, margins and compression affect the downloaded file.
- **H1:** How to Combine JPG and PNG Images into One PDF
- **Main questions:** Which image formats load? How is page order set? Should the PDF use A4, Letter, Legal, or fit-to-image pages? How do margins and orientation affect layout? What does the compressed quality option do? How are HEIC and animated images handled?
- **Primary tool CTA:** Combine images with the Image to PDF Converter.
- **Primary landing page:** `/image-to-pdf`
- **Internal links:** `/scan-to-pdf`, `/pdf-compressor`, `/pdf-merger`, `/pdf-to-images`.
- **Evidence or sources required:** Current image picker, HEIC conversion path, image-editing controls, PDF embedding Web Worker, exact quality constant, and sample exports for each advertised format and page size. Paper-size dimensions should be checked against ISO 216 and current North American paper-size references.
- **Cannibalization risk:** **Low.** Keep the article about many images becoming one PDF. Leave camera capture to Scan to PDF and reverse conversion to PDF to Images.

### 4. How to password-protect a PDF in your browser

- **Cluster:** PDF privacy and security
- **Primary keyword:** how to password protect a PDF in browser
- **Search intent:** Transactional how-to with security evaluation.
- **Target reader:** A user who needs password-based access control before sending or storing a PDF.
- **Recommended URL:** `/guides/how-to-password-protect-a-pdf-in-your-browser`
- **Unique title:** How to Password-Protect a PDF in Your Browser
- **Meta description:** Add a password to a PDF in your browser, understand what PDF encryption protects, and learn how to share the password separately and verify the result.
- **H1:** How to Password-Protect a PDF in Your Browser
- **Main questions:** What encryption does the tool apply? Does the password restrict opening or editing? Where is the file processed? How should the password be shared? Can a lost password be recovered? How can the result be verified?
- **Primary tool CTA:** Protect a document with PDF Password Lock.
- **Primary landing page:** `/pdf-password-lock`
- **Internal links:** `/pdf-unlock`, `/pdf-redactor`, `/remove-pdf-metadata`, `/privacy`.
- **Evidence or sources required:** Dependency and encryption-setting audit; generated-file inspection with `qpdf --show-encryption`; PDF specification or qpdf documentation; product behavior for password entry and downloads; security review of password handling. Do not imply DRM, identity verification, or guaranteed confidentiality.
- **Cannibalization risk:** **Low.** Keep this about encryption and password workflow, not redaction or metadata removal.

### 5. How to convert PDF to Word and understand formatting changes

- **Cluster:** PDF conversion
- **Primary keyword:** convert PDF to Word without losing formatting
- **Search intent:** Transactional comparison/how-to; get editable Word output and anticipate cleanup.
- **Target reader:** An office, study, or administrative user who needs to edit PDF content in DOCX.
- **Recommended URL:** `/guides/how-to-convert-pdf-to-word-without-losing-formatting`
- **Unique title:** PDF to Word Conversion: What Formatting Can Change?
- **Meta description:** Convert a PDF to Word and learn which layouts, fonts, tables, images and scanned pages may need review before you edit or share the DOCX file.
- **H1:** What Happens to Formatting When You Convert PDF to Word?
- **Main questions:** Why can PDF and Word layouts differ? Which fonts and tables are preserved? What happens to columns and positioned text? Do scans require OCR? What limits and access rules apply? How should the DOCX be reviewed?
- **Primary tool CTA:** Convert a document with PDF to Word.
- **Primary landing page:** `/pdf-to-word`
- **Internal links:** `/pdf-ocr`, `/word-to-pdf`, `/pdf-editor`, `/guides/pdf-vs-word-which-format-to-use`.
- **Evidence or sources required:** Conversion API and configured provider behavior; actual input/size/access limits; a representative test corpus of text, tables, images, forms, scans, and multi-column layouts; DOCX/PDF format documentation. Never promise full editability or layout fidelity.
- **Cannibalization risk:** **Medium.** The existing PDF-versus-Word guide targets format choice. This guide must target conversion fidelity and post-conversion review, not “which format is better.”

### 6. How to add or replace text in a PDF

- **Cluster:** Edit PDF
- **Primary keyword:** how to add text to a PDF
- **Search intent:** Transactional how-to; place new text or correct visible content.
- **Target reader:** A user correcting a name, date, label, or short passage without recreating the document.
- **Recommended URL:** `/guides/how-to-add-text-to-a-pdf`
- **Unique title:** How to Add Text to a PDF and Check the Result
- **Meta description:** Add a text box or correct PDF text in your browser, match the surrounding style, and learn why scanned, outlined and embedded-font text behaves differently.
- **H1:** How to Add Text to a PDF
- **Main questions:** Is the text selectable or part of an image? When should a text box be used? Can an existing text object be changed? Why might fonts differ? Does OCR make a scan editable? What should be checked before download?
- **Primary tool CTA:** Add or edit text with the PDF Editor.
- **Primary landing page:** `/pdf-editor`
- **Internal links:** `/pdf-ocr`, `/pdf-form-builder`, `/pdf-annotate`, `/guides/how-to-edit-a-pdf-without-adobe`.
- **Evidence or sources required:** Current editor text controls and export behavior; embedded-font fallbacks; test PDFs with live text, outlined text, and image-only scans; OCR tool behavior. The article must not promise full reflow or word-processor behavior.
- **Cannibalization risk:** **Medium.** The existing “edit without Adobe” guide is broad. This article must be limited to adding/replacing text and link back to the broad guide rather than restating it.

### 7. How to summarize a long PDF and verify the output

- **Cluster:** AI document understanding
- **Primary keyword:** how to summarize a long PDF with AI
- **Search intent:** Transactional informational; obtain a summary while managing accuracy risk.
- **Target reader:** A student, researcher, or professional triaging a long document before close reading.
- **Recommended URL:** `/guides/how-to-summarize-a-long-pdf-with-ai`
- **Unique title:** How to Summarize a Long PDF with AI—and Check the Result
- **Meta description:** Summarize a long PDF with AI, choose useful output detail, and verify names, numbers, conclusions and omissions against the source before relying on it.
- **H1:** How to Summarize a Long PDF with AI and Verify It
- **Main questions:** What content is sent for AI processing? What account and daily-use rules apply? How are long documents chunked or limited? Can a summary omit caveats? Which facts require source checks? When should AI output not be relied on?
- **Primary tool CTA:** Create a draft summary with PDF Summarizer.
- **Primary landing page:** `/pdf-summarizer`
- **Internal links:** `/chat-with-pdf`, `/pdf-ocr`, `/mind-map`, `/privacy`.
- **Evidence or sources required:** Summarizer page and API route; active AI provider documentation; exact account, allowance, size, and content limits; test set with tables, scans, long reports, and adversarial instructions; visible privacy policy. Include an explicit AI accuracy disclaimer.
- **Cannibalization risk:** **Low.** Keep the intent on whole-document summarization and verification. Do not turn it into a general chat-with-PDF article.

### 8. Electronic signatures versus digital signatures

- **Cluster:** Fill and sign PDF
- **Primary keyword:** electronic signature vs digital signature PDF
- **Search intent:** Commercial investigation; choose an appropriate signing method.
- **Target reader:** Someone deciding whether a visible signature image is sufficient or a certificate-backed workflow is required.
- **Recommended URL:** `/guides/electronic-signature-vs-digital-signature-pdf`
- **Unique title:** Electronic Signature vs Digital Signature on a PDF
- **Meta description:** Learn how a visual electronic signature differs from a certificate-backed digital signature, what EditPDF AI adds, and when to confirm recipient requirements.
- **H1:** Electronic Signature vs Digital Signature: What Does a PDF Need?
- **Main questions:** What does the EditPDF AI signer place on a PDF? Does it verify identity? What is a certificate-backed digital signature? Does modifying a signed PDF affect validation? Which documents need witnesses or a specific platform? How should recipient requirements be checked?
- **Primary tool CTA:** Place a visual signature with PDF E-Signer.
- **Primary landing page:** `/pdf-signer`
- **Internal links:** `/guides/how-to-sign-a-pdf-online`, `/ai-pdf-form-filler`, `/pdf-flatten`, `/terms`.
- **Evidence or sources required:** Current signer implementation; applicable primary law such as the US ESIGN Act and EU eIDAS only where the article explicitly discusses those jurisdictions; PDF digital-signature specification; qualified legal review before making acceptance claims. State clearly that the tool does not create a certificate-backed signature if that remains true.
- **Cannibalization risk:** **Medium.** The existing signing guide handles the steps. This guide must remain a decision/comparison resource and avoid targeting “how to sign a PDF online.”

### 9. How to copy text from a scanned PDF

- **Cluster:** OCR and scanned PDFs
- **Primary keyword:** copy text from scanned PDF
- **Search intent:** Transactional how-to; recognize image text for selection or reuse.
- **Target reader:** A user with a scan whose text cannot currently be selected, searched, or copied.
- **Recommended URL:** `/guides/how-to-copy-text-from-a-scanned-pdf`
- **Unique title:** How to Copy Text from a Scanned PDF with OCR
- **Meta description:** Use OCR to recognize text in a scanned PDF, then copy or search it. Learn which pages work best and why every name, number and table needs review.
- **H1:** How to Copy Text from a Scanned PDF
- **Main questions:** How can you tell a PDF is image-only? What does OCR produce? Which languages and limits are implemented? Why do skew, handwriting, and tables cause errors? What data is sent for OCR? How should recognized text be verified?
- **Primary tool CTA:** Recognize scanned text with PDF OCR.
- **Primary landing page:** `/pdf-ocr`
- **Internal links:** `/guides/how-to-make-a-scanned-pdf-searchable`, `/scan-to-pdf`, `/pdf-to-word`, `/pdf-summarizer`.
- **Evidence or sources required:** OCR page and API route; configured OCR/AI provider documentation; exact supported languages and size/page limits; test scans covering rotation, low contrast, handwriting, and tables; privacy data-flow audit. Never claim perfect or fixed OCR accuracy.
- **Cannibalization risk:** **Medium to high.** The existing OCR guide targets making a PDF searchable. Publish this only if Search Console shows a separable copy/extract-text intent; otherwise expand the existing guide instead.

### 10. How to ask questions about a PDF and check page citations

- **Cluster:** AI document understanding
- **Primary keyword:** ask questions about a PDF with citations
- **Search intent:** Transactional informational; query a document and trace answers back to source pages.
- **Target reader:** A user reviewing a report, policy, study, or contract who needs targeted answers rather than a full summary.
- **Recommended URL:** `/guides/how-to-ask-questions-about-a-pdf-with-citations`
- **Unique title:** How to Ask Questions About a PDF and Check the Answers
- **Meta description:** Ask focused questions about a PDF, use page references to inspect the source, and verify quotations, numbers and conclusions before relying on an AI answer.
- **H1:** How to Ask Questions About a PDF and Verify the Answer
- **Main questions:** What document content is sent to the AI service? How should a useful question be phrased? Are page references generated and how accurate are they? Can tables and scans be understood? What are the usage limits? Which answers require manual checking?
- **Primary tool CTA:** Query a document with Chat with PDF.
- **Primary landing page:** `/chat-with-pdf`
- **Internal links:** `/pdf-summarizer`, `/pdf-ocr`, `/pdf-viewer`, `/privacy`.
- **Evidence or sources required:** Chat UI and API route; page-reference implementation; active AI provider documentation; exact access and file limits; evaluation set with answerable, unanswerable, table, and scanned-document questions. Include the same visible AI warning used by the product.
- **Cannibalization risk:** **Low to medium.** Keep the article about question answering and source verification, not general summarization.

### 11. How to remove PDF metadata before sharing

- **Cluster:** PDF privacy and security
- **Primary keyword:** remove metadata from PDF before sharing
- **Search intent:** Transactional privacy how-to.
- **Target reader:** A user preparing a PDF for external sharing who wants to remove supported document-information fields.
- **Recommended URL:** `/guides/how-to-remove-pdf-metadata-before-sharing`
- **Unique title:** How to Remove PDF Metadata Before Sharing a File
- **Meta description:** Inspect and remove supported PDF metadata fields before sharing, verify the cleaned copy, and understand what metadata removal does not redact from page content.
- **H1:** How to Remove Metadata from a PDF Before Sharing
- **Main questions:** Which metadata fields does the tool inspect and remove? Does it remove comments, attachments, hidden layers, or visible content? Where is processing performed? How can the result be inspected? Is metadata removal the same as redaction? What other sharing checks are needed?
- **Primary tool CTA:** Clean supported fields with Remove PDF Metadata.
- **Primary landing page:** `/remove-pdf-metadata`
- **Internal links:** `/pdf-redactor`, `/guides/how-to-redact-sensitive-information-from-a-pdf`, `/pdf-flatten`, `/pdf-password-lock`.
- **Evidence or sources required:** Field-by-field implementation audit; before/after inspection using ExifTool and `pdfinfo`; PDF document-information/XMP documentation; a representative file set. Never claim that all hidden information or all metadata is removed unless verified.
- **Cannibalization risk:** **Low.** Maintain the boundary between metadata cleanup, visible-content redaction, flattening, and password protection.

### 12. Why PDF compression can make text blurry

- **Cluster:** Compress PDF
- **Primary keyword:** PDF compression makes text blurry
- **Search intent:** Troubleshooting with transactional follow-through.
- **Target reader:** Someone whose compressed PDF is hard to read or whose file did not shrink as expected.
- **Recommended URL:** `/guides/why-pdf-compression-makes-text-blurry`
- **Unique title:** Why PDF Compression Makes Text Blurry—and What to Change
- **Meta description:** Learn why raster-based PDF compression can soften text, compare the available resolution and quality settings, and check whether the smaller file is usable.
- **H1:** Why Does PDF Compression Make Text Blurry?
- **Main questions:** Does the compressor rasterize complete pages? Which DPI and JPEG settings are used? Why does searchable text become image content? Which documents are poor candidates? What should be inspected after compression? When should the original be kept?
- **Primary tool CTA:** Compare settings with PDF Compressor.
- **Primary landing page:** `/pdf-compressor`
- **Internal links:** `/guides/how-to-reduce-pdf-file-size`, `/pdf-ocr`, `/pdf-to-images`, `/pdf-repair`.
- **Evidence or sources required:** Exact compressor rendering and JPEG constants; before/after tests for text, scans, line art, photos, forms, and links; PDF.js/canvas behavior; output searchability test. Do not promise a percentage reduction.
- **Cannibalization risk:** **Medium to high.** The existing compression guide already covers general size reduction. Publish this only as a focused rasterization/legibility troubleshooting resource, or merge it into the existing guide if query overlap is high.

## Cluster map and boundaries

| Cluster | Primary landing pages represented | Guide boundary |
|---|---|---|
| Edit PDF | `/pdf-editor` | Specific text editing; broad editing remains with the existing guide. |
| Fill and sign PDF | `/pdf-signer` | Signature-method choice; signing steps remain with the existing guide. |
| Compress PDF | `/pdf-compressor` | Blurry-text troubleshooting; general compression remains with the existing guide. |
| Merge and organize PDF | `/extract-pages`, `/pdf-page-manager` | Page selection and page order; complete-file merging remains with the existing guide. |
| PDF conversion | `/image-to-pdf`, `/pdf-to-word` | One guide per direction and output need. |
| OCR and scanned PDFs | `/pdf-ocr` | Copying recognized text; searchable output remains with the existing guide. |
| AI document understanding | `/pdf-summarizer`, `/chat-with-pdf` | Whole-document summary versus targeted questions with source checks. |
| PDF privacy and security | `/pdf-password-lock`, `/remove-pdf-metadata` | Encryption versus metadata cleanup; neither is presented as redaction. |

## Release and measurement plan

1. Publish the first three implemented guides and request indexing only after production rendering, canonicals, schema, sitemap inclusion, and tool CTAs are verified.
2. In Search Console, monitor indexed status, impressions, queries, click-through rate, and whether a guide and its primary tool alternate for the same query. Treat this as diagnostic data, not proof that a page needs more keywords.
3. After sufficient impressions accumulate, improve the existing page that best satisfies each query. Do not publish a planned guide when an existing guide already captures the same intent.
4. Before writing priorities 4–12, repeat the product-evidence check and a live SERP review. For legal, privacy, encryption, OCR, and AI topics, require the listed primary documentation and implementation tests.
5. Consolidate or redirect any guide that does not maintain a distinct intent. Prefer one strong resource over a cluster of near-duplicates.

## Implementation notes for the first release

The first three guides are registered in `src/lib/guidesData.ts`, rendered through the existing dynamic guide route, and linked from their primary tool pages through the shared `TOOL_GUIDES` map. They intentionally have no author, published date, or last-reviewed date because no verified editorial records were supplied. Their metadata, canonical URLs, Article/WebPage/Breadcrumb structured data, and sitemap inclusion use the existing centralized SEO system.
