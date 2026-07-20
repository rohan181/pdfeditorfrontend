import Link from 'next/link'
import { Upload } from 'lucide-react'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

export default function SiteCTA() {
  return (
    <section className="site-cta-sec" style={{background:'#F5F5F7',borderTop:'1px solid #e8e8e8'}}>
      <style>{`
        .site-cta-sec { padding:120px 28px; }
        .site-grad-red {
          background:linear-gradient(120deg,#E24B4A 0%,#ff7a59 55%,#E24B4A 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:shimmer 4s linear infinite;
        }
        .site-cta-btn { transition:gap .2s; }
        .site-cta-btn:hover { gap:16px !important; }
        @media(max-width:900px){ .site-cta-sec { padding:72px 20px !important; } }
        @media(max-width:600px){ .site-cta-sec { padding:60px 16px !important; } }
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:24}}>
          Get started
        </div>
        <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(44px,7vw,100px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.96,margin:'0 0 40px'}}>
          Ready to edit<br/><span className="site-grad-red">your PDF?</span>
        </h2>
        <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
          <Link href="/pdf-editor" className="site-cta-btn"
            style={{...FI,display:'inline-flex',alignItems:'center',gap:9,padding:'15px 34px',
              background:'#1d1d1f',color:'#fff',borderRadius:99,fontSize:16,fontWeight:700,
              textDecoration:'none',letterSpacing:'-0.025em',boxShadow:'0 4px 24px rgba(0,0,0,.14)'}}>
            <Upload size={16} strokeWidth={2.5}/> Upload PDF Now
          </Link>
          <span style={{...MONO,fontSize:11,color:'#999',letterSpacing:'0.08em',textTransform:'uppercase'}}>
            Start with your PDF — no signup required
          </span>
        </div>
      </div>
    </section>
  )
}
