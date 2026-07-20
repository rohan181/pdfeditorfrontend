'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpRight, X, Layers,
  WandSparkles, ScanText, Sparkles, BrainCircuit, ClipboardList, Languages,
  FilePen, MessageSquareText,
  ListOrdered, RotateCw, Scissors, Trash2,
  FileText, FileType, FileSpreadsheet, Presentation, Table, MonitorPlay, Code, ImagePlus, Images,
  KeyRound, Stamp, EyeOff, PenTool,
  Minimize2, Merge, Split, FormInput,
} from 'lucide-react'

const E   = [0.25, 0.46, 0.45, 0.94] as [number,number,number,number]
const FI  = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const CATS = [
  { id:'AI',       label:'AI Tools',        color:'#7c3aed', light:'rgba(124,58,237,.1)',  Icon:Sparkles,    desc:'Smart automation & intelligence' },
  { id:'Edit',     label:'Edit & Annotate', color:'#2563eb', light:'rgba(37,99,235,.1)',   Icon:FilePen,     desc:'Edit, annotate and mark up PDFs' },
  { id:'Pages',    label:'Page Tools',      color:'#f97316', light:'rgba(249,115,22,.1)',  Icon:Layers,      desc:'Manage, rotate, extract & delete pages' },
  { id:'Convert',  label:'Convert',         color:'#16a34a', light:'rgba(22,163,74,.1)',   Icon:FileType,    desc:'Transform PDFs to & from any format' },
  { id:'Protect',  label:'Protect & Sign',  color:'#dc2626', light:'rgba(220,38,38,.1)',   Icon:KeyRound,    desc:'Secure, redact and sign documents' },
  { id:'Organize', label:'Organize',        color:'#d97706', light:'rgba(217,119,6,.1)',   Icon:Merge,       desc:'Merge, split, compress and build forms' },
]

const TOOLS: { name:string; tag:string; href:string; cat:string; Icon:LucideIcon; iconBg:string; desc:string; tier:'free'|'ai'|'pro' }[] = [
  { name:'AI PDF Form Filler', tag:'LIVE', href:'/ai-pdf-form-filler', cat:'AI',       Icon:WandSparkles,    iconBg:'linear-gradient(135deg,#7c3aed,#a855f7)', desc:'Autofill PDF forms with AI — W-9, job applications, tax forms', tier:'ai' },
  { name:'PDF OCR Scanner',   tag:'LIVE', href:'/pdf-ocr',            cat:'AI',       Icon:ScanText,        iconBg:'linear-gradient(135deg,#6366f1,#818cf8)', desc:'Extract text from scanned PDFs',        tier:'ai'   },
  { name:'PDF Summarizer',    tag:'LIVE', href:'/pdf-summarizer',     cat:'AI',       Icon:Sparkles,        iconBg:'linear-gradient(135deg,#8b5cf6,#c084fc)', desc:'Get instant AI summaries',              tier:'ai'   },
  { name:'PDF Mind Map',      tag:'LIVE', href:'/mind-map',           cat:'AI',       Icon:BrainCircuit,    iconBg:'linear-gradient(135deg,#a855f7,#d946ef)', desc:'Visualise ideas from any PDF',          tier:'ai'   },
  { name:'Quiz Creator',      tag:'LIVE', href:'/quiz-creator',       cat:'AI',       Icon:ClipboardList,   iconBg:'linear-gradient(135deg,#7c3aed,#6366f1)', desc:'Generate quizzes from PDF content',     tier:'ai'   },
  { name:'PDF Translator',    tag:'LIVE', href:'/pdf-translator',     cat:'AI',       Icon:Languages,       iconBg:'linear-gradient(135deg,#6366f1,#06b6d4)', desc:'Translate PDFs to any language',        tier:'ai'   },
  { name:'PDF Viewer',        tag:'LIVE', href:'/pdf-viewer',         cat:'Edit',     Icon:MonitorPlay,     iconBg:'linear-gradient(135deg,#0a84ff,#34aadc)', desc:'View any PDF in your browser',          tier:'free' },
  { name:'PDF Editor',        tag:'LIVE', href:'/pdf-editor',         cat:'Edit',     Icon:FilePen,         iconBg:'linear-gradient(135deg,#2563eb,#3b82f6)', desc:'Edit text, images and layout',          tier:'free' },
  { name:'PDF Annotator',     tag:'LIVE', href:'/pdf-annotate',       cat:'Edit',     Icon:MessageSquareText, iconBg:'linear-gradient(135deg,#0ea5e9,#38bdf8)', desc:'Highlight, comment and annotate',     tier:'free' },
  { name:'PDF Page Manager',  tag:'LIVE', href:'/pdf-page-manager',   cat:'Pages',    Icon:Layers,          iconBg:'linear-gradient(135deg,#f59e0b,#fbbf24)', desc:'Drag-and-drop page reordering',         tier:'free' },
  { name:'PDF Cropper',       tag:'LIVE', href:'/pdf-cropper',        cat:'Pages',    Icon:Scissors,        iconBg:'linear-gradient(135deg,#0d9488,#14b8a6)', desc:'Crop & trim PDF page margins',          tier:'free' },
  { name:'Add Page Numbers',  tag:'LIVE', href:'/add-page-numbers',   cat:'Pages',    Icon:ListOrdered,     iconBg:'linear-gradient(135deg,#f97316,#fb923c)', desc:'Add custom page numbers to PDF',        tier:'free' },
  { name:'Rotate PDF Pages',  tag:'LIVE', href:'/rotate-pdf',         cat:'Pages',    Icon:RotateCw,        iconBg:'linear-gradient(135deg,#ea580c,#f97316)', desc:'Rotate any pages to any angle',         tier:'free' },
  { name:'Extract Pages',     tag:'LIVE', href:'/extract-pages',      cat:'Pages',    Icon:Scissors,        iconBg:'linear-gradient(135deg,#d97706,#f59e0b)', desc:'Pull specific pages into a new PDF',    tier:'free' },
  { name:'Delete Pages',      tag:'LIVE', href:'/delete-pages',       cat:'Pages',    Icon:Trash2,          iconBg:'linear-gradient(135deg,#dc2626,#ef4444)', desc:'Remove unwanted pages permanently',     tier:'free' },
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
  { name:'PDF Password Lock', tag:'LIVE', href:'/pdf-password-lock',  cat:'Protect',  Icon:KeyRound,        iconBg:'linear-gradient(135deg,#dc2626,#ef4444)', desc:'Encrypt with a strong password',        tier:'free' },
  { name:'PDF Watermarker',   tag:'LIVE', href:'/pdf-watermark',      cat:'Protect',  Icon:Stamp,           iconBg:'linear-gradient(135deg,#2563eb,#60a5fa)', desc:'Add visible or hidden watermarks',      tier:'free' },
  { name:'PDF Redactor',      tag:'LIVE', href:'/pdf-redactor',       cat:'Protect',  Icon:EyeOff,          iconBg:'linear-gradient(135deg,#374151,#6b7280)', desc:'Permanently black out sensitive text',  tier:'free' },
  { name:'PDF E-Signer',      tag:'LIVE', href:'/pdf-signer',         cat:'Protect',  Icon:PenTool,         iconBg:'linear-gradient(135deg,#0d9488,#14b8a6)', desc:'Sign and collect signatures',           tier:'free' },
  { name:'PDF Compressor',    tag:'LIVE', href:'/pdf-compressor',     cat:'Organize', Icon:Minimize2,       iconBg:'linear-gradient(135deg,#d97706,#fbbf24)', desc:'Shrink file size without quality loss', tier:'free' },
  { name:'PDF Merger',        tag:'LIVE', href:'/pdf-merger',         cat:'Organize', Icon:Merge,           iconBg:'linear-gradient(135deg,#7c3aed,#8b5cf6)', desc:'Combine multiple PDFs into one',        tier:'free' },
  { name:'PDF Splitter',      tag:'LIVE', href:'/pdf-splitter',       cat:'Organize', Icon:Split,           iconBg:'linear-gradient(135deg,#e11d48,#f43f5e)', desc:'Split one PDF into many files',         tier:'free' },
  { name:'PDF Form Builder',  tag:'LIVE', href:'/pdf-form-builder',   cat:'Organize', Icon:FormInput,       iconBg:'linear-gradient(135deg,#0369a1,#0ea5e9)', desc:'Create fillable PDF forms',             tier:'free' },
]

const TOOL_FILTERS = [
  { label:'All',      catId:'All',     color:'#1d1d1f', Icon:Layers   },
  { label:'AI Tools', catId:'AI',      color:'#7c3aed', Icon:Sparkles },
  { label:'Edit',     catId:'Edit',    color:'#2563eb', Icon:FilePen  },
  { label:'Convert',  catId:'Convert', color:'#16a34a', Icon:FileType },
  { label:'Pages',    catId:'Pages',   color:'#f97316', Icon:Layers   },
  { label:'Sign',     catId:'Protect', color:'#dc2626', Icon:PenTool  },
  { label:'Organize', catId:'Organize',color:'#d97706', Icon:Merge    },
]

const TOOL_TIER_BADGE = {
  free: { label:'Free',      bg:'rgba(22,163,74,.1)',  color:'#15803d' },
  ai:   { label:'5 free/day',bg:'rgba(124,58,237,.1)', color:'#7c3aed' },
  pro:  { label:'Pro',       bg:'rgba(8,145,178,.1)',  color:'#0e7490' },
}

const ToolCard = memo(function ToolCard({ tool, catColor }: { tool: typeof TOOLS[0]; catColor: string }) {
  const isLive = tool.tag === 'LIVE' && !!tool.href
  const Icon = tool.Icon
  const badge = TOOL_TIER_BADGE[tool.tier]
  const card = (
    <div
      className="tool-card"
      style={{
        '--tc-shadow': `0 16px 40px rgba(0,0,0,.10), 0 0 0 1.5px ${catColor}30`,
        background:'#fff', border:'1.5px solid #e8e8e8', borderRadius:18,
        padding:'20px 18px 18px', display:'flex', flexDirection:'column', gap:10,
        cursor:isLive?'pointer':'default', height:'100%', position:'relative', overflow:'hidden',
        boxShadow:'0 2px 8px rgba(0,0,0,.04)',
      } as React.CSSProperties}>
      <div style={{position:'absolute',top:0,left:0,width:80,height:80,borderRadius:'0 0 80px 0',
        background:tool.iconBg,opacity:.07,pointerEvents:'none'}}/>

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

      <div style={{flex:1}}>
        <div style={{...FI, fontSize:13.5, fontWeight:700, color:'#1d1d1f', letterSpacing:'-0.02em', marginBottom:4, lineHeight:1.25}}>
          {tool.name}
        </div>
        <div style={{...FI, fontSize:11.5, color:'#9ca3af', lineHeight:1.5}}>{tool.desc}</div>
      </div>

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
    </div>
  )
  return isLive
    ? <Link href={tool.href} style={{textDecoration:'none', display:'block', height:'100%'}}>{card}</Link>
    : <div style={{height:'100%'}}>{card}</div>
})

export default function HomeAllTools() {
  const [activeTab, setActiveTab] = useState('AI Tools')
  const [search, setSearch] = useState('')
  const [showAllCats, setShowAllCats] = useState(false)

  const activeFilter = useMemo(() => TOOL_FILTERS.find(f => f.label === activeTab) ?? TOOL_FILTERS[0], [activeTab])
  const activeCat    = useMemo(() => CATS.find(c => c.id === activeFilter.catId), [activeFilter.catId])
  const q            = useMemo(() => search.trim().toLowerCase(), [search])
  const visibleTools = useMemo(() => {
    if (q) return TOOLS.filter(t => t.name.toLowerCase().includes(q))
    return activeFilter.catId === 'All' ? TOOLS : TOOLS.filter(t => t.cat === activeFilter.catId)
  }, [q, activeFilter.catId])
  const isSearching  = q.length > 0

  const handleSearch   = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), [])
  const clearSearch    = useCallback(() => setSearch(''), [])
  const handleTabClick = useCallback((label: string) => { setActiveTab(label); setSearch(''); setShowAllCats(false) }, [])

  return (
    <section id="tools" style={{background:'#f8f8fa', borderTop:'1px solid #f0f0f0', padding:'88px 28px 100px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>

        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'100px'}} transition={{duration:.5,ease:E}}
          style={{marginBottom:32}}>
          <div style={{...MONO, fontSize:10, color:'rgba(0,0,0,.35)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14}}>
            All Tools
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)', fontSize:'clamp(28px,3.5vw,46px)', fontWeight:800, color:'#1d1d1f', letterSpacing:'-0.05em', lineHeight:.96, margin:0}}>
            35+ tools. One platform.
          </h2>
        </motion.div>

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
              onChange={handleSearch}
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
              <button onClick={clearSearch} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:2,color:'#9ca3af',display:'flex'}}>
                <X size={14} strokeWidth={2}/>
              </button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:.05,ease:E}}
          className="tab-bar"
          style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:8, marginBottom:48}}>
          {TOOL_FILTERS.map(({label, catId, color, Icon:TabIcon}) => {
            const active = activeTab === label
            const count  = catId === 'All' ? TOOLS.length : TOOLS.filter(t => t.cat === catId).length
            return (
              <button key={label} onClick={() => handleTabClick(label)}
                className="filter-tab-btn"
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'9px 18px', borderRadius:99, border:'none', flexShrink:0,
                  background: active ? color : '#fff',
                  color: active ? '#fff' : '#6b7280',
                  fontSize:13, fontWeight:600, cursor:'pointer',
                  boxShadow: active ? `0 4px 16px ${color}40` : '0 1px 4px rgba(0,0,0,.08)',
                  outline:'none', transition:'color .15s, background .15s, transform .1s',
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
              </button>
            )
          })}
        </motion.div>

        <AnimatePresence mode="sync">
          <motion.div key={activeTab + q}
            initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0}}
            transition={{duration:.15, ease:[.22,1,.36,1]}}>

            {isSearching ? (
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
              <div style={{display:'flex', flexDirection:'column', gap:64}}>
                {(showAllCats ? CATS : CATS.slice(0, 3)).map(cat => {
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
                {!showAllCats && (
                  <div style={{textAlign:'center'}}>
                    <button onClick={() => setShowAllCats(true)}
                      style={{...FI, display:'inline-flex', alignItems:'center', gap:8,
                        padding:'11px 28px', borderRadius:99, border:'1.5px solid #e5e7eb',
                        background:'#fff', color:'#374151', fontSize:14, fontWeight:600, cursor:'pointer',
                        boxShadow:'0 2px 8px rgba(0,0,0,.06)'}}>
                      Show all {TOOLS.length} tools
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
