'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  Download,
  FileCheck2,
  FileText,
  Layers,
  LockKeyhole,
  MousePointer2,
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
type FlattenMode = 'forms' | 'visual'

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.flatten-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.flatten-wrap{width:min(960px,calc(100% - 40px));margin:0 auto}
.flatten-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 10%,rgba(13,148,136,.11),transparent 38%),linear-gradient(180deg,#f6fffd 0%,#fff 100%)}
.flatten-hero::before,.flatten-hero::after{content:'';position:absolute;border:1px solid rgba(13,148,136,.1);border-radius:999px;pointer-events:none}.flatten-hero::before{width:360px;height:360px;left:-220px;top:-220px}.flatten-hero::after{width:280px;height:280px;right:-170px;bottom:-190px}
.flatten-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(13,148,136,.2);border-radius:999px;background:#fff;color:#0f766e;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(13,148,136,.08)}
.flatten-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.flatten-hero h1 span{color:#0d9488}.flatten-hero p{max-width:590px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}
.flatten-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.flatten-trust span{display:flex;align-items:center;gap:5px}
.flatten-main{padding:38px 0 70px}.flatten-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.flatten-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:border-color .18s,background .18s,transform .18s}.flatten-drop:hover,.flatten-drop.dragging{border-color:#0d9488;background:#f0fdfa;transform:translateY(-1px)}
.flatten-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#0f766e,#2dd4bf);color:#fff;box-shadow:0 12px 28px rgba(13,148,136,.24)}.flatten-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.flatten-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.flatten-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.flatten-private{margin-top:13px;color:#0f766e;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.flatten-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:20px;border:1px solid #99f6e4;border-radius:13px;background:#f0fdfa}.flatten-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#ccfbf1;color:#0f766e;flex:0 0 auto}.flatten-file-info{min-width:0;flex:1}.flatten-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.flatten-file-size{margin-top:3px;color:#64748b;font-size:10px}.flatten-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #99f6e4;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.flatten-remove:hover{border-color:#ef4444;color:#ef4444}
.flatten-meta{display:flex;gap:8px;flex-wrap:wrap;margin:-7px 0 18px}.flatten-meta span{padding:5px 9px;border-radius:999px;background:#f1f5f9;color:#475569;font-size:9px;font-weight:750}
.flatten-label{display:block;margin:0 0 9px;color:#475569;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.flatten-modes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}.flatten-mode{position:relative;padding:16px;border:1px solid #dbe4f0;border-radius:13px;background:#fff;text-align:left;color:#172033;cursor:pointer}.flatten-mode.selected{border-color:#0d9488;background:#f0fdfa;box-shadow:0 0 0 3px rgba(13,148,136,.08)}.flatten-mode-head{display:flex;align-items:center;gap:8px;margin-bottom:6px;font:750 13px/1.25 var(--font-jakarta,system-ui)}.flatten-mode p{margin:0;color:#64748b;font-size:10px;line-height:1.55}.flatten-mode-mark{position:absolute;right:12px;top:12px;display:grid;place-items:center;width:18px;height:18px;border:1px solid #cbd5e1;border-radius:50%;color:transparent}.flatten-mode.selected .flatten-mode-mark{border-color:#0d9488;background:#0d9488;color:#fff}
.flatten-advice{display:flex;gap:9px;padding:12px 13px;margin-bottom:16px;border-radius:10px;background:#f8fafc;color:#475569;font-size:11px;line-height:1.55}.flatten-advice svg{flex:0 0 auto;color:#0d9488;margin-top:1px}.flatten-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-bottom:16px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:11px;line-height:1.55}.flatten-warning svg{flex:0 0 auto;margin-top:1px}.flatten-ack{display:flex;align-items:flex-start;gap:9px;margin-top:8px;font-weight:650;cursor:pointer}.flatten-ack input{width:16px;height:16px;margin-top:1px;accent-color:#0d9488}
.flatten-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin-bottom:16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}
.flatten-submit{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;border:0;border-radius:11px;background:linear-gradient(135deg,#0f766e,#0d9488);color:#fff;font:800 15px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(13,148,136,.2);transition:transform .16s,box-shadow .16s}.flatten-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 16px 32px rgba(13,148,136,.26)}.flatten-submit:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.flatten-progress{padding:26px 4px 10px;text-align:center}.flatten-progress-icon{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 16px;border-radius:17px;background:#f0fdfa;color:#0d9488;animation:flatten-pulse 1.6s ease-in-out infinite}.flatten-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.flatten-progress p{margin:0 0 19px;color:#64748b;font-size:12px}.flatten-track{height:7px;border-radius:99px;background:#e2e8f0;overflow:hidden}.flatten-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#0f766e,#2dd4bf);transition:width .3s ease}
.flatten-success{text-align:center;padding:25px 5px 8px}.flatten-success-icon{display:grid;place-items:center;width:66px;height:66px;margin:0 auto 17px;border-radius:20px;background:#dcfce7;color:#15803d}.flatten-success h2{margin:0 0 8px;font:800 23px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.04em}.flatten-success p{margin:0 auto 12px;max-width:500px;color:#64748b;font-size:13px;line-height:1.6}.flatten-result{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;margin:0 0 20px;border-radius:999px;background:#f0fdf4;color:#15803d;font-size:10px;font-weight:750}.flatten-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.flatten-download,.flatten-again{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:10px;font-weight:750;text-decoration:none;cursor:pointer}.flatten-download{border:0;background:#172033;color:#fff}.flatten-again{border:1px solid #cbd5e1;background:#fff;color:#475569}
.flatten-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.flatten-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.flatten-info svg{color:#0d9488}.flatten-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.flatten-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}.flatten-note{margin:20px 0 0;padding:15px 17px;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;background:#fffbeb;color:#854d0e;font-size:11px;line-height:1.65}
@keyframes flatten-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@media(max-width:680px){.flatten-wrap{width:min(100% - 28px,960px)}.flatten-hero{padding:56px 0 36px}.flatten-card{padding:18px;border-radius:17px}.flatten-drop{padding:42px 14px}.flatten-modes,.flatten-info{grid-template-columns:1fr}.flatten-main{padding-top:25px}}
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

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) reject(new Error('A page could not be rendered.'))
      else void blob.arrayBuffer().then(resolve, reject)
    }, 'image/jpeg', 0.94)
  })
}

function detectSignature(bytes: Uint8Array): boolean {
  const chunkSize = 8 * 1024 * 1024
  const decoder = new TextDecoder('latin1')
  const first = decoder.decode(bytes.subarray(0, Math.min(bytes.length, chunkSize)))
  const last = bytes.length > chunkSize ? decoder.decode(bytes.subarray(bytes.length - chunkSize)) : ''
  return /\/ByteRange\s*\[|\/FT\s*\/Sig\b|\/Type\s*\/Sig\b/.test(`${first}\n${last}`)
}

export default function PDFFlattenPage() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<FlattenMode>('forms')
  const [dragging, setDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading PDF')
  const [pageCount, setPageCount] = useState(0)
  const [fieldCount, setFieldCount] = useState(0)
  const [signed, setSigned] = useState(false)
  const [signatureAck, setSignatureAck] = useState(false)
  const [error, setError] = useState('')
  const [download, setDownload] = useState<{ url: string; name: string; mode: FlattenMode } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => () => {
    if (download?.url) URL.revokeObjectURL(download.url)
  }, [download])

  const reset = useCallback(() => {
    setFile(null); setMode('forms'); setAnalyzing(false); setProcessing(false)
    setProgress(0); setProgressLabel('Reading PDF'); setPageCount(0); setFieldCount(0)
    setSigned(false); setSignatureAck(false); setError(''); setDownload(null)
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }

    setAnalyzing(true); setError(''); setDownload(null); setSignatureAck(false)
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, 1024))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const { PDFDocument } = await import('pdf-lib')
      const document = await PDFDocument.load(bytes)
      const fields = document.getForm().getFields()
      setFile(candidate); setPageCount(document.getPageCount()); setFieldCount(fields.length)
      setSigned(detectSignature(bytes))
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF could not be read.'
      setFile(null)
      setError(/encrypt|password/i.test(message) ? 'This PDF is password-protected. Unlock it with the known password first.' : message)
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault(); setDragging(false)
    const candidate = event.dataTransfer.files[0]
    if (candidate) void handleFile(candidate)
  }, [handleFile])

  const flatten = async () => {
    if (!file || processing || (signed && !signatureAck)) return
    setProcessing(true); setError(''); setProgress(8); setProgressLabel('Reading PDF')
    void trackEvent('pdf_flatten_started', { mode, file_size: sizeBucket(file.size) })

    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      const { PDFDocument, PDFName } = await import('pdf-lib')
      let output: Uint8Array

      if (mode === 'forms') {
        setProgress(42); setProgressLabel(`Flattening ${fieldCount} form ${fieldCount === 1 ? 'field' : 'fields'}`)
        const document = await PDFDocument.load(bytes)
        const form = document.getForm()
        if (form.getFields().length) form.flatten()
        document.catalog.delete(PDFName.of('AcroForm'))
        setProgress(82); setProgressLabel('Writing quality-preserving copy')
        output = await document.save({ useObjectStreams: true })
      } else {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        const source = await pdfjs.getDocument({ data: bytes.slice() }).promise
        const outputDocument = await PDFDocument.create()

        for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
          setProgress(12 + Math.round((pageNumber / source.numPages) * 72))
          setProgressLabel(`Rendering page ${pageNumber} of ${source.numPages}`)
          const page = await source.getPage(pageNumber)
          const base = page.getViewport({ scale: 1 })
          const maxPixels = 18_000_000
          const scale = Math.min(2, Math.sqrt(maxPixels / (base.width * base.height)))
          const viewport = page.getViewport({ scale })
          const canvas = window.document.createElement('canvas')
          canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height)
          const context = canvas.getContext('2d', { alpha: false })
          if (!context) throw new Error('Your browser could not create the page renderer.')
          await page.render({
            canvasContext: context,
            viewport,
            // Flatten what a recipient can actually see in a viewer. Using the
            // print intent would silently omit visible annotations whose PDF
            // flags do not explicitly mark them as printable.
            intent: 'display',
            annotationMode: pdfjs.AnnotationMode.ENABLE,
            background: '#ffffff',
          }).promise
          const image = await outputDocument.embedJpg(await canvasToJpeg(canvas))
          const outputPage = outputDocument.addPage([base.width, base.height])
          outputPage.drawImage(image, { x: 0, y: 0, width: base.width, height: base.height })
          canvas.width = 1; canvas.height = 1
          page.cleanup()
        }
        await source.destroy()
        setProgress(88); setProgressLabel('Writing fully flattened copy')
        output = await outputDocument.save({ useObjectStreams: true })
      }

      setProgress(100)
      const outputBuffer = output.buffer.slice(
        output.byteOffset,
        output.byteOffset + output.byteLength,
      ) as ArrayBuffer
      const blob = new Blob([outputBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const baseName = file.name.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_')
      const name = `${baseName}_flattened.pdf`
      setDownload({ url, name, mode })
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click()
      void trackEvent('pdf_flatten_completed', { mode, file_size: sizeBucket(file.size) })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF could not be flattened.'
      setError(message)
      void trackEvent('pdf_flatten_failed', { mode, reason: /password|encrypt/i.test(message) ? 'password_protected' : 'processing_error' })
    } finally {
      setProcessing(false)
    }
  }

  const canFlatten = Boolean(file && !analyzing && (!signed || signatureAck))

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="flatten-page">
        <SiteNav />
        <header className="flatten-hero"><div className="flatten-wrap">
          <div className="flatten-badge"><Layers size={13} /> Free PDF finishing tool</div>
          <h1>Flatten your <span>PDF</span></h1>
          <p>Make form fields or every visible page element permanent. Choose the flattening method that fits how you will share the PDF.</p>
          <div className="flatten-trust"><span><ShieldCheck size={14} /> No file upload</span><span><Sparkles size={14} /> Two flatten modes</span><span><Check size={14} /> No account required</span></div>
        </div></header>

        <main className="flatten-main"><div className="flatten-wrap">
          <section className="flatten-card" aria-label="Flatten PDF">
            {download ? (
              <div className="flatten-success" role="status">
                <div className="flatten-success-icon"><FileCheck2 size={32} /></div><h2>Your flattened PDF is ready</h2>
                <p>{download.mode === 'forms' ? 'Interactive form fields are now permanent while original text and graphics stay intact.' : 'Each page is now a single visual layer with visible annotations and form appearances baked in.'}</p>
                <div className="flatten-result"><Check size={13} /> {download.mode === 'forms' ? 'Quality-preserving form flatten' : 'Full visual flatten'}</div>
                <div className="flatten-actions"><a className="flatten-download" href={download.url} download={download.name}><Download size={17} /> Download again</a><button className="flatten-again" type="button" onClick={reset}><RotateCcw size={16} /> Flatten another</button></div>
              </div>
            ) : processing ? (
              <div className="flatten-progress" role="status" aria-live="polite"><div className="flatten-progress-icon"><Layers size={29} /></div><h2>Flattening locally</h2><p>{progressLabel} - your document never leaves this device.</p><div className="flatten-track" aria-label={`${progress}% complete`}><div className="flatten-fill" style={{ width: `${progress}%` }} /></div></div>
            ) : !file ? (
              <label className={`flatten-drop${dragging ? ' dragging' : ''}`} htmlFor="flatten-file-input" onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
                <div className="flatten-drop-icon"><UploadCloud size={28} /></div><h2>{analyzing ? 'Inspecting your PDF' : 'Drop your PDF here'}</h2><p>{analyzing ? 'Checking pages, form fields, and signatures locally.' : 'Choose a PDF with forms, comments, stamps, or annotations.'}</p><span className="flatten-choose"><FileText size={16} /> Choose PDF</span><div className="flatten-private">100% browser processing - zero file upload</div>
                <input id="flatten-file-input" ref={fileInput} type="file" accept="application/pdf,.pdf" hidden disabled={analyzing} onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} />
              </label>
            ) : (
              <>
                <div className="flatten-file"><div className="flatten-file-icon"><FileText size={21} /></div><div className="flatten-file-info"><div className="flatten-file-name">{file.name}</div><div className="flatten-file-size">{formatBytes(file.size)} - stored only in this tab</div></div><button className="flatten-remove" type="button" onClick={reset} aria-label="Remove selected PDF"><X size={16} /></button></div>
                <div className="flatten-meta"><span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span><span>{fieldCount} form {fieldCount === 1 ? 'field' : 'fields'}</span>{signed && <span>Digital signature detected</span>}</div>
                {error && <div className="flatten-error" role="alert"><X size={16} /><span>{error}</span></div>}
                <span className="flatten-label">Choose how to flatten</span>
                <div className="flatten-modes">
                  <button className={`flatten-mode${mode === 'forms' ? ' selected' : ''}`} type="button" onClick={() => setMode('forms')}><span className="flatten-mode-mark"><Check size={11} /></span><div className="flatten-mode-head"><MousePointer2 size={17} /> Form fields only</div><p>Makes AcroForm values permanent while preserving selectable text, links, vectors, and original image quality.</p></button>
                  <button className={`flatten-mode${mode === 'visual' ? ' selected' : ''}`} type="button" onClick={() => setMode('visual')}><span className="flatten-mode-mark"><Check size={11} /></span><div className="flatten-mode-head"><Layers size={17} /> Full visual flatten</div><p>Bakes visible forms and annotations into high-resolution page images for consistent viewing and printing.</p></button>
                </div>
                <div className="flatten-advice"><ShieldCheck size={16} /><span>{mode === 'forms' ? (fieldCount ? `${fieldCount} interactive ${fieldCount === 1 ? 'field' : 'fields'} will become permanent. Non-form comments remain annotations.` : 'No AcroForm fields were detected. Choose Full visual flatten if you need to bake comments or annotations into the page.') : 'Full visual flatten removes interactivity, selectable/searchable text, live links, tags, and accessibility structure. Output size may increase.'}</span></div>
                {signed && <div className="flatten-warning"><AlertTriangle size={17} /><div><strong>Digital signature detected.</strong> Flattening changes the document and will invalidate existing cryptographic signatures.<label className="flatten-ack"><input type="checkbox" checked={signatureAck} onChange={event => setSignatureAck(event.target.checked)} /><span>I understand the existing digital signature will no longer validate.</span></label></div></div>}
                <button className="flatten-submit" type="button" disabled={!canFlatten} onClick={() => void flatten()}><Layers size={18} /> Flatten PDF</button>
              </>
            )}
          </section>
          {!file && error && <div className="flatten-error" role="alert" style={{ marginTop: 14 }}><X size={16} /><span>{error}</span></div>}
          <div className="flatten-info"><article><MousePointer2 size={21} /><h3>Permanent form values</h3><p>Turn completed form fields into regular page content so recipients cannot accidentally change them.</p></article><article><Layers size={21} /><h3>Consistent appearance</h3><p>Full visual flatten makes every supported viewer and printer display the same visible page.</p></article><article><ShieldCheck size={21} /><h3>Private by design</h3><p>Both methods run locally in your browser. The PDF is never uploaded to our servers.</p></article></div>
          <p className="flatten-note"><LockKeyhole size={14} style={{ verticalAlign: -2, marginRight: 6 }} /><strong>Keep the original:</strong> flattening is intentionally difficult to reverse. Save an editable copy before making fields or annotations permanent.</p>
          <ToolQuickFacts
            definition="Flattening makes interactive or layered PDF content permanent — form field values, comments, and annotations become regular, non-editable page content that cannot be accidentally changed. It's commonly used after completing a form or preparing a final copy for printing and distribution."
            price="Free — no account needed"
            account="Not required"
            processing="Entirely in your browser — file never uploaded"
            formats="PDF"
            fileLimit="Up to 100 MB"
            browserSupport="Chrome, Firefox, Safari, Edge"
          />
          <ToolSEOSection {...toolSeoData['pdf-flatten']} />
        </div></main>
        <div style={{ marginTop: 20 }}><SiteFooter /></div>
      </div>
    </>
  )
}
