import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import {
  FREE_AI_DAILY_LIMIT,
} from '@/lib/productMessaging'
import { PRO_BILLING_SUMMARY, PRO_PRICE_DISPLAY } from '@/lib/pricing'
import { ButtonLink, Card, Container, Eyebrow, Heading, Text } from '@/components/ui'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const FREE_ITEMS = ['Core browser workflows need no account','Edit, merge, split, compress','Sign & watermark PDFs',`${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day`,'AI conversions share the daily allowance']
const PRO_ITEMS  = ['Everything in Free','No daily AI-action cap','AI-assisted conversions share the same tools','AI form autofill & chat fill','Tool-specific limits still apply']

// "All PDF tools" / "No account needed" used to be marked ✓ for both tiers,
// which directly contradicted the fact that Pro itself obviously requires an
// account to bill. These say exactly what's true for each tier instead of a
// blanket claim. PDF → Word/Excel/PPT is an AI-gated conversion, not a
// Pro-exclusive one — its API routes grant signed-in free accounts the shared
// daily allowance through the same usage gate as every other AI tool here.
const COMPARE = [
  { label: 'Core PDF tools',                 free: true,    pro: true          },
  { label: 'Account required',               free: 'AI only', pro: true        },
  { label: 'AI form fill / summarise / OCR', free: `${FREE_AI_DAILY_LIMIT}/day`, pro: 'No daily cap' },
  { label: 'PDF → Word / Excel / PPT',       free: `${FREE_AI_DAILY_LIMIT}/day`, pro: 'No daily cap' },
  { label: 'Per-tool input limits',           free: true,    pro: true           },
]

export default function SitePricingPreview() {
  return (
    <section className="home-responsive-section ds-pricing-preview">
      <Container size="narrow">
        <div className="ds-centered-intro ds-pricing-intro">
          <Eyebrow>
            Pricing
          </Eyebrow>
          <Heading as="h2">
            Free core workflows. Pro removes the daily AI cap.
          </Heading>
          <Text size="small">
            Use core PDF workflows without an account. Sign in for the daily Free AI allowance, or choose Pro to remove that daily cap.
          </Text>
        </div>

        {/* Cards */}
        <div className="pricing-card-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16,marginBottom:20}}>
          {/* Free */}
          <Card variant="pricing">
            <div style={{marginBottom:20}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.1em',color:'#166534',background:'rgba(22,163,74,.1)',padding:'3px 8px',borderRadius:99}}>FREE</span>
              <div style={{...FI,fontSize:28,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',marginTop:12,marginBottom:2}}>
                $0<span style={{fontSize:14,fontWeight:500,color:'#64748B'}}>/month</span>
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
            <ButtonLink href="/pdf-editor" fullWidth>
              Start free — no signup
            </ButtonLink>
          </Card>

          {/* Pro */}
          <Card variant="pro" style={{position:'relative',overflow:'hidden'}}>
            <div style={{marginBottom:20}}>
              <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.1em',color:'#6d28d9',background:'rgba(124,58,237,.12)',padding:'3px 8px',borderRadius:99}}>PRO</span>
              <div style={{...FI,fontSize:28,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.04em',marginTop:12,marginBottom:2}}>
                {PRO_PRICE_DISPLAY}<span style={{fontSize:14,fontWeight:500,color:'#5b6472'}}>/month</span>
              </div>
              <div style={{...FI,fontSize:12,color:'#6d28d9',fontWeight:600,lineHeight:1.55}}>{PRO_BILLING_SUMMARY}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:24}}>
              {PRO_ITEMS.map(item=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:9}}>
                  <CheckCircle2 size={14} color="#6d28d9" strokeWidth={2}/>
                  <span style={{...FI,fontSize:13.5,color:'#374151'}}>{item}</span>
                </div>
              ))}
            </div>
            <ButtonLink href="/pricing" variant="pro" fullWidth>
              Compare Pro — {PRO_PRICE_DISPLAY}/month
            </ButtonLink>
          </Card>
        </div>

        {/* Comparison table — no negative-margin hacks */}
        <table className="pricing-compare" style={{display:'table',width:'100%',borderCollapse:'separate',borderSpacing:0,background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb',overflow:'hidden',marginBottom:16}}>
          <caption className="sr-only">Free and Pro plan feature comparison</caption>
          {/* Header row */}
          <thead>
            <tr className="pricing-compare-row pricing-compare-header" style={{display:'grid',gridTemplateColumns:'1fr 90px 110px',background:'#f9fafb',borderBottom:'1.5px solid #e5e7eb'}}>
              <th scope="col" style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#64748B',padding:'10px 20px',textAlign:'left'}}>Feature</th>
              <th scope="col" style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#64748B',textAlign:'center',padding:'10px 8px'}}>Free</th>
              <th scope="col" style={{...MONO,fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#6d28d9',textAlign:'center',padding:'10px 20px',background:'rgba(124,58,237,.05)',borderLeft:'1px solid rgba(124,58,237,.12)'}}>Pro ✦</th>
            </tr>
          </thead>
          <tbody>
          {COMPARE.map(({label,free,pro},i)=>(
            <tr className="pricing-compare-row pricing-compare-feature" key={label} style={{display:'grid',gridTemplateColumns:'1fr 90px 110px',
              borderBottom: i < COMPARE.length-1 ? '1px solid #f3f4f6' : 'none',alignItems:'stretch'}}>
              <th scope="row" className="pricing-compare-label" style={{...FI,fontSize:13,color:'#374151',fontWeight:500,padding:'11px 20px',display:'flex',alignItems:'center',textAlign:'left'}}>{label}</th>
              <td className="pricing-compare-value" data-plan="Free" style={{textAlign:'center',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',padding:'11px 8px'}}>
                {free===true   ? <><span aria-hidden="true" style={{color:'#166534',fontWeight:700}}>✓</span><span className="sr-only">Included</span></>
                : free===false ? <><span aria-hidden="true" style={{color:'#6b7280',fontSize:16,lineHeight:1}}>—</span><span className="sr-only">Not included</span></>
                : <span style={{...FI,fontSize:11.5,color:'#6b7280',fontWeight:600}}>{free as string}</span>}
              </td>
              <td className="pricing-compare-value pricing-compare-pro" data-plan="Pro" style={{textAlign:'center',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',padding:'11px 20px',background:'rgba(124,58,237,.04)',borderLeft:'1px solid rgba(124,58,237,.1)'}}>
                {pro===true
                  ? <><span aria-hidden="true" style={{color:'#6d28d9',fontWeight:800,fontSize:15}}>✓</span><span className="sr-only">Included</span></>
                  : <span style={{...FI,fontSize:11.5,color:'#6d28d9',fontWeight:700}}>{pro as string}</span>}
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        <div style={{textAlign:'center'}}>
          <Link href="/pricing" style={{...FI,fontSize:13,color:'#64748B',textDecoration:'none',fontWeight:500}}>
            See full pricing & feature comparison →
          </Link>
        </div>
      </Container>
    </section>
  )
}
