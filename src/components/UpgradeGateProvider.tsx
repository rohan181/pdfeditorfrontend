'use client'
import { useEffect } from 'react'
import UpgradeModal from './UpgradeModal'

export default function UpgradeGateProvider() {
  useEffect(() => {
    const original = window.fetch
    window.fetch = async (...args) => {
      const res = await original(...args)
      if (res.status === 429) {
        const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
        if (url.includes('/api/')) {
          window.dispatchEvent(new CustomEvent('upgrade-needed'))
        }
        return res.clone()
      }
      return res
    }
    return () => { window.fetch = original }
  }, [])

  return <UpgradeModal />
}
