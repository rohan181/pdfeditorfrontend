import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

function extractJSON(raw: string): any | null {
  // Strip markdown fences
  let s = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  // Try direct parse
  try { return JSON.parse(s) } catch {}
  // Try to find the first {...} block in the text
  const start = s.indexOf('{')
  const end   = s.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try { return JSON.parse(s.slice(start, end + 1)) } catch {}
  }
  return null
}

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
2. When the user provides information, extract the values and acknowledge what you captured.
3. Continue until all fields are filled or the user says they're done.
4. If a field is already filled, skip it unless the user wants to change it.

RESPONSE FORMAT — always reply with a raw JSON object, no markdown, no code fences:
{"message":"Your message here","extracted":[{"name":"field name","value":"value"}],"signatureField":null,"done":false}

Rules:
- "message": plain conversational text only — NO JSON, NO curly braces, NO code blocks inside the message string.
- "extracted": fields you can confidently extract from the user's latest reply. [] if nothing new.
- "signatureField": if the NEXT unfilled field is a signature/initials field, set this to the exact field name (string). Otherwise null.
- "done": true only when all unfilled fields collected or user says stop.
- Values must be bare (no "Label: value" — just the value).
- Checkbox fields: "filledbox" if checked/yes, "cross" if no/unchecked, "" if unsure.
- char_box: raw characters, no spaces.
- Never invent values.
- For signature fields: set signatureField to the field name and say something like "Please sign below" — do NOT ask the user to type anything.`,
      messages,
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const parsed = extractJSON(raw)

    if (parsed && typeof parsed.message === 'string') {
      return Response.json(parsed)
    }

    // Fallback: treat the whole response as a plain message (never expose raw JSON)
    const plainMsg = raw
      .replace(/^\{[\s\S]*\}$/, '') // strip if the whole thing is JSON
      .replace(/\{[^}]{0,200}\}/g, '') // strip inline JSON objects
      .trim()

    return Response.json({
      message: plainMsg || "I didn't quite understand that. Could you please rephrase?",
      extracted: [],
      done: false,
    })
  } catch (err: any) {
    console.error('Chat-fill error:', err?.message)
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
