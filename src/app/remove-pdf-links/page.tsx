'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Link2,
  RotateCcw,
  ShieldCheck,
  Unlink2,
  UploadCloud,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'
import { inspectPDFLinks, removePDFLinks, type PDFLinkInspection, type PDFLinkKind } from '@/lib/pdfLinkExtractor'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 2_000

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.unlink-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.unlink-wrap{width:min(980px,calc(100% - 40px));margin:0 auto}
.unlink-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(225,29,72,.12),transparent 40%),linear-gradient(180deg,#fff5f7 0%,#fff 100%)}.unlink-hero::before,.unlink-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(225,29,72,.1);border-radius:999px}.unlink-hero::before{width:350px;height:350px;left:-220px;top:-220px}.unlink-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.unlink-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(225,29,72,.22);border-radius:999px;background:#fff;color:#be123c;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(225,29,72,.08)}.unlink-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.unlink-hero h1 span{color:#e11d48}.unlink-hero p{max-width:690px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.unlink-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.unlink-trust span{display:flex;align-items:center;gap:5px}
.unlink-main{padding:38px 0 72px}.unlink-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.unlink-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.unlink-drop:hover,.unlink-drop.dragging{border-color:#e11d48;background:#fff1f2;transform:translateY(-1px)}.unlink-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#be123c,#fb7185);color:#fff;box-shadow:0 12px 28px rgba(225,29,72,.24)}.unlink-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.unlink-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.unlink-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.unlink-private{margin-top:13px;color:#be123c;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.unlink-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #fecdd3;border-radius:13px;background:#fff1f2}.unlink-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#ffe4e6;color:#be123c;flex:0 0 auto}.unlink-file-info{min-width:0;flex:1}.unlink-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.unlink-file-size{margin-top:3px;color:#64748b;font-size:10px}.unlink-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #fecdd3;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.unlink-remove:hover{border-color:#e11d48;color:#e11d48}
.unlink-progress{padding:30px 4px 14px;text-align:center}.unlink-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#ffe4e6;color:#be123c;animation:unlink-pulse 1.5s ease-in-out infinite}.unlink-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.unlink-progress p{margin:0;color:#64748b;font-size:12px}
.unlink-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.unlink-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.unlink-stat{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.unlink-stat strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em;color:#be123c}.unlink-stat span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}.unlink-types{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.unlink-type{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;color:#475569;font-size:9px;font-weight:750}.unlink-type b{color:#be123c}
.unlink-notice{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:14px;border:1px solid #fed7aa;border-radius:10px;background:#fff7ed;color:#9a3412;font-size:10px;line-height:1.6}.unlink-notice svg{flex:0 0 auto;margin-top:1px}.unlink-signature{display:flex;align-items:flex-start;gap:9px;padding:13px 14px;margin-top:12px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.6}.unlink-signature svg{flex:0 0 auto;margin-top:1px}.unlink-ack{display:flex;align-items:flex-start;gap:8px;margin-top:8px;font-weight:700;cursor:pointer}.unlink-ack input{width:16px;height:16px;margin-top:1px;accent-color:#e11d48}
.unlink-submit{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;margin-top:16px;border:0;border-radius:11px;background:linear-gradient(135deg,#be123c,#e11d48);color:#fff;font:800 15px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(225,29,72,.22);transition:.16s}.unlink-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 16px 32px rgba(225,29,72,.28)}.unlink-submit:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.unlink-limit{display:flex;align-items:center;justify-content:center;gap:6px;margin:11px 0 0;color:#64748b;font-size:10px}
.unlink-empty{text-align:center;padding:25px 8px 8px}.unlink-empty-icon{display:grid;place-items:center;width:62px;height:62px;margin:0 auto 14px;border-radius:18px;background:#dcfce7;color:#15803d}.unlink-empty h2{margin:0 0 7px;font:800 21px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.unlink-empty p{max-width:560px;margin:0 auto;color:#64748b;font-size:11px;line-height:1.65}.unlink-again{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;margin-top:16px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.unlink-success{text-align:center;padding:26px 5px 8px}.unlink-success-icon{display:grid;place-items:center;width:66px;height:66px;margin:0 auto 17px;border-radius:20px;background:#dcfce7;color:#15803d}.unlink-success h2{margin:0 0 8px;font:800 23px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.04em}.unlink-success p{max-width:570px;margin:0 auto 12px;color:#64748b;font-size:13px;line-height:1.6}.unlink-result{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;margin:0 0 20px;border-radius:999px;background:#f0fdf4;color:#15803d;font-size:10px;font-weight:750}.unlink-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.unlink-download,.unlink-new{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:10px;font-size:11px;font-weight:750;text-decoration:none;cursor:pointer}.unlink-download{border:0;background:#172033;color:#fff}.unlink-new{border:1px solid #cbd5e1;background:#fff;color:#475569}
.unlink-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.unlink-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.unlink-info svg{color:#e11d48}.unlink-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.unlink-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}.unlink-footnote{margin:20px 0 0;padding:15px 17px;border-left:3px solid #e11d48;border-radius:0 10px 10px 0;background:#fff1f2;color:#881337;font-size:11px;line-height:1.65}
@keyframes unlink-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:720px){.unlink-wrap{width:min(100% - 28px,980px)}.unlink-hero{padding:56px 0 36px}.unlink-card{padding:18px;border-radius:17px}.unlink-drop{padding:42px 14px}.unlink-summary{grid-template-columns:1fr 1fr}.unlink-info{grid-template-columns:1fr}.unlink-main{padding-top:25px}}
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

export default function RemovePDFLinksPage() {
  const [file, setFile] = useState<File | null>(null)
  const [inspection, setInspection] = useState<PDFLinkInspection | null>(null)
  const [dragging, setDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [signed, setSigned] = useState(false)
  const [signatureAck, setSignatureAck] = useState(false)
  const [error, setError] = useState('')
  const [download, setDownload] = useState<{ url: string; name: string; removed: number; changedPages: number; pageCount: number } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (download?.url) URL.revokeObjectURL(download.url) }, [download])

  const typeCounts = useMemo(() => {
    const counts = new Map<PDFLinkKind, number>()
    inspection?.links.forEach(link => counts.set(link.kind, (counts.get(link.kind) ?? 0) + 1))
    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  }, [inspection])

  const reset = useCallback(() => {
    setFile(null); setInspection(null); setDragging(false); setAnalyzing(false); setProcessing(false)
    setSigned(false); setSignatureAck(false); setError(''); setDownload(null)
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }
    setFile(candidate); setInspection(null); setDownload(null); setSignatureAck(false); setAnalyzing(true); setError('')
    void trackEvent('remove_pdf_links_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(1024, bytes.length)))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const result = await inspectPDFLinks(bytes)
      if (!result.pageCount) throw new Error('This PDF does not contain any pages.')
      if (result.pageCount > MAX_PAGES) throw new Error(`This PDF has ${result.pageCount} pages. The link remover limit is ${MAX_PAGES} pages.`)
      setInspection(result); setSigned(detectSignature(bytes))
      void trackEvent('remove_pdf_links_scan_completed', { file_size: sizeBucket(candidate.size), pages: result.pageCount, links: result.links.length, scripts: result.scriptCount })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF link annotations could not be read.'
      const protectedPdf = /encrypt|password/i.test(message)
      setError(protectedPdf ? 'This PDF is password-protected. Unlock it with the known password before removing links.' : message)
      void trackEvent('remove_pdf_links_scan_failed', { file_size: sizeBucket(candidate.size), reason: protectedPdf ? 'password_protected' : 'processing_error' })
    } finally { setAnalyzing(false) }
  }, [])

  const removeLinks = useCallback(async () => {
    if (!file || !inspection?.links.length || processing || (signed && !signatureAck)) return
    setProcessing(true); setError('')
    void trackEvent('remove_pdf_links_started', { file_size: sizeBucket(file.size), pages: inspection.pageCount, links: inspection.links.length })
    try {
      const result = await removePDFLinks(new Uint8Array(await file.arrayBuffer()))
      if (result.removedLinks !== inspection.links.length || result.changedPages !== inspection.pagesWithLinks) {
        throw new Error('The removed-link count could not be verified. Your original PDF was not changed.')
      }
      const outputBuffer = result.bytes.buffer.slice(result.bytes.byteOffset, result.bytes.byteOffset + result.bytes.byteLength) as ArrayBuffer
      const url = URL.createObjectURL(new Blob([outputBuffer], { type: 'application/pdf' }))
      const name = `${safeBaseName(file.name)}_links_removed.pdf`
      setDownload({ url, name, removed: result.removedLinks, changedPages: result.changedPages, pageCount: result.pageCount })
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click()
      void trackEvent('remove_pdf_links_completed', { file_size: sizeBucket(file.size), pages: result.pageCount, links_removed: result.removedLinks })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The links could not be removed from this PDF.'
      setError(message)
      void trackEvent('remove_pdf_links_failed', { reason: /encrypt|password/i.test(message) ? 'password_protected' : 'processing_error' })
    } finally { setProcessing(false) }
  }, [file, inspection, processing, signatureAck, signed])

  const seo = toolSeoData['remove-pdf-links']
  const canRemove = Boolean(inspection?.links.length && !analyzing && !processing && (!signed || signatureAck))

  return <div className="unlink-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <SiteNav />
    <section className="unlink-hero"><div className="unlink-wrap">
      <div className="unlink-badge"><Unlink2 size={12} /> Link annotation cleanup</div>
      <h1>Remove PDF <span>Links</span></h1>
      <p>Disable clickable web, email, page, file, form, and script actions while keeping the visible document content and layout intact.</p>
      <div className="unlink-trust"><span><ShieldCheck size={13} /> Local browser processing</span><span><Check size={13} /> Verified link-free output</span><span><Check size={13} /> Original stays unchanged</span></div>
    </div></section>

    <main className="unlink-main"><div className="unlink-wrap">
      <section className="unlink-card" aria-label="Remove links from PDF">
        {download ? <div className="unlink-success" role="status"><span className="unlink-success-icon"><FileCheck2 size={32} /></span><h2>Your link-free PDF is ready</h2><p>{download.removed} clickable {download.removed === 1 ? 'link was' : 'links were'} removed from {download.changedPages} {download.changedPages === 1 ? 'page' : 'pages'}. All {download.pageCount} PDF pages were preserved.</p><div className="unlink-result"><BadgeCheck size={14} /> Verified: no page Link annotations remain</div><div className="unlink-actions"><a className="unlink-download" href={download.url} download={download.name}><Download size={17} /> Download again</a><button className="unlink-new" type="button" onClick={reset}><RotateCcw size={16} /> Remove links from another</button></div></div> : <>
          {error && <div className="unlink-error" role="alert"><AlertTriangle size={16} /><span>{error}</span></div>}
          {!file ? <label className={`unlink-drop${dragging ? ' dragging' : ''}`} onDragEnter={event => { event.preventDefault(); setDragging(true) }} onDragOver={event => event.preventDefault()} onDragLeave={event => { event.preventDefault(); setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); const candidate = event.dataTransfer.files[0]; if (candidate) void handleFile(candidate) }}><input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden disabled={analyzing} onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} /><span className="unlink-drop-icon"><UploadCloud size={27} /></span><h2>{analyzing ? 'Inspecting your PDF' : 'Drop a PDF here'}</h2><p>Choose one PDF up to 100 MB. The file is inspected and rewritten locally.</p><span className="unlink-choose">Choose PDF <FileText size={15} /></span><div className="unlink-private">Private, local, and no upload</div></label> : <>
            <div className="unlink-file"><span className="unlink-file-icon"><Link2 size={20} /></span><div className="unlink-file-info"><div className="unlink-file-name">{file.name}</div><div className="unlink-file-size">{formatBytes(file.size)}{inspection ? ` - ${inspection.pageCount} ${inspection.pageCount === 1 ? 'page' : 'pages'}` : ''}</div></div><button className="unlink-remove" type="button" aria-label="Remove PDF" onClick={reset}><X size={16} /></button></div>
            {analyzing ? <div className="unlink-progress"><span className="unlink-progress-icon"><Unlink2 size={27} /></span><h2>Inspecting clickable links</h2><p>Reading page annotations without opening any target...</p></div> : processing ? <div className="unlink-progress" role="status" aria-live="polite"><span className="unlink-progress-icon"><Unlink2 size={27} /></span><h2>Removing links locally</h2><p>Creating and verifying a new link-free PDF copy...</p></div> : inspection && (inspection.links.length ? <>
              <div className="unlink-summary"><div className="unlink-stat"><strong>{inspection.links.length}</strong><span>Links to remove</span></div><div className="unlink-stat"><strong>{inspection.pagesWithLinks}</strong><span>Pages affected</span></div><div className="unlink-stat"><strong>{inspection.externalCount}</strong><span>External targets</span></div><div className="unlink-stat"><strong>{inspection.internalCount}</strong><span>Internal jumps</span></div></div>
              <div className="unlink-types">{typeCounts.map(([type, count]) => <span className="unlink-type" key={type}><b>{count}</b> {type}</span>)}</div>
              <div className="unlink-notice"><Eye size={16} /><span><strong>Visible text and styling stay on the page.</strong> This removes the invisible clickable rectangles and their actions, not printed URL text, underlines, or artwork.</span></div>
              {inspection.scriptCount > 0 && <div className="unlink-notice"><ShieldCheck size={16} /><span>{inspection.scriptCount} JavaScript link {inspection.scriptCount === 1 ? 'action is' : 'actions are'} included in the removal. Script content is never returned or executed.</span></div>}
              {signed && <div className="unlink-signature"><AlertTriangle size={16} /><div><strong>This PDF appears digitally signed.</strong> Rewriting any PDF bytes invalidates existing cryptographic signatures.<label className="unlink-ack"><input type="checkbox" checked={signatureAck} onChange={event => setSignatureAck(event.target.checked)} /> I understand the new link-free copy will not retain valid signatures.</label></div></div>}
              <button className="unlink-submit" type="button" disabled={!canRemove} onClick={() => void removeLinks()}><Unlink2 size={18} /> Remove {inspection.links.length.toLocaleString()} clickable {inspection.links.length === 1 ? 'link' : 'links'}</button><p className="unlink-limit"><ShieldCheck size={13} /> Up to 100 MB and {MAX_PAGES.toLocaleString()} pages - processed in your browser</p>
            </> : <div className="unlink-empty"><span className="unlink-empty-icon"><Check size={28} /></span><h2>This PDF is already link-free</h2><p>No page Link annotations were found. Visible URL text may still be present, but it is not stored as a clickable PDF link.</p><button className="unlink-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button></div>)}
          </>}
        </>}
      </section>
      <section className="unlink-info"><article><Unlink2 size={20} /><h3>All page link types</h3><p>Removes web URLs, email and phone actions, page jumps, remote PDFs, file launches, form submissions, and script links.</p></article><article><Eye size={20} /><h3>Visible pages preserved</h3><p>Text, images, vector artwork, forms, bookmarks, comments, page order, and page labels remain in the new copy.</p></article><article><ShieldCheck size={20} /><h3>Verified before download</h3><p>The output is reopened locally and checked to confirm that no page Link annotations remain.</p></article></section>
      <p className="unlink-footnote"><strong>What this tool does not remove:</strong> plain URL text, QR codes, document-level open actions, embedded files, or links drawn into page artwork. Review the downloaded PDF before sharing it.</p>
    </div></main>
    {seo && <ToolSEOSection {...seo} />}
    <SiteFooter />
  </div>
}
