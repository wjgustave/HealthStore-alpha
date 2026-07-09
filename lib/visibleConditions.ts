/** Condition IDs shown in catalogue and home filters — all loaded condition areas. */
export const VISIBLE_CONDITIONS = [
  'copd',
  'insomnia',
  'weight_management',
  'msk',
  'eating_disorders',
  'cardiac_rehab',
] as const

export type VisibleConditionId = (typeof VISIBLE_CONDITIONS)[number]

export function isVisibleCondition(id: string): id is VisibleConditionId {
  return (VISIBLE_CONDITIONS as readonly string[]).includes(id)
}
