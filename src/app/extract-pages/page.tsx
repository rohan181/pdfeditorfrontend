'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

function fmtBytes(b: number) {
  return b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`
}

// Parse a range string like "1-3, 5, 8-10" into a Set of 1-indexed page numbers
function parseRange(input: string, total: number): Set<number> {
  const result = new Set<number>()
  const parts  = input.split(/[,;]/)
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const dash = trimmed.match(/^(\d+)\s*[-–]\s*(\d+)$/)
    if (dash) {
      const from = Math.max(1, parseInt(dash[1]))
      const to   = Math.min(total, parseInt(dash[2]))
      for (let i = from; i <= to; i++) result.add(i)
    } else {
      const n = parseInt(trimmed)
      if (!isNaN(n) && n >= 1 && n <= total) result.add(n)
    }
  }
  return result
}

// ── Thumbnail card ───────────────────────────────────────────────────────────
function ThumbCard({
  pageNum, dataUrl, selected, onToggle,
}: {
  pageNum: number; dataUrl: string | null; selected: boolean; onToggle: () => void
}) {
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
        transition: 'border-color .12s, background .12s, transform .1s',
        flexShrink: 0,
        transform: selected ? 'translateY(-2px)' : 'none',
        boxShadow: selected ? '0 4px 16px rgba(124,58,237,.2)' : '0 1px 4px rgba(0,0,0,.06)',
      }}
    >
      {/* Checkbox */}
      <div style={{
        position: 'absolute', top: 8, left: 8,
        width: 18, height: 18, borderRadius: 5,
        background: selected ? '#7c3aed' : '#fff',
        border: `2px solid ${selected ? '#7c3aed' : '#d1d5db'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, transition: 'all .12s',
      }}>
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Extraction order badge */}
      {selected && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 18, height: 18, borderRadius: '50%',
          background: '#7c3aed', color: '#fff',
          fontSize: 9, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          ✓
        </div>
      )}

      {/* Thumbnail */}
      <div style={{
        width: 120, height: 152,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', borderRadius: 5,
        background: '#f3f4f6',
      }}>
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`Page ${pageNum}`}
            draggable={false}
            style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
          />
        ) : (
          <div style={{ width: 24, height: 24, border: '2.5px solid #e0e0e0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin .8s linear infinite' }}/>
        )}
      </div>

      {/* Page label */}
      <div style={{ fontSize: 11, fontWeight: 700, color: selected ? '#6d28d9' : '#6b7280' }}>
        Page {pageNum}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ExtractPages() {
  const [file,       setFile]       = useState<File | null>(null)
  const [numPages,   setNumPages]   = useState(0)
  const [thumbs,     setThumbs]     = useState<Record<number, string>>({})
  const [selected,   setSelected]   = useState<Set<number>>(new Set())
  const [rangeInput, setRangeInput] = useState('')
  const [rangeError, setRangeError] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [thumbsDone, setThumbsDone] = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [done,       setDone]       = useState(false)
  const [isDrop,     setIsDrop]     = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const pdfRef  = useRef<any>(null)

  // ── Load & render thumbnails ───────────────────────────────────────────────
  const loadFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setDone(false); setLoading(true); setThumbsDone(false)
    setFile(f); setThumbs({}); setSelected(new Set()); setRangeInput(''); setRangeError('')

    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const doc = await lib.getDocument({ data: await f.arrayBuffer() }).promise
      pdfRef.current = doc
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
    setFile(null); setNumPages(0); setThumbs({}); setSelected(new Set())
    setRangeInput(''); setRangeError(''); pdfRef.current = null; setDone(false); setError('')
  }

  // ── Selection helpers ──────────────────────────────────────────────────────
  const togglePage = (n: number) =>
    setSelected(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })

  const selectAll     = () => setSelected(new Set(Array.from({ length: numPages }, (_, i) => i + 1)))
  const deselectAll   = () => setSelected(new Set())
  const selectEven    = () => setSelected(new Set(Array.from({ length: numPages }, (_, i) => i + 1).filter(n => n % 2 === 0)))
  const selectOdd     = () => setSelected(new Set(Array.from({ length: numPages }, (_, i) => i + 1).filter(n => n % 2 !== 0)))
  const invertSelect  = () => setSelected(new Set(Array.from({ length: numPages }, (_, i) => i + 1).filter(n => !selected.has(n))))

  const applyRange = () => {
    setRangeError('')
    if (!rangeInput.trim()) { setRangeError('Enter a page range, e.g. 1-3, 5, 8'); return }
    const parsed = parseRange(rangeInput, numPages)
    if (parsed.size === 0) { setRangeError('No valid pages in range'); return }
    setSelected(parsed)
  }

  // ── Extract & download ─────────────────────────────────────────────────────
  const extractPages = async () => {
    if (!file || selected.size === 0) return
    setSaving(true); setError(''); setDone(false)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes   = await file.arrayBuffer()
      const srcDoc  = await PDFDocument.load(bytes)
      const newDoc  = await PDFDocument.create()

      // Keep pages in the order they appear in the document
      const pageNums = Array.from(selected).sort((a, b) => a - b)
      const indices  = pageNums.map(n => n - 1)  // 0-indexed

      const copied = await newDoc.copyPages(srcDoc, indices)
      for (const page of copied) newDoc.addPage(page)

      const out  = await newDoc.save()
      const blob = new Blob([out as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = file.name.replace(/\.pdf$/i, `_p${pageNums.join('-')}.pdf`)
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e: any) {
      setError(e.message ?? 'Extraction failed.')
    } finally {
      setSaving(false)
    }
  }

  const someSelected = selected.size > 0
  const allSelected  = selected.size === numPages && numPages > 0

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    page: { height: '100vh', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', background: '#f5f5f7', fontFamily: 'system-ui,sans-serif' },
    nav:  { height: 52, background: 'rgba(255,255,255,.96)', borderBottom: '1px solid rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, flexShrink: 0 },
    work: { flex: 1, display: 'flex', overflow: 'hidden' },
    sb:   { width: 264, flexShrink: 0, background: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const },
    sec:  { padding: '13px 16px', borderBottom: '1px solid #f0f0f0' },
    lbl:  { fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,.3)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 8 },
    main: { flex: 1, overflowY: 'auto' as const, padding: '22px 26px', display: 'flex', flexDirection: 'column' as const, gap: 18 },
  }

  const sbBtn = (label: string, onClick: () => void, active = false, disabled = false) => (
    <button onClick={onClick} disabled={disabled}
      style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border: `1.5px solid ${active ? '#7c3aed' : '#e0e0e0'}`, background: active ? '#ede9fe' : disabled ? '#f9fafb' : '#fff', color: active ? '#6d28d9' : disabled ? '#d1d5db' : '#374151', fontSize: 10, fontWeight: 700, cursor: disabled ? 'default' : 'pointer' }}>
      {label}
    </button>
  )

  return (
    <>
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="27" height="27" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="lg-ep" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e"/><stop offset="1" stopColor="#e11d48"/></linearGradient></defs>
            <path d="M0 0H38C44 0 48 6 48 13.5C48 21 44 27 38 27H10M10 27V48H0V0M10 27H32" stroke="url(#lg-ep)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="38" cy="27" r="5" fill="url(#lg-ep)"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0D1B4B', letterSpacing: '-.03em' }}>
            EditPDF<span style={{ marginLeft: 2, background: 'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </span>
        </Link>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,.2)' }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>Extract Pages</span>
        <div style={{ flex: 1 }}/>
        {file && (
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,.4)' }}>
            {file.name} · {numPages}pp
            {someSelected && ` · ${selected.size} selected`}
          </span>
        )}
        {file && (
          <button onClick={extractPages} disabled={!someSelected || saving}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: (!someSelected || saving) ? '#e0e0e0' : '#7c3aed', color: (!someSelected || saving) ? '#aaa' : '#fff', fontSize: 12, fontWeight: 800, cursor: (!someSelected || saving) ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Extracting…' : `⬇ Extract ${someSelected ? selected.size : ''} Page${selected.size !== 1 ? 's' : ''}`}
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

          {/* File */}
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
              <div style={S.lbl}>Page Range</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: rangeError ? 4 : 0 }}>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={e => { setRangeInput(e.target.value); setRangeError('') }}
                  onKeyDown={e => e.key === 'Enter' && applyRange()}
                  placeholder={`e.g. 1-3, 5, 8-${Math.min(numPages, 10)}`}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: `1.5px solid ${rangeError ? '#dc2626' : '#e0e0e0'}`, fontSize: 12, color: '#1d1d1f', outline: 'none' }}
                />
                <button onClick={applyRange}
                  style={{ padding: '7px 11px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  Go
                </button>
              </div>
              {rangeError && <div style={{ fontSize: 10, color: '#dc2626', marginTop: 4 }}>{rangeError}</div>}
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,.35)', marginTop: 6, lineHeight: 1.5 }}>
                Comma-separated pages or ranges.<br/>Example: <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>1-3, 5, 8-10</span>
              </div>
            </div>
          )}

          {/* Quick select */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Quick Select</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                {sbBtn('All', selectAll, allSelected)}
                {sbBtn('Odd', selectOdd)}
                {sbBtn('Even', selectEven)}
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {sbBtn('Invert', invertSelect, false, !file || numPages === 0)}
                {sbBtn('Clear', deselectAll, false, !someSelected)}
              </div>
            </div>
          )}

          {/* Summary */}
          {file && (
            <div style={S.sec}>
              <div style={S.lbl}>Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(0,0,0,.45)' }}>Source pages</span>
                  <span style={{ fontWeight: 700, color: '#1d1d1f' }}>{numPages}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(0,0,0,.45)' }}>Selected</span>
                  <span style={{ fontWeight: 700, color: someSelected ? '#7c3aed' : '#9ca3af' }}>{selected.size}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(0,0,0,.45)' }}>Output pages</span>
                  <span style={{ fontWeight: 700, color: '#1d1d1f' }}>{selected.size}</span>
                </div>
                {someSelected && (
                  <div style={{ marginTop: 2, padding: '6px 9px', background: '#f5f3ff', border: '1px solid #ede9fe', borderRadius: 7, fontSize: 10, color: '#7c3aed', fontWeight: 600, lineHeight: 1.5 }}>
                    Pages: {Array.from(selected).sort((a,b)=>a-b).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Extract button */}
          <div style={{ padding: '14px 16px' }}>
            {(error || done) && (
              <div style={{ padding: '8px 10px', background: done ? '#f0fdf4' : '#fff5f5', border: `1px solid ${done ? '#bbf7d0' : 'rgba(220,38,38,.2)'}`, borderRadius: 8, fontSize: 11, color: done ? '#15803d' : '#dc2626', fontWeight: 600, marginBottom: 10 }}>
                {done ? `✓ Extracted ${selected.size} page${selected.size !== 1 ? 's' : ''} — downloaded!` : `⚠ ${error}`}
              </div>
            )}
            <button onClick={extractPages} disabled={!someSelected || saving}
              style={{ width: '100%', padding: 12, borderRadius: 9, border: 'none', background: (!someSelected || saving) ? '#e0e0e0' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: (!someSelected || saving) ? '#aaa' : '#fff', fontSize: 13, fontWeight: 800, cursor: (!someSelected || saving) ? 'not-allowed' : 'pointer', boxShadow: (!someSelected || saving) ? 'none' : '0 4px 14px rgba(124,58,237,.3)' }}>
              {saving ? 'Extracting…'
                : !someSelected ? 'Select pages first'
                : `⬇ Extract ${selected.size} Page${selected.size !== 1 ? 's' : ''}`}
            </button>
          </div>

          <div style={{ padding: '0 16px 14px', fontSize: 10, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
            Selected pages are copied into a new PDF in their original order.
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
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${isDrop ? '#7c3aed' : '#d1d5db'}`, borderRadius: 16, cursor: 'pointer', background: isDrop ? '#faf5ff' : 'transparent', minHeight: 300, textAlign: 'center', gap: 14 }}
            >
              <div style={{ fontSize: 52 }}>📑</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.03em' }}>Extract PDF Pages</div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,.42)', lineHeight: 1.7, maxWidth: 380 }}>
                Upload a PDF, pick the pages you want — by clicking thumbnails, typing a range like <strong>1-3, 5, 8</strong>, or using quick selectors — then download a new PDF with just those pages.
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[['🖱','Click to select'],['⌨️','Type range (1-3, 5)'],['⬇','Download new PDF']].map(([ic, l]) => (
                  <div key={l} style={{ padding: '6px 13px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#374151' }}>
                    {ic} {l}
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 4, padding: '11px 28px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,.3)' }}>
                Choose PDF
              </button>
              {error && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>⚠ {error}</div>}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin .8s linear infinite' }}/>
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

                {someSelected && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: '#ede9fe', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#7c3aed' }}>
                    {selected.size} selected
                  </div>
                )}

                <div style={{ flex: 1 }}/>

                {/* Shift-click hint */}
                {!someSelected && numPages > 0 && (
                  <span style={{ fontSize: 10, color: 'rgba(0,0,0,.3)', fontStyle: 'italic' }}>
                    Click thumbnails to select · or type a range in the sidebar
                  </span>
                )}

                {someSelected && (
                  <>
                    <button onClick={invertSelect}
                      style={{ padding: '5px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#374151' }}>
                      ⇄ Invert
                    </button>
                    <button onClick={deselectAll}
                      style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #ede9fe', background: '#f5f3ff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#7c3aed' }}>
                      ✕ Clear
                    </button>
                    <button onClick={extractPages} disabled={saving}
                      style={{ padding: '5px 14px', borderRadius: 7, border: 'none', background: saving ? '#e0e0e0' : '#7c3aed', color: saving ? '#aaa' : '#fff', fontSize: 11, fontWeight: 800, cursor: saving ? 'default' : 'pointer' }}>
                      {saving ? 'Working…' : `⬇ Extract ${selected.size}`}
                    </button>
                  </>
                )}
              </div>

              {/* Page grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignContent: 'flex-start' }}>
                {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                  <ThumbCard
                    key={p}
                    pageNum={p}
                    dataUrl={thumbs[p] ?? null}
                    selected={selected.has(p)}
                    onToggle={() => togglePage(p)}
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
    <ToolSEOSection {...toolSeoData['extract-pages']} />
    </>
  )
}
