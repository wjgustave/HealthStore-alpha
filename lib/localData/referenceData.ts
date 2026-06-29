import copdRef from '@/content/local/copd-reference.json'
import copdOpportunity from '@/content/opportunities/copd.json'
import type { IcbReferenceData, OpportunityData } from '@/lib/content/productModel'
import type { CommissionerContext } from '@/lib/context/types'

export function getOpportunityByCondition(conditionId: string): OpportunityData | null {
  if (conditionId === 'copd') return copdOpportunity as OpportunityData
  return null
}

export function getLocalReferenceData(ctx: CommissionerContext): IcbReferenceData | null {
  const national = copdRef.national as Omit<IcbReferenceData, 'icb_id' | 'icb_name'>
  if (ctx.geography_type === 'national' || !ctx.geography_id) {
    return {
      icb_id: 'E92000001',
      icb_name: 'England (illustrative baseline)',
      ...national,
    }
  }
  const icb = (copdRef.icbs as IcbReferenceData[]).find((i) => i.icb_id === ctx.geography_id)
  return icb ?? null
}

export function listSupportedIcbs(): { id: string; name: string }[] {
  return (copdRef.icbs as IcbReferenceData[]).map((i) => ({ id: i.icb_id, name: i.icb_name }))
}
