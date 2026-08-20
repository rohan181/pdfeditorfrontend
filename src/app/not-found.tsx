import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Page Not Found | EditPDF AI',
  description: 'The requested EditPDF AI page could not be found.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main
        id="main-content"
        style={{
          alignItems: 'center',
          background: 'linear-gradient(180deg,#f8faff 0%,#fff 72%)',
          display: 'flex',
          minHeight: '62vh',
          padding: '88px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ margin: '0 auto', maxWidth: 660 }}>
          <p style={{ color: '#4F7FFA', fontSize: 13, fontWeight: 800, letterSpacing: '.12em', margin: '0 0 14px', textTransform: 'uppercase' }}>
            Error 404
          </p>
          <h1 style={{ color: '#111827', fontSize: 'clamp(40px,7vw,68px)', letterSpacing: '-.055em', lineHeight: 1.02, margin: 0 }}>
            Page not found
          </h1>
          <p style={{ color: '#5b6472', fontSize: 18, lineHeight: 1.7, margin: '24px auto 32px', maxWidth: 560 }}>
            The address may be incorrect, or the page may have moved. Continue with a PDF tool or browse the practical guides.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link href="/" style={{ background: '#1d1d1f', borderRadius: 999, color: '#fff', fontWeight: 750, padding: '12px 22px', textDecoration: 'none' }}>
              Return to the homepage
            </Link>
            <Link href="/pdf-editor" style={{ border: '1px solid #d8dee9', borderRadius: 999, color: '#1d1d1f', fontWeight: 750, padding: '12px 22px', textDecoration: 'none' }}>
              Open the PDF Editor
            </Link>
            <Link href="/guides" style={{ border: '1px solid #d8dee9', borderRadius: 999, color: '#1d1d1f', fontWeight: 750, padding: '12px 22px', textDecoration: 'none' }}>
              Browse PDF guides
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
