'use client'

import Link from 'next/link'
import { Bookmark, Send, Boxes } from 'lucide-react'
import { useBookmarks } from '@/components/BookmarkProvider'
import { useEoi } from '@/components/EoiProvider'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

function StatTile({
  href,
  label,
  value,
  icon: Icon,
}: {
  href: string
  label: string
  value: number | string
  icon: typeof Bookmark
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-md transition-shadow hover:shadow-lg"
      style={{ borderColor: 'var(--border)' }}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'rgba(0, 94, 184, 0.1)', color: '#005EB8' }}
        aria-hidden
      >
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <span className="block text-3xl font-bold leading-none" style={{ ...fr, color: 'var(--text-primary)' }}>
          {value}
        </span>
        <span className="mt-1 block text-sm" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </span>
    </Link>
  )
}

export function DashboardStatTiles({ commissionedStatus }: { commissionedStatus: string }) {
  const { count: savedCount } = useBookmarks()
  const { count: eoiCount } = useEoi()

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatTile href="/saved-apps" label="Saved apps" value={savedCount} icon={Bookmark} />
      <StatTile href="/express-interest" label="Expressions of interest" value={eoiCount} icon={Send} />
      <StatTile href="/apps" label={`Commissioned · ${commissionedStatus}`} value="1" icon={Boxes} />
    </div>
  )
}
