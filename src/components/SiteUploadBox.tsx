import Link from 'next/link'
import { Upload } from 'lucide-react'

const FI = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }

export default function SiteUploadBox() {
  return (
    <section style={{background:'#fff',padding:'0 28px 64px'}}>
      <div style={{maxWidth:560,margin:'0 auto'}}>
        <Link href="/pdf-editor" style={{textDecoration:'none',display:'block'}}>
          <div className="upload-box-hover"
            style={{border:'2px dashed rgba(0,0,0,.12)',borderRadius:20,padding:'36px 32px',
              textAlign:'center',cursor:'pointer',transition:'border-color .18s,background .18s,transform .18s'}}>
            <div
              style={{width:52,height:52,borderRadius:15,background:'rgba(99,102,241,.08)',
                display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',animation:'float-y-sm 2.4s ease-in-out infinite'}}>
              <Upload size={22} color="#6366f1" strokeWidth={1.6}/>
            </div>
            <p style={{...FI,fontSize:16,fontWeight:700,color:'#1d1d1f',margin:'0 0 6px',letterSpacing:'-0.02em'}}>
              Drop your PDF here to start
            </p>
            <p style={{...FI,fontSize:13,color:'#9ca3af',margin:'0 0 20px',lineHeight:1.6}}>
              or click to browse · up to 100 MB · processed in your browser
            </p>
            <span style={{...FI,display:'inline-flex',alignItems:'center',gap:8,
              padding:'10px 24px',background:'#1d1d1f',color:'#fff',
              borderRadius:99,fontSize:13.5,fontWeight:700,letterSpacing:'-0.02em'}}>
              <Upload size={13} strokeWidth={2.5}/> Upload PDF
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
