'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Download,
  Eraser,
  FileCheck2,
  FileSearch,
  FileText,
  Fingerprint,
  Info,
  RotateCcw,
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

type MetadataProperty = { label: string; value: string }
type MetadataSummary = {
  pages: number
  properties: MetadataProperty[]
  xmpPackets: number
  linkedMetadata: number
  pageMetadata: number
  documentId: boolean
  annotationIdentity: number
  attachments: boolean
}

type WorkerResponse =
  | { type: 'progress'; value: number; label: string }
  | { type: 'success'; buffer: ArrayBuffer }
  | { type: 'error'; message: string }

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.metadata-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.metadata-wrap{width:min(960px,calc(100% - 40px));margin:0 auto}
.metadata-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(2,132,199,.12),transparent 39%),linear-gradient(180deg,#f5fbff 0%,#fff 100%)}.metadata-hero::before,.metadata-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(2,132,199,.1);border-radius:999px}.metadata-hero::before{width:350px;height:350px;left:-220px;top:-220px}.metadata-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.metadata-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(2,132,199,.2);border-radius:999px;background:#fff;color:#0369a1;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(2,132,199,.08)}.metadata-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.metadata-hero h1 span{color:#0284c7}.metadata-hero p{max-width:625px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.metadata-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.metadata-trust span{display:flex;align-items:center;gap:5px}
.metadata-main{padding:38px 0 72px}.metadata-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.metadata-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.metadata-drop:hover,.metadata-drop.dragging{border-color:#0284c7;background:#f0f9ff;transform:translateY(-1px)}.metadata-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#0369a1,#38bdf8);color:#fff;box-shadow:0 12px 28px rgba(2,132,199,.24)}.metadata-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.metadata-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.metadata-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.metadata-private{margin-top:13px;color:#0369a1;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.metadata-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #bae6fd;border-radius:13px;background:#f0f9ff}.metadata-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#e0f2fe;color:#0369a1;flex:0 0 auto}.metadata-file-info{min-width:0;flex:1}.metadata-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.metadata-file-size{margin-top:3px;color:#64748b;font-size:10px}.metadata-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #bae6fd;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.metadata-remove:hover{border-color:#ef4444;color:#ef4444}
.metadata-found{padding:17px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.metadata-found-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.metadata-found-head h2{margin:0;font:800 15px/1.3 var(--font-jakarta,system-ui);letter-spacing:-.025em}.metadata-found-head span{color:#64748b;font-size:9px}.metadata-chips{display:flex;flex-wrap:wrap;gap:7px}.metadata-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 9px;border:1px solid #dbeafe;border-radius:9px;background:#fff;color:#1e40af;font-size:9px;font-weight:750}.metadata-chip.none{border-color:#bbf7d0;color:#15803d}.metadata-properties{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:12px}.metadata-property{min-width:0;padding:9px 10px;border-radius:9px;background:#fff;border:1px solid #e2e8f0}.metadata-property strong{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:.07em}.metadata-property span{display:block;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px}.metadata-more{margin:9px 0 0;color:#64748b;font-size:9px}
.metadata-options{margin-top:16px}.metadata-option{display:flex;align-items:flex-start;gap:10px;padding:13px 14px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;cursor:pointer}.metadata-option input{width:16px;height:16px;margin-top:1px;accent-color:#0284c7}.metadata-option strong{display:block;font-size:11px}.metadata-option span{display:block;margin-top:3px;color:#64748b;font-size:9px;line-height:1.55}
.metadata-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:14px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:11px;line-height:1.55}.metadata-warning svg{flex:0 0 auto;margin-top:1px}.metadata-ack{display:flex;align-items:flex-start;gap:9px;margin-top:8px;font-weight:650;cursor:pointer}.metadata-ack input{width:16px;height:16px;margin-top:1px;accent-color:#0284c7}.metadata-attachment{display:flex;gap:8px;padding:11px 12px;margin-top:14px;border-radius:10px;background:#f1f5f9;color:#475569;font-size:10px;line-height:1.55}.metadata-attachment svg{flex:0 0 auto;margin-top:1px}
.metadata-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.metadata-submit{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;margin-top:16px;border:0;border-radius:11px;background:linear-gradient(135deg,#0369a1,#0284c7);color:#fff;font:800 15px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(2,132,199,.2);transition:.16s}.metadata-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 16px 32px rgba(2,132,199,.26)}.metadata-submit:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.metadata-limit{display:flex;align-items:center;justify-content:center;gap:6px;margin:11px 0 0;color:#64748b;font-size:10px}
.metadata-progress{padding:26px 4px 10px;text-align:center}.metadata-progress-icon{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 16px;border-radius:17px;background:#e0f2fe;color:#0284c7;animation:metadata-pulse 1.6s ease-in-out infinite}.metadata-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.metadata-progress p{margin:0 0 19px;color:#64748b;font-size:12px}.metadata-track{height:7px;border-radius:99px;background:#e2e8f0;overflow:hidden}.metadata-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#0369a1,#38bdf8);transition:width .3s ease}
.metadata-success{text-align:center;padding:25px 5px 8px}.metadata-success-icon{display:grid;place-items:center;width:66px;height:66px;margin:0 auto 17px;border-radius:20px;background:#dcfce7;color:#15803d}.metadata-success h2{margin:0 0 8px;font:800 23px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.04em}.metadata-success p{margin:0 auto 12px;max-width:520px;color:#64748b;font-size:13px;line-height:1.6}.metadata-result{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;margin:0 0 20px;border-radius:999px;background:#f0fdf4;color:#15803d;font-size:10px;font-weight:750}.metadata-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.metadata-download,.metadata-again{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:10px;font-weight:750;text-decoration:none;cursor:pointer}.metadata-download{border:0;background:#172033;color:#fff}.metadata-again{border:1px solid #cbd5e1;background:#fff;color:#475569}
.metadata-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.metadata-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.metadata-info svg{color:#0284c7}.metadata-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.metadata-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}.metadata-note{margin:20px 0 0;padding:15px 17px;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;background:#fffbeb;color:#854d0e;font-size:11px;line-height:1.65}
@keyframes metadata-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-6deg)}}
@media(max-width:680px){.metadata-wrap{width:min(100% - 28px,960px)}.metadata-hero{padding:56px 0 36px}.metadata-card{padding:18px;border-radius:17px}.metadata-drop{padding:42px 14px}.metadata-properties,.metadata-info{grid-template-columns:1fr}.metadata-main{padding-top:25px}}
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

function detectSignature(bytes: Uint8Array): boolean {
  const chunkSize = 8 * 1024 * 1024
  const decoder = new TextDecoder('latin1')
  const first = decoder.decode(bytes.subarray(0, Math.min(bytes.length, chunkSize)))
  const last = bytes.length > chunkSize ? decoder.decode(bytes.subarray(bytes.length - chunkSize)) : ''
  return /\/ByteRange\s*\[|\/FT\s*\/Sig\b|\/Type\s*\/Sig\b/.test(`${first}\n${last}`)
}

function detectAttachments(bytes: Uint8Array): boolean {
  const chunkSize = 8 * 1024 * 1024
  const decoder = new TextDecoder('latin1')
  const first = decoder.decode(bytes.subarray(0, Math.min(bytes.length, chunkSize)))
  const last = bytes.length > chunkSize ? decoder.decode(bytes.subarray(bytes.length - chunkSize)) : ''
  return /\/EmbeddedFiles\b|\/Type\s*\/Filespec\b/.test(`${first}\n${last}`)
}

function displayValue(value: string | Date | undefined): string | undefined {
  if (!value) return undefined
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString()
  return value.trim() || undefined
}

async function inspectMetadata(bytes: Uint8Array): Promise<MetadataSummary> {
  const { PDFDict, PDFDocument, PDFName, PDFRawStream } = await import('pdf-lib')
  const document = await PDFDocument.load(bytes, { updateMetadata: false })
  const properties: MetadataProperty[] = []
  const getters: Array<[string, () => string | Date | undefined]> = [
    ['Title', () => document.getTitle()],
    ['Author', () => document.getAuthor()],
    ['Subject', () => document.getSubject()],
    ['Keywords', () => document.getKeywords()],
    ['Creator', () => document.getCreator()],
    ['Producer', () => document.getProducer()],
    ['Created', () => document.getCreationDate()],
    ['Modified', () => document.getModificationDate()],
  ]
  for (const [label, getter] of getters) {
    try {
      const value = displayValue(getter())
      if (value) properties.push({ label, value })
    } catch {
      properties.push({ label, value: 'Present but not readable' })
    }
  }

  const metadataKey = PDFName.of('Metadata')
  const pieceInfoKey = PDFName.of('PieceInfo')
  const lastModifiedKey = PDFName.of('LastModified')
  const typeKey = PDFName.of('Type')
  let xmpPackets = 0
  let linkedMetadata = 0
  for (const [, object] of document.context.enumerateIndirectObjects()) {
    const dictionary = object instanceof PDFDict ? object : object instanceof PDFRawStream ? object.dict : null
    if (!dictionary) continue
    if (object instanceof PDFRawStream && dictionary.get(typeKey)?.toString() === '/Metadata') xmpPackets += 1
    if (dictionary.has(metadataKey) || dictionary.has(pieceInfoKey) || dictionary.has(lastModifiedKey)) linkedMetadata += 1
  }

  let pageMetadata = 0
  let annotationIdentity = 0
  const subtypeKey = PDFName.of('Subtype')
  const identityKeys = [PDFName.of('T'), PDFName.of('M'), PDFName.of('CreationDate'), PDFName.of('NM')]
  for (const page of document.getPages()) {
    if (page.node.has(metadataKey) || page.node.has(pieceInfoKey) || page.node.has(lastModifiedKey)) pageMetadata += 1
    const annotations = page.node.Annots()
    if (!annotations) continue
    for (let index = 0; index < annotations.size(); index += 1) {
      const annotation = document.context.lookup(annotations.get(index))
      if (!(annotation instanceof PDFDict) || annotation.get(subtypeKey)?.toString() === '/Widget') continue
      if (identityKeys.some(key => annotation.has(key))) annotationIdentity += 1
    }
  }

  return {
    pages: document.getPageCount(),
    properties,
    xmpPackets,
    linkedMetadata,
    pageMetadata,
    documentId: Boolean(document.context.trailerInfo.ID),
    annotationIdentity,
    attachments: detectAttachments(bytes),
  }
}

function runMetadataWorker(buffer: ArrayBuffer, onProgress: (value: number, label: string) => void): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../workers/qpdf-metadata.worker.ts', import.meta.url))
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data
      if (message.type === 'progress') { onProgress(message.value, message.label); return }
      worker.terminate()
      if (message.type === 'success') resolve(message.buffer)
      else reject(new Error(message.message))
    }
    worker.onerror = () => {
      worker.terminate()
      reject(new Error('The local metadata engine failed to start. Please reload and try again.'))
    }
    worker.postMessage({ buffer }, [buffer])
  })
}

async function finalMetadataScrub(buffer: ArrayBuffer, cleanAnnotations: boolean): Promise<Uint8Array> {
  const { PDFDict, PDFDocument, PDFName, PDFRawStream } = await import('pdf-lib')
  const document = await PDFDocument.load(new Uint8Array(buffer), { updateMetadata: false })
  delete document.context.trailerInfo.Info
  delete document.context.trailerInfo.ID

  const metadataKeys = [PDFName.of('Metadata'), PDFName.of('PieceInfo'), PDFName.of('LastModified')]
  const typeKey = PDFName.of('Type')
  const metadataRefs = []
  for (const [reference, object] of document.context.enumerateIndirectObjects()) {
    const dictionary = object instanceof PDFDict ? object : object instanceof PDFRawStream ? object.dict : null
    if (!dictionary) continue
    if (object instanceof PDFRawStream && dictionary.get(typeKey)?.toString() === '/Metadata') {
      metadataRefs.push(reference)
      continue
    }
    metadataKeys.forEach(key => dictionary.delete(key))
  }
  metadataRefs.forEach(reference => document.context.delete(reference))
  metadataKeys.forEach(key => document.catalog.delete(key))

  if (cleanAnnotations) {
    const subtypeKey = PDFName.of('Subtype')
    const identityKeys = [PDFName.of('T'), PDFName.of('M'), PDFName.of('CreationDate'), PDFName.of('NM')]
    for (const page of document.getPages()) {
      metadataKeys.forEach(key => page.node.delete(key))
      const annotations = page.node.Annots()
      if (!annotations) continue
      for (let index = 0; index < annotations.size(); index += 1) {
        const annotation = document.context.lookup(annotations.get(index))
        if (!(annotation instanceof PDFDict) || annotation.get(subtypeKey)?.toString() === '/Widget') continue
        identityKeys.forEach(key => annotation.delete(key))
      }
    }
  }

  return document.save({ useObjectStreams: true })
}

function categoryCount(summary: MetadataSummary): number {
  return [
    summary.properties.length > 0,
    summary.xmpPackets > 0,
    summary.linkedMetadata > 0 || summary.pageMetadata > 0,
    summary.documentId,
    summary.annotationIdentity > 0,
  ].filter(Boolean).length
}

export default function RemovePDFMetadataPage() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<MetadataSummary | null>(null)
  const [dragging, setDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading PDF')
  const [cleanAnnotations, setCleanAnnotations] = useState(true)
  const [signed, setSigned] = useState(false)
  const [signatureAck, setSignatureAck] = useState(false)
  const [error, setError] = useState('')
  const [download, setDownload] = useState<{ url: string; name: string; removedCategories: number; attachments: boolean } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => () => {
    if (download?.url) URL.revokeObjectURL(download.url)
  }, [download])

  const reset = useCallback(() => {
    setFile(null); setSummary(null); setDragging(false); setAnalyzing(false); setProcessing(false)
    setProgress(0); setProgressLabel('Reading PDF'); setCleanAnnotations(true); setSigned(false)
    setSignatureAck(false); setError(''); setDownload(null)
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }
    setAnalyzing(true); setError(''); setSummary(null); setDownload(null); setSignatureAck(false)
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, 1024))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const inspected = await inspectMetadata(bytes)
      setFile(candidate); setSummary(inspected); setSigned(detectSignature(bytes))
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF could not be inspected.'
      setFile(null)
      setError(/password|encrypt/i.test(message) ? 'This PDF is password-protected. Unlock it with the known password first.' : message)
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault(); setDragging(false)
    const candidate = event.dataTransfer.files[0]
    if (candidate) void handleFile(candidate)
  }, [handleFile])

  const clean = async () => {
    if (!file || !summary || processing || (signed && !signatureAck)) return
    setProcessing(true); setError(''); setProgress(10); setProgressLabel('Reading PDF')
    void trackEvent('pdf_metadata_clean_started', {
      file_size: sizeBucket(file.size),
      clean_annotations: cleanAnnotations,
      detected_categories: categoryCount(summary),
    })
    try {
      const qpdfOutput = await runMetadataWorker(await file.arrayBuffer(), (value, label) => {
        setProgress(value); setProgressLabel(label)
      })
      setProgress(86); setProgressLabel('Removing identifiers and hidden annotation data')
      const output = await finalMetadataScrub(qpdfOutput, cleanAnnotations)
      setProgress(94); setProgressLabel('Verifying the sanitized copy')
      const verification = await inspectMetadata(output)
      const remainingDocumentMetadata = verification.properties.length + verification.xmpPackets + verification.linkedMetadata + verification.pageMetadata + (verification.documentId ? 1 : 0)
      if (remainingDocumentMetadata || (cleanAnnotations && verification.annotationIdentity)) {
        throw new Error('The sanitized copy could not be verified. Your original file was not changed.')
      }

      setProgress(100)
      const outputBuffer = output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength) as ArrayBuffer
      const url = URL.createObjectURL(new Blob([outputBuffer], { type: 'application/pdf' }))
      const base = file.name.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_')
      const name = `${base}_metadata_removed.pdf`
      const removedCategories = categoryCount(summary)
      setDownload({ url, name, removedCategories, attachments: summary.attachments })
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click()
      void trackEvent('pdf_metadata_clean_completed', {
        file_size: sizeBucket(file.size),
        clean_annotations: cleanAnnotations,
        detected_categories: removedCategories,
      })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF metadata could not be removed.'
      setError(message)
      void trackEvent('pdf_metadata_clean_failed', { reason: /password|encrypt/i.test(message) ? 'password_protected' : 'processing_error' })
    } finally {
      setProcessing(false)
    }
  }

  const canClean = Boolean(file && summary && !analyzing && (!signed || signatureAck))
  const detected = summary ? categoryCount(summary) : 0

  return <>
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <div className="metadata-page">
      <SiteNav />
      <header className="metadata-hero"><div className="metadata-wrap">
        <div className="metadata-badge"><Fingerprint size={13} /> Free PDF privacy tool</div>
        <h1>Remove PDF <span>metadata</span></h1>
        <p>Strip hidden document properties, XMP packets, identifiers, and optional annotation identity data without changing how your pages look.</p>
        <div className="metadata-trust"><span><ShieldCheck size={14} /> No file upload</span><span><Eraser size={14} /> Quality-preserving cleanup</span><span><Check size={14} /> No account required</span></div>
      </div></header>

      <main className="metadata-main"><div className="metadata-wrap">
        <section className="metadata-card" aria-label="Remove PDF metadata">
          {download ? <div className="metadata-success" role="status"><div className="metadata-success-icon"><FileCheck2 size={32} /></div><h2>Your sanitized PDF is ready</h2><p>Document properties, XMP metadata, page-level metadata, and file identifiers were removed from a new copy. Your original PDF was not changed.</p><div className="metadata-result"><BadgeCheck size={14} /> {download.removedCategories ? `${download.removedCategories} detected metadata ${download.removedCategories === 1 ? 'category' : 'categories'} cleaned` : 'No common document metadata remains'}</div><div className="metadata-actions"><a className="metadata-download" href={download.url} download={download.name}><Download size={17} /> Download again</a><button className="metadata-again" type="button" onClick={reset}><RotateCcw size={16} /> Clean another</button></div>{download.attachments && <div className="metadata-attachment" style={{maxWidth:560,margin:'18px auto 0',textAlign:'left'}}><Info size={15} /> Embedded attachments were preserved. Their filenames and internal metadata may still identify their source.</div>}</div> : processing ? <div className="metadata-progress" role="status" aria-live="polite"><div className="metadata-progress-icon"><Eraser size={29} /></div><h2>Cleaning metadata locally</h2><p>{progressLabel} - your PDF never leaves this device.</p><div className="metadata-track" aria-label={`${progress}% complete`}><div className="metadata-fill" style={{width:`${progress}%`}} /></div></div> : !file ? <><label className={`metadata-drop${dragging ? ' dragging' : ''}`} htmlFor="metadata-file-input" onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}><div className="metadata-drop-icon"><UploadCloud size={28} /></div><h2>{analyzing ? 'Inspecting your PDF' : 'Drop your PDF here'}</h2><p>{analyzing ? 'Checking common metadata fields locally.' : 'Choose a PDF to inspect and sanitize.'}</p><span className="metadata-choose"><FileText size={16} /> Choose PDF</span><div className="metadata-private">Local browser processing</div><input id="metadata-file-input" ref={fileInput} type="file" accept="application/pdf,.pdf" hidden disabled={analyzing} onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} /></label>{error && <div className="metadata-error" role="alert" style={{marginTop:16}}><AlertTriangle size={17} /> <span>{error}</span></div>}</> : <>
            <div className="metadata-file"><div className="metadata-file-icon"><FileText size={20} /></div><div className="metadata-file-info"><div className="metadata-file-name">{file.name}</div><div className="metadata-file-size">{formatBytes(file.size)} - {summary?.pages} {summary?.pages === 1 ? 'page' : 'pages'} - stored only in this tab</div></div><button className="metadata-remove" type="button" onClick={reset} aria-label="Remove selected PDF"><X size={16} /></button></div>
            {error && <div className="metadata-error" role="alert"><AlertTriangle size={17} /> <span>{error}</span></div>}
            {summary && <div className="metadata-found"><div className="metadata-found-head"><h2>Metadata inspection</h2><span>{detected ? `${detected} ${detected === 1 ? 'category' : 'categories'} detected` : 'No common fields detected'}</span></div><div className="metadata-chips">{summary.properties.length > 0 && <span className="metadata-chip"><FileSearch size={13} /> {summary.properties.length} document {summary.properties.length === 1 ? 'property' : 'properties'}</span>}{summary.xmpPackets > 0 && <span className="metadata-chip"><Sparkles size={13} /> {summary.xmpPackets} XMP {summary.xmpPackets === 1 ? 'packet' : 'packets'}</span>}{(summary.linkedMetadata > 0 || summary.pageMetadata > 0) && <span className="metadata-chip"><FileText size={13} /> Page or object metadata</span>}{summary.documentId && <span className="metadata-chip"><Fingerprint size={13} /> Document identifier</span>}{summary.annotationIdentity > 0 && <span className="metadata-chip"><Info size={13} /> {summary.annotationIdentity} annotation identity {summary.annotationIdentity === 1 ? 'record' : 'records'}</span>}{!detected && <span className="metadata-chip none"><Check size={13} /> No common metadata found</span>}</div>{summary.properties.length > 0 && <><div className="metadata-properties">{summary.properties.slice(0,6).map(property => <div className="metadata-property" key={property.label}><strong>{property.label}</strong><span title={property.value}>{property.value}</span></div>)}</div>{summary.properties.length > 6 && <p className="metadata-more">+ {summary.properties.length - 6} more document properties</p>}</>}</div>}
            <div className="metadata-options"><label className="metadata-option"><input type="checkbox" checked={cleanAnnotations} onChange={event => setCleanAnnotations(event.target.checked)} /><span><strong>Remove annotation author and timestamp identifiers</strong><span>Preserves visible comments and markup while clearing hidden author, creation-date, modification-date, and annotation-ID fields. Form field names and values are preserved.</span></span></label></div>
            {summary?.attachments && <div className="metadata-attachment"><Info size={15} /> This PDF contains embedded attachments. They will be preserved and may contain their own filenames or metadata.</div>}
            {signed && <div className="metadata-warning"><AlertTriangle size={17} /><div><strong>This PDF appears digitally signed.</strong> Rewriting metadata changes the file bytes and invalidates existing cryptographic signatures.<label className="metadata-ack"><input type="checkbox" checked={signatureAck} onChange={event => setSignatureAck(event.target.checked)} /> I understand the cleaned copy will not retain valid signatures.</label></div></div>}
            <button className="metadata-submit" type="button" disabled={!canClean} onClick={() => void clean()}><Eraser size={18} /> Remove metadata</button><p className="metadata-limit"><ShieldCheck size={13} /> Up to 100 MB - processed privately in your browser</p>
          </>}
        </section>

        <div className="metadata-info"><article><Fingerprint size={21} /><h3>Broad metadata cleanup</h3><p>Removes standard properties, XMP streams, document IDs, and page-level metadata references.</p></article><article><BadgeCheck size={21} /><h3>Preserves page content</h3><p>Pages are not rasterized; verify the new copy because embedded attachments and their internal metadata are preserved.</p></article><article><ShieldCheck size={21} /><h3>Local processing</h3><p>QPDF WebAssembly and final verification run locally without an application document-processing request.</p></article></div>
        <p className="metadata-note"><strong>Metadata is only one privacy layer:</strong> visible page content, comments, form values, filenames, bookmarks, and embedded attachments can still reveal information. Review the cleaned PDF before sharing it.</p>
      </div></main>

      <ToolQuickFacts
        definition="PDF metadata can contain an author name, document title, editing software, creation and modification dates, search keywords, XMP records, and internal document identifiers. Removing it creates a cleaner sharing copy without those common hidden properties."
        price="Free — no account needed"
        account="Not required"
        processing="Processed locally in your browser without an application document-processing request"
        formats="PDF"
        fileLimit="Up to 100 MB"
        browserSupport="Chrome, Firefox, Safari, Edge"
      />
      <ToolSEOSection {...toolSeoData['remove-pdf-metadata']} />
      <SiteFooter />
    </div>
  </>
}
