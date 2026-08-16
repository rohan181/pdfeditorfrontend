/// <reference lib="webworker" />

import { PDFDocument, rgb, BlendMode } from 'pdf-lib'

interface RedactRect { x: number; y: number; w: number; h: number; color: string }
interface RedactPage { rects: RedactRect[] }

interface RedactRequest {
  buffer: ArrayBuffer
  pages: RedactPage[]
}

const worker = self as DedicatedWorkerGlobalScope

function hexToRgbArr(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

worker.onmessage = async (event: MessageEvent<RedactRequest>) => {
  try {
    const { buffer, pages } = event.data
    const pdfDoc = await PDFDocument.load(buffer)
    const pdfPgs = pdfDoc.getPages()

    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].rects.length) continue
      const pg = pdfPgs[i]
      const { width, height } = pg.getSize()
      for (const r of pages[i].rects) {
        const [rc, gc, bc] = hexToRgbArr(r.color)
        pg.drawRectangle({
          x: r.x * width, y: height - (r.y + r.h) * height,
          width: r.w * width, height: r.h * height,
          color: rgb(rc / 255, gc / 255, bc / 255),
          opacity: 1, blendMode: BlendMode.Normal,
        })
      }
      worker.postMessage({ type: 'progress', value: 5 + Math.round(((i + 1) / pages.length) * 88) })
    }

    worker.postMessage({ type: 'progress', value: 97 })
    const bytes = await pdfDoc.save()
    const transferable = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to apply redactions.',
    })
  }
}

export {}
