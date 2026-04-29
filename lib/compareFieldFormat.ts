import type { App } from '@/lib/data'

/** Single empty-state token for compare cells (PO-approved consistency). */
export const NOT_STATED = 'Not stated'

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
