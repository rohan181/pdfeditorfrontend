import type { ToolSEOStep, ToolSEOFAQ, ToolSEOUser, ToolSEOFormats } from '@/components/ToolSEOSection'
import { AI_ACCESS_SUMMARY, AI_ACCURACY_DISCLAIMER, FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'

interface ToolSEOData {
  steps:    ToolSEOStep[]
  faqs:     ToolSEOFAQ[]
  whatIs:   string[]
  users:    ToolSEOUser[]
  related:  { slug: string; label: string }[]
  formats:  ToolSEOFormats
  privacy:  string
  toolSlug?: string
}

const data: Record<string, ToolSEOData> = {

  'chat-with-pdf': {
    toolSlug: 'chat-with-pdf',
    whatIs: [
      'What is Chat with PDF?',
      'Chat with PDF is an AI document question-and-answer tool. It reads the searchable text in a PDF, finds the pages most relevant to your question, and writes a grounded response with page references and short supporting quotes.',
      'EditPDF AI extracts page text locally in your browser. For each question, only the relevant text excerpts, your question, and recent chat context are sent to the AI service. Returned citation quotes are checked against the extracted source page before they are shown.',
    ],
    users: [
      { who: 'Students and researchers', why: 'Ask focused questions about papers, readings, reports, and source documents while keeping a clear path back to the cited page.' },
      { who: 'Legal and compliance teams', why: 'Find clauses, dates, obligations, exceptions, and risks in searchable contracts and policy documents.' },
      { who: 'Business teams', why: 'Review proposals, reports, manuals, and project documents without repeatedly scanning every page.' },
      { who: 'Analysts and consultants', why: 'Extract precise facts, figures, assumptions, and recommendations from long PDF documents with supporting evidence.' },
    ],
    related: [
      { slug: 'pdf-summarizer', label: 'Generate a complete PDF summary' },
      { slug: 'pdf-ocr', label: 'Make a scanned PDF searchable first' },
      { slug: 'pdf-compare', label: 'Compare two document versions' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
    ],
    formats: { input: ['PDF'], output: ['On-page answer'], limit: 'Up to 50 MB and 1,000 pages' },
    privacy: 'Your PDF is parsed locally. The chat route receives relevant page text, your question, and recent chat context; it does not receive the original PDF file.',
    steps: [
      { title: 'Choose a searchable PDF', body: 'Select a PDF up to 50 MB and 1,000 pages. Text is extracted page by page inside your browser.' },
      { title: 'Ask a document question', body: 'Ask about the main points, a specific clause, names, figures, dates, obligations, risks, or anything else present in the document.' },
      { title: 'Check the cited evidence', body: 'Read the answer, then open its page citation cards to inspect the exact source quotes used as evidence.' },
    ],
    faqs: [
      { q: 'Does Chat with PDF cite its answers?', a: 'Yes. Answers can include page cards with exact supporting quotes. Each returned quote is checked against the extracted text from that page before the citation is displayed.' },
      { q: 'Is my entire PDF uploaded to the AI?', a: 'No. The PDF file is parsed locally. Only selected relevant page text, your question, and a limited amount of recent chat history are sent to the AI service for an answer.' },
      { q: 'Can I chat with a scanned PDF?', a: 'A scan usually contains page images rather than searchable text. Run PDF OCR first to create searchable text, then open the OCR result in Chat with PDF.' },
      { q: 'Can I use a password-protected PDF?', a: 'The browser cannot extract text from a locked PDF without authorization. Use Unlock PDF with the correct password, then chat with the unlocked copy.' },
      { q: 'How many questions can I ask?', a: AI_ACCESS_SUMMARY },
      { q: 'Should I rely on an AI answer without checking it?', a: 'No. AI can misunderstand context. Use the verified quote cards to check important legal, medical, financial, academic, or business information against the original PDF.' },
    ],
  },

  'pdf-splitter': {
    toolSlug: 'pdf-splitter',
    whatIs: [
      'What is a PDF splitter?',
      'A PDF splitter is a tool that divides one PDF file into multiple separate PDF files. Instead of sharing or printing an entire 50-page report when a colleague only needs pages 12–18, you split out exactly the pages you need and send those alone.',
      'Splitting can help when a source document mixes material for different recipients. Extract only the intended pages, inspect the new file, and share that copy. EditPDF AI performs the split locally in your browser without an application document-processing request.',
    ],
    users: [
      { who: 'Students & researchers', why: 'Extract a specific chapter from a textbook PDF or separate each assignment into its own file for submission.' },
      { who: 'Finance & accounting teams', why: 'Split a monthly statement PDF into individual invoice files, one per client or transaction.' },
      { who: 'Legal professionals', why: 'Separate exhibits, annexes, and schedules from a contract into individual files for filing or reference.' },
      { who: 'Remote teams', why: 'Split a large project brief so each team member receives only the pages relevant to their section.' },
    ],
    related: [
      { slug: 'pdf-merger', label: 'Merge split PDFs back into one' },
      { slug: 'extract-pages', label: 'Extract specific pages from a PDF' },
      { slug: 'delete-pages', label: 'Delete unwanted pages from a PDF' },
      { slug: 'pdf-page-manager', label: 'Reorder and organise PDF pages' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on file size, page count, browser memory, and device performance' },
    privacy: 'Processed locally in your browser using pdf-lib without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Drag and drop a PDF onto the page or click to browse. Splitting runs locally without an application document-processing request.' },
      { title: 'Choose split mode', body: 'Split by every page, set custom page ranges (e.g. 1-3, 5, 7-10), or extract only the pages you need.' },
      { title: 'Download the results', body: 'Each split section downloads as a separate PDF. Grab them one by one or download all at once as a ZIP.' },
    ],
    faqs: [
      { q: 'Can I split a PDF into individual pages?', a: 'Yes. Choose "Every page" mode and each page is saved as its own PDF file. You can then download them all at once.' },
      { q: 'Is there a file size limit for splitting PDFs?', a: 'The interface does not impose a fixed application file limit. Practical capacity depends on the PDF size and page count, available browser memory, and device performance.' },
      { q: 'Can I extract a specific page range?', a: 'Absolutely. Enter ranges like "1-5, 8, 11-15" and the splitter creates one PDF for each range you define.' },
      { q: 'Does splitting reduce PDF quality?', a: 'No. The pages are extracted at their original resolution with no re-encoding, so text, images, and vector graphics stay identical to the source.' },
      { q: 'Is my PDF sent through a document-processing route?', a: 'No. The splitter uses pdf-lib locally in your browser without an application document-processing request.' },
    ],
  },

  'pdf-merger': {
    toolSlug: 'pdf-merger',
    whatIs: [
      'What is a PDF merger?',
      'A PDF merger combines two or more PDF files into one PDF, preserving the order in which the source files were arranged. This tool reorders whole files before merging; use the PDF Page Manager for page-level changes.',
      'EditPDF AI reads and combines the selected files locally in a Web Worker. Practical capacity depends on file size, page count, available browser memory, and device performance.',
    ],
    users: [
      { who: 'Project managers', why: 'Combine weekly status reports, meeting notes, and deliverables into a single project-update PDF for stakeholders.' },
      { who: 'Legal & compliance teams', why: 'Merge contracts, amendments, exhibits, and cover letters into one filing-ready document.' },
      { who: 'Finance & accounting', why: 'Consolidate invoices, receipts, and bank statements into a single PDF for expense reporting or audit packages.' },
      { who: 'Students & academics', why: 'Join multiple research chapters, appendices, and cover pages into one submission-ready thesis PDF.' },
    ],
    related: [
      { slug: 'pdf-splitter', label: 'Split a PDF into separate files' },
      { slug: 'pdf-compressor', label: 'Compress your merged PDF' },
      { slug: 'pdf-page-manager', label: 'Reorder pages before merging' },
      { slug: 'extract-pages', label: 'Extract pages to merge selectively' },
      { slug: 'scan-to-pdf', label: 'Scan paper documents to add to the merge' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Practical capacity depends on file size, page count, browser memory, and device performance' },
    privacy: 'Merging runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Add your PDFs', body: 'Choose two or more PDF files by dragging them onto the page or using the file picker.' },
      { title: 'Arrange the file order', body: 'Drag the file rows or use the arrow controls to set the whole-file order before merging.' },
      { title: 'Merge and download', body: 'Start the merge, wait for local processing to finish, and download the resulting PDF.' },
    ],
    faqs: [
      { q: 'How many PDFs can I merge at once?', a: 'The tool does not set a file-count entitlement, but practical capacity depends on file sizes, page counts, browser memory, and device performance.' },
      { q: 'Can I rearrange individual pages while merging PDFs?', a: 'This page reorders whole PDF files before merging them. Use PDF Page Manager when you need to move, rotate, or delete individual pages across the result.' },
      { q: 'Does merging re-compress the PDF pages?', a: 'The merge worker copies source pages with pdf-lib instead of rendering them as images. Inspect bookmarks, forms, links, and other interactive features in the downloaded PDF because complex document structures can vary.' },
      { q: 'Is there a file-size limit for merging PDFs?', a: 'The interface does not enforce a fixed file-size cap. Practical capacity depends on total file size, page count, browser memory, and device performance.' },
      { q: 'Are PDFs uploaded when I merge them?', a: 'No application document-processing request is used. The selected PDF files are read and merged locally in a browser Web Worker.' },
      { q: 'Can I merge PDFs on a phone or tablet?', a: 'The page is available in modern mobile browsers, but large or numerous PDFs can exceed the memory available on a phone or tablet. Use smaller batches if local processing fails.' },
    ],
  },

  'pdf-compressor': {
    toolSlug: 'pdf-compressor',
    whatIs: [
      'What is a PDF compressor?',
      'This PDF compressor reduces file size by rendering each complete page at the selected resolution, encoding it as JPEG, and rebuilding the document. Stronger settings reduce visual detail more aggressively.',
      'PDF compression is useful when a destination imposes a file-size limit. EditPDF AI\'s compressor renders and re-encodes each page locally in your browser without an application document-processing request.',
    ],
    users: [
      { who: 'Office & admin professionals', why: 'Compress scanned contracts, reports, and brochures so they fit inside email attachment limits before sending.' },
      { who: 'Web & marketing teams', why: 'Reduce downloadable PDF file sizes to improve page load times and keep hosting costs low.' },
      { who: 'Students & academics', why: 'Shrink large assignment PDFs that exceed submission portals\' file-size caps.' },
      { who: 'Document administrators', why: 'Create smaller sharing copies while retaining the original source document separately.' },
    ],
    related: [
      { slug: 'pdf-merger', label: 'Merge PDFs then compress' },
      { slug: 'pdf-to-images', label: 'Convert PDF pages to images' },
      { slug: 'image-to-pdf', label: 'Convert images to a PDF' },
      { slug: 'pdf-editor', label: 'Edit your PDF before compressing' },
      { slug: 'scan-to-pdf', label: 'Scan a document, then compress the result' },
      { slug: 'pdf-repair', label: 'Repair a damaged PDF first' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Practical capacity depends on page count, rendered image size, browser memory, and device performance' },
    privacy: 'Compression runs locally in your browser using a Web Worker; pages are re-rendered and re-encoded without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Drag your PDF onto the page or click to select it for local browser processing.' },
      { title: 'Select compression level', body: 'Choose from Low, Medium, High, or Maximum. Higher compression reduces resolution and JPEG quality more aggressively.' },
      { title: 'Download the compressed file', body: 'Click Compress. Your browser re-encodes each page and the reduced PDF downloads in seconds.' },
    ],
    faqs: [
      { q: 'How does this PDF compressor reduce file size?', a: 'It renders each complete page at the selected resolution, encodes the page as JPEG, and rebuilds the PDF. This is lossy compression, and stronger settings remove more visual detail.' },
      { q: 'Will the compressed PDF always be smaller?', a: 'No. An already optimized or mostly vector PDF may not become smaller. When the rebuilt file is larger, the current implementation downloads the original PDF bytes instead.' },
      { q: 'Will text stay searchable after compression?', a: 'No. Complete pages are converted to JPEG images, so text in the rebuilt PDF is no longer selectable or searchable. Run PDF OCR afterward if a searchable text layer is required.' },
      { q: 'Which compression level should I choose?', a: 'Low retains the most image detail. Medium balances quality and size. High and Maximum use progressively lower resolution and JPEG quality, so inspect the result before sharing it.' },
      { q: 'Is my PDF uploaded for compression?', a: 'No application document-processing request is used. Compression runs locally in your browser using canvas, PDF.js, pdf-lib, and a Web Worker.' },
      { q: 'What is the PDF compression file-size limit?', a: 'The file handler does not enforce a fixed cap. Practical capacity depends on page count, rendered image dimensions, available browser memory, and device performance.' },
    ],
  },

  'pdf-signer': {
    toolSlug: 'pdf-signer',
    whatIs: [
      'What is an online PDF signer?',
      'An online PDF signer places a drawn, typed, or uploaded visual signature onto a PDF page and exports a new PDF without requiring printing or rescanning.',
      'Whether that signature method is accepted depends on the document, recipient, jurisdiction, identity-verification requirements, and applicable law. Check the requirements for your use case before relying on the signed copy.',
    ],
    users: [
      { who: 'Freelancers & contractors', why: 'Sign client contracts, NDAs, and service agreements the moment they arrive — no printer needed.' },
      { who: 'Small business owners', why: 'Execute supplier agreements, lease documents, and purchase orders without scheduling an in-person signing.' },
      { who: 'HR & recruitment teams', why: 'Sign offer letters, onboarding paperwork, and policy acknowledgements and return them the same day.' },
      { who: 'Real estate professionals', why: 'Place a visual signature on supported agreements, listings, or disclosure forms without printing and rescanning.' },
    ],
    related: [
      { slug: 'pdf-editor', label: 'Edit PDF text before signing' },
      { slug: 'pdf-form-builder', label: 'Build a signable PDF form' },
      { slug: 'ai-pdf-form-filler', label: 'Auto-fill a PDF form with AI' },
      { slug: 'pdf-annotate', label: 'Annotate a PDF with comments' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Signing uses local browser processing without an application document-processing request for the PDF or signature image.',
    steps: [
      { title: 'Choose your PDF', body: 'Select the PDF you need to sign. The document is loaded locally in the browser without an account.' },
      { title: 'Create a visual signature', body: 'Draw with a mouse or finger, type using a supported script font, or upload a PNG or JPEG signature image.' },
      { title: 'Place and download', body: 'Position, resize, or rotate the signature, then export a PDF with the visual signature embedded.' },
    ],
    faqs: [
      { q: 'Does this tool create a certificate-based digital signature?', a: 'No. It places a visual signature image in the PDF. It does not verify identity, issue a certificate, or create a cryptographic digital signature.' },
      { q: 'Is a visual PDF signature legally binding?', a: 'Acceptance depends on the document, recipient, jurisdiction, identity-verification requirements, and applicable law. Check the requirements for your specific use case before relying on the signed copy.' },
      { q: 'Can I use the PDF signer without an account?', a: 'Yes. Creating, placing, and exporting a visual signature is a free core browser workflow and does not require sign-in.' },
      { q: 'What signature image formats can I upload?', a: 'The signature image picker accepts image files, and the visible workflow identifies PNG and JPEG as supported formats. You can also draw a signature or type one with a supported script font.' },
      { q: 'Does the PDF signer work on mobile?', a: 'The signer has a responsive mobile layout and supports touch input for drawing and placement. Practical performance depends on PDF size, page count, and available device memory.' },
      { q: 'Is my PDF sent to a server for signing?', a: 'No application document-processing request is used. The PDF and visual signature are processed locally in your browser.' },
    ],
  },

  'pdf-watermark': {
    toolSlug: 'pdf-watermark',
    whatIs: [
      'What is a PDF watermark tool?',
      'A PDF watermark tool stamps a visible mark — text such as "CONFIDENTIAL" or "DRAFT", or an image such as a company logo — across every page of a PDF. The watermark is embedded directly into the page content, making it visible to all readers and deterring unauthorised distribution or copying.',
      'Watermarks serve two main purposes: branding and document control. Branded proposals sent to clients carry your logo on every page. Internal drafts marked "DRAFT" or "NOT FOR DISTRIBUTION" signal their status clearly. EditPDF AI applies watermarks entirely in your browser, so the document never needs to be uploaded.',
    ],
    users: [
      { who: 'Creative & design professionals', why: 'Add a logo or "SAMPLE" watermark to proof copies of artwork, photography, or design work shared with clients before final payment.' },
      { who: 'Legal & compliance teams', why: 'Mark documents as "CONFIDENTIAL", "PRIVILEGED", or "DRAFT" before circulating them internally or to external parties.' },
      { who: 'Publishing & content teams', why: 'Watermark advance reader copies of books, reports, or white papers before distributing to reviewers.' },
      { who: 'Businesses & agencies', why: 'Brand every page of a proposal or report with a company logo so recipients always know the document\'s origin.' },
    ],
    related: [
      { slug: 'pdf-password-lock', label: 'Password-protect your PDF' },
      { slug: 'pdf-redactor', label: 'Cover selected PDF areas with opaque boxes' },
      { slug: 'pdf-editor', label: 'Edit the PDF before watermarking' },
      { slug: 'pdf-annotate', label: 'Add stamps and annotations' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Watermarking runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your PDF', body: 'Drop your PDF onto the page or click to select it. All processing happens in your browser.' },
      { title: 'Configure the watermark', body: 'Type your watermark text, choose the font size, colour, opacity, and rotation. Or upload an image watermark (logo, stamp).' },
      { title: 'Apply and download', body: 'Click Add Watermark. The watermark is applied to every page and the PDF downloads instantly.' },
    ],
    faqs: [
      { q: 'Can I add a watermark to every page at once?', a: 'Yes. The watermark is applied to all pages simultaneously. There is no need to repeat it per page.' },
      { q: 'Can I use my company logo as a watermark?', a: 'Yes. Upload a PNG or JPG image and it will be used as the watermark instead of text. Transparent PNG files work best.' },
      { q: 'Is the watermark permanent?', a: 'The downloaded copy embeds the watermark in PDF page content. PDF editing software may still be able to alter it, so a watermark should not be treated as access control or secure redaction.' },
      { q: 'Can I control the opacity?', a: 'Yes. The opacity slider lets you set the watermark from fully transparent to fully opaque, so it can be subtle or prominent.' },
      { q: 'Will the watermark affect text in the PDF?', a: 'No. The watermark is added as a new layer. The original text and images remain selectable and searchable.' },
    ],
  },

  'pdf-password-lock': {
    toolSlug: 'pdf-password-lock',
    whatIs: [
      'What is a PDF password lock?',
      'A PDF password lock applies standard PDF encryption so compatible readers request the open password before displaying the document. EditPDF AI configures QPDF to use AES-256 encryption.',
      'You can also set PDF permission flags for printing, copying, or editing. Reader applications may choose how to enforce those flags. Encryption runs locally through QPDF compiled to WebAssembly.',
    ],
    users: [
      { who: 'HR & payroll teams', why: 'Password-protect payslips, salary letters, and personal employee records before emailing them to individuals.' },
      { who: 'Legal & financial professionals', why: 'Lock contracts, settlement documents, and financial reports so only the intended recipient can access the content.' },
      { who: 'Educators', why: 'Protect exam papers and answer sheets with a password that is shared only after the assessment window closes.' },
      { who: 'Individuals', why: 'Secure personal documents — tax returns, ID scans, medical records — stored in cloud services or shared via messaging apps.' },
    ],
    related: [
      { slug: 'pdf-unlock', label: 'Remove a known PDF password' },
      { slug: 'pdf-watermark', label: 'Add a watermark to your PDF' },
      { slug: 'pdf-redactor', label: 'Redact text before locking' },
      { slug: 'pdf-signer', label: 'Digitally sign your PDF' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Practical capacity depends on file size, browser memory, and device performance' },
    privacy: 'Encryption runs locally through QPDF compiled to WebAssembly without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Select the PDF you want to protect. It is read locally in your browser.' },
      { title: 'Set a password', body: 'Enter an open password (required to view) and optionally a permissions password (controls printing and editing rights).' },
      { title: 'Download the protected file', body: 'Click Protect PDF. Encryption runs locally in your browser and downloads a protected file for compatible PDF readers.' },
    ],
    faqs: [
      { q: 'What encryption does the PDF password use?', a: 'The tool configures QPDF to create an AES-256 encrypted PDF.' },
      { q: 'Can I set different passwords for viewing and editing?', a: 'Yes. The "open" password is required to open the file. The "permissions" password controls whether the viewer can print or copy text, even after opening.' },
      { q: 'Can I remove the password from a PDF I own?', a: 'If you know the password, yes — open the protected PDF in our tool and use the Remove Password option.' },
      { q: 'Does password protection prevent copying text?', a: 'The tool can set a PDF permission flag that requests copying restrictions. Reader applications may differ in how they enforce permissions.' },
      { q: 'Is my PDF sent to a server?', a: 'Encryption runs locally through WebAssembly. The tool does not send the selected file or password through an application document-processing route.' },
    ],
  },

  'pdf-unlock': {
    toolSlug: 'pdf-unlock',
    whatIs: [
      'What does unlocking a PDF do?',
      'Unlocking a PDF removes its standard password encryption and permission restrictions, producing a copy that can be opened without entering the password. You must provide the correct user or owner password when the document requires one.',
      'EditPDF AI runs QPDF through WebAssembly inside your browser. The document and password never leave your device, and pages are not converted to images, so text, links, forms, fonts, and image quality are preserved.',
    ],
    users: [
      { who: 'Document owners', why: 'Remove a password from a personal document so it can be opened more conveniently on trusted devices.' },
      { who: 'Finance and administration teams', why: 'Unlock authorized statements, reports, or records before combining them into internal workflows.' },
      { who: 'Legal professionals', why: 'Create an authorized working copy of a protected document for annotation, review, or filing.' },
      { who: 'Students and researchers', why: 'Remove known protection from course material they are authorized to use for quoting, notes, or accessibility tools.' },
    ],
    related: [
      { slug: 'pdf-password-lock', label: 'Protect a PDF with a new password' },
      { slug: 'pdf-editor', label: 'Edit the unlocked PDF' },
      { slug: 'pdf-merger', label: 'Merge the unlocked PDF' },
      { slug: 'pdf-compressor', label: 'Compress the unlocked PDF' },
      { slug: 'pdf-repair', label: 'Repair a corrupted PDF' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 100 MB' },
    privacy: 'QPDF runs through WebAssembly in a browser worker without sending the PDF bytes or password through an application document-processing route.',
    steps: [
      { title: 'Choose your protected PDF', body: 'Select a password-protected PDF up to 100 MB. The file is read locally.' },
      { title: 'Enter the current password', body: 'Provide the user or owner password that already opens the document, then confirm you are authorized to modify it.' },
      { title: 'Download the unlocked copy', body: 'QPDF removes standard encryption in your browser and downloads a quality-preserving copy that no longer asks for the password.' },
    ],
    faqs: [
      { q: 'Can this tool recover a forgotten PDF password?', a: 'No. It does not guess, recover, or brute-force passwords. For a password-protected file, you must supply the correct user or owner password.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. QPDF runs through WebAssembly in a browser worker. Your PDF bytes and password stay on your device.' },
      { q: 'Can it remove printing or copying restrictions?', a: 'Yes, when the PDF opens without a password or when you provide an authorized user or owner password. The downloaded copy has standard PDF encryption and permission restrictions removed.' },
      { q: 'Will unlocking reduce the quality of my PDF?', a: 'No. The PDF structure is rewritten without rasterizing its pages, so embedded text, vector graphics, and images retain their original quality.' },
      { q: 'Does it work with every protected PDF?', a: 'It supports standard password-based PDF encryption handled by QPDF. Certificate-encrypted files, enterprise rights-management systems, and third-party DRM are not supported.' },
    ],
  },

  'pdf-repair': {
    toolSlug: 'pdf-repair',
    whatIs: [
      'What does repairing a PDF do?',
      'Repairing a PDF rebuilds recoverable structural information such as damaged cross-reference data, inconsistent object references, and malformed page-tree entries. It creates a new copy without changing the original file.',
      'EditPDF AI runs a structural preflight and QPDF through WebAssembly inside your browser. It attempts safe automatic recovery and rewrites the readable document structure, while preserving recoverable text, links, images, fonts, forms, and vector content.',
    ],
    users: [
      { who: 'Office and administration teams', why: 'Recover reports or forms that stopped opening after an incomplete download, transfer, or storage problem.' },
      { who: 'Students and researchers', why: 'Repair readable course material or papers that produce cross-reference or damaged-file errors in a PDF viewer.' },
      { who: 'Design and production teams', why: 'Rewrite malformed exports from older software before archiving, sharing, or sending them to print.' },
      { who: 'Document owners', why: 'Create a clean working copy of a recoverable personal PDF while keeping the damaged original unchanged.' },
    ],
    related: [
      { slug: 'pdf-unlock', label: 'Unlock a password-protected PDF first' },
      { slug: 'pdf-viewer', label: 'Check the repaired PDF' },
      { slug: 'pdf-compressor', label: 'Compress the repaired copy' },
      { slug: 'pdf-editor', label: 'Edit the repaired PDF' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 100 MB' },
    privacy: 'The repair engine runs locally through WebAssembly in a browser worker without an application document-processing request.',
    steps: [
      { title: 'Choose the damaged PDF', body: 'Select a PDF up to 100 MB. The original file is read locally and the downloaded repair is a separate copy.' },
      { title: 'Rebuild recoverable structure', body: 'The tool corrects common cross-reference pointer errors, then QPDF rewrites readable object data into a clean PDF copy.' },
      { title: 'Download and review', body: 'Download the repaired file, open it in a PDF viewer, and confirm that every expected page and element is present.' },
    ],
    faqs: [
      { q: 'Can every corrupted PDF be repaired?', a: 'No. Automatic repair can rebuild recoverable structure, but it cannot recreate content that is missing, overwritten, or irreversibly corrupted.' },
      { q: 'Is my damaged PDF uploaded to a server?', a: 'No. The repair engine runs through WebAssembly in a browser worker, so the PDF bytes stay on your device.' },
      { q: 'Will repairing reduce the quality of my PDF?', a: 'Pages are not converted to images. Recoverable text, vector graphics, fonts, images, links, and forms are copied into a rewritten PDF structure without intentional quality reduction.' },
      { q: 'Can it repair a password-protected PDF?', a: 'Not without the valid password. Use Unlock PDF with the known password first, then repair the resulting unlocked copy.' },
      { q: 'What kinds of damage can it recover?', a: 'It may recover missing or invalid startxref pointers, some malformed cross-reference structures, and similar structural issues that can be rewritten safely.' },
    ],
  },

  'pdf-flatten': {
    toolSlug: 'pdf-flatten',
    whatIs: [
      'What does flattening a PDF do?',
      'Flattening makes interactive or layered PDF content permanent. It is commonly used after completing a form, adding comments, or preparing a final copy for printing and distribution.',
      'EditPDF AI provides two methods. Form Fields Only converts AcroForm values into normal page content while preserving selectable text, vectors, links, and original images. Full Visual Flatten renders each visible page into a high-resolution single layer so supported annotations and form appearances look consistent everywhere.',
    ],
    users: [
      { who: 'Form recipients', why: 'Turn completed form values into permanent page content before submitting or archiving a final copy.' },
      { who: 'Legal and compliance teams', why: 'Create a stable review copy whose visible markings and form values cannot be casually changed in a PDF viewer.' },
      { who: 'Print and production teams', why: 'Bake visible page elements into consistent layers to reduce annotation and appearance differences between viewers and printers.' },
      { who: 'Freelancers and small businesses', why: 'Finalize invoices, approvals, and client forms before sharing them outside the organization.' },
    ],
    related: [
      { slug: 'pdf-form-builder', label: 'Create a fillable PDF form' },
      { slug: 'pdf-annotate', label: 'Add annotations before flattening' },
      { slug: 'pdf-compressor', label: 'Compress the flattened PDF' },
      { slug: 'pdf-viewer', label: 'Review the final PDF' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 100 MB' },
    privacy: 'Inspection, form flattening, visual rendering, and PDF generation run locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Select a PDF up to 100 MB. The tool checks its page count, form fields, and digital-signature status locally.' },
      { title: 'Choose a flattening method', body: 'Use Form Fields Only to preserve document quality and selectable content, or Full Visual Flatten to bake visible annotations and forms into page images.' },
      { title: 'Download and review', body: 'Download the permanent copy and confirm the expected values and annotations are visible before sharing or archiving it.' },
    ],
    faqs: [
      { q: 'Which flattening mode should I use?', a: 'Use Form Fields Only for completed AcroForm fields when you want to preserve searchable text, vectors, links, and original image quality. Use Full Visual Flatten when visible annotations and consistent appearance are more important than interactivity or text selection.' },
      { q: 'Does flattening make a PDF impossible to edit?', a: 'It removes the selected interactive or layered behavior, but no PDF should be treated as tamper-proof. Specialized software can still modify page content. Use cryptographic signatures when authenticity must be verifiable.' },
      { q: 'Will flattening invalidate a digital signature?', a: 'Yes. Flattening changes the document bytes, so an existing cryptographic signature will no longer validate. The tool detects common signature structures and requires acknowledgment before continuing.' },
      { q: 'Does Full Visual Flatten preserve searchable text?', a: 'No. Full Visual Flatten creates high-resolution page images, so text selection, search, live links, tags, and accessibility structure are removed. Form Fields Only preserves those features.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. Inspection, form flattening, visual rendering, and PDF generation all happen inside your browser.' },
    ],
  },

  'pdf-compare': {
    toolSlug: 'pdf-compare',
    whatIs: [
      'What does comparing two PDFs show?',
      'PDF comparison checks the same page position in two document versions and identifies visible changes, text revisions, page-size differences, and pages that were added or removed. It is useful when a revised contract, report, proof, or form must be checked against its earlier version.',
      'EditPDF AI renders both documents locally, compares their pixels at your chosen sensitivity, and separately checks extracted page text. Changed pages can be reviewed as a red difference map or side by side, and a CSV summary can be downloaded for your records.',
    ],
    users: [
      { who: 'Legal and compliance teams', why: 'Review revised agreements, policies, and filings for visual or textual changes before approval.' },
      { who: 'Editors and proofreaders', why: 'Compare exported proofs to confirm that requested copy and layout corrections were applied.' },
      { who: 'Design and production teams', why: 'Find moved elements, changed images, annotation differences, and altered page dimensions between exports.' },
      { who: 'Business and project teams', why: 'Check reports, proposals, invoices, and forms against an earlier version without sharing confidential files.' },
    ],
    related: [
      { slug: 'pdf-annotate', label: 'Annotate the revised PDF' },
      { slug: 'pdf-flatten', label: 'Flatten a final review copy' },
      { slug: 'pdf-viewer', label: 'Review either PDF' },
      { slug: 'pdf-editor', label: 'Correct the revised PDF' },
    ],
    formats: { input: ['PDF'], output: ['CSV'], limit: 'Up to 100 MB and 150 pages per file' },
    privacy: 'PDF rendering, text extraction, pixel comparison, and report generation all happen locally in your browser — neither PDF is uploaded to a server.',
    steps: [
      { title: 'Choose both PDF versions', body: 'Select the original and revised PDFs, each up to 100 MB and 150 pages. Both files stay in your browser.' },
      { title: 'Choose comparison sensitivity', body: 'Balanced works for most revisions. Strict finds subtle color changes, while Relaxed ignores mild rendering and compression noise.' },
      { title: 'Review and export results', body: 'Inspect changed pages with a difference map or side-by-side view, then download the page-level CSV report if needed.' },
    ],
    faqs: [
      { q: 'Does PDF comparison find text changes?', a: 'Yes. The tool separately compares normalized page text, so it can report a text change even when that content is invisible or the visible pixel difference is very small.' },
      { q: 'What do red areas in the difference map mean?', a: 'Red pixels exceed the selected color-difference threshold. Unchanged content is shown in pale grayscale so the changed areas are easier to locate.' },
      { q: 'Which sensitivity should I choose?', a: 'Use Balanced for typical document revisions. Strict is useful for subtle design changes but may flag anti-aliasing differences. Relaxed is better for PDFs that were recompressed or generated by different software.' },
      { q: 'Does the tool compare metadata or digital signatures?', a: 'It detects byte-for-byte identical files, but the normal comparison focuses on visible pages, extracted text, dimensions, and page count. It does not provide a metadata audit or validate cryptographic signatures.' },
      { q: 'Are my PDFs uploaded to a server?', a: 'No. PDF rendering, text extraction, pixel comparison, previews, and report generation happen locally in your browser.' },
    ],
  },

  'remove-pdf-metadata': {
    toolSlug: 'remove-pdf-metadata',
    whatIs: [
      'What does removing PDF metadata do?',
      'PDF metadata can contain an author name, document title, editing software, creation and modification dates, search keywords, XMP records, and internal document identifiers. Removing it creates a cleaner sharing copy without those common hidden properties.',
      'EditPDF AI removes the PDF Info dictionary, XMP metadata, document IDs, and page-level metadata references. You can also clear hidden author and timestamp fields from non-form annotations. Pages are not rasterized, so text, images, links, forms, bookmarks, and accessibility structure remain intact.',
    ],
    users: [
      { who: 'Privacy-conscious professionals', why: 'Remove common author, software, timestamp, and identifier fields before sharing a document outside the organization.' },
      { who: 'Legal and compliance teams', why: 'Prepare a cleaner review or disclosure copy while preserving visible pages, links, forms, and document structure.' },
      { who: 'Journalists and researchers', why: 'Reduce hidden source-identifying information in a PDF before publishing or sending it to collaborators.' },
      { who: 'Job seekers and small businesses', why: 'Clean exported CVs, proposals, invoices, and reports of unintended author or editing-application details.' },
    ],
    related: [
      { slug: 'pdf-redactor', label: 'Redact visible sensitive content' },
      { slug: 'pdf-flatten', label: 'Flatten forms and annotations' },
      { slug: 'extract-pdf-attachments', label: 'Review embedded attachments' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 100 MB' },
    privacy: 'Inspection, metadata removal, rewriting, and verification run locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Choose and inspect your PDF', body: 'Select a PDF up to 100 MB. The tool checks common document properties, XMP, page metadata, document IDs, and annotation identity fields locally.' },
      { title: 'Choose annotation cleanup', body: 'Keep the default option to clear hidden author, timestamp, and annotation-ID fields while preserving visible comments and form fields.' },
      { title: 'Clean, download, and review', body: 'Create a sanitized copy, download it, and review visible content, filenames, form values, bookmarks, and embedded attachments before sharing.' },
    ],
    faqs: [
      { q: 'What PDF metadata does this tool remove?', a: 'It removes the PDF Info dictionary, standard document properties, XMP metadata streams, trailer document IDs, and common page or object metadata references. The optional annotation cleanup removes author, creation date, modification date, and annotation-ID fields from non-form annotations.' },
      { q: 'Will removing metadata reduce PDF quality?', a: 'No. The pages are rewritten without rasterizing them, so text, vector graphics, original images, links, bookmarks, form fields, and accessibility structure are preserved.' },
      { q: 'Does it remove comments or form values?', a: 'Visible comments and markup are preserved. With annotation cleanup enabled, only their hidden identity fields are cleared. Form field names and values are intentionally preserved because changing them could alter the document.' },
      { q: 'What about embedded attachments and filenames?', a: 'Embedded attachments are preserved and may have their own filenames or metadata. The downloaded PDF also has a filename, and visible content or bookmarks may reveal information. Review the entire cleaned copy before sharing.' },
      { q: 'Will cleaning metadata invalidate a digital signature?', a: 'Yes. Metadata cleaning rewrites the PDF bytes, so an existing cryptographic signature will no longer validate. The tool warns when it detects common digital-signature structures.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. Inspection, metadata removal, rewriting, and verification all run locally inside your browser.' },
    ],
  },

  'extract-pdf-attachments': {
    toolSlug: 'extract-pdf-attachments',
    whatIs: [
      'What are PDF attachments?',
      'A PDF can contain complete files inside the document package. These may appear in an attachments panel, be associated with the document or a page, or be connected to a paperclip-style file annotation. Common examples include spreadsheets, XML invoice data, source documents, images, and supporting evidence.',
      'EditPDF AI checks the document embedded-files name tree, associated-file arrays, and page file annotations. It decodes supported embedded-file streams and lets you download the original bytes individually or package multiple files into a ZIP. The PDF itself is never changed.',
    ],
    users: [
      { who: 'Accounting and finance teams', why: 'Recover XML, CSV, spreadsheet, or receipt data packaged inside invoice and archival PDF files.' },
      { who: 'Legal and compliance teams', why: 'Collect supporting documents, exhibits, and evidence embedded in a PDF without manually opening every attachment annotation.' },
      { who: 'Design and production teams', why: 'Retrieve source images, data files, and other assets included with a delivered PDF package.' },
      { who: 'Researchers and archivists', why: 'Extract supplementary datasets and source materials stored as PDF associated files or standard attachments.' },
    ],
    related: [
      { slug: 'remove-pdf-metadata', label: 'Remove PDF metadata before sharing' },
      { slug: 'extract-pages', label: 'Extract selected PDF pages' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
      { slug: 'pdf-viewer', label: 'Open and review the PDF' },
    ],
    formats: { input: ['PDF'], output: ['Embedded files', 'ZIP'], limit: 'Up to 100 MB — up to 500 attachments, 200 MB per file, 300 MB total extracted data' },
    privacy: 'PDF inspection, stream decoding, and ZIP creation run locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Select a PDF up to 100 MB. The document is read locally and remains unchanged.' },
      { title: 'Review detected attachments', body: 'The tool scans document attachments, associated files, and file annotations, then shows each filename, size, declared type, and source.' },
      { title: 'Download safely', body: 'Download one file at a time or create a ZIP for multiple attachments. Filenames are sanitized, but unknown extracted files should still be scanned before opening.' },
    ],
    faqs: [
      { q: 'Which PDF attachments can this tool find?', a: 'It checks the standard EmbeddedFiles name tree, document and page associated-file arrays, and FileAttachment annotations. This covers ordinary attachment panels, common PDF/A-3 associated files, and paperclip-style page attachments.' },
      { q: 'Does extraction change the original PDF?', a: 'No. The tool only reads the PDF and creates separate downloads. It does not rewrite, remove, or save changes to the source document.' },
      { q: 'Are extracted attachments safe to open?', a: 'Not necessarily. An embedded file can contain active content or malware just like an email attachment. The tool does not preview or execute extracted content. Scan files from unknown sources before opening them.' },
      { q: 'Why might an attachment not be extracted?', a: 'A damaged PDF, password protection, non-standard embedded-file structure, unsupported stream encoding, or browser memory limits can prevent extraction. The tool supports up to 500 files, 200 MB per extracted file, and 300 MB total extracted data.' },
      { q: 'Can I download every attachment at once?', a: 'Yes. When multiple files are found, use Download all as ZIP. Duplicate and unsafe filenames are normalized so files cannot create unintended folders inside the archive.' },
      { q: 'Is my PDF or its attachments uploaded?', a: 'No. PDF inspection, stream decoding, and ZIP creation all run locally inside your browser.' },
    ],
  },

  'extract-pdf-images': {
    toolSlug: 'extract-pdf-images',
    whatIs: [
      'What does extracting images from a PDF mean?',
      'A PDF page can combine text, vector paths, and embedded bitmap images. Image extraction finds those underlying raster pictures—such as photographs, screenshots, and scanned image regions—and saves them separately instead of taking a screenshot of the complete page.',
      'EditPDF AI scans Image XObjects and inline bitmap operations on every page, decodes their pixels with PDF.js, and exports unique images as lossless PNG files. Repeated images are downloaded once while their page locations and usage count remain visible.',
    ],
    users: [
      { who: 'Design and marketing teams', why: 'Recover photographs, product images, and raster assets from approved brochures, reports, and creative proofs.' },
      { who: 'Researchers and students', why: 'Extract charts stored as bitmap images, scanned figures, and photographs for authorized study or citation workflows.' },
      { who: 'Publishers and content teams', why: 'Collect embedded visual assets from archived PDFs without cropping full-page screenshots by hand.' },
      { who: 'Business and operations teams', why: 'Retrieve screenshots, receipts, logos stored as bitmaps, and supporting pictures from document packages.' },
    ],
    related: [
      { slug: 'pdf-to-images', label: 'Convert complete PDF pages to images' },
      { slug: 'extract-pdf-attachments', label: 'Extract files attached to the PDF' },
      { slug: 'pdf-ocr', label: 'Extract text from scanned pages' },
      { slug: 'pdf-viewer', label: 'Review the source PDF' },
    ],
    formats: { input: ['PDF'], output: ['PNG', 'ZIP'], limit: 'Up to 100 MB and 300 pages — up to 500 unique images per PDF' },
    privacy: 'PDF parsing, image decoding, hashing, preview generation, and ZIP creation all happen locally inside your browser — nothing is uploaded.',
    steps: [
      { title: 'Choose your PDF', body: 'Select a PDF up to 100 MB and 300 pages. The file stays in your browser.' },
      { title: 'Scan embedded bitmaps', body: 'The tool finds page Image XObjects and inline images, decodes supported transparency, and deduplicates identical pixel content.' },
      { title: 'Preview and download', body: 'Review dimensions, page locations, and usage counts, then download one lossless PNG or package every unique image into a ZIP.' },
    ],
    faqs: [
      { q: 'How is this different from PDF to Images?', a: 'PDF to Images renders each complete page, including text, margins, and vector artwork. Extract PDF Images recovers only standalone bitmap images used inside page content.' },
      { q: 'Does the tool extract images at their original size?', a: 'It exports the decoded bitmap pixel dimensions provided by the PDF. The PNG conversion is lossless, although it may have a different file size from the compressed stream stored inside the PDF.' },
      { q: 'Why are some logos or charts missing?', a: 'They may be drawn using vector paths, text, gradients, or stencil masks rather than stored as standalone bitmap images. Those page instructions cannot be extracted as ordinary pictures by this tool.' },
      { q: 'Why are repeated images shown only once?', a: 'The tool hashes the lossless PNG pixels and combines identical images. Each result lists the pages and total placements where that image appeared.' },
      { q: 'What are the browser safety limits?', a: 'The source PDF can contain up to 300 pages and 500 unique images. Individual images over 40 million pixels are skipped, and total decoded pixel limits prevent browser memory exhaustion.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. PDF parsing, image decoding, hashing, preview generation, and ZIP creation all happen locally inside your browser.' },
    ],
  },

  'export-pdf-form-data': {
    toolSlug: 'export-pdf-form-data',
    whatIs: [
      'What is PDF form data export?',
      'A fillable PDF normally stores answers in an AcroForm field tree. Each field can have a name, type, value, validation flags, available choices, and one or more page widgets that control where it appears.',
      'EditPDF AI reads that structured field data and exports it as CSV or JSON. It supports standard text, checkbox, radio, dropdown, option-list, button, and signature fields while leaving the source PDF unchanged. Signature fields expose only Signed or Unsigned status—cryptographic signature contents and certificates are deliberately omitted.',
    ],
    users: [
      { who: 'Operations teams', why: 'Move submitted PDF form answers into spreadsheets, internal systems, and review queues without retyping each response.' },
      { who: 'Researchers and analysts', why: 'Turn batches of authorized survey or intake form answers into structured rows for validation and analysis.' },
      { who: 'Developers and QA teams', why: 'Inspect field names, types, flags, options, widget counts, and page locations while testing form-generation workflows.' },
      { who: 'Small businesses', why: 'Export values from applications, orders, checklists, and onboarding forms into reusable CSV or JSON records.' },
    ],
    related: [
      { slug: 'pdf-form-builder', label: 'Create fillable PDF fields' },
      { slug: 'ai-pdf-form-filler', label: 'Fill a PDF form with AI' },
      { slug: 'pdf-to-excel', label: 'Convert PDF tables to Excel' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
      { slug: 'export-pdf-comments', label: 'Export comments and annotations too' },
    ],
    formats: { input: ['PDF'], output: ['CSV', 'JSON'], limit: 'Up to 100 MB and 500 pages' },
    privacy: 'PDF parsing, field inspection, and export generation all happen locally in your browser. Analytics receive only counts and size buckets — never filenames, field names, or values.',
    steps: [
      { title: 'Choose your fillable PDF', body: 'Select one PDF up to 100 MB and 500 pages. Parsing happens locally, and the source document is not modified.' },
      { title: 'Review detected fields', body: 'Check field names, types, current values, page locations, flags, and options. Any XFA limitation, unreadable value, signature field, or orphan widget is reported.' },
      { title: 'Download CSV or JSON', body: 'Include or exclude empty fields, then export spreadsheet-friendly CSV or structured JSON. CSV cells that look like formulas are neutralized for safer opening.' },
    ],
    faqs: [
      { q: 'Which PDF field types can be exported?', a: 'The tool reads standard AcroForm text fields, checkboxes, radio groups, dropdowns, option lists, push buttons, and signature fields. It also reports required, read-only, and export flags, options, widget counts, and page locations.' },
      { q: 'Does the export include digital signature data?', a: 'No. A signature field is reported only as Signed or Unsigned. Cryptographic contents, certificates, byte ranges, and signer details are never copied into CSV or JSON.' },
      { q: 'What happens with XFA forms?', a: 'Dynamic XFA datasets are not supported. If a PDF contains both XFA and standard AcroForm fields, the standard fields are exported and a warning is shown. An XFA-only form may have no exportable fields.' },
      { q: 'Is the CSV safe to open in a spreadsheet?', a: 'The tool quotes every cell and prefixes values that begin like spreadsheet formulas, including equals, plus, minus, and at signs. You should still handle exported personal data according to your organization’s security policy.' },
      { q: 'Does exporting change the original PDF?', a: 'No. The tool only reads the field structure and creates a separate CSV or JSON download. The PDF bytes are not rewritten.' },
      { q: 'Is my PDF form uploaded?', a: 'No. PDF parsing, field inspection, previews, CSV creation, and JSON creation all happen locally inside your browser. Analytics receive counts and size buckets, never filenames, field names, or values.' },
    ],
  },

  'extract-pdf-bookmarks': {
    toolSlug: 'extract-pdf-bookmarks',
    whatIs: [
      'What are PDF bookmarks?',
      'PDF bookmarks are entries in a document outline that help readers jump to chapters, sections, appendices, web pages, or locations in another PDF. Unlike a printed table of contents, bookmarks are stored as a separate hierarchy with parent and child relationships.',
      'EditPDF AI reads that outline hierarchy and resolves direct page references plus named destinations stored in legacy dictionaries or modern PDF name trees. Web links and external-PDF actions are reported as text but never opened. CSV provides a flat spreadsheet view, while JSON preserves the nested tree.',
    ],
    users: [
      { who: 'Publishers and editors', why: 'Audit chapter and section navigation before releasing manuals, reports, ebooks, and long-form publications.' },
      { who: 'Accessibility teams', why: 'Check whether long PDFs provide a logical, navigable outline and identify bookmarks that do not resolve to local pages.' },
      { who: 'Developers and QA teams', why: 'Inspect outline depth, destination modes, named destinations, and external actions while testing PDF-generation pipelines.' },
      { who: 'Researchers and archivists', why: 'Export the structural table of contents from authorized reports and collections into reusable JSON or CSV records.' },
    ],
    related: [
      { slug: 'pdf-viewer', label: 'Open and review the PDF' },
      { slug: 'extract-pages', label: 'Extract bookmarked pages' },
      { slug: 'pdf-page-manager', label: 'Reorganize PDF pages' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
    ],
    formats: { input: ['PDF'], output: ['CSV', 'JSON'], limit: 'Up to 100 MB and 2,000 pages' },
    privacy: 'Outline parsing, destination resolution, and export generation happen locally in your browser. The source PDF is treated as read-only.',
    steps: [
      { title: 'Choose your PDF', body: 'Select one PDF up to 100 MB and 2,000 pages. The document stays on your device and is not rewritten.' },
      { title: 'Review the outline tree', body: 'Inspect bookmark titles, hierarchy paths, resolved page numbers, view modes, child counts, named destinations, and external action classifications.' },
      { title: 'Download CSV or JSON', body: 'Use CSV for a flat spreadsheet-friendly outline or JSON to retain nested children and structured destination metadata.' },
    ],
    faqs: [
      { q: 'What is the difference between PDF bookmarks and a table of contents?', a: 'A visible table of contents is ordinary page content. PDF bookmarks are interactive outline objects stored separately in the file. A document can have either one, both, or neither.' },
      { q: 'Can the tool resolve named PDF destinations?', a: 'Yes. It checks both the legacy catalog Dests dictionary and the modern Names/Dests name tree, then resolves supported destination arrays to page numbers.' },
      { q: 'Does the tool open web links or external PDFs?', a: 'No. URI, remote GoTo, named, and other actions are classified and displayed as text only. The tool never follows or executes a bookmark action.' },
      { q: 'Why does a bookmark show as unresolved?', a: 'Its destination may be missing, damaged, cyclic, use an unsupported action, point outside the current PDF, or reference a page object that no longer exists. Available title and target information is still exported.' },
      { q: 'Which export should I choose?', a: 'CSV is useful for spreadsheets and audits because every bookmark becomes one row with depth and path columns. JSON is better for software workflows because it preserves the original nested child hierarchy.' },
      { q: 'Is my PDF uploaded or modified?', a: 'No. Outline parsing, destination resolution, previews, and export generation happen locally in your browser. The source PDF is read-only and remains unchanged.' },
    ],
  },

  'pdf-bookmarks-manager': {
    toolSlug: 'pdf-bookmarks-manager',
    whatIs: [
      'What does a PDF bookmarks manager do?',
      'A PDF bookmarks manager edits the interactive outline shown in a PDF reader’s bookmarks or navigation panel. Bookmark entries can point to pages, contain nested children, start open or closed, or invoke supported web, remote-PDF, and named actions.',
      'EditPDF AI loads the existing outline into a visual tree where you can rename entries, change page targets, add root or child bookmarks, reorder siblings, choose open or closed state, and delete bookmarks. Saving rebuilds every parent, child, previous, next, first, last, and count link together, then downloads a new PDF while leaving the source unchanged.',
    ],
    users: [
      { who: 'Publishers and technical writers', why: 'Create accurate chapter and section navigation for manuals, reports, ebooks, standards, and long-form documents.' },
      { who: 'Accessibility teams', why: 'Improve keyboard and assistive-technology navigation by organizing long PDFs into a logical outline hierarchy.' },
      { who: 'Legal and compliance teams', why: 'Retarget or rename navigation entries after assembling exhibits, disclosures, policies, and review bundles.' },
      { who: 'Developers and document teams', why: 'Repair malformed or outdated outlines after page insertion, deletion, conversion, or automated PDF generation.' },
    ],
    related: [
      { slug: 'extract-pdf-bookmarks', label: 'Audit or export the bookmark tree' },
      { slug: 'pdf-page-manager', label: 'Reorganize PDF pages' },
      { slug: 'extract-pages', label: 'Extract selected PDF pages' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 100 MB and 2,000 pages' },
    privacy: 'Parsing, editing, outline reconstruction, and PDF generation happen locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Select a PDF up to 100 MB and 2,000 pages. Existing bookmarks and supported destinations are loaded locally into an editable tree.' },
      { title: 'Edit the outline', body: 'Rename and retarget page bookmarks, add root or child entries, move siblings up or down, change open state, or delete unwanted branches.' },
      { title: 'Download the rebuilt PDF', body: 'The manager creates a new PDF with a fully linked outline. The original document remains unchanged and can be kept as a backup.' },
    ],
    faqs: [
      { q: 'Can I add bookmarks to a PDF that has none?', a: 'Yes. After loading the PDF, choose Add root bookmark. You can then rename it, select its page, add child bookmarks, and build a complete hierarchy.' },
      { q: 'What happens to web links and external PDF bookmarks?', a: 'Supported URI, remote GoTo, and named actions are preserved. They are shown as classified destinations and can be converted to ordinary page bookmarks with the Set page button.' },
      { q: 'Can I move a bookmark under a different parent?', a: 'You can add child bookmarks and reorder entries within the same parent. Cross-parent drag-and-drop is not currently supported; create a child under the desired parent and remove the old entry.' },
      { q: 'Does editing bookmarks change page quality?', a: 'No. Pages are not rasterized or re-rendered. The document structure is rewritten with a new outline, while page content, images, and vectors retain their original quality.' },
      { q: 'Will editing bookmarks invalidate a digital signature?', a: 'Yes. Any saved outline changes rewrite PDF bytes, so an existing cryptographic signature will no longer validate. The manager detects common signature structures and requires explicit acknowledgement before saving.' },
      { q: 'Is my PDF uploaded or modified in place?', a: 'No. Parsing, editing, outline reconstruction, and PDF generation happen locally in your browser. A new PDF is downloaded and the source file remains unchanged.' },
    ],
  },

  'pdf-page-labels': {
    toolSlug: 'pdf-page-labels',
    whatIs: [
      'What are PDF page labels?',
      'PDF page labels are navigation names stored separately from printed page content. A viewer can show front matter as i, ii, iii, restart the main document at 1, label appendices A, B, C, or display identifiers such as EX-1 while the underlying PDF page order stays unchanged.',
      'EditPDF AI loads the standards-based PageLabels number tree into a range editor. Each range can choose decimal, Roman, alphabetic, or prefix-only labels, an optional prefix, and a starting number. Saving creates a new PDF with a rebuilt number tree and does not rasterize or repaint any page.',
    ],
    users: [
      { who: 'Publishers and technical writers', why: 'Label covers, front matter, chapters, indexes, and appendices so viewer navigation matches the document structure.' },
      { who: 'Legal and compliance teams', why: 'Create exhibit, schedule, disclosure, and attachment labels with prefixes and independent numbering restarts.' },
      { who: 'Researchers and universities', why: 'Use Roman-numeral preliminary pages and restart decimal numbering at the beginning of a thesis, paper, or report.' },
      { who: 'Accessibility and QA teams', why: 'Align PDF viewer navigation with visible page references without altering page content or image quality.' },
    ],
    related: [
      { slug: 'add-page-numbers', label: 'Print visible numbers on pages' },
      { slug: 'pdf-page-manager', label: 'Reorder or rotate PDF pages' },
      { slug: 'pdf-bookmarks-manager', label: 'Edit document bookmarks' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 100 MB and 2,000 pages' },
    privacy: 'Page-label parsing, previews, number-tree reconstruction, and PDF generation happen locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Select one PDF up to 100 MB and 2,000 pages. Existing custom page-label ranges are read locally from the PDF number tree.' },
      { title: 'Define label ranges', body: 'Choose where each range begins, select decimal, Roman, letter, or prefix-only style, then set an optional prefix and starting value.' },
      { title: 'Preview and download', body: 'Review the navigation labels for individual PDF pages, then download a new file with the rebuilt label tree. Page artwork remains unchanged.' },
    ],
    faqs: [
      { q: 'What is the difference between page labels and printed page numbers?', a: 'Page labels are metadata used by compatible PDF viewers for navigation, thumbnail captions, and page lookup. Printed page numbers are visible marks painted onto each page. Use Add Page Numbers when you need numbers to appear on the page itself.' },
      { q: 'Can I use Roman numerals for front matter and restart at page 1?', a: 'Yes. Create a lowercase Roman range beginning on PDF page 1, then add a decimal range at the first body page with a starting number of 1.' },
      { q: 'Can page labels include prefixes?', a: 'Yes. A prefix can be combined with decimal, Roman, or letter numbering, such as A-1, EX-IV, or Appendix-C. Prefix-only ranges are also supported.' },
      { q: 'What does Restore PDF defaults do?', a: 'It removes the custom PageLabels number tree from the downloaded copy. PDF viewers then use ordinary sequential page numbers beginning at 1.' },
      { q: 'Will page labels change page quality or layout?', a: 'No. The tool updates document navigation metadata only. Existing page content streams, images, text, vectors, dimensions, and order are not re-rendered.' },
      { q: 'Is my PDF uploaded?', a: 'No. Page-label parsing, previews, number-tree reconstruction, and PDF generation happen locally in your browser. The source file is never modified in place.' },
    ],
  },

  'extract-pdf-links': {
    toolSlug: 'extract-pdf-links',
    whatIs: [
      'What does a PDF link extractor find?',
      'A PDF link extractor reads interactive Link annotations stored on document pages. Those annotations can open websites or email addresses, jump to another page or named destination, reference another PDF, launch a file, submit a form, or invoke another PDF action. Visible URL text without an annotation is not clickable and is therefore not reported.',
      'EditPDF AI classifies each link, resolves supported local destinations, and records its source page, clickable rectangle, view mode, target, and accessibility description. Targets are decoded as text only. The tool never opens a URL or file, and embedded JavaScript is flagged without returning or executing the script body.',
    ],
    users: [
      { who: 'Accessibility and compliance teams', why: 'Audit interactive targets, link descriptions, page locations, and unresolved destinations in published documents.' },
      { who: 'Publishers and document editors', why: 'Review website, email, cross-reference, appendix, and external-document links before releasing reports and manuals.' },
      { who: 'Security and QA teams', why: 'Identify file launches, form submissions, remote documents, and JavaScript actions without opening or executing them.' },
      { who: 'Researchers and archivists', why: 'Export a structured inventory of references and linked resources from authorized PDF collections.' },
    ],
    related: [
      { slug: 'pdf-viewer', label: 'Open and review the PDF' },
      { slug: 'pdf-bookmarks-manager', label: 'Edit PDF bookmarks' },
      { slug: 'pdf-page-manager', label: 'Reorganize linked pages' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
      { slug: 'remove-pdf-links', label: 'Disable all clickable links' },
    ],
    formats: { input: ['PDF'], output: ['CSV', 'JSON'], limit: 'Up to 100 MB and 2,000 pages' },
    privacy: 'Link parsing, destination resolution, and export generation happen locally in your browser; the source PDF is treated as read-only.',
    steps: [
      { title: 'Choose your PDF', body: 'Select one PDF up to 100 MB and 2,000 pages. The document is parsed locally and never modified.' },
      { title: 'Review and filter links', body: 'Inspect page numbers, target classifications, local destinations, view modes, rectangle coordinates, descriptions, and safety warnings.' },
      { title: 'Download CSV or JSON', body: 'Export every extracted record. CSV is useful for audits and spreadsheets, while JSON retains typed destinations and structured rectangles.' },
    ],
    faqs: [
      { q: 'Does the extractor open or test any link?', a: 'No. URLs, files, destinations, and actions are decoded as text only. The browser is never directed to a target and no linked file is opened.' },
      { q: 'Why is visible URL text missing from the results?', a: 'A printed URL is ordinary page text unless it has an interactive Link annotation. This tool reports actual clickable annotations and actions, not every string that resembles a URL.' },
      { q: 'Which link types are recognized?', a: 'The tool classifies web, email, phone, internal-page, external-PDF, file-launch, form-submission, named, JavaScript, other, and unresolved actions.' },
      { q: 'What happens to embedded JavaScript actions?', a: 'They are counted and clearly flagged, but their script body is not opened, returned in exports, or executed.' },
      { q: 'What are the rectangle coordinates?', a: 'They describe the clickable area in PDF page coordinate units: its lower-left x and y position plus width and height. They help editors locate and remediate annotations.' },
      { q: 'Is my PDF uploaded or changed?', a: 'No. Link parsing, destination resolution, filtering, CSV creation, and JSON creation happen locally in your browser. The source PDF remains read-only.' },
    ],
  },

  'remove-pdf-links': {
    toolSlug: 'remove-pdf-links',
    whatIs: [
      'What does a PDF link remover change?',
      'A PDF link remover deletes page-level Link annotations: the invisible clickable rectangles that can open websites, start emails or calls, jump between pages, launch files, submit forms, or invoke actions. It does not erase visible URL text, underlines, QR codes, or artwork drawn on the page.',
      'EditPDF AI first inventories the links without opening any target, then removes only Link annotations from a new PDF copy. Other annotation types, form widgets, bookmarks, page labels, text, images, and vector content are preserved. The output is reopened locally and verified before download.',
    ],
    users: [
      { who: 'Publishers and document editors', why: 'Create a non-clickable distribution copy while keeping citations, URL text, and page design visible.' },
      { who: 'Security and compliance teams', why: 'Disable website, file-launch, form-submission, and JavaScript link actions before controlled document sharing.' },
      { who: 'Teachers and assessment teams', why: 'Remove clickable answer links and external resources from examination or classroom PDFs.' },
      { who: 'Archivists and records teams', why: 'Preserve page appearance while preventing obsolete or untrusted links from being activated.' },
    ],
    related: [
      { slug: 'extract-pdf-links', label: 'Audit PDF links before removal' },
      { slug: 'pdf-viewer', label: 'Review the link-free copy' },
      { slug: 'remove-pdf-metadata', label: 'Remove hidden PDF metadata' },
      { slug: 'pdf-unlock', label: 'Unlock an authorized PDF first' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 100 MB and 2,000 pages' },
    privacy: 'Inspection, annotation removal, PDF generation, and verification happen locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Select one PDF up to 100 MB and 2,000 pages. Link annotations are classified locally without opening their targets.' },
      { title: 'Review the removal summary', body: 'Check how many links and pages are affected, including external targets, internal jumps, and JavaScript link actions.' },
      { title: 'Remove and download', body: 'Create a new PDF with all page Link annotations removed. The result is reopened and verified before it is downloaded.' },
    ],
    faqs: [
      { q: 'Will visible URLs disappear from the page?', a: 'No. The tool removes invisible clickable annotation rectangles and their actions. Printed URL text, link-colored text, underlines, QR codes, and page artwork remain visible.' },
      { q: 'Which clickable links are removed?', a: 'All page Link annotations are removed, including web, email, phone, internal-page, remote-PDF, file-launch, form-submission, named, JavaScript, and unrecognized link actions.' },
      { q: 'Are forms, comments, and bookmarks preserved?', a: 'Yes. Only annotations whose subtype is Link are removed. Form widgets, comments, markup, bookmarks, page labels, page order, text, images, and vectors are retained.' },
      { q: 'Does this remove document-level JavaScript or embedded files?', a: 'No. This tool removes actions attached to page Link annotations. It does not claim to sanitize document-open actions, embedded files, QR codes, or scripts stored elsewhere in the PDF.' },
      { q: 'What happens to digital signatures?', a: 'Rewriting PDF bytes invalidates existing cryptographic signatures. The tool detects common signature markers and requires acknowledgement before creating the new copy.' },
      { q: 'Is the output checked?', a: 'Yes. The downloaded copy is reopened locally and scanned again. A download is only prepared when the page count is unchanged and no page Link annotations remain.' },
      { q: 'Is my PDF uploaded?', a: 'No. Inspection, annotation removal, PDF generation, and verification happen locally in your browser. The original file is never modified in place.' },
    ],
  },

  'export-pdf-comments': {
    toolSlug: 'export-pdf-comments',
    whatIs: [
      'What can a PDF comment exporter extract?',
      'A PDF comment exporter reads review annotations stored separately from normal page content. These can include sticky notes, text boxes, highlights, underlines, strikeouts, squiggly marks, stamps, ink drawings, shapes, carets, attachment markers, redaction marks, and other annotation types.',
      'EditPDF AI exports the review context around each annotation: physical PDF page, type, author, subject, comment text, creation and modification dates, annotation ID, workflow state, reply relationship, color, opacity, and rectangle coordinates when available. Link annotations, form widgets, and popup containers are excluded so the report focuses on review markup rather than interactive controls.',
    ],
    users: [
      { who: 'Editors and publishing teams', why: 'Collect reviewer notes, highlights, and corrections into a sortable spreadsheet before revising a document.' },
      { who: 'Legal and compliance teams', why: 'Create an auditable inventory of markup authors, dates, pages, subjects, states, and reply relationships.' },
      { who: 'Teachers and academic reviewers', why: 'Export feedback from annotated assignments, manuscripts, theses, and research papers for tracking or grading.' },
      { who: 'Accessibility and migration teams', why: 'Locate annotations by page and rectangle when remediating documents or moving review data into another system.' },
    ],
    related: [
      { slug: 'pdf-annotate', label: 'Add comments and highlights' },
      { slug: 'pdf-flatten', label: 'Make visible annotations permanent' },
      { slug: 'remove-pdf-metadata', label: 'Clear annotation identity metadata' },
      { slug: 'extract-pdf-links', label: 'Audit link annotations separately' },
    ],
    formats: { input: ['PDF'], output: ['CSV', 'JSON'], limit: 'Up to 100 MB and 2,000 pages' },
    privacy: 'Annotation parsing, reply resolution, filtering, and export generation happen locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Choose your PDF', body: 'Select one PDF up to 100 MB and 2,000 pages. The document stays read-only and is parsed locally.' },
      { title: 'Review and filter annotations', body: 'Inspect annotation totals, pages, authors, replies, types, comment text, subjects, dates, and page rectangles.' },
      { title: 'Download CSV or JSON', body: 'Export every review record. CSV is ready for spreadsheets, while JSON preserves arrays, rectangles, reply IDs, colors, opacity, and workflow fields.' },
    ],
    faqs: [
      { q: 'Which PDF annotations are included?', a: 'The exporter includes notes, text boxes, highlights, underlines, strikeouts, squiggles, stamps, ink, shapes, carets, attachment annotations, redaction annotations, media annotations, and other non-link review annotations.' },
      { q: 'Why are links and form fields excluded?', a: 'Links and widgets are interactive controls rather than review comments. Excluding them prevents hyperlink rectangles and form fields from overwhelming the comment report. Use Extract PDF Links or Export PDF Form Data for those objects.' },
      { q: 'Are replies connected to their parent comments?', a: 'Yes when the PDF stores a standard IRT reply reference to another exported annotation. The parent record number is included in CSV and JSON.' },
      { q: 'Why does an annotation have no comment text?', a: 'Some markup is meaningful visually without a text note, such as a highlight, drawing, shape, stamp, or redaction area. These records remain in the export with their type and location.' },
      { q: 'Are PDF dates converted?', a: 'Supported PDF date strings are normalized to ISO 8601 UTC timestamps. Unusual or invalid date values are retained as stored rather than discarded.' },
      { q: 'Does exporting change or flatten the PDF?', a: 'No. The source PDF stays read-only. The tool only creates CSV or JSON files and never changes annotations or page content.' },
      { q: 'Is my PDF uploaded?', a: 'No. Annotation parsing, reply resolution, filtering, and export generation happen locally in your browser.' },
    ],
  },

  'scan-to-pdf': {
    toolSlug: 'scan-to-pdf',
    whatIs: [
      'What is Scan to PDF?',
      'Scan to PDF turns your phone or laptop camera into a document scanner. Instead of a flat photo with a crooked angle and a distracting background, it detects the edges of the paper, corrects the perspective so the page looks flat and rectangular, and applies a scan-style filter — producing a page that looks like it came from a real flatbed scanner.',
      'You can capture multiple pages in one session, reorder them, and export them as one PDF. Camera capture, edge detection, perspective correction, and PDF creation run locally in your browser without an application document-processing request.',
    ],
    users: [
      { who: 'Students & job applicants', why: 'Scan physical forms, certificates, or handwritten notes into a clean PDF for submission or storage.' },
      { who: 'Freelancers & small businesses', why: 'Turn paper receipts and signed contracts into PDFs for expense tracking and recordkeeping on the go.' },
      { who: 'Remote and field workers', why: 'Capture whiteboards, printed instructions, or paperwork on-site and share a PDF immediately.' },
      { who: 'Anyone without a scanner', why: 'Digitize mail, letters, or official documents using only a phone camera — no scanner hardware needed.' },
    ],
    related: [
      { slug: 'image-to-pdf', label: 'Convert existing photos to PDF' },
      { slug: 'pdf-ocr', label: 'Make a scanned PDF searchable' },
      { slug: 'pdf-compressor', label: 'Compress the PDF after scanning' },
      { slug: 'pdf-merger', label: 'Combine scans with other PDFs' },
    ],
    formats: { input: ['JPG', 'PNG'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on camera resolution, browser memory, and device performance' },
    privacy: 'Camera capture, edge detection, perspective correction, and PDF generation all happen on your device — photos are never sent to a server.',
    steps: [
      { title: 'Open the camera', body: 'Tap "Open Camera" and point it at the document. A guide frame helps you keep the page in view.' },
      { title: 'Auto-crop & straighten', body: 'Capture the page, then use auto-detect or drag the 4 corner handles to select exactly the document edges. Perspective is corrected automatically.' },
      { title: 'Save as PDF', body: 'Scan as many pages as you need, reorder them if necessary, then export one multi-page PDF.' },
    ],
    faqs: [
      { q: 'Do I need to install an app?', a: 'No. Scan to PDF runs in your mobile or desktop browser using your device camera — nothing to install.' },
      { q: 'Does it fix crooked or angled photos?', a: 'Yes. Drag the 4 corner handles onto the document edges (or use auto-detect) and the perspective is mathematically corrected so the page appears flat and rectangular.' },
      { q: 'Can I scan multiple pages into one PDF?', a: 'Yes. Keep capturing pages in the same session — each one is added to the page list, which you can reorder before saving a single multi-page PDF.' },
      { q: 'What if my browser can’t access the camera?', a: 'If camera permission is denied or unavailable, use "Take Photo" to open your device’s native camera app, or upload existing photos instead — both feed into the same crop and filter workflow.' },
      { q: 'Are my photos uploaded anywhere?', a: 'No. Capture, edge detection, perspective correction, and PDF generation all happen on your device. Nothing is sent to a server.' },
      { q: 'What scan filters are available?', a: 'Original, Enhanced (auto contrast, closest to a real scanner), Black & White, and Grayscale.' },
    ],
  },

  'image-to-pdf': {
    toolSlug: 'image-to-pdf',
    whatIs: [
      'What is an image to PDF converter?',
      'An image to PDF converter takes one or more supported JPG, PNG, WEBP, GIF, BMP, HEIC, or HEIF files and packages them into a PDF. Each prepared image becomes a page, and you can control page size, order, orientation, crop, and quality before downloading the result.',
      'Combining images as a PDF can help when a recipient requests one ordered document instead of several separate files. EditPDF AI performs image preparation and PDF generation locally in the browser without an application document-processing request.',
    ],
    users: [
      { who: 'Students & job applicants', why: 'Combine scanned certificates, diplomas, and ID photos into a single PDF for university or job applications.' },
      { who: 'Photographers & designers', why: 'Bundle selected images into a single portfolio PDF to share with clients without requiring a gallery login.' },
      { who: 'Office & admin professionals', why: 'Convert scanned receipts, photos of whiteboards, or signed paper forms into PDFs for record-keeping systems.' },
      { who: 'Mobile users', why: 'Turn phone photos of handwritten notes, meeting whiteboards, or paper documents into shareable PDFs on the spot.' },
    ],
    related: [
      { slug: 'pdf-to-images', label: 'Convert PDF pages back to images' },
      { slug: 'pdf-merger', label: 'Merge image PDFs into one' },
      { slug: 'pdf-compressor', label: 'Compress the PDF after converting' },
      { slug: 'pdf-editor', label: 'Edit your new PDF' },
      { slug: 'scan-to-pdf', label: 'Scan paper documents with your camera instead' },
      { slug: 'extract-pdf-images', label: 'Extract images back out of a PDF' },
    ],
    formats: { input: ['JPG', 'PNG', 'WEBP', 'GIF', 'BMP', 'HEIC/HEIF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on image dimensions, browser memory, and device performance' },
    privacy: 'The conversion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your images', body: 'Drag one or more supported JPG, PNG, WEBP, GIF, BMP, HEIC, or HEIF images onto the page. HEIC and HEIF require the browser conversion step to succeed.' },
      { title: 'Arrange and adjust', body: 'Reorder images by dragging, crop or rotate individual images, and choose the output page size (A4, Letter, or fit to image).' },
      { title: 'Convert and download', body: 'Click Convert to PDF. The prepared images are combined into a single PDF in the order you set and downloaded to your device.' },
    ],
    faqs: [
      { q: 'What image formats can I convert to PDF?', a: 'JPG, JPEG, PNG, WEBP, GIF, BMP, HEIC, and HEIF can be selected. HEIC and HEIF require the in-browser conversion step to succeed, and animated images are converted as still pages.' },
      { q: 'Will the image quality be reduced?', a: 'The converter provides a JPEG quality setting and fits images to the selected page size. Inspect the output if image detail or print quality matters.' },
      { q: 'Can I convert multiple images into one PDF?', a: 'Yes. Multiple supported images can be combined into one multi-page PDF. Practical capacity depends on image dimensions, browser memory, and device performance.' },
      { q: 'What page size does the PDF use?', a: 'You can choose A4, US Letter, or "fit to image" which makes each page exactly the same size as the source image.' },
      { q: 'Is the conversion done on my device?', a: 'Yes. The conversion runs locally in your browser without an application document-processing request.' },
    ],
  },

  'word-to-pdf': {
    toolSlug: 'word-to-pdf',
    whatIs: [
      'What is a Word to PDF converter?',
      'A Word to PDF converter reads a Microsoft Word document (.docx) and rebuilds supported text, headings, lists, and tables as a PDF. Complex layouts, custom fonts, headers, footers, columns, and images may differ or be omitted.',
      'Converting to PDF before sharing is the professional standard for CVs, reports, proposals, and any document where appearance must be locked. EditPDF AI converts your Word document in the browser so the file is never sent to an external server — important for confidential contracts and employment paperwork.',
    ],
    users: [
      { who: 'Job seekers', why: 'Convert a CV or cover letter from .docx to PDF before applying, so the layout stays intact regardless of what software the recruiter uses.' },
      { who: 'Business & office professionals', why: 'Lock reports, proposals, and client presentations into PDF format so recipients see exactly the intended design.' },
      { who: 'Students & academics', why: 'Submit essays and research papers as PDFs when the institution requires a format that cannot be modified after submission.' },
      { who: 'Freelancers & consultants', why: 'Convert proposals, invoices, and contracts to PDF to prevent accidental edits and ensure correct formatting on all platforms.' },
    ],
    related: [
      { slug: 'pdf-to-word', label: 'Convert PDF back to Word' },
      { slug: 'excel-to-pdf', label: 'Convert Excel spreadsheets to PDF' },
      { slug: 'ppt-to-pdf', label: 'Convert PowerPoint slides to PDF' },
      { slug: 'pdf-compressor', label: 'Compress the converted PDF' },
      { slug: 'html-to-pdf', label: 'Convert pasted HTML to PDF' },
    ],
    formats: { input: ['DOCX'], output: ['PDF'], limit: 'Practical capacity depends on document complexity, extracted content, browser memory, and device performance' },
    privacy: 'Conversion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your Word document', body: 'Select a .docx file. Mammoth.js reads its supported document content locally in your browser.' },
      { title: 'Convert', body: 'Click Convert to PDF. The tool rebuilds supported text, headings, lists, and tables in a new PDF layout.' },
      { title: 'Download and review', body: 'Download the rebuilt PDF and compare the text, tables, pagination, and layout with the source document before sharing it.' },
    ],
    faqs: [
      { q: 'Does the layout stay the same after conversion?', a: 'Not always. The browser converter rebuilds supported document structures; complex layouts, custom fonts, images, headers, footers, columns, and pagination can differ.' },
      { q: 'Can I convert .doc (old Word format) files too?', a: 'Not directly — only .docx (Word 2007 and later) is supported. Open the .doc file in Word (or a free alternative like LibreOffice) and use "Save As" to convert it to .docx first, then upload that file here.' },
      { q: 'Will custom fonts be embedded in the PDF?', a: 'Standard system fonts are always embedded. If your document uses a custom font that is not installed, it may be substituted with a similar font.' },
      { q: 'Is there a page limit?', a: 'There is no account-tier page entitlement for this local tool. Practical capacity depends on document complexity, browser memory, and device performance.' },
      { q: 'Is my Word document sent to a document-processing route?', a: 'No. The conversion runs locally in your browser.' },
    ],
  },

  'pdf-to-word': {
    toolSlug: 'pdf-to-word',
    whatIs: [
      'What is a PDF to Word converter?',
      'This PDF to Word tool extracts text locally, sends up to 60,000 characters to AI to draft structured HTML, and packages the result as an editable DOCX. It does not extract source images or reproduce the original page layout.',
      `The generated document can be edited in compatible word processors, but headings, lists, tables, and wording can be reconstructed incorrectly. ${AI_ACCURACY_DISCLAIMER}`,
    ],
    users: [
      { who: 'Editors & copywriters', why: 'Convert a client\'s locked PDF into a Word document to make tracked-changes edits and return a revised version.' },
      { who: 'Legal & contract teams', why: 'Extract clauses from received PDF contracts into Word so they can be reviewed, redlined, and compared with other versions.' },
      { who: 'Business professionals', why: 'Update outdated reports, data sheets, or policy documents received as PDFs without retyping the entire content.' },
      { who: 'Researchers & academics', why: 'Convert published PDFs into editable Word documents to extract quotes, reorganise sections, or incorporate into a larger document.' },
    ],
    related: [
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'pdf-editor', label: 'Edit the PDF directly instead' },
      { slug: 'pdf-ocr', label: 'Extract text from scanned PDFs' },
      { slug: 'pdf-annotate', label: 'Annotate the PDF without converting' },
    ],
    formats: { input: ['PDF'], output: ['DOCX'], limit: 'Up to 60,000 extracted text characters per conversion for Free and Pro' },
    privacy: 'Text is extracted from the PDF locally. The conversion route receives that extracted text, rather than the original PDF, to generate the Word document.',
    steps: [
      { title: 'Upload your PDF', body: 'Drag your PDF onto the page or click to select it. Processing happens in your browser.' },
      { title: 'Convert to Word', body: 'Click Convert to Word. Up to 60,000 extracted text characters are sent to AI to draft headings, paragraphs, lists, and tables.' },
      { title: 'Download and edit', body: 'Download the .docx file and open it in Microsoft Word, Google Docs, or LibreOffice to make edits.' },
    ],
    faqs: [
      { q: 'Will the formatting be preserved in the Word file?', a: 'No. AI drafts new structure from extracted text. Headings, emphasis, lists, and tables can differ, and the source page layout is not reproduced.' },
      { q: 'Can I convert a scanned PDF to Word?', a: 'For scanned PDFs (image-only), use our PDF OCR tool first to extract the text, then convert to Word.' },
      { q: 'What Word format does the output use?', a: 'The output is a .docx file compatible with Microsoft Word 2007 and later, Google Docs, LibreOffice, and all modern word processors.' },
      { q: 'Are images in the PDF included in the Word document?', a: 'No. This conversion sends extracted text to AI and does not extract or embed source PDF images.' },
      { q: 'Is the PDF sent to a server for conversion?', a: 'Text is extracted from the PDF locally. The conversion route receives that extracted text, rather than the original PDF, to generate the Word document.' },
      { q: 'Do I need an account, and is it free?', a: AI_ACCESS_SUMMARY },
      { q: 'Should I check the converted document before using it?', a: 'Yes. The AI rebuilds the document structure from extracted text, and can occasionally misjudge heading levels, list formatting, or table layout. Review the .docx output — especially for contracts, forms, or anything you plan to submit — before relying on it.' },
    ],
  },

  'pdf-to-excel': {
    toolSlug: 'pdf-to-excel',
    whatIs: [
      'What is a PDF to Excel converter?',
      'This PDF to Excel tool sends up to 60,000 extracted text characters to AI to propose spreadsheet sheets, rows, and columns. The output is editable, but table structure and values require review.',
      `PDF to Excel can help turn extracted document text into rows and columns for further work. Table boundaries, merged cells, number formats, and faint characters can be misread. ${AI_ACCURACY_DISCLAIMER}`,
    ],
    users: [
      { who: 'Finance & accounting teams', why: 'Extract financial tables from bank statements, invoices, and quarterly reports into Excel for reconciliation and analysis.' },
      { who: 'Data analysts & researchers', why: 'Convert datasets published as PDF tables into spreadsheets for statistical analysis, charts, and pivot tables.' },
      { who: 'Procurement & supply chain', why: 'Pull price lists, product catalogues, and inventory tables from supplier PDFs into spreadsheets for comparison.' },
      { who: 'Sales & operations teams', why: 'Extract pipeline, performance, or logistics data from PDF reports into Excel to build dashboards and track trends.' },
    ],
    related: [
      { slug: 'excel-to-pdf', label: 'Convert Excel back to PDF' },
      { slug: 'pdf-to-word', label: 'Convert PDF to Word' },
      { slug: 'pdf-ocr', label: 'Extract text from scanned tables' },
      { slug: 'pdf-summarizer', label: 'Summarise a PDF document' },
    ],
    formats: { input: ['PDF'], output: ['XLSX'], limit: 'Up to 60,000 extracted text characters per conversion for Free and Pro' },
    privacy: 'Text is extracted from the PDF locally. The conversion route receives that extracted text, rather than the original PDF, to generate the spreadsheet.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF containing the table or spreadsheet data you want to extract.' },
      { title: 'Convert to Excel', body: 'Click Convert. The tool detects tables and structured data in the PDF and maps them to rows and columns in a .xlsx spreadsheet.' },
      { title: 'Download and work with the data', body: 'Open the .xlsx file in Excel or Google Sheets. Data is ready for sorting, filtering, and analysis.' },
    ],
    faqs: [
      { q: 'Does it accurately extract tables from PDFs?', a: 'Results are generally easier to review when the source has searchable text and clear tables. Merged cells, scans, multi-column layouts, and faint numbers can require correction.' },
      { q: 'Can it convert multiple tables from one PDF?', a: 'AI can propose multiple sheets from the extracted text, but it may combine, split, omit, or misalign data sections. Review the workbook.' },
      { q: 'What Excel format is the output?', a: 'The output is a .xlsx file compatible with Microsoft Excel 2007 and later, Google Sheets, and LibreOffice Calc.' },
      { q: 'What if my PDF is a scanned image?', a: 'Use our PDF OCR tool first to convert the scan to searchable text, then convert to Excel.' },
      { q: 'Is my file kept private?', a: 'Text is extracted from the PDF locally. The conversion route receives that extracted text, rather than the original PDF, to generate the spreadsheet.' },
      { q: 'Do I need an account, and is it free?', a: AI_ACCESS_SUMMARY },
      { q: 'Should I check the spreadsheet before using it?', a: 'Yes. The AI maps detected table structure into rows and columns, and can occasionally misalign a merged cell or misread a faint number. Review the figures — especially for financial or reporting use — before relying on them.' },
    ],
  },

  'pdf-to-images': {
    toolSlug: 'pdf-to-images',
    whatIs: [
      'What is a PDF to image converter?',
      'A PDF to image converter renders each page of a PDF as a separate image file — JPG, PNG, or WEBP. This is the standard way to use PDF content on the web, in presentations, or in design software that does not support PDFs natively, such as image editors, CMS platforms, or social media schedulers.',
      'PDF pages converted to images retain the exact visual appearance of the original: typography, diagrams, photographs, and layout all carry over faithfully. EditPDF AI renders pages using PDF.js directly in your browser, so no document data is transmitted to a server — useful when the PDF contains sensitive or proprietary content.',
    ],
    users: [
      { who: 'Web designers & developers', why: 'Convert PDF mockups or design specifications into PNGs to embed in websites, wikis, or project management tools.' },
      { who: 'Marketing & social media teams', why: 'Turn PDF slide decks and infographics into individual images for posting on LinkedIn, Instagram, or Canva.' },
      { who: 'Educators & presenters', why: 'Extract specific pages from a PDF as high-resolution images to embed in slide presentations or e-learning platforms.' },
      { who: 'Publishers & content creators', why: 'Convert PDF book covers, brochure pages, or catalogue pages into web-optimised images for online storefronts.' },
    ],
    related: [
      { slug: 'image-to-pdf', label: 'Convert images back to PDF' },
      { slug: 'pdf-cropper', label: 'Crop PDF pages before converting' },
      { slug: 'pdf-compressor', label: 'Compress the PDF first' },
      { slug: 'pdf-to-ppt', label: 'Convert PDF to PowerPoint' },
      { slug: 'extract-pdf-images', label: 'Extract only the embedded images' },
    ],
    formats: { input: ['PDF'], output: ['JPG', 'PNG', 'WEBP'], limit: 'No fixed application limit; practical capacity depends on page count, render scale, browser memory, and device performance' },
    privacy: 'Rendering uses PDF.js entirely in your browser — no document data leaves your device.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want to convert to images. Every page will become a separate image file.' },
      { title: 'Choose image format and quality', body: 'Pick JPG, PNG, or WEBP output. Set the resolution (DPI) — 150 DPI for screens, 300 DPI for printing.' },
      { title: 'Download the images', body: 'Each PDF page downloads as an individual image. Download them one by one or all at once as a ZIP archive.' },
    ],
    faqs: [
      { q: 'What image formats can I export PDF pages to?', a: 'JPG, PNG, and WEBP are all supported. PNG is best for documents with text; JPG is best for smaller file sizes.' },
      { q: 'What resolution are the output images?', a: 'You can choose the DPI (dots per inch). 150 DPI is good for screens and presentations; 300 DPI is suitable for printing.' },
      { q: 'Can I convert just one page of a PDF to an image?', a: 'Yes. After uploading, select only the pages you want to convert. Unselected pages are skipped.' },
      { q: 'Will text in the PDF be sharp in the image?', a: 'Yes, text is rasterised at the resolution you choose. Higher DPI values produce sharper text at the cost of larger file sizes.' },
      { q: 'Is conversion done in the browser?', a: 'Yes. PDF rendering uses PDF.js entirely in your browser. No data leaves your device.' },
    ],
  },

  'pdf-to-ppt': {
    toolSlug: 'pdf-to-ppt',
    whatIs: [
      'What is a PDF to PowerPoint converter?',
      'The PDF to PowerPoint tool extracts document text, sends a limited text portion to AI to generate a title and slide outline, then builds a new .pptx presentation. It does not reproduce each PDF page or preserve the original visual layout.',
      'This is the fastest way to repurpose an existing PDF report or brochure into a presentation format — whether to add speaker notes, insert transition animations, or share with an audience that expects a .pptx file. It is also useful for clients who need to customise a presentation they received as a locked PDF.',
    ],
    users: [
      { who: 'Business consultants & analysts', why: 'Convert a client deliverable PDF into a .pptx so the client can add branding, notes, and animations for their internal presentations.' },
      { who: 'Educators & trainers', why: 'Convert a PDF course handout into slides to present on a projector while adding interactive elements in PowerPoint.' },
      { who: 'Marketing teams', why: 'Transform a PDF product brochure or annual report into a slidedeck for sales pitches and investor meetings.' },
      { who: 'Conference speakers', why: 'Convert submitted PDF papers into a slide format to present findings to the audience in a more visual way.' },
    ],
    related: [
      { slug: 'ppt-to-pdf', label: 'Convert PowerPoint back to PDF' },
      { slug: 'pdf-to-images', label: 'Export PDF pages as images' },
      { slug: 'pdf-to-word', label: 'Convert PDF to Word' },
      { slug: 'pdf-summarizer', label: 'Summarise the PDF content' },
    ],
    formats: { input: ['PDF'], output: ['PPTX'], limit: 'Up to 55,000 extracted text characters and the slide count selected in the interface' },
    privacy: 'Text is extracted from the PDF locally. The conversion route receives that extracted text, rather than the original PDF, to generate the slide deck.',
    steps: [
      { title: 'Upload your PDF', body: 'Select a PDF with extractable text. The browser extracts text for the AI-assisted conversion.' },
      { title: 'Generate a slide outline', body: 'Choose a slide count and theme. Up to 55,000 extracted text characters are sent to AI to draft a title and slide structure.' },
      { title: 'Download and present', body: 'Open the .pptx file in PowerPoint, Google Slides, or Keynote. Add animations, speaker notes, or edit the layout.' },
    ],
    faqs: [
      { q: 'Will the PDF layout be preserved in PowerPoint?', a: 'No. This tool drafts a new presentation from extracted text and the selected theme; it does not reproduce PDF pages or their visual layout.' },
      { q: 'How much source content is used?', a: 'The AI route receives up to 55,000 extracted text characters. Content beyond that point is not included in the request.' },
      { q: 'Can I edit the text in PowerPoint after conversion?', a: 'Yes. The generated headings and bullet points are PowerPoint text elements, but they are AI-generated and must be reviewed against the source.' },
      { q: 'What PowerPoint format is the output?', a: 'The output is a .pptx file compatible with PowerPoint 2007+, Google Slides, and LibreOffice Impress.' },
      { q: 'Is my PDF processed on a server?', a: 'Text is extracted from the PDF locally. The conversion route receives that extracted text, rather than the original PDF, to generate the slide deck.' },
      { q: 'Do I need an account, and is it free?', a: `A free account is required for this AI-assisted conversion and includes ${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day across AI tools. Pro removes the daily cap; tool-specific limits still apply.` },
    ],
  },

  'excel-to-pdf': {
    toolSlug: 'excel-to-pdf',
    whatIs: [
      'What is an Excel to PDF converter?',
      'This Excel to PDF converter reads displayed cell values from .xlsx, .xls, or .csv input and creates a newly styled table PDF for each non-empty sheet. It does not reproduce workbook charts, images, formulas, merged-cell layout, or original formatting.',
      'Sharing spreadsheets as PDFs can make financial reports, budgets, schedules, and invoices easier to read and print without exposing editable spreadsheet cells. EditPDF AI converts the file locally in your browser.',
    ],
    users: [
      { who: 'Finance & accounting teams', why: 'Convert budget spreadsheets, P&L statements, and management accounts into PDFs for board packs and audit submissions.' },
      { who: 'Project managers', why: 'Share project timelines, resource plans, and Gantt charts as PDFs that look identical on every recipient\'s screen.' },
      { who: 'Small businesses & freelancers', why: 'Convert invoice spreadsheets to PDF before sending to clients so the layout is fixed and the figures cannot be altered.' },
      { who: 'Sales & operations teams', why: 'Distribute price lists, inventory reports, and KPI dashboards as PDFs for meetings and customer-facing communications.' },
    ],
    related: [
      { slug: 'pdf-to-excel', label: 'Convert PDF back to Excel' },
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'ppt-to-pdf', label: 'Convert PowerPoint to PDF' },
      { slug: 'pdf-compressor', label: 'Compress the converted PDF' },
    ],
    formats: { input: ['XLSX', 'XLS', 'CSV'], output: ['PDF'], limit: 'Practical capacity depends on row and column counts, browser memory, and device performance' },
    privacy: 'Conversion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your spreadsheet', body: 'Select a .xlsx, .xls, or .csv file. The tool reads displayed cell values from each non-empty sheet.' },
      { title: 'Choose a sheet and layout', body: 'Preview a sheet, then choose portrait or landscape orientation and one of the provided table colour schemes.' },
      { title: 'Download the PDF', body: 'Generate a separate, newly styled table PDF for one sheet or download PDFs for all parsed sheets.' },
    ],
    faqs: [
      { q: 'Does the Excel formatting carry over to the PDF?', a: 'No. The output uses a newly generated table layout and selected colour scheme. Original cell colours, fonts, merges, charts, images, and worksheet layout are not reproduced.' },
      { q: 'Are all sheets in the workbook converted?', a: 'Each parsed non-empty worksheet can be downloaded as its own PDF, or all sheet PDFs can be generated in one operation.' },
      { q: 'Can I convert .xls (older Excel format) files?', a: 'Yes. Both .xlsx (Excel 2007+) and the older .xls format are supported.' },
      { q: 'Are charts and graphs included?', a: 'No. The converter reads cell values and does not render embedded charts, drawings, or images.' },
      { q: 'Is my spreadsheet sent to a server?', a: 'The conversion runs locally in your browser without an application document-processing request.' },
    ],
  },

  'ppt-to-pdf': {
    toolSlug: 'ppt-to-pdf',
    whatIs: [
      'What is a PowerPoint to PDF converter?',
      'This PowerPoint to PDF converter reads text from supported .pptx slide XML and creates a newly styled PDF page for each slide. It does not reproduce slide images, backgrounds, charts, animations, or the original layout.',
      'The result is a text-focused sharing copy. Review every page before use because unsupported presentation content is omitted.',
    ],
    users: [
      { who: 'Teachers & professors', why: 'Share lecture slides with students as PDFs that can be annotated and printed without requiring PowerPoint or a Microsoft licence.' },
      { who: 'Business & sales teams', why: 'Distribute pitch decks and product presentations to prospects as PDFs that cannot be altered and open correctly on any device.' },
      { who: 'Conference speakers', why: 'Submit presentations to conference organisers in the PDF format required by most academic and professional events.' },
      { who: 'Marketing & design teams', why: 'Convert branded presentation templates to PDF for sharing with clients or printing as brochures and handouts.' },
    ],
    related: [
      { slug: 'pdf-to-ppt', label: 'Convert PDF back to PowerPoint' },
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'excel-to-pdf', label: 'Convert spreadsheets to PDF' },
      { slug: 'pdf-to-images', label: 'Export PDF slides as images' },
    ],
    formats: { input: ['PPTX'], output: ['PDF'], limit: 'Practical capacity depends on slide count, extracted text, browser memory, and device performance' },
    privacy: 'Conversion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your presentation', body: 'Select a supported .pptx file. The tool reads text from its slide XML.' },
      { title: 'Convert', body: 'Click Convert to PDF. The tool creates a newly styled PDF page for each parsed slide using its extracted title and text.' },
      { title: 'Download and share', body: 'Download the PDF and share it with anyone — no PowerPoint needed for recipients to view it.' },
    ],
    faqs: [
      { q: 'Are animations included in the PDF?', a: 'No. Animations and transitions are not included, and the original final visual state is not reproduced.' },
      { q: 'Will speaker notes be included?', a: 'By default, slides only are included. Notes are not rendered in the standard conversion.' },
      { q: 'Can I convert .ppt (older PowerPoint format) files?', a: 'No. The parser reads the ZIP/XML structure used by .pptx files; legacy binary .ppt files are not supported.' },
      { q: 'Are embedded images and charts preserved?', a: 'No. The converter extracts slide text and omits images, charts, SmartArt, backgrounds, and other visual elements.' },
      { q: 'Is my file sent to a server?', a: 'The conversion runs locally in your browser without an application document-processing request.' },
    ],
  },

  'html-to-pdf': {
    toolSlug: 'html-to-pdf',
    whatIs: [
      'What is an HTML to PDF converter?',
      'An HTML to PDF converter renders supported HTML content in the browser and captures it into an image-based PDF. Remote assets, scripts, fonts, responsive layout, and pagination can differ from the original page.',
      'This page is useful for turning a pasted HTML snippet or a local HTML template into a downloadable reference copy. The result is a browser-rendered image of supported content, so inspect remote assets, fonts, page breaks, and complex styling before use.',
    ],
    users: [
      { who: 'Developers & technical teams', why: 'Preview and export supported invoice, order-confirmation, or certificate HTML templates as image-based PDFs.' },
      { who: 'Content creators', why: 'Turn self-contained article markup or a saved local HTML document into a PDF reference copy.' },
      { who: 'Marketing & data teams', why: 'Export supported report or visualization markup after checking that remote assets and complex styles render correctly.' },
      { who: 'Educators', why: 'Convert locally saved course-material or worksheet HTML into a printable PDF after reviewing pagination.' },
    ],
    related: [
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'pdf-compressor', label: 'Compress the generated PDF' },
      { slug: 'pdf-editor', label: 'Edit the generated PDF' },
      { slug: 'pdf-annotate', label: 'Annotate the PDF with notes' },
    ],
    formats: { input: ['HTML'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on HTML complexity, browser memory, and device performance' },
    privacy: 'Conversion runs entirely in your browser — nothing is uploaded to a server.',
    steps: [
      { title: 'Paste or upload HTML', body: 'Paste HTML markup or upload one local .html or .htm file, then check the browser preview.' },
      { title: 'Configure the output', body: 'Choose A4, Letter, or Legal page size, portrait or landscape orientation, margins, and render scale.' },
      { title: 'Convert and review', body: 'Click Convert to PDF, then review the image-based output for pagination, missing remote assets, font substitutions, and layout changes.' },
    ],
    faqs: [
      { q: 'Does it support CSS and JavaScript?', a: 'The preview uses the browser, while PDF capture uses html2canvas. Supported CSS can render, but complex or unsupported styles may differ. Script-generated content is not guaranteed to execute or appear.' },
      { q: 'Can I convert a webpage by pasting its URL?', a: 'No. This interface accepts pasted HTML markup or one local .html or .htm file; it does not fetch a webpage from a URL.' },
      { q: 'What page sizes are available?', a: 'You can choose A4, US Letter, or Legal, select portrait or landscape orientation, and configure margins and render scale.' },
      { q: 'Are embedded or remote images included?', a: 'Base64 images and remote images that permit browser cross-origin access can render. Blocked, unavailable, or unsupported remote assets may be omitted.' },
      { q: 'Is the HTML sent through a document-processing route?', a: 'No. Preview, capture, and PDF generation run in the browser. The page loads html2canvas and jsPDF from configured CDN URLs.' },
    ],
  },

  'txt-to-pdf': {
    toolSlug: 'txt-to-pdf',
    whatIs: [
      'What is a TXT to PDF converter?',
      'A TXT to PDF converter takes a plain-text (.txt) file and lays out its content as a formatted PDF document with your chosen font, size, line spacing, and margins. Plain text files have no visual formatting, so the converter applies a clean, professional layout that can be printed, shared, or archived as a standard PDF.',
      'The most common use cases are converting log files, code outputs, raw notes, and exported data files into a shareable format. EditPDF AI converts text files entirely in your browser — the plain text content never leaves your device.',
    ],
    users: [
      { who: 'Writers & bloggers', why: 'Convert plain-text drafts or exported notes from writing apps (iA Writer, Obsidian, Notion) into well-formatted PDFs to share with editors.' },
      { who: 'Developers & system admins', why: 'Convert log files, script outputs, and configuration exports into PDF reports for documentation or client delivery.' },
      { who: 'Students & researchers', why: 'Turn plain-text notes and bibliography files into clean PDFs for submission or sharing with supervisors.' },
      { who: 'Data & operations teams', why: 'Convert exported .txt data reports into a presentable PDF format for stakeholder distribution.' },
    ],
    related: [
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'odt-to-pdf', label: 'Convert OpenDocument files to PDF' },
      { slug: 'rtf-to-pdf', label: 'Convert RTF documents to PDF' },
      { slug: 'pdf-editor', label: 'Edit the generated PDF' },
      { slug: 'html-to-pdf', label: 'Convert pasted or uploaded HTML to PDF' },
    ],
    formats: { input: ['TXT'], output: ['PDF'], limit: 'No fixed application limit; long files are paginated and practical capacity depends on browser memory' },
    privacy: 'The conversion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your text file', body: 'Select a plain .txt file. The text content is read and laid out for PDF output.' },
      { title: 'Set font and layout', body: 'Choose the font, font size, line spacing, and margins. Preview updates instantly.' },
      { title: 'Convert and download', body: 'Click Convert to PDF. Your text document becomes a properly formatted PDF file.' },
    ],
    faqs: [
      { q: 'What font options are available?', a: 'Standard PDF fonts are available including Helvetica, Times Roman, and Courier (monospace). These are embedded in all PDF viewers.' },
      { q: 'Is the text encoding preserved correctly?', a: 'Yes. UTF-8 encoded files are read correctly, so accented characters and most international scripts are handled.' },
      { q: 'Can I convert multiple .txt files into one PDF?', a: 'Yes. Upload multiple .txt files and they are combined into a single PDF with each file starting on a new page.' },
      { q: 'Does it support long documents?', a: 'Yes. Long text files are paginated automatically based on the font size, line spacing, and margin settings you choose.' },
      { q: 'Is conversion done in the browser?', a: 'Yes. The conversion runs locally in your browser without an application document-processing request.' },
    ],
  },

  'odt-to-pdf': {
    toolSlug: 'odt-to-pdf',
    whatIs: [
      'What is an ODT to PDF converter?',
      'This ODT converter parses supported headings, paragraphs, lists, tables, and text boxes from OpenDocument XML and rebuilds them in a new PDF layout. Original fonts, images, headers, footers, and page layout are not reproduced.',
      'The resulting text-focused PDF can be opened without LibreOffice, but it should be reviewed against the source document before sharing.',
    ],
    users: [
      { who: 'LibreOffice & open-source users', why: 'Convert ODT documents into PDFs to share with colleagues or clients who use Windows and Microsoft Office.' },
      { who: 'Educators in open-source environments', why: 'Convert course materials and worksheets created in LibreOffice to PDF for distribution to students on any platform.' },
      { who: 'NGOs & non-profits', why: 'Convert documents created in free, open-source software to PDF for grant submissions, reports, and official correspondence.' },
      { who: 'Writers & authors', why: 'Convert manuscripts and documents from LibreOffice Writer to PDF for submission to publishers, agents, or competitions.' },
    ],
    related: [
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'rtf-to-pdf', label: 'Convert RTF documents to PDF' },
      { slug: 'txt-to-pdf', label: 'Convert plain text to PDF' },
      { slug: 'pdf-compressor', label: 'Compress the converted PDF' },
    ],
    formats: { input: ['ODT'], output: ['PDF'], limit: 'Practical capacity depends on document complexity, extracted content, browser memory, and device performance' },
    privacy: 'Conversion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your ODT file', body: 'Select your .odt file created in LibreOffice Writer or any OpenDocument compatible application.' },
      { title: 'Convert to PDF', body: 'Click Convert. Supported headings, paragraphs, lists, tables, and text boxes are rebuilt in a new PDF layout.' },
      { title: 'Download and review', body: 'Download the PDF and compare it with the source because unsupported styling and content are omitted.' },
    ],
    faqs: [
      { q: 'What is an ODT file?', a: 'ODT (OpenDocument Text) is the default format for LibreOffice Writer and other open-source word processors. It is an ISO standard format.' },
      { q: 'Are tables and images preserved?', a: 'Supported table text is rebuilt as table blocks. Embedded images, headers, footers, original fonts, and source page layout are not reproduced.' },
      { q: 'Can I convert .ods (OpenDocument Spreadsheet) or .odp (Presentation) files?', a: 'Those formats require a different conversion. Use Excel to PDF for spreadsheets and PPT to PDF for presentations.' },
      { q: 'Will custom fonts in the ODT appear correctly?', a: 'No. The generated PDF uses the converter\'s standard embedded fonts rather than the ODT document\'s custom fonts.' },
      { q: 'Is my ODT file processed in the browser?', a: 'Yes. Conversion runs locally in your browser without an application document-processing request.' },
    ],
  },

  'rtf-to-pdf': {
    toolSlug: 'rtf-to-pdf',
    whatIs: [
      'What is an RTF to PDF converter?',
      'This RTF converter extracts supported plain text, strips RTF formatting controls and embedded objects, and creates a newly formatted PDF using the page, font-size, and line-spacing settings you choose.',
      'The result is a text-focused PDF rather than a visual reproduction of the source RTF. Review it before filing, publishing, or sharing it.',
    ],
    users: [
      { who: 'Legal teams & law firms', why: 'Convert RTF documents exported from court management and case management systems into PDF for filing, sharing, and archiving.' },
      { who: 'Businesses with legacy systems', why: 'Convert RTF output from older CRM, ERP, or billing systems into PDF for professional client-facing documents.' },
      { who: 'Writers & editors', why: 'Convert RTF manuscripts and drafts into PDF for submission to publishers, agents, or beta readers who prefer a fixed format.' },
      { who: 'Medical & clinical teams', why: 'Convert RTF reports from clinical software and dictation systems into PDF for electronic health records and referral letters.' },
    ],
    related: [
      { slug: 'odt-to-pdf', label: 'Convert OpenDocument files to PDF' },
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'pdf-editor', label: 'Edit the generated PDF' },
      { slug: 'pdf-compressor', label: 'Compress the converted PDF' },
    ],
    formats: { input: ['RTF'], output: ['PDF'], limit: 'Practical capacity depends on extracted text length, browser memory, and device performance' },
    privacy: 'Conversion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your RTF file', body: 'Select your .rtf (Rich Text Format) document. RTF files are compatible with virtually all word processors.' },
      { title: 'Convert to PDF', body: 'Click Convert. Extracted text is paginated using the page size, font size, and line spacing you selected.' },
      { title: 'Download the PDF', body: 'Your PDF is ready to download and share without needing any word processing software.' },
    ],
    faqs: [
      { q: 'What is an RTF file?', a: 'RTF (Rich Text Format) is a document format developed by Microsoft that is supported by virtually all word processors including Word, Google Docs, and LibreOffice.' },
      { q: 'Is text formatting preserved?', a: 'No. The parser extracts supported text and strips RTF formatting controls; the PDF uses the formatting selected in this tool.' },
      { q: 'Can I convert large RTF files?', a: 'Practical capacity depends on extracted text length, browser memory, and device performance.' },
      { q: 'Are images in the RTF file included in the PDF?', a: 'No. RTF picture and shape groups are ignored by the text extractor.' },
      { q: 'Is conversion handled in the browser?', a: 'Yes. Conversion runs locally in your browser without an application document-processing request.' },
    ],
  },

  'pdf-ocr': {
    toolSlug: 'pdf-ocr',
    whatIs: [
      'What is PDF OCR?',
      'PDF OCR (Optical Character Recognition) analyses page images inside a scanned PDF and extracts the text they contain. A scan often has no selectable or searchable text. OCR reads the rendered page image, identifies characters, and can produce extracted text or a searchable PDF for review.',
      'Use OCR when a PDF contains page images instead of a searchable text layer. The interface offers automatic language detection plus English, French, German, Spanish, Arabic, Chinese, and Japanese language hints.',
    ],
    users: [
      { who: 'Students & academics', why: 'Make scanned textbook chapters, journal articles, and reading materials searchable so you can Ctrl+F for specific terms and quotes.' },
      { who: 'Legal & compliance teams', why: 'Convert scanned contracts, court documents, and historical records into searchable PDFs for fast reference and compliance audits.' },
      { who: 'Archivists & historians', why: 'Digitise paper records, old newspapers, and historical documents into searchable text so their contents can be indexed and retrieved.' },
      { who: 'Accounts & data entry teams', why: 'Convert scanned invoices and receipts into machine-readable text for automatic extraction into accounting or ERP systems.' },
    ],
    related: [
      { slug: 'scan-to-pdf', label: 'Scan a paper document first with your camera' },
      { slug: 'pdf-summarizer', label: 'Summarise the extracted text' },
      { slug: 'pdf-to-word', label: 'Convert the PDF to editable Word' },
      { slug: 'pdf-translator', label: 'Translate the PDF to another language' },
      { slug: 'pdf-redactor', label: 'Redact sensitive information' },
    ],
    formats: { input: ['PDF'], output: ['Searchable PDF', 'TXT'], limit: 'AI OCR is metered per processed page; request-size and model output limits apply to Free and Pro' },
    privacy: 'PDF pages are rendered to images locally, and those page images are sent through the AI OCR route. The application code does not persist them in its database or object storage; processing-provider handling also applies.',
    steps: [
      { title: 'Upload a scanned PDF', body: 'Select a PDF containing scanned pages or photographed document images — the file itself must be a PDF.' },
      { title: 'Run OCR', body: 'Choose automatic detection or one of the seven named language hints, then process the pages that need OCR.' },
      { title: 'Review and download', body: 'Compare the recognized text with the page image, correct errors, then copy it or download TXT or a searchable PDF.' },
    ],
    faqs: [
      { q: 'Which language options are available for PDF OCR?', a: 'The interface offers automatic language detection plus English, French, German, Spanish, Arabic, Chinese, and Japanese hints. A selected hint tells the AI route which language to expect.' },
      { q: 'Can PDF OCR make a scanned document searchable?', a: 'Yes. The downloaded searchable PDF uses a rendered copy of each source page as its background and adds recognized text as a near-invisible text layer. Review search and copy behavior in your target PDF viewer.' },
      { q: 'How accurate is AI PDF OCR?', a: `Accuracy varies with resolution, contrast, skew, fonts, handwriting, tables, and page complexity. ${AI_ACCURACY_DISCLAIMER}` },
      { q: 'What happens to native text pages during OCR?', a: 'When native-text detection is enabled and a page already contains enough extractable text, the tool uses that text without sending the page image for an OCR AI action.' },
      { q: 'Is my scanned PDF sent to an AI server?', a: 'The original PDF is loaded locally. Pages that need AI OCR are rendered in the browser, and each rendered JPEG page image is sent through the OCR server route to the configured model provider.' },
      { q: 'Can I use PDF OCR without signing in?', a: `No. OCR is metered AI processing and requires an account. Signed-in Free includes up to ${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day across AI tools; Pro removes the daily cap.` },
    ],
  },

  'pdf-summarizer': {
    toolSlug: 'pdf-summarizer',
    whatIs: [
      'What is an AI PDF summarizer?',
      'An AI PDF summarizer uses up to 80,000 characters of locally extracted document text to generate a brief, standard, or detailed summary. Content after that limit is not sent, and the result can omit context or misstate details.',
      'Summaries can help readers triage reports, papers, contracts, and other searchable PDFs before closer review. Choose a length and focus, then compare important names, figures, dates, obligations, and conclusions with the original document.',
    ],
    users: [
      { who: 'Students & researchers', why: 'Get the key arguments of a research paper or report before deciding whether to read it in full — useful for literature reviews with dozens of sources.' },
      { who: 'Executives & business leaders', why: 'Read a one-paragraph summary of a long report or board paper to decide which sections need closer attention.' },
      { who: 'Legal professionals', why: 'Quickly extract the key clauses, obligations, and dates from a long contract before a meeting or negotiation.' },
      { who: 'Journalists & analysts', why: 'Summarise government reports, financial filings, and long-form publications to quickly identify the most newsworthy or relevant sections.' },
    ],
    related: [
      { slug: 'pdf-ocr', label: 'Extract text from a scanned PDF first' },
      { slug: 'pdf-translator', label: 'Translate the PDF to another language' },
      { slug: 'mind-map', label: 'Turn the document into a mind map' },
      { slug: 'quiz-creator', label: 'Generate a quiz from your PDF' },
      { slug: 'chat-with-pdf', label: 'Ask questions about the document instead' },
    ],
    formats: { input: ['PDF'], output: ['TXT'], limit: 'Up to 80,000 extracted text characters are sent per summary for both Free and Pro' },
    privacy: 'Up to 80,000 extracted text characters are sent through the AI route. This summarizer does not send the selected PDF bytes.',
    steps: [
      { title: 'Choose a searchable PDF', body: 'Select a PDF with extractable text. Image-only scans need OCR before summarization.' },
      { title: 'Generate a summary', body: 'Choose the length and focus. Up to 80,000 extracted text characters are sent through the AI route.' },
      { title: 'Review or save TXT', body: 'Read the structured result, verify important details against the source, then copy it or save it as a TXT file.' },
    ],
    faqs: [
      { q: 'What kind of PDF can the summarizer read?', a: 'The PDF must contain extractable text. Image-only scans need a searchable text layer from PDF OCR before this summarizer can use their content.' },
      { q: 'How much PDF text is included in one summary?', a: 'The summarization route sends at most the first 80,000 extracted text characters for both Free and Pro. Content after that limit is not included in the AI request.' },
      { q: 'Is the PDF file uploaded for summarization?', a: 'No. PDF.js extracts text locally in the browser. Up to 80,000 extracted text characters, the selected focus and length, and the filename are sent through the AI summarization route; the selected PDF bytes are not sent.' },
      { q: 'Can the AI summarize legal, medical, or financial PDFs?', a: 'The tool can attempt those focus modes, but the result is not professional advice. Terminology, context, figures, obligations, and other high-stakes details must be checked against the source by a qualified person.' },
      { q: 'Can I summarize a PDF without signing in?', a: `No. AI summarization requires an account. Signed-in Free includes up to ${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day across AI tools; Pro removes the daily cap.` },
      { q: 'How accurate is an AI PDF summary?', a: AI_ACCURACY_DISCLAIMER },
    ],
  },

  'pdf-translator': {
    toolSlug: 'pdf-translator',
    whatIs: [
      'What is a PDF translator?',
      'This PDF translator extracts document text, sends up to 50,000 characters to AI, and creates a newly formatted PDF or TXT file from the translation. It does not preserve the source page layout.',
      `EditPDF AI offers 77 source and target language options. Translation output can be inaccurate or omit nuance, especially with specialised terminology. ${AI_ACCURACY_DISCLAIMER}`,
    ],
    users: [
      { who: 'Global business teams', why: 'Translate supplier contracts, partner agreements, and technical specifications received in a foreign language for internal review.' },
      { who: 'Students & academics', why: 'Translate foreign-language research papers and journal articles to read the content in your native language.' },
      { who: 'People reviewing official documents', why: 'Create a working translation for personal review. Authorities may require a certified or otherwise approved translation.' },
      { who: 'Researchers & NGOs', why: 'Translate policy documents, reports, and fieldwork findings from local languages into English for international publication.' },
    ],
    related: [
      { slug: 'pdf-ocr', label: 'Extract text from a scanned PDF' },
      { slug: 'pdf-summarizer', label: 'Summarise the translated document' },
      { slug: 'pdf-annotate', label: 'Add translation notes to the PDF' },
      { slug: 'pdf-to-word', label: 'Convert the PDF to Word for editing' },
      { slug: 'chat-with-pdf', label: 'Ask questions about the document instead' },
    ],
    formats: { input: ['PDF'], output: ['PDF', 'TXT'], limit: 'Up to 50,000 extracted text characters are sent per translation for both Free and Pro' },
    privacy: 'Extracted text is sent through the AI translation route; this tool does not send the selected PDF bytes. The application does not persist extracted text in its database or object storage; processing-provider handling also applies.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want translated. The document\'s text content is extracted for translation.' },
      { title: 'Choose target language', body: 'Select from 77 source and target language options. AI translates the extracted text up to the route limit.' },
      { title: 'Download the result', body: 'Download the translated text as a newly formatted PDF or a TXT file. The original PDF layout is not reproduced.' },
    ],
    faqs: [
      { q: 'How many languages are supported?', a: 'The translator offers 77 source and target languages, including English, Spanish, French, German, Portuguese, Arabic, Chinese, Japanese, Korean, Hindi, and more.' },
      { q: 'Does the translated PDF keep the original layout?', a: 'No. The downloaded PDF uses a new text layout with a translation heading, source filename, and paginated translated text.' },
      { q: 'How is the translation quality?', a: AI_ACCURACY_DISCLAIMER },
      { q: 'Can it translate technical or legal documents?', a: 'It can attempt specialised text, but terminology and meaning require careful review. Do not treat the output as a certified translation or rely on it without qualified review for high-stakes use.' },
      { q: 'Is my document sent to a server for translation?', a: 'Extracted text is sent through the AI route to the configured model provider. The selected PDF bytes are not sent by this translation tool.' },
      { q: 'Do I need to create an account to translate a PDF?', a: AI_ACCESS_SUMMARY },
    ],
  },

  'pdf-redactor': {
    toolSlug: 'pdf-redactor',
    whatIs: [
      'What does this PDF redaction marker do?',
      'This browser tool places opaque rectangles over areas you select and saves those marks into a new PDF copy. The implementation does not remove underlying text, images, metadata, or other PDF objects, so the output must not be treated as securely redacted.',
      'Use the tool for visible covering or review markup. For confidential, legal, regulatory, or public-release documents, use a verified content-removing redaction workflow and inspect the final file before sharing it.',
    ],
    users: [
      { who: 'Document reviewers', why: 'Mark areas that need attention or removal before a separate, verified redaction workflow.' },
      { who: 'Design and layout teams', why: 'Create a visibly covered review copy when testing how redaction bars affect a page layout.' },
      { who: 'Teachers and trainers', why: 'Hide answer areas in a visual practice copy that is not used to protect confidential information.' },
      { who: 'Personal document users', why: 'Cover non-sensitive details in a visual copy while keeping the original file unchanged.' },
    ],
    related: [
      { slug: 'pdf-password-lock', label: 'Password-protect a marked PDF copy' },
      { slug: 'pdf-watermark', label: 'Add a confidential watermark' },
      { slug: 'pdf-editor', label: 'Edit the PDF before adding cover boxes' },
      { slug: 'pdf-ocr', label: 'Extract text from a scanned PDF for review' },
      { slug: 'remove-pdf-links', label: 'Disable links without redacting text' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Adding cover boxes, including rule-based pattern detection, runs locally in your browser without an application document-processing request. The tool does not remove underlying PDF objects.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF on which you want to place visible opaque marks.' },
      { title: 'Draw and review cover boxes', body: 'Draw boxes over selected areas and inspect every page. Pattern matching can suggest supported text patterns, but it is not AI and may miss content.' },
      { title: 'Apply and download', body: 'Apply the boxes and download the visibly marked copy. Use a separate verified redaction tool when underlying data must be removed.' },
    ],
    faqs: [
      { q: 'Does this tool permanently remove the covered content?', a: 'No. It draws opaque rectangles into a new PDF copy but does not remove underlying text, images, metadata, or other PDF objects. Use dedicated, verified redaction software for confidential disclosure.' },
      { q: 'Does AI decide what to cover?', a: 'No. The optional scanner uses local pattern-matching rules for supported formats such as email addresses and phone numbers. You must review the page and choose every area yourself.' },
      { q: 'Does it securely redact scanned PDFs?', a: 'No. A box can visually cover part of a scanned page, but the tool does not remove the underlying image data. Use a verified image-redaction workflow when pixels must be removed.' },
      { q: 'Can I place a box over images as well as text?', a: 'Yes. You can draw an opaque box over any visible page area, including an image, but the original PDF object may remain in the file.' },
      { q: 'Is the selected PDF sent to a document-processing route?', a: 'No. The cover-box workflow runs locally in your browser without an application document-processing request.' },
    ],
  },

  'pdf-annotate': {
    toolSlug: 'pdf-annotate',
    whatIs: [
      'What is a PDF annotator?',
      'A PDF annotator lets you add notes, highlights, drawings, stamps, and text comments to a PDF. Annotations are saved using standard PDF structures intended to appear in compatible desktop, browser, and mobile viewers.',
      'Annotation is the primary way professionals review, mark up, and collaborate on PDF documents. A legal team marks up a contract with comments on specific clauses. A teacher circles errors on a student\'s work. An editor highlights passages to cut or expand. EditPDF AI\'s annotator runs entirely in the browser — your document never leaves your device.',
    ],
    users: [
      { who: 'Students & researchers', why: 'Highlight key passages, add margin notes, and bookmark important pages in textbooks, papers, and research articles.' },
      { who: 'Professionals in review workflows', why: 'Mark up reports, proposals, contracts, and design briefs with comments and corrections before returning them to the author.' },
      { who: 'Teachers & educators', why: 'Add written feedback, circle errors, and highlight strong sections on student assignments submitted as PDFs.' },
      { who: 'Design & creative teams', why: 'Annotate PDF mockups and proofs with specific change requests, sticky notes, and freehand drawings for revision rounds.' },
    ],
    related: [
      { slug: 'pdf-editor', label: 'Edit PDF text and content' },
      { slug: 'pdf-signer', label: 'Add a digital signature' },
      { slug: 'pdf-redactor', label: 'Redact sensitive sections' },
      { slug: 'pdf-form-builder', label: 'Build an interactive PDF form' },
      { slug: 'export-pdf-comments', label: 'Export your annotations as CSV or JSON' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'All annotation happens in your browser — your PDF never leaves your device.',
    steps: [
      { title: 'Upload your PDF', body: 'Open the PDF you want to annotate. It loads directly in the browser-based editor.' },
      { title: 'Add annotations', body: 'Highlight text, add sticky notes, draw freehand, insert text boxes, or use shapes from the annotation toolbar.' },
      { title: 'Save and download', body: 'Click Save. The annotations are embedded in the PDF for compatible viewers, including Adobe Reader.' },
    ],
    faqs: [
      { q: 'Are annotations visible in other PDF viewers?', a: 'Yes. Annotations are embedded as standard PDF annotation objects, so they appear in Adobe Acrobat, Preview, Chrome, and all major PDF viewers.' },
      { q: 'Can I highlight text in a scanned PDF?', a: 'Text highlighting requires a PDF with a selectable text layer. For scanned documents, use our OCR tool first to add a text layer.' },
      { q: 'Can multiple people annotate the same PDF?', a: 'Currently each annotation session is independent. For collaborative review, share the annotated PDF after each session.' },
      { q: 'Can I remove annotations later?', a: 'If you save the annotated PDF, annotations are embedded and cannot be removed by standard viewers. Keep the original unannotated version if you might need to undo annotations.' },
      { q: 'Is my PDF sent to a server?', a: 'No. All annotation runs in your browser. Your PDF never leaves your device.' },
    ],
  },

  'pdf-form-builder': {
    toolSlug: 'pdf-form-builder',
    whatIs: [
      'What is a PDF form builder?',
      'A PDF form builder lets you create interactive, fillable PDF forms — with text fields, checkboxes, radio buttons, dropdowns, and signature boxes — without any design or coding skills. You can start from a blank page or upload an existing PDF and add form fields on top of it. The output is a standard fillable PDF that anyone can complete in Adobe Reader or any modern PDF viewer.',
      'Fillable PDF forms add interactive fields to a document for digital completion. Manual form building is a core browser workflow; practical page and field capacity depends on the document, browser memory, and device. The optional AI Builder requires a signed-in account and uses the daily AI allowance.',
    ],
    users: [
      { who: 'HR & recruitment teams', why: 'Build job application forms, onboarding questionnaires, and employee surveys that candidates can fill and submit digitally.' },
      { who: 'Healthcare providers', why: 'Create patient intake forms, consent forms, and medical history questionnaires as fillable PDFs for patients to complete before appointments.' },
      { who: 'Small businesses & freelancers', why: 'Build client intake forms, order forms, and service agreements that clients can complete and sign in one step.' },
      { who: 'Educators & event organisers', why: 'Create registration forms, permission slips, and feedback forms as fillable PDFs to share with students, parents, or attendees.' },
    ],
    related: [
      { slug: 'ai-pdf-form-filler', label: 'Auto-fill your PDF form with AI' },
      { slug: 'pdf-annotate', label: 'Annotate the form with comments' },
      { slug: 'pdf-signer', label: 'Add a digital signature to the form' },
      { slug: 'pdf-editor', label: 'Edit the form layout' },
      { slug: 'export-pdf-form-data', label: 'Export submitted form data' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Practical page and field capacity depends on the document, browser memory, and device performance' },
    privacy: 'Manually adding and arranging form fields runs entirely in your browser — no account or server upload required. The optional AI Builder panel is a separate, account-gated feature: your request and the current field layout are sent to AI to generate or edit fields.',
    steps: [
      { title: 'Start with a blank page or PDF', body: 'Open a blank form or upload an existing PDF as the base. The form builder works on top of your chosen background.' },
      { title: 'Add form fields', body: 'Drag and drop text inputs, checkboxes, radio buttons, dropdowns, signatures, and date fields anywhere on the page.' },
      { title: 'Export and share', body: 'Download the fillable PDF form. Anyone with a PDF viewer can fill in the fields and save or print it.' },
    ],
    faqs: [
      { q: 'Can I make an existing PDF fillable?', a: 'You can open a supported PDF and add interactive form fields over its existing page content.' },
      { q: 'What field types are supported?', a: 'Text inputs, multi-line text areas, checkboxes, radio button groups, dropdown menus, date pickers, and signature fields are all available.' },
      { q: 'Can people fill in the form without creating an account?', a: 'Yes. The output is a standard fillable PDF that anyone can open and complete in Adobe Reader, Preview, or any modern PDF viewer — no account needed.' },
      { q: 'Can I pre-fill some fields with default values?', a: 'Yes. You can set default text for any field in the form builder. The recipient sees the defaults and can overwrite them.' },
      { q: 'Is the form builder free?', a: 'Yes. Manual form building and downloading is a core browser workflow. Practical limits depend on the document and device. The optional AI Builder requires a signed-in account and counts toward the daily AI allowance.' },
      { q: 'What does the AI Builder do, and should I check its output?', a: 'The AI Builder adds or edits form fields from a plain-language description you type. It sends your request and the current field layout to AI to generate the changes. Always review the generated fields — positions, labels, and types — before sharing the form, since AI can occasionally misplace a field or misjudge its type.' },
    ],
  },

  'ai-pdf-form-filler': {
    toolSlug: 'ai-pdf-form-filler',
    whatIs: [
      'What is an AI PDF form filler?',
      'An AI PDF form filler identifies supported native fields or proposes overlay positions on flat and scanned form pages. It uses context you provide to suggest matching values, which remain subject to review and correction before download or submission.',
      `EditPDF AI can fill interactive fields locally and use AI-assisted detection for flat or scanned forms. AI workflows may send user-entered text, rendered page images, uploaded images, or a PDF through server routes. ${AI_ACCURACY_DISCLAIMER}`,
    ],
    users: [
      { who: 'Job seekers & professionals', why: 'Provide relevant CV details once and review proposed values in detected job-application or onboarding fields.' },
      { who: 'Students & academics', why: 'Review proposed values in supported enrollment, scholarship, or grant forms before submission.' },
      { who: 'Small business owners', why: 'Prepare supported registration, supplier, or tax forms while checking every value against source records.' },
      { who: 'Legal & compliance teams', why: 'Use supplied client context to propose values for supported intake forms, declarations, or applications, followed by manual review.' },
    ],
    related: [
      { slug: 'pdf-editor',      label: 'Edit and annotate your PDF manually' },
      { slug: 'pdf-signer',      label: 'Add a signature to a filled form' },
      { slug: 'pdf-ocr',         label: 'Extract text from a scanned PDF' },
      { slug: 'pdf-form-builder', label: 'Build your own fillable PDF form' },
      { slug: 'export-pdf-form-data', label: 'Export the filled field data' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'Up to 50 MB in the AI form-filler interface' },
    privacy: 'Interactive form fields can be filled locally. AI workflows may send user-entered details, rendered form pages, uploaded identity-document images, or a PDF through server routes. The application code does not write this document content to its database or object storage; processing-provider handling also applies.',
    steps: [
      { title: 'Upload a PDF form', body: 'Open a supported fillable PDF or form-style document. The tool identifies native fields and can use AI to propose positions on flat pages.' },
      { title: 'Provide your information', body: 'Paste text, upload a supported identity-document image, or type information in the chat. AI proposes values for matching detected fields.' },
      { title: 'Review and download', body: 'Check every proposed field and page, make corrections, then download the completed PDF.' },
    ],
    faqs: [
      { q: 'What information can AI propose for PDF fields?', a: 'AI can propose values for detected fields when matching information appears in the text or images you provide. Every proposed value remains editable and must be reviewed before download or submission.' },
      { q: 'Can I use an identity-document image as context?', a: 'The optional context workflow accepts supported passport, driver\'s licence, or ID images up to 5 MB. The image is sent through a server route and processing provider, so review extracted data carefully.' },
      { q: 'What if the AI fills a PDF field incorrectly?', a: `You can correct proposed fields before export. ${AI_ACCURACY_DISCLAIMER}` },
      { q: 'Can AI fill a flat or scanned PDF form?', a: 'AI can analyze rendered pages from flat or scanned forms and propose text-overlay positions. Results depend on page layout and image quality, and every field should be reviewed.' },
      { q: 'Is AI form context stored by the application?', a: 'The application code does not write document content or supplied form context to its database or object storage. Server and model-provider infrastructure process AI request data under their applicable handling and retention policies.' },
    ],
  },

  'mind-map': {
    toolSlug: 'mind-map',
    whatIs: [
      'What is an AI PDF mind map generator?',
      'An AI PDF mind map generator sends truncated extracted document text through an AI route and proposes a visual hierarchy of topics, subtopics, and relationships. The map can be edited and exported as PNG or JSON, but it may omit or misinterpret source ideas.',
      'A mind map can provide another way to inspect the structure of a report, paper, or chapter. Compare important labels and relationships with the source, then edit nodes before using the exported image or JSON in later work.',
    ],
    users: [
      { who: 'Students & learners', why: 'Visualise the structure of a textbook chapter, lecture notes, or research paper to understand and retain the material faster.' },
      { who: 'Knowledge workers & analysts', why: 'Map out the key findings, risks, and recommendations in long reports to identify the most important areas at a glance.' },
      { who: 'Educators & course designers', why: 'Generate a curriculum map from a syllabus PDF or visualise the relationships between topics in a course module.' },
      { who: 'Project managers & strategists', why: 'Convert a strategic plan, research brief, or project specification into a visual overview for team alignment and planning.' },
    ],
    related: [
      { slug: 'pdf-summarizer', label: 'Summarise a PDF before mapping' },
      { slug: 'quiz-creator', label: 'Turn your PDF into a quiz' },
      { slug: 'pdf-annotate', label: 'Annotate the source PDF' },
      { slug: 'pdf-ocr', label: 'Extract text from a scanned PDF' },
    ],
    formats: { input: ['PDF'], output: ['PNG', 'JSON'], limit: 'Each source is truncated before it is sent to the AI route; the same content limits apply to Free and Pro' },
    privacy: 'Extracted text is sent through the AI mind-map route; this tool does not send the selected PDF bytes. The application does not persist the extracted text in its database or object storage; processing-provider handling also applies.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the document you want to turn into a mind map — a report, textbook chapter, meeting notes, or research paper.' },
      { title: 'Generate the map', body: 'Click Generate. The AI reads the document, identifies the main topics and sub-topics, and builds an interactive mind map.' },
      { title: 'Explore and export', body: 'Expand and collapse branches, click nodes to see source excerpts, and export the mind map as an image or JSON.' },
    ],
    faqs: [
      { q: 'How long can the document be?', a: 'Each source is truncated before the AI request. Pro removes the daily action cap but does not change this content limit.' },
      { q: 'How does the AI decide which topics become branches?', a: 'The AI identifies headings, recurring concepts, and key entities and organises them into a hierarchy based on how the document structures information.' },
      { q: 'Can I edit the mind map after it is generated?', a: 'Yes. You can rename nodes, add new branches, delete branches, and reorder the map to match your own understanding.' },
      { q: 'Can I export the mind map?', a: 'Yes. Export as a PNG image for presentations, or as a JSON file to import into other mind mapping tools.' },
      { q: 'Does my document get sent to a server?', a: 'Extracted text is sent through the AI route. This mind-map tool does not send the selected PDF bytes.' },
      { q: 'Do I need to create an account to generate a mind map?', a: AI_ACCESS_SUMMARY },
      { q: 'Should I rely on the mind map without checking the source document?', a: 'No. The AI groups and labels concepts automatically, and can occasionally misplace or oversimplify a topic. Treat it as a starting structure for understanding the document, and check important branches against the original text before relying on them.' },
    ],
  },

  'quiz-creator': {
    toolSlug: 'quiz-creator',
    whatIs: [
      'What is an AI quiz creator from PDF?',
      'An AI quiz creator uses extracted document text to generate multiple-choice, short-answer, or mixed practice questions with suggested answers.',
      `Generated questions can omit context, misstate a detail, or provide an incorrect answer. ${AI_ACCURACY_DISCLAIMER}`,
    ],
    users: [
      { who: 'Teachers & professors', why: 'Generate multiple-choice exams and revision quizzes directly from course PDFs and textbook chapters, saving hours of manual question-writing.' },
      { who: 'Students & self-learners', why: 'Test your knowledge of a topic by generating practice questions from lecture notes, study guides, or textbook chapters.' },
      { who: 'Corporate trainers & L&D teams', why: 'Create knowledge-check quizzes and certification assessments from training manuals and compliance documents.' },
      { who: 'Online course creators', why: 'Automatically generate quizzes for each lesson or module from the lesson content PDF, speeding up course production.' },
    ],
    related: [
      { slug: 'mind-map', label: 'Create a mind map from your PDF' },
      { slug: 'pdf-summarizer', label: 'Summarise the study material' },
      { slug: 'pdf-annotate', label: 'Highlight key points first' },
      { slug: 'pdf-ocr', label: 'Extract text from a printed paper' },
    ],
    formats: { input: ['PDF'], output: ['PDF', 'CSV'], limit: 'The interface offers 5, 10, 15, or 20 questions per generation for both Free and Pro' },
    privacy: 'Extracted text is sent through the AI quiz route. The application does not persist it in its database or object storage; processing-provider handling also applies.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the study material, textbook chapter, or notes you want to create a quiz from.' },
      { title: 'Generate questions', body: 'Choose the number of questions and the difficulty level. The AI reads the content and generates multiple-choice or short-answer questions.' },
      { title: 'Take the quiz or export it', body: 'Take the quiz interactively in the browser, or download the questions as a PDF or CSV file to use in a classroom or LMS.' },
    ],
    faqs: [
      { q: 'What types of questions can be generated?', a: 'Multiple-choice questions with four options, true/false questions, and short-answer questions are all supported.' },
      { q: 'How many questions can be generated?', a: 'The current interface offers 5, 10, 15, or 20 questions per generation for both Free and Pro.' },
      { q: 'Are the questions accurate to the source material?', a: 'Questions are generated from the text of your document, and each one is editable before use. As with any generative AI, review answers for accuracy — especially for exams or graded material — before relying on them.' },
      { q: 'Can I edit the questions before using them?', a: 'Yes. All generated questions and answers are editable before you download or take the quiz.' },
      { q: 'Is my document sent to a server?', a: 'Extracted text is sent through the AI route to the configured model provider.' },
      { q: 'Do I need to create an account to generate a quiz?', a: AI_ACCESS_SUMMARY },
    ],
  },

  'pdf-editor': {
    toolSlug: 'pdf-editor',
    whatIs: [
      'What is an online PDF editor?',
      'An online PDF editor opens a supported PDF in the browser and provides controls for text, images, overlays, form fields, annotations, and page changes. Document structure, embedded fonts, scans, and complex layouts can affect which direct edits are available.',
      'Use the editor to make supported changes, inspect every page, and download a new PDF copy. The core editor processes the selected document locally in the browser; optional AI form actions have separate account and processing rules.',
    ],
    users: [
      { who: 'Business professionals', why: 'Update text, addresses, dates, and figures in invoices, contracts, and reports without recreating the whole document from scratch.' },
      { who: 'Freelancers & consultants', why: 'Edit templates, proposals, and client deliverables received as PDFs — correct details, insert branding, and add new sections.' },
      { who: 'Students & academics', why: 'Fill in PDF assignments, annotate research papers, and edit shared documents without converting to Word first.' },
      { who: 'Real estate & legal professionals', why: 'Update property details, dates, and party names in standard-form contracts and agreements directly in the PDF.' },
    ],
    related: [
      { slug: 'pdf-annotate', label: 'Annotate and highlight PDF text' },
      { slug: 'pdf-form-builder', label: 'Build an interactive PDF form' },
      { slug: 'pdf-signer', label: 'Sign your PDF digitally' },
      { slug: 'pdf-merger', label: 'Merge multiple PDFs into one' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'The core editor processes the selected PDF locally using browser libraries without an application document-processing request. Optional AI actions have separate processing rules.',
    steps: [
      { title: 'Open your PDF', body: 'Choose a supported contract, invoice, report, or form to load in the browser editor.' },
      { title: 'Edit text, images, and pages', body: 'Click text to edit it in place, add or replace images, insert new pages, add shapes and annotations, and fill in form fields.' },
      { title: 'Save and download', body: 'Click Download to save a new PDF, then open the result in the viewer required for your workflow and inspect every page.' },
    ],
    faqs: [
      { q: 'Can I edit text directly in a PDF?', a: 'Supported text blocks can enter edit mode. Embedded fonts, scans, complex layouts, and the PDF structure can limit direct editing, so inspect the downloaded result.' },
      { q: 'Can I add images to a PDF?', a: 'Yes. Insert images by uploading a JPG or PNG. Resize and reposition them anywhere on the page.' },
      { q: 'Can I delete or add pages?', a: 'Yes. Use the page manager to delete unwanted pages, insert blank pages, or drag to reorder pages.' },
      { q: 'Does it work with password-protected PDFs?', a: 'You need the PDF open password to load a protected file. Once entered, you can edit the unlocked content.' },
      { q: 'Is my PDF sent to a server for manual editing?', a: 'The core editor processes the selected PDF locally without an application document-processing request. Optional AI form actions use separate server routes and data handling.' },
    ],
  },

  'pdf-viewer': {
    toolSlug: 'pdf-viewer',
    whatIs: [
      'What is an online PDF viewer?',
      'An online PDF viewer opens a PDF in a browser for on-screen reading without a desktop reader. This viewer provides previous and next page controls, zoom, fullscreen mode, touch navigation, and a download control.',
      'The current viewer renders one page at a time on canvas and does not provide text search, annotations, printing controls, or a password-entry flow. Available behavior depends on the PDF structure, browser, and device.',
    ],
    users: [
      { who: 'Remote workers & students', why: 'Open PDFs from email attachments, cloud links, or shared drives instantly in the browser without waiting for a download or opening heavy desktop software.' },
      { who: 'Mobile device users', why: 'Read PDFs on a phone or tablet with full touch support — swipe between pages, pinch to zoom, and search for text.' },
      { who: 'Anyone without Adobe Acrobat', why: 'View supported PDF forms, certificates, reports, and other documents on a device without desktop reader software.' },
      { who: 'Reviewers & approvers', why: 'Quickly check a PDF before approving it for distribution, without having to download or save the file to your device.' },
    ],
    related: [
      { slug: 'pdf-editor', label: 'Edit the PDF you are viewing' },
      { slug: 'pdf-annotate', label: 'Annotate and comment on the PDF' },
      { slug: 'pdf-ocr', label: 'Extract text from the PDF' },
      { slug: 'pdf-summarizer', label: 'Summarise the PDF content' },
    ],
    formats: { input: ['PDF'], output: ['On-screen PDF view'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'The PDF is rendered locally in your browser using PDF.js without an application document-processing request.',
    steps: [
      { title: 'Choose a PDF', body: 'Drag a PDF onto the page or use the file picker. PDF.js loads the selected file locally in your browser.' },
      { title: 'Read and navigate', body: 'Move between pages, zoom from 10% to 800%, use fullscreen where the browser supports it, or swipe pages at fit width on touch devices.' },
      { title: 'Download or close', body: 'Download the unchanged selected file or close it to choose another PDF.' },
    ],
    faqs: [
      { q: 'What can I do in the online PDF viewer?', a: 'You can open one PDF, move between pages, zoom from 10% to 800%, enter fullscreen where supported, swipe pages at fit width on touch devices, and download the unchanged selected file.' },
      { q: 'Does the PDF viewer work on mobile?', a: 'The viewer has a responsive mobile toolbar and supports horizontal page swipes at fit width. Zoomed pages retain normal panning behavior. Performance depends on PDF complexity and available device memory.' },
      { q: 'Can I search for text in this PDF viewer?', a: 'No. The current viewer renders pages on canvas and does not provide a text-search control or searchable text layer. Use PDF OCR when a scanned document needs searchable text.' },
      { q: 'Can I open a password-protected PDF?', a: 'The current page does not provide a password-entry flow, so a protected PDF may fail to open. If you are authorized, unlock it with the correct password before using the viewer.' },
      { q: 'Is the selected PDF uploaded to a server?', a: 'No application document-processing request is used. PDF.js reads and renders the selected file locally in your browser.' },
      { q: 'What is the PDF viewer file-size limit?', a: 'The file handler does not enforce a fixed cap. Practical capacity depends on file size, page count, PDF complexity, available browser memory, and device performance.' },
    ],
  },

  'pdf-cropper': {
    toolSlug: 'pdf-cropper',
    whatIs: [
      'What is a PDF cropper?',
      'A PDF cropper adjusts the visible area of each page in a PDF by moving the page boundary inward, hiding content outside the new boundary. The most common use is removing unwanted white margins from scanned documents, cropping scanner borders, or trimming a full-bleed PDF to a specific printable size.',
      'Cropping is non-destructive by default in PDF: the content outside the crop boundary is hidden but still present in the file. If you need to permanently remove that content — for privacy or file size reasons — EditPDF AI offers a flatten option that burns the crop into the page. All cropping runs locally in your browser.',
    ],
    users: [
      { who: 'Scan-to-PDF users', why: 'Remove the black border or excess white margin that a scanner adds around the edges of every scanned page.' },
      { who: 'Graphic designers & publishers', why: 'Crop a PDF to a specific size for print production — trimming bleed marks or adjusting the page to the final trim size.' },
      { who: 'Students & researchers', why: 'Crop a wide PDF (landscape textbook pages, wide spreadsheets) to remove side margins so it displays better on a narrow screen or tablet.' },
      { who: 'Content & training creators', why: 'Crop specific areas from a large-format PDF — diagrams, maps, or product images — to extract just the portion needed for presentations or handouts.' },
    ],
    related: [
      { slug: 'rotate-pdf', label: 'Rotate PDF pages to the right orientation' },
      { slug: 'pdf-page-manager', label: 'Reorder pages after cropping' },
      { slug: 'pdf-editor', label: 'Edit the cropped PDF' },
      { slug: 'pdf-compressor', label: 'Compress the PDF after cropping' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Cropping runs entirely in your browser — your file never leaves your device.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF with pages you want to crop. You can apply the same crop to all pages or set a different crop for each page.' },
      { title: 'Set the crop area', body: 'Drag the handles on the crop overlay to define the area to keep. The live preview shows exactly how the cropped page will look.' },
      { title: 'Download the cropped PDF', body: 'Click Crop. The cropped PDF downloads instantly with the new page boundaries applied.' },
    ],
    faqs: [
      { q: 'Does cropping permanently remove the hidden content?', a: 'PDF cropping changes the visible area (the MediaBox/CropBox) but the hidden content remains in the file unless you use a flattening option. To permanently remove it, use our PDF Redactor tool.' },
      { q: 'Can I crop all pages at once?', a: 'Yes. Apply the same crop settings to all pages, or switch to per-page mode to set individual crops.' },
      { q: 'Can I crop to remove a border or margin?', a: 'Yes. This is the most common use case — dragging the crop handles inward to remove scanner borders or excessive white margins.' },
      { q: 'Does cropping reduce the file size?', a: 'Slightly — the CropBox is smaller, but the original content data is still in the file. For maximum compression, use our PDF Compressor after cropping.' },
      { q: 'Is my PDF processed on a server?', a: 'No. Cropping runs entirely in your browser. Your file never leaves your device.' },
    ],
  },

  'rotate-pdf': {
    toolSlug: 'rotate-pdf',
    whatIs: [
      'What is a PDF rotation tool?',
      'A PDF rotation tool permanently changes the orientation of one or more pages in a PDF file. If a page was scanned sideways, photographed upside down, or saved in the wrong orientation by the source application, rotating it corrects the display so readers do not have to tilt their head or their device.',
      'Rotation is saved into the PDF page structure, so the corrected orientation persists in every viewer — Adobe Acrobat, browser viewers, and mobile apps. You can rotate all pages at once, select individual pages, or apply different rotations to different pages in a single session. EditPDF AI performs rotation entirely in your browser with no server upload.',
    ],
    users: [
      { who: 'Scanner & camera users', why: 'Fix pages scanned sideways or photos of documents taken in the wrong orientation before merging them into a final PDF.' },
      { who: 'Office & admin professionals', why: 'Correct orientation issues in PDFs received from clients, suppliers, or colleagues before archiving or forwarding them.' },
      { who: 'Students & academics', why: 'Fix mixed-orientation PDFs — where some pages are landscape and others portrait — into a consistent reading direction.' },
      { who: 'Legal & compliance teams', why: 'Correct document orientation before filing PDFs in case management systems or document repositories that require standard portrait orientation.' },
    ],
    related: [
      { slug: 'pdf-cropper', label: 'Crop the rotated PDF pages' },
      { slug: 'pdf-page-manager', label: 'Reorder pages after rotating' },
      { slug: 'delete-pages', label: 'Delete unwanted pages' },
      { slug: 'extract-pages', label: 'Extract specific pages' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Rotation runs entirely in your browser using pdf-lib — your file never leaves your device.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF with pages in the wrong orientation. Multiple pages can be rotated in one session.' },
      { title: 'Select pages and rotation', body: 'Choose which pages to rotate — all pages, individual pages, or every other page. Set rotation to 90°, 180°, or 270°.' },
      { title: 'Download the corrected PDF', body: 'Click Rotate. The rotated PDF downloads instantly with the new orientation saved permanently.' },
    ],
    faqs: [
      { q: 'Can I rotate just one page in a multi-page PDF?', a: 'Yes. Select individual pages using the page picker, then apply the rotation only to those pages.' },
      { q: 'Can I rotate clockwise and counter-clockwise?', a: 'Yes. Choose from 90° clockwise, 90° counter-clockwise (270°), or 180° to flip the page upside down.' },
      { q: 'Is the rotation permanent?', a: 'Yes. The rotation is saved into the PDF structure and will appear correctly in all PDF viewers.' },
      { q: 'Can I rotate landscape pages to portrait?', a: 'Yes. Rotating a landscape page by 90° corrects its orientation to portrait (or vice versa).' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. Rotation runs entirely in your browser using pdf-lib. Your file never leaves your device.' },
    ],
  },

  'extract-pages': {
    toolSlug: 'extract-pages',
    whatIs: [
      'What is a PDF page extractor?',
      'A PDF page extractor lets you select specific pages from within a PDF and save them as a new, standalone PDF file. Unlike splitting (which divides a PDF by sequential ranges), extraction lets you cherry-pick any combination of pages — page 1, page 7, and pages 22–25 — regardless of where they appear in the original document.',
      'Extracting pages is useful when you need only a specific subset of a document: a contract exhibit from a larger binder, selected financial pages, or one chapter from a report. EditPDF AI copies the selected pages locally in your browser and saves a new file without changing the source PDF.',
    ],
    users: [
      { who: 'Legal professionals', why: 'Extract specific exhibits, schedules, or signature pages from a full contract PDF for separate filing or reference.' },
      { who: 'Students & academics', why: 'Extract one or two relevant pages from a long research paper to include as a reference attachment without sending the whole document.' },
      { who: 'Finance & audit teams', why: 'Pull specific financial statement pages or supporting schedules from a full annual report PDF for targeted distribution.' },
      { who: 'Document managers', why: 'Extract individual forms, certificates, or records from a combined filing PDF to save each as a separate file for organised storage.' },
    ],
    related: [
      { slug: 'pdf-splitter', label: 'Split a PDF into separate files' },
      { slug: 'delete-pages', label: 'Delete pages you do not need' },
      { slug: 'pdf-page-manager', label: 'Reorder the remaining PDF pages' },
      { slug: 'pdf-merger', label: 'Merge the extracted pages' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Extraction runs locally in your browser without an application document-processing request. A page-preview worker is loaded as a runtime asset from a CDN.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want to extract pages from.' },
      { title: 'Choose pages to extract', body: 'Click individual page thumbnails or enter page numbers (e.g. 2, 4, 7-10). Selected pages are highlighted.' },
      { title: 'Extract and download', body: 'Click Extract. The selected pages are saved as a new PDF and downloaded immediately.' },
    ],
    faqs: [
      { q: 'Is page extraction the same as splitting?', a: 'Extraction lets you pick specific pages from anywhere in the document. Splitting divides the document by range (e.g. pages 1-5, then 6-10). Use the PDF Splitter for range-based splits.' },
      { q: 'Can I extract non-consecutive pages?', a: 'Yes. Select any combination of pages — pages 1, 5, and 12 can all be extracted into a single new PDF.' },
      { q: 'Does extraction affect the original PDF?', a: 'No. The original file is unchanged. Extraction creates a new PDF containing only the pages you selected.' },
      { q: 'Is there a limit on how many pages I can extract?', a: 'No. You can extract as few as one page or as many as the entire document.' },
      { q: 'Is my PDF sent through an application document-processing route?', a: 'No. The selected PDF is copied locally in your browser. A page-preview worker is loaded as a runtime asset from a CDN.' },
    ],
  },

  'delete-pages': {
    toolSlug: 'delete-pages',
    whatIs: [
      'What is a PDF page deleter?',
      'A PDF page deleter removes unwanted pages from a PDF and saves the remaining pages as a new PDF file. Blank pages, duplicate pages, cover pages that should not be shared, or confidential sections that need to be stripped out can all be removed in seconds without re-creating the document from scratch.',
      'Deleting pages is the simplest way to produce a custom version of a document for a specific purpose: a proposal with the pricing section removed for an early prospect, a report with the internal appendix stripped out for a public version, or a scanned document with the blank back pages removed. EditPDF AI processes page deletion locally in your browser.',
    ],
    users: [
      { who: 'Business & client-facing teams', why: 'Remove internal notes, pricing appendices, or confidential sections from a document before sending the external version to clients.' },
      { who: 'Students & academic submitters', why: 'Remove a cover page, marking rubric, or feedback page from a returned PDF before including it as an attachment in another document.' },
      { who: 'Privacy-conscious individuals', why: 'Remove pages containing personal information from a shared or submitted document before sending it on.' },
      { who: 'Scan & archive users', why: 'Delete blank back pages that a duplex scanner captured from single-sided originals, cleaning up the scanned PDF before archiving.' },
    ],
    related: [
      { slug: 'extract-pages', label: 'Extract the pages you want to keep' },
      { slug: 'pdf-splitter', label: 'Split the PDF into separate files' },
      { slug: 'pdf-page-manager', label: 'Reorder the remaining pages' },
      { slug: 'rotate-pdf', label: 'Rotate pages after deleting' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Page deletion runs locally in your browser without an application document-processing request.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF with pages you want to remove.' },
      { title: 'Select pages to delete', body: 'Click the page thumbnails you want to remove. Selected pages are highlighted in red.' },
      { title: 'Delete and download', body: 'Click Delete Pages. The remaining pages are saved as a new PDF and downloaded.' },
    ],
    faqs: [
      { q: 'Can I delete multiple pages at once?', a: 'Yes. Select as many pages as you want by clicking their thumbnails, then delete them all in one click.' },
      { q: 'Is deletion permanent?', a: 'The downloaded PDF has the pages removed. The original file on your device is unchanged — you can re-upload if needed.' },
      { q: 'Can I delete the first or last page?', a: 'Yes. Any page can be deleted, including the first and last pages.' },
      { q: 'What if I accidentally select the wrong pages?', a: 'Click a selected page again to deselect it before clicking Delete. Nothing is changed until you confirm.' },
      { q: 'Is my file sent to a document-processing route?', a: 'No. Page deletion runs locally in your browser.' },
    ],
  },

  'add-page-numbers': {
    toolSlug: 'add-page-numbers',
    whatIs: [
      'What is an online PDF page numbering tool?',
      'An online PDF page numbering tool adds sequential page numbers to the header or footer of every page in a PDF document. You control the position (left, centre, or right), font, size, starting number, and which page to begin numbering from — the result is a professionally paginated PDF that is easy to reference and navigate.',
      'Page numbers are essential for any document intended for review, citation, or printing: legal briefs, academic papers, business reports, and instruction manuals all require clear page references. EditPDF AI adds page numbers as a new non-destructive text layer on top of existing content, running entirely in your browser.',
    ],
    users: [
      { who: 'Legal teams', why: 'Add Bates-style sequential page numbers to exhibits and bundles so specific pages can be cited precisely during proceedings.' },
      { who: 'Academic writers & researchers', why: 'Number the pages of a thesis, dissertation, or journal submission in the required format before submission.' },
      { who: 'Report authors & analysts', why: 'Add page numbers to business reports and white papers so reviewers can reference specific findings in meetings and written feedback.' },
      { who: 'Book authors & self-publishers', why: 'Add page numbers to a manuscript PDF before sending to a printer or converting to a print-ready file.' },
    ],
    related: [
      { slug: 'pdf-page-manager', label: 'Reorder pages before numbering' },
      { slug: 'pdf-editor', label: 'Edit the PDF before adding numbers' },
      { slug: 'pdf-merger', label: 'Merge PDFs then add page numbers' },
      { slug: 'pdf-annotate', label: 'Add headers and annotations' },
      { slug: 'pdf-page-labels', label: 'Use viewer navigation labels instead' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on browser memory and device performance' },
    privacy: 'Page numbers are added entirely in your browser — your file never leaves your device.',
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want to add page numbers to.' },
      { title: 'Configure numbering', body: 'Choose the position (header or footer, left/centre/right), the starting number, font, and size. A live preview shows the result.' },
      { title: 'Apply and download', body: 'Click Add Page Numbers. The numbered PDF downloads immediately.' },
    ],
    faqs: [
      { q: 'Can I start page numbering from a number other than 1?', a: 'Yes. Set any starting number — useful if the document is a chapter in a larger book that begins at page 47, for example.' },
      { q: 'Can I skip the first page (e.g. a cover page)?', a: 'Yes. Set "Start numbering from page" to 2 to exclude the cover page from the numbering sequence.' },
      { q: 'Can I choose the position of page numbers?', a: 'Yes. Place numbers at the top or bottom of the page, and align them left, centre, or right.' },
      { q: 'Does adding page numbers affect the existing content?', a: 'Page numbers are added as a new text layer on top of the existing content. The original text and images are untouched.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. Page numbers are added entirely in your browser. Your file never leaves your device.' },
    ],
  },

  'pdf-page-manager': {
    whatIs: [
      'What is a PDF page manager?',
      'A PDF page manager lets you change a document’s page structure from one interface. You can reorder pages by dragging, rotate individual pages, delete unwanted pages, or arrange pages loaded from multiple PDFs, then save the displayed sequence as a new PDF.',
      'Page management is useful when a report arrived in the wrong order, pages from different source PDFs need to be interleaved, or a scan contains unwanted and sideways pages. EditPDF AI performs the document page operations locally in your browser.',
    ],
    users: [
      { who: 'Document editors & administrators', why: 'Reorganise, clean up, and standardise multi-page PDFs — reordering chapters, removing blanks, and correcting orientations — in a single session.' },
      { who: 'Legal & compliance teams', why: 'Restructure PDF bundles and filings to match required court or regulatory page ordering before submission.' },
      { who: 'Publishers & content creators', why: 'Reorder pages of a layout proof, rotate sideways pages, and remove placeholders before reviewing the saved PDF.' },
      { who: 'Students & academic submitters', why: 'Reorder sections of a compiled thesis, combine pages from source PDFs, and remove draft pages before submission.' },
    ],
    related: [
      { slug: 'pdf-splitter', label: 'Split the organised PDF' },
      { slug: 'pdf-merger', label: 'Merge PDFs before organising pages' },
      { slug: 'rotate-pdf', label: 'Rotate individual pages' },
      { slug: 'extract-pages', label: 'Extract selected pages' },
      { slug: 'pdf-page-labels', label: 'Set custom viewer page labels' },
    ],
    formats: { input: ['PDF'], output: ['PDF'], limit: 'No fixed application limit; practical capacity depends on page count, browser memory, and device performance' },
    privacy: 'Document page operations run locally in your browser without an application document-processing request. A page-preview worker is loaded as a runtime asset from a CDN.',
    steps: [
      { title: 'Upload your PDF', body: 'Open the PDF you want to reorganise. All pages appear as thumbnails in the page manager.' },
      { title: 'Reorder, rotate, or delete pages', body: 'Drag page thumbnails to reorder them. Click the rotate button on any thumbnail to rotate that page. Click delete to remove a page.' },
      { title: 'Save the reorganised PDF', body: 'Click Save. The reorganised PDF downloads with your new page order and any rotations applied.' },
    ],
    faqs: [
      { q: 'Can I reorder pages in a PDF?', a: 'Yes. Drag and drop page thumbnails into any order. The final PDF reflects the new sequence.' },
      { q: 'Can I combine reordering, rotating, and deleting in one step?', a: 'Yes. Make all your changes — drag to reorder, rotate individual pages, delete unwanted pages — then save once to apply everything.' },
      { q: 'Is there a limit on the number of pages I can manage?', a: 'The interface does not impose a fixed application page limit. Practical capacity depends on page count, file complexity, available browser memory, and device performance.' },
      { q: 'Can I insert blank pages?', a: 'No. The current page manager can reorder, rotate, and delete pages or arrange pages from multiple PDFs, but it does not provide a blank-page insertion control.' },
      { q: 'Is my PDF sent through an application document-processing route?', a: 'No. Document page operations run locally in your browser. A page-preview worker is loaded as a runtime asset from a CDN.' },
    ],
  },

}

const dataWithSlugs: Record<string, ToolSEOData> = Object.fromEntries(
  Object.entries(data).map(([slug, d]) => [slug, { ...d, toolSlug: slug }])
)

export default dataWithSlugs
