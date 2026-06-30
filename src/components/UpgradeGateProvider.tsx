'use client'
import { useEffect } from 'react'
import UpgradeModal from './UpgradeModal'
import SignInModal from './SignInModal'

export default function UpgradeGateProvider() {
  useEffect(() => {
    const original = window.fetch
    window.fetch = async (...args) => {
      const res = await original(...args)
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
      if (url.includes('/api/')) {
        if (res.status === 401) {
          window.dispatchEvent(new CustomEvent('signin-needed'))
          return res.clone()
        }
        if (res.status === 429) {
          window.dispatchEvent(new CustomEvent('upgrade-needed'))
          return res.clone()
        }
      }
      return res
    }
    return () => { window.fetch = original }
  }, [])

  return (
    <>
      <SignInModal />
      <UpgradeModal />
    </>
  )
}
