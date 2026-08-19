'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ExternalLink,
  FileJson,
  FileSpreadsheet,
  FileText,
  Link2,
  MapPin,
  RotateCcw,
  ScanSearch,
  Search,
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
import { inspectPDFLinks, type PDFLinkInspection, type PDFLinkKind, type PDFLinkRecord } from '@/lib/pdfLinkExtractor'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 2_000
const TABLE_LIMIT = 500

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.links-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.links-wrap{width:min(1100px,calc(100% - 40px));margin:0 auto}
.links-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(13,148,136,.14),transparent 40%),linear-gradient(180deg,#f3fffd 0%,#fff 100%)}.links-hero::before,.links-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(13,148,136,.1);border-radius:999px}.links-hero::before{width:350px;height:350px;left:-220px;top:-220px}.links-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.links-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(13,148,136,.24);border-radius:999px;background:#fff;color:#0f766e;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(13,148,136,.08)}.links-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.links-hero h1 span{color:#0d9488}.links-hero p{max-width:700px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.links-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.links-trust span{display:flex;align-items:center;gap:5px}
.links-main{padding:38px 0 72px}.links-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.links-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.links-drop:hover,.links-drop.dragging{border-color:#0d9488;background:#f0fdfa;transform:translateY(-1px)}.links-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#0f766e,#2dd4bf);color:#fff;box-shadow:0 12px 28px rgba(13,148,136,.24)}.links-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.links-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.links-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.links-private{margin-top:13px;color:#0f766e;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.links-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #99f6e4;border-radius:13px;background:#f0fdfa}.links-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#ccfbf1;color:#0f766e;flex:0 0 auto}.links-file-info{min-width:0;flex:1}.links-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.links-file-size{margin-top:3px;color:#64748b;font-size:10px}.links-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #99f6e4;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.links-remove:hover{border-color:#ef4444;color:#ef4444}
.links-progress{padding:26px 4px 10px;text-align:center}.links-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#ccfbf1;color:#0f766e;animation:links-pulse 1.5s ease-in-out infinite}.links-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.links-progress p{margin:0;color:#64748b;font-size:12px}
.links-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.links-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:12px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.links-warning svg{flex:0 0 auto;margin-top:1px}
.links-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.links-stat{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.links-stat strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em;color:#0f766e}.links-stat span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}.links-types{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.links-type{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;color:#475569;font-size:9px;font-weight:750}.links-type b{color:#0f766e}
.links-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding:13px 14px;border:1px solid #e2e8f0;border-radius:13px;background:#f8fafc}.links-search{position:relative;min-width:260px;flex:1;max-width:430px}.links-search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#94a3b8}.links-search input{width:100%;height:38px;padding:0 11px 0 34px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#172033;font-size:10px;outline:none}.links-search input:focus,.links-filter:focus{border-color:#14b8a6;box-shadow:0 0 0 3px rgba(20,184,166,.1)}.links-actions{display:flex;gap:8px}.links-filter{height:38px;padding:0 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:9px;font-weight:750;outline:none}.links-download{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 13px;border:0;border-radius:9px;color:#fff;font-size:10px;font-weight:800;cursor:pointer}.links-download.csv{background:#15803d}.links-download.json{background:#0f766e}
.links-table-wrap{margin-top:14px;overflow:auto;border:1px solid #e2e8f0;border-radius:13px}.links-table{width:100%;border-collapse:collapse;min-width:960px}.links-table th{position:sticky;top:0;padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:left;font-size:8px;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}.links-table td{max-width:330px;padding:11px 12px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:10px;vertical-align:top}.links-table tr:last-child td{border-bottom:0}.links-page-cell{font-weight:800;color:#0f766e}.links-kind{display:inline-flex;padding:4px 7px;border-radius:999px;background:#f0fdfa;color:#0f766e;font-size:8px;font-weight:800;white-space:nowrap}.links-target{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:300px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;color:#334155}.links-destination{font-weight:700}.links-muted{color:#94a3b8;font-style:italic}.links-rect{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:8px;color:#64748b;white-space:nowrap}.links-caption{padding:9px 12px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:9px}.links-empty{text-align:center;padding:27px 10px}.links-empty-icon{display:grid;place-items:center;width:62px;height:62px;margin:0 auto 14px;border-radius:18px;background:#f1f5f9;color:#64748b}.links-empty h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.links-empty p{max-width:560px;margin:0 auto;color:#64748b;font-size:11px;line-height:1.65}.links-again{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;margin-top:15px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.links-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.links-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.links-info svg{color:#0d9488}.links-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.links-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes links-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:820px){.links-wrap{width:min(100% - 28px,1100px)}.links-hero{padding:56px 0 36px}.links-card{padding:18px;border-radius:17px}.links-drop{padding:42px 14px}.links-summary{grid-template-columns:1fr 1fr}.links-toolbar{align-items:stretch;flex-direction:column}.links-search{min-width:0;max-width:none}.links-actions{display:grid;grid-template-columns:1fr 1fr 1fr}.links-info{grid-template-columns:1fr}.links-main{padding-top:25px}}
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

function createCsv(links: PDFLinkRecord[]): string {
  const headers = ['order', 'pdf_page', 'type', 'target', 'destination_page', 'view', 'x', 'y', 'width', 'height', 'description']
  const rows = links.map(link => [
    link.order, link.pageNumber, link.kind, link.target, link.destinationPage, link.view,
    link.rectangle?.x ?? null, link.rectangle?.y ?? null, link.rectangle?.width ?? null, link.rectangle?.height ?? null,
    link.description,
  ].map(csvCell).join(','))
  return `\uFEFF${headers.map(csvCell).join(',')}\r\n${rows.join('\r\n')}\r\n`
}

function createJson(result: PDFLinkInspection): string {
  return JSON.stringify({
    schemaVersion: 1,
    pageCount: result.pageCount,
    summary: {
      linkCount: result.links.length,
      pagesWithLinks: result.pagesWithLinks,
      externalCount: result.externalCount,
      internalCount: result.internalCount,
      unresolvedCount: result.unresolvedCount,
      scriptCount: result.scriptCount,
    },
    links: result.links,
  }, null, 2)
}

function downloadText(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

function rectangleText(link: PDFLinkRecord): string {
  if (!link.rectangle) return 'Not available'
  const { x, y, width, height } = link.rectangle
  return `x ${x.toFixed(1)}, y ${y.toFixed(1)}, ${width.toFixed(1)} x ${height.toFixed(1)}`
}

export default function ExtractPDFLinksPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<PDFLinkInspection | null>(null)
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState<'All' | PDFLinkKind>('All')
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const typeCounts = useMemo(() => {
    const counts = new Map<PDFLinkKind, number>()
    result?.links.forEach(link => counts.set(link.kind, (counts.get(link.kind) ?? 0) + 1))
    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  }, [result])

  const filteredLinks = useMemo(() => {
    if (!result) return []
    const needle = search.trim().toLowerCase()
    return result.links.filter(link => (kind === 'All' || link.kind === kind) && (!needle || `${link.target} ${link.description} ${link.pageNumber} ${link.kind}`.toLowerCase().includes(needle)))
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
    void trackEvent('extract_pdf_links_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(1024, bytes.length)))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const inspection = await inspectPDFLinks(bytes)
      if (!inspection.pageCount) throw new Error('This PDF does not contain any pages.')
      if (inspection.pageCount > MAX_PAGES) throw new Error(`This PDF has ${inspection.pageCount} pages. The link extractor limit is ${MAX_PAGES} pages.`)
      setResult(inspection)
      void trackEvent('extract_pdf_links_scan_completed', { file_size: sizeBucket(candidate.size), pages: inspection.pageCount, links: inspection.links.length, internal: inspection.internalCount, external: inspection.externalCount, scripts: inspection.scriptCount })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF link annotations could not be read.'
      const protectedPdf = /encrypt|password/i.test(message)
      setError(protectedPdf ? 'This PDF is password-protected. Unlock it with the known password before extracting links.' : message)
      void trackEvent('extract_pdf_links_scan_failed', { file_size: sizeBucket(candidate.size), reason: protectedPdf ? 'password_protected' : 'processing_error' })
    } finally { setProcessing(false) }
  }, [])

  const exportCsv = useCallback(() => {
    if (!result || !file) return
    downloadText(createCsv(result.links), `${safeBaseName(file.name)}_links.csv`, 'text/csv;charset=utf-8')
    void trackEvent('extract_pdf_links_exported', { format: 'csv', links: result.links.length })
  }, [file, result])

  const exportJson = useCallback(() => {
    if (!result || !file) return
    downloadText(createJson(result), `${safeBaseName(file.name)}_links.json`, 'application/json;charset=utf-8')
    void trackEvent('extract_pdf_links_exported', { format: 'json', links: result.links.length })
  }, [file, result])

  const seo = toolSeoData['extract-pdf-links']

  return <div className="links-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <SiteNav />
    <section className="links-hero"><div className="links-wrap">
      <div className="links-badge"><ScanSearch size={12} /> Safe annotation audit</div>
      <h1>Extract PDF <span>Links</span></h1>
      <p>Find clickable web, email, page, file, and action targets inside a PDF, inspect their locations, and export a structured audit without opening any link.</p>
      <div className="links-trust"><span><ShieldCheck size={13} /> Local browser processing</span><span><Check size={13} /> Links are never opened</span><span><Check size={13} /> Source PDF stays unchanged</span></div>
    </div></section>

    <main className="links-main"><div className="links-wrap">
      <section className="links-card">
        {error && <div className="links-error" role="alert"><AlertTriangle size={16} /><span>{error}</span></div>}
        {!file && <label className={`links-drop${dragging ? ' dragging' : ''}`} onDragEnter={event => { event.preventDefault(); setDragging(true) }} onDragOver={event => event.preventDefault()} onDragLeave={event => { event.preventDefault(); setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); const candidate = event.dataTransfer.files[0]; if (candidate) void handleFile(candidate) }}>
          <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} />
          <span className="links-drop-icon"><UploadCloud size={27} /></span><h2>Drop a PDF here</h2><p>Choose one PDF up to 100 MB. Link annotations and destinations are inspected locally.</p><span className="links-choose">Choose PDF <FileText size={15} /></span><div className="links-private">Private, read-only, and local</div>
        </label>}

        {file && <>
          <div className="links-file"><span className="links-file-icon"><Link2 size={20} /></span><div className="links-file-info"><div className="links-file-name">{file.name}</div><div className="links-file-size">{formatBytes(file.size)}</div></div><button className="links-remove" type="button" aria-label="Remove PDF" onClick={reset}><X size={16} /></button></div>
          {processing ? <div className="links-progress"><span className="links-progress-icon"><ScanSearch size={27} /></span><h2>Inspecting link annotations</h2><p>Resolving local and named destinations without opening targets...</p></div> : result && <>
            <div className="links-summary"><div className="links-stat"><strong>{result.links.length}</strong><span>Clickable links</span></div><div className="links-stat"><strong>{result.pagesWithLinks}</strong><span>Pages with links</span></div><div className="links-stat"><strong>{result.externalCount}</strong><span>External targets</span></div><div className="links-stat"><strong>{result.internalCount}</strong><span>Internal pages</span></div></div>
            {typeCounts.length > 0 && <div className="links-types">{typeCounts.map(([type, count]) => <span className="links-type" key={type}><b>{count}</b> {type}</span>)}</div>}
            {result.warnings.map(warning => <div className="links-warning" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}
            {result.links.length > 0 ? <>
              <div className="links-toolbar"><div className="links-search"><Search size={14} /><input type="search" value={search} placeholder="Search targets, descriptions, types, or pages" aria-label="Search extracted links" onChange={event => setSearch(event.target.value)} /></div><div className="links-actions"><select className="links-filter" value={kind} aria-label="Filter link type" onChange={event => setKind(event.target.value as 'All' | PDFLinkKind)}><option value="All">All types</option>{typeCounts.map(([type]) => <option value={type} key={type}>{type}</option>)}</select><button className="links-download csv" type="button" onClick={exportCsv}><FileSpreadsheet size={14} /> CSV</button><button className="links-download json" type="button" onClick={exportJson}><FileJson size={14} /> JSON</button></div></div>
              <div className="links-table-wrap"><table className="links-table"><thead><tr><th>#</th><th>PDF page</th><th>Type</th><th>Target</th><th>Destination</th><th>Rectangle</th><th>Description</th></tr></thead><tbody>{filteredLinks.slice(0, TABLE_LIMIT).map(link => <tr key={`${link.pageNumber}-${link.order}`}><td>{link.order}</td><td className="links-page-cell">{link.pageNumber}</td><td><span className="links-kind">{link.kind}</span></td><td><span className="links-target" title={link.target}>{link.target}</span></td><td className="links-destination">{link.destinationPage ? `Page ${link.destinationPage}${link.view ? ` (${link.view})` : ''}` : <span className="links-muted">-</span>}</td><td><span className="links-rect">{rectangleText(link)}</span></td><td>{link.description || <span className="links-muted">None</span>}</td></tr>)}</tbody></table><div className="links-caption">Showing {Math.min(filteredLinks.length, TABLE_LIMIT).toLocaleString()} of {filteredLinks.length.toLocaleString()} matching links. CSV and JSON always contain all {result.links.length.toLocaleString()} extracted links.</div></div>
            </> : <div className="links-empty"><span className="links-empty-icon"><Link2 size={27} /></span><h2>No clickable link annotations found</h2><p>The PDF may contain visible URL text that is not interactive. This tool reports actual PDF link annotations and actions only.</p></div>}
            <button className="links-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
          </>}
        </>}
      </section>
      <section className="links-info"><article><ShieldCheck size={20} /><h3>Targets are never opened</h3><p>URLs, remote files, actions, and named destinations are decoded as text only. Embedded JavaScript is flagged but its code is not returned or executed.</p></article><article><MapPin size={20} /><h3>Page and rectangle locations</h3><p>Each record includes its PDF page and clickable rectangle coordinates, making document QA and remediation easier.</p></article><article><ExternalLink size={20} /><h3>Structured exports</h3><p>CSV is convenient for audits and spreadsheets. JSON preserves typed targets, destination pages, rectangles, and descriptions.</p></article></section>
    </div></main>
    <ToolQuickFacts
      definition="A PDF link extractor reads interactive Link annotations stored on document pages — links that open websites or email addresses, jump to another page, reference another PDF, or submit a form. Visible URL text without an actual annotation is not clickable and is therefore not reported."
      price="Free — no account needed"
      account="Not required"
      processing="Entirely in your browser — file never uploaded"
      formats="PDF in, CSV/JSON out"
      fileLimit="Up to 100 MB and 2,000 pages"
      browserSupport="Chrome, Firefox, Safari, Edge"
    />
    {seo && <ToolSEOSection {...seo} />}
    <SiteFooter />
  </div>
}
