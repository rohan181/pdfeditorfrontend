'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.pg{min-height:100vh;background:#fff;overflow-x:hidden}
.wrap{max-width:900px;margin:0 auto;padding:0 28px}

.nav{position:sticky;top:0;z-index:200;height:54px;background:rgba(255,255,255,.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.06);display:flex;align-items:center}
.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%}
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

/* drop */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#E24B4A;background:#fff5f5}
.drop-icon{font-size:48px;margin-bottom:14px;display:block}
.drop h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:20px;line-height:1.5}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#E24B4A}

/* file row */
.file-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:24px}
.file-icon{width:36px;height:36px;background:#E24B4A;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-size{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.file-rm{width:26px;height:26px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:12px;transition:all .15s}
.file-rm:hover{border-color:#E24B4A;color:#E24B4A}

/* mode tabs */
.mode-label{font-size:10px;font-weight:600;letter-spacing:.08em;color:rgba(0,0,0,.4);text-transform:uppercase;margin-bottom:10px}
.mode-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:24px}
@media(max-width:520px){.mode-tabs{grid-template-columns:1fr}}
.mode-tab{padding:13px 10px;border:1.5px solid #e0e0e0;border-radius:10px;cursor:pointer;text-align:center;transition:all .15s;background:#fff}
.mode-tab:hover{border-color:#bbb;background:#fafafa}
.mode-tab.active{border-color:#1d1d1f;background:#f5f5f7}
.mode-tab-icon{font-size:20px;margin-bottom:6px}
.mode-tab-name{font-size:12px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.mode-tab-desc{font-size:10px;color:rgba(0,0,0,.4);line-height:1.4}

/* mode panels */
.panel{background:#fafafa;border:1px solid #e8e8e8;border-radius:10px;padding:18px;margin-bottom:20px}
.panel-label{font-size:10px;font-weight:600;letter-spacing:.08em;color:rgba(0,0,0,.4);text-transform:uppercase;margin-bottom:8px}

/* range input */
.range-row{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.range-row label{font-size:12px;font-weight:600;color:#1d1d1f;min-width:80px}
.num-input{width:70px;padding:7px 10px;border:1px solid #d8d8d8;border-radius:7px;font-size:13px;color:#1d1d1f;font-family:inherit;outline:none;transition:border-color .15s;text-align:center}
.num-input:focus{border-color:#1d1d1f;box-shadow:0 0 0 3px rgba(29,29,31,.06)}
.range-sep{font-size:12px;color:rgba(0,0,0,.35);font-weight:500}
.range-hint{font-size:11px;color:rgba(0,0,0,.35);margin-top:4px}

/* range list */
.ranges-list{display:flex;flex-direction:column;gap:8px;margin-bottom:10px}
.range-item{display:flex;align-items:center;gap:8px;padding:9px 12px;background:#fff;border:1px solid #e8e8e8;border-radius:8px}
.range-badge{font-size:10px;font-weight:700;color:#6366f1;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);padding:2px 7px;border-radius:4px;white-space:nowrap}
.range-text{flex:1;font-size:12px;color:#1d1d1f;font-weight:500}
.range-rm{width:20px;height:20px;border-radius:4px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:10px;transition:all .14s}
.range-rm:hover{border-color:#E24B4A;color:#E24B4A}
.add-range-row{display:flex;align-items:center;gap:8px}
.add-range-btn{padding:7px 14px;background:#1d1d1f;border:none;border-radius:7px;font-size:12px;font-weight:600;color:#fff;cursor:pointer;transition:background .14s;white-space:nowrap}
.add-range-btn:hover{background:#6366f1}

/* every N pages */
.every-row{display:flex;align-items:center;gap:10px}
.every-row label{font-size:13px;font-weight:600;color:#1d1d1f}
.every-preview{font-size:11px;color:rgba(0,0,0,.4);margin-top:8px;line-height:1.6}

/* page thumbs selector */
.thumb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px;max-height:320px;overflow-y:auto;padding:4px 2px}
.thumb-card{border-radius:7px;border:2px solid #e8e8e8;overflow:hidden;cursor:pointer;transition:all .15s;user-select:none}
.thumb-card.sel{border-color:#E24B4A;box-shadow:0 0 0 2px rgba(226,75,74,.15)}
.thumb-card:hover{border-color:#bbb}
.thumb-img{aspect-ratio:.707;background:#f5f5f7;display:flex;align-items:center;justify-content:center;overflow:hidden}
.thumb-img img{width:100%;height:100%;object-fit:cover}
.thumb-footer{padding:3px 4px;text-align:center;font-size:9px;font-weight:700;color:rgba(0,0,0,.45);background:#fff;border-top:1px solid #f0f0f0}
.thumb-card.sel .thumb-footer{color:#E24B4A}

/* output list */
.output-list{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
.output-item{display:flex;align-items:center;gap:10px;padding:10px 13px;background:#fafafa;border:1px solid #e8e8e8;border-radius:9px}
.output-num{width:22px;height:22px;border-radius:5px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:rgba(0,0,0,.4);flex-shrink:0}
.output-info{flex:1;font-size:12px;font-weight:500;color:#1d1d1f}
.output-sub{font-size:10px;color:rgba(0,0,0,.4);margin-top:1px}

/* action bar */
.action-bar{display:flex;gap:10px;flex-wrap:wrap}
.split-btn{flex:1;min-width:160px;padding:14px;background:#1d1d1f;border:none;border-radius:10px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.split-btn:hover:not(:disabled){background:#E24B4A}
.split-btn:disabled{opacity:.4;cursor:not-allowed}
.reset-btn{padding:14px 20px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;white-space:nowrap}
.reset-btn:hover{border-color:#1d1d1f}

/* progress */
.prog-wrap{margin-top:12px}
.prog-bar{height:3px;background:#e8e8e8;border-radius:99px;overflow:hidden}
.prog-fill{height:100%;background:#1d1d1f;border-radius:99px;transition:width .3s ease}
.prog-label{font-size:10px;color:rgba(0,0,0,.4);margin-top:5px;text-align:center;letter-spacing:.06em;text-transform:uppercase}

/* result */
.result-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:20px}
.result-card{padding:14px;background:#fafafa;border:1px solid #e8e8e8;border-radius:10px;display:flex;align-items:center;gap:12px}
.result-icon{font-size:22px;flex-shrink:0}
.result-info{flex:1;min-width:0}
.result-name{font-size:12px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.result-meta{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.dl-btn{padding:6px 13px;background:#1d1d1f;border:none;border-radius:6px;font-size:11px;font-weight:600;color:#fff;cursor:pointer;transition:background .14s;white-space:nowrap;flex-shrink:0}
.dl-btn:hover{background:#E24B4A}
.dl-all-btn{width:100%;padding:13px;background:#1d1d1f;border:none;border-radius:10px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px}
.dl-all-btn:hover{background:#E24B4A}
.again-btn{width:100%;padding:12px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s}
.again-btn:hover{border-color:#1d1d1f}

/* info */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:48px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:5px}
.info-card p{font-size:12px;color:rgba(0,0,0,.45);line-height:1.6}

.error-box{padding:11px 14px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:9px;font-size:13px;color:#E24B4A;margin-bottom:14px}
.loading-box{padding:32px 24px;text-align:center;color:rgba(0,0,0,.4);font-size:13px}
`

// ─── Types ─────────────────────────────────────────────────────────────────────
type Mode = 'every-page' | 'ranges' | 'pick-pages'

type SplitRange = { id: string; from: number; to: number }

type SplitResult = { name: string; blob: Blob; pages: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

let _uid = 0
const uid = () => `r-${++_uid}`

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

// ─── Component ────────────────────────────────────────────────────────────────
export default function PDFSplitterPage() {
  const [file, setFile]         = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [thumbs, setThumbs]     = useState<string[]>([])
  const [loadingFile, setLoadingFile] = useState(false)
  const [isDrop, setIsDrop]     = useState(false)

  const [mode, setMode]         = useState<Mode>('every-page')

  // every-page mode
  const [everyN, setEveryN]     = useState(1)

  // ranges mode
  const [ranges, setRanges]     = useState<SplitRange[]>([])
  const [rangeFrom, setRangeFrom] = useState(1)
  const [rangeTo, setRangeTo]   = useState(1)

  // pick-pages mode
  const [picked, setPicked]     = useState<Set<number>>(new Set())  // 1-based page numbers

  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults]   = useState<SplitResult[]>([])
  const [error, setError]       = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  // ── Load PDF ────────────────────────────────────────────────────────────────
  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setFile(f); setThumbs([]); setResults([])
    setPicked(new Set()); setRanges([])
    setLoadingFile(true)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      setTotalPages(doc.numPages)
      setEveryN(1)
      setRangeFrom(1); setRangeTo(doc.numPages)

      const t: string[] = []
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const vp   = page.getViewport({ scale: 0.4 })
        const c    = document.createElement('canvas')
        c.width = vp.width; c.height = vp.height
        await page.render({ canvasContext: c.getContext('2d')!, viewport: vp }).promise
        t.push(c.toDataURL('image/jpeg', 0.75))
      }
      setThumbs(t)
    } catch (e: any) {
      setError('Failed to load PDF: ' + (e?.message ?? 'unknown'))
    } finally {
      setLoadingFile(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  // ── Ranges ─────────────────────────────────────────────────────────────────
  const addRange = () => {
    const f = clamp(rangeFrom, 1, totalPages)
    const t = clamp(rangeTo,   f, totalPages)
    setRanges(prev => [...prev, { id: uid(), from: f, to: t }])
  }
  const removeRange = (id: string) => setRanges(prev => prev.filter(r => r.id !== id))

  // ── Pick pages ─────────────────────────────────────────────────────────────
  const togglePick = (pg: number) => setPicked(prev => {
    const n = new Set(prev); n.has(pg) ? n.delete(pg) : n.add(pg); return n
  })

  // ── Split ──────────────────────────────────────────────────────────────────
  const onSplit = async () => {
    if (!file) return
    setProcessing(true); setProgress(5); setError(''); setResults([])

    try {
      const bytes  = await file.arrayBuffer()
      const srcDoc = await PDFDocument.load(bytes)
      const base   = file.name.replace(/\.pdf$/i, '')

      // Build list of page-groups to extract (0-based indices)
      let groups: { label: string; indices: number[] }[] = []

      if (mode === 'every-page') {
        for (let i = 0; i < totalPages; i += everyN) {
          const chunk = Array.from({ length: Math.min(everyN, totalPages - i) }, (_, k) => i + k)
          const pLabel = everyN === 1
            ? `p${i + 1}`
            : `p${i + 1}-${i + chunk.length}`
          groups.push({ label: pLabel, indices: chunk })
        }
      } else if (mode === 'ranges') {
        if (ranges.length === 0) { setError('Add at least one page range.'); setProcessing(false); return }
        groups = ranges.map((r, i) => ({
          label: `part${i + 1}_p${r.from}-${r.to}`,
          indices: Array.from({ length: r.to - r.from + 1 }, (_, k) => r.from - 1 + k),
        }))
      } else {
        if (picked.size === 0) { setError('Select at least one page.'); setProcessing(false); return }
        const sorted = Array.from(picked).sort((a, b) => a - b)
        groups = [{ label: `selected_${sorted.length}pages`, indices: sorted.map(p => p - 1) }]
      }

      const out: SplitResult[] = []
      for (let g = 0; g < groups.length; g++) {
        const { label, indices } = groups[g]
        const outDoc = await PDFDocument.create()
        const copied = await outDoc.copyPages(srcDoc, indices)
        copied.forEach(p => outDoc.addPage(p))
        const outBytes = await outDoc.save()
        const blob     = new Blob([outBytes], { type: 'application/pdf' })
        const pgRange  = indices.length === 1
          ? `Page ${indices[0] + 1}`
          : `Pages ${indices[0] + 1}–${indices[indices.length - 1] + 1}`
        out.push({ name: `${base}_${label}.pdf`, blob, pages: pgRange })
        setProgress(5 + Math.round(((g + 1) / groups.length) * 90))
      }

      setProgress(100)
      setResults(out)
    } catch (e: any) {
      setError('Split failed: ' + (e?.message ?? 'unknown error'))
    } finally {
      setProcessing(false)
    }
  }

  // ── Download helpers ────────────────────────────────────────────────────────
  const download = (r: SplitResult) => {
    const url = URL.createObjectURL(r.blob)
    const a   = document.createElement('a')
    a.href = url; a.download = r.name; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  const downloadAll = () => results.forEach((r, i) =>
    setTimeout(() => download(r), i * 300)
  )

  const reset = () => {
    setFile(null); setThumbs([]); setResults([]); setTotalPages(0)
    setRanges([]); setPicked(new Set()); setError(''); setProgress(0); setEveryN(1)
  }

  // ── Every-N preview text ────────────────────────────────────────────────────
  const everyNPreview = () => {
    if (!totalPages) return ''
    const count = Math.ceil(totalPages / everyN)
    const parts = Array.from({ length: Math.min(count, 4) }, (_, i) => {
      const f = i * everyN + 1
      const t = Math.min((i + 1) * everyN, totalPages)
      return f === t ? `p${f}` : `p${f}–${t}`
    })
    if (count > 4) parts.push(`…+${count - 4} more`)
    return `→ ${count} file${count !== 1 ? 's' : ''}: ${parts.join(', ')}`
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <nav className="nav">
          <div className="wrap nav-in">
            <Link href="/" className="logo">
              <div className="logo-mark">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2z"/><path d="M14 2v6h6"/>
                </svg>
              </div>
              <span className="logo-name">Edit<em>PDF</em> AI</span>
            </Link>
            <Link href="/" className="back">← All Tools</Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>PDF Tools · Split · Extract · Free</div>
            <h1>Split Your<br/><em>PDF</em> File</h1>
            <p>Split by every page, custom ranges, or pick specific pages — download each part instantly.</p>
          </div>
        </div>

        {/* Main */}
        <div className="wrap">
          <div className="card">

            {/* ── Upload zone ── */}
            {!file ? (
              <>
                <div
                  className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}
                  onDrop={onDrop}
                >
                  <span className="drop-icon">✂️</span>
                  <h2>Drop your PDF here</h2>
                  <p>Choose how to split it after upload</p>
                  <button className="drop-btn">Choose PDF</button>
                  <input ref={fileRef} type="file" accept=".pdf" style={{ display:'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
                </div>
                {error && <div className="error-box" style={{ marginTop:14 }}>{error}</div>}
              </>
            ) : results.length > 0 ? (
              /* ── Results ── */
              <>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'var(--font-jakarta,system-ui)', fontSize:18, fontWeight:800, color:'#1d1d1f', marginBottom:4, letterSpacing:'-.03em' }}>
                    🎉 Split complete — {results.length} file{results.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ fontSize:13, color:'rgba(0,0,0,.45)' }}>Click each file to download, or grab them all at once.</div>
                </div>

                <div className="result-grid">
                  {results.map((r, i) => (
                    <div className="result-card" key={i}>
                      <div className="result-icon">📄</div>
                      <div className="result-info">
                        <div className="result-name" title={r.name}>{r.name}</div>
                        <div className="result-meta">{r.pages} · {fmt(r.blob.size)}</div>
                      </div>
                      <button className="dl-btn" onClick={() => download(r)}>⬇</button>
                    </div>
                  ))}
                </div>

                {results.length > 1 && (
                  <button className="dl-all-btn" onClick={downloadAll}>
                    ⬇ Download all {results.length} files
                  </button>
                )}
                <button className="again-btn" onClick={reset}>Split another PDF</button>
              </>
            ) : (
              /* ── Split config ── */
              <>
                {/* File row */}
                <div className="file-row">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{fmt(file.size)}{totalPages ? ` · ${totalPages} pages` : ''}</div>
                  </div>
                  <button className="file-rm" onClick={reset} title="Remove">✕</button>
                </div>

                {loadingFile ? (
                  <div className="loading-box">⏳ Reading PDF…</div>
                ) : (
                  <>
                    {/* Mode selector */}
                    <div className="mode-label">Split method</div>
                    <div className="mode-tabs">
                      {([
                        { id:'every-page', icon:'📄', name:'Every N pages', desc:'Split into equal chunks' },
                        { id:'ranges',     icon:'✂️', name:'Page ranges',   desc:'Define custom ranges' },
                        { id:'pick-pages', icon:'🖱️', name:'Pick pages',    desc:'Select pages to extract' },
                      ] as { id: Mode; icon: string; name: string; desc: string }[]).map(m => (
                        <div
                          key={m.id}
                          className={`mode-tab${mode === m.id ? ' active' : ''}`}
                          onClick={() => setMode(m.id)}
                        >
                          <div className="mode-tab-icon">{m.icon}</div>
                          <div className="mode-tab-name">{m.name}</div>
                          <div className="mode-tab-desc">{m.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* ── Every N pages ── */}
                    {mode === 'every-page' && (
                      <div className="panel">
                        <div className="panel-label">Split every</div>
                        <div className="every-row">
                          <label>Pages per file</label>
                          <input
                            className="num-input"
                            type="number"
                            min={1}
                            max={totalPages}
                            value={everyN}
                            onChange={e => setEveryN(clamp(parseInt(e.target.value) || 1, 1, totalPages))}
                          />
                          <span style={{ fontSize:12, color:'rgba(0,0,0,.4)' }}>of {totalPages}</span>
                        </div>
                        <div className="every-preview">{everyNPreview()}</div>
                      </div>
                    )}

                    {/* ── Ranges ── */}
                    {mode === 'ranges' && (
                      <div className="panel">
                        <div className="panel-label">Page ranges</div>
                        {ranges.length > 0 && (
                          <div className="ranges-list">
                            {ranges.map((r, i) => (
                              <div className="range-item" key={r.id}>
                                <span className="range-badge">Part {i + 1}</span>
                                <span className="range-text">Pages {r.from} – {r.to}</span>
                                <button className="range-rm" onClick={() => removeRange(r.id)}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="add-range-row">
                          <span style={{ fontSize:12, fontWeight:600, color:'rgba(0,0,0,.5)', marginRight:4 }}>Pages</span>
                          <input
                            className="num-input"
                            type="number" min={1} max={totalPages}
                            value={rangeFrom}
                            onChange={e => setRangeFrom(clamp(parseInt(e.target.value) || 1, 1, totalPages))}
                          />
                          <span className="range-sep">–</span>
                          <input
                            className="num-input"
                            type="number" min={rangeFrom} max={totalPages}
                            value={rangeTo}
                            onChange={e => setRangeTo(clamp(parseInt(e.target.value) || rangeFrom, rangeFrom, totalPages))}
                          />
                          <button className="add-range-btn" onClick={addRange}>+ Add range</button>
                        </div>
                        <div className="range-hint">Each range becomes a separate PDF file.</div>
                      </div>
                    )}

                    {/* ── Pick pages ── */}
                    {mode === 'pick-pages' && (
                      <div className="panel">
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                          <div className="panel-label" style={{ margin:0 }}>
                            Select pages ({picked.size} selected)
                          </div>
                          <div style={{ display:'flex', gap:6 }}>
                            <button
                              style={{ fontSize:11, fontWeight:600, color:'rgba(0,0,0,.5)', background:'none', border:'1px solid #e0e0e0', borderRadius:5, padding:'3px 9px', cursor:'pointer' }}
                              onClick={() => setPicked(new Set(Array.from({ length:totalPages }, (_,i) => i+1)))}
                            >All</button>
                            <button
                              style={{ fontSize:11, fontWeight:600, color:'rgba(0,0,0,.5)', background:'none', border:'1px solid #e0e0e0', borderRadius:5, padding:'3px 9px', cursor:'pointer' }}
                              onClick={() => setPicked(new Set())}
                            >None</button>
                          </div>
                        </div>
                        <div className="thumb-grid">
                          {thumbs.map((src, i) => (
                            <div
                              key={i}
                              className={`thumb-card${picked.has(i + 1) ? ' sel' : ''}`}
                              onClick={() => togglePick(i + 1)}
                            >
                              <div className="thumb-img">
                                <img src={src} alt={`Page ${i + 1}`} />
                              </div>
                              <div className="thumb-footer">{i + 1}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize:11, color:'rgba(0,0,0,.4)', marginTop:8 }}>
                          Selected pages will be extracted into a single PDF.
                        </div>
                      </div>
                    )}

                    {error && <div className="error-box">{error}</div>}

                    {/* Action bar */}
                    <div className="action-bar">
                      <button className="split-btn" onClick={onSplit} disabled={processing}>
                        {processing ? '⏳ Splitting…' : '✂️ Split PDF'}
                      </button>
                      <button className="reset-btn" onClick={reset}>Cancel</button>
                    </div>

                    {processing && (
                      <div className="prog-wrap">
                        <div className="prog-bar">
                          <div className="prog-fill" style={{ width:`${progress}%` }} />
                        </div>
                        <div className="prog-label">Generating files…</div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>✂️ 3 Split Modes</h3>
              <p>Every N pages, custom ranges, or hand-pick exactly the pages you want to extract.</p>
            </div>
            <div className="info-card">
              <h3>⬇ Instant Download</h3>
              <p>Each part downloads as a separate PDF. Download individually or all at once.</p>
            </div>
            <div className="info-card">
              <h3>🔒 100% Private</h3>
              <p>All splitting happens in your browser with pdf-lib. Your file never leaves your device.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
