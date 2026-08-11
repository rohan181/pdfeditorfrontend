/// <reference lib="webworker" />

import {
  decodePDFRawStream,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFObject,
  PDFRawStream,
  PDFString,
} from 'pdf-lib'

const MAX_ATTACHMENTS = 500
const MAX_ATTACHMENT_BYTES = 200 * 1024 * 1024
const MAX_TOTAL_BYTES = 300 * 1024 * 1024

type AttachmentSource = 'Document attachment' | 'Associated file' | 'File annotation'

interface AttachmentRequest {
  buffer: ArrayBuffer
}

interface AttachmentResult {
  id: string
  name: string
  description?: string
  mimeType: string
  relationship?: string
  created?: string
  modified?: string
  source: AttachmentSource[]
  buffer: ArrayBuffer
}

interface Candidate {
  spec: PDFDict
  fallbackNames: string[]
  sources: Set<AttachmentSource>
}

const worker = self as DedicatedWorkerGlobalScope

const NAMES = PDFName.of('Names')
const EMBEDDED_FILES = PDFName.of('EmbeddedFiles')
const KIDS = PDFName.of('Kids')
const AF = PDFName.of('AF')
const ANNOTS = PDFName.of('Annots')
const SUBTYPE = PDFName.of('Subtype')
const FILE_ATTACHMENT = PDFName.of('FileAttachment')
const FS = PDFName.of('FS')
const EF = PDFName.of('EF')
const UF = PDFName.of('UF')
const F = PDFName.of('F')
const DOS = PDFName.of('DOS')
const MAC = PDFName.of('Mac')
const UNIX = PDFName.of('Unix')
const DESC = PDFName.of('Desc')
const PARAMS = PDFName.of('Params')
const SIZE = PDFName.of('Size')
const CREATION_DATE = PDFName.of('CreationDate')
const MOD_DATE = PDFName.of('ModDate')
const AF_RELATIONSHIP = PDFName.of('AFRelationship')

function lookup(document: PDFDocument, object: PDFObject | undefined): PDFObject | undefined {
  if (!object) return undefined
  try { return document.context.lookup(object) }
  catch { return undefined }
}

function textValue(object: PDFObject | undefined): string | undefined {
  try {
    if (object instanceof PDFName) {
      const decoded = object.decodeText().replace(/^\//, '').replace(/#([0-9a-fA-F]{2})/g, (_match, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)))
      return decoded.trim() || undefined
    }
    if (object instanceof PDFString || object instanceof PDFHexString) {
      return object.decodeText().trim() || undefined
    }
  } catch { /* Malformed optional strings are ignored. */ }
  return undefined
}

function dateValue(object: PDFObject | undefined): string | undefined {
  try {
    if (object instanceof PDFString || object instanceof PDFHexString) return object.decodeDate().toISOString()
  } catch { /* Malformed optional dates are ignored. */ }
  return undefined
}

function decodedSize(stream: PDFRawStream, document: PDFDocument): number | undefined {
  const params = lookup(document, stream.dict.get(PARAMS))
  if (!(params instanceof PDFDict)) return undefined
  const size = lookup(document, params.get(SIZE))
  return size instanceof PDFNumber ? size.asNumber() : undefined
}

function filenameFor(candidate: Candidate): string {
  const preferred = [UF, F, UNIX, DOS, MAC]
    .map(key => textValue(candidate.spec.get(key)))
    .find(Boolean)
  return preferred || candidate.fallbackNames.find(Boolean) || 'embedded-file'
}

function collectFromArray(
  document: PDFDocument,
  object: PDFObject | undefined,
  source: AttachmentSource,
  addCandidate: (object: PDFObject | undefined, source: AttachmentSource, fallbackName?: string) => void,
) {
  const array = lookup(document, object)
  if (!(array instanceof PDFArray)) return
  for (let index = 0; index < array.size(); index += 1) addCandidate(array.get(index), source)
}

function errorMessage(error: unknown): string {
  const detail = error instanceof Error ? error.message : String(error)
  if (/password|encrypt/i.test(detail)) return 'This PDF is password-protected. Unlock it with the known password before extracting attachments.'
  if (/too many embedded files/i.test(detail)) return detail
  if (/larger than 200 MB|exceed 300 MB/i.test(detail)) return detail
  if (/invalid object|no pdf header|parse|trailer|root/i.test(detail)) return 'This file does not contain a readable PDF structure.'
  return 'Attachments could not be read from this PDF. The file may be damaged or use an unsupported embedded-file encoding.'
}

worker.onmessage = async (event: MessageEvent<AttachmentRequest>) => {
  try {
    worker.postMessage({ type: 'progress', value: 18, label: 'Reading PDF structure' })
    const document = await PDFDocument.load(new Uint8Array(event.data.buffer), { updateMetadata: false })
    const candidates = new Map<PDFDict, Candidate>()
    const seenTrees = new Set<PDFDict>()

    const addCandidate = (object: PDFObject | undefined, source: AttachmentSource, fallbackName?: string) => {
      const spec = lookup(document, object)
      if (!(spec instanceof PDFDict)) return
      let candidate = candidates.get(spec)
      if (!candidate) {
        if (candidates.size >= MAX_ATTACHMENTS) throw new Error(`This PDF contains too many embedded files. The limit is ${MAX_ATTACHMENTS}.`)
        candidate = { spec, fallbackNames: [], sources: new Set() }
        candidates.set(spec, candidate)
      }
      if (fallbackName) candidate.fallbackNames.push(fallbackName)
      candidate.sources.add(source)
    }

    const visitNameTree = (object: PDFObject | undefined) => {
      const tree = lookup(document, object)
      if (!(tree instanceof PDFDict) || seenTrees.has(tree)) return
      seenTrees.add(tree)
      const pairs = lookup(document, tree.get(NAMES))
      if (pairs instanceof PDFArray) {
        for (let index = 0; index + 1 < pairs.size(); index += 2) {
          addCandidate(pairs.get(index + 1), 'Document attachment', textValue(pairs.get(index)))
        }
      }
      const kids = lookup(document, tree.get(KIDS))
      if (kids instanceof PDFArray) {
        for (let index = 0; index < kids.size(); index += 1) visitNameTree(kids.get(index))
      }
    }

    const catalogNames = lookup(document, document.catalog.get(NAMES))
    if (catalogNames instanceof PDFDict) visitNameTree(catalogNames.get(EMBEDDED_FILES))
    collectFromArray(document, document.catalog.get(AF), 'Associated file', addCandidate)

    for (const page of document.getPages()) {
      collectFromArray(document, page.node.get(AF), 'Associated file', addCandidate)
      const annotations = lookup(document, page.node.get(ANNOTS))
      if (!(annotations instanceof PDFArray)) continue
      for (let index = 0; index < annotations.size(); index += 1) {
        const annotation = lookup(document, annotations.get(index))
        if (!(annotation instanceof PDFDict) || annotation.get(SUBTYPE)?.toString() !== FILE_ATTACHMENT.toString()) continue
        addCandidate(annotation.get(FS), 'File annotation')
      }
    }

    worker.postMessage({ type: 'progress', value: 48, label: 'Decoding embedded files' })
    const results: AttachmentResult[] = []
    const transferables: ArrayBuffer[] = []
    let totalBytes = 0
    let itemIndex = 0
    for (const candidate of Array.from(candidates.values())) {
      const ef = lookup(document, candidate.spec.get(EF))
      if (!(ef instanceof PDFDict)) continue
      let stream: PDFRawStream | undefined
      for (const key of [UF, F, UNIX, DOS, MAC]) {
        const possible = lookup(document, ef.get(key))
        if (possible instanceof PDFRawStream) { stream = possible; break }
      }
      if (!stream) continue

      const declaredSize = decodedSize(stream, document)
      const name = filenameFor(candidate)
      if (declaredSize && declaredSize > MAX_ATTACHMENT_BYTES) throw new Error(`The attachment "${name}" is larger than 200 MB and cannot be extracted safely in the browser.`)
      const decoded = decodePDFRawStream(stream).decode()
      if (decoded.byteLength > MAX_ATTACHMENT_BYTES) throw new Error(`The attachment "${name}" is larger than 200 MB and cannot be extracted safely in the browser.`)
      totalBytes += decoded.byteLength
      if (totalBytes > MAX_TOTAL_BYTES) throw new Error('The extracted attachments exceed 300 MB in total and cannot be held safely in browser memory.')

      const params = lookup(document, stream.dict.get(PARAMS))
      const mimeType = textValue(stream.dict.get(SUBTYPE)) || 'application/octet-stream'
      const buffer = decoded.buffer.slice(decoded.byteOffset, decoded.byteOffset + decoded.byteLength) as ArrayBuffer
      transferables.push(buffer)
      results.push({
        id: `attachment-${itemIndex += 1}`,
        name,
        description: textValue(candidate.spec.get(DESC)),
        mimeType,
        relationship: textValue(candidate.spec.get(AF_RELATIONSHIP)),
        created: params instanceof PDFDict ? dateValue(params.get(CREATION_DATE)) : undefined,
        modified: params instanceof PDFDict ? dateValue(params.get(MOD_DATE)) : undefined,
        source: Array.from(candidate.sources),
        buffer,
      })
    }

    worker.postMessage({ type: 'progress', value: 92, label: 'Preparing safe downloads' })
    worker.postMessage({
      type: 'success',
      attachments: results,
      pages: document.getPageCount(),
      totalBytes,
    }, transferables)
  } catch (error) {
    worker.postMessage({ type: 'error', message: errorMessage(error) })
  }
}

export {}
