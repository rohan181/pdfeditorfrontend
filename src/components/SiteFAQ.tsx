import Link from 'next/link'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

export const FAQ_ITEMS = [
  {
    q: 'Is EditPDF AI really free?',
    a: 'Yes. All core PDF tools — edit, merge, split, compress, sign, watermark, and more — are free with no limits and no account required. AI features (Form Filler, Summarizer, OCR, etc.) include 5 free uses per day. Upgrade to Pro (US$1/month) for unlimited AI use.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required for any of the core tools. Sign in to unlock AI features (5 free per day) and Pro benefits such as unlimited AI, PDF-to-Word conversion, and priority processing.',
  },
  {
    q: 'Are my PDF files uploaded to a server?',
    a: 'Core tools process your PDF entirely in your browser — nothing is uploaded. For AI features, only the extracted text context is sent, never the raw PDF file.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can upload PDFs up to 100 MB. Most browser-based tools handle files well below this limit instantly. For very large files, compression before processing is recommended.',
  },
  {
    q: 'What counts as an AI use?',
    a: 'Each interaction with an AI tool (one form fill, one summary, one OCR scan, one mind map, etc.) counts as one AI use. You get 5 free AI uses per day. Pro subscribers get unlimited uses.',
  },
  {
    q: 'Can I edit scanned PDFs?',
    a: 'Yes. Use the PDF OCR Scanner to extract and copy text from any scanned document. Once extracted, you can edit, translate, or summarise the content with our other tools.',
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
