import Link from 'next/link'
import { Boxes, ChevronRight } from 'lucide-react'
import type { ConceptCommissionedWidget } from '@/lib/conceptHomeTypes'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

export function CommissionedAppsWidget({ commissioned }: { commissioned: ConceptCommissionedWidget }) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border bg-white p-5 shadow-md" style={{ borderColor: 'var(--border)' }}>
      <h3 className="mb-1 flex items-center gap-2 text-lg font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
        <Boxes className="h-4 w-4" style={{ color: 'var(--nhs-blue)' }} aria-hidden />
        {commissioned.title}
      </h3>
      <p className="mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        {commissioned.illustrative_note}
      </p>
      <div className="mb-4 flex items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {commissioned.app_display_name}
        </span>
        <span
          className="rounded-md px-2.5 py-0.5 text-xs font-bold text-white"
          style={{ background: commissioned.status_variant === 'live' ? '#007F3B' : '#005EB8' }}
        >
          {commissioned.status_label}
        </span>
      </div>
      <ul className="m-0 min-h-0 flex-1 list-none space-y-4 p-0">
        {commissioned.metrics.map(m => (
          <li key={m.label}>
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {m.label}
            </div>
            <div className="text-2xl font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
              {m.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {m.sublabel}
            </div>
          </li>
        ))}
      </ul>
      <Link
        href={commissioned.dashboard_href}
        className="mt-5 flex shrink-0 items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
        style={{ borderColor: 'var(--border)', color: '#005EB8' }}
      >
        {commissioned.dashboard_label}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}
