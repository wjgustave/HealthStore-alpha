import Link from 'next/link'
import {
  AlertBox,
  EffortBadge,
  EvidenceBadge,
  FundingStatusBadge,
  MaturityBadge,
} from '@/components/Badges'
import enumsData from '@/content/common/enums.json'
import ProductVideosSection from '@/components/ProductVideosSection'
import { getCommissionerFacingFunding } from '@/lib/data'

export function TechnicalIntegrationTable({ app }: { app: any }) {
  const ti = app.technical_integrations
  const nhsLoginDisplay =
    app.nhs_login_integration === true
      ? 'Yes'
      : app.nhs_login_integration === false
        ? 'No'
        : 'Not confirmed'
  const nhsNotifyDisplay =
    app.nhs_notify_integration === true
      ? 'Yes'
      : app.nhs_notify_integration === false
        ? 'No'
        : 'Not confirmed'

  const rows: { label: string; value: string | undefined }[] = []
  if (ti) {
    rows.push(
      { label: 'FHIR', value: ti.fhir },
      { label: 'EMIS', value: ti.emis },
    )
  }
  rows.push({ label: 'NHS Login', value: nhsLoginDisplay })
  rows.push({ label: 'NHS Notify', value: nhsNotifyDisplay })
  if (ti) {
    rows.push(
      { label: 'Population health dashboard', value: ti.population_health_dashboard ? 'Yes' : 'No' },
      { label: 'Device integration', value: ti.device_integration },
      { label: 'Languages', value: ti.languages?.join(', ') },
      { label: 'Data hosting', value: ti.data_hosting },
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(r => (
            <tr key={r.label} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <td className="py-2.5 pr-4 font-medium w-56" style={{ color: 'var(--text-muted)' }}>{r.label}</td>
              <td className="py-2.5" style={{ color: r.value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {r.value || 'Not confirmed'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ScaleAndMaturitySection({ app }: { app: any }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-3 mb-5">
        <div
          className="rounded-lg px-3 py-2 text-sm w-fit"
          style={{ background: '#F7F9FC', border: '1px solid var(--border)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Maturity </span>
          <MaturityBadge level={app.maturity_level} />
        </div>
        <div
          className="rounded-lg px-3 py-2 text-sm w-fit"
          style={{ background: '#F7F9FC', border: '1px solid var(--border)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Evidence strength </span>
          <EvidenceBadge strength={app.evidence_strength} />
        </div>
      </div>
      <dl className="space-y-3 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>ICB / ICS sites (reported)</dt>
          <dd>{typeof app.live_icbs === 'number' ? `${app.live_icbs} ICB/ICS sites` : 'Information not available'}</dd>
        </div>
        {app.live_sites && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Named sites</dt>
            <dd style={{ lineHeight: 1.6 }}>{app.live_sites}</dd>
          </div>
        )}
        {app.patients_covered_note && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Population reach</dt>
            <dd style={{ lineHeight: 1.6 }}>{app.patients_covered_note}</dd>
          </div>
        )}
      </dl>
      {app.deployments?.length > 0 && (
        <>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Deployment footprint</div>
          <div className="space-y-0 divide-y" style={{ borderColor: 'var(--border)' }}>
            {app.deployments.map((d: any, i: number) => (
              <div key={i} className="py-3 flex items-start gap-3 text-sm">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${d.currently_active === false ? 'bg-red-400' : d.currently_active === null ? 'bg-gray-300' : 'bg-green-500'}`} />
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{d.organisation_name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {d.region}{d.country !== 'United Kingdom' ? ` · ${d.country}` : ''}
                    {d.patient_count ? ` · ${d.patient_count.toLocaleString()} patients` : ''}
                    {d.currently_active === false ? ' · DECOMMISSIONED' : ''}
                  </div>
                  {d.deployment_scope && <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{d.deployment_scope}</div>}
                  {d.attribution_flag && d.attribution_note && (
                    <div className="text-xs mt-1" style={{ color: '#D5840D' }}>⚠ {d.attribution_note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function hasWhatItTakesContent(app: any) {
  return !!(
    app.onboarding_detail ||
    app.onboarding_model ||
    app.local_wraparound_detail ||
    app.local_wraparound ||
    app.training_note ||
    app.training_required ||
    app.supplier_wrap ||
    app.service_wrap_note ||
    app.service_wrap_included !== undefined ||
    (app.implementation_prerequisites?.length > 0) ||
    app.monitoring_note ||
    app.operating_hours_caveat ||
    app.escalation_note
  )
}

export function WhatItTakesLocallySection({ app, accent }: { app: any; accent: string }) {
  if (!hasWhatItTakesContent(app)) return null

  return (
    <div>
      {app.local_wraparound && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Local effort</span>
          <EffortBadge level={app.local_wraparound} />
        </div>
      )}
      {app.local_wraparound_detail && (
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{app.local_wraparound_detail}</p>
      )}
      <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {app.onboarding_model && (
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Onboarding model:</strong>{' '}
            {String(app.onboarding_model).replace(/_/g, ' ')}
          </div>
        )}
        {app.onboarding_detail && (
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Onboarding:</strong> {app.onboarding_detail}
          </div>
        )}
        {(app.training_required || app.training_note) && (
          <div className="rounded-lg p-3" style={{ background: '#F7F9FC' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Training:</strong>{' '}
            {app.training_required ? 'Required. ' : ''}{app.training_note ?? ''}
          </div>
        )}
        {app.supplier_wrap && (
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Supplier wrap:</strong> {app.supplier_wrap}
          </div>
        )}
        {(app.service_wrap_included !== undefined || app.service_wrap_note) && (
          <div className="rounded-lg p-3" style={{ background: '#F7F9FC' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Service wrap:</strong>{' '}
            {app.service_wrap_included === true ? 'Included in offer. ' : app.service_wrap_included === false ? 'Not included by default. ' : ''}{app.service_wrap_note ?? ''}
          </div>
        )}
        {app.monitoring_note && (
          <div className="rounded-lg p-3" style={{ background: '#F7F9FC' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Monitoring:</strong> {app.monitoring_note}
          </div>
        )}
        {app.escalation_note && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Escalation:</strong> {app.escalation_note}
          </div>
        )}
        {app.operating_hours_caveat && (
          <div className="rounded-lg p-3 text-sm" style={{ background: '#FEF5E6', color: '#7A4800' }}>
            <strong>Hours caveat:</strong> {app.operating_hours_caveat}
          </div>
        )}
      </div>
      {app.implementation_prerequisites?.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Prerequisites</div>
          <ul className="space-y-1.5">
            {app.implementation_prerequisites.map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: accent }}>✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function CaseStudyCards({ caseStudies }: { caseStudies: any[] }) {
  return (
    <div className="space-y-3 mt-4">
      {caseStudies.map((cs: any, i: number) => (
        <div key={i} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: '#F7F9FC' }}>
          <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{cs.title}</div>
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            {cs.setting}{cs.sample_size ? ` · n=${cs.sample_size.toLocaleString()}` : ''}
          </div>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cs.outcome}</p>
          <div className="text-xs p-2 rounded" style={{ background: '#FEF5E6', color: '#7A4800' }}>
            ⚠ Caveat: {cs.caveat}
          </div>
          {cs.source && <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Source: {cs.source}</div>}
        </div>
      ))}
    </div>
  )
}

export function shouldShowImpactSection(app: any) {
  const hasImpact = !!(app.expected_benefit_note && String(app.expected_benefit_note).trim())
  const hasCases = app.case_studies?.length > 0
  const hasVideos = app.product_videos?.length > 0
  return !!(hasImpact || hasCases || hasVideos)
}

export function ImpactAndCaseStudiesSection({ app }: { app: any }) {
  const hasImpact = !!(app.expected_benefit_note && String(app.expected_benefit_note).trim())
  const hasCases = app.case_studies?.length > 0
  const hasVideos = app.product_videos?.length > 0
  if (!hasImpact && !hasCases && !hasVideos) return null

  return (
    <div>
      {hasImpact && (
        <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{app.expected_benefit_note}</p>
      )}
      {hasCases && (
        <>
          <p className="text-xs mt-4 mb-0 p-2 rounded" style={{ background: '#E6F0FB', color: '#003087', lineHeight: 1.5 }}>
            <strong>Commissioner note:</strong> Case studies are illustrative local reports and may not meet the same standard as peer-reviewed trials. Use alongside the{' '}
            <a href="#clinical-evidence" className="font-bold underline" style={{ color: '#003087' }}>Clinical evidence</a> section.
          </p>
          <CaseStudyCards caseStudies={app.case_studies} />
        </>
      )}
      {hasVideos && <ProductVideosSection videos={app.product_videos} embedded />}
    </div>
  )
}

export function shouldShowDemoAccess(app: any) {
  return (app.demo_variants?.length > 0) || !!(app.demo_notes && String(app.demo_notes).trim())
}

export function DemoAccessSection({ app, accent }: { app: any; accent: string }) {
  const hasDemo = (app.demo_variants?.length > 0) || !!(app.demo_notes && String(app.demo_notes).trim())
  if (!hasDemo) return null

  return (
    <div>
      {app.demo_notes && (
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{app.demo_notes}</p>
      )}
      {app.demo_variants?.length > 0 && (
        <ul className="space-y-2">
          {app.demo_variants.map((d: any) => (
            <li key={d.url}>
              <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline" style={{ color: accent }}>
                {d.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const PRICING_MODEL_LABELS = (enumsData as { pricing_labels?: Record<string, string> }).pricing_labels ?? {}

export function formatPricingConfidence(raw: string | undefined): string | null {
  if (!raw) return null
  const map: Record<string, string> = {
    not_stated: 'Not stated',
    supplier_reported: 'Supplier-reported',
    confirmed: 'Confirmed',
  }
  return map[raw] ?? raw.replace(/_/g, ' ')
}

export function formatPricingModelDisplay(raw: string | undefined): string {
  if (!raw || String(raw).trim() === '') return 'Information not available'
  const key = String(raw).trim()
  if (PRICING_MODEL_LABELS[key]) return PRICING_MODEL_LABELS[key]
  return key
}

function yesNo(value: boolean | undefined | null): string {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return 'Information not available'
}

function CommercialDlRow({
  label,
  value,
  mutedWhenEmpty,
  children,
}: {
  label: string
  value?: string | null
  mutedWhenEmpty?: boolean
  children?: React.ReactNode
}) {
  const has = children != null ? true : !!(value && String(value).trim())
  const content = children ?? value
  return (
    <div
      className="flex flex-col sm:flex-row sm:gap-4 gap-1 py-3 border-b last:border-0 text-sm"
      style={{ borderColor: 'var(--border)' }}
    >
      <dt className="w-full sm:w-52 flex-shrink-0 font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}
      </dt>
      <dd
        className="min-w-0 flex-1 leading-relaxed"
        style={{
          color: has || !mutedWhenEmpty ? 'var(--text-primary)' : 'var(--text-muted)',
        }}
      >
        {has ? content : 'Information not available'}
      </dd>
    </div>
  )
}

/** Pricing, procurement, service wrap — mirrors healthstore-m “Commercial model and cost”. */
export function CommercialModelAndCostSection({ app }: { app: any }) {
  const procurement = app.procurement_notes ?? app.contract_note
  const serviceWrapDetail = app.service_wrap_description ?? app.service_wrap_note
  const conf = formatPricingConfidence(app.pricing_confidence)

  return (
    <div>
      <dl className="mt-0">
        <CommercialDlRow label="Pricing model" value={formatPricingModelDisplay(app.pricing_model)} />
        <CommercialDlRow
          label="National price"
          value={
            app.national_price_available === true
              ? 'Available'
              : app.national_price_available === false
                ? 'Not available'
                : null
          }
          mutedWhenEmpty
        />
        <div
          className="flex flex-col sm:flex-row sm:gap-4 gap-1 py-3 border-b text-sm"
          style={{ borderColor: 'var(--border)' }}
        >
          <dt className="w-full sm:w-52 flex-shrink-0 font-medium" style={{ color: 'var(--text-muted)' }}>
            Indicative price
          </dt>
          <dd className="min-w-0 flex-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {app.indicative_price_text ?? 'Information not available'}
            {conf ? (
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Pricing confidence: {conf}
              </div>
            ) : null}
          </dd>
        </div>
        <CommercialDlRow label="Service wrap included" value={yesNo(app.service_wrap_included)} />
        <CommercialDlRow label="Service wrap details" value={serviceWrapDetail} mutedWhenEmpty />
        <CommercialDlRow label="Procurement notes" value={procurement} mutedWhenEmpty />
        {app.nhse_125k_note && (
          <CommercialDlRow label="NHSE £125k funding" value={app.nhse_125k_note} />
        )}
        {app.monitoring_model && (
          <CommercialDlRow label="Monitoring / ongoing service model" value={app.monitoring_model} />
        )}
      </dl>
      {app.free_offer_flag === true && (
        <div className="mt-4">
          <AlertBox type="warning">
            <strong>Free-tier access: </strong>
            Free-tier access typically does not include a full supplier service wrap. The ICB should expect to
            provide local onboarding, training and support independently unless otherwise agreed in contract.
          </AlertBox>
        </div>
      )}
    </div>
  )
}

function FinancialContextDlRow({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  const has = !!(value && String(value).trim())
  return (
    <div
      className="flex flex-col sm:flex-row sm:gap-4 gap-1 py-3 border-b last:border-0 text-sm"
      style={{ borderColor: 'var(--border)' }}
    >
      <dt className="w-full sm:w-52 flex-shrink-0 font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}
      </dt>
      <dd
        className="min-w-0 flex-1 leading-relaxed"
        style={{ color: has ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        {has ? value : 'Information not available'}
      </dd>
    </div>
  )
}

function IndicativeFinancialContextBody({ app }: { app: any }) {
  return (
    <div>
      <dl>
        <FinancialContextDlRow label="Expected benefit" value={app.expected_benefit_note} />
        <FinancialContextDlRow label="Tariff considerations" value={app.tariff_considerations} />
        <FinancialContextDlRow label="Provider income impact" value={app.provider_income_note} />
        <FinancialContextDlRow label="ROI note" value={app.roi_note} />
        {app.minimum_conditions_for_success && (
          <FinancialContextDlRow label="Minimum conditions for success" value={app.minimum_conditions_for_success} />
        )}
      </dl>
      <div className="mt-4 rounded-lg p-4" style={{ background: '#E6F0FB', border: '1px solid #A2C8E8' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#003087' }}>
          These are directional indicators only. Local finance modelling using actual baseline activity,
          population size and pathway design is required before any business case submission.
        </p>
      </div>
    </div>
  )
}

/** Tariff, ROI, benefit context — title lives on PDP expander row. */
export function IndicativeFinancialContextSection({ app }: { app: any }) {
  return <IndicativeFinancialContextBody app={app} />
}

export function RelatedFundingSection({ fundingIds }: { fundingIds: string[] }) {
  const funding = getCommissionerFacingFunding(fundingIds)
  return (
    <div>
      {funding.length > 0 ? (
        <div className="space-y-3">
          {funding.map((f: any) => (
            <div key={f.id} className="rounded-lg border p-4" style={{ borderColor: 'var(--border)', background: '#F7F9FC' }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
                <FundingStatusBadge status={f.status} />
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.description}</p>
              {f.total_value && (
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Value: {f.total_value}</div>
              )}
              {f.external_url && (
                <a href={f.external_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium mt-2 inline-block" style={{ color: 'var(--nhs-blue)' }}>
                  {f.external_url_label ?? 'More info'} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          No commissioner-facing cash or adoption-support schemes are linked to this product profile (supplier R&D routes
          and NICE reporting obligations are listed elsewhere). Browse the{' '}
          <Link href="/funding" className="font-medium underline" style={{ color: 'var(--nhs-blue)' }}>funding directory</Link>
          {' '}for wider opportunities.
        </p>
      )}
    </div>
  )
}
