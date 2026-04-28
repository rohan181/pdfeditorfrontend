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

    const { fields, userContext, pageImageBase64 } = await req.json()

    if (!userContext?.trim()) {
      return Response.json({ error: 'No context provided' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    const fieldList = fields?.length
      ? fields.map((f: { name: string; type: string; value?: string }, i: number) =>
          `${i + 1}. "${f.name}" (${f.type})${f.value ? ` [already: ${f.value}]` : ''}`
        ).join('\n')
      : '1. "Full Name" (text)\n2. "Date" (text)\n3. "Signature" (text)'

    // Scale tokens with field count — ~60 tokens per field, minimum 2048
    const maxTokens = Math.min(8192, Math.max(2048, (fields?.length ?? 10) * 60))

    // Build message content — include page image if available for visual context
    const userContent: any[] = []
    if (pageImageBase64) {
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg' as const, data: pageImageBase64 },
      })
      userContent.push({ type: 'text', text: 'Above is the PDF form page you are filling.' })
    }
    userContent.push({
      type: 'text',
      text: `PDF Form Fields:\n${fieldList}\n\nUser Information:\n${userContext}\n\nFill all the fields above using the user information provided. Reply with the JSON array only.`,
    })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: `You are a PDF form-filling assistant with vision capability.
When a form page image is provided, read the visible field labels on the page to understand what each field actually asks for — use this to correctly match data from the user context.

CRITICAL — VALUE FORMAT:
- Return ONLY the bare value. NEVER include the label or key in the value.
  ✗ WRONG: "Father's Name: ASMOT ALI"
  ✓ RIGHT:  "ASMOT ALI"
  ✗ WRONG: "Date of Birth: 12/09/1998"
  ✓ RIGHT:  "12/09/1998"
- If the user context has lines like "Label: value", extract only the part after the colon.

CRITICAL — UNKNOWN FIELDS:
- If you are not confident about a field's value, return "" (empty string). DO NOT guess or invent values.
- Only fill a field when you can clearly match it to data in the user context.
- A field filled with wrong data is far worse than a field left empty.

OTHER RULES:
- Values must be short and concise — form fields hold brief answers, not sentences
- Dates: if the field name contains "Day" fill ONLY the 2-digit day (e.g. "09"). If it contains "Month" fill ONLY the 2-digit month (e.g. "12"). If it contains "Year" fill ONLY the 4-digit year (e.g. "1998"). For any other date field return the full date with "/" separators in DD/MM/YYYY format (e.g. "09/12/1998"). Never return raw digits without separators for full dates.
- checkbox type: MUST return exactly the string "tick" (not "yes", not "true", not "checked") if the box should be checked, "cross" if unchecked, "" if genuinely unsure. No other values allowed.
- signature type: return "" (empty string) — signatures are drawn, never typed.
- char_box type: return raw characters with NO spaces (e.g. "A1234567"). The renderer places each character into its own cell.
- When multiple documents are provided, pick the most relevant one per field

Return ONLY a raw JSON array — no markdown, no code fences, no extra text:
[{"name": "exact field name", "value": "filled value"}]`,
      messages: [{ role: 'user', content: userContent }],
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
