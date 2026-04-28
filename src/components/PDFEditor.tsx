'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import DraggableElement from './DraggableElement'
import PageSidebar from './PageSidebar'
import PropertiesPanel from './PropertiesPanel'
import SignatureModal from './SignatureModal'
import DatePickerPanel from './DatePickerPanel'
import OrganisePages from './OrganisePages'
import AutoFillModal, { type DetectedField, type FilledField } from './AutoFillModal'
import ChatFillPanel from './ChatFillPanel'
import type {
  PDFElement, PDFSource, PageSlot, ToolMode,
  TextElement, ImageElement, SignatureElement, StampElement, HighlightElement,
  MarkElement, AnnotationElement, ShapeElement, DrawElement, WatermarkElement,
} from '@/types'

// ── Constants ────────────────────────────────────────────────────────────────
const STAMP_COLOR: Record<string, string> = {
  blue: '#1d4ed8', red: '#dc2626', orange: '#b45309', gray: '#64748b',
}

// ── pdfjs loader (singleton) ─────────────────────────────────────────────────
let _pdfjs: any = null
async function getPdfjs() {
  if (!_pdfjs) {
    _pdfjs = await import('pdfjs-dist')
    _pdfjs.GlobalWorkerOptions.workerSrc =
      `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${_pdfjs.version}/pdf.worker.min.js`
  }
  return _pdfjs
}

// ── Thumbnail generator ──────────────────────────────────────────────────────
async function makeThumb(slot: PageSlot, sources: PDFSource[]): Promise<string> {
  const sc = 0.2
  const rot = slot.rotation || 0
  const sw = rot === 90 || rot === 270
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')!
  if (slot.type === 'pdf') {
    const src = sources.find(s => s.id === slot.sourceId)
    if (!src) return ''
    const page = await src.doc.getPage(slot.pageNum!)
    const vp = page.getViewport({ scale: sc, rotation: rot })
    c.width = vp.width; c.height = vp.height
    await page.render({ canvasContext: ctx, viewport: vp }).promise
  } else if (slot.type === 'blank') {
    c.width  = (sw ? slot.baseHeight : slot.baseWidth)  * sc
    c.height = (sw ? slot.baseWidth  : slot.baseHeight) * sc
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height)
    ctx.fillStyle = '#c8d0e0'; ctx.font = `${c.height * 0.12}px sans-serif`
    ctx.textAlign = 'center'; ctx.fillText('Blank', c.width / 2, c.height / 2)
  } else if (slot.type === 'image') {
    await new Promise<void>(res => {
      const img = new Image(); img.onload = () => {
        c.width  = (sw ? slot.baseHeight : slot.baseWidth)  * sc
        c.height = (sw ? slot.baseWidth  : slot.baseHeight) * sc
        if (rot) {
          ctx.save()
          ctx.translate(c.width / 2, c.height / 2)
          ctx.rotate(rot * Math.PI / 180)
          ctx.drawImage(img, -slot.baseWidth * sc / 2, -slot.baseHeight * sc / 2, slot.baseWidth * sc, slot.baseHeight * sc)
          ctx.restore()
        } else {
          ctx.drawImage(img, 0, 0, c.width, c.height)
        }
        res()
      }; img.src = slot.imageSrc!
    })
  }
  return c.toDataURL('image/jpeg', 0.65)
}

// ── Sub-components ───────────────────────────────────────────────────────────
function HighlightDisplay({ el }: { el: HighlightElement }) {
  return <div style={{ width: '100%', height: '100%', background: el.color, opacity: el.opacity, mixBlendMode: 'multiply', borderRadius: 2 }} />
}

function MarkDisplay({ el }: { el: MarkElement }) {
  const sw = el.strokeWidth * 4
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      {el.markType === 'tick' && (
        <polyline points="12,52 35,75 88,22" fill="none" stroke={el.color}
          strokeWidth={Math.max(18, sw)} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {el.markType === 'cross' && (
        <>
          <line x1="12" y1="12" x2="88" y2="88" stroke={el.color} strokeWidth={sw} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line x1="88" y1="12" x2="12" y2="88" stroke={el.color} strokeWidth={sw} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </>
      )}
      {el.markType === 'circle' && (
        <ellipse cx="50" cy="50" rx="42" ry="42" fill="none" stroke={el.color} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      )}
      {el.markType === 'square' && (
        <rect x="8" y="8" width="84" height="84" fill="none" stroke={el.color}
          strokeWidth={sw} strokeLinejoin="round" vectorEffect="non-scaling-stroke" rx="4" />
      )}
      {el.markType === 'filledbox' && (
        <rect x="2" y="2" width="96" height="96" fill={el.color} rx="4" />
      )}
    </svg>
  )
}

function AnnotationDisplay({ el, isEditing, onChange, onDblClick }: {
  el: AnnotationElement; isEditing: boolean
  onChange: (t: string) => void; onDblClick: () => void
}) {
  return (
    <div style={{
      width: '100%', height: '100%', background: el.color || '#fef9c3',
      border: '1px solid rgba(180,160,0,0.25)', borderRadius: 4,
      padding: '5px 7px', boxSizing: 'border-box',
      boxShadow: '2px 3px 8px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(0,0,0,0.28)', marginBottom: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Note</div>
      {isEditing ? (
        <textarea autoFocus value={el.text} onChange={e => onChange(e.target.value)}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', resize: 'none',
            fontSize: 11, fontFamily: 'Inter, sans-serif', color: '#1e293b', lineHeight: 1.45 }} />
      ) : (
        <div onDoubleClick={onDblClick}
          style={{ flex: 1, fontSize: 11, fontFamily: 'Inter, sans-serif', color: '#1e293b',
            lineHeight: 1.45, whiteSpace: 'pre-wrap', overflow: 'hidden', cursor: 'move' }}>
          {el.text || <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Double-click…</span>}
        </div>
      )}
    </div>
  )
}

function ShapeDisplay({ el }: { el: ShapeElement }) {
  const stroke = el.strokeColor || '#1d4ed8'
  const fill   = el.fillColor   || 'none'
  const sw     = el.strokeWidth || 2
  const vb     = 100
  const ex = vb - sw, ey = sw, sx2 = sw, sy2 = vb - sw
  const ang = Math.atan2(ey - sy2, ex - sx2)
  const hs  = 16
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${vb} ${vb}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      {el.shapeType === 'rectangle' && (
        <rect x={sw/2} y={sw/2} width={vb-sw} height={vb-sw}
          fill={fill} stroke={stroke} strokeWidth={sw} rx={2} vectorEffect="non-scaling-stroke" />
      )}
      {el.shapeType === 'ellipse' && (
        <ellipse cx={vb/2} cy={vb/2} rx={vb/2-sw/2} ry={vb/2-sw/2}
          fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      )}
      {el.shapeType === 'line' && (
        <line x1={sx2} y1={sy2} x2={ex} y2={ey}
          stroke={stroke} strokeWidth={sw} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      )}
      {el.shapeType === 'arrow' && (
        <g>
          <line x1={sx2} y1={sy2} x2={ex} y2={ey}
            stroke={stroke} strokeWidth={sw} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line x1={ex} y1={ey} x2={ex - hs*Math.cos(ang-0.45)} y2={ey - hs*Math.sin(ang-0.45)}
            stroke={stroke} strokeWidth={sw} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line x1={ex} y1={ey} x2={ex - hs*Math.cos(ang+0.45)} y2={ey - hs*Math.sin(ang+0.45)}
            stroke={stroke} strokeWidth={sw} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </g>
      )}
      {el.shapeType === 'polygon' && (
        <polygon
          points={`${vb/2},${sw} ${vb-sw},${vb*0.38} ${vb*0.82},${vb-sw} ${vb*0.18},${vb-sw} ${sw},${vb*0.38}`}
          fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  )
}

function DrawDisplay({ el, scale }: { el: DrawElement; scale: number }) {
  if (el.points.length < 2) return null
  const pts = el.points.map(p => `${(p.x - el.x) * scale},${(p.y - el.y) * scale}`).join(' ')
  return (
    <svg style={{ position:'absolute', inset:0, overflow:'visible', pointerEvents:'none' }}
      width={el.width * scale} height={el.height * scale}>
      <polyline points={pts} fill="none" stroke={el.color} strokeWidth={el.strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" opacity={el.opacity ?? 1} />
    </svg>
  )
}

function WatermarkDisplay({ el, scale }: { el: WatermarkElement; scale: number }) {
  return (
    <div style={{
      width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center',
      transform:`rotate(${el.rotation}deg)`, opacity: el.opacity ?? 0.25, pointerEvents:'none',
      overflow:'hidden',
    }}>
      {el.imageSrc ? (
        <img src={el.imageSrc} alt="watermark" draggable={false}
          style={{ maxWidth:'80%', maxHeight:'80%', objectFit:'contain', userSelect:'none' }} />
      ) : (
        <span style={{
          fontSize: el.fontSize * scale, fontWeight:800, color: el.color,
          fontFamily:'Manrope,sans-serif', letterSpacing:'0.12em',
          whiteSpace:'nowrap', userSelect:'none', textShadow:'0 1px 3px rgba(0,0,0,0.1)',
        }}>{el.text}</span>
      )}
    </div>
  )
}

// ── Ghost position marker ──────────────────────────────────────────────────
function GhostMarker({ toolMode, x, y, activeMarkType, activeShapeType, shapeStroke }: {
  toolMode: ToolMode; x: number; y: number
  activeMarkType: 'tick' | 'cross' | 'circle' | 'square' | 'filledbox'; activeShapeType: string; shapeStroke: string
}) {
  const base: React.CSSProperties = { position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 6, opacity: 0.55 }
  if (toolMode === 'text') return (
    <div style={{ ...base, width: 120, height: 28, border: '2px dashed #6366f1', borderRadius: 3, background: 'rgba(99,102,241,0.06)' }} />
  )
  if (toolMode === 'highlight') return (
    <div style={{ ...base, width: 120, height: 20, background: '#fef08a', borderRadius: 2 }} />
  )
  if (toolMode === 'mark') return (
    <div style={{ ...base, width: 36, height: 36 }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {activeMarkType === 'tick'   && <polyline points="20 6 9 17 4 12"/>}
        {activeMarkType === 'cross'  && <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
        {activeMarkType === 'circle' && <circle cx="12" cy="12" r="9"/>}
        {activeMarkType === 'square' && <rect x="3" y="3" width="18" height="18" rx="1.5"/>}
        {activeMarkType === 'filledbox' && <rect x="3" y="3" width="18" height="18" rx="1.5" fill="currentColor" stroke="none"/>}
      </svg>
    </div>
  )
  if (toolMode === 'annotation') return (
    <div style={{ ...base, width: 100, height: 64, background: '#fef9c3', border: '1px solid rgba(180,160,0,0.25)', borderRadius: 4, boxShadow: '2px 3px 8px rgba(0,0,0,0.08)' }} />
  )
  if (toolMode === 'shape') return (
    <div style={{ ...base, width: 80, height: 60 }}>
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none" stroke={shapeStroke} strokeWidth="1.5">
        {activeShapeType === 'rectangle' && <rect x="2" y="2" width="76" height="56" rx="2"/>}
        {activeShapeType === 'ellipse'   && <ellipse cx="40" cy="30" rx="38" ry="28"/>}
        {activeShapeType === 'line'      && <line x1="5" y1="55" x2="75" y2="5"/>}
        {activeShapeType === 'arrow'     && <><line x1="5" y1="55" x2="75" y2="5"/><polyline points="52,5 75,5 75,28"/></>}
        {activeShapeType === 'polygon'   && <polygon points="40,3 77,20 65,57 15,57 3,20"/>}
      </svg>
    </div>
  )
  return null
}

function StampDisplay({ el, scale }: { el: StampElement; scale: number }) {
  const c = el.color.startsWith('#') ? el.color : (STAMP_COLOR[el.color] || '#1d4ed8')
  const fs = Math.max(8, Math.round(el.height * scale * 0.34))
  return (
    <div style={{
      width: '100%', height: '100%', border: `2px solid ${c}`, borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: c, fontWeight: 800, fontSize: fs, letterSpacing: '0.05em',
      fontFamily: 'Manrope, sans-serif', transform: 'rotate(-5deg)',
      background: `${c}12`, opacity: el.opacity ?? 1,
    }}>{el.label}</div>
  )
}

function TextDisplay({ el, scale, isEditing, onChange, onDblClick }: {
  el: TextElement; scale: number; isEditing: boolean
  onChange: (t: string) => void; onDblClick: () => void
}) {
  const fs = el.fontSize * scale
  const base: React.CSSProperties = {
    width: '100%', height: '100%', fontSize: fs, fontFamily: el.fontFamily,
    color: el.color, fontWeight: el.bold ? 700 : 400,
    fontStyle: el.italic ? 'italic' : 'normal',
    textDecoration: el.underline ? 'underline' : 'none',
    background: el.bgColor || 'transparent', boxSizing: 'border-box',
  }
  if (isEditing)
    return (
      <textarea autoFocus value={el.text} onChange={e => onChange(e.target.value)}
        onClick={e => e.stopPropagation()}
        style={{ ...base, textAlign: el.align, padding: '2px 4px', lineHeight: 1.4,
          overflow: 'hidden', wordBreak: 'break-word', border: 'none', outline: 'none', resize: 'none', cursor: 'text' }} />
    )
  if (el.align === 'center')
    return (
      <div onDoubleClick={onDblClick}
        style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', cursor: 'move' }}>
        {el.text || <span style={{ opacity: 0.3, fontStyle: 'italic', fontSize: fs * 0.75 }}>Aa</span>}
      </div>
    )
  return (
    <div onDoubleClick={onDblClick}
      style={{ ...base, textAlign: el.align, padding: '1px 3px', lineHeight: 1.4,
        overflow: 'hidden', wordBreak: 'break-word', cursor: 'move',
        whiteSpace: 'pre-wrap', minHeight: '1em' }}>
      {el.text || <span style={{ opacity: 0.3, fontStyle: 'italic' }}>Double-click to type…</span>}
    </div>
  )
}

// (Date formatting handled in DatePickerPanel)

// ── Main ─────────────────────────────────────────────────────────────────────
export default function PDFEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)  // kept for compat; primary: canvasRefsMap
  const canvasRefsMap = useRef<Record<string, HTMLCanvasElement | null>>({})
  const pageRefsMap   = useRef<Record<string, HTMLDivElement | null>>({})
  const sidebarListRef = useRef<HTMLDivElement>(null)
  const scrollingSidebar = useRef(false) // guard against feedback loops
  const slotIdxRef = useRef(0)           // stable ref so undo/redo can read current page

  // PDF sources + page slots
  const [sources, setSources]     = useState<PDFSource[]>([])
  const [slots, setSlots]         = useState<PageSlot[]>([])
  const [slotIdx, setSlotIdx]     = useState(0)
  const [scale, setScale]         = useState(1.2)
  const [rendering, setRendering] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Annotation elements
  const [elements, setElements]   = useState<PDFElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [toolMode, setToolMode]     = useState<ToolMode>('select')

  // UI
  const [isDragOver, setIsDragOver]   = useState(false)
  const [showSig, setShowSig]         = useState(false)
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showPanel, setShowPanel]     = useState(true)
  const [showOrganise, setShowOrganise] = useState(false)
  const [showAutoFill, setShowAutoFill] = useState(false)
  const [autoFillFields, setAutoFillFields] = useState<DetectedField[]>([])
  const [aiExistingFilled, setAiExistingFilled] = useState<Record<string, string>>({})
  const [autoFillPageImage, setAutoFillPageImage] = useState('')
  const [showChatFill, setShowChatFill] = useState(false)
  const [vw, setVw]                   = useState(1280)
  // New tool options
  const [activeMarkType, setActiveMarkType] = useState<'tick'|'cross'|'circle'|'square'|'filledbox'>('tick')
  // fieldName → element IDs placed for that field by AI fill
  const aiFieldElementsRef = useRef<Map<string, string[]>>(new Map())
  const [markColor, setMarkColor]           = useState('#1e293b')
  const [markStrokeWidth, setMarkStrokeWidth] = useState(0.5)
  const [activeShapeType, setActiveShapeType] = useState<'rectangle'|'ellipse'|'line'|'arrow'|'polygon'>('rectangle')
  const [shapeStroke, setShapeStroke]       = useState('#1d4ed8')
  const [shapeFill, setShapeFill]           = useState('')
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2)
  const [showMarkMenu, setShowMarkMenu]     = useState(false)
  const [showShapeMenu, setShowShapeMenu]   = useState(false)
  const [showStampMenu, setShowStampMenu]   = useState(false)
  const [customStampText, setCustomStampText] = useState('')
  const [pdfName, setPdfName]         = useState('')
  const [editingName, setEditingName] = useState(false)

  // Undo / redo
  const historyRef = useRef<PDFElement[][]>([[]])
  const histIdxRef = useRef(0)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Keep a stable ref to slots so undo/redo can navigate without deps
  const slotsRef = useRef<PageSlot[]>([])

  const pushHistory = useCallback((els: PDFElement[]) => {
    const h = historyRef.current.slice(0, histIdxRef.current + 1)
    h.push([...els])
    historyRef.current = h
    histIdxRef.current = h.length - 1
    setCanUndo(h.length > 1)
    setCanRedo(false)
  }, [])

  // Find which page slot an undo/redo diff affects, navigate to it, then call onApply
  const applyWithNavigation = useCallback((
    before: PDFElement[],
    after: PDFElement[],
    onApply: () => void,
  ) => {
    const allSlots = slotsRef.current
    if (!allSlots.length) { onApply(); return }

    // Find the slot that changed: element removed, added, or any property change
    const afterMap = new Map(after.map(e => [e.id, e]))
    const beforeIds = new Set(before.map(e => e.id))
    let targetSlotId: string | null = null

    // 1. Element removed (in before, not in after)
    for (const e of before) {
      if (!afterMap.has(e.id)) { targetSlotId = e.pageSlotId; break }
    }
    // 2. Element added (in after, not in before)
    if (!targetSlotId) {
      const beforeMap = new Map(before.map(e => [e.id, e]))
      for (const e of after) {
        if (!beforeIds.has(e.id)) { targetSlotId = e.pageSlotId; break }
      }
    }
    // 3. Any property change on an existing element
    if (!targetSlotId) {
      const beforeMap = new Map(before.map(e => [e.id, e]))
      for (const e of after) {
        const be = beforeMap.get(e.id)
        if (be && JSON.stringify(e) !== JSON.stringify(be)) {
          targetSlotId = e.pageSlotId; break
        }
      }
    }

    if (!targetSlotId) { onApply(); return }
    const targetIdx = allSlots.findIndex(s => s.id === targetSlotId)
    if (targetIdx < 0) { onApply(); return }

    const currentIdx = slotIdxRef.current

    if (targetIdx === currentIdx) {
      // Already on the right page — apply immediately
      onApply()
      return
    }

    // Navigate to the affected page first, then apply after scroll settles
    slotIdxRef.current = targetIdx  // update synchronously to prevent double-navigation
    setSlotIdx(targetIdx)
    const pageEl = pageRefsMap.current[allSlots[targetIdx].id]
    if (pageEl) pageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    // Also sync sidebar
    requestAnimationFrame(() => {
      const list = sidebarListRef.current
      if (!list) return
      const item = list.querySelector(`[data-slot-idx="${targetIdx}"]`) as HTMLElement | null
      if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
    // Apply element change once scroll animation has had time to complete
    setTimeout(onApply, 480)
  }, [])

  const undo = useCallback(() => {
    if (histIdxRef.current <= 0) return
    const before = historyRef.current[histIdxRef.current]
    histIdxRef.current--
    const after  = historyRef.current[histIdxRef.current]
    setCanUndo(histIdxRef.current > 0)
    setCanRedo(true)
    applyWithNavigation(before, after, () => setElements([...after]))
  }, [applyWithNavigation])

  const redo = useCallback(() => {
    if (histIdxRef.current >= historyRef.current.length - 1) return
    const before = historyRef.current[histIdxRef.current]
    histIdxRef.current++
    const after  = historyRef.current[histIdxRef.current]
    setCanUndo(true)
    setCanRedo(histIdxRef.current < historyRef.current.length - 1)
    applyWithNavigation(before, after, () => setElements([...after]))
  }, [applyWithNavigation])

  // Draw tool
  const [drawColor, setDrawColor]           = useState('#1e293b')
  const [drawStrokeWidth, setDrawStrokeWidth] = useState(3)
  const [drawOpacity, setDrawOpacity]       = useState(1)
  const [showDrawMenu, setShowDrawMenu]     = useState(false)
  const [showRotateMenu, setShowRotateMenu] = useState(false)
  const isDrawing   = useRef(false)
  const drawPoints  = useRef<{ x: number; y: number }[]>([])
  const liveDrawEl  = useRef<DrawElement | null>(null)
  const [drawPreviewPts, setDrawPreviewPts] = useState<{ x: number; y: number }[]>([])

  // Watermark
  const [showWmPanel, setShowWmPanel] = useState(false)
  const [wmText, setWmText]           = useState('CONFIDENTIAL')
  const [wmColor, setWmColor]         = useState('#dc2626')
  const [wmOpacity, setWmOpacity]     = useState(0.2)
  const [wmFontSize, setWmFontSize]   = useState(52)
  const [wmRotation, setWmRotation]   = useState(-35)
  const [wmImageSrc, setWmImageSrc]   = useState('')
  const wmImageInput = useRef<HTMLInputElement>(null)

  // Crop tool
  const cropStart = useRef<{ x: number; y: number } | null>(null)
  const [cropDraft, setCropDraft] = useState<{ x: number; y: number; w: number; h: number; slotId: string } | null>(null)
  const cropResizing = useRef<string | null>(null)
  const cropResizeStart = useRef<{ cx: number; cy: number; ox: number; oy: number; ow: number; oh: number } | null>(null)

  // Mark drag-to-place
  const markDragStart = useRef<{ x: number; y: number; slotId: string } | null>(null)
  const [markDraft, setMarkDraft] = useState<{ x: number; y: number; w: number; h: number; slotId: string } | null>(null)

  // Suppress synthesized click that fires ~300ms after touchend on mobile
  const touchFiredRef = useRef(false)

  // Position marker (ghost element at cursor)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number; slotId: string } | null>(null)

  // Per-page hover (for rotate overlay)
  const [hoveredPageIdx, setHoveredPageIdx] = useState<number | null>(null)

  // Stored signature (reuse in same session)
  const [savedSignature, setSavedSignature] = useState<string | null>(null)

  // File inputs
  const pdfInput     = useRef<HTMLInputElement>(null)
  const imgInput     = useRef<HTMLInputElement>(null)
  const mergeInput   = useRef<HTMLInputElement>(null)
  const imgPageInput = useRef<HTMLInputElement>(null)
  // Tracks where to insert when file picker opens from an insert zone (-1 = after current page)
  const insertAtRef  = useRef<number>(-1)

  // Pan tool
  const scrollRef = useRef<HTMLDivElement>(null)
  const panStart  = useRef<{ x: number; y: number; sl: number; st: number } | null>(null)

  // Responsive
  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth)
      setShowSidebar(window.innerWidth >= 768)
      setShowPanel(window.innerWidth >= 1024)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const isMobile = vw < 640
  const isTablet = vw < 1024

  // ── Render current slot ──────────────────────────────────────────────────
  const renderSlot = useCallback(async (slot: PageSlot, sc: number, srcs: PDFSource[], canvas?: HTMLCanvasElement | null) => {
    const c = canvas ?? canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const rot = slot.rotation || 0
    const sw  = rot === 90 || rot === 270

    // Size-aware DPR: use full device DPR when the canvas is small (e.g. fit-to-screen
    // on mobile), but clamp so the total canvas pixel count stays under 3 MP —
    // the safe per-canvas limit on iOS Safari.
    const rawDpr = window.devicePixelRatio || 1
    const cssW = (sw ? slot.baseHeight : slot.baseWidth)  * sc
    const cssH = (sw ? slot.baseWidth  : slot.baseHeight) * sc
    const MAX_PX = 3_000_000
    const dpr = cssW * cssH * rawDpr * rawDpr > MAX_PX
      ? Math.max(1, Math.sqrt(MAX_PX / (cssW * cssH)))
      : rawDpr

    try {
      if (slot.type === 'pdf') {
        const src = srcs.find(s => s.id === slot.sourceId)
        if (!src) return
        const page = await src.doc.getPage(slot.pageNum!)
        const vp = page.getViewport({ scale: sc * dpr, rotation: rot })
        c.width  = Math.round(vp.width)
        c.height = Math.round(vp.height)
        c.style.width  = cssW + 'px'
        c.style.height = cssH + 'px'
        ctx.clearRect(0, 0, c.width, c.height)
        await page.render({ canvasContext: ctx, viewport: vp }).promise
      } else if (slot.type === 'blank') {
        c.width  = Math.round(cssW * dpr)
        c.height = Math.round(cssH * dpr)
        c.style.width  = cssW + 'px'
        c.style.height = cssH + 'px'
        ctx.scale(dpr, dpr)
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, cssW, cssH)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      } else if (slot.type === 'image') {
        await new Promise<void>(res => {
          const img = new Image(); img.onload = () => {
            c.width  = Math.round(cssW * dpr)
            c.height = Math.round(cssH * dpr)
            c.style.width  = cssW + 'px'
            c.style.height = cssH + 'px'
            ctx.scale(dpr, dpr)
            ctx.clearRect(0, 0, cssW, cssH)
            if (rot) {
              ctx.save()
              ctx.translate(cssW / 2, cssH / 2)
              ctx.rotate(rot * Math.PI / 180)
              ctx.drawImage(img, -slot.baseWidth * sc / 2, -slot.baseHeight * sc / 2, slot.baseWidth * sc, slot.baseHeight * sc)
              ctx.restore()
            } else {
              ctx.drawImage(img, 0, 0, cssW, cssH)
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            res()
          }; img.src = slot.imageSrc!
        })
      }
    } catch { /* ignore render errors */ }
  }, [])

  // ── Lazy rendering via IntersectionObserver ──────────────────────────────
  // Only pages near the viewport are rendered at full DPR (max 2×).
  // Off-screen pages are rendered lazily as the user scrolls to them.
  // This keeps quality high on mobile without blowing up canvas memory.
  const lazyObserverRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!slots.length || !sources.length) return

    // Disconnect any previous observer (scale/slots/sources changed)
    lazyObserverRef.current?.disconnect()

    setRendering(true)
    let pendingCount = slots.length

    const onRendered = () => {
      pendingCount--
      if (pendingCount <= 0) setRendering(false)
    }

    lazyObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const slotId = (entry.target as HTMLElement).dataset.slotId
          if (!slotId) return
          if (entry.isIntersecting) {
            const slot = slots.find(s => s.id === slotId)
            const cv   = canvasRefsMap.current[slotId]
            if (slot && cv) {
              renderSlot(slot, scale, sources, cv).then(onRendered)
            } else {
              onRendered()
            }
          }
        })
      },
      {
        // Pre-render 600px above and below the visible area so scrolling feels instant
        root: scrollRef.current,
        rootMargin: '600px 0px',
        threshold: 0,
      },
    )

    // Observe every page div — the observer fires immediately for visible ones
    slots.forEach(slot => {
      const el = pageRefsMap.current[slot.id]
      if (el) lazyObserverRef.current!.observe(el)
      else onRendered() // element not yet in DOM, skip count
    })

    return () => lazyObserverRef.current?.disconnect()
  }, [slots, scale, sources, renderSlot])

  // When slotIdx changes clear selection
  useEffect(() => {
    setSelectedId(null); setEditingId(null)
  }, [slotIdx])

  // ── Load PDF ─────────────────────────────────────────────────────────────
  const loadInitialPDF = async (file: File) => {
    setUploading(true); setUploadProgress(5)
    try {
      const lib = await getPdfjs()
      setUploadProgress(15)

      const ab = await file.arrayBuffer()
      setUploadProgress(28)
      const bytes = ab.slice(0)

      const loadingTask = lib.getDocument({ data: ab })
      loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
        if (total) setUploadProgress(28 + Math.round((loaded / total) * 32)) // 28→60
      }
      const doc = await loadingTask.promise
      setUploadProgress(62)

      const srcId = uuidv4()
      const newSrcs: PDFSource[] = [{ id: srcId, doc, bytes, name: file.name }]
      setSources(newSrcs)

      const newSlots: PageSlot[] = []
      for (let i = 1; i <= doc.numPages; i++) {
        const pg = await doc.getPage(i)
        const vp = pg.getViewport({ scale: 1 })
        const s: PageSlot = {
          id: uuidv4(), type: 'pdf', sourceId: srcId, pageNum: i,
          baseWidth: vp.width, baseHeight: vp.height, thumbUrl: '',
        }
        s.thumbUrl = await makeThumb(s, newSrcs)
        newSlots.push(s)
        setUploadProgress(62 + Math.round((i / doc.numPages) * 33)) // 62→95
      }
      setUploadProgress(100)
      await new Promise(r => setTimeout(r, 350))

      setSlots(newSlots); setSlotIdx(0); setElements([])
      setPdfName(file.name.replace(/\.pdf$/i, ''))
    } finally {
      setUploading(false); setUploadProgress(0)
    }
  }

  const mergePDF = async (file: File) => {
    const insertBefore = insertAtRef.current >= 0 ? insertAtRef.current : -1
    insertAtRef.current = -1
    const lib = await getPdfjs()
    const ab = await file.arrayBuffer()
    const bytes = ab.slice(0)
    const doc = await lib.getDocument({ data: ab }).promise
    const srcId = uuidv4()
    const newSrc: PDFSource = { id: srcId, doc, bytes, name: file.name }
    const allSrcs = [...sources, newSrc]
    setSources(allSrcs)

    const newSlots: PageSlot[] = []
    for (let i = 1; i <= doc.numPages; i++) {
      const pg = await doc.getPage(i)
      const vp = pg.getViewport({ scale: 1 })
      const s: PageSlot = {
        id: uuidv4(), type: 'pdf', sourceId: srcId, pageNum: i,
        baseWidth: vp.width, baseHeight: vp.height, thumbUrl: '',
      }
      s.thumbUrl = await makeThumb(s, allSrcs)
      newSlots.push(s)
    }
    if (insertBefore >= 0) {
      setSlots(prev => { const n = [...prev]; n.splice(insertBefore, 0, ...newSlots); return n })
      setSlotIdx(insertBefore)
    } else {
      setSlots(prev => [...prev, ...newSlots])
    }
  }

  // ── File handlers ────────────────────────────────────────────────────────
  const handlePDFFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) loadInitialPDF(f); e.target.value = ''
  }
  const handleMergeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) mergePDF(f); e.target.value = ''
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') loadInitialPDF(f)
  }

  // ── Add image element ────────────────────────────────────────────────────
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const slot0 = slots[slotIdx]
      const cx = slot0 ? slot0.baseWidth  / 2 - 100 : 100
      const cy = slot0 ? slot0.baseHeight / 2 - 75  : 100
      const el: ImageElement = {
        id: uuidv4(), type: 'image',
        x: Math.max(0, cx), y: Math.max(0, cy), width: 200, height: 150,
        src, opacity: 1, pageSlotId: slots[slotIdx]?.id ?? '',
      }
      setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
      setSelectedId(el.id)
      setToolMode('select')
    }
    reader.readAsDataURL(f); e.target.value = ''
  }

  // ── Draw tool event handlers ──────────────────────────────────────────────
  const handleDrawStart = useCallback((e: React.MouseEvent<HTMLDivElement>, slotId: string) => {
    if (toolMode !== 'draw') return
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale
    isDrawing.current = true
    drawPoints.current = [{ x, y }]
    setDrawPreviewPts([{ x, y }])
  }, [toolMode, scale])

  const handleDrawMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing.current || toolMode !== 'draw') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale
    drawPoints.current = [...drawPoints.current, { x, y }]
    setDrawPreviewPts([...drawPoints.current])
  }, [toolMode, scale])

  const handleDrawEnd = useCallback((slotId: string) => {
    if (!isDrawing.current || toolMode !== 'draw') return
    isDrawing.current = false
    const pts = drawPoints.current
    if (pts.length < 2) { setDrawPreviewPts([]); return }
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const el: DrawElement = {
      id: uuidv4(), type: 'draw',
      x: minX, y: minY,
      width: Math.max(4, maxX - minX),
      height: Math.max(4, maxY - minY),
      points: pts, color: drawColor,
      strokeWidth: drawStrokeWidth, opacity: drawOpacity,
      pageSlotId: slotId,
    }
    setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
    setSelectedId(el.id)
    setDrawPreviewPts([])
    drawPoints.current = []
  }, [toolMode, drawColor, drawStrokeWidth, drawOpacity, pushHistory])

  const handleDrawTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>, slotId: string) => {
    if (toolMode !== 'draw') return
    e.stopPropagation()
    const t = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (t.clientX - rect.left) / scale
    const y = (t.clientY - rect.top) / scale
    isDrawing.current = true
    drawPoints.current = [{ x, y }]
    setDrawPreviewPts([{ x, y }])
  }, [toolMode, scale])

  const handleDrawTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawing.current || toolMode !== 'draw') return
    e.preventDefault()
    const t = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (t.clientX - rect.left) / scale
    const y = (t.clientY - rect.top) / scale
    drawPoints.current = [...drawPoints.current, { x, y }]
    setDrawPreviewPts([...drawPoints.current])
  }, [toolMode, scale])

  // ── Add image as new page ────────────────────────────────────────────────
  const handleImagePage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const insertBefore = insertAtRef.current >= 0 ? insertAtRef.current : slotIdx + 1
    insertAtRef.current = -1
    const reader = new FileReader()
    reader.onload = async () => {
      const src = reader.result as string
      const img = new Image(); img.src = src
      await new Promise(res => { img.onload = res })
      const s: PageSlot = {
        id: uuidv4(), type: 'image', imageSrc: src,
        baseWidth: img.naturalWidth, baseHeight: img.naturalHeight, thumbUrl: '',
      }
      s.thumbUrl = await makeThumb(s, sources)
      setSlots(prev => { const next = [...prev]; next.splice(insertBefore, 0, s); return next })
      setSlotIdx(insertBefore)
    }
    reader.readAsDataURL(f); e.target.value = ''
  }

  // Opener helpers used by insert zones
  const openImagePageAt = useCallback((insertBefore: number) => {
    insertAtRef.current = insertBefore; imgPageInput.current?.click()
  }, [])
  const openMergePDFAt = useCallback((insertBefore: number) => {
    insertAtRef.current = insertBefore; mergeInput.current?.click()
  }, [])

  // ── Signature ────────────────────────────────────────────────────────────
  const handleSignatureApply = (dataUrl: string) => {
    const slot0 = slots[slotIdx]
    const cx = slot0 ? slot0.baseWidth  / 2 - 100 : 100
    const cy = slot0 ? slot0.baseHeight / 2 - 40  : 100
    const el: SignatureElement = {
      id: uuidv4(), type: 'signature',
      x: Math.max(0, cx), y: Math.max(0, cy), width: 200, height: 80,
      src: dataUrl, pageSlotId: slots[slotIdx]?.id ?? '',
    }
    setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
    setSavedSignature(dataUrl)
    setSelectedId(el.id); setShowSig(false)
  }

  // ── Page management ───────────────────────────────────────────────────────
  const addBlankPage = async () => {
    const s: PageSlot = {
      id: uuidv4(), type: 'blank', baseWidth: 595, baseHeight: 842, thumbUrl: '',
    }
    s.thumbUrl = await makeThumb(s, sources)
    setSlots(prev => { const n = [...prev]; n.splice(slotIdx + 1, 0, s); return n })
    setSlotIdx(slotIdx + 1)
  }

  const duplicatePage = async (idx: number) => {
    const orig = slots[idx]
    const newSlot: PageSlot = { ...orig, id: uuidv4() }
    const origElems = elements.filter(e => e.pageSlotId === orig.id)
    const newElems = origElems.map(e => ({ ...e, id: uuidv4(), pageSlotId: newSlot.id }))
    setSlots(prev => { const n = [...prev]; n.splice(idx + 1, 0, newSlot); return n })
    setElements(prev => [...prev, ...newElems])
    setSlotIdx(idx + 1)
  }

  const deletePage = (idx: number) => {
    if (slots.length === 1) return
    const slot = slots[idx]
    setSlots(prev => prev.filter((_, i) => i !== idx))
    setElements(prev => prev.filter(e => e.pageSlotId !== slot.id))
    setSlotIdx(Math.max(0, idx === slotIdx ? idx - 1 : slotIdx > idx ? slotIdx - 1 : slotIdx))
  }

  const movePage = (idx: number, dir: 'up' | 'down') => {
    const to = dir === 'up' ? idx - 1 : idx + 1
    if (to < 0 || to >= slots.length) return
    setSlots(prev => { const n = [...prev]; [n[idx], n[to]] = [n[to], n[idx]]; return n })
    setSlotIdx(to)
  }

  const rotatePage = async (idx: number) => {
    const cur = slots[idx]
    const newRot = (((cur.rotation || 0) + 90) % 360) as 0 | 90 | 180 | 270
    const updated = { ...cur, rotation: newRot }
    const thumb = await makeThumb(updated, sources)
    setSlots(prev => prev.map((s, i) => i === idx ? { ...updated, thumbUrl: thumb } : s))
  }

  const rotateAllPages = async () => {
    const updated = await Promise.all(slots.map(async slot => {
      const newRot = (((slot.rotation || 0) + 90) % 360) as 0 | 90 | 180 | 270
      const u = { ...slot, rotation: newRot }
      u.thumbUrl = await makeThumb(u, sources)
      return u
    }))
    setSlots(updated)
  }

  const addPageAfter = async (idx: number) => {
    const s: PageSlot = { id: uuidv4(), type: 'blank', baseWidth: 595, baseHeight: 842, thumbUrl: '' }
    s.thumbUrl = await makeThumb(s, sources)
    setSlots(prev => { const n = [...prev]; n.splice(idx + 1, 0, s); return n })
    setSlotIdx(idx + 1)
  }

  const addPageAtStart = async () => {
    const s: PageSlot = { id: uuidv4(), type: 'blank', baseWidth: 595, baseHeight: 842, thumbUrl: '' }
    s.thumbUrl = await makeThumb(s, sources)
    setSlots(prev => [s, ...prev])
    setSlotIdx(0)
  }

  const addPageBefore = async (idx: number) => {
    if (idx === 0) { addPageAtStart(); return }
    const s: PageSlot = { id: uuidv4(), type: 'blank', baseWidth: 595, baseHeight: 842, thumbUrl: '' }
    s.thumbUrl = await makeThumb(s, sources)
    setSlots(prev => { const n = [...prev]; n.splice(idx, 0, s); return n })
    setSlotIdx(idx)
  }

  const addPageAtEnd = async () => {
    const s: PageSlot = { id: uuidv4(), type: 'blank', baseWidth: 595, baseHeight: 842, thumbUrl: '' }
    s.thumbUrl = await makeThumb(s, sources)
    setSlots(prev => { const n = [...prev, s]; setSlotIdx(n.length - 1); return n })
  }

  const handleReorder = (newSlots: PageSlot[], newIdx: number) => {
    setSlots(newSlots)
    setSlotIdx(newIdx)
    setShowOrganise(false)
  }

  // ── AI Auto Fill ────────────────────────────────────────────────────────────
  const loadPageFields = useCallback(async () => {
    const slot = slots[slotIdx]
    if (!slot || slot.type !== 'pdf' || !slot.sourceId || !slot.pageNum) {
      setAutoFillFields([])
      setAiExistingFilled({})
      setAutoFillPageImage('')
      return
    }

    const detectedFields: DetectedField[] = []
    let pageImage = ''
    const src = sources.find(s => s.id === slot.sourceId)
    if (src) {
      try {
        const page = await src.doc.getPage(slot.pageNum)
        const viewport = page.getViewport({ scale: 1 })
        const annotations = await page.getAnnotations()
        annotations.forEach((ann: any) => {
          if (ann.subtype !== 'Widget' || !ann.fieldName) return
          const isComb = ann.fieldType === 'Tx' && !!(ann.fieldFlags & (1 << 24))
          const fieldName = ann.alternativeText || ann.fieldName
          const isSigByName = /signature|sign here|initials/i.test(fieldName)
          const fieldType =
            ann.fieldType === 'Sig' || isSigByName ? 'signature' :
            ann.fieldType === 'Btn' ? 'checkbox' :
            ann.fieldType === 'Ch'  ? 'dropdown' :
            isComb ? 'char_box' : 'text'
          detectedFields.push({
            name: fieldName,
            type: fieldType,
            rect: ann.rect,
            pageNum: slot.pageNum!,
            pageHeight: viewport.height,
            ...(isComb && ann.maxLen ? { isComb: true, maxLen: ann.maxLen } : {}),
          })
        })

        try {
          const renderVp = page.getViewport({ scale: 1.5 })
          const canvas   = document.createElement('canvas')
          canvas.width   = renderVp.width
          canvas.height  = renderVp.height
          const ctx = canvas.getContext('2d')!
          await page.render({ canvasContext: ctx, viewport: renderVp }).promise
          pageImage = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]
        } catch { /* ignore render errors */ }
      } catch { /* page might not support annotations */ }
    }

    const existingFilled: Record<string, string> = {}
    const tol = 4
    for (const field of detectedFields) {
      const [x1, y1, x2, y2] = field.rect
      const fieldTop = field.pageHeight - y2
      const fieldBot = field.pageHeight - y1
      if (field.type === 'checkbox') {
        const markEl = elements.find(e =>
          e.type === 'mark' && e.pageSlotId === slot.id &&
          e.x >= x1 - tol && e.x <= x2 + tol &&
          e.y >= fieldTop - tol && e.y <= fieldBot + tol
        )
        if (markEl && markEl.type === 'mark') {
          existingFilled[field.name] = markEl.markType
          // Register existing mark so AI fill replaces it instead of stacking on top
          aiFieldElementsRef.current.set(field.name,
            [...(aiFieldElementsRef.current.get(field.name) ?? []), markEl.id])
        }
      } else if (field.isComb && field.maxLen) {
        const charEls = elements
          .filter(e =>
            e.type === 'text' && e.pageSlotId === slot.id &&
            e.x >= x1 - tol && e.x <= x2 + tol &&
            e.y >= fieldTop - tol && e.y <= fieldBot + tol
          )
          .sort((a, b) => a.x - b.x)
        if (charEls.length > 0) {
          existingFilled[field.name] = charEls.map(e => e.type === 'text' ? e.text : '').join('')
          aiFieldElementsRef.current.set(field.name, charEls.map(e => e.id))
        }
      } else {
        const textEl = elements.find(e =>
          e.type === 'text' && e.pageSlotId === slot.id &&
          e.x >= x1 - tol && e.x <= x2 + tol &&
          e.y >= fieldTop - tol && e.y <= fieldBot + tol
        )
        if (textEl && textEl.type === 'text') {
          existingFilled[field.name] = textEl.text
          aiFieldElementsRef.current.set(field.name,
            [...(aiFieldElementsRef.current.get(field.name) ?? []), textEl.id])
        }
      }
    }

    setAutoFillFields(detectedFields)
    setAiExistingFilled(existingFilled)
    setAutoFillPageImage(pageImage)
  }, [slots, slotIdx, sources, elements])

  const openAutoFill = useCallback(async () => {
    await loadPageFields()
    setShowAutoFill(true)
  }, [loadPageFields])

  const openChatFill = useCallback(async () => {
    await loadPageFields()
    setShowChatFill(true)
  }, [loadPageFields])

  const applyAutoFill = useCallback((filled: FilledField[]) => {
    // fieldName → new elements built for that field this run
    const perField = new Map<string, PDFElement[]>()

    filled.forEach(({ name, value }) => {
      if (!value.trim()) return
      const els: PDFElement[] = []
      const field = autoFillFields.find(f => f.name === name)

      if (!field) {
        // No detected field — place near current page centre
        const slot = slots[slotIdx]
        if (!slot) return
        els.push({
          id: uuidv4(), type: 'text',
          x: slot.baseWidth / 2 - 100, y: slot.baseHeight / 2,
          width: 200, height: 30,
          text: value, fontSize: 12, fontFamily: 'Inter', color: '#000',
          bold: false, italic: false, underline: false, align: 'left', bgColor: '',
          pageSlotId: slot.id,
        } as TextElement)
        perField.set(name, els)
        return
      }

      const slot = slots.find(s => s.type === 'pdf' && s.pageNum === field.pageNum)
      if (!slot) return

      const [x1, y1, x2, y2] = field.rect
      const pdfW = Math.max(16, x2 - x1)
      const pdfH = Math.max(16, y2 - y1)
      const upNudge = Math.max(1, pdfH * 0.1)
      const pdfY = field.pageHeight - y2 - upNudge

      // ── Signature ────────────────────────────────────────────────────────
      if (field.type === 'signature') {
        if (!value.startsWith('data:image')) return
        els.push({
          id: uuidv4(), type: 'signature',
          x: x1, y: pdfY, width: pdfW, height: pdfH + upNudge,
          src: value, pageSlotId: slot.id,
        } as SignatureElement)

      // ── Checkbox ─────────────────────────────────────────────────────────
      } else if (field.type === 'checkbox') {
        const isChecked = /^(tick|filledbox|yes|true|1|check|checked|on|selected)$/i.test(value.trim())
        // Use actual field dimensions (no forced minimum) so tick stays inside the box
        const cbW = x2 - x1
        const cbH = y2 - y1
        const inset = Math.max(0.5, Math.min(cbW, cbH) * 0.08)
        const strokeWidth = 1.5
        els.push({
          id: uuidv4(), type: 'mark',
          x: x1 + inset, y: (field.pageHeight - y2) + inset,
          width: cbW - inset * 2, height: cbH - inset * 2,
          markType: isChecked ? 'tick' : 'cross',
          color: '#1a2e5a', strokeWidth, pageSlotId: slot.id,
        } as MarkElement)

      // ── Comb / character-box ──────────────────────────────────────────────
      } else if (field.isComb && field.maxLen && field.maxLen > 1) {
        const cellW = (x2 - x1) / field.maxLen
        const fontSize = Math.max(8, Math.min(18, Math.round(pdfH * 0.68)))
        const elemH = pdfH + upNudge
        value.replace(/[\s\/\-\.]/g, '').split('').slice(0, field.maxLen).forEach((char, i) => {
          els.push({
            id: uuidv4(), type: 'text',
            x: x1 + i * cellW, y: pdfY, width: cellW, height: elemH,
            text: char, fontSize, fontFamily: 'Inter', color: '#000',
            bold: false, italic: false, underline: false, align: 'center', bgColor: '',
            pageSlotId: slot.id,
          } as TextElement)
        })

      // ── Regular text ──────────────────────────────────────────────────────
      } else {
        const fontSize = Math.max(7, Math.min(13, Math.round(pdfH * 0.55)))
        const baseElemH = pdfH + upNudge

        // ── Date DD/MM/YYYY → single centred element spanning the whole field ─
        // The form's pre-printed "/" separators sit inside each Day/Month column,
        // so splitting into 3 elements always merges the digit with its slash.
        // Placing the full "09/12/1998" centred lets the "/" in the value coincide
        // with the form's separator marks naturally.
        const dateParts = value.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/)
        if (dateParts) {
          const dateStr = dateParts[1].padStart(2, '0') + '/' + dateParts[2].padStart(2, '0') + '/' + dateParts[3]
          // Shrink font if needed so 10-char date fits the field width
          const dateFontSize = Math.min(fontSize, Math.max(7, Math.floor(pdfW / (dateStr.length * 0.6))))
          els.push({
            id: uuidv4(), type: 'text',
            x: x1, y: pdfY, width: pdfW, height: baseElemH,
            text: dateStr, fontSize: dateFontSize, fontFamily: 'Inter', color: '#000',
            bold: false, italic: false, underline: false, align: 'center', bgColor: '',
            pageSlotId: slot.id,
          } as TextElement)
        } else {
          // Normal text — estimate height for multi-line values
          const lineH = fontSize * 1.4
          const charsPerLine = Math.max(1, Math.floor(pdfW / (fontSize * 0.52)))
          let estimatedLines = 0
          for (const line of value.split('\n')) {
            estimatedLines += Math.max(1, Math.ceil(line.length / charsPerLine))
          }
          const elemH = Math.max(baseElemH, estimatedLines * lineH + 4)
          const adjustedY = pdfY - (estimatedLines > 1 ? upNudge : 0)
          els.push({
            id: uuidv4(), type: 'text',
            x: x1, y: adjustedY, width: Math.max(40, pdfW), height: elemH,
            text: value, fontSize, fontFamily: 'Inter', color: '#000',
            bold: false, italic: false, underline: false, align: 'left', bgColor: '',
            pageSlotId: slot.id,
          } as TextElement)
        }
      }

      if (els.length > 0) perField.set(name, els)
    })

    if (perField.size === 0) return

    // Collect old element IDs only for the fields being updated this run
    const oldIdsToRemove = new Set<string>()
    perField.forEach((_, fieldName) => {
      const prev = aiFieldElementsRef.current.get(fieldName) || []
      prev.forEach(id => oldIdsToRemove.add(id))
    })

    // Update per-field tracking (merge — untouched fields keep their old IDs)
    perField.forEach((els, fieldName) => {
      aiFieldElementsRef.current.set(fieldName, els.map(e => e.id))
    })

    const allNew = Array.from(perField.values()).flat()
    setElements(prev => {
      const withoutOld = prev.filter(e => !oldIdsToRemove.has(e.id))
      const next = [...withoutOld, ...allNew]
      pushHistory(next)
      return next
    })
    setToolMode('select')
  }, [autoFillFields, slots, slotIdx, pushHistory])

  // ── Pan tool helpers (also triggered by middle mouse button) ────────────────
  const handlePanDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (toolMode !== 'pan' && e.button !== 1) return
    const el = scrollRef.current; if (!el) return
    panStart.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop }
    e.preventDefault()
  }
  const handlePanMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panStart.current) return
    const el = scrollRef.current; if (!el) return
    el.scrollLeft = panStart.current.sl - (e.clientX - panStart.current.x)
    el.scrollTop  = panStart.current.st - (e.clientY - panStart.current.y)
  }
  const handlePanUp = () => { panStart.current = null }

  // ── Canvas click → place element ─────────────────────────────────────────
  const handlePlaceAtCoords = useCallback((x: number, y: number, slotId: string) => {
    if (toolMode === 'text') {
      const el: TextElement = {
        id: uuidv4(), type: 'text', x, y, width: 220, height: 50,
        text: '', fontSize: 14, fontFamily: 'Inter', color: '#1b1c1c',
        bold: false, italic: false, underline: false, align: 'left', bgColor: '',
        pageSlotId: slotId,
      }
      setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
      setSelectedId(el.id); setEditingId(el.id); setToolMode('select')
    } else if (toolMode === 'highlight') {
      const el: HighlightElement = {
        id: uuidv4(), type: 'highlight', x, y, width: 200, height: 22,
        color: '#fef08a', opacity: 0.5, pageSlotId: slotId,
      }
      setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
      setSelectedId(el.id); setToolMode('select')
    } else if (toolMode === 'mark') {
      const el: MarkElement = {
        id: uuidv4(), type: 'mark', x: x - 12, y: y - 12, width: 24, height: 24,
        markType: activeMarkType, color: markColor, strokeWidth: markStrokeWidth,
        pageSlotId: slotId,
      }
      setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
      setSelectedId(el.id); setToolMode('select')
    } else if (toolMode === 'annotation') {
      const el: AnnotationElement = {
        id: uuidv4(), type: 'annotation', x, y, width: 160, height: 90,
        text: '', color: '#fef9c3', pageSlotId: slotId,
      }
      setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
      setSelectedId(el.id); setEditingId(el.id); setToolMode('select')
    } else if (toolMode === 'shape') {
      const el: ShapeElement = {
        id: uuidv4(), type: 'shape', x, y, width: 150, height: 100,
        shapeType: activeShapeType, strokeColor: shapeStroke,
        fillColor: shapeFill, strokeWidth: shapeStrokeWidth,
        pageSlotId: slotId,
      }
      setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
      setSelectedId(el.id); setToolMode('select')
    } else {
      setSelectedId(null); setEditingId(null)
    }
  }, [toolMode, activeMarkType, markColor, markStrokeWidth, activeShapeType, shapeStroke, shapeFill, shapeStrokeWidth, pushHistory])

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>, slotId: string) => {
    if (!slots.length) return
    const target = e.target as HTMLElement
    if (target.tagName !== 'CANVAS' && target !== e.currentTarget) return
    const rect = e.currentTarget.getBoundingClientRect()
    handlePlaceAtCoords((e.clientX - rect.left) / scale, (e.clientY - rect.top) / scale, slotId)
  }, [slots, scale, handlePlaceAtCoords])

  const handleOverlayTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>, slotId: string) => {
    if (!slots.length) return
    const t = e.changedTouches[0]
    if (!t) return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    handlePlaceAtCoords((t.clientX - rect.left) / scale, (t.clientY - rect.top) / scale, slotId)
  }, [slots, scale, handlePlaceAtCoords])

  // ── Date insertion ────────────────────────────────────────────────────────
  const insertDate = (text: string) => {
    const slot0 = slots[slotIdx]
    const cx = slot0 ? slot0.baseWidth  / 2 - 80 : 100
    const cy = slot0 ? slot0.baseHeight / 2 - 12 : 100
    const el: TextElement = {
      id: uuidv4(), type: 'text', x: Math.max(0, cx), y: Math.max(0, cy),
      width: 220, height: 28, text,
      fontSize: 13, fontFamily: 'Inter', color: '#1b1c1c',
      bold: false, italic: false, underline: false, align: 'left', bgColor: '',
      pageSlotId: slots[slotIdx]?.id ?? '',
    }
    setElements(prev => [...prev, el]); setSelectedId(el.id); setShowDateMenu(false)
  }

  const handleAddStamp = (label: string, color: string) => {
    const slot0 = slots[slotIdx]
    const cx = slot0 ? slot0.baseWidth  / 2 - 60 : 100
    const cy = slot0 ? slot0.baseHeight / 2 - 24 : 100
    const el: StampElement = {
      id: uuidv4(), type: 'stamp', x: Math.max(0, cx), y: Math.max(0, cy),
      width: 120, height: 48, label, color, opacity: 1, pageSlotId: slots[slotIdx]?.id ?? '',
    }
    setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
    setSelectedId(el.id)
  }

  // ── Watermark (apply to all pages) ────────────────────────────────────────
  const applyWatermark = () => {
    if (!slots.length || (!wmText.trim() && !wmImageSrc)) return
    setElements(prev => {
      const next = [...prev]
      for (const slot of slots) {
        const el: WatermarkElement = {
          id: uuidv4(), type: 'watermark',
          x: 0, y: 0, width: slot.baseWidth, height: slot.baseHeight,
          text: wmText.trim(), color: wmColor, opacity: wmOpacity,
          fontSize: wmFontSize, rotation: wmRotation,
          ...(wmImageSrc ? { imageSrc: wmImageSrc } : {}),
          pageSlotId: slot.id,
        }
        next.push(el)
      }
      pushHistory(next)
      return next
    })
    setShowWmPanel(false)
  }

  // ── Rotate all pages left (CCW) ───────────────────────────────────────────
  const rotateAllPagesLeft = async () => {
    const updated = await Promise.all(slots.map(async slot => {
      const newRot = (((slot.rotation || 0) - 90 + 360) % 360) as 0 | 90 | 180 | 270
      const u = { ...slot, rotation: newRot }
      u.thumbUrl = await makeThumb(u, sources)
      return u
    }))
    setSlots(updated)
  }

  // ── Rotate single page left ───────────────────────────────────────────────
  const rotatePageLeft = async (idx: number) => {
    const cur = slots[idx]
    const newRot = (((cur.rotation || 0) - 90 + 360) % 360) as 0 | 90 | 180 | 270
    const updated = { ...cur, rotation: newRot }
    const thumb = await makeThumb(updated, sources)
    setSlots(prev => prev.map((s, i) => i === idx ? { ...updated, thumbUrl: thumb } : s))
  }

  // ── Crop tool handlers ────────────────────────────────────────────────────
  const handleCropStart = (e: React.MouseEvent<HTMLDivElement>, slotId: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale
    cropStart.current = { x, y }
    setCropDraft({ x, y, w: 0, h: 0, slotId })
    e.stopPropagation()
  }

  const handleCropMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cropStart.current || !cropDraft) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / scale
    const cy = (e.clientY - rect.top) / scale
    const x = Math.min(cx, cropStart.current.x)
    const y = Math.min(cy, cropStart.current.y)
    const w = Math.abs(cx - cropStart.current.x)
    const h = Math.abs(cy - cropStart.current.y)
    setCropDraft(prev => prev ? { ...prev, x, y, w, h } : null)
  }

  const handleCropEnd = async () => {
    if (!cropDraft || cropDraft.w < 10 || cropDraft.h < 10) {
      setCropDraft(null); cropStart.current = null; return
    }
    const { slotId, x, y, w, h } = cropDraft
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, crop: { x, y, w, h } } : s))
    setCropDraft(null); cropStart.current = null
    setToolMode('select')
  }

  const clearCrop = (slotId: string) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, crop: undefined } : s))
  }

  // ── Mark drag-to-place ────────────────────────────────────────────────────
  const handleMarkDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>, slotId: string) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale
    markDragStart.current = { x, y, slotId }
    setMarkDraft({ x, y, w: 0, h: 0, slotId })
  }, [scale])

  const handleMarkDragMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!markDragStart.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / scale
    const cy = (e.clientY - rect.top) / scale
    const x = Math.min(cx, markDragStart.current.x)
    const y = Math.min(cy, markDragStart.current.y)
    const w = Math.abs(cx - markDragStart.current.x)
    const h = Math.abs(cy - markDragStart.current.y)
    setMarkDraft(prev => prev ? { ...prev, x, y, w, h } : null)
  }, [scale])

  const handleMarkDragEnd = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!markDragStart.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / scale
    const cy = (e.clientY - rect.top) / scale
    const dx = cx - markDragStart.current.x
    const dy = cy - markDragStart.current.y
    const slotId = markDragStart.current.slotId
    const isDrag = Math.abs(dx) > 8 || Math.abs(dy) > 8
    let el: MarkElement
    if (isDrag) {
      const x = Math.min(cx, markDragStart.current.x)
      const y = Math.min(cy, markDragStart.current.y)
      el = { id: uuidv4(), type: 'mark', x, y, width: Math.max(16, Math.abs(dx)), height: Math.max(16, Math.abs(dy)), markType: activeMarkType, color: markColor, strokeWidth: markStrokeWidth, pageSlotId: slotId }
    } else {
      el = { id: uuidv4(), type: 'mark', x: markDragStart.current.x - 12, y: markDragStart.current.y - 12, width: 24, height: 24, markType: activeMarkType, color: markColor, strokeWidth: markStrokeWidth, pageSlotId: slotId }
    }
    setElements(prev => { const next = [...prev, el]; pushHistory(next); return next })
    setSelectedId(el.id)
    setToolMode('select')
    markDragStart.current = null
    setMarkDraft(null)
  }, [scale, activeMarkType, markColor, markStrokeWidth, pushHistory])

  // ── Scroll main canvas to a page and scroll sidebar in sync ───────────────
  const scrollToPage = useCallback((idx: number) => {
    const slot = slots[idx]
    if (!slot) return
    const el = pageRefsMap.current[slot.id]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [slots])

  // ── Detect current page from main canvas scroll ───────────────────────────
  const handleMainScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container || slots.length === 0) return
    const cRect = container.getBoundingClientRect()
    const mid = cRect.top + cRect.height / 2
    let bestIdx = 0
    let bestDist = Infinity
    slots.forEach((slot, idx) => {
      const el = pageRefsMap.current[slot.id]
      if (!el) return
      const r = el.getBoundingClientRect()
      const pageMid = (r.top + r.bottom) / 2
      const dist = Math.abs(pageMid - mid)
      if (dist < bestDist) { bestDist = dist; bestIdx = idx }
    })
    if (bestIdx !== slotIdx) {
      scrollingSidebar.current = true
      setSlotIdx(bestIdx)
      setTimeout(() => { scrollingSidebar.current = false }, 400)
    }
  }, [slots, slotIdx])

  // ── Fit current page to screen ────────────────────────────────────────────
  const fitToScreen = () => {
    // Use rAF so dimensions are always post-layout (avoids stale reads on mobile)
    requestAnimationFrame(() => {
      const container = scrollRef.current
      const slot = slots[slotIdx]
      if (!container || !slot) return

      // Scroll container padding: mobile = 8px L/R, 12px T/B; desktop = 24px all
      // Floating zoom bar: bottom:72 on mobile (bottom:18 desktop), ~44px tall
      // So the bar blocks the bottom (72+44)=116px on mobile, (18+44)=62px on desktop
      const hPad = isMobile ? 20  : 56   // horizontal clearance (both sides)
      const vPad = isMobile ? 130 : 90   // top padding + floating bar clearance

      const availW = Math.max(1, container.clientWidth  - hPad)
      const availH = Math.max(1, container.clientHeight - vPad)

      const rot = slot.rotation || 0
      const sw  = rot === 90 || rot === 270
      const pw  = sw ? slot.baseHeight : slot.baseWidth
      const ph  = sw ? slot.baseWidth  : slot.baseHeight
      const newScale = Math.min(availW / pw, availH / ph)
      setScale(Math.max(0.3, Math.min(3.0, parseFloat(newScale.toFixed(2)))))
    })
  }

  // ── Watermark image upload ────────────────────────────────────────────────
  const handleWmImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = () => setWmImageSrc(reader.result as string)
    reader.readAsDataURL(f); e.target.value = ''
  }

  // ── Element operations ────────────────────────────────────────────────────
  const updateEl = useCallback((id: string, updates: Partial<PDFElement>) => {
    setElements(prev => prev.map(e => {
      if (e.id !== id) return e
      // For draw elements, translate all points when x/y changes (points are stored as absolute coords)
      if (e.type === 'draw' && (updates.x !== undefined || updates.y !== undefined)) {
        const dx = (updates.x ?? e.x) - e.x
        const dy = (updates.y ?? e.y) - e.y
        return { ...e, ...updates, points: (e as import('@/types').DrawElement).points.map(p => ({ x: p.x + dx, y: p.y + dy })) } as PDFElement
      }
      return { ...e, ...updates } as PDFElement
    }))
  }, [])
  const deleteEl = useCallback((id: string) => {
    setElements(prev => {
      const next = prev.filter(e => e.id !== id)
      pushHistory(next)
      return next
    })
    setSelectedId(null); setEditingId(null)
  }, [pushHistory])
  const clearPage = () => {
    const slotId = slots[slotIdx]?.id
    setElements(prev => prev.filter(e => e.pageSlotId !== slotId))
    setSelectedId(null); setEditingId(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setEditingId(null); setSelectedId(null); setShowDateMenu(false) }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !editingId)
        deleteEl(selectedId)
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, editingId, deleteEl, undo, redo])

  // ── Scroll sidebar to active page when slotIdx changes or sidebar opens ─────
  const scrollSidebarToSlot = useCallback((idx: number) => {
    const list = sidebarListRef.current
    if (!list) return
    const item = list.querySelector(`[data-slot-idx="${idx}"]`) as HTMLElement | null
    if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => { scrollSidebarToSlot(slotIdx) }, [slotIdx, scrollSidebarToSlot])

  // When mobile sidebar is opened, scroll it to show the current thumbnail
  useEffect(() => {
    if (!showSidebar) return
    requestAnimationFrame(() => scrollSidebarToSlot(slotIdx))
  }, [showSidebar]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep stable refs in sync so undo/redo navigation always has latest values
  useEffect(() => { slotsRef.current  = slots   }, [slots])
  useEffect(() => { slotIdxRef.current = slotIdx }, [slotIdx])

  // ── Auto fit-to-screen when a PDF first loads ────────────────────────────
  const prevSlotsLen = useRef(0)
  useEffect(() => {
    const wasEmpty = prevSlotsLen.current === 0
    prevSlotsLen.current = slots.length
    if (!wasEmpty || slots.length === 0) return
    // Wait one animation frame so the scroll container is laid out
    requestAnimationFrame(() => {
      const slot = slots[0]
      const container = scrollRef.current
      if (!container || !slot) return
      // Same clearance logic as fitToScreen()
      const mobile = container.clientWidth < 640
      const hPad = mobile ? 20  : 56
      const vPad = mobile ? 130 : 90
      const availW = Math.max(1, container.clientWidth  - hPad)
      const availH = Math.max(1, container.clientHeight - vPad)
      const rot = slot.rotation || 0
      const sw  = rot === 90 || rot === 270
      const pw  = sw ? slot.baseHeight : slot.baseWidth
      const ph  = sw ? slot.baseWidth  : slot.baseHeight
      const fitScale = Math.min(availW / pw, availH / ph)
      setScale(Math.max(0.3, Math.min(3.0, parseFloat(fitScale.toFixed(2)))))
    })
  }, [slots]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Crop: auto-initialize to full page when entering crop mode ────────────
  useEffect(() => {
    if (toolMode === 'crop' && slots[slotIdx]) {
      const slot = slots[slotIdx]
      const rot = slot.rotation || 0
      const sw  = rot === 90 || rot === 270
      const w = sw ? slot.baseHeight : slot.baseWidth
      const h = sw ? slot.baseWidth  : slot.baseHeight
      setCropDraft({ x: 0, y: 0, w, h, slotId: slot.id })
    } else {
      setCropDraft(null)
      cropResizing.current = null
    }
  }, [toolMode, slotIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Crop: document-level resize listeners ─────────────────────────────────
  useEffect(() => {
    if (toolMode !== 'crop') return
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!cropResizing.current || !cropResizeStart.current) return
      if ('preventDefault' in e) e.preventDefault()
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
      const { cx: sx, cy: sy, ox, oy, ow, oh } = cropResizeStart.current
      const dx = (clientX - sx) / scale
      const dy = (clientY - sy) / scale
      const hdl = cropResizing.current
      let x = ox, y = oy, w = ow, h = oh
      if (hdl.includes('e')) w = Math.max(10, ow + dx)
      if (hdl.includes('s')) h = Math.max(10, oh + dy)
      if (hdl.includes('w')) { x = ox + dx; w = Math.max(10, ow - dx) }
      if (hdl.includes('n')) { y = oy + dy; h = Math.max(10, oh - dy) }
      setCropDraft(prev => prev ? { ...prev, x, y, w, h } : null)
    }
    const onUp = () => { cropResizing.current = null; cropResizeStart.current = null }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
    document.addEventListener('touchmove', onMove as EventListener, { passive: false })
    document.addEventListener('touchend',  onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
      document.removeEventListener('touchmove', onMove as EventListener)
      document.removeEventListener('touchend',  onUp)
    }
  }, [toolMode, scale])

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!slots.length) return
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
    const out = await PDFDocument.create()
    const libDocs = await Promise.all(sources.map(s => PDFDocument.load(s.bytes)))

    for (let si = 0; si < slots.length; si++) {
      const slot = slots[si]
      let libPage: any

      if (slot.type === 'pdf') {
        const srcIdx = sources.findIndex(s => s.id === slot.sourceId)
        if (srcIdx < 0) continue
        const [cp] = await out.copyPages(libDocs[srcIdx], [slot.pageNum! - 1])
        out.addPage(cp); libPage = out.getPage(out.getPageCount() - 1)
      } else if (slot.type === 'blank') {
        libPage = out.addPage([slot.baseWidth, slot.baseHeight])
        const ctx = libPage as any
        ctx.drawRectangle?.({ x: 0, y: 0, width: slot.baseWidth, height: slot.baseHeight, color: rgb(1, 1, 1) })
      } else if (slot.type === 'image') {
        libPage = out.addPage([slot.baseWidth, slot.baseHeight])
        const b64 = slot.imageSrc!.split(',')[1]
        const imgBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
        const isPng = slot.imageSrc!.startsWith('data:image/png')
        const emb = isPng ? await out.embedPng(imgBytes) : await out.embedJpg(imgBytes)
        libPage.drawImage(emb, { x: 0, y: 0, width: slot.baseWidth, height: slot.baseHeight })
      }
      if (!libPage) continue

      const { width: pW, height: pH } = libPage.getSize()
      const xR = pW / slot.baseWidth, yR = pH / slot.baseHeight
      // Apply crop by restricting the visible MediaBox
      if (slot.crop) {
        const { x: cx, y: cy, w: cw, h: ch } = slot.crop
        libPage.setMediaBox(cx * xR, pH - (cy + ch) * yR, cw * xR, ch * yR)
      }
      const slotElems = elements.filter(e => e.pageSlotId === slot.id)

      for (const el of slotElems) {
        if (el.type === 'text') {
          const fontName =
            el.bold && el.italic ? StandardFonts.HelveticaBoldOblique :
            el.bold ? StandardFonts.HelveticaBold :
            el.italic ? StandardFonts.HelveticaOblique : StandardFonts.Helvetica
          const font = await out.embedFont(fontName)
          const hex = el.color.replace('#', '')
          const r = parseInt(hex.slice(0, 2), 16) / 255
          const g = parseInt(hex.slice(2, 4), 16) / 255
          const b = parseInt(hex.slice(4, 6), 16) / 255
          const fs = el.fontSize * xR
          let dy = pH - el.y * yR - fs
          for (const line of el.text.split('\n')) {
            if (line.trim()) libPage.drawText(line, {
              x: el.x * xR + 4, y: dy, size: fs, font, color: rgb(r, g, b),
              maxWidth: el.width * xR - 8,
            })
            dy -= fs * 1.4
          }
        } else if (el.type === 'image' || el.type === 'signature') {
          try {
            const isPng = el.src.startsWith('data:image/png')
            const imgBytes = Uint8Array.from(atob(el.src.split(',')[1]), c => c.charCodeAt(0))
            const emb = isPng ? await out.embedPng(imgBytes) : await out.embedJpg(imgBytes)
            libPage.drawImage(emb, {
              x: el.x * xR, y: pH - (el.y + el.height) * yR,
              width: el.width * xR, height: el.height * yR,
            })
          } catch { /* skip */ }
        } else if (el.type === 'stamp') {
          const c = el.color.startsWith('#') ? el.color : (STAMP_COLOR[el.color] || '#1d4ed8')
          const h = c.replace('#', '')
          const r = parseInt(h.slice(0, 2), 16) / 255
          const g = parseInt(h.slice(2, 4), 16) / 255
          const b = parseInt(h.slice(4, 6), 16) / 255
          const font = await out.embedFont(StandardFonts.HelveticaBold)
          const pX = el.x * xR, pY = pH - (el.y + el.height) * yR
          const pW2 = el.width * xR, pH2 = el.height * yR
          libPage.drawRectangle({ x: pX, y: pY, width: pW2, height: pH2, borderColor: rgb(r, g, b), borderWidth: 1.5, color: rgb(r, g, b), opacity: 0.05 })
          const fs = Math.min(pH2 * 0.38, 13)
          libPage.drawText(el.label, { x: pX + pW2 / 2 - el.label.length * fs * 0.28, y: pY + pH2 / 2 - fs / 2, size: fs, font, color: rgb(r, g, b) })
        } else if (el.type === 'highlight') {
          const h = el.color.replace('#', '')
          const r = parseInt(h.slice(0, 2), 16) / 255
          const g = parseInt(h.slice(2, 4), 16) / 255
          const b = parseInt(h.slice(4, 6), 16) / 255
          libPage.drawRectangle({
            x: el.x * xR, y: pH - (el.y + el.height) * yR,
            width: el.width * xR, height: el.height * yR,
            color: rgb(r, g, b), opacity: el.opacity,
          })
        } else if (el.type === 'mark') {
          const mh = el.color.replace('#', '')
          const mr = parseInt(mh.slice(0,2),16)/255, mg = parseInt(mh.slice(2,4),16)/255, mb = parseInt(mh.slice(4,6),16)/255
          const msw = Math.max(1, el.strokeWidth * Math.min(xR, yR))
          const mx = el.x*xR, my = pH-(el.y+el.height)*yR, mw = el.width*xR, mhh = el.height*yR
          if (el.markType === 'tick') {
            libPage.drawLine({ start:{x:mx+mw*0.1,y:my+mhh*0.45}, end:{x:mx+mw*0.38,y:my+mhh*0.2}, thickness:msw, color:rgb(mr,mg,mb) })
            libPage.drawLine({ start:{x:mx+mw*0.38,y:my+mhh*0.2}, end:{x:mx+mw*0.9,y:my+mhh*0.8}, thickness:msw, color:rgb(mr,mg,mb) })
          } else if (el.markType === 'cross') {
            libPage.drawLine({ start:{x:mx+mw*0.1,y:my+mhh*0.9}, end:{x:mx+mw*0.9,y:my+mhh*0.1}, thickness:msw, color:rgb(mr,mg,mb) })
            libPage.drawLine({ start:{x:mx+mw*0.9,y:my+mhh*0.9}, end:{x:mx+mw*0.1,y:my+mhh*0.1}, thickness:msw, color:rgb(mr,mg,mb) })
          } else if (el.markType === 'square') {
            libPage.drawRectangle({ x:mx+msw/2, y:my+msw/2, width:Math.max(1,mw-msw), height:Math.max(1,mhh-msw), borderColor:rgb(mr,mg,mb), borderWidth:msw, color:rgb(1,1,1), opacity:0 })
          } else if (el.markType === 'filledbox') {
            libPage.drawRectangle({ x:mx, y:my, width:Math.max(1,mw), height:Math.max(1,mhh), color:rgb(mr,mg,mb) })
          } else {
            libPage.drawEllipse({ x:mx+mw*0.5, y:my+mhh*0.5, xScale:mw*0.42, yScale:mhh*0.42, borderColor:rgb(mr,mg,mb), borderWidth:msw })
          }
        } else if (el.type === 'annotation') {
          const af = await out.embedFont(StandardFonts.Helvetica)
          const ax=el.x*xR, ay=pH-(el.y+el.height)*yR, aw=el.width*xR, ah=el.height*yR
          libPage.drawRectangle({x:ax,y:ay,width:aw,height:ah,color:rgb(1,0.976,0.765),borderColor:rgb(0.8,0.75,0.2),borderWidth:0.8})
          const afs = Math.min(9*xR, 10)
          const alines = el.text.split('\n'); let ady = ay+ah-afs*1.8
          for (const ln of alines) { if (ady<ay) break; if(ln.trim()) libPage.drawText(ln,{x:ax+4,y:ady,size:afs,font:af,color:rgb(0.1,0.1,0.1),maxWidth:aw-8}); ady-=afs*1.4 }
        } else if (el.type === 'shape') {
          const sh=el.strokeColor.replace('#','')
          const sr=parseInt(sh.slice(0,2),16)/255, sg=parseInt(sh.slice(2,4),16)/255, sb=parseInt(sh.slice(4,6),16)/255
          const ssw=Math.max(0.5,el.strokeWidth*Math.min(xR,yR))
          const spx=el.x*xR, spy=pH-(el.y+el.height)*yR, spw=el.width*xR, sph=el.height*yR
          const hasFill=!!el.fillColor
          const fhx=hasFill?el.fillColor.replace('#',''):'ffffff'
          const fr=parseInt(fhx.slice(0,2),16)/255, fg=parseInt(fhx.slice(2,4),16)/255, fb=parseInt(fhx.slice(4,6),16)/255
          if (el.shapeType==='rectangle') {
            libPage.drawRectangle({x:spx,y:spy,width:spw,height:sph,borderColor:rgb(sr,sg,sb),borderWidth:ssw,...(hasFill?{color:rgb(fr,fg,fb)}:{color:rgb(1,1,1),opacity:0})})
          } else if (el.shapeType==='ellipse') {
            libPage.drawEllipse({x:spx+spw/2,y:spy+sph/2,xScale:spw/2,yScale:sph/2,borderColor:rgb(sr,sg,sb),borderWidth:ssw,...(hasFill?{color:rgb(fr,fg,fb)}:{color:rgb(1,1,1),opacity:0})})
          } else if (el.shapeType==='line'||el.shapeType==='arrow') {
            libPage.drawLine({start:{x:spx,y:spy},end:{x:spx+spw,y:spy+sph},thickness:ssw,color:rgb(sr,sg,sb)})
            if (el.shapeType==='arrow') {
              const ang2=Math.atan2(sph,spw), hs2=Math.min(spw,sph)*0.25+6
              libPage.drawLine({start:{x:spx+spw,y:spy+sph},end:{x:spx+spw-hs2*Math.cos(ang2-0.45),y:spy+sph-hs2*Math.sin(ang2-0.45)},thickness:ssw,color:rgb(sr,sg,sb)})
              libPage.drawLine({start:{x:spx+spw,y:spy+sph},end:{x:spx+spw-hs2*Math.cos(ang2+0.45),y:spy+sph-hs2*Math.sin(ang2+0.45)},thickness:ssw,color:rgb(sr,sg,sb)})
            }
          }
        }
      }
    }

    const bytes = await out.save()
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${pdfName || sources[0]?.name?.replace(/\.pdf$/i,'') || 'document'}.pdf`; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentSlot = slots[slotIdx] ?? null
  const pageElems = elements.filter(e => e.pageSlotId === currentSlot?.id)
  const selectedEl = selectedId ? elements.find(e => e.id === selectedId) ?? null : null

  const tbStyle = (active: boolean, isSign = false): React.CSSProperties => ({
    width: 48, height: 48, borderRadius: 13, border: 'none', cursor: 'pointer', flexShrink: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
    transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
    background: active ? (isSign ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#818cf8)') : (isSign ? 'rgba(245,158,11,0.08)' : 'transparent'),
    color: active ? '#fff' : (isSign ? '#f59e0b' : '#64748b'),
    boxShadow: active ? (isSign ? '0 3px 12px rgba(245,158,11,0.4)' : '0 3px 12px rgba(99,102,241,0.4)') : 'none',
  })
  const tbVDiv: React.CSSProperties = { width: 1, height: 32, background: '#e2e8f0', margin: '0 3px', flexShrink: 0 }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#f8faff', color: '#1e293b',
      fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden',
    }}>
      {/* Hidden file inputs */}
      <input ref={pdfInput}      type="file" accept=".pdf"    onChange={handlePDFFile}    style={{ display: 'none' }} />
      <input ref={imgInput}      type="file" accept="image/*" onChange={handleImageFile}  style={{ display: 'none' }} />
      <input ref={mergeInput}    type="file" accept=".pdf"    onChange={handleMergeFile}  style={{ display: 'none' }} />
      <input ref={imgPageInput}  type="file" accept="image/*" onChange={handleImagePage}  style={{ display: 'none' }} />
      <input ref={wmImageInput}  type="file" accept="image/*" onChange={handleWmImageFile} style={{ display: 'none' }} />

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${isMobile ? 12 : 18}px`, height: 52, flexShrink: 0,
        background: '#0c1220',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        gap: 10,
      }}>
        {/* Logo + file */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {/* Mobile sidebar toggle */}
          {isMobile && (
            <button onClick={() => setShowSidebar(v => !v)}
              style={mobileIconBtn}>☰</button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 30, height: 30,
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99,102,241,0.45)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            {!isMobile && (
              <span style={{ fontWeight: 800, fontSize: 14.5, color: '#fff', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em' }}>
                Lithograph
              </span>
            )}
          </div>
          {sources.length > 0 && (
            editingName ? (
              <input
                autoFocus
                value={pdfName}
                onChange={e => setPdfName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingName(false) }}
                style={{
                  fontSize: isMobile ? 12 : 11.5, color: '#fff',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.4)', borderRadius: 6,
                  padding: '3px 8px', outline: 'none',
                  maxWidth: isMobile ? 140 : isTablet ? 130 : 220,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                title="Rename PDF"
                style={{
                  fontSize: isMobile ? 12 : 11.5,
                  color: 'rgba(255,255,255,0.65)', background: 'transparent',
                  border: '1px solid transparent', borderRadius: 6,
                  padding: isMobile ? '4px 8px' : '2px 7px',
                  cursor: 'pointer',
                  maxWidth: isMobile ? 140 : isTablet ? 140 : 240,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent' }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pdfName || sources[0]?.name || ''}
                </span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5, flexShrink: 0 }}>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            )
          )}
        </div>



        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!isMobile && (
            <button onClick={() => pdfInput.current?.click()} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Open PDF
            </button>
          )}
          <button onClick={handleExport} disabled={!slots.length}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 15px',
              borderRadius: 8, border: 'none',
              background: slots.length ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'rgba(255,255,255,0.12)',
              color: '#fff', fontSize: 12, fontWeight: 700,
              cursor: slots.length ? 'pointer' : 'not-allowed',
              opacity: slots.length ? 1 : 0.45,
              boxShadow: slots.length ? '0 2px 10px rgba(99,102,241,0.4)' : 'none',
              transition: 'all 0.15s',
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {isMobile ? 'Export' : 'Export PDF'}
          </button>
          {/* Mobile properties toggle */}
          {isMobile && (
            <button onClick={() => setShowPanel(v => !v)} style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>⚙</button>
          )}
          {/* Tablet panel toggle */}
          {isTablet && !isMobile && (
            <button onClick={() => setShowPanel(v => !v)} style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: showPanel ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {showPanel ? '✕' : '⚙'}
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Page sidebar */}
        {(showSidebar || !isMobile) && slots.length > 0 && (
          <div style={isMobile ? {
            position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 100,
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          } : { display: 'flex', height: '100%' }}>
            <PageSidebar
              pageSlots={slots}
              currentSlotIdx={slotIdx}
              onPageChange={i => { setSlotIdx(i); scrollToPage(i); isMobile && setShowSidebar(false) }}
              sidebarListRef={sidebarListRef}
              onDuplicate={duplicatePage}
              onDelete={deletePage}
              onMoveUp={i => movePage(i, 'up')}
              onMoveDown={i => movePage(i, 'down')}
              onRotate={rotatePage}
              onRotateLeft={rotatePageLeft}
              onAddBelow={addPageAfter}
              onOrganise={() => setShowOrganise(true)}
              onGoToFirst={() => { setSlotIdx(0); scrollToPage(0) }}
              onGoToLast={() => { const last = slots.length - 1; setSlotIdx(last); scrollToPage(last) }}
              onAddAtStart={addPageAtStart}
              onAddAtEnd={addPageAtEnd}
              onAddImageAt={openImagePageAt}
              onAddPDFAt={openMergePDFAt}
            />
          </div>
        )}

        {/* Canvas workspace */}
        <main style={{
          flex: 1, background: '#edf0f7',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', position: 'relative',
        }}>

          {/* ── TOP HORIZONTAL TOOLBAR (desktop only) ── */}
          {slots.length > 0 && !isMobile && (
            <div style={{ position:'relative', zIndex:50 }}>
              <div style={{
                display:'flex', alignItems:'center', gap:2,
                background:'#fff', borderBottom:'1px solid #e8ecf5',
                padding:'4px 10px', overflowX:'auto',
                boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                flexShrink:0,
              }}>
                {/* Undo / Redo */}
                <button title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}
                  style={{...tbStyle(false),opacity:canUndo?1:0.35}}
                  onMouseEnter={e=>{if(canUndo)(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M3 13A9 9 0 1021 12"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Undo</span>
                </button>
                <button title="Redo (Ctrl+Y)" onClick={redo} disabled={!canRedo}
                  style={{...tbStyle(false),opacity:canRedo?1:0.35}}
                  onMouseEnter={e=>{if(canRedo)(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M21 13A9 9 0 113 12"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Redo</span>
                </button>
                <div style={tbVDiv}/>
                {/* Select */}
                <button title="Select" style={tbStyle(toolMode==='select')} onClick={()=>{setToolMode('select');setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='select')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='select')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-7 1-3 7z"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Select</span>
                </button>
                {/* Pan */}
                <button title="Pan" style={tbStyle(toolMode==='pan')} onClick={()=>{setToolMode('pan');setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='pan')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='pan')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V8a2 2 0 00-4 0v1M14 9V7a2 2 0 00-4 0v5M10 10V6a2 2 0 00-4 0v9a7 7 0 0014 0v-3a2 2 0 00-4 0"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Pan</span>
                </button>
                <div style={tbVDiv}/>
                {/* Text */}
                <button title="Text" style={tbStyle(toolMode==='text')} onClick={()=>{setToolMode('text');setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='text')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='text')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Text</span>
                </button>
                {/* Annotation */}
                <button title="Sticky Note" style={tbStyle(toolMode==='annotation')} onClick={()=>{setToolMode('annotation');setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='annotation')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='annotation')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8z"/><polyline points="16 3 16 8 21 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Note</span>
                </button>
                {/* Highlight */}
                <button title="Highlight" style={tbStyle(toolMode==='highlight')} onClick={()=>{setToolMode('highlight');setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='highlight')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='highlight')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Highlight</span>
                </button>
                {/* Draw / Pencil */}
                <button title="Draw / Pencil" style={{...tbStyle(toolMode==='draw'),position:'relative'}} onClick={()=>{setToolMode('draw');setShowDrawMenu(v=>!v);setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='draw')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='draw')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Draw</span>
                </button>
                {/* Eraser */}
                <button title="Eraser – tap any element to delete it" style={{...tbStyle(toolMode==='eraser'),color:toolMode==='eraser'?'#dc2626':'inherit'}} onClick={()=>{setToolMode(toolMode==='eraser'?'select':'eraser');setShowMarkMenu(false);setShowShapeMenu(false);setShowDrawMenu(false);setShowStampMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='eraser')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='eraser')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16l10-10 7 7-3.5 3.5"/><path d="M6.5 17.5l4-4"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Erase</span>
                </button>
                <div style={tbVDiv}/>
                {/* Mark */}
                <button title="Tick / Cross / Circle" style={{...tbStyle(toolMode==='mark'),position:'relative'}} onClick={()=>{setToolMode('mark');setShowMarkMenu(v=>!v);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='mark')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='mark')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  {activeMarkType==='tick'   && <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  {activeMarkType==='cross'  && <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                  {activeMarkType==='circle' && <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/></svg>}
                  {activeMarkType==='square'    && <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
                  {activeMarkType==='filledbox' && <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Mark</span>
                </button>
                {/* Shapes */}
                <button title="Shapes" style={{...tbStyle(toolMode==='shape'),position:'relative'}} onClick={()=>{setToolMode('shape');setShowShapeMenu(v=>!v);setShowMarkMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='shape')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='shape')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><circle cx="17" cy="17" r="4"/><line x1="3" y1="21" x2="9" y2="15"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Shape</span>
                </button>
                <div style={tbVDiv}/>
                {/* Image */}
                <button title="Image" style={tbStyle(toolMode==='image')} onClick={()=>{setToolMode('image');imgInput.current?.click();setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='image')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='image')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Image</span>
                </button>
                {/* Signature */}
                <button title="Signature" style={tbStyle(false,true)} onClick={()=>{setShowSig(true);setToolMode('select');setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(245,158,11,0.18)'}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(245,158,11,0.08)'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Sign</span>
                </button>
                <div style={tbVDiv}/>
                {/* Stamp */}
                <button title="Stamps" style={{...tbStyle(showStampMenu),position:'relative'}} onClick={()=>{setShowStampMenu(v=>!v);setShowMarkMenu(false);setShowShapeMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(!showStampMenu)(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(!showStampMenu)(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M19 10H5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2z"/><rect x="9" y="2" width="6" height="8" rx="1"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Stamp</span>
                </button>
                {/* Watermark */}
                <button title="Watermark (all pages)" style={tbStyle(showWmPanel)} onClick={()=>{setShowWmPanel(v=>!v);setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false)}} onMouseEnter={e=>{if(!showWmPanel)(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(!showWmPanel)(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10l2 4 2-4 2 4 2-4 2 4"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Watermark</span>
                </button>
                {/* AI Auto Fill */}
                <button
                  title="AI Auto Fill — fill PDF form fields with Claude"
                  disabled={!slots.length}
                  style={{
                    ...tbStyle(showAutoFill),
                    background: showAutoFill ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'transparent',
                    color: showAutoFill ? '#fff' : '#475569',
                    border: '1px solid transparent',
                    position: 'relative',
                  }}
                  onClick={() => { if (slots.length) openAutoFill() }}
                  onMouseEnter={e => { if (!showAutoFill) (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9' }}
                  onMouseLeave={e => { if (!showAutoFill) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/>
                    <path d="M18 2v6"/><path d="M21 5h-6"/>
                  </svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>AI Fill</span>
                </button>
                {/* AI Chat Fill */}
                <button
                  title="AI Chat Fill — conversational form filling"
                  disabled={!slots.length}
                  style={{
                    ...tbStyle(showChatFill),
                    background: showChatFill ? 'linear-gradient(135deg,#0ea5e9,#38bdf8)' : 'transparent',
                    color: showChatFill ? '#fff' : '#475569',
                    border: '1px solid transparent',
                  }}
                  onClick={() => { if (slots.length) openChatFill() }}
                  onMouseEnter={e => { if (!showChatFill) (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9' }}
                  onMouseLeave={e => { if (!showChatFill) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Chat Fill</span>
                </button>
                {/* Date */}
                <button title="Insert Date" style={tbStyle(showDateMenu)} onClick={()=>{setShowDateMenu(v=>!v);setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(!showDateMenu)(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(!showDateMenu)(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Date</span>
                </button>
                <div style={tbVDiv}/>
                {/* Crop */}
                <button title="Crop Page" style={tbStyle(toolMode==='crop')} onClick={()=>{setToolMode('crop');setShowMarkMenu(false);setShowShapeMenu(false);setShowStampMenu(false);setShowDrawMenu(false);setShowWmPanel(false)}} onMouseEnter={e=>{if(toolMode!=='crop')(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{if(toolMode!=='crop')(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Crop</span>
                </button>
                {/* Rotate All Left */}
                <button title="Rotate All Pages Left (CCW)" style={tbStyle(false)} onClick={rotateAllPagesLeft} onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Rot ←</span>
                </button>
                {/* Rotate All Right */}
                <button title="Rotate All Pages Right (CW)" style={tbStyle(false)} onClick={rotateAllPages} onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                  <span style={{fontSize:8,fontWeight:700,color:'inherit',lineHeight:1}}>Rot →</span>
                </button>
              </div>

              {/* ── Sub-menus (drop-down from toolbar) ── */}
              {/* Mark sub-menu */}
              {toolMode==='mark' && showMarkMenu && (
                <div style={{position:'absolute',top:'100%',left:0,zIndex:200,background:'#fff',borderRadius:'0 0 14px 14px',padding:'14px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',border:'1px solid #e8ecf5',minWidth:220,display:'flex',gap:16,flexWrap:'wrap'}}>
                  <div>
                    <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Type</p>
                    <div style={{display:'flex',gap:7}}>
                      {([
                        {mt:'tick'   as const, icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>},
                        {mt:'cross'  as const, icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>},
                        {mt:'circle' as const, icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/></svg>},
                        {mt:'square'    as const, icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>},
                        {mt:'filledbox' as const, icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>},
                      ]).map(({mt,icon})=>(
                        <button key={mt} onClick={()=>setActiveMarkType(mt)} style={{width:44,height:36,borderRadius:9,border:`1.5px solid ${activeMarkType===mt?'#6366f1':'#e2e8f0'}`,background:activeMarkType===mt?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:activeMarkType===mt?'#fff':'#475569',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.15s'}}>
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Color</p>
                    <div style={{display:'flex',gap:5,flexWrap:'wrap',maxWidth:180}}>
                      {['#16a34a','#dc2626','#1d4ed8','#7c3aed','#ea580c','#0e7490','#1e293b','#f59e0b'].map(c=>(
                        <button key={c} onClick={()=>setMarkColor(c)} style={{width:22,height:22,borderRadius:'50%',background:c,border:'none',cursor:'pointer',outline:markColor===c?'2.5px solid #6366f1':'2px solid transparent',outlineOffset:2}}/>
                      ))}
                      <input type="color" value={markColor} onChange={e=>setMarkColor(e.target.value)} style={{width:22,height:22,border:'none',borderRadius:4,cursor:'pointer',padding:1}}/>
                    </div>
                  </div>
                  <div style={{minWidth:160}}>
                    <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Thickness {markStrokeWidth}px</p>
                    <input type="range" min={0.5} max={20} step={0.5} value={markStrokeWidth}
                      onChange={e=>setMarkStrokeWidth(parseFloat(e.target.value))}
                      style={{width:'100%',minWidth:0,accentColor:'#6366f1',cursor:'pointer'}}/>
                  </div>
                </div>
              )}
              {/* Shape sub-menu */}
              {toolMode==='shape' && showShapeMenu && (
                <div style={{position:'absolute',top:'100%',left:0,zIndex:200,background:'#fff',borderRadius:'0 0 14px 14px',padding:'14px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',border:'1px solid #e8ecf5',display:'flex',gap:16,flexWrap:'wrap'}}>
                  <div>
                    <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Shape</p>
                    <div style={{display:'flex',gap:5}}>
                      {([{t:'rectangle' as const,icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>},{t:'ellipse' as const,icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><ellipse cx="12" cy="12" rx="10" ry="7"/></svg>},{t:'line' as const,icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>},{t:'arrow' as const,icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="9 5 19 5 19 15"/></svg>},{t:'polygon' as const,icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polygon points="12,3 21,8.5 21,15.5 12,21 3,15.5 3,8.5"/></svg>}]).map(({t,icon})=>(
                        <button key={t} title={t} onClick={()=>setActiveShapeType(t)} style={{width:38,height:38,borderRadius:9,border:`1.5px solid ${activeShapeType===t?'#6366f1':'#e2e8f0'}`,background:activeShapeType===t?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:activeShapeType===t?'#fff':'#475569',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.15s'}}>{icon}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:12,alignItems:'flex-end'}}>
                    <div>
                      <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.06em',textTransform:'uppercase'}}>Stroke</p>
                      <input type="color" value={shapeStroke} onChange={e=>setShapeStroke(e.target.value)} style={{width:36,height:28,border:'none',borderRadius:5,cursor:'pointer',padding:2}}/>
                    </div>
                    <div>
                      <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.06em',textTransform:'uppercase'}}>Fill</p>
                      <div style={{display:'flex',alignItems:'center',gap:5}}>
                        <input type="color" value={shapeFill||'#ffffff'} onChange={e=>setShapeFill(e.target.value)} style={{width:36,height:28,border:'none',borderRadius:5,cursor:'pointer',padding:2}}/>
                        <button onClick={()=>setShapeFill('')} style={{fontSize:10,color:shapeFill?'#475569':'#6366f1',border:'none',background:'transparent',cursor:'pointer',fontWeight:shapeFill?400:700,padding:'2px 4px'}}>None</button>
                      </div>
                    </div>
                    <div>
                      <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.06em',textTransform:'uppercase'}}>Width</p>
                      <div style={{display:'flex',gap:4}}>
                        {[1,2,4].map(w=><button key={w} onClick={()=>setShapeStrokeWidth(w)} style={{width:32,height:28,borderRadius:7,fontSize:11,fontWeight:700,border:`1.5px solid ${shapeStrokeWidth===w?'#6366f1':'#e2e8f0'}`,background:shapeStrokeWidth===w?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:shapeStrokeWidth===w?'#fff':'#475569',cursor:'pointer'}}>{w}px</button>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Draw sub-menu */}
              {toolMode==='draw' && showDrawMenu && (
                <div style={{position:'absolute',top:'100%',left:0,zIndex:200,background:'#fff',borderRadius:'0 0 14px 14px',padding:'14px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',border:'1px solid #e8ecf5',display:'flex',gap:14,alignItems:'flex-end',flexWrap:'wrap'}}>
                  <div>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Color</p>
                    <input type="color" value={drawColor} onChange={e=>setDrawColor(e.target.value)} style={{width:36,height:28,border:'none',borderRadius:5,cursor:'pointer',padding:2}}/>
                  </div>
                  <div>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Width</p>
                    <div style={{display:'flex',gap:4}}>
                      {[2,4,8].map(w=><button key={w} onClick={()=>setDrawStrokeWidth(w)} style={{width:34,height:28,borderRadius:7,fontSize:11,fontWeight:700,border:`1.5px solid ${drawStrokeWidth===w?'#6366f1':'#e2e8f0'}`,background:drawStrokeWidth===w?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:drawStrokeWidth===w?'#fff':'#475569',cursor:'pointer'}}>{w}px</button>)}
                    </div>
                  </div>
                  <div style={{minWidth:110}}>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Opacity {Math.round(drawOpacity*100)}%</p>
                    <input type="range" min={0.1} max={1} step={0.05} value={drawOpacity} onChange={e=>setDrawOpacity(parseFloat(e.target.value))} style={{width:'100%'}}/>
                  </div>
                </div>
              )}
              {/* Stamp sub-menu */}
              {showStampMenu && (
                <div style={{position:'absolute',top:'100%',left:0,zIndex:200,background:'#fff',borderRadius:'0 0 14px 14px',padding:'14px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',border:'1px solid #e8ecf5',minWidth:320}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5,marginBottom:10}}>
                    {[{label:'APPROVED',color:'#16a34a'},{label:'REJECTED',color:'#dc2626'},{label:'DRAFT',color:'#1d4ed8'},{label:'CONFIDENTIAL',color:'#7c3aed'},{label:'URGENT',color:'#ea580c'},{label:'COMPLETED',color:'#0e7490'},{label:'VOID',color:'#64748b'},{label:'RECEIVED',color:'#0284c7'},{label:'PAID',color:'#16a34a'},{label:'REVIEWED',color:'#d97706'},{label:'NOT APPROVED',color:'#dc2626'},{label:'COPY',color:'#475569'}].map(({label,color})=>(
                      <button key={label} onClick={()=>{handleAddStamp(label,color);setShowStampMenu(false)}} style={{padding:'4px 6px',borderRadius:6,border:`1.5px solid ${color}`,background:`${color}12`,color,fontSize:8,fontWeight:800,cursor:'pointer',letterSpacing:'0.04em',textAlign:'center'}}>{label}</button>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <input value={customStampText} onChange={e=>setCustomStampText(e.target.value.toUpperCase())} placeholder="CUSTOM STAMP" maxLength={20} style={{flex:1,padding:'5px 8px',borderRadius:7,border:'1px solid #e2e8f0',fontSize:11,fontWeight:700,fontFamily:'Manrope,sans-serif',outline:'none',letterSpacing:'0.05em'}}/>
                    <button onClick={()=>{if(customStampText.trim()){handleAddStamp(customStampText.trim(),'#475569');setShowStampMenu(false);setCustomStampText('')}}} style={{padding:'5px 12px',borderRadius:7,border:'none',background:'linear-gradient(135deg,#6366f1,#818cf8)',color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer'}}>Add</button>
                  </div>
                </div>
              )}
              {/* Watermark panel */}
              {showWmPanel && (
                <div style={{position:'absolute',top:'100%',left:0,zIndex:200,background:'#fff',borderRadius:'0 0 14px 14px',padding:'14px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',border:'1px solid #e8ecf5',display:'flex',gap:14,alignItems:'flex-end',flexWrap:'wrap',minWidth:480}}>
                  {/* Tabs: Text / Image */}
                  <div style={{width:'100%',display:'flex',gap:6,marginBottom:2}}>
                    <button onClick={()=>setWmImageSrc('')}
                      style={{padding:'4px 12px',borderRadius:6,border:'none',fontSize:11,fontWeight:700,cursor:'pointer',background:!wmImageSrc?'linear-gradient(135deg,#6366f1,#818cf8)':'#f1f5f9',color:!wmImageSrc?'#fff':'#64748b'}}>
                      Text Watermark
                    </button>
                    <button onClick={()=>wmImageInput.current?.click()}
                      style={{padding:'4px 12px',borderRadius:6,border:'none',fontSize:11,fontWeight:700,cursor:'pointer',background:wmImageSrc?'linear-gradient(135deg,#6366f1,#818cf8)':'#f1f5f9',color:wmImageSrc?'#fff':'#64748b',display:'flex',alignItems:'center',gap:5}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      Image Watermark{wmImageSrc ? ' ✓' : ''}
                    </button>
                    {wmImageSrc && <button onClick={()=>setWmImageSrc('')} style={{padding:'4px 8px',borderRadius:6,border:'1px solid #fca5a5',background:'#fff1f2',color:'#dc2626',fontSize:10,fontWeight:700,cursor:'pointer'}}>Remove</button>}
                  </div>
                  {/* Preview */}
                  {wmImageSrc && <div style={{width:'100%',height:48,display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                    <img src={wmImageSrc} alt="wm" style={{height:44,maxWidth:120,objectFit:'contain',borderRadius:4,border:'1px solid #e2e8f0',opacity:wmOpacity}} />
                    <span style={{fontSize:10,color:'#94a3b8'}}>Image preview (opacity applied)</span>
                  </div>}
                  {/* Text (only if no image) */}
                  {!wmImageSrc && <div>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Text</p>
                    <input value={wmText} onChange={e=>setWmText(e.target.value.toUpperCase())} placeholder="WATERMARK TEXT" maxLength={30} style={{padding:'5px 10px',borderRadius:7,border:'1px solid #e2e8f0',fontSize:12,fontWeight:700,fontFamily:'Manrope,sans-serif',outline:'none',letterSpacing:'0.05em',width:160}}/>
                  </div>}
                  {!wmImageSrc && <div>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Color</p>
                    <input type="color" value={wmColor} onChange={e=>setWmColor(e.target.value)} style={{width:36,height:28,border:'none',borderRadius:5,cursor:'pointer',padding:2}}/>
                  </div>}
                  <div style={{minWidth:100}}>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Opacity {Math.round(wmOpacity*100)}%</p>
                    <input type="range" min={0.05} max={0.8} step={0.05} value={wmOpacity} onChange={e=>setWmOpacity(parseFloat(e.target.value))} style={{width:'100%'}}/>
                  </div>
                  {!wmImageSrc && <div style={{minWidth:90}}>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Size {wmFontSize}pt</p>
                    <input type="range" min={20} max={120} step={4} value={wmFontSize} onChange={e=>setWmFontSize(parseInt(e.target.value))} style={{width:'100%'}}/>
                  </div>}
                  <div style={{minWidth:90}}>
                    <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Angle {wmRotation}°</p>
                    <input type="range" min={-90} max={90} step={5} value={wmRotation} onChange={e=>setWmRotation(parseInt(e.target.value))} style={{width:'100%'}}/>
                  </div>
                  <button onClick={applyWatermark} style={{padding:'7px 16px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366f1,#818cf8)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Apply to All Pages</button>
                </div>
              )}
              {/* Date panel */}
              {showDateMenu && <DatePickerPanel onInsert={insertDate} onClose={()=>setShowDateMenu(false)} isMobile={false} panelStyle={{position:'absolute',top:'100%',left:0,minWidth:290,zIndex:200}}/>}
            </div>
          )}

          {!slots.length ? (
            /* Drop zone / upload area */
            <div
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: isMobile ? 16 : 32, position: 'relative',
                background: uploading
                  ? 'linear-gradient(135deg,#f0f4ff 0%,#f5f3ff 100%)'
                  : isDragOver
                  ? 'linear-gradient(135deg,#eff6ff 0%,#ede9fe 100%)'
                  : '#edf0f7',
                transition: 'background 0.3s',
              }}
              onDragOver={e => { if (!uploading) { e.preventDefault(); setIsDragOver(true) } }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                /* ── Loading state ── */
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
                  maxWidth: 360, width: '100%',
                  background: '#fff', borderRadius: 28, padding: isMobile ? '36px 24px' : '52px 48px',
                  boxShadow: '0 12px 48px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  {/* Circular progress ring */}
                  <div style={{ position: 'relative', width: 108, height: 108 }}>
                    <svg width="108" height="108" viewBox="0 0 108 108" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
                      <circle cx="54" cy="54" r="46" stroke="#e2e8f0" strokeWidth="7" fill="none"/>
                      <circle cx="54" cy="54" r="46" stroke="url(#uploadGrad)" strokeWidth="7" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 46}`}
                        strokeDashoffset={`${2 * Math.PI * 46 * (1 - uploadProgress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.28s ease' }}
                      />
                      <defs>
                        <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#818cf8"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 1,
                    }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#6366f1', fontFamily: 'Manrope, sans-serif', lineHeight: 1 }}>
                        {uploadProgress}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>%</span>
                    </div>
                  </div>

                  {/* Status + progress bar */}
                  <div style={{ width: '100%' }}>
                    <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#1e293b', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
                      {uploadProgress < 30 ? 'Reading file…'
                        : uploadProgress < 65 ? 'Parsing document…'
                        : uploadProgress < 97 ? 'Generating previews…'
                        : 'Almost done!'}
                    </p>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${uploadProgress}%`,
                        background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                        borderRadius: 999,
                        transition: 'width 0.25s ease',
                        boxShadow: '0 0 10px rgba(99,102,241,0.45)',
                      }} />
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                      Please wait while we process your PDF
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Drop zone UI ── */
                <div
                  onClick={() => pdfInput.current?.click()}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
                    padding: isMobile ? '32px 24px' : '56px 64px',
                    borderRadius: 28, cursor: 'pointer',
                    maxWidth: 500, width: '100%', textAlign: 'center',
                    background: isDragOver
                      ? 'linear-gradient(135deg,rgba(99,102,241,0.07),rgba(139,92,246,0.07))'
                      : 'rgba(255,255,255,0.95)',
                    border: `2px dashed ${isDragOver ? '#6366f1' : '#c7d2fe'}`,
                    boxShadow: isDragOver
                      ? '0 0 0 4px rgba(99,102,241,0.1), 0 16px 48px rgba(99,102,241,0.18)'
                      : '0 4px 28px rgba(0,0,0,0.07)',
                    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                    transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {/* Icon */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 84, height: 84,
                      background: isDragOver
                        ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                        : 'linear-gradient(135deg, #eef2ff, #ede9fe)',
                      borderRadius: 24,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isDragOver
                        ? '0 10px 30px rgba(99,102,241,0.45)'
                        : '0 4px 18px rgba(99,102,241,0.14)',
                      transition: 'all 0.22s',
                    }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                        stroke={isDragOver ? '#fff' : '#6366f1'}
                        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="12" x2="12" y2="18"/>
                        <polyline points="9 15 12 18 15 15"/>
                      </svg>
                    </div>
                    {isDragOver && (
                      <div style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#22c55e', boxShadow: '0 2px 10px rgba(34,197,94,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <p style={{ margin: 0, fontSize: isMobile ? 17 : 20, fontWeight: 800, color: '#0f172a', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em' }}>
                      {isDragOver ? 'Drop to open!' : 'Open a PDF to edit'}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.55 }}>
                      {isMobile ? 'Tap to browse your files' : 'Click to browse · or drag & drop here'}
                    </p>
                  </div>

                  {/* Feature pills */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 360 }}>
                    {[
                      ['T', 'Text'], ['✏', 'Draw'], ['◻', 'Shapes'],
                      ['▬', 'Highlight'], ['✍', 'Sign'], ['⊕', 'Stamp'], ['💧', 'Watermark'],
                    ].map(([icon, label]) => (
                      <span key={label} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 11px', borderRadius: 20,
                        background: 'rgba(99,102,241,0.07)',
                        border: '1px solid rgba(99,102,241,0.18)',
                        fontSize: 11.5, fontWeight: 600, color: '#6366f1',
                      }}>{icon} {label}</span>
                    ))}
                  </div>

                  <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
                    PDF files supported · max 50 MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Multi-page scroll area */
            <div
              ref={scrollRef}
              style={{
                flex: 1, overflow: 'auto', padding: isMobile ? '12px 8px' : '24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
                cursor: toolMode === 'pan' ? (panStart.current ? 'grabbing' : 'grab') : undefined,
              }}
              onScroll={handleMainScroll}
              onMouseDown={handlePanDown}
              onMouseMove={handlePanMove}
              onMouseUp={handlePanUp}
              onMouseLeave={handlePanUp}
            >
              {rendering && (
                <div style={{
                  position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
                  padding: '7px 14px', background: '#fff', borderRadius: 20,
                  fontSize: 12, color: '#1d4ed8', fontWeight: 600, zIndex: 60,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Loading…
                </div>
              )}

              {/* Insert zone before first page */}
              <CanvasInsertZone
                onInsertBlank={addPageAtStart}
                onInsertImage={() => openImagePageAt(0)}
                onInsertPDF={() => openMergePDFAt(0)}
                isMobile={isMobile}
              />

              {slots.map((slot, idx) => {
                const slotElems = elements.filter(e => e.pageSlotId === slot.id)
                const isActive = idx === slotIdx
                const isCropping = toolMode === 'crop'
                // Only apply crop clipping when not actively cropping (so user sees full page while selecting)
                const hasCrop = !!slot.crop && !isCropping
                const drawCursor = toolMode === 'eraser' ? 'cell' : ['text','highlight','mark','annotation','shape','crop','draw'].includes(toolMode) ? 'crosshair' : toolMode === 'pan' ? 'inherit' : 'default'
                return (
                  <React.Fragment key={slot.id}>
                  <div
                    ref={el => { pageRefsMap.current[slot.id] = el }}
                    data-slot-id={slot.id}
                    style={{
                      position: 'relative', display: 'inline-block', flexShrink: 0,
                      overflow: hasCrop ? 'hidden' : 'visible',
                      ...(hasCrop ? { width: slot.crop!.w * scale, height: slot.crop!.h * scale } : {}),
                      boxShadow: isActive
                        ? '0 0 0 3px #6366f1, 0 12px 48px rgba(99,102,241,0.22)'
                        : '0 4px 24px rgba(0,0,0,0.14)',
                      borderRadius: 2,
                      cursor: drawCursor,
                    }}
                    onClick={() => { setSlotIdx(idx) }}
                    onMouseEnter={() => setHoveredPageIdx(idx)}
                    onMouseLeave={() => setHoveredPageIdx(null)}
                  >
                    {/* Inner content – offset when crop is applied */}
                    <div style={{
                      position: 'relative',
                      ...(hasCrop ? { marginLeft: -slot.crop!.x * scale, marginTop: -slot.crop!.y * scale } : {}),
                    }}>
                      <canvas
                        ref={el => {
                          canvasRefsMap.current[slot.id] = el
                          if (isActive) (canvasRef as React.MutableRefObject<HTMLCanvasElement|null>).current = el
                        }}
                        style={{ display: 'block' }}
                      />
                      {/* Elements overlay */}
                      <div
                        style={{ position: 'absolute', inset: 0, pointerEvents: toolMode === 'draw' ? 'auto' : 'none',
                          cursor: toolMode === 'draw' ? 'crosshair' : undefined,
                          touchAction: toolMode === 'draw' ? 'none' : undefined }}
                        onMouseDown={toolMode === 'draw' ? (e => { handleDrawStart(e, slot.id) }) : undefined}
                        onMouseMove={toolMode === 'draw' ? handleDrawMove : undefined}
                        onMouseUp={toolMode === 'draw' ? (() => handleDrawEnd(slot.id)) : undefined}
                        onMouseLeave={toolMode === 'draw' ? (() => { if (isDrawing.current) handleDrawEnd(slot.id) }) : undefined}
                        onTouchStart={toolMode === 'draw' ? (e => { handleDrawTouchStart(e, slot.id) }) : undefined}
                        onTouchMove={toolMode === 'draw' ? handleDrawTouchMove : undefined}
                        onTouchEnd={toolMode === 'draw' ? (() => handleDrawEnd(slot.id)) : undefined}
                      >
                        {slotElems.map(el => (
                          <div key={el.id} style={{ position: 'absolute', pointerEvents: ['pan','draw','crop','text','highlight','mark','annotation','shape'].includes(toolMode) ? 'none' : 'auto',
                            cursor: toolMode === 'eraser' ? 'cell' : undefined }}>
                            <DraggableElement
                              element={el} isSelected={selectedId === el.id} scale={scale}
                              onSelect={id => {
                                if (toolMode === 'eraser') { deleteEl(id); return }
                                setSelectedId(id); setEditingId(null); setSlotIdx(idx)
                              }}
                              onUpdate={updateEl} onDelete={deleteEl}
                              editMode={editingId === el.id}
                            >
                              {el.type === 'text' && (
                                <TextDisplay el={el} scale={scale} isEditing={editingId === el.id}
                                  onChange={t => updateEl(el.id, { text: t } as Partial<PDFElement>)}
                                  onDblClick={() => setEditingId(el.id)} />
                              )}
                              {(el.type === 'image' || el.type === 'signature') && (
                                <img src={el.src} alt={el.type} draggable={false}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: el.opacity ?? 1 }} />
                              )}
                              {el.type === 'stamp'      && <StampDisplay el={el} scale={scale} />}
                              {el.type === 'highlight'  && <HighlightDisplay el={el} />}
                              {el.type === 'mark'       && <MarkDisplay el={el} />}
                              {el.type === 'annotation' && (
                                <AnnotationDisplay el={el} isEditing={editingId === el.id}
                                  onChange={t => updateEl(el.id, { text: t } as Partial<PDFElement>)}
                                  onDblClick={() => setEditingId(el.id)} />
                              )}
                              {el.type === 'shape'      && <ShapeDisplay el={el} />}
                              {el.type === 'draw'       && <DrawDisplay el={el} scale={scale} />}
                              {el.type === 'watermark'  && <WatermarkDisplay el={el} scale={scale} />}
                            </DraggableElement>
                          </div>
                        ))}
                        {/* Live draw preview */}
                        {toolMode === 'draw' && isActive && drawPreviewPts.length > 1 && (
                          <svg style={{position:'absolute',inset:0,overflow:'visible',pointerEvents:'none'}} width="100%" height="100%">
                            <polyline
                              points={drawPreviewPts.map(p=>`${p.x*scale},${p.y*scale}`).join(' ')}
                              fill="none" stroke={drawColor} strokeWidth={drawStrokeWidth}
                              strokeLinecap="round" strokeLinejoin="round" opacity={drawOpacity}/>
                          </svg>
                        )}
                        {/* Live mark drag preview */}
                        {toolMode === 'mark' && markDraft?.slotId === slot.id && markDraft.w > 4 && markDraft.h > 4 && (
                          <div style={{
                            position: 'absolute', pointerEvents: 'none', zIndex: 8,
                            left: markDraft.x * scale, top: markDraft.y * scale,
                            width: markDraft.w * scale, height: markDraft.h * scale,
                            border: `1.5px dashed ${markColor}`,
                            background: 'rgba(99,102,241,0.05)',
                            boxSizing: 'border-box',
                          }}>
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                              {activeMarkType === 'tick' && (
                                <polyline points="10,55 38,82 90,18" fill="none" stroke={markColor}
                                  strokeWidth={markStrokeWidth * 4} strokeLinecap="round" strokeLinejoin="round"
                                  vectorEffect="non-scaling-stroke" opacity={0.6} />
                              )}
                              {activeMarkType === 'cross' && (
                                <>
                                  <line x1="12" y1="12" x2="88" y2="88" stroke={markColor} strokeWidth={markStrokeWidth * 4} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.6} />
                                  <line x1="88" y1="12" x2="12" y2="88" stroke={markColor} strokeWidth={markStrokeWidth * 4} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.6} />
                                </>
                              )}
                              {activeMarkType === 'circle' && (
                                <ellipse cx="50" cy="50" rx="42" ry="42" fill="none" stroke={markColor} strokeWidth={markStrokeWidth * 4} vectorEffect="non-scaling-stroke" opacity={0.6} />
                              )}
                              {activeMarkType === 'square' && (
                                <rect x="8" y="8" width="84" height="84" fill="none" stroke={markColor} strokeWidth={markStrokeWidth * 4} strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity={0.6} rx="4" />
                              )}
                              {activeMarkType === 'filledbox' && (
                                <rect x="2" y="2" width="96" height="96" fill={markColor} opacity={0.6} rx="4" />
                              )}
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Crop mode: dim overlay + interactive handle rect */}
                      {isCropping && cropDraft?.slotId === slot.id && (
                        <>
                          {/* Darkens the area outside the crop rect */}
                          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', pointerEvents:'none', zIndex:8 }} />
                          {/* Crop rect with resize handles */}
                          <div style={{
                            position: 'absolute',
                            left: cropDraft.x * scale, top: cropDraft.y * scale,
                            width: cropDraft.w * scale, height: cropDraft.h * scale,
                            border: '2px solid #f59e0b',
                            background: 'rgba(245,158,11,0.06)',
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
                            boxSizing: 'border-box', zIndex: 9, overflow: 'visible',
                          }}>
                            {/* 8 resize handles — centered ON the border via transform so half sits inside the rect */}
                            {([
                              ['nw', {top:0,  left:0,      transform:'translate(-50%,-50%)', cursor:'nw-resize'}],
                              ['n',  {top:0,  left:'50%',  transform:'translate(-50%,-50%)', cursor:'n-resize'}],
                              ['ne', {top:0,  right:0,     transform:'translate(50%,-50%)',  cursor:'ne-resize'}],
                              ['e',  {top:'50%', right:0,  transform:'translate(50%,-50%)',  cursor:'e-resize'}],
                              ['se', {bottom:0, right:0,   transform:'translate(50%,50%)',   cursor:'se-resize'}],
                              ['s',  {bottom:0, left:'50%',transform:'translate(-50%,50%)',  cursor:'s-resize'}],
                              ['sw', {bottom:0, left:0,    transform:'translate(-50%,50%)',  cursor:'sw-resize'}],
                              ['w',  {top:'50%', left:0,   transform:'translate(-50%,-50%)', cursor:'w-resize'}],
                            ] as [string, React.CSSProperties][]).map(([hdl, pos]) => (
                              <div key={hdl}
                                className="resize-handle"
                                style={{ border:'1.5px solid #f59e0b', zIndex:50, touchAction:'none', ...pos }}
                                onMouseDown={e => {
                                  e.stopPropagation(); e.preventDefault()
                                  cropResizing.current = hdl
                                  cropResizeStart.current = { cx:e.clientX, cy:e.clientY, ox:cropDraft.x, oy:cropDraft.y, ow:cropDraft.w, oh:cropDraft.h }
                                }}
                                onTouchStart={e => {
                                  e.stopPropagation()
                                  const t = e.touches[0]
                                  cropResizing.current = hdl
                                  cropResizeStart.current = { cx:t.clientX, cy:t.clientY, ox:cropDraft.x, oy:cropDraft.y, ow:cropDraft.w, oh:cropDraft.h }
                                }}
                              />
                            ))}
                            {/* Apply / Cancel */}
                            <div style={{ position:'absolute', bottom:-42, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:20, whiteSpace:'nowrap' }}>
                              <button
                                onMouseDown={e => e.stopPropagation()}
                                onClick={e => { e.stopPropagation(); setCropDraft(null); cropResizing.current=null; setToolMode('select') }}
                                style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.25)', background:'rgba(15,18,35,0.85)', color:'#fff', fontSize:10, fontWeight:700, cursor:'pointer' }}
                              >Cancel</button>
                              <button
                                onMouseDown={e => e.stopPropagation()}
                                onClick={e => {
                                  e.stopPropagation()
                                  const { slotId, x, y, w, h } = cropDraft
                                  setSlots(prev => prev.map(s => s.id === slotId ? { ...s, crop: { x, y, w, h } } : s))
                                  setCropDraft(null); cropResizing.current=null; setToolMode('select')
                                }}
                                style={{ padding:'5px 10px', borderRadius:6, border:'none', background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', fontSize:10, fontWeight:700, cursor:'pointer' }}
                              >This Page</button>
                              <button
                                onMouseDown={e => e.stopPropagation()}
                                onClick={e => {
                                  e.stopPropagation()
                                  const { x, y, w, h } = cropDraft
                                  setSlots(prev => prev.map(s => {
                                    const rot = s.rotation || 0
                                    const sw2 = rot===90||rot===270 ? s.baseHeight : s.baseWidth
                                    const sh  = rot===90||rot===270 ? s.baseWidth  : s.baseHeight
                                    const cx = Math.min(x, Math.max(0, sw2 - 10))
                                    const cy = Math.min(y, Math.max(0, sh  - 10))
                                    const cw = Math.min(w, sw2 - cx)
                                    const ch = Math.min(h, sh  - cy)
                                    return (cw >= 10 && ch >= 10) ? { ...s, crop: { x: cx, y: cy, w: cw, h: ch } } : s
                                  }))
                                  setCropDraft(null); cropResizing.current=null; setToolMode('select')
                                }}
                                style={{ padding:'5px 10px', borderRadius:6, border:'none', background:'linear-gradient(135deg,#6366f1,#818cf8)', color:'#fff', fontSize:10, fontWeight:700, cursor:'pointer' }}
                              >All Pages</button>
                            </div>
                          </div>
                        </>
                      )}
                      {/* Ghost position marker for placement tools */}
                      {['text','highlight','mark','annotation','shape'].includes(toolMode) && hoverPos?.slotId === slot.id && !markDraft && (
                        <GhostMarker
                          toolMode={toolMode} x={hoverPos.x * scale} y={hoverPos.y * scale}
                          activeMarkType={activeMarkType} activeShapeType={activeShapeType} shapeStroke={shapeStroke}
                        />
                      )}
                      {/* Interaction overlay: click/drag-to-place (not active during crop — handles manage that) */}
                      {toolMode !== 'pan' && toolMode !== 'draw' && !isCropping && (
                        <div
                          style={{
                            position:'absolute', inset:0, zIndex:5,
                            cursor: toolMode === 'mark' ? 'crosshair' : 'pointer',
                            touchAction: ['text','highlight','mark','annotation','shape'].includes(toolMode) ? 'none' : 'auto',
                          }}
                          onMouseDown={e => { if (toolMode === 'mark') { setSlotIdx(idx); handleMarkDragStart(e, slot.id) } }}
                          onMouseMove={e => {
                            if (['text','highlight','annotation','shape'].includes(toolMode)) {
                              const r = e.currentTarget.getBoundingClientRect()
                              setHoverPos({ x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale, slotId: slot.id })
                            } else if (toolMode === 'mark') {
                              const r = e.currentTarget.getBoundingClientRect()
                              setHoverPos({ x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale, slotId: slot.id })
                              handleMarkDragMove(e)
                            }
                          }}
                          onMouseUp={e => { if (toolMode === 'mark') handleMarkDragEnd(e) }}
                          onClick={e => { if (touchFiredRef.current) return; if (toolMode === 'mark') return; setSlotIdx(idx); handleOverlayClick(e, slot.id) }}
                          onTouchMove={e => {
                            if (['text','highlight','mark','annotation','shape'].includes(toolMode)) {
                              const t = e.touches[0]
                              const r = e.currentTarget.getBoundingClientRect()
                              setHoverPos({ x: (t.clientX - r.left) / scale, y: (t.clientY - r.top) / scale, slotId: slot.id })
                            }
                          }}
                          onTouchEnd={e => {
                            touchFiredRef.current = true
                            setTimeout(() => { touchFiredRef.current = false }, 600)
                            setSlotIdx(idx)
                            handleOverlayTouchEnd(e, slot.id)
                          }}
                          onMouseLeave={() => {
                            setHoverPos(null)
                            if (toolMode === 'mark' && markDragStart.current) {
                              markDragStart.current = null
                              setMarkDraft(null)
                            }
                          }}
                        />
                      )}
                    </div>
                    {/* Page number badge – sits on top of crop window */}
                    <div style={{
                      position:'absolute', top:6, left:6, zIndex:15,
                      background: isActive ? '#6366f1' : 'rgba(0,0,0,0.45)',
                      color:'#fff', fontSize:9, fontWeight:700, borderRadius:4,
                      padding:'2px 6px', pointerEvents:'none', letterSpacing:'0.04em',
                    }}>P{idx+1}</div>
                    {/* Clear crop badge */}
                    {slot.crop && !isCropping && (
                      <button
                        onClick={e => { e.stopPropagation(); clearCrop(slot.id) }}
                        style={{
                          position:'absolute', bottom:6, right:6, zIndex:15,
                          padding:'3px 8px', borderRadius:5,
                          border:'1px solid rgba(245,158,11,0.5)',
                          background:'rgba(245,158,11,0.15)', color:'#f59e0b',
                          fontSize:9, fontWeight:700, cursor:'pointer',
                        }}
                      >✕ Clear Crop</button>
                    )}
                    {/* Per-page rotate overlay on hover */}
                    {hoveredPageIdx === idx && toolMode !== 'crop' && (
                      <div
                        onClick={e => e.stopPropagation()}
                        style={{
                          position: 'absolute', bottom: 10, left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex', alignItems: 'center', gap: 4,
                          zIndex: 20,
                          background: 'rgba(10,12,28,0.76)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.13)',
                          borderRadius: 999,
                          padding: '5px 10px',
                          boxShadow: '0 4px 18px rgba(0,0,0,0.38)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <button
                          onClick={() => rotatePageLeft(idx)}
                          title="Rotate left 90°"
                          style={{
                            width: 26, height: 26, borderRadius: '50%',
                            border: '1px solid rgba(165,180,252,0.3)',
                            background: 'rgba(165,180,252,0.12)',
                            color: '#a5b4fc', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.4)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(165,180,252,0.12)')}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"/>
                            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                          </svg>
                        </button>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', padding: '0 2px' }}>
                          P{idx + 1}
                        </span>
                        <button
                          onClick={() => rotatePage(idx)}
                          title="Rotate right 90°"
                          style={{
                            width: 26, height: 26, borderRadius: '50%',
                            border: '1px solid rgba(165,180,252,0.3)',
                            background: 'rgba(165,180,252,0.12)',
                            color: '#a5b4fc', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.4)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(165,180,252,0.12)')}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Insert zone after each page */}
                  <CanvasInsertZone
                    onInsertBlank={() => idx === slots.length - 1 ? addPageAtEnd() : addPageAfter(idx)}
                    onInsertImage={() => openImagePageAt(idx + 1)}
                    onInsertPDF={() => openMergePDFAt(idx + 1)}
                    isMobile={isMobile}
                    last={idx === slots.length - 1}
                  />
                  </React.Fragment>
                )
              })}
            </div>
          )}

          {/* Floating zoom + fit + pan controls */}
          {slots.length > 0 && (
            <div className="glass-panel" style={{
              position: 'absolute', bottom: isMobile ? 72 : 18,
              left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 3,
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 999, padding: '5px 12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)', zIndex: 30,
              whiteSpace: 'nowrap',
            }}>
              {/* Zoom out */}
              <FBtn title="Zoom out" onClick={() => setScale(s => Math.max(0.4, parseFloat((s - 0.2).toFixed(1))))}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </FBtn>
              {/* % label – click to reset 100% */}
              <button title="Reset to 100%" onClick={() => setScale(1)} style={{
                background:'transparent', border:'none', cursor:'pointer',
                fontSize:11.5, fontWeight:700, minWidth:40, textAlign:'center', color:'#334155',
                borderRadius:6, padding:'4px 2px',
              }}
              onMouseEnter={e=>(e.currentTarget.style.background='#e2e8f0')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                {Math.round(scale * 100)}%
              </button>
              {/* Zoom in */}
              <FBtn title="Zoom in" onClick={() => setScale(s => Math.min(3.0, parseFloat((s + 0.2).toFixed(1))))}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </FBtn>

              <div style={{ width: 1, height: 16, background: '#c8d4e8', margin: '0 3px' }} />

              {/* Fit to screen */}
              <FBtn title="Fit page to screen" onClick={fitToScreen}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                </svg>
              </FBtn>

              {/* Pan toggle */}
              <FBtn
                title={toolMode === 'pan' ? 'Exit pan mode (active)' : 'Pan mode – drag to scroll'}
                onClick={() => setToolMode(toolMode === 'pan' ? 'select' : 'pan')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={toolMode === 'pan' ? '#6366f1' : 'currentColor'}
                  strokeWidth={toolMode === 'pan' ? '2.5' : '1.75'} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V8a2 2 0 00-4 0v1M14 9V7a2 2 0 00-4 0v5M10 10V6a2 2 0 00-4 0v9a7 7 0 0014 0v-3a2 2 0 00-4 0"/>
                </svg>
              </FBtn>

              <div style={{ width: 1, height: 16, background: '#c8d4e8', margin: '0 3px' }} />

              {/* Page counter */}
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', padding: '0 2px' }}>
                {slotIdx + 1} / {slots.length}
              </span>

              <div style={{ width: 1, height: 16, background: '#c8d4e8', margin: '0 3px' }} />

              {/* AI Fill button */}
              <button
                title="AI Auto Fill — fill this page's form fields with AI"
                onClick={openAutoFill}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
                  transition: 'opacity 0.15s',
                  opacity: showAutoFill ? 0.75 : 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = showAutoFill ? '0.75' : '1')}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M18 2v6"/><path d="M21 5h-6"/>
                </svg>
                AI Fill
              </button>

              {/* AI Chat Fill button */}
              <button
                title="AI Chat Fill — answer questions to fill form fields conversationally"
                onClick={() => { if (slots.length) openChatFill() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: showChatFill
                    ? 'linear-gradient(135deg,#0ea5e9,#38bdf8)'
                    : 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(14,165,233,0.35)',
                  transition: 'opacity 0.15s',
                  opacity: showChatFill ? 0.75 : 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = showChatFill ? '0.75' : '1')}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Chat Fill
              </button>
            </div>
          )}
        </main>

        {/* Properties panel */}
        {showPanel && slots.length > 0 && (
          <div style={isMobile || isTablet ? {
            position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 100,
            boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
          } : {}}>
            <PropertiesPanel
              selected={selectedEl}
              currentPage={slotIdx + 1}
              totalPages={slots.length}
              pageBoxCount={pageElems.length}
              onUpdate={updateEl}
              onDelete={deleteEl}
              onClearPage={clearPage}
              onAddStamp={handleAddStamp}
            />
          </div>
        )}
      </div>

      {/* ── MOBILE BOTTOM TOOLBAR ────────────────────────────────── */}
      {isMobile && slots.length > 0 && (
        <nav style={{
          display: 'flex', alignItems: 'center',
          height: 72, flexShrink: 0, paddingBottom: 4,
          background: 'linear-gradient(180deg,#0d1526 0%,#090e1a 100%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.45)',
          overflowX: 'auto', gap: 2, padding: '0 6px 4px',
        }}>
          {/* Undo / Redo */}
          {[
            { label:'Undo', can:canUndo, action:undo, icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.65"/></svg> },
            { label:'Redo', can:canRedo, action:redo, icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-3.65"/></svg> },
          ].map(({label,can,action,icon})=>(
            <button key={label} onClick={action} disabled={!can} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,border:'none',cursor:can?'pointer':'default',minWidth:44,padding:'6px 4px 4px',borderRadius:14,flexShrink:0,background:'transparent',opacity:can?1:0.3,transition:'all 0.18s'}}>
              <span style={{width:34,height:34,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.6)',transition:'all 0.18s'}}>{icon}</span>
              <span style={{fontSize:9,color:'rgba(255,255,255,0.35)',fontWeight:400,whiteSpace:'nowrap'}}>{label}</span>
            </button>
          ))}
          {/* Divider */}
          <div style={{width:1,height:40,background:'rgba(255,255,255,0.08)',alignSelf:'center',flexShrink:0,margin:'0 2px'}}/>
          {/* Rotate button → opens bottom sheet */}
          <button onClick={()=>setShowRotateMenu(v=>!v)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,border:'none',cursor:'pointer',minWidth:50,padding:'6px 4px 4px',borderRadius:14,flexShrink:0,background:showRotateMenu?'rgba(99,102,241,0.18)':'transparent',transition:'all 0.18s'}}>
            <span style={{width:36,height:36,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',background:showRotateMenu?'linear-gradient(135deg,#6366f1,#818cf8)':'rgba(255,255,255,0.06)',color:showRotateMenu?'#fff':'rgba(255,255,255,0.45)',transition:'all 0.18s'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.13-9.36L23 10"/></svg>
            </span>
            <span style={{fontSize:9,color:showRotateMenu?'#818cf8':'rgba(255,255,255,0.35)',fontWeight:showRotateMenu?700:400,transition:'color 0.18s'}}>Rotate</span>
          </button>
          {/* Divider */}
          <div style={{width:1,height:40,background:'rgba(255,255,255,0.08)',alignSelf:'center',flexShrink:0,margin:'0 2px'}}/>
          {([
            { mode:'select' as ToolMode, label:'Select', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-7 1-3 7z"/></svg> },
            { mode:'text' as ToolMode, label:'Text', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg> },
            { mode:'annotation' as ToolMode, label:'Note', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8z"/><polyline points="16 3 16 8 21 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg> },
            { mode:'highlight' as ToolMode, label:'Highlight', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg> },
            { mode:'mark' as ToolMode, label:'Mark', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
            { mode:'draw' as ToolMode, label:'Draw', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg> },
            { mode:'eraser' as ToolMode, label:'Erase', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16l10-10 7 7-3.5 3.5"/><path d="M6.5 17.5l4-4"/></svg> },
            { mode:'shape' as ToolMode, label:'Shape', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><circle cx="17" cy="17" r="4"/></svg> },
            { mode:'image' as ToolMode, label:'Image', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> },
            { mode:'signature' as ToolMode, label:'Sign', isSign:true,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5z"/></svg> },
            { mode:'crop' as ToolMode, label:'Crop', isSign:false,
              icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/></svg> },
          ]).map(t => {
            const active = toolMode === t.mode
            return (
              <button key={t.mode}
                onClick={() => {
                  if (t.mode === 'image') { setToolMode('image'); imgInput.current?.click() }
                  else if (t.mode === 'signature') { setShowSig(true); setToolMode('select') }
                  else if (t.mode === 'mark') { setToolMode('mark'); setShowMarkMenu(v => !v); setShowShapeMenu(false); setShowDrawMenu(false); setShowStampMenu(false); setShowWmPanel(false); setShowDateMenu(false) }
                  else if (t.mode === 'shape') { setToolMode('shape'); setShowShapeMenu(v => !v); setShowMarkMenu(false); setShowStampMenu(false); setShowDrawMenu(false); setShowWmPanel(false) }
                  else if (t.mode === 'draw') { setToolMode('draw'); setShowDrawMenu(v => !v); setShowShapeMenu(false); setShowMarkMenu(false); setShowStampMenu(false); setShowWmPanel(false) }
                  else if (t.mode === 'eraser') { setToolMode(toolMode === 'eraser' ? 'select' : 'eraser'); setShowShapeMenu(false); setShowDrawMenu(false); setShowMarkMenu(false); setShowStampMenu(false); setShowWmPanel(false); setShowDateMenu(false) }
                  else { setToolMode(t.mode); setShowShapeMenu(false); setShowDrawMenu(false); setShowMarkMenu(false); setShowStampMenu(false); setShowWmPanel(false); setShowDateMenu(false) }
                }}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                  border:'none', cursor:'pointer', minWidth:50, padding:'6px 4px 4px',
                  borderRadius:14, flexShrink:0,
                  background: active ? (t.isSign ? 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(217,119,6,0.15))' : t.mode==='eraser' ? 'rgba(220,38,38,0.18)' : 'rgba(99,102,241,0.18)') : 'transparent',
                  transition:'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                }}>
                <span style={{
                  width:36, height:36, borderRadius:11,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: active ? (t.isSign ? 'linear-gradient(135deg,#f59e0b,#d97706)' : t.mode==='eraser' ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'linear-gradient(135deg,#6366f1,#818cf8)') : (t.isSign ? 'rgba(245,158,11,0.12)' : t.mode==='eraser' ? 'rgba(220,38,38,0.10)' : 'rgba(255,255,255,0.06)'),
                  boxShadow: active ? (t.isSign ? '0 4px 14px rgba(245,158,11,0.45)' : t.mode==='eraser' ? '0 4px 14px rgba(220,38,38,0.45)' : '0 4px 14px rgba(99,102,241,0.45)') : 'none',
                  color: active ? '#fff' : (t.isSign ? '#fbbf24' : t.mode==='eraser' ? 'rgba(248,113,113,0.7)' : 'rgba(255,255,255,0.45)'),
                  transition:'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                }}>{t.icon}</span>
                <span style={{
                  fontSize:9, letterSpacing:'0.03em', fontFamily:'Inter,system-ui,sans-serif',
                  fontWeight: active ? 700 : 400,
                  color: active ? (t.isSign ? '#fbbf24' : t.mode==='eraser' ? '#f87171' : '#818cf8') : (t.isSign ? 'rgba(251,191,36,0.55)' : t.mode==='eraser' ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.35)'),
                  transition:'color 0.18s', whiteSpace:'nowrap',
                }}>{t.label}</span>
              </button>
            )
          })}
          {/* Stamp */}
          <button onClick={()=>{setShowStampMenu(v=>!v);setShowDrawMenu(false);setShowShapeMenu(false);setShowWmPanel(false);setShowDateMenu(false);setToolMode('select')}} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,border:'none',cursor:'pointer',minWidth:50,padding:'6px 4px 4px',borderRadius:14,flexShrink:0,background:showStampMenu?'rgba(99,102,241,0.18)':'transparent',transition:'all 0.18s'}}>
            <span style={{width:36,height:36,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',background:showStampMenu?'linear-gradient(135deg,#6366f1,#818cf8)':'rgba(255,255,255,0.06)',color:showStampMenu?'#fff':'rgba(255,255,255,0.45)',transition:'all 0.18s'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M19 10H5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2z"/><rect x="9" y="2" width="6" height="8" rx="1"/></svg>
            </span>
            <span style={{fontSize:9,color:showStampMenu?'#818cf8':'rgba(255,255,255,0.35)',fontWeight:showStampMenu?700:400,transition:'color 0.18s'}}>Stamp</span>
          </button>
          {/* Watermark */}
          <button onClick={()=>{setShowWmPanel(v=>!v);setShowStampMenu(false);setShowDrawMenu(false);setShowShapeMenu(false);setShowDateMenu(false);setToolMode('select')}} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,border:'none',cursor:'pointer',minWidth:50,padding:'6px 4px 4px',borderRadius:14,flexShrink:0,background:showWmPanel?'rgba(99,102,241,0.18)':'transparent',transition:'all 0.18s'}}>
            <span style={{width:36,height:36,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',background:showWmPanel?'linear-gradient(135deg,#6366f1,#818cf8)':'rgba(255,255,255,0.06)',color:showWmPanel?'#fff':'rgba(255,255,255,0.45)',transition:'all 0.18s'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <span style={{fontSize:9,color:showWmPanel?'#818cf8':'rgba(255,255,255,0.35)',fontWeight:showWmPanel?700:400,transition:'color 0.18s'}}>Wmark</span>
          </button>
          {/* Date */}
          <button onClick={()=>{setShowDateMenu(v=>!v);setShowStampMenu(false);setShowWmPanel(false);setShowDrawMenu(false);setShowShapeMenu(false);setToolMode('select')}} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,border:'none',cursor:'pointer',minWidth:50,padding:'6px 4px 4px',borderRadius:14,flexShrink:0,background:showDateMenu?'rgba(99,102,241,0.18)':'transparent',transition:'all 0.18s'}}>
            <span style={{width:36,height:36,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',background:showDateMenu?'linear-gradient(135deg,#6366f1,#818cf8)':'rgba(255,255,255,0.06)',color:showDateMenu?'#fff':'rgba(255,255,255,0.45)',transition:'all 0.18s'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <span style={{fontSize:9,color:showDateMenu?'#818cf8':'rgba(255,255,255,0.35)',fontWeight:showDateMenu?700:400,transition:'color 0.18s'}}>Date</span>
          </button>
        </nav>
      )}

      {/* Mobile rotate panel */}
      {isMobile && showRotateMenu && (
        <div style={{
          position: 'fixed', bottom: 76, left: 0, right: 0, zIndex: 200,
          background: '#fff', borderTop: '1px solid #e8ecf5',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          borderRadius: '14px 14px 0 0',
          padding: '16px 16px 20px',
        }}>
          <p style={{margin:'0 0 14px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Rotate</p>
          <div style={{display:'flex',gap:10}}>
            {/* This page */}
            <div style={{flex:1}}>
              <p style={{margin:'0 0 8px',fontSize:11,fontWeight:700,color:'#475569'}}>This page (P{slotIdx+1})</p>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{rotatePageLeft(slotIdx);setShowRotateMenu(false)}} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'12px 8px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#f8faff',cursor:'pointer'}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                  <span style={{fontSize:10,fontWeight:700,color:'#475569'}}>↺ Left</span>
                </button>
                <button onClick={()=>{rotatePage(slotIdx);setShowRotateMenu(false)}} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'12px 8px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#f8faff',cursor:'pointer'}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.13-9.36L23 10"/></svg>
                  <span style={{fontSize:10,fontWeight:700,color:'#475569'}}>↻ Right</span>
                </button>
              </div>
            </div>
            {/* Divider */}
            <div style={{width:1,background:'#e8ecf5',alignSelf:'stretch'}}/>
            {/* All pages */}
            <div style={{flex:1}}>
              <p style={{margin:'0 0 8px',fontSize:11,fontWeight:700,color:'#475569'}}>All pages ({slots.length})</p>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{rotateAllPagesLeft();setShowRotateMenu(false)}} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'12px 8px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#f8faff',cursor:'pointer'}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                  <span style={{fontSize:10,fontWeight:700,color:'#475569'}}>↺ Left</span>
                </button>
                <button onClick={()=>{rotateAllPages();setShowRotateMenu(false)}} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'12px 8px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#f8faff',cursor:'pointer'}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.13-9.36L23 10"/></svg>
                  <span style={{fontSize:10,fontWeight:700,color:'#475569'}}>↻ Right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile date panel */}
      {isMobile && showDateMenu && (
        <DatePickerPanel
          onInsert={insertDate}
          onClose={() => setShowDateMenu(false)}
          isMobile
        />
      )}

      {/* Mobile shape picker */}
      {isMobile && toolMode === 'shape' && showShapeMenu && (
        <div style={{
          position: 'fixed', bottom: 76, left: 0, right: 0, zIndex: 200,
          background: '#fff', borderTop: '1px solid #e8ecf5',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          borderRadius: '14px 14px 0 0',
          padding: '14px 16px',
          display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start',
        }}>
          <div>
            <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Shape</p>
            <div style={{display:'flex',gap:6}}>
              {([
                {t:'rectangle' as const,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>},
                {t:'ellipse' as const,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><ellipse cx="12" cy="12" rx="10" ry="7"/></svg>},
                {t:'line' as const,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>},
                {t:'arrow' as const,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="9 5 19 5 19 15"/></svg>},
                {t:'polygon' as const,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polygon points="12,3 21,8.5 21,15.5 12,21 3,15.5 3,8.5"/></svg>},
              ]).map(({t,icon})=>(
                <button key={t} title={t} onClick={()=>setActiveShapeType(t)} style={{width:42,height:42,borderRadius:10,border:`1.5px solid ${activeShapeType===t?'#6366f1':'#e2e8f0'}`,background:activeShapeType===t?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:activeShapeType===t?'#fff':'#475569',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{icon}</button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'flex-end',flexWrap:'wrap'}}>
            <div>
              <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.06em',textTransform:'uppercase'}}>Stroke</p>
              <input type="color" value={shapeStroke} onChange={e=>setShapeStroke(e.target.value)} style={{width:44,height:36,border:'none',borderRadius:7,cursor:'pointer',padding:2}}/>
            </div>
            <div>
              <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.06em',textTransform:'uppercase'}}>Fill</p>
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                <input type="color" value={shapeFill||'#ffffff'} onChange={e=>setShapeFill(e.target.value)} style={{width:44,height:36,border:'none',borderRadius:7,cursor:'pointer',padding:2}}/>
                <button onClick={()=>setShapeFill('')} style={{fontSize:10,color:shapeFill?'#475569':'#6366f1',border:'none',background:'transparent',cursor:'pointer',fontWeight:shapeFill?400:700,padding:'4px 6px'}}>None</button>
              </div>
            </div>
            <div>
              <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.06em',textTransform:'uppercase'}}>Width</p>
              <div style={{display:'flex',gap:4}}>
                {[1,2,4].map(w=><button key={w} onClick={()=>setShapeStrokeWidth(w)} style={{width:36,height:36,borderRadius:8,fontSize:11,fontWeight:700,border:`1.5px solid ${shapeStrokeWidth===w?'#6366f1':'#e2e8f0'}`,background:shapeStrokeWidth===w?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:shapeStrokeWidth===w?'#fff':'#475569',cursor:'pointer'}}>{w}px</button>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile mark options panel */}
      {isMobile && toolMode === 'mark' && showMarkMenu && (
        <div style={{
          position: 'fixed', bottom: 76, left: 0, right: 0, zIndex: 200,
          background: '#fff', borderTop: '1px solid #e8ecf5',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          borderRadius: '14px 14px 0 0',
          padding: '14px 16px',
          display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start',
        }}>
          {/* Type */}
          <div>
            <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Type</p>
            <div style={{display:'flex',gap:7}}>
              {([
                {mt:'tick'   as const, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>},
                {mt:'cross'  as const, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>},
                {mt:'circle' as const, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/></svg>},
                {mt:'square'    as const, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>},
                {mt:'filledbox' as const, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>},
              ]).map(({mt,icon})=>(
                <button key={mt} onClick={()=>setActiveMarkType(mt)} style={{width:48,height:40,borderRadius:10,border:`1.5px solid ${activeMarkType===mt?'#6366f1':'#e2e8f0'}`,background:activeMarkType===mt?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:activeMarkType===mt?'#fff':'#475569',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {/* Thickness */}
          <div style={{flex:1,minWidth:140}}>
            <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Thickness {markStrokeWidth}px</p>
            <input type="range" min={0.5} max={20} step={0.5} value={markStrokeWidth}
              onChange={e=>setMarkStrokeWidth(parseFloat(e.target.value))}
              style={{width:'100%',minWidth:0,accentColor:'#6366f1',cursor:'pointer'}}/>
          </div>
          {/* Color */}
          <div>
            <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Color</p>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',maxWidth:220}}>
              {['#16a34a','#dc2626','#1d4ed8','#7c3aed','#ea580c','#0e7490','#1e293b','#f59e0b'].map(c=>(
                <button key={c} onClick={()=>setMarkColor(c)} style={{width:26,height:26,borderRadius:'50%',background:c,border:'none',cursor:'pointer',outline:markColor===c?'2.5px solid #6366f1':'2px solid transparent',outlineOffset:2}}/>
              ))}
              <input type="color" value={markColor} onChange={e=>setMarkColor(e.target.value)} style={{width:26,height:26,border:'none',borderRadius:6,cursor:'pointer',padding:1}}/>
            </div>
          </div>
        </div>
      )}

      {/* Mobile stamp panel */}
      {isMobile && showStampMenu && (
        <div style={{
          position: 'fixed', bottom: 76, left: 0, right: 0, zIndex: 200,
          background: '#fff', borderTop: '1px solid #e8ecf5',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          borderRadius: '14px 14px 0 0',
          padding: '14px 16px',
        }}>
          <p style={{margin:'0 0 8px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Stamps</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:10}}>
            {[{label:'APPROVED',color:'#16a34a'},{label:'REJECTED',color:'#dc2626'},{label:'DRAFT',color:'#1d4ed8'},{label:'CONFIDENTIAL',color:'#7c3aed'},{label:'URGENT',color:'#ea580c'},{label:'COMPLETED',color:'#0e7490'},{label:'VOID',color:'#64748b'},{label:'RECEIVED',color:'#0284c7'},{label:'PAID',color:'#16a34a'},{label:'REVIEWED',color:'#d97706'},{label:'NOT APPROVED',color:'#dc2626'},{label:'COPY',color:'#475569'}].map(({label,color})=>(
              <button key={label} onClick={()=>{handleAddStamp(label,color);setShowStampMenu(false)}} style={{padding:'5px 4px',borderRadius:7,border:`1.5px solid ${color}`,background:`${color}12`,color,fontSize:8,fontWeight:800,cursor:'pointer',letterSpacing:'0.04em',textAlign:'center'}}>{label}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:6}}>
            <input value={customStampText} onChange={e=>setCustomStampText(e.target.value.toUpperCase())} placeholder="CUSTOM STAMP" maxLength={20} style={{flex:1,padding:'6px 10px',borderRadius:8,border:'1px solid #e2e8f0',fontSize:12,fontWeight:700,fontFamily:'Manrope,sans-serif',outline:'none',letterSpacing:'0.05em'}}/>
            <button onClick={()=>{if(customStampText.trim()){handleAddStamp(customStampText.trim(),'#475569');setShowStampMenu(false);setCustomStampText('')}}} style={{padding:'6px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366f1,#818cf8)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>Add</button>
          </div>
        </div>
      )}

      {/* Mobile draw options panel */}
      {isMobile && toolMode === 'draw' && showDrawMenu && (
        <div style={{
          position: 'fixed', bottom: 76, left: 0, right: 0, zIndex: 200,
          background: '#fff', borderTop: '1px solid #e8ecf5',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          borderRadius: '14px 14px 0 0',
          padding: '14px 16px',
          display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start',
        }}>
          <div>
            <p style={{margin:'0 0 6px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Color</p>
            <input type="color" value={drawColor} onChange={e=>setDrawColor(e.target.value)} style={{width:48,height:38,border:'none',borderRadius:7,cursor:'pointer',padding:2}}/>
          </div>
          <div>
            <p style={{margin:'0 0 6px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Width</p>
            <div style={{display:'flex',gap:5}}>
              {[2,4,8].map(w=><button key={w} onClick={()=>setDrawStrokeWidth(w)} style={{width:40,height:38,borderRadius:8,fontSize:12,fontWeight:700,border:`1.5px solid ${drawStrokeWidth===w?'#6366f1':'#e2e8f0'}`,background:drawStrokeWidth===w?'linear-gradient(135deg,#6366f1,#818cf8)':'#f8faff',color:drawStrokeWidth===w?'#fff':'#475569',cursor:'pointer'}}>{w}px</button>)}
            </div>
          </div>
          <div style={{flex:1,minWidth:140}}>
            <p style={{margin:'0 0 6px',fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Opacity {Math.round(drawOpacity*100)}%</p>
            <input type="range" min={0.1} max={1} step={0.05} value={drawOpacity} onChange={e=>setDrawOpacity(parseFloat(e.target.value))} style={{width:'100%',accentColor:'#6366f1'}}/>
          </div>
        </div>
      )}

      {/* Mobile watermark panel */}
      {isMobile && showWmPanel && (
        <div style={{
          position: 'fixed', bottom: 76, left: 0, right: 0, zIndex: 200,
          background: '#fff', borderTop: '1px solid #e8ecf5',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          borderRadius: '14px 14px 0 0',
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
          maxHeight: '60vh', overflowY: 'auto',
        }}>
          <p style={{margin:0,fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase'}}>Watermark</p>
          <div style={{display:'flex',gap:6,marginBottom:2}}>
            <button onClick={()=>setWmImageSrc('')} style={{padding:'5px 12px',borderRadius:6,border:'none',fontSize:12,fontWeight:700,cursor:'pointer',background:!wmImageSrc?'linear-gradient(135deg,#6366f1,#818cf8)':'#f1f5f9',color:!wmImageSrc?'#fff':'#64748b'}}>Text</button>
            <button onClick={()=>wmImageInput.current?.click()} style={{padding:'5px 12px',borderRadius:6,border:'none',fontSize:12,fontWeight:700,cursor:'pointer',background:wmImageSrc?'linear-gradient(135deg,#6366f1,#818cf8)':'#f1f5f9',color:wmImageSrc?'#fff':'#64748b'}}>Image{wmImageSrc?' ✓':''}</button>
            {wmImageSrc && <button onClick={()=>setWmImageSrc('')} style={{padding:'5px 8px',borderRadius:6,border:'1px solid #fca5a5',background:'#fff1f2',color:'#dc2626',fontSize:11,fontWeight:700,cursor:'pointer'}}>Remove</button>}
          </div>
          {wmImageSrc && <img src={wmImageSrc} alt="wm" style={{height:44,maxWidth:120,objectFit:'contain',borderRadius:4,border:'1px solid #e2e8f0',opacity:wmOpacity}} />}
          {!wmImageSrc && (
            <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
              <div style={{flex:1,minWidth:140}}>
                <p style={{margin:'0 0 4px',fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Text</p>
                <input value={wmText} onChange={e=>setWmText(e.target.value.toUpperCase())} placeholder="WATERMARK" maxLength={30} style={{width:'100%',padding:'6px 10px',borderRadius:7,border:'1px solid #e2e8f0',fontSize:13,fontWeight:700,fontFamily:'Manrope,sans-serif',outline:'none',letterSpacing:'0.05em'}}/>
              </div>
              <div>
                <p style={{margin:'0 0 4px',fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Color</p>
                <input type="color" value={wmColor} onChange={e=>setWmColor(e.target.value)} style={{width:44,height:36,border:'none',borderRadius:7,cursor:'pointer',padding:2}}/>
              </div>
            </div>
          )}
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:120}}>
              <p style={{margin:'0 0 4px',fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Opacity {Math.round(wmOpacity*100)}%</p>
              <input type="range" min={0.05} max={0.8} step={0.05} value={wmOpacity} onChange={e=>setWmOpacity(parseFloat(e.target.value))} style={{width:'100%',accentColor:'#6366f1'}}/>
            </div>
            {!wmImageSrc && <div style={{flex:1,minWidth:120}}>
              <p style={{margin:'0 0 4px',fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Size {wmFontSize}pt</p>
              <input type="range" min={20} max={120} step={4} value={wmFontSize} onChange={e=>setWmFontSize(parseInt(e.target.value))} style={{width:'100%',accentColor:'#6366f1'}}/>
            </div>}
            <div style={{flex:1,minWidth:120}}>
              <p style={{margin:'0 0 4px',fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Angle {wmRotation}°</p>
              <input type="range" min={-90} max={90} step={5} value={wmRotation} onChange={e=>setWmRotation(parseInt(e.target.value))} style={{width:'100%',accentColor:'#6366f1'}}/>
            </div>
          </div>
          <button onClick={()=>{applyWatermark();setShowWmPanel(false)}} style={{padding:'9px 16px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#6366f1,#818cf8)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>Apply to All Pages</button>
        </div>
      )}

      {/* Mobile image / signature opacity bottom sheet */}
      {isMobile && selectedEl && (selectedEl.type === 'image' || selectedEl.type === 'signature') && toolMode === 'select' && (
        <div style={{
          position: 'fixed', bottom: 76, left: 0, right: 0, zIndex: 200,
          background: '#fff', borderTop: '1px solid #e8ecf5',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          borderRadius: '14px 14px 0 0',
          padding: '14px 16px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {selectedEl.type === 'signature' ? 'Signature' : 'Image'} · {Math.round(selectedEl.width)}×{Math.round(selectedEl.height)} px
            </p>
            <button onClick={() => setSelectedId(null)} style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Opacity {Math.round((selectedEl.opacity ?? 1) * 100)}%
            </span>
            <input
              type="range" min={10} max={100} step={5}
              value={Math.round((selectedEl.opacity ?? 1) * 100)}
              onChange={e => updateEl(selectedEl.id, { opacity: parseInt(e.target.value) / 100 } as Partial<PDFElement>)}
              style={{ flex: 1, minWidth: 0, accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>
        </div>
      )}

      {/* Signature modal */}
      {showSig && <SignatureModal onApply={handleSignatureApply} onClose={() => setShowSig(false)} savedSignature={savedSignature} />}

      {/* AI Auto Fill modal */}
      {showAutoFill && (
        <AutoFillModal
          fields={autoFillFields}
          existingFilled={aiExistingFilled}
          onApply={applyAutoFill}
          onClose={() => setShowAutoFill(false)}
          pageLabel={`Page ${slotIdx + 1} of ${slots.length}`}
          pageImageBase64={autoFillPageImage}
        />
      )}

      {/* AI Chat Fill panel */}
      {showChatFill && (
        <ChatFillPanel
          fields={autoFillFields}
          existingFilled={aiExistingFilled}
          onApply={applyAutoFill}
          onClose={() => setShowChatFill(false)}
          pageLabel={`Page ${slotIdx + 1} of ${slots.length}`}
          pageImageBase64={autoFillPageImage}
        />
      )}

      {/* Organise Pages modal */}
      {showOrganise && (
        <OrganisePages
          pageSlots={slots}
          currentSlotIdx={slotIdx}
          onApply={handleReorder}
          onClose={() => setShowOrganise(false)}
        />
      )}

      {/* Backdrop for mobile sidebars */}
      {isMobile && (showSidebar || showPanel) && slots.length > 0 && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 90 }}
          onClick={() => { setShowSidebar(false); setShowPanel(false) }}
        />
      )}
    </div>
  )
}

// ── Canvas insert zone (between pages in main scroll area) ────────────────────
function CanvasInsertZone({
  onInsertBlank, onInsertImage, onInsertPDF, isMobile,
}: {
  onInsertBlank: () => void
  onInsertImage: () => void
  onInsertPDF: () => void
  isMobile: boolean
  last?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const fs = isMobile ? 10.5 : 11.5
  const btns = [
    { label: 'Blank Page', icon: <PageIcon />,    color: '#4f6ef7', bg: 'rgba(79,110,247,0.08)',  bgH: 'rgba(79,110,247,0.17)',  onClick: onInsertBlank },
    { label: 'Image Page', icon: <ImgPageIcon />, color: '#0e7490', bg: 'rgba(14,116,144,0.08)',  bgH: 'rgba(14,116,144,0.17)',  onClick: onInsertImage },
    { label: 'Insert PDF', icon: <PDFPageIcon />, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', bgH: 'rgba(124,58,237,0.17)', onClick: onInsertPDF },
  ]
  return (
    <div style={{ width: '100%', alignSelf: 'stretch', flexShrink: 0 }}>
      {/* Always-visible trigger row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: isMobile ? '6px 12px' : '8px 24px', gap: 10 }}>
        <div style={{ flex: 1, height: 1.5, background: '#d1d5e8', borderRadius: 1 }} />
        <button
          onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
          title="Insert page here"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: isMobile ? '4px 10px' : '5px 14px',
            borderRadius: 999,
            border: `1.5px ${open ? 'solid' : 'dashed'} #4f6ef7`,
            background: open ? '#4f6ef7' : 'rgba(79,110,247,0.07)',
            color: open ? '#fff' : '#4f6ef7',
            fontSize: fs, fontWeight: 700, cursor: 'pointer',
            boxShadow: open ? '0 2px 10px rgba(79,110,247,0.30)' : 'none',
            transition: 'all 0.14s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(79,110,247,0.14)' }}
          onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'rgba(79,110,247,0.07)' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
            }
          </svg>
          {open ? 'Cancel' : 'Insert page'}
        </button>
        <div style={{ flex: 1, height: 1.5, background: '#d1d5e8', borderRadius: 1 }} />
      </div>

      {/* Expanded options */}
      {open && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 6 : 10, padding: isMobile ? '2px 12px 10px' : '2px 24px 12px' }}>
          {btns.map(btn => (
            <button key={btn.label}
              onClick={e => { e.stopPropagation(); btn.onClick(); setOpen(false) }}
              style={{
                padding: isMobile ? '6px 10px' : '8px 18px',
                borderRadius: 999,
                border: `1.5px solid ${btn.color}60`,
                background: btn.bg,
                color: btn.color,
                fontSize: fs, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: `0 2px 10px ${btn.color}18`,
                transition: 'background 0.12s, border-color 0.12s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = btn.bgH; e.currentTarget.style.borderColor = btn.color }}
              onMouseLeave={e => { e.currentTarget.style.background = btn.bg; e.currentTarget.style.borderColor = `${btn.color}60` }}
            >
              {btn.icon}{btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
const PageIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
const ImgPageIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const PDFPageIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><line x1="9" y1="15" x2="15" y2="15"/></svg>

// ── Helpers ───────────────────────────────────────────────────────────────────
function FBtn({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: 'transparent', border: 'none', cursor: 'pointer',
      padding: '4px 6px', borderRadius: 6, color: '#475569',
      display: 'flex', alignItems: 'center',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      {children}
    </button>
  )
}

const mobileIconBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 7,
  color: '#fff', cursor: 'pointer', width: 34, height: 34,
  fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
}

