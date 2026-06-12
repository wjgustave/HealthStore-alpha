'use client'

import Link from 'next/link'
import { ChevronRight, Send } from 'lucide-react'
import { useEoi } from '@/components/EoiProvider'
import { formatHomeDate } from '@/components/home/formatDate'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

export function EoiActivityWidget({ limit = 5 }: { limit?: number }) {
  const { expressionsOfInterest, count, isLoading } = useEoi()
  const recent = expressionsOfInterest.slice(0, limit)

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border bg-white p-5 shadow-md" style={{ borderColor: 'var(--border)' }}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
          <Send className="h-4 w-4" style={{ color: 'var(--nhs-blue)' }} aria-hidden />
          Expression of interest activity
        </h3>
        <span
          className="min-w-[1.5rem] rounded-md px-2 py-0.5 text-center text-xs font-bold text-white"
          style={{ background: 'var(--nhs-blue)' }}
        >
          {count}
        </span>
      </div>

      {isLoading ? (
        <p className="flex-1 text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
      ) : count === 0 ? (
        <p className="flex-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          No expressions of interest yet.
        </p>
      ) : (
        <ul className="m-0 min-h-0 flex-1 list-none space-y-3 p-0">
          {recent.map(eoi => (
            <li key={eoi.id} className="border-t border-[var(--border)] pt-3 first:border-t-0 first:pt-0">
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {eoi.appName}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {eoi.submittedByName || 'Unknown user'} · {formatHomeDate(eoi.createdAt)}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/eoi-record"
        className="mt-5 flex shrink-0 items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
        style={{ borderColor: 'var(--border)', color: '#005EB8' }}
      >
        View EOI record
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}
