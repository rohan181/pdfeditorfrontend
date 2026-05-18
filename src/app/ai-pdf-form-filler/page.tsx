'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import PDFEditor from '@/components/PDFEditor'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
:root{
  --bg:#04040f;--fg:#f0f4ff;--fg2:rgba(240,244,255,.7);--fg3:rgba(240,244,255,.38);
  --b:rgba(255,255,255,.07);--bh:rgba(255,255,255,.14);
  --p:#8b5cf6;--p2:#6d28d9;--pl:#a78bfa;--c:#22d3ee;--g:#4ade80;
  --fd:var(--font-jakarta,'Plus Jakarta Sans',sans-serif);
  --fu:var(--font-dm,'DM Sans',sans-serif);
  --fm:var(--font-mono,'JetBrains Mono',monospace);
}
.pg{min-height:100vh;background:var(--bg);color:var(--fg);font-family:var(--fu);overflow-x:hidden}
.wrap{max-width:1160px;margin:0 auto;padding:0 32px}

/* Ambient */
.amb{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ag1{position:absolute;width:900px;height:900px;top:-300px;left:-200px;background:radial-gradient(circle,rgba(139,92,246,.22) 0%,transparent 65%);filter:blur(80px);animation:orb1 28s ease-in-out infinite alternate}
.ag2{position:absolute;width:700px;height:700px;top:30%;right:-150px;background:radial-gradient(circle,rgba(34,211,238,.14) 0%,transparent 65%);filter:blur(80px);animation:orb2 36s ease-in-out infinite alternate}
.ag3{position:absolute;width:500px;height:500px;bottom:10%;left:25%;background:radial-gradient(circle,rgba(139,92,246,.12) 0%,transparent 65%);filter:blur(80px);animation:orb1 44s ease-in-out infinite alternate-reverse}
.agr{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.016) 1px,transparent 1px);background-size:32px 32px}
@keyframes orb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(50px,40px) scale(1.1)}}
@keyframes orb2{0%{transform:translate(0,0) scale(1.05)}100%{transform:translate(-40px,50px) scale(1)}}

/* Nav */
.nav{position:sticky;top:0;z-index:200;height:62px;background:rgba(4,4,15,.86);backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--b);display:flex;align-items:center}
.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%}
.wm{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.wm-mark{width:30px;height:30px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(139,92,246,.45);flex-shrink:0}
.wm-inner{width:15px;height:18px;background:rgba(255,255,255,.95);clip-path:polygon(0% 0%,68% 0%,100% 26%,100% 100%,0% 100%)}
.wm-name{font-family:var(--fd);font-size:17px;font-weight:800;color:var(--fg);letter-spacing:-.03em}
.wm-name em{font-style:normal;color:var(--pl)}
.wm-badge{font-family:var(--fm);font-size:8px;font-weight:700;letter-spacing:.12em;color:var(--pl);background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.25);padding:2px 7px;border-radius:4px;margin-left:2px}
.nav-r{display:flex;align-items:center;gap:10px}
.back-link{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--fg3);text-decoration:none;padding:6px 12px;border-radius:7px;border:1px solid var(--b);transition:all .15s;font-weight:500}
.back-link:hover{color:var(--fg2);background:rgba(255,255,255,.04);border-color:var(--bh)}
.open-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);border-radius:8px;font-family:var(--fd);font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:opacity .15s,transform .15s,box-shadow .15s;box-shadow:0 4px 18px rgba(124,58,237,.4)}
.open-btn:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 28px rgba(124,58,237,.5)}

/* Hero */
.hero{position:relative;z-index:1;padding:80px 0 60px;overflow:visible}
.hero-in{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.3);border-radius:20px;font-family:var(--fm);font-size:9px;letter-spacing:.16em;color:var(--pl);margin-bottom:28px}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--pl);box-shadow:0 0 6px var(--pl);animation:bdot 2s ease-in-out infinite}
@keyframes bdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
.hero-h1{font-family:var(--fd);font-weight:800;letter-spacing:-.055em;line-height:.92;margin-bottom:26px}
.h1-eye{display:block;font-size:clamp(13px,1.5vw,17px);color:var(--fg3);font-weight:500;letter-spacing:0;margin-bottom:14px;font-family:var(--fu)}
.h1-a{display:block;font-size:clamp(44px,6vw,74px);color:var(--fg)}
.h1-b{display:block;font-size:clamp(44px,6vw,74px);background:linear-gradient(110deg,#a78bfa 0%,#818cf8 45%,#22d3ee 100%);background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gflow 4s linear infinite}
@keyframes gflow{0%{background-position:0% center}100%{background-position:220% center}}
.h1-c{display:block;font-size:clamp(28px,4vw,54px);color:rgba(240,244,255,.22);font-weight:700;margin-top:8px}
.hero-sub{font-size:clamp(14px,1.5vw,16.5px);color:var(--fg2);line-height:1.8;margin-bottom:36px;max-width:480px}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px}
.btn-p{display:inline-flex;align-items:center;gap:9px;padding:14px 30px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);border-radius:12px;font-family:var(--fd);font-size:14.5px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:transform .18s,box-shadow .18s;box-shadow:0 8px 30px rgba(139,92,246,.44)}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 18px 50px rgba(139,92,246,.58)}
.btn-s2{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;background:rgba(255,255,255,.04);border:1px solid var(--bh);border-radius:12px;font-size:14px;font-weight:500;color:var(--fg2);text-decoration:none;transition:all .18s}
.btn-s2:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.22);color:var(--fg)}
.h-pills{display:flex;gap:8px;flex-wrap:wrap}
.hpill{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;background:rgba(255,255,255,.035);border:1px solid var(--b);border-radius:20px;font-size:11.5px;color:var(--fg3)}
.hpill strong{color:var(--fg2);font-weight:600}

/* ── 3D Card Stack ── */
.hero-r{display:flex;align-items:center;justify-content:center;perspective:1000px}
.stack-host{position:relative;width:340px;height:440px}
.stack-wrap{width:340px;height:440px;transform-style:preserve-3d;transition:transform .09s ease-out;cursor:default}
.sc{position:absolute;inset:0;border-radius:22px;transition:transform .09s ease-out}
.sc-back{background:rgba(9,7,22,.7);border:1px solid rgba(139,92,246,.07);transform:translateZ(-44px);box-shadow:0 4px 18px rgba(0,0,0,.5)}
.sc-mid{background:rgba(13,10,30,.86);border:1px solid rgba(139,92,246,.14);transform:translateZ(-22px);box-shadow:0 10px 40px rgba(0,0,0,.6)}
.sc-main{background:linear-gradient(150deg,rgba(20,14,44,.98) 0%,rgba(10,8,28,.99) 100%);border:1px solid rgba(139,92,246,.28);transform:translateZ(0);padding:24px 22px;overflow:hidden;box-shadow:0 32px 90px -12px rgba(0,0,0,.95),0 0 0 1px rgba(139,92,246,.1),inset 0 1px 0 rgba(255,255,255,.06),0 0 70px rgba(139,92,246,.07)}
.sc-main::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,rgba(139,92,246,.06) 0%,transparent 52%);pointer-events:none;border-radius:22px}
/* Card inner */
.c-chrome{display:flex;align-items:center;gap:6px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.055)}
.ccd{width:9px;height:9px;border-radius:50%}
.ccr{background:#ff5f56}.ccy{background:#ffbd2e}.ccg{background:#27c93f}
.c-fname{font-family:var(--fm);font-size:9px;color:var(--fg3);margin-left:7px}
.c-status{font-family:var(--fm);font-size:8px;letter-spacing:.1em;color:rgba(167,139,250,.6);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.c-sdot{width:5px;height:5px;border-radius:50%;background:#a78bfa;box-shadow:0 0 6px #a78bfa;animation:bdot 1.6s ease-in-out infinite}
.c-rows{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.c-row{display:flex;align-items:center;gap:10px}
.c-lbl{font-family:var(--fm);font-size:7.5px;color:var(--fg3);min-width:54px;flex-shrink:0}
.c-field{flex:1;height:28px;border-radius:8px;border:1.5px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02);display:flex;align-items:center;padding:0 10px;font-family:var(--fm);font-size:8.5px;color:rgba(255,255,255,.65)}
.c-field.ok{border-color:rgba(139,92,246,.35);background:rgba(139,92,246,.05);color:rgba(200,185,255,.85)}
.c-field.act{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.14);background:rgba(139,92,246,.07);animation:fpulse 2s ease-in-out infinite}
@keyframes fpulse{0%,100%{box-shadow:0 0 0 3px rgba(139,92,246,.14)}50%{box-shadow:0 0 0 3px rgba(139,92,246,.28),0 0 18px rgba(139,92,246,.12)}}
.c-sig{flex:1;height:36px;border-radius:8px;border:1.5px dashed rgba(255,255,255,.1);background:rgba(255,255,255,.01);display:flex;align-items:center;justify-content:center}
.c-sig-path{stroke-dasharray:220;stroke-dashoffset:220;animation:sigdraw 2.4s ease-out forwards 1.4s}
@keyframes sigdraw{from{stroke-dashoffset:220}to{stroke-dashoffset:0}}
.c-ai-tag{position:absolute;top:22px;right:20px;display:flex;align-items:center;gap:5px;padding:4px 10px;background:rgba(139,92,246,.18);border:1px solid rgba(139,92,246,.34);border-radius:6px;font-family:var(--fm);font-size:7.5px;letter-spacing:.08em;color:#c4b5fd;animation:tagpulse 3s ease-in-out infinite}
@keyframes tagpulse{0%,100%{box-shadow:none}50%{box-shadow:0 0 14px rgba(139,92,246,.38)}}
.c-prog{position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,.04);border-radius:0 0 22px 22px;overflow:hidden}
.c-prog-fill{height:100%;background:linear-gradient(90deg,#8b5cf6,#22d3ee);animation:progfill 2.2s cubic-bezier(.4,0,.2,1) forwards .6s;width:0}
@keyframes progfill{from{width:0}to{width:88%}}
/* Floating orbit badges */
.ob{position:absolute;display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;font-size:10px;font-weight:600;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);white-space:nowrap;z-index:10;pointer-events:none}
.ob1{top:-22px;right:-32px;background:rgba(139,92,246,.18);border:1px solid rgba(139,92,246,.36);color:#c4b5fd;animation:obfloat 6s ease-in-out infinite}
.ob2{bottom:66px;left:-44px;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.28);color:#34d399;animation:obfloat 6s ease-in-out infinite;animation-delay:2s}
.ob3{bottom:-18px;right:12px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.26);color:#67e8f9;animation:obfloat 6s ease-in-out infinite;animation-delay:4s}
@keyframes obfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
.ob-ic{font-size:12px}

/* Ticker */
.ticker{position:relative;z-index:1;overflow:hidden;border-top:1px solid var(--b);border-bottom:1px solid var(--b);padding:11px 0;background:rgba(255,255,255,.008)}
.tktr{display:inline-flex;width:max-content;animation:roll 52s linear infinite}
.ti{display:inline-flex;align-items:center;gap:10px;padding:0 24px}
.tis{font-size:8px;color:var(--pl);opacity:.5}
.tin{font-family:var(--fm);font-size:9px;letter-spacing:.1em;color:var(--fg3)}
@keyframes roll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* Section shared */
.sec-eye{font-family:var(--fm);font-size:9px;letter-spacing:.18em;color:rgba(167,139,250,.65);display:block;margin-bottom:12px;text-transform:uppercase}
.sec-h{font-family:var(--fd);font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.045em;color:var(--fg);line-height:1.06;margin-bottom:14px}
.sec-sub{font-size:15px;color:var(--fg3);line-height:1.72;max-width:520px}

/* How it works */
.how-sec{position:relative;z-index:1;padding:100px 0 80px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:56px;position:relative}
.steps::before{content:'';position:absolute;top:28px;left:calc(16.67% + 18px);right:calc(16.67% + 18px);height:1px;background:linear-gradient(90deg,rgba(139,92,246,.5),rgba(34,211,238,.5));z-index:0}
.step{position:relative;z-index:1;padding:36px 28px;background:rgba(255,255,255,.018);border:1px solid var(--b);border-radius:20px;text-align:center;transition:border-color .22s,transform .2s,box-shadow .22s}
.step:hover{border-color:rgba(139,92,246,.3);transform:translateY(-4px);box-shadow:0 24px 64px -16px rgba(139,92,246,.18)}
.step-num{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:22px;font-weight:800;color:#fff;margin:0 auto 22px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);box-shadow:0 6px 24px rgba(139,92,246,.45)}
.step-title{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--fg);margin-bottom:10px;letter-spacing:-.025em}
.step-desc{font-size:13px;color:var(--fg3);line-height:1.7}

/* 3D Feature Grid */
.feat-sec{position:relative;z-index:1;padding:80px 0 100px}
.fg3d-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:56px;perspective:1100px}
.fg3d{padding:30px 26px;background:rgba(255,255,255,.02);border:1px solid var(--b);border-radius:20px;position:relative;overflow:hidden;transition:border-color .2s,box-shadow .2s;cursor:default;transform-style:preserve-3d}
.fg3d::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:var(--fbar);opacity:.85;border-radius:20px 20px 0 0}
.fg3d::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 10% 10%,var(--fglow) 0%,transparent 55%);opacity:0;transition:opacity .28s;pointer-events:none}
.fg3d:hover::after{opacity:1}
.fg3d:hover{border-color:var(--fhb);box-shadow:0 24px 60px -12px var(--fshad)}
.fg3d-ic{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px;background:var(--fic);box-shadow:0 8px 24px rgba(0,0,0,.28);transition:transform .2s;position:relative;z-index:1}
.fg3d:hover .fg3d-ic{transform:perspective(400px) translateZ(16px) scale(1.1)}
.fg3d-title{font-family:var(--fd);font-size:16px;font-weight:700;color:var(--fg);letter-spacing:-.025em;margin-bottom:9px;position:relative;z-index:1}
.fg3d-desc{font-size:13px;color:var(--fg3);line-height:1.68;position:relative;z-index:1}

/* FAQ */
.faq-sec{position:relative;z-index:1;padding:0 0 100px}
.faq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:52px}
.fq{padding:28px 30px;background:rgba(255,255,255,.02);border:1px solid var(--b);border-radius:18px;transition:border-color .18s,transform .18s}
.fq:hover{border-color:rgba(139,92,246,.24);transform:translateY(-2px)}
.fq-q{font-family:var(--fd);font-size:15px;font-weight:700;color:var(--fg);letter-spacing:-.022em;margin-bottom:10px;display:flex;align-items:flex-start;gap:10px}
.fq-ic{color:var(--pl);flex-shrink:0;margin-top:3px}
.fq-a{font-size:13.5px;color:var(--fg3);line-height:1.72;padding-left:24px}

/* CTA Banner */
.cta-ban{position:relative;z-index:1;padding:0 0 100px}
.cta-inner{background:linear-gradient(145deg,rgba(139,92,246,.07) 0%,rgba(34,211,238,.03) 100%);border:1px solid rgba(139,92,246,.2);border-radius:28px;padding:80px 48px;text-align:center;position:relative;overflow:hidden}
.cta-inner::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,rgba(139,92,246,.1) 0%,transparent 58%);pointer-events:none}
.cta-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:600px;height:350px;background:radial-gradient(ellipse,rgba(139,92,246,.2) 0%,transparent 70%);filter:blur(50px);pointer-events:none}
.cta-h{font-family:var(--fd);font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.045em;color:var(--fg);margin-bottom:14px;position:relative;line-height:1.06}
.cta-sub{font-size:16px;color:var(--fg2);margin-bottom:40px;position:relative}

/* Footer */
.foot{position:relative;z-index:1;border-top:1px solid var(--b);padding:36px 0}
.foot-in{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.foot-nav{display:flex;gap:20px;flex-wrap:wrap}
.foot-nav a{font-size:12.5px;color:var(--fg3);text-decoration:none;font-weight:500;transition:color .15s}
.foot-nav a:hover{color:var(--fg2)}
.foot-copy{font-family:var(--fm);font-size:9px;letter-spacing:.08em;color:var(--fg3)}

/* Responsive */
@media(max-width:960px){
  .hero-in{grid-template-columns:1fr;gap:48px;text-align:center}
  .hero-l{display:flex;flex-direction:column;align-items:center}
  .hero-r{justify-content:center}
  .fg3d-grid{grid-template-columns:repeat(2,1fr)}
  .steps{grid-template-columns:1fr;gap:12px}
  .steps::before{display:none}
  .faq-grid{grid-template-columns:1fr}
  .cta-inner{padding:52px 24px}
}
@media(max-width:600px){
  .wrap{padding:0 20px}
  .fg3d-grid{grid-template-columns:1fr}
  .hero{padding:56px 0 40px}
  .cta-row{flex-direction:column;align-items:stretch}
  .btn-p,.btn-s2{justify-content:center}
  .stack-host,.stack-wrap{width:280px;height:370px}
  .foot-in{flex-direction:column;align-items:center;text-align:center}
  .foot-nav{justify-content:center}
}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:rgba(139,92,246,.3);border-radius:2px}
:focus-visible{outline:2px solid var(--pl);outline-offset:3px}
`

const FEATURES = [
  { icon: '🧠', title: 'AI Field Detection', desc: 'Paste your context once. AI identifies every form field — name, date, address, checkboxes — and fills them all in seconds.', ic: 'rgba(139,92,246,.14)', bar: 'linear-gradient(90deg,#8b5cf6,#6d28d9)', hb: 'rgba(139,92,246,.28)', glow: 'rgba(139,92,246,.1)', shad: 'rgba(139,92,246,.22)' },
  { icon: '✍️', title: 'Digital Signatures', desc: 'Draw, type or upload your signature. Place it anywhere with pixel-perfect precision — no extensions required.', ic: 'rgba(245,158,11,.12)', bar: 'linear-gradient(90deg,#f59e0b,#d97706)', hb: 'rgba(245,158,11,.28)', glow: 'rgba(245,158,11,.08)', shad: 'rgba(245,158,11,.18)' },
  { icon: '📝', title: 'Full Text Editing', desc: 'Click anywhere to add or edit text, change fonts, sizes and colors — on native or scanned PDFs alike.', ic: 'rgba(34,211,238,.12)', bar: 'linear-gradient(90deg,#22d3ee,#0891b2)', hb: 'rgba(34,211,238,.28)', glow: 'rgba(34,211,238,.08)', shad: 'rgba(34,211,238,.18)' },
  { icon: '🔍', title: 'OCR for Scanned PDFs', desc: 'Built-in OCR reads image-based and scanned PDFs, making hidden fields editable instantly.', ic: 'rgba(74,222,128,.12)', bar: 'linear-gradient(90deg,#4ade80,#16a34a)', hb: 'rgba(74,222,128,.28)', glow: 'rgba(74,222,128,.08)', shad: 'rgba(74,222,128,.18)' },
  { icon: '📄', title: 'Page Management', desc: 'Reorder, rotate, delete or add blank pages. Merge PDFs or split pages — all in one editor.', ic: 'rgba(244,114,182,.12)', bar: 'linear-gradient(90deg,#f472b6,#be185d)', hb: 'rgba(244,114,182,.28)', glow: 'rgba(244,114,182,.08)', shad: 'rgba(244,114,182,.18)' },
  { icon: '⚡', title: 'Instant Download', desc: 'Export your completed PDF in one click. Every annotation, signature and filled field preserved exactly.', ic: 'rgba(251,191,36,.12)', bar: 'linear-gradient(90deg,#fbbf24,#b45309)', hb: 'rgba(251,191,36,.28)', glow: 'rgba(251,191,36,.08)', shad: 'rgba(251,191,36,.18)' },
]

const FAQS = [
  { q: 'What is an AI PDF form filler?', a: 'An AI PDF form filler detects input fields in a PDF and fills them automatically based on context you provide. You describe your details once and AI populates the entire form instantly — no clicking each field manually.' },
  { q: 'Is it completely free to use?', a: 'Yes — 100% free with no hidden fees, no subscription and no credit card required. Open your PDF and start editing immediately, as many times as you need.' },
  { q: 'Do I need to create an account?', a: 'No account needed. Your browser handles everything locally — documents never leave your device unless you trigger an AI feature, which only sends the relevant text context.' },
  { q: 'What types of PDFs are supported?', a: 'Both interactive PDF forms (AcroForms) and flat or scanned PDFs are supported. For scanned documents, the built-in OCR engine detects field positions automatically.' },
  { q: 'Is my document data secure?', a: 'Your files are processed entirely in your browser and are never stored on our servers. AI features send only the relevant text context — never the raw file — and no data is retained.' },
  { q: 'Can I add a digital signature?', a: 'Yes. Draw a freehand signature, type your name, or upload a signature image. Place it anywhere with drag-and-drop precision.' },
]

const TICKS = ['AI Form Filling','Digital Signatures','OCR Engine','Text Editing','Page Manager','Instant Export','Zero Signup','100% Free','Privacy First','AcroForms','Scanned PDFs','Any Browser']

export default function AIPDFFormFillerPage() {
  const [editorOpen, setEditorOpen] = useState(false)
  const stackRef = useRef<HTMLDivElement>(null)

  const openEditor = () => { setEditorOpen(true); document.body.style.overflow = 'hidden' }
  const closeEditor = () => { setEditorOpen(false); document.body.style.overflow = '' }

  const onStackMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = stackRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -12
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 12
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
  }, [])

  const onStackLeave = useCallback(() => {
    const el = stackRef.current; if (!el) return
    el.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }, [])

  const onCardMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect()
    el.style.transform = `perspective(700px) rotateX(${((e.clientY - r.top) / r.height - .5) * -14}deg) rotateY(${((e.clientX - r.left) / r.width - .5) * 14}deg) translateZ(8px)`
  }, [])

  const onCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
  }, [])

  return (
    <div className="pg">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Fullscreen editor overlay */}
      {editorOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: '#f8faff' }}>
          <PDFEditor />
          <button onClick={closeEditor} aria-label="Close editor" style={{ position: 'absolute', top: 10, right: 14, zIndex: 10000, background: 'rgba(30,41,59,.88)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
            ✕ Close
          </button>
        </div>
      )}

      {/* Ambient */}
      <div className="amb" aria-hidden="true">
        <div className="ag1" /><div className="ag2" /><div className="ag3" /><div className="agr" />
      </div>

      {/* Nav */}
      <nav className="nav">
        <div className="wrap nav-in">
          <Link href="/" className="wm" aria-label="EditPDF AI — Home">
            <div className="wm-mark"><div className="wm-inner" /></div>
            <span className="wm-name">Edit<em>PDF</em></span>
            <span className="wm-badge">.AI</span>
          </Link>
          <div className="nav-r">
            <Link href="/" className="back-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              All Tools
            </Link>
            <button className="open-btn" onClick={openEditor}>
              Open Editor
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="wrap hero-in">

          {/* Left — copy */}
          <div className="hero-l">
            <div className="hero-badge">
              <span className="bdot" /><span>AI-POWERED FORM FILLING</span>
            </div>
            <h1 className="hero-h1">
              <span className="h1-eye">Intelligent PDF forms,</span>
              <span className="h1-a">Filled in</span>
              <span className="h1-b">Seconds.</span>
              <span className="h1-c">Not hours.</span>
            </h1>
            <p className="hero-sub">
              Drop any PDF, paste your details once — AI detects every field and fills the entire form instantly. Sign, annotate and export in seconds.
            </p>
            <div className="cta-row">
              <button className="btn-p" onClick={openEditor}>
                Fill a PDF — Free
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <a className="btn-s2" href="#features">See features</a>
            </div>
            <div className="h-pills">
              {([['Free','Forever'],['No','Signup'],['OCR','Built-in'],['Private','& Secure']] as const).map(([v, l]) => (
                <div key={l} className="hpill"><strong>{v}</strong><span>{l}</span></div>
              ))}
            </div>
          </div>

          {/* Right — 3D card stack */}
          <div className="hero-r">
            <div className="stack-host">
              {/* Floating orbit badges */}
              <div className="ob ob1"><span className="ob-ic">✦</span>AI detected 4 fields</div>
              <div className="ob ob2"><span className="ob-ic">✓</span>Form filled</div>
              <div className="ob ob3"><span className="ob-ic">⚡</span>Ready to export</div>

              {/* 3D stack — tilt follows mouse */}
              <div
                className="stack-wrap"
                ref={stackRef}
                onMouseMove={onStackMove}
                onMouseLeave={onStackLeave}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="sc sc-back" />
                <div className="sc sc-mid" />
                <div className="sc sc-main">
                  {/* Chrome */}
                  <div className="c-chrome">
                    <span className="ccd ccr"/><span className="ccd ccy"/><span className="ccd ccg"/>
                    <span className="c-fname">invoice_2025.pdf</span>
                  </div>
                  {/* Status */}
                  <div className="c-status">
                    <span className="c-sdot" />AI filling in progress
                  </div>
                  {/* Fields */}
                  <div className="c-rows">
                    <div className="c-row">
                      <span className="c-lbl">Company</span>
                      <div className="c-field ok">Acme Corporation</div>
                    </div>
                    <div className="c-row">
                      <span className="c-lbl">Amount</span>
                      <div className="c-field ok">$4,820.00</div>
                    </div>
                    <div className="c-row">
                      <span className="c-lbl">Due Date</span>
                      <div className="c-field act">06 / 05 / 2026</div>
                    </div>
                    <div className="c-row">
                      <span className="c-lbl">Signature</span>
                      <div className="c-sig">
                        <svg viewBox="0 0 110 28" width="106" height="28" fill="none">
                          <path
                            className="c-sig-path"
                            d="M4,20 Q12,6 20,18 Q28,28 38,10 Q48,-4 58,16 Q66,30 76,8 Q84,0 94,18 Q100,26 106,12"
                            stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            strokeDasharray="220" strokeDashoffset="220"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* AI tag */}
                  <div className="c-ai-tag"><span>✦</span> AI FILL</div>
                  {/* Progress bar */}
                  <div className="c-prog"><div className="c-prog-fill" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="tktr">
          {[...TICKS, ...TICKS].map((t, i) => (
            <span key={i} className="ti">
              <span className="tis">✦</span>
              <span className="tin">{t.toUpperCase()}</span>
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="how-sec" id="how">
        <div className="wrap">
          <span className="sec-eye">Simple process</span>
          <h2 className="sec-h">Three steps to a<br />completed form</h2>
          <p className="sec-sub">No learning curve. Upload, describe, done.</p>
          <div className="steps">
            {[
              { n: '1', t: 'Upload your PDF', d: 'Drag and drop any PDF — AcroForm, flat or scanned. Loads instantly in your browser, no server processing.' },
              { n: '2', t: 'Describe your details', d: 'Type your info in plain language. AI reads the form, matches every field and fills them all at once.' },
              { n: '3', t: 'Sign & Download', d: 'Add your signature, make final edits, then export a pixel-perfect PDF — ready to send.' },
            ].map(s => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.t}</div>
                <p className="step-desc">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — 3D cards */}
      <section className="feat-sec" id="features">
        <div className="wrap">
          <span className="sec-eye">Capabilities</span>
          <h2 className="sec-h">Everything you need<br />inside one editor</h2>
          <p className="sec-sub">AI-powered filling is just the start — a full PDF toolkit right alongside it.</p>
          <div className="fg3d-grid">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="fg3d"
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                style={{ '--fbar': f.bar, '--fic': f.ic, '--fhb': f.hb, '--fglow': f.glow, '--fshad': f.shad } as React.CSSProperties}
              >
                <div className="fg3d-ic">{f.icon}</div>
                <div className="fg3d-title">{f.title}</div>
                <p className="fg3d-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-sec" id="faq">
        <div className="wrap">
          <span className="sec-eye">FAQ</span>
          <h2 className="sec-h">Common questions</h2>
          <div className="faq-grid">
            {FAQS.map(f => (
              <div key={f.q} className="fq">
                <div className="fq-q"><span className="fq-ic">✦</span>{f.q}</div>
                <p className="fq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-ban">
        <div className="wrap">
          <div className="cta-inner">
            <div className="cta-glow" />
            <h2 className="cta-h">Start filling PDFs<br />right now — free</h2>
            <p className="cta-sub">No signup. No install. Works in any browser.</p>
            <button className="btn-p" onClick={openEditor} style={{ margin: '0 auto' }}>
              Open AI Form Filler — Free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="foot">
        <div className="wrap foot-in">
          <Link href="/" className="wm" aria-label="EditPDF AI — Home">
            <div className="wm-mark"><div className="wm-inner" /></div>
            <span className="wm-name" style={{ fontSize: 15 }}>Edit<em>PDF</em></span>
            <span className="wm-badge">.AI</span>
          </Link>
          <nav className="foot-nav">
            <Link href="/">Home</Link>
            <Link href="/ai-pdf-form-filler">AI Form Filler</Link>
            <Link href="/pdf-editor">PDF Editor</Link>
          </nav>
          <p className="foot-copy">© {new Date().getFullYear()} EDITPDF.AI — All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}
