'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

type PageSize   = 'a4' | 'letter' | 'legal'
type Orient     = 'portrait' | 'landscape'
type InputMode  = 'paste' | 'upload'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).__scriptCache?.[src]) { resolve(); return }
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => {
      if (!(window as any).__scriptCache) (window as any).__scriptCache = {}
      ;(window as any).__scriptCache[src] = true
      resolve()
    }
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 24px; color: #1d1d1f; line-height: 1.7; }
  h1 { font-size: 2rem; font-weight: 800; letter-spacing: -.03em; margin-bottom: .3em; }
  h2 { font-size: 1.2rem; font-weight: 700; color: #374151; margin-top: 2em; }
  p  { margin: .8em 0; color: #374151; }
  .highlight { background: #fef9c3; padding: 12px 16px; border-left: 3px solid #d97706; border-radius: 0 8px 8px 0; margin: 1.2em 0; }
  table { width: 100%; border-collapse: collapse; margin: 1.2em 0; }
  th { background: #1d1d1f; color: #fff; padding: 10px 14px; text-align: left; font-size: .85rem; }
  td { padding: 9px 14px; border-bottom: 1px solid #e5e7eb; font-size: .9rem; }
  tr:nth-child(even) td { background: #f9fafb; }
</style>
</head>
<body>
  <h1>Sample Document</h1>
  <p>This is a sample HTML document. Replace it with your own HTML and click <strong>Convert to PDF</strong>.</p>
  <div class="highlight">Tip: paste a full HTML document including &lt;style&gt; tags for best results.</div>
  <h2>Example Table</h2>
  <table>
    <tr><th>Name</th><th>Role</th><th>Status</th></tr>
    <tr><td>Alice</td><td>Designer</td><td>Active</td></tr>
    <tr><td>Bob</td><td>Engineer</td><td>Active</td></tr>
    <tr><td>Carol</td><td>Manager</td><td>On leave</td></tr>
  </table>
  <h2>Second Section</h2>
  <p>HTML to PDF supports all standard CSS including flexbox, grid, fonts, colors, and images loaded from URLs.</p>
</body>
</html>`

export default function HtmlToPdf() {
  const [mode,     setMode]     = useState<InputMode>('paste')
  const [html,     setHtml]     = useState(SAMPLE_HTML)
  const [fileName, setFileName] = useState('document')
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [orient,   setOrient]   = useState<Orient>('portrait')
  const [margin,   setMargin]   = useState(15)
  const [scale,    setScale]    = useState(2)
  const [loading,  setLoading]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [status,   setStatus]   = useState('')
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)
  const [isDrop,   setIsDrop]   = useState(false)

  const fileRef   = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Update iframe preview whenever html changes
  useEffect(() => {
    const frame = iframeRef.current
    if (!frame) return
    const doc = frame.contentDocument
    if (!doc) return
    doc.open()
    doc.write(html || '<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;color:#9ca3af;font-size:14px">Preview will appear here</body></html>')
    doc.close()
  }, [html])

  const loadHtmlFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.html') && !f.name.toLowerCase().endsWith('.htm')) {
      setError('Please upload an .html or .htm file.')
      return
    }
    setError('')
    setFileName(f.name.replace(/\.(html|htm)$/i, ''))
    const reader = new FileReader()
    reader.onload = e => setHtml(String(e.target?.result ?? ''))
    reader.readAsText(f)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadHtmlFile(f)
  }

  // ── Screenshot-based conversion ─────────────────────────────────────────────
  const convertToPDF = async () => {
    if (!html.trim()) { setError('Please enter some HTML first.'); return }
    setLoading(true); setError(''); setDone(false); setProgress(5)

    try {
      setStatus('Loading libraries…')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      setProgress(20)

      setStatus('Rendering HTML…')

      // Hidden container for rendering
      const container = document.createElement('div')
      container.style.cssText = [
        'position:fixed',
        'left:-99999px',
        'top:0',
        orient === 'portrait' ? 'width:960px' : 'width:1360px',
        'background:white',
        'overflow:visible',
      ].join(';')
      container.innerHTML = html
      document.body.appendChild(container)

      // Let the browser paint
      await new Promise(r => setTimeout(r, 600))
      setProgress(35)

      const html2canvas = (window as any).html2canvas
      const { jsPDF }   = (window as any).jspdf

      setStatus('Capturing screenshot…')
      const canvas = await html2canvas(container, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: orient === 'portrait' ? 960 : 1360,
      })
      document.body.removeChild(container)
      setProgress(65)

      setStatus('Building PDF…')
      const pdf = new jsPDF({ orientation: orient, unit: 'mm', format: pageSize })

      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      const imgW = pdfW - margin * 2
      // Height of one PDF page in canvas pixels
      const pageHpx = Math.floor(canvas.width * ((pdfH - margin * 2) / imgW))

      let yPx  = 0
      let page = 0
      while (yPx < canvas.height) {
        if (page > 0) pdf.addPage()
        const sliceH = Math.min(pageHpx, canvas.height - yPx)

        const slice = document.createElement('canvas')
        slice.width  = canvas.width
        slice.height = sliceH
        slice.getContext('2d')!.drawImage(canvas, 0, yPx, canvas.width, sliceH, 0, 0, canvas.width, sliceH)

        const imgData = slice.toDataURL('image/jpeg', 0.92)
        const imgH    = (sliceH / canvas.width) * imgW
        pdf.addImage(imgData, 'JPEG', margin, margin, imgW, imgH)

        yPx  += pageHpx
        page += 1
        setProgress(65 + Math.round((yPx / canvas.height) * 25))
      }

      pdf.save(`${fileName || 'document'}.pdf`)
      setProgress(100); setDone(true); setStatus('')
    } catch (e: any) {
      setError(e.message ?? 'Conversion failed.')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  // ── Print-dialog method (best fidelity) ────────────────────────────────────
  const printToPDF = () => {
    if (!html.trim()) { setError('Please enter some HTML first.'); return }
    setError('')

    const printFrame = document.createElement('iframe')
    printFrame.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;border:none'
    document.body.appendChild(printFrame)

    const doc = printFrame.contentDocument || printFrame.contentWindow?.document
    if (!doc) return
    doc.open()
    // inject print page-size CSS
    const printCSS = `@page { size: ${pageSize} ${orient}; margin: ${margin}mm; }`
    const injected = html.includes('</head>')
      ? html.replace('</head>', `<style>${printCSS}</style></head>`)
      : `<style>${printCSS}</style>${html}`
    doc.write(injected)
    doc.close()

    printFrame.contentWindow?.focus()
    setTimeout(() => {
      printFrame.contentWindow?.print()
      setTimeout(() => document.body.removeChild(printFrame), 2000)
    }, 400)
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    page:   { height:'100vh', display:'flex', flexDirection:'column' as const, overflow:'hidden', background:'#f5f5f7', fontFamily:'system-ui,sans-serif' },
    nav:    { height:52, background:'rgba(255,255,255,.96)', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', padding:'0 18px', gap:10, flexShrink:0 },
    work:   { flex:1, display:'flex', overflow:'hidden' },
    sb:     { width:288, flexShrink:0, background:'#fff', borderRight:'1px solid #e8e8e8', display:'flex', flexDirection:'column' as const, overflowY:'auto' as const },
    sec:    { padding:'13px 16px', borderBottom:'1px solid #f0f0f0' },
    lbl:    { fontSize:10, fontWeight:700, color:'rgba(0,0,0,.3)', textTransform:'uppercase' as const, letterSpacing:'.07em', marginBottom:8 },
    main:   { flex:1, display:'flex', flexDirection:'column' as const, overflow:'hidden' },
  }

  return (
    <div style={S.page}>
      {/* Nav */}
      <SiteNav />

      {/* Progress bar */}
      {loading && (
        <div style={{ height:3, background:'#e0e0e0', flexShrink:0 }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#7c3aed,#a855f7)', width:`${progress}%`, transition:'width .3s' }}/>
        </div>
      )}

      <div style={S.work}>
        {/* ── Sidebar ── */}
        <aside style={S.sb}>

          {/* Input mode tabs */}
          <div style={S.sec}>
            <div style={S.lbl}>HTML Source</div>
            <div style={{ display:'flex', background:'#f5f5f7', borderRadius:8, padding:3, gap:2, marginBottom:10 }}>
              {(['paste','upload'] as InputMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ flex:1, padding:'6px 4px', borderRadius:6, border:'none', fontSize:11, fontWeight:700, cursor:'pointer', background: mode===m ? '#fff' : 'transparent', color: mode===m ? '#7c3aed' : 'rgba(0,0,0,.45)', boxShadow: mode===m ? '0 1px 4px rgba(0,0,0,.12)' : 'none' }}>
                  {m === 'paste' ? '✏ Paste HTML' : '📁 Upload File'}
                </button>
              ))}
            </div>

            {mode === 'upload' ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                onDragLeave={() => setIsDrop(false)}
                style={{ border:`2px dashed ${isDrop ? '#7c3aed' : '#d0d0d0'}`, borderRadius:10, padding:'20px 12px', textAlign:'center', cursor:'pointer', background: isDrop ? '#faf5ff' : '#fafafa' }}
              >
                <div style={{ fontSize:26, marginBottom:6 }}>🌐</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#1d1d1f', marginBottom:2 }}>Drop .html file here</div>
                <div style={{ fontSize:10, color:'rgba(0,0,0,.35)', marginBottom:8 }}>or click to browse</div>
                <button style={{ padding:'5px 12px', background:'#1d1d1f', color:'#fff', border:'none', borderRadius:7, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Choose File
                </button>
              </div>
            ) : (
              <div style={{ fontSize:10, color:'rgba(0,0,0,.38)', lineHeight:1.5 }}>
                Edit the HTML in the code editor on the right. The preview updates live.
              </div>
            )}
          </div>

          {/* Output filename */}
          <div style={S.sec}>
            <div style={S.lbl}>Output Filename</div>
            <div style={{ display:'flex', alignItems:'center', gap:0 }}>
              <input
                type="text"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                placeholder="document"
                style={{ flex:1, padding:'7px 10px', borderRadius:'8px 0 0 8px', border:'1.5px solid #e0e0e0', borderRight:'none', fontSize:12, color:'#1d1d1f', outline:'none' }}
              />
              <span style={{ padding:'7px 9px', background:'#f5f5f7', border:'1.5px solid #e0e0e0', borderRadius:'0 8px 8px 0', fontSize:11, color:'rgba(0,0,0,.4)', fontWeight:600 }}>.pdf</span>
            </div>
          </div>

          {/* Page size */}
          <div style={S.sec}>
            <div style={S.lbl}>Page Size</div>
            <div style={{ display:'flex', gap:4 }}>
              {(['a4','letter','legal'] as PageSize[]).map(s => (
                <button key={s} onClick={() => setPageSize(s)}
                  style={{ flex:1, padding:'7px 4px', borderRadius:7, border:`1.5px solid ${pageSize===s ? '#7c3aed' : '#e0e0e0'}`, background: pageSize===s ? '#ede9fe' : '#fff', color: pageSize===s ? '#6d28d9' : 'rgba(0,0,0,.5)', fontSize:10, fontWeight:700, cursor:'pointer', textTransform:'uppercase' as const }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div style={S.sec}>
            <div style={S.lbl}>Orientation</div>
            <div style={{ display:'flex', gap:4 }}>
              {(['portrait','landscape'] as Orient[]).map(o => (
                <button key={o} onClick={() => setOrient(o)}
                  style={{ flex:1, padding:'8px 4px', borderRadius:7, border:`1.5px solid ${orient===o ? '#7c3aed' : '#e0e0e0'}`, background: orient===o ? '#ede9fe' : '#fff', color: orient===o ? '#6d28d9' : 'rgba(0,0,0,.5)', fontSize:10, fontWeight:700, cursor:'pointer', display:'flex', flexDirection:'column' as const, alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:16 }}>{o === 'portrait' ? '📄' : '📋'}</span>
                  <span>{o === 'portrait' ? 'Portrait' : 'Landscape'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Margin */}
          <div style={S.sec}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={S.lbl}>Page Margin</div>
              <span style={{ fontSize:11, fontWeight:700, color:'#7c3aed' }}>{margin}mm</span>
            </div>
            <input type="range" min={0} max={40} value={margin} onChange={e => setMargin(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#7c3aed' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'rgba(0,0,0,.3)', marginTop:3 }}>
              <span>0mm</span><span>40mm</span>
            </div>
          </div>

          {/* Screenshot quality */}
          <div style={S.sec}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={S.lbl}>Render Quality</div>
              <span style={{ fontSize:11, fontWeight:700, color:'#7c3aed' }}>{scale}×</span>
            </div>
            <input type="range" min={1} max={3} step={0.5} value={scale} onChange={e => setScale(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#7c3aed' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'rgba(0,0,0,.3)', marginTop:3 }}>
              <span>1× fast</span><span>3× crisp</span>
            </div>
          </div>

          {/* Conversion methods */}
          <div style={S.sec}>
            {error && (
              <div style={{ padding:'8px 11px', background:'#fff5f5', border:'1px solid rgba(220,38,38,.2)', borderRadius:8, fontSize:11, color:'#dc2626', marginBottom:10 }}>
                ⚠ {error}
              </div>
            )}
            {done && (
              <div style={{ padding:'8px 11px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, fontSize:11, color:'#15803d', marginBottom:10, fontWeight:600 }}>
                ✓ PDF downloaded!
              </div>
            )}
            {status && !error && (
              <div style={{ padding:'8px 11px', background:'#f5f3ff', border:'1px solid #ede9fe', borderRadius:8, fontSize:11, color:'#7c3aed', marginBottom:10, fontWeight:600 }}>
                ⏳ {status}
              </div>
            )}

            <button
              onClick={convertToPDF}
              disabled={loading}
              style={{ width:'100%', padding:'11px 12px', borderRadius:9, border:'none', background: loading ? '#e0e0e0' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: loading ? '#aaa' : '#fff', fontSize:13, fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 14px rgba(124,58,237,.35)', marginBottom:8 }}
            >
              {loading ? `Converting… ${progress}%` : '⬇ Convert & Download'}
            </button>

            <button
              onClick={printToPDF}
              disabled={loading}
              style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:'1.5px solid #e0e0e0', background:'#fff', color:'#374151', fontSize:12, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              🖨 Print to PDF (browser dialog)
            </button>

            <div style={{ marginTop:10, padding:'8px 10px', background:'#f8f8f8', borderRadius:8, fontSize:10, color:'rgba(0,0,0,.45)', lineHeight:1.6 }}>
              <strong>Convert &amp; Download</strong> — screenshot-based, instant.<br/>
              <strong>Print to PDF</strong> — browser-native, highest fidelity.
            </div>
          </div>

          <div style={{ padding:'10px 16px', fontSize:10, color:'rgba(0,0,0,.35)', lineHeight:1.6 }}>
            External images and fonts may not render in Convert mode. For complex pages, use Print to PDF.
          </div>
        </aside>

        {/* ── Main: split editor + preview ── */}
        <main style={S.main}>
          <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

            {/* Code editor */}
            <div style={{ width:'44%', flexShrink:0, display:'flex', flexDirection:'column', borderRight:'1px solid #e8e8e8', background:'#1e1e2e' }}>
              <div style={{ padding:'8px 14px', background:'#13131f', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                <div style={{ width:10, height:10, borderRadius:5, background:'#ff5f57' }}/>
                <div style={{ width:10, height:10, borderRadius:5, background:'#ffbd2e' }}/>
                <div style={{ width:10, height:10, borderRadius:5, background:'#28c840' }}/>
                <span style={{ marginLeft:6, fontSize:11, color:'rgba(255,255,255,.4)', fontFamily:'monospace' }}>index.html</span>
                <div style={{ flex:1 }}/>
                <button
                  onClick={() => setHtml(SAMPLE_HTML)}
                  style={{ padding:'3px 9px', borderRadius:6, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color:'rgba(255,255,255,.45)', fontSize:10, cursor:'pointer', fontWeight:600 }}
                >
                  Load sample
                </button>
                <button
                  onClick={() => setHtml('')}
                  style={{ padding:'3px 9px', borderRadius:6, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color:'rgba(255,255,255,.45)', fontSize:10, cursor:'pointer', fontWeight:600 }}
                >
                  Clear
                </button>
              </div>
              <textarea
                value={html}
                onChange={e => { setHtml(e.target.value); setDone(false) }}
                spellCheck={false}
                placeholder="Paste your HTML here…"
                style={{
                  flex:1, padding:'14px 16px', border:'none', outline:'none', resize:'none',
                  background:'#1e1e2e', color:'#cdd6f4', fontSize:12, lineHeight:1.7,
                  fontFamily:'"Fira Code","Cascadia Code","JetBrains Mono",monospace',
                  overflowY:'auto',
                }}
              />
            </div>

            {/* Live preview */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#6b7280', overflow:'hidden' }}>
              <div style={{ padding:'8px 14px', background:'rgba(0,0,0,.3)', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ height:6, background:'rgba(255,255,255,.15)', borderRadius:3, flex:1 }}/>
                  <div style={{ padding:'3px 10px', background:'rgba(255,255,255,.1)', borderRadius:6, fontSize:10, color:'rgba(255,255,255,.5)', fontFamily:'monospace' }}>Preview</div>
                  <div style={{ height:6, background:'rgba(255,255,255,.15)', borderRadius:3, flex:1 }}/>
                </div>
              </div>
              <div style={{ flex:1, overflow:'hidden', padding:12, display:'flex', alignItems:'flex-start', justifyContent:'center' }}>
                <div style={{ background:'#fff', width:'100%', height:'100%', borderRadius:6, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.4)' }}>
                  <iframe
                    ref={iframeRef}
                    title="HTML Preview"
                    style={{ width:'100%', height:'100%', border:'none', display:'block' }}
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".html,.htm"
        style={{ display:'none' }}
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) loadHtmlFile(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
