'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Bookmark,
  BookOpenCheck,
  Check,
  FileJson,
  FileSpreadsheet,
  FileText,
  FolderTree,
  Link2,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
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
const MAX_PAGES = 2_000
const MAX_BOOKMARKS = 10_000
const MAX_DEPTH = 64
const PREVIEW_LIMIT = 200

type DestinationType = 'Page' | 'Named destination' | 'Web link' | 'External PDF' | 'Named action' | 'Other action' | 'Unresolved' | 'None'

type BookmarkNode = {
  id: number
  title: string
  depth: number
  path: string[]
  pageNumber: number | null
  destinationType: DestinationType
  view: string
  target: string
  open: boolean | null
  children: BookmarkNode[]
}

type BookmarkInspection = {
  pageCount: number
  bookmarks: BookmarkNode[]
  bookmarkCount: number
  resolvedPages: number
  namedDestinationCount: number
  externalCount: number
  unresolvedCount: number
  maxDepth: number
  warnings: string[]
}

type ResolvedDestination = {
  pageNumber: number | null
  type: DestinationType
  view: string
  target: string
}

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.bookmark-page{min-height:100vh;background:#fff;color:#172033;padding-top:56px;overflow:hidden}.bookmark-wrap{width:min(1080px,calc(100% - 40px));margin:0 auto}
.bookmark-hero{position:relative;padding:76px 0 44px;text-align:center;border-bottom:1px solid #eef1f5;background:radial-gradient(circle at 50% 8%,rgba(37,99,235,.13),transparent 40%),linear-gradient(180deg,#f5f8ff 0%,#fff 100%)}.bookmark-hero::before,.bookmark-hero::after{content:'';position:absolute;pointer-events:none;border:1px solid rgba(37,99,235,.1);border-radius:999px}.bookmark-hero::before{width:350px;height:350px;left:-220px;top:-220px}.bookmark-hero::after{width:270px;height:270px;right:-170px;bottom:-190px}
.bookmark-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid rgba(37,99,235,.22);border-radius:999px;background:#fff;color:#1d4ed8;font:700 10px/1 var(--font-dm,system-ui);letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 20px rgba(37,99,235,.08)}.bookmark-hero h1{margin:20px 0 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(38px,6vw,66px);font-weight:800;letter-spacing:-.06em;line-height:.94;color:#172033}.bookmark-hero h1 span{color:#2563eb}.bookmark-hero p{max-width:670px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}.bookmark-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:22px;color:#475569;font-size:11px;font-weight:650}.bookmark-trust span{display:flex;align-items:center;gap:5px}
.bookmark-main{padding:38px 0 72px}.bookmark-card{position:relative;padding:30px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.08)}
.bookmark-drop{display:block;width:100%;padding:54px 24px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;cursor:pointer;transition:.18s}.bookmark-drop:hover,.bookmark-drop.dragging{border-color:#2563eb;background:#eff6ff;transform:translateY(-1px)}.bookmark-drop-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 15px;border-radius:17px;background:linear-gradient(135deg,#1d4ed8,#60a5fa);color:#fff;box-shadow:0 12px 28px rgba(37,99,235,.24)}.bookmark-drop h2{margin:0 0 7px;font:800 19px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.bookmark-drop p{margin:0 0 19px;color:#64748b;font-size:13px;line-height:1.55}.bookmark-choose{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:10px;background:#172033;color:#fff;font-weight:750}.bookmark-private{margin-top:13px;color:#1d4ed8;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.bookmark-file{display:flex;align-items:center;gap:13px;padding:14px 15px;margin-bottom:18px;border:1px solid #bfdbfe;border-radius:13px;background:#eff6ff}.bookmark-file-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:#dbeafe;color:#1d4ed8;flex:0 0 auto}.bookmark-file-info{min-width:0;flex:1}.bookmark-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:750}.bookmark-file-size{margin-top:3px;color:#64748b;font-size:10px}.bookmark-remove{display:grid;place-items:center;width:34px;height:34px;border:1px solid #bfdbfe;border-radius:9px;background:#fff;color:#64748b;cursor:pointer}.bookmark-remove:hover{border-color:#ef4444;color:#ef4444}
.bookmark-progress{padding:26px 4px 10px;text-align:center}.bookmark-progress-icon{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:#dbeafe;color:#1d4ed8;animation:bookmark-pulse 1.5s ease-in-out infinite}.bookmark-progress h2{margin:0 0 7px;font:800 20px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.bookmark-progress p{margin:0;color:#64748b;font-size:12px}
.bookmark-error{display:flex;align-items:flex-start;gap:8px;padding:12px 14px;margin:0 0 16px;border:1px solid rgba(220,38,38,.2);border-radius:10px;background:#fff5f5;color:#b91c1c;font-size:12px;line-height:1.5}
.bookmark-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.bookmark-stat{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.bookmark-stat strong{display:block;font:800 22px/1 var(--font-jakarta,system-ui);letter-spacing:-.04em;color:#1d4ed8}.bookmark-stat span{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}
.bookmark-types{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.bookmark-type{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;color:#475569;font-size:9px;font-weight:750}.bookmark-type b{color:#1d4ed8}
.bookmark-warning{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;margin-top:13px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#854d0e;font-size:10px;line-height:1.55}.bookmark-warning svg{flex:0 0 auto;margin-top:1px}
.bookmark-toolbar{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:18px;padding:14px;border:1px solid #e2e8f0;border-radius:13px;background:#fff}.bookmark-toolbar-copy strong{display:block;font-size:11px}.bookmark-toolbar-copy span{display:block;margin-top:3px;color:#64748b;font-size:9px}.bookmark-actions{display:flex;gap:8px}.bookmark-download{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 13px;border:0;border-radius:9px;color:#fff;font-size:10px;font-weight:800;cursor:pointer}.bookmark-download.csv{background:#15803d}.bookmark-download.json{background:#1d4ed8}
.bookmark-table-wrap{margin-top:14px;overflow:auto;border:1px solid #e2e8f0;border-radius:13px}.bookmark-table{width:100%;border-collapse:collapse;min-width:860px}.bookmark-table th{position:sticky;top:0;padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:left;font-size:8px;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}.bookmark-table td{max-width:320px;padding:11px 12px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:10px;vertical-align:top}.bookmark-table tr:last-child td{border-bottom:0}.bookmark-title{display:flex;align-items:flex-start;gap:7px;min-width:220px;font-weight:750;color:#172033}.bookmark-title svg{flex:0 0 auto;margin-top:1px;color:#2563eb}.bookmark-path{display:block;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#94a3b8;font-size:8px;font-weight:500}.bookmark-pill{display:inline-flex;padding:4px 7px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:8px;font-weight:800}.bookmark-target{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px}.bookmark-muted{color:#94a3b8;font-style:italic}.bookmark-caption{padding:9px 12px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:9px}
.bookmark-empty{text-align:center;padding:26px 8px 8px}.bookmark-empty-icon{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 16px;border-radius:19px;background:#f1f5f9;color:#64748b}.bookmark-empty h2{margin:0 0 8px;font:800 21px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.03em}.bookmark-empty p{max-width:560px;margin:0 auto;color:#64748b;font-size:12px;line-height:1.65}.bookmark-again{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;margin-top:17px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:10px;font-weight:750;cursor:pointer}
.bookmark-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.bookmark-info article{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}.bookmark-info svg{color:#2563eb}.bookmark-info h3{margin:11px 0 5px;font:750 13px/1.3 var(--font-jakarta,system-ui)}.bookmark-info p{margin:0;color:#64748b;font-size:11px;line-height:1.6}
@keyframes bookmark-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06) rotate(-5deg)}}
@media(max-width:760px){.bookmark-wrap{width:min(100% - 28px,1080px)}.bookmark-hero{padding:56px 0 36px}.bookmark-card{padding:18px;border-radius:17px}.bookmark-drop{padding:42px 14px}.bookmark-summary{grid-template-columns:1fr 1fr}.bookmark-toolbar{align-items:stretch;flex-direction:column}.bookmark-actions{display:grid;grid-template-columns:1fr 1fr}.bookmark-info{grid-template-columns:1fr}.bookmark-main{padding-top:25px}}
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

function flattenBookmarks(nodes: BookmarkNode[]): BookmarkNode[] {
  return nodes.flatMap(node => [node, ...flattenBookmarks(node.children)])
}

function csvCell(value: string | number | boolean | null): string {
  const raw = value === null ? '' : String(value)
  const protectedValue = /^\s*[=+\-@]/.test(raw) ? `'${raw}` : raw
  return `"${protectedValue.replace(/"/g, '""')}"`
}

function createCsv(bookmarks: BookmarkNode[]): string {
  const headers = ['order', 'depth', 'title', 'path', 'page_number', 'destination_type', 'view', 'target', 'open', 'child_count']
  const lines = flattenBookmarks(bookmarks).map((bookmark, index) => [
    index + 1,
    bookmark.depth,
    bookmark.title,
    bookmark.path.join(' > '),
    bookmark.pageNumber,
    bookmark.destinationType,
    bookmark.view,
    bookmark.target,
    bookmark.open,
    bookmark.children.length,
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
  if (message.includes('bookmark')) return 'bookmark_limit'
  if (message.includes('header') || message.includes('invalid') || message.includes('parse')) return 'invalid_pdf'
  return 'processing_error'
}

async function inspectBookmarks(bytes: Uint8Array): Promise<BookmarkInspection> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const pageCount = document.getPageCount()
  if (pageCount > MAX_PAGES) throw new Error(`This PDF has ${pageCount} pages. The bookmark extraction limit is ${MAX_PAGES} pages.`)

  const key = (name: string) => pdfLib.PDFName.of(name)
  const dereference = (value: unknown): unknown => value instanceof pdfLib.PDFRef ? document.context.lookup(value) : value
  const textValue = (value: unknown): string => {
    const object = dereference(value)
    if (object instanceof pdfLib.PDFString || object instanceof pdfLib.PDFHexString || object instanceof pdfLib.PDFName) {
      try { return object.decodeText() } catch { return '' }
    }
    return ''
  }

  const pageByRef = new Map<string, number>()
  const pageByDictionary = new Map<object, number>()
  document.getPages().forEach((page, index) => {
    pageByRef.set(page.ref.toString(), index + 1)
    pageByDictionary.set(page.node, index + 1)
  })

  const namedDestinations = new Map<string, unknown>()
  const legacyDests = dereference(document.catalog.get(key('Dests')))
  if (legacyDests instanceof pdfLib.PDFDict) {
    legacyDests.entries().forEach(([name, value]) => namedDestinations.set(name.decodeText(), value))
  }

  const visitedNameTrees = new Set<object>()
  const readNameTree = (candidate: unknown, depth: number) => {
    if (depth > MAX_DEPTH) return
    const dictionary = dereference(candidate)
    if (!(dictionary instanceof pdfLib.PDFDict) || visitedNameTrees.has(dictionary)) return
    visitedNameTrees.add(dictionary)
    const names = dereference(dictionary.get(key('Names')))
    if (names instanceof pdfLib.PDFArray) {
      for (let index = 0; index + 1 < names.size(); index += 2) {
        const name = textValue(names.get(index))
        if (name && !namedDestinations.has(name)) namedDestinations.set(name, names.get(index + 1))
      }
    }
    const kids = dereference(dictionary.get(key('Kids')))
    if (kids instanceof pdfLib.PDFArray) {
      for (let index = 0; index < kids.size(); index += 1) readNameTree(kids.get(index), depth + 1)
    }
  }
  const namesDictionary = dereference(document.catalog.get(key('Names')))
  if (namesDictionary instanceof pdfLib.PDFDict) readNameTree(namesDictionary.get(key('Dests')), 0)

  const resolveDestination = (candidate: unknown, namedChain = new Set<string>()): ResolvedDestination => {
    const object = dereference(candidate)
    if (object instanceof pdfLib.PDFArray) {
      const pageCandidate = object.size() ? object.get(0) : undefined
      const resolvedPage = dereference(pageCandidate)
      let pageNumber: number | null = null
      if (pageCandidate instanceof pdfLib.PDFRef) pageNumber = pageByRef.get(pageCandidate.toString()) ?? null
      else if (resolvedPage instanceof pdfLib.PDFDict) pageNumber = pageByDictionary.get(resolvedPage) ?? null
      else if (resolvedPage instanceof pdfLib.PDFNumber) {
        const index = resolvedPage.asNumber()
        if (Number.isInteger(index) && index >= 0 && index < pageCount) pageNumber = index + 1
      }
      const view = object.size() > 1 ? textValue(object.get(1)) : ''
      return { pageNumber, type: pageNumber ? 'Page' : 'Unresolved', view, target: '' }
    }
    if (object instanceof pdfLib.PDFDict) {
      const destination = object.get(key('D'))
      return destination ? resolveDestination(destination, namedChain) : { pageNumber: null, type: 'Unresolved', view: '', target: '' }
    }
    if (object instanceof pdfLib.PDFString || object instanceof pdfLib.PDFHexString || object instanceof pdfLib.PDFName) {
      const name = textValue(object)
      if (!name || namedChain.has(name)) return { pageNumber: null, type: 'Unresolved', view: '', target: name }
      const named = namedDestinations.get(name)
      if (!named) return { pageNumber: null, type: 'Unresolved', view: '', target: name }
      const nextChain = new Set(namedChain)
      nextChain.add(name)
      const resolved = resolveDestination(named, nextChain)
      return { ...resolved, type: resolved.pageNumber ? 'Named destination' : 'Unresolved', target: name }
    }
    return { pageNumber: null, type: 'Unresolved', view: '', target: '' }
  }

  const fileSpecText = (candidate: unknown): string => {
    const object = dereference(candidate)
    if (object instanceof pdfLib.PDFDict) return textValue(object.get(key('UF'))) || textValue(object.get(key('F')))
    return textValue(object)
  }

  const destinationForItem = (item: { get: (name: ReturnType<typeof key>) => unknown }): ResolvedDestination => {
    const direct = item.get(key('Dest'))
    if (direct) return resolveDestination(direct)
    const action = dereference(item.get(key('A')))
    if (!(action instanceof pdfLib.PDFDict)) return { pageNumber: null, type: 'None', view: '', target: '' }
    const actionType = textValue(action.get(key('S')))
    if (actionType === 'GoTo') return resolveDestination(action.get(key('D')))
    if (actionType === 'URI') return { pageNumber: null, type: 'Web link', view: '', target: textValue(action.get(key('URI'))) }
    if (actionType === 'GoToR') {
      const file = fileSpecText(action.get(key('F')))
      const remoteDestination = textValue(action.get(key('D')))
      return { pageNumber: null, type: 'External PDF', view: '', target: [file, remoteDestination].filter(Boolean).join(' # ') }
    }
    if (actionType === 'Named') return { pageNumber: null, type: 'Named action', view: '', target: textValue(action.get(key('N'))) }
    return { pageNumber: null, type: 'Other action', view: '', target: actionType }
  }

  const outlines = dereference(document.catalog.get(key('Outlines')))
  if (!(outlines instanceof pdfLib.PDFDict)) {
    return { pageCount, bookmarks: [], bookmarkCount: 0, resolvedPages: 0, namedDestinationCount: namedDestinations.size, externalCount: 0, unresolvedCount: 0, maxDepth: 0, warnings: [] }
  }

  const visitedItems = new Set<object>()
  let bookmarkCount = 0
  let unresolvedCount = 0
  let externalCount = 0
  let untitledCount = 0
  let cycleCount = 0
  let depthLimited = false
  let truncated = false
  let nextId = 1

  const walkSiblings = (first: unknown, depth: number, parentPath: string[]): BookmarkNode[] => {
    if (depth > MAX_DEPTH) { depthLimited = true; return [] }
    const result: BookmarkNode[] = []
    let cursor: unknown = first
    const siblingItems = new Set<object>()
    while (cursor) {
      const item = dereference(cursor)
      if (!(item instanceof pdfLib.PDFDict)) break
      if (siblingItems.has(item) || visitedItems.has(item)) { cycleCount += 1; break }
      siblingItems.add(item)
      visitedItems.add(item)
      if (bookmarkCount >= MAX_BOOKMARKS) { truncated = true; break }
      bookmarkCount += 1

      const decodedTitle = textValue(item.get(key('Title'))).trim()
      const title = decodedTitle || '[Untitled bookmark]'
      if (!decodedTitle) untitledCount += 1
      const path = [...parentPath, title]
      const destination = destinationForItem(item)
      if (destination.type === 'Unresolved') unresolvedCount += 1
      if (destination.type === 'Web link' || destination.type === 'External PDF') externalCount += 1
      const countObject = dereference(item.get(key('Count')))
      const open = countObject instanceof pdfLib.PDFNumber ? countObject.asNumber() >= 0 : null
      const children = walkSiblings(item.get(key('First')), depth + 1, path)
      result.push({
        id: nextId++,
        title,
        depth,
        path,
        pageNumber: destination.pageNumber,
        destinationType: destination.type,
        view: destination.view,
        target: destination.target,
        open,
        children,
      })
      if (truncated) break
      cursor = item.get(key('Next'))
    }
    return result
  }

  const bookmarks = walkSiblings(outlines.get(key('First')), 0, [])
  const flat = flattenBookmarks(bookmarks)
  const warnings: string[] = []
  if (unresolvedCount) warnings.push(`${unresolvedCount} bookmark destination${unresolvedCount === 1 ? '' : 's'} could not be resolved to a local page. The bookmark title and available target are still included.`)
  if (untitledCount) warnings.push(`${untitledCount} outline item${untitledCount === 1 ? '' : 's'} had no readable title and ${untitledCount === 1 ? 'is' : 'are'} labeled as untitled.`)
  if (cycleCount) warnings.push(`${cycleCount} cyclic or repeated outline link${cycleCount === 1 ? '' : 's'} was stopped to prevent an endless traversal.`)
  if (depthLimited) warnings.push(`Bookmark nesting deeper than ${MAX_DEPTH} levels was not traversed.`)
  if (truncated) warnings.push(`The preview and exports were limited to ${MAX_BOOKMARKS.toLocaleString()} bookmarks for safe browser processing.`)

  return {
    pageCount,
    bookmarks,
    bookmarkCount: flat.length,
    resolvedPages: flat.filter(bookmark => bookmark.pageNumber !== null).length,
    namedDestinationCount: namedDestinations.size,
    externalCount,
    unresolvedCount,
    maxDepth: flat.reduce((maximum, bookmark) => Math.max(maximum, bookmark.depth + 1), 0),
    warnings,
  }
}

export default function ExtractPDFBookmarksPage() {
  const [file, setFile] = useState<File | null>(null)
  const [inspection, setInspection] = useState<BookmarkInspection | null>(null)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setFile(null)
    setInspection(null)
    setDragging(false)
    setProcessing(false)
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
    setError('')
    void trackEvent('pdf_bookmarks_scan_started', { file_size: sizeBucket(candidate.size) })
    try {
      const bytes = new Uint8Array(await candidate.arrayBuffer())
      const header = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(1024, bytes.length)))
      if (!header.includes('%PDF-')) throw new Error('This file does not contain a valid PDF header.')
      const result = await inspectBookmarks(bytes)
      setInspection(result)
      void trackEvent('pdf_bookmarks_scan_completed', {
        file_size: sizeBucket(candidate.size),
        pages: result.pageCount,
        bookmarks: result.bookmarkCount,
        resolved: result.resolvedPages,
        external: result.externalCount,
        unresolved: result.unresolvedCount,
        max_depth: result.maxDepth,
      })
    } catch (reason) {
      const code = failureCode(reason)
      const message = reason instanceof Error ? reason.message : 'The PDF bookmark tree could not be read.'
      setError(code === 'password_protected' ? 'This PDF is password-protected. Unlock it with the known password before extracting bookmarks.' : message)
      setInspection(null)
      void trackEvent('pdf_bookmarks_scan_failed', { file_size: sizeBucket(candidate.size), reason: code })
    } finally {
      setProcessing(false)
    }
  }, [])

  const flatBookmarks = useMemo(() => inspection ? flattenBookmarks(inspection.bookmarks) : [], [inspection])
  const typeCounts = useMemo(() => {
    const counts = new Map<DestinationType, number>()
    flatBookmarks.forEach(bookmark => counts.set(bookmark.destinationType, (counts.get(bookmark.destinationType) ?? 0) + 1))
    return Array.from(counts.entries())
  }, [flatBookmarks])

  const download = useCallback((format: 'csv' | 'json') => {
    if (!inspection || !file) return
    const base = safeBaseName(file.name)
    if (format === 'csv') {
      triggerDownload(new Blob([createCsv(inspection.bookmarks)], { type: 'text/csv;charset=utf-8' }), `${base}_bookmarks.csv`)
    } else {
      const payload = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        source: {
          pageCount: inspection.pageCount,
          bookmarkCount: inspection.bookmarkCount,
          namedDestinationCount: inspection.namedDestinationCount,
        },
        warnings: inspection.warnings,
        bookmarks: inspection.bookmarks,
      }
      triggerDownload(new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json;charset=utf-8' }), `${base}_bookmarks.json`)
    }
    void trackEvent('pdf_bookmarks_downloaded', { format, bookmarks: inspection.bookmarkCount })
  }, [inspection, file])

  const seo = toolSeoData['extract-pdf-bookmarks']

  return <div className="bookmark-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <SiteNav />
    <section className="bookmark-hero">
      <div className="bookmark-wrap">
        <div className="bookmark-badge"><BookOpenCheck size={12} /> Document outline export</div>
        <h1>Extract PDF <span>Bookmarks</span></h1>
        <p>Read the complete bookmark hierarchy, resolve page destinations, and download a flat CSV or nested JSON outline.</p>
        <div className="bookmark-trust">
          <span><ShieldCheck size={13} /> Files stay on your device</span>
          <span><Check size={13} /> Source PDF stays unchanged</span>
          <span><Check size={13} /> External actions are never opened</span>
        </div>
      </div>
    </section>

    <main className="bookmark-main">
      <div className="bookmark-wrap">
        <section className="bookmark-card">
          {error && <div className="bookmark-error" role="alert"><AlertTriangle size={16} /> <span>{error}</span></div>}

          {!file && <label
            className={`bookmark-drop${dragging ? ' dragging' : ''}`}
            onDragEnter={event => { event.preventDefault(); setDragging(true) }}
            onDragOver={event => event.preventDefault()}
            onDragLeave={event => { event.preventDefault(); setDragging(false) }}
            onDrop={event => { event.preventDefault(); setDragging(false); const candidate = event.dataTransfer.files[0]; if (candidate) void handleFile(candidate) }}
          >
            <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const candidate = event.target.files?.[0]; if (candidate) void handleFile(candidate) }} />
            <span className="bookmark-drop-icon"><UploadCloud size={27} /></span>
            <h2>Drop a bookmarked PDF here</h2>
            <p>Choose one PDF up to 100 MB. The outline is read locally without rendering or rewriting pages.</p>
            <span className="bookmark-choose">Choose PDF <FileText size={15} /></span>
            <div className="bookmark-private">Local browser processing</div>
          </label>}

          {file && <>
            <div className="bookmark-file">
              <span className="bookmark-file-icon"><Bookmark size={20} /></span>
              <div className="bookmark-file-info"><div className="bookmark-file-name">{file.name}</div><div className="bookmark-file-size">{formatBytes(file.size)}</div></div>
              <button className="bookmark-remove" type="button" aria-label="Remove PDF" onClick={reset}><X size={16} /></button>
            </div>

            {processing && <div className="bookmark-progress" aria-live="polite">
              <span className="bookmark-progress-icon"><ScanSearch size={27} /></span>
              <h2>Reading bookmark tree</h2>
              <p>Resolving hierarchy, named destinations, page references, and external actions locally…</p>
            </div>}

            {!processing && inspection && inspection.bookmarkCount > 0 && <>
              <div className="bookmark-summary">
                <div className="bookmark-stat"><strong>{inspection.bookmarkCount}</strong><span>Bookmarks</span></div>
                <div className="bookmark-stat"><strong>{inspection.pageCount}</strong><span>PDF pages</span></div>
                <div className="bookmark-stat"><strong>{inspection.resolvedPages}</strong><span>Pages resolved</span></div>
                <div className="bookmark-stat"><strong>{inspection.maxDepth}</strong><span>Tree levels</span></div>
              </div>
              <div className="bookmark-types">{typeCounts.map(([type, count]) => <span className="bookmark-type" key={type}>{type} <b>{count}</b></span>)}</div>
              {inspection.warnings.map(warning => <div className="bookmark-warning" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}

              <div className="bookmark-toolbar">
                <div className="bookmark-toolbar-copy"><strong>Export the complete outline</strong><span>CSV is flat for spreadsheets. JSON preserves the nested child hierarchy.</span></div>
                <div className="bookmark-actions">
                  <button className="bookmark-download csv" type="button" onClick={() => download('csv')}><FileSpreadsheet size={15} /> Download CSV</button>
                  <button className="bookmark-download json" type="button" onClick={() => download('json')}><FileJson size={15} /> Download JSON</button>
                </div>
              </div>

              <div className="bookmark-table-wrap">
                <table className="bookmark-table">
                  <thead><tr><th>Bookmark</th><th>Destination</th><th>Page</th><th>View</th><th>Target / children</th></tr></thead>
                  <tbody>{flatBookmarks.slice(0, PREVIEW_LIMIT).map(bookmark => <tr key={bookmark.id}>
                    <td><span className="bookmark-title" style={{ paddingLeft: Math.min(bookmark.depth, 12) * 16 }}><Bookmark size={12} /><span>{bookmark.title}<span className="bookmark-path">{bookmark.path.join(' › ')}</span></span></span></td>
                    <td><span className="bookmark-pill">{bookmark.destinationType}</span></td>
                    <td>{bookmark.pageNumber ?? <span className="bookmark-muted">—</span>}</td>
                    <td>{bookmark.view || <span className="bookmark-muted">—</span>}</td>
                    <td>{bookmark.target ? <span className="bookmark-target" title={bookmark.target}>{bookmark.target}</span> : bookmark.children.length ? `${bookmark.children.length} child${bookmark.children.length === 1 ? '' : 'ren'}` : <span className="bookmark-muted">—</span>}</td>
                  </tr>)}</tbody>
                </table>
                <div className="bookmark-caption">Showing {Math.min(PREVIEW_LIMIT, flatBookmarks.length)} of {flatBookmarks.length} bookmarks. External targets are displayed as text and are never opened.</div>
              </div>
              <button className="bookmark-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
            </>}

            {!processing && inspection && inspection.bookmarkCount === 0 && <div className="bookmark-empty">
              <span className="bookmark-empty-icon"><Bookmark size={27} /></span>
              <h2>No PDF bookmarks found</h2>
              <p>This document has no standard outline tree. A visible table of contents on a page is ordinary page content and does not automatically create clickable PDF bookmarks.</p>
              <button className="bookmark-again" type="button" onClick={reset}><RotateCcw size={14} /> Choose another PDF</button>
            </div>}
          </>}
        </section>

        <section className="bookmark-info">
          <article><ShieldCheck size={20} /><h3>Private and read-only</h3><p>The source PDF is parsed locally and never rewritten. Bookmark titles and targets are not sent to analytics.</p></article>
          <article><FolderTree size={20} /><h3>Hierarchy preserved</h3><p>Parent and child order, depth, open state, page number, view mode, and destination type remain available.</p></article>
          <article><Link2 size={20} /><h3>Destination-aware</h3><p>Direct pages and named destinations are resolved. Web and external-PDF actions are classified without being followed.</p></article>
        </section>
      </div>
    </main>

    <ToolQuickFacts
      definition="PDF bookmarks are entries in a document outline that help readers jump to chapters, sections, appendices, or other locations. Unlike a printed table of contents, bookmarks are stored as a separate hierarchy with parent and child relationships, which this tool reads and exports."
      price="Free — no account needed"
      account="Not required"
      processing="Entirely in your browser — file never uploaded"
      formats="PDF in, CSV/JSON out"
      fileLimit="Up to 100 MB and 2,000 pages"
      browserSupport="Chrome, Firefox, Safari, Edge"
    />
    {seo && <ToolSEOSection {...seo} />}
    <SiteFooter />
  </div>
}
