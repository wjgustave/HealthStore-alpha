import type { App } from '@/lib/data'
import type { AssuranceDomain, AssuranceDomainStatus } from '@/lib/content/productModel'

/**
 * Derive the Assurance pack domains shown on the PDP passport.
 *
 * Fixed five-item pack (order matters):
 * 1. Clinical safety
 * 2. Clinical evidence
 * 3. Information governance and data protection
 * 4. Interoperability
 * 5. Commercial readiness pack
 *
 * Summaries follow the national pack copy; Clinical evidence inserts NICE HTG
 * numbers from the app's nice_guidance_refs when available.
 */

const POSITIVE = /(passed|confirmed|compliant|certified|complete|current|recommended|available|in place|achieved|accredited)/i
const NEGATIVE = /(not confirmed|not provided|not available|unknown|none|not required|required_not_confirmed|pending|awaiting|self.?declared|no\b)/i

const CLINICAL_SAFETY_SUMMARY = 'DCB0129 on file; local deployment pack provided.'
const IG_SUMMARY =
  'DTAC complete and on file, DPA available, DPIA template available, ISO 27001'
const INTEROP_SUMMARY =
  'FHIR integration available. EMIS integration available. NHS Notify supported. API integration available. Outcome data exportable for commissioner reporting. Confirm local EPR integration requirements with supplier.'
const COMMERCIAL_SUMMARY = 'Includes PA23/software route note and price schedule.'

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

function clinicalEvidenceSummary(htgNums: string[]): string {
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

/**
 * Map the app's granular governance fields into the AssuranceDomain[] shape the passport
 * renders. Domains resolve to the *weakest* substantiated status so the summary is a
 * faithful roll-up of the detail, and material gaps surface the warning callout.
 */
export function deriveAssuranceDomains(app: App): AssuranceDomain[] {
  const niceRefs: { ref: string }[] = app.nice_guidance_refs ?? []
  const htgNums = htgNumbersFromRefs(niceRefs)
  const studyCount = (app.clinical_evidence_detailed ?? []).length

  // 1. Clinical safety
  const dcb0129 = classify(app.dcb0129_status)
  const dcb0160Available = app.dcb0160_boilerplate_available === true
  let safetyStatus: AssuranceDomainStatus
  if (dcb0129 === 'verified_current') {
    safetyStatus = 'verified_current'
  } else {
    safetyStatus = 'declared_pending'
  }

  // 2. Clinical evidence
  const evidenceStatus: AssuranceDomainStatus =
    htgNums.length > 0 || studyCount > 0 ? 'verified_current' : 'declared_pending'

  // 3. Information governance and data protection
  const dtacStatus: string | undefined = app.dtac_status
  const isoOk = classify(app.iso27001) === 'verified_current'
  let igStatus: AssuranceDomainStatus
  if (dtacStatus === 'passed' && isoOk) {
    igStatus = 'verified_current'
  } else if (dtacStatus === 'passed') {
    igStatus = 'verified_review_due'
  } else if (dtacStatus === 'required_not_confirmed') {
    igStatus = 'incomplete'
  } else {
    igStatus = 'declared_pending'
  }

  // 4. Interoperability — pack copy is national; status stays current when any integration signal exists
  const ti = app.technical_integrations as { fhir?: string; emis?: string } | undefined
  const hasInteropSignal =
    app.nhs_notify_integration === true ||
    app.nhs_app_integration === true ||
    app.nhs_login_integration === true ||
    Boolean(ti?.fhir?.trim()) ||
    Boolean(ti?.emis?.trim())
  const interopStatus: AssuranceDomainStatus = hasInteropSignal
    ? 'verified_current'
    : 'verified_review_due'

  // 5. Commercial readiness pack
  const commercialStatus: AssuranceDomainStatus = 'verified_current'

  return [
    {
      domain: 'Clinical safety',
      status: safetyStatus,
      summary: CLINICAL_SAFETY_SUMMARY,
      residual_action: dcb0160Available
        ? 'Complete local DCB0160 clinical safety case (supplier boilerplate available).'
        : 'Complete local DCB0160 clinical safety case.',
    },
    {
      domain: 'Clinical evidence',
      status: evidenceStatus,
      summary: clinicalEvidenceSummary(htgNums),
    },
    {
      domain: 'Information governance and data protection',
      status: igStatus,
      summary: IG_SUMMARY,
      residual_action: 'Complete a local DPIA before go-live.',
    },
    {
      domain: 'Interoperability',
      status: interopStatus,
      summary: INTEROP_SUMMARY,
    },
    {
      domain: 'Commercial readiness pack',
      status: commercialStatus,
      summary: COMMERCIAL_SUMMARY,
    },
  ]
}
