/**
 * Proxy route: POST /api/pdf-pipeline/fill
 *
 * Accepts multipart form { file: PDF, facts: JSON string } and returns
 * { pdf_base64, fields, filled_count, flagged_count } from the Python server.
 */
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserSubscription, checkAndIncrementUsage } from '@/lib/subscription'

const PIPELINE_URL = process.env.PIPELINE_URL ?? 'http://localhost:8787'
const PIPELINE_TIMEOUT_MS = 60_000   // filling can take longer

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })

    const tier = await getUserSubscription(userId)
    if (tier === 'free') {
      const allowed = await checkAndIncrementUsage(userId, 5)
      if (!allowed) return Response.json({ error: 'Daily limit reached. Upgrade to Pro.' }, { status: 429 })
    }

    const formData = await req.formData()
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), PIPELINE_TIMEOUT_MS)

    let pyRes: Response
    try {
      pyRes = await fetch(`${PIPELINE_URL}/fill`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
    } catch (err: any) {
      clearTimeout(timer)
      return Response.json(
        { error: err?.name === 'AbortError' ? 'Pipeline timed out' : err.message, fallback: true },
        { status: 503 }
      )
    }
    clearTimeout(timer)

    const body = await pyRes.json()
    return Response.json(body, { status: pyRes.status })
  } catch (err: any) {
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
