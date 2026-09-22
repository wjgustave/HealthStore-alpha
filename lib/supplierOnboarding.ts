/**
 * Supplier onboarding task list — single source of truth for the structure of
 * the `/supplier-onboard` journey.
 *
 * Follows the NHS "Complete multiple tasks" pattern:
 * https://service-manual.nhs.uk/design-system/patterns/complete-multiple-tasks
 *
 * Sections group related tasks. Each task has its own page at
 * `/supplier-onboard/[slug]` and its own Completed / Incomplete status.
 */

export const SERVICE_NAME = 'HealthStore Onboarding'

export const SUPPLIER_ONBOARD_BASE_PATH = '/supplier-onboard'

/** localStorage key for per-task completion state (client-side prototype). */
export const STORAGE_KEY = 'hs-supplier-onboard:tasks'

/** True for the task list and every task / question page beneath it. */
export function isSupplierOnboardPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname === SUPPLIER_ONBOARD_BASE_PATH || pathname.startsWith(`${SUPPLIER_ONBOARD_BASE_PATH}/`)
}

export type QuestionOption = { value: string; label: string }

/**
 * One question = one page (NHS/GOV.UK "one thing per page"). The question
 * `label` is rendered as the page heading, `hint` beneath it.
 */
type QuestionBase = {
  id: string
  label: string
  hint?: string
  /** Optional questions (e.g. "if applicable") do not block the task from being Completed. */
  optional?: boolean
}

export type OnboardingQuestion =
  | (QuestionBase & { type: 'radios'; options: QuestionOption[] })
  | (QuestionBase & { type: 'checkboxes'; options: QuestionOption[] })
  | (QuestionBase & { type: 'textarea' })
  /** NHS Date input (day / month / year). Stored as YYYY-MM-DD. */
  | (QuestionBase & { type: 'date' })
  /**
   * File upload plus a required reference name (GOV.UK File upload — the NHS
   * design system has no equivalent). `documents` lists the evidence that may be
   * supplied. The file name is stored under `id`; the reference name under
   * `${id}${UPLOAD_REFERENCE_SUFFIX}`.
   */
  | (QuestionBase & { type: 'upload'; documents?: string[] })
  /**
   * Several documents, added one at a time (file + reference name, then
   * "Upload file"), listed with a Remove action. Adapted from the MoJ Multi file
   * upload pattern using NHS components. The list is stored JSON-encoded under
   * `id` (see `UploadedDocument`); the "Mark as complete" checkbox under
   * `${id}${MULTI_UPLOAD_CONFIRMED_SUFFIX}` — the question only counts as
   * answered once at least one document is listed AND the box is ticked.
   * `documents` is shown in an NHS Details component ("Documents you can provide").
   */
  | (QuestionBase & { type: 'multi-upload'; documents?: string[] })

export const UPLOAD_REFERENCE_SUFFIX = '__reference'
export const MULTI_UPLOAD_CONFIRMED_SUFFIX = '__confirmed'
export const CONFIRMED_VALUE = 'yes'

/** One entry in a multi-upload list. Prototype: metadata only, no file bytes. */
export type UploadedDocument = {
  name: string
  size: number
  reference: string
  uploadedAt: string
}

export function parseUploadedDocuments(value: string | undefined): UploadedDocument[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? (parsed as UploadedDocument[]) : []
  } catch {
    return []
  }
}

export function serializeUploadedDocuments(docs: UploadedDocument[]): string {
  return docs.length === 0 ? '' : JSON.stringify(docs)
}

export type OnboardingTask = {
  /** Stable identifier used as the completion-state key. */
  id: string
  /** URL segment under /supplier-onboard. */
  slug: string
  title: string
  /** Question pages for this task. Empty until the content is authored. */
  questions: OnboardingQuestion[]
}

export type OnboardingSection = {
  id: string
  title: string
  /** Short explanation shown under the numbered section heading. */
  description: string
  tasks: OnboardingTask[]
}

/** Regulatory notice shown in the blue panel under the task list introduction. */
export const ONBOARDING_NOTICE =
  'Use this form to onboard your Digital Therapeutic (DTx) into the NHS HealthStore. The HealthStore is an information and signposting platform only; NHS England is not a distributor or part of the medical device supply chain. Under UK MDR, manufacturers are solely liable for all clinical, efficacy and regulatory claims. Answers must be objective, evidence-based and aligned with NHS clinical guidelines.'

/** Declaration shown above "Confirm and submit" on the Check your answers page. */
export const SUBMISSION_DECLARATION =
  'By submitting you confirm you understand that under UK MDR, manufacturers are solely liable for all clinical, efficacy and regulatory claims. All answers are objective, evidence-based and aligned with NHS clinical guidelines.'

export const CHECK_ANSWERS_PATH = `${SUPPLIER_ONBOARD_BASE_PATH}/check-answers`
export const CONFIRMATION_PATH = `${SUPPLIER_ONBOARD_BASE_PATH}/confirmation`

function task(slug: string, title: string, questions: OnboardingQuestion[] = []): OnboardingTask {
  return { id: slug, slug, title, questions }
}

const YES_NO: QuestionOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export const SECTIONS: OnboardingSection[] = [
  {
    id: 'supplier-product-classification',
    title: 'Supplier, Product Metadata & Clinical Classification',
    description:
      "This section establishes your organisation's financial profile. Complete this section providing details of the therapeutic being submitted.",
    tasks: [
      task('corporate-financial-stability-check', 'Corporate Financial Stability Check', [
        {
          id: 'financial-stability',
          type: 'radios',
          label: 'Corporate Financial Stability Check',
          hint: 'Confirm the organisation is not undergoing bankruptcy, winding-up, or administration.',
          options: YES_NO,
        },
      ]),
      task('nice-information', 'NICE information', [
        {
          id: 'nice-guidance-reference',
          type: 'textarea',
          label: 'NICE Guidance Alignment Reference',
          hint: 'Provide specific NICE Health Technology Guidance reference (e.g., NICE HTG736 or HTG718).',
        },
        {
          id: 'nice-recommendation-pathway',
          type: 'textarea',
          label: 'NICE recommendation pathway',
          hint: 'Is the product recommended for routine use or advised under an Early Value Assessment (EVA)?',
        },
        {
          id: 'nice-evidence-generation-status',
          type: 'textarea',
          label: 'NICE evidence generation status',
          hint: 'If applicable, describe where the app stands in its NICE evidence gathering program.',
        },
      ]),
      task('supervision-care-model-and-classification', 'Supervision care model and Classification', [
        {
          id: 'supervision-care-model',
          type: 'radios',
          label: 'Supervision care model',
          hint: 'State if the app operates as self-management or clinician-led remote monitoring.',
          options: [
            { value: 'self-managed', label: 'Self-Managed' },
            { value: 'clinically-supervised', label: 'Clinically Supervised' },
            { value: 'hybrid', label: 'Hybrid' },
          ],
        },
        {
          id: 'medical-device-classification',
          type: 'radios',
          label: 'Medical Device Classification',
          hint: 'Provide UK MHRA medical device risk class under current regulations.',
          options: [
            { value: 'class-i', label: 'Class I' },
            { value: 'class-iia', label: 'Class IIa' },
            { value: 'class-iib', label: 'Class IIb' },
            { value: 'class-iii', label: 'Class III' },
          ],
        },
      ]),
    ],
  },
  {
    id: 'clinical-safety-dtac',
    title: 'Clinical Safety & DTAC Evidence Base (DCB 0129 / 0160)',
    description:
      'Evidence of robust clinical safety risk management is mandatory. Central verification of these documents acts as a pre-production gate to protect public trust. Local deploying organisations retain risk ownership under DCB 0160.',
    tasks: [
      task('completed-dtac-form', 'Completed DTAC Version 2.0 Form', [
        {
          id: 'dtac-form',
          type: 'multi-upload',
          label: 'Completed DTAC Version 2.0 Form',
          hint: 'Please ensure that when providing evidence, documents are clearly labelled with the name of your company, the question number and the date of submission.',
          documents: [
            'A11 - CQC Report',
            'B4 - User journeys and data flows',
            'C1.1 - Pre-Acquisition Questionnaire Form',
            'C1.2.3 - Clinical Safety Case Report',
            'C1.3.4 - Hazard Log',
            "C2.2.1 - Information Commissioner's registration",
            'C2.2.2 - Data Protection Impact Assessment (DPIA)',
            'C2.2.4 - Products terms and conditions regarding use of user data, end user licence agreement or equivalent',
            'C3.1 - Cyber Essentials Certification',
            'C3.2 - External Penetration Test Summary Report',
            'D1.1 - User Journeys and/or how the product fits into a user pathway or journey',
          ],
        },
      ]),
      task('post-market-surveillance', 'Post-Market Surveillance', [
        {
          id: 'post-market-surveillance-report',
          type: 'upload',
          label: 'Post-Market Surveillance',
          hint: 'Upload most recent Periodic Safety Update Report (PSUR) or Post Market Surveillance Report (PMSR).',
        },
      ]),
    ],
  },
  {
    id: 'technical-security-integration',
    title: 'Technical Security, Integration & EMIS Systems',
    description:
      'All third-party connections and technical specifications are mapped to prevent misleading local integration claims and expose hidden API costs prior to local commissioning.',
    tasks: [
      task('vulnerability-remediation-plan', 'Vulnerability Remediation Plan', [
        {
          id: 'vulnerability-remediation-plan',
          type: 'upload',
          label: 'Vulnerability Remediation Plan',
          hint: 'If applicable, upload remediation roadmap addressing any open security findings.',
          optional: true,
        },
      ]),
      task('integrations', 'Integrations', [
        {
          id: 'clinical-system-integrations',
          type: 'checkboxes',
          label: 'Clinical System Integrations',
          hint: 'Check all systems with active integrations.',
          options: [
            { value: 'emis-web', label: 'EMIS Web' },
            { value: 'systmone', label: 'SystmOne' },
            { value: 'vision', label: 'Vision' },
          ],
        },
        {
          id: 'integration-capabilities',
          type: 'textarea',
          label: 'Integration Capabilities Description',
          hint: 'Describe level of integration (e.g., bi-directional push/pull, read-only PDF transfer).',
        },
        {
          id: 'integration-licensing-fees',
          type: 'textarea',
          label: 'Associated Integration Licensing Fees',
          hint: 'Clearly disclose any API or clinical interface licensing fees charged to buyers.',
        },
      ]),
    ],
  },
  {
    id: 'usability-accessibility-equality',
    title: 'Usability, Accessibility (WCAG 2.2 AA) & Equality Governance',
    description:
      'Products must align with national public sector accessibility standards to support NHS App integration and address health inequality cohorts.',
    tasks: [
      task('accessibility-audit', 'Accessibility Audit', [
        {
          id: 'accessibility-audit-date',
          type: 'date',
          label: 'Accessibility Audit Date',
          hint: 'Date of last formal accessibility audit (required for NHS App integration). For example, 15 3 2025.',
        },
      ]),
    ],
  },
  {
    id: 'clinical-evidence-outcomes',
    title: 'Clinical Evidence, Expected Outcomes & Pathway Benefits',
    description:
      'Provide neutral, evidence-based intelligence focused on hospital utilisation, patient flow, and bed capacity impacts to justify high-stakes local business cases.',
    tasks: [
      task('product-public-summary', 'Product Public Summary', [
        {
          id: 'product-public-summary',
          type: 'textarea',
          label: 'Product Public Summary',
          hint: 'Enter a concise description of what the app does and how it benefits clinical pathways.',
        },
      ]),
      task('clinical-evidence-baseline', 'Clinical Evidence Baseline', [
        {
          id: 'clinical-evidence-baseline',
          type: 'textarea',
          label: 'Clinical Evidence Baseline',
          hint: 'Summarise verified clinical outcomes, citing peer-reviewed studies or clinical trial data.',
        },
      ]),
      task('hospital-utilisation-bed-flow-impact', 'Hospital Utilisation & Bed Flow Impact', [
        {
          id: 'hospital-utilisation-bed-flow-impact',
          type: 'textarea',
          label: 'Hospital Utilisation & Bed Flow Impact',
          hint: 'Describe evidence demonstrating reduced admissions, bed days, or outpatient bottlenecks.',
        },
      ]),
      task('expected-patient-outcomes', 'Expected Patient Outcomes', [
        {
          id: 'expected-patient-outcomes',
          type: 'textarea',
          label: 'Expected Patient Outcomes',
          hint: 'Outline quantitative and qualitative patient benefits (e.g., symptom reduction, quality of life).',
        },
      ]),
      task('implementation-or-staffing-requirements', 'Implementation or staffing requirements', [
        {
          id: 'human-wrapper-requirements',
          type: 'textarea',
          label: 'Human Wrapper Requirements',
          hint: 'Specify the implementation support or clinical staffing required locally to ensure adoption.',
        },
      ]),
    ],
  },
  {
    id: 'commercial-pricing-procurement',
    title: 'Commercial Implementation, Pricing & Procurement Packs',
    description:
      'To reduce procurement lead times from months to weeks, please provide complete commercial materials and licensing transparency below.',
    tasks: [
      task('nhs-deployment-locations', 'NHS Deployment Locations', [
        {
          id: 'nhs-deployment-locations',
          type: 'textarea',
          label: 'NHS Deployment Locations',
          hint: 'List all active NHS trusts or ICBs currently deploying your product.',
        },
      ]),
      task('active-deployment-verification-contact', 'Active Deployment Verification Contact', [
        {
          id: 'active-deployment-verification-contact',
          type: 'textarea',
          label: 'Active Deployment Verification Contact',
          hint: 'Provide email address of an NHS clinical or procurement lead for reciprocity checking.',
        },
      ]),
      task('approved-procurement-frameworks', 'Approved Procurement Frameworks', [
        {
          id: 'approved-procurement-frameworks',
          type: 'textarea',
          label: 'Approved Procurement Frameworks',
          hint: 'Specify any frameworks (e.g., G-Cloud, Spark) where your product is listed.',
        },
      ]),
      task('pricing-structure-transparency', 'Pricing Structure Transparency', [
        {
          id: 'pricing-structure-transparency',
          type: 'textarea',
          label: 'Pricing Structure Transparency',
          hint: 'Outline commercial cost models (e.g., per-user licenses, block contracts, setup costs).',
        },
      ]),
      task('buyer-pack-commercial-materials', 'Buyer Pack / Commercial Materials', [
        {
          id: 'buyer-pack-commercial-materials',
          type: 'upload',
          label: 'Buyer Pack / Commercial Materials',
          hint: 'Upload official NHS Buyer Pack and commercial route onboarding materials.',
        },
      ]),
      task('deployment-implementation-manual', 'Deployment & Implementation Manual', [
        {
          id: 'deployment-implementation-manual',
          type: 'upload',
          label: 'Deployment & Implementation Manual',
          hint: 'Upload supplier-led pathway deployment manuals and technical integration guides.',
        },
      ]),
    ],
  },
]

export const ALL_TASKS: OnboardingTask[] = SECTIONS.flatMap((s) => s.tasks)

/** Resolve a task (and its parent section) from a URL slug. */
export function findTask(slug: string): { task: OnboardingTask; section: OnboardingSection } | null {
  for (const section of SECTIONS) {
    const found = section.tasks.find((t) => t.slug === slug)
    if (found) return { task: found, section }
  }
  return null
}

export function taskHref(task: OnboardingTask): string {
  return `${SUPPLIER_ONBOARD_BASE_PATH}/${task.slug}`
}

/** URL for question page `step` (1-based). Step 1 is the bare task URL. */
export function taskStepHref(task: OnboardingTask, step: number): string {
  return step <= 1 ? taskHref(task) : `${taskHref(task)}/${step}`
}

/**
 * "Save and Next" target: the next question in this task, else the first page
 * of the next task in journey order (crossing section boundaries), else `null`
 * on the final page of the final task.
 */
export function nextPageHref(task: OnboardingTask, step: number): string | null {
  if (step < task.questions.length) return taskStepHref(task, step + 1)
  const index = ALL_TASKS.findIndex((t) => t.id === task.id)
  const next = ALL_TASKS.slice(index + 1).find((t) => t.questions.length > 0)
  return next ? taskHref(next) : null
}

/**
 * Answers are flat string values keyed by question id. Composite questions use
 * extra keys: upload -> `${id}${UPLOAD_REFERENCE_SUFFIX}`; checkboxes store the
 * selected values joined with `CHECKBOX_SEPARATOR`; dates store `YYYY-MM-DD`.
 */
export type TaskAnswers = Record<string, string>

export const CHECKBOX_SEPARATOR = ','

export function isAnswered(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim() !== ''
}

/** All answer keys a question writes (used to scope a page's draft). */
export function questionKeys(q: OnboardingQuestion): string[] {
  switch (q.type) {
    case 'upload':
      return [q.id, `${q.id}${UPLOAD_REFERENCE_SUFFIX}`]
    case 'multi-upload':
      return [q.id, `${q.id}${MULTI_UPLOAD_CONFIRMED_SUFFIX}`]
    default:
      return [q.id]
  }
}

/** Loose YYYY-MM-DD check: all three parts present and in plausible ranges. */
export function isValidIsoDate(value: string | undefined): boolean {
  if (!value) return false
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value)
  if (!m) return false
  const [, y, mo, d] = m.map(Number)
  return y >= 1900 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31
}

export function isQuestionAnswered(q: OnboardingQuestion, answers: TaskAnswers): boolean {
  switch (q.type) {
    case 'upload':
      return isAnswered(answers[q.id]) && isAnswered(answers[`${q.id}${UPLOAD_REFERENCE_SUFFIX}`])
    case 'multi-upload':
      return (
        parseUploadedDocuments(answers[q.id]).length > 0 &&
        answers[`${q.id}${MULTI_UPLOAD_CONFIRMED_SUFFIX}`] === CONFIRMED_VALUE
      )
    case 'date':
      return isValidIsoDate(answers[q.id])
    default:
      return isAnswered(answers[q.id])
  }
}

/** True when every required question in the task has an answer. */
export function isTaskComplete(task: OnboardingTask, answers: TaskAnswers): boolean {
  return (
    task.questions.length > 0 &&
    task.questions.every((q) => q.optional || isQuestionAnswered(q, answers))
  )
}
