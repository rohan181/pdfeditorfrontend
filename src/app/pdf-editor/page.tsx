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
.ag1{position:absolute;width:900px;height:900px;top:-350px;left:-250px;background:radial-gradient(circle,rgba(34,211,238,.18) 0%,transparent 65%);filter:blur(90px);animation:orb1 28s ease-in-out infinite alternate}
.ag2{position:absolute;width:700px;height:700px;top:20%;right:-180px;background:radial-gradient(circle,rgba(139,92,246,.14) 0%,transparent 65%);filter:blur(80px);animation:orb2 35s ease-in-out infinite alternate}
.ag3{position:absolute;width:600px;height:600px;bottom:0;left:20%;background:radial-gradient(circle,rgba(34,211,238,.1) 0%,transparent 65%);filter:blur(80px);animation:orb1 42s ease-in-out infinite alternate-reverse}
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
.open-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 20px;background:linear-gradient(135deg,#22d3ee 0%,#0891b2 100%);border-radius:8px;font-family:var(--fd);font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:opacity .15s,transform .15s,box-shadow .15s;box-shadow:0 4px 18px rgba(14,165,233,.35)}
.open-btn:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 28px rgba(14,165,233,.45)}

/* Hero */
.hero{position:relative;z-index:1;padding:90px 0 80px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.25);border-radius:20px;font-family:var(--fm);font-size:9.5px;letter-spacing:.16em;color:var(--c);margin-bottom:28px}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--c);box-shadow:0 0 6px var(--c);animation:blink 2s ease-in-out infinite}
.hero-h1{font-family:var(--fd);font-weight:800;letter-spacing:-.05em;line-height:.95;margin-bottom:24px}
.h1-top{display:block;font-size:clamp(14px,2vw,20px);color:var(--fg3);font-weight:500;letter-spacing:-.01em;margin-bottom:12px;font-family:var(--fu)}
.h1-main{display:block;font-size:clamp(48px,8vw,92px);background:linear-gradient(115deg,#f0f4ff 10%,#22d3ee 45%,#818cf8 75%,#f0f4ff 100%);background-size:260% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 6s linear infinite}
.hero-sub{font-size:clamp(15px,1.8vw,17px);color:var(--fg2);line-height:1.78;max-width:640px;margin:0 auto 40px}
.hero-cta-row{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:52px}
.btn-primary{display:inline-flex;align-items:center;gap:9px;padding:15px 32px;background:linear-gradient(135deg,#22d3ee 0%,#0891b2 100%);border-radius:12px;font-family:var(--fd);font-size:15px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:transform .18s,box-shadow .18s;box-shadow:0 8px 32px rgba(14,165,233,.4)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(14,165,233,.52)}
.btn-sec{display:inline-flex;align-items:center;gap:8px;padding:15px 26px;background:rgba(255,255,255,.04);border:1px solid var(--bh);border-radius:12px;font-size:14px;font-weight:500;color:var(--fg2);text-decoration:none;transition:all .18s}
.btn-sec:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.2);color:var(--fg)}
.hero-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.hpill{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(255,255,255,.04);border:1px solid var(--b);border-radius:20px;font-size:12px;color:var(--fg3)}
.hpill strong{color:var(--fg2);font-weight:600}

/* Section shared */
.sec-eyebrow{font-family:var(--fm);font-size:9.5px;letter-spacing:.18em;color:rgba(34,211,238,.7);display:block;margin-bottom:12px;text-transform:uppercase}
.sec-h{font-family:var(--fd);font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.04em;color:var(--fg);line-height:1.06;margin-bottom:14px}
.sec-sub{font-size:15px;color:var(--fg3);line-height:1.72;max-width:520px}

/* Tools showcase */
.tools-sec{position:relative;z-index:1;padding:96px 0;border-top:1px solid var(--b)}
.tools-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:52px}
.tcard{padding:24px 20px;background:rgba(255,255,255,.025);border:1px solid var(--b);border-radius:16px;transition:border-color .22s,transform .2s,box-shadow .2s;position:relative;overflow:hidden}
.tcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--bar,linear-gradient(90deg,#22d3ee,#0891b2));border-radius:16px 16px 0 0;opacity:.7}
.tcard:hover{border-color:rgba(34,211,238,.3);transform:translateY(-3px);box-shadow:0 18px 48px -12px rgba(34,211,238,.15)}
.tcard-icon{font-size:26px;margin-bottom:14px;display:block}
.tcard-title{font-family:var(--fd);font-size:14px;font-weight:700;color:var(--fg);letter-spacing:-.02em;margin-bottom:7px}
.tcard-desc{font-size:12.5px;color:var(--fg3);line-height:1.6}

/* Steps */
.steps-sec{position:relative;z-index:1;padding:0 0 96px;border-top:1px solid var(--b)}
.steps-sec .inner{padding-top:96px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:52px;position:relative}
.steps::before{content:'';position:absolute;top:27px;left:calc(16.67% + 16px);right:calc(16.67% + 16px);height:1px;background:linear-gradient(90deg,rgba(34,211,238,.6),rgba(139,92,246,.6));z-index:0}
.step{position:relative;z-index:1;padding:32px 28px;background:rgba(255,255,255,.02);border:1px solid var(--b);border-radius:18px;text-align:center;transition:border-color .22s,transform .2s}
.step:hover{border-color:rgba(34,211,238,.3);transform:translateY(-3px)}
.step-num{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:22px;font-weight:800;color:#fff;margin:0 auto 20px;background:linear-gradient(135deg,#22d3ee,#0891b2);box-shadow:0 6px 24px rgba(14,165,233,.4)}
.step-title{font-family:var(--fd);font-size:18px;font-weight:700;color:var(--fg);margin-bottom:10px;letter-spacing:-.02em}
.step-desc{font-size:13.5px;color:var(--fg3);line-height:1.68}

/* FAQ */
.faq-sec{position:relative;z-index:1;padding:0 0 96px}
.faq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:52px}
.fq{padding:28px 30px;background:rgba(255,255,255,.025);border:1px solid var(--b);border-radius:16px;transition:border-color .18s}
.fq:hover{border-color:rgba(34,211,238,.2)}
.fq-q{font-family:var(--fd);font-size:15px;font-weight:700;color:var(--fg);letter-spacing:-.02em;margin-bottom:10px;display:flex;align-items:flex-start;gap:10px}
.fq-ic{color:var(--c);flex-shrink:0;font-size:14px;margin-top:2px}
.fq-a{font-size:13.5px;color:var(--fg3);line-height:1.7;padding-left:24px}

/* CTA */
.cta-ban{position:relative;z-index:1;padding:0 0 96px}
.cta-inner{background:rgba(34,211,238,.05);border:1px solid rgba(34,211,238,.18);border-radius:24px;padding:72px 48px;text-align:center;position:relative;overflow:hidden}
.cta-inner::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(34,211,238,.08) 0%,rgba(139,92,246,.04) 60%,transparent 80%);pointer-events:none}
.cta-glow{position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(34,211,238,.18) 0%,transparent 70%);filter:blur(40px);pointer-events:none}
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
@media(max-width:1000px){.tools-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .steps{grid-template-columns:1fr;gap:12px}
  .steps::before{display:none}
  .faq-grid{grid-template-columns:1fr}
  .cta-inner{padding:48px 24px}
}
@media(max-width:600px){
  .wrap{padding:0 20px}
  .tools-grid{grid-template-columns:1fr 1fr}
  .hero{padding:60px 0 52px}
  .hero-cta-row{flex-direction:column;align-items:stretch}
  .btn-primary,.btn-sec{justify-content:center}
  .foot-in{flex-direction:column;align-items:center;text-align:center}
  .foot-nav{justify-content:center}
  .h1-main{font-size:clamp(40px,12vw,68px)}
}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:rgba(34,211,238,.25);border-radius:2px}
:focus-visible{outline:2px solid var(--c);outline-offset:3px}
`

const TOOLS = [
  { icon: '📝', title: 'Text Editor', desc: 'Click anywhere to add or edit text. Change font, size, color and opacity on any PDF.', bar: 'linear-gradient(90deg,#22d3ee,#0891b2)' },
  { icon: '🖼️', title: 'Image Insertion', desc: 'Insert photos, logos or graphics onto any page. Resize and reposition freely.', bar: 'linear-gradient(90deg,#a78bfa,#6d28d9)' },
  { icon: '✍️', title: 'Signatures', desc: 'Draw, type or upload your signature and place it with pixel precision anywhere on the page.', bar: 'linear-gradient(90deg,#f59e0b,#b45309)' },
  { icon: '🔆', title: 'Highlights & Markup', desc: 'Highlight text, draw freehand, add sticky notes and annotation boxes.', bar: 'linear-gradient(90deg,#4ade80,#16a34a)' },
  { icon: '🔷', title: 'Shapes & Lines', desc: 'Draw rectangles, ellipses, arrows, lines and polygons with custom stroke and fill.', bar: 'linear-gradient(90deg,#38bdf8,#0369a1)' },
  { icon: '🏷️', title: 'Stamps & Watermarks', desc: 'Apply APPROVED, CONFIDENTIAL, DRAFT and custom stamps. Add text or image watermarks.', bar: 'linear-gradient(90deg,#f472b6,#be185d)' },
  { icon: '📄', title: 'Page Manager', desc: 'Reorder, rotate, delete or add blank pages. Drag thumbnails to reorganise any PDF.', bar: 'linear-gradient(90deg,#fb923c,#b45309)' },
  { icon: '⬇️', title: 'Instant Export', desc: 'Download your edited PDF in one click — every change preserved with full fidelity.', bar: 'linear-gradient(90deg,#67e8f9,#0e7490)' },
]

const FAQS = [
  { q: 'Can I edit any PDF for free?', a: 'Yes. The PDF Editor is completely free with no subscription, no credit card and no account required. Upload any PDF and start editing immediately.' },
  { q: 'Does the editor work on scanned documents?', a: 'Yes. The built-in OCR engine detects and makes scanned, image-based PDFs fully editable so you can overlay text and annotations anywhere.' },
  { q: 'Can I add a digital signature?', a: 'Yes. Draw a freehand signature, type your name in a handwriting style, or upload a signature image and place it anywhere on the document with drag-and-drop precision.' },
  { q: 'Is my file uploaded to a server?', a: 'No. All editing happens locally inside your browser. Your PDF never leaves your device — nothing is stored or transmitted.' },
  { q: 'Can I reorder or delete pages?', a: 'Yes. Open the Page Manager panel to drag pages into any order, rotate individual pages, delete unwanted ones, or insert blank pages anywhere.' },
  { q: 'What is the difference between this and the AI Form Filler?', a: 'The PDF Editor focuses on manual editing — text, images, shapes, signatures and page management. The AI Form Filler adds conversational AI that detects and auto-fills form fields from your context.' },
]

export default function PDFEditorPage() {
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

      {/* Ambient */}
      <div className="amb" aria-hidden="true">
        <div className="ag1" /><div className="ag2" /><div className="ag3" /><div className="agr" />
      </div>

      {/* ── FULLSCREEN EDITOR OVERLAY ─────────────────────────── */}
      {editorOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          background: '#f8faff',
        }}>
          <PDFEditor hideChatFill hideAutoFill />
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
            <button className="open-btn" onClick={openEditor} aria-label="Open PDF editor">
              Open Editor
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
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
            <span className="h1-top">The complete toolkit for working with PDFs</span>
            <span className="h1-main">PDF Editor</span>
          </h1>
          <p className="hero-sub">
            Add text, images, shapes, highlights and signatures to any PDF. Manage pages, apply stamps, draw freehand and download — instantly, in your browser, for free.
          </p>
          <div className="hero-cta-row">
            <button className="btn-primary" onClick={openEditor} aria-label="Open PDF editor">
              Edit a PDF — Free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <Link href="/ai-pdf-form-filler" className="btn-sec">AI Form Filler →</Link>
          </div>
          <div className="hero-pills" role="list" aria-label="Key features">
            {(['📝 Text', '🖼️ Images', '✍️ Signatures', '🔆 Highlights', '🔷 Shapes', '📄 Pages', '🏷️ Stamps', '⬇️ Export'] as const).map(f => (
              <div key={f} className="hpill" role="listitem"><strong>{f}</strong></div>
            ))}
          </div>
        </div>
      </header>

      {/* ── TOOLS SHOWCASE ──────────────────────────────────────── */}
      <section className="tools-sec" aria-labelledby="tools-h">
        <div className="wrap">
          <span className="sec-eyebrow">// EDITING TOOLS</span>
          <h2 id="tools-h" className="sec-h">8 tools. Every edit covered.</h2>
          <p className="sec-sub">Everything you need to mark up, sign and publish a PDF — no plugins, no account.</p>
          <div className="tools-grid" role="list">
            {TOOLS.map(({ icon, title, desc, bar }) => (
              <article key={title} className="tcard" role="listitem" style={{ '--bar': bar } as React.CSSProperties}>
                <span className="tcard-icon" aria-hidden="true">{icon}</span>
                <h3 className="tcard-title">{title}</h3>
                <p className="tcard-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="steps-sec" aria-labelledby="how-h">
        <div className="wrap inner">
          <span className="sec-eyebrow">// HOW IT WORKS</span>
          <h2 id="how-h" className="sec-h">Open. Edit. Download.</h2>
          <p className="sec-sub">No learning curve. No install. Be done in seconds.</p>
          <div className="steps" role="list">
            {([
              ['1', 'Upload Your PDF', 'Drag and drop any PDF — scanned, flat or interactive. The editor loads it instantly inside your browser, no upload to any server.'],
              ['2', 'Make Your Edits', 'Use the toolbar to add text, images, shapes, highlights, signatures or stamps. Switch to Page Manager to reorder or rotate pages.'],
              ['3', 'Download Instantly', 'Hit Download to save a pixel-perfect PDF with every change preserved. Your file never leaves your device.'],
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

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="faq-sec" aria-labelledby="faq-h">
        <div className="wrap">
          <span className="sec-eyebrow">// FAQ</span>
          <h2 id="faq-h" className="sec-h">Common questions.</h2>
          <p className="sec-sub">Everything you need to know before opening your first PDF.</p>
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
            <h2 id="cta-h" className="cta-h">Your PDF, edited.<br />In seconds. Free.</h2>
            <p className="cta-sub">No account. No watermark. No limits.</p>
            <div className="hero-cta-row">
              <button className="btn-primary" onClick={openEditor}>
                Open PDF Editor
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <Link href="/ai-pdf-form-filler" className="btn-sec">Try AI Form Filler →</Link>
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
            <Link href="/pdf-editor">PDF Editor</Link>
            <Link href="/ai-pdf-form-filler">AI Form Filler</Link>
            <a href="/#tools">All Tools</a>
          </nav>
          <p className="foot-copy" suppressHydrationWarning>
            © {new Date().getFullYear()} EDITPDF AI · ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  )
}
