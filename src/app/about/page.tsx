import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us — EditPDF AI',
  description: 'Learn about EditPDF AI — our mission to make powerful PDF editing free and accessible to everyone, everywhere.',
}

const VALUES = [
  {
    icon: '🔓',
    title: 'Free by default',
    body: 'We believe powerful PDF tools should not cost money. All 35+ core tools are permanently free — no trial period, no hidden limits, no credit card.',
  },
  {
    icon: '🔒',
    title: 'Privacy first',
    body: 'Your files never leave your device. PDF editing and merging happen entirely in your browser. AI features only send text context — your raw file is never uploaded to any server.',
  },
  {
    icon: '⚡',
    title: 'AI that actually helps',
    body: 'We build AI features that save real time — auto-filling form fields from a photo of your ID, summarising a 40-page contract in seconds, translating a PDF without losing its layout.',
  },
  {
    icon: '🌍',
    title: 'Built for everyone',
    body: 'Students printing their first CV, freelancers chasing signatures, small businesses converting invoices — EditPDF AI works the same for all of them, on any device, in any browser.',
  },
]

const STATS = [
  { value: '35+',  label: 'Free PDF tools' },
  { value: '100%', label: 'Browser-based, no install' },
  { value: '$0',   label: 'Cost for core tools' },
  { value: '$1',   label: 'Pro plan per month' },
]

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'var(--font-inter,system-ui,sans-serif)', color: '#1d1d1f', background: '#fff', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lg-ab" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4F7FFA"/>
                <stop offset="100%" stopColor="#8B3FEC"/>
              </linearGradient>
            </defs>
            <path d="M5,2 L19,2 L27,10 L27,26 Q27,28 25,28 L5,28 Q3,28 3,26 L3,4 Q3,2 5,2 Z" fill="white" stroke="url(#lg-ab)" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M19,2 L19,10 L27,10" fill="none" stroke="url(#lg-ab)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="22" x2="20" y2="11" stroke="url(#lg-ab)" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="8" cy="23" r="1.8" fill="url(#lg-ab)"/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0D1B4B', letterSpacing: '-.03em' }}>
            EditPDF<span style={{ marginLeft: 2, background: 'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/pricing" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
          <Link href="/pdf-editor" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 99, background: '#1d1d1f' }}>
            Open Editor
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', background: 'rgba(79,127,250,.1)', color: '#4F7FFA',
          border: '1px solid rgba(79,127,250,.25)', borderRadius: 100,
          fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
          padding: '5px 14px', marginBottom: 24, textTransform: 'uppercase',
        }}>
          About EditPDF AI
        </span>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.08, margin: '0 0 20px' }}>
          PDF tools should be free.<br />
          <span style={{ background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            So we made them free.
          </span>
        </h1>
        <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>
          EditPDF AI is an online PDF editor built on a simple idea: the tools you need to edit, sign, fill, and convert PDFs should cost you nothing — and your files should never leave your device.
        </p>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ background: '#f5f5f7', borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', padding: '32px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 24, textAlign: 'center' }}>
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.04em', background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, marginBottom: 6 }}>
                {value}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 16 }}>Our story</div>
        <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 24px', lineHeight: 1.2 }}>
          Built out of frustration with expensive, bloated PDF software
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            'We were tired of paying $15/month for a PDF tool we used twice a week. Or downloading bloated desktop apps just to add a signature. Or uploading sensitive documents to some random website with no privacy policy.',
            'So we built EditPDF AI — starting with the tools we needed most: edit text, merge files, compress, sign, and fill forms. All running in the browser. All free. No account required.',
            'We then added AI on top: an assistant that reads your PDF form and fills it from your CV or ID card, a summariser that turns a 50-page report into a paragraph, an OCR scanner that extracts text from scanned documents in seconds.',
            'We keep the core free forever. Pro is $1/month — just enough to keep the AI models running for users who need unlimited access.',
          ].map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: '#374151', lineHeight: 1.75, margin: 0 }}>{para}</p>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ background: '#f5f5f7', borderTop: '1px solid #ebebeb', padding: '72px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12 }}>What we believe</div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-.03em', margin: 0 }}>Our principles</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', border: '1.5px solid #e5e7eb' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-.02em' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy note ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(79,127,250,.06),rgba(139,63,236,.06))', border: '1.5px solid rgba(79,127,250,.18)', borderRadius: 20, padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>🔒</span>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-.03em' }}>Your privacy is non-negotiable</h3>
              <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 14px' }}>
                All PDF editing, merging, splitting, and compressing happens directly in your browser using WebAssembly. Your files are never sent to our servers.
              </p>
              <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                When you use AI features, only the text content is sent to process your request. Your document&apos;s raw bytes stay on your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section style={{ background: '#1d1d1f', padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-.04em' }}>
          Have a question or idea?
        </h2>
        <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 32px', lineHeight: 1.6 }}>
          We read every email. Whether it&apos;s a bug, a feature request, or just feedback — reach out.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="mailto:support@editpdfai.com"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            ✉ support@editpdfai.com
          </Link>
          <Link href="/pdf-editor"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.2)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Try it free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <div style={{ background: '#1d1d1f', borderTop: '1px solid rgba(255,255,255,.07)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: '#4b5563' }}>© {new Date().getFullYear()} EditPDF AI. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontSize: 12, color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
      </div>

    </div>
  )
}
