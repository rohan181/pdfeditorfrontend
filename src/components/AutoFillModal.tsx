'use client'
import { useState } from 'react'

export interface DetectedField {
  name: string
  type: string        // 'text' | 'char_box' | 'checkbox' | 'dropdown'
  rect: [number, number, number, number]
  pageNum: number
  pageHeight: number
  maxLen?: number
  isComb?: boolean
}

export interface FilledField {
  name: string
  value: string
}

interface Props {
  fields: DetectedField[]
  existingFilled?: Record<string, string>
  onApply: (filled: FilledField[]) => void
  onClose: () => void
}

function buildInitialContext(fields: DetectedField[], existingFilled: Record<string, string>): string {
  const lines = fields.map(f => {
    const v = existingFilled[f.name]
    return v ? `${f.name}: ${v}` : `${f.name}: `
  })
  return lines.join('\n')
}

function buildPlaceholder(fields: DetectedField[]): string {
  if (!fields.length)
    return 'Paste or type your information here.\n\nExample:\nFull Name: John Smith\nDate of Birth: 15/03/1990\nEmail: john@example.com'
  const lines = fields.map(f => {
    if (f.type === 'checkbox') return `${f.name}: tick  (or cross)`
    if (f.type === 'char_box') return `${f.name}: A1234567  (no spaces)`
    return `${f.name}: your value here`
  })
  return lines.join('\n')
}

type Phase = 'fill' | 'improvise' | 'compare'

export default function AutoFillModal({ fields, existingFilled = {}, onApply, onClose }: Props) {
  const filledCount  = fields.filter(f => existingFilled[f.name]).length
  const missingCount = fields.length - filledCount

  const [context, setContext]     = useState(() => buildInitialContext(fields, existingFilled))
  const [loading, setLoading]     = useState(false)
  const [preview, setPreview]     = useState<FilledField[] | null>(null)
  const [error, setError]         = useState('')
  const [testResult, setTestResult] = useState('')
  const [testLoading, setTestLoading] = useState(false)

  // Improvise states
  const [phase, setPhase]                   = useState<Phase>('fill')
  const [improviseSelected, setImproviseSelected] = useState<Set<string>>(new Set())
  const [improving, setImproving]           = useState(false)
  const [improvedValues, setImprovedValues] = useState<Record<string, string>>({})
  const [versionChoice, setVersionChoice]   = useState<Record<string, 'original' | 'improved'>>({})

  const improvableFields = (preview ?? []).filter(f => {
    const det = fields.find(d => d.name === f.name)
    return det && det.type !== 'checkbox' && !det.isComb
  })

  const handleTestAPI = async () => {
    setTestLoading(true); setTestResult('')
    try {
      const res  = await fetch('/api/test-ai')
      const data = await res.json()
      setTestResult(data.ok ? `✅ ${data.response} (key: ${data.keyPreview})` : `❌ ${data.error}`)
    } catch (e: any) {
      setTestResult('❌ ' + e.message)
    } finally { setTestLoading(false) }
  }

  const handleFill = async () => {
    if (!context.trim()) { setError('Please describe yourself or paste your information.'); return }
    setError(''); setLoading(true); setPreview(null)
    setPhase('fill'); setImprovedValues({}); setVersionChoice({}); setImproviseSelected(new Set())
    try {
      const res  = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, userContext: context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setPreview(data.filled.filter((f: FilledField) => f.value.trim()))
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const handleImprovise = async () => {
    if (improviseSelected.size === 0) return
    setImproving(true); setError('')
    try {
      const toImprove = (preview ?? [])
        .filter(f => improviseSelected.has(f.name))
        .map(f => ({ name: f.name, value: f.value, type: fields.find(d => d.name === f.name)?.type ?? 'text' }))

      const res = await fetch('/api/improvise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: toImprove, userContext: context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Improvise failed')

      const improved: Record<string, string> = {}
      const choices: Record<string, 'original' | 'improved'> = {}
      ;(data.improved as FilledField[]).forEach(f => {
        improved[f.name] = f.value
        choices[f.name] = 'improved'
      })
      setImprovedValues(improved)
      setVersionChoice(choices)
      setPhase('compare')
    } catch (e: any) {
      setError(e.message)
    } finally { setImproving(false) }
  }

  const toggleImprovise = (name: string) => {
    setImproviseSelected(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const handleApply = () => {
    if (!preview) return
    const finalFilled = preview.map(f => {
      if (versionChoice[f.name] === 'improved' && improvedValues[f.name]) {
        return { name: f.name, value: improvedValues[f.name] }
      }
      return f
    })
    onApply(finalFilled)
    onClose()
  }

  const hasFields = fields.length > 0

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(0,0,0,0.55)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background:'#fff', borderRadius:20, padding:'26px 28px',
        width:'100%', maxWidth:560,
        boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
        maxHeight:'92vh', overflowY:'auto', display:'flex', flexDirection:'column', gap:14,
      }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <div style={{ width:32, height:32, borderRadius:9,
                background:'linear-gradient(135deg,#6366f1,#818cf8)',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M18 2v6"/><path d="M21 5h-6"/>
                </svg>
              </div>
              <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:'#0f172a', fontFamily:'Manrope, sans-serif' }}>
                AI Auto Fill
                {phase === 'improvise' && <span style={{ marginLeft:8, fontSize:12, fontWeight:600,
                  color:'#f59e0b', background:'rgba(245,158,11,0.1)', padding:'2px 8px', borderRadius:20 }}>
                  Improvise
                </span>}
                {phase === 'compare' && <span style={{ marginLeft:8, fontSize:12, fontWeight:600,
                  color:'#8b5cf6', background:'rgba(139,92,246,0.1)', padding:'2px 8px', borderRadius:20 }}>
                  Compare
                </span>}
              </h2>
            </div>
            <p style={{ margin:0, fontSize:11.5, color:'#64748b' }}>
              {phase === 'fill' && (hasFields
                ? `${fields.length} field${fields.length !== 1 ? 's' : ''} detected`
                  + (filledCount  ? ` · ${filledCount} already filled`  : '')
                  + (missingCount ? ` · ${missingCount} missing` : '')
                : 'Describe what to fill and Claude will add text to the PDF')}
              {phase === 'improvise' && `Select fields to enhance — AI will suggest improved versions`}
              {phase === 'compare' && `Choose original or improved value for each field`}
            </p>
          </div>
          <button onClick={onClose} style={{
            width:28, height:28, borderRadius:7, border:'1px solid #e2e8f0',
            background:'#f8faff', cursor:'pointer', fontSize:16, color:'#64748b',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>×</button>
        </div>

        {/* API Test — only in fill phase */}
        {phase === 'fill' && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
            background:'#f8faff', borderRadius:10, border:'1px solid #e2e8f0' }}>
            <button onClick={handleTestAPI} disabled={testLoading} style={{
              padding:'5px 14px', borderRadius:7, border:'none', fontSize:11.5, fontWeight:700,
              background: testLoading ? '#e2e8f0' : 'linear-gradient(135deg,#0e7490,#06b6d4)',
              color: testLoading ? '#94a3b8' : '#fff',
              cursor: testLoading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', gap:5, flexShrink:0,
            }}>
              {testLoading ? 'Testing…' : '🔌 Test API'}
            </button>
            <span style={{ fontSize:11.5, fontWeight:600,
              color: testResult.startsWith('✅') ? '#16a34a' : testResult.startsWith('❌') ? '#dc2626' : '#94a3b8' }}>
              {testResult || 'Click to verify API connection'}
            </span>
          </div>
        )}

        {/* Field status list — fill phase only */}
        {phase === 'fill' && hasFields && (
          <div style={{ background:'#f8faff', borderRadius:10, border:'1px solid #e2e8f0',
            padding:'10px 12px', maxHeight:130, overflowY:'auto' }}>
            <p style={{ margin:'0 0 7px', fontSize:9.5, fontWeight:700, color:'#94a3b8',
              textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Detected Fields
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {fields.map(f => {
                const val = existingFilled[f.name]
                const filled = !!val
                return (
                  <span key={f.name + f.pageNum} title={filled ? `Filled: ${val}` : 'Not yet filled'}
                    style={{
                      padding:'3px 8px', borderRadius:20,
                      background: filled ? 'rgba(22,163,74,0.08)' : 'rgba(99,102,241,0.08)',
                      border: `1px solid ${filled ? 'rgba(22,163,74,0.3)' : 'rgba(99,102,241,0.2)'}`,
                      color: filled ? '#15803d' : '#6366f1',
                      fontSize:10.5, fontWeight:600,
                      display:'flex', alignItems:'center', gap:4,
                    }}>
                    <span>{filled ? '✓' : '○'}</span>
                    <span>{f.name}</span>
                    {filled && (
                      <span style={{ opacity:0.6, maxWidth:60, overflow:'hidden',
                        textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:400 }}>
                        {val}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Context input — fill phase only */}
        {phase === 'fill' && (
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b',
              marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Your Information
              {filledCount > 0 && (
                <span style={{ marginLeft:6, fontSize:10, fontWeight:400, color:'#16a34a',
                  textTransform:'none', letterSpacing:0 }}>
                  (pre-filled from page — edit or add more)
                </span>
              )}
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder={buildPlaceholder(fields)}
              style={{
                width:'100%', minHeight:140, borderRadius:10,
                border:'1.5px solid #e2e8f0', padding:'10px 12px',
                fontSize:12.5, fontFamily:'inherit', lineHeight:1.6,
                resize:'vertical', color:'#1e293b',
                background:'#fafbff', outline:'none',
                boxSizing:'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#e2e8f0')}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding:'8px 12px', borderRadius:8,
            background:'#fef2f2', border:'1px solid #fca5a5',
            color:'#dc2626', fontSize:12, fontWeight:600 }}>
            {error}
          </div>
        )}

        {/* ── FILL PHASE: Preview ── */}
        {phase === 'fill' && preview && preview.length > 0 && (
          <div style={{ background:'#f0fdf4', borderRadius:10, border:'1px solid #86efac', padding:'10px 12px' }}>
            <p style={{ margin:'0 0 8px', fontSize:9.5, fontWeight:700, color:'#16a34a',
              textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Preview — {preview.length} field{preview.length !== 1 ? 's' : ''} filled
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {preview.map(f => (
                <div key={f.name} style={{ display:'flex', gap:8, alignItems:'baseline' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#15803d', minWidth:100, flexShrink:0 }}>{f.name}</span>
                  <span style={{ fontSize:11.5, color:'#1e293b' }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── IMPROVISE PHASE: field selection ── */}
        {phase === 'improvise' && preview && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <p style={{ margin:0, fontSize:11.5, color:'#475569' }}>
              Select the fields you want AI to enhance. Checkboxes and ID character fields are excluded.
            </p>
            {improvableFields.length === 0 ? (
              <p style={{ margin:0, fontSize:12, color:'#94a3b8', fontStyle:'italic' }}>
                No improvable fields available (checkboxes and character boxes are excluded).
              </p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {/* Select all toggle */}
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer',
                  padding:'6px 10px', borderRadius:8, background:'rgba(99,102,241,0.05)',
                  border:'1px solid rgba(99,102,241,0.15)' }}>
                  <input
                    type="checkbox"
                    checked={improviseSelected.size === improvableFields.length && improvableFields.length > 0}
                    onChange={() => {
                      if (improviseSelected.size === improvableFields.length) {
                        setImproviseSelected(new Set())
                      } else {
                        setImproviseSelected(new Set(improvableFields.map(f => f.name)))
                      }
                    }}
                    style={{ width:14, height:14, cursor:'pointer' }}
                  />
                  <span style={{ fontSize:11.5, fontWeight:700, color:'#6366f1' }}>Select all fields</span>
                </label>

                {improvableFields.map(f => (
                  <label key={f.name} style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer',
                    padding:'8px 12px', borderRadius:9,
                    background: improviseSelected.has(f.name) ? 'rgba(99,102,241,0.06)' : '#fafbff',
                    border: `1px solid ${improviseSelected.has(f.name) ? 'rgba(99,102,241,0.3)' : '#e2e8f0'}`,
                    transition:'all 0.12s',
                  }}>
                    <input
                      type="checkbox"
                      checked={improviseSelected.has(f.name)}
                      onChange={() => toggleImprovise(f.name)}
                      style={{ width:14, height:14, cursor:'pointer', marginTop:1, flexShrink:0 }}
                    />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11.5, fontWeight:700, color:'#1e293b' }}>{f.name}</div>
                      <div style={{ fontSize:11, color:'#64748b', marginTop:2,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {f.value}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── COMPARE PHASE: original vs improved ── */}
        {phase === 'compare' && preview && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <p style={{ margin:0, fontSize:11.5, color:'#475569' }}>
              Choose which version to apply for each field.
            </p>
            {preview.map(f => {
              const hasImproved = !!improvedValues[f.name]
              const choice = versionChoice[f.name] ?? 'original'
              return (
                <div key={f.name} style={{ borderRadius:10, border:'1px solid #e2e8f0',
                  overflow:'hidden', background:'#fafbff' }}>
                  <div style={{ padding:'7px 12px', background:'#f1f5f9', borderBottom:'1px solid #e2e8f0',
                    fontSize:10.5, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.07em' }}>
                    {f.name}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                    {/* Original */}
                    <label style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 12px',
                      cursor:'pointer',
                      background: choice === 'original' ? 'rgba(22,163,74,0.06)' : 'transparent',
                      borderBottom: hasImproved ? '1px solid #e2e8f0' : 'none',
                      transition:'background 0.1s',
                    }}>
                      <input type="radio" name={`choice-${f.name}`} value="original"
                        checked={choice === 'original'}
                        onChange={() => setVersionChoice(prev => ({ ...prev, [f.name]: 'original' }))}
                        style={{ marginTop:2, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:'#15803d', marginBottom:2 }}>ORIGINAL</div>
                        <div style={{ fontSize:12, color:'#1e293b' }}>{f.value}</div>
                      </div>
                    </label>

                    {/* Improved */}
                    {hasImproved && (
                      <label style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 12px',
                        cursor:'pointer',
                        background: choice === 'improved' ? 'rgba(139,92,246,0.06)' : 'transparent',
                        transition:'background 0.1s',
                      }}>
                        <input type="radio" name={`choice-${f.name}`} value="improved"
                          checked={choice === 'improved'}
                          onChange={() => setVersionChoice(prev => ({ ...prev, [f.name]: 'improved' }))}
                          style={{ marginTop:2, flexShrink:0 }} />
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:'#7c3aed', marginBottom:2 }}>✨ IMPROVED</div>
                          <div style={{ fontSize:12, color:'#1e293b' }}>{improvedValues[f.name]}</div>
                        </div>
                      </label>
                    )}

                    {/* No improved for this field (checkbox/comb) */}
                    {!hasImproved && (
                      <div style={{ padding:'9px 12px', fontSize:11, color:'#94a3b8', fontStyle:'italic' }}>
                        Not selected for improvement
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:4, flexWrap:'wrap' }}>
          {/* ── FILL PHASE ── */}
          {phase === 'fill' && (
            <>
              <button onClick={onClose} style={{
                padding:'8px 18px', borderRadius:9, border:'1px solid #e2e8f0',
                background:'transparent', color:'#64748b', cursor:'pointer', fontSize:13, fontWeight:600,
              }}>
                Cancel
              </button>

              {preview ? (
                <>
                  <button onClick={() => setPhase('improvise')} style={{
                    padding:'8px 18px', borderRadius:9, border:'1px solid rgba(245,158,11,0.4)',
                    background:'rgba(245,158,11,0.08)', color:'#b45309',
                    cursor:'pointer', fontSize:13, fontWeight:700,
                    display:'flex', alignItems:'center', gap:6,
                  }}>
                    ✨ Improvise
                  </button>
                  <button onClick={handleApply} style={{
                    padding:'9px 22px', borderRadius:9, border:'none', fontSize:13, fontWeight:700,
                    background:'linear-gradient(135deg,#16a34a,#22c55e)',
                    color:'#fff', cursor:'pointer',
                    boxShadow:'0 3px 12px rgba(22,163,74,0.35)',
                  }}>
                    Apply to PDF
                  </button>
                </>
              ) : (
                <button onClick={handleFill} disabled={loading} style={{
                  padding:'9px 22px', borderRadius:9, border:'none', fontSize:13, fontWeight:700,
                  background: loading ? '#e2e8f0' : 'linear-gradient(135deg,#6366f1,#818cf8)',
                  color: loading ? '#94a3b8' : '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 3px 12px rgba(99,102,241,0.35)',
                  display:'flex', alignItems:'center', gap:7, transition:'all 0.15s',
                }}>
                  {loading && (
                    <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                  )}
                  {loading ? 'Filling with AI…' : 'Fill with Claude AI'}
                </button>
              )}
            </>
          )}

          {/* ── IMPROVISE PHASE ── */}
          {phase === 'improvise' && (
            <>
              <button onClick={() => setPhase('fill')} style={{
                padding:'8px 18px', borderRadius:9, border:'1px solid #e2e8f0',
                background:'transparent', color:'#64748b', cursor:'pointer', fontSize:13, fontWeight:600,
              }}>
                ← Back
              </button>
              <button onClick={handleApply} style={{
                padding:'8px 18px', borderRadius:9, border:'1px solid rgba(22,163,74,0.4)',
                background:'rgba(22,163,74,0.07)', color:'#15803d',
                cursor:'pointer', fontSize:13, fontWeight:700,
              }}>
                Skip & Apply
              </button>
              <button
                onClick={handleImprovise}
                disabled={improving || improviseSelected.size === 0}
                style={{
                  padding:'9px 22px', borderRadius:9, border:'none', fontSize:13, fontWeight:700,
                  background: (improving || improviseSelected.size === 0)
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                  color: (improving || improviseSelected.size === 0) ? '#94a3b8' : '#fff',
                  cursor: (improving || improviseSelected.size === 0) ? 'not-allowed' : 'pointer',
                  boxShadow: (improving || improviseSelected.size === 0) ? 'none' : '0 3px 12px rgba(245,158,11,0.4)',
                  display:'flex', alignItems:'center', gap:7,
                }}>
                {improving && (
                  <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                )}
                {improving
                  ? 'Improving…'
                  : improviseSelected.size === 0
                    ? 'Select fields first'
                    : `✨ Improvise ${improviseSelected.size} field${improviseSelected.size !== 1 ? 's' : ''}`
                }
              </button>
            </>
          )}

          {/* ── COMPARE PHASE ── */}
          {phase === 'compare' && (
            <>
              <button onClick={() => setPhase('improvise')} style={{
                padding:'8px 18px', borderRadius:9, border:'1px solid #e2e8f0',
                background:'transparent', color:'#64748b', cursor:'pointer', fontSize:13, fontWeight:600,
              }}>
                ← Re-select
              </button>
              <button onClick={handleApply} style={{
                padding:'9px 22px', borderRadius:9, border:'none', fontSize:13, fontWeight:700,
                background:'linear-gradient(135deg,#7c3aed,#8b5cf6)',
                color:'#fff', cursor:'pointer',
                boxShadow:'0 3px 12px rgba(124,58,237,0.35)',
                display:'flex', alignItems:'center', gap:6,
              }}>
                ✓ Apply to PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
