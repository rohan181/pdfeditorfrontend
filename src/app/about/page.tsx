import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: { absolute: 'About EditPDF AI – Our Story and Privacy Approach' },
  description: 'EditPDF AI is an independent PDF tool suite built in Australia. Learn who we are, how your files are handled, and why we keep 35+ tools permanently free.',
  alternates: { canonical: 'https://www.editpdfai.com/about' },
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

const DATA_FACTS = [
  {
    heading: 'Core PDF tools — fully offline',
    body: 'Editing, merging, splitting, compressing, rotating, and converting all run via WebAssembly directly in your browser. Your PDF bytes are never transmitted to any server for these operations.',
  },
  {
    heading: 'AI features — text only, no raw file',
    body: 'When you use AI features (form autofill, summariser, OCR, translator), only the extracted text content is sent to our AI provider. Your raw PDF file stays on your device at all times.',
  },
  {
    heading: 'Account data',
    body: 'If you create a free account, we store your email address and usage count (to enforce the 5 AI uses/day free tier). We do not sell or share your personal data with third parties.',
  },
  {
    heading: 'No tracking across sessions',
    body: 'We do not use cross-site tracking cookies or fingerprinting. Basic analytics (page views, tool usage counts) are collected in aggregate only — no individual profiles are built.',
  },
]

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.editpdfai.com/#organization',
  name: 'EditPDF AI',
  url: 'https://www.editpdfai.com',
  logo: 'https://www.editpdfai.com/logo.png',
  foundingDate: '2026',
  areaServed: 'Worldwide',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@editpdfai.com',
    contactType: 'customer support',
    availableLanguage: 'English',
  },
  description: 'Independent PDF tool suite with 35+ browser-based tools and AI features. Built in Australia.',
}

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'var(--font-inter,system-ui,sans-serif)', color: '#1d1d1f', background: '#fff', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      {/* ── Nav ── */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 60, width: 'auto', display: 'block' }} priority />
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

      {/* ── Who we are ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 16 }}>Who we are</div>
        <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 24px', lineHeight: 1.2 }}>
          A small independent team, building in Australia
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Founded',   value: 'Early 2026' },
            { label: 'Based in',  value: 'Australia' },
            { label: 'Team size', value: 'Small, independent' },
            { label: 'Contact',   value: 'support@editpdfai.com' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#f5f5f7', borderRadius: 12, padding: '16px 18px', border: '1.5px solid #e5e7eb' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1d1d1f' }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 72px' }}>
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

      {/* ── Data handling ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 16 }}>Data &amp; privacy</div>
        <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 12px', lineHeight: 1.2 }}>
          How we handle your files
        </h2>
        <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.7, marginBottom: 36, marginTop: 0 }}>
          We have designed EditPDF AI so that the default behaviour is to process your PDF locally — on your own device. Here is exactly what happens in each case.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DATA_FACTS.map(({ heading, body }) => (
            <div key={heading} style={{ background: '#f5f5f7', borderRadius: 14, padding: '20px 22px', border: '1.5px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-.02em', color: '#1d1d1f' }}>{heading}</h3>
              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 13.5, fontWeight: 700, color: '#4F7FFA', textDecoration: 'none' }}>
            Read our Privacy Policy →
          </Link>
          <Link href="/terms" style={{ fontSize: 13.5, fontWeight: 700, color: '#4F7FFA', textDecoration: 'none' }}>
            Read our Terms of Service →
          </Link>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section style={{ background: '#1d1d1f', padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-.04em' }}>
          Have a question or idea?
        </h2>
        <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 10px', lineHeight: 1.6 }}>
          We read every email. Whether it&apos;s a bug, a feature request, or feedback — reach out.
        </p>
        <p style={{ fontSize: 14, color: '#4b5563', margin: '0 0 32px' }}>
          For security disclosures: <span style={{ color: '#6b7280' }}>support@editpdfai.com</span> (mark subject &ldquo;Security&rdquo;)
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="mailto:support@editpdfai.com"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            ✉ support@editpdfai.com
          </Link>
          <Link href="/pdf-editor"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.2)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
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
