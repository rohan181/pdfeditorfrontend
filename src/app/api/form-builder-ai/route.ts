import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

function extractJSON(raw: string): any | null {
  let s = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  try { return JSON.parse(s) } catch {}
  const start = s.indexOf('{')
  const end   = s.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try { return JSON.parse(s.slice(start, end + 1)) } catch {}
  }
  return null
}

const SYSTEM = `You are an AI form builder assistant embedded in a PDF form builder tool.
The user will describe a form they want to create or modify. You generate form fields accordingly.

ALWAYS respond with a raw JSON object (no markdown, no code fences):
{
  "message": "Friendly description of what you created/did",
  "action": "replace" | "add" | "none",
  "fields": []
}

action meanings:
- "replace": clear all existing fields, create new ones from scratch
- "add": add new fields to the existing form
- "none": just chat/clarify, no field changes (fields must be [])

Each field object in "fields":
{
  "type": "text"|"multiline"|"checkbox"|"dropdown"|"date"|"number"|"signature"|"radio"|"checkgroup",
  "label": "Label text",
  "placeholder": "hint text",
  "required": false,
  "options": [],
  "radioLayout": "vertical",
  "labelPosition": "top",
  "x": 0.08,
  "y": 0.07,
  "w": 0.38,
  "h": 0.038,
  "borderStyle": "box",
  "labelColor": "#374151",
  "labelFontSize": 11,
  "labelBold": false,
  "fieldTextColor": "#111111",
  "fieldFont": "helvetica",
  "fieldFontSize": 12,
  "sigLineColor": "#374151",
  "sigLineStyle": "solid",
  "sigShowIcon": true,
  "sigPromptText": "Sign here"
}

Standard field sizes (w x h):
- text: 0.38 x 0.038
- multiline: 0.55 x 0.10
- signature: 0.40 x 0.055
- checkbox: 0.03 x 0.03
- radio: 0.35 x 0.08
- checkgroup: 0.35 x 0.08
- dropdown: 0.28 x 0.038
- date: 0.22 x 0.038
- number: 0.18 x 0.038

Layout rules:
- Start at y=0.05, x=0.08
- labelPosition "top" needs ~0.05 extra vertical gap above the field for the label; increment y by h + 0.06 between fields
- Side-by-side pair: first at x=0.08, second at x=0.52 (same y row)
- Signature usually goes near the bottom at y≈0.82
- Keep x+w ≤ 0.95 and y+h ≤ 0.93
- radio/checkgroup: options[] should have 2–5 items; h scales automatically in the app

Common form examples:
- Job application: Full Name (text), Email (text), Phone (text), Position Applied For (dropdown), Start Date (date), Cover Letter (multiline), Signature (signature)
- Contact form: Name (text), Email (text), Subject (text), Message (multiline)
- Registration: First Name + Last Name side-by-side (text), Email (text), DOB (date), Gender (radio), Terms (checkbox)
- Survey: rating (radio 1–5), feedback (multiline), recommendation (radio yes/no/maybe)
- Invoice: Company Name (text), Invoice # (number), Date (date), Description (multiline), Amount (number), Signature (signature)

Be creative, precise, and friendly. Explain what you've built clearly.`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

    const { history } = await req.json() as {
      history: { role: 'user' | 'assistant'; content: string }[]
    }

    const client = new Anthropic({ apiKey })

    const messages = history.map(h => ({ role: h.role, content: h.content }))

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM,
      messages,
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const parsed = extractJSON(raw)

    if (parsed && typeof parsed.message === 'string') {
      return Response.json({
        message: parsed.message,
        action: parsed.action ?? 'none',
        fields: Array.isArray(parsed.fields) ? parsed.fields : [],
      })
    }

    return Response.json({
      message: raw || "I couldn't process that. Try describing the form you need.",
      action: 'none',
      fields: [],
    })
  } catch (err: any) {
    console.error('form-builder-ai error:', err?.message)
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
