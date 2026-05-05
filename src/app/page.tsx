import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'NexusAI — AI-Powered Productivity Suite | PDF Editor & 16 Intelligent Tools',
  description: 'Edit, sign and AI-fill PDFs, generate code, translate documents and automate workflows. 16 AI-powered tools built for professionals who move fast.',
  keywords: 'AI PDF editor, PDF form filler, AI tools, document editor, sign PDF online, AI productivity suite',
  authors: [{ name: 'NexusAI' }],
  robots: 'index, follow',
  openGraph: {
    title: 'NexusAI — AI-Powered Productivity Suite',
    description: 'Edit PDFs, sign documents, translate files and automate workflows — powered by next-generation AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusAI — AI-Powered Productivity Suite',
    description: 'Edit PDFs, sign documents, translate files and automate workflows with AI.',
  },
}

const TOOLS = [
  {
    id: 'pdf-editor', name: 'AI PDF Editor', tag: 'LIVE', href: '/editor',
    category: 'Documents', accent: '#818cf8',
    description: 'Edit, annotate, sign and AI-fill PDF forms with Claude. Intelligent field detection and instant form completion.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  },
  {
    id: 'code-forge', name: 'Neural Code Forge', tag: 'SOON', category: 'Dev', accent: '#a78bfa',
    description: 'AI-powered code generation, refactoring and intelligent review across 40+ languages.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  },
  {
    id: 'quantum-sheet', name: 'Quantum Spreadsheet', tag: 'SOON', category: 'Data', accent: '#22d3ee',
    description: 'Predictive data modelling, AI formula suggestions and real-time collaboration at enterprise scale.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`,
  },
  {
    id: 'ocr-engine', name: 'Vision OCR Engine', tag: 'SOON', category: 'Documents', accent: '#34d399',
    description: 'Extract structured text, tables and data from any image, scanned document or photo instantly.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1 1l22 22M9 9a3 3 0 000 6 3 3 0 004.35-.87M16.8 16.8A9 9 0 013.2 3.2M21 12a9 9 0 01-9 9"/></svg>`,
  },
  {
    id: 'autosign', name: 'AutoSign Pro', tag: 'SOON', category: 'Security', accent: '#f472b6',
    description: 'Biometric e-signature workflows, certificate management and legally-binding digital contracts.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 19l7-7-3-3-7 7v3h3z"/><path d="M18 13l1.5-1.5a2.12 2.12 0 000-3L18 7"/></svg>`,
  },
  {
    id: 'translate', name: 'SmartTranslate AI', tag: 'SOON', category: 'Language', accent: '#38bdf8',
    description: 'Real-time document translation preserving layout and formatting across 140+ languages.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>`,
  },
  {
    id: 'vector-art', name: 'Vector Art Studio', tag: 'SOON', category: 'Design', accent: '#fb923c',
    description: 'Generative vector graphics, logo creation and precision SVG editing with AI design assistance.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><circle cx="8.5" cy="15.5" r="2.5"/><line x1="13.5" y1="9" x2="17.5" y2="13"/><line x1="11" y1="15.5" x2="15" y2="15.5"/><line x1="10.5" y1="13.5" x2="8.5" y2="13"/></svg>`,
  },
  {
    id: 'datavault', name: 'DataVault Secure', tag: 'BETA', category: 'Security', accent: '#4ade80',
    description: 'Zero-knowledge encrypted file storage, secure sharing and compliance-ready document management.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  },
  {
    id: 'schema-ai', name: 'Schema Builder AI', tag: 'BETA', category: 'Dev', accent: '#c084fc',
    description: 'Generate database schemas, ERDs and migration scripts from plain English descriptions.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  },
  {
    id: 'contract-ai', name: 'ContractAI', tag: 'SOON', category: 'Legal', accent: '#f87171',
    description: 'Intelligent contract analysis, clause extraction, risk scoring and legal summarisation.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg>`,
  },
  {
    id: 'form-wizard', name: 'FormWizard Pro', tag: 'BETA', category: 'Forms', accent: '#2dd4bf',
    description: 'Drag-and-drop form builder with AI-powered field validation and smart submission routing.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
  },
  {
    id: 'imagegen', name: 'ImageGen Studio', tag: 'SOON', category: 'Design', accent: '#e879f9',
    description: 'Text-to-image generation, neural photo enhancement and batch image processing pipelines.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  },
  {
    id: 'api-gateway', name: 'API Gateway Pro', tag: 'SOON', category: 'Dev', accent: '#60a5fa',
    description: 'Visual API design, live request testing, rate limiting and real-time traffic monitoring.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  },
  {
    id: 'chronosync', name: 'ChronoSync', tag: 'SOON', category: 'Automation', accent: '#fbbf24',
    description: 'AI-driven workflow automation, smart scheduling and cross-tool process orchestration.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    id: 'nexussearch', name: 'NexusSearch', tag: 'SOON', category: 'Search', accent: '#a3e635',
    description: 'Semantic vector search across all your documents, emails and notes with natural language queries.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  },
  {
    id: 'datastream', name: 'DataStream Analytics', tag: 'SOON', category: 'Analytics', accent: '#67e8f9',
    description: 'Real-time BI dashboards, automated reporting and predictive analytics with AI-generated insights.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'NexusAI',
  description: 'AI-powered productivity suite with PDF editing, code generation, document translation and 16 intelligent tools.',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="p-root">

        {/* ── Background ──────────────────────────────────────── */}
        <div className="p-bg" aria-hidden="true">
          <div className="p-bg-orb p-bg-orb1" />
          <div className="p-bg-orb p-bg-orb2" />
          <div className="p-bg-orb p-bg-orb3" />
          <div className="p-bg-grid" />
          <div className="p-bg-noise" />
        </div>

        {/* ── Nav ─────────────────────────────────────────────── */}
        <nav className="p-nav" aria-label="Main navigation">
          <div className="p-nav-inner">
            <span className="p-logo">
              <span className="p-logo-mark" aria-hidden="true">N</span>
              <span className="p-logo-text">NexusAI</span>
            </span>
            <div className="p-nav-right">
              <div className="p-nav-links">
                <a href="#tools">Tools</a>
                <a href="#features">Features</a>
              </div>
              <Link href="/editor" className="p-nav-cta">
                Open PDF Editor
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </nav>

        <main>
          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="p-hero" aria-labelledby="hero-heading">
            <div className="p-hero-eyebrow">
              <span className="p-dot" />
              Powered by Claude AI · 16 Intelligent Tools
            </div>

            <h1 id="hero-heading" className="p-h1">
              <span className="p-h1-line1">The Future of</span>
              <span className="p-h1-line2">Digital&nbsp;Work</span>
            </h1>

            <p className="p-hero-sub">
              One platform. Infinite intelligence.<br />
              Every AI tool you need — built for professionals who move fast.
            </p>

            <div className="p-hero-ctas">
              <Link href="/editor" className="p-cta-primary">
                <span className="p-cta-bg" aria-hidden="true" />
                <span className="p-cta-label">
                  Open AI PDF Editor — Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </Link>
              <a href="#tools" className="p-cta-ghost">Browse All 16 Tools</a>
            </div>

            <dl className="p-stats">
              {([['16', 'AI Tools'], ['140+', 'Languages'], ['99.9%', 'Uptime'], ['<10ms', 'Response']] as const).map(([val, label]) => (
                <div key={label} className="p-stat">
                  <dt className="p-stat-label">{label}</dt>
                  <dd className="p-stat-val">{val}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Tool grid ────────────────────────────────────── */}
          <section id="tools" className="p-tools" aria-labelledby="tools-heading">
            <div className="p-wrap">
              <header className="p-section-head">
                <div className="p-section-eyebrow">
                  <span className="p-line" aria-hidden="true" />
                  All Tools
                  <span className="p-line" aria-hidden="true" />
                </div>
                <h2 id="tools-heading" className="p-h2">Everything you need, powered by AI</h2>
                <p className="p-section-sub">Click any live tool to get started instantly. More launching soon.</p>
              </header>

              <ul className="p-grid" role="list">
                {TOOLS.map(tool => {
                  const isLive = tool.tag === 'LIVE'
                  const isBeta = tool.tag === 'BETA'
                  return (
                    <li key={tool.id} role="listitem">
                      {isLive ? (
                        <Link href={tool.href!} className="p-card p-card--live" style={{ '--c': tool.accent } as React.CSSProperties} aria-label={`${tool.name} — Live`}>
                          <span className="p-card-shine" aria-hidden="true" />
                          <span className="p-card-top">
                            <span className="p-card-icon" dangerouslySetInnerHTML={{ __html: tool.icon }} aria-hidden="true" />
                            <span className="p-tag p-tag--live"><span className="p-tag-dot" />LIVE</span>
                          </span>
                          <span className="p-card-name">{tool.name}</span>
                          <span className="p-card-desc">{tool.description}</span>
                          <span className="p-card-footer">
                            <span className="p-card-cat">{tool.category}</span>
                            <span className="p-card-arrow" aria-hidden="true">
                              Launch
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </span>
                          </span>
                        </Link>
                      ) : (
                        <div className={`p-card${isBeta ? ' p-card--beta' : ''}`} style={{ '--c': tool.accent } as React.CSSProperties} aria-label={`${tool.name} — ${tool.tag}`}>
                          <span className="p-card-top">
                            <span className="p-card-icon" dangerouslySetInnerHTML={{ __html: tool.icon }} aria-hidden="true" />
                            <span className={`p-tag p-tag--${tool.tag.toLowerCase()}`}>{isBeta && <span className="p-tag-dot" />}{tool.tag}</span>
                          </span>
                          <span className="p-card-name">{tool.name}</span>
                          <span className="p-card-desc">{tool.description}</span>
                          <span className="p-card-footer">
                            <span className="p-card-cat">{tool.category}</span>
                          </span>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          {/* ── Features ─────────────────────────────────────── */}
          <section id="features" className="p-features" aria-labelledby="features-heading">
            <div className="p-wrap p-features-inner">
              <div className="p-features-copy">
                <div className="p-section-eyebrow" style={{ justifyContent: 'flex-start' }}>
                  <span className="p-dot" />Built Different
                </div>
                <h2 id="features-heading" className="p-h2" style={{ textAlign: 'left', marginTop: 16 }}>
                  Enterprise power.<br />Zero friction.
                </h2>
                <p className="p-section-sub" style={{ textAlign: 'left', marginTop: 16 }}>
                  NexusAI combines military-grade security with cutting-edge AI to deliver a productivity suite that keeps pace with your ambition.
                </p>
                <Link href="/editor" className="p-cta-primary" style={{ marginTop: 32, display: 'inline-flex', width: 'fit-content' }}>
                  <span className="p-cta-bg" aria-hidden="true" />
                  <span className="p-cta-label">
                    Start Free — No signup needed
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </Link>
              </div>
              <ul className="p-feat-list" role="list">
                {([
                  ['⚡', 'Lightning Fast', 'Sub-10ms responses. Optimised at every layer of the stack.'],
                  ['🔒', 'Zero-Knowledge Secure', 'Your data never leaves your control. End-to-end encrypted.'],
                  ['🧠', 'Claude AI Core', "Backed by Anthropic's Claude — the world's most capable document AI."],
                  ['🌍', 'Global Infrastructure', '140+ languages, 99.9% uptime SLA, multi-region deployments.'],
                ] as const).map(([icon, title, desc]) => (
                  <li key={title} className="p-feat" role="listitem">
                    <span className="p-feat-icon" aria-hidden="true">{icon}</span>
                    <span>
                      <span className="p-feat-title">{title}</span>
                      <span className="p-feat-desc">{desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="p-footer" role="contentinfo">
          <div className="p-wrap p-footer-inner">
            <span className="p-logo">
              <span className="p-logo-mark" aria-hidden="true" style={{ width: 22, height: 22, fontSize: 11 }}>N</span>
              <span className="p-logo-text" style={{ fontSize: 15 }}>NexusAI</span>
            </span>
            <nav aria-label="Footer navigation" className="p-footer-links">
              <Link href="/editor">AI PDF Editor</Link>
              <a href="#tools">All Tools</a>
              <a href="#features">About</a>
            </nav>
            <p className="p-footer-copy">
              Powered by <a href="https://anthropic.com" rel="noopener noreferrer" target="_blank">Claude AI</a> · © {new Date().getFullYear()} NexusAI
            </p>
          </div>
        </footer>
      </div>

      {/* ─────────── Styles ─────────────────────────────────── */}
      <style>{`
        /* ── Reset ──────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        html, body { overflow: auto !important; background: #07070f; }

        /* ── Root ───────────────────────────────────────── */
        .p-root {
          min-height: 100vh;
          background: #07070f;
          color: #e2e8f0;
          font-family: var(--font-space, 'Space Grotesk', system-ui, sans-serif);
          position: relative;
          overflow-x: hidden;
        }

        /* ── Background ─────────────────────────────────── */
        .p-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .p-bg-orb {
          position: absolute; border-radius: 50%;
          filter: blur(120px); opacity: 0.18;
        }
        .p-bg-orb1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, #6366f1, transparent 70%);
          top: -200px; left: -150px;
          animation: orb-drift 18s ease-in-out infinite alternate;
        }
        .p-bg-orb2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #06b6d4, transparent 70%);
          top: 10%; right: -100px;
          animation: orb-drift 22s ease-in-out infinite alternate-reverse;
        }
        .p-bg-orb3 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #8b5cf6, transparent 70%);
          bottom: 10%; left: 30%;
          animation: orb-drift 26s ease-in-out infinite alternate;
        }
        .p-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .p-bg-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        /* ── Nav ─────────────────────────────────────────── */
        .p-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(7,7,15,0.75);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .p-nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 28px; height: 62px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .p-nav-right { display: flex; align-items: center; gap: 32px; }
        .p-nav-links { display: flex; gap: 28px; }
        .p-nav-links a {
          font-size: 13.5px; font-weight: 500;
          color: rgba(226,232,240,0.5);
          text-decoration: none;
          transition: color 0.15s;
          letter-spacing: 0.01em;
        }
        .p-nav-links a:hover { color: #e2e8f0; }
        .p-nav-cta {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 18px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.4);
          border-radius: 8px;
          font-size: 13px; font-weight: 600;
          color: #a5b4fc; text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          letter-spacing: 0.01em;
        }
        .p-nav-cta:hover {
          background: rgba(99,102,241,0.28);
          border-color: rgba(99,102,241,0.7);
          color: #c7d2fe;
        }

        /* ── Logo ─────────────────────────────────────────── */
        .p-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .p-logo-mark {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-syne, 'Syne', sans-serif);
          font-size: 15px; font-weight: 800; color: #fff;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }
        .p-logo-text {
          font-family: var(--font-syne, 'Syne', sans-serif);
          font-size: 18px; font-weight: 800;
          color: #f1f5f9; letter-spacing: -0.02em;
        }

        /* ── Hero ─────────────────────────────────────────── */
        .p-hero {
          position: relative; z-index: 1;
          padding: 120px 28px 100px;
          text-align: center;
          max-width: 900px; margin: 0 auto;
        }
        .p-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 7px 18px; border-radius: 100px;
          border: 1px solid rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.08);
          font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
          color: #a5b4fc; text-transform: uppercase; margin-bottom: 32px;
        }
        .p-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #818cf8; flex-shrink: 0;
          animation: blink 2.4s ease-in-out infinite;
        }

        /* ── Heading ──────────────────────────────────────── */
        .p-h1 {
          display: flex; flex-direction: column; align-items: center;
          font-family: var(--font-syne, 'Syne', sans-serif);
          font-weight: 800; letter-spacing: -0.04em; line-height: 1.0;
          margin-bottom: 24px;
        }
        .p-h1-line1 {
          font-size: clamp(42px, 6vw, 76px);
          color: rgba(226,232,240,0.75);
          display: block;
        }
        .p-h1-line2 {
          font-size: clamp(52px, 8vw, 96px);
          display: block;
          background: linear-gradient(100deg, #a5b4fc 0%, #818cf8 25%, #22d3ee 55%, #6366f1 80%, #a5b4fc 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shimmer 5s linear infinite;
        }
        .p-h2 {
          font-family: var(--font-syne, 'Syne', sans-serif);
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 800; letter-spacing: -0.03em;
          color: #f1f5f9; text-align: center;
        }

        /* ── Hero sub ─────────────────────────────────────── */
        .p-hero-sub {
          font-size: 17px; line-height: 1.75;
          color: rgba(226,232,240,0.45);
          margin-bottom: 44px;
          letter-spacing: 0.01em;
        }

        /* ── CTAs ─────────────────────────────────────────── */
        .p-hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 64px; }
        .p-cta-primary {
          position: relative; display: inline-flex;
          border-radius: 12px; text-decoration: none;
          isolation: isolate; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.5), 0 4px 24px rgba(99,102,241,0.3);
        }
        .p-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.8), 0 8px 32px rgba(99,102,241,0.45);
        }
        .p-cta-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #6366f1, #818cf8, #6366f1);
          background-size: 200% 100%;
          animation: btn-shimmer 3s linear infinite;
        }
        .p-cta-label {
          position: relative; z-index: 1;
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 28px;
          font-size: 14.5px; font-weight: 700; color: #fff;
          letter-spacing: 0.01em;
        }
        .p-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 24px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 14px; font-weight: 600;
          color: rgba(226,232,240,0.55); text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          letter-spacing: 0.01em;
        }
        .p-cta-ghost:hover {
          border-color: rgba(255,255,255,0.2);
          color: #e2e8f0;
          background: rgba(255,255,255,0.04);
        }

        /* ── Stats ────────────────────────────────────────── */
        .p-stats {
          display: flex; justify-content: center;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(12px);
          overflow: hidden;
          max-width: 560px; margin: 0 auto;
        }
        .p-stat {
          flex: 1; padding: 20px 20px;
          border-right: 1px solid rgba(255,255,255,0.06);
          text-align: center; display: flex; flex-direction: column-reverse; gap: 5px;
        }
        .p-stat:last-child { border-right: none; }
        .p-stat-val {
          font-family: var(--font-syne, 'Syne', sans-serif);
          font-size: 26px; font-weight: 800;
          color: #f1f5f9; letter-spacing: -0.03em; line-height: 1;
        }
        .p-stat-label {
          font-size: 10px; font-weight: 700;
          color: rgba(226,232,240,0.3);
          letter-spacing: 0.12em; text-transform: uppercase;
        }

        /* ── Tools section ────────────────────────────────── */
        .p-tools { position: relative; z-index: 1; padding: 80px 0 100px; }
        .p-wrap { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
        .p-section-head { text-align: center; margin-bottom: 52px; }
        .p-section-eyebrow {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          font-size: 10.5px; font-weight: 800; letter-spacing: 0.2em;
          color: rgba(165,180,252,0.55); text-transform: uppercase; margin-bottom: 16px;
        }
        .p-line { flex: 1; max-width: 80px; height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3)); }
        .p-line:last-child { background: linear-gradient(90deg, rgba(99,102,241,0.3), transparent); }
        .p-section-sub {
          font-size: 15.5px; color: rgba(226,232,240,0.38);
          margin-top: 12px; line-height: 1.7; text-align: center;
        }

        /* ── Grid ─────────────────────────────────────────── */
        .p-grid {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(292px, 1fr));
          gap: 12px;
        }

        /* ── Card ─────────────────────────────────────────── */
        .p-card {
          display: flex; flex-direction: column;
          position: relative; height: 100%;
          padding: 22px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(8px);
          overflow: hidden;
          transition: border-color 0.22s, background 0.22s, transform 0.22s, box-shadow 0.22s;
          cursor: default;
        }
        /* Top gradient bar */
        .p-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--c, #818cf8), transparent);
          opacity: 0; transition: opacity 0.22s;
        }
        /* Hover shine */
        .p-card-shine {
          position: absolute; inset: 0; border-radius: 14px;
          background: radial-gradient(400px circle at 50% -50%, color-mix(in srgb, var(--c, #818cf8) 10%, transparent), transparent 70%);
          opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .p-card--live {
          cursor: pointer; text-decoration: none; color: inherit;
          border-color: rgba(99,102,241,0.18);
          background: rgba(99,102,241,0.04);
        }
        .p-card--live:hover {
          border-color: color-mix(in srgb, var(--c, #818cf8) 55%, transparent);
          background: color-mix(in srgb, var(--c, #818cf8) 6%, rgba(7,7,15,0.9));
          transform: translateY(-4px);
          box-shadow: 0 16px 40px -8px color-mix(in srgb, var(--c, #818cf8) 25%, transparent),
                      0 4px 12px rgba(0,0,0,0.4);
        }
        .p-card--live:hover::after { opacity: 1; }
        .p-card--live:hover .p-card-shine { opacity: 1; }
        .p-card--live:hover .p-card-icon { color: var(--c, #818cf8); filter: drop-shadow(0 0 8px var(--c, #818cf8)); }
        .p-card--live:hover .p-card-name { color: #fff; }
        .p-card--live:hover .p-card-arrow { opacity: 1; transform: translateX(0); }

        /* Card parts */
        .p-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .p-card-icon { color: rgba(226,232,240,0.22); transition: color 0.22s, filter 0.22s; line-height: 0; }
        .p-card-icon svg { display: block; }
        .p-card-name {
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          font-size: 14.5px; font-weight: 700;
          color: rgba(226,232,240,0.8);
          letter-spacing: -0.01em; margin-bottom: 8px;
          transition: color 0.22s;
        }
        .p-card-desc {
          font-size: 12.5px; color: rgba(226,232,240,0.33);
          line-height: 1.68; flex: 1;
        }
        .p-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 16px; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .p-card-cat {
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(226,232,240,0.2);
        }
        .p-card-arrow {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--c, #818cf8);
          opacity: 0; transform: translateX(-6px);
          transition: opacity 0.22s, transform 0.22s;
        }

        /* Tags */
        .p-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 9px; font-weight: 800; letter-spacing: 0.12em;
          padding: 3px 8px; border-radius: 5px; flex-shrink: 0;
        }
        .p-tag--live {
          background: rgba(99,102,241,0.15); color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.3);
        }
        .p-tag--beta {
          background: rgba(34,211,170,0.1); color: #6ee7b7;
          border: 1px solid rgba(34,211,170,0.25);
        }
        .p-tag--soon {
          background: rgba(255,255,255,0.04); color: rgba(226,232,240,0.25);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .p-tag-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: currentColor; flex-shrink: 0;
          animation: blink 2.4s ease-in-out infinite;
        }

        /* ── Features ─────────────────────────────────────── */
        .p-features {
          position: relative; z-index: 1;
          padding: 80px 0 100px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: linear-gradient(180deg, transparent, rgba(99,102,241,0.04) 50%, transparent);
        }
        .p-features-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .p-feat-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .p-feat {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 16px 18px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          transition: border-color 0.2s, background 0.2s;
        }
        .p-feat:hover {
          border-color: rgba(99,102,241,0.2);
          background: rgba(99,102,241,0.04);
        }
        .p-feat-icon { font-size: 20px; flex-shrink: 0; }
        .p-feat-title {
          display: block; font-size: 13.5px; font-weight: 700;
          color: rgba(226,232,240,0.85); margin-bottom: 3px;
          letter-spacing: -0.005em;
        }
        .p-feat-desc { display: block; font-size: 12px; color: rgba(226,232,240,0.35); line-height: 1.65; }

        /* ── Footer ───────────────────────────────────────── */
        .p-footer {
          position: relative; z-index: 1;
          padding: 36px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
        }
        .p-footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .p-footer-links { display: flex; gap: 22px; flex-wrap: wrap; }
        .p-footer-links a { font-size: 13px; color: rgba(226,232,240,0.3); text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .p-footer-links a:hover { color: rgba(226,232,240,0.7); }
        .p-footer-copy { font-size: 12px; color: rgba(226,232,240,0.2); }
        .p-footer-copy a { color: #818cf8; text-decoration: none; font-weight: 600; }
        .p-footer-copy a:hover { color: #a5b4fc; }

        /* ── Animations ───────────────────────────────────── */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes text-shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes btn-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes orb-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(40px,30px) scale(1.08)} }

        /* ── Responsive ───────────────────────────────────── */
        @media(max-width:900px) {
          .p-features-inner { grid-template-columns: 1fr; gap: 48px; }
          .p-features-copy { text-align: center; }
          .p-section-eyebrow { justify-content: center !important; }
          .p-h2 { text-align: center !important; }
          .p-section-sub { text-align: center !important; }
          .p-cta-primary { display: flex !important; width: auto !important; justify-content: center; }
        }
        @media(max-width:640px) {
          .p-hero { padding: 80px 20px 72px; }
          .p-wrap { padding: 0 16px; }
          .p-h1-line2 { font-size: clamp(44px, 12vw, 70px); }
          .p-stats { flex-direction: column; }
          .p-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); flex-direction: row; justify-content: space-between; align-items: center; gap: 12px; }
          .p-stat:last-child { border-bottom: none; }
          .p-nav-links { display: none; }
          .p-grid { grid-template-columns: 1fr; }
          .p-footer-inner { flex-direction: column; text-align: center; align-items: center; }
        }

        /* ── Scrollbar ────────────────────────────────────── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #07070f; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 2px; }
      `}</style>
    </>
  )
}
