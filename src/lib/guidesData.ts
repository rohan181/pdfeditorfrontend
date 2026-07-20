export type ContentBlock =
  | { type: 'p';     text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'list';  items: string[] }
  | { type: 'tip';   heading: string; text: string }

export interface GuideSection {
  heading: string
  blocks: ContentBlock[]
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
  datePublished: string
  dateModified:  string
  sections:      GuideSection[]
}

const guides: Guide[] = [
  {
    slug:          'how-to-edit-a-pdf-without-adobe',
    title:         'How to Edit a PDF Without Adobe Acrobat',
    seoTitle:      'How to Edit a PDF Without Adobe Acrobat — Free & Online',
    description:   'Adobe Acrobat costs $25/month. Learn how to edit PDF text, images, and pages for free in your browser — no software to install.',
    intro:         'Adobe Acrobat charges $25 per month for features most people only need occasionally. You can fix a typo, update an address, swap an image, or reorder pages for free — directly in your browser.',
    toolSlug:      'pdf-editor',
    toolName:      'PDF Editor',
    ctaLabel:      'Edit a PDF free →',
    readTime:      '4 min read',
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
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
          { type: 'p', text: 'All of these are possible without Adobe Acrobat.' },
        ],
      },
      {
        heading: 'Step-by-step: edit a PDF in your browser',
        blocks: [
          { type: 'steps', items: [
            'Open EditPDF AI\'s PDF Editor (editpdfai.com/pdf-editor) in any browser. No account or install required.',
            'Click "Open PDF" or drag your file onto the page. The document loads immediately.',
            'Click any text block to select it. A cursor appears — edit the text directly, just as you would in a word processor.',
            'Use the Image tool in the toolbar to insert a new image or replace an existing one.',
            'Open the Pages panel to delete, duplicate, or reorder pages by dragging thumbnails.',
            'Click Download when you are done. The edited PDF saves to your device.',
          ]},
          { type: 'tip', heading: 'Your file never leaves your device', text: 'All editing runs inside your browser using WebAssembly. The PDF is processed locally — it is not uploaded to any server.' },
        ],
      },
      {
        heading: 'What you can and cannot edit',
        blocks: [
          { type: 'p', text: 'Browser-based editors handle the most common editing tasks well. There are a few things to be aware of:' },
          { type: 'list', items: [
            'Can edit: text, images, page structure, form fields, annotations',
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
    title:         'How to Reduce PDF File Size Without Losing Quality',
    seoTitle:      'How to Reduce PDF File Size Without Losing Quality',
    description:   'Learn how PDF compression works, which settings to use, and how much you can realistically reduce a PDF — from 30 MB to 2 MB in seconds.',
    intro:         'A 30 MB PDF can often be brought down to 2–3 MB with compression — and the difference is invisible on screen. Understanding what makes PDFs large helps you pick the right compression level the first time.',
    toolSlug:      'pdf-compressor',
    toolName:      'PDF Compressor',
    ctaLabel:      'Compress a PDF free →',
    readTime:      '4 min read',
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
    sections: [
      {
        heading: 'Why PDFs get so large',
        blocks: [
          { type: 'p', text: 'File size depends almost entirely on what is embedded inside the PDF:' },
          { type: 'list', items: [
            'High-resolution images — a single uncompressed photo at 300 DPI can be 5–15 MB by itself',
            'Scanned pages — each scanned page is stored as a full-resolution image, not compressed text',
            'Embedded fonts — entire font files are included so the document looks correct on any device',
            'Colour profiles and metadata — ICC colour data, document history, and XMP metadata all add bytes',
          ]},
          { type: 'p', text: 'Text itself is tiny — a 50-page text-only document is rarely more than 200 KB. If your PDF is large, it contains images.' },
        ],
      },
      {
        heading: 'The three compression levels explained',
        blocks: [
          { type: 'list', items: [
            'Light — reduces image quality from ~100 to ~85 (JPEG scale). File shrinks 20–40%. Images look identical on screen and print well. Use for archival copies, legal documents, and anything that may be printed.',
            'Balanced — compresses images to ~75 quality. File shrinks 40–70%. Slight quality reduction in photos, invisible in most document images. Best default choice for email and sharing.',
            'Maximum — compresses images to ~50 quality, strips metadata. File shrinks 60–90%. Photos will show visible JPEG compression. Use when file size is the only priority.',
          ]},
          { type: 'tip', heading: 'Text quality is never affected', text: 'Text in PDFs is vector data — it is not an image. Compression only re-encodes raster images. Fonts and text remain perfectly sharp at all compression levels.' },
        ],
      },
      {
        heading: 'Step-by-step: compress a PDF',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-compressor and upload your PDF (drag and drop or click to browse).',
            'Select a compression level. Start with Balanced unless you have a specific reason for Light or Maximum.',
            'The tool shows the estimated output file size before you compress.',
            'Click Compress PDF.',
            'Download the compressed file. Compare the before and after sizes — the tool shows both.',
          ]},
        ],
      },
      {
        heading: 'Realistic expectations by document type',
        blocks: [
          { type: 'list', items: [
            'Scanned documents (e.g. signed contracts, receipts): 60–90% reduction — the biggest gains',
            'Documents with embedded photos (e.g. product brochures, reports with charts): 40–70% reduction',
            'Text-heavy documents (e.g. contracts, reports without images): 10–30% reduction',
            'PDFs already compressed at creation: 5–15% reduction — minimal gains possible',
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
    seoTitle:      'How to Auto-Fill a PDF Form with AI — No Typing Required',
    description:   'Stop retyping the same name and address across different forms. AI form filling reads your information once and fills matching fields automatically.',
    intro:         'Filling in the same name, address, date of birth, and employer across ten different forms is one of the most unnecessarily tedious tasks in modern life. AI form filling reads your information once — from your CV, an ID card photo, or typed input — and fills every matching field in seconds.',
    toolSlug:      'ai-pdf-form-filler',
    toolName:      'AI PDF Form Filler',
    ctaLabel:      'Fill a form automatically →',
    readTime:      '5 min read',
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
    sections: [
      {
        heading: 'Two types of PDF form — the AI handles both',
        blocks: [
          { type: 'list', items: [
            'Interactive (fillable) PDFs have real form fields embedded in the file. These are the forms where you can already click and type. The AI fills these fields directly.',
            'Non-fillable PDFs are flat documents with blank lines or boxes. The form was never set up as a digital form — it was designed to be printed and filled by hand. The AI detects these blank areas and places text overlays to fill them.',
          ]},
          { type: 'p', text: 'The AI determines which type you have uploaded automatically. You do not need to do anything differently for either type.' },
        ],
      },
      {
        heading: 'Step-by-step: auto-fill a form',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/ai-pdf-form-filler in your browser.',
            'Upload your PDF form. The AI scans the document and highlights all detected fields.',
            'Choose how to provide your information: paste the text of your CV, upload a photo of an ID card or passport, or type key details directly in the chat panel.',
            'The AI maps your data to the correct fields automatically. Review the filled form on screen.',
            'Click any field to correct an error. All fields remain editable.',
            'Download the completed PDF.',
          ]},
        ],
      },
      {
        heading: 'What the AI fills well',
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
          { type: 'tip', heading: 'Your data is never stored', text: 'Information you provide is used only to fill the form during your session. It is not saved, logged, or used for any other purpose after you download the completed PDF.' },
        ],
      },
    ],
  },

  {
    slug:          'how-to-sign-a-pdf-online',
    title:         'How to Sign a PDF Online (Free, No Software Needed)',
    seoTitle:      'How to Sign a PDF Online Free — No Adobe, No Printing',
    description:   'Sign a PDF legally in under 60 seconds. Draw, type, or upload your signature and place it anywhere on the page — no account, no Adobe Acrobat.',
    intro:         'You can legally sign a PDF without printing it, without Adobe Acrobat, and without spending a penny. The entire process takes under 60 seconds and works on any device with a browser.',
    toolSlug:      'pdf-signer',
    toolName:      'PDF Signer',
    ctaLabel:      'Sign a PDF free →',
    readTime:      '4 min read',
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
    sections: [
      {
        heading: 'Is an electronic signature legally binding?',
        blocks: [
          { type: 'p', text: 'Yes, in most countries and for most document types. The key legislation:' },
          { type: 'list', items: [
            'European Union: eIDAS Regulation — electronic signatures are legally valid across all EU member states',
            'United States: ESIGN Act and UETA — electronic signatures are legally binding for commercial and consumer agreements',
            'United Kingdom: Electronic Communications Act 2000 — electronic signatures are admissible in legal proceedings',
            'Australia, Canada, Singapore, and most other countries have equivalent legislation',
          ]},
          { type: 'p', text: 'There are narrow exceptions: notarised documents, wills, adoption papers, and certain real estate transactions may require wet signatures in some jurisdictions. Check with a legal professional if you are unsure.' },
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
    description:   'A scanned PDF is just an image. OCR (optical character recognition) reads the image and adds a searchable text layer. Here is how to do it in minutes.',
    intro:         'A scanned document is a photograph of text — not actual text. You cannot select words, search for terms, or copy anything from it. OCR (Optical Character Recognition) solves this by reading the image and adding a hidden text layer, making the document fully searchable without changing its appearance.',
    toolSlug:      'pdf-ocr',
    toolName:      'PDF OCR',
    ctaLabel:      'Make a PDF searchable →',
    readTime:      '5 min read',
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
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
          { type: 'p', text: 'The original scan is preserved exactly. OCR adds to the PDF without replacing the image.' },
        ],
      },
      {
        heading: 'Step-by-step: run OCR on a scanned PDF',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-ocr in your browser.',
            'Upload your scanned PDF, or an image file (JPG, PNG) of a document.',
            'Select the language the document is written in. Over 100 languages are supported.',
            'Click Scan. The AI processes each page — this takes a few seconds per page.',
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
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
    sections: [
      {
        heading: 'Use PDF when you are sharing a finished document',
        blocks: [
          { type: 'p', text: 'PDF\'s defining characteristic is that it looks identical on every device. Fonts, layout, page breaks, and images are locked in place regardless of what software or operating system the recipient uses.' },
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
            'Word to PDF — preserves the layout exactly. Use this before sending any document. Free at editpdfai.com/word-to-pdf.',
            'PDF to Word — extracts the content into an editable .docx file. The more complex the layout (multi-column, tables with merged cells), the more clean-up may be needed in Word. Free at editpdfai.com/pdf-to-word.',
          ]},
          { type: 'tip', heading: 'PDF to Word works best on text-based PDFs', text: 'PDFs that are image-only (scanned documents) must go through OCR first before converting to Word. Run them through editpdfai.com/pdf-ocr first, then convert to Word.' },
        ],
      },
    ],
  },

  {
    slug:          'how-to-merge-pdf-files',
    title:         'How to Merge PDF Files on Any Device',
    seoTitle:      'How to Merge PDF Files on Mac, Windows and Mobile — Free',
    description:   'Combine multiple PDFs into one in seconds. This guide covers the browser-based method that works on Mac, Windows, iPhone, and Android — no software needed.',
    intro:         'Whether you are combining a cover letter with supporting documents, joining individual report sections into a single file, or consolidating monthly invoices for an accountant, merging PDFs is one of the most common document tasks — and it takes under a minute with the right tool.',
    toolSlug:      'pdf-merger',
    toolName:      'PDF Merger',
    ctaLabel:      'Merge PDFs free →',
    readTime:      '4 min read',
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
    sections: [
      {
        heading: 'Why a browser tool beats desktop software for most people',
        blocks: [
          { type: 'p', text: 'Desktop software requires installation, occasional updates, and often a licence fee. A browser-based merger works from any device on any operating system the moment you open a tab — no setup required.' },
          { type: 'list', items: [
            'Works on Mac, Windows, Linux, Chromebook, iPhone, iPad, and Android',
            'No software to install, no account required',
            'Files are merged inside your browser — not uploaded to a server',
            'Free for unlimited files and unlimited file sizes',
          ]},
        ],
      },
      {
        heading: 'Step-by-step: merge PDFs with EditPDF AI',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-merger in any browser on any device.',
            'Click "Add PDFs" or drag your files directly onto the upload area. You can add as many files as you need.',
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
          { type: 'p', text: 'The browser method works everywhere. But if you prefer native tools:' },
          { type: 'list', items: [
            'Mac — Preview app: open one PDF, choose View → Thumbnails, then drag pages from the second PDF\'s thumbnail panel into the first',
            'Windows — Microsoft Edge: open each PDF and print to PDF, selecting all pages. This is slow for multiple files.',
            'iPhone/iPad — the Files app: long-press on multiple PDFs, tap Create PDF. Works for simple cases.',
            'Any platform — EditPDF AI in a browser: the most reliable cross-platform option, especially for more than two files.',
          ]},
        ],
      },
    ],
  },

  {
    slug:          'how-to-redact-sensitive-information-from-a-pdf',
    title:         'How to Redact Sensitive Information from a PDF',
    seoTitle:      'How to Permanently Redact Sensitive Information from a PDF',
    description:   'Drawing a black box over text is not redaction — the text is still in the file. Learn how to permanently remove sensitive data from a PDF.',
    intro:         'Drawing a black rectangle over text in a PDF is not the same as redacting it. The text remains in the file underneath the shape, and anyone can remove the overlay to read it. True redaction permanently deletes the underlying data from the PDF file itself.',
    toolSlug:      'pdf-redactor',
    toolName:      'PDF Redactor',
    ctaLabel:      'Redact a PDF permanently →',
    readTime:      '5 min read',
    datePublished: '2026-07-19',
    dateModified:  '2026-07-19',
    sections: [
      {
        heading: 'The critical difference: covering vs truly redacting',
        blocks: [
          { type: 'p', text: 'This distinction has caused real privacy failures in high-profile cases — including classified government documents where the "redacted" text was revealed by simply selecting it in a PDF viewer.' },
          { type: 'list', items: [
            'Covering (WRONG approach): places a black annotation, shape, or image on top of the text. The original text is still in the PDF content stream and can be selected, copied, or uncovered by removing the shape.',
            'True redaction (CORRECT approach): removes the text or image from the PDF content stream entirely and replaces it with a solid black rectangle. There is nothing underneath. The information cannot be recovered.',
          ]},
          { type: 'tip', heading: 'Test your redaction after applying', text: 'After redacting, try to select the blacked-out area and copy it. If anything pastes, the content was not truly redacted. With proper redaction, nothing will paste.' },
        ],
      },
      {
        heading: 'When you must use proper redaction',
        blocks: [
          { type: 'list', items: [
            'GDPR/UK GDPR compliance — personal data must be removed before sharing documents outside the organisation',
            'Legal discovery — privileged information must be removed before producing documents to opposing counsel',
            'Freedom of Information (FOIA) responses — exempt information must be permanently removed before public release',
            'HR and employment documents — personal details, salaries, or medical information removed before sharing for audit',
            'Healthcare — patient identifiers removed from records shared for research or review',
          ]},
        ],
      },
      {
        heading: 'Step-by-step: redact a PDF permanently',
        blocks: [
          { type: 'steps', items: [
            'Open editpdfai.com/pdf-redactor and upload your PDF.',
            'Select text to redact manually: click and drag to highlight the text you want to remove. It turns red to show it is marked.',
            'Or use AI Detection: click the AI Detect button and the tool automatically identifies names, email addresses, phone numbers, dates, and financial figures. Review and approve the suggestions.',
            'Mark all areas you want to redact across all pages.',
            'Click Apply Redactions. This step permanently removes the content and replaces it with black bars.',
            'Download the redacted PDF.',
          ]},
        ],
      },
      {
        heading: 'After redacting: add another layer of protection',
        blocks: [
          { type: 'list', items: [
            'Password-protect the redacted PDF — even though the text is gone, add a password if the document is sensitive',
            'Add a "REDACTED" watermark to make the document\'s status clear to all recipients',
            'Store the original unredacted file on an access-controlled, encrypted system — keep it separate from the redacted version',
            'Document which information was redacted and why, for compliance audit trails',
          ]},
        ],
      },
      {
        heading: 'Common mistakes to avoid',
        blocks: [
          { type: 'list', items: [
            'Using a black annotation box or shape instead of the redact tool — this is the most common and dangerous mistake',
            'Forgetting to redact metadata — author names, comments, and document history in PDF metadata can reveal information even after content is redacted. A proper redactor cleans metadata too.',
            'Not applying redactions before downloading — marks are pending until you click Apply Redactions. Downloading before applying saves a version with the marks as annotations, not permanent redactions.',
            'Redacting only text but not images — if the sensitive information appears in an image or signature, that must also be redacted using a drawn selection box over the image area.',
          ]},
        ],
      },
    ],
  },
]

export const guideMap: Record<string, Guide> = Object.fromEntries(guides.map(g => [g.slug, g]))

export default guides
