'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { DetectedField, FilledField } from './AutoFillModal'

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
  onApply: (filled: FilledField[]) => void
  onClose: () => void
  pageLabel?: string
}

let _idCounter = 0
const nextId = () => `cdoc-${++_idCounter}`

export default function ChatFillPanel({ fields, existingFilled = {}, pageImageBase64, onApply, onClose, pageLabel }: Props) {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [collected, setCollected] = useState<Record<string, string>>({ ...existingFilled })
  const [done, setDone] = useState(false)

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

  // ── Extract a single doc and inject extracted info into chat ──────────────
  const extractDoc = useCallback(async (docId: string, base64: string, mimeType: string, plainText?: string) => {
    syncDocs(docsRef.current.map(d => d.id === docId ? { ...d, status: 'extracting' as const } : d))
    try {
      const body: Record<string, any> = { fieldNames: fields.map(f => f.name) }
      if (plainText !== undefined) {
        body.plainText = plainText
      } else {
        body.fileBase64 = base64
        body.mimeType = mimeType
      }
      const res = await fetch('/api/extract-doc', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Extraction failed')
      const extracted: string = data.extracted ?? ''

      let updatedDocs: UploadedDoc[] = []
      setDocs(prev => {
        const next = prev.map(d => d.id === docId ? { ...d, status: 'done' as const, extracted } : d)
        docsRef.current = next
        updatedDocs = next
        return next
      })

      // Inject a system message into chat so AI knows about the doc
      const ctx = buildContext(updatedDocs)
      if (ctx.trim() && historyRef.current.length > 0) {
        const injectMsg: ChatMessage = {
          role: 'user',
          content: `[Document uploaded — here is the extracted information to use for filling the form:\n${ctx}\nPlease continue asking about any remaining unfilled fields using this information where applicable.]`,
        }
        const newHistory = [...historyRef.current, injectMsg]
        syncHistory(newHistory)
        await sendToAI(newHistory)
      }
    } catch (e: any) {
      setDocs(prev => {
        const next = prev.map(d => d.id === docId ? { ...d, status: 'error' as const, error: e.message } : d)
        docsRef.current = next
        return next
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

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
  const sendToAI = useCallback(async (msgs: ChatMessage[]) => {
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
        }),
      })

      const data = await res.json()
      if (data.error) {
        const errMsg: ChatMessage = { role: 'assistant', content: `Sorry, something went wrong: ${data.error}` }
        syncHistory([...msgs, errMsg])
        return
      }

      const aiMsg: ChatMessage = { role: 'assistant', content: data.message ?? '' }
      syncHistory([...msgs, aiMsg])

      if (data.extracted?.length) {
        const updated = { ...collectedRef.current }
        for (const { name, value } of data.extracted) {
          if (value !== undefined && value !== null) updated[name] = String(value)
        }
        syncCollected(updated)
      }

      if (data.done) setDone(true)
    } catch {
      const errMsg: ChatMessage = { role: 'assistant', content: 'Network error. Please try again.' }
      syncHistory([...msgs, errMsg])
    } finally {
      setLoading(false)
    }
  }, [fields, pageImageBase64])

  // Kick off conversation on mount
  useEffect(() => {
    if (startedRef.current || fields.length === 0) return
    startedRef.current = true
    const initMsg: ChatMessage = {
      role: 'user',
      content: 'Hello! Please start asking me about the form fields that need to be filled.',
    }
    sendToAI([initMsg])
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
            {/* Upload button */}
            <button
              title="Upload documents (PDF, JPG, PNG, CSV, DOCX…)"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 9px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.22)', color: '#fff',
                fontSize: 11, fontWeight: 700,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
              {docs.length > 0 && (
                <span style={{
                  background: docsExtracting ? 'rgba(255,255,255,0.4)' : '#fff',
                  color: docsExtracting ? '#fff' : '#0ea5e9',
                  borderRadius: 10, padding: '0 5px', fontSize: 10, fontWeight: 800,
                }}>
                  {docs.length}
                </span>
              )}
            </button>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
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

        {/* Docs strip */}
        {docs.length > 0 && (
          <div style={{
            background: '#f0f9ff', borderBottom: '1px solid #bae6fd',
            padding: '8px 12px', flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#0369a1', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Uploaded documents
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {docs.map(doc => (
                <div key={doc.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#fff', borderRadius: 8, padding: '5px 8px',
                  border: `1px solid ${doc.status === 'error' ? '#fca5a5' : doc.status === 'done' ? '#86efac' : '#bae6fd'}`,
                }}>
                  <div style={{ fontSize: 16, flexShrink: 0 }}>
                    {doc.status === 'extracting' ? '⏳' : doc.status === 'error' ? '❌' : '✅'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.fileName || 'Uploading…'}
                    </div>
                    {doc.status === 'extracting' && (
                      <div style={{ fontSize: 10, color: '#0ea5e9' }}>Extracting info…</div>
                    )}
                    {doc.status === 'error' && (
                      <div style={{ fontSize: 10, color: '#dc2626' }}>{doc.error}</div>
                    )}
                    {doc.status === 'done' && (
                      <input
                        value={doc.description}
                        onChange={e => setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, description: e.target.value } : d))}
                        placeholder="Label (e.g. my passport)"
                        style={{
                          fontSize: 10, border: 'none', outline: 'none', background: 'transparent',
                          color: '#64748b', width: '100%', fontFamily: 'inherit',
                        }}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => setDocs(prev => { const next = prev.filter(d => d.id !== doc.id); docsRef.current = next; return next })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, fontSize: 13, flexShrink: 0 }}
                  >×</button>
                </div>
              ))}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                marginTop: 6, width: '100%', padding: '5px 0', border: '1.5px dashed #7dd3fc',
                borderRadius: 7, background: 'transparent', color: '#0ea5e9', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Add another document
            </button>
          </div>
        )}

        {/* Drop hint when no docs */}
        {docs.length === 0 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              margin: '8px 12px 0', padding: '7px 10px',
              border: '1.5px dashed #7dd3fc', borderRadius: 9,
              background: '#f0f9ff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0369a1' }}>Upload documents for faster fill</div>
              <div style={{ fontSize: 10, color: '#7dd3fc' }}>PDF · JPG · PNG · CSV · DOCX — or drag & drop</div>
            </div>
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
               !m.content.startsWith('[Document uploaded')))
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

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '10px 12px', background: '#fafafa', flexShrink: 0 }}>
          {done || unfilled.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                {unfilled.length === 0 ? 'All fields collected!' : 'Chat ended.'}
              </div>
              <button
                onClick={handleApply}
                style={{
                  width: '100%', padding: '9px 0', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                  color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 10,
                  boxShadow: '0 2px 8px rgba(14,165,233,0.35)',
                }}
              >
                Apply {filledCount} field{filledCount !== 1 ? 's' : ''} to PDF
              </button>
            </div>
          ) : (
            <>
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
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: input.trim() && !loading ? 'linear-gradient(135deg,#0ea5e9,#38bdf8)' : '#e2e8f0',
                    color: input.trim() && !loading ? '#fff' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s', flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              {filledCount > 0 && (
                <button
                  onClick={handleApply}
                  style={{
                    marginTop: 6, width: '100%', padding: '7px 0', border: 'none', cursor: 'pointer',
                    background: 'transparent', borderRadius: 8,
                    color: '#0ea5e9', fontSize: 12, fontWeight: 700,
                    borderTop: '1px solid #e2e8f0',
                  }}
                >
                  Apply {filledCount} collected field{filledCount !== 1 ? 's' : ''} now →
                </button>
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
    </div>
  )
}
