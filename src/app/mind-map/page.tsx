'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

// ─── palette (one colour per PDF) ────────────────────────────────────────────
const COLORS = ['#0891b2','#7c3aed','#16a34a','#dc2626','#d97706','#db2777','#2563eb','#059669']
const LIGHTS = ['#cffafe','#ede9fe','#bbf7d0','#fecaca','#fde68a','#fbcfe8','#bfdbfe','#a7f3d0']

// ─── types ────────────────────────────────────────────────────────────────────
interface Source  { name: string; text: string; idx: number; pages: number; chars: number }
interface RawNode { id: string; label: string; description: string; type: 'center'|'branch'|'leaf'; sourceIdx: number }
interface RawEdge { from: string; to: string; type: 'tree'|'cross'; label?: string }
interface MapAPI  { title: string; nodes: RawNode[]; edges: RawEdge[] }
interface PNode   extends RawNode { x: number; y: number }

// ─── helpers ─────────────────────────────────────────────────────────────────
const col  = (si: number) => si < 0 ? '#1d1d1f' : COLORS[si % COLORS.length]
const bg   = (si: number) => si < 0 ? '#1d1d1f' : COLORS[si % COLORS.length]
const lite = (si: number) => si < 0 ? '#f5f5f7' : LIGHTS[si % LIGHTS.length]
const rad  = (t: PNode['type']) => t === 'center' ? 46 : t === 'branch' ? 28 : 18

function layout(data: MapAPI): PNode[] {
  const R1 = 300, R2 = 155
  const out: PNode[] = []
  const pos: Record<string, { x: number; y: number }> = {}

  const center = data.nodes.find(n => n.type === 'center')
  if (center) { pos[center.id] = { x: 0, y: 0 }; out.push({ ...center, x: 0, y: 0 }) }

  const branches = data.nodes.filter(n => n.type === 'branch')

  // Group branches by sourceIdx so each PDF gets its own angular sector
  const srcGroups = new Map<number, typeof branches>()
  branches.forEach(b => {
    if (!srcGroups.has(b.sourceIdx)) srcGroups.set(b.sourceIdx, [])
    srcGroups.get(b.sourceIdx)!.push(b)
  })
  const srcList = Array.from(srcGroups.entries()).sort((a, b) => a[0] - b[0])
  const nSrc    = srcList.length || 1

  const branchAngle: Record<string, number> = {}

  srcList.forEach(([, brs], sIdx) => {
    const sectorCenter = (2 * Math.PI * sIdx / nSrc) - Math.PI / 2
    const sectorWidth  = (2 * Math.PI / nSrc) * 0.82
    brs.forEach((b: typeof branches[0], bi: number) => {
      const a = brs.length === 1
        ? sectorCenter
        : sectorCenter - sectorWidth / 2 + sectorWidth * bi / (brs.length - 1)
      const x = Math.cos(a) * R1, y = Math.sin(a) * R1
      pos[b.id] = { x, y }
      branchAngle[b.id] = a
      out.push({ ...b, x, y })
    })
  })

  // Place leaves radiating outward from each branch
  branches.forEach(b => {
    const bp = pos[b.id]; if (!bp) return
    const ba  = branchAngle[b.id] ?? Math.atan2(bp.y, bp.x)
    const ids = data.edges.filter(e => e.from === b.id && e.type === 'tree').map(e => e.to)
    const lvs = data.nodes.filter(n => ids.includes(n.id))
    if (!lvs.length) return
    const spread = Math.min(Math.PI * 0.62, Math.PI * 0.17 * lvs.length)
    lvs.forEach((lf, li) => {
      const a = lvs.length === 1 ? ba : ba - spread / 2 + spread * li / (lvs.length - 1)
      const x = bp.x + Math.cos(a) * R2, y = bp.y + Math.sin(a) * R2
      pos[lf.id] = { x, y }; out.push({ ...lf, x, y })
    })
  })

  data.nodes.forEach(n => { if (!pos[n.id]) out.push({ ...n, x: 0, y: 0 }) })
  return out
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1
  const ox = (x1 + x2) / 2 - (dy / len) * len * 0.18
  const oy = (y1 + y2) / 2 + (dx / len) * len * 0.18
  return `M${x1},${y1} Q${ox},${oy} ${x2},${y2}`
}

function wrap(s: string): string[] {
  const w = s.split(' ')
  if (w.length <= 2) return [s]
  const m = Math.ceil(w.length / 2)
  return [w.slice(0, m).join(' '), w.slice(m).join(' ')]
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

/* Nav */
.nav{height:52px;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0;z-index:100}
.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#0891b2}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s;white-space:nowrap}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.35;cursor:not-allowed}

/* Body split */
.body{flex:1;display:flex;overflow:hidden}

/* Sidebar */
.sb{width:260px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden}
.sb-head{padding:14px 14px 10px;border-bottom:1px solid #f0f0f0;flex-shrink:0}
.sb-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}

/* Drop zone */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:16px 12px;text-align:center;cursor:pointer;transition:all .15s;background:#fafafa;margin:0 14px 10px}
.drop:hover,.drop.over{border-color:#0891b2;background:#ecfeff}
.drop-icon{font-size:22px;margin-bottom:5px}
.drop-txt{font-size:11px;font-weight:600;color:rgba(0,0,0,.5);margin-bottom:6px}
.drop-sub{font-size:10px;color:rgba(0,0,0,.3)}
.drop-btn{display:inline-flex;align-items:center;gap:4px;margin-top:8px;padding:5px 12px;background:#1d1d1f;border:none;border-radius:7px;color:#fff;font-size:11px;font-weight:700;cursor:pointer;transition:background .13s}
.drop-btn:hover{background:#0891b2}

/* Source list */
.src-list{flex:1;overflow-y:auto;padding:4px 14px 0}
.src-item{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:9px;margin-bottom:4px;background:#f8f8f8;border:1.5px solid transparent;transition:all .12s}
.src-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.src-name{flex:1;font-size:11px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.src-rm{width:18px;height:18px;border-radius:4px;border:none;background:transparent;color:rgba(0,0,0,.3);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .12s}
.src-rm:hover{background:#fee2e2;color:#dc2626}
.src-stat{font-size:9px;font-weight:600;color:rgba(0,0,0,.35);margin-top:1px}
.src-warn{font-size:9px;font-weight:700;color:#d97706}
.extr-bar{padding:8px 14px;display:flex;align-items:center;gap:8px;background:#f0fdf4;border-bottom:1px solid #bbf7d0;flex-shrink:0;font-size:11px;font-weight:700;color:#15803d}
.extr-spin{width:12px;height:12px;border:2px solid #bbf7d0;border-top-color:#16a34a;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}

/* Generate button */
.gen-wrap{padding:12px 14px;flex-shrink:0}
.gen-btn{width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#0891b2,#0e7490);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(8,145,178,.3)}
.gen-btn:hover:not(:disabled){background:linear-gradient(135deg,#0e7490,#155e75);transform:translateY(-1px)}
.gen-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}

/* Legend */
.legend{padding:10px 14px;border-top:1px solid #f0f0f0;flex-shrink:0}
.leg-ttl{font-size:9px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
.leg-item{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.leg-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.leg-name{font-size:10px;font-weight:600;color:rgba(0,0,0,.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* Graph area */
.graph-area{flex:1;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 50%, #f0f9ff 0%, #f5f5f7 100%)}
.graph-svg{display:block;width:100%;height:100%;cursor:grab}
.graph-svg:active{cursor:grabbing}

/* Graph controls */
.g-ctrl{position:absolute;top:14px;right:14px;display:flex;gap:6px;z-index:10}
.g-ctrl button{width:32px;height:32px;border-radius:8px;border:1px solid rgba(0,0,0,.1);background:rgba(255,255,255,.9);backdrop-filter:blur(8px);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1d1d1f;transition:all .12s;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.g-ctrl button:hover{background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.14)}
.g-hint{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:600;color:rgba(0,0,0,.3);white-space:nowrap;pointer-events:none;background:rgba(255,255,255,.8);padding:4px 10px;border-radius:99px;backdrop-filter:blur(8px)}
.map-title{position:absolute;top:14px;left:50%;transform:translateX(-50%);font-size:12px;font-weight:700;color:rgba(0,0,0,.5);white-space:nowrap;pointer-events:none;background:rgba(255,255,255,.85);padding:4px 12px;border-radius:99px;backdrop-filter:blur(8px)}

/* Loading / empty */
.graph-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center}
.spinner{width:44px;height:44px;border:4px solid #e8e8ea;border-top-color:#0891b2;border-radius:50%;animation:spin .8s linear infinite}
.graph-empty-icon{font-size:56px;opacity:.25}
.graph-empty-ttl{font-size:16px;font-weight:700;color:rgba(0,0,0,.35)}
.graph-empty-sub{font-size:12px;color:rgba(0,0,0,.28);max-width:280px;line-height:1.6}
.gen-step{font-size:13px;font-weight:700;color:#0891b2;animation:pulse .9s infinite}

/* Detail panel */
.detail{width:280px;flex-shrink:0;background:#fff;border-left:1px solid #e8e8e8;display:flex;flex-direction:column;overflow:hidden;animation:fadeup .2s ease}
.detail-head{padding:12px 14px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:8px}
.detail-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;padding:2px 7px;border-radius:99px}
.detail-close{margin-left:auto;width:22px;height:22px;border-radius:5px;border:none;background:#f0f0f0;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.5)}
.detail-close:hover{background:#e0e0e0}
.detail-body{padding:14px;flex:1;overflow-y:auto}
.detail-label{font-size:16px;font-weight:800;color:#1d1d1f;margin-bottom:12px;line-height:1.3}
.detail-summary-head{font-size:9px;font-weight:700;color:rgba(0,0,0,.35);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
.detail-summary-box{background:#f8f9fa;border-left:3px solid #0891b2;border-radius:0 8px 8px 0;padding:10px 12px;margin-bottom:14px}
.detail-summary-text{font-size:12.5px;color:#1d1d1f;line-height:1.7;font-weight:500}
.detail-src{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;padding:6px 9px;border-radius:8px}

/* Error */
.err-bar{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);background:#fef2f2;color:#dc2626;border:1px solid rgba(220,38,38,.2);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;z-index:20;max-width:400px;text-align:center}

/* Landing */
.landing{flex:1;display:flex;align-items:center;justify-content:center;padding:40px}
.landing-inner{max-width:560px;width:100%;text-align:center}
.landing-title{font-size:32px;font-weight:800;color:#1d1d1f;letter-spacing:-.04em;margin-bottom:10px}
.landing-sub{font-size:14px;color:rgba(0,0,0,.4);margin-bottom:32px;line-height:1.6}
.landing-drop{border:2px dashed #d0d0d0;border-radius:18px;padding:48px 32px;cursor:pointer;transition:all .15s;background:#fafafa}
.landing-drop:hover,.landing-drop.over{border-color:#0891b2;background:#ecfeff}
.landing-icon{font-size:44px;margin-bottom:12px}
.landing-drop-txt{font-size:14px;font-weight:700;color:rgba(0,0,0,.5);margin-bottom:6px}
.landing-drop-sub{font-size:12px;color:rgba(0,0,0,.3);margin-bottom:16px}
.landing-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 22px;background:#1d1d1f;border:none;border-radius:9px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:background .13s}
.landing-btn:hover{background:#0891b2}
.feat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px;text-align:left}
.feat{padding:12px;border:1px solid #e8e8e8;border-radius:12px}
.feat-icon{font-size:20px;margin-bottom:4px}
.feat-t{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.feat-d{font-size:10px;color:rgba(0,0,0,.38);line-height:1.5}
`

// ─── component ────────────────────────────────────────────────────────────────
export default function MindMapPage() {
  const [sources,    setSources]    = useState<Source[]>([])
  const [extracting, setExtracting] = useState(false)
  const [extrFile,   setExtrFile]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [genStep,    setGenStep]    = useState('')
  const [mapData,  setMapData]  = useState<MapAPI | null>(null)
  const [nodes,    setNodes]    = useState<PNode[]>([])
  const [edges,    setEdges]    = useState<RawEdge[]>([])
  const [err,      setErr]      = useState<string | null>(null)
  const [selected, setSelected] = useState<PNode | null>(null)
  const [hovered,  setHovered]  = useState<string | null>(null)
  const [vp,       setVp]       = useState({ x: 0, y: 0, z: 1 })
  const [sz,       setSz]       = useState({ w: 900, h: 650 })
  const [dropOver, setDropOver] = useState(false)
  const [landDrop, setLandDrop] = useState(false)

  const svgRef   = useRef<SVGSVGElement>(null)
  const fileRef  = useRef<HTMLInputElement>(null)
  const dragRef  = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)

  // track SVG size
  useEffect(() => {
    if (!svgRef.current) return
    const obs = new ResizeObserver(es => {
      const r = es[0].contentRect
      setSz({ w: r.width, h: r.height })
    })
    obs.observe(svgRef.current)
    return () => obs.disconnect()
  }, [nodes.length]) // re-observe once graph is shown

  const addPDFs = useCallback(async (files: File[]) => {
    const valid = files.filter(f => f.type === 'application/pdf')
    if (!valid.length) return
    setExtracting(true); setErr(null)

    let pdfjsLib: any
    try {
      pdfjsLib = await import('pdfjs-dist')
      // Try cdnjs first, fall back to unpkg
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    } catch {
      setErr('Failed to load PDF engine. Check your internet connection.')
      setExtracting(false)
      return
    }

    const currentCount = sources.length
    const next: Source[] = []

    for (const file of valid) {
      const idx = currentCount + next.length
      if (idx >= 8) break
      setExtrFile(file.name)
      try {
        const buf = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise
        const numPages: number = pdf.numPages
        let text = ''
        for (let p = 1; p <= numPages; p++) {
          const pg  = await pdf.getPage(p)
          const tc  = await pg.getTextContent()
          // join with space, preserve line breaks between items
          const row = (tc.items as any[]).map((i: any) => i.str).join(' ')
          text += row + '\n'
        }
        const trimmed = text.replace(/\s+/g, ' ').trim()
        next.push({
          name:  file.name.replace(/\.pdf$/i, ''),
          text:  trimmed.slice(0, 50000),
          idx,
          pages: numPages,
          chars: trimmed.length,
        })
      } catch (e: any) {
        setErr(`Could not read "${file.name}". It may be a scanned/image PDF or password-protected.`)
      }
    }

    setExtracting(false); setExtrFile('')
    if (next.length) {
      setSources(prev => [...prev, ...next])
      setMapData(null); setNodes([]); setEdges([])
    }
  }, [sources.length])

  const removePDF = (idx: number) => {
    setSources(prev => {
      const arr = prev.filter(s => s.idx !== idx).map((s, i) => ({ ...s, idx: i }))
      return arr
    })
    setMapData(null); setNodes([]); setEdges([]); setSelected(null)
  }

  const generate = async () => {
    if (!sources.length || loading) return
    // Make sure at least one source actually has text
    const noText = sources.filter(s => s.chars < 30)
    if (noText.length === sources.length) {
      setErr('No text could be extracted from the uploaded PDFs. Please use a text-based PDF.')
      return
    }
    const usable = sources.filter(s => s.chars >= 30)
    setLoading(true); setErr(null); setMapData(null); setNodes([]); setEdges([]); setSelected(null)
    try {
      setGenStep('Sending text to AI…')
      const res = await fetch('/api/mind-map', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ sources: usable.map(s => ({ name: s.name, text: s.text })) }),
      })
      setGenStep('Building graph…')
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? `HTTP ${res.status}`) }
      const data: MapAPI = await res.json()
      const laid = layout(data)
      setMapData(data)
      setNodes(laid)
      setEdges(data.edges)
      // Auto-fit zoom: more nodes → zoom out more
      const n = laid.length
      const z = n > 60 ? 0.38 : n > 40 ? 0.48 : n > 25 ? 0.62 : n > 15 ? 0.78 : 1
      setVp({ x: 0, y: 0, z })
    } catch (e: any) { setErr(e.message) }
    finally { setLoading(false); setGenStep('') }
  }

  // ── pan / zoom ──────────────────────────────────────────────────────────────
  const onSvgDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('g.node')) return
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: vp.x, oy: vp.y }
  }
  const onSvgMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragRef.current) return
    setVp(v => ({ ...v, x: dragRef.current!.ox + (e.clientX - dragRef.current!.sx), y: dragRef.current!.oy + (e.clientY - dragRef.current!.sy) }))
  }
  const onSvgUp = () => { dragRef.current = null }
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    const f    = e.deltaY < 0 ? 1.12 : 0.9
    const rect = svgRef.current!.getBoundingClientRect()
    const mx   = e.clientX - rect.left - sz.w / 2
    const my   = e.clientY - rect.top  - sz.h / 2
    setVp(v => {
      const nz = Math.max(0.15, Math.min(4, v.z * f))
      const s  = nz / v.z
      return { x: mx * (1 - s) + v.x * s, y: my * (1 - s) + v.y * s, z: nz }
    })
  }

  // ── drag-drop ───────────────────────────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent, land = false) => {
    e.preventDefault(); setDropOver(false); setLandDrop(false)
    addPDFs(Array.from(e.dataTransfer.files))
  }, [addPDFs])

  const nodeById = (id: string) => nodes.find(n => n.id === id)

  const cx = sz.w / 2 + vp.x
  const cy = sz.h / 2 + vp.y

  const showGraph = nodes.length > 0 && !loading

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── LANDING (no sources yet) ─────────────────────────────────────── */}
      {sources.length === 0 && !loading && !extracting ? (
        <div className="pg">
          <nav className="nav">
            <Link href="/" className="logo">
              <div className="logo-mark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/><polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/></svg></div>
              <span className="logo-name">Edit<em>PDF</em> AI</span>
            </Link>
            <span className="nav-sep">›</span>
            <span className="nav-title">PDF Mind Map</span>
          </nav>
          <div className="landing">
            <div className="landing-inner">
              <div className="landing-title">PDF Mind Map</div>
              <div className="landing-sub">Upload multiple PDFs and instantly visualise connections between them as a colour-coded knowledge graph.</div>
              <div className={`landing-drop${landDrop ? ' over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDrop={e => onDrop(e, true)}
                onDragOver={e => { e.preventDefault(); setLandDrop(true) }}
                onDragLeave={() => setLandDrop(false)}>
                {extracting ? (
                  <>
                    <div style={{fontSize:32,marginBottom:10}}>⏳</div>
                    <div className="landing-drop-txt" style={{color:'#0891b2'}}>Reading {extrFile || 'PDF'}…</div>
                    <div className="landing-drop-sub">Extracting text from your document</div>
                  </>
                ) : (
                  <>
                    <div className="landing-icon">🧠</div>
                    <div className="landing-drop-txt">Drop PDFs here</div>
                    <div className="landing-drop-sub">Upload 1–8 PDF files to begin</div>
                    <button className="landing-btn">📄 Choose PDFs</button>
                  </>
                )}
              </div>
              <div className="feat-row">
                <div className="feat"><div className="feat-icon">🎨</div><div className="feat-t">Color by source</div><div className="feat-d">Each PDF gets its own colour in the graph</div></div>
                <div className="feat"><div className="feat-icon">🔗</div><div className="feat-t">Cross-links</div><div className="feat-d">Shows connections between concepts across documents</div></div>
                <div className="feat"><div className="feat-icon">🤖</div><div className="feat-t">AI-powered</div><div className="feat-d">Claude extracts key ideas and relationships</div></div>
              </div>
            </div>
          </div>
        </div>
      ) : (

      // ── MAIN APP ──────────────────────────────────────────────────────────
      <div className="pg">
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/><polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/></svg></div>
            <span className="logo-name">Edit<em>PDF</em> AI</span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">PDF Mind Map</span>
          <div className="nav-sp"/>
          {showGraph && <span style={{fontSize:11,fontWeight:700,color:'rgba(0,0,0,.4)'}}>{mapData?.title}</span>}
          <button className="nbtn sec" onClick={() => { setSources([]); setMapData(null); setNodes([]); setEdges([]); setSelected(null) }}>← New</button>
        </nav>

        <div className="body">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <div className="sb">
            {/* Extraction progress bar */}
            {extracting && (
              <div className="extr-bar">
                <div className="extr-spin"/>
                Reading {extrFile || 'PDF'}…
              </div>
            )}

            <div className="sb-head">
              <div className="sb-ttl">PDF Sources ({sources.length}/8)</div>
              {/* Drop zone inside sidebar */}
              <div className={`drop${dropOver ? ' over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDrop={e => onDrop(e)}
                onDragOver={e => { e.preventDefault(); setDropOver(true) }}
                onDragLeave={() => setDropOver(false)}>
                <div className="drop-icon">📎</div>
                <div className="drop-txt">Add more PDFs</div>
                <div className="drop-sub">Up to 8 total</div>
                <button className="drop-btn">+ Choose Files</button>
              </div>
            </div>

            {/* Source list */}
            <div className="src-list">
              {sources.map(s => (
                <div key={s.idx} className="src-item" style={{ borderColor: COLORS[s.idx % COLORS.length] }}>
                  <div className="src-dot" style={{ background: COLORS[s.idx % COLORS.length] }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="src-name" title={s.name}>{s.name}</div>
                    {s.chars >= 30
                      ? <div className="src-stat">{s.pages}p · {(s.chars / 1000).toFixed(1)}k chars</div>
                      : <div className="src-warn">⚠ No text found</div>
                    }
                  </div>
                  <button className="src-rm" onClick={() => removePDF(s.idx)}>×</button>
                </div>
              ))}
            </div>

            {/* Generate button */}
            <div className="gen-wrap">
              <button className="gen-btn" onClick={generate}
                disabled={loading || extracting || sources.length === 0 || sources.every(s => s.chars < 30)}>
                {loading ? genStep || 'Generating…' : extracting ? 'Extracting text…' : '✦ Generate Mind Map'}
              </button>
            </div>

            {/* Legend */}
            {showGraph && (
              <div className="legend">
                <div className="leg-ttl">Legend</div>
                <div className="leg-item">
                  <div className="leg-dot" style={{ background: '#1d1d1f' }}/>
                  <span className="leg-name">Central theme</span>
                </div>
                {sources.map(s => (
                  <div key={s.idx} className="leg-item">
                    <div className="leg-dot" style={{ background: COLORS[s.idx % COLORS.length] }}/>
                    <span className="leg-name">{s.name}</span>
                  </div>
                ))}
                <div className="leg-item" style={{ marginTop: 4 }}>
                  <div style={{ width: 22, height: 2, borderTop: '1.5px dashed #aaa', marginRight: 4, flexShrink: 0 }}/>
                  <span className="leg-name" style={{ color: '#aaa' }}>Cross-link</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Graph area ───────────────────────────────────────────────── */}
          <div className="graph-area">
            {loading ? (
              <div className="graph-center">
                <div className="spinner"/>
                <div className="gen-step">{genStep}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,.3)' }}>This takes 5-15 seconds</div>
              </div>
            ) : !showGraph ? (
              <div className="graph-center">
                <div className="graph-empty-icon">🧠</div>
                <div className="graph-empty-ttl">Ready to map</div>
                <div className="graph-empty-sub">Click <strong>Generate Mind Map</strong> to build an interactive knowledge graph from your PDFs</div>
              </div>
            ) : (
              <>
                {mapData && <div className="map-title">{mapData.title}</div>}

                {/* SVG graph */}
                <svg ref={svgRef} className="graph-svg"
                  onMouseDown={onSvgDown} onMouseMove={onSvgMove}
                  onMouseUp={onSvgUp}    onMouseLeave={onSvgUp}
                  onWheel={onWheel}
                  onClick={() => setSelected(null)}>

                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.12"/>
                    </filter>
                    {/* Arrowhead marker */}
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#bbb"/>
                    </marker>
                  </defs>

                  {/* Background dot-grid */}
                  <pattern id="grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="14" cy="14" r="1" fill="rgba(0,0,0,.06)"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)"/>

                  <g transform={`translate(${cx},${cy}) scale(${vp.z})`}>

                    {/* ── Edges ─────────────────────────────────────────── */}
                    {/* Cross edges first (below tree edges) */}
                    {edges.filter(e => e.type === 'cross').map((e, i) => {
                      const f = nodeById(e.from), t = nodeById(e.to)
                      if (!f || !t) return null
                      const d = curve(f.x, f.y, t.x, t.y)
                      return (
                        <g key={`cross-${i}`}>
                          <path d={d} fill="none" stroke="#bbb" strokeWidth={1.2}
                            strokeDasharray="5 4" opacity={0.7} markerEnd="url(#arrow)"/>
                          {e.label && (() => {
                            const mx = (f.x + t.x) / 2, my = (f.y + t.y) / 2
                            return (
                              <text x={mx} y={my - 5} textAnchor="middle"
                                fontSize={8} fill="#aaa" fontWeight={600}>
                                {e.label}
                              </text>
                            )
                          })()}
                        </g>
                      )
                    })}

                    {/* Tree edges */}
                    {edges.filter(e => e.type === 'tree').map((e, i) => {
                      const f = nodeById(e.from), t = nodeById(e.to)
                      if (!f || !t) return null
                      const c  = col(t.sourceIdx)
                      const hw = hovered === f.id || hovered === t.id
                      return (
                        <path key={`tree-${i}`}
                          d={curve(f.x, f.y, t.x, t.y)}
                          fill="none"
                          stroke={c}
                          strokeWidth={hw ? 3 : 2}
                          opacity={hw ? 1 : 0.45}
                          style={{ transition: 'all .15s' }}
                        />
                      )
                    })}

                    {/* ── Nodes ─────────────────────────────────────────── */}
                    {nodes.map(n => {
                      const r    = rad(n.type)
                      const c    = bg(n.sourceIdx)
                      const lc   = lite(n.sourceIdx)
                      const isSel = selected?.id === n.id
                      const isHov = hovered === n.id
                      const lines = wrap(n.label)
                      const fs    = n.type === 'center' ? 11 : n.type === 'branch' ? 10 : 9
                      const textCol = n.type === 'center' ? '#fff' : n.type === 'branch' ? '#fff' : c

                      return (
                        <g key={n.id} className="node"
                          transform={`translate(${n.x},${n.y})`}
                          style={{ cursor: 'pointer' }}
                          onClick={e => { e.stopPropagation(); setSelected(isSel ? null : n) }}
                          onMouseEnter={() => setHovered(n.id)}
                          onMouseLeave={() => setHovered(null)}>

                          {/* Glow ring for selected */}
                          {isSel && (
                            <circle r={r + 10} fill="none" stroke={c} strokeWidth={2} opacity={0.35}
                              filter="url(#glow)"/>
                          )}

                          {/* Main circle */}
                          <circle r={r + (isHov ? 3 : 0)}
                            fill={n.type === 'leaf' ? lc : c}
                            stroke={isSel ? '#fff' : n.type === 'leaf' ? c : 'none'}
                            strokeWidth={isSel ? 3 : n.type === 'leaf' ? 1.5 : 0}
                            filter="url(#shadow)"
                            style={{ transition: 'r .15s' }}/>

                          {/* Label text */}
                          {lines.map((line, li) => (
                            <text key={li}
                              y={(li - (lines.length - 1) / 2) * (fs * 1.3)}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={fs}
                              fontWeight={800}
                              fill={textCol}
                              style={{ pointerEvents: 'none', userSelect: 'none' }}>
                              {line}
                            </text>
                          ))}
                        </g>
                      )
                    })}
                  </g>
                </svg>

                {/* Zoom controls */}
                <div className="g-ctrl">
                  <button onClick={() => setVp(v => ({ ...v, z: Math.min(4, v.z * 1.2) }))}>+</button>
                  <button onClick={() => setVp(v => ({ ...v, z: Math.max(0.15, v.z * 0.85) }))}>−</button>
                  <button onClick={() => setVp({ x: 0, y: 0, z: 1 })} title="Reset view">⊙</button>
                </div>

                <div className="g-hint">Drag to pan · Scroll to zoom · Click node for details</div>
              </>
            )}

            {err && <div className="err-bar">⚠ {err}</div>}
          </div>

          {/* ── Detail panel ─────────────────────────────────────────────── */}
          {selected && (
            <div className="detail">
              <div className="detail-head">
                <div className="detail-type"
                  style={{
                    background: selected.type === 'center' ? '#1d1d1f' : lite(selected.sourceIdx),
                    color:      selected.type === 'center' ? '#fff'    : col(selected.sourceIdx),
                  }}>
                  {selected.type}
                </div>
                <button className="detail-close" onClick={() => setSelected(null)}>×</button>
              </div>
              <div className="detail-body">
                <div className="detail-label">{selected.label}</div>
                <div className="detail-summary-head">Summary</div>
                <div className="detail-summary-box"
                  style={{ borderLeftColor: selected.type === 'center' ? '#1d1d1f' : col(selected.sourceIdx) }}>
                  <div className="detail-summary-text">{selected.description || '—'}</div>
                </div>

                {selected.sourceIdx >= 0 && sources[selected.sourceIdx] && (
                  <div className="detail-src"
                    style={{
                      background: lite(selected.sourceIdx),
                      color:      col(selected.sourceIdx),
                    }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col(selected.sourceIdx), flexShrink: 0 }}/>
                    📄 {sources[selected.sourceIdx].name}
                  </div>
                )}

                {/* Connected nodes */}
                {(() => {
                  const connected = edges
                    .filter(e => e.from === selected.id || e.to === selected.id)
                    .map(e => {
                      const otherId = e.from === selected.id ? e.to : e.from
                      const other   = nodeById(otherId)
                      return other ? { node: other, type: e.type, label: e.label } : null
                    })
                    .filter(Boolean) as { node: PNode; type: string; label?: string }[]

                  if (!connected.length) return null
                  return (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,.3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Connected</div>
                      {connected.map((c, i) => (
                        <div key={i}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 7, background: '#f8f8f8', marginBottom: 4, cursor: 'pointer' }}
                          onClick={() => setSelected(c.node)}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: col(c.node.sourceIdx), flexShrink: 0 }}/>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#1d1d1f', flex: 1 }}>{c.node.label}</span>
                          {c.type === 'cross' && <span style={{ fontSize: 9, color: '#aaa' }}>cross</span>}
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

        </div>
      </div>
      )}

      <input ref={fileRef} type="file" multiple accept="application/pdf" style={{ display: 'none' }}
        onChange={e => { if (e.target.files) addPDFs(Array.from(e.target.files)); e.target.value = '' }}/>
    </>
  )
}
