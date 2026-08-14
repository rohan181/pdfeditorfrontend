/// <reference lib="webworker" />

import createQpdf, { type QpdfInstance } from '@neslinesli93/qpdf-wasm'

interface RepairRequest {
  buffer: ArrayBuffer
}

interface WritableQpdfInstance extends QpdfInstance {
  FS: QpdfInstance['FS'] & {
    writeFile: (path: string, data: Uint8Array) => void
    unlink: (path: string) => void
  }
}

type QpdfFactoryOptions = Parameters<typeof createQpdf>[0] & {
  noInitialRun?: boolean
  print?: (message: string) => void
  printErr?: (message: string) => void
}

const worker = self as DedicatedWorkerGlobalScope
const encoder = new TextEncoder()

function lastIndexOf(bytes: Uint8Array, needle: Uint8Array): number {
  for (let index = bytes.length - needle.length; index >= 0; index -= 1) {
    let matches = true
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (bytes[index + offset] !== needle[offset]) {
        matches = false
        break
      }
    }
    if (matches) return index
  }
  return -1
}

function isWhitespace(byte: number | undefined): boolean {
  return byte === 0 || byte === 9 || byte === 10 || byte === 12 || byte === 13 || byte === 32
}

function findClassicXref(bytes: Uint8Array): number {
  const needle = encoder.encode('xref')
  let searchEnd = bytes.length

  while (searchEnd >= needle.length) {
    const index = lastIndexOf(bytes.subarray(0, searchEnd), needle)
    if (index < 0) return -1
    const previous = bytes[index - 1]
    const next = bytes[index + needle.length]
    if ((index === 0 || previous === 10 || previous === 13) && isWhitespace(next)) {
      return index
    }
    searchEnd = index
  }

  return -1
}

function findXrefStream(bytes: Uint8Array): number {
  const tailStart = Math.max(0, bytes.length - 8 * 1024 * 1024)
  const tail = new TextDecoder('latin1').decode(bytes.subarray(tailStart))
  // The scan between "N G obj" and "/Type /XRef" must not cross into a later,
  // unrelated object — otherwise this can match an earlier object's header
  // with a DIFFERENT object's /Type /XRef that happens to follow within the
  // window, computing the wrong offset and corrupting a healthy file.
  const pattern = /(?:^|[\r\n])(\d+)\s+(\d+)\s+obj\b(?:(?!endobj)[\s\S]){0,2048}?\/Type\s*\/XRef\b/g
  let match: RegExpExecArray | null
  let offset = -1

  while ((match = pattern.exec(tail)) !== null) {
    const objectStart = match.index + match[0].search(/\d/)
    offset = tailStart + objectStart
  }

  return offset
}

function repairStartXref(bytes: Uint8Array): { bytes: Uint8Array; repaired: boolean } {
  const xrefOffset = Math.max(findClassicXref(bytes), findXrefStream(bytes))
  if (xrefOffset < 0) return { bytes, repaired: false }

  const marker = encoder.encode('startxref')
  const markerIndex = lastIndexOf(bytes, marker)
  const replacement = encoder.encode(String(xrefOffset))

  if (markerIndex < 0) {
    const suffix = encoder.encode(`\nstartxref\n${xrefOffset}\n%%EOF\n`)
    const repaired = new Uint8Array(bytes.length + suffix.length)
    repaired.set(bytes)
    repaired.set(suffix, bytes.length)
    return { bytes: repaired, repaired: true }
  }

  let numberStart = markerIndex + marker.length
  while (numberStart < bytes.length && isWhitespace(bytes[numberStart])) numberStart += 1
  let numberEnd = numberStart
  while (numberEnd < bytes.length && bytes[numberEnd] >= 48 && bytes[numberEnd] <= 57) numberEnd += 1

  let currentOffset = 0
  for (let index = numberStart; index < numberEnd; index += 1) {
    currentOffset = currentOffset * 10 + bytes[index] - 48
  }
  if (numberEnd > numberStart && currentOffset === xrefOffset) {
    return { bytes, repaired: false }
  }

  const repaired = new Uint8Array(bytes.length - (numberEnd - numberStart) + replacement.length)
  repaired.set(bytes.subarray(0, numberStart), 0)
  repaired.set(replacement, numberStart)
  repaired.set(bytes.subarray(numberEnd), numberStart + replacement.length)
  return { bytes: repaired, repaired: true }
}

function errorMessage(log: string, error: unknown): string {
  const detail = `${log}\n${error instanceof Error ? error.message : String(error)}`

  if (/invalid password|password.*required|encrypted file/i.test(detail)) {
    return 'This PDF is password-protected. Unlock it with the known password first, then repair the unlocked copy.'
  }
  if (/not a pdf|unable to find.*header|unable to find.*trailer|unable to find.*root|no pages|can't find startxref/i.test(detail)) {
    return 'This file is too damaged to recover automatically. Try another copy or restore it from a backup.'
  }
  if (/out of memory|memory access out of bounds|cannot enlarge memory/i.test(detail)) {
    return 'This PDF is too large or complex for the browser to repair safely.'
  }

  return 'The PDF could not be repaired automatically. It may be severely damaged or use unsupported protection.'
}

worker.onmessage = async (event: MessageEvent<RepairRequest>) => {
  const inputPath = '/tmp/damaged.pdf'
  const outputPath = '/tmp/repaired.pdf'
  const messages: string[] = []
  let qpdf: WritableQpdfInstance | null = null

  try {
    worker.postMessage({ type: 'progress', value: 24, label: 'Inspecting cross-reference data' })
    const prepared = repairStartXref(new Uint8Array(event.data.buffer))

    worker.postMessage({ type: 'progress', value: 46, label: 'Loading local repair engine' })
    const options: QpdfFactoryOptions = {
      locateFile: () => '/wasm/qpdf.wasm',
      noInitialRun: true,
      print: message => messages.push(message),
      printErr: message => messages.push(message),
    }
    qpdf = (await createQpdf(options)) as WritableQpdfInstance
    qpdf.FS.writeFile(inputPath, prepared.bytes)

    worker.postMessage({ type: 'progress', value: 68, label: 'Rebuilding readable document structure' })
    qpdf.callMain([
      '--warning-exit-0',
      '--object-streams=generate',
      inputPath,
      outputPath,
    ])

    worker.postMessage({ type: 'progress', value: 88, label: 'Preparing a clean PDF copy' })
    const output = qpdf.FS.readFile(outputPath)
    const transferable = output.buffer.slice(
      output.byteOffset,
      output.byteOffset + output.byteLength,
    ) as ArrayBuffer
    const recoveredIssues = prepared.repaired || messages.some(message =>
      /warning|damaged|reconstruct|recover|xref|object stream/i.test(message),
    )

    worker.postMessage(
      { type: 'success', buffer: transferable, recoveredIssues },
      [transferable],
    )
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: errorMessage(messages.join('\n'), error),
    })
  } finally {
    try {
      qpdf?.FS.unlink(inputPath)
    } catch {
      // Input may not exist if the WebAssembly engine failed to load.
    }
    try {
      qpdf?.FS.unlink(outputPath)
    } catch {
      // Output is not created when the document cannot be recovered.
    }
  }
}

export {}
