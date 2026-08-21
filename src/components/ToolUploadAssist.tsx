'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileUp, ShieldCheck } from 'lucide-react'
import ToolWorkflowStatus from '@/components/ToolWorkflowStatus'
import type { ToolWorkflowState } from '@/lib/toolWorkflowState'

interface ToolUploadAssistProps {
  formats: string
  fileLimit: string
  processing: string
}

type SelectionState =
  | { kind: 'empty' }
  | { kind: 'drag-over' }
  | { kind: 'file-selected'; fileName: string }
  | { kind: 'unsupported-file'; message: string }
  | { kind: 'oversized-file'; message: string }

function fileMatchesAccept(file: Pick<File, 'name' | 'type'>, accept: string) {
  if (!accept.trim()) return true

  return accept.split(',').some(rawRule => {
    const rule = rawRule.trim().toLowerCase()
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()

    if (!rule) return false
    if (rule.startsWith('.')) return fileName.endsWith(rule)
    if (rule.endsWith('/*')) return fileType.startsWith(rule.slice(0, -1))
    return fileType === rule
  })
}

function readableFileList(files: ArrayLike<Pick<File, 'name'>>) {
  const names = Array.from(files, file => file.name)
  if (names.length <= 2) return names.join(', ')
  return `${names[0]}, ${names[1]}, and ${names.length - 2} more`
}

function parseMegabyteLimit(fileLimit: string) {
  if (/no fixed|device memory|browser memory|content|characters/i.test(fileLimit)) return null
  const match = fileLimit.match(/(?:up to\s+|interface:\s*)?(\d+(?:\.\d+)?)\s*MB/i)
  return match ? Number(match[1]) : null
}

export function validateToolFiles(
  files: ArrayLike<Pick<File, 'name' | 'type' | 'size'>>,
  accept: string,
  formats: string,
  fileLimit: string,
): SelectionState {
  const unsupported = Array.from(files).find(file => !fileMatchesAccept(file, accept))
  if (unsupported) {
    return {
      kind: 'unsupported-file',
      message: `${unsupported.name} does not match ${formats}. Choose a supported file and try again.`,
    }
  }

  const megabyteLimit = parseMegabyteLimit(fileLimit)
  const oversized = megabyteLimit
    ? Array.from(files).find(file => file.size > megabyteLimit * 1024 * 1024)
    : null
  if (oversized) {
    return {
      kind: 'oversized-file',
      message: `${oversized.name} is larger than the ${megabyteLimit} MB limit. Choose a smaller file and try again.`,
    }
  }

  return { kind: 'file-selected', fileName: readableFileList(files) }
}

function findUploadHost(input: HTMLInputElement) {
  const directHost = input.closest<HTMLElement>('label, [role="button"], [class*="drop"], [class*="upload"]')
  if (directHost && !directHost.closest('.tool-quick-facts')) return directHost

  const scope = input.closest('main, [id="main-content"]') ?? document
  const candidates = Array.from(scope.querySelectorAll<HTMLElement>(
    'label[class*="drop"], [role="button"][class*="drop"], [class*="upload-box"], [class*="upload-area"], [class*="upload-zone"]',
  ))

  return candidates.find(candidate => !candidate.closest('.tool-quick-facts')) ?? null
}

export default function ToolUploadAssist({ formats, fileLimit, processing }: ToolUploadAssistProps) {
  const [input, setInput] = useState<HTMLInputElement | null>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [uploadTarget, setUploadTarget] = useState<HTMLElement | null>(null)
  const [selection, setSelection] = useState<SelectionState>({ kind: 'empty' })

  const inputLabel = useMemo(() => `Choose supported file. ${formats}. ${fileLimit}.`, [fileLimit, formats])

  useEffect(() => {
    let activeInput: HTMLInputElement | null = null
    let activeHost: HTMLElement | null = null
    let portalHost: HTMLDivElement | null = null
    let addedRole = false
    let addedTabIndex = false
    let addedLabel = false

    const onDragEnter = () => setSelection(current => current.kind === 'file-selected' ? current : { kind: 'drag-over' })
    const onDragLeave = (event: DragEvent) => {
      if (activeHost?.contains(event.relatedTarget as Node | null)) return
      setSelection(current => current.kind === 'drag-over' ? { kind: 'empty' } : current)
    }
    const onDrop = (event: DragEvent) => {
      const files = event.dataTransfer?.files
      if (files?.length && activeInput) setSelection(validateToolFiles(files, activeInput.accept, formats, fileLimit))
      else setSelection({ kind: 'empty' })
    }

    const onHostKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      activeInput?.click()
    }

    const connect = () => {
      const candidate = document.querySelector<HTMLInputElement>(
        'main input[type="file"], [id="main-content"] input[type="file"], input[type="file"]',
      )
      if (!candidate || candidate === activeInput) return Boolean(candidate)

      if (activeHost) {
        activeHost.removeEventListener('keydown', onHostKeyDown)
        activeHost.removeEventListener('dragenter', onDragEnter)
        activeHost.removeEventListener('dragleave', onDragLeave)
        activeHost.removeEventListener('drop', onDrop)
      }
      activeInput = candidate
      activeHost = findUploadHost(candidate)

      if (activeHost) {
        portalHost?.remove()
        portalHost = document.createElement('div')
        portalHost.className = 'tool-upload-assist-portal'
        activeHost.insertAdjacentElement('afterend', portalHost)
      }

      if (!candidate.getAttribute('aria-label')) {
        candidate.setAttribute('aria-label', inputLabel)
        addedLabel = true
      }

      const hasInteractiveChild = activeHost?.querySelector('button, a, label') !== null
      if (activeHost && !hasInteractiveChild && !['LABEL', 'BUTTON', 'A'].includes(activeHost.tagName)) {
        if (!activeHost.hasAttribute('role')) {
          activeHost.setAttribute('role', 'button')
          addedRole = true
        }
        if (!activeHost.hasAttribute('tabindex')) {
          activeHost.tabIndex = 0
          addedTabIndex = true
        }
        if (!activeHost.getAttribute('aria-label')) activeHost.setAttribute('aria-label', inputLabel)
        activeHost.addEventListener('keydown', onHostKeyDown)
      }
      activeHost?.addEventListener('dragenter', onDragEnter)
      activeHost?.addEventListener('dragleave', onDragLeave)
      activeHost?.addEventListener('drop', onDrop)

      setInput(candidate)
      setUploadTarget(activeHost)
      setHost(portalHost)
      return true
    }

    connect()
    const observer = new MutationObserver(() => connect())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      if (activeHost) {
        activeHost.removeEventListener('keydown', onHostKeyDown)
        activeHost.removeEventListener('dragenter', onDragEnter)
        activeHost.removeEventListener('dragleave', onDragLeave)
        activeHost.removeEventListener('drop', onDrop)
        if (addedRole) activeHost.removeAttribute('role')
        if (addedTabIndex) activeHost.removeAttribute('tabindex')
      }
      if (activeInput && addedLabel) activeInput.removeAttribute('aria-label')
      portalHost?.remove()
    }
  }, [fileLimit, formats, inputLabel])

  useEffect(() => {
    if (!input) return

    const onFileChange = () => {
      const files = input.files
      if (!files?.length) {
        setSelection({ kind: 'empty' })
        return
      }
      setSelection(validateToolFiles(files, input.accept, formats, fileLimit))
    }

    input.addEventListener('change', onFileChange)
    return () => input.removeEventListener('change', onFileChange)
  }, [fileLimit, formats, input])

  if (!host || !input) return null

  const hostIsLabel = uploadTarget?.tagName === 'LABEL'
  const hostHasFileAction = /choose|upload|select|add|scan|open/i.test(uploadTarget?.textContent ?? '')
  const actionableError = selection.kind === 'unsupported-file' || selection.kind === 'oversized-file'
  const selectedFileName = selection.kind === 'file-selected' ? selection.fileName : ''
  const state = selection.kind as ToolWorkflowState

  return createPortal(
    <aside
      className="tool-upload-assist"
      data-tool-upload-assist
      aria-label="File requirements and privacy"
    >
      <ToolWorkflowStatus
        compact
        state={state}
        message={
          actionableError
            ? selection.message
            : selection.kind === 'file-selected'
              ? `${selection.fileName} passed the available browser checks. Review the options, then start processing.`
              : undefined
        }
        detail={selection.kind === 'empty' ? `Supported: ${formats}. Limit: ${fileLimit}.` : undefined}
        preserveMessage={selection.kind === 'file-selected'
          ? 'Changing or removing this file clears the current task. Download any result you need first.'
          : undefined}
        progress={selection.kind === 'file-selected'
          ? { value: 100, label: 'File selection complete' }
          : undefined}
        primaryLabel={actionableError ? 'Choose another file' : 'Choose file'}
        onPrimary={actionableError || (!hostIsLabel && !hostHasFileAction) ? () => input.click() : undefined}
      />
      <div className="tool-upload-assist-row">
        <FileUp size={16} aria-hidden="true" />
        <span><strong>Supported:</strong> {formats}</span>
        <span aria-hidden="true">·</span>
        <span><strong>Limit:</strong> {fileLimit}</span>
      </div>
      <div className="tool-upload-assist-row tool-upload-assist-privacy">
        <ShieldCheck size={16} aria-hidden="true" />
        <span><strong>Privacy:</strong> {processing}</span>
      </div>
      {selectedFileName && <span className="sr-only">Selected file: {selectedFileName}</span>}
    </aside>,
    host,
  )
}
