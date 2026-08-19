/* eslint-disable @next/next/no-img-element */
'use client'

import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import { useCallback, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Columns3,
  Download,
  Eye,
  FileDiff,
  FileMinus2,
  FilePlus2,
  FileText,
  GitCompareArrows,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import ToolQuickFacts from '@/components/ToolQuickFacts'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 150
const MAX_PREVIEWS = 24
const MAX_COMPARE_PIXELS = 1_250_000

type Slot = 'original' | 'revised'
type Sensitivity = 'strict' | 'balanced' | 'relaxed'
type ViewMode = 'difference' | 'side'
type PageStatus = 'identical' | 'changed' | 'added' | 'removed'

type PDFSelection = {
  file: File
  pages: number
}

type PageComparison = {
  page: number
  status: PageStatus
  visualDifference: number
  textChanged: boolean
  dimensionsChanged: boolean
  originalImage?: string
  revisedImage?: string
  differenceImage?: string
}

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.compare-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.compare-wrap{width:min(1040px,calc(100% - 40px));margin:0 auto}
.compare-hero{position:relative;padding:76px 0 46px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 5%,rgba(79,70,229,.13),transparent 40%),linear-gradient(180deg,#f8f7ff 0%,#fff 100%)}
.compare-hero::before,.compare-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(79,70,229,.1);transform:rotate(24deg)}.compare-hero::before{width:290px;height:290px;left:-170px;top:-180px;border-radius:70px}.compare-hero::after{width:230px;height:230px;right:-135px;bottom:-155px;border-radius:58px}
.compare-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(79,70,229,.2);border-radius:999px;background:#fff;color:#4338ca;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(79,70,229,.08)}
.compare-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.compare-hero h1 span{color:#4f46e5}.compare-hero p{max-width:630px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}
.compare-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.compare-trust span{display:flex;align-items:center;gap:5px}
.compare-main{padding:38px 0 74px}.compare-card{padding:28px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.compare-upload-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:stretch}.compare-slot{min-width:0}.compare-slot-label{display:flex;align-items:center;justify-content:space-between;margin:0 0 9px;color:#475569;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.compare-slot-label span:last-child{color:#94a3b8;font-weight:650;letter-spacing:0;text-transform:none}
.compare-drop{display:flex;min-height:190px;padding:25px 20px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;align-items:center;justify-content:center;text-align:center;cursor:pointer;transition:.18s}.compare-drop:hover,.compare-drop.dragging{border-color:#4f46e5;background:#eef2ff;transform:translateY(-1px)}.compare-drop-icon{display:grid;place-items:center;width:52px;height:52px;margin:0 auto 13px;border-radius:15px;background:linear-gradient(135deg,#4338ca,#818cf8);color:#fff;box-shadow:0 10px 24px rgba(79,70,229,.24)}.compare-drop h2{margin:0 0 6px;font:800 16px/1.25 var(--font-jakarta,system-ui);letter-spacing:-.03em}.compare-drop p{margin:0 0 15px;color:#64748b;font-size:11px;line-height:1.55}.compare-choose{display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:9px;background:#172033;color:#fff;font-size:11px;font-weight:750}
.compare-file{display:flex;min-height:190px;padding:22px;border:1px solid #c7d2fe;border-radius:16px;background:linear-gradient(145deg,#eef2ff,#fff);align-items:center;justify-content:center;text-align:center}.compare-file-icon{display:grid;place-items:center;width:54px;height:54px;margin:0 auto 13px;border-radius:15px;background:#e0e7ff;color:#4338ca}.compare-file-name{max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:800}.compare-file-meta{margin-top:5px;color:#64748b;font-size:10px}.compare-file-actions{display:flex;justify-content:center;gap:8px;margin-top:14px}.compare-file-actions button{display:inline-flex;align-items:center;gap:6px;padding:8px 10px;border:1px solid #c7d2fe;border-radius:8px;background:#fff;color:#475569;font-size:10px;font-weight:700;cursor:pointer}.compare-file-actions button:hover{border-color:#ef4444;color:#dc2626}
.compare-between{display:flex;align-items:center;justify-content:center;padding-top:25px}.compare-between button{display:grid;place-items:center;width:38px;height:38px;padding:0;border:1px solid #e2e8f0;border-radius:50%;background:#fff;color:#4f46e5;box-shadow:0 5px 15px rgba(15,23,42,.07);cursor:pointer}.compare-between button:hover{border-color:#818cf8;background:#eef2ff}.compare-between button:disabled{opacity:.45;cursor:default}
.compare-error{display:flex;gap:8px;padding:12px 14px;margin-top:16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.compare-error svg{flex:0 0 auto;margin-top:1px}
.compare-controls{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:end;margin-top:22px;padding-top:21px;border-top:1px solid #eef2f7}.compare-control-label{display:block;margin-bottom:9px;color:#475569;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.compare-sensitivity{display:flex;gap:7px;flex-wrap:wrap}.compare-sensitivity button{padding:9px 13px;border:1px solid #dbe4f0;border-radius:9px;background:#fff;color:#64748b;font-size:10px;font-weight:750;cursor:pointer}.compare-sensitivity button.selected{border-color:#4f46e5;background:#eef2ff;color:#4338ca;box-shadow:0 0 0 3px rgba(79,70,229,.07)}.compare-control-help{margin:9px 0 0;color:#94a3b8;font-size:10px;line-height:1.5}
.compare-submit{display:flex;align-items:center;justify-content:center;gap:9px;min-width:205px;padding:14px 20px;border:0;border-radius:11px;background:linear-gradient(135deg,#4338ca,#6366f1);color:#fff;font:800 14px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(79,70,229,.22);transition:.16s}.compare-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 16px 32px rgba(79,70,229,.28)}.compare-submit:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.compare-progress{margin-top:22px;padding:24px 4px 3px;text-align:center;border-top:1px solid #eef2f7}.compare-progress-icon{display:grid;place-items:center;width:56px;height:56px;margin:0 auto 15px;border-radius:17px;background:#eef2ff;color:#4f46e5;animation:compare-pulse 1.6s ease-in-out infinite}.compare-progress h2{margin:0 0 6px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.compare-progress p{margin:0 0 17px;color:#64748b;font-size:11px}.compare-track{height:7px;border-radius:99px;background:#e2e8f0;overflow:hidden}.compare-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#4338ca,#818cf8);transition:width .25s ease}
.compare-results{margin-top:22px;padding:27px;border:1px solid #e2e8f0;border-radius:22px;background:#f8fafc}.compare-result-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.compare-result-title{display:flex;gap:13px;align-items:center}.compare-result-icon{display:grid;place-items:center;width:50px;height:50px;border-radius:14px;background:#e0e7ff;color:#4338ca}.compare-result-head h2{margin:0 0 5px;font:800 22px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.04em}.compare-result-head p{margin:0;color:#64748b;font-size:11px;line-height:1.55}.compare-result-actions{display:flex;gap:8px;flex-wrap:wrap}.compare-report{display:inline-flex;align-items:center;gap:7px;padding:10px 13px;border:1px solid #c7d2fe;border-radius:9px;background:#fff;color:#4338ca;font-size:10px;font-weight:750;cursor:pointer;white-space:nowrap}
.compare-byte-match{display:flex;align-items:center;gap:9px;margin-top:18px;padding:13px 14px;border:1px solid #bbf7d0;border-radius:11px;background:#f0fdf4;color:#166534;font-size:11px;font-weight:650}.compare-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px}.compare-metric{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#fff}.compare-metric strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em}.compare-metric span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:750;text-transform:uppercase;letter-spacing:.07em}.compare-metric.changed strong{color:#dc2626}.compare-metric.same strong{color:#15803d}
.compare-result-controls{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:20px 0 14px}.compare-view-buttons{display:flex;padding:3px;border:1px solid #e2e8f0;border-radius:10px;background:#fff}.compare-view-buttons button{display:flex;align-items:center;gap:6px;padding:8px 11px;border:0;border-radius:7px;background:transparent;color:#64748b;font-size:10px;font-weight:750;cursor:pointer}.compare-view-buttons button.selected{background:#172033;color:#fff}.compare-filter{display:flex;align-items:center;gap:8px;color:#475569;font-size:10px;font-weight:700;cursor:pointer}.compare-filter input{width:15px;height:15px;accent-color:#4f46e5}
.compare-pages{display:grid;gap:12px}.compare-page-result{overflow:hidden;border:1px solid #e2e8f0;border-radius:14px;background:#fff}.compare-page-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px}.compare-page-left{display:flex;align-items:center;gap:10px}.compare-page-number{display:grid;place-items:center;width:31px;height:31px;border-radius:9px;background:#f1f5f9;color:#475569;font-size:10px;font-weight:800}.compare-page-copy strong{display:block;font-size:11px}.compare-page-copy span{display:block;margin-top:3px;color:#94a3b8;font-size:9px}.compare-status{padding:5px 8px;border-radius:999px;font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}.compare-status.identical{background:#dcfce7;color:#15803d}.compare-status.changed{background:#fee2e2;color:#b91c1c}.compare-status.added{background:#dbeafe;color:#1d4ed8}.compare-status.removed{background:#ffedd5;color:#c2410c}
.compare-visual{padding:0 14px 14px}.compare-diff-image,.compare-side-image{display:block;width:100%;height:auto;border:1px solid #e2e8f0;border-radius:10px;background:#fff}.compare-side{display:grid;grid-template-columns:1fr 1fr;gap:10px}.compare-image-label{display:block;margin:0 0 6px;color:#64748b;font-size:8px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.compare-no-preview{padding:16px;border:1px dashed #cbd5e1;border-radius:10px;background:#f8fafc;color:#64748b;text-align:center;font-size:10px;line-height:1.55}.compare-empty{padding:26px;text-align:center;color:#64748b;font-size:11px}
.compare-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.compare-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.compare-info svg{color:#4f46e5}.compare-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.compare-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}.compare-note{margin:20px 0 0;padding:15px 17px;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;background:#fffbeb;color:#854d0e;font-size:11px;line-height:1.65}
@keyframes compare-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@media(max-width:760px){.compare-wrap{width:min(100% - 28px,1040px)}.compare-hero{padding:56px 0 36px}.compare-card,.compare-results{padding:18px}.compare-upload-grid{grid-template-columns:1fr}.compare-between{padding:0}.compare-between button{transform:rotate(90deg)}.compare-controls{grid-template-columns:1fr}.compare-submit{width:100%}.compare-metrics{grid-template-columns:1fr 1fr}.compare-info{grid-template-columns:1fr}.compare-result-head{flex-direction:column}.compare-side{grid-template-columns:1fr}}
`

const THRESHOLDS: Record<Sensitivity, number> = {
  strict: 18,
  balanced: 42,
  relaxed: 72,
}

const SENSITIVITY_HELP: Record<Sensitivity, string> = {
  strict: 'Finds subtle color and anti-aliasing changes.',
  balanced: 'Best for normal document revisions and layout changes.',
  relaxed: 'Ignores small rendering noise and mild compression changes.',
}

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

function pageBucket(pages: number): string {
  if (pages <= 5) return '1_to_5'
  if (pages <= 20) return '6_to_20'
  if (pages <= 50) return '21_to_50'
  return '51_plus'
}

function normalizeText(value: string): string {
  return value.normalize('NFKC').replace(/\s+/g, ' ').trim()
}

async function extractPageText(page: PDFPageProxy): Promise<string> {
  const content = await page.getTextContent()
  return normalizeText(content.items.map(item => ('str' in item ? item.str : '')).join(' '))
}

async function renderPage(page: PDFPageProxy, scale: number): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.ceil(viewport.width))
  canvas.height = Math.max(1, Math.ceil(viewport.height))
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) throw new Error('Your browser could not create the page comparison canvas.')
  const pdfjs = await import('pdfjs-dist')
  await page.render({
    canvasContext: context,
    viewport,
    intent: 'display',
    annotationMode: pdfjs.AnnotationMode.ENABLE,
    background: '#ffffff',
  }).promise
  return canvas
}

function normalizedCanvas(source: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) throw new Error('Your browser could not normalize the page comparison.')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(source, 0, 0)
  return canvas
}

function compareCanvases(original: HTMLCanvasElement, revised: HTMLCanvasElement, threshold: number) {
  const width = Math.max(original.width, revised.width)
  const height = Math.max(original.height, revised.height)
  const left = normalizedCanvas(original, width, height)
  const right = normalizedCanvas(revised, width, height)
  const leftContext = left.getContext('2d', { willReadFrequently: true })
  const rightContext = right.getContext('2d', { willReadFrequently: true })
  if (!leftContext || !rightContext) throw new Error('Your browser could not read the rendered pages.')
  const leftData = leftContext.getImageData(0, 0, width, height)
  const rightData = rightContext.getImageData(0, 0, width, height)
  const difference = document.createElement('canvas')
  difference.width = width
  difference.height = height
  const differenceContext = difference.getContext('2d')
  if (!differenceContext) throw new Error('Your browser could not create the difference view.')
  const output = differenceContext.createImageData(width, height)
  let changedPixels = 0

  for (let index = 0; index < leftData.data.length; index += 4) {
    const redDelta = Math.abs(leftData.data[index] - rightData.data[index])
    const greenDelta = Math.abs(leftData.data[index + 1] - rightData.data[index + 1])
    const blueDelta = Math.abs(leftData.data[index + 2] - rightData.data[index + 2])
    const changed = Math.max(redDelta, greenDelta, blueDelta) > threshold
    if (changed) {
      changedPixels += 1
      output.data[index] = 225
      output.data[index + 1] = 29
      output.data[index + 2] = 72
    } else {
      const luminance = (leftData.data[index] * .2126) + (leftData.data[index + 1] * .7152) + (leftData.data[index + 2] * .0722)
      const shade = Math.max(218, Math.round(246 - ((255 - luminance) * .11)))
      output.data[index] = shade
      output.data[index + 1] = shade
      output.data[index + 2] = shade
    }
    output.data[index + 3] = 255
  }
  differenceContext.putImageData(output, 0, 0)
  return {
    changedPixels,
    totalPixels: width * height,
    difference,
  }
}

async function buffersMatch(left: Uint8Array, right: Uint8Array): Promise<boolean> {
  if (left.byteLength !== right.byteLength) return false
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', left.slice().buffer),
    crypto.subtle.digest('SHA-256', right.slice().buffer),
  ])
  const leftBytes = new Uint8Array(leftHash)
  const rightBytes = new Uint8Array(rightHash)
  return leftBytes.every((value, index) => value === rightBytes[index])
}

function differenceLabel(value: number): string {
  if (value === 0) return 'No visible pixel change'
  if (value < .01) return 'Less than 0.01% visible difference'
  return `${value.toFixed(value < 1 ? 2 : 1)}% visible difference`
}

function csvCell(value: string | number): string {
  let text = String(value)
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export default function PDFComparePage() {
  const [original, setOriginal] = useState<PDFSelection | null>(null)
  const [revised, setRevised] = useState<PDFSelection | null>(null)
  const [loadingSlot, setLoadingSlot] = useState<Slot | null>(null)
  const [dragging, setDragging] = useState<Slot | null>(null)
  const [sensitivity, setSensitivity] = useState<Sensitivity>('balanced')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Preparing documents')
  const [results, setResults] = useState<PageComparison[] | null>(null)
  const [byteIdentical, setByteIdentical] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('difference')
  const [changedOnly, setChangedOnly] = useState(true)
  const [error, setError] = useState('')
  const originalInput = useRef<HTMLInputElement>(null)
  const revisedInput = useRef<HTMLInputElement>(null)

  const clearResults = useCallback(() => {
    setResults(null)
    setByteIdentical(false)
    setViewMode('difference')
    setChangedOnly(true)
  }, [])

  const chooseFile = useCallback(async (slot: Slot, candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Each PDF must be smaller than 100 MB.'); return }
    setLoadingSlot(slot)
    setError('')
    clearResults()
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, 1024))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const source = await pdfjs.getDocument({ data: bytes.slice() }).promise
      const pages = source.numPages
      await source.destroy()
      if (pages > MAX_PAGES) throw new Error(`This comparison tool currently supports PDFs up to ${MAX_PAGES} pages.`)
      const selection = { file: candidate, pages }
      if (slot === 'original') setOriginal(selection)
      else setRevised(selection)
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF could not be read.'
      setError(/password|encrypt/i.test(message) ? 'This PDF is password-protected. Unlock it with the known password before comparing.' : message)
    } finally {
      setLoadingSlot(null)
    }
  }, [clearResults])

  const removeFile = (slot: Slot) => {
    if (slot === 'original') {
      setOriginal(null)
      if (originalInput.current) originalInput.current.value = ''
    } else {
      setRevised(null)
      if (revisedInput.current) revisedInput.current.value = ''
    }
    setError('')
    clearResults()
  }

  const swapFiles = () => {
    const nextOriginal = revised
    setRevised(original)
    setOriginal(nextOriginal)
    setError('')
    clearResults()
  }

  const onDrop = (slot: Slot, event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(null)
    const candidate = event.dataTransfer.files[0]
    if (candidate) void chooseFile(slot, candidate)
  }

  const compare = async () => {
    if (!original || !revised || processing) return
    setProcessing(true)
    setError('')
    clearResults()
    setProgress(4)
    setProgressLabel('Opening both PDFs')
    void trackEvent('pdf_compare_started', {
      sensitivity,
      original_size: sizeBucket(original.file.size),
      revised_size: sizeBucket(revised.file.size),
      page_count: pageBucket(Math.max(original.pages, revised.pages)),
    })

    let sourceOriginal: PDFDocumentProxy | null = null
    let sourceRevised: PDFDocumentProxy | null = null
    try {
      const [originalBytes, revisedBytes] = await Promise.all([
        original.file.arrayBuffer().then(buffer => new Uint8Array(buffer)),
        revised.file.arrayBuffer().then(buffer => new Uint8Array(buffer)),
      ])
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      ;[sourceOriginal, sourceRevised] = await Promise.all([
        pdfjs.getDocument({ data: originalBytes.slice() }).promise,
        pdfjs.getDocument({ data: revisedBytes.slice() }).promise,
      ])
      const totalPages = Math.max(sourceOriginal.numPages, sourceRevised.numPages)
      setProgress(9)
      setProgressLabel('Checking for an exact file match')

      if (await buffersMatch(originalBytes, revisedBytes)) {
        setByteIdentical(true)
        setResults(Array.from({ length: totalPages }, (_, index) => ({
          page: index + 1,
          status: 'identical' as const,
          visualDifference: 0,
          textChanged: false,
          dimensionsChanged: false,
        })))
        setChangedOnly(false)
        setProgress(100)
        void trackEvent('pdf_compare_completed', { result: 'byte_identical', page_count: pageBucket(totalPages) })
        return
      }

      const comparisons: PageComparison[] = []
      let previewCount = 0
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        setProgress(10 + Math.round((pageNumber / totalPages) * 86))
        setProgressLabel(`Comparing page ${pageNumber} of ${totalPages}`)
        const hasOriginal = pageNumber <= sourceOriginal.numPages
        const hasRevised = pageNumber <= sourceRevised.numPages

        if (!hasOriginal || !hasRevised) {
          const status: PageStatus = hasRevised ? 'added' : 'removed'
          const availablePage = hasOriginal ? await sourceOriginal.getPage(pageNumber) : await sourceRevised.getPage(pageNumber)
          let preview: string | undefined
          if (previewCount < MAX_PREVIEWS) {
            const base = availablePage.getViewport({ scale: 1 })
            const scale = Math.min(1.25, Math.sqrt(MAX_COMPARE_PIXELS / (base.width * base.height)))
            const canvas = await renderPage(availablePage, scale)
            preview = canvas.toDataURL('image/jpeg', .86)
            canvas.width = 1; canvas.height = 1
            previewCount += 1
          }
          comparisons.push({
            page: pageNumber,
            status,
            visualDifference: 100,
            textChanged: true,
            dimensionsChanged: true,
            originalImage: hasOriginal ? preview : undefined,
            revisedImage: hasRevised ? preview : undefined,
          })
          availablePage.cleanup()
          continue
        }

        const [originalPage, revisedPage] = await Promise.all([
          sourceOriginal.getPage(pageNumber),
          sourceRevised.getPage(pageNumber),
        ])
        const originalBase = originalPage.getViewport({ scale: 1 })
        const revisedBase = revisedPage.getViewport({ scale: 1 })
        const maxWidth = Math.max(originalBase.width, revisedBase.width)
        const maxHeight = Math.max(originalBase.height, revisedBase.height)
        const scale = Math.min(1.25, Math.sqrt(MAX_COMPARE_PIXELS / (maxWidth * maxHeight)))
        const [originalText, revisedText, originalCanvas, revisedCanvas] = await Promise.all([
          extractPageText(originalPage),
          extractPageText(revisedPage),
          renderPage(originalPage, scale),
          renderPage(revisedPage, scale),
        ])
        const pixelResult = compareCanvases(originalCanvas, revisedCanvas, THRESHOLDS[sensitivity])
        const visualDifference = (pixelResult.changedPixels / pixelResult.totalPixels) * 100
        const textChanged = originalText !== revisedText
        const dimensionsChanged = Math.abs(originalBase.width - revisedBase.width) > .1 || Math.abs(originalBase.height - revisedBase.height) > .1
        const changed = pixelResult.changedPixels >= 12 || textChanged || dimensionsChanged
        const storePreview = changed && previewCount < MAX_PREVIEWS
        comparisons.push({
          page: pageNumber,
          status: changed ? 'changed' : 'identical',
          visualDifference,
          textChanged,
          dimensionsChanged,
          originalImage: storePreview ? originalCanvas.toDataURL('image/jpeg', .86) : undefined,
          revisedImage: storePreview ? revisedCanvas.toDataURL('image/jpeg', .86) : undefined,
          differenceImage: storePreview ? pixelResult.difference.toDataURL('image/png') : undefined,
        })
        if (storePreview) previewCount += 1
        originalCanvas.width = 1; originalCanvas.height = 1
        revisedCanvas.width = 1; revisedCanvas.height = 1
        pixelResult.difference.width = 1; pixelResult.difference.height = 1
        originalPage.cleanup(); revisedPage.cleanup()
      }

      setProgress(100)
      setResults(comparisons)
      const changedPages = comparisons.filter(page => page.status !== 'identical').length
      setChangedOnly(changedPages > 0)
      void trackEvent('pdf_compare_completed', {
        result: changedPages ? 'differences_found' : 'visually_identical',
        page_count: pageBucket(totalPages),
        sensitivity,
      })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDFs could not be compared.'
      setError(/password|encrypt/i.test(message) ? 'One of these PDFs is password-protected. Unlock it with the known password first.' : message)
      void trackEvent('pdf_compare_failed', { reason: /password|encrypt/i.test(message) ? 'password_protected' : 'processing_error' })
    } finally {
      await Promise.allSettled([sourceOriginal?.destroy(), sourceRevised?.destroy()])
      setProcessing(false)
    }
  }

  const downloadReport = () => {
    if (!results || !original || !revised) return
    const lines = [
      ['PDF comparison report'],
      ['Original', original.file.name],
      ['Revised', revised.file.name],
      ['Sensitivity', sensitivity],
      [],
      ['Page', 'Status', 'Visible difference', 'Text changed', 'Page dimensions changed'],
      ...results.map(result => [
        result.page,
        result.status,
        `${result.visualDifference.toFixed(4)}%`,
        result.textChanged ? 'Yes' : 'No',
        result.dimensionsChanged ? 'Yes' : 'No',
      ]),
    ]
    const csv = lines.map(line => line.map(csvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'pdf-comparison-report.csv'
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    void trackEvent('pdf_compare_report_downloaded', { sensitivity, page_count: pageBucket(results.length) })
  }

  const reset = () => {
    setOriginal(null); setRevised(null); setLoadingSlot(null); setDragging(null)
    setSensitivity('balanced'); setProcessing(false); setProgress(0); setError('')
    clearResults()
    if (originalInput.current) originalInput.current.value = ''
    if (revisedInput.current) revisedInput.current.value = ''
  }

  const changedCount = results?.filter(page => page.status !== 'identical').length ?? 0
  const identicalCount = results?.filter(page => page.status === 'identical').length ?? 0
  const textChangedCount = results?.filter(page => page.textChanged).length ?? 0
  const visibleResults = results?.filter(page => !changedOnly || page.status !== 'identical') ?? []

  const renderSlot = (slot: Slot, selection: PDFSelection | null) => {
    const inputRef = slot === 'original' ? originalInput : revisedInput
    const isLoading = loadingSlot === slot
    const label = slot === 'original' ? 'Original PDF' : 'Revised PDF'
    return <div className="compare-slot">
      <div className="compare-slot-label"><span>{label}</span><span>{slot === 'original' ? 'Version A' : 'Version B'}</span></div>
      {selection ? <div className="compare-file">
        <div><div className="compare-file-icon"><FileText size={25} /></div><div className="compare-file-name" title={selection.file.name}>{selection.file.name}</div><div className="compare-file-meta">{selection.pages} {selection.pages === 1 ? 'page' : 'pages'} - {formatBytes(selection.file.size)}</div>
          <div className="compare-file-actions"><button type="button" onClick={() => removeFile(slot)} aria-label={`Remove ${label}`}><X size={13} /> Remove</button></div>
        </div>
      </div> : <label className={`compare-drop${dragging === slot ? ' dragging' : ''}`} htmlFor={`compare-${slot}-input`} onDragOver={event => { event.preventDefault(); setDragging(slot) }} onDragLeave={() => setDragging(null)} onDrop={event => onDrop(slot, event)}>
        <div><div className="compare-drop-icon"><UploadCloud size={24} /></div><h2>{isLoading ? 'Reading your PDF' : `Choose ${slot} PDF`}</h2><p>{isLoading ? 'Checking the document locally.' : 'Drop a PDF here or choose one from this device.'}</p><span className="compare-choose"><FileText size={14} /> Choose PDF</span></div>
        <input id={`compare-${slot}-input`} ref={inputRef} type="file" accept="application/pdf,.pdf" hidden disabled={Boolean(loadingSlot || processing)} onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void chooseFile(slot, candidate) }} />
      </label>}
    </div>
  }

  return <>
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <div className="compare-page">
      <SiteNav />
      <header className="compare-hero"><div className="compare-wrap">
        <div className="compare-badge"><GitCompareArrows size={13} /> Free document comparison</div>
        <h1>Compare two <span>PDFs</span></h1>
        <p>Find visible and textual changes page by page. Review a clear difference map without uploading either document.</p>
        <div className="compare-trust"><span><ShieldCheck size={14} /> Local browser processing</span><span><ScanSearch size={14} /> Visual and text checks</span><span><Check size={14} /> No account required</span></div>
      </div></header>

      <main className="compare-main"><div className="compare-wrap">
        <section className="compare-card" aria-label="Compare PDF files">
          <div className="compare-upload-grid">
            {renderSlot('original', original)}
            <div className="compare-between"><button type="button" onClick={swapFiles} disabled={!original && !revised} aria-label="Swap original and revised PDFs" title="Swap PDF versions"><ArrowLeftRight size={17} /></button></div>
            {renderSlot('revised', revised)}
          </div>

          {error && <div className="compare-error" role="alert"><AlertTriangle size={17} /> <span>{error}</span></div>}

          {processing ? <div className="compare-progress" role="status" aria-live="polite"><div className="compare-progress-icon"><ScanSearch size={27} /></div><h2>Comparing locally</h2><p>{progressLabel} - both files stay on this device.</p><div className="compare-track" aria-label={`${progress}% complete`}><div className="compare-fill" style={{ width: `${progress}%` }} /></div></div> : (original && revised) ? <div className="compare-controls">
            <div><span className="compare-control-label">Comparison sensitivity</span><div className="compare-sensitivity" role="group" aria-label="Comparison sensitivity">{(['strict', 'balanced', 'relaxed'] as Sensitivity[]).map(option => <button key={option} type="button" className={sensitivity === option ? 'selected' : ''} aria-pressed={sensitivity === option} onClick={() => { setSensitivity(option); clearResults() }}>{option[0].toUpperCase() + option.slice(1)}</button>)}</div><p className="compare-control-help">{SENSITIVITY_HELP[sensitivity]}</p></div>
            <button className="compare-submit" type="button" onClick={() => void compare()}><GitCompareArrows size={18} /> {results ? 'Compare again' : 'Compare PDFs'}</button>
          </div> : null}
        </section>

        {results && <section className="compare-results" aria-label="PDF comparison results">
          <div className="compare-result-head"><div className="compare-result-title"><div className="compare-result-icon">{changedCount ? <FileDiff size={24} /> : <CheckCircle2 size={24} />}</div><div><h2>{changedCount ? 'Differences found' : 'The PDFs match'}</h2><p>{changedCount ? `${changedCount} of ${results.length} page positions contain a visible, textual, size, or page-count change.` : 'No visible or textual page changes were found at this sensitivity.'}</p></div></div><div className="compare-result-actions"><button className="compare-report" type="button" onClick={downloadReport}><Download size={14} /> Download CSV report</button><button className="compare-report" type="button" onClick={reset}><RefreshCw size={14} /> Start over</button></div></div>
          {byteIdentical && <div className="compare-byte-match"><CheckCircle2 size={17} /> These files are byte-for-byte identical, including their PDF structure and metadata.</div>}
          <div className="compare-metrics"><div className="compare-metric"><strong>{results.length}</strong><span>Page positions</span></div><div className="compare-metric changed"><strong>{changedCount}</strong><span>Changed pages</span></div><div className="compare-metric"><strong>{textChangedCount}</strong><span>Text changes</span></div><div className="compare-metric same"><strong>{identicalCount}</strong><span>Unchanged pages</span></div></div>
          <div className="compare-result-controls"><div className="compare-view-buttons" role="group" aria-label="Comparison view"><button type="button" className={viewMode === 'difference' ? 'selected' : ''} aria-pressed={viewMode === 'difference'} onClick={() => setViewMode('difference')}><Eye size={13} /> Difference map</button><button type="button" className={viewMode === 'side' ? 'selected' : ''} aria-pressed={viewMode === 'side'} onClick={() => setViewMode('side')}><Columns3 size={13} /> Side by side</button></div><label className="compare-filter"><input type="checkbox" checked={changedOnly} onChange={event => setChangedOnly(event.target.checked)} /> Show changed pages only</label></div>
          <div className="compare-pages">{visibleResults.length ? visibleResults.map(result => <article className="compare-page-result" key={result.page}>
            <div className="compare-page-summary"><div className="compare-page-left"><div className="compare-page-number">{result.page}</div><div className="compare-page-copy"><strong>{result.status === 'added' ? 'Page added in revised PDF' : result.status === 'removed' ? 'Page missing from revised PDF' : result.status === 'identical' ? 'No page change found' : 'Page changed'}</strong><span>{differenceLabel(result.visualDifference)}{result.textChanged ? ' - text changed' : ''}{result.dimensionsChanged && result.status === 'changed' ? ' - page size changed' : ''}</span></div></div><span className={`compare-status ${result.status}`}>{result.status}</span></div>
            {result.status !== 'identical' && <div className="compare-visual">{viewMode === 'difference' && result.differenceImage ? <><span className="compare-image-label">Difference map - red pixels changed</span><img className="compare-diff-image" src={result.differenceImage} alt={`Visual differences on page ${result.page}`} /></> : viewMode === 'side' && (result.originalImage || result.revisedImage) ? <div className="compare-side"><div><span className="compare-image-label">Original</span>{result.originalImage ? <img className="compare-side-image" src={result.originalImage} alt={`Original PDF page ${result.page}`} /> : <div className="compare-no-preview"><FilePlus2 size={17} /><br />No page in the original PDF</div>}</div><div><span className="compare-image-label">Revised</span>{result.revisedImage ? <img className="compare-side-image" src={result.revisedImage} alt={`Revised PDF page ${result.page}`} /> : <div className="compare-no-preview"><FileMinus2 size={17} /><br />No page in the revised PDF</div>}</div></div> : result.originalImage || result.revisedImage ? <div><span className="compare-image-label">Available page preview</span><img className="compare-diff-image" src={result.originalImage || result.revisedImage} alt={`Available PDF page ${result.page}`} /></div> : <div className="compare-no-preview">Preview storage is limited to the first {MAX_PREVIEWS} changed pages. This page is still included in the results and CSV report.</div>}</div>}
          </article>) : <div className="compare-empty">No pages match the current filter.</div>}</div>
        </section>}

        <div className="compare-info"><article><ShieldCheck size={21} /><h3>Private comparison</h3><p>Both PDFs are rendered and compared inside your browser. Their pages and text are never uploaded.</p></article><article><ScanSearch size={21} /><h3>Two kinds of checks</h3><p>Pixel comparison finds layout and annotation changes while text extraction catches invisible text revisions.</p></article><article><Sparkles size={21} /><h3>Useful sensitivity</h3><p>Choose strict, balanced, or relaxed matching to handle subtle changes and compression noise.</p></article></div>
        <p className="compare-note"><strong>Review important documents:</strong> comparison highlights likely differences, but it is not a substitute for legal review, accessibility testing, signature validation, or PDF metadata inspection.</p>
      </div></main>

      <ToolQuickFacts
        definition="PDF comparison checks the same page position in two document versions and identifies visible changes, text revisions, page-size differences, and pages that were added or removed. It's useful when a revised contract, report, proof, or form must be checked against its earlier version."
        price="Free — no account needed"
        account="Not required"
        processing="Both PDFs rendered and compared entirely in your browser"
        formats="PDF (compares two files, exports CSV)"
        fileLimit="Up to 100 MB and 150 pages per file"
        browserSupport="Chrome, Firefox, Safari, Edge"
      />
      <ToolSEOSection {...toolSeoData['pdf-compare']} />
      <SiteFooter />
    </div>
  </>
}
