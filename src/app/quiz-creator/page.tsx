'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

type QType = 'mcq' | 'short' | 'mixed'
type Diff  = 'easy' | 'medium' | 'hard'

const LETTERS = ['A', 'B', 'C', 'D']

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`
  return `${(b/1048576).toFixed(2)} MB`
}

interface RefPanel {
  qi: number
  quote: string
  page: number
  loading: boolean
}

export default function QuizCreator() {
  const [file,       setFile]       = useState<File | null>(null)
  const [pages,      setPages]      = useState(0)
  const [isDrop,     setIsDrop]     = useState(false)
  const [qType,      setQType]      = useState<QType>('mixed')
  const [qCount,     setQCount]     = useState(10)
  const [diff,       setDiff]       = useState<Diff>('medium')
  const [quiz,       setQuiz]       = useState<any>(null)
  const [loading,    setLoading]    = useState(false)
  const [step,       setStep]       = useState('')
  const [progress,   setProgress]   = useState(0)
  const [error,      setError]      = useState('')
  const [answers,    setAnswers]    = useState<Record<number,string>>({})
  const [revealed,   setRevealed]   = useState<Record<number,boolean>>({})
  const [submitted,  setSubmitted]  = useState(false)
  const [pageTexts,  setPageTexts]  = useState<{page:number,text:string}[]>([])
  const [refPanel,   setRefPanel]   = useState<RefPanel | null>(null)

  const fileRef      = useRef<HTMLInputElement>(null)
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null)
  const renderingRef = useRef(false)

  // Render PDF page and highlight matching text whenever a reference panel opens
  useEffect(() => {
    if (!refPanel?.loading || !file || renderingRef.current) return
    renderingRef.current = true

    const { page, quote } = refPanel

    ;(async () => {
      try {
        const lib = await import('pdfjs-dist')
        lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`

        const bytes  = await file.arrayBuffer()
        const doc    = await lib.getDocument({ data: bytes }).promise
        const pdfPg  = await doc.getPage(page)

        const naturalW = pdfPg.getViewport({ scale: 1 }).width
        const maxW     = Math.min(window.innerWidth * 0.82 - 48, 860)
        const scale    = Math.min(1.8, maxW / naturalW)
        const vp       = pdfPg.getViewport({ scale })

        const canvas   = pdfCanvasRef.current
        if (!canvas) return
        canvas.width   = vp.width
        canvas.height  = vp.height
        const ctx      = canvas.getContext('2d')!

        await pdfPg.render({ canvasContext: ctx, viewport: vp }).promise

        // Highlight words from the source quote
        const normQuote = quote.toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
        const words = normQuote.split(/\s+/).filter(w => w.length > 4)

        const tc = await pdfPg.getTextContent()
        ctx.save()
        ctx.fillStyle = 'rgba(255, 215, 0, 0.42)'

        for (const item of tc.items as any[]) {
          if (!item.str || item.str.trim().length < 3) continue
          const norm = item.str.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim()
          const hit  = words.some(w => norm.includes(w))
          if (!hit) continue

          const [vpX, vpY] = vp.convertToViewportPoint(item.transform[4], item.transform[5])
          const w = item.width  * scale
          const h = item.height * scale
          ctx.fillRect(vpX, vpY - h * 1.15, w, h * 1.35)
        }
        ctx.restore()
      } catch (err) {
        console.error('ref render:', err)
      } finally {
        renderingRef.current = false
        setRefPanel(prev => prev ? { ...prev, loading: false } : null)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refPanel?.loading, refPanel?.page])

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF.'); return }
    setError(''); setFile(f); setQuiz(null); setSubmitted(false); setAnswers({}); setRevealed({}); setProgress(0); setPageTexts([])
    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const doc = await lib.getDocument({ data: await f.arrayBuffer() }).promise
      setPages(doc.numPages)
    } catch { /**/ }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const generate = async () => {
    if (!file) return
    setLoading(true); setQuiz(null); setError(''); setSubmitted(false); setAnswers({}); setRevealed({}); setProgress(10); setPageTexts([])
    try {
      setStep('Reading PDF…')
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise
      const pts: {page:number, text:string}[] = []
      const parts: string[] = []

      for (let p = 1; p <= doc.numPages; p++) {
        const pg   = await doc.getPage(p)
        const tc   = await pg.getTextContent()
        const pgTx = (tc.items as any[]).map((i: any) => i.str).join(' ')
        pts.push({ page: p, text: pgTx })
        parts.push(`[PAGE ${p}]\n${pgTx}`)
        setProgress(10 + Math.round((p / doc.numPages) * 30))
      }

      const text = parts.join('\n').replace(/\s+/g, ' ').trim()
      if (text.length < 30) throw new Error('No readable text found.')
      setPageTexts(pts)

      setStep('Generating questions…'); setProgress(50)
      const res = await fetch('/api/quiz-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, filename: file.name, questionCount: qCount, questionType: qType, difficulty: diff }),
      })
      if (!res.ok) { const j = await res.json().catch(()=>({})); throw new Error(j.error ?? `Error ${res.status}`) }
      const data = await res.json()
      if (!data.questions?.length) throw new Error('No questions returned.')
      setQuiz(data); setProgress(100)
    } catch (e: any) {
      setError(e.message ?? 'Failed.')
    } finally { setLoading(false); setStep('') }
  }

  const reset = () => {
    setFile(null); setPages(0); setQuiz(null); setError(''); setProgress(0)
    setSubmitted(false); setAnswers({}); setRevealed({}); setPageTexts([]); setRefPanel(null)
  }

  const openRef = (qi: number) => {
    if (!quiz) return
    const q = quiz.questions[qi]
    const quote = q.source_quote || q.question || ''

    // Find the page that best matches the source quote
    let bestPage = Math.max(1, Number(q.source_page) || 1)
    if (pageTexts.length > 0 && quote.length > 10) {
      const words = quote.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4)
      let bestScore = -1
      for (const { page, text } of pageTexts) {
        const t = text.toLowerCase()
        const score = words.filter((w: string) => t.includes(w)).length
        if (score > bestScore) { bestScore = score; bestPage = page }
      }
    }

    setRefPanel({ qi, quote, page: bestPage, loading: true })
  }

  // score
  let mcqTotal = 0, mcqCorrect = 0, mcqAnswered = 0
  if (quiz) {
    quiz.questions.forEach((q: any, i: number) => {
      if (q.type === 'mcq') {
        mcqTotal++
        if (answers[i]) mcqAnswered++
        if (submitted && answers[i] === q.answer) mcqCorrect++
      }
    })
  }
  const pct = mcqTotal > 0 ? Math.round((mcqCorrect / mcqTotal) * 100) : 0

  // ── styles ──────────────────────────────────────────────────────────────────
  const S = {
    page:    { height:'100vh', display:'flex', flexDirection:'column' as const, overflow:'hidden', background:'#f5f5f7', fontFamily:'system-ui,sans-serif' },
    nav:     { height:52, background:'rgba(255,255,255,.96)', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', padding:'0 18px', gap:10, flexShrink:0 },
    prog:    { height:2, background:'#e0e0e0', flexShrink:0 },
    progFil: { height:'100%', background:'linear-gradient(90deg,#7c3aed,#a855f7)', transition:'width .4s' },
    work:    { flex:1, display:'flex', overflow:'hidden' },
    sb:      { width:272, flexShrink:0, background:'#fff', borderRight:'1px solid #e8e8e8', display:'flex', flexDirection:'column' as const, overflowY:'auto' as const },
    sbSec:   { padding:'14px 16px', borderBottom:'1px solid #f0f0f0' },
    sbTtl:   { fontSize:10, fontWeight:700, color:'rgba(0,0,0,.3)', textTransform:'uppercase' as const, letterSpacing:'.07em', marginBottom:10 },
    main:    { flex:1, display:'flex', flexDirection:'column' as const, overflow:'hidden', minWidth:0 },
    scroll:  { flex:1, overflowY:'auto' as const, padding:'20px 28px', display:'flex', flexDirection:'column' as const, gap:16 },
  }

  return (
    <>
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <svg width="27" height="27" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="lg-qc" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e"/><stop offset="1" stopColor="#e11d48"/></linearGradient></defs>
            <path d="M0 0H38C44 0 48 6 48 13.5C48 21 44 27 38 27H10M10 27V48H0V0M10 27H32" stroke="url(#lg-qc)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="38" cy="27" r="5" fill="url(#lg-qc)"/>
          </svg>
          <span style={{ fontSize:14, fontWeight:700, color:'#0D1B4B', letterSpacing:'-.03em' }}>EditPDF<span style={{ marginLeft:2, background:'linear-gradient(90deg,#4F7FFA,#8B3FEC)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}> AI</span></span>
        </Link>
        <span style={{ fontSize:11, color:'rgba(0,0,0,.2)' }}>›</span>
        <span style={{ fontSize:13, fontWeight:700, color:'#1d1d1f' }}>Quiz Creator</span>
        <div style={{ flex:1 }}/>
        {(quiz || loading) && <button onClick={reset} style={{ padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:'none', background:'#f0f0f0', color:'#1d1d1f', cursor:'pointer' }}>← New</button>}
      </nav>

      {/* Progress */}
      <div style={S.prog}><div style={{ ...S.progFil, width:`${progress}%` }}/></div>

      <div style={S.work}>
        {/* ── Sidebar ── */}
        <aside style={S.sb}>

          {/* File */}
          <div style={S.sbSec}>
            <div style={S.sbTtl}>PDF File</div>
            {!file ? (
              <div onClick={() => fileRef.current?.click()}
                onDrop={onDrop} onDragOver={e => { e.preventDefault(); setIsDrop(true) }} onDragLeave={() => setIsDrop(false)}
                style={{ border:`2px dashed ${isDrop ? '#7c3aed' : '#d0d0d0'}`, borderRadius:11, padding:'26px 14px', textAlign:'center', cursor:'pointer', background: isDrop ? '#faf5ff' : '#fafafa' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📚</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#1d1d1f', marginBottom:3 }}>Drop PDF here</div>
                <div style={{ fontSize:10, color:'rgba(0,0,0,.35)' }}>Any text-based PDF</div>
                <button style={{ marginTop:9, padding:'7px 14px', background:'#1d1d1f', color:'#fff', border:'none', borderRadius:7, fontSize:11, fontWeight:700, cursor:'pointer' }}>📄 Choose PDF</button>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 11px', background:'#f5f5f7', border:'1px solid #e8e8e8', borderRadius:9 }}>
                <div style={{ width:32, height:32, background:'#7c3aed', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:15 }}>📄</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#1d1d1f', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize:9, color:'rgba(0,0,0,.38)', marginTop:1 }}>{fmtBytes(file.size)}{pages ? ` · ${pages}p` : ''}</div>
                </div>
                <button onClick={reset} style={{ width:22, height:38, borderRadius:5, border:'1px solid #e0e0e0', background:'transparent', cursor:'pointer', fontSize:12, color:'rgba(0,0,0,.35)' }}>×</button>
              </div>
            )}
          </div>

          {/* Type */}
          <div style={S.sbSec}>
            <div style={S.sbTtl}>Question Type</div>
            <div style={{ display:'flex', background:'#f5f5f7', borderRadius:8, padding:3, gap:2 }}>
              {(['mcq','short','mixed'] as QType[]).map(v => (
                <button key={v} onClick={() => setQType(v)} style={{ flex:1, padding:'6px 4px', borderRadius:6, border:'none', fontSize:10, fontWeight:700, cursor:'pointer', background: qType===v ? '#fff' : 'transparent', color: qType===v ? '#7c3aed' : 'rgba(0,0,0,.45)', boxShadow: qType===v ? '0 1px 4px rgba(0,0,0,.12)' : 'none' }}>
                  {v === 'mcq' ? 'MCQ' : v === 'short' ? 'Short' : 'Mixed'}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div style={S.sbSec}>
            <div style={S.sbTtl}>Number of Questions</div>
            <div style={{ display:'flex', gap:4 }}>
              {[5,10,15,20].map(n => (
                <button key={n} onClick={() => setQCount(n)} style={{ flex:1, padding:'7px 4px', borderRadius:7, border:`1.5px solid ${qCount===n ? '#7c3aed' : '#e0e0e0'}`, background: qCount===n ? '#7c3aed' : '#fff', color: qCount===n ? '#fff' : 'rgba(0,0,0,.45)', fontSize:11, fontWeight:700, cursor:'pointer' }}>{n}</button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={S.sbSec}>
            <div style={S.sbTtl}>Difficulty</div>
            <div style={{ display:'flex', gap:4 }}>
              {(['easy','medium','hard'] as Diff[]).map(v => {
                const on = diff === v
                const c  = v==='easy' ? '#16a34a' : v==='medium' ? '#d97706' : '#dc2626'
                return <button key={v} onClick={() => setDiff(v)} style={{ flex:1, padding:'7px 4px', borderRadius:7, border:`1.5px solid ${on ? c : '#e0e0e0'}`, background: on ? c : '#fff', color: on ? '#fff' : 'rgba(0,0,0,.45)', fontSize:10, fontWeight:700, cursor:'pointer', textTransform:'capitalize' as const }}>{v}</button>
              })}
            </div>
          </div>

          {/* Generate */}
          <div style={S.sbSec}>
            <button onClick={generate} disabled={!file || loading} style={{ width:'100%', padding:12, borderRadius:9, border:'none', background: (!file||loading) ? '#e0e0e0' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: (!file||loading) ? '#aaa' : '#fff', fontSize:13, fontWeight:800, cursor: (!file||loading) ? 'not-allowed' : 'pointer', boxShadow: (!file||loading) ? 'none' : '0 4px 14px rgba(124,58,237,.35)' }}>
              {loading ? `⏳ ${step || 'Generating…'}` : `✦ Generate ${qCount} Questions`}
            </button>
            {quiz && submitted && (
              <button onClick={() => { setSubmitted(false); setAnswers({}); setRevealed({}) }} style={{ width:'100%', marginTop:8, padding:10, borderRadius:9, border:'1.5px solid #7c3aed', background:'transparent', color:'#7c3aed', fontSize:12, fontWeight:700, cursor:'pointer' }}>↺ Retake Quiz</button>
            )}
          </div>

          <div style={{ padding:'12px 16px', fontSize:10, color:'rgba(0,0,0,.35)', lineHeight:1.6 }}>
            Claude reads up to 55 000 characters and generates real questions from your document. Click 📍 on any MCQ to see the source passage.
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={S.main}>

          {/* Toolbar */}
          {quiz && (
            <div style={{ height:48, background:'#fff', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', padding:'0 16px', gap:10, flexShrink:0 }}>
              <div style={{ flex:1, fontSize:11, color:'rgba(0,0,0,.4)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                <strong style={{ color:'#1d1d1f' }}>{quiz.title}</strong> · {quiz.questions.length} questions
                {!submitted && mcqTotal > 0 && ` · ${mcqAnswered}/${mcqTotal} answered`}
              </div>
              {submitted && mcqTotal > 0 && (
                <div style={{ padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:800, background: pct>=80 ? '#dcfce7' : pct>=60 ? '#fef9c3' : '#fee2e2', color: pct>=80 ? '#15803d' : pct>=60 ? '#a16207' : '#b91c1c' }}>
                  {mcqCorrect}/{mcqTotal} · {pct}%
                </div>
              )}
              {!submitted && (
                <button onClick={() => { setSubmitted(true); const r: Record<number,boolean>={}; quiz.questions.forEach((_:any,i:number)=>{ r[i]=true }); setRevealed(r) }}
                  disabled={mcqTotal > 0 && mcqAnswered < mcqTotal}
                  style={{ padding:'7px 16px', borderRadius:8, border:'none', background: (mcqTotal > 0 && mcqAnswered < mcqTotal) ? '#e0e0e0' : '#7c3aed', color: (mcqTotal > 0 && mcqAnswered < mcqTotal) ? '#aaa' : '#fff', fontSize:12, fontWeight:800, cursor:(mcqTotal > 0 && mcqAnswered < mcqTotal) ? 'not-allowed' : 'pointer' }}>
                  {mcqTotal > 0 && mcqAnswered < mcqTotal ? `Answer ${mcqTotal - mcqAnswered} more` : 'Submit Quiz'}
                </button>
              )}
              {submitted && (
                <button onClick={() => { setSubmitted(false); setAnswers({}); setRevealed({}) }} style={{ padding:'7px 16px', borderRadius:8, border:'none', background:'#6b7280', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer' }}>↺ Retake</button>
              )}
            </div>
          )}

          {/* Error */}
          {error && <div style={{ margin:14, padding:'10px 14px', background:'#fff5f5', border:'1px solid rgba(220,38,38,.2)', borderRadius:8, fontSize:12, color:'#dc2626' }}>⚠ {error}</div>}

          {/* Hero */}
          {!file && !loading && !quiz && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', background:'#faf5ff', border:'1px solid rgba(124,58,237,.25)', borderRadius:20, fontSize:10, fontWeight:700, color:'#7c3aed', marginBottom:16, textTransform:'uppercase', letterSpacing:'.08em' }}>✦ AI-Powered</div>
              <h1 style={{ fontSize:36, fontWeight:800, letterSpacing:'-.05em', color:'#1d1d1f', marginBottom:10, lineHeight:1.1 }}>PDF <span style={{ color:'#7c3aed' }}>Quiz Creator</span></h1>
              <p style={{ fontSize:14, color:'rgba(0,0,0,.42)', maxWidth:400, lineHeight:1.7, marginBottom:28 }}>Upload any PDF and Claude will create a custom quiz — multiple choice, short answer, or a mix.</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, maxWidth:460 }}>
                {[['🎯','Multiple Choice','4 options, instant grading'],['✍️','Short Answer','Write & check model answer'],['📍','Source References','Jump to the PDF passage']].map(([icon,t,d]) => (
                  <div key={t} style={{ padding:'14px 10px', border:'1px solid #e8e8e8', borderRadius:12, background:'#fff' }}>
                    <div style={{ fontSize:20, marginBottom:5 }}>{icon}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:'#1d1d1f', marginBottom:2 }}>{t}</div>
                    <div style={{ fontSize:9, color:'rgba(0,0,0,.38)', lineHeight:1.5 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ready */}
          {file && !loading && !quiz && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
              <div style={{ fontSize:48 }}>📚</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#1d1d1f' }}>Ready to quiz</div>
              <div style={{ fontSize:13, color:'rgba(0,0,0,.4)' }}>{file.name} · {qCount} questions · {diff}</div>
              <button onClick={generate} style={{ padding:'12px 28px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(124,58,237,.35)' }}>✦ Generate Quiz</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14 }}>
              <div style={{ width:36, height:36, border:'3px solid #e0e0e0', borderTopColor:'#7c3aed', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
              <div style={{ fontSize:13, fontWeight:700, color:'#7c3aed' }}>{step}</div>
              <div style={{ fontSize:11, color:'rgba(0,0,0,.35)' }}>Claude is reading your PDF and writing questions…</div>
            </div>
          )}

          {/* Progress bar (MCQ) */}
          {quiz && !submitted && mcqTotal > 0 && (
            <div style={{ margin:'16px 28px 0', padding:'10px 16px', background:'#fff', borderRadius:10, border:'1.5px solid #e8e8e8', flexShrink:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:700, color:'rgba(0,0,0,.45)', marginBottom:6 }}>
                <span>Progress</span><span>{mcqAnswered} / {mcqTotal} MCQ answered</span>
              </div>
              <div style={{ height:4, background:'#f0e6ff', borderRadius:2 }}>
                <div style={{ height:'100%', background:'#7c3aed', borderRadius:2, width:`${mcqTotal ? (mcqAnswered/mcqTotal)*100 : 0}%`, transition:'width .4s' }}/>
              </div>
            </div>
          )}

          {/* Score panel */}
          {quiz && submitted && mcqTotal > 0 && (
            <div style={{ margin:'16px 28px 0', padding:20, background:'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius:14, color:'#fff', textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:52, fontWeight:900, letterSpacing:'-.04em', lineHeight:1 }}>{pct}%</div>
              <div style={{ fontSize:13, fontWeight:600, opacity:.8, marginTop:4 }}>{mcqCorrect} of {mcqTotal} correct</div>
              <div style={{ display:'inline-block', marginTop:10, padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:800, background:'rgba(255,255,255,.2)' }}>
                {pct>=80 ? 'Excellent!' : pct>=60 ? 'Good job!' : 'Keep practicing'}
              </div>
            </div>
          )}

          {/* Questions */}
          {quiz && (
            <div style={S.scroll}>
              {quiz.questions.map((q: any, qi: number) => {
                const isMCQ    = q.type === 'mcq'
                const opts     = Array.isArray(q.options) ? q.options : []
                const userAns  = answers[qi] ?? ''
                const isRev    = !!revealed[qi]
                const correct  = isMCQ && submitted && userAns === q.answer
                const wrong    = isMCQ && submitted && !!userAns && userAns !== q.answer
                const hasRef   = isMCQ && !!q.source_quote

                return (
                  <div key={qi} style={{
                    background:'#fff',
                    border:`1.5px solid ${correct ? '#16a34a' : wrong ? '#dc2626' : isRev && !isMCQ ? '#7c3aed' : '#e8e8e8'}`,
                    borderRadius:14,
                    flexShrink:0,
                  }}>
                    {/* Card header */}
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 20px 12px' }}>
                      <div style={{ width:28, height:28, borderRadius:8, background: correct?'#16a34a': wrong?'#dc2626':'#7c3aed', color:'#fff', fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                        {qi+1}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:7, flexWrap:'wrap' as const }}>
                          <span style={{ display:'inline-block', padding:'3px 9px', borderRadius:10, fontSize:10, fontWeight:700, background: isMCQ?'#ede9fe':'#fce7f3', color: isMCQ?'#7c3aed':'#be185d' }}>
                            {isMCQ ? '⬤ Multiple Choice' : '✍ Short Answer'}
                          </span>
                          {hasRef && (
                            <button
                              onClick={() => openRef(qi)}
                              title="View source passage in PDF"
                              style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:10, fontSize:10, fontWeight:700, border:'1.5px solid #d1fae5', background:'#ecfdf5', color:'#059669', cursor:'pointer' }}
                            >
                              📍 Source
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize:14, fontWeight:600, color:'#1d1d1f', lineHeight:1.55 }}>{q.question}</div>
                      </div>
                    </div>

                    {/* MCQ options */}
                    {isMCQ && (
                      <div style={{ padding:'0 20px 16px', display:'flex', flexDirection:'column', gap:8 }}>
                        {opts.map((opt: string, oi: number) => {
                          const isCorrectOpt = submitted && opt === q.answer
                          const isWrongOpt   = submitted && userAns === opt && opt !== q.answer
                          const isSelected   = !submitted && userAns === opt

                          let bg = '#f8f8f8', borderCol = '#e0e0e0', textCol = '#1d1d1f', dotBg = 'rgba(0,0,0,.08)', dotCol = 'rgba(0,0,0,.5)'
                          if (isSelected)   { bg='#ede9fe'; borderCol='#7c3aed'; textCol='#6d28d9'; dotBg='rgba(124,58,237,.15)'; dotCol='#7c3aed' }
                          if (isCorrectOpt) { bg='#dcfce7'; borderCol='#16a34a'; textCol='#15803d'; dotBg='rgba(22,163,74,.15)'; dotCol='#16a34a' }
                          if (isWrongOpt)   { bg='#fee2e2'; borderCol='#dc2626'; textCol='#b91c1c'; dotBg='rgba(220,38,38,.15)'; dotCol='#dc2626' }

                          return (
                            <button
                              key={oi}
                              onClick={() => { if (!submitted) setAnswers(p => ({ ...p, [qi]: opt })) }}
                              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', textAlign:'left', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${borderCol}`, background:bg, fontSize:13, fontWeight:500, color:textCol, cursor: submitted ? 'default' : 'pointer', lineHeight:1.45 }}
                            >
                              <span style={{ width:24, height:24, borderRadius:6, background:dotBg, color:dotCol, fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                {LETTERS[oi]}
                              </span>
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Short answer */}
                    {!isMCQ && (
                      <div style={{ padding:'0 20px 16px' }}>
                        <textarea
                          rows={3}
                          placeholder="Write your answer here…"
                          value={answers[qi] ?? ''}
                          onChange={e => setAnswers(p => ({ ...p, [qi]: e.target.value }))}
                          disabled={submitted}
                          style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:'1.5px solid #e0e0e0', fontSize:13, color:'#1d1d1f', resize:'vertical', minHeight:88, outline:'none', fontFamily:'system-ui,sans-serif', background: submitted ? '#fafafa' : '#fff' }}
                        />
                        {!isRev && (
                          <button onClick={() => setRevealed(p => ({ ...p, [qi]: true }))} style={{ marginTop:8, padding:'7px 14px', borderRadius:8, border:'1.5px solid #7c3aed', background:'#fff', color:'#7c3aed', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                            👁 Reveal Answer
                          </button>
                        )}
                        {isRev && (
                          <div style={{ marginTop:10, padding:'12px 14px', background:'#fef9c3', borderRadius:8, fontSize:12, color:'#78350f', lineHeight:1.65, border:'1px solid #fde68a' }}>
                            <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:4, color:'#92400e' }}>Model Answer</div>
                            {q.answer}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && ((isMCQ && submitted) || (!isMCQ && isRev)) && (
                      <div style={{ margin:'0 20px 16px', padding:'12px 14px', background:'#f5f3ff', borderRadius:8, fontSize:12, color:'#4c1d95', lineHeight:1.65, border:'1px solid #e9d5ff' }}>
                        <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:4, color:'#7c3aed' }}>Explanation</div>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                )
              })}
              <div style={{ height:24 }}/>
            </div>
          )}

        </main>
      </div>

      {/* ── Reference Modal ── */}
      {refPanel && (
        <div
          onClick={() => setRefPanel(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:'#fff', borderRadius:18, width:'min(92vw, 880px)', maxHeight:'88vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,.3)' }}
          >
            {/* Modal header */}
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'flex-start', gap:14, flexShrink:0 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:800, color:'#059669', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>
                  📍 Source Reference — Question {refPanel.qi + 1}  ·  Page {refPanel.page}
                </div>
                <div style={{ fontSize:13, color:'#374151', lineHeight:1.6, fontStyle:'italic', borderLeft:'3px solid #a7f3d0', paddingLeft:10 }}>
                  "{refPanel.quote}"
                </div>
              </div>
              <button
                onClick={() => setRefPanel(null)}
                style={{ width:30, height:38, borderRadius:8, border:'1px solid #e0e0e0', background:'#f9f9f9', cursor:'pointer', fontSize:16, color:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
              >
                ✕
              </button>
            </div>

            {/* PDF canvas area */}
            <div style={{ flex:1, overflowY:'auto', background:'#6b7280', display:'flex', flexDirection:'column', alignItems:'center', padding:20, gap:0 }}>
              {refPanel.loading && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, height:380 }}>
                  <div style={{ width:36, height:36, border:'3px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', fontWeight:600 }}>Rendering page {refPanel.page}…</div>
                </div>
              )}
              {/* canvas always in DOM so ref attaches before useEffect fires */}
              <canvas
                ref={pdfCanvasRef}
                style={{ maxWidth:'100%', borderRadius:6, boxShadow:'0 8px 32px rgba(0,0,0,.4)', display: refPanel.loading ? 'none' : 'block' }}
              />
            </div>

            {/* Modal footer */}
            <div style={{ padding:'10px 20px', borderTop:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <div style={{ fontSize:11, color:'rgba(0,0,0,.4)' }}>
                Yellow highlights show matching text from the source passage.
              </div>
              <button onClick={() => setRefPanel(null)} style={{ padding:'7px 16px', borderRadius:8, border:'none', background:'#1d1d1f', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value='' }}/>
    </div>
    <ToolSEOSection {...toolSeoData['quiz-creator']} />
    </>
  )
}
