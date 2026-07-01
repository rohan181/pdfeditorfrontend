'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const FI   = { fontFamily: 'var(--font-inter, system-ui, sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono, monospace)' }
const RED  = '#E24B4A'
const EASE = [0.22, 1, 0.36, 1] as [number,number,number,number]

// Background crossfade — smooth overlap between scenes
function bgOp(i: number, p: number): number {
  const OV = 0.08, z = 0.25, s = i * z, e = s + z
  if (i === 0) { if (p >= e) return 0; if (p >= e - OV) return (e - p) / OV; return 1 }
  if (i === 3) { if (p < s - OV) return 0; if (p < s) return (p - s + OV) / OV; return 1 }
  if (p < s - OV || p >= e) return 0
  if (p < s) return (p - s + OV) / OV
  if (p >= e - OV) return (e - p) / OV
  return 1
}

// ─── Document card components ──────────────────────────────────────────────────
function ChromeBar({ dot }: { dot: string }) {
  return (
    <div style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,.07)', height: 30, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />)}
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ ...MONO, fontSize: 9, color: 'rgba(255,255,255,.3)', background: 'rgba(255,255,255,.05)', padding: '2px 10px', borderRadius: 4 }}>editpdfai.com</div>
      </div>
      <motion.div animate={{ scale: [1,1.5,1], opacity: [1,.3,1] }} transition={{ duration: 1.4, repeat: Infinity }}
        style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
    </div>
  )
}

function DocUpload() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
      <ChromeBar dot="#6366f1" />
      <div style={{ padding: '18px 16px 16px' }}>
        {[65,48,78,40].map((w,i) => <div key={i} style={{ height: 5, borderRadius: 99, background: `rgba(0,0,0,${.05+(i%2)*.02})`, width:`${w}%`, marginBottom: 6 }} />)}
        <div style={{ height: 1, background: '#f2f2f2', margin: '12px 0' }} />
        <motion.div
          animate={{ borderColor: ['rgba(99,102,241,.2)','rgba(99,102,241,.65)','rgba(99,102,241,.2)'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ border: '2px dashed rgba(99,102,241,.25)', borderRadius: 10, padding: '26px 14px', textAlign: 'center' }}
        >
          <motion.div animate={{ y: [0,-6,0], scale: [1,1.07,1] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 11px' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.7">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </motion.div>
          <div style={{ ...FI, fontSize: 13, fontWeight: 600, color: '#111', letterSpacing: '-0.02em', marginBottom: 4 }}>Drop your PDF here</div>
          <div style={{ ...FI, fontSize: 10.5, color: '#aaa', marginBottom: 14 }}>up to 100 MB · stays private</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 16px', background: '#6366f1', borderRadius: 99 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span style={{ ...FI, fontSize: 10.5, fontWeight: 600, color: '#fff' }}>Choose PDF File</span>
          </div>
        </motion.div>
        <div style={{ display: 'flex', gap: 5, marginTop: 12, justifyContent: 'center' }}>
          {['PDF','Up to 100 MB','Private'].map(t => <span key={t} style={{ ...MONO, fontSize: 8.5, color: '#ccc', background: '#f5f5f5', padding: '2px 7px', borderRadius: 99 }}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

function DocScan() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
      <ChromeBar dot="#a78bfa" />
      <div style={{ padding: '16px 16px 14px', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ top: ['-2%','106%'] }} transition={{ duration: 2.0, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
          style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(167,139,250,.9) 30%,rgba(216,180,254,1) 50%,rgba(167,139,250,.9) 70%,transparent)', boxShadow: '0 0 12px rgba(167,139,250,.7)', zIndex: 5, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ ...FI, fontSize: 9.5, fontWeight: 800, letterSpacing: '0.1em', color: '#111' }}>INVOICE #2025-089</div>
            <div style={{ fontSize: 8.5, color: '#bbb', marginTop: 1 }}>Acme Corp · NET 30</div>
          </div>
          <motion.div animate={{ opacity: [1,.3,1] }} transition={{ duration: 1.0, repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 7px', background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.22)', borderRadius: 99 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
            <span style={{ ...MONO, fontSize: 7, color: '#a78bfa', letterSpacing: '0.06em' }}>SCANNING</span>
          </motion.div>
        </div>
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 10 }} />
        {[['Bill To',0],['Amount',0.45],['Due Date',0.9],['PO #',1.35]].map(([l,d]) => (
          <div key={l as string} style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 7.5, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{l}</div>
            <motion.div animate={{ borderColor: ['rgba(167,139,250,.1)','rgba(167,139,250,.72)','rgba(167,139,250,.1)'], background: ['rgba(167,139,250,.01)','rgba(167,139,250,.06)','rgba(167,139,250,.01)'] }}
              transition={{ duration: 2.0, repeat: Infinity, delay: d as number, ease: 'easeInOut' }}
              style={{ height: 22, borderRadius: 5, border: '1.5px solid rgba(167,139,250,.1)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
              <motion.div animate={{ width: ['8%','65%','8%'] }} transition={{ duration: 2.0, repeat: Infinity, delay: d as number, ease: 'easeInOut' }}
                style={{ height: 4, borderRadius: 99, background: 'rgba(167,139,250,.28)' }} />
            </motion.div>
          </div>
        ))}
        <motion.div initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} transition={{ delay:.8 }}
          style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px', background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.18)', borderRadius: 7 }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style={{ ...FI, fontSize: 10, color: '#a78bfa', fontWeight: 500 }}>4 fields detected</span>
        </motion.div>
      </div>
    </div>
  )
}

function DocFill() {
  const fields = [
    { label: 'Bill To',    val: 'Acme Corporation', d1: '0.2s', d2: '0.4s', done: true  },
    { label: 'Amount Due', val: '$12,400.00',        d1: '0.8s', d2: '1.0s', done: true  },
    { label: 'Due Date',   val: 'Dec 30, 2025',      d1: '1.5s', d2: '1.7s', done: false },
    { label: 'PO Number',  val: 'PO-4521',           d1: '2.2s', d2: '2.4s', done: false },
  ]
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
      <ChromeBar dot={RED} />
      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ ...FI, fontSize: 9.5, fontWeight: 800, letterSpacing: '0.1em', color: '#111' }}>INVOICE #2025-089</div>
            <div style={{ fontSize: 8.5, color: '#bbb', marginTop: 1 }}>Acme Corp · NET 30</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 7px', background: `${RED}14`, border: `1px solid ${RED}30`, borderRadius: 99 }}>
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span style={{ ...MONO, fontSize: 7, color: RED, letterSpacing: '0.06em' }}>AI FILLING</span>
          </div>
        </div>
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 10 }} />
        {fields.map(({ label, val, d1, d2, done }) => (
          <div key={label} style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 7.5, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{label}</div>
            <div style={{ position: 'relative', height: 22, borderRadius: 5, border: `1.5px solid ${done ? 'rgba(34,197,94,.38)' : `${RED}55`}`, background: done ? 'rgba(34,197,94,.04)' : `${RED}07`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 7px', overflow: 'hidden' }}>
              <span style={{ ...FI, fontSize: 10, color: '#111', fontWeight: 500, animation: `fin .35s ${d1} both`, opacity: 0 }}>{val}</span>
              {done
                ? <span style={{ fontSize: 11, animation: `chk .35s ${d2} both`, opacity: 0, color: '#22c55e' }}>✓</span>
                : <motion.span animate={{ opacity: [1,0,1] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ fontSize: 12, color: RED }}>|</motion.span>
              }
            </div>
          </div>
        ))}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ flex: 1, height: 3, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div initial={{ width: '0%' }} animate={{ width: '50%' }} transition={{ duration: .8, delay: .4, ease: EASE }}
              style={{ height: '100%', background: '#22c55e', borderRadius: 99 }} />
          </div>
          <span style={{ ...MONO, fontSize: 8, color: '#aaa' }}>2/4</span>
        </div>
      </div>
    </div>
  )
}

function DocDone() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
      <ChromeBar dot="#22c55e" />
      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ ...FI, fontSize: 9.5, fontWeight: 800, letterSpacing: '0.1em', color: '#111' }}>INVOICE #2025-089</div>
            <div style={{ fontSize: 8.5, color: '#bbb', marginTop: 1 }}>Acme Corp · NET 30</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 7px', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 99 }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ ...MONO, fontSize: 7, color: '#22c55e', letterSpacing: '0.06em' }}>COMPLETE</span>
          </div>
        </div>
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 10 }} />
        {[['Bill To','Acme Corporation'],['Amount Due','$12,400.00'],['Due Date','Dec 30, 2025'],['PO Number','PO-4521']].map(([l,v]) => (
          <div key={l} style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 7.5, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{l}</div>
            <div style={{ height: 22, borderRadius: 5, border: '1.5px solid rgba(34,197,94,.35)', background: 'rgba(34,197,94,.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 7px' }}>
              <span style={{ ...FI, fontSize: 10, color: '#111', fontWeight: 500 }}>{v}</span>
              <span style={{ fontSize: 11, color: '#22c55e' }}>✓</span>
            </div>
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 7.5, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Signature</div>
          <div style={{ height: 30, border: '1px dashed #e4e4e7', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="110" height="20" viewBox="0 0 110 20" fill="none">
              <path d="M4 14 C11 4 18 17 27 11 C36 5 45 16 55 9 C64 3 73 14 82 8 C90 3 98 13 105 9"
                stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="340" style={{ animation: 'sigdraw 3s ease-in-out infinite' }}/>
            </svg>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
          style={{ height: 35, background: '#22c55e', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', boxShadow: '0 4px 16px rgba(34,197,94,.35)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span style={{ ...FI, fontSize: 11.5, color: '#fff', fontWeight: 700 }}>Download filled PDF</span>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Scene definitions ─────────────────────────────────────────────────────────
// Background approach: dark studio lighting — one soft colored light source per scene
// coming from a different angle, creating distinct atmosphere without floating blobs
const SCENES: Array<{
  id: number; tag: string; sublabel: string; headline: string; description: string
  bg: string[]            // stacked CSS background layers (bottom → top)
  accent: string
  cardGlow: string        // box-shadow glow color for the doc card
  Document: React.ComponentType
}> = [
  {
    id: 0, tag: '01', sublabel: 'Start Here', headline: 'Drop it in.',
    description: 'Upload most PDFs up to 100 MB. Opens instantly — no uploads, no waiting, fully private.',
    bg: [
      // 1. Solid black floor
      '#000',
      // 2. Overhead blue light source — like studio softbox from above
      'radial-gradient(ellipse 100% 55% at 50% -5%, rgba(14,165,233,0.22) 0%, rgba(56,189,248,0.08) 40%, transparent 70%)',
      // 3. Subtle blue fill from right wall
      'radial-gradient(ellipse 60% 80% at 105% 40%, rgba(99,102,241,0.12) 0%, transparent 55%)',
      // 4. Noise grain
      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
    ],
    accent: '#38bdf8', cardGlow: 'rgba(56,189,248,0.15)', Document: DocUpload,
  },
  {
    id: 1, tag: '02', sublabel: 'AI Detection', headline: 'AI reads it.',
    description: 'Every field found. Every data point mapped in milliseconds.',
    bg: [
      '#000',
      // Purple light from the right — rim lighting
      'radial-gradient(ellipse 65% 90% at 108% 35%, rgba(139,92,246,0.26) 0%, rgba(167,139,250,0.1) 40%, transparent 65%)',
      // Subtle purple ceiling fill
      'radial-gradient(ellipse 80% 45% at 25% -5%, rgba(109,40,217,0.14) 0%, transparent 60%)',
      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
    ],
    accent: '#a78bfa', cardGlow: 'rgba(167,139,250,0.15)', Document: DocScan,
  },
  {
    id: 2, tag: '03', sublabel: 'AI Filling', headline: 'Fills itself.',
    description: 'Your data flows in automatically. Accurate, instant, effortless.',
    bg: [
      '#000',
      // Warm red-orange light from below-left — like heat or fire
      'radial-gradient(ellipse 75% 60% at -5% 105%, rgba(220,38,38,0.28) 0%, rgba(239,68,68,0.1) 40%, transparent 65%)',
      // Orange accent from top-right
      'radial-gradient(ellipse 55% 45% at 105% -5%, rgba(251,146,60,0.16) 0%, transparent 55%)',
      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
    ],
    accent: '#f87171', cardGlow: 'rgba(239,68,68,0.15)', Document: DocFill,
  },
  {
    id: 3, tag: '04', sublabel: 'Download', headline: 'Done.',
    description: 'Filled, signed and ready. Download your completed document in one click.',
    bg: [
      '#000',
      // Teal light from the left — clean, resolved
      'radial-gradient(ellipse 65% 90% at -8% 40%, rgba(6,182,212,0.26) 0%, rgba(14,165,233,0.1) 40%, transparent 65%)',
      // Subtle teal ceiling
      'radial-gradient(ellipse 70% 40% at 70% -5%, rgba(2,132,199,0.12) 0%, transparent 55%)',
      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
    ],
    accent: '#22d3ee', cardGlow: 'rgba(6,182,212,0.15)', Document: DocDone,
  },
]

// ─── Animation variants ────────────────────────────────────────────────────────
// Card: elegant lift + fade — no flying in from sides
const cardV = {
  initial: { scale: 0.93, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0,
    transition: { duration: 0.6, ease: EASE } },
  exit:    { scale: 0.97, opacity: 0, y: -14,
    transition: { duration: 0.22, ease: [0.4,0,1,1] as [number,number,number,number] } },
}
// Text block: slide up together
const textV = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0,
    transition: { duration: 0.55, ease: EASE, delay: 0.1 } },
  exit:    { opacity: 0, y: -18,
    transition: { duration: 0.2, ease: [0.4,0,1,1] as [number,number,number,number] } },
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ImageSequence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [active,   setActive]   = useState(0)
  const [inZone,   setInZone]   = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const prevActive = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const el = containerRef.current
      if (!el) return
      const rect     = el.getBoundingClientRect()
      const scrolled = -rect.top
      const total    = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const p = Math.max(0, Math.min(1, scrolled / total))
      setProgress(p)
      setInZone(scrolled >= 0 && scrolled <= total)
      const next = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3
      if (next !== prevActive.current) { setActive(next); prevActive.current = next }
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) }
    window.addEventListener('scroll', onScroll, { passive: true })
    tick()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const scene = SCENES[active]
  const Doc   = scene.Document

  const canvas = (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 50, overflow: 'hidden', background: '#000', opacity: inZone ? 1 : 0, pointerEvents: inZone ? 'auto' : 'none' }}>

      {/* ── BACKGROUND: scroll-driven crossfade, studio lighting ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {SCENES.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: bgOp(i, progress), willChange: 'opacity', transition: 'opacity 0.05s linear' }}>
            {s.bg.map((layer, li) => (
              <div key={li} style={{ position: 'absolute', inset: 0, background: layer, backgroundSize: 'cover' }} />
            ))}
            {/* Pulsing breath on the main light source */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0, background: s.bg[1], backgroundSize: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* ── DOCUMENT: centred, elegant fade+lift ── */}
      <div style={{ position: 'absolute', left: '50%', top: '9%', transform: 'translateX(-50%)', width: 'min(400px, 88vw)', zIndex: 6 }}>
        <AnimatePresence mode="wait">
          <motion.div key={active} variants={cardV} initial="initial" animate="animate" exit="exit">
            {/* Coloured glow behind the card */}
            <div style={{ position: 'absolute', inset: -40, borderRadius: 50, background: scene.cardGlow, filter: 'blur(50px)', zIndex: -1 }} />
            <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 50px 120px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.07)' }}>
              <Doc />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── TEXT: bottom-left, smooth fade-up ── */}
      <div style={{ position: 'absolute', bottom: 'clamp(44px,5vh,68px)', left: 'clamp(28px,6vw,72px)', zIndex: 10, maxWidth: 'min(520px,52vw)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={active} variants={textV} initial="initial" animate="animate" exit="exit">
            {/* Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <span style={{ ...MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: scene.accent }}>{scene.tag}</span>
              <span style={{ width: 22, height: 1, background: scene.accent, opacity: 0.45, display: 'inline-block' }} />
              <span style={{ ...MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.32)' }}>{scene.sublabel}</span>
            </div>
            {/* Headline */}
            <h2 style={{ ...FI, fontSize: 'clamp(52px,7.2vw,104px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.055em', lineHeight: 0.92, margin: '0 0 18px', WebkitFontSmoothing: 'antialiased' }}>
              {scene.headline}
            </h2>
            {/* Description */}
            <p style={{ ...FI, fontSize: 'clamp(14px,1.3vw,17px)', color: 'rgba(255,255,255,.44)', lineHeight: 1.72, margin: 0, letterSpacing: '-0.005em', WebkitFontSmoothing: 'antialiased' }}>
              {scene.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CHROME ── */}

      {/* Section label */}
      <div style={{ position: 'absolute', top: 22, left: 'clamp(28px,6vw,72px)', display: 'flex', alignItems: 'center', gap: 9, zIndex: 20 }}>
        <span style={{ ...MONO, fontSize: 9.5, color: 'rgba(255,255,255,.18)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>How it works</span>
        <span style={{ width: 12, height: 1, background: 'rgba(255,255,255,.1)', display: 'inline-block' }} />
        <AnimatePresence mode="wait">
          <motion.span key={active} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-5 }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{ ...MONO, fontSize: 9.5, color: scene.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {scene.sublabel}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Scroll hint */}
      <motion.div animate={{ opacity: active === 0 && progress < 0.06 ? 1 : 0 }} transition={{ duration: 0.4 }}
        style={{ position: 'absolute', top: 22, right: 'clamp(28px,6vw,72px)', display: 'flex', alignItems: 'center', gap: 7, zIndex: 20, pointerEvents: 'none' }}>
        <motion.div animate={{ y: [0,5,0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="13" height="19" viewBox="0 0 14 20" fill="none">
            <rect x=".75" y=".75" width="12.5" height="18.5" rx="6.25" stroke="rgba(255,255,255,.22)" strokeWidth="1.5"/>
            <motion.rect x="5.5" y="4.5" width="3" height="4" rx="1.5" fill="rgba(255,255,255,.35)"
              animate={{ y:[0,6,0], opacity:[1,.15,1] }} transition={{ duration:1.4, repeat:Infinity, ease:'easeInOut' }}/>
          </svg>
        </motion.div>
        <span style={{ ...MONO, fontSize: 9.5, color: 'rgba(255,255,255,.28)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
      </motion.div>

      {/* Progress pills */}
      <div style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 20 }}>
        {SCENES.map((s, i) => (
          <motion.div key={i}
            animate={{ height: i === active ? 26 : 6, background: i === active ? s.accent : 'rgba(255,255,255,.18)', opacity: i === active ? 1 : 0.35 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ width: 2, borderRadius: 99 }} />
        ))}
      </div>

      {/* Bottom progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 20, background: 'rgba(255,255,255,.05)' }}>
        <motion.div style={{ height: '100%', background: scene.accent }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.06, ease: 'linear' }} />
      </div>
    </div>
  )

  return (
    <>
      <div ref={containerRef} style={{ height: '400vh', background: '#000' }} />
      {mounted && createPortal(canvas, document.body)}
    </>
  )
}
