'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  FileJson,
  FileSpreadsheet,
  FileText,
  Highlighter,
  MapPin,
  MessageSquareText,
  Reply,
  RotateCcw,
  Search,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'
import { inspectPDFComments, type PDFCommentInspection, type PDFCommentKind, type PDFCommentRecord } from '@/lib/pdfCommentExtractor'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 2_000
const TABLE_LIMIT = 500

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.comments-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.comments-wrap{width:min(1120px,calc(100% - 40px));margin:0 auto}
.comments-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(124,58,237,.13),transparent 40%),linear-gradient(180deg,#faf7ff 0%,#fff 100%)}.comments-hero::before,.comments-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(124,58,237,.1);border-radius:999px}.comments-hero::before{width:350px;height:350px;left:-220px;top:-220px}.comments-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.comments-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(124,58,237,.22);border-radius:999px;background:#fff;color:#6d28d9;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(124,58,237,.08)}.comments-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.comments-hero h1 span{color:#7c3aed}.comments-hero p{max-width:720px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.comments-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.comments-trust span{display:flex;align-items:center;gap:5px}
.comments-main{padding:38px 0 72px}.comments-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.comments-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.comments-drop:hover,.comments-drop.dragging{border-color:#7c3aed;background:#faf5ff;transform:translateY(-1px)}.comments-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#6d28d9,#a78bfa);color:#fff;box-shadow:0 12px 28px rgba(124,58,237,.24)}.comments-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.comments-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.comments-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.comments-private{margin-top:13px;color:#6d28d9;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.comments-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #ddd6fe;border-radius:13px;background:#faf5ff}.comments-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#ede9fe;color:#6d28d9;flex:0 0 auto}.comments-file-info{min-width:0;flex:1}.comments-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.comments-file-size{margin-top:3px;color:#64748b;font-size:10px}.comments-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #ddd6fe;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.comments-remove:hover{border-color:#ef4444;color:#ef4444}
.comments-progress{padding:28px 4px 12px;text-align:center}.comments-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#ede9fe;color:#6d28d9;animation:comments-pulse 1.5s ease-in-out infinite}.comments-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.comments-progress p{margin:0;color:#64748b;font-size:12px}
.comments-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.comments-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:12px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.comments-warning svg{flex:0 0 auto;margin-top:1px}
.comments-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.comments-stat{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.comments-stat strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em;color:#6d28d9}.comments-stat span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}.comments-types{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.comments-type{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;color:#475569;font-size:9px;font-weight:750}.comments-type b{color:#6d28d9}
.comments-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding:13px 14px;border:1px solid #e2e8f0;border-radius:13px;background:#f8fafc}.comments-search{position:relative;min-width:260px;flex:1;max-width:440px}.comments-search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#94a3b8}.comments-search input{width:100%;height:38px;padding:0 11px 0 34px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#172033;font-size:10px;outline:none}.comments-search input:focus,.comments-filter:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.1)}.comments-actions{display:flex;gap:8px}.comments-filter{height:38px;padding:0 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:9px;font-weight:750;outline:none}.comments-download{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 13px;border:0;border-radius:9px;color:#fff;font-size:10px;font-weight:800;cursor:pointer}.comments-download.csv{background:#15803d}.comments-download.json{background:#6d28d9}
.comments-table-wrap{margin-top:14px;overflow:auto;border:1px solid #e2e8f0;border-radius:13px}.comments-table{width:100%;border-collapse:collapse;min-width:1050px}.comments-table th{position:sticky;top:0;padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:left;font-size:8px;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}.comments-table td{max-width:330px;padding:11px 12px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:10px;vertical-align:top}.comments-table tr:last-child td{border-bottom:0}.comments-page-cell{font-weight:800;color:#6d28d9}.comments-kind{display:inline-flex;padding:4px 7px;border-radius:999px;background:#f5f3ff;color:#6d28d9;font-size:8px;font-weight:800;white-space:nowrap}.comments-body{display:block;max-width:320px;line-height:1.45}.comments-body strong{display:block;margin-bottom:3px;font-size:9px}.comments-muted{color:#94a3b8;font-style:italic}.comments-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:8px;color:#64748b;white-space:nowrap}.comments-caption{padding:9px 12px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:9px}.comments-empty{text-align:center;padding:27px 10px}.comments-empty-icon{display:grid;place-items:center;width:62px;height:62px;margin:0 auto 14px;border-radius:18px;background:#f1f5f9;color:#64748b}.comments-empty h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.comments-empty p{max-width:560px;margin:0 auto;color:#64748b;font-size:11px;line-height:1.65}.comments-again{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;margin-top:15px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.comments-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.comments-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.comments-info svg{color:#7c3aed}.comments-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.comments-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes comments-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:840px){.comments-wrap{width:min(100% - 28px,1120px)}.comments-hero{padding:56px 0 36px}.comments-card{padding:18px;border-radius:17px}.comments-drop{padding:42px 14px}.comments-summary{grid-template-columns:1fr 1fr}.comments-toolbar{align-items:stretch;flex-direction:column}.comments-search{min-width:0;max-width:none}.comments-actions{display:grid;grid-template-columns:1fr 1fr 1fr}.comments-info{grid-template-columns:1fr}.comments-main{padding-top:25px}}
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

function csvCell(value: string | number | null): string {
  const raw = value === null ? '' : String(value)
  const protectedValue = /^\s*[=+\-@]/.test(raw) ? `'${raw}` : raw
  return `"${protectedValue.replace(/"/g, '""')}"`
}

function createCsv(comments: PDFCommentRecord[]): string {
  const headers = ['order', 'pdf_page', 'type', 'subtype', 'author', 'subject', 'comment', 'annotation_id', 'created_at', 'modified_at', 'reply_to', 'reply_type', 'intent', 'state', 'state_model', 'x', 'y', 'width', 'height', 'color', 'opacity']
  const rows = comments.map(comment => [
    comment.order, comment.pageNumber, comment.kind, comment.subtype, comment.author, comment.subject, comment.contents,
    comment.annotationId, comment.createdAt, comment.modifiedAt, comment.replyTo, comment.replyType, comment.intent,
    comment.state, comment.stateModel, comment.rectangle?.x ?? null, comment.rectangle?.y ?? null,
    comment.rectangle?.width ?? null, comment.rectangle?.height ?? null, comment.color.join(' '), comment.opacity,
  ].map(csvCell).join(','))
  return `\uFEFF${headers.map(csvCell).join(',')}\r\n${rows.join('\r\n')}\r\n`
}

function createJson(result: PDFCommentInspection): string {
  return JSON.stringify({
    schemaVersion: 1,
    pageCount: result.pageCount,
    summary: {
      commentCount: result.comments.length,
      pagesWithComments: result.pagesWithComments,
      authorCount: result.authorCount,
      replyCount: result.replyCount,
    },
    comments: result.comments,
  }, null, 2)
}

function downloadText(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

function rectangleText(comment: PDFCommentRecord): string {
  if (!comment.rectangle) return 'Not available'
  const { x, y, width, height } = comment.rectangle
  return `x ${x.toFixed(1)}, y ${y.toFixed(1)}, ${width.toFixed(1)} x ${height.toFixed(1)}`
}

export default function ExportPDFCommentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<PDFCommentInspection | null>(null)
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState<'All' | PDFCommentKind>('All')
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const typeCounts = useMemo(() => {
    const counts = new Map<PDFCommentKind, number>()
    result?.comments.forEach(comment => counts.set(comment.kind, (counts.get(comment.kind) ?? 0) + 1))
    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  }, [result])

  const filteredComments = useMemo(() => {
    if (!result) return []
    const needle = search.trim().toLowerCase()
    return result.comments.filter(comment => (kind === 'All' || comment.kind === kind) && (!needle || `${comment.contents} ${comment.subject} ${comment.author} ${comment.pageNumber} ${comment.kind} ${comment.subtype}`.toLowerCase().includes(needle)))
  }, [kind, result, search])

  const reset = useCallback(() => {
    setFile(null); setResult(null); setSearch(''); setKind('All'); setDragging(false); setProcessing(false); setError('')
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }
    setFile(candidate); setResult(null); setSearch(''); setKind('All'); setProcessing(true); setError('')
    void trackEvent('export_pdf_comments_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(1024, bytes.length)))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const inspection = await inspectPDFComments(bytes)
      if (!inspection.pageCount) throw new Error('This PDF does not contain any pages.')
      if (inspection.pageCount > MAX_PAGES) throw new Error(`This PDF has ${inspection.pageCount} pages. The comment exporter limit is ${MAX_PAGES} pages.`)
      setResult(inspection)
      void trackEvent('export_pdf_comments_scan_completed', { file_size: sizeBucket(candidate.size), pages: inspection.pageCount, comments: inspection.comments.length, authors: inspection.authorCount, replies: inspection.replyCount })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF comments could not be read.'
      const protectedPdf = /encrypt|password/i.test(message)
      setError(protectedPdf ? 'This PDF is password-protected. Unlock it with the known password before exporting comments.' : message)
      void trackEvent('export_pdf_comments_scan_failed', { file_size: sizeBucket(candidate.size), reason: protectedPdf ? 'password_protected' : 'processing_error' })
    } finally { setProcessing(false) }
  }, [])

  const exportCsv = useCallback(() => {
    if (!result || !file) return
    downloadText(createCsv(result.comments), `${safeBaseName(file.name)}_comments.csv`, 'text/csv;charset=utf-8')
    void trackEvent('export_pdf_comments_downloaded', { format: 'csv', comments: result.comments.length })
  }, [file, result])

  const exportJson = useCallback(() => {
    if (!result || !file) return
    downloadText(createJson(result), `${safeBaseName(file.name)}_comments.json`, 'application/json;charset=utf-8')
    void trackEvent('export_pdf_comments_downloaded', { format: 'json', comments: result.comments.length })
  }, [file, result])

  const seo = toolSeoData['export-pdf-comments']

  return <div className="comments-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <SiteNav />
    <section className="comments-hero"><div className="comments-wrap">
      <div className="comments-badge"><MessageSquareText size={12} /> Structured review export</div>
      <h1>Export PDF <span>Comments</span></h1>
      <p>Find notes, highlights, text boxes, stamps, drawings, shapes, replies, authors, and dates, then download a searchable CSV or structured JSON audit.</p>
      <div className="comments-trust"><span><ShieldCheck size={13} /> Local browser processing</span><span><Check size={13} /> PDF stays unchanged</span><span><Check size={13} /> Links and form fields excluded</span></div>
    </div></section>

    <main className="comments-main"><div className="comments-wrap">
      <section className="comments-card" aria-label="Export PDF comments">
        {error && <div className="comments-error" role="alert"><AlertTriangle size={16} /><span>{error}</span></div>}
        {!file && <label className={`comments-drop${dragging ? ' dragging' : ''}`} onDragEnter={event => { event.preventDefault(); setDragging(true) }} onDragOver={event => event.preventDefault()} onDragLeave={event => { event.preventDefault(); setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); const candidate = event.dataTransfer.files[0]; if (candidate) void handleFile(candidate) }}><input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} /><span className="comments-drop-icon"><UploadCloud size={27} /></span><h2>Drop a PDF here</h2><p>Choose one PDF up to 100 MB. Review annotations are inspected locally and the source remains read-only.</p><span className="comments-choose">Choose PDF <FileText size={15} /></span><div className="comments-private">Private, read-only, and local</div></label>}

        {file && <><div className="comments-file"><span className="comments-file-icon"><MessageSquareText size={20} /></span><div className="comments-file-info"><div className="comments-file-name">{file.name}</div><div className="comments-file-size">{formatBytes(file.size)}</div></div><button className="comments-remove" type="button" aria-label="Remove PDF" onClick={reset}><X size={16} /></button></div>
          {processing ? <div className="comments-progress"><span className="comments-progress-icon"><MessageSquareText size={27} /></span><h2>Reading comments and markup</h2><p>Resolving annotation details and reply relationships locally...</p></div> : result && <>
            <div className="comments-summary"><div className="comments-stat"><strong>{result.comments.length}</strong><span>Review annotations</span></div><div className="comments-stat"><strong>{result.pagesWithComments}</strong><span>Pages with comments</span></div><div className="comments-stat"><strong>{result.authorCount}</strong><span>Named authors</span></div><div className="comments-stat"><strong>{result.replyCount}</strong><span>Replies</span></div></div>
            {typeCounts.length > 0 && <div className="comments-types">{typeCounts.map(([type, count]) => <span className="comments-type" key={type}><b>{count}</b> {type}</span>)}</div>}
            {result.warnings.map(warning => <div className="comments-warning" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}
            {result.comments.length ? <><div className="comments-toolbar"><div className="comments-search"><Search size={14} /><input type="search" value={search} placeholder="Search comments, subjects, authors, types, or pages" aria-label="Search PDF comments" onChange={event => setSearch(event.target.value)} /></div><div className="comments-actions"><select className="comments-filter" value={kind} aria-label="Filter comment type" onChange={event => setKind(event.target.value as 'All' | PDFCommentKind)}><option value="All">All types</option>{typeCounts.map(([type]) => <option value={type} key={type}>{type}</option>)}</select><button className="comments-download csv" type="button" onClick={exportCsv}><FileSpreadsheet size={14} /> CSV</button><button className="comments-download json" type="button" onClick={exportJson}><FileJson size={14} /> JSON</button></div></div>
              <div className="comments-table-wrap"><table className="comments-table"><thead><tr><th>#</th><th>PDF page</th><th>Type</th><th>Comment or subject</th><th>Author</th><th>Date</th><th>Reply</th><th>Rectangle</th></tr></thead><tbody>{filteredComments.slice(0, TABLE_LIMIT).map(comment => <tr key={`${comment.pageNumber}-${comment.order}`}><td>{comment.order}</td><td className="comments-page-cell">{comment.pageNumber}</td><td><span className="comments-kind">{comment.kind}</span><div className="comments-muted" style={{marginTop:4,fontSize:8}}>{comment.subtype}</div></td><td><span className="comments-body">{comment.subject && <strong>{comment.subject}</strong>}{comment.contents || <span className="comments-muted">No text content</span>}</span></td><td>{comment.author || <span className="comments-muted">Unknown</span>}</td><td><span className="comments-mono">{comment.modifiedAt || comment.createdAt || '-'}</span></td><td>{comment.replyTo ? <span className="comments-page-cell">#{comment.replyTo}</span> : <span className="comments-muted">-</span>}</td><td><span className="comments-mono">{rectangleText(comment)}</span></td></tr>)}</tbody></table><div className="comments-caption">Showing {Math.min(filteredComments.length, TABLE_LIMIT).toLocaleString()} of {filteredComments.length.toLocaleString()} matching annotations. CSV and JSON always contain all {result.comments.length.toLocaleString()} records.</div></div>
            </> : <div className="comments-empty"><span className="comments-empty-icon"><MessageSquareText size={27} /></span><h2>No review comments or markup found</h2><p>Link annotations, form widgets, and popup containers are intentionally excluded. The PDF may have visible marks that were drawn directly into page content.</p></div>}
            <button className="comments-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
          </>}
        </>}
      </section>
      <section className="comments-info"><article><Highlighter size={20} /><h3>Broad markup coverage</h3><p>Captures notes, text boxes, highlights, underlines, strikeouts, stamps, ink, shapes, carets, attachments, redactions, and other review annotations.</p></article><article><Reply size={20} /><h3>Review context retained</h3><p>Exports authors, subjects, comment text, dates, states, annotation IDs, intents, and supported reply relationships.</p></article><article><MapPin size={20} /><h3>Page locations included</h3><p>Every record includes its physical PDF page and annotation rectangle for review, migration, accessibility, and remediation workflows.</p></article></section>
    </div></main>
    {seo && <ToolSEOSection {...seo} />}
    <SiteFooter />
  </div>
}
