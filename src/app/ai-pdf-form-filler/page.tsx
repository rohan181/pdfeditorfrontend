'use client'
import { useState } from 'react'
import Link from 'next/link'
import PDFEditor from '@/components/PDFEditor'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
:root{
  --bg:#060612;--fg:#f0f4ff;--fg2:rgba(240,244,255,.65);--fg3:rgba(240,244,255,.35);
  --b:rgba(255,255,255,.07);--bh:rgba(255,255,255,.12);
  --p:#8b5cf6;--p2:#7c3aed;--pl:#a78bfa;--c:#22d3ee;--g:#4ade80;
  --fd:var(--font-jakarta,'Plus Jakarta Sans',sans-serif);
  --fu:var(--font-dm,'DM Sans',sans-serif);
  --fm:var(--font-mono,'JetBrains Mono',monospace);
}
.pg{min-height:100vh;background:var(--bg);color:var(--fg);font-family:var(--fu);overflow-x:hidden}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px}

/* Ambient */
.amb{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ag1{position:absolute;width:900px;height:900px;top:-350px;left:-250px;background:radial-gradient(circle,rgba(139,92,246,.2) 0%,transparent 65%);filter:blur(90px);animation:orb1 28s ease-in-out infinite alternate}
.ag2{position:absolute;width:700px;height:700px;top:20%;right:-180px;background:radial-gradient(circle,rgba(34,211,238,.14) 0%,transparent 65%);filter:blur(80px);animation:orb2 35s ease-in-out infinite alternate}
.ag3{position:absolute;width:600px;height:600px;bottom:0;left:20%;background:radial-gradient(circle,rgba(139,92,246,.12) 0%,transparent 65%);filter:blur(80px);animation:orb1 42s ease-in-out infinite alternate-reverse}
.agr{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px);background-size:30px 30px}
@keyframes orb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(60px,45px) scale(1.08)}}
@keyframes orb2{0%{transform:translate(0,0) scale(1.05)}100%{transform:translate(-45px,55px) scale(1)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes tflow{0%{background-position:0% center}100%{background-position:260% center}}

/* Nav */
.nav{position:sticky;top:0;z-index:200;height:62px;background:rgba(6,6,18,.88);backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--b);display:flex;align-items:center}
.nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%}
.wm{display:inline-flex;align-items:center;gap:9px;text-decoration:none;flex-shrink:0}
.wm-mark{width:30px;height:30px;background:linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(139,92,246,.45);flex-shrink:0}
.wm-inner{width:15px;height:18px;background:rgba(255,255,255,.95);clip-path:polygon(0% 0%,68% 0%,100% 26%,100% 100%,0% 100%)}
.wm-name{font-family:var(--fd);font-size:17px;font-weight:800;color:var(--fg);letter-spacing:-.03em}
.wm-name em{font-style:normal;color:var(--pl)}
.wm-badge{font-family:var(--fm);font-size:8px;font-weight:700;letter-spacing:.12em;color:var(--pl);background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.25);padding:2px 7px;border-radius:4px;margin-left:2px}
.nav-r{display:flex;align-items:center;gap:10px}
.back-link{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--fg3);text-decoration:none;padding:6px 12px;border-radius:7px;border:1px solid var(--b);transition:all .15s;font-weight:500}
.back-link:hover{color:var(--fg2);background:rgba(255,255,255,.04);border-color:var(--bh)}
.open-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 20px;background:linear-gradient(135deg,var(--p) 0%,var(--p2) 100%);border-radius:8px;font-family:var(--fd);font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:opacity .15s,transform .15s,box-shadow .15s;box-shadow:0 4px 18px rgba(124,58,237,.35)}
.open-btn:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 28px rgba(124,58,237,.45)}

/* Hero */
.hero{position:relative;z-index:1;padding:90px 0 80px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.28);border-radius:20px;font-family:var(--fm);font-size:9.5px;letter-spacing:.16em;color:var(--pl);margin-bottom:28px}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--pl);box-shadow:0 0 6px var(--pl);animation:blink 2s ease-in-out infinite}
.hero-h1{font-family:var(--fd);font-weight:800;letter-spacing:-.05em;line-height:.95;margin-bottom:24px}
.h1-top{display:block;font-size:clamp(14px,2vw,20px);color:var(--fg3);font-weight:500;letter-spacing:-.01em;margin-bottom:12px;font-family:var(--fu)}
.h1-main{display:block;font-size:clamp(48px,8vw,92px);background:linear-gradient(115deg,#f0f4ff 10%,#a78bfa 42%,#818cf8 68%,#22d3ee 100%);background-size:260% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 6s linear infinite}
.hero-sub{font-size:clamp(15px,1.8vw,17px);color:var(--fg2);line-height:1.78;max-width:640px;margin:0 auto 40px}
.hero-cta-row{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:52px}
.btn-primary{display:inline-flex;align-items:center;gap:9px;padding:15px 32px;background:linear-gradient(135deg,var(--p) 0%,var(--p2) 100%);border-radius:12px;font-family:var(--fd);font-size:15px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:transform .18s,box-shadow .18s;box-shadow:0 8px 32px rgba(139,92,246,.44)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(139,92,246,.54)}
.btn-sec{display:inline-flex;align-items:center;gap:8px;padding:15px 26px;background:rgba(255,255,255,.04);border:1px solid var(--bh);border-radius:12px;font-size:14px;font-weight:500;color:var(--fg2);text-decoration:none;transition:all .18s}
.btn-sec:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.2);color:var(--fg)}
.hero-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.hpill{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(255,255,255,.04);border:1px solid var(--b);border-radius:20px;font-size:12px;color:var(--fg3)}
.hpill strong{color:var(--fg2);font-weight:600}


/* Section shared */
.sec-eyebrow{font-family:var(--fm);font-size:9.5px;letter-spacing:.18em;color:rgba(167,139,250,.7);display:block;margin-bottom:12px;text-transform:uppercase}
.sec-h{font-family:var(--fd);font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.04em;color:var(--fg);line-height:1.06;margin-bottom:14px}
.sec-sub{font-size:15px;color:var(--fg3);line-height:1.72;max-width:520px}

/* Steps */
.how-sec{position:relative;z-index:1;padding:96px 0}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:56px;position:relative}
.steps::before{content:'';position:absolute;top:27px;left:calc(16.67% + 16px);right:calc(16.67% + 16px);height:1px;background:linear-gradient(90deg,rgba(139,92,246,.6),rgba(34,211,238,.6));z-index:0}
.step{position:relative;z-index:1;padding:32px 28px;background:rgba(255,255,255,.02);border:1px solid var(--b);border-radius:18px;text-align:center;transition:border-color .22s,transform .2s}
.step:hover{border-color:rgba(139,92,246,.3);transform:translateY(-3px)}
.step-num{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:22px;font-weight:800;color:#fff;margin:0 auto 20px;background:linear-gradient(135deg,var(--p),var(--p2));box-shadow:0 6px 24px rgba(139,92,246,.45)}
.step-title{font-family:var(--fd);font-size:18px;font-weight:700;color:var(--fg);margin-bottom:10px;letter-spacing:-.02em}
.step-desc{font-size:13.5px;color:var(--fg3);line-height:1.68}

/* Features */
.feat-sec{position:relative;z-index:1;padding:0 0 96px;border-top:1px solid var(--b)}
.feat-sec .inner{padding-top:96px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:56px}
.fg{padding:28px;background:rgba(255,255,255,.025);border:1px solid var(--b);border-radius:18px;transition:border-color .22s,transform .2s,box-shadow .22s;position:relative;overflow:hidden}
.fg::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--bar);opacity:.7;border-radius:18px 18px 0 0}
.fg:hover{border-color:rgba(139,92,246,.28);transform:translateY(-3px);box-shadow:0 20px 56px -14px rgba(139,92,246,.18)}
.fg-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;background:var(--ic)}
.fg-title{font-family:var(--fd);font-size:16px;font-weight:700;color:var(--fg);letter-spacing:-.025em;margin-bottom:8px}
.fg-desc{font-size:13px;color:var(--fg3);line-height:1.66}

/* FAQ */
.faq-sec{position:relative;z-index:1;padding:0 0 96px}
.faq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:52px}
.fq{padding:28px 30px;background:rgba(255,255,255,.025);border:1px solid var(--b);border-radius:16px;transition:border-color .18s}
.fq:hover{border-color:rgba(139,92,246,.22)}
.fq-q{font-family:var(--fd);font-size:15px;font-weight:700;color:var(--fg);letter-spacing:-.02em;margin-bottom:10px;display:flex;align-items:flex-start;gap:10px}
.fq-ic{color:var(--pl);flex-shrink:0;font-size:14px;margin-top:2px}
.fq-a{font-size:13.5px;color:var(--fg3);line-height:1.7;padding-left:24px}

/* CTA */
.cta-ban{position:relative;z-index:1;padding:0 0 96px}
.cta-inner{background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.2);border-radius:24px;padding:72px 48px;text-align:center;position:relative;overflow:hidden}
.cta-inner::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,92,246,.1) 0%,rgba(34,211,238,.04) 60%,transparent 80%);pointer-events:none}
.cta-glow{position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(139,92,246,.22) 0%,transparent 70%);filter:blur(40px);pointer-events:none}
.cta-h{font-family:var(--fd);font-size:clamp(28px,4vw,44px);font-weight:800;letter-spacing:-.04em;color:var(--fg);margin-bottom:14px;position:relative;line-height:1.07}
.cta-sub{font-size:16px;color:var(--fg2);margin-bottom:36px;position:relative}

/* Footer */
.foot{position:relative;z-index:1;border-top:1px solid var(--b);padding:36px 0}
.foot-in{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.foot-nav{display:flex;gap:20px;flex-wrap:wrap}
.foot-nav a{font-size:12.5px;color:var(--fg3);text-decoration:none;font-weight:500;transition:color .15s}
.foot-nav a:hover{color:var(--fg2)}
.foot-copy{font-family:var(--fm);font-size:9px;letter-spacing:.08em;color:var(--fg3)}

/* Responsive */
@media(max-width:900px){
  .feat-grid{grid-template-columns:repeat(2,1fr)}
  .steps{grid-template-columns:1fr;gap:12px}
  .steps::before{display:none}
  .faq-grid{grid-template-columns:1fr}
  .cta-inner{padding:48px 24px}

}
@media(max-width:600px){
  .wrap{padding:0 20px}
  .feat-grid{grid-template-columns:1fr}
  .hero{padding:60px 0 52px}
  .hero-cta-row{flex-direction:column;align-items:stretch}
  .btn-primary,.btn-sec{justify-content:center}
  .foot-in{flex-direction:column;align-items:center;text-align:center}
  .foot-nav{justify-content:center}
  .h1-main{font-size:clamp(40px,12vw,68px)}

}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:rgba(139,92,246,.3);border-radius:2px}
:focus-visible{outline:2px solid var(--pl);outline-offset:3px}
`

const FEATURES = [
  { icon: '🧠', title: 'AI Field Detection', desc: 'Paste your context once and AI automatically identifies every form field — name, date, address, checkboxes — and fills them in seconds.', ic: 'rgba(139,92,246,.12)', bar: 'linear-gradient(90deg,#8b5cf6,#6d28d9)' },
  { icon: '✍️', title: 'Digital Signatures', desc: 'Draw, type or upload your signature and place it anywhere with pixel-perfect precision. No third-party tools or browser extensions needed.', ic: 'rgba(245,158,11,.1)', bar: 'linear-gradient(90deg,#f59e0b,#d97706)' },
  { icon: '📝', title: 'Full Text Editing', desc: 'Click anywhere to add or edit text, change fonts, sizes and colors. Works seamlessly on both native and scanned PDF documents.', ic: 'rgba(34,211,238,.1)', bar: 'linear-gradient(90deg,#22d3ee,#0891b2)' },
  { icon: '🔍', title: 'OCR for Scanned PDFs', desc: 'Our built-in OCR engine reads image-based and scanned PDFs, detecting hidden form fields and making them editable instantly.', ic: 'rgba(74,222,128,.1)', bar: 'linear-gradient(90deg,#4ade80,#16a34a)' },
  { icon: '📄', title: 'Page Management', desc: 'Reorder, rotate, delete or add blank pages. Merge multiple PDFs into one document or split pages — all inside a single editor.', ic: 'rgba(244,114,182,.1)', bar: 'linear-gradient(90deg,#f472b6,#be185d)' },
  { icon: '⚡', title: 'Instant Download', desc: 'Export your completed PDF in one click. Full fidelity — every annotation, signature and filled field preserved exactly as placed.', ic: 'rgba(251,191,36,.1)', bar: 'linear-gradient(90deg,#fbbf24,#b45309)' },
]

const FAQS = [
  { q: 'What is an AI PDF form filler?', a: 'An AI PDF form filler detects input fields in a PDF and fills them automatically based on context you provide. Instead of clicking each field manually, you describe your details once and AI populates the entire form instantly.' },
  { q: 'Is it completely free to use?', a: 'Yes — 100% free with no hidden fees, no subscription and no credit card required. Open your PDF and start editing immediately, as many times as you need.' },
  { q: 'Do I need to create an account or sign up?', a: 'No account needed. Your browser handles everything locally — your documents never leave your device unless you trigger an AI feature, which only sends the relevant text context.' },
  { q: 'What types of PDFs are supported?', a: 'Both interactive PDF forms (AcroForms) and flat or scanned PDFs are supported. For scanned documents, the built-in OCR engine extracts text and detects field positions automatically.' },
  { q: 'Is my document data secure and private?', a: 'Your files are processed entirely in your browser and are never stored on our servers. AI features send only the relevant text context — never the raw file — and no data is retained after the request.' },
  { q: 'Can I add a digital signature to my PDF?', a: 'Yes. Draw a freehand signature, type your name in a handwriting style, or upload a signature image. Place it anywhere on the document with drag-and-drop precision.' },
]

export default function AIPDFFormFillerPage() {
  const [editorOpen, setEditorOpen] = useState(false)

  const openEditor = () => {
    setEditorOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeEditor = () => {
    setEditorOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <div className="pg">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── FULLSCREEN EDITOR OVERLAY ─────────────────────────── */}
      {editorOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          background: '#f8faff',
        }}>
          <PDFEditor />
          <button
            onClick={closeEditor}
            aria-label="Close editor"
            style={{
              position: 'absolute', top: 10, right: 14, zIndex: 10000,
              background: 'rgba(30,41,59,0.85)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', borderRadius: 8, padding: '4px 12px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              backdropFilter: 'blur(8px)', letterSpacing: '0.02em',
            }}
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* Ambient */}
      <div className="amb" aria-hidden="true">
        <div className="ag1" /><div className="ag2" /><div className="ag3" /><div className="agr" />
      </div>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="nav" aria-label="Site navigation">
        <div className="wrap nav-in">
          <Link href="/" className="wm" aria-label="EditPDF AI home">
            <span className="wm-mark" aria-hidden="true"><span className="wm-inner" /></span>
            <span className="wm-name">Edit<em>PDF</em></span>
            <span className="wm-badge">AI</span>
          </Link>
          <div className="nav-r">
            <Link href="/" className="back-link">← All Tools</Link>
            <button className="open-btn" onClick={openEditor} aria-label="Scroll to editor">
              Open Editor
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <header className="hero" aria-labelledby="hero-h1">
        <div className="wrap">
          <div className="hero-badge" aria-hidden="true">
            <span className="bdot" /><span>FREE · NO SIGNUP · BROWSER-BASED</span>
          </div>
          <h1 id="hero-h1" className="hero-h1">
            <span className="h1-top">The smartest way to fill PDF forms</span>
            <span className="h1-main">AI PDF Form Filler</span>
          </h1>
          <p className="hero-sub">
            Upload any PDF — flat, scanned, or interactive — and let AI detect every field and fill it in seconds.
            Add text, draw signatures, annotate and download. Free, instant, no account needed.
          </p>
          <div className="hero-cta-row">
            <button className="btn-primary" onClick={openEditor} aria-label="Scroll to PDF editor">
              Start Filling Free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
            <Link href="/" className="btn-sec">Browse all 16 tools</Link>
          </div>
          <div className="hero-pills" role="list" aria-label="Key features">
            {(['🧠 AI Auto-Fill', '✍️ E-Signatures', '🔍 OCR Scanner', '📝 Text Editor', '📄 Page Manager', '⚡ Instant Export'] as const).map(f => (
              <div key={f} className="hpill" role="listitem"><strong>{f}</strong></div>
            ))}
          </div>
        </div>
      </header>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="how-sec" aria-labelledby="how-h">
        <div className="wrap">
          <span className="sec-eyebrow">// HOW IT WORKS</span>
          <h2 id="how-h" className="sec-h">Three steps.<br />Your form, done.</h2>
          <p className="sec-sub">No learning curve, no plugins. Drop your PDF and be done in under a minute.</p>
          <div className="steps" role="list">
            {([
              ['1', 'Upload Your PDF', 'Drag and drop any PDF — interactive form, flat document or scanned page. The editor loads it instantly in your browser with no upload needed.'],
              ['2', 'AI Detects & Fills', 'Hit AI Fill, paste your details once, and watch the model populate every field automatically. Or fill manually with click-to-type anywhere on the page.'],
              ['3', 'Sign & Download', 'Draw your signature, add stamps or annotations, then export a pixel-perfect PDF in one click. Nothing is stored on any server.'],
            ] as const).map(([num, title, desc]) => (
              <article key={num} className="step" role="listitem">
                <div className="step-num" aria-hidden="true">{num}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section className="feat-sec" aria-labelledby="feat-h">
        <div className="wrap inner">
          <span className="sec-eyebrow">// CAPABILITIES</span>
          <h2 id="feat-h" className="sec-h">Everything you need<br />to work with PDFs.</h2>
          <p className="sec-sub">One editor. Every PDF task covered — no plugins, no extra apps, no subscription.</p>
          <div className="feat-grid" role="list">
            {FEATURES.map(({ icon, title, desc, ic, bar }) => (
              <article key={title} className="fg" role="listitem" style={{ '--ic': ic, '--bar': bar } as React.CSSProperties}>
                <div className="fg-icon" aria-hidden="true">{icon}</div>
                <h3 className="fg-title">{title}</h3>
                <p className="fg-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="faq-sec" aria-labelledby="faq-h">
        <div className="wrap">
          <span className="sec-eyebrow">// FAQ</span>
          <h2 id="faq-h" className="sec-h">Common questions.</h2>
          <p className="sec-sub">Everything you need to know before filling your first form.</p>
          <div className="faq-grid">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="fq">
                <div className="fq-q"><span className="fq-ic" aria-hidden="true">✦</span><span>{q}</span></div>
                <p className="fq-a">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section className="cta-ban" aria-labelledby="cta-h">
        <div className="wrap">
          <div className="cta-inner">
            <div className="cta-glow" aria-hidden="true" />
            <h2 id="cta-h" className="cta-h">Your PDF form is<br />one click away.</h2>
            <p className="cta-sub">Free. No account. No limits. No waiting.</p>
            <div className="hero-cta-row">
              <button className="btn-primary" onClick={openEditor}>
                Open AI PDF Form Filler
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="foot" role="contentinfo">
        <div className="wrap foot-in">
          <Link href="/" className="wm" aria-label="EditPDF AI home">
            <span className="wm-mark" aria-hidden="true"><span className="wm-inner" /></span>
            <span className="wm-name">Edit<em>PDF</em></span>
            <span className="wm-badge">AI</span>
          </Link>
          <nav className="foot-nav" aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/ai-pdf-form-filler">AI Form Filler</Link>
            <a href="/#tools">All Tools</a>
            <a href="/#features">Features</a>
          </nav>
          <p className="foot-copy" suppressHydrationWarning>
            © {new Date().getFullYear()} EDITPDF AI · ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  )
}
