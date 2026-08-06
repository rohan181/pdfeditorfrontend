'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const PDF_READY_EVENT = 'editpdfai:pdf-ready'
const PDF_NAME_EVENT = 'editpdfai:pdf-name'

type PdfReadyDetail = { blob: Blob; name?: string }

export default function PdfResultDock() {
  const pathname = usePathname()
  const nativeCreateUrl = useRef<typeof URL.createObjectURL | null>(null)
  const nativeRevokeUrl = useRef<typeof URL.revokeObjectURL | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [pdfUrl, setPdfUrl] = useState('')
  const [fileName, setFileName] = useState('document.pdf')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setPdfBlob(null)
    setPdfUrl('')
    setFileName('document.pdf')
    setDismissed(false)
  }, [pathname])

  useEffect(() => {
    const createUrl = URL.createObjectURL.bind(URL)
    const revokeUrl = URL.revokeObjectURL.bind(URL)
    const anchorClick = HTMLAnchorElement.prototype.click
    const pdfByUrl = new Map<string, Blob>()

    nativeCreateUrl.current = createUrl
    nativeRevokeUrl.current = revokeUrl

    URL.createObjectURL = ((object: Blob | MediaSource) => {
      const url = createUrl(object)
      if (object instanceof Blob) {
        pdfByUrl.set(url, object)
        if (object.type.toLowerCase().includes('pdf')) {
          const possibleName = object instanceof File ? object.name : undefined
          window.dispatchEvent(new CustomEvent<PdfReadyDetail>(PDF_READY_EVENT, {
            detail: { blob: object, name: possibleName },
          }))
        }
      }
      return url
    }) as typeof URL.createObjectURL

    URL.revokeObjectURL = ((url: string) => {
      pdfByUrl.delete(url)
      revokeUrl(url)
    }) as typeof URL.revokeObjectURL

    HTMLAnchorElement.prototype.click = function patchedPdfDownloadClick() {
      const downloadedBlob = pdfByUrl.get(this.href)
      if (this.download.toLowerCase().endsWith('.pdf') && downloadedBlob) {
        window.dispatchEvent(new CustomEvent<PdfReadyDetail>(PDF_READY_EVENT, {
          detail: { blob: downloadedBlob, name: this.download },
        }))
        window.dispatchEvent(new CustomEvent<string>(PDF_NAME_EVENT, { detail: this.download }))
      }
      return anchorClick.call(this)
    }

    const onPdfReady = (event: Event) => {
      const { blob, name } = (event as CustomEvent<PdfReadyDetail>).detail
      setPdfBlob(blob)
      setDismissed(false)
      if (name) setFileName(name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`)
    }
    const onPdfName = (event: Event) => {
      const name = (event as CustomEvent<string>).detail
      setFileName(name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`)
    }

    window.addEventListener(PDF_READY_EVENT, onPdfReady)
    window.addEventListener(PDF_NAME_EVENT, onPdfName)

    return () => {
      window.removeEventListener(PDF_READY_EVENT, onPdfReady)
      window.removeEventListener(PDF_NAME_EVENT, onPdfName)
      URL.createObjectURL = createUrl
      URL.revokeObjectURL = revokeUrl
      HTMLAnchorElement.prototype.click = anchorClick
    }
  }, [])

  useEffect(() => {
    if (!pdfBlob || !nativeCreateUrl.current || !nativeRevokeUrl.current) return
    const url = nativeCreateUrl.current(pdfBlob)
    setPdfUrl(url)
    return () => nativeRevokeUrl.current?.(url)
  }, [pdfBlob])

  if (!pdfBlob || !pdfUrl || dismissed) return null

  const preview = () => window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  const download = () => {
    const anchor = document.createElement('a')
    anchor.href = pdfUrl
    anchor.download = fileName
    anchor.click()
  }

  return (
    <aside className="pdf-result-dock" aria-label="PDF actions" aria-live="polite">
      <div className="pdf-result-dock-copy">
        <span className="pdf-result-dock-icon" aria-hidden="true">PDF</span>
        <span className="pdf-result-dock-name" title={fileName}>{fileName}</span>
      </div>
      <button type="button" className="pdf-result-preview" onClick={preview}>Preview PDF</button>
      <button type="button" className="pdf-result-download" onClick={download}>Download PDF</button>
      <button type="button" className="pdf-result-close" onClick={() => setDismissed(true)} aria-label="Dismiss PDF actions">×</button>
    </aside>
  )
}
