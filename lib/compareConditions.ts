import type { App } from '@/lib/data'
import conditionsJson from '@/content/conditions/conditions.json'

const CONDITION_LABEL = new Map(
  (conditionsJson as { id: string; label: string }[]).map(c => [c.id, c.label]),
)

export function appConditionTags(app: App): string[] {
  return Array.isArray(app.condition_tags) ? app.condition_tags : []
}

/** Tags common to every app in the list (non-empty ⇒ valid same-condition comparison). */
export function sharedConditionTags(apps: App[]): string[] {
  if (apps.length === 0) return []
  let s = new Set(appConditionTags(apps[0]))
  for (let i = 1; i < apps.length; i++) {
    const next = new Set(appConditionTags(apps[i]))
    s = new Set([...s].filter(t => next.has(t)))
  }
  return [...s]
}

export function canAddToSelection(selectedApps: App[], candidate: App): boolean {
  return sharedConditionTags([...selectedApps, candidate]).length > 0
}

/** Keep order; drop ids that break the shared-condition rule or unknown apps. */
export function sanitizeIdsForCompare(ids: string[], allApps: App[]): string[] {
  const out: string[] = []
  for (const id of ids) {
    if (out.length >= 4) break
    const app = allApps.find(a => a.id === id)
    if (!app) continue
    if (out.length === 0) {
      out.push(id)
      continue
    }
    const current = out.map(i => allApps.find(a => a.id === i)!).filter(Boolean) as App[]
    if (canAddToSelection(current, app)) out.push(id)
  }
  return out
}

export function formatConditionLabels(tagIds: string[]): string {
  return tagIds.map(id => CONDITION_LABEL.get(id) ?? id).join(', ')
}
