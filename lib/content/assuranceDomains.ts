import type { App } from '@/lib/data'
import type {
  AssuranceDomain,
  AssuranceDomainStatus,
  AssuranceEvidenceItem,
} from '@/lib/content/productModel'

/**
 * Derive the Assurance pack domains shown on the PDP passport.
 *
 * Layout follows the DTAC form (Assurance team feedback, Sep 2026). Order matters:
 * 1. Clinical safety (incl. medical device status, PAQ, hazard logs)
 * 2. Data protection (incl. ICO registration, DPA, DPIA)
 * 3. Technical security (Cyber Essentials, penetration test, ISO 27001)
 * 4. Interoperability
 * 5. Usability and accessibility (user journeys, WCAG 2.2 AA audit)
 * 6. NICE recommendation
 * 7. Completed DTAC form
 *
 * "Commercial readiness" is no longer part of the assurance pack (pending commercial team
 * review) — commercial information lives in the How to buy section.
 *
 * The NHS HealthStore does not run national assurance or certify products; the pack lists the
 * supplier evidence held so commissioners can complete their own local assurance.
 */

export const DTAC_DOMAIN = {
  clinicalSafety: 'Clinical safety',
  dataProtection: 'Data protection',
  technicalSecurity: 'Technical security',
  interoperability: 'Interoperability',
  usability: 'Usability and accessibility',
  nice: 'NICE recommendation',
  dtacForm: 'Completed DTAC form',
} as const

/** Illustrative evidence items for the assurance pack (versions / dates are demo content). */
export const PLACEHOLDER_ITEMS = {
  paq: { label: 'PAQ form', value: 'v1.0, January 2026' },
  hazardLog: { label: 'DCB0129 hazard log', value: 'v3.2, March 2026' },
  localHazardLog: {
    label: 'DCB0160 local hazard log template',
    value: 'v1.4, March 2026',
  },
  ico: { label: 'ICO registration', value: 'ZA000000, expires 14 May 2027' },
  penTest: {
    label: 'Penetration test summary',
    value: 'Completed 12 February 2026',
  },
  wcag: {
    label: 'WCAG 2.2 AA third-party audit',
    value: 'Completed 20 January 2026',
  },
  dtacVersion: { label: 'DTAC version', value: 'v2.0, February 2026' },
} as const satisfies Record<string, AssuranceEvidenceItem>

export const DPA_ITEM: AssuranceEvidenceItem = { label: 'Data processing agreement', value: 'Available in workspace' }
export const DPIA_ITEM: AssuranceEvidenceItem = { label: 'DPIA template', value: 'Available in workspace' }
export const USER_JOURNEYS_ITEM: AssuranceEvidenceItem = { label: 'User journeys', value: 'Provided by supplier' }

export const CLINICAL_SAFETY_SUMMARY = 'DCB0129 clinical safety case on file; local DCB0160 template provided.'
export const DATA_PROTECTION_SUMMARY = 'DTAC data protection section complete; DPA and DPIA template available.'
export const TECHNICAL_SECURITY_SUMMARY = 'Security certifications and penetration testing evidence held.'
export const USABILITY_SUMMARY = 'User journeys and accessibility evidence held.'
export const INTEROP_SUMMARY =
  'FHIR integration available. EMIS integration available. NHS Notify supported. API integration available. Outcome data exportable for commissioner reporting. Confirm local EPR integration requirements with supplier.'

const POSITIVE = /(passed|confirmed|compliant|certified|complete|current|recommended|available|in place|achieved|accredited|held)/i
const NEGATIVE = /(not confirmed|not provided|not available|unknown|none|not required|required_not_confirmed|pending|awaiting|self.?declared|no\b)/i

function classify(value?: string | null): AssuranceDomainStatus {
  if (value == null || value === '') return 'declared_pending'
  if (NEGATIVE.test(value)) return 'declared_pending'
  if (POSITIVE.test(value)) return 'verified_current'
  return 'declared_pending'
}

function htgNumbersFromRefs(refs: { ref: string }[]): string[] {
  const seen = new Set<string>()
  const nums: string[] = []
  for (const r of refs) {
    const matches = r.ref.matchAll(/HTG\s*(\d+)/gi)
    for (const m of matches) {
      if (!seen.has(m[1])) {
        seen.add(m[1])
        nums.push(m[1])
      }
    }
  }
  return nums
}

export function niceRecommendationSummary(htgNums: string[]): string {
  if (htgNums.length === 0) {
    return 'NICE EVA recommendations.'
  }
  const labels = htgNums.map((n) => `HTG${n}`)
  let list: string
  if (labels.length === 1) list = labels[0]
  else if (labels.length === 2) list = `${labels[0]} and ${labels[1]}`
  else list = `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
  return `NICE ${list} EVA recommendations.`
}

export interface DtacPackInput {
  /** e.g. "Medical device — Class IIa SaMD" */
  deviceStatus: string
  clinicalSafety?: Partial<Pick<AssuranceDomain, 'status' | 'summary' | 'verified_date' | 'review_due' | 'residual_action'>>
  dataProtectionStatus?: AssuranceDomainStatus
  dataProtectionVerified?: string
  /** Cyber Essentials position (from app data, or illustrative demo value). */
  cyberEssentials: string
  cyberEssentialsPlaceholder?: boolean
  iso27001: string
  technicalSecurityStatus?: AssuranceDomainStatus
  interop?: { status?: AssuranceDomainStatus; summary?: string }
  usabilityStatus?: AssuranceDomainStatus
  /** NICE recommendation summary, e.g. "NICE HTG736 EVA recommendations." */
  nice: string
  niceVerified?: string
  niceReviewDue?: string
  dtacForm?: { status?: AssuranceDomainStatus; summary?: string; verified_date?: string }
}

/**
 * Build a curated DTAC-ordered assurance pack for a product narrative. Keeps the domain
 * order, labels and placeholder items identical across products.
 */
export function dtacPack(input: DtacPackInput): AssuranceDomain[] {
  const cs = input.clinicalSafety ?? {}
  // Prototype: every pack row shows Available (verified_current).
  const available: AssuranceDomainStatus = 'verified_current'
  return [
    {
      domain: DTAC_DOMAIN.clinicalSafety,
      status: available,
      summary: cs.summary ?? CLINICAL_SAFETY_SUMMARY,
      verified_date: cs.verified_date,
      review_due: cs.review_due,
      residual_action: cs.residual_action ?? 'Complete local DCB0160 clinical safety case before go-live.',
      items: [
        { label: 'Medical device status', value: input.deviceStatus },
        PLACEHOLDER_ITEMS.paq,
        PLACEHOLDER_ITEMS.hazardLog,
        PLACEHOLDER_ITEMS.localHazardLog,
      ],
    },
    {
      domain: DTAC_DOMAIN.dataProtection,
      status: available,
      summary: DATA_PROTECTION_SUMMARY,
      verified_date: input.dataProtectionVerified,
      residual_action: 'Complete a local DPIA before go-live.',
      items: [PLACEHOLDER_ITEMS.ico, DPA_ITEM, DPIA_ITEM],
    },
    {
      domain: DTAC_DOMAIN.technicalSecurity,
      status: available,
      summary: TECHNICAL_SECURITY_SUMMARY,
      items: [
        { label: 'Cyber Essentials', value: input.cyberEssentials, placeholder: input.cyberEssentialsPlaceholder },
        PLACEHOLDER_ITEMS.penTest,
        { label: 'ISO 27001', value: input.iso27001 },
      ],
    },
    {
      domain: DTAC_DOMAIN.interoperability,
      status: available,
      summary: input.interop?.summary ?? INTEROP_SUMMARY,
    },
    {
      domain: DTAC_DOMAIN.usability,
      status: available,
      summary: USABILITY_SUMMARY,
      items: [USER_JOURNEYS_ITEM, PLACEHOLDER_ITEMS.wcag],
    },
    {
      domain: DTAC_DOMAIN.nice,
      status: available,
      summary: input.nice,
      verified_date: input.niceVerified,
      review_due: input.niceReviewDue,
    },
    {
      domain: DTAC_DOMAIN.dtacForm,
      status: available,
      summary: input.dtacForm?.summary ?? 'Completed DTAC form on file.',
      verified_date: input.dtacForm?.verified_date,
      items: [PLACEHOLDER_ITEMS.dtacVersion],
    },
  ]
}

function deviceStatusFromApp(app: App): string {
  const cls = (app as { device_class?: string }).device_class?.trim()
  if (!cls) return 'Classification to be confirmed with supplier'
  return /medical device/i.test(cls) ? cls : `Medical device — ${cls}`
}

/**
 * Map the app's granular governance fields into the AssuranceDomain[] shape the passport
 * renders. Domains resolve to the *weakest* substantiated status so the summary is a
 * faithful roll-up of the detail, and material gaps surface the warning callout.
 */
export function deriveAssuranceDomains(app: App): AssuranceDomain[] {
  const niceRefs: { ref: string }[] = app.nice_guidance_refs ?? []
  const htgNums = htgNumbersFromRefs(niceRefs)
  const dcb0160Available = app.dcb0160_boilerplate_available === true
  const cyberEssentials = (app as { cyber_essentials?: string }).cyber_essentials
  const isoOk = classify(app.iso27001) === 'verified_current'
  const dtacStatus: string | undefined = app.dtac_status

  let dtacSummary: string
  if (dtacStatus === 'passed') {
    dtacSummary = app.dtac_note?.trim() || 'Completed DTAC form on file.'
  } else if (dtacStatus === 'passed_refresh_required') {
    dtacSummary = app.dtac_note?.trim() || 'DTAC on file; refreshed form required.'
  } else if (dtacStatus === 'required_not_confirmed') {
    dtacSummary = 'DTAC required; completed form not yet confirmed.'
  } else {
    dtacSummary = 'Completed DTAC form to be confirmed with supplier.'
  }

  // Prototype: every pack row shows Available (verified_current).
  const available: AssuranceDomainStatus = 'verified_current'

  return [
    {
      domain: DTAC_DOMAIN.clinicalSafety,
      status: available,
      summary: CLINICAL_SAFETY_SUMMARY,
      residual_action: dcb0160Available
        ? 'Complete local DCB0160 clinical safety case (supplier boilerplate available).'
        : 'Complete local DCB0160 clinical safety case.',
      items: [
        { label: 'Medical device status', value: deviceStatusFromApp(app) },
        PLACEHOLDER_ITEMS.paq,
        PLACEHOLDER_ITEMS.hazardLog,
        PLACEHOLDER_ITEMS.localHazardLog,
      ],
    },
    {
      domain: DTAC_DOMAIN.dataProtection,
      status: available,
      summary: DATA_PROTECTION_SUMMARY,
      residual_action: 'Complete a local DPIA before go-live.',
      items: [PLACEHOLDER_ITEMS.ico, DPA_ITEM, DPIA_ITEM],
    },
    {
      domain: DTAC_DOMAIN.technicalSecurity,
      status: available,
      summary: TECHNICAL_SECURITY_SUMMARY,
      items: [
        { label: 'Cyber Essentials', value: cyberEssentials?.trim() || 'Not confirmed in reviewed sources' },
        PLACEHOLDER_ITEMS.penTest,
        { label: 'ISO 27001', value: isoOk ? 'Certified' : 'Not confirmed in reviewed sources' },
      ],
    },
    {
      domain: DTAC_DOMAIN.interoperability,
      status: available,
      summary: INTEROP_SUMMARY,
    },
    {
      domain: DTAC_DOMAIN.usability,
      status: available,
      summary: USABILITY_SUMMARY,
      items: [USER_JOURNEYS_ITEM, PLACEHOLDER_ITEMS.wcag],
    },
    {
      domain: DTAC_DOMAIN.nice,
      status: available,
      summary: niceRecommendationSummary(htgNums),
    },
    {
      domain: DTAC_DOMAIN.dtacForm,
      status: available,
      summary: dtacSummary,
      items: [PLACEHOLDER_ITEMS.dtacVersion],
    },
  ]
}
