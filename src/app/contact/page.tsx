'use client'

import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

const FI = 'var(--font-dm,system-ui,sans-serif)'
const MONO = 'var(--font-mono,monospace)'

const TOPICS = [
  { icon: '💳', title: 'Billing & subscription', body: 'Charges, cancellations, refunds, or plan questions.', subject: 'Billing question' },
  { icon: '🔧', title: 'Tool or technical issue', body: 'A PDF tool isn\'t working, conversion failed, or you found a bug.', subject: 'Technical issue' },
  { icon: '🔒', title: 'Privacy & data request', body: 'Request deletion of your data or ask about how we handle your files.', subject: 'Privacy/data request' },
  { icon: '💬', title: 'General question', body: 'Anything else — feature ideas, feedback, or partnership enquiries.', subject: 'General question' },
]

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <SiteNav />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '100px 28px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af' }}>
            Contact
          </span>
          <h1 style={{ fontFamily: FI, fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.04em', margin: '10px 0 16px', lineHeight: 1.05 }}>
            Get in touch
          </h1>
          <p style={{ fontFamily: FI, fontSize: 16, color: '#6b7280', lineHeight: 1.65, maxWidth: 480, margin: 0 }}>
            We read every message and respond within <strong style={{ color: '#1d1d1f' }}>24–48 hours</strong>. Choose the right topic to help us reply faster.
          </p>
        </div>

        {/* Main contact card */}
        <div style={{ background: '#f5f5f7', borderRadius: 24, padding: '28px 32px', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 8px' }}>
              Email us directly
            </p>
            <a href="mailto:support@editpdfai.com"
              style={{ fontFamily: FI, fontSize: 22, fontWeight: 800, color: '#0891b2', textDecoration: 'none', letterSpacing: '-0.03em', display: 'block', marginBottom: 6 }}>
              support@editpdfai.com
            </a>
            <p style={{ fontFamily: FI, fontSize: 13, color: '#6b7280', margin: 0 }}>
              Response time: usually within 24–48 hours · Monday – Friday
            </p>
          </div>
          <a href="mailto:support@editpdfai.com"
            style={{ fontFamily: FI, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 22px', background: '#1d1d1f', color: '#fff', borderRadius: 99, fontSize: 14, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Send email →
          </a>
        </div>

        {/* Topic cards */}
        <h2 style={{ fontFamily: FI, fontSize: 18, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.03em', margin: '0 0 18px' }}>
          What can we help with?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12, marginBottom: 48 }}>
          {TOPICS.map(({ icon, title, body, subject }) => (
            <a key={title}
              href={`mailto:support@editpdfai.com?subject=${encodeURIComponent(subject)}`}
              style={{ textDecoration: 'none' }}>
              <div style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '18px 20px', cursor: 'pointer', transition: 'border-color .12s, background .12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#0891b2'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(8,145,178,.03)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLDivElement).style.background = '#f9fafb' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
                <p style={{ fontFamily: FI, fontSize: 14, fontWeight: 700, color: '#1d1d1f', margin: '0 0 5px', letterSpacing: '-0.01em' }}>{title}</p>
                <p style={{ fontFamily: FI, fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.55 }}>{body}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Links */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 28, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <p style={{ fontFamily: FI, fontSize: 14, color: '#9ca3af', margin: 0, flex: 1 }}>
            Looking for answers right now?
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[['Support FAQ', '/support'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([l, h]) => (
              <Link key={l} href={h}
                style={{ fontFamily: FI, fontSize: 14, fontWeight: 600, color: '#0891b2', textDecoration: 'none' }}>
                {l}
              </Link>
            ))}
          </div>
        </div>

      </main>

      <SiteFooter />
    </div>
  )
}
