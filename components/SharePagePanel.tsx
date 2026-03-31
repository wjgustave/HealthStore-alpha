'use client'

import '@awesome.me/webawesome/dist/components/icon/icon.js'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'next/navigation'
import { usePdpSharePrint } from '@/components/PdpSharePrintContext'
import { STORE_ACCENT } from '@/lib/storeAccent'

type ShareFlow = 'method' | 'pdf' | 'link'

function legacyCopyToClipboard(text: string): boolean {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('aria-hidden', 'true')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(ta)
  }
}

/**
 * PDP share: two-step modal — choose link vs PDF, then either section checklist + shareable link or PDF print.
 */
export function SharePagePanel({
  className = '',
  /** PDP hero: no outline on the trigger (Share still reads as a control via colour + hover). */
  borderlessTrigger = false,
}: {
  className?: string
  borderlessTrigger?: boolean
}) {
  const params = useParams()
  const slug =
    typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] ?? '' : ''

  const { registeredBlocks, beginModalPrint } = usePdpSharePrint()
  const [modalOpen, setModalOpen] = useState(false)
  const [shareFlow, setShareFlow] = useState<ShareFlow>('method')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set())
  const [announce, setAnnounce] = useState('')
  const [linkBusy, setLinkBusy] = useState(false)
  const [linkError, setLinkError] = useState('')
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!modalOpen || (shareFlow !== 'pdf' && shareFlow !== 'link')) return
    setSelectedKeys(new Set(registeredBlocks.map(b => b.key)))
    setLinkError('')
  }, [modalOpen, shareFlow, registeredBlocks])

  const openModal = useCallback(() => {
    setShareFlow('method')
    setAnnounce('')
    setLinkError('')
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setShareFlow('method')
    setAnnounce('')
    setLinkError('')
    triggerRef.current?.focus()
  }, [])

  const toggleKey = useCallback((key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedKeys(new Set(registeredBlocks.map(b => b.key)))
  }, [registeredBlocks])

  const clearAll = useCallback(() => {
    setSelectedKeys(new Set())
  }, [])

  const printWithSelection = useCallback(() => {
    if (selectedKeys.size === 0) return
    beginModalPrint(new Set(selectedKeys))
    setModalOpen(false)
    setShareFlow('method')
  }, [beginModalPrint, selectedKeys])

  const copyFullPageLink = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (!url) return
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        ok = true
      }
    } catch {
      ok = false
    }
    if (!ok) {
      ok = legacyCopyToClipboard(url)
    }
    if (ok) {
      setAnnounce('Full page address copied to clipboard.')
      setTimeout(() => setAnnounce(''), 4000)
    } else {
      setAnnounce('Could not copy link. Copy the address from your browser bar.')
      setTimeout(() => setAnnounce(''), 6000)
    }
  }, [])

  const createAndCopyShareLink = useCallback(async () => {
    if (selectedKeys.size === 0 || !slug) return
    setLinkBusy(true)
    setLinkError('')
    try {
      const res = await fetch(`/api/apps/${encodeURIComponent(slug)}/share`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: [...selectedKeys] }),
      })
      let data: { shareUrl?: string; error?: string } = {}
      try {
        data = (await res.json()) as { shareUrl?: string; error?: string }
      } catch {
        /* ignore */
      }
      if (!res.ok) {
        setLinkError(typeof data.error === 'string' ? data.error : `Could not create link (${res.status}).`)
        return
      }
      const url = data.shareUrl
      if (!url || typeof url !== 'string') {
        setLinkError('Server did not return a link.')
        return
      }
      const fullUrl = url.startsWith('http')
        ? url
        : `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`

      let ok = false
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(fullUrl)
          ok = true
        }
      } catch {
        ok = false
      }
      if (!ok) {
        ok = legacyCopyToClipboard(fullUrl)
      }
      if (ok) {
        setAnnounce('Shareable link copied to clipboard.')
        setTimeout(() => setAnnounce(''), 5000)
      } else {
        setAnnounce('Link was created but could not be copied. Copy it from the network response or try again.')
        setTimeout(() => setAnnounce(''), 6000)
      }
    } catch {
      setLinkError('Network error. Check your connection and try again.')
    } finally {
      setLinkBusy(false)
    }
  }, [selectedKeys, slug])

  useEffect(() => {
    if (!modalOpen) return
    const dialog = dialogRef.current

    function focusables(): HTMLElement[] {
      if (!dialog) return []
      return [...dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )].filter(el => {
        if (el.getAttribute('aria-hidden') === 'true') return false
        if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
          return !el.disabled
        }
        return true
      })
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeModal()
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const nodes = focusables()
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    requestAnimationFrame(() => {
      focusables()[0]?.focus()
    })

    return () => document.removeEventListener('keydown', onKey)
  }, [modalOpen, shareFlow, closeModal])

  const titleText =
    shareFlow === 'method'
      ? 'Share this page'
      : shareFlow === 'pdf'
        ? 'Print or save as a PDF'
        : 'Share as link'

  const descText =
    shareFlow === 'method'
      ? 'Choose how you want to share.'
      : shareFlow === 'pdf'
        ? 'Select what sections to share, then print or save as a PDF file.'
        : 'Select sections to include. A link will be created that only shows the selected sections.'

  const sectionChecklist = (
    <>
      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="text-sm font-semibold underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#003087] hover:decoration-[#005EB8]"
          style={{ color: STORE_ACCENT }}
          onClick={selectAll}
        >
          Select all
        </button>
        <span className="text-slate-300" aria-hidden>
          |
        </span>
        <button
          type="button"
          className="text-sm font-semibold underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#003087] hover:decoration-[#005EB8]"
          style={{ color: STORE_ACCENT }}
          onClick={clearAll}
        >
          Clear
        </button>
      </div>
      <ul className="space-y-2" role="list">
        {registeredBlocks.map(({ key, label, description }) => (
          <li key={key}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300"
                checked={selectedKeys.has(key)}
                onChange={() => toggleKey(key)}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </span>
                {description ? (
                  <span
                    className="mt-0.5 block text-xs leading-snug"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {description}
                  </span>
                ) : null}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {registeredBlocks.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No sections available yet. Try again in a moment.
        </p>
      ) : null}
    </>
  )

  const modal =
    modalOpen && mounted ? (
      <div
        className="fixed inset-0 z-[250] flex items-center justify-center p-4"
        role="presentation"
        style={{ background: 'rgba(15, 23, 42, 0.45)' }}
        onMouseDown={e => {
          if (e.target === e.currentTarget) closeModal()
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col rounded-xl border bg-white shadow-xl"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
            <h2 id={titleId} className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {titleText}
            </h2>
            <p id={descId} className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {descText}
            </p>
          </div>

          {shareFlow === 'method' ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-3">
              <button
                type="button"
                className="flex w-full flex-col items-start rounded-xl border px-4 py-4 text-left transition-colors hover:bg-slate-100 min-h-[44px]"
                style={{ borderColor: 'var(--border)' }}
                onClick={() => setShareFlow('link')}
              >
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Share as link
                </span>
                <span className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  Select what sections to share. Recipients will be able to view the selected sections of this page.
                </span>
              </button>
              <button
                type="button"
                className="flex w-full flex-col items-start rounded-xl border px-4 py-4 text-left transition-colors hover:bg-slate-100 min-h-[44px]"
                style={{ borderColor: 'var(--border)' }}
                onClick={() => setShareFlow('pdf')}
              >
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Print or save as a PDF
                </span>
                <span className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  Select what sections to share, then print or save as a PDF file.
                </span>
              </button>
            </div>
          ) : null}

          {shareFlow === 'pdf' ? <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">{sectionChecklist}</div> : null}

          {shareFlow === 'link' ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {announce ? (
                <p
                  className="text-sm leading-snug rounded-md px-3 py-2"
                  style={{ background: '#F7F9FC', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  role="status"
                  aria-live="polite"
                >
                  {announce}
                </p>
              ) : null}
              {linkError ? (
                <p className="text-sm leading-snug rounded-md px-3 py-2" role="alert" style={{ background: '#FDECEA', color: '#5A1010' }}>
                  {linkError}
                </p>
              ) : null}
              {sectionChecklist}
              <button
                type="button"
                className="text-left text-sm font-semibold underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[var(--text-primary)] hover:decoration-[var(--text-muted)]"
                style={{ color: 'var(--text-muted)' }}
                onClick={copyFullPageLink}
              >
                Copy full product page address instead
              </button>
            </div>
          ) : null}

          <div className="border-t px-5 py-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                {shareFlow !== 'method' ? (
                  <button
                    type="button"
                    className="rounded-lg border px-4 py-3 text-sm font-semibold min-h-[44px] transition-colors hover:bg-[#E6F0FB]"
                    style={{ borderColor: STORE_ACCENT, color: STORE_ACCENT, background: '#fff' }}
                    onClick={() => {
                      setAnnounce('')
                      setLinkError('')
                      setShareFlow('method')
                    }}
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="button"
                  className="rounded-lg border px-4 py-3 text-sm font-semibold min-h-[44px] transition-colors hover:bg-[#E6F0FB]"
                  style={{ borderColor: STORE_ACCENT, color: STORE_ACCENT, background: '#fff' }}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {shareFlow === 'link' ? (
                  <button
                    type="button"
                    className="rounded-lg px-4 py-3 text-sm font-semibold text-white min-h-[44px] transition-colors disabled:opacity-50 enabled:hover:!bg-[#004B8C]"
                    style={{ background: STORE_ACCENT }}
                    disabled={selectedKeys.size === 0 || linkBusy || !slug}
                    onClick={createAndCopyShareLink}
                  >
                    {linkBusy ? 'Creating link…' : 'Create link and copy'}
                  </button>
                ) : null}
                {shareFlow === 'pdf' ? (
                  <button
                    type="button"
                    className="rounded-lg px-4 py-3 text-sm font-semibold text-white min-h-[44px] transition-colors disabled:opacity-50 enabled:hover:!bg-[#004B8C]"
                    style={{ background: STORE_ACCENT }}
                    disabled={selectedKeys.size === 0}
                    onClick={printWithSelection}
                  >
                    Print or save as a PDF
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null

  return (
    <div className={`shrink-0 ${className}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        className={`px-4 py-4 rounded-lg text-sm font-semibold min-h-[44px] min-w-[44px] bg-white text-[var(--nhs-blue)] transition-colors hover:bg-[#E6F0FB] hover:text-[var(--nhs-dark)] ${
          borderlessTrigger ? 'border-0' : 'border border-[var(--nhs-blue)]'
        }`}
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
        onClick={openModal}
      >
        <span className="inline-flex items-center justify-center gap-1.5">
          <wa-icon
            name="share"
            family="classic"
            variant="solid"
            className="shrink-0 text-base leading-none inline-block align-middle text-current"
            aria-hidden
          />
          Share
        </span>
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </div>
  )
}
