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
      className="flex items-center gap-4 rounded-xl border p-5 transition-colors hover:bg-slate-50"
      style={{ borderColor: 'var(--border)', background: 'rgba(0, 94, 184, 0.1)' }}
    >
      <span
        className="flex h-8 w-8 max-h-8 max-w-8 shrink-0 items-center justify-center rounded-md"
        style={{ background: '#fff', color: '#005EB8' }}
        aria-hidden
      >
        <Icon className="h-5 w-5 max-h-5 max-w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-3xl font-bold leading-none" style={{ ...fr, color: 'var(--text-primary)' }}>
          {value}
        </span>
        <span className="mt-1 block text-sm" style={{ color: '#425563' }}>
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
    <div className="grid gap-4 sm:grid-cols-3 md:max-w-[50%]">
      <StatTile href="/saved-apps" label="Saved apps" value={savedCount} icon={Bookmark} />
      <StatTile href="/eoi-record" label="EOI record" value={eoiCount} icon={Send} />
      <StatTile href="/apps" label={`Commissioned · ${commissionedStatus}`} value="1" icon={Boxes} />
    </div>
  )
}
