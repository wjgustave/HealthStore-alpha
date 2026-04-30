import Fuse, { type IFuseOptions } from 'fuse.js'
import type { App } from '@/lib/data'
import { getAllConditions } from '@/lib/data'
import { isVisibleCondition } from '@/lib/visibleConditions'

export type CatalogueSearchRecord = {
  id: string
  app_name: string
  supplier_name: string
  conditionText: string
}

const conditionMeta = () =>
  Object.fromEntries(
    getAllConditions().map(c => [
      c.id,
      { label: (c as { label: string }).label, description: (c as { description?: string }).description ?? '' },
    ]),
  )

export function appsToSearchRecords(apps: App[]): CatalogueSearchRecord[] {
  const meta = conditionMeta()
  return apps.map((app: App) => ({
    id: app.id,
    app_name: app.app_name ?? '',
    supplier_name: app.supplier_name ?? '',
    conditionText: (app.condition_tags ?? [])
      .map((t: string) => {
        const m = meta[t]
        return m ? `${m.label} ${m.description}` : t
      })
      .join(' '),
  }))
}

const fuseOptions: IFuseOptions<CatalogueSearchRecord> = {
  keys: ['app_name', 'supplier_name', 'conditionText'],
  threshold: 0.38,
  ignoreLocation: true,
}

export function createCatalogueFuseForApps(apps: App[]) {
  return new Fuse(appsToSearchRecords(apps), fuseOptions)
}

export function filterAppsBySearchQuery(apps: App[], q: string): App[] {
  const t = q.trim()
  if (!t) return apps
  const fuse = createCatalogueFuseForApps(apps)
  const ids = new Set(fuse.search(t).map(r => r.item.id))
  return apps.filter((a: App) => ids.has(a.id))
}

/** Valid condition query for /apps/condition-catalogue — only visible catalogue conditions or all. */
export function parseBrowseConditionParam(param: string | null | undefined): string {
  if (!param || param === 'all') return 'all'
  return isVisibleCondition(param) ? param : 'all'
}

export function buildBrowseSearchParams(condition: string, q: string): string {
  const p = new URLSearchParams()
  if (condition !== 'all') p.set('condition', condition)
  const qt = q.trim()
  if (qt) p.set('q', qt)
  const s = p.toString()
  return s ? `?${s}` : ''
}
