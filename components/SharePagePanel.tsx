'use client'

import { Share2 } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePdpSharePrint } from '@/components/PdpSharePrintContext'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

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
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [shareFlow, setShareFlow] = useState<ShareFlow>('method')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set())
  const [linkBusy, setLinkBusy] = useState(false)
  const [linkError, setLinkError] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!modalOpen || (shareFlow !== 'pdf' && shareFlow !== 'link')) return
    setSelectedKeys(new Set(registeredBlocks.map(b => b.key)))
    setLinkError('')
  }, [modalOpen, shareFlow, registeredBlocks])

  const openModal = useCallback(() => {
    setShareFlow('method')
    setLinkError('')
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setShareFlow('method')
    setLinkError('')
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
      toast.success('Page address copied to clipboard.')
    } else {
      toast.error('Couldn’t copy — copy the address from your browser bar.')
    }
  }, [toast])

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
        toast.success('Shareable link copied to clipboard.')
      } else {
        toast.info('Link created, but it couldn’t be copied automatically. Try again.')
      }
    } catch {
      setLinkError('Network error. Check your connection and try again.')
    } finally {
      setLinkBusy(false)
    }
  }, [selectedKeys, slug, toast])

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
          className="hs-text-label hs-font-bold underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#003087] hover:decoration-[var(--nhs-blue)]"
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
          className="hs-text-label hs-font-bold underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#003087] hover:decoration-[var(--nhs-blue)]"
          style={{ color: STORE_ACCENT }}
          onClick={clearAll}
        >
          Clear
        </button>
      </div>
      <ul className="space-y-2" role="list">
        {registeredBlocks.map(({ key, label, description }) => (
          <li key={key}>
            <label className="flex cursor-pointer items-start gap-4 rounded-lg px-2 py-2 hover:bg-slate-50">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300"
                checked={selectedKeys.has(key)}
                onChange={() => toggleKey(key)}
              />
              <span className="min-w-0 flex-1">
                <span className="block hs-text-label hs-font-normal" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </span>
                {description ? (
                  <span
                    className="mt-1 block hs-text-caption leading-snug"
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
        <p className="hs-text-label" style={{ color: 'var(--text-muted)' }}>
          No sections available yet. Try again in a moment.
        </p>
      ) : null}
    </>
  )

  return (
    <div className={`shrink-0 ${className}`.trim()}>
      <Button
        ref={triggerRef}
        variant="secondary"
        borderless={borderlessTrigger}
        size="none"
        className="px-4 py-4 min-h-[44px] min-w-[44px]"
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
        onClick={openModal}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <Share2 className="h-4 w-4 shrink-0" aria-hidden />
          Share
        </span>
      </Button>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        labelledBy={titleId}
        describedBy={descId}
        restoreFocus="trigger"
        triggerRef={triggerRef}
        zIndexClass="z-[250]"
        scrimClassName="bg-slate-900/45"
        panelClassName="flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col rounded-xl border border-[var(--border)] bg-white shadow-xl"
      >
        <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
          <h2 id={titleId} className="hs-text-card-title-sm hs-font-bold" style={{ color: 'var(--text-primary)' }}>
            {titleText}
          </h2>
          <p id={descId} className="mt-1 hs-text-label" style={{ color: 'var(--text-secondary)' }}>
            {descText}
          </p>
        </div>

        {shareFlow === 'method' ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <button
              type="button"
              className="flex w-full flex-col items-start rounded-xl border px-4 py-4 text-left transition-colors hover:bg-slate-100 min-h-[44px]"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => setShareFlow('link')}
            >
              <span className="hs-text-label hs-font-bold" style={{ color: 'var(--text-primary)' }}>
                Share as link
              </span>
              <span className="mt-1 hs-text-label" style={{ color: 'var(--text-muted)' }}>
                Select what sections to share. Recipients will be able to view the selected sections of this page.
              </span>
            </button>
            <button
              type="button"
              className="flex w-full flex-col items-start rounded-xl border px-4 py-4 text-left transition-colors hover:bg-slate-100 min-h-[44px]"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => setShareFlow('pdf')}
            >
              <span className="hs-text-label hs-font-bold" style={{ color: 'var(--text-primary)' }}>
                Print or save as a PDF
              </span>
              <span className="mt-1 hs-text-label" style={{ color: 'var(--text-muted)' }}>
                Select what sections to share, then print or save as a PDF file.
              </span>
            </button>
          </div>
        ) : null}

        {shareFlow === 'pdf' ? <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{sectionChecklist}</div> : null}

        {shareFlow === 'link' ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {linkError ? (
              <p className="hs-text-label leading-snug rounded-md px-4 py-2" role="alert" style={{ background: '#FDECEA', color: '#5A1010' }}>
                {linkError}
              </p>
            ) : null}
            {sectionChecklist}
            <button
              type="button"
              className="text-left hs-text-label hs-font-bold underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[var(--text-primary)] hover:decoration-[var(--text-muted)]"
              style={{ color: 'var(--text-muted)' }}
              onClick={copyFullPageLink}
            >
              Copy full product page address instead
            </button>
          </div>
        ) : null}

        <div className="border-t px-6 py-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              {shareFlow !== 'method' ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setLinkError('')
                    setShareFlow('method')
                  }}
                >
                  Back
                </Button>
              ) : null}
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {shareFlow === 'link' ? (
                <Button
                  loading={linkBusy}
                  disabled={selectedKeys.size === 0 || linkBusy || !slug}
                  onClick={createAndCopyShareLink}
                >
                  {linkBusy ? 'Creating link…' : 'Create link and copy'}
                </Button>
              ) : null}
              {shareFlow === 'pdf' ? (
                <Button disabled={selectedKeys.size === 0} onClick={printWithSelection}>
                  Print or save as a PDF
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
