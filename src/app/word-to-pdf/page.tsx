'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.pg{min-height:100vh;background:#f5f5f7;padding-top:56px;}

/* ── Nav ── */

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:linear-gradient(135deg,#1d1d1f,#444);border-radius:8px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#2563eb}
.nav-sep{font-size:13px;color:rgba(0,0,0,.18);font-weight:300}
.nav-tool{font-size:13px;font-weight:600;color:#1d1d1f;letter-spacing:-.01em}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.4);text-decoration:none;padding:6px 13px;border-radius:8px;border:1px solid rgba(0,0,0,.1);transition:all .15s;letter-spacing:-.01em}
.back:hover{color:#1d1d1f;border-color:rgba(0,0,0,.25);background:#fff}

/* ── Layout ── */
.wrap{max-width:860px;margin:0 auto;padding:48px 20px 96px}

/* ── Hero ── */
.hero{text-align:center;margin-bottom:40px;animation:fadeup .35s ease}
.badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:#eff6ff;border:1px solid rgba(37,99,235,.18);border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:16px}
.badge-dot{width:5px;height:5px;border-radius:50%;background:#2563eb;animation:pulse 2s ease infinite}
.hero h1{font-size:clamp(28px,5vw,46px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;line-height:1.05;margin-bottom:12px}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,#2563eb,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:15px;color:rgba(0,0,0,.42);line-height:1.65;max-width:440px;margin:0 auto}

/* ── Cards ── */
.card{background:#fff;border:1px solid #e5e5e7;border-radius:18px;padding:28px;margin-bottom:14px;box-shadow:0 1px 12px rgba(0,0,0,.05)}

/* ── Drop zone ── */
.drop{border:2px dashed #d2d2d7;border-radius:14px;padding:56px 28px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;position:relative;overflow:hidden}
.drop::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#eff6ff 0%,#fff 100%);opacity:0;transition:opacity .2s}
.drop:hover,.drop.over{border-color:#2563eb;background:#f8faff}
.drop:hover::before,.drop.over::before{opacity:1}
.drop-inner{position:relative;z-index:1}
.drop-icon-wrap{width:72px;height:72px;background:linear-gradient(135deg,#2563eb,#60a5fa);border-radius:20px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,99,235,.28);transition:transform .2s}
.drop:hover .drop-icon-wrap{transform:scale(1.06)}
.drop h2{font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:8px;letter-spacing:-.02em}
.drop p{font-size:13px;color:rgba(0,0,0,.38);margin-bottom:22px;line-height:1.6;max-width:340px;margin-left:auto;margin-right:auto}
.type-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;background:#eff6ff;border:1px solid rgba(37,99,235,.15);border-radius:8px;font-size:10px;font-weight:700;color:#2563eb;letter-spacing:.04em;margin-bottom:20px}
.browse-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:#1d1d1f;border-radius:10px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:all .16s;letter-spacing:-.01em}
.browse-btn:hover{background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,99,235,.35)}

/* ── File row ── */
.file-row{display:flex;align-items:center;gap:14px;padding:14px 16px;background:#f5f5f7;border:1px solid #e5e5e7;border-radius:12px;margin-bottom:14px;animation:fadeup .2s ease}
.file-icon-box{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,#2563eb,#60a5fa);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(37,99,235,.25)}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-.01em}
.file-size{font-size:11px;color:rgba(0,0,0,.38);margin-top:2px}
.rm-btn{width:28px;height:28px;border-radius:8px;background:transparent;border:1px solid #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.3);font-size:16px;transition:all .15s;line-height:1;flex-shrink:0}
.rm-btn:hover{border-color:#ef4444;color:#ef4444;background:#fff5f5}

/* ── Settings row ── */
.settings{display:flex;align-items:center;gap:12px;padding:14px 18px;background:#fafafa;border:1px solid #e5e5e7;border-radius:12px;margin-bottom:14px;flex-wrap:wrap;gap:10px}
.set-label{font-size:10px;font-weight:700;letter-spacing:.07em;color:rgba(0,0,0,.38);text-transform:uppercase;white-space:nowrap}
.tg-wrap{display:flex;gap:3px;background:#f0f0f2;border-radius:8px;padding:3px}
.tg{padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:none;background:transparent;color:rgba(0,0,0,.45);transition:all .14s;white-space:nowrap;letter-spacing:-.01em}
.tg.on{background:#fff;color:#1d1d1f;box-shadow:0 1px 4px rgba(0,0,0,.12)}
.tg:hover:not(.on){color:#1d1d1f}
.set-sep{width:1px;height:38px;background:#e0e0e0;flex-shrink:0}

/* ── Preview ── */
.preview-wrap{background:#fff;border:1px solid #e5e5e7;border-radius:18px;overflow:hidden;margin-bottom:14px;box-shadow:0 1px 12px rgba(0,0,0,.05);animation:fadeup .25s ease}
.preview-hdr{padding:16px 22px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fafafa}
.preview-ttl{font-size:13px;font-weight:700;color:#1d1d1f;letter-spacing:-.01em}
.preview-sub{font-size:11px;color:rgba(0,0,0,.35);margin-top:2px}
.stats-row{display:flex;gap:6px;flex-wrap:wrap}
.stat-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#eff6ff;border-radius:99px;font-size:10px;font-weight:700;color:#2563eb;letter-spacing:.02em}

.doc-preview{padding:36px 44px;max-height:500px;overflow-y:auto;font-size:13.5px;line-height:1.78;color:#1d1d1f}
.doc-preview h1{font-size:24px;font-weight:800;color:#1d1d1f;margin:20px 0 10px;letter-spacing:-.03em;padding-left:13px;border-left:3.5px solid #2563eb;line-height:1.2}
.doc-preview h2{font-size:18px;font-weight:700;color:#1d1d1f;margin:16px 0 7px;letter-spacing:-.02em;line-height:1.25}
.doc-preview h3{font-size:15px;font-weight:700;color:#374151;margin:13px 0 5px}
.doc-preview h4,.doc-preview h5,.doc-preview h6{font-size:14px;font-weight:700;color:#374151;margin:10px 0 4px}
.doc-preview p{margin-bottom:9px;color:#1d1d1f}
.doc-preview ul{margin:0 0 9px 20px}.doc-preview ol{margin:0 0 9px 22px}
.doc-preview li{margin-bottom:3px}
.doc-preview strong{font-weight:700}.doc-preview em{font-style:italic}
.doc-preview table{border-collapse:collapse;width:100%;margin-bottom:14px;font-size:12px}
.doc-preview td,.doc-preview th{border:1px solid #e5e5e7;padding:7px 11px;vertical-align:top}
.doc-preview th{background:#eff6ff;font-weight:700;color:#1d4ed8;font-size:11px}
.doc-preview hr{border:none;border-top:1px solid #e5e5e7;margin:16px 0}
.doc-preview blockquote{border-left:3px solid #d1d5db;padding-left:14px;color:rgba(0,0,0,.5);margin:8px 0;font-style:italic}
@media(max-width:600px){.doc-preview{padding:24px 20px}}

/* ── Actions ── */
.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.sec-btn{flex:1;min-width:140px;padding:13px 18px;background:#fff;border:1.5px solid #e0e0e0;border-radius:11px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;letter-spacing:-.01em}
.sec-btn:hover{border-color:#2563eb;color:#2563eb}
.pri-btn{flex:2;min-width:200px;padding:13px 22px;background:linear-gradient(135deg,#2563eb,#1d4ed8);border:none;border-radius:11px;font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(37,99,235,.35);letter-spacing:-.01em}
.pri-btn:hover:not(:disabled){background:linear-gradient(135deg,#1d4ed8,#1e40af);transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,99,235,.4)}
.pri-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}

/* ── Loading ── */
.loading-state{text-align:center;padding:56px 24px}
.big-spin{width:36px;height:36px;border:3px solid rgba(37,99,235,.15);border-top-color:#2563eb;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 18px}
.loading-title{font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:5px;letter-spacing:-.01em}
.loading-sub{font-size:12px;color:rgba(0,0,0,.38)}

/* ── Error ── */
.err{padding:12px 16px;background:#fff5f5;border:1px solid rgba(220,38,38,.18);border-radius:10px;font-size:13px;color:#dc2626;margin-bottom:14px;display:flex;align-items:flex-start;gap:8px}

/* ── Info cards ── */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:6px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px 16px;background:#fff;border:1px solid #e5e5e7;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,.04)}
.info-icon{font-size:22px;margin-bottom:10px}
.info-card h3{font-size:12px;font-weight:700;color:#1d1d1f;margin-bottom:5px;letter-spacing:-.01em}
.info-card p{font-size:11px;color:rgba(0,0,0,.42);line-height:1.65}

/* ── Spinner in btn ── */
.spin{width:14px;height:14px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
`

// ─── Mammoth CDN loader ───────────────────────────────────────────────────────
let mammothLib: any = null
async function loadMammoth(): Promise<any> {
  if (mammothLib) return mammothLib
  if ((window as any).mammoth) { mammothLib = (window as any).mammoth; return mammothLib }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js'
    s.onload  = () => { mammothLib = (window as any).mammoth; resolve() }
    s.onerror = () => reject(new Error('Failed to load Mammoth.js — check your internet connection.'))
    document.head.appendChild(s)
  })
  return mammothLib
}

// ─── Block types ─────────────────────────────────────────────────────────────
interface Block {
  kind: 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'hr' | 'blank'
  text: string
  indent: number
}

function htmlToBlocks(html: string): Block[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const blocks: Block[] = []

  function text(el: Node): string {
    if (el.nodeType === 3) return el.textContent ?? ''
    if (el.nodeType !== 1) return ''
    return Array.from((el as Element).childNodes).map(text).join('')
  }

  function walk(el: Element, depth = 0) {
    const tag = el.tagName.toLowerCase()
    if (tag === 'hr') { blocks.push({ kind: 'hr', text: '', indent: 0 }); return }

    const hm = tag.match(/^h([1-6])$/)
    if (hm) {
      const lvl = Math.min(3, parseInt(hm[1])) as 1|2|3
      const t = text(el).trim()
      if (t) blocks.push({ kind: `h${lvl}` as 'h1'|'h2'|'h3', text: t, indent: 0 })
      return
    }

    if (tag === 'ul' || tag === 'ol') {
      for (const li of Array.from(el.children)) {
        if (li.tagName.toLowerCase() !== 'li') continue
        const directText = Array.from(li.childNodes)
          .filter(n => !(n.nodeType === 1 && ['ul','ol'].includes((n as Element).tagName?.toLowerCase())))
          .map(text).join('').trim()
        if (directText) blocks.push({ kind: 'li', text: directText, indent: depth })
        for (const nested of Array.from(li.children)) {
          const nt = nested.tagName.toLowerCase()
          if (nt === 'ul' || nt === 'ol') walk(nested, depth + 1)
        }
      }
      return
    }

    if (tag === 'table') {
      for (const row of Array.from(el.querySelectorAll('tr'))) {
        const cells = Array.from(row.querySelectorAll('td,th'))
          .map(c => c.textContent?.trim() ?? '').filter(Boolean)
        if (cells.length) blocks.push({ kind: 'p', text: cells.join('  |  '), indent: 0 })
      }
      return
    }

    if (tag === 'p' || tag === 'div' || tag === 'blockquote') {
      const hasBlock = Array.from(el.children).some(c =>
        /^(p|h[1-6]|ul|ol|table|hr|div|blockquote)$/.test(c.tagName.toLowerCase())
      )
      if (hasBlock) {
        for (const child of Array.from(el.children)) walk(child, depth)
      } else {
        const t = text(el).trim()
        if (t) blocks.push({ kind: 'p', text: t, indent: 0 })
        else   blocks.push({ kind: 'blank', text: '', indent: 0 })
      }
      return
    }

    for (const child of Array.from(el.children)) walk(child, depth)
  }

  for (const el of Array.from(doc.body.children)) walk(el)
  return blocks
}

// ─── PDF builder ─────────────────────────────────────────────────────────────
type PageSize   = 'A4' | 'Letter'
type Orientation = 'Portrait' | 'Landscape'
type FontSize   = 10 | 11 | 12

async function buildPDF(
  blocks: Block[],
  pageSize: PageSize,
  orientation: Orientation,
  fontSize: FontSize,
  filename: string,
): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

  const pdfDoc = await PDFDocument.create()
  const fontR  = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontB  = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let [PW, PH] = pageSize === 'A4' ? [595.28, 841.89] : [612, 792]
  if (orientation === 'Landscape') [PW, PH] = [PH, PW]

  const ML = 68, MR = 68, MT = 68, MB = 60
  const TW = PW - ML - MR

  const ACCENT = rgb(0.145, 0.390, 0.918)
  const DARK   = rgb(0.08,  0.08,  0.08)
  const GRAY   = rgb(0.50,  0.50,  0.50)
  const LGRAY  = rgb(0.87,  0.87,  0.87)

  const FS: Record<string, number> = {
    h1: fontSize + 11, h2: fontSize + 6, h3: fontSize + 3,
    p: fontSize, li: fontSize, blank: fontSize, hr: 0,
  }

  let page: ReturnType<typeof pdfDoc.addPage> = null as any
  let y = 0, pageNum = 0

  const newPage = () => {
    pageNum++
    page = pdfDoc.addPage([PW, PH])
    y = PH - MT
  }

  const footer = () => {
    page.drawLine({ start:{x:ML,y:MB-4}, end:{x:PW-MR,y:MB-4}, thickness:0.4, color:LGRAY })
    page.drawText(`${filename}  ·  Page ${pageNum}`, { x:ML, y:MB-16, font:fontR, size:7.5, color:GRAY })
  }

  const wrap = (str: string, font: typeof fontR, fs: number, maxW: number): string[] => {
    const lines: string[] = []
    const words = str.split(/\s+/).filter(Boolean)
    let cur = ''
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (font.widthOfTextAtSize(test, fs) > maxW && cur) { lines.push(cur); cur = w }
      else cur = test
    }
    if (cur) lines.push(cur)
    return lines.length ? lines : ['']
  }

  newPage()

  for (const block of blocks) {
    if (block.kind === 'hr') {
      if (y - 16 < MB + 20) { footer(); newPage() }
      page.drawLine({ start:{x:ML,y:y-8}, end:{x:PW-MR,y:y-8}, thickness:0.5, color:LGRAY })
      y -= 16; continue
    }
    if (block.kind === 'blank') {
      y -= fontSize * 0.6
      if (y < MB + 20) { footer(); newPage() }
      continue
    }

    const fs    = FS[block.kind] ?? fontSize
    const font  = block.kind === 'h1' || block.kind === 'h2' || block.kind === 'h3' ? fontB : fontR
    const lineH = fs * 1.45
    const indent  = block.indent * 14
    const isList  = block.kind === 'li'
    const isH1    = block.kind === 'h1'
    const isH2    = block.kind === 'h2'
    const isH3    = block.kind === 'h3'

    if (isH1 && y < PH - MT - 2) y -= fontSize * 1.4
    if (isH2 && y < PH - MT - 2) y -= fontSize * 0.9
    if (isH3 && y < PH - MT - 2) y -= fontSize * 0.6

    const bulletPad = isList ? 14 + indent : indent
    const availW    = TW - bulletPad - (isH1 ? 9 : 0)
    const lines     = wrap(block.text, font, fs, availW)

    for (let i = 0; i < lines.length; i++) {
      if (y - fs < MB + 20) { footer(); newPage() }
      const lx = ML + bulletPad + (isH1 ? 9 : 0)
      const ly = y - fs

      if (isH1 && i === 0)
        page.drawRectangle({ x:ML+indent, y:ly-2, width:3, height:fs+4, color:ACCENT })

      page.drawText(lines[i], { x:lx, y:ly, font, size:fs, color:isH1 ? ACCENT : DARK })

      if (isList && i === 0) {
        const bullet = block.indent > 0 ? '–' : '•'
        page.drawText(bullet, { x:ML+indent+2, y:ly, font:fontR, size:fs, color:GRAY })
      }
      y -= lineH
    }

    const gap = isH1 ? 6 : isH2 ? 4 : isH3 ? 3 : isList ? 2 : fontSize * 0.4
    y -= gap
    if (y < MB + 20) { footer(); newPage() }
  }

  footer()
  return pdfDoc.save()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(b: number) {
  return b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
}
function wordCount(html: string) {
  return html.replace(/<[^>]+>/g,' ').trim().split(/\s+/).filter(Boolean).length
}
function triggerDownload(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type:'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href=url; a.download=name; a.click()
  URL.revokeObjectURL(url)
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const WordIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white" fillOpacity=".9"/>
    <polyline points="14 2 14 8 20 8" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" fill="none"/>
    <path d="M8 13l1.5 4 1.5-3 1.5 3L14 13" stroke="rgba(255,255,255,.75)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

// ─── Component ───────────────────────────────────────────────────────────────
export default function WordToPDFPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [html,        setHtml]        = useState('')
  const [blocks,      setBlocks]      = useState<Block[]>([])
  const [words,       setWords]       = useState(0)
  const [pageSize,    setPageSize]    = useState<PageSize>('A4')
  const [orientation, setOrientation] = useState<Orientation>('Portrait')
  const [fontSize,    setFontSize]    = useState<FontSize>(11)
  const [loading,     setLoading]     = useState(false)
  const [converting,  setConverting]  = useState(false)
  const [isDrop,      setIsDrop]      = useState(false)
  const [error,       setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (ext !== 'docx') {
      setError('Please upload a .docx file. Legacy .doc files are not supported — save as .docx in Word first.'); return
    }
    setError(''); setLoading(true); setHtml(''); setBlocks([])
    try {
      const mammoth = await loadMammoth()
      const buf = await f.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer: buf })
      const h = result.value as string
      if (!h.trim()) { setError('This document appears to be empty.'); setLoading(false); return }
      const parsed = htmlToBlocks(h)
      setFile(f); setHtml(h); setBlocks(parsed); setWords(wordCount(h))
    } catch (e: any) {
      setError(e?.message ?? 'Could not read the Word document.')
    } finally {
      setLoading(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const convert = async () => {
    if (!file || !blocks.length) return
    setConverting(true); setError('')
    try {
      const bytes = await buildPDF(blocks, pageSize, orientation, fontSize, file.name)
      const name  = file.name.replace(/\.docx$/i,'') + '.pdf'
      triggerDownload(bytes, name)
    } catch (e: any) {
      setError(e?.message ?? 'PDF generation failed.')
    } finally {
      setConverting(false)
    }
  }

  const reset = () => { setFile(null); setHtml(''); setBlocks([]); setWords(0); setError('') }
  const hasDoc = !!html

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        <div className="wrap">

          {/* Hero */}
          <div className="hero">
            <div className="badge">
              <span className="badge-dot"/>
              100% In-Browser · No Upload
            </div>
            <h1>Word to <em>PDF</em></h1>
            <p>Convert .docx files instantly — headings, lists, tables and formatting preserved. Everything runs in your browser, nothing sent to any server.</p>
          </div>

          {loading ? (
            <div className="card">
              <div className="loading-state">
                <div className="big-spin"/>
                <div className="loading-title">Reading document…</div>
                <div className="loading-sub">Parsing with Mammoth.js</div>
              </div>
            </div>
          ) : !hasDoc ? (
            /* ── Upload ── */
            <div className="card">
              {error && (
                <div className="err">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}
              <div
                className={`drop${isDrop ? ' over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                onDragLeave={() => setIsDrop(false)}
              >
                <div className="drop-inner">
                  <div className="drop-icon-wrap">
                    <WordIcon/>
                  </div>
                  <h2>Drop your Word document here</h2>
                  <div className="type-chip">
                    <span style={{width:5,height:5,borderRadius:'50%',background:'#2563eb',display:'inline-block'}}/>
                    DOCX only
                  </div>
                  <p>Microsoft Word 2007+ format — headings, paragraphs, lists, tables and inline formatting are all preserved</p>
                  <button className="browse-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Document loaded ── */
            <>
              {error && (
                <div className="err">
                  <span>⚠</span><span>{error}</span>
                </div>
              )}

              {/* File row */}
              <div className="card" style={{padding:'14px 18px'}}>
                <div className="file-row" style={{marginBottom:0}}>
                  <div className="file-icon-box">
                    <WordIcon/>
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file?.name}</div>
                    <div className="file-size">{fmt(file?.size ?? 0)} · .docx</div>
                  </div>
                  <button className="rm-btn" onClick={reset} title="Remove file">×</button>
                </div>
              </div>

              {/* Settings */}
              <div className="settings">
                <span className="set-label">Page</span>
                <div className="tg-wrap">
                  {(['A4','Letter'] as PageSize[]).map(s => (
                    <button key={s} className={`tg${pageSize===s?' on':''}`} onClick={()=>setPageSize(s)}>{s}</button>
                  ))}
                </div>
                <div className="set-sep"/>
                <span className="set-label">Orientation</span>
                <div className="tg-wrap">
                  {(['Portrait','Landscape'] as Orientation[]).map(o => (
                    <button key={o} className={`tg${orientation===o?' on':''}`} onClick={()=>setOrientation(o)}>{o}</button>
                  ))}
                </div>
                <div className="set-sep"/>
                <span className="set-label">Font size</span>
                <div className="tg-wrap">
                  {([10,11,12] as FontSize[]).map(n => (
                    <button key={n} className={`tg${fontSize===n?' on':''}`} onClick={()=>setFontSize(n)}>{n}pt</button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="preview-wrap">
                <div className="preview-hdr">
                  <div>
                    <div className="preview-ttl">Document Preview</div>
                    <div className="preview-sub">Live render — formatting simplifies slightly in final PDF</div>
                  </div>
                  <div className="stats-row">
                    <span className="stat-chip">📝 {words.toLocaleString()} words</span>
                    <span className="stat-chip">📋 {blocks.filter(b=>b.kind!=='blank'&&b.kind!=='hr').length} blocks</span>
                    <span className="stat-chip">📄 {pageSize} {orientation === 'Landscape' ? '⟷' : ''}</span>
                  </div>
                </div>
                <div
                  className="doc-preview"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>

              {/* Actions */}
              <div className="action-row">
                <button className="sec-btn" onClick={reset}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  New File
                </button>
                <button className="pri-btn" onClick={convert} disabled={converting}>
                  {converting
                    ? <><div className="spin"/> Generating PDF…</>
                    : <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download PDF
                      </>
                  }
                </button>
              </div>
            </>
          )}

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📝</div>
              <h3>Full .docx Support</h3>
              <p>Powered by Mammoth.js — reads headings, paragraphs, lists, tables and inline formatting from Word 2007+ files.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📐</div>
              <h3>Flexible Layout</h3>
              <p>Choose A4 or Letter, portrait or landscape orientation, and 10–12pt font size before generating your PDF.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>100% Private</h3>
              <p>Your document is parsed entirely in your browser using WebAssembly. Nothing is ever sent to any server.</p>
            </div>
          </div>

        </div>
      </div>

      <input
        ref={fileRef} type="file" accept=".docx"
        style={{display:'none'}}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value='' }}
      />
      <ToolSEOSection {...toolSeoData['word-to-pdf']} />
    </>
  )
}
