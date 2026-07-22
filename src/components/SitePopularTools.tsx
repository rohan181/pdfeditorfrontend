import Link from 'next/link'
import {
  FilePen, Minimize2, Merge, Split, PenTool, FileType, Sparkles, Scissors, ChevronRight,
} from 'lucide-react'

const FI = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

type ToolTier = 'free' | 'ai' | 'pro'
type ToolKind = 'standard' | 'ai' | 'security'

const KIND_STYLE: Record<ToolKind, { iconBg: string; iconColor: string }> = {
  standard: { iconBg: '#EFF6FF', iconColor: '#2563EB' },
  ai:       { iconBg: '#F5F3FF', iconColor: '#7C3AED' },
  security: { iconBg: '#ECFDF5', iconColor: '#059669' },
}

const popular: { label: string; href: string; Icon: any; tier: ToolTier; kind: ToolKind }[] = [
  { label:'Edit PDF',           href:'/pdf-editor',         Icon:FilePen,   tier:'free', kind:'standard' },
  { label:'Compress PDF',       href:'/pdf-compressor',     Icon:Minimize2, tier:'free', kind:'standard' },
  { label:'Merge PDF',          href:'/pdf-merger',         Icon:Merge,     tier:'free', kind:'standard' },
  { label:'Split PDF',          href:'/pdf-splitter',       Icon:Split,     tier:'free', kind:'standard' },
  { label:'Extract Pages',      href:'/extract-pages',      Icon:Scissors,  tier:'free', kind:'standard' },
  { label:'Sign PDF',           href:'/pdf-signer',         Icon:PenTool,   tier:'free', kind:'security' },
  { label:'PDF to Word',        href:'/pdf-to-word',        Icon:FileType,  tier:'pro',  kind:'standard' },
  { label:'AI PDF Form Filler', href:'/ai-pdf-form-filler', Icon:Sparkles,  tier:'ai',   kind:'ai'       },
]

const TIER_BADGE: Record<ToolTier, { label: string; bg: string; color: string }> = {
  free: { label:'Free',       bg:'rgba(16,185,129,.1)',   color:'#059669' },
  ai:   { label:'5 free/day', bg:'rgba(124,58,237,.1)',   color:'#7C3AED' },
  pro:  { label:'Pro',        bg:'rgba(37,99,235,.1)',    color:'#2563EB' },
}

export default function SitePopularTools() {
  return (
    <section style={{background:'#fff',padding:'64px 28px 32px',borderTop:'1px solid #E2E8F0'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{marginBottom:36}}>
          <div style={{...MONO,fontSize:10,color:'#64748B',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12}}>
            Most used
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,38px)',fontWeight:800,color:'#0F172A',letterSpacing:'-0.04em',lineHeight:1,margin:0}}>
            Popular tools
          </h2>
          <p style={{...FI,fontSize:15,color:'#64748B',lineHeight:1.7,maxWidth:720,margin:'16px 0 0'}}>
            EditPDF AI is a browser-based PDF workspace for <Link href="/pdf-editor" style={{color:'#2563EB',fontWeight:600}}>editing PDFs</Link>,{' '}
            <Link href="/pdf-signer" style={{color:'#2563EB',fontWeight:600}}>filling and signing forms</Link>,{' '}
            <Link href="/pdf-compressor" style={{color:'#2563EB',fontWeight:600}}>compressing files</Link>, organizing pages, and converting documents.
            Core tools work without an account, while optional AI tools can <Link href="/pdf-ocr" style={{color:'#7C3AED',fontWeight:600}}>OCR scanned pages</Link>,{' '}
            <Link href="/pdf-summarizer" style={{color:'#7C3AED',fontWeight:600}}>summarize documents</Link>, translate content, and automate form filling.
          </p>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
          {popular.map(({label,href,Icon,tier,kind})=>{
            const badge = TIER_BADGE[tier]
            const { iconBg, iconColor } = KIND_STYLE[kind]
            return (
              <Link
                key={href}
                href={href}
                className="pop-tool-link"
                style={{
                  '--hl-bg': iconColor+'0d',
                  '--hl-border': iconColor+'40',
                  '--hl-shadow': iconColor+'18',
                  display:'inline-flex',alignItems:'center',gap:10,
                  padding:'11px 18px',borderRadius:14,textDecoration:'none',
                  background:'#fff',border:'1.5px solid #E2E8F0',
                } as React.CSSProperties}
              >
                <div style={{width:32,height:32,borderRadius:9,background:iconBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon size={15} color={iconColor} strokeWidth={2}/>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  <span style={{...FI,fontSize:13.5,fontWeight:700,color:'#0F172A',whiteSpace:'nowrap',lineHeight:1}}>{label}</span>
                  <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.06em',padding:'1.5px 6px',borderRadius:99,background:badge.bg,color:badge.color,width:'fit-content'}}>
                    {badge.label}
                  </span>
                </div>
                <ChevronRight size={13} color="#94A3B8" strokeWidth={2}/>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
