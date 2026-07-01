'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{-webkit-font-smoothing:antialiased;height:100%}
body{color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.pg{min-height:100vh;background:#f5f5f7;display:flex;flex-direction:column;padding-top:56px;}

/* ── Nav ── */

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:linear-gradient(135deg,#1d1d1f,#444);border-radius:8px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#0a84ff}
.nav-sep{font-size:13px;color:rgba(0,0,0,.18);font-weight:300}
.nav-tool{font-size:13px;font-weight:600;color:#1d1d1f;letter-spacing:-.01em}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.4);text-decoration:none;padding:6px 13px;border-radius:8px;border:1px solid rgba(0,0,0,.1);transition:all .15s;letter-spacing:-.01em}
.back:hover{color:#1d1d1f;border-color:rgba(0,0,0,.25);background:#fff}

/* ── Upload screen ── */
.upload-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px}
.hero{text-align:center;margin-bottom:36px;animation:fadeup .35s ease}
.badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:#e0f0ff;border:1px solid rgba(10,132,255,.18);border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#0a84ff;text-transform:uppercase;margin-bottom:16px}
.badge-dot{width:5px;height:5px;border-radius:50%;background:#0a84ff;animation:pulse 2s ease infinite}
.hero h1{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;line-height:1.05;margin-bottom:12px}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,#0a84ff,#34aadc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:15px;color:rgba(0,0,0,.42);line-height:1.65;max-width:420px;margin:0 auto}

.upload-card{background:#fff;border:1px solid #e5e5e7;border-radius:20px;padding:32px;width:100%;max-width:560px;box-shadow:0 4px 24px rgba(0,0,0,.07)}
.err{padding:12px 16px;background:#fff5f5;border:1px solid rgba(220,38,38,.18);border-radius:10px;font-size:13px;color:#dc2626;margin-bottom:16px;display:flex;align-items:flex-start;gap:8px}

.drop{border:2px dashed #d2d2d7;border-radius:14px;padding:52px 28px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;position:relative;overflow:hidden}
.drop::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#e0f0ff 0%,#fff 100%);opacity:0;transition:opacity .2s}
.drop:hover,.drop.over{border-color:#0a84ff;background:#f0f8ff}
.drop:hover::before,.drop.over::before{opacity:1}
.drop-inner{position:relative;z-index:1}
.drop-icon-wrap{width:72px;height:72px;background:linear-gradient(135deg,#0a84ff,#34aadc);border-radius:20px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(10,132,255,.28);transition:transform .2s}
.drop:hover .drop-icon-wrap,.drop.over .drop-icon-wrap{transform:scale(1.06)}
.drop h2{font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:8px;letter-spacing:-.02em}
.drop p{font-size:13px;color:rgba(0,0,0,.38);margin-bottom:20px;line-height:1.6}
.browse-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:#1d1d1f;border-radius:10px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:all .16s;letter-spacing:-.01em}
.browse-btn:hover{background:#0a84ff;transform:translateY(-1px);box-shadow:0 4px 16px rgba(10,132,255,.35)}

/* ── Loading ── */
.loading-state{text-align:center;padding:56px 24px}
.big-spin{width:36px;height:36px;border:3px solid rgba(10,132,255,.15);border-top-color:#0a84ff;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 18px}
.loading-title{font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:5px;letter-spacing:-.01em}
.loading-sub{font-size:12px;color:rgba(0,0,0,.38)}

/* ── Viewer ── */
.viewer{flex:1;display:flex;flex-direction:column;background:#1c1c1e;overflow:hidden;min-height:0}

/* Toolbar */
.toolbar{height:52px;background:#2c2c2e;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;padding:0 12px;gap:4px;flex-shrink:0;overflow-x:auto;scrollbar-width:none}
.toolbar::-webkit-scrollbar{display:none}
.tb-left{display:flex;align-items:center;gap:4px;flex-shrink:0}
.tb-center{display:flex;align-items:center;gap:4px;flex:1;justify-content:center;flex-shrink:0}
.tb-right{display:flex;align-items:center;gap:4px;flex-shrink:0}
.tb-sep{width:1px;height:22px;background:rgba(255,255,255,.12);margin:0 4px;flex-shrink:0}

.tb-btn{height:32px;min-width:32px;border-radius:8px;border:none;background:transparent;color:rgba(255,255,255,.75);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px;padding:0 10px;white-space:nowrap;letter-spacing:-.01em}
.tb-btn:hover:not(:disabled){background:rgba(255,255,255,.1);color:#fff}
.tb-btn:disabled{opacity:.3;cursor:not-allowed}
.tb-btn.accent{background:#0a84ff;color:#fff}
.tb-btn.accent:hover{background:#0070e0}
.tb-icon{font-size:16px;line-height:1}

.page-ctrl{display:flex;align-items:center;gap:6px}
.page-input{width:44px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;font-size:13px;font-weight:600;text-align:center;outline:none;transition:border .15s;font-family:inherit}
.page-input:focus{border-color:#0a84ff;background:rgba(10,132,255,.12)}
.page-total{font-size:12px;color:rgba(255,255,255,.45);white-space:nowrap;letter-spacing:-.01em}

.zoom-display{font-size:12px;font-weight:600;color:rgba(255,255,255,.6);min-width:40px;text-align:center;letter-spacing:-.01em;cursor:pointer;padding:4px 6px;border-radius:6px;transition:background .15s}
.zoom-display:hover{background:rgba(255,255,255,.08);color:#fff}

.tb-filename{font-size:12px;color:rgba(255,255,255,.45);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-.01em}

/* Canvas area */
.canvas-area{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:28px 24px;min-height:0;position:relative}
.canvas-area::-webkit-scrollbar{width:8px;height:8px}
.canvas-area::-webkit-scrollbar-track{background:transparent}
.canvas-area::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:4px}
.canvas-area::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.2)}

.page-shadow{box-shadow:0 8px 40px rgba(0,0,0,.6),0 2px 8px rgba(0,0,0,.4);border-radius:2px;flex-shrink:0;position:relative}
.pdf-canvas{display:block;border-radius:2px}

/* Render overlay */
.render-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:10;pointer-events:none}
.render-spin{width:28px;height:28px;border:2.5px solid rgba(255,255,255,.15);border-top-color:rgba(255,255,255,.6);border-radius:50%;animation:spin .7s linear infinite}

/* Page counter badge */
.page-badge{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.65);backdrop-filter:blur(12px);color:rgba(255,255,255,.9);font-size:12px;font-weight:600;padding:5px 14px;border-radius:99px;letter-spacing:-.01em;opacity:0;transition:opacity .3s;pointer-events:none;z-index:100}
.page-badge.show{opacity:1}

/* Keyboard hint */
.kb-hint{display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap}
.kb-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:rgba(0,0,0,.38);letter-spacing:-.01em}
.kb-key{padding:2px 7px;background:rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.1);border-radius:5px;font-size:10px;font-weight:600;font-family:ui-monospace,monospace}

/* Fullscreen */
:fullscreen 
:fullscreen .viewer{min-height:100vh}
:-webkit-full-screen 
:-webkit-full-screen .viewer{min-height:100vh}

@media(max-width:600px){
  .tb-filename{display:none}
  .tb-btn{padding:0 7px;font-size:12px}
  .canvas-area{padding:16px 8px}
}
`

// ─── PDF.js CDN loader ────────────────────────────────────────────────────────
let pdfjs: any = null
async function loadPDFJS(): Promise<any> {
  if (pdfjs) return pdfjs
  if ((window as any).pdfjsLib) {
    pdfjs = (window as any).pdfjsLib
    return pdfjs
  }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error('Failed to load PDF.js — check your internet connection.'))
    document.head.appendChild(s)
  })
  pdfjs = (window as any).pdfjsLib
  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  return pdfjs
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(b: number) {
  return b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
}
function triggerDownload(file: File) {
  const url = URL.createObjectURL(file)
  const a   = document.createElement('a'); a.href = url; a.download = file.name; a.click()
  URL.revokeObjectURL(url)
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const PDFIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white" fillOpacity=".9"/>
    <polyline points="14 2 14 8 20 8" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" fill="none"/>
    <text x="6.5" y="18" fontSize="6.5" fontWeight="bold" fill="rgba(255,255,255,.85)" fontFamily="monospace">PDF</text>
  </svg>
)

// ─── Component ───────────────────────────────────────────────────────────────
export default function PDFViewerPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [pdfDoc,      setPdfDoc]      = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages,  setTotalPages]  = useState(0)
  const [zoom,        setZoom]        = useState(1.0)
  const [pageInput,   setPageInput]   = useState('1')
  const [isDrop,      setIsDrop]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [rendering,   setRendering]   = useState(false)
  const [isFullscreen,setIsFullscreen]= useState(false)
  const [showBadge,   setShowBadge]   = useState(false)
  const [error,       setError]       = useState('')

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef    = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const renderTaskRef = useRef<any>(null)
  const badgeTimerRef = useRef<any>(null)

  // ── Render a page ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return
    const aborted = { yes: false }

    ;(async () => {
      // Cancel any in-flight render
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel() } catch {}
        renderTaskRef.current = null
      }
      setRendering(true)
      try {
        const page     = await pdfDoc.getPage(currentPage)
        if (aborted.yes) return

        const vp1      = page.getViewport({ scale: 1 })
        const container = containerRef.current
        const avail    = container ? Math.max(container.clientWidth - 48, 200) : 600
        const base     = Math.min(avail / vp1.width, 3)
        const scale    = Math.max(0.1, Math.min(base * zoom, 8))

        const vp   = page.getViewport({ scale })
        const dpr  = window.devicePixelRatio || 1
        const canvas = canvasRef.current
        if (!canvas || aborted.yes) return

        const ctx  = canvas.getContext('2d')!
        canvas.width  = Math.round(vp.width  * dpr)
        canvas.height = Math.round(vp.height * dpr)
        canvas.style.width  = `${Math.round(vp.width)}px`
        canvas.style.height = `${Math.round(vp.height)}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const rt = page.render({ canvasContext: ctx, viewport: vp })
        renderTaskRef.current = rt
        await rt.promise
      } catch (e: any) {
        if (e?.name !== 'RenderingCancelledException' && !aborted.yes) {
          setError('Failed to render page — the PDF may be corrupted.')
        }
      } finally {
        if (!aborted.yes) setRendering(false)
      }
    })()

    return () => { aborted.yes = true }
  }, [pdfDoc, currentPage, zoom])

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDoc) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goToPageNum(p => Math.min(p + 1, totalPages))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goToPageNum(p => Math.max(p - 1, 1))
      } else if (e.key === '+' || e.key === '=') {
        setZoom(z => Math.min(+(z * 1.25).toFixed(4), 8))
      } else if (e.key === '-') {
        setZoom(z => Math.max(+(z / 1.25).toFixed(4), 0.1))
      } else if (e.key === '0') {
        setZoom(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, totalPages])

  // ── Fullscreen listener ────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // ── Page badge flash ──────────────────────────────────────────────────────
  const flashBadge = () => {
    setShowBadge(true)
    if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current)
    badgeTimerRef.current = setTimeout(() => setShowBadge(false), 1400)
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToPageNum = (updater: number | ((prev: number) => number)) => {
    setCurrentPage(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      setPageInput(String(next))
      flashBadge()
      return next
    })
  }

  const commitPageInput = (val: string) => {
    const n = parseInt(val)
    if (!isNaN(n) && n >= 1 && n <= totalPages) goToPageNum(n)
    else setPageInput(String(currentPage))
  }

  // ── Load PDF ──────────────────────────────────────────────────────────────
  const loadFile = useCallback(async (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.'); return
    }
    setError(''); setLoading(true); setPdfDoc(null)
    try {
      const lib  = await loadPDFJS()
      const buf  = await f.arrayBuffer()
      const doc  = await lib.getDocument({ data: buf }).promise
      setFile(f)
      setPdfDoc(doc)
      setTotalPages(doc.numPages)
      setCurrentPage(1)
      setPageInput('1')
      setZoom(1)
    } catch (e: any) {
      setError(e?.message ?? 'Could not open the PDF file.')
    } finally {
      setLoading(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  // ── Zoom ──────────────────────────────────────────────────────────────────
  const zoomIn  = () => setZoom(z => Math.min(+(z * 1.25).toFixed(4), 8))
  const zoomOut = () => setZoom(z => Math.max(+(z / 1.25).toFixed(4), 0.1))
  const fitWidth = () => setZoom(1)

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!viewerRef.current) return
    if (!document.fullscreenElement) viewerRef.current.requestFullscreen().catch(() => {})
    else document.exitFullscreen()
  }

  const reset = () => {
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel() } catch {} }
    setFile(null); setPdfDoc(null); setCurrentPage(1)
    setTotalPages(0); setZoom(1); setPageInput('1'); setError('')
  }

  const hasPDF  = !!pdfDoc
  const zoomPct = Math.round(zoom * 100)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        {loading ? (
          /* ── Loading ── */
          <div className="upload-wrap">
            <div className="upload-card">
              <div className="loading-state">
                <div className="big-spin"/>
                <div className="loading-title">Opening PDF…</div>
                <div className="loading-sub">Loading PDF.js renderer</div>
              </div>
            </div>
          </div>

        ) : !hasPDF ? (
          /* ── Upload screen ── */
          <div className="upload-wrap">
            <div className="hero">
              <div className="badge">
                <span className="badge-dot"/>
                In-Browser · No Upload
              </div>
              <h1>PDF <em>Viewer</em></h1>
              <p>Open and read any PDF instantly in your browser. Zoom, navigate, and download — all without leaving the page.</p>
            </div>

            <div className="upload-card">
              {error && <div className="err"><span>⚠</span><span>{error}</span></div>}
              <div
                className={`drop${isDrop?' over':''}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                onDragLeave={() => setIsDrop(false)}
              >
                <div className="drop-inner">
                  <div className="drop-icon-wrap"><PDFIcon/></div>
                  <h2>Drop a PDF here to open it</h2>
                  <p>Any PDF — documents, ebooks, reports, forms</p>
                  <button className="browse-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Choose PDF
                  </button>
                </div>
              </div>

              <div className="kb-hint">
                <span className="kb-chip"><span className="kb-key">←</span><span className="kb-key">→</span> Navigate</span>
                <span className="kb-chip"><span className="kb-key">+</span><span className="kb-key">−</span> Zoom</span>
                <span className="kb-chip"><span className="kb-key">0</span> Fit width</span>
              </div>
            </div>
          </div>

        ) : (
          /* ── Viewer ── */
          <div className="viewer" ref={viewerRef}>

            {/* Toolbar */}
            <div className="toolbar">
              {/* Left */}
              <div className="tb-left">
                <button className="tb-btn" onClick={reset} title="Close PDF">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Close
                </button>
                <div className="tb-sep"/>
                <span className="tb-filename" title={file?.name}>{file?.name}</span>
                <span style={{fontSize:11,color:'rgba(255,255,255,.28)',marginLeft:6}}>{fmt(file?.size??0)}</span>
              </div>

              {/* Center — page nav */}
              <div className="tb-center">
                <div className="page-ctrl">
                  <button
                    className="tb-btn"
                    onClick={() => goToPageNum(p => Math.max(p-1, 1))}
                    disabled={currentPage <= 1}
                    title="Previous page (←)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <input
                    className="page-input"
                    value={pageInput}
                    onChange={e => setPageInput(e.target.value)}
                    onBlur={e => commitPageInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') commitPageInput(pageInput) }}
                    title="Current page"
                  />
                  <span className="page-total">of {totalPages}</span>
                  <button
                    className="tb-btn"
                    onClick={() => goToPageNum(p => Math.min(p+1, totalPages))}
                    disabled={currentPage >= totalPages}
                    title="Next page (→)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>

              {/* Right — zoom + actions */}
              <div className="tb-right">
                <button className="tb-btn" onClick={zoomOut} title="Zoom out (−)" disabled={zoom <= 0.1}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>
                <span className="zoom-display" onClick={fitWidth} title="Click to fit width (0)">{zoomPct}%</span>
                <button className="tb-btn" onClick={zoomIn} title="Zoom in (+)" disabled={zoom >= 8}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>
                <div className="tb-sep"/>
                <button
                  className="tb-btn"
                  onClick={() => file && triggerDownload(file)}
                  title="Download PDF"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </button>
                <button
                  className="tb-btn"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Canvas area */}
            <div className="canvas-area" ref={containerRef}>
              {rendering && (
                <div className="render-overlay">
                  <div className="render-spin"/>
                </div>
              )}
              <div className="page-shadow">
                <canvas ref={canvasRef} className="pdf-canvas"/>
              </div>
            </div>

            {/* Page badge */}
            <div className={`page-badge${showBadge?' show':''}`}>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef} type="file" accept=".pdf,application/pdf"
        style={{display:'none'}}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value='' }}
      />
    </>
  )
}
