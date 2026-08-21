'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Check, Info, Sparkles } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import PublicPageHeader from '@/components/PublicPageHeader'
import { Button, ButtonLink, Card, Container, Eyebrow, Heading, Text } from '@/components/ui'
import { AI_TOOL_COUNT, CORE_TOOL_COUNT } from '@/lib/toolMeta'
import { FREE_AI_DAILY_LIMIT } from '@/lib/productMessaging'
import {
  AI_CONVERSION_ACCESS_SUMMARY,
  AI_USE_DEFINITION,
  PRO_AUTH_REQUIREMENT,
  PRO_BILLING_SUMMARY,
  PRO_CANCELLATION_SUMMARY,
  PRO_PRICE_DISPLAY,
  PRO_REFUND_SUMMARY,
} from '@/lib/pricing'
import { PRICING_FAQS } from '@/lib/pricingData'

type AccountPlan = 'loading' | 'signed-out' | 'free' | 'pro' | 'error'

const FREE_FEATURES = [
  `${CORE_TOOL_COUNT} tools with browser-based core workflows`,
  'Edit, annotate, merge, split, compress, sign, protect, and organize PDFs',
  'No account required for core workflows',
  `A signed-in Free account includes ${FREE_AI_DAILY_LIMIT} AI actions per UTC day`,
  'No credit card required',
]

const PRO_FEATURES = [
  'Everything available on Free',
  `No daily AI-action cap across ${AI_TOOL_COUNT} AI-assisted tools`,
  'AI form filling, summaries, translation, OCR, mind maps, quizzes, and chat',
  'AI-assisted PDF to Word, Excel, and PowerPoint conversions',
  'The same documented input and processing limits still apply',
]

const COMPARISON_GROUPS = [
  {
    group: 'Core PDF workflows',
    note: 'No account required',
    rows: [
      ['Edit and annotate PDFs', 'Included', 'Included'],
      ['Merge, split, and organize pages', 'Included', 'Included'],
      ['Compress PDFs', 'Included', 'Included'],
      ['Sign, watermark, and password-protect', 'Included', 'Included'],
      ['Browser-only conversions', 'Included', 'Included'],
    ],
  },
  {
    group: 'AI-assisted actions',
    note: 'An account is required',
    rows: [
      ['Shared daily allowance', `${FREE_AI_DAILY_LIMIT} per UTC day`, 'No daily cap'],
      ['Form fill, summary, translation, chat', 'Uses allowance', 'No daily cap'],
      ['OCR', 'Each page sent uses one action', 'No daily cap'],
      ['PDF to Word, Excel, or PowerPoint', 'Uses allowance', 'No daily cap'],
      ['Mind maps and quizzes', 'Uses allowance', 'No daily cap'],
    ],
  },
  {
    group: 'Billing and limits',
    note: 'Pro changes the daily allowance, not tool limits',
    rows: [
      ['Price', 'US$0', `${PRO_PRICE_DISPLAY}/month`],
      ['Recurring billing', 'None', 'Monthly in USD'],
      ['Tool-specific input limits', 'Apply', 'Apply'],
      ['Cancel from account settings', 'Not applicable', 'Any time'],
    ],
  },
] as const

function FeatureList({ items, pro = false }: { items: readonly string[]; pro?: boolean }) {
  return (
    <ul className="pricing-feature-list">
      {items.map(item => (
        <li key={item}>
          <Check size={17} aria-hidden="true" className={pro ? 'is-pro' : ''} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PricingContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(1)
  // Signed-out is the safe server-rendered default: it can only lead to account
  // creation, never checkout. Signed-in users move through the verified loading
  // state before any subscription action becomes available.
  const [accountPlan, setAccountPlan] = useState<AccountPlan>('signed-out')
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null)
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setAccountPlan('signed-out')
      return
    }

    const controller = new AbortController()
    setAccountPlan('loading')
    fetch('/api/subscription/status', { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
      .then(data => setAccountPlan(data?.tier === 'pro' ? 'pro' : 'free'))
      .catch(error => {
        if (error?.name !== 'AbortError') setAccountPlan('error')
      })
    return () => controller.abort()
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    const state = new URLSearchParams(window.location.search).get('checkout')
    if (state === 'cancelled') {
      setCheckoutNotice('Checkout was cancelled. No subscription was created and no plan changes were made.')
    } else if (state === 'payment-failed') {
      setCheckoutNotice('The payment could not be completed. No Pro access was added. Review your payment details and try again when ready.')
    }
  }, [])

  function handleProAction() {
    if (accountPlan === 'pro') router.push('/manage-subscription')
    else if (accountPlan === 'free') router.push('/checkout')
    else if (accountPlan === 'signed-out') router.push('/sign-up')
  }

  const proActionLabel = accountPlan === 'pro'
    ? 'Manage Pro subscription'
    : accountPlan === 'free'
      ? `Upgrade to Pro — ${PRO_PRICE_DISPLAY}/month`
      : accountPlan === 'signed-out'
        ? 'Create an account to subscribe'
        : accountPlan === 'error'
          ? 'Account status unavailable'
          : 'Checking your plan…'

  return (
    <div className="pricing-page">
      <PublicPageHeader />
      <main id="main-content">
        <section className="pricing-hero">
          <Container size="reading">
            <Eyebrow>Simple pricing</Eyebrow>
            <Heading as="h1">Free PDF tools. Pro removes the daily AI cap.</Heading>
            <Text size="large">
              Core PDF workflows are free without an account. Sign in for {FREE_AI_DAILY_LIMIT} AI actions per UTC day, or choose Pro for no daily AI-action cap.
            </Text>
            <p className="pricing-billing-label">{PRO_BILLING_SUMMARY}</p>
          </Container>
        </section>

        {checkoutNotice && (
          <Container size="narrow">
            <div className="pricing-status-notice" role="status">
              <Info size={19} aria-hidden="true" />
              <div><strong>Checkout not completed</strong><span>{checkoutNotice}</span></div>
              <button type="button" onClick={() => setCheckoutNotice(null)} aria-label="Dismiss checkout notice">×</button>
            </div>
          </Container>
        )}

        <Container size="narrow" className="pricing-plan-grid">
          <Card variant="pricing" className="pricing-plan-card" role="article" aria-labelledby="free-plan-heading">
            <div className="pricing-plan-card-head">
              <div><p className="pricing-plan-kicker">Free</p><h2 id="free-plan-heading">Free</h2></div>
              {accountPlan === 'free' && <span className="pricing-current-plan">Current plan</span>}
            </div>
            <div className="pricing-plan-price"><strong>US$0</strong><span>No billing</span></div>
            <p className="pricing-plan-summary">For core PDF work and occasional AI-assisted tasks.</p>
            <FeatureList items={FREE_FEATURES} />
            <div className="pricing-plan-action">
              <ButtonLink href="/pdf-editor" variant="secondary" size="large" fullWidth>Use a Free PDF tool</ButtonLink>
              <p>No sign-up required for core workflows.</p>
            </div>
          </Card>

          <Card variant="pro" className="pricing-plan-card pricing-pro-card" role="article" aria-labelledby="pro-plan-heading">
            <div className="pricing-plan-card-head">
              <div><p className="pricing-plan-kicker is-pro">Pro</p><h2 id="pro-plan-heading">Pro</h2></div>
              {accountPlan === 'pro'
                ? <span className="pricing-current-plan is-pro">Current plan</span>
                : <span className="pricing-pro-badge">PRO PLAN</span>}
            </div>
            <div className="pricing-plan-price"><strong>{PRO_PRICE_DISPLAY}</strong><span>per month</span></div>
            <p className="pricing-plan-summary">Recurring monthly billing in USD. Pro changes the daily AI allowance, not the tool limits.</p>
            <FeatureList items={PRO_FEATURES} pro />
            <div className="pricing-plan-action">
              <Button onClick={handleProAction} variant="pro" size="large" fullWidth disabled={accountPlan === 'loading' || accountPlan === 'error'} aria-describedby="pro-auth-requirement">
                {proActionLabel}
              </Button>
              <p id="pro-auth-requirement">{accountPlan === 'pro' ? 'You already have Pro. Checkout is disabled for this account.' : PRO_AUTH_REQUIREMENT}</p>
            </div>
          </Card>
        </Container>

        <Container size="narrow" className="pricing-explainer-section">
          <Heading as="h2" className="pricing-section-heading">Know exactly what you are choosing</Heading>
          <div className="pricing-explainer-grid">
            <Card variant="info">
              <span className="pricing-explainer-icon"><Check size={18} aria-hidden="true" /></span>
              <h3>What is free?</h3>
              <p>{CORE_TOOL_COUNT} tools include core browser workflows that need no account. A signed-in Free account also receives {FREE_AI_DAILY_LIMIT} shared AI actions per UTC day.</p>
            </Card>
            <Card variant="info">
              <span className="pricing-explainer-icon"><Sparkles size={18} aria-hidden="true" /></span>
              <h3>What is one AI use?</h3>
              <p>{AI_USE_DEFINITION}</p>
            </Card>
            <Card variant="info">
              <span className="pricing-explainer-icon"><Info size={18} aria-hidden="true" /></span>
              <h3>Do conversions require Pro?</h3>
              <p>{AI_CONVERSION_ACCESS_SUMMARY}</p>
            </Card>
          </div>
        </Container>

        <Container size="narrow" className="pricing-comparison-section">
          <Heading as="h2" className="pricing-section-heading">Free and Pro compared</Heading>
          <Text size="small" className="pricing-section-copy">Both plans use the same tools. Pro removes the shared daily AI-action cap.</Text>
          <Card className="pricing-comparison-card" role="table" aria-label="Free and Pro plan comparison">
            <div className="pricing-full-header" role="row">
              <span role="columnheader">Feature</span><span role="columnheader">Free</span><span role="columnheader">Pro</span>
            </div>
            {COMPARISON_GROUPS.map(({ group, note, rows }) => (
              <div key={group} role="rowgroup">
                <div className="pricing-full-group"><div><span>{group}</span><small>{note}</small></div></div>
                {rows.map(([label, free, pro]) => (
                  <div className="pricing-full-row" key={label} role="row">
                    <span className="pricing-full-label" role="rowheader">{label}</span>
                    <span className="pricing-full-value" data-plan="Free" role="cell">{free}</span>
                    <span className="pricing-full-value pricing-full-pro" data-plan="Pro" role="cell">{pro}</span>
                  </div>
                ))}
              </div>
            ))}
          </Card>
        </Container>

        <Container size="narrow" className="pricing-billing-section">
          <Card variant="info" className="pricing-billing-card">
            <div><Eyebrow>Billing, cancellation, and refunds</Eyebrow><Heading as="h2">Billing rules in plain language.</Heading></div>
            <dl>
              <div><dt>Billing</dt><dd>{PRO_BILLING_SUMMARY}</dd></div>
              <div><dt>Cancellation</dt><dd>{PRO_CANCELLATION_SUMMARY}</dd></div>
              <div><dt>Refunds</dt><dd>{PRO_REFUND_SUMMARY}</dd></div>
            </dl>
            <p>Read the complete <Link href="/terms">Terms of Service</Link> or <Link href="/support">contact support</Link> before subscribing.</p>
          </Card>
        </Container>

        <Container size="reading" className="pricing-faq-section">
          <Heading as="h2" className="pricing-section-heading pricing-faq-heading">Frequently asked questions</Heading>
          <div className="pricing-faq-list">
            {PRICING_FAQS.map((faq, index) => (
              <Card key={faq.q} variant="info" className="pricing-faq-card">
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} aria-controls={`pricing-faq-answer-${index}`}>
                  {faq.q}<span aria-hidden="true">+</span>
                </button>
                {openFaq === index && <p id={`pricing-faq-answer-${index}`}>{faq.a}</p>}
              </Card>
            ))}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  )
}
