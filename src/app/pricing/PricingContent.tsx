'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

const FREE_FEATURES = [
  '5 AI uses per day',
  'All 35+ PDF tools (unlimited)',
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
  'All 35+ PDF tools (unlimited)',
  'Priority processing',
]

const COMPARISON_GROUPS = [
  {
    group: 'Core PDF Tools',
    note: 'Always free — no limits',
    rows: [
      ['PDF editor & annotator',  true,    true   ],
      ['Merge & split PDFs',      true,    true   ],
      ['Compress PDFs',           true,    true   ],
      ['E-signature',             true,    true   ],
      ['PDF password lock',       true,    true   ],
    ],
  },
  {
    group: 'AI Tools',
    note: 'Free plan: 5 uses/day · Pro: unlimited',
    rows: [
      ['AI form autofill',        '5/day', '∞ Unlimited'],
      ['AI summarizer',           '5/day', '∞ Unlimited'],
      ['AI translator',           '5/day', '∞ Unlimited'],
      ['AI OCR scanner',          '5/day', '∞ Unlimited'],
      ['PDF mind map',            '5/day', '∞ Unlimited'],
      ['AI quiz creator',         '5/day', '∞ Unlimited'],
    ],
  },
  {
    group: 'Limits & Extras',
    note: '',
    rows: [
      ['AI uses per day',         '5',     'Unlimited'  ],
      ['PDF → Word / Excel / PPT',false,   true         ],
      ['Priority processing',     false,   true         ],
    ],
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account settings at any time — your Pro access continues until the end of the billing period, then reverts to Free.' },
  { q: 'What counts as an AI use?',
    a: 'One AI use means one AI-powered action, such as AI form fill, PDF summary, translation, OCR scan, mind map, or quiz generation. Non-AI PDF tools (merge, split, compress, sign) are always unlimited and never counted.' },
  { q: 'Do I need an account to use the free tools?',
    a: 'Core PDF tools (edit, merge, split, compress, sign, annotate, protect) require no account. AI tools (form autofill, summariser, translator, OCR, mind map, quiz creator) require a free account, which gives you 5 AI uses per day with no credit card needed.' },
  { q: 'What payment methods are accepted?',
    a: 'All major credit/debit cards via Stripe. Your payment information is never stored on our servers.' },
]

export default function PricingContent() {
  const [annual, setAnnual]   = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(1)
  const router   = useRouter()
  const { isSignedIn } = useUser()

  const monthly        = 1.00
  const annualMonthly  = 0.75 // ~25% off

  function handleUpgrade() {
    if (!isSignedIn) { router.push('/sign-up'); return }
    router.push('/checkout')
  }

  const displayPrice = annual ? annualMonthly : monthly

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'var(--font-dm,system-ui,sans-serif)' }}>

      {/* ── Nav ── */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} priority />
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
        <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Free includes all core PDF tools and 5 AI uses per day. Pro unlocks unlimited AI tools.
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

          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 800, padding: '4px 10px', letterSpacing: '.05em' }}>
              MOST POPULAR
            </span>
            <span style={{ background: 'rgba(251,191,36,.15)', color: '#f59e0b', border: '1px solid rgba(251,191,36,.3)', borderRadius: 100, fontSize: 10, fontWeight: 700, padding: '3px 9px', letterSpacing: '.04em' }}>
              🎉 Launch price
            </span>
          </div>

          <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 10px' }}>Pro</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 46, fontWeight: 800, color: '#fff', letterSpacing: '-.04em', lineHeight: 1 }}>
              ${displayPrice.toFixed(2)}
            </span>
            <span style={{ fontSize: 14, color: '#6b7280', paddingBottom: 6 }}>/month</span>
          </div>
          {annual && (
            <p style={{ fontSize: 13, color: '#0891b2', fontWeight: 600, margin: '2px 0 4px' }}>
              Billed ${(annualMonthly * 12).toFixed(2)}/year — save ${((monthly - annualMonthly) * 12).toFixed(2)}
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
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg,#0891b2,#0e7490)',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {isSignedIn ? 'Upgrade to Pro' : 'Get started'}
          </button>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '✓', text: 'Cancel anytime — no questions asked' },
              { icon: '🔒', text: 'Secure checkout by Stripe. No hidden fees.' },
              { icon: '✓', text: '7-day refund if you\'re not satisfied' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#0891b2', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.3)', borderRadius: 10 }}>
            <p style={{ fontSize: 11.5, color: '#92400e', margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: '#78350f' }}>Limited-time launch price.</strong> Early subscribers lock in $1/month for as long as their subscription stays active. Price will increase for new subscribers in the future.
            </p>
          </div>
        </div>
      </div>

      {/* ── Feature comparison ── */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1d1d1f', textAlign: 'center', marginBottom: 8, letterSpacing: '-.03em' }}>
          What&apos;s included
        </h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#9ca3af', marginBottom: 28 }}>
          Free vs Pro — at a glance
        </p>
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
          {/* Column header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px', padding: '12px 24px', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#9ca3af' }}>Feature</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center', color: '#9ca3af' }}>Free</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center', color: '#0891b2' }}>Pro ✦</span>
          </div>

          {COMPARISON_GROUPS.map(({ group, note, rows }) => (
            <div key={group}>
              {/* Group header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px', padding: '10px 24px', background: '#f0f9ff', borderTop: '1px solid #e0f2fe', borderBottom: '1px solid #e0f2fe' }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#0891b2', textTransform: 'uppercase', letterSpacing: '.06em' }}>{group}</span>
                  {note && <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8, fontWeight: 500 }}>{note}</span>}
                </div>
                <span />
                <span />
              </div>

              {/* Feature rows */}
              {rows.map(([label, free, pro], i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 110px 130px',
                  padding: '12px 24px',
                  borderBottom: i < rows.length - 1 ? '1px solid #f3f4f6' : 'none',
                  alignItems: 'center',
                  background: '#fff',
                }}>
                  <span style={{ fontSize: 13.5, color: '#374151', fontWeight: 500 }}>{label as string}</span>

                  {/* Free cell */}
                  <span style={{ textAlign: 'center', fontSize: 13 }}>
                    {free === true  ? <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                     : free === false ? <span style={{ color: '#d1d5db', fontSize: 16 }}>—</span>
                     : <span style={{ color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{free as string}</span>}
                  </span>

                  {/* Pro cell — highlighted */}
                  <span style={{
                    textAlign: 'center', fontSize: 13,
                    background: 'rgba(8,145,178,.04)',
                    margin: '0 -24px', padding: '0 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {pro === true
                      ? <span style={{ color: '#0891b2', fontWeight: 800, fontSize: 15 }}>✓</span>
                      : <span style={{ color: '#0891b2', fontWeight: 700, fontSize: 12 }}>{pro as string}</span>}
                  </span>
                </div>
              ))}
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
          style={{
            padding: '14px 36px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#0891b2,#0e7490)',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {`Upgrade to Pro — $${displayPrice.toFixed(2)}/mo`}
        </button>
        <p style={{ fontSize: 13, color: '#4b5563', marginTop: 14 }}>
          No contracts · Cancel anytime · Secured by Stripe
        </p>
      </div>

    </div>
  )
}
