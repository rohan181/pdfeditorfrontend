import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { history, fields, pageImageBase64 } = await req.json()

    const client = new Anthropic({ apiKey })

    const fieldSummary = (fields as { name: string; type: string; value?: string }[])
      .map(f => `- "${f.name}" (${f.type})${f.value ? ` [already: ${f.value}]` : ' [UNFILLED]'}`)
      .join('\n')

    const userContent: any[] = []
    if (pageImageBase64) {
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg' as const, data: pageImageBase64 },
      })
      userContent.push({ type: 'text', text: 'Above is the PDF form page.' })
    }

    const lastUserMsg = history[history.length - 1]?.content ?? ''
    userContent.push({ type: 'text', text: lastUserMsg })

    const messages: any[] = []
    for (let i = 0; i < history.length - 1; i++) {
      messages.push({ role: history[i].role, content: history[i].content })
    }
    messages.push({ role: 'user', content: userContent })

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a friendly PDF form-filling assistant having a natural conversation to help complete a form.

FORM FIELDS:
${fieldSummary}

YOUR JOB:
1. Ask the user about UNFILLED fields, one or a few at a time in a conversational way.
2. When the user provides information, extract the values and acknowledge what you've captured.
3. Continue until all fields are filled or the user says they're done.
4. If a field is already filled, skip it unless the user wants to change it.

RESPONSE FORMAT — you MUST always reply with valid JSON in this exact shape:
{
  "message": "Your conversational message to the user",
  "extracted": [{"name": "exact field name", "value": "extracted value"}],
  "done": false
}

Rules:
- "message": friendly, short — ask 1-2 fields at a time. Confirm what you captured before asking the next batch.
- "extracted": list only fields you can confidently extract from the user's LATEST reply. Empty array [] if nothing new.
- "done": set true ONLY when all unfilled fields have been collected or the user explicitly says to stop.
- Values must be bare (no "Label: value" format, just the value itself).
- For checkbox/tick fields: "tick" or "cross" only.
- For char_box: raw characters, no spaces.
- Never invent values — if unsure, ask.
- Return ONLY the JSON object, no markdown, no extra text.`,
      messages,
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    let parsed: any
    try {
      const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      parsed = { message: raw, extracted: [], done: false }
    }

    return Response.json(parsed)
  } catch (err: any) {
    console.error('Chat-fill error:', err?.message)
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
