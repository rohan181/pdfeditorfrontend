'use client'

import { useState, useRef } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Upload, FileText, FilePen, Minimize2, Merge, Split, PenTool,
  FileType, FileSpreadsheet, Presentation, Sparkles, KeyRound, Layers,
  WandSparkles, ScanText, Languages, BrainCircuit, ClipboardList,
  ImagePlus, Images, Stamp, Scissors, EyeOff, Trash2,
  MessageSquareText, MonitorPlay, RotateCw,
  ChevronDown, X, Menu, ArrowRight,
} from 'lucide-react'

const SP = { type: 'spring', stiffness: 400, damping: 30 } as const
const FI = { fontFamily: 'var(--font-inter,system-ui,sans-serif)' }
const RED = '#E24B4A'
const E = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

type Tier = 'free' | 'ai' | 'pro'
type NavTool = { name: string; href: string; tier: Tier; Icon: LucideIcon; bg: string }
type NavCat  = { label: string; href: string; color: string; Icon: LucideIcon; tools: NavTool[] }

const NAV_CATS: NavCat[] = [
  {
    label: 'Edit', href: '/pdf-editor', color: '#2563eb', Icon: FilePen,
    tools: [
      { name: 'PDF Editor',    href: '/pdf-editor',      tier: 'free', Icon: FilePen,          bg: '#2563eb' },
      { name: 'PDF Annotator', href: '/pdf-annotate',    tier: 'free', Icon: MessageSquareText, bg: '#0ea5e9' },
      { name: 'PDF Viewer',    href: '/pdf-viewer',      tier: 'free', Icon: MonitorPlay,       bg: '#0a84ff' },
      { name: 'PDF Redactor',  href: '/pdf-redactor',    tier: 'free', Icon: EyeOff,            bg: '#374151' },
      { name: 'PDF Cropper',   href: '/pdf-cropper',     tier: 'free', Icon: Scissors,          bg: '#0d9488' },
      { name: 'Rotate PDF',    href: '/rotate-pdf',      tier: 'free', Icon: RotateCw,          bg: '#ea580c' },
    ],
  },
  {
    label: 'AI Tools', href: '/ai-pdf-form-filler', color: '#7c3aed', Icon: Sparkles,
    tools: [
      { name: 'AI Form Filler', href: '/ai-pdf-form-filler', tier: 'ai', Icon: WandSparkles,  bg: '#7c3aed' },
      { name: 'PDF Summarizer', href: '/pdf-summarizer',     tier: 'ai', Icon: Sparkles,      bg: '#8b5cf6' },
      { name: 'OCR Scanner',    href: '/pdf-ocr',            tier: 'ai', Icon: ScanText,      bg: '#6366f1' },
      { name: 'PDF Translator', href: '/pdf-translator',     tier: 'ai', Icon: Languages,     bg: '#0891b2' },
      { name: 'PDF Mind Map',   href: '/mind-map',           tier: 'ai', Icon: BrainCircuit,  bg: '#a855f7' },
      { name: 'Quiz Creator',   href: '/quiz-creator',       tier: 'ai', Icon: ClipboardList, bg: '#7c3aed' },
    ],
  },
  {
    label: 'Convert', href: '/#tools', color: '#16a34a', Icon: FileType,
    tools: [
      { name: 'PDF → Word',    href: '/pdf-to-word',    tier: 'pro',  Icon: FileType,        bg: '#16a34a' },
      { name: 'PDF → Excel',   href: '/pdf-to-excel',   tier: 'pro',  Icon: FileSpreadsheet, bg: '#15803d' },
      { name: 'PDF → PPT',     href: '/pdf-to-ppt',     tier: 'pro',  Icon: Presentation,    bg: '#d97706' },
      { name: 'Image to PDF',  href: '/image-to-pdf',   tier: 'free', Icon: ImagePlus,       bg: '#7c3aed' },
      { name: 'Word → PDF',    href: '/word-to-pdf',    tier: 'free', Icon: FileType,        bg: '#2563eb' },
      { name: 'PDF to Images', href: '/pdf-to-images',  tier: 'free', Icon: Images,          bg: '#db2777' },
    ],
  },
  {
    label: 'Protect', href: '/pdf-signer', color: '#dc2626', Icon: KeyRound,
    tools: [
      { name: 'Sign PDF',       href: '/pdf-signer',        tier: 'free', Icon: PenTool,  bg: '#0d9488' },
      { name: 'Password Lock',  href: '/pdf-password-lock', tier: 'free', Icon: KeyRound, bg: '#dc2626' },
      { name: 'Watermark',      href: '/pdf-watermark',     tier: 'free', Icon: Stamp,    bg: '#2563eb' },
      { name: 'PDF Redactor',   href: '/pdf-redactor',      tier: 'free', Icon: EyeOff,   bg: '#374151' },
    ],
  },
  {
    label: 'Organize', href: '/#tools', color: '#d97706', Icon: Layers,
    tools: [
      { name: 'Merge PDF',     href: '/pdf-merger',       tier: 'free', Icon: Merge,    bg: '#7c3aed' },
      { name: 'Split PDF',     href: '/pdf-splitter',     tier: 'free', Icon: Split,    bg: '#e11d48' },
      { name: 'Compress PDF',  href: '/pdf-compressor',   tier: 'free', Icon: Minimize2,bg: '#d97706' },
      { name: 'Page Manager',  href: '/pdf-page-manager', tier: 'free', Icon: Layers,   bg: '#f97316' },
      { name: 'Extract Pages', href: '/extract-pages',    tier: 'free', Icon: Scissors, bg: '#0891b2' },
      { name: 'Delete Pages',  href: '/delete-pages',     tier: 'free', Icon: Trash2,   bg: '#dc2626' },
    ],
  },
]

const TIER_LABEL = {
  free: { label: 'Free',       bg: 'rgba(22,163,74,.1)',   color: '#15803d' },
  ai:   { label: '5 free/day', bg: 'rgba(124,58,237,.1)',  color: '#7c3aed' },
  pro:  { label: 'Pro',        bg: 'rgba(8,145,178,.1)',   color: '#0e7490' },
}

const NAV_LINKS: { label: string; href: string; highlight?: boolean }[] = [
  { label: 'AI Tools', href: '/ai-pdf-form-filler', highlight: true },
  { label: 'Pricing',  href: '/pricing' },
  { label: 'Privacy',  href: '/privacy' },
  { label: 'Support',  href: '/support' },
]

const NAV_CSS = `
  .sn-mob-acc      { display:grid; grid-template-rows:0fr; transition:grid-template-rows .22s ease; }
  .sn-mob-acc.open { grid-template-rows:1fr; }
  .sn-mob-acc > div{ overflow:hidden; }
  .sn-mob-chev     { display:flex; transition:transform .18s ease; }
  .sn-mob-chev.open{ transform:rotate(180deg); }
  .sn-mob-cat-btn  { touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
  .sn-desk         { display:flex; }
  .sn-mob          { display:none; }
  @media(max-width:900px){
    .sn-desk { display:none; }
    .sn-mob  { display:flex; }
  }
`

export default function SiteNav() {
  const { isSignedIn, isLoaded } = useUser()
  const [toolsOpen, setToolsOpen]     = useState(false)
  const [mobOpen, setMobOpen]         = useState(false)
  const [mobToolsExp, setMobToolsExp] = useState(false)
  const [mobCatOpen, setMobCatOpen]   = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu  = () => { clearTimeout(closeTimer.current!); setToolsOpen(true) }
  const closeMenu = () => { closeTimer.current = setTimeout(() => setToolsOpen(false), 120) }
  const keepMenu  = () => { clearTimeout(closeTimer.current!) }

  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.96)'])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />

      {/* Fixed header */}
      <motion.header style={{
        position: 'fixed', inset: '0 0 auto', zIndex: 300, height: 56,
        background: navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,.07)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 28, flexShrink: 0 }}>
            <motion.div whileHover={{ rotate: 12, scale: 1.1 }} transition={SP}
              style={{ width: 28, height: 28, background: '#1d1d1f', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={14} color="#fff" strokeWidth={2.2} />
            </motion.div>
            <span style={{ ...FI, fontSize: 15, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.04em' }}>
              Edit<span style={{ color: RED }}>PDF</span> AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="sn-desk" style={{ alignItems: 'center', gap: 2, flex: 1 }}>
            <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{ position: 'relative' }}>
              <button
                onClick={() => setToolsOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 11px', background: toolsOpen ? 'rgba(0,0,0,.05)' : 'transparent',
                  border: 'none', borderRadius: 8, cursor: 'pointer', outline: 'none',
                  fontSize: 13, fontWeight: toolsOpen ? 600 : 500,
                  color: toolsOpen ? '#1d1d1f' : 'rgba(0,0,0,.55)',
                  ...FI, transition: 'all .12s', flexShrink: 0,
                }}>
                Tools
                <motion.span style={{ display: 'flex', alignItems: 'center', opacity: .6 }}
                  animate={{ rotate: toolsOpen ? 180 : 0 }} transition={{ duration: .14 }}>
                  <ChevronDown size={11} strokeWidth={2.5} />
                </motion.span>
              </button>
            </div>

            {NAV_LINKS.map(({ label, href, highlight }) => (
              <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                <motion.span
                  whileHover={{ color: highlight ? '#7c3aed' : '#1d1d1f' }}
                  style={{
                    ...FI, display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '5px 11px', fontSize: 13, fontWeight: 500, borderRadius: 8,
                    color: highlight ? '#7c3aed' : 'rgba(0,0,0,.52)',
                  }}>
                  {highlight && <Sparkles size={11} strokeWidth={2} />}
                  {label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* CTA + auth + mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            {isLoaded && (
              isSignedIn ? (
                <div className="sn-desk" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Link href="/dashboard"
                    style={{ ...FI, fontSize: 12.5, fontWeight: 500, color: 'rgba(0,0,0,.55)', textDecoration: 'none', padding: '5px 10px', borderRadius: 8 }}>
                    Dashboard
                  </Link>
                  <UserButton />
                </div>
              ) : (
                <div className="sn-desk" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SignInButton mode="modal">
                    <button style={{ ...FI, fontSize: 12.5, fontWeight: 500, color: 'rgba(0,0,0,.6)', background: 'transparent', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button style={{ ...FI, fontSize: 12.5, fontWeight: 600, color: '#fff', background: '#1d1d1f', border: 'none', padding: '6px 14px', borderRadius: 99, cursor: 'pointer', letterSpacing: '-0.02em' }}>
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              )
            )}

            <Link href="/pdf-editor" className="sn-desk"
              style={{ ...FI, alignItems: 'center', gap: 6, padding: '7px 16px', background: '#1d1d1f', color: '#fff', borderRadius: 99, fontSize: 12.5, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em', flexShrink: 0 }}>
              <motion.span style={{ display: 'flex', alignItems: 'center', gap: 6 }} whileHover={{ gap: 10 }} transition={SP}>
                <Upload size={12} strokeWidth={2.5} /> Upload PDF
              </motion.span>
            </Link>

            {/* Mobile toggle */}
            <motion.button className="sn-mob" whileTap={{ scale: .9 }} onClick={() => setMobOpen(o => !o)}
              style={{ width: 40, height: 40, borderRadius: 10, border: '1.5px solid rgba(0,0,0,.1)', background: '#fff', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mobOpen ? 'x' : 'm'}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .15 }}>
                  {mobOpen ? <X size={18} color="#1d1d1f" strokeWidth={2} /> : <Menu size={18} color="#1d1d1f" strokeWidth={2} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Desktop dropdown ── */}
      <AnimatePresence>
        {toolsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}
              onClick={() => setToolsOpen(false)}
              style={{ position: 'fixed', inset: '56px 0 0', zIndex: 298, background: 'rgba(0,0,0,.18)', backdropFilter: 'blur(2px)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: .18, ease: [.22, 1, .36, 1] }}
              onMouseEnter={keepMenu} onMouseLeave={closeMenu}
              style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 299, background: '#fff', borderBottom: '1px solid rgba(0,0,0,.07)', boxShadow: '0 16px 48px rgba(0,0,0,.1)' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
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
                        const badge = TIER_LABEL[tool.tier]
                        return (
                          <Link key={tool.name} href={tool.href} onClick={() => setToolsOpen(false)} style={{ textDecoration: 'none' }}>
                            <motion.div whileHover={{ background: '#f5f5f7' }} transition={{ duration: .1 }}
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 8, cursor: 'pointer' }}>
                              <div style={{ width: 26, height: 26, borderRadius: 7, background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <tool.Icon size={13} color="#fff" strokeWidth={1.8} />
                              </div>
                              <span style={{ ...FI, fontSize: 12, fontWeight: 600, color: '#1d1d1f', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.name}</span>
                              {tool.tier !== 'free' && (
                                <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.04em', padding: '1.5px 5px', borderRadius: 99, background: badge.bg, color: badge.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
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

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: .22, ease: E }}
            style={{ position: 'fixed', inset: '56px 0 0', zIndex: 290, background: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

            {/* Tools section */}
            <div style={{ borderBottom: '1px solid #f0f0f0' }}>
              <button onClick={() => setMobToolsExp(v => !v)} className="sn-mob-cat-btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <span style={{ ...FI, fontSize: 15, fontWeight: 700, color: '#1d1d1f', flex: 1, textAlign: 'left' }}>Tools</span>
                <span className={`sn-mob-chev${mobToolsExp ? ' open' : ''}`}>
                  <ChevronDown size={18} color="rgba(0,0,0,.4)" strokeWidth={2} />
                </span>
              </button>

              <div className={`sn-mob-acc${mobToolsExp ? ' open' : ''}`}>
                <div style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
                  {NAV_CATS.map(cat => (
                    <div key={cat.label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      {/* Category header row */}
                      <button
                        onClick={() => setMobCatOpen(v => v === cat.label ? null : cat.label)}
                        className="sn-mob-cat-btn"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <cat.Icon size={15} color={cat.color} strokeWidth={1.9} />
                        </div>
                        <span style={{ ...FI, fontSize: 14, fontWeight: 700, color: cat.color, flex: 1, textAlign: 'left' }}>{cat.label}</span>
                        <span className={`sn-mob-chev${mobCatOpen === cat.label ? ' open' : ''}`}>
                          <ChevronDown size={15} color="rgba(0,0,0,.3)" strokeWidth={2} />
                        </span>
                      </button>

                      {/* Tools in this category */}
                      <div className={`sn-mob-acc${mobCatOpen === cat.label ? ' open' : ''}`}>
                        <div style={{ background: '#fff' }}>
                          {cat.tools.map((tool, ti) => {
                            const badge = TIER_LABEL[tool.tier]
                            return (
                              <Link key={tool.name} href={tool.href} onClick={() => setMobOpen(false)} style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px 11px 28px', borderTop: ti === 0 ? '1px solid #f3f4f6' : 'none', borderBottom: '1px solid #f9fafb', WebkitTapHighlightColor: 'transparent' }}>
                                  <div style={{ width: 30, height: 30, borderRadius: 8, background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <tool.Icon size={14} color="#fff" strokeWidth={1.8} />
                                  </div>
                                  <span style={{ ...FI, fontSize: 13.5, fontWeight: 600, color: '#1d1d1f', flex: 1 }}>{tool.name}</span>
                                  {tool.tier !== 'free' && (
                                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 99, background: badge.bg, color: badge.color }}>
                                      {badge.label}
                                    </span>
                                  )}
                                  <ArrowRight size={13} color="rgba(0,0,0,.2)" strokeWidth={2} />
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* See all link */}
                  <Link href="/#tools" onClick={() => setMobOpen(false)} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 20px', ...FI, fontSize: 13, fontWeight: 700, color: '#2563eb' }}>
                      See all 35+ tools <ArrowRight size={13} strokeWidth={2.5} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Plain nav links */}
            {NAV_LINKS.map(({ label, href, highlight }) => (
              <Link key={label} href={href} onClick={() => setMobOpen(false)} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid #f0f0f0', ...FI, fontSize: 15, fontWeight: 600, color: highlight ? '#7c3aed' : '#1d1d1f', WebkitTapHighlightColor: 'transparent' }}>
                  {highlight && <Sparkles size={15} strokeWidth={2} color="#7c3aed" />}
                  {label}
                </div>
              </Link>
            ))}

            {/* Auth */}
            {isLoaded && (
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                {isSignedIn ? (
                  <Link href="/dashboard" onClick={() => setMobOpen(false)} style={{ ...FI, fontSize: 14, fontWeight: 600, color: '#1d1d1f', textDecoration: 'none' }}>
                    Dashboard →
                  </Link>
                ) : (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <SignInButton mode="modal">
                      <button style={{ ...FI, flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 14, fontWeight: 600, color: '#1d1d1f', cursor: 'pointer' }}>Sign in</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button style={{ ...FI, flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#1d1d1f', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Sign up</button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            )}

            {/* Upload CTA */}
            <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
              <Link href="/pdf-editor" onClick={() => setMobOpen(false)}
                style={{ ...FI, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#1d1d1f', color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em' }}>
                <Upload size={16} strokeWidth={2.5} /> Upload PDF
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
