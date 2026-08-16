/// <reference lib="webworker" />

import { PDFDocument } from 'pdf-lib'

interface MergeRequest {
  buffers: ArrayBuffer[]
}

const worker = self as DedicatedWorkerGlobalScope

worker.onmessage = async (event: MessageEvent<MergeRequest>) => {
  try {
    const { buffers } = event.data
    const out = await PDFDocument.create()

    for (let i = 0; i < buffers.length; i++) {
      const srcDoc = await PDFDocument.load(buffers[i])
      const copied = await out.copyPages(srcDoc, srcDoc.getPageIndices())
      copied.forEach(p => out.addPage(p))
      worker.postMessage({ type: 'progress', value: 5 + Math.round(((i + 1) / buffers.length) * 88) })
    }

    worker.postMessage({ type: 'progress', value: 97 })
    const bytes = await out.save()
    const transferable = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer

    worker.postMessage(
      { type: 'success', buffer: transferable, pageCount: out.getPageCount() },
      [transferable],
    )
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Merge failed.',
    })
  }
}

export {}
