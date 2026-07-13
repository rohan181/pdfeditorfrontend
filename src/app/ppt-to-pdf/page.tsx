'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// ─── Types ────────────────────────────────────────────────────────────────────
interface SlideData { title: string; paragraphs: string[]; idx: number }
type Theme = 'white' | 'navy' | 'dark'

// ─── Themes ──────────────────────────────────────────────────────────────────
const THEMES: Record<Theme, {
  name: string; icon: string
  bg: [number,number,number]; title: [number,number,number]; text: [number,number,number]
  bar: [number,number,number]; num: [number,number,number]
  cssBg: string; cssTitle: string; cssText: string; cssBar: string; cssCard: string
}> = {
  white: {
    name:'Clean White', icon:'⬜',
    bg:[1,1,1], title:[0.08,0.18,0.42], text:[0.18,0.18,0.18], bar:[0.08,0.18,0.42], num:[0.55,0.55,0.55],
    cssBg:'#fff', cssTitle:'#14306b', cssText:'#2d2d2d', cssBar:'#14306b', cssCard:'#f0f4ff',
  },
  navy: {
    name:'Navy Blue', icon:'🔵',
    bg:[0.06,0.14,0.35], title:[1,1,1], text:[0.85,0.9,1], bar:[0.25,0.45,0.8], num:[0.65,0.72,0.88],
    cssBg:'#0f2459', cssTitle:'#fff', cssText:'#d6e3ff', cssBar:'#3f71cc', cssCard:'#162b6e',
  },
  dark: {
    name:'Dark Pro', icon:'⬛',
    bg:[0.07,0.08,0.10], title:[1,1,1], text:[0.78,0.80,0.84], bar:[0.18,0.20,0.24], num:[0.44,0.46,0.50],
    cssBg:'#111418', cssTitle:'#fff', cssText:'#c7ccd6', cssBar:'#2e333d', cssCard:'#1a1d24',
  },
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}


.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#e04a1f}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}

.prog{height:2px;background:#e0e0e0;flex-shrink:0}
.prog-fill{height:100%;background:linear-gradient(90deg,#e04a1f,#f97316);transition:width .4s ease}

.workspace{flex:1;display:flex;overflow:hidden}

/* Sidebar */
.sb{width:272px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.sb-sec{padding:14px 16px;border-bottom:1px solid #f0f0f0}
.sb-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}

.drop{border:2px dashed #d0d0d0;border-radius:11px;padding:26px 14px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.drop:hover,.drop.over{border-color:#e04a1f;background:#fff8f6}
.drop-icon{font-size:32px;margin-bottom:8px}
.drop-txt{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.drop-sub{font-size:10px;color:rgba(0,0,0,.35)}
.drop-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:#1d1d1f;border-radius:7px;font-size:11px;font-weight:700;color:#fff;border:none;cursor:pointer;margin-top:9px;transition:background .13s}
.drop-btn:hover{background:#e04a1f}

.file-row{display:flex;align-items:center;gap:9px;padding:9px 11px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:9px}
.file-ic{width:32px;height:32px;background:#e04a1f;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}
.file-info{flex:1;min-width:0}
.file-name{font-size:11px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.file-meta{font-size:9px;color:rgba(0,0,0,.38);margin-top:1px}
.file-rm{width:22px;height:38px;border-radius:5px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;font-size:12px;color:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Theme selector */
.theme-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.theme-btn{padding:8px 4px;border-radius:8px;border:2px solid #e0e0e0;background:#fff;cursor:pointer;transition:all .14s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px}
.theme-btn:hover:not(.on){border-color:#e04a1f}
.theme-btn.on{border-color:#e04a1f;box-shadow:0 0 0 2px rgba(224,74,31,.2)}
.theme-swatch{width:100%;height:38px;border-radius:4px;margin-bottom:2px}
.theme-name{font-size:9px;font-weight:700;color:#1d1d1f}

/* Action buttons */
.gen-btn{width:100%;padding:12px;border-radius:9px;border:none;background:linear-gradient(135deg,#e04a1f,#c33d16);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(224,74,31,.35)}
.gen-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(224,74,31,.45)}
.gen-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}

/* Main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.toolbar{height:46px;background:#fff;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;padding:0 16px;gap:8px;flex-shrink:0}
.tool-info{font-size:11px;color:rgba(0,0,0,.4);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tool-info strong{color:#1d1d1f}
.tool-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:7px;font-size:11px;font-weight:700;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;color:rgba(0,0,0,.55);transition:all .13s;white-space:nowrap}
.tool-btn:hover:not(:disabled){border-color:#e04a1f;color:#e04a1f}
.tool-btn:disabled{opacity:.4;cursor:not-allowed}
.tool-btn.dl{background:#e04a1f;border-color:#e04a1f;color:#fff}
.tool-btn.dl:hover:not(:disabled){background:#c33d16}

/* Slides area */
.slides-wrap{flex:1;overflow-y:auto;padding:24px 28px;display:flex;flex-direction:column;gap:14px}

/* Preview card */
.sl-card{border-radius:10px;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,.10);flex-shrink:0;animation:fadeup .28s ease}
.sl-inner{aspect-ratio:16/9;padding:0;position:relative;display:flex;flex-direction:column}
.sl-accent{height:4px;flex-shrink:0}
.sl-num{position:absolute;bottom:10px;right:12px;font-size:9px;font-weight:700;opacity:.45}
.sl-title-area{padding:14px 24px 8px;flex-shrink:0}
.sl-title-txt{font-size:15px;font-weight:800;line-height:1.25;letter-spacing:-.02em}
.sl-divider{height:2px;margin:0 24px 8px;opacity:.25;border-radius:1px;flex-shrink:0}
.sl-body{flex:1;padding:0 24px 14px;display:flex;flex-direction:column;gap:5px;overflow:hidden}
.sl-bullet{display:flex;align-items:flex-start;gap:8px;font-size:11px;line-height:1.45}
.sl-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:4px;opacity:.8}
.sl-bt{flex:1;opacity:.88}
.sl-more{font-size:9px;opacity:.4;margin-top:3px;font-style:italic}

/* Hero */
.hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#fff8f6;border:1px solid rgba(224,74,31,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#e04a1f;margin-bottom:16px;text-transform:uppercase}
.hero-h1{font-size:clamp(22px,4vw,38px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.hero-h1 em{font-style:normal;color:#e04a1f}
.hero-sub{font-size:14px;color:rgba(0,0,0,.42);max-width:380px;line-height:1.7;margin-bottom:28px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:460px}
.feat{padding:14px 10px;border:1px solid #e8e8e8;border-radius:12px;background:#fff}
.feat-icon{font-size:20px;margin-bottom:5px}
.feat-t{font-size:10px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.feat-d{font-size:9px;color:rgba(0,0,0,.38);line-height:1.5}

.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px}
.spin-lg{width:36px;height:36px;border:3px solid #e0e0e0;border-top-color:#e04a1f;border-radius:50%;animation:spin .8s linear infinite}
.load-step{font-size:13px;font-weight:700;color:#e04a1f;animation:pulse .9s infinite}
.load-sub{font-size:11px;color:rgba(0,0,0,.35)}
.err-bar{padding:10px 14px;background:#fff5f5;border:1px solid rgba(220,38,38,.2);border-radius:8px;font-size:12px;color:#dc2626;margin:14px}
.spin-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
`

// ─── JSZip CDN loader ─────────────────────────────────────────────────────────
let jszip: any = null
async function loadJSZip(): Promise<any> {
  if (jszip) return jszip
  if ((window as any).JSZip) { jszip = (window as any).JSZip; return jszip }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error('Failed to load JSZip. Check your internet connection.'))
    document.head.appendChild(s)
  })
  jszip = (window as any).JSZip
  return jszip
}

// ─── PPTX parsing ─────────────────────────────────────────────────────────────
function gbn(el: Element | Document, localName: string): Element[] {
  return Array.from(el.getElementsByTagNameNS('*', localName))
}

function parseSlideXML(xmlStr: string): { title: string; paragraphs: string[] } {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlStr, 'text/xml')
  let title = ''
  const paragraphs: string[] = []

  // Text shapes
  for (const sp of gbn(doc, 'sp')) {
    const phEls = gbn(sp, 'ph')
    const phType = phEls[0]?.getAttribute('type') ?? ''
    const isTitle = phType === 'title' || phType === 'ctrTitle' || phType === 'subTitle'

    for (const pEl of gbn(sp, 'p')) {
      const text = gbn(pEl, 't').map(t => t.textContent ?? '').join('').trim()
      if (!text) continue
      if (isTitle && !title) title = text
      else paragraphs.push(text)
    }
  }

  // Tables
  for (const tr of gbn(doc, 'tr')) {
    const rowText = gbn(tr, 'tc')
      .map(tc => gbn(tc, 't').map(t => t.textContent ?? '').join('').trim())
      .filter(Boolean)
      .join('  |  ')
    if (rowText) paragraphs.push(rowText)
  }

  return { title, paragraphs }
}

async function getSlideFiles(zip: any): Promise<string[]> {
  // Parse rels to get rId -> slide path
  const relsXml: string | null = await zip.file('ppt/_rels/presentation.xml.rels')?.async('string') ?? null
  const rels: Record<string, string> = {}

  if (relsXml) {
    const rDoc = new DOMParser().parseFromString(relsXml, 'text/xml')
    for (const rel of gbn(rDoc, 'Relationship')) {
      const type = rel.getAttribute('Type') ?? ''
      if (!type.endsWith('/slide')) continue
      const id = rel.getAttribute('Id') ?? ''
      const target = rel.getAttribute('Target') ?? ''
      rels[id] = `ppt/${target.replace(/^\//, '')}`
    }
  }

  // Get ordered rIds from presentation.xml
  const presXml: string | null = await zip.file('ppt/presentation.xml')?.async('string') ?? null
  if (presXml) {
    const pDoc = new DOMParser().parseFromString(presXml, 'text/xml')
    const ordered: string[] = []
    for (const sldId of gbn(pDoc, 'sldId')) {
      const rId = sldId.getAttributeNS(
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id'
      ) ?? sldId.getAttribute('r:id') ?? ''
      if (rId && rels[rId]) ordered.push(rels[rId])
    }
    if (ordered.length > 0) return ordered
  }

  // Fallback: alphabetical
  return Object.values(rels).sort((a, b) => {
    const na = parseInt(a.match(/\d+/)?.[0] ?? '0')
    const nb = parseInt(b.match(/\d+/)?.[0] ?? '0')
    return na - nb
  })
}

async function parsePPTX(buf: ArrayBuffer): Promise<{ slides: SlideData[]; title: string }> {
  const JSZip = await loadJSZip()
  const zip = await new JSZip().loadAsync(buf)

  // Presentation title from docProps
  let presentationTitle = ''
  const coreXml: string | null = await zip.file('docProps/core.xml')?.async('string') ?? null
  if (coreXml) {
    const cDoc = new DOMParser().parseFromString(coreXml, 'text/xml')
    presentationTitle = gbn(cDoc, 'title')[0]?.textContent?.trim() ?? ''
  }

  const slideFiles = await getSlideFiles(zip)
  const slides: SlideData[] = []

  for (let i = 0; i < slideFiles.length; i++) {
    const xmlStr: string | null = await zip.file(slideFiles[i])?.async('string') ?? null
    if (!xmlStr) continue
    const { title, paragraphs } = parseSlideXML(xmlStr)
    slides.push({ title, paragraphs, idx: i })
  }

  return { slides, title: presentationTitle }
}

// ─── PDF builder ──────────────────────────────────────────────────────────────
function wrapText(text: string, maxW: number, fontSize: number, font: any): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word
    try {
      if (font.widthOfTextAtSize(test, fontSize) > maxW && cur) {
        lines.push(cur); cur = word
      } else cur = test
    } catch { lines.push(cur); cur = word }
  }
  if (cur) lines.push(cur)
  return lines
}

async function buildPDF(slides: SlideData[], theme: Theme, presTitle: string, filename: string) {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(presTitle || filename)
  pdfDoc.setAuthor('EditPDF AI')

  const bold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const normal = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const th = THEMES[theme]
  const W = 960, H = 540
  const pad = 48

  for (const slide of slides) {
    const page = pdfDoc.addPage([W, H])

    // Background
    page.drawRectangle({ x:0, y:0, width:W, height:H, color: rgb(...th.bg) })

    // Top accent bar
    page.drawRectangle({ x:0, y:H-5, width:W, height:5, color: rgb(...th.bar) })

    // Slide number
    const numTxt = `${slide.idx + 1} / ${slides.length}`
    const numW = normal.widthOfTextAtSize(numTxt, 10)
    page.drawText(numTxt, { x: W-pad-numW, y: 14, size: 10, font: normal, color: rgb(...th.num) })

    // Title
    const titleFontSize = 32
    const titleMaxW = W - pad * 2
    const titleLines = slide.title
      ? wrapText(slide.title, titleMaxW, titleFontSize, bold)
      : [`Slide ${slide.idx + 1}`]

    let y = H - 55
    for (const line of titleLines.slice(0, 2)) {
      page.drawText(line, { x: pad, y, size: titleFontSize, font: bold, color: rgb(...th.title) })
      y -= titleFontSize * 1.2
    }

    // Divider
    page.drawRectangle({ x: pad, y: y - 4, width: W - pad*2, height: 1.5, color: rgb(...th.bar), opacity: 0.4 })
    y -= 20

    // Bullets
    const bulletFontSize = 14
    const bulletMaxW = W - pad*2 - 22
    for (const para of slide.paragraphs) {
      if (y < 40) break
      if (!para.trim()) continue

      // Dot
      page.drawCircle({ x: pad + 7, y: y + 4, size: 3, color: rgb(...th.title), opacity: 0.8 })

      const bLines = wrapText(para, bulletMaxW, bulletFontSize, normal)
      for (let li = 0; li < Math.min(bLines.length, 3); li++) {
        if (y < 40) break
        page.drawText(bLines[li], {
          x: pad + 18, y,
          size: bulletFontSize, font: normal, color: rgb(...th.text),
        })
        y -= bulletFontSize * 1.6
      }
      y -= 4
    }
  }

  const bytes = await pdfDoc.save()
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.replace(/\.pptx?$/i, '') + '.pdf'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`
  return `${(b/1048576).toFixed(2)} MB`
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PPTToPDFPage() {
  const [file,       setFile]       = useState<File | null>(null)
  const [isDrop,     setIsDrop]     = useState(false)
  const [slides,     setSlides]     = useState<SlideData[] | null>(null)
  const [presTitle,  setPresTitle]  = useState('')
  const [theme,      setTheme]      = useState<Theme>('white')
  const [parsing,    setParsing]    = useState(false)
  const [dlLoading,  setDlLoading]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [step,       setStep]       = useState('')
  const [error,      setError]      = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.match(/\.pptx?$/i)) { setError('Please upload a .pptx or .ppt file.'); return }
    setError(''); setSlides(null); setFile(f); setParsing(true); setStep('Parsing presentation…'); setProgress(15)
    try {
      const buf = await f.arrayBuffer()
      setStep('Reading slides…'); setProgress(45)
      const { slides: parsed, title } = await parsePPTX(buf)
      if (!parsed.length) { setError('No slides found in this file.'); setParsing(false); return }
      setSlides(parsed)
      setPresTitle(title)
      setProgress(100)
    } catch (e: any) {
      setError(e.message ?? 'Failed to parse file.')
    } finally {
      setParsing(false); setStep('')
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const download = async () => {
    if (!slides || !file) return
    setDlLoading(true); setError('')
    try {
      setProgress(30)
      await buildPDF(slides, theme, presTitle, file.name)
      setProgress(100)
    } catch (e: any) {
      setError(e.message ?? 'Download failed.')
    } finally {
      setDlLoading(false)
    }
  }

  const reset = () => {
    setFile(null); setSlides(null); setPresTitle(''); setError('')
    setProgress(0); setStep(''); setParsing(false); setDlLoading(false)
  }

  const th = THEMES[theme]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        <div className="prog"><div className="prog-fill" style={{ width: `${progress}%` }}/></div>

        <div className="workspace">

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="sb">

            <div className="sb-sec">
              <div className="sb-ttl">PPTX File</div>
              {!file ? (
                <div className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}>
                  <div className="drop-icon">📊</div>
                  <div className="drop-txt">Drop .pptx here</div>
                  <div className="drop-sub">Supports .pptx files</div>
                  <button className="drop-btn">📂 Choose File</button>
                </div>
              ) : (
                <div className="file-row">
                  <div className="file-ic">📊</div>
                  <div className="file-info">
                    <div className="file-name" title={file.name}>{file.name}</div>
                    <div className="file-meta">{fmtBytes(file.size)}{slides ? ` · ${slides.length} slides` : ''}</div>
                  </div>
                  <button className="file-rm" onClick={reset}>×</button>
                </div>
              )}
            </div>

            <div className="sb-sec">
              <div className="sb-ttl">PDF Theme</div>
              <div className="theme-grid">
                {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([key, t]) => (
                  <button key={key} className={`theme-btn${theme === key ? ' on' : ''}`}
                    onClick={() => setTheme(key)}>
                    <div className="theme-swatch" style={{
                      background: t.cssBg,
                      border: t.cssBg === '#fff' ? '1px solid #e0e0e0' : 'none',
                    }}/>
                    <div className="theme-name">{t.icon} {t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {slides && (
              <div className="sb-sec">
                <button className="gen-btn" onClick={download} disabled={dlLoading}>
                  {dlLoading
                    ? <><span style={{ display:'inline-block',width:13,height:13,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',marginRight:7,verticalAlign:'middle' }}/>Building PDF…</>
                    : `⬇ Download PDF (${slides.length} pages)`}
                </button>
              </div>
            )}

            <div style={{ padding: '12px 16px', fontSize: 10, color: 'rgba(0,0,0,.35)', lineHeight: 1.6 }}>
              Converted entirely in your browser — no upload required. Images are omitted; text and tables are preserved. JSZip loads from CDN on first use.
            </div>
          </aside>

          {/* ── Main ─────────────────────────────────────────────────── */}
          <main className="main">

            {slides && (
              <div className="toolbar">
                <div className="tool-info">
                  <strong>{presTitle || file?.name?.replace(/\.pptx?$/i,'') || 'Presentation'}</strong>
                  {' '}· {slides.length} slides → PDF
                </div>
                <button className="tool-btn dl" onClick={download} disabled={dlLoading}>
                  {dlLoading ? <><div className="spin-sm"/> Building…</> : '⬇ Download PDF'}
                </button>
              </div>
            )}

            {/* Hero */}
            {!file && !parsing && (
              <div className="hero">
                <div className="hero-badge">✦ No Upload Required</div>
                <h1 className="hero-h1">PowerPoint <em>to PDF</em></h1>
                <p className="hero-sub">Convert .pptx presentations to PDF entirely in your browser. No data leaves your device.</p>
                <div className="feat-grid">
                  <div className="feat"><div className="feat-icon">🔒</div><div className="feat-t">100% Private</div><div className="feat-d">Converted locally in browser</div></div>
                  <div className="feat"><div className="feat-icon">📄</div><div className="feat-t">All Slides</div><div className="feat-d">Every slide → one PDF page</div></div>
                  <div className="feat"><div className="feat-icon">🎨</div><div className="feat-t">3 Themes</div><div className="feat-d">White, Navy, Dark</div></div>
                </div>
              </div>
            )}

            {parsing && (
              <div className="loading">
                <div className="spin-lg"/>
                <div className="load-step">{step || 'Parsing…'}</div>
                <div className="load-sub">Reading slide content from your presentation…</div>
              </div>
            )}

            {error && <div className="err-bar">⚠ {error}</div>}

            {/* Slide previews */}
            {slides && (
              <div className="slides-wrap">
                {slides.map((slide, i) => (
                  <div key={i} className="sl-card">
                    <div className="sl-inner" style={{ background: th.cssBg }}>
                      <div className="sl-accent" style={{ background: th.cssBar }}/>
                      <span className="sl-num" style={{ color: th.cssTitle }}>{i+1} / {slides.length}</span>

                      <div className="sl-title-area">
                        <div className="sl-title-txt" style={{ color: th.cssTitle }}>
                          {slide.title || `Slide ${i+1}`}
                        </div>
                      </div>

                      <div className="sl-divider" style={{ background: th.cssTitle }}/>

                      <div className="sl-body">
                        {slide.paragraphs.slice(0, 5).map((p, pi) => (
                          <div key={pi} className="sl-bullet">
                            <div className="sl-dot" style={{ background: th.cssTitle }}/>
                            <span className="sl-bt" style={{ color: th.cssText }}>{p}</span>
                          </div>
                        ))}
                        {slide.paragraphs.length > 5 && (
                          <div className="sl-more" style={{ color: th.cssText }}>
                            +{slide.paragraphs.length - 5} more lines
                          </div>
                        )}
                        {slide.paragraphs.length === 0 && (
                          <div className="sl-more" style={{ color: th.cssText }}>
                            (no text content)
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

      <input ref={fileRef} type="file" accept=".pptx,.ppt" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = '' }}/>
    </>
  )
}
