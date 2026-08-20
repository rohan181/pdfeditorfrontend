'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import ToolQuickFacts from '@/components/ToolQuickFacts'
import toolSeoData from '@/lib/toolSeoData'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.pg{min-height:100vh;background:#fff;overflow-x:hidden;padding-top:56px;}
.wrap{max-width:900px;margin:0 auto;padding:0 28px}


.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%}
.logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#E24B4A}
.back{font-size:13px;font-weight:500;color:rgba(0,0,0,.5);text-decoration:none;padding:5px 14px;border-radius:99px;transition:color .15s}
.back:hover{color:#1d1d1f}

.hero{padding:64px 0 36px;text-align:center;border-bottom:1px solid #f0f0f0}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fff5f5;border:1px solid rgba(180,35,60,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#b4233c;margin-bottom:18px;text-transform:uppercase}
.bdot{width:5px;height:5px;border-radius:50%;background:#E24B4A}
.hero h1{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:clamp(30px,5vw,54px);font-weight:800;letter-spacing:-.05em;line-height:.97;color:#1d1d1f;margin-bottom:14px}
.hero h1 em{font-style:normal;color:#E24B4A}
.hero p{font-size:15px;color:#4b5563;line-height:1.7;max-width:420px;margin:0 auto}

.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:32px;margin:32px 0 16px;box-shadow:0 2px 20px rgba(0,0,0,.04)}
@media(max-width:600px){.card{padding:18px}}

/* upload */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#E24B4A;background:#fff5f5}
.drop-icon{font-size:44px;margin-bottom:12px;display:block}
.drop h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:19px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:18px;line-height:1.5}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#E24B4A}

/* file row */
.file-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:24px}
.file-icon{width:36px;height:36px;background:#E24B4A;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-size{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.file-rm{width:26px;height:38px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:12px;transition:all .15s}
.file-rm:hover{border-color:#E24B4A;color:#E24B4A}

/* levels */
.level-label{font-size:10px;font-weight:600;letter-spacing:.08em;color:rgba(0,0,0,.4);text-transform:uppercase;margin-bottom:10px}
.levels{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:24px}
@media(max-width:560px){.levels{grid-template-columns:repeat(2,1fr)}}
.level{border:1.5px solid #e0e0e0;border-radius:10px;padding:12px 10px;cursor:pointer;transition:all .15s;background:#fff;text-align:center}
.level:hover{border-color:#bbb;background:#fafafa}
.level.active{border-color:#1d1d1f;background:#f5f5f7}
.level-name{font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.level-desc{font-size:10px;color:rgba(0,0,0,.4);line-height:1.4}
.level-tag{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.06em;padding:2px 6px;border-radius:4px;margin-top:5px;text-transform:uppercase}
.tag-low{background:#f0fdf4;color:#15803d}
.tag-med{background:#fffbeb;color:#92400e}
.tag-high{background:#fff7ed;color:#c2410c}
.tag-max{background:#fff1f2;color:#be123c}

/* button */
.compress-btn{width:100%;padding:14px;background:#1d1d1f;border:none;border-radius:10px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.compress-btn:hover:not(:disabled){background:#E24B4A}
.compress-btn:disabled{opacity:.4;cursor:not-allowed}

/* progress */
.prog-wrap{margin-top:14px}
.prog-bar{height:3px;background:#e8e8e8;border-radius:99px;overflow:hidden}
.prog-fill{height:100%;background:#1d1d1f;border-radius:99px;transition:width .4s ease}
.prog-label{font-size:10px;color:rgba(0,0,0,.4);margin-top:6px;text-align:center;letter-spacing:.06em;text-transform:uppercase}

/* result */
.result{text-align:center;padding:8px 0 16px}
.result-icon{font-size:52px;margin-bottom:12px;display:block}
.result h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:22px;font-weight:800;color:#1d1d1f;margin-bottom:8px;letter-spacing:-.03em}
.result p{font-size:14px;color:rgba(0,0,0,.5);margin-bottom:20px;line-height:1.6}
.stats{display:flex;justify-content:center;gap:32px;margin-bottom:24px;flex-wrap:wrap}
.stat{text-align:center}
.stat-val{font-size:22px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em;font-family:var(--font-jakarta,system-ui,sans-serif)}
.stat-val.green{color:#15803d}
.stat-label{font-size:10px;color:rgba(0,0,0,.4);text-transform:uppercase;letter-spacing:.06em;margin-top:2px}
.result-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.dl-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:#1d1d1f;border-radius:10px;font-size:14px;font-weight:700;color:#fff;cursor:pointer;border:none;transition:background .15s}
.dl-btn:hover{background:#E24B4A}
.again-btn{display:inline-flex;align-items:center;gap:7px;padding:12px 20px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s}
.again-btn:hover{border-color:#1d1d1f}

/* info */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:48px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:5px}
.info-card p{font-size:12px;color:rgba(0,0,0,.45);line-height:1.6}

.error-box{padding:11px 14px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:9px;font-size:13px;color:#E24B4A;margin-top:10px}
.note{margin:4px 0 20px;padding:11px 14px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:0 9px 9px 0;font-size:11.5px;line-height:1.6;color:#854d0e}
`

const LEVELS = [
  { id: 'low',     name: 'Low',     desc: 'Near-original quality, minimal size reduction',   tag: 'Best Quality',  cls: 'tag-low' },
  { id: 'medium',  name: 'Medium',  desc: 'Balanced quality and compression',                 tag: 'Balanced',      cls: 'tag-med' },
  { id: 'high',    name: 'High',    desc: 'Smaller file, good for screen reading',            tag: 'Smaller',       cls: 'tag-high' },
  { id: 'maximum', name: 'Maximum', desc: 'Smallest possible file, reduced image quality',   tag: 'Smallest',      cls: 'tag-max' },
]

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

type Result = { blob: Blob; name: string; origSize: number; newSize: number }

// Rendered DPI + JPEG quality per level — mirrors Ghostscript's /prepress,
// /printer, /ebook, /screen presets closely enough for a client-side stand-in.
const COMPRESS_SETTINGS: Record<string, { dpi: number; quality: number }> = {
  low:     { dpi: 300, quality: 0.92 },
  medium:  { dpi: 200, quality: 0.82 },
  high:    { dpi: 150, quality: 0.70 },
  maximum: { dpi: 96,  quality: 0.50 },
}

function canvasToJpegBytes(canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('Could not encode a compressed page image.')); return }
      blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf)), reject)
    }, 'image/jpeg', quality)
  })
}

// Rebuilds the PDF by rendering each page to a canvas and re-embedding it as
// a JPEG at a lower DPI/quality — runs entirely in the browser, no server
// round-trip. Text and vector content become part of the page image, so the
// output is no longer selectable or searchable (users are warned in the UI).
async function compressPdf(
  file: File,
  level: string,
  onProgress: (pct: number, label: string) => void,
): Promise<Uint8Array> {
  const { dpi, quality } = COMPRESS_SETTINGS[level] ?? COMPRESS_SETTINGS.medium
  const scale = dpi / 72

  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  const { PDFDocument } = await import('pdf-lib')

  const sourceBuffer = await file.arrayBuffer()
  const sourceDoc = await pdfjsLib.getDocument({ data: sourceBuffer }).promise
  const outDoc = await PDFDocument.create()

  for (let i = 1; i <= sourceDoc.numPages; i++) {
    onProgress(Math.round(((i - 1) / sourceDoc.numPages) * 90) + 5, `Compressing page ${i} of ${sourceDoc.numPages}…`)

    const page = await sourceDoc.getPage(i)
    const renderViewport = page.getViewport({ scale })
    const pageViewport = page.getViewport({ scale: 1 }) // 1.0 scale = PDF points, for output page size

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(renderViewport.width))
    canvas.height = Math.max(1, Math.round(renderViewport.height))
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, viewport: renderViewport }).promise

    const jpegBytes = await canvasToJpegBytes(canvas, quality)
    const embeddedImage = await outDoc.embedJpg(jpegBytes)

    const outPage = outDoc.addPage([pageViewport.width, pageViewport.height])
    outPage.drawImage(embeddedImage, { x: 0, y: 0, width: pageViewport.width, height: pageViewport.height })
  }

  onProgress(97, 'Finalizing…')
  return outDoc.save()
}

export default function PDFCompressorPage() {
  const [file, setFile]       = useState<File | null>(null)
  const [level, setLevel]     = useState('medium')
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [result, setResult]   = useState<Result | null>(null)
  const [error, setError]     = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setFile(f); setError(''); setResult(null)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const onCompress = async () => {
    if (!file) return
    setError(''); setProcessing(true); setProgress(5); setProgressLabel('Reading PDF…'); setResult(null)

    try {
      const origSize = file.size
      const compressed = await compressPdf(file, level, (pct, label) => {
        setProgress(pct); setProgressLabel(label)
      })

      // If the rebuilt version somehow came out larger (e.g. a small,
      // already-tight vector-only PDF), just ship the original bytes back.
      const finalBytes = compressed.byteLength < origSize
        ? compressed
        : new Uint8Array(await file.arrayBuffer())

      const blobPart = finalBytes.buffer.slice(
        finalBytes.byteOffset,
        finalBytes.byteOffset + finalBytes.byteLength,
      ) as ArrayBuffer
      const blob = new Blob([blobPart], { type: 'application/pdf' })
      const name = file.name.replace(/\.pdf$/i, '') + '_compressed.pdf'

      setProgress(100)
      setResult({ blob, name, origSize, newSize: finalBytes.byteLength })
    } catch (e: any) {
      setError('Compression failed: ' + (e?.message ?? 'Unknown error'))
    } finally {
      setProcessing(false)
    }
  }

  const onDownload = () => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a   = document.createElement('a')
    a.href    = url
    a.download = result.name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  const reset = () => { setFile(null); setResult(null); setError(''); setProgress(0) }

  const savings = result ? Math.max(0, Math.round((1 - result.newSize / result.origSize) * 100)) : 0

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg" id="main-content">

        {/* Nav */}
        <SiteNav />

        {/* Hero */}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>PDF Tools · Free · Fast</div>
            <h1>Compress Your<br/><em>PDF</em> File</h1>
            <p className="tool-hero-definition">A PDF compressor reduces file size by rendering each PDF page at the selected resolution, encoding it as JPEG, and rebuilding the document locally in your browser. EditPDF AI offers four lossy compression levels. The output may not be smaller, and its text is no longer selectable or searchable, so inspect quality before sharing.</p>
          </div>
        </div>

        {/* Main */}
        <div className="wrap">
          <div className="card">
            {result ? (
              <div className="result">
                <span className="result-icon">{savings > 0 ? '🎉' : '✅'}</span>
                <h2>{savings > 0 ? `Reduced by ${savings}%` : 'Compression complete'}</h2>
                <p>
                  {savings > 0
                    ? `Your PDF shrank from ${fmt(result.origSize)} to ${fmt(result.newSize)}.`
                    : `File is already well-optimised (${fmt(result.newSize)}).`}
                </p>
                <div className="stats">
                  <div className="stat">
                    <div className="stat-val">{fmt(result.origSize)}</div>
                    <div className="stat-label">Original</div>
                  </div>
                  <div className="stat">
                    <div className="stat-val green">{fmt(result.newSize)}</div>
                    <div className="stat-label">Compressed</div>
                  </div>
                  <div className="stat">
                    <div className="stat-val green">{savings}%</div>
                    <div className="stat-label">Saved</div>
                  </div>
                </div>
                <div className="result-btns">
                  <button className="dl-btn" onClick={onDownload}>⬇ Download</button>
                  <button className="again-btn" onClick={reset}>Compress another</button>
                </div>
              </div>
            ) : (
              <>
                {!file ? (
                  <div
                    className={`drop${dragging ? ' over' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                  >
                    <span className="drop-icon">📄</span>
                    <h2>Drop your PDF here</h2>
                    <p>Drag &amp; drop or click to browse · practical capacity depends on this device</p>
                    <button className="drop-btn">Choose PDF</button>
                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                  </div>
                ) : (
                  <>
                    {/* File row */}
                    <div className="file-row">
                      <div className="file-icon">📄</div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{fmt(file.size)}</div>
                      </div>
                      <button className="file-rm" onClick={reset} aria-label="Remove file">✕</button>
                    </div>

                    {/* Compression levels */}
                    <div className="level-label">Compression level</div>
                    <div className="levels">
                      {LEVELS.map(l => (
                        <div
                          key={l.id}
                          className={`level${level === l.id ? ' active' : ''}`}
                          onClick={() => setLevel(l.id)}
                        >
                          <div className="level-name">{l.name}</div>
                          <div className="level-desc">{l.desc}</div>
                          <span className={`level-tag ${l.cls}`}>{l.tag}</span>
                        </div>
                      ))}
                    </div>

                    <div className="note">Compression rebuilds each page from a flattened image — the output PDF is no longer searchable or has selectable text. Use a lower compression level to keep quality closer to the original.</div>

                    {error && <div className="error-box">{error}</div>}

                    <button
                      className="compress-btn"
                      onClick={onCompress}
                      disabled={processing}
                    >
                      {processing ? '⏳ Compressing…' : '⚡ Compress PDF'}
                    </button>

                    {processing && (
                      <div className="prog-wrap">
                        <div className="prog-bar">
                          <div className="prog-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="prog-label">{progressLabel || 'Compressing…'}</div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>⚡ 4 Levels</h3>
              <p>Choose from higher-detail to smaller-output settings for email and web sharing.</p>
            </div>
            <div className="info-card">
              <h3>🔒 Private</h3>
              <p>Compression runs locally in your browser without an application document-processing request.</p>
            </div>
            <div className="info-card">
              <h3>📂 Universal</h3>
              <p>Output opens in Adobe Acrobat, Chrome, Preview, and any standard PDF reader.</p>
            </div>
          </div>
        </div>
      </div>
      <ToolQuickFacts
        price="Free — no account needed"
        account="Not required"
        processing="Processed locally in your browser via a Web Worker"
        formats="Input: PDF · Output: image-based PDF"
        fileLimit="Practical capacity depends on page count, image dimensions, browser memory, and device performance"
        browserSupport="Modern desktop and mobile browsers with JavaScript, canvas, Web Workers, and required file APIs"
      />
      <ToolSEOSection {...toolSeoData['pdf-compressor']} showDirectAnswer={false} />
    </>
  )
}
