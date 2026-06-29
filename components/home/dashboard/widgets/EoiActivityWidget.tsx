'use client'

import { Send } from 'lucide-react'
import { useEoi } from '@/components/EoiProvider'
import { formatHomeDate } from '@/components/home/formatDate'
import { WidgetShell, WidgetHeading, WidgetMessage, WidgetError } from '@/components/ui/WidgetShell'

export function EoiActivityWidget({ limit = 5 }: { limit?: number }) {
  const { expressionsOfInterest, count, status, refresh } = useEoi()
  const recent = expressionsOfInterest.slice(0, limit)

  return (
    <WidgetShell footerHref="/eoi-record" footerLabel="View EOI record">
      <WidgetHeading
        icon={<Send className="h-4 w-4" style={{ color: 'var(--nhs-blue)' }} aria-hidden />}
        title="Expression of interest activity"
        count={status === 'ready' ? count : undefined}
      />

      {status === 'loading' ? (
        <WidgetMessage>Loading…</WidgetMessage>
      ) : status === 'error' ? (
        <WidgetError message="Couldn’t load expressions of interest." onRetry={() => void refresh()} />
      ) : count === 0 ? (
        <WidgetMessage>No expressions of interest yet.</WidgetMessage>
      ) : (
        <ul className="m-0 min-h-0 flex-1 list-none space-y-4 p-0">
          {recent.map(eoi => (
            <li key={eoi.id} className="border-t border-[var(--border)] pt-4 first:border-t-0 first:pt-0">
              <div className="hs-text-label hs-font-bold" style={{ color: 'var(--text-primary)' }}>
                {eoi.appName}
              </div>
              <div className="hs-text-caption" style={{ color: 'var(--text-muted)' }}>
                {eoi.submittedByName || 'Unknown user'} · {formatHomeDate(eoi.createdAt)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  )
}
