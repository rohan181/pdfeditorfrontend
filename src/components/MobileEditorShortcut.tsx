'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FilePen } from 'lucide-react'

export default function MobileEditorShortcut() {
  const [visible, setVisible] = useState(false)

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

  return (
    <div className={`mobile-editor-shortcut${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <Link href="/pdf-editor" tabIndex={visible ? 0 : -1}>
        <FilePen size={17} aria-hidden="true" /> Open Editor
      </Link>
    </div>
  )
}
