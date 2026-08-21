import { Upload, Sparkles, PenTool, Download, ChevronRight, ChevronDown } from 'lucide-react'
import { TOOL_COUNT } from '@/lib/toolMeta'
import { Card, Container, Eyebrow, Heading, Text } from '@/components/ui'

const FI = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }
const RED = '#E24B4A'

export default function SiteHowItWorks() {
  const steps = [
    {
      n: '01', color: '#6366f1', bg: 'rgba(99,102,241,.08)',
      Icon: Upload,
      title: 'Upload your document',
      desc: 'Choose a supported PDF. Core tools open it locally; AI-assisted actions require a signed-in account.',
    },
    {
      n: '02', color: '#7c3aed', bg: 'rgba(124,58,237,.08)',
      Icon: Sparkles,
      title: 'Choose a PDF or AI tool',
      desc: `Pick from ${TOOL_COUNT} active tools — edit, compress, merge, OCR scan, translate, summarise, or use AI-assisted form filling.`,
    },
    {
      n: '03', color: RED, bg: 'rgba(226,75,74,.08)',
      Icon: PenTool,
      title: 'Edit, fill, sign or convert',
      desc: 'Make changes directly in your browser. Add text, annotations, or a visual signature. AI-assisted conversions use the shared daily allowance.',
    },
    {
      n: '04', color: '#16a34a', bg: 'rgba(22,163,74,.08)',
      Icon: Download,
      title: 'Download securely',
      desc: 'Download the result when processing finishes. Core workflows need no account; AI actions use Free or Pro access.',
    },
  ]

  return (
    <section className="ds-how-it-works">
      <Container>

        <div className="ds-centered-intro">
          <Eyebrow>
            How it works
          </Eyebrow>
          <Heading as="h2">
            Four simple steps
          </Heading>
          <Text size="small">
            Core workflows run in your browser. AI-assisted steps send the required content through server routes.
          </Text>
        </div>

        <div className="ds-info-card-grid">
          {steps.map(({n,color,bg,Icon,title,desc},i) => (
            <Card key={n} variant="info" className="ds-step-card">

              <span style={{position:'absolute',top:16,right:18,...MONO,fontSize:11,fontWeight:800,
                color:'rgba(0,0,0,.08)',letterSpacing:'0.06em'}}>
                {n}
              </span>

              <div style={{width:46,height:46,borderRadius:13,background:bg,
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={22} color={color} strokeWidth={1.8}/>
              </div>

              <div>
                <Heading as="h3" style={{fontSize:15,marginBottom:6}}>
                  {title}
                </Heading>
                <Text size="small" style={{fontSize:13}}>
                  {desc}
                </Text>
              </div>

              {i < steps.length - 1 && (
                <div style={{position:'absolute',top:'50%',right:-12,transform:'translateY(-50%)',
                  width:20,height:20,borderRadius:'50%',background:'#fff',border:'1.5px solid #e5e7eb',
                  display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>
                  <ChevronRight size={11} color="#9ca3af" strokeWidth={2.5}/>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:28}}>
          <a href="#how-it-works-detail"
            style={{...FI,background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#9ca3af',fontWeight:500,display:'inline-flex',alignItems:'center',gap:5,textDecoration:'none'}}>
            See detailed walkthrough below <ChevronDown size={13} strokeWidth={2}/>
          </a>
        </div>
      </Container>
    </section>
  )
}
