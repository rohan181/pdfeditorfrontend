import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'NexusAI — AI-Powered Productivity Suite | PDF Editor, Code Forge & More',
  description: 'Edit, sign & AI-fill PDFs, generate code, translate documents, and automate workflows. 16 intelligent AI tools in one fast, professional platform.',
  keywords: 'AI PDF editor, PDF form filler, AI tools, document editor, sign PDF, AI productivity suite',
  authors: [{ name: 'NexusAI' }],
  robots: 'index, follow',
  openGraph: {
    title: 'NexusAI — AI-Powered Productivity Suite',
    description: 'Edit PDFs, sign documents, translate files, and automate workflows — all powered by next-generation AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusAI — AI-Powered Productivity Suite',
    description: 'Edit PDFs, sign documents, translate files, and automate workflows with AI.',
  },
}

const TOOLS = [
  {
    id: 'pdf-editor',
    name: 'AI PDF Editor',
    description: 'Edit, annotate, sign and AI-fill PDF forms with Claude. Intelligent form detection and instant field filling.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    accent: '#4f46e5',
    tag: 'LIVE',
    href: '/editor',
    category: 'Documents',
  },
  { id: 'code-forge',    name: 'Neural Code Forge',     description: 'AI-powered code generation, refactoring and intelligent code review across 40+ languages.',      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,       accent: '#7c3aed', tag: 'SOON', category: 'Development' },
  { id: 'quantum-sheet', name: 'Quantum Spreadsheet',   description: 'Predictive data modelling, AI formula suggestions and real-time collaboration at enterprise scale.',  icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`,      accent: '#0891b2', tag: 'SOON', category: 'Data' },
  { id: 'ocr-engine',    name: 'Vision OCR Engine',     description: 'Extract structured text, tables and data from any image, scanned document or photo instantly.',      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,   accent: '#059669', tag: 'SOON', category: 'Documents' },
  { id: 'autosign',      name: 'AutoSign Pro',          description: 'Biometric e-signature workflows, certificate management and legally-binding digital contracts.',        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 19l7-7-3-3-7 7v3h3z"/><path d="M18 13l1.5-1.5a2.12 2.12 0 000-3L18 7"/></svg>`,    accent: '#db2777', tag: 'SOON', category: 'Security' },
  { id: 'translate',     name: 'SmartTranslate AI',     description: 'Real-time document translation preserving layout and formatting across 140+ languages.',              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>`,  accent: '#0284c7', tag: 'SOON', category: 'Language' },
  { id: 'vector-art',    name: 'Vector Art Studio',     description: 'Generative vector graphics, logo creation and precision SVG editing with AI design assistance.',      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><circle cx="8.5" cy="15.5" r="2.5"/></svg>`,         accent: '#ea580c', tag: 'SOON', category: 'Design' },
  { id: 'datavault',     name: 'DataVault Secure',      description: 'Zero-knowledge encrypted file storage, secure sharing and compliance-ready document management.',      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,          accent: '#16a34a', tag: 'BETA', category: 'Security' },
  { id: 'schema-ai',     name: 'Schema Builder AI',     description: 'Generate database schemas, ERDs and migration scripts from plain English descriptions.',             icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,     accent: '#7c3aed', tag: 'BETA', category: 'Development' },
  { id: 'contract-ai',   name: 'ContractAI',            description: 'Intelligent contract analysis, clause extraction, risk scoring and legal summarisation.',            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>`,       accent: '#dc2626', tag: 'SOON', category: 'Legal' },
  { id: 'form-wizard',   name: 'FormWizard Pro',        description: 'Drag-and-drop form builder with AI-powered field validation and smart submission routing.',           icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,              accent: '#0891b2', tag: 'BETA', category: 'Forms' },
  { id: 'imagegen',      name: 'ImageGen Studio',       description: 'Text-to-image generation, neural photo enhancement and batch image processing pipelines.',           icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,        accent: '#c026d3', tag: 'SOON', category: 'Design' },
  { id: 'api-gateway',   name: 'API Gateway Pro',       description: 'Visual API design, live testing, rate limiting and real-time traffic monitoring dashboard.',         icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,                                                              accent: '#2563eb', tag: 'SOON', category: 'Development' },
  { id: 'chronosync',    name: 'ChronoSync',            description: 'AI-driven workflow automation, smart scheduling and cross-tool process orchestration.',              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,                                               accent: '#d97706', tag: 'SOON', category: 'Automation' },
  { id: 'nexussearch',   name: 'NexusSearch',           description: 'Semantic vector search across all your documents, emails and notes with natural language queries.',  icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,                                                                 accent: '#0d9488', tag: 'SOON', category: 'Search' },
  { id: 'datastream',    name: 'DataStream Analytics',  description: 'Real-time BI dashboards, automated reporting and predictive analytics with AI-generated insights.',  icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,                                                                      accent: '#2563eb', tag: 'SOON', category: 'Analytics' },
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

const CATEGORIES = Array.from(new Set(TOOLS.map(t => t.category)))

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="nx-root">

        {/* ── Top nav ─────────────────────────────────────────── */}
        <nav className="nx-nav" aria-label="Main navigation">
          <div className="nx-nav-inner">
            <span className="nx-logo">
              <span className="nx-logo-mark">N</span>
              NexusAI
            </span>
            <div className="nx-nav-links">
              <a href="#tools">Tools</a>
              <a href="#about">About</a>
              <Link href="/editor" className="nx-nav-cta">Open PDF Editor</Link>
            </div>
          </div>
        </nav>

        <main>
          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="nx-hero" aria-labelledby="hero-heading">
            <div className="nx-hero-bg" aria-hidden="true" />
            <div className="nx-hero-grid" aria-hidden="true" />

            <div className="nx-hero-inner">
              <div className="nx-badge">
                <span className="nx-badge-dot" />
                AI-Powered Suite · 16 Tools
              </div>

              <h1 id="hero-heading" className="nx-h1">
                The Future of<br />
                <span className="nx-h1-accent">Digital Productivity</span>
              </h1>

              <p className="nx-lead">
                One platform. Infinite intelligence. Every tool you need —<br />
                powered by next-generation AI and built for professionals.
              </p>

              <div className="nx-hero-actions">
                <Link href="/editor" className="nx-btn-primary">
                  Open AI PDF Editor
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tools" className="nx-btn-ghost">Browse All Tools</a>
              </div>

              <div className="nx-stats" role="list">
                {[['16', 'AI Tools'], ['140+', 'Languages'], ['99.9%', 'Uptime'], ['<10ms', 'Response']].map(([val, label]) => (
                  <div key={label} className="nx-stat" role="listitem">
                    <span className="nx-stat-val">{val}</span>
                    <span className="nx-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Tools ────────────────────────────────────────── */}
          <section id="tools" className="nx-tools-section" aria-labelledby="tools-heading">
            <div className="nx-section-inner">

              <div className="nx-section-header">
                <h2 id="tools-heading" className="nx-h2">All Tools</h2>
                <p className="nx-section-sub">Everything you need to work smarter, ship faster, and achieve more.</p>
              </div>

              <div className="nx-grid" role="list">
                {TOOLS.map(tool => {
                  const isLive = tool.tag === 'LIVE'
                  const isBeta = tool.tag === 'BETA'
                  const CardEl = isLive ? Link : 'div'
                  const cardProps = isLive ? { href: tool.href! } : {}
                  return (
                    // @ts-expect-error dynamic element
                    <CardEl
                      key={tool.id}
                      {...cardProps}
                      className={`nx-card${isLive ? ' nx-card--live' : ''}${isBeta ? ' nx-card--beta' : ''}`}
                      style={{ '--accent': tool.accent } as React.CSSProperties}
                      role="listitem"
                      aria-label={`${tool.name} — ${tool.tag}`}
                    >
                      <div className="nx-card-top">
                        <span className="nx-card-icon" dangerouslySetInnerHTML={{ __html: tool.icon }} aria-hidden="true" />
                        <span className={`nx-tag nx-tag--${tool.tag.toLowerCase()}`}>
                          {isLive && <span className="nx-tag-dot" />}
                          {tool.tag}
                        </span>
                      </div>

                      <h3 className="nx-card-name">{tool.name}</h3>
                      <p className="nx-card-desc">{tool.description}</p>

                      <span className="nx-card-cat">{tool.category}</span>

                      {isLive && (
                        <span className="nx-card-cta" aria-hidden="true">
                          Launch Tool
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </span>
                      )}
                    </CardEl>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ── About / trust section ────────────────────────── */}
          <section id="about" className="nx-about" aria-labelledby="about-heading">
            <div className="nx-section-inner nx-about-inner">
              <div>
                <h2 id="about-heading" className="nx-h2">Built for the modern professional</h2>
                <p className="nx-lead" style={{ marginTop: 16 }}>
                  NexusAI combines enterprise-grade security with cutting-edge AI to deliver a productivity suite that keeps pace with your ambition.
                </p>
                <Link href="/editor" className="nx-btn-primary" style={{ marginTop: 32, display: 'inline-flex' }}>
                  Start with AI PDF Editor — Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
              <div className="nx-features" role="list">
                {[
                  ['⚡', 'Lightning Fast', 'Sub-10ms responses. Optimised for speed at every layer.'],
                  ['🔒', 'Enterprise Secure', 'Zero-knowledge architecture. Your data never leaves your control.'],
                  ['🧠', 'Claude AI Powered', 'Backed by Anthropic\'s Claude — the most capable AI for documents.'],
                  ['🌍', 'Global Scale', '140+ languages, 99.9% uptime SLA, multi-region infrastructure.'],
                ].map(([icon, title, desc]) => (
                  <div key={title as string} className="nx-feature" role="listitem">
                    <span className="nx-feature-icon" aria-hidden="true">{icon}</span>
                    <div>
                      <div className="nx-feature-title">{title}</div>
                      <div className="nx-feature-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="nx-footer" role="contentinfo">
          <div className="nx-section-inner nx-footer-inner">
            <div>
              <span className="nx-logo" style={{ fontSize: 16 }}>
                <span className="nx-logo-mark" style={{ width: 24, height: 24, fontSize: 12 }}>N</span>
                NexusAI
              </span>
              <p style={{ marginTop: 8, fontSize: 13, color: '#94a3b8', maxWidth: 280 }}>
                The AI-powered productivity suite built for professionals who move fast.
              </p>
            </div>
            <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/editor">AI PDF Editor</Link>
              <a href="#tools">All Tools</a>
              <a href="#about">About</a>
            </nav>
            <p style={{ fontSize: 12, color: '#cbd5e1' }}>
              Powered by <a href="https://anthropic.com" style={{ color: '#4f46e5', fontWeight: 600 }} rel="noopener noreferrer" target="_blank">Claude AI</a> · © {new Date().getFullYear()} NexusAI
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        /* ── Reset & base ─────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        html, body { overflow: auto !important; }
        .nx-root { min-height: 100vh; background: #f8faff; color: #1e293b; font-family: 'Manrope','Inter',system-ui,sans-serif; }

        /* ── Nav ──────────────────────────────────────── */
        .nx-nav { position: sticky; top: 0; z-index: 100; background: rgba(248,250,255,0.88); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(99,102,241,0.1); }
        .nx-nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .nx-nav-links { display: flex; align-items: center; gap: 28px; }
        .nx-nav-links a { font-size: 13.5px; font-weight: 600; color: #475569; text-decoration: none; transition: color 0.15s; }
        .nx-nav-links a:hover { color: #4f46e5; }
        .nx-nav-cta { padding: 7px 18px !important; background: #4f46e5 !important; color: #fff !important; border-radius: 8px; font-size: 13px !important; }
        .nx-nav-cta:hover { background: #4338ca !important; color: #fff !important; }

        /* ── Logo ─────────────────────────────────────── */
        .nx-logo { display: flex; align-items: center; gap: 9px; font-size: 17px; font-weight: 800; color: #1e293b; letter-spacing: -0.02em; text-decoration: none; }
        .nx-logo-mark { width: 28px; height: 28px; border-radius: 7px; background: linear-gradient(135deg, #4f46e5, #818cf8); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 900; flex-shrink: 0; }

        /* ── Hero ─────────────────────────────────────── */
        .nx-hero { position: relative; padding: 96px 24px 80px; text-align: center; overflow: hidden; }
        .nx-hero-bg { position: absolute; inset: 0; background: linear-gradient(160deg, #eff2ff 0%, #f8faff 50%, #f0f9ff 100%); z-index: 0; }
        .nx-hero-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(99,102,241,0.07) 1px,transparent 1px), linear-gradient(90deg,rgba(99,102,241,0.07) 1px,transparent 1px);
          background-size: 48px 48px; }
        .nx-hero-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }

        /* ── Badge ────────────────────────────────────── */
        .nx-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 100px; border: 1px solid rgba(99,102,241,0.3); background: rgba(99,102,241,0.07); font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: #4f46e5; text-transform: uppercase; margin-bottom: 24px; }
        .nx-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #4f46e5; animation: nx-pulse 2s ease-in-out infinite; flex-shrink: 0; }

        /* ── Typography ───────────────────────────────── */
        .nx-h1 { font-size: clamp(36px, 5.5vw, 68px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.06; color: #0f172a; margin-bottom: 20px; }
        .nx-h1-accent { background: linear-gradient(120deg, #4f46e5 0%, #818cf8 50%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nx-h2 { font-size: clamp(26px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; color: #0f172a; }
        .nx-lead { font-size: 16.5px; color: #64748b; line-height: 1.75; }

        /* ── Hero actions ─────────────────────────────── */
        .nx-hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 32px 0 48px; }
        .nx-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; background: #4f46e5; color: #fff; border-radius: 10px; font-size: 14.5px; font-weight: 700; text-decoration: none; transition: background 0.15s, transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 16px rgba(79,70,229,0.3); }
        .nx-btn-primary:hover { background: #4338ca; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,70,229,0.4); }
        .nx-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; color: #475569; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14.5px; font-weight: 700; text-decoration: none; background: #fff; transition: border-color 0.15s, color 0.15s, box-shadow 0.15s; }
        .nx-btn-ghost:hover { border-color: #4f46e5; color: #4f46e5; box-shadow: 0 4px 12px rgba(79,70,229,0.1); }

        /* ── Stats ────────────────────────────────────── */
        .nx-stats { display: flex; justify-content: center; gap: 0; border: 1px solid rgba(99,102,241,0.12); border-radius: 14px; background: #fff; overflow: hidden; box-shadow: 0 2px 12px rgba(15,23,42,0.06); }
        .nx-stat { padding: 18px 28px; text-align: center; border-right: 1px solid rgba(99,102,241,0.1); flex: 1; }
        .nx-stat:last-child { border-right: none; }
        .nx-stat-val { display: block; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1; }
        .nx-stat-label { display: block; font-size: 10.5px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 5px; }

        /* ── Section scaffolding ──────────────────────── */
        .nx-section-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .nx-tools-section { padding: 80px 0; }
        .nx-section-header { text-align: center; margin-bottom: 48px; }
        .nx-section-sub { font-size: 16px; color: #64748b; margin-top: 12px; }

        /* ── Tool grid ────────────────────────────────── */
        .nx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(288px, 1fr)); gap: 14px; }

        /* ── Tool card ────────────────────────────────── */
        .nx-card { display: block; position: relative; padding: 22px; border-radius: 14px; border: 1.5px solid #e8ecf4; background: #fff; transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; text-decoration: none; color: inherit; overflow: hidden; cursor: default; }
        .nx-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0; transition: opacity 0.2s; }
        .nx-card--live { cursor: pointer; }
        .nx-card--live:hover { border-color: var(--accent); box-shadow: 0 8px 28px -4px color-mix(in srgb, var(--accent) 22%, transparent), 0 2px 8px rgba(15,23,42,0.06); transform: translateY(-3px); }
        .nx-card--live:hover::before { opacity: 1; }
        .nx-card--live:hover .nx-card-icon { color: var(--accent); }
        .nx-card--live:hover .nx-card-name { color: var(--accent); }
        .nx-card--live:hover .nx-card-cta { opacity: 1; transform: translateX(0); }

        /* ── Card parts ───────────────────────────────── */
        .nx-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
        .nx-card-icon { color: #94a3b8; transition: color 0.2s; line-height: 1; }
        .nx-card-icon svg { display: block; }
        .nx-card-name { font-size: 14.5px; font-weight: 700; color: #1e293b; margin-bottom: 8px; letter-spacing: -0.01em; transition: color 0.2s; }
        .nx-card-desc { font-size: 12.5px; color: #64748b; line-height: 1.65; }
        .nx-card-cat { display: inline-block; margin-top: 14px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; }
        .nx-card-cta { display: flex; align-items: center; gap: 5px; margin-top: 14px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; color: var(--accent); text-transform: uppercase; opacity: 0; transform: translateX(-6px); transition: opacity 0.2s, transform 0.2s; }

        /* ── Tags ─────────────────────────────────────── */
        .nx-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 6px; flex-shrink: 0; }
        .nx-tag--live { background: rgba(79,70,229,0.1); color: #4f46e5; border: 1px solid rgba(79,70,229,0.25); }
        .nx-tag--beta { background: rgba(16,185,129,0.1); color: #059669; border: 1px solid rgba(16,185,129,0.25); }
        .nx-tag--soon { background: #f1f5f9; color: #94a3b8; border: 1px solid #e2e8f0; }
        .nx-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: nx-pulse 2s ease-in-out infinite; }

        /* ── About section ────────────────────────────── */
        .nx-about { padding: 80px 0; background: linear-gradient(160deg, #f0f4ff 0%, #f8faff 100%); border-top: 1px solid rgba(99,102,241,0.1); }
        .nx-about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .nx-features { display: flex; flex-direction: column; gap: 20px; }
        .nx-feature { display: flex; gap: 14px; align-items: flex-start; padding: 16px; background: #fff; border-radius: 12px; border: 1px solid #e8ecf4; box-shadow: 0 1px 4px rgba(15,23,42,0.04); }
        .nx-feature-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .nx-feature-title { font-size: 13.5px; font-weight: 700; color: #1e293b; margin-bottom: 3px; }
        .nx-feature-desc { font-size: 12px; color: #64748b; line-height: 1.6; }

        /* ── Footer ───────────────────────────────────── */
        .nx-footer { padding: 40px 0; border-top: 1px solid #e2e8f0; background: #fff; }
        .nx-footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .nx-footer a { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; }
        .nx-footer a:hover { color: #4f46e5; }

        /* ── Animations ───────────────────────────────── */
        @keyframes nx-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        /* ── Responsive ───────────────────────────────── */
        @media(max-width:768px){
          .nx-h1{font-size:36px}
          .nx-about-inner{grid-template-columns:1fr}
          .nx-stats{flex-direction:column}
          .nx-stat{border-right:none;border-bottom:1px solid rgba(99,102,241,0.1)}
          .nx-stat:last-child{border-bottom:none}
          .nx-nav-links a:not(.nx-nav-cta){display:none}
          .nx-footer-inner{flex-direction:column;text-align:center}
        }
        @media(max-width:480px){
          .nx-hero{padding:64px 16px 56px}
          .nx-section-inner{padding:0 16px}
          .nx-grid{grid-template-columns:1fr}
        }

        /* ── Scrollbar ────────────────────────────────── */
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#f8faff}
        ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:3px}
      `}</style>
    </>
  )
}
