import type { PDFRef } from 'pdf-lib'

export type PageLabelStyle = 'Decimal' | 'Upper Roman' | 'Lower Roman' | 'Upper Letters' | 'Lower Letters' | 'Prefix only'

export type PageLabelRule = {
  id: number
  startPage: number
  style: PageLabelStyle
  prefix: string
  startNumber: number
}

export type PageLabelInspection = {
  pageCount: number
  rules: PageLabelRule[]
  hasCustomLabels: boolean
  warnings: string[]
}

const MAX_DEPTH = 32
const MAX_RANGES = 500
const PAIRS_PER_LEAF = 64
const KIDS_PER_NODE = 32

const styleFromPdfName: Record<string, PageLabelStyle> = {
  D: 'Decimal',
  R: 'Upper Roman',
  r: 'Lower Roman',
  A: 'Upper Letters',
  a: 'Lower Letters',
}

const pdfNameFromStyle: Partial<Record<PageLabelStyle, string>> = {
  Decimal: 'D',
  'Upper Roman': 'R',
  'Lower Roman': 'r',
  'Upper Letters': 'A',
  'Lower Letters': 'a',
}

function toRoman(value: number): string {
  if (!Number.isInteger(value) || value < 1) return String(value)
  const numerals: Array<[number, string]> = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let remaining = value
  let output = ''
  for (const [amount, symbol] of numerals) {
    while (remaining >= amount) { output += symbol; remaining -= amount }
  }
  return output
}

function toLetters(value: number): string {
  if (!Number.isInteger(value) || value < 1) return String(value)
  let remaining = value
  let output = ''
  while (remaining > 0) {
    remaining -= 1
    output = String.fromCharCode(65 + (remaining % 26)) + output
    remaining = Math.floor(remaining / 26)
  }
  return output
}

export function formatPageLabel(rule: PageLabelRule, pageNumber: number): string {
  if (rule.style === 'Prefix only') return rule.prefix
  const value = rule.startNumber + pageNumber - rule.startPage
  let suffix = String(value)
  if (rule.style === 'Upper Roman') suffix = toRoman(value)
  if (rule.style === 'Lower Roman') suffix = toRoman(value).toLowerCase()
  if (rule.style === 'Upper Letters') suffix = toLetters(value)
  if (rule.style === 'Lower Letters') suffix = toLetters(value).toLowerCase()
  return `${rule.prefix}${suffix}`
}

export function labelForPage(rules: PageLabelRule[], pageNumber: number): string {
  const ordered = [...rules].sort((left, right) => left.startPage - right.startPage)
  const active = ordered.reduce<PageLabelRule | null>((match, rule) => rule.startPage <= pageNumber ? rule : match, null)
  return active ? formatPageLabel(active, pageNumber) : String(pageNumber)
}

export async function parsePageLabels(bytes: Uint8Array): Promise<PageLabelInspection> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const pageCount = document.getPageCount()
  const key = (name: string) => pdfLib.PDFName.of(name)
  const dereference = (value: unknown): unknown => value instanceof pdfLib.PDFRef ? document.context.lookup(value) : value
  const textValue = (value: unknown): string => {
    const object = dereference(value)
    if (object instanceof pdfLib.PDFString || object instanceof pdfLib.PDFHexString) {
      try { return object.decodeText() } catch { return '' }
    }
    return ''
  }

  const pageLabelsValue = document.catalog.get(key('PageLabels'))
  const pageLabels = dereference(pageLabelsValue)
  if (!(pageLabels instanceof pdfLib.PDFDict)) {
    return {
      pageCount,
      hasCustomLabels: false,
      rules: [{ id: 1, startPage: 1, style: 'Decimal', prefix: '', startNumber: 1 }],
      warnings: [],
    }
  }

  const rawRules = new Map<number, Omit<PageLabelRule, 'id' | 'startPage'>>()
  const warnings: string[] = []
  const visited = new Set<object>()
  let depthLimited = false
  let rangeLimited = false

  const readNode = (candidate: unknown, depth: number) => {
    if (depth > MAX_DEPTH) { depthLimited = true; return }
    const node = dereference(candidate)
    if (!(node instanceof pdfLib.PDFDict) || visited.has(node)) return
    visited.add(node)

    const nums = dereference(node.get(key('Nums')))
    if (nums instanceof pdfLib.PDFArray) {
      for (let index = 0; index + 1 < nums.size(); index += 2) {
        if (rawRules.size >= MAX_RANGES) { rangeLimited = true; break }
        const pageIndexObject = dereference(nums.get(index))
        const labelDictionary = dereference(nums.get(index + 1))
        if (!(pageIndexObject instanceof pdfLib.PDFNumber) || !(labelDictionary instanceof pdfLib.PDFDict)) continue
        const pageIndex = pageIndexObject.asNumber()
        if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= pageCount) {
          warnings.push(`Ignored a page-label range with an invalid zero-based page index of ${pageIndex}.`)
          continue
        }
        const styleObject = dereference(labelDictionary.get(key('S')))
        let style: PageLabelStyle = 'Prefix only'
        if (styleObject instanceof pdfLib.PDFName) {
          const styleName = styleObject.decodeText()
          style = styleFromPdfName[styleName] ?? 'Prefix only'
          if (!styleFromPdfName[styleName]) warnings.push(`Page ${pageIndex + 1} used an unsupported label style (${styleName}); it was loaded as prefix-only.`)
        }
        const startObject = dereference(labelDictionary.get(key('St')))
        let startNumber = startObject instanceof pdfLib.PDFNumber ? startObject.asNumber() : 1
        if (!Number.isInteger(startNumber) || startNumber < 1) {
          warnings.push(`Page ${pageIndex + 1} had an invalid starting label number; it was changed to 1.`)
          startNumber = 1
        }
        rawRules.set(pageIndex, { style, prefix: textValue(labelDictionary.get(key('P'))), startNumber })
      }
    }
    const kids = dereference(node.get(key('Kids')))
    if (kids instanceof pdfLib.PDFArray) for (let index = 0; index < kids.size(); index += 1) readNode(kids.get(index), depth + 1)
  }

  readNode(pageLabelsValue, 0)
  if (depthLimited) warnings.push(`Page-label number-tree nesting deeper than ${MAX_DEPTH} levels was ignored.`)
  if (rangeLimited) warnings.push(`Only the first ${MAX_RANGES} page-label ranges were loaded for safe browser processing.`)

  const ordered = Array.from(rawRules.entries()).sort(([left], [right]) => left - right)
  const rules: PageLabelRule[] = ordered.map(([pageIndex, rule], index) => ({ id: index + 1, startPage: pageIndex + 1, ...rule }))
  if (!rules.length || rules[0].startPage !== 1) rules.unshift({ id: 0, startPage: 1, style: 'Decimal', prefix: '', startNumber: 1 })
  return { pageCount, rules, hasCustomLabels: true, warnings }
}

export async function writePageLabels(bytes: Uint8Array, rules: PageLabelRule[]): Promise<Uint8Array> {
  const pdfLib = await import('pdf-lib')
  const document = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false })
  const { context, catalog } = document
  const key = (name: string) => pdfLib.PDFName.of(name)
  const oldRoot = catalog.get(key('PageLabels'))
  const refsToDelete: PDFRef[] = []
  const visitedRefs = new Set<string>()
  const visitedObjects = new Set<object>()

  const collectOldTree = (candidate: unknown, depth: number) => {
    if (depth > MAX_DEPTH + 4) return
    if (candidate instanceof pdfLib.PDFRef) {
      if (visitedRefs.has(candidate.toString())) return
      visitedRefs.add(candidate.toString())
      refsToDelete.push(candidate)
    }
    const object = candidate instanceof pdfLib.PDFRef ? context.lookup(candidate) : candidate
    if (!(object instanceof pdfLib.PDFDict) || visitedObjects.has(object)) return
    visitedObjects.add(object)
    const kids = object.get(key('Kids'))
    const kidsArray = kids instanceof pdfLib.PDFRef ? context.lookup(kids) : kids
    if (kids instanceof pdfLib.PDFRef) refsToDelete.push(kids)
    if (kidsArray instanceof pdfLib.PDFArray) for (let index = 0; index < kidsArray.size(); index += 1) collectOldTree(kidsArray.get(index), depth + 1)
    const nums = object.get(key('Nums'))
    const numsArray = nums instanceof pdfLib.PDFRef ? context.lookup(nums) : nums
    if (nums instanceof pdfLib.PDFRef) refsToDelete.push(nums)
    if (numsArray instanceof pdfLib.PDFArray) {
      for (let index = 1; index < numsArray.size(); index += 2) {
        const value = numsArray.get(index)
        if (value instanceof pdfLib.PDFRef && !visitedRefs.has(value.toString())) { visitedRefs.add(value.toString()); refsToDelete.push(value) }
      }
    }
  }

  collectOldTree(oldRoot, 0)
  catalog.delete(key('PageLabels'))
  refsToDelete.forEach(ref => context.delete(ref))
  if (!rules.length) return document.save({ useObjectStreams: true })

  const ordered = [...rules].sort((left, right) => left.startPage - right.startPage)
  if (ordered.length > MAX_RANGES) throw new Error(`A maximum of ${MAX_RANGES} page-label ranges is supported.`)
  if (ordered[0]?.startPage !== 1) throw new Error('The first page-label range must begin on page 1.')

  const pairs = ordered.map(rule => {
    const dictionary = context.obj({})
    const styleName = pdfNameFromStyle[rule.style]
    if (styleName) dictionary.set(key('S'), key(styleName))
    if (rule.prefix) dictionary.set(key('P'), pdfLib.PDFHexString.fromText(rule.prefix))
    if (rule.style !== 'Prefix only' && rule.startNumber !== 1) dictionary.set(key('St'), pdfLib.PDFNumber.of(rule.startNumber))
    return { pageIndex: rule.startPage - 1, dictionary }
  })

  type NumberTreeNode = { ref: PDFRef; first: number; last: number }
  let nodes: NumberTreeNode[] = []
  for (let start = 0; start < pairs.length; start += PAIRS_PER_LEAF) {
    const chunk = pairs.slice(start, start + PAIRS_PER_LEAF)
    const nums = pdfLib.PDFArray.withContext(context)
    chunk.forEach(pair => { nums.push(pdfLib.PDFNumber.of(pair.pageIndex)); nums.push(pair.dictionary) })
    const first = chunk[0].pageIndex
    const last = chunk[chunk.length - 1].pageIndex
    const leaf = context.obj({ Nums: nums, Limits: context.obj([first, last]) })
    nodes.push({ ref: context.register(leaf), first, last })
  }

  while (nodes.length > 1) {
    const parents: NumberTreeNode[] = []
    for (let start = 0; start < nodes.length; start += KIDS_PER_NODE) {
      const chunk = nodes.slice(start, start + KIDS_PER_NODE)
      const first = chunk[0].first
      const last = chunk[chunk.length - 1].last
      const parent = context.obj({ Kids: context.obj(chunk.map(node => node.ref)), Limits: context.obj([first, last]) })
      parents.push({ ref: context.register(parent), first, last })
    }
    nodes = parents
  }

  catalog.set(key('PageLabels'), nodes[0].ref)
  return document.save({ useObjectStreams: true })
}
