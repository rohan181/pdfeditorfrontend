import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const maxDuration = 120

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
      `=== Document ${i} (sourceIdx: ${i}): "${s.name}" ===\n${s.text.slice(0, 25000)}`
    ).join('\n\n')

    const prompt = `You are an expert knowledge-graph and mind-map generator. Thoroughly read every word of the provided document(s), then produce a RICH, DETAILED mind-map JSON.

${docsText}

═══ TASK ═══
Analyse the documents deeply. Extract real concepts, facts, arguments, methods, examples, and conclusions — not generic placeholders. Every label and description must come directly from the document content.

OUTPUT FORMAT — return ONLY a single valid JSON object with NO markdown fences, NO prose, NO explanation:
{"title":"...","nodes":[...],"edges":[...]}

═══ NODE TYPES ═══

1. CENTER (exactly 1):
   {"id":"center","label":"Core Theme","description":"The unifying idea across all documents in 1-2 sentences","type":"center","sourceIdx":-1}

2. BRANCH — main topic nodes (sourceIdx = document index 0,1,2…):
   Create exactly 6 branch nodes per document, covering DISTINCT aspects (theory, methodology, results, applications, limitations, examples, etc.)
   {"id":"b0-1","label":"Short Specific Label","description":"What this topic covers in 1-2 sentences from the actual document","type":"branch","sourceIdx":0}

3. LEAF — specific sub-concepts under each branch:
   Create exactly 5 leaf nodes per branch with CONCRETE details (specific numbers, names, methods, findings, quotes).
   {"id":"b0-1-1","label":"Specific Detail","description":"Precise fact or concept from the document","type":"leaf","sourceIdx":0}

═══ EDGE TYPES ═══
Tree: {"from":"center","to":"b0-1","type":"tree"} and {"from":"b0-1","to":"b0-1-1","type":"tree"}
Cross (5-10 total, only between leaves from DIFFERENT documents): {"from":"b0-1-2","to":"b1-3-1","type":"cross","label":"relates to"}

═══ ID CONVENTION ═══
Center: "center" | Branches: "b{docIdx}-{num}" e.g. b0-1 | Leaves: "b{docIdx}-{branchNum}-{leafNum}" e.g. b0-1-3

═══ QUALITY RULES ═══
- Labels must be 1-4 words and SPECIFIC (no "Key Point", "Important Concept", "Overview")
- Descriptions must contain actual content extracted from the text
- Each branch must cover a genuinely different aspect — no overlap
- Leaf descriptions must include specific details: numbers, names, quotes, findings
- Output ONLY the JSON object`

    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      'claude-opus-4-8',
      max_tokens: 8192,
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
