'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FilePen } from 'lucide-react'

export default function MobileEditorShortcut() {
  const [visible, setVisible] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-editor-cta], [data-mobile-shortcut-occluder]'))
    if (!targets.length) return

    const visibility = new Map<Element, boolean>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visibility.set(entry.target, entry.isIntersecting))
      setVisible(!Array.from(visibility.values()).some(Boolean))
    }, { threshold: 0.15 })

    targets.forEach(target => {
      visibility.set(target, false)
      observer.observe(target)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const isTextEntry = (target: EventTarget | null) => {
      const element = target instanceof HTMLElement ? target : null
      return !!element?.matches('input, textarea, select, [contenteditable="true"]')
    }
    const onFocusIn = (event: FocusEvent) => {
      if (isTextEntry(event.target)) setKeyboardOpen(true)
    }
    const onFocusOut = () => {
      window.setTimeout(() => setKeyboardOpen(isTextEntry(document.activeElement)), 0)
    }
    const initialViewportHeight = window.visualViewport?.height ?? window.innerHeight
    const onViewportResize = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      const focused = isTextEntry(document.activeElement)
      setKeyboardOpen(focused || viewportHeight < initialViewportHeight * 0.78)
    }

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    window.visualViewport?.addEventListener('resize', onViewportResize)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      window.visualViewport?.removeEventListener('resize', onViewportResize)
    }
  }, [])

  const interactive = visible && !keyboardOpen

  return (
    <div className={`mobile-editor-shortcut${interactive ? ' is-visible' : ''}${keyboardOpen ? ' is-keyboard-open' : ''}`} aria-hidden={!interactive}>
      <Link href="/pdf-editor" tabIndex={interactive ? 0 : -1}>
        <FilePen size={17} aria-hidden="true" /> Open Editor
      </Link>
    </div>
  )
}
