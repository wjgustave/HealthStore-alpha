/** Condition IDs shown in catalogue and home filters — keep in sync with product scope. */
export const VISIBLE_CONDITIONS = ['copd', 'cardiac_rehab'] as const

export type VisibleConditionId = (typeof VISIBLE_CONDITIONS)[number]

export function isVisibleCondition(id: string): id is VisibleConditionId {
  return (VISIBLE_CONDITIONS as readonly string[]).includes(id)
}
