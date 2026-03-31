import { formatPricingModelDisplay } from '@/components/AppDetailSections'

/** Tri-state for prose fields (FHIR / EMIS); NHS rows use boolean only. */
export type InteropIntegrationValue = boolean | null

export type InteropSnapshotItem = {
  key: string
  /** Display label (NHS App / Notify / Login row, or FHIR / EMIS pill text). */
  name: string
  integrated: InteropIntegrationValue
  /** When set, bottom-row FHIR / EMIS use bordered pill; NHS top row uses `name` as dark blue text. */
  textLabel?: string
}

export type SnapshotFundingRow = { id: string; title: string; status: string }

export type RegulationSnapshotPill = {
  label: string
  /** Softer styling when the programme type is not present (e.g. NICE-EVA). */
  muted?: boolean
}

export type CommissioningSnapshotCard =
  | {
      kind: 'regulation'
      label: string
      pills: RegulationSnapshotPill[]
    }
  | {
      kind: 'cost'
      label: string
      xlText: string
      /** Shown in small type immediately after the XL cost when pricing is indicative. */
      indicativeNote?: string
      modelPills: string[]
      href: string
      linkText: string
      subline?: string
    }
  | {
      kind: 'funding'
      label: string
      pills: string[]
      subline?: string
      /** Replaces plain subline when present (e.g. in-page anchor to Related funding). */
      opportunitiesLink?: { href: string; label: string }
    }
  | {
      kind: 'interop'
      label: string
      items: InteropSnapshotItem[]
      /** Shown when `technical_integrations` exists (anchor to integrations section). */
      detailsLink?: { href: string; label: string }
    }

/** Extract compact £–£ ranges from prose (e.g. £50–£100); returns up to two distinct ranges. */
function extractPriceRanges(text: string | undefined | null): string | null {
  if (!text || !String(text).trim()) return null
  const s = String(text)
  const re = /£[\d.,]+\s*[–\-—]\s*£?[\d.,]+/g
  const matches = s.match(re)
  if (!matches?.length) return null
  const normalized = matches.map(m => m.replace(/\s+/g, ''))
  const uniq = [...new Set(normalized)]
  return uniq.slice(0, 2).join(' · ')
}

/**
 * Infer yes / no / unknown from `technical_integrations` prose.
 * Negatives → no; positives → yes; empty or ambiguous → unknown.
 */
function inferProseIntegration(value: string | undefined | null): InteropIntegrationValue {
  const t = String(value ?? '').trim().toLowerCase()
  if (!t) return null
  const negatives = [
    'not confirmed',
    'information not available',
    'not available',
    'n/a',
    'none',
    'no integration',
    'not integrated',
  ]
  if (negatives.some(n => t.includes(n))) return false
  const positives = [
    'available',
    'compatible',
    'integration',
    'fhir',
    'emis',
    'r4',
    'hl7',
    'api',
    'via ',
    'supported',
    'connect',
  ]
  if (positives.some(p => t.includes(p))) return true
  return null
}

function regulationCard(app: any): CommissioningSnapshotCard {
  const refs = (app.nice_guidance_refs ?? []) as { type?: string }[]
  const hasEva = refs.some(r => r.type === 'EVA')

  return {
    kind: 'regulation',
    label: 'Regulation',
    pills: [
      { label: 'NICE-EVA', muted: !hasEva },
      { label: 'DTAC' },
      { label: 'Cyber Essentials' },
    ],
  }
}

function costCard(app: any): CommissioningSnapshotCard {
  const model = formatPricingModelDisplay(app.pricing_model)
  const range = extractPriceRanges(app.indicative_price_text)
  const indicativeConfidence = app.pricing_confidence === 'indicative'

  const xlText =
    range ??
    (app.free_offer_flag === true ? 'Free' : '—')

  const indicativeNote = indicativeConfidence ? 'Indicative' : undefined

  const modelPills: string[] = []
  if (model && String(model).trim()) {
    modelPills.push(String(model).trim())
  }

  const subParts: string[] = []
  if (app.free_offer_flag === true && range) {
    subParts.push('Free offer may apply — confirm scope with supplier')
  } else if (!range && app.free_offer_flag !== true) {
    subParts.push('See Commercial model and cost for full pricing detail')
  }

  return {
    kind: 'cost',
    label: 'Pricing',
    xlText,
    indicativeNote,
    modelPills,
    href: '#commercial-model',
    linkText: 'Commercial model and cost',
    subline: subParts.length ? subParts.join(' · ') : undefined,
  }
}

function fundingCard(app: any, linked: SnapshotFundingRow[]): CommissioningSnapshotCard | null {
  const pills: string[] = []
  const showNhse125Pill =
    app.nhse_125k_eligible === true && app.slug !== 'clinitouch'
  if (showNhse125Pill) {
    pills.push('NHSE £125k — eligible')
  }
  for (const f of linked) {
    if (f.title && String(f.title).trim()) {
      pills.push(String(f.title).trim())
    }
  }

  if (pills.length === 0) {
    return null
  }

  return {
    kind: 'funding',
    label: 'Funding opportunities',
    pills,
    opportunitiesLink: { href: '#related-funding', label: 'Related funding opportunities' },
  }
}

function interopCard(app: any): CommissioningSnapshotCard {
  const ti = app.technical_integrations as { fhir?: string; emis?: string } | undefined
  const fhirState = ti ? inferProseIntegration(ti.fhir) : null
  const emisState = ti ? inferProseIntegration(ti.emis) : null
  /** Optional per-app override: show NHS App logo in snapshot when `nhs_app_integration` is false (e.g. Luscii). */
  const nhsAppInInteropSnapshot =
    app.nhs_app_integration === true || app.interop_snapshot_show_nhs_app === true

  const items: InteropSnapshotItem[] = [
    {
      key: 'nhs_app',
      name: 'NHS App',
      integrated: nhsAppInInteropSnapshot,
    },
    {
      key: 'nhs_notify',
      name: 'NHS Notify',
      integrated: app.nhs_notify_integration === true,
    },
    {
      key: 'nhs_login',
      name: 'NHS Login',
      integrated: app.nhs_login_integration === true,
    },
    {
      key: 'fhir',
      name: 'FHIR',
      integrated: fhirState,
      textLabel: 'FHIR',
    },
    {
      key: 'emis',
      name: 'EMIS',
      integrated: emisState,
      textLabel: 'EMIS',
    },
  ]

  return {
    kind: 'interop',
    label: 'Interoperability',
    items,
    detailsLink: { href: '#nhs-integrations', label: 'NHS and care system integrations' },
  }
}

export function getCommissioningSnapshot(app: any, linkedFunding: SnapshotFundingRow[]): CommissioningSnapshotCard[] {
  const funding = fundingCard(app, linkedFunding)
  return [regulationCard(app), costCard(app), ...(funding ? [funding] : []), interopCard(app)]
}
