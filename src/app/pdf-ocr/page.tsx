'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

type PageStatus = 'idle' | 'processing' | 'done' | 'error' | 'native'

interface PageItem {
  num:       number        // 1-indexed
  thumb:     string        // small dataUrl
  status:    PageStatus
  text:      string
  error?:    string
  isNative?: boolean       // text came from PDF.js, not OCR
}

type LangOpt = 'auto' | 'English' | 'French' | 'German' | 'Spanish' | 'Arabic' | 'Chinese' | 'Japanese'

interface EditItem {
  idx: number
  str: string
  x:   number   // canvas px left
  y:   number   // canvas px top (above baseline)
  w:   number   // canvas px width
  fs:  number   // font size in canvas px
}

const LANGS: LangOpt[] = ['auto','English','French','German','Spanish','Arabic','Chinese','Japanese']

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

/* Nav */
.nav{height:52px;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0;z-index:100}
.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#0891b2}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s;white-space:nowrap}
.nbtn.pri{background:#0891b2;color:#fff}.nbtn.pri:hover{background:#0e7490}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn.grn{background:#16a34a;color:#fff}.nbtn.grn:hover{background:#15803d}
.nbtn:disabled{opacity:.38;cursor:not-allowed}

/* Progress bar */
.prog-bar{height:3px;background:#e8e8ea;position:relative;flex-shrink:0}
.prog-fill{height:100%;background:linear-gradient(90deg,#0891b2,#06b6d4);border-radius:0 2px 2px 0;transition:width .4s ease}

/* Body */
.body{flex:1;display:flex;overflow:hidden}

/* Left sidebar */
.sidebar{width:200px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden}
.sb-head{padding:10px 12px;border-bottom:1px solid #f0f0f0;flex-shrink:0}
.sb-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em}
.sb-count{font-size:11px;color:rgba(0,0,0,.55);margin-top:1px;font-weight:600}
.sb-pages{flex:1;overflow-y:auto;padding:8px}
.page-chip{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;cursor:pointer;border:1.5px solid transparent;transition:all .13s;margin-bottom:4px;background:#fff}
.page-chip:hover{background:#f5f5f7}
.page-chip.sel{border-color:#0891b2;background:#ecfeff}
.page-chip.sel .pc-num{color:#0891b2}
.pc-thumb{width:36px;height:48px;border-radius:4px;object-fit:cover;flex-shrink:0;background:#f0f0f0;border:1px solid #e8e8e8}
.pc-info{flex:1;min-width:0}
.pc-num{font-size:10px;font-weight:700;color:rgba(0,0,0,.5)}
.pc-status{font-size:9px;font-weight:600;margin-top:2px}
.pc-status.idle{color:rgba(0,0,0,.28)}
.pc-status.processing{color:#0891b2;animation:pulse .9s infinite}
.pc-status.done{color:#16a34a}
.pc-status.native{color:#7c3aed}
.pc-status.error{color:#E24B4A}
.pc-icon{font-size:12px;flex-shrink:0}

/* Settings panel */
.settings{width:220px;flex-shrink:0;background:#fff;border-left:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.st-sec{padding:12px 14px;border-bottom:1px solid #f0f0f0}
.st-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.st-hint{font-size:9px;color:rgba(0,0,0,.3);margin-top:5px;line-height:1.5}
.seg{display:flex;border:1.5px solid #e0e0e0;border-radius:8px;overflow:hidden}
.seg-btn{flex:1;padding:6px 4px;font-size:10px;font-weight:700;border:none;background:#fff;cursor:pointer;color:rgba(0,0,0,.4);transition:all .12s;text-align:center}
.seg-btn.sel{background:#0891b2;color:#fff}
.seg-btn:not(.sel):hover{background:#ecfeff;color:#0e7490}
.lang-sel{width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:11px;font-weight:600;color:#1d1d1f;background:#fff;outline:none;cursor:pointer}
.lang-sel:focus{border-color:#0891b2}
.tog-row{display:flex;align-items:center;justify-content:space-between}
.tog-lbl{font-size:11px;color:rgba(0,0,0,.55)}
.tog{width:30px;height:17px;border-radius:8px;border:none;cursor:pointer;position:relative;transition:background .14s;flex-shrink:0}
.tog.on{background:#0891b2}.tog.off{background:#d0d0d0}
.tok{position:absolute;top:2px;width:13px;height:13px;border-radius:50%;background:#fff;transition:left .14s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tog.on .tok{left:15px}.tog.off .tok{left:2px}
.ocr-btn{width:100%;padding:12px;border-radius:9px;border:none;background:linear-gradient(135deg,#0891b2,#0e7490);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(8,145,178,.35)}
.ocr-btn:hover:not(:disabled){background:linear-gradient(135deg,#0e7490,#155e75);transform:translateY(-1px)}
.ocr-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}

/* Main result area */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.main-top{display:flex;align-items:center;padding:10px 16px;background:#fff;border-bottom:1px solid #f0f0f0;gap:10px;flex-shrink:0}
.page-label{font-size:13px;font-weight:700;color:#1d1d1f}
.page-nav{display:flex;gap:4px}
.pn-btn{width:26px;height:26px;border-radius:6px;border:1px solid #e0e0e0;background:#fff;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.5);transition:all .12s}
.pn-btn:hover:not(:disabled){border-color:#0891b2;color:#0891b2}
.pn-btn:disabled{opacity:.25;cursor:not-allowed}

/* Split view */
.split{flex:1;display:flex;overflow:hidden;gap:0}
.preview-pane{width:45%;border-right:1px solid #e8e8e8;overflow:auto;background:#e8e8ea;display:flex;align-items:flex-start;justify-content:center;padding:16px}
.page-wrap{position:relative;display:inline-block;box-shadow:0 4px 24px rgba(0,0,0,.18);border-radius:2px;line-height:0}
.page-wrap canvas{display:block;max-width:100%}

/* PDF.js text selection layer */
.textLayer{position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;line-height:1;z-index:2}
.textLayer span{pointer-events:auto;user-select:text;-webkit-user-select:text;cursor:text}
.textLayer ::selection{background:rgba(37,99,235,.25);color:transparent}
.textLayer ::-moz-selection{background:rgba(37,99,235,.25);color:transparent}

/* Edit mode */
.edit-overlay{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.edit-token{
  position:absolute;pointer-events:all;cursor:text;
  border:1.5px solid transparent;border-radius:2px;
  outline:none;padding:0 1px;margin:0;
  color:transparent;background:transparent;
  font-family:Arial,Helvetica,sans-serif;
  box-sizing:border-box;line-height:1;white-space:nowrap;
  transition:border-color .1s,background .1s}
.edit-token:hover{border-color:rgba(8,145,178,.45);background:rgba(8,145,178,.06)}
.edit-token.is-edited{border-color:rgba(234,88,12,.55);background:rgba(255,237,213,.55)}
.edit-token:focus{
  color:#111 !important;background:rgba(255,253,170,.97) !important;
  border-color:#0891b2 !important;z-index:20;
  box-shadow:0 2px 10px rgba(8,145,178,.22)}
.edit-bar{background:#0891b2;color:#fff;padding:7px 16px;font-size:11px;font-weight:700;
  display:flex;align-items:center;gap:12px;flex-shrink:0}
.edit-bar-hint{opacity:.75;font-weight:500}
.text-pane{flex:1;display:flex;flex-direction:column;overflow:hidden}
.text-pane-head{padding:8px 14px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:8px;flex-shrink:0}
.tp-lbl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;flex:1}
.tp-badge{padding:2px 7px;border-radius:99px;font-size:9px;font-weight:700}
.tp-badge.native{background:#f0f0ff;color:#7c3aed;border:1px solid rgba(124,58,237,.2)}
.tp-badge.ocr{background:#ecfeff;color:#0e7490;border:1px solid rgba(8,145,178,.2)}
.tp-badge.processing{background:#fffbeb;color:#d97706;border:1px solid rgba(245,158,11,.2)}
.text-area{flex:1;padding:14px;font-family:'JetBrains Mono',Menlo,Monaco,monospace;font-size:12.5px;line-height:1.75;border:none;outline:none;resize:none;background:#fff;color:#1d1d1f;overflow-y:auto}
.text-area::placeholder{color:rgba(0,0,0,.2);font-style:italic}
.text-area.processing{background:#fafafa;color:rgba(0,0,0,.5)}

/* Processing overlay on text pane */
.proc-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(255,255,255,.9);backdrop-filter:blur(4px)}
.proc-spinner{width:40px;height:40px;border:4px solid #e8e8ea;border-top-color:#0891b2;border-radius:50%;animation:spin .8s linear infinite}
.proc-lbl{font-size:13px;font-weight:700;color:#0891b2}
.proc-sub{font-size:11px;color:rgba(0,0,0,.35)}

/* Empty states */
.empty-main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center;gap:12px;color:rgba(0,0,0,.3)}
.empty-icon{font-size:44px;margin-bottom:6px;opacity:.5}
.empty-ttl{font-size:15px;font-weight:700;color:rgba(0,0,0,.4)}
.empty-sub{font-size:12px;line-height:1.6;max-width:280px}

/* Upload landing */
.lp{min-height:100vh;display:flex;flex-direction:column;background:#fff}
.lp-uc{max-width:680px;margin:0 auto;padding:56px 24px;width:100%}
.drop-z{border:2px dashed #d0d0d0;border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.drop-z:hover,.drop-z.over{border-color:#0891b2;background:#ecfeff}
.drop-btn{display:inline-flex;align-items:center;gap:6px;padding:11px 24px;background:#1d1d1f;border-radius:9px;font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;margin-top:14px;transition:background .13s}
.drop-btn:hover{background:#0891b2}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}
.feat{padding:14px 12px;border:1px solid #e8e8e8;border-radius:12px;text-align:center}
.feat-icon{font-size:22px;margin-bottom:5px}
.feat-ttl{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.feat-body{font-size:10px;color:rgba(0,0,0,.38);line-height:1.5}
`

function fmtBytes(n: number) {
  return n < 1024*1024 ? `${(n/1024).toFixed(0)} KB` : `${(n/1024/1024).toFixed(1)} MB`
}

export default function PDFOCRPage() {
  const [pdfFile,    setPdfFile]    = useState<File | null>(null)
  const [pages,      setPages]      = useState<PageItem[]>([])
  const [selPage,    setSelPage]    = useState(1)
  const [loading,    setLoading]    = useState(false)
  const [isRunning,  setIsRunning]  = useState(false)
  const [language,   setLanguage]   = useState<LangOpt>('auto')
  const [useNative,  setUseNative]  = useState(true)
  const [copied,     setCopied]     = useState(false)
  const [exporting,  setExporting]  = useState(false)
  const [editMode,   setEditMode]   = useState(false)
  const [pdfUrl,     setPdfUrl]     = useState<string | null>(null)
  const [editItems,  setEditItems]  = useState<EditItem[]>([])
  const [pageEdits,  setPageEdits]  = useState<Record<number, Record<number,string>>>({})

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const dropLpRef      = useRef<HTMLDivElement>(null)
  const pdfDocRef      = useRef<any>(null)
  const previewCanvRef = useRef<HTMLCanvasElement>(null)
  const textLayerRef   = useRef<HTMLDivElement>(null)
  const abortRef       = useRef(false)

  const totalPages   = pages.length
  const doneCount    = pages.filter(p => p.status === 'done' || p.status === 'native').length
  const progress     = totalPages > 0 ? doneCount / totalPages : 0
  const selPageItem  = pages.find(p => p.num === selPage)

  // ── Load PDF ──────────────────────────────────────────────────────────────
  const loadFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') return
    // Create blob URL for native iframe view (enables text selection)
    setPdfUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file) })
    setPdfFile(file); setPages([]); setSelPage(1); setLoading(true); setEditMode(false)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise
      pdfDocRef.current = pdf
      const n = pdf.numPages
      const items: PageItem[] = []
      for (let i = 1; i <= n; i++) {
        const pg = await pdf.getPage(i)
        const vp = pg.getViewport({ scale: 0.2 })
        const cv = document.createElement('canvas')
        cv.width = vp.width; cv.height = vp.height
        await pg.render({ canvasContext: cv.getContext('2d')!, viewport: vp }).promise
        items.push({ num: i, thumb: cv.toDataURL('image/jpeg', 0.6), status: 'idle', text: '' })
      }
      setPages(items)
      setSelPage(1)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  // ── Landing drop zone ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = dropLpRef.current; if (!el) return
    const ov = (e: DragEvent) => { e.preventDefault(); el.classList.add('over') }
    const lv = () => el.classList.remove('over')
    const dp = (e: DragEvent) => { e.preventDefault(); el.classList.remove('over'); const f=e.dataTransfer?.files[0]; if(f) loadFile(f) }
    el.addEventListener('dragover', ov); el.addEventListener('dragleave', lv); el.addEventListener('drop', dp)
    return () => { el.removeEventListener('dragover',ov); el.removeEventListener('dragleave',lv); el.removeEventListener('drop',dp) }
  }, [loadFile])

  // ── Render preview canvas when page selection changes ─────────────────────
  const renderTaskRef = useRef<any>(null)
  useEffect(() => {
    if (!pdfDocRef.current || !previewCanvRef.current || !selPageItem) return
    // Cancel any in-progress render before starting a new one
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel()
      renderTaskRef.current = null
    }
    // Clear old text layer
    if (textLayerRef.current) textLayerRef.current.innerHTML = ''

    let alive = true
    ;(async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist')
        const pg  = await pdfDocRef.current.getPage(selPage)
        if (!alive) return

        const scale = 1.4
        const vp    = pg.getViewport({ scale })
        const cv    = previewCanvRef.current!
        cv.width    = vp.width
        cv.height   = vp.height
        const ctx   = cv.getContext('2d')!
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, cv.width, cv.height)
        if (!alive) return

        // Render visual layer
        const task = pg.render({ canvasContext: ctx, viewport: vp })
        renderTaskRef.current = task
        await task.promise
        renderTaskRef.current = null
        if (!alive) return

        // View mode uses iframe — no text layer needed on canvas
      } catch (e: any) {
        if (e?.name !== 'RenderingCancelledException') console.warn(e)
      }
    })()
    return () => {
      alive = false
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }
    }
  }, [selPage, selPageItem, editMode])

  // ── Load positioned text items for edit mode ──────────────────────────────
  const PREVIEW_SCALE = 1.4
  useEffect(() => {
    if (!editMode || !pdfDocRef.current) { setEditItems([]); return }
    let cancelled = false
    ;(async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist')
        const pg  = await pdfDocRef.current.getPage(selPage)
        const vp  = pg.getViewport({ scale: PREVIEW_SCALE })
        const tc  = await pg.getTextContent()
        if (cancelled) return

        const utilTransform = (pdfjsLib as any).Util?.transform
          ?? ((A: number[], B: number[]) => [
              A[0]*B[0]+A[2]*B[1], A[1]*B[0]+A[3]*B[1],
              A[0]*B[2]+A[2]*B[3], A[1]*B[2]+A[3]*B[3],
              A[0]*B[4]+A[2]*B[5]+A[4], A[1]*B[4]+A[3]*B[5]+A[5],
            ])

        const items: EditItem[] = (tc.items as any[])
          .filter(it => typeof it.str === 'string' && it.str.trim().length > 0)
          .map((it, idx) => {
            // Combine viewport matrix with text item matrix for accurate canvas coords
            const m  = utilTransform(vp.transform, it.transform)
            const x  = m[4]
            const by = m[5]                              // baseline Y in canvas
            const fs = Math.hypot(m[0], m[1])           // font size in canvas px
            const w  = (it.width ?? 0) * PREVIEW_SCALE
            return { idx, str: it.str, x, y: by - fs, w: Math.max(w, fs * 0.5), fs: Math.max(fs, 4) }
          })
          .filter(it => it.fs >= 3 && it.fs <= 180)

        setEditItems(items)
      } catch { /* ignore */ }
    })()
    return () => { cancelled = true }
  }, [editMode, selPage])

  // ── Run OCR on a single page ───────────────────────────────────────────────
  const ocrPage = async (pageNum: number): Promise<void> => {
    if (abortRef.current) return

    // 1. Try native text first (fast, no API cost)
    if (useNative) {
      const pg = await pdfDocRef.current.getPage(pageNum)
      const tc = await pg.getTextContent()
      const txt = (tc.items as any[]).map(i => i.str).join(' ').trim()
      if (txt.length > 30) {
        setPages(prev => prev.map(p => p.num !== pageNum ? p : { ...p, status: 'native', text: txt, isNative: true }))
        return
      }
    }

    // 2. Render page for OCR — cap at 1400px wide to stay well under the 10MB body limit
    setPages(prev => prev.map(p => p.num !== pageNum ? p : { ...p, status: 'processing' }))
    try {
      const pg      = await pdfDocRef.current.getPage(pageNum)
      const MAX_PX  = 1400
      const vp1     = pg.getViewport({ scale: 1 })
      const scale   = Math.min(2.0, MAX_PX / vp1.width)
      const vp      = pg.getViewport({ scale })
      const cv      = document.createElement('canvas')
      cv.width      = Math.round(vp.width)
      cv.height     = Math.round(vp.height)
      const ctx     = cv.getContext('2d')!
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, cv.width, cv.height)
      await pg.render({ canvasContext: ctx, viewport: vp }).promise
      const b64 = cv.toDataURL('image/jpeg', 0.85).split(',')[1]

      let res: Response
      try {
        res = await fetch('/api/ocr', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ imageBase64: b64, mimeType: 'image/jpeg', language }),
        })
      } catch (netErr: any) {
        setPages(prev => prev.map(p => p.num !== pageNum ? p : {
          ...p, status: 'error',
          error: `Network error — check that the dev server is running and ANTHROPIC_API_KEY is set. (${netErr.message})`,
        }))
        return
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setPages(prev => prev.map(p => p.num !== pageNum ? p : { ...p, status: 'error', error: j.error ?? `Server error ${res.status}` }))
        return
      }

      // Stream text in
      const reader = res.body!.getReader()
      const dec    = new TextDecoder()
      let acc = ''
      while (true) {
        if (abortRef.current) { reader.cancel(); break }
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream: true })
        setPages(prev => prev.map(p => p.num !== pageNum ? p : { ...p, text: acc }))
      }
      setPages(prev => prev.map(p => p.num !== pageNum ? p : { ...p, status: 'done', text: acc }))
    } catch (e: any) {
      setPages(prev => prev.map(p => p.num !== pageNum ? p : { ...p, status: 'error', error: e.message }))
    }
  }

  // ── Run OCR on all pages sequentially ─────────────────────────────────────
  const runOCR = async () => {
    if (isRunning || !pdfDocRef.current) return
    abortRef.current = false
    setIsRunning(true)
    // Reset all idle/error pages
    setPages(prev => prev.map(p => p.status === 'done' || p.status === 'native' ? p : { ...p, status: 'idle', text: '', error: undefined }))
    for (let i = 1; i <= totalPages; i++) {
      if (abortRef.current) break
      await ocrPage(i)
    }
    abortRef.current = false
    setIsRunning(false)
  }

  const stopOCR = () => { abortRef.current = true }

  // ── Combined text ──────────────────────────────────────────────────────────
  const allText = pages.map(p => `--- Page ${p.num} ---\n${p.text}`).join('\n\n')

  const copyAll = () => {
    navigator.clipboard.writeText(allText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const downloadTxt = () => {
    const blob = new Blob([allText], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href=url
    a.download = (pdfFile?.name ?? 'doc').replace(/\.pdf$/i,'') + '-ocr.txt'
    a.click(); URL.revokeObjectURL(url)
  }

  // ── Update text edit ──────────────────────────────────────────────────────
  const updateText = (num: number, text: string) =>
    setPages(prev => prev.map(p => p.num !== num ? p : { ...p, text }))

  // ── Download searchable PDF: original page image + invisible OCR text layer ─
  const downloadOCRPdf = async () => {
    if (!pdfDocRef.current) return
    setExporting(true)
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
      const newDoc  = await PDFDocument.create()
      const font    = await newDoc.embedFont(StandardFonts.Helvetica)

      for (const item of pages) {
        // 1. Render original page at 2× to canvas (preserves exact layout & fonts visually)
        const origPg = await pdfDocRef.current.getPage(item.num)
        const vp2    = origPg.getViewport({ scale: 2 })
        const cv     = document.createElement('canvas')
        cv.width = vp2.width; cv.height = vp2.height
        const ctx = cv.getContext('2d')!
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, cv.width, cv.height)
        await origPg.render({ canvasContext: ctx, viewport: vp2 }).promise

        // 2. Encode canvas as JPEG
        const blob    = await new Promise<Blob>(res => cv.toBlob(b => res(b!), 'image/jpeg', 0.95))
        let jpgBytes  = new Uint8Array(await blob.arrayBuffer())

        // 3. Get original page dimensions at scale 1
        const vp1    = origPg.getViewport({ scale: 1 })
        const pgW    = vp1.width
        const pgH    = vp1.height

        // 4. Create PDF page, fill with original page image — pixel-perfect layout & fonts
        const newPg  = newDoc.addPage([pgW, pgH])
        const img    = await newDoc.embedJpg(jpgBytes)
        newPg.drawImage(img, { x: 0, y: 0, width: pgW, height: pgH })

        // 5. Apply text edits as pdf-lib vector overlays (white-out + new text on top of image)
        const edits = pageEdits[item.num] ?? {}
        if (Object.keys(edits).length > 0) {
          const editPg = await pdfDocRef.current.getPage(item.num)
          const tc     = await editPg.getTextContent()
          ;(tc.items as any[]).forEach((ti: any, idx: number) => {
            const newStr = edits[idx]
            if (newStr === undefined) return
            const [a, b, , d, e, f] = ti.transform as number[]
            const pdfFs = Math.abs(d) || Math.hypot(a, b) || 10
            const pdfW  = (ti.width ?? pdfFs * ti.str.length * 0.55) + 4
            // White rectangle to erase original glyph pixels
            newPg.drawRectangle({ x: e - 1, y: f - pdfFs * 0.2, width: pdfW + 4, height: pdfFs * 1.35, color: rgb(1,1,1) })
            // New text drawn at the original baseline
            try {
              newPg.drawText(newStr, { x: e, y: f, size: pdfFs, font, color: rgb(0,0,0), maxWidth: pdfW + 40 })
            } catch { /* skip if font can't encode char */ }
          })
        }

        // 6. Place OCR text as invisible white layer so PDF is searchable & copyable
        if (item.text.trim()) {
          const lines = item.text.split('\n').filter(Boolean)
          const lineH = pgH / Math.max(lines.length, 1)
          lines.forEach((line, idx) => {
            const safeText = line.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f-\x9f]/g, '')
            if (!safeText.trim()) return
            try {
              newPg.drawText(safeText, {
                x: 0,
                y: pgH - lineH * (idx + 1),
                size: Math.max(lineH * 0.85, 4),
                font,
                color: rgb(1, 1, 1),   // white — invisible over image
                opacity: 0.01,          // near-zero but present in text layer
                maxWidth: pgW,
              })
            } catch { /* skip malformed lines */ }
          })
        }
      }

      const bytes = await newDoc.save()
      const url   = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }))
      const a     = document.createElement('a')
      a.href      = url
      a.download  = (pdfFile?.name ?? 'doc').replace(/\.pdf$/i, '') + '-searchable.pdf'
      a.click(); URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  const statusIcon = (s: PageStatus) =>
    ({ idle:'○', processing:'◌', done:'✓', native:'✦', error:'!' })[s]

  const statusLabel = (p: PageItem) =>
    p.status === 'idle'       ? 'Waiting'
    : p.status === 'processing' ? 'Scanning…'
    : p.status === 'done'       ? 'OCR done'
    : p.status === 'native'     ? 'Text PDF'
    : `Error`

  // ── Upload landing ─────────────────────────────────────────────────────────
  if (!pdfFile) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="lp">
          <nav className="nav">
            <Link href="/" className="logo">
              <div className="logo-mark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/><polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/></svg></div>
              <span className="logo-name">Edit<em>PDF</em> AI</span>
            </Link>
            <span className="nav-sep">›</span>
            <Link href="/" style={{fontSize:12,color:'rgba(0,0,0,.4)',textDecoration:'none'}}>← Tools</Link>
          </nav>

          <div className="lp-uc">
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',background:'#ecfeff',border:'1px solid rgba(8,145,178,.25)',borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:'.08em',color:'#0e7490',marginBottom:14,textTransform:'uppercase'}}>
                🔍 AI OCR Scanner
              </div>
              <h1 style={{fontSize:'clamp(26px,5vw,44px)',fontWeight:800,letterSpacing:'-.05em',color:'#1d1d1f',marginBottom:10,lineHeight:1.1}}>
                Extract text from<br/><span style={{color:'#0891b2'}}>any PDF</span>
              </h1>
              <p style={{fontSize:14,color:'rgba(0,0,0,.42)',lineHeight:1.7,maxWidth:440,margin:'0 auto'}}>
                Upload a scanned or image-based PDF. Claude AI reads each page and extracts the text — editable, copyable, downloadable.
              </p>
            </div>

            <div ref={dropLpRef} className="drop-z" onClick={() => fileInputRef.current?.click()}>
              <div style={{fontSize:44,marginBottom:12}}>🔍</div>
              <div style={{fontSize:13,color:'rgba(0,0,0,.42)',marginBottom:4,lineHeight:1.6}}>Drop your PDF here, or click to choose</div>
              <div style={{fontSize:11,color:'rgba(0,0,0,.28)'}}>Scanned docs, image PDFs, mixed documents</div>
              <button className="drop-btn" onClick={e=>{e.stopPropagation();fileInputRef.current?.click()}}>Choose PDF</button>
            </div>

            <div className="feat-grid">
              {[
                {icon:'🤖',t:'AI-powered OCR',b:'Claude reads each page image with high accuracy'},
                {icon:'⚡',t:'Native text skip',b:'Text-based pages extracted instantly — no AI cost'},
                {icon:'✏️',t:'Editable results',b:'Correct OCR mistakes before downloading'},
              ].map(f=>(
                <div key={f.t} className="feat">
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-ttl">{f.t}</div>
                  <div className="feat-body">{f.b}</div>
                </div>
              ))}
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="application/pdf" style={{display:'none'}}
            onChange={e=>{const f=e.target.files?.[0];if(f)loadFile(f);e.target.value=''}} />
        </div>
      </>
    )
  }

  // ── Editor ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pg">
        {/* Nav */}
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/><polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/></svg></div>
            <span className="logo-name">Edit<em>PDF</em> AI</span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">OCR Scanner</span>
          <span style={{fontSize:11,color:'rgba(0,0,0,.35)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{pdfFile.name}</span>
          {isRunning && (
            <span style={{fontSize:11,color:'#0891b2',fontWeight:700,display:'flex',alignItems:'center',gap:5}}>
              <span style={{display:'inline-block',width:10,height:10,border:'2px solid #0891b2',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
              {doneCount}/{totalPages} pages
            </span>
          )}
          <div className="nav-sp"/>
          {doneCount > 0 && (
            <>
              <button className={`nbtn sec`} onClick={copyAll}>{copied?'✓ Copied':'⎘ Copy all'}</button>
              <button className="nbtn sec" onClick={downloadTxt}>↓ TXT</button>
              <button className="nbtn grn" onClick={downloadOCRPdf} disabled={exporting}>
                {exporting ? '⏳ Building…' : '↓ Download PDF'}
              </button>
            </>
          )}
          <button className="nbtn sec" onClick={()=>{setPdfFile(null);setPages([]);pdfDocRef.current=null;setPdfUrl(p=>{if(p)URL.revokeObjectURL(p);return null})}}>← New</button>
        </nav>

        {/* Progress bar */}
        {(isRunning || doneCount > 0) && totalPages > 0 && (
          <div className="prog-bar">
            <div className="prog-fill" style={{width:`${progress*100}%`}}/>
          </div>
        )}

        {loading ? (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
            <div style={{width:38,height:38,border:'3px solid #e8e8ea',borderTopColor:'#0891b2',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
            <div style={{fontSize:13,color:'rgba(0,0,0,.4)'}}>Loading PDF…</div>
          </div>
        ) : (
        <div className="body">

          {/* Page list sidebar */}
          <div className="sidebar">
            <div className="sb-head">
              <div className="sb-ttl">Pages</div>
              <div className="sb-count">{totalPages} total · {doneCount} done</div>
            </div>
            <div className="sb-pages">
              {pages.map(p => (
                <div key={p.num} className={`page-chip${selPage===p.num?' sel':''}`} onClick={() => setSelPage(p.num)}>
                  <img className="pc-thumb" src={p.thumb} alt={`p${p.num}`}/>
                  <div className="pc-info">
                    <div className="pc-num">Page {p.num}</div>
                    <div className={`pc-status ${p.status}`}>{statusLabel(p)}</div>
                  </div>
                  <span className="pc-icon">{statusIcon(p.status)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main split view */}
          <div className="main">
            <div className="main-top">
              <span className="page-label">Page {selPage} of {totalPages}</span>
              <div className="page-nav">
                <button className="pn-btn" disabled={selPage<=1} onClick={()=>setSelPage(p=>p-1)}>‹</button>
                <button className="pn-btn" disabled={selPage>=totalPages} onClick={()=>setSelPage(p=>p+1)}>›</button>
              </div>
              <div style={{flex:1}}/>
              {selPageItem?.status === 'idle' && !isRunning && (
                <button className="nbtn pri" style={{fontSize:11}} onClick={()=>{ abortRef.current=false; setIsRunning(true); ocrPage(selPage).finally(()=>setIsRunning(false)) }}>
                  Scan this page
                </button>
              )}
              {/* View / Edit toggle */}
              <div className="seg" style={{width:130}}>
                <button className={`seg-btn${!editMode?' sel':''}`} onClick={()=>setEditMode(false)}>View</button>
                <button className={`seg-btn${editMode?' sel':''}`}  onClick={()=>setEditMode(true)}>✏ Edit</button>
              </div>
            </div>

            {/* Edit mode hint bar */}
            {editMode && (
              <div className="edit-bar">
                <span>✏ Edit mode</span>
                <span className="edit-bar-hint">Click any text box to edit · changes bake into Download PDF</span>
                {Object.keys(pageEdits).length > 0 && (
                  <button onClick={()=>setPageEdits({})}
                    style={{marginLeft:'auto',fontSize:10,fontWeight:700,background:'rgba(255,255,255,.15)',border:'none',color:'#fff',cursor:'pointer',padding:'3px 8px',borderRadius:5}}>
                    Reset all edits
                  </button>
                )}
              </div>
            )}

            <div className="split">
              {/* Preview pane: iframe (view mode) or canvas+inputs (edit mode) */}
              <div className="preview-pane" style={editMode ? {} : {padding:0,background:'#fff'}}>
                {!editMode ? (
                  /* Native iframe — browser PDF renderer gives free text selection & copy */
                  pdfUrl && (
                    <iframe
                      key={pdfUrl}
                      src={`${pdfUrl}#page=${selPage}`}
                      style={{width:'100%',height:'100%',border:'none',display:'block'}}
                      title="PDF Preview"
                    />
                  )
                ) : (
                  /* Edit mode: canvas (current page) + positioned inputs per text item */
                  <div className="page-wrap">
                    <canvas ref={previewCanvRef}/>
                    <div ref={textLayerRef} style={{display:'none'}}/>
                    <div className="edit-overlay">
                      {editItems.map(item => {
                        const saved    = pageEdits[selPage]?.[item.idx]
                        const isEdited = saved !== undefined && saved !== item.str
                        return (
                          <input
                            key={`${selPage}-${item.idx}-${saved ?? ''}`}
                            type="text"
                            className={`edit-token${isEdited ? ' is-edited' : ''}`}
                            defaultValue={saved ?? item.str}
                            title={`Click to edit: "${item.str}"`}
                            style={{ left:item.x, top:item.y, width:item.w+20, height:item.fs*1.4, fontSize:item.fs }}
                            onFocus={e => e.target.select()}
                            onBlur={e => {
                              const val = e.target.value
                              setPageEdits(prev => {
                                const pg = prev[selPage] ?? {}
                                if (val === item.str) { const {[item.idx]:_,...rest}=pg; return {...prev,[selPage]:rest} }
                                return { ...prev, [selPage]: { ...pg, [item.idx]: val } }
                              })
                            }}
                            onKeyDown={e => { if (e.key==='Escape') e.currentTarget.blur() }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Text pane */}
              <div className="text-pane">
                <div className="text-pane-head">
                  <span className="tp-lbl">Extracted Text</span>
                  {selPageItem && (
                    <span className={`tp-badge ${selPageItem.isNative?'native':'ocr'}${selPageItem.status==='processing'?' processing':''}`}>
                      {selPageItem.status==='processing' ? '⌛ Scanning…'
                        : selPageItem.isNative ? '✦ Native text'
                        : selPageItem.status==='done' ? '🤖 AI OCR'
                        : selPageItem.status==='error' ? '⚠ Error'
                        : '—'}
                    </span>
                  )}
                  {selPageItem?.status==='done'||selPageItem?.status==='native' ? (
                    <button onClick={()=>navigator.clipboard.writeText(selPageItem.text)}
                      style={{fontSize:10,fontWeight:700,color:'rgba(0,0,0,.35)',background:'none',border:'none',cursor:'pointer',padding:'2px 6px',borderRadius:4,transition:'color .12s'}}
                      onMouseOver={e=>(e.currentTarget.style.color='#0891b2')}
                      onMouseOut={e=>(e.currentTarget.style.color='rgba(0,0,0,.35)')}>
                      ⎘ Copy
                    </button>
                  ) : null}
                </div>

                {selPageItem?.status === 'error' ? (
                  <div style={{padding:20,color:'#E24B4A',fontSize:12,lineHeight:1.7}}>
                    <div style={{fontWeight:700,marginBottom:4}}>⚠ OCR failed for this page</div>
                    <div style={{opacity:.8}}>{selPageItem.error}</div>
                    <button className="nbtn pri" style={{marginTop:12,fontSize:11}} onClick={()=>{ abortRef.current=false; setIsRunning(true); ocrPage(selPage).finally(()=>setIsRunning(false)) }}>
                      Retry
                    </button>
                  </div>
                ) : selPageItem?.status === 'idle' ? (
                  <div className="empty-main" style={{position:'relative'}}>
                    <div className="empty-icon">🔍</div>
                    <div className="empty-ttl">Not yet scanned</div>
                    <div className="empty-sub">Click "Scan this page" above to OCR just this page, or "Scan All" to process the entire document.</div>
                  </div>
                ) : (
                  <div style={{position:'relative',flex:1,display:'flex',flexDirection:'column'}}>
                    {selPageItem?.status === 'processing' && !selPageItem.text && (
                      <div className="proc-overlay">
                        <div className="proc-spinner"/>
                        <div className="proc-lbl">AI is reading the page…</div>
                        <div className="proc-sub">This takes 5-15 seconds per page</div>
                      </div>
                    )}
                    <textarea
                      key={selPage}
                      className="text-area"
                      value={selPageItem?.text ?? ''}
                      readOnly={selPageItem?.status === 'processing'}
                      onChange={e => {
                        const val = e.target.value
                        setPages(prev => prev.map(p => p.num !== selPage ? p : { ...p, text: val }))
                      }}
                      placeholder="OCR text will appear here as it's extracted…"
                      spellCheck={false}
                      style={{flex:1,width:'100%',minHeight:0}}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings sidebar */}
          <div className="settings">
            <div className="st-sec">
              <div className="st-ttl">Document</div>
              <div style={{fontSize:11,fontWeight:600,color:'#1d1d1f',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{pdfFile.name}</div>
              <div style={{fontSize:10,color:'rgba(0,0,0,.35)',marginTop:2}}>{fmtBytes(pdfFile.size)} · {totalPages} pages</div>
            </div>

            <div className="st-sec">
              <div className="st-ttl">Language</div>
              <select className="lang-sel" value={language} onChange={e=>setLanguage(e.target.value as LangOpt)}>
                {LANGS.map(l=><option key={l} value={l}>{l==='auto'?'Auto-detect':l}</option>)}
              </select>
              <div className="st-hint">Tell Claude which language to expect for better accuracy.</div>
            </div>

            <div className="st-sec">
              <div className="tog-row">
                <span className="tog-lbl">Skip text pages</span>
                <div className={`tog${useNative?' on':' off'}`} onClick={()=>setUseNative(p=>!p)}><div className="tok"/></div>
              </div>
              <div className="st-hint">If enabled, pages that already have extractable text are read directly without using AI — much faster and free.</div>
            </div>

            <div className="st-sec" style={{borderBottom:'none'}}>
              {!isRunning ? (
                <button className="ocr-btn" disabled={totalPages===0||loading} onClick={runOCR}>
                  🔍 Scan all {totalPages} pages
                </button>
              ) : (
                <>
                  <div style={{fontSize:11,fontWeight:700,color:'#0891b2',marginBottom:8,textAlign:'center'}}>
                    Scanning {doneCount+1} of {totalPages}…
                  </div>
                  <div style={{height:6,background:'#e8e8ea',borderRadius:3,marginBottom:10,overflow:'hidden'}}>
                    <div style={{height:'100%',background:'#0891b2',borderRadius:3,width:`${progress*100}%`,transition:'width .4s'}}/>
                  </div>
                  <button className="nbtn sec" style={{width:'100%'}} onClick={stopOCR}>Stop</button>
                </>
              )}

              {doneCount > 0 && !isRunning && (
                <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:6}}>
                  <button className="nbtn grn" style={{width:'100%'}} onClick={downloadOCRPdf} disabled={exporting}>
                    {exporting ? '⏳ Building PDF…' : '↓ Download PDF'}
                  </button>
                  <button className="nbtn sec" style={{width:'100%'}} onClick={copyAll}>{copied?'✓ Copied':'⎘ Copy all text'}</button>
                  <button className="nbtn sec" style={{width:'100%'}} onClick={downloadTxt}>↓ Download .txt</button>
                </div>
              )}
            </div>

            {/* Stats */}
            {doneCount > 0 && (
              <div className="st-sec" style={{borderBottom:'none',marginTop:'auto'}}>
                <div className="st-ttl">Stats</div>
                {[
                  ['Done', `${doneCount} / ${totalPages} pages`],
                  ['Words', pages.reduce((a,p)=>a+p.text.trim().split(/\s+/).filter(Boolean).length,0).toLocaleString()],
                  ['Chars', pages.reduce((a,p)=>a+p.text.length,0).toLocaleString()],
                  ['Native', `${pages.filter(p=>p.isNative).length} pages`],
                ].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                    <span style={{fontSize:10,color:'rgba(0,0,0,.35)',fontWeight:600}}>{l}</span>
                    <span style={{fontSize:11,fontWeight:700,color:'#1d1d1f'}}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="application/pdf" style={{display:'none'}}
        onChange={e=>{const f=e.target.files?.[0];if(f)loadFile(f);e.target.value=''}} />
    </>
  )
}
