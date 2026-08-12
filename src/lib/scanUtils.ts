// Shared document-scan image processing: perspective correction, filters,
// and automatic edge detection. Used by both Image → PDF (Smart Scan) and
// Scan to PDF (camera capture).

export type FilterType = 'original' | 'enhanced' | 'grayscale' | 'bw' | 'sepia' | 'sharpen'

export const DEF_CORNERS: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1]]

export const isDefaultCrop = (c: [number, number][]) =>
  c.every(([x, y], i) => Math.abs(x - DEF_CORNERS[i][0]) < 0.004 && Math.abs(y - DEF_CORNERS[i][1]) < 0.004)

// ─── Perspective (homography) warp ───────────────────────────────────────────

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

function computeH(src: [number, number][], dst: [number, number][]): number[] {
  const A: number[][] = [], b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [sx, sy] = src[i], [dx, dy] = dst[i]
    A.push([-sx, -sy, -1, 0, 0, 0, dx * sx, dx * sy]); b.push(-dx)
    A.push([0, 0, 0, -sx, -sy, -1, dy * sx, dy * sy]); b.push(-dy)
  }
  return [...gaussSolve(A, b), 1]
}

function warpPt(H: number[], x: number, y: number): [number, number] {
  const w = H[6] * x + H[7] * y + H[8]
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w]
}

export function perspectiveWarp(
  srcCanvas: HTMLCanvasElement,
  corners: [number, number][], // TL TR BR BL in src pixel coords
  outW: number, outH: number,
): string {
  const sd = srcCanvas.getContext('2d')!.getImageData(0, 0, srcCanvas.width, srcCanvas.height).data
  const sw = srcCanvas.width, sh = srcCanvas.height
  const dst: [number, number][] = [[0, 0], [outW, 0], [outW, outH], [0, outH]]
  const H = computeH(dst, corners) // inverse map: dst→src

  const out = document.createElement('canvas')
  out.width = outW; out.height = outH
  const outCtx = out.getContext('2d')!
  const oid = outCtx.createImageData(outW, outH)

  for (let dy = 0; dy < outH; dy++) {
    for (let dx = 0; dx < outW; dx++) {
      const [sx, sy] = warpPt(H, dx, dy)
      const x0 = Math.floor(sx), y0 = Math.floor(sy)
      const x1 = x0 + 1, y1 = y0 + 1
      const tx = sx - x0, ty = sy - y0
      const cx = (v: number, max: number) => Math.max(0, Math.min(max - 1, v))
      const get = (x: number, y: number, ch: number) => sd[(cx(y, sh) * sw + cx(x, sw)) * 4 + ch]
      const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t
      const oi = (dy * outW + dx) * 4
      for (let ch = 0; ch < 4; ch++) {
        oid.data[oi + ch] = lerp(lerp(get(x0, y0, ch), get(x1, y0, ch), tx), lerp(get(x0, y1, ch), get(x1, y1, ch), tx), ty)
      }
    }
  }
  outCtx.putImageData(oid, 0, 0)
  return out.toDataURL('image/png')
}

// ─── Filters ──────────────────────────────────────────────────────────────

export function applyFilterToData(data: Uint8ClampedArray, filter: FilterType) {
  const n = data.length
  if (filter === 'grayscale' || filter === 'bw') {
    for (let i = 0; i < n; i += 4) {
      const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      const v = filter === 'bw' ? (g > 128 ? 255 : 0) : g
      data[i] = data[i + 1] = data[i + 2] = v
    }
  } else if (filter === 'sepia') {
    for (let i = 0; i < n; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      data[i]     = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b)
      data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b)
      data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b)
    }
  } else if (filter === 'enhanced') {
    for (let ch = 0; ch < 3; ch++) {
      let mn = 255, mx = 0
      for (let i = ch; i < n; i += 4) { mn = Math.min(mn, data[i]); mx = Math.max(mx, data[i]) }
      const rng = mx - mn || 1
      for (let i = ch; i < n; i += 4) data[i] = Math.round((data[i] - mn) / rng * 255)
    }
  }
}

export function sharpenImageData(id: ImageData): ImageData {
  const { data, width: w, height: h } = id
  const K = [0, -1, 0, -1, 5, -1, 0, -1, 0]
  const out = new ImageData(w, h)
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    for (let ch = 0; ch < 3; ch++) {
      let v = 0
      for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++)
        v += data[((y + ky) * w + (x + kx)) * 4 + ch] * K[(ky + 1) * 3 + (kx + 1)]
      out.data[(y * w + x) * 4 + ch] = Math.max(0, Math.min(255, v))
    }
    out.data[(y * w + x) * 4 + 3] = data[(y * w + x) * 4 + 3]
  }
  return out
}

export function removeBgData(id: ImageData): ImageData {
  const out = new ImageData(id.width, id.height)
  out.data.set(id.data)
  for (let i = 0; i < out.data.length; i += 4)
    if (out.data[i] > 220 && out.data[i + 1] > 220 && out.data[i + 2] > 220) out.data[i + 3] = 0
  return out
}

// ─── Scanner-grade auto-detect: Canny edges → Hough lines → quad corners ────

function gaussBlur5(src: Float32Array, W: number, H: number): Float32Array {
  const tmp = new Float32Array(W * H)
  const dst = new Float32Array(W * H)
  const K = [1, 4, 6, 4, 1], S = 16
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0
    for (let k = -2; k <= 2; k++) v += src[y * W + Math.max(0, Math.min(W - 1, x + k))] * K[k + 2]
    tmp[y * W + x] = v / S
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0
    for (let k = -2; k <= 2; k++) v += tmp[Math.max(0, Math.min(H - 1, y + k)) * W + x] * K[k + 2]
    dst[y * W + x] = v / S
  }
  return dst
}

function cannyEdges(gray: Float32Array, W: number, H: number, lo: number, hi: number): Uint8Array {
  const mag = new Float32Array(W * H)
  const ang = new Float32Array(W * H)
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const gx = -gray[(y - 1) * W + (x - 1)] - 2 * gray[y * W + (x - 1)] - gray[(y + 1) * W + (x - 1)]
             +  gray[(y - 1) * W + (x + 1)] + 2 * gray[y * W + (x + 1)] + gray[(y + 1) * W + (x + 1)]
    const gy = -gray[(y - 1) * W + (x - 1)] - 2 * gray[(y - 1) * W + x] - gray[(y - 1) * W + (x + 1)]
             +  gray[(y + 1) * W + (x - 1)] + 2 * gray[(y + 1) * W + x] + gray[(y + 1) * W + (x + 1)]
    mag[y * W + x] = Math.sqrt(gx * gx + gy * gy)
    ang[y * W + x] = Math.atan2(gy, gx)
  }
  const nms = new Float32Array(W * H)
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const m = mag[y * W + x], a = ang[y * W + x]
    const d = ((a * 4 / Math.PI) + 8.5) % 4
    let n1: number, n2: number
    if      (d < 1) { n1 = mag[y * W + (x + 1)];     n2 = mag[y * W + (x - 1)] }
    else if (d < 2) { n1 = mag[(y - 1) * W + (x + 1)]; n2 = mag[(y + 1) * W + (x - 1)] }
    else if (d < 3) { n1 = mag[(y - 1) * W + x];     n2 = mag[(y + 1) * W + x] }
    else            { n1 = mag[(y - 1) * W + (x - 1)]; n2 = mag[(y + 1) * W + (x + 1)] }
    if (m >= n1 && m >= n2) nms[y * W + x] = m
  }
  const edges = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) {
    if (nms[i] >= hi) edges[i] = 2
    else if (nms[i] >= lo) edges[i] = 1
  }
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    if (edges[y * W + x] !== 1) continue
    if (edges[(y - 1) * W + (x - 1)] === 2 || edges[(y - 1) * W + x] === 2 || edges[(y - 1) * W + (x + 1)] === 2 ||
        edges[y * W + (x - 1)] === 2       ||                                 edges[y * W + (x + 1)] === 2       ||
        edges[(y + 1) * W + (x - 1)] === 2 || edges[(y + 1) * W + x] === 2 || edges[(y + 1) * W + (x + 1)] === 2)
      edges[y * W + x] = 2
    else edges[y * W + x] = 0
  }
  for (let i = 0; i < W * H; i++) edges[i] = edges[i] === 2 ? 1 : 0
  return edges
}

function houghLines(edges: Uint8Array, W: number, H: number): { r: number; t: number; v: number }[] {
  const N_T = 180
  const DIAG = Math.ceil(Math.sqrt(W * W + H * H))
  const N_R = 2 * DIAG + 1
  const acc = new Int32Array(N_R * N_T)
  const cosT = new Float32Array(N_T)
  const sinT = new Float32Array(N_T)
  for (let t = 0; t < N_T; t++) {
    const a = t * Math.PI / N_T
    cosT[t] = Math.cos(a); sinT[t] = Math.sin(a)
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!edges[y * W + x]) continue
    for (let t = 0; t < N_T; t++) {
      const r = Math.round(x * cosT[t] + y * sinT[t]) + DIAG
      if (r >= 0 && r < N_R) acc[r * N_T + t]++
    }
  }
  let maxV = 0
  for (let i = 0; i < acc.length; i++) maxV = Math.max(maxV, acc[i])
  const THRESH = Math.max(15, maxV * 0.25)
  const candidates: { r: number; t: number; v: number }[] = []
  for (let ri = 0; ri < N_R; ri++) for (let t = 0; t < N_T; t++) {
    const v = acc[ri * N_T + t]
    if (v >= THRESH) candidates.push({ r: ri - DIAG, t, v })
  }
  candidates.sort((a, b) => b.v - a.v)

  const SUPP_R = 20, SUPP_T = 15
  const peaks: typeof candidates = []
  for (const c of candidates) {
    if (!peaks.some(p => Math.abs(p.r - c.r) < SUPP_R && Math.abs(p.t - c.t) < SUPP_T)) {
      peaks.push(c)
    }
    if (peaks.length >= 60) break
  }
  return peaks
}

function lineIntersect(r1: number, t1: number, r2: number, t2: number): [number, number] | null {
  const N_T = 180
  const a1 = t1 * Math.PI / N_T, a2 = t2 * Math.PI / N_T
  const c1 = Math.cos(a1), s1 = Math.sin(a1), c2 = Math.cos(a2), s2 = Math.sin(a2)
  const det = c1 * s2 - c2 * s1
  if (Math.abs(det) < 1e-6) return null
  return [(r1 * s2 - r2 * s1) / det, (r2 * c1 - r1 * c2) / det]
}

function orderCorners(pts: [number, number][]): [number, number][] {
  const sum  = ([x, y]: [number, number]) => x + y
  const diff = ([x, y]: [number, number]) => x - y
  const tl = pts.reduce((a, b) => sum(a) < sum(b) ? a : b)
  const br = pts.reduce((a, b) => sum(a) > sum(b) ? a : b)
  const tr = pts.reduce((a, b) => diff(a) > diff(b) ? a : b)
  const bl = pts.reduce((a, b) => diff(a) < diff(b) ? a : b)
  return [tl, tr, br, bl]
}

// Fallback when Hough can't find 4 clear lines: edge-scan bounding box
function fallbackScan(data: Uint8ClampedArray, W: number, H: number): [number, number][] {
  const L = (x: number, y: number) => {
    const i = (Math.max(0, Math.min(H - 1, y)) * W + Math.max(0, Math.min(W - 1, x))) * 4
    return (data[i] + data[i + 1] + data[i + 2]) / 3
  }
  const grad = new Float32Array(W * H)
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const gx = L(x + 1, y) - L(x - 1, y), gy = L(x, y + 1) - L(x, y - 1)
    grad[y * W + x] = Math.sqrt(gx * gx + gy * gy)
  }
  const T = 20
  const col = (x: number) => { let s = 0; for (let y = 0; y < H; y++) s += grad[y * W + x]; return s / H }
  const row = (y: number) => { let s = 0; for (let x = 0; x < W; x++) s += grad[y * W + x]; return s / W }
  let l = 0, r = W - 1, t = 0, b = H - 1
  for (let x = 2; x < W - 2; x++) { if (col(x) > T) { l = x; break } }
  for (let x = W - 3; x >= 2; x--) { if (col(x) > T) { r = x; break } }
  for (let y = 2; y < H - 2; y++) { if (row(y) > T) { t = y; break } }
  for (let y = H - 3; y >= 2; y--) { if (row(y) > T) { b = y; break } }
  const p = 0.008
  return [
    [Math.max(0, l / W - p), Math.max(0, t / H - p)],
    [Math.min(1, r / W + p), Math.max(0, t / H - p)],
    [Math.min(1, r / W + p), Math.min(1, b / H + p)],
    [Math.max(0, l / W - p), Math.min(1, b / H + p)],
  ]
}

export function autoDetect(canvas: HTMLCanvasElement): [number, number][] {
  const MAX = 480
  const sc = Math.min(1, MAX / Math.max(canvas.width, canvas.height))
  const W = Math.round(canvas.width * sc), H = Math.round(canvas.height * sc)
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H
  const tctx = tmp.getContext('2d')!
  tctx.drawImage(canvas, 0, 0, W, H)
  const { data } = tctx.getImageData(0, 0, W, H)

  const gray = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++)
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]

  const blurred = gaussBlur5(gray, W, H)
  const edges = cannyEdges(blurred, W, H, 20, 50)
  const lines = houghLines(edges, W, H)

  const ANG_TOL = 28
  const isH = ({ t }: { t: number }) => Math.abs(t - 90) <= ANG_TOL
  const isV = ({ t }: { t: number }) => t <= ANG_TOL || t >= 180 - ANG_TOL

  const dedup = (grp: typeof lines, minD: number) => {
    const out: typeof lines = []
    for (const l of grp) {
      if (!out.some(q => Math.abs(q.r - l.r) < minD && Math.abs(q.t - l.t) < ANG_TOL))
        out.push(l)
    }
    return out
  }

  const hLines = dedup(lines.filter(isH), Math.min(W, H) * 0.09)
  const vLines = dedup(lines.filter(isV), Math.min(W, H) * 0.09)

  const bestPair = (grp: typeof lines) => {
    const center = (l: typeof lines[0]) => {
      const a = l.t * Math.PI / 180
      if (isV(l)) {
        const cosA = Math.cos(a)
        return Math.abs(cosA) > 1e-6 ? (l.r - (H / 2) * Math.sin(a)) / cosA : l.r
      } else {
        const sinA = Math.sin(a)
        return Math.abs(sinA) > 1e-6 ? (l.r - (W / 2) * Math.cos(a)) / sinA : l.r
      }
    }
    let best: [typeof lines[0], typeof lines[0]] = [grp[0], grp[1]]
    let maxD = 0
    for (let i = 0; i < Math.min(grp.length, 10); i++)
      for (let j = i + 1; j < Math.min(grp.length, 10); j++) {
        const d = Math.abs(center(grp[i]) - center(grp[j]))
        if (d > maxD) { maxD = d; best = [grp[i], grp[j]] }
      }
    return best
  }

  if (hLines.length < 2 || vLines.length < 2) {
    return fallbackScan(data, W, H)
  }

  const [h1, h2] = bestPair(hLines)
  const [v1, v2] = bestPair(vLines)

  const corners = [
    lineIntersect(h1.r, h1.t, v1.r, v1.t),
    lineIntersect(h1.r, h1.t, v2.r, v2.t),
    lineIntersect(h2.r, h2.t, v2.r, v2.t),
    lineIntersect(h2.r, h2.t, v1.r, v1.t),
  ]
  if (corners.some(c => !c)) return fallbackScan(data, W, H)

  const normed = corners.map(c => [
    Math.max(-0.05, Math.min(1.05, c![0] / W)),
    Math.max(-0.05, Math.min(1.05, c![1] / H)),
  ]) as [number, number][]

  return orderCorners(normed)
}
