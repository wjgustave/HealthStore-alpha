'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useBookmarks } from '@/components/BookmarkProvider'
import { useEoi } from '@/components/EoiProvider'

type Dataset = 'bookmarks' | 'eoi' | 'all'

const DATASET_LABELS: Record<Dataset, string> = {
  bookmarks: 'Saved apps',
  eoi: 'EOI record',
  all: 'All data',
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type Stage = 'idle' | 'confirming' | 'loading' | 'success' | 'error'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ClearDataModal({ open, onClose }: Props) {
  const { refresh: refreshBookmarks } = useBookmarks()
  const { refresh: refreshEoi } = useEoi()

  const [mounted, setMounted] = useState(false)
  const [stage, setStage] = useState<Stage>('idle')
  const [chosen, setChosen] = useState<Dataset | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) {
      setStage('idle')
      setChosen(null)
      setErrorMsg(null)
      return
    }
    previouslyFocused.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => { closeBtnRef.current?.focus() })
    return () => {
      document.body.style.overflow = ''
      previouslyFocused.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key !== 'Tab') return
      const nodes = [...panel!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
        el => !el.hasAttribute('disabled'),
      )
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else if (document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, stage])

  function pickDataset(d: Dataset) {
    setChosen(d)
    setStage('confirming')
  }

  async function handleConfirm() {
    if (!chosen) return
    setStage('loading')
    setErrorMsg(null)
    try {
      const requests: Promise<Response>[] = []
      if (chosen === 'bookmarks' || chosen === 'all') {
        requests.push(fetch('/api/bookmarks', { method: 'DELETE' }))
      }
      if (chosen === 'eoi' || chosen === 'all') {
        requests.push(fetch('/api/express-interest', { method: 'DELETE' }))
      }
      const responses = await Promise.all(requests)
      const failed = responses.find(r => !r.ok)
      if (failed) {
        const data = (await failed.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'The server returned an error. Please try again.')
      }
      if (chosen === 'bookmarks' || chosen === 'all') await refreshBookmarks()
      if (chosen === 'eoi' || chosen === 'all') await refreshEoi()
      setStage('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStage('error')
    }
  }

  if (!open || !mounted) return null

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,48,135,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={stage === 'loading' ? undefined : onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-lg outline-none"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          disabled={stage === 'loading'}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-40"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>

        {stage === 'idle' && (
          <>
            <h2
              id={titleId}
              className="font-bold mb-2 pr-8"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--nhs-dark)' }}
            >
              Manage organisation data
            </h2>
            <p className="mb-6" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
              Select which data to clear for your organisation. This will permanently delete the records for all users in your organisation.
            </p>
            <div className="flex flex-col gap-3">
              {(['bookmarks', 'eoi', 'all'] as Dataset[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => pickDataset(d)}
                  className="flex items-center gap-3 w-full rounded-xl border px-4 py-3.5 text-sm font-semibold text-left transition-colors hover:bg-[#F7F9FC]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <Trash2 className="w-4 h-4 shrink-0" style={{ color: d === 'all' ? 'var(--nhs-red, #d5281b)' : 'var(--nhs-blue)' }} aria-hidden />
                  Clear {DATASET_LABELS[d]}
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'confirming' && chosen && (
          <>
            <h2
              id={titleId}
              className="font-bold mb-2 pr-8"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--nhs-dark)' }}
            >
              Clear {DATASET_LABELS[chosen]}?
            </h2>
            <p className="mb-6" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
              This will permanently delete{' '}
              <strong>
                {chosen === 'all' ? 'all saved apps and expressions of interest' : DATASET_LABELS[chosen].toLowerCase()}
              </strong>{' '}
              for your entire organisation. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: 'var(--nhs-red, #d5281b)' }}
              >
                Yes, clear data
              </button>
              <button
                type="button"
                onClick={() => setStage('idle')}
                className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors hover:bg-[#F7F9FC]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {stage === 'loading' && (
          <div className="text-center py-8">
            <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin" style={{ color: 'var(--nhs-blue)' }} aria-hidden />
            <p id={titleId} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Clearing data…
            </p>
          </div>
        )}

        {stage === 'success' && chosen && (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ background: '#E6F5EC' }}
              aria-hidden
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--nhs-green, #007f3b)' }} />
            </div>
            <h2
              id={titleId}
              className="font-bold mb-2"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--nhs-dark)' }}
            >
              Data cleared
            </h2>
            <p className="mb-6" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
              {DATASET_LABELS[chosen]} has been permanently deleted for your organisation.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'var(--nhs-blue)' }}
            >
              Done
            </button>
          </div>
        )}

        {stage === 'error' && (
          <>
            <div className="flex items-start gap-3 mb-5">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: 'var(--nhs-red, #d5281b)' }} aria-hidden />
              <div>
                <h2
                  id={titleId}
                  className="font-bold mb-1"
                  style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--nhs-dark)' }}
                >
                  Could not clear data
                </h2>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
                  {errorMsg}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--nhs-blue)' }}
              >
                Try again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors hover:bg-[#F7F9FC]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
