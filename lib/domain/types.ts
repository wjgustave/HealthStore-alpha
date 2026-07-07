/**
 * Generic domain and provenance model (spec section 9.1).
 * All pathway opportunity, deployment and benefit data flows through these types.
 */

export type MetricBasis =
  | 'observed_local'
  | 'published_local'
  | 'national_proxy'
  | 'modelled'
  | 'synthetic_demo'

export type Suppression = 'none' | 'small_numbers' | 'poor_quality' | 'not_comparable'

export interface MetricValue {
  value: number | string | null
  unit: string
  basis: MetricBasis
  source: string
  dataDate: string
  confidence?: 'high' | 'medium' | 'low'
  suppression?: Suppression
  notes?: string
}

export type PriorityBand = 'high' | 'medium' | 'watch' | 'insufficient_data'

export type DeploymentStatus = 'planned' | 'mobilising' | 'live' | 'paused' | 'ending' | 'closed'

export type BuyingRoute = 'healthstore' | 'framework' | 'other_route' | 'legacy' | 'unknown'

export interface DeploymentRecord {
  id: string
  product: string
  supplier?: string
  pathway: string
  conditionId: string
  provider?: string
  status: DeploymentStatus
  route: BuyingRoute
  eligibleCohort?: MetricValue
  invited?: number
  registered?: number
  active?: number
  completionRate?: number
  targetVariance?: number | null
  dataCompleteness?: number
  outcomeReturn?: 'available' | 'partial' | 'planned' | 'not_collected' | 'not_applicable'
  reportingDate?: string
  insight?: string
  insightVariant?: 'default' | 'warn' | 'good'
}

export interface ImpactCategory {
  lens: 'care_outcomes' | 'demand_capacity' | 'access_equity' | 'financial_public_value'
  summary: string
  metrics?: MetricValue[]
}

export interface PathwayOpportunity {
  conditionId: string
  label: string
  pathwayPosition?: string
  geographyCode: string
  geographyLabel: string
  needSignal?: MetricValue
  needMetrics: MetricValue[]
  eligiblePopulation?: MetricValue
  currentCoverage?: MetricValue
  addressableGap?: MetricValue
  pathwayPressure: MetricValue[]
  deploymentSummary: {
    status: DeploymentStatus | 'absent'
    count: number
    activeUsers?: number
    note?: string
  }
  relevantProductIds: string[]
  evidenceStatus: string
  readinessStatus: string
  impactCategories: ImpactCategory[]
  priorityBand: PriorityBand
  priorityRationale: string
  dataQuality?: string
}

export interface ConditionDomain {
  id: string
  label: string
  category: 'prevention' | 'long_term_condition' | 'rehabilitation' | 'mental_health'
  contentStatus: 'fully_populated' | 'deployment_fixtures' | 'reporting_fixtures' | 'opportunity_shell'
  productSlugs: string[]
  pathwayPosition?: string
}

export type BenefitCategory =
  | 'observed_activity'
  | 'evaluated_outcome'
  | 'capacity_released'
  | 'modelled_opportunity'
  | 'cash_releasing'
  | 'health_public_value'

export interface BenefitRecord {
  category: BenefitCategory
  label: string
  value: MetricValue
  budgetOwner?: string
  benefitOwner?: string
  caveat: string
}
