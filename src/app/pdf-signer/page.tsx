'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

type SignMode = 'draw' | 'type' | 'upload'

interface SavedSig  { id: string; dataUrl: string; createdAt: number }
interface PlacedSig {
  id: string; dataUrl: string; page: number
  x: number; y: number; w: number; h: number
  rotation: number; dateStamp: boolean; dateText: string
}

const CURSIVE_FONTS = [
  { id: 'Dancing Script', label: 'Cursive'  },
  { id: 'Pacifico',       label: 'Flowing'  },
  { id: 'Sacramento',     label: 'Elegant'  },
  { id: 'Satisfy',        label: 'Smooth'   },
  { id: 'Great Vibes',    label: 'Fancy'    },
]

const INK_COLORS = [
  '#111111', '#1a3fa0', '#16a34a', '#dc2626',
  '#7c3aed', '#0891b2', '#92400e', '#be185d',
]

const STROKE_SIZES = [
  { val: 1.5, label: 'XS' },
  { val: 3,   label: 'S'  },
  { val: 5,   label: 'M'  },
  { val: 8,   label: 'L'  },
  { val: 12,  label: 'XL' },
]

const uid = () => Math.random().toString(36).slice(2, 10)

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&family=Sacramento&family=Satisfy&family=Great+Vibes&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}

/* Page shell */
.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

/* Nav */

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#0D1B4B;letter-spacing:-.03em}
.logo-name .logo-ai{background:linear-gradient(90deg,#4F7FFA,#8B3FEC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-left:2px}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-file{font-size:11px;color:rgba(0,0,0,.38);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s;white-space:nowrap}
.nbtn.pri{background:#6366f1;color:#fff}
.nbtn.pri:hover{background:#4f46e5}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}
.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.38;cursor:not-allowed}
.sign-fab{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:9px;border:none;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 2px 10px rgba(99,102,241,.4);transition:all .14s}
.sign-fab:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(99,102,241,.5)}

/* Body layout */
.body{flex:1;display:flex;overflow:hidden}

/* Thumbnail sidebar */
.thumbs{width:86px;flex-shrink:0;background:#f5f5f7;border-right:1px solid #e8e8e8;overflow-y:auto;padding:8px 6px;display:flex;flex-direction:column;gap:6px}
.thumb{border-radius:6px;overflow:hidden;border:2px solid transparent;cursor:pointer;transition:border-color .12s;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.thumb.act{border-color:#6366f1}
.thumb img{width:100%;display:block}
.thumb-n{font-size:9px;font-weight:700;color:rgba(0,0,0,.38);text-align:center;padding:2px 0 3px}

/* Canvas area */
.canvas-area{flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;padding:20px;gap:16px;background:#e8e8ea;min-height:0;position:relative}
.page-wrap{position:relative;display:inline-block;box-shadow:0 4px 32px rgba(0,0,0,.18);border-radius:2px;line-height:0;flex-shrink:0}
.page-wrap canvas{display:block}
.page-lbl{font-size:10px;font-weight:600;color:rgba(0,0,0,.38);text-align:center;margin-top:6px}

/* Saved sigs bar in canvas */
.saved-bar{position:sticky;top:0;z-index:10;align-self:stretch;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border:1px solid #e8e8e8;border-radius:10px;padding:7px 10px;display:flex;align-items:center;gap:8px;flex-shrink:0}
.saved-bar-lbl{font-size:10px;font-weight:700;color:rgba(0,0,0,.35);white-space:nowrap;text-transform:uppercase;letter-spacing:.05em}
.saved-chip{display:flex;align-items:center;gap:5px;padding:4px 8px;border:1.5px solid #e0e0e0;border-radius:7px;background:#fff;cursor:pointer;transition:all .12s}
.saved-chip:hover{border-color:#6366f1;background:#f0f0ff}
.saved-chip img{height:22px;max-width:60px;object-fit:contain}
.saved-chip-del{width:14px;height:14px;border-radius:50%;border:none;background:rgba(0,0,0,.12);color:rgba(0,0,0,.4);cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;transition:all .1s}
.saved-chip-del:hover{background:#E24B4A;color:#fff}

/* Placed sig overlay */
.sig-ov{position:absolute;cursor:move;user-select:none}
.sig-ov img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none}
.sig-ov.sel{outline:2px solid #6366f1;outline-offset:2px}
.sig-del{position:absolute;top:-10px;right:-10px;width:20px;height:20px;border-radius:50%;background:#E24B4A;border:2px solid #fff;color:#fff;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;box-shadow:0 2px 5px rgba(0,0,0,.25);line-height:1}
.sig-resize{position:absolute;bottom:-5px;right:-5px;width:10px;height:10px;background:#6366f1;border:2px solid #fff;border-radius:2px;cursor:se-resize;z-index:10}
.sig-rot{position:absolute;top:-24px;left:50%;transform:translateX(-50%);width:18px;height:18px;background:#fff;border:1.5px solid #6366f1;border-radius:50%;cursor:grab;display:flex;align-items:center;justify-content:center;font-size:10px;z-index:10;line-height:1}
.sig-date{position:absolute;bottom:-17px;left:0;font-size:9px;color:rgba(0,0,0,.45);white-space:nowrap;pointer-events:none;font-weight:500}

/* Right panel */
.right{width:214px;flex-shrink:0;background:#fff;border-left:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.rp-sec{padding:11px 13px;border-bottom:1px solid #f0f0f0}
.rp-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.rp-row{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:5px}
.rp-lbl{font-size:11px;color:rgba(0,0,0,.5);white-space:nowrap}
.rp-num{width:65px;padding:4px 7px;border:1px solid #e0e0e0;border-radius:5px;font-size:11px;color:#1d1d1f;text-align:right;outline:none}
.rp-num:focus{border-color:#6366f1}
.rp-sld{width:100%;accent-color:#6366f1;cursor:pointer}
.tog{width:30px;height:17px;border-radius:8px;border:none;cursor:pointer;position:relative;transition:background .14s;flex-shrink:0}
.tog.on{background:#6366f1}.tog.off{background:#d0d0d0}
.tok{position:absolute;top:2px;width:13px;height:13px;border-radius:50%;background:#fff;transition:left .14s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tog.on .tok{left:15px}.tog.off .tok{left:2px}
.rp-empty{padding:28px 14px;text-align:center;font-size:11px;color:rgba(0,0,0,.28);line-height:1.7;font-style:italic}

/* ── Modal ── */
.modal-back{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:#fff;border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.22);width:100%;max-width:620px;display:flex;flex-direction:column;overflow:hidden;max-height:calc(100vh - 40px)}
.modal-head{padding:16px 20px 12px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:10px;flex-shrink:0}
.modal-title{font-size:15px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em;flex:1}
.modal-close{width:28px;height:28px;border-radius:50%;border:none;background:#f0f0f0;color:#555;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .12s;flex-shrink:0}
.modal-close:hover{background:#e0e0e0;color:#111}

/* mode tabs inside modal */
.m-tabs{display:flex;border-bottom:1px solid #f0f0f0;flex-shrink:0;padding:0 20px}
.m-tab{padding:9px 16px;font-size:12px;font-weight:700;border:none;background:none;cursor:pointer;color:rgba(0,0,0,.38);border-bottom:2px solid transparent;transition:all .13s;margin-bottom:-1px}
.m-tab.act{color:#6366f1;border-bottom-color:#6366f1}

/* modal body scroll */
.modal-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;min-height:0}

/* draw canvas */
.draw-wrap{border:2px dashed #d0d0d0;border-radius:10px;background:repeating-linear-gradient(45deg,#f8f8f8 0,#f8f8f8 4px,#fff 4px,#fff 14px);position:relative;overflow:hidden;height:180px;cursor:crosshair;flex-shrink:0}
.draw-wrap canvas{display:block;width:100%;height:100%}
.draw-hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:rgba(0,0,0,.25);pointer-events:none;font-style:italic;gap:6px}

/* color palette */
.palette{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.palette-swatch{width:22px;height:22px;border-radius:50%;border:2.5px solid transparent;cursor:pointer;transition:border-color .11s,transform .11s;flex-shrink:0}
.palette-swatch.sel{border-color:#6366f1;transform:scale(1.18)}
.palette-swatch:hover:not(.sel){transform:scale(1.1)}
.color-pick{width:22px;height:22px;border-radius:50%;border:2px dashed #d0d0d0;cursor:pointer;padding:0;background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red);overflow:hidden;flex-shrink:0}
.color-pick input{opacity:0;width:100%;height:100%;cursor:pointer;position:absolute;inset:0}

/* stroke sizes */
.strokes{display:flex;gap:7px;align-items:center}
.stroke-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:7px 10px;border-radius:8px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;transition:all .12s;min-width:40px}
.stroke-btn.sel{border-color:#6366f1;background:#f0f0ff}
.stroke-btn:hover:not(.sel){border-color:#bbb}
.stroke-preview{border-radius:99px;background:#1d1d1f;flex-shrink:0}
.stroke-lbl{font-size:9px;font-weight:700;color:rgba(0,0,0,.35);text-transform:uppercase}

/* type mode */
.type-input{width:100%;padding:10px 13px;border:1.5px solid #e0e0e0;border-radius:9px;font-size:15px;outline:none;color:#1d1d1f;transition:border-color .13s;font-family:inherit}
.type-input:focus{border-color:#6366f1}
.font-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}
.font-btn{padding:10px 6px;border-radius:9px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;transition:all .12s;text-align:center;overflow:hidden}
.font-btn.sel{border-color:#6366f1;background:#f0f0ff}
.font-btn:hover:not(.sel){border-color:#bbb}
.fp{font-size:20px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fn{font-size:9px;font-weight:700;color:rgba(0,0,0,.32);text-transform:uppercase;letter-spacing:.05em;margin-top:2px}
.type-prev{border:1.5px dashed #d0d0d0;border-radius:9px;background:#fafafa;padding:18px;text-align:center;min-height:80px;display:flex;align-items:center;justify-content:center}

/* upload mode */
.drop-z{border:2px dashed #d0d0d0;border-radius:10px;padding:36px 20px;text-align:center;cursor:pointer;background:#fafafa;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:7px}
.drop-z:hover,.drop-z.over{border-color:#6366f1;background:#f0f0ff}
.up-prev{border:1px solid #e0e0e0;border-radius:9px;background:#fff;padding:10px;display:flex;align-items:center;justify-content:center;min-height:100px}
.up-prev img{max-width:100%;max-height:120px;object-fit:contain;display:block}
.bg-btn{width:100%;padding:9px;border-radius:8px;border:1px solid #e0e0e0;background:#fff;font-size:11px;font-weight:700;cursor:pointer;color:#6366f1;transition:all .12s}
.bg-btn:hover{background:#f0f0ff;border-color:#6366f1}

/* modal footer */
.modal-foot{padding:12px 20px;border-top:1px solid #f0f0f0;display:flex;align-items:center;gap:8px;flex-shrink:0}
.m-cancel{padding:9px 16px;border-radius:8px;border:1px solid #e0e0e0;background:#fff;font-size:12px;font-weight:700;cursor:pointer;color:rgba(0,0,0,.5);transition:all .12s}
.m-cancel:hover{border-color:#bbb;color:#1d1d1f}
.m-save{padding:9px 16px;border-radius:8px;border:1px solid #e0e0e0;background:#fff;font-size:12px;font-weight:700;cursor:pointer;color:#6366f1;transition:all .12s;display:flex;align-items:center;gap:5px}
.m-save:hover:not(:disabled){border-color:#6366f1;background:#f0f0ff}
.m-place{flex:1;padding:9px 16px;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:background .14s}
.m-place:hover:not(:disabled){background:#4f46e5}
.m-place:disabled,.m-save:disabled{opacity:.38;cursor:not-allowed}
.clear-lnk{margin-left:auto;font-size:11px;font-weight:700;color:rgba(0,0,0,.35);background:none;border:none;cursor:pointer;padding:0;transition:color .12s}
.clear-lnk:hover{color:#E24B4A}

/* Upload landing */
.upload-pg{min-height:100vh;display:flex;flex-direction:column;background:#fff}
.uc{max-width:680px;margin:0 auto;padding:56px 24px;width:100%}
.u-hero{text-align:center;margin-bottom:36px}
.u-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#f0f0ff;border:1px solid rgba(99,102,241,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#6366f1;margin-bottom:14px;text-transform:uppercase}
.u-h1{font-size:clamp(24px,4vw,40px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:8px;line-height:1.1}
.u-h1 em{font-style:normal;color:#6366f1}
.u-sub{font-size:14px;color:rgba(0,0,0,.42);line-height:1.7;max-width:420px;margin:0 auto}
.u-drop{border:2px dashed #d0d0d0;border-radius:16px;padding:44px 24px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.u-drop:hover,.u-drop.over{border-color:#6366f1;background:#f0f0ff}
.u-drop-icon{font-size:38px;margin-bottom:10px}
.u-drop-txt{font-size:13px;color:rgba(0,0,0,.42);margin-bottom:16px;line-height:1.6}
.u-drop-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:background .14s}
.u-drop-btn:hover{background:#6366f1}
.u-feats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:13px;margin-top:26px}
.u-feat{padding:14px 12px;border:1px solid #e8e8e8;border-radius:12px;text-align:center}
.u-feat-icon{font-size:20px;margin-bottom:5px}
.u-feat-ttl{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.u-feat-body{font-size:10px;color:rgba(0,0,0,.38);line-height:1.5}
`

export default function PDFSignerPage() {
  const [pdfFile, setPdfFile]   = useState<File | null>(null)
  const [thumbs,  setThumbs]    = useState<string[]>([])
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [applying, setApplying] = useState(false)
  const [curPage,  setCurPage]  = useState(0)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [signMode,  setSignMode]  = useState<SignMode>('draw')

  // Signature options
  const [inkColor,   setInkColor]   = useState('#111111')
  const [penThick,   setPenThick]   = useState(3)
  const [typedText,  setTypedText]  = useState('')
  const [typeFont,   setTypeFont]   = useState(CURSIVE_FONTS[0].id)
  const [uploadImg,  setUploadImg]  = useState<string | null>(null)
  const [hasDraw,    setHasDraw]    = useState(false)

  const [savedSigs,     setSavedSigs]     = useState<SavedSig[]>([])
  const [placed,        setPlaced]        = useState<PlacedSig[]>([])
  const [selId,         setSelId]         = useState<string | null>(null)
  const [placingUrl,    setPlacingUrl]    = useState<string | null>(null)
  const [ghostPos,      setGhostPos]      = useState<{x:number;y:number}|null>(null)

  // Refs
  const drawCanvasRef  = useRef<HTMLCanvasElement>(null)
  const drawWrapRef    = useRef<HTMLDivElement>(null)
  const isDrawing      = useRef(false)
  const lastPt         = useRef<{x:number;y:number}|null>(null)
  const fileInputRef   = useRef<HTMLInputElement>(null)
  const imgInputRef    = useRef<HTMLInputElement>(null)
  const canvasAreaRef  = useRef<HTMLDivElement>(null)
  const pageCanvasRefs = useRef<(HTMLCanvasElement|null)[]>([])
  const pageWrapRefs   = useRef<(HTMLDivElement|null)[]>([])
  const pdfDocRef      = useRef<any>(null)
  const dragRef        = useRef<{id:string;scx:number;scy:number;ox:number;oy:number;page:number}|null>(null)
  const resizeRef      = useRef<{id:string;scx:number;scy:number;ow:number;oh:number;page:number}|null>(null)
  const rotateRef      = useRef<{id:string;cx:number;cy:number;startAngle:number;startRot:number}|null>(null)
  const dropRef        = useRef<HTMLDivElement>(null)
  const imgDropRef     = useRef<HTMLDivElement>(null)
  const SCALE = 1.5

  // ── Load PDF ────────────────────────────────────────────────────────────────
  const loadPDF = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf   = await file.arrayBuffer()
      const bytes = new Uint8Array(buf)
      setPdfBytes(bytes)
      const pdf   = await pdfjsLib.getDocument({ data: bytes }).promise
      pdfDocRef.current = pdf
      const n     = pdf.numPages
      const arr: string[] = []
      for (let i = 1; i <= n; i++) {
        const pg = await pdf.getPage(i)
        const vp = pg.getViewport({ scale: 0.22 })
        const cv = document.createElement('canvas')
        cv.width = vp.width; cv.height = vp.height
        await pg.render({ canvasContext: cv.getContext('2d')!, viewport: vp }).promise
        arr.push(cv.toDataURL())
      }
      setThumbs(arr); setCurPage(0); setPlaced([]); setSelId(null)
      setModalOpen(true)
    } finally { setLoading(false) }
  }, [])

  // ── Render page canvases ───────────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDocRef.current || thumbs.length === 0) return
    let cancelled = false
    ;(async () => {
      for (let i = 0; i < thumbs.length; i++) {
        if (cancelled) break
        const cv = pageCanvasRefs.current[i]; if (!cv) continue
        const pg = await pdfDocRef.current.getPage(i + 1)
        const vp = pg.getViewport({ scale: SCALE })
        cv.width = vp.width; cv.height = vp.height
        const ctx = cv.getContext('2d')!
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height)
        if (!cancelled) await pg.render({ canvasContext: ctx, viewport: vp }).promise
      }
    })()
    return () => { cancelled = true }
  }, [thumbs.length])

  // ── IntersectionObserver ───────────────────────────────────────────────────
  useEffect(() => {
    const area = canvasAreaRef.current
    if (!area || thumbs.length === 0) return
    const obs = new IntersectionObserver(entries => {
      let best: {ratio:number;idx:number}|null = null
      entries.forEach(e => {
        const idx = pageWrapRefs.current.indexOf(e.target as HTMLDivElement)
        if (idx >= 0 && e.intersectionRatio > (best?.ratio ?? 0)) best = { ratio:e.intersectionRatio, idx }
      })
      if (best) setCurPage((best as any).idx)
    }, { root: area, threshold: [0,.25,.5,.75,1] })
    pageWrapRefs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [thumbs.length])

  const scrollTo = (i: number) => pageWrapRefs.current[i]?.scrollIntoView({ behavior:'smooth', block:'nearest' })

  // ── Draw canvas init (inside modal) ───────────────────────────────────────
  useEffect(() => {
    if (!modalOpen || signMode !== 'draw') return
    const cv   = drawCanvasRef.current
    const wrap = drawWrapRef.current
    if (!cv || !wrap) return
    cv.width  = wrap.clientWidth  || 580
    cv.height = wrap.clientHeight || 180
  }, [modalOpen, signMode])

  const getPt = (e: React.MouseEvent | React.TouchEvent) => {
    const cv   = drawCanvasRef.current!
    const rect = cv.getBoundingClientRect()
    const sx   = cv.width / rect.width, sy = cv.height / rect.height
    const src  = 'touches' in e ? e.touches[0] : e
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true
    const pt = getPt(e); lastPt.current = pt
    const ctx = drawCanvasRef.current!.getContext('2d')!
    ctx.beginPath(); ctx.arc(pt.x, pt.y, penThick / 2, 0, Math.PI * 2)
    ctx.fillStyle = inkColor; ctx.fill()
    setHasDraw(true)
  }

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !lastPt.current) return
    const pt  = getPt(e)
    const ctx = drawCanvasRef.current!.getContext('2d')!
    ctx.beginPath(); ctx.moveTo(lastPt.current.x, lastPt.current.y); ctx.lineTo(pt.x, pt.y)
    ctx.strokeStyle = inkColor; ctx.lineWidth = penThick; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.stroke(); lastPt.current = pt
  }

  const endDraw = () => { isDrawing.current = false; lastPt.current = null }

  const clearDraw = () => {
    const cv = drawCanvasRef.current!
    cv.getContext('2d')!.clearRect(0, 0, cv.width, cv.height)
    setHasDraw(false)
  }

  // ── Background removal ─────────────────────────────────────────────────────
  const removeBg = (src: string): Promise<string> => new Promise(res => {
    const img = new Image(); img.crossOrigin = 'anonymous'
    img.onload = () => {
      const cv = document.createElement('canvas')
      cv.width = img.width; cv.height = img.height
      const ctx = cv.getContext('2d')!; ctx.drawImage(img, 0, 0)
      const d = ctx.getImageData(0, 0, cv.width, cv.height)
      for (let i = 0; i < d.data.length; i += 4) {
        if (d.data[i] > 220 && d.data[i+1] > 220 && d.data[i+2] > 220) d.data[i+3] = 0
      }
      ctx.putImageData(d, 0, 0); res(cv.toDataURL('image/png'))
    }
    img.src = src
  })

  // ── Get dataURL from current mode ──────────────────────────────────────────
  const getSigUrl = async (): Promise<string | null> => {
    if (signMode === 'draw') {
      if (!hasDraw) return null
      return drawCanvasRef.current!.toDataURL('image/png')
    }
    if (signMode === 'type') {
      if (!typedText.trim()) return null
      const cv = document.createElement('canvas')
      cv.width = 480; cv.height = 130
      const ctx = cv.getContext('2d')!
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.font = `62px '${typeFont}'`; ctx.fillStyle = inkColor
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(typedText, 240, 70, 460)
      return cv.toDataURL('image/png')
    }
    return uploadImg
  }

  const canPlace = signMode === 'draw' ? hasDraw : signMode === 'type' ? !!typedText.trim() : !!uploadImg

  // ── Place on PDF — enters click-to-place mode ──────────────────────────────
  const doPlace = async () => {
    const url = await getSigUrl(); if (!url) return
    setPlacingUrl(url); setModalOpen(false)
  }

  // Called when user clicks a page canvas while in placement mode
  const handlePageClick = (e: React.MouseEvent, pi: number) => {
    if (!placingUrl) return
    e.stopPropagation()
    const wrap = pageWrapRefs.current[pi]; if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const cw = wrap.offsetWidth, ch = wrap.offsetHeight
    const xPx = e.clientX - rect.left
    const yPx = e.clientY - rect.top
    const sigW = 0.28, sigH = 0.09
    const today = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
    const ps: PlacedSig = {
      id: uid(), dataUrl: placingUrl, page: pi,
      x: Math.max(0, Math.min(1 - sigW, xPx / cw - sigW / 2)),
      y: Math.max(0, Math.min(1 - sigH, yPx / ch - sigH / 2)),
      w: sigW, h: sigH,
      rotation: 0, dateStamp: false, dateText: `Signed: ${today}`,
    }
    setPlaced(p => [...p, ps]); setSelId(ps.id)
    setPlacingUrl(null); setGhostPos(null)
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const doSave = async () => {
    const url = await getSigUrl(); if (!url || savedSigs.length >= 3) return
    setSavedSigs(p => [...p, { id: uid(), dataUrl: url, createdAt: Date.now() }])
  }

  // ── Global drag / resize / rotate ─────────────────────────────────────────
  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (dragRef.current) {
        const { id, scx, scy, ox, oy, page } = dragRef.current
        const wrap = pageWrapRefs.current[page]; if (!wrap) return
        const cw = wrap.offsetWidth, ch = wrap.offsetHeight
        const dx = e.clientX - scx, dy = e.clientY - scy
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return
        setPlaced(prev => prev.map(p => p.id !== id ? p : {
          ...p,
          x: Math.max(0, Math.min(1 - p.w, (ox + dx) / cw)),
          y: Math.max(0, Math.min(1 - p.h, (oy + dy) / ch)),
        }))
      }
      if (resizeRef.current) {
        const { id, scx, scy, ow, oh, page } = resizeRef.current
        const wrap = pageWrapRefs.current[page]; if (!wrap) return
        const cw = wrap.offsetWidth, ch = wrap.offsetHeight
        const dx = e.clientX - scx, dy = e.clientY - scy
        setPlaced(prev => prev.map(p => p.id !== id ? p : {
          ...p,
          w: Math.max(0.04, Math.min(1 - p.x, (ow * cw + dx) / cw)),
          h: Math.max(0.02, Math.min(1 - p.y, (oh * ch + dy) / ch)),
        }))
      }
      if (rotateRef.current) {
        const { id, cx, cy, startAngle, startRot } = rotateRef.current
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
        const delta = (angle - startAngle) * (180 / Math.PI)
        setPlaced(prev => prev.map(p => p.id !== id ? p : { ...p, rotation: startRot + delta }))
      }
    }
    const mu = () => { dragRef.current = null; resizeRef.current = null; rotateRef.current = null }
    document.addEventListener('mousemove', mm)
    document.addEventListener('mouseup', mu)
    return () => { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu) }
  }, [])

  // ── Drag/drop PDF ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = dropRef.current; if (!el) return
    const ov = (e: DragEvent) => { e.preventDefault(); el.classList.add('over') }
    const lv = () => el.classList.remove('over')
    const dp = (e: DragEvent) => {
      e.preventDefault(); el.classList.remove('over')
      const f = e.dataTransfer?.files[0]
      if (f?.type === 'application/pdf') { setPdfFile(f); loadPDF(f) }
    }
    el.addEventListener('dragover', ov); el.addEventListener('dragleave', lv); el.addEventListener('drop', dp)
    return () => { el.removeEventListener('dragover', ov); el.removeEventListener('dragleave', lv); el.removeEventListener('drop', dp) }
  }, [loadPDF])

  // ── Drag/drop image ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!modalOpen || signMode !== 'upload') return
    const el = imgDropRef.current; if (!el) return
    const ov = (e: DragEvent) => { e.preventDefault(); el.classList.add('over') }
    const lv = () => el.classList.remove('over')
    const dp = (e: DragEvent) => {
      e.preventDefault(); el.classList.remove('over')
      const f = e.dataTransfer?.files[0]
      if (f?.type.startsWith('image/')) {
        const r = new FileReader(); r.onload = ev => setUploadImg(ev.target?.result as string); r.readAsDataURL(f)
      }
    }
    el.addEventListener('dragover', ov); el.addEventListener('dragleave', lv); el.addEventListener('drop', dp)
    return () => { el.removeEventListener('dragover', ov); el.removeEventListener('dragleave', lv); el.removeEventListener('drop', dp) }
  }, [modalOpen, signMode])

  // ── Escape cancels placement mode ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPlacingUrl(null); setGhostPos(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Export PDF ─────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!pdfBytes) return
    setApplying(true)
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes)
      const pages  = pdfDoc.getPages()
      for (const ps of placed) {
        if (ps.page >= pages.length) continue
        const pg = pages[ps.page]
        const { width: pw, height: ph } = pg.getSize()
        const b64 = ps.dataUrl.split(',')[1], bin = atob(b64)
        const arr = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
        const img = await pdfDoc.embedPng(arr)
        pg.drawImage(img, {
          x: ps.x * pw, y: ph - ps.y * ph - ps.h * ph,
          width: ps.w * pw, height: ps.h * ph,
          rotate: degrees(-ps.rotation), opacity: 1,
        })
        if (ps.dateStamp && ps.dateText) {
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
          pg.drawText(ps.dateText, { x: ps.x * pw, y: ph - ps.y * ph - ps.h * ph - 12, size: 7, font, color: rgb(.35,.35,.35) })
        }
      }
      pdfDoc.setCreator('EditPDF AI E-Signer')
      pdfDoc.setModificationDate(new Date())
      pdfDoc.setKeywords(['digitally-signed', `signed-at:${new Date().toISOString()}`])
      const out  = await pdfDoc.save()
      const blob = new Blob([out.buffer as ArrayBuffer], { type:'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a'); a.href = url
      a.download = (pdfFile?.name ?? 'doc').replace(/\.pdf$/i,'') + '-signed.pdf'; a.click()
      URL.revokeObjectURL(url)
    } finally { setApplying(false) }
  }

  const selPlaced = placed.find(p => p.id === selId) ?? null

  // ── Shared color + stroke controls (used in modal) ────────────────────────
  const ColorRow = () => (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ fontSize:10, fontWeight:700, color:'rgba(0,0,0,.35)', textTransform:'uppercase', letterSpacing:'.05em', whiteSpace:'nowrap' }}>Color</span>
      <div className="palette">
        {INK_COLORS.map(c => (
          <div key={c} className={`palette-swatch${inkColor===c?' sel':''}`}
            style={{ background: c, boxShadow: inkColor===c ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : undefined }}
            onClick={() => setInkColor(c)} />
        ))}
        <div style={{ position:'relative', width:22, height:22, flex:'none' }} title="Custom color">
          <div className="color-pick" style={{ borderColor: !INK_COLORS.includes(inkColor) ? '#6366f1' : undefined, transform: !INK_COLORS.includes(inkColor) ? 'scale(1.18)' : undefined }} />
          <input type="color" value={inkColor} onChange={e => setInkColor(e.target.value)}
            style={{ position:'absolute', inset:0, opacity:0, width:'100%', height:'100%', cursor:'pointer', border:'none', padding:0 }} />
        </div>
      </div>
    </div>
  )

  const StrokeRow = () => (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ fontSize:10, fontWeight:700, color:'rgba(0,0,0,.35)', textTransform:'uppercase', letterSpacing:'.05em', whiteSpace:'nowrap' }}>Stroke</span>
      <div className="strokes">
        {STROKE_SIZES.map(s => (
          <button key={s.val} className={`stroke-btn${penThick===s.val?' sel':''}`} onClick={() => setPenThick(s.val)}>
            <div className="stroke-preview" style={{ width: Math.min(28, 6 + s.val * 2), height: s.val, background: inkColor }} />
            <span className="stroke-lbl">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  // ── Upload landing ─────────────────────────────────────────────────────────
  if (!pdfFile) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="upload-pg">
          <SiteNav />
          <div className="uc">
            <div className="u-hero">
              <div className="u-badge">✍ E-Signer</div>
              <h1 className="u-h1">Sign your <em>PDF</em><br/>in seconds</h1>
              <p className="u-sub">Draw, type or upload your signature — place it anywhere and download instantly. 100% in-browser.</p>
            </div>
            <div ref={dropRef} className="u-drop" onClick={() => fileInputRef.current?.click()}>
              <div className="u-drop-icon">📄</div>
              <div className="u-drop-txt">Drop your PDF here, or click to choose<br/><span style={{ fontSize:11, color:'rgba(0,0,0,.28)' }}>PDF files only · nothing leaves your browser</span></div>
              <button className="u-drop-btn" onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}>Choose PDF</button>
            </div>
            <div className="u-feats">
              {[{ icon:'✍', t:'Draw', b:'Freehand with 8 ink colors & 5 stroke sizes' },
                { icon:'Aa', t:'Type', b:'5 cursive fonts, color picker' },
                { icon:'🖼', t:'Upload', b:'PNG/JPG with auto bg removal' }].map(f => (
                <div key={f.t} className="u-feat">
                  <div className="u-feat-icon">{f.icon}</div>
                  <div className="u-feat-ttl">{f.t}</div>
                  <div className="u-feat-body">{f.b}</div>
                </div>
              ))}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display:'none' }}
            onChange={e => { const f=e.target.files?.[0]; if(f){setPdfFile(f);loadPDF(f)}; e.target.value='' }} />
        </div>
      </>
    )
  }

  // ── Editor ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&family=Sacramento&family=Satisfy&family=Great+Vibes&display=swap" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div className="pg">
        {/* Nav */}
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <svg width="27" height="27" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="lg-ps" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4F7FFA"/><stop offset="100%" stopColor="#8B3FEC"/></linearGradient></defs>
                <path d="M5,2 L19,2 L27,10 L27,26 Q27,28 25,28 L5,28 Q3,28 3,26 L3,4 Q3,2 5,2 Z" fill="white" stroke="url(#lg-ps)" strokeWidth="2.2" strokeLinejoin="round"/>
                <path d="M19,2 L19,10 L27,10" fill="none" stroke="url(#lg-ps)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="22" x2="20" y2="11" stroke="url(#lg-ps)" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="8" cy="23" r="1.8" fill="url(#lg-ps)"/>
              </svg>
            </div>
            <span className="logo-name">EditPDF<span className="logo-ai"> AI</span></span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">E-Signer</span>
          <span className="nav-file">{pdfFile.name}</span>
          <div className="nav-sp" />
          <button className="sign-fab" onClick={() => setModalOpen(true)}>✍ Create Signature</button>
          <button className="nbtn sec" onClick={() => { setPdfFile(null); setThumbs([]); setPlaced([]); setSelId(null) }}>← New file</button>
          <button className="nbtn pri" disabled={placed.length === 0 || applying} onClick={exportPDF}>
            {applying ? 'Saving…' : '↓ Download'}
          </button>
        </nav>

        {loading ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
            <div style={{ width:34, height:34, border:'3px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
            <div style={{ fontSize:13, color:'rgba(0,0,0,.4)' }}>Loading PDF…</div>
          </div>
        ) : (
        <div className="body">

          {/* Thumbnails */}
          <div className="thumbs">
            {thumbs.map((t, i) => (
              <div key={i} className={`thumb${curPage===i?' act':''}`} onClick={() => { setCurPage(i); scrollTo(i) }}>
                <img src={t} alt={`p${i+1}`} />
                <div className="thumb-n">{i+1}</div>
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div className="canvas-area" ref={canvasAreaRef}
            style={{ cursor: placingUrl ? 'crosshair' : undefined }}
            onMouseMove={e => { if (placingUrl) setGhostPos({ x: e.clientX, y: e.clientY }) }}
            onMouseLeave={() => setGhostPos(null)}
            onClick={() => { if (!placingUrl) setSelId(null) }}>

            {/* Placement mode banner */}
            {placingUrl && (
              <div style={{ position:'sticky', top:0, zIndex:20, alignSelf:'stretch', background:'#6366f1', color:'#fff', padding:'9px 16px', borderRadius:10, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:12, flexShrink:0, boxShadow:'0 4px 20px rgba(99,102,241,.4)' }}>
                <span>✍ Click anywhere on the PDF to place your signature</span>
                <span style={{ fontSize:10, opacity:.7, marginLeft:-4 }}>· Esc to cancel</span>
                <button onClick={() => { setPlacingUrl(null); setGhostPos(null) }} style={{ marginLeft:'auto', background:'rgba(255,255,255,.2)', border:'none', color:'#fff', borderRadius:7, padding:'4px 11px', cursor:'pointer', fontWeight:700, fontSize:11 }}>Cancel</button>
              </div>
            )}

            {/* Saved sigs bar */}
            {savedSigs.length > 0 && (
              <div className="saved-bar">
                <span className="saved-bar-lbl">Saved ({savedSigs.length}/3)</span>
                {savedSigs.map(s => (
                  <div key={s.id} className="saved-chip" onClick={() => setPlacingUrl(s.dataUrl)}>
                    <img src={s.dataUrl} alt="" />
                    <button className="saved-chip-del" onClick={e => { e.stopPropagation(); setSavedSigs(p=>p.filter(x=>x.id!==s.id)) }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Pages */}
            {Array.from({ length: thumbs.length }, (_, pi) => {
              const cv = pageCanvasRefs.current[pi]
              const pageSigs = placed.filter(p => p.page === pi)
              return (
                <div key={pi}>
                  <div ref={el => { pageWrapRefs.current[pi] = el }} className="page-wrap"
                    style={{ cursor: placingUrl ? 'crosshair' : undefined }}
                    onClick={e => placingUrl ? handlePageClick(e, pi) : e.stopPropagation()}>
                    <canvas ref={el => { pageCanvasRefs.current[pi] = el }} />
                    {cv && pageSigs.map(ps => {
                      const cw = cv.offsetWidth, ch = cv.offsetHeight, sel = selId === ps.id
                      return (
                        <div key={ps.id} className={`sig-ov${sel?' sel':''}`}
                          style={{ position:'absolute', left:ps.x*cw, top:ps.y*ch, width:ps.w*cw, height:ps.h*ch, transform:`rotate(${ps.rotation}deg)`, transformOrigin:'center' }}
                          onMouseDown={e => {
                            e.stopPropagation(); setSelId(ps.id)
                            const wrap = pageWrapRefs.current[pi]!
                            dragRef.current = { id:ps.id, scx:e.clientX, scy:e.clientY, ox:ps.x*wrap.offsetWidth, oy:ps.y*wrap.offsetHeight, page:pi }
                          }}>
                          <img src={ps.dataUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block', pointerEvents:'none' }} />
                          {sel && (
                            <>
                              <button className="sig-del" onClick={e => { e.stopPropagation(); setPlaced(p=>p.filter(x=>x.id!==ps.id)); setSelId(null) }}>×</button>
                              <div className="sig-resize" onMouseDown={e => { e.stopPropagation(); e.preventDefault(); resizeRef.current = { id:ps.id, scx:e.clientX, scy:e.clientY, ow:ps.w, oh:ps.h, page:pi } }} />
                              <div className="sig-rot" title="Rotate"
                                onMouseDown={e => {
                                  e.stopPropagation(); e.preventDefault()
                                  const wrap = pageWrapRefs.current[pi]!
                                  const rect = wrap.getBoundingClientRect()
                                  const cx = rect.left + (ps.x + ps.w/2) * wrap.offsetWidth
                                  const cy = rect.top  + (ps.y + ps.h/2) * wrap.offsetHeight
                                  rotateRef.current = { id:ps.id, cx, cy, startAngle: Math.atan2(e.clientY-cy, e.clientX-cx), startRot: ps.rotation }
                                }}>↻</div>
                            </>
                          )}
                          {ps.dateStamp && <div className="sig-date">{ps.dateText}</div>}
                        </div>
                      )
                    })}
                  </div>
                  <div className="page-lbl">Page {pi + 1}</div>
                </div>
              )
            })}
          </div>

          {/* Right: placement controls */}
          <div className="right">
            {!selPlaced ? (
              <div className="rp-empty">Select a placed signature to adjust its position, size, rotation and date stamp.</div>
            ) : (
              <>
                <div className="rp-sec">
                  <div className="rp-ttl">Position</div>
                  {(['x','y'] as const).map(k => (
                    <div key={k} className="rp-row">
                      <span className="rp-lbl">{k.toUpperCase()} (0–1)</span>
                      <input className="rp-num" type="number" step="0.01" min={0} max={1} value={selPlaced[k].toFixed(3)}
                        onChange={e => setPlaced(p=>p.map(x=>x.id!==selId?x:{...x,[k]:Number(e.target.value)}))} />
                    </div>
                  ))}
                </div>
                <div className="rp-sec">
                  <div className="rp-ttl">Size</div>
                  {(['w','h'] as const).map(k => (
                    <div key={k} className="rp-row">
                      <span className="rp-lbl">{k === 'w' ? 'Width' : 'Height'}</span>
                      <input className="rp-num" type="number" step="0.01" min={0.02} max={1} value={selPlaced[k].toFixed(3)}
                        onChange={e => setPlaced(p=>p.map(x=>x.id!==selId?x:{...x,[k]:Number(e.target.value)}))} />
                    </div>
                  ))}
                </div>
                <div className="rp-sec">
                  <div className="rp-ttl">Rotation</div>
                  <input type="range" min={-180} max={180} value={selPlaced.rotation} className="rp-sld"
                    onChange={e => setPlaced(p=>p.map(x=>x.id!==selId?x:{...x,rotation:Number(e.target.value)}))} />
                  <div style={{ fontSize:10, color:'rgba(0,0,0,.38)', textAlign:'center', marginTop:3 }}>{Math.round(selPlaced.rotation)}°</div>
                </div>
                <div className="rp-sec">
                  <div className="rp-ttl">Date Stamp</div>
                  <div className="rp-row">
                    <span className="rp-lbl">Show date</span>
                    <div className={`tog${selPlaced.dateStamp?' on':' off'}`} onClick={() => setPlaced(p=>p.map(x=>x.id!==selId?x:{...x,dateStamp:!x.dateStamp}))}>
                      <div className="tok" />
                    </div>
                  </div>
                  {selPlaced.dateStamp && (
                    <input className="rp-num" style={{ width:'100%', marginTop:5, fontSize:10 }}
                      value={selPlaced.dateText} onChange={e => setPlaced(p=>p.map(x=>x.id!==selId?x:{...x,dateText:e.target.value}))} />
                  )}
                </div>
                <div className="rp-sec">
                  <div className="rp-ttl">Page</div>
                  <div className="rp-row">
                    <span className="rp-lbl">On page</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'#6366f1' }}>{selPlaced.page + 1}</span>
                  </div>
                </div>
                <div style={{ padding:'10px 13px' }}>
                  <button onClick={() => { setPlaced(p=>p.filter(x=>x.id!==selId)); setSelId(null) }}
                    style={{ width:'100%', padding:8, borderRadius:7, border:'1px solid rgba(226,75,74,.4)', background:'rgba(226,75,74,.06)', color:'#E24B4A', fontWeight:700, fontSize:11, cursor:'pointer' }}>
                    Delete signature
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
        )}
      </div>

      {/* ── Ghost preview follows cursor in placement mode ── */}
      {placingUrl && ghostPos && (
        <div style={{ position:'fixed', left:ghostPos.x - 90, top:ghostPos.y - 28, width:180, height:56, pointerEvents:'none', zIndex:900, opacity:.75, filter:'drop-shadow(0 2px 8px rgba(0,0,0,.25))' }}>
          <img src={placingUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
        </div>
      )}

      {/* ── Signature modal ── */}
      {modalOpen && (
        <div className="modal-back" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="modal-head">
              <span className="modal-title">Create Signature</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>

            {/* Mode tabs */}
            <div className="m-tabs">
              {([{ id:'draw' as SignMode, label:'✍ Draw' }, { id:'type' as SignMode, label:'Aa Type' }, { id:'upload' as SignMode, label:'🖼 Upload' }]).map(m => (
                <button key={m.id} className={`m-tab${signMode===m.id?' act':''}`} onClick={() => setSignMode(m.id)}>{m.label}</button>
              ))}
            </div>

            {/* Body */}
            <div className="modal-body">

              {/* ── Draw ── */}
              {signMode === 'draw' && (
                <>
                  <div ref={drawWrapRef} className="draw-wrap"
                    onMouseDown={startDraw} onMouseMove={drawMove} onMouseUp={endDraw} onMouseLeave={endDraw}
                    onTouchStart={e => { e.preventDefault(); startDraw(e) }}
                    onTouchMove={e => { e.preventDefault(); drawMove(e) }}
                    onTouchEnd={endDraw}>
                    <canvas ref={drawCanvasRef} style={{ width:'100%', height:'100%' }} />
                    {!hasDraw && (
                      <div className="draw-hint">
                        <span style={{ fontSize:20 }}>✍</span> Draw your signature here
                      </div>
                    )}
                  </div>
                  <ColorRow />
                  <StrokeRow />
                  <div style={{ display:'flex', justifyContent:'flex-end' }}>
                    <button className="clear-lnk" onClick={clearDraw}>Clear canvas</button>
                  </div>
                </>
              )}

              {/* ── Type ── */}
              {signMode === 'type' && (
                <>
                  <input className="type-input" placeholder="Type your name or initials…"
                    value={typedText} onChange={e => setTypedText(e.target.value)} />
                  <ColorRow />
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(0,0,0,.35)', textTransform:'uppercase', letterSpacing:'.05em' }}>Font Style</div>
                  <div className="font-grid">
                    {CURSIVE_FONTS.map(f => (
                      <button key={f.id} className={`font-btn${typeFont===f.id?' sel':''}`} onClick={() => setTypeFont(f.id)}>
                        <div className="fp" style={{ fontFamily:f.id, color:inkColor }}>{typedText || 'Sign'}</div>
                        <div className="fn">{f.label}</div>
                      </button>
                    ))}
                  </div>
                  {typedText && (
                    <div className="type-prev">
                      <span style={{ fontFamily:typeFont, fontSize:42, color:inkColor, lineHeight:1.2 }}>{typedText}</span>
                    </div>
                  )}
                </>
              )}

              {/* ── Upload ── */}
              {signMode === 'upload' && (
                <>
                  {!uploadImg ? (
                    <div ref={imgDropRef} className="drop-z" onClick={() => imgInputRef.current?.click()}>
                      <span style={{ fontSize:32 }}>🖼</span>
                      <div style={{ fontSize:13, color:'rgba(0,0,0,.42)' }}>Drop PNG/JPG here or click to choose</div>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,.28)' }}>PNG with transparency recommended</div>
                    </div>
                  ) : (
                    <>
                      <div className="up-prev"><img src={uploadImg} alt="sig" /></div>
                      <button className="bg-btn" onClick={async () => setUploadImg(await removeBg(uploadImg))}>✨ Remove white background</button>
                      <button onClick={() => setUploadImg(null)}
                        style={{ width:'100%', padding:8, borderRadius:7, border:'1px solid #e0e0e0', background:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', color:'rgba(0,0,0,.45)' }}>
                        × Remove image
                      </button>
                    </>
                  )}
                  <input ref={imgInputRef} type="file" accept="image/png,image/jpeg,image/jpg" style={{ display:'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0]; if (!f) return
                      const r = new FileReader(); r.onload = ev => setUploadImg(ev.target?.result as string); r.readAsDataURL(f)
                      e.target.value = ''
                    }} />
                </>
              )}

            </div>

            {/* Footer */}
            <div className="modal-foot">
              <button className="m-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="m-save" disabled={!canPlace || savedSigs.length >= 3} onClick={doSave} title="Save for reuse (up to 3)">
                💾 Save
              </button>
              <button className="m-place" disabled={!canPlace} onClick={doPlace}>
                + Place on PDF
              </button>
            </div>

          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display:'none' }}
        onChange={e => { const f=e.target.files?.[0]; if(f){setPdfFile(f);loadPDF(f)}; e.target.value='' }} />
    </>
  )
}
