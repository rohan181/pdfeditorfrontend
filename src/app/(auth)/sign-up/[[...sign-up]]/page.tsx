'use client'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f5f7', padding:20, fontFamily:'system-ui,sans-serif' }}>
      {/* App logo above the card */}
      <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:24 }}>
        <svg width="32" height="32" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="lg-su" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4F7FFA"/><stop offset="100%" stopColor="#8B3FEC"/></linearGradient></defs>
          <path d="M5,2 L19,2 L27,10 L27,26 Q27,28 25,28 L5,28 Q3,28 3,26 L3,4 Q3,2 5,2 Z" fill="white" stroke="url(#lg-su)" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M19,2 L19,10 L27,10" fill="none" stroke="url(#lg-su)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="22" x2="20" y2="11" stroke="url(#lg-su)" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="8" cy="23" r="1.8" fill="url(#lg-su)"/>
        </svg>
        <span style={{ fontSize:18, fontWeight:800, color:'#0D1B4B', letterSpacing:'-.03em' }}>
          EditPDF<span style={{ marginLeft:2, background:'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}> AI</span>
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
