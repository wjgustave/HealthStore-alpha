'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { SectionHeader } from '@/components/Badges'
import { useEscape } from '@/components/ui/useEscape'
import { useFocusTrap } from '@/components/ui/useFocusTrap'
import { useLockBodyScroll } from '@/components/ui/useLockBodyScroll'
import { youtubeEmbedUrl, youtubeThumbnailUrl, youtubeVideoIdFromUrl } from '@/lib/youtube'

export type ProductVideoItem = {
  youtube_url: string
  title?: string
}

type Props = {
  videos: ProductVideoItem[]
  /** When true, omit outer card — for use inside another section (e.g. Expected impact and case studies). */
  embedded?: boolean
}

export default function ProductVideosSection({ videos, embedded = false }: Props) {
  const headingId = useId()
  const dialogTitleId = useId()
  const [activeId, setActiveId] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const resolved = videos
    .map((v) => {
      const id = youtubeVideoIdFromUrl(v.youtube_url)
      return id ? { ...v, id } : null
    })
    .filter(Boolean) as (ProductVideoItem & { id: string })[]

  const close = useCallback(() => setActiveId(null), [])
  const activeVideo = activeId ? resolved.find((v) => v.id === activeId) ?? null : null
  const activeTitle = activeVideo?.title?.trim() || 'Product video'

  // Focus the close button on open; restore focus to the trigger on close.
  useEffect(() => {
    if (!activeId) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus())
    return () => {
      cancelAnimationFrame(raf)
      previouslyFocused?.focus?.()
    }
  }, [activeId])

  useLockBodyScroll(!!activeId)
  useEscape(!!activeId, close)
  useFocusTrap(dialogRef, !!activeId)

  if (resolved.length === 0) return null

  const videoList = (
    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
      {resolved.map((v) => (
        <li key={v.id}>
          <button
            type="button"
            onClick={() => setActiveId(v.id)}
            className="group relative block w-full overflow-hidden rounded-xl border text-left transition-colors hover:border-[var(--nhs-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'var(--border)', outlineColor: 'var(--nhs-blue)' }}
          >
            <span className="relative block aspect-video w-full bg-black">
              <Image
                src={youtubeThumbnailUrl(v.id, 'hq')}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 400px"
                unoptimized
              />
              <span
                className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35"
                aria-hidden
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-200/90"
                  style={{ color: 'var(--nhs-blue)' }}
                  aria-hidden
                >
                  <Play className="ml-1 h-8 w-8 shrink-0" style={{ color: 'var(--nhs-blue)' }} strokeWidth={2.4} aria-hidden />
                </span>
              </span>
            </span>
            <span className="block px-4 py-2 hs-text-label hs-font-bold" style={{ color: 'var(--text-primary)' }}>
              {v.title?.trim() || 'Play video'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {embedded ? (
        <div
          className="mt-8 border-t pt-8"
          style={{ borderColor: 'var(--border)' }}
          aria-labelledby={headingId}
        >
          <div className="mb-6">
            <h3
              id={headingId}
              className="mb-1 hs-text-card-title-sm hs-font-bold"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
            >
              Product videos
            </h3>
            <p className="m-0 hs-text-label" style={{ color: 'var(--text-muted)' }}>
              Short previews from the supplier’s YouTube channel. Opens in this page when you play.
            </p>
          </div>
          {videoList}
        </div>
      ) : (
        <section className="hs-surface-card rounded-xl border bg-white p-6" style={{ borderColor: 'var(--border)' }} aria-labelledby={headingId}>
          <SectionHeader
            id={headingId}
            title="Product videos"
            description="Short previews from the supplier’s YouTube channel. Opens in this page when you play."
          />
          {videoList}
        </section>
      )}

      {activeVideo && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
              role="presentation"
              onClick={(e) => {
                if (e.target === e.currentTarget) close()
              }}
            >
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={dialogTitleId}
                className="relative w-full max-w-4xl outline-none"
              >
                <div className="mb-2 flex items-end justify-between gap-4">
                  <h2 id={dialogTitleId} className="m-0 min-w-0 truncate hs-text-label hs-font-bold text-white">
                    {activeTitle}
                  </h2>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={close}
                    className="shrink-0 rounded-md px-2 py-1 hs-text-label hs-font-bold text-white transition-colors hover:bg-white/15 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Close
                  </button>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
                  <iframe
                    title={activeTitle}
                    src={youtubeEmbedUrl(activeVideo.id, true)}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
