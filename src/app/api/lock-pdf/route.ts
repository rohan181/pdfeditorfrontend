import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { PDFDocument } from 'pdf-lib'

const execFileAsync = promisify(execFile)

const QPDF_PATHS = [
  '/opt/homebrew/bin/qpdf',
  '/usr/local/bin/qpdf',
  '/usr/bin/qpdf',
  'qpdf',
]

async function findQpdf(): Promise<string | null> {
  for (const p of QPDF_PATHS) {
    try { await execFileAsync(p, ['--version']); return p } catch { /* not found */ }
  }
  return null
}

// Run qpdf and treat exit-code 3 ("succeeded with warnings") as success
async function runQpdf(qpdf: string, args: string[]) {
  return execFileAsync(qpdf, args).catch((err: any) => {
    if (err?.code === 3) return   // warnings only – output is valid
    throw err
  })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file')     as File   | null
    const password = formData.get('password') as string | null
    const filename = (formData.get('filename') as string | null) ?? 'document.pdf'

    if (!file || !password) {
      return NextResponse.json({ error: 'Missing file or password' }, { status: 400 })
    }

    const qpdf = await findQpdf()
    if (!qpdf) {
      return NextResponse.json({ error: 'qpdf is not installed. Run: brew install qpdf' }, { status: 500 })
    }

    const id          = randomUUID()
    const inputPath   = join(tmpdir(), `pdf-in-${id}.pdf`)
    const outputPath  = join(tmpdir(), `pdf-out-${id}.pdf`)
    const verifyPath  = join(tmpdir(), `pdf-verify-${id}.pdf`)

    try {
      // 1. Normalise with pdf-lib to fix any structural issues
      const rawBytes = Buffer.from(await file.arrayBuffer())
      let cleanBytes: Buffer
      try {
        const doc = await PDFDocument.load(rawBytes, { ignoreEncryption: true })
        cleanBytes = Buffer.from(await doc.save({ useObjectStreams: false }))
      } catch {
        cleanBytes = rawBytes
      }
      await writeFile(inputPath, cleanBytes)

      // 2. Encrypt with AES-128 (V=4/R=4 – universally supported since PDF 1.5)
      await runQpdf(qpdf, [
        '--encrypt', password, password, '128', '--use-aes=y', '--',
        inputPath, outputPath,
      ])

      // 3. Server-side verification: decrypt with the same password right now
      //    If this fails, the encryption is broken and we return an error.
      await runQpdf(qpdf, [
        `--password=${password}`,
        '--decrypt',
        outputPath,
        verifyPath,
      ])

      // 4. Read and return the encrypted file
      const locked = await readFile(outputPath)
      const body   = locked.buffer.slice(locked.byteOffset, locked.byteOffset + locked.byteLength)

      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.pdf$/i, '')
      const dlName   = `${safeName}_locked_${Date.now()}.pdf`

      return new NextResponse(body as ArrayBuffer, {
        headers: {
          'Content-Type'       : 'application/pdf',
          'Content-Disposition': `attachment; filename="${dlName}"`,
        },
      })
    } finally {
      await unlink(inputPath).catch(() => {})
      await unlink(outputPath).catch(() => {})
      await unlink(verifyPath).catch(() => {})
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
