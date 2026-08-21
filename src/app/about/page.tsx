import Link from 'next/link'
import Image from 'next/image'
import JsonLd from '@/components/JsonLd'
import { buildToolMetadata } from '@/lib/seo/metadata'
import { buildWebPageStructuredData } from '@/lib/seo/structuredData'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { AI_TOOL_COUNT, CORE_TOOL_COUNT, TOOL_COUNT } from '@/lib/toolMeta'
import {
  PUBLIC_OPERATOR_DISCLOSURE,
  SUPPORT_EMAIL,
  supportMailto,
} from '@/lib/entity'
import {
  AI_PROCESSING_SUMMARY,
  AI_ACCURACY_DISCLAIMER,
  BROWSER_PROCESSING_SUMMARY,
  CONVERSION_PROCESSING_SUMMARY,
  FREE_AI_DAILY_LIMIT,
  OCR_PROCESSING_SUMMARY,
  PROCESSING_PRIVACY_SUMMARY,
  PRODUCT_ACCESS_SUMMARY,
} from '@/lib/productMessaging'

export const metadata = buildToolMetadata(TOOL_METADATA['about'])

const VALUES = [
  {
    icon: '🔓',
    title: 'Free by default',
    body: PRODUCT_ACCESS_SUMMARY,
  },
  {
    icon: '🔒',
    title: 'Privacy first',
    body: PROCESSING_PRIVACY_SUMMARY,
  },
  {
    icon: '⚡',
    title: 'AI that actually helps',
    body: `AI features can suggest form values, summarize extracted text, translate documents, perform OCR, and generate learning materials. ${AI_ACCURACY_DISCLAIMER}`,
  },
  {
    icon: '🌍',
    title: 'Built for everyone',
    body: 'EditPDF AI is designed for modern desktop and mobile browsers. Available features and performance depend on browser support, document complexity, and device resources.',
  },
]

const STATS = [
  { value: `${TOOL_COUNT}`,      label: 'Active tools' },
  { value: `${CORE_TOOL_COUNT}`, label: 'Tools with core browser workflows' },
  { value: `${AI_TOOL_COUNT}`,   label: 'Tools with AI-assisted actions' },
  { value: `${FREE_AI_DAILY_LIMIT}/day`, label: 'Free-account AI actions (UTC)' },
]

const DATA_FACTS = [
  {
    heading: 'Browser-based PDF tools',
    body: BROWSER_PROCESSING_SUMMARY,
  },
  {
    heading: 'Conversion tools',
    body: CONVERSION_PROCESSING_SUMMARY,
  },
  {
    heading: 'OCR',
    body: OCR_PROCESSING_SUMMARY,
  },
  {
    heading: 'AI tools',
    body: AI_PROCESSING_SUMMARY,
  },
  {
    heading: 'Account data',
    body: 'Clerk manages account identity. Supabase stores subscription records and dated AI usage counts used to enforce the free daily allowance. The code does not store document content in those tables.',
  },
  {
    heading: 'Configured analytics',
    body: 'The site includes Vercel Speed Insights. PostHog is configured for cookieless events with person profiles and session recording disabled; Google Analytics is configured with analytics and advertising storage denied; and Cloudflare Web Analytics loads only when its token is configured.',
  },
]

// Organization JSON-LD for the whole site is rendered once by <SiteJsonLd />
// in the root layout (src/app/layout.tsx) — no page-level Organization block
// here, to avoid two Organization entities describing the same site.

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'var(--font-inter,system-ui,sans-serif)', color: '#1d1d1f', background: '#fff', minHeight: '100vh' }}>
      <JsonLd
        id="about-page-structured-data"
        data={buildWebPageStructuredData({
          path: '/about',
          name: 'About EditPDF AI',
          description: 'Learn about EditPDF AI, its browser-based PDF tools, account-based AI features and document-processing approach.',
          type: 'AboutPage',
        })}
      />
      {/* ── Nav ── */}
      <header>
      <nav aria-label="About page navigation" style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
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
      </header>

      <main id="main-content">

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
          Clear access for every PDF tool.<br />
          <span style={{ background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Core workflows and AI limits are labelled separately.
          </span>
        </h1>
        <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>
          {PRODUCT_ACCESS_SUMMARY}
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

      {/* ── Public operator information ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 16 }}>Operator information</div>
        <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 24px', lineHeight: 1.2 }}>
          What is publicly identified
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.75, margin: '0 0 24px' }}>
          {PUBLIC_OPERATOR_DISCLOSURE}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Public product name', value: 'EditPDF AI' },
            { label: 'Legal operator', value: 'Not currently published' },
            { label: 'Team location', value: 'Not currently published' },
            { label: 'Core workflows', value: 'No account required' },
            { label: 'Pro plan',  value: '$1/month' },
            { label: 'Support contact', value: SUPPORT_EMAIL },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#f5f5f7', borderRadius: 12, padding: '16px 18px', border: '1.5px solid #e5e7eb' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1d1d1f' }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product purpose ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 72px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 16 }}>Product purpose</div>
        <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 24px', lineHeight: 1.2 }}>
          Why EditPDF AI exists
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            'EditPDF AI brings common PDF editing, page management, signing, conversion, and AI-assisted workflows into one web product. It is intended to let people complete supported document tasks without installing a desktop application.',
            'The product separates browser-based workflows from features that need server-side or AI processing so users can make an informed choice before running a tool.',
            'Optional AI-assisted form filling, summarization, OCR, translation, mind maps, quizzes, chat, and document conversions require an account and server-side processing.',
            'Signed-in free accounts receive a daily AI-action allowance. Pro removes that daily allowance cap; the same tool-specific document and processing limits still apply.',
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
          Processing depends on the selected feature. The categories below describe the paths implemented by the current application.
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
        <p style={{ fontSize: 16, color: '#d1d5db', margin: '0 0 10px', lineHeight: 1.6 }}>
          Email is the published support channel for product questions, bug reports, feature requests, and feedback.
        </p>
        <p style={{ fontSize: 14, color: '#d1d5db', margin: '0 0 32px' }}>
          For security disclosures: <span style={{ color: '#fff' }}>{SUPPORT_EMAIL}</span> (mark the subject &ldquo;Security&rdquo;)
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href={supportMailto()}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            ✉ {SUPPORT_EMAIL}
          </Link>
          <Link href="/pdf-editor"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.2)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Try it free →
          </Link>
        </div>
      </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#1d1d1f', borderTop: '1px solid rgba(255,255,255,.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: '#d1d5db' }}>© {new Date().getFullYear()} EditPDF AI. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontSize: 12, color: '#fff', textDecoration: 'none', fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
