import { getAllApps, getAppBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  DtacBadge, MaturityBadge, EvidenceBadge, EffortBadge,
  SupervisionBadge, NiceTypeBadge, AlertBox, SectionHeader, ConditionTag
} from '@/components/Badges'
import AppDetailClient from './AppDetailClient'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { CollapsibleSection, CollapsibleInline } from '@/components/CollapsibleSection'
import {
  ScaleAndMaturitySection,
  WhatItTakesLocallySection,
  ImpactAndCaseStudiesSection,
  DemoAccessSection,
  TechnicalIntegrationTable,
  FinancialCommercialBody,
  RelatedFundingSection,
  IndicativeFinancialGlance,
} from '@/components/AppDetailSections'
import { DeviceClassDetails } from '@/components/DeviceClassDetails'

export async function generateStaticParams() {
  return getAllApps().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  return { title: app ? `${app.app_name} — HealthStore` : 'Not found' }
}

const TYPE_LABELS: Record<string, string> = {
  RCT: 'RCT', observational: 'Observational', service_eval: 'Service evaluation',
  grey_lit: 'Grey literature', nice_assessment: 'NICE assessment',
  real_world: 'Real-world evidence', implementation_science: 'Implementation science',
  evidence_gap: 'Evidence gap note',
}
const TYPE_COLOURS: Record<string, string> = {
  RCT: 'badge-green', observational: 'badge-blue', service_eval: 'badge-grey',
  grey_lit: 'badge-grey', nice_assessment: 'badge-teal', real_world: 'badge-blue',
  implementation_science: 'badge-purple', evidence_gap: 'badge-amber',
}

function EvidenceCard({ study, accent }: { study: any; accent: string }) {
  const isEvidenceGap = study.type === 'evidence_gap'
  const evidenceCardClass = [
    'card-evidence',
    study.data_quality_flag ? 'card-evidence--dq' : '',
    isEvidenceGap ? 'card-evidence--gap' : study.coi ? 'card-evidence--coi' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={evidenceCardClass}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <span className={`badge ${TYPE_COLOURS[study.type] ?? 'badge-grey'}`}>
              {TYPE_LABELS[study.type] ?? study.type}
            </span>
            {study.peer_reviewed && (
              <span className="badge badge-green">Peer-reviewed</span>
            )}
            {study.coi && (
              <span className="badge badge-amber">
                <span aria-hidden>⚠ </span>COI declared
              </span>
            )}
            {study.data_quality_flag && (
              <span className="badge badge-amber">
                <span aria-hidden>⚠ </span>Data quality flag
              </span>
            )}
          </div>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-label)', color: 'var(--text-primary)', marginBottom: 2 }}>
            {study.ref}
          </div>
          {study.authors && (
            <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
              {study.authors}
              {study.journal && <span> · <em>{study.journal}</em></span>}
              {study.year && <span> · {study.year}</span>}
              {study.volume_issue && <span> · {study.volume_issue}</span>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          {study.url_doi && (
            <a href={study.url_doi} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              DOI ↗
            </a>
          )}
          {study.url_pubmed && (
            <a href={study.url_pubmed} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              PubMed ↗
            </a>
          )}
          {study.url_pmc && (
            <a href={study.url_pmc} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              PMC (open) ↗
            </a>
          )}
          {study.url_full_text && !study.url_doi && !study.url_pubmed && (
            <a href={study.url_full_text} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {study.source_label ?? 'Source ↗'}
            </a>
          )}
          {study.url_trial_reg && (
            <a href={study.url_trial_reg} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Trial reg ↗
            </a>
          )}
          {study.url_case_study && (
            <a href={study.url_case_study} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Case study ↗
            </a>
          )}
        </div>
      </div>

      {(study.doi || study.pmid || study.pmc || study.trial_reg || study.n) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          {study.doi && <span>DOI: {study.doi}</span>}
          {study.pmid && <span>PMID: {study.pmid}</span>}
          {study.pmc && <span>PMC: {study.pmc}</span>}
          {study.trial_reg && <span>Trial reg: {study.trial_reg}</span>}
          {study.n && <span>n = {study.n.toLocaleString()}</span>}
          {study.setting && <span>Setting: {study.setting}</span>}
        </div>
      )}

      {study.key_results && (
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Key results: </strong>
          {study.key_results}
        </p>
      )}

      {study.study_limitation && (
        <p style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: study.data_quality_note ? 6 : 0 }}>
          <strong>Limitation: </strong>{study.study_limitation}
        </p>
      )}

      {study.data_quality_note && (
        <div style={{ fontSize: 'var(--text-label)', background: '#FEF5E6', borderLeft: '3px solid #D5840D', color: '#7A4800', borderRadius: 4, padding: '6px 8px', marginTop: 6, lineHeight: 1.5 }}>
          <strong>⚠ Commissioner note: </strong>{study.data_quality_note}
        </div>
      )}
      {study.coi_note && !study.data_quality_note && (
        <div style={{ fontSize: 'var(--text-label)', background: '#FEF5E6', borderLeft: '3px solid #D5840D', color: '#7A4800', borderRadius: 4, padding: '6px 8px', marginTop: 6, lineHeight: 1.5 }}>
          <strong>⚠ COI note: </strong>{study.coi_note}
        </div>
      )}
    </div>
  )
}

function ContextOfUseGrid({ app }: { app: any }) {
  const ctx = app.context_of_use
  if (!ctx) return null
  const items = [
    { label: 'Target population', value: ctx.population },
    { label: 'Clinical pathways', value: Array.isArray(ctx.pathways) ? ctx.pathways.join(', ') : ctx.pathways },
    { label: 'Care settings', value: Array.isArray(ctx.care_settings) ? ctx.care_settings.join(', ') : ctx.care_settings },
    { label: 'Therapeutic purpose', value: ctx.therapeutic_purpose },
    { label: 'HCP involvement', value: ctx.hcp_involvement },
    { label: 'NICE scope', value: ctx.nice_scope },
  ]
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(item => (
        <div key={item.label} className="rounded-lg p-3" style={{ background: '#F7F9FC' }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
            {item.label}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {item.value || 'Not specified'}
          </div>
        </div>
      ))}
    </div>
  )
}

function NhsIntegrationBadges({ app }: { app: any }) {
  const integrations = [
    { key: 'nhs_app_integration', label: 'NHS App' },
    { key: 'nhs_login_integration', label: 'NHS Login' },
    { key: 'nhs_notify_integration', label: 'NHS Notify' },
  ]
  const hasAny = integrations.some(i => app[i.key])
  if (!hasAny) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {integrations.filter(i => app[i.key]).map(i => (
        <span key={i.key} className="badge badge-blue">
          ✓ {i.label}
        </span>
      ))}
    </div>
  )
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()

  const accent = STORE_ACCENT

  const rcts = (app.clinical_evidence_detailed ?? []).filter((s: any) => s.type === 'RCT')
  const observational = (app.clinical_evidence_detailed ?? []).filter((s: any) => ['observational', 'real_world', 'service_eval'].includes(s.type))
  const niceAndImpl = (app.clinical_evidence_detailed ?? []).filter((s: any) => ['nice_assessment', 'implementation_science', 'grey_lit', 'evidence_gap'].includes(s.type))

  const linkedFundingIds = app.linked_funding_ids ?? app.funding_ids ?? []

  return (
    <AppDetailClient app={app}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
          <Link href="/apps" className="hover:underline">Browse apps</Link>
          <span>›</span>
          <span>{app.app_name}</span>
        </div>

        <div className="rounded-2xl bg-white border overflow-hidden mb-8" style={{ borderColor: 'var(--border)' }}>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {app.condition_tags.map((t: string) => <ConditionTag key={t} tag={t} />)}
                  {app.nice_guidance_refs.map((r: any) => (
                    <a key={r.ref} href={r.url} target="_blank" rel="noopener noreferrer">
                      <NiceTypeBadge type={r.type} />
                    </a>
                  ))}
                  {app.content_confidence && (
                    <span className={`badge ${app.content_confidence === 'Confirmed' ? 'badge-green' : app.content_confidence === 'Supplier-reported' ? 'badge-blue' : 'badge-amber'}`}>
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
                <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 640 }}>
                  {app.one_line_value_proposition}
                </p>
                <NhsIntegrationBadges app={app} />
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-3 md:w-72">
                {[
                  { label: 'Maturity', badge: <MaturityBadge level={app.maturity_level} /> },
                  { label: 'Evidence', badge: <EvidenceBadge strength={app.evidence_strength} /> },
                  { label: 'Local effort', badge: <EffortBadge level={app.local_wraparound} /> },
                  { label: 'DTAC', badge: <DtacBadge status={app.dtac_status} /> },
                ].map(({ label, badge }) => (
                  <div key={label} className="rounded-xl p-4 text-center min-w-0" style={{ background: '#F7F9FC', border: '1px solid var(--border)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    <span className="inline-flex justify-center whitespace-nowrap">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 items-center mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              {app.nhse_125k_eligible === true && (
                <span className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"
                  style={{ background: '#E6F5EC', color: '#004B22' }}>
                  ★ NHSE £125k funding eligible
                </span>
              )}
              <button data-express-interest className="ml-auto px-4 py-4 rounded-lg text-sm font-semibold text-white"
                style={{ background: accent }}>
                Express interest
              </button>
            </div>
          </div>
        </div>

        {app.decommissioning_alert && <div className="mb-6"><AlertBox type="warning">{app.decommissioning_alert}</AlertBox></div>}
        {app.clinical_safety_alert && <div className="mb-6"><AlertBox type="danger"><strong>Clinical safety: </strong>{app.clinical_safety_alert}</AlertBox></div>}
        {app.dtac_status === 'passed_refresh_required' && <div className="mb-6"><AlertBox type="warning"><strong>DTAC refresh required: </strong>{app.dtac_note}</AlertBox></div>}
        {app.dtac_status === 'required_not_confirmed' && <div className="mb-6"><AlertBox type="danger"><strong>DTAC not confirmed: </strong>{app.dtac_note}</AlertBox></div>}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
              <SectionHeader title="Why it matters locally" />
              <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{app.why_it_matters_locally}</p>
              {app.sustainability_highlight && (
                <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: '#E6F5EC', color: '#004B22' }}>
                  🌿 {app.sustainability_highlight}
                </div>
              )}
            </section>

            {app.context_of_use && (
              <section className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
                <SectionHeader title="Context of use" description="Population, pathways, care settings and therapeutic purpose." />
                <ContextOfUseGrid app={app} />
              </section>
            )}

            <ScaleAndMaturitySection app={app} />

            <WhatItTakesLocallySection app={app} accent={accent} />

            <ImpactAndCaseStudiesSection app={app} />

            <section id="clinical-evidence" className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
              <SectionHeader
                title="Clinical evidence"
                description="Full evidence record. Links to source publications provided where available."
              />
              <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20 }}>
                {app.evidence_summary}
              </p>

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
            </section>

            <section className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
              <SectionHeader title="NICE guidance" />
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
            </section>

            {app.contradictory_evidence?.length > 0 && (
              <section className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
                <SectionHeader title="Data quality flags" description="Issues identified during review that commissioners should be aware of." />
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
              </section>
            )}

            <DemoAccessSection app={app} accent={accent} />

            {app.technical_integrations && (
              <CollapsibleSection
                title="NHS and care system integrations"
                description="Technical integration detail. NHS App, NHS Login and NHS Notify are summarised in the product summary at the top of the page."
                defaultOpen={false}
              >
                <TechnicalIntegrationTable app={app} />
              </CollapsibleSection>
            )}

            <section className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
              <SectionHeader title="Financial and commercial considerations" />
              <IndicativeFinancialGlance app={app} />
              <CollapsibleInline
                title="Procurement, tariff and ROI detail"
                description="Contract routes, tariff, ROI and operational commercial notes."
                defaultOpen
              >
                <FinancialCommercialBody app={app} />
              </CollapsibleInline>
            </section>

            <RelatedFundingSection fundingIds={linkedFundingIds} />

            <div className="rounded-xl border overflow-hidden" style={{ borderColor: accent }}>
              <div style={{ background: accent, padding: '20px 24px' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-section-alt)', color: '#fff', marginBottom: 8 }}>
                  Express interest
                </div>
                <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 640 }}>
                  Contact {app.supplier_contact_name ?? app.supplier_name} to discuss deployment in your ICB.
                </p>
                <button
                  type="button"
                  data-express-interest
                  className="w-full sm:w-auto min-w-[200px]"
                  style={{
                    display: 'block', textAlign: 'center', background: '#fff',
                    color: accent, borderRadius: 8, padding: '12px 24px',
                    fontSize: 'var(--text-label)', fontWeight: 700, border: 'none', cursor: 'pointer',
                  }}>
                  ✉ Express interest
                </button>
              </div>
            </div>

          </div>

          <div className="space-y-5">

            <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>Quick facts</div>
              <div className="space-y-3 text-sm">
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

            <div className="bg-white rounded-xl border p-5 space-y-3" style={{ borderColor: 'var(--border)' }}>
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

            {app.product_tiers?.length > 0 && (
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Product tiers</div>
                {app.product_tiers.map((t: any) => (
                  <div key={t.tier_name} className="mb-3 last:mb-0">
                    <div className="font-semibold text-sm" style={{ color: accent }}>{t.tier_name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.description}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg p-4 text-xs" style={{ background: '#F7F9FC', border: '1px solid var(--border)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Sources: </strong>{app.source_summary}
              <br /><br />
              {app.confidence_note}
            </div>
          </div>
        </div>
      </div>
    </AppDetailClient>
  )
}
