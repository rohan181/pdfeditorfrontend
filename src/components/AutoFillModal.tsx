'use client'
import { useState } from 'react'

export interface DetectedField {
  name: string
  type: string        // 'text' | 'char_box' | 'checkbox' | 'dropdown'
  rect: [number, number, number, number]  // [x1, y1, x2, y2] in PDF units
  pageNum: number
  pageHeight: number
  maxLen?: number     // number of cells in a comb/char-box field
  isComb?: boolean    // true when PDF comb flag is set
}

export interface FilledField {
  name: string
  value: string
}

interface Props {
  fields: DetectedField[]
  onApply: (filled: FilledField[]) => void
  onClose: () => void
}

export default function AutoFillModal({ fields, onApply, onClose }: Props) {
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<FilledField[] | null>(null)
  const [error, setError] = useState('')
  const [testResult, setTestResult] = useState('')
  const [testLoading, setTestLoading] = useState(false)

  const handleTestAPI = async () => {
    setTestLoading(true); setTestResult('')
    try {
      const res = await fetch('/api/test-ai')
      const data = await res.json()
      if (data.ok) {
        setTestResult(`✅ ${data.response} (key: ${data.keyPreview})`)
      } else {
        setTestResult(`❌ ${data.error} | key read: ${data.keyPreview}`)
      }
    } catch (e: any) {
      setTestResult('❌ ' + e.message)
    } finally {
      setTestLoading(false)
    }
  }

  const handleFill = async () => {
    if (!context.trim()) { setError('Please describe yourself or paste your information.'); return }
    setError(''); setLoading(true); setPreview(null)
    try {
      const res = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, userContext: context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setPreview(data.filled.filter((f: FilledField) => f.value.trim()))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const hasFields = fields.length > 0

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, padding: '26px 28px',
        width: '100%', maxWidth: 520,
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M18 2v6"/><path d="M21 5h-6"/>
                </svg>
              </div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a', fontFamily: 'Manrope, sans-serif' }}>
                AI Auto Fill
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: '#64748b' }}>
              {hasFields
                ? `${fields.length} form field${fields.length > 1 ? 's' : ''} detected — describe yourself and Claude will fill them`
                : 'Describe what to fill and Claude will add text to the PDF'}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, border: '1px solid #e2e8f0',
            background: '#f8faff', cursor: 'pointer', fontSize: 16, color: '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>×</button>
        </div>

        {/* API Test */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8faff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <button
            onClick={handleTestAPI}
            disabled={testLoading}
            style={{
              padding: '5px 14px', borderRadius: 7, border: 'none', fontSize: 11.5, fontWeight: 700,
              background: testLoading ? '#e2e8f0' : 'linear-gradient(135deg,#0e7490,#06b6d4)',
              color: testLoading ? '#94a3b8' : '#fff', cursor: testLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            }}
          >
            {testLoading ? 'Testing…' : '🔌 Test API'}
          </button>
          <span style={{ fontSize: 11.5, color: testResult.startsWith('✅') ? '#16a34a' : testResult.startsWith('❌') ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>
            {testResult || 'Click to verify API connection'}
          </span>
        </div>

        {/* Detected fields list */}
        {hasFields && (
          <div style={{
            background: '#f8faff', borderRadius: 10, border: '1px solid #e2e8f0',
            padding: '10px 12px', maxHeight: 120, overflowY: 'auto',
          }}>
            <p style={{ margin: '0 0 6px', fontSize: 9.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Detected Fields
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {fields.map(f => (
                <span key={f.name + f.pageNum} style={{
                  padding: '3px 8px', borderRadius: 20,
                  background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                  color: '#6366f1', fontSize: 10.5, fontWeight: 600,
                }}>
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Context input */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Your Information
          </label>
          <textarea
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder={`Paste or type your info here. For example:\n\nName: John Smith\nDate of Birth: March 15, 1990\nEmail: john@example.com\nPhone: +1 555-0123\nAddress: 123 Main St, New York, NY 10001\nCompany: Acme Corp\nSignature date: today`}
            style={{
              width: '100%', minHeight: 130, borderRadius: 10,
              border: '1.5px solid #e2e8f0', padding: '10px 12px',
              fontSize: 12.5, fontFamily: 'inherit', lineHeight: 1.6,
              resize: 'vertical', color: '#1e293b',
              background: '#fafbff', outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            background: '#fef2f2', border: '1px solid #fca5a5',
            color: '#dc2626', fontSize: 12, fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        {/* Preview */}
        {preview && preview.length > 0 && (
          <div style={{ background: '#f0fdf4', borderRadius: 10, border: '1px solid #86efac', padding: '10px 12px' }}>
            <p style={{ margin: '0 0 8px', fontSize: 9.5, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Preview — {preview.length} field{preview.length > 1 ? 's' : ''} filled
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {preview.map(f => (
                <div key={f.name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', minWidth: 100, flexShrink: 0 }}>{f.name}</span>
                  <span style={{ fontSize: 11.5, color: '#1e293b' }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={onClose} style={{
            padding: '8px 18px', borderRadius: 9, border: '1px solid #e2e8f0',
            background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            Cancel
          </button>

          {preview ? (
            <button
              onClick={() => { onApply(preview); onClose() }}
              style={{
                padding: '9px 22px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                color: '#fff', cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(22,163,74,0.35)',
              }}
            >
              Apply to PDF
            </button>
          ) : (
            <button
              onClick={handleFill}
              disabled={loading}
              style={{
                padding: '9px 22px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
                background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: loading ? '#94a3b8' : '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 3px 12px rgba(99,102,241,0.35)',
                display: 'flex', alignItems: 'center', gap: 7,
                transition: 'all 0.15s',
              }}
            >
              {loading && (
                <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              )}
              {loading ? 'Filling with AI…' : 'Fill with Claude AI'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
