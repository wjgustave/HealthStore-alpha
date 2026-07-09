/**
 * Deployment register: canonical "Where it's live" data for the PDP.
 * See docs/PDP_WHERE_ITS_LIVE_REDESIGN.md for the UCD rationale and taxonomy.
 */

export type DeploymentStatus =
  | 'live'
  | 'pilot'
  | 'research'
  | 'historic'
  | 'undocumented'
  | 'unknown'

export type DeploymentConfidence = 'high' | 'medium' | 'low'

export type DeploymentRow = {
  site: string
  condition?: string
  icb?: string
  location?: string
  delivery?: string
  care_setting?: string
  status?: DeploymentStatus
  confidence?: DeploymentConfidence
  notes?: string
}

type StatusMeta = {
  label: string
  /** Foreground / background / border for the status badge. */
  fg: string
  bg: string
  border: string
}

export const DEPLOYMENT_STATUS_META: Record<DeploymentStatus, StatusMeta> = {
  live: { label: 'Live', fg: '#00582A', bg: '#E6F5EC', border: '#9AD3B0' },
  pilot: { label: 'Pilot', fg: '#003B7A', bg: '#E6F0FB', border: '#A2C8E8' },
  research: { label: 'Research', fg: '#3A1D7A', bg: '#EEE9FB', border: '#C3B5EA' },
  historic: { label: 'Historic / de-procured', fg: '#7A1210', bg: '#FBEAE8', border: '#E3A9A4' },
  undocumented: { label: 'Vendor claim (unverified)', fg: '#7A4800', bg: '#FEF5E6', border: '#EBC78A' },
  unknown: { label: 'Status unknown', fg: '#4B5563', bg: '#F1F3F6', border: '#D5DBE3' },
}

export const DEPLOYMENT_CONFIDENCE_LABEL: Record<DeploymentConfidence, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
}

/** Display order: currently-live first, historic last. */
const STATUS_ORDER: DeploymentStatus[] = ['live', 'pilot', 'research', 'undocumented', 'unknown', 'historic']

export function statusMeta(status: string | undefined): StatusMeta {
  return DEPLOYMENT_STATUS_META[(status as DeploymentStatus) ?? 'unknown'] ?? DEPLOYMENT_STATUS_META.unknown
}

/** Read and normalise register rows from an app record (defensive against legacy data). */
export function getDeploymentRegister(app: {
  deployment_register?: DeploymentRow[]
  named_sites?: { name?: string; status?: string }[]
  live_sites?: string
}): DeploymentRow[] {
  const raw = Array.isArray(app?.deployment_register) ? app.deployment_register : []
  const rows = raw.filter(r => r && typeof r.site === 'string' && r.site.trim().length > 0)
  if (rows.length > 0) return sortDeployments(rows)

  // Defensive fallback if a record was not migrated (data migration should make this rare).
  const named = Array.isArray(app?.named_sites) ? app.named_sites : []
  const fromNamed: DeploymentRow[] = named
    .filter(s => typeof s?.name === 'string' && s.name.trim().length > 0)
    .map(s => ({
      site: s.name as string,
      status: s.status === 'decommissioned' ? 'historic' : s.status === 'unknown' ? 'unknown' : 'live',
    }))
  if (fromNamed.length > 0) return sortDeployments(fromNamed)

  const legacy = typeof app?.live_sites === 'string' ? app.live_sites.trim() : ''
  if (legacy) return [{ site: 'Reported deployments', status: 'undocumented', notes: legacy }]
  return []
}

export function sortDeployments(rows: DeploymentRow[]): DeploymentRow[] {
  return [...rows].sort((a, b) => {
    const ia = STATUS_ORDER.indexOf((a.status as DeploymentStatus) ?? 'unknown')
    const ib = STATUS_ORDER.indexOf((b.status as DeploymentStatus) ?? 'unknown')
    if (ia !== ib) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
    return a.site.localeCompare(b.site)
  })
}

export type CareSettingGroup = 'Primary' | 'Secondary' | 'Community'

export type DeploymentSummary = {
  total: number
  liveCount: number
  pilotCount: number
  researchCount: number
  historicCount: number
  /** Distinct ICBs among currently-relevant (non-historic) rows. */
  icbCount: number
  /** Deployments by care-setting group (a row may count in more than one). */
  primaryCount: number
  secondaryCount: number
  communityCount: number
}

/**
 * Map free-text care_setting onto Primary / Secondary / Community.
 * Community variants win over parenthetical "secondary-led" wording.
 * Dual labels (e.g. "Primary & secondary care") count in both groups.
 */
export function careSettingGroups(careSetting?: string): CareSettingGroup[] {
  if (!careSetting?.trim()) return []
  const lower = careSetting.toLowerCase()
  if (/\bcommunity\b/.test(lower)) return ['Community']
  const groups: CareSettingGroup[] = []
  if (/\bprimary\b/.test(lower)) groups.push('Primary')
  if (/\bsecondary\b/.test(lower)) groups.push('Secondary')
  return groups
}

export function summarizeDeployments(rows: DeploymentRow[]): DeploymentSummary {
  const icbs = new Set<string>()
  let liveCount = 0
  let pilotCount = 0
  let researchCount = 0
  let historicCount = 0
  let primaryCount = 0
  let secondaryCount = 0
  let communityCount = 0
  for (const r of rows) {
    const st = r.status ?? 'unknown'
    if (st === 'live') liveCount++
    else if (st === 'pilot') pilotCount++
    else if (st === 'research') researchCount++
    else if (st === 'historic') historicCount++
    if (st !== 'historic' && r.icb && r.icb.trim()) icbs.add(r.icb.trim())
    for (const group of careSettingGroups(r.care_setting)) {
      if (group === 'Primary') primaryCount++
      else if (group === 'Secondary') secondaryCount++
      else communityCount++
    }
  }
  return {
    total: rows.length,
    liveCount,
    pilotCount,
    researchCount,
    historicCount,
    icbCount: icbs.size,
    primaryCount,
    secondaryCount,
    communityCount,
  }
}
