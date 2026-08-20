'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const UpgradeGateProvider = dynamic(() => import('@/components/UpgradeGateProvider'), {
  ssr: false,
})

const PdfResultDock = dynamic(() => import('@/components/PdfResultDock'), {
  ssr: false,
})

/**
 * The upgrade event listeners and result dock are application runtime, not
 * site-wide content. Keep them off the homepage and guide pages so those
 * informational routes do not hydrate modal, payment, or PDF-result code.
 */
export default function ApplicationRuntime() {
  const pathname = usePathname()
  const isInformationalRoute = pathname === '/' || pathname === '/guides' || pathname.startsWith('/guides/')

  if (isInformationalRoute) return null

  return (
    <>
      <UpgradeGateProvider />
      <PdfResultDock />
    </>
  )
}
