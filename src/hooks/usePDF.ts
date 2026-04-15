'use client'
import { useRef, useState, useCallback } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

export function usePDF() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [thumbnails, setThumbnails] = useState<string[]>([])

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true)
    setFileName(file.name)

    const arrayBuffer = await file.arrayBuffer()
    setPdfBytes(arrayBuffer.slice(0))

    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    setPdfDoc(doc)
    setTotalPages(doc.numPages)
    setCurrentPage(1)

    // Generate thumbnails (up to 20 pages)
    const thumbs: string[] = []
    for (let i = 1; i <= Math.min(doc.numPages, 20); i++) {
      const page = await doc.getPage(i)
      const vp = page.getViewport({ scale: 0.22 })
      const c = document.createElement('canvas')
      c.width = vp.width
      c.height = vp.height
      const ctx = c.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport: vp }).promise
      thumbs.push(c.toDataURL('image/jpeg', 0.7))
    }
    setThumbnails(thumbs)
    setIsLoading(false)
    return doc
  }, [])

  const renderPage = useCallback(
    async (doc: PDFDocumentProxy, pageNum: number, sc: number) => {
      if (!canvasRef.current) return
      setIsLoading(true)
      const page = await doc.getPage(pageNum)
      const vp = page.getViewport({ scale: sc })
      const canvas = canvasRef.current
      canvas.width = vp.width
      canvas.height = vp.height
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      await page.render({ canvasContext: ctx, viewport: vp }).promise
      setIsLoading(false)
    },
    []
  )

  const zoomIn = useCallback(
    () => setScale((s) => Math.min(parseFloat((s + 0.2).toFixed(1)), 3.0)),
    []
  )
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(parseFloat((s - 0.2).toFixed(1)), 0.4)),
    []
  )
  const goToPage = useCallback(
    (p: number) =>
      setCurrentPage((prev) => {
        const next = Math.max(1, Math.min(p, totalPages))
        return next !== prev ? next : prev
      }),
    [totalPages]
  )

  return {
    canvasRef,
    pdfDoc,
    pdfBytes,
    totalPages,
    currentPage,
    scale,
    fileName,
    isLoading,
    thumbnails,
    loadPDF,
    renderPage,
    zoomIn,
    zoomOut,
    goToPage,
    setCurrentPage,
  }
}
