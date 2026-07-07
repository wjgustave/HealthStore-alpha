import type { ReactNode } from 'react'
import type {
  CommissioningSnapshotCard,
  FundingSnapshotCard,
  InteropSnapshotItem,
  RegulationSnapshotPill,
} from '@/lib/commissioningSnapshot'
import { PdpWhereLiveSegment } from '@/components/PdpWhereLive'
import type { WhereLiveApp } from '@/lib/whereLiveSummary'

const INTEGRATION_READY_KEYS = ['fhir', 'emis'] as const

function interopItemsInOrder(items: InteropSnapshotItem[], keys: readonly string[]): InteropSnapshotItem[] {
  return keys.flatMap(k => {
    const item = items.find(i => i.key === k)
    return item && item.integrated === true ? [item] : []
  })
}

function SnapshotText({ muted, children }: { muted?: boolean; children: ReactNode }) {
  return (
    <span
      className={`hs-text-label leading-snug ${muted ? 'opacity-50' : ''}`}
      style={{ color: 'var(--text-secondary)' }}
    >
      {children}
    </span>
  )
}

function SnapshotTextList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <p className="m-0 hs-text-label leading-snug" style={{ color: 'var(--text-secondary)' }}>
      {items.join(' · ')}
    </p>
  )
}

function SegmentLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={`inline-block hs-text-label hs-font-normal underline-offset-2 hover:underline ${className}`.trim()}
      style={{ color: 'var(--nhs-blue)' }}
    >
      {children}
    </a>
  )
}

function SegmentShell({
  label,
  labelHref,
  footer,
  children,
}: {
  label: string
  labelHref?: string
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <article className="hs-snapshot-strip__segment">
      <h2 className="hs-snapshot-strip__heading">
        {labelHref ? (
          <a href={labelHref} className="hs-snapshot-strip__heading-link">
            {label}
          </a>
        ) : (
          label
        )}
      </h2>
      <div className="hs-snapshot-strip__body">{children}</div>
      {footer ? <div className="hs-snapshot-strip__footer">{footer}</div> : null}
    </article>
  )
}

function GovernanceSegment({
  label,
  href,
  pills,
}: {
  label: string
  href: string
  pills: RegulationSnapshotPill[]
}) {
  return (
    <SegmentShell label={label} labelHref={href}>
      <ul className="m-0 flex list-none flex-wrap gap-x-2 gap-y-1 p-0">
        {pills.map((p, i) => (
          <li key={p.label} className="inline">
            {i > 0 ? (
              <span className="hs-text-label" style={{ color: 'var(--text-muted)' }} aria-hidden>
                {' · '}
              </span>
            ) : null}
            <SnapshotText muted={p.muted}>{p.label}</SnapshotText>
          </li>
        ))}
      </ul>
    </SegmentShell>
  )
}

function CostSegment({
  card,
}: {
  card: Extract<CommissioningSnapshotCard, { kind: 'cost' }>
}) {
  return (
    <SegmentShell label={card.label} labelHref={card.href}>
      {card.modelPills.length > 0 ? (
        <div>
          <SnapshotTextList items={card.modelPills} />
          {card.indicativeNote ? (
            <p className="mt-1 mb-0 hs-text-caption leading-snug" style={{ color: 'var(--text-muted)' }}>
              {card.indicativeNote}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="m-0 hs-text-caption leading-snug" style={{ color: 'var(--text-muted)' }}>
          Not listed in profile
        </p>
      )}
      {card.subline ? (
        <p className="mt-2 mb-0 hs-text-caption leading-snug" style={{ color: 'var(--text-muted)' }}>
          {card.subline}
        </p>
      ) : null}
    </SegmentShell>
  )
}

function FundingFullWidthSegment({ card }: { card: FundingSnapshotCard }) {
  return (
    <article className="hs-snapshot-strip__segment hs-snapshot-strip__segment--row">
      <div className="hs-snapshot-strip__row hs-snapshot-strip__row--funding">
        <h2 className="sr-only">{card.label}</h2>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <SnapshotTextList items={card.pills} />
        </div>
        {card.opportunitiesLink ? (
          <SegmentLink href={card.opportunitiesLink.href} className="shrink-0 whitespace-nowrap">
            {card.opportunitiesLink.label}
          </SegmentLink>
        ) : null}
      </div>
    </article>
  )
}

function PlatformSegment({
  card,
}: {
  card: Extract<CommissioningSnapshotCard, { kind: 'platform' }>
}) {
  return (
    <SegmentShell label={card.label}>
      <p className="m-0 hs-text-label leading-snug" style={{ color: 'var(--text-secondary)' }}>
        {card.values.join(', ')}
      </p>
    </SegmentShell>
  )
}

function IntegrationSegment({
  card,
}: {
  card: Extract<CommissioningSnapshotCard, { kind: 'interop' }>
}) {
  const readyItems = interopItemsInOrder(card.items, INTEGRATION_READY_KEYS)

  return (
    <SegmentShell label={card.label} labelHref={card.href}>
      {readyItems.length === 0 ? (
        <p className="m-0 hs-text-caption leading-snug" style={{ color: 'var(--text-muted)' }}>
          None listed in profile
        </p>
      ) : (
        <SnapshotTextList items={readyItems.map(item => item.textLabel ?? item.name)} />
      )}
    </SegmentShell>
  )
}

function renderGridCard(card: CommissioningSnapshotCard) {
  switch (card.kind) {
    case 'regulation':
      return <GovernanceSegment key={card.kind} label={card.label} href={card.href} pills={card.pills} />
    case 'cost':
      return <CostSegment key={card.kind} card={card} />
    case 'platform':
      return <PlatformSegment key={card.kind} card={card} />
    case 'interop':
      return <IntegrationSegment key={card.kind} card={card} />
    default:
      return null
  }
}

/**
 * Persistent commissioning decision snapshot — governance, pricing model, integration,
 * where it's live (grid); funding opportunities full-width below when present.
 */
export function PdpCommissioningSnapshot({
  cards,
  fundingCard,
  whereLiveApp,
  whereLiveHref,
}: {
  cards: CommissioningSnapshotCard[]
  fundingCard?: FundingSnapshotCard | null
  whereLiveApp: WhereLiveApp
  /** Deep-link target for the "Live deployments" tile (defaults to #scale-and-maturity). */
  whereLiveHref?: string
}) {
  return (
    <section className="m-0" aria-label="Commissioning snapshot">
      <div className="hs-snapshot-strip__grid">
        {cards.filter(card => card.kind !== 'regulation').map(card => renderGridCard(card))}
        <PdpWhereLiveSegment app={whereLiveApp} href={whereLiveHref} />
      </div>
      {fundingCard ? (
        <div className="hs-decision-snapshot__full-width">
          <FundingFullWidthSegment card={fundingCard} />
        </div>
      ) : null}
    </section>
  )
}
