'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  const [active, setActive] = useState(0)
  const selected = cases[active]
  const ActiveIcon = selected.Icon

  return (
    <section className="home-responsive-section" style={{background:'#F8FAFC',padding:'88px 28px 80px',borderTop:'1px solid #E2E8F0'}}>
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

        <div className="use-case-tabs" role="tablist" aria-label="Choose a use case" style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:10,marginBottom:18}}>
          {cases.map(({Icon,title,color},i)=>(
            <button key={title} id={`use-case-tab-${i}`} type="button" role="tab" aria-selected={active===i}
              aria-controls="use-case-panel" tabIndex={active===i ? 0 : -1} onClick={()=>setActive(i)}
              onKeyDown={event=>{
                if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return
                event.preventDefault()
                const next = event.key==='Home' ? 0 : event.key==='End' ? cases.length-1 : event.key==='ArrowRight' ? (i+1)%cases.length : (i-1+cases.length)%cases.length
                setActive(next)
                document.getElementById(`use-case-tab-${next}`)?.focus()
              }}
              style={{...FI,display:'inline-flex',alignItems:'center',gap:7,padding:'10px 15px',borderRadius:99,border:`1px solid ${active===i?color:'#E2E8F0'}`,background:active===i?`${color}10`:'#fff',color:active===i?color:'#64748B',fontSize:13,fontWeight:700,whiteSpace:'nowrap',cursor:'pointer'}}>
              <Icon size={15} strokeWidth={2}/>{title}
            </button>
          ))}
        </div>

        <div className="use-case-panel" id="use-case-panel" role="tabpanel" aria-labelledby={`use-case-tab-${active}`} style={{background:'#fff',border:'1px solid #E2E8F0',borderRadius:20,padding:'clamp(22px,4vw,38px)',display:'grid',gridTemplateColumns:'auto 1fr',gap:22,alignItems:'start'}}>
          <div style={{width:54,height:54,borderRadius:16,background:selected.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <ActiveIcon size={26} color={selected.color} strokeWidth={1.8}/>
          </div>
          <div>
            <h3 style={{...FI,fontSize:22,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.03em',margin:'0 0 8px'}}>{selected.title}</h3>
            <p style={{...FI,fontSize:15,color:'#64748B',lineHeight:1.7,maxWidth:660,margin:'0 0 18px'}}>{selected.desc}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {selected.tools.map(t=>(
                <Link key={t.name} href={t.href} className="use-case-tool" style={{...MONO,fontSize:10,fontWeight:700,padding:'7px 10px',borderRadius:9,background:selected.bg,color:selected.color,textDecoration:'none',letterSpacing:'0.03em'}}>
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
