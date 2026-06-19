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

    const { text, filename, questionCount, questionType, difficulty } = await req.json() as {
      text: string; filename: string
      questionCount: number; questionType: 'mcq' | 'short' | 'mixed'; difficulty: 'easy' | 'medium' | 'hard'
    }

    if (!text || text.trim().length < 30)
      return Response.json({ error: 'Not enough text in this PDF.' }, { status: 400 })

    const typeMap = {
      mcq:   `All ${questionCount} questions must be multiple-choice (type: "mcq") with exactly 4 options each.`,
      short: `All ${questionCount} questions must be short-answer (type: "short") requiring a written response.`,
      mixed: `Mix: approximately half multiple-choice (type: "mcq") and half short-answer (type: "short").`,
    }

    const diffMap = {
      easy:   'Focus on straightforward factual recall — names, dates, simple definitions.',
      medium: 'Focus on understanding and application — "why", "how", comparisons, cause and effect.',
      hard:   'Focus on analysis and synthesis — inferences, edge cases, nuanced distinctions, implications.',
    }

    const prompt = `You are an expert quiz creator and educator. Create a high-quality quiz from the document below.

Document: "${filename}"
Questions: ${questionCount}
Type: ${typeMap[questionType]}
Difficulty: ${diffMap[difficulty]}

--- DOCUMENT TEXT ---
${text.slice(0, 55000)}
--- END ---

Return ONLY a valid JSON object — no markdown, no explanation:

{
  "title": "Concise quiz title based on document content (max 8 words)",
  "questions": [
    {
      "type": "mcq",
      "question": "Clear, specific question drawn from document content?",
      "options": ["First option", "Second option", "Third option", "Fourth option"],
      "answer": "First option",
      "explanation": "1-2 sentences explaining why this is correct and why others are wrong."
    },
    {
      "type": "short",
      "question": "Open-ended question requiring a paragraph-length explanation?",
      "answer": "Model answer: 2-4 clear sentences covering the key points.",
      "explanation": "Key concepts the answer should address."
    }
  ]
}

Rules:
- Generate exactly ${questionCount} questions
- For MCQ: "answer" must be an EXACT copy of one of the strings in "options"
- Questions must be clearly grounded in the document — no invented facts
- Vary question styles: don't repeat the same phrasing pattern
- Short answers should require thinking, not just look-up
- All options for MCQ should be plausible (avoid obviously wrong distractors)
- Output ONLY the JSON object`

    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      'claude-opus-4-8',
      max_tokens: 8192,
      messages:   [{ role: 'user', content: prompt }],
    })

    const raw  = (msg.content[0] as any).text as string
    const data = extractJSON(raw)

    if (!data.questions || !Array.isArray(data.questions))
      return Response.json({ error: 'Failed to generate questions.' }, { status: 422 })

    return Response.json(data)
  } catch (e: any) {
    console.error('quiz-gen error:', e)
    return Response.json({ error: e.message ?? 'Generation failed' }, { status: 500 })
  }
}
