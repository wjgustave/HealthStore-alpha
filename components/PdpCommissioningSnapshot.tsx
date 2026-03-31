import { Fragment, type ReactNode } from 'react'
import type { CommissioningSnapshotCard, InteropSnapshotItem } from '@/lib/commissioningSnapshot'
import { STORE_ACCENT } from '@/lib/storeAccent'

const INTEROP_LOGO_KEYS = ['nhs_app', 'nhs_notify', 'nhs_login'] as const
const INTEROP_BOTTOM_KEYS = ['fhir', 'emis'] as const

function interopItemsInOrder(items: InteropSnapshotItem[], keys: readonly string[]): InteropSnapshotItem[] {
  return keys.flatMap(k => {
    const item = items.find(i => i.key === k)
    return item && item.integrated === true ? [item] : []
  })
}

function SnapshotPill({
  muted,
  children,
}: {
  muted?: boolean
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center justify-center rounded-md border px-2 py-0.5 text-[13px] font-semibold leading-tight ${
        muted ? 'opacity-50' : ''
      }`}
      style={{
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
        backgroundColor: '#F7F9FC',
      }}
    >
      {children}
    </span>
  )
}

export function PdpCommissioningSnapshot({ cards }: { cards: CommissioningSnapshotCard[] }) {
  const accent = STORE_ACCENT

  return (
    <section className="m-0" aria-label="Commissioning snapshot">
      <div
        className={`grid grid-cols-2 gap-3 sm:gap-4 items-stretch ${cards.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
      >
        {cards.map(card => (
          <div
            key={card.kind}
            className="hs-surface-card-sm flex h-full min-h-0 flex-col rounded-lg bg-white border px-3 py-3 sm:px-4 sm:py-3 shadow-sm transition-[box-shadow,transform] duration-200 hover:shadow-md hover:-translate-y-px text-center"
            style={{
              borderColor: 'var(--border)',
              borderTopWidth: 4,
              borderTopColor: accent,
            }}
          >
            <div
              className="shrink-0 text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'var(--text-muted)' }}
            >
              {card.label}
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-end items-center gap-1.5 pt-2">
              {card.kind === 'regulation' ? (
                <>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {card.pills.map(p => (
                      <span
                        key={p.label}
                        className={`badge badge-blue max-w-full ${p.muted ? 'opacity-50' : ''}`}
                      >
                        {p.label}
                      </span>
                    ))}
                  </div>
                  <span
                    className="invisible pointer-events-none select-none block w-full min-h-[14px] text-[10px] font-normal leading-normal shrink-0"
                    aria-hidden="true"
                  />
                </>
              ) : null}

              {card.kind === 'cost' ? (
                <>
                  <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0.5">
                    <span
                      className="text-xl sm:text-lg font-bold leading-tight tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {card.xlText}
                    </span>
                    {card.indicativeNote ? (
                      <span className="text-[10px] font-normal m-0" style={{ color: 'var(--text-muted)' }}>
                        {card.indicativeNote}
                      </span>
                    ) : null}
                  </div>
                  {card.modelPills.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {card.modelPills.map(text => (
                        <SnapshotPill key={text}>{text}</SnapshotPill>
                      ))}
                    </div>
                  ) : null}
                  {card.subline ? (
                    <p className="text-[10px] leading-snug m-0 max-w-full" style={{ color: 'var(--text-muted)' }}>
                      {card.subline}
                    </p>
                  ) : null}
                  <a
                    href={card.href}
                    className="text-[10px] font-normal hover:underline"
                    style={{ color: accent }}
                  >
                    {card.linkText} →
                  </a>
                </>
              ) : null}

              {card.kind === 'funding' ? (
                <>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {card.pills.map((text, i) => (
                      <SnapshotPill key={`${i}-${text}`}>{text}</SnapshotPill>
                    ))}
                  </div>
                  {card.opportunitiesLink ? (
                    <a
                      href={card.opportunitiesLink.href}
                      className="text-[10px] font-normal hover:underline"
                      style={{ color: accent }}
                    >
                      {card.opportunitiesLink.label} →
                    </a>
                  ) : card.subline ? (
                    <p className="text-[10px] leading-snug m-0" style={{ color: 'var(--text-muted)' }}>
                      {card.subline}
                    </p>
                  ) : null}
                </>
              ) : null}

              {card.kind === 'interop' ? (
                <>
                  {(() => {
                    const logoRow = interopItemsInOrder(card.items, INTEROP_LOGO_KEYS)
                    const bottomRow = interopItemsInOrder(card.items, INTEROP_BOTTOM_KEYS)
                    if (logoRow.length === 0 && bottomRow.length === 0) {
                      return (
                        <p className="text-[10px] leading-snug m-0 max-w-full" style={{ color: 'var(--text-muted)' }}>
                          None listed in profile
                        </p>
                      )
                    }
                    return (
                      <div className="flex w-full flex-col items-center gap-1.5" role="group" aria-label="Confirmed integrations">
                        {logoRow.length > 0 ? (
                          <div
                            className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-y-0.5 px-1"
                            aria-label="NHS service integrations"
                          >
                            {logoRow.map((item, i) => (
                              <Fragment key={item.key}>
                                {i > 0 ? (
                                  <span
                                    className="text-[12px] font-semibold leading-none px-1.5 shrink-0"
                                    style={{ color: '#003087' }}
                                    aria-hidden
                                  >
                                    •
                                  </span>
                                ) : null}
                                <span
                                  className="text-[12px] font-semibold leading-tight text-center shrink-0"
                                  style={{ color: '#003087' }}
                                >
                                  {item.name}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        ) : null}
                        {bottomRow.length > 0 ? (
                          <div
                            className="flex w-full flex-wrap justify-center gap-1"
                            aria-label="FHIR and EMIS"
                          >
                            {bottomRow.map(item => (
                              <div key={item.key} className="flex flex-col items-center">
                                {item.textLabel ? (
                                  <SnapshotPill>{item.textLabel}</SnapshotPill>
                                ) : (
                                  <span
                                    className="text-[9px] font-semibold leading-tight text-center"
                                    style={{ color: 'var(--text-primary)' }}
                                  >
                                    {item.name}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  })()}
                  {card.detailsLink ? (
                    <a
                      href={card.detailsLink.href}
                      className="text-[10px] font-normal hover:underline"
                      style={{ color: accent }}
                    >
                      {card.detailsLink.label} →
                    </a>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
