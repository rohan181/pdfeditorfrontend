import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
  description: 'Edit, sign, annotate and AI-fill PDF forms online. The fastest AI PDF editor with intelligent form detection, e-signatures and instant completion.',
  keywords: 'AI PDF editor, edit PDF online, fill PDF forms, sign PDF, PDF form filler, AI document editor, editpdfai',
  alternates: { canonical: 'https://editpdfai.com' },
  openGraph: {
    title: 'EditPDF AI — AI-Powered PDF Editor & Document Suite',
    description: 'Edit, sign and AI-fill PDF forms online. Intelligent form detection and instant completion.',
    type: 'website',
    url: 'https://editpdfai.com',
  },
}

const TOOLS = [
  { id: 'pdf-form-filler', name: 'AI Form Filler',  tag: 'LIVE', href: '/ai-pdf-form-filler', category: 'EDITOR',   accent: '#818cf8', accentRgb: '129,140,248', desc: 'Auto-detect and AI-fill every form field in seconds. E-signatures, OCR and instant download.' },
  { id: 'pdf-editor',      name: 'PDF Editor',      tag: 'LIVE', href: '/pdf-editor',          category: 'EDITOR',   accent: '#22d3ee', accentRgb: '34,211,238',   desc: 'Add text, images, shapes, highlights, signatures and stamps. Manage and reorder pages.' },
  { id: 'pdf-word',      name: 'PDF → Word',        tag: 'SOON', category: 'CONVERT',  accent: '#38bdf8', accentRgb: '56,189,248',   desc: 'Convert PDFs to fully editable Word documents with perfect layout preservation.' },
  { id: 'pdf-excel',     name: 'PDF → Excel',       tag: 'SOON', category: 'CONVERT',  accent: '#4ade80', accentRgb: '74,222,128',   desc: 'Extract tables and data from PDFs directly into structured spreadsheets.' },
  { id: 'pdf-compress',  name: 'PDF Compressor',    tag: 'SOON', category: 'OPTIMIZE', accent: '#fb923c', accentRgb: '251,146,60',   desc: 'Shrink PDF file size up to 90% without visible quality loss.' },
  { id: 'pdf-merge',     name: 'PDF Merger',        tag: 'SOON', category: 'TOOLS',    accent: '#a78bfa', accentRgb: '167,139,250',  desc: 'Combine multiple PDF files into a single document with custom ordering.' },
  { id: 'pdf-split',     name: 'PDF Splitter',      tag: 'SOON', category: 'TOOLS',    accent: '#f472b6', accentRgb: '244,114,182',  desc: 'Split any PDF into individual pages or custom ranges in one click.' },
  { id: 'pdf-ocr',       name: 'PDF OCR Scanner',   tag: 'BETA', category: 'EXTRACT',  accent: '#34d399', accentRgb: '52,211,153',   desc: 'Extract searchable text from scanned PDFs and image-based documents instantly.' },
  { id: 'pdf-forms',     name: 'PDF Form Builder',  tag: 'BETA', category: 'FORMS',    accent: '#2dd4bf', accentRgb: '45,212,191',   desc: 'Create custom fillable PDF forms with drag-and-drop fields.' },
  { id: 'pdf-sign',      name: 'PDF E-Signer',      tag: 'SOON', category: 'SIGN',     accent: '#c084fc', accentRgb: '192,132,252',  desc: 'Legally binding digital signature workflows with certificate management.' },
  { id: 'pdf-translate', name: 'PDF Translator',    tag: 'SOON', category: 'LANGUAGE', accent: '#22d3ee', accentRgb: '34,211,238',   desc: 'Translate PDF documents across 140+ languages while preserving layout.' },
  { id: 'pdf-watermark', name: 'PDF Watermarker',   tag: 'SOON', category: 'PROTECT',  accent: '#fbbf24', accentRgb: '251,191,36',   desc: 'Add, remove or customise watermarks on PDFs with full control.' },
  { id: 'pdf-image',     name: 'PDF to Images',     tag: 'SOON', category: 'EXPORT',   accent: '#e879f9', accentRgb: '232,121,249',  desc: 'Export any PDF page as high-resolution JPG, PNG or WebP images.' },
  { id: 'pdf-redact',    name: 'PDF Redactor',      tag: 'SOON', category: 'SECURITY', accent: '#f87171', accentRgb: '248,113,113',  desc: 'Permanently redact sensitive text, images and metadata from PDFs.' },
  { id: 'pdf-protect',   name: 'PDF Password Lock', tag: 'SOON', category: 'SECURITY', accent: '#60a5fa', accentRgb: '96,165,250',   desc: 'Encrypt and password-protect PDF files with AES-256 encryption.' },
  { id: 'pdf-pages',     name: 'PDF Page Manager',  tag: 'BETA', category: 'TOOLS',    accent: '#a3e635', accentRgb: '163,230,53',   desc: 'Reorder, rotate, crop and delete pages from any PDF with live preview.' },
  { id: 'pdf-summary',   name: 'PDF Summarizer AI', tag: 'SOON', category: 'AI',       accent: '#67e8f9', accentRgb: '103,232,249',  desc: 'Generate AI-powered summaries of lengthy PDF documents in seconds.' },
]

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EditPDF AI',
  url: 'https://editpdfai.com',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Edit, sign, annotate and AI-fill PDF forms online. The fastest AI PDF editor with intelligent form detection, e-signatures and instant completion.',
  featureList: 'AI Form Filling, E-Signatures, PDF Annotation, PDF OCR, PDF Merge, PDF Split, PDF Compress',
}

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EditPDF AI',
  url: 'https://editpdfai.com',
  description: 'AI-powered PDF editor with 17 tools — edit, sign, annotate and AI-fill PDF forms online.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://editpdfai.com/ai-pdf-form-filler',
    },
  },
}

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EditPDF AI',
  url: 'https://editpdfai.com',
  logo: 'https://editpdfai.com/icon.png',
  description: 'AI-powered PDF editing platform offering 16 free tools for editing, signing, and processing PDF documents.',
  sameAs: ['https://twitter.com/editpdfai'],
}

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
html,body{background:#060612;overflow-x:hidden;min-height:100vh}

:root{
  --bg:#060612;
  --bg2:#0c0c1e;
  --fg:#f0f4ff;
  --fg2:rgba(240,244,255,.65);
  --fg3:rgba(240,244,255,.35);
  --fg4:rgba(240,244,255,.12);
  --b:rgba(255,255,255,.07);
  --bh:rgba(255,255,255,.12);
  --p:#8b5cf6;
  --p2:#7c3aed;
  --pl:#a78bfa;
  --c:#22d3ee;
  --g:#4ade80;
  --fd:var(--font-jakarta,'Plus Jakarta Sans',sans-serif);
  --fu:var(--font-dm,'DM Sans',sans-serif);
  --fm:var(--font-mono,'JetBrains Mono',monospace);
}

.pg{min-height:100vh;background:var(--bg);color:var(--fg);font-family:var(--fu);overflow-x:hidden;position:relative}
.wrap{max-width:1240px;margin:0 auto;padding:0 32px}
.mk{font-family:var(--fm)}

/* Ambient */
.amb{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ag1{position:absolute;width:900px;height:900px;top:-350px;left:-250px;background:radial-gradient(circle,rgba(139,92,246,.22) 0%,transparent 65%);filter:blur(90px);animation:orb1 28s ease-in-out infinite alternate}
.ag2{position:absolute;width:700px;height:700px;top:15%;right:-180px;background:radial-gradient(circle,rgba(34,211,238,.16) 0%,transparent 65%);filter:blur(80px);animation:orb2 35s ease-in-out infinite alternate}
.ag3{position:absolute;width:600px;height:600px;bottom:5%;left:15%;background:radial-gradient(circle,rgba(139,92,246,.14) 0%,transparent 65%);filter:blur(80px);animation:orb1 42s ease-in-out infinite alternate-reverse}
.agr{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.028) 1px,transparent 1px);background-size:30px 30px}
@keyframes orb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(60px,45px) scale(1.08)}}
@keyframes orb2{0%{transform:translate(0,0) scale(1.05)}100%{transform:translate(-45px,55px) scale(1)}}

/* Nav */
.nav{position:sticky;top:0;z-index:100;height:64px;background:rgba(6,6,18,.85);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--b)}
.nav-in{max-width:1240px;margin:0 auto;padding:0 32px;height:100%;display:flex;align-items:center;justify-content:space-between;gap:24px}
.nav-links{display:flex;gap:4px}
.nla{padding:6px 13px;font-size:13.5px;font-weight:500;color:var(--fg3);text-decoration:none;border-radius:7px;transition:color .15s,background .15s}
.nla:hover{color:var(--fg2);background:rgba(255,255,255,.05)}
.nav-r{display:flex;align-items:center;gap:12px}
.status-pill{display:flex;align-items:center;gap:6px;padding:5px 11px;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.18);border-radius:20px;font-family:var(--fm);font-size:9px;letter-spacing:.12em;color:rgba(74,222,128,.82)}
.sdot{width:5px;height:5px;border-radius:50%;background:var(--g);box-shadow:0 0 6px var(--g);animation:blink 2.2s ease-in-out infinite;flex-shrink:0}
.nav-cta{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;background:linear-gradient(135deg,var(--p) 0%,var(--p2) 100%);border-radius:8px;font-size:13px;font-weight:700;color:#fff;text-decoration:none;transition:opacity .15s,transform .15s,box-shadow .15s;box-shadow:0 4px 18px rgba(124,58,237,.35);font-family:var(--fd)}
.nav-cta:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 28px rgba(124,58,237,.45)}

/* Wordmark */
.wm{display:inline-flex;align-items:center;gap:9px;text-decoration:none;flex-shrink:0}
.wm-mark{width:30px;height:30px;background:linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(139,92,246,.45);flex-shrink:0}
.wm-inner{width:15px;height:18px;background:rgba(255,255,255,.95);clip-path:polygon(0% 0%,68% 0%,100% 26%,100% 100%,0% 100%)}
.wm-name{font-family:var(--fd);font-size:17.5px;font-weight:800;color:var(--fg);letter-spacing:-.03em}
.wm-name em{font-style:normal;color:var(--pl)}
.wm-badge{font-family:var(--fm);font-size:8px;font-weight:700;letter-spacing:.12em;color:var(--pl);background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.25);padding:2px 7px;border-radius:4px;margin-left:2px}

/* Hero */
.hero{position:relative;z-index:1;padding:88px 0 80px;min-height:calc(100vh - 64px);display:flex;align-items:center}
.hero-grid{display:grid;grid-template-columns:1fr 468px;gap:72px;align-items:center;width:100%}
.hero-l{display:flex;flex-direction:column}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.28);border-radius:20px;font-family:var(--fm);font-size:9.5px;letter-spacing:.14em;color:var(--pl);margin-bottom:26px;width:fit-content}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--pl);box-shadow:0 0 6px var(--pl);animation:blink 2s ease-in-out infinite;flex-shrink:0}
.hero-h1{font-family:var(--fd);font-weight:800;line-height:.96;letter-spacing:-.045em;margin-bottom:22px}
.hero-h1 .l1{display:block;font-size:clamp(20px,2.6vw,30px);color:var(--fg3);font-weight:600;letter-spacing:-.02em;margin-bottom:10px}
.hero-h1 .l2{display:block;font-size:clamp(60px,8.8vw,112px);background:linear-gradient(115deg,#f0f4ff 10%,#a78bfa 48%,#818cf8 72%,#f0f4ff 100%);background-size:260% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 6s linear infinite}
.hero-h1 .l3{display:block;font-size:clamp(60px,8.8vw,112px);background:linear-gradient(115deg,#a78bfa 0%,#22d3ee 55%,#818cf8 100%);background-size:260% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 6s linear infinite reverse}
@keyframes tflow{0%{background-position:0% center}100%{background-position:260% center}}
.hero-sub{font-size:16px;line-height:1.78;color:var(--fg2);margin-bottom:36px;max-width:510px}
.hero-acts{display:flex;gap:12px;margin-bottom:44px;flex-wrap:wrap}
.btn-p{display:inline-flex;align-items:center;gap:9px;padding:14px 28px;background:linear-gradient(135deg,var(--p) 0%,var(--p2) 100%);border-radius:10px;font-family:var(--fd);font-size:14px;font-weight:700;color:#fff;text-decoration:none;transition:transform .18s,box-shadow .18s;box-shadow:0 8px 30px rgba(139,92,246,.42)}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(139,92,246,.52)}
.btn-s{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;background:rgba(255,255,255,.04);border:1px solid var(--bh);border-radius:10px;font-size:13.5px;font-weight:500;color:var(--fg2);text-decoration:none;transition:all .18s}
.btn-s:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.18);color:var(--fg)}
.hero-pills{display:flex;flex-wrap:wrap;gap:8px}
.hpill{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;background:rgba(255,255,255,.04);border:1px solid var(--b);border-radius:20px;font-family:var(--fm);font-size:10px;letter-spacing:.07em;color:var(--fg3)}
.hpill strong{color:var(--fg);font-weight:700}

/* Hero right mockup */
.hero-r{position:relative;display:flex;align-items:center;justify-content:center}
.mock-wrap{position:relative;width:100%;max-width:430px}
.mock-glow{position:absolute;inset:-50px;background:radial-gradient(ellipse at 50% 50%,rgba(139,92,246,.28) 0%,rgba(34,211,238,.12) 50%,transparent 72%);filter:blur(50px);border-radius:50%;pointer-events:none}
.mock-card{position:relative;background:rgba(11,11,26,.92);border:1px solid rgba(255,255,255,.11);border-radius:18px;overflow:hidden;box-shadow:0 40px 90px -20px rgba(0,0,0,.85),0 0 0 1px rgba(139,92,246,.12),inset 0 1px 0 rgba(255,255,255,.05)}
.mock-chrome{display:flex;align-items:center;gap:7px;padding:12px 16px;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.06)}
.mcd{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.mcdr{background:#ff5f57}.mcdy{background:#febc2e}.mcdg{background:#28c840}
.mc-title{font-family:var(--fm);font-size:9.5px;letter-spacing:.06em;color:var(--fg3);margin-left:7px}
.mock-tb{display:flex;align-items:center;gap:4px;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.04)}
.mt{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--fg3);cursor:default}
.mt.on{background:rgba(139,92,246,.2);border-color:rgba(139,92,246,.4);color:var(--pl)}
.mt-sep{width:1px;height:20px;background:rgba(255,255,255,.06);margin:0 3px}
.mock-body{display:grid;grid-template-columns:52px 1fr}
.mock-pages{padding:10px 7px;background:rgba(0,0,0,.22);border-right:1px solid rgba(255,255,255,.05);display:flex;flex-direction:column;gap:7px;align-items:center}
.mock-pg{width:36px;height:50px;background:rgba(255,255,255,.05);border-radius:3px;border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center}
.mock-pg.on{border-color:rgba(139,92,246,.5);background:rgba(139,92,246,.12)}
.mock-pg-n{font-family:var(--fm);font-size:7px;color:var(--fg3)}
.mock-doc{padding:16px;background:#f8fafc;min-height:210px;position:relative}
.doc-head{margin-bottom:12px}
.doc-title{font-family:var(--fm);font-size:11px;font-weight:700;color:#1e1b4b;letter-spacing:.05em}
.doc-sub{font-size:8px;color:#9ca3af;margin-top:2px}
.doc-div{height:1px;background:#e5e7eb;margin-bottom:11px}
.doc-row{display:flex;flex-direction:column;gap:2px;margin-bottom:9px}
.doc-lbl{font-size:7px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em}
.doc-field{height:21px;border-radius:4px;border:1.5px solid #d1d5db;display:flex;align-items:center;padding:0 8px;font-size:9px}
.doc-field.ok{background:rgba(16,185,129,.07);border-color:#10b981;color:#065f46}
.doc-field.act{background:rgba(139,92,246,.06);border-color:#8b5cf6;color:#4c1d95;animation:pf 1.6s ease-in-out infinite}
@keyframes pf{0%,100%{border-color:#8b5cf6}50%{border-color:#a78bfa;box-shadow:0 0 0 3px rgba(139,92,246,.1)}}
.doc-sig{height:30px;border:1.5px dashed #d1d5db;border-radius:4px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:4px 8px}

/* Floating chips */
.chip{position:absolute;display:flex;align-items:center;gap:7px;padding:8px 13px;border-radius:10px;font-size:11px;font-weight:600;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);white-space:nowrap;animation:floatin .5s ease-out both;z-index:2}
.chip-ai{top:-18px;right:-18px;background:rgba(139,92,246,.22);border:1px solid rgba(139,92,246,.42);color:var(--pl);animation-delay:.4s}
.chip-ok{bottom:66px;left:-22px;background:rgba(16,185,129,.16);border:1px solid rgba(16,185,129,.38);color:#34d399;animation-delay:.7s}
.chip-spd{bottom:-14px;right:10%;background:rgba(34,211,238,.14);border:1px solid rgba(34,211,238,.32);color:var(--c);animation-delay:1s}
.chip-ic{font-size:14px}
@keyframes floatin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Ticker */
.ticker{position:relative;z-index:1;overflow:hidden;border-top:1px solid var(--b);border-bottom:1px solid var(--b);padding:12px 0;background:rgba(255,255,255,.01)}
.tktr{display:inline-flex;width:max-content;animation:roll 62s linear infinite}
.ti{display:inline-flex;align-items:center;gap:10px;padding:0 22px}
.tis{font-size:8px;color:var(--pl);opacity:.55}
.tin{font-family:var(--fm);font-size:9.5px;letter-spacing:.1em;color:var(--fg3)}
@keyframes roll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* Section */
.sec{position:relative;z-index:1;padding:100px 0}
.sec-tag{font-family:var(--fm);font-size:9.5px;letter-spacing:.18em;color:rgba(167,139,250,.7);display:block;margin-bottom:12px}
.sec-h{font-family:var(--fd);font-size:clamp(30px,4vw,50px);font-weight:800;letter-spacing:-.04em;color:var(--fg);line-height:1.05;margin-bottom:12px}
.sec-sub{font-size:15px;color:var(--fg3);line-height:1.72;max-width:560px;margin-bottom:56px}

/* Featured tool card */
.feat{display:flex;background:rgba(139,92,246,.05);border:1px solid rgba(139,92,246,.22);border-radius:22px;overflow:hidden;margin-bottom:16px;text-decoration:none;color:inherit;transition:border-color .22s,box-shadow .22s,transform .22s;position:relative}
.feat::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,92,246,.08) 0%,transparent 58%);pointer-events:none}
.feat:hover{border-color:rgba(167,139,250,.5);box-shadow:0 30px 90px -18px rgba(139,92,246,.35);transform:translateY(-3px)}
.feat-l{flex:1;padding:42px 46px;display:flex;flex-direction:column}
.feat-live{display:inline-flex;align-items:center;gap:7px;padding:5px 13px;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.24);border-radius:5px;font-family:var(--fm);font-size:9px;letter-spacing:.12em;color:rgba(74,222,128,.92);margin-bottom:22px;width:fit-content}
.feat-live-dot{width:5px;height:5px;border-radius:50%;background:var(--g);animation:blink 2s ease-in-out infinite}
.feat-name{font-family:var(--fd);font-size:32px;font-weight:800;letter-spacing:-.035em;color:var(--fg);margin-bottom:11px}
.feat-desc{font-size:14px;color:var(--fg2);line-height:1.72;margin-bottom:26px;max-width:480px}
.feat-caps{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin-bottom:34px}
.feat-cap{display:flex;align-items:center;gap:7px;padding:5px 13px;background:rgba(255,255,255,.04);border:1px solid var(--b);border-radius:20px;font-size:12.5px;color:var(--fg2)}
.feat-cap em{font-style:normal;font-size:11px;color:var(--pl);font-weight:700}
.feat-cta{display:inline-flex;align-items:center;gap:8px;padding:12px 26px;background:linear-gradient(135deg,var(--p) 0%,var(--p2) 100%);border-radius:10px;font-family:var(--fd);font-size:13.5px;font-weight:700;color:#fff;width:fit-content;transition:box-shadow .18s,transform .18s}
.feat:hover .feat-cta{box-shadow:0 10px 32px rgba(139,92,246,.5);transform:translateY(-1px)}
.feat-r{width:230px;flex-shrink:0;background:rgba(0,0,0,.22);border-left:1px solid rgba(139,92,246,.1);padding:34px 22px;display:flex;flex-direction:column;gap:7px}
.feat-r-lbl{font-family:var(--fm);font-size:8.5px;letter-spacing:.15em;color:var(--fg3);margin-bottom:6px}
.feat-r-row{display:flex;align-items:center;gap:8px;padding:8px 11px;background:rgba(255,255,255,.03);border:1px solid var(--b);border-radius:8px;font-size:12px;color:var(--fg2);animation:findin .3s ease-out both}
.feat-r-ic{font-family:var(--fm);font-size:9px;color:var(--pl);font-weight:700}

/* Tool grid */
.tool-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tc{display:flex;align-items:center;gap:12px;padding:16px 18px;background:rgba(255,255,255,.025);border:1px solid var(--b);border-radius:13px;text-decoration:none;color:inherit;transition:background .18s,border-color .18s,transform .18s;position:relative;overflow:hidden}
.tc::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ac,var(--p));opacity:.45;border-radius:3px 0 0 3px;transition:opacity .18s}
.tc:hover{background:rgba(255,255,255,.042);transform:translateY(-1px)}
.tc:hover::before{opacity:1}
.tc-num{font-family:var(--fm);font-size:9.5px;color:var(--fg3);width:22px;flex-shrink:0}
.tc-info{flex:1;min-width:0}
.tc-name{font-size:13px;font-weight:600;color:rgba(240,244,255,.75);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .15s}
.tc:hover .tc-name{color:rgba(240,244,255,.92)}
.tc-cat{font-family:var(--fm);font-size:8px;letter-spacing:.1em;color:var(--fg3)}
.tc-tag{flex-shrink:0;padding:2px 8px;border-radius:4px;font-family:var(--fm);font-size:8px;font-weight:700;letter-spacing:.08em}
.tag-live{background:rgba(74,222,128,.12);color:#4ade80;border:1px solid rgba(74,222,128,.25)}
.tag-beta{background:rgba(34,211,238,.1);color:var(--c);border:1px solid rgba(34,211,238,.22);display:inline-flex;align-items:center;gap:4px}
.tag-beta-dot{width:4px;height:4px;border-radius:50%;background:var(--c);display:inline-block}
.tag-soon{background:rgba(255,255,255,.04);color:var(--fg3);border:1px solid var(--b)}

/* Features */
.fsec{border-top:1px solid var(--b)}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--b);border-radius:18px;overflow:hidden;margin-bottom:60px;background:rgba(255,255,255,.015)}
.stat{padding:30px 24px;text-align:center;border-right:1px solid var(--b)}
.stat:last-child{border-right:none}
.stat-l{font-family:var(--fm);font-size:9px;letter-spacing:.14em;color:var(--pl);text-transform:uppercase;display:block;margin-bottom:8px}
.stat-v{font-family:var(--fd);font-size:42px;font-weight:800;letter-spacing:-.045em;background:linear-gradient(135deg,var(--fg) 0%,var(--pl) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block;margin-bottom:6px}
.stat-d{font-size:12px;color:var(--fg3);line-height:1.5}
.fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:56px}
.fgi{padding:30px;background:rgba(255,255,255,.025);border:1px solid var(--b);border-radius:18px;transition:border-color .22s,transform .2s,box-shadow .22s}
.fgi:hover{border-color:rgba(139,92,246,.28);transform:translateY(-2px);box-shadow:0 18px 52px -14px rgba(139,92,246,.2)}
.fgi-icon{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px}
.fgi-title{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--fg);letter-spacing:-.025em;margin-bottom:9px}
.fgi-desc{font-size:13.5px;color:var(--fg3);line-height:1.68}

/* CTA */
.cta-sec{padding:0 0 96px}
.cta-card{position:relative;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.2);border-radius:24px;padding:72px 48px;text-align:center;overflow:hidden}
.cta-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,92,246,.1) 0%,rgba(34,211,238,.04) 60%,transparent 80%);pointer-events:none}
.cta-glow{position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(139,92,246,.22) 0%,transparent 70%);filter:blur(40px);pointer-events:none}
.cta-h{font-family:var(--fd);font-size:clamp(30px,4.2vw,48px);font-weight:800;letter-spacing:-.04em;color:var(--fg);margin-bottom:14px;position:relative;line-height:1.06}
.cta-sub{font-size:16px;color:var(--fg2);margin-bottom:38px;position:relative}
.cta-acts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative}

/* Footer */
.foot{position:relative;z-index:1;border-top:1px solid var(--b);padding:38px 0}
.foot-in{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.foot-nav{display:flex;gap:22px;flex-wrap:wrap}
.foot-nav a{font-size:12.5px;color:var(--fg3);text-decoration:none;font-weight:500;transition:color .15s}
.foot-nav a:hover{color:var(--fg2)}
.foot-copy{font-family:var(--fm);font-size:9.5px;letter-spacing:.08em;color:var(--fg3)}

/* Keyframes */
@keyframes blink{0%,100%{opacity:1}50%{opacity:.18}}
@keyframes findin{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}

/* Responsive */
@media(max-width:1100px){
  .hero-grid{grid-template-columns:1fr;gap:64px}
  .hero-r{display:none}
  .feat-r{display:none}
  .feat-l{padding:30px 28px}
  .fgrid{grid-template-columns:1fr}
  .stats-row{grid-template-columns:repeat(2,1fr)}
  .stat:nth-child(2){border-right:none}
  .stat:nth-child(3){border-top:1px solid var(--b)}
  .stat:nth-child(4){border-top:1px solid var(--b);border-right:none}
  .tool-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  .nav-links{display:none}
  .wrap{padding:0 20px}
  .hero{padding:52px 0 60px}
  .sec{padding:78px 0}
  .feat-name{font-size:26px}
  .feat-l{padding:26px 22px}
  .cta-card{padding:48px 24px}
  .fgrid{grid-template-columns:1fr}
  .stats-row{grid-template-columns:1fr 1fr}
}
@media(max-width:560px){
  .tool-grid{grid-template-columns:1fr}
  .hero-pills{gap:6px}
  .hpill{font-size:9px;padding:5px 10px}
  .hero-acts{flex-direction:column}
  .btn-p,.btn-s{width:100%;justify-content:center}
  .foot-in{flex-direction:column;align-items:center;text-align:center}
  .foot-nav{justify-content:center}
  .cta-acts{flex-direction:column;align-items:center}
}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:rgba(139,92,246,.3);border-radius:2px}
:focus-visible{outline:2px solid var(--pl);outline-offset:3px}

/* ═══ HERO v3 — Document Stream Universe ═══ */
/* Full-viewport centered hero */
.hero{padding:0;min-height:calc(100vh - 64px);display:flex;align-items:center;justify-content:center;overflow:hidden}
/* Document stream */
.doc-stream{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.stream-overlay{position:absolute;inset:0;background:radial-gradient(ellipse 88% 52% at 50% 36%,rgba(6,6,18,.02) 0%,rgba(6,6,18,.76) 38%,rgba(6,6,18,.97) 64%,rgba(6,6,18,1) 82%);z-index:1}
.stream-col{position:absolute;top:0;display:flex;flex-direction:column;gap:14px;padding-top:14px;will-change:transform}
.sca{left:0;animation:sup 22s linear infinite}
.scb{left:214px;animation:sup 17s linear infinite;animation-delay:-7s}
.scc{left:428px;animation:sup 26s linear infinite;animation-delay:-13s}
.scd{left:642px;animation:sup 20s linear infinite;animation-delay:-4s}
.sce{left:856px;animation:sup 24s linear infinite;animation-delay:-10s}
.scf{left:1070px;animation:sup 19s linear infinite;animation-delay:-16s}
@keyframes sup{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
/* Mini document cards */
.md{width:200px;flex-shrink:0;border-radius:12px;background:rgba(255,255,255,.026);border:1px solid rgba(255,255,255,.058);padding:12px;overflow:hidden;position:relative}
.md-bar{display:flex;align-items:center;gap:4px;margin-bottom:9px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.045)}
.mdd{width:7px;height:7px;border-radius:50%}
.mddr{background:rgba(255,95,87,.7)}.mddy{background:rgba(254,188,46,.7)}.mddg{background:rgba(39,201,63,.7)}
.md-fn{font-family:var(--fm);font-size:6.5px;color:rgba(255,255,255,.22);margin-left:5px;flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.md-bg{font-family:var(--fm);font-size:5.5px;padding:2px 5px;border-radius:3px;font-weight:700;letter-spacing:.06em;flex-shrink:0}
.md-bg-a{background:rgba(139,92,246,.18);border:1px solid rgba(139,92,246,.3);color:#c4b5fd}
.md-bg-o{background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.26);color:#67e8f9}
.md-ln{height:5px;border-radius:2px;background:rgba(255,255,255,.07);margin-bottom:5px}
.md-f{height:13px;border-radius:3px;border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 6px;gap:4px;margin-bottom:5px;font-family:var(--fm);font-size:6px;color:rgba(255,255,255,.28)}
.md-f.ok{border-color:rgba(16,185,129,.28);background:rgba(16,185,129,.05);color:rgba(52,211,153,.7)}
.md-f.pls{border-color:rgba(139,92,246,.4);background:rgba(139,92,246,.06);animation:mdp 2.5s ease-in-out infinite}
@keyframes mdp{0%,100%{border-color:rgba(139,92,246,.4)}50%{border-color:rgba(167,139,250,.7);box-shadow:0 0 0 2px rgba(139,92,246,.12)}}
.md-hl{height:7px;border-radius:2px;background:rgba(251,191,36,.18);border:1px solid rgba(251,191,36,.22);margin-bottom:5px}
.md-sig{height:18px;border:1px dashed rgba(255,255,255,.07);border-radius:4px;margin-top:4px;display:flex;align-items:center;padding:0 6px}
.md-chk{color:rgba(52,211,153,.7);font-size:8px;margin-left:auto}
/* Hero centered content */
.hero-c{position:relative;z-index:2;text-align:center;padding:60px 0}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.28);border-radius:20px;font-family:var(--fm);font-size:9.5px;letter-spacing:.14em;color:var(--pl);margin-bottom:34px;width:fit-content}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--pl);box-shadow:0 0 6px var(--pl);animation:blink 2s ease-in-out infinite;flex-shrink:0}
.hero-h1{font-family:var(--fd);font-weight:800;line-height:.9;letter-spacing:-.058em;margin-bottom:28px}
.h1-row1{display:block;font-size:clamp(52px,9vw,116px);color:var(--fg)}
.h1-row2{display:block;font-size:clamp(52px,9vw,116px);background:linear-gradient(115deg,#a78bfa 0%,#818cf8 38%,#22d3ee 76%,#a78bfa 100%);background-size:280% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tflow 5s linear infinite}
.hero-sub{font-size:clamp(15px,1.8vw,17.5px);color:var(--fg2);line-height:1.78;margin:0 auto 40px;max-width:580px}
.hero-acts{display:flex;gap:12px;justify-content:center;margin-bottom:44px;flex-wrap:wrap}
.btn-p{display:inline-flex;align-items:center;gap:9px;padding:15px 30px;background:linear-gradient(135deg,var(--p) 0%,var(--p2) 100%);border-radius:12px;font-family:var(--fd);font-size:14.5px;font-weight:700;color:#fff;text-decoration:none;transition:transform .18s,box-shadow .18s;box-shadow:0 8px 32px rgba(139,92,246,.44)}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 18px 52px rgba(139,92,246,.56)}
.btn-s{display:inline-flex;align-items:center;gap:8px;padding:15px 26px;background:rgba(255,255,255,.05);border:1px solid var(--bh);border-radius:12px;font-size:14px;font-weight:500;color:var(--fg2);text-decoration:none;transition:all .18s}
.btn-s:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:var(--fg)}
.hero-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.hpill{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;background:rgba(255,255,255,.04);border:1px solid var(--b);border-radius:20px;font-family:var(--fm);font-size:10px;letter-spacing:.07em;color:var(--fg3)}
.hpill strong{color:var(--fg);font-weight:700}
/* Kill old hero split layout */
.hero-grid{display:contents}
.hero-l,.hero-r{display:none!important}
/* Stream responsive */
@media(max-width:1200px){.scf{display:none}}
@media(max-width:960px){.sce,.scf{display:none}}
@media(max-width:740px){.scd,.sce,.scf{display:none}}
@media(max-width:520px){.scc,.scd,.sce,.scf{display:none}.hero-acts{flex-direction:column;align-items:center}.btn-p,.btn-s{width:100%;max-width:320px;justify-content:center}}

/* ── Animated Hero Demo ── */
.demo-wrap{position:relative;width:100%;max-width:430px}
.demo-glow{position:absolute;inset:-50px;background:radial-gradient(ellipse at 50% 50%,rgba(139,92,246,.28) 0%,rgba(34,211,238,.12) 50%,transparent 72%);filter:blur(50px);border-radius:50%;pointer-events:none}
.demo-card{position:relative;background:rgba(11,11,26,.92);border:1px solid rgba(255,255,255,.11);border-radius:18px;overflow:hidden;box-shadow:0 40px 90px -20px rgba(0,0,0,.85),0 0 0 1px rgba(139,92,246,.12),inset 0 1px 0 rgba(255,255,255,.05)}
.demo-chrome{display:flex;align-items:center;gap:7px;padding:11px 15px;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.06)}
.demo-toolbar{display:flex;align-items:center;gap:3px;padding:6px 10px;background:rgba(255,255,255,.025);border-bottom:1px solid rgba(255,255,255,.05)}
.dtb{width:26px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--fg3);cursor:default}
.dtb.on{background:rgba(139,92,246,.18);color:var(--pl)}
.dtb-sep{width:1px;height:14px;background:rgba(255,255,255,.08);margin:0 3px}
.dtb-ai{font-size:8px!important;font-family:var(--fm);letter-spacing:.05em;width:auto!important;padding:0 8px!important;color:rgba(139,92,246,.8)!important}
.demo-body{display:flex}
.demo-pages{display:flex;flex-direction:column;gap:8px;padding:10px 7px;background:rgba(0,0,0,.18);border-right:1px solid rgba(255,255,255,.06);min-width:50px;align-items:center}
.demo-pg{width:36px;height:50px;background:rgba(255,255,255,.05);border-radius:3px;border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center}
.demo-pg.on{border-color:rgba(139,92,246,.5);background:rgba(139,92,246,.12)}
.demo-pg-n{font-family:var(--fm);font-size:7px;color:var(--fg3)}
.demo-doc{flex:1;padding:16px 14px;position:relative;overflow:hidden}
.demo-doc-title{font-family:var(--fm);font-size:12px;font-weight:700;color:#f0f4ff;letter-spacing:.06em;margin-bottom:3px}
.demo-doc-sub{font-family:var(--fm);font-size:7.5px;color:var(--fg3);margin-bottom:10px}
.demo-div{height:1px;background:rgba(255,255,255,.07);margin:8px 0}
.demo-row{display:flex;align-items:center;gap:8px;margin-bottom:9px}
.demo-lbl{font-family:var(--fm);font-size:7.5px;color:var(--fg3);min-width:48px;flex-shrink:0}
.demo-field{flex:1;height:20px;border-radius:4px;border:1.5px solid rgba(255,255,255,.1);display:flex;align-items:center;padding:0 7px;font-size:8.5px;font-family:var(--fm);color:rgba(255,255,255,.75);background:rgba(255,255,255,.03);position:relative;overflow:hidden}
.demo-sig-box{flex:1;height:30px;border-radius:4px;border:1.5px dashed rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
/* scan line — phase 1 (0-33%) */
@keyframes demo-scan{0%,2%{top:0%;opacity:0}5%{opacity:1}28%{top:105%;opacity:1}32%,100%{top:105%;opacity:0}}
.demo-scan{position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,transparent,rgba(139,92,246,.7) 30%,rgba(200,175,255,1) 50%,rgba(139,92,246,.7) 70%,transparent);box-shadow:0 0 12px rgba(139,92,246,.9),0 0 28px rgba(139,92,246,.4);animation:demo-scan 12s linear infinite;pointer-events:none;z-index:3}
/* detection glow on fields — staggered within phase 1 */
@keyframes df1{0%,10%{border-color:rgba(255,255,255,.1);box-shadow:none}16%,27%{border-color:rgba(139,92,246,.7);box-shadow:0 0 0 2.5px rgba(139,92,246,.18)}33%,100%{border-color:rgba(255,255,255,.1);box-shadow:none}}
@keyframes df2{0%,13%{border-color:rgba(255,255,255,.1);box-shadow:none}19%,27%{border-color:rgba(139,92,246,.7);box-shadow:0 0 0 2.5px rgba(139,92,246,.18)}33%,100%{border-color:rgba(255,255,255,.1);box-shadow:none}}
@keyframes df3{0%,16%{border-color:rgba(255,255,255,.1);box-shadow:none}22%,27%{border-color:rgba(139,92,246,.7);box-shadow:0 0 0 2.5px rgba(139,92,246,.18)}33%,100%{border-color:rgba(255,255,255,.1);box-shadow:none}}
.demo-field.fa{animation:df1 12s linear infinite}
.demo-field.fb{animation:df2 12s linear infinite}
.demo-field.fc{animation:df3 12s linear infinite}
/* text reveal — phase 2 (33-67%), staggered */
@keyframes tf1{0%,33%{max-width:0;opacity:0}37%{opacity:1}44%,100%{max-width:130px;opacity:1}}
@keyframes tf2{0%,38%{max-width:0;opacity:0}42%{opacity:1}49%,100%{max-width:130px;opacity:1}}
@keyframes tf3{0%,43%{max-width:0;opacity:0}47%{opacity:1}54%,100%{max-width:130px;opacity:1}}
.demo-ftxt{display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:middle}
.demo-ftxt.ta{animation:tf1 12s linear infinite}
.demo-ftxt.tb{animation:tf2 12s linear infinite}
.demo-ftxt.tc{animation:tf3 12s linear infinite}
/* blinking cursor — shown only while that field is typing */
@keyframes cblink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes cshow1{0%,33%{opacity:0}35%,44%{opacity:1}47%,100%{opacity:0}}
@keyframes cshow2{0%,38%{opacity:0}40%,49%{opacity:1}52%,100%{opacity:0}}
@keyframes cshow3{0%,43%{opacity:0}45%,57%{opacity:1}60%,100%{opacity:0}}
.demo-cur{display:inline-block;width:1.5px;height:9px;background:#a78bfa;margin-left:1px;vertical-align:middle}
.demo-cur.ca{animation:cblink .7s ease-in-out infinite,cshow1 12s linear infinite}
.demo-cur.cb{animation:cblink .7s ease-in-out infinite,cshow2 12s linear infinite}
.demo-cur.cc{animation:cblink .7s ease-in-out infinite,cshow3 12s linear infinite}
/* signature draw — phase 2 */
@keyframes sigdraw{0%,42%{stroke-dashoffset:220}62%,100%{stroke-dashoffset:0}}
.demo-sig-path{stroke-dasharray:220;stroke-dashoffset:220;animation:sigdraw 12s linear infinite}
/* yellow highlight sweep — phase 3 (67-100%) */
@keyframes hlsweep{0%,67%{transform:scaleX(0);opacity:0}72%{opacity:1;transform:scaleX(1)}97%,100%{opacity:.55;transform:scaleX(1)}}
.demo-hl{position:absolute;inset:0;background:rgba(251,191,36,.22);transform-origin:left;transform:scaleX(0);animation:hlsweep 12s linear infinite;pointer-events:none;border-radius:2px}
/* vanishing status chips */
@keyframes dc1anim{0%,14%{opacity:0;transform:translateY(8px)}18%,28%{opacity:1;transform:translateY(0)}33%,100%{opacity:0;transform:translateY(-4px)}}
@keyframes dc2anim{0%,50%{opacity:0;transform:translateY(8px)}54%,64%{opacity:1;transform:translateY(0)}67%,100%{opacity:0;transform:translateY(-4px)}}
@keyframes dc3anim{0%,80%{opacity:0;transform:translateY(8px)}84%,96%{opacity:1;transform:translateY(0)}100%{opacity:0}}
.demo-chip{position:absolute;display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:10px;font-size:10.5px;font-weight:600;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);white-space:nowrap;z-index:4;opacity:0;pointer-events:none}
.dc1{top:-16px;right:-14px;background:rgba(139,92,246,.2);border:1px solid rgba(139,92,246,.4);color:#c4b5fd;animation:dc1anim 12s linear infinite}
.dc2{bottom:52px;left:-20px;background:rgba(16,185,129,.14);border:1px solid rgba(16,185,129,.35);color:#34d399;animation:dc2anim 12s linear infinite}
.dc3{bottom:-12px;right:6%;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.28);color:#67e8f9;animation:dc3anim 12s linear infinite}
.dc-ic{font-size:12px}
`

// ── Mini PDF card variants for the stream background ──
function CardA() {
  return (
    <div className="md">
      <div className="md-bar">
        <span className="mdd mddr"/><span className="mdd mddy"/><span className="mdd mddg"/>
        <span className="md-fn">invoice_2025.pdf</span>
        <span className="md-bg md-bg-a">✦ AI</span>
      </div>
      <div className="md-ln" style={{width:'55%'}}/>
      <div className="md-f ok">Acme Corporation<span className="md-chk">✓</span></div>
      <div className="md-f ok">$4,820.00<span className="md-chk">✓</span></div>
      <div className="md-f pls">06 / 05 / 2026</div>
      <div className="md-sig"/>
    </div>
  )
}
function CardB() {
  return (
    <div className="md">
      <div className="md-bar">
        <span className="mdd mddr"/><span className="mdd mddy"/><span className="mdd mddg"/>
        <span className="md-fn">contract_v3.pdf</span>
      </div>
      <div className="md-ln" style={{width:'42%'}}/>
      <div className="md-ln" style={{width:'90%'}}/>
      <div className="md-ln" style={{width:'76%'}}/>
      <div className="md-hl"/>
      <div className="md-ln" style={{width:'88%'}}/>
      <div className="md-ln" style={{width:'62%'}}/>
      <div className="md-sig"/>
    </div>
  )
}
function CardC() {
  return (
    <div className="md">
      <div className="md-bar">
        <span className="mdd mddr"/><span className="mdd mddy"/><span className="mdd mddg"/>
        <span className="md-fn">application_form.pdf</span>
      </div>
      <div className="md-ln" style={{width:'50%'}}/>
      <div className="md-f ok">John A. Smith<span className="md-chk">✓</span></div>
      <div className="md-f ok">john@acme.com<span className="md-chk">✓</span></div>
      <div className="md-f ok">123 Main St, NY<span className="md-chk">✓</span></div>
      <div className="md-sig">
        <svg viewBox="0 0 80 16" width="76" height="16" fill="none" aria-hidden="true">
          <path d="M2,12 Q8,3 14,12 Q20,18 28,5 Q36,-2 44,12 Q50,20 58,5 Q64,0 72,12" stroke="rgba(139,92,246,.55)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}
function CardD() {
  return (
    <div className="md">
      <div className="md-bar">
        <span className="mdd mddr"/><span className="mdd mddy"/><span className="mdd mddg"/>
        <span className="md-fn">scan_doc_001.pdf</span>
        <span className="md-bg md-bg-o">OCR</span>
      </div>
      <div className="md-ln" style={{width:'38%'}}/>
      <div className="md-ln" style={{width:'94%'}}/>
      <div className="md-ln" style={{width:'81%'}}/>
      <div className="md-ln" style={{width:'67%'}}/>
      <div className="md-ln" style={{width:'89%'}}/>
      <div className="md-ln" style={{width:'52%'}}/>
    </div>
  )
}

export default function HomePage() {
  const others = TOOLS.slice(1)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Ambient */}
        <div className="amb" aria-hidden="true">
          <div className="ag1" /><div className="ag2" /><div className="ag3" /><div className="agr" />
        </div>

        {/* Nav */}
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-in">
            <Link href="/" className="wm" aria-label="EditPDF AI home">
              <span className="wm-mark" aria-hidden="true"><span className="wm-inner" /></span>
              <span className="wm-name">Edit<em>PDF</em></span>
              <span className="wm-badge mk">.AI</span>
            </Link>
            <div className="nav-links">
              <a href="#tools" className="nla">Tools</a>
              <a href="#features" className="nla">Features</a>
            </div>
            <div className="nav-r">
              <div className="status-pill" aria-label="Service online">
                <span className="sdot" aria-hidden="true" /><span className="mk">ONLINE</span>
              </div>
              <Link href="/ai-pdf-form-filler" className="nav-cta">Open Editor →</Link>
            </div>
          </div>
        </nav>

        {/* Hero — Document Stream Universe */}
        <header className="hero" aria-labelledby="hero-h1">

          {/* Background: 6 columns of floating mini PDF cards */}
          <div className="doc-stream" aria-hidden="true">
            <div className="stream-col sca">
              <CardA/><CardB/><CardC/><CardD/><CardA/><CardB/><CardC/><CardD/>
            </div>
            <div className="stream-col scb">
              <CardC/><CardD/><CardA/><CardB/><CardC/><CardD/><CardA/><CardB/>
            </div>
            <div className="stream-col scc">
              <CardB/><CardA/><CardD/><CardC/><CardB/><CardA/><CardD/><CardC/>
            </div>
            <div className="stream-col scd">
              <CardD/><CardC/><CardB/><CardA/><CardD/><CardC/><CardB/><CardA/>
            </div>
            <div className="stream-col sce">
              <CardA/><CardC/><CardB/><CardD/><CardA/><CardC/><CardB/><CardD/>
            </div>
            <div className="stream-col scf">
              <CardD/><CardB/><CardA/><CardC/><CardD/><CardB/><CardA/><CardC/>
            </div>
            <div className="stream-overlay"/>
          </div>

          {/* Centered copy over the stream */}
          <div className="wrap">
            <div className="hero-c">
              <div className="hero-badge" aria-hidden="true">
                <span className="bdot"/><span className="mk">AI PDF PLATFORM · 17 TOOLS</span>
              </div>
              <h1 id="hero-h1" className="hero-h1">
                <span className="h1-row1">Every PDF task.</span>
                <span className="h1-row2">Handled by AI.</span>
              </h1>
              <p className="hero-sub">
                Edit, sign, annotate and AI‑fill PDF documents in seconds.
                Free. No signup. Works in any browser.
              </p>
              <div className="hero-acts">
                <Link href="/ai-pdf-form-filler" className="btn-p">
                  Try AI Form Filler
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tools" className="btn-s">Explore all tools</a>
              </div>
              <div className="hero-pills" role="list" aria-label="Key features">
                {([['17','AI Tools'],['140+','Languages'],['Free','Forever'],['No','Signup']] as const).map(([v,l])=>(
                  <div key={l} className="hpill" role="listitem">
                    <strong>{v}</strong><span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Ticker */}
        <div className="ticker" aria-hidden="true" role="presentation">
          <div className="tktr">
            {[...TOOLS,...TOOLS].map((t,i)=>(
              <span key={i} className="ti">
                <span className="tis">✦</span>
                <span className="tin mk">{t.name.toUpperCase()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tools section */}
        <section id="tools" className="sec" aria-labelledby="tools-h">
          <div className="wrap">
            <span className="sec-tag mk">// TOOL REGISTRY</span>
            <h2 id="tools-h" className="sec-h">17 PDF Tools.<br/>One Platform.</h2>
            <p className="sec-sub">Everything you need to work with PDFs — powered by AI. Free, no account required.</p>

            {/* Featured — AI Form Filler */}
            <Link href="/ai-pdf-form-filler" className="feat" aria-label="AI Form Filler — open free now">
              <div className="feat-l">
                <div className="feat-live mk"><span className="feat-live-dot" />LIVE NOW · FREE</div>
                <h3 className="feat-name">AI Form Filler</h3>
                <p className="feat-desc">{TOOLS[0].desc}</p>
                <ul className="feat-caps" aria-label="Features">
                  {['AI Form Filling','E-Signatures','OCR Scanner','Text Editing','Page Management'].map(c=>(
                    <li key={c} className="feat-cap"><em>✓</em>{c}</li>
                  ))}
                </ul>
                <span className="feat-cta">
                  Open Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
              <div className="feat-r" aria-hidden="true">
                <p className="feat-r-lbl mk">CAPABILITIES</p>
                {['AI Field Detection','Smart Signatures','Chat Fill','Text Editing','OCR Scanner','Page Manager','Annotations','Batch Export'].map((c,i)=>(
                  <div key={c} className="feat-r-row" style={{ animationDelay:`${i*0.07}s` } as React.CSSProperties}>
                    <span className="feat-r-ic">✓</span>{c}
                  </div>
                ))}
              </div>
            </Link>

            {/* Featured — PDF Editor */}
            <Link href="/pdf-editor" className="feat" aria-label="PDF Editor — open free now" style={{ marginTop: 12, background: 'rgba(34,211,238,.05)', borderColor: 'rgba(34,211,238,.22)' }}>
              <div className="feat-l">
                <div className="feat-live mk" style={{ background:'rgba(34,211,238,.1)', borderColor:'rgba(34,211,238,.24)', color:'rgba(34,211,238,.9)' }}><span className="feat-live-dot" style={{ background:'#22d3ee' }} />LIVE NOW · FREE</div>
                <h3 className="feat-name">PDF Editor</h3>
                <p className="feat-desc">{TOOLS[1].desc}</p>
                <ul className="feat-caps" aria-label="Features">
                  {['Text Editing','Image Insertion','Shapes & Lines','Signatures','Page Manager'].map(c=>(
                    <li key={c} className="feat-cap"><em>✓</em>{c}</li>
                  ))}
                </ul>
                <span className="feat-cta" style={{ background:'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
                  Open Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
              <div className="feat-r" aria-hidden="true" style={{ borderColor:'rgba(34,211,238,.1)' }}>
                <p className="feat-r-lbl mk">CAPABILITIES</p>
                {['Text Editing','Image Insertion','Freehand Draw','Highlights','Shapes & Lines','Stamps','Watermarks','Page Manager'].map((c,i)=>(
                  <div key={c} className="feat-r-row" style={{ animationDelay:`${i*0.07}s` } as React.CSSProperties}>
                    <span className="feat-r-ic" style={{ color:'#22d3ee' }}>✓</span>{c}
                  </div>
                ))}
              </div>
            </Link>

            {/* Tool grid */}
            <div className="tool-grid" role="list" aria-label="All tools">
              {others.map((t,i)=> {
                const isLive = t.tag === 'LIVE' && t.href
                const inner = (
                  <>
                    <span className="tc-num mk">{String(i+2).padStart(2,'0')}</span>
                    <div className="tc-info">
                      <div className="tc-name">{t.name}</div>
                      <div className="tc-cat mk">{t.category}</div>
                    </div>
                    {t.tag === 'LIVE' && <span className="tc-tag tag-live">LIVE</span>}
                    {t.tag === 'BETA' && <span className="tc-tag tag-beta"><span className="tag-beta-dot"/>BETA</span>}
                    {t.tag === 'SOON' && <span className="tc-tag tag-soon">SOON</span>}
                  </>
                )
                return isLive
                  ? <Link key={t.id} href={t.href} className="tc" role="listitem" style={{ '--ac': t.accent } as React.CSSProperties}>{inner}</Link>
                  : <div  key={t.id}               className="tc" role="listitem" style={{ '--ac': t.accent } as React.CSSProperties}>{inner}</div>
              })}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="sec fsec" aria-labelledby="feats-h">
          <div className="wrap">
            <span className="sec-tag mk">// SYSTEM SPECS</span>
            <h2 id="feats-h" className="sec-h">Enterprise power.<br/>Zero friction.</h2>

            {/* Stats */}
            <dl className="stats-row">
              {([['AI Tools','17','One platform for every PDF need.'],['Languages','140+','Full internationalisation support.'],['Uptime SLA','99.9%','Always-on, enterprise-grade reliability.'],['Response','<10ms','Instant AI at any scale.']] as const).map(([l,v,d])=>(
                <div key={l} className="stat">
                  <dt className="stat-l mk">{l}</dt>
                  <dd className="stat-v">{v}</dd>
                  <p className="stat-d">{d}</p>
                </div>
              ))}
            </dl>

            {/* Feature grid */}
            <div className="fgrid">
              {([
                { ic:'🧠', title:'AI-Powered Intelligence', desc:'State-of-the-art models precision-trained for document understanding. Detects form fields, signatures and data automatically.', bg:'linear-gradient(135deg,rgba(139,92,246,.28),rgba(99,57,222,.2))' },
                { ic:'⚡', title:'Blazing Fast Processing',  desc:'Sub-10ms responses powered by edge computing. Process entire documents instantly — no waiting, no queues.',                    bg:'linear-gradient(135deg,rgba(251,191,36,.28),rgba(245,158,11,.2))' },
                { ic:'🔒', title:'Zero-Knowledge Privacy',   desc:'Your documents stay encrypted end-to-end. We never store, analyse or share your files. Full privacy by design.',               bg:'linear-gradient(135deg,rgba(16,185,129,.28),rgba(5,150,105,.2))' },
                { ic:'🌍', title:'Universal Compatibility',  desc:'Works with any PDF, any device, any browser. 140+ languages, multi-region infrastructure, zero plugins.',                       bg:'linear-gradient(135deg,rgba(34,211,238,.28),rgba(6,182,212,.2))' },
              ]).map(({ ic, title, desc, bg })=>(
                <div key={title} className="fgi">
                  <div className="fgi-icon" style={{ background: bg }}>{ic}</div>
                  <div className="fgi-title">{title}</div>
                  <div className="fgi-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-sec" aria-labelledby="cta-h">
          <div className="wrap">
            <div className="cta-card">
              <div className="cta-glow" aria-hidden="true" />
              <h2 id="cta-h" className="cta-h">Start editing PDFs<br/>right now. Free.</h2>
              <p className="cta-sub">No account. No credit card. No limits.</p>
              <div className="cta-acts">
                <Link href="/ai-pdf-form-filler" className="btn-p">
                  Open PDF Editor
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tools" className="btn-s">Browse all 17 tools</a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="foot" role="contentinfo">
          <div className="wrap foot-in">
            <Link href="/" className="wm" aria-label="EditPDF AI home">
              <span className="wm-mark" aria-hidden="true"><span className="wm-inner" /></span>
              <span className="wm-name">Edit<em>PDF</em></span>
              <span className="wm-badge mk">.AI</span>
            </Link>
            <nav className="foot-nav" aria-label="Footer navigation">
              <Link href="/ai-pdf-form-filler">AI Form Filler</Link>
              <Link href="/pdf-editor">PDF Editor</Link>
              <a href="#tools">All Tools</a>
              <a href="#features">System Specs</a>
            </nav>
            <p className="foot-copy mk" suppressHydrationWarning>
              © {new Date().getFullYear()} EDITPDF AI · ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}
