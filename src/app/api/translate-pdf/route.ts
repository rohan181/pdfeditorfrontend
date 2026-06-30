import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserSubscription, checkAndIncrementUsage } from '@/lib/subscription'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })
    const tier = await getUserSubscription(userId)
    if (tier === 'free') {
      const allowed = await checkAndIncrementUsage(userId, 5)
      if (!allowed) return Response.json({ error: 'Daily limit reached. Upgrade to Pro for unlimited access at /pricing' }, { status: 429 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { text, sourceLang, targetLang, filename } = await req.json()
    if (!text || text.trim().length < 10)
      return Response.json({ error: 'No readable text found in this PDF.' }, { status: 400 })
    if (!targetLang)
      return Response.json({ error: 'Target language is required.' }, { status: 400 })

    const sourceNote = sourceLang === 'auto'
      ? 'Detect the source language automatically.'
      : `The source language is ${sourceLang}.`

    const systemPrompt = `You are a professional document translator with expertise in all major languages.

Your task: Translate the provided PDF document text into ${targetLang}.

Rules:
- ${sourceNote}
- Preserve the document structure: headings, paragraphs, bullet points, numbered lists, and tables.
- Clean up PDF extraction artifacts (broken words across lines, odd spacing, repeated headers/footers) before translating.
- Translate ALL content including captions, labels, and table data.
- Do NOT add explanations, comments, or notes — output ONLY the translated text.
- Maintain the original formatting style and tone (formal/informal) of the source document.
- Preserve proper nouns, brand names, and technical terms unless a standard translation exists in ${targetLang}.
- Numbers, dates, and measurements should follow ${targetLang} conventions where applicable.`

    const userMsg = `Document: "${filename ?? 'document.pdf'}"

--- DOCUMENT TEXT ---
${text.slice(0, 50000)}
--- END ---

Translate the above document into ${targetLang}. Output only the translated text.`

    const client = new Anthropic({ apiKey })
    const stream = await client.messages.stream({
      model:      'claude-sonnet-4-6',
      max_tokens: 8192,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userMsg }],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (e: any) {
    console.error('translate-pdf error:', e)
    return Response.json({ error: e.message ?? 'Translation failed' }, { status: 500 })
  }
}
