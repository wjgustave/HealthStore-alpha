import { MapPin } from 'lucide-react'
import { getWhereLiveSummary, type WhereLiveApp } from '@/lib/whereLiveSummary'

export type { WhereLiveApp }

/**
 * Persistent "Where it's live" strip for the PDP decision snapshot.
 * Summarises the deployment register (live site + ICB counts, pilots/historic flagged)
 * and links into the Deployment & adoption tab via the `#scale-and-maturity` anchor.
 * Full detail lives in the DeploymentRegisterTable. See docs/PDP_WHERE_ITS_LIVE_REDESIGN.md.
 */
export function PdpWhereLive({
  app,
  embedded = false,
}: {
  app: WhereLiveApp
  /** Renders full-width inside the decision snapshot white panel. */
  embedded?: boolean
}) {
  const { sitesText, statusText } = getWhereLiveSummary(app)

  return (
    <a
      href="#scale-and-maturity"
      className={
        embedded
          ? 'group flex w-full items-center gap-4 rounded-lg border px-4 py-4 transition-colors hover:opacity-95'
          : 'hs-surface-card-sm group flex items-center gap-4 rounded-lg border bg-white px-4 py-4 transition-colors hover:border-[var(--nhs-blue)]'
      }
      style={{
        borderColor: 'var(--border)',
        borderLeftWidth: 4,
        borderLeftColor: '#007F3B',
        ...(embedded ? { background: 'rgb(247, 249, 252)' } : {}),
      }}
    >
      <MapPin className="h-5 w-5 flex-shrink-0" style={{ color: '#007F3B' }} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          {sitesText ? (
            <span className="hs-text-card-title-sm hs-font-bold" style={{ color: 'var(--text-primary)' }}>{sitesText}</span>
          ) : null}
          {statusText ? (
            <span className="hs-text-caption" style={{ color: 'var(--text-secondary)' }}>{statusText}</span>
          ) : null}
        </div>
      </div>
      <span className="hidden shrink-0 hs-text-caption hs-font-normal group-hover:underline sm:inline" style={{ color: 'var(--nhs-blue)' }}>
        Where it&apos;s live →
      </span>
    </a>
  )
}

/** Fourth callout card in the commissioning snapshot grid. */
export function PdpWhereLiveSegment({ app, href = '#scale-and-maturity' }: { app: WhereLiveApp; href?: string }) {
  const { sitesText, siteCount } = getWhereLiveSummary(app)

  if (siteCount == null && !sitesText) return null

  return (
    <a href={href} className="hs-snapshot-strip__segment hs-snapshot-strip__segment--link">
      <h2 className="hs-snapshot-strip__heading hs-snapshot-strip__heading--linked">
        Live NHSE sites
      </h2>
      <div className="hs-snapshot-strip__body">
        <span className="hs-text-card-title-sm hs-font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
          {siteCount ?? sitesText}
        </span>
      </div>
    </a>
  )
}
