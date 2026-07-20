'use client'

import { useState, useRef } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Upload, FilePen, Minimize2, Merge, Split, PenTool,
  FileType, FileSpreadsheet, Presentation, Sparkles, KeyRound, Layers,
  WandSparkles, ScanText, Languages, BrainCircuit, ClipboardList,
  ImagePlus, Images, Stamp, Scissors, EyeOff, Trash2,
  MessageSquareText, MonitorPlay, RotateCw,
  ListOrdered, Table, Code, FormInput,
  ChevronDown, X, Menu, ArrowRight,
} from 'lucide-react'

const SP  = { type: 'spring', stiffness: 400, damping: 30 } as const
const FI  = { fontFamily: 'var(--font-inter,system-ui,sans-serif)' }
const RED = '#E24B4A'
const E   = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

type Tier    = 'free' | 'ai' | 'pro'
type NavTool = { name: string; href: string; tier: Tier; Icon: LucideIcon; bg: string }
type NavCat  = { label: string; href: string; color: string; Icon: LucideIcon; tools: NavTool[] }

const NAV_CATS: NavCat[] = [
  {
    label: 'AI Tools', href: '/ai-pdf-form-filler', color: '#7c3aed', Icon: Sparkles,
    tools: [
      { name: 'AI Form Filler', href: '/ai-pdf-form-filler', tier: 'ai',   Icon: WandSparkles,  bg: '#7c3aed' },
      { name: 'PDF Summarizer', href: '/pdf-summarizer',     tier: 'ai',   Icon: Sparkles,      bg: '#8b5cf6' },
      { name: 'OCR Scanner',    href: '/pdf-ocr',            tier: 'ai',   Icon: ScanText,      bg: '#6366f1' },
      { name: 'PDF Translator', href: '/pdf-translator',     tier: 'ai',   Icon: Languages,     bg: '#0891b2' },
      { name: 'PDF Mind Map',   href: '/mind-map',           tier: 'ai',   Icon: BrainCircuit,  bg: '#a855f7' },
      { name: 'Quiz Creator',   href: '/quiz-creator',       tier: 'ai',   Icon: ClipboardList, bg: '#7c3aed' },
    ],
  },
  {
    label: 'Edit', href: '/pdf-editor', color: '#2563eb', Icon: FilePen,
    tools: [
      { name: 'PDF Editor',    href: '/pdf-editor',   tier: 'free', Icon: FilePen,           bg: '#2563eb' },
      { name: 'PDF Annotator', href: '/pdf-annotate', tier: 'free', Icon: MessageSquareText, bg: '#0ea5e9' },
      { name: 'PDF Viewer',    href: '/pdf-viewer',   tier: 'free', Icon: MonitorPlay,       bg: '#0a84ff' },
    ],
  },
  {
    label: 'Page Tools', href: '/#tools', color: '#f97316', Icon: Layers,
    tools: [
      { name: 'Page Manager',     href: '/pdf-page-manager', tier: 'free', Icon: Layers,      bg: '#f59e0b' },
      { name: 'PDF Cropper',      href: '/pdf-cropper',      tier: 'free', Icon: Scissors,    bg: '#0d9488' },
      { name: 'Add Page Numbers', href: '/add-page-numbers', tier: 'free', Icon: ListOrdered, bg: '#f97316' },
      { name: 'Rotate PDF',       href: '/rotate-pdf',       tier: 'free', Icon: RotateCw,    bg: '#ea580c' },
      { name: 'Extract Pages',    href: '/extract-pages',    tier: 'free', Icon: Scissors,    bg: '#0891b2' },
      { name: 'Delete Pages',     href: '/delete-pages',     tier: 'free', Icon: Trash2,      bg: '#dc2626' },
    ],
  },
  {
    label: 'Convert', href: '/#tools', color: '#16a34a', Icon: FileType,
    tools: [
      { name: 'PDF → Word',    href: '/pdf-to-word',   tier: 'pro',  Icon: FileType,        bg: '#16a34a' },
      { name: 'PDF → Excel',   href: '/pdf-to-excel',  tier: 'pro',  Icon: FileSpreadsheet, bg: '#15803d' },
      { name: 'PDF → PPT',     href: '/pdf-to-ppt',    tier: 'pro',  Icon: Presentation,    bg: '#d97706' },
      { name: 'Word → PDF',    href: '/word-to-pdf',   tier: 'free', Icon: FileType,        bg: '#2563eb' },
      { name: 'Excel → PDF',   href: '/excel-to-pdf',  tier: 'free', Icon: Table,           bg: '#059669' },
      { name: 'PPT → PDF',     href: '/ppt-to-pdf',    tier: 'free', Icon: Presentation,    bg: '#b45309' },
      { name: 'Image to PDF',  href: '/image-to-pdf',  tier: 'free', Icon: ImagePlus,       bg: '#7c3aed' },
      { name: 'PDF to Images', href: '/pdf-to-images', tier: 'free', Icon: Images,          bg: '#db2777' },
      { name: 'TXT → PDF',     href: '/txt-to-pdf',    tier: 'free', Icon: FileType,        bg: '#6366f1' },
      { name: 'HTML → PDF',    href: '/html-to-pdf',   tier: 'free', Icon: Code,            bg: '#0891b2' },
    ],
  },
  {
    label: 'Protect', href: '/pdf-signer', color: '#dc2626', Icon: KeyRound,
    tools: [
      { name: 'PDF E-Signer',  href: '/pdf-signer',        tier: 'free', Icon: PenTool,  bg: '#0d9488' },
      { name: 'Password Lock', href: '/pdf-password-lock', tier: 'free', Icon: KeyRound, bg: '#dc2626' },
      { name: 'Watermark',     href: '/pdf-watermark',     tier: 'free', Icon: Stamp,    bg: '#2563eb' },
      { name: 'PDF Redactor',  href: '/pdf-redactor',      tier: 'free', Icon: EyeOff,   bg: '#374151' },
    ],
  },
  {
    label: 'Organize', href: '/#tools', color: '#d97706', Icon: Layers,
    tools: [
      { name: 'PDF Merger',   href: '/pdf-merger',       tier: 'free', Icon: Merge,      bg: '#7c3aed' },
      { name: 'PDF Splitter', href: '/pdf-splitter',     tier: 'free', Icon: Split,      bg: '#e11d48' },
      { name: 'Compress PDF', href: '/pdf-compressor',   tier: 'free', Icon: Minimize2,  bg: '#d97706' },
      { name: 'Form Builder', href: '/pdf-form-builder', tier: 'free', Icon: FormInput,  bg: '#0369a1' },
    ],
  },
]

const TIER_BADGE = {
  free: { label: 'Free',       bg: 'rgba(22,163,74,.1)',  color: '#15803d' },
  ai:   { label: '5 free/day', bg: 'rgba(124,58,237,.1)', color: '#7c3aed' },
  pro:  { label: 'Pro',        bg: 'rgba(8,145,178,.1)',  color: '#0e7490' },
}

const NAV_LINKS = [
  { label: 'Guides',  href: '/guides'  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About',   href: '/about'   },
]

// ── shared touch-button style ─────────────────────────────────────────────────
const TAP: React.CSSProperties = {
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
  userSelect: 'none',
  cursor: 'pointer',
}

export default function SiteNav() {
  const { isSignedIn, isLoaded } = useUser()

  // desktop dropdown
  const [toolsOpen, setToolsOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openMenu  = () => { clearTimeout(closeTimer.current!); setToolsOpen(true) }
  const closeMenu = () => { closeTimer.current = setTimeout(() => setToolsOpen(false), 120) }
  const keepMenu  = () => { clearTimeout(closeTimer.current!) }

  // mobile drawer
  const [mobOpen,  setMobOpen]  = useState(false)
  const [toolsExp, setToolsExp] = useState(false)

  const closeMob = () => { setMobOpen(false); setToolsExp(false) }

  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.97)'])

  return (
    <>
      {/* ── Fixed bar ─────────────────────────────────────────────────────── */}
      <motion.header style={{
        position: 'fixed', inset: '0 0 auto', zIndex: 300, height: 56,
        background: navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,.07)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: 4 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: 20, flexShrink: 0 }}>
            <Image src="/logo.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} priority />
          </Link>

          {/* Desktop nav links — hidden on ≤900px via CSS */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* Tools dropdown trigger */}
            <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{ position: 'relative' }}
              className="sn-desk-only">
              <button onClick={() => setToolsOpen(v => !v)}
                style={{ ...FI, ...TAP, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 11px', background: toolsOpen ? 'rgba(0,0,0,.05)' : 'transparent', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: toolsOpen ? 600 : 500, color: toolsOpen ? '#1d1d1f' : 'rgba(0,0,0,.55)', outline: 'none' }}>
                Tools
                <motion.span style={{ display: 'flex', opacity: .55 }} animate={{ rotate: toolsOpen ? 180 : 0 }} transition={{ duration: .14 }}>
                  <ChevronDown size={12} strokeWidth={2.5} />
                </motion.span>
              </button>
            </div>

            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="sn-desk-only" style={{ textDecoration: 'none' }}>
                <motion.span whileHover={{ color: '#1d1d1f' }}
                  style={{ ...FI, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 11px', fontSize: 13, fontWeight: 500, borderRadius: 8, color: 'rgba(0,0,0,.52)' }}>
                  {label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/dashboard" className="sn-desk-only"
                  style={{ ...FI, fontSize: 12.5, fontWeight: 700, color: '#1d1d1f', textDecoration: 'none',
                    padding: '6px 14px', borderRadius: 99, border: '1.5px solid rgba(0,0,0,.16)', background: '#fff' }}>
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : isLoaded ? (
              <SignInButton mode="modal">
                <button className="sn-desk-only" style={{ ...FI, ...TAP, fontSize: 13, fontWeight: 700,
                  color: '#1d1d1f', background: '#fff', border: '1.5px solid rgba(0,0,0,.16)',
                  padding: '6px 14px', borderRadius: 99, cursor: 'pointer', letterSpacing: '-0.02em' }}>
                  Sign in
                </button>
              </SignInButton>
            ) : null}

            {/* Open Editor — desktop only */}
            <Link href="/pdf-editor" className="sn-desk-only"
              style={{ ...FI, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: '#1d1d1f', color: '#fff', borderRadius: 99, fontSize: 12.5, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em' }}>
              <Upload size={12} strokeWidth={2.5} /> Open Editor
            </Link>

            {/* Hamburger — mobile only */}
            <button className="sn-mob-only" onClick={() => { setMobOpen(o => !o); if (mobOpen) setToolsExp(false); }}
              aria-label={mobOpen ? 'Close menu' : 'Open menu'}
              style={{ ...TAP, width: 44, height: 44, borderRadius: 10, border: '1.5px solid rgba(0,0,0,.12)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mobOpen ? 'x' : 'm'}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .15 }}>
                  {mobOpen
                    ? <X    size={20} color="#1d1d1f" strokeWidth={2} />
                    : <Menu size={20} color="#1d1d1f" strokeWidth={2} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Desktop tools dropdown ─────────────────────────────────────────── */}
      <AnimatePresence>
        {toolsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}
              onClick={() => setToolsOpen(false)}
              style={{ position: 'fixed', inset: '56px 0 0', zIndex: 298, background: 'rgba(0,0,0,.2)', backdropFilter: 'blur(2px)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: .18, ease: [.22, 1, .36, 1] }}
              onMouseEnter={keepMenu} onMouseLeave={closeMenu}
              style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 299, background: '#fff', borderBottom: '1px solid rgba(0,0,0,.07)', boxShadow: '0 20px 60px rgba(0,0,0,.1)' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4 }}>
                  {NAV_CATS.map(cat => (
                    <div key={cat.label}>
                      <Link href={cat.href} onClick={() => setToolsOpen(false)} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px 8px', marginBottom: 4, borderBottom: `2px solid ${cat.color}22` }}>
                          <div style={{ width: 24, height: 24, borderRadius: 7, background: `${cat.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <cat.Icon size={12} color={cat.color} strokeWidth={2} />
                          </div>
                          <span style={{ ...FI, fontSize: 11.5, fontWeight: 800, color: cat.color, letterSpacing: '-0.01em' }}>{cat.label}</span>
                        </div>
                      </Link>
                      {cat.tools.map(tool => {
                        const badge = TIER_BADGE[tool.tier]
                        return (
                          <Link key={tool.name} href={tool.href} onClick={() => setToolsOpen(false)} style={{ textDecoration: 'none' }}>
                            <motion.div whileHover={{ background: '#f5f5f7' }} transition={{ duration: .08 }}
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 8 }}>
                              <div style={{ width: 26, height: 38, borderRadius: 7, background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <tool.Icon size={13} color="#fff" strokeWidth={1.8} />
                              </div>
                              <span style={{ ...FI, fontSize: 12, fontWeight: 600, color: '#1d1d1f', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.name}</span>
                              {tool.tier !== 'free' && (
                                <span style={{ fontSize: 8.5, fontWeight: 700, padding: '1.5px 5px', borderRadius: 99, background: badge.bg, color: badge.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  {badge.label}
                                </span>
                              )}
                            </motion.div>
                          </Link>
                        )
                      })}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link href="/#tools" onClick={() => setToolsOpen(false)}
                    style={{ ...FI, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#6b7280', textDecoration: 'none' }}>
                    See all 35+ tools <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile full-screen drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeMob}
              style={{ position: 'fixed', inset: '56px 0 0', zIndex: 280, background: 'rgba(0,0,0,.3)' }}
            />

            {/* Drawer panel — slides in from right */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: .25, ease: E }}
              style={{ position: 'fixed', top: 56, right: 0, bottom: 0, width: '100%', maxWidth: 360, zIndex: 290, background: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

              {/* ── Tools section — flat list, all tools always visible ── */}
              <div style={{ borderBottom: '1px solid #f0f0f0' }}>
                {/* "Tools" header row */}
                <button
                  onClick={() => setToolsExp(v => !v)}
                  style={{ ...TAP, width: '100%', display: 'flex', alignItems: 'center', padding: '0 20px', height: 52, background: 'transparent', border: 'none', outline: 'none' }}>
                  <span style={{ ...FI, fontSize: 15, fontWeight: 700, color: '#1d1d1f', flex: 1, textAlign: 'left' }}>All Tools</span>
                  <span style={{ display: 'flex', transition: 'transform .2s', transform: toolsExp ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown size={18} color="rgba(0,0,0,.4)" strokeWidth={2} />
                  </span>
                </button>

                {/* Flat tools panel — all tools visible, grouped by category header */}
                <div style={{ overflow: 'hidden', maxHeight: toolsExp ? 4000 : 0, transition: 'max-height .35s ease' }}>
                  <div style={{ background: '#f9fafb', borderTop: '1px solid #f0f0f0' }}>
                    {NAV_CATS.map(cat => (
                      <div key={cat.label}>
                        {/* Category header — not a button, just a label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px 6px', borderBottom: `2px solid ${cat.color}22` }}>
                          <div style={{ width: 26, height: 38, borderRadius: 8, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <cat.Icon size={13} color={cat.color} strokeWidth={2} />
                          </div>
                          <span style={{ ...FI, fontSize: 11, fontWeight: 800, color: cat.color, textTransform: 'uppercase', letterSpacing: '.06em' }}>{cat.label}</span>
                        </div>
                        {/* All tools in this category — always visible */}
                        {cat.tools.map(tool => {
                          const badge = TIER_BADGE[tool.tier]
                          return (
                            <Link key={tool.name} href={tool.href} onClick={closeMob} style={{ textDecoration: 'none', display: 'block' }}>
                              <div style={{ ...TAP, display: 'flex', alignItems: 'center', gap: 11, padding: '0 20px 0 20px', height: 46, borderBottom: '1px solid #f0f1f3', background: '#fff' }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <tool.Icon size={13} color="#fff" strokeWidth={1.8} />
                                </div>
                                <span style={{ ...FI, fontSize: 13.5, fontWeight: 600, color: '#1d1d1f', flex: 1 }}>{tool.name}</span>
                                {tool.tier !== 'free' && (
                                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 99, background: badge.bg, color: badge.color, flexShrink: 0 }}>
                                    {badge.label}
                                  </span>
                                )}
                                <ArrowRight size={13} color="rgba(0,0,0,.18)" strokeWidth={2} />
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Plain nav links ── */}
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} onClick={closeMob} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ ...TAP, display: 'flex', alignItems: 'center', gap: 8, height: 52, padding: '0 20px', borderBottom: '1px solid #f0f0f0', ...FI, fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>
                    {label}
                  </div>
                </Link>
              ))}

              {/* ── Auth ── */}
              {isLoaded && (
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                  {isSignedIn ? (
                    <Link href="/dashboard" onClick={closeMob}
                      style={{ ...FI, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 700, color: '#1d1d1f', textDecoration: 'none',
                        padding: '13px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff' }}>
                      Dashboard
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <button style={{ ...FI, ...TAP, width: '100%', padding: '13px', borderRadius: 12,
                        border: '1.5px solid #e5e7eb', background: '#fff',
                        fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>
                        Sign in
                      </button>
                    </SignInButton>
                  )}
                </div>
              )}

              {/* ── Open Editor CTA ── */}
              <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
                <Link href="/pdf-editor" onClick={closeMob}
                  style={{ ...FI, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#1d1d1f', color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em' }}>
                  <Upload size={16} strokeWidth={2.5} /> Open Editor
                </Link>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Responsive visibility CSS (minimal, no accordion tricks) ─────── */}
      <style>{`
        .sn-desk-only { display: flex !important; }
        .sn-mob-only  { display: none  !important; }
        @media (max-width: 900px) {
          .sn-desk-only { display: none  !important; }
          .sn-mob-only  { display: flex  !important; }
        }
      `}</style>
    </>
  )
}
