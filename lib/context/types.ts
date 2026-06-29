/** Commissioner context — role, place, priority, scenario (spec Appendix A). */

export type CommissionerRole =
  | 'commissioning_transformation'
  | 'clinical_service'
  | 'procurement_commercial'
  | 'finance_benefits'
  | 'digital_assurance'
  | 'other'

export type BuyerContext =
  | 'nhs_buying_party'
  | 'supports_buyer'
  | 'not_buyer'
  | 'not_sure'

export type GeographyType = 'national' | 'icb' | 'organisation'

export type PriorityType = 'condition' | 'service_pressure' | 'outcome_inequality' | 'other'

export type ScenarioId = 'conservative' | 'central' | 'evidence_led'

export interface CommissionerContext {
  role?: CommissionerRole
  buyer_context?: BuyerContext
  organisation_id?: string
  organisation_name?: string
  geography_type: GeographyType
  geography_id?: string
  geography_label: string
  priority_type?: PriorityType
  priority_id?: string
  priority_label?: string
  scenario_id: ScenarioId
  temporary_view?: boolean
}

export const ROLE_LABELS: Record<CommissionerRole, string> = {
  commissioning_transformation: 'Commissioning or transformation',
  clinical_service: 'Clinical or service lead',
  procurement_commercial: 'Procurement or commercial',
  finance_benefits: 'Finance or benefits',
  digital_assurance: 'Digital, data or assurance',
  other: 'Other',
}

export const BUYER_CONTEXT_LABELS: Record<BuyerContext, string> = {
  nhs_buying_party: 'Yes — I represent an NHS organisation that may commission or deploy',
  supports_buyer: 'I support an NHS buying party',
  not_buyer: 'No',
  not_sure: 'Not sure',
}

export const DEFAULT_CONTEXT: CommissionerContext = {
  geography_type: 'national',
  geography_label: 'England (illustrative baseline)',
  scenario_id: 'central',
}

export function contextToSearchParams(ctx: CommissionerContext): URLSearchParams {
  const p = new URLSearchParams()
  if (ctx.role) p.set('role', ctx.role)
  if (ctx.buyer_context) p.set('buyer', ctx.buyer_context)
  if (ctx.organisation_id) p.set('org', ctx.organisation_id)
  if (ctx.organisation_name) p.set('orgName', ctx.organisation_name)
  p.set('geo', ctx.geography_type)
  if (ctx.geography_id) p.set('geoId', ctx.geography_id)
  p.set('geoLabel', ctx.geography_label)
  if (ctx.priority_type) p.set('priorityType', ctx.priority_type)
  if (ctx.priority_id) p.set('priorityId', ctx.priority_id)
  if (ctx.priority_label) p.set('priorityLabel', ctx.priority_label)
  p.set('scenario', ctx.scenario_id)
  if (ctx.temporary_view) p.set('tempView', '1')
  return p
}

export function contextFromSearchParams(params: URLSearchParams | Record<string, string | string[] | undefined>): CommissionerContext {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined
    const v = params[key]
    return Array.isArray(v) ? v[0] : v
  }

  const geo = (get('geo') as GeographyType) || 'national'
  const scenario = (get('scenario') as ScenarioId) || 'central'

  return {
    role: get('role') as CommissionerRole | undefined,
    buyer_context: get('buyer') as BuyerContext | undefined,
    organisation_id: get('org'),
    organisation_name: get('orgName'),
    geography_type: geo,
    geography_id: get('geoId'),
    geography_label: get('geoLabel') || (geo === 'national' ? 'England (illustrative baseline)' : 'Selected area'),
    priority_type: get('priorityType') as PriorityType | undefined,
    priority_id: get('priorityId'),
    priority_label: get('priorityLabel'),
    scenario_id: scenario,
    temporary_view: get('tempView') === '1',
  }
}

export function mergeContext(base: CommissionerContext, patch: Partial<CommissionerContext>): CommissionerContext {
  return { ...base, ...patch }
}

export function contextDisplayLabel(ctx: CommissionerContext): string {
  const parts: string[] = []
  if (ctx.role) parts.push(ROLE_LABELS[ctx.role])
  parts.push(ctx.geography_label)
  if (ctx.priority_label) parts.push(ctx.priority_label)
  return parts.join(' · ')
}

export function contextPersonalisationState(ctx: CommissionerContext): 'national' | 'local' | 'mixed' {
  if (ctx.geography_type === 'national' || !ctx.geography_id) return 'national'
  return 'local'
}
