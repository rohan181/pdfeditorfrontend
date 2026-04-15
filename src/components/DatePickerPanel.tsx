'use client'
import { useState } from 'react'

const FORMATS = [
  { id: 'long',      label: 'Long',         fn: (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
  { id: 'weekday',   label: 'With Weekday', fn: (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
  { id: 'us-short',  label: 'US Short',     fn: (d: Date) => d.toLocaleDateString('en-US') },
  { id: 'eu-short',  label: 'EU Short',     fn: (d: Date) => d.toLocaleDateString('en-GB') },
  { id: 'iso',       label: 'ISO 8601',     fn: (d: Date) => d.toISOString().slice(0, 10) },
  { id: 'month-yr',  label: 'Month & Year', fn: (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) },
  { id: 'day-month', label: 'Day Month',    fn: (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) },
  { id: 'compact',   label: 'Compact',      fn: (d: Date) => d.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }) },
]

interface Props {
  onInsert: (text: string) => void
  onClose: () => void
  isMobile?: boolean
  /** Override the panel container's position styles (e.g. when launched from a floating toolbar) */
  panelStyle?: React.CSSProperties
}

export default function DatePickerPanel({ onInsert, onClose, isMobile, panelStyle }: Props) {
  const todayStr = new Date().toISOString().slice(0, 10)
  const [dateStr, setDateStr] = useState(todayStr)
  const [selectedFmt, setSelectedFmt] = useState('long')

  // Use noon to avoid timezone-off-by-one on date string parsing
  const parsed = new Date(dateStr + 'T12:00:00')
  const fmt = FORMATS.find(f => f.id === selectedFmt) ?? FORMATS[0]
  const preview = parsed ? fmt.fn(parsed) : ''

  const posStyle: React.CSSProperties = panelStyle ?? (isMobile
    ? { position: 'fixed', bottom: 68, left: 10, right: 10 }
    : { position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', minWidth: 290 })

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 190 }}
      />

      <div style={{
        ...posStyle,
        zIndex: 200,
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        border: '1px solid #e2e8f0',
        padding: 14,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>📅</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#1e293b', fontFamily: 'Manrope, sans-serif' }}>
              Insert Date
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 22, height: 22, borderRadius: 6, border: '1px solid #e2e8f0',
              background: '#f8faff', cursor: 'pointer', fontSize: 14, color: '#64748b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            }}
          >×</button>
        </div>

        {/* Date input */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
            Pick a date
          </label>
          <input
            type="date"
            value={dateStr}
            onChange={e => setDateStr(e.target.value)}
            style={{
              width: '100%', padding: '7px 10px', borderRadius: 8,
              border: '1.5px solid #e2e8f0', fontSize: 12.5, color: '#1e293b',
              background: '#f8faff', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Format list */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
            Format
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FORMATS.map(f => {
              const active = selectedFmt === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFmt(f.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '5px 8px', borderRadius: 7,
                    border: `1.5px solid ${active ? '#4f6ef7' : 'transparent'}`,
                    background: active ? '#f0f4ff' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', gap: 8, width: '100%',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8faff' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? '#4f6ef7' : '#475569', minWidth: 82 }}>
                    {f.label}
                  </span>
                  <span style={{ fontSize: 10.5, color: active ? '#4f6ef7' : '#94a3b8', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.fn(parsed)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f4ff, #f8faff)',
          borderRadius: 9, padding: '8px 11px', marginBottom: 11,
          border: '1px solid #e0e7ff',
        }}>
          <span style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
            Preview
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', fontFamily: 'Georgia, serif' }}>
            {preview}
          </span>
        </div>

        {/* Insert */}
        <button
          onClick={() => { onInsert(preview); onClose() }}
          style={{
            width: '100%', padding: '9px 0', borderRadius: 9, border: 'none',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #4f6ef7 100%)',
            color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(79,110,247,0.35)',
            letterSpacing: '0.01em',
          }}
        >
          Insert Date
        </button>
      </div>
    </>
  )
}
