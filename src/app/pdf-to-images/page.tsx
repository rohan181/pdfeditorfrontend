'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.pg{min-height:100vh;background:#fff;overflow-x:hidden}
.wrap{max-width:960px;margin:0 auto;padding:0 28px}

.nav{position:sticky;top:0;z-index:200;height:54px;background:rgba(255,255,255,.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.06);display:flex;align-items:center}
.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%}
.logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#E24B4A}
.back{font-size:13px;font-weight:500;color:rgba(0,0,0,.5);text-decoration:none;padding:5px 14px;border-radius:99px;transition:color .15s}
.back:hover{color:#1d1d1f}

.hero{padding:64px 0 36px;text-align:center;border-bottom:1px solid #f0f0f0}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fff5f5;border:1px solid rgba(226,75,74,.2);border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.08em;color:#E24B4A;margin-bottom:18px;text-transform:uppercase}
.bdot{width:5px;height:5px;border-radius:50%;background:#E24B4A}
.hero h1{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:clamp(30px,5vw,54px);font-weight:800;letter-spacing:-.05em;line-height:.97;color:#1d1d1f;margin-bottom:14px}
.hero h1 em{font-style:normal;color:#E24B4A}
.hero p{font-size:15px;color:rgba(0,0,0,.5);line-height:1.7;max-width:440px;margin:0 auto}

.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:32px;margin:32px 0 16px;box-shadow:0 2px 20px rgba(0,0,0,.04)}
@media(max-width:600px){.card{padding:20px 16px}}

/* drop */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#E24B4A;background:#fff5f5}
.drop-icon{font-size:48px;margin-bottom:14px;display:block}
.drop h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:20px;line-height:1.5}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#E24B4A}

/* file row */
.file-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:22px}
.file-icon-box{width:36px;height:36px;background:#E24B4A;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-size{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.file-rm{width:26px;height:26px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:12px;transition:all .15s}
.file-rm:hover{border-color:#E24B4A;color:#E24B4A}

/* settings bar */
.settings{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:13px 16px;background:#fafafa;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:22px}
.set-group{display:flex;align-items:center;gap:8px}
.set-label{font-size:10px;font-weight:600;letter-spacing:.07em;color:rgba(0,0,0,.4);text-transform:uppercase;white-space:nowrap}
.set-divider{width:1px;height:20px;background:#e0e0e0;flex-shrink:0}

/* format / quality toggles */
.toggle-group{display:flex;gap:4px}
.toggle-btn{padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:#fff;color:rgba(0,0,0,.5);transition:all .14s;white-space:nowrap}
.toggle-btn.active{background:#1d1d1f;border-color:#1d1d1f;color:#fff}
.toggle-btn:hover:not(.active){border-color:#bbb;color:#1d1d1f}

/* scale select */
.scale-sel{padding:5px 10px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;font-weight:600;color:#1d1d1f;background:#fff;cursor:pointer;outline:none;font-family:inherit}
.scale-sel:focus{border-color:#1d1d1f}

/* convert button */
.convert-btn{width:100%;padding:14px;background:#1d1d1f;border:none;border-radius:10px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.convert-btn:hover:not(:disabled){background:#E24B4A}
.convert-btn:disabled{opacity:.4;cursor:not-allowed}

/* progress */
.prog-wrap{margin-top:12px}
.prog-bar{height:3px;background:#e8e8e8;border-radius:99px;overflow:hidden}
.prog-fill{height:100%;background:#1d1d1f;border-radius:99px;transition:width .25s ease}
.prog-label{font-size:10px;color:rgba(0,0,0,.4);margin-top:5px;text-align:center;letter-spacing:.06em;text-transform:uppercase}

/* image grid */
.img-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px}
.img-title{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:16px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em}
.img-sub{font-size:11px;color:rgba(0,0,0,.4)}
.dl-all-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:#1d1d1f;border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:background .15s}
.dl-all-btn:hover{background:#E24B4A}

.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:24px}
@media(max-width:480px){.img-grid{grid-template-columns:repeat(2,1fr);gap:10px}}

.img-card{border-radius:10px;border:1px solid #e8e8e8;overflow:hidden;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.04);transition:box-shadow .15s}
.img-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.09)}
.img-preview{position:relative;aspect-ratio:.707;background:#f5f5f7;overflow:hidden;display:flex;align-items:center;justify-content:center}
.img-preview img{width:100%;height:100%;object-fit:contain;display:block}
.img-badge{position:absolute;top:6px;left:6px;background:rgba(0,0,0,.5);color:#fff;font-size:9px;font-weight:700;border-radius:4px;padding:2px 6px;letter-spacing:.04em}
.img-footer{padding:8px 10px;border-top:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:6px}
.img-footer-info{font-size:10px;color:rgba(0,0,0,.45);font-weight:500}
.img-dl-btn{padding:5px 11px;background:#1d1d1f;border:none;border-radius:5px;font-size:10px;font-weight:700;color:#fff;cursor:pointer;transition:background .14s;white-space:nowrap}
.img-dl-btn:hover{background:#E24B4A}

/* action row after results */
.bottom-bar{display:flex;gap:10px;flex-wrap:wrap}
.start-over-btn{flex:1;min-width:140px;padding:13px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px}
.start-over-btn:hover{border-color:#1d1d1f}

/* info */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:48px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:5px}
.info-card p{font-size:12px;color:rgba(0,0,0,.45);line-height:1.6}

.error-box{padding:11px 14px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:9px;font-size:13px;color:#E24B4A;margin-bottom:14px}
`

type Format  = 'png' | 'jpeg' | 'webp'
type Quality = 'low' | 'medium' | 'high'
type ImageResult = { dataUrl: string; pageNum: number; width: number; height: number }

const QUALITY_MAP: Record<Quality, number> = { low: 0.6, medium: 0.85, high: 1.0 }
const SCALE_MAP   = { '1x': 1.5, '2x': 2.5, '3x': 3.5 }

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)![1]
  const binary = atob(data)
  const arr = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

function estimateSize(dataUrl: string) {
  const base64 = dataUrl.split(',')[1] ?? ''
  return Math.round((base64.length * 3) / 4)
}

export default function PDFToImagesPage() {
  const [file, setFile]       = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [isDrop, setIsDrop]   = useState(false)
  const [format, setFormat]   = useState<Format>('png')
  const [quality, setQuality] = useState<Quality>('high')
  const [scale, setScale]     = useState<'1x' | '2x' | '3x'>('2x')
  const [converting, setConverting] = useState(false)
  const [progress, setProgress]     = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [images, setImages]   = useState<ImageResult[]>([])
  const [error, setError]     = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Load file (just read page count, no thumbnail render yet) ───────────────
  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setImages([]); setFile(f)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      setTotalPages(doc.numPages)
    } catch (e: any) {
      setError('Could not read PDF: ' + (e?.message ?? 'unknown'))
      setFile(null)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  // ── Convert ─────────────────────────────────────────────────────────────────
  const onConvert = async () => {
    if (!file) return
    setConverting(true); setProgress(0); setImages([]); setError('')

    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const buf = await file.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      const dpr  = SCALE_MAP[scale]
      const mime = format === 'png' ? 'image/png'
                 : format === 'webp' ? 'image/webp'
                 : 'image/jpeg'
      const q    = format === 'png' ? 1.0 : QUALITY_MAP[quality]

      const results: ImageResult[] = []

      for (let i = 1; i <= doc.numPages; i++) {
        setProgressLabel(`Converting page ${i} of ${doc.numPages}…`)
        const page = await doc.getPage(i)
        const vp   = page.getViewport({ scale: dpr })
        const canvas = document.createElement('canvas')
        canvas.width  = vp.width
        canvas.height = vp.height
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        await page.render({ canvasContext: ctx, viewport: vp }).promise
        results.push({
          dataUrl: canvas.toDataURL(mime, q),
          pageNum: i,
          width: vp.width,
          height: vp.height,
        })
        setProgress(Math.round((i / doc.numPages) * 100))
      }

      setImages(results)
      setProgressLabel('')
    } catch (e: any) {
      setError('Conversion failed: ' + (e?.message ?? 'unknown'))
    } finally {
      setConverting(false)
    }
  }

  // ── Download helpers ─────────────────────────────────────────────────────────
  const downloadOne = (img: ImageResult) => {
    const ext  = format === 'jpeg' ? 'jpg' : format
    const name = `${file!.name.replace(/\.pdf$/i, '')}_page${img.pageNum}.${ext}`
    const a    = document.createElement('a')
    a.href = img.dataUrl; a.download = name; a.click()
  }

  const downloadAll = async () => {
    // Dynamic import of JSZip-free approach: stagger downloads
    const ext  = format === 'jpeg' ? 'jpg' : format
    const base = file!.name.replace(/\.pdf$/i, '')
    for (let i = 0; i < images.length; i++) {
      await new Promise<void>(res => {
        setTimeout(() => {
          const a = document.createElement('a')
          a.href = images[i].dataUrl
          a.download = `${base}_page${images[i].pageNum}.${ext}`
          a.click()
          res()
        }, i * 250)
      })
    }
  }

  const reset = () => {
    setFile(null); setImages([]); setTotalPages(0)
    setError(''); setProgress(0); setProgressLabel('')
  }

  const hasResults = images.length > 0
  const ext = format === 'jpeg' ? 'jpg' : format

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <nav className="nav">
          <div className="wrap nav-in">
            <Link href="/" className="logo">
              <div className="logo-mark">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2z"/><path d="M14 2v6h6"/>
                </svg>
              </div>
              <span className="logo-name">Edit<em>PDF</em> AI</span>
            </Link>
            <Link href="/" className="back">← All Tools</Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>Export · PNG · JPEG · WebP · Free</div>
            <h1>PDF to<br/><em>Images</em></h1>
            <p>Convert every page of your PDF into high-resolution PNG, JPEG, or WebP images — instantly in your browser.</p>
          </div>
        </div>

        {/* Main */}
        <div className="wrap">
          <div className="card">

            {!file ? (
              /* ── Upload zone ── */
              <>
                <div
                  className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}
                  onDrop={onDrop}
                >
                  <span className="drop-icon">🖼️</span>
                  <h2>Drop your PDF here</h2>
                  <p>Each page will be converted to a separate image file</p>
                  <button className="drop-btn">Choose PDF</button>
                  <input ref={fileRef} type="file" accept=".pdf" style={{ display:'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
                </div>
                {error && <div className="error-box" style={{ marginTop:14 }}>{error}</div>}
              </>
            ) : (
              <>
                {/* File row */}
                <div className="file-row">
                  <div className="file-icon-box">📄</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{fmt(file.size)}{totalPages ? ` · ${totalPages} page${totalPages !== 1 ? 's' : ''}` : ''}</div>
                  </div>
                  <button className="file-rm" onClick={reset} title="Remove">✕</button>
                </div>

                {/* Settings */}
                {!hasResults && (
                  <div className="settings">
                    {/* Format */}
                    <div className="set-group">
                      <span className="set-label">Format</span>
                      <div className="toggle-group">
                        {(['png','jpeg','webp'] as Format[]).map(f => (
                          <button key={f} className={`toggle-btn${format === f ? ' active' : ''}`} onClick={() => setFormat(f)}>
                            {f.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="set-divider" />

                    {/* Quality (hidden for PNG since it's always lossless) */}
                    {format !== 'png' && (
                      <>
                        <div className="set-group">
                          <span className="set-label">Quality</span>
                          <div className="toggle-group">
                            {(['low','medium','high'] as Quality[]).map(q => (
                              <button key={q} className={`toggle-btn${quality === q ? ' active' : ''}`} onClick={() => setQuality(q)}>
                                {q.charAt(0).toUpperCase() + q.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="set-divider" />
                      </>
                    )}

                    {/* Resolution */}
                    <div className="set-group">
                      <span className="set-label">Resolution</span>
                      <select
                        className="scale-sel"
                        value={scale}
                        onChange={e => setScale(e.target.value as '1x'|'2x'|'3x')}
                      >
                        <option value="1x">1× — Screen (72 dpi)</option>
                        <option value="2x">2× — Sharp (144 dpi)</option>
                        <option value="3x">3× — Print (216 dpi)</option>
                      </select>
                    </div>
                  </div>
                )}

                {error && <div className="error-box">{error}</div>}

                {/* Results grid */}
                {hasResults && (
                  <>
                    <div className="img-header">
                      <div>
                        <div className="img-title">{images.length} image{images.length !== 1 ? 's' : ''} ready</div>
                        <div className="img-sub">{scale} resolution · {format.toUpperCase()}</div>
                      </div>
                      {images.length > 1 && (
                        <button className="dl-all-btn" onClick={downloadAll}>
                          ⬇ Download all ({images.length})
                        </button>
                      )}
                    </div>

                    <div className="img-grid">
                      {images.map(img => (
                        <div className="img-card" key={img.pageNum}>
                          <div className="img-preview">
                            <img src={img.dataUrl} alt={`Page ${img.pageNum}`} />
                            <span className="img-badge">Page {img.pageNum}</span>
                          </div>
                          <div className="img-footer">
                            <div className="img-footer-info">
                              {img.width}×{img.height} · {fmt(estimateSize(img.dataUrl))}
                            </div>
                            <button className="img-dl-btn" onClick={() => downloadOne(img)}>
                              ⬇ .{ext}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Convert button / progress */}
                {!hasResults && (
                  <>
                    <button className="convert-btn" onClick={onConvert} disabled={converting || !totalPages}>
                      {converting ? `⏳ ${progressLabel || 'Converting…'}` : `🖼️ Convert ${totalPages} page${totalPages !== 1 ? 's' : ''} to ${format.toUpperCase()}`}
                    </button>

                    {converting && (
                      <div className="prog-wrap">
                        <div className="prog-bar">
                          <div className="prog-fill" style={{ width:`${progress}%` }} />
                        </div>
                        <div className="prog-label">{progressLabel}</div>
                      </div>
                    )}
                  </>
                )}

                {/* Bottom bar after results */}
                {hasResults && (
                  <div className="bottom-bar">
                    <button className="start-over-btn" onClick={reset}>Convert another PDF</button>
                    {images.length > 1 && (
                      <button className="dl-all-btn" style={{ flex:1 }} onClick={downloadAll}>
                        ⬇ Download all {images.length} images
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>🖼️ PNG · JPEG · WebP</h3>
              <p>Choose your format. PNG for lossless, JPEG for smaller files, WebP for the best of both.</p>
            </div>
            <div className="info-card">
              <h3>🔍 Up to 3× resolution</h3>
              <p>Export at screen, sharp, or print resolution — perfect for presentations and documents.</p>
            </div>
            <div className="info-card">
              <h3>🔒 100% Private</h3>
              <p>All conversion happens in your browser using PDF.js. Your file never leaves your device.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
