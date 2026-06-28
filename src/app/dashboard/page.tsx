import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserSubscription, checkAndIncrementUsage } from '@/lib/subscription'
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

  const [tier, usage] = await Promise.all([
    getUserSubscription(userId),
    getTodayUsage(userId),
  ])

  const isPro = tier !== 'free'
  const limit = 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-block">
          ← Back to tools
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-500 mb-8">Manage your EditPDF AI subscription and usage.</p>

        {/* Plan card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Current Plan</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPro
                ? 'bg-violet-100 text-violet-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
          </div>

          {!isPro && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>AI uses today</span>
                <span>{usage} / {limit}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-violet-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usage / limit) * 100)}%` }}
                />
              </div>
              {usage >= limit && (
                <p className="text-amber-600 text-sm mt-2">
                  Daily limit reached. Upgrade for unlimited AI access.
                </p>
              )}
            </div>
          )}

          {isPro ? (
            <p className="text-slate-600 text-sm">Unlimited AI operations. Enjoy unrestricted access to all tools.</p>
          ) : (
            <p className="text-slate-600 text-sm">
              Free plan includes {limit} AI operations per day. All core PDF tools are always free.
            </p>
          )}
        </div>

        {/* Upgrade CTA */}
        {!isPro && (
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
            <h2 className="font-bold text-lg mb-1">Upgrade to Pro</h2>
            <p className="text-violet-100 text-sm mb-4">
              Unlimited AI operations, priority processing, and all future features.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-white text-violet-700 font-semibold px-5 py-2 rounded-xl text-sm hover:bg-violet-50 transition"
            >
              View pricing →
            </Link>
          </div>
        )}

        {isPro && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-3">Subscription</h2>
            <form action="/api/subscription/portal" method="POST">
              <button
                type="submit"
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition"
              >
                Manage subscription
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
