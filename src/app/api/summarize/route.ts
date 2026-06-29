import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { requirePro } from '@/lib/subscription'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })
    const proCheck = await requirePro(userId)
    if (proCheck) return proCheck

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { text, length, focus, filename } = await req.json()
    if (!text || text.trim().length < 50)
      return Response.json({ error: 'Document text is too short to summarize.' }, { status: 400 })

    const lengthGuide: Record<string, string> = {
      brief:    'Write a concise summary in 3-5 sentences followed by 4-6 bullet points.',
      standard: 'Write a 2-3 paragraph summary followed by 6-10 bullet points.',
      detailed: 'Write a thorough 4-6 paragraph summary followed by 10-15 bullet points.',
    }
    const focusGuide: Record<string, string> = {
      general:   'Focus on the main ideas, purpose, and key takeaways for a general audience.',
      technical: 'Emphasise technical details, methods, specifications, and implementation considerations.',
      legal:     'Highlight obligations, rights, dates, parties, clauses, and any risks or liabilities.',
      medical:   'Focus on diagnoses, treatments, medications, dosages, procedures, and patient outcomes.',
      financial: 'Emphasise figures, dates, obligations, projections, risks, and financial terms.',
    }

    const systemPrompt = `You are an expert document analyst. Summarize the provided document content.

Output format — always use exactly this Markdown structure:
## Overview
[summary paragraph(s)]

## Key Points
- point 1
- point 2
...

## Notable Details
- detail 1
...

## Conclusion
[closing paragraph]

Rules:
- ${lengthGuide[length] ?? lengthGuide.standard}
- ${focusGuide[focus] ?? focusGuide.general}
- Be factual; do not add information not in the document.
- Use plain language unless the focus requires technical terms.
- Preserve important numbers, dates, names, and figures exactly.`

    const userMsg = `Document filename: "${filename ?? 'document.pdf'}"

Document content:
${text.slice(0, 80000)}`

    const client = new Anthropic({ apiKey })

    const stream = await client.messages.stream({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2048,
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
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
    })
  } catch (e: any) {
    return Response.json({ error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}
