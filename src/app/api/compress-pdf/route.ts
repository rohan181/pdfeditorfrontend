import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink, stat } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

const execFileAsync = promisify(execFile)

const GS_PATHS = [
  '/opt/homebrew/bin/gs',
  '/usr/local/bin/gs',
  '/usr/bin/gs',
  'gs',
]

// Ghostscript PDFSETTINGS per compression level
const GS_SETTINGS: Record<string, string> = {
  low:     '/prepress',   // ~300dpi, near-original quality
  medium:  '/printer',    // ~300dpi, good print quality
  high:    '/ebook',      // ~150dpi, good screen quality
  maximum: '/screen',     // ~72dpi, smallest file
}

async function findGs(): Promise<string | null> {
  for (const p of GS_PATHS) {
    try { await execFileAsync(p, ['--version']); return p } catch { /* skip */ }
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const formData   = await req.formData()
    const file       = formData.get('file')       as File   | null
    const level      = (formData.get('level')      as string | null) ?? 'medium'
    const filename   = (formData.get('filename')   as string | null) ?? 'document.pdf'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const gs = await findGs()
    if (!gs) return NextResponse.json({ error: 'Ghostscript not installed. Run: brew install ghostscript' }, { status: 500 })

    const setting = GS_SETTINGS[level] ?? '/ebook'
    const id      = randomUUID()
    const inPath  = join(tmpdir(), `pdf-compress-in-${id}.pdf`)
    const outPath = join(tmpdir(), `pdf-compress-out-${id}.pdf`)

    try {
      const raw = Buffer.from(await file.arrayBuffer())
      await writeFile(inPath, raw)

      await execFileAsync(gs, [
        '-sDEVICE=pdfwrite',
        '-dNOPAUSE',
        '-dBATCH',
        '-dQUIET',
        `-dPDFSETTINGS=${setting}`,
        '-dCompatibilityLevel=1.5',
        `-sOutputFile=${outPath}`,
        inPath,
      ]).catch((err: any) => {
        // gs exits 0 on success; any non-zero is a real error
        throw err
      })

      const [inStat, outStat] = await Promise.all([stat(inPath), stat(outPath)])
      const compressed = await readFile(outPath)

      // If gs somehow made the file larger, return the original
      const finalBuf = outStat.size < inStat.size ? compressed : raw
      const finalSize = Math.min(outStat.size, inStat.size)

      const body = finalBuf.buffer.slice(finalBuf.byteOffset, finalBuf.byteOffset + finalBuf.byteLength)

      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.pdf$/i, '')
      const dlName   = `${safeName}_compressed.pdf`

      return new NextResponse(body as ArrayBuffer, {
        headers: {
          'Content-Type'        : 'application/pdf',
          'Content-Disposition' : `attachment; filename="${dlName}"`,
          'X-Original-Size'     : String(inStat.size),
          'X-Compressed-Size'   : String(finalSize),
        },
      })
    } finally {
      await unlink(inPath).catch(() => {})
      await unlink(outPath).catch(() => {})
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
