import type { PDFRef } from 'pdf-lib'

export type ManagedBookmarkKind = 'Page' | 'Web link' | 'External PDF' | 'Named action' | 'Unresolved' | 'None'

export type ManagedBookmark = {
  id: number
  title: string
  pageNumber: number | null
  kind: ManagedBookmarkKind
  target: string
  externalFile: string
  externalDestination: string
  open: boolean
  children: ManagedBookmark[]
}

export type ManagedBookmarkInspection = {
  pageCount: number
  bookmarks: ManagedBookmark[]
  bookmarkCount: number
  maxDepth: number
  externalCount: number
  unresolvedCount: number
  warnings: string[]
}

const MAX_BOOKMARKS = 5_000
const MAX_DEPTH = 64

export function flattenManagedBookmarks(nodes: ManagedBookmark[]): ManagedBookmark[] {
  return nodes.flatMap(node => [node, ...flattenManagedBookmarks(node.children)])
}

export async function parseManagedBookmarks(bytes: Uint8Array): Promise<ManagedBookmarkInspection> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const pageCount = document.getPageCount()
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
  if (legacyDests instanceof pdfLib.PDFDict) legacyDests.entries().forEach(([name, value]) => namedDestinations.set(name.decodeText(), value))
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
    if (kids instanceof pdfLib.PDFArray) for (let index = 0; index < kids.size(); index += 1) readNameTree(kids.get(index), depth + 1)
  }
  const namesDictionary = dereference(document.catalog.get(key('Names')))
  if (namesDictionary instanceof pdfLib.PDFDict) readNameTree(namesDictionary.get(key('Dests')), 0)

  const resolvePage = (candidate: unknown, namedChain = new Set<string>()): number | null => {
    const object = dereference(candidate)
    if (object instanceof pdfLib.PDFArray) {
      const first = object.size() ? object.get(0) : undefined
      const resolved = dereference(first)
      if (first instanceof pdfLib.PDFRef) return pageByRef.get(first.toString()) ?? null
      if (resolved instanceof pdfLib.PDFDict) return pageByDictionary.get(resolved) ?? null
      if (resolved instanceof pdfLib.PDFNumber) {
        const pageIndex = resolved.asNumber()
        return Number.isInteger(pageIndex) && pageIndex >= 0 && pageIndex < pageCount ? pageIndex + 1 : null
      }
      return null
    }
    if (object instanceof pdfLib.PDFDict) return resolvePage(object.get(key('D')), namedChain)
    if (object instanceof pdfLib.PDFString || object instanceof pdfLib.PDFHexString || object instanceof pdfLib.PDFName) {
      const name = textValue(object)
      if (!name || namedChain.has(name)) return null
      const named = namedDestinations.get(name)
      if (!named) return null
      const nextChain = new Set(namedChain)
      nextChain.add(name)
      return resolvePage(named, nextChain)
    }
    return null
  }

  const fileSpecText = (candidate: unknown): string => {
    const object = dereference(candidate)
    return object instanceof pdfLib.PDFDict ? textValue(object.get(key('UF'))) || textValue(object.get(key('F'))) : textValue(object)
  }

  const destinationForItem = (item: { get: (name: ReturnType<typeof key>) => unknown }) => {
    const direct = item.get(key('Dest'))
    if (direct) {
      const pageNumber = resolvePage(direct)
      return pageNumber ? { pageNumber, kind: 'Page' as const, target: '', externalFile: '', externalDestination: '' } : { pageNumber: null, kind: 'Unresolved' as const, target: textValue(direct), externalFile: '', externalDestination: '' }
    }
    const action = dereference(item.get(key('A')))
    if (!(action instanceof pdfLib.PDFDict)) return { pageNumber: null, kind: 'None' as const, target: '', externalFile: '', externalDestination: '' }
    const actionType = textValue(action.get(key('S')))
    if (actionType === 'GoTo') {
      const pageNumber = resolvePage(action.get(key('D')))
      return pageNumber ? { pageNumber, kind: 'Page' as const, target: '', externalFile: '', externalDestination: '' } : { pageNumber: null, kind: 'Unresolved' as const, target: textValue(action.get(key('D'))), externalFile: '', externalDestination: '' }
    }
    if (actionType === 'URI') return { pageNumber: null, kind: 'Web link' as const, target: textValue(action.get(key('URI'))), externalFile: '', externalDestination: '' }
    if (actionType === 'GoToR') return { pageNumber: null, kind: 'External PDF' as const, target: '', externalFile: fileSpecText(action.get(key('F'))), externalDestination: textValue(action.get(key('D'))) }
    if (actionType === 'Named') return { pageNumber: null, kind: 'Named action' as const, target: textValue(action.get(key('N'))), externalFile: '', externalDestination: '' }
    return { pageNumber: null, kind: 'Unresolved' as const, target: actionType, externalFile: '', externalDestination: '' }
  }

  const outlines = dereference(document.catalog.get(key('Outlines')))
  if (!(outlines instanceof pdfLib.PDFDict)) return { pageCount, bookmarks: [], bookmarkCount: 0, maxDepth: 0, externalCount: 0, unresolvedCount: 0, warnings: [] }

  const visited = new Set<object>()
  let nextId = 1
  let count = 0
  let unresolvedCount = 0
  let externalCount = 0
  let untitledCount = 0
  let truncated = false
  let depthLimited = false

  const walk = (first: unknown, depth: number): ManagedBookmark[] => {
    if (depth > MAX_DEPTH) { depthLimited = true; return [] }
    const nodes: ManagedBookmark[] = []
    let cursor: unknown = first
    while (cursor) {
      const item = dereference(cursor)
      if (!(item instanceof pdfLib.PDFDict) || visited.has(item)) break
      visited.add(item)
      if (count >= MAX_BOOKMARKS) { truncated = true; break }
      count += 1
      const decodedTitle = textValue(item.get(key('Title'))).trim()
      if (!decodedTitle) untitledCount += 1
      const destination = destinationForItem(item)
      if (destination.kind === 'Unresolved') unresolvedCount += 1
      if (destination.kind === 'Web link' || destination.kind === 'External PDF') externalCount += 1
      const itemCount = dereference(item.get(key('Count')))
      nodes.push({
        id: nextId++,
        title: decodedTitle || 'Untitled bookmark',
        pageNumber: destination.pageNumber,
        kind: destination.kind,
        target: destination.target,
        externalFile: destination.externalFile,
        externalDestination: destination.externalDestination,
        open: !(itemCount instanceof pdfLib.PDFNumber) || itemCount.asNumber() >= 0,
        children: walk(item.get(key('First')), depth + 1),
      })
      if (truncated) break
      cursor = item.get(key('Next'))
    }
    return nodes
  }

  const bookmarks = walk(outlines.get(key('First')), 0)
  const flat = flattenManagedBookmarks(bookmarks)
  const warnings: string[] = []
  if (unresolvedCount) warnings.push(`${unresolvedCount} bookmark target${unresolvedCount === 1 ? '' : 's'} could not be resolved. ${unresolvedCount === 1 ? 'It will' : 'They will'} remain as titled entries without an active destination unless retargeted to a page.`)
  if (untitledCount) warnings.push(`${untitledCount} bookmark${untitledCount === 1 ? '' : 's'} had no readable title and ${untitledCount === 1 ? 'was' : 'were'} labeled as untitled.`)
  if (depthLimited) warnings.push(`Nesting deeper than ${MAX_DEPTH} levels was not loaded.`)
  if (truncated) warnings.push(`Editing was limited to ${MAX_BOOKMARKS.toLocaleString()} bookmarks for safe browser processing.`)
  return {
    pageCount,
    bookmarks,
    bookmarkCount: flat.length,
    maxDepth: maxTreeDepth(bookmarks),
    externalCount,
    unresolvedCount,
    warnings,
  }
}

export function maxTreeDepth(nodes: ManagedBookmark[], depth = 1): number {
  return nodes.reduce((maximum, node) => Math.max(maximum, depth, maxTreeDepth(node.children, depth + 1)), nodes.length ? depth : 0)
}

function totalDescendants(node: ManagedBookmark): number {
  return node.children.reduce((count, child) => count + 1 + totalDescendants(child), 0)
}

function visibleTreeCount(nodes: ManagedBookmark[]): number {
  return nodes.reduce((count, node) => count + 1 + (node.open ? visibleTreeCount(node.children) : 0), 0)
}

export async function writeManagedBookmarks(bytes: Uint8Array, bookmarks: ManagedBookmark[]): Promise<Uint8Array> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const { context, catalog } = document
  const key = (name: string) => pdfLib.PDFName.of(name)
  const originalRoot = catalog.get(key('Outlines'))
  const outlineRefs = new Set<string>()
  const refsToDelete: PDFRef[] = []

  const collectOldLevel = (candidate: unknown, depth: number) => {
    if (depth > MAX_DEPTH + 2) return
    let cursor: unknown = candidate
    while (cursor) {
      const ref = cursor instanceof pdfLib.PDFRef ? cursor : undefined
      if (ref) {
        if (outlineRefs.has(ref.toString())) return
        outlineRefs.add(ref.toString())
        refsToDelete.push(ref)
      }
      const item = cursor instanceof pdfLib.PDFRef ? context.lookup(cursor) : cursor
      if (!(item instanceof pdfLib.PDFDict)) return
      collectOldLevel(item.get(key('First')), depth + 1)
      cursor = item.get(key('Next'))
    }
  }

  if (originalRoot instanceof pdfLib.PDFRef) {
    const originalRootDict = context.lookup(originalRoot)
    if (originalRootDict instanceof pdfLib.PDFDict) collectOldLevel(originalRootDict.get(key('First')), 0)
    refsToDelete.push(originalRoot)
  }
  catalog.delete(key('Outlines'))
  refsToDelete.forEach(ref => context.delete(ref))

  if (!bookmarks.length) return document.save({ useObjectStreams: true })

  const root = context.obj({ Type: 'Outlines' })
  const rootRef = context.register(root)
  const pages = document.getPages()

  const buildLevel = (nodes: ManagedBookmark[], parentRef: PDFRef) => {
    const entries = nodes.map(node => {
      const dictionary = context.obj({ Title: pdfLib.PDFHexString.fromText(node.title.trim() || 'Untitled bookmark'), Parent: parentRef })
      return { node, dictionary, ref: context.register(dictionary) }
    })
    entries.forEach((entry, index) => {
      if (index > 0) entry.dictionary.set(key('Prev'), entries[index - 1].ref)
      if (index + 1 < entries.length) entry.dictionary.set(key('Next'), entries[index + 1].ref)

      const { node, dictionary } = entry
      if (node.kind === 'Page' && node.pageNumber && pages[node.pageNumber - 1]) {
        dictionary.set(key('Dest'), context.obj([pages[node.pageNumber - 1].ref, 'Fit']))
      } else if (node.kind === 'Web link' && node.target) {
        dictionary.set(key('A'), context.obj({ S: 'URI', URI: pdfLib.PDFHexString.fromText(node.target) }))
      } else if (node.kind === 'External PDF' && node.externalFile) {
        const action = context.obj({ S: 'GoToR', F: pdfLib.PDFHexString.fromText(node.externalFile) })
        if (node.externalDestination) action.set(key('D'), pdfLib.PDFHexString.fromText(node.externalDestination))
        dictionary.set(key('A'), action)
      } else if (node.kind === 'Named action' && node.target) {
        dictionary.set(key('A'), context.obj({ S: 'Named', N: pdfLib.PDFName.of(node.target) }))
      }

      if (node.children.length) {
        const children = buildLevel(node.children, entry.ref)
        dictionary.set(key('First'), children[0].ref)
        dictionary.set(key('Last'), children[children.length - 1].ref)
        const descendants = totalDescendants(node)
        dictionary.set(key('Count'), pdfLib.PDFNumber.of(node.open ? descendants : -descendants))
      }
    })
    return entries
  }

  const topLevel = buildLevel(bookmarks, rootRef)
  root.set(key('First'), topLevel[0].ref)
  root.set(key('Last'), topLevel[topLevel.length - 1].ref)
  root.set(key('Count'), pdfLib.PDFNumber.of(visibleTreeCount(bookmarks)))
  catalog.set(key('Outlines'), rootRef)
  return document.save({ useObjectStreams: true })
}
