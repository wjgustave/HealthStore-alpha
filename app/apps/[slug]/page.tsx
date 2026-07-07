import { getAllAppsUnfiltered, getAppBySlug, getCommissionerFacingFunding, getLinkedFunding } from '@/lib/data'
import { getCommissioningSnapshot, getFundingSnapshotCard } from '@/lib/commissioningSnapshot'
import { getDeploymentRegister } from '@/lib/deploymentRegister'
import { resolveProductNarrative, getProductNarrative } from '@/lib/content/productNarratives'
import PdpNarrativeSpine from '@/components/product/PdpNarrativeSpine'
import PdpLocalValue from '@/components/product/PdpLocalValue'
import PdpAssurancePassport from '@/components/product/PdpAssurancePassport'
import PdpImplementation from '@/components/product/PdpImplementation'
import PdpNhsExperience from '@/components/product/PdpNhsExperience'
import { getServerContext } from '@/lib/context/serverContext'
import { PdpCommissioningSnapshot } from '@/components/PdpCommissioningSnapshot'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  DtacBadge, MaturityBadge, EffortBadge,
  SupervisionBadge, NiceTypeBadge, AlertBox
} from '@/components/Badges'
import AppDetailClient from './AppDetailClient'
import { CompareToggleButton } from '@/components/CompareToggleButton'
import { SaveToggleButton } from '@/components/SaveToggleButton'
import { STORE_ACCENT } from '@/lib/storeAccent'
import {
  ScaleAndMaturitySection,
  WhatItTakesLocallySection,
  ImpactAndCaseStudiesSection,
  TechnicalIntegrationTable,
  CommercialModelAndCostSection,
  IndicativeFinancialContextSection,
  RelatedFundingSection,
  hasWhatItTakesContent,
  shouldShowImpactSection,
} from '@/components/AppDetailSections'
import { PdpSection } from '@/components/PdpSection'
import { PdpTabs, type PdpTab } from '@/components/PdpTabs'
import { PdpSharePrintProvider, PdpShareRegion } from '@/components/PdpSharePrintContext'
import { SharePagePanel } from '@/components/SharePagePanel'
import { DeviceClassDetails } from '@/components/DeviceClassDetails'
import { EvidenceCard, ProductHeroDemoBadge } from './pdpBlocks'
import { ExpressInterestWhiteButton } from '@/components/ExpressInterestWhiteButton'
import { Button } from '@/components/ui/Button'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import PdpSupplierContactCard from '@/components/PdpSupplierContactCard'
import { getSession } from '@/lib/session'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'
import { getExpressionOfInterestPrefill } from '@/lib/expressionOfInterestPrefill'
import PdpOnThisPage from '@/components/PdpOnThisPage'
import { buildPdpOnThisPageLinks } from '@/lib/pdpOnThisPage'

export async function generateStaticParams() {
  return getAllAppsUnfiltered().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  return { title: app ? `${app.app_name} — HealthStore` : 'Not found' }
}

export default async function AppPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()

  // Round 2 content migration: commissioner context drives the personalised
  // local-value block. Prefer the guided-start cookie; only honour URL params
  // when an explicit geography override is present so unrelated query strings
  // (share tokens etc.) don't reset personalisation to the national baseline.
  const sp = await searchParams
  const commissionerContext = await getServerContext(
    typeof sp?.geo === 'string' ? sp : undefined
  )

  const session = await getSession()
  const commissioningOrganisationLabel = getCommissioningContextLabel(session)
  const contactPrefill = getExpressionOfInterestPrefill(session, commissioningOrganisationLabel)

  const accent = STORE_ACCENT
  const showPdpFactsGrid = false

  // Content migration (hybrid page): fold the curated narrative spine onto the canonical PDP.
  // Round 3 (R3-4 D) replaces the Luscii-only gate with data-driven gating: any product with a
  // curated narrative gets the spine + assurance passport; the local-value block self-gates to
  // COPD, and other products keep the reference-only layout.
  const narrative = resolveProductNarrative(slug, app)
  const showNarrativeSpine = getProductNarrative(slug) != null
  const heroProposition =
    (showNarrativeSpine && narrative.decision_summary?.one_line_proposition) || app.one_line_value_proposition

  // R4-3 B: hero quick-facts stack (NICE guidance / HealthStore status),
  // rendered vertically on the right of the hero for curated products.
  const heroNiceRefs = app.nice_guidance_refs ?? []
  const heroQuickFacts = showNarrativeSpine
    ? [
        { label: 'NICE guidance', value: heroNiceRefs.length > 0 ? heroNiceRefs[0].ref : null },
        { label: 'HealthStore status', value: narrative.commercial_readiness?.commercial_status ?? 'Under review' },
      ].filter((f) => !!f.value)
    : []

  const linkedFundingIds = app.linked_funding_ids ?? app.funding_ids ?? []
  const commissionerFunding = getCommissionerFacingFunding(linkedFundingIds)
  const allLinkedFunding = getLinkedFunding(linkedFundingIds)
  const fundingRows = allLinkedFunding.map((f: { id: string; title: string; status: string }) => ({
    id: f.id,
    title: f.title,
    status: f.status,
  }))
  const commissioningCards = getCommissioningSnapshot(app)
  const fundingSnapshotCard = getFundingSnapshotCard(app, fundingRows)
  const showLocalValue = showNarrativeSpine && (app.condition_tags?.includes('copd') ?? false)
  const hasNhsExperience =
    showNarrativeSpine &&
    (getDeploymentRegister(app).length > 0 || (app.case_studies?.length ?? 0) > 0)
  // When the NHS experience section is shown, case studies move out of the Evidence
  // tab; the "expected impact" section should then only render for prose/videos.
  const hasImpactProse = !!(app.expected_benefit_note && String(app.expected_benefit_note).trim())
  const hasProductVideos = (app.product_videos?.length ?? 0) > 0
  const showExpectedImpactSection = hasNhsExperience
    ? hasImpactProse || hasProductVideos
    : shouldShowImpactSection(app)

  // Narrative products surface peer-reviewed studies in the NHS experience section
  // (Case studies and evaluations), so exclude them from the Clinical evidence tab
  // to avoid duplication. Non-narrative products keep the full record in the tab.
  const evidenceForTab = hasNhsExperience
    ? (app.clinical_evidence_detailed ?? []).filter((s: any) => !s.peer_reviewed)
    : (app.clinical_evidence_detailed ?? [])
  const rcts = evidenceForTab.filter((s: any) => s.type === 'RCT')
  const observational = evidenceForTab.filter((s: any) => ['observational', 'real_world', 'service_eval'].includes(s.type))
  const niceAndImpl = evidenceForTab.filter((s: any) => ['nice_assessment', 'implementation_science', 'grey_lit', 'evidence_gap'].includes(s.type))

  const onThisPageLinks = buildPdpOnThisPageLinks({
    app,
    narrative: showNarrativeSpine ? narrative : null,
    showNarrativeSpine,
    showLocalValue,
    hasLinkedFunding: linkedFundingIds.length > 0,
  })

  const hasPdpAlerts =
    !!app.clinical_safety_alert ||
    app.dtac_status === 'required_not_confirmed'

  const tabs: PdpTab[] = [
    {
      id: 'evidence',
      label: 'Clinical evidence & outcomes',
      anchors: ['clinical-evidence'],
      panel: (
        <>
          {showExpectedImpactSection && (
            <PdpSection
          shareKey="expected-impact"
              title={hasNhsExperience ? 'Expected impact' : 'Expected impact and case studies'}
              description="Outcomes commissioners should expect and illustrative deployments. Distinct from the formal clinical evidence record below."
            >
              <ImpactAndCaseStudiesSection app={app} showCaseStudies={!hasNhsExperience} />
            </PdpSection>
          )}

          <PdpSection
            id="clinical-evidence"
            shareKey="clinical-evidence"
            title="Clinical evidence"
            description="Full evidence record. Links to source publications provided where available."
          >
            {rcts.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Randomised controlled trials ({rcts.length})
                </div>
                {rcts.map((s: any) => <EvidenceCard key={s.id} study={s} accent={accent} />)}
              </div>
            )}

            {observational.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Real-world, observational & service evaluation evidence ({observational.length})
                </div>
                {observational.map((s: any) => <EvidenceCard key={s.id} study={s} accent={accent} />)}
              </div>
            )}

            {niceAndImpl.length > 0 && (
              <div>
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>
                  NICE assessments, implementation science & other sources ({niceAndImpl.length})
                </div>
                {niceAndImpl.map((s: any) => <EvidenceCard key={s.id} study={s} accent={accent} />)}
              </div>
            )}

            {rcts.length === 0 && observational.length === 0 && niceAndImpl.length === 0 && (
              <p className="hs-text-label m-0" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                No individual study records are currently listed for this product.
              </p>
            )}
          </PdpSection>

          <PdpSection
            shareKey="nice-guidance"
            title="NICE guidance"
            description="NICE publications and programme references linked to this product."
          >
            <div className="space-y-4">
              {app.nice_guidance_refs.map((r: any) => (
                <div key={r.ref} className="flex items-start gap-4 p-4 rounded-lg" style={{ background: '#F0F4F5', border: '1px solid var(--border)' }}>
                  <NiceTypeBadge type={r.type} />
                  <div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="hs-font-bold hs-text-label hover:underline" style={{ color: accent }}>
                      {r.ref} ↗
                    </a>
                    <div className="hs-text-caption mt-1" style={{ color: 'var(--text-muted)' }}>
                      {r.date}{r.note ? ` · ${r.note}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PdpSection>

          {app.contradictory_evidence?.length > 0 && (
            <PdpSection
          shareKey="data-quality-flags"
              title="Data quality flags"
              description="Issues identified during review that commissioners should be aware of."
            >
              <div className="space-y-4">
                {app.contradictory_evidence.map((c: any, i: number) => (
                  <div key={i} className="rounded-xl border p-4" style={{ background: '#FDECEA', borderColor: '#D5281B33' }}>
                    <div className="hs-font-bold hs-text-label mb-2" style={{ color: '#7A1210' }}>{c.domain}</div>
                    <div className="hs-text-caption space-y-2" style={{ color: '#5A1010' }}>
                      <div><strong>Company claim:</strong> {c.claim_a}</div>
                      <div><strong>Issue:</strong> {c.claim_b}</div>
                      {c.commissioner_impact && (
                        <div className="mt-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.5)' }}>
                          <strong>Commissioner action:</strong> {c.commissioner_impact}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PdpSection>
          )}
        </>
      ),
    },
    {
      id: 'deployment',
      label: 'Deployment & adoption',
      anchors: ['scale-and-maturity'],
      panel: (
        <>
          <PdpSection
            id="scale-and-maturity"
            shareKey="scale-and-maturity"
            title="Scale and maturity"
            description="Deployment reach, evidence posture, and where the product is in use."
          >
            <ScaleAndMaturitySection app={app} showDeploymentRegister={!hasNhsExperience} />
          </PdpSection>

          {hasWhatItTakesContent(app) && (
            <PdpSection
          shareKey="what-it-takes-locally"
              title="What it takes locally"
              description="Operational effort, onboarding, training, and prerequisites for a successful deployment."
            >
              <WhatItTakesLocallySection app={app} accent={accent} />
            </PdpSection>
          )}
        </>
      ),
    },
    {
      id: 'commercial',
      label: 'Commercial, cost & funding',
      anchors: ['commercial-model', 'related-funding'],
      panel: (
        <>
          <PdpSection
            id="commercial-model"
            shareKey="commercial-model"
            title="Commercial model and cost"
            description="How the product is priced, what is included, and how to procure it."
          >
            <CommercialModelAndCostSection app={app} />
          </PdpSection>

          <PdpSection
            shareKey="indicative-financial"
            title="Indicative financial context"
            description="Expected benefits, tariff, provider income and ROI considerations for local modelling."
          >
            <IndicativeFinancialContextSection app={app} />
          </PdpSection>

          <PdpSection
            id="related-funding"
            shareKey="related-funding"
            title="Related funding opportunities"
            description="Cash or adoption support for commissioners — not supplier R&D or NICE reporting obligations (see NICE guidance)."
          >
            <RelatedFundingSection fundingIds={linkedFundingIds} />
          </PdpSection>
        </>
      ),
    },
    {
      id: 'technical',
      label: 'Technical & integration',
      anchors: ['nhs-integrations'],
      panel: (
        <PdpSection
          id="nhs-integrations"
          shareKey="nhs-integrations"
          title="NHS and care system integrations"
          description="Technical integration detail. NHS App, NHS Login and NHS Notify are summarised in the product summary at the top of the page."
        >
          <TechnicalIntegrationTable app={app} />
        </PdpSection>
      ),
    },
  ]

  return (
    <AppDetailClient app={app} contactPrefill={contactPrefill}>
      <div className="hs-page">

        <PdpSharePrintProvider>
        <PdpShareRegion shareKey="breadcrumb" label="Browse trail" excludeFromShareUi className="mb-4">
          <PageBreadcrumb
            items={[
              { label: 'Find apps', href: '/apps' },
              { label: 'Condition catalogue', href: '/apps/condition-catalogue' },
              { label: app.app_name },
            ]}
          />
        </PdpShareRegion>

        <PdpShareRegion
          shareKey="hero"
          label="DTx app summary"
          description="Supplier, proposition, and actions."
          className="mb-4"
        >
        <div className="hs-surface-card-sm rounded-t-2xl bg-white border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-8 pt-8 pb-4">
            <div className="flex flex-col gap-6 items-start lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="flex-1 w-full min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  {app.logo_path && (
                    <Image src={app.logo_path} alt={`${app.app_name} logo`} width={48} height={48}
                      className="rounded-lg flex-shrink-0" />
                  )}
                  <div>
                    <h1 className="page-title-h1 mb-1">{app.app_name}</h1>
                    <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>{app.supplier_name}</p>
                  </div>
                </div>
                <p
                  className="min-w-0 max-w-[640px] mb-4"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}
                >
                  {heroProposition}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <MaturityBadge level={app.maturity_level} hideEstablished />
                  {app.content_confidence && app.content_confidence !== 'Confirmed' && (
                    <span className={`badge ${app.content_confidence === 'Supplier-reported' ? 'badge-blue' : 'badge-amber'}`}>
                      {app.content_confidence}
                    </span>
                  )}
                  <ProductHeroDemoBadge app={app} />
                </div>
              </div>
              {heroQuickFacts.length > 0 && (
                <aside
                  className="w-full lg:w-56 shrink-0 lg:border-l lg:pl-6 flex flex-col gap-4"
                  style={{ borderColor: 'var(--border)' }}
                  aria-label="Product quick facts"
                >
                  {heroQuickFacts.map((f) => (
                    <div key={f.label}>
                      <div
                        className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {f.label}
                      </div>
                      <div className="hs-text-label hs-font-bold" style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {f.value}
                      </div>
                    </div>
                  ))}
                </aside>
              )}
            </div>
            <div
              className="flex flex-wrap gap-4 items-center justify-between mt-4 pt-4 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <Button
                data-express-interest
                size="none"
                className="shrink-0 px-6 py-4 hs-text-label hs-font-bold"
              >
                Express interest
              </Button>
              <div className="flex flex-wrap items-center gap-2 shrink-0 rounded-lg px-1 pt-1 pb-2" style={{ background: '#F0F4F5' }}>
                <SharePagePanel />
                <SaveToggleButton appId={app.id} size="sm" className="shrink-0" />
                <CompareToggleButton appId={app.id} size="sm" className="shrink-0" />
              </div>
            </div>
          </div>
        </div>
        </PdpShareRegion>

        {hasPdpAlerts ? (
          <PdpShareRegion shareKey="alerts" label="Alerts and notices" excludeFromShareUi className="mb-6 space-y-6">
            {app.clinical_safety_alert && <div><AlertBox type="danger"><strong>Clinical safety: </strong>{app.clinical_safety_alert}</AlertBox></div>}
            {app.dtac_status === 'required_not_confirmed' && <div><AlertBox type="danger"><strong>DTAC not confirmed: </strong>{app.dtac_note}</AlertBox></div>}
          </PdpShareRegion>
        ) : null}

        <div className="mb-6 space-y-4">
          {showPdpFactsGrid ? (
          <PdpShareRegion
            shareKey="sidebar-summary"
            label="Quick facts, assurance and sources"
            description="Device class, assurance statements, supplier email, product tiers, and how this profile was sourced."
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >

            <div className="hs-surface-card-sm bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
              <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>Quick facts</div>
              <div className="space-y-4 hs-text-label">
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Maturity</div>
                  <MaturityBadge level={app.maturity_level} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Local effort</div>
                  <EffortBadge level={app.local_wraparound} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Device class</div>
                  <div style={{ fontWeight: 600 }}>{app.device_class}</div>
                  {app.device_class_note && <div className="hs-text-caption mt-1" style={{ color: '#7A4800' }}>⚠ {app.device_class_note}</div>}
                  <DeviceClassDetails deviceClass={app.device_class} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Supervision model</div>
                  <SupervisionBadge model={app.supervision_model} />
                </div>
                <div>
                  <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Target patients</div>
                  <div className="hs-text-caption" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{app.target_patients}</div>
                </div>
              </div>
            </div>

            <div className="hs-surface-card-sm bg-white rounded-xl border p-6 space-y-4" style={{ borderColor: 'var(--border)' }}>
              <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Assurance</div>
              {[
                { label: 'DTAC', val: <DtacBadge status={app.dtac_status} /> },
                { label: 'DCB0129', val: app.dcb0129_status },
                { label: 'GDPR', val: app.gdpr_note?.split('.')[0] },
                { label: 'ISO 27001', val: app.iso27001 },
                { label: 'Cyber Essentials', val: app.cyber_essentials },
                { label: 'DSP Toolkit', val: app.dspt_status },
              ].map(r => (
                <div key={r.label} className="flex items-start gap-2 hs-text-caption">
                  <span className="w-28 flex-shrink-0 hs-font-normal" style={{ color: 'var(--text-muted)' }}>{r.label}</span>
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
                <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>Product tiers</div>
                {app.product_tiers.map((t: any) => (
                  <div key={t.tier_name} className="mb-4 last:mb-0">
                    <div className="hs-font-bold hs-text-label" style={{ color: accent }}>{t.tier_name}</div>
                    <div className="hs-text-caption mt-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.description}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="hs-surface-card-sm rounded-lg p-4 hs-text-caption" style={{ background: '#F0F4F5', border: '1px solid var(--border)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Sources: </strong>{app.source_summary}
              <br /><br />
              {app.confidence_note}
            </div>
          </PdpShareRegion>
          ) : null}
        </div>

        <PdpShareRegion
          shareKey="commissioning-snapshot"
          label="Commissioning snapshot"
          description="Governance, pricing model, integration, where it's live, and funding opportunities."
          className="hs-decision-snapshot mb-6"
        >
          <PdpCommissioningSnapshot
            cards={commissioningCards}
            fundingCard={fundingSnapshotCard}
            whereLiveApp={app}
            whereLiveHref={hasNhsExperience ? '#nhs-experience' : undefined}
          />
        </PdpShareRegion>

        <div className={onThisPageLinks.length >= 2 ? 'hs-pdp-with-sidebar' : undefined}>
          <div className="hs-pdp-with-sidebar__main">
            {showNarrativeSpine && (
              <PdpNarrativeSpine
                app={app}
                narrative={narrative}
                localValue={<PdpLocalValue app={app} narrative={narrative} context={commissionerContext} />}
                assurance={<PdpAssurancePassport app={app} narrative={narrative} />}
                implementation={<PdpImplementation app={app} narrative={narrative} />}
                nhsExperience={hasNhsExperience ? <PdpNhsExperience app={app} /> : undefined}
              />
            )}

            <div className="space-y-4">
              <PdpTabs tabs={tabs} />

              <PdpShareRegion shareKey="express-interest" label="Express interest callout" excludeFromShareUi>
              <div className="hs-surface-card-sm rounded-b-xl border overflow-hidden" style={{ borderColor: accent }}>
                <div style={{ background: accent, padding: '20px 24px' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-section-alt)', color: '#fff', marginBottom: 8 }}>
                    Express interest
                  </div>
                  <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 640 }}>
                    Contact {app.supplier_contact_name ?? app.supplier_name} to discuss deployment in your ICB.
                  </p>
                  <ExpressInterestWhiteButton accent={accent} />
                </div>
              </div>
              </PdpShareRegion>

              {showNarrativeSpine && (app.source_summary || app.confidence_note) && (
                <PdpShareRegion
                  shareKey="provenance"
                  label="Sources and confidence"
                  description="How this profile was sourced and reviewed."
                >
                  <div
                    className="hs-surface-card-sm rounded-lg p-4 hs-text-caption"
                    style={{ background: '#F0F4F5', border: '1px solid var(--border)', color: 'var(--text-muted)', lineHeight: 1.6 }}
                  >
                    {app.source_summary && (
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: 'var(--text-secondary)' }}>Sources: </strong>{app.source_summary}
                      </p>
                    )}
                    {app.confidence_note && (
                      <p style={{ margin: '12px 0 0' }}>{app.confidence_note}</p>
                    )}
                    {app.last_reviewed_date && (
                      <p style={{ margin: '12px 0 0' }}>Last reviewed: {app.last_reviewed_date}</p>
                    )}
                  </div>
                </PdpShareRegion>
              )}
            </div>
          </div>

          {onThisPageLinks.length >= 2 ? (
            <aside className="hs-pdp-with-sidebar__aside">
              <PdpOnThisPage links={onThisPageLinks} />
            </aside>
          ) : null}
        </div>
        </PdpSharePrintProvider>
      </div>
    </AppDetailClient>
  )
}
