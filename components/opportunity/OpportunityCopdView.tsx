'use client'

import Link from 'next/link'
import { useState } from 'react'
import LocalContextSelector from '@/components/context/LocalContextSelector'
import ScenarioControls from '@/components/product/ScenarioControls'
import type { CommissionerContext } from '@/lib/context/types'
import type { OpportunityData } from '@/lib/content/productModel'
import type { IcbReferenceData } from '@/lib/content/productModel'
import { contextToSearchParams } from '@/lib/context/types'
import { buildCopdScenarios, getActiveScenario } from '@/lib/scenarios/copdRoi'
import { LUSCII_NARRATIVE } from '@/lib/content/productNarratives'
import type { App } from '@/lib/data'

export default function OpportunityCopdView({
  context,
  opportunity,
  localData,
  products,
}: {
  context: CommissionerContext
  opportunity: OpportunityData
  localData: IcbReferenceData | null
  products: App[]
}) {
  const [scenario, setScenario] = useState(context.scenario_id)
  const qs = contextToSearchParams({ ...context, scenario_id: scenario }).toString()
  const monitored = Math.min(500, Math.round((localData?.high_risk_cohort ?? 500) * 0.03))
  const scenarios = buildCopdScenarios(
    {
      monitored_cohort: monitored,
      discharge_cohort: 500,
      eligible_admissions: localData?.annual_admissions ? Math.min(500, Math.round(localData.annual_admissions * 0.12)) : 500,
    },
    scenario
  )
  const active = getActiveScenario(scenarios, scenario)

  const cashBenefits = active.benefits.filter(b => b.category === 'cash_releasing')
  const capacityBenefits = active.benefits.filter(b => b.category === 'capacity_released')
  const healthBenefit = active.benefits.find(b => b.category === 'health_gain')
  const totalBenefits = active.benefits.reduce((sum, b) => sum + (b.amount_gbp ?? 0), 0)
  const totalCosts = active.costs.reduce((sum, c) => sum + c.amount_gbp, 0)
  const netPosition = totalBenefits - totalCosts

  return (
    <>
      <LocalContextSelector context={context} />

      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '24px 0 8px' }}>{opportunity.condition_label} opportunity</h1>
      <p style={{ color: '#4c6272', fontSize: '1.05rem', maxWidth: 720, marginBottom: 32 }}>
        {opportunity.need_summary}
      </p>

      {/* ─── Local Data KPIs ─── */}
      {localData && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Local denominators</h2>
          <p className="hs-evidence-note" style={{ marginBottom: 12 }}>{localData.data_date} · {localData.source}</p>
          <div className="hs-kpi-grid">
            <div className="hs-kpi">
              <div className="hs-kpi-value">{localData.eligible_cohort.toLocaleString()}</div>
              <div className="hs-kpi-label">Eligible COPD population</div>
            </div>
            <div className="hs-kpi">
              <div className="hs-kpi-value">{(localData.high_risk_cohort ?? 0).toLocaleString()}</div>
              <div className="hs-kpi-label">High-risk cohort</div>
              <div className="hs-kpi-sub">Illustrative</div>
            </div>
            <div className="hs-kpi">
              <div className="hs-kpi-value">{localData.readmission_rate_90d ? `${(localData.readmission_rate_90d * 100).toFixed(1)}%` : '—'}</div>
              <div className="hs-kpi-label">90-day readmission rate</div>
            </div>
            {localData.annual_admissions && (
              <div className="hs-kpi">
                <div className="hs-kpi-value">{localData.annual_admissions.toLocaleString()}</div>
                <div className="hs-kpi-label">Annual COPD admissions</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Why Addressable ─── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Why this is addressable</h2>
        <p style={{ color: '#4c6272', maxWidth: 720 }}>{opportunity.why_addressable}</p>
      </section>

      {/* ─── Pathway change ─── */}
      {LUSCII_NARRATIVE.pathway_model && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Pathway change</h2>
          <div className="hs-pathway-visual">
            <div className="hs-pathway-col hs-pathway-current">
              <h3 className="hs-pathway-heading">Current pathway</h3>
              {LUSCII_NARRATIVE.pathway_model.current_steps.map((step, i) => (
                <div key={i}>
                  <div className="hs-pathway-step">{step.label}</div>
                  {i < LUSCII_NARRATIVE.pathway_model!.current_steps.length - 1 && <div className="hs-pathway-arrow">↓</div>}
                </div>
              ))}
            </div>
            <div className="hs-pathway-divider">→</div>
            <div className="hs-pathway-col hs-pathway-future">
              <h3 className="hs-pathway-heading">With digital therapeutic</h3>
              {LUSCII_NARRATIVE.pathway_model.future_steps.map((step, i) => (
                <div key={i}>
                  <div className={`hs-pathway-step ${step.change === 'added' ? 'hs-pathway-added' : step.change === 'changed' ? 'hs-pathway-changed' : ''}`}>
                    {step.label}
                  </div>
                  {i < LUSCII_NARRATIVE.pathway_model!.future_steps.length - 1 && <div className="hs-pathway-arrow">↓</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Impact Scenarios ─── */}
      <section style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Impact scenarios</h2>
        <ScenarioControls value={scenario} onChange={setScenario} />

        <div className="hs-kpi-grid" style={{ marginTop: 20 }}>
          {cashBenefits.length > 0 && (
            <div className="hs-kpi">
              <div className="hs-kpi-value">£{Math.round(cashBenefits.reduce((s, b) => s + (b.amount_gbp ?? 0), 0) / 1000)}k</div>
              <div className="hs-kpi-label">Cash releasing</div>
              <div className="hs-kpi-sub">{cashBenefits[0].label}</div>
            </div>
          )}
          {capacityBenefits.length > 0 && (
            <div className="hs-kpi">
              <div className="hs-kpi-value">£{Math.round(capacityBenefits.reduce((s, b) => s + (b.amount_gbp ?? 0), 0) / 1000)}k</div>
              <div className="hs-kpi-label">Capacity released</div>
              <div className="hs-kpi-sub">{capacityBenefits[0].label}</div>
            </div>
          )}
          {healthBenefit && (
            <div className="hs-kpi">
              <div className="hs-kpi-value">{healthBenefit.amount_gbp ? `£${Math.round(healthBenefit.amount_gbp / 1000)}k` : 'Not monetised'}</div>
              <div className="hs-kpi-label">Health gain</div>
              <div className="hs-kpi-sub">{healthBenefit.mechanism ?? healthBenefit.label}</div>
            </div>
          )}
          <div className="hs-kpi" style={{ borderTopColor: netPosition >= 0 ? '#007f3b' : '#da291c' }}>
            <div className="hs-kpi-value" style={{ color: netPosition >= 0 ? '#007f3b' : '#da291c' }}>
              £{Math.round(netPosition / 1000)}k
            </div>
            <div className="hs-kpi-label">Net annual position</div>
            <div className="hs-kpi-sub">{active.label} scenario · Cost £{Math.round(totalCosts / 1000)}k</div>
          </div>
        </div>

        {/* Impact metrics from opportunity data */}
        <div style={{ marginTop: 24 }}>
          {opportunity.impact_headline.map((h) => (
            <div key={h.metric} className="hs-impact-bar" style={{ marginBottom: 16 }}>
              <div className="hs-impact-bar-label">{h.metric}</div>
              <div className="hs-impact-bar-track">
                <div className="hs-impact-bar-fill" style={{ width: scenario === 'conservative' ? '25%' : scenario === 'evidence_led' ? '50%' : '40%' }} />
              </div>
              <div className="hs-impact-bar-value">{scenario === 'conservative' ? h.conservative : scenario === 'evidence_led' ? h.evidence_led : h.central}</div>
            </div>
          ))}
        </div>
        <p className="hs-evidence-note">
          <span className="hs-tag hs-tag-grey">Modelled economic</span> Assumptions visible · Not guaranteed savings
        </p>
      </section>

      {/* ─── Relevant products ─── */}
      <section style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Relevant products</h2>
        <div className="hs-card-grid">
          {products.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}?${qs}`} style={{ textDecoration: 'none' }}>
              <div className="hs-card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}>
                <h3 style={{ color: '#005eb8' }}>{p.app_name}</h3>
                <p>Pathway role match for this opportunity</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Commissioning considerations ─── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>Commissioning considerations</h2>
        <div style={{ background: '#f0f4f5', borderRadius: 8, padding: 20 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {opportunity.commissioning_considerations.map((c) => (
              <li key={c} style={{ marginBottom: 8, color: '#212b32', fontSize: 14, lineHeight: 1.6 }}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Actions ─── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/products/luscii?${qs}`} className="hs-btn hs-btn-primary">Open Luscii product story</Link>
        <Link href={`/compare?ids=${products.map(p => p.id).join(',')}&${qs}`} className="hs-btn hs-btn-secondary">Compare propositions</Link>
      </div>
    </>
  )
}
