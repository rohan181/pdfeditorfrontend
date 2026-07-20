'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:var(--font-inter,system-ui,sans-serif)}

.pg{min-height:100vh;background:#fff;color:#1d1d1f;overflow-x:hidden;padding-top:56px;}
.wrap{max-width:960px;margin:0 auto;padding:0 28px}

/* nav — matches AppleHome */

.nav-in{display:flex;align-items:center;justify-content:space-between;width:100%}
.logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none}
.logo-mark{width:28px;height:28px;background:#1d1d1f;border-radius:7px;display:flex;align-items:center;justify-content:center}
.logo-mark svg{width:13px;height:13px;fill:#fff}
.logo-name{font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-.04em}
.logo-name em{font-style:normal;color:#E24B4A}
.back{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:500;color:rgba(0,0,0,.5);text-decoration:none;padding:5px 14px;border-radius:99px;transition:color .15s}
.back:hover{color:#1d1d1f}

/* hero */
.hero{padding:72px 0 40px;text-align:center;border-bottom:1px solid #f0f0f0}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fff5f5;border:1px solid rgba(226,75,74,.2);border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.08em;color:#E24B4A;margin-bottom:20px;text-transform:uppercase}
.bdot{width:5px;height:5px;border-radius:50%;background:#E24B4A}
.hero h1{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:clamp(32px,5vw,58px);font-weight:800;letter-spacing:-.05em;line-height:.97;color:#1d1d1f;margin-bottom:16px}
.hero h1 em{font-style:normal;color:#E24B4A}
.hero p{font-size:15px;color:rgba(0,0,0,.5);line-height:1.7;max-width:440px;margin:0 auto}

/* card */
.card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:32px;margin:36px 0 20px;box-shadow:0 2px 20px rgba(0,0,0,.04)}
@media(max-width:600px){.card{padding:20px 16px}}

/* upload zone */
.drop{border:2px dashed #d0d0d0;border-radius:12px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa}
.drop:hover,.drop.active{border-color:#E24B4A;background:#fff5f5}
.drop-icon{font-size:40px;display:block;margin-bottom:12px}
.drop h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:18px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
.drop p{font-size:13px;color:rgba(0,0,0,.45);margin-bottom:18px;line-height:1.5}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#1d1d1f;border-radius:8px;font-size:13px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:all .15s}
.drop-btn:hover{background:#E24B4A}
.drop-note{font-size:9px;letter-spacing:.06em;color:rgba(0,0,0,.25);margin-top:12px;text-transform:uppercase}

/* file preview */
.file-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#f5f5f7;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:20px}
.file-icon{width:34px;height:34px;background:#E24B4A;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}
.file-info{flex:1;min-width:0}
.file-name{font-size:13px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-size{font-size:10px;color:rgba(0,0,0,.4);margin-top:2px}
.file-rm{width:26px;height:38px;border-radius:6px;background:transparent;border:1px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.35);font-size:12px;transition:all .15s}
.file-rm:hover{background:#fff0f0;border-color:#E24B4A;color:#E24B4A}

/* inputs */
.field{margin-bottom:14px}
.field label{display:block;font-size:10px;font-weight:600;letter-spacing:.08em;color:rgba(0,0,0,.4);margin-bottom:7px;text-transform:uppercase}
.input-wrap{position:relative}
.input-wrap input{width:100%;padding:11px 42px 11px 14px;background:#fff;border:1px solid #d8d8d8;border-radius:9px;color:#1d1d1f;font-size:14px;font-family:inherit;outline:none;transition:border-color .15s}
.input-wrap input:focus{border-color:#1d1d1f;box-shadow:0 0 0 3px rgba(29,29,31,.06)}
.input-wrap input::placeholder{color:rgba(0,0,0,.25)}
.eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(0,0,0,.3);font-size:15px;padding:4px;transition:color .15s}
.eye-btn:hover{color:#1d1d1f}
.match-ok{color:#15803d;font-size:10px;margin-top:5px;display:flex;align-items:center;gap:4px;font-weight:500}
.match-err{color:#E24B4A;font-size:10px;margin-top:5px;font-weight:500}

/* strength */
.strength{margin-top:7px}
.strength-bars{display:flex;gap:3px;margin-bottom:3px}
.sbar{height:3px;border-radius:99px;flex:1;background:#e8e8e8;transition:background .25s}
.sbar.weak{background:#E24B4A}
.sbar.fair{background:#fb923c}
.sbar.good{background:#facc15}
.sbar.strong{background:#22c55e}
.strength-label{font-size:9px;letter-spacing:.06em;color:rgba(0,0,0,.35);text-transform:uppercase}

/* options */
.opts{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.opt{display:flex;align-items:center;gap:8px;padding:10px 13px;border:1px solid #e0e0e0;border-radius:9px;cursor:pointer;transition:all .15s;flex:1;min-width:140px;background:#fff}
.opt:hover{border-color:#bbb;background:#fafafa}
.opt.selected{border-color:#1d1d1f;background:#f5f5f7}
.opt-radio{width:13px;height:13px;border-radius:50%;border:1.5px solid #ccc;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.opt.selected .opt-radio{border-color:#1d1d1f;background:#1d1d1f}
.opt-radio::after{content:'';width:4px;height:4px;border-radius:50%;background:#fff;opacity:0;transition:opacity .15s}
.opt.selected .opt-radio::after{opacity:1}
.opt-text{font-size:12px;color:rgba(0,0,0,.55);font-weight:500;line-height:1.4}

/* lock button */
.lock-btn{width:100%;padding:14px;background:#1d1d1f;border:none;border-radius:10px;font-family:var(--font-jakarta,system-ui,sans-serif);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.lock-btn:hover:not(:disabled){background:#E24B4A}
.lock-btn:disabled{opacity:.4;cursor:not-allowed}

/* progress */
.progress-wrap{margin-top:14px}
.progress-bar{height:3px;background:#e8e8e8;border-radius:99px;overflow:hidden}
.progress-fill{height:100%;background:#1d1d1f;border-radius:99px}
.progress-label{font-size:10px;color:rgba(0,0,0,.4);margin-top:6px;text-align:center;letter-spacing:.06em;text-transform:uppercase}

/* success */
.success{text-align:center;padding:32px 20px}
.success-icon{font-size:52px;margin-bottom:14px;display:block}
.success h2{font-family:var(--font-jakarta,system-ui,sans-serif);font-size:22px;font-weight:800;margin-bottom:8px;letter-spacing:-.03em;color:#1d1d1f}
.success p{font-size:14px;color:rgba(0,0,0,.5);margin-bottom:24px;line-height:1.6}
.again-btn{display:inline-flex;align-items:center;gap:7px;padding:12px 24px;background:#1d1d1f;border-radius:10px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;border:none;transition:background .15s}
.again-btn:hover{background:#E24B4A}

/* info cards */
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:48px}
@media(max-width:640px){.info-grid{grid-template-columns:1fr}}
.info-card{padding:18px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px}
.info-card h3{font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:5px;letter-spacing:-.02em}
.info-card p{font-size:12px;color:rgba(0,0,0,.45);line-height:1.6}

/* error */
.error-box{padding:11px 14px;background:#fff5f5;border:1px solid rgba(226,75,74,.25);border-radius:9px;font-size:13px;color:#E24B4A;margin-top:10px}
`

function getStrength(pwd: string): { score: number; label: string } {
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][score] || ''
  return { score, label }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export default function PDFPasswordLockPage() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [permissions, setPermissions] = useState<'read' | 'full'>('read')
  const fileRef = useRef<HTMLInputElement>(null)
  const lockedName  = file ? file.name.replace(/\.pdf$/i, '') + '_locked.pdf' : 'locked.pdf'

  const strength = getStrength(password)
  const pwdMatch = confirm.length === 0 ? null : password === confirm

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return }
    setFile(f); setError(''); setDone(false)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const onLock = async () => {
    if (!file) return
    if (!password) { setError('Please enter a password.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 4) { setError('Password must be at least 4 characters.'); return }
    setError(''); setProcessing(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('password', password)
      form.append('filename', file.name)

      const res = await fetch('/api/lock-pdf', { method: 'POST', body: form })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Server error ${res.status}`)
      }

      // Read Content-Disposition for the server-generated filename
      const cd = res.headers.get('content-disposition') ?? ''
      const match = cd.match(/filename="([^"]+)"/)
      const name = match ? match[1] : lockedName

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 5000)

      setDone(true)
    } catch (e: any) {
      setError('Failed: ' + (e?.message ?? 'unknown error'))
    } finally {
      setProcessing(false)
    }
  }

  const reset = () => {
    setFile(null); setPassword(''); setConfirm(''); setDone(false)
    setError(''); setProcessing(false)
  }

  const barClass = (i: number) => {
    if (i >= strength.score) return 'sbar'
    if (strength.score <= 1) return 'sbar weak'
    if (strength.score <= 2) return 'sbar fair'
    if (strength.score <= 3) return 'sbar good'
    return 'sbar strong'
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">
        {/* Nav */}
        <SiteNav />

        {/* Hero */}
        <div className="hero">
          <div className="wrap">
            <div className="badge"><span className="bdot"/>PDF Security · AES-256</div>
            <h1>Password Lock<br/>Your <em>PDF</em></h1>
            <p>Encrypt any PDF with AES-256 — open it in Chrome, Preview, Acrobat, or any modern reader.</p>
          </div>
        </div>

        {/* Main card */}
        <div className="wrap">
          <div className="card">
            {done ? (
              <div className="success">
                <span className="success-icon">🔒</span>
                <h2>PDF Downloaded!</h2>
                <p>Your locked PDF was downloaded automatically.<br/>Open it and enter your password to access it.</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <button className="again-btn" onClick={reset}>Lock another</button>
                </div>
              </div>
            ) : (
              <>
                {/* Upload zone or file preview */}
                {!file ? (
                  <div
                    className={`drop${dragging ? ' active' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                  >
                    <span className="drop-icon">📄</span>
                    <h2>Drop your PDF here</h2>
                    <p>Drag & drop or click to browse<br/>Up to 100 MB · Stays private</p>
                    <button className="drop-btn">Choose PDF file</button>
                    <div className="drop-note">100% IN-BROWSER · ZERO UPLOAD · ZERO STORAGE</div>
                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                  </div>
                ) : (
                  <>
                    <div className="file-row">
                      <div className="file-icon">📄</div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{formatBytes(file.size)}</div>
                      </div>
                      <button className="file-rm" onClick={reset} title="Remove">✕</button>
                    </div>

                    {/* Password */}
                    <div className="field">
                      <label>Password</label>
                      <div className="input-wrap">
                        <input
                          type={showPwd ? 'text' : 'password'}
                          placeholder="Enter password…"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button className="eye-btn" type="button" onClick={() => setShowPwd(v => !v)}>
                          {showPwd ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <div className="strength">
                          <div className="strength-bars">
                            {[0,1,2,3,4].map(i => <div key={i} className={barClass(i)}/>)}
                          </div>
                          <div className="strength-label">{strength.label}</div>
                        </div>
                      )}
                    </div>

                    {/* Confirm */}
                    <div className="field">
                      <label>Confirm password</label>
                      <div className="input-wrap">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Re-enter password…"
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button className="eye-btn" type="button" onClick={() => setShowConfirm(v => !v)}>
                          {showConfirm ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {pwdMatch === true && <div className="match-ok">✓ Passwords match</div>}
                      {pwdMatch === false && <div className="match-err">✗ Passwords do not match</div>}
                    </div>

                    {/* Permission options */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: 'var(--fm)', fontSize: 10, letterSpacing: '.1em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 10 }}>Permissions</div>
                      <div className="opts">
                        <div className={`opt${permissions === 'read' ? ' selected' : ''}`} onClick={() => setPermissions('read')}>
                          <div className="opt-radio"/>
                          <div className="opt-text"><strong style={{ display: 'block', color: 'var(--fg)', fontSize: 12.5 }}>Read only</strong>Disable print & copy</div>
                        </div>
                        <div className={`opt${permissions === 'full' ? ' selected' : ''}`} onClick={() => setPermissions('full')}>
                          <div className="opt-radio"/>
                          <div className="opt-text"><strong style={{ display: 'block', color: 'var(--fg)', fontSize: 12.5 }}>Full access</strong>Allow print & copy</div>
                        </div>
                      </div>
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <button
                      className="lock-btn"
                      onClick={onLock}
                      disabled={processing || !password || password !== confirm}
                    >
                      {processing ? '🔐 Encrypting…' : '🔒 Lock PDF'}
                    </button>

                    {processing && (
                      <div className="progress-wrap">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '100%', animation: 'none', background: 'linear-gradient(90deg,var(--p),#8b5cf6)' }}/>
                        </div>
                        <div className="progress-label">ENCRYPTING &amp; DOWNLOADING…</div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <h3>🔐 AES-256</h3>
              <p>Industry-standard AES-256 encryption — the same used by banks and governments.</p>
            </div>
            <div className="info-card">
              <h3>⚡ Instant download</h3>
              <p>Click Lock PDF and your encrypted file downloads automatically — no extra step.</p>
            </div>
            <div className="info-card">
              <h3>📂 Universal</h3>
              <p>Opens in Adobe Acrobat, macOS Preview, Chrome, Edge, Firefox — any modern reader.</p>
            </div>
          </div>
        </div>
      </div>
      <ToolSEOSection {...toolSeoData['pdf-password-lock']} />
    </>
  )
}
