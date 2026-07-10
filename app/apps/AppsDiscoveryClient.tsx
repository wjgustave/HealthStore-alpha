'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

type ConditionArea = { id: string; label: string; colour: string; count: number; icon: string }

export default function AppsDiscoveryClient({
  conditionAreas,
  totalAppCount,
}: {
  conditionAreas: ConditionArea[]
  /** Kept for callers that still pass catalogue apps; search is currently hidden. */
  apps?: unknown[]
  totalAppCount: number
}) {
  const availableConditions = useMemo(
    () => conditionAreas.filter(c => c.count > 0),
    [conditionAreas],
  )
  const roadmapConditions = useMemo(
    () => conditionAreas.filter(c => c.count === 0),
    [conditionAreas],
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
          Digital therapeutics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableConditions.map(c => (
            <Link
              key={c.id}
              href={`/product-catalogue/digital-therapeutics?condition=${encodeURIComponent(c.id)}`}
              className="app-card group block p-6 text-left no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: 'inherit', outlineColor: 'var(--nhs-blue)' }}
            >
              <div className="hs-font-bold" style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                {c.label}
              </div>
              <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginTop: 4 }}>
                {c.count} {c.count === 1 ? 'app' : 'apps'}
              </div>
              <span className="mt-2 inline-block hs-text-label hs-font-bold text-[var(--nhs-blue)] group-hover:underline">View apps</span>
            </Link>
          ))}
        </div>
        <p className="mt-8">
          <Link
            href="/product-catalogue/digital-therapeutics"
            className="hs-text-body hs-font-bold underline underline-offset-2"
            style={{ color: 'var(--nhs-blue)' }}
          >
            Browse all products
          </Link>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
            {' '}
            · {totalAppCount} digital therapeutics
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
