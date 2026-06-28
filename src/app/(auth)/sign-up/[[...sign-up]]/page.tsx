'use client'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f5f7', padding:20, fontFamily:'system-ui,sans-serif' }}>
      {/* App logo above the card */}
      <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:24 }}>
        <div style={{ width:32, height:32, background:'#1d1d1f', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/>
            <polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/>
          </svg>
        </div>
        <span style={{ fontSize:18, fontWeight:800, color:'#1d1d1f', letterSpacing:'-.04em' }}>
          Edit<span style={{ color:'#0891b2' }}>PDF</span> AI
        </span>
      </Link>

      <SignUp
        appearance={{
          variables: {
            colorPrimary:     '#0891b2',
            colorBackground:  '#ffffff',
            borderRadius:     '10px',
            fontFamily:       'system-ui, sans-serif',
            fontSize:         '14px',
          },
          elements: {
            card:           { boxShadow:'0 4px 40px rgba(0,0,0,.08)', border:'1px solid #e8e8e8', borderRadius:'20px', padding:'32px 28px' },
            headerTitle:    { fontSize:'22px', fontWeight:'800', letterSpacing:'-.04em' },
            headerSubtitle: { color:'rgba(0,0,0,.4)' },
            footer:         { display:'none' },   // removes "Secured by Clerk"
            footerAction:   { display:'none' },
            footerPages:    { display:'none' },
            socialButtonsBlockButton: { border:'1.5px solid #e0e0e0', borderRadius:'10px', fontWeight:'600' },
            formButtonPrimary: { backgroundColor:'#1d1d1f', borderRadius:'10px', fontWeight:'700', fontSize:'14px' },
            formFieldInput: { borderRadius:'9px', border:'1.5px solid #e0e0e0', backgroundColor:'#fafafa', fontSize:'14px' },
            dividerLine:    { backgroundColor:'#e8e8e8' },
            dividerText:    { color:'rgba(0,0,0,.3)' },
          },
        }}
      />
    </div>
  )
}
