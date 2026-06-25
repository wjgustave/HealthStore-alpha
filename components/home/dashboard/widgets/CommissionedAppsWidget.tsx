import { Boxes } from 'lucide-react'
import type { ConceptCommissionedWidget } from '@/lib/conceptHomeTypes'
import { WidgetShell } from '@/components/ui/WidgetShell'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

export function CommissionedAppsWidget({ commissioned }: { commissioned: ConceptCommissionedWidget }) {
  return (
    <WidgetShell footerHref={commissioned.dashboard_href} footerLabel={commissioned.dashboard_label}>
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
          style={{ background: commissioned.status_variant === 'live' ? '#007F3B' : 'var(--nhs-blue)' }}
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
    </WidgetShell>
  )
}
