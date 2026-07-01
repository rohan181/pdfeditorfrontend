'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { PDFDocument, degrees } from 'pdf-lib'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.pg{min-height:100vh;background:#fff;overflow-x:hidden;padding-top:56px;}
.wrap{max-width:1100px;margin:0 auto;padding:0 28px}


.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%}
.logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#E24B4A}
.back{font-size:13px;font-weight:500;color:rgba(0,0,0,.5);text-decoration:none;padding:5px 14px;border-radius:99px;transition:color .15s}
.back:hover{color:#1d1d1f}

.hero{padding:64px 0 36px;text-align:center;border-bottom:1px solid #f0f0f0}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fff5f5;border:1px solid rgba(226,75,74,.2);border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.08em;color:#E24B4A;margin-bottom:18px;text-transform:uppercase}
.bdot{width:5px;height:5px;border-radius:50%;background:#E24B4A}
.hero h1{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:clamp(30px,5vw,54px);font-weight:800;letter-spacing:-.05em;line-height:.97;color:#1d1d1f;margin-bottom:14px}
.hero h1 em{font-style:normal;color:#E24B4A}
.hero p{font-size:15px;color:rgba(0,0,0,.5);line-height:1.7;max-width:440px;margin:0 auto}

.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:32px;margin:32px 0 16px;box-shadow:0 2px 20px rgba(0,0,0,.04)}
@media(max-width:600px){.card{padding:18px}}

/* drop zone */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#E24B4A;background:#fff5f5}
.drop-icon{font-size:44px;margin-bottom:12px;display:block}
.drop h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:19px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:18px;line-height:1.5}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#E24B4A}

/* add-more mini drop zone */
.add-drop{border:2px dashed #d0d0d0;border-radius:10px;padding:18px 20px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:10px}
.add-drop:hover,.add-drop.over{border-color:#E24B4A;background:#fff5f5}
.add-drop span{font-size:13px;font-weight:600;color:rgba(0,0,0,.5)}
.add-drop-btn{padding:6px 16px;background:#1d1d1f;border:none;border-radius:7px;font-size:12px;font-weight:600;color:#fff;cursor:pointer;transition:background .15s;white-space:nowrap}
.add-drop-btn:hover{background:#E24B4A}

/* source file list */
.src-list{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
.src-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;border:1px solid #e8e8e8;background:#fafafa}
.src-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.src-info{flex:1;min-width:0}
.src-name{font-size:12px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.src-meta{font-size:10px;color:rgba(0,0,0,.4);margin-top:1px}
.src-rm{width:22px;height:22px;border-radius:5px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:10px;transition:all .14s;flex-shrink:0}
.src-rm:hover{border-color:#E24B4A;color:#E24B4A}

/* toolbar */
.toolbar{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:20px;flex-wrap:wrap}
.toolbar-info{font-size:11px;color:rgba(0,0,0,.4);flex:1;min-width:120px}
.tb-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:#fff;color:#1d1d1f;transition:all .14s;white-space:nowrap}
.tb-btn:hover{border-color:#1d1d1f;background:#f5f5f7}
.tb-btn.danger{color:#E24B4A;border-color:rgba(226,75,74,.25);background:rgba(226,75,74,.04)}
.tb-btn.danger:hover{background:rgba(226,75,74,.1);border-color:#E24B4A}
.tb-btn:disabled{opacity:.35;cursor:not-allowed}

/* page grid */
.page-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px;margin-bottom:24px}
@media(max-width:480px){.page-grid{grid-template-columns:repeat(2,1fr);gap:10px}}

.page-card{border-radius:10px;border:2px solid #e8e8e8;overflow:hidden;background:#fff;cursor:grab;transition:border-color .15s,box-shadow .15s,transform .15s;user-select:none;position:relative}
.page-card:active{cursor:grabbing}
.page-card.selected{border-color:#E24B4A;box-shadow:0 0 0 3px rgba(226,75,74,.12)}
.page-card.drag-over{transform:scale(1.03);border-color:#1d1d1f;box-shadow:0 4px 16px rgba(0,0,0,.12)}
.page-card.dragging{opacity:.3}
.src-stripe{position:absolute;top:0;left:0;width:3px;bottom:0;z-index:2}
.page-thumb{position:relative;background:#f5f5f7;aspect-ratio:.707;overflow:hidden;display:flex;align-items:center;justify-content:center}
.page-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.page-num{position:absolute;top:5px;left:8px;background:rgba(0,0,0,.55);color:#fff;font-size:9px;font-weight:700;border-radius:4px;padding:2px 5px}
.page-rot-badge{position:absolute;bottom:5px;left:5px;background:rgba(99,102,241,.85);color:#fff;font-size:8px;font-weight:700;border-radius:4px;padding:2px 5px}
.page-del-btn{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;background:rgba(226,75,74,.9);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:opacity .15s;z-index:3}
.page-card:hover .page-del-btn{opacity:1}
.page-footer{padding:6px 8px 6px 11px;border-top:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:4px}
.page-label{font-size:10px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70px}
.page-actions{display:flex;gap:3px;flex-shrink:0}
.rot-btn{width:22px;height:22px;border-radius:5px;border:1px solid #e0e0e0;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.5);font-size:11px;transition:all .12s}
.rot-btn:hover{border-color:#6366f1;color:#6366f1;background:rgba(99,102,241,.06)}

/* action bar */
.action-bar{display:flex;gap:10px;flex-wrap:wrap}
.dl-btn{flex:1;min-width:160px;padding:14px;background:#1d1d1f;border:none;border-radius:10px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.dl-btn:hover:not(:disabled){background:#E24B4A}
.dl-btn:disabled{opacity:.4;cursor:not-allowed}
.reset-btn{padding:14px 20px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:7px}
.reset-btn:hover{border-color:#1d1d1f}

/* progress */
.prog-wrap{margin-top:12px}
.prog-bar{height:3px;background:#e8e8e8;border-radius:99px;overflow:hidden}
.prog-fill{height:100%;background:#1d1d1f;border-radius:99px;transition:width .3s ease}
.prog-label{font-size:10px;color:rgba(0,0,0,.4);margin-top:5px;text-align:center;letter-spacing:.06em;text-transform:uppercase}

/* misc */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:48px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:5px}
.info-card p{font-size:12px;color:rgba(0,0,0,.45);line-height:1.6}
.error-box{padding:11px 14px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:9px;font-size:13px;color:#E24B4A;margin-bottom:12px}
.loading-box{padding:40px 24px;text-align:center;color:rgba(0,0,0,.4);font-size:13px}
`

// ─── Colour palette for source files ─────────────────────────────────────────
const SRC_COLORS = [
  '#E24B4A','#6366f1','#22c55e','#f59e0b','#0ea5e9','#a855f7','#ec4899','#14b8a6',
]

// ─── Types ────────────────────────────────────────────────────────────────────
type SourceFile = {
  id: string
  name: string
  size: number
  bytes: ArrayBuffer
  color: string
  pageCount: number
}

type PageEntry = {
  id: string
  thumbUrl: string
  rotation: 0 | 90 | 180 | 270
  sourceId: string
  originalIndex: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

let _id = 0
const nextId = () => `id-${++_id}`

// ─── Component ────────────────────────────────────────────────────────────────
export default function PDFPageManagerPage() {
  const [sources, setSources]   = useState<SourceFile[]>([])
  const [pages, setPages]       = useState<PageEntry[]>([])
  const [loadingName, setLoadingName] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError]       = useState('')
  const [isDragZone, setIsDragZone] = useState(false)
  const [isAddDragZone, setIsAddDragZone] = useState(false)

  const fileRef    = useRef<HTMLInputElement>(null)
  const addFileRef = useRef<HTMLInputElement>(null)

  // ── Load one PDF and append its pages ──────────────────────────────────────
  const loadPDF = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setError(`"${f.name}" is not a PDF file.`); return
    }
    setError('')
    setLoadingName(f.name)

    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const bytes = await f.arrayBuffer()
      const doc   = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise

      const srcId   = nextId()
      const color   = SRC_COLORS[(_id - 1) % SRC_COLORS.length]
      const entries: PageEntry[] = []

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const vp   = page.getViewport({ scale: 0.5 })
        const canvas = document.createElement('canvas')
        canvas.width  = vp.width
        canvas.height = vp.height
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise
        entries.push({
          id: nextId(),
          thumbUrl: canvas.toDataURL('image/jpeg', 0.8),
          rotation: 0,
          sourceId: srcId,
          originalIndex: i - 1,
        })
      }

      setSources(prev => [...prev, { id: srcId, name: f.name, size: f.size, bytes, color, pageCount: doc.numPages }])
      setPages(prev => [...prev, ...entries])
    } catch (e: any) {
      setError(`Failed to load "${f.name}": ${e?.message ?? 'unknown error'}`)
    } finally {
      setLoadingName(null)
    }
  }, [])

  // ── Load multiple files in sequence ────────────────────────────────────────
  const loadFiles = useCallback(async (files: FileList | File[]) => {
    for (const f of Array.from(files)) await loadPDF(f)
  }, [loadPDF])

  // ── Remove a source file and all its pages ──────────────────────────────────
  const removeSource = (srcId: string) => {
    setSources(prev => prev.filter(s => s.id !== srcId))
    setPages(prev => prev.filter(p => p.sourceId !== srcId))
    setSelected(prev => {
      const kept = new Set(prev)
      pages.filter(p => p.sourceId === srcId).forEach(p => kept.delete(p.id))
      return kept
    })
  }

  // ── Card drag-and-drop reordering ──────────────────────────────────────────
  const onCardDragStart = (id: string) => setDragging(id)
  const onCardDragOver  = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOver(id) }
  const onCardDrop      = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return }
    setPages(prev => {
      const next = [...prev]
      const from = next.findIndex(p => p.id === dragging)
      const to   = next.findIndex(p => p.id === targetId)
      if (from < 0 || to < 0) return prev
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setDragging(null); setDragOver(null)
  }

  // ── Selection ──────────────────────────────────────────────────────────────
  const toggleSelect = (id: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.rot-btn,.page-del-btn')) return
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const selectAll = () => setSelected(new Set(pages.map(p => p.id)))
  const clearSel  = () => setSelected(new Set())

  // ── Per-page actions ───────────────────────────────────────────────────────
  const rotatePage = (id: string, dir: 'cw' | 'ccw') =>
    setPages(prev => prev.map(p => p.id !== id ? p : {
      ...p, rotation: (((p.rotation + (dir === 'cw' ? 90 : -90)) + 360) % 360) as 0|90|180|270,
    }))

  const deletePage = (id: string) => {
    if (pages.length <= 1) return
    setPages(prev => prev.filter(p => p.id !== id))
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  // ── Bulk actions ───────────────────────────────────────────────────────────
  const rotateSelected = (dir: 'cw' | 'ccw') =>
    setPages(prev => prev.map(p => !selected.has(p.id) ? p : {
      ...p, rotation: (((p.rotation + (dir === 'cw' ? 90 : -90)) + 360) % 360) as 0|90|180|270,
    }))

  const deleteSelected = () => {
    if (pages.length - selected.size < 1) return
    setPages(prev => prev.filter(p => !selected.has(p.id)))
    setSelected(new Set())
  }

  // ── Download ───────────────────────────────────────────────────────────────
  const onDownload = async () => {
    if (pages.length === 0) return
    setProcessing(true); setProgress(5); setError('')
    try {
      // Load each source PDF once
      const srcDocs = new Map<string, Awaited<ReturnType<typeof PDFDocument.load>>>()
      for (const src of sources) {
        srcDocs.set(src.id, await PDFDocument.load(src.bytes.slice(0)))
      }

      const outDoc = await PDFDocument.create()
      for (let i = 0; i < pages.length; i++) {
        const p   = pages[i]
        const src = srcDocs.get(p.sourceId)
        if (!src) continue
        const [copied] = await outDoc.copyPages(src, [p.originalIndex])
        if (p.rotation !== 0) copied.setRotation(degrees(p.rotation))
        outDoc.addPage(copied)
        setProgress(5 + Math.round((i / pages.length) * 88))
      }

      setProgress(97)
      const bytes    = await outDoc.save()
      const blob     = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
      const url      = URL.createObjectURL(blob)
      const a        = document.createElement('a')
      const baseName = sources.length === 1
        ? sources[0].name.replace(/\.pdf$/i, '') + '_managed.pdf'
        : 'merged_managed.pdf'
      a.href = url; a.download = baseName; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      setProgress(100)
    } catch (e: any) {
      setError('Failed to save PDF: ' + (e?.message ?? 'unknown error'))
    } finally {
      setProcessing(false)
    }
  }

  const reset = () => {
    setSources([]); setPages([]); setSelected(new Set()); setError(''); setProgress(0)
  }

  const selCount   = selected.size
  const hasPages   = pages.length > 0
  const isLoading  = loadingName !== null
  const srcMap     = Object.fromEntries(sources.map(s => [s.id, s]))

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        {/* Hero */}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>Merge · Reorder · Rotate · Delete</div>
            <h1>Manage Your<br/><em>PDF</em> Pages</h1>
            <p>Combine pages from multiple PDFs, reorder, rotate, and delete — then download as one file.</p>
          </div>
        </div>

        {/* Main card */}
        <div className="wrap">
          <div className="card">

            {!hasPages && !isLoading ? (
              /* ── Initial drop zone ── */
              <>
                <div
                  className={`drop${isDragZone ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragZone(true) }}
                  onDragLeave={() => setIsDragZone(false)}
                  onDrop={e => { e.preventDefault(); setIsDragZone(false); loadFiles(e.dataTransfer.files) }}
                >
                  <span className="drop-icon">📑</span>
                  <h2>Drop your PDFs here</h2>
                  <p>Drag & drop one or more PDFs · All pages will be combined</p>
                  <button className="drop-btn">Choose PDF files</button>
                  <input ref={fileRef} type="file" accept=".pdf" multiple style={{ display:'none' }}
                    onChange={e => { if (e.target.files) loadFiles(e.target.files) }} />
                </div>
                {error && <div className="error-box" style={{ marginTop:12 }}>{error}</div>}
              </>
            ) : (
              <>
                {/* ── Add more PDFs strip ── */}
                <div
                  className={`add-drop${isAddDragZone ? ' over' : ''}`}
                  onClick={() => addFileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsAddDragZone(true) }}
                  onDragLeave={() => setIsAddDragZone(false)}
                  onDrop={e => { e.preventDefault(); setIsAddDragZone(false); loadFiles(e.dataTransfer.files) }}
                >
                  <span style={{ fontSize:22 }}>➕</span>
                  <span>Drop more PDFs here to add their pages</span>
                  <button className="add-drop-btn" onClick={e => { e.stopPropagation(); addFileRef.current?.click() }}>
                    Add PDF
                  </button>
                  <input ref={addFileRef} type="file" accept=".pdf" multiple style={{ display:'none' }}
                    onChange={e => { if (e.target.files) loadFiles(e.target.files) }} />
                </div>

                {/* ── Source file list ── */}
                <div className="src-list">
                  {sources.map(src => (
                    <div className="src-row" key={src.id}>
                      <div className="src-dot" style={{ background: src.color }} />
                      <div className="src-info">
                        <div className="src-name">{src.name}</div>
                        <div className="src-meta">{fmt(src.size)} · {src.pageCount} page{src.pageCount !== 1 ? 's' : ''}</div>
                      </div>
                      <button className="src-rm" onClick={() => removeSource(src.id)} title="Remove this file's pages">✕</button>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="src-row" style={{ opacity:.6 }}>
                      <div className="src-dot" style={{ background:'#ccc' }} />
                      <div className="src-info">
                        <div className="src-name">⏳ Loading {loadingName}…</div>
                      </div>
                    </div>
                  )}
                </div>

                {error && <div className="error-box">{error}</div>}

                {/* ── Toolbar ── */}
                <div className="toolbar">
                  <span className="toolbar-info">
                    {pages.length} page{pages.length !== 1 ? 's' : ''} · {sources.length} file{sources.length !== 1 ? 's' : ''}
                    {selCount > 0 ? ` · ${selCount} selected` : ''}
                  </span>
                  <button className="tb-btn" onClick={selCount === pages.length ? clearSel : selectAll}>
                    {selCount === pages.length ? '☐ Deselect all' : '☑ Select all'}
                  </button>
                  {selCount > 0 && (
                    <>
                      <button className="tb-btn" onClick={() => rotateSelected('ccw')}>↺ Rotate ←</button>
                      <button className="tb-btn" onClick={() => rotateSelected('cw')}>↻ Rotate →</button>
                      {pages.length > selCount && (
                        <button className="tb-btn danger" onClick={deleteSelected}>✕ Delete ({selCount})</button>
                      )}
                    </>
                  )}
                </div>

                {/* ── Page grid ── */}
                <div className="page-grid">
                  {pages.map((p, idx) => {
                    const src = srcMap[p.sourceId]
                    return (
                      <div
                        key={p.id}
                        className={[
                          'page-card',
                          selected.has(p.id) ? 'selected'  : '',
                          dragging === p.id  ? 'dragging'  : '',
                          dragOver === p.id && dragging !== p.id ? 'drag-over' : '',
                        ].filter(Boolean).join(' ')}
                        draggable
                        onDragStart={() => onCardDragStart(p.id)}
                        onDragOver={e  => onCardDragOver(e, p.id)}
                        onDrop={e      => onCardDrop(e, p.id)}
                        onDragEnd={()  => { setDragging(null); setDragOver(null) }}
                        onClick={e     => toggleSelect(p.id, e)}
                      >
                        {/* Source colour stripe */}
                        {src && <div className="src-stripe" style={{ background: src.color }} />}

                        <div className="page-thumb">
                          <img
                            src={p.thumbUrl}
                            alt={`Page ${idx + 1}`}
                            style={{
                              transform: p.rotation
                                ? `rotate(${p.rotation}deg) scale(${p.rotation === 90 || p.rotation === 270 ? 0.7 : 1})`
                                : undefined,
                              transition: 'transform .2s',
                            }}
                          />
                          <span className="page-num">{idx + 1}</span>
                          {p.rotation !== 0 && <span className="page-rot-badge">↻{p.rotation}°</span>}
                          {pages.length > 1 && (
                            <button className="page-del-btn" onClick={e => { e.stopPropagation(); deletePage(p.id) }}>✕</button>
                          )}
                        </div>

                        <div className="page-footer">
                          <span className="page-label" title={src?.name}>
                            {src ? src.name.replace(/\.pdf$/i, '') : `p.${idx+1}`}
                          </span>
                          <div className="page-actions">
                            <button className="rot-btn" onClick={e => { e.stopPropagation(); rotatePage(p.id, 'ccw') }} title="Rotate left">↺</button>
                            <button className="rot-btn" onClick={e => { e.stopPropagation(); rotatePage(p.id, 'cw') }}  title="Rotate right">↻</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ── Action bar ── */}
                <div className="action-bar">
                  <button className="dl-btn" onClick={onDownload} disabled={processing || pages.length === 0 || isLoading}>
                    {processing ? '⏳ Saving…' : `⬇ Download PDF (${pages.length} page${pages.length !== 1 ? 's' : ''})`}
                  </button>
                  <button className="reset-btn" onClick={reset}>Start over</button>
                </div>

                {processing && (
                  <div className="prog-wrap">
                    <div className="prog-bar">
                      <div className="prog-fill" style={{ width:`${progress}%` }} />
                    </div>
                    <div className="prog-label">Building your PDF…</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>📚 Multiple PDFs</h3>
              <p>Load pages from as many PDFs as you like. Mix and match pages in any order.</p>
            </div>
            <div className="info-card">
              <h3>↕ Drag to Reorder</h3>
              <p>Drag any page thumbnail to a new position. The order you see is the order you get.</p>
            </div>
            <div className="info-card">
              <h3>🔒 Private</h3>
              <p>Everything runs in your browser. Your files are never uploaded to any server.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
