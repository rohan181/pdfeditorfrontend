'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const TOOLS = [
  {
    id: 'pdf-editor',
    name: 'AI PDF Editor',
    description: 'Edit, annotate, sign & AI-fill PDF forms with Claude',
    icon: '⬡',
    color: '#00d4ff',
    glow: '0 0 32px rgba(0,212,255,0.5)',
    tag: 'LIVE',
    href: '/editor',
  },
  { id: 'code-forge',    name: 'Neural Code Forge',      description: 'AI-powered code generation & intelligent refactoring',  icon: '◈', color: '#a855f7', glow: '0 0 28px rgba(168,85,247,0.4)',  tag: 'SOON' },
  { id: 'quantum-sheet', name: 'Quantum Spreadsheet',    description: 'Predictive data modelling at quantum speed',             icon: '◫', color: '#f59e0b', glow: '0 0 28px rgba(245,158,11,0.4)',  tag: 'SOON' },
  { id: 'ocr-engine',    name: 'Vision OCR Engine',      description: 'Extract structured text from any image or document',     icon: '◉', color: '#10b981', glow: '0 0 28px rgba(16,185,129,0.4)', tag: 'SOON' },
  { id: 'autosign',      name: 'AutoSign Pro',           description: 'Biometric e-signature & contract workflow automation',   icon: '◍', color: '#ec4899', glow: '0 0 28px rgba(236,72,153,0.4)', tag: 'SOON' },
  { id: 'translate',     name: 'SmartTranslate AI',      description: 'Real-time document translation in 140+ languages',       icon: '◌', color: '#06b6d4', glow: '0 0 28px rgba(6,182,212,0.4)',  tag: 'SOON' },
  { id: 'vector-art',    name: 'Vector Art Studio',      description: 'Generative vector graphics & precision SVG editing',     icon: '◎', color: '#f97316', glow: '0 0 28px rgba(249,115,22,0.4)', tag: 'SOON' },
  { id: 'datavault',     name: 'DataVault Secure',       description: 'Zero-knowledge encrypted file storage & sharing',        icon: '⬟', color: '#84cc16', glow: '0 0 28px rgba(132,204,22,0.4)', tag: 'BETA' },
  { id: 'schema-ai',     name: 'Schema Builder AI',      description: 'Generate DB schemas from natural language descriptions',  icon: '⬠', color: '#8b5cf6', glow: '0 0 28px rgba(139,92,246,0.4)', tag: 'BETA' },
  { id: 'contract-ai',   name: 'ContractAI',             description: 'Intelligent contract analysis & legal risk scoring',      icon: '◆', color: '#ef4444', glow: '0 0 28px rgba(239,68,68,0.4)',  tag: 'SOON' },
  { id: 'form-wizard',   name: 'FormWizard Pro',         description: 'Drag-and-drop form builder with AI-powered validation',  icon: '▣', color: '#14b8a6', glow: '0 0 28px rgba(20,184,166,0.4)', tag: 'BETA' },
  { id: 'imagegen',      name: 'ImageGen Studio',        description: 'Text-to-image generation & neural photo enhancement',    icon: '◧', color: '#d946ef', glow: '0 0 28px rgba(217,70,239,0.4)', tag: 'SOON' },
  { id: 'api-gateway',   name: 'API Gateway Pro',        description: 'Visual API design, live testing & traffic monitoring',   icon: '◐', color: '#60a5fa', glow: '0 0 28px rgba(96,165,250,0.4)', tag: 'SOON' },
  { id: 'chronosync',    name: 'ChronoSync',             description: 'AI-driven workflow automation & smart scheduling',       icon: '◑', color: '#fb923c', glow: '0 0 28px rgba(251,146,60,0.4)', tag: 'SOON' },
  { id: 'nexussearch',   name: 'NexusSearch',            description: 'Semantic vector search across all your documents',       icon: '◒', color: '#a3e635', glow: '0 0 28px rgba(163,230,53,0.4)', tag: 'SOON' },
  { id: 'datastream',    name: 'DataStream Analytics',   description: 'Real-time dashboard builder & BI reporting suite',       icon: '◓', color: '#38bdf8', glow: '0 0 28px rgba(56,189,248,0.4)',  tag: 'SOON' },
]

export default function HomePage() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [particles] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.35 + 0.08,
      speed: Math.random() * 10 + 7,
      delay: Math.random() * 8,
    }))
  )
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#060609', fontFamily: "'Manrope','Inter',sans-serif", overflowX: 'hidden', position: 'relative' }}>

      {/* Cursor ambient glow */}
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 0,
        left: mousePos.x - 320, top: mousePos.y - 320,
        width: 640, height: 640, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.055) 0%, transparent 68%)',
        transition: 'left 0.12s ease, top 0.12s ease',
      }} />

      {/* Grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(rgba(0,212,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.035) 1px,transparent 1px)`,
        backgroundSize: '56px 56px',
      }} />

      {/* Radial vignette */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 70%)',
      }} />

      {/* Particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: `${p.x}%`, top: '105%',
            width: p.size, height: p.size, borderRadius: '50%',
            background: `rgba(0,212,255,${p.opacity})`,
            animation: `floatUp ${p.speed}s linear ${p.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Top scan line */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 1.5, zIndex: 10,
        background: 'linear-gradient(90deg,transparent 0%,#00d4ff 30%,#a855f7 50%,#00d4ff 70%,transparent 100%)',
        animation: 'scanPulse 3.5s ease-in-out infinite',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto', padding: '0 24px 100px' }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <header ref={heroRef} style={{ textAlign: 'center', padding: '76px 0 56px' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
            padding: '6px 18px', borderRadius: 100,
            border: '1px solid rgba(0,212,255,0.28)',
            background: 'rgba(0,212,255,0.07)',
            backdropFilter: 'blur(8px)',
            fontSize: 10.5, fontWeight: 800, letterSpacing: '0.18em', color: '#00d4ff', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', display: 'inline-block', animation: 'blink 2s ease-in-out infinite' }} />
            AI-Powered Suite · 16 Tools
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6.5vw, 80px)', fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 1.04, margin: '0 0 22px',
            background: 'linear-gradient(150deg, #ffffff 0%, #94a3b8 45%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            The Future of<br />Digital Productivity
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.75 }}>
            One platform. Infinite intelligence.<br />Every tool you need — powered by next-gen AI.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 16, flexWrap: 'wrap' }}>
            {[['16', 'AI Tools'], ['∞', 'Possibilities'], ['99.9%', 'Uptime'], ['<10ms', 'Response']].map(([val, label], i, arr) => (
              <div key={label} style={{
                padding: '16px 32px',
                borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* ── Section label ─────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>All Tools</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
        </div>

        {/* ── Tool grid ─────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 14,
        }}>
          {TOOLS.map(tool => {
            const isHov  = hovered === tool.id
            const isLive = tool.tag === 'LIVE'
            const isBeta = tool.tag === 'BETA'
            return (
              <div
                key={tool.id}
                onMouseEnter={() => setHovered(tool.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { if (tool.href) router.push(tool.href) }}
                style={{
                  position: 'relative',
                  padding: '22px 22px 20px',
                  borderRadius: 14,
                  border: `1px solid ${isHov ? tool.color + '55' : isLive ? tool.color + '35' : 'rgba(255,255,255,0.06)'}`,
                  background: isHov
                    ? `linear-gradient(140deg,rgba(10,10,18,0.95),${tool.color}16)`
                    : isLive
                    ? `linear-gradient(140deg,rgba(8,8,15,0.9),${tool.color}0b)`
                    : 'rgba(255,255,255,0.026)',
                  cursor: isLive ? 'pointer' : 'default',
                  transition: 'all 0.22s ease',
                  boxShadow: isHov ? tool.glow : isLive ? tool.glow.replace('0.5','0.2') : 'none',
                  transform: isHov && isLive ? 'translateY(-5px) scale(1.012)' : 'none',
                  backdropFilter: 'blur(4px)',
                  overflow: 'hidden',
                }}
              >
                {/* Top shimmer */}
                {(isHov || isLive) && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
                    background: `linear-gradient(90deg,transparent,${tool.color},transparent)`,
                  }} />
                )}

                {/* Tag badge */}
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em',
                  padding: '3px 8px', borderRadius: 5,
                  background: isLive ? tool.color + '20' : isBeta ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isLive ? tool.color + '45' : isBeta ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: isLive ? tool.color : isBeta ? '#a855f7' : 'rgba(255,255,255,0.25)',
                }}>
                  {isLive && <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: tool.color, marginRight: 5, animation: 'blink 2s ease-in-out infinite', verticalAlign: 'middle' }} />}
                  {tool.tag}
                </div>

                {/* Icon */}
                <div style={{
                  fontSize: 26, marginBottom: 13, lineHeight: 1,
                  color: isHov || isLive ? tool.color : 'rgba(255,255,255,0.18)',
                  transition: 'all 0.22s ease',
                  filter: isHov ? `drop-shadow(0 0 10px ${tool.color})` : 'none',
                }}>
                  {tool.icon}
                </div>

                {/* Name */}
                <div style={{
                  fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em',
                  color: isHov || isLive ? '#fff' : 'rgba(255,255,255,0.5)',
                  marginBottom: 7, transition: 'color 0.2s',
                }}>
                  {tool.name}
                </div>

                {/* Description */}
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.65 }}>
                  {tool.description}
                </div>

                {/* CTA */}
                {isLive && (
                  <div style={{
                    marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
                    color: tool.color, textTransform: 'uppercase',
                  }}>
                    Launch
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 88, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
            Powered by Claude AI · Built for the future
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow: auto !important; }
        @keyframes floatUp {
          0%   { transform: translateY(0);     opacity: 0; }
          8%   { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        @keyframes scanPulse {
          0%,100% { opacity: 0.35; }
          50%      { opacity: 0.9; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #060609; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.25); border-radius: 3px; }
      `}</style>
    </div>
  )
}
