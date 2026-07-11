'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

function fmtBytes(b: number) {
  return b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`
}

// ── Thumbnail card ───────────────────────────────────────────────────────────
function ThumbCard({
  pageNum, dataUrl, rotation, selected, loading,
  onToggle, onRotateCW, onRotateCCW,
}: {
  pageNum: number; dataUrl: string | null; rotation: number; selected: boolean; loading: boolean
  onToggle: () => void; onRotateCW: (e: React.MouseEvent) => void; onRotateCCW: (e: React.MouseEvent) => void
}) {
  const rotLabel = rotation === 0 ? '' : `${rotation}°`
  const is90 = rotation === 90 || rotation === 270

  return (
    <div
      onClick={onToggle}
      style={{
        background: selected ? '#ede9fe' : '#fff',
        border: `2px solid ${selected ? '#7c3aed' : '#e5e7eb'}`,
        borderRadius: 12,
        padding: '10px 10px 8px',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        position: 'relative',
        transition: 'border-color .15s, background .15s',
        flexShrink: 0,
      }}
    >
      {/* Selection tick */}
      <div style={{
        position: 'absolute', top: 8, left: 8,
        width: 18, height: 18, borderRadius: 5,
        background: selected ? '#7c3aed' : '#fff',
        border: `2px solid ${selected ? '#7c3aed' : '#d1d5db'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, transition: 'all .15s',
      }}>
        {selected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>

      {/* Rotation badge */}
      {rotLabel && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          padding: '2px 7px', borderRadius: 6,
          background: '#7c3aed', color: '#fff',
          fontSize: 10, fontWeight: 800, zIndex: 2,
        }}>
          {rotLabel}
        </div>
      )}

      {/* Thumbnail */}
      <div style={{
        width: 120, height: 152,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', borderRadius: 4, background: '#f9fafb',
      }}>
        {loading && !dataUrl ? (
          <div style={{ width: 24, height: 24, border: '2.5px solid #e0e0e0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin .8s linear infinite' }}/>
        ) : dataUrl ? (
          <img
            src={dataUrl}
            alt={`Page ${pageNum}`}
            draggable={false}
            style={{
              maxWidth: is90 ? 152 : 120,
              maxHeight: is90 ? 120 : 152,
              transform: `rotate(${rotation}deg)`,
              transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)',
              display: 'block',
            }}
          />
        ) : (
          <div style={{ fontSize: 11, color: '#9ca3af' }}>…</div>
        )}
      </div>

      {/* Page number */}
      <div style={{ fontSize: 11, fontWeight: 700, color: selected ? '#6d28d9' : '#374151' }}>
        Page {pageNum}
      </div>

      {/* Quick rotate buttons */}
      <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
        <button onClick={onRotateCCW}
          title="Rotate 90° counter-clockwise"
          style={{ width: 28, height: 24, borderRadius: 6, border: '1.5px solid #e5e7eb', background: '#fafafa', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
          ↺
        </button>
        <button onClick={onRotateCW}
          title="Rotate 90° clockwise"
          style={{ width: 28, height: 24, borderRadius: 6, border: '1.5px solid #e5e7eb', background: '#fafafa', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
          ↻
        </button>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function RotatePDF() {
  const [file,      setFile]      = useState<File | null>(null)
  const [numPages,  setNumPages]  = useState(0)
  const [thumbs,    setThumbs]    = useState<Record<number, string>>({})
  const [rotations, setRotations] = useState<Record<number, number>>({})   // extra rotation per page
  const [selected,  setSelected]  = useState<Set<number>>(new Set())
  const [loading,   setLoading]   = useState(false)
  const [thumbsDone, setThumbsDone] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [isDrop,    setIsDrop]    = useState(false)
  const [done,      setDone]      = useState(false)

  const fileRef  = useRef<HTMLInputElement>(null)
  const pdfRef   = useRef<any>(null)   // pdfjs document

  // Load PDF and render thumbnails progressively
  const loadFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setDone(false); setLoading(true); setThumbsDone(false)
    setFile(f); setThumbs({}); setRotations({}); setSelected(new Set())

    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`

      const doc = await lib.getDocument({ data: await f.arrayBuffer() }).promise
      pdfRef.current = doc
      setNumPages(doc.numPages)
      setLoading(false)

      // Render thumbnails page-by-page so UI shows them as they load
      for (let p = 1; p <= doc.numPages; p++) {
        const pg  = await doc.getPage(p)
        const vp  = pg.getViewport({ scale: 0.32 })
        const cv  = document.createElement('canvas')
        cv.width  = vp.width
        cv.height = vp.height
        await pg.render({ canvasContext: cv.getContext('2d')!, viewport: vp }).promise
        const url = cv.toDataURL('image/jpeg', 0.82)
        setThumbs(prev => ({ ...prev, [p]: url }))
      }
      setThumbsDone(true)
    } catch (e: any) {
      setError(e.message ?? 'Failed to load PDF.')
      setLoading(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }

  // ── Selection helpers ──────────────────────────────────────────────────────
  const togglePage = (n: number) =>
    setSelected(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })

  const selectAll   = () => setSelected(new Set(Array.from({ length: numPages }, (_, i) => i + 1)))
  const deselectAll = () => setSelected(new Set())

  const allSelected  = selected.size === numPages && numPages > 0
  const someSelected = selected.size > 0

  // ── Rotation helpers ───────────────────────────────────────────────────────
  const addRot = useCallback((pages: number[], delta: number) => {
    setRotations(prev => {
      const next = { ...prev }
      for (const p of pages) next[p] = ((next[p] ?? 0) + delta + 360) % 360
      return next
    })
  }, [])

  const rotatePage = (p: number, delta: number) => addRot([p], delta)

  const rotateSelected = (delta: number) => {
    if (!someSelected) return
    addRot(Array.from(selected), delta)
  }

  const rotateAll = (delta: number) => {
    addRot(Array.from({ length: numPages }, (_, i) => i + 1), delta)
  }

  const resetRotations = () => { setRotations({}); setSelected(new Set()) }

  // Count changed pages
  const changedCount = Object.values(rotations).filter(r => r !== 0).length

  // ── Export ─────────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!file) return
    setSaving(true); setError(''); setDone(false)
    try {
      const { PDFDocument, degrees } = await import('pdf-lib')
      const bytes  = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(bytes)
      const pages  = pdfDoc.getPages()

      for (let i = 0; i < pages.length; i++) {
        const extra = rotations[i + 1] ?? 0
        if (extra === 0) continue
        const existing = pages[i].getRotation().angle
        pages[i].setRotation(degrees((existing + extra) % 360))
      }

      const out  = await pdfDoc.save()
      const blob = new Blob([out as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, '_rotated.pdf')
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e: any) {
      setError(e.message ?? 'Export failed.')
    } finally {
      setSaving(false)
    }
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    page: { height: '100vh', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', background: '#f5f5f7', fontFamily: 'system-ui,sans-serif' },
    nav:  { height: 52, background: 'rgba(255,255,255,.96)', borderBottom: '1px solid rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, flexShrink: 0 },
    work: { flex: 1, display: 'flex', overflow: 'hidden' },
    sb:   { width: 256, flexShrink: 0, background: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const },
    sec:  { padding: '14px 16px', borderBottom: '1px solid #f0f0f0' },
    lbl:  { fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,.3)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 8 },
    main: { flex: 1, overflowY: 'auto' as const, padding: '24px 28px', display: 'flex', flexDirection: 'column' as const, gap: 20 },
  }

  const rotBtn = (label: string, onClick: () => void, disabled = false) => (
    <button onClick={onClick} disabled={disabled}
      style={{ flex: 1, padding: '10px 6px', borderRadius: 8, border: '1.5px solid #e0e0e0', background: disabled ? '#f9fafb' : '#fff', color: disabled ? '#d1d5db' : '#1d1d1f', fontSize: 12, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', lineHeight: 1.3, textAlign: 'center' as const }}>
      {label}
    </button>
  )

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="27" height="27" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="lg-rp" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4F7FFA"/><stop offset="100%" stopColor="#8B3FEC"/></linearGradient></defs>
            <path d="M5,2 L19,2 L27,10 L27,26 Q27,28 25,28 L5,28 Q3,28 3,26 L3,4 Q3,2 5,2 Z" fill="white" stroke="url(#lg-rp)" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M19,2 L19,10 L27,10" fill="none" stroke="url(#lg-rp)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="22" x2="20" y2="11" stroke="url(#lg-rp)" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="8" cy="23" r="1.8" fill="url(#lg-rp)"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0D1B4B', letterSpacing: '-.03em' }}>
            EditPDF<span style={{ marginLeft: 2, background: 'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </span>
        </Link>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,.2)' }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>Rotate Pages</span>
        <div style={{ flex: 1 }}/>
        {file && (
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,.4)' }}>
            {file.name} · {numPages} page{numPages !== 1 ? 's' : ''}
            {changedCount > 0 && ` · ${changedCount} rotated`}
          </span>
        )}
        {file && (
          <button
            onClick={exportPDF}
            disabled={saving || changedCount === 0}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: (saving || changedCount === 0) ? '#e0e0e0' : '#7c3aed', color: (saving || changedCount === 0) ? '#aaa' : '#fff', fontSize: 12, fontWeight: 800, cursor: (saving || changedCount === 0) ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : '⬇ Save PDF'}
          </button>
        )}
        {file && (
          <button
            onClick={() => { setFile(null); setNumPages(0); setThumbs({}); setRotations({}); setSelected(new Set()); pdfRef.current = null; setDone(false); setError('') }}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            ← New
          </button>
        )}
      </nav>

      <div style={S.work}>
        {/* ── Sidebar ── */}
        <aside style={S.sb}>

          {/* File info */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>File</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#f5f5f7', borderRadius: 8, border: '1px solid #e8e8e8' }}>
                <div style={{ width: 28, height: 28, background: '#7c3aed', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(0,0,0,.38)', marginTop: 1 }}>{fmtBytes(file.size)} · {numPages} pages</div>
                </div>
              </div>
            </div>
          )}

          {/* Selection */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Selection</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <button onClick={selectAll}
                  style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border: `1.5px solid ${allSelected ? '#7c3aed' : '#e0e0e0'}`, background: allSelected ? '#ede9fe' : '#fff', color: allSelected ? '#6d28d9' : '#374151', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  Select All
                </button>
                <button onClick={deselectAll} disabled={!someSelected}
                  style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border: '1.5px solid #e0e0e0', background: '#fff', color: someSelected ? '#374151' : '#d1d5db', fontSize: 11, fontWeight: 700, cursor: someSelected ? 'pointer' : 'default' }}>
                  Deselect All
                </button>
              </div>
              {someSelected && (
                <div style={{ fontSize: 10, color: '#7c3aed', fontWeight: 700, textAlign: 'center', padding: '4px 0' }}>
                  {selected.size} of {numPages} selected
                </div>
              )}
            </div>
          )}

          {/* Rotate selection */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Rotate Selected{someSelected ? ` (${selected.size})` : ''}</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
                {rotBtn('↺ 90° CCW', () => rotateSelected(-90), !someSelected)}
                {rotBtn('↻ 90° CW',  () => rotateSelected(90),  !someSelected)}
              </div>
              {rotBtn('↕ 180°', () => rotateSelected(180), !someSelected)}
            </div>
          )}

          {/* Rotate all */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Rotate All Pages</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
                {rotBtn('↺ 90° CCW', () => rotateAll(-90))}
                {rotBtn('↻ 90° CW',  () => rotateAll(90))}
              </div>
              {rotBtn('↕ 180°', () => rotateAll(180))}
            </div>
          )}

          {/* Status & reset */}
          {file && (
            <div style={S.sec}>
              {changedCount > 0 ? (
                <>
                  <div style={{ padding: '8px 10px', background: '#f5f3ff', border: '1px solid #ede9fe', borderRadius: 8, fontSize: 11, color: '#7c3aed', fontWeight: 600, marginBottom: 8 }}>
                    {changedCount} page{changedCount !== 1 ? 's' : ''} rotated
                  </div>
                  <button onClick={resetRotations}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e0e0e0', background: '#fff', color: '#6b7280', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    ↺ Reset All Rotations
                  </button>
                </>
              ) : (
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
                  No rotations yet. Select pages and use the buttons above, or use the ↺↻ buttons on each thumbnail.
                </div>
              )}
              {done && (
                <div style={{ marginTop: 8, padding: '8px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                  ✓ PDF saved!
                </div>
              )}
              {error && (
                <div style={{ marginTop: 8, padding: '8px 10px', background: '#fff5f5', border: '1px solid rgba(220,38,38,.2)', borderRadius: 8, fontSize: 11, color: '#dc2626' }}>
                  ⚠ {error}
                </div>
              )}
            </div>
          )}

          {/* Save */}
          {file && (
            <div style={{ padding: '14px 16px' }}>
              <button
                onClick={exportPDF}
                disabled={saving || changedCount === 0}
                style={{ width: '100%', padding: 12, borderRadius: 9, border: 'none', background: (saving || changedCount === 0) ? '#e0e0e0' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: (saving || changedCount === 0) ? '#aaa' : '#fff', fontSize: 13, fontWeight: 800, cursor: (saving || changedCount === 0) ? 'not-allowed' : 'pointer', boxShadow: (saving || changedCount === 0) ? 'none' : '0 4px 14px rgba(124,58,237,.35)' }}
              >
                {saving ? 'Saving…' : changedCount === 0 ? 'No changes yet' : `⬇ Save Rotated PDF`}
              </button>
            </div>
          )}

          <div style={{ padding: '0 16px 16px', fontSize: 10, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
            Rotations are applied per-page. Select multiple pages using the checkboxes, then rotate them together.
          </div>
        </aside>

        {/* ── Main area ── */}
        <main style={S.main}>
          {/* Drop zone */}
          {!file && !loading && (
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
              onDragLeave={() => setIsDrop(false)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${isDrop ? '#7c3aed' : '#d1d5db'}`, borderRadius: 16, cursor: 'pointer', background: isDrop ? '#faf5ff' : 'transparent', minHeight: 300, textAlign: 'center', gap: 12 }}
            >
              <div style={{ fontSize: 52 }}>🔄</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.03em' }}>Rotate PDF Pages</div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,.42)', lineHeight: 1.7, maxWidth: 360 }}>
                Upload a PDF to see all pages as thumbnails. Rotate individual pages or all pages at once, then download the result.
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {[['↺','CCW 90°'],['↻','CW 90°'],['↕','180°']].map(([ic, l]) => (
                  <div key={l} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#374151' }}>
                    {ic} {l}
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 4, padding: '11px 28px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,.3)' }}>
                Choose PDF
              </button>
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin .8s linear infinite' }}/>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,.5)' }}>Loading PDF…</div>
            </div>
          )}

          {/* Thumbnail grid */}
          {file && !loading && (
            <>
              {/* Toolbar strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,.45)' }}>
                  {numPages} page{numPages !== 1 ? 's' : ''}
                  {someSelected && ` · ${selected.size} selected`}
                  {!thumbsDone && ` · rendering thumbnails…`}
                </span>
                <div style={{ flex: 1 }}/>
                {someSelected && (
                  <>
                    <button onClick={() => rotateSelected(-90)}
                      style={{ padding: '5px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#374151' }}>
                      ↺ CCW 90°
                    </button>
                    <button onClick={() => rotateSelected(90)}
                      style={{ padding: '5px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#374151' }}>
                      ↻ CW 90°
                    </button>
                    <button onClick={() => rotateSelected(180)}
                      style={{ padding: '5px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#374151' }}>
                      ↕ 180°
                    </button>
                    <button onClick={deselectAll}
                      style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #ede9fe', background: '#f5f3ff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#7c3aed' }}>
                      ✕ Clear
                    </button>
                  </>
                )}
              </div>

              {/* Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignContent: 'flex-start' }}>
                {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                  <ThumbCard
                    key={p}
                    pageNum={p}
                    dataUrl={thumbs[p] ?? null}
                    rotation={rotations[p] ?? 0}
                    selected={selected.has(p)}
                    loading={!thumbs[p]}
                    onToggle={() => togglePage(p)}
                    onRotateCW={e => { e.stopPropagation(); rotatePage(p, 90) }}
                    onRotateCCW={e => { e.stopPropagation(); rotatePage(p, -90) }}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = '' }}/>
    </div>
  )
}
