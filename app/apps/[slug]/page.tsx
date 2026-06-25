import { getAllAppsUnfiltered, getAppBySlug, getCommissionerFacingFunding, getLinkedFunding } from '@/lib/data'
import { getCommissioningSnapshot, getFundingSnapshotCard } from '@/lib/commissioningSnapshot'
import { PdpCommissioningSnapshot } from '@/components/PdpCommissioningSnapshot'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  DtacBadge, MaturityBadge, EffortBadge,
  SupervisionBadge, NiceTypeBadge, AlertBox, ConditionTag
} from '@/components/Badges'
import AppDetailClient from './AppDetailClient'
import { CompareToggleButton } from '@/components/CompareToggleButton'
import { SaveToggleButton } from '@/components/SaveToggleButton'
import { STORE_ACCENT } from '@/lib/storeAccent'
import {
  ScaleAndMaturitySection,
  WhatItTakesLocallySection,
  ImpactAndCaseStudiesSection,
  DemoAccessSection,
  SafetyAndGovernanceSection,
  TechnicalIntegrationTable,
  CommercialModelAndCostSection,
  IndicativeFinancialContextSection,
  RelatedFundingSection,
  hasWhatItTakesContent,
  shouldShowImpactSection,
  shouldShowDemoAccess,
} from '@/components/AppDetailSections'
import { PdpSection } from '@/components/PdpSection'
import { PdpTabs, type PdpTab } from '@/components/PdpTabs'
import { PdpSharePrintProvider, PdpShareRegion } from '@/components/PdpSharePrintContext'
import { SharePagePanel } from '@/components/SharePagePanel'
import { DeviceClassDetails } from '@/components/DeviceClassDetails'
import { EvidenceCard, ContextOfUseGrid, ProductHeroDemoBadge } from './pdpBlocks'
import { ExpressInterestWhiteButton } from '@/components/ExpressInterestWhiteButton'
import { Button } from '@/components/ui/Button'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import PdpSupplierContactCard from '@/components/PdpSupplierContactCard'
import { getSession } from '@/lib/session'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'
import { getExpressionOfInterestPrefill } from '@/lib/expressionOfInterestPrefill'

export async function generateStaticParams() {
  return getAllAppsUnfiltered().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  return { title: app ? `${app.app_name} — HealthStore` : 'Not found' }
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()

  const session = await getSession()
  const commissioningOrganisationLabel = getCommissioningContextLabel(session)
  const contactPrefill = getExpressionOfInterestPrefill(session, commissioningOrganisationLabel)

  const accent = STORE_ACCENT
  const showPdpFactsGrid = false

  const rcts = (app.clinical_evidence_detailed ?? []).filter((s: any) => s.type === 'RCT')
  const observational = (app.clinical_evidence_detailed ?? []).filter((s: any) => ['observational', 'real_world', 'service_eval'].includes(s.type))
  const niceAndImpl = (app.clinical_evidence_detailed ?? []).filter((s: any) => ['nice_assessment', 'implementation_science', 'grey_lit', 'evidence_gap'].includes(s.type))

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

  const hasPdpAlerts =
    !!app.clinical_safety_alert ||
    app.dtac_status === 'required_not_confirmed'

  const tabs: PdpTab[] = [
    {
      id: 'overview',
      label: 'Overview & local fit',
      anchors: ['demo-access'],
      panel: (
        <>
          <PdpSection
            shareKey="why-it-matters"
            title="Why it matters locally"
            description="Local commissioning angle: how this product connects to demand, outcomes, and priorities for your population and system."
          >
            <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{app.why_it_matters_locally}</p>
            {app.sustainability_highlight && (
              <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: '#E6F5EC', color: '#004B22' }}>
                🌿 {app.sustainability_highlight}
              </div>
            )}
          </PdpSection>

          {app.context_of_use && (
            <PdpSection
          shareKey="context-of-use"
              title="Context of use"
              description="Population, pathways, care settings and therapeutic purpose."
            >
              <ContextOfUseGrid app={app} />
            </PdpSection>
          )}

          {shouldShowDemoAccess(app) && (
            <PdpSection
              id="demo-access"
              shareKey="demo-access"
              title="Demo access"
              description="How to view the product or request a demonstration."
            >
              <DemoAccessSection app={app} accent={accent} />
            </PdpSection>
          )}
        </>
      ),
    },
    {
      id: 'evidence',
      label: 'Clinical evidence & outcomes',
      anchors: ['clinical-evidence'],
      panel: (
        <>
          {shouldShowImpactSection(app) && (
            <PdpSection
          shareKey="expected-impact"
              title="Expected impact and case studies"
              description="Outcomes commissioners should expect and illustrative deployments. Distinct from the formal clinical evidence record below."
            >
              <ImpactAndCaseStudiesSection app={app} />
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
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Randomised controlled trials ({rcts.length})
                </div>
                {rcts.map((s: any) => <EvidenceCard key={s.id} study={s} accent={accent} />)}
              </div>
            )}

            {observational.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Real-world, observational & service evaluation evidence ({observational.length})
                </div>
                {observational.map((s: any) => <EvidenceCard key={s.id} study={s} accent={accent} />)}
              </div>
            )}

            {niceAndImpl.length > 0 && (
              <div>
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>
                  NICE assessments, implementation science & other sources ({niceAndImpl.length})
                </div>
                {niceAndImpl.map((s: any) => <EvidenceCard key={s.id} study={s} accent={accent} />)}
              </div>
            )}
          </PdpSection>

          <PdpSection
            shareKey="nice-guidance"
            title="NICE guidance"
            description="NICE publications and programme references linked to this product."
          >
            <div className="space-y-3">
              {app.nice_guidance_refs.map((r: any) => (
                <div key={r.ref} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#F7F9FC', border: '1px solid var(--border)' }}>
                  <NiceTypeBadge type={r.type} />
                  <div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="font-semibold text-sm hover:underline" style={{ color: accent }}>
                      {r.ref} ↗
                    </a>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
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
                  <div key={i} className="rounded-xl border p-4" style={{ background: '#FDECEA', borderColor: '#DA291C33' }}>
                    <div className="font-semibold text-sm mb-2" style={{ color: '#7A1210' }}>{c.domain}</div>
                    <div className="text-xs space-y-1.5" style={{ color: '#5A1010' }}>
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
            <ScaleAndMaturitySection app={app} />
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
      id: 'safety',
      label: 'Safety & governance',
      anchors: ['safety-governance', 'data-information-governance'],
      panel: (
        <PdpSection
          id="safety-governance"
          shareKey="safety-governance"
          title="Safety and governance"
          description="Clinical safety (DTAC, DCB0129/0160, device class) and information governance (GDPR, ISO 27001, Cyber Essentials, DSP Toolkit)."
        >
          <SafetyAndGovernanceSection app={app} />
        </PdpSection>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

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
          className="mb-3"
        >
        <div className="hs-surface-card-sm rounded-t-2xl bg-white border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-8 pt-8 pb-3">
            <div className="flex flex-col gap-6 items-start">
              <div className="flex-1 w-full min-w-0">
                {/* R7 PDP triage (RSP-01): hero keeps condition + decision-signal pills only;
                    supervision model, NICE refs and NHS App now live in the commissioning snapshot below. */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {app.condition_tags.map((t: string) => <ConditionTag key={t} tag={t} />)}
                  <MaturityBadge level={app.maturity_level} hideEstablished />
                  {app.content_confidence && app.content_confidence !== 'Confirmed' && (
                    <span className={`badge ${app.content_confidence === 'Supplier-reported' ? 'badge-blue' : 'badge-amber'}`}>
                      {app.content_confidence}
                    </span>
                  )}
                </div>
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 mb-3">
                  <p
                    className="min-w-0 flex-1 max-w-[640px]"
                    style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}
                  >
                    {app.one_line_value_proposition}
                  </p>
                  <Button
                    data-express-interest
                    size="none"
                    className="shrink-0 self-end sm:self-auto px-5 py-4 text-sm font-semibold"
                  >
                    Express interest
                  </Button>
                </div>
              </div>
            </div>
            {/* R7 PDP triage (RSP-01): Express interest is the sole primary; Save / Compare / Share
                are demoted into one quiet, compact utility cluster on the right. */}
            <div
              className="flex flex-wrap gap-3 items-center justify-between mt-3 pt-3 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <ProductHeroDemoBadge app={app} />
              </div>
              <div className="flex flex-wrap items-center gap-1 shrink-0 rounded-lg px-1 py-0.5" style={{ background: '#F7F9FC' }}>
                <SharePagePanel borderlessTrigger />
                <SaveToggleButton appId={app.id} borderless className="px-3 min-h-[44px] shrink-0" />
                <CompareToggleButton appId={app.id} borderless className="px-3 min-h-[44px] shrink-0" />
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

        <div className="mb-6 space-y-3">
          {showPdpFactsGrid ? (
          <PdpShareRegion
            shareKey="sidebar-summary"
            label="Quick facts, assurance and sources"
            description="Device class, assurance statements, supplier email, product tiers, and how this profile was sourced."
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >

            <div className="hs-surface-card-sm bg-white rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>Quick facts</div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Maturity</div>
                  <MaturityBadge level={app.maturity_level} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Local effort</div>
                  <EffortBadge level={app.local_wraparound} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Device class</div>
                  <div style={{ fontWeight: 600 }}>{app.device_class}</div>
                  {app.device_class_note && <div className="text-xs mt-0.5" style={{ color: '#D5840D' }}>⚠ {app.device_class_note}</div>}
                  <DeviceClassDetails deviceClass={app.device_class} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Supervision model</div>
                  <SupervisionBadge model={app.supervision_model} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Target patients</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{app.target_patients}</div>
                </div>
              </div>
            </div>

            <div className="hs-surface-card-sm bg-white rounded-xl border p-5 space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Assurance</div>
              {[
                { label: 'DTAC', val: <DtacBadge status={app.dtac_status} /> },
                { label: 'DCB0129', val: app.dcb0129_status },
                { label: 'GDPR', val: app.gdpr_note?.split('.')[0] },
                { label: 'ISO 27001', val: app.iso27001 },
                { label: 'Cyber Essentials', val: app.cyber_essentials },
                { label: 'DSP Toolkit', val: app.dspt_status },
              ].map(r => (
                <div key={r.label} className="flex items-start gap-2 text-xs">
                  <span className="w-28 flex-shrink-0 font-medium" style={{ color: 'var(--text-muted)' }}>{r.label}</span>
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
                <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Product tiers</div>
                {app.product_tiers.map((t: any) => (
                  <div key={t.tier_name} className="mb-3 last:mb-0">
                    <div className="font-semibold text-sm" style={{ color: accent }}>{t.tier_name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.description}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="hs-surface-card-sm rounded-lg p-4 text-xs" style={{ background: '#F7F9FC', border: '1px solid var(--border)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
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
          />
        </PdpShareRegion>

        <div className="space-y-3">
          <PdpTabs tabs={tabs} />

          <PdpShareRegion shareKey="express-interest" label="Express interest callout" excludeFromShareUi>
          <div className="hs-surface-card-sm rounded-b-xl border overflow-hidden" style={{ borderColor: accent }}>
            <div style={{ background: accent, padding: '20px 24px' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-section-alt)', color: '#fff', marginBottom: 8 }}>
                Express interest
              </div>
              <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 640 }}>
                Contact {app.supplier_contact_name ?? app.supplier_name} to discuss deployment in your ICB.
              </p>
              <ExpressInterestWhiteButton accent={accent} />
            </div>
          </div>
          </PdpShareRegion>
        </div>
        </PdpSharePrintProvider>
      </div>
    </AppDetailClient>
  )
}
