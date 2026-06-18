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
      `=== Document ${i} (sourceIdx: ${i}): "${s.name}" ===\n${s.text.slice(0, 4000)}`
    ).join('\n\n')

    const prompt = `You are an expert knowledge-graph and mind-map generator. Deeply analyze the content of these ${sources.length} document(s) and produce a RICH, DETAILED mind-map JSON with many topics and sub-topics.

${docsText}

OUTPUT FORMAT — return ONLY a single valid JSON object, absolutely no markdown fences or prose:
{
  "title": "Concise overall theme (3-6 words)",
  "nodes": [ ... ],
  "edges": [ ... ]
}

═══ NODE TYPES ═══

1. CENTER (exactly 1):
   {"id":"center","label":"Core Theme","description":"The unifying idea across all documents","type":"center","sourceIdx":-1}

2. BRANCH — main topic nodes, one colour per document (sourceIdx = document index 0,1,2…):
   IMPORTANT: For EACH document create 4 to 6 branch nodes representing its KEY TOPICS.
   All branches from the same document share the same sourceIdx.
   {"id":"b0-1","label":"Topic Name","description":"What this topic is about in 1-2 sentences","type":"branch","sourceIdx":0}
   {"id":"b0-2","label":"Another Topic","description":"Description","type":"branch","sourceIdx":0}
   … (4-6 per document)

3. LEAF — specific concepts, sub-topics, facts, or details under each branch:
   For EACH branch node, create 3 to 5 leaf nodes.
   Leaf sourceIdx must equal its parent branch's sourceIdx.
   {"id":"b0-1-1","label":"Sub-concept","description":"Specific detail, fact, or insight","type":"leaf","sourceIdx":0}
   {"id":"b0-1-2","label":"Another Detail","description":"...","type":"leaf","sourceIdx":0}
   … (3-5 per branch)

═══ EDGE TYPES ═══

Tree edges (hierarchy only — no other connections):
  {"from":"center","to":"b0-1","type":"tree"}   ← center to every branch
  {"from":"b0-1","to":"b0-1-1","type":"tree"}   ← branch to its leaves

Cross-reference edges (5 to 10 total, connecting LEAF nodes from DIFFERENT documents):
  {"from":"b0-1-2","to":"b1-3-1","type":"cross","label":"relates to"}

═══ ID CONVENTION ═══
- Center:  "center"
- Branches: "b{docIdx}-{topicNum}"   e.g. b0-1, b0-2, b1-1, b1-2
- Leaves:  "b{docIdx}-{topicNum}-{leafNum}"  e.g. b0-1-1, b0-1-2, b1-2-3

═══ QUALITY RULES ═══
- Labels: 1–4 words, specific and meaningful (not generic like "Key Point")
- Descriptions: 1–2 sentences with actual content from the document
- Branches must cover genuinely DIFFERENT aspects of the document (no repetition)
- Leaves must be SPECIFIC concepts, not vague summaries
- Cross-links must connect truly RELATED concepts from different documents
- Generate the maximum number of branches (6) and leaves (5) for rich, dense maps
- Output ONLY the JSON — nothing else, no explanation`

    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
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
