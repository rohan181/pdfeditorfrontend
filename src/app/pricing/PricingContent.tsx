'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import SiteFooter from '@/components/SiteFooter'
import { AI_TOOL_COUNT, CORE_TOOL_COUNT } from '@/lib/toolMeta'
import {
  FREE_AI_DAILY_LIMIT,
  PRODUCT_ACCESS_SUMMARY,
} from '@/lib/productMessaging'
import { PRICING_FAQS } from '@/lib/pricingData'

const FREE_FEATURES = [
  `${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day`,
  `${CORE_TOOL_COUNT} tools with core browser workflows`,
  'PDF edit, merge, split, compress',
  'E-signature & annotations',
  'PDF password protection',
]

const PRO_FEATURES = [
  'No daily AI-action cap',
  'AI form autofill & chat fill',
  'AI summarizer & translator',
  'PDF → Word, Excel, PowerPoint AI conversions',
  'PDF Mind Map generator',
  'AI OCR & scan detection',
  'AI quiz creator',
  'No tool is currently restricted to Pro; Pro changes the daily AI allowance',
  'Tool-specific input and processing limits still apply',
]

const COMPARISON_GROUPS = [
  {
    group: 'Core PDF Tools',
    note: 'No account required; browser and tool limits apply',
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
    note: `Free: ${FREE_AI_DAILY_LIMIT}/day · Pro: no daily cap`,
    rows: [
      ['AI form autofill',        `${FREE_AI_DAILY_LIMIT}/day`, 'No daily cap'],
      ['AI summarizer',           `${FREE_AI_DAILY_LIMIT}/day`, 'No daily cap'],
      ['AI translator',           `${FREE_AI_DAILY_LIMIT}/day`, 'No daily cap'],
      ['AI OCR scanner',          `${FREE_AI_DAILY_LIMIT}/day`, 'No daily cap'],
      ['PDF mind map',            `${FREE_AI_DAILY_LIMIT}/day`, 'No daily cap'],
      ['AI quiz creator',         `${FREE_AI_DAILY_LIMIT}/day`, 'No daily cap'],
      ['PDF → Word / Excel / PPT',`${FREE_AI_DAILY_LIMIT}/day`, 'No daily cap'],
    ],
  },
  {
    group: 'Limits & Extras',
    note: '',
    rows: [
      ['AI actions per UTC day',  `${FREE_AI_DAILY_LIMIT}`, 'No daily cap'],
      ['Per-tool input limits',   true,    true          ],
    ],
  },
]

export default function PricingContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(1)
  const router   = useRouter()
  const { isSignedIn } = useUser()

  const monthlyPrice = 1.00

  function handleUpgrade() {
    if (!isSignedIn) { router.push('/sign-up'); return }
    router.push('/checkout')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'var(--font-dm,system-ui,sans-serif)' }}>
      <main id="main-content">

      {/* ── Nav ── */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} priority />
        </Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: '#5b6472', textDecoration: 'none', fontWeight: 500 }}>
          ← Dashboard
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '48px 24px 40px' }}>
        <span style={{
          display: 'inline-block', background: 'rgba(8,145,178,.1)', color: '#155e75',
          border: '1px solid rgba(8,145,178,.25)', borderRadius: 100,
          fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
          padding: '5px 14px', marginBottom: 20, textTransform: 'uppercase',
        }}>Simple pricing</span>

        <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#1d1d1f', margin: '0 0 14px', letterSpacing: '-.04em', lineHeight: 1.1 }}>
          Free and Pro access, clearly separated.
        </h1>
        <p style={{ fontSize: 17, color: '#5b6472', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
          {PRODUCT_ACCESS_SUMMARY}
        </p>

        <p style={{ display: 'inline-flex', alignItems: 'center', background: '#e5e7eb', borderRadius: 100, padding: '8px 18px', margin: 0, fontSize: 13, fontWeight: 700, color: '#374151' }}>
          Monthly billing
        </p>
      </div>

      {/* ── Cards ── */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>

        {/* Free card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,.05)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6a6f77', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 10px' }}>Free</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
            <span style={{ fontSize: 46, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.04em', lineHeight: 1 }}>$0</span>
            <span style={{ fontSize: 14, color: '#6a6f77', paddingBottom: 6 }}>/month</span>
          </div>
          <p style={{ fontSize: 14, color: '#5b6472', margin: '0 0 24px' }}>For occasional PDF work</p>

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
            <span style={{ background: 'linear-gradient(135deg,#0e7490,#0e7490)', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 800, padding: '4px 10px', letterSpacing: '.05em' }}>
              PRO PLAN
            </span>
            <span style={{ background: 'rgba(251,191,36,.15)', color: '#f59e0b', border: '1px solid rgba(251,191,36,.3)', borderRadius: 100, fontSize: 10, fontWeight: 700, padding: '3px 9px', letterSpacing: '.04em' }}>
              Monthly billing
            </span>
          </div>

          <p style={{ fontSize: 12, fontWeight: 700, color: '#818892', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 10px' }}>Pro</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 46, fontWeight: 800, color: '#fff', letterSpacing: '-.04em', lineHeight: 1 }}>
              ${monthlyPrice.toFixed(2)}
            </span>
            <span style={{ fontSize: 14, color: '#818892', paddingBottom: 6 }}>/month</span>
          </div>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 24px' }}>No daily cap across {AI_TOOL_COUNT} AI-assisted tools; per-tool limits remain</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {PRO_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, color: '#e5e7eb' }}>
                <span style={{ color: '#0e7490', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg,#0e7490,#0e7490)',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {isSignedIn ? 'Upgrade to Pro' : 'Get started'}
          </button>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '✓', text: 'Cancel from account settings; access continues through the billing period' },
              { icon: '•', text: 'Card fields are handled by Stripe Payment Element' },
              { icon: '•', text: 'Refund eligibility follows the published Terms of Service' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#0e7490', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 12, color: '#818892', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature comparison ── */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1d1d1f', textAlign: 'center', marginBottom: 8, letterSpacing: '-.03em' }}>
          What&apos;s included
        </h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#6a6f77', marginBottom: 28 }}>
          Free vs Pro — at a glance
        </p>
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
          {/* Column header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px', padding: '12px 24px', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6a6f77' }}>Feature</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center', color: '#6a6f77' }}>Free</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center', color: '#0e7490' }}>Pro ✦</span>
          </div>

          {COMPARISON_GROUPS.map(({ group, note, rows }) => (
            <div key={group}>
              {/* Group header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px', padding: '10px 24px', background: '#f0f9ff', borderTop: '1px solid #e0f2fe', borderBottom: '1px solid #e0f2fe' }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#0e7490', textTransform: 'uppercase', letterSpacing: '.06em' }}>{group}</span>
                  {note && <span style={{ fontSize: 11, color: '#66707f', marginLeft: 8, fontWeight: 500 }}>{note}</span>}
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
                     : <span style={{ color: '#5b6472', fontWeight: 600, fontSize: 12 }}>{free as string}</span>}
                  </span>

                  {/* Pro cell — highlighted */}
                  <span style={{
                    textAlign: 'center', fontSize: 13,
                    background: 'rgba(8,145,178,.04)',
                    margin: '0 -24px', padding: '0 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {pro === true
                      ? <span style={{ color: '#0e7490', fontWeight: 800, fontSize: 15 }}>✓</span>
                      : <span style={{ color: '#0e7490', fontWeight: 700, fontSize: 12 }}>{pro as string}</span>}
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
          {PRICING_FAQS.map((faq, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#1d1d1f', textAlign: 'left', gap: 12 }}
              >
                {faq.q}
                <span style={{ color: '#6a6f77', fontSize: 20, flexShrink: 0, display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform .18s' }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ padding: '0 20px 16px', fontSize: 14, color: '#5b6472', lineHeight: 1.7, margin: 0 }}>
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
          Need more than the daily AI allowance?
        </h2>
        <p style={{ fontSize: 16, color: '#818892', margin: '0 0 28px' }}>
          Pro removes the Free plan&apos;s daily AI-action cap. Tool-specific limits still apply.
        </p>
        <button
          onClick={handleUpgrade}
          style={{
            padding: '14px 36px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#0e7490,#0e7490)',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {`Upgrade to Pro — $${monthlyPrice.toFixed(2)}/mo`}
        </button>
        <p style={{ fontSize: 13, color: '#818892', marginTop: 14 }}>
          Monthly billing · Cancel from account settings · Payment fields provided by Stripe
        </p>
      </div>

      </main>
      <SiteFooter />

    </div>
  )
}
