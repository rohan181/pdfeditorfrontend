import Link from 'next/link'
import { GraduationCap, Briefcase, FilePen, Building2, FlaskConical } from 'lucide-react'

const FI = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

export default function SiteUseCases() {
  const cases = [
    {
      Icon: GraduationCap, color: '#7c3aed', bg: 'rgba(124,58,237,.08)',
      title: 'Students',
      desc: 'Summarise lecture notes, generate practice quizzes, and OCR scan handwritten pages — all before your next class.',
      tools: [
        { name: 'PDF Summarizer',  href: '/pdf-summarizer' },
        { name: 'Quiz Creator',    href: '/quiz-creator'   },
        { name: 'PDF OCR Scanner', href: '/pdf-ocr'        },
      ],
    },
    {
      Icon: Briefcase, color: '#2563eb', bg: 'rgba(37,99,235,.08)',
      title: 'Job Seekers',
      desc: 'Fill job application forms with AI, sign offer letters digitally, and convert your CV to PDF in seconds.',
      tools: [
        { name: 'AI Form Filler', href: '/ai-pdf-form-filler' },
        { name: 'PDF E-Signer',   href: '/pdf-signer'         },
        { name: 'Word → PDF',     href: '/word-to-pdf'        },
      ],
    },
    {
      Icon: FilePen, color: '#10B981', bg: 'rgba(16,185,129,.08)',
      title: 'Freelancers',
      desc: 'Edit invoice PDFs, add your signature to contracts, and redact sensitive client details before sharing.',
      tools: [
        { name: 'PDF Editor',   href: '/pdf-editor'   },
        { name: 'PDF E-Signer', href: '/pdf-signer'   },
        { name: 'PDF Redactor', href: '/pdf-redactor' },
      ],
    },
    {
      Icon: Building2, color: '#f97316', bg: 'rgba(249,115,22,.08)',
      title: 'Small Businesses',
      desc: 'Merge multi-page reports, compress attachments for email, and lock confidential documents with a password.',
      tools: [
        { name: 'PDF Merger',        href: '/pdf-merger'        },
        { name: 'PDF Compressor',    href: '/pdf-compressor'    },
        { name: 'PDF Password Lock', href: '/pdf-password-lock' },
      ],
    },
    {
      Icon: FlaskConical, color: '#2563EB', bg: 'rgba(37,99,235,.08)',
      title: 'Researchers',
      desc: 'Translate academic papers, extract text from scanned journals, and create mind maps from long PDFs.',
      tools: [
        { name: 'PDF Translator', href: '/pdf-translator' },
        { name: 'PDF OCR Scanner',href: '/pdf-ocr'        },
        { name: 'PDF Mind Map',   href: '/mind-map'       },
      ],
    },
  ]

  return (
    <section style={{background:'#F8FAFC',padding:'88px 28px 80px',borderTop:'1px solid #E2E8F0'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{marginBottom:48}}>
          <div style={{...MONO,fontSize:10,color:'#64748B',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>
            Use cases
          </div>
          <h2 style={{fontFamily:'var(--font-jakarta,system-ui)',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.05em',lineHeight:.97,margin:'0 0 12px'}}>
            Built for every PDF task
          </h2>
          <p style={{...FI,fontSize:15,color:'#6b7280',maxWidth:480,lineHeight:1.65,margin:0}}>
            Whether you are a student, professional or business — EditPDF AI has the right tool for you.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
          {cases.map(({Icon,color,bg,title,desc,tools})=>(
            <div key={title}
              style={{background:'#fff',border:'1.5px solid #E2E8F0',borderRadius:20,padding:'24px 20px 20px',
                display:'flex',flexDirection:'column',gap:12}}>
              <div style={{width:44,height:44,borderRadius:13,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon size={22} color={color} strokeWidth={1.8}/>
              </div>
              <div>
                <div style={{...FI,fontSize:15,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.03em',marginBottom:6}}>{title}</div>
                <p style={{...FI,fontSize:13,color:'#6b7280',lineHeight:1.65,margin:'0 0 12px'}}>{desc}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {tools.map(t=>(
                    <Link key={t.name} href={t.href} style={{textDecoration:'none'}}>
                      <span className="use-case-tool" style={{...MONO,fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:99,
                        background:bg,color,letterSpacing:'0.04em',display:'inline-block',
                        transition:'opacity .12s'}}>
                        {t.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
