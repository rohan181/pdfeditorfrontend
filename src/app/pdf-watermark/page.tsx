'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

let _pdfjs: typeof import('pdfjs-dist') | null = null
async function getPdfjs() {
  if (!_pdfjs) {
    _pdfjs = await import('pdfjs-dist')
    _pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${_pdfjs.version}/pdf.worker.min.js`
  }
  return _pdfjs
}

const LANDING_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
:root{
  --bg:#ffffff;--fg:#1d1d1f;--fg2:rgba(29,29,31,.65);--fg3:rgba(29,29,31,.42);
  --b:rgba(0,0,0,.08);--bh:rgba(0,0,0,.14);
  --p:#d97706;--p2:#b45309;--pl:#f59e0b;
  --accent:#f59e0b;--accent2:#d97706;--acl:#92400e;
  --fd:var(--font-jakarta,'Plus Jakarta Sans',sans-serif);
  --fu:var(--font-dm,'DM Sans',sans-serif);
  --fm:var(--font-mono,'JetBrains Mono',monospace);
}
.pg{min-height:100vh;background:#f5f5f7;color:var(--fg);font-family:var(--fu);overflow-x:hidden}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px}
.amb{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ag1{position:absolute;width:900px;height:900px;top:-350px;left:-250px;background:radial-gradient(circle,rgba(245,158,11,.06) 0%,transparent 65%);filter:blur(90px);animation:orb1 28s ease-in-out infinite alternate}
.ag2{position:absolute;width:700px;height:700px;top:20%;right:-180px;background:radial-gradient(circle,rgba(139,92,246,.04) 0%,transparent 65%);filter:blur(80px);animation:orb2 35s ease-in-out infinite alternate}
.ag3{position:absolute;width:600px;height:600px;bottom:5%;left:15%;background:radial-gradient(circle,rgba(245,158,11,.04) 0%,transparent 65%);filter:blur(80px);animation:orb1 42s ease-in-out infinite alternate-reverse}
.agr{position:absolute;inset:0;background-image:radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px);background-size:30px 30px}
@keyframes orb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(60px,45px) scale(1.08)}}
@keyframes orb2{0%{transform:translate(0,0) scale(1.05)}100%{transform:translate(-45px,55px) scale(1)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes tflow{0%{background-position:0% center}100%{background-position:260% center}}
.hero{position:relative;z-index:1;padding:calc(56px + 80px) 0 64px;text-align:center;background:#fff}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:20px;font-family:var(--fm);font-size:9.5px;letter-spacing:.16em;color:#92400e;margin-bottom:28px}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 6px var(--accent);animation:blink 2s ease-in-out infinite}
.hero-h1{font-family:var(--fd);font-weight:800;letter-spacing:-.05em;line-height:.95;margin-bottom:24px}
.h1-top{display:block;font-size:clamp(14px,2vw,20px);color:var(--fg3);font-weight:500;letter-spacing:-.01em;margin-bottom:12px;font-family:var(--fu)}
.h1-main{display:block;font-size:clamp(48px,8vw,92px);background:linear-gradient(115deg,#1d1d1f 10%,#f59e0b 40%,#d97706 65%,#1d1d1f 100%);background-size:260% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 6s linear infinite}
.hero-sub{font-size:clamp(15px,1.8vw,17px);color:var(--fg2);line-height:1.78;max-width:640px;margin:0 auto 40px}
.hero-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:48px}
.hpill{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:20px;font-size:12px;color:var(--fg3)}
.hpill strong{color:var(--fg2);font-weight:600}
.upload-zone{position:relative;border:2px dashed rgba(245,158,11,.3);border-radius:20px;padding:80px 32px;text-align:center;background:rgba(245,158,11,.03);transition:border-color .2s,background .2s;cursor:pointer;max-width:680px;margin:0 auto 80px}
.upload-zone:hover,.upload-zone.drag{border-color:rgba(245,158,11,.55);background:rgba(245,158,11,.06)}
.upload-icon{font-size:52px;margin-bottom:18px;display:block}
.upload-title{font-family:var(--fd);font-size:22px;font-weight:700;color:#1d1d1f;margin-bottom:10px}
.upload-sub{font-size:14px;color:var(--fg3);line-height:1.6;margin-bottom:28px}
.upload-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:11px;font-family:var(--fd);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:transform .15s,box-shadow .15s;box-shadow:0 8px 28px rgba(245,158,11,.3);border:none}
.upload-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(245,158,11,.4)}
.upload-note{font-family:var(--fm);font-size:10px;letter-spacing:.06em;color:var(--fg3);margin-top:18px}
@media(max-width:700px){.wrap{padding:0 20px}.hero{padding:calc(56px + 60px) 0 40px}}
@keyframes spin{to{transform:rotate(360deg)}}
`

// Position preset → CSS left/top percent (watermark center point)
const PRESET_CSS: Record<string, { left: string; top: string }> = {
  'center':        { left:'50%', top:'50%'  },
  'top-left':      { left:'12%', top:'12%'  },
  'top-center':    { left:'50%', top:'12%'  },
  'top-right':     { left:'88%', top:'12%'  },
  'bottom-left':   { left:'12%', top:'88%'  },
  'bottom-center': { left:'50%', top:'88%'  },
  'bottom-right':  { left:'88%', top:'88%'  },
}

// Position preset → pdf-lib x/y (bottom-left origin)
function getPdfXY(
  pos: string, pW: number, pH: number, tW: number, tH: number,
  cx: number, cy: number,
): [number, number] {
  const pad = 40
  switch (pos) {
    case 'top-left':      return [pad,            pH - tH - pad]
    case 'top-center':    return [(pW - tW) / 2,  pH - tH - pad]
    case 'top-right':     return [pW - tW - pad,  pH - tH - pad]
    case 'bottom-left':   return [pad,            pad]
    case 'bottom-center': return [(pW - tW) / 2,  pad]
    case 'bottom-right':  return [pW - tW - pad,  pad]
    case 'custom':        return [pW * cx - tW / 2, pH * cy - tH / 2]
    default:              return [(pW - tW) / 2,  (pH - tH) / 2]
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

// 3×3 position grid button component
function PosGrid({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const presets = [
    ['top-left','top-center','top-right'],
    ['middle-left','center','middle-right'],
    ['bottom-left','bottom-center','bottom-right'],
  ]
  // middle-left / middle-right map to custom for now — show as disabled
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:3 }}>
      {presets.flat().map(p => {
        const active = value === p
        const disabled = p === 'middle-left' || p === 'middle-right'
        return (
          <button
            key={p}
            disabled={disabled}
            onClick={() => !disabled && onChange(p)}
            style={{
              aspectRatio:'1', borderRadius:5,
              border: active ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
              background: active ? 'rgba(99,102,241,0.1)' : disabled ? '#f8fafc' : '#fff',
              cursor: disabled ? 'default' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              padding:0, transition:'all .12s',
            }}
          >
            <span style={{
              width:5, height:5, borderRadius:'50%',
              background: active ? '#6366f1' : disabled ? '#d1d5db' : '#94a3b8',
              display:'block',
            }} />
          </button>
        )
      })}
    </div>
  )
}

export default function PDFWatermarkPage() {
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const wmImageInput  = useRef<HTMLInputElement>(null)
  const pdfBytesRef   = useRef<Uint8Array | null>(null)
  const origBytesRef  = useRef<Uint8Array | null>(null)
  const isDraggingRef = useRef(false)

  const [loaded, setLoaded]               = useState(false)
  const [fileName, setFileName]           = useState('')
  const [pageCount, setPageCount]         = useState(0)
  const [pageImgs, setPageImgs]           = useState<string[]>([])
  const [pageNatWidths, setPageNatWidths] = useState<number[]>([])
  const [isDrag, setIsDrag]               = useState(false)
  const [processing, setProcessing]       = useState(false)
  const [watermarked, setWatermarked]     = useState(false)
  const [statusMsg, setStatusMsg]         = useState('')

  // Watermark state — matching PDFEditor exactly
  const [wmText, setWmText]         = useState('CONFIDENTIAL')
  const [wmColor, setWmColor]       = useState('#dc2626')
  const [wmOpacity, setWmOpacity]   = useState(0.2)
  const [wmFontSize, setWmFontSize] = useState(52)
  const [wmRotation, setWmRotation] = useState(-35)
  const [wmImageSrc, setWmImageSrc] = useState('')

  // Position — from PDFEditor's DraggableElement concept
  const [wmPosition, setWmPosition] = useState('center')
  const [wmCustomX, setWmCustomX]   = useState(0.5)  // 0–1 (fraction of page width)
  const [wmCustomY, setWmCustomY]   = useState(0.5)  // 0–1 (fraction, 0=bottom 1=top, pdf-lib coords)

  const renderAllPages = useCallback(async (doc: PDFDocumentProxy) => {
    const imgs: string[] = []
    const natWidths: number[] = []
    const cap = Math.min(doc.numPages, 30)
    for (let i = 1; i <= cap; i++) {
      const page = await doc.getPage(i)
      const nat  = page.getViewport({ scale: 1 })
      natWidths.push(nat.width)
      const vp = page.getViewport({ scale: 900 / nat.width })
      const c  = document.createElement('canvas')
      c.width  = vp.width
      c.height = vp.height
      await page.render({ canvasContext: c.getContext('2d')!, viewport: vp }).promise
      imgs.push(c.toDataURL('image/jpeg', 0.92))
    }
    setPageImgs(imgs)
    setPageNatWidths(natWidths)
  }, [])

  const loadPDF = useCallback(async (bytes: Uint8Array, name: string) => {
    setProcessing(true)
    setStatusMsg('Loading…')
    try {
      const copy = bytes.slice(0)
      origBytesRef.current = copy.slice(0)
      pdfBytesRef.current  = copy
      const doc = await (await getPdfjs()).getDocument({ data: bytes }).promise
      setFileName(name)
      setPageCount(doc.numPages)
      setWatermarked(false)
      setPageImgs([])
      setLoaded(true)
      setStatusMsg(`${doc.numPages} page${doc.numPages !== 1 ? 's' : ''} loaded`)
      await renderAllPages(doc)
    } catch {
      setStatusMsg('Failed to load PDF')
    } finally {
      setProcessing(false)
    }
  }, [renderAllPages])

  const handleFile = useCallback((file: File) => {
    if (!file.type.includes('pdf')) return
    const reader = new FileReader()
    reader.onload = e => loadPDF(new Uint8Array(e.target!.result as ArrayBuffer), file.name)
    reader.readAsArrayBuffer(file)
  }, [loadPDF])

  const handleImgFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = e => setWmImageSrc(e.target!.result as string)
    reader.readAsDataURL(file)
  }, [])

  const applyWatermark = useCallback(async () => {
    const cur = pdfBytesRef.current
    if (!cur || cur.byteLength === 0) return
    setProcessing(true)
    setStatusMsg('Applying watermark…')
    try {
      const doc  = await PDFDocument.load(cur.slice(0))
      const font = await doc.embedFont(StandardFonts.HelveticaBold)
      const pdfPages = doc.getPages()
      const [cr, cg, cb] = hexToRgb(wmColor)

      let embImg: Awaited<ReturnType<typeof doc.embedPng>> | null = null
      if (wmImageSrc) {
        const base64 = wmImageSrc.split(',')[1]
        const arr = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
        embImg = arr[0] === 0x89 ? await doc.embedPng(arr.buffer) : await doc.embedJpg(arr.buffer)
      }

      for (const page of pdfPages) {
        const { width: pW, height: pH } = page.getSize()

        if (embImg) {
          const iW = embImg.width * 0.4
          const iH = embImg.height * 0.4
          if (wmPosition === 'tile') {
            const cols = Math.ceil(pW / (iW + 80)) + 1
            const rows = Math.ceil(pH / (iH + 80)) + 1
            for (let r = 0; r < rows; r++)
              for (let c = 0; c < cols; c++)
                page.drawImage(embImg, { x: c*(iW+80)-40, y: r*(iH+80)-40, width: iW, height: iH, opacity: wmOpacity, rotate: degrees(wmRotation) })
          } else {
            const [x, y] = getPdfXY(wmPosition, pW, pH, iW, iH, wmCustomX, wmCustomY)
            page.drawImage(embImg, { x, y, width: iW, height: iH, opacity: wmOpacity, rotate: degrees(wmRotation) })
          }
        } else if (wmText.trim()) {
          const tW = font.widthOfTextAtSize(wmText, wmFontSize)
          const tH = wmFontSize
          if (wmPosition === 'tile') {
            const cols = Math.ceil(pW / (tW + 80)) + 1
            const rows = Math.ceil(pH / (tH + 80)) + 1
            for (let r = 0; r < rows; r++)
              for (let c = 0; c < cols; c++)
                page.drawText(wmText, { x: c*(tW+80)-40, y: r*(tH+80)-40, size: wmFontSize, font, color: rgb(cr,cg,cb), opacity: wmOpacity, rotate: degrees(wmRotation) })
          } else {
            const [x, y] = getPdfXY(wmPosition, pW, pH, tW, tH, wmCustomX, wmCustomY)
            page.drawText(wmText, { x, y, size: wmFontSize, font, color: rgb(cr,cg,cb), opacity: wmOpacity, rotate: degrees(wmRotation) })
          }
        }
      }

      const result = await doc.save()
      pdfBytesRef.current = result.slice(0)
      setWatermarked(true)
      const newDoc = await (await getPdfjs()).getDocument({ data: result }).promise
      await renderAllPages(newDoc)
      setStatusMsg('Watermark applied — ready to download')
    } catch (err) {
      setStatusMsg(`Error: ${(err as Error)?.message ?? 'Failed'}`)
    } finally {
      setProcessing(false)
    }
  }, [wmText, wmColor, wmOpacity, wmFontSize, wmRotation, wmImageSrc, wmPosition, wmCustomX, wmCustomY, renderAllPages])

  const removeWatermark = useCallback(async () => {
    const orig = origBytesRef.current
    if (!orig) return
    setProcessing(true)
    setStatusMsg('Removing watermark…')
    try {
      const copy = orig.slice(0)
      pdfBytesRef.current = copy.slice(0)
      setWatermarked(false)
      const doc = await (await getPdfjs()).getDocument({ data: copy }).promise
      await renderAllPages(doc)
      setStatusMsg('Original restored')
    } catch {
      setStatusMsg('Failed')
    } finally {
      setProcessing(false)
    }
  }, [renderAllPages])

  const downloadPDF = useCallback(() => {
    const cur = pdfBytesRef.current
    if (!cur || !watermarked) return
    const blob = new Blob([cur.buffer as ArrayBuffer], { type: 'application/pdf' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = fileName.replace(/\.pdf$/i, '') + '_watermarked.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }, [watermarked, fileName])

  const resetAll = () => {
    setLoaded(false); setPageImgs([]); setWatermarked(false)
    pdfBytesRef.current = null; origBytesRef.current = null
    setStatusMsg('')
  }

  // Overlay position for live preview
  function getOverlayStyle(pos: string, cx: number, cy: number): React.CSSProperties {
    if (pos === 'custom') return { left:`${cx * 100}%`, top:`${(1 - cy) * 100}%` }
    const p = PRESET_CSS[pos] ?? PRESET_CSS['center']
    return { left: p.left, top: p.top }
  }

  // ── Landing page ─────────────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />
        <div className="pg">
          <div className="amb" aria-hidden="true">
            <div className="ag1" /><div className="ag2" /><div className="ag3" /><div className="agr" />
          </div>
          <SiteNav />
          <header className="hero">
            <div className="wrap">
              <div className="hero-badge"><span className="bdot" /><span>PDF WATERMARKER · FREE · NO SIGNUP</span></div>
              <h1 className="hero-h1">
                <span className="h1-top">Protect your documents</span>
                <span className="h1-main">PDF Watermarker</span>
              </h1>
              <p className="hero-sub">Add custom text or image watermarks to any PDF. Control opacity, angle, size and position. Runs entirely in your browser.</p>
              <div className="hero-pills">
                {[['Text & Image','Watermarks'],['Full','Opacity Control'],['Any','Angle'],['9','Positions'],['Free','Forever']].map(([v,l])=>(
                  <div key={l} className="hpill"><strong>{v}</strong><span>{l}</span></div>
                ))}
              </div>
            </div>
          </header>
          <section style={{ position:'relative', zIndex:1, paddingBottom:80 }}>
            <div className="wrap">
              <div
                className={`upload-zone${isDrag ? ' drag' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDrag(true) }}
                onDragLeave={() => setIsDrag(false)}
                onDrop={e => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                onClick={() => fileInputRef.current?.click()}
                role="button" tabIndex={0} aria-label="Upload PDF"
                onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <span className="upload-icon">🔖</span>
                <p className="upload-title">Drop your PDF here</p>
                <p className="upload-sub">or click to browse. Your PDF never leaves your browser.</p>
                <button className="upload-btn" type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Choose PDF File
                </button>
                <p className="upload-note">PDF · UP TO 100 MB · 100% PRIVATE</p>
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" style={{ display:'none' }}
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            </div>
          </section>
          <SiteFooter />
        </div>
      </>
    )
  }

  // ── Editor ────────────────────────────────────────────────────────────────────
  const isCustom = wmPosition === 'custom'
  const isTile   = wmPosition === 'tile'

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#edf0f7', fontFamily:'Manrope,sans-serif' }}>

      {/* Top bar */}
      <div style={{ height:52, background:'#fff', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', padding:'0 14px', gap:10, flexShrink:0, zIndex:50, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:7, textDecoration:'none', flexShrink:0 }}>
          <span style={{ width:28, height:28, background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ width:13, height:15, background:'rgba(255,255,255,.95)', clipPath:'polygon(0% 0%,68% 0%,100% 26%,100% 100%,0% 100%)' }} />
          </span>
          <span style={{ fontSize:15, fontWeight:800, color:'#0f172a', letterSpacing:'-0.03em' }}>Edit<span style={{ color:'#8b5cf6' }}>PDF</span></span>
        </Link>
        <div style={{ width:1, height:38, background:'#e2e8f0' }} />
        <span style={{ fontSize:11, color:'#64748b', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>{fileName}</span>
        {statusMsg && (
          <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, whiteSpace:'nowrap', background: watermarked ? 'rgba(34,197,94,0.09)' : processing ? 'rgba(251,191,36,0.09)' : 'rgba(0,0,0,0.04)', border: watermarked ? '1px solid rgba(34,197,94,0.22)' : processing ? '1px solid rgba(251,191,36,0.22)' : '1px solid #e2e8f0', color: watermarked ? '#16a34a' : processing ? '#92400e' : '#64748b' }}>
            {processing ? '⟳ ' : ''}{statusMsg}
          </span>
        )}
        <div style={{ flex:1 }} />
        <button disabled={!watermarked} onClick={downloadPDF} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 14px', borderRadius:7, border:'none', cursor: watermarked ? 'pointer' : 'not-allowed', background: watermarked ? 'linear-gradient(135deg,#22c55e,#16a34a)' : '#e2e8f0', color: watermarked ? '#fff' : '#94a3b8', fontSize:12, fontWeight:700 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </button>
        <button onClick={resetAll} style={{ padding:'5px 11px', borderRadius:7, border:'1px solid #e2e8f0', background:'transparent', color:'#64748b', fontSize:11.5, fontWeight:600, cursor:'pointer' }}>← New File</button>
        <Link href="/ai-pdf-form-filler" style={{ padding:'5px 11px', borderRadius:7, border:'1px solid #e2e8f0', background:'transparent', color:'#64748b', fontSize:11.5, fontWeight:600, textDecoration:'none' }}>Form Filler</Link>
        <Link href="/pdf-editor" style={{ padding:'5px 11px', borderRadius:7, border:'1px solid #e2e8f0', background:'transparent', color:'#64748b', fontSize:11.5, fontWeight:600, textDecoration:'none' }}>PDF Editor</Link>
        <Link href="/" style={{ padding:'5px 11px', borderRadius:7, border:'1px solid #e2e8f0', background:'transparent', color:'#64748b', fontSize:11.5, fontWeight:600, textDecoration:'none' }}>All Tools</Link>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', minHeight:0 }}>

        {/* PDF scroll area */}
        <div style={{ flex:1, overflow:'auto', padding:'24px', display:'flex', flexDirection:'column', alignItems:'center', gap:20, background:'#edf0f7', position:'relative' }}>
          {processing && pageImgs.length === 0 && (
            <div style={{ marginTop:80, display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #e2e8f0', borderTopColor:'#6366f1', animation:'spin .8s linear infinite' }} />
              <span style={{ fontSize:12, color:'#94a3b8' }}>Loading…</span>
            </div>
          )}

          {pageImgs.map((src, i) => {
            const natW = pageNatWidths[i] ?? 612
            const displayScale = 860 / natW
            const fontSize = wmFontSize * displayScale
            const overlayPos = isCustom
              ? getOverlayStyle('custom', wmCustomX, wmCustomY)
              : getOverlayStyle(wmPosition, wmCustomX, wmCustomY)
            const hasContent = wmImageSrc || wmText.trim()

            return (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div
                  style={{
                    position:'relative', display:'inline-block',
                    boxShadow:'0 4px 24px rgba(0,0,0,0.14)', lineHeight:0,
                    cursor: isCustom ? 'crosshair' : 'default',
                    touchAction: isCustom ? 'none' : 'auto',
                    userSelect:'none',
                  }}
                  onPointerDown={e => {
                    if (!isCustom) return
                    e.preventDefault()
                    isDraggingRef.current = true
                    const rect = e.currentTarget.getBoundingClientRect()
                    setWmCustomX(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
                    setWmCustomY(Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)))
                  }}
                  onPointerMove={e => {
                    if (!isCustom || !isDraggingRef.current) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    setWmCustomX(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
                    setWmCustomY(Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)))
                  }}
                  onPointerUp={() => { isDraggingRef.current = false }}
                  onPointerLeave={() => { isDraggingRef.current = false }}
                >
                  <img src={src} alt={`Page ${i + 1}`} style={{ display:'block', width:'100%', maxWidth:860, height:'auto', userSelect:'none' }} draggable={false} />

                  {/* ── WatermarkDisplay — same pattern as PDFEditor ── */}
                  {hasContent && !isTile && (
                    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
                      <div style={{
                        position:'absolute',
                        left: overlayPos.left,
                        top: overlayPos.top,
                        transform:`translate(-50%,-50%) rotate(${wmRotation}deg)`,
                        opacity: wmOpacity,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        {wmImageSrc ? (
                          <img src={wmImageSrc} alt="wm" draggable={false} style={{ maxWidth: Math.round(displayScale * natW * 0.4), maxHeight: Math.round(displayScale * natW * 0.4), objectFit:'contain', userSelect:'none' }} />
                        ) : (
                          <span style={{ fontSize, fontWeight:800, color:wmColor, fontFamily:'Manrope,sans-serif', letterSpacing:'0.12em', whiteSpace:'nowrap', userSelect:'none', textShadow:'0 1px 3px rgba(0,0,0,0.1)' }}>
                            {wmText}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tile mode */}
                  {hasContent && isTile && (
                    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', opacity: wmOpacity }}>
                      {Array.from({ length: 20 }, (_, ti) => (
                        <div key={ti} style={{
                          position:'absolute',
                          left:`${(ti % 4) * 28 - 5}%`,
                          top:`${Math.floor(ti / 4) * 24 - 5}%`,
                          transform:`rotate(${wmRotation}deg)`,
                          transformOrigin:'center',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          {wmImageSrc ? (
                            <img src={wmImageSrc} alt="" draggable={false} style={{ width: Math.round(fontSize * 1.5), objectFit:'contain', userSelect:'none' }} />
                          ) : (
                            <span style={{ fontSize: Math.round(fontSize * 0.65), fontWeight:800, color:wmColor, fontFamily:'Manrope,sans-serif', letterSpacing:'0.12em', whiteSpace:'nowrap', userSelect:'none' }}>
                              {wmText}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom drag pin */}
                  {isCustom && (
                    <div style={{ position:'absolute', left:`${wmCustomX*100}%`, top:`${(1-wmCustomY)*100}%`, transform:'translate(-50%,-50%)', pointerEvents:'none', zIndex:10 }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(99,102,241,0.9)', border:'2px solid #fff', boxShadow:'0 0 0 3px rgba(99,102,241,0.25),0 2px 8px rgba(0,0,0,0.4)' }} />
                      {i === 0 && <div style={{ position:'absolute', top:22, left:'50%', transform:'translateX(-50%)', fontSize:8, fontFamily:'monospace', color:'#6366f1', whiteSpace:'nowrap', background:'rgba(255,255,255,0.92)', padding:'2px 7px', borderRadius:3, border:'1px solid rgba(99,102,241,0.2)' }}>drag to move</div>}
                    </div>
                  )}
                </div>
                <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'.1em', color:'#94a3b8' }}>{i + 1} / {pageCount}</span>
              </div>
            )
          })}

          {pageCount > 30 && <span style={{ fontSize:10, color:'#94a3b8' }}>Showing first 30 of {pageCount} pages</span>}
        </div>

        {/* ── Watermark panel — PDFEditor style ── */}
        <div style={{ width:300, flexShrink:0, background:'#fff', borderLeft:'1px solid #e8ecf5', display:'flex', flexDirection:'column', overflow:'hidden' }}>

          {/* Header */}
          <div style={{ padding:'12px 14px', borderBottom:'1px solid #e8ecf5', display:'flex', alignItems:'center', gap:8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10l2 4 2-4 2 4 2-4 2 4"/>
            </svg>
            <span style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>Watermark</span>
            <span style={{ marginLeft:'auto', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:3, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.18)', color:'#6366f1', letterSpacing:'0.06em' }}>LIVE</span>
          </div>

          {/* Controls */}
          <div style={{ flex:1, overflow:'auto', padding:14, display:'flex', flexDirection:'column', gap:14 }}>

            {/* Text / Image tabs */}
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={() => setWmImageSrc('')} style={{ padding:'4px 12px', borderRadius:6, border:'none', fontSize:11, fontWeight:700, cursor:'pointer', background: !wmImageSrc ? 'linear-gradient(135deg,#6366f1,#818cf8)' : '#f1f5f9', color: !wmImageSrc ? '#fff' : '#64748b' }}>
                Text Watermark
              </button>
              <button onClick={() => wmImageInput.current?.click()} style={{ padding:'4px 12px', borderRadius:6, border:'none', fontSize:11, fontWeight:700, cursor:'pointer', background: wmImageSrc ? 'linear-gradient(135deg,#6366f1,#818cf8)' : '#f1f5f9', color: wmImageSrc ? '#fff' : '#64748b', display:'flex', alignItems:'center', gap:5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                Image{wmImageSrc ? ' ✓' : ''}
              </button>
              {wmImageSrc && <button onClick={() => setWmImageSrc('')} style={{ padding:'4px 8px', borderRadius:6, border:'1px solid #fca5a5', background:'#fff1f2', color:'#dc2626', fontSize:10, fontWeight:700, cursor:'pointer' }}>✕</button>}
            </div>
            <input ref={wmImageInput} type="file" accept="image/png,image/jpeg" style={{ display:'none' }} onChange={e => e.target.files?.[0] && handleImgFile(e.target.files[0])} />

            {/* Image preview */}
            {wmImageSrc && (
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <img src={wmImageSrc} alt="wm" style={{ height:44, maxWidth:120, objectFit:'contain', borderRadius:4, border:'1px solid #e2e8f0', opacity: wmOpacity }} />
                <span style={{ fontSize:10, color:'#94a3b8' }}>Image preview (opacity applied)</span>
              </div>
            )}

            {/* Text */}
            {!wmImageSrc && (
              <div>
                <p style={{ margin:'0 0 5px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase' }}>Text</p>
                <input value={wmText} onChange={e => setWmText(e.target.value.toUpperCase())} placeholder="WATERMARK TEXT" maxLength={30}
                  style={{ padding:'5px 10px', borderRadius:7, border:'1px solid #e2e8f0', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', outline:'none', letterSpacing:'0.05em', width:'100%' }} />
              </div>
            )}

            {/* Color */}
            {!wmImageSrc && (
              <div>
                <p style={{ margin:'0 0 5px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase' }}>Color</p>
                <input type="color" value={wmColor} onChange={e => setWmColor(e.target.value)}
                  style={{ width:36, height:28, border:'none', borderRadius:5, cursor:'pointer', padding:2 }} />
              </div>
            )}

            {/* Opacity */}
            <div>
              <p style={{ margin:'0 0 5px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase' }}>Opacity {Math.round(wmOpacity*100)}%</p>
              <input type="range" min={0.05} max={0.8} step={0.05} value={wmOpacity} onChange={e => setWmOpacity(parseFloat(e.target.value))} style={{ width:'100%' }} />
            </div>

            {/* Font size */}
            {!wmImageSrc && (
              <div>
                <p style={{ margin:'0 0 5px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase' }}>Size {wmFontSize}pt</p>
                <input type="range" min={20} max={120} step={4} value={wmFontSize} onChange={e => setWmFontSize(parseInt(e.target.value))} style={{ width:'100%' }} />
              </div>
            )}

            {/* Angle */}
            <div>
              <p style={{ margin:'0 0 5px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase' }}>Angle {wmRotation}°</p>
              <input type="range" min={-90} max={90} step={5} value={wmRotation} onChange={e => setWmRotation(parseInt(e.target.value))} style={{ width:'100%' }} />
            </div>

            {/* ── Position — same concept as PDFEditor DraggableElement ── */}
            <div>
              <p style={{ margin:'0 0 8px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase' }}>Position</p>

              {/* 3×3 grid picker */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4, marginBottom:8 }}>
                {[
                  ['top-left','top-center','top-right'],
                  ['middle-left','center','middle-right'],
                  ['bottom-left','bottom-center','bottom-right'],
                ].flat().map(p => {
                  const disabled = p === 'middle-left' || p === 'middle-right'
                  const active = wmPosition === p
                  return (
                    <button key={p} disabled={disabled} onClick={() => !disabled && setWmPosition(p)}
                      title={p.replace(/-/g,' ')}
                      style={{ aspectRatio:'1', borderRadius:6, border: active ? '2px solid #6366f1' : '1.5px solid #e2e8f0', background: active ? 'rgba(99,102,241,0.1)' : disabled ? '#f8fafc' : '#fff', cursor: disabled ? 'default' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .12s' }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background: active ? '#6366f1' : disabled ? '#e2e8f0' : '#cbd5e1', display:'block' }} />
                    </button>
                  )
                })}
              </div>

              {/* Extra options row */}
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={() => setWmPosition('tile')}
                  style={{ flex:1, padding:'4px 8px', borderRadius:6, border: wmPosition==='tile' ? '2px solid #6366f1' : '1.5px solid #e2e8f0', background: wmPosition==='tile' ? 'rgba(99,102,241,0.1)' : '#fff', color: wmPosition==='tile' ? '#6366f1' : '#64748b', fontSize:10, fontWeight:700, cursor:'pointer' }}>
                  Tile
                </button>
                <button onClick={() => setWmPosition('custom')}
                  style={{ flex:1, padding:'4px 8px', borderRadius:6, border: wmPosition==='custom' ? '2px solid #6366f1' : '1.5px solid #e2e8f0', background: wmPosition==='custom' ? 'rgba(99,102,241,0.1)' : '#fff', color: wmPosition==='custom' ? '#6366f1' : '#64748b', fontSize:10, fontWeight:700, cursor:'pointer' }}>
                  Custom
                </button>
              </div>

              {/* Hint for custom drag */}
              {isCustom && (
                <div style={{ marginTop:6, fontSize:10, color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'6px 9px', lineHeight:1.6 }}>
                  Click or drag on any PDF page to place the watermark. The blue dot shows the current position.
                </div>
              )}
            </div>

            {/* Apply button */}
            <button onClick={applyWatermark} disabled={processing || (!wmImageSrc && !wmText.trim())}
              style={{ padding:'7px 16px', borderRadius:8, border:'none', width:'100%', background: (processing || (!wmImageSrc && !wmText.trim())) ? '#e2e8f0' : 'linear-gradient(135deg,#6366f1,#818cf8)', color: (processing || (!wmImageSrc && !wmText.trim())) ? '#94a3b8' : '#fff', fontSize:12, fontWeight:700, cursor: processing ? 'not-allowed' : 'pointer' }}>
              {processing ? 'Processing…' : 'Apply to All Pages'}
            </button>

            {/* Download */}
            <button onClick={downloadPDF} disabled={!watermarked}
              style={{ padding:'7px 16px', borderRadius:8, border:'none', width:'100%', background: watermarked ? 'linear-gradient(135deg,#22c55e,#16a34a)' : '#e2e8f0', color: watermarked ? '#fff' : '#94a3b8', fontSize:12, fontWeight:700, cursor: watermarked ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </button>

            {/* Remove */}
            {watermarked && (
              <button onClick={removeWatermark} disabled={processing}
                style={{ padding:'6px 14px', borderRadius:8, width:'100%', border:'1px solid #fca5a5', background:'#fff1f2', color:'#dc2626', fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                Remove Watermark
              </button>
            )}

            <button onClick={resetAll} style={{ background:'none', border:'none', fontSize:10, color:'#94a3b8', cursor:'pointer', textDecoration:'underline', padding:'2px 0' }}>
              ← Load different PDF
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <ToolSEOSection {...toolSeoData['pdf-watermark']} />
    </div>
  )
}
