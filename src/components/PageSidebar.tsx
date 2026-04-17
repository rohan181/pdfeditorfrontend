'use client'
import { useState } from 'react'
import type React from 'react'
import type { PageSlot } from '@/types'

interface Props {
  pageSlots: PageSlot[]
  currentSlotIdx: number
  onPageChange: (idx: number) => void
  onDuplicate: (idx: number) => void
  onDelete: (idx: number) => void
  onMoveUp: (idx: number) => void
  onMoveDown: (idx: number) => void
  onRotate: (idx: number) => void
  onRotateLeft?: (idx: number) => void
  onAddBelow: (idx: number) => void
  onOrganise: () => void
  sidebarListRef?: React.RefObject<HTMLDivElement>
  onGoToFirst: () => void
  onGoToLast: () => void
  onAddAtStart: () => void
  onAddAtEnd: () => void
  onAddImageAt: (insertBefore: number) => void
  onAddPDFAt: (insertBefore: number) => void
}

export default function PageSidebar({
  pageSlots, currentSlotIdx, onPageChange,
  onDuplicate, onDelete, onMoveUp, onMoveDown,
  onRotate, onRotateLeft, onAddBelow,
  onOrganise,
  sidebarListRef, onGoToFirst, onGoToLast,
  onAddAtStart, onAddAtEnd, onAddImageAt, onAddPDFAt,
}: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIdx !== idx) setOverIdx(idx)
  }
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) { resetDrag(); return }
    // Emit as move-up/move-down chain — simplest: tell parent via up/down combos
    // We expose this via a combined move handler
    if (dragIdx < idx) {
      for (let i = dragIdx; i < idx; i++) onMoveDown(dragIdx)
    } else {
      for (let i = dragIdx; i > idx; i--) onMoveUp(dragIdx)
    }
    resetDrag()
  }
  const resetDrag = () => { setDragIdx(null); setOverIdx(null) }

  return (
    <aside style={{
      width: 176,
      height: '100%',
      background: 'linear-gradient(180deg, #f5f7ff 0%, #eef1f8 100%)',
      borderRight: '1px solid #dde3f0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 10px 8px',
        borderBottom: '1px solid #dde3f0',
        background: 'rgba(255,255,255,0.7)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 5,
              background: 'linear-gradient(135deg, #1d4ed8, #4f6ef7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PagesIcon />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#1e293b', fontFamily: 'Manrope, sans-serif' }}>Pages</p>
              <p style={{ margin: 0, fontSize: 9.5, color: '#94a3b8' }}>{pageSlots.length} total</p>
            </div>
          </div>
          {/* Page counter badge */}
          <div style={{
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            color: '#fff', borderRadius: 20, padding: '2px 8px',
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.03em',
          }}>
            {currentSlotIdx + 1} / {pageSlots.length}
          </div>
        </div>

        {/* Top / Bottom navigation */}
        <div style={{ display: 'flex', gap: 5 }}>
          <button
            onClick={onGoToFirst}
            disabled={currentSlotIdx === 0}
            title="Go to first page"
            style={{
              flex: 1, padding: '5px 4px', borderRadius: 7,
              border: '1.5px solid #dde3f0',
              background: currentSlotIdx === 0 ? '#f8faff' : 'rgba(79,110,247,0.06)',
              color: currentSlotIdx === 0 ? '#c8d3e8' : '#4f6ef7',
              fontSize: 10, fontWeight: 700,
              cursor: currentSlotIdx === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (currentSlotIdx !== 0) e.currentTarget.style.background = 'rgba(79,110,247,0.14)' }}
            onMouseLeave={e => { if (currentSlotIdx !== 0) e.currentTarget.style.background = 'rgba(79,110,247,0.06)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>
            First
          </button>
          <button
            onClick={onGoToLast}
            disabled={currentSlotIdx === pageSlots.length - 1}
            title="Go to last page"
            style={{
              flex: 1, padding: '5px 4px', borderRadius: 7,
              border: '1.5px solid #dde3f0',
              background: currentSlotIdx === pageSlots.length - 1 ? '#f8faff' : 'rgba(79,110,247,0.06)',
              color: currentSlotIdx === pageSlots.length - 1 ? '#c8d3e8' : '#4f6ef7',
              fontSize: 10, fontWeight: 700,
              cursor: currentSlotIdx === pageSlots.length - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (currentSlotIdx !== pageSlots.length - 1) e.currentTarget.style.background = 'rgba(79,110,247,0.14)' }}
            onMouseLeave={e => { if (currentSlotIdx !== pageSlots.length - 1) e.currentTarget.style.background = 'rgba(79,110,247,0.06)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>
            Last
          </button>
        </div>

        {/* Organise button */}
        <button
          onClick={onOrganise}
          style={{
            width: '100%', padding: '5px 8px', borderRadius: 7,
            border: '1.5px solid #c7d2fe',
            background: 'rgba(79,110,247,0.06)',
            color: '#4f6ef7', fontSize: 10.5, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(79,110,247,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(79,110,247,0.06)')}
        >
          <GridIcon2 />
          Organise Pages
        </button>
      </div>

      {/* Thumbnail list */}
      <div
        ref={sidebarListRef}
        className="thin-scroll"
        style={{ flex: 1, overflowY: 'auto', padding: '6px 8px 6px', display: 'flex', flexDirection: 'column', gap: 0 }}
      >
        {/* Insert zone before first page */}
        <SidebarInsertZone
          onInsertBlank={onAddAtStart}
          onInsertImage={() => onAddImageAt(0)}
          onInsertPDF={() => onAddPDFAt(0)}
        />

        {pageSlots.map((slot, idx) => {
          const active = idx === currentSlotIdx
          const hovered = hoveredIdx === idx
          const isDragging = dragIdx === idx
          const isOver = overIdx === idx && dragIdx !== null && dragIdx !== idx
          const ar = slot.baseWidth && slot.baseHeight ? slot.baseWidth / slot.baseHeight : 0.707

          return (
            <div key={slot.id} data-slot-idx={idx} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Drop indicator above */}
              {isOver && dragIdx! > idx && (
                <div style={{ height: 3, borderRadius: 2, background: '#4f6ef7', margin: '2px 4px' }} />
              )}

              {/* Page card */}
              <div
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={e => handleDrop(e, idx)}
                onDragEnd={resetDrag}
                onClick={() => onPageChange(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  cursor: 'pointer',
                  opacity: isDragging ? 0.4 : 1,
                  transition: 'opacity 0.12s',
                  userSelect: 'none',
                  paddingBottom: 6,
                }}
              >
                {/* Thumbnail card */}
                <div style={{
                  borderRadius: 8,
                  border: active
                    ? '2px solid #4f6ef7'
                    : isOver
                      ? '2px solid #93c5fd'
                      : '2px solid transparent',
                  boxShadow: active
                    ? '0 0 0 3px rgba(79,110,247,0.15), 0 4px 12px rgba(0,0,0,0.10)'
                    : hovered
                      ? '0 4px 12px rgba(0,0,0,0.12)'
                      : '0 2px 6px rgba(0,0,0,0.08)',
                  background: '#fff',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.15s, border-color 0.15s',
                }}>
                  {/* Thumbnail image area */}
                  <div style={{ aspectRatio: String(ar), overflow: 'hidden', background: '#f0f4ff', position: 'relative' }}>
                    {slot.thumbUrl ? (
                      <img
                        src={slot.thumbUrl}
                        alt={`Page ${idx + 1}`}
                        draggable={false}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: slot.type === 'blank' ? '#fafbff' : '#f0f4ff',
                      }}>
                        <span style={{ fontSize: 22, opacity: 0.25 }}>
                          {slot.type === 'blank' ? '□' : slot.type === 'image' ? '🖼' : '📄'}
                        </span>
                      </div>
                    )}
                    {/* Rotation badge */}
                    {(slot.rotation || 0) > 0 && (
                      <div style={{
                        position: 'absolute', bottom: 3, right: 3,
                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                        fontSize: 8.5, fontWeight: 700, borderRadius: 4,
                        padding: '1px 4px', letterSpacing: '0.03em',
                      }}>
                        {slot.rotation}°
                      </div>
                    )}
                  </div>

                  {/* Hover action bar */}
                  {hovered && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexWrap: 'wrap', gap: 2,
                      padding: '5px 4px',
                      background: 'rgba(248,250,255,0.98)',
                      borderTop: '1px solid #eef1f8',
                    }}>
                      {idx > 0 && (
                        <ActionBtn title="Move up" onClick={e => { e.stopPropagation(); onMoveUp(idx) }}>
                          <UpIcon />
                        </ActionBtn>
                      )}
                      {idx < pageSlots.length - 1 && (
                        <ActionBtn title="Move down" onClick={e => { e.stopPropagation(); onMoveDown(idx) }}>
                          <DownIcon />
                        </ActionBtn>
                      )}
                      {onRotateLeft && (
                        <ActionBtn title="Rotate left 90°" onClick={e => { e.stopPropagation(); onRotateLeft(idx) }}>
                          <RotateCCWIcon />
                        </ActionBtn>
                      )}
                      <ActionBtn title="Rotate right 90°" onClick={e => { e.stopPropagation(); onRotate(idx) }}>
                        <RotateCWIcon />
                      </ActionBtn>
                      <ActionBtn title="Duplicate" onClick={e => { e.stopPropagation(); onDuplicate(idx) }}>
                        <CopyIcon />
                      </ActionBtn>
                      {pageSlots.length > 1 && (
                        <ActionBtn title="Delete page" onClick={e => { e.stopPropagation(); onDelete(idx) }} danger>
                          <TrashIcon />
                        </ActionBtn>
                      )}
                    </div>
                  )}
                </div>

                {/* Page label */}
                <p style={{
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#4f6ef7' : '#8898b8',
                  margin: '3px 0 0',
                  letterSpacing: '0.02em',
                  lineHeight: 1.2,
                }}>
                  {idx + 1}
                  {slot.type === 'blank' && <span style={{ marginLeft: 3, opacity: 0.4, fontSize: 8.5, textTransform: 'uppercase' }}>blank</span>}
                  {slot.type === 'image' && <span style={{ marginLeft: 3, opacity: 0.4, fontSize: 8.5, textTransform: 'uppercase' }}>img</span>}
                </p>
              </div>

              {/* Drop indicator below */}
              {isOver && dragIdx! < idx && (
                <div style={{ height: 3, borderRadius: 2, background: '#4f6ef7', margin: '2px 4px' }} />
              )}

              {/* Insert zone after this page */}
              <SidebarInsertZone
                onInsertBlank={() => onAddBelow(idx)}
                onInsertImage={() => onAddImageAt(idx + 1)}
                onInsertPDF={() => onAddPDFAt(idx + 1)}
                last={idx === pageSlots.length - 1}
              />
            </div>
          )
        })}

        <div style={{ height: 4 }} />
      </div>

    </aside>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SidebarInsertZone({
  onInsertBlank, onInsertImage, onInsertPDF,
}: {
  onInsertBlank: () => void
  onInsertImage: () => void
  onInsertPDF: () => void
  last?: boolean
}) {
  const [open, setOpen] = useState(false)
  const btns = [
    { label: 'Page', color: '#4f6ef7', bg: 'rgba(79,110,247,0.09)', bgH: 'rgba(79,110,247,0.20)', border: '#93c5fd', onClick: onInsertBlank },
    { label: 'Image', color: '#0e7490', bg: 'rgba(14,116,144,0.08)', bgH: 'rgba(14,116,144,0.18)', border: '#67e8f9', onClick: onInsertImage },
    { label: 'PDF',  color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', bgH: 'rgba(124,58,237,0.18)', border: '#c4b5fd', onClick: onInsertPDF },
  ]

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Always-visible trigger row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 2px' }}>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0', borderRadius: 1 }} />
        <button
          onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
          title="Insert page here"
          style={{
            width: 20, height: 20, borderRadius: '50%',
            border: `1.5px ${open ? 'solid' : 'dashed'} #4f6ef7`,
            background: open ? '#4f6ef7' : 'rgba(79,110,247,0.07)',
            color: open ? '#fff' : '#4f6ef7',
            fontSize: 14, fontWeight: 700, lineHeight: 1,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.14s, color 0.14s, border 0.14s',
          }}
          onMouseEnter={e => {
            if (!open) e.currentTarget.style.background = 'rgba(79,110,247,0.18)'
          }}
          onMouseLeave={e => {
            if (!open) e.currentTarget.style.background = 'rgba(79,110,247,0.07)'
          }}
        >
          {open ? '×' : '+'}
        </button>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0', borderRadius: 1 }} />
      </div>

      {/* Expanded options */}
      {open && (
        <div style={{ display: 'flex', gap: 3, padding: '2px 2px 4px' }}>
          {btns.map(btn => (
            <button
              key={btn.label}
              onClick={e => { e.stopPropagation(); btn.onClick(); setOpen(false) }}
              style={{
                flex: 1, padding: '5px 2px', borderRadius: 7,
                border: `1.5px solid ${btn.border}`,
                background: btn.bg,
                color: btn.color, fontSize: 9, fontWeight: 700,
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = btn.bgH)}
              onMouseLeave={e => (e.currentTarget.style.background = btn.bg)}
            >
              {btn.label === 'Page'  && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
              {btn.label === 'Image' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
              {btn.label === 'PDF'   && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ActionBtn({ title, onClick, children, danger }: {
  title: string
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 24, height: 24, borderRadius: 6,
        border: `1px solid ${danger ? '#fca5a5' : '#e2e8f0'}`,
        background: danger ? '#fff1f2' : '#fff',
        color: danger ? '#dc2626' : '#4f6ef7',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? '#fee2e2' : '#f0f4ff' }}
      onMouseLeave={e => { e.currentTarget.style.background = danger ? '#fff1f2' : '#fff' }}
    >{children}</button>
  )
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const PagesIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const GridIcon2 = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const UpIcon   = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
const DownIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
const RotateCCWIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
const RotateCWIcon  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
const CopyIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
const TrashIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
