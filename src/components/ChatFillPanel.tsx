'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { DetectedField, FilledField } from './AutoFillModal'

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

interface Props {
  fields: DetectedField[]
  existingFilled?: Record<string, string>
  pageImageBase64?: string
  onApply: (filled: FilledField[]) => void
  onClose: () => void
  pageLabel?: string
}

export default function ChatFillPanel({ fields, existingFilled = {}, pageImageBase64, onApply, onClose, pageLabel }: Props) {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [collected, setCollected] = useState<Record<string, string>>({ ...existingFilled })
  const [done, setDone] = useState(false)

  const historyRef = useRef<ChatMessage[]>([])
  const collectedRef = useRef<Record<string, string>>({ ...existingFilled })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const startedRef = useRef(false)

  const filledCount = Object.keys(collected).filter(k => collected[k] !== '').length
  const totalFields = fields.length

  function syncHistory(msgs: ChatMessage[]) {
    historyRef.current = msgs
    setHistory(msgs)
  }

  function syncCollected(vals: Record<string, string>) {
    collectedRef.current = vals
    setCollected(vals)
  }

  const sendToAI = useCallback(async (msgs: ChatMessage[]) => {
    setLoading(true)
    try {
      const fieldsWithValues = fields.map(f => ({
        name: f.name,
        type: f.type,
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
    } catch (err: any) {
      const errMsg: ChatMessage = { role: 'assistant', content: 'Network error. Please try again.' }
      syncHistory([...msgs, errMsg])
    } finally {
      setLoading(false)
    }
  }, [fields, pageImageBase64])

  // Kick off the conversation
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleApply() {
    const filled: FilledField[] = Object.entries(collected)
      .filter(([, v]) => v !== '')
      .map(([name, value]) => ({ name, value }))
    onApply(filled)
    onClose()
  }

  const unfilled = fields.filter(f => !collected[f.name] || collected[f.name] === '')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
      pointerEvents: 'none',
    }}>
      {/* Backdrop (click to close) */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', pointerEvents: 'all' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div style={{
        position: 'relative', pointerEvents: 'all',
        width: 380, height: '80vh', maxHeight: 680,
        background: '#fff', borderRadius: '16px 16px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        margin: '0 24px',
        animation: 'slideUpPanel 0.22s ease-out',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 10px',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg,#6366f1,#818cf8)',
          color: '#fff',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>AI Chat Fill</div>
              {pageLabel && <div style={{ fontSize: 10, opacity: 0.8 }}>{pageLabel}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.2)',
              padding: '2px 8px', borderRadius: 20,
            }}>
              {filledCount}/{totalFields} filled
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 2, opacity: 0.8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: '#e2e8f0', flexShrink: 0 }}>
          <div style={{
            height: '100%', background: 'linear-gradient(90deg,#6366f1,#818cf8)',
            width: `${totalFields > 0 ? (filledCount / totalFields) * 100 : 0}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {history.filter(m => m.role === 'assistant' || (m.role === 'user' && !m.content.startsWith('Hello! Please start'))).map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: 6, marginTop: 2,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/>
                  </svg>
                </div>
              )}
              <div style={{
                maxWidth: '75%',
                padding: '8px 11px',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.role === 'user' ? 'linear-gradient(135deg,#6366f1,#818cf8)' : '#f1f5f9',
                color: msg.role === 'user' ? '#fff' : '#1e293b',
                fontSize: 12.5,
                lineHeight: 1.55,
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
                width: 24, height: 24, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/>
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

          {/* Collected values preview */}
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
        <div style={{
          borderTop: '1px solid #e2e8f0', padding: '10px 12px',
          background: '#fafafa', flexShrink: 0,
        }}>
          {done || unfilled.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                {unfilled.length === 0 ? 'All fields collected!' : 'Chat ended.'}
              </div>
              <button
                onClick={handleApply}
                style={{
                  width: '100%', padding: '9px 0', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                  color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 10,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
                }}
              >
                Apply {filledCount} field{filledCount !== 1 ? 's' : ''} to PDF
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
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
                    background: input.trim() && !loading ? 'linear-gradient(135deg,#6366f1,#818cf8)' : '#e2e8f0',
                    color: input.trim() && !loading ? '#fff' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                    flexShrink: 0,
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
                    color: '#6366f1', fontSize: 12, fontWeight: 700,
                    borderTop: '1px solid #e2e8f0',
                  }}
                >
                  Apply {filledCount} collected field{filledCount !== 1 ? 's' : ''} now →
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUpPanel {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
