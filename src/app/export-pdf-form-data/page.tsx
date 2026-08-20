'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Braces,
  Check,
  FileJson,
  FileSpreadsheet,
  FileText,
  FormInput,
  Info,
  ListChecks,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  TableProperties,
  UploadCloud,
  X,
} from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import ToolQuickFacts from '@/components/ToolQuickFacts'
import { trackEvent } from '@/lib/analytics'
import toolSeoData from '@/lib/toolSeoData'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_PAGES = 500
const MAX_FIELDS = 5_000
const PREVIEW_LIMIT = 100

type FieldType = 'Text' | 'Checkbox' | 'Radio group' | 'Dropdown' | 'Option list' | 'Button' | 'Signature' | 'Unknown'
type FormValue = string | boolean | string[]

type FormFieldRow = {
  name: string
  type: FieldType
  value: FormValue
  empty: boolean
  pages: number[]
  widgetCount: number
  required: boolean
  readOnly: boolean
  exported: boolean
  options: string[]
  maxLength: number | null
  multiline: boolean | null
}

type Inspection = {
  pageCount: number
  fields: FormFieldRow[]
  xfa: boolean
  orphanWidgets: number
  unreadableValues: number
  signatureFields: number
  warnings: string[]
}

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.form-export-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.form-export-wrap{width:min(1080px,calc(100% - 40px));margin:0 auto}
.form-export-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(8,145,178,.13),transparent 40%),linear-gradient(180deg,#f4fdff 0%,#fff 100%)}.form-export-hero::before,.form-export-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(8,145,178,.1);border-radius:999px}.form-export-hero::before{width:350px;height:350px;left:-220px;top:-220px}.form-export-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.form-export-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(8,145,178,.22);border-radius:999px;background:#fff;color:#0e7490;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(8,145,178,.08)}.form-export-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.form-export-hero h1 span{color:#0891b2}.form-export-hero p{max-width:680px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.form-export-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.form-export-trust span{display:flex;align-items:center;gap:5px}
.form-export-main{padding:38px 0 72px}.form-export-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.form-export-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.form-export-drop:hover,.form-export-drop.dragging{border-color:#0891b2;background:#ecfeff;transform:translateY(-1px)}.form-export-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#0e7490,#22d3ee);color:#fff;box-shadow:0 12px 28px rgba(8,145,178,.24)}.form-export-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.form-export-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.form-export-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.form-export-private{margin-top:13px;color:#0e7490;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.form-export-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #a5f3fc;border-radius:13px;background:#ecfeff}.form-export-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#cffafe;color:#0e7490;flex:0 0 auto}.form-export-file-info{min-width:0;flex:1}.form-export-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.form-export-file-size{margin-top:3px;color:#64748b;font-size:10px}.form-export-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #a5f3fc;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.form-export-remove:hover{border-color:#ef4444;color:#ef4444}
.form-export-progress{padding:26px 4px 10px;text-align:center}.form-export-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#cffafe;color:#0e7490;animation:form-export-pulse 1.5s ease-in-out infinite}.form-export-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.form-export-progress p{margin:0;color:#64748b;font-size:12px}
.form-export-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}
.form-export-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.form-export-stat{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.form-export-stat strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em;color:#0e7490}.form-export-stat span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}
.form-export-types{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.form-export-type{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;color:#475569;font-size:9px;font-weight:750}.form-export-type b{color:#0e7490}
.form-export-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:13px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.form-export-warning svg{flex:0 0 auto;margin-top:1px}
.form-export-toolbar{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:18px;padding:14px;border:1px solid #e2e8f0;border-radius:13px;background:#fff}.form-export-option{display:flex;align-items:flex-start;gap:9px;cursor:pointer}.form-export-option input{width:16px;height:16px;margin-top:1px;accent-color:#0891b2}.form-export-option strong{display:block;font-size:11px}.form-export-option span{display:block;margin-top:3px;color:#64748b;font-size:9px}.form-export-actions{display:flex;gap:8px}.form-export-download{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 13px;border:0;border-radius:9px;color:#fff;font-size:10px;font-weight:800;cursor:pointer}.form-export-download.csv{background:#15803d}.form-export-download.json{background:#0e7490}.form-export-download:disabled{opacity:.45;cursor:not-allowed}
.form-export-table-wrap{margin-top:14px;overflow:auto;border:1px solid #e2e8f0;border-radius:13px}.form-export-table{width:100%;border-collapse:collapse;min-width:850px}.form-export-table th{position:sticky;top:0;padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:left;font-size:8px;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}.form-export-table td{max-width:230px;padding:11px 12px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:10px;vertical-align:top}.form-export-table tr:last-child td{border-bottom:0}.form-export-name{font-weight:750;color:#172033;word-break:break-word}.form-export-value{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.form-export-muted{color:#94a3b8;font-style:italic}.form-export-pill{display:inline-flex;padding:4px 7px;border-radius:999px;background:#ecfeff;color:#0e7490;font-size:8px;font-weight:800}.form-export-flags{display:flex;flex-wrap:wrap;gap:4px}.form-export-flag{padding:3px 5px;border-radius:5px;background:#f1f5f9;color:#475569;font-size:7px;font-weight:750}.form-export-caption{padding:9px 12px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:9px}
.form-export-empty{text-align:center;padding:26px 8px 8px}.form-export-empty-icon{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 16px;border-radius:19px;background:#f1f5f9;color:#64748b}.form-export-empty h2{margin:0 0 8px;font:800 21px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.form-export-empty p{max-width:560px;margin:0 auto;color:#64748b;font-size:12px;line-height:1.65}.form-export-again{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;margin-top:17px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.form-export-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.form-export-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.form-export-info svg{color:#0891b2}.form-export-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.form-export-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes form-export-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:760px){.form-export-wrap{width:min(100% - 28px,1080px)}.form-export-hero{padding:56px 0 36px}.form-export-card{padding:18px;border-radius:17px}.form-export-drop{padding:42px 14px}.form-export-summary{grid-template-columns:1fr 1fr}.form-export-toolbar{align-items:stretch;flex-direction:column}.form-export-actions{display:grid;grid-template-columns:1fr 1fr}.form-export-info{grid-template-columns:1fr}.form-export-main{padding-top:25px}}
`

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function sizeBucket(bytes: number): string {
  if (bytes < 1024 * 1024) return 'under_1mb'
  if (bytes < 10 * 1024 * 1024) return '1mb_to_10mb'
  if (bytes < 50 * 1024 * 1024) return '10mb_to_50mb'
  return '50mb_plus'
}

function safeBaseName(filename: string): string {
  return filename.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '') || 'pdf'
}

function displayValue(value: FormValue): string {
  if (typeof value === 'boolean') return value ? 'Checked' : 'Unchecked'
  if (Array.isArray(value)) return value.join('; ')
  return value
}

function isEmptyValue(value: FormValue): boolean {
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return value.length === 0
  return value.trim().length === 0 || value === 'Unsigned'
}

function csvCell(value: string | number | boolean | null): string {
  const raw = value === null ? '' : String(value)
  const protectedValue = /^\s*[=+\-@]/.test(raw) ? `'${raw}` : raw
  return `"${protectedValue.replace(/"/g, '""')}"`
}

function createCsv(fields: FormFieldRow[]): string {
  const headers = ['field_name', 'field_type', 'value', 'page_numbers', 'required', 'read_only', 'exported', 'options', 'widget_count', 'max_length', 'multiline']
  const lines = fields.map(field => [
    field.name,
    field.type,
    Array.isArray(field.value) ? JSON.stringify(field.value) : field.value,
    field.pages.join(';'),
    field.required,
    field.readOnly,
    field.exported,
    field.options.length ? JSON.stringify(field.options) : '',
    field.widgetCount,
    field.maxLength,
    field.multiline,
  ].map(csvCell).join(','))
  return `\uFEFF${headers.map(csvCell).join(',')}\r\n${lines.join('\r\n')}\r\n`
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

function failureCode(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  if (message.includes('password') || message.includes('encrypted')) return 'password_protected'
  if (message.includes('page')) return 'page_limit'
  if (message.includes('field')) return 'field_limit'
  if (message.includes('header') || message.includes('invalid') || message.includes('parse')) return 'invalid_pdf'
  return 'processing_error'
}

async function inspectFormData(bytes: Uint8Array): Promise<Inspection> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const pageCount = document.getPageCount()
  if (pageCount > MAX_PAGES) throw new Error(`This PDF has ${pageCount} pages. The form export limit is ${MAX_PAGES} pages.`)

  const acroFormDictionary = document.catalog.lookup(pdfLib.PDFName.of('AcroForm'))
  const xfaKey = pdfLib.PDFName.of('XFA')
  const xfa = acroFormDictionary instanceof pdfLib.PDFDict && acroFormDictionary.has(xfaKey)
  // PDFDocument.getForm() warns and removes XFA automatically. Record it first,
  // then remove it only from this in-memory read copy so standard fields remain usable.
  if (xfa && acroFormDictionary instanceof pdfLib.PDFDict) acroFormDictionary.delete(xfaKey)
  const form = document.getForm()
  const rawFields = form.getFields()
  if (rawFields.length > MAX_FIELDS) throw new Error(`This PDF has ${rawFields.length} fields. The form export limit is ${MAX_FIELDS} fields.`)

  const subtypeKey = pdfLib.PDFName.of('Subtype')
  const pageByRef = new Map<string, number>()
  const widgetPages = new Map<object, Set<number>>()
  const pageWidgets = new Set<object>()

  document.getPages().forEach((page, pageIndex) => {
    const pageNumber = pageIndex + 1
    pageByRef.set(page.ref.toString(), pageNumber)
    const annotations = page.node.Annots()
    if (!annotations) return
    for (let index = 0; index < annotations.size(); index += 1) {
      const annotation = document.context.lookup(annotations.get(index))
      if (!(annotation instanceof pdfLib.PDFDict) || annotation.get(subtypeKey)?.toString() !== '/Widget') continue
      pageWidgets.add(annotation)
      const pages = widgetPages.get(annotation) ?? new Set<number>()
      pages.add(pageNumber)
      widgetPages.set(annotation, pages)
    }
  })

  let unreadableValues = 0
  let signatureFields = 0
  const canonicalWidgets = new Set<object>()
  const fields: FormFieldRow[] = rawFields.map(field => {
    const widgets = field.acroField.getWidgets()
    const pages = new Set<number>()
    widgets.forEach(widget => {
      canonicalWidgets.add(widget.dict)
      widgetPages.get(widget.dict)?.forEach(page => pages.add(page))
      const pageRef = widget.P()
      if (pageRef) {
        const page = pageByRef.get(pageRef.toString())
        if (page) pages.add(page)
      }
    })

    let type: FieldType = 'Unknown'
    let value: FormValue = ''
    let options: string[] = []
    let maxLength: number | null = null
    let multiline: boolean | null = null
    try {
      if (field instanceof pdfLib.PDFTextField) {
        type = 'Text'
        value = field.getText() ?? ''
        maxLength = field.getMaxLength() ?? null
        multiline = field.isMultiline()
      } else if (field instanceof pdfLib.PDFCheckBox) {
        type = 'Checkbox'
        value = field.isChecked()
      } else if (field instanceof pdfLib.PDFRadioGroup) {
        type = 'Radio group'
        value = field.getSelected() ?? ''
        options = field.getOptions()
      } else if (field instanceof pdfLib.PDFDropdown) {
        type = 'Dropdown'
        value = field.getSelected()
        options = field.getOptions()
      } else if (field instanceof pdfLib.PDFOptionList) {
        type = 'Option list'
        value = field.getSelected()
        options = field.getOptions()
      } else if (field instanceof pdfLib.PDFButton) {
        type = 'Button'
      } else if (field instanceof pdfLib.PDFSignature) {
        type = 'Signature'
        signatureFields += 1
        value = field.acroField.V() ? 'Signed' : 'Unsigned'
      }
    } catch {
      unreadableValues += 1
      value = '[Unreadable value]'
    }

    return {
      name: field.getName(),
      type,
      value,
      empty: isEmptyValue(value),
      pages: Array.from(pages).sort((a, b) => a - b),
      widgetCount: widgets.length,
      required: field.isRequired(),
      readOnly: field.isReadOnly(),
      exported: field.isExported(),
      options,
      maxLength,
      multiline,
    }
  })

  const orphanWidgets = Array.from(pageWidgets).filter(widget => !canonicalWidgets.has(widget)).length
  const warnings: string[] = []
  if (signatureFields) warnings.push(`${signatureFields} signature field${signatureFields === 1 ? '' : 's'} found. Only Signed or Unsigned status is exported; cryptographic contents, certificates, and signer details are omitted.`)
  if (xfa) warnings.push('XFA data was detected. Dynamic XFA datasets are not supported; only standard AcroForm fields listed below are exported.')
  if (orphanWidgets) warnings.push(`${orphanWidgets} orphan widget annotation${orphanWidgets === 1 ? '' : 's'} could not be matched safely to the form field tree and ${orphanWidgets === 1 ? 'was' : 'were'} not exported.`)
  if (unreadableValues) warnings.push(`${unreadableValues} field value${unreadableValues === 1 ? '' : 's'} could not be decoded and ${unreadableValues === 1 ? 'is' : 'are'} marked as unreadable.`)

  return { pageCount, fields, xfa, orphanWidgets, unreadableValues, signatureFields, warnings }
}

export default function ExportPDFFormDataPage() {
  const [file, setFile] = useState<File | null>(null)
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [includeEmpty, setIncludeEmpty] = useState(true)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setFile(null)
    setInspection(null)
    setDragging(false)
    setProcessing(false)
    setIncludeEmpty(true)
    setError('')
    if (fileInput.current) fileInput.current.value = ''
  }, [])

  const handleFile = useCallback(async (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith('.pdf')) { setError('Please select a PDF file.'); return }
    if (!candidate.size) { setError('This PDF is empty.'); return }
    if (candidate.size > MAX_FILE_SIZE) { setError('Please select a PDF smaller than 100 MB.'); return }

    setFile(candidate)
    setInspection(null)
    setProcessing(true)
    setIncludeEmpty(true)
    setError('')
    void trackEvent('pdf_form_data_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(1024, bytes.length)))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const result = await inspectFormData(bytes)
      setInspection(result)
      void trackEvent('pdf_form_data_scan_completed', {
        file_size: sizeBucket(candidate.size),
        pages: result.pageCount,
        fields: result.fields.length,
        signatures: result.signatureFields,
        xfa: result.xfa,
        orphan_widgets: result.orphanWidgets,
      })
    } catch (reason) {
      const code = failureCode(reason)
      const message = reason instanceof Error ? reason.message : 'The PDF could not be read.'
      setError(code === 'password_protected' ? 'This PDF is password-protected. Unlock it with the known password before exporting form data.' : message)
      setInspection(null)
      void trackEvent('pdf_form_data_scan_failed', { file_size: sizeBucket(candidate.size), reason: code })
    } finally {
      setProcessing(false)
    }
  }, [])

  const exportedFields = useMemo(() => inspection?.fields.filter(field => includeEmpty || !field.empty) ?? [], [inspection, includeEmpty])
  const typeCounts = useMemo(() => {
    const counts = new Map<FieldType, number>()
    inspection?.fields.forEach(field => counts.set(field.type, (counts.get(field.type) ?? 0) + 1))
    return Array.from(counts.entries())
  }, [inspection])

  const download = useCallback((format: 'csv' | 'json') => {
    if (!inspection || !file) return
    const base = safeBaseName(file.name)
    if (format === 'csv') {
      triggerDownload(new Blob([createCsv(exportedFields)], { type: 'text/csv;charset=utf-8' }), `${base}_form_data.csv`)
    } else {
      const payload = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        source: {
          pageCount: inspection.pageCount,
          detectedFieldCount: inspection.fields.length,
          exportedFieldCount: exportedFields.length,
          xfaDetected: inspection.xfa,
          orphanWidgetCount: inspection.orphanWidgets,
        },
        warnings: inspection.warnings,
        fields: exportedFields,
      }
      triggerDownload(new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json;charset=utf-8' }), `${base}_form_data.json`)
    }
    void trackEvent('pdf_form_data_downloaded', { format, fields: exportedFields.length, include_empty: includeEmpty })
  }, [inspection, file, exportedFields, includeEmpty])

  const seo = toolSeoData['export-pdf-form-data']

  return <div className="form-export-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <SiteNav />
    <section className="form-export-hero">
      <div className="form-export-wrap">
        <div className="form-export-badge"><TableProperties size={12} /> Structured AcroForm export</div>
        <h1>Export PDF <span>Form Data</span></h1>
        <p>Inspect fillable fields and download their values, types, flags, options, and page locations as safe CSV or structured JSON.</p>
        <div className="form-export-trust">
          <span><ShieldCheck size={13} /> Files stay on your device</span>
          <span><Check size={13} /> Source PDF stays unchanged</span>
          <span><Check size={13} /> Signature contents omitted</span>
        </div>
      </div>
    </section>

    <main className="form-export-main">
      <div className="form-export-wrap">
        <section className="form-export-card">
          {error && <div className="form-export-error" role="alert"><AlertTriangle size={16} /> <span>{error}</span></div>}

          {!file && <label
            className={`form-export-drop${dragging ? ' dragging' : ''}`}
            onDragEnter={event => { event.preventDefault(); setDragging(true) }}
            onDragOver={event => event.preventDefault()}
            onDragLeave={event => { event.preventDefault(); setDragging(false) }}
            onDrop={event => { event.preventDefault(); setDragging(false); const candidate = event.dataTransfer.files[0]; if (candidate) void handleFile(candidate) }}
          >
            <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} />
            <span className="form-export-drop-icon"><UploadCloud size={27} /></span>
            <h2>Drop a fillable PDF here</h2>
            <p>Choose one PDF up to 100 MB. Standard AcroForm fields are read automatically.</p>
            <span className="form-export-choose">Choose PDF <FileText size={15} /></span>
            <div className="form-export-private">Local browser processing</div>
          </label>}

          {file && <>
            <div className="form-export-file">
              <span className="form-export-file-icon"><FormInput size={20} /></span>
              <div className="form-export-file-info">
                <div className="form-export-file-name">{file.name}</div>
                <div className="form-export-file-size">{formatBytes(file.size)}</div>
              </div>
              <button className="form-export-remove" type="button" aria-label="Remove PDF" onClick={reset}><X size={16} /></button>
            </div>

            {processing && <div className="form-export-progress" aria-live="polite">
              <span className="form-export-progress-icon"><ScanSearch size={27} /></span>
              <h2>Reading form fields</h2>
              <p>Mapping values, field flags, options, widgets, and page locations locally…</p>
            </div>}

            {!processing && inspection && inspection.fields.length > 0 && <>
              <div className="form-export-summary">
                <div className="form-export-stat"><strong>{inspection.fields.length}</strong><span>Fields found</span></div>
                <div className="form-export-stat"><strong>{inspection.pageCount}</strong><span>PDF pages</span></div>
                <div className="form-export-stat"><strong>{inspection.fields.filter(field => !field.empty).length}</strong><span>With values</span></div>
                <div className="form-export-stat"><strong>{typeCounts.length}</strong><span>Field types</span></div>
              </div>
              <div className="form-export-types">{typeCounts.map(([type, count]) => <span className="form-export-type" key={type}>{type} <b>{count}</b></span>)}</div>

              {inspection.warnings.map(warning => <div className="form-export-warning" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}

              <div className="form-export-toolbar">
                <label className="form-export-option">
                  <input type="checkbox" checked={includeEmpty} onChange={event => setIncludeEmpty(event.target.checked)} />
                  <span><strong>Include empty fields</strong><span>{exportedFields.length} of {inspection.fields.length} fields will be exported</span></span>
                </label>
                <div className="form-export-actions">
                  <button className="form-export-download csv" type="button" disabled={!exportedFields.length} onClick={() => download('csv')}><FileSpreadsheet size={15} /> Download CSV</button>
                  <button className="form-export-download json" type="button" disabled={!exportedFields.length} onClick={() => download('json')}><FileJson size={15} /> Download JSON</button>
                </div>
              </div>

              <div className="form-export-table-wrap">
                <table className="form-export-table">
                  <thead><tr><th>Field name</th><th>Type</th><th>Value</th><th>Pages</th><th>Flags</th><th>Options</th></tr></thead>
                  <tbody>{exportedFields.slice(0, PREVIEW_LIMIT).map((field, index) => <tr key={`${field.name}-${index}`}>
                    <td><span className="form-export-name">{field.name}</span></td>
                    <td><span className="form-export-pill">{field.type}</span></td>
                    <td><span className={field.empty ? 'form-export-value form-export-muted' : 'form-export-value'} title={displayValue(field.value)}>{field.empty ? 'Empty' : displayValue(field.value)}</span></td>
                    <td>{field.pages.length ? field.pages.join(', ') : <span className="form-export-muted">Unknown</span>}</td>
                    <td><div className="form-export-flags">{field.required && <span className="form-export-flag">Required</span>}{field.readOnly && <span className="form-export-flag">Read-only</span>}{!field.exported && <span className="form-export-flag">No-export</span>}{!field.required && !field.readOnly && field.exported && <span className="form-export-muted">—</span>}</div></td>
                    <td title={field.options.join('; ')}>{field.options.length ? `${field.options.length} options` : <span className="form-export-muted">—</span>}</td>
                  </tr>)}</tbody>
                </table>
                <div className="form-export-caption">Showing {Math.min(PREVIEW_LIMIT, exportedFields.length)} of {exportedFields.length} exportable fields. CSV output neutralizes values that spreadsheet apps could interpret as formulas.</div>
              </div>
              <button className="form-export-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
            </>}

            {!processing && inspection && inspection.fields.length === 0 && <div className="form-export-empty">
              <span className="form-export-empty-icon"><Info size={27} /></span>
              <h2>No standard form fields found</h2>
              <p>{inspection.xfa ? 'This PDF contains XFA data, but no standard AcroForm fields that can be exported safely in the browser.' : 'The document may be a flat PDF, a scanned form, or use an unsupported non-standard field structure.'}</p>
              {inspection.warnings.map(warning => <div className="form-export-warning" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}
              <button className="form-export-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
            </div>}
          </>}
        </section>

        <section className="form-export-info">
          <article><ShieldCheck size={20} /><h3>Private by design</h3><p>PDF parsing and export generation happen in your browser. Field names and values are not sent to analytics.</p></article>
          <article><Braces size={20} /><h3>Structured output</h3><p>JSON preserves arrays and booleans. CSV includes page numbers, flags, options, widgets, and safe spreadsheet cells.</p></article>
          <article><ListChecks size={20} /><h3>Honest field coverage</h3><p>Standard AcroForm fields are exported. XFA limitations and orphan widgets are reported instead of guessed.</p></article>
        </section>
      </div>
    </main>

    <ToolQuickFacts
      definition="A fillable PDF normally stores answers in an AcroForm field tree. Each field can have a name, type, value, validation flags, available choices, and one or more page widgets. This tool reads that tree and exports the values as structured CSV or JSON."
      price="Free — no account needed"
      account="Not required"
      processing="Processed locally in your browser without an application document-processing request"
      formats="PDF in, CSV/JSON out"
      fileLimit="Up to 100 MB and 500 pages"
      browserSupport="Chrome, Firefox, Safari, Edge"
    />
    {seo && <ToolSEOSection {...seo} />}
    <SiteFooter />
  </div>
}
