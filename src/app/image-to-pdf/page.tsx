'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ToolSEOSection from '@/components/ToolSEOSection'
import toolSeoData from '@/lib/toolSeoData'

type PageSizeOpt = 'A4' | 'Letter' | 'Legal' | 'Fit'
type Orientation  = 'portrait' | 'landscape' | 'auto'
type MarginOpt    = 'none' | 'small' | 'normal'
type QualityOpt   = 'original' | 'compressed'
type FilterType   = 'original' | 'enhanced' | 'grayscale' | 'bw' | 'sepia' | 'sharpen'

interface ImgItem {
  id: string
  file: File
  dataUrl: string
  w: number
  h: number
}

const uid = () => Math.random().toString(36).slice(2, 9)

const PAGE_DIMS: Record<PageSizeOpt, [number, number]> = {
  A4:     [595.28, 841.89],
  Letter: [612,    792   ],
  Legal:  [612,    1008  ],
  Fit:    [0,      0     ],
}
const MARGIN_PTS: Record<MarginOpt, number> = { none: 0, small: 14, normal: 36 }

// ─── Image processing utilities ──────────────────────────────────────────────

function gaussSolve(A: number[][], b: number[]): number[] {
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])
  for (let c = 0; c < n; c++) {
    let mr = c
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[mr][c])) mr = r
    ;[M[c], M[mr]] = [M[mr], M[c]]
    for (let r = c + 1; r < n; r++) {
      if (!M[c][c]) continue
      const f = M[r][c] / M[c][c]
      for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j]
    }
  }
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    x[i] = M[i][n]
    for (let j = i + 1; j < n; j++) x[i] -= M[i][j] * x[j]
    x[i] /= M[i][i]
  }
  return x
}

function computeH(src: [number,number][], dst: [number,number][]): number[] {
  const A: number[][] = [], b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [sx,sy] = src[i], [dx,dy] = dst[i]
    A.push([-sx,-sy,-1,0,0,0,dx*sx,dx*sy]); b.push(-dx)
    A.push([0,0,0,-sx,-sy,-1,dy*sx,dy*sy]); b.push(-dy)
  }
  return [...gaussSolve(A, b), 1]
}

function warpPt(H: number[], x: number, y: number): [number,number] {
  const w = H[6]*x + H[7]*y + H[8]
  return [(H[0]*x+H[1]*y+H[2])/w, (H[3]*x+H[4]*y+H[5])/w]
}

function perspectiveWarp(
  srcCanvas: HTMLCanvasElement,
  corners: [number,number][],  // TL TR BR BL in src pixel coords
  outW: number, outH: number
): string {
  const sd = srcCanvas.getContext('2d')!.getImageData(0, 0, srcCanvas.width, srcCanvas.height).data
  const sw = srcCanvas.width, sh = srcCanvas.height
  const dst: [number,number][] = [[0,0],[outW,0],[outW,outH],[0,outH]]
  const H = computeH(dst, corners)  // inverse map: dst→src

  const out = document.createElement('canvas')
  out.width = outW; out.height = outH
  const outCtx = out.getContext('2d')!
  const od = outCtx.createImageData(outW, outH).data
  const oid = outCtx.createImageData(outW, outH)

  for (let dy = 0; dy < outH; dy++) {
    for (let dx = 0; dx < outW; dx++) {
      const [sx, sy] = warpPt(H, dx, dy)
      const x0 = Math.floor(sx), y0 = Math.floor(sy)
      const x1 = x0 + 1,        y1 = y0 + 1
      const tx = sx - x0,       ty = sy - y0
      const cx = (v: number, max: number) => Math.max(0, Math.min(max-1, v))
      const get = (x: number, y: number, ch: number) => sd[(cx(y,sh)*sw+cx(x,sw))*4+ch]
      const lerp = (a: number, b: number, t: number) => a*(1-t)+b*t
      const oi = (dy*outW+dx)*4
      for (let ch = 0; ch < 4; ch++) {
        oid.data[oi+ch] = lerp(lerp(get(x0,y0,ch),get(x1,y0,ch),tx), lerp(get(x0,y1,ch),get(x1,y1,ch),tx), ty)
      }
    }
  }
  outCtx.putImageData(oid, 0, 0)
  return out.toDataURL('image/png')
}

function applyFilterToData(data: Uint8ClampedArray, filter: FilterType) {
  const n = data.length
  if (filter === 'grayscale' || filter === 'bw') {
    for (let i = 0; i < n; i += 4) {
      const g = 0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2]
      const v = filter === 'bw' ? (g > 128 ? 255 : 0) : g
      data[i] = data[i+1] = data[i+2] = v
    }
  } else if (filter === 'sepia') {
    for (let i = 0; i < n; i += 4) {
      const [r,g,b] = [data[i],data[i+1],data[i+2]]
      data[i]   = Math.min(255, 0.393*r+0.769*g+0.189*b)
      data[i+1] = Math.min(255, 0.349*r+0.686*g+0.168*b)
      data[i+2] = Math.min(255, 0.272*r+0.534*g+0.131*b)
    }
  } else if (filter === 'enhanced') {
    for (let ch = 0; ch < 3; ch++) {
      let mn = 255, mx = 0
      for (let i = ch; i < n; i += 4) { mn = Math.min(mn,data[i]); mx = Math.max(mx,data[i]) }
      const rng = mx - mn || 1
      for (let i = ch; i < n; i += 4) data[i] = Math.round((data[i]-mn)/rng*255)
    }
  }
}

function sharpenImageData(id: ImageData): ImageData {
  const { data, width: w, height: h } = id
  const K = [0,-1,0,-1,5,-1,0,-1,0]
  const out = new ImageData(w, h)
  for (let y = 1; y < h-1; y++) for (let x = 1; x < w-1; x++) {
    for (let ch = 0; ch < 3; ch++) {
      let v = 0
      for (let ky=-1;ky<=1;ky++) for (let kx=-1;kx<=1;kx++)
        v += data[((y+ky)*w+(x+kx))*4+ch] * K[(ky+1)*3+(kx+1)]
      out.data[(y*w+x)*4+ch] = Math.max(0,Math.min(255,v))
    }
    out.data[(y*w+x)*4+3] = data[(y*w+x)*4+3]
  }
  return out
}

function removeBgData(id: ImageData): ImageData {
  const out = new ImageData(id.width, id.height)
  out.data.set(id.data)
  for (let i = 0; i < out.data.length; i += 4)
    if (out.data[i]>220 && out.data[i+1]>220 && out.data[i+2]>220) out.data[i+3] = 0
  return out
}

// ─── Scanner-grade auto-detect: Canny edges → Hough lines → quad corners ──────

function gaussBlur5(src: Float32Array, W: number, H: number): Float32Array {
  // Separable 1D Gaussian [1 4 6 4 1] / 16
  const tmp = new Float32Array(W * H)
  const dst = new Float32Array(W * H)
  const K = [1, 4, 6, 4, 1], S = 16
  // Horizontal pass
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0
    for (let k = -2; k <= 2; k++) v += src[y*W + Math.max(0,Math.min(W-1,x+k))] * K[k+2]
    tmp[y*W+x] = v / S
  }
  // Vertical pass
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0
    for (let k = -2; k <= 2; k++) v += tmp[Math.max(0,Math.min(H-1,y+k))*W+x] * K[k+2]
    dst[y*W+x] = v / S
  }
  return dst
}

function cannyEdges(gray: Float32Array, W: number, H: number, lo: number, hi: number): Uint8Array {
  // Sobel + NMS + double threshold
  const mag = new Float32Array(W * H)
  const ang = new Float32Array(W * H)
  for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
    const gx = -gray[(y-1)*W+(x-1)] - 2*gray[y*W+(x-1)] - gray[(y+1)*W+(x-1)]
             +  gray[(y-1)*W+(x+1)] + 2*gray[y*W+(x+1)] + gray[(y+1)*W+(x+1)]
    const gy = -gray[(y-1)*W+(x-1)] - 2*gray[(y-1)*W+x] - gray[(y-1)*W+(x+1)]
             +  gray[(y+1)*W+(x-1)] + 2*gray[(y+1)*W+x] + gray[(y+1)*W+(x+1)]
    mag[y*W+x] = Math.sqrt(gx*gx + gy*gy)
    ang[y*W+x] = Math.atan2(gy, gx)
  }
  // NMS
  const nms = new Float32Array(W * H)
  for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
    const m = mag[y*W+x], a = ang[y*W+x]
    const d = ((a * 4 / Math.PI) + 8.5) % 4
    let n1: number, n2: number
    if      (d < 1) { n1=mag[y*W+(x+1)];     n2=mag[y*W+(x-1)] }
    else if (d < 2) { n1=mag[(y-1)*W+(x+1)]; n2=mag[(y+1)*W+(x-1)] }
    else if (d < 3) { n1=mag[(y-1)*W+x];     n2=mag[(y+1)*W+x] }
    else            { n1=mag[(y-1)*W+(x-1)]; n2=mag[(y+1)*W+(x+1)] }
    if (m >= n1 && m >= n2) nms[y*W+x] = m
  }
  // Hysteresis threshold
  const edges = new Uint8Array(W * H)
  for (let i = 0; i < W*H; i++) {
    if (nms[i] >= hi) edges[i] = 2          // strong
    else if (nms[i] >= lo) edges[i] = 1     // weak
  }
  // Connect weak pixels adjacent to strong
  for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
    if (edges[y*W+x] !== 1) continue
    if (edges[(y-1)*W+(x-1)]===2||edges[(y-1)*W+x]===2||edges[(y-1)*W+(x+1)]===2||
        edges[y*W+(x-1)]===2    ||                       edges[y*W+(x+1)]===2||
        edges[(y+1)*W+(x-1)]===2||edges[(y+1)*W+x]===2||edges[(y+1)*W+(x+1)]===2)
      edges[y*W+x] = 2
    else edges[y*W+x] = 0
  }
  // Binarise: strong=1
  for (let i = 0; i < W*H; i++) edges[i] = edges[i] === 2 ? 1 : 0
  return edges
}

function houghLines(
  edges: Uint8Array, W: number, H: number
): { r: number; t: number; v: number }[] {
  const N_T = 180
  const DIAG = Math.ceil(Math.sqrt(W*W + H*H))
  const N_R  = 2 * DIAG + 1
  const acc  = new Int32Array(N_R * N_T)
  const cosT = new Float32Array(N_T)
  const sinT = new Float32Array(N_T)
  for (let t = 0; t < N_T; t++) {
    const a = t * Math.PI / N_T
    cosT[t] = Math.cos(a); sinT[t] = Math.sin(a)
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!edges[y*W+x]) continue
    for (let t = 0; t < N_T; t++) {
      const r = Math.round(x*cosT[t] + y*sinT[t]) + DIAG
      if (r >= 0 && r < N_R) acc[r*N_T+t]++
    }
  }
  // Collect candidates above adaptive threshold
  let maxV = 0
  for (let i = 0; i < acc.length; i++) maxV = Math.max(maxV, acc[i])
  const THRESH = Math.max(15, maxV * 0.25)
  const candidates: { r:number; t:number; v:number }[] = []
  for (let ri = 0; ri < N_R; ri++) for (let t = 0; t < N_T; t++) {
    const v = acc[ri*N_T+t]
    if (v >= THRESH) candidates.push({ r: ri-DIAG, t, v })
  }
  candidates.sort((a,b) => b.v - a.v)

  // Greedy NMS: keep non-overlapping peaks
  const SUPP_R = 20, SUPP_T = 15
  const peaks: typeof candidates = []
  for (const c of candidates) {
    if (!peaks.some(p => Math.abs(p.r-c.r) < SUPP_R && Math.abs(p.t-c.t) < SUPP_T)) {
      peaks.push(c)
    }
    if (peaks.length >= 60) break
  }
  return peaks
}

function lineIntersect(r1:number,t1:number,r2:number,t2:number): [number,number]|null {
  const N_T = 180
  const a1 = t1*Math.PI/N_T, a2 = t2*Math.PI/N_T
  const c1=Math.cos(a1),s1=Math.sin(a1),c2=Math.cos(a2),s2=Math.sin(a2)
  const det = c1*s2 - c2*s1
  if (Math.abs(det) < 1e-6) return null
  return [(r1*s2-r2*s1)/det, (r2*c1-r1*c2)/det]
}

function orderCorners(pts: [number,number][]): [number,number][] {
  const sum  = ([x,y]:[number,number]) => x+y
  const diff = ([x,y]:[number,number]) => x-y
  const tl = pts.reduce((a,b) => sum(a)<sum(b)?a:b)
  const br = pts.reduce((a,b) => sum(a)>sum(b)?a:b)
  const tr = pts.reduce((a,b) => diff(a)>diff(b)?a:b)
  const bl = pts.reduce((a,b) => diff(a)<diff(b)?a:b)
  return [tl,tr,br,bl]
}

function autoDetect(canvas: HTMLCanvasElement): [number,number][] {
  // Downsample for speed
  const MAX = 480
  const sc = Math.min(1, MAX / Math.max(canvas.width, canvas.height))
  const W = Math.round(canvas.width*sc), H = Math.round(canvas.height*sc)
  const tmp = document.createElement('canvas'); tmp.width=W; tmp.height=H
  const tctx = tmp.getContext('2d')!
  tctx.drawImage(canvas, 0, 0, W, H)
  const { data } = tctx.getImageData(0, 0, W, H)

  // Grayscale
  const gray = new Float32Array(W * H)
  for (let i = 0; i < W*H; i++)
    gray[i] = 0.299*data[i*4] + 0.587*data[i*4+1] + 0.114*data[i*4+2]

  // Blur → edges
  const blurred = gaussBlur5(gray, W, H)
  const edges   = cannyEdges(blurred, W, H, 20, 50)

  // Hough lines
  const lines = houghLines(edges, W, H)

  // θ in Hough: 0°=vertical, 90°=horizontal
  // H-lines: θ ∈ [65°,115°];  V-lines: θ ∈ [0°,25°]∪[155°,180°)
  const ANG_TOL = 28
  const isH = ({t}:{t:number}) => Math.abs(t - 90) <= ANG_TOL
  const isV = ({t}:{t:number}) => t <= ANG_TOL || t >= 180 - ANG_TOL

  // Dedup lines within distance minD in rho-space
  const dedup = (grp: typeof lines, minD: number) => {
    const out: typeof lines = []
    for (const l of grp) {
      // Use mid-point intercept for comparison robustness
      if (!out.some(q => Math.abs(q.r - l.r) < minD && Math.abs(q.t - l.t) < ANG_TOL))
        out.push(l)
    }
    return out
  }

  const hLines = dedup(lines.filter(isH), Math.min(W,H)*0.09)
  const vLines = dedup(lines.filter(isV), Math.min(W,H)*0.09)

  // Pick the 2 most-separated lines from each orientation group
  const bestPair = (grp: typeof lines) => {
    // Compute canonical separation as the span at image centre
    const center = (l: typeof lines[0]) => {
      const a = l.t*Math.PI/180
      // x-intercept at y=H/2 for V, y-intercept at x=W/2 for H
      if (isV(l)) {
        const cosA = Math.cos(a)
        return Math.abs(cosA) > 1e-6 ? (l.r - (H/2)*Math.sin(a)) / cosA : l.r
      } else {
        const sinA = Math.sin(a)
        return Math.abs(sinA) > 1e-6 ? (l.r - (W/2)*Math.cos(a)) / sinA : l.r
      }
    }
    let best: [typeof lines[0], typeof lines[0]] = [grp[0], grp[1]]
    let maxD = 0
    for (let i = 0; i < Math.min(grp.length,10); i++)
      for (let j = i+1; j < Math.min(grp.length,10); j++) {
        const d = Math.abs(center(grp[i]) - center(grp[j]))
        if (d > maxD) { maxD=d; best=[grp[i],grp[j]] }
      }
    return best
  }

  if (hLines.length < 2 || vLines.length < 2) {
    return fallbackScan(data, W, H)
  }

  const [h1,h2] = bestPair(hLines)
  const [v1,v2] = bestPair(vLines)

  const corners = [
    lineIntersect(h1.r,h1.t, v1.r,v1.t),
    lineIntersect(h1.r,h1.t, v2.r,v2.t),
    lineIntersect(h2.r,h2.t, v2.r,v2.t),
    lineIntersect(h2.r,h2.t, v1.r,v1.t),
  ]
  if (corners.some(c => !c)) return fallbackScan(data, W, H)

  const normed = corners.map(c => [
    Math.max(-0.05, Math.min(1.05, c![0]/W)),
    Math.max(-0.05, Math.min(1.05, c![1]/H)),
  ]) as [number,number][]

  return orderCorners(normed)
}

// Fallback when Hough can't find 4 clear lines: edge-scan bounding box
function fallbackScan(data: Uint8ClampedArray, W: number, H: number): [number,number][] {
  const L = (x:number,y:number) => {
    const i=(Math.max(0,Math.min(H-1,y))*W+Math.max(0,Math.min(W-1,x)))*4
    return (data[i]+data[i+1]+data[i+2])/3
  }
  const grad = new Float32Array(W*H)
  for (let y=1;y<H-1;y++) for (let x=1;x<W-1;x++) {
    const gx=L(x+1,y)-L(x-1,y), gy=L(x,y+1)-L(x,y-1)
    grad[y*W+x] = Math.sqrt(gx*gx+gy*gy)
  }
  const T=20
  const col=(x:number)=>{let s=0;for(let y=0;y<H;y++)s+=grad[y*W+x];return s/H}
  const row=(y:number)=>{let s=0;for(let x=0;x<W;x++)s+=grad[y*W+x];return s/W}
  let l=0,r=W-1,t=0,b=H-1
  for(let x=2;x<W-2;x++){if(col(x)>T){l=x;break}}
  for(let x=W-3;x>=2;x--){if(col(x)>T){r=x;break}}
  for(let y=2;y<H-2;y++){if(row(y)>T){t=y;break}}
  for(let y=H-3;y>=2;y--){if(row(y)>T){b=y;break}}
  const p=0.008
  return [
    [Math.max(0,l/W-p), Math.max(0,t/H-p)],
    [Math.min(1,r/W+p), Math.max(0,t/H-p)],
    [Math.min(1,r/W+p), Math.min(1,b/H+p)],
    [Math.max(0,l/W-p), Math.min(1,b/H+p)],
  ]
}

const DEF_CORNERS: [number,number][] = [[0,0],[1,0],[1,1],[0,1]]
const isDefaultCrop = (c: [number,number][]) =>
  c.every(([x,y],i) => Math.abs(x-DEF_CORNERS[i][0])<0.004 && Math.abs(y-DEF_CORNERS[i][1])<0.004)

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{background:#fff;color:#1d1d1f;font-family:system-ui,sans-serif}
.pg{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f7}

.logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.logo-mark{display:flex;align-items:center;justify-content:center}
.logo-name{font-size:14px;font-weight:700;color:#0D1B4B;letter-spacing:-.03em}
.logo-name .logo-ai{color:#dc2626;margin-left:2px}
.nav-sep{font-size:11px;color:rgba(0,0,0,.2)}
.nav-title{font-size:13px;font-weight:700;color:#1d1d1f}
.nav-count{font-size:11px;color:rgba(0,0,0,.38)}
.nav-sp{flex:1}
.nbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all .14s;white-space:nowrap}
.nbtn.pri{background:#f59e0b;color:#fff}.nbtn.pri:hover{background:#d97706}
.nbtn.sec{background:#f0f0f0;color:#1d1d1f}.nbtn.sec:hover{background:#e0e0e0}
.nbtn:disabled{opacity:.38;cursor:not-allowed}
.body{flex:1;display:flex;overflow:hidden}
.main{flex:1;overflow-y:auto;padding:20px;background:#e8e8ea;min-height:0}
.drop-z{border:2px dashed #d0d0d0;border-radius:16px;padding:52px 24px;text-align:center;cursor:pointer;transition:all .17s;background:#fafafa;max-width:680px;margin:40px auto 0}
.drop-z:hover,.drop-z.over{border-color:#f59e0b;background:#fffbeb}
.drop-icon{font-size:48px;margin-bottom:12px}
.drop-txt{font-size:13px;color:rgba(0,0,0,.42);margin-bottom:20px;line-height:1.7}
.drop-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 24px;background:#1d1d1f;border-radius:9px;font-size:13px;font-weight:700;color:#fff;border:none;cursor:pointer;transition:background .14s}
.drop-btn:hover{background:#f59e0b}
.fmt-chips{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;flex-wrap:wrap}
.fmt-chip{padding:3px 9px;border-radius:99px;background:#f0f0f0;font-size:10px;font-weight:700;color:rgba(0,0,0,.4);text-transform:uppercase;letter-spacing:.05em}
.grid-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.grid-ttl{font-size:13px;font-weight:700;color:#1d1d1f}
.grid-sub{font-size:11px;color:rgba(0,0,0,.38)}
.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:12px}
.img-card{background:#fff;border-radius:11px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.08);border:2px solid transparent;transition:all .15s;position:relative;cursor:grab;user-select:none}
.img-card:active{cursor:grabbing}
.img-card.drag-over{border-color:#f59e0b;transform:scale(1.03)}
.img-card.dragging{opacity:.38}
.img-card-thumb{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;pointer-events:none;background:#f5f5f5}
.img-card-body{padding:7px 8px 8px}
.img-card-name{font-size:10px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.img-card-dims{font-size:9px;color:rgba(0,0,0,.35);margin-top:1px}
.img-card-actions{display:flex;gap:4px;margin-top:6px}
.ic-btn{flex:1;padding:4px 0;border-radius:5px;border:1px solid #e0e0e0;background:#fff;font-size:9px;font-weight:700;cursor:pointer;color:rgba(0,0,0,.5);transition:all .12s;text-align:center}
.ic-btn:hover{border-color:#f59e0b;color:#d97706;background:#fffbeb}
.ic-btn.del:hover{border-color:rgba(226,75,74,.5);color:#E24B4A;background:rgba(226,75,74,.06)}
.img-card-del{position:absolute;top:5px;right:5px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.55);border:none;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;transition:background .12s}
.img-card-del:hover{background:#E24B4A}
.img-card-num{position:absolute;top:5px;left:5px;background:rgba(0,0,0,.55);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:99px;z-index:2;line-height:1.4}
.img-card-badge{position:absolute;bottom:38px;left:5px;background:#f59e0b;color:#fff;font-size:8px;font-weight:800;padding:2px 5px;border-radius:4px;z-index:2;line-height:1.4;text-transform:uppercase;letter-spacing:.04em}
.add-more{border:2px dashed #d0d0d0;border-radius:11px;aspect-ratio:1/1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;color:rgba(0,0,0,.3);font-size:11px;font-weight:700;transition:all .14s;background:#fff}
.add-more:hover{border-color:#f59e0b;color:#f59e0b;background:#fffbeb}
.right{width:218px;flex-shrink:0;background:#fff;border-left:1px solid #e8e8e8;overflow-y:auto;display:flex;flex-direction:column}
.rp-sec{padding:12px 14px;border-bottom:1px solid #f0f0f0}
.rp-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.seg{display:flex;border:1.5px solid #e0e0e0;border-radius:8px;overflow:hidden}
.seg-btn{flex:1;padding:6px 4px;font-size:10px;font-weight:700;border:none;background:#fff;cursor:pointer;color:rgba(0,0,0,.4);transition:all .12s;text-align:center}
.seg-btn.sel{background:#f59e0b;color:#fff}
.seg-btn:not(.sel):hover{background:#fffbeb;color:#d97706}
.tog-row{display:flex;align-items:center;justify-content:space-between}
.tog-lbl{font-size:11px;color:rgba(0,0,0,.55)}
.tog{width:30px;height:17px;border-radius:8px;border:none;cursor:pointer;position:relative;transition:background .14s;flex-shrink:0}
.tog.on{background:#f59e0b}.tog.off{background:#d0d0d0}
.tok{position:absolute;top:2px;width:13px;height:13px;border-radius:50%;background:#fff;transition:left .14s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tog.on .tok{left:15px}.tog.off .tok{left:2px}
.rp-hint{font-size:9px;color:rgba(0,0,0,.3);margin-top:6px;line-height:1.5}
.converting{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center}
.conv-card{background:#fff;border-radius:16px;padding:32px 40px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.2)}
.conv-spin{width:44px;height:44px;border:4px solid #f0f0f0;border-top-color:#f59e0b;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px}
@keyframes spin{to{transform:rotate(360deg)}}
.conv-lbl{font-size:14px;font-weight:700;color:#1d1d1f}
.conv-sub{font-size:11px;color:rgba(0,0,0,.38);margin-top:5px}
.lp{min-height:100vh;display:flex;flex-direction:column;background:#fff}
.lp-uc{max-width:700px;margin:0 auto;padding:56px 24px;width:100%}
.lp-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#fffbeb;border:1px solid rgba(245,158,11,.3);border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#d97706;margin-bottom:14px;text-transform:uppercase}
.lp-h1{font-size:clamp(26px,5vw,44px);font-weight:800;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:10px;line-height:1.1}
.lp-h1 em{font-style:normal;color:#f59e0b}
.lp-sub{font-size:14px;color:rgba(0,0,0,.42);line-height:1.7;max-width:440px;margin:0 auto 32px}
.lp-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}
.lp-feat{padding:14px 12px;border:1px solid #e8e8e8;border-radius:12px;text-align:center}
.lp-feat-icon{font-size:22px;margin-bottom:6px}
.lp-feat-ttl{font-size:11px;font-weight:700;color:#1d1d1f;margin-bottom:3px}
.lp-feat-body{font-size:10px;color:rgba(0,0,0,.38);line-height:1.5}

/* Smart Scan modal */
.scan-back{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(5px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
.scan-modal{background:#fff;border-radius:16px;box-shadow:0 28px 90px rgba(0,0,0,.25);width:100%;max-width:920px;display:flex;flex-direction:column;overflow:hidden;max-height:calc(100vh - 32px)}
.scan-head{padding:14px 18px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:10px;flex-shrink:0}
.scan-title{font-size:14px;font-weight:800;color:#1d1d1f;letter-spacing:-.03em;flex:1}
.scan-subtitle{font-size:10px;color:rgba(0,0,0,.35);font-weight:500}
.scan-close{width:28px;height:28px;border-radius:50%;border:none;background:#f0f0f0;color:#555;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .12s}
.scan-close:hover{background:#e0e0e0;color:#111}
.scan-body{flex:1;display:flex;overflow:hidden;min-height:0}
.scan-left{flex:1;background:#2a2a2e;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;min-height:0}
.scan-canvas{display:block;max-width:100%;max-height:100%;object-fit:contain}
.scan-right{width:230px;flex-shrink:0;border-left:1px solid #f0f0f0;overflow-y:auto;display:flex;flex-direction:column;gap:0}
.sr-sec{padding:12px 14px;border-bottom:1px solid #f0f0f0}
.sr-ttl{font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.filter-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.filter-btn{padding:8px 4px;border-radius:7px;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;text-align:center;transition:all .12s;font-size:9px;font-weight:700;color:rgba(0,0,0,.45)}
.filter-btn.sel{border-color:#f59e0b;background:#fffbeb;color:#d97706}
.filter-btn:not(.sel):hover{border-color:#d0d0d0;background:#f8f8f8}
.filter-icon{font-size:18px;display:block;margin-bottom:3px}
.auto-btn{width:100%;padding:9px;border-radius:8px;border:1.5px solid #6366f1;background:#f0f0ff;color:#6366f1;font-size:11px;font-weight:700;cursor:pointer;transition:all .13s;display:flex;align-items:center;justify-content:center;gap:5px}
.auto-btn:hover{background:#e8e8ff;border-color:#4f46e5}
.auto-btn:disabled{opacity:.38;cursor:not-allowed}
.reset-btn{width:100%;padding:7px;border-radius:7px;border:1px solid #e0e0e0;background:#fff;color:rgba(0,0,0,.4);font-size:10px;font-weight:700;cursor:pointer;transition:all .12s;margin-top:6px}
.reset-btn:hover{border-color:#bbb;color:rgba(0,0,0,.6)}
.scan-foot{padding:12px 18px;border-top:1px solid #f0f0f0;display:flex;gap:8px;align-items:center;flex-shrink:0}
.sf-cancel{padding:9px 16px;border-radius:8px;border:1px solid #e0e0e0;background:#fff;font-size:12px;font-weight:700;cursor:pointer;color:rgba(0,0,0,.5)}
.sf-cancel:hover{border-color:#bbb;color:#1d1d1f}
.sf-apply{flex:1;padding:10px;border-radius:8px;border:none;background:#f59e0b;color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:background .13s}
.sf-apply:hover:not(:disabled){background:#d97706}
.sf-apply:disabled{opacity:.38;cursor:not-allowed}
.corner-hint{font-size:10px;color:rgba(255,255,255,.5);text-align:center;position:absolute;bottom:8px;left:0;right:0;pointer-events:none}
`

export default function ImageToPDFPage() {
  const [images,     setImages]     = useState<ImgItem[]>([])
  const [pageSize,   setPageSize]   = useState<PageSizeOpt>('A4')
  const [orient,     setOrient]     = useState<Orientation>('auto')
  const [margin,     setMargin]     = useState<MarginOpt>('small')
  const [quality,    setQuality]    = useState<QualityOpt>('original')
  const [pageNums,   setPageNums]   = useState(false)
  const [converting, setConverting] = useState(false)
  const [progress,   setProgress]   = useState('')
  const [dragIdx,    setDragIdx]    = useState<number | null>(null)
  const [overIdx,    setOverIdx]    = useState<number | null>(null)

  // Smart Scan state
  const [scanItem,      setScanItem]      = useState<ImgItem | null>(null)
  const [scanCorners,   setScanCorners]   = useState<[number,number][]>([...DEF_CORNERS])
  const [scanFilter,    setScanFilter]    = useState<FilterType>('original')
  const [scanBgRemove,  setScanBgRemove]  = useState(false)
  const [scanProcessing,setScanProcessing]= useState(false)
  const [autoDetecting, setAutoDetecting] = useState(false)

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const dropZoneRef    = useRef<HTMLDivElement>(null)
  const mainDropRef    = useRef<HTMLDivElement>(null)
  const scanCanvasRef  = useRef<HTMLCanvasElement>(null)
  const scanDragCorner = useRef<number | null>(null)
  const scanImgRef     = useRef<HTMLImageElement | null>(null)

  // ── Load images (with HEIC conversion) ──────────────────────────────────
  const loadFiles = useCallback((files: FileList | File[]) => {
    const isHeic = (f: File) =>
      f.type === 'image/heic' || f.type === 'image/heif' ||
      /\.(heic|heif)$/i.test(f.name)

    const accepted = Array.from(files).filter(f =>
      f.type.startsWith('image/') || isHeic(f)
    )

    accepted.forEach(async (file) => {
      let blob: Blob = file

      if (isHeic(file)) {
        try {
          const heic2any = (await import('heic2any')).default
          const result = await heic2any({ blob: file, toType: 'image/png', quality: 1 })
          blob = Array.isArray(result) ? result[0] : result
        } catch {
          console.warn('HEIC conversion failed for', file.name)
          return
        }
      }

      const reader = new FileReader()
      reader.onload = ev => {
        const dataUrl = ev.target?.result as string
        const img = new Image()
        img.onload = () => setImages(prev => [...prev, {
          id: uid(), file, dataUrl,
          w: img.naturalWidth, h: img.naturalHeight,
        }])
        img.src = dataUrl
      }
      reader.readAsDataURL(blob)
    })
  }, [])

  useEffect(() => {
    const el = mainDropRef.current; if (!el) return
    const ov = (e: DragEvent) => e.preventDefault()
    const dp = (e: DragEvent) => { e.preventDefault(); if (e.dataTransfer?.files) loadFiles(e.dataTransfer.files) }
    el.addEventListener('dragover', ov); el.addEventListener('drop', dp)
    return () => { el.removeEventListener('dragover', ov); el.removeEventListener('drop', dp) }
  }, [loadFiles, images.length])

  useEffect(() => {
    const el = dropZoneRef.current; if (!el) return
    const ov = (e: DragEvent) => { e.preventDefault(); el.classList.add('over') }
    const lv = () => el.classList.remove('over')
    const dp = (e: DragEvent) => { e.preventDefault(); el.classList.remove('over'); if (e.dataTransfer?.files) loadFiles(e.dataTransfer.files) }
    el.addEventListener('dragover', ov); el.addEventListener('dragleave', lv); el.addEventListener('drop', dp)
    return () => { el.removeEventListener('dragover', ov); el.removeEventListener('dragleave', lv); el.removeEventListener('drop', dp) }
  }, [loadFiles])

  // ── Drag-to-reorder ──────────────────────────────────────────────────────
  const onDragStart = (i: number) => setDragIdx(i)
  const onDragOver  = (e: React.DragEvent, i: number) => { e.preventDefault(); setOverIdx(i) }
  const onDrop      = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return }
    setImages(prev => {
      const next = [...prev]; const [m] = next.splice(dragIdx, 1); next.splice(i, 0, m); return next
    })
    setDragIdx(null); setOverIdx(null)
  }
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null) }

  // ── Page dims ────────────────────────────────────────────────────────────
  const getPageDims = (item: ImgItem): [number,number] => {
    if (pageSize === 'Fit') return [item.w * 0.75, item.h * 0.75]
    const [pw, ph] = PAGE_DIMS[pageSize]
    const landscape = orient === 'landscape' || (orient === 'auto' && item.w > item.h)
    return landscape ? [ph, pw] : [pw, ph]
  }

  // ── Get image bytes for pdf-lib ──────────────────────────────────────────
  const getImgBytes = async (item: ImgItem): Promise<{ bytes: Uint8Array; isJpeg: boolean }> => {
    const isJpeg = item.file.type === 'image/jpeg' || item.file.type === 'image/jpg'
    const isPng  = item.file.type === 'image/png'
    if (quality === 'original' && (isJpeg || isPng))
      return { bytes: new Uint8Array(await item.file.arrayBuffer()), isJpeg }
    const canvas = document.createElement('canvas'); canvas.width=item.w; canvas.height=item.h
    const ctx = canvas.getContext('2d')!
    const img = new Image(); img.src = item.dataUrl
    await new Promise<void>(r => { img.complete ? r() : (img.onload = () => r()) })
    ctx.drawImage(img, 0, 0)
    const mime = quality === 'compressed' ? 'image/jpeg' : 'image/png'
    const url = canvas.toDataURL(mime, quality === 'compressed' ? 0.72 : 1)
    const b64 = url.split(',')[1], bin = atob(b64)
    const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
    return { bytes: arr, isJpeg: quality === 'compressed' }
  }

  // ── Convert to PDF ───────────────────────────────────────────────────────
  const convert = async () => {
    if (!images.length) return
    setConverting(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const font   = pageNums ? await pdfDoc.embedFont(StandardFonts.Helvetica) : null
      for (let i = 0; i < images.length; i++) {
        const item = images[i]; setProgress(`Converting image ${i+1} of ${images.length}…`)
        const { bytes, isJpeg } = await getImgBytes(item)
        const [pw, ph] = getPageDims(item)
        const page = pdfDoc.addPage([pw, ph])
        let pdfImg
        try { pdfImg = isJpeg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes) }
        catch {
          const cv = document.createElement('canvas'); cv.width=item.w; cv.height=item.h
          const ctx = cv.getContext('2d')!; const img=new Image(); img.src=item.dataUrl
          await new Promise<void>(r=>{img.complete?r():(img.onload=()=>r())}); ctx.drawImage(img,0,0)
          const url=cv.toDataURL('image/png'),b64=url.split(',')[1],bin=atob(b64)
          const arr=new Uint8Array(bin.length); for(let j=0;j<bin.length;j++) arr[j]=bin.charCodeAt(j)
          pdfImg = await pdfDoc.embedPng(arr)
        }
        const mp=MARGIN_PTS[margin],aw=pw-mp*2,ah=ph-mp*2
        const scale=Math.min(aw/item.w,ah/item.h)
        const iw=item.w*scale,ih=item.h*scale
        page.drawImage(pdfImg,{x:mp+(aw-iw)/2,y:mp+(ah-ih)/2,width:iw,height:ih})
        if (pageNums && font) {
          const lbl=String(i+1),sz=8,tw=font.widthOfTextAtSize(lbl,sz)
          page.drawText(lbl,{x:(pw-tw)/2,y:mp>10?mp-10:4,size:sz,font,color:rgb(.5,.5,.5)})
        }
      }
      setProgress('Saving PDF…')
      const out  = await pdfDoc.save()
      const blob = new Blob([out.buffer as ArrayBuffer],{type:'application/pdf'})
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a'); a.href=url; a.download=`images-to-pdf-${Date.now()}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } finally { setConverting(false); setProgress('') }
  }

  // ── Smart Scan: open modal ────────────────────────────────────────────────
  const openScan = (item: ImgItem) => {
    setScanItem(item)
    setScanCorners([...DEF_CORNERS])
    setScanFilter('original')
    setScanBgRemove(false)
  }

  // ── Smart Scan: draw canvas ───────────────────────────────────────────────
  const drawScanCanvas = useCallback(() => {
    const cv = scanCanvasRef.current; if (!cv || !scanItem) return
    const ctx = cv.getContext('2d')!
    const img = scanImgRef.current || new Image()
    if (!scanImgRef.current) {
      scanImgRef.current = img
      img.onload = () => drawScanCanvas()
      img.src = scanItem.dataUrl; return
    }
    if (!img.complete) return

    ctx.clearRect(0, 0, cv.width, cv.height)
    ctx.drawImage(img, 0, 0, cv.width, cv.height)

    const pts = scanCorners.map(([x,y]): [number,number] => [x*cv.width, y*cv.height])

    // Dark overlay outside selection
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,.48)'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.moveTo(pts[0][0],pts[0][1])
    ctx.lineTo(pts[1][0],pts[1][1])
    ctx.lineTo(pts[2][0],pts[2][1])
    ctx.lineTo(pts[3][0],pts[3][1])
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // Selection border + grid
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(pts[0][0],pts[0][1])
    pts.slice(1).forEach(([x,y]) => ctx.lineTo(x,y))
    ctx.closePath(); ctx.stroke()

    // Thirds grid inside selection
    ctx.save(); ctx.globalAlpha = .35; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.setLineDash([3,4])
    for (let t = 1; t <= 2; t++) {
      const lerp = (a:[number,number], b:[number,number]) => [(a[0]*(3-t)+b[0]*t)/3, (a[1]*(3-t)+b[1]*t)/3] as [number,number]
      const [l0,r0]=[ lerp(pts[0],pts[1]), lerp(pts[3],pts[2]) ]
      const [l1,r1]=[ lerp(pts[0],pts[3]), lerp(pts[1],pts[2]) ]
      ctx.beginPath(); ctx.moveTo(l0[0],l0[1]); ctx.lineTo(r0[0],r0[1]); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(l1[0],l1[1]); ctx.lineTo(r1[0],r1[1]); ctx.stroke()
    }
    ctx.restore()

    // Corner handles
    pts.forEach(([x,y], i) => {
      ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2)
      ctx.fillStyle = '#f59e0b'; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(['TL','TR','BR','BL'][i], x, y)
    })
  }, [scanItem, scanCorners])

  useEffect(() => {
    if (!scanItem) { scanImgRef.current = null; return }
    const cv = scanCanvasRef.current; if (!cv) return
    // Size canvas to fit the panel (640px wide max, maintain aspect)
    const maxW = 640, maxH = 500
    const aspect = scanItem.w / scanItem.h
    cv.width  = Math.min(maxW, maxH * aspect)
    cv.height = cv.width / aspect
    drawScanCanvas()
  }, [scanItem, drawScanCanvas])

  useEffect(() => { if (scanItem) drawScanCanvas() }, [scanCorners, scanFilter, scanBgRemove, drawScanCanvas, scanItem])

  // ── Smart Scan: corner drag ───────────────────────────────────────────────
  const onScanMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = scanCanvasRef.current!
    const rect = cv.getBoundingClientRect()
    const mx = (e.clientX-rect.left)*(cv.width/rect.width)
    const my = (e.clientY-rect.top)*(cv.height/rect.height)
    scanCorners.forEach(([x,y],i) => {
      if (Math.hypot(mx-x*cv.width, my-y*cv.height) < 18) scanDragCorner.current = i
    })
  }
  const onScanMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const i = scanDragCorner.current; if (i === null) return
    const cv = scanCanvasRef.current!
    const rect = cv.getBoundingClientRect()
    const nx = Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))
    const ny = Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))
    setScanCorners(prev => prev.map((c,j) => j===i?[nx,ny]:c) as [number,number][])
  }
  const onScanMouseUp = () => { scanDragCorner.current = null }

  // ── Smart Scan: auto-detect ───────────────────────────────────────────────
  const runAutoDetect = async () => {
    if (!scanItem) return
    setAutoDetecting(true)
    await new Promise(r => setTimeout(r, 0)) // yield to UI
    const cv = document.createElement('canvas')
    cv.width = scanItem.w; cv.height = scanItem.h
    const ctx = cv.getContext('2d')!
    const img = new Image(); img.src = scanItem.dataUrl
    await new Promise<void>(r => { img.complete ? r() : (img.onload = () => r()) })
    ctx.drawImage(img, 0, 0)
    const corners = autoDetect(cv)
    setScanCorners(corners)
    setAutoDetecting(false)
  }

  // ── Smart Scan: apply ─────────────────────────────────────────────────────
  const applyScan = async () => {
    if (!scanItem) return
    setScanProcessing(true)
    try {
      // Build source canvas
      const srcCv = document.createElement('canvas')
      srcCv.width = scanItem.w; srcCv.height = scanItem.h
      const srcCtx = srcCv.getContext('2d')!
      const img = new Image(); img.src = scanItem.dataUrl
      await new Promise<void>(r => { img.complete ? r() : (img.onload = () => r()) })
      srcCtx.drawImage(img, 0, 0)

      // Perspective warp
      let workCv: HTMLCanvasElement
      if (!isDefaultCrop(scanCorners)) {
        const px = scanCorners.map(([x,y]): [number,number] => [x*scanItem.w, y*scanItem.h])
        const tw = Math.hypot(px[1][0]-px[0][0],px[1][1]-px[0][1])
        const bw = Math.hypot(px[2][0]-px[3][0],px[2][1]-px[3][1])
        const lh = Math.hypot(px[3][0]-px[0][0],px[3][1]-px[0][1])
        const rh = Math.hypot(px[2][0]-px[1][0],px[2][1]-px[1][1])
        const outW = Math.min(3000, Math.round((tw+bw)/2))
        const outH = Math.min(3000, Math.round((lh+rh)/2))
        const dataUrl = perspectiveWarp(srcCv, px, outW, outH)
        workCv = document.createElement('canvas'); workCv.width=outW; workCv.height=outH
        const wCtx = workCv.getContext('2d')!
        const wi = new Image(); wi.src = dataUrl
        await new Promise<void>(r => { wi.complete ? r() : (wi.onload = () => r()) })
        wCtx.drawImage(wi, 0, 0)
      } else {
        workCv = srcCv
      }

      // Filters
      if (scanFilter !== 'original') {
        const wCtx = workCv.getContext('2d')!
        let id = wCtx.getImageData(0, 0, workCv.width, workCv.height)
        if (scanFilter === 'sharpen') id = sharpenImageData(id)
        else applyFilterToData(id.data, scanFilter)
        wCtx.putImageData(id, 0, 0)
      }

      // Background removal
      if (scanBgRemove) {
        const wCtx = workCv.getContext('2d')!
        const id = wCtx.getImageData(0, 0, workCv.width, workCv.height)
        wCtx.putImageData(removeBgData(id), 0, 0)
      }

      const dataUrl = workCv.toDataURL('image/png')
      const finalImg = new Image(); finalImg.src = dataUrl
      await new Promise<void>(r => { finalImg.complete ? r() : (finalImg.onload = () => r()) })
      setImages(prev => prev.map(it => it.id!==scanItem.id ? it : { ...it, dataUrl, w:workCv.width, h:workCv.height }))
      setScanItem(null)
    } finally { setScanProcessing(false) }
  }

  // ── Upload landing ────────────────────────────────────────────────────────
  if (!images.length) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="lp">
          <SiteNav />
          <div className="lp-uc">
            <div style={{textAlign:'center',marginBottom:32}}>
              <div className="lp-badge">🖼 Image → PDF</div>
              <h1 className="lp-h1">Turn images into<br/>a <em>PDF</em> instantly</h1>
              <p className="lp-sub">Upload JPG, PNG, WEBP, GIF or BMP — scan, crop, enhance and convert. Everything runs in your browser.</p>
            </div>
            <div ref={dropZoneRef} className="drop-z" onClick={() => fileInputRef.current?.click()}>
              <div className="drop-icon">🖼</div>
              <div className="drop-txt">Drop images here, or click to choose<br/><span style={{fontSize:11,color:'rgba(0,0,0,.28)'}}>Multiple files supported · nothing leaves your browser</span></div>
              <button className="drop-btn" onClick={e=>{e.stopPropagation();fileInputRef.current?.click()}}>Choose Images</button>
              <div className="fmt-chips" style={{marginTop:18}}>
                {['JPG','PNG','WEBP','GIF','BMP','HEIC'].map(f=><span key={f} className="fmt-chip">{f}</span>)}
              </div>
            </div>
            <div className="lp-feats">
              {[{icon:'📷',t:'Smart Scan',b:'Auto-detect & crop document edges, fix perspective'},{icon:'🎨',t:'Filters',b:'Enhanced, B&W, sepia, sharpen — per image'},{icon:'🔒',t:'100% private',b:'In-browser only — no server uploads'}].map(f=>(
                <div key={f.t} className="lp-feat"><div className="lp-feat-icon">{f.icon}</div><div className="lp-feat-ttl">{f.t}</div><div className="lp-feat-body">{f.b}</div></div>
              ))}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" multiple style={{display:'none'}} onChange={e=>{if(e.target.files)loadFiles(e.target.files);e.target.value=''}} />
        </div>
      </>
    )
  }

  // ── Editor ────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pg">
        <nav className="nav">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <svg width="27" height="27" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="lg-it" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e"/><stop offset="1" stopColor="#e11d48"/></linearGradient></defs>
                <path d="M0 0H38C44 0 48 6 48 13.5C48 21 44 27 38 27H10M10 27V48H0V0M10 27H32" stroke="url(#lg-it)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="38" cy="27" r="5" fill="url(#lg-it)"/>
              </svg>
            </div>
            <span className="logo-name">EditPDF<span className="logo-ai"> AI</span></span>
          </Link>
          <span className="nav-sep">›</span>
          <span className="nav-title">Image → PDF</span>
          <span className="nav-count">{images.length} image{images.length!==1?'s':''}</span>
          <div className="nav-sp" />
          <button className="nbtn sec" onClick={() => setImages([])}>← New</button>
          <button className="nbtn pri" disabled={converting} onClick={convert}>{converting?'Converting…':'↓ Convert to PDF'}</button>
        </nav>

        <div className="body">
          <div className="main" ref={mainDropRef}>
            <div className="grid-header">
              <div>
                <div className="grid-ttl">Images ({images.length})</div>
                <div className="grid-sub">Drag cards to reorder · click ✨ Scan to crop & enhance</div>
              </div>
            </div>

            <div className="img-grid">
              {images.map((img, i) => (
                <div key={img.id}
                  className={`img-card${dragIdx===i?' dragging':''}${overIdx===i&&dragIdx!==i?' drag-over':''}`}
                  draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)}
                  onDrop={e=>onDrop(e,i)} onDragEnd={onDragEnd}>
                  <span className="img-card-num">{i+1}</span>
                  <img className="img-card-thumb" src={img.dataUrl} alt={img.file.name} loading="lazy" />
                  <div className="img-card-body">
                    <div className="img-card-name">{img.file.name}</div>
                    <div className="img-card-dims">{img.w}×{img.h}</div>
                    <div className="img-card-actions">
                      <button className="ic-btn" onClick={e=>{e.stopPropagation();openScan(img)}}>✨ Scan</button>
                      <button className="ic-btn del" onClick={e=>{e.stopPropagation();setImages(p=>p.filter(x=>x.id!==img.id))}}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="add-more" onClick={() => fileInputRef.current?.click()}>
                <span style={{fontSize:28}}>+</span><span>Add images</span>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="rp-sec">
              <div className="rp-ttl">Page Size</div>
              <div className="seg" style={{flexWrap:'wrap'}}>
                {(['A4','Letter','Legal','Fit'] as PageSizeOpt[]).map((s,idx) => (
                  <button key={s} className={`seg-btn${pageSize===s?' sel':''}`} onClick={()=>setPageSize(s)}
                    style={{flexBasis:'50%',borderRight:idx%2===0?'1px solid #e0e0e0':undefined}}>
                    {s==='Fit'?'Fit Image':s}
                  </button>
                ))}
              </div>
              {pageSize==='Fit'&&<div className="rp-hint">Each page sized exactly to its image.</div>}
            </div>
            <div className="rp-sec">
              <div className="rp-ttl">Orientation</div>
              <div className="seg">
                {(['portrait','landscape','auto'] as Orientation[]).map(o=>(
                  <button key={o} className={`seg-btn${orient===o?' sel':''}`} onClick={()=>setOrient(o)} style={{fontSize:9}}>
                    {o.charAt(0).toUpperCase()+o.slice(1)}
                  </button>
                ))}
              </div>
              {orient==='auto'&&<div className="rp-hint">Portrait for tall, landscape for wide images.</div>}
            </div>
            <div className="rp-sec">
              <div className="rp-ttl">Margins</div>
              <div className="seg">
                {(['none','small','normal'] as MarginOpt[]).map(m=>(
                  <button key={m} className={`seg-btn${margin===m?' sel':''}`} onClick={()=>setMargin(m)} style={{fontSize:9}}>
                    {m.charAt(0).toUpperCase()+m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="rp-sec">
              <div className="rp-ttl">Quality</div>
              <div className="seg">
                {([['original','Original'],['compressed','Compressed']] as [QualityOpt,string][]).map(([v,l])=>(
                  <button key={v} className={`seg-btn${quality===v?' sel':''}`} onClick={()=>setQuality(v)} style={{fontSize:9}}>{l}</button>
                ))}
              </div>
              {quality==='compressed'&&<div className="rp-hint">JPEG 72% — smaller file size.</div>}
            </div>
            <div className="rp-sec">
              <div className="tog-row">
                <span className="tog-lbl">Page numbers</span>
                <div className={`tog${pageNums?' on':' off'}`} onClick={()=>setPageNums(p=>!p)}><div className="tok"/></div>
              </div>
            </div>
            <div style={{padding:14,marginTop:'auto'}}>
              <button style={{width:'100%',padding:11,borderRadius:9,border:'none',background:'#f59e0b',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer',transition:'background .14s'}}
                disabled={converting} onClick={convert}
                onMouseOver={e=>(e.currentTarget.style.background='#d97706')}
                onMouseOut={e=>(e.currentTarget.style.background='#f59e0b')}>
                {converting?'Converting…':`↓ Convert ${images.length} image${images.length!==1?'s':''} to PDF`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Converting overlay */}
      {converting && (
        <div className="converting">
          <div className="conv-card">
            <div className="conv-spin"/>
            <div className="conv-lbl">Converting to PDF</div>
            <div className="conv-sub">{progress}</div>
          </div>
        </div>
      )}

      {/* ── Smart Scan modal ── */}
      {scanItem && (
        <div className="scan-back" onClick={() => setScanItem(null)}>
          <div className="scan-modal" onClick={e => e.stopPropagation()}>

            <div className="scan-head">
              <div>
                <div className="scan-title">✨ Smart Scan</div>
                <div className="scan-subtitle">{scanItem.file.name} · {scanItem.w}×{scanItem.h}</div>
              </div>
              <button className="scan-close" onClick={() => setScanItem(null)}>×</button>
            </div>

            <div className="scan-body">
              {/* Canvas */}
              <div className="scan-left">
                <canvas ref={scanCanvasRef} className="scan-canvas"
                  style={{cursor:'crosshair'}}
                  onMouseDown={onScanMouseDown}
                  onMouseMove={onScanMouseMove}
                  onMouseUp={onScanMouseUp}
                  onMouseLeave={onScanMouseUp}/>
                <div className="corner-hint">Drag corner handles · TL TR BR BL</div>
              </div>

              {/* Options */}
              <div className="scan-right">
                <div className="sr-sec">
                  <div className="sr-ttl">Edge Detection</div>
                  <button className="auto-btn" disabled={autoDetecting} onClick={runAutoDetect}>
                    {autoDetecting ? <><span style={{display:'inline-block',width:12,height:12,border:'2px solid #6366f1',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}/> Detecting…</> : '🔍 Auto-detect document edges'}
                  </button>
                  <button className="reset-btn" onClick={() => setScanCorners([...DEF_CORNERS])}>
                    Reset corners to full image
                  </button>
                </div>

                <div className="sr-sec">
                  <div className="sr-ttl">Filter</div>
                  <div className="filter-grid">
                    {([
                      ['original','Original','🖼'],
                      ['enhanced','Enhanced','✨'],
                      ['grayscale','Grayscale','⬜'],
                      ['bw','B&W','◼'],
                      ['sepia','Sepia','🟫'],
                      ['sharpen','Sharpen','🔪'],
                    ] as [FilterType,string,string][]).map(([v,l,ic]) => (
                      <button key={v} className={`filter-btn${scanFilter===v?' sel':''}`} onClick={() => setScanFilter(v)}>
                        <span className="filter-icon">{ic}</span>{l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sr-sec">
                  <div className="sr-ttl">Background</div>
                  <div className="tog-row">
                    <span className="tog-lbl">Remove white bg</span>
                    <div className={`tog${scanBgRemove?' on':' off'}`} onClick={() => setScanBgRemove(p=>!p)}><div className="tok"/></div>
                  </div>
                  <div className="rp-hint" style={{marginTop:6}}>Strips near-white pixels to transparent — useful for receipts & signatures.</div>
                </div>

                <div className="sr-sec">
                  <div className="sr-ttl">How to use</div>
                  <div className="rp-hint" style={{lineHeight:1.8}}>
                    1. Click <strong>Auto-detect</strong> to find doc edges<br/>
                    2. Drag the <strong>4 corner handles</strong> to refine<br/>
                    3. Pick a <strong>filter</strong> (Enhanced works great for scans)<br/>
                    4. Hit <strong>Apply</strong> — replaces the image in your list
                  </div>
                </div>
              </div>
            </div>

            <div className="scan-foot">
              <button className="sf-cancel" onClick={() => setScanItem(null)}>Cancel</button>
              <button className="sf-apply" disabled={scanProcessing} onClick={applyScan}>
                {scanProcessing ? 'Processing…' : '✓ Apply to image'}
              </button>
            </div>

          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" multiple style={{display:'none'}}
        onChange={e=>{if(e.target.files)loadFiles(e.target.files);e.target.value=''}} />
      <ToolSEOSection {...toolSeoData['image-to-pdf']} />
    </>
  )
}
