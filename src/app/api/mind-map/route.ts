import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const maxDuration = 60

function extractJSON(raw: string): any {
  const m = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
  return JSON.parse(m ? m[1] : raw.trim())
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { sources } = await req.json() as { sources: { name: string; text: string }[] }
    if (!sources?.length) return Response.json({ error: 'No sources provided' }, { status: 400 })

    const docsText = sources.map((s, i) =>
      `=== Document ${i} (sourceIdx: ${i}): "${s.name}" ===\n${s.text.slice(0, 3500)}`
    ).join('\n\n')

    const prompt = `You are a knowledge-graph generator. Analyze these ${sources.length} document(s) and return a mind-map JSON.

${docsText}

Return ONLY a single valid JSON object — no markdown, no prose:
{
  "title": "Overall theme in 3-6 words",
  "nodes": [
    {"id":"center",  "label":"Central Theme",   "description":"What all documents share",       "type":"center", "sourceIdx":-1},
    {"id":"b0",      "label":"Document 0 Topic","description":"What document 0 is about",       "type":"branch", "sourceIdx":0},
    {"id":"b0-1",    "label":"Key Concept",      "description":"Detail about this concept",      "type":"leaf",   "sourceIdx":0}
  ],
  "edges": [
    {"from":"center","to":"b0",  "type":"tree"},
    {"from":"b0",   "to":"b0-1","type":"tree"},
    {"from":"b0-2", "to":"b1-1","type":"cross","label":"relates to"}
  ]
}

Strict rules:
- Exactly ONE center node, sourceIdx: -1
- Exactly ONE branch node per document (sourceIdx 0, 1, 2 … matching document index)
- 3–6 leaf nodes per branch; leaf sourceIdx must equal its parent branch's sourceIdx
- Tree edges only: center→branch and branch→leaf
- Up to 6 optional cross-reference edges connecting leaf nodes from DIFFERENT documents
- Labels: 1–4 words, concise
- IDs: "center"; "b0","b1"… for branches; "b0-1","b0-2"… for leaves of branch b0
- Output ONLY the JSON — nothing else`

    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages:   [{ role: 'user', content: prompt }],
    })

    const raw  = (msg.content[0] as any).text as string
    const data = extractJSON(raw)
    return Response.json(data)
  } catch (e: any) {
    console.error('mind-map error:', e)
    return Response.json({ error: e.message ?? 'Failed to generate mind map' }, { status: 500 })
  }
}
