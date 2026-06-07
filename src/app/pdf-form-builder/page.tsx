'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from 'pdf-lib'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.upload-pg{min-height:100vh;display:flex;flex-direction:column;background:#fff}
.wrap{max-width:820px;margin:0 auto;padding:0 28px;width:100%}
.editor-pg{height:100vh;overflow:hidden;display:flex;flex-direction:column;background:#fff}

/* Nav */
.nav{height:54px;background:rgba(255,255,255,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;flex-shrink:0;z-index:200}
.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 20px}
.logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#6366f1}
.back{font-size:13px;font-weight:500;color:rgba(0,0,0,.5);text-decoration:none;padding:5px 14px;border-radius:99px;transition:color .15s}
.back:hover{color:#1d1d1f}

/* Hero */
.hero{padding:56px 0 32px;text-align:center;border-bottom:1px solid #f0f0f0}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#f0f0ff;border:1px solid rgba(99,102,241,.25);border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.08em;color:#6366f1;margin-bottom:16px;text-transform:uppercase}
.bdot{width:5px;height:5px;border-radius:50%;background:#6366f1}
.hero h1{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:clamp(28px,5vw,50px);font-weight:800;letter-spacing:-.05em;line-height:.97;color:#1d1d1f;margin-bottom:12px}
.hero h1 em{font-style:normal;color:#6366f1}
.hero p{font-size:15px;color:rgba(0,0,0,.5);line-height:1.7;max-width:460px;margin:0 auto}

/* ── Choice grid ── */
.choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:32px 0 48px}
@media(max-width:620px){.choice-grid{grid-template-columns:1fr}}
.choice-card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:26px;box-shadow:0 2px 18px rgba(0,0,0,.05);display:flex;flex-direction:column}
.choice-card-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.choice-card-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.choice-card-icon.blue{background:#f0f0ff}
.choice-card-icon.indigo{background:#f0f0ff}
.choice-card h3{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:15px;font-weight:700;color:#1d1d1f}
.choice-card > p{font-size:12px;color:rgba(0,0,0,.42);margin-bottom:18px;line-height:1.6}
.choice-card-body{flex:1;display:flex;flex-direction:column;gap:12px}

/* Drop zone (compact) */
.drop-sm{border:2px dashed #d0d0d0;border-radius:10px;padding:28px 16px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;flex:1}
.drop-sm:hover,.drop-sm.over{border-color:#6366f1;background:#f0f0ff}
.drop-sm p{font-size:12px;color:rgba(0,0,0,.4);margin-bottom:12px;line-height:1.5}
.drop-btn-sm{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;background:#1d1d1f;border-radius:7px;font-size:12px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn-sm:hover{background:#6366f1}

/* Page size selector */
.size-label{font-size:10px;font-weight:700;color:rgba(0,0,0,.45);letter-spacing:.07em;text-transform:uppercase;margin-bottom:6px}
.size-btn-group{display:flex;gap:6px}
.size-btn{flex:1;padding:8px 4px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:11px;font-weight:700;color:#1d1d1f;background:#fff;cursor:pointer;transition:all .13s;text-align:center;line-height:1.3}
.size-btn sub{display:block;font-size:9px;font-weight:500;color:rgba(0,0,0,.35);margin-top:1px}
.size-btn.sel{border-color:#6366f1;background:#f0f0ff;color:#6366f1}
.size-btn:hover:not(.sel){border-color:#bbb}

.create-btn{width:100%;padding:11px;background:#6366f1;border:none;border-radius:9px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:6px}
.create-btn:hover{background:#4f46e5}

.or-divider{display:flex;align-items:center;gap:10px;color:rgba(0,0,0,.25);font-size:11px;font-weight:600}
.or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:#eee}

/* Editor layout */
.editor-body{flex:1;display:grid;grid-template-columns:200px 1fr 250px;overflow:hidden}
@media(max-width:900px){.editor-body{grid-template-columns:160px 1fr}}

/* Page sidebar */
.sidebar{background:#fafafa;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden}
.sidebar-head{padding:11px 13px;border-bottom:1px solid #e8e8e8;flex-shrink:0}
.sidebar-title{font-size:11px;font-weight:700;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:1px}
.sidebar-sub{font-size:10px;color:rgba(0,0,0,.4)}
.page-list{overflow-y:auto;flex:1;padding:7px 6px}
.page-thumb-btn{width:100%;border:none;background:transparent;cursor:pointer;padding:5px 6px;border-radius:8px;transition:background .12s;text-align:left;display:flex;align-items:center;gap:8px}
.page-thumb-btn:hover{background:rgba(0,0,0,.04)}
.page-thumb-btn.active{background:rgba(99,102,241,.09)}
.page-thumb-img{width:42px;flex-shrink:0;border-radius:4px;border:1.5px solid #e0e0e0;overflow:hidden;aspect-ratio:.707;background:#fff;display:flex;align-items:center;justify-content:center}
.page-thumb-img img{width:100%;height:100%;object-fit:cover;display:block}
.page-thumb-info{min-width:0}
.page-thumb-num{font-size:11px;font-weight:700;color:#1d1d1f}
.page-thumb-marks{font-size:9px;color:rgba(0,0,0,.4);margin-top:1px}
.page-thumb-btn.active .page-thumb-num{color:#6366f1}
.add-page-btn{display:flex;align-items:center;justify-content:center;gap:5px;margin:6px 8px;padding:8px;border:1.5px dashed #d0d0d0;border-radius:8px;background:transparent;color:rgba(0,0,0,.4);font-size:11px;font-weight:600;cursor:pointer;transition:all .13s}
.add-page-btn:hover{border-color:#6366f1;color:#6366f1;background:#f0f0ff}
.rm-page-btn{display:flex;align-items:center;justify-content:center;gap:5px;margin:0 8px 6px;padding:6px;border:none;border-radius:7px;background:rgba(226,75,74,.05);color:#E24B4A;font-size:10px;font-weight:600;cursor:pointer;transition:all .13s}
.rm-page-btn:hover{background:rgba(226,75,74,.12)}
.rm-page-btn:disabled{opacity:.3;cursor:not-allowed}

/* Center panel */
.center-panel{display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* Toolbar */
.toolbar{padding:6px 10px;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;gap:4px;flex-wrap:wrap;flex-shrink:0;background:#fff}
.tb-label{font-size:9px;font-weight:700;color:rgba(0,0,0,.3);letter-spacing:.07em;text-transform:uppercase;padding:0 2px;white-space:nowrap}
.tb-div{width:1px;height:18px;background:#e0e0e0;flex-shrink:0;margin:0 2px}
.tb-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:#fff;color:#1d1d1f;transition:all .12s;white-space:nowrap;line-height:1}
.tb-btn:hover{border-color:#6366f1;color:#6366f1;background:#f0f0ff}
.tb-btn.active-tool{background:#6366f1;border-color:#6366f1;color:#fff}
.tb-btn.danger{color:#E24B4A;border-color:rgba(226,75,74,.3)}
.tb-btn.danger:hover{background:rgba(226,75,74,.08);border-color:#E24B4A}
.tb-btn:disabled{opacity:.3;cursor:not-allowed}

/* Canvas */
.canvas-area{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:24px;background:#e8e8ea;min-height:0}
.canvas-wrap{position:relative;display:inline-block;box-shadow:0 4px 32px rgba(0,0,0,.16);border-radius:2px;line-height:0;flex-shrink:0}
.canvas-wrap.mode-select{cursor:default}
.canvas-wrap canvas{display:block;max-width:100%}

/* Field overlays */
.field-overlay{position:absolute;border-radius:3px;cursor:move;overflow:visible;transition:box-shadow .1s}
.field-overlay.sel{box-shadow:0 0 0 2px #6366f1,0 2px 12px rgba(99,102,241,.2)}
.field-overlay:not(.sel):hover{box-shadow:0 0 0 1.5px #6366f1}
.field-inner{width:100%;height:100%;display:flex;align-items:center;gap:4px;padding:0 6px;font-size:11px;color:rgba(0,0,0,.35);user-select:none;overflow:hidden;white-space:nowrap;border-radius:3px}
.field-del{position:absolute;top:-8px;right:-8px;width:16px;height:16px;border-radius:50%;background:#E24B4A;border:none;color:#fff;font-size:8px;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:10;line-height:1}
.field-overlay.sel .field-del{display:flex}
.resize-se{position:absolute;bottom:-4px;right:-4px;width:9px;height:9px;background:#6366f1;border:2px solid #fff;border-radius:2px;cursor:se-resize;z-index:5}

/* Properties panel */
.props-panel{border-left:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden;background:#fafafa;min-width:0}
@media(max-width:900px){.props-panel{display:none}}
.props-head{padding:11px 13px;border-bottom:1px solid #e8e8e8;flex-shrink:0}
.props-head-title{font-size:12px;font-weight:700;color:#1d1d1f}
.props-head-sub{font-size:10px;color:rgba(0,0,0,.4);margin-top:1px}
.props-body{overflow-y:auto;flex:1;padding:14px}
.props-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:10px;text-align:center;padding:24px;color:rgba(0,0,0,.3)}
.props-empty-icon{font-size:30px}
.props-empty-text{font-size:12px;line-height:1.6}
.prop-row{margin-bottom:11px}
.prop-label{font-size:10px;font-weight:700;color:rgba(0,0,0,.45);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
.prop-input{width:100%;padding:6px 9px;border:1px solid #e0e0e0;border-radius:7px;font-size:12px;color:#1d1d1f;background:#fff;outline:none;transition:border-color .12s;font-family:inherit}
.prop-input:focus{border-color:#6366f1}
.prop-toggle{display:flex;align-items:center;gap:8px;cursor:pointer}
.prop-toggle input{width:14px;height:14px;cursor:pointer;accent-color:#6366f1}
.prop-toggle span{font-size:12px;font-weight:600;color:#1d1d1f}
.prop-divider{height:1px;background:#e8e8e8;margin:14px 0 10px}
.option-row{display:flex;align-items:center;gap:5px;margin-bottom:5px}
.option-row input{flex:1;padding:5px 7px;border:1px solid #e0e0e0;border-radius:5px;font-size:11px;color:#1d1d1f;background:#fff;outline:none;font-family:inherit}
.option-row input:focus{border-color:#6366f1}
.option-del{width:20px;height:20px;border-radius:4px;border:none;background:#fafafa;color:rgba(0,0,0,.3);cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .12s}
.option-del:hover{background:#ffeaea;color:#E24B4A}
.add-opt-btn{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border:1px dashed #d0d0d0;border-radius:5px;font-size:11px;font-weight:600;color:rgba(0,0,0,.4);cursor:pointer;background:transparent;transition:all .12s}
.add-opt-btn:hover{border-color:#6366f1;color:#6366f1}
.prop-del-btn{width:100%;padding:8px;border:1px solid rgba(226,75,74,.3);border-radius:8px;background:rgba(226,75,74,.04);color:#E24B4A;font-size:12px;font-weight:700;cursor:pointer;transition:all .14s;margin-top:14px}
.prop-del-btn:hover{background:rgba(226,75,74,.1);border-color:#E24B4A}
.prop-type-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:5px;font-size:10px;font-weight:700;background:rgba(99,102,241,.1);color:#6366f1;margin-bottom:12px}

/* Apply bar */
.apply-bar{padding:10px 13px;border-top:1px solid #e8e8e8;display:flex;gap:9px;align-items:center;background:#fff;flex-shrink:0}
.apply-btn{flex:1;padding:10px 14px;background:#1d1d1f;border:none;border-radius:9px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:6px}
.apply-btn:hover:not(:disabled){background:#6366f1}
.apply-btn:disabled{opacity:.4;cursor:not-allowed}
.new-file-btn{padding:9px 13px;background:#fff;border:1.5px solid #e0e0e0;border-radius:9px;font-size:12px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .14s;white-space:nowrap}
.new-file-btn:hover{border-color:#1d1d1f}
.hint-strip{padding:6px 13px;background:#f5f5f7;border-top:1px solid #e8e8e8;font-size:11px;color:rgba(0,0,0,.4);flex-shrink:0;line-height:1.5}
.error-box{padding:9px 12px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:8px;font-size:12px;color:#E24B4A}
.loading-overlay{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:rgba(0,0,0,.4);font-size:14px;background:#f5f5f7}

/* blank canvas guide lines */
.canvas-guide{position:absolute;inset:0;pointer-events:none;border:1px dashed rgba(99,102,241,.12)}
`

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode          = 'idle' | 'pdf' | 'blank'
type PageSizeName  = 'A4' | 'Letter' | 'Legal'
type FieldType     = 'text' | 'multiline' | 'checkbox' | 'dropdown' | 'date' | 'number' | 'signature'

interface FormField {
  id: string; type: FieldType; page: number
  x: number; y: number; w: number; h: number
  label: string; placeholder: string; required: boolean; options: string[]
  labelPosition: 'top' | 'left' | 'below'
  borderStyle: 'box' | 'dash' | 'underline'
  labelColor: string; labelFontSize: number; labelBold: boolean
  fieldTextColor: string
  // signature-specific
  sigLineColor: string; sigLineStyle: 'solid' | 'dash'
  sigShowIcon: boolean; sigPromptText: string
}

type DragState   = { id:string; scx:number; scy:number; ox:number; oy:number } | null
type ResizeState = { id:string; scx:number; scy:number; ow:number; oh:number } | null

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZES: Record<PageSizeName, { w:number; h:number; sub:string }> = {
  'A4':     { w:595.28, h:841.89, sub:'210×297mm' },
  'Letter': { w:612,    h:792,    sub:'8.5×11in'  },
  'Legal':  { w:612,    h:1008,   sub:'8.5×14in'  },
}

const FIELD_DEFS = [
  { type:'text'      as FieldType, icon:'Aa', label:'Text',      defW:.32, defH:.038 },
  { type:'multiline' as FieldType, icon:'¶',  label:'Textarea',  defW:.32, defH:.10  },
  { type:'signature' as FieldType, icon:'✍',  label:'Signature', defW:.40, defH:.055 },
  { type:'checkbox'  as FieldType, icon:'☑',  label:'Checkbox',  defW:.03, defH:.03  },
  { type:'dropdown'  as FieldType, icon:'▼',  label:'Dropdown',  defW:.28, defH:.038 },
  { type:'date'      as FieldType, icon:'📅', label:'Date',       defW:.22, defH:.038 },
  { type:'number'    as FieldType, icon:'#',  label:'Number',    defW:.18, defH:.038 },
]

let _id = 0
const uid = () => `f-${Date.now()}-${++_id}`
const fmt = (b: number) => b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
const hexToRgb = (hex: string) => {
  const h = hex.replace('#','')
  return rgb(parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PDFFormBuilderPage() {
  const [mode,       setMode]       = useState<Mode>('idle')
  const [pageSize,   setPageSize]   = useState<PageSizeName>('A4')
  const [blankPages, setBlankPages] = useState(1)
  const [file,       setFile]       = useState<File | null>(null)
  const [isDrop,     setIsDrop]     = useState(false)
  const [thumbs,     setThumbs]     = useState<string[]>([])
  const [curPage,    setCurPage]    = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [applying,   setApplying]   = useState(false)
  const [error,      setError]      = useState('')
  const [fields,     setFields]     = useState<FormField[]>([])
  const [selectedId, setSelectedId] = useState<string|null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)
  const pdfDocRef = useRef<any>(null)
  const dragRef   = useRef<DragState>(null)
  const resizeRef = useRef<ResizeState>(null)
  const modeRef   = useRef<Mode>('idle')
  const SCALE     = 1.8

  useEffect(() => { modeRef.current = mode }, [mode])

  const selectedField = fields.find(f => f.id === selectedId) ?? null
  const curFields     = fields.filter(f => f.page === curPage)
  const totalPages    = mode === 'blank' ? blankPages : thumbs.length

  // ── Add field at default stacked position ─────────────────────────────────
  const addField = (type: FieldType) => {
    const def = FIELD_DEFS.find(d => d.type === type)!
    const n   = fields.filter(f => f.page === curPage).length
    const x   = Math.max(0.05, (1 - def.defW) / 2)            // centered
    const y   = Math.min(0.85 - def.defH, 0.07 + n * 0.07)   // cascade down
    const nf: FormField = {
      id: uid(), type, page: curPage,
      x, y, w: def.defW, h: def.defH,
      label: '', placeholder: '', required: false,
      options: type === 'dropdown' ? ['Option 1', 'Option 2'] : [],
      labelPosition: type === 'signature' ? 'below' : 'top', borderStyle: type === 'signature' ? 'underline' : 'box',
      labelColor: '#374151', labelFontSize: 9, labelBold: false,
      fieldTextColor: '#111111',
      sigLineColor: '#374151', sigLineStyle: 'solid',
      sigShowIcon: true, sigPromptText: 'Sign here',
    }
    setFields(prev => [...prev, nf])
    setSelectedId(nf.id)
  }

  // ── Load PDF ──────────────────────────────────────────────────────────────
  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setFile(f); setThumbs([]); setCurPage(0); setFields([]); setSelectedId(null); setLoading(true)
    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await pdfjs.getDocument({ data: buf }).promise
      pdfDocRef.current = doc
      const list: string[] = []
      for (let i = 1; i <= doc.numPages; i++) {
        const pg = await doc.getPage(i)
        const vp = pg.getViewport({ scale: 0.28 })
        const c  = document.createElement('canvas')
        c.width = vp.width; c.height = vp.height
        await pg.render({ canvasContext: c.getContext('2d')!, viewport: vp }).promise
        list.push(c.toDataURL('image/jpeg', 0.7))
      }
      setThumbs(list)
      setMode('pdf')
    } catch (e: any) {
      setError('Failed to load PDF: ' + (e?.message ?? 'unknown'))
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Render canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return

    // Blank canvas
    if (modeRef.current === 'blank') {
      const { w, h } = PAGE_SIZES[pageSize]
      const cv = canvasRef.current
      cv.width  = Math.round(w * SCALE)
      cv.height = Math.round(h * SCALE)
      const ctx = cv.getContext('2d')!
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, cv.width, cv.height)
      return
    }

    // PDF canvas
    if (!pdfDocRef.current || thumbs.length === 0) return
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
  }, [curPage, mode, thumbs.length, pageSize, blankPages])

  // ── Canvas mouse down — deselect only ────────────────────────────────────
  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setSelectedId(null)
  }

  // ── Global mouse move / up — drag & resize only ───────────────────────────
  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (dragRef.current) {
        const { id, scx, scy, ox, oy } = dragRef.current
        const cw = wrapRef.current!.offsetWidth, ch = wrapRef.current!.offsetHeight
        const dx = e.clientX - scx, dy = e.clientY - scy
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return
        setFields(prev => prev.map(f => f.id !== id ? f : {
          ...f,
          x: Math.max(0, Math.min(1 - f.w, (ox + dx) / cw)),
          y: Math.max(0, Math.min(1 - f.h, (oy + dy) / ch)),
        }))
      }
      if (resizeRef.current) {
        const { id, scx, scy, ow, oh } = resizeRef.current
        const cw = wrapRef.current!.offsetWidth, ch = wrapRef.current!.offsetHeight
        const dx = e.clientX - scx, dy = e.clientY - scy
        setFields(prev => prev.map(f => f.id !== id ? f : {
          ...f,
          w: Math.max(0.03, Math.min(1 - f.x, (ow * cw + dx) / cw)),
          h: Math.max(0.02, Math.min(1 - f.y, (oh * ch + dy) / ch)),
        }))
      }
    }
    const mu = () => { dragRef.current = null; resizeRef.current = null }

    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup',   mu)
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu) }
  }, [])

  // ── Field interaction ─────────────────────────────────────────────────────
  const onFieldMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedId(id)
    const f  = fields.find(ff => ff.id === id)!
    const cw = wrapRef.current!.offsetWidth, ch = wrapRef.current!.offsetHeight
    dragRef.current = { id, scx: e.clientX, scy: e.clientY, ox: f.x * cw, oy: f.y * ch }
  }

  const onResizeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); e.preventDefault()
    const f = fields.find(ff => ff.id === id)!
    resizeRef.current = { id, scx: e.clientX, scy: e.clientY, ow: f.w, oh: f.h }
  }

  const deleteField    = (id: string) => { setFields(p => p.filter(f => f.id !== id)); if (selectedId === id) setSelectedId(null) }
  const updateField    = (id: string, patch: Partial<FormField>) => setFields(p => p.map(f => f.id === id ? { ...f, ...patch } : f))
  const addBlankPage   = () => setBlankPages(p => p + 1)
  const removeLastPage = () => {
    const last = blankPages - 1
    setBlankPages(p => Math.max(1, p - 1))
    setFields(f => f.filter(ff => ff.page !== last))
    if (curPage >= last) setCurPage(Math.max(0, last - 1))
  }

  // ── Download ──────────────────────────────────────────────────────────────
  const onDownload = async () => {
    setApplying(true); setError('')
    try {
      let pdfDoc: any

      if (mode === 'blank') {
        pdfDoc = await PDFDocument.create()
        const { w, h } = PAGE_SIZES[pageSize]
        for (let i = 0; i < blankPages; i++) pdfDoc.addPage([w, h])
      } else {
        const bytes = await file!.arrayBuffer()
        pdfDoc = await PDFDocument.load(bytes)
      }

      const form     = pdfDoc.getForm()
      const pdfPgs   = pdfDoc.getPages()
      const font     = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      for (const f of fields) {
        if (f.page >= pdfPgs.length) continue
        const pg = pdfPgs[f.page]
        const { width: pw, height: ph } = pg.getSize()
        const x   = f.x * pw
        const fh  = f.h * ph
        const y   = ph - f.y * ph - fh
        const w   = f.w * pw
        const lsz = f.labelFontSize ?? 9
        const lFont = f.labelBold ? fontBold : font
        const LEFT_LABEL_W = f.label ? Math.min(f.label.length * lsz * 0.55 + 6, pw * 0.22) : 0
        const fieldX = f.labelPosition === 'left' && f.label ? x + LEFT_LABEL_W + 4 : x
        const fieldW = f.labelPosition === 'left' && f.label ? Math.max(8, w - LEFT_LABEL_W - 4) : w
        const opts   = { x: fieldX, y, width: fieldW, height: fh }

        if (f.label) {
          const lColor = hexToRgb(f.labelColor ?? '#374151')
          if (f.labelPosition === 'top') {
            pg.drawText(f.label, { x, y: y + fh + 3, size: lsz, font: lFont, color: lColor, maxWidth: w })
          } else if (f.labelPosition === 'below') {
            pg.drawText(f.label, { x, y: y - lsz - 3, size: lsz, font: lFont, color: lColor, maxWidth: w })
          } else {
            // left
            pg.drawText(f.label, { x, y: y + fh / 2 - lsz / 2, size: lsz, font: lFont, color: lColor, maxWidth: LEFT_LABEL_W })
          }
        }

        const FIELD_FONT_SIZE = 10
        // Build the DA string — /Helv is Helvetica standard name; colour in PDF is r g b rg
        const tc   = f.fieldTextColor ?? '#111111'
        const tr   = parseInt(tc.slice(1,3),16)/255
        const tg   = parseInt(tc.slice(3,5),16)/255
        const tb   = parseInt(tc.slice(5,7),16)/255
        const daStr = `/Helv ${FIELD_FONT_SIZE} Tf ${tr.toFixed(3)} ${tg.toFixed(3)} ${tb.toFixed(3)} rg`
        const setAppearance = (tf: any) => {
          tf.acroField.dict.set(PDFName.of('DA'), PDFString.of(daStr))
          tf.setFontSize(FIELD_FONT_SIZE)
        }

        if (f.type === 'text' || f.type === 'number' || f.type === 'date') {
          const tf = form.createTextField(f.id)
          setAppearance(tf)
          if (f.placeholder) tf.setText(f.placeholder)
          if (f.borderStyle === 'underline') {
            tf.addToPage(pg, { ...opts, borderWidth: 0 })
            pg.drawLine({ start:{ x: fieldX, y }, end:{ x: fieldX + fieldW, y }, thickness: 1, color: rgb(0.4,0.4,0.4) })
          } else {
            tf.addToPage(pg, opts)
          }
        } else if (f.type === 'multiline') {
          const tf = form.createTextField(f.id)
          tf.enableMultiline()
          setAppearance(tf)
          if (f.placeholder) tf.setText(f.placeholder)
          if (f.borderStyle === 'underline') {
            tf.addToPage(pg, { ...opts, borderWidth: 0 })
            pg.drawLine({ start:{ x: fieldX, y }, end:{ x: fieldX + fieldW, y }, thickness: 1, color: rgb(0.4,0.4,0.4) })
          } else if (f.borderStyle === 'dash') {
            tf.addToPage(pg, opts)
            const pdfLineSpacing = 14
            const lineTotal = Math.max(0, Math.floor((fh - 4) / pdfLineSpacing))
            for (let li = 1; li <= lineTotal; li++) {
              const lineY = y + li * pdfLineSpacing
              pg.drawLine({ start:{ x: fieldX + 4, y: lineY }, end:{ x: fieldX + fieldW - 4, y: lineY },
                thickness: 0.5, color: rgb(0.7,0.7,0.7), dashArray: [3,3], dashPhase: 0 })
            }
          } else {
            tf.addToPage(pg, opts)
          }
        } else if (f.type === 'signature') {
          const slc = hexToRgb(f.sigLineColor ?? '#374151')
          const sigDash = f.sigLineStyle === 'dash' ? [3, 3] as [number, number] : undefined
          // Thin outer box
          pg.drawRectangle({ x: fieldX, y, width: fieldW, height: fh,
            borderColor: rgb(0.75,0.75,0.75), borderWidth: 0.4, color: rgb(1,1,1) })
          // Signature line at bottom
          pg.drawLine({
            start:{ x: fieldX + 4, y: y + 3 }, end:{ x: fieldX + fieldW - 4, y: y + 3 },
            thickness: 1, color: slc,
            ...(sigDash ? { dashArray: sigDash, dashPhase: 0 } : {}),
          })
          // Prompt text
          if (f.sigShowIcon ?? true) {
            const prompt = (f.sigPromptText || 'Sign here')
            pg.drawText(prompt, { x: fieldX + 6, y: y + fh - 10, size: 7, font, color: rgb(0.6,0.6,0.6) })
          }
          // Invisible text field so the PDF remains interactive
          const tf = form.createTextField(f.id)
          setAppearance(tf)
          tf.addToPage(pg, { ...opts, borderWidth: 0 })
        } else if (f.type === 'checkbox') {
          form.createCheckBox(f.id).addToPage(pg, opts)
        } else if (f.type === 'dropdown') {
          const dd = form.createDropdown(f.id)
          if (f.options.length) { dd.setOptions(f.options); dd.select(f.options[0]) }
          dd.addToPage(pg, opts)
        }
      }

      const out  = await pdfDoc.save()
      const url  = URL.createObjectURL(new Blob([out], { type: 'application/pdf' }))
      const a    = document.createElement('a')
      const name = mode === 'blank' ? 'blank_form' : file!.name.replace(/\.pdf$/i, '')
      a.href = url; a.download = `${name}_form.pdf`; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (e: any) {
      setError('Failed: ' + (e?.message ?? 'unknown'))
    } finally {
      setApplying(false)
    }
  }

  const reset = () => {
    setMode('idle'); setFile(null); setThumbs([]); setCurPage(0)
    setFields([]); setSelectedId(null); setError(''); setBlankPages(1)
    pdfDocRef.current = null
  }

  // ── Nav ───────────────────────────────────────────────────────────────────
  const Nav = (
    <nav className="nav">
      <div className="nav-in">
        <Link href="/" className="logo">
          <div className="logo-mark">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2z"/><path d="M14 2v6h6"/>
            </svg>
          </div>
          <span className="logo-name">Edit<em>PDF</em> AI</span>
        </Link>
        {mode !== 'idle' ? (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:12, color:'rgba(0,0,0,.4)', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {mode === 'blank' ? `Blank Form (${PAGE_SIZES[pageSize].sub})` : file?.name}
            </span>
            <button className="new-file-btn" style={{ padding:'5px 12px', fontSize:12 }} onClick={reset}>✕ Close</button>
          </div>
        ) : (
          <Link href="/" className="back">← All Tools</Link>
        )}
      </div>
    </nav>
  )

  // ── Landing page (choose mode) ────────────────────────────────────────────
  if (mode === 'idle') return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="upload-pg">
        {Nav}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>Forms · Fields · Fillable PDF</div>
            <h1>PDF Form<br/><em>Builder</em></h1>
            <p>Place text boxes, checkboxes, dropdowns and more — then export a real fillable PDF.</p>
          </div>
        </div>
        <div className="wrap" style={{ flex:1 }}>
          <div className="choice-grid">

            {/* ── Option 1: Blank canvas ── */}
            <div className="choice-card">
              <div className="choice-card-head">
                <div className="choice-card-icon blue">📋</div>
                <h3>New Blank Form</h3>
              </div>
              <p>Start from scratch with a clean white canvas — no PDF needed.</p>
              <div className="choice-card-body">
                <div>
                  <div className="size-label">Page size</div>
                  <div className="size-btn-group">
                    {(Object.entries(PAGE_SIZES) as [PageSizeName, { w:number; h:number; sub:string }][]).map(([k, v]) => (
                      <button key={k} className={`size-btn${pageSize===k?' sel':''}`} onClick={() => setPageSize(k)}>
                        {k}<sub>{v.sub}</sub>
                      </button>
                    ))}
                  </div>
                </div>
                <button className="create-btn" onClick={() => { setBlankPages(1); setMode('blank') }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  Create Blank Form
                </button>
              </div>
            </div>

            {/* ── Option 2: Upload PDF ── */}
            <div className="choice-card">
              <div className="choice-card-head">
                <div className="choice-card-icon indigo">📄</div>
                <h3>Upload PDF</h3>
              </div>
              <p>Add form fields on top of an existing PDF document.</p>
              <div className="choice-card-body" style={{ flex:1 }}>
                <div
                  className={`drop-sm${isDrop?' over':''}`}
                  style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}
                  onDrop={e => { e.preventDefault(); setIsDrop(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f) }}
                >
                  <span style={{ fontSize:32, marginBottom:10 }}>📂</span>
                  <p>Drop a PDF here or click to browse</p>
                  <button className="drop-btn-sm">Choose PDF</button>
                  <input ref={fileRef} type="file" accept=".pdf" style={{ display:'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
                </div>
                {error && <div className="error-box">{error}</div>}
              </div>
            </div>

          </div>

          {/* Info row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:48 }}>
            <div style={{ padding:16, background:'#fafafa', border:'1px solid #e8e8e8', borderRadius:12 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>📝 6 Field Types</div>
              <div style={{ fontSize:12, color:'rgba(0,0,0,.45)', lineHeight:1.6 }}>Text, textarea, checkbox, dropdown, date, number — all become native AcroForm fields.</div>
            </div>
            <div style={{ padding:16, background:'#fafafa', border:'1px solid #e8e8e8', borderRadius:12 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>🖱️ Click to Place</div>
              <div style={{ fontSize:12, color:'rgba(0,0,0,.45)', lineHeight:1.6 }}>Select a field type, click and drag on the canvas to size and position it exactly.</div>
            </div>
            <div style={{ padding:16, background:'#fafafa', border:'1px solid #e8e8e8', borderRadius:12 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>🛡️ 100% Private</div>
              <div style={{ fontSize:12, color:'rgba(0,0,0,.45)', lineHeight:1.6 }}>Everything runs locally in your browser — nothing leaves your device.</div>
            </div>
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

  // ── Editor ────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="editor-pg">
        {Nav}
        <div className="editor-body">

          {/* Left sidebar — pages */}
          <div className="sidebar">
            <div className="sidebar-head">
              <div className="sidebar-title">{mode === 'blank' ? `Blank Form · ${pageSize}` : file?.name}</div>
              <div className="sidebar-sub">{totalPages} page{totalPages!==1?'s':''} · {fields.length} field{fields.length!==1?'s':''}</div>
            </div>
            <div className="page-list">
              {Array.from({ length: totalPages }, (_, i) => {
                const n = fields.filter(f => f.page === i).length
                return (
                  <button key={i} className={`page-thumb-btn${curPage===i?' active':''}`}
                    onClick={() => { setCurPage(i); setSelectedId(null) }}>
                    <div className="page-thumb-img">
                      {mode === 'pdf' && thumbs[i]
                        ? <img src={thumbs[i]} alt="" />
                        : <span style={{ fontSize:14 }}>📄</span>}
                    </div>
                    <div className="page-thumb-info">
                      <div className="page-thumb-num">Page {i+1}</div>
                      <div className="page-thumb-marks">{n > 0 ? `${n} field${n!==1?'s':''}` : 'No fields'}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            {mode === 'blank' && (
              <>
                <button className="add-page-btn" onClick={addBlankPage}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  Add Page
                </button>
                <button className="rm-page-btn" onClick={removeLastPage} disabled={blankPages <= 1}>
                  Remove Last Page
                </button>
              </>
            )}
          </div>

          {/* Center — toolbar + canvas */}
          <div className="center-panel">
            <div className="toolbar">
              <span className="tb-label">Add field</span>
              {FIELD_DEFS.map(d => (
                <button key={d.type} className="tb-btn" onClick={() => addField(d.type)}>
                  <span style={{ fontSize:11 }}>{d.icon}</span>{d.label}
                </button>
              ))}
              <div className="tb-div" />
              <button className="tb-btn" onClick={() => setCurPage(p=>Math.max(0,p-1))} disabled={curPage===0}>←</button>
              <span style={{ fontSize:11, color:'rgba(0,0,0,.4)', padding:'0 4px', whiteSpace:'nowrap' }}>{curPage+1} / {totalPages}</span>
              <button className="tb-btn" onClick={() => setCurPage(p=>Math.min(totalPages-1,p+1))} disabled={curPage===totalPages-1}>→</button>
              <div className="tb-div" />
              <button className="tb-btn danger" onClick={() => { setFields(f=>f.filter(x=>x.page!==curPage)); setSelectedId(null) }} disabled={curFields.length===0}>✕ Page</button>
              <button className="tb-btn danger" onClick={() => { setFields([]); setSelectedId(null) }} disabled={fields.length===0}>✕ All</button>
            </div>

            <div className="canvas-area">
              <div ref={wrapRef} className="canvas-wrap mode-select" onMouseDown={onCanvasMouseDown}>
                <canvas ref={canvasRef} />
                {mode === 'blank' && <div className="canvas-guide" />}

                {/* Field overlays */}
                {canvasRef.current && curFields.map(f => {
                  const cw  = canvasRef.current!.offsetWidth
                  const ch  = canvasRef.current!.offsetHeight
                  const sel = selectedId === f.id
                  const def = FIELD_DEFS.find(d => d.type === f.type)!
                  const labelEl = (
                    <div style={{
                      fontSize: f.label ? (f.labelFontSize ?? 9) : 9,
                      fontWeight: f.label && f.labelBold ? 700 : 600,
                      whiteSpace:'nowrap', flexShrink:0,
                      userSelect:'none', pointerEvents:'none', lineHeight:1.4,
                      color: f.label ? (f.labelColor ?? 'rgba(0,0,0,.55)') : 'rgba(0,0,0,.28)',
                      fontStyle: f.label ? 'normal' : 'italic' }}>
                      {f.label || `${def.label} label…`}
                    </div>
                  )
                  const selBorder  = '2px solid #6366f1'
                  const isMultiDash = f.type === 'multiline' && f.borderStyle === 'dash' && !sel
                  const idleBorderStyle = isMultiDash ? '1.5px solid #9ca3af'
                    : f.borderStyle === 'dash' ? '1.5px dashed #9ca3af'
                    : f.borderStyle === 'underline' ? 'none'
                    : '1.5px solid #9ca3af'
                  const underlineBorderBottom = !sel && f.borderStyle === 'underline' ? '2px solid #9ca3af' : undefined
                  const fieldH = f.h * ch
                  const LINE_SPACING = 14
                  const lineCount = Math.max(0, Math.floor((fieldH - 8) / LINE_SPACING))
                  const fieldBox = (
                    <div
                      className={`field-overlay${sel?' sel':''}`}
                      style={{ position:'relative', flexShrink:0,
                        width: f.labelPosition === 'left' ? f.w*cw - 70 : '100%',
                        height: fieldH,
                        background:'rgba(255,255,255,.92)',
                        border: sel ? selBorder : idleBorderStyle,
                        borderBottom: sel ? undefined : underlineBorderBottom,
                        borderRadius: f.borderStyle === 'underline' && !sel ? 0 : undefined }}
                      onMouseDown={e => onFieldMouseDown(e, f.id)}
                    >
                      {/* Ruled lines for multiline+dash */}
                      {isMultiDash && Array.from({ length: lineCount }).map((_, i) => (
                        <div key={i} style={{
                          position:'absolute', left:6, right:6,
                          top: 4 + (i + 1) * LINE_SPACING,
                          borderBottom: '1px dashed rgba(156,163,175,0.55)',
                          pointerEvents:'none',
                        }} />
                      ))}
                      <div className="field-inner" style={f.type === 'multiline' ? { alignItems:'flex-start', paddingTop:6 } : {}}>
                        {f.type === 'signature' ? (
                          <div style={{ width:'100%', height:'100%', position:'relative', display:'flex', alignItems:'flex-end', paddingBottom:4 }}>
                            {(f.sigShowIcon ?? true) && (
                              <span style={{ fontSize: Math.min(9, f.h*ch*.38), color: f.sigLineColor ?? 'rgba(0,0,0,.3)', fontStyle:'italic', lineHeight:1.4, paddingRight:4 }}>
                                ✍
                              </span>
                            )}
                            <span style={{ fontSize: Math.min(8, f.h*ch*.32), color:'rgba(0,0,0,.28)', fontStyle:'italic', lineHeight:1.4 }}>
                              {f.sigPromptText || 'Sign here'}
                            </span>
                            <div style={{ position:'absolute', bottom:0, left:0, right:0, pointerEvents:'none',
                              borderBottom: `1.5px ${f.sigLineStyle === 'dash' ? 'dashed' : 'solid'} ${f.sigLineColor ?? '#374151'}` }}/>
                          </div>
                        ) : f.type !== 'checkbox' ? (
                          <span style={{ fontSize: Math.min(10, f.h*ch*.48), overflow:'hidden', textOverflow:'ellipsis',
                            lineHeight:1.4,
                            color: f.placeholder ? (f.fieldTextColor ?? 'rgba(0,0,0,.7)') : 'rgba(0,0,0,.35)',
                            fontStyle: f.placeholder ? 'normal' : 'italic' }}>
                            {f.placeholder || `Enter ${def.label.toLowerCase()}…`}
                          </span>
                        ) : (
                          <span style={{ fontSize: Math.min(11, f.h*ch*.55), opacity:.5 }}>{def.icon}</span>
                        )}
                        {f.type === 'dropdown' && <span style={{ marginLeft:'auto', fontSize:9, opacity:.35 }}>▼</span>}
                      </div>
                      <button className="field-del" onClick={e => { e.stopPropagation(); deleteField(f.id) }}>✕</button>
                      {sel && <div className="resize-se" onMouseDown={e => { e.stopPropagation(); onResizeMouseDown(e, f.id) }} />}
                    </div>
                  )
                  return (
                    <div key={f.id} style={{ position:'absolute', left:f.x*cw, top:f.y*ch, width:f.w*cw }}>
                      {f.labelPosition === 'top' ? (
                        <>
                          <div style={{ marginBottom:2 }}>{labelEl}</div>
                          {fieldBox}
                        </>
                      ) : f.labelPosition === 'below' ? (
                        <>
                          {fieldBox}
                          <div style={{ marginTop:2 }}>{labelEl}</div>
                        </>
                      ) : (
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ width:64, textAlign:'right' }}>{labelEl}</div>
                          {fieldBox}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="hint-strip">
              🖱️ Click a field button above to add it to the page · Drag to move · Drag ◼ corner to resize · Click a field on canvas to select it
            </div>

            <div className="apply-bar">
              {error && <div className="error-box" style={{ width:'100%' }}>{error}</div>}
              <button className="apply-btn" onClick={onDownload} disabled={applying || fields.length===0}>
                {applying ? '⏳ Generating…' : `⬇ Download Fillable PDF (${fields.length} field${fields.length!==1?'s':''})`}
              </button>
              <button className="new-file-btn" onClick={reset}>← Back</button>
            </div>
          </div>

          {/* Right — properties */}
          <div className="props-panel">
            <div className="props-head">
              <div className="props-head-title">Field Properties</div>
              <div className="props-head-sub">{selectedField ? 'Edit the selected field' : 'Select a field to edit'}</div>
            </div>
            <div className="props-body">
              {!selectedField ? (
                <div className="props-empty">
                  <span className="props-empty-icon">👆</span>
                  <span className="props-empty-text">Click any field on the canvas to edit its label, placeholder, and settings</span>
                </div>
              ) : (
                <div key={selectedId!}>
                  <div className="prop-type-chip">
                    {FIELD_DEFS.find(d=>d.type===selectedField.type)?.icon}&nbsp;
                    {FIELD_DEFS.find(d=>d.type===selectedField.type)?.label}
                  </div>

                  <div className="prop-row">
                    <div className="prop-label">Label</div>
                    <input className="prop-input" placeholder="e.g. First Name"
                      defaultValue={selectedField.label}
                      onChange={e => updateField(selectedField.id, { label: e.target.value })} />
                  </div>

                  {/* Label styling */}
                  <div className="prop-row">
                    <div className="prop-label">Label Style</div>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <input type="color" value={selectedField.labelColor ?? '#374151'}
                        onChange={e => updateField(selectedField.id, { labelColor: e.target.value })}
                        title="Label color"
                        style={{ width:28, height:26, border:'1px solid #e0e0e0', borderRadius:5, cursor:'pointer', padding:1 }} />
                      <input type="number" min={7} max={24} step={1}
                        value={selectedField.labelFontSize ?? 9}
                        onChange={e => updateField(selectedField.id, { labelFontSize: parseInt(e.target.value)||9 })}
                        title="Font size"
                        style={{ width:48, padding:'5px 6px', border:'1px solid #e0e0e0', borderRadius:6, fontSize:11, color:'#1d1d1f', outline:'none', fontFamily:'inherit' }} />
                      <button onClick={() => updateField(selectedField.id, { labelBold: !selectedField.labelBold })}
                        title="Bold"
                        style={{ width:30, height:26, borderRadius:6, fontSize:12, fontWeight:800, cursor:'pointer',
                          border: selectedField.labelBold ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                          background: selectedField.labelBold ? '#f0f0ff' : '#fff',
                          color: selectedField.labelBold ? '#6366f1' : 'rgba(0,0,0,.5)' }}>B</button>
                    </div>
                  </div>

                  {selectedField.type !== 'checkbox' && selectedField.type !== 'dropdown' && selectedField.type !== 'signature' && (
                    <div className="prop-row">
                      <div className="prop-label">Placeholder Text</div>
                      <input className="prop-input"
                        placeholder={selectedField.type==='date'?'MM/DD/YYYY':selectedField.type==='number'?'0':'Enter hint text…'}
                        defaultValue={selectedField.placeholder}
                        onChange={e => updateField(selectedField.id, { placeholder: e.target.value })} />
                    </div>
                  )}

                  {/* Field text color — shown for all input types except checkbox */}
                  {selectedField.type !== 'checkbox' && selectedField.type !== 'signature' && (
                    <div className="prop-row">
                      <div className="prop-label">Text Color</div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <input type="color" value={selectedField.fieldTextColor ?? '#111111'}
                          onChange={e => updateField(selectedField.id, { fieldTextColor: e.target.value })}
                          style={{ width:28, height:26, border:'1px solid #e0e0e0', borderRadius:5, cursor:'pointer', padding:1 }} />
                        <span style={{ fontSize:11, color:'rgba(0,0,0,.4)' }}>Input text colour</span>
                      </div>
                    </div>
                  )}

                  <div className="prop-row">
                    <label className="prop-toggle">
                      <input type="checkbox" checked={selectedField.required}
                        onChange={e => updateField(selectedField.id, { required: e.target.checked })} />
                      <span>Required field</span>
                    </label>
                  </div>

                  <div className="prop-row">
                    <div className="prop-label">Label Position</div>
                    <div style={{ display:'flex', gap:6 }}>
                      {(['top','left','below'] as const).map(pos => (
                        <button key={pos} onClick={() => updateField(selectedField.id, { labelPosition: pos })}
                          style={{ flex:1, padding:'5px 0', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer',
                            border: selectedField.labelPosition === pos ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                            background: selectedField.labelPosition === pos ? '#f0f0ff' : '#fff',
                            color: selectedField.labelPosition === pos ? '#6366f1' : 'rgba(0,0,0,.5)' }}>
                          {pos === 'top' ? '↑ Top' : pos === 'left' ? '← Left' : '↓ Below'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Signature-specific settings ── */}
                  {selectedField.type === 'signature' && (
                    <>
                      <div className="prop-divider" />
                      <div style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'0.08em',
                        textTransform:'uppercase', marginBottom:10 }}>✍ Signature Settings</div>

                      <div className="prop-row">
                        <div className="prop-label">Prompt Text</div>
                        <input className="prop-input"
                          defaultValue={selectedField.sigPromptText ?? 'Sign here'}
                          placeholder="e.g. Sign here"
                          onChange={e => updateField(selectedField.id, { sigPromptText: e.target.value })} />
                      </div>

                      <div className="prop-row">
                        <div className="prop-label">Line Color</div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <input type="color" value={selectedField.sigLineColor ?? '#374151'}
                            onChange={e => updateField(selectedField.id, { sigLineColor: e.target.value })}
                            style={{ width:28, height:26, border:'1px solid #e0e0e0', borderRadius:5, cursor:'pointer', padding:1 }} />
                          <span style={{ fontSize:11, color:'rgba(0,0,0,.4)' }}>{selectedField.sigLineColor ?? '#374151'}</span>
                        </div>
                      </div>

                      <div className="prop-row">
                        <div className="prop-label">Line Style</div>
                        <div style={{ display:'flex', gap:6 }}>
                          {(['solid','dash'] as const).map(ls => (
                            <button key={ls} onClick={() => updateField(selectedField.id, { sigLineStyle: ls })}
                              style={{ flex:1, padding:'5px 0', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer',
                                border: (selectedField.sigLineStyle ?? 'solid') === ls ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                                background: (selectedField.sigLineStyle ?? 'solid') === ls ? '#f0f0ff' : '#fff',
                                color: (selectedField.sigLineStyle ?? 'solid') === ls ? '#6366f1' : 'rgba(0,0,0,.5)' }}>
                              {ls === 'solid' ? '— Solid' : '╌ Dash'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="prop-row">
                        <label className="prop-toggle">
                          <input type="checkbox" checked={selectedField.sigShowIcon ?? true}
                            onChange={e => updateField(selectedField.id, { sigShowIcon: e.target.checked })} />
                          <span>Show ✍ icon &amp; prompt</span>
                        </label>
                      </div>
                    </>
                  )}

                  {selectedField.type !== 'checkbox' && selectedField.type !== 'signature' && (
                    <div className="prop-row">
                      <div className="prop-label">Border Style</div>
                      <div style={{ display:'flex', gap:6 }}>
                        {(['box','dash','underline'] as const).map(bs => (
                          <button key={bs} onClick={() => updateField(selectedField.id, { borderStyle: bs })}
                            style={{ flex:1, padding:'5px 0', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer',
                              border: selectedField.borderStyle === bs ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                              background: selectedField.borderStyle === bs ? '#f0f0ff' : '#fff',
                              color: selectedField.borderStyle === bs ? '#6366f1' : 'rgba(0,0,0,.5)' }}>
                            {bs === 'box' ? '▭ Box' : bs === 'dash' ? '╌ Dash' : '_ Line'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedField.type === 'dropdown' && (
                    <>
                      <div className="prop-divider" />
                      <div className="prop-label">Options</div>
                      {selectedField.options.map((opt, i) => (
                        <div key={i} className="option-row">
                          <input value={opt} placeholder={`Option ${i+1}`}
                            onChange={e => {
                              const o = [...selectedField.options]; o[i] = e.target.value
                              updateField(selectedField.id, { options: o })
                            }} />
                          <button className="option-del"
                            onClick={() => updateField(selectedField.id, { options: selectedField.options.filter((_,j)=>j!==i) })}>✕</button>
                        </div>
                      ))}
                      <button className="add-opt-btn"
                        onClick={() => updateField(selectedField.id, { options: [...selectedField.options,''] })}>
                        + Add option
                      </button>
                    </>
                  )}

                  <div className="prop-divider" />
                  <div className="prop-label">Position &amp; Size (0–1)</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    {(['x','y','w','h'] as const).map(k => (
                      <div key={k}>
                        <div className="prop-label">{k.toUpperCase()}</div>
                        <input className="prop-input" type="number" step="0.005" min={0} max={1}
                          value={selectedField[k].toFixed(4)}
                          onChange={e => updateField(selectedField.id, { [k]: parseFloat(e.target.value)||0 })} />
                      </div>
                    ))}
                  </div>

                  <button className="prop-del-btn" onClick={() => deleteField(selectedField.id)}>Delete field</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
