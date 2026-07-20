'use client'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f5f7', padding:20, fontFamily:'system-ui,sans-serif' }}>
      {/* App logo above the card */}
      <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:24 }}>
        <Image src="/logo.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} priority />
      </Link>

      <SignIn
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
            footer:         { display:'none' },
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
