'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

.pg{min-height:100vh;background:#f5f5f7}

/* Nav */
.nav{height:52px;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;padding:0 20px;gap:10px;position:sticky;top:0;z-index:100}
.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#217346}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.back{font-size:12px;font-weight:600;color:rgba(0,0,0,.45);text-decoration:none;padding:5px 12px;border-radius:7px;transition:all .14s}
.back:hover{color:#1d1d1f;background:#f0f0f0}

/* Layout */
.wrap{max-width:900px;margin:0 auto;padding:40px 20px 80px}

/* Hero */
.hero{text-align:center;margin-bottom:32px;animation:fadeup .3s ease}
.hero-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#e8f5ee;border:1px solid rgba(33,115,70,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#217346;margin-bottom:14px;text-transform:uppercase}
.hero h1{font-size:clamp(26px,5vw,42px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;margin-bottom:8px}
.hero h1 em{font-style:normal;color:#217346}
.hero p{font-size:14px;color:rgba(0,0,0,.45);line-height:1.7;max-width:460px;margin:0 auto}

/* Card */
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
.file-rm{width:26px;height:26px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:13px;transition:all .15s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Settings bar */
.settings{display:flex;align-items:center;gap:16px;padding:12px 16px;background:#fafafa;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:18px;flex-wrap:wrap}
.set-label{font-size:10px;font-weight:700;letter-spacing:.06em;color:rgba(0,0,0,.4);text-transform:uppercase;white-space:nowrap}
.toggle-group{display:flex;gap:4px}
.tog{padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:#fff;color:rgba(0,0,0,.5);transition:all .14s;white-space:nowrap}
.tog.on{background:#1d1d1f;border-color:#1d1d1f;color:#fff}
.tog:hover:not(.on){border-color:#bbb;color:#1d1d1f}
.set-div{width:1px;height:20px;background:#e0e0e0}

/* Generate button */
.gen-btn{width:100%;padding:14px;background:#217346;border:none;border-radius:10px;font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.gen-btn:hover:not(:disabled){background:#1a5c38;transform:translateY(-1px);box-shadow:0 4px 16px rgba(33,115,70,.35)}
.gen-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}

/* Preview card */
.preview-card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;overflow:hidden;margin-bottom:16px;animation:fadeup .3s ease;box-shadow:0 2px 16px rgba(0,0,0,.04)}
.preview-head{padding:14px 20px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.preview-title{font-size:14px;font-weight:800;color:#1d1d1f}
.preview-sub{font-size:11px;color:rgba(0,0,0,.38);margin-top:2px}

/* Sheet tabs */
.tabs{display:flex;gap:4px;padding:10px 20px 0;border-bottom:1px solid #f0f0f0;overflow-x:auto}
.tab{padding:6px 13px;border-radius:7px 7px 0 0;font-size:11px;font-weight:700;cursor:pointer;border:1px solid transparent;border-bottom:none;transition:all .14s;white-space:nowrap;color:rgba(0,0,0,.42);background:transparent}
.tab.active{background:#fff;border-color:#e8e8e8;border-bottom-color:#fff;color:#1d1d1f;margin-bottom:-1px}
.tab:hover:not(.active){color:#217346}

/* Sheet checkbox */
.sheet-check{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:rgba(0,0,0,.5);cursor:pointer}
.sheet-check input{accent-color:#217346;cursor:pointer}

/* Table */
.tbl-wrap{overflow:auto;max-height:320px}
table{width:100%;border-collapse:collapse;font-size:12px}
thead{position:sticky;top:0;z-index:5}
thead tr{background:#217346}
th{padding:8px 12px;text-align:left;font-weight:700;color:#fff;font-size:10px;letter-spacing:.04em;white-space:nowrap}
td{padding:7px 12px;border-bottom:1px solid #f0f0f0;color:#1d1d1f;vertical-align:top;font-size:11.5px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
tr:hover td{background:#f8fdf9}
tr:last-child td{border-bottom:none}
td:first-child,th:first-child{padding-left:20px}
td:last-child,th:last-child{padding-right:20px}

/* Stat badges */
.stat-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.stat{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:#e8f5ee;border-radius:99px;font-size:10px;font-weight:700;color:#217346}

/* Action bar */
.action-bar{display:flex;gap:10px;flex-wrap:wrap}
.sec-btn{flex:1;min-width:140px;padding:13px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px}
.sec-btn:hover{border-color:#217346;color:#217346}
.pri-btn{flex:1;min-width:140px;padding:13px;background:#217346;border:none;border-radius:10px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 2px 12px rgba(33,115,70,.25)}
.pri-btn:hover{background:#1a5c38}
.pri-btn:disabled{opacity:.4;cursor:not-allowed}

/* Info */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px}
@media(max-width:600px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:16px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:12px;font-weight:700;color:#1d1d1f;margin-bottom:4px}
.info-card p{font-size:11px;color:rgba(0,0,0,.45);line-height:1.6}

/* Error */
.err{padding:11px 14px;background:#fff5f5;border:1px solid rgba(220,38,38,.2);border-radius:9px;font-size:13px;color:#dc2626;margin-bottom:14px}

/* Spinner */
.spin{width:16px;height:16px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
`

// ─── Types ───────────────────────────────────────────────────────────────────
interface Sheet { name: string; rows: string[][] }
type Orientation = 'landscape' | 'portrait'
type ColorScheme = 'green' | 'blue' | 'dark'

// ─── Parsers ─────────────────────────────────────────────────────────────────
function detectDelimiter(line: string): ',' | '\t' | ';' {
  const counts = { ',': 0, '\t': 0, ';': 0 }
  for (const c of line) if (c in counts) counts[c as keyof typeof counts]++
  if (counts['\t'] >= counts[','] && counts['\t'] >= counts[';']) return '\t'
  if (counts[';'] > counts[',']) return ';'
  return ','
}

function parseCSV(text: string): string[][] {
  const delim = detectDelimiter(text.split('\n')[0] ?? '')
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQ = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      if (inQ && text[i + 1] === '"') { cell += '"'; i++ }
      else inQ = !inQ
    } else if (c === delim && !inQ) {
      row.push(cell.trim()); cell = ''
    } else if ((c === '\n' || c === '\r') && !inQ) {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell.trim()); cell = ''
      if (row.some(v => v !== '')) rows.push(row)
      row = []
    } else {
      cell += c
    }
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell.trim())
    if (row.some(v => v !== '')) rows.push(row)
  }
  return rows
}

function parseSpreadsheetML(xml: string): Sheet[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  const sheets: Sheet[] = []
  doc.querySelectorAll('Worksheet').forEach(ws => {
    const name = ws.getAttribute('ss:Name') ?? ws.getAttribute('Name') ?? 'Sheet'
    const rows: string[][] = []
    ws.querySelectorAll('Row').forEach(rowEl => {
      const row: string[] = []
      rowEl.querySelectorAll('Cell').forEach(cell => {
        row.push(cell.querySelector('Data')?.textContent?.trim() ?? '')
      })
      if (row.some(v => v !== '')) rows.push(row)
    })
    if (rows.length) sheets.push({ name, rows })
  })
  return sheets
}

// ─── PDF Generation ──────────────────────────────────────────────────────────
const SCHEME_COLORS = {
  green: { r: 0.13, g: 0.45, b: 0.27 },
  blue:  { r: 0.15, g: 0.39, b: 0.75 },
  dark:  { r: 0.11, g: 0.11, b: 0.13 },
}

async function generatePDF(
  sheets: Sheet[],
  selected: Set<number>,
  orientation: Orientation,
  scheme: ColorScheme,
  filename: string,
): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

  const pdfDoc  = await PDFDocument.create()
  const fontB   = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontR   = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const PW = orientation === 'landscape' ? 841.89 : 595.28
  const PH = orientation === 'landscape' ? 595.28 : 841.89
  const M  = 36
  const UW = PW - M * 2
  const HDR_H = 22
  const ROW_H = 16
  const { r, g, b } = SCHEME_COLORS[scheme]
  const accent = rgb(r, g, b)
  const white  = rgb(1, 1, 1)
  const dark   = rgb(0.1, 0.1, 0.1)
  const mid    = rgb(0.55, 0.55, 0.55)
  const stripe = rgb(0.96, 0.98, 0.96)
  const line   = rgb(0.88, 0.88, 0.88)

  const clamp = (s: string, n: number) => s.length > n ? s.slice(0, n - 1) + '…' : s

  let totalPage = 0

  const activeSheets = sheets.filter((_, i) => selected.has(i))

  for (const sheet of activeSheets) {
    if (!sheet.rows.length) continue
    const headers  = sheet.rows[0] ?? []
    const dataRows = sheet.rows.slice(1)
    const nCols    = headers.length

    // Column widths
    const raw = headers.map((h, ci) => {
      const maxLen = Math.max(h.length, ...dataRows.slice(0, 300).map(r => (r[ci] ?? '').length))
      return Math.max(48, Math.min(190, maxLen * 5.8 + 14))
    })
    const totalRaw = raw.reduce((a, b) => a + b, 0)
    const scale    = totalRaw > UW ? UW / totalRaw : 1
    const colW     = raw.map(w => w * scale)
    const tableW   = colW.reduce((a, b) => a + b, 0)
    const fsH      = Math.max(7, Math.min(9, 9 * scale))
    const fsD      = Math.max(6, Math.min(8, 8 * scale))

    const addPage = () => {
      totalPage++
      return pdfDoc.addPage([PW, PH])
    }

    const drawHeader = (pg: any, y: number) => {
      pg.drawRectangle({ x: M, y: y - HDR_H, width: tableW, height: HDR_H, color: accent })
      let x = M
      headers.forEach((h, ci) => {
        pg.drawText(clamp(h || `Col ${ci + 1}`, Math.floor(colW[ci] / (fsH * 0.55))), {
          x: x + 4, y: y - HDR_H + 6,
          font: fontB, size: fsH, color: white,
        })
        x += colW[ci]
      })
      // column separators
      x = M
      headers.forEach((_, ci) => {
        if (ci < nCols - 1) {
          pg.drawLine({ start: { x: x + colW[ci], y: y - HDR_H }, end: { x: x + colW[ci], y }, thickness: 0.4, color: rgb(0.85, 0.85, 0.85) })
        }
        x += colW[ci]
      })
      return y - HDR_H
    }

    const drawFooter = (pg: any, pgNum: number) => {
      pg.drawText(`${filename}  ·  ${sheet.name}  ·  Page ${pgNum}`, {
        x: M, y: M - 16, font: fontR, size: 7.5, color: mid,
      })
      pg.drawLine({ start: { x: M, y: M - 4 }, end: { x: PW - M, y: M - 4 }, thickness: 0.5, color: line })
    }

    let page = addPage()
    let y = PH - M

    // Sheet title
    page.drawText(sheet.name, { x: M, y: y - 14, font: fontB, size: 15, color: accent })
    page.drawText(`${dataRows.length.toLocaleString()} rows · ${nCols} columns`, {
      x: M, y: y - 28, font: fontR, size: 8, color: mid,
    })
    y -= 48

    y = drawHeader(page, y)

    dataRows.forEach((row, ri) => {
      if (y - ROW_H < M + 10) {
        drawFooter(page, totalPage)
        page = addPage()
        y = PH - M
        y = drawHeader(page, y)
      }

      // Stripe
      if (ri % 2 === 1) {
        page.drawRectangle({ x: M, y: y - ROW_H, width: tableW, height: ROW_H, color: stripe })
      }

      // Row border
      page.drawLine({ start: { x: M, y: y - ROW_H }, end: { x: M + tableW, y: y - ROW_H }, thickness: 0.3, color: line })

      let x = M
      headers.forEach((_, ci) => {
        const val = clamp(String(row[ci] ?? ''), Math.floor(colW[ci] / (fsD * 0.55)))
        page.drawText(val, { x: x + 4, y: y - ROW_H + 4, font: fontR, size: fsD, color: dark })
        x += colW[ci]
      })

      y -= ROW_H
    })

    drawFooter(page, totalPage)
  }

  return pdfDoc.save()
}

// ─── Utils ───────────────────────────────────────────────────────────────────
function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

function fileIcon(name: string) {
  return name.toLowerCase().endsWith('.csv') ? '📋' : '📊'
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ExcelToPDFPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [sheets,      setSheets]      = useState<Sheet[]>([])
  const [selected,    setSelected]    = useState<Set<number>>(new Set())
  const [activeTab,   setActiveTab]   = useState(0)
  const [orientation, setOrientation] = useState<Orientation>('landscape')
  const [scheme,      setScheme]      = useState<ColorScheme>('green')
  const [generating,  setGenerating]  = useState(false)
  const [error,       setError]       = useState('')
  const [isDrop,      setIsDrop]      = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    const name = f.name.toLowerCase()
    if (!name.endsWith('.csv') && !name.endsWith('.xls') && !name.endsWith('.xlsx')) {
      setError('Please upload a .csv or .xls file. (.xlsx not supported — save as CSV or use File → Save As in Excel)'); return
    }
    if (name.endsWith('.xlsx')) {
      setError('.xlsx files are not supported. In Excel go to File → Save As → choose "CSV (Comma delimited)" or "Excel 97-2003 Workbook (.xls)" and re-upload.'); return
    }
    setError(''); setSheets([]); setSelected(new Set())
    try {
      const text = await f.text()
      let parsed: Sheet[]

      if (name.endsWith('.csv')) {
        const rows = parseCSV(text)
        if (!rows.length) { setError('No data found in this CSV file.'); return }
        parsed = [{ name: f.name.replace(/\.csv$/i, ''), rows }]
      } else {
        // .xls — check if SpreadsheetML or binary
        const trimmed = text.trimStart()
        if (!trimmed.startsWith('<?xml') && !trimmed.startsWith('<Workbook') && !trimmed.includes('schemas-microsoft-com')) {
          setError('This .xls file is in binary format. Please open it in Excel and save as CSV or "Excel 97-2003 Workbook" from File → Save As.'); return
        }
        parsed = parseSpreadsheetML(text)
        if (!parsed.length) { setError('No data found in this Excel file.'); return }
      }

      setFile(f)
      setSheets(parsed)
      setSelected(new Set(parsed.map((_, i) => i)))
      setActiveTab(0)
    } catch (e: any) {
      setError('Could not parse file: ' + (e?.message ?? 'unknown error'))
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const toggleSheet = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(i)) { if (next.size > 1) next.delete(i) }
      else next.add(i)
      return next
    })
  }

  const generate = async () => {
    if (!file || !sheets.length || !selected.size) return
    setGenerating(true); setError('')
    try {
      const bytes = await generatePDF(sheets, selected, orientation, scheme, file.name)
      const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      const url   = URL.createObjectURL(blob)
      const a     = document.createElement('a')
      a.href      = url
      a.download  = file.name.replace(/\.(csv|xls)$/i, '') + '.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError('PDF generation failed: ' + (e?.message ?? 'unknown error'))
    } finally {
      setGenerating(false)
    }
  }

  const reset = () => { setFile(null); setSheets([]); setSelected(new Set()); setError(''); setActiveTab(0) }

  const totalRows = Array.from(selected).reduce((s, i) => s + Math.max(0, (sheets[i]?.rows.length ?? 1) - 1), 0)
  const hasData   = sheets.length > 0

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
          <span className="nav-title">Excel / CSV to PDF</span>
          <div className="nav-sp"/>
          <Link href="/" className="back">← All Tools</Link>
        </nav>

        <div className="wrap">

          {/* Hero */}
          <div className="hero">
            <div className="hero-badge">
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#217346', display: 'inline-block' }}/>
              No Upload Required
            </div>
            <h1>Excel / CSV <em>to PDF</em></h1>
            <p>Convert spreadsheets and CSV files into beautifully formatted PDFs — instantly, entirely in your browser.</p>
          </div>

          {!hasData ? (
            /* ── Upload card ─────────────────────────────────────────────── */
            <div className="card">
              {error && <div className="err">⚠ {error}</div>}
              <div className={`drop${isDrop ? ' over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                onDragLeave={() => setIsDrop(false)}>
                <span className="drop-icon">📊</span>
                <h2>Drop your file here</h2>
                <div className="drop-types">
                  <span className="type-badge" style={{ background: '#e8f5ee', color: '#217346' }}>CSV</span>
                  <span className="type-badge" style={{ background: '#e8f0fe', color: '#1a56b2' }}>.XLS</span>
                </div>
                <p>Supports comma, tab &amp; semicolon-separated CSV files<br/>and SpreadsheetML .xls files</p>
                <button className="drop-btn">📄 Choose File</button>
              </div>
            </div>
          ) : (
            /* ── Preview + Settings ──────────────────────────────────────── */
            <>
              {error && <div className="err">⚠ {error}</div>}

              {/* File row */}
              <div className="card" style={{ padding: '16px 20px' }}>
                <div className="file-row" style={{ marginBottom: 0 }}>
                  <div className="file-icon" style={{ background: file?.name.toLowerCase().endsWith('.csv') ? '#e8f5ee' : '#e8f0fe' }}>
                    {fileIcon(file?.name ?? '')}
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file?.name}</div>
                    <div className="file-meta">{fmt(file?.size ?? 0)} · {sheets.length} sheet{sheets.length !== 1 ? 's' : ''} · {totalRows.toLocaleString()} data rows</div>
                  </div>
                  <button className="file-rm" onClick={reset}>×</button>
                </div>
              </div>

              {/* Settings */}
              <div className="card" style={{ padding: 0 }}>
                <div className="settings" style={{ borderRadius: 16 }}>
                  <span className="set-label">Orientation</span>
                  <div className="toggle-group">
                    <button className={`tog${orientation === 'landscape' ? ' on' : ''}`} onClick={() => setOrientation('landscape')}>⬛ Landscape</button>
                    <button className={`tog${orientation === 'portrait' ? ' on' : ''}`} onClick={() => setOrientation('portrait')}>▭ Portrait</button>
                  </div>
                  <div className="set-div"/>
                  <span className="set-label">Color</span>
                  <div className="toggle-group">
                    <button className={`tog${scheme === 'green' ? ' on' : ''}`} onClick={() => setScheme('green')} style={scheme === 'green' ? { background: '#217346', borderColor: '#217346' } : {}}>🟢 Green</button>
                    <button className={`tog${scheme === 'blue' ? ' on' : ''}`}  onClick={() => setScheme('blue')}  style={scheme === 'blue'  ? { background: '#2563eb', borderColor: '#2563eb' } : {}}>🔵 Blue</button>
                    <button className={`tog${scheme === 'dark' ? ' on' : ''}`}  onClick={() => setScheme('dark')}  style={scheme === 'dark'  ? { background: '#1d1d1f', borderColor: '#1d1d1f' } : {}}>⬛ Dark</button>
                  </div>
                  {sheets.length > 1 && (
                    <>
                      <div className="set-div"/>
                      <span className="set-label">Sheets</span>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {sheets.map((s, i) => (
                          <label key={i} className="sheet-check">
                            <input type="checkbox" checked={selected.has(i)} onChange={() => toggleSheet(i)}/>
                            {s.name}
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Table preview */}
              <div className="preview-card">
                <div className="preview-head">
                  <div>
                    <div className="preview-title">Preview</div>
                    <div className="preview-sub">First 50 rows shown · scroll right for more columns</div>
                  </div>
                  <div className="stat-row" style={{ margin: 0 }}>
                    <span className="stat">📊 {sheets[activeTab]?.rows[0]?.length ?? 0} cols</span>
                    <span className="stat">📋 {Math.max(0, (sheets[activeTab]?.rows.length ?? 1) - 1)} rows</span>
                  </div>
                </div>

                {sheets.length > 1 && (
                  <div className="tabs">
                    {sheets.map((s, i) => (
                      <div key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}

                {sheets[activeTab] && (() => {
                  const sh = sheets[activeTab]
                  const headers = sh.rows[0] ?? []
                  const dataRows = sh.rows.slice(1, 51)
                  return (
                    <div className="tbl-wrap">
                      <table>
                        <thead>
                          <tr>{headers.map((h, i) => <th key={i}>{h || `Col ${i + 1}`}</th>)}</tr>
                        </thead>
                        <tbody>
                          {dataRows.length === 0 ? (
                            <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: 24, color: 'rgba(0,0,0,.3)' }}>No data rows</td></tr>
                          ) : dataRows.map((row, ri) => (
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
                <button className="pri-btn" onClick={generate} disabled={generating || !selected.size}>
                  {generating ? <><div className="spin"/> Generating PDF…</> : '⬇ Download PDF'}
                </button>
              </div>
            </>
          )}

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>🔒 100% Private</h3>
              <p>Everything happens in your browser. Your file never leaves your device — no uploads, no servers.</p>
            </div>
            <div className="info-card">
              <h3>📄 Multi-Sheet Support</h3>
              <p>Excel files with multiple sheets are each converted to their own section. Choose which sheets to include.</p>
            </div>
            <div className="info-card">
              <h3>🎨 Custom Styling</h3>
              <p>Choose landscape or portrait orientation and a header color scheme to match your brand or document type.</p>
            </div>
          </div>

        </div>
      </div>

      <input ref={fileRef} type="file" accept=".csv,.xls" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = '' }}/>
    </>
  )
}
