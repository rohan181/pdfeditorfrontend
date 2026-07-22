import Link from 'next/link'
import { Upload } from 'lucide-react'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

export default function SiteCTA() {
  return (
    <section className="site-cta-sec" style={{background:'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)'}}>
      <style>{`
        .site-cta-sec { padding:88px 28px; }
        .site-cta-btn { transition:gap .2s, opacity .15s; }
        .site-cta-btn:hover { gap:16px !important; opacity:.92; }
        @media(max-width:900px){ .site-cta-sec { padding:72px 20px !important; } }
        @media(max-width:600px){ .site-cta-sec { padding:60px 16px !important; } }
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{...MONO,fontSize:10,color:'rgba(255,255,255,.78)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:24}}>
          Get started
        </div>
        <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(40px,5.5vw,64px)',fontWeight:800,color:'#fff',letterSpacing:'-0.05em',lineHeight:.98,margin:'0 0 32px'}}>
          Ready to edit<br/>your PDF?
        </h2>
        <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
          <Link href="/pdf-editor" className="site-cta-btn"
            style={{...FI,display:'inline-flex',alignItems:'center',gap:9,padding:'15px 34px',
              background:'#fff',color:'#0F172A',borderRadius:99,fontSize:16,fontWeight:700,
              textDecoration:'none',letterSpacing:'-0.025em',boxShadow:'0 4px 24px rgba(0,0,0,.18)'}}>
            <Upload size={16} strokeWidth={2.5}/> Open PDF Editor
          </Link>
          <span style={{...MONO,fontSize:11,color:'rgba(255,255,255,.82)',letterSpacing:'0.08em',textTransform:'uppercase'}}>
            Start with your PDF — no signup required
          </span>
        </div>
      </div>
    </section>
  )
}
