/// <reference lib="webworker" />

import createQpdf, { type QpdfInstance } from '@neslinesli93/qpdf-wasm'

interface LockRequest {
  buffer: ArrayBuffer
  password: string
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

  if (/not a pdf|damaged pdf|unable to find trailer|xref/i.test(detail)) {
    return 'This file is not a valid PDF or is too damaged to lock.'
  }
  if (/out of memory|memory access out of bounds|cannot enlarge memory/i.test(detail)) {
    return 'This PDF is too large for the browser to lock safely.'
  }

  return 'The PDF could not be locked. It may use unsupported certificate or DRM protection.'
}

worker.onmessage = async (event: MessageEvent<LockRequest>) => {
  const inputPath = '/tmp/input.pdf'
  const outputPath = '/tmp/locked.pdf'
  const messages: string[] = []
  let qpdf: WritableQpdfInstance | null = null

  try {
    worker.postMessage({ type: 'progress', value: 30, label: 'Loading secure PDF engine' })

    const options: QpdfFactoryOptions = {
      locateFile: () => '/wasm/qpdf.wasm',
      noInitialRun: true,
      print: message => messages.push(message),
      printErr: message => messages.push(message),
    }
    qpdf = (await createQpdf(options)) as WritableQpdfInstance

    worker.postMessage({ type: 'progress', value: 58, label: 'Encrypting PDF' })
    qpdf.FS.writeFile(inputPath, new Uint8Array(event.data.buffer))

    // AES-256 (V=5/R=6) — supported by Chrome, Preview, and Acrobat DC+
    qpdf.callMain([
      '--encrypt', event.data.password, event.data.password, '256',
      '--',
      inputPath, outputPath,
    ])

    worker.postMessage({ type: 'progress', value: 88, label: 'Preparing locked PDF' })
    const output = qpdf.FS.readFile(outputPath)
    const transferable = output.buffer.slice(
      output.byteOffset,
      output.byteOffset + output.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: errorMessage(messages.join('\n'), error),
    })
  } finally {
    try {
      qpdf?.FS.unlink(inputPath)
    } catch {
      // Input may not exist if loading the local PDF engine failed.
    }
    try {
      qpdf?.FS.unlink(outputPath)
    } catch {
      // Output is not created when encryption fails.
    }
  }
}

export {}
