/// <reference lib="webworker" />

import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'

interface PlacedSig {
  page: number
  x: number; y: number; w: number; h: number
  rotation: number; dateStamp: boolean; dateText: string
  dataUrl: string
}

interface SignRequest {
  buffer: ArrayBuffer
  placed: PlacedSig[]
}

const worker = self as DedicatedWorkerGlobalScope

worker.onmessage = async (event: MessageEvent<SignRequest>) => {
  try {
    const { buffer, placed } = event.data
    const pdfDoc = await PDFDocument.load(buffer)
    const pages  = pdfDoc.getPages()
    const needsFont = placed.some(p => p.dateStamp && p.dateText)
    const font = needsFont ? await pdfDoc.embedFont(StandardFonts.Helvetica) : null

    for (const ps of placed) {
      if (ps.page >= pages.length) continue
      const pg = pages[ps.page]
      const { width: pw, height: ph } = pg.getSize()
      const b64 = ps.dataUrl.split(',')[1], bin = atob(b64)
      const arr = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
      const isJpeg = ps.dataUrl.startsWith('data:image/jpeg') || ps.dataUrl.startsWith('data:image/jpg')
      const img = isJpeg ? await pdfDoc.embedJpg(arr) : await pdfDoc.embedPng(arr)
      pg.drawImage(img, {
        x: ps.x * pw, y: ph - ps.y * ph - ps.h * ph,
        width: ps.w * pw, height: ps.h * ph,
        rotate: degrees(-ps.rotation), opacity: 1,
      })
      if (ps.dateStamp && ps.dateText && font) {
        pg.drawText(ps.dateText, { x: ps.x * pw, y: ph - ps.y * ph - ps.h * ph - 12, size: 7, font, color: rgb(.35,.35,.35) })
      }
    }

    pdfDoc.setCreator('EditPDF AI E-Signer')
    pdfDoc.setModificationDate(new Date())
    pdfDoc.setKeywords(['digitally-signed', `signed-at:${new Date().toISOString()}`])

    const bytes = await pdfDoc.save()
    const transferable = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer

    worker.postMessage({ type: 'success', buffer: transferable }, [transferable])
  } catch (error) {
    worker.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to export the signed PDF.',
    })
  }
}

export {}
