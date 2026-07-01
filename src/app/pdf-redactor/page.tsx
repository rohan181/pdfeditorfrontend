'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { PDFDocument, rgb, BlendMode } from 'pdf-lib'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.upload-pg{min-height:100vh;background:#fff;display:flex;flex-direction:column}
.wrap{max-width:720px;margin:0 auto;padding:0 28px;width:100%}
.editor-pg{height:100vh;overflow:hidden;display:flex;flex-direction:column;background:#fff}


.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 20px}
.logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#E24B4A}
.back{font-size:13px;font-weight:500;color:rgba(0,0,0,.5);text-decoration:none;padding:5px 14px;border-radius:99px;transition:color .15s}
.back:hover{color:#1d1d1f}

.hero{padding:64px 0 36px;text-align:center;border-bottom:1px solid #f0f0f0}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fff5f5;border:1px solid rgba(226,75,74,.2);border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.08em;color:#E24B4A;margin-bottom:18px;text-transform:uppercase}
.bdot{width:5px;height:5px;border-radius:50%;background:#E24B4A}
.hero h1{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:clamp(30px,5vw,54px);font-weight:800;letter-spacing:-.05em;line-height:.97;color:#1d1d1f;margin-bottom:14px}
.hero h1 em{font-style:normal;color:#E24B4A}
.hero p{font-size:15px;color:rgba(0,0,0,.5);line-height:1.7;max-width:440px;margin:0 auto}

.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:32px;margin:32px 0 16px;box-shadow:0 2px 20px rgba(0,0,0,.04)}
@media(max-width:600px){.card{padding:20px 16px}}
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#E24B4A;background:#fff5f5}
.drop-icon{font-size:48px;margin-bottom:14px;display:block}
.drop h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:20px;line-height:1.5}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#E24B4A}

.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:48px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:5px}
.info-card p{font-size:12px;color:rgba(0,0,0,.45);line-height:1.6}

/* editor */
.editor-body{flex:1;display:grid;grid-template-columns:230px 1fr;overflow:hidden}
@media(max-width:740px){.editor-body{grid-template-columns:1fr;grid-template-rows:auto 1fr}}

.sidebar{background:#fafafa;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden}
@media(max-width:740px){.sidebar{border-right:none;border-bottom:1px solid #e8e8e8;max-height:150px}}
.sidebar-head{padding:12px 14px;border-bottom:1px solid #e8e8e8;flex-shrink:0}
.sidebar-title{font-size:12px;font-weight:700;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px}
.sidebar-sub{font-size:10px;color:rgba(0,0,0,.4)}
.page-list{overflow-y:auto;flex:1;padding:8px 6px}
.page-thumb-btn{width:100%;border:none;background:transparent;cursor:pointer;padding:5px 6px;border-radius:8px;transition:background .12s;text-align:left;display:flex;align-items:center;gap:9px}
.page-thumb-btn:hover{background:rgba(0,0,0,.04)}
.page-thumb-btn.active{background:rgba(226,75,74,.07)}
.page-thumb-img{width:44px;flex-shrink:0;border-radius:4px;border:1.5px solid #e0e0e0;overflow:hidden;aspect-ratio:.707;background:#fff}
.page-thumb-img img{width:100%;height:100%;object-fit:cover;display:block}
.page-thumb-info{min-width:0}
.page-thumb-num{font-size:11px;font-weight:700;color:#1d1d1f}
.page-thumb-marks{font-size:9px;color:rgba(0,0,0,.4);margin-top:1px}
.page-thumb-btn.active .page-thumb-num{color:#E24B4A}

.right-panel{display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* toolbar */
.toolbar{padding:7px 12px;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;gap:6px;flex-wrap:wrap;flex-shrink:0;background:#fff;position:relative;z-index:100}
.tb-info{font-size:11px;color:rgba(0,0,0,.4);flex:1;min-width:60px}
.tb-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:#fff;color:#1d1d1f;transition:all .14s;white-space:nowrap}
.tb-btn:hover{border-color:#1d1d1f;background:#f5f5f7}
.tb-btn.active-tool{background:#1d1d1f;border-color:#1d1d1f;color:#fff}
.tb-btn.dropper-active{background:#6366f1;border-color:#6366f1;color:#fff}
.tb-btn.danger{color:#E24B4A;border-color:rgba(226,75,74,.3);background:rgba(226,75,74,.04)}
.tb-btn.danger:hover{background:rgba(226,75,74,.1);border-color:#E24B4A}
.tb-btn:disabled{opacity:.3;cursor:not-allowed}
.tb-div{width:1px;height:16px;background:#e0e0e0;flex-shrink:0}

/* swatches */
.swatch{width:18px;height:18px;border-radius:4px;cursor:pointer;border:2px solid transparent;transition:all .12s;flex-shrink:0}
.swatch.active{border-color:#1d1d1f;box-shadow:0 0 0 1px #fff inset}
.swatch:hover{transform:scale(1.15)}

/* active color chip */
.color-chip{display:flex;align-items:center;gap:5px;padding:4px 9px;border-radius:6px;border:1px solid #e0e0e0;background:#fafafa;font-size:10px;font-weight:700;font-family:var(--font-mono,monospace);color:#1d1d1f;cursor:pointer;transition:border-color .12s;white-space:nowrap}
.color-chip:hover{border-color:#bbb}
.color-chip-dot{width:12px;height:12px;border-radius:3px;flex-shrink:0}

/* ── Full Color Picker Popover ── */
.cpicker-popover{
  position:fixed;
  background:#fff;border:1px solid #e0e0e0;border-radius:14px;
  box-shadow:0 8px 40px rgba(0,0,0,.18);padding:16px;width:264px;
  z-index:9999;user-select:none
}

/* SV square */
.cpicker-sv-wrap{position:relative;width:100%;border-radius:8px;overflow:hidden;cursor:crosshair;margin-bottom:10px;height:200px}
.cpicker-sv-canvas{display:block;width:100%;height:100%}
.cpicker-sv-cursor{position:absolute;width:14px;height:14px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35),0 2px 6px rgba(0,0,0,.3);transform:translate(-50%,-50%);pointer-events:none}

/* hue bar */
.cpicker-hue-wrap{position:relative;height:14px;border-radius:7px;overflow:visible;cursor:crosshair;margin-bottom:12px;background:linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%));border-radius:7px}
.cpicker-hue-cursor{position:absolute;top:50%;width:16px;height:16px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.3),0 2px 6px rgba(0,0,0,.25);transform:translate(-50%,-50%);pointer-events:none}

/* inputs */
.cpicker-inputs{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:6px;margin-bottom:12px}
.cpicker-field{display:flex;flex-direction:column;gap:3px}
.cpicker-field label{font-size:9px;font-weight:700;color:rgba(0,0,0,.4);letter-spacing:.08em;text-transform:uppercase;text-align:center}
.cpicker-field input{width:100%;padding:5px 4px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;font-weight:600;text-align:center;color:#1d1d1f;background:#fafafa;outline:none;font-family:var(--font-mono,monospace)}
.cpicker-field input:focus{border-color:#6366f1;background:#fff}

/* quick colors */
.cpicker-quick{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:12px}
.cpicker-ql{font-size:9px;font-weight:700;color:rgba(0,0,0,.35);letter-spacing:.06em;text-transform:uppercase;width:100%;margin-bottom:2px}
.cpicker-qswatch{width:20px;height:20px;border-radius:5px;cursor:pointer;border:2px solid transparent;transition:all .12s;flex-shrink:0}
.cpicker-qswatch:hover{transform:scale(1.15);border-color:rgba(0,0,0,.15)}

/* actions */
.cpicker-actions{display:flex;gap:6px}
.cpicker-apply{flex:1;padding:8px;background:#1d1d1f;border:none;border-radius:8px;font-size:12px;font-weight:700;color:#fff;cursor:pointer;transition:background .15s}
.cpicker-apply:hover{background:#E24B4A}
.cpicker-cancel{padding:8px 12px;background:#fff;border:1px solid #e0e0e0;border-radius:8px;font-size:12px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s}
.cpicker-cancel:hover{border-color:#1d1d1f}

/* canvas area */
.canvas-area{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;background:#e8e8ea;min-height:0;position:relative}
.canvas-wrap{position:relative;display:inline-block;box-shadow:0 4px 28px rgba(0,0,0,.18);border-radius:2px;line-height:0;flex-shrink:0}
.canvas-wrap.mode-draw{cursor:crosshair}
.canvas-wrap.mode-dropper{cursor:none}
.canvas-wrap canvas{display:block;border-radius:2px;max-width:100%}

.redact-box{position:absolute;border:2px solid transparent;cursor:default;transition:border-color .12s}
.redact-box:hover{border-color:rgba(226,75,74,.8)}
.redact-box-del{position:absolute;top:-9px;right:-9px;width:18px;height:18px;border-radius:50%;background:#E24B4A;border:none;color:#fff;font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .12s;line-height:1}
.redact-box:hover .redact-box-del{opacity:1}

.draw-svg{position:absolute;inset:0;pointer-events:none;width:100%;height:100%}
.drawing-rect{fill:rgba(29,29,31,.65);stroke:rgba(255,255,255,.5);stroke-width:1.5}

/* dropper magnifier */
.magnifier{position:fixed;pointer-events:none;z-index:999;transform:translate(18px,-18px)}
.magnifier-ring{width:64px;height:64px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.35);overflow:hidden;position:relative}
.magnifier-canvas{display:block;width:100%;height:100%;image-rendering:pixelated}
.magnifier-cross{position:absolute;inset:0;pointer-events:none}
.magnifier-cross::before,.magnifier-cross::after{content:'';position:absolute;background:rgba(255,255,255,.8)}
.magnifier-cross::before{left:50%;top:0;width:1px;height:100%;transform:translateX(-50%)}
.magnifier-cross::after{top:50%;left:0;height:1px;width:100%;transform:translateY(-50%)}
.magnifier-hex{position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);background:#1d1d1f;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;white-space:nowrap;letter-spacing:.04em;font-family:var(--font-mono,monospace)}

.apply-bar{padding:10px 14px;border-top:1px solid #e8e8e8;display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#fff;flex-shrink:0}
.apply-btn{flex:1;min-width:160px;padding:11px 16px;background:#1d1d1f;border:none;border-radius:9px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:7px}
.apply-btn:hover:not(:disabled){background:#E24B4A}
.apply-btn:disabled{opacity:.4;cursor:not-allowed}
.new-file-btn{padding:11px 16px;background:#fff;border:1.5px solid #e0e0e0;border-radius:9px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;white-space:nowrap}
.new-file-btn:hover{border-color:#1d1d1f}

.prog-wrap{padding:0 14px 10px;background:#fff;flex-shrink:0}
.prog-bar{height:3px;background:#e8e8e8;border-radius:99px;overflow:hidden}
.prog-fill{height:100%;background:#1d1d1f;border-radius:99px;transition:width .25s ease}
.prog-label{font-size:9px;color:rgba(0,0,0,.4);margin-top:4px;text-align:center;letter-spacing:.06em;text-transform:uppercase}

.error-box{padding:10px 13px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:8px;font-size:12px;color:#E24B4A}
.hint-strip{padding:7px 14px;background:#f5f5f7;border-top:1px solid #e8e8e8;font-size:11px;color:rgba(0,0,0,.45);flex-shrink:0;line-height:1.5}
.loading-overlay{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:rgba(0,0,0,.4);font-size:14px;background:#f5f5f7}
`

// ─── Color math utilities ─────────────────────────────────────────────────────
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s /= 100; v /= 100
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c
  let r = 0, g = 0, b = 0
  if      (h < 60)  { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else              { r = c; b = x }
  return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)]
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min
  let h = 0
  if (d) {
    if      (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else                h = (r - g) / d + 4
    h *= 60
  }
  return [Math.round(h), Math.round((max ? d/max : 0)*100), Math.round(max*100)]
}

function hexToRgbArr(hex: string): [number, number, number] {
  const h = hex.replace('#','')
  const n = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16)
  return [(n>>16)&255, (n>>8)&255, n&255]
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(v => Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('')
}

function hsvToHex(h: number, s: number, v: number) {
  return rgbToHex(...hsvToRgb(h, s, v))
}

function hexToHsv(hex: string): [number, number, number] {
  return rgbToHsv(...hexToRgbArr(hex))
}

// ─── Canvas eyedropper helpers ────────────────────────────────────────────────
function sampleCanvas(canvas: HTMLCanvasElement, dispX: number, dispY: number): string {
  const ratio = canvas.width / canvas.offsetWidth
  const d = canvas.getContext('2d')!.getImageData(
    Math.round(dispX * ratio), Math.round(dispY * ratio), 1, 1
  ).data
  return rgbToHex(d[0], d[1], d[2])
}

function drawMagnifier(src: HTMLCanvasElement, dst: HTMLCanvasElement, dispX: number, dispY: number) {
  const ratio = src.width / src.offsetWidth
  const px = dispX * ratio, py = dispY * ratio, R = 12
  const ctx = dst.getContext('2d')!
  ctx.clearRect(0, 0, dst.width, dst.height)
  ctx.drawImage(src, px - R, py - R, R * 2, R * 2, 0, 0, dst.width, dst.height)
}

// ─── Quick color palette for the picker ──────────────────────────────────────
const QUICK_COLORS = [
  '#1d1d1f','#ffffff','#E24B4A','#FF6B35','#F7931E','#FBBF24',
  '#22C55E','#06B6D4','#3B82F6','#8B5CF6','#EC4899','#9CA3AF',
]

// ─── Color Picker Popover ─────────────────────────────────────────────────────
interface CPProps { initialColor: string; pickerPos: {top:number;left:number}; onApply:(hex:string)=>void; onClose:()=>void }

function ColorPickerPopover({ initialColor, pickerPos, onApply, onClose }: CPProps) {
  const init = hexToHsv(initialColor)
  const [hue, setHue] = useState(init[0])
  const [sat, setSat] = useState(init[1])
  const [val, setVal] = useState(init[2])
  const [hexIn, setHexIn] = useState(initialColor.replace('#','').toUpperCase())

  const svRef   = useRef<HTMLCanvasElement>(null)
  const svWrap  = useRef<HTMLDivElement>(null)
  const hueWrap = useRef<HTMLDivElement>(null)
  const dragSV  = useRef(false)
  const dragHue = useRef(false)

  const currentHex        = hsvToHex(hue, sat, val)
  const [rr, gg, bb]      = hsvToRgb(hue, sat, val)

  // Redraw SV gradient when hue changes
  useEffect(() => {
    const cv = svRef.current; if (!cv) return
    const W = cv.width, H = cv.height
    const ctx = cv.getContext('2d')!
    ctx.fillStyle = `hsl(${hue},100%,50%)`
    ctx.fillRect(0, 0, W, H)
    const wg = ctx.createLinearGradient(0,0,W,0)
    wg.addColorStop(0,'rgba(255,255,255,1)')
    wg.addColorStop(1,'rgba(255,255,255,0)')
    ctx.fillStyle = wg; ctx.fillRect(0,0,W,H)
    const bg = ctx.createLinearGradient(0,0,0,H)
    bg.addColorStop(0,'rgba(0,0,0,0)')
    bg.addColorStop(1,'rgba(0,0,0,1)')
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H)
  }, [hue])

  // Sync hex input when sliders move + apply color live
  useEffect(() => {
    const hex = hsvToHex(hue, sat, val)
    setHexIn(hex.replace('#','').toUpperCase())
    onApply(hex)
  }, [hue, sat, val])

  const pickSV = (e: React.MouseEvent | MouseEvent) => {
    const r = svWrap.current!.getBoundingClientRect()
    setSat(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100))
    setVal(Math.round((1-Math.max(0,Math.min(1,(e.clientY-r.top)/r.height)))*100))
  }
  const pickHue = (e: React.MouseEvent | MouseEvent) => {
    const r = hueWrap.current!.getBoundingClientRect()
    setHue(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*360))
  }

  // Global drag listeners
  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (dragSV.current)  pickSV(e)
      if (dragHue.current) pickHue(e)
    }
    const mu = () => { dragSV.current = false; dragHue.current = false }
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup',   mu)
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu) }
  })

  const onHexChange = (raw: string) => {
    setHexIn(raw.toUpperCase())
    const clean = raw.replace(/[^0-9a-fA-F]/g,'')
    if (clean.length === 6) {
      const [nh,ns,nv] = hexToHsv('#'+clean)
      setHue(nh); setSat(ns); setVal(nv)
    }
  }

  const onRgbChange = (ch: 'r'|'g'|'b', raw: string) => {
    const n = Math.max(0,Math.min(255,parseInt(raw)||0))
    const nr = ch==='r'?n:rr, ng = ch==='g'?n:gg, nb = ch==='b'?n:bb
    const [nh,ns,nv] = rgbToHsv(nr,ng,nb)
    setHue(nh); setSat(ns); setVal(nv)
  }

  return (
    <div className="cpicker-popover" style={{ top: pickerPos.top, left: pickerPos.left }} onMouseDown={e => e.stopPropagation()}>
      {/* Saturation / Value square */}
      <div ref={svWrap} className="cpicker-sv-wrap"
        onMouseDown={e => { dragSV.current = true; pickSV(e) }}>
        <canvas ref={svRef} className="cpicker-sv-canvas" width={224} height={200} />
        <div className="cpicker-sv-cursor" style={{
          left:`${sat}%`, top:`${100-val}%`,
          background: currentHex,
          boxShadow:`0 0 0 2.5px #fff, 0 0 0 4px rgba(0,0,0,.25), 0 2px 8px rgba(0,0,0,.3)`,
        }} />
      </div>

      {/* Hue slider */}
      <div ref={hueWrap} className="cpicker-hue-wrap"
        onMouseDown={e => { dragHue.current = true; pickHue(e) }}>
        <div className="cpicker-hue-cursor" style={{
          left:`${(hue/360)*100}%`,
          background:`hsl(${hue},100%,50%)`,
        }} />
      </div>

      {/* Quick colors */}
      <div className="cpicker-quick">
        <div className="cpicker-ql">Quick colors</div>
        {QUICK_COLORS.map(c => (
          <div key={c} className="cpicker-qswatch"
            style={{ background:c, border:`2px solid ${currentHex===c?'#6366f1':'transparent'}` }}
            onClick={() => { const [nh,ns,nv]=hexToHsv(c); setHue(nh); setSat(ns); setVal(nv) }}
          />
        ))}
      </div>

      {/* Hex + RGB inputs */}
      <div className="cpicker-inputs">
        <div className="cpicker-field">
          <label>Hex</label>
          <input value={hexIn} onChange={e=>onHexChange(e.target.value)} maxLength={7} placeholder="1d1d1f" />
        </div>
        <div className="cpicker-field">
          <label>R</label>
          <input type="number" min={0} max={255} value={rr} onChange={e=>onRgbChange('r',e.target.value)} />
        </div>
        <div className="cpicker-field">
          <label>G</label>
          <input type="number" min={0} max={255} value={gg} onChange={e=>onRgbChange('g',e.target.value)} />
        </div>
        <div className="cpicker-field">
          <label>B</label>
          <input type="number" min={0} max={255} value={bb} onChange={e=>onRgbChange('b',e.target.value)} />
        </div>
      </div>

      {/* Preview strip + close */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
        <div style={{ flex:1, height:22, borderRadius:7, background:currentHex, border:'1px solid rgba(0,0,0,.08)' }} />
        <button className="cpicker-cancel" onClick={onClose} style={{ flexShrink:0 }}>Close</button>
      </div>
    </div>
  )
}

// ─── Types & constants ────────────────────────────────────────────────────────
type Tool     = 'draw' | 'dropper'
type Rect     = { id: string; x: number; y: number; w: number; h: number; color: string }
type PageData = { thumbUrl: string; rects: Rect[] }
type MagState = { screenX: number; screenY: number; hex: string } | null

const PRESET_COLORS = ['#1d1d1f','#E24B4A','#1e40af','#15803d','#7c3aed','#b45309']

let _id = 0
const uid = () => `r-${++_id}`

function fmt(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`
  return `${(b/1048576).toFixed(2)} MB`
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PDFRedactorPage() {
  const [file, setFile]               = useState<File | null>(null)
  const [isDrop, setIsDrop]           = useState(false)
  const [pages, setPages]             = useState<PageData[]>([])
  const [curPage, setCurPage]         = useState(0)
  const [loading, setLoading]         = useState(false)
  const [applying, setApplying]       = useState(false)
  const [progress, setProgress]       = useState(0)
  const [error, setError]             = useState('')
  const [tool, setTool]               = useState<Tool>('draw')
  const [redactColor, setRedactColor] = useState('#1d1d1f')
  const [showPicker, setShowPicker]   = useState(false)
  const [pickerPos, setPickerPos]     = useState({ top: 0, left: 0 })
  const [magnifier, setMagnifier]     = useState<MagState>(null)
  const [drawing, setDrawing]         = useState(false)
  const [drawStart, setDrawStart]     = useState<{x:number;y:number}|null>(null)
  const [drawCur,   setDrawCur]       = useState<{x:number;y:number}|null>(null)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const magCanvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef      = useRef<HTMLDivElement>(null)
  const fileRef      = useRef<HTMLInputElement>(null)
  const pickerBtnRef = useRef<HTMLButtonElement>(null)
  const pdfDocRef    = useRef<any>(null)
  const SCALE        = 1.8

  // Open picker anchored below the button using fixed positioning
  const openPicker = () => {
    if (pickerBtnRef.current) {
      const r = pickerBtnRef.current.getBoundingClientRect()
      // keep within viewport horizontally
      const left = Math.min(r.left, window.innerWidth - 272)
      setPickerPos({ top: r.bottom + 6, left: Math.max(0, left) })
    }
    setShowPicker(p => !p)
    setTool('draw')
  }

  // Close picker when clicking outside
  useEffect(() => {
    if (!showPicker) return
    const handler = (e: MouseEvent) => {
      // ignore clicks on the picker button itself (openPicker handles toggle)
      if (pickerBtnRef.current?.contains(e.target as Node)) return
      setShowPicker(false)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [showPicker])

  // ── Load PDF ────────────────────────────────────────────────────────────────
  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setFile(f); setPages([]); setCurPage(0); setLoading(true)
    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await pdfjs.getDocument({ data: buf }).promise
      pdfDocRef.current = doc
      const list: PageData[] = []
      for (let i = 1; i <= doc.numPages; i++) {
        const pg = await doc.getPage(i)
        const vp = pg.getViewport({ scale: 0.28 })
        const c  = document.createElement('canvas')
        c.width = vp.width; c.height = vp.height
        await pg.render({ canvasContext: c.getContext('2d')!, viewport: vp }).promise
        list.push({ thumbUrl: c.toDataURL('image/jpeg', 0.7), rects: [] })
      }
      setPages(list)
    } catch (e: any) {
      setError('Failed to load PDF: ' + (e?.message ?? 'unknown'))
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Re-render page on canvas ────────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDocRef.current || pages.length === 0 || !canvasRef.current) return
    let cancelled = false
    ;(async () => {
      const pg = await pdfDocRef.current.getPage(curPage + 1)
      const vp = pg.getViewport({ scale: SCALE })
      const cv = canvasRef.current!
      cv.width = vp.width; cv.height = vp.height
      const ctx = cv.getContext('2d')!
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height)
      if (!cancelled) await pg.render({ canvasContext: ctx, viewport: vp }).promise
    })()
    return () => { cancelled = true }
  }, [curPage, pages.length])

  // ── Mouse position helper ───────────────────────────────────────────────────
  const relPos = (e: React.MouseEvent) => {
    const r = wrapRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  // ── Mouse events ────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    if (tool === 'dropper') {
      if (!canvasRef.current) return
      const pos = relPos(e)
      setRedactColor(sampleCanvas(canvasRef.current, pos.x, pos.y))
      setTool('draw')
      setMagnifier(null)
      return
    }
    const p = relPos(e); setDrawing(true); setDrawStart(p); setDrawCur(p)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (tool === 'dropper') {
      if (!canvasRef.current || !magCanvasRef.current) return
      const pos = relPos(e)
      drawMagnifier(canvasRef.current, magCanvasRef.current, pos.x, pos.y)
      setMagnifier({ screenX: e.clientX, screenY: e.clientY, hex: sampleCanvas(canvasRef.current, pos.x, pos.y) })
      return
    }
    if (drawing) setDrawCur(relPos(e))
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (tool === 'dropper') return
    if (!drawing || !drawStart) return
    setDrawing(false)
    const end = relPos(e)
    const x = Math.min(drawStart.x, end.x), y = Math.min(drawStart.y, end.y)
    const w = Math.abs(end.x - drawStart.x), h = Math.abs(end.y - drawStart.y)
    if (w < 4 || h < 4) { setDrawStart(null); setDrawCur(null); return }
    const cw = canvasRef.current!.offsetWidth, ch = canvasRef.current!.offsetHeight
    setPages(prev => prev.map((p, i) => i !== curPage ? p : {
      ...p, rects: [...p.rects, { id: uid(), x: x/cw, y: y/ch, w: w/cw, h: h/ch, color: redactColor }]
    }))
    setDrawStart(null); setDrawCur(null)
  }

  const onMouseLeave = () => {
    setMagnifier(null)
    if (drawing) { setDrawing(false); setDrawStart(null); setDrawCur(null) }
  }

  // ── Actions ─────────────────────────────────────────────────────────────────
  const deleteRect = (id: string) => setPages(prev => prev.map((p, i) =>
    i !== curPage ? p : { ...p, rects: p.rects.filter(r => r.id !== id) }))
  const clearPage = () => setPages(prev => prev.map((p, i) => i !== curPage ? p : { ...p, rects: [] }))
  const clearAll  = () => setPages(prev => prev.map(p => ({ ...p, rects: [] })))

  const totalRects = pages.reduce((s, p) => s + p.rects.length, 0)
  const curRects   = pages[curPage]?.rects ?? []

  const onApply = async () => {
    if (!file || totalRects === 0) return
    setApplying(true); setProgress(5); setError('')
    try {
      const bytes  = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(bytes)
      const pdfPgs = pdfDoc.getPages()
      for (let i = 0; i < pages.length; i++) {
        if (!pages[i].rects.length) continue
        const pg = pdfPgs[i]
        const { width, height } = pg.getSize()
        for (const r of pages[i].rects) {
          const [rc,gc,bc] = hexToRgbArr(r.color)
          pg.drawRectangle({
            x: r.x * width, y: height - (r.y + r.h) * height,
            width: r.w * width, height: r.h * height,
            color: rgb(rc/255, gc/255, bc/255),
            opacity: 1, blendMode: BlendMode.Normal,
          })
        }
        setProgress(5 + Math.round(((i+1)/pages.length)*88))
      }
      setProgress(97)
      const out  = await pdfDoc.save()
      const url  = URL.createObjectURL(new Blob([out as Uint8Array<ArrayBuffer>], { type:'application/pdf' }))
      const a    = document.createElement('a')
      a.href = url; a.download = file.name.replace(/\.pdf$/i,'') + '_redacted.pdf'; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      setProgress(100)
    } catch (e: any) {
      setError('Failed: ' + (e?.message ?? 'unknown'))
    } finally {
      setApplying(false)
    }
  }

  const reset = () => {
    setFile(null); setPages([]); setCurPage(0); setError('')
    setProgress(0); setTool('draw'); setMagnifier(null); setShowPicker(false)
    pdfDocRef.current = null
  }

  const drawRect = drawStart && drawCur ? {
    x: Math.min(drawStart.x, drawCur.x), y: Math.min(drawStart.y, drawCur.y),
    w: Math.abs(drawCur.x - drawStart.x), h: Math.abs(drawCur.y - drawStart.y),
  } : null

  // ── Shared nav ──────────────────────────────────────────────────────────────
  const Nav = (
    <SiteNav />
  )

  // ── Upload page ──────────────────────────────────────────────────────────────
  if (!file) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="upload-pg">
        {Nav}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>Privacy · Security · Permanent Redaction</div>
            <h1>PDF<br/><em>Redactor</em></h1>
            <p>Draw boxes over sensitive content — redactions are burned permanently into the PDF.</p>
          </div>
        </div>
        <div className="wrap" style={{ flex:1 }}>
          <div className="card">
            <div
              className={`drop${isDrop?' over':''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
              onDragLeave={() => setIsDrop(false)}
              onDrop={e => { e.preventDefault(); setIsDrop(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f) }}
            >
              <span className="drop-icon">🔒</span>
              <h2>Drop your PDF here</h2>
              <p>Draw redaction boxes over sensitive content, then download the secured PDF</p>
              <button className="drop-btn">Choose PDF</button>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display:'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
            </div>
            {error && <div className="error-box" style={{ marginTop:14 }}>{error}</div>}
          </div>
          <div className="info-grid">
            <div className="info-card"><h3>✏️ Draw to Redact</h3><p>Click and drag on any page to draw a redaction box. Remove it before applying if needed.</p></div>
            <div className="info-card"><h3>🔒 Permanent</h3><p>Redactions are painted directly onto PDF pages — content underneath cannot be recovered.</p></div>
            <div className="info-card"><h3>🛡️ 100% Private</h3><p>Everything runs in your browser with pdf-lib. Your document never leaves your device.</p></div>
          </div>
        </div>
      </div>
    </>
  )

  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="editor-pg">{Nav}<div className="loading-overlay"><span style={{ fontSize:36 }}>⏳</span><span>Rendering pages…</span></div></div>
    </>
  )

  // ── Full-page editor ─────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="editor-pg">
        {Nav}

        {/* Color picker — fixed, anchored below the button */}
        {showPicker && (
          <ColorPickerPopover
            initialColor={redactColor}
            pickerPos={pickerPos}
            onApply={hex => setRedactColor(hex)}
            onClose={() => setShowPicker(false)}
          />
        )}

        {/* Dropper magnifier — fixed, follows cursor */}
        {magnifier && (
          <div className="magnifier" style={{ left: magnifier.screenX, top: magnifier.screenY }}>
            <div className="magnifier-ring">
              <canvas ref={magCanvasRef} width={64} height={64} className="magnifier-canvas" />
              <div className="magnifier-cross" />
            </div>
            <div className="magnifier-hex" style={{ background: magnifier.hex }}>{magnifier.hex.toUpperCase()}</div>
          </div>
        )}
        {!magnifier && <canvas ref={magCanvasRef} width={64} height={64} style={{ display:'none' }} />}

        <div className="editor-body">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-head">
              <div className="sidebar-title" title={file.name}>{file.name}</div>
              <div className="sidebar-sub">{fmt(file.size)} · {pages.length} page{pages.length!==1?'s':''} · {totalRects} redaction{totalRects!==1?'s':''}</div>
            </div>
            <div className="page-list">
              {pages.map((p, i) => (
                <button key={i} className={`page-thumb-btn${curPage===i?' active':''}`} onClick={() => setCurPage(i)}>
                  <div className="page-thumb-img"><img src={p.thumbUrl} alt={`Page ${i+1}`} /></div>
                  <div className="page-thumb-info">
                    <div className="page-thumb-num">Page {i+1}</div>
                    <div className="page-thumb-marks">{p.rects.length > 0 ? `${p.rects.length} redaction${p.rects.length!==1?'s':''}` : 'No redactions'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="right-panel">

            {/* Toolbar */}
            <div className="toolbar">
              <span className="tb-info">Page {curPage+1} / {pages.length}</span>

              {/* Tool buttons */}
              <button className={`tb-btn${tool==='draw'?' active-tool':''}`} onClick={() => setTool('draw')}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                Draw
              </button>

              <button className={`tb-btn${tool==='dropper'?' dropper-active':''}`}
                onClick={() => { setTool(t => t==='dropper'?'draw':'dropper'); setShowPicker(false) }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 4a2.83 2.83 0 0 0-4 0l-9 9-2 5 5-2 9-9a2.83 2.83 0 0 0 0-4z"/>
                  <line x1="15" y1="5" x2="19" y2="9"/>
                </svg>
                Dropper
              </button>

              <div className="tb-div" />

              {/* Preset swatches */}
              {PRESET_COLORS.map(c => (
                <div key={c} className={`swatch${redactColor===c?' active':''}`}
                  style={{ background:c }}
                  onClick={() => { setRedactColor(c); setTool('draw'); setShowPicker(false) }}
                  title={c}
                />
              ))}

              {/* Full spectrum color picker */}
              <button
                ref={pickerBtnRef}
                className={`tb-btn${showPicker?' active-tool':''}`}
                onClick={openPicker}
                title="Full color picker"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
                Color Picker
              </button>

              {/* Active color chip — also opens picker */}
              <div className="color-chip"
                onClick={openPicker}
                title="Click to open full color picker"
              >
                <div className="color-chip-dot" style={{ background: redactColor }} />
                {redactColor.toUpperCase()}
              </div>

              <div className="tb-div" />
              <button className="tb-btn" onClick={() => setCurPage(p=>Math.max(0,p-1))} disabled={curPage===0}>← Prev</button>
              <button className="tb-btn" onClick={() => setCurPage(p=>Math.min(pages.length-1,p+1))} disabled={curPage===pages.length-1}>Next →</button>
              <div className="tb-div" />
              <button className="tb-btn danger" onClick={clearPage} disabled={curRects.length===0}>✕ Page</button>
              <button className="tb-btn danger" onClick={clearAll}  disabled={totalRects===0}>✕ All</button>
            </div>

            {/* Canvas area */}
            <div className="canvas-area">
              <div
                ref={wrapRef}
                className={`canvas-wrap mode-${tool}`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
              >
                <canvas ref={canvasRef} />

                {/* Redaction boxes */}
                {canvasRef.current && curRects.map(r => {
                  const cw = canvasRef.current!.offsetWidth
                  const ch = canvasRef.current!.offsetHeight
                  return (
                    <div key={r.id} className="redact-box"
                      style={{ position:'absolute', left:r.x*cw, top:r.y*ch, width:r.w*cw, height:r.h*ch, background:r.color }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button className="redact-box-del"
                        onClick={e => { e.stopPropagation(); deleteRect(r.id) }}>✕</button>
                    </div>
                  )
                })}

                {/* Live draw preview */}
                {drawRect && tool==='draw' && (
                  <svg className="draw-svg">
                    <rect className="drawing-rect" x={drawRect.x} y={drawRect.y} width={drawRect.w} height={drawRect.h} />
                  </svg>
                )}
              </div>
            </div>

            {/* Hint */}
            <div className="hint-strip">
              {tool==='dropper'
                ? '🔵 Dropper active — move over the page and click to sample any colour from it'
                : '✏️ Click & drag to draw · Hover a box → ✕ to remove · "Color Picker" for full spectrum · Dropper to sample from page'}
            </div>

            {/* Apply bar */}
            <div className="apply-bar">
              {error && <div className="error-box" style={{ width:'100%' }}>{error}</div>}
              <button className="apply-btn" onClick={onApply} disabled={applying || totalRects===0}>
                {applying ? '⏳ Applying…' : `🔒 Apply ${totalRects} redaction${totalRects!==1?'s':''} & Download`}
              </button>
              <button className="new-file-btn" onClick={reset}>New file</button>
            </div>

            {applying && (
              <div className="prog-wrap">
                <div className="prog-bar"><div className="prog-fill" style={{ width:`${progress}%` }} /></div>
                <div className="prog-label">Burning redactions into PDF…</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
