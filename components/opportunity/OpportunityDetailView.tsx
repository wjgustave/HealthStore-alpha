'use client'

import Link from 'next/link'
import LocalContextSelector from '@/components/context/LocalContextSelector'
import { CoverageSankey } from '@/components/charts'
import type { CommissionerContext } from '@/lib/context/types'
import { contextToSearchParams } from '@/lib/context/types'
import type { ConditionDomain, PathwayOpportunity } from '@/lib/domain/types'
import type { App } from '@/lib/data'

const LENS_LABELS: Record<string, string> = {
  care_outcomes: 'Care and outcomes',
  demand_capacity: 'Demand and capacity',
  access_equity: 'Access and equity',
  financial_public_value: 'Financial and public value',
}

export default function OpportunityDetailView({
  context,
  condition,
  opportunity,
  products,
}: {
  context: CommissionerContext
  condition: ConditionDomain
  opportunity: PathwayOpportunity | null
  products: App[]
}) {
  const qs = contextToSearchParams(context).toString()

  if (!opportunity) {
    return (
      <>
        <nav style={{ fontSize: 14, color: '#4c6272', marginBottom: 16 }}>
          <Link href={`/opportunities?${qs}`} style={{ color: '#005eb8' }}>← Back to opportunities</Link>
        </nav>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 12 }}>{condition.label}</h1>
        <div style={{ background: '#f0f4f5', border: '1px solid #d8dde0', borderRadius: 8, padding: 24 }}>
          <p style={{ color: '#4c6272', marginBottom: 16, lineHeight: 1.6, margin: 0 }}>
            This pathway is on the HealthStore roadmap. Local data and assured product mapping will follow as NICE guidance and supplier readiness are confirmed.
          </p>
        </div>
      </>
    )
  }

  const pop = (opportunity as any).populationHealth
  const gap = (opportunity as any).gap
  const current = (opportunity as any).currentState

  const sankeyStages = current && current.eligible > 0
    ? [
        { label: 'Eligible', value: current.eligible },
        ...(current.invited > 0 ? [{ label: 'Invited', value: current.invited }] : []),
        ...(current.registered > 0 ? [{ label: 'Registered', value: current.registered }] : []),
        ...(current.active > 0 ? [{ label: 'Active', value: current.active }] : []),
      ]
    : null

  return (
    <>
      <nav style={{ fontSize: 14, color: '#4c6272', marginBottom: 16 }}>
        <Link href={`/opportunities?${qs}`} style={{ color: '#005eb8' }}>← Back to opportunities</Link>
      </nav>

      <LocalContextSelector context={context} compact />

      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>{opportunity.label}</h1>
      <p style={{ fontSize: 15, color: '#4c6272', marginBottom: 24 }}>{opportunity.pathwayPosition}</p>

      {/* ─── 1. The local problem ─── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16, color: '#212b32' }}>The local problem</h2>

        {pop && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px 24px', marginBottom: 20 }}>
            {pop.prevalence && <BigMetric value={pop.prevalence.value} label={pop.prevalence.context} source={pop.prevalence.source} />}
            {pop.admissions && <BigMetric value={pop.admissions.value} label={pop.admissions.context} source={pop.admissions.source} />}
            {pop.highRisk && <BigMetric value={pop.highRisk.value} label={pop.highRisk.context} source={pop.highRisk.source} />}
            {pop.readmissions && <BigMetric value={pop.readmissions.value} label={pop.readmissions.context} source={pop.readmissions.source} />}
            {pop.costBurden && <BigMetric value={pop.costBurden.value} label={pop.costBurden.context} source={pop.costBurden.source} />}
            {pop.waitingList && <BigMetric value={pop.waitingList.value} label={pop.waitingList.context} source={pop.waitingList.source} />}
          </div>
        )}
      </section>

      {/* ─── 2. The gap ─── */}
      {gap && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12, color: '#212b32' }}>The gap</h2>

          <div style={{ background: '#fef5f5', border: '1px solid #d5281b', borderRadius: 8, padding: '20px 24px', marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 15, color: '#212b32', lineHeight: 1.7 }}>
              <strong style={{ fontSize: '1.2rem' }}>{typeof gap.notYetInvited === 'number' ? gap.notYetInvited.toLocaleString() : gap.notYetInvited}</strong>{' '}
              patients not yet reached.
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: '#4c6272', lineHeight: 1.7 }}>
              {gap.headroomStatement}
            </p>
          </div>

          {gap.constraintStatement && (
            <p style={{ fontSize: 14, color: '#4c6272', lineHeight: 1.7, maxWidth: 680 }}>
              <strong>Key constraint:</strong> {gap.constraintStatement}
            </p>
          )}

          {sankeyStages && sankeyStages.length >= 2 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#4c6272', marginBottom: 8 }}>Where patients drop off</h3>
              <CoverageSankey stages={sankeyStages} ariaLabel={`Coverage flow for ${opportunity.label}`} />
            </div>
          )}
        </section>
      )}

      {/* ─── 3. What the evidence says ─── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16, color: '#212b32' }}>What the evidence says</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {opportunity.impactCategories.map((cat) => (
            <div key={cat.lens} style={{ background: '#f9fafb', borderRadius: 8, padding: '16px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4c6272', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{LENS_LABELS[cat.lens] ?? cat.lens}</h3>
              <p style={{ margin: 0, fontSize: 14, color: '#212b32', lineHeight: 1.6 }}>{cat.summary}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: '#4c6272', marginTop: 16 }}>
          <strong>Evidence basis:</strong> {opportunity.evidenceStatus}
        </p>
      </section>

      {/* ─── 4. Current deployment state ─── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12, color: '#212b32' }}>Current state in your area</h2>

        {opportunity.deploymentSummary.status === 'absent' ? (
          <div style={{ background: '#f0f4f5', borderRadius: 8, padding: '16px 20px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#4c6272' }}>
              No deployment is currently live for this pathway. {(opportunity as any).deploymentSummary?.productsLive}
            </p>
          </div>
        ) : (
          <div style={{ background: '#e6f5ec', borderRadius: 8, padding: '16px 20px' }}>
            <p style={{ margin: 0, fontSize: 15, color: '#004b22', fontWeight: 600 }}>
              {(opportunity as any).deploymentSummary?.productsLive ?? `${opportunity.deploymentSummary.count} deployment${opportunity.deploymentSummary.count > 1 ? 's' : ''} live`}
            </p>
            {opportunity.deploymentSummary.activeUsers != null && opportunity.deploymentSummary.activeUsers > 0 && (
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#004b22' }}>{opportunity.deploymentSummary.activeUsers} active users</p>
            )}
          </div>
        )}

        <p style={{ fontSize: 14, color: '#4c6272', marginTop: 12 }}>
          <strong>Readiness:</strong> {opportunity.readinessStatus}
        </p>
      </section>

      {/* ─── 5. Relevant products ─── */}
      {products.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12, color: '#212b32' }}>Assured products for this pathway</h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(products.length, 3)}, 1fr)`, gap: 16 }}>
            {products.map((p) => (
              <div key={p.id} style={{ background: '#fff', border: '1px solid #d8dde0', borderRadius: 8, padding: '20px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#212b32' }}>{p.app_name}</h3>
                <p style={{ fontSize: 14, color: '#4c6272', margin: '0 0 12px', lineHeight: 1.5 }}>{p.one_line_value_proposition}</p>
                <Link href={`/products/${p.slug}?${qs}`} style={{ fontSize: 14, color: '#005eb8' }}>View product →</Link>
              </div>
            ))}
          </div>
          {products.length > 1 && (
            <div style={{ marginTop: 12 }}>
              <Link href={`/compare?ids=${products.map(p => p.id).join(',')}&${qs}`} style={{ fontSize: 14, color: '#005eb8' }}>Compare these products →</Link>
            </div>
          )}
        </section>
      )}

      <Link href={`/opportunities?${qs}`} className="hs-btn hs-btn-secondary">← Back to area overview</Link>
    </>
  )
}

function BigMetric({ value, label, source }: { value: string | number; label: string; source?: string }) {
  const display = typeof value === 'number' ? value.toLocaleString() : value
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#212b32', marginBottom: 2 }}>{display}</div>
      <div style={{ fontSize: 13, color: '#4c6272', lineHeight: 1.4 }}>{label}</div>
      {source && <div style={{ fontSize: 11, color: '#768692', marginTop: 2 }}>{source}</div>}
    </div>
  )
}
