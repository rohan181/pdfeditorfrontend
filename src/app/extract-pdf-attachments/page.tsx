'use client'

import { useCallback, useRef, useState } from 'react'
import {
  AlertTriangle,
  Archive,
  Check,
  Download,
  FileArchive,
  FileCheck2,
  FileText,
  FolderOpen,
  PackageOpen,
  Paperclip,
  RotateCcw,
  ShieldCheck,
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

type AttachmentSource = 'Document attachment' | 'Associated file' | 'File annotation'
type ExtractedAttachment = {
  id: string
  name: string
  description?: string
  mimeType: string
  relationship?: string
  created?: string
  modified?: string
  source: AttachmentSource[]
  buffer: ArrayBuffer
}

type WorkerResponse =
  | { type: 'progress'; value: number; label: string }
  | { type: 'success'; attachments: ExtractedAttachment[]; pages: number; totalBytes: number }
  | { type: 'error'; message: string }

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.attachments-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.attachments-wrap{width:min(960px,calc(100% - 40px));margin:0 auto}
.attachments-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 5%,rgba(13,148,136,.14),transparent 40%),linear-gradient(180deg,#f1fdfa 0%,#fff 100%)}.attachments-hero::before,.attachments-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(13,148,136,.1);border-radius:999px}.attachments-hero::before{width:350px;height:350px;left:-220px;top:-220px}.attachments-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.attachments-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(13,148,136,.2);border-radius:999px;background:#fff;color:#0f766e;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(13,148,136,.08)}.attachments-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.attachments-hero h1 span{color:#0d9488}.attachments-hero p{max-width:625px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.attachments-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.attachments-trust span{display:flex;align-items:center;gap:5px}
.attachments-main{padding:38px 0 72px}.attachments-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.attachments-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.attachments-drop:hover,.attachments-drop.dragging{border-color:#0d9488;background:#f0fdfa;transform:translateY(-1px)}.attachments-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#0f766e,#2dd4bf);color:#fff;box-shadow:0 12px 28px rgba(13,148,136,.24)}.attachments-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.attachments-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.attachments-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.attachments-private{margin-top:13px;color:#0f766e;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.attachments-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #99f6e4;border-radius:13px;background:#f0fdfa}.attachments-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#ccfbf1;color:#0f766e;flex:0 0 auto}.attachments-file-info{min-width:0;flex:1}.attachments-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.attachments-file-size{margin-top:3px;color:#64748b;font-size:10px}.attachments-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #99f6e4;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.attachments-remove:hover{border-color:#ef4444;color:#ef4444}
.attachments-progress{padding:25px 4px 11px;text-align:center}.attachments-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#ccfbf1;color:#0f766e;animation:attachments-pulse 1.5s ease-in-out infinite}.attachments-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.attachments-progress p{margin:0 0 19px;color:#64748b;font-size:12px}.attachments-track{height:7px;border-radius:99px;background:#e2e8f0;overflow:hidden}.attachments-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#0f766e,#2dd4bf);transition:width .3s ease}
.attachments-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.attachments-summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 17px;border:1px solid #99f6e4;border-radius:14px;background:#f0fdfa}.attachments-summary strong{display:block;font:800 15px/1.3 var(--font-jakarta,system-ui)}.attachments-summary span{display:block;margin-top:3px;color:#64748b;font-size:10px}.attachments-zip{display:inline-flex;align-items:center;gap:8px;padding:11px 15px;border:0;border-radius:10px;background:#0f766e;color:#fff;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap}.attachments-zip:disabled{opacity:.55;cursor:wait}
.attachments-list{display:grid;gap:10px;margin-top:13px}.attachment-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:13px;padding:14px;border:1px solid #e2e8f0;border-radius:13px;background:#fff}.attachment-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#f1f5f9;color:#475569}.attachment-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:800}.attachment-description{margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#64748b;font-size:9px}.attachment-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.attachment-tag{padding:4px 6px;border-radius:6px;background:#f1f5f9;color:#475569;font-size:8px;font-weight:700}.attachment-download{display:grid;place-items:center;width:38px;height:38px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#0f766e;cursor:pointer}.attachment-download:hover{border-color:#0d9488;background:#f0fdfa}.attachments-again{display:flex;justify-content:center;margin-top:17px}.attachments-again button{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.attachments-empty{text-align:center;padding:24px 10px 10px}.attachments-empty-icon{display:grid;place-items:center;width:62px;height:62px;margin:0 auto 16px;border-radius:18px;background:#f1f5f9;color:#64748b}.attachments-empty h2{margin:0 0 8px;font:800 21px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.attachments-empty p{max-width:520px;margin:0 auto;color:#64748b;font-size:12px;line-height:1.65}.attachments-empty button{display:inline-flex;align-items:center;gap:7px;padding:11px 16px;margin-top:17px;border:0;border-radius:9px;background:#172033;color:#fff;font-weight:750;cursor:pointer}
.attachments-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:15px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.attachments-warning svg{flex:0 0 auto;margin-top:1px}
.attachments-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.attachments-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.attachments-info svg{color:#0d9488}.attachments-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.attachments-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes attachments-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(5deg)}}
@media(max-width:680px){.attachments-wrap{width:min(100% - 28px,960px)}.attachments-hero{padding:56px 0 36px}.attachments-card{padding:18px;border-radius:17px}.attachments-drop{padding:42px 14px}.attachments-info{grid-template-columns:1fr}.attachments-main{padding-top:25px}.attachments-summary{align-items:flex-start;flex-direction:column}.attachments-zip{width:100%;justify-content:center}.attachment-row{grid-template-columns:auto minmax(0,1fr) auto}}
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

function safeFilename(input: string, index: number): string {
  let name = input.normalize('NFC')
    .replace(/[\u0000-\u001f\u007f]/g, '_')
    .replace(/[\\/]+/g, '_')
    .replace(/\.\.+/g, '.')
    .trim()
    .replace(/^\.+/, '')
  if (!name || name === '.' || name === '..') name = `attachment-${index + 1}`
  if (name.length > 180) {
    const dot = name.lastIndexOf('.')
    const extension = dot > 0 && name.length - dot <= 16 ? name.slice(dot) : ''
    name = `${name.slice(0, 180 - extension.length)}${extension}`
  }
  return name
}

function uniqueNames(attachments: ExtractedAttachment[]): string[] {
  const used = new Set<string>()
  return attachments.map((attachment, index) => {
    const safe = safeFilename(attachment.name, index)
    const dot = safe.lastIndexOf('.')
    const stem = dot > 0 ? safe.slice(0, dot) : safe
    const extension = dot > 0 ? safe.slice(dot) : ''
    let candidate = safe
    let suffix = 2
    while (used.has(candidate.toLowerCase())) { candidate = `${stem}-${suffix}${extension}`; suffix += 1 }
    used.add(candidate.toLowerCase())
    return candidate
  })
}

function runAttachmentWorker(buffer: ArrayBuffer, onProgress: (value: number, label: string) => void): Promise<{ attachments: ExtractedAttachment[]; pages: number; totalBytes: number }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../workers/pdf-attachments.worker.ts', import.meta.url))
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data
      if (message.type === 'progress') { onProgress(message.value, message.label); return }
      worker.terminate()
      if (message.type === 'success') resolve(message)
      else reject(new Error(message.message))
    }
    worker.onerror = () => {
      worker.terminate()
      reject(new Error('The local attachment reader failed to start. Please reload and try again.'))
    }
    worker.postMessage({ buffer }, [buffer])
  })
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = name; anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

export default function ExtractPDFAttachmentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [attachments, setAttachments] = useState<ExtractedAttachment[]>([])
  const [pages, setPages] = useState(0)
  const [totalBytes, setTotalBytes] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [complete, setComplete] = useState(false)
  const [zipping, setZipping] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading PDF structure')
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setFile(null); setAttachments([]); setPages(0); setTotalBytes(0); setDragging(false)
    setProcessing(false); setComplete(false); setZipping(false); setProgress(0)
    setProgressLabel('Reading PDF structure'); setError('')
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }
    setFile(candidate); setAttachments([]); setPages(0); setTotalBytes(0); setComplete(false)
    setProcessing(true); setError(''); setProgress(8); setProgressLabel('Reading PDF structure')
    void trackEvent('pdf_attachments_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const result = await runAttachmentWorker(await candidate.arrayBuffer(), (value, label) => {
        setProgress(value); setProgressLabel(label)
      })
      setProgress(100); setAttachments(result.attachments); setPages(result.pages)
      setTotalBytes(result.totalBytes); setComplete(true)
      void trackEvent('pdf_attachments_scan_completed', {
        file_size: sizeBucket(candidate.size),
        attachment_count: result.attachments.length,
        extracted_size: sizeBucket(result.totalBytes),
      })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Attachments could not be extracted from this PDF.'
      setError(message); setComplete(false)
      void trackEvent('pdf_attachments_scan_failed', { reason: /password|encrypt/i.test(message) ? 'password_protected' : 'processing_error' })
    } finally {
      setProcessing(false)
    }
  }, [])

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault(); setDragging(false)
    const candidate = event.dataTransfer.files[0]
    if (candidate) void handleFile(candidate)
  }, [handleFile])

  const downloadOne = (attachment: ExtractedAttachment, index: number) => {
    triggerDownload(new Blob([attachment.buffer], { type: 'application/octet-stream' }), safeFilename(attachment.name, index))
    void trackEvent('pdf_attachment_downloaded', { download_mode: 'single', attachment_count: 1 })
  }

  const downloadZip = async () => {
    if (!attachments.length || zipping) return
    setZipping(true); setError('')
    try {
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()
      const names = uniqueNames(attachments)
      attachments.forEach((attachment, index) => zip.file(names[index], new Uint8Array(attachment.buffer)))
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
      const base = (file?.name || 'pdf').replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_')
      triggerDownload(blob, `${base}_attachments.zip`)
      void trackEvent('pdf_attachment_downloaded', { download_mode: 'zip', attachment_count: attachments.length })
    } catch {
      setError('The ZIP archive could not be created. You can still download each attachment separately.')
    } finally {
      setZipping(false)
    }
  }

  return <>
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <div className="attachments-page">
      <SiteNav />
      <header className="attachments-hero"><div className="attachments-wrap">
        <div className="attachments-badge"><Paperclip size={13} /> Free embedded-file extractor</div>
        <h1>Extract PDF <span>attachments</span></h1>
        <p>Find and download files embedded inside a PDF, including document attachments, associated files, and file-annotation attachments.</p>
        <div className="attachments-trust"><span><ShieldCheck size={14} /> No file upload</span><span><FolderOpen size={14} /> ZIP or individual downloads</span><span><Check size={14} /> Source PDF unchanged</span></div>
      </div></header>

      <main className="attachments-main"><div className="attachments-wrap">
        <section className="attachments-card" aria-label="Extract PDF attachments">
          {!file ? <><label className={`attachments-drop${dragging ? ' dragging' : ''}`} htmlFor="attachments-file-input" onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}><div className="attachments-drop-icon"><UploadCloud size={28} /></div><h2>Drop your PDF here</h2><p>Choose a PDF to scan for embedded files.</p><span className="attachments-choose"><FileText size={16} /> Choose PDF</span><div className="attachments-private">100% browser processing - zero file upload</div><input id="attachments-file-input" ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} /></label>{error && <div className="attachments-error" role="alert" style={{marginTop:16}}><AlertTriangle size={17} /> <span>{error}</span></div>}</> : <>
            <div className="attachments-file"><div className="attachments-file-icon"><FileText size={20} /></div><div className="attachments-file-info"><div className="attachments-file-name">{file.name}</div><div className="attachments-file-size">{formatBytes(file.size)}{pages ? ` - ${pages} ${pages === 1 ? 'page' : 'pages'}` : ''} - source remains unchanged</div></div><button className="attachments-remove" type="button" onClick={reset} disabled={processing} aria-label="Remove selected PDF"><X size={16} /></button></div>
            {processing ? <div className="attachments-progress" role="status" aria-live="polite"><div className="attachments-progress-icon"><PackageOpen size={30} /></div><h2>Scanning attachments locally</h2><p>{progressLabel} - your PDF never leaves this device.</p><div className="attachments-track" aria-label={`${progress}% complete`}><div className="attachments-fill" style={{width:`${progress}%`}} /></div></div> : <>
              {error && <div className="attachments-error" role="alert"><AlertTriangle size={17} /> <span>{error}</span></div>}
              {complete && attachments.length === 0 ? <div className="attachments-empty" role="status"><div className="attachments-empty-icon"><FileCheck2 size={31} /></div><h2>No embedded files found</h2><p>This PDF does not contain common document attachments, associated files, or file-attachment annotations. The source PDF was not modified.</p><button type="button" onClick={reset}><RotateCcw size={16} /> Check another PDF</button></div> : complete && <>
                <div className="attachments-summary"><div><strong>{attachments.length} embedded {attachments.length === 1 ? 'file' : 'files'} found</strong><span>{formatBytes(totalBytes)} total extracted size - safe filenames are used for downloads</span></div>{attachments.length > 1 && <button className="attachments-zip" type="button" disabled={zipping} onClick={() => void downloadZip()}><Archive size={16} /> {zipping ? 'Creating ZIP...' : 'Download all as ZIP'}</button>}</div>
                <div className="attachments-list">{attachments.map((attachment, index) => <article className="attachment-row" key={attachment.id}><div className="attachment-icon"><FileArchive size={20} /></div><div style={{minWidth:0}}><div className="attachment-name" title={attachment.name}>{safeFilename(attachment.name, index)}</div>{attachment.description && <div className="attachment-description" title={attachment.description}>{attachment.description}</div>}<div className="attachment-tags"><span className="attachment-tag">{formatBytes(attachment.buffer.byteLength)}</span><span className="attachment-tag">{attachment.mimeType}</span>{attachment.source.map(source => <span className="attachment-tag" key={source}>{source}</span>)}{attachment.relationship && <span className="attachment-tag">{attachment.relationship}</span>}</div></div><button className="attachment-download" type="button" onClick={() => downloadOne(attachment, index)} aria-label={`Download ${safeFilename(attachment.name, index)}`}><Download size={18} /></button></article>)}</div>
                <div className="attachments-warning"><AlertTriangle size={16} /><span><strong>Treat extracted files like email attachments.</strong> They can contain active content or malware. This tool never opens them; scan unknown files before opening.</span></div>
                <div className="attachments-again"><button type="button" onClick={reset}><RotateCcw size={14} /> Extract from another PDF</button></div>
              </>}
            </>}
          </>}
        </section>

        <div className="attachments-info"><article><Paperclip size={21} /><h3>Broad attachment discovery</h3><p>Checks document name trees, PDF associated-file arrays, and file-attachment annotations on every page.</p></article><article><PackageOpen size={21} /><h3>Original bytes recovered</h3><p>Decodes supported PDF stream filters and downloads the embedded file bytes without converting their content.</p></article><article><ShieldCheck size={21} /><h3>Private and non-executing</h3><p>Extraction and ZIP creation run locally. Files are downloaded as data and never previewed or executed by the tool.</p></article></div>
      </div></main>

      <ToolQuickFacts
        definition="A PDF can contain complete files inside the document package, appearing in an attachments panel or connected to a paperclip-style file annotation. Common examples include spreadsheets, XML invoice data, source documents, images, and supporting evidence — all extractable individually or as a ZIP."
        price="Free — no account needed"
        account="Not required"
        processing="Entirely in your browser — file never uploaded"
        formats="PDF (exports the embedded files)"
        fileLimit="Up to 100 MB — up to 500 attachments per PDF"
        browserSupport="Chrome, Firefox, Safari, Edge"
      />
      <ToolSEOSection {...toolSeoData['extract-pdf-attachments']} />
      <SiteFooter />
    </div>
  </>
}
