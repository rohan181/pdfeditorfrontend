'use client'
import { useEffect } from 'react'

export default function ScrollEffects() {
  useEffect(() => {
    // ── Staggered reveal ──────────────────────────────────────
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const delay = parseInt(el.dataset.revealDelay || '0')
          setTimeout(() => el.classList.add('revealed'), delay)
          revealIO.unobserve(el)
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -48px 0px' }
    )

    // Compute stagger delay from sibling index within each parent group
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const parent = el.parentElement
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll('[data-reveal]'))
        const idx = siblings.indexOf(el)
        ;(el as HTMLElement).dataset.revealDelay = String(Math.min(idx * 85, 420))
      }
      revealIO.observe(el)
    })

    // ── Count-up animation for stats ─────────────────────────
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const target = parseFloat(el.dataset.count!)
          const suffix = el.dataset.suffix || ''
          const decimals = String(target).includes('.') ? 1 : 0
          const duration = 1800
          let t0 = 0
          const tick = (now: number) => {
            if (!t0) t0 = now
            const p = Math.min((now - t0) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            el.textContent = (eased * target).toFixed(decimals) + suffix
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          countIO.unobserve(el)
        })
      },
      { threshold: 0.5 }
    )
    document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el))

    return () => { revealIO.disconnect(); countIO.disconnect() }
  }, [])

  return null
}
