'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Check,
  Download,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  UnlockKeyhole,
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

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.unlock-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}
.unlock-wrap{width:min(960px,calc(100% - 40px));margin:0 auto}
.unlock-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 10%,rgba(37,99,235,.10),transparent 38%),linear-gradient(180deg,#f8fbff 0%,#fff 100%)}
.unlock-hero::before,.unlock-hero::after{content:'';position:absolute;border:1px solid rgba(37,99,235,.1);border-radius:999px;pointer-events:none}
.unlock-hero::before{width:360px;height:360px;left:-220px;top:-220px}.unlock-hero::after{width:280px;height:280px;right:-170px;bottom:-190px}
.unlock-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(37,99,235,.18);border-radius:999px;background:#fff;color:#2563eb;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(37,99,235,.08)}
.unlock-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}
.unlock-hero h1 span{color:#2563eb}
.unlock-hero p{max-width:570px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}
.unlock-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}
.unlock-trust span{display:flex;align-items:center;gap:5px}
.unlock-main{padding:38px 0 70px}
.unlock-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.unlock-drop{width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:border-color .18s,background .18s,transform .18s}
.unlock-drop:hover,.unlock-drop.dragging{border-color:#2563eb;background:#eff6ff;transform:translateY(-1px)}
.unlock-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;box-shadow:0 12px 28px rgba(37,99,235,.24)}
.unlock-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}
.unlock-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}
.unlock-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border:0;border-radius:10px;background:#172033;color:#fff;font-weight:750;cursor:pointer}
.unlock-private{margin-top:13px;color:#2563eb;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.unlock-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:22px;border:1px solid #dbe4f0;border-radius:13px;background:#f8fafc}
.unlock-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#dbeafe;color:#2563eb;flex:0 0 auto}
.unlock-file-info{min-width:0;flex:1}.unlock-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.unlock-file-size{margin-top:3px;color:#64748b;font-size:10px}
.unlock-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #dbe4f0;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.unlock-remove:hover{border-color:#ef4444;color:#ef4444}
.unlock-label{display:block;margin-bottom:8px;color:#475569;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
.unlock-password-wrap{position:relative}.unlock-password{width:100%;padding:13px 48px 13px 14px;border:1px solid #cbd5e1;border-radius:11px;background:#fff;color:#172033;font:500 14px/1 var(--font-dm,system-ui);outline:none}.unlock-password:focus{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.09)}
.unlock-eye{position:absolute;right:11px;top:50%;display:grid;place-items:center;transform:translateY(-50%);width:32px;height:32px;border:0;background:transparent;color:#64748b;cursor:pointer}
.unlock-help{margin:7px 0 18px;color:#64748b;font-size:11px;line-height:1.5}
.unlock-auth{display:flex;align-items:flex-start;gap:10px;padding:13px 14px;margin:0 0 18px;border:1px solid #dbe4f0;border-radius:11px;background:#f8fafc;color:#475569;font-size:12px;line-height:1.5;cursor:pointer}
.unlock-auth input{width:16px;height:16px;margin-top:1px;accent-color:#2563eb;flex:0 0 auto}
.unlock-submit{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;border:0;border-radius:11px;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;font:800 15px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(37,99,235,.2);transition:transform .16s,box-shadow .16s}.unlock-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 16px 32px rgba(37,99,235,.26)}.unlock-submit:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.unlock-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin-bottom:16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}
.unlock-progress{padding:26px 4px 10px;text-align:center}.unlock-progress-icon{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 16px;border-radius:17px;background:#eff6ff;color:#2563eb;animation:unlock-pulse 1.6s ease-in-out infinite}.unlock-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.unlock-progress p{margin:0 0 19px;color:#64748b;font-size:12px}.unlock-track{height:7px;border-radius:99px;background:#e2e8f0;overflow:hidden}.unlock-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#2563eb,#60a5fa);transition:width .3s ease}
.unlock-success{text-align:center;padding:25px 5px 8px}.unlock-success-icon{display:grid;place-items:center;width:66px;height:66px;margin:0 auto 17px;border-radius:20px;background:#dcfce7;color:#15803d}.unlock-success h2{margin:0 0 8px;font:800 23px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.04em}.unlock-success p{margin:0 auto 23px;max-width:480px;color:#64748b;font-size:13px;line-height:1.6}.unlock-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.unlock-download,.unlock-again{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:10px;font-weight:750;text-decoration:none;cursor:pointer}.unlock-download{border:0;background:#172033;color:#fff}.unlock-again{border:1px solid #cbd5e1;background:#fff;color:#475569}
.unlock-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.unlock-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.unlock-info svg{color:#2563eb}.unlock-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.unlock-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
.unlock-note{margin:20px 0 0;padding:15px 17px;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;background:#fffbeb;color:#854d0e;font-size:11px;line-height:1.65}.unlock-note strong{font-weight:800}
@keyframes unlock-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@media(max-width:680px){.unlock-wrap{width:min(100% - 28px,960px)}.unlock-hero{padding:56px 0 36px}.unlock-card{padding:18px;border-radius:17px}.unlock-drop{padding:42px 14px}.unlock-info{grid-template-columns:1fr}.unlock-main{padding-top:25px}}
`

type WorkerResponse =
  | { type: 'progress'; value: number; label: string }
  | { type: 'success'; buffer: ArrayBuffer }
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

function runUnlockWorker(
  buffer: ArrayBuffer,
  password: string,
  onProgress: (value: number, label: string) => void,
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../../workers/qpdf-unlock.worker.ts', import.meta.url),
    )

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data
      if (message.type === 'progress') {
        onProgress(message.value, message.label)
        return
      }

      worker.terminate()
      if (message.type === 'success') resolve(message.buffer)
      else reject(new Error(message.message))
    }

    worker.onerror = () => {
      worker.terminate()
      reject(new Error('The local PDF engine failed to start. Please reload and try again.'))
    }

    worker.postMessage({ buffer, password }, [buffer])
  })
}

export default function PDFUnlockPage() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading PDF')
  const [error, setError] = useState('')
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (download?.url) URL.revokeObjectURL(download.url)
    }
  }, [download])

  const reset = useCallback(() => {
    setFile(null)
    setPassword('')
    setAuthorized(false)
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
      setError('This PDF is empty.')
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

  const unlock = async () => {
    if (!file || !authorized || processing) return
    if (password.includes('\0')) {
      setError('The password contains an unsupported character.')
      return
    }

    setError('')
    setProcessing(true)
    setProgress(12)
    setProgressLabel('Reading PDF')
    void trackEvent('pdf_unlock_started', { file_size: sizeBucket(file.size) })

    try {
      const source = await file.arrayBuffer()
      const header = new TextDecoder('latin1').decode(source.slice(0, 1024))
      if (!header.includes('%PDF-')) throw new Error('This file is not a valid PDF.')

      const output = await runUnlockWorker(source, password, (value, label) => {
        setProgress(value)
        setProgressLabel(label)
      })

      setProgress(100)
      const blob = new Blob([output], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const base = file.name.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_')
      const name = `${base}_unlocked.pdf`
      setDownload({ url, name })

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name
      anchor.click()
      void trackEvent('pdf_unlock_completed', { file_size: sizeBucket(file.size) })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF could not be unlocked.'
      setError(message)
      void trackEvent('pdf_unlock_failed', {
        reason: /password/i.test(message) ? 'invalid_password' : 'processing_error',
      })
  } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="unlock-page">
        <SiteNav />

        <header className="unlock-hero">
          <div className="unlock-wrap">
            <div className="unlock-badge"><UnlockKeyhole size={13} /> Free PDF security tool</div>
            <h1>Unlock your <span>PDF</span></h1>
            <p>Remove a PDF password you know and download an unrestricted copy. The file and password stay inside your browser.</p>
            <div className="unlock-trust">
              <span><ShieldCheck size={14} /> No file upload</span>
              <span><LockKeyhole size={14} /> Password stays local</span>
              <span><Check size={14} /> No account required</span>
            </div>
          </div>
        </header>

        <main className="unlock-main">
          <div className="unlock-wrap">
            <section className="unlock-card" aria-label="Unlock PDF">
              {download ? (
                <div className="unlock-success" role="status">
                  <div className="unlock-success-icon"><UnlockKeyhole size={32} /></div>
                  <h2>Your PDF is unlocked</h2>
                  <p>The password protection was removed locally. Your download should have started automatically.</p>
                  <div className="unlock-actions">
                    <a className="unlock-download" href={download.url} download={download.name}>
                      <Download size={17} /> Download again
                    </a>
                    <button className="unlock-again" type="button" onClick={reset}>
                      <RotateCcw size={16} /> Unlock another
                    </button>
                  </div>
                </div>
              ) : processing ? (
                <div className="unlock-progress" role="status" aria-live="polite">
                  <div className="unlock-progress-icon"><UnlockKeyhole size={29} /></div>
                  <h2>Unlocking securely</h2>
                  <p>{progressLabel} - your document never leaves this device.</p>
                  <div className="unlock-track" aria-label={`${progress}% complete`}>
                    <div className="unlock-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : !file ? (
                <label
                  className={`unlock-drop${dragging ? ' dragging' : ''}`}
                  htmlFor="unlock-file-input"
                  onDragOver={event => { event.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <div className="unlock-drop-icon"><UploadCloud size={28} /></div>
                  <h2>Drop your protected PDF here</h2>
                  <p>Choose a password-protected PDF up to 100 MB.</p>
                  <span className="unlock-choose"><FileText size={16} /> Choose PDF</span>
                  <div className="unlock-private">100% browser processing - zero file upload</div>
                  <input
                    id="unlock-file-input"
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
                  <div className="unlock-file">
                    <div className="unlock-file-icon"><FileText size={21} /></div>
                    <div className="unlock-file-info">
                      <div className="unlock-file-name">{file.name}</div>
                      <div className="unlock-file-size">{formatBytes(file.size)} - stored only in this tab</div>
                    </div>
                    <button className="unlock-remove" type="button" onClick={reset} aria-label="Remove selected PDF"><X size={16} /></button>
                  </div>

                  {error && <div className="unlock-error" role="alert"><X size={16} /> <span>{error}</span></div>}

                  <label className="unlock-label" htmlFor="pdf-password">Current PDF password</label>
                  <div className="unlock-password-wrap">
                    <input
                      id="pdf-password"
                      className="unlock-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      maxLength={512}
                      autoComplete="current-password"
                      placeholder="Enter the password used to open this PDF"
                      onChange={event => setPassword(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' && authorized) void unlock()
                      }}
                    />
                    <button className="unlock-eye" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="unlock-help">Leave this empty only when the PDF opens without a password but restricts printing, copying, or editing.</p>

                  <label className="unlock-auth">
                    <input type="checkbox" checked={authorized} onChange={event => setAuthorized(event.target.checked)} />
                    <span>I own this document or I am authorized to remove its password and restrictions.</span>
                  </label>

                  <button className="unlock-submit" type="button" disabled={!authorized} onClick={() => void unlock()}>
                    <UnlockKeyhole size={18} /> Unlock PDF
                  </button>
                </>
              )}
            </section>

            {!download && !processing && error && !file && <div className="unlock-error" role="alert" style={{ marginTop: 14 }}><X size={16} /> <span>{error}</span></div>}

            <div className="unlock-info">
              <article><ShieldCheck size={21} /><h3>Private by design</h3><p>WebAssembly processes the PDF locally. Neither the file nor its password is transmitted.</p></article>
              <article><UnlockKeyhole size={21} /><h3>Known passwords only</h3><p>This tool removes standard PDF encryption when you provide the correct user or owner password.</p></article>
              <article><Download size={21} /><h3>Quality preserved</h3><p>QPDF rewrites the document structure without rasterizing pages or reducing image quality.</p></article>
            </div>

            <p className="unlock-note"><strong>Important:</strong> This tool does not guess, recover, or brute-force passwords and cannot remove certificate security or third-party DRM. Only unlock documents you own or are authorized to modify.</p>

            <ToolQuickFacts
              definition="Unlocking a PDF removes its standard password encryption and permission restrictions, producing a copy that can be opened without entering the password. You must provide the correct user or owner password when the document requires one."
              price="Free — no account needed"
              account="Not required"
              processing="Processed locally in your browser via WebAssembly"
              formats="PDF"
              fileLimit="Up to 100 MB"
              browserSupport="Chrome, Firefox, Safari, Edge"
            />
            <ToolSEOSection {...toolSeoData['pdf-unlock']} />
          </div>
        </main>

        <div style={{ marginTop: 20 }}>
          <SiteFooter />
        </div>
      </div>
    </>
  )
}
