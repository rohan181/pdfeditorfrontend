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
.logo-name em{font-style:normal;color:#b45309}
.nav-sep{font-size:13px;color:rgba(0,0,0,.18);font-weight:300}
.nav-tool{font-size:13px;font-weight:600;color:#1d1d1f;letter-spacing:-.01em}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.4);text-decoration:none;padding:6px 13px;border-radius:8px;border:1px solid rgba(0,0,0,.1);transition:all .15s;letter-spacing:-.01em}
.back:hover{color:#1d1d1f;border-color:rgba(0,0,0,.25);background:#fff}

/* ── Layout ── */
.wrap{max-width:860px;margin:0 auto;padding:48px 20px 96px}

/* ── Hero ── */
.hero{text-align:center;margin-bottom:40px;animation:fadeup .35s ease}
.badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:#fef3c7;border:1px solid rgba(180,83,9,.18);border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#b45309;text-transform:uppercase;margin-bottom:16px}
.badge-dot{width:5px;height:5px;border-radius:50%;background:#b45309;animation:pulse 2s ease infinite}
.hero h1{font-size:clamp(28px,5vw,46px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;line-height:1.05;margin-bottom:12px}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,#b45309,#d97706);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:15px;color:rgba(0,0,0,.42);line-height:1.65;max-width:460px;margin:0 auto}

/* ── Card ── */
.card{background:#fff;border:1px solid #e5e5e7;border-radius:18px;padding:28px;margin-bottom:14px;box-shadow:0 1px 12px rgba(0,0,0,.05)}

/* ── Drop zone ── */
.drop{border:2px dashed #d2d2d7;border-radius:14px;padding:56px 28px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;position:relative;overflow:hidden}
.drop::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#fef3c7 0%,#fff 100%);opacity:0;transition:opacity .2s}
.drop:hover,.drop.over{border-color:#b45309;background:#fffbeb}
.drop:hover::before,.drop.over::before{opacity:1}
.drop-inner{position:relative;z-index:1}
.drop-icon-wrap{width:72px;height:72px;background:linear-gradient(135deg,#b45309,#d97706);border-radius:20px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(180,83,9,.28);transition:transform .2s}
.drop:hover .drop-icon-wrap,.drop.over .drop-icon-wrap{transform:scale(1.06)}
.drop h2{font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:8px;letter-spacing:-.02em}
.drop p{font-size:13px;color:rgba(0,0,0,.38);margin-bottom:20px;line-height:1.6;max-width:360px;margin-left:auto;margin-right:auto}
.type-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#fef3c7;border:1px solid rgba(180,83,9,.2);border-radius:8px;font-size:11px;font-weight:700;color:#b45309;letter-spacing:.06em;margin-bottom:20px}
.browse-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:#1d1d1f;border-radius:10px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:all .16s;letter-spacing:-.01em}
.browse-btn:hover{background:#b45309;transform:translateY(-1px);box-shadow:0 4px 16px rgba(180,83,9,.35)}

/* ── Compat badges ── */
.compat-row{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:10px}
.compat{padding:3px 9px;background:rgba(0,0,0,.04);border-radius:6px;font-size:10px;font-weight:600;color:rgba(0,0,0,.4);letter-spacing:.02em}

/* ── File row ── */
.file-row{display:flex;align-items:center;gap:14px;padding:14px 16px;background:#f5f5f7;border:1px solid #e5e5e7;border-radius:12px;margin-bottom:14px;animation:fadeup .2s ease}
.file-icon-box{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,#b45309,#d97706);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(180,83,9,.25)}
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
.stat-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#fef3c7;border-radius:99px;font-size:10px;font-weight:700;color:#b45309;letter-spacing:.02em}
.txt-preview{padding:24px 32px;max-height:440px;overflow-y:auto;font-size:13px;line-height:1.78;color:#374151;background:#fffbeb;white-space:pre-wrap;word-break:break-word}
@media(max-width:600px){.txt-preview{padding:16px 18px}}

/* ── Loading ── */
.loading-state{text-align:center;padding:56px 24px}
.big-spin{width:36px;height:36px;border:3px solid rgba(180,83,9,.15);border-top-color:#b45309;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 18px}
.loading-title{font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:5px;letter-spacing:-.01em}
.loading-sub{font-size:12px;color:rgba(0,0,0,.38)}

/* ── Actions ── */
.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.sec-btn{flex:1;min-width:140px;padding:13px 18px;background:#fff;border:1.5px solid #e0e0e0;border-radius:11px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;letter-spacing:-.01em}
.sec-btn:hover{border-color:#b45309;color:#b45309}
.pri-btn{flex:2;min-width:200px;padding:13px 22px;background:linear-gradient(135deg,#b45309,#92400e);border:none;border-radius:11px;font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(180,83,9,.35);letter-spacing:-.01em}
.pri-btn:hover:not(:disabled){background:linear-gradient(135deg,#92400e,#78350f);transform:translateY(-1px);box-shadow:0 6px 20px rgba(180,83,9,.4)}
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

// ─── RTF parser ───────────────────────────────────────────────────────────────
const SKIP_DESTS = new Set([
  'fonttbl','colortbl','stylesheet','info','pict','shppict',
  'header','footer','headerf','footerf','headerl','footerl','headerr','footerr',
  'filetbl','rsidtbl','listoverridetable','listtable',
  'themedata','colorschememapping','latentstyles',
  'mmathPr','pgdsc','fldinst','object','datafield',
])

function parseRTF(rtf: string): string {
  const out: string[] = []
  const skipStack: boolean[] = [false]
  let i = 0
  const n = rtf.length

  while (i < n) {
    const ch = rtf[i]

    if (ch === '{') {
      i++
      let skip = skipStack[skipStack.length - 1]
      if (!skip && rtf[i] === '\\') {
        if (rtf[i + 1] === '*') {
          skip = true; i += 2
          if (rtf[i] === ' ') i++
        } else {
          const m = rtf.slice(i + 1).match(/^([a-zA-Z]+)/)
          if (m && SKIP_DESTS.has(m[1])) skip = true
        }
      }
      skipStack.push(skip)

    } else if (ch === '}') {
      if (skipStack.length > 1) skipStack.pop()
      i++

    } else if (ch === '\\') {
      i++
      if (i >= n) break
      const next = rtf[i]

      if (next === "'") {
        i++
        const hex = rtf.slice(i, i + 2); i += 2
        if (!skipStack[skipStack.length - 1]) {
          const code = parseInt(hex, 16)
          if (!isNaN(code) && code > 0) out.push(String.fromCharCode(code))
        }

      } else if (next === '\\' || next === '{' || next === '}') {
        if (!skipStack[skipStack.length - 1]) out.push(next)
        i++

      } else if (next === '~') {
        if (!skipStack[skipStack.length - 1]) out.push(' ')
        i++

      } else if (next === '-' || next === '|') {
        i++

      } else if (next === '_') {
        if (!skipStack[skipStack.length - 1]) out.push('-')
        i++

      } else if (next === '\n' || next === '\r') {
        if (!skipStack[skipStack.length - 1]) out.push('\n')
        i++

      } else if (next === '*') {
        skipStack[skipStack.length - 1] = true
        i++
        if (rtf[i] === ' ') i++

      } else if (/[a-zA-Z]/.test(next)) {
        let word = ''
        while (i < n && /[a-zA-Z]/.test(rtf[i])) { word += rtf[i++] }
        let negative = false
        if (rtf[i] === '-') { negative = true; i++ }
        let param = ''
        while (i < n && /\d/.test(rtf[i])) { param += rtf[i++] }
        const num = param ? (negative ? -parseInt(param) : parseInt(param)) : null
        if (rtf[i] === ' ') i++

        if (!skipStack[skipStack.length - 1]) {
          switch (word) {
            case 'par':    out.push('\n'); break
            case 'pard':   out.push('\n'); break
            case 'line':   out.push('\n'); break
            case 'sect':   out.push('\n\n'); break
            case 'page':   out.push('\n'); break
            case 'column': out.push('\n'); break
            case 'tab':    out.push('\t'); break
            case 'cell':   out.push(' '); break
            case 'row':    out.push('\n'); break
            case 'u':
              if (num !== null) {
                const cp = num < 0 ? num + 65536 : num
                try { out.push(String.fromCodePoint(cp)) } catch { /* skip */ }
              }
              break
          }
        }

      } else {
        i++
      }

    } else {
      if (!skipStack[skipStack.length - 1] && ch !== '\r') out.push(ch)
      i++
    }
  }

  return out.join('')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n +/g, '\n')
    .replace(/^ +/gm, '')
    .trim()
}

// ─── PDF builder ─────────────────────────────────────────────────────────────
type PageSize    = 'A4' | 'Letter'
type Orientation = 'Portrait' | 'Landscape'
type LineSpacing = 'tight' | 'normal' | 'relaxed'

const SPACING_MAP: Record<LineSpacing, number> = { tight: 1.3, normal: 1.55, relaxed: 1.85 }

async function buildPDF(
  text: string,
  pageSize: PageSize,
  orientation: Orientation,
  fontSize: number,
  lineSpacing: LineSpacing,
  filename: string,
): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

  const pdfDoc = await PDFDocument.create()
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontB  = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let [PW, PH] = pageSize === 'A4' ? [595.28, 841.89] : [612, 792]
  if (orientation === 'Landscape') [PW, PH] = [PH, PW]

  const ML = 68, MR = 68, MT = 68, MB = 56
  const TW = PW - ML - MR

  const DARK   = rgb(0.08, 0.08, 0.08)
  const GRAY   = rgb(0.50, 0.50, 0.50)
  const LGRAY  = rgb(0.87, 0.87, 0.87)
  const ACCENT = rgb(0.706, 0.325, 0.035)

  const lineH = fontSize * SPACING_MAP[lineSpacing]
  let page: ReturnType<typeof pdfDoc.addPage> = null as any
  let y = 0, pageNum = 0

  const newPage = () => {
    pageNum++
    page = pdfDoc.addPage([PW, PH])
    y = PH - MT
  }

  const footer = () => {
    page.drawLine({ start:{x:ML,y:MB-4}, end:{x:PW-MR,y:MB-4}, thickness:0.4, color:LGRAY })
    const label = filename ? `${filename}  ·  Page ${pageNum}` : `Page ${pageNum}`
    page.drawText(label, { x:ML, y:MB-16, font, size:7.5, color:GRAY })
  }

  const wrapLine = (line: string): string[] => {
    if (!line.trim()) return ['']
    const expanded = line.replace(/\t/g, '    ')
    const words = expanded.split(' ')
    const lines: string[] = []
    let cur = ''
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (font.widthOfTextAtSize(test, fontSize) > TW && cur) { lines.push(cur); cur = w }
      else cur = test
    }
    if (cur) lines.push(cur)
    return lines.length ? lines : ['']
  }

  newPage()

  if (filename) {
    page.drawText(filename, { x:ML, y:y-fontSize, font:fontB, size:9, color:ACCENT })
    page.drawLine({ start:{x:ML,y:y-fontSize-5}, end:{x:PW-MR,y:y-fontSize-5}, thickness:0.5, color:LGRAY })
    y -= fontSize + 16
  }

  for (const rawLine of text.split('\n')) {
    for (const wl of wrapLine(rawLine)) {
      if (y - fontSize < MB + 20) { footer(); newPage() }
      if (wl.trim()) page.drawText(wl, { x:ML, y:y-fontSize, font, size:fontSize, color:DARK })
      y -= lineH
    }
  }

  footer()
  return pdfDoc.save()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(b: number) {
  return b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
}
function textStats(t: string) {
  return { lines: t.split('\n').length, words: t.trim() ? t.trim().split(/\s+/).length : 0, chars: t.length }
}
function triggerDownload(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type:'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href=url; a.download=name; a.click()
  URL.revokeObjectURL(url)
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const RtfIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white" fillOpacity=".9"/>
    <polyline points="14 2 14 8 20 8" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" fill="none"/>
    <text x="7" y="18" fontSize="7" fontWeight="bold" fill="rgba(255,255,255,.8)" fontFamily="monospace">RTF</text>
  </svg>
)

// ─── Component ───────────────────────────────────────────────────────────────
export default function RTFToPDFPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [extracted,   setExtracted]   = useState('')
  const [pageSize,    setPageSize]    = useState<PageSize>('A4')
  const [orientation, setOrientation] = useState<Orientation>('Portrait')
  const [fontSize,    setFontSize]    = useState(11)
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>('normal')
  const [isDrop,      setIsDrop]      = useState(false)
  const [parsing,     setParsing]     = useState(false)
  const [converting,  setConverting]  = useState(false)
  const [error,       setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (ext !== 'rtf') { setError('Please upload a .rtf file.'); return }
    setError(''); setParsing(true); setExtracted('')
    try {
      const raw = await f.text()
      if (!raw.trim().startsWith('{\\rtf')) {
        setError('This does not appear to be a valid RTF file.'); setParsing(false); return
      }
      const text = parseRTF(raw)
      if (!text.trim()) {
        setError('No readable text found in this RTF file.'); setParsing(false); return
      }
      setFile(f); setExtracted(text)
    } catch (e: any) {
      setError(e?.message ?? 'Could not parse the RTF file.')
    } finally {
      setParsing(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const convert = async () => {
    if (!file || !extracted) return
    setConverting(true); setError('')
    try {
      const bytes = await buildPDF(extracted, pageSize, orientation, fontSize, lineSpacing, file.name)
      triggerDownload(bytes, file.name.replace(/\.rtf$/i, '') + '.pdf')
    } catch (e: any) {
      setError(e?.message ?? 'PDF generation failed.')
    } finally {
      setConverting(false)
    }
  }

  const reset = () => { setFile(null); setExtracted(''); setError('') }

  const hasDoc = !!extracted
  const s = textStats(extracted)

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
            <h1>RTF to <em>PDF</em></h1>
            <p>Convert Rich Text Format files to clean, paginated PDF instantly. Text and structure extracted in your browser — nothing sent to any server.</p>
          </div>

          {parsing ? (
            <div className="card">
              <div className="loading-state">
                <div className="big-spin"/>
                <div className="loading-title">Parsing RTF…</div>
                <div className="loading-sub">Extracting text content</div>
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
                  <div className="drop-icon-wrap"><RtfIcon/></div>
                  <h2>Drop your RTF file here</h2>
                  <div className="type-chip">
                    <span style={{width:5,height:5,borderRadius:'50%',background:'#b45309',display:'inline-block'}}/>
                    .RTF only
                  </div>
                  <p>Rich Text Format — compatible with Word, WordPad, LibreOffice and Apple Pages</p>
                  <button className="browse-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Choose File
                  </button>
                  <div className="compat-row">
                    {['Microsoft Word','WordPad','LibreOffice','Apple Pages','Google Docs'].map(app => (
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
                  <div className="file-icon-box"><RtfIcon/></div>
                  <div className="file-info">
                    <div className="file-name">{file?.name}</div>
                    <div className="file-size">{fmt(file?.size ?? 0)} · .rtf</div>
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
                  {([10,11,12] as const).map(n => (
                    <button key={n} className={`tg${fontSize===n?' on':''}`} onClick={()=>setFontSize(n)}>{n}pt</button>
                  ))}
                </div>
                <div className="set-sep"/>
                <span className="set-label">Spacing</span>
                <div className="tg-wrap">
                  {(['tight','normal','relaxed'] as LineSpacing[]).map(sp => (
                    <button key={sp} className={`tg${lineSpacing===sp?' on':''}`} onClick={()=>setLineSpacing(sp)} style={{textTransform:'capitalize'}}>{sp}</button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="preview-wrap">
                <div className="preview-hdr">
                  <div>
                    <div className="preview-ttl">Extracted Text Preview</div>
                    <div className="preview-sub">RTF markup stripped — clean text ready for PDF</div>
                  </div>
                  <div className="stats-row">
                    <span className="stat-chip">📝 {s.words.toLocaleString()} words</span>
                    <span className="stat-chip">↵ {s.lines.toLocaleString()} lines</span>
                    <span className="stat-chip">∑ {s.chars.toLocaleString()} chars</span>
                  </div>
                </div>
                <pre className="txt-preview">
                  {extracted.split('\n').slice(0,200).join('\n')}
                  {s.lines > 200 && `\n\n… (${(s.lines-200).toLocaleString()} more lines)`}
                </pre>
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
              <div className="info-icon">📄</div>
              <h3>Full RTF Support</h3>
              <p>Handles RTF from Word, WordPad, LibreOffice and Pages. Unicode, hex-escaped and ASCII characters all decoded correctly.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📐</div>
              <h3>Flexible Layout</h3>
              <p>Choose A4 or Letter, portrait or landscape orientation, font size, and line spacing — all before generating your PDF.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>100% Private</h3>
              <p>RTF parsing and PDF creation both run entirely in your browser using pdf-lib — no file is ever sent to any server.</p>
            </div>
          </div>

        </div>
      </div>

      <input
        ref={fileRef} type="file" accept=".rtf"
        style={{display:'none'}}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value='' }}
      />
    </>
  )
}
