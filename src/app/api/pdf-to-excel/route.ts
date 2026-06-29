import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserSubscription, checkAndIncrementUsage } from '@/lib/subscription'

export const maxDuration = 120

function extractJSON(raw: string): any {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
  return JSON.parse(fenced ? fenced[1] : raw.trim())
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })
    const tier = await getUserSubscription(userId)
    if (tier === 'free') {
      const allowed = await checkAndIncrementUsage(userId, 1)
      if (!allowed) return Response.json({ error: 'Daily limit reached. Upgrade to Pro for unlimited access at /pricing' }, { status: 429 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { text, filename } = await req.json() as { text: string; filename: string }
    if (!text || text.trim().length < 10)
      return Response.json({ error: 'No readable text found in this PDF.' }, { status: 400 })

    const prompt = `You are a data extraction expert. Analyze the following PDF document text and extract ALL tabular or structured data into spreadsheet-ready format.

Document: "${filename}"

--- DOCUMENT TEXT START ---
${text.slice(0, 60000)}
--- DOCUMENT TEXT END ---

Instructions:
1. Identify every table, list, form, invoice, schedule, report, or structured data block.
2. Each logical group of data becomes one sheet.
3. Include headers as the first row of each sheet.
4. If the document has no obvious tables, extract any key-value pairs, lists, or structured sections into a clean tabular form.
5. Clean up garbled or merged text caused by PDF extraction artifacts.
6. Preserve all numbers, dates, and values exactly as they appear.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "sheets": [
    {
      "name": "Sheet name (max 31 chars)",
      "rows": [
        ["Header1", "Header2", "Header3"],
        ["value1",  "value2",  "value3"],
        ...
      ]
    }
  ]
}

Rules:
- Always include at least one sheet.
- Sheet names must be ≤ 31 characters.
- Every row must have the same number of columns as the header row.
- Use empty string "" for missing cells.
- Output ONLY the JSON object.`

    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      'claude-opus-4-8',
      max_tokens: 8192,
      messages:   [{ role: 'user', content: prompt }],
    })

    const raw  = (msg.content[0] as any).text as string
    const data = extractJSON(raw)

    if (!data.sheets || !Array.isArray(data.sheets) || data.sheets.length === 0)
      return Response.json({ error: 'No structured data could be extracted from this PDF.' }, { status: 422 })

    return Response.json(data)
  } catch (e: any) {
    console.error('pdf-to-excel error:', e)
    return Response.json({ error: e.message ?? 'Failed to extract data' }, { status: 500 })
  }
}
