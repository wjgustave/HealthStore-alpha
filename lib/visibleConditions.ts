/** Condition IDs shown in catalogue and home filters — all loaded condition areas. */
export const VISIBLE_CONDITIONS = [
  'copd',
  'insomnia',
  'weight_management',
  'msk',
  'eating_disorders',
  'cardiac_rehab',
  'pulmonary_rehab',
] as const

export type VisibleConditionId = (typeof VISIBLE_CONDITIONS)[number]

export function isVisibleCondition(id: string): id is VisibleConditionId {
  return (VISIBLE_CONDITIONS as readonly string[]).includes(id)
}

/** Condition pathways with visible apps — the only condition tags shown on the funding index. */
export const FUNDING_CONDITIONS = ['copd', 'pulmonary_rehab', 'cardiac_rehab'] as const

export function isFundingCondition(id: string): boolean {
  return (FUNDING_CONDITIONS as readonly string[]).includes(id)
}
