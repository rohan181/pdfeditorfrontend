import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { imageBase64, mimeType = 'image/jpeg', language = 'auto' } = await req.json()
    if (!imageBase64) return Response.json({ error: 'No image provided' }, { status: 400 })

    const langHint = language !== 'auto'
      ? `The document is written in ${language}. `
      : ''

    const prompt = `${langHint}You are a precise OCR engine. Extract ALL visible text from this document image exactly as it appears.

Rules:
- Preserve paragraph breaks and line structure
- Preserve headings, subheadings, bullet points, numbered lists
- For tables: use tab-separated columns and newline-separated rows
- Include headers, footers, page numbers, captions, watermarks — everything
- Fix obvious scan artifacts (broken letters) but do not change actual words
- If a section is illegible, write [illegible]
- Output ONLY the extracted text — no commentary, no explanations, no markdown fences`

    const client = new Anthropic({ apiKey })

    const stream = await client.messages.stream({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType as 'image/jpeg' | 'image/png', data: imageBase64 },
          },
          { type: 'text', text: prompt },
        ],
      }],
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
    return Response.json({ error: e.message ?? 'OCR failed' }, { status: 500 })
  }
}
