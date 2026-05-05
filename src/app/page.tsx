import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
  description: 'Edit, sign, annotate and AI-fill PDF forms online. The fastest AI PDF editor with intelligent form detection, e-signatures and instant completion.',
  keywords: 'AI PDF editor, edit PDF online, fill PDF forms, sign PDF, PDF form filler, AI document editor, editpdfai',
  robots: 'index, follow',
  openGraph: {
    title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
    description: 'Edit, sign and AI-fill PDF forms online. Intelligent form detection and instant completion.',
    type: 'website',
  },
}

const TOOLS = [
  { id: 'pdf-editor',     name: 'AI PDF Editor',        tag: 'LIVE', href: '/editor', category: 'DOCUMENTS', accent: '#818cf8', accentRgb: '129,140,248',
    desc: 'Edit, annotate, sign and AI-fill PDF forms with Claude. Intelligent field detection and instant form completion.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
  { id: 'code-forge',     name: 'Neural Code Forge',    tag: 'SOON', category: 'DEV',       accent: '#a78bfa', accentRgb: '167,139,250',
    desc: 'AI-powered code generation, refactoring and intelligent review across 40+ languages.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
  { id: 'quantum-sheet',  name: 'Quantum Spreadsheet',  tag: 'SOON', category: 'DATA',      accent: '#22d3ee', accentRgb: '34,211,238',
    desc: 'Predictive data modelling, AI formula generation and real-time collaboration at enterprise scale.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>` },
  { id: 'ocr-engine',     name: 'Vision OCR Engine',    tag: 'SOON', category: 'DOCUMENTS', accent: '#34d399', accentRgb: '52,211,153',
    desc: 'Extract structured text, tables and data from any image or scanned document instantly.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
  { id: 'autosign',       name: 'AutoSign Pro',         tag: 'SOON', category: 'SECURITY',  accent: '#f472b6', accentRgb: '244,114,182',
    desc: 'Biometric e-signature workflows, certificate management and legally-binding digital contracts.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 19l7-7-3-3-7 7v3h3z"/><path d="M18 13l1.5-1.5a2.12 2.12 0 000-3L18 7"/></svg>` },
  { id: 'translate',      name: 'SmartTranslate AI',    tag: 'SOON', category: 'LANGUAGE',  accent: '#38bdf8', accentRgb: '56,189,248',
    desc: 'Real-time document translation preserving layout and formatting across 140+ languages.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>` },
  { id: 'vector-art',     name: 'Vector Art Studio',    tag: 'SOON', category: 'DESIGN',    accent: '#fb923c', accentRgb: '251,146,60',
    desc: 'Generative vector graphics, logo creation and precision SVG editing with AI design assistance.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><circle cx="8.5" cy="15.5" r="2.5"/></svg>` },
  { id: 'datavault',      name: 'DataVault Secure',     tag: 'BETA', category: 'SECURITY',  accent: '#4ade80', accentRgb: '74,222,128',
    desc: 'Zero-knowledge encrypted file storage, secure sharing and compliance-ready document management.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>` },
  { id: 'schema-ai',      name: 'Schema Builder AI',    tag: 'BETA', category: 'DEV',       accent: '#c084fc', accentRgb: '192,132,252',
    desc: 'Generate database schemas, ERDs and migration scripts from plain English descriptions.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>` },
  { id: 'contract-ai',    name: 'ContractAI',           tag: 'SOON', category: 'LEGAL',     accent: '#f87171', accentRgb: '248,113,113',
    desc: 'Intelligent contract analysis, clause extraction, risk scoring and legal summarisation.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>` },
  { id: 'form-wizard',    name: 'FormWizard Pro',       tag: 'BETA', category: 'FORMS',     accent: '#2dd4bf', accentRgb: '45,212,191',
    desc: 'Drag-and-drop form builder with AI-powered validation and smart submission routing.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>` },
  { id: 'imagegen',       name: 'ImageGen Studio',      tag: 'SOON', category: 'DESIGN',    accent: '#e879f9', accentRgb: '232,121,249',
    desc: 'Text-to-image generation, neural photo enhancement and batch image processing pipelines.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` },
  { id: 'api-gateway',    name: 'API Gateway Pro',      tag: 'SOON', category: 'DEV',       accent: '#60a5fa', accentRgb: '96,165,250',
    desc: 'Visual API design, live request testing, rate limiting and real-time traffic monitoring.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>` },
  { id: 'chronosync',     name: 'ChronoSync',           tag: 'SOON', category: 'AUTOMATION',accent: '#fbbf24', accentRgb: '251,191,36',
    desc: 'AI-driven workflow automation, smart scheduling and cross-tool process orchestration.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { id: 'nexussearch',    name: 'NexusSearch',          tag: 'SOON', category: 'SEARCH',    accent: '#a3e635', accentRgb: '163,230,53',
    desc: 'Semantic vector search across all your documents, emails and notes with natural language.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-3"/><path d="M8 9h2"/><path d="M8 13h4"/><path d="M18.5 2.5l3 3L12 15h-3v-3L18.5 2.5z"/></svg>` },
  { id: 'datastream',     name: 'DataStream Analytics', tag: 'SOON', category: 'ANALYTICS', accent: '#67e8f9', accentRgb: '103,232,249',
    desc: 'Real-time BI dashboards, automated reporting and predictive analytics with AI-generated insights.',
    icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'NexusAI',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="r">

        {/* ── Atmosphere ───────────────────────────────────────── */}
        <div className="atmo" aria-hidden="true">
          <div className="atmo-orb o1" />
          <div className="atmo-orb o2" />
          <div className="atmo-orb o3" />
          <div className="atmo-grid" />
          <div className="atmo-grid atmo-grid--h" />
          <div className="atmo-scan" />
          <div className="atmo-vignette" />
        </div>

        {/* Perspective horizon grid */}
        <div className="horizon" aria-hidden="true">
          <div className="horizon-grid" />
        </div>

        {/* ── Nav ──────────────────────────────────────────────── */}
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-in">
            <Link href="/" className="logo">
              <span className="logo-gem" aria-hidden="true">N</span>
              <span className="logo-name">NexusAI</span>
              <span className="logo-ver" aria-hidden="true">v2.0</span>
            </Link>
            <div className="nav-r">
              <div className="nav-links" role="list">
                <a href="#tools" role="listitem">Tools</a>
                <a href="#features" role="listitem">Features</a>
              </div>
              <Link href="/editor" className="nav-btn">
                <span className="nav-btn-dot" aria-hidden="true" />
                Launch PDF Editor
              </Link>
            </div>
          </div>
        </nav>

        <main>
          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="hero" aria-labelledby="h1">

            {/* HUD corners */}
            <span className="hud hud-tl" aria-hidden="true"><span/><span/></span>
            <span className="hud hud-tr" aria-hidden="true"><span/><span/></span>
            <span className="hud hud-bl" aria-hidden="true"><span/><span/></span>
            <span className="hud hud-br" aria-hidden="true"><span/><span/></span>

            {/* System status bar */}
            <div className="sys-bar" aria-hidden="true">
              <span className="sys-dot" />
              <span className="mono">SYS_ONLINE</span>
              <span className="sys-sep">·</span>
              <span className="mono">16 MODULES LOADED</span>
              <span className="sys-sep">·</span>
              <span className="mono">CLAUDE AI CORE ACTIVE</span>
            </div>

            <h1 id="h1" className="h1">
              <span className="h1-top">The Future of</span>
              <span className="h1-main">
                <span className="h1-glitch" data-text="Digital Work">Digital Work</span>
              </span>
            </h1>

            <p className="hero-sub">
              One platform. Infinite intelligence.<br />
              16 AI tools built for professionals who move fast.
            </p>

            <div className="hero-ctas">
              <Link href="/editor" className="cta-main" aria-label="Open AI PDF Editor — free">
                <span className="cta-main-bg" aria-hidden="true" />
                <span className="cta-main-border" aria-hidden="true" />
                <span className="cta-main-txt">
                  Open AI PDF Editor — Free
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </Link>
              <a href="#tools" className="cta-ghost">
                Browse All Tools
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </a>
            </div>

            <dl className="stats">
              {([['16', 'AI Tools'], ['140+', 'Languages'], ['99.9%', 'Uptime'], ['<10ms', 'Response']] as const).map(([v, l]) => (
                <div key={l} className="stat">
                  <dt className="stat-l">{l}</dt>
                  <dd className="stat-v">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Tool grid ────────────────────────────────────── */}
          <section id="tools" className="tools-sec" aria-labelledby="tools-h">
            <div className="wrap">
              <header className="sec-head">
                <div className="sec-eye">
                  <span className="sec-line" aria-hidden="true"/>
                  <span className="mono sec-eye-txt">// ALL_MODULES</span>
                  <span className="sec-line sec-line-r" aria-hidden="true"/>
                </div>
                <h2 id="tools-h" className="h2">Everything you need,<br />powered by AI</h2>
                <p className="sec-sub">Click any live module to deploy instantly. More launching soon.</p>
              </header>

              <ul className="grid" role="list">
                {TOOLS.map(t => {
                  const live = t.tag === 'LIVE'
                  const beta = t.tag === 'BETA'
                  const Inner = (
                    <>
                      {/* Corner brackets */}
                      <span className="cb cb-tl" aria-hidden="true"/>
                      <span className="cb cb-tr" aria-hidden="true"/>
                      <span className="cb cb-bl" aria-hidden="true"/>
                      <span className="cb cb-br" aria-hidden="true"/>

                      <span className="card-head">
                        <span className="card-icon" dangerouslySetInnerHTML={{ __html: t.icon }} aria-hidden="true"/>
                        <span className={`tag tag-${t.tag.toLowerCase()}`}>
                          {(live || beta) && <span className="tag-dot"/>}
                          {t.tag}
                        </span>
                      </span>
                      <span className="card-name">{t.name}</span>
                      <span className="card-desc">{t.desc}</span>
                      <span className="card-foot">
                        <span className="mono card-cat">{t.category}</span>
                        {live && (
                          <span className="card-launch" aria-hidden="true">
                            ACCESS
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </span>
                        )}
                      </span>
                    </>
                  )
                  return (
                    <li key={t.id} role="listitem">
                      {live
                        ? <Link href={t.href!} className="card card-live" style={{ '--c': t.accent, '--cr': t.accentRgb } as React.CSSProperties}>{Inner}</Link>
                        : <div className={`card${beta ? ' card-beta' : ''}`} style={{ '--c': t.accent, '--cr': t.accentRgb } as React.CSSProperties}>{Inner}</div>
                      }
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          {/* ── Features ─────────────────────────────────────── */}
          <section id="features" className="feat-sec" aria-labelledby="feat-h">
            <div className="wrap feat-in">
              <div className="feat-copy">
                <div className="sec-eye" style={{ justifyContent: 'flex-start' }}>
                  <span className="mono sec-eye-txt">// SYSTEM_SPECS</span>
                </div>
                <h2 id="feat-h" className="h2 h2-left" style={{ marginTop: 18 }}>
                  Enterprise power.<br />Zero friction.
                </h2>
                <p className="sec-sub" style={{ textAlign: 'left', marginTop: 14 }}>
                  Military-grade security meets next-gen AI. Built for professionals who refuse to compromise.
                </p>
                <Link href="/editor" className="cta-main" style={{ marginTop: 32, display: 'inline-flex', width: 'fit-content' }}>
                  <span className="cta-main-bg" aria-hidden="true"/>
                  <span className="cta-main-border" aria-hidden="true"/>
                  <span className="cta-main-txt">
                    Start Free — No signup needed
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </Link>
              </div>
              <ul className="feat-list" role="list">
                {([
                  ['⚡', 'LIGHTNING FAST',       'Sub-10ms responses. Optimised at every layer of the stack.'],
                  ['🔒', 'ZERO-KNOWLEDGE',        'Your data never leaves your control. End-to-end encrypted.'],
                  ['🧠', 'CLAUDE AI CORE',        "Backed by Anthropic's Claude — the world's most capable document AI."],
                  ['🌍', 'GLOBAL INFRASTRUCTURE', '140+ languages, 99.9% uptime SLA, multi-region deployments.'],
                ] as const).map(([icon, title, desc]) => (
                  <li key={title} className="feat" role="listitem">
                    <span className="feat-icon" aria-hidden="true">{icon}</span>
                    <span>
                      <span className="feat-title mono">{title}</span>
                      <span className="feat-desc">{desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="footer" role="contentinfo">
          <div className="wrap footer-in">
            <Link href="/" className="logo">
              <span className="logo-gem" style={{ width: 24, height: 24, fontSize: 11 }} aria-hidden="true">N</span>
              <span className="logo-name" style={{ fontSize: 15 }}>NexusAI</span>
            </Link>
            <nav aria-label="Footer navigation" className="footer-nav">
              <Link href="/editor">AI PDF Editor</Link>
              <a href="#tools">All Modules</a>
              <a href="#features">System Specs</a>
            </nav>
            <p className="footer-copy mono">
              POWERED BY <a href="https://anthropic.com" rel="noopener noreferrer" target="_blank">CLAUDE AI</a> · © {new Date().getFullYear()} NEXUSAI
            </p>
          </div>
        </footer>
      </div>

      {/* ════════════════ STYLES ════════════════ */}
      <style>{`
        /*─ Reset ────────────────────────────────*/
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        html,body{overflow:auto!important;background:#03020a}

        /*─ Tokens ───────────────────────────────*/
        :root{
          --ink:#03020a;
          --fg:rgba(226,232,240,1);
          --fg2:rgba(226,232,240,0.55);
          --fg3:rgba(226,232,240,0.28);
          --fg4:rgba(226,232,240,0.1);
          --border:rgba(255,255,255,0.07);
          --border2:rgba(255,255,255,0.12);
          --indigo:#6366f1;
          --cyan:#22d3ee;
          --violet:#a855f7;
          --indigo-lo:rgba(99,102,241,0.12);
          --font-display:var(--font-syne,'Syne',sans-serif);
          --font-ui:var(--font-space,'Space Grotesk',sans-serif);
          --font-mono:var(--font-mono,'JetBrains Mono',monospace);
        }

        /*─ Root ─────────────────────────────────*/
        .r{
          min-height:100vh;
          background:var(--ink);
          color:var(--fg);
          font-family:var(--font-ui);
          position:relative;
          overflow-x:hidden;
        }
        .mono{font-family:var(--font-mono);font-size:0.82em;letter-spacing:0.06em}
        .wrap{max-width:1280px;margin:0 auto;padding:0 28px}

        /*─ Atmosphere ───────────────────────────*/
        .atmo{position:fixed;inset:0;pointer-events:none;z-index:0}
        .atmo-orb{position:absolute;border-radius:50%;filter:blur(130px)}
        .o1{width:720px;height:720px;background:radial-gradient(circle,rgba(99,102,241,0.22),transparent 65%);top:-180px;left:-120px;animation:orb 20s ease-in-out infinite alternate}
        .o2{width:520px;height:520px;background:radial-gradient(circle,rgba(34,211,238,0.16),transparent 65%);top:15%;right:-80px;animation:orb 26s ease-in-out infinite alternate-reverse}
        .o3{width:640px;height:640px;background:radial-gradient(circle,rgba(168,85,247,0.18),transparent 65%);bottom:5%;left:25%;animation:orb 32s ease-in-out infinite alternate}
        .atmo-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.055) 1px,transparent 1px);background-size:56px 56px}
        .atmo-grid--h{background-image:none;background:none;opacity:0} /* placeholder */
        .atmo-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px);pointer-events:none}
        .atmo-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 0%,rgba(99,102,241,0.09) 0%,transparent 70%)}

        /*─ Horizon grid ─────────────────────────*/
        .horizon{position:absolute;bottom:0;left:0;right:0;height:380px;pointer-events:none;z-index:0;overflow:hidden;opacity:0.55}
        .horizon-grid{
          position:absolute;bottom:0;left:50%;
          width:280%;height:100%;
          transform:translateX(-50%) perspective(500px) rotateX(72deg);
          transform-origin:bottom center;
          background-image:
            linear-gradient(rgba(99,102,241,0.25) 1px,transparent 1px),
            linear-gradient(90deg,rgba(99,102,241,0.25) 1px,transparent 1px);
          background-size:72px 72px;
          mask-image:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 100%);
        }

        /*─ Nav ──────────────────────────────────*/
        .nav{position:sticky;top:0;z-index:100;background:rgba(3,2,10,0.8);backdrop-filter:blur(20px) saturate(160%);border-bottom:1px solid var(--border)}
        .nav-in{max-width:1280px;margin:0 auto;padding:0 28px;height:62px;display:flex;align-items:center;justify-content:space-between}
        .nav-r{display:flex;align-items:center;gap:32px}
        .nav-links{display:flex;gap:28px}
        .nav-links a{font-size:13px;font-weight:500;color:var(--fg3);text-decoration:none;transition:color .15s;letter-spacing:.02em}
        .nav-links a:hover{color:var(--fg)}
        .nav-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;background:var(--indigo-lo);border:1px solid rgba(99,102,241,0.35);border-radius:8px;font-size:12.5px;font-weight:600;color:#a5b4fc;text-decoration:none;transition:all .2s;letter-spacing:.02em}
        .nav-btn:hover{background:rgba(99,102,241,0.22);border-color:rgba(99,102,241,0.6);color:#c7d2fe}
        .nav-btn-dot{width:5px;height:5px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:blink 2s ease-in-out infinite;box-shadow:0 0 6px #4ade80}

        /*─ Logo ─────────────────────────────────*/
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo-gem{width:30px;height:30px;border-radius:8px;flex-shrink:0;background:linear-gradient(135deg,#6366f1 0%,#818cf8 55%,#22d3ee 100%);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:15px;font-weight:800;color:#fff;box-shadow:0 0 22px rgba(99,102,241,0.5)}
        .logo-name{font-family:var(--font-display);font-size:18px;font-weight:800;color:#f1f5f9;letter-spacing:-.02em}
        .logo-ver{font-family:var(--font-mono);font-size:9px;color:var(--fg3);letter-spacing:.1em;margin-left:2px;margin-top:4px}

        /*─ Hero ─────────────────────────────────*/
        .hero{position:relative;z-index:1;padding:100px 28px 90px;text-align:center;max-width:900px;margin:0 auto}

        /*─ HUD corners ──────────────────────────*/
        .hud{position:absolute;width:28px;height:28px;opacity:.35}
        .hud span{position:absolute;background:var(--indigo);display:block}
        .hud span:first-child{width:100%;height:1.5px;top:0}
        .hud span:last-child{width:1.5px;height:100%;top:0}
        .hud-tl{top:20px;left:20px}
        .hud-tl span:last-child{left:0}
        .hud-tr{top:20px;right:20px;transform:scaleX(-1)}
        .hud-tr span:last-child{left:0}
        .hud-bl{bottom:20px;left:20px;transform:scaleY(-1)}
        .hud-bl span:last-child{left:0}
        .hud-br{bottom:20px;right:20px;transform:scale(-1,-1)}
        .hud-br span:last-child{left:0}

        /*─ System bar ───────────────────────────*/
        .sys-bar{display:inline-flex;align-items:center;gap:10px;padding:5px 16px;border:1px solid rgba(74,222,128,0.2);border-radius:4px;background:rgba(74,222,128,0.05);font-size:9.5px;color:rgba(74,222,128,0.7);letter-spacing:.12em;margin-bottom:28px}
        .sys-dot{width:5px;height:5px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:blink 2s ease-in-out infinite;box-shadow:0 0 5px #4ade80}
        .sys-sep{color:var(--fg3)}

        /*─ H1 glitch ────────────────────────────*/
        .h1{font-family:var(--font-display);font-weight:800;letter-spacing:-.04em;line-height:.98;margin-bottom:22px;display:flex;flex-direction:column;align-items:center}
        .h1-top{font-size:clamp(32px,5vw,60px);color:var(--fg2);display:block}
        .h1-main{display:block;font-size:clamp(56px,9vw,108px);position:relative}
        .h1-glitch{
          display:block;
          background:linear-gradient(100deg,#a5b4fc 0%,#818cf8 20%,#22d3ee 45%,#c084fc 70%,#a5b4fc 100%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:txt-flow 5s linear infinite;
        }
        .h1-glitch::before,.h1-glitch::after{
          content:attr(data-text);
          position:absolute;top:0;left:0;right:0;
          background:inherit;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .h1-glitch::before{animation:glitch-1 8s step-end infinite;text-shadow:2px 0 #22d3ee}
        .h1-glitch::after{animation:glitch-2 8s step-end infinite;text-shadow:-2px 0 #a855f7}

        /*─ Sub & CTAs ───────────────────────────*/
        .hero-sub{font-size:16.5px;line-height:1.8;color:var(--fg2);margin-bottom:40px;letter-spacing:.01em;opacity:.6}
        .hero-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:60px}

        .cta-main{position:relative;display:inline-flex;border-radius:10px;text-decoration:none;isolation:isolate;overflow:hidden;transition:transform .2s,box-shadow .2s}
        .cta-main:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(99,102,241,0.4)}
        .cta-main-bg{position:absolute;inset:0;background:linear-gradient(135deg,#4f46e5,#7c3aed,#4f46e5);background-size:200% 100%;animation:btn-flow 3s linear infinite}
        .cta-main-border{position:absolute;inset:0;border-radius:10px;border:1px solid rgba(165,180,252,0.3)}
        .cta-main-txt{position:relative;z-index:1;display:inline-flex;align-items:center;gap:9px;padding:14px 28px;font-size:14px;font-weight:700;color:#fff;letter-spacing:.02em}

        .cta-ghost{display:inline-flex;align-items:center;gap:7px;padding:14px 22px;border-radius:10px;border:1px solid var(--border2);font-size:13.5px;font-weight:600;color:var(--fg3);text-decoration:none;transition:all .2s;letter-spacing:.01em}
        .cta-ghost:hover{border-color:rgba(255,255,255,0.22);color:var(--fg2)}

        /*─ Stats ─────────────────────────────────*/
        .stats{display:flex;border:1px solid var(--border);border-radius:12px;background:rgba(255,255,255,0.02);backdrop-filter:blur(12px);overflow:hidden;max-width:520px;margin:0 auto}
        .stat{flex:1;padding:20px 16px;border-right:1px solid var(--border);text-align:center;display:flex;flex-direction:column-reverse;gap:5px}
        .stat:last-child{border-right:none}
        .stat-v{font-family:var(--font-display);font-size:26px;font-weight:800;color:#f1f5f9;letter-spacing:-.03em;line-height:1}
        .stat-l{font-family:var(--font-mono);font-size:9.5px;font-weight:700;color:var(--fg3);letter-spacing:.14em;text-transform:uppercase}

        /*─ Tools section ─────────────────────────*/
        .tools-sec{position:relative;z-index:1;padding:90px 0 100px}
        .sec-head{text-align:center;margin-bottom:52px}
        .sec-eye{display:flex;align-items:center;gap:14px;justify-content:center;margin-bottom:16px}
        .sec-eye-txt{font-size:10px;font-weight:700;color:rgba(165,180,252,.45);text-transform:uppercase;letter-spacing:.18em}
        .sec-line{flex:1;max-width:72px;height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,.3))}
        .sec-line-r{background:linear-gradient(90deg,rgba(99,102,241,.3),transparent)}
        .h2{font-family:var(--font-display);font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-.03em;color:#f1f5f9;text-align:center}
        .h2-left{text-align:left}
        .sec-sub{font-size:15px;color:var(--fg3);margin-top:12px;line-height:1.75}

        /*─ Grid ──────────────────────────────────*/
        .grid{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(288px,1fr));gap:10px}

        /*─ Card ──────────────────────────────────*/
        .card{
          display:flex;flex-direction:column;height:100%;
          position:relative;
          padding:20px;border-radius:12px;
          border:1px solid var(--border);
          background:rgba(255,255,255,0.022);
          backdrop-filter:blur(6px);
          overflow:hidden;
          transition:border-color .22s,background .22s,transform .22s,box-shadow .22s;
          cursor:default;
          text-decoration:none;color:inherit;
        }
        .card::after{
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,var(--c,#818cf8),transparent);
          opacity:0;transition:opacity .22s;
        }
        .card-live{
          cursor:pointer;
          border-color:rgba(99,102,241,0.2);
          background:rgba(99,102,241,0.04);
        }
        .card-live:hover{
          border-color:var(--c,#818cf8);
          background:rgba(var(--cr,129,140,248),.07);
          transform:translateY(-4px);
          box-shadow:0 20px 50px -10px rgba(var(--cr,129,140,248),.28),0 0 0 1px rgba(var(--cr,129,140,248),.15),inset 0 0 40px rgba(var(--cr,129,140,248),.04);
        }
        .card-live:hover::after{opacity:1}
        .card-live:hover .cb{opacity:1}
        .card-live:hover .card-icon{color:var(--c,#818cf8);filter:drop-shadow(0 0 9px var(--c,#818cf8))}
        .card-live:hover .card-name{color:#fff}
        .card-live:hover .card-launch{opacity:1;transform:translateX(0)}

        /*─ Corner brackets ───────────────────────*/
        .cb{position:absolute;width:10px;height:10px;opacity:0;transition:opacity .22s;border-color:var(--c,#818cf8)}
        .cb-tl{top:9px;left:9px;border-top:1.5px solid;border-left:1.5px solid}
        .cb-tr{top:9px;right:9px;border-top:1.5px solid;border-right:1.5px solid}
        .cb-bl{bottom:9px;left:9px;border-bottom:1.5px solid;border-left:1.5px solid}
        .cb-br{bottom:9px;right:9px;border-bottom:1.5px solid;border-right:1.5px solid}

        /*─ Card parts ────────────────────────────*/
        .card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px}
        .card-icon{color:rgba(226,232,240,.18);transition:color .22s,filter .22s;line-height:0}
        .card-icon svg{display:block}
        .card-name{font-family:var(--font-ui);font-size:14px;font-weight:700;color:rgba(226,232,240,.72);letter-spacing:-.01em;margin-bottom:7px;transition:color .22s}
        .card-desc{font-size:12px;color:var(--fg3);line-height:1.7;flex:1}
        .card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)}
        .card-cat{font-size:9.5px;font-weight:700;letter-spacing:.14em;color:rgba(226,232,240,.18);text-transform:uppercase}
        .card-launch{display:inline-flex;align-items:center;gap:5px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:.12em;color:var(--c,#818cf8);text-transform:uppercase;opacity:0;transform:translateX(-6px);transition:opacity .22s,transform .22s}

        /*─ Tags ──────────────────────────────────*/
        .tag{display:inline-flex;align-items:center;gap:5px;font-family:var(--font-mono);font-size:8.5px;font-weight:700;letter-spacing:.1em;padding:3px 8px;border-radius:4px;flex-shrink:0}
        .tag-live{background:rgba(99,102,241,.14);color:#a5b4fc;border:1px solid rgba(99,102,241,.3)}
        .tag-beta{background:rgba(34,211,170,.1);color:#6ee7b7;border:1px solid rgba(34,211,170,.25)}
        .tag-soon{background:rgba(255,255,255,.04);color:var(--fg3);border:1px solid var(--border)}
        .tag-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;animation:blink 2.4s ease-in-out infinite}

        /*─ Features ──────────────────────────────*/
        .feat-sec{position:relative;z-index:1;padding:80px 0 100px;border-top:1px solid var(--border);background:linear-gradient(180deg,transparent,rgba(99,102,241,.04) 50%,transparent)}
        .feat-in{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .feat-list{list-style:none;display:flex;flex-direction:column;gap:10px}
        .feat{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,.02);transition:border-color .2s,background .2s}
        .feat:hover{border-color:rgba(99,102,241,.22);background:rgba(99,102,241,.04)}
        .feat-icon{font-size:18px;flex-shrink:0}
        .feat-title{display:block;font-size:11px;font-weight:700;color:rgba(226,232,240,.8);margin-bottom:4px;letter-spacing:.1em}
        .feat-desc{display:block;font-size:12px;color:var(--fg3);line-height:1.65}

        /*─ Footer ────────────────────────────────*/
        .footer{position:relative;z-index:1;padding:34px 0;border-top:1px solid var(--border);background:rgba(255,255,255,.01)}
        .footer-in{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .footer-nav{display:flex;gap:22px;flex-wrap:wrap}
        .footer-nav a,.footer-copy{font-size:12px;color:var(--fg3);text-decoration:none;font-weight:500;transition:color .15s}
        .footer-nav a:hover{color:var(--fg2)}
        .footer-copy{font-family:var(--font-mono);font-size:10px;letter-spacing:.08em}
        .footer-copy a{color:#818cf8;text-decoration:none;font-weight:700}
        .footer-copy a:hover{color:#a5b4fc}

        /*─ Keyframes ─────────────────────────────*/
        @keyframes orb{0%{transform:translate(0,0) scale(1)}100%{transform:translate(36px,24px) scale(1.09)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes txt-flow{0%{background-position:0% center}100%{background-position:200% center}}
        @keyframes btn-flow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes glitch-1{
          0%,94%,100%{clip-path:inset(0 0 100% 0);transform:translate(0)}
          95%{clip-path:inset(10% 0 70% 0);transform:translate(4px,0)}
          96%{clip-path:inset(50% 0 30% 0);transform:translate(-4px,0)}
          97%{clip-path:inset(80% 0 5% 0);transform:translate(4px,0)}
          98%{clip-path:inset(0 0 100% 0);transform:translate(0)}
        }
        @keyframes glitch-2{
          0%,96%,100%{clip-path:inset(0 0 100% 0);transform:translate(0)}
          97%{clip-path:inset(25% 0 55% 0);transform:translate(-3px,0)}
          98%{clip-path:inset(65% 0 15% 0);transform:translate(3px,0)}
          99%{clip-path:inset(0 0 100% 0);transform:translate(0)}
        }

        /*─ Responsive ────────────────────────────*/
        @media(max-width:900px){
          .feat-in{grid-template-columns:1fr;gap:48px}
          .h2-left,.sec-sub{text-align:center!important}
          .sec-eye{justify-content:center!important}
          .cta-main{display:flex!important;width:auto!important;justify-content:center}
        }
        @media(max-width:640px){
          .hero{padding:72px 20px 64px}
          .wrap{padding:0 16px}
          .stats{flex-direction:column}
          .stat{border-right:none;border-bottom:1px solid var(--border);flex-direction:row;justify-content:space-between;align-items:center;gap:12px}
          .stat:last-child{border-bottom:none}
          .nav-links{display:none}
          .grid{grid-template-columns:1fr}
          .footer-in{flex-direction:column;text-align:center;align-items:center}
          .hud{display:none}
          .sys-bar{flex-wrap:wrap;justify-content:center;gap:6px}
        }

        /*─ Scrollbar ─────────────────────────────*/
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:var(--ink)}
        ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.35);border-radius:2px}
      `}</style>
    </>
  )
}
