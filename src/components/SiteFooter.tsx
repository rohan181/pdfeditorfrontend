import Link from 'next/link'
import Image from 'next/image'
import { Upload, Lock, Sparkles, FilePen, Layers, FileType, KeyRound, Merge } from 'lucide-react'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const CATS = [
  { id: 'AI',       color: '#6d28d9', Icon: Sparkles },
  { id: 'Edit',     color: '#1d4ed8', Icon: FilePen  },
  { id: 'Pages',    color: '#9a3412', Icon: Layers   },
  { id: 'Convert',  color: '#166534', Icon: FileType },
  { id: 'Protect',  color: '#b91c1c', Icon: KeyRound },
  { id: 'Organize', color: '#92400e', Icon: Merge    },
]

const toolCols = [
  { title: 'AI Tools',  color: '#6d28d9', links: [
    ['AI PDF Form Filler',  '/ai-pdf-form-filler'],
    ['Chat with PDF',   '/chat-with-pdf'],
    ['PDF OCR Scanner', '/pdf-ocr'],
    ['PDF Summarizer',  '/pdf-summarizer'],
    ['PDF Mind Map',    '/mind-map'],
    ['Quiz Creator',    '/quiz-creator'],
    ['PDF Translator',  '/pdf-translator'],
  ]},
  { title: 'Edit & Pages', color: '#1d4ed8', links: [
    ['PDF Editor',      '/pdf-editor'],
    ['PDF Viewer',      '/pdf-viewer'],
    ['PDF E-Signer',    '/pdf-signer'],
    ['PDF Annotator',   '/pdf-annotate'],
    ['Page Manager',    '/pdf-page-manager'],
    ['PDF Cropper',     '/pdf-cropper'],
    ['Rotate Pages',    '/rotate-pdf'],
    ['Extract Pages',   '/extract-pages'],
    ['Delete Pages',    '/delete-pages'],
    ['Add Page Numbers','/add-page-numbers'],
    ['PDF Page Labels', '/pdf-page-labels'],
  ]},
  { title: 'Convert',   color: '#166534', links: [
    ['PDF to Word',     '/pdf-to-word'],
    ['PDF to Excel',    '/pdf-to-excel'],
    ['PDF to PowerPoint','/pdf-to-ppt'],
    ['PDF to Images',   '/pdf-to-images'],
    ['Word to PDF',     '/word-to-pdf'],
    ['Excel to PDF',    '/excel-to-pdf'],
    ['PowerPoint to PDF','/ppt-to-pdf'],
    ['Image to PDF',    '/image-to-pdf'],
    ['Text to PDF',     '/txt-to-pdf'],
    ['RTF to PDF',      '/rtf-to-pdf'],
    ['ODT to PDF',      '/odt-to-pdf'],
    ['HTML to PDF',     '/html-to-pdf'],
  ]},
  { title: 'Protect & Organize', color: '#b91c1c', links: [
    ['PDF Password Lock','/pdf-password-lock'],
    ['Unlock PDF',       '/pdf-unlock'],
    ['PDF Watermark',   '/pdf-watermark'],
    ['PDF Redactor',    '/pdf-redactor'],
    ['PDF Merger',      '/pdf-merger'],
    ['PDF Compressor',  '/pdf-compressor'],
    ['PDF Splitter',    '/pdf-splitter'],
    ['PDF Form Builder','/pdf-form-builder'],
    ['Repair PDF',      '/pdf-repair'],
    ['Flatten PDF',     '/pdf-flatten'],
    ['Compare PDF',     '/pdf-compare'],
    ['Remove PDF Metadata','/remove-pdf-metadata'],
    ['Extract PDF Attachments','/extract-pdf-attachments'],
    ['Extract PDF Images','/extract-pdf-images'],
    ['Export PDF Form Data','/export-pdf-form-data'],
    ['Extract PDF Bookmarks','/extract-pdf-bookmarks'],
    ['PDF Bookmarks Manager','/pdf-bookmarks-manager'],
    ['Extract PDF Links', '/extract-pdf-links'],
    ['Remove PDF Links', '/remove-pdf-links'],
    ['Export PDF Comments', '/export-pdf-comments'],
  ]},
  { title: 'Guides',    color: '#155e75', links: [
    ['Edit PDF Without Adobe',   '/guides/how-to-edit-a-pdf-without-adobe'],
    ['Reduce PDF File Size',     '/guides/how-to-reduce-pdf-file-size'],
    ['Fill a PDF Form with AI',  '/guides/how-to-fill-out-a-pdf-form-automatically'],
    ['Sign a PDF Online',        '/guides/how-to-sign-a-pdf-online'],
    ['Make a PDF Searchable',    '/guides/how-to-make-a-scanned-pdf-searchable'],
    ['Merge PDF Files',          '/guides/how-to-merge-pdf-files'],
  ]},
  { title: 'Company',   color: '#374151', links: [
    ['Pricing',         '/pricing'],
    ['About Us',        '/about'],
    ['Privacy Policy',  '/privacy'],
    ['Terms of Service','/terms'],
    ['Contact',         '/contact'],
    ['Support',         '/support'],
  ]},
]

export default function SiteFooter() {
  return (
    <footer className="home-footer" style={{ background: '#f5f5f7', borderTop: '1px solid #e5e5ea', padding: '56px 28px 0' }}>
      <style>{`
        .sf-footer-grid { display:grid; grid-template-columns:1.45fr repeat(6,minmax(0,1fr)); gap:24px; align-items:start; margin-bottom:48px; }
        @media(max-width:900px){ .sf-footer-grid{ grid-template-columns:1fr 1fr !important; gap:32px !important; } }
        @media(max-width:600px){ .sf-footer-grid{ grid-template-columns:1fr !important; gap:24px !important; } }
        .sf-link { display:block; font-size:13px; color:#5b6472; text-decoration:none; font-weight:500; margin-bottom:10px; letter-spacing:-0.01em; transition:color .12s, transform .12s; }
        .sf-link:hover { color:#1d1d1f; transform:translateX(3px); }
        .sf-bot-link { font-size:11px; color:#5b6472; text-decoration:none; font-weight:500; transition:color .12s; }
        .sf-bot-link:hover { color:#374151; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="sf-footer-grid">

          {/* Brand */}
          <div>
            <Link prefetch={false} href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginBottom: 14 }}>
              <Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} />
            </Link>

            <p style={{ ...FI, fontSize: 13, color: '#5b6472', lineHeight: 1.7, maxWidth: 220, margin: '0 0 16px' }}>
              50+ browser-based PDF and AI tools. Edit, convert, protect and sign. Core tools need no account.
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(22,163,74,.06)', border: '1px solid rgba(22,163,74,.16)', borderRadius: 10, marginBottom: 20, maxWidth: 240 }}>
              <Lock size={13} color="#16a34a" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ ...FI, fontSize: 11.5, color: '#374151', lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: '#166534' }}>Your files stay private.</strong> PDFs are processed in your browser. AI features use text context only — no raw file is uploaded.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {CATS.map(c => (
                <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...MONO, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${c.color}12`, color: c.color, letterSpacing: '.06em' }}>
                  <c.Icon size={9} strokeWidth={2.5} />{c.id.toUpperCase()}
                </span>
              ))}
            </div>
            <a
              href="https://nz.trustpilot.com/review/editpdfai.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...FI, display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18, color: '#0F172A', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}
              aria-label="Write a review on Trustpilot for EditPDF AI"
            >
              <span aria-hidden="true" style={{ color: '#00B67A', fontSize: 17, lineHeight: 1 }}>★</span>
              Write a review on Trustpilot
            </a>
            <p style={{ ...MONO, fontSize: 10, color: '#5b6472', letterSpacing: '0.04em' }}>
              © {new Date().getFullYear()} EditPDF AI. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {toolCols.map(({ title, color, links }) => (
            <div key={title}>
              <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                {title}
              </div>
              {links.map(([l, h]) => (
                <Link prefetch={false} key={l} href={h} className="sf-link" style={FI}>{l}</Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #e5e5ea', padding: '16px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ ...MONO, fontSize: 10, color: '#5b6472', letterSpacing: '0.04em' }}>
              50+ TOOLS · FREE · AI FEATURES
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
                <Link prefetch={false} key={l} href={h} className="sf-bot-link" style={FI}>{l}</Link>
              ))}
            </div>
          </div>
          <Link prefetch={false} href="/pdf-editor"
            style={{ ...FI, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: 99, background: '#1d1d1f', letterSpacing: '-0.02em' }}>
            <Upload size={11} strokeWidth={2.5} /> Upload PDF
          </Link>
        </div>
      </div>
    </footer>
  )
}
