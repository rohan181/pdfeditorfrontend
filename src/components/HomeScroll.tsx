'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useMotionValue, useSpring, useReducedMotion,
} from 'framer-motion'
import {
  Upload, Sparkles, PenTool, Download,
  Lock, ArrowRight, ChevronLeft, ChevronRight,
  FormInput, ScanText, Languages, BrainCircuit,
  MousePointer2, FileText, Layers,
  PenLine, FileType, FileSpreadsheet, Minimize2, Merge,
} from 'lucide-react'

const E   = [0.25, 0.46, 0.45, 0.94] as [number,number,number,number]
const FI  = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }
const RED = '#E24B4A'

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

function ScreenDrop() {
  return (
    <div className="scr-doc" style={{height:'100%',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center',padding:28}}>
      <div style={{textAlign:'center',width:'100%',maxWidth:400}}>
        <div
          style={{border:'2px dashed rgba(99,102,241,.3)',borderRadius:20,padding:'44px 32px',marginBottom:20,animation:'drop-zone-pulse 2.4s ease-in-out infinite'}}>
          <div style={{width:56,height:56,borderRadius:16,background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.18)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',animation:'float-y-sm 2.2s ease-in-out infinite'}}>
            <Upload size={24} color="#818cf8" strokeWidth={1.5}/>
          </div>
          <div style={{...FI,fontSize:17,fontWeight:600,color:'#1d1d1f',marginBottom:7,letterSpacing:'-0.02em'}}>Drop your PDF here</div>
          <div style={{...FI,fontSize:13,color:'#6E6E73',marginBottom:24,lineHeight:1.6}}>or click to browse · up to 100 MB · stays in your browser</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 26px',background:'#2563EB',borderRadius:99,fontSize:13,fontWeight:600,color:'#fff',cursor:'default'}}>
            <Upload size={13} strokeWidth={2}/> Choose PDF File
          </div>
        </div>
        <div style={{...MONO,fontSize:10,color:'#64748B',letterSpacing:'0.1em',textTransform:'uppercase'}}>PDF · Up to 100 MB · Runs in your browser</div>
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
              <div key={i} style={{width:4,height:4,borderRadius:'50%',background:'#7c3aed',
                animation:`blink-dot 1.2s ease-in-out ${i*.2}s infinite`}}/>
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
            <span style={{marginLeft:'auto',...MONO,fontSize:10,color,letterSpacing:'0.05em',
              animation:`blink-text 1.4s ease-in-out ${delay}s infinite`}}>READY</span>
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
            <span style={{...MONO,fontSize:10,color:RED,letterSpacing:'0.06em'}}>SIGN</span>
          </div>
        </div>
        {[100,85,92,70,88,60].map((w,i)=>(
          <motion.div key={i}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.07}}
            style={{height:8,borderRadius:99,background:i===2?'rgba(99,102,241,.18)':'#f0f0f0',width:`${w}%`,marginBottom:8,
              boxShadow:i===2?'0 0 0 2px rgba(99,102,241,.1)':'none'}}/>
        ))}
        <div style={{marginTop:12,padding:'9px 12px',border:'1px dashed #e4e4e7',borderRadius:8,background:'#fafafa'}}>
          <div style={{fontSize:10,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Signature</div>
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
            <span style={{marginLeft:'auto',...MONO,fontSize:10,color,background:`${color}12`,padding:'2px 6px',borderRadius:4}}>{ext}</span>
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
  { n:'01', color:'#818cf8', label:'Upload',      headline:'Upload your PDF',         body:'Upload most PDFs instantly. Drag it in or click to browse — no account needed.', href:'/pdf-editor',         cta:'Open PDF Editor', Screen:ScreenDrop     },
  { n:'02', color:'#a78bfa', label:'AI Tools',    headline:'Use AI tools instantly',  body:'Summarize, fill forms, OCR scan, translate, and more — all AI-powered.',          href:'/ai-pdf-form-filler', cta:'Try AI Form Filler', Screen:ScreenAI       },
  { n:'03', color:RED,       label:'Edit & Sign', headline:'Edit, annotate, or sign', body:'Add text, highlights, comments, and your e-signature in seconds.',                 href:'/pdf-signer',         cta:'Sign a PDF', Screen:ScreenEditSign },
  { n:'04', color:'#22c55e', label:'Export',      headline:'Download your file',       body:'Convert to Word, Excel, or compress. Your finished file is ready to download.',   href:'/pdf-to-word',        cta:'Explore conversion', Screen:ScreenExport   },
]

export default function HomeScroll() {
  const pin = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })

  useEffect(() => {
    if (reduceMotion) return
    let rafId = 0
    const unsub = scrollYProgress.on('change', p => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const next = p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3
        setStep(prev => prev === next ? prev : next)
      })
    })
    return () => { unsub(); cancelAnimationFrame(rafId) }
  }, [scrollYProgress, reduceMotion])

  const goToStep = useCallback((next: number) => {
    const targetStep = Math.max(0, Math.min(GSTEPS.length - 1, next))
    setStep(targetStep)
    if (reduceMotion || !pin.current) return
    const start = pin.current.getBoundingClientRect().top + window.scrollY
    const distance = pin.current.offsetHeight - window.innerHeight
    window.scrollTo({ top: start + distance * (targetStep / (GSTEPS.length - 1)), behavior: 'smooth' })
  }, [reduceMotion])

  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const barWidth    = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const cur = GSTEPS[step]
  const ScreenComp = cur.Screen

  return (
    <>
      <div id="how-it-works-detail" className="sec-pad" style={{maxWidth:1200,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'80px'}} transition={{duration:.55,ease:E}}>
          <div style={{...MONO,fontSize:10,color:'#64748B',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:16}}>See it in action</div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(28px,4vw,56px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.96,margin:0}}>
            Everything in your browser
          </h2>
        </motion.div>
      </div>

      <div ref={pin} data-mobile-shortcut-occluder style={{height:reduceMotion?'auto':'400vh',position:'relative',overscrollBehavior:'none'}}>
      <div className="scr-sticky" tabIndex={0} aria-label="How EditPDF AI works"
        onKeyDown={e=>{ if(e.key==='ArrowRight') goToStep(step+1); if(e.key==='ArrowLeft') goToStep(step-1) }}
        style={{top:0,height:reduceMotion?'auto':'100vh',minHeight:reduceMotion?620:undefined,position:reduceMotion?'relative':undefined,background:'#F5F5F7',overflow:'hidden',display:'flex',flexDirection:'column'}}>

        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(0,0,0,.03) 1px,transparent 1px)',backgroundSize:'32px 32px',pointerEvents:'none'}}/>

        {GSTEPS.map((s,i)=>(
          <motion.div key={i} animate={{opacity:i===step?1:0}} transition={{duration:.5}}
            style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 65% 75% at 65% 50%, ${s.color}1a 0%, transparent 70%)`,pointerEvents:'none'}}/>
        ))}

        <div className="scr-row" style={{flex:1,display:'flex',alignItems:'center',gap:56,maxWidth:1200,margin:'0 auto',padding:'0 48px',width:'100%'}}>

          <div className="scr-left" style={{width:300,flexShrink:0,position:'relative'}}>

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
            <div className="scr-dots" role="tablist" aria-label="Walkthrough steps" style={{display:'flex',gap:7,marginBottom:40}}>
              {GSTEPS.map((s,i)=>(
                <motion.button key={i} type="button" onClick={()=>goToStep(i)}
                  role="tab" aria-selected={i===step} aria-label={`Step ${s.n}: ${s.label}`}
                  animate={{width:i===step?28:7,background:i===step?s.color:'rgba(0,0,0,.12)'}}
                  style={{height:7,borderRadius:99,border:0,padding:0,cursor:'pointer'}}
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
                    <Link href={cur.href}
                      style={{...FI,display:'inline-flex',alignItems:'center',gap:7,fontSize:13,fontWeight:600,color:cur.color,textDecoration:'none',border:`1px solid ${cur.color}40`,padding:'8px 18px',borderRadius:99,background:`${cur.color}08`,transition:'gap .2s'}}
                      onMouseEnter={e=>(e.currentTarget.style.gap='12px')}
                      onMouseLeave={e=>(e.currentTarget.style.gap='7px')}>
                      {cur.cta} <ArrowRight size={13} strokeWidth={2.5}/>
                    </Link>
                  </Mag>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="scr-controls" style={{display:'flex',alignItems:'center',gap:8,marginTop:18}}>
              <button type="button" onClick={()=>goToStep(step-1)} disabled={step===0} aria-label="Previous walkthrough step"
                style={{width:34,height:34,borderRadius:'50%',border:'1px solid #D1D5DB',background:'#fff',display:'grid',placeItems:'center',cursor:step===0?'default':'pointer',opacity:step===0 ? .4 : 1}}>
                <ChevronLeft size={15}/>
              </button>
              <button type="button" onClick={()=>goToStep(step+1)} disabled={step===GSTEPS.length-1} aria-label="Next walkthrough step"
                style={{width:34,height:34,borderRadius:'50%',border:'1px solid #D1D5DB',background:'#fff',display:'grid',placeItems:'center',cursor:step===GSTEPS.length-1?'default':'pointer',opacity:step===GSTEPS.length-1 ? .4 : 1}}>
                <ChevronRight size={15}/>
              </button>
              <a href="#tools" style={{...FI,fontSize:12,color:'#64748B',marginLeft:4,textDecoration:'none'}}>Skip walkthrough</a>
            </div>
            </div>
          </div>

          <div className="scr-right" style={{flex:1,position:'relative'}}>

            {GSTEPS.map((s,i)=>(
              <motion.div key={i} animate={{opacity:i===step?1:0}} transition={{duration:.5}}
                style={{position:'absolute',inset:-48,background:`radial-gradient(ellipse, ${s.color}10 0%, transparent 70%)`,filter:'blur(40px)',pointerEvents:'none'}}/>
            ))}

            <motion.div
              animate={{boxShadow:`0 24px 60px -12px ${cur.color}35, 0 0 0 1px ${cur.color}30`,borderColor:`${cur.color}30`}}
              transition={{duration:.5}}
              style={{borderRadius:16,border:'1px solid transparent',overflow:'hidden',position:'relative',background:'#fff'}}>

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

        <motion.div className="scr-hint" style={{opacity:hintOpacity as any,position:'absolute',bottom:'8%',left:'50%',transform:'translateX(-50%)',pointerEvents:'none'}}>
          <span style={{...MONO,fontSize:9.5,color:'rgba(0,0,0,.28)',letterSpacing:'0.12em',textTransform:'uppercase',whiteSpace:'nowrap'}}>Scroll to walk through each step</span>
        </motion.div>

        <div style={{height:2,background:'rgba(0,0,0,.05)',flexShrink:0,position:'relative'}}>
          <motion.div style={{position:'absolute',top:0,left:0,bottom:0,width:barWidth,background:cur.color}}/>
        </div>
      </div>
    </div>
    </>
  )
}
