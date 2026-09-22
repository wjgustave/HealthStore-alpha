/**
 * Representative sample answers for the supplier onboarding prototype.
 *
 * Used by the "Mark all as complete" shortcut so that Check your answers shows
 * realistic content rather than "Not provided". Written for a fictional
 * supplier ("Aurora Health") and product ("Respira CBT"); nothing here is real.
 *
 * Any question without an entry gets a type-appropriate fallback from
 * `sampleAnswerFor`. Existing real answers are never overwritten.
 */
import {
  ALL_TASKS,
  CHECKBOX_SEPARATOR,
  CONFIRMED_VALUE,
  MULTI_UPLOAD_CONFIRMED_SUFFIX,
  UPLOAD_REFERENCE_SUFFIX,
  isQuestionAnswered,
  serializeUploadedDocuments,
  type OnboardingQuestion,
  type OnboardingTask,
  type TaskAnswers,
  type UploadedDocument,
} from './supplierOnboarding'

const SUPPLIER = 'Aurora Health'
const SUBMISSION_DATE = '2026-09-22'

const TEXT: Record<string, string> = {
  'nice-guidance-reference':
    'NICE HTG736 — Digitally enabled therapy for anxiety disorders (guided self-help). Respira CBT is listed as one of the recommended technologies.',
  'nice-recommendation-pathway':
    'Recommended for use in NHS Talking Therapies while further evidence is generated (Early Value Assessment, conditional recommendation).',
  'nice-evidence-generation-status':
    'Evidence generation plan agreed with NICE in March 2026. Real-world data collection is underway across 4 NHS Talking Therapies services, with the interim report due Q2 2027.',
  'integration-capabilities':
    'Bi-directional integration with EMIS Web and SystmOne via the IM1 pairing interface: referrals are pulled from the clinical record and completed outcome measures (PHQ-9, GAD-7) are written back as coded entries. Vision integration is read-only PDF transfer of the discharge summary.',
  'integration-licensing-fees':
    'No API or clinical-interface fees are charged to buyers. IM1 partner costs are absorbed by Aurora Health. Optional SSO via NHS CIS2 is included in the licence.',
  'product-public-summary':
    'Respira CBT is a clinician-supported digital cognitive behavioural therapy programme for adults with generalised anxiety disorder. It delivers 8 structured modules over 12 weeks with weekly asynchronous therapist review, freeing high-intensity therapist capacity for more complex cases.',
  'clinical-evidence-baseline':
    'Randomised controlled trial (n=412, UK, 2024): 61% reliable recovery vs 44% in the treatment-as-usual arm (Lancet Digital Health 2025;7:e112). Service evaluation across 3 NHS Talking Therapies services (n=1,870) reproduced the effect at 58% reliable recovery.',
  'hospital-utilisation-bed-flow-impact':
    'Reduced time-to-first-treatment from 9.4 to 2.1 weeks in pilot services, releasing an estimated 1,200 high-intensity therapy hours per 10,000 referrals per year. No direct inpatient bed impact is claimed; the benefit is outpatient capacity and waiting-list reduction.',
  'expected-patient-outcomes':
    'Quantitative: mean GAD-7 reduction of 6.8 points at 12 weeks; 61% reliable recovery. Qualitative: improved sleep and daily functioning, reduced avoidance, high satisfaction (mean 4.5/5), and better access for patients who cannot attend daytime appointments.',
  'human-wrapper-requirements':
    'One Band 5 psychological wellbeing practitioner per 120 active patients (approximately 30 minutes of asynchronous review per patient per week), plus a named service lead for onboarding. Aurora Health provides 2 half-day training sessions and a 6-week implementation support programme.',
  'nhs-deployment-locations':
    'Live: Greater Manchester ICB (3 Talking Therapies services), Norfolk and Waveney ICB, Leeds Community Healthcare NHS Trust. In mobilisation: Sussex Partnership NHS Foundation Trust.',
  'active-deployment-verification-contact':
    // "xo" suffix keeps the sample address obviously fictional (not a real mailbox).
    'Dr Priya Nair, Clinical Lead for Talking Therapies, Greater Manchester ICB — priya.nairxo@nhs.net',
  'approved-procurement-frameworks':
    'G-Cloud 14 (Lot 2, service ID 7231 4489 2210 566); NHS Shared Business Services Digital Health Advisory Services framework; Spark DPS (Dynamic Purchasing System).',
  'pricing-structure-transparency':
    'Per-completed-patient licence of £145 (12-week programme), or an annual block contract from £48,000 for up to 400 patients. One-off implementation and integration set-up fee of £6,500 (waived for ICB-wide contracts). No charge for training, support or upgrades.',
}

const UPLOADS: Record<string, { name: string; reference: string }> = {
  'post-market-surveillance-report': {
    name: 'Respira-CBT-PSUR-2026-v1.2.pdf',
    reference: `${SUPPLIER} — PSUR Jan–Jun 2026 — ${SUBMISSION_DATE}`,
  },
  'vulnerability-remediation-plan': {
    name: 'Respira-CBT-Pen-Test-Remediation-Plan-2026.pdf',
    reference: `${SUPPLIER} — Pen test remediation roadmap — ${SUBMISSION_DATE}`,
  },
  'buyer-pack-commercial-materials': {
    name: 'Respira-CBT-NHS-Buyer-Pack-2026.pdf',
    reference: `${SUPPLIER} — NHS Buyer Pack — ${SUBMISSION_DATE}`,
  },
  'deployment-implementation-manual': {
    name: 'Respira-CBT-Implementation-and-Integration-Guide-v3.pdf',
    reference: `${SUPPLIER} — Deployment manual — ${SUBMISSION_DATE}`,
  },
}

const DTAC_DOCUMENTS: Array<Pick<UploadedDocument, 'name' | 'reference' | 'size'>> = [
  { name: 'Aurora-Health-A11-CQC-Report.pdf', reference: `${SUPPLIER} — A11 CQC Report — ${SUBMISSION_DATE}`, size: 1_284_000 },
  { name: 'Aurora-Health-B4-User-Journeys-Data-Flows.pdf', reference: `${SUPPLIER} — B4 User journeys and data flows — ${SUBMISSION_DATE}`, size: 2_410_000 },
  { name: 'Aurora-Health-C1.2.3-Clinical-Safety-Case-Report.pdf', reference: `${SUPPLIER} — C1.2.3 Clinical Safety Case Report — ${SUBMISSION_DATE}`, size: 940_000 },
  { name: 'Aurora-Health-C1.3.4-Hazard-Log.xlsx', reference: `${SUPPLIER} — C1.3.4 Hazard Log — ${SUBMISSION_DATE}`, size: 312_000 },
  { name: 'Aurora-Health-C2.2.2-DPIA.pdf', reference: `${SUPPLIER} — C2.2.2 DPIA — ${SUBMISSION_DATE}`, size: 1_105_000 },
  { name: 'Aurora-Health-C3.1-Cyber-Essentials-Plus.pdf', reference: `${SUPPLIER} — C3.1 Cyber Essentials Plus certificate — ${SUBMISSION_DATE}`, size: 210_000 },
  { name: 'Aurora-Health-C3.2-Pen-Test-Summary.pdf', reference: `${SUPPLIER} — C3.2 External penetration test summary — ${SUBMISSION_DATE}`, size: 680_000 },
]

const CHOICES: Record<string, string> = {
  'financial-stability': 'yes',
  'supervision-care-model': 'clinically-supervised',
  'medical-device-classification': 'class-i',
  'clinical-system-integrations': ['emis-web', 'systmone'].join(CHECKBOX_SEPARATOR),
  'accessibility-audit-date': '2026-05-14',
}

/** Sample answer(s) for one question — the keys a question writes, filled. */
export function sampleAnswerFor(question: OnboardingQuestion): TaskAnswers {
  switch (question.type) {
    case 'radios':
      return { [question.id]: CHOICES[question.id] ?? question.options[0].value }
    case 'checkboxes':
      return { [question.id]: CHOICES[question.id] ?? question.options[0].value }
    case 'date':
      return { [question.id]: CHOICES[question.id] ?? SUBMISSION_DATE }
    case 'textarea':
      return { [question.id]: TEXT[question.id] ?? `Sample response for "${question.label}" (prototype).` }
    case 'upload': {
      const u = UPLOADS[question.id] ?? {
        name: `${question.id}.pdf`,
        reference: `${SUPPLIER} — ${question.label} — ${SUBMISSION_DATE}`,
      }
      return { [question.id]: u.name, [`${question.id}${UPLOAD_REFERENCE_SUFFIX}`]: u.reference }
    }
    case 'multi-upload': {
      const uploadedAt = new Date().toISOString()
      const docs: UploadedDocument[] = DTAC_DOCUMENTS.map((d) => ({ ...d, uploadedAt }))
      return {
        [question.id]: serializeUploadedDocuments(docs),
        [`${question.id}${MULTI_UPLOAD_CONFIRMED_SUFFIX}`]: CONFIRMED_VALUE,
      }
    }
  }
}

/**
 * Answers for a task with every unanswered question filled from the samples.
 * Questions the supplier has already answered are left exactly as they are.
 */
export function fillTaskWithSamples(task: OnboardingTask, existing: TaskAnswers): TaskAnswers {
  let filled = { ...existing }
  for (const q of task.questions) {
    if (!isQuestionAnswered(q, filled)) filled = { ...filled, ...sampleAnswerFor(q) }
  }
  return filled
}

/** taskId -> filled answers, for every task in the journey. */
export function fillAllWithSamples(existing: Record<string, TaskAnswers>): Record<string, TaskAnswers> {
  return Object.fromEntries(ALL_TASKS.map((t) => [t.id, fillTaskWithSamples(t, existing[t.id] ?? {})]))
}
