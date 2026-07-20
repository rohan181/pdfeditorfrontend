const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const REVIEWS = [
  { name: 'Sarah K.',  role: 'HR Manager',           avatar: 'SK', color: '#a78bfa', stars: 5, date: 'Jun 2025', source: 'Product Hunt',
    text: 'I fill onboarding forms for new hires every week. The AI Form Filler saves me at least 30 minutes per document — it detects every field and fills them perfectly from the employee details I paste in.',
    tool: 'AI Form Filler' },
  { name: 'James T.',  role: 'Freelance Designer',   avatar: 'JT', color: '#60a5fa', stars: 5, date: 'May 2025', source: 'Product Hunt',
    text: 'I send contracts and invoices constantly. Being able to edit a PDF, add my signature and send it — all in the browser without installing anything — is exactly what I needed.',
    tool: 'PDF Editor + E-Signer' },
  { name: 'Priya M.',  role: 'Graduate Student',     avatar: 'PM', color: '#4ade80', stars: 4, date: 'Jun 2025', source: 'Google',
    text: 'The PDF Summarizer and Quiz Creator are genuinely useful for studying. I upload a lecture PDF and get a clean summary and practice questions in under a minute. Saves a lot of revision time.',
    tool: 'PDF Summarizer · Quiz Creator' },
  { name: 'David R.',  role: 'Small Business Owner', avatar: 'DR', color: '#fb923c', stars: 5, date: 'Apr 2025', source: 'Google',
    text: 'We merge supplier invoices every month before sending them to our accountant. The PDF Merger works flawlessly every time, and compressing them keeps email attachments small.',
    tool: 'PDF Merger · Compressor' },
  { name: 'Lena W.',   role: 'Legal Assistant',      avatar: 'LW', color: '#f87171', stars: 5, date: 'May 2025', source: 'Trustpilot',
    text: 'Client documents contain sensitive information. The redaction tool permanently removes it — not just covers it with a box. And the password lock gives clients extra peace of mind.',
    tool: 'PDF Redactor · Password Lock' },
  { name: 'Arjun S.',  role: 'Research Analyst',     avatar: 'AS', color: '#38bdf8', stars: 5, date: 'Jun 2025', source: 'Trustpilot',
    text: 'I work with academic papers in multiple languages. The OCR scanner extracts text from scanned journals and the translator handles the rest. Two AI tools that genuinely save hours.',
    tool: 'PDF OCR · Translator' },
]

function Stars({ n }: { n: number }) {
  return (
    <div style={{display:'flex',gap:2}}>
      {Array.from({length:5}).map((_,i)=>(
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < n ? '#f59e0b' : 'rgba(255,255,255,.15)'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function SiteTestimonials() {
  return (
    <section style={{background:'#0f172a',padding:'80px 28px 72px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{marginBottom:48,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <div>
            <div style={{...MONO,fontSize:10,color:'rgba(255,255,255,.3)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
              Reviews
            </div>
            <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:800,color:'#fff',letterSpacing:'-0.05em',lineHeight:.97,margin:0}}>
              What people are saying
            </h2>
          </div>
          <p style={{...FI,fontSize:14,color:'rgba(255,255,255,.4)',maxWidth:320,lineHeight:1.65,margin:0}}>
            Real feedback from Product Hunt, Google, and Trustpilot.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:12}}>
          {REVIEWS.map(({name,role,avatar,color,stars,date,source,text,tool})=>(
            <div key={name}
              style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,
                padding:'22px 20px',display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                <Stars n={stars}/>
                <span style={{...MONO,fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'0.06em'}}>
                  {source} · {date}
                </span>
              </div>
              <p style={{...FI,fontSize:13.5,color:'rgba(255,255,255,.75)',lineHeight:1.7,margin:0,flex:1}}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{...MONO,fontSize:9,fontWeight:700,color,background:`${color}18`,
                padding:'3px 9px',borderRadius:99,width:'fit-content',letterSpacing:'0.05em'}}>
                {tool}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:4,borderTop:'1px solid rgba(255,255,255,.07)'}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:`${color}22`,
                  display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{...MONO,fontSize:10,fontWeight:800,color,letterSpacing:'0.04em'}}>{avatar}</span>
                </div>
                <div>
                  <div style={{...FI,fontSize:13,fontWeight:700,color:'#fff',lineHeight:1.2}}>{name}</div>
                  <div style={{...FI,fontSize:11.5,color:'rgba(255,255,255,.4)',marginTop:1}}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
