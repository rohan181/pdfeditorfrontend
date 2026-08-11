'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  Download,
  FileCheck2,
  FileText,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
  Wrench,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'

const MAX_FILE_SIZE = 100 * 1024 * 1024

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.repair-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}
.repair-wrap{width:min(960px,calc(100% - 40px));margin:0 auto}
.repair-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #f0f1f4;background:radial-gradient(circle at 50% 10%,rgba(234,88,12,.11),transparent 38%),linear-gradient(180deg,#fffaf6 0%,#fff 100%)}
.repair-hero::before,.repair-hero::after{content:'';position:absolute;border:1px solid rgba(234,88,12,.1);border-radius:999px;pointer-events:none}
.repair-hero::before{width:360px;height:360px;left:-220px;top:-220px}.repair-hero::after{width:280px;height:280px;right:-170px;bottom:-190px}
.repair-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(234,88,12,.2);border-radius:999px;background:#fff;color:#ea580c;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(234,88,12,.08)}
.repair-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}
.repair-hero h1 span{color:#ea580c}.repair-hero p{max-width:590px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}
.repair-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.repair-trust span{display:flex;align-items:center;gap:5px}
.repair-main{padding:38px 0 70px}.repair-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.repair-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:border-color .18s,background .18s,transform .18s}.repair-drop:hover,.repair-drop.dragging{border-color:#ea580c;background:#fff7ed;transform:translateY(-1px)}
.repair-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#ea580c,#fb923c);color:#fff;box-shadow:0 12px 28px rgba(234,88,12,.24)}
.repair-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.repair-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}
.repair-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.repair-private{margin-top:13px;color:#ea580c;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.repair-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:20px;border:1px solid #fed7aa;border-radius:13px;background:#fff7ed}.repair-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#ffedd5;color:#ea580c;flex:0 0 auto}.repair-file-info{min-width:0;flex:1}.repair-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.repair-file-size{margin-top:3px;color:#64748b;font-size:10px}.repair-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #fed7aa;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.repair-remove:hover{border-color:#ef4444;color:#ef4444}
.repair-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin-bottom:16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}
.repair-submit{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;border:0;border-radius:11px;background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;font:800 15px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(234,88,12,.2);transition:transform .16s,box-shadow .16s}.repair-submit:hover{transform:translateY(-1px);box-shadow:0 16px 32px rgba(234,88,12,.26)}
.repair-limit{display:flex;align-items:center;justify-content:center;gap:6px;margin:11px 0 0;color:#64748b;font-size:10px}
.repair-progress{padding:26px 4px 10px;text-align:center}.repair-progress-icon{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 16px;border-radius:17px;background:#fff7ed;color:#ea580c;animation:repair-pulse 1.6s ease-in-out infinite}.repair-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.repair-progress p{margin:0 0 19px;color:#64748b;font-size:12px}.repair-track{height:7px;border-radius:99px;background:#e2e8f0;overflow:hidden}.repair-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#ea580c,#fb923c);transition:width .3s ease}
.repair-success{text-align:center;padding:25px 5px 8px}.repair-success-icon{display:grid;place-items:center;width:66px;height:66px;margin:0 auto 17px;border-radius:20px;background:#dcfce7;color:#15803d}.repair-success h2{margin:0 0 8px;font:800 23px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.04em}.repair-success p{margin:0 auto 12px;max-width:500px;color:#64748b;font-size:13px;line-height:1.6}.repair-result{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;margin:0 0 20px;border-radius:999px;background:#f0fdf4;color:#15803d;font-size:10px;font-weight:750}.repair-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.repair-download,.repair-again{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:10px;font-weight:750;text-decoration:none;cursor:pointer}.repair-download{border:0;background:#172033;color:#fff}.repair-again{border:1px solid #cbd5e1;background:#fff;color:#475569}
.repair-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.repair-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.repair-info svg{color:#ea580c}.repair-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.repair-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
.repair-note{margin:20px 0 0;padding:15px 17px;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;background:#fffbeb;color:#854d0e;font-size:11px;line-height:1.65}.repair-note strong{font-weight:800}
@keyframes repair-pulse{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(1.06) rotate(8deg)}}
@media(max-width:680px){.repair-wrap{width:min(100% - 28px,960px)}.repair-hero{padding:56px 0 36px}.repair-card{padding:18px;border-radius:17px}.repair-drop{padding:42px 14px}.repair-info{grid-template-columns:1fr}.repair-main{padding-top:25px}}
`

type WorkerResponse =
  | { type: 'progress'; value: number; label: string }
  | { type: 'success'; buffer: ArrayBuffer; recoveredIssues: boolean }
  | { type: 'error'; message: string }

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

function runRepairWorker(
  buffer: ArrayBuffer,
  onProgress: (value: number, label: string) => void,
): Promise<{ buffer: ArrayBuffer; recoveredIssues: boolean }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../../workers/qpdf-repair.worker.ts', import.meta.url),
    )

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data
      if (message.type === 'progress') {
        onProgress(message.value, message.label)
        return
      }

      worker.terminate()
      if (message.type === 'success') {
        resolve({ buffer: message.buffer, recoveredIssues: message.recoveredIssues })
      } else {
        reject(new Error(message.message))
      }
    }

    worker.onerror = () => {
      worker.terminate()
      reject(new Error('The local repair engine failed to start. Please reload and try again.'))
    }

    worker.postMessage({ buffer }, [buffer])
  })
}

export default function PDFRepairPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading PDF')
  const [error, setError] = useState('')
  const [download, setDownload] = useState<{ url: string; name: string; recoveredIssues: boolean } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (download?.url) URL.revokeObjectURL(download.url)
    }
  }, [download])

  const reset = useCallback(() => {
    setFile(null)
    setProcessing(false)
    setProgress(0)
    setProgressLabel('Reading PDF')
    setError('')
    setDownload(null)
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback((candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.')
      return
    }
    if (candidate.size === 0) {
      setError('This PDF is empty and cannot be repaired.')
      return
    }
    if (candidate.size > MAX_FILE_SIZE) {
      setError('Please select a PDF smaller than 100 MB.')
      return
    }

    setFile(candidate)
    setDownload(null)
    setError('')
  }, [])

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    const candidate = event.dataTransfer.files[0]
    if (candidate) handleFile(candidate)
  }, [handleFile])

  const repair = async () => {
    if (!file || processing) return

    setError('')
    setProcessing(true)
    setProgress(10)
    setProgressLabel('Reading PDF')
    void trackEvent('pdf_repair_started', { file_size: sizeBucket(file.size) })

    try {
      const source = await file.arrayBuffer()
      const header = new TextDecoder('latin1').decode(source.slice(0, 1024))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')

      const result = await runRepairWorker(source, (value, label) => {
        setProgress(value)
        setProgressLabel(label)
      })

      setProgress(100)
      const blob = new Blob([result.buffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const base = file.name.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_')
      const name = `${base}_repaired.pdf`
      setDownload({ url, name, recoveredIssues: result.recoveredIssues })

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name
      anchor.click()
      void trackEvent('pdf_repair_completed', {
        file_size: sizeBucket(file.size),
        recovered_issues: result.recoveredIssues,
      })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF could not be repaired.'
      setError(message)
      void trackEvent('pdf_repair_failed', {
        reason: /password/i.test(message) ? 'password_protected' : 'processing_error',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="repair-page">
        <SiteNav />

        <header className="repair-hero">
          <div className="repair-wrap">
            <div className="repair-badge"><Wrench size={13} /> Free PDF recovery tool</div>
            <h1>Repair your <span>PDF</span></h1>
            <p>Rebuild recoverable PDF structure errors and download a clean copy. Everything happens privately inside your browser.</p>
            <div className="repair-trust">
              <span><ShieldCheck size={14} /> No file upload</span>
              <span><RefreshCw size={14} /> Rebuilds structure</span>
              <span><Check size={14} /> No account required</span>
            </div>
          </div>
        </header>

        <main className="repair-main">
          <div className="repair-wrap">
            <section className="repair-card" aria-label="Repair PDF">
              {download ? (
                <div className="repair-success" role="status">
                  <div className="repair-success-icon"><FileCheck2 size={32} /></div>
                  <h2>Your repaired PDF is ready</h2>
                  <p>A new structurally clean copy was created locally. Your original file was not changed.</p>
                  <div className="repair-result"><Check size={13} /> {download.recoveredIssues ? 'Recoverable structural issues rebuilt' : 'PDF structure rewritten and validated'}</div>
                  <div className="repair-actions">
                    <a className="repair-download" href={download.url} download={download.name}>
                      <Download size={17} /> Download again
                    </a>
                    <button className="repair-again" type="button" onClick={reset}>
                      <RotateCcw size={16} /> Repair another
                    </button>
                  </div>
                </div>
              ) : processing ? (
                <div className="repair-progress" role="status" aria-live="polite">
                  <div className="repair-progress-icon"><Wrench size={29} /></div>
                  <h2>Repairing locally</h2>
                  <p>{progressLabel} - your document never leaves this device.</p>
                  <div className="repair-track" aria-label={`${progress}% complete`}>
                    <div className="repair-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : !file ? (
                <label
                  className={`repair-drop${dragging ? ' dragging' : ''}`}
                  htmlFor="repair-file-input"
                  onDragOver={event => { event.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <div className="repair-drop-icon"><UploadCloud size={28} /></div>
                  <h2>Drop the damaged PDF here</h2>
                  <p>Choose a PDF that will not open, displays errors, or has broken internal structure.</p>
                  <span className="repair-choose"><FileText size={16} /> Choose PDF</span>
                  <div className="repair-private">100% browser processing - zero file upload</div>
                  <input
                    id="repair-file-input"
                    ref={fileInput}
                    type="file"
                    accept="application/pdf,.pdf"
                    hidden
                    onChange={event => {
                      const candidate = event.target.files?.[0]
                      if (candidate) handleFile(candidate)
                    }}
                  />
                </label>
              ) : (
                <>
                  <div className="repair-file">
                    <div className="repair-file-icon"><FileText size={21} /></div>
                    <div className="repair-file-info">
                      <div className="repair-file-name">{file.name}</div>
                      <div className="repair-file-size">{formatBytes(file.size)} - stored only in this tab</div>
                    </div>
                    <button className="repair-remove" type="button" onClick={reset} aria-label="Remove selected PDF"><X size={16} /></button>
                  </div>

                  {error && <div className="repair-error" role="alert"><X size={16} /> <span>{error}</span></div>}

                  <button className="repair-submit" type="button" onClick={() => void repair()}>
                    <Wrench size={18} /> Repair PDF
                  </button>
                  <p className="repair-limit"><ShieldCheck size={13} /> Maximum file size: 100 MB. Your original PDF is never modified.</p>
                </>
              )}
            </section>

            {!download && !processing && error && !file && <div className="repair-error" role="alert" style={{ marginTop: 14 }}><X size={16} /> <span>{error}</span></div>}

            <div className="repair-info">
              <article><RefreshCw size={21} /><h3>Rebuilds structure</h3><p>Recovers readable objects, reconstructs cross-reference data, and writes a clean document structure.</p></article>
              <article><ShieldCheck size={21} /><h3>Private by design</h3><p>WebAssembly repairs the PDF locally. The document is never sent to our servers.</p></article>
              <article><FileCheck2 size={21} /><h3>Content preserved</h3><p>Pages are not rasterized, so recoverable text, links, images, fonts, and forms stay intact.</p></article>
            </div>

            <p className="repair-note"><AlertTriangle size={14} style={{ verticalAlign: -2, marginRight: 6 }} /><strong>Repair has limits:</strong> no automatic tool can restore content that is missing, overwritten, or irreversibly corrupted. Always keep the original file and review the repaired copy.</p>

            <ToolSEOSection {...toolSeoData['pdf-repair']} />
          </div>
        </main>

        <div style={{ marginTop: 20 }}><SiteFooter /></div>
      </div>
    </>
  )
}
