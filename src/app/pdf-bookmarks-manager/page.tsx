'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bookmark,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  FolderTree,
  Link2,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import ToolQuickFacts from '@/components/ToolQuickFacts'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'
import {
  flattenManagedBookmarks,
  maxTreeDepth,
  parseManagedBookmarks,
  writeManagedBookmarks,
  type ManagedBookmark,
} from '@/lib/pdfBookmarkManager'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 2_000
const MAX_BOOKMARKS = 5_000

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.bm-manager-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.bm-manager-wrap{width:min(1100px,calc(100% - 40px));margin:0 auto}
.bm-manager-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(79,70,229,.14),transparent 40%),linear-gradient(180deg,#f7f7ff 0%,#fff 100%)}.bm-manager-hero::before,.bm-manager-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(79,70,229,.1);border-radius:999px}.bm-manager-hero::before{width:350px;height:350px;left:-220px;top:-220px}.bm-manager-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.bm-manager-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(79,70,229,.22);border-radius:999px;background:#fff;color:#4338ca;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(79,70,229,.08)}.bm-manager-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.bm-manager-hero h1 span{color:#4f46e5}.bm-manager-hero p{max-width:690px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.bm-manager-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.bm-manager-trust span{display:flex;align-items:center;gap:5px}
.bm-manager-main{padding:38px 0 72px}.bm-manager-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.bm-manager-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.bm-manager-drop:hover,.bm-manager-drop.dragging{border-color:#4f46e5;background:#eef2ff;transform:translateY(-1px)}.bm-manager-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#4338ca,#818cf8);color:#fff;box-shadow:0 12px 28px rgba(79,70,229,.24)}.bm-manager-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.bm-manager-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.bm-manager-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.bm-manager-private{margin-top:13px;color:#4338ca;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.bm-manager-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #c7d2fe;border-radius:13px;background:#eef2ff}.bm-manager-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#e0e7ff;color:#4338ca;flex:0 0 auto}.bm-manager-file-info{min-width:0;flex:1}.bm-manager-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.bm-manager-file-size{margin-top:3px;color:#64748b;font-size:10px}.bm-manager-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #c7d2fe;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.bm-manager-remove:hover{border-color:#ef4444;color:#ef4444}
.bm-manager-progress{padding:26px 4px 10px;text-align:center}.bm-manager-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#e0e7ff;color:#4338ca;animation:bm-manager-pulse 1.5s ease-in-out infinite}.bm-manager-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.bm-manager-progress p{margin:0;color:#64748b;font-size:12px}
.bm-manager-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}.bm-manager-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:12px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.bm-manager-warning svg{flex:0 0 auto;margin-top:1px}
.bm-manager-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.bm-manager-stat{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.bm-manager-stat strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em;color:#4338ca}.bm-manager-stat span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}
.bm-manager-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding:13px 14px;border:1px solid #e2e8f0;border-radius:13px;background:#f8fafc}.bm-manager-toolbar strong{display:block;font-size:11px}.bm-manager-toolbar span{display:block;margin-top:3px;color:#64748b;font-size:9px}.bm-manager-add-root{display:inline-flex;align-items:center;gap:7px;padding:10px 13px;border:0;border-radius:9px;background:#fff;color:#4338ca;border:1px solid #c7d2fe;font-size:10px;font-weight:800;cursor:pointer;white-space:nowrap}
.bm-manager-tree{margin-top:12px;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}.bm-manager-tree-head,.bm-manager-row{display:grid;grid-template-columns:minmax(260px,1.6fr) minmax(200px,1fr) 190px;gap:10px;align-items:center}.bm-manager-tree-head{padding:10px 13px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:8px;font-weight:750;letter-spacing:.07em;text-transform:uppercase}.bm-manager-row{padding:10px 12px;border-bottom:1px solid #f1f5f9;background:#fff}.bm-manager-row:last-child{border-bottom:0}.bm-manager-title-cell{display:flex;align-items:center;min-width:0}.bm-manager-toggle{display:grid;place-items:center;width:27px;height:27px;border:0;border-radius:7px;background:transparent;color:#64748b;cursor:pointer;flex:0 0 auto}.bm-manager-toggle:disabled{opacity:.25;cursor:default}.bm-manager-title-input{min-width:0;width:100%;height:36px;padding:0 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#172033;font-size:10px;font-weight:700;outline:none}.bm-manager-title-input:focus,.bm-manager-page-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.bm-manager-destination{min-width:0;display:flex;align-items:center;gap:8px}.bm-manager-page-label{display:flex;align-items:center;gap:6px;color:#475569;font-size:9px;font-weight:700}.bm-manager-page-input{width:68px;height:34px;padding:0 8px;border:1px solid #cbd5e1;border-radius:8px;outline:none;font-size:10px}.bm-manager-page-total{color:#94a3b8;font-size:8px}.bm-manager-dest-chip{min-width:0;display:inline-flex;align-items:center;gap:5px;padding:6px 8px;border-radius:8px;background:#eef2ff;color:#4338ca;font-size:8px;font-weight:800}.bm-manager-dest-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px}.bm-manager-retarget{padding:7px 8px;border:1px solid #c7d2fe;border-radius:7px;background:#fff;color:#4338ca;font-size:8px;font-weight:800;cursor:pointer;white-space:nowrap}
.bm-manager-row-actions{display:flex;justify-content:flex-end;gap:5px}.bm-manager-icon-btn{display:grid;place-items:center;width:32px;height:32px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#64748b;cursor:pointer}.bm-manager-icon-btn:hover:not(:disabled){border-color:#a5b4fc;color:#4338ca}.bm-manager-icon-btn.delete:hover{border-color:#fecaca;color:#dc2626}.bm-manager-icon-btn:disabled{opacity:.28;cursor:not-allowed}.bm-manager-tree-empty{padding:30px 15px;text-align:center;color:#64748b}.bm-manager-tree-empty strong{display:block;color:#172033;font-size:13px}.bm-manager-tree-empty span{display:block;margin-top:5px;font-size:10px}
.bm-manager-signature-ack{display:flex;align-items:flex-start;gap:9px;margin-top:9px;font-weight:650;cursor:pointer}.bm-manager-signature-ack input{width:16px;height:16px;margin-top:1px;accent-color:#4f46e5}.bm-manager-save{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;margin-top:16px;border:0;border-radius:11px;background:linear-gradient(135deg,#4338ca,#6366f1);color:#fff;font:800 15px/1 var(--font-jakarta,system-ui);cursor:pointer;box-shadow:0 12px 25px rgba(79,70,229,.22)}.bm-manager-save:hover:not(:disabled){transform:translateY(-1px)}.bm-manager-save:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.bm-manager-success{display:flex;align-items:center;gap:9px;padding:12px 14px;margin-top:13px;border:1px solid #bbf7d0;border-radius:10px;background:#f0fdf4;color:#15803d;font-size:11px;font-weight:700}.bm-manager-again{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;margin-top:14px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.bm-manager-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.bm-manager-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.bm-manager-info svg{color:#4f46e5}.bm-manager-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.bm-manager-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes bm-manager-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:820px){.bm-manager-wrap{width:min(100% - 28px,1100px)}.bm-manager-hero{padding:56px 0 36px}.bm-manager-card{padding:18px;border-radius:17px}.bm-manager-drop{padding:42px 14px}.bm-manager-summary{grid-template-columns:1fr 1fr}.bm-manager-tree-head{display:none}.bm-manager-row{grid-template-columns:1fr;gap:8px;padding:12px}.bm-manager-row-actions{justify-content:flex-start}.bm-manager-toolbar{align-items:flex-start;flex-direction:column}.bm-manager-info{grid-template-columns:1fr}.bm-manager-main{padding-top:25px}}
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

function updateNode(nodes: ManagedBookmark[], id: number, updater: (node: ManagedBookmark) => ManagedBookmark): ManagedBookmark[] {
  return nodes.map(node => node.id === id ? updater(node) : { ...node, children: updateNode(node.children, id, updater) })
}

function removeNode(nodes: ManagedBookmark[], id: number): ManagedBookmark[] {
  return nodes.filter(node => node.id !== id).map(node => ({ ...node, children: removeNode(node.children, id) }))
}

function moveNode(nodes: ManagedBookmark[], id: number, direction: -1 | 1): ManagedBookmark[] {
  const index = nodes.findIndex(node => node.id === id)
  if (index >= 0) {
    const target = index + direction
    if (target < 0 || target >= nodes.length) return nodes
    const copy = [...nodes]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    return copy
  }
  return nodes.map(node => ({ ...node, children: moveNode(node.children, id, direction) }))
}

function siblingPosition(nodes: ManagedBookmark[], id: number): { index: number; count: number } | null {
  const index = nodes.findIndex(node => node.id === id)
  if (index >= 0) return { index, count: nodes.length }
  for (const node of nodes) {
    const found = siblingPosition(node.children, id)
    if (found) return found
  }
  return null
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

function destinationDescription(bookmark: ManagedBookmark): string {
  if (bookmark.kind === 'Web link') return bookmark.target
  if (bookmark.kind === 'External PDF') return [bookmark.externalFile, bookmark.externalDestination].filter(Boolean).join(' # ')
  if (bookmark.kind === 'Named action') return bookmark.target
  if (bookmark.kind === 'Unresolved') return bookmark.target || 'Broken target'
  return bookmark.kind
}

export default function PDFBookmarksManagerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [bookmarks, setBookmarks] = useState<ManagedBookmark[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [originalCount, setOriginalCount] = useState(0)
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

  const flat = useMemo(() => flattenManagedBookmarks(bookmarks), [bookmarks])
  const externalCount = useMemo(() => flat.filter(bookmark => bookmark.kind === 'Web link' || bookmark.kind === 'External PDF' || bookmark.kind === 'Named action').length, [flat])
  const unresolvedCount = useMemo(() => flat.filter(bookmark => bookmark.kind === 'Unresolved').length, [flat])

  const reset = useCallback(() => {
    setFile(null); setBookmarks([]); setPageCount(0); setOriginalCount(0); setWarnings([]); setSigned(false); setSignatureAck(false)
    setDragging(false); setProcessing(false); setSaving(false); setError(''); setSuccess(''); originalBytes.current = null; nextId.current = 1
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }
    setFile(candidate); setBookmarks([]); setProcessing(true); setError(''); setSuccess(''); setSignatureAck(false)
    void trackEvent('pdf_bookmarks_manager_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(1024, bytes.length)))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const result = await parseManagedBookmarks(bytes)
      if (result.pageCount > MAX_PAGES) throw new Error(`This PDF has ${result.pageCount} pages. The bookmark manager limit is ${MAX_PAGES} pages.`)
      originalBytes.current = bytes
      setBookmarks(result.bookmarks); setPageCount(result.pageCount); setOriginalCount(result.bookmarkCount); setWarnings(result.warnings.filter(warning => !/^\d+ bookmark targets? could not be resolved\./.test(warning))); setSigned(detectSignature(bytes))
      nextId.current = result.bookmarks.length ? Math.max(...flattenManagedBookmarks(result.bookmarks).map(bookmark => bookmark.id)) + 1 : 1
      void trackEvent('pdf_bookmarks_manager_scan_completed', { file_size: sizeBucket(candidate.size), pages: result.pageCount, bookmarks: result.bookmarkCount, depth: result.maxDepth, external: result.externalCount, unresolved: result.unresolvedCount })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The PDF bookmark tree could not be read.'
      const protectedPdf = /encrypt|password/i.test(message)
      setError(protectedPdf ? 'This PDF is password-protected. Unlock it with the known password before managing bookmarks.' : message)
      originalBytes.current = null
      void trackEvent('pdf_bookmarks_manager_scan_failed', { file_size: sizeBucket(candidate.size), reason: protectedPdf ? 'password_protected' : 'processing_error' })
    } finally { setProcessing(false) }
  }, [])

  const apply = useCallback((next: ManagedBookmark[]) => { setBookmarks(next); setSuccess(''); setError('') }, [])
  const makeBookmark = useCallback((pageNumber = 1): ManagedBookmark => ({ id: nextId.current++, title: 'New bookmark', pageNumber, kind: 'Page', target: '', externalFile: '', externalDestination: '', open: true, children: [] }), [])

  const addRoot = useCallback(() => {
    if (flat.length >= MAX_BOOKMARKS) { setError(`The manager supports up to ${MAX_BOOKMARKS.toLocaleString()} bookmarks.`); return }
    apply([...bookmarks, makeBookmark(1)])
  }, [apply, bookmarks, flat.length, makeBookmark])

  const addChild = useCallback((parent: ManagedBookmark) => {
    if (flat.length >= MAX_BOOKMARKS) { setError(`The manager supports up to ${MAX_BOOKMARKS.toLocaleString()} bookmarks.`); return }
    apply(updateNode(bookmarks, parent.id, node => ({ ...node, open: true, children: [...node.children, makeBookmark(node.pageNumber ?? 1)] })))
  }, [apply, bookmarks, flat.length, makeBookmark])

  const savePdf = useCallback(async () => {
    if (!file || !originalBytes.current) return
    if (signed && !signatureAck) { setError('Confirm that you understand the existing digital signature will no longer validate.'); return }
    const invalidPage = flat.find(bookmark => bookmark.kind === 'Page' && (!bookmark.pageNumber || bookmark.pageNumber < 1 || bookmark.pageNumber > pageCount))
    if (invalidPage) { setError(`“${invalidPage.title}” needs a page between 1 and ${pageCount}.`); return }
    setSaving(true); setError(''); setSuccess('')
    void trackEvent('pdf_bookmarks_manager_save_started', { bookmarks: flat.length, signed })
    try {
      const output = await writeManagedBookmarks(originalBytes.current, bookmarks)
      triggerDownload(output, `${safeBaseName(file.name)}_bookmarked.pdf`)
      setSuccess(`Saved ${flat.length} bookmark${flat.length === 1 ? '' : 's'} in a new PDF. The source file was not changed.`)
      void trackEvent('pdf_bookmarks_manager_save_completed', { before: originalCount, after: flat.length, signed })
    } catch {
      setError('The edited outline could not be written. Please reload and try again.')
      void trackEvent('pdf_bookmarks_manager_save_failed', { before: originalCount, after: flat.length })
    } finally { setSaving(false) }
  }, [bookmarks, file, flat, originalCount, pageCount, signatureAck, signed])

  const renderRows = (nodes: ManagedBookmark[], depth = 0): React.ReactNode => nodes.map(node => {
    const position = siblingPosition(bookmarks, node.id) ?? { index: 0, count: 1 }
    return <div key={node.id}>
      <div className="bm-manager-row">
        <div className="bm-manager-title-cell" style={{ paddingLeft: Math.min(depth, 12) * 15 }}>
          <button className="bm-manager-toggle" type="button" disabled={!node.children.length} aria-label={`${node.open ? 'Close' : 'Open'} ${node.title}`} onClick={() => apply(updateNode(bookmarks, node.id, item => ({ ...item, open: !item.open })))}>{node.open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
          <input className="bm-manager-title-input" value={node.title} maxLength={500} aria-label={`Bookmark title ${node.id}`} onChange={event => apply(updateNode(bookmarks, node.id, item => ({ ...item, title: event.target.value })))} />
        </div>
        <div className="bm-manager-destination">
          {node.kind === 'Page' ? <label className="bm-manager-page-label">Page <input className="bm-manager-page-input" type="number" min={1} max={pageCount} value={node.pageNumber ?? ''} aria-label={`Page for ${node.title}`} onChange={event => {
            const value = Number(event.target.value)
            apply(updateNode(bookmarks, node.id, item => ({ ...item, pageNumber: Number.isFinite(value) ? value : null })))
          }} /><span className="bm-manager-page-total">of {pageCount}</span></label> : <>
            <span className="bm-manager-dest-chip"><ExternalLink size={11} /><span title={destinationDescription(node)}>{node.kind}: {destinationDescription(node)}</span></span>
            <button className="bm-manager-retarget" type="button" onClick={() => apply(updateNode(bookmarks, node.id, item => ({ ...item, kind: 'Page', pageNumber: 1, target: '', externalFile: '', externalDestination: '' })))}>Set page</button>
          </>}
        </div>
        <div className="bm-manager-row-actions">
          <button className="bm-manager-icon-btn" type="button" disabled={position.index === 0} aria-label={`Move ${node.title} up`} title="Move up" onClick={() => apply(moveNode(bookmarks, node.id, -1))}><ArrowUp size={14} /></button>
          <button className="bm-manager-icon-btn" type="button" disabled={position.index + 1 >= position.count} aria-label={`Move ${node.title} down`} title="Move down" onClick={() => apply(moveNode(bookmarks, node.id, 1))}><ArrowDown size={14} /></button>
          <button className="bm-manager-icon-btn" type="button" aria-label={`Add child to ${node.title}`} title="Add child" onClick={() => addChild(node)}><CornerDownRight size={14} /></button>
          <button className="bm-manager-icon-btn delete" type="button" aria-label={`Delete ${node.title}`} title="Delete bookmark and children" onClick={() => apply(removeNode(bookmarks, node.id))}><Trash2 size={14} /></button>
        </div>
      </div>
      {node.children.length > 0 && renderRows(node.children, depth + 1)}
    </div>
  })

  const seo = toolSeoData['pdf-bookmarks-manager']

  return <div className="bm-manager-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <SiteNav />
    <section className="bm-manager-hero"><div className="bm-manager-wrap">
      <div className="bm-manager-badge"><BookOpenCheck size={12} /> Interactive outline editor</div>
      <h1>PDF Bookmarks <span>Manager</span></h1>
      <p>Add, rename, nest, reorder, retarget, open, close, or delete bookmarks, then download a newly linked PDF outline.</p>
      <div className="bm-manager-trust"><span><ShieldCheck size={13} /> Local browser processing</span><span><Check size={13} /> Source PDF stays unchanged</span><span><Check size={13} /> Supported external actions preserved</span></div>
    </div></section>

    <main className="bm-manager-main"><div className="bm-manager-wrap">
      <section className="bm-manager-card">
        {error && <div className="bm-manager-error" role="alert"><AlertTriangle size={16} /><span>{error}</span></div>}
        {!file && <label className={`bm-manager-drop${dragging ? ' dragging' : ''}`} onDragEnter={event => { event.preventDefault(); setDragging(true) }} onDragOver={event => event.preventDefault()} onDragLeave={event => { event.preventDefault(); setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); const candidate = event.dataTransfer.files[0]; if (candidate) void handleFile(candidate) }}>
          <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} />
          <span className="bm-manager-drop-icon"><UploadCloud size={27} /></span><h2>Drop a PDF here</h2><p>Choose one PDF up to 100 MB. Existing bookmarks are loaded into an editable tree.</p><span className="bm-manager-choose">Choose PDF <FileText size={15} /></span><div className="bm-manager-private">Private and local</div>
        </label>}

        {file && <>
          <div className="bm-manager-file"><span className="bm-manager-file-icon"><Bookmark size={20} /></span><div className="bm-manager-file-info"><div className="bm-manager-file-name">{file.name}</div><div className="bm-manager-file-size">{formatBytes(file.size)}</div></div><button className="bm-manager-remove" type="button" aria-label="Remove PDF" onClick={reset}><X size={16} /></button></div>
          {processing ? <div className="bm-manager-progress"><span className="bm-manager-progress-icon"><FolderTree size={27} /></span><h2>Loading outline tree</h2><p>Resolving bookmark hierarchy and supported destinations locally…</p></div> : originalBytes.current && <>
            <div className="bm-manager-summary"><div className="bm-manager-stat"><strong>{flat.length}</strong><span>Bookmarks now</span></div><div className="bm-manager-stat"><strong>{pageCount}</strong><span>PDF pages</span></div><div className="bm-manager-stat"><strong>{maxTreeDepth(bookmarks)}</strong><span>Tree levels</span></div><div className="bm-manager-stat"><strong>{externalCount}</strong><span>External actions</span></div></div>
            {unresolvedCount > 0 && <div className="bm-manager-warning"><AlertTriangle size={15} /><span>{unresolvedCount} bookmark target{unresolvedCount === 1 ? '' : 's'} could not be resolved. {unresolvedCount === 1 ? 'It will' : 'They will'} remain as titled entries without an active destination unless retargeted to a page.</span></div>}
            {warnings.map(warning => <div className="bm-manager-warning" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}
            <div className="bm-manager-toolbar"><div><strong>Edit the document outline</strong><span>Arrow buttons move within the same parent. Adding a child creates a page bookmark nested below that entry.</span></div><button className="bm-manager-add-root" type="button" onClick={addRoot}><Plus size={14} /> Add root bookmark</button></div>
            <div className="bm-manager-tree"><div className="bm-manager-tree-head"><span>Title and hierarchy</span><span>Destination</span><span>Actions</span></div>{bookmarks.length ? renderRows(bookmarks) : <div className="bm-manager-tree-empty"><strong>No bookmarks yet</strong><span>Add a root bookmark to create a new document outline, or save now to remove the existing outline.</span></div>}</div>
            {signed && <div className="bm-manager-warning"><AlertTriangle size={15} /><div><strong>Digital signature detected</strong><div>Saving a new outline rewrites PDF bytes, so the existing cryptographic signature will no longer validate.</div><label className="bm-manager-signature-ack"><input type="checkbox" checked={signatureAck} onChange={event => setSignatureAck(event.target.checked)} /> I understand the existing signature will be invalidated.</label></div></div>}
            <button className="bm-manager-save" type="button" disabled={saving || (signed && !signatureAck)} onClick={() => void savePdf()}>{saving ? <><Save size={17} /> Writing linked outline…</> : <><Download size={17} /> Download bookmarked PDF</>}</button>
            {success && <div className="bm-manager-success"><FileCheck2 size={17} /><span>{success}</span></div>}
            <button className="bm-manager-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
          </>}
        </>}
      </section>
      <section className="bm-manager-info"><article><ShieldCheck size={20} /><h3>Source remains untouched</h3><p>Edits are applied to a new browser-generated copy. No bookmark title or PDF is sent to analytics.</p></article><article><FolderTree size={20} /><h3>Proper linked hierarchy</h3><p>Parent, child, previous, next, first, last, and count entries are rebuilt together for reliable PDF navigation.</p></article><article><Link2 size={20} /><h3>Destination-aware</h3><p>Page targets are editable. Supported web, external-PDF, and named actions remain intact unless retargeted.</p></article></section>
    </div></main>
    <ToolQuickFacts
      definition="A PDF bookmarks manager edits the interactive outline shown in a PDF reader's navigation panel. Bookmark entries can point to pages, contain nested children, start open or closed, or invoke supported web, remote-PDF, and named actions — all editable before you download a new PDF."
      price="Free — no account needed"
      account="Not required"
      processing="Processed locally in your browser without an application document-processing request"
      formats="PDF"
      fileLimit="Up to 100 MB and 2,000 pages"
      browserSupport="Chrome, Firefox, Safari, Edge"
    />
    {seo && <ToolSEOSection {...seo} />}
    <SiteFooter />
  </div>
}
