'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const HomeScroll = dynamic(() => import('./HomeScroll'), {
  ssr: false,
  loading: () => <HomeScrollPlaceholder />,
})

function HomeScrollPlaceholder() {
  return (
    <section className="home-scroll-placeholder" aria-hidden="true">
      <div className="home-scroll-placeholder-inner">
        <div className="home-scroll-placeholder-copy">
          <span>See it in action</span>
          <strong>Everything in your browser</strong>
          <p>Upload, edit, sign and export your PDF in four simple steps.</p>
          <div className="home-scroll-placeholder-dots"><i/><i/><i/><i/></div>
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
      { rootMargin: '800px 0px' },
    )

    observer.observe(boundary)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={boundaryRef}>
      {shouldLoad ? <HomeScroll /> : <HomeScrollPlaceholder />}
    </div>
  )
}
