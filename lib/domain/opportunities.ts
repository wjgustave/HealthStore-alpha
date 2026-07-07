import type { CommissionerContext } from '@/lib/context/types'
import type { ConditionDomain, PathwayOpportunity } from './types'
import conditionsData from '@/content/reference/conditions.json'
import overviewData from '@/content/local/opportunity-overview.json'

export interface SupportedCondition extends ConditionDomain {
  shortLabel: string
  niceRef: string
  colour: string
}

export function getSupportedConditions(): SupportedCondition[] {
  return conditionsData.supported as SupportedCondition[]
}

export function getHorizonConditions() {
  return conditionsData.horizon
}

export function getAllConditions(): ConditionDomain[] {
  const supported = conditionsData.supported.map(c => ({
    id: c.id,
    label: c.label,
    category: c.category as ConditionDomain['category'],
    contentStatus: c.contentStatus as ConditionDomain['contentStatus'],
    productSlugs: c.productSlugs,
    pathwayPosition: c.pathwayPosition,
  }))
  const horizon = conditionsData.horizon.map(c => ({
    id: c.id,
    label: c.label,
    category: c.category as ConditionDomain['category'],
    contentStatus: 'opportunity_shell' as ConditionDomain['contentStatus'],
    productSlugs: [] as string[],
  }))
  return [...supported, ...horizon]
}

export function getConditionById(id: string): ConditionDomain | null {
  const all = getAllConditions()
  return all.find(c => c.id === id) ?? null
}

export function getAreaOpportunities(ctx: CommissionerContext): PathwayOpportunity[] {
  const geoKey = ctx.geography_id ?? 'QOP'
  const geo = (overviewData.geographies as any)[geoKey]
  if (geo?.opportunities) return geo.opportunities as PathwayOpportunity[]

  const fallback = (overviewData.geographies as any)['QOP']
  if (fallback?.opportunities) return fallback.opportunities as PathwayOpportunity[]

  return []
}

export function getAreaMeta(ctx: CommissionerContext) {
  const geoKey = ctx.geography_id ?? 'QOP'
  const geo = (overviewData.geographies as any)[geoKey]
  const data = geo ?? (overviewData.geographies as any)['QOP']
  if (!data) return null
  return {
    code: data.code as string,
    label: data.label as string,
    population: data.population as string,
    reportingPeriod: data.reportingPeriod as string,
    dataBasis: data.dataBasis as string,
    summary: data.summary as string,
  }
}

export function getOpportunityForCondition(conditionId: string, ctx: CommissionerContext): PathwayOpportunity | null {
  const all = getAreaOpportunities(ctx)
  return all.find(o => o.conditionId === conditionId) ?? null
}

export function rankOpportunities(opportunities: PathwayOpportunity[], priorityId?: string): PathwayOpportunity[] {
  const bandOrder: Record<string, number> = { high: 0, medium: 1, watch: 2, insufficient_data: 3 }
  return [...opportunities].sort((a, b) => {
    if (priorityId) {
      const aMatch = a.conditionId === priorityId ? -1 : 0
      const bMatch = b.conditionId === priorityId ? -1 : 0
      if (aMatch !== bMatch) return aMatch - bMatch
    }
    return (bandOrder[a.priorityBand] ?? 3) - (bandOrder[b.priorityBand] ?? 3)
  })
}
