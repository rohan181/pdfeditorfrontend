'use client'
import { useEffect, useRef } from 'react'
import type { PDFElement } from '@/types'

const ALL_HANDLES: Record<string, React.CSSProperties> = {
  n:  { top: -7, left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' },
  ne: { top: -7, right: -7, cursor: 'ne-resize' },
  e:  { right: -7, top: '50%', transform: 'translateY(-50%)', cursor: 'e-resize' },
  se: { bottom: -7, right: -7, cursor: 'se-resize' },
  s:  { bottom: -7, left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' },
  sw: { bottom: -7, left: -7, cursor: 'sw-resize' },
  w:  { left: -7, top: '50%', transform: 'translateY(-50%)', cursor: 'w-resize' },
  nw: { top: -7, left: -7, cursor: 'nw-resize' },
}

// Only corners for small elements so handles don't overlap
const CORNER_HANDLES: Record<string, React.CSSProperties> = {
  ne: ALL_HANDLES.ne,
  se: ALL_HANDLES.se,
  sw: ALL_HANDLES.sw,
  nw: ALL_HANDLES.nw,
}

// Minimum visual selection box size in screen pixels
const MIN_SEL = 36

interface Props {
  element: PDFElement
  isSelected: boolean
  scale: number
  onSelect: (id: string) => void
  onUpdate: (id: string, updates: Partial<PDFElement>) => void
  onDelete: (id: string) => void
  children: React.ReactNode
  editMode?: boolean
}

export default function DraggableElement({
  element, isSelected, scale, onSelect, onUpdate, onDelete, children, editMode,
}: Props) {
  const dragging   = useRef(false)
  const resizing   = useRef<string | null>(null)
  const dragStart  = useRef({ cx: 0, cy: 0, ex: 0, ey: 0 })
  const resizeStart = useRef({ cx: 0, cy: 0, x: 0, y: 0, w: 0, h: 0 })

  const getXY = (e: MouseEvent | TouchEvent) =>
    'touches' in e && e.touches.length
      ? { cx: e.touches[0].clientX, cy: e.touches[0].clientY }
      : { cx: (e as MouseEvent).clientX, cy: (e as MouseEvent).clientY }

  const startDrag = (cx: number, cy: number) => {
    dragging.current = true
    dragStart.current = { cx, cy, ex: element.x, ey: element.y }
  }

  const startResize = (cx: number, cy: number, handle: string) => {
    resizing.current = handle
    resizeStart.current = {
      cx, cy, x: element.x, y: element.y, w: element.width, h: element.height,
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editMode) return
    e.stopPropagation()
    onSelect(element.id)
    startDrag(e.clientX, e.clientY)
  }

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation()
    e.preventDefault()
    startResize(e.clientX, e.clientY, handle)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (editMode) return
    e.stopPropagation()
    onSelect(element.id)
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY)
  }

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const { cx, cy } = getXY(e)
      if (dragging.current) {
        if ('preventDefault' in e) e.preventDefault()
        const dx = (cx - dragStart.current.cx) / scale
        const dy = (cy - dragStart.current.cy) / scale
        onUpdate(element.id, {
          x: dragStart.current.ex + dx,
          y: dragStart.current.ey + dy,
        } as Partial<PDFElement>)
      } else if (resizing.current) {
        if ('preventDefault' in e) e.preventDefault()
        const dx = (cx - resizeStart.current.cx) / scale
        const dy = (cy - resizeStart.current.cy) / scale
        const h = resizing.current
        let { x, y, w } = resizeStart.current
        let hi = resizeStart.current.h
        const minW = 8 / scale   // minimum 8 screen px
        const minH = 8 / scale
        if (h.includes('e')) w  = Math.max(minW, w + dx)
        if (h.includes('s')) hi = Math.max(minH, hi + dy)
        if (h.includes('w')) { const nw = Math.max(minW, w - dx); x += w - nw; w = nw }
        if (h.includes('n')) { const nh = Math.max(minH, hi - dy); y += hi - nh; hi = nh }
        onUpdate(element.id, { x, y, width: w, height: hi } as Partial<PDFElement>)
      }
    }

    const onUp = () => {
      dragging.current = false
      resizing.current = null
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove as EventListener, { passive: false })
    document.addEventListener('touchend', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove as EventListener)
      document.removeEventListener('touchend', onUp)
    }
  }, [scale, element.id, onUpdate])

  // Compute natural scaled size
  const scaledW = element.width  * scale
  const scaledH = element.height * scale

  // When selected, ensure the selection box is large enough to grab handles
  const isSmall = scaledW < MIN_SEL || scaledH < MIN_SEL
  const boxW = isSelected && isSmall ? Math.max(scaledW, MIN_SEL) : scaledW
  const boxH = isSelected && isSmall ? Math.max(scaledH, MIN_SEL) : scaledH
  const offX = (boxW - scaledW) / 2
  const offY = (boxH - scaledH) / 2

  // Use corner-only handles for small elements to avoid overlap
  const handles = isSmall ? CORNER_HANDLES : ALL_HANDLES

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x * scale - offX,
        top:  element.y * scale - offY,
        width:  boxW,
        height: boxH,
        cursor: editMode ? 'text' : 'move',
        border: isSelected ? '2px solid #00488d' : '2px solid transparent',
        borderRadius: 2,
        boxSizing: 'border-box',
        userSelect: editMode ? 'auto' : 'none',
        zIndex: isSelected ? 20 : 10,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={() => onSelect(element.id)}
    >
      {/* Content pinned to actual element position inside expanded box */}
      <div style={{
        position: 'absolute',
        left: offX, top: offY,
        width: scaledW, height: scaledH,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {children}
      </div>

      {isSelected && (
        <button
          style={{
            position: 'absolute', top: -14, right: -14,
            width: 24, height: 24, background: '#ba1a1a',
            border: 'none', borderRadius: '50%', cursor: 'pointer',
            color: '#fff', fontSize: 16, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60,
          }}
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onDelete(element.id) }}
        >×</button>
      )}

      {isSelected && Object.entries(handles).map(([h, pos]) => (
        <div
          key={h}
          className="resize-handle"
          style={pos}
          onMouseDown={e => handleResizeMouseDown(e, h)}
          onTouchStart={e => {
            e.stopPropagation()
            e.preventDefault()
            const t = e.touches[0]
            startResize(t.clientX, t.clientY, h)
          }}
        />
      ))}
    </div>
  )
}
