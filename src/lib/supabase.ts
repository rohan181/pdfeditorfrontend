import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Lazily initialized so missing env vars during build don't crash the module
export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return _client
}

// Keep named export for backwards compat — routes that import supabaseAdmin directly still work
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop]
  },
})
