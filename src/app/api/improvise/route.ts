import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
    }

    const { fields, userContext, wordLimit } = await req.json()
    if (!fields?.length) {
      return Response.json({ error: 'No fields provided' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    const fieldList = fields
      .map((f: { name: string; value: string; type: string }) =>
        `Field: "${f.name}"\nCurrent value: "${f.value}"`
      )
      .join('\n\n')

    const wordRule = wordLimit
      ? `- Each improved value MUST be approximately ${wordLimit} words. Do not exceed ${wordLimit} words.`
      : `- Keep values concise and appropriate — 1-2 sentences for description fields, shorter for name/date/address fields`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: wordLimit ? Math.max(1024, wordLimit * fields.length * 8) : 1024,
      system: `You are a professional content writer helping improve PDF form field values.
For each field given, enhance the current value to be more complete, professional, or descriptive while keeping the core information intact.
- Expand abbreviations, fix capitalization, add relevant details where appropriate
${wordRule}
- For name fields: proper capitalization only
- For address fields: add standard formatting
- For date fields: keep the same date, just standardize format
- Return ONLY a valid JSON array, no extra text:
[{"name": "exact field name", "value": "improved value"}]`,
      messages: [{
        role: 'user',
        content: `Improve these form field values:\n\n${fieldList}\n\nUser context: ${userContext || 'N/A'}${wordLimit ? `\n\nIMPORTANT: Each value must be approximately ${wordLimit} words.` : ''}`,
      }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
    const match = stripped.match(/\[[\s\S]*\]/)
    if (!match) {
      return Response.json({ error: 'Invalid AI response: ' + raw }, { status: 500 })
    }

    const improved: { name: string; value: string }[] = JSON.parse(match[0])
    return Response.json({ improved })
  } catch (err: any) {
    console.error('Improvise error:', err?.message)
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
