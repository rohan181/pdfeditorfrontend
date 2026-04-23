import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    console.log('API key present:', !!apiKey, 'prefix:', apiKey?.slice(0, 16))

    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not set in .env.local' }, { status: 500 })
    }

    const { fields, userContext } = await req.json()

    if (!userContext?.trim()) {
      return Response.json({ error: 'No context provided' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    // If no form fields detected, ask Claude to generate content based on context
    const fieldList = fields?.length
      ? fields.map((f: { name: string; type: string }, i: number) => `${i + 1}. "${f.name}" (${f.type})`).join('\n')
      : '1. "Full Name" (text)\n2. "Date" (text)\n3. "Signature" (text)'

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a PDF form-filling assistant.
Given a list of PDF form fields and user context, fill each field with the most appropriate value.
Return ONLY a valid JSON array with no extra text, in this exact format:
[{"name": "exact field name", "value": "filled value"}]
- Use empty string "" for fields you cannot confidently fill
- Keep values concise and appropriate for form fields
- For date fields use MM/DD/YYYY format unless another format is obvious
- For checkbox/boolean fields use "Yes" or "No"`,
      messages: [{
        role: 'user',
        content: `PDF Form Fields:\n${fieldList}\n\nUser Information:\n${userContext}\n\nFill all the fields above using the user information provided.`,
      }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return Response.json({ error: 'Invalid AI response: ' + raw }, { status: 500 })
    }

    const filled: { name: string; value: string }[] = JSON.parse(jsonMatch[0])
    return Response.json({ filled })
  } catch (err: any) {
    console.error('Autofill error:', err?.status, err?.message)
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
