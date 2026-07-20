import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const FREE_ITEMS = ['35+ PDF tools — all free','No account required','Edit, merge, split, compress','Sign & watermark PDFs','5 AI uses per day']
const PRO_ITEMS  = ['Everything in Free','Unlimited AI uses per day','PDF → Word / Excel / PPT','Priority processing','AI form autofill & chat fill']

const COMPARE = [
  { label: 'All PDF tools',                  free: true,    pro: true          },
  { label: 'No account needed',              free: true,    pro: true          },
  { label: 'AI form fill / summarise / OCR', free: '5/day', pro: '∞ Unlimited' },
  { label: 'PDF → Word / Excel / PPT',       free: false,   pro: true          },
  { label: 'Priority processing',            free: false,   pro: true          },
]

export default function SitePricingPreview() {
  return (
    <section style={{background:'#f5f5f7',padding:'72px 28px',borderTop:'1px solid #ebebeb'}}>
      <div style={{maxWidth:860,margin:'0 auto'}}>
        <div style={{marginBottom:36,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'rgba(0,0,0,.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12}}>
            Pricing
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,36px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',lineHeight:1,margin:'0 0 8px'}}>
            Free forever. Pro for power users.
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',margin:0}}>
            All core PDF tools are free — no card, no account. Upgrade for unlimited AI.
          </p>
        </div>

        {/* Cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16,marginBottom:20}}>
          {/* Free */}
          <div style={{background:'#fff',borderRadius:20,padding:'28px 28px 24px',border:'1.5px solid #e5e7eb'}}>
            <div style={{marginBottom:20}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.1em',color:'#15803d',background:'rgba(22,163,74,.1)',padding:'3px 8px',borderRadius:99}}>FREE</span>
              <div style={{...FI,fontSize:28,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',marginTop:12,marginBottom:2}}>
                $0<span style={{fontSize:14,fontWeight:500,color:'#9ca3af'}}>/month</span>
              </div>
              <div style={{...FI,fontSize:13,color:'#6b7280'}}>No credit card needed</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:24}}>
              {FREE_ITEMS.map(item=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:9}}>
                  <CheckCircle2 size={14} color="#16a34a" strokeWidth={2}/>
                  <span style={{...FI,fontSize:13.5,color:'#374151'}}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/pdf-editor"
              style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                padding:'11px 0',borderRadius:12,background:'#f3f4f6',
                color:'#1d1d1f',fontSize:13.5,fontWeight:700,textDecoration:'none',letterSpacing:'-0.01em'}}>
              Start free — no signup
            </Link>
          </div>

          {/* Pro */}
          <div style={{background:'#0f172a',borderRadius:20,padding:'28px 28px 24px',border:'1.5px solid #1e293b',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'radial-gradient(circle,rgba(8,145,178,.25),transparent)',pointerEvents:'none'}}/>
            {/* Clean "Intro offer" label — no emoji */}
            <div style={{position:'absolute',top:16,right:16}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'.06em',color:'#94a3b8',background:'rgba(148,163,184,.1)',border:'1px solid rgba(148,163,184,.2)',padding:'3px 8px',borderRadius:99}}>INTRO OFFER</span>
            </div>
            <div style={{marginBottom:20}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.1em',color:'#0891b2',background:'rgba(8,145,178,.18)',padding:'3px 8px',borderRadius:99}}>PRO</span>
              <div style={{...FI,fontSize:28,fontWeight:800,color:'#fff',letterSpacing:'-0.04em',marginTop:12,marginBottom:2}}>
                US$1<span style={{fontSize:14,fontWeight:500,color:'rgba(255,255,255,.4)'}}>/month</span>
              </div>
              <div style={{...FI,fontSize:12,color:'rgba(255,255,255,.4)',lineHeight:1.55}}>Billed monthly · Cancel anytime</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:24}}>
              {PRO_ITEMS.map(item=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:9}}>
                  <CheckCircle2 size={14} color="#0891b2" strokeWidth={2}/>
                  <span style={{...FI,fontSize:13.5,color:'rgba(255,255,255,.8)'}}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/pricing"
              style={{...FI,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                padding:'11px 0',borderRadius:12,background:'#0891b2',
                color:'#fff',fontSize:13.5,fontWeight:700,textDecoration:'none',letterSpacing:'-0.01em'}}>
              Get Pro — $1/month
            </Link>
          </div>
        </div>

        {/* Comparison table — no negative-margin hacks */}
        <div style={{background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb',overflow:'hidden',marginBottom:16}}>
          {/* Header row */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 90px 110px',background:'#f9fafb',borderBottom:'1.5px solid #e5e7eb'}}>
            <span style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9ca3af',padding:'10px 20px'}}>Feature</span>
            <span style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9ca3af',textAlign:'center',padding:'10px 8px'}}>Free</span>
            <span style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#0891b2',textAlign:'center',padding:'10px 20px',background:'rgba(8,145,178,.05)',borderLeft:'1px solid rgba(8,145,178,.12)'}}>Pro ✦</span>
          </div>
          {COMPARE.map(({label,free,pro},i)=>(
            <div key={label} style={{display:'grid',gridTemplateColumns:'1fr 90px 110px',
              borderBottom: i < COMPARE.length-1 ? '1px solid #f3f4f6' : 'none',alignItems:'stretch'}}>
              <span style={{...FI,fontSize:13,color:'#374151',fontWeight:500,padding:'11px 20px',display:'flex',alignItems:'center'}}>{label}</span>
              <span style={{textAlign:'center',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',padding:'11px 8px'}}>
                {free===true   ? <span style={{color:'#16a34a',fontWeight:700}}>✓</span>
                : free===false ? <span style={{color:'#d1d5db',fontSize:16,lineHeight:1}}>—</span>
                : <span style={{...FI,fontSize:11.5,color:'#6b7280',fontWeight:600}}>{free as string}</span>}
              </span>
              <span style={{textAlign:'center',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',padding:'11px 20px',background:'rgba(8,145,178,.04)',borderLeft:'1px solid rgba(8,145,178,.1)'}}>
                {pro===true
                  ? <span style={{color:'#0891b2',fontWeight:800,fontSize:15}}>✓</span>
                  : <span style={{...FI,fontSize:11.5,color:'#0891b2',fontWeight:700}}>{pro as string}</span>}
              </span>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center'}}>
          <Link href="/pricing" style={{...FI,fontSize:13,color:'#9ca3af',textDecoration:'none',fontWeight:500}}>
            See full pricing & feature comparison →
          </Link>
        </div>
      </div>
    </section>
  )
}
