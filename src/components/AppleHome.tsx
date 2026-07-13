'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useMotionValue, useSpring,
} from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight, FileText, Lock, PenLine, ScanLine, Zap,
  Upload, CheckCircle2, MousePointer2, Layers, Download, X, Menu,
  ChevronRight, ChevronDown, ArrowUpRight,
  Shield, Server, CreditCard, Globe, GraduationCap, Briefcase, Building2, FlaskConical, Plus, Minus,
  // tool icons
  WandSparkles, ScanText, Sparkles, BrainCircuit, ClipboardList, Languages,
  FilePen, MessageSquareText,
  ListOrdered, RotateCw, Scissors, Trash2,
  FileType, FileSpreadsheet, Presentation, Table, MonitorPlay, Code, ImagePlus, Images,
  KeyRound, Stamp, EyeOff, PenTool,
  Minimize2, Merge, Split, FormInput,
} from 'lucide-react'

// ─── tokens ──────────────────────────────────────────────────────────────────
const E   = [0.25, 0.46, 0.45, 0.94] as [number,number,number,number]
const SP  = { type:'spring', stiffness:400, damping:30 } as const
const FI  = { fontFamily:'var(--font-inter,system-ui,sans-serif)' }
const RED = '#E24B4A'
const MONO: React.CSSProperties = { fontFamily:'var(--font-mono,monospace)' }

// ─── category config ─────────────────────────────────────────────────────────
const CATS = [
  { id:'AI',       label:'AI Tools',        color:'#7c3aed', light:'rgba(124,58,237,.1)',  Icon:Sparkles,    desc:'Smart automation & intelligence' },
  { id:'Edit',     label:'Edit & Annotate', color:'#2563eb', light:'rgba(37,99,235,.1)',   Icon:FilePen,     desc:'Edit, annotate and mark up PDFs' },
  { id:'Pages',    label:'Page Tools',      color:'#f97316', light:'rgba(249,115,22,.1)',  Icon:Layers,      desc:'Manage, rotate, extract & delete pages' },
  { id:'Convert',  label:'Convert',         color:'#16a34a', light:'rgba(22,163,74,.1)',   Icon:FileType,    desc:'Transform PDFs to & from any format' },
  { id:'Protect',  label:'Protect & Sign',  color:'#dc2626', light:'rgba(220,38,38,.1)',   Icon:KeyRound,    desc:'Secure, redact and sign documents' },
  { id:'Organize', label:'Organize',        color:'#d97706', light:'rgba(217,119,6,.1)',   Icon:Merge,       desc:'Merge, split, compress and build forms' },
]

// ─── tools ───────────────────────────────────────────────────────────────────
const TOOLS: { name:string; tag:string; href:string; cat:string; Icon:LucideIcon; iconBg:string; desc:string; tier:'free'|'ai'|'pro' }[] = [
  // ── AI ──────────────────────────────────────────────────────────────────────
  { name:'AI Form Filler',    tag:'LIVE', href:'/ai-pdf-form-filler', cat:'AI',       Icon:WandSparkles,    iconBg:'linear-gradient(135deg,#7c3aed,#a855f7)', desc:'Auto-fill any PDF form with AI',        tier:'ai'   },
  { name:'PDF OCR Scanner',   tag:'LIVE', href:'/pdf-ocr',            cat:'AI',       Icon:ScanText,        iconBg:'linear-gradient(135deg,#6366f1,#818cf8)', desc:'Extract text from scanned PDFs',        tier:'ai'   },
  { name:'PDF Summarizer',    tag:'LIVE', href:'/pdf-summarizer',     cat:'AI',       Icon:Sparkles,        iconBg:'linear-gradient(135deg,#8b5cf6,#c084fc)', desc:'Get instant AI summaries',              tier:'ai'   },
  { name:'PDF Mind Map',      tag:'LIVE', href:'/mind-map',           cat:'AI',       Icon:BrainCircuit,    iconBg:'linear-gradient(135deg,#a855f7,#d946ef)', desc:'Visualise ideas from any PDF',          tier:'ai'   },
  { name:'Quiz Creator',      tag:'LIVE', href:'/quiz-creator',       cat:'AI',       Icon:ClipboardList,   iconBg:'linear-gradient(135deg,#7c3aed,#6366f1)', desc:'Generate quizzes from PDF content',     tier:'ai'   },
  { name:'PDF Translator',    tag:'LIVE', href:'/pdf-translator',     cat:'AI',       Icon:Languages,       iconBg:'linear-gradient(135deg,#6366f1,#06b6d4)', desc:'Translate PDFs to any language',        tier:'ai'   },
  // ── Edit ────────────────────────────────────────────────────────────────────
  { name:'PDF Viewer',        tag:'LIVE', href:'/pdf-viewer',         cat:'Edit',     Icon:MonitorPlay,     iconBg:'linear-gradient(135deg,#0a84ff,#34aadc)', desc:'View any PDF in your browser',          tier:'free' },
  { name:'PDF Editor',        tag:'LIVE', href:'/pdf-editor',         cat:'Edit',     Icon:FilePen,         iconBg:'linear-gradient(135deg,#2563eb,#3b82f6)', desc:'Edit text, images and layout',          tier:'free' },
  { name:'PDF Annotator',     tag:'LIVE', href:'/pdf-annotate',       cat:'Edit',     Icon:MessageSquareText, iconBg:'linear-gradient(135deg,#0ea5e9,#38bdf8)', desc:'Highlight, comment and annotate',     tier:'free' },
  // ── Pages ───────────────────────────────────────────────────────────────────
  { name:'PDF Page Manager',  tag:'LIVE', href:'/pdf-page-manager',   cat:'Pages',    Icon:Layers,          iconBg:'linear-gradient(135deg,#f59e0b,#fbbf24)', desc:'Drag-and-drop page reordering',         tier:'free' },
  { name:'PDF Cropper',       tag:'LIVE', href:'/pdf-cropper',        cat:'Pages',    Icon:Scissors,        iconBg:'linear-gradient(135deg,#0d9488,#14b8a6)', desc:'Crop & trim PDF page margins',          tier:'free' },
  { name:'Add Page Numbers',  tag:'LIVE', href:'/add-page-numbers',   cat:'Pages',    Icon:ListOrdered,     iconBg:'linear-gradient(135deg,#f97316,#fb923c)', desc:'Add custom page numbers to PDF',        tier:'free' },
  { name:'Rotate PDF Pages',  tag:'LIVE', href:'/rotate-pdf',         cat:'Pages',    Icon:RotateCw,        iconBg:'linear-gradient(135deg,#ea580c,#f97316)', desc:'Rotate any pages to any angle',         tier:'free' },
  { name:'Extract Pages',     tag:'LIVE', href:'/extract-pages',      cat:'Pages',    Icon:Scissors,        iconBg:'linear-gradient(135deg,#d97706,#f59e0b)', desc:'Pull specific pages into a new PDF',    tier:'free' },
  { name:'Delete Pages',      tag:'LIVE', href:'/delete-pages',       cat:'Pages',    Icon:Trash2,          iconBg:'linear-gradient(135deg,#dc2626,#ef4444)', desc:'Remove unwanted pages permanently',     tier:'free' },
  // ── Convert ─────────────────────────────────────────────────────────────────
  { name:'PDF → Word',        tag:'LIVE', href:'/pdf-to-word',        cat:'Convert',  Icon:FileType,        iconBg:'linear-gradient(135deg,#16a34a,#22c55e)', desc:'Convert PDF to editable Word doc',      tier:'pro'  },
  { name:'PDF → Excel',       tag:'LIVE', href:'/pdf-to-excel',       cat:'Convert',  Icon:FileSpreadsheet, iconBg:'linear-gradient(135deg,#15803d,#16a34a)', desc:'Extract tables to spreadsheet',         tier:'pro'  },
  { name:'PDF → PowerPoint',  tag:'LIVE', href:'/pdf-to-ppt',         cat:'Convert',  Icon:Presentation,    iconBg:'linear-gradient(135deg,#d97706,#f59e0b)', desc:'Turn slides into editable PPT',         tier:'pro'  },
  { name:'Excel / CSV → PDF', tag:'LIVE', href:'/excel-to-pdf',       cat:'Convert',  Icon:Table,           iconBg:'linear-gradient(135deg,#059669,#10b981)', desc:'Spreadsheets to perfect PDF',           tier:'free' },
  { name:'PPT → PDF',         tag:'LIVE', href:'/ppt-to-pdf',         cat:'Convert',  Icon:MonitorPlay,     iconBg:'linear-gradient(135deg,#b45309,#d97706)', desc:'Presentations to PDF instantly',        tier:'free' },
  { name:'Word → PDF',        tag:'LIVE', href:'/word-to-pdf',        cat:'Convert',  Icon:FileType,        iconBg:'linear-gradient(135deg,#2563eb,#60a5fa)', desc:'Convert Word .docx to PDF',             tier:'free' },
  { name:'TXT → PDF',         tag:'LIVE', href:'/txt-to-pdf',         cat:'Convert',  Icon:FileText,        iconBg:'linear-gradient(135deg,#6366f1,#818cf8)', desc:'Turn plain text into a PDF',            tier:'free' },
  { name:'RTF → PDF',         tag:'LIVE', href:'/rtf-to-pdf',         cat:'Convert',  Icon:FileType,        iconBg:'linear-gradient(135deg,#b45309,#d97706)', desc:'Convert RTF documents to PDF',          tier:'free' },
  { name:'ODT → PDF',         tag:'LIVE', href:'/odt-to-pdf',         cat:'Convert',  Icon:FileText,        iconBg:'linear-gradient(135deg,#059669,#10b981)', desc:'Convert OpenDocument Text to PDF',      tier:'free' },
  { name:'HTML → PDF',        tag:'LIVE', href:'/html-to-pdf',        cat:'Convert',  Icon:Code,            iconBg:'linear-gradient(135deg,#0891b2,#06b6d4)', desc:'Render HTML pages as PDF',              tier:'free' },
  { name:'Image to PDF',      tag:'LIVE', href:'/image-to-pdf',       cat:'Convert',  Icon:ImagePlus,       iconBg:'linear-gradient(135deg,#7c3aed,#8b5cf6)', desc:'Turn photos & images into PDF',         tier:'free' },
  { name:'PDF to Images',     tag:'LIVE', href:'/pdf-to-images',      cat:'Convert',  Icon:Images,          iconBg:'linear-gradient(135deg,#db2777,#ec4899)', desc:'Export every page as an image',         tier:'free' },
  // ── Protect ─────────────────────────────────────────────────────────────────
  { name:'PDF Password Lock', tag:'LIVE', href:'/pdf-password-lock',  cat:'Protect',  Icon:KeyRound,        iconBg:'linear-gradient(135deg,#dc2626,#ef4444)', desc:'Encrypt with a strong password',        tier:'free' },
  { name:'PDF Watermarker',   tag:'LIVE', href:'/pdf-watermark',      cat:'Protect',  Icon:Stamp,           iconBg:'linear-gradient(135deg,#2563eb,#60a5fa)', desc:'Add visible or hidden watermarks',      tier:'free' },
  { name:'PDF Redactor',      tag:'LIVE', href:'/pdf-redactor',       cat:'Protect',  Icon:EyeOff,          iconBg:'linear-gradient(135deg,#374151,#6b7280)', desc:'Permanently black out sensitive text',  tier:'free' },
  { name:'PDF E-Signer',      tag:'LIVE', href:'/pdf-signer',         cat:'Protect',  Icon:PenTool,         iconBg:'linear-gradient(135deg,#0d9488,#14b8a6)', desc:'Sign and collect signatures',           tier:'free' },
  // ── Organize ────────────────────────────────────────────────────────────────
  { name:'PDF Compressor',    tag:'LIVE', href:'/pdf-compressor',     cat:'Organize', Icon:Minimize2,       iconBg:'linear-gradient(135deg,#d97706,#fbbf24)', desc:'Shrink file size without quality loss', tier:'free' },
  { name:'PDF Merger',        tag:'LIVE', href:'/pdf-merger',         cat:'Organize', Icon:Merge,           iconBg:'linear-gradient(135deg,#7c3aed,#8b5cf6)', desc:'Combine multiple PDFs into one',        tier:'free' },
  { name:'PDF Splitter',      tag:'LIVE', href:'/pdf-splitter',       cat:'Organize', Icon:Split,           iconBg:'linear-gradient(135deg,#e11d48,#f43f5e)', desc:'Split one PDF into many files',         tier:'free' },
  { name:'PDF Form Builder',  tag:'LIVE', href:'/pdf-form-builder',   cat:'Organize', Icon:FormInput,       iconBg:'linear-gradient(135deg,#0369a1,#0ea5e9)', desc:'Create fillable PDF forms',             tier:'free' },
]

// ─── global CSS ──────────────────────────────────────────────────────────────
const CSS = `
  @keyframes shimmer  { 0%{background-position:200% center}100%{background-position:-200% center} }
  @keyframes ocrscan  { 0%{top:-2px;opacity:0}4%{opacity:1}96%{opacity:1}100%{top:calc(100% + 2px);opacity:0} }
  @keyframes fin      { from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)} }
  @keyframes chk      { 0%{opacity:0;transform:scale(0) rotate(-20deg)}60%{transform:scale(1.3)}100%{opacity:1;transform:scale(1)} }
  @keyframes sigdraw  { 0%,8%{stroke-dashoffset:340;opacity:0}12%{opacity:1}52%{stroke-dashoffset:0}78%{stroke-dashoffset:0;opacity:1}88%{opacity:0}100%{stroke-dashoffset:340;opacity:0} }
  @keyframes pdot     { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.7);opacity:.4} }

  *,*::before,*::after { box-sizing:border-box; }
  body { overflow-x:clip; }

  .grad-red {
    background:linear-gradient(120deg,#E24B4A 0%,#ff7a59 55%,#E24B4A 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }
  .tool-row:hover { background:rgba(0,0,0,.02) !important; }
  .tool-row-light:hover { background:#f5f5f5 !important; }
  .tab-bar::-webkit-scrollbar { display:none; }
  .tab-bar { -ms-overflow-style:none; scrollbar-width:none; }


  /* responsive */
  .r-feat    { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .r-bento   { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .r-footer  { display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:48px; align-items:start; }
  .r-tgrid   { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
  .bspan2    { grid-column:span 2; }
  .desk      { display:flex; }
  .mob       { display:none; }
  .nav-mega::-webkit-scrollbar { display:none; }

  .sec-pad  { padding:80px 48px 48px; }
  .tools-sec{ padding:88px 28px; }
  .cta-sec  { padding:120px 28px; }
  .tools-hdr{ display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:40px; }
  .tools-legend { display:flex; gap:16px; flex-wrap:wrap; }
  .hero-ctas{ display:flex; gap:12px; flex-wrap:wrap; margin-bottom:28px; }
  .hero-trust{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

  @media(max-width:1024px){
    .r-feat  { grid-template-columns:1fr; gap:40px; }
    .r-bento { grid-template-columns:repeat(2,1fr); }
  }
  @media(max-width:900px){
    .footer-grid { grid-template-columns:1fr 1fr !important; gap:32px !important; }
  }
  @media(max-width:900px){
    .desk     { display:none; }
    .mob      { display:flex; }
  }
  @media(max-width:680px){
    .r-bento  { grid-template-columns:1fr; }
    .bspan2   { grid-column:span 1; }
    .r-footer { grid-template-columns:1fr; gap:28px; }
    .footer-grid { grid-template-columns:1fr !important; gap:24px !important; }
    .r-tgrid  { grid-template-columns:1fr 1fr; }
    .sec-pad  { padding:56px 20px 36px; }
    .tools-sec{ padding:60px 16px; }
    .cta-sec  { padding:72px 20px; }
    .tools-hdr{ flex-direction:column; align-items:flex-start; gap:12px; margin-bottom:28px; }
    .tools-legend { gap:10px; }
    .hero-ctas{ flex-direction:column; align-items:stretch; }
    .hero-ctas a { justify-content:center; text-align:center; }
    .hero-trust { gap:8px; }
  }
  @media(max-width:420px){
    .r-tgrid  { grid-template-columns:1fr; }
    .sec-pad  { padding:48px 16px 28px; }
    .tools-sec{ padding:48px 14px; }
    .cta-sec  { padding:60px 16px; }
  }

  /* ── hero grid ── */
  .hero-grid   { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
  .hero-visual { display:block; }
  @media(max-width:900px){
    .hero-grid   { grid-template-columns:1fr; }
    .hero-visual { display:none; }
  }

  /* ── scroll gallery mobile ── */
  .scr-sticky { position:-webkit-sticky; position:sticky; }
  @supports (height:100dvh){ .scr-sticky{ height:100dvh; } }

  @media(max-width:768px){
    .scr-sticky { padding-top:54px; box-sizing:border-box; }
    .scr-row    { flex-direction:column !important; gap:12px !important; padding:16px 20px 0 !important; align-items:stretch !important; justify-content:flex-start !important; }
    .scr-left   { width:100% !important; }
    .scr-dots   { margin-bottom:16px !important; }
    .scr-cta    { display:none !important; }
    .scr-right  { width:100% !important; flex:unset !important; }
    .scr-screen { height:280px !important; }
    .scr-doc    { align-items:flex-start !important; padding:12px !important; }
    .scr-url    { display:none !important; }
    .scr-hint   { display:none !important; }
  }
`

// ══════════════════════════════════════════════════════════════════════════════
//  MOTION PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════

function Mag({ children, str=0.36 }:{ children:React.ReactNode; str?:number }) {
  const ref=useRef<HTMLDivElement>(null)
  const mx=useMotionValue(0), my=useMotionValue(0)
  const sx=useSpring(mx,{stiffness:350,damping:28,mass:.5})
  const sy=useSpring(my,{stiffness:350,damping:28,mass:.5})
  const on=useCallback((e:React.MouseEvent)=>{
    if(!ref.current) return
    const r=ref.current.getBoundingClientRect()
    mx.set((e.clientX-(r.left+r.width/2))*str); my.set((e.clientY-(r.top+r.height/2))*str)
  },[mx,my,str])
  const off=useCallback(()=>{mx.set(0);my.set(0)},[mx,my])
  return <motion.div ref={ref} style={{x:sx,y:sy,display:'inline-block'}} onMouseMove={on} onMouseLeave={off}>{children}</motion.div>
}

function Tilt({ children }:{ children:React.ReactNode }) {
  const ref=useRef<HTMLDivElement>(null)
  const mx=useMotionValue(0), my=useMotionValue(0)
  const glX=useMotionValue(50), glY=useMotionValue(30)
  const rx=useSpring(useTransform(my,[-220,220],[12,-12]),{stiffness:120,damping:20})
  const ry=useSpring(useTransform(mx,[-220,220],[-12,12]),{stiffness:120,damping:20})
  const sc=useSpring(1,{stiffness:120,damping:20})
  const on=useCallback((e:React.MouseEvent)=>{
    if(!ref.current) return
    const r=ref.current.getBoundingClientRect()
    mx.set(e.clientX-(r.left+r.width/2)); my.set(e.clientY-(r.top+r.height/2))
    glX.set(((e.clientX-r.left)/r.width)*100); glY.set(((e.clientY-r.top)/r.height)*100); sc.set(1.02)
  },[mx,my,glX,glY,sc])
  const off=useCallback(()=>{mx.set(0);my.set(0);glX.set(50);glY.set(30);sc.set(1)},[mx,my,glX,glY,sc])
  return (
    <div ref={ref} style={{perspective:1200}} onMouseMove={on} onMouseLeave={off}>
      <motion.div style={{rotateX:rx,rotateY:ry,scale:sc,willChange:'transform',position:'relative'}}>
        <motion.div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none',borderRadius:16,
          background:useTransform([glX,glY],([x,y])=>`radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.12) 0%, transparent 60%)`),
        }}/>
        {children}
      </motion.div>
    </div>
  )
}

const MV = { hidden:{}, visible:{ transition:{ staggerChildren:.08, delayChildren:.04 } } }
const WV = { hidden:{y:'110%',opacity:0}, visible:{ y:'0%',opacity:1, transition:{ duration:.7, ease:[0.22,1,0.36,1] as [number,number,number,number] } } }

const CC = { hidden:{}, visible:{ transition:{ staggerChildren:.04, delayChildren:.05 } } }
const CI = { hidden:{opacity:0,y:20,scale:.98}, visible:{ opacity:1,y:0,scale:1, transition:{ duration:.42, ease:[0.22,1,0.36,1] as [number,number,number,number] } } }


// ══════════════════════════════════════════════════════════════════════════════
//  CURSOR DOT
// ══════════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════════
//  SCROLL % COUNTER
// ══════════════════════════════════════════════════════════════════════════════
function ScrollPct() {
  return <span>SCROLL</span>
}

// ══════════════════════════════════════════════════════════════════════════════
//  BROWSER UI MOCKUP
// ══════════════════════════════════════════════════════════════════════════════
function BrowserUI() {
  const tools = [
    { Icon:MousePointer2, label:'Edit',     color:'#6366f1', active:true  },
    { Icon:Sparkles,      label:'AI',       color:'#7c3aed', active:false },
    { Icon:PenTool,       label:'Sign',     color:RED,       active:false },
    { Icon:FileType,      label:'Convert',  color:'#2563eb', active:false },
    { Icon:Minimize2,     label:'Compress', color:'#f97316', active:false },
  ]
  const tasks = [
    { label:'AI Summarize',   color:'#7c3aed', d:'0.2s' },
    { label:'E-Sign',         color:RED,       d:'0.7s' },
    { label:'PDF → Word',     color:'#2563eb', d:'1.2s' },
    { label:'Compress',       color:'#f97316', d:'1.7s' },
  ]
  return (
    <div style={{borderRadius:16,border:'1px solid rgba(0,0,0,.08)',overflow:'hidden',boxShadow:'0 24px 80px -16px rgba(0,0,0,.12)'}}>
      {/* Chrome bar */}
      <div style={{background:'#F5F5F7',borderBottom:'1px solid rgba(0,0,0,.07)',height:36,display:'flex',alignItems:'center',padding:'0 14px',gap:10}}>
        <div style={{display:'flex',gap:5}}>
          {['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{width:9,height:9,borderRadius:'50%',background:c}}/>)}
        </div>
        <div style={{flex:1,display:'flex',justifyContent:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(0,0,0,.05)',borderRadius:6,padding:'3px 12px',minWidth:200}}>
            <Lock size={8} color="rgba(0,0,0,.35)" strokeWidth={2}/>
            <span style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)'}}>editpdfai.com</span>
          </div>
        </div>
      </div>
      {/* App body */}
      <div style={{height:380,background:'#fff',display:'grid',gridTemplateColumns:'44px 1fr 168px',...FI}}>
        {/* Left sidebar — tool icons */}
        <div style={{background:'#F5F5F7',borderRight:'1px solid rgba(0,0,0,.06)',display:'flex',flexDirection:'column',alignItems:'center',padding:'10px 0',gap:3}}>
          {tools.map(({Icon,label,color,active})=>(
            <div key={label} title={label} style={{width:30,height:30,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',
              background:active?color:'transparent',marginBottom:1}}>
              <Icon size={13} color={active?'#fff':color} strokeWidth={active?2.5:1.8}/>
            </div>
          ))}
        </div>
        {/* Center — PDF document */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'14px 10px',background:'#fafafa'}}>
          <div style={{background:'#fff',borderRadius:6,boxShadow:'0 4px 20px rgba(0,0,0,.1)',width:'100%',maxWidth:240,padding:'16px 14px',border:'1px solid #f0f0f0'}}>
            {/* Doc header */}
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
              <div style={{width:18,height:22,background:'#f0f0f0',borderRadius:2,flexShrink:0}}/>
              <div>
                <div style={{height:5,width:80,background:'#1d1d1f',borderRadius:2,marginBottom:3}}/>
                <div style={{height:4,width:50,background:'#e0e0e0',borderRadius:2}}/>
              </div>
            </div>
            <div style={{height:1,background:'#f0f0f0',marginBottom:10}}/>
            {/* Text lines */}
            {[90,75,85,60,80,55,70].map((w,i)=>(
              <div key={i} style={{height:6,borderRadius:3,marginBottom:7,
                background: i===1 ? 'rgba(99,102,241,.2)' : i===4 ? 'rgba(226,75,74,.15)' : '#f0f0f0',
                width:`${w}%`,
                boxShadow: i===1 ? '0 0 0 2px rgba(99,102,241,.1)' : i===4 ? '0 0 0 2px rgba(226,75,74,.08)' : 'none',
              }}/>
            ))}
            {/* Signature line */}
            <div style={{marginTop:10,borderTop:'1px dashed #e8e8e8',paddingTop:8}}>
              <svg width="110" height="18" viewBox="0 0 110 18" fill="none">
                <path d="M5 12 C13 3 20 16 28 8 C36 2 45 14 55 6 C64 1 73 13 82 6 C90 2 98 12 106 8"
                  stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="340"
                  style={{animation:'sigdraw 3.5s ease-in-out infinite'}}/>
              </svg>
            </div>
          </div>
        </div>
        {/* Right panel — tools list */}
        <div style={{background:'#F5F5F7',borderLeft:'1px solid rgba(0,0,0,.06)',padding:'11px 9px',display:'flex',flexDirection:'column',gap:6}}>
          <div style={{...MONO,fontSize:8,fontWeight:700,color:'rgba(0,0,0,.4)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:2}}>35+ Tools</div>
          {tasks.map(({label,color,d})=>(
            <div key={label} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 7px',background:'#fff',borderRadius:7,border:'1px solid rgba(0,0,0,.06)',animation:`fin .35s ${d} both`,opacity:0}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:color,flexShrink:0}}/>
              <span style={{fontSize:8.5,color:'#374151',fontWeight:600}}>{label}</span>
            </div>
          ))}
          <div style={{marginTop:'auto',borderTop:'1px solid rgba(0,0,0,.06)',paddingTop:8}}>
            <div style={{...MONO,fontSize:7.5,color:'rgba(0,0,0,.3)',marginBottom:5}}>AI uses today</div>
            <div style={{height:3,background:'rgba(0,0,0,.07)',borderRadius:99,overflow:'hidden',marginBottom:4}}>
              <motion.div animate={{width:['0%','40%']}} transition={{duration:1.2,delay:.5,ease:[0.22,1,0.36,1]}}
                style={{height:'100%',background:'#7c3aed',borderRadius:99}}/>
            </div>
            <div style={{fontSize:8,color:'rgba(0,0,0,.4)',fontWeight:600}}>2 / 5 used</div>
          </div>
          <div style={{height:26,background:'#1d1d1f',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
            <Download size={9} color="#fff" strokeWidth={2.5}/>
            <span style={{...FI,fontSize:8.5,color:'#fff',fontWeight:700}}>Export</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════════════════════════════════
type NavTier = 'free'|'ai'|'pro'
type AHNavTool = { name:string; href:string; tier:NavTier; Icon:LucideIcon; bg:string }
type AHNavCat  = { label:string; href:string; color:string; Icon:LucideIcon; tools:AHNavTool[] }

const NAV_CATS: AHNavCat[] = [
  {
    label:'Edit', href:'/pdf-editor', color:'#2563eb', Icon:FilePen,
    tools:[
      { name:'PDF Editor',    href:'/pdf-editor',   tier:'free', Icon:FilePen,          bg:'#2563eb' },
      { name:'PDF Annotator', href:'/pdf-annotate', tier:'free', Icon:MessageSquareText, bg:'#0ea5e9' },
      { name:'PDF Viewer',    href:'/pdf-viewer',   tier:'free', Icon:MonitorPlay,       bg:'#0a84ff' },
      { name:'PDF Redactor',  href:'/pdf-redactor', tier:'free', Icon:EyeOff,            bg:'#374151' },
      { name:'PDF Cropper',   href:'/pdf-cropper',  tier:'free', Icon:Scissors,          bg:'#0d9488' },
      { name:'Rotate PDF',    href:'/rotate-pdf',   tier:'free', Icon:RotateCw,          bg:'#ea580c' },
    ],
  },
  {
    label:'AI Tools', href:'/ai-pdf-form-filler', color:'#7c3aed', Icon:Sparkles,
    tools:[
      { name:'AI Form Filler', href:'/ai-pdf-form-filler', tier:'ai',  Icon:WandSparkles,  bg:'#7c3aed' },
      { name:'PDF Summarizer', href:'/pdf-summarizer',     tier:'ai',  Icon:Sparkles,      bg:'#8b5cf6' },
      { name:'OCR Scanner',    href:'/pdf-ocr',            tier:'ai',  Icon:ScanText,      bg:'#6366f1' },
      { name:'PDF Translator', href:'/pdf-translator',     tier:'ai',  Icon:Languages,     bg:'#0891b2' },
      { name:'PDF Mind Map',   href:'/mind-map',           tier:'ai',  Icon:BrainCircuit,  bg:'#a855f7' },
      { name:'Quiz Creator',   href:'/quiz-creator',       tier:'ai',  Icon:ClipboardList, bg:'#7c3aed' },
    ],
  },
  {
    label:'Convert', href:'/#tools', color:'#16a34a', Icon:FileType,
    tools:[
      { name:'PDF → Word',    href:'/pdf-to-word',   tier:'pro',  Icon:FileType,        bg:'#16a34a' },
      { name:'PDF → Excel',   href:'/pdf-to-excel',  tier:'pro',  Icon:FileSpreadsheet, bg:'#15803d' },
      { name:'PDF → PPT',     href:'/pdf-to-ppt',    tier:'pro',  Icon:Presentation,    bg:'#d97706' },
      { name:'Image to PDF',  href:'/image-to-pdf',  tier:'free', Icon:ImagePlus,       bg:'#7c3aed' },
      { name:'Word → PDF',    href:'/word-to-pdf',   tier:'free', Icon:FileType,        bg:'#2563eb' },
      { name:'PDF to Images', href:'/pdf-to-images', tier:'free', Icon:Images,          bg:'#db2777' },
    ],
  },
  {
    label:'Protect', href:'/pdf-signer', color:'#dc2626', Icon:PenTool,
    tools:[
      { name:'Sign PDF',       href:'/pdf-signer',        tier:'free', Icon:PenTool,  bg:'#0d9488' },
      { name:'Password Lock',  href:'/pdf-password-lock', tier:'free', Icon:KeyRound, bg:'#dc2626' },
      { name:'Watermark',      href:'/pdf-watermark',     tier:'free', Icon:Stamp,    bg:'#2563eb' },
      { name:'PDF Redactor',   href:'/pdf-redactor',      tier:'free', Icon:EyeOff,   bg:'#374151' },
    ],
  },
  {
    label:'Organize', href:'/#tools', color:'#d97706', Icon:Layers,
    tools:[
      { name:'Merge PDF',     href:'/pdf-merger',       tier:'free', Icon:Merge,    bg:'#7c3aed' },
      { name:'Split PDF',     href:'/pdf-splitter',     tier:'free', Icon:Split,    bg:'#e11d48' },
      { name:'Compress PDF',  href:'/pdf-compressor',   tier:'free', Icon:Minimize2,bg:'#d97706' },
      { name:'Page Manager',  href:'/pdf-page-manager', tier:'free', Icon:Layers,   bg:'#f97316' },
      { name:'Extract Pages', href:'/extract-pages',    tier:'free', Icon:Scissors, bg:'#0891b2' },
      { name:'Delete Pages',  href:'/delete-pages',     tier:'free', Icon:Trash2,   bg:'#dc2626' },
    ],
  },
]

const NAV_TIER_LABEL = {
  free: { label:'Free',       bg:'rgba(22,163,74,.1)',  color:'#15803d' },
  ai:   { label:'5 free/day', bg:'rgba(124,58,237,.1)', color:'#7c3aed' },
  pro:  { label:'Pro',        bg:'rgba(8,145,178,.1)',  color:'#0e7490' },
}

const NAV_LINKS = [
  { label:'AI Tools', href:'/#tools' },
  { label:'Pricing',  href:'/pricing' },
]

function Nav() {
  const { isSignedIn, isLoaded } = useUser()
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobOpen,   setMobOpen]   = useState(false)
  const [mobToolsExp, setMobToolsExp] = useState(false)
  const [mobCatOpen, setMobCatOpen] = useState<string|null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>|null>(null)

  const openMenu  = () => { clearTimeout(closeTimer.current!); setToolsOpen(true) }
  const closeMenu = () => { closeTimer.current = setTimeout(()=>setToolsOpen(false), 120) }
  const keepMenu  = () => { clearTimeout(closeTimer.current!) }

  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY,[0,80],['rgba(255,255,255,0)','rgba(255,255,255,0.96)'])

  return (
    <>
      {/* Fixed header */}
      <motion.header style={{position:'fixed',inset:'0 0 auto',zIndex:300,height:56,
        background:navBg,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(0,0,0,.07)'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 20px',height:'100%',
          display:'flex',alignItems:'center'}}>

          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',textDecoration:'none',marginRight:28,flexShrink:0}}>
            <img src="/logo.png" alt="EditPDF AI" style={{height:48,width:'auto',display:'block'}} />
          </Link>

          {/* Desktop nav */}
          <nav className="desk" style={{alignItems:'center',gap:2,flex:1}}>

            {/* Tools dropdown trigger */}
            <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{position:'relative'}}>
              <button
                onClick={()=>setToolsOpen(v=>!v)}
                style={{
                  display:'flex',alignItems:'center',gap:4,
                  padding:'5px 11px',background:toolsOpen?'rgba(0,0,0,.05)':'transparent',
                  border:'none',borderRadius:8,cursor:'pointer',outline:'none',
                  fontSize:13,fontWeight:toolsOpen?600:500,
                  color:toolsOpen?'#1d1d1f':'rgba(0,0,0,.55)',
                  ...FI,transition:'all .12s',flexShrink:0,
                }}>
                Tools
                <motion.span style={{display:'flex',alignItems:'center',opacity:.6}}
                  animate={{rotate:toolsOpen?180:0}} transition={{duration:.14}}>
                  <ChevronDown size={11} strokeWidth={2.5}/>
                </motion.span>
              </button>
            </div>

            {/* Plain links */}
            {NAV_LINKS.map(({label,href})=>(
              <Link key={label} href={href} style={{textDecoration:'none'}}>
                <motion.span whileHover={{color:'#1d1d1f'}}
                  style={{...FI,display:'inline-flex',alignItems:'center',gap:4,
                    padding:'5px 11px',fontSize:13,fontWeight:500,borderRadius:8,
                    color:'rgba(0,0,0,.52)'}}>
                  {label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* CTA + auth + mobile toggle */}
          <div style={{display:'flex',alignItems:'center',gap:8,marginLeft:'auto',flexShrink:0}}>
            {isLoaded && (
              isSignedIn ? (
                <div className="desk" style={{display:'flex',alignItems:'center',gap:8}}>
                  <Link href="/dashboard"
                    style={{...FI,fontSize:12.5,fontWeight:700,color:'#1d1d1f',
                      textDecoration:'none',padding:'6px 14px',borderRadius:99,
                      border:'1.5px solid rgba(0,0,0,.16)',background:'#fff',
                      letterSpacing:'-0.02em',display:'flex',alignItems:'center',gap:5}}>
                    Dashboard
                  </Link>
                  <UserButton/>
                </div>
              ) : (
                <div className="desk" style={{display:'flex',alignItems:'center',gap:6}}>
                  <SignInButton mode="modal">
                    <button style={{...FI,fontSize:12.5,fontWeight:700,color:'#1d1d1f',
                      background:'#fff',border:'1.5px solid rgba(0,0,0,.16)',
                      padding:'6px 14px',borderRadius:99,cursor:'pointer',
                      letterSpacing:'-0.02em',transition:'all .15s'}}>
                      Sign in
                    </button>
                  </SignInButton>
                </div>
              )
            )}
            <Link href="/pdf-editor" className="desk"
              style={{...FI,alignItems:'center',gap:6,padding:'7px 16px',
                background:'#1d1d1f',color:'#fff',borderRadius:99,fontSize:12.5,fontWeight:700,
                textDecoration:'none',letterSpacing:'-0.02em',flexShrink:0}}>
              <motion.span style={{display:'flex',alignItems:'center',gap:6}}
                whileHover={{gap:10}} transition={SP}>
                <Upload size={12} strokeWidth={2.5}/> Open Editor
              </motion.span>
            </Link>
            <button className="mob" onClick={()=>setMobOpen(o=>!o)}
              aria-label={mobOpen?'Close menu':'Open menu'}
              style={{width:44,height:44,borderRadius:10,border:'1.5px solid rgba(0,0,0,.12)',
                background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',
                cursor:'pointer',flexShrink:0,
                WebkitTapHighlightColor:'transparent',touchAction:'manipulation'}}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mobOpen?'x':'m'}
                  initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}}
                  exit={{rotate:90,opacity:0}} transition={{duration:.15}}>
                  {mobOpen?<X size={18} color="#1d1d1f" strokeWidth={2}/>:<Menu size={18} color="#1d1d1f" strokeWidth={2}/>}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Tools dropdown */}
      <AnimatePresence>
        {toolsOpen && (
          <>
            <motion.div
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.15}}
              onClick={()=>setToolsOpen(false)}
              style={{position:'fixed',inset:'56px 0 0',zIndex:298,
                background:'rgba(0,0,0,.18)',backdropFilter:'blur(2px)'}}
            />
            <motion.div
              initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
              transition={{duration:.18,ease:[.22,1,.36,1]}}
              onMouseEnter={keepMenu} onMouseLeave={closeMenu}
              style={{position:'fixed',top:56,left:0,right:0,zIndex:299,
                background:'#fff',borderBottom:'1px solid rgba(0,0,0,.07)',
                boxShadow:'0 16px 48px rgba(0,0,0,.1)'}}>
              <div style={{maxWidth:1280,margin:'0 auto',padding:'20px 24px 20px'}}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:4}}>
                  {NAV_CATS.map(cat=>(
                    <div key={cat.label}>
                      <Link href={cat.href} onClick={()=>setToolsOpen(false)} style={{textDecoration:'none'}}>
                        <div style={{display:'flex',alignItems:'center',gap:7,
                          padding:'6px 8px 8px',marginBottom:4,
                          borderBottom:`2px solid ${cat.color}22`}}>
                          <div style={{width:24,height:24,borderRadius:7,background:`${cat.color}14`,
                            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <cat.Icon size={12} color={cat.color} strokeWidth={2}/>
                          </div>
                          <span style={{...FI,fontSize:11.5,fontWeight:800,color:cat.color,letterSpacing:'-0.01em'}}>{cat.label}</span>
                        </div>
                      </Link>
                      {cat.tools.map(tool=>{
                        const badge = NAV_TIER_LABEL[tool.tier]
                        return (
                          <Link key={tool.name} href={tool.href} onClick={()=>setToolsOpen(false)} style={{textDecoration:'none'}}>
                            <motion.div whileHover={{background:'#f5f5f7'}} transition={{duration:.1}}
                              style={{display:'flex',alignItems:'center',gap:8,
                                padding:'5px 8px',borderRadius:8,cursor:'pointer'}}>
                              <div style={{width:26,height:26,borderRadius:7,background:tool.bg,
                                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                <tool.Icon size={13} color="#fff" strokeWidth={1.8}/>
                              </div>
                              <span style={{...FI,fontSize:12,fontWeight:600,color:'#1d1d1f',
                                flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{tool.name}</span>
                              {tool.tier!=='free'&&(
                                <span style={{fontSize:8.5,fontWeight:700,letterSpacing:'0.04em',
                                  padding:'1.5px 5px',borderRadius:99,
                                  background:badge.bg,color:badge.color,whiteSpace:'nowrap',flexShrink:0}}>
                                  {badge.label}
                                </span>
                              )}
                            </motion.div>
                          </Link>
                        )
                      })}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12,paddingTop:10,borderTop:'1px solid #f0f0f0',
                  display:'flex',justifyContent:'flex-end'}}>
                  <Link href="#tools" onClick={()=>setToolsOpen(false)}
                    style={{...FI,display:'flex',alignItems:'center',gap:5,
                      fontSize:12,fontWeight:600,color:'#6b7280',textDecoration:'none'}}>
                    See all 35+ tools <ArrowRight size={11} strokeWidth={2.5}/>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={()=>{ setMobOpen(false); setMobToolsExp(false); setMobCatOpen(null) }}
              style={{position:'fixed',inset:'56px 0 0',zIndex:280,background:'rgba(0,0,0,.3)'}}
            />

            {/* Panel */}
            <motion.div
              initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
              transition={{duration:.25,ease:E}}
              style={{position:'fixed',top:56,right:0,bottom:0,width:'100%',maxWidth:360,
                zIndex:290,background:'#fff',display:'flex',flexDirection:'column',
                overflowY:'auto',WebkitOverflowScrolling:'touch',overscrollBehavior:'contain'}}>

              {/* Tools section */}
              <div style={{borderBottom:'1px solid #f0f0f0'}}>
                <button
                  onClick={()=>setMobToolsExp(v=>!v)}
                  style={{width:'100%',display:'flex',alignItems:'center',height:52,
                    padding:'0 20px',background:'transparent',border:'none',cursor:'pointer',
                    WebkitTapHighlightColor:'transparent',touchAction:'manipulation'}}>
                  <span style={{...FI,fontSize:15,fontWeight:700,color:'#1d1d1f',flex:1,textAlign:'left'}}>Tools</span>
                  <span style={{display:'flex',transition:'transform .2s',transform:mobToolsExp?'rotate(180deg)':'rotate(0deg)'}}>
                    <ChevronDown size={18} color="rgba(0,0,0,.4)" strokeWidth={2}/>
                  </span>
                </button>

                {/* Animated tools panel */}
                <div style={{overflow:'hidden',maxHeight:mobToolsExp?2000:0,transition:'max-height .3s ease'}}>
                  <div style={{background:'#f9fafb',borderTop:'1px solid #f0f0f0'}}>
                    {NAV_CATS.map(cat=>(
                      <div key={cat.label} style={{borderBottom:'1px solid #f0f0f0'}}>
                        {/* Category row */}
                        <button
                          onClick={()=>setMobCatOpen(v=>v===cat.label?null:cat.label)}
                          style={{width:'100%',display:'flex',alignItems:'center',gap:12,
                            height:52,padding:'0 20px',background:'transparent',border:'none',
                            cursor:'pointer',WebkitTapHighlightColor:'transparent',touchAction:'manipulation'}}>
                          <div style={{width:34,height:34,borderRadius:10,background:`${cat.color}15`,
                            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <cat.Icon size={16} color={cat.color} strokeWidth={1.9}/>
                          </div>
                          <span style={{...FI,fontSize:14,fontWeight:700,color:cat.color,flex:1,textAlign:'left'}}>{cat.label}</span>
                          <span style={{display:'flex',transition:'transform .2s',transform:mobCatOpen===cat.label?'rotate(180deg)':'rotate(0deg)'}}>
                            <ChevronDown size={16} color="rgba(0,0,0,.3)" strokeWidth={2}/>
                          </span>
                        </button>

                        {/* Tools list */}
                        <div style={{overflow:'hidden',maxHeight:mobCatOpen===cat.label?1000:0,transition:'max-height .25s ease',background:'#fff'}}>
                          {cat.tools.map(tool=>{
                            const badge = NAV_TIER_LABEL[tool.tier]
                            return (
                              <Link key={tool.name} href={tool.href} onClick={()=>{ setMobOpen(false); setMobToolsExp(false); setMobCatOpen(null) }} style={{textDecoration:'none',display:'block'}}>
                                <div style={{display:'flex',alignItems:'center',gap:12,
                                  height:52,padding:'0 20px 0 24px',
                                  borderTop:'1px solid #f5f6f8',
                                  WebkitTapHighlightColor:'transparent',touchAction:'manipulation'}}>
                                  <div style={{width:32,height:32,borderRadius:9,background:tool.bg,
                                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                    <tool.Icon size={15} color="#fff" strokeWidth={1.8}/>
                                  </div>
                                  <span style={{...FI,fontSize:14,fontWeight:600,color:'#1d1d1f',flex:1}}>{tool.name}</span>
                                  {tool.tier!=='free'&&(
                                    <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:99,background:badge.bg,color:badge.color,flexShrink:0}}>
                                      {badge.label}
                                    </span>
                                  )}
                                  <ArrowRight size={14} color="rgba(0,0,0,.2)" strokeWidth={2}/>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))}

                    {/* See all */}
                    <Link href="/#tools" onClick={()=>setMobOpen(false)} style={{textDecoration:'none',display:'block'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                        height:48,...FI,fontSize:13,fontWeight:700,color:'#2563eb'}}>
                        See all 35+ tools <ArrowRight size={13} strokeWidth={2.5}/>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Plain links */}
              {NAV_LINKS.map(({label,href})=>(
                <Link key={label} href={href} onClick={()=>setMobOpen(false)} style={{textDecoration:'none',display:'block'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,height:52,padding:'0 20px',
                    borderBottom:'1px solid #f0f0f0',...FI,fontSize:15,fontWeight:600,
                    color:'#1d1d1f',WebkitTapHighlightColor:'transparent'}}>
                    {label}
                  </div>
                </Link>
              ))}

              {/* Auth */}
              {isLoaded && (
                <div style={{padding:'16px 20px',borderBottom:'1px solid #f0f0f0'}}>
                  {isSignedIn ? (
                    <Link href="/dashboard" onClick={()=>setMobOpen(false)}
                      style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                        fontSize:15,fontWeight:700,color:'#1d1d1f',textDecoration:'none',
                        padding:'13px',borderRadius:12,border:'1.5px solid #e5e7eb',background:'#fff'}}>
                      Dashboard
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <button style={{...FI,width:'100%',padding:'13px',borderRadius:12,
                        border:'1.5px solid #e5e7eb',background:'#fff',
                        fontSize:15,fontWeight:700,color:'#1d1d1f',cursor:'pointer',
                        WebkitTapHighlightColor:'transparent'}}>
                        Sign in
                      </button>
                    </SignInButton>
                  )}
                </div>
              )}

              {/* Open Editor CTA */}
              <div style={{padding:'16px 20px',marginTop:'auto'}}>
                <Link href="/pdf-editor" onClick={()=>setMobOpen(false)}
                  style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                    padding:'16px',background:'#1d1d1f',color:'#fff',borderRadius:14,
                    fontSize:15,fontWeight:700,textDecoration:'none',letterSpacing:'-0.02em'}}>
                  <Upload size={16} strokeWidth={2.5}/> Open Editor
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  HERO — split: text left · browser mockup right
// ══════════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section style={{background:'#fff',minHeight:'100svh',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:54}}>

      {/* Dot grid */}
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(0,0,0,.04) 1px, transparent 1px)',backgroundSize:'36px 36px',pointerEvents:'none'}}/>

      {/* Ambient glows */}
      <div style={{position:'absolute',top:'-20%',left:'-10%',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle, rgba(226,75,74,.10) 0%, transparent 70%)',filter:'blur(80px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-15%',right:'-5%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle, rgba(99,102,241,.07) 0%, transparent 70%)',filter:'blur(80px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'30%',right:'20%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle, rgba(226,75,74,.05) 0%, transparent 70%)',filter:'blur(60px)',pointerEvents:'none'}}/>

      {/* Content grid */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(16px,5vw,48px)',width:'100%',position:'relative',zIndex:2}}>
        <div className="hero-grid">

          {/* ── LEFT: text ── */}
          <div>
            {/* Eyebrow */}
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.1}}
              style={{display:'flex',alignItems:'center',gap:10,marginBottom:32}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:RED,display:'inline-block',animation:'pdot 2s ease-in-out infinite'}}/>
              <span style={{...MONO,fontSize:10.5,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase'}}>AI PDF Platform · Free Tools · No Account Needed</span>
            </motion.div>

            {/* Headline — SEO-optimised H1 */}
            <motion.h1 variants={MV} initial="hidden" animate="visible"
              style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(34px,4.8vw,76px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 24px'}}>
              <span style={{display:'block',overflow:'hidden'}}>
                <motion.span style={{display:'block'}} variants={WV}>Free Online PDF Editor</motion.span>
              </span>
              <span style={{display:'block',overflow:'hidden',marginTop:'0.1em'}}>
                <motion.span style={{display:'inline-flex',flexWrap:'wrap',gap:'0 .22em'}} variants={WV}>
                  {['Edit,','Sign,','Fill','&','Convert'].map((w,i)=>(
                    <span key={i}>{w}</span>
                  ))}
                  <span className="grad-red">PDFs</span>
                </motion.span>
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.7}}
              style={{...FI,fontSize:'clamp(15px,1.6vw,18px)',color:'#6E6E73',lineHeight:1.65,maxWidth:400,margin:'0 0 32px',letterSpacing:'-0.01em',fontWeight:400}}>
              Edit, sign, compress, merge, convert and fill PDFs online. Free tools need no account — sign in for unlimited AI.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.85}}
              className="hero-ctas">
              <Mag>
                <Link href="/pdf-editor"
                  style={{...FI,display:'inline-flex',alignItems:'center',gap:10,padding:'16px 32px',background:RED,color:'#fff',borderRadius:99,fontSize:16,fontWeight:800,textDecoration:'none',letterSpacing:'-0.025em',boxShadow:`0 6px 32px ${RED}55`}}>
                  <motion.span style={{display:'flex',alignItems:'center',gap:10}} whileHover={{gap:16}} transition={SP}>
                    <Upload size={16} strokeWidth={2.5}/> Upload PDF
                  </motion.span>
                </Link>
              </Mag>
              <Mag>
                <a href="#tools"
                  style={{...FI,display:'inline-flex',alignItems:'center',gap:6,padding:'14px 22px',background:'transparent',color:'rgba(0,0,0,.5)',border:'1px solid rgba(0,0,0,.12)',borderRadius:99,fontSize:15,fontWeight:500,textDecoration:'none',letterSpacing:'-0.01em'}}>
                  Explore Tools <ChevronRight size={14} strokeWidth={2}/>
                </a>
              </Mag>
            </motion.div>

            {/* Trust row */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,delay:1.05}}
              className="hero-trust">
              {[
                { icon:<CheckCircle2 size={12} color="#16a34a" strokeWidth={2.5}/>, label:'35+ Free tools' },
                { icon:<Shield size={12} color="#0891b2" strokeWidth={2.5}/>, label:'Browser-based · private' },
                { icon:<Sparkles size={12} color="#7c3aed" strokeWidth={2.5}/>, label:'AI: 5 free uses/day' },
              ].map(({icon,label},i)=>(
                <span key={label} style={{display:'flex',alignItems:'center',gap:5}}>
                  {i>0&&<span style={{width:3,height:3,borderRadius:'50%',background:'#ddd',display:'inline-block',marginRight:2}}/>}
                  {icon}
                  <span style={{...MONO,fontSize:10,color:'rgba(0,0,0,.42)',letterSpacing:'0.05em',textTransform:'uppercase'}}>{label}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: browser mockup with floating chips ── */}
          <div className="hero-visual" style={{position:'relative',overflow:'visible'}}>
            {/* Glow behind frame */}
            <div style={{position:'absolute',inset:-60,background:'radial-gradient(ellipse, rgba(226,75,74,.08) 0%, rgba(99,102,241,.06) 50%, transparent 70%)',filter:'blur(40px)',pointerEvents:'none'}}/>

            {/* Feature chips */}
            {([
              { label:'AI Summarize', Icon:Sparkles,  color:'#7c3aed', delay:1.0, pos:{ top:'-16px',  left:'-20px'  } },
              { label:'E-Sign',       Icon:PenLine,   color:RED,       delay:1.2, pos:{ bottom:'70px', left:'-24px'  } },
              { label:'PDF → Word',   Icon:FileType,  color:'#2563eb', delay:1.4, pos:{ top:'38%',     right:'-22px' } },
            ] as const).map(({label,Icon,color,delay,pos})=>(
              <motion.div key={label}
                initial={{opacity:0,scale:0.8,y:8}} animate={{opacity:1,scale:1,y:0}}
                transition={{duration:.45,ease:[0.22,1,0.36,1] as [number,number,number,number],delay}}
                style={{position:'absolute',display:'flex',alignItems:'center',gap:6,padding:'7px 12px',
                  background:'#fff',borderRadius:99,boxShadow:'0 4px 16px rgba(0,0,0,.08)',
                  border:'1px solid #f0f0f0',...FI,fontSize:11,fontWeight:600,color,
                  whiteSpace:'nowrap',zIndex:10,...pos}}>
                <Icon size={12} strokeWidth={2.5} color={color}/>
                {label}
              </motion.div>
            ))}

            {/* Browser — entry animation + infinite float */}
            <motion.div
              initial={{opacity:0,x:40,scale:0.96}}
              animate={{opacity:1,x:0,scale:1}}
              transition={{duration:.75,ease:[0.22,1,0.36,1],delay:.5}}>
              <motion.div animate={{y:[0,-10,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}>
                <Tilt><BrowserUI /></Tilt>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,delay:1.2}}
        style={{position:'absolute',bottom:0,left:0,right:0,height:44,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',borderTop:'1px solid rgba(0,0,0,.06)',zIndex:3}}>
        <div style={{...MONO,fontSize:11,color:'#999',letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:20,height:1,background:'rgba(0,0,0,.15)',display:'inline-block'}}/>
          <ScrollPct/>
        </div>
        <div className="desk" style={{gap:24}}>
          {['35+ Tools','Free PDF Tools','AI: 5/day Free','Pro: Unlimited AI'].map(t=>(
            <span key={t} style={{...MONO,fontSize:10,color:'#bbb',letterSpacing:'0.08em',textTransform:'uppercase'}}>{t}</span>
          ))}
        </div>
        <span style={{...MONO,fontSize:10,color:'#bbb',letterSpacing:'0.08em',textTransform:'uppercase'}}>Popular tools below</span>
      </motion.div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
//  SCROLL GALLERY SCREENS — all light/white
// ══════════════════════════════════════════════════════════════════════════════
function ScreenDrop() {
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{textAlign:'center',width:'100%',maxWidth:400}}>
        <motion.div
          animate={{borderColor:['rgba(99,102,241,.2)','rgba(99,102,241,.6)','rgba(99,102,241,.2)'],background:['rgba(99,102,241,.02)','rgba(99,102,241,.06)','rgba(99,102,241,.02)']}}
          transition={{duration:2.4,repeat:Infinity,ease:'easeInOut'}}
          style={{border:'2px dashed rgba(99,102,241,.3)',borderRadius:20,padding:'44px 32px',marginBottom:20}}>
          <motion.div animate={{y:[0,-5,0]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut'}}
            style={{width:56,height:56,borderRadius:16,background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.18)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
            <Upload size={24} color="#818cf8" strokeWidth={1.5}/>
          </motion.div>
          <div style={{...FI,fontSize:17,fontWeight:600,color:'#1d1d1f',marginBottom:7,letterSpacing:'-0.02em'}}>Drop your PDF here</div>
          <div style={{...FI,fontSize:13,color:'#6E6E73',marginBottom:24,lineHeight:1.6}}>or click to browse · up to 100 MB · stays in your browser</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 26px',background:'#6366f1',borderRadius:99,fontSize:13,fontWeight:600,color:'#fff',cursor:'default'}}>
            <Upload size={13} strokeWidth={2}/> Choose PDF File
          </div>
        </motion.div>
        <div style={{...MONO,fontSize:9,color:'#bbb',letterSpacing:'0.1em',textTransform:'uppercase'}}>PDF · Up to 100 MB · Runs in your browser</div>
      </div>
    </div>
  )
}

function ScreenAI() {
  const aiTools = [
    { Icon:Sparkles,     label:'AI Summarize',  color:'#7c3aed', delay:0    },
    { Icon:FormInput,    label:'Form Autofill',  color:'#0891b2', delay:.12  },
    { Icon:ScanText,     label:'OCR Scanner',    color:'#16a34a', delay:.24  },
    { Icon:Languages,    label:'AI Translate',   color:'#f97316', delay:.36  },
    { Icon:BrainCircuit, label:'Mind Map',        color:RED,       delay:.48  },
  ]
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:'20px 18px',boxShadow:'0 8px 32px rgba(0,0,0,.10)',border:'1px solid #e8e8e8'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#7c3aed,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Sparkles size={12} color="#fff" strokeWidth={2}/>
          </div>
          <span style={{...FI,fontSize:12,fontWeight:700,color:'#1d1d1f'}}>AI Tools</span>
          <div style={{marginLeft:'auto',display:'flex',gap:3}}>
            {[0,1,2].map(i=>(
              <motion.div key={i} animate={{opacity:[.3,1,.3]}} transition={{duration:1.2,delay:i*.2,repeat:Infinity}}
                style={{width:4,height:4,borderRadius:'50%',background:'#7c3aed'}}/>
            ))}
          </div>
        </div>
        <div style={{height:1,background:'#f0f0f0',marginBottom:10}}/>
        {aiTools.map(({Icon,label,color,delay})=>(
          <motion.div key={label}
            initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
            transition={{delay,duration:.35}}
            style={{display:'flex',alignItems:'center',gap:9,padding:'7px 10px',borderRadius:8,background:`${color}06`,border:`1px solid ${color}18`,marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:6,background:`${color}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Icon size={11} color={color} strokeWidth={2}/>
            </div>
            <span style={{...FI,fontSize:11,fontWeight:600,color:'#374151'}}>{label}</span>
            <motion.span animate={{opacity:[.5,1,.5]}} transition={{duration:1.4,delay,repeat:Infinity}}
              style={{marginLeft:'auto',...MONO,fontSize:8.5,color,letterSpacing:'0.05em'}}>READY</motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ScreenEditSign() {
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:'20px 18px',boxShadow:'0 8px 32px rgba(0,0,0,.10)',border:'1px solid #e8e8e8'}}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:14,padding:'7px 10px',background:'#f9fafb',borderRadius:10,border:'1px solid #f0f0f0'}}>
          {[
            {Icon:MousePointer2,color:'#6366f1',active:true},
            {Icon:FileText,color:'#374151',active:false},
            {Icon:PenLine,color:'#374151',active:false},
            {Icon:Layers,color:'#374151',active:false},
          ].map(({Icon,color,active},i)=>(
            <div key={i} style={{width:26,height:26,borderRadius:6,background:active?'rgba(99,102,241,.08)':'transparent',border:active?'1px solid rgba(99,102,241,.2)':'1px solid transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icon size={12} color={active?'#6366f1':color} strokeWidth={2}/>
            </div>
          ))}
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 8px',background:'rgba(226,75,74,.07)',border:'1px solid rgba(226,75,74,.18)',borderRadius:99}}>
            <PenTool size={8} color={RED} strokeWidth={2}/>
            <span style={{...MONO,fontSize:8,color:RED,letterSpacing:'0.06em'}}>SIGN</span>
          </div>
        </div>
        {[100,85,92,70,88,60].map((w,i)=>(
          <motion.div key={i}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.07}}
            style={{height:8,borderRadius:99,background:i===2?'rgba(99,102,241,.18)':'#f0f0f0',width:`${w}%`,marginBottom:8,
              boxShadow:i===2?'0 0 0 2px rgba(99,102,241,.1)':'none'}}/>
        ))}
        <div style={{marginTop:12,padding:'9px 12px',border:'1px dashed #e4e4e7',borderRadius:8,background:'#fafafa'}}>
          <div style={{fontSize:7,color:'#bbb',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Signature</div>
          <svg width="140" height="24" viewBox="0 0 140 24" fill="none">
            <path d="M6 16 C16 4 24 20 34 12 C44 4 56 18 68 9 C79 2 90 16 100 9 C109 3 120 15 130 11"
              stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="400"
              style={{animation:'sigdraw 3.5s ease-in-out infinite'}}/>
          </svg>
        </div>
      </div>
    </div>
  )
}

function ScreenExport() {
  const formats = [
    { label:'PDF → Word',   ext:'DOCX', color:'#2563eb', Icon:FileType        },
    { label:'PDF → Excel',  ext:'XLSX', color:'#16a34a', Icon:FileSpreadsheet },
    { label:'Compress PDF', ext:'PDF',  color:'#f97316', Icon:Minimize2       },
    { label:'Merge PDFs',   ext:'PDF',  color:'#7c3aed', Icon:Merge           },
  ]
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:'20px 18px',boxShadow:'0 8px 32px rgba(0,0,0,.10)',border:'1px solid #e8e8e8'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <Download size={14} color="#22c55e" strokeWidth={2}/>
          <span style={{...FI,fontSize:12,fontWeight:700,color:'#1d1d1f'}}>Export & Convert</span>
        </div>
        <div style={{height:1,background:'#f0f0f0',marginBottom:10}}/>
        {formats.map(({label,ext,color,Icon},i)=>(
          <motion.div key={label}
            initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
            transition={{delay:i*.1,duration:.35}}
            style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:9,border:`1px solid ${color}18`,background:`${color}05`,marginBottom:8}}>
            <div style={{width:28,height:28,borderRadius:7,background:`${color}12`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Icon size={13} color={color} strokeWidth={2}/>
            </div>
            <span style={{...FI,fontSize:11,fontWeight:600,color:'#374151'}}>{label}</span>
            <span style={{marginLeft:'auto',...MONO,fontSize:8.5,color,background:`${color}12`,padding:'2px 6px',borderRadius:4}}>{ext}</span>
          </motion.div>
        ))}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}
          style={{marginTop:4,height:36,background:'#22c55e',borderRadius:99,display:'flex',alignItems:'center',justifyContent:'center',gap:7,boxShadow:'0 4px 14px rgba(34,197,94,.25)'}}>
          <Download size={13} color="#fff" strokeWidth={2.5}/>
          <span style={{...FI,fontSize:12,color:'#fff',fontWeight:700}}>Download</span>
        </motion.div>
      </div>
    </div>
  )
}

const GSTEPS = [
  { n:'01', color:'#818cf8', label:'Upload',      headline:'Upload your PDF',           body:'Upload most PDFs instantly. Drag it in or click to browse — no account needed.',   Screen:ScreenDrop     },
  { n:'02', color:'#a78bfa', label:'AI Tools',    headline:'Use AI tools instantly',    body:'Summarize, fill forms, OCR scan, translate, and more — all AI-powered.',            Screen:ScreenAI       },
  { n:'03', color:RED,       label:'Edit & Sign', headline:'Edit, annotate, or sign',   body:'Add text, highlights, comments, and your e-signature in seconds.',                   Screen:ScreenEditSign },
  { n:'04', color:'#22c55e', label:'Export',      headline:'Download your file',         body:'Convert to Word, Excel, or compress. Your finished file is ready to download.',  Screen:ScreenExport   },
]

// ══════════════════════════════════════════════════════════════════════════════
//  HOW IT WORKS — static 4-card (crawlable by search engines)
// ══════════════════════════════════════════════════════════════════════════════
function HowItWorks() {
  const steps = [
    {
      n: '01', color: '#6366f1', bg: 'rgba(99,102,241,.08)',
      Icon: Upload,
      title: 'Upload your document',
      desc: 'Drag and drop any PDF or click to browse. No account needed — your file opens instantly in the browser.',
    },
    {
      n: '02', color: '#7c3aed', bg: 'rgba(124,58,237,.08)',
      Icon: Sparkles,
      title: 'Choose a PDF or AI tool',
      desc: 'Pick from 35+ tools — edit text, compress, merge, OCR scan, translate, summarise, or auto-fill a form with AI.',
    },
    {
      n: '03', color: RED, bg: 'rgba(226,75,74,.08)',
      Icon: PenTool,
      title: 'Edit, fill, sign or convert',
      desc: 'Make changes directly in your browser. Add text, annotations, or a digital signature. Convert to Word, Excel and more.',
    },
    {
      n: '04', color: '#16a34a', bg: 'rgba(22,163,74,.08)',
      Icon: Download,
      title: 'Download securely',
      desc: 'Your finished PDF is ready in seconds. Download it, share a link, or continue editing — all for free.',
    },
  ]

  return (
    <section style={{background:'#fff', padding:'80px 28px 72px', borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>

        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:48, textAlign:'center'}}>
          <div style={{...MONO, fontSize:10, color:'rgba(0,0,0,.35)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14}}>
            How it works
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)', fontSize:'clamp(26px,3.5vw,44px)', fontWeight:800, color:'#1d1d1f', letterSpacing:'-0.05em', lineHeight:.97, margin:'0 0 12px'}}>
            Four simple steps
          </h2>
          <p style={{...FI, fontSize:15, color:'#6b7280', margin:'0 auto', maxWidth:420, lineHeight:1.65}}>
            From upload to download — everything runs in your browser, no install required.
          </p>
        </motion.div>

        {/* Static cards — always in the DOM for crawlers */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16}}>
          {steps.map(({n,color,bg,Icon,title,desc},i) => (
            <motion.div key={n}
              initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'60px'}} transition={{duration:.4,delay:i*.07,ease:E}}
              style={{background:'#fafafa', border:'1.5px solid #eeeeee', borderRadius:20,
                padding:'24px 20px 22px', display:'flex', flexDirection:'column', gap:14, position:'relative'}}>

              {/* Step number — decorative */}
              <span style={{position:'absolute',top:16,right:18,...MONO,fontSize:11,fontWeight:800,
                color:'rgba(0,0,0,.08)',letterSpacing:'0.06em'}}>
                {n}
              </span>

              {/* Icon */}
              <div style={{width:46,height:46,borderRadius:13,background:bg,
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={22} color={color} strokeWidth={1.8}/>
              </div>

              {/* Text */}
              <div>
                <div style={{...FI,fontSize:15,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.03em',marginBottom:6,lineHeight:1.25}}>
                  {title}
                </div>
                <p style={{...FI,fontSize:13,color:'#6b7280',lineHeight:1.65,margin:0}}>
                  {desc}
                </p>
              </div>

              {/* Connector arrow (hidden on last card) */}
              {i < steps.length - 1 && (
                <div style={{position:'absolute',top:'50%',right:-12,transform:'translateY(-50%)',
                  width:20,height:20,borderRadius:'50%',background:'#fff',border:'1.5px solid #e5e7eb',
                  display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>
                  <ChevronRight size={11} color="#9ca3af" strokeWidth={2.5}/>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Link to interactive walkthrough */}
        <div style={{textAlign:'center',marginTop:28}}>
          <button onClick={()=>document.getElementById('how-it-works-detail')?.scrollIntoView({behavior:'smooth'})}
            style={{...FI,background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#9ca3af',fontWeight:500,display:'inline-flex',alignItems:'center',gap:5}}>
            See detailed walkthrough below <ChevronDown size={13} strokeWidth={2}/>
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Scroll gallery ─────────────────────────────────────────────────────────────
function Apple3DScroll() {
  const pin = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  // useScroll reads from the compositor thread — no getBoundingClientRect, no layout thrashing
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })

  // step only changes at 3 thresholds — throttle to one setState per animation frame
  useEffect(() => {
    let rafId = 0
    const unsub = scrollYProgress.on('change', p => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const next = p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3
        setStep(prev => prev === next ? prev : next)
      })
    })
    return () => { unsub(); cancelAnimationFrame(rafId) }
  }, [scrollYProgress])

  // Motion values — drive DOM directly, zero React re-renders
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const barWidth    = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const cur = GSTEPS[step]
  const ScreenComp = cur.Screen

  return (
    <>
      {/* Section intro — scrolls normally before sticky activates */}
      <div id="how-it-works-detail" className="sec-pad" style={{maxWidth:1200,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.55,ease:E}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:16}}>How it works</div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(28px,4vw,56px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.96,margin:0}}>
            How it works.<br/><span style={{color:'#bbb'}}>Four simple steps.</span>
          </h2>
        </motion.div>
      </div>

      <div ref={pin} style={{height:'400vh',position:'relative',overscrollBehavior:'none'}}>
      <div className="scr-sticky" style={{top:0,height:'100vh',background:'#F5F5F7',overflow:'hidden',display:'flex',flexDirection:'column'}}>

        {/* Dot grid */}
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(0,0,0,.03) 1px,transparent 1px)',backgroundSize:'32px 32px',pointerEvents:'none'}}/>

        {/* Per-step colour atmosphere */}
        {GSTEPS.map((s,i)=>(
          <motion.div key={i} animate={{opacity:i===step?1:0}} transition={{duration:.5}}
            style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 65% 75% at 65% 50%, ${s.color}1a 0%, transparent 70%)`,pointerEvents:'none'}}/>
        ))}

        {/* Content row */}
        <div className="scr-row" style={{flex:1,display:'flex',alignItems:'center',gap:56,maxWidth:1200,margin:'0 auto',padding:'0 48px',width:'100%'}}>

          {/* LEFT: step indicators + text */}
          <div className="scr-left" style={{width:300,flexShrink:0,position:'relative'}}>

            {/* Ghost step number */}
            <AnimatePresence mode="sync">
              <motion.div key={`ghost-${step}`}
                initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                transition={{duration:.25}}
                style={{position:'absolute',top:-40,left:-8,zIndex:0,fontFamily:'var(--font-jakarta,system-ui)',
                  fontSize:180,fontWeight:800,color:'rgba(0,0,0,.04)',lineHeight:1,
                  letterSpacing:'-0.06em',userSelect:'none',pointerEvents:'none'}}>
                {cur.n}
              </motion.div>
            </AnimatePresence>

            <div style={{position:'relative',zIndex:1}}>
            <div className="scr-dots" style={{display:'flex',gap:7,marginBottom:40}}>
              {GSTEPS.map((s,i)=>(
                <motion.div key={i}
                  animate={{width:i===step?28:7,background:i===step?s.color:'rgba(0,0,0,.12)'}}
                  style={{height:7,borderRadius:99}}
                  transition={{duration:.38,ease:E}}/>
              ))}
            </div>

            <AnimatePresence mode="sync">
              <motion.div key={step}
                initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:.22,ease:E}}>
                <div style={{...MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase',color:cur.color,marginBottom:10}}>
                  STEP {cur.n} — {cur.label}
                </div>
                <h2 style={{...FI,fontSize:'clamp(28px,5.5vw,72px)',fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.055em',lineHeight:.96,margin:'0 0 12px'}}>
                  {cur.headline}
                </h2>
                <p style={{...FI,fontSize:15,color:'#6E6E73',lineHeight:1.65,maxWidth:260,margin:'0 0 20px',letterSpacing:'-0.005em'}}>
                  {cur.body}
                </p>
                <div className="scr-cta">
                  <Mag>
                    <Link href="/ai-pdf-form-filler"
                      style={{...FI,display:'inline-flex',alignItems:'center',gap:7,fontSize:13,fontWeight:600,color:cur.color,textDecoration:'none',border:`1px solid ${cur.color}40`,padding:'8px 18px',borderRadius:99,background:`${cur.color}08`}}>
                      <motion.span style={{display:'flex',alignItems:'center',gap:7}} whileHover={{gap:12}} transition={SP}>
                        Try free <ArrowRight size={13} strokeWidth={2.5}/>
                      </motion.span>
                    </Link>
                  </Mag>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>{/* end zIndex:1 wrapper */}
          </div>

          {/* RIGHT: browser mockup */}
          <div className="scr-right" style={{flex:1,position:'relative'}}>

            {/* Glow behind frame */}
            {GSTEPS.map((s,i)=>(
              <motion.div key={i} animate={{opacity:i===step?1:0}} transition={{duration:.5}}
                style={{position:'absolute',inset:-48,background:`radial-gradient(ellipse, ${s.color}10 0%, transparent 70%)`,filter:'blur(40px)',pointerEvents:'none'}}/>
            ))}

            <motion.div
              animate={{boxShadow:`0 24px 60px -12px ${cur.color}35, 0 0 0 1px ${cur.color}30`,borderColor:`${cur.color}30`}}
              transition={{duration:.5}}
              style={{borderRadius:16,border:'1px solid transparent',overflow:'hidden',position:'relative',background:'#fff'}}>

              {/* Chrome bar */}
              <div style={{background:'#F5F5F7',borderBottom:'1px solid rgba(0,0,0,.07)',height:32,display:'flex',alignItems:'center',padding:'0 12px',gap:8}}>
                <div style={{display:'flex',gap:4}}>
                  {['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{width:8,height:8,borderRadius:'50%',background:c}}/>)}
                </div>
                <div className="scr-url" style={{flex:1,display:'flex',justifyContent:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(0,0,0,.05)',borderRadius:5,padding:'2px 10px',minWidth:180}}>
                    <Lock size={7} color="rgba(0,0,0,.35)" strokeWidth={2}/>
                    <span style={{...MONO,fontSize:9,color:'rgba(0,0,0,.38)'}}>editpdfai.com/ai-pdf-form-filler</span>
                  </div>
                </div>
                <motion.div animate={{background:cur.color}} transition={{duration:.4}}
                  style={{width:6,height:6,borderRadius:'50%',marginLeft:'auto'}}/>
              </div>

              {/* Inner screen */}
              <div className="scr-screen" style={{position:'relative',height:390,overflow:'hidden',background:'#F5F5F7'}}>
                <AnimatePresence mode="sync">
                  <motion.div key={step}
                    initial={{opacity:0,scale:.96}}
                    animate={{opacity:1,scale:1}}
                    exit={{opacity:0,scale:1.02}}
                    transition={{duration:.22,ease:[0.22,1,0.36,1]}}
                    style={{position:'absolute',inset:0}}>
                    <ScreenComp />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section label — replaces scroll hint */}
        <motion.div className="scr-hint" style={{opacity:hintOpacity as any,position:'absolute',bottom:'8%',left:'50%',transform:'translateX(-50%)',pointerEvents:'none'}}>
          <span style={{...MONO,fontSize:9.5,color:'rgba(0,0,0,.28)',letterSpacing:'0.12em',textTransform:'uppercase',whiteSpace:'nowrap'}}>Start with one of our most-used tools</span>
        </motion.div>

        {/* Progress bar */}
        <div style={{height:2,background:'rgba(0,0,0,.05)',flexShrink:0,position:'relative'}}>
          <motion.div style={{position:'absolute',top:0,left:0,bottom:0,width:barWidth,background:cur.color}}/>
        </div>
      </div>
    </div>
    </>
  )
}



// ══════════════════════════════════════════════════════════════════════════════
//  TOOL CARD
// ══════════════════════════════════════════════════════════════════════════════
const TOOL_TIER_BADGE = {
  free: { label:'Free',      bg:'rgba(22,163,74,.1)',  color:'#15803d' },
  ai:   { label:'5 free/day',bg:'rgba(124,58,237,.1)', color:'#7c3aed' },
  pro:  { label:'Pro',       bg:'rgba(8,145,178,.1)',  color:'#0e7490' },
}

function ToolCard({ tool, catColor }: { tool: typeof TOOLS[0]; catColor: string }) {
  const isLive = tool.tag === 'LIVE' && !!tool.href
  const Icon = tool.Icon
  const badge = TOOL_TIER_BADGE[tool.tier]
  const card = (
    <motion.div
      whileHover={{ y:-4, boxShadow:`0 16px 40px rgba(0,0,0,.10), 0 0 0 1.5px ${catColor}30` }}
      transition={{ duration:.18, ease:[.22,1,.36,1] }}
      style={{
        background:'#fff', border:'1.5px solid #e8e8e8', borderRadius:18,
        padding:'20px 18px 18px', display:'flex', flexDirection:'column', gap:10,
        cursor:isLive?'pointer':'default', height:'100%', position:'relative', overflow:'hidden',
        boxShadow:'0 2px 8px rgba(0,0,0,.04)',
      }}>
      {/* Subtle gradient wash */}
      <div style={{position:'absolute',top:0,left:0,width:80,height:80,borderRadius:'0 0 80px 0',
        background:tool.iconBg,opacity:.07,pointerEvents:'none'}}/>

      {/* Icon chip + tier badge row */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:6}}>
        <div style={{
          width:44, height:44, borderRadius:13, background:tool.iconBg, flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 6px 16px ${catColor}28`,
        }}>
          <Icon size={20} color="#fff" strokeWidth={1.8}/>
        </div>
        <span style={{
          ...MONO, fontSize:9, fontWeight:700, letterSpacing:'0.05em',
          padding:'3px 7px', borderRadius:99,
          background:badge.bg, color:badge.color,
          whiteSpace:'nowrap', flexShrink:0,
        }}>
          {badge.label}
        </span>
      </div>

      {/* Text */}
      <div style={{flex:1}}>
        <div style={{...FI, fontSize:13.5, fontWeight:700, color:'#1d1d1f', letterSpacing:'-0.02em', marginBottom:4, lineHeight:1.25}}>
          {tool.name}
        </div>
        <div style={{...FI, fontSize:11.5, color:'#9ca3af', lineHeight:1.5}}>{tool.desc}</div>
      </div>

      {/* Action button */}
      <div style={{
        marginTop:4, padding:'9px 0', borderRadius:10, textAlign:'center',
        background: isLive ? `${catColor}12` : '#f3f4f6',
        border: `1.5px solid ${isLive ? catColor+'28' : '#e5e7eb'}`,
        display:'flex', alignItems:'center', justifyContent:'center', gap:6,
      }}>
        <span style={{...FI, fontSize:12, fontWeight:700, color: isLive ? catColor : '#9ca3af'}}>
          {isLive ? 'Open Tool' : 'Coming Soon'}
        </span>
        {isLive && <ArrowUpRight size={12} color={catColor} strokeWidth={2.5}/>}
      </div>
    </motion.div>
  )
  return isLive
    ? <Link href={tool.href} style={{textDecoration:'none', display:'block', height:'100%'}}>{card}</Link>
    : <div style={{height:'100%'}}>{card}</div>
}

// ══════════════════════════════════════════════════════════════════════════════
//  ALL TOOLS
// ══════════════════════════════════════════════════════════════════════════════
const TOOL_FILTERS = [
  { label:'All',      catId:'All',     color:'#1d1d1f', Icon:Layers   },
  { label:'AI Tools', catId:'AI',      color:'#7c3aed', Icon:Sparkles },
  { label:'Edit',     catId:'Edit',    color:'#2563eb', Icon:FilePen  },
  { label:'Convert',  catId:'Convert', color:'#16a34a', Icon:FileType },
  { label:'Pages',    catId:'Pages',   color:'#f97316', Icon:Layers   },
  { label:'Sign',     catId:'Protect', color:'#dc2626', Icon:PenTool  },
  { label:'Organize', catId:'Organize',color:'#d97706', Icon:Merge    },
]

function AllTools() {
  const [activeTab, setActiveTab] = useState('AI Tools')
  const [search, setSearch] = useState('')

  const activeFilter = TOOL_FILTERS.find(f => f.label === activeTab) ?? TOOL_FILTERS[0]
  const activeCat    = CATS.find(c => c.id === activeFilter.catId)

  const baseTools    = activeFilter.catId === 'All' ? TOOLS : TOOLS.filter(t => t.cat === activeFilter.catId)
  const q            = search.trim().toLowerCase()
  const visibleTools = q ? TOOLS.filter(t => t.name.toLowerCase().includes(q)) : baseTools
  const isSearching  = q.length > 0

  return (
    <section id="tools" style={{background:'#f8f8fa', borderTop:'1px solid #f0f0f0', padding:'88px 28px 100px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>

        {/* ── Section header ── */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'100px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:32}}>
          <div style={{...MONO, fontSize:10, color:'rgba(0,0,0,.35)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14}}>
            All Tools
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)', fontSize:'clamp(28px,3.5vw,46px)', fontWeight:800, color:'#1d1d1f', letterSpacing:'-0.05em', lineHeight:.96, margin:0}}>
            35+ tools. One platform.
          </h2>
        </motion.div>

        {/* ── Search bar ── */}
        <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,ease:E}}
          style={{marginBottom:20}}>
          <div style={{position:'relative', maxWidth:480}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}>
              <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tools: compress, merge, sign, OCR…"
              style={{
                width:'100%', padding:'11px 14px 11px 40px',
                borderRadius:12, border:'1.5px solid #e5e7eb',
                background:'#fff', fontSize:14, color:'#1d1d1f',
                fontFamily:'var(--font-dm,system-ui,sans-serif)',
                outline:'none', boxSizing:'border-box',
                boxShadow:'0 1px 4px rgba(0,0,0,.06)',
                transition:'border-color .15s',
              } as React.CSSProperties}
              onFocus={e => { e.currentTarget.style.borderColor = '#0891b2' }}
              onBlur={e  => { e.currentTarget.style.borderColor = '#e5e7eb' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:2,color:'#9ca3af',display:'flex'}}>
                <X size={14} strokeWidth={2}/>
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Filter tabs ── */}
        <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:.05,ease:E}}
          className="tab-bar"
          style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:8, marginBottom:48}}>
          {TOOL_FILTERS.map(({label, catId, color, Icon:TabIcon}) => {
            const active = activeTab === label
            const count  = catId === 'All' ? TOOLS.length : TOOLS.filter(t => t.cat === catId).length
            return (
              <motion.button key={label} onClick={() => { setActiveTab(label); setSearch('') }}
                whileTap={{scale:.94}} transition={SP}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'9px 18px', borderRadius:99, border:'none', flexShrink:0,
                  background: active ? color : '#fff',
                  color: active ? '#fff' : '#6b7280',
                  fontSize:13, fontWeight:600, cursor:'pointer',
                  boxShadow: active ? `0 4px 16px ${color}40` : '0 1px 4px rgba(0,0,0,.08)',
                  outline:'none', transition:'color .15s, background .15s',
                }}>
                <TabIcon size={14} strokeWidth={2}/>
                {label}
                <span style={{
                  fontSize:10, fontWeight:800, padding:'1px 6px', borderRadius:99,
                  background: active ? 'rgba(255,255,255,.25)' : `${color}15`,
                  color: active ? '#fff' : color,
                  minWidth:20, textAlign:'center',
                }}>
                  {count}
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── Content ── */}
        <AnimatePresence mode="sync">
          <motion.div key={activeTab + q}
            initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0}}
            transition={{duration:.15, ease:[.22,1,.36,1]}}>

            {isSearching ? (
              /* ── Search results ── */
              <div>
                <div style={{...MONO, fontSize:11, color:'#9ca3af', letterSpacing:'0.06em', marginBottom:20}}>
                  {visibleTools.length} result{visibleTools.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
                </div>
                {visibleTools.length === 0 ? (
                  <div style={{textAlign:'center', padding:'60px 0', color:'#9ca3af', fontSize:15}}>
                    No tools found. Try &ldquo;compress&rdquo;, &ldquo;sign&rdquo;, or &ldquo;word&rdquo;.
                  </div>
                ) : (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(192px,1fr))', gap:14}}>
                    {visibleTools.map((tool, i) => {
                      const cat = CATS.find(c => c.id === tool.cat)
                      return (
                        <motion.div key={tool.name}
                          initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                          transition={{delay:i*.03, duration:.25, ease:[.22,1,.36,1] as [number,number,number,number]}}>
                          <ToolCard tool={tool} catColor={cat?.color ?? '#1d1d1f'}/>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : activeFilter.catId === 'All' ? (
              /* ── Grouped by category ── */
              <div style={{display:'flex', flexDirection:'column', gap:64}}>
                {CATS.map(cat => {
                  const catTools = TOOLS.filter(t => t.cat === cat.id)
                  return (
                    <div key={cat.id} id={`cat-${cat.id}`}>
                      <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:24, paddingBottom:18, borderBottom:`2px solid ${cat.color}20`}}>
                        <div style={{width:44, height:44, borderRadius:13,
                          background:`linear-gradient(135deg,${cat.color}18,${cat.color}08)`,
                          border:`1.5px solid ${cat.color}25`,
                          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                          <cat.Icon size={22} color={cat.color} strokeWidth={1.8}/>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:18, fontWeight:800, color:'#1d1d1f', letterSpacing:'-0.03em'}}>{cat.label}</div>
                          <div style={{fontSize:12, color:'#9ca3af', marginTop:1}}>{cat.desc}</div>
                        </div>
                        <div style={{...MONO, fontSize:11, fontWeight:700, color:cat.color,
                          background:`${cat.color}10`, padding:'4px 12px', borderRadius:99}}>
                          {catTools.length} tools
                        </div>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(192px,1fr))', gap:14}}>
                        {catTools.map(tool => <ToolCard key={tool.name} tool={tool} catColor={cat.color}/>)}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* ── Filtered category view ── */
              <div>
                {activeCat && (
                  <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:32, padding:'20px 24px',
                    background:`linear-gradient(135deg,${activeCat.color}08,${activeCat.color}03)`,
                    border:`1.5px solid ${activeCat.color}20`, borderRadius:18}}>
                    <div style={{width:52,height:52,borderRadius:14,background:activeCat.light,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <activeCat.Icon size={26} color={activeCat.color} strokeWidth={1.8}/>
                    </div>
                    <div>
                      <div style={{fontSize:20, fontWeight:800, color:'#1d1d1f', letterSpacing:'-0.03em'}}>{activeCat.label}</div>
                      <div style={{fontSize:13, color:'#6b7280', marginTop:2}}>{activeCat.desc} · {visibleTools.length} tools</div>
                    </div>
                  </div>
                )}
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(192px,1fr))', gap:14}}>
                  {visibleTools.map((tool, i) => (
                    <motion.div key={tool.name}
                      initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                      transition={{delay:i*.04, duration:.3, ease:[.22,1,.36,1] as [number,number,number,number]}}>
                      <ToolCard tool={tool} catColor={activeCat?.color ?? '#1d1d1f'}/>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
//  CTA
// ══════════════════════════════════════════════════════════════════════════════
function CTA() {
  return (
    <section className="cta-sec" style={{background:'#F5F5F7',borderTop:'1px solid #e8e8e8'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'100px'}} transition={{duration:.65,ease:E}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:24}}>Get started</div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(44px,7vw,100px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.96,margin:'0 0 40px'}}>
            Ready to edit<br/><span className="grad-red">your PDF?</span>
          </h2>
          <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
            <Mag>
              <Link href="/pdf-editor"
                style={{...FI,display:'inline-flex',alignItems:'center',gap:9,padding:'15px 34px',background:'#1d1d1f',color:'#fff',borderRadius:99,fontSize:16,fontWeight:700,textDecoration:'none',letterSpacing:'-0.025em',boxShadow:'0 4px 24px rgba(0,0,0,.14)'}}>
                <motion.span style={{display:'flex',alignItems:'center',gap:9}} whileHover={{gap:16}} transition={SP}>
                  <Upload size={16} strokeWidth={2.5}/> Upload PDF Now
                </motion.span>
              </Link>
            </Mag>
            <span style={{...MONO,fontSize:11,color:'#999',letterSpacing:'0.08em',textTransform:'uppercase'}}>Start with your PDF — no signup required</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  POPULAR TOOLS
// ══════════════════════════════════════════════════════════════════════════════
const TIER_BADGE: Record<string, { label:string; bg:string; color:string }> = {
  free:  { label:'Free',          bg:'rgba(22,163,74,.1)',    color:'#15803d' },
  ai:    { label:'5 free/day',    bg:'rgba(124,58,237,.1)',   color:'#7c3aed' },
  pro:   { label:'Pro',           bg:'rgba(8,145,178,.1)',    color:'#0e7490' },
}

// ══════════════════════════════════════════════════════════════════════════════
//  PRODUCT DEMO — looping 4-step animation
// ══════════════════════════════════════════════════════════════════════════════
const DEMO_STEPS = [
  {
    step: '01',
    label: 'Upload',
    color: '#6366f1',
    headline: 'Drop or click to upload',
    Screen: function DemoUpload() {
      return (
        <div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:24,background:'#F5F5F7'}}>
          <motion.div
            animate={{borderColor:['rgba(99,102,241,.25)','rgba(99,102,241,.7)','rgba(99,102,241,.25)'],background:['rgba(99,102,241,.02)','rgba(99,102,241,.07)','rgba(99,102,241,.02)']}}
            transition={{duration:2.2,repeat:Infinity,ease:'easeInOut'}}
            style={{border:'2px dashed rgba(99,102,241,.35)',borderRadius:16,padding:'32px 40px',textAlign:'center',width:'100%',maxWidth:320}}>
            <motion.div animate={{y:[0,-6,0]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}
              style={{width:52,height:52,borderRadius:14,background:'rgba(99,102,241,.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <Upload size={24} color="#6366f1" strokeWidth={1.6}/>
            </motion.div>
            <div style={{...FI,fontSize:14,fontWeight:700,color:'#1d1d1f',marginBottom:4}}>Drop your PDF here</div>
            <div style={{...FI,fontSize:12,color:'#9ca3af',marginBottom:16}}>or click to browse · up to 100 MB</div>
            <motion.div animate={{width:['0%','72%']}} transition={{duration:1.4,delay:.6,ease:[.22,1,.36,1]}}
              style={{height:3,borderRadius:99,background:'linear-gradient(90deg,#6366f1,#818cf8)',margin:'0 auto'}}/>
          </motion.div>
          <div style={{display:'flex',gap:8}}>
            {['invoice.pdf','contract.pdf','form.pdf'].map((f,i)=>(
              <motion.div key={f} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.3+i*.15,duration:.3}}
                style={{...FI,fontSize:10,fontWeight:600,color:'#6366f1',background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.2)',borderRadius:8,padding:'4px 9px',whiteSpace:'nowrap'}}>
                {f}
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
  },
  {
    step: '02',
    label: 'AI Fill',
    color: '#7c3aed',
    headline: 'AI fills fields instantly',
    Screen: function DemoAI() {
      const fields = [
        {label:'Full Name',     val:'John Smith',          w:'80%'},
        {label:'Email Address', val:'john@example.com',    w:'90%'},
        {label:'Date of Birth', val:'12 / 04 / 1990',     w:'60%'},
        {label:'Signature',     val:'',                    w:'70%', sig:true},
      ]
      return (
        <div style={{height:'100%',background:'#fff',display:'flex',flexDirection:'column',padding:'20px 24px',gap:10,overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#7c3aed,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <WandSparkles size={13} color="#fff" strokeWidth={2}/>
            </div>
            <span style={{...FI,fontSize:12,fontWeight:700,color:'#7c3aed'}}>AI Form Filler</span>
            <motion.span animate={{opacity:[1,.3,1]}} transition={{duration:1.4,repeat:Infinity}}
              style={{...MONO,fontSize:9,color:'#7c3aed',background:'rgba(124,58,237,.1)',padding:'2px 7px',borderRadius:99,marginLeft:'auto'}}>
              Scanning…
            </motion.span>
          </div>
          {fields.map(({label,val,w,sig},i)=>(
            <div key={label}>
              <div style={{...MONO,fontSize:9,color:'#9ca3af',marginBottom:3,letterSpacing:'0.06em',textTransform:'uppercase'}}>{label}</div>
              <motion.div initial={{width:'0%'}} animate={{width:w}} transition={{delay:.3+i*.28,duration:.5,ease:[.22,1,.36,1]}}
                style={{height:sig?28:22,borderRadius:6,background:sig?'rgba(124,58,237,.06)':'rgba(124,58,237,.09)',
                  border:`1px solid rgba(124,58,237,.2)`,display:'flex',alignItems:'center',paddingLeft:8,overflow:'hidden'}}>
                {sig ? (
                  <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3+i*.28+.4}}
                    style={{...FI,fontSize:13,color:'#7c3aed',fontStyle:'italic',fontWeight:600}}>J. Smith</motion.span>
                ) : (
                  <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3+i*.28+.3}}
                    style={{...FI,fontSize:11,color:'#4c1d95',fontWeight:500}}>{val}</motion.span>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      )
    },
  },
  {
    step: '03',
    label: 'Sign',
    color: RED,
    headline: 'Add your signature',
    Screen: function DemoSign() {
      return (
        <div style={{height:'100%',background:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,gap:14}}>
          <div style={{width:'100%',maxWidth:320,background:'#fafafa',borderRadius:12,border:'1.5px solid #f0f0f0',padding:18}}>
            <div style={{...MONO,fontSize:9,color:'#9ca3af',marginBottom:10,letterSpacing:'0.06em',textTransform:'uppercase'}}>Sign here</div>
            <div style={{height:68,borderRadius:8,background:'rgba(226,75,74,.04)',border:'1.5px dashed rgba(226,75,74,.3)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
              <svg width="200" height="52" viewBox="0 0 200 52" fill="none" style={{position:'absolute'}}>
                <path
                  d="M20,36 C28,20 36,14 48,26 C56,34 60,18 72,18 C82,18 86,30 94,24 C104,16 112,28 122,26 C134,22 140,32 152,28 C162,24 168,34 180,30"
                  stroke={RED} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  fill="none"
                  strokeDasharray="340"
                  style={{animation:'sigdraw 3s ease-in-out infinite'}}
                />
              </svg>
            </div>
            <div style={{display:'flex',gap:6,marginTop:10}}>
              {['Draw','Type','Upload'].map((m,i)=>(
                <div key={m} style={{...FI,fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:99,
                  background:i===0?`${RED}12`:'transparent',color:i===0?RED:'#9ca3af',
                  border:`1px solid ${i===0?RED+'30':'#ebebeb'}`}}>{m}</div>
              ))}
            </div>
          </div>
          <div style={{...FI,display:'inline-flex',alignItems:'center',gap:7,padding:'9px 22px',
              background:RED,color:'#fff',borderRadius:99,fontSize:12.5,fontWeight:700,cursor:'pointer',
              boxShadow:`0 6px 20px ${RED}40`,animation:'pdot 2s ease-in-out infinite',
              animationName:'none'}}>
            <PenTool size={13} strokeWidth={2.2}/> Apply Signature
          </div>
        </div>
      )
    },
  },
  {
    step: '04',
    label: 'Download',
    color: '#16a34a',
    headline: 'Download your file',
    Screen: function DemoDownload() {
      return (
        <div style={{height:'100%',background:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:28,gap:18}}>
          <motion.div
            animate={{y:[0,-4,0]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}
            style={{width:72,height:88,borderRadius:10,background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,
              boxShadow:'0 12px 32px rgba(22,163,74,.3)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,right:0,width:22,height:22,background:'rgba(255,255,255,.18)',clipPath:'polygon(100% 0%,100% 100%,0% 100%)'}}/>
            <Download size={26} color="#fff" strokeWidth={1.6}/>
          </motion.div>
          <div style={{textAlign:'center'}}>
            <div style={{...FI,fontSize:14,fontWeight:800,color:'#1d1d1f',marginBottom:4}}>form_signed.pdf</div>
            <div style={{...FI,fontSize:12,color:'#9ca3af',marginBottom:14}}>Ready · 1.2 MB · processed in browser</div>
            <div style={{...FI,display:'inline-flex',alignItems:'center',gap:7,padding:'10px 24px',
                background:'#16a34a',color:'#fff',borderRadius:99,fontSize:13,fontWeight:700,cursor:'pointer',
                boxShadow:'0 6px 20px rgba(22,163,74,.35)'}}>
              <Download size={14} strokeWidth={2.5}/> Download PDF
            </div>
          </div>
          <div style={{display:'flex',gap:10}}>
            {['PDF → Word','Share link','Compress'].map(opt=>(
              <div key={opt} style={{...FI,fontSize:10,fontWeight:600,color:'#6b7280',
                border:'1px solid #e5e7eb',borderRadius:8,padding:'4px 10px'}}>{opt}</div>
            ))}
          </div>
        </div>
      )
    },
  },
]

function ProductDemo() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % DEMO_STEPS.length), 3200)
    return () => clearInterval(id)
  }, [])

  const cur = DEMO_STEPS[active]
  const Screen = cur.Screen

  return (
    <section style={{background:'#F5F5F7',borderTop:'1px solid #ebebeb',padding:'80px 28px 88px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>

        {/* Header */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{textAlign:'center',marginBottom:48}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            See it in action
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 12px'}}>
            From upload to done — in seconds
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',margin:'0 auto',maxWidth:400,lineHeight:1.65}}>
            Upload a PDF, fill or edit it with AI, add your signature, and download — all in your browser.
          </p>
        </motion.div>

        {/* Step tabs */}
        <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:32,flexWrap:'wrap'}}>
          {DEMO_STEPS.map(({step,label,color},i) => (
            <button key={step} onClick={() => setActive(i)}
              style={{...FI,display:'flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:99,
                border:`1.5px solid ${i===active ? color : '#e5e7eb'}`,
                background:i===active ? `${color}10` : '#fff',
                color:i===active ? color : '#9ca3af',
                fontSize:13,fontWeight:700,cursor:'pointer',transition:'all .18s',
                boxShadow:i===active?`0 4px 16px ${color}20`:'none'}}>
              <span style={{...MONO,fontSize:9,fontWeight:800}}>{step}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Main demo window */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'60px'}} transition={{duration:.5,ease:E}}>
          <div style={{borderRadius:20,overflow:'hidden',border:'1.5px solid #e5e7eb',
            boxShadow:'0 24px 80px -16px rgba(0,0,0,.12)',background:'#fff',maxWidth:760,margin:'0 auto'}}>

            {/* Chrome bar */}
            <div style={{background:'#F5F5F7',borderBottom:'1px solid rgba(0,0,0,.07)',height:38,
              display:'flex',alignItems:'center',padding:'0 14px',gap:10}}>
              <div style={{display:'flex',gap:5}}>
                {['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{width:9,height:9,borderRadius:'50%',background:c}}/>)}
              </div>
              <div style={{flex:1,display:'flex',justifyContent:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(0,0,0,.05)',borderRadius:7,padding:'3px 14px',minWidth:220}}>
                  <Lock size={8} color="rgba(0,0,0,.35)" strokeWidth={2}/>
                  <span style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)'}}>editpdfai.com</span>
                </div>
              </div>
              {/* Progress bar */}
              <motion.div key={active}
                style={{width:60,height:3,borderRadius:99,background:'#ebebeb',overflow:'hidden',flexShrink:0}}>
                <motion.div
                  initial={{width:'0%'}} animate={{width:'100%'}}
                  transition={{duration:3.2,ease:'linear'}}
                  style={{height:'100%',borderRadius:99,background:cur.color}}/>
              </motion.div>
            </div>

            {/* Screen content */}
            <div style={{height:300,position:'relative',overflow:'hidden'}}>
              <AnimatePresence mode="sync">
                <motion.div key={active}
                  initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                  transition={{duration:.28,ease:[.22,1,.36,1]}}
                  style={{position:'absolute',inset:0}}>
                  <Screen/>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div style={{background:'#fafafa',borderTop:'1px solid #f0f0f0',padding:'10px 18px',
              display:'flex',alignItems:'center',gap:10}}>
              <motion.div animate={{background:cur.color}} transition={{duration:.4}}
                style={{width:6,height:6,borderRadius:'50%'}}/>
              <span style={{...FI,fontSize:12,fontWeight:600,color:'#1d1d1f'}}>{cur.headline}</span>
              <span style={{...MONO,fontSize:10,color:'#9ca3af',marginLeft:'auto'}}>
                Step {cur.step} of {DEMO_STEPS.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div style={{textAlign:'center',marginTop:28}}>
          <Link href="/pdf-editor"
            style={{...FI,display:'inline-flex',alignItems:'center',gap:7,fontSize:14,fontWeight:700,
              color:'#fff',background:'#1d1d1f',textDecoration:'none',
              padding:'11px 28px',borderRadius:99,letterSpacing:'-0.02em',
              boxShadow:'0 4px 20px rgba(0,0,0,.14)'}}>
            <Upload size={14} strokeWidth={2.5}/> Try it free — no account needed
          </Link>
        </div>
      </div>
    </section>
  )
}

function PopularTools() {
  const popular: { label:string; href:string; Icon:typeof FilePen; color:string; tier:string }[] = [
    { label:'Edit PDF',      href:'/pdf-editor',         Icon:FilePen,   color:'#6366f1', tier:'free' },
    { label:'Compress PDF',  href:'/pdf-compressor',     Icon:Minimize2, color:'#f97316', tier:'free' },
    { label:'Merge PDF',     href:'/pdf-merger',         Icon:Merge,     color:'#0891b2', tier:'free' },
    { label:'Split PDF',     href:'/pdf-splitter',       Icon:Split,     color:'#16a34a', tier:'free' },
    { label:'Sign PDF',      href:'/pdf-signer',         Icon:PenTool,   color:RED,       tier:'free' },
    { label:'PDF to Word',   href:'/pdf-to-word',        Icon:FileType,  color:'#2563eb', tier:'pro'  },
    { label:'AI Form Filler',href:'/ai-pdf-form-filler', Icon:Sparkles,  color:'#7c3aed', tier:'ai'  },
  ]
  return (
    <section style={{background:'#fff',padding:'72px 28px 60px',borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:36}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12}}>
            Most used
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,38px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',lineHeight:1,margin:0}}>
            Popular tools
          </h2>
        </motion.div>
        <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
          {popular.map(({label,href,Icon,color,tier},i)=>{
            const badge = TIER_BADGE[tier]
            return (
              <motion.div key={href}
                initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}}
                viewport={{once:true,margin:'60px'}} transition={{duration:.35,delay:i*.05,ease:E}}>
                <Link href={href} style={{
                  display:'inline-flex',alignItems:'center',gap:10,
                  padding:'11px 18px',borderRadius:14,textDecoration:'none',
                  background:'#f8f8fa',border:'1.5px solid #ebebeb',
                  transition:'all .18s',
                }}
                onMouseEnter={e=>{
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = `${color}08`
                  el.style.borderColor = `${color}30`
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = `0 6px 20px ${color}18`
                }}
                onMouseLeave={e=>{
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = '#f8f8fa'
                  el.style.borderColor = '#ebebeb'
                  el.style.transform = 'none'
                  el.style.boxShadow = 'none'
                }}>
                  <div style={{width:32,height:32,borderRadius:9,background:`${color}12`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon size={15} color={color} strokeWidth={2}/>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:2}}>
                    <span style={{...FI,fontSize:13.5,fontWeight:700,color:'#1d1d1f',whiteSpace:'nowrap',lineHeight:1}}>{label}</span>
                    <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.06em',padding:'1.5px 6px',borderRadius:99,background:badge.bg,color:badge.color,width:'fit-content'}}>
                      {badge.label}
                    </span>
                  </div>
                  <ChevronRight size={13} color="#bbb" strokeWidth={2}/>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════════════════════════════════════
function Footer() {
  const toolCols = [
    { title:'AI Tools', color:'#7c3aed', links:[
      ['AI Form Filler','/ai-pdf-form-filler'],
      ['PDF OCR Scanner','/pdf-ocr'],
      ['PDF Summarizer','/pdf-summarizer'],
      ['PDF Mind Map','/mind-map'],
      ['Quiz Creator','/quiz-creator'],
      ['PDF Translator','/pdf-translator'],
    ]},
    { title:'PDF Tools', color:'#2563eb', links:[
      ['PDF Editor','/pdf-editor'],
      ['PDF Merger','/pdf-merger'],
      ['PDF Compressor','/pdf-compressor'],
      ['PDF Splitter','/pdf-splitter'],
      ['PDF Watermarker','/pdf-watermark'],
      ['Image to PDF','/image-to-pdf'],
    ]},
    { title:'Company', color:'#374151', links:[
      ['About Us','/about'],
      ['Pricing','/pricing'],
      ['Privacy Policy','/privacy'],
      ['Terms of Service','/terms'],
      ['Contact','/contact'],
      ['Support','mailto:support@editpdfai.com'],
    ]},
  ]
  return (
    <footer style={{background:'#f5f5f7',borderTop:'1px solid #e5e5ea',padding:'56px 28px 0'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:48,alignItems:'start',marginBottom:48}}>

          {/* Brand */}
          <div>
            <Link href="/" style={{display:'inline-flex',alignItems:'center',textDecoration:'none',marginBottom:14}}>
              <img src="/logo.png" alt="EditPDF AI" style={{height:48,width:'auto',display:'block'}} />
            </Link>
            <p style={{...FI,fontSize:13,color:'#6b7280',lineHeight:1.7,maxWidth:220,margin:'0 0 16px'}}>
              35+ AI-powered PDF tools. Edit, convert, protect and sign — free to use, no signup required.
            </p>

            {/* Privacy assurance */}
            <div style={{display:'flex',alignItems:'flex-start',gap:8,padding:'10px 12px',
              background:'rgba(22,163,74,.06)',border:'1px solid rgba(22,163,74,.16)',
              borderRadius:10,marginBottom:20,maxWidth:240}}>
              <Lock size={13} color="#16a34a" strokeWidth={2.2} style={{flexShrink:0,marginTop:1}}/>
              <p style={{...FI,fontSize:11.5,color:'#374151',lineHeight:1.55,margin:0}}>
                <strong style={{color:'#15803d'}}>Your files stay private.</strong> PDFs are processed in your browser. AI features use text context only — no raw file is uploaded.
              </p>
            </div>

            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:20}}>
              {CATS.map(c=>(
                <span key={c.id} style={{display:'inline-flex',alignItems:'center',gap:4,...MONO,
                  fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:99,
                  background:`${c.color}12`,color:c.color,letterSpacing:'.06em'}}>
                  <c.Icon size={9} strokeWidth={2.5}/>{c.id.toUpperCase()}
                </span>
              ))}
            </div>
            <p style={{...MONO,fontSize:10,color:'#9ca3af',letterSpacing:'0.04em'}}>
              © {new Date().getFullYear()} EditPDF AI. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {toolCols.map(({title,color,links})=>(
            <div key={title}>
              <div style={{...MONO,fontSize:10,fontWeight:700,color,letterSpacing:'0.1em',
                textTransform:'uppercase',marginBottom:16}}>
                {title}
              </div>
              {links.map(([l,h])=>(
                <motion.div key={l} whileHover={{x:3}} transition={SP}>
                  <Link href={h}
                    style={{...FI,display:'block',fontSize:13,color:'#6b7280',
                      textDecoration:'none',fontWeight:500,marginBottom:10,
                      letterSpacing:'-0.01em',transition:'color .12s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='#1d1d1f')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#6b7280')}>
                    {l}
                  </Link>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{borderTop:'1px solid #e5e5ea',padding:'16px 0 20px',display:'flex',
          alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <span style={{...MONO,fontSize:10,color:'#9ca3af',letterSpacing:'0.04em'}}>
              35+ TOOLS · FREE · AI-POWERED
            </span>
            <div style={{display:'flex',gap:12}}>
              {[['About','/about'],['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,h])=>(
                <Link key={l} href={h}
                  style={{...FI,fontSize:11,color:'#9ca3af',textDecoration:'none',fontWeight:500}}
                  onMouseEnter={e=>(e.currentTarget.style.color='#374151')}
                  onMouseLeave={e=>(e.currentTarget.style.color='#9ca3af')}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/pdf-editor"
            style={{...FI,display:'inline-flex',alignItems:'center',gap:6,
              fontSize:12,fontWeight:700,color:'#fff',textDecoration:'none',
              padding:'7px 16px',borderRadius:99,background:'#1d1d1f',
              letterSpacing:'-0.02em'}}>
            <Upload size={11} strokeWidth={2.5}/> Upload PDF
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  USE CASES
// ══════════════════════════════════════════════════════════════════════════════
function UseCases() {
  const cases = [
    {
      Icon: GraduationCap, color: '#7c3aed', bg: 'rgba(124,58,237,.08)',
      title: 'Students',
      desc: 'Summarise lecture notes, generate practice quizzes, and OCR scan handwritten pages — all before your next class.',
      tools: ['PDF Summarizer', 'Quiz Creator', 'PDF OCR Scanner'],
    },
    {
      Icon: Briefcase, color: '#2563eb', bg: 'rgba(37,99,235,.08)',
      title: 'Job Seekers',
      desc: 'Fill job application forms with AI, sign offer letters digitally, and convert your CV to PDF in seconds.',
      tools: ['AI Form Filler', 'PDF E-Signer', 'Word → PDF'],
    },
    {
      Icon: FilePen, color: '#16a34a', bg: 'rgba(22,163,74,.08)',
      title: 'Freelancers',
      desc: 'Edit invoice PDFs, add your signature to contracts, and redact sensitive client details before sharing.',
      tools: ['PDF Editor', 'PDF E-Signer', 'PDF Redactor'],
    },
    {
      Icon: Building2, color: '#f97316', bg: 'rgba(249,115,22,.08)',
      title: 'Small Businesses',
      desc: 'Merge multi-page reports, compress attachments for email, and lock confidential documents with a password.',
      tools: ['PDF Merger', 'PDF Compressor', 'PDF Password Lock'],
    },
    {
      Icon: FlaskConical, color: '#0891b2', bg: 'rgba(8,145,178,.08)',
      title: 'Researchers',
      desc: 'Translate academic papers, extract text from scanned journals, and create mind maps from long PDFs.',
      tools: ['PDF Translator', 'PDF OCR Scanner', 'PDF Mind Map'],
    },
  ]
  return (
    <section style={{background:'#fff',padding:'88px 28px 80px',borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:48,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            Use cases
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 12px'}}>
            Built for every PDF task
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',margin:'0 auto',maxWidth:480,lineHeight:1.65}}>
            Whether you are a student, professional or business — EditPDF AI has the right tool for you.
          </p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
          {cases.map(({Icon,color,bg,title,desc,tools},i)=>(
            <motion.div key={title}
              initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'60px'}} transition={{duration:.4,delay:i*.06,ease:E}}
              style={{background:'#fafafa',border:'1.5px solid #eeeeee',borderRadius:20,padding:'24px 20px 20px',
                display:'flex',flexDirection:'column',gap:12}}>
              <div style={{width:44,height:44,borderRadius:13,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={22} color={color} strokeWidth={1.8}/>
              </div>
              <div>
                <div style={{...FI,fontSize:15,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.03em',marginBottom:6}}>{title}</div>
                <p style={{...FI,fontSize:13,color:'#6b7280',lineHeight:1.65,margin:'0 0 12px'}}>{desc}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {tools.map(t=>(
                    <span key={t} style={{...MONO,fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:99,
                      background:bg,color,letterSpacing:'0.04em'}}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  PRIVACY & SECURITY (expanded 4-card)
// ══════════════════════════════════════════════════════════════════════════════
function PrivacyNote() {
  const cards = [
    {
      Icon: Globe, color: '#2563eb', bg: 'rgba(37,99,235,.08)',
      title: 'Browser-based processing',
      desc: 'PDF editing, compression, signing and page tools all run directly in your browser. Your file never leaves your device.',
    },
    {
      Icon: Server, color: '#16a34a', bg: 'rgba(22,163,74,.08)',
      title: 'No PDF storage',
      desc: 'We do not store your documents on our servers. When you close the tab, your PDF is gone — permanently.',
    },
    {
      Icon: Shield, color: '#7c3aed', bg: 'rgba(124,58,237,.08)',
      title: 'Raw PDFs never sent to AI',
      desc: 'AI features extract only the text context needed. Your raw PDF binary is never transmitted to any AI model.',
    },
    {
      Icon: CreditCard, color: '#0891b2', bg: 'rgba(8,145,178,.08)',
      title: 'Secure Stripe payments',
      desc: 'All billing is handled by Stripe — the global standard for payment security. We never see or store your card details.',
    },
  ]
  return (
    <section style={{background:'#f5f5f7',padding:'80px 28px',borderTop:'1px solid #e8e8e8'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:40,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            Privacy &amp; Security
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,40px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 12px'}}>
            Your files stay private. Always.
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',margin:'0 auto',maxWidth:440,lineHeight:1.65}}>
            Privacy is not a feature — it is the foundation of how EditPDF AI is built.
          </p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14,marginBottom:28}}>
          {cards.map(({Icon,color,bg,title,desc},i)=>(
            <motion.div key={title}
              initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'60px'}} transition={{duration:.4,delay:i*.06,ease:E}}
              style={{background:'#fff',border:'1.5px solid #ebebeb',borderRadius:18,padding:'22px 18px',display:'flex',flexDirection:'column',gap:10}}>
              <div style={{width:40,height:40,borderRadius:11,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={19} color={color} strokeWidth={1.8}/>
              </div>
              <div style={{...FI,fontSize:13.5,fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.02em'}}>{title}</div>
              <p style={{...FI,fontSize:12.5,color:'#6b7280',lineHeight:1.65,margin:0}}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <div style={{textAlign:'center'}}>
          <Link href="/privacy"
            style={{...FI,display:'inline-flex',alignItems:'center',gap:6,fontSize:13.5,fontWeight:600,
              color:'#2563eb',textDecoration:'none',borderBottom:'1.5px solid rgba(37,99,235,.3)',paddingBottom:1}}>
            See exactly how we protect your files <ArrowRight size={13} strokeWidth={2.5}/>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  FAQ
// ══════════════════════════════════════════════════════════════════════════════
const FAQ_ITEMS = [
  {
    q: 'Is EditPDF AI really free?',
    a: 'Yes. All core PDF tools — edit, merge, split, compress, sign, watermark, and more — are free with no limits and no account required. AI features (Form Filler, Summarizer, OCR, etc.) include 5 free uses per day. Upgrade to Pro (US$1/month) for unlimited AI use.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required for any of the core tools. Sign in to unlock AI features (5 free per day) and Pro benefits such as unlimited AI, PDF-to-Word conversion, and priority processing.',
  },
  {
    q: 'Are my PDF files uploaded to a server?',
    a: 'Core tools process your PDF entirely in your browser — nothing is uploaded. For AI features, only the extracted text context is sent, never the raw PDF file.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can upload PDFs up to 100 MB. Most browser-based tools handle files well below this limit instantly. For very large files, compression before processing is recommended.',
  },
  {
    q: 'What counts as an AI use?',
    a: 'Each interaction with an AI tool (one form fill, one summary, one OCR scan, one mind map, etc.) counts as one AI use. You get 5 free AI uses per day. Pro subscribers get unlimited uses.',
  },
  {
    q: 'Can I edit scanned PDFs?',
    a: 'Yes. Use the PDF OCR Scanner to extract and copy text from any scanned document. Once extracted, you can edit, translate, or summarise the content with our other tools.',
  },
]

function FAQ() {
  const [open, setOpen] = useState<number|null>(null)
  return (
    <section style={{background:'#fff',padding:'80px 28px',borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:40,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            FAQ
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,40px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:0}}>
            Common questions
          </h2>
        </motion.div>

        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {FAQ_ITEMS.map(({q,a},i)=>(
            <motion.div key={q}
              initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'40px'}} transition={{duration:.35,delay:i*.04,ease:E}}
              style={{borderBottom:'1px solid #f0f0f0'}}>
              <button
                onClick={()=>setOpen(open===i?null:i)}
                style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                  gap:16,padding:'20px 0',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
                <span style={{...FI,fontSize:15,fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.02em',lineHeight:1.3}}>{q}</span>
                <span style={{flexShrink:0,width:26,height:26,borderRadius:'50%',background:open===i?'#1d1d1f':'#f3f4f6',
                  display:'flex',alignItems:'center',justifyContent:'center',transition:'background .15s'}}>
                  {open===i
                    ? <Minus size={12} color="#fff" strokeWidth={2.5}/>
                    : <Plus size={12} color="#6b7280" strokeWidth={2.5}/>}
                </span>
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div
                    initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                    transition={{duration:.22,ease:E}}
                    style={{overflow:'hidden'}}>
                    <p style={{...FI,fontSize:14,color:'#6b7280',lineHeight:1.7,margin:'0 0 20px',maxWidth:600}}>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:32}}>
          <Link href="/support"
            style={{...FI,fontSize:13.5,color:'#6b7280',textDecoration:'none',fontWeight:500}}>
            Still have questions? <span style={{color:'#2563eb',fontWeight:600}}>Visit our support page →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  UPLOAD BOX
// ══════════════════════════════════════════════════════════════════════════════
function UploadBox() {
  return (
    <section style={{background:'#fff',padding:'0 28px 64px'}}>
      <div style={{maxWidth:560,margin:'0 auto'}}>
        <Link href="/pdf-editor" style={{textDecoration:'none',display:'block'}}>
          <motion.div
            whileHover={{borderColor:'rgba(99,102,241,.55)',background:'rgba(99,102,241,.03)',y:-2}}
            transition={{duration:.18}}
            style={{border:'2px dashed rgba(0,0,0,.12)',borderRadius:20,padding:'36px 32px',
              textAlign:'center',cursor:'pointer',transition:'border-color .18s,background .18s'}}>
            <motion.div
              animate={{y:[0,-5,0]}}
              transition={{duration:2.4,repeat:Infinity,ease:'easeInOut'}}
              style={{width:52,height:52,borderRadius:15,background:'rgba(99,102,241,.08)',
                display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <Upload size={22} color="#6366f1" strokeWidth={1.6}/>
            </motion.div>
            <p style={{...FI,fontSize:16,fontWeight:700,color:'#1d1d1f',margin:'0 0 6px',letterSpacing:'-0.02em'}}>
              Drop your PDF here to start
            </p>
            <p style={{...FI,fontSize:13,color:'#9ca3af',margin:'0 0 20px',lineHeight:1.6}}>
              or click to browse · up to 100 MB · processed in your browser
            </p>
            <span style={{...FI,display:'inline-flex',alignItems:'center',gap:8,
              padding:'10px 24px',background:'#1d1d1f',color:'#fff',
              borderRadius:99,fontSize:13.5,fontWeight:700,letterSpacing:'-0.02em'}}>
              <Upload size={13} strokeWidth={2.5}/> Upload PDF
            </span>
          </motion.div>
        </Link>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  TESTIMONIALS
// ══════════════════════════════════════════════════════════════════════════════
const REVIEWS = [
  {
    name: 'Sarah K.',
    role: 'HR Manager',
    avatar: 'SK',
    color: '#7c3aed',
    stars: 5,
    text: 'I fill onboarding forms for new hires every week. The AI Form Filler saves me at least 30 minutes per document — it detects every field and fills them perfectly from the employee details I paste in.',
    tool: 'AI Form Filler',
  },
  {
    name: 'James T.',
    role: 'Freelance Designer',
    avatar: 'JT',
    color: '#2563eb',
    stars: 5,
    text: 'I send contracts and invoices constantly. Being able to edit a PDF, add my signature and send it — all in the browser without installing anything — is exactly what I needed.',
    tool: 'PDF Editor + E-Signer',
  },
  {
    name: 'Priya M.',
    role: 'Graduate Student',
    avatar: 'PM',
    color: '#16a34a',
    stars: 5,
    text: 'The PDF Summarizer and Quiz Creator are genuinely useful for studying. I upload a lecture PDF and get a clean summary and practice questions in under a minute. Game changer for exam prep.',
    tool: 'PDF Summarizer · Quiz Creator',
  },
  {
    name: 'David R.',
    role: 'Small Business Owner',
    avatar: 'DR',
    color: '#f97316',
    stars: 5,
    text: 'We merge supplier invoices every month before sending them to our accountant. The PDF Merger works flawlessly every time, and compressing them keeps email attachments small.',
    tool: 'PDF Merger · Compressor',
  },
  {
    name: 'Lena W.',
    role: 'Legal Assistant',
    avatar: 'LW',
    color: '#dc2626',
    stars: 5,
    text: 'Client documents contain sensitive information. The redaction tool permanently removes it — not just covers it with a box. And the password lock gives clients extra peace of mind.',
    tool: 'PDF Redactor · Password Lock',
  },
  {
    name: 'Arjun S.',
    role: 'Research Analyst',
    avatar: 'AS',
    color: '#0891b2',
    stars: 5,
    text: 'I work with academic papers in multiple languages. The OCR scanner extracts text from scanned journals and the translator handles the rest. Two AI tools that genuinely save hours.',
    tool: 'PDF OCR · Translator',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div style={{display:'flex',gap:2}}>
      {Array.from({length:n}).map((_,i)=>(
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function Testimonials() {
  return (
    <section style={{background:'#fff',padding:'80px 28px 72px',borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>

        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:48,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            Reviews
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 12px'}}>
            What people are saying
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',margin:'0 auto',maxWidth:400,lineHeight:1.65}}>
            Real feedback from users across different roles and industries.
          </p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
          {REVIEWS.map(({name,role,avatar,color,stars,text,tool},i)=>(
            <motion.div key={name}
              initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'40px'}} transition={{duration:.4,delay:(i%3)*.07,ease:E}}
              style={{background:'#fafafa',border:'1.5px solid #eeeeee',borderRadius:20,
                padding:'22px 20px',display:'flex',flexDirection:'column',gap:12}}>

              {/* Stars */}
              <Stars n={stars}/>

              {/* Quote */}
              <p style={{...FI,fontSize:13.5,color:'#374151',lineHeight:1.7,margin:0,flex:1}}>
                &ldquo;{text}&rdquo;
              </p>

              {/* Tool tag */}
              <div style={{...MONO,fontSize:9,fontWeight:700,color,background:`${color}10`,
                padding:'3px 9px',borderRadius:99,width:'fit-content',letterSpacing:'0.05em'}}>
                {tool}
              </div>

              {/* Author */}
              <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:4,borderTop:'1px solid #f0f0f0'}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:`${color}18`,
                  display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{...MONO,fontSize:10,fontWeight:800,color,letterSpacing:'0.04em'}}>{avatar}</span>
                </div>
                <div>
                  <div style={{...FI,fontSize:13,fontWeight:700,color:'#1d1d1f',lineHeight:1.2}}>{name}</div>
                  <div style={{...FI,fontSize:11.5,color:'#9ca3af',marginTop:1}}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  PRICING PREVIEW
// ══════════════════════════════════════════════════════════════════════════════
function PricingPreview() {
  const FREE_ITEMS = ['35+ PDF tools — all free','No account required','Edit, merge, split, compress','Sign & watermark PDFs','5 AI uses per day']
  const PRO_ITEMS  = ['Everything in Free','Unlimited AI uses per day','PDF → Word / Excel / PPT','Priority processing','AI form autofill & chat fill']

  const COMPARE = [
    { label:'All PDF tools',                 free: true,      pro: true         },
    { label:'No account needed',             free: true,      pro: true         },
    { label:'AI form fill / summarise / OCR',free: '5/day',   pro: '∞ Unlimited'},
    { label:'PDF → Word / Excel / PPT',      free: false,     pro: true         },
    { label:'Priority processing',           free: false,     pro: true         },
  ]

  return (
    <section style={{background:'#f5f5f7',padding:'72px 28px',borderTop:'1px solid #ebebeb'}}>
      <div style={{maxWidth:860,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:36,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12}}>
            Pricing
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,36px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',lineHeight:1,margin:'0 0 8px'}}>
            Free forever. Pro for power users.
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',margin:0}}>
            All core PDF tools are free — no card, no account. Upgrade for unlimited AI.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16,marginBottom:20}}>
          {/* Free */}
          <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,ease:E}}
            style={{background:'#fff',borderRadius:20,padding:'28px 28px 24px',border:'1.5px solid #e5e7eb'}}>
            <div style={{marginBottom:20}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.1em',color:'#15803d',background:'rgba(22,163,74,.1)',padding:'3px 8px',borderRadius:99}}>FREE</span>
              <div style={{...FI,fontSize:28,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',marginTop:12,marginBottom:2}}>$0<span style={{fontSize:14,fontWeight:500,color:'#9ca3af'}}>/month</span></div>
              <div style={{...FI,fontSize:13,color:'#6b7280'}}>No credit card needed</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:24}}>
              {FREE_ITEMS.map(item=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:9}}>
                  <CheckCircle2 size={14} color="#16a34a" strokeWidth={2}/>
                  <span style={{...FI,fontSize:13.5,color:'#374151'}}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/pdf-editor"
              style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                padding:'11px 0',borderRadius:12,background:'#f3f4f6',
                color:'#1d1d1f',fontSize:13.5,fontWeight:700,textDecoration:'none',letterSpacing:'-0.01em'}}>
              Start free — no signup
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:.07,ease:E}}
            style={{background:'#1d1d1f',borderRadius:20,padding:'28px 28px 24px',border:'1.5px solid #1d1d1f',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'radial-gradient(circle,rgba(8,145,178,.25),transparent)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',top:16,right:16}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'.04em',color:'#f59e0b',background:'rgba(251,191,36,.15)',border:'1px solid rgba(251,191,36,.3)',padding:'3px 8px',borderRadius:99}}>🎉 LAUNCH PRICE</span>
            </div>
            <div style={{marginBottom:20}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.1em',color:'#0891b2',background:'rgba(8,145,178,.18)',padding:'3px 8px',borderRadius:99}}>PRO</span>
              <div style={{...FI,fontSize:28,fontWeight:800,color:'#fff',letterSpacing:'-0.04em',marginTop:12,marginBottom:2}}>US$1<span style={{fontSize:14,fontWeight:500,color:'rgba(255,255,255,.5)'}}>/month</span></div>
              <div style={{...FI,fontSize:12,color:'rgba(255,255,255,.45)',lineHeight:1.55}}>Billed monthly · Cancel anytime</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:24}}>
              {PRO_ITEMS.map(item=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:9}}>
                  <CheckCircle2 size={14} color="#0891b2" strokeWidth={2}/>
                  <span style={{...FI,fontSize:13.5,color:'rgba(255,255,255,.85)'}}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/pricing"
              style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                padding:'11px 0',borderRadius:12,background:'#0891b2',
                color:'#fff',fontSize:13.5,fontWeight:700,textDecoration:'none',letterSpacing:'-0.01em'}}>
              Get Pro — $1/month
            </Link>
          </motion.div>
        </div>

        {/* Inline comparison table */}
        <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:.1,ease:E}}
          style={{background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb',overflow:'hidden',marginBottom:16}}>
          {/* Header */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 90px 110px',padding:'10px 20px',background:'#f9fafb',borderBottom:'1.5px solid #e5e7eb'}}>
            <span style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9ca3af'}}>Feature</span>
            <span style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9ca3af',textAlign:'center'}}>Free</span>
            <span style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#0891b2',textAlign:'center'}}>Pro ✦</span>
          </div>
          {COMPARE.map(({label,free,pro},i)=>(
            <div key={label} style={{display:'grid',gridTemplateColumns:'1fr 90px 110px',padding:'11px 20px',
              borderBottom: i < COMPARE.length-1 ? '1px solid #f3f4f6' : 'none',alignItems:'center'}}>
              <span style={{...FI,fontSize:13,color:'#374151',fontWeight:500}}>{label}</span>
              <span style={{textAlign:'center',fontSize:13}}>
                {free===true  ? <span style={{color:'#16a34a',fontWeight:700}}>✓</span>
                : free===false ? <span style={{color:'#d1d5db',fontSize:16,lineHeight:1}}>—</span>
                : <span style={{...FI,fontSize:11.5,color:'#6b7280',fontWeight:600}}>{free as string}</span>}
              </span>
              <span style={{textAlign:'center',fontSize:13,background:'rgba(8,145,178,.04)',margin:'0 -20px',padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {pro===true
                  ? <span style={{color:'#0891b2',fontWeight:800,fontSize:15}}>✓</span>
                  : <span style={{...FI,fontSize:11.5,color:'#0891b2',fontWeight:700}}>{pro as string}</span>}
              </span>
            </div>
          ))}
        </motion.div>

        <div style={{textAlign:'center'}}>
          <Link href="/pricing" style={{...FI,fontSize:13,color:'#9ca3af',textDecoration:'none',fontWeight:500}}>
            See full pricing & feature comparison →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function AppleHome() {
  return (
    <div style={{background:'#fff'}}>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <Nav />
      <Hero />
      <ProductDemo />
      <PopularTools />
      <UploadBox />
      <HowItWorks />
      <Apple3DScroll />
      <UseCases />
      <AllTools />
      <PrivacyNote />
      <PricingPreview />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
