'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

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
.logo-name em{font-style:normal;color:#059669}
.nav-sep{font-size:13px;color:rgba(0,0,0,.18);font-weight:300}
.nav-tool{font-size:13px;font-weight:600;color:#1d1d1f;letter-spacing:-.01em}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.4);text-decoration:none;padding:6px 13px;border-radius:8px;border:1px solid rgba(0,0,0,.1);transition:all .15s;letter-spacing:-.01em}
.back:hover{color:#1d1d1f;border-color:rgba(0,0,0,.25);background:#fff}

/* ── Layout ── */
.wrap{max-width:860px;margin:0 auto;padding:48px 20px 96px}

/* ── Hero ── */
.hero{text-align:center;margin-bottom:40px;animation:fadeup .35s ease}
.badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:#d1fae5;border:1px solid rgba(5,150,105,.18);border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#059669;text-transform:uppercase;margin-bottom:16px}
.badge-dot{width:5px;height:5px;border-radius:50%;background:#059669;animation:pulse 2s ease infinite}
.hero h1{font-size:clamp(28px,5vw,46px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;line-height:1.05;margin-bottom:12px}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,#059669,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:15px;color:rgba(0,0,0,.42);line-height:1.65;max-width:460px;margin:0 auto}

/* ── Card ── */
.card{background:#fff;border:1px solid #e5e5e7;border-radius:18px;padding:28px;margin-bottom:14px;box-shadow:0 1px 12px rgba(0,0,0,.05)}

/* ── Drop zone ── */
.drop{border:2px dashed #d2d2d7;border-radius:14px;padding:56px 28px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;position:relative;overflow:hidden}
.drop::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#d1fae5 0%,#fff 100%);opacity:0;transition:opacity .2s}
.drop:hover,.drop.over{border-color:#059669;background:#f0fdf4}
.drop:hover::before,.drop.over::before{opacity:1}
.drop-inner{position:relative;z-index:1}
.drop-icon-wrap{width:72px;height:72px;background:linear-gradient(135deg,#059669,#10b981);border-radius:20px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(5,150,105,.28);transition:transform .2s}
.drop:hover .drop-icon-wrap,.drop.over .drop-icon-wrap{transform:scale(1.06)}
.drop h2{font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:8px;letter-spacing:-.02em}
.drop p{font-size:13px;color:rgba(0,0,0,.38);margin-bottom:20px;line-height:1.6;max-width:380px;margin-left:auto;margin-right:auto}
.type-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#d1fae5;border:1px solid rgba(5,150,105,.2);border-radius:8px;font-size:11px;font-weight:700;color:#059669;letter-spacing:.06em;margin-bottom:20px}
.browse-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:#1d1d1f;border-radius:10px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:all .16s;letter-spacing:-.01em}
.browse-btn:hover{background:#059669;transform:translateY(-1px);box-shadow:0 4px 16px rgba(5,150,105,.35)}

/* ── Compat row ── */
.compat-row{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:12px}
.compat{padding:3px 9px;background:rgba(0,0,0,.04);border-radius:6px;font-size:10px;font-weight:600;color:rgba(0,0,0,.38);letter-spacing:.02em}

/* ── File row ── */
.file-row{display:flex;align-items:center;gap:14px;padding:14px 16px;background:#f5f5f7;border:1px solid #e5e5e7;border-radius:12px;margin-bottom:14px;animation:fadeup .2s ease}
.file-icon-box{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,#059669,#10b981);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(5,150,105,.25)}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-.01em}
.file-size{font-size:11px;color:rgba(0,0,0,.38);margin-top:2px}
.rm-btn{width:28px;height:28px;border-radius:8px;background:transparent;border:1px solid #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.3);font-size:16px;transition:all .15s;line-height:1;flex-shrink:0}
.rm-btn:hover{border-color:#ef4444;color:#ef4444;background:#fff5f5}

/* ── Settings ── */
.settings{display:flex;align-items:center;gap:10px;padding:14px 18px;background:#fafafa;border:1px solid #e5e5e7;border-radius:12px;margin-bottom:14px;flex-wrap:wrap}
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
.stat-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#d1fae5;border-radius:99px;font-size:10px;font-weight:700;color:#059669;letter-spacing:.02em}

.doc-preview{padding:32px 40px;max-height:480px;overflow-y:auto;font-size:13.5px;line-height:1.78;color:#1d1d1f;background:#fff}
.doc-preview h1{font-size:22px;font-weight:800;color:#1d1d1f;margin:18px 0 8px;letter-spacing:-.03em;padding-left:11px;border-left:3.5px solid #059669;line-height:1.2}
.doc-preview h2{font-size:17px;font-weight:700;color:#1d1d1f;margin:14px 0 6px;letter-spacing:-.02em}
.doc-preview h3{font-size:14px;font-weight:700;color:#374151;margin:11px 0 4px}
.doc-preview p{margin-bottom:8px}
.doc-preview ul{margin:0 0 8px 20px}.doc-preview li{margin-bottom:3px}
.doc-preview .blank{height:6px}
.doc-preview hr{border:none;border-top:1px solid #e5e5e7;margin:14px 0}
@media(max-width:600px){.doc-preview{padding:20px 18px}}

/* ── Loading ── */
.loading-state{text-align:center;padding:56px 24px}
.big-spin{width:36px;height:36px;border:3px solid rgba(5,150,105,.15);border-top-color:#059669;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 18px}
.loading-title{font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:5px;letter-spacing:-.01em}
.loading-sub{font-size:12px;color:rgba(0,0,0,.38)}

/* ── Actions ── */
.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.sec-btn{flex:1;min-width:140px;padding:13px 18px;background:#fff;border:1.5px solid #e0e0e0;border-radius:11px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;letter-spacing:-.01em}
.sec-btn:hover{border-color:#059669;color:#059669}
.pri-btn{flex:2;min-width:200px;padding:13px 22px;background:linear-gradient(135deg,#059669,#047857);border:none;border-radius:11px;font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(5,150,105,.35);letter-spacing:-.01em}
.pri-btn:hover:not(:disabled){background:linear-gradient(135deg,#047857,#065f46);transform:translateY(-1px);box-shadow:0 6px 20px rgba(5,150,105,.4)}
.pri-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}

/* ── Error ── */
.err{padding:12px 16px;background:#fff5f5;border:1px solid rgba(220,38,38,.18);border-radius:10px;font-size:13px;color:#dc2626;margin-bottom:14px;display:flex;align-items:flex-start;gap:8px}

/* ── Info cards ── */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:6px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px 16px;background:#fff;border:1px solid #e5e5e7;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,.04)}
.info-icon{font-size:22px;margin-bottom:10px}
.info-card h3{font-size:12px;font-weight:700;color:#1d1d1f;margin-bottom:5px;letter-spacing:-.01em}
.info-card p{font-size:11px;color:rgba(0,0,0,.42);line-height:1.65}

.spin{width:14px;height:14px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
`

// ─── JSZip CDN loader ─────────────────────────────────────────────────────────
let jszipLib: any = null
async function loadJSZip(): Promise<any> {
  if (jszipLib) return jszipLib
  if ((window as any).JSZip) { jszipLib = (window as any).JSZip; return jszipLib }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
    s.onload  = () => { jszipLib = (window as any).JSZip; resolve() }
    s.onerror = () => reject(new Error('Failed to load JSZip — check your internet connection.'))
    document.head.appendChild(s)
  })
  return jszipLib
}

// ─── Block types ─────────────────────────────────────────────────────────────
interface Block {
  kind: 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'hr' | 'blank'
  text: string
  indent: number
}

// ─── ODT XML helpers ─────────────────────────────────────────────────────────
// ODF namespace URIs
const NS_TEXT   = 'urn:oasis:names:tc:opendocument:xmlns:text:1.0'
const NS_OFFICE = 'urn:oasis:names:tc:opendocument:xmlns:office:1.0'
const NS_DRAW   = 'urn:oasis:names:tc:opendocument:xmlns:drawing:1.0'

function tAttr(el: Element, name: string): string | null {
  return el.getAttributeNS(NS_TEXT, name) ?? el.getAttribute('text:' + name)
}

// Extract readable text from an inline-content element
function inlineText(node: Element): string {
  let out = ''
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === 3) {
      out += child.textContent ?? ''
    } else if (child.nodeType === 1) {
      const el = child as Element
      const ln = el.localName
      if (ln === 's') {
        // text:s = run of spaces; text:c = count (default 1)
        const c = parseInt(tAttr(el, 'c') ?? '1') || 1
        out += ' '.repeat(Math.min(c, 200))
      } else if (ln === 'tab') {
        out += '\t'
      } else if (ln === 'line-break') {
        out += '\n'
      } else if (
        ln === 'note' || ln === 'annotation' ||
        ln === 'change' || ln === 'change-start' || ln === 'change-end' ||
        ln === 'bookmark-start' || ln === 'bookmark-end' || ln === 'bookmark'
      ) {
        // skip footnotes, tracked changes, bookmarks
      } else {
        out += inlineText(el)
      }
    }
  }
  return out
}

// Find the office:text root element
function findOfficeText(doc: Document): Element | null {
  // Walk looking for localName === 'text' inside localName === 'body'
  function walk(el: Element): Element | null {
    for (const child of Array.from(el.children)) {
      if (child.localName === 'text' && child.namespaceURI === NS_OFFICE) return child
      const found = walk(child)
      if (found) return found
    }
    return null
  }
  return walk(doc.documentElement)
}

function walkContent(parent: Element, blocks: Block[], listDepth = 0): void {
  for (const node of Array.from(parent.children)) {
    const ln = node.localName

    if (ln === 'h') {
      const level = parseInt(tAttr(node, 'outline-level') ?? '1') || 1
      const t = inlineText(node).trim()
      if (t) blocks.push({
        kind: level <= 1 ? 'h1' : level === 2 ? 'h2' : 'h3',
        text: t, indent: 0,
      })

    } else if (ln === 'p') {
      // Check for a horizontal rule style
      const styleName = tAttr(node, 'style-name') ?? ''
      if (styleName.toLowerCase().includes('horizontal') || styleName.toLowerCase().includes('ruler')) {
        blocks.push({ kind: 'hr', text: '', indent: 0 })
        continue
      }
      const t = inlineText(node).trim()
      if (t) blocks.push({ kind: 'p', text: t, indent: 0 })
      else   blocks.push({ kind: 'blank', text: '', indent: 0 })

    } else if (ln === 'list') {
      walkList(node, blocks, listDepth)

    } else if (ln === 'section') {
      walkContent(node, blocks, listDepth)

    } else if (ln === 'table') {
      walkTable(node, blocks)

    } else if (ln === 'frame') {
      // draw:frame may contain text boxes
      for (const child of Array.from(node.children)) {
        if (child.localName === 'text-box') walkContent(child, blocks, listDepth)
      }
    }
  }
}

function walkList(listEl: Element, blocks: Block[], depth: number): void {
  for (const item of Array.from(listEl.children)) {
    if (item.localName !== 'list-item') continue
    for (const child of Array.from(item.children)) {
      const ln = child.localName
      if (ln === 'p' || ln === 'h') {
        const t = inlineText(child).trim()
        if (t) blocks.push({ kind: 'li', text: t, indent: depth })
      } else if (ln === 'list') {
        walkList(child, blocks, depth + 1)
      }
    }
  }
}

function walkTable(tableEl: Element, blocks: Block[]): void {
  // Collect all table-row descendants (handles header-rows wrapper too)
  function collectRows(el: Element): Element[] {
    const rows: Element[] = []
    for (const child of Array.from(el.children)) {
      if (child.localName === 'table-row') rows.push(child)
      else rows.push(...collectRows(child))
    }
    return rows
  }
  for (const row of collectRows(tableEl)) {
    const cells: string[] = []
    for (const cell of Array.from(row.children)) {
      if (cell.localName === 'table-cell' || cell.localName === 'covered-table-cell') {
        const t = inlineText(cell).trim()
        if (t) cells.push(t)
      }
    }
    if (cells.length) blocks.push({ kind: 'p', text: cells.join('  |  '), indent: 0 })
  }
}

async function parseODT(buffer: ArrayBuffer): Promise<Block[]> {
  const JSZip = await loadJSZip()
  const zip   = await JSZip.loadAsync(buffer)

  const contentFile = zip.file('content.xml')
  if (!contentFile) throw new Error('Invalid ODT file — missing content.xml')

  const xmlStr = await contentFile.async('string')
  const doc    = new DOMParser().parseFromString(xmlStr, 'text/xml')

  const parseErr = doc.querySelector('parsererror')
  if (parseErr) throw new Error('Could not parse ODT content — file may be corrupted')

  const officeText = findOfficeText(doc)
  if (!officeText) throw new Error('Could not find document body in ODT file')

  const blocks: Block[] = []
  walkContent(officeText, blocks)
  return blocks
}

// ─── PDF builder ─────────────────────────────────────────────────────────────
type PageSize    = 'A4' | 'Letter'
type Orientation = 'Portrait' | 'Landscape'
type FontSize    = 10 | 11 | 12

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

  const ACCENT = rgb(0.020, 0.588, 0.412)  // #059669
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
    const words = str.replace(/\t/g, '  ').split(/\s+/).filter(Boolean)
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
    const font  = (block.kind === 'h1' || block.kind === 'h2' || block.kind === 'h3') ? fontB : fontR
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
function blockStats(blocks: Block[]) {
  const words = blocks.filter(b => b.text).reduce((n, b) => n + b.text.trim().split(/\s+/).filter(Boolean).length, 0)
  const paras = blocks.filter(b => b.kind !== 'blank' && b.kind !== 'hr').length
  return { words, paras }
}
function triggerDownload(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type:'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href=url; a.download=name; a.click()
  URL.revokeObjectURL(url)
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const OdtIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white" fillOpacity=".9"/>
    <polyline points="14 2 14 8 20 8" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" fill="none"/>
    <text x="6.5" y="18" fontSize="6.5" fontWeight="bold" fill="rgba(255,255,255,.85)" fontFamily="monospace">ODT</text>
  </svg>
)

// ─── Preview renderer ─────────────────────────────────────────────────────────
function BlockPreview({ blocks }: { blocks: Block[] }) {
  const preview = blocks.slice(0, 120)
  return (
    <div className="doc-preview">
      {preview.map((b, i) => {
        if (b.kind === 'blank') return <div key={i} className="blank"/>
        if (b.kind === 'hr')    return <hr key={i}/>
        if (b.kind === 'h1')    return <h1 key={i}>{b.text}</h1>
        if (b.kind === 'h2')    return <h2 key={i}>{b.text}</h2>
        if (b.kind === 'h3')    return <h3 key={i}>{b.text}</h3>
        if (b.kind === 'li')    return (
          <ul key={i} style={{marginLeft: b.indent * 12}}>
            <li>{b.text}</li>
          </ul>
        )
        return <p key={i}>{b.text}</p>
      })}
      {blocks.length > 120 && (
        <p style={{color:'rgba(0,0,0,.35)',fontSize:12,marginTop:12}}>
          … ({(blocks.length - 120).toLocaleString()} more blocks)
        </p>
      )}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ODTToPDFPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [blocks,      setBlocks]      = useState<Block[]>([])
  const [pageSize,    setPageSize]    = useState<PageSize>('A4')
  const [orientation, setOrientation] = useState<Orientation>('Portrait')
  const [fontSize,    setFontSize]    = useState<FontSize>(11)
  const [isDrop,      setIsDrop]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [converting,  setConverting]  = useState(false)
  const [error,       setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (ext !== 'odt') { setError('Please upload an .odt file.'); return }
    setError(''); setLoading(true); setBlocks([])
    try {
      const buf    = await f.arrayBuffer()
      const parsed = await parseODT(buf)
      if (!parsed.some(b => b.text.trim())) {
        setError('No readable text found in this ODT file.'); setLoading(false); return
      }
      setFile(f); setBlocks(parsed)
    } catch (e: any) {
      setError(e?.message ?? 'Could not read the ODT file.')
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
      triggerDownload(bytes, file.name.replace(/\.odt$/i, '') + '.pdf')
    } catch (e: any) {
      setError(e?.message ?? 'PDF generation failed.')
    } finally {
      setConverting(false)
    }
  }

  const reset = () => { setFile(null); setBlocks([]); setError('') }

  const hasDoc = blocks.length > 0
  const s = blockStats(blocks)

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
            <h1>ODT to <em>PDF</em></h1>
            <p>Convert OpenDocument Text files to PDF instantly. Headings, paragraphs, lists and tables are all preserved — nothing sent to any server.</p>
          </div>

          {loading ? (
            <div className="card">
              <div className="loading-state">
                <div className="big-spin"/>
                <div className="loading-title">Parsing document…</div>
                <div className="loading-sub">Extracting content from ODT</div>
              </div>
            </div>
          ) : !hasDoc ? (
            /* ── Upload ── */
            <div className="card">
              {error && <div className="err"><span>⚠</span><span>{error}</span></div>}
              <div
                className={`drop${isDrop?' over':''}`}
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                onDragLeave={() => setIsDrop(false)}
              >
                <div className="drop-inner">
                  <div className="drop-icon-wrap"><OdtIcon/></div>
                  <h2>Drop your ODT file here</h2>
                  <div className="type-chip">
                    <span style={{width:5,height:5,borderRadius:'50%',background:'#059669',display:'inline-block'}}/>
                    .ODT only
                  </div>
                  <p>OpenDocument Text format — the open standard used by LibreOffice, OpenOffice and Google Docs</p>
                  <button className="browse-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Choose File
                  </button>
                  <div className="compat-row">
                    {['LibreOffice','OpenOffice','Google Docs','WPS Office','OnlyOffice'].map(app => (
                      <span key={app} className="compat">{app}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── Document loaded ── */
            <>
              {error && <div className="err"><span>⚠</span><span>{error}</span></div>}

              {/* File row */}
              <div className="card" style={{padding:'14px 18px'}}>
                <div className="file-row" style={{marginBottom:0}}>
                  <div className="file-icon-box"><OdtIcon/></div>
                  <div className="file-info">
                    <div className="file-name">{file?.name}</div>
                    <div className="file-size">{fmt(file?.size ?? 0)} · .odt</div>
                  </div>
                  <button className="rm-btn" onClick={reset} title="Remove">×</button>
                </div>
              </div>

              {/* Settings */}
              <div className="settings">
                <span className="set-label">Page</span>
                <div className="tg-wrap">
                  {(['A4','Letter'] as PageSize[]).map(ps => (
                    <button key={ps} className={`tg${pageSize===ps?' on':''}`} onClick={()=>setPageSize(ps)}>{ps}</button>
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
                    <div className="preview-sub">Rendered content — formatting preserved in final PDF</div>
                  </div>
                  <div className="stats-row">
                    <span className="stat-chip">📝 {s.words.toLocaleString()} words</span>
                    <span className="stat-chip">📋 {s.paras.toLocaleString()} blocks</span>
                    <span className="stat-chip">📄 {pageSize} {orientation === 'Landscape' ? '⟷' : ''}</span>
                  </div>
                </div>
                <BlockPreview blocks={blocks}/>
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
              <div className="info-icon">📂</div>
              <h3>Full ODT Support</h3>
              <p>Parses the OpenDocument XML directly — headings (H1–H6), paragraphs, lists, tables and text boxes all extracted correctly.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📐</div>
              <h3>Flexible Layout</h3>
              <p>Choose A4 or Letter, portrait or landscape orientation, and 10–12pt font size. Headings get styled accents in the PDF.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>100% Private</h3>
              <p>The ODT is unzipped and parsed entirely in your browser using JSZip + pdf-lib. No file is ever sent to any server.</p>
            </div>
          </div>

        </div>
      </div>

      <input
        ref={fileRef} type="file" accept=".odt"
        style={{display:'none'}}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value='' }}
      />
    </>
  )
}
