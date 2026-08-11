import type { PDFNumber } from 'pdf-lib'

export type PDFCommentKind =
  | 'Sticky note'
  | 'Text box'
  | 'Highlight'
  | 'Underline'
  | 'Strikeout'
  | 'Squiggly'
  | 'Stamp'
  | 'Ink'
  | 'Shape'
  | 'Caret'
  | 'Attachment'
  | 'Redaction'
  | 'Media'
  | 'Other'

export type PDFCommentRectangle = {
  x: number
  y: number
  width: number
  height: number
}

export type PDFCommentRecord = {
  order: number
  pageNumber: number
  kind: PDFCommentKind
  subtype: string
  author: string
  contents: string
  subject: string
  annotationId: string
  createdAt: string
  modifiedAt: string
  intent: string
  state: string
  stateModel: string
  replyType: string
  replyTo: number | null
  rectangle: PDFCommentRectangle | null
  color: number[]
  opacity: number | null
}

export type PDFCommentInspection = {
  pageCount: number
  comments: PDFCommentRecord[]
  pagesWithComments: number
  authorCount: number
  replyCount: number
  warnings: string[]
}

const MAX_COMMENTS = 10_000
const MAX_TEXT = 4_096

function limited(value: string): string {
  const clean = value.replace(/\u0000/g, '')
  return clean.length > MAX_TEXT ? `${clean.slice(0, MAX_TEXT - 3)}...` : clean
}

function normalizePdfDate(value: string): string {
  const match = value.match(/^(?:D:)?(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?(?:([Zz]|[+-])(\d{2})?'?(\d{2})?'?)?$/)
  if (!match) return value
  const [, year, month = '01', day = '01', hour = '00', minute = '00', second = '00', zone, zoneHour = '00', zoneMinute = '00'] = match
  const offset = !zone || /z/i.test(zone) ? 'Z' : `${zone}${zoneHour}:${zoneMinute}`
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`
  const parsed = new Date(iso)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString()
}

function commentKind(subtype: string): PDFCommentKind {
  if (subtype === 'Text') return 'Sticky note'
  if (subtype === 'FreeText') return 'Text box'
  if (subtype === 'Highlight') return 'Highlight'
  if (subtype === 'Underline') return 'Underline'
  if (subtype === 'StrikeOut') return 'Strikeout'
  if (subtype === 'Squiggly') return 'Squiggly'
  if (subtype === 'Stamp') return 'Stamp'
  if (subtype === 'Ink') return 'Ink'
  if (['Square', 'Circle', 'Polygon', 'PolyLine', 'Line'].includes(subtype)) return 'Shape'
  if (subtype === 'Caret') return 'Caret'
  if (subtype === 'FileAttachment') return 'Attachment'
  if (subtype === 'Redact') return 'Redaction'
  if (['Sound', 'Movie', 'Screen', '3D', 'RichMedia'].includes(subtype)) return 'Media'
  return 'Other'
}

export async function inspectPDFComments(bytes: Uint8Array): Promise<PDFCommentInspection> {
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
  const numberValue = (value: unknown): number | null => {
    const object = dereference(value)
    return object instanceof pdfLib.PDFNumber ? object.asNumber() : null
  }
  const numberArray = (value: unknown): number[] => {
    const object = dereference(value)
    if (!(object instanceof pdfLib.PDFArray)) return []
    const values: number[] = []
    for (let index = 0; index < object.size(); index += 1) {
      const number = numberValue(object.get(index))
      if (number === null || !Number.isFinite(number)) return []
      values.push(number)
    }
    return values
  }
  const rectangleValue = (value: unknown): PDFCommentRectangle | null => {
    const object = dereference(value)
    if (!(object instanceof pdfLib.PDFArray) || object.size() < 4) return null
    const values = Array.from({ length: 4 }, (_, index) => dereference(object.get(index)))
    if (!values.every(item => item instanceof pdfLib.PDFNumber)) return null
    const [x1, y1, x2, y2] = values.map(item => (item as PDFNumber).asNumber())
    return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) }
  }

  type PendingComment = PDFCommentRecord & { replyCandidate: unknown; dictionary: object; reference: string }
  const pending: PendingComment[] = []
  let truncated = false
  let malformedRectangles = 0
  let contentless = 0

  for (let pageIndex = 0; pageIndex < document.getPages().length && !truncated; pageIndex += 1) {
    const annotations = dereference(document.getPages()[pageIndex].node.get(key('Annots')))
    if (!(annotations instanceof pdfLib.PDFArray)) continue
    for (let index = 0; index < annotations.size(); index += 1) {
      const candidate = annotations.get(index)
      const annotation = dereference(candidate)
      if (!(annotation instanceof pdfLib.PDFDict)) continue
      const subtype = textValue(annotation.get(key('Subtype')))
      if (!subtype || subtype === 'Link' || subtype === 'Widget' || subtype === 'Popup') continue
      if (pending.length >= MAX_COMMENTS) { truncated = true; break }
      const rectangle = rectangleValue(annotation.get(key('Rect')))
      if (!rectangle) malformedRectangles += 1
      const contents = textValue(annotation.get(key('Contents')))
      const subject = textValue(annotation.get(key('Subj')))
      if (!contents && !subject) contentless += 1
      pending.push({
        order: pending.length + 1,
        pageNumber: pageIndex + 1,
        kind: commentKind(subtype),
        subtype,
        author: textValue(annotation.get(key('T'))),
        contents,
        subject,
        annotationId: textValue(annotation.get(key('NM'))),
        createdAt: normalizePdfDate(textValue(annotation.get(key('CreationDate')))),
        modifiedAt: normalizePdfDate(textValue(annotation.get(key('M')))),
        intent: textValue(annotation.get(key('IT'))),
        state: textValue(annotation.get(key('State'))),
        stateModel: textValue(annotation.get(key('StateModel'))),
        replyType: textValue(annotation.get(key('RT'))),
        replyTo: null,
        rectangle,
        color: numberArray(annotation.get(key('C'))),
        opacity: numberValue(annotation.get(key('CA'))),
        replyCandidate: annotation.get(key('IRT')),
        dictionary: annotation,
        reference: candidate instanceof pdfLib.PDFRef ? candidate.toString() : '',
      })
    }
  }

  const orderByReference = new Map(pending.filter(item => item.reference).map(item => [item.reference, item.order]))
  const orderByDictionary = new Map(pending.map(item => [item.dictionary, item.order]))
  const comments = pending.map(({ replyCandidate, dictionary: _dictionary, reference: _reference, ...comment }) => {
    const resolved = dereference(replyCandidate)
    const replyTo = replyCandidate instanceof pdfLib.PDFRef
      ? orderByReference.get(replyCandidate.toString()) ?? null
      : resolved && typeof resolved === 'object'
        ? orderByDictionary.get(resolved as object) ?? null
        : null
    return { ...comment, replyTo }
  })

  const warnings: string[] = []
  if (truncated) warnings.push(`Only the first ${MAX_COMMENTS.toLocaleString()} review annotations were loaded for safe browser processing.`)
  if (malformedRectangles) warnings.push(`${malformedRectangles} review annotation${malformedRectangles === 1 ? '' : 's'} had no readable rectangle coordinates.`)
  if (contentless) warnings.push(`${contentless} annotation${contentless === 1 ? '' : 's'} had no text or subject but ${contentless === 1 ? 'was' : 'were'} included because the markup itself may be meaningful.`)

  return {
    pageCount,
    comments,
    pagesWithComments: new Set(comments.map(comment => comment.pageNumber)).size,
    authorCount: new Set(comments.map(comment => comment.author.trim().toLowerCase()).filter(Boolean)).size,
    replyCount: comments.filter(comment => comment.replyTo !== null).length,
    warnings,
  }
}
