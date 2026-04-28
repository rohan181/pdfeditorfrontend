'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { DetectedField, FilledField } from './AutoFillModal'
import SignatureModal from './SignatureModal'

// Strip any raw JSON that leaks into displayed messages
function sanitizeMsg(text: string): string {
  return text
    .replace(/^```[\s\S]*?```$/gm, '')   // code fences
    .replace(/\{[\s\S]{0,800}\}/g, '')    // JSON objects
    .replace(/\[[\s\S]{0,400}\]/g, '')    // JSON arrays
    .trim()
}

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

interface UploadedDoc {
  id: string
  fileName: string
  base64: string
  mimeType: string
  description: string
  extracted: string
  status: 'idle' | 'extracting' | 'done' | 'error'
  error?: string
}

interface Props {
  fields: DetectedField[]
  existingFilled?: Record<string, string>
  pageImageBase64?: string
  pdfDocBase64?: string
  onApply: (filled: FilledField[]) => void
  onClose: () => void
  pageLabel?: string
}

let _idCounter = 0
const nextId = () => `cdoc-${++_idCounter}`

export default function ChatFillPanel({ fields, existingFilled = {}, pageImageBase64, pdfDocBase64, onApply, onClose, pageLabel }: Props) {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [collected, setCollected] = useState<Record<string, string>>({ ...existingFilled })
  const [done, setDone] = useState(false)

  // Signature
  const [pendingSigField, setPendingSigField] = useState<string | null>(null)
  const [showSigModal, setShowSigModal] = useState(false)
  const [savedSignature, setSavedSignature] = useState<string | null>(null)

  // Document upload state
  const [docs, setDocs] = useState<UploadedDoc[]>([])
  const [showDocs, setShowDocs] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const historyRef = useRef<ChatMessage[]>([])
  const collectedRef = useRef<Record<string, string>>({ ...existingFilled })
  const docsRef = useRef<UploadedDoc[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  const filledCount = Object.keys(collected).filter(k => collected[k] !== '').length
  const totalFields = fields.length

  function syncHistory(msgs: ChatMessage[]) { historyRef.current = msgs; setHistory(msgs) }
  function syncCollected(vals: Record<string, string>) { collectedRef.current = vals; setCollected(vals) }
  function syncDocs(d: UploadedDoc[]) { docsRef.current = d; setDocs(d) }

  function buildContext(docList: UploadedDoc[]) {
    return docList
      .filter(d => d.status === 'done' && d.extracted)
      .map(d => `=== Document: ${d.description.trim() || d.fileName} ===\n${d.extracted}`)
      .join('\n\n')
  }

  // ── Extract doc → auto-fill matched fields → show in chat ────────────────
  const extractDoc = useCallback(async (docId: string, base64: string, mimeType: string, plainText?: string) => {
    syncDocs(docsRef.current.map(d => d.id === docId ? { ...d, status: 'extracting' as const } : d))

    // Show "analysing" bubble immediately
    setLoading(true)
    try {
      // Step 1 — extract raw info from the document
      const extractBody: Record<string, any> = { fieldNames: fields.map(f => f.name) }
      if (plainText !== undefined) { extractBody.plainText = plainText }
      else { extractBody.fileBase64 = base64; extractBody.mimeType = mimeType }

      const extractRes = await fetch('/api/extract-doc', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractBody),
      })
      const extractData = await extractRes.json()
      if (!extractRes.ok) throw new Error(extractData.error || 'Extraction failed')
      const extracted: string = extractData.extracted ?? ''

      setDocs(prev => {
        const next = prev.map(d => d.id === docId ? { ...d, status: 'done' as const, extracted } : d)
        docsRef.current = next
        return next
      })

      if (!extracted.trim() || fields.length === 0) {
        const noDataMsg: ChatMessage = { role: 'assistant', content: 'I read the document but couldn\'t find any personal information to match against form fields.' }
        syncHistory([...historyRef.current, noDataMsg])
        return
      }

      // Step 2 — auto-fill fields using the extracted text
      const fillBody: Record<string, any> = { fields, userContext: extracted }
      if (pageImageBase64) fillBody.pageImageBase64 = pageImageBase64
      const fillRes = await fetch('/api/autofill', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fillBody),
      })
      const fillData = await fillRes.json()

      // Step 3 — update collected values and show a summary bubble
      const newCollected = { ...collectedRef.current }
      const filledLines: string[] = []

      if (fillData.filled?.length) {
        for (const { name, value } of fillData.filled as { name: string; value: string }[]) {
          if (value?.trim()) {
            newCollected[name] = value
            filledLines.push(`• ${name}: ${value}`)
          }
        }
      }
      syncCollected(newCollected)

      const docLabel = docsRef.current.find(d => d.id === docId)?.description.trim()
        || docsRef.current.find(d => d.id === docId)?.fileName
        || 'document'

      const summaryMsg: ChatMessage = {
        role: 'assistant',
        content: filledLines.length > 0
          ? `I read your ${docLabel} and filled ${filledLines.length} field${filledLines.length !== 1 ? 's' : ''}:\n${filledLines.join('\n')}`
          : `I read your ${docLabel} but couldn't confidently match any values to the form fields.`,
      }

      // Step 4 — check remaining unfilled fields and ask about them
      const stillUnfilled = fields.filter(f => !newCollected[f.name] || newCollected[f.name] === '')

      if (stillUnfilled.length > 0) {
        const continueUserMsg: ChatMessage = {
          role: 'user',
          content: `[SYSTEM: Document processed. Fields filled: ${filledLines.length}. Still unfilled: ${stillUnfilled.map(f => f.name).join(', ')}. Continue asking the user about remaining unfilled fields.]`,
        }
        const nextHistory = [...historyRef.current, summaryMsg, continueUserMsg]
        syncHistory(nextHistory)
        await sendToAI(nextHistory)
      } else {
        syncHistory([...historyRef.current, summaryMsg])
        setDone(true)
      }
    } catch (e: any) {
      setDocs(prev => {
        const next = prev.map(d => d.id === docId ? { ...d, status: 'error' as const, error: e.message } : d)
        docsRef.current = next
        return next
      })
      const errMsg: ChatMessage = { role: 'assistant', content: `Failed to read document: ${e.message}` }
      syncHistory([...historyRef.current, errMsg])
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, pageImageBase64])

  // ── Process a dropped / picked file ──────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    const SUPPORTED_VISION = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    const SUPPORTED_TEXT   = [
      'text/csv', 'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/msword', // doc
    ]
    const allSupported = [...SUPPORTED_VISION, ...SUPPORTED_TEXT]

    if (!allSupported.includes(file.type)) {
      alert(`Unsupported file type "${file.type}". Supported: PDF, JPG, PNG, WebP, CSV, DOCX, DOC, TXT`)
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large — max 10 MB')
      return
    }

    const id = nextId()
    const newDoc: UploadedDoc = {
      id, fileName: file.name, base64: '', mimeType: file.type,
      description: '', extracted: '', status: 'idle',
    }
    setDocs(prev => { const next = [...prev, newDoc]; docsRef.current = next; return next })
    setShowDocs(true)

    if (SUPPORTED_TEXT.includes(file.type)) {
      // Read as text
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'application/msword') {
        // Use mammoth for DOCX
        try {
          const mammoth = (await import('mammoth')).default
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({ arrayBuffer })
          setDocs(prev => {
            const next = prev.map(d => d.id === id ? { ...d, fileName: file.name, status: 'extracting' as const } : d)
            docsRef.current = next
            return next
          })
          await extractDoc(id, '', file.type, result.value)
        } catch (err: any) {
          setDocs(prev => {
            const next = prev.map(d => d.id === id ? { ...d, status: 'error' as const, error: err.message } : d)
            docsRef.current = next
            return next
          })
        }
      } else {
        // CSV / TXT — read as text
        const text = await file.text()
        setDocs(prev => {
          const next = prev.map(d => d.id === id ? { ...d, fileName: file.name, status: 'extracting' as const } : d)
          docsRef.current = next
          return next
        })
        await extractDoc(id, '', file.type, text)
      }
    } else {
      // Images / PDF — read as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setDocs(prev => {
        const next = prev.map(d => d.id === id ? { ...d, fileName: file.name, base64, mimeType: file.type, status: 'extracting' as const } : d)
        docsRef.current = next
        return next
      })
      await extractDoc(id, base64, file.type)
    }
  }, [extractDoc])

  // ── AI conversation ───────────────────────────────────────────────────────
  const sendToAI = useCallback(async (msgs: ChatMessage[], isFirstMessage = false) => {
    setLoading(true)
    try {
      const fieldsWithValues = fields.map(f => ({
        name: f.name, type: f.type,
        value: collectedRef.current[f.name] || '',
      }))

      const res = await fetch('/api/chat-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: msgs,
          fields: fieldsWithValues,
          pageImageBase64: pageImageBase64 || null,
          // Send full PDF only on the first message so Claude reads the whole document
          pdfDocBase64: isFirstMessage && pdfDocBase64 ? pdfDocBase64 : null,
        }),
      })

      const data = await res.json()
      if (data.error) {
        const errMsg: ChatMessage = { role: 'assistant', content: `Sorry, something went wrong: ${data.error}` }
        syncHistory([...msgs, errMsg])
        return
      }

      const aiMsg: ChatMessage = { role: 'assistant', content: sanitizeMsg(data.message ?? '') }
      syncHistory([...msgs, aiMsg])

      if (data.extracted?.length) {
        const updated = { ...collectedRef.current }
        const newlyExtracted: FilledField[] = []
        for (const { name, value } of data.extracted) {
          const v = String(value ?? '')
          // Skip empty-string extractions for signature fields (they'll be drawn)
          if (v === '' && data.signatureField === name) continue
          if (value !== undefined && value !== null && v !== '') {
            updated[name] = v
            newlyExtracted.push({ name, value: v })
          }
        }
        syncCollected(updated)
        // Apply each extracted field to the PDF immediately
        if (newlyExtracted.length) onApply(newlyExtracted)
      }

      // Signature field requested — prompt user to sign
      if (data.signatureField) {
        setPendingSigField(data.signatureField)
        setShowSigModal(true)
      }

      if (data.done) setDone(true)
    } catch {
      const errMsg: ChatMessage = { role: 'assistant', content: 'Network error. Please try again.' }
      syncHistory([...msgs, errMsg])
    } finally {
      setLoading(false)
    }
  }, [fields, pageImageBase64, pdfDocBase64])

  // Kick off conversation on mount
  useEffect(() => {
    if (startedRef.current || fields.length === 0) return
    startedRef.current = true
    const initMsg: ChatMessage = {
      role: 'user',
      content: 'Hello! Please start asking me about the form fields that need to be filled.',
    }
    sendToAI([initMsg], true)
    historyRef.current = [initMsg]
    setHistory([initMsg])
  }, [fields, sendToAI])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: text }
    const newHistory = [...historyRef.current, userMsg]
    syncHistory(newHistory)
    await sendToAI(newHistory)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function handleSignatureApply(dataUrl: string) {
    setSavedSignature(dataUrl)
    setShowSigModal(false)
    if (!pendingSigField) return

    const fieldName = pendingSigField

    // Store the signature data URL in collected
    const updated = { ...collectedRef.current, [fieldName]: dataUrl }
    syncCollected(updated)

    // Apply signature to PDF immediately so the user sees it placed right away
    onApply([{ name: fieldName, value: dataUrl }])

    // Inject confirmation into chat and continue
    const sigMsg: ChatMessage = { role: 'assistant', content: `Signature placed for "${fieldName}".` }
    const confirmUser: ChatMessage = {
      role: 'user',
      content: `[SYSTEM: Signature provided for field "${fieldName}". Continue with remaining unfilled fields.]`,
    }
    const next = [...historyRef.current, sigMsg, confirmUser]
    syncHistory(next)
    setPendingSigField(null)
    sendToAI(next)
  }

  function handleApply() {
    const filled: FilledField[] = Object.entries(collected)
      .filter(([, v]) => v !== '')
      .map(([name, value]) => ({ name, value }))
    onApply(filled)
    onClose()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const unfilled = fields.filter(f => !collected[f.name] || collected[f.name] === '')
  const docsExtracting = docs.some(d => d.status === 'extracting')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
      pointerEvents: 'none',
    }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', pointerEvents: 'all' }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'relative', pointerEvents: 'all',
          width: 390, height: '85vh', maxHeight: 720,
          background: '#fff', borderRadius: '16px 16px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', margin: '0 24px',
          animation: 'slideUpPanel 0.22s ease-out',
        }}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Drag-over overlay */}
        {dragOver && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(14,165,233,0.12)',
            border: '3px dashed #0ea5e9', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0ea5e9' }}>Drop file to upload</div>
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 14px 10px',
          background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
          color: '#fff', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>AI Chat Fill</div>
              {pageLabel && <div style={{ fontSize: 10, opacity: 0.8 }}>{pageLabel}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 20,
            }}>
              {filledCount}/{totalFields}
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 2, opacity: 0.8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: '#e0f2fe', flexShrink: 0 }}>
          <div style={{
            height: '100%', background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
            width: `${totalFields > 0 ? (filledCount / totalFields) * 100 : 0}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Uploaded docs list (above input) */}
        {docs.length > 0 && (
          <div style={{ background: '#f0f9ff', borderTop: '1px solid #bae6fd', padding: '6px 12px', flexShrink: 0 }}>
            {docs.map(doc => (
              <div key={doc.id} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '4px 0', borderBottom: '1px solid #e0f2fe',
              }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>
                  {doc.status === 'extracting' ? '⏳' : doc.status === 'error' ? '❌' : '✅'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0369a1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.fileName}
                  </div>
                  {doc.status === 'extracting' && <div style={{ fontSize: 10, color: '#7dd3fc' }}>Reading document…</div>}
                  {doc.status === 'error' && <div style={{ fontSize: 10, color: '#dc2626' }}>{doc.error}</div>}
                  {doc.status === 'done' && (
                    <input value={doc.description} onChange={e => setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, description: e.target.value } : d))}
                      placeholder="Label (e.g. my passport)"
                      style={{ fontSize: 10, border: 'none', outline: 'none', background: 'transparent', color: '#64748b', width: '100%', fontFamily: 'inherit' }} />
                  )}
                </div>
                <button onClick={() => setDocs(prev => { const next = prev.filter(d => d.id !== doc.id); docsRef.current = next; return next })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14, padding: '0 2px', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '10px 12px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {history
            .filter(m => m.role === 'assistant' ||
              (m.role === 'user' &&
               !m.content.startsWith('Hello! Please start') &&
               !m.content.startsWith('[Document uploaded') &&
               !m.content.startsWith('[SYSTEM:')))
            .map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginRight: 6, marginTop: 2,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  </div>
                )}
                <div style={{
                  maxWidth: '76%', padding: '8px 11px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#0ea5e9,#38bdf8)' : '#f1f5f9',
                  color: msg.role === 'user' ? '#fff' : '#1e293b',
                  fontSize: 12.5, lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div style={{
                padding: '8px 14px', background: '#f1f5f9', borderRadius: '12px 12px 12px 2px',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#94a3b8',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Collected values */}
          {filledCount > 0 && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
              padding: '8px 10px', marginTop: 4,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#15803d', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Collected so far
              </div>
              {Object.entries(collected).filter(([, v]) => v !== '').map(([k, v]) => (
                <div key={k} style={{ fontSize: 11, color: '#166534', display: 'flex', gap: 4, marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, flexShrink: 0 }}>{k}:</span>
                  <span style={{ opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Sign Here button when AI requests a signature */}
          {pendingSigField && !showSigModal && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 4 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#fdf4ff', border: '1.5px dashed #a855f7',
                borderRadius: 12, padding: '10px 14px',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 19l7-7-3-3-7 7v3h3z"/><path d="M18 5l1 1-9.5 9.5"/><path d="M5 21h14"/>
                </svg>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#7e22ce' }}>{pendingSigField}</div>
                  <div style={{ fontSize: 10.5, color: '#a855f7' }}>Signature required</div>
                </div>
                <button
                  onClick={() => setShowSigModal(true)}
                  style={{
                    padding: '6px 14px', border: 'none', borderRadius: 20, cursor: 'pointer',
                    background: 'linear-gradient(135deg,#a855f7,#c084fc)',
                    color: '#fff', fontSize: 12, fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(168,85,247,0.35)',
                  }}
                >
                  Sign Here
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '10px 12px', background: '#fafafa', flexShrink: 0 }}>
          {done || unfilled.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                {unfilled.length === 0 ? `All ${filledCount} fields applied to PDF!` : 'Chat ended — fields applied.'}
              </div>
              <button onClick={onClose} style={{
                width: '100%', padding: '9px 0', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 10,
                boxShadow: '0 2px 8px rgba(14,165,233,0.35)',
              }}>
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Upload hint */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: 8, padding: '6px 10px',
                background: '#f0f9ff', borderRadius: 9, border: '1.5px dashed #7dd3fc',
                cursor: 'pointer',
              }} onClick={() => fileInputRef.current?.click()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0369a1' }}>Attach document to auto-fill</span>
                  <span style={{ fontSize: 10.5, color: '#7dd3fc', marginLeft: 6 }}>PDF · JPG · PNG · CSV · DOCX</span>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px',
                  background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                  color: '#fff', borderRadius: 20,
                }}>+ Upload</span>
              </div>

              {/* Text input row — hidden while waiting for signature */}
              {pendingSigField ? (
                <button
                  onClick={() => setShowSigModal(true)}
                  style={{
                    width: '100%', padding: '9px 0', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#a855f7,#c084fc)',
                    color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 10,
                    boxShadow: '0 2px 8px rgba(168,85,247,0.3)',
                  }}
                >
                  ✍️ Open Signature Pad
                </button>
              ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  placeholder="Type your answer… (Enter to send)"
                  rows={2}
                  style={{
                    flex: 1, resize: 'none', border: '1.5px solid #e2e8f0', borderRadius: 10,
                    padding: '7px 10px', fontSize: 12.5, fontFamily: 'inherit',
                    outline: 'none', background: '#fff', color: '#1e293b', lineHeight: 1.5,
                  }}
                />
                <button onClick={handleSend} disabled={loading || !input.trim()} style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: input.trim() && !loading ? 'linear-gradient(135deg,#0ea5e9,#38bdf8)' : '#e2e8f0',
                  color: input.trim() && !loading ? '#fff' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s', flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              )}

            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.csv,.txt,.docx,.doc"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) processFile(file)
            e.target.value = ''
          }}
        />
      </div>

      <style>{`
        @keyframes slideUpPanel {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Signature modal — stop ALL event propagation so touches don't reach ChatFillPanel's backdrop */}
      {showSigModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'all' }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => e.stopPropagation()}
          onTouchMove={e => e.stopPropagation()}
        >
          <SignatureModal
            onApply={handleSignatureApply}
            onClose={() => { setShowSigModal(false); setPendingSigField(null) }}
            savedSignature={savedSignature}
          />
        </div>
      )}
    </div>
  )
}
