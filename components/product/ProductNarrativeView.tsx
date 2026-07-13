'use client'

import Link from 'next/link'
import { useState } from 'react'
import LocalContextSelector from '@/components/context/LocalContextSelector'
import ProductHero from '@/components/product/ProductHero'
import ScenarioControls from '@/components/product/ScenarioControls'
import { HorizontalBarChart, InsightCallout } from '@/components/charts'
import { getWorkspaceIcbData } from '@/lib/localData/workspaceData'
import type { CommissionerContext } from '@/lib/context/types'
import type { App } from '@/lib/data'
import { supervisionLabels, maturityLabels } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import { contextToSearchParams } from '@/lib/context/types'
import { buildCopdScenarios, getActiveScenario } from '@/lib/scenarios/copdRoi'

function formatGbp(n: number) {
  if (n >= 1000000) return `£${(n / 1000000).toFixed(1)}m`
  if (n >= 1000) return `£${Math.round(n / 1000)}k`
  return `£${n.toLocaleString()}`
}

export default function ProductNarrativeView({
  app,
  narrative,
  context,
}: {
  app: App
  narrative: ProductNarrative
  context: CommissionerContext
}) {
  const [scenario, setScenario] = useState(context.scenario_id)
  const qs = contextToSearchParams({ ...context, scenario_id: scenario }).toString()
  const isCopd = app.condition_tags?.includes('copd')
  const scenarios = isCopd
    ? buildCopdScenarios({ monitored_cohort: 500, discharge_cohort: 500, eligible_admissions: 500 }, scenario)
    : []
  const active = scenarios.length ? getActiveScenario(scenarios, scenario) : null

  const materialGaps = narrative.assurance_domains?.filter((d) => d.status === 'incomplete' || d.status === 'expired' || d.status === 'declared_pending') ?? []
  const cashBenefits = active?.benefits.filter(b => b.category === 'cash_releasing') ?? []
  const capacityBenefits = active?.benefits.filter(b => b.category === 'capacity_released') ?? []
  const healthBenefit = active?.benefits.find(b => b.category === 'health_gain')
  const totalBenefits = active?.benefits.reduce((sum, b) => sum + (b.amount_gbp ?? 0), 0) ?? 0
  const totalCosts = active?.costs.reduce((sum, c) => sum + c.amount_gbp, 0) ?? 0
  const netPosition = totalBenefits - totalCosts
  const workspaceData = getWorkspaceIcbData(context)

  const evidenceClaims = narrative.evidence_claims?.filter((c) => c.claim_id !== 'catalogue-summary') ?? []
  const quantifiedClaims = evidenceClaims.filter((c) => c.effect_central != null)
  const supervision = app.supervision_model ? supervisionLabels[app.supervision_model] ?? app.supervision_model.replace(/_/g, ' ') : null
  const maturity = app.maturity_level ? maturityLabels[app.maturity_level] ?? app.maturity_level : null
  const bullets = narrative.what_it_does_bullets ?? []

  const hasDeploymentRegister = (app as any).deployment_register?.length > 0
  const hasCaseStudies = (app as any).case_studies?.length > 0
  const register = ((app as any).deployment_register ?? []) as { site: string; condition: string; icb?: string; status: string; sample_size?: number; outcome_summary?: string }[]
  const liveSites = register.filter((r) => r.status === 'live' || r.status === 'active')

  const platforms = app.platform_tags ?? app.platforms ?? []
  const niceRefs = app.nice_guidance_refs ?? []
  const clinicalEvidence = app.clinical_evidence_detailed ?? []

  const sectionLinks: [string, string][] = [
    ['problem', 'The problem'],
    ['what-it-does', 'How it helps'],
    ['projected-impact', 'Projected impact'],
    ...(narrative.commissioner_economics || (isCopd && active) ? [['economics', 'What it could be worth'] as [string, string]] : []),
    ['assurance', 'Assurance and evidence'],
    ...(narrative.implementation ? [['implementation', 'Making it work'] as [string, string]] : []),
    ...(hasDeploymentRegister || hasCaseStudies ? [['nhs-experience', 'NHS experience'] as [string, string]] : []),
    ...(narrative.commercial_readiness ? [['commercial', 'How to buy'] as [string, string]] : []),
  ]

  return (
    <>
      <nav style={{ fontSize: 14, color: '#4c6272', marginBottom: 16 }}>
        <Link href={`/products?${qs}`} style={{ color: '#005eb8' }}>Products</Link>
        {' / '}
        <span>{app.app_name}</span>
      </nav>

      <LocalContextSelector context={context} compact />

      {materialGaps.length > 0 && (
        <div style={{ background: '#fef5e6', border: '1px solid #d5840d', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
          <strong style={{ color: '#7a4800' }}>Assurance attention required</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            {materialGaps.map((g) => <li key={g.domain} style={{ fontSize: 14, color: '#4c6272' }}>{g.domain}: {g.summary}</li>)}
          </ul>
        </div>
      )}

      <ProductHero
        app={app}
        proposition={narrative.decision_summary?.one_line_proposition ?? app.one_line_value_proposition}
        supervision={supervision}
        maturity={maturity}
        regulatoryClass={narrative.regulatory_position?.device_class}
        supportHref={`/products/${app.slug}/support?${qs}`}
        compareHref={`/compare?ids=${app.id}&${qs}`}
        technicalHref={`/apps/${app.slug}`}
      />

      {/* Platform tags and key facts */}
      <div className="hs-kpi-grid" style={{ marginBottom: 40 }}>
        <div className="hs-kpi">
          <div className="hs-kpi-label">Platform</div>
          <div className="hs-kpi-value" style={{ fontSize: '1rem' }}>
            {platforms.length > 0 ? platforms.join(', ') : 'iOS, Android, Web'}
          </div>
        </div>
        <div className="hs-kpi">
          <div className="hs-kpi-label">NICE guidance</div>
          <div className="hs-kpi-value" style={{ fontSize: '1rem' }}>{niceRefs.length > 0 ? niceRefs[0].ref : '—'}</div>
        </div>
        <div className="hs-kpi">
          <div className="hs-kpi-label">Indicative cost</div>
          <div className="hs-kpi-value" style={{ fontSize: '1rem' }}>{narrative.commercial_readiness?.price_summary ?? '—'}</div>
        </div>
        <div className="hs-kpi">
          <div className="hs-kpi-label">NHS HealthStore status</div>
          <div className="hs-kpi-value" style={{ fontSize: '1rem' }}>{narrative.commercial_readiness?.commercial_status ?? 'Under review'}</div>
        </div>
      </div>

      <nav style={{ background: '#f0f4f5', borderRadius: 8, padding: '16px 20px', marginBottom: 40 }}>
        <strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>On this page</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          {sectionLinks.map(([id, label]) => (
            <a key={id} href={`#${id}`} style={{ fontSize: 14, color: '#005eb8' }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* 1. THE PROBLEM — strong narrative */}
      <section id="problem" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 12 }}>The problem {app.app_name} addresses</h2>
        <div style={{ maxWidth: 720, lineHeight: 1.8, color: '#212b32', fontSize: '1.05rem' }}>
          <p>{narrative.decision_summary?.pathway_problem ?? app.target_problem_statement}</p>
          {app.why_it_matters_locally && (
            <p style={{ marginTop: 12, color: '#4c6272' }}>{app.why_it_matters_locally}</p>
          )}
        </div>
      </section>

      {/* 2. HOW IT HELPS — what the product does */}
      <section id="what-it-does" style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 12 }}>How {app.app_name} changes a treatment pathway</h2>
        {bullets.length > 0 ? (
          <ul style={{ margin: '0 0 16px', paddingLeft: 20, maxWidth: 720, lineHeight: 1.75, color: '#212b32', fontSize: '1.05rem' }}>
            {bullets.map((b) => <li key={b} style={{ marginBottom: 8 }}>{b}</li>)}
          </ul>
        ) : (
          <p style={{ color: '#212b32', maxWidth: 720, lineHeight: 1.75, fontSize: '1.05rem' }}>
            {narrative.decision_summary?.why_relevant}
          </p>
        )}

        {narrative.pathway_model && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>How it changes the pathway</h3>
            <div className="hs-pathway-visual">
              <div className="hs-pathway-col hs-pathway-current">
                <h3 className="hs-pathway-heading">Current pathway</h3>
                {narrative.pathway_model.current_steps.map((step, i) => (
                  <div key={i}>
                    <div className="hs-pathway-step">{step.label}</div>
                    {i < narrative.pathway_model!.current_steps.length - 1 && <div className="hs-pathway-arrow">↓</div>}
                  </div>
                ))}
              </div>
              <div className="hs-pathway-divider">→</div>
              <div className="hs-pathway-col hs-pathway-future">
                <h3 className="hs-pathway-heading">With {app.app_name}</h3>
                {narrative.pathway_model.future_steps.map((step, i) => (
                  <div key={i}>
                    <div className={`hs-pathway-step ${step.change === 'added' ? 'hs-pathway-added' : step.change === 'changed' ? 'hs-pathway-changed' : ''}`}>
                      {step.label}
                    </div>
                    {i < narrative.pathway_model!.future_steps.length - 1 && <div className="hs-pathway-arrow">↓</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. PROJECTED IMPACT — the "so what?" section */}
      <section id="projected-impact" style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>What using {app.app_name} could mean for {app.condition_tags?.includes('cardiac_rehab') ? 'cardiac' : 'COPD'} patients</h2>
        <p className="hs-section-note" style={{ marginBottom: 20 }}>
          Projections based on published evidence applied to your local eligible population. Not a guarantee — a defensible basis for a business case.
        </p>

        {quantifiedClaims.length > 0 ? (
          <div className="hs-chart-section">
            <div className="hs-chart-panel">
              <h3>If {workspaceData.coverage_funnel.eligible.toLocaleString()} eligible patients were enrolled at 75% uptake</h3>
              <HorizontalBarChart
                ariaLabel="Projected impact based on evidence"
                rows={quantifiedClaims.slice(0, 3).map(c => {
                  const isReduction = c.unit === '% reduction' || /fewer|reduction|reduced|avoided/i.test(c.claim_text)
                  const atUptake = workspaceData.coverage_funnel.eligible * 0.75
                  const tangible = Math.round(atUptake * (c.effect_central! / 100))
                  const metricLabel = c.metric ?? 'events'
                  return {
                    label: metricLabel,
                    value: c.effect_central!,
                    displayValue: isReduction
                      ? `≈ ${tangible.toLocaleString()} fewer per year`
                      : `${c.effect_central}${c.unit ? ` ${c.unit}` : '%'}`
                  }
                })}
                maxValue={Math.max(...quantifiedClaims.slice(0, 3).map(c => c.effect_central!)) * 1.3}
              />
              <InsightCallout variant="good" title="What this means">
                {(() => {
                  const primary = quantifiedClaims[0]
                  const eligible = workspaceData.coverage_funnel.eligible
                  const atUptake = Math.round(eligible * 0.75)
                  if (primary.unit === '% reduction') {
                    const avoided = Math.round(atUptake * (primary.effect_central! / 100))
                    return `Evidence shows ${app.app_name} can achieve a ${primary.effect_central}% reduction in ${primary.metric ?? 'activity'}. Applied to 75% of your ${eligible.toLocaleString()} eligible patients, that's approximately ${avoided.toLocaleString()} fewer events per year.`
                  }
                  return `Based on evaluated NHS evidence, ${app.app_name} demonstrates a ${primary.effect_central}% effect on ${primary.metric ?? 'outcomes'}. At 75% uptake of ${eligible.toLocaleString()} eligible patients, this translates to measurable local impact.`
                })()}
              </InsightCallout>
            </div>

            <div className="hs-chart-panel">
              <h3>Local opportunity</h3>
              <div className="hs-kpi-grid" style={{ marginTop: 12 }}>
                <div className="hs-kpi">
                  <div className="hs-kpi-value">{workspaceData.coverage_funnel.eligible.toLocaleString()}</div>
                  <div className="hs-kpi-label">Eligible patients in your area</div>
                </div>
                <div className="hs-kpi">
                  <div className="hs-kpi-value">{Math.round(workspaceData.coverage_funnel.eligible * 0.75).toLocaleString()}</div>
                  <div className="hs-kpi-label">At 75% uptake</div>
                </div>
                <div className="hs-kpi">
                  <div className="hs-kpi-value">{formatGbp(workspaceData.opportunity_value_gbp)}</div>
                  <div className="hs-kpi-label">Modelled annual benefit</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#4c6272', marginTop: 12 }}>
                Based on NHS reference cost tariffs and published effect sizes. Source: {quantifiedClaims[0].source_reference}.
              </p>
            </div>
          </div>
        ) : (
          <div className="hs-chart-panel">
            <div className="hs-kpi-grid">
              <div className="hs-kpi">
                <div className="hs-kpi-value">{workspaceData.coverage_funnel.eligible.toLocaleString()}</div>
                <div className="hs-kpi-label">Eligible patients in your area</div>
              </div>
              <div className="hs-kpi">
                <div className="hs-kpi-value">{formatGbp(workspaceData.opportunity_value_gbp)}</div>
                <div className="hs-kpi-label">Illustrative annual opportunity</div>
              </div>
            </div>
            <InsightCallout variant="warn" title="What do these numbers mean?">
              These represent the population who could benefit from this pathway. Effect sizes from published evidence suggest meaningful reductions in service utilisation, but local impact depends on implementation quality and uptake.
            </InsightCallout>
          </div>
        )}
      </section>

      {/* 4. WHAT IT COULD BE WORTH — economics with Green Book, tariffs, QOF */}
      {(narrative.commissioner_economics || (isCopd && active)) && (
        <section id="economics" style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>What it could be worth</h2>

          {narrative.commissioner_economics && (
            <>
              <p style={{ fontSize: '1.05rem', color: '#212b32', maxWidth: 720, lineHeight: 1.6, marginBottom: 16 }}>
                {narrative.commissioner_economics.headline}
              </p>

              <div className="hs-card-grid" style={{ marginBottom: 24 }}>
                {narrative.commissioner_economics.settings.map((s) => (
                  <div key={s.label} className="hs-card">
                    <h3>{s.label}</h3>
                    {s.net_value_gbp != null && <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0' }}>{formatGbp(s.net_value_gbp)} net</p>}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                      {s.cash_gbp != null && <li style={{ fontSize: 14, marginBottom: 4 }}>Cash releasing: {formatGbp(s.cash_gbp)}</li>}
                      {s.capacity_gbp != null && <li style={{ fontSize: 14, marginBottom: 4 }}>Capacity released: {formatGbp(s.capacity_gbp)}</li>}
                      {s.cost_gbp != null && <li style={{ fontSize: 14, marginBottom: 4 }}>Service cost: {formatGbp(s.cost_gbp)}</li>}
                    </ul>
                    <p style={{ fontSize: 13, color: '#4c6272', marginTop: 12 }}>{s.note}</p>
                  </div>
                ))}
              </div>

              <InsightCallout title="Cash vs capacity vs public value">
                {narrative.commissioner_economics.cash_vs_capacity ?? 'Not all benefits are cash-releasing. Capacity released (e.g. fewer follow-up slots needed) has real value but won\'t appear on your P&L unless you actively close capacity. Green Book methodology values health gains and productivity separately — important for HM Treasury submissions.'}
              </InsightCallout>

              {narrative.commissioner_economics.tariff_note && (
                <div style={{ marginTop: 20, padding: '16px 20px', background: '#f0f4f5', borderRadius: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px' }}>Tariff and QOF implications</h3>
                  <p style={{ fontSize: 14, color: '#4c6272', margin: 0, lineHeight: 1.7 }}>
                    {narrative.commissioner_economics.tariff_note}
                  </p>
                </div>
              )}

              {narrative.commissioner_economics.funding_levers && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Funding levers and tariff alignment</h3>
                  <div className="hs-card-grid">
                    {narrative.commissioner_economics.funding_levers.map((f) => (
                      <div key={f.label} className="hs-card">
                        <h3 style={{ fontSize: 15 }}>{f.label}</h3>
                        <span className="hs-tag hs-tag-green">{f.status}</span>
                        <p style={{ marginTop: 8 }}>{f.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {isCopd && active && (
            <div style={{ marginTop: narrative.commissioner_economics ? 32 : 0 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>Scenario model</h3>
              <p className="hs-section-note">Adjust assumptions to see conservative, central and evidence-led projections.</p>
              <ScenarioControls value={scenario} onChange={setScenario} />
              <div className="hs-kpi-grid" style={{ marginTop: 20 }}>
                {cashBenefits.length > 0 && (
                  <div className="hs-kpi">
                    <div className="hs-kpi-value">{formatGbp(cashBenefits.reduce((s, b) => s + (b.amount_gbp ?? 0), 0))}</div>
                    <div className="hs-kpi-label">Cash releasing</div>
                    <div className="hs-kpi-sub">{cashBenefits[0].label}</div>
                  </div>
                )}
                {capacityBenefits.length > 0 && (
                  <div className="hs-kpi">
                    <div className="hs-kpi-value">{formatGbp(capacityBenefits.reduce((s, b) => s + (b.amount_gbp ?? 0), 0))}</div>
                    <div className="hs-kpi-label">Capacity released</div>
                    <div className="hs-kpi-sub">{capacityBenefits[0].label}</div>
                  </div>
                )}
                {healthBenefit && (
                  <div className="hs-kpi">
                    <div className="hs-kpi-value">{healthBenefit.amount_gbp ? formatGbp(healthBenefit.amount_gbp) : 'Not monetised'}</div>
                    <div className="hs-kpi-label">Health gain (Green Book)</div>
                    <div className="hs-kpi-sub">QALY-based valuation</div>
                  </div>
                )}
                <div className="hs-kpi" style={{ borderTopColor: netPosition >= 0 ? '#007f3b' : '#da291c' }}>
                  <div className="hs-kpi-value" style={{ color: netPosition >= 0 ? '#007f3b' : '#da291c' }}>
                    {formatGbp(netPosition)}
                  </div>
                  <div className="hs-kpi-label">Net annual position</div>
                  <div className="hs-kpi-sub">{active.label} scenario</div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. ASSURANCE AND EVIDENCE — combined section */}
      <section id="assurance" style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>Assurance and evidence</h2>
        <p style={{ fontSize: 15, color: '#4c6272', maxWidth: 720, lineHeight: 1.7, marginBottom: 20 }}>
          The NHS HealthStore has reviewed this product nationally. We certify our confidence in its assurance position based on supplier-provided documentation.
          Your local team retains responsibility for due diligence — we make that faster by providing access to source documents in your workspace once verified.
        </p>

        {narrative.regulatory_position && (
          <div style={{ background: '#f0f6fc', borderRadius: 8, padding: '16px 20px', border: '1px solid #d8dde0', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14 }}><strong>Device classification:</strong> {narrative.regulatory_position.device_class}</span>
              <span style={{ fontSize: 14 }}><strong>HIRA:</strong> {narrative.regulatory_position.hira_status}</span>
            </div>
            {narrative.regulatory_position.assurance_speed_note && (
              <p style={{ margin: '8px 0 0', fontSize: 14, color: '#4c6272' }}>{narrative.regulatory_position.assurance_speed_note}</p>
            )}
          </div>
        )}

        {narrative.assurance_domains && (
          <div className="hs-card-grid" style={{ marginBottom: 24 }}>
            {narrative.assurance_domains.map((d) => {
              const isVerified = d.status === 'verified_current'
              const isReviewDue = d.status === 'verified_review_due' || d.status === 'declared_pending'
              const statusColor = isVerified ? '#007f3b' : isReviewDue ? '#d5840d' : '#da291c'
              const statusBg = isVerified ? '#e6f5ec' : isReviewDue ? '#fef5e6' : '#fdecea'
              return (
                <div key={d.domain} className="hs-card" style={{ borderTop: `3px solid ${statusColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ margin: 0 }}>{d.domain}</h3>
                    <span className="hs-tag" style={{ background: statusBg, color: statusColor, whiteSpace: 'nowrap' }}>{d.status.replace(/_/g, ' ')}</span>
                  </div>
                  <p>{d.summary}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Clinical publications as part of assurance */}
        {(clinicalEvidence.length > 0 || evidenceClaims.length > 0) && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>Clinical publications and evaluations</h3>
            {clinicalEvidence.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {clinicalEvidence.slice(0, 8).map((pub: any) => (
                  <div key={pub.id ?? pub.ref} style={{ padding: '12px 16px', background: '#fff', border: '1px solid #d8dde0', borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#212b32' }}>{pub.ref}</p>
                        {pub.type_label && <span className="hs-tag hs-tag-grey" style={{ marginTop: 4, display: 'inline-block' }}>{pub.type_label}</span>}
                        {pub.sample_size && <span style={{ fontSize: 13, color: '#4c6272', marginLeft: 8 }}>Deployment across {pub.sample_size.toLocaleString()} patients</span>}
                      </div>
                      {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#005eb8', whiteSpace: 'nowrap' }}>View (opens in a new tab)</a>}
                    </div>
                    {pub.outcome && <p style={{ margin: '6px 0 0', fontSize: 13, color: '#4c6272' }}>{pub.outcome}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {evidenceClaims.map((c) => (
                  <div key={c.claim_id} style={{ padding: '12px 16px', background: '#fff', border: '1px solid #d8dde0', borderRadius: 6 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#212b32' }}>{c.claim_text}</p>
                    {c.effect_central != null && (
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#212b32' }}>{c.effect_central}% effect</p>
                    )}
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#4c6272' }}>{c.source_reference} · {c.source_date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {niceRefs.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>NICE guidance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {niceRefs.map((ref: any) => (
                <div key={ref.ref} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px', background: '#f0f4f5', borderRadius: 6 }}>
                  <span className="hs-tag hs-tag-blue">{ref.ref}</span>
                  <span style={{ fontSize: 14, color: '#212b32' }}>{ref.note ?? ref.type} — {ref.date}</span>
                  {ref.url && <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#005eb8', marginLeft: 'auto' }}>View guidance (opens in a new tab)</a>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. IMPLEMENTATION — what's needed at site + supplier support */}
      {narrative.implementation && (
        <section id="implementation" style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>Making it work at your site</h2>
          <p style={{ fontSize: 15, color: '#4c6272', maxWidth: 720, lineHeight: 1.7, marginBottom: 20 }}>
            Successful deployment depends on three things: clinical engagement, systematic patient invitation, and ongoing monitoring.
            Here is what the supplier provides and what your local team needs to organise.
          </p>
          <div className="hs-card-grid" style={{ marginBottom: 24 }}>
            <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
              <h3>Clinical and human wrapper</h3>
              <p>{narrative.implementation.human_wrapper}</p>
            </div>
            <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
              <h3>What you need locally</h3>
              <p>{narrative.implementation.workforce}</p>
            </div>
            <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
              <h3>Timeline to go-live</h3>
              <p>{narrative.implementation.timescale}</p>
            </div>
          </div>
          <InsightCallout title="Supplier support included">
            The supplier provides onboarding, training materials, technical integration support and ongoing account management as part of the standard package.
            The NHS HealthStore brokers the introduction and tracks mobilisation milestones.
          </InsightCallout>
        </section>
      )}

      {/* 7. NHS EXPERIENCE — combined deployment sites and case studies */}
      {(hasDeploymentRegister || hasCaseStudies) && (
        <section id="nhs-experience" style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>NHS experience</h2>

          {hasDeploymentRegister && (() => {
            const icbs = [...new Set(liveSites.map((s) => s.icb).filter(Boolean))]
            return (
              <div style={{ marginBottom: hasCaseStudies ? 24 : 0 }}>
                <p style={{ fontSize: 15, color: '#4c6272', marginBottom: 16 }}>
                  Currently deployed across <strong>{liveSites.length} NHS sites</strong> in <strong>{icbs.length} ICB areas</strong>.
                </p>
                <div className="hs-card-grid">
                  {liveSites.slice(0, 4).map((site, i) => (
                    <div key={i} className="hs-card" style={{ padding: '12px 16px' }}>
                      <h3 style={{ fontSize: 14, margin: '0 0 4px' }}>{site.site}</h3>
                      <p style={{ fontSize: 13, color: '#4c6272', margin: 0 }}>
                        {site.condition}{site.icb ? ` · ${site.icb}` : ''}
                        {site.sample_size ? ` · Deployment across ${site.sample_size.toLocaleString()} patients per year` : ''}
                      </p>
                      {site.outcome_summary && <p style={{ fontSize: 13, color: '#007f3b', margin: '4px 0 0' }}>{site.outcome_summary}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {hasCaseStudies && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 24, marginBottom: 12 }}>Case studies and evaluations</h3>
              <div className="hs-card-grid">
                {((app as any).case_studies as { title: string; setting: string; sample_size?: number; outcome: string; caveat?: string; source?: string }[])
                  .sort((a, b) => (b.sample_size ?? 0) - (a.sample_size ?? 0))
                  .slice(0, 3)
                  .map((cs, i) => (
                    <div key={i} className="hs-card">
                      <h3 style={{ fontSize: 15, marginBottom: 8 }}>{cs.title ?? cs.setting}</h3>
                      {cs.sample_size && <span className="hs-tag hs-tag-blue">Deployment across {cs.sample_size.toLocaleString()} patients</span>}
                      <p style={{ fontSize: 14, color: '#212b32', margin: '8px 0', lineHeight: 1.6 }}>{cs.outcome}</p>
                      {cs.caveat && <p style={{ fontSize: 13, color: '#7a4800', margin: '4px 0' }}>{cs.caveat}</p>}
                      {cs.source && <p style={{ fontSize: 12, color: '#4c6272', margin: '4px 0 0' }}>{cs.source}</p>}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 8. HOW TO BUY */}
      {narrative.commercial_readiness && (
        <section id="commercial" style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>How to buy locally</h2>
          {narrative.commercial_readiness.healthstore_role && (
            <InsightCallout title="The NHS HealthStore's role in procurement">
              {narrative.commercial_readiness.healthstore_role}
            </InsightCallout>
          )}
          <div className="hs-kpi-grid" style={{ marginTop: 20 }}>
            <div className="hs-kpi">
              <div className="hs-kpi-label">Proposition type</div>
              <div className="hs-kpi-value" style={{ fontSize: '1rem' }}>{narrative.commercial_readiness.proposition_type}</div>
            </div>
            <div className="hs-kpi">
              <div className="hs-kpi-label">Recommended route</div>
              <div className="hs-kpi-value" style={{ fontSize: '1rem' }}>{narrative.commercial_readiness.route_status}</div>
            </div>
            <div className="hs-kpi">
              <div className="hs-kpi-label">Buyer pack</div>
              <div className="hs-kpi-value" style={{ fontSize: '1rem' }}>{narrative.commercial_readiness.buyer_pack_status}</div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #d8dde0' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>Ready to proceed?</h2>
        <p style={{ color: '#4c6272', marginBottom: 20, fontSize: 15 }}>
          The NHS HealthStore can assess fit, build a business case, and support your local procurement route.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/products/${app.slug}/support?${qs}`} className="hs-btn hs-btn-primary">Get commissioning support</Link>
          <Link href={`/products?${qs}`} className="hs-btn hs-btn-secondary">Back to all products</Link>
        </div>
      </section>
    </>
  )
}
