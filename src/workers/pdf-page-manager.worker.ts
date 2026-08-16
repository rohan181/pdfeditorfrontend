/// <reference lib="webworker" />

import { PDFDocument, degrees } from 'pdf-lib'

interface PageManagerRequest {
  sources: { id: string; buffer: ArrayBuffer }[]
  pages: { sourceId: string; originalIndex: number; rotation: 0 | 90 | 180 | 270 }[]
}

const worker = self as DedicatedWorkerGlobalScope

worker.onmessage = async (event: MessageEvent<PageManagerRequest>) => {
  try {
    const { sources, pages } = event.data

    const srcDocs = new Map<string, PDFDocument>()
    for (const src of sources) {
      srcDocs.set(src.id, await PDFDocument.load(src.buffer))
    }

    const outDoc = await PDFDocument.create()
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i]
      const src = srcDocs.get(p.sourceId)
      if (!src) continue
      const [copied] = await outDoc.copyPages(src, [p.originalIndex])
      if (p.rotation !== 0) copied.setRotation(degrees(p.rotation))
      outDoc.addPage(copied)
      worker.postMessage({ type: 'progress', value: 5 + Math.round((i / pages.length) * 88) })
    }

    worker.postMessage({ type: 'progress', value: 97 })
    const bytes = await outDoc.save()
    const transferable = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Save failed.',
    })
  }
}

export {}
