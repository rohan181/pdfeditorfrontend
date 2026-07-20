'use client'

import { useRef, useState, useEffect, useCallback, useMemo, memo } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
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
  Shield, GraduationCap, Briefcase, Building2, FlaskConical,
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
const FI  = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const RED = '#E24B4A'
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

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
    label:'AI Tools', href:'/ai-pdf-form-filler', color:'#7c3aed', Icon:Sparkles,
    tools:[
      { name:'AI Form Filler', href:'/ai-pdf-form-filler', tier:'ai',   Icon:WandSparkles,  bg:'#7c3aed' },
      { name:'PDF Summarizer', href:'/pdf-summarizer',     tier:'ai',   Icon:Sparkles,      bg:'#8b5cf6' },
      { name:'OCR Scanner',    href:'/pdf-ocr',            tier:'ai',   Icon:ScanText,      bg:'#6366f1' },
      { name:'PDF Translator', href:'/pdf-translator',     tier:'ai',   Icon:Languages,     bg:'#0891b2' },
      { name:'PDF Mind Map',   href:'/mind-map',           tier:'ai',   Icon:BrainCircuit,  bg:'#a855f7' },
      { name:'Quiz Creator',   href:'/quiz-creator',       tier:'ai',   Icon:ClipboardList, bg:'#7c3aed' },
    ],
  },
  {
    label:'Edit', href:'/pdf-editor', color:'#2563eb', Icon:FilePen,
    tools:[
      { name:'PDF Editor',    href:'/pdf-editor',   tier:'free', Icon:FilePen,           bg:'#2563eb' },
      { name:'PDF Annotator', href:'/pdf-annotate', tier:'free', Icon:MessageSquareText, bg:'#0ea5e9' },
      { name:'PDF Viewer',    href:'/pdf-viewer',   tier:'free', Icon:MonitorPlay,       bg:'#0a84ff' },
    ],
  },
  {
    label:'Page Tools', href:'/#tools', color:'#f97316', Icon:Layers,
    tools:[
      { name:'Page Manager',     href:'/pdf-page-manager', tier:'free', Icon:Layers,      bg:'#f59e0b' },
      { name:'PDF Cropper',      href:'/pdf-cropper',      tier:'free', Icon:Scissors,    bg:'#0d9488' },
      { name:'Add Page Numbers', href:'/add-page-numbers', tier:'free', Icon:ListOrdered, bg:'#f97316' },
      { name:'Rotate PDF',       href:'/rotate-pdf',       tier:'free', Icon:RotateCw,    bg:'#ea580c' },
      { name:'Extract Pages',    href:'/extract-pages',    tier:'free', Icon:Scissors,    bg:'#0891b2' },
      { name:'Delete Pages',     href:'/delete-pages',     tier:'free', Icon:Trash2,      bg:'#dc2626' },
    ],
  },
  {
    label:'Convert', href:'/#tools', color:'#16a34a', Icon:FileType,
    tools:[
      { name:'PDF → Word',    href:'/pdf-to-word',   tier:'pro',  Icon:FileType,        bg:'#16a34a' },
      { name:'PDF → Excel',   href:'/pdf-to-excel',  tier:'pro',  Icon:FileSpreadsheet, bg:'#15803d' },
      { name:'PDF → PPT',     href:'/pdf-to-ppt',    tier:'pro',  Icon:Presentation,    bg:'#d97706' },
      { name:'Word → PDF',    href:'/word-to-pdf',   tier:'free', Icon:FileType,        bg:'#2563eb' },
      { name:'Excel → PDF',   href:'/excel-to-pdf',  tier:'free', Icon:Table,           bg:'#059669' },
      { name:'PPT → PDF',     href:'/ppt-to-pdf',    tier:'free', Icon:Presentation,    bg:'#b45309' },
      { name:'Image to PDF',  href:'/image-to-pdf',  tier:'free', Icon:ImagePlus,       bg:'#7c3aed' },
      { name:'PDF to Images', href:'/pdf-to-images', tier:'free', Icon:Images,          bg:'#db2777' },
      { name:'TXT → PDF',     href:'/txt-to-pdf',    tier:'free', Icon:FileType,        bg:'#6366f1' },
      { name:'HTML → PDF',    href:'/html-to-pdf',   tier:'free', Icon:Code,            bg:'#0891b2' },
    ],
  },
  {
    label:'Protect', href:'/pdf-signer', color:'#dc2626', Icon:KeyRound,
    tools:[
      { name:'PDF E-Signer',  href:'/pdf-signer',        tier:'free', Icon:PenTool,  bg:'#0d9488' },
      { name:'Password Lock', href:'/pdf-password-lock', tier:'free', Icon:KeyRound, bg:'#dc2626' },
      { name:'Watermark',     href:'/pdf-watermark',     tier:'free', Icon:Stamp,    bg:'#2563eb' },
      { name:'PDF Redactor',  href:'/pdf-redactor',      tier:'free', Icon:EyeOff,   bg:'#374151' },
    ],
  },
  {
    label:'Organize', href:'/#tools', color:'#d97706', Icon:Layers,
    tools:[
      { name:'PDF Merger',   href:'/pdf-merger',       tier:'free', Icon:Merge,      bg:'#7c3aed' },
      { name:'PDF Splitter', href:'/pdf-splitter',     tier:'free', Icon:Split,      bg:'#e11d48' },
      { name:'Compress PDF', href:'/pdf-compressor',   tier:'free', Icon:Minimize2,  bg:'#d97706' },
      { name:'Form Builder', href:'/pdf-form-builder', tier:'free', Icon:FormInput,  bg:'#0369a1' },
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
            <Image src="/logo.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{height:48,width:'auto',display:'block'}} priority />
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
                <span className="nav-link"
                  style={{...FI,display:'inline-flex',alignItems:'center',gap:4,
                    padding:'5px 11px',fontSize:13,fontWeight:500,borderRadius:8,
                    color:'rgba(0,0,0,.52)'}}>
                  {label}
                </span>
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
            <Link href="/pdf-editor" className="desk nav-cta-btn"
              style={{...FI,display:'inline-flex',alignItems:'center',gap:6,padding:'7px 16px',
                background:'#1d1d1f',color:'#fff',borderRadius:99,fontSize:12.5,fontWeight:700,
                textDecoration:'none',letterSpacing:'-0.02em',flexShrink:0}}>
              <Upload size={12} strokeWidth={2.5}/> Open Editor
            </Link>
            <button className="mob" onClick={()=>{ setMobOpen(o=>!o); if(mobOpen){ setMobToolsExp(false); setMobCatOpen(null); } }}
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
                <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:4}}>
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
                            <div className="nav-tool-row"
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
                            </div>
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
              <span style={{...MONO,fontSize:10.5,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase'}}>Edit smarter. Finish faster.</span>
            </motion.div>

            {/* Headline — SEO-optimised H1 */}
            <motion.h1 variants={MV} initial="hidden" animate="visible"
              style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(34px,4.8vw,76px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 24px'}}>
              <span style={{display:'block',overflow:'hidden'}}>
                <motion.span style={{display:'block'}} variants={WV}>Free Online PDF Editor</motion.span>
              </span>
              <span style={{display:'block',overflow:'hidden',marginTop:'0.1em'}}>
                <motion.span style={{display:'block'}} variants={WV}>
                  Edit, Sign, Fill &amp; Convert <span className="grad-red">PDFs</span>
                </motion.span>
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.7}}
              style={{...FI,fontSize:'clamp(15px,1.6vw,18px)',color:'#6E6E73',lineHeight:1.65,maxWidth:400,margin:'0 0 32px',letterSpacing:'-0.01em',fontWeight:400}}>
              35+ PDF tools powered by AI. Core tools free with no account. AI tools free with a sign-in — 5 uses per day.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:E,delay:.85}}
              className="hero-ctas">
              <Mag>
                <Link href="/pdf-editor" className="hero-upload-btn"
                  style={{...FI,display:'inline-flex',alignItems:'center',gap:10,padding:'16px 32px',background:RED,color:'#fff',borderRadius:99,fontSize:16,fontWeight:800,textDecoration:'none',letterSpacing:'-0.025em',boxShadow:`0 6px 32px ${RED}55`}}>
                  <Upload size={16} strokeWidth={2.5}/> Upload PDF
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
              <div style={{animation:'float-y 4s ease-in-out infinite'}}>
                <Tilt><BrowserUI /></Tilt>
              </div>
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
          <div
            style={{border:'2px dashed rgba(99,102,241,.35)',borderRadius:16,padding:'32px 40px',textAlign:'center',width:'100%',maxWidth:320,animation:'drop-zone-pulse 2.2s ease-in-out infinite'}}>
            <div style={{width:52,height:52,borderRadius:14,background:'rgba(99,102,241,.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',animation:'float-y-sm 2s ease-in-out infinite'}}>
              <Upload size={24} color="#6366f1" strokeWidth={1.6}/>
            </div>
            <div style={{...FI,fontSize:14,fontWeight:700,color:'#1d1d1f',marginBottom:4}}>Drop your PDF here</div>
            <div style={{...FI,fontSize:12,color:'#9ca3af',marginBottom:16}}>or click to browse · up to 100 MB</div>
            <motion.div animate={{width:['0%','72%']}} transition={{duration:1.4,delay:.6,ease:[.22,1,.36,1]}}
              style={{height:3,borderRadius:99,background:'linear-gradient(90deg,#6366f1,#818cf8)',margin:'0 auto'}}/>
          </div>
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
            <span style={{...MONO,fontSize:9,color:'#7c3aed',background:'rgba(124,58,237,.1)',padding:'2px 7px',borderRadius:99,marginLeft:'auto',
              animation:'blink-scanning 1.4s ease-in-out infinite'}}>
              Scanning…
            </span>
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
          <div
            style={{width:72,height:88,borderRadius:10,background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,
              boxShadow:'0 12px 32px rgba(22,163,74,.3)',position:'relative',overflow:'hidden',animation:'float-y-xs 2s ease-in-out infinite'}}>
            <div style={{position:'absolute',top:0,right:0,width:22,height:22,background:'rgba(255,255,255,.18)',clipPath:'polygon(100% 0%,100% 100%,0% 100%)'}}/>
            <Download size={26} color="#fff" strokeWidth={1.6}/>
          </div>
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


//  ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function AppleHome() {
  return (
    <div style={{background:'#fff'}}>
      <Nav />
      <Hero />
      <ProductDemo />
    </div>
  )
}
