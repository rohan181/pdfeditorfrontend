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
// Atomic: the first request of the day wins the insert. Every later request
// compare-and-swaps its increment (UPDATE ... WHERE count = <value just read>),
// so concurrent requests can't all read the same pre-increment count and
// slip past the limit together — a losing request just retries the read.
export async function checkAndIncrementUsage(
  userId: string,
  freeLimit = 5,
): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  const { error: insertError } = await supabaseAdmin
    .from('ai_usage')
    .insert({ user_id: userId, date: today, count: 1 })

  if (!insertError) return true
  if (insertError.code !== '23505') throw insertError // not a unique-conflict — real failure

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: row } = await supabaseAdmin
      .from('ai_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    const current = row?.count ?? 0
    if (current >= freeLimit) return false

    const { data: updated } = await supabaseAdmin
      .from('ai_usage')
      .update({ count: current + 1 })
      .eq('user_id', userId)
      .eq('date', today)
      .eq('count', current) // compare-and-swap: fails silently if another request already incremented
      .select('count')

    if (updated && updated.length > 0) return true
  }

  return false // lost the race five times in a row — fail closed
}
