'use client'
import { useRef, useEffect, useState } from 'react'

interface Props {
  onApply: (dataUrl: string) => void
  onClose: () => void
  savedSignature?: string | null
}

export default function SignatureModal({ onApply, onClose, savedSignature }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const drawing     = useRef(false)
  const lastPos     = useRef<{ x: number; y: number } | null>(null)
  const [isEmpty, setIsEmpty]   = useState(true)
  const [penColor, setPenColor] = useState('#1b1c1c')
  const [penSize, setPenSize]   = useState(2)
  const [tab, setTab]           = useState<'draw' | 'saved'>(savedSignature ? 'saved' : 'draw')

  // ── Mutable refs so event handlers always read latest values ──────────────
  // (no useCallback deps needed → listeners registered exactly once)
  const colorRef = useRef(penColor)
  const sizeRef  = useRef(penSize)
  colorRef.current = penColor
  sizeRef.current  = penSize

  // ── Coordinate helper ─────────────────────────────────────────────────────
  function getPos(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    const src  = 'touches' in e ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left)  * (canvas.width  / rect.width),
      y: (src.clientY - rect.top)   * (canvas.height / rect.height),
    }
  }

  // ── Register listeners once per canvas mount ──────────────────────────────
  // The [tab] dependency ensures re-registration when the draw tab mounts
  useEffect(() => {
    if (tab !== 'draw') return
    const canvas = canvasRef.current
    if (!canvas) return

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      drawing.current = true
      const pos = getPos(e, canvas)
      lastPos.current = pos
      // draw a dot for single taps/clicks
      const ctx = canvas.getContext('2d')!
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, sizeRef.current / 2, 0, Math.PI * 2)
      ctx.fillStyle = colorRef.current
      ctx.fill()
      setIsEmpty(false)
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!drawing.current || !lastPos.current) return
      e.preventDefault()
      const ctx = canvas.getContext('2d')!
      const pos = getPos(e, canvas)
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.lineWidth   = sizeRef.current
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.strokeStyle = colorRef.current
      ctx.stroke()
      lastPos.current = pos
      setIsEmpty(false)
    }

    const onUp = () => { drawing.current = false; lastPos.current = null }

    canvas.addEventListener('mousedown',  onDown)
    canvas.addEventListener('mousemove',  onMove)
    canvas.addEventListener('mouseup',    onUp)
    canvas.addEventListener('mouseleave', onUp)
    canvas.addEventListener('touchstart', onDown,  { passive: false })
    canvas.addEventListener('touchmove',  onMove,  { passive: false })
    canvas.addEventListener('touchend',   onUp)

    return () => {
      canvas.removeEventListener('mousedown',  onDown)
      canvas.removeEventListener('mousemove',  onMove)
      canvas.removeEventListener('mouseup',    onUp)
      canvas.removeEventListener('mouseleave', onUp)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchmove',  onMove)
      canvas.removeEventListener('touchend',   onUp)
    }
  }, [tab]) // re-run when tab switches to 'draw' so canvas is mounted

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  const handleApply = () => {
    if (tab === 'saved' && savedSignature) { onApply(savedSignature); return }
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return
    onApply(canvas.toDataURL('image/png'))
  }

  const canApply = tab === 'saved' ? !!savedSignature : !isEmpty

  // ── Shared small button style ─────────────────────────────────────────────
  const pill = (active: boolean, accent = '#6366f1'): React.CSSProperties => ({
    padding: '5px 13px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontSize: 11.5, fontWeight: 700,
    background: active ? `linear-gradient(135deg,${accent},${accent}cc)` : '#f1f5f9',
    color: active ? '#fff' : '#64748b',
    boxShadow: active ? `0 2px 8px ${accent}55` : 'none',
    transition: 'all 0.15s',
  })

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      onTouchEnd={e => e.stopPropagation()}
    >
      <div style={{
        background: '#fff', borderRadius: 20, padding: '24px 26px',
        width: '100%', maxWidth: 500,
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        maxHeight: '92vh', overflowY: 'auto',
      }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#0f172a' }}>
              Add Signature
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748b' }}>
              Draw your signature or reuse a saved one
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, border: '1px solid #e2e8f0',
            background: '#f8faff', cursor: 'pointer', fontSize: 15, color: '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: '#f1f5f9', borderRadius: 11, padding: 4 }}>
          {([
            { id: 'draw', label: 'Draw New',       icon: '✏️' },
            { id: 'saved', label: savedSignature ? 'Use Previous' : 'No Saved', icon: '🔄' },
          ] as const).map(t => (
            <button key={t.id}
              disabled={t.id === 'saved' && !savedSignature}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '7px 10px', borderRadius: 8, border: 'none',
                cursor: t.id === 'saved' && !savedSignature ? 'not-allowed' : 'pointer',
                fontSize: 12, fontWeight: 700,
                background: tab === t.id ? '#fff' : 'transparent',
                color: tab === t.id ? '#6366f1' : (t.id === 'saved' && !savedSignature ? '#c8d3e0' : '#64748b'),
                boxShadow: tab === t.id ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Draw tab ───────────────────────────────────────────── */}
        {tab === 'draw' && (
          <>
            {/* Pen options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
              {/* Ink colors */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Ink</span>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {['#1b1c1c', '#1d4ed8', '#dc2626', '#7c3aed', '#047857'].map(c => (
                    <button key={c} onClick={() => setPenColor(c)} style={{
                      width: 22, height: 22, borderRadius: '50%', background: c,
                      border: 'none', cursor: 'pointer',
                      outline: penColor === c ? '2.5px solid #6366f1' : '2px solid transparent',
                      outlineOffset: 2,
                    }} />
                  ))}
                  <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)}
                    title="Custom colour"
                    style={{ width: 22, height: 22, border: 'none', borderRadius: 5, cursor: 'pointer', padding: 1 }} />
                </div>
              </div>
              {/* Thickness */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Thickness {penSize}px</span>
                <input
                  type="range" min={1} max={10} step={1} value={penSize}
                  onChange={e => setPenSize(parseInt(e.target.value))}
                  style={{ flex: 1, minWidth: 0, accentColor: '#6366f1', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Canvas */}
            <div style={{
              position: 'relative',
              border: '2px solid #e2e8f0', borderRadius: 12, overflow: 'hidden',
              background: '#fafbff',
              boxShadow: 'inset 0 1px 6px rgba(0,0,0,0.04)',
            }}>
              {/* Baseline guide */}
              <div style={{
                position: 'absolute', left: 12, right: 12,
                top: '70%', borderTop: '1px dashed #dde4f0',
                pointerEvents: 'none', zIndex: 1,
              }} />
              <canvas
                ref={canvasRef}
                width={920}
                height={400}
                className="sig-canvas"
                style={{ display: 'block', width: '100%', height: 200, position: 'relative', zIndex: 2 }}
              />
              {isEmpty && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none', zIndex: 3,
                }}>
                  <span style={{ fontSize: 13, color: '#c8d3e0', fontStyle: 'italic' }}>
                    Draw your signature here…
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 10.5, color: '#94a3b8' }}>
                {isEmpty ? 'Start drawing to enable Apply' : 'Looking good — apply when ready'}
              </span>
              <button onClick={clearCanvas} style={{
                padding: '4px 12px', borderRadius: 7, border: '1px solid #e2e8f0',
                background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              }}>Clear</button>
            </div>
          </>
        )}

        {/* ── Saved tab ──────────────────────────────────────────── */}
        {tab === 'saved' && (
          <div style={{
            border: '2px solid #fde68a', borderRadius: 12,
            background: 'linear-gradient(135deg,#fffbeb,#fef9f0)',
            padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            minHeight: 160,
          }}>
            {savedSignature ? (
              <>
                <div style={{
                  background: '#fff', borderRadius: 8, padding: '12px 20px',
                  border: '1px solid #fde68a', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={savedSignature} alt="Saved signature" draggable={false}
                    style={{ maxWidth: '100%', maxHeight: 110, objectFit: 'contain', userSelect: 'none' }} />
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#92400e', fontWeight: 600, textAlign: 'center' }}>
                  This signature will be placed on the page. Switch to "Draw New" to create a different one.
                </p>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: '#92400e', textAlign: 'center' }}>
                No saved signature yet — draw one first.
              </p>
            )}
          </div>
        )}

        {/* ── Footer actions ─────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
          <button onClick={onClose} style={{
            padding: '8px 18px', borderRadius: 9, border: '1px solid #e2e8f0',
            background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            Cancel
          </button>
          <button onClick={handleApply} disabled={!canApply} style={{
            padding: '9px 24px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
            background: canApply
              ? (tab === 'saved'
                  ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                  : 'linear-gradient(135deg,#6366f1,#818cf8)')
              : '#e2e8f0',
            color: canApply ? '#fff' : '#94a3b8',
            cursor: canApply ? 'pointer' : 'not-allowed',
            boxShadow: canApply
              ? (tab === 'saved' ? '0 3px 12px rgba(245,158,11,0.35)' : '0 3px 12px rgba(99,102,241,0.35)')
              : 'none',
            transition: 'all 0.15s',
          }}>
            Place Signature
          </button>
        </div>

      </div>
    </div>
  )
}
