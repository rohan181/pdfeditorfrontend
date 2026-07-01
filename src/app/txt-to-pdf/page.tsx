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
.logo-name em{font-style:normal;color:#6366f1}
.nav-sep{font-size:13px;color:rgba(0,0,0,.18);font-weight:300}
.nav-tool{font-size:13px;font-weight:600;color:#1d1d1f;letter-spacing:-.01em}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.4);text-decoration:none;padding:6px 13px;border-radius:8px;border:1px solid rgba(0,0,0,.1);transition:all .15s;letter-spacing:-.01em}
.back:hover{color:#1d1d1f;border-color:rgba(0,0,0,.25);background:#fff}

/* ── Layout ── */
.wrap{max-width:860px;margin:0 auto;padding:48px 20px 96px}

/* ── Hero ── */
.hero{text-align:center;margin-bottom:40px;animation:fadeup .35s ease}
.badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:#eef2ff;border:1px solid rgba(99,102,241,.18);border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#6366f1;text-transform:uppercase;margin-bottom:16px}
.badge-dot{width:5px;height:5px;border-radius:50%;background:#6366f1;animation:pulse 2s ease infinite}
.hero h1{font-size:clamp(28px,5vw,46px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;line-height:1.05;margin-bottom:12px}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,#6366f1,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:15px;color:rgba(0,0,0,.42);line-height:1.65;max-width:460px;margin:0 auto}

/* ── Card ── */
.card{background:#fff;border:1px solid #e5e5e7;border-radius:18px;padding:28px;margin-bottom:14px;box-shadow:0 1px 12px rgba(0,0,0,.05)}

/* ── Mode tabs ── */
.mode-tabs{display:flex;background:#f0f0f2;border-radius:12px;padding:4px;margin-bottom:24px;gap:3px}
.mode-tab{flex:1;padding:9px;border:none;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:rgba(0,0,0,.4);transition:all .15s;letter-spacing:-.01em;display:flex;align-items:center;justify-content:center;gap:6px}
.mode-tab.on{background:#fff;color:#1d1d1f;box-shadow:0 1px 5px rgba(0,0,0,.12)}

/* ── Drop zone ── */
.drop{border:2px dashed #d2d2d7;border-radius:14px;padding:52px 28px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;position:relative;overflow:hidden}
.drop::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#eef2ff 0%,#fff 100%);opacity:0;transition:opacity .2s}
.drop:hover,.drop.over{border-color:#6366f1;background:#f8f8ff}
.drop:hover::before,.drop.over::before{opacity:1}
.drop-inner{position:relative;z-index:1}
.drop-icon-wrap{width:72px;height:72px;background:linear-gradient(135deg,#6366f1,#818cf8);border-radius:20px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(99,102,241,.28);transition:transform .2s}
.drop:hover .drop-icon-wrap,.drop.over .drop-icon-wrap{transform:scale(1.06)}
.drop h2{font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:8px;letter-spacing:-.02em}
.drop p{font-size:13px;color:rgba(0,0,0,.38);margin-bottom:20px;line-height:1.6;max-width:360px;margin-left:auto;margin-right:auto}
.type-chips{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;margin-bottom:20px}
.type-chip{padding:3px 9px;background:#eef2ff;border:1px solid rgba(99,102,241,.15);border-radius:7px;font-size:10px;font-weight:700;color:#6366f1;letter-spacing:.04em}
.browse-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:#1d1d1f;border-radius:10px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:all .16s;letter-spacing:-.01em}
.browse-btn:hover{background:#6366f1;transform:translateY(-1px);box-shadow:0 4px 16px rgba(99,102,241,.35)}

/* ── Paste area ── */
.paste-wrap{display:flex;flex-direction:column;gap:10px}
.paste-label{font-size:12px;font-weight:600;color:rgba(0,0,0,.4);letter-spacing:-.01em}
.paste-area{width:100%;min-height:220px;padding:16px;border:1.5px solid #e5e5e7;border-radius:12px;font-size:13px;font-family:ui-monospace,'SF Mono',Menlo,monospace;line-height:1.65;color:#1d1d1f;background:#fff;resize:vertical;outline:none;transition:border .15s;letter-spacing:.01em}
.paste-area:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.paste-area::placeholder{color:rgba(0,0,0,.25)}

/* ── File row ── */
.file-row{display:flex;align-items:center;gap:14px;padding:14px 16px;background:#f5f5f7;border:1px solid #e5e5e7;border-radius:12px;margin-bottom:14px;animation:fadeup .2s ease}
.file-icon-box{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(99,102,241,.25)}
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
.set-sep{width:1px;height:22px;background:#e0e0e0;flex-shrink:0}

/* ── Preview ── */
.preview-wrap{background:#fff;border:1px solid #e5e5e7;border-radius:18px;overflow:hidden;margin-bottom:14px;box-shadow:0 1px 12px rgba(0,0,0,.05);animation:fadeup .25s ease}
.preview-hdr{padding:16px 22px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fafafa}
.preview-ttl{font-size:13px;font-weight:700;color:#1d1d1f;letter-spacing:-.01em}
.preview-sub{font-size:11px;color:rgba(0,0,0,.35);margin-top:2px}
.stats-row{display:flex;gap:6px;flex-wrap:wrap}
.stat-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#eef2ff;border-radius:99px;font-size:10px;font-weight:700;color:#6366f1;letter-spacing:.02em}

.txt-preview{padding:20px 28px;max-height:420px;overflow-y:auto;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:12.5px;line-height:1.72;color:#374151;background:#fafafa;white-space:pre-wrap;word-break:break-all;border-top:1px solid #f0f0f0}

/* ── Edit panel (paste mode, after text entered) ── */
.edit-panel{background:#fff;border:1px solid #e5e5e7;border-radius:18px;overflow:hidden;margin-bottom:14px}
.edit-hdr{padding:12px 18px;background:#fafafa;border-bottom:1px solid #f0f0f0;font-size:12px;font-weight:600;color:rgba(0,0,0,.45);letter-spacing:-.01em}
.edit-panel .paste-area{border:none;border-radius:0;min-height:160px;padding:18px 22px}
.edit-panel .paste-area:focus{box-shadow:none;border:none}

/* ── Actions ── */
.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.sec-btn{flex:1;min-width:140px;padding:13px 18px;background:#fff;border:1.5px solid #e0e0e0;border-radius:11px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;letter-spacing:-.01em}
.sec-btn:hover{border-color:#6366f1;color:#6366f1}
.pri-btn{flex:2;min-width:200px;padding:13px 22px;background:linear-gradient(135deg,#6366f1,#4f46e5);border:none;border-radius:11px;font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(99,102,241,.35);letter-spacing:-.01em}
.pri-btn:hover:not(:disabled){background:linear-gradient(135deg,#4f46e5,#4338ca);transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
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

// ─── PDF builder ─────────────────────────────────────────────────────────────
type PageSize    = 'A4' | 'Letter'
type Orientation = 'Portrait' | 'Landscape'
type FontFamily  = 'sans' | 'mono'
type LineSpacing = 'tight' | 'normal' | 'relaxed'

const SPACING_MAP: Record<LineSpacing, number> = { tight: 1.3, normal: 1.55, relaxed: 1.85 }

async function buildPDF(
  text: string,
  pageSize: PageSize,
  orientation: Orientation,
  fontFamily: FontFamily,
  fontSize: number,
  lineSpacing: LineSpacing,
  filename: string,
): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

  const pdfDoc = await PDFDocument.create()
  const font   = await pdfDoc.embedFont(
    fontFamily === 'mono' ? StandardFonts.Courier : StandardFonts.Helvetica
  )

  let [PW, PH] = pageSize === 'A4' ? [595.28, 841.89] : [612, 792]
  if (orientation === 'Landscape') [PW, PH] = [PH, PW]

  const ML = 68, MR = 68, MT = 68, MB = 56
  const TW = PW - ML - MR

  const DARK   = rgb(0.08, 0.08, 0.08)
  const GRAY   = rgb(0.50, 0.50, 0.50)
  const LGRAY  = rgb(0.87, 0.87, 0.87)
  const ACCENT = rgb(0.388, 0.400, 0.945)

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
    const words = line.split(' ')
    const out: string[] = []
    let cur = ''
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (font.widthOfTextAtSize(test, fontSize) > TW && cur) { out.push(cur); cur = w }
      else cur = test
    }
    if (cur) out.push(cur)
    return out.length ? out : ['']
  }

  newPage()

  // Filename header on first page
  if (filename) {
    page.drawText(filename, { x:ML, y:y-fontSize, font, size:8.5, color:ACCENT })
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
function stats(text: string) {
  const lines = text.split('\n').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  return { lines, words, chars: text.length }
}
function triggerDownload(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type:'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href=url; a.download=name; a.click()
  URL.revokeObjectURL(url)
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const TxtIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white" fillOpacity=".9"/>
    <polyline points="14 2 14 8 20 8" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" fill="none"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke="rgba(255,255,255,.75)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="16" x2="14" y2="16" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const PasteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

// ─── Component ───────────────────────────────────────────────────────────────
export default function TxtToPDFPage() {
  const [mode,        setMode]        = useState<'upload'|'paste'>('upload')
  const [text,        setText]        = useState('')
  const [filename,    setFilename]    = useState('')
  const [fileSize,    setFileSize]    = useState(0)
  const [pageSize,    setPageSize]    = useState<PageSize>('A4')
  const [orientation, setOrientation] = useState<Orientation>('Portrait')
  const [fontFamily,  setFontFamily]  = useState<FontFamily>('sans')
  const [fontSize,    setFontSize]    = useState(11)
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>('normal')
  const [isDrop,      setIsDrop]      = useState(false)
  const [converting,  setConverting]  = useState(false)
  const [error,       setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const readFile = useCallback(async (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    const allowed = ['txt','text','md','markdown','csv','log','json','xml','yaml','yml','ini','cfg','sh','py','js','ts','sql','toml']
    if (!allowed.includes(ext)) {
      setError('Please upload a plain text file (.txt, .md, .csv, .log, .json, etc.)'); return
    }
    setError('')
    try {
      const content = await f.text()
      setText(content); setFilename(f.name); setFileSize(f.size)
      if (['json','xml','yaml','yml','ini','sh','py','js','ts','sql'].includes(ext)) setFontFamily('mono')
    } catch {
      setError('Could not read the file.')
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) readFile(f)
  }, [readFile])

  const convert = async () => {
    const content = text.trim()
    if (!content) { setError('Please enter or upload some text first.'); return }
    setConverting(true); setError('')
    try {
      const bytes = await buildPDF(content, pageSize, orientation, fontFamily, fontSize, lineSpacing, filename)
      const name  = filename ? filename.replace(/\.[^.]+$/, '') + '.pdf' : 'document.pdf'
      triggerDownload(bytes, name)
    } catch (e: any) {
      setError(e?.message ?? 'PDF generation failed.')
    } finally {
      setConverting(false)
    }
  }

  const reset = () => {
    setText(''); setFilename(''); setFileSize(0); setError('')
    if (mode === 'upload') fileRef.current && (fileRef.current.value = '')
  }

  const s       = stats(text)
  const hasText = text.trim().length > 0

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
            <h1>TXT to <em>PDF</em></h1>
            <p>Convert any plain text file to a clean paginated PDF — or paste text directly. Supports .txt, .md, .csv, .log, .json and more.</p>
          </div>

          {/* Input card */}
          <div className="card">
            {error && (
              <div className="err"><span>⚠</span><span>{error}</span></div>
            )}

            {/* Mode tabs */}
            <div className="mode-tabs">
              <button
                className={`mode-tab${mode==='upload'?' on':''}`}
                onClick={() => { setMode('upload'); reset() }}
              >
                <UploadIcon/> Upload File
              </button>
              <button
                className={`mode-tab${mode==='paste'?' on':''}`}
                onClick={() => { setMode('paste'); reset() }}
              >
                <PasteIcon/> Paste Text
              </button>
            </div>

            {mode === 'upload' ? (
              /* ── Upload mode ── */
              hasText ? (
                <div className="file-row" style={{marginBottom:0}}>
                  <div className="file-icon-box"><TxtIcon/></div>
                  <div className="file-info">
                    <div className="file-name">{filename}</div>
                    <div className="file-size">{fmt(fileSize)} · {s.lines.toLocaleString()} lines</div>
                  </div>
                  <button className="rm-btn" onClick={reset} title="Remove">×</button>
                </div>
              ) : (
                <div
                  className={`drop${isDrop?' over':''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}
                >
                  <div className="drop-inner">
                    <div className="drop-icon-wrap"><TxtIcon/></div>
                    <h2>Drop a text file here</h2>
                    <div className="type-chips">
                      {['TXT','MD','CSV','LOG','JSON','YAML','XML','SH','PY'].map(t => (
                        <span key={t} className="type-chip">{t}</span>
                      ))}
                    </div>
                    <p>Any plain-text format — notes, code, logs, markdown, data files</p>
                    <button className="browse-btn"><UploadIcon/> Choose File</button>
                  </div>
                </div>
              )
            ) : (
              /* ── Paste mode ── */
              <div className="paste-wrap">
                <div className="paste-label">Paste or type your text below</div>
                <textarea
                  className="paste-area"
                  placeholder="Start typing or paste text here…"
                  value={text}
                  onChange={e => { setText(e.target.value); setFilename(''); setFileSize(0) }}
                />
              </div>
            )}
          </div>

          {hasText && (
            <>
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
                <span className="set-label">Font</span>
                <div className="tg-wrap">
                  <button className={`tg${fontFamily==='sans'?' on':''}`} onClick={()=>setFontFamily('sans')}>Sans</button>
                  <button className={`tg${fontFamily==='mono'?' on':''}`} onClick={()=>setFontFamily('mono')}>Mono</button>
                </div>
                <div className="set-sep"/>
                <span className="set-label">Size</span>
                <div className="tg-wrap">
                  {([9,10,11,12] as const).map(n => (
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
                    <div className="preview-ttl">Text Preview</div>
                    <div className="preview-sub">First 200 lines shown</div>
                  </div>
                  <div className="stats-row">
                    <span className="stat-chip">📝 {s.words.toLocaleString()} words</span>
                    <span className="stat-chip">↵ {s.lines.toLocaleString()} lines</span>
                    <span className="stat-chip">∑ {s.chars.toLocaleString()} chars</span>
                  </div>
                </div>
                <pre className="txt-preview">
                  {text.split('\n').slice(0,200).join('\n')}
                  {s.lines > 200 && `\n\n… (${(s.lines-200).toLocaleString()} more lines)`}
                </pre>
              </div>

              {/* Inline edit for paste mode */}
              {mode === 'paste' && (
                <div className="edit-panel">
                  <div className="edit-hdr">Edit text</div>
                  <textarea
                    className="paste-area"
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="action-row">
                <button className="sec-btn" onClick={reset}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  {mode === 'upload' ? 'New File' : 'Clear'}
                </button>
                <button className="pri-btn" onClick={convert} disabled={converting}>
                  {converting
                    ? <><div className="spin"/> Generating PDF…</>
                    : <><DownloadIcon/> Download PDF</>
                  }
                </button>
              </div>
            </>
          )}

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📃</div>
              <h3>Any Text Format</h3>
              <p>Accepts .txt, .md, .csv, .log, .json, .yaml, .sh, .py and more — or just paste text directly, no file needed.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📐</div>
              <h3>Flexible Layout</h3>
              <p>Choose A4 or Letter, portrait or landscape, sans or mono font, font size, and line spacing to fit your content.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>100% Private</h3>
              <p>Your text never leaves your browser. The PDF is generated entirely on your device using pdf-lib — zero server contact.</p>
            </div>
          </div>

        </div>
      </div>

      <input
        ref={fileRef} type="file"
        accept=".txt,.text,.md,.markdown,.csv,.log,.json,.xml,.yaml,.yml,.ini,.cfg,.sh,.py,.js,.ts,.sql,.toml"
        style={{display:'none'}}
        onChange={e => { if (e.target.files?.[0]) readFile(e.target.files[0]); e.target.value='' }}
      />
    </>
  )
}
