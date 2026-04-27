import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { fileBase64, mimeType, fieldNames, plainText } = await req.json()

    // Plain-text path (CSV, DOCX pre-extracted text, etc.)
    if (plainText) {
      const client = new Anthropic({ apiKey })
      const fieldHint = fieldNames?.length
        ? `\n\nThe form has these fields — try to match extracted data to them:\n${(fieldNames as string[]).map((n: string) => `- ${n}`).join('\n')}`
        : ''
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: `You are a document reader that extracts personal information from text content.
Extract all readable personal data and return it as "Label: value" lines — one per line, nothing else.
Rules:
- Only include fields that are clearly present in the text
- Use clear, descriptive label names (Full Name, Date of Birth, Email, Phone, Address, etc.)
- The VALUE must be the raw data only — never embed the label inside the value
- Do not guess, invent, or fabricate any values`,
        messages: [{
          role: 'user',
          content: `Extract all personal information from this document text.${fieldHint}\n\nDocument text:\n${plainText}\n\nReturn one line per field:\nLabel: value`,
        }],
      })
      const extracted = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
      return Response.json({ extracted })
    }

    if (!fileBase64 || !mimeType) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const isImage = mimeType.startsWith('image/')
    const isPDF   = mimeType === 'application/pdf'

    if (!isImage && !isPDF) {
      return Response.json({ error: 'Only images (JPG, PNG, WebP) and PDFs are supported' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    const fieldHint = fieldNames?.length
      ? `\n\nThe form has these fields — try to match extracted data to them:\n${(fieldNames as string[]).map(n => `- ${n}`).join('\n')}`
      : ''

    const docBlock = isImage
      ? { type: 'image' as const, source: { type: 'base64' as const, media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', data: fileBase64 } }
      : { type: 'document' as const, source: { type: 'base64' as const, media_type: 'application/pdf' as const, data: fileBase64 } }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a document reader that extracts personal information from identity documents such as passports, driving licences, national ID cards, and similar documents.
Extract all readable personal data and return it as "Label: value" lines — one per line, nothing else.

Rules:
- Only include fields that are clearly visible or directly inferable from the document
- Use clear, descriptive label names (Full Name, Date of Birth, Passport Number, Father's Name, Mother's Name, Address, etc.)
- The VALUE must be the raw data only — never embed the label inside the value
  ✓ Correct:  "Full Name: JOHN SMITH"
  ✗ Wrong:    "Full Name: Full Name: JOHN SMITH"
- For dates, keep the exact format shown in the document
- Do not guess, invent, or fabricate any values
- Use the exact text visible on the document for values`,
      messages: [{
        role: 'user',
        content: [
          docBlock,
          {
            type: 'text',
            text: `Extract all personal information from this document.${fieldHint}\n\nReturn one line per field:\nLabel: value\nLabel: value\n...`,
          },
        ],
      }],
    })

    const extracted = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    return Response.json({ extracted })
  } catch (err: any) {
    console.error('Extract-doc error:', err?.message)
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
