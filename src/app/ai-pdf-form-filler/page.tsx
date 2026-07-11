'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import PDFEditor from '@/components/PDFEditor'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
:root{
  --bg:#ffffff;--fg:#1d1d1f;--fg2:rgba(29,29,31,.65);--fg3:rgba(29,29,31,.42);
  --b:rgba(0,0,0,.08);--bh:rgba(0,0,0,.14);
  --p:#7c3aed;--p2:#6d28d9;--pl:#8b5cf6;--c:#0891b2;--g:#16a34a;
  --fd:var(--font-jakarta,'Plus Jakarta Sans',sans-serif);
  --fu:var(--font-dm,'DM Sans',sans-serif);
  --fm:var(--font-mono,'JetBrains Mono',monospace);
}
.pg{min-height:100vh;background:#f5f5f7;color:var(--fg);font-family:var(--fu);overflow-x:hidden}
.wrap{max-width:1160px;margin:0 auto;padding:0 32px}

/* Ambient */
.amb{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ag1{position:absolute;width:900px;height:900px;top:-300px;left:-200px;background:radial-gradient(circle,rgba(124,58,237,.06) 0%,transparent 65%);filter:blur(80px);animation:orb1 28s ease-in-out infinite alternate}
.ag2{position:absolute;width:700px;height:700px;top:30%;right:-150px;background:radial-gradient(circle,rgba(8,145,178,.05) 0%,transparent 65%);filter:blur(80px);animation:orb2 36s ease-in-out infinite alternate}
.ag3{position:absolute;width:500px;height:500px;bottom:10%;left:25%;background:radial-gradient(circle,rgba(124,58,237,.04) 0%,transparent 65%);filter:blur(80px);animation:orb1 44s ease-in-out infinite alternate-reverse}
.agr{position:absolute;inset:0;background-image:radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px);background-size:32px 32px}
@keyframes orb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(50px,40px) scale(1.1)}}
@keyframes orb2{0%{transform:translate(0,0) scale(1.05)}100%{transform:translate(-40px,50px) scale(1)}}

/* Nav */
.nav{position:sticky;top:0;z-index:200;height:62px;background:rgba(255,255,255,.88);backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center}
.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%}
.wm{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.wm-mark{width:30px;height:30px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(139,92,246,.3);flex-shrink:0}
.wm-inner{width:15px;height:18px;background:rgba(255,255,255,.95);clip-path:polygon(0% 0%,68% 0%,100% 26%,100% 100%,0% 100%)}
.wm-name{font-family:var(--fd);font-size:17px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em}
.wm-name em{font-style:normal;color:var(--p)}
.wm-badge{font-family:var(--fm);font-size:8px;font-weight:700;letter-spacing:.12em;color:var(--p);background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.22);padding:2px 7px;border-radius:4px;margin-left:2px}
.nav-r{display:flex;align-items:center;gap:10px}
.back-link{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--fg3);text-decoration:none;padding:6px 12px;border-radius:7px;border:1px solid rgba(0,0,0,.1);transition:all .15s;font-weight:500}
.back-link:hover{color:var(--fg2);background:rgba(0,0,0,.04);border-color:rgba(0,0,0,.16)}
.open-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);border-radius:8px;font-family:var(--fd);font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:opacity .15s,transform .15s,box-shadow .15s;box-shadow:0 4px 18px rgba(124,58,237,.3)}
.open-btn:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 28px rgba(124,58,237,.4)}

/* Hero */
.hero{position:relative;z-index:1;padding:80px 0 60px;overflow:visible;background:#fff}
.hero-in{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(124,58,237,.07);border:1px solid rgba(124,58,237,.2);border-radius:20px;font-family:var(--fm);font-size:9px;letter-spacing:.16em;color:var(--p);margin-bottom:28px}
.bdot{width:5px;height:5px;border-radius:50%;background:var(--p);box-shadow:0 0 6px var(--p);animation:bdot 2s ease-in-out infinite}
@keyframes bdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
.hero-h1{font-family:var(--fd);font-weight:800;letter-spacing:-.055em;line-height:.92;margin-bottom:26px}
.h1-a{display:block;font-size:clamp(44px,6vw,74px);color:#1d1d1f}
.h1-b{display:block;font-size:clamp(44px,6vw,74px);background:linear-gradient(110deg,#7c3aed 0%,#6366f1 45%,#0891b2 100%);background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gflow 4s linear infinite}
@keyframes gflow{0%{background-position:0% center}100%{background-position:220% center}}
.h1-c{display:block;font-size:clamp(28px,4vw,54px);color:rgba(29,29,31,.18);font-weight:700;margin-top:8px}
.hero-sub{font-size:clamp(14px,1.5vw,16.5px);color:var(--fg2);line-height:1.8;margin-bottom:36px;max-width:480px}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px}
.btn-p{display:inline-flex;align-items:center;gap:9px;padding:14px 30px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);border-radius:12px;font-family:var(--fd);font-size:14.5px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:transform .18s,box-shadow .18s;box-shadow:0 8px 30px rgba(124,58,237,.3)}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 18px 50px rgba(124,58,237,.4)}
.btn-s2{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;background:#fff;border:1.5px solid #e5e7eb;border-radius:12px;font-size:14px;font-weight:500;color:var(--fg2);text-decoration:none;transition:all .18s}
.btn-s2:hover{background:#f9fafb;border-color:#d1d5db;color:var(--fg)}
.h-pills{display:flex;gap:8px;flex-wrap:wrap}
.hpill{display:inline-flex;align-items:center;gap:4px;padding:6px 13px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:20px;font-size:11.5px;color:var(--fg3)}
.hpill strong{color:var(--fg2);font-weight:600}
.priv-box{display:flex;align-items:flex-start;gap:8px;margin-top:16px;padding:10px 14px;background:rgba(22,163,74,.06);border:1px solid rgba(22,163,74,.18);border-radius:10px;font-size:12px;line-height:1.55;color:#374151;max-width:420px}
.priv-box strong{color:#15803d;font-weight:600}

/* ── 3D Card Stack ── */
.hero-r{display:flex;align-items:center;justify-content:center;perspective:1000px}
.stack-host{position:relative;width:340px;height:440px}
.stack-wrap{width:340px;height:440px;transform-style:preserve-3d;transition:transform .09s ease-out;cursor:default}
.sc{position:absolute;inset:0;border-radius:22px;transition:transform .09s ease-out}
.sc-back{background:#f0f0f2;border:1px solid #e5e7eb;transform:translateZ(-44px);box-shadow:0 4px 18px rgba(0,0,0,.08)}
.sc-mid{background:#f8f8fa;border:1px solid #e5e7eb;transform:translateZ(-22px);box-shadow:0 10px 40px rgba(0,0,0,.08)}
.sc-main{background:#ffffff;border:1.5px solid rgba(124,58,237,.2);transform:translateZ(0);padding:24px 22px;overflow:hidden;box-shadow:0 24px 64px -12px rgba(0,0,0,.12),0 0 0 1px rgba(124,58,237,.08)}
.sc-main::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,rgba(124,58,237,.04) 0%,transparent 52%);pointer-events:none;border-radius:22px}
/* Card inner */
.c-chrome{display:flex;align-items:center;gap:6px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(0,0,0,.07)}
.ccd{width:9px;height:9px;border-radius:50%}
.ccr{background:#ff5f56}.ccy{background:#ffbd2e}.ccg{background:#27c93f}
.c-fname{font-family:var(--fm);font-size:9px;color:var(--fg3);margin-left:7px}
.c-status{font-family:var(--fm);font-size:8px;letter-spacing:.1em;color:var(--p);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.c-sdot{width:5px;height:5px;border-radius:50%;background:var(--p);box-shadow:0 0 6px var(--p);animation:bdot 1.6s ease-in-out infinite}
.c-rows{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.c-row{display:flex;align-items:center;gap:10px}
.c-lbl{font-family:var(--fm);font-size:7.5px;color:var(--fg3);min-width:54px;flex-shrink:0}
.c-field{flex:1;height:28px;border-radius:8px;border:1.5px solid #e5e7eb;background:#f9fafb;display:flex;align-items:center;padding:0 10px;font-family:var(--fm);font-size:8.5px;color:var(--fg2)}
.c-field.ok{border-color:rgba(124,58,237,.3);background:rgba(124,58,237,.04);color:var(--p)}
.c-field.act{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(124,58,237,.1);background:rgba(124,58,237,.04);animation:fpulse 2s ease-in-out infinite}
@keyframes fpulse{0%,100%{box-shadow:0 0 0 3px rgba(124,58,237,.1)}50%{box-shadow:0 0 0 3px rgba(124,58,237,.2),0 0 18px rgba(124,58,237,.08)}}
.c-sig{flex:1;height:36px;border-radius:8px;border:1.5px dashed #d1d5db;background:#f9fafb;display:flex;align-items:center;justify-content:center}
.c-sig-path{stroke-dasharray:220;stroke-dashoffset:220;animation:sigdraw 2.4s ease-out forwards 1.4s}
@keyframes sigdraw{from{stroke-dashoffset:220}to{stroke-dashoffset:0}}
.c-ai-tag{position:absolute;top:22px;right:20px;display:flex;align-items:center;gap:5px;padding:4px 10px;background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.22);border-radius:6px;font-family:var(--fm);font-size:7.5px;letter-spacing:.08em;color:var(--p);animation:tagpulse 3s ease-in-out infinite}
@keyframes tagpulse{0%,100%{box-shadow:none}50%{box-shadow:0 0 14px rgba(124,58,237,.2)}}
.c-prog{position:absolute;bottom:0;left:0;right:0;height:3px;background:#f0f0f0;border-radius:0 0 22px 22px;overflow:hidden}
.c-prog-fill{height:100%;background:linear-gradient(90deg,#8b5cf6,#0891b2);animation:progfill 2.2s cubic-bezier(.4,0,.2,1) forwards .6s;width:0}
@keyframes progfill{from{width:0}to{width:88%}}
/* Floating orbit badges */
.ob{position:absolute;display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;font-size:10px;font-weight:600;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);white-space:nowrap;z-index:10;pointer-events:none}
.ob1{top:-22px;right:-32px;background:#fff;border:1.5px solid rgba(124,58,237,.2);color:var(--p);box-shadow:0 4px 16px rgba(124,58,237,.12);animation:obfloat 6s ease-in-out infinite}
.ob2{bottom:66px;left:-44px;background:#fff;border:1.5px solid rgba(22,163,74,.2);color:#16a34a;box-shadow:0 4px 16px rgba(22,163,74,.1);animation:obfloat 6s ease-in-out infinite;animation-delay:2s}
.ob3{bottom:-18px;right:12px;background:#fff;border:1.5px solid rgba(8,145,178,.2);color:#0891b2;box-shadow:0 4px 16px rgba(8,145,178,.1);animation:obfloat 6s ease-in-out infinite;animation-delay:4s}
@keyframes obfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
.ob-ic{font-size:12px}

/* Ticker */
.ticker{position:relative;z-index:1;overflow:hidden;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;padding:11px 0;background:#fafafa}
.tktr{display:inline-flex;width:max-content;animation:roll 90s linear infinite}
.ti{display:inline-flex;align-items:center;gap:10px;padding:0 24px}
.tis{font-size:8px;color:var(--p);opacity:.4}
.tin{font-family:var(--fm);font-size:9px;letter-spacing:.1em;color:var(--fg3)}
@keyframes roll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* Section shared */
.sec-eye{font-family:var(--fm);font-size:9px;letter-spacing:.18em;color:var(--p);display:block;margin-bottom:12px;text-transform:uppercase;opacity:.7}
.sec-h{font-family:var(--fd);font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.045em;color:#1d1d1f;line-height:1.06;margin-bottom:14px}
.sec-sub{font-size:15px;color:var(--fg3);line-height:1.72;max-width:520px}

/* How it works */
.how-sec{position:relative;z-index:1;padding:100px 0 80px;background:#fff}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:56px;position:relative}
.steps::before{content:'';position:absolute;top:28px;left:calc(16.67% + 18px);right:calc(16.67% + 18px);height:1px;background:linear-gradient(90deg,rgba(124,58,237,.3),rgba(8,145,178,.3));z-index:0}
.step{position:relative;z-index:1;padding:36px 28px;background:#fff;border:1.5px solid #e5e7eb;border-radius:20px;text-align:center;transition:border-color .22s,transform .2s,box-shadow .22s}
.step:hover{border-color:rgba(124,58,237,.25);transform:translateY(-4px);box-shadow:0 24px 64px -16px rgba(124,58,237,.12)}
.step-num{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:22px;font-weight:800;color:#fff;margin:0 auto 22px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);box-shadow:0 6px 24px rgba(124,58,237,.3)}
.step-title{font-family:var(--fd);font-size:17px;font-weight:700;color:#1d1d1f;margin-bottom:10px;letter-spacing:-.025em}
.step-desc{font-size:13px;color:var(--fg3);line-height:1.7}

/* 3D Feature Grid */
.feat-sec{position:relative;z-index:1;padding:80px 0 100px;background:#f5f5f7}
.fg3d-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:56px;perspective:1100px}
.fg3d{padding:30px 26px;background:#fff;border:1.5px solid #e5e7eb;border-radius:20px;position:relative;overflow:hidden;transition:border-color .2s,box-shadow .2s;cursor:default;transform-style:preserve-3d}
.fg3d::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:var(--fbar);opacity:.85;border-radius:20px 20px 0 0}
.fg3d::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 10% 10%,var(--fglow) 0%,transparent 55%);opacity:0;transition:opacity .28s;pointer-events:none}
.fg3d:hover::after{opacity:1}
.fg3d:hover{border-color:var(--fhb);box-shadow:0 24px 60px -12px var(--fshad)}
.fg3d-ic{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px;background:var(--fic);box-shadow:0 4px 16px rgba(0,0,0,.1);transition:transform .2s;position:relative;z-index:1}
.fg3d:hover .fg3d-ic{transform:perspective(400px) translateZ(16px) scale(1.1)}
.fg3d-title{font-family:var(--fd);font-size:16px;font-weight:700;color:#1d1d1f;letter-spacing:-.025em;margin-bottom:9px;position:relative;z-index:1}
.fg3d-desc{font-size:13px;color:var(--fg3);line-height:1.68;position:relative;z-index:1}

/* FAQ */
.faq-sec{position:relative;z-index:1;padding:80px 0 100px;background:#fff}
.faq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:52px}
.fq{padding:28px 30px;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:18px;transition:border-color .18s,transform .18s}
.fq:hover{border-color:rgba(124,58,237,.2);transform:translateY(-2px)}
.fq-q{font-family:var(--fd);font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.022em;margin-bottom:10px;display:flex;align-items:flex-start;gap:10px}
.fq-ic{color:var(--p);flex-shrink:0;margin-top:3px}
.fq-a{font-size:13.5px;color:var(--fg3);line-height:1.72;padding-left:24px}

/* CTA Banner */
.cta-ban{position:relative;z-index:1;padding:80px 0;background:#f5f5f7}
.cta-inner{background:#fff;border:1.5px solid rgba(124,58,237,.15);border-radius:28px;padding:80px 48px;text-align:center;position:relative;overflow:hidden}
.cta-inner::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,rgba(124,58,237,.04) 0%,transparent 58%);pointer-events:none}
.cta-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:600px;height:350px;background:radial-gradient(ellipse,rgba(124,58,237,.08) 0%,transparent 70%);filter:blur(50px);pointer-events:none}
.cta-h{font-family:var(--fd);font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.045em;color:#1d1d1f;margin-bottom:14px;position:relative;line-height:1.06}
.cta-sub{font-size:16px;color:var(--fg2);margin-bottom:40px;position:relative}

/* Related tools */
.related-sec{position:relative;z-index:1;padding:72px 0 80px;background:#f5f5f7;border-top:1px solid #e5e7eb}
.related-label{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--p);margin-bottom:14px}
.related-h{font-family:var(--fd);font-size:clamp(22px,3.5vw,34px);font-weight:800;letter-spacing:-.04em;color:#1d1d1f;margin-bottom:44px}
.related-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.related-card{display:flex;flex-direction:column;gap:10px;padding:22px 20px;background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;text-decoration:none;transition:border-color .18s,transform .18s,box-shadow .18s}
.related-card:hover{border-color:rgba(124,58,237,.3);transform:translateY(-3px);box-shadow:0 16px 40px -10px rgba(124,58,237,.1)}
.related-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.related-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.02em}
.related-desc{font-size:12px;color:var(--fg3);line-height:1.55}
@media(max-width:960px){.related-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.related-grid{grid-template-columns:1fr}}

/* Footer */
.foot{position:relative;z-index:1;border-top:1px solid #e5e7eb;padding:36px 0;background:#fff}
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
::-webkit-scrollbar-track{background:#f5f5f7}
::-webkit-scrollbar-thumb{background:rgba(124,58,237,.25);border-radius:2px}
:focus-visible{outline:2px solid var(--p);outline-offset:3px}

/* Demo section */
.demo-sec{background:#fff;padding:80px 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;font-family:var(--fu)}
.demo-sec .wrap{max-width:960px}
.demo-eye{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0891b2;margin-bottom:14px}
.demo-h{font-size:clamp(26px,4vw,40px);font-weight:800;color:#1d1d1f;letter-spacing:-.04em;line-height:1;margin-bottom:10px}
.demo-sub{font-size:15px;color:#6b7280;margin-bottom:40px;line-height:1.6}
.demo-steps{display:flex;gap:6px;margin-bottom:32px;flex-wrap:wrap}
.demo-dot{height:4px;border-radius:99px;flex:1;min-width:40px;background:#e5e7eb;transition:background .3s}
.demo-dot.active{background:#0891b2}
.demo-win{background:#f5f5f7;border-radius:20px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.08)}
.demo-chrome{background:#F0F0F2;border-bottom:1px solid #e0e0e0;height:36px;display:flex;align-items:center;padding:0 14px;gap:8px}
.demo-dots{display:flex;gap:5px}
.demo-dots span{width:10px;height:10px;border-radius:50%}
.demo-body{display:flex;min-height:320px}
.demo-left{width:200px;flex-shrink:0;background:#fafafa;border-right:1px solid #ebebeb;padding:16px 12px;display:flex;flex-direction:column;gap:6px}
.demo-left-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:600;color:#374151;cursor:default}
.demo-left-item.active{background:#e0f2fe;color:#0891b2}
.demo-center{flex:1;display:flex;align-items:center;justify-content:center;padding:28px}
.demo-label{font-size:12px;font-weight:600;color:#1d1d1f;margin-top:24px;text-align:center}
.demo-sub-label{font-size:11px;color:#9ca3af;text-align:center;margin-top:4px}
@keyframes pulse-ring{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
@keyframes scan-line{0%{top:0}100%{top:100%}}
@keyframes type-in{0%{width:0}100%{width:100%}}
@keyframes field-fill{0%{opacity:0;transform:translateX(-4px)}100%{opacity:1;transform:none}}
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
  { q: 'Is it free to use?', a: 'Free to start — includes 5 AI uses per day. Core PDF tools (edit, sign, merge, compress) are always free with no limits. Upgrade to Pro for unlimited AI uses.' },
  { q: 'Do I need to create an account?', a: 'No account needed. Your browser handles everything locally — documents never leave your device unless you trigger an AI feature, which only sends the relevant text context.' },
  { q: 'What types of PDFs are supported?', a: 'Both interactive PDF forms (AcroForms) and flat or scanned PDFs are supported. For scanned documents, the built-in OCR engine detects field positions automatically.' },
  { q: 'Is my document data secure?', a: 'Your files are processed entirely in your browser and are never stored on our servers. AI features send only the relevant text context — never the raw file — and no data is retained.' },
  { q: 'Can I add a digital signature?', a: 'Yes. Draw a freehand signature, type your name, or upload a signature image. Place it anywhere with drag-and-drop precision.' },
]

const TICKS = ['AI Form Filling','OCR Support','Digital Signature','Instant Export']

const DEMO = [
  { label: 'Upload PDF',       color: '#6366f1', desc: 'Drop any PDF — AcroForm, flat or scanned' },
  { label: 'Paste details',    color: '#7c3aed', desc: 'Type your info once in plain language' },
  { label: 'AI detects fields',color: '#0891b2', desc: 'AI reads and maps every field instantly' },
  { label: 'Fields filled',    color: '#16a34a', desc: 'All form fields filled automatically' },
  { label: 'Download PDF',     color: '#22c55e', desc: 'Export your completed PDF in one click' },
]

export default function AIPDFFormFillerPage() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const stackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setDemoStep(s => (s + 1) % DEMO.length), 2800)
    return () => clearInterval(id)
  }, [])

  // Always restore scroll on unmount in case editor was open during navigation
  useEffect(() => () => { document.body.style.overflow = '' }, [])

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

      {/* Nav — same as homepage */}
      <SiteNav />

      {/* Hero */}
      <section className="hero" style={{ paddingTop: 'calc(80px + 56px)' }}>
        <div className="wrap hero-in">

          {/* Left — copy */}
          <div className="hero-l">
            <div className="hero-badge">
              <span className="bdot" /><span>AI-POWERED FORM FILLING</span>
            </div>
            <h1 className="hero-h1">
              <span className="h1-a">AI PDF Form Filler</span>
              <span className="h1-b">Fill Forms Instantly</span>
              <span className="h1-c">Free — No Signup Needed</span>
            </h1>
            <p className="hero-sub">
              Upload any PDF, paste your details once, and let AI detect and fill the fields for you.
            </p>
            <div className="cta-row">
              <button className="btn-p" onClick={openEditor}>
                Start AI Form Filler — 5 Free Uses/Day
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <a className="btn-s2" href="#features">See features</a>
            </div>
            <div className="h-pills">
              {([['5 AI Uses','/ Day Free'],['No','Signup'],['OCR','Built-in'],['Private','& Secure']] as const).map(([v, l]) => (
                <div key={l} className="hpill"><strong>{v}</strong>{' '}<span>{l}</span></div>
              ))}
            </div>

            {/* Privacy note */}
            <div className="priv-box">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,color:'#16a34a'}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span><strong>Your PDF stays in your browser.</strong> AI features only process the required text context and do not upload the raw file.</span>
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

      {/* ── Animated Demo ── */}
      <section className="demo-sec">
        <div className="wrap">
          <span className="demo-eye">See it in action</span>
          <h2 className="demo-h">Watch AI fill your PDF</h2>
          <p className="demo-sub">Auto-playing demo — 5 steps, under 15 seconds.</p>

          {/* Step progress dots */}
          <div className="demo-steps">
            {DEMO.map((d, i) => (
              <div key={d.label} className={`demo-dot${i === demoStep ? ' active' : ''}`}
                onClick={() => setDemoStep(i)} style={{cursor:'pointer', background: i === demoStep ? d.color : '#e5e7eb'}}/>
            ))}
          </div>

          {/* Demo window */}
          <div className="demo-win">
            {/* Browser chrome */}
            <div className="demo-chrome">
              <div className="demo-dots">
                <span style={{background:'#ff5f57'}}/>
                <span style={{background:'#febc2e'}}/>
                <span style={{background:'#28c840'}}/>
              </div>
              <div style={{flex:1,display:'flex',justifyContent:'center'}}>
                <div style={{background:'rgba(0,0,0,.06)',borderRadius:6,padding:'3px 14px',fontSize:11,color:'#666',fontFamily:'monospace'}}>
                  editpdfai.com/ai-pdf-form-filler
                </div>
              </div>
            </div>

            {/* App body */}
            <div className="demo-body">
              {/* Left: step list */}
              <div className="demo-left">
                {DEMO.map((d, i) => (
                  <div key={d.label} className={`demo-left-item${i === demoStep ? ' active' : ''}`}
                    style={i === demoStep ? {background:`${d.color}12`, color:d.color} : {}}>
                    <span style={{width:18,height:18,borderRadius:'50%',background:i===demoStep?d.color:'#e5e7eb',
                      display:'inline-flex',alignItems:'center',justifyContent:'center',
                      fontSize:9,fontWeight:800,color:'#fff',flexShrink:0}}>
                      {i < demoStep ? '✓' : i + 1}
                    </span>
                    {d.label}
                  </div>
                ))}
              </div>

              {/* Center: visual */}
              <div className="demo-center">
                <div style={{width:'100%',maxWidth:380}}>
                  {/* Step 0: Upload */}
                  {demoStep === 0 && (
                    <div style={{border:'2px dashed #c7d2fe',borderRadius:16,padding:'40px 24px',textAlign:'center',background:'rgba(99,102,241,.03)',animation:'pulse-ring 2s ease-in-out infinite'}}>
                      <div style={{fontSize:40,marginBottom:12}}>📄</div>
                      <div style={{fontSize:14,fontWeight:700,color:'#1d1d1f',marginBottom:6}}>Drop your PDF here</div>
                      <div style={{fontSize:12,color:'#9ca3af'}}>or click to browse · up to 100 MB</div>
                      <div style={{marginTop:16,display:'inline-block',padding:'9px 22px',background:'#6366f1',borderRadius:99,fontSize:12,fontWeight:700,color:'#fff'}}>Choose PDF File</div>
                    </div>
                  )}

                  {/* Step 1: Paste details */}
                  {demoStep === 1 && (
                    <div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:20,boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}>
                      <div style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:10}}>Describe your details</div>
                      <div style={{background:'#f9fafb',border:'1.5px solid #e5e7eb',borderRadius:10,padding:14,fontSize:12,color:'#374151',lineHeight:1.7,position:'relative',overflow:'hidden'}}>
                        <span style={{display:'block',overflow:'hidden',whiteSpace:'nowrap',animation:'type-in 2.5s steps(60,end) forwards'}}>
                          Name: John Smith · DOB: 12/05/1990 · Address: 42 Oak Lane, Boston MA · Phone: 617-555-0192
                        </span>
                      </div>
                      <div style={{marginTop:10,display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#9ca3af'}}>
                        <span style={{width:6,height:6,borderRadius:'50%',background:'#7c3aed',animation:'pulse-ring 1.2s ease-in-out infinite',display:'inline-block'}}/>
                        AI reading your details…
                      </div>
                    </div>
                  )}

                  {/* Step 2: AI detects */}
                  {demoStep === 2 && (
                    <div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:20,boxShadow:'0 4px 16px rgba(0,0,0,.06)',position:'relative',overflow:'hidden'}}>
                      {/* Scanner line */}
                      <div style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#0891b2,transparent)',boxShadow:'0 0 10px rgba(8,145,178,.6)',animation:'scan-line 1.8s linear infinite',top:0}}/>
                      <div style={{fontSize:11,fontWeight:700,color:'#0891b2',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                        <span style={{width:7,height:7,borderRadius:'50%',background:'#0891b2',animation:'pulse-ring 1s ease-in-out infinite',display:'inline-block'}}/>
                        SCANNING — 4 fields detected
                      </div>
                      {['Full Name','Date of Birth','Address','Phone Number'].map((f,i) => (
                        <div key={f} style={{marginBottom:8,animation:`field-fill .35s ${i*.1}s both`}}>
                          <div style={{fontSize:9,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>{f}</div>
                          <div style={{height:22,border:'1.5px solid rgba(8,145,178,.4)',borderRadius:6,background:'rgba(8,145,178,.04)',display:'flex',alignItems:'center',padding:'0 8px'}}>
                            <div style={{height:5,width:`${70-i*8}%`,borderRadius:99,background:'rgba(8,145,178,.25)',animation:'type-in 1s ease forwards'}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step 3: Fields filled */}
                  {demoStep === 3 && (
                    <div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:20,boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#16a34a',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                        <span>✓</span> All fields filled
                      </div>
                      {[['Full Name','John Smith'],['Date of Birth','12/05/1990'],['Address','42 Oak Lane, Boston MA'],['Phone','617-555-0192']].map(([f,v],i) => (
                        <div key={f} style={{marginBottom:8,animation:`field-fill .3s ${i*.08}s both`}}>
                          <div style={{fontSize:9,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>{f}</div>
                          <div style={{height:26,border:'1.5px solid rgba(22,163,74,.3)',borderRadius:6,background:'rgba(22,163,74,.04)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 8px'}}>
                            <span style={{fontSize:11,color:'#1d1d1f',fontWeight:500}}>{v}</span>
                            <span style={{color:'#16a34a',fontWeight:700,fontSize:13}}>✓</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step 4: Download */}
                  {demoStep === 4 && (
                    <div style={{textAlign:'center',padding:'32px 24px'}}>
                      <div style={{width:72,height:72,borderRadius:20,background:'rgba(34,197,94,.12)',border:'2px solid rgba(34,197,94,.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:32}}>✓</div>
                      <div style={{fontSize:16,fontWeight:800,color:'#1d1d1f',marginBottom:6}}>PDF is ready</div>
                      <div style={{fontSize:12,color:'#9ca3af',marginBottom:20}}>All 4 fields filled · Signature added</div>
                      <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',background:'#22c55e',borderRadius:99,fontSize:14,fontWeight:700,color:'#fff',boxShadow:'0 6px 20px rgba(34,197,94,.3)'}}>
                        ⬇ Download completed PDF
                      </div>
                    </div>
                  )}

                  <div className="demo-label">{DEMO[demoStep].label}</div>
                  <div className="demo-sub-label">{DEMO[demoStep].desc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Related tools — internal links for SEO */}
      <section className="related-sec">
        <div className="wrap">
          <p className="related-label">More PDF Tools</p>
          <h2 className="related-h">Everything you need for PDFs</h2>
          <div className="related-grid">
            <Link href="/pdf-editor" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div className="related-name">PDF Editor</div>
              <div className="related-desc">Add text, images, shapes and annotations to any PDF.</div>
            </Link>
            <Link href="/pdf-signer" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(124,58,237,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><path d="M12 19l7-7-3-3-7 7v3h3z"/><path d="M18 5l1 1-9.5 9.5"/></svg>
              </div>
              <div className="related-name">PDF Signer</div>
              <div className="related-desc">Draw, type or upload a signature and sign any PDF instantly.</div>
            </Link>
            <Link href="/pdf-ocr" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(8,145,178,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
              <div className="related-name">PDF OCR</div>
              <div className="related-desc">Extract text from scanned PDFs with AI-powered OCR.</div>
            </Link>
            <Link href="/pdf-compressor" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(22,163,74,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <div className="related-name">PDF Compressor</div>
              <div className="related-desc">Reduce PDF file size without losing quality.</div>
            </Link>
            <Link href="/pdf-merger" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M8 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2"/><rect x="8" y="2" width="8" height="6" rx="1"/></svg>
              </div>
              <div className="related-name">PDF Merger</div>
              <div className="related-desc">Combine multiple PDF files into one document.</div>
            </Link>
            <Link href="/pdf-splitter" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div className="related-name">PDF Splitter</div>
              <div className="related-desc">Split a PDF into separate files by page range.</div>
            </Link>
            <Link href="/pdf-to-word" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div className="related-name">PDF to Word</div>
              <div className="related-desc">Convert any PDF to an editable Word document.</div>
            </Link>
            <Link href="/pdf-summarizer" className="related-card">
              <div className="related-icon" style={{ background: 'rgba(168,85,247,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </div>
              <div className="related-name">PDF Summarizer</div>
              <div className="related-desc">Get AI-powered summaries of any PDF in seconds.</div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-ban">
        <div className="wrap">
          <div className="cta-inner">
            <div className="cta-glow" />
            <h2 className="cta-h">Start filling PDFs<br />with AI right now</h2>
            <p className="cta-sub">5 free AI uses per day. No signup. No install. Works in any browser.</p>
            <button className="btn-p" onClick={openEditor} style={{ margin: '0 auto' }}>
              Start AI Form Filler
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer — same as homepage */}
      <SiteFooter />
    </div>
  )
}
