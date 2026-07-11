import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getUserSubscription } from '@/lib/subscription'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

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

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [tier, usage, user] = await Promise.all([
    getUserSubscription(userId),
    getTodayUsage(userId),
    currentUser(),
  ])

  const isPro  = tier !== 'free'
  const limit  = 5
  const pct    = Math.min(100, (usage / limit) * 100)
  const name   = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'there'
  const email  = user?.emailAddresses?.[0]?.emailAddress ?? ''
  const avatar = user?.imageUrl

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'var(--font-dm,system-ui,sans-serif)' }}>

      {/* Nav */}
      <nav style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="lg-db" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4F7FFA"/><stop offset="100%" stopColor="#8B3FEC"/></linearGradient></defs>
            <path d="M5,2 L19,2 L27,10 L27,26 Q27,28 25,28 L5,28 Q3,28 3,26 L3,4 Q3,2 5,2 Z" fill="white" stroke="url(#lg-db)" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M19,2 L19,10 L27,10" fill="none" stroke="url(#lg-db)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="22" x2="20" y2="11" stroke="url(#lg-db)" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="8" cy="23" r="1.8" fill="url(#lg-db)"/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0D1B4B', letterSpacing: '-.03em' }}>
            EditPDF<span style={{ marginLeft: 2, background: 'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </span>
        </Link>
        <Link href="/" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to tools
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '8px 24px 64px' }}>

        {/* Profile header */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 28px', border: '1.5px solid #e5e7eb', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
          {avatar ? (
            <img src={avatar} alt={name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#1d1d1f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{name[0]?.toUpperCase()}</span>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', margin: '0 0 4px', letterSpacing: '-.03em' }}>
              Hey, {name} 👋
            </h1>
            <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>{email}</p>
          </div>
          <span style={{
            padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700,
            background: isPro ? 'linear-gradient(135deg,#0891b2,#0e7490)' : '#f3f4f6',
            color: isPro ? '#fff' : '#6b7280',
          }}>
            {isPro ? '✦ Pro' : 'Free'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>

          {/* My Plan */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, height: 28, background: '#f0f9ff', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0891b2"/></svg>
              </span>
              My Plan
            </h2>

            <div style={{ background: isPro ? 'linear-gradient(135deg,#0891b2,#0e7490)' : '#f9fafb', borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: isPro ? 'rgba(255,255,255,.7)' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 4px' }}>
                Current plan
              </p>
              <p style={{ fontSize: 24, fontWeight: 800, color: isPro ? '#fff' : '#1d1d1f', margin: '0 0 4px', letterSpacing: '-.03em' }}>
                {isPro ? 'Pro' : 'Free'}
              </p>
              <p style={{ fontSize: 13, color: isPro ? 'rgba(255,255,255,.7)' : '#6b7280', margin: 0 }}>
                {isPro ? 'Unlimited AI · All tools' : `${limit} AI uses per day`}
              </p>
            </div>

            {!isPro && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>AI uses today</span>
                    <span style={{ fontSize: 13, color: usage >= limit ? '#ef4444' : '#374151', fontWeight: 700 }}>{usage} / {limit}</span>
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 100, background: usage >= limit ? '#ef4444' : '#0891b2', transition: 'width .3s' }} />
                  </div>
                  {usage >= limit && (
                    <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontWeight: 500 }}>Daily limit reached — resets at midnight</p>
                  )}
                </div>
                <Link href="/pricing" style={{
                  display: 'block', textAlign: 'center', padding: '12px 0', borderRadius: 12,
                  background: '#1d1d1f', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}>
                  Upgrade to Pro — $1.00/mo
                </Link>
              </>
            )}

            {isPro && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <form action="/api/subscription/portal" method="POST">
                  <button type="submit" style={{
                    width: '100%', padding: '12px 0', borderRadius: 12,
                    background: '#f3f4f6', color: '#374151', border: 'none',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>
                    Manage subscription
                  </button>
                </form>
                <a href="/cancel" style={{
                  display: 'block', textAlign: 'center', padding: '11px 0', borderRadius: 12,
                  border: '1.5px solid #fee2e2', color: '#ef4444', background: '#fff',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                }}>
                  Cancel subscription
                </a>
              </div>
            )}
          </div>

          {/* Quick access */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, height: 28, background: '#f5f3ff', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Quick Access
            </h2>
            {[
              { label: 'AI Form Filler',   href: '/ai-pdf-form-filler', color: '#7c3aed' },
              { label: 'PDF Summarizer',   href: '/pdf-summarizer',      color: '#0891b2' },
              { label: 'PDF Translator',   href: '/pdf-translator',      color: '#16a34a' },
              { label: 'PDF Mind Map',     href: '/mind-map',            color: '#f97316' },
              { label: 'PDF → Word',       href: '/pdf-to-word',         color: '#2563eb' },
              { label: 'Quiz Creator',     href: '/quiz-creator',        color: '#dc2626' },
            ].map(({ label, href, color }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: 10, marginBottom: 8,
                background: '#fafafa', textDecoration: 'none', border: '1px solid #f3f4f6',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}15`, padding: '2px 8px', borderRadius: 100 }}>AI</span>
              </Link>
            ))}
          </div>

        </div>

        {/* Upgrade banner for free users */}
        {!isPro && (
          <div style={{ marginTop: 20, background: '#1d1d1f', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(8,145,178,.3),transparent 70%)', pointerEvents: 'none' }} />
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-.03em' }}>Go unlimited with Pro</p>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Unlimited AI uses, all tools, priority processing — just $1.00/mo</p>
            </div>
            <Link href="/pricing" style={{
              padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#0891b2,#0e7490)',
              color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', flexShrink: 0,
            }}>
              Upgrade now →
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
