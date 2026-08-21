'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import toolSeoData from '@/lib/toolSeoData'
import { toolMetaMap } from '@/lib/toolMeta'

const PDF_READY_EVENT = 'editpdfai:pdf-ready'
const PDF_NAME_EVENT = 'editpdfai:pdf-name'

type PdfReadyDetail = { blob: Blob; name?: string }

export default function PdfResultDock() {
  const pathname = usePathname()
  const nativeCreateUrl = useRef<typeof URL.createObjectURL | null>(null)
  const nativeRevokeUrl = useRef<typeof URL.revokeObjectURL | null>(null)
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [pdfUrl, setPdfUrl] = useState('')
  const [fileName, setFileName] = useState('document.pdf')
  const [dismissed, setDismissed] = useState(false)
  const [downloadStarted, setDownloadStarted] = useState(false)

  useEffect(() => {
    setPdfBlob(null)
    setPdfUrl('')
    setFileName('document.pdf')
    setDismissed(false)
    setDownloadStarted(false)
  }, [pathname])

  useEffect(() => () => {
    if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current)
  }, [])

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
    if (downloadStarted) return
    setDownloadStarted(true)
    const anchor = document.createElement('a')
    anchor.href = pdfUrl
    anchor.download = fileName
    anchor.click()
    downloadTimerRef.current = setTimeout(() => setDownloadStarted(false), 1800)
  }

  const startAnother = () => {
    const confirmed = window.confirm(
      'Choose another file? This starts a new task and can clear the current tool settings. Download the result first if you need it.',
    )
    if (!confirmed) return

    const restartButton = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(button => {
      if (button.closest('.pdf-result-dock')) return false
      return /process another|choose another|another (pdf|file|document)|start over|new file|reset|change pdf/i.test(
        button.textContent ?? '',
      )
    })
    const fileInput = document.querySelector<HTMLInputElement>(
      'main input[type="file"], [id="main-content"] input[type="file"], input[type="file"]',
    )
    setDismissed(true)
    if (restartButton) {
      restartButton.click()
    } else if (fileInput) {
      fileInput.click()
    } else {
      window.location.assign(pathname)
    }
  }

  const slug = pathname.split('/').filter(Boolean)[0]
  const related = (toolSeoData[slug]?.related ?? []).slice(0, 2)

  return (
    <aside className="pdf-result-dock" aria-label="PDF actions" aria-live="polite">
      <div className="pdf-result-dock-copy">
        <span className="pdf-result-dock-icon" aria-hidden="true">PDF</span>
        <span>
          <strong className="pdf-result-dock-success">Result ready</strong>
          <span className="pdf-result-dock-name" title={fileName}>{fileName}</span>
        </span>
      </div>
      <button type="button" className="pdf-result-preview" onClick={preview}>Preview PDF</button>
      <button type="button" className="pdf-result-download" onClick={download} disabled={downloadStarted}>
        {downloadStarted ? 'Download started' : 'Download PDF'}
      </button>
      <button type="button" className="pdf-result-another" onClick={startAnother}>Process another</button>
      {related.length > 0 && (
        <nav className="pdf-result-dock-related" aria-label="Related tools for the completed PDF">
          <span>Next recommended:</span>
          {related.map(item => {
            const meta = toolMetaMap[item.slug]
            return (
              <Link key={item.slug} href={`/${item.slug}`} prefetch={false} aria-label={meta ? `${item.label}: ${meta.desc}` : item.label}>
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}
      <button type="button" className="pdf-result-close" onClick={() => setDismissed(true)} aria-label="Dismiss PDF actions">×</button>
    </aside>
  )
}
