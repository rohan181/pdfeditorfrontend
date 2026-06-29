import { supabaseAdmin } from './supabase'

export type SubscriptionTier = 'free' | 'pro' | 'team'

// Returns a 403 Response if the user is not on Pro, null if they are.
// Use at the top of every AI route handler.
export async function requirePro(userId: string): Promise<Response | null> {
  const tier = await getUserSubscription(userId)
  if (tier !== 'pro') {
    return Response.json(
      { error: 'A Pro subscription is required to use AI features. Upgrade at /pricing' },
      { status: 403 },
    )
  }
  return null
}

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
