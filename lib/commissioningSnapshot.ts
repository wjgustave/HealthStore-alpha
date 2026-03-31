import { formatPricingModelDisplay } from '@/components/AppDetailSections'

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
      /** Replaces plain subline when present (e.g. link to /funding). */
      opportunitiesLink?: { href: string; label: string }
    }
  | {
      kind: 'guidance'
      label: string
      primary: string
      subline?: string
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
    label: 'Cost & licensing',
    xlText,
    indicativeNote,
    modelPills,
    href: '#commercial-model',
    linkText: 'Commercial model and cost',
    subline: subParts.length ? subParts.join(' · ') : undefined,
  }
}

function fundingCard(app: any, linked: SnapshotFundingRow[]): CommissioningSnapshotCard {
  const pills: string[] = []
  if (app.nhse_125k_eligible === true) {
    pills.push('NHSE £125k — eligible')
  }
  for (const f of linked) {
    if (f.title && String(f.title).trim()) {
      pills.push(String(f.title).trim())
    }
  }

  if (pills.length === 0) {
    return {
      kind: 'funding',
      label: 'Funding & schemes',
      pills: ['None linked in profile'],
      subline: 'See Related funding for routes that may apply',
    }
  }

  return {
    kind: 'funding',
    label: 'Funding & schemes',
    pills,
    opportunitiesLink: { href: '/funding', label: 'Funding opportunities' },
  }
}

function guidanceCard(app: any): CommissioningSnapshotCard {
  const refs = app.nice_guidance_refs as { ref: string; url?: string; type?: string; date?: string }[] | undefined
  if (!refs?.length) {
    return {
      kind: 'guidance',
      label: 'National guidance',
      primary: 'No NICE references in profile',
      subline: 'Check sections below for other evidence and assurance context',
    }
  }
  const r = refs[0]
  const bits = [r.date, r.type].filter(Boolean).join(' · ')
  return {
    kind: 'guidance',
    label: 'National guidance',
    primary: r.ref,
    subline: bits || 'See NICE guidance section for full list',
  }
}

export function getCommissioningSnapshot(app: any, linkedFunding: SnapshotFundingRow[]): CommissioningSnapshotCard[] {
  return [regulationCard(app), costCard(app), fundingCard(app, linkedFunding), guidanceCard(app)]
}
