import type { ReactNode } from 'react'
import type { App } from '@/lib/data'
import { DtacBadge, EvidenceBadge, MaturityBadge } from '@/components/Badges'
import { appConditionTags, formatConditionLabels } from '@/lib/compareConditions'
import {
  NOT_STATED,
  getTherapeuticPurpose,
  getClinicalPathways,
  getCareSettings,
  getClinicalEvidenceExcerpt,
  getExpectedBenefit,
  getNiceGuidanceStatus,
  getOnboardingCompareLine,
  getWhereLiveCompare,
  getServiceWrapYn,
  getIntegrationsSummary,
  getIndicativePriceShort,
  getPricingModelDisplay,
  getAssuranceSummary,
  getNhsIntegrationsSummary,
  getDataHosting,
  getFundingEligibility,
  pickStr,
} from '@/lib/compareFieldFormat'
import type { CompareRowDef } from '@/lib/compareConfig'

function cellText(text: string) {
  return (
    <span className="leading-relaxed" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
      {text}
    </span>
  )
}

function ServiceWrapBadge({ value }: { value: ReturnType<typeof getServiceWrapYn> }) {
  if (value === NOT_STATED) {
    return <span className="badge badge-amber">{NOT_STATED}</span>
  }
  return value === 'Yes' ? (
    <span className="badge badge-green">Yes</span>
  ) : (
    <span className="badge badge-grey">No</span>
  )
}

const ROW_RENDERERS: Record<string, (app: App) => ReactNode> = {
  conditions: app => cellText(formatConditionLabels(appConditionTags(app))),
  therapeutic: app => cellText(getTherapeuticPurpose(app)),
  pathways: app => cellText(getClinicalPathways(app)),
  care_settings: app => cellText(getCareSettings(app)),
  evidence_excerpt: app => cellText(getClinicalEvidenceExcerpt(app)),
  expected_benefit: app => cellText(getExpectedBenefit(app)),
  nice: app => cellText(getNiceGuidanceStatus(app)),
  evidence_strength: app =>
    app.evidence_strength ? (
      <EvidenceBadge strength={app.evidence_strength} />
    ) : (
      cellText(NOT_STATED)
    ),
  where_live: app => cellText(getWhereLiveCompare(app)),
  maturity: app => <MaturityBadge level={app.maturity_level} />,
  onboarding: app => cellText(getOnboardingCompareLine(app)),
  service_wrap: app => <ServiceWrapBadge value={getServiceWrapYn(app)} />,
  dtac: app => <DtacBadge status={app.dtac_status} />,
  dcb0129: app => cellText(pickStr(app.dcb0129_status)),
  device_class: app => cellText(pickStr(app.device_class)),
  assurance: app => cellText(getAssuranceSummary(app)),
  pricing_model: app => cellText(getPricingModelDisplay(app)),
  indicative_price: app => cellText(getIndicativePriceShort(app)),
  funding: app => cellText(getFundingEligibility(app)),
  nhs_integrations: app => cellText(getNhsIntegrationsSummary(app)),
  integrations: app => cellText(getIntegrationsSummary(app)),
  data_hosting: app => cellText(getDataHosting(app)),
}

export function renderCompareRow(row: CompareRowDef, app: App): ReactNode {
  const render = ROW_RENDERERS[row.key]
  return render ? render(app) : cellText(NOT_STATED)
}
