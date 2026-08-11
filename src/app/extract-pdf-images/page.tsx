'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Archive,
  Check,
  Download,
  FileCheck2,
  FileImage,
  FileText,
  Image as ImageIcon,
  Images,
  Layers,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 300
const MAX_UNIQUE_IMAGES = 500
const MAX_IMAGE_PIXELS = 40_000_000
const MAX_UNIQUE_PIXELS = 100_000_000
const MAX_PROCESSED_PIXELS = 220_000_000

type ImageSource = 'Image XObject' | 'Inline image'
type ExtractedImage = {
  id: string
  blob: Blob
  url: string
  width: number
  height: number
  pages: number[]
  placements: number
  sources: ImageSource[]
  hash: string
}

type PdfImageData = {
  width: number
  height: number
  kind?: number
  data?: Uint8Array | Uint8ClampedArray
  bitmap?: CanvasImageSource
}

type PdfLoadingTask = {
  promise: Promise<unknown>
  destroy: () => Promise<void>
  onPassword?: () => void
}

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.extract-images-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.extract-images-wrap{width:min(1040px,calc(100% - 40px));margin:0 auto}
.extract-images-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 5%,rgba(147,51,234,.14),transparent 40%),linear-gradient(180deg,#fbf7ff 0%,#fff 100%)}.extract-images-hero::before,.extract-images-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(147,51,234,.1);border-radius:999px}.extract-images-hero::before{width:350px;height:350px;left:-220px;top:-220px}.extract-images-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.extract-images-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(147,51,234,.2);border-radius:999px;background:#fff;color:#7e22ce;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(147,51,234,.08)}.extract-images-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.extract-images-hero h1 span{color:#9333ea}.extract-images-hero p{max-width:650px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.extract-images-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.extract-images-trust span{display:flex;align-items:center;gap:5px}
.extract-images-main{padding:38px 0 72px}.extract-images-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.extract-images-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.extract-images-drop:hover,.extract-images-drop.dragging{border-color:#9333ea;background:#faf5ff;transform:translateY(-1px)}.extract-images-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#7e22ce,#c084fc);color:#fff;box-shadow:0 12px 28px rgba(147,51,234,.24)}.extract-images-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.extract-images-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.extract-images-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.extract-images-private{margin-top:13px;color:#7e22ce;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.extract-images-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #e9d5ff;border-radius:13px;background:#faf5ff}.extract-images-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#f3e8ff;color:#7e22ce;flex:0 0 auto}.extract-images-file-info{min-width:0;flex:1}.extract-images-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.extract-images-file-size{margin-top:3px;color:#64748b;font-size:10px}.extract-images-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #e9d5ff;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.extract-images-remove:hover{border-color:#ef4444;color:#ef4444}
.extract-images-progress{padding:25px 4px 11px;text-align:center}.extract-images-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#f3e8ff;color:#7e22ce;animation:extract-images-pulse 1.5s ease-in-out infinite}.extract-images-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.extract-images-progress p{margin:0 0 19px;color:#64748b;font-size:12px}.extract-images-track{height:7px;border-radius:99px;background:#e2e8f0;overflow:hidden}.extract-images-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#7e22ce,#c084fc);transition:width .3s ease}
.extract-images-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.extract-images-summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 17px;border:1px solid #e9d5ff;border-radius:14px;background:#faf5ff}.extract-images-summary strong{display:block;font:800 15px/1.3 var(--font-jakarta,system-ui)}.extract-images-summary span{display:block;margin-top:3px;color:#64748b;font-size:10px}.extract-images-zip{display:inline-flex;align-items:center;gap:8px;padding:11px 15px;border:0;border-radius:10px;background:#7e22ce;color:#fff;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap}.extract-images-zip:disabled{opacity:.55;cursor:wait}
.extract-images-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:13px;margin-top:14px}.extracted-image{min-width:0;overflow:hidden;border:1px solid #e2e8f0;border-radius:14px;background:#fff}.extracted-image-preview{display:grid;place-items:center;aspect-ratio:4/3;padding:12px;background-color:#f8fafc;background-image:linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%);background-size:18px 18px;background-position:0 0,0 9px,9px -9px,-9px 0}.extracted-image-preview img{display:block;max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 5px 10px rgba(15,23,42,.12))}.extracted-image-body{padding:12px}.extracted-image-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.extracted-image-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:800}.extracted-image-download{display:grid;place-items:center;width:31px;height:31px;border:1px solid #d8b4fe;border-radius:8px;background:#fff;color:#7e22ce;cursor:pointer;flex:0 0 auto}.extracted-image-meta{margin-top:7px;color:#64748b;font-size:9px;line-height:1.55}.extracted-image-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}.extracted-image-tag{padding:4px 6px;border-radius:6px;background:#f1f5f9;color:#475569;font-size:8px;font-weight:700}
.extract-images-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:15px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.extract-images-warning svg{flex:0 0 auto;margin-top:1px}.extract-images-again{display:flex;justify-content:center;margin-top:17px}.extract-images-again button{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.extract-images-empty{text-align:center;padding:24px 10px 10px}.extract-images-empty-icon{display:grid;place-items:center;width:62px;height:62px;margin:0 auto 16px;border-radius:18px;background:#f1f5f9;color:#64748b}.extract-images-empty h2{margin:0 0 8px;font:800 21px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.extract-images-empty p{max-width:540px;margin:0 auto;color:#64748b;font-size:12px;line-height:1.65}.extract-images-empty button{display:inline-flex;align-items:center;gap:7px;padding:11px 16px;margin-top:17px;border:0;border-radius:9px;background:#172033;color:#fff;font-weight:750;cursor:pointer}
.extract-images-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.extract-images-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.extract-images-info svg{color:#9333ea}.extract-images-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.extract-images-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes extract-images-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:680px){.extract-images-wrap{width:min(100% - 28px,1040px)}.extract-images-hero{padding:56px 0 36px}.extract-images-card{padding:18px;border-radius:17px}.extract-images-drop{padding:42px 14px}.extract-images-info{grid-template-columns:1fr}.extract-images-main{padding-top:25px}.extract-images-summary{align-items:flex-start;flex-direction:column}.extract-images-zip{width:100%;justify-content:center}.extract-images-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:430px){.extract-images-grid{grid-template-columns:1fr}}
`

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function sizeBucket(bytes: number): string {
  if (bytes < 1024 * 1024) return 'under_1mb'
  if (bytes < 10 * 1024 * 1024) return '1mb_to_10mb'
  if (bytes < 50 * 1024 * 1024) return '10mb_to_50mb'
  return '50mb_plus'
}

function safeBaseName(filename: string): string {
  return filename.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '') || 'pdf'
}

function imageFilename(base: string, image: ExtractedImage, index: number): string {
  return `${base}_image_${String(index + 1).padStart(3, '0')}_p${image.pages[0]}.png`
}

function pageLabel(pages: number[]): string {
  if (pages.length <= 4) return `Page${pages.length === 1 ? '' : 's'} ${pages.join(', ')}`
  return `Pages ${pages.slice(0, 3).join(', ')} +${pages.length - 3} more`
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('The browser could not encode an extracted image.')), 'image/png'))
}

function drawDecodedImage(image: PdfImageData, imageKind: { GRAYSCALE_1BPP: number; RGB_24BPP: number; RGBA_32BPP: number }): Promise<Blob> {
  const { width, height } = image
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new Error('An embedded image has invalid dimensions.')
  const pixels = width * height
  if (pixels > MAX_IMAGE_PIXELS) throw new Error('skip-large-image')
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  const context = canvas.getContext('2d', { alpha: true })
  if (!context) throw new Error('Canvas image decoding is unavailable in this browser.')

  const directSource = image.bitmap || (!image.data ? image as unknown as CanvasImageSource : undefined)
  if (directSource) {
    context.drawImage(directSource, 0, 0, width, height)
    return canvasToBlob(canvas)
  }

  const source = image.data
  if (!source) throw new Error('unsupported-image-data')
  const output = context.createImageData(width, height)
  const rgba = output.data
  if (image.kind === imageKind.RGBA_32BPP || source.length === pixels * 4) {
    rgba.set(source.subarray(0, pixels * 4))
  } else if (image.kind === imageKind.RGB_24BPP || source.length === pixels * 3) {
    let sourceIndex = 0
    for (let targetIndex = 0; targetIndex < rgba.length; targetIndex += 4) {
      rgba[targetIndex] = source[sourceIndex++]; rgba[targetIndex + 1] = source[sourceIndex++]
      rgba[targetIndex + 2] = source[sourceIndex++]; rgba[targetIndex + 3] = 255
    }
  } else if (image.kind === imageKind.GRAYSCALE_1BPP) {
    const rowBytes = Math.ceil(width / 8)
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const value = source[y * rowBytes + (x >> 3)] & (128 >> (x & 7)) ? 255 : 0
        const target = (y * width + x) * 4
        rgba[target] = value; rgba[target + 1] = value; rgba[target + 2] = value; rgba[target + 3] = 255
      }
    }
  } else {
    throw new Error('unsupported-image-data')
  }
  context.putImageData(output, 0, 0)
  return canvasToBlob(canvas)
}

async function sha256(blob: Blob): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

type PdfObjectStore = { get: (id: string, callback: (value: PdfImageData) => void) => void }

function resolvePageObject(page: { objs: PdfObjectStore; commonObjs: PdfObjectStore }, id: string): Promise<PdfImageData> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('An embedded image took too long to decode.')), 20_000)
    try {
      const store = id.startsWith('g_') ? page.commonObjs : page.objs
      store.get(id, value => { window.clearTimeout(timeout); resolve(value) })
    } catch (error) {
      window.clearTimeout(timeout); reject(error)
    }
  })
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = name; anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

export default function ExtractPDFImagesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [images, setImages] = useState<ExtractedImage[]>([])
  const [pages, setPages] = useState(0)
  const [totalPlacements, setTotalPlacements] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [complete, setComplete] = useState(false)
  const [zipping, setZipping] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading PDF structure')
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const imageUrls = useRef<string[]>([])

  const releaseImages = useCallback(() => {
    imageUrls.current.forEach(url => URL.revokeObjectURL(url))
    imageUrls.current = []
  }, [])

  useEffect(() => releaseImages, [releaseImages])

  const reset = useCallback(() => {
    releaseImages(); setFile(null); setImages([]); setPages(0); setTotalPlacements(0); setSkipped(0)
    setDragging(false); setProcessing(false); setComplete(false); setZipping(false); setProgress(0)
    setProgressLabel('Reading PDF structure'); setError('')
    if (fileInput.current) fileInput.current.value = ''
  }, [releaseImages])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }
    releaseImages(); setFile(candidate); setImages([]); setPages(0); setTotalPlacements(0); setSkipped(0)
    setComplete(false); setProcessing(true); setError(''); setProgress(5); setProgressLabel('Reading PDF structure')
    void trackEvent('pdf_images_extract_started', { file_size: sizeBucket(candidate.size) })
    let loadingTask: PdfLoadingTask | null = null
    try {
      const header = new TextDecoder('latin1').decode(new Uint8Array(await candidate.slice(0, 1024).arrayBuffer()))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
      const task = pdfjs.getDocument({ data: await candidate.arrayBuffer() }) as unknown as PdfLoadingTask
      loadingTask = task
      const passwordRequired = new Promise<never>((_resolve, reject) => {
        task.onPassword = () => reject(new Error('This PDF is password-protected. Unlock it with the known password before extracting images.'))
      })
      const document = await Promise.race([task.promise, passwordRequired]) as {
        numPages: number
        getPage: (pageNumber: number) => Promise<{
          objs: PdfObjectStore
          commonObjs: PdfObjectStore
          getOperatorList: () => Promise<{ fnArray: number[]; argsArray: unknown[][] }>
        }>
        destroy: () => Promise<void>
      }
      if (document.numPages > MAX_PAGES) throw new Error(`This PDF has ${document.numPages} pages. The extraction limit is ${MAX_PAGES} pages.`)
      setPages(document.numPages)

      const byHash = new Map<string, ExtractedImage>()
      let uniquePixels = 0
      let processedPixels = 0
      let placementCount = 0
      let skippedCount = 0

      const addImage = async (image: PdfImageData, pageNumber: number, placements: number, source: ImageSource) => {
        const pixels = image.width * image.height
        processedPixels += pixels
        if (processedPixels > MAX_PROCESSED_PIXELS) throw new Error('The PDF contains too much decoded image data for safe browser processing.')
        placementCount += placements
        let blob: Blob
        try { blob = await drawDecodedImage(image, pdfjs.ImageKind) }
        catch (reason) {
          if (reason instanceof Error && (reason.message === 'skip-large-image' || reason.message === 'unsupported-image-data')) { skippedCount += 1; return }
          throw reason
        }
        const hash = await sha256(blob)
        const existing = byHash.get(hash)
        if (existing) {
          if (!existing.pages.includes(pageNumber)) existing.pages.push(pageNumber)
          existing.placements += placements
          if (!existing.sources.includes(source)) existing.sources.push(source)
          return
        }
        if (byHash.size >= MAX_UNIQUE_IMAGES) throw new Error(`This PDF contains more than ${MAX_UNIQUE_IMAGES} unique bitmap images.`)
        uniquePixels += pixels
        if (uniquePixels > MAX_UNIQUE_PIXELS) throw new Error('The unique extracted images exceed the browser pixel safety limit.')
        const url = URL.createObjectURL(blob); imageUrls.current.push(url)
        byHash.set(hash, { id: `image-${byHash.size + 1}`, blob, url, width: image.width, height: image.height, pages: [pageNumber], placements, sources: [source], hash })
      }

      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        setProgress(Math.round(10 + (pageNumber / document.numPages) * 80))
        setProgressLabel(`Scanning page ${pageNumber} of ${document.numPages}`)
        const page = await document.getPage(pageNumber)
        const operators = await page.getOperatorList()
        const xObjects = new Map<string, number>()
        const inlineImages: Array<{ image: PdfImageData; placements: number }> = []
        for (let index = 0; index < operators.fnArray.length; index += 1) {
          const operation = operators.fnArray[index]
          const args = operators.argsArray[index]
          if (operation === pdfjs.OPS.paintImageXObject || operation === pdfjs.OPS.paintImageXObjectRepeat) {
            const id = String(args[0])
            const repeats = operation === pdfjs.OPS.paintImageXObjectRepeat && Array.isArray(args[3]) ? Math.max(1, args[3].length / 2) : 1
            xObjects.set(id, (xObjects.get(id) || 0) + repeats)
          } else if (operation === pdfjs.OPS.paintInlineImageXObject || operation === pdfjs.OPS.paintInlineImageXObjectGroup) {
            const repeats = operation === pdfjs.OPS.paintInlineImageXObjectGroup && Array.isArray(args[1]) ? Math.max(1, args[1].length) : 1
            inlineImages.push({ image: args[0] as PdfImageData, placements: repeats })
          }
        }
        for (const [id, placements] of Array.from(xObjects.entries())) await addImage(await resolvePageObject(page, id), pageNumber, placements, 'Image XObject')
        for (const inline of inlineImages) await addImage(inline.image, pageNumber, inline.placements, 'Inline image')
      }

      await document.destroy()
      const results = Array.from(byHash.values())
      setImages(results); setTotalPlacements(placementCount); setSkipped(skippedCount); setComplete(true); setProgress(100)
      void trackEvent('pdf_images_extract_completed', {
        file_size: sizeBucket(candidate.size),
        image_count: results.length,
        placement_count: placementCount,
        skipped_count: skippedCount,
      })
    } catch (reason) {
      releaseImages(); setImages([])
      const message = reason instanceof Error ? reason.message : 'Images could not be extracted from this PDF.'
      setError(message); setComplete(false)
      void trackEvent('pdf_images_extract_failed', { reason: /password|encrypt/i.test(message) ? 'password_protected' : 'processing_error' })
    } finally {
      try { await loadingTask?.destroy() } catch { /* The document may already be destroyed. */ }
      setProcessing(false)
    }
  }, [releaseImages])

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault(); setDragging(false)
    const candidate = event.dataTransfer.files[0]
    if (candidate) void handleFile(candidate)
  }, [handleFile])

  const downloadOne = (image: ExtractedImage, index: number) => {
    triggerDownload(image.blob, imageFilename(safeBaseName(file?.name || 'pdf'), image, index))
    void trackEvent('pdf_image_downloaded', { download_mode: 'single', image_count: 1 })
  }

  const downloadZip = async () => {
    if (!images.length || zipping) return
    setZipping(true); setError('')
    try {
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()
      const base = safeBaseName(file?.name || 'pdf')
      images.forEach((image, index) => zip.file(imageFilename(base, image, index), image.blob))
      const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
      triggerDownload(archive, `${base}_extracted_images.zip`)
      void trackEvent('pdf_image_downloaded', { download_mode: 'zip', image_count: images.length })
    } catch {
      setError('The ZIP archive could not be created. You can still download each image separately.')
    } finally {
      setZipping(false)
    }
  }

  const totalPngBytes = images.reduce((sum, image) => sum + image.blob.size, 0)

  return <>
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <div className="extract-images-page">
      <SiteNav />
      <header className="extract-images-hero"><div className="extract-images-wrap">
        <div className="extract-images-badge"><ImageIcon size={13} /> Free embedded image extractor</div>
        <h1>Extract PDF <span>images</span></h1>
        <p>Recover unique bitmap images used inside PDF pages as lossless PNG files—without turning the whole page into an image.</p>
        <div className="extract-images-trust"><span><ShieldCheck size={14} /> No file upload</span><span><Sparkles size={14} /> Transparency preserved</span><span><Check size={14} /> Repeated images deduplicated</span></div>
      </div></header>

      <main className="extract-images-main"><div className="extract-images-wrap">
        <section className="extract-images-card" aria-label="Extract images from PDF">
          {!file ? <><label className={`extract-images-drop${dragging ? ' dragging' : ''}`} htmlFor="extract-images-file-input" onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}><div className="extract-images-drop-icon"><UploadCloud size={28} /></div><h2>Drop your PDF here</h2><p>Choose a PDF to scan for embedded bitmap images.</p><span className="extract-images-choose"><FileText size={16} /> Choose PDF</span><div className="extract-images-private">100% browser processing - zero file upload</div><input id="extract-images-file-input" ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} /></label>{error && <div className="extract-images-error" role="alert" style={{marginTop:16}}><AlertTriangle size={17} /> <span>{error}</span></div>}</> : <>
            <div className="extract-images-file"><div className="extract-images-file-icon"><FileText size={20} /></div><div className="extract-images-file-info"><div className="extract-images-file-name">{file.name}</div><div className="extract-images-file-size">{formatBytes(file.size)}{pages ? ` - ${pages} ${pages === 1 ? 'page' : 'pages'}` : ''} - source PDF unchanged</div></div><button className="extract-images-remove" type="button" onClick={reset} disabled={processing} aria-label="Remove selected PDF"><X size={16} /></button></div>
            {processing ? <div className="extract-images-progress" role="status" aria-live="polite"><div className="extract-images-progress-icon"><ScanSearch size={30} /></div><h2>Finding embedded images locally</h2><p>{progressLabel} - text and vector artwork are ignored.</p><div className="extract-images-track" aria-label={`${progress}% complete`}><div className="extract-images-fill" style={{width:`${progress}%`}} /></div></div> : <>
              {error && <div className="extract-images-error" role="alert"><AlertTriangle size={17} /> <span>{error}</span></div>}
              {complete && images.length === 0 ? <div className="extract-images-empty" role="status"><div className="extract-images-empty-icon"><FileCheck2 size={31} /></div><h2>No standalone bitmap images found</h2><p>This PDF may contain only text, vector drawings, stencil masks, or page content that is not stored as an extractable bitmap image.</p><button type="button" onClick={reset}><RotateCcw size={16} /> Check another PDF</button></div> : complete && <>
                <div className="extract-images-summary"><div><strong>{images.length} unique {images.length === 1 ? 'image' : 'images'} extracted</strong><span>{totalPlacements} page {totalPlacements === 1 ? 'placement' : 'placements'} - {formatBytes(totalPngBytes)} lossless PNG output{skipped ? ` - ${skipped} oversized or unsupported skipped` : ''}</span></div>{images.length > 1 && <button className="extract-images-zip" type="button" disabled={zipping} onClick={() => void downloadZip()}><Archive size={16} /> {zipping ? 'Creating ZIP...' : 'Download all as ZIP'}</button>}</div>
                <div className="extract-images-grid">{images.map((image, index) => <article className="extracted-image" key={image.id}><div className="extracted-image-preview"><img src={image.url} alt={`Extracted PDF image ${index + 1}`} /></div><div className="extracted-image-body"><div className="extracted-image-head"><div className="extracted-image-name">Image {String(index + 1).padStart(3, '0')}</div><button className="extracted-image-download" type="button" onClick={() => downloadOne(image, index)} aria-label={`Download image ${index + 1}`}><Download size={16} /></button></div><div className="extracted-image-meta">{image.width} × {image.height} px - {formatBytes(image.blob.size)}<br />{pageLabel(image.pages)}</div><div className="extracted-image-tags">{image.sources.map(source => <span className="extracted-image-tag" key={source}>{source}</span>)}{image.placements > 1 && <span className="extracted-image-tag">Used {image.placements} times</span>}</div></div></article>)}</div>
                <div className="extract-images-warning"><AlertTriangle size={16} /><span><strong>Bitmap images only:</strong> text, logos drawn as vectors, charts made from PDF paths, and stencil masks are not standalone raster images and are not included.</span></div>
                <div className="extract-images-again"><button type="button" onClick={reset}><RotateCcw size={14} /> Extract from another PDF</button></div>
              </>}
            </>}
          </>}
        </section>

        <div className="extract-images-info"><article><Images size={21} /><h3>Embedded pixels, not pages</h3><p>Finds Image XObjects and inline bitmaps from page content instead of taking screenshots of complete PDF pages.</p></article><article><Layers size={21} /><h3>Deduplicates repeated assets</h3><p>Identical decoded pixels are downloaded once while the interface records every page and placement where they appear.</p></article><article><ShieldCheck size={21} /><h3>Lossless local output</h3><p>Images are decoded with PDF.js and saved as PNG locally, preserving pixel detail and supported transparency.</p></article></div>
      </div></main>

      <ToolSEOSection {...toolSeoData['extract-pdf-images']} />
      <SiteFooter />
    </div>
  </>
}
