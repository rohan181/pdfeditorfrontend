'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

// ── Types ────────────────────────────────────────────────────────────────────
type Tool = 'select' | 'highlight' | 'underline' | 'strikethrough' | 'comment' | 'rect' | 'arrow' | 'pen' | 'text'
interface Pt { x: number; y: number }  // normalised 0–1 relative to page

interface Annotation {
  id: string; type: Tool; page: number
  x: number; y: number; w: number; h: number   // normalised
  color: string; text: string
  points: Pt[]   // for arrow / pen
  fontSize: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2)

const TOOL_DEF: { id: Tool; label: string; icon: string; tip: string }[] = [
  { id:'select',        icon:'↖',  label:'Select',        tip:'Click to select & move annotations' },
  { id:'highlight',     icon:'■',  label:'Highlight',     tip:'Drag to highlight text area' },
  { id:'underline',     icon:'U',  label:'Underline',     tip:'Drag to underline text area' },
  { id:'strikethrough', icon:'S̶',  label:'Strikethrough', tip:'Drag to strike through text' },
  { id:'comment',       icon:'💬', label:'Comment',       tip:'Click to add a note' },
  { id:'rect',          icon:'□',  label:'Rectangle',     tip:'Drag to draw a rectangle' },
  { id:'arrow',         icon:'↗',  label:'Arrow',         tip:'Drag to draw an arrow' },
  { id:'pen',           icon:'✏',  label:'Pen',           tip:'Freehand drawing' },
  { id:'text',          icon:'T',  label:'Text',          tip:'Click to add text' },
]
const COLORS = ['#FFDE34','#7FE87F','#FF8FAB','#7EC8E3','#FF6B6B','#B794F4','#000000','#2563EB']
const HI_ALPHA = 0.35

// ── PageView ─────────────────────────────────────────────────────────────────
interface PageViewProps {
  pdfDoc: any; pageNum: number; scale: number
  tool: Tool; color: string
  annotations: Annotation[]; selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: (a: Annotation) => void
  onStartEdit: (id: string) => void
}

function PageView({ pdfDoc, pageNum, scale, tool, color, annotations, selectedId, onSelect, onAdd, onStartEdit }: PageViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cw, setCw] = useState(0)
  const [ch, setCh] = useState(0)
  const [pageH, setPageH] = useState(1)  // PDF height in points (for export Y-flip)

  const drawing   = useRef(false)
  const startPt   = useRef<Pt>({ x: 0, y: 0 })
  const penPts    = useRef<Pt[]>([])
  const [draft, setDraft] = useState<Partial<Annotation> | null>(null)

  // Render PDF page
  useEffect(() => {
    if (!pdfDoc) return
    let cancelled = false
    ;(async () => {
      const pg = await pdfDoc.getPage(pageNum)
      if (cancelled) return
      const vp  = pg.getViewport({ scale })
      const vp1 = pg.getViewport({ scale: 1 })
      if (!canvasRef.current) return
      canvasRef.current.width  = vp.width
      canvasRef.current.height = vp.height
      setCw(vp.width); setCh(vp.height); setPageH(vp1.height)
      await pg.render({ canvasContext: canvasRef.current.getContext('2d')!, viewport: vp }).promise
    })()
    return () => { cancelled = true }
  }, [pdfDoc, pageNum, scale])

  const norm = (e: React.MouseEvent<SVGSVGElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: (e.clientX - r.left) / cw, y: (e.clientY - r.top) / ch }
  }

  const onDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (tool === 'select') { onSelect(null); return }
    e.preventDefault()
    const pt = norm(e)
    drawing.current = true
    startPt.current = pt

    if (tool === 'pen') {
      penPts.current = [pt]
      setDraft({ type: 'pen', color, points: [pt] })
    } else if (tool === 'comment' || tool === 'text') {
      const id = uid()
      const a: Annotation = { id, type: tool, page: pageNum, x: pt.x, y: pt.y, w: 0.04, h: 0.04, color, text: '', points: [], fontSize: 14 }
      onAdd(a); onStartEdit(id); drawing.current = false
    } else {
      setDraft({ type: tool, color, x: pt.x, y: pt.y, w: 0, h: 0, points: [pt, pt] })
    }
  }

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drawing.current) return
    const pt = norm(e)
    if (tool === 'pen') {
      penPts.current.push(pt)
      setDraft(d => d ? { ...d, points: [...penPts.current] } : d)
    } else if (tool === 'arrow') {
      setDraft(d => d ? { ...d, points: [startPt.current, pt] } : d)
    } else {
      const s = startPt.current
      setDraft(d => d ? { ...d, x: Math.min(s.x, pt.x), y: Math.min(s.y, pt.y), w: Math.abs(pt.x - s.x), h: Math.abs(pt.y - s.y) } : d)
    }
  }

  const onUp = () => {
    if (!drawing.current || !draft) { drawing.current = false; return }
    drawing.current = false
    const minSize = 0.003
    const big = (draft.w ?? 0) > minSize || (draft.h ?? 0) > minSize || (draft.points?.length ?? 0) > 1
    if (big) {
      onAdd({ id: uid(), type: draft.type as Tool, page: pageNum, x: draft.x ?? 0, y: draft.y ?? 0, w: draft.w ?? 0, h: draft.h ?? 0, color, text: '', points: draft.points ?? [], fontSize: 14 })
    }
    setDraft(null)
    penPts.current = []
  }

  const renderAnn = (a: Annotation, isDraft = false) => {
    const x = a.x * cw, y = a.y * ch, w = a.w * cw, h = a.h * ch
    const sel = a.id === selectedId
    const onClick = isDraft ? undefined : (e: React.MouseEvent) => { e.stopPropagation(); onSelect(a.id) }
    const dblClick = isDraft ? undefined : (e: React.MouseEvent) => { e.stopPropagation(); onStartEdit(a.id) }
    const ptr: React.CSSProperties = { cursor: tool === 'select' ? 'pointer' : 'inherit' }

    switch (a.type) {
      case 'highlight':
        return <rect key={a.id} x={x} y={y} width={w} height={h} fill={a.color} fillOpacity={HI_ALPHA} style={ptr} onClick={onClick}/>
      case 'underline':
        return <line key={a.id} x1={x} y1={y+h} x2={x+w} y2={y+h} stroke={a.color} strokeWidth={2.5} style={ptr} onClick={onClick}/>
      case 'strikethrough':
        return <line key={a.id} x1={x} y1={y+h/2} x2={x+w} y2={y+h/2} stroke={a.color} strokeWidth={2} style={ptr} onClick={onClick}/>
      case 'rect':
        return <rect key={a.id} x={x} y={y} width={w} height={h} fill="none" stroke={a.color} strokeWidth={2} style={ptr} onClick={onClick}/>
      case 'comment':
        return (
          <g key={a.id} style={ptr} onClick={onClick} onDoubleClick={dblClick}>
            <rect x={x} y={y} width={22} height={22} rx={4} fill={a.color} fillOpacity={0.9}/>
            <text x={x+11} y={y+15} textAnchor="middle" fontSize={12} fill="#fff" style={{ userSelect:'none' }}>💬</text>
            {sel && a.text && (
              <foreignObject x={x+24} y={y-2} width={200} height={80}>
                <div style={{ background:'#fffde7', border:`1.5px solid ${a.color}`, borderRadius:6, padding:'5px 8px', fontSize:11, color:'#374151', lineHeight:1.5, boxShadow:'0 2px 8px rgba(0,0,0,.15)' }}>
                  {a.text}
                </div>
              </foreignObject>
            )}
          </g>
        )
      case 'text':
        return (
          <g key={a.id} style={ptr} onClick={onClick} onDoubleClick={dblClick}>
            <text x={x} y={y + a.fontSize} fontSize={a.fontSize} fill={a.color} style={{ userSelect:'none' }}>
              {a.text || (isDraft ? '' : '…')}
            </text>
          </g>
        )
      case 'arrow': {
        const pts = a.points
        if (!pts || pts.length < 2) return null
        const ax = pts[0].x*cw, ay = pts[0].y*ch, bx = pts[1].x*cw, by = pts[1].y*ch
        const angle = Math.atan2(by-ay, bx-ax)
        const L = 14
        return (
          <g key={a.id} style={ptr} onClick={onClick}>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={a.color} strokeWidth={2.5} strokeLinecap="round"/>
            <line x1={bx} y1={by} x2={bx-L*Math.cos(angle+2.5)} y2={by-L*Math.sin(angle+2.5)} stroke={a.color} strokeWidth={2.5} strokeLinecap="round"/>
            <line x1={bx} y1={by} x2={bx-L*Math.cos(angle-2.5)} y2={by-L*Math.sin(angle-2.5)} stroke={a.color} strokeWidth={2.5} strokeLinecap="round"/>
          </g>
        )
      }
      case 'pen': {
        const pts = a.points
        if (!pts || pts.length < 2) return null
        const d = pts.map((p, i) => `${i?'L':'M'}${(p.x*cw).toFixed(1)},${(p.y*ch).toFixed(1)}`).join(' ')
        return <path key={a.id} d={d} fill="none" stroke={a.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={ptr} onClick={onClick}/>
      }
      default: return null
    }
  }

  const toolCursor: Record<Tool, string> = {
    select:'default', highlight:'crosshair', underline:'crosshair',
    strikethrough:'crosshair', comment:'crosshair', rect:'crosshair',
    arrow:'crosshair', pen:'crosshair', text:'text',
  }
  const pageAnns = annotations.filter(a => a.page === pageNum)
  const selAnn   = pageAnns.find(a => a.id === selectedId)

  return (
    <div style={{ position:'relative', flexShrink:0, boxShadow:'0 4px 24px rgba(0,0,0,.28)', background:'#fff' }}>
      <canvas ref={canvasRef} style={{ display:'block' }}/>
      {cw > 0 && ch > 0 && (
        <svg width={cw} height={ch}
          style={{ position:'absolute', inset:0, cursor: toolCursor[tool], userSelect:'none' as const, touchAction:'none' }}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        >
          {/* Transparent background – clears selection on click */}
          <rect x={0} y={0} width={cw} height={ch} fill="transparent"
            onClick={() => tool === 'select' && onSelect(null)}/>

          {pageAnns.map(a => renderAnn(a))}
          {draft && renderAnn(draft as Annotation, true)}

          {/* Selection handle */}
          {selAnn && selAnn.type !== 'pen' && selAnn.type !== 'arrow' && selAnn.type !== 'comment' && selAnn.type !== 'text' && (
            <rect x={selAnn.x*cw-4} y={selAnn.y*ch-4} width={selAnn.w*cw+8} height={selAnn.h*ch+8}
              fill="none" stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="5,3" style={{ pointerEvents:'none' }}/>
          )}
        </svg>
      )}
      {/* Page badge */}
      <div style={{ position:'absolute', bottom:8, right:8, padding:'2px 7px', background:'rgba(0,0,0,.45)', borderRadius:6, fontSize:10, color:'#fff', pointerEvents:'none' }}>
        {pageNum}
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function PDFAnnotate() {
  const [file,       setFile]       = useState<File | null>(null)
  const [numPages,   setNumPages]   = useState(0)
  const [pdfDoc,     setPdfDoc]     = useState<any>(null)
  const [scale,      setScale]      = useState(1.3)
  const [tool,       setTool]       = useState<Tool>('highlight')
  const [color,      setColor]      = useState('#FFDE34')
  const [isDrop,     setIsDrop]     = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')

  // Annotation state with undo/redo
  const [history,  setHistory]  = useState<Annotation[][]>([[]])
  const [histIdx,  setHistIdx]  = useState(0)
  const annotations = history[histIdx]

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId,  setEditingId]  = useState<string | null>(null)

  const fileRef   = useRef<HTMLInputElement>(null)
  const mainRef   = useRef<HTMLDivElement>(null)

  const setAnnotations = useCallback((updater: Annotation[] | ((p: Annotation[]) => Annotation[])) => {
    setHistory(prev => {
      const cur  = prev[histIdx]
      const next = typeof updater === 'function' ? updater(cur) : updater
      const newH = prev.slice(0, histIdx + 1)
      newH.push(next)
      return newH
    })
    setHistIdx(i => i + 1)
  }, [histIdx])

  const undo = () => { if (histIdx > 0) setHistIdx(i => i - 1) }
  const redo = () => { if (histIdx < history.length - 1) setHistIdx(i => i + 1) }

  const loadFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF.'); return }
    setError(''); setLoading(true); setHistory([[]]); setHistIdx(0); setSelectedId(null); setEditingId(null)
    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const doc = await lib.getDocument({ data: await f.arrayBuffer() }).promise
      setPdfDoc(doc); setNumPages(doc.numPages); setFile(f)
    } catch (e: any) { setError(e.message ?? 'Failed to load PDF.') }
    finally { setLoading(false) }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }

  const addAnnotation = useCallback((a: Annotation) => {
    setAnnotations(prev => [...prev, a])
  }, [setAnnotations])

  const deleteSelected = useCallback(() => {
    if (!selectedId) return
    setAnnotations(prev => prev.filter(a => a.id !== selectedId))
    setSelectedId(null); setEditingId(null)
  }, [selectedId, setAnnotations])

  const updateAnnotation = (id: string, patch: Partial<Annotation>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a))
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) { deleteSelected(); return }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo() }
      const toolKeys: Record<string, Tool> = { v:'select', h:'highlight', u:'underline', s:'strikethrough', c:'comment', r:'rect', a:'arrow', p:'pen', t:'text' }
      if (toolKeys[e.key]) setTool(toolKeys[e.key])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, deleteSelected, histIdx, history.length])

  // Export PDF with baked-in annotations
  const exportPDF = async () => {
    if (!file || !pdfDoc) return
    setSaving(true); setError('')
    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      const bytes  = await file.arrayBuffer()
      const pdfOut = await PDFDocument.load(bytes)
      const font   = await pdfOut.embedFont(StandardFonts.Helvetica)
      const pages  = pdfOut.getPages()

      for (const ann of annotations) {
        const pg = pages[ann.page - 1]
        if (!pg) continue
        const { width: pw, height: ph } = pg.getSize()

        const pdfX = ann.x * pw
        const pdfY = (1 - ann.y - ann.h) * ph
        const pdfW = ann.w * pw
        const pdfH = ann.h * ph

        const hex = ann.color.replace('#', '')
        const cr  = parseInt(hex.slice(0,2), 16) / 255
        const cg  = parseInt(hex.slice(2,4), 16) / 255
        const cb  = parseInt(hex.slice(4,6), 16) / 255
        const col = rgb(cr, cg, cb)

        switch (ann.type) {
          case 'highlight':
            pg.drawRectangle({ x: pdfX, y: pdfY, width: pdfW, height: pdfH, color: col, opacity: HI_ALPHA })
            break
          case 'underline':
            pg.drawLine({ start: { x: pdfX, y: pdfY }, end: { x: pdfX + pdfW, y: pdfY }, thickness: 1.5, color: col })
            break
          case 'strikethrough':
            pg.drawLine({ start: { x: pdfX, y: pdfY + pdfH / 2 }, end: { x: pdfX + pdfW, y: pdfY + pdfH / 2 }, thickness: 1.5, color: col })
            break
          case 'rect':
            pg.drawRectangle({ x: pdfX, y: pdfY, width: pdfW, height: pdfH, borderColor: col, borderWidth: 2 })
            break
          case 'comment':
            pg.drawRectangle({ x: pdfX, y: pdfY + pdfH, width: 20, height: 20, color: col, opacity: 0.9 })
            if (ann.text) {
              const boxW = Math.min(Math.max(100, ann.text.length * 5.5), 200)
              pg.drawRectangle({ x: pdfX + 24, y: pdfY + pdfH - 20, width: boxW, height: 34, color: rgb(1,1,.93), borderColor: col, borderWidth: 1, opacity: 0.95 })
              pg.drawText(ann.text.slice(0, 40), { x: pdfX + 28, y: pdfY + pdfH - 10, size: 9, font, color: rgb(0,0,0) })
            }
            break
          case 'text':
            if (ann.text)
              pg.drawText(ann.text, { x: pdfX, y: (1 - ann.y) * ph, size: 12, font, color: col })
            break
          case 'arrow': {
            const pts = ann.points
            if (pts?.length >= 2) {
              const ax = pts[0].x*pw, ay = (1-pts[0].y)*ph
              const bx = pts[1].x*pw, by = (1-pts[1].y)*ph
              const angle = Math.atan2(by-ay, bx-ax)
              const L = 10
              pg.drawLine({ start:{x:ax,y:ay}, end:{x:bx,y:by}, thickness: 2, color: col })
              pg.drawLine({ start:{x:bx,y:by}, end:{x:bx-L*Math.cos(angle+2.5), y:by-L*Math.sin(angle+2.5)}, thickness:2, color:col })
              pg.drawLine({ start:{x:bx,y:by}, end:{x:bx-L*Math.cos(angle-2.5), y:by-L*Math.sin(angle-2.5)}, thickness:2, color:col })
            }
            break
          }
          case 'pen': {
            const pts = ann.points
            if (pts) for (let i = 0; i < pts.length - 1; i++) {
              pg.drawLine({ start: {x:pts[i].x*pw, y:(1-pts[i].y)*ph}, end: {x:pts[i+1].x*pw, y:(1-pts[i+1].y)*ph}, thickness: 1.5, color: col })
            }
            break
          }
        }
      }

      const out  = await pdfOut.save()
      const blob = new Blob([out as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url; a.download = file.name.replace(/\.pdf$/i, '_annotated.pdf'); a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) { setError(e.message ?? 'Export failed.') }
    finally { setSaving(false) }
  }

  const editingAnn = annotations.find(a => a.id === editingId) ?? null
  const canUndo    = histIdx > 0
  const canRedo    = histIdx < history.length - 1
  const fmtBytes   = (b: number) => b < 1048576 ? `${(b/1024).toFixed(0)} KB` : `${(b/1048576).toFixed(1)} MB`

  // Annotation list grouped by page
  const annByPage: Record<number, Annotation[]> = {}
  for (const a of annotations) (annByPage[a.page] ??= []).push(a)

  const typeIcon: Record<Tool, string> = {
    select:'↖', highlight:'■', underline:'U', strikethrough:'S̶',
    comment:'💬', rect:'□', arrow:'↗', pen:'✏', text:'T',
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    page:  { height:'100vh', display:'flex', flexDirection:'column' as const, overflow:'hidden', background:'#1c1c1e', fontFamily:'system-ui,sans-serif' },
    nav:   { height:52, background:'rgba(28,28,30,.97)', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', padding:'0 16px', gap:10, flexShrink:0 },
    work:  { flex:1, display:'flex', overflow:'hidden' },
    lsb:   { width:200, flexShrink:0, background:'#2c2c2e', borderRight:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column' as const, overflow:'hidden' },
    main:  { flex:1, overflowY:'auto' as const, background:'#3a3a3c', display:'flex', flexDirection:'column' as const, alignItems:'center', padding:'28px 20px', gap:20 },
    rsb:   { width:256, flexShrink:0, background:'#2c2c2e', borderLeft:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column' as const, padding:16, gap:12, overflowY:'auto' as const },
  }

  return (
    <div style={S.page}>
      {/* ── Nav ── */}
      <nav style={S.nav}>
        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <svg width="27" height="27" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="lg-pa" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e"/><stop offset="1" stopColor="#e11d48"/></linearGradient></defs>
            <path d="M0 0H38C44 0 48 6 48 13.5C48 21 44 27 38 27H10M10 27V48H0V0M10 27H32" stroke="url(#lg-pa)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="38" cy="27" r="5" fill="url(#lg-pa)"/>
          </svg>
          <span style={{ fontSize:14, fontWeight:700, color:'#fff', letterSpacing:'-.03em' }}>EditPDF<span style={{ marginLeft:2, background:'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}> AI</span></span>
        </Link>
        <span style={{ fontSize:11, color:'rgba(255,255,255,.25)' }}>›</span>
        <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>PDF Annotator</span>

        {/* Undo / Redo */}
        <div style={{ display:'flex', gap:4, marginLeft:8 }}>
          <button onClick={undo} disabled={!canUndo} title="Undo (⌘Z)"
            style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color: canUndo?'#fff':'rgba(255,255,255,.2)', cursor:canUndo?'pointer':'default', fontSize:13 }}>↩</button>
          <button onClick={redo} disabled={!canRedo} title="Redo (⌘Y)"
            style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color: canRedo?'#fff':'rgba(255,255,255,.2)', cursor:canRedo?'pointer':'default', fontSize:13 }}>↪</button>
        </div>

        {/* Scale */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:6 }}>
          <button onClick={() => setScale(s => Math.max(0.5, +(s-.2).toFixed(1)))}
            style={{ width:24, height:24, borderRadius:5, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color:'#fff', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
          <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.6)', minWidth:32, textAlign:'center' }}>{Math.round(scale*100)}%</span>
          <button onClick={() => setScale(s => Math.min(3, +(s+.2).toFixed(1)))}
            style={{ width:24, height:24, borderRadius:5, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color:'#fff', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
        </div>

        <div style={{ flex:1 }}/>

        {file && (
          <span style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>{file.name} · {numPages}p · {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}</span>
        )}

        {file && (
          <button onClick={exportPDF} disabled={saving}
            style={{ padding:'7px 16px', borderRadius:8, border:'none', background: saving?'#4b5563':'#7c3aed', color:'#fff', fontSize:12, fontWeight:800, cursor:saving?'not-allowed':'pointer' }}>
            {saving ? 'Saving…' : '⬇ Save PDF'}
          </button>
        )}
        {file && (
          <button onClick={() => { setFile(null); setPdfDoc(null); setNumPages(0); setHistory([[]]); setHistIdx(0); setSelectedId(null); setEditingId(null) }}
            style={{ padding:'7px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,.18)', background:'transparent', color:'rgba(255,255,255,.7)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            ← New
          </button>
        )}
      </nav>

      <div style={S.work}>
        {/* ── Left sidebar: tools + annotation list ── */}
        <aside style={S.lsb}>
          {/* Tool palette */}
          <div style={{ padding:'12px 10px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
            {TOOL_DEF.map(t => (
              <button key={t.id} onClick={() => setTool(t.id)} title={`${t.label} (${t.id[0]})`}
                style={{ padding:'7px 6px', borderRadius:8, border:`1.5px solid ${tool===t.id?'#7c3aed':'transparent'}`, background: tool===t.id?'rgba(124,58,237,.2)':'rgba(255,255,255,.04)', color: tool===t.id?'#a78bfa':'rgba(255,255,255,.6)', cursor:'pointer', fontSize:11, fontWeight:700, display:'flex', flexDirection:'column' as const, alignItems:'center', gap:2 }}>
                <span style={{ fontSize:15 }}>{t.icon}</span>
                <span style={{ fontSize:9, letterSpacing:'.03em' }}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Color palette */}
          <div style={{ padding:'10px 10px 8px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:7 }}>Color</div>
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:5 }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  style={{ width:24, height:24, borderRadius:6, background:c, border: color===c?'2.5px solid #a78bfa':'2px solid transparent', outline: color===c?'1.5px solid rgba(167,139,250,.5)':'none', outlineOffset:1, cursor:'pointer', flexShrink:0 }}/>
              ))}
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width:24, height:24, borderRadius:6, border:'1px solid rgba(255,255,255,.2)', cursor:'pointer', padding:2, background:'rgba(255,255,255,.08)' }}/>
            </div>
          </div>

          {/* Annotation list */}
          <div style={{ flex:1, overflowY:'auto' as const, padding:'8px 6px' }}>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.07em', padding:'0 4px 6px' }}>
              Annotations ({annotations.length})
            </div>
            {Object.keys(annByPage).sort((a,b)=>+a-+b).map(pgStr => (
              <div key={pgStr}>
                <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.25)', padding:'4px 4px 2px', textTransform:'uppercase', letterSpacing:'.06em' }}>Page {pgStr}</div>
                {annByPage[+pgStr].map(a => (
                  <div key={a.id}
                    onClick={() => { setSelectedId(a.id); setEditingId(a.id) }}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 6px', borderRadius:6, margin:'2px 0', background: selectedId===a.id?'rgba(124,58,237,.25)':'transparent', cursor:'pointer' }}>
                    <span style={{ fontSize:13 }}>{typeIcon[a.type]}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,.75)', textTransform:'capitalize' }}>{a.type}</div>
                      {a.text && <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.text}</div>}
                    </div>
                    <div style={{ width:10, height:10, borderRadius:3, background:a.color, flexShrink:0 }}/>
                  </div>
                ))}
              </div>
            ))}
            {annotations.length === 0 && (
              <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', textAlign:'center', paddingTop:20, lineHeight:1.7 }}>
                No annotations yet.<br/>Select a tool and draw on the PDF.
              </div>
            )}
          </div>
        </aside>

        {/* ── Main PDF view ── */}
        <main ref={mainRef} style={S.main}>
          {!file && !loading && (
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
              onDragLeave={() => setIsDrop(false)}
              style={{ border:`2px dashed ${isDrop?'#7c3aed':'rgba(255,255,255,.2)'}`, borderRadius:16, padding:'60px 40px', textAlign:'center', cursor:'pointer', background: isDrop?'rgba(124,58,237,.1)':'rgba(255,255,255,.03)', maxWidth:400 }}
            >
              <div style={{ fontSize:48, marginBottom:12 }}>📄</div>
              <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:8 }}>Drop a PDF to annotate</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', lineHeight:1.7, marginBottom:20 }}>Highlight, comment, underline, draw — then save with annotations baked in.</div>
              <button style={{ padding:'10px 24px', background:'#7c3aed', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:800, cursor:'pointer' }}>Choose PDF</button>
            </div>
          )}
          {loading && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, paddingTop:60 }}>
              <div style={{ width:36, height:36, border:'3px solid rgba(255,255,255,.15)', borderTopColor:'#7c3aed', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>Loading PDF…</div>
            </div>
          )}
          {error && (
            <div style={{ padding:'10px 16px', background:'rgba(220,38,38,.15)', border:'1px solid rgba(220,38,38,.3)', borderRadius:8, fontSize:12, color:'#f87171', maxWidth:400 }}>⚠ {error}</div>
          )}
          {pdfDoc && Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
            <PageView
              key={p}
              pdfDoc={pdfDoc}
              pageNum={p}
              scale={scale}
              tool={tool}
              color={color}
              annotations={annotations}
              selectedId={selectedId}
              onSelect={id => { setSelectedId(id); if (!id) setEditingId(null) }}
              onAdd={addAnnotation}
              onStartEdit={id => { setSelectedId(id); setEditingId(id) }}
            />
          ))}
        </main>

        {/* ── Right panel: comment / text editor + properties ── */}
        {(editingAnn || selectedId) && (() => {
          const ann = editingAnn ?? annotations.find(a => a.id === selectedId)
          if (!ann) return null
          return (
            <aside style={S.rsb}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.07em' }}>
                  {ann.type} · Page {ann.page}
                </div>
                <button onClick={() => { setSelectedId(null); setEditingId(null) }}
                  style={{ width:22, height:38, borderRadius:5, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color:'rgba(255,255,255,.5)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>

              {/* Color */}
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:7 }}>Color</div>
                <div style={{ display:'flex', flexWrap:'wrap' as const, gap:5 }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => updateAnnotation(ann.id, { color: c })}
                      style={{ width:22, height:38, borderRadius:5, background:c, border: ann.color===c?'2px solid #a78bfa':'2px solid transparent', cursor:'pointer', flexShrink:0 }}/>
                  ))}
                </div>
              </div>

              {/* Comment / text content */}
              {(ann.type === 'comment' || ann.type === 'text') && (
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:7 }}>
                    {ann.type === 'comment' ? 'Note' : 'Text'}
                  </div>
                  <textarea
                    autoFocus
                    value={ann.text}
                    onChange={e => updateAnnotation(ann.id, { text: e.target.value })}
                    placeholder={ann.type === 'comment' ? 'Type your comment…' : 'Type your text…'}
                    rows={5}
                    style={{ width:'100%', padding:'9px 11px', borderRadius:9, border:'1.5px solid rgba(255,255,255,.15)', background:'rgba(255,255,255,.07)', color:'#fff', fontSize:12, lineHeight:1.6, resize:'vertical', outline:'none', fontFamily:'system-ui,sans-serif' }}
                  />
                  {ann.type === 'text' && (
                    <>
                      <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.06em', margin:'10px 0 7px' }}>Font Size</div>
                      <input type="range" min={8} max={36} value={ann.fontSize} onChange={e => updateAnnotation(ann.id, { fontSize: +e.target.value })}
                        style={{ width:'100%', accentColor:'#7c3aed' }}/>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', textAlign:'right', marginTop:2 }}>{ann.fontSize}px</div>
                    </>
                  )}
                </div>
              )}

              {/* Annotation info */}
              <div style={{ padding:'10px 12px', background:'rgba(255,255,255,.05)', borderRadius:8, fontSize:11, color:'rgba(255,255,255,.4)', lineHeight:1.7 }}>
                <div>Type: <span style={{ color:'rgba(255,255,255,.7)', fontWeight:600, textTransform:'capitalize' }}>{ann.type}</span></div>
                <div>Page: <span style={{ color:'rgba(255,255,255,.7)', fontWeight:600 }}>{ann.page}</span></div>
                <div>Position: <span style={{ color:'rgba(255,255,255,.7)', fontWeight:600 }}>({(ann.x*100).toFixed(0)}%, {(ann.y*100).toFixed(0)}%)</span></div>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', flexDirection:'column' as const, gap:6, marginTop:'auto' }}>
                <button onClick={() => { setEditingId(null); setSelectedId(null) }}
                  style={{ padding:'9px 14px', borderRadius:8, border:'none', background:'#7c3aed', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  ✓ Done
                </button>
                <button onClick={deleteSelected}
                  style={{ padding:'9px 14px', borderRadius:8, border:'1.5px solid rgba(220,38,38,.4)', background:'rgba(220,38,38,.1)', color:'#f87171', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  🗑 Delete Annotation
                </button>
              </div>
            </aside>
          )
        })()}

      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = '' }}/>
      <ToolSEOSection {...toolSeoData['pdf-annotate']} />
    </div>
  )
}
