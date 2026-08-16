/// <reference lib="webworker" />

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface ImagePage {
  pageW: number
  pageH: number
  bytes: ArrayBuffer
  isJpeg: boolean
  imgX: number
  imgY: number
  imgW: number
  imgH: number
  label: { text: string; y: number; size: number; gray: number } | null
}

interface ImageEmbedRequest {
  pages: ImagePage[]
}

const worker = self as DedicatedWorkerGlobalScope

worker.onmessage = async (event: MessageEvent<ImageEmbedRequest>) => {
  try {
    const { pages } = event.data
    const pdfDoc = await PDFDocument.create()
    const needsFont = pages.some(p => p.label)
    const font = needsFont ? await pdfDoc.embedFont(StandardFonts.Helvetica) : null

    for (let i = 0; i < pages.length; i++) {
      const item = pages[i]
      const page = pdfDoc.addPage([item.pageW, item.pageH])

      let pdfImg
      try {
        pdfImg = item.isJpeg ? await pdfDoc.embedJpg(item.bytes) : await pdfDoc.embedPng(item.bytes)
      } catch {
        // Some browser-exported "PNG"/"JPEG" blobs are mislabeled — retry with the other codec.
        pdfImg = item.isJpeg ? await pdfDoc.embedPng(item.bytes) : await pdfDoc.embedJpg(item.bytes)
      }
      page.drawImage(pdfImg, { x: item.imgX, y: item.imgY, width: item.imgW, height: item.imgH })

      if (item.label && font) {
        const tw = font.widthOfTextAtSize(item.label.text, item.label.size)
        page.drawText(item.label.text, {
          x: (item.pageW - tw) / 2,
          y: item.label.y,
          size: item.label.size,
          font,
          color: rgb(item.label.gray, item.label.gray, item.label.gray),
        })
      }

      worker.postMessage({ type: 'progress', value: Math.round(((i + 1) / pages.length) * 90) })
    }

    const bytes = await pdfDoc.save()
    const transferable = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to build the PDF.',
    })
  }
}

export {}
