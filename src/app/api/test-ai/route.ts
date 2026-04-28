import Anthropic from '@anthropic-ai/sdk'

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  const keyPreview = apiKey ? `${apiKey.slice(0, 20)}...` : 'NOT FOUND'

  if (!apiKey) {
    return Response.json({ ok: false, error: `No API key in env. Found: ${keyPreview}` })
  }

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 30,
      messages: [{ role: 'user', content: 'Reply with just: works' }],
    })
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return Response.json({ ok: true, response: text, keyPreview })
  } catch (err: any) {
    return Response.json({
      ok: false,
      error: err.message,
      httpStatus: err.status,
      keyPreview,
    })
  }
}
