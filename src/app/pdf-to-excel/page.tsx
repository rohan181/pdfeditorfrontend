'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

const GREEN = '#217346'
const LIGHT_GREEN = '#e8f5ee'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

.pg{min-height:100vh;background:#f5f5f7;padding-top:56px;}

/* Nav */

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
.wrap{max-width:860px;margin:0 auto;padding:40px 20px 80px}

/* Hero */
.hero{text-align:center;margin-bottom:36px;animation:fadeup .3s ease}
.hero-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#e8f5ee;border:1px solid rgba(33,115,70,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#217346;margin-bottom:14px;text-transform:uppercase}
.hero h1{font-size:clamp(26px,5vw,42px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;margin-bottom:8px}
.hero h1 em{font-style:normal;color:#217346}
.hero p{font-size:14px;color:rgba(0,0,0,.45);line-height:1.7;max-width:420px;margin:0 auto}

/* Card */
.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:28px;margin-bottom:18px;box-shadow:0 2px 16px rgba(0,0,0,.04)}

/* Drop zone */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.over{border-color:#217346;background:#e8f5ee}
.drop-icon{font-size:44px;margin-bottom:12px;display:block}
.drop h2{font-size:18px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:18px}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:background .15s}
.drop-btn:hover{background:#217346}

/* File row */
.file-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:18px}
.file-icon{width:36px;height:36px;background:#217346;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.file-meta{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.file-rm{width:26px;height:38px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:13px;transition:all .15s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Convert button */
.convert-btn{width:100%;padding:14px;background:#217346;border:none;border-radius:10px;font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.convert-btn:hover:not(:disabled){background:#1a5c38;transform:translateY(-1px);box-shadow:0 4px 16px rgba(33,115,70,.35)}
.convert-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}

/* Progress */
.prog-wrap{margin-top:14px}
.prog-bar{height:3px;background:#e0e0e0;border-radius:99px;overflow:hidden;margin-bottom:6px}
.prog-fill{height:100%;background:#217346;border-radius:99px;transition:width .3s ease}
.prog-label{font-size:10px;color:rgba(0,0,0,.4);text-align:center;letter-spacing:.05em;text-transform:uppercase;animation:pulse .9s infinite}

/* Results */
.result-card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;overflow:hidden;margin-bottom:18px;animation:fadeup .3s ease;box-shadow:0 2px 16px rgba(0,0,0,.04)}
.result-head{padding:16px 20px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.result-title{font-size:15px;font-weight:800;color:#1d1d1f}
.result-sub{font-size:11px;color:rgba(0,0,0,.4);margin-top:2px}
.dl-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:#217346;border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;white-space:nowrap}
.dl-btn:hover{background:#1a5c38;transform:translateY(-1px)}

/* Sheet tabs */
.tabs{display:flex;gap:4px;padding:12px 20px 0;border-bottom:1px solid #f0f0f0;overflow-x:auto}
.tab{padding:7px 14px;border-radius:8px 8px 0 0;font-size:11px;font-weight:700;cursor:pointer;border:1px solid transparent;border-bottom:none;transition:all .14s;white-space:nowrap;color:rgba(0,0,0,.45);background:transparent}
.tab.active{background:#fff;border-color:#e8e8e8;border-bottom-color:#fff;color:#1d1d1f;margin-bottom:-1px}
.tab:hover:not(.active){color:#217346}

/* Table preview */
.tbl-wrap{overflow:auto;max-height:360px;padding:0}
table{width:100%;border-collapse:collapse;font-size:12px}
thead{position:sticky;top:0;z-index:5}
thead tr{background:#f8f8f8}
th{padding:9px 12px;text-align:left;font-weight:700;color:#1d1d1f;border-bottom:2px solid #e0e0e0;white-space:nowrap;font-size:11px;letter-spacing:.02em}
td{padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#1d1d1f;vertical-align:top;font-size:12px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafafa}
td:first-child,th:first-child{padding-left:20px}
td:last-child,th:last-child{padding-right:20px}

/* Row count badge */
.row-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;background:#e8f5ee;border-radius:99px;font-size:10px;font-weight:700;color:#217346}

/* Format selector */
.fmt-bar{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid #f0f0f0;background:#fafafa;flex-wrap:wrap}
.fmt-label{font-size:10px;font-weight:700;letter-spacing:.07em;color:rgba(0,0,0,.38);text-transform:uppercase;white-space:nowrap}
.fmt-group{display:flex;gap:5px;flex-wrap:wrap}
.fmt-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid #e0e0e0;background:#fff;color:rgba(0,0,0,.5);transition:all .15s;white-space:nowrap}
.fmt-btn:hover:not(.active){border-color:#217346;color:#217346}
.fmt-btn.active{background:#217346;border-color:#217346;color:#fff}
.fmt-ext{font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:rgba(255,255,255,.25);letter-spacing:.04em}
.fmt-btn:not(.active) .fmt-ext{background:rgba(0,0,0,.06);color:rgba(0,0,0,.4)}

/* Action bar */
.action-bar{display:flex;gap:10px;flex-wrap:wrap}
.sec-btn{flex:1;min-width:140px;padding:13px;background:#fff;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-weight:600;color:#1d1d1f;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px}
.sec-btn:hover{border-color:#217346;color:#217346}
.pri-btn{flex:1;min-width:140px;padding:13px;background:#217346;border:none;border-radius:10px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px}
.pri-btn:hover{background:#1a5c38}

/* Info cards */
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

interface Sheet { name: string; rows: string[][] }

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function toSpreadsheetML(sheets: Sheet[]): string {
  const xmlSheets = sheets.map(s => {
    const rows = s.rows.map(row =>
      `      <Row>${row.map(cell =>
        `<Cell><Data ss:Type="String">${escapeXml(String(cell ?? ''))}</Data></Cell>`
      ).join('')}</Row>`
    ).join('\n')
    return `  <Worksheet ss:Name="${escapeXml(s.name.slice(0, 31))}">\n    <Table>\n${rows}\n    </Table>\n  </Worksheet>`
  }).join('\n')

  return `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n${xmlSheets}\n</Workbook>`
}

function triggerDL(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function downloadExcel(sheets: Sheet[], filename: string) {
  triggerDL(toSpreadsheetML(sheets), 'application/vnd.ms-excel', filename.replace(/\.pdf$/i, '') + '.xls')
}

function rowsToDelimited(rows: string[][], delim: string): string {
  const esc = (v: string) => {
    const s = String(v ?? '')
    return s.includes(delim) || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  return rows.map(r => r.map(esc).join(delim)).join('\r\n')
}

function downloadCSV(sheets: Sheet[], filename: string) {
  const base = filename.replace(/\.pdf$/i, '')
  if (sheets.length === 1) {
    triggerDL(rowsToDelimited(sheets[0].rows, ','), 'text/csv', `${base}.csv`)
  } else {
    // Multiple sheets: download each as a separate file with a short delay
    sheets.forEach((s, i) => {
      setTimeout(() => {
        triggerDL(rowsToDelimited(s.rows, ','), 'text/csv', `${base} - ${s.name}.csv`)
      }, i * 300)
    })
  }
}

function downloadTSV(sheets: Sheet[], filename: string) {
  const base = filename.replace(/\.pdf$/i, '')
  if (sheets.length === 1) {
    triggerDL(rowsToDelimited(sheets[0].rows, '\t'), 'text/tab-separated-values', `${base}.tsv`)
  } else {
    sheets.forEach((s, i) => {
      setTimeout(() => {
        triggerDL(rowsToDelimited(s.rows, '\t'), 'text/tab-separated-values', `${base} - ${s.name}.tsv`)
      }, i * 300)
    })
  }
}

function downloadJSON(sheets: Sheet[], filename: string) {
  const obj: Record<string, Record<string, string>[]> = {}
  sheets.forEach(s => {
    const headers = s.rows[0] ?? []
    obj[s.name] = s.rows.slice(1).map(row => {
      const rec: Record<string, string> = {}
      headers.forEach((h, i) => { rec[h || `col${i + 1}`] = row[i] ?? '' })
      return rec
    })
  })
  triggerDL(JSON.stringify(obj, null, 2), 'application/json', filename.replace(/\.pdf$/i, '') + '.json')
}

type Format = 'xls' | 'csv' | 'tsv' | 'json'

const FORMAT_META: Record<Format, { label: string; ext: string; icon: string; desc: string }> = {
  xls:  { label: 'Excel',  ext: '.xls',  icon: '📊', desc: 'Open in Microsoft Excel or Google Sheets' },
  csv:  { label: 'CSV',    ext: '.csv',  icon: '📋', desc: 'Plain text, works in any spreadsheet app' },
  tsv:  { label: 'TSV',    ext: '.tsv',  icon: '📄', desc: 'Tab-separated, good for databases & imports' },
  json: { label: 'JSON',   ext: '.json', icon: '🔧', desc: 'Structured data for developers & APIs' },
}

function doDownload(fmt: Format, sheets: Sheet[], filename: string) {
  if (fmt === 'xls')  downloadExcel(sheets, filename)
  if (fmt === 'csv')  downloadCSV(sheets, filename)
  if (fmt === 'tsv')  downloadTSV(sheets, filename)
  if (fmt === 'json') downloadJSON(sheets, filename)
}

export default function PDFToExcelPage() {
  const [file,        setFile]        = useState<File | null>(null)
  const [pageCount,   setPageCount]   = useState(0)
  const [isDrop,      setIsDrop]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [step,        setStep]        = useState('')
  const [progress,    setProgress]    = useState(0)
  const [sheets,      setSheets]      = useState<Sheet[]>([])
  const [activeSheet, setActiveSheet] = useState(0)
  const [format,      setFormat]      = useState<Format>('xls')
  const [error,       setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setSheets([]); setFile(f); setPageCount(0)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      setPageCount(doc.numPages)
    } catch (e: any) {
      setError('Could not read PDF: ' + (e?.message ?? 'unknown error'))
      setFile(null)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const convert = async () => {
    if (!file) return
    setLoading(true); setError(''); setSheets([]); setActiveSheet(0); setProgress(10)

    try {
      setStep('Extracting text from PDF…')
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      let fullText = ''
      for (let p = 1; p <= doc.numPages; p++) {
        const pg = await doc.getPage(p)
        const tc = await pg.getTextContent()
        fullText += (tc.items as any[]).map((i: any) => i.str).join(' ') + '\n'
        setProgress(10 + Math.round((p / doc.numPages) * 35))
      }
      fullText = fullText.replace(/\s+/g, ' ').trim()

      if (fullText.length < 10) {
        setError('No readable text found. This may be a scanned image PDF — try PDF OCR first.')
        return
      }

      setStep('Sending to AI for data extraction…')
      setProgress(50)

      const res = await fetch('/api/pdf-to-excel', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: fullText, filename: file.name }),
      })

      setProgress(90)
      setStep('Building spreadsheet…')

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? `Server error ${res.status}`)
      }

      const data = await res.json()
      setSheets(data.sheets)
      setProgress(100)
    } catch (e: any) {
      setError(e.message ?? 'Conversion failed. Please try again.')
    } finally {
      setLoading(false); setStep('')
    }
  }

  const totalRows = sheets.reduce((s, sh) => s + Math.max(0, sh.rows.length - 1), 0)
  const hasResult = sheets.length > 0 && !loading

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
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN, display: 'inline-block' }}/>
              AI-Powered
            </div>
            <h1>PDF to <em>Excel</em></h1>
            <p>Extract tables and structured data from any PDF and download as a ready-to-edit Excel spreadsheet.</p>
          </div>

          {/* Upload / Convert card */}
          {!hasResult ? (
            <div className="card">
              {error && <div className="err">⚠ {error}</div>}

              {!file ? (
                <div className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}>
                  <span className="drop-icon">📊</span>
                  <h2>Drop your PDF here</h2>
                  <p>Upload a PDF containing tables, data, invoices, or reports</p>
                  <button className="drop-btn">📄 Choose PDF</button>
                </div>
              ) : (
                <>
                  <div className="file-row">
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <div className="file-name" title={file.name}>{file.name}</div>
                      <div className="file-meta">{fmt(file.size)}{pageCount ? ` · ${pageCount} pages` : ''}</div>
                    </div>
                    <button className="file-rm" onClick={() => { setFile(null); setPageCount(0); setError('') }}>×</button>
                  </div>

                  <button className="convert-btn" onClick={convert} disabled={loading}>
                    {loading ? <><div className="spin"/>{step || 'Converting…'}</> : '✦ Convert to Excel'}
                  </button>

                  {loading && (
                    <div className="prog-wrap">
                      <div className="prog-bar"><div className="prog-fill" style={{ width: `${progress}%` }}/></div>
                      <div className="prog-label">{step}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (

            /* Results */
            <>
              <div className="result-card">
                <div className="result-head">
                  <div>
                    <div className="result-title">✅ Extraction Complete</div>
                    <div className="result-sub">
                      {sheets.length} sheet{sheets.length !== 1 ? 's' : ''} · {totalRows.toLocaleString()} data rows
                    </div>
                  </div>
                </div>

                {/* Format selector */}
                <div className="fmt-bar">
                  <span className="fmt-label">Download as</span>
                  <div className="fmt-group">
                    {(Object.keys(FORMAT_META) as Format[]).map(f => (
                      <button key={f} className={`fmt-btn${format === f ? ' active' : ''}`} onClick={() => setFormat(f)}>
                        {FORMAT_META[f].icon} {FORMAT_META[f].label}
                        <span className="fmt-ext">{FORMAT_META[f].ext}</span>
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(0,0,0,.35)', marginLeft: 4 }}>
                    {FORMAT_META[format].desc}
                    {(format === 'csv' || format === 'tsv') && sheets.length > 1 && ' · one file per sheet'}
                  </span>
                </div>

                {/* Sheet tabs */}
                {sheets.length > 1 && (
                  <div className="tabs">
                    {sheets.map((s, i) => (
                      <div key={i} className={`tab${activeSheet === i ? ' active' : ''}`}
                        onClick={() => setActiveSheet(i)}>
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Table preview */}
                {sheets[activeSheet] && (() => {
                  const sh = sheets[activeSheet]
                  const headers = sh.rows[0] ?? []
                  const dataRows = sh.rows.slice(1)
                  return (
                    <div className="tbl-wrap">
                      <table>
                        <thead>
                          <tr>
                            {headers.map((h, i) => <th key={i}>{h || `Col ${i + 1}`}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {dataRows.length === 0 ? (
                            <tr><td colSpan={headers.length} style={{ textAlign: 'center', color: 'rgba(0,0,0,.3)', padding: '24px' }}>No data rows</td></tr>
                          ) : (
                            dataRows.map((row, ri) => (
                              <tr key={ri}>
                                {headers.map((_, ci) => <td key={ci} title={row[ci] ?? ''}>{row[ci] ?? ''}</td>)}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                })()}
              </div>

              {/* Row count + actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div className="row-badge">
                  📊 {sheets[activeSheet]?.rows[0]?.length ?? 0} columns · {Math.max(0, (sheets[activeSheet]?.rows.length ?? 1) - 1)} rows
                </div>
              </div>

              <div className="action-bar">
                <button className="sec-btn" onClick={() => { setSheets([]); setFile(null); setPageCount(0); setError('') }}>
                  ← Convert Another PDF
                </button>
                <button className="pri-btn" onClick={() => doDownload(format, sheets, file!.name)}>
                  ⬇ Download {FORMAT_META[format].ext.toUpperCase()}
                </button>
              </div>
            </>
          )}

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>🤖 AI-Powered Extraction</h3>
              <p>Claude reads your PDF and intelligently identifies tables, invoices, reports, and structured data — even from complex layouts.</p>
            </div>
            <div className="info-card">
              <h3>📋 Multiple Sheets</h3>
              <p>Each table or data section is placed on its own sheet, keeping your data clean and organized in the output Excel file.</p>
            </div>
            <div className="info-card">
              <h3>🔒 Private &amp; Secure</h3>
              <p>Your PDF is processed directly in your browser. Only the extracted text is sent to the AI — no file uploads to third-party servers.</p>
            </div>
          </div>

        </div>
      </div>

      <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = '' }}/>
      <ToolSEOSection {...toolSeoData['pdf-to-excel']} />
    </>
  )
}
