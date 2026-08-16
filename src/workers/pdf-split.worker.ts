/// <reference lib="webworker" />

import { PDFDocument } from 'pdf-lib'

interface SplitGroup {
  label: string
  indices: number[]
}

interface SplitRequest {
  buffer: ArrayBuffer
  groups: SplitGroup[]
}

const worker = self as DedicatedWorkerGlobalScope

worker.onmessage = async (event: MessageEvent<SplitRequest>) => {
  try {
    const { buffer, groups } = event.data
    const srcDoc = await PDFDocument.load(buffer)
    const transferables: ArrayBuffer[] = []
    const outputs: { label: string; buffer: ArrayBuffer; pageCount: number }[] = []

    for (let g = 0; g < groups.length; g++) {
      const { label, indices } = groups[g]
      const outDoc = await PDFDocument.create()
      const copied = await outDoc.copyPages(srcDoc, indices)
      copied.forEach(p => outDoc.addPage(p))
      const bytes = await outDoc.save()
      const transferable = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer

      outputs.push({ label, buffer: transferable, pageCount: outDoc.getPageCount() })
      transferables.push(transferable)
      worker.postMessage({ type: 'progress', value: 5 + Math.round(((g + 1) / groups.length) * 90) })
    }

    worker.postMessage({ type: 'success', outputs }, transferables)
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Split failed.',
    })
  }
}

export {}
