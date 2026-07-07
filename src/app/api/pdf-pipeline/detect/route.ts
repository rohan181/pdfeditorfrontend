/**
 * Proxy route: POST /api/pdf-pipeline/detect
 *
 * Accepts a multipart form with a PDF file, forwards it to the Python
 * pipeline server (PIPELINE_URL, default http://localhost:8787), and
 * returns the detected fields to the client.
 *
 * Falls back gracefully to the Claude Vision-only detector when the
 * Python server is unreachable (ECONNREFUSED / timeout).
 */
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserSubscription, checkAndIncrementUsage } from '@/lib/subscription'

const PIPELINE_URL = process.env.PIPELINE_URL ?? 'http://localhost:8787'
const PIPELINE_TIMEOUT_MS = 30_000

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })

    const tier = await getUserSubscription(userId)
    if (tier === 'free') {
      const allowed = await checkAndIncrementUsage(userId, 5)
      if (!allowed) return Response.json({ error: 'Daily limit reached. Upgrade to Pro.' }, { status: 429 })
    }

    // Forward the multipart body as-is to the Python server
    const formData = await req.formData()
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), PIPELINE_TIMEOUT_MS)

    let pyRes: Response
    try {
      pyRes = await fetch(`${PIPELINE_URL}/detect`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
    } catch (err: any) {
      // Python server not running — let the client fall back to vision-only
      clearTimeout(timer)
      const isConnRefused = err?.cause?.code === 'ECONNREFUSED' || err?.name === 'AbortError'
      return Response.json(
        { error: isConnRefused ? 'pipeline_unavailable' : err.message, fallback: true },
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
