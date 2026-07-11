'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

function fmtBytes(b: number) {
  return b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`
}

function parseRange(input: string, total: number): Set<number> {
  const result = new Set<number>()
  for (const part of input.split(/[,;]/)) {
    const t = part.trim()
    if (!t) continue
    const dash = t.match(/^(\d+)\s*[-–]\s*(\d+)$/)
    if (dash) {
      const from = Math.max(1, parseInt(dash[1]))
      const to   = Math.min(total, parseInt(dash[2]))
      for (let i = from; i <= to; i++) result.add(i)
    } else {
      const n = parseInt(t)
      if (!isNaN(n) && n >= 1 && n <= total) result.add(n)
    }
  }
  return result
}

// ── Thumbnail card ────────────────────────────────────────────────────────────
function ThumbCard({
  pageNum, dataUrl, marked, onToggle,
}: {
  pageNum: number; dataUrl: string | null; marked: boolean; onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: marked ? '#fff5f5' : '#fff',
        border: `2px solid ${marked ? '#dc2626' : '#e5e7eb'}`,
        borderRadius: 12,
        padding: '10px 10px 8px',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        position: 'relative',
        transition: 'border-color .12s, background .12s, transform .1s, box-shadow .12s',
        flexShrink: 0,
        transform: marked ? 'translateY(-1px)' : 'none',
        boxShadow: marked
          ? '0 4px 16px rgba(220,38,38,.18)'
          : '0 1px 4px rgba(0,0,0,.06)',
      }}
    >
      {/* Checkbox */}
      <div style={{
        position: 'absolute', top: 8, left: 8,
        width: 18, height: 18, borderRadius: 5,
        background: marked ? '#dc2626' : '#fff',
        border: `2px solid ${marked ? '#dc2626' : '#d1d5db'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, transition: 'all .12s',
      }}>
        {marked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Trash badge */}
      {marked && (
        <div style={{
          position: 'absolute', top: 7, right: 7,
          width: 20, height: 20, borderRadius: '50%',
          background: '#dc2626', color: '#fff',
          fontSize: 11, display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 2,
        }}>
          🗑
        </div>
      )}

      {/* Thumbnail */}
      <div style={{
        width: 120, height: 152,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', borderRadius: 5,
        background: '#f3f4f6',
        position: 'relative',
      }}>
        {dataUrl ? (
          <>
            <img
              src={dataUrl}
              alt={`Page ${pageNum}`}
              draggable={false}
              style={{
                maxWidth: '100%', maxHeight: '100%', display: 'block',
                opacity: marked ? 0.35 : 1,
                transition: 'opacity .15s',
              }}
            />
            {/* Red X overlay when marked */}
            {marked && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle cx="26" cy="26" r="24" fill="rgba(220,38,38,.15)" stroke="#dc2626" strokeWidth="2"/>
                  <path d="M17 17l18 18M35 17L17 35" stroke="#dc2626" strokeWidth="3"
                    strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </>
        ) : (
          <div style={{ width: 24, height: 24, border: '2.5px solid #e0e0e0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin .8s linear infinite' }}/>
        )}
      </div>

      {/* Page label */}
      <div style={{
        fontSize: 11, fontWeight: 700,
        color: marked ? '#dc2626' : '#6b7280',
      }}>
        {marked ? '✕ Delete' : `Page ${pageNum}`}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DeletePages() {
  const [file,       setFile]       = useState<File | null>(null)
  const [numPages,   setNumPages]   = useState(0)
  const [thumbs,     setThumbs]     = useState<Record<number, string>>({})
  const [marked,     setMarked]     = useState<Set<number>>(new Set())   // pages to delete
  const [rangeInput, setRangeInput] = useState('')
  const [rangeError, setRangeError] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [thumbsDone, setThumbsDone] = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [done,       setDone]       = useState(false)
  const [isDrop,     setIsDrop]     = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setDone(false); setLoading(true); setThumbsDone(false)
    setFile(f); setThumbs({}); setMarked(new Set()); setRangeInput(''); setRangeError('')

    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const doc = await lib.getDocument({ data: await f.arrayBuffer() }).promise
      setNumPages(doc.numPages)
      setLoading(false)

      for (let p = 1; p <= doc.numPages; p++) {
        const pg  = await doc.getPage(p)
        const vp  = pg.getViewport({ scale: 0.32 })
        const cv  = document.createElement('canvas')
        cv.width  = vp.width
        cv.height = vp.height
        await pg.render({ canvasContext: cv.getContext('2d')!, viewport: vp }).promise
        setThumbs(prev => ({ ...prev, [p]: cv.toDataURL('image/jpeg', 0.82) }))
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

  const reset = () => {
    setFile(null); setNumPages(0); setThumbs({})
    setMarked(new Set()); setRangeInput(''); setRangeError('')
    setDone(false); setError('')
  }

  // ── Marking helpers ───────────────────────────────────────────────────────
  const toggle = (n: number) =>
    setMarked(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })

  const markAll    = () => setMarked(new Set(Array.from({ length: numPages }, (_, i) => i + 1)))
  const clearAll   = () => setMarked(new Set())
  const markEven   = () => setMarked(new Set(Array.from({ length: numPages }, (_, i) => i + 1).filter(n => n % 2 === 0)))
  const markOdd    = () => setMarked(new Set(Array.from({ length: numPages }, (_, i) => i + 1).filter(n => n % 2 !== 0)))
  const invertMark = () => setMarked(new Set(Array.from({ length: numPages }, (_, i) => i + 1).filter(n => !marked.has(n))))

  const applyRange = () => {
    setRangeError('')
    if (!rangeInput.trim()) { setRangeError('Enter a range, e.g. 2-4, 7'); return }
    const parsed = parseRange(rangeInput, numPages)
    if (parsed.size === 0) { setRangeError('No valid pages in that range'); return }
    setMarked(parsed)
  }

  // ── Delete & download ─────────────────────────────────────────────────────
  const deletePages = async () => {
    if (!file || marked.size === 0) return
    if (marked.size >= numPages) { setError('You must keep at least one page.'); return }
    setSaving(true); setError(''); setDone(false)

    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes  = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(bytes)

      // Remove pages in reverse order so earlier indices stay valid
      const toRemove = Array.from(marked).sort((a, b) => b - a)
      for (const pageNum of toRemove) {
        pdfDoc.removePage(pageNum - 1)   // pdf-lib is 0-indexed
      }

      const out  = await pdfDoc.save()
      const blob = new Blob([out as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = file.name.replace(/\.pdf$/i, '_deleted.pdf')
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e: any) {
      setError(e.message ?? 'Deletion failed.')
    } finally {
      setSaving(false)
    }
  }

  const someMarked  = marked.size > 0
  const keepCount   = numPages - marked.size
  const tooMany     = marked.size >= numPages && numPages > 0

  // ── Styles ────────────────────────────────────────────────────────────────
  const S = {
    page: { height: '100vh', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', background: '#f5f5f7', fontFamily: 'system-ui,sans-serif' },
    nav:  { height: 52, background: 'rgba(255,255,255,.96)', borderBottom: '1px solid rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, flexShrink: 0 },
    work: { flex: 1, display: 'flex', overflow: 'hidden' },
    sb:   { width: 264, flexShrink: 0, background: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const },
    sec:  { padding: '13px 16px', borderBottom: '1px solid #f0f0f0' },
    lbl:  { fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,.3)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 8 },
    main: { flex: 1, overflowY: 'auto' as const, padding: '22px 26px', display: 'flex', flexDirection: 'column' as const, gap: 18 },
  }

  const sbBtn = (label: string, onClick: () => void, variant: 'normal' | 'red' | 'disabled' = 'normal') => (
    <button onClick={onClick} disabled={variant === 'disabled'}
      style={{
        flex: 1, padding: '7px 4px', borderRadius: 7,
        border: `1.5px solid ${variant === 'red' ? '#fca5a5' : '#e0e0e0'}`,
        background: variant === 'red' ? '#fff5f5' : variant === 'disabled' ? '#f9fafb' : '#fff',
        color: variant === 'red' ? '#dc2626' : variant === 'disabled' ? '#d1d5db' : '#374151',
        fontSize: 10, fontWeight: 700,
        cursor: variant === 'disabled' ? 'default' : 'pointer',
      }}>
      {label}
    </button>
  )

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="27" height="27" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="lg-dp" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4F7FFA"/><stop offset="100%" stopColor="#8B3FEC"/></linearGradient></defs>
            <path d="M5,2 L19,2 L27,10 L27,26 Q27,28 25,28 L5,28 Q3,28 3,26 L3,4 Q3,2 5,2 Z" fill="white" stroke="url(#lg-dp)" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M19,2 L19,10 L27,10" fill="none" stroke="url(#lg-dp)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="22" x2="20" y2="11" stroke="url(#lg-dp)" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="8" cy="23" r="1.8" fill="url(#lg-dp)"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0D1B4B', letterSpacing: '-.03em' }}>
            EditPDF<span style={{ marginLeft: 2, background: 'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </span>
        </Link>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,.2)' }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>Delete Pages</span>
        <div style={{ flex: 1 }}/>

        {file && (
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,.4)' }}>
            {file.name} · {numPages}pp
            {someMarked && (
              <span style={{ color: '#dc2626', fontWeight: 700 }}> · {marked.size} to delete</span>
            )}
          </span>
        )}

        {file && (
          <button onClick={deletePages} disabled={!someMarked || saving || tooMany}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: (!someMarked || saving || tooMany) ? '#e0e0e0' : '#dc2626', color: (!someMarked || saving || tooMany) ? '#aaa' : '#fff', fontSize: 12, fontWeight: 800, cursor: (!someMarked || saving || tooMany) ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Deleting…' : `🗑 Delete ${someMarked ? marked.size : ''} Page${marked.size !== 1 ? 's' : ''}`}
          </button>
        )}

        {file && (
          <button onClick={reset}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
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
              <div style={S.lbl}>PDF File</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#f5f5f7', borderRadius: 8, border: '1px solid #e8e8e8' }}>
                <div style={{ width: 28, height: 28, background: '#7c3aed', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(0,0,0,.38)', marginTop: 1 }}>{fmtBytes(file.size)} · {numPages} pages</div>
                </div>
              </div>
            </div>
          )}

          {/* Range input */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Mark by Range</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={e => { setRangeInput(e.target.value); setRangeError('') }}
                  onKeyDown={e => e.key === 'Enter' && applyRange()}
                  placeholder={`e.g. 2-4, 6, 9-${Math.min(numPages, 12)}`}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: `1.5px solid ${rangeError ? '#dc2626' : '#e0e0e0'}`, fontSize: 12, color: '#1d1d1f', outline: 'none' }}
                />
                <button onClick={applyRange}
                  style={{ padding: '7px 11px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  Mark
                </button>
              </div>
              {rangeError && <div style={{ fontSize: 10, color: '#dc2626', marginTop: 4 }}>{rangeError}</div>}
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,.35)', marginTop: 6, lineHeight: 1.5 }}>
                Example: <span style={{ fontFamily: 'monospace', color: '#dc2626' }}>2-4, 6, 9</span>
              </div>
            </div>
          )}

          {/* Quick mark */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Quick Mark</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                {sbBtn('All',  markAll,  'red')}
                {sbBtn('Odd',  markOdd,  'red')}
                {sbBtn('Even', markEven, 'red')}
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {sbBtn('Invert', invertMark, someMarked ? 'normal' : 'disabled')}
                {sbBtn('Clear',  clearAll,   someMarked ? 'normal' : 'disabled')}
              </div>
            </div>
          )}

          {/* Summary */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Result Preview</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(0,0,0,.45)' }}>Original</span>
                  <span style={{ fontWeight: 700, color: '#1d1d1f' }}>{numPages} pages</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#dc2626' }}>Deleting</span>
                  <span style={{ fontWeight: 700, color: someMarked ? '#dc2626' : '#9ca3af' }}>− {marked.size} pages</span>
                </div>
                <div style={{ height: 1, background: '#f0f0f0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: '#1d1d1f' }}>Result</span>
                  <span style={{ fontWeight: 800, color: keepCount > 0 ? '#16a34a' : '#dc2626' }}>{keepCount} page{keepCount !== 1 ? 's' : ''}</span>
                </div>

                {someMarked && !tooMany && (
                  <div style={{ marginTop: 2, padding: '6px 9px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 7, fontSize: 10, color: '#dc2626', fontWeight: 600, lineHeight: 1.5 }}>
                    Deleting: {Array.from(marked).sort((a,b)=>a-b).join(', ')}
                  </div>
                )}

                {tooMany && (
                  <div style={{ padding: '6px 9px', background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 7, fontSize: 10, color: '#dc2626', fontWeight: 600 }}>
                    ⚠ Keep at least one page
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete button */}
          <div style={{ padding: '14px 16px' }}>
            {(error || done) && (
              <div style={{ padding: '8px 10px', background: done ? '#f0fdf4' : '#fff5f5', border: `1px solid ${done ? '#bbf7d0' : '#fecaca'}`, borderRadius: 8, fontSize: 11, color: done ? '#15803d' : '#dc2626', fontWeight: 600, marginBottom: 10 }}>
                {done
                  ? `✓ Deleted ${marked.size} page${marked.size !== 1 ? 's' : ''} — downloaded!`
                  : `⚠ ${error}`}
              </div>
            )}
            <button onClick={deletePages} disabled={!someMarked || saving || tooMany}
              style={{ width: '100%', padding: 12, borderRadius: 9, border: 'none', background: (!someMarked || saving || tooMany) ? '#e0e0e0' : 'linear-gradient(135deg,#dc2626,#b91c1c)', color: (!someMarked || saving || tooMany) ? '#aaa' : '#fff', fontSize: 13, fontWeight: 800, cursor: (!someMarked || saving || tooMany) ? 'not-allowed' : 'pointer', boxShadow: (!someMarked || saving || tooMany) ? 'none' : '0 4px 14px rgba(220,38,38,.3)' }}>
              {saving ? 'Processing…'
                : tooMany ? 'Keep at least 1 page'
                : !someMarked ? 'Mark pages to delete'
                : `🗑 Delete ${marked.size} Page${marked.size !== 1 ? 's' : ''} & Save`}
            </button>
          </div>

          <div style={{ padding: '0 16px 14px', fontSize: 10, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
            Pages marked in red are permanently removed. The remaining pages are saved into a new PDF.
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={S.main}>

          {/* Drop zone */}
          {!file && !loading && (
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
              onDragLeave={() => setIsDrop(false)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${isDrop ? '#dc2626' : '#d1d5db'}`, borderRadius: 16, cursor: 'pointer', background: isDrop ? '#fff5f5' : 'transparent', minHeight: 300, textAlign: 'center', gap: 14 }}
            >
              <div style={{ fontSize: 52 }}>🗑</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.03em' }}>Delete PDF Pages</div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,.42)', lineHeight: 1.7, maxWidth: 380 }}>
                Upload a PDF, mark the pages you want to remove — by clicking thumbnails, typing a range like <strong>2-4, 7</strong>, or using quick selectors — then download a clean PDF without them.
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[['🖱','Click to mark red'],['⌨️','Range: 2-4, 6'],['⬇','Download without them']].map(([ic, l]) => (
                  <div key={l} style={{ padding: '6px 13px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#374151' }}>
                    {ic} {l}
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 4, padding: '11px 28px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,.3)' }}>
                Choose PDF
              </button>
              {error && <div style={{ fontSize: 12, color: '#dc2626' }}>⚠ {error}</div>}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin .8s linear infinite' }}/>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,.5)' }}>Loading PDF…</div>
            </div>
          )}

          {/* Toolbar + grid */}
          {file && !loading && (
            <>
              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,.4)' }}>
                  {numPages} page{numPages !== 1 ? 's' : ''}
                  {!thumbsDone && ' · rendering…'}
                </span>

                {someMarked && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#dc2626' }}>
                    🗑 {marked.size} marked for deletion
                  </div>
                )}

                {someMarked && !tooMany && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
                    ✓ {keepCount} will remain
                  </div>
                )}

                <div style={{ flex: 1 }}/>

                {!someMarked && numPages > 0 && (
                  <span style={{ fontSize: 10, color: 'rgba(0,0,0,.3)', fontStyle: 'italic' }}>
                    Click thumbnails to mark for deletion
                  </span>
                )}

                {someMarked && (
                  <>
                    <button onClick={invertMark}
                      style={{ padding: '5px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#374151' }}>
                      ⇄ Invert
                    </button>
                    <button onClick={clearAll}
                      style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #fecaca', background: '#fff5f5', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#dc2626' }}>
                      ✕ Clear
                    </button>
                    <button onClick={deletePages} disabled={saving || tooMany}
                      style={{ padding: '5px 14px', borderRadius: 7, border: 'none', background: (saving || tooMany) ? '#e0e0e0' : '#dc2626', color: (saving || tooMany) ? '#aaa' : '#fff', fontSize: 11, fontWeight: 800, cursor: (saving || tooMany) ? 'default' : 'pointer' }}>
                      {saving ? 'Working…' : `🗑 Delete ${marked.size}`}
                    </button>
                  </>
                )}
              </div>

              {/* Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignContent: 'flex-start' }}>
                {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                  <ThumbCard
                    key={p}
                    pageNum={p}
                    dataUrl={thumbs[p] ?? null}
                    marked={marked.has(p)}
                    onToggle={() => toggle(p)}
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
