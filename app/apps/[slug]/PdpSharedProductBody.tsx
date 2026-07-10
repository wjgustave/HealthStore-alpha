import Image from 'next/image'
import {
  DtacBadge, MaturityBadge, EffortBadge,
  SupervisionBadge, NiceTypeBadge,
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
import { getCommissioningSnapshot } from '@/lib/commissioningSnapshot'
import { getCommissionerFacingFunding } from '@/lib/data'
import { getDeploymentRegister } from '@/lib/deploymentRegister'
import { getProductNarrative } from '@/lib/content/productNarratives'
import { splitPdpEvidence } from '@/lib/pdpEvidence'
import PdpClinicalPublications from '@/components/product/PdpClinicalPublications'
import { DeviceClassDetails } from '@/components/DeviceClassDetails'
import { EvidenceCard, ContextOfUseGrid, NhsIntegrationBadges } from './pdpBlocks'
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

  const showNarrativeSpine = getProductNarrative(app.slug) != null
  const hasNhsExperience =
    showNarrativeSpine &&
    (getDeploymentRegister(app).length > 0 || (app.case_studies?.length ?? 0) > 0)
  const evidenceSplit = splitPdpEvidence(app, { showNarrativeSpine, hasNhsExperience })
  const evidenceForTab = evidenceSplit.tab
  const showClinicalPublicationsInTab = !showNarrativeSpine && evidenceSplit.publications.length > 0

  const rcts = evidenceForTab.filter((s: any) => s.type === 'RCT')
  const observational = evidenceForTab.filter((s: any) => ['observational', 'real_world'].includes(s.type))
  const niceAndImpl = evidenceForTab.filter((s: any) =>
    ['nice_assessment', 'implementation_science', 'grey_lit', 'evidence_gap'].includes(s.type),
  )
  const showClinicalEvidenceSection =
    evidenceForTab.length > 0 || (!showNarrativeSpine && evidenceSplit.publications.length === 0)

  const linkedFundingIds = app.linked_funding_ids ?? app.funding_ids ?? []
  const commissionerFunding = getCommissionerFacingFunding(linkedFundingIds)
  const commissioningCards = getCommissioningSnapshot(app)

  return (
    <>
      {a.has('hero') ? (
        <div className="mb-4 overflow-hidden">
            <div className="flex flex-col gap-6 items-start">
              <div className="flex-1 w-full min-w-0">
                <div className="hs-product-hero__identity">
                  {app.logo_path && (
                    <Image
                      src={app.logo_path}
                      alt={`${app.app_name} logo`}
                      width={48}
                      height={48}
                      className="hs-product-hero__logo flex-shrink-0"
                    />
                  )}
                  <div>
                    <h1 className="hs-product-hero__title">{app.app_name}</h1>
                    <p className="hs-product-hero__supplier">{app.supplier_name}</p>
                  </div>
                </div>
                <p className="hs-product-hero__proposition">
                  {app.one_line_value_proposition}
                </p>
                <div className="hs-product-hero__tags">
                  <SupervisionBadge model={app.supervision_model} />
                  <MaturityBadge level={app.maturity_level} hideEstablished />
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
                <NhsIntegrationBadges app={app} />
              </div>
            </div>
        </div>
      ) : null}

      {a.has('commissioning-snapshot') ? (
        <div className="hs-decision-snapshot mb-8">
          <PdpCommissioningSnapshot
            cards={commissioningCards}
            whereLiveApp={app}
          />
        </div>
      ) : null}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {a.has('why-it-matters') ? (
            <PdpReadOnlySection
              title="Why it matters locally"
              description="Local commissioning angle: how this product connects to demand, outcomes, and priorities for your population and system."
            >
              <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {app.why_it_matters_locally}
              </p>
              {app.sustainability_highlight && (
                <div className="mt-4 rounded-lg p-4 hs-text-label" style={{ background: '#E6F5EC', color: '#004B22' }}>
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
            <>
              {showClinicalPublicationsInTab && (
                <PdpReadOnlySection
                  title="Clinical publications and evaluations"
                >
                  <PdpClinicalPublications publications={evidenceSplit.publications} className="" showHeading={false} />
                </PdpReadOnlySection>
              )}

              {showClinicalEvidenceSection ? (
            <PdpReadOnlySection
              title="Clinical evidence"
              description="Full evidence record. Links to source publications provided where available."
            >
              {rcts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 'var(--text-label)',
                      fontWeight: 600,
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
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      color: 'var(--text-muted)',
                      marginBottom: 8,
                    }}
                  >
                    Real-world & observational evidence ({observational.length})
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
                      fontWeight: 600,
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
            </>
          ) : null}

          {a.has('nice-guidance') ? (
            <PdpReadOnlySection
              title="NICE guidance"
              description="NICE publications and programme references linked to this product."
            >
              <ul className="m-0 space-y-2 p-0 list-none">
                {app.nice_guidance_refs.map((r: any) => (
                  <li key={r.ref} className="hs-text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <a href={r.url} className="hover:underline" style={{ color: accent }}>
                      {r.ref}
                    </a>
                    {[r.type, r.date, r.note].filter(Boolean).length > 0 ? (
                      <>
                        {' — '}
                        {[r.type, r.date, r.note].filter(Boolean).join(', ')}
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
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
                    style={{ background: '#FDECEA', borderColor: '#D5281B33' }}
                  >
                    <div className="hs-font-bold hs-text-label mb-2" style={{ color: '#7A1210' }}>
                      {c.domain}
                    </div>
                    <div className="hs-text-caption space-y-2" style={{ color: '#5A1010' }}>
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

          {a.has('related-funding') && commissionerFunding.length > 0 ? (
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
          <aside className="space-y-6">
            <div className="hs-surface-card-sm bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
              <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                Quick facts
              </div>
              <div className="space-y-4 hs-text-label">
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Maturity
                  </div>
                  <MaturityBadge level={app.maturity_level} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Local effort
                  </div>
                  <EffortBadge level={app.local_wraparound} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Device class
                  </div>
                  <div style={{ fontWeight: 600 }}>{app.device_class}</div>
                  {app.device_class_note && (
                    <div className="hs-text-caption mt-1" style={{ color: '#7A4800' }}>
                      ⚠ {app.device_class_note}
                    </div>
                  )}
                  <DeviceClassDetails deviceClass={app.device_class} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Supervision model
                  </div>
                  <SupervisionBadge model={app.supervision_model} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                    Target patients
                  </div>
                  <div className="hs-text-caption" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {app.target_patients}
                  </div>
                </div>
              </div>
            </div>

            <div className="hs-surface-card-sm bg-white rounded-xl border p-6 space-y-4" style={{ borderColor: 'var(--border)' }}>
              <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
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
                <div key={r.label} className="flex items-start gap-2 hs-text-caption">
                  <span className="w-28 flex-shrink-0 hs-font-normal" style={{ color: 'var(--text-muted)' }}>
                    {r.label}
                  </span>
                  {typeof r.val === 'string' ? <span style={{ color: 'var(--text-secondary)' }}>{r.val}</span> : r.val}
                </div>
              ))}
              {app.cyber_notes && (
                <div className="hs-text-caption p-2 rounded mt-2" style={{ background: '#FEF5E6', color: '#7A4800' }}>
                  {app.cyber_notes}
                </div>
              )}
            </div>

            <PdpSupplierContactCard email={app.supplier_contact_email} />

            {app.product_tiers?.length > 0 && (
              <div className="hs-surface-card-sm bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
                <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                  Product tiers
                </div>
                {app.product_tiers.map((t: any) => (
                  <div key={t.tier_name} className="mb-4 last:mb-0">
                    <div className="hs-font-bold hs-text-label" style={{ color: accent }}>
                      {t.tier_name}
                    </div>
                    <div className="hs-text-caption mt-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {t.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="hs-surface-card-sm rounded-lg p-4 hs-text-caption"
              style={{
                background: '#F0F4F5',
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
