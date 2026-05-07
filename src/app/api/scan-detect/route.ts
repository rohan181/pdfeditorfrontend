import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

function extractJSON(raw: string): string | null {
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

    const { annotatedImageBase64, boxes } = await req.json()

    if (!annotatedImageBase64 || !boxes?.length) {
      return Response.json({ error: 'Missing annotatedImageBase64 or boxes' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: annotatedImageBase64,
              },
            },
            {
              type: 'text',
              text: `This is a scanned form with ${boxes.length} numbered bounding boxes drawn on it in red. Each box marks a detected form field.

For each numbered box (1 through ${boxes.length}), identify:
1. "type": one of:
   - "text_field"  — a regular text input box
   - "char_box"    — a row of individual character cells (each letter goes in its own cell, common on passport/ID/government forms)
   - "checkbox"    — a small tick box (yes/no)
   - "signature"   — a signature or initials box
   - "date_field"  — a field specifically for a date
   - "dropdown"    — a select / drop-down list
2. "label": the field label visible near that box (e.g. "Full Name", "Date of Birth", "Email Address")

Rules:
- Every box number must appear in your response
- Use the label text closest to each box
- If no label is visible near a box, infer from context (e.g. "Field ${'{box_number}'}")
- Prefer "char_box" over "text_field" when the box is clearly divided into equal-width individual character cells

Return ONLY a JSON array with no other text:
[{"box": 1, "type": "text_field", "label": "Full Name"}, ...]`,
            },
          ],
        },
      ],
    })

    const textBlock = response.content.find((c) => c.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json({ error: 'No text in Claude response' }, { status: 500 })
    }

    const jsonStr = extractJSON(textBlock.text)
    if (!jsonStr) {
      return Response.json({ error: 'Could not parse JSON from Claude response', raw: textBlock.text }, { status: 500 })
    }

    const annotations = JSON.parse(jsonStr)
    return Response.json({ annotations })
  } catch (err: any) {
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
