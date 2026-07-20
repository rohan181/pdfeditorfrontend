import type { ToolSEOStep, ToolSEOFAQ, ToolSEOUser } from '@/components/ToolSEOSection'

interface ToolSEOData {
  steps:    ToolSEOStep[]
  faqs:     ToolSEOFAQ[]
  whatIs?:  string[]
  users?:   ToolSEOUser[]
  related?: { slug: string; label: string }[]
  toolSlug?: string
}

const data: Record<string, ToolSEOData> = {

  'pdf-splitter': {
    whatIs: [
      'What is a PDF splitter?',
      'A PDF splitter is a tool that divides one PDF file into multiple separate PDF files. Instead of sharing or printing an entire 50-page report when a colleague only needs pages 12–18, you split out exactly the pages you need and send those alone.',
      'Splitting a PDF is also the safest way to share documents that contain a mix of public and confidential content. You extract the sections you want to share, and the rest stays private. All splitting on EditPDF AI runs inside your browser — your file never leaves your device.',
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
    steps: [
      { title: 'Upload your PDF', body: 'Drag and drop your PDF onto the page or click to browse. Files stay in your browser — nothing is uploaded to any server.' },
      { title: 'Choose split mode', body: 'Split by every page, set custom page ranges (e.g. 1-3, 5, 7-10), or extract only the pages you need.' },
      { title: 'Download the results', body: 'Each split section downloads as a separate PDF. Grab them one by one or download all at once as a ZIP.' },
    ],
    faqs: [
      { q: 'Can I split a PDF into individual pages?', a: 'Yes. Choose "Every page" mode and each page is saved as its own PDF file. You can then download them all at once.' },
      { q: 'Is there a file size limit for splitting PDFs?', a: 'No server-side limit — splitting runs entirely in your browser using pdf-lib, so the only limit is your device\'s memory. Most PDFs up to 500 MB work fine.' },
      { q: 'Can I extract a specific page range?', a: 'Absolutely. Enter ranges like "1-5, 8, 11-15" and the splitter creates one PDF for each range you define.' },
      { q: 'Does splitting reduce PDF quality?', a: 'No. The pages are extracted at their original resolution with no re-encoding, so text, images, and vector graphics stay identical to the source.' },
      { q: 'Is my PDF sent to a server?', a: 'Never. All splitting happens client-side in your browser. Your file never leaves your device.' },
    ],
  },

  'pdf-merger': {
    whatIs: [
      'What is a PDF merger?',
      'A PDF merger is a tool that combines two or more separate PDF files into a single, unified PDF document. Instead of emailing five attachments, you merge them into one polished file that opens in the correct order and is far easier for the recipient to navigate.',
      'Merging is also essential for compliance and record-keeping: many systems require a single PDF for submission. EditPDF AI\'s merger runs entirely in your browser, so even confidential documents — contracts, payslips, medical records — are combined without ever touching a server.',
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
    ],
    steps: [
      { title: 'Add your PDFs', body: 'Upload two or more PDFs by dragging them onto the page or clicking to browse. You can add files from multiple folders.' },
      { title: 'Arrange the order', body: 'Drag and drop the file cards to reorder them exactly as you want them to appear in the final merged PDF.' },
      { title: 'Merge and download', body: 'Click Merge PDF. Your combined file downloads instantly — one PDF with all pages in the order you set.' },
    ],
    faqs: [
      { q: 'How many PDFs can I merge at once?', a: 'There is no enforced limit. You can merge as many files as your browser memory allows — typically dozens of files or hundreds of pages without issue.' },
      { q: 'Will merging preserve bookmarks and hyperlinks?', a: 'Internal hyperlinks are preserved. Complex bookmarks (outlines) may be flattened depending on the source PDFs, but all page content remains intact.' },
      { q: 'Can I rearrange pages from different PDFs?', a: 'You can reorder the files before merging. For fine-grained page-level reordering across multiple PDFs, use our PDF Page Manager tool first.' },
      { q: 'Does the merged PDF retain the original quality?', a: 'Yes. Pages are copied at their original resolution with no re-compression, so images, text, and fonts are unchanged.' },
      { q: 'Is there a file size limit?', a: 'No server-side limit — merging runs entirely in your browser. Large files (each 100 MB+) may be slow, but there is no hard cap.' },
    ],
  },

  'pdf-compressor': {
    whatIs: [
      'What is a PDF compressor?',
      'A PDF compressor reduces the file size of a PDF document by re-encoding embedded images at lower quality and removing redundant data. A 25 MB scan of a brochure can often be brought down to 2–3 MB with no visible difference on screen — making it suitable for email, web upload, or cloud storage.',
      'PDF compression is especially useful when a service imposes a file-size limit (many email providers cap attachments at 10–25 MB). EditPDF AI\'s compressor runs directly in your browser using WebAssembly, so your document is never uploaded to any external server.',
    ],
    users: [
      { who: 'Office & admin professionals', why: 'Compress scanned contracts, reports, and brochures so they fit inside email attachment limits before sending.' },
      { who: 'Web & marketing teams', why: 'Reduce downloadable PDF file sizes to improve page load times and keep hosting costs low.' },
      { who: 'Students & academics', why: 'Shrink large assignment PDFs that exceed submission portals\' file-size caps.' },
      { who: 'Archivists & records managers', why: 'Compress document libraries to reduce storage footprint without destroying the readable quality of the originals.' },
    ],
    related: [
      { slug: 'pdf-merger', label: 'Merge PDFs then compress' },
      { slug: 'pdf-to-images', label: 'Convert PDF pages to images' },
      { slug: 'image-to-pdf', label: 'Convert images to a PDF' },
      { slug: 'pdf-editor', label: 'Edit your PDF before compressing' },
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Drag your PDF onto the page or click to select it. The file stays local — it never leaves your device.' },
      { title: 'Select compression level', body: 'Choose Light (minimal quality loss), Balanced, or Maximum (smallest file, reduced image quality). A preview shows the estimated saving.' },
      { title: 'Download the compressed file', body: 'Click Compress. Your reduced PDF downloads in seconds. Compare the before and after file sizes right on screen.' },
    ],
    faqs: [
      { q: 'How much can I reduce a PDF file size?', a: 'It depends on the content. PDFs with lots of high-resolution images can be reduced by 50–90%. Text-only PDFs typically shrink by 10–30%.' },
      { q: 'Does compression affect text quality?', a: 'No. Text is vector data and is not affected by image compression. Only embedded raster images are re-encoded at a lower quality.' },
      { q: 'Can I compress a PDF that is already compressed?', a: 'Yes, but gains will be smaller. If the images were already compressed at creation time, our tool will apply further compression — though the saving may only be a few percent.' },
      { q: 'Is the compression lossless or lossy?', a: 'Our default modes use lossy image compression to achieve the largest file size reduction. For presentations or archival documents where image quality must be perfect, choose Light compression.' },
      { q: 'Does my file get uploaded to your servers?', a: 'No. Compression runs entirely in your browser using WebAssembly. Your PDF is never sent to any server.' },
    ],
  },

  'pdf-signer': {
    whatIs: [
      'What is an electronic PDF signer?',
      'An electronic PDF signer lets you place a legally recognised signature on a PDF document without printing, signing by hand, and scanning. You can draw your signature, type it in a handwritten font, or upload an image of your existing signature — and place it anywhere on the page in seconds.',
      'Electronic signatures are legally valid in most countries under laws like the EU\'s eIDAS regulation and the US ESIGN Act. EditPDF AI\'s signer runs entirely in your browser: your document and your signature image never leave your device, so sensitive agreements stay completely private.',
    ],
    users: [
      { who: 'Freelancers & contractors', why: 'Sign client contracts, NDAs, and service agreements the moment they arrive — no printer needed.' },
      { who: 'Small business owners', why: 'Execute supplier agreements, lease documents, and purchase orders without scheduling an in-person signing.' },
      { who: 'HR & recruitment teams', why: 'Sign offer letters, onboarding paperwork, and policy acknowledgements and return them the same day.' },
      { who: 'Real estate professionals', why: 'Sign or counter-sign purchase agreements, listing contracts, and disclosure forms instantly from any device.' },
    ],
    related: [
      { slug: 'pdf-editor', label: 'Edit PDF text before signing' },
      { slug: 'pdf-form-builder', label: 'Build a signable PDF form' },
      { slug: 'ai-pdf-form-filler', label: 'Auto-fill a PDF form with AI' },
      { slug: 'pdf-annotate', label: 'Annotate a PDF with comments' },
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Open the PDF you need to sign. It loads directly in your browser — no account or install required.' },
      { title: 'Draw or type your signature', body: 'Switch to the Signature tool and draw your signature with a mouse or finger, type it in a handwritten font, or upload an image of your signature.' },
      { title: 'Place and download', body: 'Click anywhere on the page to place your signature. Resize and reposition it, then download the signed PDF.' },
    ],
    faqs: [
      { q: 'Is an electronic signature legally binding?', a: 'In most countries, yes. Electronic signatures are legally valid under eIDAS (EU), ESIGN Act (US), and equivalent laws worldwide for the majority of document types. For notarised or court documents, check local requirements.' },
      { q: 'Can I add initials on multiple pages?', a: 'Yes. Place your signature or initials on as many pages as needed before downloading. Each placement is independent.' },
      { q: 'Can I upload an image of my handwritten signature?', a: 'Yes. Choose "Upload image" in the signature panel, upload a PNG or JPG of your signature, and place it on the page. For best results, use a white or transparent background.' },
      { q: 'Is the signature embedded in the PDF?', a: 'Yes. The signature is flattened into the PDF as a permanent image element. It will appear the same in any PDF viewer.' },
      { q: 'Does my document get sent to a server?', a: 'No. Signing runs entirely in your browser. Your PDF and signature are never transmitted to any server.' },
    ],
  },

  'pdf-watermark': {
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
      { slug: 'pdf-redactor', label: 'Redact sensitive text from a PDF' },
      { slug: 'pdf-editor', label: 'Edit the PDF before watermarking' },
      { slug: 'pdf-annotate', label: 'Add stamps and annotations' },
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Drop your PDF onto the page or click to select it. All processing happens in your browser.' },
      { title: 'Configure the watermark', body: 'Type your watermark text, choose the font size, colour, opacity, and rotation. Or upload an image watermark (logo, stamp).' },
      { title: 'Apply and download', body: 'Click Add Watermark. The watermark is applied to every page and the PDF downloads instantly.' },
    ],
    faqs: [
      { q: 'Can I add a watermark to every page at once?', a: 'Yes. The watermark is applied to all pages simultaneously. There is no need to repeat it per page.' },
      { q: 'Can I use my company logo as a watermark?', a: 'Yes. Upload a PNG or JPG image and it will be used as the watermark instead of text. Transparent PNG files work best.' },
      { q: 'Is the watermark permanent?', a: 'Yes. The watermark is embedded into the PDF content stream. It cannot be removed without specialist software.' },
      { q: 'Can I control the opacity?', a: 'Yes. The opacity slider lets you set the watermark from fully transparent to fully opaque, so it can be subtle or prominent.' },
      { q: 'Will the watermark affect text in the PDF?', a: 'No. The watermark is added as a new layer. The original text and images remain selectable and searchable.' },
    ],
  },

  'pdf-password-lock': {
    whatIs: [
      'What is a PDF password lock?',
      'A PDF password lock encrypts a PDF file so that anyone who tries to open it must enter the correct password first. Without the password, the content is completely unreadable — even if someone obtains a copy of the file. EditPDF AI uses AES-256 encryption, the strongest level available in the PDF specification, equivalent to the standard used by banks and government agencies.',
      'Beyond an open password, you can also set a permissions password that restricts what a recipient can do with the document — preventing printing, copying text, or making edits — even after they have opened it. All encryption runs in your browser, so your document and password are never sent to any server.',
    ],
    users: [
      { who: 'HR & payroll teams', why: 'Password-protect payslips, salary letters, and personal employee records before emailing them to individuals.' },
      { who: 'Legal & financial professionals', why: 'Lock contracts, settlement documents, and financial reports so only the intended recipient can access the content.' },
      { who: 'Educators', why: 'Protect exam papers and answer sheets with a password that is shared only after the assessment window closes.' },
      { who: 'Individuals', why: 'Secure personal documents — tax returns, ID scans, medical records — stored in cloud services or shared via messaging apps.' },
    ],
    related: [
      { slug: 'pdf-watermark', label: 'Add a watermark to your PDF' },
      { slug: 'pdf-redactor', label: 'Redact text before locking' },
      { slug: 'pdf-signer', label: 'Digitally sign your PDF' },
      { slug: 'pdf-editor', label: 'Edit the PDF before locking' },
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want to protect. It is processed entirely in your browser.' },
      { title: 'Set a password', body: 'Enter an open password (required to view) and optionally a permissions password (controls printing and editing rights).' },
      { title: 'Download the protected file', body: 'Click Protect PDF. The encrypted file downloads instantly — open it in any PDF viewer and the password will be required.' },
    ],
    faqs: [
      { q: 'What encryption does the PDF password use?', a: 'We apply AES-256 encryption, the same standard used by banks and government agencies. It is the strongest encryption available in the PDF specification.' },
      { q: 'Can I set different passwords for viewing and editing?', a: 'Yes. The "open" password is required to open the file. The "permissions" password controls whether the viewer can print or copy text, even after opening.' },
      { q: 'Can I remove the password from a PDF I own?', a: 'If you know the password, yes — open the protected PDF in our tool and use the Remove Password option.' },
      { q: 'Does password protection prevent copying text?', a: 'You can restrict copying by setting a permissions password. Without the permissions password, the viewer cannot copy text from the PDF.' },
      { q: 'Is my PDF sent to a server?', a: 'No. Encryption runs in your browser using WebAssembly. Your document and password are never transmitted over the internet.' },
    ],
  },

  'image-to-pdf': {
    whatIs: [
      'What is an image to PDF converter?',
      'An image to PDF converter takes one or more image files — JPG, PNG, WEBP, or others — and packages them into a single PDF document. Each image becomes a page in the PDF, and you control the page size, order, and orientation. The result is a universally compatible document that can be shared, printed, or submitted anywhere PDFs are accepted.',
      'Converting images to PDF is the standard way to submit scanned documents, photo IDs, or photo portfolios as a single organised file. EditPDF AI handles the conversion entirely in your browser, so photos of personal documents like passports and bank statements are never sent to any server.',
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
    ],
    steps: [
      { title: 'Upload your images', body: 'Drag one or more JPG, PNG, WEBP, GIF, or BMP images onto the page. You can mix image formats in one PDF.' },
      { title: 'Arrange and adjust', body: 'Reorder images by dragging, crop or rotate individual images, and choose the output page size (A4, Letter, or fit to image).' },
      { title: 'Convert and download', body: 'Click Convert to PDF. All images are combined into a single PDF in the order you set, and it downloads instantly.' },
    ],
    faqs: [
      { q: 'What image formats can I convert to PDF?', a: 'JPG, JPEG, PNG, WEBP, GIF (first frame), and BMP are all supported. You can mix formats in a single PDF.' },
      { q: 'Will the image quality be reduced?', a: 'Images are embedded at their original resolution. You can choose a quality setting for JPEG compression, but "High quality" keeps images crisp.' },
      { q: 'Can I convert multiple images into one PDF?', a: 'Yes. Upload as many images as you need and they are combined into a single multi-page PDF — one page per image.' },
      { q: 'What page size does the PDF use?', a: 'You can choose A4, US Letter, or "fit to image" which makes each page exactly the same size as the source image.' },
      { q: 'Is the conversion done on my device?', a: 'Yes. The entire conversion runs in your browser. Your images are never uploaded to any server.' },
    ],
  },

  'word-to-pdf': {
    whatIs: [
      'What is a Word to PDF converter?',
      'A Word to PDF converter takes a Microsoft Word document (.docx or .doc) and produces a PDF file that looks identical to the original — preserving fonts, tables, images, columns, headers, footers, and page breaks. Unlike a Word file, the resulting PDF displays the same on every device and cannot be accidentally edited by the recipient.',
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
    ],
    steps: [
      { title: 'Upload your Word document', body: 'Select your .docx or .doc file. The conversion runs in your browser with no file uploads.' },
      { title: 'Convert', body: 'Click Convert to PDF. Your document is processed instantly, preserving fonts, tables, images, and layout.' },
      { title: 'Download the PDF', body: 'Your converted PDF downloads immediately. Open it in any PDF viewer — it looks exactly like the original Word document.' },
    ],
    faqs: [
      { q: 'Does the layout stay the same after conversion?', a: 'Yes. Fonts, tables, images, headers, footers, and page breaks are all preserved in the output PDF.' },
      { q: 'Can I convert .doc (old Word format) files too?', a: 'Yes. Both .docx (Word 2007+) and the older .doc format are supported.' },
      { q: 'Will custom fonts be embedded in the PDF?', a: 'Standard system fonts are always embedded. If your document uses a custom font that is not installed, it may be substituted with a similar font.' },
      { q: 'Is there a page limit?', a: 'No. There is no page limit for the conversion — documents of any length are supported.' },
      { q: 'Is my Word document sent to a server?', a: 'No. The conversion runs entirely in your browser. Your file never leaves your device.' },
    ],
  },

  'pdf-to-word': {
    whatIs: [
      'What is a PDF to Word converter?',
      'A PDF to Word converter extracts the text, tables, and images from a PDF file and re-creates the content as an editable .docx file that you can open in Microsoft Word, Google Docs, or LibreOffice. This lets you make substantive edits to a document that was previously locked in PDF format.',
      'The most common reason to convert PDF to Word is to update or correct text that cannot be changed in the original PDF — a contract clause, an address, a date. EditPDF AI uses accurate layout reconstruction so the output Word file mirrors the original structure, minimising the clean-up required after conversion.',
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
    steps: [
      { title: 'Upload your PDF', body: 'Drag your PDF onto the page or click to select it. Processing happens in your browser.' },
      { title: 'Convert to Word', body: 'Click Convert to Word. The tool extracts text, tables, and images and re-creates the layout in a .docx file.' },
      { title: 'Download and edit', body: 'Download the .docx file and open it in Microsoft Word, Google Docs, or LibreOffice to make edits.' },
    ],
    faqs: [
      { q: 'Will the formatting be preserved in the Word file?', a: 'Basic formatting — paragraphs, headings, bold, italic, tables — is preserved. Complex multi-column layouts may require minor clean-up in Word.' },
      { q: 'Can I convert a scanned PDF to Word?', a: 'For scanned PDFs (image-only), use our PDF OCR tool first to extract the text, then convert to Word.' },
      { q: 'What Word format does the output use?', a: 'The output is a .docx file compatible with Microsoft Word 2007 and later, Google Docs, LibreOffice, and all modern word processors.' },
      { q: 'Are images in the PDF included in the Word document?', a: 'Yes. Images are extracted and embedded in the .docx file at their original resolution.' },
      { q: 'Is the PDF sent to a server for conversion?', a: 'This conversion uses our secure cloud processing to achieve the best layout accuracy. Files are deleted immediately after download.' },
    ],
  },

  'pdf-to-excel': {
    whatIs: [
      'What is a PDF to Excel converter?',
      'A PDF to Excel converter detects tables and structured numerical data embedded in a PDF and maps them into the rows and columns of an .xlsx spreadsheet. Rather than manually retyping dozens of rows of financial figures, you can have the data in an editable, sortable spreadsheet in seconds.',
      'PDF to Excel is the go-to solution for financial analysts who receive bank statements, invoices, and reports as PDFs and need to run calculations or build charts. EditPDF AI\'s conversion accurately preserves multi-column tables, number formatting, and headers — ready for immediate use in Excel or Google Sheets.',
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
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF containing the table or spreadsheet data you want to extract.' },
      { title: 'Convert to Excel', body: 'Click Convert. The tool detects tables and structured data in the PDF and maps them to rows and columns in a .xlsx spreadsheet.' },
      { title: 'Download and work with the data', body: 'Open the .xlsx file in Excel or Google Sheets. Data is ready for sorting, filtering, and analysis.' },
    ],
    faqs: [
      { q: 'Does it accurately extract tables from PDFs?', a: 'Yes — for PDFs with embedded text and clear table structure, accuracy is high. Scanned PDFs with complex merged cells may need minor clean-up.' },
      { q: 'Can it convert multiple tables from one PDF?', a: 'Yes. All tables detected on all pages are extracted into separate sheets or sequential rows in the output spreadsheet.' },
      { q: 'What Excel format is the output?', a: 'The output is a .xlsx file compatible with Microsoft Excel 2007 and later, Google Sheets, and LibreOffice Calc.' },
      { q: 'What if my PDF is a scanned image?', a: 'Use our PDF OCR tool first to convert the scan to searchable text, then convert to Excel.' },
      { q: 'Is my file kept private?', a: 'Files are processed securely and deleted immediately after your download. They are never stored or shared.' },
    ],
  },

  'pdf-to-images': {
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
    ],
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
    whatIs: [
      'What is a PDF to PowerPoint converter?',
      'A PDF to PowerPoint converter transforms each page of a PDF into a slide in a .pptx file. The visual layout of every page is preserved as a high-quality image on its corresponding slide, giving you a PowerPoint presentation that looks identical to the source PDF and can be immediately opened in PowerPoint, Google Slides, or Keynote.',
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
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want to convert. Each page will become a slide in the PowerPoint file.' },
      { title: 'Convert to PowerPoint', body: 'Click Convert. Each PDF page is rendered as a high-quality image and placed on a PowerPoint slide.' },
      { title: 'Download and present', body: 'Open the .pptx file in PowerPoint, Google Slides, or Keynote. Add animations, speaker notes, or edit the layout.' },
    ],
    faqs: [
      { q: 'Will the PDF layout be preserved in PowerPoint?', a: 'Each page is converted to a slide image, so the visual layout is preserved exactly. Text is embedded as an image, so it is not directly editable in PowerPoint.' },
      { q: 'How many pages can I convert?', a: 'There is no hard limit. PDFs with dozens of pages convert into the equivalent number of slides.' },
      { q: 'Can I edit the text in PowerPoint after conversion?', a: 'Because each slide is a rendered image of the PDF page, text is not editable. For editable text, use our PDF to Word converter and paste content into slides manually.' },
      { q: 'What PowerPoint format is the output?', a: 'The output is a .pptx file compatible with PowerPoint 2007+, Google Slides, and LibreOffice Impress.' },
      { q: 'Is my PDF processed on a server?', a: 'Files are processed securely and deleted immediately after your download.' },
    ],
  },

  'excel-to-pdf': {
    whatIs: [
      'What is an Excel to PDF converter?',
      'An Excel to PDF converter takes an .xlsx or .xls spreadsheet and renders it as a fixed-layout PDF document. Every worksheet becomes a set of pages in the PDF, with cell colours, borders, charts, merged cells, and number formatting all faithfully reproduced — so the reader sees exactly what you designed, regardless of what software they have installed.',
      'Sharing spreadsheets as PDFs is the professional standard for financial reports, budgets, project schedules, and invoices: recipients can read and print but cannot accidentally modify the data. EditPDF AI converts your Excel file on secure servers and deletes it immediately after conversion.',
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
    steps: [
      { title: 'Upload your Excel file', body: 'Select your .xlsx or .xls spreadsheet. The conversion preserves cell formatting, borders, and formulas as static values.' },
      { title: 'Convert', body: 'Click Convert to PDF. All sheets are converted into a multi-page PDF that matches the Excel print layout.' },
      { title: 'Download the PDF', body: 'Your converted PDF is ready to download and share — no Excel installation required for viewers.' },
    ],
    faqs: [
      { q: 'Does the Excel formatting carry over to the PDF?', a: 'Yes. Cell colours, borders, fonts, merged cells, and number formatting are all preserved in the PDF output.' },
      { q: 'Are all sheets in the workbook converted?', a: 'Yes. Each worksheet becomes a separate section or set of pages in the output PDF.' },
      { q: 'Can I convert .xls (older Excel format) files?', a: 'Yes. Both .xlsx (Excel 2007+) and the older .xls format are supported.' },
      { q: 'Are charts and graphs included?', a: 'Yes. Charts embedded in the spreadsheet are rendered in the PDF at their original size and position.' },
      { q: 'Is my spreadsheet sent to a server?', a: 'The conversion runs securely on our servers to ensure accurate layout rendering. Files are deleted immediately after download.' },
    ],
  },

  'ppt-to-pdf': {
    whatIs: [
      'What is a PowerPoint to PDF converter?',
      'A PowerPoint to PDF converter takes a .pptx or .ppt presentation and converts each slide into a page in a PDF document. The visual design of every slide — backgrounds, fonts, images, charts, and text boxes — is preserved exactly in the PDF, which can then be opened on any device without PowerPoint installed.',
      'Converting a presentation to PDF is the standard way to share slides with people who only need to read them: it prevents accidental edits, eliminates font-substitution issues, and produces a significantly smaller file than the original .pptx. It is also the required format for many conference submission and printing systems.',
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
    steps: [
      { title: 'Upload your presentation', body: 'Select your .pptx or .ppt file. Slides, images, and text are all carried over to the PDF.' },
      { title: 'Convert', body: 'Click Convert to PDF. Each slide becomes a page in the PDF, preserving layouts, fonts, and graphics.' },
      { title: 'Download and share', body: 'Download the PDF and share it with anyone — no PowerPoint needed for recipients to view it.' },
    ],
    faqs: [
      { q: 'Are animations included in the PDF?', a: 'No. PDF is a static format, so animations and transitions are not included. Each slide appears in its final visual state.' },
      { q: 'Will speaker notes be included?', a: 'By default, slides only are included. Notes are not rendered in the standard conversion.' },
      { q: 'Can I convert .ppt (older PowerPoint format) files?', a: 'Yes. Both .pptx (PowerPoint 2007+) and the older .ppt format are supported.' },
      { q: 'Are embedded images and charts preserved?', a: 'Yes. All images, charts, SmartArt, and text boxes are rendered in the PDF at their original quality.' },
      { q: 'Is my file sent to a server?', a: 'Conversion runs on our secure servers for accurate rendering and files are deleted immediately after download.' },
    ],
  },

  'html-to-pdf': {
    whatIs: [
      'What is an HTML to PDF converter?',
      'An HTML to PDF converter takes a webpage — either a live URL or a local .html file — and renders it as a PDF document. The output looks exactly like the page does in a browser: styles, images, fonts, and layout are all captured. This is the standard approach for generating invoices, reports, certificates, and any other document built with HTML and CSS.',
      'Developers use HTML-to-PDF conversion to build automated document generation pipelines — every invoice or confirmation email is an HTML template that gets rendered and attached as a PDF. Content teams use it to save a clean, print-ready version of an article or data dashboard without browser chrome or adverts.',
    ],
    users: [
      { who: 'Developers & technical teams', why: 'Convert HTML invoice templates, order confirmations, and certificates to PDF as part of an automated document-generation pipeline.' },
      { who: 'Content creators & researchers', why: 'Save a clean, ad-free version of a webpage article or research page as a PDF for offline reading or citation.' },
      { who: 'Marketing & data teams', why: 'Export web-based dashboards, data visualisations, or campaign reports as shareable PDF snapshots.' },
      { who: 'Educators', why: 'Convert online course materials, web-based worksheets, or open-access textbook pages into printable PDFs for students.' },
    ],
    related: [
      { slug: 'word-to-pdf', label: 'Convert Word documents to PDF' },
      { slug: 'pdf-compressor', label: 'Compress the generated PDF' },
      { slug: 'pdf-editor', label: 'Edit the generated PDF' },
      { slug: 'pdf-annotate', label: 'Annotate the PDF with notes' },
    ],
    steps: [
      { title: 'Paste a URL or upload HTML', body: 'Enter a webpage URL or upload a local .html file. CSS stylesheets linked in the file are applied automatically.' },
      { title: 'Configure the output', body: 'Set the page size (A4, Letter), margins, and whether to include backgrounds and images.' },
      { title: 'Convert and download', body: 'Click Convert to PDF. The rendered webpage downloads as a pixel-perfect PDF.' },
    ],
    faqs: [
      { q: 'Does it support CSS and JavaScript?', a: 'CSS is fully supported including media queries. JavaScript-rendered content is captured after a short rendering delay.' },
      { q: 'Can I convert a webpage from a URL?', a: 'Yes. Paste any public URL and the page is loaded and converted including its external stylesheets and images.' },
      { q: 'What page size is used?', a: 'You can choose A4 or US Letter. Margins are configurable so content is not cut off at the edges.' },
      { q: 'Are embedded images included?', a: 'Yes. Images referenced by absolute URLs or embedded as base64 are included in the PDF.' },
      { q: 'Is the URL or HTML file kept private?', a: 'Conversion is processed securely and all data is deleted immediately after the PDF is delivered.' },
    ],
  },

  'txt-to-pdf': {
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
    ],
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
      { q: 'Is conversion done in the browser?', a: 'Yes. The entire conversion runs locally in your browser. Your text file is never uploaded.' },
    ],
  },

  'odt-to-pdf': {
    whatIs: [
      'What is an ODT to PDF converter?',
      'An ODT to PDF converter takes an OpenDocument Text (.odt) file — the default format of LibreOffice Writer and other open-source word processors — and converts it into a universally compatible PDF document. The PDF preserves fonts, styles, tables, images, headers, and footers exactly as they appear in the original.',
      'ODT files can only be opened natively in software that supports the OpenDocument standard (LibreOffice, OpenOffice, Google Docs). Converting to PDF ensures your document can be read by anyone on any device, without the recipient needing LibreOffice installed or dealing with formatting differences.',
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
    steps: [
      { title: 'Upload your ODT file', body: 'Select your .odt file created in LibreOffice Writer or any OpenDocument compatible application.' },
      { title: 'Convert to PDF', body: 'Click Convert. Fonts, styles, tables, and images from the ODT file are reproduced in the PDF.' },
      { title: 'Download the PDF', body: 'Your converted PDF downloads immediately and can be opened on any device without LibreOffice.' },
    ],
    faqs: [
      { q: 'What is an ODT file?', a: 'ODT (OpenDocument Text) is the default format for LibreOffice Writer and other open-source word processors. It is an ISO standard format.' },
      { q: 'Are tables and images preserved?', a: 'Yes. Tables, embedded images, headers, footers, and text formatting all transfer to the PDF output.' },
      { q: 'Can I convert .ods (OpenDocument Spreadsheet) or .odp (Presentation) files?', a: 'Those formats require a different conversion. Use Excel to PDF for spreadsheets and PPT to PDF for presentations.' },
      { q: 'Will custom fonts in the ODT appear correctly?', a: 'Standard fonts are embedded. Custom fonts that are not installed in our conversion environment may be substituted with a close match.' },
      { q: 'Is my ODT file processed securely?', a: 'Yes. Files are processed on secure servers and deleted immediately after conversion.' },
    ],
  },

  'rtf-to-pdf': {
    whatIs: [
      'What is an RTF to PDF converter?',
      'An RTF to PDF converter takes a Rich Text Format (.rtf) document and produces a PDF file that can be opened by anyone, anywhere, without requiring a word processor. RTF is one of the oldest and most widely supported document formats — it preserves basic formatting like bold, italic, fonts, and simple tables — and converting it to PDF locks in that appearance permanently.',
      'RTF files are still generated by many older business systems, legal software, and court management systems. Converting them to PDF is the standard way to make these documents permanently viewable, printable, and submittable to modern systems that expect PDF input.',
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
    steps: [
      { title: 'Upload your RTF file', body: 'Select your .rtf (Rich Text Format) document. RTF files are compatible with virtually all word processors.' },
      { title: 'Convert to PDF', body: 'Click Convert. Text formatting, fonts, and embedded images are reproduced in the PDF.' },
      { title: 'Download the PDF', body: 'Your PDF is ready to download and share without needing any word processing software.' },
    ],
    faqs: [
      { q: 'What is an RTF file?', a: 'RTF (Rich Text Format) is a document format developed by Microsoft that is supported by virtually all word processors including Word, Google Docs, and LibreOffice.' },
      { q: 'Is text formatting preserved?', a: 'Yes. Bold, italic, underline, font sizes, paragraph styles, and basic table structures are all carried over to the PDF.' },
      { q: 'Can I convert large RTF files?', a: 'Yes. There is no page or file size limit for RTF conversion.' },
      { q: 'Are images in the RTF file included in the PDF?', a: 'Yes. Images embedded in the RTF file are extracted and placed in the PDF at their original positions.' },
      { q: 'Is my file kept private during conversion?', a: 'Yes. Files are processed securely and deleted immediately after your PDF is ready.' },
    ],
  },

  'pdf-ocr': {
    whatIs: [
      'What is PDF OCR?',
      'PDF OCR (Optical Character Recognition) is the process of analysing a scanned PDF or photo of a document and extracting the text it contains. A scanned document is essentially just an image — the text is not selectable, searchable, or copyable. OCR reads that image, identifies the characters, and produces a searchable text layer that makes the document fully functional.',
      'OCR is the essential first step for any workflow involving scanned documents: making old paper records searchable, preparing scanned forms for data extraction, or converting printed text into a format that can be edited in Word. EditPDF AI\'s OCR supports over 100 languages and works on PDFs, JPGs, and other image formats.',
    ],
    users: [
      { who: 'Students & academics', why: 'Make scanned textbook chapters, journal articles, and reading materials searchable so you can Ctrl+F for specific terms and quotes.' },
      { who: 'Legal & compliance teams', why: 'Convert scanned contracts, court documents, and historical records into searchable PDFs for fast reference and compliance audits.' },
      { who: 'Archivists & historians', why: 'Digitise paper records, old newspapers, and historical documents into searchable text so their contents can be indexed and retrieved.' },
      { who: 'Accounts & data entry teams', why: 'Convert scanned invoices and receipts into machine-readable text for automatic extraction into accounting or ERP systems.' },
    ],
    related: [
      { slug: 'pdf-summarizer', label: 'Summarise the extracted text' },
      { slug: 'pdf-to-word', label: 'Convert the PDF to editable Word' },
      { slug: 'pdf-translator', label: 'Translate the PDF to another language' },
      { slug: 'pdf-redactor', label: 'Redact sensitive information' },
    ],
    steps: [
      { title: 'Upload a scanned PDF or image', body: 'Select a scanned PDF, a photo of a document, or any image containing text. JPG, PNG, and PDF formats are all accepted.' },
      { title: 'Run OCR', body: 'Click Scan. Our AI-powered OCR engine reads the text from the scan, supporting 100+ languages.' },
      { title: 'Copy or download', body: 'Copy the extracted text to your clipboard, or download a searchable PDF where the original image is preserved and the text is embedded and selectable.' },
    ],
    faqs: [
      { q: 'What languages does the OCR support?', a: 'Over 100 languages are supported including English, French, German, Spanish, Arabic, Chinese, Japanese, Korean, and many others.' },
      { q: 'Can I make a scanned PDF searchable with OCR?', a: 'Yes. The OCR output includes a searchable PDF where the original scan is preserved as a background image and the recognised text is embedded as an invisible text layer.' },
      { q: 'How accurate is the OCR?', a: 'For clear, high-resolution scans, accuracy is typically 95–99%. Accuracy drops for low-quality scans, unusual fonts, or handwritten text.' },
      { q: 'Does it work on handwritten text?', a: 'The OCR is optimised for printed text. Handwriting recognition is supported but accuracy varies depending on legibility.' },
      { q: 'Is my scanned document sent to a server?', a: 'OCR uses our AI backend for processing. Files are sent securely over HTTPS and deleted immediately after the result is returned.' },
    ],
  },

  'pdf-summarizer': {
    whatIs: [
      'What is an AI PDF summarizer?',
      'An AI PDF summarizer reads the full text of a PDF document and produces a concise, coherent summary that captures the key points, arguments, and conclusions — without you having to read every page. Unlike a keyword search or a table of contents, the AI understands context, so the summary explains what the document means, not just what words appear in it.',
      'PDF summarisation is used across research, business, and law to handle the volume of documents that needs to be reviewed every day. A 60-page contract, a 200-page annual report, or a 40-page research paper can each be reduced to a paragraph or structured bullet points in under a minute with EditPDF AI.',
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
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want summarised. Reports, research papers, contracts, and books all work.' },
      { title: 'Generate summary', body: 'Click Summarise. Our AI reads the full document and produces a concise summary that captures the key points.' },
      { title: 'Read or export', body: 'Read the summary on screen or copy it to use in notes, emails, or reports. Bullet-point and paragraph modes are available.' },
    ],
    faqs: [
      { q: 'How long can the PDF be?', a: 'Free users can summarise documents up to a certain page limit. Pro users get unlimited length, supporting research papers, annual reports, and full books.' },
      { q: 'How accurate is the summary?', a: 'The summary is generated by a large language model that understands context, so it captures the main arguments and key figures rather than just the first sentence of each paragraph.' },
      { q: 'Can it summarise legal or technical documents?', a: 'Yes. The AI handles technical vocabulary in legal, medical, financial, and scientific documents. For very specialised jargon, the summary uses the original terminology.' },
      { q: 'Does it work on scanned PDFs?', a: 'Scanned PDFs must contain a text layer (created by OCR) for summarisation to work. Use our PDF OCR tool first if the PDF is image-only.' },
      { q: 'Is my document content sent to an AI server?', a: 'The text content of your document is sent to our AI for processing. Raw file bytes are never transmitted — only the extracted text.' },
    ],
  },

  'pdf-translator': {
    whatIs: [
      'What is a PDF translator?',
      'A PDF translator extracts the text from a PDF and uses AI to translate it into a different language, then delivers the result as a new PDF with the original layout preserved. Instead of receiving a plain text dump, you get a translated document that mirrors the structure of the original — paragraphs, headings, and sections in the right order.',
      'PDF translation removes the language barrier for contracts, technical manuals, academic papers, and business correspondence. EditPDF AI supports over 50 languages in both directions and uses large language models that understand context, producing translations significantly more natural than word-for-word machine translation.',
    ],
    users: [
      { who: 'Global business teams', why: 'Translate supplier contracts, partner agreements, and technical specifications received in a foreign language for internal review.' },
      { who: 'Students & academics', why: 'Translate foreign-language research papers and journal articles to read the content in your native language.' },
      { who: 'Immigration & legal applicants', why: 'Translate personal documents — birth certificates, academic transcripts, marriage certificates — from one language to another for visa applications.' },
      { who: 'Researchers & NGOs', why: 'Translate policy documents, reports, and fieldwork findings from local languages into English for international publication.' },
    ],
    related: [
      { slug: 'pdf-ocr', label: 'Extract text from a scanned PDF' },
      { slug: 'pdf-summarizer', label: 'Summarise the translated document' },
      { slug: 'pdf-annotate', label: 'Add translation notes to the PDF' },
      { slug: 'pdf-to-word', label: 'Convert the PDF to Word for editing' },
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF you want translated. The document\'s text content is extracted for translation.' },
      { title: 'Choose target language', body: 'Select from 50+ supported languages. The AI preserves the original document structure while translating the text.' },
      { title: 'Download the translated PDF', body: 'The translated content is placed back into a PDF with the original layout preserved — not a plain text dump.' },
    ],
    faqs: [
      { q: 'How many languages are supported?', a: 'Over 50 languages are supported for both input and output, including English, Spanish, French, German, Portuguese, Arabic, Chinese, Japanese, Korean, Hindi, and more.' },
      { q: 'Does the translated PDF keep the original layout?', a: 'Yes. The translation is placed back into the original PDF page structure, preserving paragraph positions and formatting. Complex multi-column layouts may have minor differences.' },
      { q: 'How is the translation quality?', a: 'Translation is powered by advanced large language models that understand context, so the quality is significantly better than word-for-word machine translation.' },
      { q: 'Can it translate technical or legal documents?', a: 'Yes. The AI handles domain-specific terminology in legal, medical, and technical documents, keeping specialised terms accurate where possible.' },
      { q: 'Is my document sent to a server for translation?', a: 'The text content is sent securely to our AI backend for translation. Raw file bytes stay on your device. Extracted text is deleted after the translated PDF is generated.' },
    ],
  },

  'pdf-redactor': {
    whatIs: [
      'What is PDF redaction?',
      'PDF redaction is the permanent removal of sensitive text or images from a PDF document, replaced with solid black bars. Unlike highlighting text or drawing a black box on top, true redaction removes the underlying content from the PDF data itself — the redacted information cannot be recovered by selecting the area, viewing the source, or removing a layer.',
      'Redaction is the legally required method for removing confidential information before disclosing documents in legal proceedings, responding to freedom of information requests, or sharing documents that contain a mix of public and private data. EditPDF AI\'s redactor removes content permanently, with an optional AI scanner to detect sensitive patterns automatically.',
    ],
    users: [
      { who: 'Legal teams & law firms', why: 'Redact privileged information, opposing party details, and third-party personal data from documents before court production and discovery.' },
      { who: 'Government & public sector', why: 'Remove personal details and classified information from documents before publishing them in response to freedom of information requests.' },
      { who: 'HR & people teams', why: 'Redact names, salaries, and personal identifiers from employee documents before sharing with external auditors or legal review.' },
      { who: 'Healthcare & clinical teams', why: 'Remove patient names, dates of birth, and identifiers from medical records and clinical reports before sharing for research or review.' },
    ],
    related: [
      { slug: 'pdf-password-lock', label: 'Password-protect the redacted PDF' },
      { slug: 'pdf-watermark', label: 'Add a confidential watermark' },
      { slug: 'pdf-editor', label: 'Edit the PDF before redacting' },
      { slug: 'pdf-ocr', label: 'Extract text before redacting' },
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Select the PDF containing sensitive information you want to permanently remove.' },
      { title: 'Select text to redact', body: 'Highlight text on the page or use the AI-assisted detection to find names, dates, phone numbers, and other sensitive patterns automatically.' },
      { title: 'Apply and download', body: 'Click Redact. The selected content is permanently removed and replaced with black bars. Download the sanitised PDF.' },
    ],
    faqs: [
      { q: 'Is the redaction permanent?', a: 'Yes. The text is removed from the PDF content stream entirely and replaced with a solid black rectangle. It cannot be recovered by selecting, copying, or viewing the source.' },
      { q: 'Can AI detect what to redact automatically?', a: 'Yes. The AI scanner can identify patterns like names, email addresses, phone numbers, dates, and financial figures. You review and approve the suggestions before applying.' },
      { q: 'Does redaction work on scanned PDFs?', a: 'For scanned PDFs (image-only), the redaction removes the image pixels in the selected area. Run OCR first if you need text-based detection on a scanned document.' },
      { q: 'Can I redact images as well as text?', a: 'Yes. Draw a redaction box over any area — text or image — and it will be permanently blacked out in the output.' },
      { q: 'Is the unredacted document sent to any server?', a: 'The original PDF is processed securely. If AI detection is used, text is sent to our AI backend. All data is deleted immediately after processing.' },
    ],
  },

  'pdf-annotate': {
    whatIs: [
      'What is a PDF annotator?',
      'A PDF annotator lets you add notes, highlights, drawings, stamps, and text comments directly onto a PDF without altering the original content. Annotations are saved as a standard layer in the PDF file, so they appear in any PDF viewer — Adobe Acrobat, Apple Preview, Chrome, or any mobile reader — without requiring the annotator software to be installed.',
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
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Open the PDF you want to annotate. It loads directly in the browser-based editor.' },
      { title: 'Add annotations', body: 'Highlight text, add sticky notes, draw freehand, insert text boxes, or use shapes. All tools are in the toolbar.' },
      { title: 'Save and download', body: 'Click Save. The annotations are embedded in the PDF and will appear in any PDF viewer, including Adobe Reader.' },
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
    whatIs: [
      'What is a PDF form builder?',
      'A PDF form builder lets you create interactive, fillable PDF forms — with text fields, checkboxes, radio buttons, dropdowns, and signature boxes — without any design or coding skills. You can start from a blank page or upload an existing PDF and add form fields on top of it. The output is a standard fillable PDF that anyone can complete in Adobe Reader or any modern PDF viewer.',
      'Fillable PDF forms replace paper forms for data collection in business, healthcare, education, and government. The recipient fills in the fields digitally, saves the completed form, and returns it — no printing required. EditPDF AI\'s form builder is free with no limits on fields or pages.',
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
    ],
    steps: [
      { title: 'Start with a blank page or PDF', body: 'Open a blank form or upload an existing PDF as the base. The form builder works on top of your chosen background.' },
      { title: 'Add form fields', body: 'Drag and drop text inputs, checkboxes, radio buttons, dropdowns, signatures, and date fields anywhere on the page.' },
      { title: 'Export and share', body: 'Download the fillable PDF form. Anyone with a PDF viewer can fill in the fields and save or print it.' },
    ],
    faqs: [
      { q: 'Can I make an existing PDF fillable?', a: 'Yes. Upload any PDF and use the form builder to add interactive form fields on top of it. The original content is preserved as a background.' },
      { q: 'What field types are supported?', a: 'Text inputs, multi-line text areas, checkboxes, radio button groups, dropdown menus, date pickers, and signature fields are all available.' },
      { q: 'Can people fill in the form without creating an account?', a: 'Yes. The output is a standard fillable PDF that anyone can open and complete in Adobe Reader, Preview, or any modern PDF viewer — no account needed.' },
      { q: 'Can I pre-fill some fields with default values?', a: 'Yes. You can set default text for any field in the form builder. The recipient sees the defaults and can overwrite them.' },
      { q: 'Is the form builder free?', a: 'Yes. Building and downloading fillable PDF forms is free with no page or field count limits.' },
    ],
  },

  'ai-pdf-form-filler': {
    whatIs: [
      'What is an AI PDF form filler?',
      'An AI PDF form filler automatically detects input fields inside a PDF — named fields in interactive AcroForms, blank lines in scanned documents, tables, and checkboxes — and populates them based on context you provide. Instead of clicking through every field manually, you paste your details once and AI fills the entire form in seconds.',
      'EditPDF AI\'s form filler handles both fillable and non-fillable PDFs. Interactive forms are filled natively. Flat or scanned forms use OCR to detect field positions, then AI overlays the correct text. The result looks identical to a hand-filled form. All processing runs in your browser — your personal data and your document are never stored on any server.',
    ],
    users: [
      { who: 'Job seekers & professionals', why: 'Auto-fill job application forms, cover letter templates, and HR onboarding packs in seconds instead of retyping the same information repeatedly.' },
      { who: 'Students & academics', why: 'Complete enrolment forms, scholarship applications, and grant paperwork without re-entering the same details across dozens of documents.' },
      { who: 'Small business owners', why: 'Fill government registration forms, supplier agreements, and tax documents quickly without expensive admin software.' },
      { who: 'Legal & compliance teams', why: 'Populate standard intake forms, declarations, and applications from a client data sheet, saving hours of manual data entry.' },
    ],
    related: [
      { slug: 'pdf-editor',      label: 'Edit and annotate your PDF manually' },
      { slug: 'pdf-signer',      label: 'Add a signature to a filled form' },
      { slug: 'pdf-ocr',         label: 'Extract text from a scanned PDF' },
      { slug: 'pdf-form-builder', label: 'Build your own fillable PDF form' },
    ],
    steps: [
      { title: 'Upload a PDF form', body: 'Open any fillable PDF form or a form-style document. The AI scans for all fields — named fields, blank lines, tables, and checkboxes.' },
      { title: 'Provide your information', body: 'Paste your CV, upload an ID card photo, or just type your information in the chat. The AI maps your data to the right fields automatically.' },
      { title: 'Review and download', body: 'Check the auto-filled form, make any corrections, and download the completed PDF in seconds.' },
    ],
    faqs: [
      { q: 'What types of information can the AI fill automatically?', a: 'Name, date of birth, address, email, phone, employer, education, and other standard personal information. The AI maps your data to the correct form fields by understanding their labels.' },
      { q: 'Can I fill a form from a photo of my ID card?', a: 'Yes. Upload a photo of your passport, driver\'s licence, or ID card and the AI extracts the relevant data and fills matching fields in the form.' },
      { q: 'What if the AI fills a field incorrectly?', a: 'All fields are editable after auto-fill. Review each field and click to correct any mistakes before downloading.' },
      { q: 'Can it fill non-fillable PDFs (plain text forms)?', a: 'Yes. The AI can detect blank underlines, tables, and labelled spaces in non-fillable PDFs and fill them using text overlays.' },
      { q: 'Is my personal information stored?', a: 'No. Your data is used only to fill the form during your session and is not stored, logged, or used for any other purpose.' },
    ],
  },

  'mind-map': {
    whatIs: [
      'What is an AI PDF mind map generator?',
      'An AI PDF mind map generator reads a document and automatically constructs a visual mind map showing the document\'s main topics, subtopics, and the relationships between ideas. Instead of manually diagramming a complex report or textbook chapter, you upload the PDF and the AI produces a structured, interactive map in seconds.',
      'Mind maps are one of the most effective tools for understanding and remembering complex information. Seeing ideas arranged as a visual hierarchy — with branches and sub-branches — makes it easier to spot the structure of an argument, the relationships between concepts, and the relative importance of different topics. EditPDF AI builds the map from the actual document content, not a keyword frequency analysis.',
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
    steps: [
      { title: 'Upload your PDF', body: 'Select the document you want to turn into a mind map — a report, textbook chapter, meeting notes, or research paper.' },
      { title: 'Generate the map', body: 'Click Generate. The AI reads the document, identifies the main topics and sub-topics, and builds an interactive mind map.' },
      { title: 'Explore and export', body: 'Expand and collapse branches, click nodes to see source excerpts, and export the mind map as an image or JSON.' },
    ],
    faqs: [
      { q: 'How long can the document be?', a: 'Pro users can process documents of any length. Free users have a page limit per session.' },
      { q: 'How does the AI decide which topics become branches?', a: 'The AI identifies headings, recurring concepts, and key entities and organises them into a hierarchy based on how the document structures information.' },
      { q: 'Can I edit the mind map after it is generated?', a: 'Yes. You can rename nodes, add new branches, delete branches, and reorder the map to match your own understanding.' },
      { q: 'Can I export the mind map?', a: 'Yes. Export as a PNG image for presentations, or as a JSON file to import into other mind mapping tools.' },
      { q: 'Does my document get sent to a server?', a: 'The text content is sent to our AI backend for analysis. Raw file bytes are never transmitted. Text is deleted after the mind map is generated.' },
    ],
  },

  'quiz-creator': {
    whatIs: [
      'What is an AI quiz creator from PDF?',
      'An AI quiz creator from PDF reads a document and generates a set of test questions based on the actual content — multiple-choice, true/false, or short-answer — complete with correct answers. This turns any PDF into an instant study guide, practice exam, or classroom assessment without the hours of manual question-writing.',
      'The AI generates questions that test genuine comprehension of the material, not just keyword recognition. Questions are grounded in specific facts, arguments, and details in the source document, and every answer is traceable back to the original text. EditPDF AI\'s quiz creator is used by students, teachers, and corporate trainers to turn documents into active learning tools.',
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
    steps: [
      { title: 'Upload your PDF', body: 'Select the study material, textbook chapter, or notes you want to create a quiz from.' },
      { title: 'Generate questions', body: 'Choose the number of questions and the difficulty level. The AI reads the content and generates multiple-choice or short-answer questions.' },
      { title: 'Take the quiz or export it', body: 'Take the quiz interactively in the browser, or download the questions as a PDF or CSV file to use in a classroom or LMS.' },
    ],
    faqs: [
      { q: 'What types of questions can be generated?', a: 'Multiple-choice questions with four options, true/false questions, and short-answer questions are all supported.' },
      { q: 'How many questions can be generated?', a: 'Free users can generate up to 10 questions per session. Pro users can generate up to 50 questions per document.' },
      { q: 'Are the questions accurate to the source material?', a: 'Questions are grounded in the document content. The AI does not invent facts — all answers are traceable to the source PDF.' },
      { q: 'Can I edit the questions before using them?', a: 'Yes. All generated questions and answers are editable before you download or take the quiz.' },
      { q: 'Is my document sent to a server?', a: 'The text is sent to our AI backend for question generation and deleted immediately after the quiz is created.' },
    ],
  },

  'pdf-editor': {
    whatIs: [
      'What is an online PDF editor?',
      'An online PDF editor lets you open a PDF in your browser and make direct changes to its content — editing text, replacing images, adding new content, filling form fields, inserting annotations, and managing pages — without installing Adobe Acrobat or any other software. Changes are embedded into the PDF and downloaded as a standard file that works in any viewer.',
      'Most PDF files are locked after creation, but an online PDF editor gives you the tools to update them: fix a typo in a contract, update an address on an invoice, add a logo to a form, or remove a page from a report. EditPDF AI\'s editor runs entirely in your browser using WebAssembly, so your document never leaves your device.',
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
    steps: [
      { title: 'Open your PDF', body: 'Upload any PDF — a contract, invoice, report, or form. It loads in the full-featured browser editor instantly.' },
      { title: 'Edit text, images, and pages', body: 'Click text to edit it in place, add or replace images, insert new pages, add shapes and annotations, and fill in form fields.' },
      { title: 'Save and download', body: 'Click Download to save your edited PDF. The output is a standard PDF compatible with any viewer.' },
    ],
    faqs: [
      { q: 'Can I edit text directly in a PDF?', a: 'Yes. Click any text block to enter edit mode. You can change words, correct typos, adjust font size, and reformat paragraphs.' },
      { q: 'Can I add images to a PDF?', a: 'Yes. Insert images by uploading a JPG or PNG. Resize and reposition them anywhere on the page.' },
      { q: 'Can I delete or add pages?', a: 'Yes. Use the page manager to delete unwanted pages, insert blank pages, or drag to reorder pages.' },
      { q: 'Does it work with password-protected PDFs?', a: 'You need the PDF open password to load a protected file. Once entered, you can edit the unlocked content.' },
      { q: 'Is my PDF sent to a server for editing?', a: 'No. All editing runs in your browser using WebAssembly and PDF.js. Your file never leaves your device.' },
    ],
  },

  'pdf-viewer': {
    whatIs: [
      'What is an online PDF viewer?',
      'An online PDF viewer lets you open and read any PDF document directly in your browser — no Adobe Acrobat, no software installation, and no file download required. You get full navigation controls, text search, zoom, and on mobile, swipe and pinch-to-zoom — all from a browser tab on any device.',
      'An online viewer is the fastest way to check a PDF before deciding whether to download it, or to open a file on a device where no PDF software is installed. EditPDF AI\'s viewer also gives you the option to annotate, print, or pass the document directly into any of the editing tools without having to re-upload it.',
    ],
    users: [
      { who: 'Remote workers & students', why: 'Open PDFs from email attachments, cloud links, or shared drives instantly in the browser without waiting for a download or opening heavy desktop software.' },
      { who: 'Mobile device users', why: 'Read PDFs on a phone or tablet with full touch support — swipe between pages, pinch to zoom, and search for text.' },
      { who: 'Anyone without Adobe Acrobat', why: 'View any PDF — including forms, certificates, and official documents — on a device that has no PDF reader installed.' },
      { who: 'Reviewers & approvers', why: 'Quickly check a PDF before approving it for distribution, without having to download or save the file to your device.' },
    ],
    related: [
      { slug: 'pdf-editor', label: 'Edit the PDF you are viewing' },
      { slug: 'pdf-annotate', label: 'Annotate and comment on the PDF' },
      { slug: 'pdf-ocr', label: 'Extract text from the PDF' },
      { slug: 'pdf-summarizer', label: 'Summarise the PDF content' },
    ],
    steps: [
      { title: 'Open a PDF', body: 'Drag a PDF onto the viewer or click to browse. It loads instantly in your browser — no download or install required.' },
      { title: 'Navigate and search', body: 'Use the page thumbnail panel to jump between pages, or press Ctrl+F to search for text. Zoom in and out with the controls or pinch-to-zoom on mobile.' },
      { title: 'Print or annotate', body: 'Print the document directly from the viewer, or switch to annotation mode to add highlights and notes.' },
    ],
    faqs: [
      { q: 'Can I view a PDF without downloading it?', a: 'Yes. PDFs open instantly in the browser viewer — no install and no download required.' },
      { q: 'Does the viewer work on mobile?', a: 'Yes. The viewer is fully responsive with touch support for swiping between pages and pinch-to-zoom.' },
      { q: 'Can I search for text inside the PDF?', a: 'Yes. Press Ctrl+F (or Cmd+F on Mac) to open the search panel and find any text in the document.' },
      { q: 'Can I view password-protected PDFs?', a: 'Yes. Enter the password when prompted and the document opens normally.' },
      { q: 'Is the PDF sent to any server?', a: 'No. The PDF is rendered entirely in your browser using PDF.js. Your file is never uploaded.' },
    ],
  },

  'pdf-cropper': {
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
    whatIs: [
      'What is a PDF page extractor?',
      'A PDF page extractor lets you select specific pages from within a PDF and save them as a new, standalone PDF file. Unlike splitting (which divides a PDF by sequential ranges), extraction lets you cherry-pick any combination of pages — page 1, page 7, and pages 22–25 — regardless of where they appear in the original document.',
      'Extracting pages is the right tool when you need to share or submit only a specific subset of a document: a single contract exhibit from a full closing binder, the financial pages from a long proposal, or one chapter from a multi-chapter report. EditPDF AI extracts pages entirely in your browser — the original file is never modified.',
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
      { q: 'Is my PDF processed on a server?', a: 'No. Extraction runs in your browser. Your file never leaves your device.' },
    ],
  },

  'delete-pages': {
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
      { q: 'Is my file sent to a server?', a: 'No. Page deletion runs in your browser. Your PDF is never uploaded.' },
    ],
  },

  'add-page-numbers': {
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
    ],
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
      'A PDF page manager gives you full control over the page structure of a PDF document from a single interface. You can reorder pages by dragging, rotate individual pages, delete unwanted pages, and insert blank pages — then save all changes to a new PDF in one step. It is the all-in-one alternative to performing each of these operations separately.',
      'Page management is most useful when a document needs significant structural reorganisation: a report where chapters arrived in the wrong order, a merged PDF where pages from different sources need to be interleaved, or a scanned document with blank pages and sideways pages mixed in. EditPDF AI\'s page manager runs entirely in your browser.',
    ],
    users: [
      { who: 'Document editors & administrators', why: 'Reorganise, clean up, and standardise multi-page PDFs — reordering chapters, removing blanks, and correcting orientations — in a single session.' },
      { who: 'Legal & compliance teams', why: 'Restructure PDF bundles and filings to match required court or regulatory page ordering before submission.' },
      { who: 'Publishers & content creators', why: 'Reorder pages of a layout proof, insert missing pages, and remove placeholder pages to prepare a final print-ready PDF.' },
      { who: 'Students & academic submitters', why: 'Reorder the sections of a compiled thesis, add a title page, and remove draft pages to produce the final submission PDF.' },
    ],
    related: [
      { slug: 'pdf-splitter', label: 'Split the organised PDF' },
      { slug: 'pdf-merger', label: 'Merge PDFs before organising pages' },
      { slug: 'rotate-pdf', label: 'Rotate individual pages' },
      { slug: 'extract-pages', label: 'Extract selected pages' },
    ],
    steps: [
      { title: 'Upload your PDF', body: 'Open the PDF you want to reorganise. All pages appear as thumbnails in the page manager.' },
      { title: 'Reorder, rotate, or delete pages', body: 'Drag page thumbnails to reorder them. Click the rotate button on any thumbnail to rotate that page. Click delete to remove a page.' },
      { title: 'Save the reorganised PDF', body: 'Click Save. The reorganised PDF downloads with your new page order and any rotations applied.' },
    ],
    faqs: [
      { q: 'Can I reorder pages in a PDF?', a: 'Yes. Drag and drop page thumbnails into any order. The final PDF reflects the new sequence.' },
      { q: 'Can I combine reordering, rotating, and deleting in one step?', a: 'Yes. Make all your changes — drag to reorder, rotate individual pages, delete unwanted pages — then save once to apply everything.' },
      { q: 'Is there a limit on the number of pages I can manage?', a: 'No. The page manager works with PDFs of any length.' },
      { q: 'Can I insert blank pages?', a: 'Yes. Use the Insert Page button to add a blank page at any position in the document.' },
      { q: 'Is my PDF processed locally or on a server?', a: 'All processing runs in your browser. Your PDF never leaves your device.' },
    ],
  },

}

const dataWithSlugs: Record<string, ToolSEOData> = Object.fromEntries(
  Object.entries(data).map(([slug, d]) => [slug, { ...d, toolSlug: slug }])
)

export default dataWithSlugs
