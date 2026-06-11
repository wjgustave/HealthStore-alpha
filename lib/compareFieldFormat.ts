import type { App } from '@/lib/data'
import { CHECK_WITH_SUPPLIER } from '@/lib/data'
import { formatPricingModelDisplay } from '@/components/AppDetailSections'
import { evidenceLabels } from '@/lib/data'
import { getWhereLiveSummary } from '@/lib/whereLiveSummary'

/** Single empty-state token for compare cells (aligned with PDP). */
export const NOT_STATED = CHECK_WITH_SUPPLIER

const MAX_INTEGRATIONS_CHARS = 200
const MAX_INDICATIVE_PRICE_CHARS = 120
const MAX_ONBOARDING_DETAIL_CHARS = 140
const MAX_LIVE_SITES_CHARS = 160

function truncateEnd(text: string, maxLen: number): string {
  const t = text.trim()
  if (t.length <= maxLen) return t
  return `${t.slice(0, Math.max(0, maxLen - 1)).trim()}…`
}

/** Pick first non-empty string; otherwise NOT_STATED. */
export function pickStr(...values: (string | undefined | null | false)[]): string {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return NOT_STATED
}

/** Format onboarding_model snake_case to Title Case words. */
export function formatOnboardingModelLabel(model: string | undefined): string {
  if (!model?.trim()) return ''
  return model.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/** Therapeutic purpose with fallbacks per blueprint. */
export function getTherapeuticPurpose(app: App): string {
  const ctx = app.context_of_use as { therapeutic_purpose?: string } | undefined
  return pickStr(ctx?.therapeutic_purpose, app.one_line_value_proposition)
}

/** Clinical pathways list as comma-separated labels. */
export function getClinicalPathways(app: App): string {
  const ctx = app.context_of_use as { pathways?: string[] } | undefined
  const fromCtx = ctx?.pathways?.filter(Boolean).join(', ')
  const fromTags = Array.isArray(app.pathway_tags) ? app.pathway_tags.map((t: string) => t.replace(/-/g, ' ')).join(', ') : ''
  return pickStr(fromCtx, fromTags)
}

/** Care settings list. */
export function getCareSettings(app: App): string {
  const ctx = app.context_of_use as { care_settings?: string[] } | undefined
  const raw = ctx?.care_settings?.filter(Boolean).join(', ')
  return pickStr(raw)
}

/** First paragraph of evidence_summary (split on blank lines); capped length. */
export function getClinicalEvidenceExcerpt(app: App, maxLen = 320): string {
  const raw = app.evidence_summary
  if (!raw?.trim()) return NOT_STATED
  const firstBlock = raw.trim().split(/\n\s*\n/)[0]?.trim() ?? raw.trim()
  return truncateEnd(firstBlock, maxLen)
}

/** Expected benefit narrative. */
export function getExpectedBenefit(app: App): string {
  const raw = app.expected_benefit_note
  if (!raw?.trim()) return NOT_STATED
  return truncateEnd(raw.trim(), 280)
}

/**
 * NICE guidance status: refs list + optional scope line from context_of_use.
 */
export function getNiceGuidanceStatus(app: App): string {
  const refs = app.nice_guidance_refs as { ref: string; date?: string }[] | undefined
  const scope = (app.context_of_use as { nice_scope?: string } | undefined)?.nice_scope

  const refParts: string[] = []
  if (Array.isArray(refs) && refs.length > 0) {
    refs.forEach((r) => {
      if (!r?.ref) return
      refParts.push(r.date ? `${r.ref} (${r.date})` : r.ref)
    })
  }

  const primary = refParts.length ? refParts.join('; ') : ''
  if (primary && scope) return truncateEnd(`${primary} · ${scope}`, 360)
  if (primary) return truncateEnd(primary, 360)
  if (scope) return scope
  return NOT_STATED
}

/** Short onboarding line: label + truncated detail. */
export function getOnboardingCompareLine(app: App): string {
  const label = formatOnboardingModelLabel(app.onboarding_model)
  const detail = typeof app.onboarding_detail === 'string' ? app.onboarding_detail.trim() : ''
  if (!label && !detail) return NOT_STATED
  if (!detail) return label || NOT_STATED
  const shortDetail = truncateEnd(detail, MAX_ONBOARDING_DETAIL_CHARS)
  return label ? `${label}: ${shortDetail}` : shortDetail
}

/** live_icbs count + abbreviated named sites (structured `named_sites` names joined, else legacy `live_sites`). */
export function getLiveIcbsDisplay(app: App): string {
  const n = app.live_icbs
  const rawNamed = app.named_sites as Array<{ name?: string }> | undefined
  let sites = ''
  if (Array.isArray(rawNamed) && rawNamed.length > 0) {
    const parts = rawNamed
      .map((r) => (typeof r?.name === 'string' ? r.name.trim() : ''))
      .filter(Boolean)
    if (parts.length > 0) sites = parts.join(' · ')
  }
  if (!sites) {
    sites = typeof app.live_sites === 'string' ? app.live_sites.trim() : ''
  }

  const countPart =
    typeof n === 'number' && Number.isFinite(n)
      ? `${n} live ICB area${n === 1 ? '' : 's'}`
      : ''

  if (countPart && sites) {
    return `${countPart} · ${truncateEnd(sites, MAX_LIVE_SITES_CHARS)}`
  }
  if (sites) return truncateEnd(sites, MAX_LIVE_SITES_CHARS + 40)
  if (countPart) return countPart
  return NOT_STATED
}

/** Service wrap Yes / No badge label. */
export function getServiceWrapYn(app: App): 'Yes' | 'No' | typeof NOT_STATED {
  if (app.service_wrap_included === true) return 'Yes'
  if (app.service_wrap_included === false) return 'No'
  return NOT_STATED
}

type TechnicalIntegrations = Record<string, unknown>

/** Commissioner-facing integrations snippet from technical_integrations. */
export function getIntegrationsSummary(app: App): string {
  const ti = app.technical_integrations as TechnicalIntegrations | undefined
  if (!ti || typeof ti !== 'object') return NOT_STATED

  const parts: string[] = []

  const fhir = ti.fhir
  if (typeof fhir === 'string' && fhir.trim()) parts.push(`FHIR: ${fhir.trim()}`)

  const emis = ti.emis
  if (typeof emis === 'string' && emis.trim()) parts.push(`EMIS: ${emis.trim()}`)

  const devices = ti.device_integration
  if (typeof devices === 'string' && devices.trim()) parts.push(devices.trim())

  const dash = ti.population_health_dashboard
  if (dash === true) parts.push('Population health dashboard')

  const nhsApp = ti.nhs_app
  if (typeof nhsApp === 'boolean') parts.push(`NHS App: ${nhsApp ? 'Yes' : 'No'}`)

  const hosting = ti.data_hosting
  if (typeof hosting === 'string' && hosting.trim()) parts.push(`Hosting: ${hosting.trim()}`)

  if (parts.length === 0) return NOT_STATED
  return truncateEnd(parts.join(' · '), MAX_INTEGRATIONS_CHARS)
}

/** Short indicative price: first sentence / clause. */
export function getIndicativePriceShort(app: App): string {
  const raw = app.indicative_price_text
  if (!raw?.trim()) return NOT_STATED
  const oneLine = raw.trim().replace(/\s+/g, ' ')
  const sentenceMatch = oneLine.match(/^[^.!?]+[.!?]?/)
  const first = sentenceMatch ? sentenceMatch[0].trim() : oneLine
  return truncateEnd(first, MAX_INDICATIVE_PRICE_CHARS)
}

/** Where it's live — uses deployment_register via getWhereLiveSummary. */
export function getWhereLiveCompare(app: App): string {
  const { headline, detail, icbText } = getWhereLiveSummary(app)
  if (headline === 'Deployment footprint not yet recorded') return NOT_STATED
  const parts = [headline]
  if (detail) parts.push(detail)
  if (icbText && !headline.toLowerCase().includes('across')) parts.push(icbText)
  return parts.join(' · ')
}

/** Pricing model for compare cells. */
export function getPricingModelDisplay(app: App): string {
  const model = formatPricingModelDisplay(app.pricing_model)
  const parts: string[] = []
  if (model?.trim()) parts.push(model.trim())
  if (app.free_offer_flag === true) parts.push('Free offer')
  return parts.length > 0 ? parts.join(' · ') : NOT_STATED
}

/** Evidence strength label for text comparison. */
export function getEvidenceStrengthText(app: App): string {
  const raw = app.evidence_strength
  if (!raw?.trim()) return NOT_STATED
  return evidenceLabels[raw] ?? raw
}

/** Cyber Essentials / ISO 27001 / DSPT combined line. */
export function getAssuranceSummary(app: App): string {
  const parts: string[] = []
  if (app.cyber_essentials?.trim()) parts.push(`Cyber Essentials: ${app.cyber_essentials.trim()}`)
  if (app.iso27001?.trim()) parts.push(`ISO 27001: ${app.iso27001.trim()}`)
  if (app.dspt_status?.trim()) parts.push(`DSPT: ${app.dspt_status.trim()}`)
  return parts.length > 0 ? truncateEnd(parts.join(' · '), 200) : NOT_STATED
}

/** NHS App / Login / Notify summary. */
export function getNhsIntegrationsSummary(app: App): string {
  const parts: string[] = []
  if (app.nhs_app_integration === true) parts.push('NHS App')
  if (app.nhs_notify_integration === true) parts.push('NHS Notify')
  if (app.nhs_login_integration === true) parts.push('NHS Login')
  return parts.length > 0 ? parts.join(', ') : NOT_STATED
}

/** Data hosting from technical_integrations. */
export function getDataHosting(app: App): string {
  const ti = app.technical_integrations as { data_hosting?: string } | undefined
  return pickStr(ti?.data_hosting)
}

/** NHSE £125k and related funding eligibility line. */
export function getFundingEligibility(app: App): string {
  const parts: string[] = []
  if (app.nhse_125k_eligible === true && app.slug !== 'clinitouch') {
    parts.push('NHSE £125k — eligible')
  }
  if (app.nhse_125k_note?.trim()) parts.push(truncateEnd(app.nhse_125k_note.trim(), 120))
  return parts.length > 0 ? parts.join(' · ') : NOT_STATED
}

/**
 * Normalised plain-text value for a compare row — used for "differences only" filtering.
 * Keys match COMPARE_ROWS in lib/compareConfig.ts.
 */
export function getCompareRowTextValue(app: App, rowKey: string): string {
  switch (rowKey) {
    case 'conditions': {
      const tags = Array.isArray(app.condition_tags) ? app.condition_tags : []
      return tags.length > 0 ? tags.join(',') : NOT_STATED
    }
    case 'therapeutic':
      return getTherapeuticPurpose(app)
    case 'pathways':
      return getClinicalPathways(app)
    case 'care_settings':
      return getCareSettings(app)
    case 'evidence_excerpt':
      return getClinicalEvidenceExcerpt(app)
    case 'expected_benefit':
      return getExpectedBenefit(app)
    case 'nice':
      return getNiceGuidanceStatus(app)
    case 'evidence_strength':
      return getEvidenceStrengthText(app)
    case 'where_live':
      return getWhereLiveCompare(app)
    case 'maturity':
      return pickStr(app.maturity_level)
    case 'onboarding':
      return getOnboardingCompareLine(app)
    case 'service_wrap':
      return getServiceWrapYn(app)
    case 'dtac':
      return pickStr(app.dtac_status)
    case 'dcb0129':
      return pickStr(app.dcb0129_status)
    case 'device_class':
      return pickStr(app.device_class)
    case 'assurance':
      return getAssuranceSummary(app)
    case 'pricing_model':
      return getPricingModelDisplay(app)
    case 'indicative_price':
      return getIndicativePriceShort(app)
    case 'funding':
      return getFundingEligibility(app)
    case 'nhs_integrations':
      return getNhsIntegrationsSummary(app)
    case 'integrations':
      return getIntegrationsSummary(app)
    case 'data_hosting':
      return getDataHosting(app)
    default:
      return NOT_STATED
  }
}
