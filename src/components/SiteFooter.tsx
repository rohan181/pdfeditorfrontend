'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Upload, Lock, Sparkles, FilePen, Layers, FileType, KeyRound, Merge } from 'lucide-react'

const SP = { type: 'spring', stiffness: 400, damping: 30 } as const
const FI = { fontFamily: 'var(--font-inter,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono,monospace)' }
const RED = '#E24B4A'

const CATS = [
  { id: 'AI',       color: '#7c3aed', Icon: Sparkles  },
  { id: 'Edit',     color: '#2563eb', Icon: FilePen   },
  { id: 'Pages',    color: '#f97316', Icon: Layers    },
  { id: 'Convert',  color: '#16a34a', Icon: FileType  },
  { id: 'Protect',  color: '#dc2626', Icon: KeyRound  },
  { id: 'Organize', color: '#d97706', Icon: Merge     },
]

const toolCols = [
  { title: 'AI Tools',  color: '#7c3aed', links: [
    ['AI Form Filler',  '/ai-pdf-form-filler'],
    ['PDF OCR Scanner', '/pdf-ocr'],
    ['PDF Summarizer',  '/pdf-summarizer'],
    ['PDF Mind Map',    '/mind-map'],
    ['Quiz Creator',    '/quiz-creator'],
    ['PDF Translator',  '/pdf-translator'],
  ]},
  { title: 'PDF Tools', color: '#2563eb', links: [
    ['PDF Editor',      '/pdf-editor'],
    ['PDF Merger',      '/pdf-merger'],
    ['PDF Compressor',  '/pdf-compressor'],
    ['PDF Splitter',    '/pdf-splitter'],
    ['PDF Watermarker', '/pdf-watermark'],
    ['Image to PDF',    '/image-to-pdf'],
  ]},
  { title: 'Company',   color: '#374151', links: [
    ['Pricing',         '/pricing'],
    ['Privacy Policy',  '/privacy'],
    ['Terms of Service','/terms'],
    ['Contact',         '/contact'],
    ['Support',         'mailto:support@editpdfai.com'],
    ['All Tools',       '/#tools'],
  ]},
]

export default function SiteFooter() {
  return (
    <footer style={{ background: '#f5f5f7', borderTop: '1px solid #e5e5ea', padding: '56px 28px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="sf-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginBottom: 14 }}>
              <img src="/logo.png" alt="EditPDF AI" style={{ height: 48, width: 'auto', display: 'block' }} />
            </Link>

            <p style={{ ...FI, fontSize: 13, color: '#6b7280', lineHeight: 1.7, maxWidth: 220, margin: '0 0 16px' }}>
              35+ AI-powered PDF tools. Edit, convert, protect and sign — free to use, no signup required.
            </p>

            {/* Privacy assurance */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(22,163,74,.06)', border: '1px solid rgba(22,163,74,.16)', borderRadius: 10, marginBottom: 20, maxWidth: 240 }}>
              <Lock size={13} color="#16a34a" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ ...FI, fontSize: 11.5, color: '#374151', lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: '#15803d' }}>Your files stay private.</strong> PDFs are processed in your browser. AI features use text context only — no raw file is uploaded.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {CATS.map(c => (
                <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...MONO, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${c.color}12`, color: c.color, letterSpacing: '.06em' }}>
                  <c.Icon size={9} strokeWidth={2.5} />{c.id.toUpperCase()}
                </span>
              ))}
            </div>
            <p style={{ ...MONO, fontSize: 10, color: '#9ca3af', letterSpacing: '0.04em' }}>
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
                <motion.div key={l} whileHover={{ x: 3 }} transition={SP}>
                  <Link href={h}
                    style={{ ...FI, display: 'block', fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500, marginBottom: 10, letterSpacing: '-0.01em', transition: 'color .12s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#1d1d1f')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                    {l}
                  </Link>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #e5e5ea', padding: '16px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ ...MONO, fontSize: 10, color: '#9ca3af', letterSpacing: '0.04em' }}>
              35+ TOOLS · FREE · AI-POWERED
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
                <Link key={l} href={h}
                  style={{ ...FI, fontSize: 11, color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#374151')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/pdf-editor"
            style={{ ...FI, display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: 99, background: '#1d1d1f', letterSpacing: '-0.02em' }}>
            <Upload size={11} strokeWidth={2.5} /> Upload PDF
          </Link>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .sf-footer-grid{ grid-template-columns:1fr 1fr !important; gap:32px !important; } }
        @media(max-width:600px){ .sf-footer-grid{ grid-template-columns:1fr !important; gap:24px !important; } }
      `}</style>
    </footer>
  )
}
