'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface MCQQuestion  { type:'mcq';   question:string; options:string[]; answer:string; explanation:string }
interface ShortQuestion{ type:'short'; question:string; answer:string;   explanation:string }
type Question = MCQQuestion | ShortQuestion
interface QuizData { title:string; questions:Question[] }
type QType      = 'mcq'|'short'|'mixed'
type Difficulty = 'easy'|'medium'|'hard'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pop{0%{transform:scale(.95);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes countUp{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}

.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

.nav{height:52px;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0;z-index:100}
.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{width:27px;height:27px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#7c3aed}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}

.prog{height:2px;background:#e0e0e0;flex-shrink:0}
.prog-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .4s ease}

.workspace{flex:1;display:flex;overflow:hidden}

/* Sidebar */
.sb{width:272px;flex-shrink:0;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;overflow-y:auto}
.sb-sec{padding:14px 16px;border-bottom:1px solid #f0f0f0}
.sb-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}

.drop{border:2px dashed #d0d0d0;border-radius:11px;padding:26px 14px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa}
.drop:hover,.drop.over{border-color:#7c3aed;background:#faf5ff}
.drop-icon{font-size:32px;margin-bottom:8px}
.drop-txt{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.drop-sub{font-size:10px;color:rgba(0,0,0,.35)}
.drop-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:#1d1d1f;border-radius:7px;font-size:11px;font-weight:700;color:#fff;border:none;cursor:pointer;margin-top:9px;transition:background .13s}
.drop-btn:hover{background:#7c3aed}

.file-row{display:flex;align-items:center;gap:9px;padding:9px 11px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:9px}
.file-ic{width:32px;height:32px;background:#7c3aed;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}
.file-info{flex:1;min-width:0}
.file-name{font-size:11px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.file-meta{font-size:9px;color:rgba(0,0,0,.38);margin-top:1px}
.file-rm{width:22px;height:22px;border-radius:5px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;font-size:12px;color:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s}
.file-rm:hover{border-color:#dc2626;color:#dc2626}

/* Segment controls */
.seg{display:flex;background:#f5f5f7;border-radius:8px;padding:3px;gap:2px}
.seg-btn{flex:1;padding:6px 4px;border-radius:6px;border:none;font-size:10px;font-weight:700;cursor:pointer;background:transparent;color:rgba(0,0,0,.45);transition:all .13s;text-align:center}
.seg-btn.on{background:#fff;color:#7c3aed;box-shadow:0 1px 4px rgba(0,0,0,.12)}

/* Count selector */
.count-row{display:flex;gap:4px}
.count-btn{flex:1;padding:7px 4px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;font-size:11px;font-weight:700;color:rgba(0,0,0,.45);cursor:pointer;transition:all .13s;text-align:center}
.count-btn:hover:not(.on){border-color:#7c3aed;color:#7c3aed}
.count-btn.on{background:#7c3aed;border-color:#7c3aed;color:#fff}

/* Difficulty */
.diff-row{display:flex;gap:4px}
.diff-btn{flex:1;padding:7px 4px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;font-size:10px;font-weight:700;color:rgba(0,0,0,.45);cursor:pointer;transition:all .13s;text-align:center}
.diff-btn:hover:not(.on){border-color:#7c3aed}
.diff-btn.easy.on{background:#16a34a;border-color:#16a34a;color:#fff}
.diff-btn.medium.on{background:#d97706;border-color:#d97706;color:#fff}
.diff-btn.hard.on{background:#dc2626;border-color:#dc2626;color:#fff}

/* Generate btn */
.gen-btn{width:100%;padding:12px;border-radius:9px;border:none;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:all .14s;box-shadow:0 4px 14px rgba(124,58,237,.35)}
.gen-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(124,58,237,.45)}
.gen-btn:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}
.retry-btn{width:100%;padding:10px;border-radius:9px;border:1.5px solid #7c3aed;background:transparent;color:#7c3aed;font-size:12px;font-weight:700;cursor:pointer;margin-top:8px;transition:all .13s}
.retry-btn:hover{background:#faf5ff}

/* Main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* Toolbar */
.toolbar{height:48px;background:#fff;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;padding:0 16px;gap:8px;flex-shrink:0}
.tool-info{font-size:11px;color:rgba(0,0,0,.4);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tool-info strong{color:#1d1d1f}
.score-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:800;flex-shrink:0}
.score-pill.great{background:#dcfce7;color:#15803d}
.score-pill.ok{background:#fef9c3;color:#a16207}
.score-pill.low{background:#fee2e2;color:#b91c1c}
.submit-btn{padding:7px 16px;border-radius:8px;border:none;background:#7c3aed;color:#fff;font-size:12px;font-weight:800;cursor:pointer;transition:all .13s;flex-shrink:0}
.submit-btn:hover:not(:disabled){background:#6d28d9}
.submit-btn:disabled{opacity:.35;cursor:not-allowed}

/* Quiz content */
.quiz-scroll{flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:18px}

/* Question card */
.q-card{background:#fff;border:1.5px solid #e8e8e8;border-radius:14px;overflow:hidden;animation:fadeup .28s ease}
.q-card.correct{border-color:#16a34a}
.q-card.wrong{border-color:#dc2626}
.q-card.revealed{border-color:#7c3aed}
.q-head{padding:14px 18px;display:flex;align-items:flex-start;gap:11px}
.q-num{width:26px;height:26px;border-radius:8px;background:#7c3aed;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.q-num.correct{background:#16a34a}
.q-num.wrong{background:#dc2626}
.q-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700;margin-bottom:5px}
.q-badge.mcq{background:#ede9fe;color:#7c3aed}
.q-badge.short{background:#fce7f3;color:#be185d}
.q-text{font-size:13px;font-weight:600;color:#1d1d1f;line-height:1.55}

/* MCQ Options */
.options{padding:0 18px 6px}
.opt{width:100%;text-align:left;padding:10px 14px;border-radius:9px;border:1.5px solid #e8e8e8;background:#fafafa;font-size:12px;font-weight:600;color:#1d1d1f;cursor:pointer;margin-bottom:6px;transition:all .14s;display:flex;align-items:center;gap:10px;line-height:1.45}
.opt:hover:not(:disabled):not(.sel):not(.right):not(.err){border-color:#7c3aed;background:#faf5ff;color:#7c3aed}
.opt.sel{border-color:#7c3aed;background:#ede9fe;color:#7c3aed}
.opt.right{border-color:#16a34a!important;background:#dcfce7!important;color:#15803d!important}
.opt.err{border-color:#dc2626!important;background:#fee2e2!important;color:#b91c1c!important}
.opt:disabled{cursor:default}
.opt-letter{width:22px;height:22px;border-radius:6px;background:rgba(0,0,0,.07);color:rgba(0,0,0,.5);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.opt.sel .opt-letter{background:rgba(124,58,237,.2);color:#7c3aed}
.opt.right .opt-letter{background:rgba(22,163,74,.2);color:#15803d}
.opt.err .opt-letter{background:rgba(220,38,38,.2);color:#b91c1c}

/* Short answer */
.short-area{padding:0 18px 12px}
.short-input{width:100%;padding:10px 12px;border-radius:9px;border:1.5px solid #e8e8e8;font-size:12px;font-family:system-ui,sans-serif;color:#1d1d1f;resize:vertical;min-height:80px;outline:none;transition:border-color .13s}
.short-input:focus{border-color:#7c3aed}
.short-input:disabled{background:#f9f9f9;color:rgba(0,0,0,.55)}
.reveal-btn{padding:7px 14px;border-radius:8px;border:1.5px solid #7c3aed;background:transparent;color:#7c3aed;font-size:11px;font-weight:700;cursor:pointer;margin-top:8px;transition:all .13s}
.reveal-btn:hover:not(:disabled){background:#faf5ff}
.reveal-btn:disabled{opacity:.4;cursor:default}

/* Explanation box */
.expl{margin:6px 18px 12px;padding:10px 13px;background:#f5f3ff;border-radius:8px;font-size:11px;color:#4c1d95;line-height:1.6;border:1px solid #e9d5ff;animation:pop .2s ease}
.expl strong{display:block;font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;margin-bottom:3px;color:#7c3aed}
.model-ans{margin:6px 18px 6px;padding:10px 13px;background:#fef3c7;border-radius:8px;font-size:11px;color:#78350f;line-height:1.6;border:1px solid #fde68a;animation:pop .2s ease}
.model-ans strong{display:block;font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;margin-bottom:3px;color:#92400e}

/* Score panel */
.score-panel{margin:0 18px 18px;padding:20px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:14px;color:#fff;text-align:center;animation:pop .35s ease;flex-shrink:0}
.score-big{font-size:52px;font-weight:900;line-height:1;animation:countUp .5s ease;letter-spacing:-.04em}
.score-label{font-size:13px;font-weight:600;opacity:.8;margin-top:4px}
.score-sub{font-size:11px;opacity:.65;margin-top:2px}
.score-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:800;margin-top:10px;background:rgba(255,255,255,.2)}

/* Hero */
.hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#faf5ff;border:1px solid rgba(124,58,237,.25);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#7c3aed;margin-bottom:16px;text-transform:uppercase}
.hero-h1{font-size:clamp(22px,4vw,38px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.hero-h1 em{font-style:normal;color:#7c3aed}
.hero-sub{font-size:14px;color:rgba(0,0,0,.42);max-width:420px;line-height:1.7;margin-bottom:28px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:480px}
.feat{padding:14px 10px;border:1px solid #e8e8e8;border-radius:12px;background:#fff}
.feat-icon{font-size:20px;margin-bottom:5px}
.feat-t{font-size:10px;font-weight:700;color:#1d1d1f;margin-bottom:2px}
.feat-d{font-size:9px;color:rgba(0,0,0,.38);line-height:1.5}

.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px}
.spin-lg{width:36px;height:36px;border:3px solid #e0e0e0;border-top-color:#7c3aed;border-radius:50%;animation:spin .8s linear infinite}
.load-step{font-size:13px;font-weight:700;color:#7c3aed;animation:pulse .9s infinite}
.load-sub{font-size:11px;color:rgba(0,0,0,.35)}
.err-bar{padding:10px 14px;background:#fff5f5;border:1px solid rgba(220,38,38,.2);border-radius:8px;font-size:12px;color:#dc2626;margin:14px}
.spin-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}

/* Progress bar in quiz */
.q-progress{height:4px;background:#f0e6ff;margin:0 18px 14px;border-radius:2px}
.q-progress-fill{height:100%;background:#7c3aed;border-radius:2px;transition:width .4s ease}
`

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
}
const LETTERS = ['A','B','C','D']

function scoreLabel(pct: number) {
  if (pct >= 80) return { text:'Excellent!', cls:'great' }
  if (pct >= 60) return { text:'Good job!', cls:'ok' }
  return { text:'Keep practicing', cls:'low' }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function QuizCreatorPage() {
  const [file,       setFile]       = useState<File | null>(null)
  const [pages,      setPages]      = useState(0)
  const [isDrop,     setIsDrop]     = useState(false)

  // Settings
  const [qType,      setQType]      = useState<QType>('mixed')
  const [qCount,     setQCount]     = useState(10)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')

  // Quiz state
  const [quizData,   setQuizData]   = useState<QuizData | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [progress,   setProgress]   = useState(0)
  const [step,       setStep]       = useState('')

  // Answer tracking
  const [answers,    setAnswers]    = useState<Record<number, string>>({})   // MCQ: selected option; Short: typed text
  const [revealed,   setRevealed]   = useState<Record<number, boolean>>({})  // short answer shown
  const [submitted,  setSubmitted]  = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setError(''); setFile(f); setPages(0); setQuizData(null); setSubmitted(false)
    setAnswers({}); setRevealed({}); setProgress(0)
    try {
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const buf = await f.arrayBuffer()
      const doc = await lib.getDocument({ data: buf }).promise
      setPages(doc.numPages)
    } catch { /* optional */ }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDrop(false)
    const f = e.dataTransfer.files[0]; if (f) loadFile(f)
  }, [loadFile])

  const generate = async () => {
    if (!file) return
    setLoading(true); setQuizData(null); setError('')
    setSubmitted(false); setAnswers({}); setRevealed({}); setProgress(10)

    try {
      setStep('Extracting text from PDF…')
      const lib = await import('pdfjs-dist')
      lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const doc = await lib.getDocument({ data: buf }).promise
      let text = ''
      for (let p = 1; p <= doc.numPages; p++) {
        const pg = await doc.getPage(p)
        const tc = await pg.getTextContent()
        text += (tc.items as any[]).map((i: any) => i.str).join(' ') + '\n'
        setProgress(10 + Math.round((p / doc.numPages) * 28))
      }
      text = text.replace(/\s+/g, ' ').trim()
      if (text.length < 30) { setError('Not enough text in this PDF.'); return }

      setStep(`Generating ${qCount} questions with Claude…`); setProgress(45)

      const res = await fetch('/api/quiz-gen', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text, filename: file.name, questionCount: qCount, questionType: qType, difficulty }),
      })

      setProgress(90)
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? `Server error ${res.status}`)
      }

      const data = await res.json()
      if (!data.questions?.length) throw new Error('No questions generated.')
      setQuizData(data as QuizData)
      setProgress(100)
    } catch (e: any) {
      setError(e.message ?? 'Generation failed.')
    } finally {
      setLoading(false); setStep('')
    }
  }

  const selectOption = (qi: number, opt: string) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qi]: opt }))
  }

  const revealShort = (qi: number) => {
    setRevealed(prev => ({ ...prev, [qi]: true }))
  }

  const submitQuiz = () => {
    setSubmitted(true)
    // Auto-reveal all short answers
    if (quizData) {
      const rev: Record<number,boolean> = {}
      quizData.questions.forEach((q, i) => { if (q.type === 'short') rev[i] = true })
      setRevealed(rev)
    }
  }

  const resetQuiz = () => {
    setSubmitted(false); setAnswers({}); setRevealed({})
  }

  const reset = () => {
    setFile(null); setPages(0); setQuizData(null); setError('')
    setProgress(0); setStep(''); setLoading(false)
    setSubmitted(false); setAnswers({}); setRevealed({})
  }

  // Score calculation
  const mcqScore = (() => {
    if (!quizData) return { correct: 0, total: 0 }
    let correct = 0, total = 0
    ;(quizData.questions as any[]).forEach((q: any, i: number) => {
      if (q.type === 'mcq') { total++; if (answers[i] === q.answer) correct++ }
    })
    return { correct, total }
  })()

  const answeredMCQ = quizData ? (quizData.questions as any[]).filter((q: any, i: number) => q.type === 'mcq' && answers[i]).length : 0
  const totalMCQ    = quizData ? (quizData.questions as any[]).filter((q: any) => q.type === 'mcq').length : 0
  const totalShort  = quizData ? (quizData.questions as any[]).filter((q: any) => q.type === 'short').length : 0
  const canSubmit   = !submitted && quizData && answeredMCQ === totalMCQ && (totalShort === 0 || true)

  const pct = mcqScore.total > 0 ? Math.round((mcqScore.correct / mcqScore.total) * 100) : 0
  const sl  = scoreLabel(pct)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* Nav */}
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/>
                <polyline points="14 2 14 8 20 8" stroke="#1d1d1f" strokeWidth="2"/>
              </svg>
            </div>
            <span className="logo-name">Edit<em>PDF</em> AI</span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">Quiz Creator</span>
          <div className="nav-sp"/>
          {(quizData || loading) && (
            <button className="nbtn sec" onClick={reset}>← New</button>
          )}
        </nav>

        <div className="prog"><div className="prog-fill" style={{ width: `${progress}%` }}/></div>

        <div className="workspace">

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="sb">

            <div className="sb-sec">
              <div className="sb-ttl">PDF File</div>
              {!file ? (
                <div className={`drop${isDrop ? ' over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setIsDrop(true) }}
                  onDragLeave={() => setIsDrop(false)}>
                  <div className="drop-icon">📚</div>
                  <div className="drop-txt">Drop PDF here</div>
                  <div className="drop-sub">Any text-based PDF</div>
                  <button className="drop-btn">📄 Choose PDF</button>
                </div>
              ) : (
                <div className="file-row">
                  <div className="file-ic">📄</div>
                  <div className="file-info">
                    <div className="file-name" title={file.name}>{file.name}</div>
                    <div className="file-meta">{fmtBytes(file.size)}{pages ? ` · ${pages}p` : ''}</div>
                  </div>
                  <button className="file-rm" onClick={reset}>×</button>
                </div>
              )}
            </div>

            <div className="sb-sec">
              <div className="sb-ttl">Question Type</div>
              <div className="seg">
                {([['mcq','MCQ'],['short','Short'],['mixed','Mixed']] as [QType,string][]).map(([v,l]) => (
                  <button key={v} className={`seg-btn${qType===v?' on':''}`} onClick={() => setQType(v)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="sb-sec">
              <div className="sb-ttl">Number of Questions</div>
              <div className="count-row">
                {[5,10,15,20].map(n => (
                  <button key={n} className={`count-btn${qCount===n?' on':''}`} onClick={() => setQCount(n)}>{n}</button>
                ))}
              </div>
            </div>

            <div className="sb-sec">
              <div className="sb-ttl">Difficulty</div>
              <div className="diff-row">
                {([['easy','Easy'],['medium','Medium'],['hard','Hard']] as [Difficulty,string][]).map(([v,l]) => (
                  <button key={v} className={`diff-btn ${v}${difficulty===v?' on':''}`}
                    onClick={() => setDifficulty(v)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="sb-sec">
              <button className="gen-btn" onClick={generate} disabled={!file || loading}>
                {loading
                  ? <><span style={{ display:'inline-block',width:13,height:13,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',marginRight:7,verticalAlign:'middle' }}/>{step||'Generating…'}</>
                  : `✦ Generate ${qCount} Questions`}
              </button>
              {quizData && submitted && (
                <button className="retry-btn" onClick={resetQuiz}>↺ Retake Quiz</button>
              )}
            </div>

            <div style={{ padding:'12px 16px', fontSize:10, color:'rgba(0,0,0,.35)', lineHeight:1.6 }}>
              Claude reads up to 55 000 characters. MCQ options are shuffled. Short answers include a model answer for self-grading.
            </div>
          </aside>

          {/* ── Main ─────────────────────────────────────────────────── */}
          <main className="main">

            {/* Toolbar — shown when quiz is active */}
            {quizData && (
              <div className="toolbar">
                <div className="tool-info">
                  <strong>{quizData.title}</strong>
                  {' '}· {quizData.questions.length} questions
                  {!submitted && totalMCQ > 0 && ` · ${answeredMCQ}/${totalMCQ} MCQ answered`}
                </div>
                {submitted && mcqScore.total > 0 && (
                  <div className={`score-pill ${sl.cls}`}>
                    {mcqScore.correct}/{mcqScore.total} MCQ · {pct}%
                  </div>
                )}
                {!submitted && (
                  <button className="submit-btn" onClick={submitQuiz} disabled={!canSubmit}>
                    {totalMCQ > 0 && answeredMCQ < totalMCQ
                      ? `Answer all MCQ (${totalMCQ - answeredMCQ} left)`
                      : 'Submit Quiz'}
                  </button>
                )}
                {submitted && (
                  <button className="submit-btn" style={{ background:'#6b7280' }} onClick={resetQuiz}>
                    ↺ Retake
                  </button>
                )}
              </div>
            )}

            {/* Hero */}
            {!file && !loading && !quizData && (
              <div className="hero">
                <div className="hero-badge">✦ AI-Powered</div>
                <h1 className="hero-h1">PDF <em>Quiz Creator</em></h1>
                <p className="hero-sub">Upload any PDF and Claude will create a custom quiz — multiple choice, short answer, or a mix. Test your understanding instantly.</p>
                <div className="feat-grid">
                  <div className="feat"><div className="feat-icon">🎯</div><div className="feat-t">Multiple Choice</div><div className="feat-d">4 options, instant grading</div></div>
                  <div className="feat"><div className="feat-icon">✍️</div><div className="feat-t">Short Answer</div><div className="feat-d">Write your own, see model answer</div></div>
                  <div className="feat"><div className="feat-icon">📊</div><div className="feat-t">Instant Score</div><div className="feat-d">Explanations for every question</div></div>
                </div>
              </div>
            )}

            {/* Ready state */}
            {file && !loading && !quizData && (
              <div className="hero">
                <div style={{ fontSize:52, marginBottom:12 }}>📚</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#1d1d1f', marginBottom:6 }}>Ready to quiz</div>
                <div style={{ fontSize:13, color:'rgba(0,0,0,.4)', marginBottom:24 }}>
                  {file.name} · {qCount} {qType === 'mcq' ? 'MCQ' : qType === 'short' ? 'short answer' : 'mixed'} questions · {difficulty}
                </div>
                <button className="gen-btn" style={{ maxWidth:230 }} onClick={generate}>
                  ✦ Generate Quiz
                </button>
              </div>
            )}

            {loading && (
              <div className="loading">
                <div className="spin-lg"/>
                <div className="load-step">{step || 'Generating…'}</div>
                <div className="load-sub">Claude is reading your PDF and writing questions…</div>
              </div>
            )}

            {error && <div className="err-bar">⚠ {error}</div>}

            {/* Quiz questions */}
            {quizData && (
              <div className="quiz-scroll">

                {/* Score summary at top after submit */}
                {submitted && mcqScore.total > 0 && (
                  <div className="score-panel">
                    <div className="score-big">{pct}%</div>
                    <div className="score-label">{mcqScore.correct} of {mcqScore.total} MCQ correct</div>
                    {totalShort > 0 && (
                      <div className="score-sub">{totalShort} short answer{totalShort>1?'s':''} — self-graded</div>
                    )}
                    <div className="score-badge">{sl.text}</div>
                  </div>
                )}

                {/* Answered progress for MCQ */}
                {!submitted && totalMCQ > 0 && (
                  <div style={{ background:'#fff', borderRadius:10, padding:'10px 16px', border:'1.5px solid #e8e8e8' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:10, fontWeight:700, color:'rgba(0,0,0,.45)' }}>
                      <span>Progress</span>
                      <span>{answeredMCQ} / {totalMCQ} MCQ answered</span>
                    </div>
                    <div className="q-progress">
                      <div className="q-progress-fill" style={{ width: `${totalMCQ ? (answeredMCQ/totalMCQ)*100 : 0}%` }}/>
                    </div>
                  </div>
                )}

                {/* Questions */}
                {(quizData.questions as any[]).map((q: any, qi: number) => {
                  // Defensive field extraction — handle any casing/naming Claude might use
                  const questionText: string = String(q.question || q.Question || q.text || q.stem || '')
                  const answerText:   string = String(q.answer   || q.Answer   || q.correct_answer || q.correctAnswer || '')
                  const explText:     string = String(q.explanation || q.Explanation || q.rationale || '')
                  const opts: string[] = Array.isArray(q.options)  ? q.options
                                       : Array.isArray(q.choices)  ? q.choices
                                       : Array.isArray(q.Options)  ? q.Options
                                       : []

                  // MCQ = type is 'mcq' OR has options array with items
                  const isMCQ = q.type === 'mcq' || opts.length > 0

                  const userAns    = answers[qi] ?? ''
                  const isRevealed = !!revealed[qi]
                  const isCorrect  = isMCQ && submitted && userAns === answerText
                  const isWrong    = isMCQ && submitted && !!userAns && userAns !== answerText

                  const cardBorder = submitted
                    ? isMCQ
                      ? isCorrect ? '2px solid #16a34a' : isWrong ? '2px solid #dc2626' : '1.5px solid #e8e8e8'
                      : isRevealed ? '2px solid #7c3aed' : '1.5px solid #e8e8e8'
                    : '1.5px solid #e8e8e8'

                  return (
                    <div key={qi} style={{
                      background: '#fff',
                      border: cardBorder,
                      borderRadius: 14,
                      overflow: 'hidden',
                      marginBottom: 0,
                      animation: 'fadeup .28s ease',
                    }}>
                      {/* Header */}
                      <div style={{ display:'flex', alignItems:'flex-start', gap:11, padding:'14px 18px 10px' }}>
                        <div style={{
                          width:26, height:26, borderRadius:8, flexShrink:0, marginTop:1,
                          background: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#7c3aed',
                          color:'#fff', fontSize:11, fontWeight:800,
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>{qi + 1}</div>
                        <div style={{ flex:1 }}>
                          <div style={{
                            display:'inline-flex', alignItems:'center', gap:4,
                            padding:'2px 8px', borderRadius:10, marginBottom:6,
                            background: isMCQ ? '#ede9fe' : '#fce7f3',
                            color: isMCQ ? '#7c3aed' : '#be185d',
                            fontSize:9, fontWeight:700,
                          }}>
                            {isMCQ ? '⬤ Multiple Choice' : '✍ Short Answer'}
                          </div>
                          <div style={{ fontSize:13, fontWeight:600, color:'#1d1d1f', lineHeight:1.55 }}>
                            {questionText || <span style={{color:'#aaa',fontStyle:'italic'}}>No question text</span>}
                          </div>
                        </div>
                      </div>

                      {/* MCQ Options */}
                      {isMCQ && (
                        <div style={{ padding:'0 18px 10px', display:'flex', flexDirection:'column', gap:6 }}>
                          {opts.length === 0 && (
                            <div style={{fontSize:11,color:'#aaa',fontStyle:'italic',padding:'6px 0'}}>No options available — regenerate the quiz.</div>
                          )}
                          {opts.map((opt: string, oi: number) => {
                            const isRight = submitted && opt === answerText
                            const isErr   = submitted && userAns === opt && opt !== answerText
                            const isSel   = !submitted && userAns === opt
                            const bg    = isRight ? '#dcfce7' : isErr ? '#fee2e2' : isSel ? '#ede9fe' : '#fafafa'
                            const border = isRight ? '1.5px solid #16a34a' : isErr ? '1.5px solid #dc2626' : isSel ? '1.5px solid #7c3aed' : '1.5px solid #e8e8e8'
                            const col   = isRight ? '#15803d' : isErr ? '#b91c1c' : isSel ? '#7c3aed' : '#1d1d1f'
                            const ltrBg = isRight ? 'rgba(22,163,74,.2)' : isErr ? 'rgba(220,38,38,.2)' : isSel ? 'rgba(124,58,237,.2)' : 'rgba(0,0,0,.07)'
                            const ltrCol = isRight ? '#15803d' : isErr ? '#b91c1c' : isSel ? '#7c3aed' : 'rgba(0,0,0,.5)'
                            return (
                              <button key={oi}
                                disabled={submitted}
                                onClick={() => selectOption(qi, opt)}
                                style={{
                                  width:'100%', textAlign:'left', padding:'10px 14px',
                                  borderRadius:9, border, background:bg,
                                  fontSize:12, fontWeight:600, color:col,
                                  cursor: submitted ? 'default' : 'pointer',
                                  display:'flex', alignItems:'center', gap:10,
                                  lineHeight:1.45, transition:'all .14s',
                                }}>
                                <span style={{
                                  width:22, height:22, borderRadius:6, flexShrink:0,
                                  background:ltrBg, color:ltrCol,
                                  fontSize:10, fontWeight:800,
                                  display:'flex', alignItems:'center', justifyContent:'center',
                                }}>{LETTERS[oi]}</span>
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* Short Answer */}
                      {!isMCQ && (
                        <div style={{ padding:'0 18px 12px' }}>
                          <textarea
                            rows={3}
                            placeholder="Type your answer here…"
                            disabled={submitted}
                            value={answers[qi] ?? ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [qi]: e.target.value }))}
                            style={{
                              width:'100%', padding:'10px 12px', borderRadius:9,
                              border:'1.5px solid #e8e8e8', fontSize:12,
                              fontFamily:'system-ui,sans-serif', color:'#1d1d1f',
                              resize:'vertical', minHeight:80, outline:'none',
                              background: submitted ? '#f9f9f9' : '#fff',
                            }}
                          />
                          {!isRevealed && (
                            <button
                              onClick={() => revealShort(qi)}
                              style={{
                                marginTop:8, padding:'7px 14px', borderRadius:8,
                                border:'1.5px solid #7c3aed', background:'transparent',
                                color:'#7c3aed', fontSize:11, fontWeight:700, cursor:'pointer',
                              }}>
                              👁 {submitted ? 'Show Model Answer' : 'Reveal Answer'}
                            </button>
                          )}
                          {isRevealed && (
                            <div style={{
                              marginTop:8, padding:'10px 13px', background:'#fef9c3',
                              borderRadius:8, fontSize:11, color:'#78350f', lineHeight:1.6,
                              border:'1px solid #fde68a',
                            }}>
                              <strong style={{ display:'block', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:3, color:'#92400e' }}>Model Answer</strong>
                              {answerText}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Explanation */}
                      {((isMCQ && submitted) || (!isMCQ && isRevealed)) && explText && (
                        <div style={{
                          margin:'0 18px 12px', padding:'10px 13px', background:'#f5f3ff',
                          borderRadius:8, fontSize:11, color:'#4c1d95', lineHeight:1.6,
                          border:'1px solid #e9d5ff',
                        }}>
                          <strong style={{ display:'block', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:3, color:'#7c3aed' }}>Explanation</strong>
                          {explText}
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
      </div>

      <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }}
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value='' }}/>
    </>
  )
}
