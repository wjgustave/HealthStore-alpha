import type { CommissionerContext } from '@/lib/context/types'
import workspaceData from '@/content/local/workspace-deployments.json'

export type WorkspaceDeployment = {
  id: string
  product: string
  pathway: string
  status: 'live' | 'mobilising'
  route: string
  active_users: number
  vs_target_pct: number | null
  detail: {
    invited?: number
    registered?: number
    registered_pct?: number
    active_90d?: number
    active_pct?: number
    completion_rate?: number
    registration_percentile?: number
    data_completeness?: number
    weeks_live?: number
    insight: string
    insight_variant?: 'default' | 'warn' | 'good'
  }
}

export type BenchmarkEntry = {
  p10: number
  median: number
  p90: number
  you: number | null
  percentile: number | null
  rank?: number | null
  total_icbs?: number
}

export type WorkspaceIcbData = {
  icb_id: string
  icb_name: string
  coverage_funnel: { eligible: number; invited: number; registered: number; active: number }
  kpis: {
    live_deployments: number
    mobilising: number
    eligible_reached_pct: number
    active_users_90d: number
    contract_utilisation_pct: number
  }
  monthly_admissions?: { month: string; baseline: number; with_dtx: number }[]
  retention?: {
    you: { day: number; value: number }[]
    pooled: { day: number; value: number }[]
  }
  benchmarks: {
    registration_rate: BenchmarkEntry
    uptake_rate: BenchmarkEntry
  }
  deployments: WorkspaceDeployment[]
  opportunity_value_gbp: number
  unmet_headroom: number
}

export function getWorkspaceIcbData(ctx: CommissionerContext): WorkspaceIcbData {
  const key = ctx.geography_type === 'national' || !ctx.geography_id
    ? 'national'
    : ctx.geography_id
  const data = workspaceData.icbs[key as keyof typeof workspaceData.icbs]
  if (data) return data as WorkspaceIcbData
  return workspaceData.icbs.national as WorkspaceIcbData
}

export function getDtxImpactRanges() {
  return workspaceData.dtx_impact_ranges
}

export function buildCoverageFunnelStages(data: WorkspaceIcbData) {
  const f = data.coverage_funnel
  return [
    { label: 'Eligible population', value: f.eligible, pct: 100 },
    { label: 'Invited via pathway', value: f.invited, pct: Math.round((f.invited / f.eligible) * 100) },
    { label: 'Registered', value: f.registered, pct: Math.round((f.registered / f.eligible) * 100) },
    { label: 'Active users (90-day)', value: f.active, pct: Math.round((f.active / f.eligible) * 100) },
  ]
}

export function isProductDeployedForContext(productName: string, ctx: CommissionerContext): WorkspaceDeployment | null {
  const data = getWorkspaceIcbData(ctx)
  const match = data.deployments.find(
    (d) => d.product.toLowerCase() === productName.toLowerCase() && d.status === 'live'
  )
  return match ?? null
}

export function hasAnyDeployments(ctx: CommissionerContext): boolean {
  const data = getWorkspaceIcbData(ctx)
  return data.deployments.length > 0
}
