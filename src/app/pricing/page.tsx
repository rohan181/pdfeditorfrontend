'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const FREE_FEATURES = [
  '1 AI use per day',
  'All 30+ PDF tools (unlimited)',
  'PDF edit, merge, split, compress',
  'E-signature & annotations',
  'PDF password protection',
]

const PRO_FEATURES = [
  'Unlimited AI uses — no daily resets',
  'AI form autofill & chat fill',
  'AI summarizer & translator',
  'PDF → Word, Excel, PowerPoint',
  'PDF Mind Map generator',
  'AI OCR & scan detection',
  'AI quiz creator',
  'All 30+ PDF tools (unlimited)',
  'Priority processing',
]

const COMPARISON = [
  ['Core PDF tools',          true,        true         ],
  ['AI uses per day',         '1',         'Unlimited'  ],
  ['AI form autofill',        false,       true         ],
  ['AI summarizer',           false,       true         ],
  ['AI translator',           false,       true         ],
  ['PDF Mind Map',            false,       true         ],
  ['PDF → Word / Excel / PPT',false,       true         ],
  ['AI OCR',                  false,       true         ],
  ['AI quiz creator',         false,       true         ],
  ['Priority processing',     false,       true         ],
]

const FAQS = [
  { q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account settings at any time — your Pro access continues until the end of the billing period, then reverts to Free.' },
  { q: 'What counts as an AI use?',
    a: 'Each AI action (autofill, summarize, translate, mind map, OCR, quiz, etc.) counts as one use. Non-AI PDF tools (merge, split, compress, sign) are always unlimited and never counted.' },
  { q: 'Is there a free trial?',
    a: 'Every account starts with 1 free AI use per day. There\'s no time-limited trial — use the free tier as long as you like before upgrading.' },
  { q: 'What payment methods are accepted?',
    a: 'All major credit/debit cards via Stripe. Your payment information is never stored on our servers.' },
]

export default function PricingPage() {
  const [annual, setAnnual]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const router   = useRouter()
  const { isSignedIn } = useUser()

  const monthly        = 12
  const annualMonthly  = Math.round(monthly * 0.75) // $9

  async function handleUpgrade() {
    if (!isSignedIn) { router.push('/sign-up'); return }
    setLoading(true)
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? ''
      const res  = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const displayPrice = annual ? annualMonthly : monthly

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'var(--font-dm,system-ui,sans-serif)' }}>

      {/* ── Nav ── */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#1d1d1f', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/>
              <polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/>
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.04em' }}>
            Edit<span style={{ color: '#0891b2' }}>PDF</span> AI
          </span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
          ← Dashboard
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '48px 24px 40px' }}>
        <span style={{
          display: 'inline-block', background: 'rgba(8,145,178,.1)', color: '#0891b2',
          border: '1px solid rgba(8,145,178,.25)', borderRadius: 100,
          fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
          padding: '5px 14px', marginBottom: 20, textTransform: 'uppercase',
        }}>Simple pricing</span>

        <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#1d1d1f', margin: '0 0 14px', letterSpacing: '-.04em', lineHeight: 1.1 }}>
          One plan. Everything included.
        </h1>
        <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.6 }}>
          All PDF tools are free forever.<br/>Upgrade Pro for unlimited AI.
        </p>

        {/* Toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: '#e5e7eb', borderRadius: 100, padding: 4 }}>
          {['Monthly', 'Annual'].map((label, i) => {
            const active = i === (annual ? 1 : 0)
            return (
              <button key={label} onClick={() => setAnnual(i === 1)} style={{
                padding: '7px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all .2s',
                background: active ? '#1d1d1f' : 'transparent',
                color: active ? '#fff' : '#6b7280',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {label}
                {i === 1 && (
                  <span style={{ background: '#0891b2', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 800, padding: '2px 7px' }}>
                    -25%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>

        {/* Free card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,.05)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 10px' }}>Free</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
            <span style={{ fontSize: 46, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.04em', lineHeight: 1 }}>$0</span>
            <span style={{ fontSize: 14, color: '#9ca3af', paddingBottom: 6 }}>/forever</span>
          </div>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>For occasional PDF work</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {FREE_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, color: '#374151' }}>
                <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
              </li>
            ))}
          </ul>

          <Link href="/sign-up" style={{
            display: 'block', textAlign: 'center', padding: '13px 0', borderRadius: 12,
            border: '1.5px solid #d1d5db', color: '#374151', fontSize: 14,
            fontWeight: 700, textDecoration: 'none',
          }}>
            Get started free
          </Link>
        </div>

        {/* Pro card */}
        <div style={{ background: '#1d1d1f', borderRadius: 24, padding: '32px 28px', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.24)' }}>
          {/* glow blob */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(8,145,178,.35),transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <span style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 800, padding: '4px 10px', letterSpacing: '.05em' }}>
              MOST POPULAR
            </span>
          </div>

          <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 10px' }}>Pro</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 46, fontWeight: 800, color: '#fff', letterSpacing: '-.04em', lineHeight: 1 }}>
              ${displayPrice}
            </span>
            <span style={{ fontSize: 14, color: '#6b7280', paddingBottom: 6 }}>/month</span>
          </div>
          {annual && (
            <p style={{ fontSize: 13, color: '#0891b2', fontWeight: 600, margin: '2px 0 4px' }}>
              Billed ${annualMonthly * 12}/year — save ${(monthly - annualMonthly) * 12}
            </p>
          )}
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 24px' }}>Unlimited AI for power users</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {PRO_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, color: '#e5e7eb' }}>
                <span style={{ color: '#0891b2', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg,#0891b2,#0e7490)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1,
            }}
          >
            {loading ? 'Redirecting to Stripe…' : isSignedIn ? 'Upgrade to Pro' : 'Get started'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#4b5563', marginTop: 12, margin: '12px 0 0' }}>
            No contracts · Cancel anytime · Secured by Stripe
          </p>
        </div>
      </div>

      {/* ── Feature comparison ── */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1d1d1f', textAlign: 'center', marginBottom: 28, letterSpacing: '-.03em' }}>
          What's included
        </h2>
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
          {/* header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px', padding: '12px 24px', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            {['Feature','Free','Pro'].map((h, i) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', textAlign: i > 0 ? 'center' : 'left', color: i === 2 ? '#0891b2' : '#9ca3af' }}>{h}</span>
            ))}
          </div>
          {COMPARISON.map(([label, free, pro], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px', padding: '13px 24px', borderBottom: i < COMPARISON.length - 1 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{label as string}</span>
              <span style={{ textAlign: 'center', fontSize: 13 }}>
                {free === true  ? <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                 : free === false ? <span style={{ color: '#d1d5db' }}>—</span>
                 : <span style={{ color: '#6b7280', fontWeight: 600 }}>{free as string}</span>}
              </span>
              <span style={{ textAlign: 'center', fontSize: 13 }}>
                {pro === true ? <span style={{ color: '#0891b2', fontWeight: 700 }}>✓</span>
                 : <span style={{ color: '#0891b2', fontWeight: 700 }}>{pro as string}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1d1d1f', textAlign: 'center', marginBottom: 28, letterSpacing: '-.03em' }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#1d1d1f', textAlign: 'left', gap: 12 }}
              >
                {faq.q}
                <span style={{ color: '#9ca3af', fontSize: 20, flexShrink: 0, display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform .18s' }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ padding: '0 20px 16px', fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ background: '#1d1d1f', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: '0 0 12px', letterSpacing: '-.04em' }}>
          Ready to go unlimited?
        </h2>
        <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 28px' }}>
          Join users who use EditPDF AI every day.
        </p>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            padding: '14px 36px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#0891b2,#0e7490)',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {loading ? 'Redirecting…' : `Upgrade to Pro — $${displayPrice}/mo`}
        </button>
        <p style={{ fontSize: 13, color: '#4b5563', marginTop: 14 }}>
          No contracts · Cancel anytime · Secured by Stripe
        </p>
      </div>

    </div>
  )
}
