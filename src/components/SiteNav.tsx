'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  ChevronDown,
  FilePenLine,
  FileSearch,
  FileType2,
  Layers3,
  Menu,
  Minimize2,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import { FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'
import { toolMetaMap, type ToolMeta } from '@/lib/toolMeta'
import {
  PRODUCT_PRIORITY_TOOL_SLUGS,
  TOOL_CATEGORIES,
  getCategoryHref,
  getCategoryTools,
  getToolAccessPresentation,
  getToolCategory,
  type ToolCategory,
  type ToolCategoryId,
} from '@/lib/toolDiscovery'

const CATEGORY_ICONS: Record<ToolCategoryId, LucideIcon> = {
  ai: Sparkles,
  edit: FilePenLine,
  convert: FileType2,
  organize: Layers3,
  compress: Minimize2,
  protect: ShieldCheck,
  extract: FileSearch,
}

const NAV_LINKS = [
  { label: 'Guides', href: '/guides' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
] as const

function isPathCurrent(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

function menuTools(category: ToolCategory, currentTool?: ToolMeta) {
  const categoryTools = getCategoryTools(category)
  const priorities = PRODUCT_PRIORITY_TOOL_SLUGS
    .map(slug => toolMetaMap[slug])
    .filter((tool): tool is ToolMeta => Boolean(tool) && category.slugs.includes(tool.slug))
  const candidates = currentTool && category.slugs.includes(currentTool.slug)
    ? [currentTool, ...priorities, ...categoryTools]
    : [...priorities, ...categoryTools]
  return candidates.filter((tool, index, items) => items.findIndex(item => item.slug === tool.slug) === index).slice(0, 3)
}

export default function SiteNav() {
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useUser()
  const currentSlug = pathname.split('/').filter(Boolean)[0] ?? ''
  const currentTool = toolMetaMap[currentSlug]
  const currentCategory = currentTool ? getToolCategory(currentTool.slug) : undefined

  const [subTier, setSubTier] = useState<'free' | 'pro' | null>(null)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCategory, setMobileCategory] = useState<ToolCategoryId | null>(currentCategory?.id ?? null)
  const toolsButtonRef = useRef<HTMLButtonElement>(null)
  const toolsMenuRef = useRef<HTMLDivElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const mobileDrawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isSignedIn) { setSubTier(null); return }
    let cancelled = false
    fetch('/api/subscription/status')
      .then(response => response.ok ? response.json() : null)
      .then(data => { if (!cancelled && (data?.tier === 'free' || data?.tier === 'pro')) setSubTier(data.tier) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [isSignedIn])

  useEffect(() => {
    setToolsOpen(false)
    setMobileOpen(false)
    setMobileCategory(currentCategory?.id ?? null)
  }, [pathname, currentCategory?.id])

  useEffect(() => {
    if (!toolsOpen) return
    const focusTimer = window.setTimeout(() => toolsMenuRef.current?.querySelector<HTMLElement>('a[href], button')?.focus(), 0)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setToolsOpen(false)
      toolsButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [toolsOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => mobileDrawerRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus(), 0)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMobileOpen(false)
        requestAnimationFrame(() => mobileButtonRef.current?.focus())
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(mobileDrawerRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? [])
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  const toolSectionCurrent = Boolean(currentTool)
  const currentContext = useMemo(() => currentTool ? `${currentTool.name}, ${currentCategory?.label}` : 'PDF tools', [currentTool, currentCategory])

  return (
    <>
      <header className="site-nav-shell">
        <div className="site-nav-inner">
          <Link prefetch={false} href="/" className="site-nav-logo" aria-label="EditPDF AI home">
            <Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" priority />
          </Link>

          <nav className="site-nav-desktop" aria-label="Primary navigation">
            <Link prefetch={false} href="/#tools" className="site-nav-link">All tools</Link>
            <button
              ref={toolsButtonRef}
              type="button"
              className={`site-nav-link site-nav-tools-button${toolSectionCurrent || toolsOpen ? ' is-current' : ''}`}
              onClick={() => setToolsOpen(open => !open)}
              onKeyDown={event => {
                if (event.key !== 'ArrowDown') return
                event.preventDefault(); setToolsOpen(true)
              }}
              aria-expanded={toolsOpen}
              aria-controls="site-tools-menu"
              aria-label={`Browse tool categories. Current context: ${currentContext}`}
            >
              Categories <ChevronDown size={13} aria-hidden="true" />
            </button>
            {NAV_LINKS.map(link => {
              const current = isPathCurrent(pathname, link.href)
              return (
                <Link key={link.href} prefetch={false} href={link.href} className={`site-nav-link${current ? ' is-current' : ''}`} aria-current={current ? 'page' : undefined}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="site-nav-actions">
            {isLoaded && isSignedIn ? (
              <>
                <Link prefetch={false} href="/dashboard" className={`site-nav-account${pathname === '/dashboard' ? ' is-current' : ''}`} aria-current={pathname === '/dashboard' ? 'page' : undefined}>Dashboard</Link>
                {subTier && (
                  <Link prefetch={false} href={subTier === 'pro' ? '/manage-subscription' : '/pricing'} className={`site-nav-plan is-${subTier}`} aria-label={subTier === 'pro' ? 'Pro plan, manage subscription' : `Free plan, ${FREE_AI_DAILY_LIMIT} AI actions per UTC day`}>
                    {subTier === 'pro' ? 'Pro' : 'Free'}
                  </Link>
                )}
                <UserButton />
              </>
            ) : isLoaded ? (
              <SignInButton mode="modal"><button type="button" className="site-nav-account">Sign in</button></SignInButton>
            ) : null}

            <Link prefetch={false} href="/pdf-editor" className={`site-nav-editor${pathname === '/pdf-editor' ? ' is-current' : ''}`} aria-current={pathname === '/pdf-editor' ? 'page' : undefined}>
              <Upload size={13} aria-hidden="true" /> Open PDF Editor
            </Link>

            <button
              ref={mobileButtonRef}
              type="button"
              className="site-nav-mobile-button"
              onClick={() => {
                setMobileOpen(open => !open)
                if (!mobileOpen) setMobileCategory(currentCategory?.id ?? null)
              }}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-navigation"
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {toolsOpen && (
        <>
          <button className="site-nav-backdrop" type="button" onClick={() => setToolsOpen(false)} aria-label="Close tool categories" />
          <div id="site-tools-menu" ref={toolsMenuRef} className="site-tools-menu" role="navigation" aria-label="Tool categories">
            <div className="site-tools-menu-head">
              <div><strong>Browse PDF tools by task</strong><span>Seven categories, with the current tool highlighted.</span></div>
              <Link href="/#tools" prefetch={false} onClick={() => setToolsOpen(false)}>Search all tools <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
            <div className="site-tools-menu-grid">
              {TOOL_CATEGORIES.map(category => {
                const Icon = CATEGORY_ICONS[category.id]
                const tools = menuTools(category, currentTool)
                return (
                  <section key={category.id} className="site-tools-category" style={{ '--category-color': category.color } as React.CSSProperties}>
                    <Link href={getCategoryHref(category)} prefetch={false} className="site-tools-category-heading" onClick={() => setToolsOpen(false)}>
                      <Icon size={16} aria-hidden="true" /><span>{category.label}</span><small>{category.slugs.length}</small>
                    </Link>
                    {tools.map(tool => {
                      const current = pathname === `/${tool.slug}`
                      const access = getToolAccessPresentation(tool.access)
                      return (
                        <Link key={tool.slug} href={`/${tool.slug}`} prefetch={false} className={`site-tools-link${current ? ' is-current' : ''}`} aria-current={current ? 'page' : undefined} onClick={() => setToolsOpen(false)}>
                          <span>{tool.name}</span><small>{access.badges.map(badge => badge.label).join(' + ')}</small>
                        </Link>
                      )
                    })}
                  </section>
                )
              })}
            </div>
          </div>
        </>
      )}

      {mobileOpen && (
        <>
          <button className="site-mobile-backdrop" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" />
          <div id="site-mobile-navigation" ref={mobileDrawerRef} className="site-mobile-navigation" role="dialog" aria-modal="true" aria-labelledby="site-mobile-navigation-title">
            <div className="site-mobile-navigation-head">
              <strong id="site-mobile-navigation-title">Menu</strong>
              <button type="button" onClick={() => { setMobileOpen(false); requestAnimationFrame(() => mobileButtonRef.current?.focus()) }} aria-label="Close navigation menu"><X size={20} aria-hidden="true" /></button>
            </div>
            <nav aria-label="Mobile primary navigation">
              <Link href="/#tools" prefetch={false} onClick={() => setMobileOpen(false)}>Browse and search all tools</Link>
              {NAV_LINKS.map(link => {
                const current = isPathCurrent(pathname, link.href)
                return <Link key={link.href} href={link.href} prefetch={false} onClick={() => setMobileOpen(false)} className={current ? 'is-current' : ''} aria-current={current ? 'page' : undefined}>{link.label}</Link>
              })}
            </nav>

            <div className="site-mobile-categories" aria-label="Tool categories">
              <h2>Browse by category</h2>
              {TOOL_CATEGORIES.map(category => {
                const Icon = CATEGORY_ICONS[category.id]
                const expanded = mobileCategory === category.id
                return (
                  <section key={category.id} style={{ '--category-color': category.color } as React.CSSProperties}>
                    <button type="button" onClick={() => setMobileCategory(value => value === category.id ? null : category.id)} aria-expanded={expanded} aria-controls={`mobile-tools-${category.id}`}>
                      <Icon size={17} aria-hidden="true" /><span>{category.label}</span><small>{category.slugs.length}</small><ChevronDown size={17} aria-hidden="true" />
                    </button>
                    <div id={`mobile-tools-${category.id}`} hidden={!expanded}>
                      <Link href={getCategoryHref(category)} prefetch={false} onClick={() => setMobileOpen(false)}>View all {category.label.toLowerCase()}</Link>
                      {getCategoryTools(category).map(tool => {
                        const current = pathname === `/${tool.slug}`
                        const access = getToolAccessPresentation(tool.access)
                        return (
                          <Link key={tool.slug} href={`/${tool.slug}`} prefetch={false} onClick={() => setMobileOpen(false)} className={current ? 'is-current' : ''} aria-current={current ? 'page' : undefined}>
                            <span>{tool.name}</span><small>{access.badges.map(badge => badge.label).join(' + ')}</small>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>

            <div className="site-mobile-navigation-actions">
              {isLoaded && !isSignedIn && <SignInButton mode="modal"><button type="button">Sign in to EditPDF AI</button></SignInButton>}
              {isLoaded && isSignedIn && <Link href="/dashboard" prefetch={false} onClick={() => setMobileOpen(false)}>Open account dashboard</Link>}
              <Link href="/pdf-editor" prefetch={false} className="is-primary" onClick={() => setMobileOpen(false)}><Upload size={16} aria-hidden="true" /> Open PDF Editor</Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
