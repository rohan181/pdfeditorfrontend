import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import Image from 'next/image'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserSubscription } from '@/lib/subscription'
import CancelSection from './CancelSection'

const FI = 'var(--font-dm,system-ui,sans-serif)'
const RED = '#E24B4A'

async function getTodayUsage(userId: string) {
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabaseAdmin
    .from('ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()
  return data?.count ?? 0
}

async function getStripeSubDetails(stripeSubId: string) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  try {
    const stripe = new Stripe(key)
    const sub = await stripe.subscriptions.retrieve(stripeSubId, {
      expand: ['items.data.price'],
    }) as unknown as Stripe.Subscription & { current_period_end: number; cancel_at_period_end: boolean }
    const price = sub.items.data[0]?.price
    return {
      periodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      amount: price?.unit_amount ? price.unit_amount / 100 : null,
      currency: price?.currency?.toUpperCase() ?? 'USD',
      interval: price?.recurring?.interval ?? 'month',
    }
  } catch {
    return null
  }
}

function fmt(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e5e7eb', padding: '24px 24px', boxShadow: '0 2px 12px rgba(0,0,0,.04)', ...style }}>
      {children}
    </div>
  )
}

function Label({ children, color = '#6b7280' }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, margin: '0 0 8px' }}>
      {children}
    </p>
  )
}

export default async function ManageSubscriptionPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [tier, usage, user, subRow] = await Promise.all([
    getUserSubscription(userId),
    getTodayUsage(userId),
    currentUser(),
    supabaseAdmin
      .from('subscriptions')
      .select('stripe_sub_id, stripe_customer_id, status, price_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(r => r.data),
  ])

  const isPro = tier === 'pro'
  const stripeSub = subRow?.stripe_sub_id ? await getStripeSubDetails(subRow.stripe_sub_id) : null

  const name  = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'there'
  const email = user?.emailAddresses?.[0]?.emailAddress ?? ''

  const freeLimit = 5
  const usagePct  = Math.min(100, (usage / freeLimit) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: FI }}>

      {/* Nav */}
      <nav style={{ maxWidth: 720, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} priority />
        </Link>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
          ← Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '8px 24px 64px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Page title */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1d1d1f', margin: '0 0 4px', letterSpacing: '-.03em' }}>
            Manage Subscription
          </h1>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>{email}</p>
        </div>

        {/* Current plan */}
        <Card>
          <Label>Current plan</Label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: isPro ? 'linear-gradient(135deg,#0891b2,#0e7490)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {isPro ? '✦' : '📄'}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.03em' }}>
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                  {isPro
                    ? stripeSub ? `$${stripeSub.amount?.toFixed(2)}/${stripeSub.interval}` : 'Active subscription'
                    : '5 AI uses per day · Free forever'}
                </div>
              </div>
            </div>

            {!isPro && (
              <Link href="/pricing"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', borderRadius: 99, fontSize: 14, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Upgrade to Pro →
              </Link>
            )}
          </div>
        </Card>

        {/* Billing details (Pro only) */}
        {isPro && stripeSub && (
          <Card>
            <Label>Billing</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {stripeSub.cancelAtPeriodEnd ? 'Access until' : 'Next billing date'}
                </p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>
                  {fmt(stripeSub.periodEnd)}
                </p>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>
                  ${stripeSub.amount?.toFixed(2)} {stripeSub.currency} / {stripeSub.interval}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* AI usage */}
        <Card>
          <Label>AI usage today</Label>
          {isPro ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(8,145,178,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                ∞
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1d1d1f' }}>Unlimited AI uses</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>Used {usage} times today</p>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.03em' }}>{usage}</span>
                <span style={{ fontSize: 14, color: '#9ca3af' }}>/ {freeLimit} uses today</span>
              </div>
              <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${usagePct}%`, background: usagePct >= 100 ? '#ef4444' : 'linear-gradient(90deg,#0891b2,#0e7490)', borderRadius: 99, transition: 'width .4s ease' }} />
              </div>
              {usagePct >= 100 && (
                <p style={{ margin: '8px 0 0', fontSize: 13, color: '#ef4444', fontWeight: 600 }}>
                  Daily limit reached. Resets at midnight UTC.
                </p>
              )}
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280' }}>
                Upgrade to Pro for unlimited AI uses every day.
              </p>
            </div>
          )}
        </Card>

        {/* What's included */}
        <Card>
          <Label>Plan features</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['AI Form Filler',         isPro],
              ['PDF Summarizer',         isPro],
              ['PDF Translator',         isPro],
              ['PDF Mind Map',           isPro],
              ['Quiz Creator',           isPro],
              ['PDF OCR Scanner',        isPro],
              ['PDF Editor',             true],
              ['PDF Merger & Splitter',  true],
              ['PDF Compressor',         true],
              ['PDF → Word / Excel',     isPro],
              ['Password Lock',          true],
              ['PDF Watermarker',        true],
            ].map(([feature, included]) => (
              <div key={feature as string} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: included ? 'rgba(8,145,178,.05)' : '#f9fafb' }}>
                <span style={{ fontSize: 13, flexShrink: 0, color: included ? '#0891b2' : '#d1d5db' }}>
                  {included ? '✓' : '✕'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: included ? '#1d1d1f' : '#9ca3af' }}>
                  {feature as string}
                </span>
                {!included && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#0891b2', background: 'rgba(8,145,178,.1)', padding: '2px 7px', borderRadius: 99, whiteSpace: 'nowrap' }}>Pro</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Account info */}
        <Card>
          <Label>Account</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1d1d1f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{name[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>{name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>{email}</p>
            </div>
          </div>
        </Card>

        {/* Cancellation (Pro only) */}
        {isPro && (
          <Card>
            <Label color="#ef4444">Danger zone</Label>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.55 }}>
              Cancelling keeps Pro active until the end of your current billing period. You can resubscribe at any time.
            </p>
            <CancelSection cancelAtPeriodEnd={stripeSub?.cancelAtPeriodEnd ?? false} />
          </Card>
        )}

        {/* Support link */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', margin: '8px 0 0' }}>
          Questions?{' '}
          <a href="mailto:support@editpdfai.com" style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
            Contact support
          </a>
          {' · '}
          <Link href="/pricing" style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
            View pricing
          </Link>
        </p>

      </div>
    </div>
  )
}
