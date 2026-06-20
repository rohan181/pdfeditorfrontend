'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
type Format   = 'number' | 'page-n' | 'n-of-total' | 'page-n-of-total'

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
}

function getLabel(n: number, total: number, fmt: Format): string {
  switch (fmt) {
    case 'number':          return String(n)
    case 'page-n':          return `Page ${n}`
    case 'n-of-total':      return `${n} / ${total}`
    case 'page-n-of-total': return `Page ${n} of ${total}`
  }
}

const POSITIONS: { id: Position; label: string }[] = [
  { id: 'top-left',      label: 'TL' },
  { id: 'top-center',    label: 'TC' },
  { id: 'top-right',     label: 'TR' },
  { id: 'bottom-left',   label: 'BL' },
  { id: 'bottom-center', label: 'BC' },
  { id: 'bottom-right',  label: 'BR' },
]

const FORMATS: { id: Format; label: string; preview: string }[] = [
  { id: 'number',          label: 'Number only',     preview: '1' },
  { id: 'page-n',          label: 'Page N',          preview: 'Page 1' },
  { id: 'n-of-total',      label: 'N / Total',       preview: '1 / 10' },
  { id: 'page-n-of-total', label: 'Page N of Total', preview: 'Page 1 of 10' },
]

export default function AddPageNumbers() {
  const [file,        setFile]        = useState<File | null>(null)
  const [totalPages,  setTotalPages]  = useState(0)
  const [isDrop,      setIsDrop]      = useState(false)
  const [position,    setPosition]    = useState<Position>('bottom-center')
  const [format,      setFormat]      = useState<Format>('number')
  const [startNum,    setStartNum]    = useState(1)
  const [fontSize,    setFontSize]    = useState(12)
  const [margin,      setMargin]      = useState(24)
  const [color,       setColor]       = useState('#1d1d1f')
  const [skipFirst,   setSkipFirst]   = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [progress,    setProgress]    = useState(0)
  const [previewPage, setPreviewPage] = useState(1)
  const [error,       setError]       = useState('')
  const [done,        setDone]        = useState(false)

  const fileRef      = useRef<HTMLInputElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const renderingRef = useRef(false)
  const renderKey    = useRef(0)

  const renderPreview = useCallback(async () => {
    if (!file || !canvasRef.current) return
    if (renderingRef.current) return
    renderingRef.current = true
    const key = ++renderKey.current

    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`

      const doc  = await lib.getDocument({ data: await file.arrayBuffer() }).promise
      if (key !== renderKey.current) return
      const pg   = await doc.getPage(Math.min(previewPage, doc.numPages))
      if (key !== renderKey.current) return

      const natW    = pg.getViewport({ scale: 1 }).width
      const maxW    = Math.min(560, window.innerWidth - 360)
      const scale   = Math.max(0.5, maxW / natW)
      const vp      = pg.getViewport({ scale })

      const canvas  = canvasRef.current
      if (!canvas) return
      canvas.width  = vp.width
      canvas.height = vp.height
      const ctx     = canvas.getContext('2d')!

      await pg.render({ canvasContext: ctx, viewport: vp }).promise
      if (key !== renderKey.current) return

      // Draw page number overlay
      const idx  = previewPage - 1
      const skip = skipFirst && idx === 0
      if (!skip) {
        const n     = startNum + idx - (skipFirst ? 1 : 0)
        const label = getLabel(n, totalPages, format)
        const fs    = fontSize * scale * 1.33

        ctx.save()
        ctx.font         = `600 ${fs}px Helvetica, Arial, sans-serif`
        ctx.fillStyle    = color
        ctx.textBaseline = 'alphabetic'

        const tw = ctx.measureText(label).width
        const mg = margin * scale
        let x = 0, y = 0

        switch (position) {
          case 'top-left':      x = mg;                    y = mg + fs;            break
          case 'top-center':    x = (vp.width - tw) / 2;  y = mg + fs;            break
          case 'top-right':     x = vp.width - tw - mg;   y = mg + fs;            break
          case 'bottom-left':   x = mg;                    y = vp.height - mg;     break
          case 'bottom-center': x = (vp.width - tw) / 2;  y = vp.height - mg;     break
          case 'bottom-right':  x = vp.width - tw - mg;   y = vp.height - mg;     break
        }

        // subtle bg pill
        const pad = fs * 0.3
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.beginPath()
        ctx.roundRect?.(x - pad, y - fs - pad * 0.4, tw + pad * 2, fs + pad * 1.4, 4)
        ctx.fill()

        ctx.fillStyle = color
        ctx.fillText(label, x, y)
        ctx.restore()
      }
    } catch (e) {
      console.error('preview error:', e)
    } finally {
      renderingRef.current = false
    }
  }, [file, previewPage, position, format, startNum, fontSize, margin, color, skipFirst, totalPages])

  useEffect(() => { renderPreview() }, [renderPreview])

  const loadFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setDone(false); setFile(f); setPreviewPage(1)
    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const doc = await lib.getDocument({ data: await f.arrayBuffer() }).promise
      setTotalPages(doc.numPages)
    } catch { setTotalPages(0) }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }

  const applyPageNumbers = async () => {
    if (!file) return
    setLoading(true); setProgress(0); setError(''); setDone(false)
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
      const bytes  = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(bytes)
      const font   = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pgList = pdfDoc.getPages()
      const total  = pgList.length

      for (let i = 0; i < pgList.length; i++) {
        setProgress(Math.round(((i + 1) / total) * 92))

        if (skipFirst && i === 0) continue

        const page      = pgList[i]
        const { width, height } = page.getSize()
        const n         = startNum + i - (skipFirst ? 1 : 0)
        const label     = getLabel(n, total, format)
        const tw        = font.widthOfTextAtSize(label, fontSize)
        const mg        = margin

        let x = 0, y = 0
        switch (position) {
          case 'top-left':      x = mg;                  y = height - mg - fontSize; break
          case 'top-center':    x = (width - tw) / 2;   y = height - mg - fontSize; break
          case 'top-right':     x = width - tw - mg;    y = height - mg - fontSize; break
          case 'bottom-left':   x = mg;                  y = mg;                     break
          case 'bottom-center': x = (width - tw) / 2;   y = mg;                     break
          case 'bottom-right':  x = width - tw - mg;    y = mg;                     break
        }

        const hex = color.replace('#', '')
        const r   = parseInt(hex.slice(0, 2), 16) / 255
        const g   = parseInt(hex.slice(2, 4), 16) / 255
        const b   = parseInt(hex.slice(4, 6), 16) / 255

        page.drawText(label, { x, y, size: fontSize, font, color: rgb(r, g, b) })
      }

      const out  = await pdfDoc.save()
      setProgress(100)
      setDone(true)

      const blob = new Blob([out as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = file.name.replace(/\.pdf$/i, '_numbered.pdf')
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError(e.message ?? 'Failed to add page numbers.')
    } finally {
      setLoading(false)
    }
  }

  // ── styles ──────────────────────────────────────────────────────────────────
  const S = {
    page:  { height:'100vh', display:'flex', flexDirection:'column' as const, overflow:'hidden', background:'#f5f5f7', fontFamily:'system-ui,sans-serif' },
    nav:   { height:52, background:'rgba(255,255,255,.96)', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', padding:'0 18px', gap:10, flexShrink:0 },
    work:  { flex:1, display:'flex', overflow:'hidden' },
    sb:    { width:280, flexShrink:0, background:'#fff', borderRight:'1px solid #e8e8e8', display:'flex', flexDirection:'column' as const, overflowY:'auto' as const },
    sec:   { padding:'14px 16px', borderBottom:'1px solid #f0f0f0' },
    lbl:   { fontSize:10, fontWeight:700, color:'rgba(0,0,0,.3)', textTransform:'uppercase' as const, letterSpacing:'.07em', marginBottom:10 },
    main:  { flex:1, display:'flex', flexDirection:'column' as const, overflow:'hidden' },
    body:  { flex:1, overflowY:'auto' as const, display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'flex-start', padding:28, gap:16 },
  }

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <div style={{ width:27, height:27, background:'#1d1d1f', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/>
              <polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/>
            </svg>
          </div>
          <span style={{ fontSize:14, fontWeight:700, color:'#1d1d1f', letterSpacing:'-.04em' }}>
            Edit<span style={{ color:'#7c3aed' }}>PDF</span> AI
          </span>
        </Link>
        <span style={{ fontSize:11, color:'rgba(0,0,0,.2)' }}>›</span>
        <span style={{ fontSize:13, fontWeight:700, color:'#1d1d1f' }}>Add Page Numbers</span>
        <div style={{ flex:1 }}/>
        {file && (
          <button onClick={() => { setFile(null); setTotalPages(0); setDone(false); setError('') }}
            style={{ padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:'none', background:'#f0f0f0', color:'#1d1d1f', cursor:'pointer' }}>
            ← New
          </button>
        )}
      </nav>

      <div style={S.work}>
        {/* ── Sidebar ── */}
        <aside style={S.sb}>

          {/* File */}
          <div style={S.sec}>
            <div style={S.lbl}>PDF File</div>
            {!file ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                onDragLeave={() => setIsDrop(false)}
                style={{ border:`2px dashed ${isDrop ? '#7c3aed' : '#d0d0d0'}`, borderRadius:11, padding:'22px 14px', textAlign:'center', cursor:'pointer', background: isDrop ? '#faf5ff' : '#fafafa' }}
              >
                <div style={{ fontSize:28, marginBottom:6 }}>📄</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#1d1d1f', marginBottom:2 }}>Drop PDF here</div>
                <div style={{ fontSize:10, color:'rgba(0,0,0,.35)', marginBottom:8 }}>or click to browse</div>
                <button style={{ padding:'6px 14px', background:'#1d1d1f', color:'#fff', border:'none', borderRadius:7, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Choose PDF
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 11px', background:'#f5f5f7', border:'1px solid #e8e8e8', borderRadius:9 }}>
                <div style={{ width:32, height:32, background:'#7c3aed', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:15 }}>📄</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#1d1d1f', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize:9, color:'rgba(0,0,0,.38)', marginTop:1 }}>{fmtBytes(file.size)} · {totalPages} pages</div>
                </div>
              </div>
            )}
          </div>

          {/* Position picker */}
          <div style={S.sec}>
            <div style={S.lbl}>Position</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5 }}>
              {POSITIONS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPosition(p.id)}
                  title={p.id.replace('-', ' ')}
                  style={{
                    padding:'10px 6px',
                    borderRadius:8,
                    border: `1.5px solid ${position === p.id ? '#7c3aed' : '#e0e0e0'}`,
                    background: position === p.id ? '#ede9fe' : '#fafafa',
                    color: position === p.id ? '#6d28d9' : 'rgba(0,0,0,.45)',
                    fontSize:10,
                    fontWeight:700,
                    cursor:'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize:10, color:'rgba(0,0,0,.38)', marginTop:6, textAlign:'center' }}>
              {position.replace('-', ' ')}
            </div>
          </div>

          {/* Format */}
          <div style={S.sec}>
            <div style={S.lbl}>Format</div>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              {FORMATS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'8px 11px',
                    borderRadius:8,
                    border: `1.5px solid ${format === f.id ? '#7c3aed' : '#e0e0e0'}`,
                    background: format === f.id ? '#ede9fe' : '#fafafa',
                    color: format === f.id ? '#6d28d9' : '#1d1d1f',
                    fontSize:11,
                    fontWeight: format === f.id ? 700 : 500,
                    cursor:'pointer',
                    textAlign:'left',
                  }}
                >
                  <span>{f.label}</span>
                  <span style={{ fontSize:10, fontFamily:'monospace', opacity:.6 }}>{f.preview}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Start number */}
          <div style={S.sec}>
            <div style={S.lbl}>Starting Number</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => setStartNum(n => Math.max(0, n - 1))}
                style={{ width:28, height:28, borderRadius:7, border:'1.5px solid #e0e0e0', background:'#fafafa', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#1d1d1f', flexShrink:0 }}>−</button>
              <input
                type="number" min={0} value={startNum}
                onChange={e => setStartNum(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ flex:1, padding:'6px 10px', borderRadius:8, border:'1.5px solid #e0e0e0', fontSize:13, fontWeight:700, textAlign:'center', color:'#1d1d1f', outline:'none' }}
              />
              <button onClick={() => setStartNum(n => n + 1)}
                style={{ width:28, height:28, borderRadius:7, border:'1.5px solid #e0e0e0', background:'#fafafa', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#1d1d1f', flexShrink:0 }}>+</button>
            </div>
          </div>

          {/* Font size */}
          <div style={S.sec}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={S.lbl}>Font Size</div>
              <span style={{ fontSize:11, fontWeight:700, color:'#7c3aed' }}>{fontSize}pt</span>
            </div>
            <input type="range" min={8} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#7c3aed' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'rgba(0,0,0,.3)', marginTop:3 }}>
              <span>8pt</span><span>24pt</span>
            </div>
          </div>

          {/* Margin */}
          <div style={S.sec}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={S.lbl}>Margin</div>
              <span style={{ fontSize:11, fontWeight:700, color:'#7c3aed' }}>{margin}px</span>
            </div>
            <input type="range" min={8} max={60} value={margin} onChange={e => setMargin(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#7c3aed' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'rgba(0,0,0,.3)', marginTop:3 }}>
              <span>8px</span><span>60px</span>
            </div>
          </div>

          {/* Color */}
          <div style={S.sec}>
            <div style={S.lbl}>Text Color</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
              {['#1d1d1f','#374151','#6b7280','#9ca3af','#7c3aed','#1d4ed8','#dc2626'].map(c => (
                <button key={c} onClick={() => setColor(c)}
                  style={{ width:26, height:26, borderRadius:6, background:c, border: color===c ? '2.5px solid #7c3aed' : '2px solid transparent', outline: color===c ? '1.5px solid #fff' : 'none', outlineOffset:-3, cursor:'pointer', flexShrink:0 }}
                />
              ))}
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width:26, height:26, borderRadius:6, border:'1.5px solid #e0e0e0', cursor:'pointer', padding:2, background:'#fff' }}
                title="Custom color"
              />
            </div>
          </div>

          {/* Skip first */}
          <div style={S.sec}>
            <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
              <div
                onClick={() => setSkipFirst(v => !v)}
                style={{ width:38, height:22, borderRadius:11, background: skipFirst ? '#7c3aed' : '#d1d5db', position:'relative', flexShrink:0, transition:'background .2s', cursor:'pointer' }}
              >
                <div style={{ position:'absolute', top:3, left: skipFirst ? 18 : 3, width:16, height:16, borderRadius:8, background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#1d1d1f' }}>Skip first page</div>
                <div style={{ fontSize:10, color:'rgba(0,0,0,.38)', marginTop:1 }}>Don't number cover / title page</div>
              </div>
            </label>
          </div>

          {/* Apply button */}
          <div style={S.sec}>
            {error && (
              <div style={{ padding:'8px 11px', background:'#fff5f5', border:'1px solid rgba(220,38,38,.2)', borderRadius:8, fontSize:11, color:'#dc2626', marginBottom:10 }}>
                ⚠ {error}
              </div>
            )}
            {done && (
              <div style={{ padding:'8px 11px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, fontSize:11, color:'#15803d', marginBottom:10, fontWeight:600 }}>
                ✓ Downloaded successfully!
              </div>
            )}
            <button
              onClick={applyPageNumbers}
              disabled={!file || loading}
              style={{ width:'100%', padding:12, borderRadius:9, border:'none', background: (!file||loading) ? '#e0e0e0' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: (!file||loading) ? '#aaa' : '#fff', fontSize:13, fontWeight:800, cursor: (!file||loading) ? 'not-allowed' : 'pointer', boxShadow: (!file||loading) ? 'none' : '0 4px 14px rgba(124,58,237,.35)' }}
            >
              {loading
                ? `Adding numbers… ${progress}%`
                : done ? '↓ Download Again' : '✦ Add Page Numbers & Download'}
            </button>
            {loading && (
              <div style={{ marginTop:8, height:4, background:'#ede9fe', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', background:'#7c3aed', borderRadius:2, width:`${progress}%`, transition:'width .3s' }}/>
              </div>
            )}
          </div>

          <div style={{ padding:'10px 16px', fontSize:10, color:'rgba(0,0,0,.35)', lineHeight:1.6 }}>
            Page numbers are embedded directly into the PDF using pdf-lib. The preview shows how they'll look on the selected page.
          </div>
        </aside>

        {/* ── Main / Preview ── */}
        <main style={S.main}>
          <div style={S.body}>

            {/* No file state */}
            {!file && (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', maxWidth:440 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', background:'#faf5ff', border:'1px solid rgba(124,58,237,.25)', borderRadius:20, fontSize:10, fontWeight:700, color:'#7c3aed', marginBottom:16, textTransform:'uppercase', letterSpacing:'.08em' }}>
                  ✦ PDF Tool
                </div>
                <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:'-.05em', color:'#1d1d1f', marginBottom:10, lineHeight:1.1 }}>
                  Add Page Numbers
                </h1>
                <p style={{ fontSize:13, color:'rgba(0,0,0,.42)', lineHeight:1.7, marginBottom:24 }}>
                  Upload a PDF and choose position, format, font size, and colour. A live preview updates as you configure. The numbered PDF downloads instantly.
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, width:'100%' }}>
                  {[['📌','6 positions','Top, bottom, left or right'],['🔢','4 formats','Numbers, Page N, N of Total'],['🎨','Custom style','Font size, colour, margin']].map(([ic,t,d]) => (
                    <div key={t} style={{ padding:'12px 10px', border:'1px solid #e8e8e8', borderRadius:12, background:'#fff' }}>
                      <div style={{ fontSize:18, marginBottom:4 }}>{ic}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:'#1d1d1f', marginBottom:2 }}>{t}</div>
                      <div style={{ fontSize:9, color:'rgba(0,0,0,.38)', lineHeight:1.4 }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {file && (
              <>
                {/* Page nav */}
                {totalPages > 1 && (
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', background:'#fff', borderRadius:10, border:'1px solid #e8e8e8', flexShrink:0 }}>
                    <button
                      onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                      disabled={previewPage <= 1}
                      style={{ width:28, height:28, borderRadius:7, border:'1.5px solid #e0e0e0', background: previewPage<=1 ? '#f5f5f7' : '#fff', color: previewPage<=1 ? '#bbb' : '#1d1d1f', cursor: previewPage<=1 ? 'default' : 'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}
                    >‹</button>
                    <span style={{ fontSize:12, fontWeight:600, color:'#1d1d1f', minWidth:80, textAlign:'center' }}>
                      Page {previewPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPreviewPage(p => Math.min(totalPages, p + 1))}
                      disabled={previewPage >= totalPages}
                      style={{ width:28, height:28, borderRadius:7, border:'1.5px solid #e0e0e0', background: previewPage>=totalPages ? '#f5f5f7' : '#fff', color: previewPage>=totalPages ? '#bbb' : '#1d1d1f', cursor: previewPage>=totalPages ? 'default' : 'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}
                    >›</button>
                    <div style={{ flex:1 }}/>
                    <span style={{ fontSize:10, color:'rgba(0,0,0,.35)', fontStyle:'italic' }}>
                      Preview updates live
                    </span>
                  </div>
                )}

                {/* Canvas */}
                <div style={{ background:'#6b7280', borderRadius:12, padding:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(0,0,0,.18)', width:'100%', maxWidth:640 }}>
                  <canvas
                    ref={canvasRef}
                    style={{ maxWidth:'100%', borderRadius:4, boxShadow:'0 2px 12px rgba(0,0,0,.25)', display:'block' }}
                  />
                </div>

                {/* Current settings summary */}
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, justifyContent:'center' }}>
                  {[
                    `📌 ${position.replace('-', ' ')}`,
                    `🔢 "${getLabel(startNum, totalPages, format)}"`,
                    `🔡 ${fontSize}pt`,
                    `↕ ${margin}px margin`,
                    skipFirst ? '⏭ Skip page 1' : '',
                  ].filter(Boolean).map(tag => (
                    <span key={tag} style={{ padding:'4px 10px', borderRadius:20, background:'#fff', border:'1px solid #e0e0e0', fontSize:11, color:'#374151', fontWeight:500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}

          </div>
        </main>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = '' }}/>
    </div>
  )
}
