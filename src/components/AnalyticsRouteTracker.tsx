'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export default function AnalyticsRouteTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const track = () => { void trackPageView(pathname) }

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(track, { timeout: 3500 })
      return () => idleWindow.cancelIdleCallback?.(handle)
    }

    const handle = window.setTimeout(track, 1500)
    return () => window.clearTimeout(handle)
  }, [pathname])

  return null
}
