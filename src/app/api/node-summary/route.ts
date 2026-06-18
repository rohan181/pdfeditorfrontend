import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { nodeLabel, nodeType, sourceText, sourceName } = await req.json() as {
      nodeLabel: string
      nodeType: string
      sourceText: string
      sourceName: string
    }

    const context = sourceText
      ? `The topic comes from a document titled "${sourceName}".\n\nDocument excerpt:\n${sourceText.slice(0, 12000)}`
      : `This is the central theme of the mind map.`

    const prompt = `You are summarising a specific topic from a document for a mind-map viewer.

Topic: "${nodeLabel}" (type: ${nodeType})
${context}

Write a SHORT, CLEAR summary of "${nodeLabel}" in 2–4 sentences. Focus only on what this specific topic means in the context of the document. Be concrete — mention key facts, figures, methods, or findings. Do not use generic filler phrases. Output only the summary text, nothing else.`

    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      'claude-opus-4-8',
      max_tokens: 300,
      messages:   [{ role: 'user', content: prompt }],
    })

    const summary = (msg.content[0] as any).text as string
    return Response.json({ summary: summary.trim() })
  } catch (e: any) {
    console.error('node-summary error:', e)
    return Response.json({ error: e.message ?? 'Failed to generate summary' }, { status: 500 })
  }
}
