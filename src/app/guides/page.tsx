import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import guides from '@/lib/guidesData'

export const metadata: Metadata = {
  title: { absolute: 'PDF Guides & How-To Articles | EditPDF AI' },
  description: 'Practical PDF guides: how to edit, compress, sign, merge, redact, and make PDFs searchable — with step-by-step instructions and free tool links.',
  alternates: { canonical: 'https://www.editpdfai.com/guides' },
  openGraph: {
    title: 'PDF Guides & How-To Articles | EditPDF AI',
    description: 'Practical guides: edit, compress, sign, merge, redact and more — free tools included.',
    type: 'website',
    url: 'https://www.editpdfai.com/guides',
    siteName: 'EditPDF AI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PDF Guides by EditPDF AI' }],
  },
}

const ACCENT = '#4F7FFA'

export default function GuidesPage() {
  return (
    <div style={{ fontFamily: 'var(--font-dm,system-ui,sans-serif)', color: '#1d1d1f', background: '#fff', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} priority />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/pricing" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
          <Link href="/pdf-editor" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 99, background: '#1d1d1f' }}>
            Open Editor
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', background: 'rgba(79,127,250,.1)', color: ACCENT,
          border: '1px solid rgba(79,127,250,.25)', borderRadius: 100,
          fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
          padding: '5px 14px', marginBottom: 24, textTransform: 'uppercase',
        }}>
          Guides
        </span>
        <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1, margin: '0 0 18px' }}>
          PDF guides that actually help
        </h1>
        <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
          Step-by-step instructions for the most common PDF tasks — each one links directly to the free tool that does it.
        </p>
      </section>

      {/* Guide cards */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {guides.map(guide => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#f7f8fa', borderRadius: 16, padding: '24px 22px', border: '1.5px solid #e8eaed', transition: 'border-color .15s, box-shadow .15s' }}
              className="guide-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#9ca3af' }}>
                  {guide.readTime}
                </span>
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1d1d1f', margin: '0 0 10px', letterSpacing: '-.02em', lineHeight: 1.35 }}>
                {guide.title}
              </h2>
              <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65, margin: '0 0 18px', flex: 1 }}>
                {guide.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: ACCENT }}>
                Read guide <span style={{ fontSize: 15 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ background: '#1d1d1f', padding: '56px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, color: '#fff', margin: '0 0 12px', letterSpacing: '-.04em' }}>
          Ready to try it yourself?
        </h2>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 28px' }}>
          All tools are free. No account needed for core PDF tasks.
        </p>
        <Link href="/pdf-editor" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Open the free PDF editor →
        </Link>
      </section>

      <style>{`
        .guide-card:hover { border-color: ${ACCENT}; box-shadow: 0 4px 20px rgba(79,127,250,.12); }
      `}</style>
    </div>
  )
}
