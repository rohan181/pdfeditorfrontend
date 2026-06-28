import { supabaseAdmin } from './supabase'

export type SubscriptionTier = 'free' | 'pro' | 'team'

export async function getUserSubscription(userId: string): Promise<SubscriptionTier> {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('status, price_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data || data.status !== 'active') return 'free'
  return 'pro'
}

// Returns true if allowed, false if daily limit exceeded.
export async function checkAndIncrementUsage(
  userId: string,
  freeLimit = 5,
): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // Read current count
  const { data } = await supabaseAdmin
    .from('ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  const current = data?.count ?? 0
  if (current >= freeLimit) return false

  // Upsert incremented count
  await supabaseAdmin.from('ai_usage').upsert(
    { user_id: userId, date: today, count: current + 1 },
    { onConflict: 'user_id,date' },
  )

  return true
}
