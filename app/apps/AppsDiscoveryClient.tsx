'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { ClickableChevronCard } from '@/components/ui/ClickableChevronCard'

type ConditionArea = { id: string; label: string; colour: string; count: number; icon: string }

type CatalogueApp = { condition_tags?: string[] }

/** COPD and pulmonary rehab share one catalogue card (same as home storytelling). */
const COPD_PATHWAY_IDS = new Set(['copd', 'pulmonary_rehab'])

function mergeCopdAndPulmonaryRehab(
  areas: ConditionArea[],
  apps: CatalogueApp[] | undefined,
): ConditionArea[] {
  const withoutPr = areas.filter(c => c.id !== 'pulmonary_rehab')
  const unionCount = Array.isArray(apps)
    ? apps.filter(
        a => Array.isArray(a.condition_tags) && a.condition_tags.some(t => COPD_PATHWAY_IDS.has(t)),
      ).length
    : undefined

  return withoutPr.map(c => {
    if (c.id !== 'copd') return c
    return {
      ...c,
      label: 'COPD and pulmonary rehab',
      count: unionCount ?? c.count,
    }
  })
}

export default function AppsDiscoveryClient({
  conditionAreas,
  totalAppCount,
  apps,
}: {
  conditionAreas: ConditionArea[]
  /** Used to compute the combined COPD / pulmonary rehab card count. */
  apps?: CatalogueApp[]
  totalAppCount: number
}) {
  const mergedAreas = useMemo(
    () => mergeCopdAndPulmonaryRehab(conditionAreas, apps),
    [conditionAreas, apps],
  )
  const availableConditions = useMemo(
    () => mergedAreas.filter(c => c.count > 0),
    [mergedAreas],
  )
  const roadmapConditions = useMemo(
    () => mergedAreas.filter(c => c.count === 0),
    [mergedAreas],
  )

  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'Product catalogue' }]} />
      <div className="hs-section max-w-3xl">
        <h1 className="page-title-h1 mb-4">Product catalogue</h1>
        <div className="space-y-2 text-balance" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <p className="m-0">Browse digital therapeutics by pathway and condition.</p>
        </div>
      </div>

      <section aria-labelledby="digital-therapeutics-heading">
        <h2
          id="digital-therapeutics-heading"
          className="mb-4 hs-font-bold"
          style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--text-primary)' }}
        >
          Care pathways
        </h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {availableConditions.map(c => (
            <li key={c.id} className="flex min-h-0">
              <ClickableChevronCard
                variant="primary"
                href={`/catalogue/digital-therapeutics?condition=${encodeURIComponent(c.id)}`}
                title={c.label}
                description={`${c.count} ${c.count === 1 ? 'product' : 'products'}`}
                headingLevel={3}
                className="w-full"
              />
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/catalogue/digital-therapeutics"
            className="hs-text-body hs-font-bold underline underline-offset-2"
            style={{ color: 'var(--nhs-blue)' }}
          >
            See all products in the catalogue
          </Link>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
            {' '}
            · {totalAppCount} {totalAppCount === 1 ? 'product' : 'products'}
          </span>
        </p>
      </section>

      {roadmapConditions.length > 0 ? (
        <section aria-labelledby="coming-soon-heading" className="mt-12">
          <h2
            id="coming-soon-heading"
            className="mb-2 hs-font-bold"
            style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}
          >
            Pathways and conditions coming to the NHS HealthStore soon
          </h2>
          <p className="mb-4" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
            The NHS HealthStore is growing. Additional pathways are on our roadmap and will be available as evidence and supplier readiness are confirmed.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roadmapConditions.map(c => (
              <div
                key={c.id}
                className="rounded-xl border p-6 text-left"
                style={{ borderColor: 'var(--border)', background: '#F0F4F5' }}
              >
                <div className="hs-font-bold" style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginTop: 4 }}>
                  Coming soon
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
