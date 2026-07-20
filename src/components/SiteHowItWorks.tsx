import { Upload, Sparkles, PenTool, Download, ChevronRight, ChevronDown } from 'lucide-react'

const FI = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }
const RED = '#E24B4A'

export default function SiteHowItWorks() {
  const steps = [
    {
      n: '01', color: '#6366f1', bg: 'rgba(99,102,241,.08)',
      Icon: Upload,
      title: 'Upload your document',
      desc: 'Drag and drop any PDF or click to browse. No account needed — your file opens instantly in the browser.',
    },
    {
      n: '02', color: '#7c3aed', bg: 'rgba(124,58,237,.08)',
      Icon: Sparkles,
      title: 'Choose a PDF or AI tool',
      desc: 'Pick from 35+ tools — edit text, compress, merge, OCR scan, translate, summarise, or auto-fill a form with AI.',
    },
    {
      n: '03', color: RED, bg: 'rgba(226,75,74,.08)',
      Icon: PenTool,
      title: 'Edit, fill, sign or convert',
      desc: 'Make changes directly in your browser. Add text, annotations, or a digital signature. Convert to Word, Excel and more.',
    },
    {
      n: '04', color: '#16a34a', bg: 'rgba(22,163,74,.08)',
      Icon: Download,
      title: 'Download securely',
      desc: 'Your finished PDF is ready in seconds. Download it, share a link, or continue editing — all for free.',
    },
  ]

  return (
    <section style={{background:'#fff', padding:'80px 28px 72px', borderTop:'1px solid #f0f0f0'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>

        <div style={{marginBottom:48, textAlign:'center'}}>
          <div style={{...MONO, fontSize:10, color:'rgba(0,0,0,.35)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14}}>
            How it works
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)', fontSize:'clamp(26px,3.5vw,44px)', fontWeight:800, color:'#1d1d1f', letterSpacing:'-0.05em', lineHeight:.97, margin:'0 0 12px'}}>
            Four simple steps
          </h2>
          <p style={{...FI, fontSize:15, color:'#6b7280', margin:'0 auto', maxWidth:420, lineHeight:1.65}}>
            From upload to download — everything runs in your browser, no install required.
          </p>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16}}>
          {steps.map(({n,color,bg,Icon,title,desc},i) => (
            <div key={n}
              style={{background:'#fafafa', border:'1.5px solid #eeeeee', borderRadius:20,
                padding:'24px 20px 22px', display:'flex', flexDirection:'column', gap:14, position:'relative'}}>

              <span style={{position:'absolute',top:16,right:18,...MONO,fontSize:11,fontWeight:800,
                color:'rgba(0,0,0,.08)',letterSpacing:'0.06em'}}>
                {n}
              </span>

              <div style={{width:46,height:46,borderRadius:13,background:bg,
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={22} color={color} strokeWidth={1.8}/>
              </div>

              <div>
                <div style={{...FI,fontSize:15,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.03em',marginBottom:6,lineHeight:1.25}}>
                  {title}
                </div>
                <p style={{...FI,fontSize:13,color:'#6b7280',lineHeight:1.65,margin:0}}>
                  {desc}
                </p>
              </div>

              {i < steps.length - 1 && (
                <div style={{position:'absolute',top:'50%',right:-12,transform:'translateY(-50%)',
                  width:20,height:20,borderRadius:'50%',background:'#fff',border:'1.5px solid #e5e7eb',
                  display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>
                  <ChevronRight size={11} color="#9ca3af" strokeWidth={2.5}/>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:28}}>
          <a href="#how-it-works-detail"
            style={{...FI,background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#9ca3af',fontWeight:500,display:'inline-flex',alignItems:'center',gap:5,textDecoration:'none'}}>
            See detailed walkthrough below <ChevronDown size={13} strokeWidth={2}/>
          </a>
        </div>
      </div>
    </section>
  )
}
