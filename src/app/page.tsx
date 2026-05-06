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
  { id: 'pdf-editor',    name: 'AI PDF Editor',       tag: 'LIVE', href: '/editor', category: 'EDITOR',   accent: '#818cf8', accentRgb: '129,140,248',
    desc: 'Edit, annotate, sign and AI-fill PDF forms. Intelligent field detection and instant completion.' },
  { id: 'pdf-word',      name: 'PDF → Word',          tag: 'SOON', category: 'CONVERT',  accent: '#38bdf8', accentRgb: '56,189,248',
    desc: 'Convert PDFs to fully editable Word documents with perfect layout preservation.' },
  { id: 'pdf-excel',     name: 'PDF → Excel',         tag: 'SOON', category: 'CONVERT',  accent: '#4ade80', accentRgb: '74,222,128',
    desc: 'Extract tables and data from PDFs directly into structured spreadsheets.' },
  { id: 'pdf-compress',  name: 'PDF Compressor',      tag: 'SOON', category: 'OPTIMIZE', accent: '#fb923c', accentRgb: '251,146,60',
    desc: 'Shrink PDF file size up to 90% without visible quality loss using smart compression.' },
  { id: 'pdf-merge',     name: 'PDF Merger',          tag: 'SOON', category: 'TOOLS',    accent: '#a78bfa', accentRgb: '167,139,250',
    desc: 'Combine multiple PDF files into a single document with custom page ordering.' },
  { id: 'pdf-split',     name: 'PDF Splitter',        tag: 'SOON', category: 'TOOLS',    accent: '#f472b6', accentRgb: '244,114,182',
    desc: 'Split any PDF into individual pages or custom ranges in one click.' },
  { id: 'pdf-ocr',       name: 'PDF OCR Scanner',     tag: 'BETA', category: 'EXTRACT',  accent: '#34d399', accentRgb: '52,211,153',
    desc: 'Extract searchable text from scanned PDFs and image-based documents instantly.' },
  { id: 'pdf-forms',     name: 'PDF Form Builder',    tag: 'BETA', category: 'FORMS',    accent: '#2dd4bf', accentRgb: '45,212,191',
    desc: 'Create custom fillable PDF forms with drag-and-drop fields and smart validation.' },
  { id: 'pdf-sign',      name: 'PDF E-Signer',        tag: 'SOON', category: 'SIGN',     accent: '#c084fc', accentRgb: '192,132,252',
    desc: 'Legally binding digital signature workflows with certificate management.' },
  { id: 'pdf-translate', name: 'PDF Translator',      tag: 'SOON', category: 'LANGUAGE', accent: '#22d3ee', accentRgb: '34,211,238',
    desc: 'Translate PDF documents across 140+ languages while preserving original layout.' },
  { id: 'pdf-watermark', name: 'PDF Watermarker',     tag: 'SOON', category: 'PROTECT',  accent: '#fbbf24', accentRgb: '251,191,36',
    desc: 'Add, remove or customise watermarks on PDFs with full opacity and position control.' },
  { id: 'pdf-image',     name: 'PDF to Images',       tag: 'SOON', category: 'EXPORT',   accent: '#e879f9', accentRgb: '232,121,249',
    desc: 'Export any PDF page as high-resolution JPG, PNG or WebP images in bulk.' },
  { id: 'pdf-redact',    name: 'PDF Redactor',        tag: 'SOON', category: 'SECURITY', accent: '#f87171', accentRgb: '248,113,113',
    desc: 'Permanently redact sensitive text, images and metadata from PDF documents.' },
  { id: 'pdf-protect',   name: 'PDF Password Lock',   tag: 'SOON', category: 'SECURITY', accent: '#60a5fa', accentRgb: '96,165,250',
    desc: 'Encrypt and password-protect PDF files with AES-256 encryption and permissions.' },
  { id: 'pdf-pages',     name: 'PDF Page Manager',    tag: 'BETA', category: 'TOOLS',    accent: '#a3e635', accentRgb: '163,230,53',
    desc: 'Reorder, rotate, crop and delete pages from any PDF with live preview.' },
  { id: 'pdf-summary',   name: 'PDF Summarizer AI',   tag: 'SOON', category: 'AI',       accent: '#67e8f9', accentRgb: '103,232,249',
    desc: 'Generate AI-powered summaries of lengthy PDF documents in seconds.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EditPDF AI',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function HomePage() {
  const others = TOOLS.slice(1)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pg">

        {/* Ambient */}
        <div className="amb" aria-hidden="true">
          <div className="ag1"/><div className="ag2"/><div className="agr"/>
        </div>

        {/* Nav */}
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-in">
            <Link href="/" className="wm" aria-label="EditPDF AI home">
              <span className="wm-e">EDIT</span>
              <span className="wm-p">PDF</span>
              <span className="wm-a">.AI</span>
            </Link>
            <div className="nav-mid" role="list">
              <a href="#tools" className="nla" role="listitem">Tools</a>
              <a href="#features" className="nla" role="listitem">Features</a>
            </div>
            <div className="nav-r">
              <div className="opill" aria-label="Service online">
                <span className="opd" aria-hidden="true"/><span className="mk">ONLINE</span>
              </div>
              <Link href="/editor" className="nbtn">Launch Editor →</Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <header className="hero" aria-labelledby="h1">
          {/* Perspective horizon */}
          <div className="hz" aria-hidden="true"><div className="hzg"/></div>

          <div className="wrap hero-in">
            {/* Left */}
            <div className="hl">
              <p className="eyebrow mk" aria-hidden="true">
                <span className="eyd" aria-hidden="true"/>AI PDF PLATFORM · 16 TOOLS
              </p>
              <h1 id="h1" className="h1">
                <span className="h1a">The smartest</span>
                <span className="h1b">PDF Suite.</span>
              </h1>
              <p className="hcopy">
                Edit, sign, annotate and AI‑fill your documents.
                Precision AI. Free. No signup required.
              </p>
              <div className="hacts">
                <Link href="/editor" className="btnp">
                  Open PDF Editor — Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tools" className="btng">Explore tools</a>
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

            {/* Right — terminal */}
            <div className="hr" aria-hidden="true">
              <div className="term">
                <div className="tbar">
                  <span className="tdot tdr"/><span className="tdot tdy"/><span className="tdot tdg"/>
                  <span className="mk ttl">editpdf.ai — ai engine</span>
                </div>
                <div className="tbody mk">
                  <div className="tl t1"><span className="tcp">$</span> editpdf --analyze invoice.pdf</div>
                  <div className="tl t2 tdim">→ scanning document...</div>
                  <div className="tl t3 tdim">→ 4 form fields detected</div>
                  <div className="tl t4">&nbsp;</div>
                  <div className="tl t5"><span className="tcs">✦</span><span className="tcf">NAME&nbsp;&nbsp;&nbsp;</span><span className="tcv">&quot;Acme Corporation&quot;</span></div>
                  <div className="tl t6"><span className="tcs">✦</span><span className="tcf">DATE&nbsp;&nbsp;&nbsp;</span><span className="tcv">&quot;06/05/2026&quot;</span></div>
                  <div className="tl t7"><span className="tcs">✦</span><span className="tcf">AMOUNT&nbsp;</span><span className="tcv">&quot;$4,820.00&quot;</span></div>
                  <div className="tl t8"><span className="tcs">✦</span><span className="tcf">SIGN&nbsp;&nbsp;&nbsp;</span><span className="tcv tco">placed ✓</span></div>
                  <div className="tl t9">&nbsp;</div>
                  <div className="tl t10 tcdone">✓ complete · 847ms · 4/4 fields</div>
                  <div className="tl t11"><span className="tccur">_</span></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Ticker */}
        <div className="ticker" aria-hidden="true" role="presentation">
          <div className="tktr">
            {[...TOOLS,...TOOLS].map((t,i) => (
              <span key={i} className="ti">
                <span className="tis">✦</span>
                <span className="mk tin">{t.name.toUpperCase()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tools */}
        <section id="tools" className="tsec" aria-labelledby="tools-h">
          <div className="wrap">
            <div className="sbar">
              <span className="mk slbl">// TOOL REGISTRY</span>
              <span className="sln" aria-hidden="true"/>
              <span className="mk scnt">16 PDF MODULES</span>
            </div>
            <h2 id="tools-h" className="sh">16 PDF Tools.<br/>One Platform.</h2>
            <p className="ssp">Everything you need for PDFs, powered by AI.</p>

            {/* Featured */}
            <Link href="/editor" className="fc" aria-label="Open AI PDF Editor — live now, free">
              <div className="fcl">
                <div className="fctag mk"><span className="fctd"/>LIVE NOW</div>
                <h3 className="fcname">AI PDF Editor</h3>
                <p className="fcdesc">{TOOLS[0].desc}</p>
                <ul className="fccaps" aria-label="Features">
                  {['AI Form Filling','E-Signatures','Text Editing','Annotations','Page Management'].map(c=>(
                    <li key={c} className="fcci"><span aria-hidden="true">✓</span>{c}</li>
                  ))}
                </ul>
                <span className="fccta">
                  Open Free
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
              <div className="fcr" aria-hidden="true">
                <p className="mk fcrl">CAPABILITIES</p>
                {['AI Form Filling','Smart Signatures','Text Editing','Annotations','Page Management','PDF Merge','Smart OCR','Batch Export'].map((c,i)=>(
                  <div key={c} className="fcd" style={{animationDelay:`${i*0.07}s`} as React.CSSProperties}>
                    <span className="fcdk">✓</span><span>{c}</span>
                  </div>
                ))}
              </div>
            </Link>

            {/* 2-col TOC grid for other tools */}
            <div className="treg" role="list" aria-label="Upcoming PDF tools">
              {others.map((t, i) => (
                <div key={t.id} className="trow" role="listitem">
                  <span className="mk trn">{String(i+2).padStart(2,'0')}</span>
                  <span className="trname">{t.name}</span>
                  <span className="trdots" aria-hidden="true"/>
                  <span className="mk trcat">{t.category}</span>
                  <span className={`mk trtag tr-${t.tag.toLowerCase()}`}>
                    {t.tag === 'BETA' && <span className="trbdot"/>}
                    {t.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="fsec" aria-labelledby="feats-h">
          <div className="wrap">
            <div className="sbar">
              <span className="mk slbl">// SYSTEM SPECS</span>
              <span className="sln" aria-hidden="true"/>
            </div>
            <h2 id="feats-h" className="sh">Enterprise power.<br/>Zero friction.</h2>
            <dl className="bst">
              {([['16','AI Tools','One platform for all your PDF needs.'],['140+','Languages','Full internationalisation across every script.'],['99.9%','Uptime SLA','Always-on reliability you can count on.'],['<10ms','Response','Instant AI processing at any scale.']] as const).map(([v,l,d])=>(
                <div key={l} className="bsti">
                  <dt className="bstl mk">{l}</dt>
                  <dd className="bstv">{v}</dd>
                  <p className="bstd">{d}</p>
                </div>
              ))}
            </dl>
            <div className="fgrd">
              {([['⚡','LIGHTNING FAST','Sub-10ms responses. Optimised at every layer of the stack.'],['🔒','ZERO-KNOWLEDGE','Your data never leaves your control. End-to-end encrypted.'],['🧠','PRECISION AI','State-of-the-art AI precision-trained for document intelligence.'],['🌍','GLOBAL SCALE','140+ languages, multi-region deployments, 99.9% uptime SLA.']] as const).map(([ic,ti,de])=>(
                <div key={ti} className="fgi">
                  <span className="fgic" aria-hidden="true">{ic}</span>
                  <span className="fgti mk">{ti}</span>
                  <span className="fgde">{de}</span>
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

        {/* Footer */}
        <footer className="foot" role="contentinfo">
          <div className="wrap foot-in">
            <Link href="/" className="wm" aria-label="EditPDF AI home">
              <span className="wm-e wm-sm">EDIT</span>
              <span className="wm-p wm-sm">PDF</span>
              <span className="wm-a wm-a-sm">.AI</span>
            </Link>
            <nav aria-label="Footer navigation" className="fnav">
              <Link href="/editor">AI PDF Editor</Link>
              <a href="#tools">All Tools</a>
              <a href="#features">System Specs</a>
            </nav>
            <p className="fcopy mk">© {new Date().getFullYear()} EDITPDF AI · ALL RIGHTS RESERVED</p>
          </div>
        </footer>

      </div>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        html,body{background:#000;overflow:auto!important}

        :root{
          --bg:#000;
          --fg:#f0f4ff;
          --fg2:rgba(240,244,255,.6);
          --fg3:rgba(240,244,255,.3);
          --fg4:rgba(240,244,255,.1);
          --b:rgba(255,255,255,.07);
          --bh:rgba(255,255,255,.13);
          --ind:#6366f1;
          --ind2:#818cf8;
          --ind3:#a5b4fc;
          --grn:#4ade80;
          --fd:var(--font-syne,'Syne',sans-serif);
          --fu:var(--font-space,'Space Grotesk',sans-serif);
          --fm:var(--font-mono,'JetBrains Mono',monospace);
        }

        .pg{min-height:100vh;background:var(--bg);color:var(--fg);font-family:var(--fu);overflow-x:hidden;position:relative}
        .mk{font-family:var(--fm);font-size:.8em;letter-spacing:.07em}
        .wrap{max-width:1240px;margin:0 auto;padding:0 32px}

        /* Ambient */
        .amb{position:fixed;inset:0;pointer-events:none;z-index:0}
        .ag1{position:absolute;width:1000px;height:800px;top:-200px;left:-200px;background:radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 65%);filter:blur(120px);animation:adrift 30s ease-in-out infinite alternate}
        .ag2{position:absolute;width:700px;height:700px;bottom:-150px;right:-100px;background:radial-gradient(circle,rgba(34,211,238,.12) 0%,transparent 65%);filter:blur(110px);animation:adrift 38s ease-in-out infinite alternate-reverse}
        .agr{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.045) 1px,transparent 1px);background-size:64px 64px}
        @keyframes adrift{0%{transform:translate(0,0)}100%{transform:translate(50px,35px)}}

        /* Nav */
        .nav{position:sticky;top:0;z-index:100;background:rgba(0,0,0,.88);backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--b)}
        .nav-in{max-width:1240px;margin:0 auto;padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between}
        .nav-mid{display:flex;gap:26px}
        .nla{font-size:13px;font-weight:500;color:var(--fg3);text-decoration:none;transition:color .15s}
        .nla:hover{color:var(--fg2)}
        .nav-r{display:flex;align-items:center;gap:18px}
        .opill{display:flex;align-items:center;gap:6px;font-size:9px;font-family:var(--fm);letter-spacing:.12em;color:rgba(74,222,128,.75)}
        .opd{width:5px;height:5px;border-radius:50%;background:var(--grn);box-shadow:0 0 8px var(--grn);animation:blink 2s ease-in-out infinite;display:inline-block}
        .nbtn{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;background:var(--ind);border-radius:7px;font-size:12.5px;font-weight:600;color:#fff;text-decoration:none;transition:background .15s,transform .15s,box-shadow .15s}
        .nbtn:hover{background:var(--ind2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.4)}

        /* Wordmark */
        .wm{display:inline-flex;align-items:center;gap:0;text-decoration:none}
        .wm-e{font-family:var(--fd);font-size:17px;font-weight:400;color:rgba(240,244,255,.42);letter-spacing:.03em}
        .wm-p{font-family:var(--fd);font-size:17px;font-weight:800;color:#f0f4ff;letter-spacing:-.03em}
        .wm-a{font-family:var(--fm);font-size:9.5px;font-weight:700;letter-spacing:.1em;color:#fff;background:linear-gradient(135deg,#4f46e5 0%,#818cf8 100%);padding:2px 7px;border-radius:4px;margin-left:6px;line-height:1.6;white-space:nowrap}
        .wm-sm{font-size:15px}
        .wm-a-sm{font-size:8.5px;padding:2px 6px;margin-left:5px}

        /* Hero */
        .hero{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;justify-content:center}
        .hero-in{display:grid;grid-template-columns:1fr 400px;gap:60px;align-items:center;padding:80px 0}

        /* Horizon grid */
        .hz{position:absolute;bottom:0;left:0;right:0;height:42%;pointer-events:none;overflow:hidden;opacity:.55}
        .hzg{position:absolute;bottom:0;left:50%;width:220%;height:100%;transform:translateX(-50%) perspective(320px) rotateX(62deg);transform-origin:bottom center;background-image:linear-gradient(rgba(99,102,241,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.18) 1px,transparent 1px);background-size:76px 56px;-webkit-mask-image:linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 100%);mask-image:linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 100%)}

        /* Hero left */
        .hl{display:flex;flex-direction:column;position:relative;z-index:1}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 12px;border:1px solid rgba(129,140,248,.22);border-radius:4px;background:rgba(129,140,248,.08);margin-bottom:24px;width:fit-content;font-size:9px;letter-spacing:.14em;color:rgba(74,222,128,.85)}
        .eyd{width:5px;height:5px;border-radius:50%;background:var(--grn);box-shadow:0 0 7px var(--grn);animation:blink 2s ease-in-out infinite;display:inline-block}

        .h1{font-family:var(--fd);font-weight:800;margin-bottom:22px;line-height:.94}
        .h1a{display:block;font-size:clamp(20px,2.8vw,34px);color:var(--fg3);letter-spacing:-.01em;margin-bottom:6px}
        .h1b{display:block;font-size:clamp(62px,9vw,116px);letter-spacing:-.045em;background:linear-gradient(115deg,#f0f4ff 0%,var(--ind3) 40%,#c7d2fe 70%,#f0f4ff 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 5s linear infinite}
        @keyframes tflow{0%{background-position:0% center}100%{background-position:200% center}}

        .hcopy{font-size:15.5px;line-height:1.85;color:var(--fg2);margin-bottom:36px;max-width:480px}
        .hacts{display:flex;gap:12px;margin-bottom:48px;flex-wrap:wrap}
        .btnp{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;background:var(--ind);border-radius:8px;font-size:13.5px;font-weight:700;color:#fff;text-decoration:none;transition:background .15s,transform .15s,box-shadow .15s}
        .btnp:hover{background:var(--ind2);transform:translateY(-2px);box-shadow:0 14px 36px rgba(99,102,241,.45)}
        .btng{display:inline-flex;align-items:center;gap:6px;padding:13px 20px;border:1px solid var(--bh);border-radius:8px;font-size:13px;font-weight:500;color:var(--fg3);text-decoration:none;transition:all .15s}
        .btng:hover{border-color:rgba(255,255,255,.22);color:var(--fg2)}

        .hst{display:flex;border:1px solid var(--b);border-radius:10px;overflow:hidden;width:fit-content;background:rgba(255,255,255,.02)}
        .hsti{display:flex;flex-direction:column;align-items:center;padding:14px 22px;border-right:1px solid var(--b)}
        .hsti:last-child{border-right:none}
        .hstv{font-family:var(--fd);font-size:22px;font-weight:800;letter-spacing:-.03em;color:var(--fg)}
        .hstl{font-size:8.5px;color:var(--fg3);letter-spacing:.12em;text-transform:uppercase;margin-top:3px}

        /* Terminal */
        .hr{display:flex;align-items:center;justify-content:center;position:relative;z-index:1}
        .term{width:380px;background:#020208;border:1px solid rgba(99,102,241,.3);border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px rgba(99,102,241,.07),0 32px 90px -16px rgba(99,102,241,.5),inset 0 1px 0 rgba(255,255,255,.04)}
        .tbar{display:flex;align-items:center;gap:7px;padding:11px 16px;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.07)}
        .tdot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .tdr{background:#ff5f57}.tdy{background:#febc2e}.tdg{background:#28c840}
        .ttl{font-size:9.5px;letter-spacing:.06em;color:rgba(240,244,255,.28);margin-left:8px}
        .tbody{padding:20px 22px;font-size:12px;line-height:2;color:rgba(240,244,255,.5)}
        .tl{animation:findin .28s ease-out both}
        .t1{animation-delay:.15s}.t2{animation-delay:.5s}.t3{animation-delay:.78s}
        .t4{animation-delay:1.05s}.t5{animation-delay:1.25s}.t6{animation-delay:1.55s}
        .t7{animation-delay:1.85s}.t8{animation-delay:2.15s}.t9{animation-delay:2.45s}
        .t10{animation-delay:2.65s}.t11{animation-delay:2.95s}
        .tcp{color:rgba(129,140,248,.9);margin-right:8px}
        .tdim{color:rgba(240,244,255,.28)}
        .tcs{color:var(--ind2);margin-right:8px;font-size:10px;filter:drop-shadow(0 0 4px var(--ind2))}
        .tcf{display:inline-block;width:64px;color:rgba(240,244,255,.4)}
        .tcv{color:rgba(165,180,252,.92)}
        .tco{color:var(--grn)!important}
        .tcdone{color:rgba(74,222,128,.82)}
        .tccur{display:inline-block;width:7px;height:13px;background:var(--ind2);vertical-align:text-bottom;animation:blink-c 1s step-end infinite}
        @keyframes blink-c{0%,100%{opacity:1}50%{opacity:0}}

        /* Ticker */
        .ticker{position:relative;z-index:1;overflow:hidden;border-top:1px solid var(--b);border-bottom:1px solid var(--b);padding:10px 0;background:rgba(255,255,255,.007)}
        .tktr{display:inline-flex;width:max-content;animation:roll 55s linear infinite;white-space:nowrap}
        .ti{display:inline-flex;align-items:center;gap:10px;padding:0 18px}
        .tis{font-size:7px;color:var(--ind2);opacity:.5}
        .tin{font-size:9.5px;letter-spacing:.1em;color:var(--fg3)}
        @keyframes roll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        /* Section shared */
        .sbar{display:flex;align-items:center;gap:16px;margin-bottom:22px}
        .slbl{font-size:9.5px;font-weight:700;letter-spacing:.18em;color:rgba(129,140,248,.5);white-space:nowrap}
        .sln{flex:1;height:1px;background:linear-gradient(90deg,rgba(99,102,241,.22),transparent)}
        .scnt{font-size:9.5px;letter-spacing:.12em;color:var(--fg3);white-space:nowrap}
        .sh{font-family:var(--fd);font-size:clamp(26px,3.8vw,44px);font-weight:800;letter-spacing:-.03em;color:var(--fg);margin-bottom:10px;line-height:1.08}
        .ssp{font-size:14px;color:var(--fg3);margin-bottom:52px;line-height:1.7}

        /* Tools */
        .tsec{position:relative;z-index:1;padding:90px 0}

        /* Featured card */
        .fc{display:flex;border:1px solid rgba(99,102,241,.3);border-radius:16px;overflow:hidden;background:rgba(99,102,241,.04);margin-bottom:12px;text-decoration:none;color:inherit;transition:border-color .22s,box-shadow .22s,transform .22s;position:relative}
        .fc::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(99,102,241,.08) 0%,transparent 55%);pointer-events:none}
        .fc:hover{border-color:rgba(129,140,248,.55);box-shadow:0 24px 70px -12px rgba(99,102,241,.35);transform:translateY(-3px)}
        .fcl{flex:1;padding:38px 40px;display:flex;flex-direction:column}
        .fcr{width:250px;background:rgba(99,102,241,.04);border-left:1px solid rgba(99,102,241,.1);display:flex;flex-direction:column;justify-content:center;padding:28px 24px;gap:8px}
        .fcrl{font-size:9px;letter-spacing:.14em;color:var(--fg3);margin-bottom:4px}
        .fctag{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.22);border-radius:4px;font-size:9px;letter-spacing:.1em;color:rgba(74,222,128,.85);margin-bottom:16px;width:fit-content}
        .fctd{width:5px;height:5px;border-radius:50%;background:var(--grn);animation:blink 2s ease-in-out infinite;display:inline-block}
        .fcname{font-family:var(--fd);font-size:28px;font-weight:800;color:var(--fg);letter-spacing:-.02em;margin-bottom:10px}
        .fcdesc{font-size:13.5px;color:var(--fg2);line-height:1.7;margin-bottom:20px}
        .fccaps{list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:28px}
        .fcci{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--fg3)}
        .fcci span{font-size:10px;color:var(--ind2);font-weight:700}
        .fccta{display:inline-flex;align-items:center;gap:7px;padding:11px 22px;background:var(--ind);border-radius:7px;font-size:12.5px;font-weight:700;color:#fff;width:fit-content;transition:background .15s,box-shadow .15s}
        .fc:hover .fccta{background:var(--ind2);box-shadow:0 8px 24px rgba(99,102,241,.4)}
        .fcd{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--fg2);padding:7px 10px;border:1px solid var(--b);border-radius:6px;background:rgba(255,255,255,.014);animation:findin .3s ease-out both}
        .fcdk{font-size:9px;color:var(--ind2);font-weight:700}

        /* 2-col TOC grid */
        .treg{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--b);border-radius:12px;overflow:hidden}
        .trow{display:flex;align-items:center;gap:10px;padding:13px 18px;border-right:1px solid var(--b);border-bottom:1px solid var(--b);transition:background .15s}
        .trow:hover{background:rgba(255,255,255,.022)}
        .trow:nth-child(even){border-right:none}
        .trow:nth-last-child(-n+2){border-bottom:none}
        .trow:last-child:nth-child(odd){grid-column:span 2}
        .trn{font-size:9.5px;color:var(--fg3);width:26px;flex-shrink:0}
        .trname{font-size:13px;font-weight:600;color:rgba(240,244,255,.65);flex:1;transition:color .15s}
        .trow:hover .trname{color:rgba(240,244,255,.88)}
        .trdots{flex:1;height:1px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.1) 0,rgba(255,255,255,.1) 2px,transparent 2px,transparent 8px);margin:0 8px;min-width:20px}
        .trcat{font-size:8px;letter-spacing:.1em;color:var(--fg3);white-space:nowrap}
        .trtag{padding:2px 6px;border-radius:3px;font-size:8px;font-weight:700;letter-spacing:.1em;white-space:nowrap}
        .tr-soon{background:rgba(255,255,255,.05);color:var(--fg3);border:1px solid var(--b)}
        .tr-beta{background:rgba(34,211,170,.1);color:#6ee7b7;border:1px solid rgba(34,211,170,.2);display:inline-flex;align-items:center;gap:4px}
        .trbdot{width:4px;height:4px;border-radius:50%;background:#6ee7b7;display:inline-block}

        /* Features */
        .fsec{position:relative;z-index:1;padding:90px 0;border-top:1px solid var(--b)}
        .bst{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--b);border-radius:12px;overflow:hidden;margin-bottom:48px;background:rgba(255,255,255,.01)}
        .bsti{padding:30px 24px;border-right:1px solid var(--b);text-align:center}
        .bsti:last-child{border-right:none}
        .bstl{display:block;font-size:9px;letter-spacing:.14em;color:var(--ind2);text-transform:uppercase;margin-bottom:8px}
        .bstv{display:block;font-family:var(--fd);font-size:40px;font-weight:800;letter-spacing:-.04em;color:var(--fg);margin-bottom:8px}
        .bstd{font-size:11.5px;color:var(--fg3);line-height:1.6}
        .fgrd{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:48px}
        .fgi{display:flex;flex-direction:column;gap:8px;padding:20px 18px;border:1px solid var(--b);border-radius:10px;background:rgba(255,255,255,.014);transition:border-color .2s,transform .2s}
        .fgi:hover{border-color:rgba(99,102,241,.22);transform:translateY(-2px)}
        .fgic{font-size:20px}
        .fgti{font-size:10px;font-weight:700;letter-spacing:.12em;color:rgba(240,244,255,.75)}
        .fgde{font-size:12px;color:var(--fg3);line-height:1.6}
        .ctaw{text-align:center}

        /* Footer */
        .foot{position:relative;z-index:1;padding:32px 0;border-top:1px solid var(--b);background:rgba(255,255,255,.006)}
        .foot-in{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .fnav{display:flex;gap:20px}
        .fnav a{font-size:12px;color:var(--fg3);text-decoration:none;font-weight:500;transition:color .15s}
        .fnav a:hover{color:var(--fg2)}
        .fcopy{font-size:9.5px;letter-spacing:.08em;color:var(--fg3)}

        /* Keyframes */
        @keyframes findin{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

        /* Responsive */
        @media(max-width:1024px){
          .hero-in{grid-template-columns:1fr;padding:60px 0}
          .hr{display:none}
          .bst{grid-template-columns:repeat(2,1fr)}
          .bsti{border-bottom:1px solid var(--b)}
          .bsti:nth-child(2n){border-right:none}
          .bsti:nth-last-child(-n+2){border-bottom:none}
          .fgrd{grid-template-columns:repeat(2,1fr)}
          .fcr{display:none}
          .fcl{padding:28px 24px}
          .hz{display:none}
        }
        @media(max-width:768px){
          .nav-mid{display:none}
          .hst{flex-direction:column;width:100%}
          .hsti{border-right:none;border-bottom:1px solid var(--b);flex-direction:row;justify-content:space-between;align-items:center;gap:12px}
          .hsti:last-child{border-bottom:none}
          .trcat{display:none}
          .trdots{display:none}
        }
        @media(max-width:640px){
          .wrap{padding:0 18px}
          .hero-in{padding:48px 0}
          .bst{grid-template-columns:1fr 1fr}
          .fgrd{grid-template-columns:1fr}
          .treg{grid-template-columns:1fr}
          .trow{border-right:none}
          .trow:nth-last-child(-n+2){border-bottom:1px solid var(--b)}
          .trow:last-child{border-bottom:none}
          .trow:last-child:nth-child(odd){grid-column:span 1}
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
