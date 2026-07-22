'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const HomeAllTools = dynamic(() => import('./HomeAllTools'), {
  ssr: false,
  loading: () => <ToolsPlaceholder />,
})

function ToolsPlaceholder() {
  const tools = [
    ['PDF Editor', '/pdf-editor'],
    ['PDF Viewer', '/pdf-viewer'],
    ['PDF Annotator', '/pdf-annotate'],
    ['AI PDF Form Filler', '/ai-pdf-form-filler'],
    ['PDF OCR Scanner', '/pdf-ocr'],
    ['PDF Summarizer', '/pdf-summarizer'],
    ['PDF Translator', '/pdf-translator'],
    ['PDF Mind Map', '/mind-map'],
    ['Quiz Creator', '/quiz-creator'],
    ['PDF Compressor', '/pdf-compressor'],
    ['PDF Merger', '/pdf-merger'],
    ['PDF Splitter', '/pdf-splitter'],
    ['PDF Page Manager', '/pdf-page-manager'],
    ['PDF Cropper', '/pdf-cropper'],
    ['Rotate PDF Pages', '/rotate-pdf'],
    ['Extract PDF Pages', '/extract-pages'],
    ['Delete PDF Pages', '/delete-pages'],
    ['Add PDF Page Numbers', '/add-page-numbers'],
    ['PDF E-Signer', '/pdf-signer'],
    ['PDF Watermark', '/pdf-watermark'],
    ['PDF Redactor', '/pdf-redactor'],
    ['PDF Password Lock', '/pdf-password-lock'],
    ['PDF Form Builder', '/pdf-form-builder'],
    ['PDF to Word', '/pdf-to-word'],
    ['PDF to Excel', '/pdf-to-excel'],
    ['PDF to PowerPoint', '/pdf-to-ppt'],
    ['PDF to Images', '/pdf-to-images'],
    ['Word to PDF', '/word-to-pdf'],
    ['Excel to PDF', '/excel-to-pdf'],
    ['PowerPoint to PDF', '/ppt-to-pdf'],
    ['Image to PDF', '/image-to-pdf'],
    ['Text to PDF', '/txt-to-pdf'],
    ['RTF to PDF', '/rtf-to-pdf'],
    ['ODT to PDF', '/odt-to-pdf'],
    ['HTML to PDF', '/html-to-pdf'],
  ] as const

  return (
    <section
      id="tools"
      style={{ minHeight: 900, padding: '88px 28px', background: '#f8f8fa', borderTop: '1px solid #f0f0f0' }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <p style={{ margin: '0 0 12px', color: '#64748B', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          All tools
        </p>
        <h2 style={{ margin: '0 0 32px', color: '#1d1d1f', fontSize: 'clamp(28px,3.5vw,46px)', lineHeight: .96, letterSpacing: '-.05em' }}>
          35+ tools. One platform.
        </h2>
        <nav aria-label="All PDF tools" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
          {tools.map(([label, href]) => (
            <Link key={href} href={href} style={{ padding: '12px 14px', color: '#334155', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default function LazyHomeAllTools() {
  const boundaryRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const boundary = boundaryRef.current
    if (!boundary) return

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(boundary)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={boundaryRef}>
      {shouldLoad ? <HomeAllTools /> : <ToolsPlaceholder />}
    </div>
  )
}
