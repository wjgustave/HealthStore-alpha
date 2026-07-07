import type { App } from '@/lib/data'
import type { AssuranceDomain, AssuranceDomainStatus } from '@/lib/content/productModel'
import { CHECK_WITH_SUPPLIER } from '@/lib/data'

/**
 * Round 3 content migration (R3-3 C): derive the assurance passport domains from the
 * granular governance record in content/apps/{slug}.json, rather than a hand-authored
 * summary. Deriving from the detail means the summary can never overstate it — the
 * reconcile finding in /DS/Audits/Luscii-Content-Mig-4 (IG marked "verified — current"
 * while ISO 27001 / Cyber Essentials were unconfirmed) is fixed structurally: the IG
 * domain now resolves to "review due" with a residual action whenever those are missing.
 *
 * Works for any product (supports R3-4 D data-driven gating) with no per-slug authoring.
 */

const POSITIVE = /(passed|confirmed|compliant|certified|complete|current|recommended|available|in place|achieved|accredited)/i
const NEGATIVE = /(not confirmed|not provided|not available|unknown|none|not required|required_not_confirmed|pending|awaiting|self.?declared|no\b)/i

function classify(value?: string | null): AssuranceDomainStatus {
  if (value == null || value === '') return 'declared_pending'
  if (NEGATIVE.test(value)) return 'declared_pending'
  if (POSITIVE.test(value)) return 'verified_current'
  return 'declared_pending'
}

function firstSentence(text?: string | null): string | undefined {
  if (!text) return undefined
  const m = text.match(/^[^.]+\./)
  return (m ? m[0] : text).trim()
}

function dtacLabel(status?: string): string {
  switch (status) {
    case 'passed':
      return 'complete'
    case 'required_not_confirmed':
      return 'required, not confirmed'
    case 'not_required':
      return 'not required'
    default:
      return status ?? 'not recorded'
  }
}

/**
 * Map the app's granular governance fields into the AssuranceDomain[] shape the passport
 * renders. Domains resolve to the *weakest* substantiated status so the summary is a
 * faithful roll-up of the detail, and material gaps surface the warning callout.
 */
export function deriveAssuranceDomains(app: App): AssuranceDomain[] {
  const domains: AssuranceDomain[] = []

  // 1. Clinical evidence and NICE
  const niceRefs: { ref: string }[] = app.nice_guidance_refs ?? []
  const studyCount = (app.clinical_evidence_detailed ?? []).length
  if (niceRefs.length > 0 || studyCount > 0) {
    const parts: string[] = []
    if (niceRefs.length > 0) parts.push(`NICE ${niceRefs.map((r) => r.ref).join(', ')}`)
    if (studyCount > 0) parts.push(`${studyCount} evidence source${studyCount === 1 ? '' : 's'} on file`)
    domains.push({
      domain: 'Clinical evidence and NICE',
      status: 'verified_current',
      summary: parts.join('; '),
    })
  } else {
    domains.push({
      domain: 'Clinical evidence and NICE',
      status: 'declared_pending',
      summary: 'No NICE guidance or structured evidence recorded — confirm the evidence base with the supplier.',
    })
  }

  // 2. Medical device regulation
  const deviceClass: string | undefined = app.device_class
  if (deviceClass && deviceClass !== CHECK_WITH_SUPPLIER) {
    domains.push({
      domain: 'Medical device regulation',
      status: app.device_class_note ? 'verified_review_due' : 'verified_current',
      summary: deviceClass,
      residual_action: app.device_class_note || undefined,
    })
  } else {
    domains.push({
      domain: 'Medical device regulation',
      status: 'declared_pending',
      summary: 'Device classification not confirmed in reviewed sources.',
      residual_action: 'Confirm the CE/UKCA certificate and classification rationale with the supplier.',
    })
  }

  // 3. Clinical safety (DTAC + DCB0129/0160)
  const dtacStatus: string | undefined = app.dtac_status
  const dcb0129 = classify(app.dcb0129_status)
  const dcb0160Available = app.dcb0160_boilerplate_available === true
  let safetyStatus: AssuranceDomainStatus
  if (dtacStatus === 'required_not_confirmed') {
    safetyStatus = 'incomplete'
  } else if (dtacStatus === 'passed' && dcb0129 === 'verified_current') {
    safetyStatus = 'verified_current'
  } else {
    safetyStatus = 'declared_pending'
  }
  domains.push({
    domain: 'Clinical safety',
    status: safetyStatus,
    summary: `DTAC ${dtacLabel(dtacStatus)}; manufacturer DCB0129 ${app.dcb0129_status ?? 'not recorded'}.`,
    residual_action: dcb0160Available
      ? 'Complete local DCB0160 clinical safety case (supplier boilerplate available).'
      : 'Complete local DCB0160 clinical safety case.',
  })

  // 4. Data protection and IG (DSP Toolkit + ISO 27001 + Cyber Essentials + GDPR)
  const dsptOk = classify(app.dspt_status) === 'verified_current'
  const isoOk = classify(app.iso27001) === 'verified_current'
  const ceOk = classify(app.cyber_essentials) === 'verified_current'
  const gaps: string[] = []
  if (!isoOk) gaps.push('ISO 27001')
  if (!ceOk) gaps.push('Cyber Essentials')

  let igStatus: AssuranceDomainStatus
  if (dsptOk && isoOk && ceOk) {
    igStatus = 'verified_current'
  } else if (dsptOk) {
    igStatus = 'verified_review_due'
  } else {
    igStatus = 'declared_pending'
  }
  const igSummaryParts: string[] = []
  if (app.dspt_status) igSummaryParts.push(`DSP Toolkit ${app.dspt_status.toLowerCase()}`)
  const gdprFirst = firstSentence(app.gdpr_note)
  if (gdprFirst) igSummaryParts.push(gdprFirst)
  const igResidualBits: string[] = []
  if (gaps.length > 0) igResidualBits.push(`Confirm supplier ${gaps.join(' and ')}`)
  igResidualBits.push('complete a local DPIA before go-live')
  domains.push({
    domain: 'Data protection and IG',
    status: igStatus,
    summary: igSummaryParts.join('. ') || 'Information governance position not recorded.',
    residual_action: `${igResidualBits.join('; ')}.`,
  })

  return domains
}
