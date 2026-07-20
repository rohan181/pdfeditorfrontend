import Link from 'next/link'
import {
  FilePen, Minimize2, Merge, Split, PenTool, FileType, Sparkles, ChevronRight,
} from 'lucide-react'

const FI = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const popular = [
  { label:'Edit PDF',      href:'/pdf-editor',         Icon:FilePen,   color:'#6366f1', tier:'free' },
  { label:'Compress PDF',  href:'/pdf-compressor',     Icon:Minimize2, color:'#f97316', tier:'free' },
  { label:'Merge PDF',     href:'/pdf-merger',         Icon:Merge,     color:'#0891b2', tier:'free' },
  { label:'Split PDF',     href:'/pdf-splitter',       Icon:Split,     color:'#16a34a', tier:'free' },
  { label:'Sign PDF',      href:'/pdf-signer',         Icon:PenTool,   color:'#dc2626', tier:'free' },
  { label:'PDF to Word',   href:'/pdf-to-word',        Icon:FileType,  color:'#2563eb', tier:'pro'  },
  { label:'AI PDF Form Filler',href:'/ai-pdf-form-filler', Icon:Sparkles,  color:'#7c3aed', tier:'ai'  },
]

const TIER_BADGE: Record<string, { label:string; bg:string; color:string }> = {
  free: { label:'Free',       bg:'rgba(22,163,74,.1)',   color:'#15803d' },
  ai:   { label:'5 free/day', bg:'rgba(124,58,237,.1)',  color:'#7c3aed' },
  pro:  { label:'Pro',        bg:'rgba(8,145,178,.1)',   color:'#0e7490' },
}

export default function SitePopularTools() {
  return (
    <section style={{background:'#fff',padding:'72px 28px 60px',borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{marginBottom:36}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12}}>
            Most used
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,38px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',lineHeight:1,margin:0}}>
            Popular tools
          </h2>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
          {popular.map(({label,href,Icon,color,tier})=>{
            const badge = TIER_BADGE[tier]
            return (
              <Link
                key={href}
                href={href}
                className="pop-tool-link"
                style={{
                  '--hl-bg': color+'08',
                  '--hl-border': color+'30',
                  '--hl-shadow': color+'18',
                  display:'inline-flex',alignItems:'center',gap:10,
                  padding:'11px 18px',borderRadius:14,textDecoration:'none',
                  background:'#f8f8fa',border:'1.5px solid #ebebeb',
                } as React.CSSProperties}
              >
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
