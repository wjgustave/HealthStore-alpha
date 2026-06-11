/**
 * Comparison tool configuration — groups, rows, lenses, and persona ordering.
 * Row renderers live in components/compare/compareRowRenderers.tsx.
 * See docs/COMPARE_CONTENT_MAP.md for the full inventory.
 */

export type CompareViewId = 'a' | 'b'

export const COMPARE_VIEW_IDS: readonly CompareViewId[] = ['a', 'b'] as const

export const DEFAULT_COMPARE_VIEW: CompareViewId = 'a'

export const COMPARE_VIEW_STORAGE_KEY = 'hs-compare-view'

export const COMPARE_VIEW_LABELS: Record<CompareViewId, { short: string; long: string }> = {
  a: { short: 'Matrix', long: 'Matrix view' },
  b: { short: 'Workspace', long: 'Decision workspace' },
}

export function isCompareViewId(value: unknown): value is CompareViewId {
  return value === 'a' || value === 'b'
}

export function coerceCompareViewId(value: string | undefined | null): CompareViewId {
  return isCompareViewId(value) ? value : DEFAULT_COMPARE_VIEW
}

export type CompareLensId = 'all' | 'clinical_safety' | 'finance_procurement' | 'ig_assurance'

export type CompareGroupId =
  | 'overview'
  | 'clinical'
  | 'deployment'
  | 'safety'
  | 'commercial'
  | 'technical'

export type CompareRowDef = {
  key: string
  label: string
  groupId: CompareGroupId
  /** Highlighted in matrix view; default-open group in workspace view. */
  decisionCritical?: boolean
  lensTags: CompareLensId[]
}

export type CompareGroupDef = {
  id: CompareGroupId
  title: string
  /** PDP tab anchor for deep-linking context. */
  pdpAnchor?: string
}

export const COMPARE_LENSES: {
  id: CompareLensId
  label: string
  groupOrder: CompareGroupId[]
}[] = [
  {
    id: 'all',
    label: 'Show all',
    groupOrder: ['overview', 'clinical', 'deployment', 'commercial', 'safety', 'technical'],
  },
  {
    id: 'clinical_safety',
    label: 'Clinical safety',
    groupOrder: ['clinical', 'safety', 'deployment', 'technical', 'overview', 'commercial'],
  },
  {
    id: 'finance_procurement',
    label: 'Finance & procurement',
    groupOrder: ['commercial', 'safety', 'deployment', 'clinical', 'overview', 'technical'],
  },
  {
    id: 'ig_assurance',
    label: 'Information governance & assurance',
    groupOrder: ['safety', 'technical', 'deployment', 'commercial', 'clinical', 'overview'],
  },
]

export const COMPARE_GROUPS: CompareGroupDef[] = [
  { id: 'overview', title: 'Overview & local fit', pdpAnchor: 'why-it-matters' },
  { id: 'clinical', title: 'Clinical evidence & outcomes', pdpAnchor: 'clinical-evidence' },
  { id: 'deployment', title: 'Deployment & adoption', pdpAnchor: 'scale-and-maturity' },
  { id: 'safety', title: 'Safety & governance', pdpAnchor: 'data-information-governance' },
  { id: 'commercial', title: 'Commercial, cost & funding', pdpAnchor: 'commercial-model' },
  { id: 'technical', title: 'Technical & integration', pdpAnchor: 'nhs-integrations' },
]

export const COMPARE_ROWS: CompareRowDef[] = [
  // Overview & local fit
  { key: 'conditions', label: 'Conditions', groupId: 'overview', decisionCritical: true, lensTags: ['clinical_safety'] },
  { key: 'therapeutic', label: 'Therapeutic purpose', groupId: 'overview', lensTags: ['clinical_safety'] },
  { key: 'pathways', label: 'Clinical pathways', groupId: 'overview', lensTags: ['clinical_safety'] },
  { key: 'care_settings', label: 'Care settings', groupId: 'overview', lensTags: ['clinical_safety'] },
  // Clinical evidence & outcomes
  { key: 'evidence_excerpt', label: 'Clinical evidence (summary)', groupId: 'clinical', lensTags: ['clinical_safety'] },
  { key: 'expected_benefit', label: 'Expected benefit', groupId: 'clinical', lensTags: ['finance_procurement'] },
  { key: 'nice', label: 'NICE guidance status', groupId: 'clinical', lensTags: ['clinical_safety'] },
  { key: 'evidence_strength', label: 'Evidence strength', groupId: 'clinical', decisionCritical: true, lensTags: ['clinical_safety'] },
  // Deployment & adoption
  { key: 'where_live', label: "Where it's live", groupId: 'deployment', decisionCritical: true, lensTags: [] },
  { key: 'maturity', label: 'Deployment maturity', groupId: 'deployment', lensTags: [] },
  { key: 'onboarding', label: 'Onboarding model', groupId: 'deployment', lensTags: ['clinical_safety'] },
  { key: 'service_wrap', label: 'Service wrap', groupId: 'deployment', lensTags: ['finance_procurement'] },
  // Safety & governance
  { key: 'dtac', label: 'DTAC status', groupId: 'safety', decisionCritical: true, lensTags: ['clinical_safety', 'finance_procurement', 'ig_assurance'] },
  { key: 'dcb0129', label: 'DCB0129 (manufacturer)', groupId: 'safety', lensTags: ['clinical_safety', 'ig_assurance'] },
  { key: 'device_class', label: 'Device class', groupId: 'safety', lensTags: ['clinical_safety'] },
  { key: 'assurance', label: 'Cyber / ISO / DSPT', groupId: 'safety', lensTags: ['clinical_safety', 'finance_procurement', 'ig_assurance'] },
  // Commercial, cost & funding
  { key: 'pricing_model', label: 'Pricing model', groupId: 'commercial', decisionCritical: true, lensTags: ['finance_procurement'] },
  { key: 'indicative_price', label: 'Indicative price', groupId: 'commercial', lensTags: ['finance_procurement'] },
  { key: 'funding', label: 'Funding eligibility', groupId: 'commercial', lensTags: ['finance_procurement'] },
  // Technical & integration
  { key: 'nhs_integrations', label: 'NHS integrations', groupId: 'technical', lensTags: ['clinical_safety', 'ig_assurance'] },
  { key: 'integrations', label: 'FHIR / EMIS / hosting', groupId: 'technical', lensTags: ['clinical_safety', 'ig_assurance'] },
  { key: 'data_hosting', label: 'Data hosting', groupId: 'technical', lensTags: ['clinical_safety', 'ig_assurance'] },
]

/** Groups that contain at least one decision-critical row — open by default in workspace view. */
export const DECISION_CRITICAL_GROUP_IDS = new Set<CompareGroupId>(
  COMPARE_ROWS.filter(r => r.decisionCritical).map(r => r.groupId),
)

export function getRowsForGroup(groupId: CompareGroupId): CompareRowDef[] {
  return COMPARE_ROWS.filter(r => r.groupId === groupId)
}

export function getOrderedGroups(lensId: CompareLensId): CompareGroupDef[] {
  const lens = COMPARE_LENSES.find(l => l.id === lensId) ?? COMPARE_LENSES[0]
  const order = lens.groupOrder
  return [...COMPARE_GROUPS].sort((a, b) => {
    const ia = order.indexOf(a.id)
    const ib = order.indexOf(b.id)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })
}

export function isDecisionCriticalGroup(groupId: CompareGroupId): boolean {
  return DECISION_CRITICAL_GROUP_IDS.has(groupId)
}

/** True when a group contains at least one row tagged for the active lens. */
export function groupMatchesLens(groupId: CompareGroupId, lensId: CompareLensId): boolean {
  if (lensId === 'all') return false
  return COMPARE_ROWS.some(r => r.groupId === groupId && r.lensTags.includes(lensId))
}
