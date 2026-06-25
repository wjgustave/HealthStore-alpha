'use client'

import Link from 'next/link'
import { Bookmark, Send, Boxes } from 'lucide-react'
import { useBookmarks, type LoadStatus } from '@/components/BookmarkProvider'
import { useEoi } from '@/components/EoiProvider'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

function StatValue({ value, state }: { value: number | string; state: LoadStatus }) {
  if (state === 'loading') {
    return (
      <span
        className="block h-7 w-12 animate-pulse rounded-md"
        style={{ background: 'rgba(0, 94, 184, 0.18)' }}
        aria-hidden
      />
    )
  }
  if (state === 'error') {
    return (
      <span className="block text-3xl font-bold leading-none" style={{ ...fr, color: 'var(--text-muted)' }}>
        <span aria-hidden>—</span>
        <span className="sr-only">Couldn’t load count</span>
      </span>
    )
  }
  return (
    <span className="block text-3xl font-bold leading-none" style={{ ...fr, color: 'var(--text-primary)' }}>
      {value}
    </span>
  )
}

function StatTile({
  href,
  label,
  value,
  icon: Icon,
  state = 'ready',
}: {
  href: string
  label: string
  value: number | string
  icon: typeof Bookmark
  state?: LoadStatus
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border p-5 transition-colors hover:bg-slate-50"
      style={{ borderColor: 'var(--border)', background: 'rgba(0, 94, 184, 0.1)' }}
    >
      <span
        className="flex h-8 w-8 max-h-8 max-w-8 shrink-0 items-center justify-center rounded-md"
        style={{ background: '#fff', color: 'var(--nhs-blue)' }}
        aria-hidden
      >
        <Icon className="h-5 w-5 max-h-5 max-w-5" />
      </span>
      <span className="min-w-0">
        <StatValue value={value} state={state} />
        <span className="mt-1 block text-sm" style={{ color: '#425563' }}>
          {label}
        </span>
      </span>
    </Link>
  )
}

export function DashboardStatTiles({ commissionedStatus }: { commissionedStatus: string }) {
  const { count: savedCount, status: savedStatus } = useBookmarks()
  const { count: eoiCount, status: eoiStatus } = useEoi()

  return (
    <div className="grid gap-4 sm:grid-cols-3 md:max-w-[50%]">
      <StatTile href="/saved-apps" label="Saved apps" value={savedCount} icon={Bookmark} state={savedStatus} />
      <StatTile href="/eoi-record" label="EOI record" value={eoiCount} icon={Send} state={eoiStatus} />
      <StatTile href="/apps" label={`Commissioned · ${commissionedStatus}`} value="1" icon={Boxes} />
    </div>
  )
}
