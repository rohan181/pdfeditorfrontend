/// <reference lib="webworker" />

import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'

interface WatermarkRequest {
  buffer: ArrayBuffer
  text: string
  color: [number, number, number]
  opacity: number
  fontSize: number
  rotation: number
  position: string
  customX: number
  customY: number
  image: { buffer: ArrayBuffer; isPng: boolean } | null
}

const worker = self as DedicatedWorkerGlobalScope

// Position preset → pdf-lib x/y (bottom-left origin) — mirrors the main-thread version.
function getPdfXY(
  pos: string, pW: number, pH: number, tW: number, tH: number,
  cx: number, cy: number,
): [number, number] {
  const pad = 40
  switch (pos) {
    case 'top-left':      return [pad,            pH - tH - pad]
    case 'top-center':    return [(pW - tW) / 2,  pH - tH - pad]
    case 'top-right':     return [pW - tW - pad,  pH - tH - pad]
    case 'bottom-left':   return [pad,            pad]
    case 'bottom-center': return [(pW - tW) / 2,  pad]
    case 'bottom-right':  return [pW - tW - pad,  pad]
    case 'custom':        return [pW * cx - tW / 2, pH * cy - tH / 2]
    default:              return [(pW - tW) / 2,  (pH - tH) / 2]
  }
}

worker.onmessage = async (event: MessageEvent<WatermarkRequest>) => {
  try {
    const { buffer, text, color, opacity, fontSize, rotation, position, customX, customY, image } = event.data
    const doc  = await PDFDocument.load(buffer)
    const font = await doc.embedFont(StandardFonts.HelveticaBold)
    const pdfPages = doc.getPages()
    const [cr, cg, cb] = color

    const embImg = image
      ? (image.isPng ? await doc.embedPng(image.buffer) : await doc.embedJpg(image.buffer))
      : null

    for (let i = 0; i < pdfPages.length; i++) {
      const page = pdfPages[i]
      const { width: pW, height: pH } = page.getSize()

      if (embImg) {
        const iW = embImg.width * 0.4
        const iH = embImg.height * 0.4
        if (position === 'tile') {
          const cols = Math.ceil(pW / (iW + 80)) + 1
          const rows = Math.ceil(pH / (iH + 80)) + 1
          for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
              page.drawImage(embImg, { x: c*(iW+80)-40, y: r*(iH+80)-40, width: iW, height: iH, opacity, rotate: degrees(rotation) })
        } else {
          const [x, y] = getPdfXY(position, pW, pH, iW, iH, customX, customY)
          page.drawImage(embImg, { x, y, width: iW, height: iH, opacity, rotate: degrees(rotation) })
        }
      } else if (text.trim()) {
        const tW = font.widthOfTextAtSize(text, fontSize)
        const tH = fontSize
        if (position === 'tile') {
          const cols = Math.ceil(pW / (tW + 80)) + 1
          const rows = Math.ceil(pH / (tH + 80)) + 1
          for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
              page.drawText(text, { x: c*(tW+80)-40, y: r*(tH+80)-40, size: fontSize, font, color: rgb(cr,cg,cb), opacity, rotate: degrees(rotation) })
        } else {
          const [x, y] = getPdfXY(position, pW, pH, tW, tH, customX, customY)
          page.drawText(text, { x, y, size: fontSize, font, color: rgb(cr,cg,cb), opacity, rotate: degrees(rotation) })
        }
      }

      worker.postMessage({ type: 'progress', value: Math.round(((i + 1) / pdfPages.length) * 90) })
    }

    const bytes = await doc.save()
    const transferable = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to apply watermark.',
    })
  }
}

export {}
