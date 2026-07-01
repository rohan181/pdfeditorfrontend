'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

type LengthOpt = 'brief' | 'standard' | 'detailed'
type FocusOpt  = 'general' | 'technical' | 'legal' | 'medical' | 'financial'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

/* Shell */
.pg{min-height:100vh;display:flex;flex-direction:column;background:#f5f5f7;padding-top:56px;}

/* Nav */

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#8b5cf6}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s;white-space:nowrap}
.nbtn.pri{background:#8b5cf6;color:#fff}.nbtn.pri:hover{background:#7c3aed}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.38;cursor:not-allowed}

/* Two-column layout */
.workspace{flex:1;display:flex;gap:0;overflow:hidden}

/* Left: upload + settings */
.left{width:280px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.lp-sec{padding:14px 16px;border-bottom:1px solid #f0f0f0}
.lp-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}

/* Drop zone */
.drop-z{border:2px dashed #d0d0d0;border-radius:12px;padding:28px 16px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.drop-z:hover,.drop-z.over{border-color:#8b5cf6;background:#faf5ff}
.drop-icon{font-size:34px;margin-bottom:8px}
.drop-name{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.drop-meta{font-size:10px;color:rgba(0,0,0,.35)}
.drop-btn{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;background:#1d1d1f;border-radius:7px;font-size:11px;font-weight:700;color:#fff;border:none;cursor:pointer;margin-top:10px;transition:background .13s}
.drop-btn:hover{background:#8b5cf6}

/* Settings */
.seg{display:flex;border:1.5px solid #e0e0e0;border-radius:8px;overflow:hidden;flex-wrap:wrap}
.seg-btn{flex:1;padding:7px 4px;font-size:10px;font-weight:700;border:none;background:#fff;cursor:pointer;color:rgba(0,0,0,.4);transition:all .12s;text-align:center;white-space:nowrap}
.seg-btn.sel{background:#8b5cf6;color:#fff}
.seg-btn:not(.sel):hover{background:#faf5ff;color:#7c3aed}

.focus-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.focus-btn{padding:7px 8px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;font-size:10px;font-weight:700;color:rgba(0,0,0,.45);transition:all .12s;text-align:left;display:flex;align-items:center;gap:5px}
.focus-btn.sel{border-color:#8b5cf6;background:#faf5ff;color:#7c3aed}
.focus-btn:not(.sel):hover{border-color:#c4b5fd}
.focus-ico{font-size:14px}

.sum-btn{width:100%;padding:12px;border-radius:9px;border:none;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(139,92,246,.35);letter-spacing:-.02em}
.sum-btn:hover:not(:disabled){background:linear-gradient(135deg,#7c3aed,#6d28d9);transform:translateY(-1px);box-shadow:0 6px 20px rgba(139,92,246,.45)}
.sum-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}

/* Main: result area */
.main{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-height:0}

/* Landing hero */
.hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#faf5ff;border:1px solid rgba(139,92,246,.3);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#7c3aed;margin-bottom:16px;text-transform:uppercase}
.hero-h1{font-size:clamp(24px,4vw,40px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.hero-h1 em{font-style:normal;color:#8b5cf6}
.hero-sub{font-size:14px;color:rgba(0,0,0,.42);max-width:420px;line-height:1.7;margin-bottom:28px}
.hero-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:540px;margin:0 auto}
.h-feat{padding:14px 10px;border:1px solid #e8e8e8;border-radius:12px;text-align:center}
.h-feat-icon{font-size:20px;margin-bottom:5px}
.h-feat-ttl{font-size:10px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.h-feat-body{font-size:9px;color:rgba(0,0,0,.38);line-height:1.5}

/* Extracting state */
.extracting{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:40px}
.ext-spinner{width:48px;height:48px;border:4px solid #f0f0f0;border-top-color:#8b5cf6;border-radius:50%;animation:spin .8s linear infinite}
.ext-lbl{font-size:14px;font-weight:700;color:#1d1d1f}
.ext-sub{font-size:11px;color:rgba(0,0,0,.35)}

/* Result */
.result{flex:1;padding:28px 32px;animation:fadeIn .4s ease}
.result-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:12px}
.result-file{font-size:11px;color:rgba(0,0,0,.35);font-weight:500}
.result-title{font-size:18px;font-weight:800;color:#1d1d1f;letter-spacing:-.04em;margin-top:2px}
.result-badges{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.rbadge{padding:2px 8px;border-radius:99px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.rbadge.len{background:#faf5ff;color:#7c3aed;border:1px solid rgba(139,92,246,.2)}
.rbadge.foc{background:#f0fdf4;color:#15803d;border:1px solid rgba(34,197,94,.2)}
.result-actions{display:flex;gap:6px;flex-shrink:0}
.act-btn{padding:6px 12px;border-radius:7px;font-size:11px;font-weight:700;border:1px solid #e0e0e0;background:#fff;cursor:pointer;color:rgba(0,0,0,.55);transition:all .12s;white-space:nowrap}
.act-btn:hover{border-color:#8b5cf6;color:#7c3aed;background:#faf5ff}
.act-btn.copied{background:#8b5cf6;color:#fff;border-color:#8b5cf6}

/* Markdown output */
.md-body{font-size:14px;line-height:1.8;color:#1d1d1f;max-width:720px}
.md-body h2{font-size:15px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em;margin:22px 0 8px;padding-bottom:6px;border-bottom:2px solid #f0f0f0;display:flex;align-items:center;gap:7px}
.md-body h2::before{content:'';display:inline-block;width:3px;height:14px;background:#8b5cf6;border-radius:2px;flex-shrink:0}
.md-body p{margin-bottom:10px;color:rgba(0,0,0,.75)}
.md-body ul{list-style:none;padding:0;margin:0 0 10px}
.md-body li{padding:5px 0 5px 20px;position:relative;color:rgba(0,0,0,.7);border-bottom:1px solid rgba(0,0,0,.04)}
.md-body li:last-child{border-bottom:none}
.md-body li::before{content:'▸';position:absolute;left:0;color:#8b5cf6;font-size:11px;top:7px}
.md-body strong{color:#1d1d1f;font-weight:700}

/* Streaming cursor */
.cursor{display:inline-block;width:2px;height:14px;background:#8b5cf6;margin-left:2px;animation:pulse .8s infinite;vertical-align:text-bottom;border-radius:1px}

/* Page count badge */
.stat-bar{display:flex;gap:10px;align-items:center;margin-top:6px;flex-wrap:wrap}
.stat{font-size:10px;color:rgba(0,0,0,.35);font-weight:500}
.stat strong{color:rgba(0,0,0,.55);font-weight:700}

/* Error */
.err-box{background:rgba(226,75,74,.06);border:1px solid rgba(226,75,74,.25);border-radius:10px;padding:16px 20px;margin:28px 32px;font-size:13px;color:#E24B4A;font-weight:600;display:flex;align-items:flex-start;gap:10px}
.err-icon{font-size:18px;flex-shrink:0;margin-top:-2px}

/* Upload landing */
.lp{min-height:100vh;display:flex;flex-direction:column;background:#fff}
.lp-uc{max-width:680px;margin:0 auto;padding:56px 24px;width:100%}
.lp-drop{border:2px dashed #d0d0d0;border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.lp-drop:hover,.lp-drop.over{border-color:#8b5cf6;background:#faf5ff}
`

// ── Simple Markdown → HTML renderer (just H2, ul/li, p, **bold**) ──────────
function renderMd(md: string): string {
  return md
    .split('\n')
    .reduce((acc: string[], line, _i, arr) => {
      if (line.startsWith('## ')) return [...acc, `<h2>${esc(line.slice(3))}</h2>`]
      if (line.startsWith('- '))  return [...acc, `<ul><li>${esc(line.slice(2))}</li></ul>`]
      if (line.trim() === '')     return [...acc, '']
      return [...acc, `<p>${esc(line)}</p>`]
    }, [])
    .join('\n')
    .replace(/<\/ul>\n<ul>/g, '')     // merge consecutive list items
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function fmtBytes(n: number) {
  return n < 1024*1024 ? `${(n/1024).toFixed(0)} KB` : `${(n/1024/1024).toFixed(1)} MB`
}

export default function PDFSummarizerPage() {
  const [pdfFile,   setPdfFile]   = useState<File | null>(null)
  const [pdfText,   setPdfText]   = useState<string>('')
  const [pageCount, setPageCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [extracting,setExtracting]= useState(false)
  const [length,    setLength]    = useState<LengthOpt>('standard')
  const [focus,     setFocus]     = useState<FocusOpt>('general')
  const [streaming, setStreaming] = useState(false)
  const [summary,   setSummary]   = useState('')
  const [error,     setError]     = useState('')
  const [copied,    setCopied]    = useState(false)

  const fileInputRef  = useRef<HTMLInputElement>(null)
  const dropLpRef     = useRef<HTMLDivElement>(null)
  const dropEditorRef = useRef<HTMLDivElement>(null)
  const abortRef      = useRef<AbortController | null>(null)

  // ── Extract text from PDF using PDF.js ─────────────────────────────────
  const extractText = useCallback(async (file: File) => {
    setExtracting(true); setSummary(''); setError('')
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise
      setPageCount(pdf.numPages)
      let fullText = ''
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p)
        const tc   = await page.getTextContent()
        fullText += tc.items.map((i: any) => i.str).join(' ') + '\n'
      }
      setPdfText(fullText)
      setWordCount(fullText.trim().split(/\s+/).length)
    } catch {
      setError('Could not extract text from this PDF. It may be image-only or password-protected.')
    } finally {
      setExtracting(false)
    }
  }, [])

  const loadFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') return
    setPdfFile(file); setPdfText(''); setSummary(''); setError(''); setPageCount(0); setWordCount(0)
    extractText(file)
  }, [extractText])

  // ── Drop zones ─────────────────────────────────────────────────────────
  useEffect(() => {
    ;[dropLpRef, dropEditorRef].forEach(ref => {
      const el = ref.current; if (!el) return
      const ov = (e: DragEvent) => { e.preventDefault(); el.classList.add('over') }
      const lv = () => el.classList.remove('over')
      const dp = (e: DragEvent) => {
        e.preventDefault(); el.classList.remove('over')
        const f = e.dataTransfer?.files[0]; if (f) loadFile(f)
      }
      el.addEventListener('dragover', ov); el.addEventListener('dragleave', lv); el.addEventListener('drop', dp)
      return () => { el.removeEventListener('dragover', ov); el.removeEventListener('dragleave', lv); el.removeEventListener('drop', dp) }
    })
  }, [loadFile])

  // ── Summarize ──────────────────────────────────────────────────────────
  const summarize = async () => {
    if (!pdfText || streaming) return
    setStreaming(true); setSummary(''); setError('')
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pdfText, length, focus, filename: pdfFile?.name }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? `Server error ${res.status}`)
      }
      const reader = res.body!.getReader()
      const dec    = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream: true })
        setSummary(acc)
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message ?? 'Summarization failed.')
    } finally {
      setStreaming(false)
    }
  }

  // ── Copy ───────────────────────────────────────────────────────────────
  const copyText = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Download ───────────────────────────────────────────────────────────
  const download = () => {
    const blob = new Blob([summary], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = (pdfFile?.name ?? 'doc').replace(/\.pdf$/i, '') + '-summary.txt'
    a.click(); URL.revokeObjectURL(url)
  }

  const canSummarize = !!pdfText && !extracting && !streaming

  // ── Upload landing ─────────────────────────────────────────────────────
  if (!pdfFile) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="lp">
          <SiteNav />

          <div className="lp-uc">
            <div style={{textAlign:'center',marginBottom:36}}>
              <div className="hero-badge">✦ AI Powered</div>
              <h1 className="hero-h1">Summarize any<br/><em>PDF</em> instantly</h1>
              <p style={{fontSize:14,color:'rgba(0,0,0,.42)',lineHeight:1.7,maxWidth:400,margin:'0 auto 28px'}}>
                Upload a PDF and get a structured AI summary with key points, notable details and a conclusion — in seconds.
              </p>
            </div>

            <div ref={dropLpRef} className="lp-drop" onClick={() => fileInputRef.current?.click()}>
              <div style={{fontSize:44,marginBottom:12}}>📄</div>
              <div style={{fontSize:13,color:'rgba(0,0,0,.42)',marginBottom:18,lineHeight:1.6}}>
                Drop your PDF here, or click to choose<br/>
                <span style={{fontSize:11,color:'rgba(0,0,0,.28)'}}>Text is extracted in-browser · AI summary via API</span>
              </div>
              <button className="drop-btn" onClick={e=>{e.stopPropagation();fileInputRef.current?.click()}}>Choose PDF</button>
            </div>

            <div className="hero-feats" style={{marginTop:24}}>
              {[
                {icon:'📋',t:'Structured output',b:'Overview, Key Points, Details, Conclusion'},
                {icon:'🎯',t:'Focus modes',b:'General, Technical, Legal, Medical, Financial'},
                {icon:'⚡',t:'Streaming AI',b:'See the summary appear word by word'},
              ].map(f=>(
                <div key={f.t} className="h-feat">
                  <div className="h-feat-icon">{f.icon}</div>
                  <div className="h-feat-ttl">{f.t}</div>
                  <div className="h-feat-body">{f.b}</div>
                </div>
              ))}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="application/pdf" style={{display:'none'}}
            onChange={e=>{const f=e.target.files?.[0];if(f)loadFile(f);e.target.value=''}} />
        </div>
      </>
    )
  }

  // ── Editor ─────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pg">
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/><polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/></svg></div>
            <span className="logo-name">Edit<em>PDF</em> AI</span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">PDF Summarizer AI</span>
          <div className="nav-sp"/>
          {summary && (
            <>
              <button className={`nbtn sec${copied?' act':''}`} onClick={copyText}>{copied?'✓ Copied':'Copy'}</button>
              <button className="nbtn sec" onClick={download}>↓ Save TXT</button>
            </>
          )}
          <button className="nbtn sec" onClick={() => { setPdfFile(null); setSummary(''); setPdfText('') }}>← New</button>
        </nav>

        <div className="workspace">
          {/* Left panel */}
          <div className="left">
            {/* Document */}
            <div className="lp-sec">
              <div className="lp-ttl">Document</div>
              <div ref={dropEditorRef} className="drop-z" onClick={() => fileInputRef.current?.click()}>
                <div className="drop-icon">📄</div>
                <div className="drop-name">{pdfFile.name}</div>
                <div className="drop-meta">{fmtBytes(pdfFile.size)}</div>
                {extracting ? (
                  <div style={{marginTop:8,fontSize:10,color:'#8b5cf6',fontWeight:700,display:'flex',alignItems:'center',gap:5}}>
                    <span style={{display:'inline-block',width:10,height:10,border:'2px solid #8b5cf6',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
                    Extracting text…
                  </div>
                ) : pdfText ? (
                  <div className="stat-bar" style={{justifyContent:'center',marginTop:8}}>
                    <span className="stat"><strong>{pageCount}</strong> pages</span>
                    <span style={{color:'rgba(0,0,0,.2)'}}>·</span>
                    <span className="stat"><strong>{wordCount.toLocaleString()}</strong> words</span>
                  </div>
                ) : null}
                <button className="drop-btn" style={{marginTop:10,fontSize:10}} onClick={e=>{e.stopPropagation();fileInputRef.current?.click()}}>Change PDF</button>
              </div>
            </div>

            {/* Length */}
            <div className="lp-sec">
              <div className="lp-ttl">Summary Length</div>
              <div className="seg">
                {([['brief','Brief'],['standard','Standard'],['detailed','Detailed']] as [LengthOpt,string][]).map(([v,l])=>(
                  <button key={v} className={`seg-btn${length===v?' sel':''}`} onClick={()=>setLength(v)}>{l}</button>
                ))}
              </div>
              <div style={{fontSize:9,color:'rgba(0,0,0,.3)',marginTop:6,lineHeight:1.5}}>
                {length==='brief'?'3-5 sentence overview + bullet points.':length==='standard'?'2-3 paragraphs + detailed bullet points.':'4-6 paragraphs + comprehensive bullet points.'}
              </div>
            </div>

            {/* Focus */}
            <div className="lp-sec">
              <div className="lp-ttl">Focus Area</div>
              <div className="focus-grid">
                {([
                  ['general',  '🌐', 'General' ],
                  ['technical','⚙️', 'Technical'],
                  ['legal',    '⚖️', 'Legal'   ],
                  ['medical',  '🏥', 'Medical'  ],
                  ['financial','💰', 'Financial'],
                ] as [FocusOpt,string,string][]).map(([v,ic,l])=>(
                  <button key={v} className={`focus-btn${focus===v?' sel':''}`} onClick={()=>setFocus(v)} style={v==='general'?{gridColumn:'1/-1'}:undefined}>
                    <span className="focus-ico">{ic}</span>{l}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="lp-sec" style={{borderBottom:'none'}}>
              <button className="sum-btn" disabled={!canSummarize} onClick={summarize}>
                {streaming ? (
                  <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                    <span style={{display:'inline-block',width:14,height:14,border:'2.5px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
                    Summarizing…
                  </span>
                ) : extracting ? 'Extracting text…' : '✦ Summarize PDF'}
              </button>
              {streaming && (
                <button onClick={()=>abortRef.current?.abort()} style={{width:'100%',marginTop:7,padding:7,border:'1px solid #e0e0e0',borderRadius:7,background:'#fff',fontSize:10,fontWeight:700,cursor:'pointer',color:'rgba(0,0,0,.4)'}}>
                  Stop generating
                </button>
              )}
            </div>
          </div>

          {/* Main result area */}
          <div className="main">
            {error && (
              <div className="err-box">
                <span className="err-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {!summary && !extracting && !error && !streaming && (
              <div className="hero">
                <div style={{fontSize:56,marginBottom:14}}>✦</div>
                <div style={{fontSize:18,fontWeight:800,color:'#1d1d1f',letterSpacing:'-.04em',marginBottom:8}}>Ready to summarize</div>
                <div style={{fontSize:13,color:'rgba(0,0,0,.38)',maxWidth:320,lineHeight:1.7}}>
                  Configure the length and focus on the left, then click <strong>Summarize PDF</strong>.
                </div>
              </div>
            )}

            {extracting && !summary && (
              <div className="extracting">
                <div className="ext-spinner"/>
                <div className="ext-lbl">Extracting text from PDF</div>
                <div className="ext-sub">Reading {pageCount > 0 ? `${pageCount} pages` : 'all pages'}…</div>
              </div>
            )}

            {(summary || streaming) && (
              <div className="result">
                <div className="result-header">
                  <div>
                    <div className="result-file">{pdfFile.name}</div>
                    <div className="result-title">AI Summary</div>
                    <div className="result-badges">
                      <span className="rbadge len">{length}</span>
                      <span className="rbadge foc">{focus}</span>
                      {pageCount > 0 && <span className="rbadge" style={{background:'#f5f5f7',color:'rgba(0,0,0,.4)',border:'1px solid #e8e8e8'}}>{pageCount} pages · {wordCount.toLocaleString()} words</span>}
                    </div>
                  </div>
                  <div className="result-actions">
                    <button className={`act-btn${copied?' copied':''}`} onClick={copyText}>
                      {copied ? '✓ Copied' : '⎘ Copy'}
                    </button>
                    <button className="act-btn" onClick={download}>↓ TXT</button>
                  </div>
                </div>

                <div
                  className="md-body"
                  dangerouslySetInnerHTML={{ __html: renderMd(summary) + (streaming ? '<span class="cursor"></span>' : '') }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="application/pdf" style={{display:'none'}}
        onChange={e=>{const f=e.target.files?.[0];if(f)loadFile(f);e.target.value=''}} />
    </>
  )
}
