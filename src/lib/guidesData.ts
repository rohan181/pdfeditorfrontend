export type ContentBlock =
  | { type: 'p';     text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'list';  items: string[] }
  | { type: 'tip';   heading: string; text: string }

export interface GuideSection {
  heading: string
  blocks: ContentBlock[]
}

export interface GuideInternalLink {
  href: `/${string}`
  title: string
  description: string
}

export interface Guide {
  slug:          string
  title:         string
  seoTitle:      string
  description:   string
  intro:         string
  toolSlug:      string
  toolName:      string
  ctaLabel:      string
  readTime:      string
  datePublished?: string
  dateModified?:  string
  sections:      GuideSection[]
  relatedLinks?: GuideInternalLink[]
}

const guides: Guide[] = [
  {
    slug:          'how-to-edit-a-pdf-without-adobe',
    title:         'How to Edit a PDF Without Adobe Acrobat',
    seoTitle:      'How to Edit a PDF Without Adobe Acrobat — Free & Online',
    description:   'Learn how to add text, images and page changes to a PDF in your browser without installing Adobe Acrobat or creating an EditPDF AI account.',
    intro:         'You can make common PDF changes in a current browser without installing a desktop editor. EditPDF AI supports adding text and images, annotations, form values, and page changes; the original file remains unchanged until you download a new copy.',
    toolSlug:      'pdf-editor',
    toolName:      'PDF Editor',
    ctaLabel:      'Edit a PDF free →',
    readTime:      '4 min read',
    sections: [
      {
        heading: 'What "editing a PDF" actually means',
        blocks: [
          { type: 'p', text: 'PDF editing covers several distinct tasks. It helps to know which one you need before you start:' },
          { type: 'list', items: [
            'Correcting text — fixing typos, updating names, changing dates or figures',
            'Replacing or inserting images — swapping a logo, adding a photo',
            'Managing pages — deleting a page, inserting a blank one, reordering chapters',
            'Filling in forms — entering text into existing form fields',
            'Adding annotations — highlighting, comments, sticky notes',
          ]},
          { type: 'p', text: 'EditPDF AI provides controls for these common workflows, although exact editing support depends on how the source PDF was constructed.' },
        ],
      },
      {
        heading: 'Step-by-step: edit a PDF in your browser',
        blocks: [
          { type: 'steps', items: [
            'Open EditPDF AI\'s PDF Editor (editpdfai.com/pdf-editor) in any browser. No account or install required.',
            'Click "Open PDF" or drag your file onto the page. The document loads immediately.',
            'Use the text controls to add a text overlay or replacement text where needed; PDFs do not always expose existing text like a word processor document.',
            'Use the Image tool in the toolbar to insert a new image or replace an existing one.',
            'Open the Pages panel to delete, duplicate, or reorder pages by dragging thumbnails.',
            'Click Download when you are done. The edited PDF saves to your device.',
          ]},
          { type: 'tip', heading: 'Local manual editing', text: 'The core editor processes the selected PDF locally in your browser without an application document-processing request. Optional AI form actions have separate data handling.' },
        ],
      },
      {
        heading: 'What you can and cannot edit',
        blocks: [
          { type: 'p', text: 'Browser-based editors handle the most common editing tasks well. There are a few things to be aware of:' },
          { type: 'list', items: [
            'Supported workflows include adding text and images, changing page structure, completing supported form fields, and adding annotations',
            'May not edit perfectly: complex multi-column magazine layouts where text flows between columns',
            'Cannot edit: vector illustrations embedded as paths (would need a vector editor like Inkscape)',
          ]},
          { type: 'p', text: 'If you click on text and nothing happens, the PDF is likely scanned (image-only). Run it through the OCR tool first to add a selectable text layer.' },
        ],
      },
      {
        heading: 'Practical tips',
        blocks: [
          { type: 'list', items: [
            'Edit one section at a time on large documents — save frequently by downloading and re-uploading',
            'If the font looks different after editing, the PDF uses an embedded font that is not available in the browser editor; try matching it manually or use a text box instead',
            'For PDFs you receive regularly with only a few fields to update, the PDF Form Filler is faster than the full editor',
          ]},
        ],
      },
    ],
  },

  {
    slug:          'how-to-reduce-pdf-file-size',
    title:         'How to Reduce PDF File Size and Manage Image Quality',
    seoTitle:      'How to Reduce PDF File Size Online — Compression Guide',
    description:   'Learn how PDF compression changes image quality and file size, how to choose a suitable compression level and how to compare the downloaded result.',
    intro:         'PDF compression trades image detail and resolution for a smaller file. Understanding the available levels helps you choose an acceptable balance and check the downloaded result.',
    toolSlug:      'pdf-compressor',
    toolName:      'PDF Compressor',
    ctaLabel:      'Compress a PDF free →',
    readTime:      '4 min read',
    sections: [
      {
        heading: 'Why PDFs get so large',
        blocks: [
          { type: 'p', text: 'File size depends almost entirely on what is embedded inside the PDF:' },
          { type: 'list', items: [
            'High-resolution images — larger pixel dimensions and lighter source compression generally increase file size',
            'Scanned pages — each scanned page is stored as a full-resolution image, not compressed text',
            'Embedded fonts — entire font files are included so the document looks correct on any device',
            'Colour profiles and metadata — ICC colour data, document history, and XMP metadata all add bytes',
          ]},
          { type: 'p', text: 'Image-heavy and scanned PDFs often offer more opportunity for size reduction than documents with mostly text and vector content.' },
        ],
      },
      {
        heading: 'The three compression levels explained',
        blocks: [
          { type: 'list', items: [
            'Low — renders pages at 300 DPI and encodes them as JPEG at 0.92 quality for the closest result among the available levels.',
            'Medium — renders pages at 200 DPI and uses 0.82 JPEG quality for a balance between output size and visual detail.',
            'High — renders pages at 150 DPI and uses 0.70 JPEG quality for smaller screen-oriented output.',
            'Maximum — renders pages at 96 DPI and uses 0.50 JPEG quality for the smallest available output, with more visible image degradation.',
          ]},
          { type: 'tip', heading: 'The output is image-based', text: 'This compressor renders each complete page to JPEG. Text is no longer selectable or searchable in the output and can lose visual sharpness, especially at stronger settings.' },
        ],
      },
      {
        heading: 'Step-by-step: compress a PDF',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-compressor and upload your PDF (drag and drop or click to browse).',
            'Select a compression level. Start with Balanced unless you have a specific reason for Light or Maximum.',
            'Click Compress PDF.',
            'Download the compressed file. Compare the reported before and after sizes and inspect text and images at normal zoom.',
          ]},
        ],
      },
      {
        heading: 'Realistic expectations by document type',
        blocks: [
          { type: 'list', items: [
            'Scanned documents and photo-heavy pages often shrink more because the tool can reduce rendered resolution and JPEG quality.',
            'Text-heavy pages may show smaller gains and lose searchability because the output is flattened to page images.',
            'PDFs that were already aggressively compressed may not become smaller; compare the reported output size before keeping the result.',
          ]},
        ],
      },
      {
        heading: 'When not to use maximum compression',
        blocks: [
          { type: 'list', items: [
            'Archival copies — use Light to preserve quality for long-term storage',
            'Medical imaging documents — pixel accuracy may be required',
            'Legal exhibits where image clarity can be questioned',
            'Documents that will be printed larger than A4 (compression artefacts become visible)',
          ]},
        ],
      },
    ],
  },

  {
    slug:          'how-to-fill-out-a-pdf-form-automatically',
    title:         'How to Fill Out a PDF Form Automatically with AI',
    seoTitle:      'How to Fill a PDF Form with AI — Review Suggested Fields',
    description:   'Learn how AI proposes values for detected PDF form fields, what information may be processed and what to review before downloading the completed copy.',
    intro:         'An AI form filler can propose values for detected fields using details you provide by text, document, or image. The suggestions may be incomplete or wrong, so review every field, date, checkbox, and identifier before downloading or submitting the form.',
    toolSlug:      'ai-pdf-form-filler',
    toolName:      'AI PDF Form Filler',
    ctaLabel:      'Fill a form automatically →',
    readTime:      '5 min read',
    sections: [
      {
        heading: 'Which PDF form types can be analysed?',
        blocks: [
          { type: 'list', items: [
            'Interactive PDFs contain embedded form fields that the workflow can detect and propose values for.',
            'Flat or scanned forms do not contain reliable fields. The workflow can analyse page images and propose positioned overlays, but detection depends on layout and scan quality.',
          ]},
          { type: 'p', text: 'The workflow analyses the uploaded document, but it may miss fields or place suggestions incorrectly. The on-page review is required for both form types.' },
        ],
      },
      {
        heading: 'Step-by-step: auto-fill a form',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/ai-pdf-form-filler in your browser.',
            'Upload your PDF form. The workflow analyses supported fields and page regions.',
            'Choose how to provide your information: paste the text of your CV, upload a photo of an ID card or passport, or type key details directly in the chat panel.',
            'Review each proposed mapping on screen and reject or correct anything that does not match the source information.',
            'Use the available editor controls to correct proposed values before downloading.',
            'Download the completed PDF.',
          ]},
        ],
      },
      {
        heading: 'What information can the AI attempt to match?',
        blocks: [
          { type: 'list', items: [
            'Personal details: full name, date of birth, nationality, gender',
            'Contact information: email, phone number, postal address',
            'Employment details from a CV: job title, employer name, start date, responsibilities',
            'Education history: institution name, degree, graduation year',
            'ID card data when a photo is uploaded: name, date of birth, ID number, expiry date',
          ]},
        ],
      },
      {
        heading: 'What to check before downloading',
        blocks: [
          { type: 'list', items: [
            'Dates — the AI may format dates as DD/MM/YYYY when the form expects MM/DD/YYYY, or vice versa. Always verify.',
            'Checkboxes and radio buttons — review that Yes/No or True/False selections match your intent, especially for questions with legal implications.',
            'Signature fields — add your signature manually after downloading using the PDF Signer.',
            'Fields left blank — the AI skips fields it cannot confidently match. Fill these manually.',
          ]},
          { type: 'tip', heading: 'How AI form data is handled', text: 'AI form workflows may send entered details, extracted text, page images, uploaded images, or a PDF through server routes and configured processing providers. The application code does not write document content to its database or object storage; provider handling also applies.' },
          { type: 'tip', heading: 'AI accuracy warning', text: 'AI-generated field suggestions can be incomplete, incorrectly mapped, or factually wrong. Verify every value against your source documents, especially identifiers, dates, financial details, declarations, and legally significant answers.' },
        ],
      },
    ],
  },

  {
    slug:          'how-to-sign-a-pdf-online',
    title:         'How to Sign a PDF Online (Free, No Software Needed)',
    seoTitle:      'How to Sign a PDF Online Free — No Adobe, No Printing',
    description:   'Learn how to draw, type or upload a signature, place it on a PDF page and download the signed copy in your browser without installing Adobe Acrobat.',
    intro:         'You can place a drawn, typed, or uploaded signature image on a PDF without printing it or installing Adobe Acrobat. Recipient and legal acceptance depends on the document and jurisdiction.',
    toolSlug:      'pdf-signer',
    toolName:      'PDF Signer',
    ctaLabel:      'Sign a PDF free →',
    readTime:      '4 min read',
    sections: [
      {
        heading: 'Will a visual PDF signature be accepted?',
        blocks: [
          { type: 'p', text: 'EditPDF AI places a visual signature image on the PDF. It does not verify identity or create a certificate-backed digital signature. Acceptance depends on the recipient, document type, and applicable jurisdiction.' },
          { type: 'p', text: 'Confirm the recipient\'s requirements before signing. Seek qualified legal advice when the document has legal consequences or requires identity verification, witnessing, notarisation, or a particular signature standard.' },
        ],
      },
      {
        heading: 'Three ways to create your signature',
        blocks: [
          { type: 'list', items: [
            'Draw — use your mouse on desktop or your finger on a touchscreen. The most natural-looking option on mobile.',
            'Type — enter your name and choose from handwriting-style fonts. Quick and clean on desktop.',
            'Upload — photograph your handwritten signature on paper, upload it as PNG or JPG. Use a white or transparent background for the best result.',
          ]},
        ],
      },
      {
        heading: 'Step-by-step: sign a PDF with EditPDF AI',
        blocks: [
          { type: 'steps', items: [
            'Go to editpdfai.com/pdf-signer and open the PDF you need to sign.',
            'Click the Signature tool in the toolbar on the left.',
            'Choose Draw, Type, or Upload and create your signature.',
            'Click anywhere on the document page to place the signature.',
            'Drag to reposition it and use the corner handles to resize it.',
            'Repeat for any additional pages that need a signature or initials.',
            'Click Download to save the signed PDF.',
          ]},
          { type: 'tip', heading: 'The signature is embedded permanently', text: 'The signature is flattened into the PDF content. It cannot be removed or repositioned after you download. Keep the original unsigned file if you may need to sign again differently.' },
        ],
      },
      {
        heading: 'Tips for professional-looking results',
        blocks: [
          { type: 'list', items: [
            'Draw your signature on a phone or tablet touchscreen — the natural pen-like motion produces a more realistic signature than a mouse',
            'If uploading a photo of your signature, scan it against a white background and use a photo editing app to remove the background before uploading',
            'Sign on the designated signature line — use the zoom feature to position it precisely',
            'Add your initials on early pages and a full signature on the final page for multi-page contracts',
            'Note the date next to your signature if the document does not have a date field',
          ]},
        ],
      },
    ],
  },

  {
    slug:          'how-to-make-a-scanned-pdf-searchable',
    title:         'How to Make a Scanned PDF Searchable',
    seoTitle:      'How to Make a Scanned PDF Searchable with OCR',
    description:   'Learn how OCR recognises text in a scanned PDF, which language hints are available and what to review in the searchable PDF or extracted text.',
    intro:         'A scanned document stores page images rather than selectable text. OCR (optical character recognition) attempts to identify characters and can create extracted text or a PDF with a searchable text layer. Recognition and page appearance can vary with scan quality, language, layout, and handwriting.',
    toolSlug:      'pdf-ocr',
    toolName:      'PDF OCR',
    ctaLabel:      'Make a PDF searchable →',
    readTime:      '5 min read',
    sections: [
      {
        heading: 'Why scanned PDFs are not searchable by default',
        blocks: [
          { type: 'p', text: 'When a document is scanned, the scanner captures an image of the page — it records pixels, not characters. The scanner does not know that the black marks on the page are letters that form words. It just copies exactly what it sees, pixel by pixel.' },
          { type: 'p', text: 'The resulting PDF contains one image per page. There is no text for a search engine, PDF viewer, or screen reader to find. Ctrl+F returns nothing because there is nothing to search.' },
        ],
      },
      {
        heading: 'How OCR works',
        blocks: [
          { type: 'list', items: [
            'The OCR engine analyses each pixel in the scanned image and identifies character shapes',
            'A language model uses the surrounding context to confirm ambiguous characters (is that a 0 or an O?)',
            'The recognised characters are assembled into words, lines, and paragraphs',
            'A text layer is added behind the original image in the PDF — you see the scan, but the text is there underneath',
          ]},
          { type: 'p', text: 'The searchable-PDF output uses a rendered copy of the original page as its visual background and adds an invisible recognized-text layer.' },
        ],
      },
      {
        heading: 'Step-by-step: run OCR on a scanned PDF',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-ocr in your browser.',
            'Upload your scanned PDF, or an image file (JPG, PNG) of a document.',
            'Choose automatic language detection or one of the available hints: English, Spanish, French, German, Italian, Portuguese, or Dutch.',
            'Click Scan. Processing time varies with page count, image resolution, network conditions, and the configured OCR provider.',
            'Once complete, you can copy the extracted text directly or download a searchable PDF with the text layer embedded.',
          ]},
        ],
      },
      {
        heading: 'Tips for better OCR accuracy',
        blocks: [
          { type: 'list', items: [
            'Scan at 300 DPI or higher — higher resolution gives OCR more pixel detail to work with',
            'Make sure the page is straight — even a small tilt reduces character recognition accuracy',
            'Good lighting and contrast matter: dark ink on bright white paper gives the best results',
            'Clean the scanner glass — smudges and dust appear as specks that confuse the OCR engine',
            'For old or faded documents, increase contrast in a photo editor before uploading',
          ]},
          { type: 'tip', heading: 'Handwriting recognition is supported but less accurate', text: 'Printed text in standard fonts achieves 95–99% accuracy at 300 DPI. Handwritten text is recognised but accuracy varies significantly depending on the legibility of the handwriting.' },
        ],
      },
      {
        heading: 'What you can do after making a PDF searchable',
        blocks: [
          { type: 'list', items: [
            'Search the document with Ctrl+F (or Cmd+F on Mac)',
            'Select and copy text passages',
            'Convert it to an editable Word document using PDF to Word',
            'Run AI summarisation or translation on it — both require a text layer',
            'Index it in document management systems that rely on text content',
          ]},
        ],
      },
    ],
  },

  {
    slug:          'pdf-vs-word-which-format-to-use',
    title:         'PDF vs Word: Which Format Should You Use?',
    seoTitle:      'PDF vs Word: Which Format to Use and When',
    description:   'Choosing between PDF and Word is simpler than it seems. Here is the practical guide: when to use each format, and how to convert between them.',
    intro:         'The choice between PDF and Word is not about which format is better — it is about what you need to do with the document. Each format has a clear purpose, and using the wrong one creates unnecessary friction for you and your recipients.',
    toolSlug:      'word-to-pdf',
    toolName:      'Word to PDF Converter',
    ctaLabel:      'Convert Word to PDF free →',
    readTime:      '4 min read',
    sections: [
      {
        heading: 'Use PDF when you are sharing a finished document',
        blocks: [
          { type: 'p', text: 'PDF is designed to keep a fixed page layout across compatible readers. Fonts, annotations, forms, and other advanced features can still render differently when a viewer lacks support.' },
          { type: 'list', items: [
            'CVs and cover letters — a Word CV can reformat on the recruiter\'s screen if they use a different version of Word',
            'Invoices, receipts, and contracts — the figures and layout must be exactly as you sent them',
            'Printed materials — brochures, certificates, and reports that will be printed',
            'Official submissions — most government forms, academic submissions, and legal filings require PDF',
            'Documents you want to prevent editing on — PDF is not unbreakable, but it creates a clear barrier',
          ]},
        ],
      },
      {
        heading: 'Use Word when the document is still being worked on',
        blocks: [
          { type: 'p', text: 'Word (and Google Docs, LibreOffice Writer, etc.) is built for collaboration and revision. Its tracked changes, comments, and version history features make it far superior to PDF for working documents.' },
          { type: 'list', items: [
            'Drafts that need to be reviewed and edited by multiple people',
            'Documents with tracked changes or comments for revision rounds',
            'Templates that will be updated frequently (monthly reports, recurring letters)',
            'Anything you may need to copy and paste text from into another document',
            'Mail-merge documents where the same template generates hundreds of personalised outputs',
          ]},
        ],
      },
      {
        heading: 'The practical decision rule',
        blocks: [
          { type: 'list', items: [
            'Sending to a client → PDF',
            'Working on a draft with your team → Word, then PDF when finalised',
            'Submitting a CV → PDF',
            'Writing a contract you\'ll share for review → Word with track changes, then PDF for signature',
            'Sharing a form for someone to complete → Fillable PDF (created with a PDF Form Builder)',
            'Archiving a signed document → PDF (or PDF/A for long-term archival)',
          ]},
        ],
      },
      {
        heading: 'Converting between the two formats',
        blocks: [
          { type: 'list', items: [
            'Word to PDF — rebuilds supported DOCX text, headings, lists, and tables in a new PDF layout. Complex layouts, images, headers, footers, and custom fonts may differ or be omitted; review the output.',
            'PDF to Word — extracts the content into an editable .docx file. The more complex the layout (multi-column, tables with merged cells), the more clean-up may be needed in Word. Free at editpdfai.com/pdf-to-word.',
          ]},
          { type: 'tip', heading: 'PDF to Word works best on text-based PDFs', text: 'PDFs that are image-only (scanned documents) must go through OCR first before converting to Word. Run them through editpdfai.com/pdf-ocr first, then convert to Word.' },
        ],
      },
    ],
  },

  {
    slug:          'how-to-merge-pdf-files',
    title:         'How to Merge PDF Files in a Browser',
    seoTitle:      'How to Merge PDF Files in a Browser — Free Guide',
    description:   'Combine multiple PDFs in a current desktop or mobile browser. Learn how to arrange files, review practical device limits and download one merged copy.',
    intro:         'Whether you are combining a cover letter with supporting documents, joining report sections, or consolidating invoices, a browser-based merger can create one ordered PDF without a desktop installation.',
    toolSlug:      'pdf-merger',
    toolName:      'PDF Merger',
    ctaLabel:      'Merge PDFs free →',
    readTime:      '4 min read',
    sections: [
      {
        heading: 'When is a browser-based merger useful?',
        blocks: [
          { type: 'p', text: 'A browser-based merger avoids a desktop installation and is designed for current Chrome, Safari, Firefox, and Edge releases. Capacity and performance depend on browser support and device resources.' },
          { type: 'list', items: [
            'Designed for current Chrome, Safari, Firefox, and Edge releases on common desktop and mobile platforms',
            'No software to install, no account required',
            'Files are merged inside your browser — not uploaded to a server',
            'No fixed application file-size limit; practical capacity depends on browser memory and device resources',
          ]},
        ],
      },
      {
        heading: 'Step-by-step: merge PDFs with EditPDF AI',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-merger in a supported current browser.',
            'Click "Add PDFs" or drag files onto the upload area. Add only as many files as your browser and device can process reliably.',
            'The files appear as cards in the order you added them. Drag and drop the cards to rearrange them into the correct order.',
            'Click Merge PDF.',
            'Download the combined PDF. All pages from all files are in the combined document in the order you set.',
          ]},
        ],
      },
      {
        heading: 'Tips for a clean merge',
        blocks: [
          { type: 'list', items: [
            'Check page size consistency before merging — mixing A4 and US Letter pages looks inconsistent when printed. Standardise sizes first using the PDF Editor.',
            'Set the order before merging — while you can reorder cards in the merger, it is faster to drag files into the right order on your desktop first.',
            'Compress large files before merging — if individual files are 20+ MB each, compress them first to keep the merged file manageable.',
            'If you need specific pages from each document rather than the whole files, use Extract Pages first, then merge the extracts.',
          ]},
        ],
      },
      {
        heading: 'Platform-specific alternatives',
        blocks: [
          { type: 'p', text: 'A current browser is one option. These operating-system tools may also help for supported documents:' },
          { type: 'list', items: [
            'Mac — Preview app: open one PDF, choose View → Thumbnails, then drag pages from the second PDF\'s thumbnail panel into the first',
            'Windows — Microsoft Edge: open each PDF and print to PDF, selecting all pages. This is slow for multiple files.',
            'iPhone/iPad — the Files app: long-press on multiple PDFs, tap Create PDF. Works for simple cases.',
            'Current desktop or mobile browser — EditPDF AI can combine and reorder supported PDFs without a desktop installation.',
          ]},
        ],
      },
    ],
  },

  {
    slug:          'how-to-redact-sensitive-information-from-a-pdf',
    title:         'How to Cover Sensitive Information in a PDF Safely',
    seoTitle:      'Covering PDF Content vs Secure Redaction — Safety Guide',
    description:   'Learn what opaque PDF cover boxes do, why they are not secure redaction and when to use verified content-removing software before sharing a document.',
    intro:         'An opaque rectangle can hide information visually while the underlying text, image, metadata, or PDF object remains in the file. EditPDF AI’s PDF Redactor adds visual cover boxes; it does not implement secure content removal. Use verified redaction software when confidential data must be removed.',
    toolSlug:      'pdf-redactor',
    toolName:      'PDF Redactor',
    ctaLabel:      'Add visual cover boxes →',
    readTime:      '5 min read',
    sections: [
      {
        heading: 'What is the difference between covering and redacting?',
        blocks: [
          { type: 'p', text: 'The distinction matters because visual appearance alone does not prove that sensitive data has been removed from the file.' },
          { type: 'list', items: [
            'Visual covering places an opaque shape over a page area. Underlying PDF objects can remain and may be recoverable with other software.',
            'Secure redaction removes the targeted content from the file and should also address metadata or other hidden data relevant to the document. Use software whose implementation you can verify for that purpose.',
          ]},
          { type: 'tip', heading: 'Visual checking is not enough', text: 'Copy-and-paste testing can reveal some failures, but it cannot prove that all underlying objects, layers, images, metadata, or attachments have been removed.' },
        ],
      },
      {
        heading: 'When should you use dedicated redaction software?',
        blocks: [
          { type: 'list', items: [
            'Documents subject to an organisation\'s privacy, records-management, or disclosure policy',
            'Legal review where counsel has identified material that should not be disclosed',
            'Public-information responses where the responsible authority has determined that material must be withheld',
            'HR documents containing personal details, salaries, or medical information',
            'Healthcare documents where an authorised reviewer has identified patient information for removal',
          ]},
        ],
      },
      {
        heading: 'How can you create a visibly covered review copy?',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-redactor and upload your PDF.',
            'Draw a box over each area you want to cover visually.',
            'Optionally use local pattern matching to suggest supported formats such as email addresses or phone numbers. Review every suggestion.',
            'Inspect every page and remember that the underlying PDF content is not removed.',
            'Apply the boxes and download the visibly marked PDF.',
            'Do not share the result as a securely redacted document; use a verified content-removal workflow when confidentiality matters.',
          ]},
        ],
      },
      {
        heading: 'How should a sensitive document be handled?',
        blocks: [
          { type: 'list', items: [
            'Use a dedicated redaction product that removes targeted objects rather than only drawing over them',
            'Inspect text, images, annotations, form fields, metadata, attachments, and layers that could contain sensitive information',
            'Keep the original file separate from the reviewed release copy using controls appropriate to your organisation',
            'Have an authorised reviewer verify the final release copy before it is shared',
          ]},
        ],
      },
      {
        heading: 'Common mistakes to avoid',
        blocks: [
          { type: 'list', items: [
            'Assuming a black rectangle proves the underlying text or image was removed',
            'Checking only visible page content while overlooking metadata, form values, comments, attachments, or layers',
            'Sharing a visually marked copy without testing it in other PDF inspection software',
            'Using EditPDF AI’s cover-box tool for legal, regulatory, confidential, or public-release redaction',
          ]},
        ],
      },
    ],
  },

  {
    slug:          'how-to-extract-pages-from-a-pdf',
    title:         'How to Extract Pages from a PDF into a New File',
    seoTitle:      'How to Extract Pages from a PDF into a New File',
    description:   'Select one page, non-consecutive pages or a range from a PDF and save them as one new file. Learn the browser workflow, limits and privacy details.',
    intro:         'To extract pages from a PDF, open the file, select the page thumbnails or enter a range, and export the selection as a new PDF. The EditPDF AI extractor keeps selected pages in their original document order, leaves the source file unchanged, and performs the page-copying workflow in your browser.',
    toolSlug:      'extract-pages',
    toolName:      'PDF Page Extractor',
    ctaLabel:      'Extract PDF pages →',
    readTime:      '6 min read',
    sections: [
      {
        heading: 'Should you extract, split, or delete PDF pages?',
        blocks: [
          { type: 'p', text: 'These operations solve different problems. Extracting copies chosen pages into one new PDF while retaining the original file. Splitting produces several files from one document. Deleting pages creates a new copy without the pages you remove.' },
          { type: 'list', items: [
            'Extract pages when a recipient needs only selected pages from a larger document.',
            'Split a PDF when every section needs to become a separate file.',
            'Delete pages when you want one cleaned copy containing everything except the unwanted pages.',
          ]},
          { type: 'tip', heading: 'Keep the source file', text: 'The extractor downloads a new PDF rather than overwriting the file you selected. Keep the source until you have checked the exported pages and document features you rely on.' },
        ],
      },
      {
        heading: 'How to extract specific pages from a PDF',
        blocks: [
          { type: 'steps', items: [
            'Open the PDF Page Extractor and choose one PDF. After it loads, page thumbnails show the document in its existing order.',
            'Click individual thumbnails, use All, Odd, Even, Invert, or enter a range such as 1-3, 5, 8-10. Check the selection count before continuing.',
            'Choose Extract selected pages. The tool copies the selected pages into one new PDF and downloads it to your device.',
          ]},
        ],
      },
      {
        heading: 'How do page ranges and output order work?',
        blocks: [
          { type: 'p', text: 'Separate individual pages and ranges with commas or semicolons. For example, 2, 4-6, 9 selects pages 2, 4, 5, 6, and 9. Entries outside the document are ignored, and the tool reports an error when the range produces no valid pages.' },
          { type: 'p', text: 'The downloaded PDF follows the selected pages’ original numerical order. Entering 9, 2, 5 does not create a 9-2-5 sequence. If you need a custom sequence, extract the required pages first and then arrange them with the PDF Page Manager.' },
        ],
      },
      {
        heading: 'What is copied into the extracted PDF?',
        blocks: [
          { type: 'p', text: 'The implementation copies the selected PDF pages into a newly created PDF document. The original page dimensions, orientation, and visible page content should remain with each copied page. The extractor does not advertise preservation of every document-level feature.' },
          { type: 'list', items: [
            'Review links, bookmarks, attachments, form behavior, accessibility tags, and other document-level structures if they matter to your workflow.',
            'Do not assume an existing digital signature will remain valid after pages are copied into a new file; confirm signature requirements with the recipient.',
            'Visible page numbers printed on a page do not change merely because that page is placed in a shorter PDF.',
          ]},
        ],
      },
      {
        heading: 'Useful ways to extract PDF pages',
        blocks: [
          { type: 'list', items: [
            'Send one chapter or appendix without sharing the rest of a report.',
            'Create a short reading packet from non-consecutive pages of a larger document.',
            'Separate selected invoices, receipts, or forms for a specific review task.',
            'Save odd or even pages as one file when checking a two-sided scan.',
          ]},
        ],
      },
      {
        heading: 'What limits should you expect?',
        blocks: [
          { type: 'p', text: 'The extractor does not set a fixed application file-size or page-count limit. Practical capacity depends on the PDF’s size and complexity, available browser memory, and device performance. A large scan can require much more memory than a text-focused PDF with the same number of pages.' },
          { type: 'list', items: [
            'Use a current version of Chrome, Firefox, Safari, or Edge with JavaScript enabled.',
            'For a memory error, close unused tabs, try a device with more available memory, or split the source PDF before extracting pages.',
            'Password-protected or damaged PDFs may need to be unlocked or repaired before a browser library can load them.',
          ]},
        ],
      },
      {
        heading: 'Is extracting PDF pages private?',
        blocks: [
          { type: 'p', text: 'The selected PDF is read and rebuilt locally in the browser without an EditPDF AI application document-processing request. The page-preview library worker is loaded as a runtime asset from a CDN, so do not interpret local document processing as a claim that the page makes no network requests at all.' },
          { type: 'p', text: 'Your browser still controls downloads, local file access, extensions, and network behavior. For sensitive documents, use a trusted device and browser profile, review the downloaded result, and follow any handling rules set by your organisation.' },
        ],
      },
    ],
    relatedLinks: [
      { href: '/pdf-page-manager', title: 'Reorder extracted PDF pages', description: 'Arrange, rotate, or remove pages before saving a new PDF.' },
      { href: '/pdf-splitter', title: 'Split a PDF into separate files', description: 'Create several PDFs instead of one file containing selected pages.' },
      { href: '/delete-pages', title: 'Delete unwanted PDF pages', description: 'Keep most of a document and remove only the pages you do not need.' },
      { href: '/guides/how-to-merge-pdf-files', title: 'Learn how to merge PDF files', description: 'Combine extracted sections or other PDFs into one ordered document.' },
    ],
  },

  {
    slug:          'how-to-reorder-pages-in-a-pdf',
    title:         'How to Reorder PDF Pages and Save the New Sequence',
    seoTitle:      'How to Reorder PDF Pages and Save the New Sequence',
    description:   'Drag PDF page thumbnails into a new order, rotate or delete pages, and save the result. Learn how page order, numbering and local processing work.',
    intro:         'To reorder PDF pages, load the document, drag its page thumbnails into the sequence you want, and save a new PDF. EditPDF AI can also rotate or delete pages during the same browser session. It changes page sequence, but it does not rewrite page numbers printed inside the document.',
    toolSlug:      'pdf-page-manager',
    toolName:      'PDF Page Manager',
    ctaLabel:      'Reorder PDF pages →',
    readTime:      '6 min read',
    sections: [
      {
        heading: 'What changes when you reorder a PDF?',
        blocks: [
          { type: 'p', text: 'Reordering changes the sequence of page objects in the saved PDF. It is useful when scans, report sections, or pages from several files arrived in the wrong order. The page manager can combine pages from more than one PDF, so the final sequence may include pages from different source files.' },
          { type: 'tip', heading: 'Page order is not printed numbering', text: 'A page that visibly says “12” will still say “12” after you drag it into the third position. Reorder first, then use a page-numbering tool if the visible numbering must match the new sequence.' },
        ],
      },
      {
        heading: 'How to change the order of PDF pages',
        blocks: [
          { type: 'steps', items: [
            'Open the PDF Page Manager and choose one PDF, or add multiple PDFs if the final document needs pages from several sources.',
            'Drag page thumbnails into the required order. Rotate sideways pages or delete unwanted pages while reviewing the thumbnail sequence.',
            'Choose Download PDF. The tool creates a new document using the displayed order and saves it to your device.',
          ]},
        ],
      },
      {
        heading: 'Can you arrange pages from multiple PDFs?',
        blocks: [
          { type: 'p', text: 'Yes. Each selected source PDF is loaded and its pages are added to the page manager. You can then interleave pages from different files by dragging their thumbnails. The saved output contains only the pages still visible in the manager, in the exact displayed sequence.' },
          { type: 'list', items: [
            'Add source files in small batches when working with image-heavy scans to reduce memory pressure.',
            'Use the source label and page number shown on thumbnails to distinguish pages that look similar.',
            'If you only need to append complete documents in file order, the PDF Merger provides a simpler workflow.',
          ]},
        ],
      },
      {
        heading: 'What else can the page manager do?',
        blocks: [
          { type: 'list', items: [
            'Rotate an individual page clockwise or counter-clockwise before saving.',
            'Select several pages and rotate or delete the selection together.',
            'Remove unwanted pages while preserving at least one page in the document.',
            'Combine page-level changes and save once, rather than downloading after every operation.',
          ]},
          { type: 'p', text: 'The current page manager does not insert blank pages. Use only the controls that are visibly available in the interface, and check the preview before downloading.' },
        ],
      },
      {
        heading: 'A practical checklist before sharing the result',
        blocks: [
          { type: 'list', items: [
            'Read the first and last lines around every moved section to confirm continuity.',
            'Check that landscape and scanned pages have the intended rotation.',
            'Confirm no cover, appendix, separator, or terms page was deleted by mistake.',
            'Open the downloaded PDF and compare its page count with the number shown before saving.',
            'Test bookmarks, links, forms, accessibility structure, and signature status when those features are important; the implementation does not promise to rebuild every document-level structure.',
          ]},
        ],
      },
      {
        heading: 'How large a PDF can you reorder?',
        blocks: [
          { type: 'p', text: 'There is no fixed application page-count or file-size limit in the page manager. The usable limit depends on page complexity, thumbnail rendering, available browser memory, and the device. Image-heavy PDFs and multiple large sources can use substantial memory even when their page count seems modest.' },
          { type: 'p', text: 'If the browser slows down, work with fewer source files, close other tabs, or divide the job into smaller batches. Keep the original source files until you have inspected the saved result.' },
        ],
      },
      {
        heading: 'Where does PDF page reordering happen?',
        blocks: [
          { type: 'p', text: 'The application loads, copies, rotates, and saves pages locally in your browser without an EditPDF AI application document-processing request. A PDF preview worker is fetched as a runtime asset from a CDN, so the page can still make network requests that are separate from processing the selected document.' },
          { type: 'p', text: 'Use a trusted browser and device for confidential files. Local processing does not replace your organisation’s access-control, retention, or document-review requirements.' },
        ],
      },
    ],
    relatedLinks: [
      { href: '/extract-pages', title: 'Extract selected PDF pages', description: 'Copy a chosen set of pages into one new PDF.' },
      { href: '/pdf-merger', title: 'Merge complete PDF files', description: 'Append several PDFs when you do not need page-by-page arrangement.' },
      { href: '/rotate-pdf', title: 'Rotate PDF pages', description: 'Correct page orientation with a focused rotation workflow.' },
      { href: '/add-page-numbers', title: 'Add visible PDF page numbers', description: 'Number the pages after arranging them into the final sequence.' },
    ],
  },

  {
    slug:          'how-to-combine-images-into-one-pdf',
    title:         'How to Combine JPG and PNG Images into One PDF',
    seoTitle:      'How to Combine JPG and PNG Images into One PDF',
    description:   'Combine JPG, PNG and other supported images into one ordered PDF. Learn how page size, orientation, margins and compression affect the downloaded file.',
    intro:         'To combine images into one PDF, add the image files, drag them into the required order, choose the page layout, and convert them as a multi-page document. EditPDF AI supports common browser image formats and performs the PDF-generation workflow locally, with practical limits set by image dimensions and device memory.',
    toolSlug:      'image-to-pdf',
    toolName:      'Image to PDF Converter',
    ctaLabel:      'Combine images into a PDF →',
    readTime:      '7 min read',
    sections: [
      {
        heading: 'Which image formats can you add?',
        blocks: [
          { type: 'p', text: 'The converter accepts JPG and JPEG, PNG, WebP, GIF, BMP, HEIC, and HEIF input through its file picker. HEIC and HEIF files require the in-browser conversion step to succeed. Browser decoding support and the individual file can affect whether less common formats load correctly.' },
          { type: 'list', items: [
            'Use JPG for photographs when a smaller source file matters.',
            'Use PNG for screenshots, diagrams, or text-heavy images where sharp edges matter.',
            'Treat animated images as still pages; the tool does not create an animated PDF.',
            'If HEIC or HEIF conversion fails, export the image as JPG or PNG on the source device and try again.',
          ]},
        ],
      },
      {
        heading: 'How to make one PDF from multiple images',
        blocks: [
          { type: 'steps', items: [
            'Open the Image to PDF Converter and select all the images you want to include. Each image appears as an item in the working list.',
            'Drag images into the correct order, make any crop, rotation, scan, or filter adjustments, and choose page size, orientation, margins, and quality.',
            'Choose Convert to PDF. The converter creates one PDF with one page for each prepared image and downloads it to your device.',
          ]},
        ],
      },
      {
        heading: 'Which PDF page size should you choose?',
        blocks: [
          { type: 'list', items: [
            'Fit to image sizes each PDF page around its source image. Choose this when preserving differing image proportions matters more than consistent paper dimensions.',
            'A4 creates pages using the common 210 × 297 mm paper ratio, suitable for many international document workflows.',
            'Letter creates pages using the 8.5 × 11 inch ratio common in the United States and Canada.',
            'Legal uses the longer 8.5 × 14 inch paper ratio.',
          ]},
          { type: 'p', text: 'Portrait, landscape, and automatic orientation affect how each image is fitted to the chosen page. Margins add whitespace around the image. Before converting a submission, confirm the recipient’s required paper size rather than assuming A4 or Letter.' },
        ],
      },
      {
        heading: 'How do order, crop, and scan adjustments work?',
        blocks: [
          { type: 'p', text: 'The image list determines the final page order. Dragging an item changes where its page appears in the PDF. Per-image controls can rotate or crop a source, and the smart scan workflow can select document corners, correct perspective, and apply a visual filter before PDF creation.' },
          { type: 'tip', heading: 'Review before converting', text: 'Cropping and perspective correction permanently affect the version embedded in the downloaded PDF. Zoom in on small text, confirm every corner is included, and keep the original images until the output has been checked.' },
        ],
      },
      {
        heading: 'Will combining images reduce quality?',
        blocks: [
          { type: 'p', text: 'Quality depends on the source image, its prepared dimensions, the page layout, and the selected quality option. The compressed option re-encodes prepared images as JPEG using the tool’s 72 percent setting. Compression can reduce file size but may add artifacts around fine text and line art.' },
          { type: 'list', items: [
            'Choose the original-quality option when legibility or image detail is more important than output size.',
            'Choose compression when a smaller PDF matters, then inspect small text and high-contrast edges at normal reading zoom.',
            'Avoid enlarging a low-resolution image and expecting additional detail; PDF conversion cannot restore detail missing from the source.',
          ]},
        ],
      },
      {
        heading: 'Practical ways to combine images as a PDF',
        blocks: [
          { type: 'list', items: [
            'Put photographed receipt pages into one ordered expense document.',
            'Combine front and back scans of a document when the recipient requests one PDF.',
            'Turn screenshots or exported diagrams into a review packet with one image per page.',
            'Create a PDF from photographed notes after cropping and correcting each page’s perspective.',
          ]},
        ],
      },
      {
        heading: 'What are the limits and privacy details?',
        blocks: [
          { type: 'p', text: 'The converter does not impose a fixed application file-count or total-size limit. Practical capacity depends on the number and pixel dimensions of the images, transformations applied, available browser memory, and device performance. Large phone photos can consume much more working memory than their compressed file size suggests.' },
          { type: 'p', text: 'Image preparation and PDF generation run locally in the browser without an EditPDF AI application document-processing request. Some application assets may still load over the network. Browser extensions, the operating system, and the destination where you save or share the PDF remain outside that processing claim.' },
        ],
      },
    ],
    relatedLinks: [
      { href: '/scan-to-pdf', title: 'Scan paper documents to PDF', description: 'Capture and correct pages directly with a device camera.' },
      { href: '/pdf-compressor', title: 'Reduce the resulting PDF size', description: 'Create a smaller, image-based copy when output size is the priority.' },
      { href: '/pdf-merger', title: 'Merge image PDFs with other PDFs', description: 'Combine the converted document with existing PDF files.' },
      { href: '/pdf-to-images', title: 'Convert PDF pages back to images', description: 'Export pages as JPG or PNG files for image-based workflows.' },
    ],
  },
]

export const guideMap: Record<string, Guide> = Object.fromEntries(guides.map(g => [g.slug, g]))

export default guides
