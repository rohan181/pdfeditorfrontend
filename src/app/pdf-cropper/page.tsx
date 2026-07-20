'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{-webkit-font-smoothing:antialiased;height:100%;overflow:hidden}
body{color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.pg{height:100vh;height:100dvh;background:#f5f5f7;display:flex;flex-direction:column;overflow:hidden;padding-top:56px;}

/* ── Nav ── */

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:linear-gradient(135deg,#1d1d1f,#444);border-radius:8px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#0d9488}
.nav-sep{font-size:13px;color:rgba(0,0,0,.18);font-weight:300}
.nav-tool{font-size:13px;font-weight:600;color:#1d1d1f;letter-spacing:-.01em}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.4);text-decoration:none;padding:6px 13px;border-radius:8px;border:1px solid rgba(0,0,0,.1);transition:all .15s;letter-spacing:-.01em}
.back:hover{color:#1d1d1f;border-color:rgba(0,0,0,.25);background:#fff}

/* ── Upload screen ── */
.upload-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;overflow-y:auto}
.hero{text-align:center;margin-bottom:36px;animation:fadeup .35s ease}
.badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:#ccfbf1;border:1px solid rgba(13,148,136,.18);border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#0d9488;text-transform:uppercase;margin-bottom:16px}
.badge-dot{width:5px;height:5px;border-radius:50%;background:#0d9488;animation:pulse 2s ease infinite}
.hero h1{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;line-height:1.05;margin-bottom:12px}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,#0d9488,#14b8a6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:15px;color:rgba(0,0,0,.42);line-height:1.65;max-width:440px;margin:0 auto}

.upload-card{background:#fff;border:1px solid #e5e5e7;border-radius:20px;padding:32px;width:100%;max-width:560px;box-shadow:0 4px 24px rgba(0,0,0,.07)}
.err{padding:12px 16px;background:#fff5f5;border:1px solid rgba(220,38,38,.18);border-radius:10px;font-size:13px;color:#dc2626;margin-bottom:16px;display:flex;align-items:flex-start;gap:8px}

.drop{border:2px dashed #d2d2d7;border-radius:14px;padding:52px 28px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;position:relative;overflow:hidden}
.drop::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#ccfbf1 0%,#fff 100%);opacity:0;transition:opacity .2s}
.drop:hover,.drop.over{border-color:#0d9488;background:#f0fdfa}
.drop:hover::before,.drop.over::before{opacity:1}
.drop-inner{position:relative;z-index:1}
.drop-icon-wrap{width:72px;height:72px;background:linear-gradient(135deg,#0d9488,#14b8a6);border-radius:20px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(13,148,136,.28);transition:transform .2s}
.drop:hover .drop-icon-wrap,.drop.over .drop-icon-wrap{transform:scale(1.06)}
.drop h2{font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:8px;letter-spacing:-.02em}
.drop p{font-size:13px;color:rgba(0,0,0,.38);margin-bottom:20px;line-height:1.6}
.browse-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:#1d1d1f;border-radius:10px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:all .16s;letter-spacing:-.01em}
.browse-btn:hover{background:#0d9488;transform:translateY(-1px);box-shadow:0 4px 16px rgba(13,148,136,.35)}

/* ── Loading ── */
.loading-state{text-align:center;padding:56px 24px}
.big-spin{width:36px;height:36px;border:3px solid rgba(13,148,136,.15);border-top-color:#0d9488;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 18px}
.loading-title{font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:5px}
.loading-sub{font-size:12px;color:rgba(0,0,0,.38)}

/* ── Cropper layout ── */
.cropper{flex:1;display:flex;flex-direction:column;background:#1c1c1e;overflow:hidden;min-height:0}

/* Toolbar */
.toolbar{height:52px;background:#2c2c2e;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;padding:0 12px;gap:4px;flex-shrink:0;overflow-x:auto;scrollbar-width:none}
.toolbar::-webkit-scrollbar{display:none}
.tb-l{display:flex;align-items:center;gap:4px;flex-shrink:0}
.tb-c{display:flex;align-items:center;gap:4px;flex:1;justify-content:center}
.tb-r{display:flex;align-items:center;gap:4px;flex-shrink:0}
.tb-sep{width:1px;height:38px;background:rgba(255,255,255,.12);margin:0 4px;flex-shrink:0}

.tb-btn{height:32px;min-width:32px;border-radius:8px;border:none;background:transparent;color:rgba(255,255,255,.7);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px;padding:0 10px;white-space:nowrap;letter-spacing:-.01em}
.tb-btn:hover:not(:disabled){background:rgba(255,255,255,.1);color:#fff}
.tb-btn:disabled{opacity:.3;cursor:not-allowed}
.tb-btn.accent{background:#0d9488;color:#fff}
.tb-btn.accent:hover{background:#0f766e}
.tb-btn.danger{color:rgba(255,100,100,.8)}
.tb-btn.danger:hover{background:rgba(255,80,80,.12);color:#ff6060}

.page-ctrl{display:flex;align-items:center;gap:6px}
.page-input{width:40px;height:28px;border-radius:7px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:#fff;font-size:12px;font-weight:600;text-align:center;outline:none;transition:border .15s;font-family:inherit}
.page-input:focus{border-color:#0d9488}
.page-total{font-size:11px;color:rgba(255,255,255,.38);white-space:nowrap}
.tb-fname{font-size:11px;color:rgba(255,255,255,.4);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* Canvas + overlay area */
.canvas-area{flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;padding:28px 24px;min-height:0;position:relative}
.canvas-area::-webkit-scrollbar{width:8px;height:8px}
.canvas-area::-webkit-scrollbar-track{background:transparent}
.canvas-area::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:4px}
.canvas-area::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.2)}

.page-wrap{position:relative;flex-shrink:0;box-shadow:0 8px 40px rgba(0,0,0,.7),0 2px 8px rgba(0,0,0,.5);border-radius:2px;line-height:0;user-select:none}
.pdf-canvas{display:block;border-radius:2px}

/* Crop overlay */
.crop-overlay{position:absolute;inset:0;overflow:hidden}
.mask{position:absolute;background:rgba(0,0,0,.52)}
.crop-box{position:absolute;cursor:move}
.crop-border{position:absolute;inset:0;border:2px solid rgba(255,255,255,.9);box-shadow:0 0 0 1px rgba(0,0,0,.5),inset 0 0 0 1px rgba(0,0,0,.15);pointer-events:none}

/* Rule-of-thirds grid lines */
.grid-line{position:absolute;background:rgba(255,255,255,.2);pointer-events:none}
.grid-h{left:0;right:0;height:1px}
.grid-v{top:0;bottom:0;width:1px}

/* Resize handles */
.handle{position:absolute;width:10px;height:10px;background:#fff;border:1.5px solid rgba(0,0,0,.4);border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.handle-tl{top:-5px;left:-5px;cursor:nw-resize}
.handle-t {top:-5px;left:calc(50% - 5px);cursor:n-resize}
.handle-tr{top:-5px;right:-5px;cursor:ne-resize}
.handle-r {top:calc(50% - 5px);right:-5px;cursor:e-resize}
.handle-br{bottom:-5px;right:-5px;cursor:se-resize}
.handle-b {bottom:-5px;left:calc(50% - 5px);cursor:s-resize}
.handle-bl{bottom:-5px;left:-5px;cursor:sw-resize}
.handle-l {top:calc(50% - 5px);left:-5px;cursor:w-resize}

/* Render spinner */
.render-spin-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.render-spin{width:24px;height:24px;border:2px solid rgba(255,255,255,.15);border-top-color:rgba(255,255,255,.55);border-radius:50%;animation:spin .7s linear infinite}

/* Bottom info bar */
.info-bar{height:44px;background:#232323;border-top:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 16px;gap:16px;flex-shrink:0;overflow-x:auto;scrollbar-width:none}
.info-bar::-webkit-scrollbar{display:none}
.info-item{display:flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0}
.info-label{font-size:10px;font-weight:700;letter-spacing:.06em;color:rgba(255,255,255,.3);text-transform:uppercase}
.info-val{font-size:12px;font-weight:600;color:rgba(255,255,255,.7);font-variant-numeric:tabular-nums}
.info-sep{width:1px;height:16px;background:rgba(255,255,255,.1);flex-shrink:0}

/* Apply-to toggle */
.apply-wrap{display:flex;gap:3px;background:rgba(255,255,255,.06);border-radius:7px;padding:2px}
.apply-btn{padding:4px 10px;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;color:rgba(255,255,255,.45);transition:all .14s;letter-spacing:-.01em}
.apply-btn.on{background:rgba(255,255,255,.12);color:#fff}
.apply-btn:hover:not(.on){color:rgba(255,255,255,.75)}

@media(max-width:600px){
  .canvas-area{padding:12px 8px}
  .tb-fname{display:none}
  .tb-btn{padding:0 7px;font-size:11px}
  .info-bar{gap:10px;padding:0 10px}
}
`

// ─── PDF.js CDN loader ────────────────────────────────────────────────────────
let pdfjs: any = null
async function loadPDFJS(): Promise<any> {
  if (pdfjs) return pdfjs
  if ((window as any).pdfjsLib) {
    pdfjs = (window as any).pdfjsLib; return pdfjs
  }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error('Failed to load PDF.js'))
    document.head.appendChild(s)
  })
  pdfjs = (window as any).pdfjsLib
  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  return pdfjs
}

// ─── Types ───────────────────────────────────────────────────────────────────
// All crop coordinates normalized 0–1 (relative to page size)
interface Crop { x: number; y: number; w: number; h: number }

type DragHandle = 'tl'|'t'|'tr'|'r'|'br'|'b'|'bl'|'l'|'move'|'draw'

const DEFAULT_CROP: Crop = { x: 0.05, y: 0.05, w: 0.90, h: 0.90 }
const MIN_NORM = 0.02

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

// ─── PDF generation ───────────────────────────────────────────────────────────
async function cropPDF(
  fileBytes: ArrayBuffer,
  applyToAll: boolean,
  globalCrop: Crop,
  pageCrops: Record<number, Crop>,
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib')
  const pdfDoc = await PDFDocument.load(fileBytes)
  const pages  = pdfDoc.getPages()

  for (let idx = 0; idx < pages.length; idx++) {
    const c = applyToAll ? globalCrop : (pageCrops[idx + 1] ?? null)
    if (!c) continue
    const page = pages[idx]
    const { width: pw, height: ph } = page.getSize()

    // Convert normalized (top-left origin) → PDF points (bottom-left origin)
    const left   = c.x * pw
    const bottom = (1 - c.y - c.h) * ph
    const boxW   = c.w * pw
    const boxH   = c.h * ph

    page.setCropBox(left, bottom, boxW, boxH)
  }

  return pdfDoc.save()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(b: number) {
  return b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
}
function pct(v: number) { return `${Math.round(v * 1000) / 10}%` }
function triggerDownload(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type:'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href=url; a.download=name; a.click()
  URL.revokeObjectURL(url)
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const CropIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white" fillOpacity=".9"/>
    <polyline points="14 2 14 8 20 8" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" fill="none"/>
    <rect x="7" y="10" width="8" height="7" rx="1" stroke="rgba(255,255,255,.8)" strokeWidth="1.4" fill="rgba(255,255,255,.15)" strokeDasharray="2 1"/>
  </svg>
)

// ─── Component ───────────────────────────────────────────────────────────────
export default function PDFCropperPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [fileBytes,   setFileBytes]   = useState<ArrayBuffer | null>(null)
  const [pdfDoc,        setPdfDoc]        = useState<any>(null)
  const [renderTrigger, setRenderTrigger] = useState(0)   // bumped to force re-render
  const [currentPage,   setCurrentPage]   = useState(1)
  const [totalPages,  setTotalPages]  = useState(0)
  const [pdfDims,     setPdfDims]     = useState({ w: 595, h: 842 }) // points
  const [globalCrop,  setGlobalCrop]  = useState<Crop>(DEFAULT_CROP)
  const [pageCrops,   setPageCrops]   = useState<Record<number, Crop>>({})
  const [applyToAll,  setApplyToAll]  = useState(true)
  const [pageInput,   setPageInput]   = useState('1')
  const [isDrop,      setIsDrop]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [rendering,   setRendering]   = useState(false)
  const [converting,  setConverting]  = useState(false)
  const [error,       setError]       = useState('')

  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const renderTaskRef = useRef<any>(null)
  // Keep doc in a ref so the async render always reads the live object, not a stale closure
  const pdfDocRef     = useRef<any>(null)

  // Drag state (refs to avoid stale closures in global listeners)
  const dragRef = useRef<{
    handle: DragHandle
    startNX: number; startNY: number
    startCrop: Crop
  } | null>(null)

  // Derived crop for the current page
  const crop = applyToAll ? globalCrop : (pageCrops[currentPage] ?? DEFAULT_CROP)

  // Stable ref so drag handlers always call the right setter without stale closures
  const setCropRef = useRef<(c: Crop) => void>(() => {})
  useEffect(() => {
    setCropRef.current = (c: Crop) => {
      if (applyToAll) setGlobalCrop(c)
      else setPageCrops(prev => ({ ...prev, [currentPage]: c }))
    }
  }, [applyToAll, currentPage])

  // ── Render page ────────────────────────────────────────────────────────────
  useEffect(() => {
    const doc = pdfDocRef.current   // always the live object — never stale
    const pageNum = currentPage     // snapshot for this run
    if (!doc) return

    let cancelled = false

    // Cancel any in-flight render immediately
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel() } catch {}
      renderTaskRef.current = null
    }

    // Clear canvas so the old page doesn't persist
    const existingCanvas = canvasRef.current
    if (existingCanvas) {
      const ctx2d = existingCanvas.getContext('2d')
      if (ctx2d) ctx2d.clearRect(0, 0, existingCanvas.width, existingCanvas.height)
    }

    setRendering(true)
    setError('')

    ;(async () => {
      try {
        const page = await doc.getPage(pageNum)
        if (cancelled) return

        const vp1 = page.getViewport({ scale: 1 })
        if (!cancelled) setPdfDims({ w: vp1.width, h: vp1.height })

        const container = containerRef.current
        const avail  = container && container.clientWidth  > 0
          ? Math.max(container.clientWidth  - 56, 300)
          : Math.max((window.innerWidth  || 800) - 56, 300)
        const availH = container && container.clientHeight > 0
          ? Math.max(container.clientHeight - 56, 300)
          : Math.max((window.innerHeight  || 700) - 160, 300)

        const scale = Math.min(avail / vp1.width, availH / vp1.height, 2.5)
        const vp    = page.getViewport({ scale })
        const dpr   = window.devicePixelRatio || 1

        const canvas = canvasRef.current
        if (!canvas || cancelled) return

        const ctx = canvas.getContext('2d')!
        canvas.width  = Math.round(vp.width  * dpr)
        canvas.height = Math.round(vp.height * dpr)
        canvas.style.width  = `${Math.round(vp.width)}px`
        canvas.style.height = `${Math.round(vp.height)}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const rt = page.render({ canvasContext: ctx, viewport: vp })
        renderTaskRef.current = rt
        await rt.promise
        if (!cancelled) setRendering(false)
      } catch (e: any) {
        if (cancelled || e?.name === 'RenderingCancelledException') return
        setError(`Page ${pageNum} failed: ${(e as any)?.message ?? e}`)
        setRendering(false)
      }
    })()

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderTrigger, currentPage])   // renderTrigger bumps when a new PDF loads

  // ── Drag logic ─────────────────────────────────────────────────────────────
  const normFromEvent = useCallback((clientX: number, clientY: number) => {
    const rect = overlayRef.current?.getBoundingClientRect()
    if (!rect) return { nx: 0, ny: 0 }
    return {
      nx: clamp((clientX - rect.left) / rect.width,  0, 1),
      ny: clamp((clientY - rect.top)  / rect.height, 0, 1),
    }
  }, [])

  const startDrag = useCallback((
    handle: DragHandle, clientX: number, clientY: number, currentCrop: Crop,
  ) => {
    const { nx, ny } = normFromEvent(clientX, clientY)
    dragRef.current = { handle, startNX: nx, startNY: ny, startCrop: { ...currentCrop } }
  }, [normFromEvent])

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    const d = dragRef.current
    if (!d) return
    const { nx, ny } = normFromEvent(clientX, clientY)
    const dx = nx - d.startNX
    const dy = ny - d.startNY
    const sc = d.startCrop

    let c: Crop = { ...sc }

    switch (d.handle) {
      case 'move': {
        c.x = clamp(sc.x + dx, 0, 1 - sc.w)
        c.y = clamp(sc.y + dy, 0, 1 - sc.h)
        break
      }
      case 'tl': {
        const nx2 = clamp(sc.x + dx, 0, sc.x + sc.w - MIN_NORM)
        const ny2 = clamp(sc.y + dy, 0, sc.y + sc.h - MIN_NORM)
        c = { x: nx2, y: ny2, w: sc.x + sc.w - nx2, h: sc.y + sc.h - ny2 }
        break
      }
      case 'tr': {
        const ny2 = clamp(sc.y + dy, 0, sc.y + sc.h - MIN_NORM)
        c = { x: sc.x, y: ny2, w: clamp(sc.w + dx, MIN_NORM, 1 - sc.x), h: sc.y + sc.h - ny2 }
        break
      }
      case 'bl': {
        const nx2 = clamp(sc.x + dx, 0, sc.x + sc.w - MIN_NORM)
        c = { x: nx2, y: sc.y, w: sc.x + sc.w - nx2, h: clamp(sc.h + dy, MIN_NORM, 1 - sc.y) }
        break
      }
      case 'br': {
        c = { ...sc, w: clamp(sc.w + dx, MIN_NORM, 1 - sc.x), h: clamp(sc.h + dy, MIN_NORM, 1 - sc.y) }
        break
      }
      case 't': {
        const ny2 = clamp(sc.y + dy, 0, sc.y + sc.h - MIN_NORM)
        c = { ...sc, y: ny2, h: sc.y + sc.h - ny2 }
        break
      }
      case 'b': {
        c = { ...sc, h: clamp(sc.h + dy, MIN_NORM, 1 - sc.y) }
        break
      }
      case 'l': {
        const nx2 = clamp(sc.x + dx, 0, sc.x + sc.w - MIN_NORM)
        c = { ...sc, x: nx2, w: sc.x + sc.w - nx2 }
        break
      }
      case 'r': {
        c = { ...sc, w: clamp(sc.w + dx, MIN_NORM, 1 - sc.x) }
        break
      }
      case 'draw': {
        const x1 = Math.min(d.startNX, nx), x2 = Math.max(d.startNX, nx)
        const y1 = Math.min(d.startNY, ny), y2 = Math.max(d.startNY, ny)
        c = {
          x: clamp(x1, 0, 1),
          y: clamp(y1, 0, 1),
          w: clamp(x2 - x1, MIN_NORM, 1),
          h: clamp(y2 - y1, MIN_NORM, 1),
        }
        break
      }
    }

    setCropRef.current(c)
  }, [normFromEvent])

  // Global mouse/touch up
  useEffect(() => {
    const onUp = () => { dragRef.current = null }
    const onMove = (e: MouseEvent) => { if (dragRef.current) updateDrag(e.clientX, e.clientY) }
    const onTouchMove = (e: TouchEvent) => {
      if (dragRef.current && e.touches[0]) {
        e.preventDefault()
        updateDrag(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onUp)
    }
  }, [updateDrag])

  // ── Overlay mousedown — determine what was hit ─────────────────────────────
  const onOverlayDown = useCallback((e: React.MouseEvent | React.TouchEvent, forceDraw = false) => {
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const { nx, ny } = normFromEvent(clientX, clientY)

    if (forceDraw) {
      startDrag('draw', clientX, clientY, crop)
      setCropRef.current({ x: nx, y: ny, w: MIN_NORM, h: MIN_NORM })
      dragRef.current!.startCrop = { x: nx, y: ny, w: MIN_NORM, h: MIN_NORM }
      return
    }

    const insideX = nx >= crop.x && nx <= crop.x + crop.w
    const insideY = ny >= crop.y && ny <= crop.y + crop.h

    if (!insideX || !insideY) {
      startDrag('draw', clientX, clientY, crop)
      setCropRef.current({ x: nx, y: ny, w: MIN_NORM, h: MIN_NORM })
      dragRef.current!.startCrop = { x: nx, y: ny, w: MIN_NORM, h: MIN_NORM }
      return
    }

    startDrag('move', clientX, clientY, crop)
  }, [crop, normFromEvent, startDrag])

  const handleMouseDown = useCallback((handle: DragHandle) =>
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      startDrag(handle, clientX, clientY, crop)
    }, [crop, startDrag])

  // ── Load PDF ───────────────────────────────────────────────────────────────
  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') {
      setError('Please upload a PDF file.'); return
    }
    setError(''); setLoading(true); setPdfDoc(null)
    try {
      const lib  = await loadPDFJS()
      const buf  = await f.arrayBuffer()
      const doc  = await lib.getDocument({ data: buf.slice(0) }).promise
      pdfDocRef.current = doc          // set ref before triggering render
      setFile(f)
      setFileBytes(buf)
      setPdfDoc(doc)
      setTotalPages(doc.numPages)
      setCurrentPage(1); setPageInput('1')
      setGlobalCrop(DEFAULT_CROP); setPageCrops({})
      setRenderTrigger(t => t + 1)    // guarantees render effect fires even if page stays at 1
    } catch (e: any) {
      setError(e?.message ?? 'Could not open the PDF.')
    } finally {
      setLoading(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  // ── Download ───────────────────────────────────────────────────────────────
  const download = async () => {
    if (!fileBytes || !file) return
    setConverting(true); setError('')
    try {
      const bytes = await cropPDF(fileBytes.slice(0), applyToAll, globalCrop, pageCrops)
      triggerDownload(bytes, file.name.replace(/\.pdf$/i, '') + '_cropped.pdf')
    } catch (e: any) {
      setError(e?.message ?? 'Could not apply crop.')
    } finally {
      setConverting(false)
    }
  }

  // ── Page nav ───────────────────────────────────────────────────────────────
  const goTo = (val: string) => {
    const n = parseInt(val)
    if (!isNaN(n) && n >= 1 && n <= totalPages) { setCurrentPage(n); setPageInput(String(n)) }
    else setPageInput(String(currentPage))
  }
  const prev = () => { const p = Math.max(currentPage-1,1); setCurrentPage(p); setPageInput(String(p)) }
  const next = () => { const p = Math.min(currentPage+1,totalPages); setCurrentPage(p); setPageInput(String(p)) }

  // ── Auto trim — scan canvas pixels to find content bounds ────────────────
  const autoTrim = useCallback((padding = 0.01) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width: W, height: H } = canvas
    const data = ctx.getImageData(0, 0, W, H).data

    // A pixel is "background" if it's near-white or fully transparent
    const isBg = (i: number) => {
      const a = data[i + 3]
      if (a < 15) return true
      return data[i] >= 245 && data[i+1] >= 245 && data[i+2] >= 245
    }

    let top = 0, bottom = H - 1, left = 0, right = W - 1
    let found = false

    // top edge
    found = false
    for (let y = 0; y < H && !found; y++)
      for (let x = 0; x < W; x++)
        if (!isBg((y * W + x) * 4)) { top = y; found = true; break }

    // bottom edge
    found = false
    for (let y = H - 1; y >= 0 && !found; y--)
      for (let x = 0; x < W; x++)
        if (!isBg((y * W + x) * 4)) { bottom = y; found = true; break }

    // left edge (scan between top/bottom for speed)
    found = false
    for (let x = 0; x < W && !found; x++)
      for (let y = top; y <= bottom; y++)
        if (!isBg((y * W + x) * 4)) { left = x; found = true; break }

    // right edge
    found = false
    for (let x = W - 1; x >= 0 && !found; x--)
      for (let y = top; y <= bottom; y++)
        if (!isBg((y * W + x) * 4)) { right = x; found = true; break }

    if (right <= left || bottom <= top) return // no content found

    // Convert to normalized, then add padding
    const nx = clamp(left   / W - padding, 0, 1)
    const ny = clamp(top    / H - padding, 0, 1)
    const nw = clamp((right  - left) / W + padding * 2, MIN_NORM, 1 - nx)
    const nh = clamp((bottom - top)  / H + padding * 2, MIN_NORM, 1 - ny)
    setCropRef.current({ x: nx, y: ny, w: nw, h: nh })
  }, [])

  // Close — return to upload screen
  const reset = () => {
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel() } catch {} }
    pdfDocRef.current = null
    setFile(null); setFileBytes(null); setPdfDoc(null)
    setCurrentPage(1); setTotalPages(0); setPageInput('1')
    setGlobalCrop(DEFAULT_CROP); setPageCrops({}); setError('')
  }

  // Reset crop for the current context (this page or global)
  const resetCrop = () => { setCropRef.current(DEFAULT_CROP) }

  // Toggle "Apply to All" ↔ "This Page"
  const toggleApplyToAll = (toAll: boolean) => {
    if (toAll === applyToAll) return
    if (toAll) {
      // Use current page's crop as the new global crop
      setGlobalCrop(pageCrops[currentPage] ?? DEFAULT_CROP)
      setApplyToAll(true)
    } else {
      // Seed per-page crops from global for pages not yet customised
      setPageCrops(prev => {
        const next: Record<number, Crop> = {}
        for (let i = 1; i <= totalPages; i++) next[i] = prev[i] ?? globalCrop
        return next
      })
      setApplyToAll(false)
    }
  }

  const hasPDF = !!pdfDoc

  // Computed crop info
  const cropLeftPt   = Math.round(crop.x * pdfDims.w)
  const cropTopPt    = Math.round(crop.y * pdfDims.h)
  const cropWidthPt  = Math.round(crop.w * pdfDims.w)
  const cropHeightPt = Math.round(crop.h * pdfDims.h)

  // CSS percentages for the crop overlay
  const ox = crop.x * 100, oy = crop.y * 100, ow = crop.w * 100, oh = crop.h * 100

  const spin = <div style={{width:12,height:12,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',flexShrink:0}}/>

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        {loading ? (
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
              <div className="badge"><span className="badge-dot"/>In-Browser · No Upload</div>
              <h1>PDF <em>Cropper</em></h1>
              <p>Drag the crop handles to define your trim area, then download the cropped PDF. Apply to one page or all pages at once.</p>
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
                  <div className="drop-icon-wrap"><CropIcon/></div>
                  <h2>Drop a PDF to crop</h2>
                  <p>Drag crop handles on any page — then download your trimmed PDF</p>
                  <button className="browse-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Choose PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ── Cropper UI ── */
          <div className="cropper">

            {/* Toolbar */}
            <div className="toolbar">
              <div className="tb-l">
                <button className="tb-btn" onClick={reset}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Close
                </button>
                <div className="tb-sep"/>
                <span className="tb-fname" title={file?.name}>{file?.name}</span>
                <span style={{fontSize:10,color:'rgba(255,255,255,.25)',marginLeft:4}}>{fmt(file?.size??0)}</span>
              </div>

              <div className="tb-c">
                {totalPages > 1 && (
                  <div className="page-ctrl">
                    <button className="tb-btn" onClick={prev} disabled={currentPage<=1}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <input
                      className="page-input"
                      value={pageInput}
                      onChange={e => setPageInput(e.target.value)}
                      onBlur={e => goTo(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && goTo(pageInput)}
                    />
                    <span className="page-total">of {totalPages}</span>
                    <button className="tb-btn" onClick={next} disabled={currentPage>=totalPages}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="tb-r">
                <button
                  className="tb-btn"
                  onClick={() => autoTrim()}
                  disabled={!pdfDoc}
                  title="Auto-detect content bounds and trim white margins"
                  style={{gap:4}}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2v4m0 0a2 2 0 100 4 2 2 0 000-4zm0 4h10M14 2v4m0 0a2 2 0 100 4 2 2 0 000-4zm0 4v12m-8 4l16-16"/></svg>
                  Auto Trim
                </button>
                <button
                  className="tb-btn danger"
                  onClick={resetCrop}
                  title="Reset crop to default"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                  Reset
                </button>
                <div className="tb-sep"/>
                <span style={{fontSize:10,color:'rgba(255,255,255,.35)',letterSpacing:'.04em',whiteSpace:'nowrap'}}>APPLY TO</span>
                <div className="apply-wrap">
                  <button className={`apply-btn${applyToAll?' on':''}`} onClick={() => toggleApplyToAll(true)}>All pages</button>
                  <button className={`apply-btn${!applyToAll?' on':''}`} onClick={() => toggleApplyToAll(false)}>This page</button>
                </div>
                <div className="tb-sep"/>
                <button
                  className="tb-btn accent"
                  onClick={download}
                  disabled={converting}
                  style={{minWidth:120}}
                >
                  {converting ? <>{spin} Cropping…</> : <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PDF
                  </>}
                </button>
              </div>
            </div>

            {/* Canvas + crop overlay */}
            <div className="canvas-area" ref={containerRef}>
              {rendering && (
                <div className="render-spin-wrap">
                  <div className="render-spin"/>
                </div>
              )}

              <div className="page-wrap">
                <canvas ref={canvasRef} className="pdf-canvas"/>

                {/* Crop overlay — sits exactly over the canvas */}
                <div
                  className="crop-overlay"
                  ref={overlayRef}
                  onMouseDown={e => onOverlayDown(e)}
                  onTouchStart={e => onOverlayDown(e)}
                  style={{ cursor: 'crosshair' }}
                >
                  {/* 4 dark mask divs */}
                  <div className="mask" style={{ top:0, left:0, right:0, height:`${oy}%` }}/>
                  <div className="mask" style={{ top:`${oy+oh}%`, left:0, right:0, bottom:0 }}/>
                  <div className="mask" style={{ top:`${oy}%`, left:0, width:`${ox}%`, height:`${oh}%` }}/>
                  <div className="mask" style={{ top:`${oy}%`, left:`${ox+ow}%`, right:0, height:`${oh}%` }}/>

                  {/* Crop box */}
                  <div
                    className="crop-box"
                    style={{ top:`${oy}%`, left:`${ox}%`, width:`${ow}%`, height:`${oh}%` }}
                    onMouseDown={e => { e.stopPropagation(); handleMouseDown('move')(e) }}
                    onTouchStart={e => { e.stopPropagation(); handleMouseDown('move')(e) }}
                  >
                    {/* Border */}
                    <div className="crop-border"/>

                    {/* Rule-of-thirds grid */}
                    <div className="grid-line grid-h" style={{ top:'33.33%' }}/>
                    <div className="grid-line grid-h" style={{ top:'66.66%' }}/>
                    <div className="grid-line grid-v" style={{ left:'33.33%' }}/>
                    <div className="grid-line grid-v" style={{ left:'66.66%' }}/>

                    {/* 8 resize handles */}
                    {([
                      ['tl','handle-tl'],['t','handle-t'],['tr','handle-tr'],
                      ['r','handle-r'],  ['br','handle-br'],['b','handle-b'],
                      ['bl','handle-bl'],['l','handle-l'],
                    ] as [DragHandle, string][]).map(([id, cls]) => (
                      <div
                        key={id}
                        className={`handle ${cls}`}
                        onMouseDown={e => { e.stopPropagation(); handleMouseDown(id)(e) }}
                        onTouchStart={e => { e.stopPropagation(); handleMouseDown(id)(e) }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Info bar */}
            <div className="info-bar">
              {error && (
                <span style={{fontSize:11,color:'#ff6060',flexShrink:0}}>⚠ {error}</span>
              )}
              <div className="info-item">
                <span className="info-label">Left</span>
                <span className="info-val">{pct(crop.x)}</span>
              </div>
              <div className="info-sep"/>
              <div className="info-item">
                <span className="info-label">Top</span>
                <span className="info-val">{pct(crop.y)}</span>
              </div>
              <div className="info-sep"/>
              <div className="info-item">
                <span className="info-label">Right</span>
                <span className="info-val">{pct(1 - crop.x - crop.w)}</span>
              </div>
              <div className="info-sep"/>
              <div className="info-item">
                <span className="info-label">Bottom</span>
                <span className="info-val">{pct(1 - crop.y - crop.h)}</span>
              </div>
              <div className="info-sep"/>
              <div className="info-item">
                <span className="info-label">Output</span>
                <span className="info-val">{cropWidthPt} × {cropHeightPt} pt</span>
              </div>
              <div className="info-sep"/>
              <div className="info-item">
                <span className="info-label">Offset</span>
                <span className="info-val">{cropLeftPt}, {cropTopPt} pt</span>
              </div>
              <div style={{flex:1}}/>
              {!applyToAll && (
                <>
                  <div className="info-sep"/>
                  <div className="info-item">
                    <span className="info-label">Page crop</span>
                    <span className="info-val" style={{color: pageCrops[currentPage] ? '#14b8a6' : 'rgba(255,255,255,.35)'}}>
                      {pageCrops[currentPage] ? 'Custom' : 'Default'}
                    </span>
                  </div>
                  <div className="info-sep"/>
                  <div className="info-item">
                    <span className="info-label">Cropped</span>
                    <span className="info-val">{Object.keys(pageCrops).length} / {totalPages} pages</span>
                  </div>
                </>
              )}
              <div className="info-sep"/>
              <div className="info-item">
                <span style={{fontSize:10,color:'rgba(255,255,255,.2)'}}>
                  {applyToAll ? 'One crop applied to all pages' : 'Each page keeps its own crop'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef} type="file" accept=".pdf,application/pdf"
        style={{display:'none'}}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value='' }}
      />
      <ToolSEOSection {...toolSeoData['pdf-cropper']} />
    </>
  )
}
