'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, FileText, Lock, Zap, ScanLine, PenLine,
  MousePointer2, Layers, Download, ChevronRight,
  Shield, Globe, Clock, CheckCircle2, Minus,
} from 'lucide-react'

// ─── shared motion presets ──────────────────────────────────────────────────
const E = [0.25, 0.46, 0.45, 0.94] as const
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: E, delay },
})
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: E, delay },
})

// ─── tools list ────────────────────────────────────────────────────────────
const TOOLS = [
  { name: 'AI Form Filler',     tag: 'LIVE', href: '/ai-pdf-form-filler' },
  { name: 'PDF Editor',         tag: 'LIVE', href: '/pdf-editor' },
  { name: 'PDF Watermarker',    tag: 'LIVE', href: '/pdf-watermark' },
  { name: 'PDF OCR Scanner',    tag: 'BETA' },
  { name: 'PDF Form Builder',   tag: 'BETA' },
  { name: 'PDF Page Manager',   tag: 'BETA' },
  { name: 'PDF to Word',        tag: 'SOON' },
  { name: 'PDF to Excel',       tag: 'SOON' },
  { name: 'PDF Compressor',     tag: 'SOON' },
  { name: 'PDF Merger',         tag: 'SOON' },
  { name: 'PDF Splitter',       tag: 'SOON' },
  { name: 'PDF E-Signer',       tag: 'SOON' },
  { name: 'PDF Translator',     tag: 'SOON' },
  { name: 'PDF to Images',      tag: 'SOON' },
  { name: 'PDF Redactor',       tag: 'SOON' },
  { name: 'PDF Password Lock',  tag: 'SOON' },
  { name: 'PDF Summarizer AI',  tag: 'SOON' },
]

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        {/* Wordmark */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, background: '#111', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={14} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111', letterSpacing: '-0.03em', fontFamily: 'var(--font-inter, system-ui)' }}>
            Edit<span style={{ color: '#888' }}>PDF</span> AI
          </span>
        </Link>

        {/* Links */}
        <nav style={{ display: 'flex', gap: 2 }} className="hidden md:flex">
          {[{ l: 'Tools', h: '#tools' }, { l: 'Features', h: '#features' }, { l: 'Form Filler', h: '/ai-pdf-form-filler' }, { l: 'PDF Editor', h: '/pdf-editor' }].map(({ l, h }) => (
            <Link key={l} href={h} style={{ padding: '5px 12px', fontSize: 13.5, fontWeight: 500, color: '#555', textDecoration: 'none', borderRadius: 8, letterSpacing: '-0.01em', fontFamily: 'var(--font-inter, system-ui)', transition: 'color 0.15s, background 0.15s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#111'; (e.target as HTMLElement).style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#555'; (e.target as HTMLElement).style.background = 'transparent' }}>
              {l}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="/ai-pdf-form-filler" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: '#111', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 9, textDecoration: 'none', letterSpacing: '-0.01em', fontFamily: 'var(--font-inter, system-ui)', flexShrink: 0, transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#333')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111')}>
          Open Editor <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </header>
  )
}

// ─── BROWSER MOCKUP ─────────────────────────────────────────────────────────
function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    let cancelled = false
    const t = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        if (cancelled) return clearInterval(iv)
        i++
        setShown(text.slice(0, i))
        if (i >= text.length) clearInterval(iv)
      }, 45)
    }, delay)
    return () => { cancelled = true; clearTimeout(t) }
  }, [text, delay])
  return <>{shown}</>
}

function BrowserMockup() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, ease: E, delay: 0.05 }}
      style={{ maxWidth: 880, margin: '64px auto 0', width: '100%' }}
    >
      <div style={{ borderRadius: 18, border: '1px solid #e4e4e7', overflow: 'hidden', boxShadow: '0 32px 80px -12px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.03)' }}>
        {/* Chrome bar */}
        <div style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7', height: 42, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#fca5a5' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#fde68a' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#6ee7b7' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e4e4e7', borderRadius: 7, padding: '4px 12px', minWidth: 240 }}>
              <Lock size={9} color="#aaa" strokeWidth={2} />
              <span style={{ fontSize: 11, color: '#888', fontFamily: 'var(--font-inter, monospace)', letterSpacing: 0 }}>
                editpdfai.com/ai-pdf-form-filler
              </span>
            </div>
          </div>
        </div>

        {/* App body */}
        <div style={{ display: 'flex', height: 420, background: '#f4f5f8', fontFamily: 'var(--font-inter, system-ui)', overflow: 'hidden' }}>

          {/* Left icon bar */}
          <div style={{ width: 48, background: '#fff', borderRight: '1px solid #e4e4e7', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 4, flexShrink: 0 }}>
            {[
              { Icon: MousePointer2, active: true },
              { Icon: ScanLine,      active: false },
              { Icon: PenLine,       active: false },
              { Icon: Layers,        active: false },
            ].map(({ Icon, active }, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? '#111' : 'transparent', color: active ? '#fff' : '#aaa' }}>
                <Icon size={14} strokeWidth={1.8} />
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: 280, background: '#fff', borderRadius: 4, border: '1px solid #e4e4e7', padding: '24px 20px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

              {/* Scan line */}
              {inView && (
                <motion.div
                  style={{ position: 'absolute', left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.7) 30%, rgba(99,102,241,0.9) 50%, rgba(99,102,241,0.7) 70%, transparent)', pointerEvents: 'none', boxShadow: '0 0 12px rgba(99,102,241,0.35)', zIndex: 3 }}
                  animate={{ top: ['8%', '92%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                />
              )}

              {/* Doc header */}
              <div style={{ fontSize: 8, fontWeight: 700, color: '#111', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Invoice #2025-084</div>
              <div style={{ fontSize: 7, color: '#aaa', marginBottom: 16 }}>Acme Corporation — Net 30</div>
              <div style={{ height: 1, background: '#f0f0f0', marginBottom: 14 }} />

              {/* Fields */}
              {[
                { label: 'Bill To', val: 'Acme Corporation', delay: 600,  done: true  },
                { label: 'Amount', val: '$12,400.00',        delay: 1400, done: true  },
                { label: 'Due Date', val: '',                delay: 2200, done: false },
              ].map(({ label, val, delay, done }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 7, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                  <motion.div
                    style={{ height: 24, borderRadius: 5, border: '1.5px solid', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 9, fontFamily: 'var(--font-inter, monospace)' }}
                    animate={done
                      ? { borderColor: 'rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.04)', color: '#059669' }
                      : { borderColor: ['rgba(99,102,241,0.3)', 'rgba(99,102,241,0.75)', 'rgba(99,102,241,0.3)'], background: 'rgba(99,102,241,0.03)', color: '#6366f1' }}
                    transition={done ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity }}
                  >
                    {done
                      ? <TypeWriter text={val} delay={delay} />
                      : <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>|</motion.span>
                    }
                  </motion.div>
                </div>
              ))}

              {/* Signature */}
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 7, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Signature</div>
                <div style={{ height: 36, borderRadius: 5, border: '1.5px dashed #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {inView && (
                    <svg width="140" height="28" viewBox="0 0 140 28" fill="none">
                      <motion.path
                        d="M 8 20 Q 18 8 30 20 Q 42 30 56 14 Q 68 2 82 20 Q 92 30 106 14 Q 118 4 132 20"
                        stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                        fill="none"
                        strokeDasharray="260"
                        animate={{ strokeDashoffset: [260, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ width: 192, background: '#fff', borderLeft: '1px solid #e4e4e7', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: '#111', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Assistant</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Detected 3 fields', state: 'done' },
                { label: 'Filling form data',  state: 'done' },
                { label: 'Awaiting signature', state: 'active' },
              ].map(({ label, state }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <motion.div
                    style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: state === 'done' ? '#10b981' : state === 'active' ? '#6366f1' : '#d4d4d8' }}
                    animate={state === 'active' ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span style={{ fontSize: 9, color: '#555' }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10, marginTop: 4 }}>
              <div style={{ fontSize: 8, color: '#aaa', marginBottom: 6 }}>Confidence</div>
              <div style={{ height: 4, borderRadius: 99, background: '#f0f0f0', overflow: 'hidden' }}>
                {inView && (
                  <motion.div
                    style={{ height: '100%', borderRadius: 99, background: '#111' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1.4, delay: 0.6, ease: E }}
                  />
                )}
              </div>
              <div style={{ fontSize: 8, color: '#111', fontWeight: 600, marginTop: 4 }}>94%</div>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ height: 30, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <Zap size={10} color="#fff" strokeWidth={2} />
                <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>Apply All</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── FEATURE CARDS ───────────────────────────────────────────────────────────
function OCRMicro() {
  return (
    <div style={{ position: 'relative', background: '#111', borderRadius: 12, overflow: 'hidden', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px' }}>
      {[90, 65, 100, 78, 55, 88].map((w, i) => (
        <motion.div
          key={i}
          style={{ height: 5, borderRadius: 99, background: '#333', marginBottom: i < 5 ? 10 : 0, width: `${w}%` }}
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
      <motion.div
        style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.9) 40%, rgba(165,180,252,1) 50%, rgba(99,102,241,0.9) 60%, transparent)', boxShadow: '0 0 10px rgba(99,102,241,0.7)', pointerEvents: 'none' }}
        animate={{ top: ['6%', '94%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 0.6 }}
      />
      <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
        <motion.div style={{ width: 5, height: 5, borderRadius: '50%', background: '#6366f1' }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        <span style={{ fontSize: 8, color: '#555', fontFamily: 'monospace', letterSpacing: '0.06em' }}>SCANNING</span>
      </div>
    </div>
  )
}

function SignatureMicro() {
  return (
    <div style={{ position: 'relative', background: '#fafafa', borderRadius: 12, overflow: 'hidden', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', padding: '0 24px' }}>
        <div style={{ fontSize: 8, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}>Authorized Signature</div>
        <div style={{ width: '100%', height: 52, border: '1.5px dashed #e4e4e7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <svg width="200" height="44" viewBox="0 0 200 44" fill="none" style={{ overflow: 'visible' }}>
            <motion.path
              d="M 12 32 Q 24 10 40 32 Q 56 50 74 22 Q 90 4 110 32 Q 126 50 144 22 Q 158 8 184 32"
              stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              fill="none"
              strokeDasharray="320"
              animate={{ strokeDashoffset: [320, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
            />
          </svg>
        </div>
        <div style={{ fontSize: 8, color: '#bbb', letterSpacing: '0.06em', fontFamily: 'monospace' }}>LEGALLY BINDING</div>
      </div>
    </div>
  )
}

function FieldsMicro() {
  const fields = [
    { label: 'Full Name',    delay: 0,   w: '46%', x: '0%'   },
    { label: 'Email',        delay: 0.5, w: '46%', x: '54%'  },
    { label: 'Company',      delay: 1,   w: '100%', x: '0%'  },
  ]
  return (
    <div style={{ position: 'relative', background: '#fff', borderRadius: 12, overflow: 'hidden', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
      <div style={{ width: '85%', position: 'relative' }}>
        <div style={{ fontSize: 8, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontFamily: 'monospace' }}>Application Form</div>
        <div style={{ position: 'relative', height: 76 }}>
          {fields.map(({ label, delay, w, x }) => (
            <motion.div
              key={label}
              style={{ position: 'absolute', left: x, width: w }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay, duration: 0.4 }}
            >
              <div style={{ fontSize: 6.5, color: '#bbb', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <motion.div
                style={{ height: 22, borderRadius: 5, border: '1.5px solid' }}
                animate={{
                  borderColor: ['rgba(99,102,241,0.2)', 'rgba(99,102,241,0.85)', 'rgba(99,102,241,0.2)'],
                  background:  ['rgba(99,102,241,0)',   'rgba(99,102,241,0.05)', 'rgba(99,102,241,0)'],
                }}
                transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }}
              />
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
          <motion.div
            style={{ width: 14, height: 14, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <CheckCircle2 size={9} color="#fff" strokeWidth={2.5} />
          </motion.div>
          <span style={{ fontSize: 8, color: '#555', fontFamily: 'monospace' }}>3 fields detected</span>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: ScanLine,
    tag: 'OCR Engine',
    title: 'Reads any document',
    body: 'Proprietary OCR trained on millions of documents. Extracts text, tables and signatures from scanned or image-based PDFs instantly.',
    Micro: OCRMicro,
  },
  {
    icon: PenLine,
    tag: 'E-Signatures',
    title: 'Sign in seconds',
    body: 'Draw, type or upload your signature. Placed with pixel accuracy, rendered at full PDF resolution, legally binding everywhere.',
    Micro: SignatureMicro,
  },
  {
    icon: MousePointer2,
    tag: 'AI Detection',
    title: 'Fields find themselves',
    body: 'The AI scans your PDF, identifies every interactive field, maps them to your data and fills the form — no manual work required.',
    Micro: FieldsMicro,
  },
]

// ─── STATS ───────────────────────────────────────────────────────────────────
const STATS = [
  { val: '17',    unit: '',    label: 'AI-powered tools' },
  { val: '140',   unit: '+',   label: 'Languages supported' },
  { val: '99.9',  unit: '%',   label: 'Uptime SLA' },
  { val: '<10',   unit: 'ms',  label: 'Response time' },
]

// ─── SECTION WRAPPER (shared reveal) ────────────────────────────────────────
function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section
      id={id}
      style={{ padding: '108px 0', ...style }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 28px' }}>
        {children}
      </div>
    </section>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function HomeClient() {
  const FF = 'var(--font-inter, system-ui, sans-serif)'

  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: FF, overflowX: 'hidden' }}>
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 40, textAlign: 'center' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 28px' }}>

          {/* Eyebrow */}
          <motion.div {...fadeUp(0)} style={{ marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', border: '1px solid #e4e4e7', borderRadius: 99, fontSize: 12, color: '#666', letterSpacing: '0.01em', fontWeight: 500 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
              17 AI tools · Free forever
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1 {...fadeUp(0.07)} style={{ fontFamily: FF, fontSize: 'clamp(44px, 7vw, 72px)', fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 1, color: '#111', margin: '0 0 24px', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            The last PDF tool<br />you will ever need.
          </motion.h1>

          {/* Sub */}
          <motion.p {...fadeUp(0.14)} style={{ fontSize: 18, color: '#777', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 40px', fontWeight: 400, letterSpacing: '-0.01em' }}>
            Edit, sign, annotate and AI-fill PDF forms in seconds. No account. No credit card. Runs in your browser.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.2)} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
            <Link href="/ai-pdf-form-filler"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 22px', background: '#111', color: '#fff', borderRadius: 11, fontSize: 14, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.01em', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#333')}
              onMouseLeave={e => (e.currentTarget.style.background = '#111')}>
              Try AI Form Filler
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <a href="#tools"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 22px', background: '#fff', color: '#555', border: '1px solid #e4e4e7', borderRadius: 11, fontSize: 14, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.01em', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#fafafa'); (e.currentTarget.style.borderColor = '#ccc') }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#fff'); (e.currentTarget.style.borderColor = '#e4e4e7') }}>
              See all 17 tools
              <ChevronRight size={14} strokeWidth={1.8} />
            </a>
          </motion.div>

          {/* Browser mockup */}
          <BrowserMockup />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <Section id="features" style={{ borderTop: '1px solid #f0f0f0' }}>
        <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14, fontFamily: 'var(--font-mono, monospace)' }}>Built different</div>
          <h2 style={{ fontFamily: FF, fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 500, letterSpacing: '-0.04em', color: '#111', lineHeight: 1.06, margin: 0 }}>
            Every tool, rethought<br />from the ground up.
          </h2>
        </motion.div>

        {/* 3-column bento */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
          {FEATURES.map(({ icon: Icon, tag, title, body, Micro }, i) => (
            <motion.div
              key={tag}
              {...fadeUp(i * 0.08)}
              style={{ border: '1px solid #e4e4e7', borderRadius: 18, overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}
            >
              {/* Micro-animation area */}
              <div style={{ padding: '20px 20px 0' }}>
                <Micro />
              </div>

              {/* Text */}
              <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Icon size={14} strokeWidth={1.8} color="#888" />
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', fontFamily: 'var(--font-mono, monospace)' }}>{tag}</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 500, color: '#111', letterSpacing: '-0.025em', lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 13.5, color: '#777', lineHeight: 1.65, letterSpacing: '-0.005em' }}>{body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {STATS.map(({ val, unit, label }, i) => (
              <motion.div
                key={label}
                {...fadeUp(i * 0.07)}
                style={{ padding: '52px 28px', textAlign: 'center', borderRight: i < 3 ? '1px solid #f0f0f0' : 'none' }}
              >
                <div style={{ fontFamily: FF, fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 300, letterSpacing: '-0.055em', color: '#111', lineHeight: 1, marginBottom: 8 }}>
                  {val}<span style={{ fontSize: '0.5em', fontWeight: 400, color: '#aaa' }}>{unit}</span>
                </div>
                <div style={{ fontSize: 13, color: '#999', letterSpacing: '-0.01em' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOOLS ──────────────────────────────────────────────────────────── */}
      <Section id="tools">
        <motion.div {...fadeUp(0)} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>Tool registry</div>
            <h2 style={{ fontFamily: FF, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 500, letterSpacing: '-0.04em', color: '#111', lineHeight: 1.05, margin: 0 }}>
              17 tools.<br />One platform.
            </h2>
          </div>
          <Link href="/ai-pdf-form-filler" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#555', textDecoration: 'none', fontWeight: 500, letterSpacing: '-0.01em', borderBottom: '1px solid #e4e4e7', paddingBottom: 1 }}>
            Start free <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </motion.div>

        <motion.div {...fadeIn(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 0, border: '1px solid #e4e4e7', borderRadius: 14, overflow: 'hidden' }}>
          {TOOLS.map(({ name, tag, href }, i) => {
            const isLive = tag === 'LIVE' && !!href
            const Inner = (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', background: '#fff', cursor: isLive ? 'pointer' : 'default', transition: 'background 0.12s' }}
                onMouseEnter={e => isLive && ((e.currentTarget as HTMLElement).style.background = '#fafafa')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}>
                <div style={{ flex: 1, fontSize: 13.5, color: isLive ? '#111' : '#aaa', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1 }}>{name}</div>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.07em', padding: '2px 7px', borderRadius: 4, border: '1px solid', fontFamily: 'var(--font-mono, monospace)',
                  borderColor: tag === 'LIVE' ? 'rgba(16,185,129,0.3)' : tag === 'BETA' ? 'rgba(99,102,241,0.3)' : '#e4e4e7',
                  background:  tag === 'LIVE' ? 'rgba(16,185,129,0.06)' : tag === 'BETA' ? 'rgba(99,102,241,0.06)' : 'transparent',
                  color:       tag === 'LIVE' ? '#059669' : tag === 'BETA' ? '#6366f1' : '#ccc',
                }}>
                  {tag}
                </span>
              </div>
            )
            return isLive
              ? <Link key={name} href={href!} style={{ textDecoration: 'none', display: 'block' }}>{Inner}</Link>
              : <div key={name}>{Inner}</div>
          })}
        </motion.div>
      </Section>

      {/* ── WHY ─────────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #f0f0f0' }}>
        <Section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
            {[
              { icon: Shield, title: 'Zero-knowledge privacy', body: 'Your documents never touch our servers. All processing happens in your browser using WebAssembly.' },
              { icon: Zap,    title: 'Edge-native speed',       body: 'Sub-10ms AI responses powered by compiled WASM. No round trips. No queues. No waiting.' },
              { icon: Globe,  title: '140+ languages',          body: 'Full unicode support, RTL layouts, and character recognition trained on global document sets.' },
              { icon: Clock,  title: 'Always free',             body: 'Every tool, every feature, no account required. We will never put core functionality behind a paywall.' },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.07)}>
                <div style={{ width: 36, height: 36, border: '1px solid #e4e4e7', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={16} color="#555" strokeWidth={1.6} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#111', letterSpacing: '-0.02em', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13.5, color: '#888', lineHeight: 1.65, letterSpacing: '-0.005em' }}>{body}</div>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
        <Section>
          <motion.div {...fadeUp(0)} style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: FF, fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 500, letterSpacing: '-0.04em', color: '#111', lineHeight: 1.06, margin: '0 0 18px' }}>
              Start editing PDFs right now.
            </h2>
            <p style={{ fontSize: 17, color: '#888', margin: '0 0 36px', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              No account. No credit card. Open a PDF and go.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/ai-pdf-form-filler"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '13px 26px', background: '#111', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.01em', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#333')}
                onMouseLeave={e => (e.currentTarget.style.background = '#111')}>
                Open PDF Editor
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
              <Link href="/pdf-watermark"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '13px 26px', background: '#fff', color: '#555', border: '1px solid #e4e4e7', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.01em', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget.style.background = '#f5f5f5'); (e.currentTarget.style.borderColor = '#ccc') }}
                onMouseLeave={e => { (e.currentTarget.style.background = '#fff'); (e.currentTarget.style.borderColor = '#e4e4e7') }}>
                Try Watermarker
              </Link>
            </div>
          </motion.div>
        </Section>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '32px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 24, height: 24, background: '#111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={12} color="#fff" strokeWidth={2} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', fontFamily: FF }}>EditPDF AI</span>
          </Link>
          <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { l: 'AI Form Filler', h: '/ai-pdf-form-filler' },
              { l: 'PDF Editor',     h: '/pdf-editor' },
              { l: 'Watermarker',    h: '/pdf-watermark' },
              { l: 'All Tools',      h: '#tools' },
            ].map(({ l, h }) => (
              <Link key={l} href={h} style={{ fontSize: 13, color: '#aaa', textDecoration: 'none', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#111')}
                onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}>
                {l}
              </Link>
            ))}
          </nav>
          <span style={{ fontSize: 11, color: '#ccc', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} EDITPDF AI
          </span>
        </div>
      </footer>
    </div>
  )
}
