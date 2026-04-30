import Image from 'next/image'
import {
  DtacBadge, MaturityBadge, EffortBadge,
  SupervisionBadge, NiceTypeBadge, ConditionTag,
} from '@/components/Badges'
import { STORE_ACCENT } from '@/lib/storeAccent'
import {
  ScaleAndMaturitySection,
  WhatItTakesLocallySection,
  ImpactAndCaseStudiesSection,
  DemoAccessSection,
  TechnicalIntegrationTable,
  CommercialModelAndCostSection,
  IndicativeFinancialContextSection,
  RelatedFundingSection,
  hasWhatItTakesContent,
  shouldShowImpactSection,
  shouldShowDemoAccess,
} from '@/components/AppDetailSections'
import { PdpCommissioningSnapshot } from '@/components/PdpCommissioningSnapshot'
import { PdpReadOnlySection } from '@/components/PdpReadOnlySection'
import { catalogueDemoAvailable } from '@/lib/catalogueCardSignals'
import { getCommissioningSnapshot } from '@/lib/commissioningSnapshot'
import { getCommissionerFacingFunding, getLinkedFunding } from '@/lib/data'
import { DeviceClassDetails } from '@/components/DeviceClassDetails'
import { EvidenceCard, ContextOfUseGrid, NhsIntegrationBadges, ProductHeroDemoBadge } from './pdpBlocks'
import PdpSupplierContactCard from '@/components/PdpSupplierContactCard'

export default function PdpSharedProductBody({
  app,
  allowedKeys,
}: {
  app: any
  allowedKeys: Set<string>
}) {
  const accent = STORE_ACCENT
  const a = allowedKeys

  const rcts = (app.clinical_evidence_detailed ?? []).filter((s: any) => s.type === 'RCT')
  const observational = (app.clinical_evidence_detailed ?? []).filter((s: any) =>
    ['observational', 'real_world', 'service_eval'].includes(s.type),
  )
  const niceAndImpl = (app.clinical_evidence_detailed ?? []).filter((s: any) =>
    ['nice_assessment', 'implementation_science', 'grey_lit', 'evidence_gap'].includes(s.type),
  )

  const linkedFundingIds = app.linked_funding_ids ?? app.funding_ids ?? []
  const commissionerFunding = getCommissionerFacingFunding(linkedFundingIds)
  const allLinkedFunding = getLinkedFunding(linkedFundingIds)
  const commissioningCards = getCommissioningSnapshot(
    app,
    allLinkedFunding.map((f: { id: string; title: string; status: string }) => ({
      id: f.id,
      title: f.title,
      status: f.status,
    })),
  )

  return (
    <>
      {a.has('hero') ? (
        <div className="mb-3 hs-surface-card-sm rounded-2xl bg-white border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-8 pt-8 pb-3">
            <div className="flex flex-col gap-6 items-start">
              <div className="flex-1 w-full min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {app.condition_tags.map((t: string) => (
                    <ConditionTag key={t} tag={t} />
                  ))}
                  <SupervisionBadge model={app.supervision_model} />
                  <MaturityBadge level={app.maturity_level} />
                  {app.nice_guidance_refs
                    .filter((r: any) => r.type !== 'EVA' && r.type !== 'MTG')
                    .map((r: any) => (
                      <a key={r.ref} href={r.url} target="_blank" rel="noopener noreferrer">
                        <NiceTypeBadge type={r.type} />
                      </a>
                    ))}
                  {app.content_confidence && app.content_confidence !== 'Confirmed' && (
                    <span
                      className={`badge ${app.content_confidence === 'Supplier-reported' ? 'badge-blue' : 'badge-amber'}`}
                    >
                      {app.content_confidence}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mb-2">
                  {app.logo_path && (
                    <Image
                      src={app.logo_path}
                      alt={`${app.app_name} logo`}
                      width={48}
                      height={48}
                      className="rounded-lg flex-shrink-0"
                    />
                  )}
                  <div>
                    <h1 className="page-title-h1 mb-1">{app.app_name}</h1>
                    <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>{app.supplier_name}</p>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 'var(--text-body)',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    maxWidth: 640,
                  }}
                >
                  {app.one_line_value_proposition}
                </p>
                <NhsIntegrationBadges app={app} />
                {catalogueDemoAvailable(app) ? (
                  <div className="mt-3 pt-3 border-t flex" style={{ borderColor: 'var(--border)' }}>
                    <ProductHeroDemoBadge app={app} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {a.has('commissioning-snapshot') ? (
        <div className="mb-8">
          <PdpCommissioningSnapshot cards={commissioningCards} />
        </div>
      ) : null}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {a.has('why-it-matters') ? (
            <PdpReadOnlySection
              title="Why it matters locally"
              description="Local commissioning angle: how this product connects to demand, outcomes, and priorities for your population and system."
            >
              <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {app.why_it_matters_locally}
              </p>
              {app.sustainability_highlight && (
                <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: '#E6F5EC', color: '#004B22' }}>
                  🌿 {app.sustainability_highlight}
                </div>
              )}
            </PdpReadOnlySection>
          ) : null}

          {a.has('context-of-use') && app.context_of_use ? (
            <PdpReadOnlySection
              title="Context of use"
              description="Population, pathways, care settings and therapeutic purpose."
            >
              <ContextOfUseGrid app={app} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('scale-and-maturity') ? (
            <PdpReadOnlySection
              title="Scale and maturity"
              description="Deployment reach, evidence posture, and where the product is in use."
            >
              <ScaleAndMaturitySection app={app} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('what-it-takes-locally') && hasWhatItTakesContent(app) ? (
            <PdpReadOnlySection
              title="What it takes locally"
              description="Operational effort, onboarding, training, and prerequisites for a successful deployment."
            >
              <WhatItTakesLocallySection app={app} accent={accent} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('expected-impact') && shouldShowImpactSection(app) ? (
            <PdpReadOnlySection
              title="Expected impact and case studies"
              description="Outcomes commissioners should expect and illustrative deployments. Distinct from the formal clinical evidence record below."
            >
              <ImpactAndCaseStudiesSection app={app} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('clinical-evidence') ? (
            <PdpReadOnlySection
              title="Clinical evidence"
              description="Full evidence record. Links to source publications provided where available."
            >
              <p
                style={{
                  fontSize: 'var(--text-body)',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  marginBottom: 20,
                }}
              >
                {app.evidence_summary}
              </p>

              {rcts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 'var(--text-label)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      color: 'var(--text-muted)',
                      marginBottom: 8,
                    }}
                  >
                    Randomised controlled trials ({rcts.length})
                  </div>
                  {rcts.map((s: any) => (
                    <EvidenceCard key={s.id} study={s} accent={accent} />
                  ))}
                </div>
              )}

              {observational.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 'var(--text-label)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      color: 'var(--text-muted)',
                      marginBottom: 8,
                    }}
                  >
                    Real-world, observational & service evaluation evidence ({observational.length})
                  </div>
                  {observational.map((s: any) => (
                    <EvidenceCard key={s.id} study={s} accent={accent} />
                  ))}
                </div>
              )}

              {niceAndImpl.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 'var(--text-label)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      color: 'var(--text-muted)',
                      marginBottom: 8,
                    }}
                  >
                    NICE assessments, implementation science & other sources ({niceAndImpl.length})
                  </div>
                  {niceAndImpl.map((s: any) => (
                    <EvidenceCard key={s.id} study={s} accent={accent} />
                  ))}
                </div>
              )}
            </PdpReadOnlySection>
          ) : null}

          {a.has('nice-guidance') ? (
            <PdpReadOnlySection
              title="NICE guidance"
              description="NICE publications and programme references linked to this product."
            >
              <div className="space-y-3">
                {app.nice_guidance_refs.map((r: any) => (
                  <div
                    key={r.ref}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: '#F7F9FC', border: '1px solid var(--border)' }}
                  >
                    <NiceTypeBadge type={r.type} />
                    <div>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-sm hover:underline"
                        style={{ color: accent }}
                      >
                        {r.ref} ↗
                      </a>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {r.date}
                        {r.note ? ` · ${r.note}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PdpReadOnlySection>
          ) : null}

          {a.has('data-quality-flags') && app.contradictory_evidence?.length > 0 ? (
            <PdpReadOnlySection
              title="Data quality flags"
              description="Issues identified during review that commissioners should be aware of."
            >
              <div className="space-y-4">
                {app.contradictory_evidence.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border p-4"
                    style={{ background: '#FDECEA', borderColor: '#DA291C33' }}
                  >
                    <div className="font-semibold text-sm mb-2" style={{ color: '#7A1210' }}>
                      {c.domain}
                    </div>
                    <div className="text-xs space-y-1.5" style={{ color: '#5A1010' }}>
                      <div>
                        <strong>Company claim:</strong> {c.claim_a}
                      </div>
                      <div>
                        <strong>Issue:</strong> {c.claim_b}
                      </div>
                      {c.commissioner_impact && (
                        <div className="mt-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.5)' }}>
                          <strong>Commissioner action:</strong> {c.commissioner_impact}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PdpReadOnlySection>
          ) : null}

          {a.has('demo-access') && shouldShowDemoAccess(app) ? (
            <PdpReadOnlySection
              title="Demo access"
              description="How to view the product or request a demonstration."
            >
              <DemoAccessSection app={app} accent={accent} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('nhs-integrations') ? (
            <PdpReadOnlySection
              id="nhs-integrations"
              title="NHS and care system integrations"
              description="Technical integration detail. NHS App, NHS Login and NHS Notify are summarised in the product summary at the top of the page."
            >
              <TechnicalIntegrationTable app={app} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('commercial-model') ? (
            <PdpReadOnlySection
              id="commercial-model"
              title="Commercial model and cost"
              description="How the product is priced, what is included, and how to procure it."
            >
              <CommercialModelAndCostSection app={app} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('indicative-financial') ? (
            <PdpReadOnlySection
              title="Indicative financial context"
              description="Expected benefits, tariff, provider income and ROI considerations for local modelling."
            >
              <IndicativeFinancialContextSection app={app} />
            </PdpReadOnlySection>
          ) : null}

          {a.has('related-funding') ? (
            <PdpReadOnlySection
              id="related-funding"
              title="Related funding opportunities"
              description="Cash or adoption support for commissioners — not supplier R&D or NICE reporting obligations (see NICE guidance)."
            >
              <RelatedFundingSection fundingIds={linkedFundingIds} />
            </PdpReadOnlySection>
          ) : null}
        </div>

        {a.has('sidebar-summary') ? (
          <aside className="space-y-5">
            <div className="hs-surface-card-sm bg-white rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                Quick facts
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Maturity
                  </div>
                  <MaturityBadge level={app.maturity_level} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Local effort
                  </div>
                  <EffortBadge level={app.local_wraparound} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Device class
                  </div>
                  <div style={{ fontWeight: 600 }}>{app.device_class}</div>
                  {app.device_class_note && (
                    <div className="text-xs mt-0.5" style={{ color: '#D5840D' }}>
                      ⚠ {app.device_class_note}
                    </div>
                  )}
                  <DeviceClassDetails deviceClass={app.device_class} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Supervision model
                  </div>
                  <SupervisionBadge model={app.supervision_model} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Target patients
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {app.target_patients}
                  </div>
                </div>
              </div>
            </div>

            <div className="hs-surface-card-sm bg-white rounded-xl border p-5 space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                Assurance
              </div>
              {[
                { label: 'DTAC', val: <DtacBadge status={app.dtac_status} /> },
                { label: 'DCB0129', val: app.dcb0129_status },
                { label: 'GDPR', val: app.gdpr_note?.split('.')[0] },
                { label: 'ISO 27001', val: app.iso27001 },
                { label: 'Cyber Essentials', val: app.cyber_essentials },
                { label: 'DSP Toolkit', val: app.dspt_status },
              ].map(r => (
                <div key={r.label} className="flex items-start gap-2 text-xs">
                  <span className="w-28 flex-shrink-0 font-medium" style={{ color: 'var(--text-muted)' }}>
                    {r.label}
                  </span>
                  {typeof r.val === 'string' ? <span style={{ color: 'var(--text-secondary)' }}>{r.val}</span> : r.val}
                </div>
              ))}
              {app.cyber_notes && (
                <div className="text-xs p-2 rounded mt-2" style={{ background: '#FEF5E6', color: '#7A4800' }}>
                  {app.cyber_notes}
                </div>
              )}
            </div>

            <PdpSupplierContactCard email={app.supplier_contact_email} />

            {app.product_tiers?.length > 0 && (
              <div className="hs-surface-card-sm bg-white rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                  Product tiers
                </div>
                {app.product_tiers.map((t: any) => (
                  <div key={t.tier_name} className="mb-3 last:mb-0">
                    <div className="font-semibold text-sm" style={{ color: accent }}>
                      {t.tier_name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {t.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="hs-surface-card-sm rounded-lg p-4 text-xs"
              style={{
                background: '#F7F9FC',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'var(--text-secondary)' }}>Sources: </strong>
              {app.source_summary}
              <br />
              <br />
              {app.confidence_note}
            </div>
          </aside>
        ) : null}
      </div>
    </>
  )
}
