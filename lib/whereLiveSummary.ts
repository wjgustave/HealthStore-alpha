import { getDeploymentRegister, summarizeDeployments, type DeploymentRow } from '@/lib/deploymentRegister'

export type WhereLiveApp = {
  deployment_register?: DeploymentRow[]
  named_sites?: { name?: string; status?: string }[]
  live_sites?: string
}

export type WhereLiveSummary = {
  /** Flat headline for compare / plain-text fallbacks. */
  headline: string
  /** Flat detail line for compare / plain-text fallbacks. */
  detail: string | null
  /** Primary callout line, e.g. "5 sites". */
  sitesText: string | null
  /** Inline status counts, e.g. "2 pilot · 1 research". */
  statusText: string | null
  /** Subline below, e.g. "Across 3 ICBs". */
  icbText: string | null
}

function buildStatusText(summary: ReturnType<typeof summarizeDeployments>): string | null {
  const extras: string[] = []
  if (summary.pilotCount) extras.push(`${summary.pilotCount} pilot`)
  if (summary.researchCount) extras.push(`${summary.researchCount} research`)
  if (summary.historicCount) extras.push(`${summary.historicCount} historic`)
  return extras.length ? extras.join(' · ') : null
}

function buildIcbText(icbCount: number): string | null {
  if (icbCount <= 0) return null
  return `Across ${icbCount} ${icbCount === 1 ? 'ICB' : 'ICBs'}`
}

function flatHeadline(sitesText: string, icbText: string | null): string {
  if (icbText) return `${sitesText} ${icbText.toLowerCase()}`
  return sitesText
}

export function getWhereLiveSummary(app: WhereLiveApp): WhereLiveSummary {
  const rows = getDeploymentRegister(app)
  const summary = summarizeDeployments(rows)

  if (rows.length === 0) {
    const headline = 'Deployment footprint not yet recorded'
    return {
      headline,
      detail: null,
      sitesText: headline,
      statusText: null,
      icbText: null,
    }
  }

  if (summary.liveCount > 0) {
    const sitesText = `${summary.liveCount} ${summary.liveCount === 1 ? 'site' : 'sites'}`
    const statusText = buildStatusText(summary)
    const icbText = buildIcbText(summary.icbCount)
    return {
      headline: flatHeadline(sitesText, icbText),
      detail: statusText,
      sitesText,
      statusText,
      icbText,
    }
  }

  const sitesText = `${summary.total} recorded ${summary.total === 1 ? 'deployment' : 'deployments'}`
  const detail = 'No confirmed live sites — see status detail'
  return {
    headline: sitesText,
    detail,
    sitesText,
    statusText: detail,
    icbText: null,
  }
}
