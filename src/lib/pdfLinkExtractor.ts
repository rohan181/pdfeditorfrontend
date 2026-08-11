import type { PDFNumber } from 'pdf-lib'

export type PDFLinkKind =
  | 'Web'
  | 'Email'
  | 'Phone'
  | 'Internal page'
  | 'External PDF'
  | 'File launch'
  | 'Form submission'
  | 'Named action'
  | 'JavaScript'
  | 'Other'
  | 'Unresolved'

export type PDFLinkRectangle = {
  x: number
  y: number
  width: number
  height: number
}

export type PDFLinkRecord = {
  order: number
  pageNumber: number
  kind: PDFLinkKind
  target: string
  destinationPage: number | null
  view: string
  rectangle: PDFLinkRectangle | null
  description: string
}

export type PDFLinkInspection = {
  pageCount: number
  links: PDFLinkRecord[]
  pagesWithLinks: number
  externalCount: number
  internalCount: number
  unresolvedCount: number
  scriptCount: number
  warnings: string[]
}

export type PDFLinkRemoval = {
  bytes: Uint8Array
  removedLinks: number
  changedPages: number
  pageCount: number
}

const MAX_LINKS = 10_000
const MAX_DEPTH = 64
const MAX_TEXT = 2_048

function limited(value: string): string {
  return value.length > MAX_TEXT ? `${value.slice(0, MAX_TEXT - 3)}...` : value
}

export async function inspectPDFLinks(bytes: Uint8Array): Promise<PDFLinkInspection> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const pageCount = document.getPageCount()
  const key = (name: string) => pdfLib.PDFName.of(name)
  const dereference = (value: unknown): unknown => value instanceof pdfLib.PDFRef ? document.context.lookup(value) : value
  const textValue = (value: unknown): string => {
    const object = dereference(value)
    if (object instanceof pdfLib.PDFString || object instanceof pdfLib.PDFHexString || object instanceof pdfLib.PDFName) {
      try { return limited(object.decodeText()) } catch { return '' }
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

  const destinationDetails = (candidate: unknown, namedChain = new Set<string>()): { page: number | null; view: string; raw: string } => {
    const object = dereference(candidate)
    if (object instanceof pdfLib.PDFArray) {
      const first = object.size() ? object.get(0) : undefined
      const resolved = dereference(first)
      let page: number | null = null
      if (first instanceof pdfLib.PDFRef) page = pageByRef.get(first.toString()) ?? null
      else if (resolved instanceof pdfLib.PDFDict) page = pageByDictionary.get(resolved) ?? null
      else if (resolved instanceof pdfLib.PDFNumber) {
        const zeroBased = resolved.asNumber()
        if (Number.isInteger(zeroBased) && zeroBased >= 0 && zeroBased < pageCount) page = zeroBased + 1
      }
      return { page, view: object.size() > 1 ? textValue(object.get(1)) : '', raw: page ? `PDF page ${page}` : 'Unresolved destination array' }
    }
    if (object instanceof pdfLib.PDFDict) return destinationDetails(object.get(key('D')), namedChain)
    if (object instanceof pdfLib.PDFString || object instanceof pdfLib.PDFHexString || object instanceof pdfLib.PDFName) {
      const name = textValue(object)
      if (!name || namedChain.has(name)) return { page: null, view: '', raw: name || 'Unresolved named destination' }
      const named = namedDestinations.get(name)
      if (!named) return { page: null, view: '', raw: name }
      const nextChain = new Set(namedChain)
      nextChain.add(name)
      const resolved = destinationDetails(named, nextChain)
      return { ...resolved, raw: resolved.page ? `${name} (PDF page ${resolved.page})` : name }
    }
    return { page: null, view: '', raw: 'Unresolved destination' }
  }

  const fileSpecText = (candidate: unknown): string => {
    const object = dereference(candidate)
    if (!(object instanceof pdfLib.PDFDict)) return textValue(object)
    return textValue(object.get(key('UF'))) || textValue(object.get(key('F'))) || textValue(object.get(key('DOS'))) || textValue(object.get(key('Mac'))) || textValue(object.get(key('Unix')))
  }

  const rectangleValue = (candidate: unknown): PDFLinkRectangle | null => {
    const object = dereference(candidate)
    if (!(object instanceof pdfLib.PDFArray) || object.size() < 4) return null
    const values = Array.from({ length: 4 }, (_, index) => dereference(object.get(index)))
    if (!values.every(value => value instanceof pdfLib.PDFNumber)) return null
    const [x1, y1, x2, y2] = values.map(value => (value as PDFNumber).asNumber())
    return {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    }
  }

  const classifyUri = (uri: string): PDFLinkKind => {
    if (/^mailto:/i.test(uri)) return 'Email'
    if (/^tel:/i.test(uri)) return 'Phone'
    return 'Web'
  }

  const resolveAction = (actionCandidate: unknown): Pick<PDFLinkRecord, 'kind' | 'target' | 'destinationPage' | 'view'> => {
    const action = dereference(actionCandidate)
    if (!(action instanceof pdfLib.PDFDict)) return { kind: 'Unresolved', target: 'Missing link action', destinationPage: null, view: '' }
    const actionType = textValue(action.get(key('S')))
    if (actionType === 'URI') {
      const uri = textValue(action.get(key('URI')))
      return uri ? { kind: classifyUri(uri), target: uri, destinationPage: null, view: '' } : { kind: 'Unresolved', target: 'URI action without a target', destinationPage: null, view: '' }
    }
    if (actionType === 'GoTo') {
      const destination = destinationDetails(action.get(key('D')))
      return destination.page ? { kind: 'Internal page', target: destination.raw, destinationPage: destination.page, view: destination.view } : { kind: 'Unresolved', target: destination.raw, destinationPage: null, view: destination.view }
    }
    if (actionType === 'GoToR') {
      const file = fileSpecText(action.get(key('F')))
      const destination = destinationDetails(action.get(key('D')))
      const rawDestination = textValue(action.get(key('D'))) || destination.raw
      return { kind: 'External PDF', target: [file, rawDestination && rawDestination !== 'Unresolved destination' ? `# ${rawDestination}` : ''].filter(Boolean).join(' '), destinationPage: null, view: destination.view }
    }
    if (actionType === 'Launch') return { kind: 'File launch', target: fileSpecText(action.get(key('F'))) || 'File launch action', destinationPage: null, view: '' }
    if (actionType === 'SubmitForm') return { kind: 'Form submission', target: fileSpecText(action.get(key('F'))) || 'Form submission target', destinationPage: null, view: '' }
    if (actionType === 'Named') return { kind: 'Named action', target: textValue(action.get(key('N'))) || 'Unnamed action', destinationPage: null, view: '' }
    if (actionType === 'JavaScript') return { kind: 'JavaScript', target: 'Embedded JavaScript (not opened, returned, or executed)', destinationPage: null, view: '' }
    if (actionType === 'ResetForm') return { kind: 'Other', target: 'Reset form action', destinationPage: null, view: '' }
    if (actionType === 'ImportData') return { kind: 'Other', target: `Import data: ${fileSpecText(action.get(key('F')))}`.trim(), destinationPage: null, view: '' }
    return { kind: 'Other', target: actionType ? `${actionType} action` : 'Unclassified action', destinationPage: null, view: '' }
  }

  const links: PDFLinkRecord[] = []
  const pages = document.getPages()
  let truncated = false
  let malformedRectangles = 0

  for (let pageIndex = 0; pageIndex < pages.length && !truncated; pageIndex += 1) {
    const annotations = dereference(pages[pageIndex].node.get(key('Annots')))
    if (!(annotations instanceof pdfLib.PDFArray)) continue
    for (let index = 0; index < annotations.size(); index += 1) {
      const annotation = dereference(annotations.get(index))
      if (!(annotation instanceof pdfLib.PDFDict) || textValue(annotation.get(key('Subtype'))) !== 'Link') continue
      if (links.length >= MAX_LINKS) { truncated = true; break }
      const directDestination = annotation.get(key('Dest'))
      let details: Pick<PDFLinkRecord, 'kind' | 'target' | 'destinationPage' | 'view'>
      if (directDestination) {
        const destination = destinationDetails(directDestination)
        details = destination.page ? { kind: 'Internal page', target: destination.raw, destinationPage: destination.page, view: destination.view } : { kind: 'Unresolved', target: destination.raw, destinationPage: null, view: destination.view }
      } else details = resolveAction(annotation.get(key('A')))
      const rectangle = rectangleValue(annotation.get(key('Rect')))
      if (!rectangle) malformedRectangles += 1
      links.push({
        order: links.length + 1,
        pageNumber: pageIndex + 1,
        ...details,
        rectangle,
        description: textValue(annotation.get(key('Contents'))) || textValue(annotation.get(key('T'))) || '',
      })
    }
  }

  const pagesWithLinks = new Set(links.map(link => link.pageNumber)).size
  const externalKinds = new Set<PDFLinkKind>(['Web', 'Email', 'Phone', 'External PDF', 'File launch', 'Form submission'])
  const externalCount = links.filter(link => externalKinds.has(link.kind)).length
  const internalCount = links.filter(link => link.kind === 'Internal page').length
  const unresolvedCount = links.filter(link => link.kind === 'Unresolved').length
  const scriptCount = links.filter(link => link.kind === 'JavaScript').length
  const warnings: string[] = []
  if (truncated) warnings.push(`Only the first ${MAX_LINKS.toLocaleString()} link annotations were loaded for safe browser processing.`)
  if (malformedRectangles) warnings.push(`${malformedRectangles} link annotation${malformedRectangles === 1 ? '' : 's'} had no readable rectangle coordinates.`)
  if (scriptCount) warnings.push(`${scriptCount} JavaScript link action${scriptCount === 1 ? '' : 's'} ${scriptCount === 1 ? 'was' : 'were'} classified but the script content was not opened, returned, or executed.`)

  return { pageCount, links, pagesWithLinks, externalCount, internalCount, unresolvedCount, scriptCount, warnings }
}

export async function removePDFLinks(bytes: Uint8Array): Promise<PDFLinkRemoval> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const subtypeKey = pdfLib.PDFName.of('Subtype')
  const annotationsKey = pdfLib.PDFName.of('Annots')
  let removedLinks = 0
  let changedPages = 0

  for (const page of document.getPages()) {
    const annotations = page.node.Annots()
    if (!annotations) continue
    let pageRemoved = 0
    for (let index = annotations.size() - 1; index >= 0; index -= 1) {
      const candidate = annotations.get(index)
      const annotation = candidate instanceof pdfLib.PDFRef ? document.context.lookup(candidate) : candidate
      if (!(annotation instanceof pdfLib.PDFDict) || annotation.get(subtypeKey)?.toString() !== '/Link') continue
      annotations.remove(index)
      pageRemoved += 1
      removedLinks += 1
      if (candidate instanceof pdfLib.PDFRef) document.context.delete(candidate)
    }
    if (pageRemoved) {
      changedPages += 1
      if (!annotations.size()) page.node.delete(annotationsKey)
    }
  }

  const output = await document.save({
    addDefaultPage: false,
    updateFieldAppearances: false,
    useObjectStreams: true,
  })
  const verification = await inspectPDFLinks(output)
  if (verification.links.length) throw new Error('The link-free copy could not be verified. Your original PDF was not changed.')
  if (verification.pageCount !== document.getPageCount()) throw new Error('The output page count changed unexpectedly. Your original PDF was not changed.')

  return { bytes: output, removedLinks, changedPages, pageCount: verification.pageCount }
}
