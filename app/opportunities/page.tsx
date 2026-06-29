import Link from 'next/link'
import { getServerContext } from '@/lib/context/serverContext'
import { contextToSearchParams } from '@/lib/context/types'
import { getAreaOpportunities, getAreaMeta, rankOpportunities, getSupportedConditions, getHorizonConditions } from '@/lib/domain/opportunities'

export const metadata = { title: 'Local opportunities — HealthStore' }

export default async function OpportunitiesOverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const ctx = await getServerContext(params)
  const qs = contextToSearchParams(ctx).toString()
  const meta = getAreaMeta(ctx)
  const opportunities = rankOpportunities(getAreaOpportunities(ctx), ctx.priority_id)
  const supported = getSupportedConditions()
  const horizon = getHorizonConditions()

  return (
    <>
      {/* ─── Narrative lead ─── */}
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>
        {meta?.label ?? ctx.geography_label}
      </h1>
      {meta && (
        <p style={{ fontSize: '1.1rem', color: '#212b32', lineHeight: 1.7, marginBottom: 8, maxWidth: 720 }}>
          {meta.summary}
        </p>
      )}
      <p style={{ fontSize: 13, color: '#768692', marginBottom: 32 }}>
        Population: {meta?.population ?? '—'} · Reporting: {meta?.reportingPeriod ?? '—'} · <span className="hs-tag hs-tag-amber" style={{ fontSize: 11 }}>Synthetic fixture</span>
      </p>

      {/* ─── Supported pathways — the story for each ─── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>Where digital therapeutics can help now</h2>
        <p style={{ fontSize: 15, color: '#4c6272', marginBottom: 24, maxWidth: 680 }}>
          Three pathways have NICE Health Technology Guidance, assured products, and local population data supporting action.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {opportunities.map((opp) => {
            const cond = supported.find(s => s.id === opp.conditionId)
            const pop = (opp as any).populationHealth
            const gap = (opp as any).gap
            const current = (opp as any).currentState
            const colour = cond?.colour ?? '#005eb8'

            return (
              <article key={opp.conditionId} style={{ background: '#fff', border: '1px solid #d8dde0', borderLeft: `5px solid ${colour}`, borderRadius: 8, padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{opp.label}</h3>
                  {cond?.niceRef && <span className="hs-tag hs-tag-blue" style={{ fontSize: 11 }}>{cond.niceRef}</span>}
                  <span style={{ fontSize: 13, color: '#4c6272', marginLeft: 'auto' }}>{opp.pathwayPosition}</span>
                </div>

                {/* The problem */}
                {pop && (
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#4c6272', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Local need</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                      {pop.prevalence && <Metric value={pop.prevalence.value} label={pop.prevalence.context} />}
                      {pop.admissions && <Metric value={pop.admissions.value} label={pop.admissions.context} />}
                      {pop.highRisk && <Metric value={pop.highRisk.value} label={pop.highRisk.context} />}
                      {pop.readmissions && <Metric value={pop.readmissions.value} label={pop.readmissions.context} />}
                      {pop.costBurden && <Metric value={pop.costBurden.value} label={pop.costBurden.context} />}
                      {pop.waitingList && <Metric value={pop.waitingList.value} label={pop.waitingList.context} />}
                    </div>
                  </div>
                )}

                {/* The gap */}
                {gap && (
                  <div style={{ background: '#f9fafb', borderRadius: 6, padding: '14px 18px', marginBottom: 16, borderLeft: '3px solid #d5281b' }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#212b32', lineHeight: 1.7 }}>
                      <strong style={{ color: '#d5281b' }}>{typeof gap.notYetInvited === 'number' ? gap.notYetInvited.toLocaleString() : '—'} not yet reached.</strong>{' '}
                      {gap.headroomStatement}
                    </p>
                  </div>
                )}

                {/* Current state — inline, not a separate section */}
                {current && current.eligible > 0 && (
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14, color: '#4c6272', marginBottom: 16 }}>
                    <span><strong>{current.coverageOfEligible}</strong> of eligible reached</span>
                    <span><strong>{current.invitationRate}</strong> invited</span>
                    <span><strong>{current.registrationRate}</strong> registered</span>
                    {current.active > 0 && <span><strong>{current.active.toLocaleString()}</strong> active users</span>}
                  </div>
                )}

                {/* What the evidence says */}
                <div style={{ fontSize: 14, color: '#4c6272', marginBottom: 16 }}>
                  <strong style={{ color: '#212b32' }}>Evidence:</strong> {opp.evidenceStatus}
                </div>

                {/* Single clear action */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link href={`/opportunities/${opp.conditionId}?${qs}`} className="hs-btn hs-btn-primary" style={{ fontSize: 14, padding: '8px 16px' }}>
                    Explore this opportunity
                  </Link>
                  <span style={{ fontSize: 13, color: '#768692' }}>
                    {opp.deploymentSummary.status === 'absent' ? 'Not yet deployed' : `${opp.deploymentSummary.count} live · ${opp.deploymentSummary.activeUsers ?? 0} active users`}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ─── Horizon pathways ─── */}
      {horizon.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>Future pathways</h2>
          <p style={{ fontSize: 14, color: '#4c6272', marginBottom: 12, maxWidth: 600 }}>
            These conditions are on the HealthStore roadmap. Local data and product mapping will follow as NICE guidance and supplier readiness are confirmed.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {horizon.map(c => (
              <span key={c.id} className="hs-tag hs-tag-grey" style={{ fontSize: 13 }}>{c.label}</span>
            ))}
          </div>
        </section>
      )}

      {/* ─── Method ─── */}
      <details style={{ marginBottom: 32, fontSize: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#005eb8', fontWeight: 600 }}>Method and sources</summary>
        <div style={{ marginTop: 12, color: '#4c6272', lineHeight: 1.7, maxWidth: 720 }}>
          <p>Population health data is drawn from QOF registers, SUS emergency admissions, NACR cardiac rehab data, and community services datasets. All values are synthetic proxies shaped to realistic Greater Manchester volumes.</p>
          <p>Opportunity priority is determined by: size of unmet need, strength of evidence, product readiness, and implementation feasibility. All figures are labelled as synthetic prototype fixtures and must not be cited as operational data.</p>
        </div>
      </details>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/products?${qs}`} className="hs-btn hs-btn-secondary">Browse products</Link>
        <Link href={`/start?${qs}`} className="hs-btn hs-btn-secondary">Change area</Link>
      </div>
    </>
  )
}

function Metric({ value, label }: { value: string | number; label: string }) {
  const display = typeof value === 'number' ? value.toLocaleString() : value
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#212b32' }}>{display}</div>
      <div style={{ fontSize: 13, color: '#4c6272', lineHeight: 1.4 }}>{label}</div>
    </div>
  )
}
