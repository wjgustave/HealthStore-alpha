import { getAllAppsUnfiltered, getAppBySlug, getCommissionerFacingFunding } from '@/lib/data'
import { getCommissioningSnapshot } from '@/lib/commissioningSnapshot'
import { getDeploymentRegister } from '@/lib/deploymentRegister'
import { splitPdpEvidence } from '@/lib/pdpEvidence'
import { resolveProductNarrative, getProductNarrative } from '@/lib/content/productNarratives'
import PdpNarrativeSpine from '@/components/product/PdpNarrativeSpine'
import PdpLocalValue from '@/components/product/PdpLocalValue'
import PdpAssurancePassport from '@/components/product/PdpAssurancePassport'
import PdpImplementation from '@/components/product/PdpImplementation'
import PdpNhsExperience from '@/components/product/PdpNhsExperience'
import PdpClinicalPublications from '@/components/product/PdpClinicalPublications'
import PdpResources from '@/components/product/PdpResources'
import PdpExpressInterestCallout from '@/components/product/PdpExpressInterestCallout'
import PdpFundingLevers from '@/components/product/PdpFundingLevers'
import { getServerContext } from '@/lib/context/serverContext'
import { PdpCommissioningSnapshot } from '@/components/PdpCommissioningSnapshot'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  DtacBadge, MaturityBadge, EffortBadge,
  SupervisionBadge, ConditionTag, AlertBox
} from '@/components/Badges'
import { CompareToggleButton } from '@/components/CompareToggleButton'
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
import { DeviceClassDetails } from '@/components/DeviceClassDetails'
import { EvidenceCard } from './pdpBlocks'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import PdpSupplierContactCard from '@/components/PdpSupplierContactCard'
import PdpOnThisPage from '@/components/PdpOnThisPage'
import { buildPdpOnThisPageLinks } from '@/lib/pdpOnThisPage'

export async function generateStaticParams() {
  return getAllAppsUnfiltered().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  return { title: app ? `${app.app_name} — NHS HealthStore` : 'Not found' }
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
        { label: 'NHS HealthStore status', value: narrative.commercial_readiness?.commercial_status ?? 'Under review' },
      ].filter((f) => !!f.value)
    : []

  const linkedFundingIds = app.linked_funding_ids ?? app.funding_ids ?? []
  const showIndicativeFinancialInTab = !(showNarrativeSpine && (app.condition_tags?.includes('copd') ?? false))
  const showCommercialTab = !showNarrativeSpine || showIndicativeFinancialInTab
  const commissioningCards = getCommissioningSnapshot(
    app,
    showNarrativeSpine
      ? { commercialHref: '#how-to-buy', interopHref: '#resources', demoHref: '#resources' }
      : { demoHref: '#demo-access' },
  )
  const showLocalValue = showNarrativeSpine && (app.condition_tags?.includes('copd') ?? false)
  const hasNhsExperience =
    showNarrativeSpine &&
    (getDeploymentRegister(app).length > 0 || (app.case_studies?.length ?? 0) > 0)
  // When the NHS experience section is shown, case studies move out of the Evidence
  // tab; the "expected impact" section should then only render for prose/videos.
  const hasImpactProse = !!(app.expected_benefit_note && String(app.expected_benefit_note).trim())
  const showExpectedImpactSection = hasNhsExperience
    ? hasImpactProse
    : showNarrativeSpine
      ? !!(hasImpactProse || (app.case_studies?.length ?? 0) > 0)
      : shouldShowImpactSection(app)

  // Narrative products surface the evidence record in the spine — publications and
  // NICE guidance inside "Assurance and evidence", real-world programme write-ups as
  // NHS experience case-study cards. The tab keeps only whatever isn't covered there;
  // non-narrative products keep the full record in the tab.
  const evidenceSplit = splitPdpEvidence(app, { showNarrativeSpine, hasNhsExperience })
  const evidenceForTab = evidenceSplit.tab
  const showClinicalPublicationsInTab = !showNarrativeSpine && evidenceSplit.publications.length > 0
  const showClinicalEvidenceSection =
    evidenceForTab.length > 0 || (!showNarrativeSpine && evidenceSplit.publications.length === 0)
  const showNiceGuidanceSection = !showNarrativeSpine
  const rcts = evidenceForTab.filter((s: any) => s.type === 'RCT')
  const observational = evidenceForTab.filter((s: any) => ['observational', 'real_world'].includes(s.type))
  const niceAndImpl = evidenceForTab.filter((s: any) => ['nice_assessment', 'implementation_science', 'grey_lit', 'evidence_gap'].includes(s.type))

  const onThisPageLinks = buildPdpOnThisPageLinks({
    app,
    narrative: showNarrativeSpine ? narrative : null,
    showNarrativeSpine,
    showLocalValue,
    hasLinkedFunding: linkedFundingIds.length > 0,
    context: commissionerContext,
  })

  const hasPdpAlerts =
    !!app.clinical_safety_alert ||
    app.dtac_status === 'required_not_confirmed'

  const tabs: PdpTab[] = [
    {
      id: 'evidence',
      label: 'Clinical evidence & outcomes',
      anchors: showClinicalEvidenceSection ? ['clinical-evidence'] : [],
      panel: (
        <>
          {showExpectedImpactSection && (
            <PdpSection
          shareKey="expected-impact"
              title={hasNhsExperience ? 'Expected impact' : 'Expected impact and case studies'}
              description="Outcomes commissioners should expect and illustrative deployments. Distinct from the formal clinical evidence record below."
            >
              <ImpactAndCaseStudiesSection app={app} showCaseStudies={!hasNhsExperience} showVideos={!showNarrativeSpine} />
            </PdpSection>
          )}

          {showClinicalPublicationsInTab && (
            <PdpClinicalPublications publications={evidenceSplit.publications} className="mb-6" />
          )}

          {showClinicalEvidenceSection && (
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
                  Real-world & observational evidence ({observational.length})
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
          )}

          {showNiceGuidanceSection && (
          <PdpSection
            shareKey="nice-guidance"
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
          </PdpSection>
          )}

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
      anchors: showNarrativeSpine ? [] : ['commercial-model', 'related-funding'],
      panel: (
        <>
          {!showNarrativeSpine && (
          <PdpSection
            id="commercial-model"
            shareKey="commercial-model"
            title="Commercial model and cost"
            description="How the product is priced, what is included, and how to procure it."
          >
            <CommercialModelAndCostSection app={app} />
          </PdpSection>
          )}

          {showIndicativeFinancialInTab && (
          <PdpSection
            shareKey="indicative-financial"
            title="Indicative financial context"
            description="Expected benefits, tariff, provider income and ROI considerations for local modelling."
          >
            <IndicativeFinancialContextSection app={app} />
          </PdpSection>
          )}

          {!showNarrativeSpine && getCommissionerFacingFunding(linkedFundingIds).length > 0 && (
          <PdpSection
            id="related-funding"
            shareKey="related-funding"
            title="Related funding opportunities"
            description="Cash or adoption support for commissioners — not supplier R&D or NICE reporting obligations (see NICE guidance)."
          >
            <RelatedFundingSection fundingIds={linkedFundingIds} />
          </PdpSection>
          )}
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
  ].filter((tab) => {
    if (tab.id === 'commercial' && !showCommercialTab) return false
    if (tab.id === 'evidence' && showNarrativeSpine) return false
    if (tab.id === 'technical' && showNarrativeSpine) return false
    if (tab.id === 'deployment' && showNarrativeSpine) return false
    return true
  })

  return (
      <div className="hs-pdp">
        <PdpSharePrintProvider>
        <div className="hs-pdp-top">
        <div className="hs-page">
        <PdpShareRegion shareKey="breadcrumb" label="Browse trail" excludeFromShareUi className="mb-4">
          <PageBreadcrumb
            items={[
              { label: 'Product catalogue', href: '/catalogue' },
              { label: 'Digital therapeutics', href: '/catalogue/digital-therapeutics' },
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
        <div className="overflow-hidden">
            <div className="flex flex-col gap-6 items-start lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="flex-1 w-full min-w-0">
                <div className="flex items-start gap-4 mb-2">
                  {app.logo_path && (
                    <Image src={app.logo_path} alt={`${app.app_name} logo`} width={48} height={48}
                      className="rounded-lg flex-shrink-0" />
                  )}
                  <div>
                    <h1 className="page-title-h1 mb-1">{app.app_name}</h1>
                    <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>{app.supplier_name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(app.condition_tags ?? []).map((t: string) => (
                    <ConditionTag key={t} tag={t} />
                  ))}
                  {app.supervision_model ? <SupervisionBadge model={app.supervision_model} /> : null}
                  <MaturityBadge level={app.maturity_level} hideEstablished />
                  {app.content_confidence && app.content_confidence !== 'Confirmed' && (
                    <span className={`badge ${app.content_confidence === 'Supplier-reported' ? 'badge-blue' : 'badge-amber'}`}>
                      {app.content_confidence}
                    </span>
                  )}
                </div>
                <p
                  className="min-w-0 max-w-[640px] mb-4"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}
                >
                  {heroProposition}
                </p>
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
            <div className="flex flex-wrap gap-4 items-center mt-8 mb-6">
              <Link
                href={`/apps/${app.slug}/express-interest`}
                className="nhsuk-button mb-0 inline-flex items-center justify-center gap-2 align-top shrink-0 px-6 py-4 hs-text-label hs-font-bold no-underline"
              >
                Express interest
              </Link>
              <CompareToggleButton
                appId={app.id}
                solid
                size="none"
                className="shrink-0 px-6 py-4 hs-text-label hs-font-bold"
              />
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
          description="Governance, pricing model, integration, and where it's live."
          className="hs-decision-snapshot"
        >
          <PdpCommissioningSnapshot
            cards={commissioningCards}
            whereLiveApp={app}
            whereLiveHref={hasNhsExperience ? '#nhs-experience' : undefined}
          />
        </PdpShareRegion>
        </div>
        </div>

        <div className="hs-page">
        <div className={onThisPageLinks.length >= 2 ? 'hs-pdp-with-sidebar' : undefined}>
          {onThisPageLinks.length >= 2 ? (
            <aside className="hs-pdp-with-sidebar__aside">
              <PdpOnThisPage links={onThisPageLinks} title={app.app_name} />
            </aside>
          ) : null}

          <div className="hs-pdp-with-sidebar__main">
            {showNarrativeSpine && (
              <PdpNarrativeSpine
                app={app}
                narrative={narrative}
                localValue={<PdpLocalValue app={app} narrative={narrative} context={commissionerContext} />}
                fundingLevers={<PdpFundingLevers narrative={narrative} fundingIds={linkedFundingIds} />}
                assurance={<PdpAssurancePassport app={app} narrative={narrative} />}
                implementation={<PdpImplementation app={app} narrative={narrative} />}
                nhsExperience={hasNhsExperience ? <PdpNhsExperience app={app} /> : undefined}
                resources={showNarrativeSpine ? <PdpResources app={app} /> : undefined}
                expressInterest={
                  <PdpShareRegion shareKey="express-interest" label="Express interest callout" excludeFromShareUi>
                    <PdpExpressInterestCallout accent={accent} slug={app.slug} />
                  </PdpShareRegion>
                }
              />
            )}

            <div className="space-y-4">
              {slug !== 'myheart' && tabs.length > 0 && <PdpTabs tabs={tabs} />}

              {!showNarrativeSpine && (
              <PdpShareRegion shareKey="express-interest" label="Express interest callout" excludeFromShareUi>
              <div className="hs-surface-card-sm rounded-b-xl border overflow-hidden" style={{ borderColor: accent }}>
                <PdpExpressInterestCallout accent={accent} slug={app.slug} />
              </div>
              </PdpShareRegion>
              )}

            </div>
          </div>
        </div>
        </div>
        </PdpSharePrintProvider>
      </div>
  )
}
