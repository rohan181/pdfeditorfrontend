'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import BrandImage from 'next/image'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'
import {
  type FilterType, DEF_CORNERS, isDefaultCrop,
  perspectiveWarp, applyFilterToData, sharpenImageData, removeBgData, autoDetect,
} from '@/lib/scanUtils'

type PageSizeOpt = 'A4' | 'Letter' | 'Legal' | 'Fit'
type Orientation  = 'portrait' | 'landscape' | 'auto'
type MarginOpt    = 'none' | 'small' | 'normal'
type QualityOpt   = 'original' | 'compressed'

interface ImgItem {
  id: string
  file: File
  dataUrl: string
  w: number
  h: number
}

const uid = () => Math.random().toString(36).slice(2, 9)

const PAGE_DIMS: Record<PageSizeOpt, [number, number]> = {
  A4:     [595.28, 841.89],
  Letter: [612,    792   ],
  Legal:  [612,    1008  ],
  Fit:    [0,      0     ],
}
const MARGIN_PTS: Record<MarginOpt, number> = { none: 0, small: 14, normal: 36 }

type ImageEmbedPage = {
  pageW: number; pageH: number
  bytes: ArrayBuffer; isJpeg: boolean
  imgX: number; imgY: number; imgW: number; imgH: number
  label: { text: string; y: number; size: number; gray: number } | null
}

type ImageEmbedWorkerResponse =
  | { type: 'progress'; value: number }
  | { type: 'success'; buffer: ArrayBuffer }
  | { type: 'error'; message: string }

function runImageEmbedWorker(
  pages: ImageEmbedPage[],
  onProgress: (value: number) => void,
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../workers/pdf-image-embed.worker.ts', import.meta.url))

    worker.onmessage = (event: MessageEvent<ImageEmbedWorkerResponse>) => {
      const message = event.data
      if (message.type === 'progress') { onProgress(message.value); return }

      worker.terminate()
      if (message.type === 'success') resolve(message.buffer)
      else reject(new Error(message.message))
    }

    worker.onerror = () => {
      worker.terminate()
      reject(new Error('The local PDF engine failed to start. Please reload and try again.'))
    }

    worker.postMessage({ pages }, pages.map(p => p.bytes))
  })
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#0D1B4B;letter-spacing:-.03em}
.logo-name .logo-ai{color:#dc2626;margin-left:2px}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-count{font-size:11px;color:rgba(0,0,0,.38)}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s;white-space:nowrap}
.nbtn.pri{background:#f59e0b;color:#fff}.nbtn.pri:hover{background:#d97706}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.38;cursor:not-allowed}
.body{flex:1;display:flex;overflow:hidden}
.main{flex:1;overflow-y:auto;padding:20px;background:#e8e8ea;min-height:0}
.drop-z{border:2px dashed #d0d0d0;border-radius:16px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa;max-width:680px;margin:40px auto 0}
.drop-z:hover,.drop-z.over{border-color:#f59e0b;background:#fffbeb}
.drop-icon{font-size:48px;margin-bottom:12px}
.drop-txt{font-size:13px;color:rgba(0,0,0,.42);margin-bottom:20px;line-height:1.7}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 24px;background:#1d1d1f;border-radius:9px;font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:background .14s}
.drop-btn:hover{background:#f59e0b}
.fmt-chips{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;flex-wrap:wrap}
.fmt-chip{padding:3px 9px;border-radius:99px;background:#f0f0f0;font-size:10px;font-weight:700;color:rgba(0,0,0,.4);text-transform:uppercase;letter-spacing:.05em}
.grid-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.grid-ttl{font-size:13px;font-weight:700;color:#1d1d1f}
.grid-sub{font-size:11px;color:rgba(0,0,0,.38)}
.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:12px}
.img-card{background:#fff;border-radius:11px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.08);border:2px solid transparent;transition:all .15s;position:relative;cursor:grab;user-select:none}
.img-card:active{cursor:grabbing}
.img-card.drag-over{border-color:#f59e0b;transform:scale(1.03)}
.img-card.dragging{opacity:.38}
.img-card-thumb{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;pointer-events:none;background:#f5f5f5}
.img-card-body{padding:7px 8px 8px}
.img-card-name{font-size:10px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.img-card-dims{font-size:9px;color:rgba(0,0,0,.35);margin-top:1px}
.img-card-actions{display:flex;gap:4px;margin-top:6px}
.ic-btn{flex:1;padding:4px 0;border-radius:5px;border:1px solid #e0e0e0;background:#fff;font-size:9px;font-weight:700;cursor:pointer;color:rgba(0,0,0,.5);transition:all .12s;text-align:center}
.ic-btn:hover{border-color:#f59e0b;color:#d97706;background:#fffbeb}
.ic-btn.del:hover{border-color:rgba(226,75,74,.5);color:#E24B4A;background:rgba(226,75,74,.06)}
.img-card-del{position:absolute;top:5px;right:5px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.55);border:none;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;transition:background .12s}
.img-card-del:hover{background:#E24B4A}
.img-card-num{position:absolute;top:5px;left:5px;background:rgba(0,0,0,.55);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:99px;z-index:2;line-height:1.4}
.img-card-badge{position:absolute;bottom:38px;left:5px;background:#f59e0b;color:#fff;font-size:8px;font-weight:800;padding:2px 5px;border-radius:4px;z-index:2;line-height:1.4;text-transform:uppercase;letter-spacing:.04em}
.add-more{border:2px dashed #d0d0d0;border-radius:11px;aspect-ratio:1/1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;color:rgba(0,0,0,.3);font-size:11px;font-weight:700;transition:all .14s;background:#fff}
.add-more:hover{border-color:#f59e0b;color:#f59e0b;background:#fffbeb}
.right{width:218px;flex-shrink:0;background:#fff;border-left:1px solid #e8e8e8;overflow-y:auto;display:flex;flex-direction:column}
.rp-sec{padding:12px 14px;border-bottom:1px solid #f0f0f0}
.rp-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.seg{display:flex;border:1.5px solid #e0e0e0;border-radius:8px;overflow:hidden}
.seg-btn{flex:1;padding:6px 4px;font-size:10px;font-weight:700;border:none;background:#fff;cursor:pointer;color:rgba(0,0,0,.4);transition:all .12s;text-align:center}
.seg-btn.sel{background:#f59e0b;color:#fff}
.seg-btn:not(.sel):hover{background:#fffbeb;color:#d97706}
.tog-row{display:flex;align-items:center;justify-content:space-between}
.tog-lbl{font-size:11px;color:rgba(0,0,0,.55)}
.tog{width:30px;height:17px;border-radius:8px;border:none;cursor:pointer;position:relative;transition:background .14s;flex-shrink:0}
.tog.on{background:#f59e0b}.tog.off{background:#d0d0d0}
.tok{position:absolute;top:2px;width:13px;height:13px;border-radius:50%;background:#fff;transition:left .14s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tog.on .tok{left:15px}.tog.off .tok{left:2px}
.rp-hint{font-size:9px;color:rgba(0,0,0,.3);margin-top:6px;line-height:1.5}
.converting{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center}
.conv-card{background:#fff;border-radius:16px;padding:32px 40px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.2)}
.conv-spin{width:44px;height:44px;border:4px solid #f0f0f0;border-top-color:#f59e0b;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px}
@keyframes spin{to{transform:rotate(360deg)}}
.conv-lbl{font-size:14px;font-weight:700;color:#1d1d1f}
.conv-sub{font-size:11px;color:rgba(0,0,0,.38);margin-top:5px}
.err-bar{margin:10px 16px;padding:10px 14px;border:1px solid rgba(220,38,38,.22);border-radius:9px;background:#fff5f5;color:#dc2626;font-size:12px;font-weight:600;text-align:center}
.lp{min-height:100vh;display:flex;flex-direction:column;background:#fff}
.lp-uc{max-width:700px;margin:0 auto;padding:56px 24px;width:100%}
.lp-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#fffbeb;border:1px solid rgba(245,158,11,.3);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#d97706;margin-bottom:14px;text-transform:uppercase}
.lp-h1{font-size:clamp(26px,5vw,44px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.lp-h1 em{font-style:normal;color:#f59e0b}
.lp-sub{font-size:14px;color:rgba(0,0,0,.42);line-height:1.7;max-width:440px;margin:0 auto 32px}
.lp-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}
.lp-feat{padding:14px 12px;border:1px solid #e8e8e8;border-radius:12px;text-align:center}
.lp-feat-icon{font-size:22px;margin-bottom:6px}
.lp-feat-ttl{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.lp-feat-body{font-size:10px;color:rgba(0,0,0,.38);line-height:1.5}

/* Smart Scan modal */
.scan-back{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(5px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
.scan-modal{background:#fff;border-radius:16px;box-shadow:0 28px 90px rgba(0,0,0,.25);width:100%;max-width:920px;display:flex;flex-direction:column;overflow:hidden;max-height:calc(100vh - 32px)}
.scan-head{padding:14px 18px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:10px;flex-shrink:0}
.scan-title{font-size:14px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em;flex:1}
.scan-subtitle{font-size:10px;color:rgba(0,0,0,.35);font-weight:500}
.scan-close{width:28px;height:28px;border-radius:50%;border:none;background:#f0f0f0;color:#555;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .12s}
.scan-close:hover{background:#e0e0e0;color:#111}
.scan-body{flex:1;display:flex;overflow:hidden;min-height:0}
.scan-left{flex:1;background:#2a2a2e;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;min-height:0}
.scan-canvas{display:block;max-width:100%;max-height:100%;object-fit:contain;touch-action:none}
.scan-right{width:230px;flex-shrink:0;border-left:1px solid #f0f0f0;overflow-y:auto;display:flex;flex-direction:column;gap:0}
.sr-sec{padding:12px 14px;border-bottom:1px solid #f0f0f0}
.sr-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.filter-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.filter-btn{padding:8px 4px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;text-align:center;transition:all .12s;font-size:9px;font-weight:700;color:rgba(0,0,0,.45)}
.filter-btn.sel{border-color:#f59e0b;background:#fffbeb;color:#d97706}
.filter-btn:not(.sel):hover{border-color:#d0d0d0;background:#f8f8f8}
.filter-icon{font-size:18px;display:block;margin-bottom:3px}
.auto-btn{width:100%;padding:9px;border-radius:8px;border:1.5px solid #6366f1;background:#f0f0ff;color:#6366f1;font-size:11px;font-weight:700;cursor:pointer;transition:all .13s;display:flex;align-items:center;justify-content:center;gap:5px}
.auto-btn:hover{background:#e8e8ff;border-color:#4f46e5}
.auto-btn:disabled{opacity:.38;cursor:not-allowed}
.reset-btn{width:100%;padding:7px;border-radius:7px;border:1px solid #e0e0e0;background:#fff;color:rgba(0,0,0,.4);font-size:10px;font-weight:700;cursor:pointer;transition:all .12s;margin-top:6px}
.reset-btn:hover{border-color:#bbb;color:rgba(0,0,0,.6)}
.scan-foot{padding:12px 18px;border-top:1px solid #f0f0f0;display:flex;gap:8px;align-items:center;flex-shrink:0}
.sf-cancel{padding:9px 16px;border-radius:8px;border:1px solid #e0e0e0;background:#fff;font-size:12px;font-weight:700;cursor:pointer;color:rgba(0,0,0,.5)}
.sf-cancel:hover{border-color:#bbb;color:#1d1d1f}
.sf-apply{flex:1;padding:10px;border-radius:8px;border:none;background:#f59e0b;color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:background .13s}
.sf-apply:hover:not(:disabled){background:#d97706}
.sf-apply:disabled{opacity:.38;cursor:not-allowed}
.corner-hint{font-size:10px;color:rgba(255,255,255,.5);text-align:center;position:absolute;bottom:8px;left:0;right:0;pointer-events:none}
@media(max-width:900px){
  .pg{height:auto;min-height:100dvh;overflow:visible}
  .body{flex:none;flex-direction:column;overflow:visible}
  .main{order:2;overflow:visible;padding:14px;min-height:48dvh}
  .right{order:1;width:100%;max-height:none;overflow:visible;border-left:0;border-bottom:1px solid #e8e8e8}
  .img-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
  .drop-z{margin:16px auto 0;padding:36px 18px}
  .lp-uc{padding:32px 16px}.lp-feats{grid-template-columns:1fr}
  .scan-body{flex-direction:column;overflow-y:auto}
  .scan-left{min-height:42dvh}.scan-right{width:100%;border-left:0;border-top:1px solid #f0f0f0;overflow:visible}
  .scan-foot{padding:10px 12px}
}
`

export default function ImageToPDFPage() {
  const [images,     setImages]     = useState<ImgItem[]>([])
  const [pageSize,   setPageSize]   = useState<PageSizeOpt>('A4')
  const [orient,     setOrient]     = useState<Orientation>('auto')
  const [margin,     setMargin]     = useState<MarginOpt>('small')
  const [quality,    setQuality]    = useState<QualityOpt>('original')
  const [pageNums,   setPageNums]   = useState(false)
  const [converting, setConverting] = useState(false)
  const [progress,   setProgress]   = useState('')
  const [dragIdx,    setDragIdx]    = useState<number | null>(null)
  const [overIdx,    setOverIdx]    = useState<number | null>(null)

  // Smart Scan state
  const [scanItem,      setScanItem]      = useState<ImgItem | null>(null)
  const [scanCorners,   setScanCorners]   = useState<[number,number][]>([...DEF_CORNERS])
  const [scanFilter,    setScanFilter]    = useState<FilterType>('original')
  const [scanBgRemove,  setScanBgRemove]  = useState(false)
  const [scanProcessing,setScanProcessing]= useState(false)
  const [autoDetecting, setAutoDetecting] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const dropZoneRef    = useRef<HTMLDivElement>(null)
  const mainDropRef    = useRef<HTMLDivElement>(null)
  const scanCanvasRef  = useRef<HTMLCanvasElement>(null)
  const scanDragCorner = useRef<number | null>(null)
  const scanImgRef     = useRef<HTMLImageElement | null>(null)

  // ── Load images (with HEIC conversion) ──────────────────────────────────
  const loadFiles = useCallback((files: FileList | File[]) => {
    setError('')
    const isHeic = (f: File) =>
      f.type === 'image/heic' || f.type === 'image/heif' ||
      /\.(heic|heif)$/i.test(f.name)

    const accepted = Array.from(files).filter(f =>
      f.type.startsWith('image/') || isHeic(f)
    )

    accepted.forEach(async (file) => {
      let blob: Blob = file

      if (isHeic(file)) {
        try {
          const heic2any = (await import('heic2any')).default
          const result = await heic2any({ blob: file, toType: 'image/png', quality: 1 })
          blob = Array.isArray(result) ? result[0] : result
        } catch {
          console.warn('HEIC conversion failed for', file.name)
          setError(`Could not read ${file.name}. Try converting it to JPG or PNG first.`)
          return
        }
      }

      const reader = new FileReader()
      reader.onload = ev => {
        const dataUrl = ev.target?.result as string
        const img = new Image()
        img.onload = () => setImages(prev => [...prev, {
          id: uid(), file, dataUrl,
          w: img.naturalWidth, h: img.naturalHeight,
        }])
        img.src = dataUrl
      }
      reader.readAsDataURL(blob)
    })
  }, [])

  useEffect(() => {
    const el = mainDropRef.current; if (!el) return
    const ov = (e: DragEvent) => e.preventDefault()
    const dp = (e: DragEvent) => { e.preventDefault(); if (e.dataTransfer?.files) loadFiles(e.dataTransfer.files) }
    el.addEventListener('dragover', ov); el.addEventListener('drop', dp)
    return () => { el.removeEventListener('dragover', ov); el.removeEventListener('drop', dp) }
  }, [loadFiles, images.length])

  useEffect(() => {
    const el = dropZoneRef.current; if (!el) return
    const ov = (e: DragEvent) => { e.preventDefault(); el.classList.add('over') }
    const lv = () => el.classList.remove('over')
    const dp = (e: DragEvent) => { e.preventDefault(); el.classList.remove('over'); if (e.dataTransfer?.files) loadFiles(e.dataTransfer.files) }
    el.addEventListener('dragover', ov); el.addEventListener('dragleave', lv); el.addEventListener('drop', dp)
    return () => { el.removeEventListener('dragover', ov); el.removeEventListener('dragleave', lv); el.removeEventListener('drop', dp) }
  }, [loadFiles])

  // ── Drag-to-reorder ──────────────────────────────────────────────────────
  const onDragStart = (i: number) => setDragIdx(i)
  const onDragOver  = (e: React.DragEvent, i: number) => { e.preventDefault(); setOverIdx(i) }
  const onDrop      = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return }
    setImages(prev => {
      const next = [...prev]; const [m] = next.splice(dragIdx, 1); next.splice(i, 0, m); return next
    })
    setDragIdx(null); setOverIdx(null)
  }
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null) }

  // ── Page dims ────────────────────────────────────────────────────────────
  const getPageDims = (item: ImgItem): [number,number] => {
    if (pageSize === 'Fit') return [item.w * 0.75, item.h * 0.75]
    const [pw, ph] = PAGE_DIMS[pageSize]
    const landscape = orient === 'landscape' || (orient === 'auto' && item.w > item.h)
    return landscape ? [ph, pw] : [pw, ph]
  }

  // ── Get image bytes for pdf-lib ──────────────────────────────────────────
  const getImgBytes = async (item: ImgItem): Promise<{ bytes: Uint8Array; isJpeg: boolean }> => {
    const isJpeg = item.file.type === 'image/jpeg' || item.file.type === 'image/jpg'
    const isPng  = item.file.type === 'image/png'
    if (quality === 'original' && (isJpeg || isPng))
      return { bytes: new Uint8Array(await item.file.arrayBuffer()), isJpeg }
    const canvas = document.createElement('canvas'); canvas.width=item.w; canvas.height=item.h
    const ctx = canvas.getContext('2d')!
    const img = new Image(); img.src = item.dataUrl
    await new Promise<void>(r => { img.complete ? r() : (img.onload = () => r()) })
    ctx.drawImage(img, 0, 0)
    const mime = quality === 'compressed' ? 'image/jpeg' : 'image/png'
    const url = canvas.toDataURL(mime, quality === 'compressed' ? 0.72 : 1)
    const b64 = url.split(',')[1], bin = atob(b64)
    const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
    return { bytes: arr, isJpeg: quality === 'compressed' }
  }

  // ── Convert to PDF ───────────────────────────────────────────────────────
  const convert = async () => {
    if (!images.length) return
    setError('')
    setConverting(true)
    try {
      const workerPages: ImageEmbedPage[] = []
      for (let i = 0; i < images.length; i++) {
        const item = images[i]; setProgress(`Preparing image ${i+1} of ${images.length}…`)
        const { bytes, isJpeg } = await getImgBytes(item)
        const [pw, ph] = getPageDims(item)
        const mp=MARGIN_PTS[margin],aw=pw-mp*2,ah=ph-mp*2
        const scale=Math.min(aw/item.w,ah/item.h)
        const iw=item.w*scale,ih=item.h*scale
        workerPages.push({
          pageW: pw, pageH: ph,
          bytes: bytes.buffer as ArrayBuffer, isJpeg,
          imgX: mp+(aw-iw)/2, imgY: mp+(ah-ih)/2, imgW: iw, imgH: ih,
          label: pageNums ? { text: String(i+1), y: mp>10?mp-10:4, size: 8, gray: 0.5 } : null,
        })
      }
      setProgress('Building PDF…')
      const out = await runImageEmbedWorker(workerPages, pct =>
        setProgress(`Building PDF… ${pct}%`))
      const blob = new Blob([out],{type:'application/pdf'})
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a'); a.href=url; a.download=`images-to-pdf-${Date.now()}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      setError('Could not create the PDF. Check the images and try again.')
    } finally { setConverting(false); setProgress('') }
  }

  // ── Smart Scan: open modal ────────────────────────────────────────────────
  const openScan = (item: ImgItem) => {
    setScanItem(item)
    setScanCorners([...DEF_CORNERS])
    setScanFilter('original')
    setScanBgRemove(false)
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

    const pts = scanCorners.map(([x,y]): [number,number] => [x*cv.width, y*cv.height])

    // Dark overlay outside selection
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,.48)'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.moveTo(pts[0][0],pts[0][1])
    ctx.lineTo(pts[1][0],pts[1][1])
    ctx.lineTo(pts[2][0],pts[2][1])
    ctx.lineTo(pts[3][0],pts[3][1])
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // Selection border + grid
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(pts[0][0],pts[0][1])
    pts.slice(1).forEach(([x,y]) => ctx.lineTo(x,y))
    ctx.closePath(); ctx.stroke()

    // Thirds grid inside selection
    ctx.save(); ctx.globalAlpha = .35; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.setLineDash([3,4])
    for (let t = 1; t <= 2; t++) {
      const lerp = (a:[number,number], b:[number,number]) => [(a[0]*(3-t)+b[0]*t)/3, (a[1]*(3-t)+b[1]*t)/3] as [number,number]
      const [l0,r0]=[ lerp(pts[0],pts[1]), lerp(pts[3],pts[2]) ]
      const [l1,r1]=[ lerp(pts[0],pts[3]), lerp(pts[1],pts[2]) ]
      ctx.beginPath(); ctx.moveTo(l0[0],l0[1]); ctx.lineTo(r0[0],r0[1]); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(l1[0],l1[1]); ctx.lineTo(r1[0],r1[1]); ctx.stroke()
    }
    ctx.restore()

    // Corner handles
    pts.forEach(([x,y], i) => {
      ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2)
      ctx.fillStyle = '#f59e0b'; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(['TL','TR','BR','BL'][i], x, y)
    })
  }, [scanItem, scanCorners])

  useEffect(() => {
    if (!scanItem) { scanImgRef.current = null; return }
    const cv = scanCanvasRef.current; if (!cv) return
    // Size canvas to fit the panel (640px wide max, maintain aspect)
    const maxW = 640, maxH = 500
    const aspect = scanItem.w / scanItem.h
    cv.width  = Math.min(maxW, maxH * aspect)
    cv.height = cv.width / aspect
    drawScanCanvas()
  }, [scanItem, drawScanCanvas])

  useEffect(() => { if (scanItem) drawScanCanvas() }, [scanCorners, scanFilter, scanBgRemove, drawScanCanvas, scanItem])

  // ── Smart Scan: corner drag ───────────────────────────────────────────────
  const onScanMouseDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cv = scanCanvasRef.current!
    const rect = cv.getBoundingClientRect()
    const mx = (e.clientX-rect.left)*(cv.width/rect.width)
    const my = (e.clientY-rect.top)*(cv.height/rect.height)
    scanCorners.forEach(([x,y],i) => {
      if (Math.hypot(mx-x*cv.width, my-y*cv.height) < 18) scanDragCorner.current = i
    })
  }
  const onScanMouseMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const i = scanDragCorner.current; if (i === null) return
    const cv = scanCanvasRef.current!
    const rect = cv.getBoundingClientRect()
    const nx = Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))
    const ny = Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))
    setScanCorners(prev => prev.map((c,j) => j===i?[nx,ny]:c) as [number,number][])
  }
  const onScanMouseUp = () => { scanDragCorner.current = null }

  // ── Smart Scan: auto-detect ───────────────────────────────────────────────
  const runAutoDetect = async () => {
    if (!scanItem) return
    setAutoDetecting(true)
    await new Promise(r => setTimeout(r, 0)) // yield to UI
    const cv = document.createElement('canvas')
    cv.width = scanItem.w; cv.height = scanItem.h
    const ctx = cv.getContext('2d')!
    const img = new Image(); img.src = scanItem.dataUrl
    await new Promise<void>(r => { img.complete ? r() : (img.onload = () => r()) })
    ctx.drawImage(img, 0, 0)
    const corners = autoDetect(cv)
    setScanCorners(corners)
    setAutoDetecting(false)
  }

  // ── Smart Scan: apply ─────────────────────────────────────────────────────
  const applyScan = async () => {
    if (!scanItem) return
    setScanProcessing(true)
    try {
      // Build source canvas
      const srcCv = document.createElement('canvas')
      srcCv.width = scanItem.w; srcCv.height = scanItem.h
      const srcCtx = srcCv.getContext('2d')!
      const img = new Image(); img.src = scanItem.dataUrl
      await new Promise<void>(r => { img.complete ? r() : (img.onload = () => r()) })
      srcCtx.drawImage(img, 0, 0)

      // Perspective warp
      let workCv: HTMLCanvasElement
      if (!isDefaultCrop(scanCorners)) {
        const px = scanCorners.map(([x,y]): [number,number] => [x*scanItem.w, y*scanItem.h])
        const tw = Math.hypot(px[1][0]-px[0][0],px[1][1]-px[0][1])
        const bw = Math.hypot(px[2][0]-px[3][0],px[2][1]-px[3][1])
        const lh = Math.hypot(px[3][0]-px[0][0],px[3][1]-px[0][1])
        const rh = Math.hypot(px[2][0]-px[1][0],px[2][1]-px[1][1])
        const outW = Math.min(3000, Math.round((tw+bw)/2))
        const outH = Math.min(3000, Math.round((lh+rh)/2))
        const dataUrl = perspectiveWarp(srcCv, px, outW, outH)
        workCv = document.createElement('canvas'); workCv.width=outW; workCv.height=outH
        const wCtx = workCv.getContext('2d')!
        const wi = new Image(); wi.src = dataUrl
        await new Promise<void>(r => { wi.complete ? r() : (wi.onload = () => r()) })
        wCtx.drawImage(wi, 0, 0)
      } else {
        workCv = srcCv
      }

      // Filters
      if (scanFilter !== 'original') {
        const wCtx = workCv.getContext('2d')!
        let id = wCtx.getImageData(0, 0, workCv.width, workCv.height)
        if (scanFilter === 'sharpen') id = sharpenImageData(id)
        else applyFilterToData(id.data, scanFilter)
        wCtx.putImageData(id, 0, 0)
      }

      // Background removal
      if (scanBgRemove) {
        const wCtx = workCv.getContext('2d')!
        const id = wCtx.getImageData(0, 0, workCv.width, workCv.height)
        wCtx.putImageData(removeBgData(id), 0, 0)
      }

      const dataUrl = workCv.toDataURL('image/png')
      const finalImg = new Image(); finalImg.src = dataUrl
      await new Promise<void>(r => { finalImg.complete ? r() : (finalImg.onload = () => r()) })
      setImages(prev => prev.map(it => it.id!==scanItem.id ? it : { ...it, dataUrl, w:workCv.width, h:workCv.height }))
      setScanItem(null)
    } finally { setScanProcessing(false) }
  }

  // ── Upload landing ────────────────────────────────────────────────────────
  if (!images.length) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="lp">
          <SiteNav />
          <div className="lp-uc">
            <div style={{textAlign:'center',marginBottom:32}}>
              <div className="lp-badge">🖼 Image → PDF</div>
              <h1 className="lp-h1">Turn images into<br/>a <em>PDF</em> instantly</h1>
              <p className="lp-sub">Upload JPG, PNG, WEBP, GIF or BMP — scan, crop, enhance and convert. Everything runs in your browser.</p>
            </div>
            <div ref={dropZoneRef} className="drop-z" onClick={() => fileInputRef.current?.click()}>
              <div className="drop-icon">🖼</div>
              <div className="drop-txt">Drop images here, or click to choose<br/><span style={{fontSize:11,color:'rgba(0,0,0,.28)'}}>Multiple files supported · nothing leaves your browser</span></div>
              <button className="drop-btn" onClick={e=>{e.stopPropagation();fileInputRef.current?.click()}}>Choose Images</button>
              <div className="fmt-chips" style={{marginTop:18}}>
                {['JPG','PNG','WEBP','GIF','BMP','HEIC'].map(f=><span key={f} className="fmt-chip">{f}</span>)}
              </div>
            </div>
            {error && <div role="alert" className="err-bar">{error}</div>}
            <div className="lp-feats">
              {[{icon:'📷',t:'Smart Scan',b:'Auto-detect & crop document edges, fix perspective'},{icon:'🎨',t:'Filters',b:'Enhanced, B&W, sepia, sharpen — per image'},{icon:'🔒',t:'100% private',b:'In-browser only — no server uploads'}].map(f=>(
                <div key={f.t} className="lp-feat"><div className="lp-feat-icon">{f.icon}</div><div className="lp-feat-ttl">{f.t}</div><div className="lp-feat-body">{f.b}</div></div>
              ))}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" multiple style={{display:'none'}} onChange={e=>{if(e.target.files)loadFiles(e.target.files);e.target.value=''}} />
        </div>
        <ToolSEOSection {...toolSeoData['image-to-pdf']} />
      </>
    )
  }

  // ── Editor ────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pg">
        <nav className="nav">
          <Link href="/" className="logo">
            <BrandImage src="/logo-v2.svg" alt="EditPDF AI" width={380} height={100} style={{ width: '114px', height: '30px' }} priority />
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">Image → PDF</span>
          <span className="nav-count">{images.length} image{images.length!==1?'s':''}</span>
          <div className="nav-sp" />
          <button className="nbtn sec" onClick={() => setImages([])}>← New</button>
          <button className="nbtn pri" disabled={converting} onClick={convert}>{converting?'Converting…':'↓ Convert to PDF'}</button>
        </nav>
        {error && <div role="alert" className="err-bar">{error}</div>}

        <div className="body">
          <div className="main" ref={mainDropRef}>
            <div className="grid-header">
              <div>
                <div className="grid-ttl">Images ({images.length})</div>
                <div className="grid-sub">Drag cards to reorder · click ✨ Scan to crop & enhance</div>
              </div>
            </div>

            <div className="img-grid">
              {images.map((img, i) => (
                <div key={img.id}
                  className={`img-card${dragIdx===i?' dragging':''}${overIdx===i&&dragIdx!==i?' drag-over':''}`}
                  draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)}
                  onDrop={e=>onDrop(e,i)} onDragEnd={onDragEnd}>
                  <span className="img-card-num">{i+1}</span>
                  <img className="img-card-thumb" src={img.dataUrl} alt={img.file.name} loading="lazy" />
                  <div className="img-card-body">
                    <div className="img-card-name">{img.file.name}</div>
                    <div className="img-card-dims">{img.w}×{img.h}</div>
                    <div className="img-card-actions">
                      <button className="ic-btn" onClick={e=>{e.stopPropagation();openScan(img)}}>✨ Scan</button>
                      <button className="ic-btn del" aria-label={`Remove ${img.file.name}`} onClick={e=>{e.stopPropagation();setImages(p=>p.filter(x=>x.id!==img.id))}}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="add-more" onClick={() => fileInputRef.current?.click()}>
                <span style={{fontSize:28}}>+</span><span>Add images</span>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="rp-sec">
              <div className="rp-ttl">Page Size</div>
              <div className="seg" style={{flexWrap:'wrap'}}>
                {(['A4','Letter','Legal','Fit'] as PageSizeOpt[]).map((s,idx) => (
                  <button key={s} className={`seg-btn${pageSize===s?' sel':''}`} onClick={()=>setPageSize(s)}
                    style={{flexBasis:'50%',borderRight:idx%2===0?'1px solid #e0e0e0':undefined}}>
                    {s==='Fit'?'Fit Image':s}
                  </button>
                ))}
              </div>
              {pageSize==='Fit'&&<div className="rp-hint">Each page sized exactly to its image.</div>}
            </div>
            <div className="rp-sec">
              <div className="rp-ttl">Orientation</div>
              <div className="seg">
                {(['portrait','landscape','auto'] as Orientation[]).map(o=>(
                  <button key={o} className={`seg-btn${orient===o?' sel':''}`} onClick={()=>setOrient(o)} style={{fontSize:9}}>
                    {o.charAt(0).toUpperCase()+o.slice(1)}
                  </button>
                ))}
              </div>
              {orient==='auto'&&<div className="rp-hint">Portrait for tall, landscape for wide images.</div>}
            </div>
            <div className="rp-sec">
              <div className="rp-ttl">Margins</div>
              <div className="seg">
                {(['none','small','normal'] as MarginOpt[]).map(m=>(
                  <button key={m} className={`seg-btn${margin===m?' sel':''}`} onClick={()=>setMargin(m)} style={{fontSize:9}}>
                    {m.charAt(0).toUpperCase()+m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="rp-sec">
              <div className="rp-ttl">Quality</div>
              <div className="seg">
                {([['original','Original'],['compressed','Compressed']] as [QualityOpt,string][]).map(([v,l])=>(
                  <button key={v} className={`seg-btn${quality===v?' sel':''}`} onClick={()=>setQuality(v)} style={{fontSize:9}}>{l}</button>
                ))}
              </div>
              {quality==='compressed'&&<div className="rp-hint">JPEG 72% — smaller file size.</div>}
            </div>
            <div className="rp-sec">
              <div className="tog-row">
                <span className="tog-lbl">Page numbers</span>
                <button type="button" className={`tog${pageNums?' on':' off'}`} aria-pressed={pageNums} aria-label="Include page numbers" onClick={()=>setPageNums(p=>!p)}><span className="tok"/></button>
              </div>
            </div>
            <div style={{padding:14,marginTop:'auto'}}>
              <button style={{width:'100%',padding:11,borderRadius:9,border:'none',background:'#f59e0b',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer',transition:'background .14s'}}
                disabled={converting} onClick={convert}
                onMouseOver={e=>(e.currentTarget.style.background='#d97706')}
                onMouseOut={e=>(e.currentTarget.style.background='#f59e0b')}>
                {converting?'Converting…':`↓ Convert ${images.length} image${images.length!==1?'s':''} to PDF`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Converting overlay */}
      {converting && (
        <div className="converting">
          <div className="conv-card">
            <div className="conv-spin"/>
            <div className="conv-lbl">Converting to PDF</div>
            <div className="conv-sub">{progress}</div>
          </div>
        </div>
      )}

      {/* ── Smart Scan modal ── */}
      {scanItem && (
        <div className="scan-back" onClick={() => setScanItem(null)}>
          <div className="scan-modal" onClick={e => e.stopPropagation()}>

            <div className="scan-head">
              <div>
                <div className="scan-title">✨ Smart Scan</div>
                <div className="scan-subtitle">{scanItem.file.name} · {scanItem.w}×{scanItem.h}</div>
              </div>
              <button className="scan-close" aria-label="Close smart scan" onClick={() => setScanItem(null)}>×</button>
            </div>

            <div className="scan-body">
              {/* Canvas */}
              <div className="scan-left">
                <canvas ref={scanCanvasRef} className="scan-canvas"
                  style={{cursor:'crosshair'}}
                  onPointerDown={onScanMouseDown}
                  onPointerMove={onScanMouseMove}
                  onPointerUp={onScanMouseUp}
                  onPointerCancel={onScanMouseUp}
                  onMouseLeave={onScanMouseUp}/>
                <div className="corner-hint">Drag corner handles · TL TR BR BL</div>
              </div>

              {/* Options */}
              <div className="scan-right">
                <div className="sr-sec">
                  <div className="sr-ttl">Edge Detection</div>
                  <button className="auto-btn" disabled={autoDetecting} onClick={runAutoDetect}>
                    {autoDetecting ? <><span style={{display:'inline-block',width:12,height:12,border:'2px solid #6366f1',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}/> Detecting…</> : '🔍 Auto-detect document edges'}
                  </button>
                  <button className="reset-btn" onClick={() => setScanCorners([...DEF_CORNERS])}>
                    Reset corners to full image
                  </button>
                </div>

                <div className="sr-sec">
                  <div className="sr-ttl">Filter</div>
                  <div className="filter-grid">
                    {([
                      ['original','Original','🖼'],
                      ['enhanced','Enhanced','✨'],
                      ['grayscale','Grayscale','⬜'],
                      ['bw','B&W','◼'],
                      ['sepia','Sepia','🟫'],
                      ['sharpen','Sharpen','🔪'],
                    ] as [FilterType,string,string][]).map(([v,l,ic]) => (
                      <button key={v} className={`filter-btn${scanFilter===v?' sel':''}`} onClick={() => setScanFilter(v)}>
                        <span className="filter-icon">{ic}</span>{l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sr-sec">
                  <div className="sr-ttl">Background</div>
                  <div className="tog-row">
                    <span className="tog-lbl">Remove white bg</span>
                    <button type="button" className={`tog${scanBgRemove?' on':' off'}`} aria-pressed={scanBgRemove} aria-label="Remove white background" onClick={() => setScanBgRemove(p=>!p)}><span className="tok"/></button>
                  </div>
                  <div className="rp-hint" style={{marginTop:6}}>Strips near-white pixels to transparent — useful for receipts & signatures.</div>
                </div>

                <div className="sr-sec">
                  <div className="sr-ttl">How to use</div>
                  <div className="rp-hint" style={{lineHeight:1.8}}>
                    1. Click <strong>Auto-detect</strong> to find doc edges<br/>
                    2. Drag the <strong>4 corner handles</strong> to refine<br/>
                    3. Pick a <strong>filter</strong> (Enhanced works great for scans)<br/>
                    4. Hit <strong>Apply</strong> — replaces the image in your list
                  </div>
                </div>
              </div>
            </div>

            <div className="scan-foot">
              <button className="sf-cancel" onClick={() => setScanItem(null)}>Cancel</button>
              <button className="sf-apply" disabled={scanProcessing} onClick={applyScan}>
                {scanProcessing ? 'Processing…' : '✓ Apply to image'}
              </button>
            </div>

          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" multiple style={{display:'none'}}
        onChange={e=>{if(e.target.files)loadFiles(e.target.files);e.target.value=''}} />
      <ToolSEOSection {...toolSeoData['image-to-pdf']} />
    </>
  )
}
