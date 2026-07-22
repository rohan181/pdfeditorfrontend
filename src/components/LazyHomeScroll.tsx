'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const HomeScroll = dynamic(() => import('./HomeScroll'), {
  ssr: false,
  loading: () => <HomeScrollPlaceholder />,
})

function HomeScrollPlaceholder() {
  return (
    <section
      aria-hidden="true"
      style={{ minHeight: 'calc(400vh + 160px)', background: '#F5F5F7' }}
    />
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
      { rootMargin: '200px 0px' },
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
