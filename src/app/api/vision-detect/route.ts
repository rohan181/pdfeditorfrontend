import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserSubscription, checkAndIncrementUsage } from '@/lib/subscription'

function extractJSON(raw: string): string | null {
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  const match = stripped.match(/\[[\s\S]*\]/)
  return match ? match[0] : null
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })

    const tier = await getUserSubscription(userId)
    if (tier === 'free') {
      const allowed = await checkAndIncrementUsage(userId, 5)
      if (!allowed) return Response.json({ error: 'Daily limit reached. Upgrade to Pro for unlimited access.' }, { status: 429 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })

    const { pageImageBase64, pageWidth, pageHeight } = await req.json()
    if (!pageImageBase64) return Response.json({ error: 'Missing pageImageBase64' }, { status: 400 })

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: pageImageBase64 },
          },
          {
            type: 'text',
            text: `You are analysing a PDF form page (${pageWidth ?? '?'}×${pageHeight ?? '?'} px).

Find every fillable form field on this page. Form fields include:
- Underlines or blank lines after a label (e.g. "Surname: ____________")
- Bordered text boxes or input areas
- Checkboxes (small squares or circles)
- Signature lines (a line labelled "Signature" or "Sign here")
- Date fields (labelled "Date", "DOB", etc.)
- Any other area where a user is expected to write or type

For EACH field return a JSON object with:
- "label": the text label nearest to this field (e.g. "Surname", "Date Submitted", "Student Signature")
- "type": one of "text" | "date" | "signature" | "checkbox" | "multiline" | "number"
- "x": left edge as % of page width (0-100)
- "y": top edge as % of page height (0-100)
- "w": width as % of page width (0-100)
- "h": height as % of page height (0-100)

Rules:
- The bounding box should cover the writeable area (the underline / box), NOT the label text
- For underlines: x starts where the underline starts, w matches the underline length, h is about 2-4%
- For signature lines: type = "signature"
- Ignore purely decorative lines and running text paragraphs
- Only include genuine fillable fields

Return ONLY a JSON array, no other text:
[{"label":"Surname","type":"text","x":22,"y":31,"w":28,"h":3}, ...]`,
          },
        ],
      }],
    })

    const textBlock = response.content.find(c => c.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json({ error: 'No text in Claude response' }, { status: 500 })
    }

    const jsonStr = extractJSON(textBlock.text)
    if (!jsonStr) {
      return Response.json({ error: 'Could not parse JSON from response', raw: textBlock.text }, { status: 500 })
    }

    const fields = JSON.parse(jsonStr)
    return Response.json({ fields })
  } catch (err: any) {
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
