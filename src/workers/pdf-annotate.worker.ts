/// <reference lib="webworker" />

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

type Tool = 'select' | 'highlight' | 'underline' | 'strikethrough' | 'comment' | 'rect' | 'arrow' | 'pen' | 'text'
interface Pt { x: number; y: number }

interface Annotation {
  type: Tool; page: number
  x: number; y: number; w: number; h: number
  color: string; text: string
  points: Pt[]
  fontSize: number
}

interface AnnotateRequest {
  buffer: ArrayBuffer
  annotations: Annotation[]
}

const worker = self as DedicatedWorkerGlobalScope
const HI_ALPHA = 0.35

worker.onmessage = async (event: MessageEvent<AnnotateRequest>) => {
  try {
    const { buffer, annotations } = event.data
    const pdfOut = await PDFDocument.load(buffer)
    const font   = await pdfOut.embedFont(StandardFonts.Helvetica)
    const pages  = pdfOut.getPages()

    for (const ann of annotations) {
      const pg = pages[ann.page - 1]
      if (!pg) continue
      const { width: pw, height: ph } = pg.getSize()

      const pdfX = ann.x * pw
      const pdfY = (1 - ann.y - ann.h) * ph
      const pdfW = ann.w * pw
      const pdfH = ann.h * ph

      const hex = ann.color.replace('#', '')
      const cr  = parseInt(hex.slice(0,2), 16) / 255
      const cg  = parseInt(hex.slice(2,4), 16) / 255
      const cb  = parseInt(hex.slice(4,6), 16) / 255
      const col = rgb(cr, cg, cb)

      switch (ann.type) {
        case 'highlight':
          pg.drawRectangle({ x: pdfX, y: pdfY, width: pdfW, height: pdfH, color: col, opacity: HI_ALPHA })
          break
        case 'underline':
          pg.drawLine({ start: { x: pdfX, y: pdfY }, end: { x: pdfX + pdfW, y: pdfY }, thickness: 1.5, color: col })
          break
        case 'strikethrough':
          pg.drawLine({ start: { x: pdfX, y: pdfY + pdfH / 2 }, end: { x: pdfX + pdfW, y: pdfY + pdfH / 2 }, thickness: 1.5, color: col })
          break
        case 'rect':
          pg.drawRectangle({ x: pdfX, y: pdfY, width: pdfW, height: pdfH, borderColor: col, borderWidth: 2 })
          break
        case 'comment':
          pg.drawRectangle({ x: pdfX, y: pdfY + pdfH, width: 20, height: 20, color: col, opacity: 0.9 })
          if (ann.text) {
            const boxW = Math.min(Math.max(100, ann.text.length * 5.5), 200)
            pg.drawRectangle({ x: pdfX + 24, y: pdfY + pdfH - 20, width: boxW, height: 34, color: rgb(1,1,.93), borderColor: col, borderWidth: 1, opacity: 0.95 })
            pg.drawText(ann.text.slice(0, 40), { x: pdfX + 28, y: pdfY + pdfH - 10, size: 9, font, color: rgb(0,0,0) })
          }
          break
        case 'text':
          if (ann.text)
            pg.drawText(ann.text, { x: pdfX, y: (1 - ann.y) * ph, size: 12, font, color: col })
          break
        case 'arrow': {
          const pts = ann.points
          if (pts?.length >= 2) {
            const ax = pts[0].x*pw, ay = (1-pts[0].y)*ph
            const bx = pts[1].x*pw, by = (1-pts[1].y)*ph
            const angle = Math.atan2(by-ay, bx-ax)
            const L = 10
            pg.drawLine({ start:{x:ax,y:ay}, end:{x:bx,y:by}, thickness: 2, color: col })
            pg.drawLine({ start:{x:bx,y:by}, end:{x:bx-L*Math.cos(angle+2.5), y:by-L*Math.sin(angle+2.5)}, thickness:2, color:col })
            pg.drawLine({ start:{x:bx,y:by}, end:{x:bx-L*Math.cos(angle-2.5), y:by-L*Math.sin(angle-2.5)}, thickness:2, color:col })
          }
          break
        }
        case 'pen': {
          const pts = ann.points
          if (pts) for (let i = 0; i < pts.length - 1; i++) {
            pg.drawLine({ start: {x:pts[i].x*pw, y:(1-pts[i].y)*ph}, end: {x:pts[i+1].x*pw, y:(1-pts[i+1].y)*ph}, thickness: 1.5, color: col })
          }
          break
        }
      }
    }

    const bytes = await pdfOut.save()
    const transferable = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to export annotated PDF.',
    })
  }
}

export {}
