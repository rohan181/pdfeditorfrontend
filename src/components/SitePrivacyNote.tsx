import Link from 'next/link'
import { Globe, Server, Shield, CreditCard, ArrowRight } from 'lucide-react'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const CARDS = [
  { Icon: Globe,      color: '#2563eb', bg: 'rgba(37,99,235,.08)',  title: 'Browser-based processing', desc: 'PDF editing, compression, signing and page tools all run directly in your browser. Your file never leaves your device.' },
  { Icon: Server,     color: '#16a34a', bg: 'rgba(22,163,74,.08)',  title: 'No PDF storage',           desc: 'We do not store your documents on our servers. When you close the tab, your PDF is gone — permanently.' },
  { Icon: Shield,     color: '#7c3aed', bg: 'rgba(124,58,237,.08)', title: 'Raw PDFs never sent to AI', desc: 'AI features extract only the text context needed. Your raw PDF binary is never transmitted to any AI model.' },
  { Icon: CreditCard, color: '#0891b2', bg: 'rgba(8,145,178,.08)',  title: 'Secure Stripe payments',   desc: 'All billing is handled by Stripe — the global standard for payment security. We never see or store your card details.' },
]

export default function SitePrivacyNote() {
  return (
    <section style={{background:'#f5f5f7',padding:'80px 28px',borderTop:'1px solid #e8e8e8'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{marginBottom:40,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            Privacy &amp; Security
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,40px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 12px'}}>
            Your files stay private. Always.
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',margin:'0 auto',maxWidth:440,lineHeight:1.65}}>
            Privacy is not a feature — it is the foundation of how EditPDF AI is built.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14,marginBottom:28}}>
          {CARDS.map(({Icon,color,bg,title,desc})=>(
            <div key={title} style={{background:'#fff',border:'1.5px solid #ebebeb',borderRadius:18,padding:'22px 18px',display:'flex',flexDirection:'column',gap:10}}>
              <div style={{width:40,height:40,borderRadius:11,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={19} color={color} strokeWidth={1.8}/>
              </div>
              <div style={{...FI,fontSize:13.5,fontWeight:700,color:'#1d1d1f',letterSpacing:'-0.02em'}}>{title}</div>
              <p style={{...FI,fontSize:12.5,color:'#6b7280',lineHeight:1.65,margin:0}}>{desc}</p>
            </div>
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
