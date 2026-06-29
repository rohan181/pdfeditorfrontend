import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { requirePro } from '@/lib/subscription'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })
    const proCheck = await requirePro(userId)
    if (proCheck) return proCheck

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { text, filename } = await req.json() as { text: string; filename: string }
    if (!text || text.trim().length < 10)
      return Response.json({ error: 'No readable text found in this PDF.' }, { status: 400 })

    const system = `You are an expert document formatter. Convert PDF-extracted text into clean, well-structured HTML suitable for a Word document.

Output ONLY valid HTML — no markdown, no code fences, no explanation.

Use these HTML elements:
- <h1> for the main document title
- <h2> for major section headings
- <h3> for sub-section headings
- <p> for body paragraphs
- <ul><li> for bullet lists
- <ol><li> for numbered lists
- <table><thead><tr><th> / <tbody><tr><td> for data tables
- <strong> for bold text
- <em> for italic text
- <br> for intentional line breaks within a paragraph

Rules:
- Fix PDF extraction artifacts: rejoined broken words, removed duplicate spaces, fixed broken line wraps
- Identify headings from font-size cues, ALL-CAPS patterns, or short standalone lines
- Group related lines into proper paragraphs — do NOT wrap every sentence in its own <p>
- Preserve all lists, numbered items, and table structures from the source
- Preserve all data: numbers, dates, names, figures — exactly as they appear
- Output ONLY the inner body HTML (no <html>, <head>, or <body> tags)`

    const user = `Document filename: "${filename}"

--- PDF TEXT START ---
${text.slice(0, 60000)}
--- PDF TEXT END ---

Convert this to structured HTML. Output only the HTML content.`

    const client = new Anthropic({ apiKey })
    const stream = await client.messages.stream({
      model:      'claude-opus-4-8',
      max_tokens: 8192,
      system,
      messages: [{ role: 'user', content: user }],
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
    console.error('pdf-to-word error:', e)
    return Response.json({ error: e.message ?? 'Conversion failed' }, { status: 500 })
  }
}
