'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { SectionHeader } from '@/components/Badges'
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
  const [activeId, setActiveId] = useState<string | null>(null)

  const resolved = videos
    .map((v) => {
      const id = youtubeVideoIdFromUrl(v.youtube_url)
      return id ? { ...v, id } : null
    })
    .filter(Boolean) as (ProductVideoItem & { id: string })[]

  const close = useCallback(() => setActiveId(null), [])

  useEffect(() => {
    if (!activeId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeId, close])

  if (resolved.length === 0) return null

  const videoList = (
    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
      {resolved.map((v) => (
        <li key={v.id}>
          <button
            type="button"
            onClick={() => setActiveId(v.id)}
            className="group relative block w-full overflow-hidden rounded-xl border text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'var(--border)', outlineColor: '#005EB8' }}
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
                  style={{ color: '#005EB8' }}
                  aria-hidden
                >
                  <Play className="ml-0.5 h-8 w-8 shrink-0" style={{ color: '#005EB8' }} strokeWidth={2.4} aria-hidden />
                </span>
              </span>
            </span>
            <span className="block px-3 py-2.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
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
          <div className="mb-5">
            <h3
              id={headingId}
              className="mb-1 font-bold"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '1.125rem', color: 'var(--text-primary)' }}
            >
              Product videos
            </h3>
            <p className="m-0 text-sm" style={{ color: 'var(--text-muted)' }}>
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

      {activeId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={close}
              className="absolute -top-10 right-0 rounded-md px-2 py-1 text-sm font-semibold text-white transition-colors hover:bg-white/15 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Close
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
              <iframe
                title="YouTube video"
                src={youtubeEmbedUrl(activeId, true)}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
