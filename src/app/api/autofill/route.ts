import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

function extractJSON(raw: string): string | null {
  // Strip markdown code fences if present
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  const match = stripped.match(/\[[\s\S]*\]/)
  return match ? match[0] : null
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not set in .env.local' }, { status: 500 })
    }

    const { fields, userContext } = await req.json()

    if (!userContext?.trim()) {
      return Response.json({ error: 'No context provided' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    const fieldList = fields?.length
      ? fields.map((f: { name: string; type: string }, i: number) => `${i + 1}. "${f.name}" (${f.type})`).join('\n')
      : '1. "Full Name" (text)\n2. "Date" (text)\n3. "Signature" (text)'

    // Scale tokens with field count — ~60 tokens per field, minimum 2048
    const maxTokens = Math.min(8192, Math.max(2048, (fields?.length ?? 10) * 60))

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: `You are a PDF form-filling assistant.
Given a list of PDF form fields and user context, fill each field with the most appropriate value.
Return ONLY a raw JSON array — no markdown, no code fences, no extra text — in this exact format:
[{"name": "exact field name", "value": "filled value"}]
- Use empty string "" for fields you cannot confidently fill
- Keep values concise and appropriate for form fields
- For date fields use MM/DD/YYYY format unless another format is obvious
- For fields of type "checkbox": return exactly "tick" if yes/true/checked, or "cross" if no/false/unchecked
- For fields of type "char_box": return ONLY the raw characters with NO spaces or separators (e.g. "A1234567" not "A 1 2 3 4 5 6 7"). The system places each character into its own cell automatically.`,
      messages: [{
        role: 'user',
        content: `PDF Form Fields:\n${fieldList}\n\nUser Information:\n${userContext}\n\nFill all the fields above using the user information provided. Reply with the JSON array only.`,
      }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const jsonStr = extractJSON(raw)
    if (!jsonStr) {
      return Response.json({ error: 'Invalid AI response: ' + raw }, { status: 500 })
    }

    const filled: { name: string; value: string }[] = JSON.parse(jsonStr)
    return Response.json({ filled })
  } catch (err: any) {
    console.error('Autofill error:', err?.status, err?.message)
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
