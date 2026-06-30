import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserSubscription, checkAndIncrementUsage } from '@/lib/subscription'

export const maxDuration = 120

function extractJSON(raw: string): any {
  const m = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
  return JSON.parse(m ? m[1] : raw.trim())
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Sign in to use AI features' }, { status: 401 })
    const tier = await getUserSubscription(userId)
    if (tier === 'free') {
      const allowed = await checkAndIncrementUsage(userId, 5)
      if (!allowed) return Response.json({ error: 'Daily limit reached. Upgrade to Pro for unlimited access at /pricing' }, { status: 429 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { text, filename, slideCount } = await req.json() as {
      text: string; filename: string; slideCount: number
    }
    if (!text || text.trim().length < 20)
      return Response.json({ error: 'No readable text found in this PDF.' }, { status: 400 })

    const prompt = `You are a professional presentation designer. Convert the following PDF document into a structured PowerPoint presentation with exactly ${slideCount} slides (plus one title slide).

Document: "${filename}"

--- DOCUMENT TEXT ---
${text.slice(0, 55000)}
--- END ---

Create a compelling, well-structured presentation. Return ONLY a valid JSON object — no markdown, no explanation:

{
  "title": "Concise presentation title (max 8 words)",
  "subtitle": "One-line subtitle or document purpose",
  "slides": [
    {
      "title": "Slide title (max 6 words)",
      "bullets": [
        "Clear, concise bullet point with a key insight",
        "Another key point — be specific, not generic",
        "Third point with actual content from the document"
      ],
      "notes": "2-3 sentences of speaker notes expanding on this slide"
    }
  ]
}

Rules:
- Generate exactly ${slideCount} content slides (not counting the title slide)
- Each slide: 3–5 bullet points, each 8–15 words, punchy and informative
- Cover the document's key topics logically: intro → main points → conclusion
- Use real content from the document — no vague filler phrases
- Bullet points should be self-explanatory without reading the notes
- Title slide has no bullets — only title and subtitle
- Output ONLY the JSON object`

    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      'claude-opus-4-8',
      max_tokens: 8192,
      messages:   [{ role: 'user', content: prompt }],
    })

    const raw  = (msg.content[0] as any).text as string
    const data = extractJSON(raw)

    if (!data.slides || !Array.isArray(data.slides))
      return Response.json({ error: 'Failed to generate slide structure.' }, { status: 422 })

    return Response.json(data)
  } catch (e: any) {
    console.error('pdf-to-ppt error:', e)
    return Response.json({ error: e.message ?? 'Conversion failed' }, { status: 500 })
  }
}
