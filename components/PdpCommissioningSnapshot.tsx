import type { ReactNode } from 'react'
import type {
  CommissioningSnapshotCard,
  FundingSnapshotCard,
  InteropSnapshotItem,
  RegulationSnapshotPill,
} from '@/lib/commissioningSnapshot'
import { PdpWhereLiveSegment } from '@/components/PdpWhereLive'
import type { WhereLiveApp } from '@/lib/whereLiveSummary'

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
    <span className={`badge badge-grey max-w-full ${muted ? 'opacity-50' : ''}`}>{children}</span>
  )
}

function NhsServicePill({ children }: { children: ReactNode }) {
  return (
    <span
      className="badge max-w-full border-0"
      style={{ background: 'var(--nhs-blue)', color: '#fff' }}
    >
      {children}
    </span>
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
      className={`inline-block text-sm font-medium underline-offset-2 hover:underline ${className}`.trim()}
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
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {pills.map(p => (
          <li key={p.label}>
            <span className={`badge badge-blue max-w-full ${p.muted ? 'opacity-50' : ''}`}>{p.label}</span>
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
        <div className="flex flex-wrap items-center gap-1.5">
          {card.modelPills.map(text => (
            <SnapshotPill key={text}>{text}</SnapshotPill>
          ))}
          {card.indicativeNote ? (
            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
              {card.indicativeNote}
            </span>
          ) : null}
        </div>
      ) : (
        <p className="m-0 text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>
          Not listed in profile
        </p>
      )}
      {card.subline ? (
        <p className="mt-2 mb-0 text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>
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
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {card.pills.map((text, i) => (
            <span key={`${i}-${text}`} className="shrink-0 whitespace-nowrap">
              <SnapshotPill>{text}</SnapshotPill>
            </span>
          ))}
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

function IntegrationSegment({
  card,
}: {
  card: Extract<CommissioningSnapshotCard, { kind: 'interop' }>
}) {
  const logoRow = interopItemsInOrder(card.items, INTEROP_LOGO_KEYS)
  const bottomRow = interopItemsInOrder(card.items, INTEROP_BOTTOM_KEYS)

  return (
    <SegmentShell label={card.label} labelHref={card.href}>
      {logoRow.length === 0 && bottomRow.length === 0 ? (
        <p className="m-0 text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>
          None listed in profile
        </p>
      ) : (
        <div className="flex flex-col gap-2" role="group" aria-label="Confirmed integrations">
          {logoRow.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5" aria-label="NHS service integrations">
              <span className="text-sm font-semibold leading-none" style={{ color: 'var(--nhs-dark)' }}>
                NHS:
              </span>
              {logoRow.map(item => (
                <NhsServicePill key={item.key}>
                  {NHS_SERVICE_PILL_LABELS[item.key as (typeof INTEROP_LOGO_KEYS)[number]] ?? item.name}
                </NhsServicePill>
              ))}
            </div>
          ) : null}
          {bottomRow.length > 0 ? (
            <div className="flex flex-wrap gap-1.5" aria-label="FHIR and EMIS">
              {bottomRow.map(item => (
                <SnapshotPill key={item.key}>{item.textLabel ?? item.name}</SnapshotPill>
              ))}
            </div>
          ) : null}
        </div>
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
}: {
  cards: CommissioningSnapshotCard[]
  fundingCard?: FundingSnapshotCard | null
  whereLiveApp: WhereLiveApp
}) {
  return (
    <section className="m-0" aria-label="Commissioning snapshot">
      <div className="hs-snapshot-strip__grid">
        {cards.map(card => renderGridCard(card))}
        <PdpWhereLiveSegment app={whereLiveApp} />
      </div>
      {fundingCard ? (
        <div className="hs-decision-snapshot__full-width">
          <FundingFullWidthSegment card={fundingCard} />
        </div>
      ) : null}
    </section>
  )
}
