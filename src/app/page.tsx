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
  { id: 'pdf-editor',    name: 'AI PDF Editor',     tag: 'LIVE', href: '/editor', category: 'EDITOR',   accent: '#818cf8', accentRgb: '129,140,248', desc: 'Edit, annotate, sign and AI-fill PDF forms. Intelligent field detection and instant completion.' },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EditPDF AI',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
`

export default function HomePage() {
  const others = TOOLS.slice(1)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
              <Link href="/editor" className="nav-cta">Open Editor →</Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <header className="hero" aria-labelledby="hero-h1">
          <div className="wrap hero-grid">

            {/* Left */}
            <div className="hero-l">
              <div className="hero-badge" aria-hidden="true">
                <span className="bdot" /><span className="mk">AI PDF PLATFORM · 16 TOOLS</span>
              </div>
              <h1 id="hero-h1" className="hero-h1">
                <span className="l1">The smartest way to</span>
                <span className="l2">Edit PDFs</span>
                <span className="l3">Smarter.</span>
              </h1>
              <p className="hero-sub">
                Edit, sign, annotate and AI‑fill your PDF documents in seconds.
                Precision AI. Free. No signup required.
              </p>
              <div className="hero-acts">
                <Link href="/editor" className="btn-p">
                  Open Editor — Free
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tools" className="btn-s">Explore all tools</a>
              </div>
              <div className="hero-pills" role="list" aria-label="Key features">
                {([['16','AI Tools'],['140+','Languages'],['Free','Forever'],['No','Signup']] as const).map(([v,l])=>(
                  <div key={l} className="hpill" role="listitem">
                    <strong>{v}</strong><span>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — app mockup */}
            <div className="hero-r" aria-hidden="true">
              <div className="mock-wrap">
                <div className="mock-glow" />

                {/* Floating chips */}
                <div className="chip chip-ai">
                  <span className="chip-ic">✦</span>4 fields detected
                </div>
                <div className="chip chip-ok">
                  <span className="chip-ic">✓</span>Signature placed
                </div>
                <div className="chip chip-spd">
                  <span className="chip-ic">⚡</span>847ms
                </div>

                <div className="mock-card">
                  {/* Chrome */}
                  <div className="mock-chrome">
                    <span className="mcd mcdr" /><span className="mcd mcdy" /><span className="mcd mcdg" />
                    <span className="mc-title mk">invoice_2025.pdf</span>
                  </div>
                  {/* Toolbar */}
                  <div className="mock-tb">
                    {(['T','✍','▭','◎','⊕'] as const).map((ic, i) => (
                      <span key={ic} className={`mt${i===1?' on':''}`}>{ic}</span>
                    ))}
                    <span className="mt-sep" />
                    <span className="mt" style={{fontSize:'9px',fontFamily:'var(--fm)',letterSpacing:'.04em',width:'auto',padding:'0 7px',color:'rgba(139,92,246,.8)'}}>AI FILL</span>
                  </div>
                  {/* Body */}
                  <div className="mock-body">
                    {/* Page thumbnails */}
                    <div className="mock-pages">
                      <div className="mock-pg on"><span className="mock-pg-n">1</span></div>
                      <div className="mock-pg"><span className="mock-pg-n">2</span></div>
                    </div>
                    {/* Document */}
                    <div className="mock-doc">
                      <div className="doc-head">
                        <div className="doc-title">INVOICE</div>
                        <div className="doc-sub">Acme Corp · INV-2025-004</div>
                      </div>
                      <div className="doc-div" />
                      <div className="doc-row">
                        <span className="doc-lbl">Company</span>
                        <div className="doc-field ok">Acme Corporation</div>
                      </div>
                      <div className="doc-row">
                        <span className="doc-lbl">Amount</span>
                        <div className="doc-field ok">$4,820.00</div>
                      </div>
                      <div className="doc-row">
                        <span className="doc-lbl">Due Date</span>
                        <div className="doc-field act">06 / 05 / 2026 ▌</div>
                      </div>
                      <div className="doc-row">
                        <span className="doc-lbl">Signature</span>
                        <div className="doc-sig">
                          <svg viewBox="0 0 110 26" width="110" height="26" fill="none">
                            <path d="M4,18 Q12,6 20,16 Q28,26 38,10 Q48,-4 58,14 Q66,28 76,8 Q84,0 94,16 Q100,24 106,12" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
            <h2 id="tools-h" className="sec-h">16 PDF Tools.<br/>One Platform.</h2>
            <p className="sec-sub">Everything you need to work with PDFs — powered by AI. Free, no account required.</p>

            {/* Featured */}
            <Link href="/editor" className="feat" aria-label="AI PDF Editor — open free now">
              <div className="feat-l">
                <div className="feat-live mk"><span className="feat-live-dot" />LIVE NOW · FREE</div>
                <h3 className="feat-name">AI PDF Editor</h3>
                <p className="feat-desc">{TOOLS[0].desc}</p>
                <ul className="feat-caps" aria-label="Features">
                  {['AI Form Filling','E-Signatures','Text Editing','Annotations','Page Management'].map(c=>(
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
                {['AI Form Filling','Smart Signatures','Text Editing','Annotations','Page Manager','PDF Merge','Smart OCR','Batch Export'].map((c,i)=>(
                  <div key={c} className="feat-r-row" style={{ animationDelay:`${i*0.07}s` } as React.CSSProperties}>
                    <span className="feat-r-ic">✓</span>{c}
                  </div>
                ))}
              </div>
            </Link>

            {/* Tool grid */}
            <div className="tool-grid" role="list" aria-label="Upcoming tools">
              {others.map((t,i)=>(
                <div key={t.id} className="tc" role="listitem"
                  style={{ '--ac': t.accent } as React.CSSProperties}>
                  <span className="tc-num mk">{String(i+2).padStart(2,'0')}</span>
                  <div className="tc-info">
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-cat mk">{t.category}</div>
                  </div>
                  {t.tag === 'LIVE' && <span className="tc-tag tag-live">LIVE</span>}
                  {t.tag === 'BETA' && <span className="tc-tag tag-beta"><span className="tag-beta-dot"/>BETA</span>}
                  {t.tag === 'SOON' && <span className="tc-tag tag-soon">SOON</span>}
                </div>
              ))}
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
              {([['AI Tools','16','One platform for every PDF need.'],['Languages','140+','Full internationalisation support.'],['Uptime SLA','99.9%','Always-on, enterprise-grade reliability.'],['Response','<10ms','Instant AI at any scale.']] as const).map(([l,v,d])=>(
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
                <Link href="/editor" className="btn-p">
                  Open PDF Editor
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <a href="#tools" className="btn-s">Browse all 16 tools</a>
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
              <Link href="/editor">AI PDF Editor</Link>
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
