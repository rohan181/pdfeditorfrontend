'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const HomeScroll = dynamic(() => import('./HomeScroll'), {
  ssr: false,
  loading: () => <HomeScrollPlaceholder />,
})

function HomeScrollPlaceholder({ accessible = false }: { accessible?: boolean }) {
  return (
    <section className="home-scroll-placeholder" aria-hidden={accessible ? undefined : true} aria-label={accessible ? 'How EditPDF AI works' : undefined}>
      <div className="home-scroll-placeholder-inner">
        <div className="home-scroll-placeholder-copy">
          <span>How it works</span>
          <strong>From PDF to finished file</strong>
          <p>Upload, choose a workflow, review the result and download.</p>
          <div className="home-scroll-placeholder-dots"><i/><i/><i/><i/></div>
          {accessible && (
            <div className="home-scroll-static-actions">
              <Link href="/pdf-editor">Open PDF Editor</Link>
              <Link href="/#tools">View tool directory</Link>
            </div>
          )}
        </div>
        <div className="home-scroll-placeholder-window">
          <div className="home-scroll-placeholder-bar"><i/><i/><i/></div>
          <div className="home-scroll-placeholder-page">
            <b/><b/><b/><b/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LazyHomeScroll() {
  const boundaryRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'placeholder' | 'static' | 'interactive'>('placeholder')

  useEffect(() => {
    const boundary = boundaryRef.current
    if (!boundary) return

    const staticMedia = window.matchMedia('(max-width: 600px), (prefers-reduced-motion: reduce)')
    if (staticMedia.matches) {
      setMode('static')
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return
        setMode('interactive')
        observer.disconnect()
      },
      { rootMargin: '300px 0px' },
    )

    observer.observe(boundary)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={boundaryRef}>
      {mode === 'interactive' ? <HomeScroll /> : <HomeScrollPlaceholder accessible={mode === 'static'} />}
    </div>
  )
}
