'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// ─── Languages ────────────────────────────────────────────────────────────────
const POPULAR = [
  { code: 'English',             flag: '🇬🇧' },
  { code: 'Spanish',             flag: '🇪🇸' },
  { code: 'French',              flag: '🇫🇷' },
  { code: 'German',              flag: '🇩🇪' },
  { code: 'Portuguese',          flag: '🇵🇹' },
  { code: 'Italian',             flag: '🇮🇹' },
  { code: 'Chinese (Simplified)',flag: '🇨🇳' },
  { code: 'Japanese',            flag: '🇯🇵' },
  { code: 'Korean',              flag: '🇰🇷' },
  { code: 'Arabic',              flag: '🇸🇦' },
  { code: 'Russian',             flag: '🇷🇺' },
  { code: 'Hindi',               flag: '🇮🇳' },
]

const ALL_LANGUAGES = [
  'Afrikaans','Albanian','Amharic','Arabic','Armenian','Azerbaijani',
  'Basque','Belarusian','Bengali','Bosnian','Bulgarian','Catalan',
  'Chinese (Simplified)','Chinese (Traditional)','Croatian','Czech',
  'Danish','Dutch','English','Estonian','Finnish','French',
  'Galician','Georgian','German','Greek','Gujarati','Hausa',
  'Hebrew','Hindi','Hungarian','Icelandic','Indonesian','Irish',
  'Italian','Japanese','Kannada','Kazakh','Khmer','Korean',
  'Kurdish','Latvian','Lithuanian','Macedonian','Malay','Malayalam',
  'Maltese','Marathi','Mongolian','Nepali','Norwegian','Persian',
  'Polish','Portuguese','Punjabi','Romanian','Russian','Serbian',
  'Sinhalese','Slovak','Slovenian','Somali','Spanish','Swahili',
  'Swedish','Tagalog','Tamil','Telugu','Thai','Turkish',
  'Ukrainian','Urdu','Uzbek','Vietnamese','Welsh','Yoruba','Zulu',
]

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

/* Nav */

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#4f46e5}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.38;cursor:not-allowed}

/* Layout */
.workspace{flex:1;display:flex;overflow:hidden}

/* Sidebar */
.sb{width:272px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.sb-sec{padding:14px 16px;border-bottom:1px solid #f0f0f0}
.sb-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}

/* Drop zone */
.drop{border:2px dashed #d0d0d0;border-radius:11px;padding:22px 14px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.drop:hover,.drop.over{border-color:#4f46e5;background:#eef2ff}
.drop-icon{font-size:30px;margin-bottom:7px}
.drop-txt{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.drop-sub{font-size:10px;color:rgba(0,0,0,.35)}
.drop-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:#1d1d1f;border-radius:7px;font-size:11px;font-weight:700;color:#fff;border:none;cursor:pointer;margin-top:9px;transition:background .13s}
.drop-btn:hover{background:#4f46e5}
.file-row{display:flex;align-items:center;gap:9px;padding:9px 11px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:9px}
.file-ic{width:32px;height:32px;background:#4f46e5;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}
.file-info{flex:1;min-width:0}
.file-name{font-size:11px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.file-meta{font-size:9px;color:rgba(0,0,0,.38);margin-top:1px}
.file-rm{width:22px;height:38px;border-radius:5px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;font-size:12px;color:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Language selector */
.lang-sel-wrap{position:relative}
.lang-sel{width:100%;padding:8px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;font-weight:600;color:#1d1d1f;background:#fff;cursor:pointer;outline:none;font-family:inherit;appearance:none;-webkit-appearance:none}
.lang-sel:focus{border-color:#4f46e5}
.lang-sel-arrow{position:absolute;right:9px;top:50%;transform:translateY(-50%);pointer-events:none;font-size:10px;color:rgba(0,0,0,.4)}

/* Popular language grid */
.lang-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.lang-chip{padding:5px 4px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;font-size:10px;font-weight:700;color:rgba(0,0,0,.5);transition:all .13s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px;line-height:1.2}
.lang-chip .flag{font-size:16px}
.lang-chip:hover:not(.sel){border-color:#c7d2fe;color:#4f46e5}
.lang-chip.sel{border-color:#4f46e5;background:#eef2ff;color:#4f46e5}

/* Translate button */
.tr-btn{width:100%;padding:12px;border-radius:9px;border:none;background:linear-gradient(135deg,#4f46e5,#4338ca);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(79,70,229,.35)}
.tr-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,70,229,.45)}
.tr-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}

/* Main area */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* Toolbar */
.toolbar{height:44px;background:#fff;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;padding:0 16px;gap:8px;flex-shrink:0}
.tool-info{font-size:11px;color:rgba(0,0,0,.4);flex:1}
.tool-info strong{color:#1d1d1f}
.tool-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:7px;font-size:11px;font-weight:700;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;color:rgba(0,0,0,.55);transition:all .13s;white-space:nowrap}
.tool-btn:hover{border-color:#4f46e5;color:#4f46e5}
.tool-btn.dl{background:#4f46e5;border-color:#4f46e5;color:#fff}
.tool-btn.dl:hover{background:#4338ca}

/* Output */
.output{flex:1;overflow-y:auto;padding:28px 32px}
.output-text{font-size:14px;line-height:1.85;color:#1d1d1f;white-space:pre-wrap;font-family:Georgia,serif;max-width:720px;margin:0 auto}
.cursor{display:inline-block;width:2px;height:1em;background:#4f46e5;margin-left:2px;animation:blink .9s infinite;vertical-align:text-bottom}

/* Hero */
.hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#eef2ff;border:1px solid rgba(79,70,229,.3);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#4f46e5;margin-bottom:16px;text-transform:uppercase}
.hero-h1{font-size:clamp(22px,4vw,38px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.hero-h1 em{font-style:normal;color:#4f46e5}
.hero-sub{font-size:14px;color:rgba(0,0,0,.42);max-width:400px;line-height:1.7;margin-bottom:24px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:500px}
.feat{padding:14px 10px;border:1px solid #e8e8e8;border-radius:12px;background:#fff}
.feat-icon{font-size:20px;margin-bottom:5px}
.feat-t{font-size:10px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.feat-d{font-size:9px;color:rgba(0,0,0,.38);line-height:1.5}

/* Loading */
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px}
.spin{width:32px;height:32px;border:3px solid #e0e0e0;border-top-color:#4f46e5;border-radius:50%;animation:spin .8s linear infinite}
.load-txt{font-size:13px;font-weight:700;color:#4f46e5;animation:pulse .9s infinite}
.load-sub{font-size:11px;color:rgba(0,0,0,.35)}

/* Error */
.err-bar{padding:10px 14px;background:#fff5f5;border:1px solid rgba(220,38,38,.2);border-radius:8px;font-size:12px;color:#dc2626;margin:14px 16px}

/* Progress bar */
.prog{height:2px;background:#e0e0e0;flex-shrink:0}
.prog-fill{height:100%;background:linear-gradient(90deg,#4f46e5,#818cf8);transition:width .4s ease}
`

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
}

function downloadTxt(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

async function downloadPDF(text: string, filename: string, targetLang: string) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdfDoc = await PDFDocument.create()
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontB  = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const PW = 595.28, PH = 841.89, M = 50, LINE_H = 16, FS = 10
  const UW = PW - M * 2

  // Word-wrap helper
  const wrapLine = (line: string): string[] => {
    const words = line.split(' ')
    const out: string[] = []
    let cur = ''
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (font.widthOfTextAtSize(test, FS) > UW) { if (cur) out.push(cur); cur = w }
      else cur = test
    }
    if (cur) out.push(cur)
    return out.length ? out : ['']
  }

  const lines = text.split('\n').flatMap(l => l.trim() === '' ? [''] : wrapLine(l))

  let page = pdfDoc.addPage([PW, PH])
  let y = PH - M
  let pageNum = 1

  // Title
  page.drawText(`Translation — ${targetLang}`, { x: M, y, font: fontB, size: 13, color: rgb(0.31, 0.27, 0.90) })
  page.drawText(filename, { x: M, y: y - 16, font, size: 8, color: rgb(0.55, 0.55, 0.55) })
  y -= 38

  const addPage = () => {
    page.drawText(`Page ${pageNum}`, { x: PW - M - 30, y: M - 18, font, size: 7.5, color: rgb(0.65, 0.65, 0.65) })
    page = pdfDoc.addPage([PW, PH]); pageNum++; y = PH - M
  }

  for (const line of lines) {
    if (y < M + LINE_H) addPage()
    if (line !== '') page.drawText(line, { x: M, y, font, size: FS, color: rgb(0.08, 0.08, 0.08) })
    y -= line === '' ? LINE_H * 0.6 : LINE_H
  }
  page.drawText(`Page ${pageNum}`, { x: PW - M - 30, y: M - 18, font, size: 7.5, color: rgb(0.65, 0.65, 0.65) })

  const bytes = await pdfDoc.save()
  const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url   = URL.createObjectURL(blob)
  const a     = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PDFTranslatorPage() {
  const [file,       setFile]       = useState<File | null>(null)
  const [pages,      setPages]      = useState(0)
  const [isDrop,     setIsDrop]     = useState(false)
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('Spanish')
  const [output,     setOutput]     = useState('')
  const [streaming,  setStreaming]  = useState(false)
  const [done,       setDone]       = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [error,      setError]      = useState('')
  const fileRef   = useRef<HTMLInputElement>(null)
  const abortRef  = useRef<AbortController | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setOutput(''); setDone(false); setFile(f); setPages(0)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      setPages(doc.numPages)
    } catch { /* page count optional */ }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const translate = async () => {
    if (!file) return
    abortRef.current?.abort()
    const ctrl = new AbortController(); abortRef.current = ctrl
    setStreaming(true); setDone(false); setOutput(''); setError(''); setProgress(5)

    try {
      // Extract text
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      let text = ''
      for (let p = 1; p <= doc.numPages; p++) {
        const pg = await doc.getPage(p)
        const tc = await pg.getTextContent()
        text += (tc.items as any[]).map((i: any) => i.str).join(' ') + '\n'
        setProgress(5 + Math.round((p / doc.numPages) * 30))
      }
      text = text.replace(/\s+/g, ' ').trim()
      if (text.length < 10) { setError('No readable text found. Try PDF OCR first.'); return }

      setProgress(40)

      const res = await fetch('/api/translate-pdf', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text, sourceLang, targetLang, filename: file.name }),
        signal:  ctrl.signal,
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? `Server error ${res.status}`)
      }

      const reader = res.body!.getReader()
      const dec    = new TextDecoder()
      let prog = 40

      while (true) {
        const { done: rDone, value } = await reader.read()
        if (rDone) break
        const chunk = dec.decode(value, { stream: true })
        setOutput(prev => prev + chunk)
        prog = Math.min(96, prog + 0.8)
        setProgress(prog)
        // Auto-scroll
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
      }

      setProgress(100); setDone(true)
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message ?? 'Translation failed.')
    } finally {
      setStreaming(false)
    }
  }

  const stop = () => { abortRef.current?.abort(); setStreaming(false); setDone(true) }

  const reset = () => {
    stop(); setFile(null); setPages(0); setOutput(''); setDone(false); setError(''); setProgress(0)
  }

  const baseName = (f: File | null) => f?.name.replace(/\.pdf$/i, '') ?? 'translation'
  const dlBase   = `${baseName(file)}_${targetLang.replace(/\s+/g, '_')}`

  const copy = () => { if (output) navigator.clipboard.writeText(output) }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        {/* Progress bar */}
        <div className="prog">
          <div className="prog-fill" style={{ width: `${progress}%` }}/>
        </div>

        <div className="workspace">

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="sb">

            {/* File */}
            <div className="sb-sec">
              <div className="sb-ttl">PDF Document</div>
              {!file ? (
                <div className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}>
                  <div className="drop-icon">🌐</div>
                  <div className="drop-txt">Drop PDF here</div>
                  <div className="drop-sub">Any text-based PDF</div>
                  <button className="drop-btn">📄 Choose PDF</button>
                </div>
              ) : (
                <div className="file-row">
                  <div className="file-ic">📄</div>
                  <div className="file-info">
                    <div className="file-name" title={file.name}>{file.name}</div>
                    <div className="file-meta">{fmtBytes(file.size)}{pages ? ` · ${pages}p` : ''}</div>
                  </div>
                  <button className="file-rm" onClick={reset}>×</button>
                </div>
              )}
            </div>

            {/* Source language */}
            <div className="sb-sec">
              <div className="sb-ttl">Source Language</div>
              <div className="lang-sel-wrap">
                <select className="lang-sel" value={sourceLang} onChange={e => setSourceLang(e.target.value)}>
                  <option value="auto">🔍 Auto-detect</option>
                  {ALL_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <span className="lang-sel-arrow">▾</span>
              </div>
            </div>

            {/* Target language */}
            <div className="sb-sec">
              <div className="sb-ttl">Translate To</div>

              {/* Popular quick-pick */}
              <div className="lang-grid" style={{ marginBottom: 10 }}>
                {POPULAR.map(l => (
                  <button key={l.code}
                    className={`lang-chip${targetLang === l.code ? ' sel' : ''}`}
                    onClick={() => setTargetLang(l.code)}>
                    <span className="flag">{l.flag}</span>
                    {l.code.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Full list dropdown */}
              <div className="lang-sel-wrap">
                <select className="lang-sel" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                  {ALL_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <span className="lang-sel-arrow">▾</span>
              </div>
            </div>

            {/* Translate button */}
            <div className="sb-sec">
              {streaming ? (
                <button className="tr-btn" onClick={stop} style={{ background: '#dc2626' }}>
                  ⏹ Stop
                </button>
              ) : (
                <button className="tr-btn" onClick={translate}
                  disabled={!file || streaming}>
                  🌐 Translate to {targetLang}
                </button>
              )}
            </div>

            {/* Info note */}
            <div style={{ padding: '12px 16px', fontSize: 10, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
              Up to 50 000 characters (~35 pages) translated per run. For longer documents, split with PDF Splitter first.
            </div>

          </aside>

          {/* ── Main area ────────────────────────────────────────────── */}
          <main className="main">

            {/* Toolbar — shown when there's output */}
            {output && (
              <div className="toolbar">
                <div className="tool-info">
                  {done
                    ? <><strong>{file?.name}</strong> → <strong>{targetLang}</strong> · {output.length.toLocaleString()} chars</>
                    : <span style={{ color: '#4f46e5' }}>Translating to {targetLang}…</span>}
                </div>
                <button className="tool-btn" onClick={copy}>📋 Copy</button>
                <button className="tool-btn" onClick={() => downloadTxt(output, `${dlBase}.txt`)}>⬇ TXT</button>
                <button className="tool-btn dl" onClick={() => downloadPDF(output, `${dlBase}.pdf`, targetLang)}
                  disabled={!done}>
                  ⬇ PDF
                </button>
              </div>
            )}

            {/* States */}
            {!file && !streaming && !output && (
              <div className="hero">
                <div className="hero-badge">🌐 AI Translation</div>
                <h1 className="hero-h1">Translate any <em>PDF</em><br/>into 80+ languages</h1>
                <p className="hero-sub">Upload a PDF, pick your target language, and get a clean streaming translation powered by Claude.</p>
                <div className="feat-grid">
                  <div className="feat"><div className="feat-icon">🌍</div><div className="feat-t">80+ Languages</div><div className="feat-d">From Arabic to Zulu</div></div>
                  <div className="feat"><div className="feat-icon">⚡</div><div className="feat-t">Streaming Output</div><div className="feat-d">See results as they arrive</div></div>
                  <div className="feat"><div className="feat-icon">📄</div><div className="feat-t">Download PDF / TXT</div><div className="feat-d">Save translated document</div></div>
                </div>
              </div>
            )}

            {file && !streaming && !output && (
              <div className="hero">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌐</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', marginBottom: 6 }}>Ready to translate</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,.4)', marginBottom: 20 }}>
                  {file.name} → <strong>{targetLang}</strong>
                </div>
                <button className="tr-btn" style={{ maxWidth: 220 }} onClick={translate}>
                  🌐 Start Translation
                </button>
              </div>
            )}

            {error && <div className="err-bar">⚠ {error}</div>}

            {streaming && !output && (
              <div className="loading">
                <div className="spin"/>
                <div className="load-txt">Extracting &amp; translating…</div>
                <div className="load-sub">This may take 15–30 seconds</div>
              </div>
            )}

            {output && (
              <div className="output" ref={outputRef}>
                <div className="output-text">
                  {output}
                  {streaming && <span className="cursor"/>}
                </div>
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
