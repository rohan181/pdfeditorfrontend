'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export default function AnalyticsRouteTracker() {
  const pathname = usePathname()

  useEffect(() => {
    void trackPageView(pathname)
  }, [pathname])

  return null
}

