'use client'
import { useEffect, useRef } from 'react'
import type { PDFElement } from '@/types'

const HANDLES: Record<string, React.CSSProperties> = {
  n:  { top: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' },
  ne: { top: -5, right: -5, cursor: 'ne-resize' },
  e:  { right: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'e-resize' },
  se: { bottom: -5, right: -5, cursor: 'se-resize' },
  s:  { bottom: -5, left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' },
  sw: { bottom: -5, left: -5, cursor: 'sw-resize' },
  w:  { left: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'w-resize' },
  nw: { top: -5, left: -5, cursor: 'nw-resize' },
}

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
  const dragging = useRef(false)
  const resizing = useRef<string | null>(null)
  const dragStart  = useRef({ cx: 0, cy: 0, ex: 0, ey: 0 })
  const resizeStart = useRef({ cx: 0, cy: 0, x: 0, y: 0, w: 0, h: 0 })

  /** Normalise mouse / touch into a single {cx, cy} */
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

  // Mouse handlers
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

  // Touch handlers
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
        if (h.includes('e')) w = Math.max(40, w + dx)
        if (h.includes('s')) hi = Math.max(20, hi + dy)
        if (h.includes('w')) { x += dx; w = Math.max(40, w - dx) }
        if (h.includes('n')) { y += dy; hi = Math.max(20, hi - dy) }
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

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
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
      {children}

      {isSelected && (
        <button
          style={{
            position: 'absolute', top: -13, right: -13,
            width: 22, height: 22, background: '#ba1a1a',
            border: 'none', borderRadius: '50%', cursor: 'pointer',
            color: '#fff', fontSize: 15, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60,
          }}
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onDelete(element.id) }}
        >×</button>
      )}

      {isSelected && Object.entries(HANDLES).map(([h, pos]) => (
        <div
          key={h}
          className="resize-handle"
          style={pos}
          onMouseDown={e => handleResizeMouseDown(e, h)}
        />
      ))}
    </div>
  )
}
