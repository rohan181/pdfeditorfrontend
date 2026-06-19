'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slide  { title: string; bullets: string[]; notes?: string }
interface PptData { title: string; subtitle: string; slides: Slide[] }
type Theme = 'blue' | 'dark' | 'white' | 'orange'

// ─── Themes ──────────────────────────────────────────────────────────────────
const THEMES: Record<Theme, {
  name: string; icon: string
  bg: string; titleCol: string; textCol: string; barCol: string
  cssBg: string; cssTitle: string; cssText: string; cssBar: string; cssCard: string
}> = {
  blue: {
    name: 'Corporate Blue', icon: '🔵',
    bg: '1E3A8A', titleCol: 'FFFFFF', textCol: 'DBEAFE', barCol: '1E40AF',
    cssBg: '#1e3a8a', cssTitle: '#fff', cssText: '#dbeafe', cssBar: '#1e40af', cssCard: '#1e40af',
  },
  dark: {
    name: 'Dark Pro', icon: '⬛',
    bg: '0F172A', titleCol: 'FFFFFF', textCol: 'CBD5E1', barCol: '1E293B',
    cssBg: '#0f172a', cssTitle: '#fff', cssText: '#cbd5e1', cssBar: '#1e293b', cssCard: '#1e293b',
  },
  white: {
    name: 'Clean White', icon: '⬜',
    bg: 'FFFFFF', titleCol: '1E3A8A', textCol: '1F2937', barCol: 'DBEAFE',
    cssBg: '#ffffff', cssTitle: '#1e3a8a', cssText: '#1f2937', cssBar: '#dbeafe', cssCard: '#f0f6ff',
  },
  orange: {
    name: 'Vibrant', icon: '🟠',
    bg: 'C0392B', titleCol: 'FFFFFF', textCol: 'FFDDD9', barCol: '96281B',
    cssBg: '#c0392b', cssTitle: '#fff', cssText: '#ffddd9', cssBar: '#96281b', cssCard: '#96281b',
  },
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

.nav{height:52px;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0;z-index:100}
.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#d35230}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}

.prog{height:2px;background:#e0e0e0;flex-shrink:0}
.prog-fill{height:100%;background:linear-gradient(90deg,#d35230,#f97316);transition:width .4s ease}

.workspace{flex:1;display:flex;overflow:hidden}

/* Sidebar */
.sb{width:272px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.sb-sec{padding:14px 16px;border-bottom:1px solid #f0f0f0}
.sb-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}

.drop{border:2px dashed #d0d0d0;border-radius:11px;padding:26px 14px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.drop:hover,.drop.over{border-color:#d35230;background:#fff5f1}
.drop-icon{font-size:32px;margin-bottom:8px}
.drop-txt{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.drop-sub{font-size:10px;color:rgba(0,0,0,.35)}
.drop-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:#1d1d1f;border-radius:7px;font-size:11px;font-weight:700;color:#fff;border:none;cursor:pointer;margin-top:9px;transition:background .13s}
.drop-btn:hover{background:#d35230}

.file-row{display:flex;align-items:center;gap:9px;padding:9px 11px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:9px}
.file-ic{width:32px;height:32px;background:#d35230;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}
.file-info{flex:1;min-width:0}
.file-name{font-size:11px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.file-meta{font-size:9px;color:rgba(0,0,0,.38);margin-top:1px}
.file-rm{width:22px;height:22px;border-radius:5px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;font-size:12px;color:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Slide count */
.count-row{display:flex;gap:4px}
.count-btn{flex:1;padding:7px 4px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;font-size:11px;font-weight:700;color:rgba(0,0,0,.45);cursor:pointer;transition:all .13s;text-align:center}
.count-btn:hover:not(.on){border-color:#d35230;color:#d35230}
.count-btn.on{background:#d35230;border-color:#d35230;color:#fff}

/* Themes */
.theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.theme-btn{padding:8px 6px;border-radius:8px;border:2px solid #e0e0e0;background:#fff;cursor:pointer;transition:all .14s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px}
.theme-btn:hover:not(.on){border-color:#d35230}
.theme-btn.on{border-color:#d35230;box-shadow:0 0 0 2px rgba(211,82,48,.2)}
.theme-swatch{width:100%;height:22px;border-radius:4px;margin-bottom:2px}
.theme-name{font-size:9px;font-weight:700;color:#1d1d1f}

/* Generate button */
.gen-btn{width:100%;padding:12px;border-radius:9px;border:none;background:linear-gradient(135deg,#d35230,#b94220);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(211,82,48,.35)}
.gen-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(211,82,48,.45)}
.gen-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}

/* Main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

.toolbar{height:46px;background:#fff;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;padding:0 16px;gap:8px;flex-shrink:0}
.tool-info{font-size:11px;color:rgba(0,0,0,.4);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tool-info strong{color:#1d1d1f}
.tool-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:7px;font-size:11px;font-weight:700;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;color:rgba(0,0,0,.55);transition:all .13s;white-space:nowrap}
.tool-btn:hover:not(:disabled){border-color:#d35230;color:#d35230}
.tool-btn:disabled{opacity:.4;cursor:not-allowed}
.tool-btn.dl{background:#d35230;border-color:#d35230;color:#fff}
.tool-btn.dl:hover:not(:disabled){background:#b94220}

/* Slides area */
.slides-wrap{flex:1;overflow-y:auto;padding:24px 28px;display:flex;flex-direction:column;gap:16px}

/* Slide card preview */
.slide-card{border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.10);flex-shrink:0;animation:fadeup .3s ease;position:relative}
.slide-inner{aspect-ratio:16/9;padding:0;position:relative;display:flex;flex-direction:column}
.slide-num{position:absolute;top:10px;right:12px;font-size:9px;font-weight:700;opacity:.55}
.slide-title-bar{padding:14px 22px 10px;flex-shrink:0}
.slide-title-txt{font-size:15px;font-weight:800;line-height:1.25;letter-spacing:-.02em}
.slide-divider{height:2px;margin:0 22px;opacity:.35;border-radius:1px}
.slide-body{flex:1;padding:10px 22px 14px;display:flex;flex-direction:column;gap:6px;overflow:hidden}
.slide-bullet{display:flex;align-items:flex-start;gap:8px;font-size:11px;line-height:1.45}
.slide-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:4px;opacity:.8}
.slide-bullet-txt{flex:1;opacity:.9}
.slide-notes{font-size:9px;opacity:.45;margin-top:auto;padding-top:6px;font-style:italic;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}

/* Title slide (first) */
.slide-title-only{aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;border-radius:10px;box-shadow:0 2px 16px rgba(0,0,0,.10);animation:fadeup .3s ease;position:relative}
.slide-title-only .sl-num{position:absolute;top:10px;right:12px;font-size:9px;font-weight:700;opacity:.45}
.slide-title-only h1{font-size:22px;font-weight:800;letter-spacing:-.03em;margin-bottom:8px;line-height:1.2}
.slide-title-only p{font-size:12px;opacity:.7;line-height:1.5}

/* Hero / states */
.hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#fff5f1;border:1px solid rgba(211,82,48,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#d35230;margin-bottom:16px;text-transform:uppercase}
.hero-h1{font-size:clamp(22px,4vw,38px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.hero-h1 em{font-style:normal;color:#d35230}
.hero-sub{font-size:14px;color:rgba(0,0,0,.42);max-width:400px;line-height:1.7;margin-bottom:28px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:480px}
.feat{padding:14px 10px;border:1px solid #e8e8e8;border-radius:12px;background:#fff}
.feat-icon{font-size:20px;margin-bottom:5px}
.feat-t{font-size:10px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.feat-d{font-size:9px;color:rgba(0,0,0,.38);line-height:1.5}

.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px}
.spin-lg{width:36px;height:36px;border:3px solid #e0e0e0;border-top-color:#d35230;border-radius:50%;animation:spin .8s linear infinite}
.load-step{font-size:13px;font-weight:700;color:#d35230;animation:pulse .9s infinite}
.load-sub{font-size:11px;color:rgba(0,0,0,.35)}
.err-bar{padding:10px 14px;background:#fff5f5;border:1px solid rgba(220,38,38,.2);border-radius:8px;font-size:12px;color:#dc2626;margin:14px 16px}
.spin-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
`

// ─── PptxGenJS CDN loader ─────────────────────────────────────────────────────
let pptxLib: any = null
async function loadPptxGen(): Promise<any> {
  if (pptxLib) return pptxLib
  if ((window as any).PptxGenJS) { pptxLib = (window as any).PptxGenJS; return pptxLib }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error('Failed to load PptxGenJS. Check internet connection.'))
    document.head.appendChild(s)
  })
  pptxLib = (window as any).PptxGenJS
  return pptxLib
}

// ─── PPTX generator ───────────────────────────────────────────────────────────
async function buildPPTX(data: PptData, theme: Theme, filename: string) {
  const PptxGenJS = await loadPptxGen()
  const pptx = new PptxGenJS()
  pptx.layout  = 'LAYOUT_16x9'
  pptx.author  = 'EditPDF AI'
  pptx.title   = data.title
  pptx.subject = data.subtitle

  const t = THEMES[theme]

  // ── Title slide ──────────────────────────────────────────────────────────
  const ts = pptx.addSlide()
  ts.background = { color: t.bg }
  // Decorative bar
  ts.addShape(pptx.ShapeType.rect, { x: 0, y: 3.2, w: '100%', h: 0.06, fill: { color: t.barCol }, line: { type: 'none' } })
  ts.addText(data.title, {
    x: 0.6, y: 1.4, w: 8.8, h: 1.4,
    fontSize: 38, bold: true, color: t.titleCol,
    align: 'center', valign: 'middle', wrap: true,
  })
  if (data.subtitle) {
    ts.addText(data.subtitle, {
      x: 0.6, y: 3.4, w: 8.8, h: 0.9,
      fontSize: 18, color: t.textCol, align: 'center', valign: 'top', wrap: true,
    })
  }
  ts.addText('Generated by EditPDF AI', {
    x: 0, y: 5.15, w: '100%', h: 0.3,
    fontSize: 9, color: t.textCol, align: 'center', valign: 'middle', transparency: 55,
  })

  // ── Content slides ────────────────────────────────────────────────────────
  data.slides.forEach((slide, idx) => {
    const s = pptx.addSlide()
    s.background = { color: t.bg }

    // Top accent bar
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: t.barCol }, line: { type: 'none' } })

    // Slide number
    s.addText(`${idx + 1} / ${data.slides.length}`, {
      x: 8.5, y: 0.1, w: 1.4, h: 0.3,
      fontSize: 8, color: t.textCol, align: 'right', transparency: 50,
    })

    // Title
    s.addText(slide.title, {
      x: 0.4, y: 0.15, w: 8.0, h: 0.85,
      fontSize: 24, bold: true, color: t.titleCol, valign: 'middle', wrap: true,
    })

    // Divider
    s.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.05, w: 9.2, h: 0.03, fill: { color: t.titleCol }, line: { type: 'none' }, transparency: 70 })

    // Bullets
    if (slide.bullets?.length) {
      const bulletObjs = slide.bullets.map(b => ({
        text: b,
        options: {
          bullet:        { type: 'bullet', code: '25CF' },
          fontSize:      15,
          color:         t.textCol,
          paraSpaceAfter: 10,
          indentLevel:   0,
        },
      }))
      s.addText(bulletObjs, {
        x: 0.4, y: 1.18, w: 9.2, h: 3.9,
        valign: 'top', wrap: true,
      })
    }

    // Speaker notes
    if (slide.notes) {
      s.addNotes(slide.notes)
    }
  })

  await pptx.writeFile({ fileName: filename.replace(/\.pdf$/i, '') + '.pptx' })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PDFToPPTPage() {
  const [file,       setFile]       = useState<File | null>(null)
  const [pages,      setPages]      = useState(0)
  const [isDrop,     setIsDrop]     = useState(false)
  const [slideCount, setSlideCount] = useState(10)
  const [theme,      setTheme]      = useState<Theme>('blue')
  const [pptData,    setPptData]    = useState<PptData | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [step,       setStep]       = useState('')
  const [progress,   setProgress]   = useState(0)
  const [dlLoading,  setDlLoading]  = useState(false)
  const [error,      setError]      = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setPptData(null); setFile(f); setPages(0); setProgress(0)
    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await lib.getDocument({ data: buf }).promise
      setPages(doc.numPages)
    } catch { /* optional */ }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const generate = async () => {
    if (!file) return
    setLoading(true); setPptData(null); setError(''); setProgress(8)

    try {
      setStep('Extracting text from PDF…')
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const doc = await lib.getDocument({ data: buf }).promise
      let text = ''
      for (let p = 1; p <= doc.numPages; p++) {
        const pg = await doc.getPage(p)
        const tc = await pg.getTextContent()
        text += (tc.items as any[]).map((i: any) => i.str).join(' ') + '\n'
        setProgress(8 + Math.round((p / doc.numPages) * 30))
      }
      text = text.replace(/\s+/g, ' ').trim()
      if (text.length < 20) { setError('No readable text found. Try PDF OCR first.'); return }

      setStep(`AI is creating ${slideCount} slides…`); setProgress(45)

      const res = await fetch('/api/pdf-to-ppt', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text, filename: file.name, slideCount }),
      })

      setProgress(88)
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? `Server error ${res.status}`)
      }

      const data: PptData = await res.json()
      setPptData(data)
      setProgress(100)
    } catch (e: any) {
      setError(e.message ?? 'Conversion failed.')
    } finally {
      setLoading(false); setStep('')
    }
  }

  const download = async () => {
    if (!pptData || !file) return
    setDlLoading(true); setError('')
    try {
      await buildPPTX(pptData, theme, file.name)
    } catch (e: any) {
      setError(e.message ?? 'Download failed.')
    } finally {
      setDlLoading(false)
    }
  }

  const reset = () => {
    setFile(null); setPages(0); setPptData(null)
    setError(''); setProgress(0); setStep(''); setLoading(false)
  }

  const t = THEMES[theme]
  const totalSlides = pptData ? pptData.slides.length + 1 : 0

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/>
                <polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/>
              </svg>
            </div>
            <span className="logo-name">Edit<em>PDF</em> AI</span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">PDF to PowerPoint</span>
          <div className="nav-sp"/>
          {(pptData || loading) && (
            <button className="nbtn sec" onClick={reset}>← New</button>
          )}
        </nav>

        <div className="prog"><div className="prog-fill" style={{ width: `${progress}%` }}/></div>

        <div className="workspace">

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="sb">

            <div className="sb-sec">
              <div className="sb-ttl">PDF File</div>
              {!file ? (
                <div className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}>
                  <div className="drop-icon">📊</div>
                  <div className="drop-txt">Drop PDF here</div>
                  <div className="drop-sub">Text-based PDFs work best</div>
                  <button className="drop-btn">📄 Choose PDF</button>
                </div>
              ) : (
                <div className="file-row">
                  <div className="file-ic">📄</div>
                  <div className="file-info">
                    <div className="file-name" title={file.name}>{file.name}</div>
                    <div className="file-meta">{fmtBytes(file.size)}{pages ? ` · ${pages}p` : ''}</div>
                  </div>
                  <button className="file-rm" onClick={reset}>×</button>
                </div>
              )}
            </div>

            <div className="sb-sec">
              <div className="sb-ttl">Number of Slides</div>
              <div className="count-row">
                {[5, 8, 10, 15, 20].map(n => (
                  <button key={n} className={`count-btn${slideCount === n ? ' on' : ''}`}
                    onClick={() => setSlideCount(n)}>{n}</button>
                ))}
              </div>
            </div>

            <div className="sb-sec">
              <div className="sb-ttl">Theme</div>
              <div className="theme-grid">
                {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([key, th]) => (
                  <button key={key} className={`theme-btn${theme === key ? ' on' : ''}`}
                    onClick={() => setTheme(key)}>
                    <div className="theme-swatch" style={{ background: th.cssBg, border: th.cssBg === '#ffffff' ? '1px solid #e0e0e0' : 'none' }}/>
                    <div className="theme-name">{th.icon} {th.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sb-sec">
              <button className="gen-btn" onClick={generate} disabled={!file || loading}>
                {loading
                  ? <><span style={{ display:'inline-block',width:13,height:13,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',marginRight:7,verticalAlign:'middle' }}/>{step || 'Generating…'}</>
                  : `✦ Generate ${slideCount} Slides`}
              </button>
            </div>

            <div style={{ padding: '12px 16px', fontSize: 10, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
              Up to 55 000 characters processed. PptxGenJS loads from CDN on first download. Speaker notes are included in every slide.
            </div>
          </aside>

          {/* ── Main ─────────────────────────────────────────────────── */}
          <main className="main">

            {pptData && (
              <div className="toolbar">
                <div className="tool-info">
                  <strong>{pptData.title}</strong> · {totalSlides} slides
                </div>
                <button className="tool-btn dl" onClick={download} disabled={dlLoading}>
                  {dlLoading ? <><div className="spin-sm"/> Loading…</> : '⬇ Download .PPTX'}
                </button>
              </div>
            )}

            {/* Hero */}
            {!file && !loading && !pptData && (
              <div className="hero">
                <div className="hero-badge">✦ AI-Powered</div>
                <h1 className="hero-h1">PDF to <em>PowerPoint</em></h1>
                <p className="hero-sub">Upload any PDF and Claude will extract the key ideas and build a polished, ready-to-present slide deck.</p>
                <div className="feat-grid">
                  <div className="feat"><div className="feat-icon">🎯</div><div className="feat-t">Smart Structuring</div><div className="feat-d">AI picks the best slide content</div></div>
                  <div className="feat"><div className="feat-icon">🎨</div><div className="feat-t">4 Themes</div><div className="feat-d">Blue, Dark, White, Vibrant</div></div>
                  <div className="feat"><div className="feat-icon">📝</div><div className="feat-t">Speaker Notes</div><div className="feat-d">Included on every slide</div></div>
                </div>
              </div>
            )}

            {/* Ready state */}
            {file && !loading && !pptData && (
              <div className="hero">
                <div style={{ fontSize: 52, marginBottom: 12 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', marginBottom: 6 }}>Ready to convert</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,.4)', marginBottom: 24 }}>{file.name} → {slideCount} slides · {THEMES[theme].name}</div>
                <button className="gen-btn" style={{ maxWidth: 230 }} onClick={generate}>
                  ✦ Generate Presentation
                </button>
              </div>
            )}

            {loading && !pptData && (
              <div className="loading">
                <div className="spin-lg"/>
                <div className="load-step">{step || 'Processing…'}</div>
                <div className="load-sub">Claude is reading your PDF and building slides…</div>
              </div>
            )}

            {error && <div className="err-bar">⚠ {error}</div>}

            {/* Slide previews */}
            {pptData && (
              <div className="slides-wrap">

                {/* Title slide */}
                <div className="slide-title-only" style={{ background: t.cssBg }}>
                  <span className="sl-num" style={{ color: t.cssTitle }}>1 / {totalSlides}</span>
                  <h1 style={{ color: t.cssTitle }}>{pptData.title}</h1>
                  {pptData.subtitle && <p style={{ color: t.cssText }}>{pptData.subtitle}</p>}
                </div>

                {/* Content slides */}
                {pptData.slides.map((slide, i) => (
                  <div key={i} className="slide-card">
                    <div className="slide-inner" style={{ background: t.cssBg }}>
                      <div style={{ height: 4, background: t.cssBar, flexShrink: 0 }}/>
                      <div className="slide-num" style={{ color: t.cssTitle }}>{i + 2} / {totalSlides}</div>

                      <div className="slide-title-bar">
                        <div className="slide-title-txt" style={{ color: t.cssTitle }}>{slide.title}</div>
                      </div>

                      <div className="slide-divider" style={{ background: t.cssTitle }}/>

                      <div className="slide-body">
                        {(slide.bullets ?? []).map((b, bi) => (
                          <div key={bi} className="slide-bullet">
                            <div className="slide-dot" style={{ background: t.cssTitle }}/>
                            <span className="slide-bullet-txt" style={{ color: t.cssText }}>{b}</span>
                          </div>
                        ))}
                        {slide.notes && (
                          <div className="slide-notes" style={{ color: t.cssText }}>
                            📝 {slide.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}

          </main>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = '' }}/>
    </>
  )
}
