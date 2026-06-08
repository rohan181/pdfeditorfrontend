'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useMotionValue, useSpring,
} from 'framer-motion'
import {
  ArrowRight, FileText, Lock, PenLine, ScanLine, Zap,
  Upload,
  CheckCircle2, MousePointer2, Layers, Download, X, Menu,
  ChevronRight, ArrowUpRight,
} from 'lucide-react'

// ─── tokens ──────────────────────────────────────────────────────────────────
const E   = [0.25, 0.46, 0.45, 0.94] as [number,number,number,number]
const SP  = { type:'spring', stiffness:400, damping:30 } as const
const FI  = { fontFamily:'var(--font-inter,system-ui,sans-serif)' }
const RED = '#E24B4A'
const MONO: React.CSSProperties = { fontFamily:'var(--font-mono,monospace)' }

// ─── tools ───────────────────────────────────────────────────────────────────
const TOOLS = [
  { name:'AI Form Filler',    tag:'LIVE', href:'/ai-pdf-form-filler', cat:'Editor'   },
  { name:'PDF Editor',        tag:'LIVE', href:'/pdf-editor',         cat:'Editor'   },
  { name:'PDF Watermarker',   tag:'LIVE', href:'/pdf-watermark',      cat:'Protect'  },
  { name:'PDF Password Lock', tag:'LIVE', href:'/pdf-password-lock', cat:'Security' },
  { name:'PDF OCR Scanner',   tag:'BETA', href:null, cat:'Extract'  },
  { name:'PDF Form Builder',  tag:'LIVE', href:'/pdf-form-builder', cat:'Forms'    },
  { name:'PDF Page Manager',  tag:'LIVE', href:'/pdf-page-manager', cat:'Tools'    },
  { name:'PDF → Word',        tag:'SOON', href:null, cat:'Convert'  },
  { name:'PDF → Excel',       tag:'SOON', href:null, cat:'Convert'  },
  { name:'PDF Compressor',    tag:'LIVE', href:'/pdf-compressor', cat:'Optimize' },
  { name:'PDF Merger',        tag:'LIVE', href:'/pdf-merger', cat:'Tools'    },
  { name:'PDF Splitter',      tag:'LIVE', href:'/pdf-splitter', cat:'Tools'    },
  { name:'PDF E-Signer',      tag:'SOON', href:null, cat:'Sign'     },
  { name:'PDF Translator',    tag:'SOON', href:null, cat:'Language' },
  { name:'PDF to Images',     tag:'LIVE', href:'/pdf-to-images', cat:'Export'   },
  { name:'PDF Redactor',      tag:'LIVE', href:'/pdf-redactor', cat:'Security' },
  { name:'PDF Summarizer AI', tag:'SOON', href:null, cat:'AI'       },
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
  html { scroll-behavior:smooth; }
  body { overflow-x:clip; }

  .grad-red {
    background:linear-gradient(120deg,#E24B4A 0%,#ff7a59 55%,#E24B4A 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }
  .tool-row:hover { background:rgba(0,0,0,.02) !important; }
  .tool-row-light:hover { background:#f5f5f5 !important; }

  /* responsive */
  .r-feat    { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .r-bento   { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .r-footer  { display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:48px; align-items:start; }
  .r-tgrid   { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
  .bspan2    { grid-column:span 2; }
  .desk      { display:flex; }
  .mob       { display:none; }

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
  @media(max-width:680px){
    .r-bento  { grid-template-columns:1fr; }
    .bspan2   { grid-column:span 1; }
    .r-footer { grid-template-columns:1fr; gap:28px; }
    .r-tgrid  { grid-template-columns:1fr 1fr; }
    .desk     { display:none; }
    .mob      { display:flex; }
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
function CursorDot() {
  const x=useMotionValue(-40), y=useMotionValue(-40)
  const sx=useSpring(x,{stiffness:600,damping:32}), sy=useSpring(y,{stiffness:600,damping:32})
  const [visible,setVisible]=useState(false)
  const [big,setBig]=useState(false)

  useEffect(()=>{
    const move=(e:MouseEvent)=>{ setVisible(true); x.set(e.clientX-4); y.set(e.clientY-4) }
    const leave=()=>setVisible(false)
    const over=(e:MouseEvent)=>{ const t=e.target as HTMLElement; setBig(!!(t.closest('a')||t.closest('button'))) }
    window.addEventListener('mousemove',move)
    window.addEventListener('mouseleave',leave)
    window.addEventListener('mouseover',over)
    return ()=>{ window.removeEventListener('mousemove',move); window.removeEventListener('mouseleave',leave); window.removeEventListener('mouseover',over) }
  },[x,y])

  return (
    <motion.div
      style={{ position:'fixed', top:0, left:0, zIndex:9999, pointerEvents:'none', x:sx, y:sy }}
      animate={{ opacity:visible?1:0, scale:big?3:1 }}
      transition={{ opacity:{ duration:.2 }, scale:SP }}
    >
      <div style={{ width:8, height:8, borderRadius:'50%', background:RED, boxShadow:`0 0 6px ${RED}` }}/>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  SCROLL % COUNTER
// ══════════════════════════════════════════════════════════════════════════════
function ScrollPct() {
  const { scrollYProgress } = useScroll()
  const [pct, setPct] = useState(0)
  useEffect(()=> scrollYProgress.on('change', v => setPct(Math.round(v*100))), [scrollYProgress])
  return <span>{String(pct).padStart(2,'0')}%</span>
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
//  NAV
// ══════════════════════════════════════════════════════════════════════════════
function Nav() {
  const [open,setOpen]=useState(false)
  const { scrollY }=useScroll()
  const navBg=useTransform(scrollY,[0,80],['rgba(255,255,255,0)','rgba(255,255,255,0.96)'])
  const links=[{l:'Form Filler',h:'/ai-pdf-form-filler'},{l:'PDF Editor',h:'/pdf-editor'},{l:'Watermarker',h:'/pdf-watermark'},{l:'Password Lock',h:'/pdf-password-lock'},{l:'All Tools',h:'#tools'}]

  return (
    <>
      <motion.header style={{position:'fixed',inset:'0 0 auto',zIndex:200,height:54,background:navBg,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderBottom:'1px solid rgba(0,0,0,.06)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 28px',height:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Mag str={0.2}>
            <Link href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
              <motion.div whileHover={{rotate:12,scale:1.1}} transition={SP}
                style={{width:28,height:28,background:'#1d1d1f',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <FileText size={14} color="#fff" strokeWidth={2.2}/>
              </motion.div>
              <span style={{...FI,fontSize:15,fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.04em'}}>Edit<span style={{color:RED}}>PDF</span> AI</span>
            </Link>
          </Mag>

          <nav className="desk" style={{gap:0}}>
            {links.map(({l,h})=>(
              <Link key={l} href={h}>
                <motion.span whileHover={{color:'#000'}} style={{display:'inline-block',padding:'5px 14px',fontSize:13,fontWeight:500,color:'rgba(0,0,0,.5)',cursor:'pointer',borderRadius:99,letterSpacing:'-0.01em',...FI}} whileTap={{scale:.96}}>
                  {l}
                </motion.span>
              </Link>
            ))}
          </nav>

          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <Mag>
              <Link href="/ai-pdf-form-filler" className="desk"
                style={{...FI,alignItems:'center',gap:6,padding:'7px 18px',background:'#1d1d1f',color:'#fff',borderRadius:99,fontSize:13,fontWeight:700,textDecoration:'none',letterSpacing:'-0.02em'}}>
                <motion.span style={{display:'flex',alignItems:'center',gap:6}} whileHover={{gap:11}} transition={SP}>
                  Open Editor <ArrowRight size={13} strokeWidth={2.5}/>
                </motion.span>
              </Link>
            </Mag>
            <motion.button className="mob" whileTap={{scale:.9}} onClick={()=>setOpen(o=>!o)}
              style={{width:36,height:36,borderRadius:8,border:'1px solid rgba(0,0,0,.12)',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open?'x':'m'} initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:.18}}>
                  {open?<X size={15} color="#1d1d1f" strokeWidth={2}/>:<Menu size={15} color="#1d1d1f" strokeWidth={2}/>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:.22,ease:E}}
            style={{position:'fixed',inset:'54px 0 0',zIndex:190,background:'rgba(255,255,255,.98)',backdropFilter:'blur(20px)',padding:'24px 24px 36px',display:'flex',flexDirection:'column',gap:4}}>
            {links.map(({l,h},i)=>(
              <motion.div key={l} initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{delay:i*.05,ease:E}}>
                <Link href={h} onClick={()=>setOpen(false)} style={{...FI,display:'block',padding:'14px 16px',fontSize:22,fontWeight:700,color:'#1d1d1f',textDecoration:'none',borderRadius:12,letterSpacing:'-0.04em'}}>{l}</Link>
              </motion.div>
            ))}
            <div style={{height:1,background:'rgba(0,0,0,.08)',margin:'12px 0'}}/>
            <Link href="/ai-pdf-form-filler" onClick={()=>setOpen(false)}
              style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'16px',background:'#1d1d1f',color:'#fff',borderRadius:14,fontSize:17,fontWeight:700,textDecoration:'none'}}>
              Open Editor Free <ArrowRight size={16} strokeWidth={2.5}/>
            </Link>
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
                  17 tools <ChevronRight size={14} strokeWidth={2}/>
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
          {['17 AI Tools','Free Forever','No Account','100% Private'].map(t=>(
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
  const [progress, setProgress] = useState(0)

  useEffect(()=>{
    const el = pin.current
    if (!el) return
    const onScroll = () => {
      // re-read offsetTop each call so layout shifts don't break the math
      const elTop = el.getBoundingClientRect().top + window.scrollY
      const scrolled = window.scrollY - elTop
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const p = Math.max(0, Math.min(1, scrolled / total))
      setProgress(p)
      setStep(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    // defer initial call so fonts/images have time to affect layout
    const t = setTimeout(onScroll, 100)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(t)
    }
  }, [])

  const hintOpacity = Math.max(0, 1 - progress / 0.06)
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
            <AnimatePresence mode="wait">
              <motion.div key={`ghost-${step}`}
                initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                transition={{duration:.4}}
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

            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
                transition={{duration:.35,ease:E}}>
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
                <AnimatePresence mode="wait">
                  <motion.div key={step}
                    initial={{opacity:0,scale:.94,filter:'blur(8px)'}}
                    animate={{opacity:1,scale:1,filter:'blur(0px)'}}
                    exit={{opacity:0,scale:1.04,filter:'blur(8px)'}}
                    transition={{duration:.4,ease:[0.22,1,0.36,1]}}
                    style={{position:'absolute',inset:0}}>
                    <ScreenComp />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint — hidden on mobile via CSS */}
        <motion.div className="scr-hint" style={{opacity:hintOpacity,position:'absolute',bottom:'8%',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,pointerEvents:'none'}}>
          <motion.div animate={{y:[0,6,0]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut'}}>
            <svg width="18" height="28" viewBox="0 0 18 28" fill="none"><rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(0,0,0,.18)" strokeWidth="1.5"/><motion.rect x="7.5" y="6" width="3" height="5" rx="1.5" fill="rgba(0,0,0,.3)" animate={{y:[0,7,0],opacity:[1,.2,1]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut'}}/></svg>
          </motion.div>
          <span style={{...MONO,fontSize:9.5,color:'#bbb',letterSpacing:'0.12em',textTransform:'uppercase'}}>Scroll to explore</span>
        </motion.div>

        {/* Progress bar */}
        <div style={{height:2,background:'rgba(0,0,0,.05)',flexShrink:0,position:'relative'}}>
          <motion.div animate={{width:`${progress*100}%`,background:cur.color}} transition={{duration:.1}} style={{position:'absolute',top:0,left:0,bottom:0}}/>
        </div>
      </div>
    </div>
    </>
  )
}



// ══════════════════════════════════════════════════════════════════════════════
//  ALL TOOLS
// ══════════════════════════════════════════════════════════════════════════════
function AllTools() {
  const TAG: Record<string,React.CSSProperties> = {
    LIVE:{ background:'rgba(34,197,94,.1)',  color:'#15803d', border:'1px solid rgba(34,197,94,.3)' },
    BETA:{ background:'rgba(99,102,241,.1)', color:'#4338ca', border:'1px solid rgba(99,102,241,.3)' },
    SOON:{ background:'rgba(0,0,0,.04)',     color:'#bbb',    border:'1px solid #e8e8e8' },
  }
  return (
    <section id="tools" className="tools-sec" style={{background:'#fff',borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'100px'}} transition={{duration:.5,ease:E}}
          className="tools-hdr">
          <div>
            <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>Tool Registry</div>
            <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(28px,3.5vw,46px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.96,margin:0}}>18 tools. One platform.</h2>
          </div>
          <div className="tools-legend">
            {[['LIVE','rgba(34,197,94,.1)','#15803d','rgba(34,197,94,.3)'],['BETA','rgba(99,102,241,.1)','#4338ca','rgba(99,102,241,.3)'],['SOON','rgba(0,0,0,.04)','#bbb','#e8e8e8']].map(([tag,bg,col,br])=>(
              <span key={tag} style={{display:'flex',alignItems:'center',gap:5}}>
                <span style={{...MONO,fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:bg,color:col,border:`1px solid ${br}`,letterSpacing:'0.06em'}}>{tag}</span>
                <span style={{...FI,fontSize:12,color:'rgba(0,0,0,.38)'}}>{tag==='LIVE'?'Available':tag==='BETA'?'Beta':'Soon'}</span>
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div variants={CC} initial="hidden" whileInView="visible" viewport={{once:true,margin:'80px'}}
          className="r-tgrid"
          style={{border:'1px solid #e8e8e8',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 20px rgba(0,0,0,.04)'}}>
          {TOOLS.map(({name,tag,href,cat})=>{
            const isLive=tag==='LIVE'&&!!href, ts=TAG[tag]
            const cell=(
              <motion.div variants={CI} className="tool-row-light"
                whileHover={isLive?{x:4}:{}} transition={SP}
                style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',background:isLive?'#fff':'#fafafa',borderLeft:`3px solid ${isLive?'#22c55e':'transparent'}`,borderRight:'1px solid #f0f0f0',borderBottom:'1px solid #f0f0f0',minHeight:56,cursor:isLive?'pointer':'default',transition:'background .12s'}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{...FI,fontSize:13.5,fontWeight:isLive?700:500,color:isLive?'#1d1d1f':'#bbb',letterSpacing:'-0.02em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{name}</div>
                  <div style={{...MONO,fontSize:9.5,color:'#bbb',marginTop:1,letterSpacing:'0.04em'}}>{cat.toUpperCase()}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.06em',padding:'2px 6px',borderRadius:4,...ts}}>{tag}</span>
                  {isLive&&<ArrowUpRight size={13} color="#22c55e" strokeWidth={2}/>}
                </div>
              </motion.div>
            )
            return isLive?<Link key={name} href={href!} style={{textDecoration:'none',display:'block'}}>{cell}</Link>:<div key={name}>{cell}</div>
          })}
        </motion.div>
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
//  FOOTER — light
// ══════════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer style={{background:'#F5F5F7',borderTop:'1px solid #e8e8e8',padding:'52px 28px 40px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="r-footer">
          <div>
            <Mag str={0.18}>
              <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,textDecoration:'none',marginBottom:16}}>
                <div style={{width:26,height:26,background:'#1d1d1f',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><FileText size={13} color="#fff" strokeWidth={2.2}/></div>
                <span style={{...FI,fontSize:15,fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.04em'}}>Edit<span style={{color:RED}}>PDF</span> AI</span>
              </Link>
            </Mag>
            <p style={{...FI,fontSize:13,color:'#6E6E73',lineHeight:1.65,maxWidth:220,margin:'0 0 20px'}}>AI-powered PDF editing. 17 tools. Free forever.</p>
            <p style={{...MONO,fontSize:11,color:'#999',letterSpacing:'0.04em'}}>© {new Date().getFullYear()} EDITPDF AI</p>
          </div>
          {[
            {title:'Live Tools', links:[['AI Form Filler','/ai-pdf-form-filler'],['PDF Editor','/pdf-editor'],['PDF Watermarker','/pdf-watermark'],['OCR Scanner','#']]},
            {title:'Coming Soon', links:[['PDF to Word','#'],['PDF Compressor','#'],['PDF Merger','#'],['PDF Translator','#']]},
          ].map(({title,links})=>(
            <div key={title}>
              <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:16}}>{title}</div>
              {links.map(([l,h])=>(
                <motion.div key={l} whileHover={{x:4}} transition={SP}>
                  <Link href={h} style={{...FI,display:'block',fontSize:13.5,color:'#6E6E73',textDecoration:'none',fontWeight:500,marginBottom:10,letterSpacing:'-0.01em'}}>{l}</Link>
                </motion.div>
              ))}
            </div>
          ))}
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
      <CursorDot />
      <Nav />
      <Hero />
      <Apple3DScroll />
      <AllTools />
      <CTA />
      <Footer />
    </div>
  )
}
