/// <reference lib="webworker" />

import createQpdf, { type QpdfInstance } from '@neslinesli93/qpdf-wasm'

interface UnlockRequest {
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

function errorMessage(log: string, error: unknown, passwordProvided: boolean): string {
  const detail = `${log}\n${error instanceof Error ? error.message : String(error)}`

  if (/invalid password|incorrect password|password.*invalid/i.test(detail)) {
    return 'That password is incorrect. Check it and try again.'
  }
  if (/not a pdf|damaged pdf|unable to find trailer|xref/i.test(detail)) {
    return 'This file is not a valid PDF or is too damaged to unlock.'
  }
  if (/out of memory|memory access out of bounds|cannot enlarge memory/i.test(detail)) {
    return 'This PDF is too large for the browser to unlock safely.'
  }

  if (passwordProvided) {
    return 'That password was not accepted, or the PDF uses certificate or DRM protection this tool cannot remove.'
  }

  return 'The PDF could not be unlocked. It may use unsupported certificate or DRM protection.'
}

worker.onmessage = async (event: MessageEvent<UnlockRequest>) => {
  const inputPath = '/tmp/input.pdf'
  const outputPath = '/tmp/unlocked.pdf'
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

    worker.postMessage({ type: 'progress', value: 58, label: 'Checking password' })
    qpdf.FS.writeFile(inputPath, new Uint8Array(event.data.buffer))

    qpdf.callMain([
      `--password=${event.data.password}`,
      '--decrypt',
      inputPath,
      outputPath,
    ])

    worker.postMessage({ type: 'progress', value: 88, label: 'Preparing unlocked PDF' })
    const output = qpdf.FS.readFile(outputPath)
    const transferable = output.buffer.slice(
      output.byteOffset,
      output.byteOffset + output.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: errorMessage(messages.join('\n'), error, event.data.password.length > 0),
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
      // Output is not created when validation or password checks fail.
    }
  }
}

export {}
