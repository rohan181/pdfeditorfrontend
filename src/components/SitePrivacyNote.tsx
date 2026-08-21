import Link from 'next/link'
import { Globe, Server, Shield, ArrowRight } from 'lucide-react'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const CARDS = [
  { Icon: Globe,      title: 'Core tools process locally', desc: 'Core editing, compression, signing, supported browser-only conversion, and page-management workflows process selected files in your browser.' },
  { Icon: Server,     title: 'No document database',       desc: 'The application does not write PDF, image, or extracted document content to its database or object storage.' },
  { Icon: Shield,     title: 'AI data depends on the feature', desc: 'AI tools may send extracted text, page images, uploaded images, or a PDF through server routes to configured processing providers.' },
]

export default function SitePrivacyNote() {
  return (
    <section id="privacy" className="home-responsive-section" style={{background:'#0F172A',padding:'80px 28px',borderTop:'1px solid #1E293B'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{marginBottom:40,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'#94a3b8',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            Privacy &amp; Security
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,40px)',fontWeight:800,color:'#F8FAFC',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 12px'}}>
            Private Browser-Based PDF Processing
          </h2>
          <p style={{...FI,fontSize:15,color:'#CBD5E1',margin:'0 auto',maxWidth:440,lineHeight:1.65}}>
            Core tools process locally; AI features disclose the content they send for server-side processing.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:0,marginBottom:32,borderTop:'1px solid rgba(255,255,255,.1)',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
          {CARDS.map(({Icon,title,desc})=>(
            <div key={title} style={{padding:'28px clamp(12px,2vw,28px)',display:'flex',flexDirection:'column',gap:10}}>
              <div style={{width:40,height:40,borderRadius:11,background:'rgba(52,211,153,.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={19} color="#34D399" strokeWidth={1.8}/>
              </div>
              <div style={{...FI,fontSize:13.5,fontWeight:700,color:'#F8FAFC',letterSpacing:'-0.02em'}}>{title}</div>
              <p style={{...FI,fontSize:12.5,color:'#CBD5E1',lineHeight:1.65,margin:0}}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center'}}>
          <Link href="/privacy"
            style={{...FI,display:'inline-flex',alignItems:'center',gap:6,fontSize:13.5,fontWeight:600,
              color:'#34D399',textDecoration:'none',borderBottom:'1.5px solid rgba(52,211,153,.35)',paddingBottom:1}}>
            See exactly how we protect your files <ArrowRight size={13} strokeWidth={2.5}/>
          </Link>
        </div>
      </div>
    </section>
  )
}
