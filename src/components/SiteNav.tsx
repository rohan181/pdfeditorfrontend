'use client'

import { useState, useRef } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Upload, FileText, FilePen, Minimize2, Merge, Split, KeyRound,
  FileType, Stamp, Layers, Images, Sparkles,
  ChevronDown, X, Menu, ArrowRight,
} from 'lucide-react'

const SP = { type: 'spring', stiffness: 400, damping: 30 } as const
const FI = { fontFamily: 'var(--font-inter,system-ui,sans-serif)' }
const RED = '#E24B4A'
const E = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const POPULAR: { name: string; href: string; Icon: LucideIcon; color: string; desc: string }[] = [
  { name: 'PDF Editor',        href: '/pdf-editor',        Icon: FilePen,   color: '#2563eb', desc: 'Edit text & images' },
  { name: 'PDF Merger',        href: '/pdf-merger',        Icon: Merge,     color: '#7c3aed', desc: 'Combine multiple PDFs' },
  { name: 'PDF Compressor',    href: '/pdf-compressor',    Icon: Minimize2, color: '#d97706', desc: 'Shrink file size' },
  { name: 'PDF → Word',        href: '/pdf-to-word',       Icon: FileType,  color: '#16a34a', desc: 'Convert to editable Word' },
  { name: 'PDF Splitter',      href: '/pdf-splitter',      Icon: Split,     color: '#e11d48', desc: 'Split into parts' },
  { name: 'PDF Password Lock', href: '/pdf-password-lock', Icon: KeyRound,  color: '#dc2626', desc: 'Encrypt & protect' },
  { name: 'PDF Watermarker',   href: '/pdf-watermark',     Icon: Stamp,     color: '#0891b2', desc: 'Add watermarks' },
  { name: 'Image to PDF',      href: '/image-to-pdf',      Icon: Images,    color: '#7c3aed', desc: 'Photos & images to PDF' },
  { name: 'Page Manager',      href: '/pdf-page-manager',  Icon: Layers,    color: '#f97316', desc: 'Reorder & manage pages' },
  { name: 'PDF to Images',     href: '/pdf-to-images',     Icon: Images,    color: '#db2777', desc: 'Export pages as images' },
]

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
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobOpen, setMobOpen]     = useState(false)
  const [mobToolsExp, setMobToolsExp] = useState(false)
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

            {/* Tools dropdown trigger */}
            <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{ position: 'relative' }}>
              <button style={{
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

            {/* Plain nav links */}
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

            {/* Upload PDF CTA */}
            <Link href="/pdf-editor" className="sn-desk"
              style={{ ...FI, alignItems: 'center', gap: 6, padding: '7px 16px', background: '#1d1d1f', color: '#fff', borderRadius: 99, fontSize: 12.5, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em', flexShrink: 0 }}>
              <motion.span style={{ display: 'flex', alignItems: 'center', gap: 6 }} whileHover={{ gap: 10 }} transition={SP}>
                <Upload size={12} strokeWidth={2.5} /> Upload PDF
              </motion.span>
            </Link>

            {/* Mobile menu toggle */}
            <motion.button className="sn-mob" whileTap={{ scale: .9 }} onClick={() => setMobOpen(o => !o)}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(0,0,0,.12)', background: '#fff', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mobOpen ? 'x' : 'm'}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .15 }}>
                  {mobOpen ? <X size={16} color="#1d1d1f" strokeWidth={2} /> : <Menu size={16} color="#1d1d1f" strokeWidth={2} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Desktop Tools dropdown */}
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
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ ...FI, fontSize: 10.5, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Popular Tools
                  </div>
                  <Link href="/#tools" onClick={() => setToolsOpen(false)}
                    style={{ ...FI, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                    See all 35+ tools <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 3 }}>
                  {POPULAR.map(tool => (
                    <Link key={tool.name} href={tool.href} onClick={() => setToolsOpen(false)} style={{ textDecoration: 'none' }}>
                      <motion.div whileHover={{ background: '#f5f5f7' }} transition={{ duration: .1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 10, cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: 9, background: `${tool.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <tool.Icon size={15} color={tool.color} strokeWidth={1.9} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ ...FI, fontSize: 12, fontWeight: 600, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tool.name}</div>
                          <div style={{ ...FI, fontSize: 10.5, color: '#9ca3af', marginTop: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tool.desc}</div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: .2, ease: E }}
            style={{ position: 'fixed', inset: '56px 0 0', zIndex: 290, background: '#f7f7f8', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>

              {/* Tools — expandable */}
              <div style={{ borderBottom: '1px solid rgba(0,0,0,.06)' }}>
                <button onClick={() => setMobToolsExp(v => !v)} className="sn-mob-cat-btn"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <span style={{ ...FI, fontSize: 16, fontWeight: 700, color: '#1d1d1f', flex: 1, textAlign: 'left' }}>Tools</span>
                  <span className={`sn-mob-chev${mobToolsExp ? ' open' : ''}`}>
                    <ChevronDown size={18} color="rgba(0,0,0,.35)" strokeWidth={2} />
                  </span>
                </button>
                <div className={`sn-mob-acc${mobToolsExp ? ' open' : ''}`}>
                  <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,.06)' }}>
                    {POPULAR.map((tool, ti) => (
                      <Link key={tool.name} href={tool.href} onClick={() => setMobOpen(false)} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: ti < POPULAR.length - 1 ? '1px solid #f3f4f6' : 'none', WebkitTapHighlightColor: 'transparent' }}>
                          <div style={{ width: 38, height: 38, minWidth: 38, borderRadius: 10, background: `${tool.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <tool.Icon size={17} color={tool.color} strokeWidth={1.9} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...FI, fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>{tool.name}</div>
                            <div style={{ ...FI, fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{tool.desc}</div>
                          </div>
                          <ArrowRight size={14} color="rgba(0,0,0,.18)" strokeWidth={2} />
                        </div>
                      </Link>
                    ))}
                    <Link href="/#tools" onClick={() => setMobOpen(false)} style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px 20px', ...FI, fontSize: 13, fontWeight: 700, color: '#2563eb', borderTop: '1px solid #f3f4f6' }}>
                        See all 35+ tools <ArrowRight size={13} strokeWidth={2.5} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Plain links */}
              {NAV_LINKS.map(({ label, href, highlight }) => (
                <Link key={label} href={href} onClick={() => setMobOpen(false)} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,.06)', ...FI, fontSize: 16, fontWeight: 600, color: highlight ? '#7c3aed' : '#1d1d1f', WebkitTapHighlightColor: 'transparent' }}>
                    {highlight && <Sparkles size={14} strokeWidth={2} color="#7c3aed" />}
                    {label}
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,.08)', padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
              <Link href="/pdf-editor" onClick={() => setMobOpen(false)}
                style={{ ...FI, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#1d1d1f', color: '#fff', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em' }}>
                <Upload size={18} strokeWidth={2.5} /> Upload PDF
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
