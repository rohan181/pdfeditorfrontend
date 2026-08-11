'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  Download,
  FileCheck2,
  FileText,
  Hash,
  ListOrdered,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Tags,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'
import {
  labelForPage,
  parsePageLabels,
  writePageLabels,
  type PageLabelRule,
  type PageLabelStyle,
} from '@/lib/pdfPageLabels'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 2_000
const MAX_RANGES = 200
const STYLES: PageLabelStyle[] = ['Decimal', 'Upper Roman', 'Lower Roman', 'Upper Letters', 'Lower Letters', 'Prefix only']

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.page-labels-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.page-labels-wrap{width:min(1080px,calc(100% - 40px));margin:0 auto}
.page-labels-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(234,88,12,.14),transparent 40%),linear-gradient(180deg,#fff8f3 0%,#fff 100%)}.page-labels-hero::before,.page-labels-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(234,88,12,.1);border-radius:999px}.page-labels-hero::before{width:350px;height:350px;left:-220px;top:-220px}.page-labels-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.page-labels-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(234,88,12,.24);border-radius:999px;background:#fff;color:#c2410c;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(234,88,12,.08)}.page-labels-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.page-labels-hero h1 span{color:#ea580c}.page-labels-hero p{max-width:700px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.page-labels-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.page-labels-trust span{display:flex;align-items:center;gap:5px}
.page-labels-main{padding:38px 0 72px}.page-labels-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.page-labels-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.page-labels-drop:hover,.page-labels-drop.dragging{border-color:#ea580c;background:#fff7ed;transform:translateY(-1px)}.page-labels-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#c2410c,#fb923c);color:#fff;box-shadow:0 12px 28px rgba(234,88,12,.24)}.page-labels-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.page-labels-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.page-labels-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.page-labels-private{margin-top:13px;color:#c2410c;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.page-labels-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #fed7aa;border-radius:13px;background:#fff7ed}.page-labels-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#ffedd5;color:#c2410c;flex:0 0 auto}.page-labels-file-info{min-width:0;flex:1}.page-labels-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.page-labels-file-size{margin-top:3px;color:#64748b;font-size:10px}.page-labels-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #fed7aa;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.page-labels-remove:hover{border-color:#ef4444;color:#ef4444}
.page-labels-progress{padding:26px 4px 10px;text-align:center}.page-labels-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#ffedd5;color:#c2410c;animation:page-labels-pulse 1.5s ease-in-out infinite}.page-labels-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.page-labels-progress p{margin:0;color:#64748b;font-size:12px}
.page-labels-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.page-labels-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:12px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.page-labels-warning svg{flex:0 0 auto;margin-top:1px}
.page-labels-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.page-labels-stat{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.page-labels-stat strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em;color:#c2410c}.page-labels-stat span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}
.page-labels-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding:13px 14px;border:1px solid #e2e8f0;border-radius:13px;background:#f8fafc}.page-labels-toolbar strong{display:block;font-size:11px}.page-labels-toolbar span{display:block;margin-top:3px;color:#64748b;font-size:9px}.page-labels-toolbar-actions{display:flex;gap:7px}.page-labels-secondary,.page-labels-add{display:inline-flex;align-items:center;gap:6px;padding:9px 11px;border:1px solid #fed7aa;border-radius:8px;background:#fff;color:#c2410c;font-size:9px;font-weight:800;cursor:pointer;white-space:nowrap}.page-labels-add{background:#c2410c;border-color:#c2410c;color:#fff}.page-labels-add:disabled{opacity:.4;cursor:not-allowed}
.page-labels-editor{margin-top:12px;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}.page-labels-head,.page-labels-row{display:grid;grid-template-columns:105px 180px minmax(150px,1fr) 110px minmax(130px,.8fr) 38px;gap:9px;align-items:center}.page-labels-head{padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:8px;font-weight:750;letter-spacing:.07em;text-transform:uppercase}.page-labels-row{padding:11px 12px;border-bottom:1px solid #f1f5f9;background:#fff}.page-labels-row:last-child{border-bottom:0}.page-labels-input,.page-labels-select{width:100%;height:36px;padding:0 9px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#172033;font-size:10px;outline:none}.page-labels-input:focus,.page-labels-select:focus{border-color:#fb923c;box-shadow:0 0 0 3px rgba(251,146,60,.12)}.page-labels-input:disabled{background:#f8fafc;color:#94a3b8}.page-labels-range-preview{min-width:0}.page-labels-range-preview strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#c2410c;font:800 11px/1.2 var(--font-jakarta,system-ui)}.page-labels-range-preview span{display:block;margin-top:4px;color:#94a3b8;font-size:8px}.page-labels-delete{display:grid;place-items:center;width:34px;height:34px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#64748b;cursor:pointer}.page-labels-delete:hover:not(:disabled){border-color:#fecaca;color:#dc2626}.page-labels-delete:disabled{opacity:.3;cursor:not-allowed}
.page-labels-preview{margin-top:16px;padding:15px;border:1px solid #e2e8f0;border-radius:14px;background:#fff}.page-labels-preview-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.page-labels-preview-head strong{font-size:11px}.page-labels-preview-head span{color:#64748b;font-size:9px}.page-labels-chips{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin-top:11px}.page-labels-chip{min-width:0;padding:9px 6px;border:1px solid #e2e8f0;border-radius:9px;background:#f8fafc;text-align:center}.page-labels-chip span{display:block;color:#94a3b8;font-size:7px;font-weight:750;text-transform:uppercase;letter-spacing:.05em}.page-labels-chip strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:4px;color:#c2410c;font:800 10px/1.2 var(--font-jakarta,system-ui)}
.page-labels-signature-ack{display:flex;align-items:flex-start;gap:9px;margin-top:9px;font-weight:650;cursor:pointer}.page-labels-signature-ack input{width:16px;height:16px;margin-top:1px;accent-color:#ea580c}.page-labels-save{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;margin-top:16px;border:0;border-radius:11px;background:linear-gradient(135deg,#c2410c,#f97316);color:#fff;font:800 15px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(234,88,12,.22)}.page-labels-save:hover:not(:disabled){transform:translateY(-1px)}.page-labels-save:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.page-labels-success{display:flex;align-items:center;gap:9px;padding:12px 14px;margin-top:13px;border:1px solid #bbf7d0;border-radius:10px;background:#f0fdf4;color:#15803d;font-size:11px;font-weight:700}.page-labels-again{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;margin-top:14px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.page-labels-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.page-labels-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.page-labels-info svg{color:#ea580c}.page-labels-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.page-labels-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes page-labels-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:900px){.page-labels-head{display:none}.page-labels-row{grid-template-columns:1fr 1fr}.page-labels-range-preview{grid-column:1/-1}.page-labels-delete{justify-self:end}.page-labels-chips{grid-template-columns:repeat(5,1fr)}}
@media(max-width:700px){.page-labels-wrap{width:min(100% - 28px,1080px)}.page-labels-hero{padding:56px 0 36px}.page-labels-card{padding:18px;border-radius:17px}.page-labels-drop{padding:42px 14px}.page-labels-summary{grid-template-columns:1fr 1fr}.page-labels-toolbar{align-items:flex-start;flex-direction:column}.page-labels-toolbar-actions{width:100%;display:grid;grid-template-columns:1fr 1fr}.page-labels-secondary,.page-labels-add{justify-content:center}.page-labels-row{grid-template-columns:1fr}.page-labels-range-preview{grid-column:auto}.page-labels-delete{justify-self:start}.page-labels-chips{grid-template-columns:repeat(4,1fr)}.page-labels-info{grid-template-columns:1fr}.page-labels-main{padding-top:25px}}
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

function detectSignature(bytes: Uint8Array): boolean {
  const chunkSize = 8 * 1024 * 1024
  const decoder = new TextDecoder('latin1')
  const first = decoder.decode(bytes.subarray(0, Math.min(bytes.length, chunkSize)))
  const last = bytes.length > chunkSize ? decoder.decode(bytes.subarray(bytes.length - chunkSize)) : ''
  return /\/ByteRange\s*\[|\/FT\s*\/Sig\b|\/Type\s*\/Sig\b/.test(`${first}\n${last}`)
}

function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

export default function PDFPageLabelsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [rules, setRules] = useState<PageLabelRule[]>([])
  const [originalRangeCount, setOriginalRangeCount] = useState(0)
  const [restoreDefaults, setRestoreDefaults] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const [signed, setSigned] = useState(false)
  const [signatureAck, setSignatureAck] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const originalBytes = useRef<Uint8Array | null>(null)
  const nextId = useRef(1)

  const orderedRules = useMemo(() => [...rules].sort((left, right) => left.startPage - right.startPage || left.id - right.id), [rules])
  const uniqueStyleCount = useMemo(() => new Set(rules.map(rule => rule.style)).size, [rules])
  const previewPages = useMemo(() => {
    const pages = new Set<number>()
    for (let page = 1; page <= Math.min(pageCount, 24); page += 1) pages.add(page)
    orderedRules.forEach(rule => { pages.add(rule.startPage); if (rule.startPage > 1) pages.add(rule.startPage - 1) })
    if (pageCount) pages.add(pageCount)
    return Array.from(pages).filter(page => page >= 1 && page <= pageCount).sort((left, right) => left - right).slice(0, 40)
  }, [orderedRules, pageCount])

  const reset = useCallback(() => {
    setFile(null); setPageCount(0); setRules([]); setOriginalRangeCount(0); setRestoreDefaults(false); setWarnings([]); setSigned(false); setSignatureAck(false)
    setDragging(false); setProcessing(false); setSaving(false); setError(''); setSuccess(''); originalBytes.current = null; nextId.current = 1
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }
    setFile(candidate); setPageCount(0); setRules([]); setProcessing(true); setError(''); setSuccess(''); setSignatureAck(false)
    void trackEvent('pdf_page_labels_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(1024, bytes.length)))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const result = await parsePageLabels(bytes)
      if (!result.pageCount) throw new Error('This PDF does not contain any pages.')
      if (result.pageCount > MAX_PAGES) throw new Error(`This PDF has ${result.pageCount} pages. The page-label editor limit is ${MAX_PAGES} pages.`)
      originalBytes.current = bytes
      setPageCount(result.pageCount); setRules(result.rules); setOriginalRangeCount(result.hasCustomLabels ? result.rules.length : 0); setRestoreDefaults(!result.hasCustomLabels); setWarnings(result.warnings); setSigned(detectSignature(bytes))
      nextId.current = Math.max(0, ...result.rules.map(rule => rule.id)) + 1
      void trackEvent('pdf_page_labels_scan_completed', { file_size: sizeBucket(candidate.size), pages: result.pageCount, ranges: result.hasCustomLabels ? result.rules.length : 0 })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF page labels could not be read.'
      const protectedPdf = /encrypt|password/i.test(message)
      setError(protectedPdf ? 'This PDF is password-protected. Unlock it with the known password before editing page labels.' : message)
      originalBytes.current = null
      void trackEvent('pdf_page_labels_scan_failed', { file_size: sizeBucket(candidate.size), reason: protectedPdf ? 'password_protected' : 'processing_error' })
    } finally { setProcessing(false) }
  }, [])

  const updateRule = useCallback((id: number, patch: Partial<PageLabelRule>) => {
    setRules(current => current.map(rule => rule.id === id ? { ...rule, ...patch } : rule))
    setRestoreDefaults(false); setSuccess(''); setError('')
  }, [])

  const addRange = useCallback(() => {
    if (rules.length >= Math.min(pageCount, MAX_RANGES)) { setError(`This PDF can have at most ${Math.min(pageCount, MAX_RANGES)} editable label ranges.`); return }
    const used = new Set(rules.map(rule => rule.startPage))
    let startPage = 2
    while (startPage <= pageCount && used.has(startPage)) startPage += 1
    if (startPage > pageCount) { setError('Every PDF page already starts a label range.'); return }
    setRules(current => [...current, { id: nextId.current++, startPage, style: 'Decimal', prefix: '', startNumber: 1 }])
    setRestoreDefaults(false); setSuccess(''); setError('')
  }, [pageCount, rules])

  const removeRule = useCallback((id: number) => {
    if (rules.length <= 1) { setError('Keep at least one range, or choose Restore PDF defaults.'); return }
    setRules(current => current.filter(rule => rule.id !== id)); setRestoreDefaults(false); setSuccess(''); setError('')
  }, [rules.length])

  const useDefaults = useCallback(() => {
    setRules([{ id: nextId.current++, startPage: 1, style: 'Decimal', prefix: '', startNumber: 1 }])
    setRestoreDefaults(true); setSuccess(''); setError('')
  }, [])

  const validate = useCallback((): string => {
    if (!rules.length) return 'Add at least one page-label range.'
    if (rules.length > MAX_RANGES) return `Use no more than ${MAX_RANGES} label ranges.`
    if (orderedRules[0].startPage !== 1) return 'The first label range must begin on PDF page 1.'
    const seen = new Set<number>()
    for (const rule of orderedRules) {
      if (!Number.isInteger(rule.startPage) || rule.startPage < 1 || rule.startPage > pageCount) return `Choose a start page between 1 and ${pageCount}.`
      if (seen.has(rule.startPage)) return `Only one label range can begin on PDF page ${rule.startPage}.`
      seen.add(rule.startPage)
      if (rule.prefix.length > 32) return 'Keep each label prefix to 32 characters or fewer.'
      if (rule.style === 'Prefix only' && !rule.prefix) return `The prefix-only range beginning on page ${rule.startPage} needs a prefix.`
      if (rule.style !== 'Prefix only' && (!Number.isInteger(rule.startNumber) || rule.startNumber < 1 || rule.startNumber > 1_000_000)) return `Choose a starting number between 1 and 1,000,000 for page ${rule.startPage}.`
    }
    return ''
  }, [orderedRules, pageCount, rules.length])

  const savePdf = useCallback(async () => {
    if (!file || !originalBytes.current) return
    if (signed && !signatureAck) { setError('Confirm that you understand the existing digital signature will no longer validate.'); return }
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setSaving(true); setError(''); setSuccess('')
    void trackEvent('pdf_page_labels_save_started', { before: originalRangeCount, after: restoreDefaults ? 0 : rules.length, signed })
    try {
      const output = await writePageLabels(originalBytes.current, restoreDefaults ? [] : orderedRules)
      triggerDownload(output, `${safeBaseName(file.name)}_page_labels.pdf`)
      setSuccess(restoreDefaults ? 'Restored standard PDF page labels in a new file. The source was not changed.' : `Saved ${rules.length} page-label range${rules.length === 1 ? '' : 's'} in a new PDF. The source was not changed.`)
      void trackEvent('pdf_page_labels_save_completed', { before: originalRangeCount, after: restoreDefaults ? 0 : rules.length, signed })
    } catch {
      setError('The page-label number tree could not be written. Please reload and try again.')
      void trackEvent('pdf_page_labels_save_failed', { before: originalRangeCount, after: restoreDefaults ? 0 : rules.length })
    } finally { setSaving(false) }
  }, [file, orderedRules, originalRangeCount, restoreDefaults, rules.length, signatureAck, signed, validate])

  const seo = toolSeoData['pdf-page-labels']

  return <div className="page-labels-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <SiteNav />
    <section className="page-labels-hero"><div className="page-labels-wrap">
      <div className="page-labels-badge"><Tags size={12} /> Viewer navigation labels</div>
      <h1>PDF Page <span>Labels</span></h1>
      <p>Create Roman-numeral front matter, restart chapter numbering, add prefixes, or restore standard labels without changing printed page artwork.</p>
      <div className="page-labels-trust"><span><ShieldCheck size={13} /> Local browser processing</span><span><Check size={13} /> Page content stays untouched</span><span><Check size={13} /> Standards-based number tree</span></div>
    </div></section>

    <main className="page-labels-main"><div className="page-labels-wrap">
      <section className="page-labels-card">
        {error && <div className="page-labels-error" role="alert"><AlertTriangle size={16} /><span>{error}</span></div>}
        {!file && <label className={`page-labels-drop${dragging ? ' dragging' : ''}`} onDragEnter={event => { event.preventDefault(); setDragging(true) }} onDragOver={event => event.preventDefault()} onDragLeave={event => { event.preventDefault(); setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); const candidate = event.dataTransfer.files[0]; if (candidate) void handleFile(candidate) }}>
          <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} />
          <span className="page-labels-drop-icon"><UploadCloud size={27} /></span><h2>Drop a PDF here</h2><p>Choose one PDF up to 100 MB. Existing page-label ranges are loaded into the editor.</p><span className="page-labels-choose">Choose PDF <FileText size={15} /></span><div className="page-labels-private">Private and local</div>
        </label>}

        {file && <>
          <div className="page-labels-file"><span className="page-labels-file-icon"><Tags size={20} /></span><div className="page-labels-file-info"><div className="page-labels-file-name">{file.name}</div><div className="page-labels-file-size">{formatBytes(file.size)}</div></div><button className="page-labels-remove" type="button" aria-label="Remove PDF" onClick={reset}><X size={16} /></button></div>
          {processing ? <div className="page-labels-progress"><span className="page-labels-progress-icon"><ListOrdered size={27} /></span><h2>Reading page labels</h2><p>Loading the page-label number tree locally...</p></div> : originalBytes.current && <>
            <div className="page-labels-summary"><div className="page-labels-stat"><strong>{pageCount}</strong><span>PDF pages</span></div><div className="page-labels-stat"><strong>{restoreDefaults ? 0 : rules.length}</strong><span>Custom ranges</span></div><div className="page-labels-stat"><strong>{uniqueStyleCount}</strong><span>Numbering styles</span></div><div className="page-labels-stat"><strong>{restoreDefaults ? 'Default' : 'Custom'}</strong><span>Output mode</span></div></div>
            {warnings.map(warning => <div className="page-labels-warning" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}
            <div className="page-labels-toolbar"><div><strong>Edit navigation labels</strong><span>Ranges automatically continue until the next start page. These labels appear in compatible PDF viewers.</span></div><div className="page-labels-toolbar-actions"><button className="page-labels-secondary" type="button" onClick={useDefaults}><RotateCcw size={13} /> Restore PDF defaults</button><button className="page-labels-add" type="button" disabled={rules.length >= Math.min(pageCount, MAX_RANGES)} onClick={addRange}><Plus size={13} /> Add range</button></div></div>
            <div className="page-labels-editor"><div className="page-labels-head"><span>Start page</span><span>Style</span><span>Prefix</span><span>Starts at</span><span>Range preview</span><span></span></div>
              {orderedRules.map((rule, index) => {
                const endPage = orderedRules[index + 1] ? orderedRules[index + 1].startPage - 1 : pageCount
                return <div className="page-labels-row" key={rule.id}>
                  <input className="page-labels-input" type="number" min={1} max={pageCount} value={rule.startPage} aria-label={`Start page for label range ${index + 1}`} onChange={event => updateRule(rule.id, { startPage: Number(event.target.value) })} />
                  <select className="page-labels-select" value={rule.style} aria-label={`Style for label range ${index + 1}`} onChange={event => updateRule(rule.id, { style: event.target.value as PageLabelStyle })}>{STYLES.map(style => <option key={style} value={style}>{style}</option>)}</select>
                  <input className="page-labels-input" type="text" maxLength={32} value={rule.prefix} placeholder="Optional, e.g. A-" aria-label={`Prefix for label range ${index + 1}`} onChange={event => updateRule(rule.id, { prefix: event.target.value })} />
                  <input className="page-labels-input" type="number" min={1} max={1_000_000} disabled={rule.style === 'Prefix only'} value={rule.startNumber} aria-label={`Starting number for label range ${index + 1}`} onChange={event => updateRule(rule.id, { startNumber: Number(event.target.value) })} />
                  <div className="page-labels-range-preview"><strong>{labelForPage(orderedRules, rule.startPage) || '(blank)'}</strong><span>PDF pages {rule.startPage}-{Math.max(rule.startPage, endPage)}</span></div>
                  <button className="page-labels-delete" type="button" disabled={rules.length <= 1} aria-label={`Delete label range ${index + 1}`} onClick={() => removeRule(rule.id)}><Trash2 size={14} /></button>
                </div>
              })}
            </div>
            <div className="page-labels-preview"><div className="page-labels-preview-head"><strong>Live viewer-label preview</strong><span>PDF page number to navigation label</span></div><div className="page-labels-chips">{previewPages.map(page => <div className="page-labels-chip" key={page}><span>Page {page}</span><strong title={labelForPage(orderedRules, page) || '(blank)'}>{labelForPage(orderedRules, page) || '(blank)'}</strong></div>)}</div></div>
            {signed && <div className="page-labels-warning"><AlertTriangle size={15} /><div><strong>Digital signature detected</strong><div>Saving new page labels rewrites PDF bytes, so the existing cryptographic signature will no longer validate.</div><label className="page-labels-signature-ack"><input type="checkbox" checked={signatureAck} onChange={event => setSignatureAck(event.target.checked)} /> I understand the existing signature will be invalidated.</label></div></div>}
            <button className="page-labels-save" type="button" disabled={saving || (signed && !signatureAck)} onClick={() => void savePdf()}>{saving ? <><Save size={17} /> Writing page-label tree...</> : <><Download size={17} /> Download labeled PDF</>}</button>
            {success && <div className="page-labels-success"><FileCheck2 size={17} /><span>{success}</span></div>}
            <button className="page-labels-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
          </>}
        </>}
      </section>
      <section className="page-labels-info"><article><Hash size={20} /><h3>Labels are not printed numbers</h3><p>Page labels change viewer navigation, thumbnails, and page lookup. They do not paint text onto the page itself.</p></article><article><ListOrdered size={20} /><h3>Section-aware numbering</h3><p>Use Roman numerals for front matter, decimal numbers for chapters, letters for appendices, and prefixes for exhibits.</p></article><article><ShieldCheck size={20} /><h3>Source remains untouched</h3><p>The label tree is written into a new browser-generated PDF. Your original document is never modified or uploaded.</p></article></section>
    </div></main>
    {seo && <ToolSEOSection {...seo} />}
    <SiteFooter />
  </div>
}
