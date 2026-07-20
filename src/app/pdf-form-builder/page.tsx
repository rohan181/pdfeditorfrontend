'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from 'pdf-lib'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.upload-pg{min-height:100vh;display:flex;flex-direction:column;background:#fff}
.wrap{max-width:820px;margin:0 auto;padding:0 28px;width:100%}
.editor-pg{height:100vh;overflow:hidden;display:flex;flex-direction:column;background:#fff}

/* Nav */

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
.editor-body{flex:1;display:flex;overflow:hidden}

/* Page sidebar */
.sidebar{width:240px;flex-shrink:0;background:#fafafa;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden}
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
.center-panel{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

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
.canvas-area{flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;padding:24px;gap:20px;background:#e8e8ea;min-height:0}
.canvas-wrap{position:relative;display:inline-block;box-shadow:0 4px 32px rgba(0,0,0,.16);border-radius:2px;line-height:0;flex-shrink:0}
.canvas-wrap.mode-select{cursor:default}
.canvas-wrap canvas{display:block;max-width:100%}

/* Field overlays */
.field-overlay{position:absolute;border-radius:3px;cursor:move;overflow:visible;transition:box-shadow .1s}
.field-overlay.sel{box-shadow:0 0 0 2px #6366f1,0 2px 12px rgba(99,102,241,.2)}
.field-overlay:not(.sel):hover{box-shadow:0 0 0 1.5px #6366f1}
.field-inner{width:100%;height:100%;display:flex;align-items:center;gap:4px;padding:0 6px;font-size:11px;color:rgba(0,0,0,.35);user-select:none;overflow:hidden;white-space:nowrap;border-radius:3px}
.field-del{position:absolute;top:-11px;right:-11px;width:22px;height:38px;border-radius:50%;background:#E24B4A;border:2px solid #fff;color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:10;line-height:1;box-shadow:0 2px 6px rgba(0,0,0,.25)}
.field-overlay.sel .field-del{display:flex}
.resize-se{position:absolute;bottom:-4px;right:-4px;width:9px;height:9px;background:#6366f1;border:2px solid #fff;border-radius:2px;cursor:se-resize;z-index:5}

/* Properties panel */
.props-panel{width:290px;border-left:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden;background:#fafafa;flex-shrink:0}
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
type FieldType     = 'text' | 'multiline' | 'checkbox' | 'dropdown' | 'date' | 'number' | 'signature' | 'radio' | 'checkgroup'

interface FormField {
  id: string; type: FieldType; page: number
  x: number; y: number; w: number; h: number
  label: string; placeholder: string; required: boolean; options: string[]
  labelPosition: 'top' | 'left' | 'right' | 'below'
  borderStyle: 'box' | 'dash' | 'underline'
  radioLayout: 'vertical' | 'horizontal'
  labelColor: string; labelFontSize: number; labelBold: boolean
  fieldTextColor: string
  fieldFont: 'helvetica' | 'times' | 'courier'
  fieldFontSize: number
  optionFontSize: number
  // signature-specific
  sigLineColor: string; sigLineStyle: 'solid' | 'dash'
  sigShowIcon: boolean; sigPromptText: string
}

type DocElementType = 'static-text' | 'table' | 'image'
interface DocElement {
  id: string; type: DocElementType; page: number
  x: number; y: number; w: number; h: number
  // static-text
  text: string
  textFont: 'helvetica' | 'times' | 'courier'
  textSize: number; textColor: string; textBold: boolean; textItalic: boolean
  textAlign: 'left' | 'center' | 'right'
  // table
  rows: number; cols: number; cellData: string[]
  colWidths: number[]   // fractions per column, must sum to 1
  rowHeights: number[]  // fractions per row, must sum to 1
  tableHasHeader: boolean; tableBorderColor: string; tableBgHeader: string
  // image
  imageData: string; imageName: string
}

type DragState   = { id:string; scx:number; scy:number; ox:number; oy:number; page:number } | null
type ResizeState = { id:string; scx:number; scy:number; ow:number; oh:number; page:number } | null

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZES: Record<PageSizeName, { w:number; h:number; sub:string }> = {
  'A4':     { w:595.28, h:841.89, sub:'210×297mm' },
  'Letter': { w:612,    h:792,    sub:'8.5×11in'  },
  'Legal':  { w:612,    h:1008,   sub:'8.5×14in'  },
}

const FIELD_DEFS = [
  { type:'text'       as FieldType, icon:'Aa', label:'Text',       defW:.32, defH:.038 },
  { type:'multiline'  as FieldType, icon:'¶',  label:'Textarea',   defW:.32, defH:.10  },
  { type:'signature'  as FieldType, icon:'✍',  label:'Signature',  defW:.40, defH:.055 },
  { type:'checkbox'   as FieldType, icon:'☑',  label:'Checkbox',   defW:.03, defH:.03  },
  { type:'radio'      as FieldType, icon:'◉',  label:'Radio',      defW:.24, defH:.07  },
  { type:'checkgroup' as FieldType, icon:'☑☑', label:'Multi-Check',defW:.24, defH:.07  },
  { type:'dropdown'   as FieldType, icon:'▼',  label:'Dropdown',   defW:.28, defH:.038 },
  { type:'date'       as FieldType, icon:'📅', label:'Date',        defW:.22, defH:.038 },
  { type:'number'     as FieldType, icon:'#',  label:'Number',     defW:.18, defH:.038 },
]

let _id = 0
const uid = () => `f-${Date.now()}-${++_id}`
const fmt = (b: number) => b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
const hexToRgb = (hex: string) => {
  const h = hex.replace('#','')
  return rgb(parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255)
}

// Adjust one fraction in an array while keeping the rest proportional, each ≥ MIN
const normalizeFractions = (arr: number[], idx: number, newVal: number): number[] => {
  const MIN = 0.05
  const clamped = Math.max(MIN, Math.min(1 - (arr.length - 1) * MIN, newVal))
  const otherTotal = arr.reduce((s, v, i) => i === idx ? s : s + v, 0)
  const remaining  = 1 - clamped
  return arr.map((v, i) => {
    if (i === idx) return clamped
    return otherTotal > 0 ? Math.max(MIN, v / otherTotal * remaining) : remaining / (arr.length - 1)
  })
}

const equalArr = (n: number) => Array(n).fill(1 / n)

// Pure helpers for table row/col mutations
const tblInsertRow = (de: DocElement, at: number) => {
  const nr = de.rows + 1, nc = de.cols
  const nd: string[] = []
  for (let r = 0; r < nr; r++)
    for (let c = 0; c < nc; c++)
      nd.push(r < at ? de.cellData[r*nc+c] ?? '' : r === at ? '' : de.cellData[(r-1)*nc+c] ?? '')
  const nf = 1/nr, old = de.rowHeights ?? equalArr(de.rows)
  return { rows: nr, cellData: nd, h: de.h * nr / de.rows, rowHeights: [...old.slice(0,at).map(h=>h*(1-nf)), nf, ...old.slice(at).map(h=>h*(1-nf))] }
}
const tblDeleteRow = (de: DocElement, at: number) => {
  if (de.rows <= 1) return null
  const nr = de.rows - 1, nc = de.cols
  const nd = de.cellData.filter((_, i) => Math.floor(i/nc) !== at)
  const old = de.rowHeights ?? equalArr(de.rows), rf = old[at] ?? 1/de.rows
  return { rows: nr, cellData: nd, h: de.h * nr / de.rows, rowHeights: old.filter((_,i)=>i!==at).map(h=>h/(1-rf)) }
}
const tblInsertCol = (de: DocElement, at: number) => {
  const nc = de.cols + 1, nr = de.rows, oldc = nc - 1
  const nd: string[] = []
  for (let r = 0; r < nr; r++)
    for (let c = 0; c < nc; c++)
      nd.push(c < at ? de.cellData[r*oldc+c] ?? '' : c === at ? '' : de.cellData[r*oldc+(c-1)] ?? '')
  const nf = 1/nc, old = de.colWidths ?? equalArr(oldc)
  return { cols: nc, cellData: nd, w: de.w * nc / oldc, colWidths: [...old.slice(0,at).map(w=>w*(1-nf)), nf, ...old.slice(at).map(w=>w*(1-nf))] }
}
const tblDeleteCol = (de: DocElement, at: number) => {
  if (de.cols <= 1) return null
  const nc = de.cols - 1, nr = de.rows, oldc = nc + 1
  const nd: string[] = []
  for (let r = 0; r < nr; r++)
    for (let c = 0; c < oldc; c++)
      if (c !== at) nd.push(de.cellData[r*oldc+c] ?? '')
  const old = de.colWidths ?? equalArr(oldc), cf = old[at] ?? 1/oldc
  return { cols: nc, cellData: nd, w: de.w * nc / oldc, colWidths: old.filter((_,i)=>i!==at).map(w=>w/(1-cf)) }
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
  const [fields,      setFields]      = useState<FormField[]>([])
  const [docElements, setDocElements] = useState<DocElement[]>([])
  const [selectedId,  setSelectedId]  = useState<string|null>(null)

  const pageCanvasRefs = useRef<(HTMLCanvasElement|null)[]>([])
  const pageWrapRefs   = useRef<(HTMLDivElement|null)[]>([])
  const canvasAreaRef  = useRef<HTMLDivElement>(null)
  const fileRef      = useRef<HTMLInputElement>(null)
  const imageFileRef = useRef<HTMLInputElement>(null)
  const pdfDocRef = useRef<any>(null)
  const dragRef   = useRef<DragState>(null)
  const resizeRef = useRef<ResizeState>(null)
  const modeRef   = useRef<Mode>('idle')
  const pinchRef  = useRef<number | null>(null)
  const tableResizeRef = useRef<{
    docId: string; axis: 'col'|'row'; idx: number
    startX: number; startY: number; startFracs: number[]; totalPx: number
  } | null>(null)
  const [tableCtxMenu, setTableCtxMenu] = useState<{
    docId: string; row: number; col: number; mx: number; my: number
  } | null>(null)
  const ctxMenuRef = useRef<HTMLDivElement>(null)
  const [tablePickerOpen, setTablePickerOpen] = useState(false)
  const [tableHover, setTableHover] = useState<[number, number]>([0, 0])
  const tablePickerRef = useRef<HTMLDivElement>(null)
  const [editingCell, setEditingCell] = useState<{ docId: string; row: number; col: number } | null>(null)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const [zoom, setZoom] = useState(1.0)
  const SCALE = 1.2 * zoom

  const zoomIn  = () => setZoom(z => Math.min(3.0, parseFloat((z + 0.25).toFixed(2))))
  const zoomOut = () => setZoom(z => Math.max(0.25, parseFloat((z - 0.25).toFixed(2))))

  useEffect(() => { modeRef.current = mode }, [mode])

  const selectedField = fields.find(f => f.id === selectedId) ?? null
  const selectedDoc   = docElements.find(d => d.id === selectedId) ?? null
  const curFields     = fields.filter(f => f.page === curPage)
  const curDocs       = docElements.filter(d => d.page === curPage)
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
      options: (type === 'dropdown' || type === 'radio' || type === 'checkgroup') ? ['Option 1', 'Option 2', 'Option 3'] : [],
      radioLayout: 'vertical' as const,
      labelPosition: type === 'signature' ? 'below' : type === 'checkbox' ? 'right' : 'top', borderStyle: type === 'signature' ? 'underline' : 'box',
      labelColor: '#374151', labelFontSize: 9, labelBold: false,
      fieldTextColor: '#111111',
      fieldFont: 'helvetica',
      fieldFontSize: 10,
      optionFontSize: 9,
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

  // ── Render all page canvases ──────────────────────────────────────────────
  useEffect(() => {
    // Blank canvas — render one canvas per blank page
    if (modeRef.current === 'blank') {
      for (let i = 0; i < blankPages; i++) {
        const cv = pageCanvasRefs.current[i]
        if (!cv) continue
        const { w, h } = PAGE_SIZES[pageSize]
        cv.width  = Math.round(w * SCALE)
        cv.height = Math.round(h * SCALE)
        const ctx = cv.getContext('2d')!
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, cv.width, cv.height)
      }
      return
    }

    // PDF canvas — render each page
    if (!pdfDocRef.current || thumbs.length === 0) return
    let cancelled = false
    ;(async () => {
      for (let i = 0; i < thumbs.length; i++) {
        if (cancelled) break
        const cv = pageCanvasRefs.current[i]
        if (!cv) continue
        const pg = await pdfDocRef.current.getPage(i + 1)
        const vp = pg.getViewport({ scale: SCALE })
        cv.width = vp.width; cv.height = vp.height
        const ctx = cv.getContext('2d')!
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height)
        if (!cancelled) await pg.render({ canvasContext: ctx, viewport: vp }).promise
      }
    })()
    return () => { cancelled = true }
  }, [mode, thumbs.length, pageSize, blankPages, zoom])

  // ── IntersectionObserver — update curPage while scrolling ────────────────
  useEffect(() => {
    const area = canvasAreaRef.current
    if (!area || totalPages === 0) return
    const observer = new IntersectionObserver(
      entries => {
        let best: { ratio: number; idx: number } | null = null
        entries.forEach(entry => {
          const idx = pageWrapRefs.current.indexOf(entry.target as HTMLDivElement)
          if (idx >= 0 && entry.intersectionRatio > (best?.ratio ?? 0)) {
            best = { ratio: entry.intersectionRatio, idx }
          }
        })
        if (best !== null) setCurPage((best as { ratio:number; idx:number }).idx)
      },
      { root: area, threshold: [0, 0.25, 0.5, 0.75, 1.0] }
    )
    pageWrapRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [totalPages])

  const scrollToPage = (idx: number) => {
    pageWrapRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // ── Canvas mouse down — deselect only ────────────────────────────────────
  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setSelectedId(null)
  }

  // ── Global mouse move / up — drag & resize only ───────────────────────────
  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (dragRef.current) {
        const { id, scx, scy, ox, oy, page } = dragRef.current
        const wrap = pageWrapRefs.current[page]
        if (!wrap) return
        const cw = wrap.offsetWidth, ch = wrap.offsetHeight
        const dx = e.clientX - scx, dy = e.clientY - scy
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return
        setFields(prev => prev.map(f => f.id !== id ? f : {
          ...f,
          x: Math.max(0, Math.min(1 - f.w, (ox + dx) / cw)),
          y: Math.max(0, Math.min(1 - f.h, (oy + dy) / ch)),
        }))
        setDocElements(prev => prev.map(d => d.id !== id ? d : {
          ...d,
          x: Math.max(0, Math.min(1 - d.w, (ox + dx) / cw)),
          y: Math.max(0, Math.min(1 - d.h, (oy + dy) / ch)),
        }))
      }
      if (resizeRef.current) {
        const { id, scx, scy, ow, oh, page } = resizeRef.current
        const wrap = pageWrapRefs.current[page]
        if (!wrap) return
        const cw = wrap.offsetWidth, ch = wrap.offsetHeight
        const dx = e.clientX - scx, dy = e.clientY - scy
        setFields(prev => prev.map(f => f.id !== id ? f : {
          ...f,
          w: Math.max(0.03, Math.min(1 - f.x, (ow * cw + dx) / cw)),
          h: Math.max(0.02, Math.min(1 - f.y, (oh * ch + dy) / ch)),
        }))
        setDocElements(prev => prev.map(d => d.id !== id ? d : {
          ...d,
          w: Math.max(0.05, Math.min(1 - d.x, (ow * cw + dx) / cw)),
          h: Math.max(0.03, Math.min(1 - d.y, (oh * ch + dy) / ch)),
        }))
      }
      if (tableResizeRef.current) {
        const { docId, axis, idx, startX, startY, startFracs, totalPx } = tableResizeRef.current
        const delta = (axis === 'col' ? e.clientX - startX : e.clientY - startY) / totalPx
        const MIN = 0.05
        const a = Math.max(MIN, Math.min(startFracs[idx] + startFracs[idx+1] - MIN, startFracs[idx] + delta))
        const b = Math.max(MIN, startFracs[idx] + startFracs[idx+1] - a)
        const nf = [...startFracs]; nf[idx] = a; nf[idx+1] = b
        setDocElements(prev => prev.map(d => d.id !== docId ? d : {
          ...d, ...(axis === 'col' ? { colWidths: nf } : { rowHeights: nf }),
        }))
      }
    }
    const mu = () => { dragRef.current = null; resizeRef.current = null; tableResizeRef.current = null }

    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup',   mu)
    window.addEventListener('touchmove', mm as EventListener, { passive: false })
    window.addEventListener('touchend',  mu)
    return () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup',   mu)
      window.removeEventListener('touchmove', mm as EventListener)
      window.removeEventListener('touchend',  mu)
    }
  }, [])

  // ── Dismiss table context menu on outside click ───────────────────────────
  useEffect(() => {
    if (!tableCtxMenu) return
    const dismiss = (e: MouseEvent) => {
      if (ctxMenuRef.current?.contains(e.target as Node)) return
      setTableCtxMenu(null)
    }
    document.addEventListener('mousedown', dismiss)
    return () => document.removeEventListener('mousedown', dismiss)
  }, [tableCtxMenu])

  useEffect(() => {
    if (!tablePickerOpen) return
    const dismiss = (e: MouseEvent) => {
      if (tablePickerRef.current?.contains(e.target as Node)) return
      setTablePickerOpen(false)
    }
    document.addEventListener('mousedown', dismiss)
    return () => document.removeEventListener('mousedown', dismiss)
  }, [tablePickerOpen])

  // ── Wheel + pinch zoom ────────────────────────────────────────────────────
  useEffect(() => {
    const area = canvasAreaRef.current
    if (!area) return

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return          // plain scroll → let the area scroll normally
      e.preventDefault()
      // trackpad pinch also arrives here with ctrlKey=true and small fractional deltaY
      const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08
      setZoom(z => Math.min(3.0, Math.max(0.25, +(z * factor).toFixed(3))))
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchRef.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || pinchRef.current === null) return
      e.preventDefault()
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      const factor = dist / pinchRef.current
      setZoom(z => Math.min(3.0, Math.max(0.25, +(z * factor).toFixed(3))))
      pinchRef.current = dist
    }

    const onTouchEnd = () => { pinchRef.current = null }

    area.addEventListener('wheel',      onWheel,      { passive: false })
    area.addEventListener('touchstart', onTouchStart, { passive: true  })
    area.addEventListener('touchmove',  onTouchMove,  { passive: false })
    area.addEventListener('touchend',   onTouchEnd)
    return () => {
      area.removeEventListener('wheel',      onWheel)
      area.removeEventListener('touchstart', onTouchStart)
      area.removeEventListener('touchmove',  onTouchMove)
      area.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  // ── Field interaction ─────────────────────────────────────────────────────
  const onFieldMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedId(id)
    const f    = fields.find(ff => ff.id === id)!
    const wrap = pageWrapRefs.current[f.page]
    if (!wrap) return
    const cw = wrap.offsetWidth, ch = wrap.offsetHeight
    dragRef.current = { id, scx: e.clientX, scy: e.clientY, ox: f.x * cw, oy: f.y * ch, page: f.page }
  }

  const onResizeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); e.preventDefault()
    const f = fields.find(ff => ff.id === id)!
    resizeRef.current = { id, scx: e.clientX, scy: e.clientY, ow: f.w, oh: f.h, page: f.page }
  }

  const deleteField    = (id: string) => { setFields(p => p.filter(f => f.id !== id)); if (selectedId === id) setSelectedId(null) }
  const updateField    = (id: string, patch: Partial<FormField>) => setFields(p => p.map(f => f.id === id ? { ...f, ...patch } : f))

  const deleteDocElement = (id: string) => { setDocElements(p => p.filter(d => d.id !== id)); if (selectedId === id) setSelectedId(null) }
  const updateDocElement = (id: string, patch: Partial<DocElement>) => setDocElements(p => p.map(d => d.id === id ? { ...d, ...patch } : d))

  const addDocElement = (type: DocElementType) => {
    if (type === 'image') { imageFileRef.current?.click(); return }
    const defW = type === 'table' ? 0.6 : 0.32
    const defH = type === 'table' ? 0.22 : 0.05
    const nde: DocElement = {
      id: uid(), type, page: curPage,
      x: 0.08, y: Math.min(0.82 - defH, 0.07 + curDocs.length * 0.08),
      w: defW, h: defH,
      text: 'Your text here', textFont: 'helvetica', textSize: 12,
      textColor: '#111111', textBold: false, textItalic: false, textAlign: 'left',
      rows: 3, cols: 3, cellData: Array(9).fill(''),
      colWidths: equalArr(3), rowHeights: equalArr(3),
      tableHasHeader: true, tableBorderColor: '#374151', tableBgHeader: '#e5e7eb',
      imageData: '', imageName: '',
    }
    setDocElements(prev => [...prev, nde])
    setSelectedId(nde.id)
  }

  const addTableWithSize = (rows: number, cols: number) => {
    const rowH = Math.min(0.055, 0.44 / rows)
    const defH = rows * rowH
    const defW = Math.min(0.88, cols * 0.13)
    const nde: DocElement = {
      id: uid(), type: 'table', page: curPage,
      x: 0.06, y: Math.min(0.82 - defH, 0.07 + curDocs.length * 0.08),
      w: defW, h: defH,
      text: '', textFont: 'helvetica', textSize: 12,
      textColor: '#111111', textBold: false, textItalic: false, textAlign: 'left',
      rows, cols, cellData: Array(rows * cols).fill(''),
      colWidths: equalArr(cols), rowHeights: equalArr(rows),
      tableHasHeader: true, tableBorderColor: '#374151', tableBgHeader: '#e5e7eb',
      imageData: '', imageName: '',
    }
    setDocElements(prev => [...prev, nde])
    setSelectedId(nde.id)
    setTablePickerOpen(false)
  }

  const sendChat = async () => {
    const text = chatInput.trim()
    if (!text || chatLoading) return
    const newHistory: { role: 'user' | 'assistant'; content: string }[] = [
      ...chatHistory,
      { role: 'user', content: text },
    ]
    setChatHistory(newHistory)
    setChatInput('')
    setChatLoading(true)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    try {
      const currentFields = fields
        .filter(f => f.page === curPage)
        .map(f => ({ type: f.type, label: f.label, x: f.x, y: f.y, w: f.w, h: f.h }))

      const res = await fetch('/api/form-builder-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newHistory, currentFields }),
      })
      const data = await res.json()
      if (data.error) {
        const errMsg = data.error.includes('credit balance is too low')
          ? '⚠️ Your Anthropic API credit balance is too low. Please add credits at console.anthropic.com → Plans & Billing, then try again.'
          : `⚠️ API error: ${data.error}`
        setChatHistory(prev => [...prev, { role: 'assistant', content: errMsg }])
        return
      }
      const assistantMsg = data.message ?? 'Sorry, something went wrong.'
      setChatHistory(prev => [...prev, { role: 'assistant', content: assistantMsg }])

      const rawFields: any[] = data.fields ?? []
      if (rawFields.length > 0) {
        const built: FormField[] = rawFields.map((f: any) => ({
          id: uid(),
          type: f.type ?? 'text',
          page: curPage,
          x: f.x ?? 0.08,
          y: f.y ?? 0.07,
          w: f.w ?? 0.38,
          h: f.h ?? 0.038,
          label: f.label ?? '',
          placeholder: f.placeholder ?? '',
          required: f.required ?? false,
          options: Array.isArray(f.options) ? f.options : [],
          radioLayout: f.radioLayout ?? 'vertical',
          labelPosition: f.labelPosition ?? (f.type === 'checkbox' ? 'right' : 'top'),
          borderStyle: f.borderStyle ?? 'box',
          labelColor: f.labelColor ?? '#374151',
          labelFontSize: f.labelFontSize ?? 11,
          labelBold: f.labelBold ?? false,
          fieldTextColor: f.fieldTextColor ?? '#111111',
          fieldFont: f.fieldFont ?? 'helvetica',
          fieldFontSize: f.fieldFontSize ?? 12,
          optionFontSize: f.optionFontSize ?? 9,
          sigLineColor: f.sigLineColor ?? '#374151',
          sigLineStyle: f.sigLineStyle ?? 'solid',
          sigShowIcon: f.sigShowIcon ?? true,
          sigPromptText: f.sigPromptText ?? 'Sign here',
        }))
        // Always replace the full form — Claude returns all fields every time
        setFields(prev => [...prev.filter(f => f.page !== curPage), ...built])
        setSelectedId(null)
      }
    } catch (err: any) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: `⚠️ Network error: ${err?.message ?? 'Could not reach the server. Please try again.'}` }])
    } finally {
      setChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  const onImageFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0]; if (!imgFile) return
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      const nde: DocElement = {
        id: uid(), type: 'image', page: curPage,
        x: 0.08, y: 0.08, w: 0.45, h: 0.32,
        text: '', textFont: 'helvetica', textSize: 12, textColor: '#111111',
        textBold: false, textItalic: false, textAlign: 'left',
        rows: 3, cols: 3, cellData: Array(9).fill(''),
        colWidths: equalArr(3), rowHeights: equalArr(3),
        tableHasHeader: true, tableBorderColor: '#374151', tableBgHeader: '#e5e7eb',
        imageData: dataUrl, imageName: imgFile.name,
      }
      setDocElements(prev => [...prev, nde])
      setSelectedId(nde.id)
    }
    reader.readAsDataURL(imgFile)
    e.target.value = ''
  }

  const onDocMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); setSelectedId(id)
    const d    = docElements.find(dd => dd.id === id)!
    const wrap = pageWrapRefs.current[d.page]
    if (!wrap) return
    const cw = wrap.offsetWidth, ch = wrap.offsetHeight
    dragRef.current = { id, scx: e.clientX, scy: e.clientY, ox: d.x * cw, oy: d.y * ch, page: d.page }
  }

  const onDocResizeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); e.preventDefault()
    const d = docElements.find(dd => dd.id === id)!
    resizeRef.current = { id, scx: e.clientX, scy: e.clientY, ow: d.w, oh: d.h, page: d.page }
  }

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
        const fieldW = f.labelPosition === 'left' && f.label ? Math.max(8, w - LEFT_LABEL_W - 4) : f.labelPosition === 'right' ? fh : w
        const opts   = { x: fieldX, y, width: fieldW, height: fh }

        if (f.label) {
          const lColor = hexToRgb(f.labelColor ?? '#374151')
          if (f.labelPosition === 'top') {
            pg.drawText(f.label, { x, y: y + fh + 3, size: lsz, font: lFont, color: lColor, maxWidth: w })
          } else if (f.labelPosition === 'below') {
            pg.drawText(f.label, { x, y: y - lsz - 3, size: lsz, font: lFont, color: lColor, maxWidth: w })
          } else if (f.labelPosition === 'right') {
            pg.drawText(f.label, { x: x + fh + 4, y: y + fh / 2 - lsz / 2, size: lsz, font: lFont, color: lColor, maxWidth: w - fh - 4 })
          } else {
            // left
            pg.drawText(f.label, { x, y: y + fh / 2 - lsz / 2, size: lsz, font: lFont, color: lColor, maxWidth: LEFT_LABEL_W })
          }
        }

        const FIELD_FONT_SIZE = f.fieldFontSize ?? 10
        const pdfFontName = f.fieldFont === 'times' ? 'TiRo' : f.fieldFont === 'courier' ? 'Cour' : 'Helv'
        // Build the DA string — standard PDF Type1 names; colour is r g b rg (non-stroking)
        const tc   = f.fieldTextColor ?? '#111111'
        const tr   = parseInt(tc.slice(1,3),16)/255
        const tg   = parseInt(tc.slice(3,5),16)/255
        const tb   = parseInt(tc.slice(5,7),16)/255
        const daStr = `/${pdfFontName} ${FIELD_FONT_SIZE} Tf ${tr.toFixed(3)} ${tg.toFixed(3)} ${tb.toFixed(3)} rg`
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
        } else if (f.type === 'radio') {
          if (f.options.length > 0) {
            const rg  = form.createRadioGroup(f.id)
            const n   = f.options.length
            const isH = f.radioLayout === 'horizontal'
            const btnSize = Math.min(isH ? fieldW / n * 0.3 : fh / n * 0.4, 12)
            const cellW = fieldW / n, cellH = fh / n
            f.options.forEach((opt, i) => {
              const bx = isH ? fieldX + i * cellW + (cellW - btnSize) / 2 : fieldX + 2
              const by = isH ? y + (fh - btnSize) / 2 : y + fh - i * cellH - (cellH + btnSize) / 2
              rg.addOptionToPage(opt, pg, { x: bx, y: by, width: btnSize, height: btnSize })
              const lx = isH ? fieldX + i * cellW : fieldX + btnSize + 4
              const ly = isH ? y + (fh - btnSize) / 2 - 10 : y + fh - i * cellH - cellH / 2 - 4
              pg.drawText(opt, { x: lx, y: ly, size: 7, font, color: hexToRgb(f.fieldTextColor ?? '#111111'), maxWidth: isH ? cellW : fieldW - btnSize - 6 })
            })
          }
        } else if (f.type === 'checkgroup') {
          f.options.forEach((opt, i) => {
            const n   = f.options.length
            const isH = f.radioLayout === 'horizontal'
            const btnSize = Math.min(isH ? fieldW / n * 0.3 : fh / n * 0.4, 11)
            const cellW = fieldW / n, cellH = fh / n
            const bx = isH ? fieldX + i * cellW + (cellW - btnSize) / 2 : fieldX + 2
            const by = isH ? y + (fh - btnSize) / 2 : y + fh - i * cellH - (cellH + btnSize) / 2
            const cb = form.createCheckBox(`${f.id}_${i}`)
            cb.addToPage(pg, { x: bx, y: by, width: btnSize, height: btnSize })
            const lx = isH ? fieldX + i * cellW : fieldX + btnSize + 4
            const ly = isH ? y + (fh - btnSize) / 2 - 10 : y + fh - i * cellH - cellH / 2 - 4
            pg.drawText(opt, { x: lx, y: ly, size: 7, font, color: hexToRgb(f.fieldTextColor ?? '#111111'), maxWidth: isH ? cellW : fieldW - btnSize - 6 })
          })
        } else if (f.type === 'checkbox') {
          form.createCheckBox(f.id).addToPage(pg, opts)
        } else if (f.type === 'dropdown') {
          const dd = form.createDropdown(f.id)
          if (f.options.length) { dd.setOptions(f.options); dd.select(f.options[0]) }
          const ddFontSize = f.optionFontSize ?? 9
          const ddDaStr = `/${pdfFontName} ${ddFontSize} Tf ${tr.toFixed(3)} ${tg.toFixed(3)} ${tb.toFixed(3)} rg`
          dd.acroField.dict.set(PDFName.of('DA'), PDFString.of(ddDaStr))
          dd.setFontSize(ddFontSize)
          dd.addToPage(pg, opts)
        }
      }

      // ── Render doc elements (static text, tables, images) ─────────────────
      for (const de of docElements) {
        if (de.page >= pdfPgs.length) continue
        const pg  = pdfPgs[de.page]
        const { width: pw, height: ph } = pg.getSize()
        const x   = de.x * pw, w = de.w * pw
        const fh  = de.h * ph, y = ph - de.y * ph - fh

        if (de.type === 'static-text' && de.text) {
          const txFont = de.textFont === 'times'
            ? (de.textBold ? await pdfDoc.embedFont(StandardFonts.TimesRomanBold)   : await pdfDoc.embedFont(StandardFonts.TimesRoman))
            : de.textFont === 'courier'
            ? (de.textBold ? await pdfDoc.embedFont(StandardFonts.CourierBold)      : await pdfDoc.embedFont(StandardFonts.Courier))
            : (de.textBold ? await pdfDoc.embedFont(StandardFonts.HelveticaBold)    : await pdfDoc.embedFont(StandardFonts.Helvetica))
          const txColor = hexToRgb(de.textColor ?? '#111111')
          const sz = de.textSize ?? 12
          const lines = de.text.split('\n')
          let lineY = y + fh - sz
          for (const line of lines) {
            if (lineY < y) break
            pg.drawText(line, { x, y: lineY, size: sz, font: txFont, color: txColor, maxWidth: w })
            lineY -= sz * 1.4
          }

        } else if (de.type === 'table') {
          const rows = de.rows ?? 3, cols = de.cols ?? 3
          const cws = de.colWidths  ?? equalArr(cols)
          const rhs = de.rowHeights ?? equalArr(rows)
          // Cumulative X positions for columns
          const cumX: number[] = [x]
          for (const cw2 of cws) cumX.push(cumX[cumX.length-1] + cw2 * w)
          // Cumulative Y positions for rows (top-to-bottom in PDF coords means decreasing Y)
          const cumY: number[] = [y + fh]
          for (const rh of rhs) cumY.push(cumY[cumY.length-1] - rh * fh)
          const bc  = hexToRgb(de.tableBorderColor ?? '#374151')
          const hbg = hexToRgb(de.tableBgHeader ?? '#e5e7eb')
          // header bg
          if (de.tableHasHeader) {
            pg.drawRectangle({ x, y: cumY[1], width: w, height: rhs[0] * fh, color: hbg, borderWidth: 0 })
          }
          // outer rect
          pg.drawRectangle({ x, y, width: w, height: fh, borderColor: bc, borderWidth: 0.8, color: rgb(1,1,1) })
          // horizontal inner lines
          for (let r = 1; r < rows; r++) {
            pg.drawLine({ start:{ x, y: cumY[r] }, end:{ x: x + w, y: cumY[r] }, thickness: 0.5, color: bc })
          }
          // vertical inner lines
          for (let c = 1; c < cols; c++) {
            pg.drawLine({ start:{ x: cumX[c], y }, end:{ x: cumX[c], y: y + fh }, thickness: 0.5, color: bc })
          }
          // cell text
          const cellFont     = await pdfDoc.embedFont(StandardFonts.Helvetica)
          const cellFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const txt = de.cellData?.[r * cols + c] ?? ''
              if (!txt) continue
              const isHeader = de.tableHasHeader && r === 0
              const cellH = rhs[r] * fh
              const cy2   = cumY[r] - cellH + cellH * 0.3
              const cellW = cws[c] * w
              pg.drawText(txt, {
                x: cumX[c] + 3, y: cy2, size: Math.min(8, cellH * 0.5),
                font: isHeader ? cellFontBold : cellFont,
                color: rgb(0.1, 0.1, 0.1), maxWidth: cellW - 6,
              })
            }
          }

        } else if (de.type === 'image' && de.imageData) {
          try {
            const isJpg = de.imageData.includes('image/jpeg') || de.imageData.includes('image/jpg')
            const b64   = de.imageData.split(',')[1]
            const bin   = atob(b64)
            const bytes = new Uint8Array(bin.length)
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
            const img = isJpg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes)
            pg.drawImage(img, { x, y, width: w, height: fh })
          } catch { /* skip if image fails to embed */ }
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
    setFields([]); setDocElements([]); setSelectedId(null); setError(''); setBlankPages(1); setZoom(1.0)
    pdfDocRef.current = null
  }

  // ── Nav ───────────────────────────────────────────────────────────────────
  const Nav = (
    <SiteNav />
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

          {/* Left sidebar — pages or field properties */}
          <div className="sidebar">
            {!(selectedField || selectedDoc) ? (
              /* ── Pages view ── */
              <>
                <div className="sidebar-head">
                  <div className="sidebar-title">{mode === 'blank' ? `Blank Form · ${pageSize}` : file?.name}</div>
                  <div className="sidebar-sub">{totalPages} page{totalPages!==1?'s':''} · {fields.length} field{fields.length!==1?'s':''}</div>
                </div>
                <div className="page-list">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const n = fields.filter(f => f.page === i).length
                    return (
                      <button key={i} className={`page-thumb-btn${curPage===i?' active':''}`}
                        onClick={() => { setCurPage(i); setSelectedId(null); scrollToPage(i) }}>
                        <div className="page-thumb-img">
                          {mode === 'pdf' && thumbs[i]
                            ? <img src={thumbs[i]} alt="" loading="lazy" />
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
              </>
            ) : (
              /* ── Properties view ── */
              <>
                <div style={{ padding:'9px 13px', borderBottom:'1px solid #e8e8e8', flexShrink:0, display:'flex', alignItems:'center', gap:8 }}>
                  <button onClick={() => setSelectedId(null)} style={{
                    fontSize:11, fontWeight:600, color:'rgba(0,0,0,.45)', background:'none', border:'none',
                    cursor:'pointer', display:'flex', alignItems:'center', gap:3, padding:0, flexShrink:0,
                  }}>← Pages</button>
                  <div style={{ width:1, height:12, background:'#e0e0e0', flexShrink:0 }} />
                  <div style={{ fontSize:11, fontWeight:700, color:'#1d1d1f', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {selectedField
                      ? `${FIELD_DEFS.find(d=>d.type===selectedField.type)?.label ?? ''} Field`
                      : selectedDoc?.type === 'static-text' ? 'Text Block'
                      : selectedDoc?.type === 'table' ? 'Table' : 'Image'}
                  </div>
                </div>
                <div className="props-body">
                  {selectedDoc ? (
                    <div key={selectedId!}>
                      <div className="prop-type-chip">
                        {selectedDoc.type === 'static-text' ? 'T' : selectedDoc.type === 'table' ? '⊞' : '🖼'}&nbsp;
                        {selectedDoc.type === 'static-text' ? 'Text Block' : selectedDoc.type === 'table' ? 'Table' : 'Image'}
                      </div>
                      <div className="prop-row">
                        <div className="prop-label">Position &amp; Size (0–1)</div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                          {(['x','y','w','h'] as const).map(k => (
                            <div key={k}>
                              <div className="prop-label">{k.toUpperCase()}</div>
                              <input className="prop-input" type="number" step="0.005" min={0} max={1}
                                value={selectedDoc[k].toFixed(4)}
                                onChange={e => updateDocElement(selectedDoc.id, { [k]: parseFloat(e.target.value)||0 })} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="prop-del-btn" onClick={() => deleteDocElement(selectedDoc.id)}>Delete element</button>
                    </div>
                  ) : selectedField ? (
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

                      <div className="prop-row">
                        <div className="prop-label">Label Style</div>
                        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                          <input type="color" value={selectedField.labelColor ?? '#374151'}
                            onChange={e => updateField(selectedField.id, { labelColor: e.target.value })}
                            title="Label color"
                            style={{ width:28, height:38, border:'1px solid #e0e0e0', borderRadius:5, cursor:'pointer', padding:1 }} />
                          <input type="number" min={7} max={24} step={1}
                            value={selectedField.labelFontSize ?? 9}
                            onChange={e => updateField(selectedField.id, { labelFontSize: parseInt(e.target.value)||9 })}
                            title="Font size"
                            style={{ width:48, padding:'5px 6px', border:'1px solid #e0e0e0', borderRadius:6, fontSize:11, color:'#1d1d1f', outline:'none', fontFamily:'inherit' }} />
                          <button onClick={() => updateField(selectedField.id, { labelBold: !selectedField.labelBold })}
                            title="Bold"
                            style={{ width:30, height:38, borderRadius:6, fontSize:12, fontWeight:800, cursor:'pointer',
                              border: selectedField.labelBold ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                              background: selectedField.labelBold ? '#f0f0ff' : '#fff',
                              color: selectedField.labelBold ? '#6366f1' : 'rgba(0,0,0,.5)' }}>B</button>
                        </div>
                      </div>

                      {selectedField.type !== 'checkbox' && selectedField.type !== 'dropdown' && selectedField.type !== 'signature' && selectedField.type !== 'radio' && selectedField.type !== 'checkgroup' && (
                        <div className="prop-row">
                          <div className="prop-label">Placeholder</div>
                          <input className="prop-input"
                            placeholder={selectedField.type==='date'?'MM/DD/YYYY':selectedField.type==='number'?'0':'Enter hint text…'}
                            defaultValue={selectedField.placeholder}
                            onChange={e => updateField(selectedField.id, { placeholder: e.target.value })} />
                        </div>
                      )}

                      {selectedField.type !== 'checkbox' && selectedField.type !== 'signature' && selectedField.type !== 'radio' && selectedField.type !== 'checkgroup' && (
                        <>
                          <div className="prop-row">
                            <div className="prop-label">Font Family</div>
                            <div style={{ display:'flex', gap:5 }}>
                              {(['helvetica','times','courier'] as const).map(f => (
                                <button key={f} onClick={() => updateField(selectedField.id, { fieldFont: f })}
                                  style={{ flex:1, padding:'5px 0', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer',
                                    fontFamily: f === 'times' ? '"Times New Roman",serif' : f === 'courier' ? '"Courier New",monospace' : 'inherit',
                                    border: (selectedField.fieldFont ?? 'helvetica') === f ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                                    background: (selectedField.fieldFont ?? 'helvetica') === f ? '#f0f0ff' : '#fff',
                                    color: (selectedField.fieldFont ?? 'helvetica') === f ? '#6366f1' : 'rgba(0,0,0,.55)' }}>
                                  {f === 'helvetica' ? 'Helv' : f === 'times' ? 'Times' : 'Cour'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="prop-row">
                            <div className="prop-label">Font Size &amp; Color</div>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <input type="number" min={6} max={36} value={selectedField.fieldFontSize ?? 10}
                                onChange={e => updateField(selectedField.id, { fieldFontSize: Number(e.target.value) })}
                                style={{ width:52, padding:'5px 6px', border:'1px solid #e0e0e0', borderRadius:6, fontSize:11, color:'#1d1d1f', outline:'none' }} />
                              <input type="color" value={selectedField.fieldTextColor ?? '#111111'}
                                onChange={e => updateField(selectedField.id, { fieldTextColor: e.target.value })}
                                style={{ width:26, height:24, border:'1px solid #e0e0e0', borderRadius:5, cursor:'pointer', padding:1 }} />
                            </div>
                          </div>
                        </>
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
                        <div style={{ display:'flex', gap:5 }}>
                          {(['top','left','right','below'] as const).map(pos => (
                            <button key={pos} onClick={() => updateField(selectedField.id, { labelPosition: pos })}
                              style={{ flex:1, padding:'5px 0', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer',
                                border: selectedField.labelPosition === pos ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                                background: selectedField.labelPosition === pos ? '#f0f0ff' : '#fff',
                                color: selectedField.labelPosition === pos ? '#6366f1' : 'rgba(0,0,0,.5)' }}>
                              {pos === 'top' ? '↑ Top' : pos === 'left' ? '← Left' : pos === 'right' ? 'Right →' : '↓ Below'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedField.type !== 'checkbox' && selectedField.type !== 'signature' && selectedField.type !== 'radio' && selectedField.type !== 'checkgroup' && (
                        <div className="prop-row">
                          <div className="prop-label">Border Style</div>
                          <div style={{ display:'flex', gap:5 }}>
                            {(['box','dash','underline'] as const).map(bs => (
                              <button key={bs} onClick={() => updateField(selectedField.id, { borderStyle: bs })}
                                style={{ flex:1, padding:'5px 0', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer',
                                  border: selectedField.borderStyle === bs ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                                  background: selectedField.borderStyle === bs ? '#f0f0ff' : '#fff',
                                  color: selectedField.borderStyle === bs ? '#6366f1' : 'rgba(0,0,0,.5)' }}>
                                {bs === 'box' ? '▭ Box' : bs === 'dash' ? '╌ Dash' : '_ Line'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedField.type === 'signature' && (
                        <>
                          <div className="prop-divider" />
                          <div style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>✍ Signature</div>
                          <div className="prop-row">
                            <div className="prop-label">Prompt Text</div>
                            <input className="prop-input"
                              defaultValue={selectedField.sigPromptText ?? 'Sign here'}
                              placeholder="e.g. Sign here"
                              onChange={e => updateField(selectedField.id, { sigPromptText: e.target.value })} />
                          </div>
                          <div className="prop-row">
                            <div className="prop-label">Line Color &amp; Style</div>
                            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                              <input type="color" value={selectedField.sigLineColor ?? '#374151'}
                                onChange={e => updateField(selectedField.id, { sigLineColor: e.target.value })}
                                style={{ width:28, height:38, border:'1px solid #e0e0e0', borderRadius:5, cursor:'pointer', padding:1 }} />
                              {(['solid','dash'] as const).map(ls => (
                                <button key={ls} onClick={() => updateField(selectedField.id, { sigLineStyle: ls })}
                                  style={{ flex:1, padding:'4px 0', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer',
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
                              <span>Show ✍ &amp; prompt</span>
                            </label>
                          </div>
                        </>
                      )}

                      {(selectedField.type === 'dropdown' || selectedField.type === 'radio' || selectedField.type === 'checkgroup') && (
                        <>
                          <div className="prop-divider" />
                          {(selectedField.type === 'radio' || selectedField.type === 'checkgroup') && (
                            <div className="prop-row">
                              <div className="prop-label">Layout</div>
                              <div style={{ display:'flex', gap:5 }}>
                                {(['vertical','horizontal'] as const).map(lay => (
                                  <button key={lay} onClick={() => updateField(selectedField.id, { radioLayout: lay })}
                                    style={{ flex:1, padding:'5px 0', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer',
                                      border: (selectedField.radioLayout ?? 'vertical') === lay ? '1.5px solid #6366f1' : '1.5px solid #e0e0e0',
                                      background: (selectedField.radioLayout ?? 'vertical') === lay ? '#f0f0ff' : '#fff',
                                      color: (selectedField.radioLayout ?? 'vertical') === lay ? '#6366f1' : 'rgba(0,0,0,.5)' }}>
                                    {lay === 'vertical' ? '↕ V' : '↔ H'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="prop-row">
                            <div className="prop-label">Options font size</div>
                            <input type="number" min={6} max={36} value={selectedField.optionFontSize ?? 9}
                              onChange={e => updateField(selectedField.id, { optionFontSize: Number(e.target.value) })}
                              className="prop-input" style={{ width:'100%' }} />
                          </div>
                          <div className="prop-label">Options</div>
                          {selectedField.options.map((opt, i) => (
                            <div key={i} className="option-row">
                              <span style={{ fontSize:10, color:'rgba(0,0,0,.3)', flexShrink:0, marginRight:2 }}>
                                {selectedField.type === 'radio' ? '◉' : selectedField.type === 'checkgroup' ? '☑' : `${i+1}.`}
                              </span>
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
                  ) : null}
                </div>
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
              <span className="tb-label">Insert</span>
              <button className="tb-btn" onClick={() => addDocElement('static-text')}>
                <span style={{ fontSize:11 }}>T</span>Text
              </button>
              <div style={{ position:'relative' }} ref={tablePickerRef}>
                <button className="tb-btn" onClick={() => { setTablePickerOpen(o => !o); setTableHover([0,0]) }}>
                  <span style={{ fontSize:11 }}>⊞</span>Table
                </button>
                {tablePickerOpen && (
                  <div style={{
                    position:'absolute', top:'100%', left:0, zIndex:9999,
                    background:'#fff', border:'1px solid #e0e0e0', borderRadius:10,
                    boxShadow:'0 8px 28px rgba(0,0,0,.13)', padding:'10px',
                    userSelect:'none',
                  }}>
                    <div style={{ fontSize:11, color:'#555', marginBottom:6, textAlign:'center', fontWeight:600 }}>
                      {tableHover[0] > 0 && tableHover[1] > 0
                        ? `${tableHover[0]} × ${tableHover[1]} table`
                        : 'Hover to select size'}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(8,18px)', gap:2 }}>
                      {Array.from({ length: 8 * 8 }, (_, i) => {
                        const r = Math.floor(i / 8) + 1
                        const c = (i % 8) + 1
                        const active = r <= tableHover[0] && c <= tableHover[1]
                        return (
                          <div
                            key={i}
                            onMouseEnter={() => setTableHover([r, c])}
                            onClick={() => addTableWithSize(tableHover[0], tableHover[1])}
                            style={{
                              width:18, height:18, borderRadius:3, cursor:'pointer',
                              background: active ? '#3b82f6' : '#f3f4f6',
                              border: `1px solid ${active ? '#2563eb' : '#d1d5db'}`,
                              transition:'background .08s',
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              <button className="tb-btn" onClick={() => addDocElement('image')}>
                <span style={{ fontSize:11 }}>🖼</span>Image
              </button>
              <div className="tb-div" />
              <button className="tb-btn" onClick={() => { const p=Math.max(0,curPage-1); setCurPage(p); scrollToPage(p) }} disabled={curPage===0}>←</button>
              <span style={{ fontSize:11, color:'rgba(0,0,0,.4)', padding:'0 4px', whiteSpace:'nowrap' }}>{curPage+1} / {totalPages}</span>
              <button className="tb-btn" onClick={() => { const p=Math.min(totalPages-1,curPage+1); setCurPage(p); scrollToPage(p) }} disabled={curPage===totalPages-1}>→</button>
              <div className="tb-div" />
              <span className="tb-label">Zoom</span>
              <button className="tb-btn" onClick={zoomOut} disabled={zoom <= 0.25} title="Zoom out">−</button>
              <button
                style={{ minWidth:52, padding:'4px 6px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer',
                  border:'1px solid #e0e0e0', background:'#fff', color:'#1d1d1f', textAlign:'center' }}
                onClick={() => setZoom(1.0)}
                title="Reset zoom"
              >{Math.round(zoom * 100)}%</button>
              <button className="tb-btn" onClick={zoomIn} disabled={zoom >= 3.0} title="Zoom in">+</button>
              <div className="tb-div" />
              <button className="tb-btn danger" onClick={() => { setFields(f=>f.filter(x=>x.page!==curPage)); setSelectedId(null) }} disabled={curFields.length===0}>✕ Page</button>
              <button className="tb-btn danger" onClick={() => { setFields([]); setSelectedId(null) }} disabled={fields.length===0}>✕ All</button>
              <div className="tb-div" />
              <button
                onClick={() => setChatOpen(o => !o)}
                style={{
                  display:'flex', alignItems:'center', gap:5, padding:'5px 12px',
                  borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                  background: chatOpen ? '#7c3aed' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                  color:'#fff', boxShadow:'0 2px 8px rgba(124,58,237,.35)', whiteSpace:'nowrap',
                }}
              >✨ AI Builder</button>
            </div>

            <div className="canvas-area" ref={canvasAreaRef}>
              {Array.from({ length: totalPages }, (_, pageIdx) => {
                const cv         = pageCanvasRefs.current[pageIdx]
                const pageFields = fields.filter(f => f.page === pageIdx)
                const pageDocs   = docElements.filter(d => d.page === pageIdx)
                return (
                <div key={pageIdx} ref={el => { pageWrapRefs.current[pageIdx] = el }} className="canvas-wrap mode-select" onMouseDown={onCanvasMouseDown}>
                  <canvas ref={el => { pageCanvasRefs.current[pageIdx] = el }} />
                  {mode === 'blank' && <div className="canvas-guide" />}

                {/* Field overlays */}
                {cv && pageFields.map(f => {
                  const cw  = cv.offsetWidth
                  const ch  = cv.offsetHeight
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
                        width: f.labelPosition === 'left' ? f.w*cw - 70 : f.labelPosition === 'right' ? fieldH : '100%',
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
                        ) : (f.type === 'radio' || f.type === 'checkgroup') ? (
                          <div style={{
                            display:'flex',
                            flexDirection: f.radioLayout === 'horizontal' ? 'row' : 'column',
                            gap: f.radioLayout === 'horizontal' ? 8 : 3,
                            padding:'3px 6px', width:'100%', height:'100%',
                            overflow:'hidden', flexWrap: f.radioLayout === 'horizontal' ? 'wrap' : 'nowrap',
                          }}>
                            {(f.options.length ? f.options : ['Option 1','Option 2','Option 3']).map((opt, i) => {
                              const optFontSize = Math.min(f.optionFontSize ?? 9, f.h * ch * 0.45)
                              return (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0, minWidth:0 }}>
                                  {f.type === 'radio' ? (
                                    <div style={{ width:9, height:9, borderRadius:'50%', border:'1.5px solid #6366f1', flexShrink:0, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                      {i === 0 && <div style={{ width:4, height:4, borderRadius:'50%', background:'#6366f1' }} />}
                                    </div>
                                  ) : (
                                    <div style={{ width:9, height:9, border:'1.5px solid #6366f1', borderRadius:2, flexShrink:0, background: i === 0 ? '#6366f1' : '#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                      {i === 0 && <span style={{ color:'#fff', fontSize:7, lineHeight:1 }}>✓</span>}
                                    </div>
                                  )}
                                  <span style={{ fontSize: optFontSize, color:'#1d1d1f', lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{opt}</span>
                                </div>
                              )
                            })}
                          </div>
                        ) : f.type !== 'checkbox' ? (
                          <span style={{
                            fontSize: Math.min(f.type === 'dropdown' ? (f.optionFontSize ?? 9) : (f.fieldFontSize ?? 10), f.h*ch*.48),
                            overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.4,
                            fontFamily: f.fieldFont === 'times' ? '"Times New Roman", Times, serif' : f.fieldFont === 'courier' ? '"Courier New", Courier, monospace' : 'inherit',
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
                      ) : f.labelPosition === 'right' ? (
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          {fieldBox}
                          {labelEl}
                        </div>
                      ) : (
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ width:64, textAlign:'right' }}>{labelEl}</div>
                          {fieldBox}
                        </div>
                      )}
                    </div>
                  )
                })}
                {/* Doc element overlays (static text / table / image) */}
                {cv && pageDocs.map(de => {
                  const cw = cv.offsetWidth
                  const ch = cv.offsetHeight
                  const sel = selectedId === de.id
                  const dw = de.w * cw, dh = de.h * ch
                  return (
                    <div key={de.id} style={{
                      position:'absolute', left: de.x * cw, top: de.y * ch,
                      width: dw, height: dh,
                      border: sel ? '2px solid #f59e0b' : '1.5px dashed #f59e0b',
                      borderRadius: 3, overflow: 'visible', cursor:'move',
                      background: de.type === 'table' ? 'transparent' : 'rgba(255,255,255,.88)',
                      boxShadow: sel ? '0 0 0 1px #f59e0b, 0 2px 10px rgba(245,158,11,.2)' : undefined,
                    }}
                      onMouseDown={e => onDocMouseDown(e, de.id)}
                    >
                      {de.type === 'static-text' && (() => {
                        const isEditingText = editingTextId === de.id
                        const textStyle = {
                          fontSize: Math.min(de.textSize ?? 12, dh * 0.5),
                          fontFamily: de.textFont === 'times' ? '"Times New Roman",serif' : de.textFont === 'courier' ? '"Courier New",monospace' : 'inherit',
                          fontWeight: de.textBold ? 700 : 400,
                          fontStyle: de.textItalic ? 'italic' : 'normal',
                          color: de.textColor ?? '#111111',
                          textAlign: de.textAlign ?? 'left' as const,
                          lineHeight: 1.5,
                        }
                        return isEditingText ? (
                          <textarea
                            autoFocus
                            defaultValue={de.text}
                            style={{
                              width:'100%', height:'100%', border:'none', resize:'none',
                              outline:'2px solid #3b82f6', background:'#eff6ff',
                              padding:'5px 7px', boxSizing:'border-box',
                              ...textStyle, whiteSpace:'pre-wrap', wordBreak:'break-word',
                            }}
                            onMouseDown={e => e.stopPropagation()}
                            onChange={e => updateDocElement(de.id, { text: e.target.value })}
                            onBlur={() => setEditingTextId(null)}
                            onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); setEditingTextId(null) } }}
                          />
                        ) : (
                          <div
                            style={{
                              width:'100%', height:'100%', padding:'5px 7px', overflow:'hidden',
                              ...textStyle, whiteSpace:'pre-wrap', wordBreak:'break-word',
                              cursor: sel ? 'text' : 'move', userSelect:'none',
                            }}
                            onClick={() => { if (sel) setEditingTextId(de.id) }}
                          >
                            {de.text || <span style={{ color:'rgba(0,0,0,.3)', fontStyle:'italic' }}>Click to edit text…</span>}
                          </div>
                        )
                      })()}
                      {de.type === 'table' && (() => {
                        const rows = de.rows ?? 3, cols = de.cols ?? 3
                        const cws  = de.colWidths  ?? equalArr(cols)
                        const rhs  = de.rowHeights ?? equalArr(rows)
                        // Cumulative % positions for dividers
                        const cumCW = cws.reduce<number[]>((acc,w) => [...acc, (acc[acc.length-1]??0)+w*100], [])
                        const cumRH = rhs.reduce<number[]>((acc,h) => [...acc, (acc[acc.length-1]??0)+h*100], [])
                        return (
                          <>
                            <table style={{ width:'100%', height:'100%', borderCollapse:'collapse', tableLayout:'fixed', pointerEvents: sel ? 'auto' : 'none' }}>
                              <colgroup>
                                {cws.map((w, c) => <col key={c} style={{ width:`${w*100}%` }} />)}
                              </colgroup>
                              <tbody>
                                {Array.from({ length: rows }).map((_, r) => (
                                  <tr key={r} style={{
                                    height:`${rhs[r]*100}%`,
                                    background: de.tableHasHeader && r === 0 ? (de.tableBgHeader ?? '#e5e7eb') : '#fff',
                                  }}>
                                    {Array.from({ length: cols }).map((_, c) => {
                                      const isEditing = editingCell?.docId === de.id && editingCell.row === r && editingCell.col === c
                                      const cellIdx = r * cols + c
                                      const cellVal = de.cellData?.[cellIdx] ?? ''
                                      return (
                                        <td key={c}
                                          style={{
                                            border: `1px solid ${de.tableBorderColor ?? '#374151'}`,
                                            fontSize: Math.min(10, dh * (rhs[r] ?? 1/rows) * 0.5),
                                            fontWeight: de.tableHasHeader && r === 0 ? 700 : 400,
                                            padding: isEditing ? 0 : '2px 4px',
                                            overflow:'hidden', whiteSpace:'nowrap', color:'#1d1d1f',
                                            cursor: sel ? 'text' : 'move',
                                            userSelect:'none',
                                            position:'relative',
                                          }}
                                          onContextMenu={e => {
                                            e.preventDefault(); e.stopPropagation()
                                            setTableCtxMenu({ docId: de.id, row: r, col: c, mx: e.clientX, my: e.clientY })
                                          }}
                                          onDoubleClick={e => {
                                            if (!sel) return
                                            e.stopPropagation()
                                            setEditingCell({ docId: de.id, row: r, col: c })
                                          }}
                                        >
                                          {isEditing ? (
                                            <input
                                              autoFocus
                                              defaultValue={cellVal}
                                              style={{
                                                width:'100%', height:'100%', border:'none', outline:'2px solid #3b82f6',
                                                background:'#eff6ff', padding:'2px 4px', boxSizing:'border-box',
                                                fontSize:'inherit', fontWeight:'inherit', fontFamily:'inherit', color:'#1d1d1f',
                                              }}
                                              onMouseDown={e => e.stopPropagation()}
                                              onChange={e => {
                                                const newData = [...(de.cellData ?? [])]
                                                newData[cellIdx] = e.target.value
                                                updateDocElement(de.id, { cellData: newData })
                                              }}
                                              onBlur={() => setEditingCell(null)}
                                              onKeyDown={e => {
                                                if (e.key === 'Enter' || e.key === 'Escape') {
                                                  e.preventDefault()
                                                  setEditingCell(null)
                                                }
                                                if (e.key === 'Tab') {
                                                  e.preventDefault()
                                                  const next = e.shiftKey
                                                    ? (c > 0 ? { docId: de.id, row: r, col: c - 1 } : r > 0 ? { docId: de.id, row: r - 1, col: cols - 1 } : null)
                                                    : (c < cols - 1 ? { docId: de.id, row: r, col: c + 1 } : r < rows - 1 ? { docId: de.id, row: r + 1, col: 0 } : null)
                                                  setEditingCell(next)
                                                }
                                              }}
                                            />
                                          ) : cellVal}
                                        </td>
                                      )
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Drag-resize dividers — visible only when selected */}
                            {sel && (
                              <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:6 }}>
                                {/* Column dividers */}
                                {cumCW.slice(0, cols-1).map((pct, c) => (
                                  <div key={`cd-${c}`} style={{
                                    position:'absolute', top:0, bottom:0,
                                    left:`${pct}%`, width:8, marginLeft:-4,
                                    cursor:'col-resize', pointerEvents:'auto',
                                    display:'flex', alignItems:'stretch', justifyContent:'center',
                                  }}
                                    onMouseDown={e => {
                                      e.stopPropagation(); e.preventDefault()
                                      tableResizeRef.current = {
                                        docId: de.id, axis:'col', idx: c,
                                        startX: e.clientX, startY: e.clientY,
                                        startFracs: [...cws], totalPx: dw,
                                      }
                                    }}
                                  >
                                    <div style={{ width:2, background:'rgba(99,102,241,.5)', margin:'4px 0', borderRadius:1 }} />
                                  </div>
                                ))}
                                {/* Row dividers */}
                                {cumRH.slice(0, rows-1).map((pct, r) => (
                                  <div key={`rd-${r}`} style={{
                                    position:'absolute', left:0, right:0,
                                    top:`${pct}%`, height:8, marginTop:-4,
                                    cursor:'row-resize', pointerEvents:'auto',
                                    display:'flex', flexDirection:'column', alignItems:'stretch', justifyContent:'center',
                                  }}
                                    onMouseDown={e => {
                                      e.stopPropagation(); e.preventDefault()
                                      tableResizeRef.current = {
                                        docId: de.id, axis:'row', idx: r,
                                        startX: e.clientX, startY: e.clientY,
                                        startFracs: [...rhs], totalPx: dh,
                                      }
                                    }}
                                  >
                                    <div style={{ height:2, background:'rgba(99,102,241,.5)', margin:'0 4px', borderRadius:1 }} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )
                      })()}
                      {de.type === 'image' && (
                        de.imageData
                          ? <img src={de.imageData} alt={de.imageName} style={{ width:'100%', height:'100%', objectFit:'contain', display:'block', pointerEvents:'none' }} />
                          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(0,0,0,.3)', fontSize:12, fontStyle:'italic' }}>Click 🖼 Image to upload</div>
                      )}
                      {/* Delete button */}
                      {sel && (
                        <button style={{
                          position:'absolute', top:-11, right:-11, width:22, height:38,
                          borderRadius:'50%', background:'#E24B4A', border:'2px solid #fff',
                          color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer',
                          display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, lineHeight:1,
                          boxShadow:'0 2px 6px rgba(0,0,0,.25)',
                        }}
                          onClick={e => { e.stopPropagation(); deleteDocElement(de.id) }}>×</button>
                      )}
                      {/* Resize handle */}
                      {sel && (
                        <div className="resize-se" onMouseDown={e => { e.stopPropagation(); onDocResizeMouseDown(e, de.id) }} />
                      )}
                    </div>
                  )
                })}
                </div>
                )
              })}
            </div>

            <div className="hint-strip">
              🖱️ Click a field button above to add it · Drag to move · ◼ corner to resize · Ctrl+Scroll or Pinch to zoom
            </div>

            <input ref={imageFileRef} type="file" accept="image/jpeg,image/png,image/jpg" style={{ display:'none' }} onChange={onImageFileSelected} />

            <div className="apply-bar">
              {error && <div className="error-box" style={{ width:'100%' }}>{error}</div>}
              <button className="apply-btn" onClick={onDownload} disabled={applying || (fields.length===0 && docElements.length===0)}>
                {applying ? '⏳ Generating…' : `⬇ Download PDF (${fields.length} field${fields.length!==1?'s':''} · ${docElements.length} element${docElements.length!==1?'s':''})`}
              </button>
              <button className="new-file-btn" onClick={reset}>← Back</button>
            </div>
          </div>

          {/* Right panel — AI Builder only, shown when chatOpen */}
          {chatOpen && (
          <div className="props-panel">
            <div style={{ padding:'11px 13px', borderBottom:'1px solid #e8e8e8', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>✨ AI Builder</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', marginTop:1 }}>Describe your form and I'll build it</div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background:'rgba(255,255,255,.2)', border:'none', borderRadius:6, color:'#fff', cursor:'pointer', width:26, height:38, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>×</button>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'12px 14px 8px', display:'flex', flexDirection:'column', gap:10 }}>
                {chatHistory.length === 0 && (
                  <div style={{ textAlign:'center', padding:'24px 12px', color:'#9ca3af' }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>✨</div>
                    <div style={{ fontWeight:600, color:'#6b7280', marginBottom:5 }}>Build with AI</div>
                    <div style={{ fontSize:11, lineHeight:1.6 }}>
                      Try: &quot;Create a job application form&quot;<br/>
                      or &quot;Add a contact form with name, email&quot;
                    </div>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{
                    display:'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap:7, alignItems:'flex-end',
                  }}>
                    <div style={{
                      width:24, height:24, borderRadius:'50%', flexShrink:0,
                      background: msg.role === 'user' ? '#4f46e5' : '#f3f4f6',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:11,
                    }}>
                      {msg.role === 'user' ? '👤' : '✨'}
                    </div>
                    <div style={{
                      maxWidth:'82%', padding:'7px 10px', borderRadius: msg.role === 'user' ? '12px 3px 12px 12px' : '3px 12px 12px 12px',
                      background: msg.role === 'user' ? '#4f46e5' : '#f9fafb',
                      color: msg.role === 'user' ? '#fff' : '#111827',
                      fontSize:11, lineHeight:1.55, border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none',
                      whiteSpace:'pre-wrap', wordBreak:'break-word',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display:'flex', gap:7, alignItems:'flex-end' }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>✨</div>
                    <div style={{ padding:'8px 11px', borderRadius:'3px 12px 12px 12px', background:'#f9fafb', border:'1px solid #e5e7eb', display:'flex', gap:4 }}>
                      {[0,1,2].map(d => (
                        <div key={d} style={{
                          width:5, height:5, borderRadius:'50%', background:'#9ca3af',
                          animation:'bounce 1.2s ease-in-out infinite', animationDelay:`${d*0.2}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {chatHistory.length === 0 && (
                <div style={{ padding:'0 12px 8px', display:'flex', flexWrap:'wrap', gap:5 }}>
                  {['Job application','Contact form','Survey','Invoice','Registration'].map(s => (
                    <button key={s} onClick={() => { setChatInput(s); chatInputRef.current?.focus() }} style={{
                      padding:'4px 8px', borderRadius:20, border:'1px solid #e5e7eb',
                      background:'#f9fafb', color:'#4f46e5', fontSize:10, cursor:'pointer',
                      fontWeight:600, whiteSpace:'nowrap',
                    }}>{s}</button>
                  ))}
                </div>
              )}
              <div style={{ padding:'8px 12px 12px', borderTop:'1px solid #e5e7eb', display:'flex', gap:6, alignItems:'flex-end' }}>
                <textarea
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                  placeholder="Describe the form you need…"
                  rows={2}
                  style={{
                    flex:1, resize:'none', border:'1.5px solid #e5e7eb', borderRadius:10,
                    padding:'7px 9px', fontSize:12, outline:'none', lineHeight:1.45,
                    fontFamily:'inherit', transition:'border-color .15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  disabled={chatLoading}
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  style={{
                    width:34, height:34, borderRadius:9, border:'none', cursor:'pointer',
                    background: chatInput.trim() && !chatLoading ? '#7c3aed' : '#e5e7eb',
                    color: chatInput.trim() && !chatLoading ? '#fff' : '#9ca3af',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:15,
                    transition:'background .15s', flexShrink:0,
                  }}
                >➤</button>
              </div>
              <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
          </div>
          )}
        </div>
      </div>

      {/* ── Table context menu ───────────────────────────────────────────── */}
      {tableCtxMenu && (() => {
        const de = docElements.find(d => d.id === tableCtxMenu.docId)
        if (!de) return null
        const { row, col, mx, my } = tableCtxMenu
        const run = (patch: Partial<DocElement> | null) => {
          if (patch) updateDocElement(de.id, patch)
          setTableCtxMenu(null)
        }
        const menuItems: ({ label: string; action: () => void; danger?: boolean } | null)[] = [
          { label: '↑ Insert Row Above',   action: () => run(tblInsertRow(de, row)) },
          { label: '↓ Insert Row Below',   action: () => run(tblInsertRow(de, row + 1)) },
          null,
          { label: '← Insert Col Left',    action: () => run(tblInsertCol(de, col)) },
          { label: '→ Insert Col Right',   action: () => run(tblInsertCol(de, col + 1)) },
          null,
          { label: '✕ Delete Row',  danger: true, action: () => run(tblDeleteRow(de, row)) },
          { label: '✕ Delete Col',  danger: true, action: () => run(tblDeleteCol(de, col)) },
        ]
        return (
          <div
            ref={ctxMenuRef}
            style={{
              position:'fixed', left: mx + 2, top: my + 2, zIndex:9999,
              background:'#fff', border:'1px solid #e0e0e0', borderRadius:9,
              boxShadow:'0 6px 24px rgba(0,0,0,.14)', padding:'4px 0', minWidth:190,
            }}
          >
            {menuItems.map((item, i) => item === null
              ? <div key={i} style={{ height:1, background:'#e8e8e8', margin:'3px 8px' }} />
              : (
                <button key={i} onClick={item.action}
                  style={{
                    display:'block', width:'100%', padding:'7px 14px', border:'none', background:'transparent',
                    textAlign:'left', fontSize:12, fontWeight:500, cursor:'pointer',
                    color: item.danger ? '#E24B4A' : '#1d1d1f',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = item.danger ? 'rgba(226,75,74,.07)' : '#f5f5f7')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >{item.label}</button>
              )
            )}
          </div>
        )
      })()}
      <ToolSEOSection {...toolSeoData['pdf-form-builder']} />
    </>
  )
}
