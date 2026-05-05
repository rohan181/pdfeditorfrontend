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
  { id: 'pdf-editor',    name: 'AI PDF Editor',        tag: 'LIVE', href: '/editor', category: 'DOCUMENTS', accent: '#818cf8', accentRgb: '129,140,248',
    desc: 'Edit, annotate, sign and AI-fill PDF forms. Intelligent field detection and instant form completion.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
  { id: 'code-forge',    name: 'Neural Code Forge',    tag: 'SOON', category: 'DEV',        accent: '#a78bfa', accentRgb: '167,139,250',
    desc: 'AI-powered code generation, refactoring and intelligent review across 40+ languages.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
  { id: 'quantum-sheet', name: 'Quantum Spreadsheet',  tag: 'SOON', category: 'DATA',       accent: '#22d3ee', accentRgb: '34,211,238',
    desc: 'Predictive data modelling, AI formula generation and real-time collaboration at enterprise scale.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>` },
  { id: 'ocr-engine',    name: 'Vision OCR Engine',    tag: 'SOON', category: 'DOCUMENTS',  accent: '#34d399', accentRgb: '52,211,153',
    desc: 'Extract structured text, tables and data from any image or scanned document instantly.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
  { id: 'autosign',      name: 'AutoSign Pro',         tag: 'SOON', category: 'SECURITY',   accent: '#f472b6', accentRgb: '244,114,182',
    desc: 'Biometric e-signature workflows, certificate management and legally-binding digital contracts.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 19l7-7-3-3-7 7v3h3z"/><path d="M18 13l1.5-1.5a2.12 2.12 0 000-3L18 7"/></svg>` },
  { id: 'translate',     name: 'SmartTranslate AI',    tag: 'SOON', category: 'LANGUAGE',   accent: '#38bdf8', accentRgb: '56,189,248',
    desc: 'Real-time document translation preserving layout and formatting across 140+ languages.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>` },
  { id: 'vector-art',    name: 'Vector Art Studio',    tag: 'SOON', category: 'DESIGN',     accent: '#fb923c', accentRgb: '251,146,60',
    desc: 'Generative vector graphics, logo creation and precision SVG editing with AI design assistance.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><circle cx="8.5" cy="15.5" r="2.5"/></svg>` },
  { id: 'datavault',     name: 'DataVault Secure',     tag: 'BETA', category: 'SECURITY',   accent: '#4ade80', accentRgb: '74,222,128',
    desc: 'Zero-knowledge encrypted file storage, secure sharing and compliance-ready document management.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>` },
  { id: 'schema-ai',     name: 'Schema Builder AI',    tag: 'BETA', category: 'DEV',        accent: '#c084fc', accentRgb: '192,132,252',
    desc: 'Generate database schemas, ERDs and migration scripts from plain English descriptions.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>` },
  { id: 'contract-ai',   name: 'ContractAI',           tag: 'SOON', category: 'LEGAL',      accent: '#f87171', accentRgb: '248,113,113',
    desc: 'Intelligent contract analysis, clause extraction, risk scoring and legal summarisation.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>` },
  { id: 'form-wizard',   name: 'FormWizard Pro',       tag: 'BETA', category: 'FORMS',      accent: '#2dd4bf', accentRgb: '45,212,191',
    desc: 'Drag-and-drop form builder with AI-powered validation and smart submission routing.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>` },
  { id: 'imagegen',      name: 'ImageGen Studio',      tag: 'SOON', category: 'DESIGN',     accent: '#e879f9', accentRgb: '232,121,249',
    desc: 'Text-to-image generation, neural photo enhancement and batch image processing pipelines.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` },
  { id: 'api-gateway',   name: 'API Gateway Pro',      tag: 'SOON', category: 'DEV',        accent: '#60a5fa', accentRgb: '96,165,250',
    desc: 'Visual API design, live request testing, rate limiting and real-time traffic monitoring.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>` },
  { id: 'chronosync',    name: 'ChronoSync',           tag: 'SOON', category: 'AUTOMATION', accent: '#fbbf24', accentRgb: '251,191,36',
    desc: 'AI-driven workflow automation, smart scheduling and cross-tool process orchestration.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { id: 'docsearch',     name: 'DocSearch AI',         tag: 'SOON', category: 'SEARCH',     accent: '#a3e635', accentRgb: '163,230,53',
    desc: 'Semantic vector search across all your documents, emails and notes with natural language.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-3"/><path d="M8 9h2"/><path d="M8 13h4"/><path d="M18.5 2.5l3 3L12 15h-3v-3L18.5 2.5z"/></svg>` },
  { id: 'datastream',    name: 'DataStream Analytics', tag: 'SOON', category: 'ANALYTICS',  accent: '#67e8f9', accentRgb: '103,232,249',
    desc: 'Real-time BI dashboards, automated reporting and predictive analytics with AI-generated insights.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EditPDF AI',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const CAPS = ['AI Form Filling','Smart Signatures','Text Editing','Annotations','Page Management','PDF Merge','Smart OCR','Export PDF']

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pg">

        {/* ── Ambient ── */}
        <div className="amb" aria-hidden="true">
          <div className="ag1" /><div className="ag2" /><div className="agr" />
        </div>

        {/* ── Nav ── */}
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-in">
            <Link href="/" className="wm" aria-label="EditPDF AI — home">
              <span className="wm-spark" aria-hidden="true">✦</span>
              <span className="wm-txt">EDITPDF<span className="wm-ai">.AI</span></span>
            </Link>
            <div className="nav-lnks" role="list">
              <a href="#tools" className="nav-a" role="listitem">Tools</a>
              <a href="#features" className="nav-a" role="listitem">Features</a>
            </div>
            <div className="nav-r">
              <div className="pill" aria-label="Service online">
                <span className="pill-dot" aria-hidden="true" />
                <span className="mk">ONLINE</span>
              </div>
              <Link href="/editor" className="nav-btn">
                Launch Editor <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <header className="hero" aria-labelledby="h1">
          <div className="wrap hero-in">

            {/* Left — editorial */}
            <div className="hl">
              <p className="hbadge mk" aria-hidden="true">
                <span className="hbdot" />&nbsp;AI PDF PLATFORM · 16 TOOLS
              </p>
              <h1 id="h1" className="h1">
                <span className="h1s">The smartest</span>
                <span className="h1m">PDF Suite.</span>
              </h1>
              <p className="hcopy">
                Edit, sign, annotate and AI‑fill your documents.
                State-of-the-art intelligence — free, no signup.
              </p>
              <div className="hacts">
                <Link href="/editor" className="btnp">
                  Open PDF Editor — Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tools" className="btng">Browse all tools</a>
              </div>
              <dl className="hst">
                {([['16','AI Tools'],['140+','Languages'],['99.9%','Uptime'],['<10ms','Response']] as const).map(([v,l]) => (
                  <div key={l} className="hsti">
                    <dd className="hstv">{v}</dd>
                    <dt className="hstl mk">{l}</dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right — animated PDF mockup */}
            <div className="hr" aria-hidden="true">
              <div className="doc">
                <div className="doc-pill mk"><span className="dp-dot" />AI ACTIVE</div>
                <div className="doc-head">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="mk">contract.pdf</span>
                </div>
                <div className="doc-body">
                  <div className="dl dw90 dd1" /><div className="dl dw72 dd2" /><div className="dl dw84 dd3" />
                  <div className="dgap" />
                  <div className="dfield dd4"><span className="dfl mk">NAME</span><span className="dfv">John Smith</span><span className="dfs">✦</span></div>
                  <div className="dfield dd5"><span className="dfl mk">DATE</span><span className="dfv">06/05/2026</span><span className="dfs">✦</span></div>
                  <div className="dgap" />
                  <div className="dl dw62 dd6" /><div className="dl dw80 dd7" />
                  <div className="dgap" />
                  <div className="dsig dd8">
                    <span className="dsig-l" /><span className="mk dsig-txt">SIGNATURE</span>
                  </div>
                </div>
                <div className="doc-ok"><span className="dok-dot" /><span className="mk">3 FIELDS FILLED</span></div>
                <div className="doc-glow" />
              </div>
            </div>

          </div>
        </header>

        {/* ── Ticker ── */}
        <div className="ticker" aria-hidden="true" role="presentation">
          <div className="ticker-tr">
            {[...TOOLS, ...TOOLS].map((t, i) => (
              <span key={i} className="ti">
                <span className="ti-s">✦</span>
                <span className="mk ti-n">{t.name.toUpperCase()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Tools ── */}
        <section id="tools" className="tsec" aria-labelledby="tools-h">
          <div className="wrap">
            <div className="sbar">
              <span className="mk slbl">// TOOL REGISTRY</span>
              <span className="sln" aria-hidden="true" />
              <span className="mk scnt">16 MODULES</span>
            </div>
            <h2 id="tools-h" className="sh">16 AI‑Powered Modules</h2>
            <p className="ssp">One live now. Fifteen more deploying soon.</p>

            {/* Featured */}
            <Link href="/editor" className="fc" aria-label="Open AI PDF Editor — free, live now">
              <div className="fcl">
                <div className="fctag mk"><span className="fctd" />LIVE NOW</div>
                <div className="fcico" dangerouslySetInnerHTML={{ __html: TOOLS[0].icon }} aria-hidden="true" />
                <h3 className="fcname">{TOOLS[0].name}</h3>
                <p className="fcdesc">{TOOLS[0].desc}</p>
                <ul className="fccaps" aria-label="Capabilities">
                  {['AI Form Filling','E-Signatures','Text Editing','Annotations','Page Management'].map(c => (
                    <li key={c} className="fcci"><span aria-hidden="true">✓</span>{c}</li>
                  ))}
                </ul>
                <span className="fccta">
                  Open Free
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
              <div className="fcr" aria-hidden="true">
                <p className="mk fcr-lbl">CAPABILITIES</p>
                {CAPS.map((c, i) => (
                  <div key={c} className="fcd" style={{ animationDelay: `${i * 0.07}s` } as React.CSSProperties}>
                    <span className="fcd-ck">✓</span><span>{c}</span>
                  </div>
                ))}
              </div>
            </Link>

            {/* Grid */}
            <ul className="tgrid" role="list" aria-label="Upcoming tools">
              {TOOLS.slice(1).map(t => (
                <li key={t.id} role="listitem">
                  <div className="tc" style={{ '--ca': t.accent, '--cr': t.accentRgb } as React.CSSProperties}>
                    <div className="tc-hd">
                      <span className="tc-ic" dangerouslySetInnerHTML={{ __html: t.icon }} aria-hidden="true" />
                      <span className={`tc-tag mk tc-${t.tag.toLowerCase()}`}>{t.tag}</span>
                    </div>
                    <span className="tc-name">{t.name}</span>
                    <span className="tc-desc">{t.desc}</span>
                    <span className="tc-cat mk">{t.category}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="fsec" aria-labelledby="feats-h">
          <div className="wrap">
            <div className="sbar">
              <span className="mk slbl">// SYSTEM SPECS</span>
              <span className="sln" aria-hidden="true" />
            </div>
            <h2 id="feats-h" className="sh">Enterprise power.<br />Zero friction.</h2>

            <dl className="bst">
              {([['16','AI Tools','One platform for all your document needs.'],['140+','Languages','Full internationalisation across every script.'],['99.9%','Uptime SLA','Always-on reliability you can count on.'],['<10ms','Response','Instant AI processing at any scale.']] as const).map(([v,l,d]) => (
                <div key={l} className="bsti">
                  <dt className="bstl mk">{l}</dt>
                  <dd className="bstv">{v}</dd>
                  <p className="bstd">{d}</p>
                </div>
              ))}
            </dl>

            <div className="fgrd">
              {([['⚡','LIGHTNING FAST','Sub-10ms responses. Optimised at every layer of the stack.'],['🔒','ZERO-KNOWLEDGE','Your data never leaves your control. End-to-end encrypted.'],['🧠','PRECISION AI','State-of-the-art AI precision-trained for document intelligence.'],['🌍','GLOBAL SCALE','140+ languages, multi-region deployments, 99.9% uptime SLA.']] as const).map(([ic,ti,de]) => (
                <div key={ti} className="fgi">
                  <span className="fgi-ic" aria-hidden="true">{ic}</span>
                  <span className="fgi-ti mk">{ti}</span>
                  <span className="fgi-de">{de}</span>
                </div>
              ))}
            </div>

            <div className="ctaw">
              <Link href="/editor" className="btnp">
                Start Free — No signup needed
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="foot" role="contentinfo">
          <div className="wrap foot-in">
            <Link href="/" className="wm" aria-label="EditPDF AI — home">
              <span className="wm-spark" aria-hidden="true">✦</span>
              <span className="wm-txt wm-sm">EDITPDF<span className="wm-ai">.AI</span></span>
            </Link>
            <nav aria-label="Footer navigation" className="fnav">
              <Link href="/editor">AI PDF Editor</Link>
              <a href="#tools">All Modules</a>
              <a href="#features">System Specs</a>
            </nav>
            <p className="fcopy mk">© {new Date().getFullYear()} EDITPDF AI · ALL RIGHTS RESERVED</p>
          </div>
        </footer>

      </div>

      {/* ════ STYLES ════ */}
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        html,body{background:#020208;overflow:auto!important}

        :root{
          --bg:#020208;
          --fg:#eef2ff;
          --fg2:rgba(238,242,255,.62);
          --fg3:rgba(238,242,255,.3);
          --fg4:rgba(238,242,255,.1);
          --b:rgba(255,255,255,.06);
          --bh:rgba(255,255,255,.11);
          --ind:#6366f1;
          --ind2:#818cf8;
          --ind3:#a5b4fc;
          --grn:#4ade80;
          --fd:var(--font-syne,'Syne',sans-serif);
          --fu:var(--font-space,'Space Grotesk',sans-serif);
          --fm:var(--font-mono,'JetBrains Mono',monospace);
        }

        .pg{min-height:100vh;background:var(--bg);color:var(--fg);font-family:var(--fu);position:relative;overflow-x:hidden}
        .mk{font-family:var(--fm);font-size:.8em;letter-spacing:.07em}
        .wrap{max-width:1240px;margin:0 auto;padding:0 32px}

        /* Ambient */
        .amb{position:fixed;inset:0;pointer-events:none;z-index:0}
        .ag1{position:absolute;width:900px;height:900px;top:-220px;left:-180px;background:radial-gradient(circle,rgba(99,102,241,.17) 0%,transparent 70%);filter:blur(100px);animation:adrift 28s ease-in-out infinite alternate}
        .ag2{position:absolute;width:700px;height:700px;bottom:-120px;right:-80px;background:radial-gradient(circle,rgba(34,211,238,.11) 0%,transparent 70%);filter:blur(100px);animation:adrift 36s ease-in-out infinite alternate-reverse}
        .agr{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px);background-size:64px 64px}
        @keyframes adrift{0%{transform:translate(0,0) scale(1)}100%{transform:translate(46px,28px) scale(1.08)}}

        /* Nav */
        .nav{position:sticky;top:0;z-index:100;background:rgba(2,2,8,.86);backdrop-filter:blur(24px) saturate(160%);border-bottom:1px solid var(--b)}
        .nav-in{max-width:1240px;margin:0 auto;padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between}
        .nav-lnks{display:flex;gap:26px}
        .nav-a{font-size:13px;font-weight:500;color:var(--fg3);text-decoration:none;transition:color .15s;letter-spacing:.02em}
        .nav-a:hover{color:var(--fg2)}
        .nav-r{display:flex;align-items:center;gap:18px}
        .pill{display:flex;align-items:center;gap:6px;font-size:9px;font-family:var(--fm);letter-spacing:.12em;color:rgba(74,222,128,.72)}
        .pill-dot{width:5px;height:5px;border-radius:50%;background:var(--grn);box-shadow:0 0 7px var(--grn);animation:blink 2s ease-in-out infinite}
        .nav-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;background:var(--ind);border-radius:7px;font-size:12.5px;font-weight:600;color:#fff;text-decoration:none;transition:background .15s,transform .15s}
        .nav-btn:hover{background:var(--ind2);transform:translateY(-1px)}

        /* Wordmark */
        .wm{display:flex;align-items:center;gap:8px;text-decoration:none}
        .wm-spark{font-size:15px;color:var(--ind2);filter:drop-shadow(0 0 9px rgba(129,140,248,.8));animation:spk 3s ease-in-out infinite}
        .wm-txt{font-family:var(--fd);font-size:16px;font-weight:800;color:var(--fg);letter-spacing:-.01em}
        .wm-ai{color:var(--ind2)}
        .wm-sm{font-size:14px}
        @keyframes spk{0%,100%{filter:drop-shadow(0 0 9px rgba(129,140,248,.8))}50%{filter:drop-shadow(0 0 18px rgba(129,140,248,1))}}

        /* Hero */
        .hero{position:relative;z-index:1;padding-bottom:80px}
        .hero-in{display:grid;grid-template-columns:1fr 360px;gap:64px;align-items:center;min-height:calc(100vh - 60px);padding:64px 0}
        .hl{display:flex;flex-direction:column}

        .hbadge{display:inline-flex;align-items:center;gap:8px;padding:5px 12px;border:1px solid rgba(129,140,248,.22);border-radius:4px;background:rgba(129,140,248,.08);margin-bottom:24px;width:fit-content;font-size:9px;letter-spacing:.14em;color:rgba(74,222,128,.82)}
        .hbdot{width:5px;height:5px;border-radius:50%;background:var(--grn);box-shadow:0 0 6px var(--grn);animation:blink 2s ease-in-out infinite;display:inline-block}

        .h1{font-family:var(--fd);font-weight:800;margin-bottom:22px;line-height:.95}
        .h1s{display:block;font-size:clamp(22px,3vw,38px);color:var(--fg3);margin-bottom:4px}
        .h1m{display:block;font-size:clamp(56px,8.5vw,108px);letter-spacing:-.04em;background:linear-gradient(110deg,#f1f5f9 0%,var(--ind3) 42%,#f1f5f9 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 5s linear infinite}
        @keyframes tflow{0%{background-position:0% center}100%{background-position:200% center}}

        .hcopy{font-size:15.5px;line-height:1.8;color:var(--fg2);margin-bottom:36px}
        .hacts{display:flex;gap:12px;margin-bottom:48px;flex-wrap:wrap}

        .btnp{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;background:var(--ind);border-radius:8px;font-size:13.5px;font-weight:700;color:#fff;text-decoration:none;transition:background .15s,transform .15s,box-shadow .15s;letter-spacing:.01em}
        .btnp:hover{background:var(--ind2);transform:translateY(-2px);box-shadow:0 12px 32px rgba(99,102,241,.4)}
        .btng{display:inline-flex;align-items:center;gap:6px;padding:13px 20px;border:1px solid var(--bh);border-radius:8px;font-size:13px;font-weight:500;color:var(--fg3);text-decoration:none;transition:all .15s}
        .btng:hover{border-color:rgba(255,255,255,.2);color:var(--fg2)}

        .hst{display:flex;align-items:stretch;border:1px solid var(--b);border-radius:10px;overflow:hidden;width:fit-content}
        .hsti{display:flex;flex-direction:column;align-items:center;padding:14px 22px;border-right:1px solid var(--b)}
        .hsti:last-child{border-right:none}
        .hstv{font-family:var(--fd);font-size:22px;font-weight:800;letter-spacing:-.03em;color:var(--fg)}
        .hstl{font-size:8.5px;color:var(--fg3);letter-spacing:.12em;text-transform:uppercase;margin-top:3px}

        /* Doc visual */
        .hr{display:flex;align-items:center;justify-content:center}
        .doc{position:relative;width:268px;height:358px;background:rgba(10,10,22,.96);border:1px solid rgba(99,102,241,.24);border-radius:16px;padding:20px 18px 16px;box-shadow:0 0 0 1px rgba(99,102,241,.07),0 32px 80px -14px rgba(99,102,241,.4),inset 0 1px 0 rgba(255,255,255,.04);overflow:hidden}
        .doc-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.26);border-radius:3px;font-size:8px;letter-spacing:.1em;color:rgba(165,180,252,.88);margin-bottom:12px}
        .dp-dot{width:4px;height:4px;border-radius:50%;background:var(--ind2);box-shadow:0 0 5px var(--ind2);animation:blink 1.5s ease-in-out infinite;display:inline-block}
        .doc-head{display:flex;align-items:center;gap:7px;padding-bottom:10px;border-bottom:1px solid var(--b);margin-bottom:14px;color:var(--fg3);font-size:10px;letter-spacing:.05em}
        .doc-body{display:flex;flex-direction:column}

        .dl{height:5px;background:rgba(238,242,255,.08);border-radius:3px;margin-bottom:7px;animation:growin .5s ease-out both;transform-origin:left}
        .dw90{width:90%}.dw72{width:72%}.dw84{width:84%}.dw62{width:62%}.dw80{width:80%}
        .dd1{animation-delay:.1s}.dd2{animation-delay:.22s}.dd3{animation-delay:.34s}
        .dd6{animation-delay:.8s}.dd7{animation-delay:.92s}
        .dgap{height:10px}

        .dfield{display:flex;align-items:center;gap:6px;height:24px;border:1px solid rgba(99,102,241,.36);border-radius:5px;padding:0 8px;margin-bottom:8px;background:rgba(99,102,241,.08);animation:findin .35s ease-out both}
        .dd4{animation-delay:.5s}.dd5{animation-delay:.66s}
        .dfl{font-size:8px;color:var(--fg3);letter-spacing:.1em;min-width:30px}
        .dfv{font-size:9px;color:rgba(165,180,252,.92);font-family:var(--fm);flex:1;overflow:hidden;white-space:nowrap}
        .dfs{font-size:9px;color:var(--ind2);filter:drop-shadow(0 0 3px var(--ind2));animation:blink 2s ease-in-out infinite}

        .dsig{display:flex;flex-direction:column;gap:4px;margin-top:2px;animation:findin .35s ease-out both}
        .dd8{animation-delay:1.05s}
        .dsig-l{display:block;width:68%;height:1.5px;background:rgba(99,102,241,.46);position:relative}
        .dsig-l::before{content:'';position:absolute;top:-8px;left:0;width:54%;height:1px;background:rgba(99,102,241,.34);transform:rotate(-4deg)}
        .dsig-txt{font-size:7.5px;color:var(--fg3);letter-spacing:.12em}

        .doc-ok{position:absolute;bottom:14px;right:16px;display:flex;align-items:center;gap:5px;animation:findin .3s ease-out 1.3s both}
        .dok-dot{width:4px;height:4px;border-radius:50%;background:var(--grn);box-shadow:0 0 5px var(--grn)}
        .doc-ok .mk{font-size:7.5px;color:rgba(74,222,128,.77);letter-spacing:.1em}
        .doc-glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(99,102,241,.07) 0%,transparent 70%);pointer-events:none}

        @keyframes growin{from{opacity:0;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}
        @keyframes findin{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.22}}

        /* Ticker */
        .ticker{position:relative;z-index:1;overflow:hidden;border-top:1px solid var(--b);border-bottom:1px solid var(--b);padding:10px 0;background:rgba(255,255,255,.008)}
        .ticker-tr{display:inline-flex;width:max-content;animation:roll 55s linear infinite;white-space:nowrap}
        .ti{display:inline-flex;align-items:center;gap:10px;padding:0 18px}
        .ti-s{font-size:7px;color:var(--ind2);opacity:.5}
        .ti-n{font-size:9.5px;letter-spacing:.1em;color:var(--fg3)}
        @keyframes roll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        /* Section shared */
        .sbar{display:flex;align-items:center;gap:16px;margin-bottom:22px}
        .slbl{font-size:9.5px;font-weight:700;letter-spacing:.18em;color:rgba(129,140,248,.5);white-space:nowrap}
        .sln{flex:1;height:1px;background:linear-gradient(90deg,rgba(99,102,241,.2),transparent)}
        .scnt{font-size:9.5px;letter-spacing:.12em;color:var(--fg3);white-space:nowrap}
        .sh{font-family:var(--fd);font-size:clamp(26px,3.8vw,44px);font-weight:800;letter-spacing:-.03em;color:var(--fg);margin-bottom:10px;line-height:1.08}
        .ssp{font-size:14px;color:var(--fg3);margin-bottom:52px;line-height:1.7}

        /* Tools section */
        .tsec{position:relative;z-index:1;padding:90px 0}

        /* Featured card */
        .fc{display:flex;border:1px solid rgba(99,102,241,.28);border-radius:16px;overflow:hidden;background:rgba(99,102,241,.04);margin-bottom:16px;text-decoration:none;color:inherit;transition:border-color .22s,box-shadow .22s,transform .22s;position:relative}
        .fc::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(99,102,241,.07) 0%,transparent 55%);pointer-events:none}
        .fc:hover{border-color:rgba(129,140,248,.5);box-shadow:0 20px 60px -10px rgba(99,102,241,.3);transform:translateY(-3px)}

        .fcl{flex:1;padding:38px 40px;display:flex;flex-direction:column}
        .fcr{width:250px;background:rgba(99,102,241,.04);border-left:1px solid rgba(99,102,241,.1);display:flex;flex-direction:column;justify-content:center;padding:28px 24px;gap:8px}
        .fcr-lbl{font-size:9px;letter-spacing:.14em;color:var(--fg3);margin-bottom:4px}

        .fctag{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.22);border-radius:4px;font-size:9px;letter-spacing:.1em;color:rgba(74,222,128,.82);margin-bottom:16px;width:fit-content}
        .fctd{width:5px;height:5px;border-radius:50%;background:var(--grn);animation:blink 2s ease-in-out infinite;display:inline-block}
        .fcico{color:var(--ind2);margin-bottom:12px;opacity:.85}
        .fcico svg{display:block}
        .fcname{font-family:var(--fd);font-size:26px;font-weight:800;color:var(--fg);letter-spacing:-.02em;margin-bottom:10px}
        .fcdesc{font-size:13.5px;color:var(--fg2);line-height:1.7;margin-bottom:20px}
        .fccaps{list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:28px}
        .fcci{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--fg3)}
        .fcci span{font-size:10px;color:var(--ind2);font-weight:700}
        .fccta{display:inline-flex;align-items:center;gap:7px;padding:11px 22px;background:var(--ind);border-radius:7px;font-size:12.5px;font-weight:700;color:#fff;width:fit-content;transition:background .15s}
        .fc:hover .fccta{background:var(--ind2)}

        .fcd{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--fg2);padding:7px 10px;border:1px solid var(--b);border-radius:6px;background:rgba(255,255,255,.014);animation:findin .3s ease-out both}
        .fcd-ck{font-size:9px;color:var(--ind2);font-weight:700}

        /* Tool grid */
        .tgrid{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:9px}
        .tc{display:flex;flex-direction:column;height:100%;padding:17px;border-radius:10px;border:1px solid var(--b);background:rgba(255,255,255,.016);transition:border-color .2s,background .2s,transform .2s;cursor:default}
        .tc:hover{border-color:rgba(var(--cr,129,140,248),.22);background:rgba(var(--cr,129,140,248),.04);transform:translateY(-2px)}
        .tc-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
        .tc-ic{color:rgba(238,242,255,.14);line-height:0;transition:color .2s}
        .tc:hover .tc-ic{color:rgba(var(--cr,129,140,248),.55)}
        .tc-ic svg{display:block}
        .tc-tag{padding:2px 7px;border-radius:3px;font-size:8px;font-weight:700;letter-spacing:.1em}
        .tc-soon{background:rgba(255,255,255,.05);color:var(--fg3);border:1px solid var(--b)}
        .tc-beta{background:rgba(34,211,170,.1);color:#6ee7b7;border:1px solid rgba(34,211,170,.2)}
        .tc-name{font-size:13px;font-weight:600;color:rgba(238,242,255,.65);letter-spacing:-.01em;margin-bottom:6px}
        .tc-desc{font-size:11.5px;color:var(--fg3);line-height:1.65;flex:1;margin-bottom:12px}
        .tc-cat{font-size:9px;letter-spacing:.12em;color:rgba(238,242,255,.15);text-transform:uppercase}

        /* Features */
        .fsec{position:relative;z-index:1;padding:90px 0;border-top:1px solid var(--b)}
        .bst{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--b);border-radius:12px;overflow:hidden;margin-bottom:48px}
        .bsti{padding:30px 24px;border-right:1px solid var(--b);text-align:center}
        .bsti:last-child{border-right:none}
        .bstl{display:block;font-size:9px;letter-spacing:.14em;color:var(--ind2);text-transform:uppercase;margin-bottom:8px}
        .bstv{display:block;font-family:var(--fd);font-size:38px;font-weight:800;letter-spacing:-.04em;color:var(--fg);margin-bottom:8px}
        .bstd{font-size:11.5px;color:var(--fg3);line-height:1.6}
        .fgrd{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:48px}
        .fgi{display:flex;flex-direction:column;gap:8px;padding:20px 18px;border:1px solid var(--b);border-radius:10px;background:rgba(255,255,255,.014);transition:border-color .2s}
        .fgi:hover{border-color:rgba(99,102,241,.2)}
        .fgi-ic{font-size:20px}
        .fgi-ti{font-size:10px;font-weight:700;letter-spacing:.12em;color:rgba(238,242,255,.75)}
        .fgi-de{font-size:12px;color:var(--fg3);line-height:1.6}
        .ctaw{text-align:center}

        /* Footer */
        .foot{position:relative;z-index:1;padding:32px 0;border-top:1px solid var(--b);background:rgba(255,255,255,.007)}
        .foot-in{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .fnav{display:flex;gap:20px}
        .fnav a{font-size:12px;color:var(--fg3);text-decoration:none;font-weight:500;transition:color .15s}
        .fnav a:hover{color:var(--fg2)}
        .fcopy{font-size:9.5px;letter-spacing:.08em;color:var(--fg3)}

        /* Responsive */
        @media(max-width:1024px){
          .hero-in{grid-template-columns:1fr;min-height:auto;padding:60px 0}
          .hr{display:none}
          .bst{grid-template-columns:repeat(2,1fr)}
          .bsti{border-bottom:1px solid var(--b)}
          .bsti:nth-child(2n){border-right:none}
          .bsti:nth-last-child(-n+2){border-bottom:none}
          .fgrd{grid-template-columns:repeat(2,1fr)}
          .fcr{display:none}
          .fcl{padding:28px 24px}
        }
        @media(max-width:768px){
          .nav-lnks{display:none}
          .hst{flex-direction:column;width:100%}
          .hsti{border-right:none;border-bottom:1px solid var(--b);flex-direction:row;justify-content:space-between;align-items:center;gap:12px}
          .hsti:last-child{border-bottom:none}
          .tgrid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:640px){
          .wrap{padding:0 18px}
          .hero-in{padding:48px 0}
          .bst{grid-template-columns:1fr 1fr}
          .fgrd{grid-template-columns:1fr}
          .tgrid{grid-template-columns:1fr}
          .foot-in{flex-direction:column;align-items:center;text-align:center}
          .fnav{flex-wrap:wrap;justify-content:center}
        }

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:var(--bg)}
        ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.3);border-radius:2px}
        :focus-visible{outline:2px solid var(--ind2);outline-offset:3px}
      `}</style>
    </>
  )
}
