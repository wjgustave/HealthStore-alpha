'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  CoverageSankey,
  RetentionCurve,
  BenchmarkRange,
  InsightCallout,
} from '@/components/charts'
import type { WorkspaceIcbData, WorkspaceDeployment } from '@/lib/localData/workspaceData'
import type { CommissionerContext } from '@/lib/context/types'

type CaseSummary = {
  reference: string
  status: string
  nextAction: string
  ownerQueue: string
  productName?: string
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'performance', label: 'Performance' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'assurance', label: 'Assurance docs' },
  { id: 'cases', label: 'Cases' },
] as const

type TabId = typeof TABS[number]['id']

function StatusTag({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    live: { bg: '#cce3d4', color: '#005a30' },
    mobilising: { bg: '#fff2c2', color: '#594d00' },
    submitted: { bg: '#e8edee', color: '#425563' },
    paused: { bg: '#fef5e6', color: '#7a4800' },
  }
  const c = colors[status] ?? colors.submitted
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', fontSize: 12, fontWeight: 600, background: c.bg, color: c.color, borderRadius: 3 }}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default function WorkspaceClient({
  orgName,
  context,
  workspaceData,
  cases,
  hasDeployments,
}: {
  orgName: string
  context: CommissionerContext
  workspaceData: WorkspaceIcbData
  cases: CaseSummary[]
  hasDeployments: boolean
}) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const funnel = workspaceData.coverage_funnel
  const b = workspaceData.benchmarks
  const deployments = workspaceData.deployments
  const liveDeployments = deployments.filter(d => d.status === 'live')
  const totalActive = liveDeployments.reduce((sum, d) => sum + (d.active_users || 0), 0)
  const totalInvited = liveDeployments.reduce((sum, d) => sum + (d.detail.invited || 0), 0)
  const totalRegistered = liveDeployments.reduce((sum, d) => sum + (d.detail.registered || 0), 0)
  const avgCompletion = liveDeployments.filter(d => d.detail.completion_rate != null).length > 0
    ? Math.round(liveDeployments.filter(d => d.detail.completion_rate != null).reduce((sum, d) => sum + (d.detail.completion_rate || 0), 0) / liveDeployments.filter(d => d.detail.completion_rate != null).length)
    : null
  const onTrack = liveDeployments.filter(d => d.vs_target_pct != null && d.vs_target_pct >= 0).length
  const needsAttention = liveDeployments.filter(d => d.vs_target_pct != null && d.vs_target_pct < 0).length

  const sankeyStages = [
    { label: 'Eligible', value: funnel.eligible },
    { label: 'Invited', value: funnel.invited || totalInvited },
    { label: 'Registered', value: funnel.registered || totalRegistered },
    { label: 'Active', value: funnel.active || totalActive },
  ].filter(s => s.value > 0)

  return (
    <>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 4px' }}>Your DTx programme</h1>
      <p style={{ fontSize: '1.05rem', color: '#4c6272', marginBottom: 24 }}>
        {orgName} · {context.geography_label}
      </p>

      {/* Tab nav */}
      <nav className="hs-tabs__list" role="tablist" aria-label="Workspace sections" style={{ marginBottom: 28 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className="hs-tabs__tab"
            style={activeTab === tab.id ? { color: '#212b32', borderBottomColor: '#005eb8', background: '#fff' } : undefined}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'cases' && cases.length > 0 && (
              <span style={{ marginLeft: 6, background: '#005eb8', color: '#fff', fontSize: 11, padding: '1px 6px', borderRadius: 8 }}>{cases.length}</span>
            )}
            {tab.id === 'deployments' && needsAttention > 0 && (
              <span style={{ marginLeft: 6, background: '#d5281b', color: '#fff', fontSize: 11, padding: '1px 6px', borderRadius: 8 }}>{needsAttention}</span>
            )}
          </button>
        ))}
      </nav>

      {/* ═══ Overview ═══ */}
      {activeTab === 'overview' && (
        <>
          {/* Portfolio-level narrative */}
          {!hasDeployments ? (
            <section style={{ marginBottom: 32 }}>
              <InsightCallout title="Getting started">
                You have no active DTx deployments yet. Use the opportunity explorer to understand local unmet need and find assured products.
              </InsightCallout>
              <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/opportunities" className="hs-btn hs-btn-primary">Explore opportunities</Link>
                <Link href="/products" className="hs-btn hs-btn-secondary">Browse products</Link>
              </div>
            </section>
          ) : (
            <>
              {/* Aggregate programme headline */}
              <section style={{ marginBottom: 32 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 20 }}>
                  <div className="hs-kpi">
                    <div className="hs-kpi-value">{workspaceData.kpis.live_deployments}</div>
                    <div className="hs-kpi-label">Live products</div>
                  </div>
                  <div className="hs-kpi">
                    <div className="hs-kpi-value">{totalActive.toLocaleString()}</div>
                    <div className="hs-kpi-label">Active users (all products)</div>
                  </div>
                  <div className="hs-kpi">
                    <div className="hs-kpi-value">{workspaceData.kpis.eligible_reached_pct}%</div>
                    <div className="hs-kpi-label">Eligible population reached</div>
                  </div>
                  <div className="hs-kpi">
                    <div className="hs-kpi-value">{onTrack} of {liveDeployments.length}</div>
                    <div className="hs-kpi-label">On or above target</div>
                  </div>
                </div>

                {/* One-line programme assessment */}
                {needsAttention > 0 ? (
                  <p style={{ fontSize: 15, color: '#212b32', lineHeight: 1.7, margin: 0 }}>
                    <strong>{needsAttention} deployment{needsAttention > 1 ? 's' : ''} need{needsAttention === 1 ? 's' : ''} attention</strong> — below target on registration or activation.
                    {onTrack > 0 && ` ${onTrack} product${onTrack > 1 ? 's are' : ' is'} performing well.`}
                    {' '}The biggest overall lever is expanding invitation reach: only {workspaceData.kpis.eligible_reached_pct}% of your eligible population has been invited.
                  </p>
                ) : (
                  <p style={{ fontSize: 15, color: '#004b22', lineHeight: 1.7, margin: 0 }}>
                    <strong>All deployments tracking at or above target.</strong> Focus on expanding invitation reach to grow the overall programme — currently {workspaceData.kpis.eligible_reached_pct}% of eligible population.
                  </p>
                )}
              </section>

              {/* Coverage flow */}
              {sankeyStages.length >= 2 && (
                <section style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>Population coverage (all products combined)</h2>
                  <CoverageSankey stages={sankeyStages} ariaLabel="Aggregate coverage flow across all deployments" />
                </section>
              )}

              {/* Quick actions */}
              <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/opportunities" className="hs-btn hs-btn-primary">Explore new opportunities</Link>
                <Link href="/products" className="hs-btn hs-btn-secondary">Browse products</Link>
              </section>
            </>
          )}
        </>
      )}

      {/* ═══ Deployments ═══ */}
      {activeTab === 'deployments' && (
        <>
          {/* Portfolio summary first */}
          <section style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 15, color: '#212b32', margin: '0 0 16px', lineHeight: 1.6 }}>
              {liveDeployments.length} live product{liveDeployments.length !== 1 ? 's' : ''} across {new Set(deployments.map(d => (d as any).conditionId || d.pathway)).size} pathways.
              {avgCompletion != null && ` Average completion rate: ${avgCompletion}%.`}
              {' '}Overall programme utilisation: {workspaceData.kpis.contract_utilisation_pct}%.
            </p>
          </section>

          {/* Per-deployment detail */}
          <section>
            {deployments.map((d) => (
              <div key={d.id} style={{ background: '#fff', border: '1px solid #d8dde0', borderRadius: 8, padding: '20px 24px', marginBottom: 16, borderLeft: `4px solid ${d.vs_target_pct != null && d.vs_target_pct < 0 ? '#d5281b' : d.status === 'mobilising' ? '#ffb81c' : '#007f3b'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{d.product}</h3>
                  <StatusTag status={d.status} />
                  <span style={{ fontSize: 12, color: '#768692' }}>{d.pathway}</span>
                  {d.route !== 'HealthStore' && <span style={{ fontSize: 11, color: '#768692', background: '#f0f4f5', padding: '1px 6px', borderRadius: 3 }}>{d.route.replace(/_/g, ' ')}</span>}
                </div>

                {d.active_users > 0 && (
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14, color: '#4c6272', marginBottom: 8 }}>
                    <span><strong>{d.active_users}</strong> active</span>
                    {d.detail.invited != null && <span><strong>{d.detail.invited.toLocaleString()}</strong> invited</span>}
                    {d.detail.registered_pct != null && <span><strong>{d.detail.registered_pct}%</strong> registration</span>}
                    {d.detail.completion_rate != null && <span><strong>{d.detail.completion_rate}%</strong> completion</span>}
                    {d.vs_target_pct != null && (
                      <span style={{ color: d.vs_target_pct >= 0 ? '#007f3b' : '#d5281b', fontWeight: 600 }}>
                        {d.vs_target_pct >= 0 ? '+' : ''}{d.vs_target_pct}% vs target
                      </span>
                    )}
                  </div>
                )}

                <p style={{ margin: 0, fontSize: 14, color: '#4c6272', lineHeight: 1.6 }}>{d.detail.insight}</p>

                {d.detail.data_completeness != null && d.detail.data_completeness < 80 && (
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#7a4800' }}>Data completeness: {d.detail.data_completeness}% — below minimum threshold for outcome reporting.</p>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      {/* ═══ Performance ═══ */}
      {activeTab === 'performance' && (
        <>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Are users staying? (retention)</h2>
            {workspaceData.retention ? (
              <>
                <RetentionCurve
                  ariaLabel="User retention over time"
                  you={workspaceData.retention.you}
                  pooled={workspaceData.retention.pooled}
                  youLabel="Your programme"
                  pooledLabel="National comparable"
                />
                <p style={{ fontSize: 14, color: '#4c6272', marginTop: 12 }}>
                  Your programme retains {workspaceData.retention.you[workspaceData.retention.you.length - 1]?.value ?? '—'}% at {workspaceData.retention.you[workspaceData.retention.you.length - 1]?.day ?? '—'} days vs {workspaceData.retention.pooled[workspaceData.retention.pooled.length - 1]?.value ?? '—'}% national average.
                </p>
              </>
            ) : (
              <p style={{ color: '#4c6272' }}>Retention data not yet available.</p>
            )}
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>How you compare (registration rate)</h2>
            <BenchmarkRange
              ariaLabel="Registration rate vs peers"
              p10={b.registration_rate.p10}
              p90={b.registration_rate.p90}
              median={b.registration_rate.median}
              you={b.registration_rate.you}
              youLabel={b.registration_rate.you != null ? `You: ${b.registration_rate.you}%` : undefined}
              percentileLabel={b.registration_rate.percentile != null ? `P${b.registration_rate.percentile} of comparable ICBs` : 'Peer range'}
            />
          </section>
        </>
      )}

      {/* ═══ Benefits ═══ */}
      {activeTab === 'benefits' && (
        <section>
          <p style={{ fontSize: 15, color: '#212b32', lineHeight: 1.7, marginBottom: 24, maxWidth: 680 }}>
            Benefits are categorised by how they were measured. Only <strong>observed</strong> and <strong>evaluated</strong> benefits count as realised. Modelled figures are planning inputs, not actuals.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <BenefitCard
              title="Observed (your local data)"
              colour="#007f3b"
              content={workspaceData.monthly_admissions?.length
                ? `${Math.round(((workspaceData.monthly_admissions[0].baseline - workspaceData.monthly_admissions[workspaceData.monthly_admissions.length - 1].with_dtx) / workspaceData.monthly_admissions[0].baseline) * 100)}% reduction in COPD admissions over ${workspaceData.monthly_admissions.length} months`
                : 'No observed benefit data yet available'}
              caveat="Pre/post comparison — not causal attribution"
            />
            <BenefitCard
              title="Evaluated (independent)"
              colour="#005eb8"
              content="Luscii COPD: 30-48% admission reduction (Bradford RWE). Other products: evaluation pending."
              caveat="Independent evaluation with comparator"
            />
            <BenefitCard
              title="Modelled (planning)"
              colour="#768692"
              content={`£${(workspaceData.opportunity_value_gbp / 1000).toFixed(0)}k illustrative annual opportunity (central scenario)`}
              caveat="Forward-looking estimate. Use for business case, not reporting."
            />
            <BenefitCard
              title="Capacity released"
              colour="#330072"
              content="Not yet calculated. Requires activity-level data linkage to quantify bed-days and appointments freed."
              caveat="Board decision required to extract budget"
            />
          </div>
        </section>
      )}

      {/* ═══ Assurance docs ═══ */}
      {activeTab === 'assurance' && (
        <section>
          <p style={{ fontSize: 15, color: '#212b32', lineHeight: 1.7, marginBottom: 8, maxWidth: 680 }}>
            HealthStore has nationally reviewed the assurance position of each product in your estate. Below are supplier-provided documents for your local due diligence.
          </p>
          <p style={{ fontSize: 13, color: '#7a4800', marginBottom: 24 }}>
            These documents are provided by the supplier and certified by HealthStore as current at the time of review. Your organisation retains clinical safety and IG accountability — these support, not replace, local governance.
          </p>
          {liveDeployments.length === 0 ? (
            <InsightCallout title="No deployments">No active deployments to show assurance documents for.</InsightCallout>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {liveDeployments.map((d) => (
                <div key={d.id} style={{ background: '#fff', border: '1px solid #d8dde0', borderRadius: 8, padding: '20px 24px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>{d.product}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    <AssuranceDocRow label="Clinical Safety Case (DCB0129)" status="available" />
                    <AssuranceDocRow label="DTAC Assessment" status="available" />
                    <AssuranceDocRow label="DPIA (Data Protection Impact Assessment)" status="available" />
                    <AssuranceDocRow label="Data Processing Agreement" status="available" />
                    <AssuranceDocRow label="ISO 27001 Certificate" status="request" />
                    <AssuranceDocRow label="Penetration Test Summary" status="request" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══ Cases ═══ */}
      {activeTab === 'cases' && (
        <section>
          {cases.length === 0 ? (
            <p style={{ color: '#4c6272', fontSize: 14 }}>No active commissioning cases. Request support from a product page to start one.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cases.map((c) => (
                <div key={c.reference} style={{ background: '#fff', border: '1px solid #d8dde0', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 120 }}>
                    <strong style={{ color: '#005eb8' }}>{c.reference}</strong>
                  </div>
                  <StatusTag status={c.status} />
                  <span style={{ fontSize: 14, color: '#4c6272' }}>{c.productName ?? 'General enquiry'}</span>
                  <span style={{ fontSize: 13, color: '#4c6272', marginLeft: 'auto' }}>{c.nextAction}</span>
                  <Link href={`/workspace/cases/${c.reference}`} style={{ fontSize: 13, color: '#005eb8' }}>View →</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}

function BenefitCard({ title, colour, content, caveat }: { title: string; colour: string; content: string; caveat: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #d8dde0', borderLeft: `4px solid ${colour}`, borderRadius: 8, padding: '20px' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4c6272', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{title}</h3>
      <p style={{ margin: '0 0 8px', fontSize: 15, color: '#212b32', lineHeight: 1.5 }}>{content}</p>
      <p style={{ margin: 0, fontSize: 12, color: '#768692' }}>{caveat}</p>
    </div>
  )
}

function AssuranceDocRow({ label, status }: { label: string; status: 'available' | 'request' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f0f4f5', borderRadius: 6, gap: 12 }}>
      <span style={{ fontSize: 14, color: '#212b32' }}>{label}</span>
      {status === 'available' ? (
        <button type="button" style={{ fontSize: 13, color: '#005eb8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Download ↓
        </button>
      ) : (
        <span style={{ fontSize: 12, color: '#768692', whiteSpace: 'nowrap' }}>Request from supplier</span>
      )}
    </div>
  )
}
