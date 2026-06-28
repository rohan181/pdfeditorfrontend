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
const TOOLS: { name:string; tag:string; href:string; cat:string; Icon:LucideIcon; iconBg:string; desc:string }[] = [
  // ── AI ──────────────────────────────────────────────────────────────────────
  { name:'AI Form Filler',    tag:'LIVE', href:'/ai-pdf-form-filler', cat:'AI',       Icon:WandSparkles,    iconBg:'linear-gradient(135deg,#7c3aed,#a855f7)', desc:'Auto-fill any PDF form with AI' },
  { name:'PDF OCR Scanner',   tag:'LIVE', href:'/pdf-ocr',            cat:'AI',       Icon:ScanText,        iconBg:'linear-gradient(135deg,#6366f1,#818cf8)', desc:'Extract text from scanned PDFs' },
  { name:'PDF Summarizer',    tag:'LIVE', href:'/pdf-summarizer',     cat:'AI',       Icon:Sparkles,        iconBg:'linear-gradient(135deg,#8b5cf6,#c084fc)', desc:'Get instant AI summaries' },
  { name:'PDF Mind Map',      tag:'LIVE', href:'/mind-map',           cat:'AI',       Icon:BrainCircuit,    iconBg:'linear-gradient(135deg,#a855f7,#d946ef)', desc:'Visualise ideas from any PDF' },
  { name:'Quiz Creator',      tag:'LIVE', href:'/quiz-creator',       cat:'AI',       Icon:ClipboardList,   iconBg:'linear-gradient(135deg,#7c3aed,#6366f1)', desc:'Generate quizzes from PDF content' },
  { name:'PDF Translator',    tag:'LIVE', href:'/pdf-translator',     cat:'AI',       Icon:Languages,       iconBg:'linear-gradient(135deg,#6366f1,#06b6d4)', desc:'Translate PDFs to any language' },
  // ── Edit ────────────────────────────────────────────────────────────────────
  { name:'PDF Viewer',         tag:'LIVE', href:'/pdf-viewer',         cat:'Edit',     Icon:MonitorPlay,     iconBg:'linear-gradient(135deg,#0a84ff,#34aadc)', desc:'View any PDF in your browser' },
  { name:'PDF Editor',        tag:'LIVE', href:'/pdf-editor',         cat:'Edit',     Icon:FilePen,         iconBg:'linear-gradient(135deg,#2563eb,#3b82f6)', desc:'Edit text, images and layout' },
  { name:'PDF Annotator',     tag:'LIVE', href:'/pdf-annotate',       cat:'Edit',     Icon:MessageSquareText, iconBg:'linear-gradient(135deg,#0ea5e9,#38bdf8)', desc:'Highlight, comment and annotate' },
  // ── Pages ───────────────────────────────────────────────────────────────────
  { name:'PDF Page Manager',  tag:'LIVE', href:'/pdf-page-manager',   cat:'Pages',    Icon:Layers,          iconBg:'linear-gradient(135deg,#f59e0b,#fbbf24)', desc:'Drag-and-drop page reordering' },
  { name:'PDF Cropper',       tag:'LIVE', href:'/pdf-cropper',        cat:'Pages',    Icon:Scissors,        iconBg:'linear-gradient(135deg,#0d9488,#14b8a6)', desc:'Crop & trim PDF page margins' },
  { name:'Add Page Numbers',  tag:'LIVE', href:'/add-page-numbers',   cat:'Pages',    Icon:ListOrdered,     iconBg:'linear-gradient(135deg,#f97316,#fb923c)', desc:'Add custom page numbers to PDF' },
  { name:'Rotate PDF Pages',  tag:'LIVE', href:'/rotate-pdf',         cat:'Pages',    Icon:RotateCw,        iconBg:'linear-gradient(135deg,#ea580c,#f97316)', desc:'Rotate any pages to any angle' },
  { name:'Extract Pages',     tag:'LIVE', href:'/extract-pages',      cat:'Pages',    Icon:Scissors,        iconBg:'linear-gradient(135deg,#d97706,#f59e0b)', desc:'Pull specific pages into a new PDF' },
  { name:'Delete Pages',      tag:'LIVE', href:'/delete-pages',       cat:'Pages',    Icon:Trash2,          iconBg:'linear-gradient(135deg,#dc2626,#ef4444)', desc:'Remove unwanted pages permanently' },
  // ── Convert ─────────────────────────────────────────────────────────────────
  { name:'PDF → Word',        tag:'LIVE', href:'/pdf-to-word',        cat:'Convert',  Icon:FileType,        iconBg:'linear-gradient(135deg,#16a34a,#22c55e)', desc:'Convert PDF to editable Word doc' },
  { name:'PDF → Excel',       tag:'LIVE', href:'/pdf-to-excel',       cat:'Convert',  Icon:FileSpreadsheet, iconBg:'linear-gradient(135deg,#15803d,#16a34a)', desc:'Extract tables to spreadsheet' },
  { name:'PDF → PowerPoint',  tag:'LIVE', href:'/pdf-to-ppt',         cat:'Convert',  Icon:Presentation,    iconBg:'linear-gradient(135deg,#d97706,#f59e0b)', desc:'Turn slides into editable PPT' },
  { name:'Excel / CSV → PDF', tag:'LIVE', href:'/excel-to-pdf',       cat:'Convert',  Icon:Table,           iconBg:'linear-gradient(135deg,#059669,#10b981)', desc:'Spreadsheets to perfect PDF' },
  { name:'PPT → PDF',         tag:'LIVE', href:'/ppt-to-pdf',         cat:'Convert',  Icon:MonitorPlay,     iconBg:'linear-gradient(135deg,#b45309,#d97706)', desc:'Presentations to PDF instantly' },
  { name:'Word → PDF',         tag:'LIVE', href:'/word-to-pdf',        cat:'Convert',  Icon:FileType,        iconBg:'linear-gradient(135deg,#2563eb,#60a5fa)', desc:'Convert Word .docx to PDF' },
  { name:'TXT → PDF',          tag:'LIVE', href:'/txt-to-pdf',         cat:'Convert',  Icon:FileText,        iconBg:'linear-gradient(135deg,#6366f1,#818cf8)', desc:'Turn plain text into a PDF' },
  { name:'RTF → PDF',          tag:'LIVE', href:'/rtf-to-pdf',         cat:'Convert',  Icon:FileType,        iconBg:'linear-gradient(135deg,#b45309,#d97706)', desc:'Convert RTF documents to PDF' },
  { name:'ODT → PDF',          tag:'LIVE', href:'/odt-to-pdf',         cat:'Convert',  Icon:FileText,        iconBg:'linear-gradient(135deg,#059669,#10b981)', desc:'Convert OpenDocument Text to PDF' },
  { name:'HTML → PDF',        tag:'LIVE', href:'/html-to-pdf',        cat:'Convert',  Icon:Code,            iconBg:'linear-gradient(135deg,#0891b2,#06b6d4)', desc:'Render HTML pages as PDF' },
  { name:'Image to PDF',      tag:'LIVE', href:'/image-to-pdf',       cat:'Convert',  Icon:ImagePlus,       iconBg:'linear-gradient(135deg,#7c3aed,#8b5cf6)', desc:'Turn photos & images into PDF' },
  { name:'PDF to Images',     tag:'LIVE', href:'/pdf-to-images',      cat:'Convert',  Icon:Images,          iconBg:'linear-gradient(135deg,#db2777,#ec4899)', desc:'Export every page as an image' },
  // ── Protect ─────────────────────────────────────────────────────────────────
  { name:'PDF Password Lock', tag:'LIVE', href:'/pdf-password-lock',  cat:'Protect',  Icon:KeyRound,        iconBg:'linear-gradient(135deg,#dc2626,#ef4444)', desc:'Encrypt with a strong password' },
  { name:'PDF Watermarker',   tag:'LIVE', href:'/pdf-watermark',      cat:'Protect',  Icon:Stamp,           iconBg:'linear-gradient(135deg,#2563eb,#60a5fa)', desc:'Add visible or hidden watermarks' },
  { name:'PDF Redactor',      tag:'LIVE', href:'/pdf-redactor',       cat:'Protect',  Icon:EyeOff,          iconBg:'linear-gradient(135deg,#374151,#6b7280)', desc:'Permanently black out sensitive text' },
  { name:'PDF E-Signer',      tag:'LIVE', href:'/pdf-signer',         cat:'Protect',  Icon:PenTool,         iconBg:'linear-gradient(135deg,#0d9488,#14b8a6)', desc:'Sign and collect signatures' },
  // ── Organize ────────────────────────────────────────────────────────────────
  { name:'PDF Compressor',    tag:'LIVE', href:'/pdf-compressor',     cat:'Organize', Icon:Minimize2,       iconBg:'linear-gradient(135deg,#d97706,#fbbf24)', desc:'Shrink file size without quality loss' },
  { name:'PDF Merger',        tag:'LIVE', href:'/pdf-merger',         cat:'Organize', Icon:Merge,           iconBg:'linear-gradient(135deg,#7c3aed,#8b5cf6)', desc:'Combine multiple PDFs into one' },
  { name:'PDF Splitter',      tag:'LIVE', href:'/pdf-splitter',       cat:'Organize', Icon:Split,           iconBg:'linear-gradient(135deg,#e11d48,#f43f5e)', desc:'Split one PDF into many files' },
  { name:'PDF Form Builder',  tag:'LIVE', href:'/pdf-form-builder',   cat:'Organize', Icon:FormInput,       iconBg:'linear-gradient(135deg,#0369a1,#0ea5e9)', desc:'Create fillable PDF forms' },
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

  /* Mobile accordion — CSS grid trick, GPU-composited, no JS layout reads */
  .mob-acc       { display:grid; grid-template-rows:0fr; transition:grid-template-rows .2s ease; }
  .mob-acc.open  { grid-template-rows:1fr; }
  .mob-acc > div { overflow:hidden; }

  /* Chevron rotation via CSS — no Framer Motion needed */
  .mob-chev      { display:flex; transition:transform .18s ease; }
  .mob-chev.open { transform:rotate(90deg); }

  /* Remove 300ms tap delay on all nav buttons */
  .mob-cat-btn   { touch-action:manipulation; -webkit-tap-highlight-color:transparent; }

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
  .scr-sticky { position:-webkit-sticky; position:sticky; will-change:transform; }
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
  const { scrollYProgress } = useScroll()
  const pct = useTransform(scrollYProgress, v => String(Math.round(v * 100)).padStart(2, '0') + '%')
  return <motion.span style={{fontVariantNumeric:'tabular-nums'}}>{pct}</motion.span>
}

// ══════════════════════════════════════════════════════════════════════════════
//  BROWSER UI MOCKUP
// ══════════════════════════════════════════════════════════════════════════════
function BrowserUI() {
  return (
    <div style={{borderRadius:16,border:'1px solid rgba(0,0,0,.08)',overflow:'hidden',boxShadow:'0 24px 80px -16px rgba(0,0,0,.12)'}}>
      {/* Chrome */}
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
      <div style={{height:380,background:'#fff',display:'grid',gridTemplateColumns:'40px 1fr 180px',gridTemplateRows:'32px 1fr',...FI}}>
        <div style={{gridColumn:'1/-1',background:'#F5F5F7',borderBottom:'1px solid rgba(0,0,0,.06)',display:'flex',alignItems:'center',padding:'0 10px',gap:5}}>
          {[MousePointer2,ScanLine,PenLine,Layers].map((Icon,i)=>(
            <div key={i} style={{width:22,height:22,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',background:i===0?'#1d1d1f':'transparent',color:i===0?'#fff':'rgba(0,0,0,.3)'}}>
              <Icon size={10} strokeWidth={1.8}/>
            </div>
          ))}
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:4,padding:'2px 9px',background:RED,borderRadius:99}}>
            <Zap size={8} color="#fff" strokeWidth={2.5}/><span style={{fontSize:8.5,color:'#fff',fontWeight:700}}>AI FILL</span>
          </div>
        </div>
        <div style={{background:'#F5F5F7',borderRight:'1px solid rgba(0,0,0,.06)',display:'flex',flexDirection:'column',alignItems:'center',padding:'9px 0',gap:4}}>
          {[MousePointer2,ScanLine,PenLine].map((Icon,i)=>(
            <div key={i} style={{width:24,height:24,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',background:i===0?'rgba(0,0,0,.08)':'transparent',color:i===0?'#1d1d1f':'rgba(0,0,0,.25)'}}>
              <Icon size={11} strokeWidth={1.8}/>
            </div>
          ))}
        </div>
        {/* PDF */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'14px 10px',overflow:'hidden'}}>
          <div style={{background:'#fff',borderRadius:4,boxShadow:'0 4px 20px rgba(0,0,0,.1)',width:'100%',maxWidth:260,padding:'16px 14px',position:'relative',overflow:'hidden',border:'1px solid #f0f0f0'}}>
            <div style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(99,102,241,.85) 35%,rgba(167,139,250,1) 50%,rgba(99,102,241,.85) 65%,transparent)',boxShadow:'0 0 10px rgba(99,102,241,.5)',animation:'ocrscan 2.8s linear infinite',zIndex:5}}/>
            <div style={{fontSize:7.5,fontWeight:800,letterSpacing:'0.1em',color:'#1d1d1f',marginBottom:2}}>INVOICE #2025-089</div>
            <div style={{fontSize:6.5,color:'#ccc',marginBottom:10}}>Acme Corporation · NET 30</div>
            <div style={{height:1,background:'#f0f0f0',marginBottom:10}}/>
            {[['Bill To','Acme Corp.','0.2s','0.48s'],['Amount','$12,400.00','1.0s','1.28s'],['Due Date','Dec 30, 2025','1.8s','2.08s']].map(([label,val,d1,d2])=>(
              <div key={label} style={{marginBottom:8}}>
                <div style={{fontSize:6,color:'#bbb',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>{label}</div>
                <div style={{position:'relative',height:20,border:'1px solid #e8eaed',borderRadius:4,display:'flex',alignItems:'center',padding:'0 6px',overflow:'hidden'}}>
                  <span style={{fontSize:8,color:'#1d1d1f',fontWeight:500,animation:`fin .35s ${d1} both`,opacity:0}}>{val}</span>
                  <span style={{position:'absolute',right:5,fontSize:10,animation:`chk .35s ${d2} both`,opacity:0,color:'#22c55e'}}>✓</span>
                </div>
              </div>
            ))}
            <div>
              <div style={{fontSize:6,color:'#bbb',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>Signature</div>
              <div style={{height:26,border:'1px dashed #e8eaed',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="110" height="20" viewBox="0 0 110 20" fill="none">
                  <path d="M5 14 C13 4 20 18 28 10 C36 3 45 16 55 8 C64 2 73 15 82 8 C90 3 98 14 106 10"
                    stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="340"
                    style={{animation:'sigdraw 3.5s ease-in-out infinite'}}/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* AI panel */}
        <div style={{background:'#F5F5F7',borderLeft:'1px solid rgba(0,0,0,.06)',padding:'10px 9px',display:'flex',flexDirection:'column',gap:7}}>
          <div style={{...MONO,fontSize:8,fontWeight:700,color:'rgba(0,0,0,.4)',letterSpacing:'0.1em',textTransform:'uppercase'}}>AI ASSIST</div>
          {[{t:'3 fields found',s:'done',d:'0.3s'},{t:'Mapping data',s:'done',d:'1.0s'},{t:'Filling…',s:'active',d:'1.8s'}].map(({t,s,d})=>(
            <div key={t} style={{display:'flex',alignItems:'center',gap:5,animation:`fin .35s ${d} both`,opacity:0}}>
              <div style={{width:5,height:5,borderRadius:'50%',flexShrink:0,background:s==='done'?'#22c55e':RED,...(s==='active'?{animation:'pdot 1.6s ease-in-out infinite'}:{})}}/>
              <span style={{fontSize:8,color:'rgba(0,0,0,.45)'}}>{t}</span>
            </div>
          ))}
          <div style={{marginTop:'auto',borderTop:'1px solid rgba(0,0,0,.06)',paddingTop:7}}>
            <div style={{height:3,background:'rgba(0,0,0,.07)',borderRadius:99,overflow:'hidden',marginBottom:4}}>
              <div style={{height:'100%',width:'96%',background:'#22c55e',borderRadius:99}}/>
            </div>
            <div style={{fontSize:8.5,color:'rgba(0,0,0,.5)',fontWeight:700}}>96% ready</div>
          </div>
          <div style={{height:28,background:'#1d1d1f',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
            <Download size={9} color="#fff" strokeWidth={2.5}/><span style={{...FI,fontSize:8.5,color:'#fff',fontWeight:700}}>Download</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  NAV  — mega-menu on desktop · accordion on mobile
// ══════════════════════════════════════════════════════════════════════════════
// Short labels so all 6 fit in the bar even at ~960 px
const NAV_LABELS: Record<string,string> = {
  AI:'AI', Edit:'Edit', Pages:'Pages', Convert:'Convert', Protect:'Protect', Organize:'Organize',
}

function Nav() {
  const { isSignedIn, isLoaded } = useUser()
  const [openCat, setOpenCat] = useState<string|null>(null)
  const [mobOpen, setMobOpen] = useState(false)
  const [mobExp,  setMobExp]  = useState<string|null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>|null>(null)

  const activeCat  = CATS.find(c => c.id === openCat)
  const megaTools  = activeCat ? TOOLS.filter(t => t.cat === activeCat.id) : []

  const open  = (id:string) => { clearTimeout(closeTimer.current!); setOpenCat(id) }
  const close = ()          => { closeTimer.current = setTimeout(()=>setOpenCat(null), 120) }
  const keep  = ()          => { clearTimeout(closeTimer.current!) }

  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY,[0,80],['rgba(255,255,255,0)','rgba(255,255,255,0.96)'])

  return (
    <>
      {/* ── Fixed header bar ── */}
      <motion.header
        style={{position:'fixed',inset:'0 0 auto',zIndex:300,height:56,
          background:navBg,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(0,0,0,.07)'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 20px',height:'100%',
          display:'flex',alignItems:'center',gap:0}}>

          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none',
            marginRight:20,flexShrink:0}}>
            <motion.div whileHover={{rotate:12,scale:1.1}} transition={SP}
              style={{width:28,height:28,background:'#1d1d1f',borderRadius:7,display:'flex',
                alignItems:'center',justifyContent:'center'}}>
              <FileText size={14} color="#fff" strokeWidth={2.2}/>
            </motion.div>
            <span style={{...FI,fontSize:15,fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.04em'}}>
              Edit<span style={{color:RED}}>PDF</span> AI
            </span>
          </Link>

          {/* Desktop nav — compact labels, icon + short text */}
          <nav className="desk" style={{alignItems:'center',gap:1,flex:1}}>
            {CATS.map(cat => {
              const isOpen = openCat === cat.id
              return (
                <button key={cat.id}
                  onMouseEnter={()=>open(cat.id)}
                  onMouseLeave={close}
                  style={{
                    display:'flex',alignItems:'center',gap:5,
                    padding:'5px 10px',background: isOpen ? `${cat.color}10` : 'transparent',
                    border:'none',borderRadius:8,cursor:'pointer',outline:'none',
                    fontSize:12.5,fontWeight:isOpen?600:500,
                    color: isOpen ? cat.color : 'rgba(0,0,0,.52)',
                    ...FI,transition:'all .13s',flexShrink:0,
                  }}>
                  <cat.Icon size={13} strokeWidth={isOpen?2.2:1.9} color={isOpen ? cat.color : 'rgba(0,0,0,.4)'}/>
                  {NAV_LABELS[cat.id]}
                  <motion.span style={{display:'flex',alignItems:'center',opacity:.6}}
                    animate={{rotate: isOpen?180:0}} transition={{duration:.14}}>
                    <ChevronDown size={10} strokeWidth={2.5}/>
                  </motion.span>
                </button>
              )
            })}
            <div style={{width:1,height:16,background:'rgba(0,0,0,.1)',margin:'0 6px',flexShrink:0}}/>
            <Link href="#tools" style={{textDecoration:'none'}}>
              <motion.span whileHover={{color:'#1d1d1f'}}
                style={{...FI,display:'inline-flex',alignItems:'center',gap:4,padding:'5px 10px',
                  fontSize:12.5,fontWeight:500,color:'rgba(0,0,0,.45)',borderRadius:8}}>
                All Tools
              </motion.span>
            </Link>
          </nav>

          {/* CTA + auth + mobile toggle */}
          <div style={{display:'flex',alignItems:'center',gap:8,marginLeft:'auto',flexShrink:0}}>
            {/* Auth buttons */}
            {isLoaded && (
              isSignedIn ? (
                <div className="desk" style={{display:'flex',alignItems:'center',gap:8}}>
                  <Link href="/dashboard"
                    style={{...FI,fontSize:12.5,fontWeight:500,color:'rgba(0,0,0,.55)',
                      textDecoration:'none',padding:'5px 10px',borderRadius:8}}>
                    Dashboard
                  </Link>
                  <UserButton />
                </div>
              ) : (
                <div className="desk" style={{display:'flex',alignItems:'center',gap:6}}>
                  <SignInButton mode="modal">
                    <button style={{...FI,fontSize:12.5,fontWeight:500,color:'rgba(0,0,0,.6)',
                      background:'transparent',border:'none',padding:'6px 12px',borderRadius:8,
                      cursor:'pointer',letterSpacing:'-0.01em'}}>
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button style={{...FI,fontSize:12.5,fontWeight:600,color:'#fff',
                      background:'#1d1d1f',border:'none',padding:'6px 14px',borderRadius:99,
                      cursor:'pointer',letterSpacing:'-0.02em'}}>
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              )
            )}
            <Link href="/ai-pdf-form-filler" className="desk"
              style={{...FI,alignItems:'center',gap:6,padding:'7px 16px',
                background:RED,color:'#fff',borderRadius:99,fontSize:12.5,fontWeight:700,
                textDecoration:'none',letterSpacing:'-0.02em',flexShrink:0}}>
              <motion.span style={{display:'flex',alignItems:'center',gap:6}}
                whileHover={{gap:10}} transition={SP}>
                Open Editor <ArrowRight size={12} strokeWidth={2.5}/>
              </motion.span>
            </Link>
            <motion.button className="mob" whileTap={{scale:.9}} onClick={()=>setMobOpen(o=>!o)}
              style={{width:36,height:36,borderRadius:8,border:'1px solid rgba(0,0,0,.12)',
                background:'#fff',alignItems:'center',justifyContent:'center',
                cursor:'pointer',flexShrink:0}}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mobOpen?'x':'m'}
                  initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}}
                  exit={{rotate:90,opacity:0}} transition={{duration:.15}}>
                  {mobOpen
                    ? <X size={16} color="#1d1d1f" strokeWidth={2}/>
                    : <Menu size={16} color="#1d1d1f" strokeWidth={2}/>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Mega-menu panel — fixed below header, never clips ── */}
      <AnimatePresence>
        {openCat && activeCat && (
          <>
            {/* Backdrop — click closes */}
            <motion.div
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              transition={{duration:.15}}
              onClick={()=>setOpenCat(null)}
              style={{position:'fixed',inset:'56px 0 0',zIndex:298,
                background:'rgba(0,0,0,.22)',backdropFilter:'blur(2px)'}}
            />
            {/* Panel */}
            <motion.div
              key={openCat}
              initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
              transition={{duration:.18,ease:[.22,1,.36,1]}}
              onMouseEnter={keep} onMouseLeave={close}
              style={{position:'fixed',top:56,left:0,right:0,zIndex:299,
                background:'#fff',borderBottom:'1px solid rgba(0,0,0,.07)',
                boxShadow:'0 16px 48px rgba(0,0,0,.12)'}}>

              <div style={{maxWidth:1280,margin:'0 auto',padding:'20px 24px 24px'}}>

                {/* Category header row */}
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18,
                  paddingBottom:14,borderBottom:`2px solid ${activeCat.color}18`}}>
                  <div style={{width:38,height:38,borderRadius:11,background:activeCat.light,
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <activeCat.Icon size={19} color={activeCat.color} strokeWidth={1.8}/>
                  </div>
                  <div>
                    <div style={{...FI,fontSize:14,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.02em'}}>
                      {activeCat.label}
                    </div>
                    <div style={{...FI,fontSize:11,color:'#9ca3af',marginTop:1}}>{activeCat.desc}</div>
                  </div>
                  <div style={{...MONO,fontSize:10,fontWeight:700,color:activeCat.color,
                    background:activeCat.light,padding:'3px 10px',borderRadius:99,marginLeft:6}}>
                    {megaTools.length} tools
                  </div>
                  <Link href={`#cat-${activeCat.id}`} onClick={()=>setOpenCat(null)}
                    style={{...FI,marginLeft:'auto',display:'flex',alignItems:'center',gap:5,
                      fontSize:12,fontWeight:600,color:activeCat.color,textDecoration:'none',
                      padding:'6px 14px',borderRadius:99,background:activeCat.light,flexShrink:0}}>
                    See all <ArrowRight size={11} strokeWidth={2.5}/>
                  </Link>
                </div>

                {/* Tools grid — 4 cols max, auto for small counts */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns:`repeat(${Math.min(megaTools.length, 4)},1fr)`,
                  gap:6,
                }}>
                  {megaTools.map(tool => (
                    <Link key={tool.name} href={tool.href}
                      onClick={()=>setOpenCat(null)} style={{textDecoration:'none'}}>
                      <motion.div
                        whileHover={{background:'#f5f5f7',scale:1.01}}
                        transition={{duration:.1}}
                        style={{display:'flex',alignItems:'center',gap:11,
                          padding:'10px 12px',borderRadius:12,cursor:'pointer'}}>
                        {/* Icon chip — fixed size, never clips */}
                        <div style={{
                          width:36,height:36,minWidth:36,borderRadius:10,
                          background:tool.iconBg,flexShrink:0,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          boxShadow:`0 4px 10px ${activeCat.color}28`,
                        }}>
                          <tool.Icon size={17} color="#fff" strokeWidth={1.8}/>
                        </div>
                        <div style={{minWidth:0,flex:1}}>
                          <div style={{...FI,fontSize:12.5,fontWeight:600,color:'#1d1d1f',
                            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {tool.name}
                          </div>
                          <div style={{...FI,fontSize:10.5,color:'#9ca3af',marginTop:2,
                            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {tool.desc}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile menu — full-screen drawer ── */}
      <AnimatePresence>
        {mobOpen && (
          <motion.div
            initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            transition={{duration:.2,ease:E}}
            style={{position:'fixed',inset:'56px 0 0',zIndex:290,
              background:'#f7f7f8',display:'flex',flexDirection:'column'}}>

            {/* Scrollable category list */}
            <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
              {CATS.map((cat) => {
                const catTools = TOOLS.filter(t => t.cat === cat.id)
                const expanded = mobExp === cat.id
                return (
                  <div key={cat.id} style={{borderBottom:'1px solid rgba(0,0,0,.06)'}}>

                    {/* Category tap row — big, thumb-friendly */}
                    <button onClick={()=>setMobExp(expanded ? null : cat.id)}
                      className="mob-cat-btn"
                      style={{
                        width:'100%',display:'flex',alignItems:'center',gap:14,
                        padding:'14px 20px',minHeight:68,
                        background: expanded ? '#fff' : 'transparent',
                        border:'none',cursor:'pointer',textAlign:'left',
                      }}>
                      <div style={{
                        width:44,height:44,minWidth:44,borderRadius:13,
                        background: expanded ? cat.color : cat.light,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        flexShrink:0,transition:'background .15s',
                      }}>
                        <cat.Icon size={21} color={expanded ? '#fff' : cat.color} strokeWidth={1.8}/>
                      </div>
                      <div style={{flex:1,minWidth:0,textAlign:'left'}}>
                        <div style={{...FI,fontSize:16,fontWeight:700,color:'#1d1d1f',
                          letterSpacing:'-0.02em'}}>{cat.label}</div>
                        <div style={{...FI,fontSize:12,color:'#9ca3af',marginTop:2}}>
                          {catTools.length} tools
                        </div>
                      </div>
                      <span className={`mob-chev${expanded ? ' open' : ''}`} style={{flexShrink:0}}>
                        <ChevronRight size={20} color={expanded ? cat.color : 'rgba(0,0,0,.25)'} strokeWidth={2}/>
                      </span>
                    </button>

                    {/* Tool rows — CSS grid accordion, no JS animation */}
                    <div className={`mob-acc${expanded ? ' open' : ''}`}>
                      <div style={{borderTop:`3px solid ${cat.color}20`,background:'#fff'}}>
                        {catTools.map((tool, ti) => (
                          <Link key={tool.name} href={tool.href}
                            onClick={()=>setMobOpen(false)} style={{textDecoration:'none'}}>
                            <div style={{
                              display:'flex',alignItems:'center',gap:14,
                              padding:'13px 20px 13px 20px',
                              borderBottom: ti < catTools.length-1 ? '1px solid #f5f5f5' : 'none',
                              background:'#fff',
                              WebkitTapHighlightColor:'transparent',
                            }}>
                              {/* Icon */}
                              <div style={{
                                width:40,height:40,minWidth:40,borderRadius:11,
                                background:tool.iconBg,flexShrink:0,
                                display:'flex',alignItems:'center',justifyContent:'center',
                                boxShadow:`0 4px 10px ${cat.color}22`,
                              }}>
                                <tool.Icon size={19} color="#fff" strokeWidth={1.8}/>
                              </div>
                              {/* Text */}
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{...FI,fontSize:14,fontWeight:600,color:'#1d1d1f'}}>
                                  {tool.name}
                                </div>
                                <div style={{...FI,fontSize:12,color:'#9ca3af',marginTop:2,
                                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                  {tool.desc}
                                </div>
                              </div>
                              {/* Arrow */}
                              <div style={{
                                width:28,height:28,minWidth:28,borderRadius:8,
                                background:`${cat.color}12`,flexShrink:0,
                                display:'flex',alignItems:'center',justifyContent:'center',
                              }}>
                                <ArrowRight size={13} color={cat.color} strokeWidth={2.2}/>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sticky bottom CTA — always visible */}
            <div style={{
              background:'#fff',
              borderTop:'1px solid rgba(0,0,0,.08)',
              padding:'12px 16px',
              paddingBottom:'calc(12px + env(safe-area-inset-bottom))',
              flexShrink:0,
            }}>
              <Link href="/ai-pdf-form-filler" onClick={()=>setMobOpen(false)}
                style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                  padding:'16px',background:'#1d1d1f',color:'#fff',borderRadius:14,
                  fontSize:16,fontWeight:700,textDecoration:'none'}}>
                Open Editor Free <ArrowRight size={16} strokeWidth={2.5}/>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  HERO — split: text left · browser mockup right
// ══════════════════════════════════════════════════════════════════════════════
function Hero() {
  const { scrollY } = useScroll()
  const textY = useTransform(scrollY, [0, 500], [0, -60])

  return (
    <section style={{background:'#fff',minHeight:'100svh',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:54}}>

      {/* Dot grid */}
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(0,0,0,.04) 1px, transparent 1px)',backgroundSize:'36px 36px',pointerEvents:'none'}}/>

      {/* Ambient glows */}
      <div style={{position:'absolute',top:'-20%',left:'-10%',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle, rgba(226,75,74,.10) 0%, transparent 70%)',filter:'blur(80px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-15%',right:'-5%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle, rgba(99,102,241,.07) 0%, transparent 70%)',filter:'blur(80px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'30%',right:'20%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle, rgba(226,75,74,.05) 0%, transparent 70%)',filter:'blur(60px)',pointerEvents:'none'}}/>

      {/* Content grid */}
      <motion.div style={{y:textY,maxWidth:1200,margin:'0 auto',padding:'0 clamp(16px,5vw,48px)',width:'100%',position:'relative',zIndex:2}}>
        <div className="hero-grid">

          {/* ── LEFT: text ── */}
          <div>
            {/* Eyebrow */}
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.1}}
              style={{display:'flex',alignItems:'center',gap:10,marginBottom:32}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:RED,display:'inline-block',animation:'pdot 2s ease-in-out infinite'}}/>
              <span style={{...MONO,fontSize:10.5,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase'}}>AI PDF Platform · Free · No Account</span>
            </motion.div>

            {/* Headline — "Edit any PDF. In seconds." with shimmer on "seconds." */}
            <motion.h1 variants={MV} initial="hidden" animate="visible"
              style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(40px,5.8vw,96px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.95,margin:'0 0 24px',display:'flex',flexWrap:'wrap',gap:'0 .22em'}}>
              {['Edit','any','PDF.','In'].map((w,i)=>(
                <span key={i} style={{display:'inline-block',overflow:'hidden',lineHeight:1.06}}>
                  <motion.span style={{display:'inline-block'}} variants={WV}>{w}</motion.span>
                </span>
              ))}
              <span style={{display:'inline-block',overflow:'hidden',lineHeight:1.06}}>
                <motion.span className="grad-red" style={{display:'inline-block'}} variants={WV}>seconds.</motion.span>
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.7}}
              style={{...FI,fontSize:'clamp(15px,1.6vw,18px)',color:'#6E6E73',lineHeight:1.65,maxWidth:400,margin:'0 0 32px',letterSpacing:'-0.01em',fontWeight:400}}>
              Edit, sign, fill and convert PDFs — all in your browser, completely free.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.85}}
              className="hero-ctas">
              <Mag>
                <Link href="/ai-pdf-form-filler"
                  style={{...FI,display:'inline-flex',alignItems:'center',gap:8,padding:'14px 28px',background:'#1d1d1f',color:'#fff',borderRadius:99,fontSize:15,fontWeight:700,textDecoration:'none',letterSpacing:'-0.025em',boxShadow:'0 4px 28px rgba(0,0,0,.16)'}}>
                  <motion.span style={{display:'flex',alignItems:'center',gap:8}} whileHover={{gap:14}} transition={SP}>
                    Try free now <ArrowRight size={15} strokeWidth={2.5}/>
                  </motion.span>
                </Link>
              </Mag>
              <Mag>
                <a href="#tools"
                  style={{...FI,display:'inline-flex',alignItems:'center',gap:6,padding:'14px 22px',background:'transparent',color:'rgba(0,0,0,.5)',border:'1px solid rgba(0,0,0,.12)',borderRadius:99,fontSize:15,fontWeight:500,textDecoration:'none',letterSpacing:'-0.01em'}}>
                  29 tools <ChevronRight size={14} strokeWidth={2}/>
                </a>
              </Mag>
            </motion.div>

            {/* Trust row */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,delay:1.05}}
              className="hero-trust">
              <span style={{color:'#f59e0b',fontSize:12,letterSpacing:2}}>★★★★★</span>
              {['Free forever','No signup','100% private','In-browser'].map((t,i)=>(
                <span key={t} style={{display:'flex',alignItems:'center',gap:6}}>
                  {i>0&&<span style={{width:3,height:3,borderRadius:'50%',background:'#ddd',display:'inline-block'}}/>}
                  <span style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)',letterSpacing:'0.06em',textTransform:'uppercase'}}>{t}</span>
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
              { label:'AI Form Fill', Icon:Zap,      color:'#6366f1', delay:1.0, pos:{ top:'-16px',  left:'-20px'  } },
              { label:'E-Sign',       Icon:PenLine,  color:RED,       delay:1.2, pos:{ bottom:'70px', left:'-24px'  } },
              { label:'OCR Scan',     Icon:ScanLine, color:'#22c55e', delay:1.4, pos:{ top:'38%',     right:'-22px' } },
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
      </motion.div>

      {/* Bottom bar */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,delay:1.2}}
        style={{position:'absolute',bottom:0,left:0,right:0,height:44,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',borderTop:'1px solid rgba(0,0,0,.06)',zIndex:3}}>
        <div style={{...MONO,fontSize:11,color:'#999',letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:20,height:1,background:'rgba(0,0,0,.15)',display:'inline-block'}}/>
          <ScrollPct/>
        </div>
        <div className="desk" style={{gap:24}}>
          {['29 Tools','Free Forever','No Account','100% Private'].map(t=>(
            <span key={t} style={{...MONO,fontSize:10,color:'#bbb',letterSpacing:'0.08em',textTransform:'uppercase'}}>{t}</span>
          ))}
        </div>
        <motion.div animate={{y:[0,5,0]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut'}}
          style={{display:'flex',alignItems:'center',gap:7}}>
          <span style={{...MONO,fontSize:10,color:'#999',letterSpacing:'0.1em',textTransform:'uppercase'}}>Scroll</span>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <rect x=".75" y=".75" width="12.5" height="16.5" rx="6.25" stroke="rgba(0,0,0,.2)" strokeWidth="1.5"/>
            <motion.rect x="5.5" y="4" width="3" height="4" rx="1.5" fill="rgba(0,0,0,.25)"
              animate={{y:[0,5,0],opacity:[1,.2,1]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut'}}/>
          </svg>
        </motion.div>
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
          <div style={{...FI,fontSize:13,color:'#6E6E73',marginBottom:24,lineHeight:1.6}}>or click to browse · any size · stays private</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 26px',background:'#6366f1',borderRadius:99,fontSize:13,fontWeight:600,color:'#fff',cursor:'default'}}>
            <Upload size={13} strokeWidth={2}/> Choose PDF File
          </div>
        </motion.div>
        <div style={{...MONO,fontSize:9,color:'#bbb',letterSpacing:'0.1em',textTransform:'uppercase'}}>PDF · Any size · Runs in your browser</div>
      </div>
    </div>
  )
}

function ScreenScan() {
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:'22px 18px',position:'relative',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,.10)',border:'1px solid #e8e8e8'}}>
        <motion.div
          animate={{top:['-2%','102%']}}
          transition={{duration:2.2,repeat:Infinity,ease:'linear',repeatDelay:.6}}
          style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(99,102,241,.9) 30%,rgba(167,139,250,1) 50%,rgba(99,102,241,.9) 70%,transparent)',boxShadow:'0 0 14px rgba(99,102,241,.4)',zIndex:5,pointerEvents:'none'}}/>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div style={{...FI,fontSize:9.5,fontWeight:800,letterSpacing:'0.1em',color:'#1d1d1f'}}>INVOICE #2025-089</div>
          <motion.div animate={{opacity:[1,.35,1]}} transition={{duration:1.1,repeat:Infinity}}
            style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',background:'rgba(99,102,241,.07)',border:'1px solid rgba(99,102,241,.18)',borderRadius:99}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#6366f1',display:'inline-block'}}/>
            <span style={{...MONO,fontSize:8,color:'#6366f1',letterSpacing:'0.06em'}}>SCANNING</span>
          </motion.div>
        </div>
        <div style={{height:1,background:'#f0f0f0',marginBottom:14}}/>

        {[{label:'Bill To',delay:0},{label:'Amount',delay:.5},{label:'Due Date',delay:1}].map(({label,delay})=>(
          <div key={label} style={{marginBottom:11}}>
            <div style={{fontSize:7,color:'#bbb',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:3}}>{label}</div>
            <motion.div
              animate={{borderColor:['rgba(99,102,241,.15)','rgba(99,102,241,.7)','rgba(99,102,241,.15)'],background:['rgba(99,102,241,.01)','rgba(99,102,241,.05)','rgba(99,102,241,.01)']}}
              transition={{duration:1.8,repeat:Infinity,delay,ease:'easeInOut'}}
              style={{height:26,borderRadius:6,border:'1.5px solid rgba(99,102,241,.15)',display:'flex',alignItems:'center',padding:'0 10px',gap:8}}>
              <motion.div animate={{width:['10%','70%','10%']}} transition={{duration:1.8,repeat:Infinity,delay,ease:'easeInOut'}}
                style={{height:6,borderRadius:99,background:'rgba(99,102,241,.2)'}}/>
            </motion.div>
          </div>
        ))}

        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.8,duration:.5}}
          style={{marginTop:10,display:'flex',alignItems:'center',gap:6,padding:'7px 11px',background:'rgba(99,102,241,.05)',border:'1px solid rgba(99,102,241,.12)',borderRadius:8}}>
          <ScanLine size={11} color="#6366f1" strokeWidth={2}/>
          <span style={{...FI,fontSize:11,color:'#6366f1',fontWeight:500}}>3 fields detected</span>
        </motion.div>
      </div>
    </div>
  )
}

function ScreenFill() {
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:'22px 18px',boxShadow:'0 8px 32px rgba(0,0,0,.10)',border:'1px solid #e8e8e8'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div style={{...FI,fontSize:9.5,fontWeight:800,letterSpacing:'0.1em',color:'#1d1d1f'}}>INVOICE #2025-089</div>
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',background:'rgba(226,75,74,.07)',border:'1px solid rgba(226,75,74,.18)',borderRadius:99}}>
            <Zap size={8} color={RED} strokeWidth={2.5}/>
            <span style={{...MONO,fontSize:8,color:RED,letterSpacing:'0.06em'}}>AI FILLING</span>
          </div>
        </div>
        <div style={{height:1,background:'#f0f0f0',marginBottom:14}}/>

        {[
          {label:'Bill To',  val:'Acme Corporation', d1:'.2s', d2:'.45s', done:true},
          {label:'Amount',   val:'$12,400.00',        d1:'.9s', d2:'1.15s',done:true},
          {label:'Due Date', val:'Dec 30, 2025',      d1:'1.7s',d2:'1.95s',done:false},
        ].map(({label,val,d1,d2,done})=>(
          <div key={label} style={{marginBottom:11}}>
            <div style={{fontSize:7,color:'#bbb',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:3}}>{label}</div>
            <div style={{position:'relative',height:26,borderRadius:6,border:`1.5px solid ${done?'rgba(34,197,94,.3)':'rgba(226,75,74,.35)'}`,background:done?'rgba(34,197,94,.03)':'rgba(226,75,74,.02)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 9px',overflow:'hidden'}}>
              <span style={{...FI,fontSize:9.5,color:'#1d1d1f',fontWeight:500,animation:`fin .38s ${d1} both`,opacity:0}}>{val}</span>
              {done && <span style={{fontSize:13,animation:`chk .38s ${d2} both`,opacity:0,color:'#22c55e',flexShrink:0}}>✓</span>}
              {!done && <motion.span animate={{opacity:[1,0,1]}} transition={{duration:.65,repeat:Infinity}} style={{...FI,fontSize:14,color:RED,lineHeight:1,flexShrink:0}}>|</motion.span>}
            </div>
          </div>
        ))}

        <div style={{marginTop:12,display:'flex',alignItems:'center',gap:10}}>
          <div style={{flex:1,height:4,background:'#f0f0f0',borderRadius:99,overflow:'hidden'}}>
            <motion.div initial={{width:'0%'}} animate={{width:'66%'}} transition={{duration:.9,delay:.4,ease:[0.22,1,0.36,1]}}
              style={{height:'100%',background:'#22c55e',borderRadius:99}}/>
          </div>
          <span style={{...MONO,fontSize:9,color:'rgba(0,0,0,.38)',whiteSpace:'nowrap'}}>2 / 3 filled</span>
        </div>
      </div>
    </div>
  )
}

function ScreenDone() {
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:'22px 18px',boxShadow:'0 8px 32px rgba(0,0,0,.10)',border:'1px solid #e8e8e8'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div style={{...FI,fontSize:9.5,fontWeight:800,letterSpacing:'0.1em',color:'#1d1d1f'}}>INVOICE #2025-089</div>
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.2)',borderRadius:99}}>
            <CheckCircle2 size={9} color="#22c55e" strokeWidth={2.5}/>
            <span style={{...MONO,fontSize:8,color:'#22c55e',letterSpacing:'0.06em'}}>COMPLETE</span>
          </div>
        </div>
        <div style={{height:1,background:'#f0f0f0',marginBottom:14}}/>

        {[['Bill To','Acme Corporation'],['Amount','$12,400.00'],['Due Date','Dec 30, 2025']].map(([label,val])=>(
          <div key={label} style={{marginBottom:11}}>
            <div style={{fontSize:7,color:'#bbb',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:3}}>{label}</div>
            <div style={{height:26,borderRadius:6,border:'1.5px solid rgba(34,197,94,.3)',background:'rgba(34,197,94,.03)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 9px'}}>
              <span style={{...FI,fontSize:9.5,color:'#1d1d1f',fontWeight:500}}>{val}</span>
              <CheckCircle2 size={13} color="#22c55e" strokeWidth={2.5}/>
            </div>
          </div>
        ))}

        <div style={{marginBottom:14}}>
          <div style={{fontSize:7,color:'#bbb',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:3}}>Signature</div>
          <div style={{height:32,border:'1px dashed #e4e4e7',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="120" height="22" viewBox="0 0 120 22" fill="none">
              <path d="M5 14 C13 4 20 18 28 10 C36 3 46 16 56 8 C65 2 74 15 83 8 C91 3 100 14 108 10"
                stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="340"
                style={{animation:'sigdraw 3.5s ease-in-out infinite'}}/>
            </svg>
          </div>
        </div>

        <motion.div whileHover={{scale:1.02}} whileTap={{scale:.97}} transition={SP}
          style={{height:40,background:'#22c55e',borderRadius:99,display:'flex',alignItems:'center',justifyContent:'center',gap:7,cursor:'pointer',boxShadow:'0 4px 16px rgba(34,197,94,.25)'}}>
          <Download size={14} color="#fff" strokeWidth={2.5}/>
          <span style={{...FI,fontSize:13,color:'#fff',fontWeight:700}}>Download filled PDF</span>
        </motion.div>
      </div>
    </div>
  )
}

const GSTEPS = [
  { n:'01', color:'#818cf8', label:'Upload',   headline:'Drop it.',      body:'Any PDF, any size, any format. Drag it in.',                         Screen:ScreenDrop },
  { n:'02', color:'#a78bfa', label:'Scan',     headline:'AI reads it.',  body:'Every field detected, every data point mapped in milliseconds.',     Screen:ScreenScan },
  { n:'03', color:RED,       label:'Fill',     headline:'Fills itself.', body:'Your data flows in automatically — accurate, instant, perfect.',     Screen:ScreenFill },
  { n:'04', color:'#22c55e', label:'Download', headline:'Done.',         body:'Filled, signed and ready. One click to download.',                   Screen:ScreenDone },
]

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
      <div className="sec-pad" style={{maxWidth:1200,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.55,ease:E}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:16}}>How it works</div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(28px,4vw,56px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.96,margin:0}}>
            Four steps.<br/><span style={{color:'#bbb'}}>Zero effort.</span>
          </h2>
        </motion.div>
      </div>

      <div ref={pin} style={{height:'400vh',position:'relative'}}>
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

        {/* Scroll hint — hidden on mobile via CSS */}
        <motion.div className="scr-hint" style={{opacity:hintOpacity as any,position:'absolute',bottom:'8%',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,pointerEvents:'none'}}>
          <motion.div animate={{y:[0,6,0]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut'}}>
            <svg width="18" height="28" viewBox="0 0 18 28" fill="none"><rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(0,0,0,.18)" strokeWidth="1.5"/><motion.rect x="7.5" y="6" width="3" height="5" rx="1.5" fill="rgba(0,0,0,.3)" animate={{y:[0,7,0],opacity:[1,.2,1]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut'}}/></svg>
          </motion.div>
          <span style={{...MONO,fontSize:9.5,color:'#bbb',letterSpacing:'0.12em',textTransform:'uppercase'}}>Scroll to explore</span>
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
function ToolCard({ tool, catColor }: { tool: typeof TOOLS[0]; catColor: string }) {
  const isLive = tool.tag === 'LIVE' && !!tool.href
  const Icon = tool.Icon
  const card = (
    <motion.div
      whileHover={{ y:-4, boxShadow:`0 16px 40px rgba(0,0,0,.10), 0 0 0 1.5px ${catColor}30` }}
      transition={{ duration:.18, ease:[.22,1,.36,1] }}
      style={{
        background:'#fff', border:'1.5px solid #e8e8e8', borderRadius:18,
        padding:'20px 18px 16px', display:'flex', flexDirection:'column', gap:12,
        cursor:isLive?'pointer':'default', height:'100%', position:'relative', overflow:'hidden',
        boxShadow:'0 2px 8px rgba(0,0,0,.04)',
      }}>
      {/* Subtle top-left gradient wash */}
      <div style={{position:'absolute',top:0,left:0,width:80,height:80,borderRadius:'0 0 80px 0',
        background:tool.iconBg,opacity:.07,pointerEvents:'none'}}/>

      {/* Icon chip */}
      <div style={{
        width:48, height:48, borderRadius:14, background:tool.iconBg, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 6px 16px ${catColor}30`,
      }}>
        <Icon size={22} color="#fff" strokeWidth={1.8}/>
      </div>

      {/* Text */}
      <div style={{flex:1}}>
        <div style={{...FI, fontSize:14, fontWeight:700, color:'#1d1d1f', letterSpacing:'-0.02em', marginBottom:5, lineHeight:1.25}}>
          {tool.name}
        </div>
        <div style={{...FI, fontSize:12, color:'#9ca3af', lineHeight:1.5}}>{tool.desc}</div>
      </div>

      {/* Footer row */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:8, borderTop:'1px solid #f3f4f6'}}>
        <span style={{...MONO, fontSize:9, fontWeight:700, color:catColor, textTransform:'uppercase', letterSpacing:'.07em',
          background:`${catColor}12`, padding:'2px 7px', borderRadius:99}}>
          {tool.cat}
        </span>
        {isLive && (
          <div style={{width:26, height:26, borderRadius:8, background:`${catColor}10`,
            display:'flex', alignItems:'center', justifyContent:'center'}}>
            <ArrowUpRight size={13} color={catColor} strokeWidth={2.2}/>
          </div>
        )}
      </div>
    </motion.div>
  )
  return isLive
    ? <Link href={tool.href} style={{textDecoration:'none', display:'block'}}>{card}</Link>
    : <div>{card}</div>
}

// ══════════════════════════════════════════════════════════════════════════════
//  ALL TOOLS
// ══════════════════════════════════════════════════════════════════════════════
function AllTools() {
  const [activeTab, setActiveTab] = useState('All')
  const activeCat = CATS.find(c => c.id === activeTab)
  const visibleTools = activeTab === 'All' ? TOOLS : TOOLS.filter(t => t.cat === activeTab)

  return (
    <section id="tools" style={{background:'#f8f8fa', borderTop:'1px solid #f0f0f0', padding:'88px 28px 100px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>

        {/* ── Section header ── */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'100px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:40}}>
          <div style={{...MONO, fontSize:10, color:'rgba(0,0,0,.35)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14}}>
            Tool Registry
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)', fontSize:'clamp(28px,3.5vw,46px)', fontWeight:800, color:'#1d1d1f', letterSpacing:'-0.05em', lineHeight:.96, margin:0}}>
            29 tools. One platform.
          </h2>
        </motion.div>

        {/* ── Category tab bar ── */}
        <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:.1,ease:E}}
          className="tab-bar"
          style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:8, marginBottom:52}}>
          {/* All tab */}
          {['All', ...CATS.map(c=>c.id)].map((id)=>{
            const cat = CATS.find(c=>c.id===id)
            const active = activeTab === id
            const color = cat?.color ?? '#1d1d1f'
            const label = id === 'All' ? 'All Tools' : (cat?.label ?? id)
            const TabIcon = cat?.Icon ?? Layers
            return (
              <motion.button key={id} onClick={()=>setActiveTab(id)}
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
                {id === 'All'
                  ? <Layers size={14} strokeWidth={2}/>
                  : <TabIcon size={14} strokeWidth={2}/>
                }
                {label}
                <span style={{
                  fontSize:10, fontWeight:800, padding:'1px 6px', borderRadius:99,
                  background: active ? 'rgba(255,255,255,.25)' : `${color}15`,
                  color: active ? '#fff' : color,
                  minWidth:20, textAlign:'center',
                }}>
                  {id === 'All' ? TOOLS.length : TOOLS.filter(t=>t.cat===id).length}
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── Content ── */}
        <AnimatePresence mode="sync">
          <motion.div key={activeTab}
            initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0}}
            transition={{duration:.15, ease:[.22,1,.36,1]}}>

            {activeTab === 'All' ? (
              /* ── Grouped by category ── */
              <div style={{display:'flex', flexDirection:'column', gap:64}}>
                {CATS.map(cat => {
                  const catTools = TOOLS.filter(t => t.cat === cat.id)
                  return (
                    <div key={cat.id} id={`cat-${cat.id}`}>
                      {/* Category header */}
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
                      {/* Tool cards — plain grid, no whileInView inside AnimatePresence */}
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(192px,1fr))', gap:14}}>
                        {catTools.map(tool => (
                          <ToolCard key={tool.name} tool={tool} catColor={cat.color}/>
                        ))}
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
                  {visibleTools.map((tool,i) => (
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
            Ready to edit<br/><span className="grad-red">smarter?</span>
          </h2>
          <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
            <Mag>
              <Link href="/ai-pdf-form-filler"
                style={{...FI,display:'inline-flex',alignItems:'center',gap:9,padding:'15px 34px',background:'#1d1d1f',color:'#fff',borderRadius:99,fontSize:16,fontWeight:700,textDecoration:'none',letterSpacing:'-0.025em',boxShadow:'0 4px 24px rgba(0,0,0,.14)'}}>
                <motion.span style={{display:'flex',alignItems:'center',gap:9}} whileHover={{gap:16}} transition={SP}>
                  Open free editor <ArrowRight size={16} strokeWidth={2.5}/>
                </motion.span>
              </Link>
            </Mag>
            <span style={{...MONO,fontSize:11,color:'#999',letterSpacing:'0.08em',textTransform:'uppercase'}}>No account · No credit card · Any browser</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════════════════════════════════════
function Footer() {
  const footerCols = [
    { title:'AI Tools',       color:'#7c3aed', links:[['AI Form Filler','/ai-pdf-form-filler'],['PDF OCR Scanner','/pdf-ocr'],['PDF Summarizer','/pdf-summarizer'],['PDF Mind Map','/mind-map'],['Quiz Creator','/quiz-creator'],['PDF Translator','/pdf-translator']] },
    { title:'Edit & Convert', color:'#16a34a', links:[['PDF Editor','/pdf-editor'],['PDF Annotator','/pdf-annotate'],['PDF → Word','/pdf-to-word'],['PDF → Excel','/pdf-to-excel'],['HTML → PDF','/html-to-pdf'],['Image to PDF','/image-to-pdf']] },
    { title:'Protect & More', color:'#dc2626', links:[['PDF Password Lock','/pdf-password-lock'],['PDF Watermarker','/pdf-watermark'],['PDF E-Signer','/pdf-signer'],['PDF Compressor','/pdf-compressor'],['PDF Merger','/pdf-merger'],['PDF Splitter','/pdf-splitter']] },
  ]
  return (
    <footer style={{background:'#f5f5f7',borderTop:'1px solid #e5e5ea',padding:'56px 28px 32px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr',gap:48,alignItems:'start',marginBottom:40}}>

          {/* Brand */}
          <div>
            <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,textDecoration:'none',marginBottom:14}}>
              <div style={{width:30,height:30,background:'#1d1d1f',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <FileText size={15} color="#fff" strokeWidth={2.2}/>
              </div>
              <span style={{...FI,fontSize:15,fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.04em'}}>
                Edit<span style={{color:RED}}>PDF</span> AI
              </span>
            </Link>
            <p style={{...FI,fontSize:13,color:'#6b7280',lineHeight:1.7,maxWidth:210,margin:'0 0 18px'}}>
              AI-powered PDF editing. 29 tools. Free forever.
            </p>
            {/* Category badges */}
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:24}}>
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
          {footerCols.map(({title,color,links})=>(
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

        {/* Bottom divider */}
        <div style={{borderTop:'1px solid #e5e5ea',paddingTop:20,display:'flex',
          alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <span style={{...MONO,fontSize:10,color:'#9ca3af',letterSpacing:'0.04em'}}>
            BUILT WITH AI · FAST · FREE
          </span>
          <Link href="/ai-pdf-form-filler"
            style={{...FI,display:'inline-flex',alignItems:'center',gap:6,
              fontSize:12,fontWeight:700,color:'#1d1d1f',textDecoration:'none',
              padding:'6px 14px',borderRadius:99,border:'1.5px solid #e5e5ea',
              background:'#fff',letterSpacing:'-0.02em'}}>
            Try for free <ArrowRight size={11} strokeWidth={2.5}/>
          </Link>
        </div>
      </div>
    </footer>
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
      <Apple3DScroll />
      <AllTools />
      <CTA />
      <Footer />
    </div>
  )
}
