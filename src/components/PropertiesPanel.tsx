'use client'
import type { PDFElement, TextElement, HighlightElement, MarkElement, AnnotationElement, ShapeElement, StampElement, DrawElement, WatermarkElement } from '@/types'

const PRESET_COLORS = [
  '#1b1c1c', '#1d4ed8', '#dc2626', '#b45309',
  '#166534', '#7c3aed', '#0e7490', '#64748b',
]
const HIGHLIGHT_PRESETS = ['#fef08a', '#86efac', '#f9a8d4', '#93c5fd', '#fdba74', '#fca5a5']
const FONTS = ['Inter', 'Georgia', 'Courier New', 'Arial', 'Times New Roman']
const STAMP_COLORS: Record<string, string> = {
  blue: '#1d4ed8', red: '#dc2626', orange: '#b45309', gray: '#64748b',
}

interface Props {
  selected: PDFElement | null
  currentPage: number
  totalPages: number
  pageBoxCount: number
  highlightPresets?: string[]
  onUpdate: (id: string, updates: Partial<PDFElement>) => void
  onDelete: (id: string) => void
  onClearPage: () => void
  onAddStamp: (label: string, color: string) => void
}

export default function PropertiesPanel({
  selected, currentPage, totalPages, pageBoxCount,
  onUpdate, onDelete, onClearPage, onAddStamp,
}: Props) {
  const txt  = selected?.type === 'text'       ? (selected as TextElement)       : null
  const hl   = selected?.type === 'highlight'  ? (selected as HighlightElement)  : null
  const mk   = selected?.type === 'mark'       ? (selected as MarkElement)       : null
  const ann  = selected?.type === 'annotation' ? (selected as AnnotationElement) : null
  const shp  = selected?.type === 'shape'      ? (selected as ShapeElement)      : null
  const stmp = selected?.type === 'stamp'      ? (selected as StampElement)      : null
  const drw  = selected?.type === 'draw'       ? (selected as DrawElement)       : null
  const wm   = selected?.type === 'watermark'  ? (selected as WatermarkElement)  : null

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{
      background: '#fff', borderRadius: 10, padding: '12px 12px 10px',
      border: '1px solid #e8ecf8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <p style={{ margin: '0 0 9px', fontSize: 9.5, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
        {title}
      </p>
      {children}
    </div>
  )

  return (
    <aside style={{
      width: 240, background: '#f0f4ff',
      borderLeft: '1px solid #dde3f0',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid #dde3f0' }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: '#1e293b' }}>
          Properties
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: 10.5, color: '#94a3b8' }}>
          {selected ? `${selected.type} selected` : 'Nothing selected'}
        </p>
      </div>

      <div className="thin-scroll" style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* ── TEXT ─────────────────────────────────── */}
        {txt && (
          <>
            <Card title="Typography">
              <select
                value={txt.fontFamily}
                onChange={e => onUpdate(txt.id, { fontFamily: e.target.value } as Partial<PDFElement>)}
                style={selectStyle}
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0' }}>
                <span style={{ fontSize: 11.5, color: '#475569' }}>Size</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Btn onClick={() => onUpdate(txt.id, { fontSize: Math.max(6, txt.fontSize - 1) } as Partial<PDFElement>)}>−</Btn>
                  <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 26, textAlign: 'center' }}>{txt.fontSize}</span>
                  <Btn onClick={() => onUpdate(txt.id, { fontSize: Math.min(120, txt.fontSize + 1) } as Partial<PDFElement>)}>+</Btn>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {([['B', 'bold', { fontWeight: 700 }], ['I', 'italic', { fontStyle: 'italic' }], ['U', 'underline', { textDecoration: 'underline' }]] as const).map(([label, key, sty]) => (
                  <Toggle key={key} active={!!txt[key]} style={sty}
                    onClick={() => onUpdate(txt.id, { [key]: !txt[key] } as Partial<PDFElement>)}>{label}</Toggle>
                ))}
                <div style={{ flex: 1 }} />
                {(['left', 'center', 'right'] as const).map(align => (
                  <Toggle key={align} active={txt.align === align}
                    onClick={() => onUpdate(txt.id, { align } as Partial<PDFElement>)}
                    style={{ fontSize: 10 }}>
                    {align === 'left' ? '⇤' : align === 'center' ? '⇔' : '⇥'}
                  </Toggle>
                ))}
              </div>
            </Card>

            <Card title="Text Color">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
                {PRESET_COLORS.map(c => (
                  <button key={c} onClick={() => onUpdate(txt.id, { color: c } as Partial<PDFElement>)}
                    style={{
                      width: 20, height: 20, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                      outline: txt.color === c ? '2px solid #4f6ef7' : '2px solid transparent', outlineOffset: 2,
                    }} />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Custom</span>
                <input type="color" value={txt.color}
                  onChange={e => onUpdate(txt.id, { color: e.target.value } as Partial<PDFElement>)}
                  style={{ width: 28, height: 22, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 1 }} />
                <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>{txt.color}</span>
              </div>
            </Card>

            <Card title="Background">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Toggle active={txt.bgColor === ''} onClick={() => onUpdate(txt.id, { bgColor: '' } as Partial<PDFElement>)}
                  style={{ fontSize: 11, padding: '2px 8px' }}>None</Toggle>
                <input type="color" value={txt.bgColor || '#ffffff'}
                  onChange={e => onUpdate(txt.id, { bgColor: e.target.value } as Partial<PDFElement>)}
                  style={{ width: 28, height: 22, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 1 }} />
              </div>
            </Card>
          </>
        )}

        {/* ── HIGHLIGHT ──────────────────────────── */}
        {hl && (
          <Card title="Highlight">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {HIGHLIGHT_PRESETS.map(c => (
                <button key={c} onClick={() => onUpdate(hl.id, { color: c } as Partial<PDFElement>)}
                  style={{
                    width: 22, height: 22, borderRadius: 4, background: c, border: 'none', cursor: 'pointer',
                    outline: hl.color === c ? '2px solid #4f6ef7' : '2px solid transparent', outlineOffset: 2,
                  }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Custom</span>
              <input type="color" value={hl.color}
                onChange={e => onUpdate(hl.id, { color: e.target.value } as Partial<PDFElement>)}
                style={{ width: 28, height: 22, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Opacity</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{Math.round(hl.opacity * 100)}%</span>
            </div>
            <input type="range" min={10} max={90} step={5} value={Math.round(hl.opacity * 100)}
              onChange={e => onUpdate(hl.id, { opacity: parseInt(e.target.value) / 100 } as Partial<PDFElement>)}
              style={{ width: '100%', accentColor: '#4f6ef7' }} />
          </Card>
        )}

        {/* ── MARK ──────────────────────────────── */}
        {mk && (
          <Card title="Mark">
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {(['tick','cross'] as const).map(mt => (
                <button key={mt} onClick={() => onUpdate(mk.id, { markType: mt } as Partial<PDFElement>)} style={{
                  flex:1, padding:'7px 0', borderRadius:8,
                  border:`1.5px solid ${mk.markType===mt?'#4f6ef7':'#e2e8f0'}`,
                  background:mk.markType===mt?'#4f6ef7':'#f8faff',
                  color:mk.markType===mt?'#fff':'#475569',
                  fontWeight:700, fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {mt==='tick'
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                </button>
              ))}
            </div>
            <p style={{ margin:'0 0 6px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.06em', textTransform:'uppercase' }}>Color</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:7 }}>
              {['#16a34a','#dc2626','#1d4ed8','#7c3aed','#ea580c','#0e7490','#1e293b','#f59e0b'].map(c => (
                <button key={c} onClick={() => onUpdate(mk.id, { color: c } as Partial<PDFElement>)} style={{ width:20, height:20, borderRadius:'50%', background:c, border:'none', cursor:'pointer', outline:mk.color===c?'2px solid #4f6ef7':'2px solid transparent', outlineOffset:2 }}/>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:9 }}>
              <span style={{ fontSize:11, color:'#64748b' }}>Custom</span>
              <input type="color" value={mk.color} onChange={e => onUpdate(mk.id, { color: e.target.value } as Partial<PDFElement>)} style={{ width:28, height:22, border:'none', borderRadius:4, cursor:'pointer', padding:1 }}/>
            </div>
            <p style={{ margin:'0 0 5px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.06em', textTransform:'uppercase' }}>Thickness {mk.strokeWidth}px</p>
            <input type="range" min={0.5} max={20} step={0.5} value={mk.strokeWidth}
              onChange={e => onUpdate(mk.id, { strokeWidth: parseFloat(e.target.value) } as Partial<PDFElement>)}
              style={{ width:'100%', minWidth:0, accentColor:'#4f6ef7', cursor:'pointer' }}/>
          </Card>
        )}

        {/* ── ANNOTATION ────────────────────────── */}
        {ann && (
          <Card title="Note">
            <p style={{ margin:'0 0 6px', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.06em', textTransform:'uppercase' }}>Background</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:7 }}>
              {['#fef9c3','#dcfce7','#dbeafe','#fce7f3','#ede9fe','#fff7ed'].map(c => (
                <button key={c} onClick={() => onUpdate(ann.id, { color: c } as Partial<PDFElement>)} style={{ width:22, height:22, borderRadius:4, background:c, border:`2px solid ${ann.color===c?'#4f6ef7':'#e2e8f0'}`, cursor:'pointer' }}/>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:11, color:'#64748b' }}>Custom</span>
              <input type="color" value={ann.color||'#fef9c3'} onChange={e => onUpdate(ann.id, { color: e.target.value } as Partial<PDFElement>)} style={{ width:28, height:22, border:'none', borderRadius:4, cursor:'pointer', padding:1 }}/>
            </div>
          </Card>
        )}

        {/* ── SHAPE ─────────────────────────────── */}
        {shp && (
          <Card title="Shape">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:4, marginBottom:10 }}>
              {([
                {t:'rectangle' as const, icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>},
                {t:'ellipse' as const, icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><ellipse cx="12" cy="12" rx="10" ry="7"/></svg>},
                {t:'line' as const, icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>},
                {t:'arrow' as const, icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="9 5 19 5 19 15"/></svg>},
                {t:'polygon' as const, icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polygon points="12,3 21,8.5 21,15.5 12,21 3,15.5 3,8.5"/></svg>},
              ]).map(({t,icon}) => (
                <button key={t} title={t} onClick={() => onUpdate(shp.id, { shapeType: t } as Partial<PDFElement>)} style={{ width:34, height:34, borderRadius:7, border:`1.5px solid ${shp.shapeType===t?'#4f6ef7':'#e2e8f0'}`, background:shp.shapeType===t?'#4f6ef7':'#f8faff', color:shp.shapeType===t?'#fff':'#475569', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{icon}</button>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:8 }}>
              <div>
                <p style={{ margin:'0 0 4px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Stroke</p>
                <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <input type="color" value={shp.strokeColor||'#1d4ed8'} onChange={e => onUpdate(shp.id, { strokeColor: e.target.value } as Partial<PDFElement>)} style={{ width:26, height:22, border:'none', borderRadius:4, cursor:'pointer', padding:1 }}/>
                  <span style={{ fontSize:9.5, color:'#94a3b8', fontFamily:'monospace' }}>{shp.strokeColor}</span>
                </div>
              </div>
              <div>
                <p style={{ margin:'0 0 4px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Fill</p>
                <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <input type="color" value={shp.fillColor||'#ffffff'} onChange={e => onUpdate(shp.id, { fillColor: e.target.value } as Partial<PDFElement>)} style={{ width:26, height:22, border:'none', borderRadius:4, cursor:'pointer', padding:1 }}/>
                  <button onClick={() => onUpdate(shp.id, { fillColor: '' } as Partial<PDFElement>)} style={{ fontSize:9.5, color:shp.fillColor?'#64748b':'#4f6ef7', border:'none', background:'transparent', cursor:'pointer', fontWeight:shp.fillColor?400:700 }}>None</button>
                </div>
              </div>
            </div>
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Width</p>
            <div style={{ display:'flex', gap:5 }}>
              {[1,2,4].map(w => (
                <button key={w} onClick={() => onUpdate(shp.id, { strokeWidth: w } as Partial<PDFElement>)} style={{ flex:1, padding:'4px 0', borderRadius:6, fontSize:11, fontWeight:700, border:`1.5px solid ${shp.strokeWidth===w?'#4f6ef7':'#e2e8f0'}`, background:shp.strokeWidth===w?'#4f6ef7':'#f8faff', color:shp.strokeWidth===w?'#fff':'#475569', cursor:'pointer' }}>{w}px</button>
              ))}
            </div>
          </Card>
        )}

        {/* ── IMAGE / SIGNATURE ─────────────────── */}
        {selected && (selected.type === 'image' || selected.type === 'signature') && (
          <Card title={selected.type === 'signature' ? 'Signature' : 'Image'}>
            <div style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.8, marginBottom: 8 }}>
              <div>W: <b>{Math.round(selected.width)} px</b> &nbsp; H: <b>{Math.round(selected.height)} px</b></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Opacity</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{Math.round((selected.opacity ?? 1) * 100)}%</span>
            </div>
            <input type="range" min={10} max={100} step={5}
              value={Math.round((selected.opacity ?? 1) * 100)}
              onChange={e => onUpdate(selected.id, { opacity: parseInt(e.target.value) / 100 } as Partial<PDFElement>)}
              style={{ width: '100%', accentColor: '#4f6ef7' }} />
          </Card>
        )}

        {/* ── STAMP ─────────────────────────────── */}
        {stmp && (
          <Card title="Stamp">
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Color</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <input type="color" value={stmp.color.startsWith('#')?stmp.color:'#1d4ed8'} onChange={e=>onUpdate(stmp.id,{color:e.target.value} as Partial<PDFElement>)} style={{ width:28,height:22,border:'none',borderRadius:4,cursor:'pointer',padding:1 }}/>
              <span style={{ fontSize:9.5,color:'#94a3b8',fontFamily:'monospace' }}>{stmp.color}</span>
            </div>
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Opacity {Math.round(stmp.opacity*100)}%</p>
            <input type="range" min={10} max={100} step={5} value={Math.round(stmp.opacity*100)}
              onChange={e=>onUpdate(stmp.id,{opacity:parseInt(e.target.value)/100} as Partial<PDFElement>)}
              style={{ width:'100%', accentColor:'#4f6ef7' }}/>
          </Card>
        )}

        {/* ── DRAW ──────────────────────────────── */}
        {drw && (
          <Card title="Drawing">
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Color</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <input type="color" value={drw.color} onChange={e=>onUpdate(drw.id,{color:e.target.value} as Partial<PDFElement>)} style={{ width:28,height:22,border:'none',borderRadius:4,cursor:'pointer',padding:1 }}/>
            </div>
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Stroke Width</p>
            <div style={{ display:'flex', gap:4, marginBottom:10 }}>
              {[2,4,8].map(w=><button key={w} onClick={()=>onUpdate(drw.id,{strokeWidth:w} as Partial<PDFElement>)} style={{ flex:1,padding:'4px 0',borderRadius:6,fontSize:11,fontWeight:700,border:`1.5px solid ${drw.strokeWidth===w?'#4f6ef7':'#e2e8f0'}`,background:drw.strokeWidth===w?'#4f6ef7':'#f8faff',color:drw.strokeWidth===w?'#fff':'#475569',cursor:'pointer' }}>{w}px</button>)}
            </div>
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Opacity {Math.round(drw.opacity*100)}%</p>
            <input type="range" min={10} max={100} step={5} value={Math.round(drw.opacity*100)}
              onChange={e=>onUpdate(drw.id,{opacity:parseInt(e.target.value)/100} as Partial<PDFElement>)}
              style={{ width:'100%', accentColor:'#4f6ef7' }}/>
          </Card>
        )}

        {/* ── WATERMARK ─────────────────────────── */}
        {wm && (
          <Card title="Watermark">
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Color</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <input type="color" value={wm.color} onChange={e=>onUpdate(wm.id,{color:e.target.value} as Partial<PDFElement>)} style={{ width:28,height:22,border:'none',borderRadius:4,cursor:'pointer',padding:1 }}/>
            </div>
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Opacity {Math.round(wm.opacity*100)}%</p>
            <input type="range" min={5} max={80} step={5} value={Math.round(wm.opacity*100)}
              onChange={e=>onUpdate(wm.id,{opacity:parseInt(e.target.value)/100} as Partial<PDFElement>)}
              style={{ width:'100%', accentColor:'#4f6ef7', marginBottom:8 }}/>
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Size {wm.fontSize}pt</p>
            <input type="range" min={20} max={120} step={4} value={wm.fontSize}
              onChange={e=>onUpdate(wm.id,{fontSize:parseInt(e.target.value)} as Partial<PDFElement>)}
              style={{ width:'100%', accentColor:'#4f6ef7', marginBottom:8 }}/>
            <p style={{ margin:'0 0 5px', fontSize:9.5, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Angle {wm.rotation}°</p>
            <input type="range" min={-90} max={90} step={5} value={wm.rotation}
              onChange={e=>onUpdate(wm.id,{rotation:parseInt(e.target.value)} as Partial<PDFElement>)}
              style={{ width:'100%', accentColor:'#4f6ef7' }}/>
          </Card>
        )}

        {/* ── GENERAL OPACITY (for any selected element without dedicated section) ── */}
        {selected && !hl && !stmp && !drw && !wm && selected.type !== 'image' && selected.type !== 'signature' && selected.opacity !== undefined && (
          <Card title="Opacity">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:11, color:'#64748b' }}>Opacity</span>
              <span style={{ fontSize:11, fontWeight:700 }}>{Math.round((selected.opacity??1)*100)}%</span>
            </div>
            <input type="range" min={10} max={100} step={5} value={Math.round((selected.opacity??1)*100)}
              onChange={e=>onUpdate(selected.id,{opacity:parseInt(e.target.value)/100} as Partial<PDFElement>)}
              style={{ width:'100%', accentColor:'#4f6ef7' }}/>
          </Card>
        )}

        {/* ── STAMPS ────────────────────────────── */}
        <Card title="Stamps">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {[{ label: 'APPROVED', color: 'blue' }, { label: 'URGENT', color: 'red' },
              { label: 'CONFIDENTIAL', color: 'orange' }, { label: 'DRAFT', color: 'gray' }].map(({ label, color }) => (
              <button key={label} onClick={() => onAddStamp(label, color)}
                style={{
                  padding: '5px 4px', borderRadius: 5,
                  border: `1.5px solid ${STAMP_COLORS[color]}`,
                  background: `${STAMP_COLORS[color]}12`,
                  color: STAMP_COLORS[color], fontSize: 9.5, fontWeight: 800,
                  cursor: 'pointer', letterSpacing: '0.04em',
                }}>
                {label}
              </button>
            ))}
          </div>
        </Card>

        {/* ── PAGE INFO ─────────────────────────── */}
        <Card title="Page">
          <div style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.8 }}>
            <div>Page <b>{currentPage}</b> of <b>{totalPages}</b></div>
            <div>Elements: <b>{pageBoxCount}</b></div>
          </div>
          {selected && (
            <button onClick={() => onDelete(selected.id)} style={{ ...dangerBtn, marginTop: 8 }}>
              Delete Element
            </button>
          )}
          {pageBoxCount > 0 && (
            <button onClick={onClearPage} style={{ ...ghostBtn, marginTop: 5 }}>
              Clear Page
            </button>
          )}
        </Card>

        {/* AI hint */}
        <div style={{
          display: 'flex', gap: 8, padding: 10, borderRadius: 10,
          background: 'rgba(79,110,247,0.07)', border: '1px solid rgba(79,110,247,0.15)',
        }}>
          <span style={{ fontSize: 16 }}>✨</span>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#4f6ef7' }}>AI Assistant</p>
            <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6b7aa1' }}>Smart suggestions coming soon</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ── Mini helpers ──────────────────────────────────────────────────────────────
function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: 22, height: 22, borderRadius: 5, border: '1px solid #e2e8f0',
      background: '#fff', cursor: 'pointer', fontSize: 14, color: '#475569',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  )
}

function Toggle({ active, onClick, children, style }: {
  active: boolean; onClick: () => void; children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <button onClick={onClick} style={{
      width: 26, height: 26, borderRadius: 5, border: 'none',
      background: active ? '#4f6ef7' : '#f1f5f9',
      color: active ? '#fff' : '#475569',
      cursor: 'pointer', fontSize: 12, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>{children}</button>
  )
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '5px 7px', borderRadius: 6,
  border: '1px solid #e2e8f0', background: '#fff',
  fontSize: 11.5, color: '#1e293b', cursor: 'pointer',
}

const dangerBtn: React.CSSProperties = {
  width: '100%', padding: '5px 0', borderRadius: 6,
  border: '1px solid #fca5a5', background: '#fff1f2',
  color: '#dc2626', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
}

const ghostBtn: React.CSSProperties = {
  width: '100%', padding: '5px 0', borderRadius: 6,
  border: '1px solid #e2e8f0', background: 'transparent',
  color: '#64748b', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
}
