'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import JsonLd from '@/components/JsonLd'
import ToolSEOSection from '@/components/ToolSEOSection'
import ToolQuickFacts from '@/components/ToolQuickFacts'
import { buildFaqStructuredData } from '@/lib/seo/structuredData'
import toolSeoData from '@/lib/toolSeoData'

// The editor pulls in PDF rendering and editing engines. Keep them out of the
// landing-page critical path and fetch them only after the visitor opens it.
const PDFEditor = dynamic(() => import('@/components/PDFEditor'), {
  ssr: false,
  loading: () => <div role="status" aria-live="polite" style={{margin:'auto',fontSize:14,color:'#475569'}}>Loading PDF editor…</div>,
})

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
:root{
  --bg:#ffffff;--fg:#1d1d1f;--fg2:rgba(29,29,31,.65);--fg3:rgba(29,29,31,.42);
  --b:rgba(0,0,0,.08);--bh:rgba(0,0,0,.14);
  --p:#2563eb;--p2:#1d4ed8;--pl:#3b82f6;--c:#0891b2;--g:#16a34a;
  --fd:var(--font-jakarta,'Plus Jakarta Sans',sans-serif);
  --fu:var(--font-dm,'DM Sans',sans-serif);
  --fm:var(--font-mono,'JetBrains Mono',monospace);
}
.pg{min-height:100vh;background:#f5f5f7;color:var(--fg);font-family:var(--fu);overflow-x:hidden}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px}

/* Ambient */
.amb{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ag1{position:absolute;width:900px;height:900px;top:-350px;left:-250px;background:radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 65%);filter:blur(90px);animation:orb1 28s ease-in-out infinite alternate}
.ag2{position:absolute;width:700px;height:700px;top:20%;right:-180px;background:radial-gradient(circle,rgba(8,145,178,.04) 0%,transparent 65%);filter:blur(80px);animation:orb2 35s ease-in-out infinite alternate}
.ag3{position:absolute;width:600px;height:600px;bottom:0;left:20%;background:radial-gradient(circle,rgba(37,99,235,.03) 0%,transparent 65%);filter:blur(80px);animation:orb1 42s ease-in-out infinite alternate-reverse}
.agr{position:absolute;inset:0;background-image:radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px);background-size:30px 30px}
@keyframes orb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(60px,45px) scale(1.08)}}
@keyframes orb2{0%{transform:translate(0,0) scale(1.05)}100%{transform:translate(-45px,55px) scale(1)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes tflow{0%{background-position:0% center}100%{background-position:260% center}}

/* Hero */
.hero{position:relative;z-index:1;padding:calc(56px + 90px) 0 80px;text-align:center;background:#fff}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(37,99,235,.07);border:1px solid rgba(37,99,235,.2);border-radius:20px;font-family:var(--fm);font-size:9.5px;letter-spacing:.16em;color:var(--p);margin-bottom:28px}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--p);box-shadow:0 0 6px var(--p);animation:blink 2s ease-in-out infinite}
.hero-h1{font-family:var(--fd);font-weight:800;letter-spacing:-.05em;line-height:.95;margin-bottom:24px}
.h1-top{display:block;font-size:clamp(14px,2vw,20px);color:var(--fg3);font-weight:500;letter-spacing:-.01em;margin-bottom:12px;font-family:var(--fu)}
.h1-main{display:block;font-size:clamp(48px,8vw,92px);background:linear-gradient(115deg,#1d1d1f 10%,#2563eb 45%,#0891b2 75%,#1d1d1f 100%);background-size:260% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 6s linear infinite}
.hero-sub{font-size:clamp(15px,1.8vw,17px);color:var(--fg2);line-height:1.78;max-width:640px;margin:0 auto 40px}
.hero-cta-row{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:52px}
.btn-primary{display:inline-flex;align-items:center;gap:9px;padding:15px 32px;background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:12px;font-family:var(--fd);font-size:15px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:transform .18s,box-shadow .18s;box-shadow:0 8px 32px rgba(37,99,235,.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(37,99,235,.4)}
.btn-sec{display:inline-flex;align-items:center;gap:8px;padding:15px 26px;background:#fff;border:1.5px solid #e5e7eb;border-radius:12px;font-size:14px;font-weight:500;color:var(--fg2);text-decoration:none;transition:all .18s}
.btn-sec:hover{background:#f9fafb;border-color:#d1d5db;color:var(--fg)}
.hero-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.hpill{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:20px;font-size:12px;color:var(--fg3)}
.hpill strong{color:var(--fg2);font-weight:600}

/* Section shared */
.sec-eyebrow{font-family:var(--fm);font-size:9.5px;letter-spacing:.18em;color:var(--p);display:block;margin-bottom:12px;text-transform:uppercase;opacity:.8}
.sec-h{font-family:var(--fd);font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;line-height:1.06;margin-bottom:14px}
.sec-sub{font-size:15px;color:var(--fg3);line-height:1.72;max-width:520px}

/* Tools showcase */
.tools-sec{position:relative;z-index:1;padding:96px 0;border-top:1px solid #f0f0f0;background:#f5f5f7}
.tools-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:52px}
.tcard{padding:24px 20px;background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;transition:border-color .22s,transform .2s,box-shadow .2s;position:relative;overflow:hidden}
.tcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--bar,linear-gradient(90deg,#2563eb,#0891b2));border-radius:16px 16px 0 0;opacity:.85}
.tcard:hover{border-color:rgba(37,99,235,.25);transform:translateY(-3px);box-shadow:0 18px 48px -12px rgba(37,99,235,.12)}
.tcard-icon{font-size:26px;margin-bottom:14px;display:block}
.tcard-title{font-family:var(--fd);font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.02em;margin-bottom:7px}
.tcard-desc{font-size:12.5px;color:var(--fg3);line-height:1.6}

/* Steps */
.steps-sec{position:relative;z-index:1;padding:0 0 96px;border-top:1px solid #f0f0f0;background:#fff}
.steps-sec .inner{padding-top:96px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:52px;position:relative}
.steps::before{content:'';position:absolute;top:27px;left:calc(16.67% + 16px);right:calc(16.67% + 16px);height:1px;background:linear-gradient(90deg,rgba(37,99,235,.4),rgba(8,145,178,.4));z-index:0}
.step{position:relative;z-index:1;padding:32px 28px;background:#fff;border:1.5px solid #e5e7eb;border-radius:18px;text-align:center;transition:border-color .22s,transform .2s,box-shadow .22s}
.step:hover{border-color:rgba(37,99,235,.25);transform:translateY(-3px);box-shadow:0 18px 48px -12px rgba(37,99,235,.1)}
.step-num{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:22px;font-weight:800;color:#fff;margin:0 auto 20px;background:linear-gradient(135deg,#2563eb,#1d4ed8);box-shadow:0 6px 24px rgba(37,99,235,.3)}
.step-title{font-family:var(--fd);font-size:18px;font-weight:700;color:#1d1d1f;margin-bottom:10px;letter-spacing:-.02em}
.step-desc{font-size:13.5px;color:var(--fg3);line-height:1.68}

/* FAQ */
.faq-sec{position:relative;z-index:1;padding:0 0 96px;background:#f5f5f7}
.faq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:52px}
.fq{padding:28px 30px;background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;transition:border-color .18s,transform .18s}
.fq:hover{border-color:rgba(37,99,235,.2);transform:translateY(-2px)}
.fq-q{font-family:var(--fd);font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.02em;margin-bottom:10px;display:flex;align-items:flex-start;gap:10px}
.fq-ic{color:var(--p);flex-shrink:0;font-size:14px;margin-top:2px}
.fq-a{font-size:13.5px;color:var(--fg3);line-height:1.7;padding-left:24px}

/* CTA */
.cta-ban{position:relative;z-index:1;padding:0 0 96px;background:#fff}
.cta-inner{background:#f5f5f7;border:1.5px solid rgba(37,99,235,.12);border-radius:24px;padding:72px 48px;text-align:center;position:relative;overflow:hidden}
.cta-inner::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(37,99,235,.04) 0%,transparent 60%);pointer-events:none}
.cta-glow{position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:380px;background:radial-gradient(ellipse,rgba(37,99,235,.08) 0%,transparent 70%);filter:blur(40px);pointer-events:none}
.cta-h{font-family:var(--fd);font-size:clamp(28px,4vw,44px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;margin-bottom:14px;position:relative;line-height:1.07}
.cta-sub{font-size:16px;color:var(--fg2);margin-bottom:36px;position:relative}

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
  .hero{padding:calc(56px + 60px) 0 52px}
  .hero-cta-row{flex-direction:column;align-items:stretch}
  .btn-primary,.btn-sec{justify-content:center}
  .h1-main{font-size:clamp(40px,12vw,68px)}
}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#f5f5f7}
::-webkit-scrollbar-thumb{background:rgba(37,99,235,.2);border-radius:2px}
:focus-visible{outline:2px solid var(--p);outline-offset:3px}
`

const TOOLS = [
  { icon: '📝', title: 'Text Editor', desc: 'Add text and edit supported text objects. Change font, size, color and opacity.', bar: 'linear-gradient(90deg,#22d3ee,#0891b2)' },
  { icon: '🖼️', title: 'Image Insertion', desc: 'Insert photos, logos or graphics onto any page. Resize and reposition freely.', bar: 'linear-gradient(90deg,#a78bfa,#6d28d9)' },
  { icon: '✍️', title: 'Signatures', desc: 'Draw, type or upload a visual signature, then position and resize it on the page.', bar: 'linear-gradient(90deg,#f59e0b,#b45309)' },
  { icon: '🔆', title: 'Highlights & Markup', desc: 'Highlight text, draw freehand, add sticky notes and annotation boxes.', bar: 'linear-gradient(90deg,#4ade80,#16a34a)' },
  { icon: '🔷', title: 'Shapes & Lines', desc: 'Draw rectangles, ellipses, arrows, lines and polygons with custom stroke and fill.', bar: 'linear-gradient(90deg,#38bdf8,#0369a1)' },
  { icon: '🏷️', title: 'Stamps & Watermarks', desc: 'Apply APPROVED, CONFIDENTIAL, DRAFT and custom stamps. Add text or image watermarks.', bar: 'linear-gradient(90deg,#f472b6,#be185d)' },
  { icon: '📄', title: 'Page Manager', desc: 'Reorder, rotate, delete or add blank pages by dragging page thumbnails.', bar: 'linear-gradient(90deg,#fb923c,#b45309)' },
  { icon: '⬇️', title: 'Instant Export', desc: 'Download a new PDF containing the edits and page changes supported by the editor.', bar: 'linear-gradient(90deg,#67e8f9,#0e7490)' },
]

const FAQS = [
  { q: 'How can I edit a PDF without Adobe Acrobat?', a: 'Choose a PDF, use the browser editor to make supported text, image, annotation, signature, or page changes, and download a new PDF. The core editor does not require Adobe Acrobat or another desktop application.' },
  { q: 'Can I edit text directly in a PDF?', a: 'Supported text objects can be edited directly. Scans, embedded fonts, complex layouts, and the internal PDF structure can limit direct text editing, so inspect the downloaded copy before using it.' },
  { q: 'Is it safe to upload a PDF to the editor?', a: 'The manual editor reads and processes the selected PDF locally in your browser without an application document-processing request. Optional AI form actions use separate server routes and data handling.' },
  { q: 'Can I use the PDF editor without signing up?', a: 'Yes. The core manual PDF editor is available without an account. Optional AI form actions require sign-in and use the shared daily AI allowance.' },
  { q: 'Does the PDF editor work on mobile devices?', a: 'The editor includes a responsive mobile layout and touch-compatible controls. Editing a complex PDF may be easier on a larger screen, and practical performance depends on the document and available device memory.' },
  { q: 'Can I edit a scanned PDF?', a: 'You can add text, highlights, drawings, signatures, and other overlays to a scanned PDF. Use PDF OCR first when you need to extract searchable or selectable text from scanned page images.' },
]

// Generated from the same FAQS array that renders the visible FAQ section
// below — single source of truth, can't drift out of sync. Not declared in
// layout.tsx.
export default function PDFEditorPage() {
  const [editorOpen, setEditorOpen] = useState(false)

  // Always restore scroll on unmount in case editor was open during navigation
  useEffect(() => () => { document.body.style.overflow = '' }, [])

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
      <JsonLd
        id="tool-faq-structured-data-pdf-editor"
        data={buildFaqStructuredData('/pdf-editor', FAQS)}
      />

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
          <PDFEditor hideChatFill hideAutoFill onRequestClose={closeEditor} />
        </div>
      )}

      {!editorOpen && <>
      {/* Nav */}
      <SiteNav />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <main id="main-content">
      <header className="hero" aria-labelledby="hero-h1">
        <div className="wrap">
          <div className="hero-badge" aria-hidden="true">
            <span className="bdot" /><span>FREE · NO SIGNUP · BROWSER-BASED</span>
          </div>
          <h1 id="hero-h1" className="hero-h1">
            <span className="h1-main">Free Online PDF Editor</span>
          </h1>
          <p className="hero-sub tool-hero-definition">
            An online PDF editor opens a PDF in your browser so you can make supported changes without installing desktop software. EditPDF AI lets you add or edit supported text, insert images, sign, annotate, and organize pages, then download a new PDF. Complex layouts, scans, and embedded fonts can limit direct text editing.
          </p>
          <div className="hero-cta-row">
            <button className="btn-primary" onClick={openEditor}>
              Edit a PDF — Free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <Link prefetch={false} href="/ai-pdf-form-filler" className="btn-sec">AI Form Filler →</Link>
          </div>
          <div className="hero-pills" role="list" aria-label="Key features">
            {(['📝 Text', '🖼️ Images', '✍️ Signatures', '🔆 Highlights', '🔷 Shapes', '📄 Pages', '🏷️ Stamps', '⬇️ Export'] as const).map(f => (
              <div key={f} className="hpill" role="listitem"><strong>{f}</strong></div>
            ))}
          </div>
        </div>
      </header>

      <ToolQuickFacts
        price="Free — no account needed"
        account="No account for the core editor; sign-in is required only for optional AI actions"
        processing="Manual editing runs locally in your browser; optional AI form actions have separate data handling"
        formats="Input: PDF · Output: PDF"
        fileLimit="No fixed cap is enforced by the file handler; practical capacity depends on PDF complexity and browser memory"
        browserSupport="Modern desktop and mobile browsers with JavaScript and required file APIs"
      />

      {/* ── TOOLS SHOWCASE ──────────────────────────────────────── */}
      <section className="tools-sec" aria-labelledby="tools-h">
        <div className="wrap">
          <span className="sec-eyebrow">// EDITING TOOLS</span>
          <h2 id="tools-h" className="sec-h">Online PDF editing tools</h2>
          <p className="sec-sub">Use this free PDF editor to add text, annotate, sign and organize PDF pages — no plugins or account required.</p>
          <div className="tools-grid" role="list">
            {TOOLS.map(({ icon, title, desc, bar }) => (
              <div key={title} className="tcard" role="listitem" style={{ '--bar': bar } as React.CSSProperties}>
                <span className="tcard-icon" aria-hidden="true">{icon}</span>
                <h3 className="tcard-title">{title}</h3>
                <p className="tcard-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="steps-sec" aria-labelledby="how-h">
        <div className="wrap inner">
          <span className="sec-eyebrow">// HOW IT WORKS</span>
          <h2 id="how-h" className="sec-h">How to edit a PDF online</h2>
          <p className="sec-sub">No learning curve. No install. Be done in seconds.</p>
          <p style={{ margin: '-20px 0 30px', fontSize: 13.5, color: '#64748b' }}>
            Need a detailed walkthrough? Read <Link href="/guides/how-to-edit-a-pdf-without-adobe" style={{ color: '#1d4ed8', fontWeight: 700 }}>how to edit a PDF without Adobe Acrobat</Link>.
          </p>
          <div className="steps" role="list">
            {([
              ['1', 'Choose Your PDF', 'Select a supported scanned, flat or interactive PDF. The manual editor loads it locally in your browser.'],
              ['2', 'Make Your Edits', 'Use the toolbar to add text, images, shapes, highlights, signatures or stamps. Switch to Page Manager to reorder or rotate pages.'],
              ['3', 'Download Your Copy', 'Download a new PDF containing the edits and page changes supported by the editor.'],
            ] as const).map(([num, title, desc]) => (
              <div key={num} className="step" role="listitem">
                <div className="step-num" aria-hidden="true">{num}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="faq-sec" aria-labelledby="faq-h">
        <div className="wrap">
          <span className="sec-eyebrow">// FAQ</span>
          <h2 id="faq-h" className="sec-h">Free online PDF editor FAQs</h2>
          <p className="sec-sub">Everything you need to know before opening your first PDF.</p>
          <div className="faq-grid">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="fq">
                <div className="fq-q"><span className="fq-ic" aria-hidden="true">✦</span><span className="tool-seo-faq-question">{q}</span></div>
                <p className="fq-a tool-seo-faq-answer">{a}</p>
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
            <p className="cta-sub">No account or watermark for the core editor. Browser and tool-specific limits apply.</p>
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

      </main>

      {/* Footer */}
      <ToolSEOSection
        {...toolSeoData['pdf-editor']}
        showSteps={false}
        showFaq={false}
        includeSchema={false}
      />
      <SiteFooter />
      </>}
    </div>
  )
}
