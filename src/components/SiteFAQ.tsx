import Link from 'next/link'
import {
  AI_ACCURACY_DISCLAIMER,
  FREE_AI_DAILY_LIMIT,
  PROCESSING_PRIVACY_SUMMARY,
  PRODUCT_ACCESS_SUMMARY,
} from '@/lib/productMessaging'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

export const FAQ_ITEMS = [
  {
    q: 'Can I use these online PDF tools for free without signing up?',
    a: PRODUCT_ACCESS_SUMMARY,
  },
  {
    q: 'Do I need to create an account?',
    a: 'Core browser workflows do not require an account. AI-assisted actions, including PDF-to-Word, PDF-to-Excel and PDF-to-PowerPoint, require sign-in and share the free daily AI-action allowance. Pro removes the daily cap.',
  },
  {
    q: 'Are my PDF files uploaded to a server?',
    a: PROCESSING_PRIVACY_SUMMARY,
  },
  {
    q: 'What is the maximum file size?',
    a: 'Limits vary by tool. Several local tools accept PDFs up to 100 MB, while Chat with PDF also enforces a 1,000-page limit and AI routes apply their own text, image, token, or request-size constraints. Check the selected tool before processing.',
  },
  {
    q: 'What counts as an AI use?',
    a: `One metered AI action is a server-backed operation such as a form fill, summary, OCR page scan, translation, mind map, quiz, or AI-assisted conversion. Signed-in free accounts can make ${FREE_AI_DAILY_LIMIT} per UTC day; Pro has no daily action cap, while tool-specific limits remain.`,
  },
  {
    q: 'Can I edit scanned PDFs?',
    a: 'The PDF OCR tool can extract text from supported scanned pages by sending rendered page images to the AI OCR route. Recognition quality varies, so review extracted text before editing, translating, or summarising it.',
  },
  {
    q: 'Can I rely on AI output without checking it?',
    a: AI_ACCURACY_DISCLAIMER,
  },
]

export default function SiteFAQ() {
  return (
    <section className="home-responsive-section" style={{background:'#fff',padding:'80px 28px',borderTop:'1px solid #f0f0f0'}}>
      <style dangerouslySetInnerHTML={{ __html: `
        .faq-item { border-bottom:1px solid #f0f0f0; }
        .faq-item summary {
          display:flex; align-items:center; justify-content:space-between;
          gap:16px; padding:20px 0; cursor:pointer; list-style:none;
          font-family:var(--font-inter,system-ui); font-size:15px; font-weight:700;
          color:#1d1d1f; letter-spacing:-0.02em; line-height:1.3;
        }
        .faq-item summary::-webkit-details-marker { display:none; }
        .faq-item summary::after {
          content:''; flex-shrink:0; width:26px; height:26px; border-radius:50%;
          background:#f3f4f6; display:flex; align-items:center; justify-content:center;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:center; transition:background .15s;
        }
        .faq-item[open] summary::after {
          background-color:#1d1d1f;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3C/svg%3E");
        }
        .faq-body { font-family:var(--font-inter,system-ui); font-size:14px; color:#6b7280; line-height:1.7; margin:0 0 20px; max-width:600px; }
      ` }} />
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{marginBottom:40,textAlign:'center'}}>
          <div style={{...MONO,fontSize:10,color:'#64748B',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>FAQ</div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(24px,3vw,40px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:0}}>
            Common questions
          </h2>
        </div>
        <div>
          {FAQ_ITEMS.map(({q,a})=>(
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p className="faq-body">{a}</p>
            </details>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:32}}>
          <Link href="/support" style={{...FI,fontSize:13.5,color:'#6b7280',textDecoration:'none',fontWeight:500}}>
            Still have questions? <span style={{color:'#2563eb',fontWeight:600}}>Visit our support page →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
