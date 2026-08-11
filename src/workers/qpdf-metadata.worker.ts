/// <reference lib="webworker" />

import createQpdf, { type QpdfInstance } from '@neslinesli93/qpdf-wasm'

interface MetadataRequest {
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

function errorMessage(log: string, error: unknown): string {
  const detail = `${log}\n${error instanceof Error ? error.message : String(error)}`
  if (/invalid password|password.*required|encrypted file/i.test(detail)) {
    return 'This PDF is password-protected. Unlock it with the known password before removing metadata.'
  }
  if (/not a pdf|unable to find.*header|unable to find.*trailer|unable to find.*root|no pages/i.test(detail)) {
    return 'This file does not contain a readable PDF structure.'
  }
  if (/out of memory|memory access out of bounds|cannot enlarge memory/i.test(detail)) {
    return 'This PDF is too large or complex for the browser to clean safely.'
  }
  return 'The PDF metadata could not be removed. The file may be damaged or use unsupported protection.'
}

worker.onmessage = async (event: MessageEvent<MetadataRequest>) => {
  const inputPath = '/tmp/source.pdf'
  const outputPath = '/tmp/no-metadata.pdf'
  const messages: string[] = []
  let qpdf: WritableQpdfInstance | null = null

  try {
    worker.postMessage({ type: 'progress', value: 34, label: 'Loading local privacy engine' })
    const options: QpdfFactoryOptions = {
      locateFile: () => '/wasm/qpdf.wasm',
      noInitialRun: true,
      print: message => messages.push(message),
      printErr: message => messages.push(message),
    }
    qpdf = (await createQpdf(options)) as WritableQpdfInstance
    qpdf.FS.writeFile(inputPath, new Uint8Array(event.data.buffer))

    worker.postMessage({ type: 'progress', value: 58, label: 'Removing document properties and XMP packets' })
    qpdf.callMain([
      '--warning-exit-0',
      '--remove-info',
      '--remove-metadata',
      '--object-streams=generate',
      inputPath,
      outputPath,
    ])

    worker.postMessage({ type: 'progress', value: 78, label: 'Preparing the sanitized PDF structure' })
    const output = qpdf.FS.readFile(outputPath)
    const transferable = output.buffer.slice(
      output.byteOffset,
      output.byteOffset + output.byteLength,
    ) as ArrayBuffer
    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({ type: 'error', message: errorMessage(messages.join('\n'), error) })
  } finally {
    try { qpdf?.FS.unlink(inputPath) } catch { /* Input may not exist. */ }
    try { qpdf?.FS.unlink(outputPath) } catch { /* Output may not exist. */ }
  }
}

export {}
