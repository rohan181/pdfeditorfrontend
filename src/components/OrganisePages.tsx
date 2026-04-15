'use client'
import { useState, useRef } from 'react'
import type { PageSlot } from '@/types'

interface Props {
  pageSlots: PageSlot[]
  currentSlotIdx: number
  onApply: (newSlots: PageSlot[], newIdx: number) => void
  onClose: () => void
}

type DeleteConfirm =
  | { kind: 'single'; idx: number }
  | { kind: 'multi';  count: number }

export default function OrganisePages({ pageSlots, currentSlotIdx, onApply, onClose }: Props) {
  const [slots, setSlots] = useState<PageSlot[]>(pageSlots)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set([currentSlotIdx]))
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null)

  const originalOrder = useRef<Map<string, number>>(
    new Map(pageSlots.map((s, i) => [s.id, i]))
  )

  // ── Drag reorder ─────────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx); e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
    if (overIdx !== idx) setOverIdx(idx)
  }
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) { resetDrag(); return }
    const next = [...slots]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(idx, 0, moved)
    setSlots(next)
    setSelected(new Set([idx]))
    resetDrag()
  }
  const resetDrag = () => { setDragIdx(null); setOverIdx(null) }

  // ── Selection ────────────────────────────────────────────────────────────────
  const toggleSelect = (idx: number, e: React.MouseEvent) => {
    if (e.shiftKey) {
      const n = new Set(selected); n.has(idx) ? n.delete(idx) : n.add(idx); setSelected(n)
    } else {
      setSelected(new Set([idx]))
    }
  }
  const selectAll  = () => setSelected(new Set(slots.map((_, i) => i)))
  const clearSel   = () => setSelected(new Set())

  // ── Single page actions ───────────────────────────────────────────────────────
  const moveUp = (idx: number) => {
    if (idx === 0) return
    const n = [...slots]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; setSlots(n)
    setSelected(new Set([idx - 1]))
  }
  const moveDown = (idx: number) => {
    if (idx >= slots.length - 1) return
    const n = [...slots]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; setSlots(n)
    setSelected(new Set([idx + 1]))
  }
  const rotateOneLeft  = (idx: number) => setSlots(prev => prev.map((s, i) => i !== idx ? s
    : { ...s, rotation: (((s.rotation || 0) - 90 + 360) % 360) as 0 | 90 | 180 | 270 }))
  const rotateOneRight = (idx: number) => setSlots(prev => prev.map((s, i) => i !== idx ? s
    : { ...s, rotation: (((s.rotation || 0) + 90) % 360) as 0 | 90 | 180 | 270 }))
  const deleteOne = (idx: number) => {
    if (slots.length <= 1) return
    setDeleteConfirm({ kind: 'single', idx })
  }

  // ── Multi / all actions ───────────────────────────────────────────────────────
  const deleteSelected = () => {
    if (slots.length - selected.size < 1) return
    setDeleteConfirm({ kind: 'multi', count: selected.size })
  }

  // ── Confirmed delete executors ────────────────────────────────────────────────
  const confirmDelete = () => {
    if (!deleteConfirm) return
    if (deleteConfirm.kind === 'single') {
      const { idx } = deleteConfirm
      const next = slots.filter((_, i) => i !== idx)
      setSlots(next)
      setSelected(new Set([Math.min(idx, next.length - 1)]))
      setHoveredIdx(null)
    } else {
      const next = slots.filter((_, i) => !selected.has(i))
      setSlots(next)
      setSelected(new Set([0]))
    }
    setDeleteConfirm(null)
  }
  const rotateSelectedLeft  = () => setSlots(prev => prev.map((s, i) =>
    !selected.has(i) ? s : { ...s, rotation: (((s.rotation || 0) - 90 + 360) % 360) as 0 | 90 | 180 | 270 }))
  const rotateSelectedRight = () => setSlots(prev => prev.map((s, i) =>
    !selected.has(i) ? s : { ...s, rotation: (((s.rotation || 0) + 90) % 360) as 0 | 90 | 180 | 270 }))
  const rotateAllLeft  = () => setSlots(prev => prev.map(s =>
    ({ ...s, rotation: (((s.rotation || 0) - 90 + 360) % 360) as 0 | 90 | 180 | 270 })))
  const rotateAllRight = () => setSlots(prev => prev.map(s =>
    ({ ...s, rotation: (((s.rotation || 0) + 90) % 360) as 0 | 90 | 180 | 270 })))

  const handleApply = () => {
    const firstSelected = Math.min(...Array.from(selected))
    onApply(slots, Math.min(firstSelected, slots.length - 1))
  }

  const allSelected = selected.size === slots.length
  const multiSel    = selected.size > 1

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(4,8,20,0.9)',
      display: 'flex', flexDirection: 'column',
      backdropFilter: 'blur(8px)',
      isolation: 'isolate',
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 58, flexShrink: 0,
        background: 'linear-gradient(90deg,#070d1c 0%,#0d1828 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        gap: 10,
      }}>
        {/* Left: icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg,#1d4ed8,#6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}>
            <GridIcon />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Manrope,sans-serif', letterSpacing: '-0.02em' }}>
              Organise Pages
            </p>
            <p style={{ margin: 0, fontSize: 10.5, color: '#475569' }}>
              {slots.length} pages · {selected.size} selected
            </p>
          </div>
        </div>

        {/* Right: action toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {/* Select all / clear */}
          <HBtn onClick={allSelected ? clearSel : selectAll} title={allSelected ? 'Clear selection' : 'Select all'} color="rgba(255,255,255,0.5)">
            {allSelected ? <DeselectIcon /> : <SelectAllIcon />}
            <span>{allSelected ? 'Clear' : 'All'}</span>
          </HBtn>

          <HDivider />

          {/* Rotate all or rotate selected */}
          {multiSel ? (
            <>
              <HBtn onClick={rotateSelectedLeft}  title={`Rotate selected ${selected.size} pages CCW`} color="#818cf8">
                <RotCCWIcon /> <span>Rot ← ({selected.size})</span>
              </HBtn>
              <HBtn onClick={rotateSelectedRight} title={`Rotate selected ${selected.size} pages CW`} color="#818cf8">
                <RotCWIcon /> <span>Rot → ({selected.size})</span>
              </HBtn>
            </>
          ) : (
            <>
              <HBtn onClick={rotateAllLeft}  title="Rotate ALL pages CCW" color="#94a3b8">
                <RotCCWIcon /> <span>All ←</span>
              </HBtn>
              <HBtn onClick={rotateAllRight} title="Rotate ALL pages CW" color="#94a3b8">
                <RotCWIcon /> <span>All →</span>
              </HBtn>
            </>
          )}

          <HDivider />

          {/* Delete selected */}
          {selected.size > 0 && slots.length > selected.size && (
            <HBtn onClick={deleteSelected} title={`Delete ${selected.size} selected page(s)`} color="#f87171" danger>
              <TrashIcon /> <span>Delete ({selected.size})</span>
            </HBtn>
          )}

          {/* Cancel + Apply */}
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <button onClick={handleApply} style={primaryBtn}>
            <CheckIcon /> Apply
          </button>
        </div>
      </div>

      {/* ── Sub-toolbar hint ── */}
      <div style={{
        padding: '7px 16px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.012)',
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
      }}>
        {[
          ['⠿', 'Drag to reorder'],
          ['⊙', 'Click to select'],
          ['⇧', 'Shift+click multi-select'],
          ['↻↺', 'Rotate buttons on each card'],
          ['#', 'Amber badge = moved from original'],
        ].map(([ic, lb]) => (
          <span key={lb} style={{ fontSize: 10, color: '#3b4a66', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#6366f1', fontWeight: 700 }}>{ic}</span> {lb}
          </span>
        ))}
      </div>

      {/* ── Grid ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 28px' }} className="thin-scroll">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
          gap: 20,
        }}>
          {slots.map((slot, idx) => {
            const isDragging = dragIdx === idx
            const isOver     = overIdx === idx && dragIdx !== idx
            const isSel      = selected.has(idx)
            const isHov      = hoveredIdx === idx
            const isCurrentPage = slot.id === pageSlots[currentSlotIdx]?.id
            const origIdx    = originalOrder.current.get(slot.id) ?? idx
            const moved      = origIdx !== idx
            const ar         = slot.baseWidth && slot.baseHeight
              ? (slot.rotation === 90 || slot.rotation === 270
                  ? slot.baseHeight / slot.baseWidth
                  : slot.baseWidth / slot.baseHeight)
              : 0.707

            return (
              <div
                key={slot.id}
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={e => handleDrop(e, idx)}
                onDragEnd={resetDrag}
                onClick={e => toggleSelect(idx, e)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  cursor: 'grab',
                  opacity: isDragging ? 0.25 : 1,
                  transition: 'opacity 0.15s, transform 0.15s',
                  transform: isOver ? 'scale(1.04) translateY(-3px)' : 'scale(1)',
                  userSelect: 'none',
                }}
              >
                {/* Drop indicator */}
                {isOver && !isDragging && (
                  <div style={{
                    height: 3, borderRadius: 2, marginBottom: 6,
                    background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                    boxShadow: '0 0 8px rgba(99,102,241,0.7)',
                  }} />
                )}

                {/* ── Card ── */}
                <div style={{
                  borderRadius: 11,
                  border: `2px solid ${isSel ? '#6366f1' : isCurrentPage ? '#1d4ed8' : isHov ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
                  overflow: 'hidden',
                  background: isSel ? 'rgba(99,102,241,0.1)' : 'rgba(10,18,40,0.9)',
                  boxShadow: isSel
                    ? '0 0 0 3px rgba(99,102,241,0.22), 0 8px 24px rgba(0,0,0,0.6)'
                    : isHov ? '0 6px 20px rgba(0,0,0,0.5)' : '0 3px 12px rgba(0,0,0,0.4)',
                  transition: 'border-color 0.14s, box-shadow 0.14s',
                }}>

                  {/* Thumbnail */}
                  <div style={{ position: 'relative', aspectRatio: String(ar), overflow: 'hidden', background: '#050a18' }}>
                    {slot.thumbUrl ? (
                      <img src={slot.thumbUrl} alt={`Page ${idx + 1}`}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                          transform: slot.rotation ? `rotate(${slot.rotation}deg) scale(${slot.rotation === 90 || slot.rotation === 270 ? ar : 1})` : undefined,
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg,#0d1629,#1a2640)',
                      }}>
                        <span style={{ fontSize: 32, opacity: 0.2 }}>
                          {slot.type === 'blank' ? '□' : slot.type === 'image' ? '🖼' : '📄'}
                        </span>
                      </div>
                    )}

                    {/* CURRENT badge */}
                    {isCurrentPage && (
                      <div style={{
                        position: 'absolute', top: 5, left: 5,
                        background: 'linear-gradient(135deg,#1d4ed8,#6366f1)',
                        color: '#fff', fontSize: 7.5, fontWeight: 800,
                        borderRadius: 4, padding: '2px 5px',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        boxShadow: '0 2px 6px rgba(99,102,241,0.55)',
                      }}>CURRENT</div>
                    )}

                    {/* Moved badge */}
                    {moved && (
                      <div style={{
                        position: 'absolute', top: 5, right: 5,
                        background: 'rgba(245,158,11,0.88)',
                        color: '#fff', fontSize: 7.5, fontWeight: 800,
                        borderRadius: 4, padding: '2px 5px',
                        display: 'flex', alignItems: 'center', gap: 2,
                      }}>
                        #{origIdx + 1}→#{idx + 1}
                      </div>
                    )}

                    {/* Rotation badge */}
                    {(slot.rotation || 0) > 0 && (
                      <div style={{
                        position: 'absolute', bottom: 5, left: 5,
                        background: 'rgba(99,102,241,0.85)',
                        color: '#fff', fontSize: 7.5, fontWeight: 800,
                        borderRadius: 4, padding: '2px 5px',
                      }}>↻{slot.rotation}°</div>
                    )}

                    {/* Delete button on hover / selection */}
                    {slots.length > 1 && (isSel || isHov) && (
                      <button
                        onClick={e => { e.stopPropagation(); deleteOne(idx) }}
                        title="Delete this page"
                        style={{
                          position: 'absolute', bottom: 5, right: 5,
                          width: 22, height: 22, borderRadius: '50%', border: 'none',
                          background: 'rgba(239,68,68,0.9)', color: '#fff',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                          transition: 'transform 0.14s',
                          zIndex: 4,
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.18)'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding: '6px 8px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 800,
                      color: isSel ? '#818cf8' : isCurrentPage ? '#60a5fa' : '#94a3b8',
                      fontFamily: 'Manrope,sans-serif',
                    }}>{idx + 1}</span>
                    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      {slot.type !== 'pdf' && (
                        <span style={{
                          fontSize: 7.5, fontWeight: 700, color: '#475569',
                          background: 'rgba(255,255,255,0.06)', padding: '1px 4px', borderRadius: 3,
                          textTransform: 'uppercase',
                        }}>{slot.type}</span>
                      )}
                      {!moved && (
                        <span style={{ fontSize: 8.5, color: '#2d3a50', fontStyle: 'italic' }}>#{origIdx + 1}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Action row below card ── */}
                <div style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  gap: 4, marginTop: 6,
                  opacity: isSel || isHov ? 1 : 0.22,
                  transition: 'opacity 0.18s',
                }}>
                  {/* Move left */}
                  <CardBtn disabled={idx === 0} onClick={e => { e.stopPropagation(); moveUp(idx) }} title="Move left">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </CardBtn>

                  {/* Rotate CCW — prominent */}
                  <CardRotBtn dir="left" onClick={e => { e.stopPropagation(); rotateOneLeft(idx) }} title="Rotate left (CCW)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 2v6h6"/><path d="M2.66 15.57a10 10 0 1 0 .57-8.38"/>
                    </svg>
                  </CardRotBtn>

                  {/* Rotate CW — prominent */}
                  <CardRotBtn dir="right" onClick={e => { e.stopPropagation(); rotateOneRight(idx) }} title="Rotate right (CW)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/>
                    </svg>
                  </CardRotBtn>

                  {/* Move right */}
                  <CardBtn disabled={idx >= slots.length - 1} onClick={e => { e.stopPropagation(); moveDown(idx) }} title="Move right">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </CardBtn>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Delete confirmation dialog ── */}
      {deleteConfirm && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 600,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'linear-gradient(160deg,#0d1628 0%,#111c34 100%)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 18,
            padding: '32px 36px',
            maxWidth: 380, width: '90%',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(239,68,68,0.12)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
          }}>
            {/* Icon */}
            <div style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'rgba(239,68,68,0.12)',
              border: '1.5px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>

            {/* Text */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Manrope,sans-serif' }}>
                Delete {deleteConfirm.kind === 'single' ? 'page' : `${deleteConfirm.count} pages`}?
              </p>
              <p style={{ margin: 0, fontSize: 12.5, color: '#64748b', lineHeight: 1.55 }}>
                {deleteConfirm.kind === 'single'
                  ? `Page ${deleteConfirm.idx + 1} will be permanently removed from this document.`
                  : `${deleteConfirm.count} selected page${deleteConfirm.count > 1 ? 's' : ''} will be permanently removed. This cannot be undone.`}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  transition: 'background 0.14s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                Keep it
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                  color: '#fff',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
                  transition: 'opacity 0.14s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        padding: '9px 16px', flexShrink: 0,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 10.5, color: '#3b4a66' }}>
          {selected.size} of {slots.length} selected
          {' · '}
          {slots.filter((s, i) => (originalOrder.current.get(s.id) ?? i) !== i).length} repositioned
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {multiSel && (
            <>
              <HBtn onClick={rotateSelectedLeft}  title="Rotate selected CCW" color="#818cf8">
                <RotCCWIcon /><span>Rot ← ({selected.size})</span>
              </HBtn>
              <HBtn onClick={rotateSelectedRight} title="Rotate selected CW" color="#818cf8">
                <RotCWIcon /><span>Rot → ({selected.size})</span>
              </HBtn>
            </>
          )}
          {selected.size > 0 && slots.length > selected.size && (
            <HBtn onClick={deleteSelected} title="Delete selected" color="#f87171" danger>
              <TrashIcon /><span>Delete ({selected.size})</span>
            </HBtn>
          )}
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <button onClick={handleApply} style={primaryBtn}><CheckIcon /> Apply Order</button>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function HBtn({ onClick, title, color, danger, children }: {
  onClick: () => void; title?: string; color: string; danger?: boolean; children: React.ReactNode
}) {
  return (
    <button onClick={onClick} title={title} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 11px', borderRadius: 8, border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
      background: danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)',
      color, fontSize: 11, fontWeight: 700, cursor: 'pointer',
      transition: 'background 0.14s',
    }}
    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = danger ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.13)'}
    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)'}
    >{children}</button>
  )
}

function HDivider() {
  return <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
}

function CardBtn({ disabled, onClick, title, children }: {
  disabled: boolean; onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode
}) {
  return (
    <button disabled={disabled} onClick={onClick} title={title} style={{
      width: 26, height: 26, borderRadius: 7,
      border: `1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)'}`,
      background: disabled ? 'transparent' : 'rgba(255,255,255,0.07)',
      color: disabled ? '#1e293b' : '#64748b',
      cursor: disabled ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.13s, color 0.13s',
    }}
    onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8' } }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = disabled ? 'transparent' : 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = disabled ? '#1e293b' : '#64748b' }}
    >{children}</button>
  )
}

function CardRotBtn({ dir, onClick, title, children }: {
  dir: 'left' | 'right'; onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode
}) {
  const col = dir === 'left' ? '#818cf8' : '#a78bfa'
  const bg  = dir === 'left' ? 'rgba(99,102,241,0.15)' : 'rgba(139,92,246,0.15)'
  return (
    <button onClick={onClick} title={title} style={{
      width: 32, height: 32, borderRadius: 9,
      border: `1.5px solid ${dir === 'left' ? 'rgba(99,102,241,0.35)' : 'rgba(139,92,246,0.35)'}`,
      background: bg, color: col, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.13s, transform 0.13s',
      boxShadow: `0 2px 6px ${dir === 'left' ? 'rgba(99,102,241,0.2)' : 'rgba(139,92,246,0.2)'}`,
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.background = dir === 'left' ? 'rgba(99,102,241,0.3)' : 'rgba(139,92,246,0.3)'
      ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)'
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.background = bg
      ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
    }}
    >{children}</button>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────
const GridIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
const CheckIcon     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const TrashIcon     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
const RotCCWIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2v6h6"/><path d="M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
const RotCWIcon     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
const SelectAllIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 11 12 14 22 4"/></svg>
const DeselectIcon  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>

// ── Button styles ─────────────────────────────────────────────────────────────
const primaryBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '6px 15px', borderRadius: 9, border: 'none',
  background: 'linear-gradient(135deg,#1d4ed8,#6366f1)',
  color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 3px 12px rgba(99,102,241,0.4)',
}
const ghostBtn: React.CSSProperties = {
  padding: '6px 13px', borderRadius: 9,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
  fontSize: 12, cursor: 'pointer',
}
