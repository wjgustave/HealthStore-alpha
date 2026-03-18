import myCOPD from '@/content/apps/mycopd.json'
import clinitouch from '@/content/apps/clinitouch.json'
import copdhub from '@/content/apps/copdhub.json'
import luscii from '@/content/apps/luscii.json'
import fundingData from '@/content/funding/funding.json'
import conditionsData from '@/content/conditions/conditions.json'
import dashboardData from '@/content/dashboard/dashboard.json'

export type App = any
export type Funding = any
export type Condition = any

export function getAllApps(): App[] {
  return [myCOPD, clinitouch, copdhub, luscii]
}

export function getAppBySlug(slug: string): App | undefined {
  return getAllApps().find((a: App) => a.slug === slug)
}

export function getAppsByCondition(conditionId: string): App[] {
  return getAllApps().filter((a: App) => a.condition_tags.includes(conditionId))
}

export function getAllFunding(): Funding[] {
  return fundingData as Funding[]
}

export function getAllConditions(): Condition[] {
  return conditionsData as Condition[]
}

export function getDashboardContent() {
  return dashboardData
}

export const supervisionLabels: Record<string, string> = {
  self_management_only: 'Self-management only',
  guided_self_help: 'Guided self-help',
  non_continuous_review: 'Non-continuous review',
  active_remote_management: 'Active remote management',
}

export const maturityLabels: Record<string, string> = {
  scaled: 'Scaled',
  multi_site_live: 'Multi-site live',
  limited_live: 'Limited live',
  pilot: 'Pilot',
}

export const effortLabels: Record<string, string> = {
  low: 'Low effort',
  medium: 'Medium effort',
  high: 'High effort',
}

export const evidenceLabels: Record<string, string> = {
  emerging: 'Emerging',
  promising: 'Promising',
  established: 'Established',
  scaled: 'Scaled evidence',
}

export const dtacLabels: Record<string, string> = {
  passed: 'DTAC Passed',
  passed_refresh_required: 'DTAC Passed – refresh required',
  required_not_confirmed: 'DTAC required – not confirmed',
  not_applicable: 'N/A',
}
