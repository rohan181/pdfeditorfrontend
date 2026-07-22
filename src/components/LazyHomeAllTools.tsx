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

  const groups = [
    {
      title: 'AI PDF Tools',
      description: 'Extract, understand and transform document content with OCR, summaries, translation, quizzes and automated form filling.',
      paths: ['/ai-pdf-form-filler', '/pdf-ocr', '/pdf-summarizer', '/pdf-translator', '/mind-map', '/quiz-creator'],
    },
    {
      title: 'Edit and Annotate PDFs',
      description: 'Open PDFs in your browser to edit content, review documents, add annotations and create fillable forms.',
      paths: ['/pdf-editor', '/pdf-viewer', '/pdf-annotate', '/pdf-form-builder'],
    },
    {
      title: 'Manage PDF Pages',
      description: 'Reorder, crop, rotate, extract, delete and number PDF pages without installing desktop software.',
      paths: ['/pdf-page-manager', '/pdf-cropper', '/rotate-pdf', '/extract-pages', '/delete-pages', '/add-page-numbers'],
    },
    {
      title: 'Convert PDF Files',
      description: 'Convert PDFs to editable Word, Excel, PowerPoint and image formats, or create PDFs from common documents and web content.',
      paths: ['/pdf-to-word', '/pdf-to-excel', '/pdf-to-ppt', '/pdf-to-images', '/word-to-pdf', '/excel-to-pdf', '/ppt-to-pdf', '/image-to-pdf', '/txt-to-pdf', '/rtf-to-pdf', '/odt-to-pdf', '/html-to-pdf'],
    },
    {
      title: 'Protect and Sign PDFs',
      description: 'Sign documents, add watermarks, redact confidential information and protect PDF files with passwords.',
      paths: ['/pdf-signer', '/pdf-watermark', '/pdf-redactor', '/pdf-password-lock'],
    },
    {
      title: 'Organize and Compress PDFs',
      description: 'Reduce file size or combine and separate documents for easier storage, email and sharing.',
      paths: ['/pdf-compressor', '/pdf-merger', '/pdf-splitter'],
    },
  ] as const

  return (
    <section
      className="home-responsive-section tools-fallback-section"
      id="tools"
      style={{ minHeight: 900, padding: '88px 28px', background: '#f8f8fa', borderTop: '1px solid #f0f0f0' }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <p style={{ margin: '0 0 12px', color: '#64748B', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          All tools
        </p>
        <h2 style={{ margin: '0 0 16px', color: '#1d1d1f', fontSize: 'clamp(28px,3.5vw,46px)', lineHeight: .96, letterSpacing: '-.05em' }}>
          Edit, Convert and Organize PDFs
        </h2>
        <p style={{margin:'0 0 40px',maxWidth:760,color:'#64748B',fontSize:15,lineHeight:1.7}}>
          Choose from browser-based tools for editing, signing, converting, securing and understanding PDF documents.
        </p>
        <nav className="tools-fallback-grid" aria-label="PDF tool categories" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 18 }}>
          {groups.map(group => (
            <section key={group.title} style={{padding:22,background:'#fff',border:'1px solid #E2E8F0',borderRadius:16}}>
              <h3 style={{margin:'0 0 8px',color:'#0F172A',fontSize:18}}>{group.title}</h3>
              <p style={{margin:'0 0 16px',color:'#64748B',fontSize:13,lineHeight:1.6}}>{group.description}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {tools.filter(([, href]) => (group.paths as readonly string[]).includes(href)).map(([label, href]) => (
                  <Link key={href} href={href} style={{padding:'7px 10px',color:'#2563EB',background:'#EFF6FF',borderRadius:8,textDecoration:'none',fontSize:12,fontWeight:600}}>
                    {label}
                  </Link>
                ))}
              </div>
            </section>
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
