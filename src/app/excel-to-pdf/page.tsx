'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

.pg{min-height:100vh;background:#f5f5f7;padding-top:56px;}


.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#217346}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.45);text-decoration:none;padding:5px 12px;border-radius:7px;transition:all .14s}
.back:hover{color:#1d1d1f;background:#f0f0f0}

.wrap{max-width:920px;margin:0 auto;padding:40px 20px 80px}

.hero{text-align:center;margin-bottom:32px;animation:fadeup .3s ease}
.hero-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#e8f5ee;border:1px solid rgba(33,115,70,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#217346;margin-bottom:14px;text-transform:uppercase}
.hero h1{font-size:clamp(26px,5vw,42px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;margin-bottom:8px}
.hero h1 em{font-style:normal;color:#217346}
.hero p{font-size:14px;color:rgba(0,0,0,.45);line-height:1.7;max-width:480px;margin:0 auto}

.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:28px;margin-bottom:16px;box-shadow:0 2px 16px rgba(0,0,0,.04)}

/* Drop zone */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#217346;background:#e8f5ee}
.drop-icon{font-size:48px;margin-bottom:14px;display:block}
.drop h2{font-size:18px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:18px;line-height:1.5}
.drop-types{display:inline-flex;gap:6px;margin-bottom:18px}
.type-badge{padding:3px 9px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.04em}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#217346}

/* File row */
.file-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:18px}
.file-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.file-meta{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.file-rm{width:26px;height:38px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:13px;transition:all .15s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Settings */
.settings{display:flex;align-items:center;gap:14px;padding:12px 16px;background:#fafafa;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:18px;flex-wrap:wrap}
.set-label{font-size:10px;font-weight:700;letter-spacing:.06em;color:rgba(0,0,0,.4);text-transform:uppercase;white-space:nowrap}
.toggle-group{display:flex;gap:4px}
.tog{padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:#fff;color:rgba(0,0,0,.5);transition:all .14s;white-space:nowrap}
.tog.on{background:#1d1d1f;border-color:#1d1d1f;color:#fff}
.tog:hover:not(.on){border-color:#bbb;color:#1d1d1f}
.set-div{width:1px;height:20px;background:#e0e0e0;flex-shrink:0}

/* Sheet tabs */
.tabs{display:flex;gap:4px;padding:10px 20px 0;border-bottom:1px solid #f0f0f0;overflow-x:auto}
.tab{padding:6px 13px;border-radius:7px 7px 0 0;font-size:11px;font-weight:700;cursor:pointer;border:1px solid transparent;border-bottom:none;transition:all .14s;white-space:nowrap;color:rgba(0,0,0,.42);background:transparent;flex-shrink:0}
.tab.active{background:#fff;border-color:#e8e8e8;border-bottom-color:#fff;color:#1d1d1f;margin-bottom:-1px}
.tab:hover:not(.active){color:#217346}

/* Table */
.tbl-wrap{overflow:auto;max-height:380px}
table{width:100%;border-collapse:collapse;font-size:12px}
thead{position:sticky;top:0;z-index:5}
thead tr{background:#217346}
th{padding:8px 12px;text-align:left;font-weight:700;color:#fff;font-size:10px;letter-spacing:.04em;white-space:nowrap}
td{padding:7px 12px;border-bottom:1px solid #f0f0f0;color:#1d1d1f;vertical-align:top;font-size:11.5px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
tr:hover td{background:#f8fdf9}
tr:last-child td{border-bottom:none}
td:first-child,th:first-child{padding-left:20px}
td:last-child,th:last-child{padding-right:20px}

/* Sheet cards */
.sheet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-bottom:16px}
.sheet-card{background:#fff;border:1.5px solid #e8e8e8;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;transition:all .14s}
.sheet-card:hover{border-color:#217346;box-shadow:0 2px 12px rgba(33,115,70,.12)}
.sheet-card.done{border-color:#217346;background:#f0faf4}
.sheet-dot{width:10px;height:10px;border-radius:50%;background:#217346;flex-shrink:0}
.sheet-info{flex:1;min-width:0}
.sheet-name{font-size:12px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sheet-meta{font-size:10px;color:rgba(0,0,0,.38);margin-top:2px}
.sheet-dl{padding:5px 12px;border-radius:7px;background:#217346;border:none;color:#fff;font-size:11px;font-weight:700;cursor:pointer;transition:all .14s;white-space:nowrap;flex-shrink:0}
.sheet-dl:hover{background:#1a5c38}
.sheet-dl:disabled{opacity:.45;cursor:not-allowed}
.sheet-dl.loading{background:#888}

/* Stats */
.stat-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.stat{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:#e8f5ee;border-radius:99px;font-size:10px;font-weight:700;color:#217346}

/* Preview card */
.preview-card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;overflow:hidden;margin-bottom:16px;box-shadow:0 2px 16px rgba(0,0,0,.04)}
.preview-head{padding:14px 20px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.preview-title{font-size:14px;font-weight:800;color:#1d1d1f}
.preview-sub{font-size:11px;color:rgba(0,0,0,.38);margin-top:2px}

/* Buttons */
.action-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}
.sec-btn{flex:1;min-width:140px;padding:13px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px}
.sec-btn:hover{border-color:#217346;color:#217346}
.pri-btn{flex:1;min-width:180px;padding:13px;background:#217346;border:none;border-radius:10px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 2px 12px rgba(33,115,70,.25)}
.pri-btn:hover:not(:disabled){background:#1a5c38}
.pri-btn:disabled{opacity:.4;cursor:not-allowed}

/* Info grid */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px}
@media(max-width:600px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:16px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:12px;font-weight:700;color:#1d1d1f;margin-bottom:4px}
.info-card p{font-size:11px;color:rgba(0,0,0,.45);line-height:1.6}

.err{padding:11px 14px;background:#fff5f5;border:1px solid rgba(220,38,38,.2);border-radius:9px;font-size:13px;color:#dc2626;margin-bottom:14px}
.spin{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.spin-dark{width:14px;height:14px;border:2px solid rgba(0,0,0,.15);border-top-color:#217346;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
`

// ─── Types ───────────────────────────────────────────────────────────────────
interface Sheet { name: string; rows: string[][] }
type Orientation = 'landscape' | 'portrait'
type ColorScheme = 'green' | 'blue' | 'dark'

// ─── SheetJS CDN loader ──────────────────────────────────────────────────────
let xlsxLib: any = null
async function loadXLSX(): Promise<any> {
  if (xlsxLib) return xlsxLib
  if ((window as any).XLSX) { xlsxLib = (window as any).XLSX; return xlsxLib }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js'
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error('Failed to load SheetJS. Check your internet connection.'))
    document.head.appendChild(s)
  })
  xlsxLib = (window as any).XLSX
  return xlsxLib
}

// ─── File parser ─────────────────────────────────────────────────────────────
async function parseFile(file: File): Promise<Sheet[]> {
  const XLSX = await loadXLSX()
  const buf  = await file.arrayBuffer()
  const wb   = XLSX.read(buf, { type: 'array', cellText: true, cellDates: true })

  return wb.SheetNames.map((name: string) => {
    const ws   = wb.Sheets[name]
    const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false })
    // Normalise: ensure all rows have same column count
    const maxCols = Math.max(0, ...raw.map((r: any[]) => r.length))
    const rows = raw
      .map((r: any[]) => Array.from({ length: maxCols }, (_, i) => String(r[i] ?? '')))
      .filter((r: string[]) => r.some(v => v !== ''))
    return { name, rows }
  }).filter((s: Sheet) => s.rows.length > 0)
}

// ─── PDF generation (one sheet → one PDF) ────────────────────────────────────
const SCHEME_COLORS = {
  green: { r: 0.13, g: 0.45, b: 0.27 },
  blue:  { r: 0.15, g: 0.39, b: 0.75 },
  dark:  { r: 0.11, g: 0.11, b: 0.13 },
}

async function sheetToPDF(
  sheet: Sheet,
  orientation: Orientation,
  scheme: ColorScheme,
  sourceFilename: string,
): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

  const pdfDoc = await PDFDocument.create()
  const fontB  = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontR  = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const PW = orientation === 'landscape' ? 841.89 : 595.28
  const PH = orientation === 'landscape' ? 595.28 : 841.89
  const M  = 36
  const UW = PW - M * 2
  const HDR_H = 22
  const ROW_H = 16
  const { r, g, b } = SCHEME_COLORS[scheme]
  const accent = rgb(r, g, b)
  const mid    = rgb(0.55, 0.55, 0.55)
  const dark   = rgb(0.10, 0.10, 0.10)
  const stripe = rgb(0.96, 0.98, 0.96)
  const lineCl = rgb(0.88, 0.88, 0.88)

  const clampStr = (s: string, max: number) => s.length > max ? s.slice(0, max - 1) + '…' : s

  if (!sheet.rows.length) return pdfDoc.save()

  const headers  = sheet.rows[0]
  const dataRows = sheet.rows.slice(1)

  // Column widths
  const rawW = headers.map((h, ci) => {
    const maxLen = Math.max(h.length, ...dataRows.slice(0, 400).map(r => (r[ci] ?? '').length))
    return Math.max(48, Math.min(190, maxLen * 5.8 + 14))
  })
  const totalRaw = rawW.reduce((a, b) => a + b, 0)
  const scale    = totalRaw > UW ? UW / totalRaw : 1
  const colW     = rawW.map(w => w * scale)
  const tableW   = colW.reduce((a, b) => a + b, 0)
  const fsH      = Math.max(7, Math.min(9,  9 * scale))
  const fsD      = Math.max(6, Math.min(8,  8 * scale))

  let pageNum = 0
  let page: any
  let y = 0

  const newPage = () => {
    pageNum++
    page = pdfDoc.addPage([PW, PH])
    y = PH - M
  }

  const drawHeaders = () => {
    page.drawRectangle({ x: M, y: y - HDR_H, width: tableW, height: HDR_H, color: accent })
    let x = M
    headers.forEach((h, ci) => {
      page.drawText(clampStr(h || `Col ${ci + 1}`, Math.floor(colW[ci] / (fsH * 0.58))), {
        x: x + 5, y: y - HDR_H + 7, font: fontB, size: fsH, color: rgb(1, 1, 1),
      })
      x += colW[ci]
    })
    y -= HDR_H
  }

  const drawFooter = () => {
    page.drawLine({ start: { x: M, y: M - 4 }, end: { x: PW - M, y: M - 4 }, thickness: 0.4, color: lineCl })
    page.drawText(`${sourceFilename}  ·  ${sheet.name}  ·  Page ${pageNum}`, {
      x: M, y: M - 16, font: fontR, size: 7.5, color: mid,
    })
  }

  newPage()

  // Title block
  page.drawText(sheet.name, { x: M, y: y - 14, font: fontB, size: 15, color: accent })
  page.drawText(`${dataRows.length.toLocaleString()} rows · ${headers.length} columns  —  ${sourceFilename}`, {
    x: M, y: y - 28, font: fontR, size: 8, color: mid,
  })
  y -= 48
  drawHeaders()

  dataRows.forEach((row, ri) => {
    if (y - ROW_H < M + 20) {
      drawFooter()
      newPage()
      drawHeaders()
    }

    if (ri % 2 === 1) {
      page.drawRectangle({ x: M, y: y - ROW_H, width: tableW, height: ROW_H, color: stripe })
    }
    page.drawLine({ start: { x: M, y: y - ROW_H }, end: { x: M + tableW, y: y - ROW_H }, thickness: 0.3, color: lineCl })

    let x = M
    headers.forEach((_, ci) => {
      const val = clampStr(String(row[ci] ?? ''), Math.floor(colW[ci] / (fsD * 0.55)))
      page.drawText(val, { x: x + 5, y: y - ROW_H + 5, font: fontR, size: fsD, color: dark })
      x += colW[ci]
    })

    y -= ROW_H
  })

  drawFooter()
  return pdfDoc.save()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(bytes: number) {
  if (bytes < 1024)    return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function safeName(name: string) {
  return name.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 60)
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ExcelToPDFPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [sheets,      setSheets]      = useState<Sheet[]>([])
  const [activeTab,   setActiveTab]   = useState(0)
  const [orientation, setOrientation] = useState<Orientation>('landscape')
  const [scheme,      setScheme]      = useState<ColorScheme>('green')
  const [loadingIdx,  setLoadingIdx]  = useState<number | null>(null)   // per-sheet loading
  const [dlAll,       setDlAll]       = useState(false)
  const [doneSet,     setDoneSet]     = useState<Set<number>>(new Set())
  const [parsing,     setParsing]     = useState(false)
  const [error,       setError]       = useState('')
  const [isDrop,      setIsDrop]      = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (!['csv', 'xls', 'xlsx'].includes(ext)) {
      setError('Please upload a .csv, .xls or .xlsx file.'); return
    }
    setError(''); setSheets([]); setDoneSet(new Set()); setParsing(true)
    try {
      const parsed = await parseFile(f)
      if (!parsed.length) { setError('No data found in this file.'); setParsing(false); return }
      setFile(f)
      setSheets(parsed)
      setActiveTab(0)
    } catch (e: any) {
      setError(e?.message ?? 'Could not parse file.')
    } finally {
      setParsing(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const downloadSheet = async (idx: number) => {
    if (!file) return
    setLoadingIdx(idx)
    try {
      const bytes = await sheetToPDF(sheets[idx], orientation, scheme, file.name)
      triggerDownload(bytes, `${safeName(sheets[idx].name)}.pdf`)
      setDoneSet(prev => { const n = new Set(Array.from(prev)); n.add(idx); return n })
    } catch (e: any) {
      setError(e?.message ?? 'PDF generation failed.')
    } finally {
      setLoadingIdx(null)
    }
  }

  const downloadAll = async () => {
    if (!file) return
    setDlAll(true); setError('')
    try {
      for (let i = 0; i < sheets.length; i++) {
        setLoadingIdx(i)
        const bytes = await sheetToPDF(sheets[i], orientation, scheme, file.name)
        triggerDownload(bytes, `${safeName(sheets[i].name)}.pdf`)
        setDoneSet(prev => { const n = new Set(Array.from(prev)); n.add(i); return n })
        // slight pause between downloads so browser doesn't block them
        await new Promise(r => setTimeout(r, 400))
      }
    } catch (e: any) {
      setError(e?.message ?? 'PDF generation failed.')
    } finally {
      setLoadingIdx(null); setDlAll(false)
    }
  }

  const reset = () => {
    setFile(null); setSheets([]); setDoneSet(new Set()); setError(''); setActiveTab(0); setLoadingIdx(null); setDlAll(false)
  }

  const hasData  = sheets.length > 0
  const multiSheet = sheets.length > 1
  const totalRows  = sheets.reduce((s, sh) => s + Math.max(0, sh.rows.length - 1), 0)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <SiteNav />

        <div className="wrap">

          {/* Hero */}
          <div className="hero">
            <div className="hero-badge">
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#217346', display: 'inline-block' }}/>
              100% In-Browser
            </div>
            <h1>Excel / CSV <em>to PDF</em></h1>
            <p>Supports .xlsx, .xls and .csv — including multi-sheet workbooks. Each sheet is converted to its own PDF.</p>
          </div>

          {!hasData ? (
            /* ── Upload ─────────────────────────────────────────────────── */
            <div className="card">
              {error && <div className="err">⚠ {error}</div>}
              {parsing ? (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <div className="spin-dark" style={{ margin: '0 auto 14px', width: 28, height: 28, borderWidth: 3 }}/>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>Reading file…</div>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,.4)', marginTop: 4 }}>Loading SheetJS if needed</div>
                </div>
              ) : (
                <div className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}>
                  <span className="drop-icon">📊</span>
                  <h2>Drop your spreadsheet here</h2>
                  <div className="drop-types">
                    <span className="type-badge" style={{ background: '#e8f5ee', color: '#217346' }}>XLSX</span>
                    <span className="type-badge" style={{ background: '#e8f5ee', color: '#1a5c38' }}>XLS</span>
                    <span className="type-badge" style={{ background: '#e8f0fe', color: '#1a56b2' }}>CSV</span>
                  </div>
                  <p>Multi-sheet workbooks supported — each sheet becomes its own PDF</p>
                  <button className="drop-btn">📄 Choose File</button>
                </div>
              )}
            </div>
          ) : (
            /* ── Results ─────────────────────────────────────────────────── */
            <>
              {error && <div className="err">⚠ {error}</div>}

              {/* File info */}
              <div className="card" style={{ padding: '16px 20px' }}>
                <div className="file-row" style={{ marginBottom: 0 }}>
                  <div className="file-icon" style={{ background: '#e8f5ee' }}>📊</div>
                  <div className="file-info">
                    <div className="file-name">{file?.name}</div>
                    <div className="file-meta">
                      {fmt(file?.size ?? 0)} · {sheets.length} sheet{sheets.length !== 1 ? 's' : ''} · {totalRows.toLocaleString()} total rows
                    </div>
                  </div>
                  <button className="file-rm" onClick={reset}>×</button>
                </div>
              </div>

              {/* Settings */}
              <div className="settings">
                <span className="set-label">Orientation</span>
                <div className="toggle-group">
                  <button className={`tog${orientation === 'landscape' ? ' on' : ''}`} onClick={() => setOrientation('landscape')}>⬛ Landscape</button>
                  <button className={`tog${orientation === 'portrait'  ? ' on' : ''}`} onClick={() => setOrientation('portrait')}>▭ Portrait</button>
                </div>
                <div className="set-div"/>
                <span className="set-label">Color</span>
                <div className="toggle-group">
                  <button className={`tog${scheme === 'green' ? ' on' : ''}`} onClick={() => setScheme('green')} style={scheme === 'green' ? { background: '#217346', borderColor: '#217346' } : {}}>🟢 Green</button>
                  <button className={`tog${scheme === 'blue'  ? ' on' : ''}`} onClick={() => setScheme('blue')}  style={scheme === 'blue'  ? { background: '#2563eb', borderColor: '#2563eb' } : {}}>🔵 Blue</button>
                  <button className={`tog${scheme === 'dark'  ? ' on' : ''}`} onClick={() => setScheme('dark')}  style={scheme === 'dark'  ? { background: '#1d1d1f', borderColor: '#1d1d1f' } : {}}>⬛ Dark</button>
                </div>
              </div>

              {/* Sheet cards — one per sheet with individual download */}
              {multiSheet && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,.45)', marginBottom: 10, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                    Sheets — each downloads as a separate PDF
                  </div>
                  <div className="sheet-grid">
                    {sheets.map((s, i) => (
                      <div key={i} className={`sheet-card${doneSet.has(i) ? ' done' : ''}`}>
                        <div className="sheet-dot" style={{ background: doneSet.has(i) ? '#217346' : '#d0d0d0' }}/>
                        <div className="sheet-info">
                          <div className="sheet-name" title={s.name}>{s.name}</div>
                          <div className="sheet-meta">{Math.max(0, s.rows.length - 1)} rows · {s.rows[0]?.length ?? 0} cols</div>
                        </div>
                        <button
                          className={`sheet-dl${loadingIdx === i ? ' loading' : ''}`}
                          onClick={() => downloadSheet(i)}
                          disabled={loadingIdx !== null || dlAll}>
                          {loadingIdx === i
                            ? <><div className="spin"/> …</>
                            : doneSet.has(i) ? '✓ Done' : '⬇ PDF'}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Table preview */}
              <div className="preview-card">
                <div className="preview-head">
                  <div>
                    <div className="preview-title">Preview{multiSheet ? ` — ${sheets[activeTab]?.name}` : ''}</div>
                    <div className="preview-sub">First 50 rows · scroll horizontally for more columns</div>
                  </div>
                  <div className="stat-row" style={{ margin: 0 }}>
                    <span className="stat">📊 {sheets[activeTab]?.rows[0]?.length ?? 0} cols</span>
                    <span className="stat">📋 {Math.max(0, (sheets[activeTab]?.rows.length ?? 1) - 1)} rows</span>
                  </div>
                </div>

                {multiSheet && (
                  <div className="tabs">
                    {sheets.map((s, i) => (
                      <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}

                {sheets[activeTab] && (() => {
                  const sh      = sheets[activeTab]
                  const headers = sh.rows[0] ?? []
                  const data    = sh.rows.slice(1, 51)
                  return (
                    <div className="tbl-wrap">
                      <table>
                        <thead>
                          <tr>{headers.map((h, i) => <th key={i}>{h || `Col ${i + 1}`}</th>)}</tr>
                        </thead>
                        <tbody>
                          {data.length === 0
                            ? <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: 24, color: 'rgba(0,0,0,.3)' }}>No data rows</td></tr>
                            : data.map((row, ri) => (
                              <tr key={ri}>
                                {headers.map((_, ci) => <td key={ci} title={row[ci] ?? ''}>{row[ci] ?? ''}</td>)}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )
                })()}
              </div>

              {/* Action bar */}
              <div className="action-bar">
                <button className="sec-btn" onClick={reset}>← Convert Another File</button>

                {multiSheet ? (
                  <button className="pri-btn" onClick={downloadAll} disabled={dlAll || loadingIdx !== null}>
                    {dlAll
                      ? <><div className="spin"/> Downloading {loadingIdx !== null ? `Sheet ${loadingIdx + 1}/${sheets.length}` : '…'}</>
                      : `⬇ Download All ${sheets.length} PDFs`}
                  </button>
                ) : (
                  <button className="pri-btn" onClick={() => downloadSheet(0)} disabled={loadingIdx !== null}>
                    {loadingIdx === 0 ? <><div className="spin"/> Generating…</> : '⬇ Download PDF'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>📄 Full XLSX Support</h3>
              <p>Reads .xlsx, .xls, and .csv files using SheetJS — the industry-standard spreadsheet parser.</p>
            </div>
            <div className="info-card">
              <h3>📑 One PDF Per Sheet</h3>
              <p>Multi-sheet workbooks are split into individual PDFs — one per sheet — with headers repeated on every page.</p>
            </div>
            <div className="info-card">
              <h3>🔒 100% Private</h3>
              <p>Everything runs in your browser. Your file never leaves your device — no server uploads at all.</p>
            </div>
          </div>

        </div>
      </div>

      <input ref={fileRef} type="file" accept=".csv,.xls,.xlsx" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = '' }}/>
    </>
  )
}
