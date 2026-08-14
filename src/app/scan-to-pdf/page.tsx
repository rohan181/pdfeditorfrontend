'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import BrandImage from 'next/image'
import SiteNav from '@/components/SiteNav'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'
import {
  type FilterType, DEF_CORNERS, isDefaultCrop,
  perspectiveWarp, applyFilterToData, sharpenImageData, autoDetect,
} from '@/lib/scanUtils'

type PageSizeOpt = 'A4' | 'Letter' | 'Fit'

interface ScanPage {
  id: string
  dataUrl: string
  w: number
  h: number
  filter: FilterType
}

const uid = () => Math.random().toString(36).slice(2, 9)

const PAGE_DIMS: Record<Exclude<PageSizeOpt, 'Fit'>, [number, number]> = {
  A4:     [595.28, 841.89],
  Letter: [612,    792   ],
}

const FILTERS: [FilterType, string, string][] = [
  ['original',  'Original',  '🖼'],
  ['enhanced',  'Enhanced',  '✨'],
  ['bw',        'B&W',       '◼'],
  ['grayscale', 'Grayscale', '⬜'],
]

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image()
  img.src = src
  await new Promise<void>(r => { img.complete ? r() : (img.onload = () => r()) })
  return img
}

function canvasFromImage(img: HTMLImageElement): HTMLCanvasElement {
  const cv = document.createElement('canvas')
  cv.width = img.naturalWidth; cv.height = img.naturalHeight
  cv.getContext('2d')!.drawImage(img, 0, 0)
  return cv
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7;padding-top:56px}
@media(max-width:900px){.pg{height:100dvh}}

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-count{font-size:11px;color:rgba(0,0,0,.38)}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s;white-space:nowrap;min-height:36px}
.nbtn.pri{background:#0d9488;color:#fff}.nbtn.pri:hover{background:#0f766e}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.38;cursor:not-allowed}
.nav-cam{padding:0 18px;height:52px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.96);border-bottom:1px solid rgba(0,0,0,.08);flex-shrink:0}
@media(max-width:600px){.nav-cam{padding:0 12px;gap:6px}.nav-cam .nav-title{display:none}}

.body{flex:1;display:flex;overflow:hidden}
.main{flex:1;overflow-y:auto;padding:20px;background:#e8e8ea;min-height:0}
.grid-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px;flex-wrap:wrap}
.grid-ttl{font-size:13px;font-weight:700;color:#1d1d1f}
.grid-sub{font-size:11px;color:rgba(0,0,0,.38)}
.scan-more-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:9px;border:none;background:#0d9488;color:#fff;font-size:12px;font-weight:700;cursor:pointer;min-height:40px}
.scan-more-btn:hover{background:#0f766e}
.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:12px}
.img-card{background:#fff;border-radius:11px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.08);border:2px solid transparent;transition:all .15s;position:relative;cursor:grab;user-select:none}
.img-card:active{cursor:grabbing}
.img-card.drag-over{border-color:#0d9488;transform:scale(1.03)}
.img-card.dragging{opacity:.38}
.img-card-thumb{width:100%;aspect-ratio:3/4;object-fit:cover;display:block;pointer-events:none;background:#f5f5f5}
.img-card-body{padding:7px 8px 8px}
.img-card-dims{font-size:9px;color:rgba(0,0,0,.35)}
.img-card-actions{display:flex;gap:4px;margin-top:6px}
.ic-btn{flex:1;padding:6px 0;border-radius:5px;border:1px solid #e0e0e0;background:#fff;font-size:9px;font-weight:700;cursor:pointer;color:rgba(0,0,0,.5);transition:all .12s;text-align:center;min-height:30px}
.ic-btn:hover{border-color:#0d9488;color:#0f766e;background:#f0fdfa}
.ic-btn.del:hover{border-color:rgba(226,75,74,.5);color:#E24B4A;background:rgba(226,75,74,.06)}
.img-card-del{position:absolute;top:5px;right:5px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.55);border:none;color:#fff;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;transition:background .12s}
.img-card-del:hover{background:#E24B4A}
.img-card-num{position:absolute;top:5px;left:5px;background:rgba(0,0,0,.55);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:99px;z-index:2;line-height:1.4}
.add-more{border:2px dashed #d0d0d0;border-radius:11px;aspect-ratio:3/4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;color:rgba(0,0,0,.3);font-size:11px;font-weight:700;transition:all .14s;background:#fff;min-height:44px}
.add-more:hover{border-color:#0d9488;color:#0d9488;background:#f0fdfa}

.right{width:220px;flex-shrink:0;background:#fff;border-left:1px solid #e8e8e8;overflow-y:auto;display:flex;flex-direction:column}
.rp-sec{padding:12px 14px;border-bottom:1px solid #f0f0f0}
.rp-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.seg{display:flex;border:1.5px solid #e0e0e0;border-radius:8px;overflow:hidden}
.seg-btn{flex:1;padding:8px 4px;font-size:10px;font-weight:700;border:none;background:#fff;cursor:pointer;color:rgba(0,0,0,.4);transition:all .12s;text-align:center;min-height:38px}
.seg-btn.sel{background:#0d9488;color:#fff}
.seg-btn:not(.sel):hover{background:#f0fdfa;color:#0f766e}
.rp-hint{font-size:9px;color:rgba(0,0,0,.3);margin-top:6px;line-height:1.5}
.converting{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center}
.conv-card{background:#fff;border-radius:16px;padding:32px 40px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.2)}
.conv-spin{width:44px;height:44px;border:4px solid #f0f0f0;border-top-color:#0d9488;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px}
@keyframes spin{to{transform:rotate(360deg)}}
.conv-lbl{font-size:14px;font-weight:700;color:#1d1d1f}
.conv-sub{font-size:11px;color:rgba(0,0,0,.38);margin-top:5px}
.err-bar{margin:10px 16px;padding:10px 14px;border:1px solid rgba(220,38,38,.22);border-radius:9px;background:#fff5f5;color:#dc2626;font-size:12px;font-weight:600;text-align:center}

.lp{min-height:100vh;display:flex;flex-direction:column;background:#fff;padding-top:56px}
.lp-uc{max-width:700px;margin:0 auto;padding:48px 24px;width:100%}
.lp-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#f0fdfa;border:1px solid rgba(13,148,136,.3);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#0f766e;margin-bottom:14px;text-transform:uppercase}
.lp-h1{font-size:clamp(26px,5vw,44px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1;text-align:center}
.lp-h1 em{font-style:normal;color:#0d9488}
.lp-sub{font-size:14px;color:rgba(0,0,0,.42);line-height:1.7;max-width:440px;margin:0 auto 32px;text-align:center}
.lp-cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.lp-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:11px;font-size:14px;font-weight:800;cursor:pointer;border:none;transition:all .14s;min-height:48px}
.lp-cta.pri{background:#0d9488;color:#fff;box-shadow:0 8px 24px rgba(13,148,136,.3)}
.lp-cta.pri:hover{background:#0f766e}
.lp-cta.sec{background:#f0f0f0;color:#1d1d1f}
.lp-cta.sec:hover{background:#e5e5e5}
.lp-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:36px}
.lp-feat{padding:14px 12px;border:1px solid #e8e8e8;border-radius:12px;text-align:center}
.lp-feat-icon{font-size:22px;margin-bottom:6px}
.lp-feat-ttl{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.lp-feat-body{font-size:10px;color:rgba(0,0,0,.38);line-height:1.5}
@media(max-width:600px){.lp-feats{grid-template-columns:1fr}.lp-uc{padding:28px 16px}}

/* Camera capture view */
.cam-back{position:fixed;inset:0;background:#000;z-index:600;display:flex;flex-direction:column}
.cam-video-wrap{flex:1;position:relative;overflow:hidden;background:#111;min-height:0}
.cam-video{width:100%;height:100%;object-fit:cover;display:block}
.cam-guide{position:absolute;inset:6% 8%;border:2px dashed rgba(255,255,255,.55);border-radius:14px;pointer-events:none}
.cam-topbar{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;padding-top:max(14px,env(safe-area-inset-top));z-index:2}
.cam-close{width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,.45);border:none;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.cam-count{background:rgba(0,0,0,.45);color:#fff;font-size:12px;font-weight:700;padding:7px 14px;border-radius:99px}
.cam-bottombar{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:28px;padding:22px 16px calc(22px + env(safe-area-inset-bottom));background:linear-gradient(0deg,rgba(0,0,0,.55),transparent 100%);margin-top:-90px}
.cam-shutter{width:72px;height:72px;border-radius:50%;background:#fff;border:4px solid rgba(255,255,255,.4);cursor:pointer;flex-shrink:0}
.cam-shutter:active{background:#e5e5e5}
.cam-side-btn{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.16);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cam-error{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;color:#fff}
.cam-error-btn{padding:11px 22px;border-radius:9px;border:none;background:#0d9488;color:#fff;font-size:13px;font-weight:700;cursor:pointer}

/* Smart Scan modal (shared with Image → PDF) */
.scan-back{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(5px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
.scan-modal{background:#fff;border-radius:16px;box-shadow:0 28px 90px rgba(0,0,0,.25);width:100%;max-width:920px;display:flex;flex-direction:column;overflow:hidden;max-height:calc(100vh - 32px)}
.scan-head{padding:14px 18px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:10px;flex-shrink:0}
.scan-title{font-size:14px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em;flex:1}
.scan-subtitle{font-size:10px;color:rgba(0,0,0,.35);font-weight:500}
.scan-close{width:32px;height:32px;border-radius:50%;border:none;background:#f0f0f0;color:#555;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .12s}
.scan-close:hover{background:#e0e0e0;color:#111}
.scan-body{flex:1;display:flex;overflow:hidden;min-height:0}
.scan-left{flex:1;background:#2a2a2e;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;min-height:0}
.scan-canvas{display:block;max-width:100%;max-height:100%;object-fit:contain;touch-action:none}
.scan-right{width:230px;flex-shrink:0;border-left:1px solid #f0f0f0;overflow-y:auto;display:flex;flex-direction:column;gap:0}
.sr-sec{padding:12px 14px;border-bottom:1px solid #f0f0f0}
.sr-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.filter-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
.filter-btn{padding:10px 4px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;text-align:center;transition:all .12s;font-size:10px;font-weight:700;color:rgba(0,0,0,.45);min-height:44px}
.filter-btn.sel{border-color:#0d9488;background:#f0fdfa;color:#0f766e}
.filter-btn:not(.sel):hover{border-color:#d0d0d0;background:#f8f8f8}
.filter-icon{font-size:18px;display:block;margin-bottom:3px}
.auto-btn{width:100%;padding:11px;border-radius:8px;border:1.5px solid #6366f1;background:#f0f0ff;color:#6366f1;font-size:12px;font-weight:700;cursor:pointer;transition:all .13s;display:flex;align-items:center;justify-content:center;gap:5px;min-height:44px}
.auto-btn:hover{background:#e8e8ff;border-color:#4f46e5}
.auto-btn:disabled{opacity:.38;cursor:not-allowed}
.reset-btn{width:100%;padding:9px;border-radius:7px;border:1px solid #e0e0e0;background:#fff;color:rgba(0,0,0,.4);font-size:11px;font-weight:700;cursor:pointer;transition:all .12s;margin-top:6px;min-height:38px}
.reset-btn:hover{border-color:#bbb;color:rgba(0,0,0,.6)}
.scan-foot{padding:12px 18px;border-top:1px solid #f0f0f0;display:flex;gap:8px;align-items:center;flex-shrink:0}
.sf-cancel{padding:11px 16px;border-radius:8px;border:1px solid #e0e0e0;background:#fff;font-size:12px;font-weight:700;cursor:pointer;color:rgba(0,0,0,.5);min-height:44px}
.sf-cancel:hover{border-color:#bbb;color:#1d1d1f}
.sf-apply{flex:1;padding:11px;border-radius:8px;border:none;background:#0d9488;color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:background .13s;min-height:44px}
.sf-apply:hover:not(:disabled){background:#0f766e}
.sf-apply:disabled{opacity:.38;cursor:not-allowed}
.corner-hint{font-size:10px;color:rgba(255,255,255,.5);text-align:center;position:absolute;bottom:8px;left:0;right:0;pointer-events:none}

@media(max-width:900px){
  .pg{height:auto;min-height:100dvh;overflow:visible}
  .body{flex:none;flex-direction:column;overflow:visible}
  .main{order:2;overflow:visible;padding:14px;min-height:48dvh}
  .right{order:1;width:100%;max-height:none;overflow:visible;border-left:0;border-bottom:1px solid #e8e8e8}
  .img-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
  .scan-body{flex-direction:column;overflow-y:auto}
  .scan-left{min-height:38dvh}.scan-right{width:100%;border-left:0;border-top:1px solid #f0f0f0;overflow:visible}
  .filter-grid{grid-template-columns:repeat(4,1fr)}
  .scan-foot{padding:10px 12px}
  .cam-shutter{width:64px;height:64px}
  .cam-side-btn{width:44px;height:44px}
}
`

export default function ScanToPDFPage() {
  const [pages,      setPages]      = useState<ScanPage[]>([])
  const [pageSize,   setPageSize]   = useState<PageSizeOpt>('A4')
  const [converting, setConverting] = useState(false)
  const [progress,   setProgress]   = useState('')
  const [error,      setError]      = useState('')
  const [dragIdx,    setDragIdx]    = useState<number | null>(null)
  const [overIdx,    setOverIdx]    = useState<number | null>(null)

  // Camera state
  const [cameraOpen,   setCameraOpen]   = useState(false)
  const [cameraError,  setCameraError]  = useState('')
  const [facing,       setFacing]       = useState<'environment' | 'user'>('environment')
  const [capturedCount, setCapturedCount] = useState(0)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Smart Scan (crop/perspective) state
  const [scanItem,      setScanItem]      = useState<ScanPage | null>(null)
  const [scanCorners,   setScanCorners]   = useState<[number, number][]>([...DEF_CORNERS])
  const [scanFilter,    setScanFilter]    = useState<FilterType>('enhanced')
  const [scanProcessing,setScanProcessing]= useState(false)
  const [autoDetecting, setAutoDetecting] = useState(false)
  const [cameFromCamera, setCameFromCamera] = useState(false)

  const fileInputRef  = useRef<HTMLInputElement>(null)
  const cameraFileRef = useRef<HTMLInputElement>(null)
  const scanCanvasRef = useRef<HTMLCanvasElement>(null)
  const scanDragCorner = useRef<number | null>(null)
  const scanImgRef     = useRef<HTMLImageElement | null>(null)

  // ── Open live camera ──────────────────────────────────────────────────────
  const startCamera = useCallback(async (mode: 'environment' | 'user' = facing) => {
    setCameraError('')
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      setFacing(mode)
      setCameraOpen(true)
      // Wait a tick for the <video> element to mount, then attach the stream.
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
    } catch {
      setCameraOpen(true)
      setCameraError('Camera access was denied or is unavailable. Use "Take Photo" below to use your device camera app instead, or upload existing photos.')
    }
  }, [facing])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOpen(false)
    setCameraError('')
  }, [])

  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()) }, [])

  const addPageFromDataUrl = useCallback(async (dataUrl: string) => {
    const img = await loadImage(dataUrl)
    const page: ScanPage = { id: uid(), dataUrl, w: img.naturalWidth, h: img.naturalHeight, filter: 'original' }
    setPages(prev => [...prev, page])
    setCapturedCount(c => c + 1)
    return page
  }, [])

  // ── Capture current video frame → open crop/perspective modal ────────────
  const capturePhoto = useCallback(async () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const cv = document.createElement('canvas')
    cv.width = video.videoWidth
    cv.height = video.videoHeight
    const ctx = cv.getContext('2d')!
    if (facing === 'user') { ctx.translate(cv.width, 0); ctx.scale(-1, 1) }
    ctx.drawImage(video, 0, 0)
    const dataUrl = cv.toDataURL('image/jpeg', 0.92)
    const page = await addPageFromDataUrl(dataUrl)
    setCameFromCamera(true)
    setScanItem(page)
    setScanCorners([...DEF_CORNERS])
    setScanFilter('enhanced')
  }, [facing, addPageFromDataUrl])

  const switchCamera = () => startCamera(facing === 'environment' ? 'user' : 'environment')

  // ── Fallback: native camera app via file input capture ───────────────────
  const onCameraFileSelected = async (files: FileList | null) => {
    if (!files?.[0]) return
    const reader = new FileReader()
    reader.onload = async ev => {
      const dataUrl = ev.target?.result as string
      const page = await addPageFromDataUrl(dataUrl)
      setCameFromCamera(true)
      setScanItem(page)
      setScanCorners([...DEF_CORNERS])
      setScanFilter('enhanced')
    }
    reader.readAsDataURL(files[0])
  }

  // ── Upload existing photos ────────────────────────────────────────────────
  const loadFiles = useCallback((files: FileList | File[]) => {
    setError('')
    Array.from(files).filter(f => f.type.startsWith('image/')).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => addPageFromDataUrl(ev.target?.result as string)
      reader.readAsDataURL(file)
    })
  }, [addPageFromDataUrl])

  // ── Drag-to-reorder ──────────────────────────────────────────────────────
  const onDragStart = (i: number) => setDragIdx(i)
  const onDragOver  = (e: React.DragEvent, i: number) => { e.preventDefault(); setOverIdx(i) }
  const onDrop      = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return }
    setPages(prev => { const next = [...prev]; const [m] = next.splice(dragIdx, 1); next.splice(i, 0, m); return next })
    setDragIdx(null); setOverIdx(null)
  }
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null) }

  // ── Generate PDF ─────────────────────────────────────────────────────────
  const getPageDims = (item: ScanPage): [number, number] => {
    if (pageSize === 'Fit') return [item.w * 0.75, item.h * 0.75]
    const [pw, ph] = PAGE_DIMS[pageSize]
    return item.w > item.h ? [ph, pw] : [pw, ph]
  }

  const convert = async () => {
    if (!pages.length) return
    setError(''); setConverting(true)
    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      for (let i = 0; i < pages.length; i++) {
        const item = pages[i]
        setProgress(`Adding page ${i + 1} of ${pages.length}…`)
        const [pw, ph] = getPageDims(item)
        const page = pdfDoc.addPage([pw, ph])
        const b64 = item.dataUrl.split(',')[1]
        const bin = atob(b64)
        const bytes = new Uint8Array(bin.length)
        for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j)
        const isJpeg = item.dataUrl.startsWith('data:image/jpeg')
        const pdfImg = isJpeg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes)
        const scale = Math.min(pw / item.w, ph / item.h)
        const iw = item.w * scale, ih = item.h * scale
        page.drawImage(pdfImg, { x: (pw - iw) / 2, y: (ph - ih) / 2, width: iw, height: ih })
        const lbl = String(i + 1), sz = 8, tw = font.widthOfTextAtSize(lbl, sz)
        page.drawText(lbl, { x: (pw - tw) / 2, y: 10, size: sz, font, color: rgb(.6, .6, .6) })
      }
      setProgress('Saving PDF…')
      const out = await pdfDoc.save()
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `scan-to-pdf-${Date.now()}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      setError('Could not create the PDF. Try again.')
    } finally { setConverting(false); setProgress('') }
  }

  // ── Smart Scan: open modal for an existing page ───────────────────────────
  const openScan = (item: ScanPage) => {
    setCameFromCamera(false)
    setScanItem(item)
    setScanCorners([...DEF_CORNERS])
    setScanFilter(item.filter)
  }

  // ── Smart Scan: draw canvas ───────────────────────────────────────────────
  const drawScanCanvas = useCallback(() => {
    const cv = scanCanvasRef.current; if (!cv || !scanItem) return
    const ctx = cv.getContext('2d')!
    const img = scanImgRef.current || new Image()
    if (!scanImgRef.current) {
      scanImgRef.current = img
      img.onload = () => drawScanCanvas()
      img.src = scanItem.dataUrl; return
    }
    if (!img.complete) return

    ctx.clearRect(0, 0, cv.width, cv.height)
    ctx.drawImage(img, 0, 0, cv.width, cv.height)

    const pts = scanCorners.map(([x, y]): [number, number] => [x * cv.width, y * cv.height])

    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,.48)'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    ctx.lineTo(pts[1][0], pts[1][1])
    ctx.lineTo(pts[2][0], pts[2][1])
    ctx.lineTo(pts[3][0], pts[3][1])
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    ctx.strokeStyle = '#0d9488'; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y))
    ctx.closePath(); ctx.stroke()

    ctx.save(); ctx.globalAlpha = .35; ctx.strokeStyle = '#0d9488'; ctx.lineWidth = 1; ctx.setLineDash([3, 4])
    for (let t = 1; t <= 2; t++) {
      const lerp = (a: [number, number], b: [number, number]) => [(a[0] * (3 - t) + b[0] * t) / 3, (a[1] * (3 - t) + b[1] * t) / 3] as [number, number]
      const [l0, r0] = [lerp(pts[0], pts[1]), lerp(pts[3], pts[2])]
      const [l1, r1] = [lerp(pts[0], pts[3]), lerp(pts[1], pts[2])]
      ctx.beginPath(); ctx.moveTo(l0[0], l0[1]); ctx.lineTo(r0[0], r0[1]); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(l1[0], l1[1]); ctx.lineTo(r1[0], r1[1]); ctx.stroke()
    }
    ctx.restore()

    pts.forEach(([x, y], i) => {
      ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2)
      ctx.fillStyle = '#0d9488'; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(['TL', 'TR', 'BR', 'BL'][i], x, y)
    })
  }, [scanItem, scanCorners])

  useEffect(() => {
    if (!scanItem) { scanImgRef.current = null; return }
    const cv = scanCanvasRef.current; if (!cv) return
    const maxW = 640, maxH = 500
    const aspect = scanItem.w / scanItem.h
    cv.width = Math.min(maxW, maxH * aspect)
    cv.height = cv.width / aspect
    drawScanCanvas()
  }, [scanItem, drawScanCanvas])

  useEffect(() => { if (scanItem) drawScanCanvas() }, [scanCorners, drawScanCanvas, scanItem])

  // ── Smart Scan: corner drag (mouse + touch) ───────────────────────────────
  const cornerAt = (cv: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = cv.getBoundingClientRect()
    const mx = (clientX - rect.left) * (cv.width / rect.width)
    const my = (clientY - rect.top) * (cv.height / rect.height)
    let hit: number | null = null
    scanCorners.forEach(([x, y], i) => {
      if (Math.hypot(mx - x * cv.width, my - y * cv.height) < 26) hit = i
    })
    return hit
  }
  const onScanPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    scanDragCorner.current = cornerAt(scanCanvasRef.current!, e.clientX, e.clientY)
  }
  const onScanPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const i = scanDragCorner.current; if (i === null) return
    const cv = scanCanvasRef.current!
    const rect = cv.getBoundingClientRect()
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    setScanCorners(prev => prev.map((c, j) => j === i ? [nx, ny] : c) as [number, number][])
  }
  const onScanPointerUp = () => { scanDragCorner.current = null }

  // ── Smart Scan: auto-detect ───────────────────────────────────────────────
  const runAutoDetect = async () => {
    if (!scanItem) return
    setAutoDetecting(true)
    await new Promise(r => setTimeout(r, 0))
    const img = await loadImage(scanItem.dataUrl)
    setScanCorners(autoDetect(canvasFromImage(img)))
    setAutoDetecting(false)
  }

  // ── Smart Scan: apply ─────────────────────────────────────────────────────
  const applyScan = async () => {
    if (!scanItem) return
    setScanProcessing(true)
    try {
      const img = await loadImage(scanItem.dataUrl)
      const srcCv = canvasFromImage(img)

      let workCv: HTMLCanvasElement
      if (!isDefaultCrop(scanCorners)) {
        const px = scanCorners.map(([x, y]): [number, number] => [x * scanItem.w, y * scanItem.h])
        const tw = Math.hypot(px[1][0] - px[0][0], px[1][1] - px[0][1])
        const bw = Math.hypot(px[2][0] - px[3][0], px[2][1] - px[3][1])
        const lh = Math.hypot(px[3][0] - px[0][0], px[3][1] - px[0][1])
        const rh = Math.hypot(px[2][0] - px[1][0], px[2][1] - px[1][1])
        const outW = Math.min(3000, Math.round((tw + bw) / 2))
        const outH = Math.min(3000, Math.round((lh + rh) / 2))
        const dataUrl = perspectiveWarp(srcCv, px, outW, outH)
        const wi = await loadImage(dataUrl)
        workCv = document.createElement('canvas'); workCv.width = outW; workCv.height = outH
        workCv.getContext('2d')!.drawImage(wi, 0, 0)
      } else {
        workCv = srcCv
      }

      if (scanFilter !== 'original') {
        const wCtx = workCv.getContext('2d')!
        let id = wCtx.getImageData(0, 0, workCv.width, workCv.height)
        if (scanFilter === 'sharpen') id = sharpenImageData(id)
        else applyFilterToData(id.data, scanFilter)
        wCtx.putImageData(id, 0, 0)
      }

      const dataUrl = workCv.toDataURL(scanFilter === 'bw' ? 'image/jpeg' : 'image/jpeg', 0.9)
      setPages(prev => prev.map(it => it.id !== scanItem.id ? it : { ...it, dataUrl, w: workCv.width, h: workCv.height, filter: scanFilter }))
      setScanItem(null)
      if (cameFromCamera && cameraOpen) {
        // Stay in capture mode for the next page.
        setCameFromCamera(false)
      }
    } finally { setScanProcessing(false) }
  }

  const closeScanModal = () => {
    setScanItem(null)
    setCameFromCamera(false)
  }

  // ── Landing (no pages captured yet) ───────────────────────────────────────
  if (!pages.length && !cameraOpen) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="lp">
          <SiteNav />
          <div className="lp-uc">
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><div className="lp-badge">📷 Scan to PDF</div></div>
              <h1 className="lp-h1">Turn your camera into<br/>a <em>document scanner</em></h1>
              <p className="lp-sub">Capture paper documents, receipts, or whiteboards with your camera. Auto-detect edges, fix perspective, and export a clean multi-page PDF — entirely in your browser.</p>
            </div>
            <div className="lp-cta-row">
              <button className="lp-cta pri" onClick={() => startCamera('environment')}>
                📷 Open Camera
              </button>
              <button className="lp-cta sec" onClick={() => fileInputRef.current?.click()}>
                🖼 Upload Photos
              </button>
            </div>
            {error && <div role="alert" className="err-bar" style={{ marginTop: 20 }}>{error}</div>}
            <div className="lp-feats">
              {[
                { icon: '📐', t: 'Auto edge detect', b: 'Finds document borders and corrects perspective automatically' },
                { icon: '🎨', t: 'Scan filters', b: 'Enhanced, B&W, and grayscale modes like a real scanner app' },
                { icon: '🔒', t: '100% private', b: 'Photos are processed on-device — nothing is uploaded' },
              ].map(f => (
                <div key={f.t} className="lp-feat"><div className="lp-feat-icon">{f.icon}</div><div className="lp-feat-ttl">{f.t}</div><div className="lp-feat-body">{f.b}</div></div>
              ))}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => { if (e.target.files) loadFiles(e.target.files); e.target.value = '' }} />
        </div>
        <ToolSEOSection {...toolSeoData['scan-to-pdf']} />
      </>
    )
  }

  // ── Live camera capture view ──────────────────────────────────────────────
  if (cameraOpen) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="cam-back">
          <div className="cam-video-wrap">
            {!cameraError ? (
              <video ref={videoRef} className="cam-video" autoPlay playsInline muted
                style={facing === 'user' ? { transform: 'scaleX(-1)' } : undefined} />
            ) : (
              <div className="cam-error">
                <div style={{ fontSize: 40 }}>📷</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>{cameraError}</p>
                <button className="cam-error-btn" onClick={() => cameraFileRef.current?.click()}>Take Photo</button>
                <button className="cam-error-btn" style={{ background: '#374151' }} onClick={() => fileInputRef.current?.click()}>Upload Photos</button>
              </div>
            )}
            {!cameraError && <div className="cam-guide" />}
            <div className="cam-topbar">
              <button className="cam-close" aria-label="Close camera" onClick={() => { stopCamera(); if (!pages.length) return } }>
                {pages.length ? '×' : '×'}
              </button>
              {capturedCount > 0 && <div className="cam-count">{capturedCount} page{capturedCount !== 1 ? 's' : ''} captured</div>}
            </div>
          </div>
          {!cameraError && (
            <div className="cam-bottombar">
              <button className="cam-side-btn" aria-label="Upload photo instead" onClick={() => fileInputRef.current?.click()}>🖼</button>
              <button className="cam-shutter" aria-label="Capture photo" onClick={capturePhoto} />
              <button className="cam-side-btn" aria-label="Switch camera" onClick={switchCamera}>🔄</button>
            </div>
          )}
          {pages.length > 0 && (
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingBottom: 14 }}>
              <button className="nbtn pri" style={{ padding: '11px 24px', fontSize: 13 }} onClick={stopCamera}>
                ✓ Done — review {pages.length} page{pages.length !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={e => { if (e.target.files) loadFiles(e.target.files); e.target.value = '' }} />
        <input ref={cameraFileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
          onChange={e => { onCameraFileSelected(e.target.files); e.target.value = '' }} />

        {scanItem && (
          <ScanModal
            scanItem={scanItem} scanCanvasRef={scanCanvasRef}
            onPointerDown={onScanPointerDown} onPointerMove={onScanPointerMove} onPointerUp={onScanPointerUp}
            scanFilter={scanFilter} setScanFilter={setScanFilter}
            autoDetecting={autoDetecting} runAutoDetect={runAutoDetect}
            resetCorners={() => setScanCorners([...DEF_CORNERS])}
            scanProcessing={scanProcessing} applyScan={applyScan}
            onClose={closeScanModal}
            applyLabel={cameFromCamera ? '✓ Apply — next page' : '✓ Apply to page'}
          />
        )}
      </>
    )
  }

  // ── Review / editor ────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pg">
        <nav className="nav-cam">
          <Link href="/" className="logo">
            <BrandImage src="/logo-v2.svg" alt="EditPDF AI" width={380} height={100} style={{ width: '114px', height: '30px' }} priority />
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">Scan to PDF</span>
          <span className="nav-count">{pages.length} page{pages.length !== 1 ? 's' : ''}</span>
          <div className="nav-sp" />
          <button className="nbtn sec" onClick={() => setPages([])}>← New</button>
          <button className="nbtn pri" disabled={converting} onClick={convert}>{converting ? 'Converting…' : '↓ Save PDF'}</button>
        </nav>
        {error && <div role="alert" className="err-bar">{error}</div>}

        <div className="body">
          <div className="main">
            <div className="grid-header">
              <div>
                <div className="grid-ttl">Pages ({pages.length})</div>
                <div className="grid-sub">Drag to reorder · tap ✨ Rescan to crop or change filter</div>
              </div>
              <button className="scan-more-btn" onClick={() => startCamera('environment')}>📷 Scan another page</button>
            </div>

            <div className="img-grid">
              {pages.map((p, i) => (
                <div key={p.id}
                  className={`img-card${dragIdx === i ? ' dragging' : ''}${overIdx === i && dragIdx !== i ? ' drag-over' : ''}`}
                  draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)}
                  onDrop={e => onDrop(e, i)} onDragEnd={onDragEnd}>
                  <span className="img-card-num">{i + 1}</span>
                  <img className="img-card-thumb" src={p.dataUrl} alt={`Page ${i + 1}`} loading="lazy" />
                  <div className="img-card-body">
                    <div className="img-card-dims">{p.w}×{p.h} · {p.filter}</div>
                    <div className="img-card-actions">
                      <button className="ic-btn" onClick={e => { e.stopPropagation(); openScan(p) }}>✨ Rescan</button>
                      <button className="ic-btn del" aria-label={`Remove page ${i + 1}`} onClick={e => { e.stopPropagation(); setPages(prev => prev.filter(x => x.id !== p.id)) }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="add-more" onClick={() => startCamera('environment')}>
                <span style={{ fontSize: 28 }}>📷</span><span>Scan page</span>
              </div>
              <div className="add-more" onClick={() => fileInputRef.current?.click()}>
                <span style={{ fontSize: 28 }}>+</span><span>Add photo</span>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="rp-sec">
              <div className="rp-ttl">Page Size</div>
              <div className="seg">
                {(['A4', 'Letter', 'Fit'] as PageSizeOpt[]).map(s => (
                  <button key={s} className={`seg-btn${pageSize === s ? ' sel' : ''}`} onClick={() => setPageSize(s)}>
                    {s === 'Fit' ? 'Fit' : s}
                  </button>
                ))}
              </div>
              {pageSize === 'Fit' && <div className="rp-hint">Each page sized to its captured photo.</div>}
            </div>
            <div style={{ padding: 14, marginTop: 'auto' }}>
              <button style={{ width: '100%', padding: 13, borderRadius: 9, border: 'none', background: '#0d9488', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', minHeight: 46 }}
                disabled={converting} onClick={convert}>
                {converting ? 'Converting…' : `↓ Save ${pages.length} page${pages.length !== 1 ? 's' : ''} as PDF`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {converting && (
        <div className="converting">
          <div className="conv-card">
            <div className="conv-spin" />
            <div className="conv-lbl">Building your PDF</div>
            <div className="conv-sub">{progress}</div>
          </div>
        </div>
      )}

      {scanItem && (
        <ScanModal
          scanItem={scanItem} scanCanvasRef={scanCanvasRef}
          onPointerDown={onScanPointerDown} onPointerMove={onScanPointerMove} onPointerUp={onScanPointerUp}
          scanFilter={scanFilter} setScanFilter={setScanFilter}
          autoDetecting={autoDetecting} runAutoDetect={runAutoDetect}
          resetCorners={() => setScanCorners([...DEF_CORNERS])}
          scanProcessing={scanProcessing} applyScan={applyScan}
          onClose={closeScanModal}
          applyLabel="✓ Apply changes"
        />
      )}

      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => { if (e.target.files) loadFiles(e.target.files); e.target.value = '' }} />
      <ToolSEOSection {...toolSeoData['scan-to-pdf']} />
    </>
  )
}

// ─── Smart Scan modal (crop / perspective / filter) ─────────────────────────
function ScanModal({
  scanItem, scanCanvasRef, onPointerDown, onPointerMove, onPointerUp,
  scanFilter, setScanFilter, autoDetecting, runAutoDetect, resetCorners,
  scanProcessing, applyScan, onClose, applyLabel,
}: {
  scanItem: ScanPage
  scanCanvasRef: React.Ref<HTMLCanvasElement>
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerUp: () => void
  scanFilter: FilterType
  setScanFilter: (f: FilterType) => void
  autoDetecting: boolean
  runAutoDetect: () => void
  resetCorners: () => void
  scanProcessing: boolean
  applyScan: () => void
  onClose: () => void
  applyLabel: string
}) {
  return (
    <div className="scan-back" onClick={onClose}>
      <div className="scan-modal" onClick={e => e.stopPropagation()}>
        <div className="scan-head">
          <div>
            <div className="scan-title">✨ Smart Scan</div>
            <div className="scan-subtitle">{scanItem.w}×{scanItem.h}</div>
          </div>
          <button className="scan-close" aria-label="Close smart scan" onClick={onClose}>×</button>
        </div>

        <div className="scan-body">
          <div className="scan-left">
            <canvas ref={scanCanvasRef} className="scan-canvas"
              style={{ cursor: 'crosshair', touchAction: 'none' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
            <div className="corner-hint">Drag corner handles · TL TR BR BL</div>
          </div>

          <div className="scan-right">
            <div className="sr-sec">
              <div className="sr-ttl">Edge Detection</div>
              <button className="auto-btn" disabled={autoDetecting} onClick={runAutoDetect}>
                {autoDetecting ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> Detecting…</> : '🔍 Auto-detect document edges'}
              </button>
              <button className="reset-btn" onClick={resetCorners}>Reset corners to full image</button>
            </div>

            <div className="sr-sec">
              <div className="sr-ttl">Filter</div>
              <div className="filter-grid">
                {FILTERS.map(([v, l, ic]) => (
                  <button key={v} className={`filter-btn${scanFilter === v ? ' sel' : ''}`} onClick={() => setScanFilter(v)}>
                    <span className="filter-icon">{ic}</span>{l}
                  </button>
                ))}
              </div>
            </div>

            <div className="sr-sec">
              <div className="sr-ttl">How to use</div>
              <div className="rp-hint" style={{ lineHeight: 1.8 }}>
                1. Click <strong>Auto-detect</strong> to find page edges<br/>
                2. Drag the <strong>4 corner handles</strong> to refine<br/>
                3. Pick a <strong>filter</strong> — Enhanced works well for most scans<br/>
                4. Hit <strong>Apply</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="scan-foot">
          <button className="sf-cancel" onClick={onClose}>Cancel</button>
          <button className="sf-apply" disabled={scanProcessing} onClick={applyScan}>
            {scanProcessing ? 'Processing…' : applyLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
