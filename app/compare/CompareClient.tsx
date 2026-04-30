'use client'
import { Fragment, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { DtacBadge, MaturityBadge, ConditionTag } from '@/components/Badges'
import { useCompareBasket } from '@/components/CompareBasketProvider'
import {
  formatConditionLabels,
  sharedConditionTags,
  appConditionTags,
} from '@/lib/compareConditions'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import {
  NOT_STATED,
  getTherapeuticPurpose,
  getClinicalPathways,
  getCareSettings,
  getClinicalEvidenceExcerpt,
  getExpectedBenefit,
  getNiceGuidanceStatus,
  getOnboardingCompareLine,
  getLiveIcbsDisplay,
  getServiceWrapYn,
  getIntegrationsSummary,
  getIndicativePriceShort,
  pickStr,
} from '@/lib/compareFieldFormat'

type Props = { allApps: App[] }

const LOGO_DESKTOP = { w: 140, h: 72 }
const LOGO_MOBILE = { w: 112, h: 60 }

function cellText(text: string) {
  return (
    <span className="leading-relaxed" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
      {text}
    </span>
  )
}

function ServiceWrapBadge({ value }: { value: ReturnType<typeof getServiceWrapYn> }) {
  if (value === NOT_STATED) {
    return <span className="badge badge-amber">{NOT_STATED}</span>
  }
  return value === 'Yes' ? (
    <span className="badge badge-green">Yes</span>
  ) : (
    <span className="badge badge-grey">No</span>
  )
}

/** Logo + name + supplier + condition tags + remove. */
function CompareSummaryCard({
  app,
  onRemove,
  layout,
}: {
  app: App
  onRemove: () => void
  layout: 'mobile' | 'desktop'
}) {
  const { w, h } = layout === 'desktop' ? LOGO_DESKTOP : LOGO_MOBILE
  const tags = appConditionTags(app)

  const logoBox = (
    <div className="relative inline-block shrink-0">
      {app.logo_path ? (
        <div
          className="hs-surface-card relative rounded-xl bg-white border"
          style={{
            width: w,
            height: h,
            borderColor: 'var(--border)',
          }}
        >
          <Image src={app.logo_path} alt="" fill sizes={`${w}px`} className="object-contain p-3" />
        </div>
      ) : (
        <div
          className="rounded-xl bg-[#F7F9FC] border flex items-center justify-center"
          style={{ width: w, height: h, borderColor: 'var(--border)' }}
          aria-hidden
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10 w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors hover:bg-[#fecaca] hover:opacity-100 shadow-sm"
        style={{ background: '#FEE2E2', color: '#DC2626' }}
        aria-label={`Remove ${app.app_name}`}
      >
        <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  )

  const meta = (
    <div className={layout === 'mobile' ? 'min-w-0 flex-1 text-left' : 'text-center mt-2'}>
      <Link
        href={`/apps/${app.slug}`}
        className={`font-bold hover:underline ${layout === 'mobile' ? 'text-sm block' : 'text-sm block mt-0'}`}
        style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
      >
        {app.app_name}
      </Link>
      <p className={`${layout === 'mobile' ? 'text-xs mt-0.5' : 'text-xs mt-0.5'}`} style={{ color: 'var(--text-muted)' }}>
        {app.supplier_name}
      </p>
      <div className={`flex flex-wrap gap-1 mt-2 ${layout === 'desktop' ? 'justify-center' : ''}`}>
        {tags.map((t) => (
          <ConditionTag key={t} tag={t} />
        ))}
      </div>
    </div>
  )

  if (layout === 'mobile') {
    return (
      <div className="flex items-start gap-4">
        {logoBox}
        {meta}
      </div>
    )
  }

  return (
    <div className="text-center flex flex-col items-center">
      {logoBox}
      {meta}
    </div>
  )
}

type DimRow = { key: string; label: string; render: (app: App) => React.ReactNode }

const COMPARE_SECTIONS: { id: string; title: string; rows: DimRow[] }[] = [
  {
    id: 'clinical',
    title: 'Clinical context',
    rows: [
      {
        key: 'conditions',
        label: 'Conditions',
        render: (app) => cellText(formatConditionLabels(appConditionTags(app))),
      },
      {
        key: 'therapeutic',
        label: 'Therapeutic purpose',
        render: (app) => cellText(getTherapeuticPurpose(app)),
      },
      {
        key: 'pathways',
        label: 'Clinical pathways',
        render: (app) => cellText(getClinicalPathways(app)),
      },
      {
        key: 'care_settings',
        label: 'Care settings',
        render: (app) => cellText(getCareSettings(app)),
      },
      {
        key: 'evidence_excerpt',
        label: 'Clinical evidence (summary)',
        render: (app) => cellText(getClinicalEvidenceExcerpt(app)),
      },
      {
        key: 'expected_benefit',
        label: 'Expected benefit',
        render: (app) => cellText(getExpectedBenefit(app)),
      },
    ],
  },
  {
    id: 'adoption',
    title: 'Adoption & assurance',
    rows: [
      {
        key: 'maturity',
        label: 'Deployment maturity',
        render: (app) => <MaturityBadge level={app.maturity_level} />,
      },
      {
        key: 'nice',
        label: 'NICE guidance status',
        render: (app) => cellText(getNiceGuidanceStatus(app)),
      },
      {
        key: 'dtac',
        label: 'DTAC status',
        render: (app) => <DtacBadge status={app.dtac_status} />,
      },
      {
        key: 'onboarding',
        label: 'Onboarding model',
        render: (app) => cellText(getOnboardingCompareLine(app)),
      },
      {
        key: 'live_icbs',
        label: 'Live ICB sites',
        render: (app) => cellText(getLiveIcbsDisplay(app)),
      },
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial & delivery',
    rows: [
      {
        key: 'service_wrap',
        label: 'Service wrap',
        render: (app) => <ServiceWrapBadge value={getServiceWrapYn(app)} />,
      },
      {
        key: 'integrations',
        label: 'Integrations',
        render: (app) => cellText(getIntegrationsSummary(app)),
      },
      {
        key: 'pricing_model',
        label: 'Pricing model',
        render: (app) => cellText(pickStr(app.pricing_model)),
      },
      {
        key: 'indicative_price',
        label: 'Indicative price',
        render: (app) => cellText(getIndicativePriceShort(app)),
      },
    ],
  },
]

export default function CompareClient({ allApps }: Props) {
  const searchParams = useSearchParams()
  const { ids: selectedIds, remove, clear, setFromUrlIds } = useCompareBasket()

  const idsParam = searchParams?.get('ids') ?? ''
  useEffect(() => {
    if (!idsParam) return
    const urlIds = idsParam.split(',').map((s) => s.trim()).filter(Boolean)
    if (urlIds.length > 0) setFromUrlIds(urlIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam])

  const selected = selectedIds.map((id) => allApps.find((a) => a.id === id)).filter(Boolean) as App[]

  const sharedTags = useMemo(() => sharedConditionTags(selected), [selected])

  let rowIndex = 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageBreadcrumb items={[{ label: 'Comparison tool' }]} />

      <div className="mb-8">
        <h1 className="page-title-h1">Comparison tool</h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Add up to four apps from the catalogue in the <strong>same condition area</strong>. Remove apps here or clear all to use the comparison tool for a different condition.
        </p>
      </div>

      {selected.length > 0 && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {selected.length} application{selected.length !== 1 ? 's' : ''} selected
              </p>
              {sharedTags.length > 0 && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Shared condition{sharedTags.length > 1 ? 's' : ''}:{' '}
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {formatConditionLabels(sharedTags)}
                  </span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => clear()}
              className="self-start text-sm rounded-md px-2 py-1 -mx-2 -my-1 transition-colors hover:bg-[#FEF2F2] hover:text-red-600 sm:shrink-0"
              style={{ color: 'var(--text-muted)' }}
            >
              Clear all
            </button>
          </div>

          {/* Summary strip — hybrid layout top */}
          <div className="hs-surface-card bg-white rounded-xl border p-5 mb-6" style={{ borderColor: 'var(--border)' }}>
            <h2 className="sr-only">Selected apps summary</h2>
            <div className="md:hidden flex flex-col gap-6">
              {selected.map((app) => (
                <CompareSummaryCard key={app.id} app={app} layout="mobile" onRemove={() => remove(app.id)} />
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto py-2 px-2 -mx-2">
              <div
                className="grid gap-6 mx-auto min-w-0"
                style={{
                  gridTemplateColumns: `repeat(${selected.length}, minmax(200px, 1fr))`,
                }}
              >
                {selected.map((app) => (
                  <CompareSummaryCard key={app.id} app={app} layout="desktop" onRemove={() => remove(app.id)} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selected.length === 0 ? (
        <div className="hs-surface-card text-center py-20 px-4 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-4xl mb-4" aria-hidden>
            ⚖️
          </div>
          <p className="font-semibold mb-3 max-w-lg mx-auto" style={{ color: 'var(--text-primary)' }}>
            No applications selected for the comparison tool. Browse the catalogue and add applications to compare them side by side.
          </p>
          <Link
            href="/apps"
            className="inline-flex items-center justify-center text-sm font-semibold rounded-lg px-5 py-3 min-h-[44px]"
            style={{ background: STORE_ACCENT, color: '#fff' }}
          >
            Find apps
          </Link>
        </div>
      ) : (
        <>
          <div className="hs-surface-card overflow-x-auto rounded-xl border bg-white shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full border-collapse min-w-[720px]" style={{ fontSize: 'var(--text-body)' }}>
              <caption className="sr-only">
                {selected.length === 1
                  ? 'Application details by comparison dimension.'
                  : 'Comparison of selected apps by dimension; each column is one product.'}
              </caption>
              <thead className="sticky top-0 z-[3] bg-white shadow-[0_1px_0_0_var(--border)]">
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th
                    scope="col"
                    className="sticky left-0 z-[4] p-3 text-left align-bottom font-semibold uppercase tracking-wide border-r bg-white"
                    style={{ fontSize: 'var(--text-label)', borderColor: 'var(--border)', color: 'var(--text-muted)', minWidth: 160 }}
                  >
                    Comparison
                  </th>
                  {selected.map((app) => (
                    <th
                      key={app.id}
                      scope="col"
                      className="p-3 text-left align-bottom border-l bg-white"
                      style={{ borderColor: 'var(--border)', minWidth: 180 }}
                    >
                      <span className="font-bold block" style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}>
                        {app.app_name}
                      </span>
                      <span className="text-xs font-normal block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {app.supplier_name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_SECTIONS.map((section) => (
                  <Fragment key={section.id}>
                    <tr>
                      <td
                        colSpan={1 + selected.length}
                        className="p-3 font-semibold border-t border-b"
                        style={{
                          background: '#E8EDF3',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-label)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {section.title}
                      </td>
                    </tr>
                    {section.rows.map((row) => {
                      const bg = rowIndex % 2 === 0 ? '#fff' : '#FAFBFC'
                      rowIndex += 1
                      return (
                        <tr key={row.key}>
                          <th
                            scope="row"
                            className="sticky left-0 z-[1] p-4 border-b border-r font-medium uppercase tracking-wide text-left align-top"
                            style={{
                              fontSize: 'var(--text-label)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-muted)',
                              background: bg,
                              boxShadow: '2px 0 0 0 var(--border)',
                            }}
                          >
                            {row.label}
                          </th>
                          {selected.map((app) => (
                            <td key={app.id} className="p-4 border-b align-top" style={{ borderColor: 'var(--border)', background: bg }}>
                              {row.render(app)}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </Fragment>
                ))}
                <tr>
                  <td
                    className="sticky left-0 z-[1] p-4 border-t bg-[#F7F9FC]"
                    style={{ borderColor: 'var(--border)', boxShadow: '2px 0 0 0 var(--border)' }}
                  />
                  {selected.map((app) => (
                    <td key={app.id} className="p-4 border-t bg-[#F7F9FC]" style={{ borderColor: 'var(--border)' }}>
                      <Link
                        href={`/apps/${app.slug}`}
                        className="block text-center text-sm font-semibold rounded-lg py-2.5 min-h-[44px] flex items-center justify-center transition-colors hover:!bg-[#004B8C]"
                        style={{ background: STORE_ACCENT, color: '#fff' }}
                      >
                        View details →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
