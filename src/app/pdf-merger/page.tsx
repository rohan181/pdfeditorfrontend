'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import ToolQuickFacts from '@/components/ToolQuickFacts'
import ToolWorkflowStatus from '@/components/ToolWorkflowStatus'
import toolSeoData from '@/lib/toolSeoData'
import { classifyToolWorkflowError, safeWorkflowErrorDetail } from '@/lib/toolWorkflowState'

// ─── CSS ──────────────────────────────────────────────────────────────────────
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
.hero p{font-size:15px;color:#4b5563;line-height:1.7;max-width:440px;margin:0 auto}

.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:32px;margin:32px 0 16px;box-shadow:0 2px 20px rgba(0,0,0,.04)}
@media(max-width:600px){.card{padding:20px 16px}}

/* drop zone */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#E24B4A;background:#fff5f5}
.drop-icon{font-size:48px;margin-bottom:14px;display:block}
.drop h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:20px;line-height:1.5}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#E24B4A}
.drop-note{font-size:9px;letter-spacing:.06em;color:rgba(0,0,0,.25);margin-top:12px;text-transform:uppercase}

/* file list */
.file-list{display:flex;flex-direction:column;gap:0;margin-bottom:20px;border:1px solid #e8e8e8;border-radius:12px;overflow:hidden}
.file-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border-bottom:1px solid #f0f0f0;transition:background .12s;cursor:grab;user-select:none;position:relative}
.file-item:last-child{border-bottom:none}
.file-item:active{cursor:grabbing}
.file-item.dragging{opacity:.35;background:#fafafa}
.file-item.drag-over{background:#fff5f5;box-shadow:inset 0 2px 0 0 #E24B4A}
.drag-handle{display:flex;flex-direction:column;gap:3px;padding:2px 4px;cursor:grab;flex-shrink:0;opacity:.3;transition:opacity .12s}
.file-item:hover .drag-handle{opacity:.7}
.drag-handle span{display:block;width:14px;height:1.5px;background:#1d1d1f;border-radius:2px}
.file-num{width:22px;height:38px;border-radius:6px;background:#f5f5f7;border:1px solid #e8e8e8;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:rgba(0,0,0,.4);flex-shrink:0}
.file-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-meta{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.file-actions{display:flex;align-items:center;gap:5px;flex-shrink:0}
.move-btn{width:24px;height:24px;border-radius:5px;background:transparent;border:1px solid #e8e8e8;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.3);font-size:11px;transition:all .12s}
.move-btn:hover:not(:disabled){border-color:#1d1d1f;color:#1d1d1f;background:#f5f5f7}
.move-btn:disabled{opacity:.25;cursor:not-allowed}
.rm-btn{width:26px;height:38px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:11px;transition:all .15s}
.rm-btn:hover{border-color:#E24B4A;color:#E24B4A;background:#fff5f5}
@media(max-width:600px){
  .file-item{gap:6px;padding:10px 8px}
  .drag-handle,.file-icon{display:none}
  .file-actions{gap:2px}
  .move-btn,.rm-btn{width:44px;min-width:44px;height:44px}
}

/* add more */
.add-row{display:flex;align-items:center;justify-content:center;padding:11px 16px;border:1.5px dashed #d8d8d8;border-radius:10px;gap:10px;cursor:pointer;transition:all .16s;margin-bottom:20px;background:#fafafa}
.add-row:hover,.add-row.over{border-color:#E24B4A;background:#fff5f5}
.add-row span{font-size:12px;font-weight:600;color:rgba(0,0,0,.4)}
.add-row-btn{padding:5px 14px;background:#1d1d1f;border:none;border-radius:6px;font-size:11px;font-weight:600;color:#fff;cursor:pointer;transition:background .15s;white-space:nowrap}
.add-row-btn:hover{background:#E24B4A}

/* summary */
.summary{display:flex;gap:20px;padding:14px 16px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:20px;flex-wrap:wrap}
.sum-item{text-align:center}
.sum-val{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:20px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em;line-height:1}
.sum-label{font-size:10px;color:rgba(0,0,0,.4);margin-top:3px;letter-spacing:.04em;text-transform:uppercase}
.sum-divider{width:1px;background:#e0e0e0;align-self:stretch}

/* action bar */
.action-bar{display:flex;gap:10px;flex-wrap:wrap}
.merge-btn{flex:1;min-width:160px;padding:14px;background:#1d1d1f;border:none;border-radius:10px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.merge-btn:hover:not(:disabled){background:#E24B4A}
.merge-btn:disabled{opacity:.4;cursor:not-allowed}
.reset-btn{padding:14px 20px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:7px;white-space:nowrap}
.reset-btn:hover{border-color:#1d1d1f}

/* output name */
.name-row{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.name-label{font-size:10px;font-weight:600;letter-spacing:.08em;color:rgba(0,0,0,.4);text-transform:uppercase;white-space:nowrap}
.name-input{flex:1;min-height:var(--input-height);padding:9px 13px;border:1px solid var(--color-border-strong);border-radius:var(--radius-md);font-size:16px;color:var(--color-text);font-family:inherit;transition:border-color var(--motion-fast),box-shadow var(--motion-fast)}
.name-input:focus-visible{border-color:var(--color-primary);outline:3px solid var(--color-focus);outline-offset:2px;box-shadow:var(--shadow-focus)}
.name-ext{font-size:12px;font-weight:500;color:rgba(0,0,0,.35)}

/* progress */
.prog-wrap{margin-top:12px}
.prog-bar{height:3px;background:#e8e8e8;border-radius:99px;overflow:hidden}
.prog-fill{height:100%;background:#1d1d1f;border-radius:99px;transition:width .3s ease}
.prog-label{font-size:10px;color:rgba(0,0,0,.4);margin-top:5px;text-align:center;letter-spacing:.06em;text-transform:uppercase}
.prog-actions{display:flex;justify-content:center;margin-top:10px}
.cancel-btn{min-height:44px;padding:9px 16px;border:1px solid #d8d8dd;border-radius:9px;background:#fff;color:#4b5563;font-size:13px;font-weight:700;cursor:pointer}
.cancel-btn:hover{border-color:#E24B4A;color:#b4233c;background:#fff5f5}

/* result */
.result{text-align:center;padding:16px 0 8px}
.result-icon{font-size:52px;margin-bottom:12px;display:block}
.result h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:22px;font-weight:800;letter-spacing:-.03em;color:#1d1d1f;margin-bottom:8px}
.result p{font-size:14px;color:rgba(0,0,0,.5);margin-bottom:22px;line-height:1.6}
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

.error-box{padding:11px 14px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:9px;font-size:13px;color:#E24B4A;margin-bottom:14px}
@media(max-width:600px){
  .hero{padding:48px 0 28px}
  .card{margin-top:20px}
  .drop{padding-top:34px;padding-bottom:34px}
  .add-row{align-items:stretch;flex-direction:column;text-align:center;padding:14px}
  .add-row-btn{display:flex;align-items:center;justify-content:center;min-height:48px;width:100%;font-size:13px}
  .summary{gap:10px;justify-content:space-around}
  .sum-divider{display:none}
  .name-row{align-items:stretch;display:grid;grid-template-columns:1fr auto;gap:7px}
  .name-label{grid-column:1 / -1}
  .action-bar{flex-direction:column}
  .merge-btn,.reset-btn{width:100%;min-width:0;justify-content:center}
  .result-btns>*{width:100%;justify-content:center}
}
`

// ─── Colour dots per file ─────────────────────────────────────────────────────
const COLORS = ['#E24B4A','#6366f1','#22c55e','#f59e0b','#0ea5e9','#a855f7','#ec4899','#14b8a6']

type PdfFile = {
  id: string
  file: File
  pages: number
  color: string
}

type Result = { blob: Blob; name: string; totalPages: number }

let _uid = 0
const uid = () => `f-${++_uid}`

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

async function countPages(file: File): Promise<number> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  const buf = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: buf }).promise
  return doc.numPages
}

type MergeWorkerResponse =
  | { type: 'progress'; value: number; max: number; label: string }
  | { type: 'success'; buffer: ArrayBuffer; pageCount: number }
  | { type: 'error'; message: string }

function runMergeWorker(
  buffers: ArrayBuffer[],
  onProgress: (value: number, max: number, label: string) => void,
  signal: AbortSignal,
): Promise<{ buffer: ArrayBuffer; pageCount: number }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../workers/pdf-merge.worker.ts', import.meta.url))
    let settled = false
    const cleanup = () => signal.removeEventListener('abort', onAbort)
    const onAbort = () => {
      if (settled) return
      settled = true
      worker.terminate()
      cleanup()
      const error = new Error('Merge canceled')
      error.name = 'AbortError'
      reject(error)
    }
    signal.addEventListener('abort', onAbort, { once: true })

    worker.onmessage = (event: MessageEvent<MergeWorkerResponse>) => {
      const message = event.data
      if (message.type === 'progress') { onProgress(message.value, message.max, message.label); return }

      if (settled) return
      settled = true
      worker.terminate()
      cleanup()
      if (message.type === 'success') resolve({ buffer: message.buffer, pageCount: message.pageCount })
      else reject(new Error(message.message))
    }

    worker.onerror = () => {
      if (settled) return
      settled = true
      worker.terminate()
      cleanup()
      reject(new Error('The local PDF engine failed to start. Please reload and try again.'))
    }

    if (signal.aborted) { onAbort(); return }
    worker.postMessage({ buffers }, buffers)
  })
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PDFMergerPage() {
  const [files, setFiles]       = useState<PdfFile[]>([])
  const [outputName, setOutputName] = useState('merged')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMax, setProgressMax] = useState(1)
  const [progressLabel, setProgressLabel] = useState('Preparing PDF files')
  const [result, setResult]     = useState<Result | null>(null)
  const [error, setError]       = useState('')
  const [isDrop, setIsDrop]     = useState(false)
  const [isAddDrop, setIsAddDrop] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [loadingCount, setLoadingCount] = useState(0)

  const fileRef    = useRef<HTMLInputElement>(null)
  const addFileRef = useRef<HTMLInputElement>(null)
  const mergeControllerRef = useRef<AbortController | null>(null)
  const addGenerationRef = useRef(0)

  useEffect(() => () => mergeControllerRef.current?.abort(), [])

  // ── Add files ───────────────────────────────────────────────────────────────
  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    const received = Array.from(incoming)
    const arr = received.filter(f => f.name.toLowerCase().endsWith('.pdf'))
    if (arr.length === 0) { setError('Please add PDF files only.'); return }
    const generation = addGenerationRef.current
    setError(received.length === arr.length ? '' : 'One or more files were skipped because this tool accepts PDF files only.')
    setLoadingCount(c => c + arr.length)

    const entries: PdfFile[] = []
    for (const f of arr) {
      try {
        const pages = await countPages(f)
        entries.push({ id: uid(), file: f, pages, color: COLORS[(_uid - 1) % COLORS.length] })
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : `Could not read "${f.name}".`
        setError(message)
      }
    }
    if (generation === addGenerationRef.current) {
      setFiles(prev => [...prev, ...entries])
      setLoadingCount(c => Math.max(0, c - arr.length))
    }
  }, [])

  // ── Drag-to-reorder (file list rows) ───────────────────────────────────────
  const onRowDragStart = (id: string) => setDraggingId(id)
  const onRowDragOver  = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverId(id) }
  const onRowDrop      = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggingId || draggingId === targetId) { setDraggingId(null); setDragOverId(null); return }
    setFiles(prev => {
      const next = [...prev]
      const from = next.findIndex(f => f.id === draggingId)
      const to   = next.findIndex(f => f.id === targetId)
      if (from < 0 || to < 0) return prev
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setDraggingId(null); setDragOverId(null)
  }

  const moveUp   = (idx: number) => setFiles(prev => { const n=[...prev];[n[idx-1],n[idx]]=[n[idx],n[idx-1]];return n })
  const moveDown = (idx: number) => setFiles(prev => { const n=[...prev];[n[idx],n[idx+1]]=[n[idx+1],n[idx]];return n })
  const remove   = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))

  // ── Merge ───────────────────────────────────────────────────────────────────
  const onMerge = async () => {
    if (files.length < 2) return
    const controller = new AbortController()
    mergeControllerRef.current = controller
    setProcessing(true); setProgress(0); setProgressMax(files.length); setProgressLabel('Preparing PDF files'); setError('')
    try {
      const buffers = await Promise.all(files.map(entry => entry.file.arrayBuffer()))
      if (controller.signal.aborted) {
        const abortError = new Error('Merge canceled'); abortError.name = 'AbortError'; throw abortError
      }
      const { buffer, pageCount } = await runMergeWorker(buffers, (value, max, label) => {
        setProgress(value); setProgressMax(max); setProgressLabel(label)
      }, controller.signal)

      const blob  = new Blob([buffer], { type: 'application/pdf' })
      const name  = (outputName.trim() || 'merged') + '.pdf'
      setProgress(100)
      setResult({ blob, name, totalPages: pageCount })
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setProgress(0)
        setError('Merge canceled. Your selected files and order are still ready.')
      } else {
        setError(e?.message ?? 'The PDFs could not be merged.')
      }
    } finally {
      mergeControllerRef.current = null
      setProcessing(false)
    }
  }

  const cancelMerge = () => mergeControllerRef.current?.abort()

  const onDownload = () => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a   = document.createElement('a')
    a.href = url; a.download = result.name; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  const reset = () => {
    mergeControllerRef.current?.abort()
    addGenerationRef.current += 1
    setFiles([]); setResult(null); setError(''); setProgress(0); setProgressMax(1); setProgressLabel('Preparing PDF files'); setOutputName('merged'); setLoadingCount(0)
  }

  const totalPages = files.reduce((s, f) => s + f.pages, 0)
  const totalSize  = files.reduce((s, f) => s + f.file.size, 0)
  const isLoading  = loadingCount > 0
  const errorState = error ? classifyToolWorkflowError(new Error(error)) : null
  const recoverFromError = () => {
    if (errorState === 'password-protected') {
      window.open('/pdf-unlock', '_blank', 'noopener,noreferrer')
      return
    }
    if (errorState === 'corrupted-pdf') {
      window.open('/pdf-repair', '_blank', 'noopener,noreferrer')
      return
    }
    if (files.length >= 2) {
      void onMerge()
      return
    }
    ;(files.length === 0 ? fileRef : addFileRef).current?.click()
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        <main id="main-content">

        {/* Hero */}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>PDF Tools · Combine · Reorder · Free</div>
            <h1>Merge PDF<br/><em>Files</em></h1>
            <p className="tool-hero-definition">A PDF merger combines two or more PDF files into one document in the order you choose. EditPDF AI reads and merges the files locally in your browser, lets you reorder whole files before combining them, and downloads a PDF output. Practical capacity depends on file size, page count, browser memory, and device performance.</p>
          </div>
        </div>

        {/* Main */}
        <div className="wrap">
          <div className="card">
            <input ref={fileRef} type="file" aria-label="Choose the PDF files to merge" accept=".pdf,application/pdf" multiple style={{ display:'none' }}
              onChange={e => { if (e.target.files) void addFiles(e.target.files); e.currentTarget.value = '' }} />
            <input ref={addFileRef} type="file" aria-label="Choose more PDF files to add" accept=".pdf,application/pdf" multiple style={{ display:'none' }}
              onChange={e => { if (e.target.files) void addFiles(e.target.files); e.currentTarget.value = '' }} />

            {result ? (
              /* ── Success state ── */
              <div className="result">
                <ToolWorkflowStatus
                  state="success"
                  heading="PDFs merged successfully"
                  message={`${files.length} files were combined into ${result.name}. The result has ${result.totalPages} pages and is ${fmt(result.blob.size)}.`}
                  primaryLabel="Download merged PDF"
                  onPrimary={onDownload}
                  secondaryLabel="Merge another set"
                  onSecondary={reset}
                />
              </div>
            ) : files.length === 0 ? (
              /* ── Empty drop zone ── */
              <>
                <div
                  className={`drop${isDrop ? ' over' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Choose two or more PDF files to merge"
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click() }
                  }}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}
                  onDrop={e => { e.preventDefault(); setIsDrop(false); addFiles(e.dataTransfer.files) }}
                >
                  <span className="drop-icon">📂</span>
                  <h2>Drop your PDFs here</h2>
                  <p>Select two or more PDF files to combine them into one</p>
                  <span className="drop-btn" aria-hidden="true">Choose PDF files</span>
                  <div className="drop-note">Local browser processing · no application document-processing request</div>
                </div>
                {errorState && (
                  <div style={{ marginTop: 14 }}>
                    <ToolWorkflowStatus
                      state={errorState}
                      detail={safeWorkflowErrorDetail(new Error(error))}
                      primaryLabel="Choose PDF files"
                      onPrimary={recoverFromError}
                    />
                  </div>
                )}
              </>
            ) : (
              /* ── File list + merge UI ── */
              <>
                {/* Add more strip */}
                <div
                  className={`add-row${isAddDrop ? ' over' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Add more PDF files"
                  onClick={() => addFileRef.current?.click()}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addFileRef.current?.click() }
                  }}
                  onDragOver={e => { e.preventDefault(); setIsAddDrop(true) }}
                  onDragLeave={() => setIsAddDrop(false)}
                  onDrop={e => { e.preventDefault(); setIsAddDrop(false); addFiles(e.dataTransfer.files) }}
                >
                  <span style={{ fontSize:18 }}>➕</span>
                  <span>Drop more PDF files to add them</span>
                  <span className="add-row-btn" aria-hidden="true">
                    Add PDF
                  </span>
                </div>

                {/* Summary */}
                <div className="summary">
                  <div className="sum-item">
                    <div className="sum-val">{files.length}</div>
                    <div className="sum-label">File{files.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="sum-divider" />
                  <div className="sum-item">
                    <div className="sum-val">{totalPages}</div>
                    <div className="sum-label">Page{totalPages !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="sum-divider" />
                  <div className="sum-item">
                    <div className="sum-val">{fmt(totalSize)}</div>
                    <div className="sum-label">Total size</div>
                  </div>
                  {isLoading && (
                    <>
                      <div className="sum-divider" />
                      <div className="sum-item" style={{ color:'rgba(0,0,0,.4)', fontSize:12 }}>
                        ⏳ Loading…
                      </div>
                    </>
                  )}
                </div>

                {/* File list */}
                <div className="file-list">
                  {files.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className={[
                        'file-item',
                        draggingId === entry.id ? 'dragging'  : '',
                        dragOverId === entry.id && draggingId !== entry.id ? 'drag-over' : '',
                      ].filter(Boolean).join(' ')}
                      draggable
                      onDragStart={() => onRowDragStart(entry.id)}
                      onDragOver={e  => onRowDragOver(e, entry.id)}
                      onDrop={e      => onRowDrop(e, entry.id)}
                      onDragEnd={()  => { setDraggingId(null); setDragOverId(null) }}
                    >
                      {/* Drag handle */}
                      <div className="drag-handle">
                        <span/><span/><span/>
                      </div>

                      {/* Order number */}
                      <div className="file-num">{idx + 1}</div>

                      {/* Colour dot + icon */}
                      <div className="file-icon" style={{ background: entry.color + '18', border: `1.5px solid ${entry.color}40` }}>
                        <span style={{ fontSize:15 }}>📄</span>
                      </div>

                      {/* Info */}
                      <div className="file-info">
                        <div className="file-name" title={entry.file.name}>{entry.file.name}</div>
                        <div className="file-meta" style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ width:6, height:6, borderRadius:'50%', background:entry.color, display:'inline-block', flexShrink:0 }}/>
                          {fmt(entry.file.size)} · {entry.pages} page{entry.pages !== 1 ? 's' : ''}
          </div>
        </main>
      </div>

                      {/* Actions */}
                      <div className="file-actions">
                        <button className="move-btn" disabled={idx === 0} onClick={() => moveUp(idx)} title="Move up" aria-label={`Move ${entry.file.name} up`}>▲</button>
                        <button className="move-btn" disabled={idx === files.length - 1} onClick={() => moveDown(idx)} title="Move down" aria-label={`Move ${entry.file.name} down`}>▼</button>
                        <button className="rm-btn" onClick={() => remove(entry.id)} title="Remove" aria-label={`Remove ${entry.file.name}`}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Output filename */}
                <div className="name-row">
                  <label className="name-label" htmlFor="merged-output-name">Output name</label>
                  <input
                    id="merged-output-name"
                    className="name-input"
                    value={outputName}
                    onChange={e => setOutputName(e.target.value)}
                    placeholder="merged"
                    spellCheck={false}
                  />
                  <span className="name-ext">.pdf</span>
                </div>

                {errorState && (
                  <ToolWorkflowStatus
                    state={errorState}
                    detail={safeWorkflowErrorDetail(new Error(error))}
                    preserveMessage="The readable PDFs, their order, and the output name are still ready."
                    onPrimary={recoverFromError}
                    secondaryLabel="Add another PDF"
                    onSecondary={() => addFileRef.current?.click()}
                  />
                )}

                {/* Action bar */}
                <div className="action-bar">
                  <button
                    className="merge-btn"
                    onClick={onMerge}
                    disabled={processing || files.length < 2 || isLoading}
                  >
                    {processing
                      ? '⏳ Merging…'
                      : files.length < 2
                        ? 'Add at least 2 PDFs'
                        : `⚡ Merge ${files.length} PDFs`}
                  </button>
                  <button className="reset-btn" onClick={reset}>Clear all</button>
                </div>

                {processing && (
                  <div className="prog-wrap">
                    <ToolWorkflowStatus
                      state="processing"
                      message="The selected PDFs are being copied in the order shown. Your originals will not be changed."
                      progress={{ value: progress, max: progressMax, label: progressLabel }}
                      cancelLabel="Cancel merge"
                      onCancel={cancelMerge}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>📂 Multiple Files</h3>
              <p>Combine multiple PDFs in one operation, subject to browser memory and device performance.</p>
            </div>
            <div className="info-card">
              <h3>↕ Drag to Reorder</h3>
              <p>Drag rows or use the ▲▼ buttons to set the exact order before merging.</p>
            </div>
            <div className="info-card">
              <h3>🔒 Local Processing</h3>
              <p>Merging runs locally in your browser with pdf-lib and does not use an application document-processing route.</p>
            </div>
          </div>
        </div>
      </div>
      <ToolQuickFacts
        price="Free — no account needed"
        account="Not required"
        processing="Processed locally in your browser without an application document-processing request"
        formats="Input: two or more PDF files · Output: one PDF"
        fileLimit="Practical capacity depends on file size, page count, browser memory, and device performance"
        browserSupport="Modern desktop and mobile browsers with JavaScript, Web Workers, and required file APIs"
      />
      <ToolSEOSection {...toolSeoData['pdf-merger']} showDirectAnswer={false} />
    </>
  )
}
