'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

/* Nav */
.nav{height:52px;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0;z-index:100}
.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#2b579a}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.38;cursor:not-allowed}

/* Progress bar */
.prog{height:2px;background:#e0e0e0;flex-shrink:0}
.prog-fill{height:100%;background:linear-gradient(90deg,#2b579a,#41a0e8);transition:width .4s ease}

/* Layout */
.workspace{flex:1;display:flex;overflow:hidden}

/* Sidebar */
.sb{width:268px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.sb-sec{padding:14px 16px;border-bottom:1px solid #f0f0f0}
.sb-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}

/* Drop zone */
.drop{border:2px dashed #d0d0d0;border-radius:11px;padding:26px 14px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.drop:hover,.drop.over{border-color:#2b579a;background:#eef3fb}
.drop-icon{font-size:32px;margin-bottom:8px}
.drop-txt{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.drop-sub{font-size:10px;color:rgba(0,0,0,.35)}
.drop-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:#1d1d1f;border-radius:7px;font-size:11px;font-weight:700;color:#fff;border:none;cursor:pointer;margin-top:9px;transition:background .13s}
.drop-btn:hover{background:#2b579a}

/* File row */
.file-row{display:flex;align-items:center;gap:9px;padding:9px 11px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:9px}
.file-ic{width:32px;height:32px;background:#2b579a;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}
.file-info{flex:1;min-width:0}
.file-name{font-size:11px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.file-meta{font-size:9px;color:rgba(0,0,0,.38);margin-top:1px}
.file-rm{width:22px;height:22px;border-radius:5px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;font-size:12px;color:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Format options */
.fmt-list{display:flex;flex-direction:column;gap:5px}
.fmt-opt{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;transition:all .14s}
.fmt-opt:hover{border-color:#2b579a}
.fmt-opt.sel{border-color:#2b579a;background:#eef3fb}
.fmt-icon{font-size:18px;flex-shrink:0}
.fmt-info{flex:1;min-width:0}
.fmt-name{font-size:11px;font-weight:700;color:#1d1d1f}
.fmt-desc{font-size:9px;color:rgba(0,0,0,.38);margin-top:1px}
.fmt-ext{font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:#e8f0fb;color:#2b579a;flex-shrink:0}
.fmt-opt.sel .fmt-ext{background:#2b579a;color:#fff}

/* Convert button */
.conv-btn{width:100%;padding:12px;border-radius:9px;border:none;background:linear-gradient(135deg,#2b579a,#1e3f73);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(43,87,154,.35);letter-spacing:-.01em}
.conv-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(43,87,154,.45)}
.conv-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}

/* Main area */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* Toolbar */
.toolbar{height:46px;background:#fff;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;padding:0 16px;gap:8px;flex-shrink:0}
.tool-info{font-size:11px;color:rgba(0,0,0,.4);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tool-info strong{color:#1d1d1f}
.tool-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:7px;font-size:11px;font-weight:700;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;color:rgba(0,0,0,.55);transition:all .13s;white-space:nowrap}
.tool-btn:hover:not(:disabled){border-color:#2b579a;color:#2b579a}
.tool-btn:disabled{opacity:.4;cursor:not-allowed}
.tool-btn.dl{background:#2b579a;border-color:#2b579a;color:#fff}
.tool-btn.dl:hover:not(:disabled){background:#1e3f73}

/* Output area */
.output-wrap{flex:1;overflow-y:auto;padding:32px;background:#f0f2f5}

/* Word document preview */
.doc-page{background:#fff;max-width:760px;margin:0 auto;padding:60px 72px;box-shadow:0 2px 32px rgba(0,0,0,.10);border-radius:2px;min-height:600px;animation:fadeup .3s ease}
.doc-page h1{font-size:22px;font-weight:700;color:#1d1d1f;margin-bottom:14px;line-height:1.3;font-family:Calibri,Georgia,serif}
.doc-page h2{font-size:16px;font-weight:700;color:#2b579a;margin:20px 0 8px;line-height:1.3;font-family:Calibri,Georgia,serif}
.doc-page h3{font-size:13px;font-weight:700;color:#1d1d1f;margin:16px 0 6px;line-height:1.3}
.doc-page p{font-size:11.5px;line-height:1.8;color:#1d1d1f;margin-bottom:10px;font-family:Calibri,Georgia,serif}
.doc-page ul,.doc-page ol{padding-left:22px;margin-bottom:10px}
.doc-page li{font-size:11.5px;line-height:1.7;color:#1d1d1f;margin-bottom:3px;font-family:Calibri,Georgia,serif}
.doc-page table{width:100%;border-collapse:collapse;margin:12px 0 16px;font-size:11px}
.doc-page th{background:#2b579a;color:#fff;padding:7px 10px;text-align:left;font-weight:700}
.doc-page td{padding:6px 10px;border:1px solid #d0d0d0;color:#1d1d1f;vertical-align:top}
.doc-page tr:nth-child(even) td{background:#f5f7fb}
.doc-page strong{font-weight:700}
.doc-page em{font-style:italic}

/* Loading */
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px;padding:40px}
.spin-lg{width:36px;height:36px;border:3px solid #e0e0e0;border-top-color:#2b579a;border-radius:50%;animation:spin .8s linear infinite}
.load-step{font-size:13px;font-weight:700;color:#2b579a;animation:pulse .9s infinite}
.load-sub{font-size:11px;color:rgba(0,0,0,.35)}

/* Hero */
.hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#eef3fb;border:1px solid rgba(43,87,154,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#2b579a;margin-bottom:16px;text-transform:uppercase}
.hero-h1{font-size:clamp(22px,4vw,38px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.hero-h1 em{font-style:normal;color:#2b579a}
.hero-sub{font-size:14px;color:rgba(0,0,0,.42);max-width:400px;line-height:1.7;margin-bottom:28px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:480px}
.feat{padding:14px 10px;border:1px solid #e8e8e8;border-radius:12px;background:#fff}
.feat-icon{font-size:20px;margin-bottom:5px}
.feat-t{font-size:10px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.feat-d{font-size:9px;color:rgba(0,0,0,.38);line-height:1.5}

.err-bar{margin:14px 16px;padding:10px 14px;background:#fff5f5;border:1px solid rgba(220,38,38,.2);border-radius:8px;font-size:12px;color:#dc2626}
.spin-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
`

// ─── Download format options ──────────────────────────────────────────────────
type DlFormat = 'doc' | 'txt' | 'html'

const FORMATS: { id: DlFormat; icon: string; name: string; desc: string; ext: string }[] = [
  { id: 'doc',  icon: '📘', name: 'Word Document', desc: 'Open in Microsoft Word',    ext: '.doc'  },
  { id: 'txt',  icon: '📄', name: 'Plain Text',    desc: 'Universal text format',     ext: '.txt'  },
  { id: 'html', icon: '🌐', name: 'HTML File',     desc: 'Open in any browser',       ext: '.html' },
]

// ─── Word HTML template ───────────────────────────────────────────────────────
function buildWordDoc(html: string, title: string): string {
  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'/>
<meta name=ProgId content=Word.Document>
<title>${title}</title>
<style>
  @page { margin: 1in; }
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #000; }
  h1 { font-size: 18pt; font-weight: bold; color: #1a1a1a; margin-bottom: 10pt; }
  h2 { font-size: 14pt; font-weight: bold; color: #2b579a; margin-top: 16pt; margin-bottom: 6pt; }
  h3 { font-size: 12pt; font-weight: bold; color: #1a1a1a; margin-top: 12pt; margin-bottom: 4pt; }
  p { margin: 6pt 0; }
  ul, ol { margin: 6pt 0; padding-left: 20pt; }
  li { margin-bottom: 3pt; }
  table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
  th { background: #2b579a; color: white; padding: 6pt 8pt; text-align: left; font-weight: bold; }
  td { border: 1pt solid #ccc; padding: 5pt 8pt; vertical-align: top; }
  tr:nth-child(even) td { background: #f0f4fb; }
</style>
</head>
<body>
${html}
</body>
</html>`
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function triggerDL(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PDFToWordPage() {
  const [file,      setFile]      = useState<File | null>(null)
  const [pages,     setPages]     = useState(0)
  const [isDrop,    setIsDrop]    = useState(false)
  const [format,    setFormat]    = useState<DlFormat>('doc')
  const [html,      setHtml]      = useState('')
  const [step,      setStep]      = useState('')
  const [converting,setConverting]= useState(false)
  const [done,      setDone]      = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [error,     setError]     = useState('')
  const fileRef  = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setHtml(''); setDone(false); setFile(f); setPages(0); setProgress(0)
    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await lib.getDocument({ data: buf }).promise
      setPages(doc.numPages)
    } catch { /* page count is optional */ }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const convert = async () => {
    if (!file) return
    abortRef.current?.abort()
    const ctrl = new AbortController(); abortRef.current = ctrl
    setConverting(true); setDone(false); setHtml(''); setError(''); setProgress(5)

    try {
      setStep('Extracting text from PDF…')
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const doc = await lib.getDocument({ data: buf }).promise
      let text = ''
      for (let p = 1; p <= doc.numPages; p++) {
        const pg = await doc.getPage(p)
        const tc = await pg.getTextContent()
        text += (tc.items as any[]).map((i: any) => i.str).join(' ') + '\n'
        setProgress(5 + Math.round((p / doc.numPages) * 30))
      }
      text = text.replace(/\s+/g, ' ').trim()
      if (text.length < 10) { setError('No readable text found. Try PDF OCR first.'); return }

      setStep('AI is restructuring the document…'); setProgress(40)

      const res = await fetch('/api/pdf-to-word', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text, filename: file.name }),
        signal:  ctrl.signal,
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? `Server error ${res.status}`)
      }

      setStep('Building document…')
      const reader = res.body!.getReader()
      const dec    = new TextDecoder()
      let prog = 40
      let acc  = ''

      while (true) {
        const { done: rd, value } = await reader.read()
        if (rd) break
        acc += dec.decode(value, { stream: true })
        setHtml(acc)
        prog = Math.min(96, prog + 0.6)
        setProgress(prog)
      }

      setProgress(100); setDone(true); setStep('')
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message ?? 'Conversion failed.')
    } finally {
      setConverting(false)
    }
  }

  const reset = () => {
    abortRef.current?.abort()
    setFile(null); setPages(0); setHtml(''); setDone(false)
    setError(''); setProgress(0); setStep(''); setConverting(false)
  }

  const download = () => {
    if (!html || !file) return
    const base = file.name.replace(/\.pdf$/i, '')
    if (format === 'doc')  triggerDL(buildWordDoc(html, base), 'application/msword',  `${base}.doc`)
    if (format === 'html') triggerDL(buildWordDoc(html, base), 'text/html',           `${base}.html`)
    if (format === 'txt')  triggerDL(stripHtml(html),          'text/plain',           `${base}.txt`)
  }

  const hasOutput = !!html

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/>
                <polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/>
              </svg>
            </div>
            <span className="logo-name">Edit<em>PDF</em> AI</span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">PDF to Word</span>
          <div className="nav-sp"/>
          {(converting || done) && (
            <button className="nbtn sec" onClick={reset}>← New</button>
          )}
        </nav>

        {/* Progress bar */}
        <div className="prog">
          <div className="prog-fill" style={{ width: `${progress}%` }}/>
        </div>

        <div className="workspace">

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="sb">

            {/* File */}
            <div className="sb-sec">
              <div className="sb-ttl">PDF File</div>
              {!file ? (
                <div className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}>
                  <div className="drop-icon">📘</div>
                  <div className="drop-txt">Drop PDF here</div>
                  <div className="drop-sub">Text-based PDFs work best</div>
                  <button className="drop-btn">📄 Choose PDF</button>
                </div>
              ) : (
                <div className="file-row">
                  <div className="file-ic">📄</div>
                  <div className="file-info">
                    <div className="file-name" title={file.name}>{file.name}</div>
                    <div className="file-meta">{fmtBytes(file.size)}{pages ? ` · ${pages} pages` : ''}</div>
                  </div>
                  <button className="file-rm" onClick={reset}>×</button>
                </div>
              )}
            </div>

            {/* Download format */}
            <div className="sb-sec">
              <div className="sb-ttl">Output Format</div>
              <div className="fmt-list">
                {FORMATS.map(f => (
                  <div key={f.id} className={`fmt-opt${format === f.id ? ' sel' : ''}`}
                    onClick={() => setFormat(f.id)}>
                    <span className="fmt-icon">{f.icon}</span>
                    <div className="fmt-info">
                      <div className="fmt-name">{f.name}</div>
                      <div className="fmt-desc">{f.desc}</div>
                    </div>
                    <span className="fmt-ext">{f.ext}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Convert button */}
            <div className="sb-sec">
              <button className="conv-btn" onClick={convert} disabled={!file || converting}>
                {converting
                  ? <><div className="spin-sm" style={{ margin: '0 6px 0 0' }}/>{step || 'Converting…'}</>
                  : '📘 Convert to Word'}
              </button>
            </div>

            <div style={{ padding: '12px 16px', fontSize: 10, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
              Up to 60 000 characters (~40 pages) per conversion. AI reconstructs headings, paragraphs, tables, and lists automatically.
            </div>
          </aside>

          {/* ── Main area ────────────────────────────────────────────── */}
          <main className="main">

            {/* Toolbar */}
            {hasOutput && (
              <div className="toolbar">
                <div className="tool-info">
                  {done
                    ? <><strong>{file?.name}</strong> converted · {html.length.toLocaleString()} chars</>
                    : <span style={{ color: '#2b579a' }}>{step || 'Processing…'}</span>}
                </div>
                <button className="tool-btn dl" onClick={download} disabled={!done}>
                  ⬇ Download {FORMATS.find(f => f.id === format)?.ext.toUpperCase()}
                </button>
              </div>
            )}

            {/* Hero */}
            {!file && !hasOutput && (
              <div className="hero">
                <div className="hero-badge">📘 AI-Powered</div>
                <h1 className="hero-h1">PDF to <em>Word</em></h1>
                <p className="hero-sub">Claude reads your PDF and rebuilds it as a properly structured Word document — with headings, lists, and tables intact.</p>
                <div className="feat-grid">
                  <div className="feat"><div className="feat-icon">🏗️</div><div className="feat-t">Structure Preserved</div><div className="feat-d">Headings, paragraphs & lists</div></div>
                  <div className="feat"><div className="feat-icon">📊</div><div className="feat-t">Tables Rebuilt</div><div className="feat-d">Data extracted & formatted</div></div>
                  <div className="feat"><div className="feat-icon">💾</div><div className="feat-t">3 Formats</div><div className="feat-d">Word, Plain Text or HTML</div></div>
                </div>
              </div>
            )}

            {/* Ready state */}
            {file && !converting && !hasOutput && (
              <div className="hero">
                <div style={{ fontSize: 52, marginBottom: 12 }}>📘</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', marginBottom: 6 }}>Ready to convert</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,.4)', marginBottom: 24 }}>{file.name}{pages ? ` · ${pages} pages` : ''}</div>
                <button className="conv-btn" style={{ maxWidth: 220 }} onClick={convert}>
                  📘 Convert to Word
                </button>
              </div>
            )}

            {/* Loading (before first chunk arrives) */}
            {converting && !hasOutput && (
              <div className="loading">
                <div className="spin-lg"/>
                <div className="load-step">{step || 'Converting…'}</div>
                <div className="load-sub">AI is reading and restructuring your document</div>
              </div>
            )}

            {error && <div className="err-bar">⚠ {error}</div>}

            {/* Document preview */}
            {hasOutput && (
              <div className="output-wrap">
                <div className="doc-page"
                  dangerouslySetInnerHTML={{ __html: html }}/>
              </div>
            )}

          </main>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = '' }}/>
    </>
  )
}
