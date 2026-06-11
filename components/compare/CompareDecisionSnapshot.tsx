import type { ReactNode } from 'react'
import type { App } from '@/lib/data'
import {
  getCommissioningSnapshot,
  type CommissioningSnapshotCard,
  type InteropSnapshotItem,
  type RegulationSnapshotPill,
} from '@/lib/commissioningSnapshot'
import { getWhereLiveSummary } from '@/lib/whereLiveSummary'

const INTEROP_LOGO_KEYS = ['nhs_app', 'nhs_notify', 'nhs_login'] as const
const INTEROP_BOTTOM_KEYS = ['fhir', 'emis'] as const
const NHS_SERVICE_PILL_LABELS: Record<(typeof INTEROP_LOGO_KEYS)[number], string> = {
  nhs_app: 'App',
  nhs_notify: 'Notify',
  nhs_login: 'Login',
}

function interopItemsInOrder(items: InteropSnapshotItem[], keys: readonly string[]): InteropSnapshotItem[] {
  return keys.flatMap(k => {
    const item = items.find(i => i.key === k)
    return item && item.integrated === true ? [item] : []
  })
}

function SnapshotPill({ muted, children }: { muted?: boolean; children: ReactNode }) {
  return (
    <span className={`badge badge-grey max-w-full text-xs ${muted ? 'opacity-50' : ''}`}>{children}</span>
  )
}

function NhsServicePill({ children }: { children: ReactNode }) {
  return (
    <span className="badge max-w-full border-0 text-xs" style={{ background: 'var(--nhs-blue)', color: '#fff' }}>
      {children}
    </span>
  )
}

function MiniSegment({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="hs-compare-snapshot__segment">
      <div className="hs-compare-snapshot__label">{label}</div>
      <div className="hs-compare-snapshot__value">{children}</div>
    </div>
  )
}

function GovernanceMini({ pills }: { pills: RegulationSnapshotPill[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
      {pills.map(p => (
        <li key={p.label}>
          <span className={`badge badge-blue text-xs max-w-full ${p.muted ? 'opacity-50' : ''}`}>{p.label}</span>
        </li>
      ))}
    </ul>
  )
}

function PricingMini({ card }: { card: Extract<CommissioningSnapshotCard, { kind: 'cost' }> }) {
  if (card.modelPills.length === 0) {
    return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Check with supplier</span>
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {card.modelPills.map(text => (
        <SnapshotPill key={text}>{text}</SnapshotPill>
      ))}
      {card.indicativeNote ? (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.indicativeNote}</span>
      ) : null}
    </div>
  )
}

function IntegrationsMini({ card }: { card: Extract<CommissioningSnapshotCard, { kind: 'interop' }> }) {
  const logoRow = interopItemsInOrder(card.items, INTEROP_LOGO_KEYS)
  const bottomRow = interopItemsInOrder(card.items, INTEROP_BOTTOM_KEYS)
  if (logoRow.length === 0 && bottomRow.length === 0) {
    return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>None listed</span>
  }
  return (
    <div className="flex flex-col gap-1">
      {logoRow.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-semibold" style={{ color: 'var(--nhs-dark)' }}>NHS:</span>
          {logoRow.map(item => (
            <NhsServicePill key={item.key}>
              {NHS_SERVICE_PILL_LABELS[item.key as (typeof INTEROP_LOGO_KEYS)[number]] ?? item.name}
            </NhsServicePill>
          ))}
        </div>
      ) : null}
      {bottomRow.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {bottomRow.map(item => (
            <SnapshotPill key={item.key}>{item.textLabel ?? item.name}</SnapshotPill>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function WhereLiveMini({ app }: { app: App }) {
  const { headline, detail } = getWhereLiveSummary(app)
  return (
    <div>
      <p className="m-0 text-xs font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{headline}</p>
      {detail ? (
        <p className="mt-0.5 mb-0 text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>{detail}</p>
      ) : null}
    </div>
  )
}

function CompareSnapshotCell({ app }: { app: App }) {
  const cards = getCommissioningSnapshot(app)
  const governance = cards.find(c => c.kind === 'regulation') as Extract<CommissioningSnapshotCard, { kind: 'regulation' }> | undefined
  const pricing = cards.find(c => c.kind === 'cost') as Extract<CommissioningSnapshotCard, { kind: 'cost' }> | undefined
  const interop = cards.find(c => c.kind === 'interop') as Extract<CommissioningSnapshotCard, { kind: 'interop' }> | undefined

  return (
    <div className="hs-compare-snapshot__cell">
      <MiniSegment label="Where it's live">
        <WhereLiveMini app={app} />
      </MiniSegment>
      {governance ? (
        <MiniSegment label="Governance">
          <GovernanceMini pills={governance.pills} />
        </MiniSegment>
      ) : null}
      {pricing ? (
        <MiniSegment label="Pricing model">
          <PricingMini card={pricing} />
        </MiniSegment>
      ) : null}
      {interop ? (
        <MiniSegment label="Integrations">
          <IntegrationsMini card={interop} />
        </MiniSegment>
      ) : null}
    </div>
  )
}

type Props = {
  apps: App[]
  layout: 'band' | 'card'
}

/**
 * Per-product decision snapshot for the comparison tool.
 * Mirrors PDP callouts: Where it's live, Governance, Pricing model, Integrations.
 */
export function CompareDecisionSnapshot({ apps, layout }: Props) {
  if (apps.length === 0) return null

  if (layout === 'band') {
    return (
      <section className="hs-compare-snapshot hs-compare-snapshot--band" aria-label="Decision snapshot">
        <h2 className="sr-only">Decision snapshot comparison</h2>
        <div
          className="hs-compare-snapshot__band-grid"
          style={{ gridTemplateColumns: `repeat(${apps.length}, minmax(180px, 1fr))` }}
        >
          {apps.map(app => (
            <CompareSnapshotCell key={app.id} app={app} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="hs-compare-snapshot hs-compare-snapshot--cards" aria-label="Decision snapshot">
      <h2 className="sr-only">Decision snapshot comparison</h2>
      <div
        className="hs-compare-snapshot__cards-grid"
        style={{ gridTemplateColumns: `repeat(${Math.min(apps.length, 4)}, minmax(200px, 1fr))` }}
      >
        {apps.map(app => (
          <article key={app.id} className="hs-compare-snapshot__card">
            <h3 className="hs-compare-snapshot__card-title">{app.app_name}</h3>
            <CompareSnapshotCell app={app} />
          </article>
        ))}
      </div>
    </section>
  )
}
