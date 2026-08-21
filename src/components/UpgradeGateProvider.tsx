'use client'
import { useEffect, useState } from 'react'
import UpgradeModal from './UpgradeModal'
import SignInModal from './SignInModal'
import PaymentRequiredModal from './PaymentRequiredModal'
import WorkflowRecoveryNotice from './WorkflowRecoveryNotice'
import {
  WORKFLOW_RECOVERY_DISMISS_EVENT,
  WORKFLOW_RECOVERY_EVENT,
  type RecoverableWorkflowState,
  type WorkflowRecoveryDetail,
} from '@/lib/workflowRecovery'

function requestUrl(input: RequestInfo | URL) {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

function isWorkflowApi(url: string) {
  return url.includes('/api/') && !url.includes('/api/subscription/') && !url.includes('/api/webhooks/')
}

function friendlyFailureResponse(status: number, state: RecoverableWorkflowState) {
  const error = state === 'ai-service-failure'
    ? 'The AI service could not complete this request. Your file and settings are still available.'
    : 'The connection was interrupted. Your file and settings are still available.'
  return Response.json({ error }, { status })
}

export default function UpgradeGateProvider() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const original = window.fetch
    const pendingCancellations = new Set<() => void>()

    window.fetch = async (...args) => {
      const [input, init] = args
      const url = requestUrl(input)
      const workflowApi = isWorkflowApi(url)
      const retryRequest = input instanceof Request ? input.clone() : null
      const requestSignal = input instanceof Request ? input.signal : init?.signal
      const repeatRequest = () => retryRequest
        ? original(retryRequest.clone())
        : original(input, init)

      const waitForRecovery = (
        state: RecoverableWorkflowState,
        failedResponse?: Response,
        failedError?: unknown,
      ) => new Promise<Response>((resolve, reject) => {
        const id = `recovery-${Date.now()}-${Math.random().toString(36).slice(2)}`
        let settled = false
        let latestResponse = failedResponse
        let latestState = state

        const dismiss = () => window.dispatchEvent(new CustomEvent(WORKFLOW_RECOVERY_DISMISS_EVENT, { detail: id }))
        const cleanup = () => {
          pendingCancellations.delete(cancel)
          requestSignal?.removeEventListener('abort', abort)
        }
        const finish = (callback: () => void) => {
          if (settled) return
          settled = true
          cleanup()
          dismiss()
          callback()
        }
        const abort = () => finish(() => reject(new DOMException(
          'Request cancelled. Your file and settings are still available.',
          'AbortError',
        )))
        const cancel = () => finish(() => {
          if (latestResponse) {
            resolve(friendlyFailureResponse(latestResponse.status, latestState))
          } else {
            reject(new DOMException(
              'Request cancelled. Your file and settings are still available.',
              'AbortError',
            ))
          }
        })
        const announce = () => {
          const detail: WorkflowRecoveryDetail = { id, state: latestState, retry, cancel }
          window.dispatchEvent(new CustomEvent(WORKFLOW_RECOVERY_EVENT, { detail }))
        }
        const retry = async () => {
          if (settled) return false
          try {
            const response = await repeatRequest()
            if (response.status >= 500) {
              latestResponse = response
              latestState = 'ai-service-failure'
              announce()
              return false
            }
            finish(() => resolve(response))
            return true
          } catch (error) {
            if ((error as Error)?.name === 'AbortError') {
              finish(() => reject(error))
              return false
            }
            latestResponse = undefined
            latestState = 'network-failure'
            announce()
            return false
          }
        }

        pendingCancellations.add(cancel)
        requestSignal?.addEventListener('abort', abort, { once: true })
        if (requestSignal?.aborted) abort()
        else announce()
        void failedError
      })

      let res: Response
      try {
        res = await original(input, init)
      } catch (error) {
        if (!workflowApi || (error as Error)?.name === 'AbortError') throw error
        res = await waitForRecovery('network-failure', undefined, error)
      }

      if (workflowApi && res.status >= 500) {
        res = await waitForRecovery('ai-service-failure', res)
      }

      if (workflowApi) {
        if (res.status === 401) {
          window.dispatchEvent(new CustomEvent('signin-needed'))
        } else if (res.status === 403) {
          window.dispatchEvent(new CustomEvent('payment-needed'))
        } else if (res.status === 429) {
          window.dispatchEvent(new CustomEvent('upgrade-needed'))
        }
      }
      return res
    }
    setReady(true)
    return () => {
      setReady(false)
      pendingCancellations.forEach(cancel => cancel())
      pendingCancellations.clear()
      window.fetch = original
    }
  }, [])

  return (
    <>
      {ready && <span hidden data-workflow-gates-ready />}
      <SignInModal />
      <UpgradeModal />
      <PaymentRequiredModal />
      <WorkflowRecoveryNotice />
    </>
  )
}
