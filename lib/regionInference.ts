import { REGIONS, type Region } from '@/lib/ai/funding/data'

/**
 * Maps an NHS organisation name to an NHS England region.
 * Pure + client-safe (no DB or large data imports) so it can be reused by the
 * Org Settings page for region auto-population as well as server-side funding.
 */
export function inferRegionFromOrganisationName(orgName: string | undefined): Region | undefined {
  const normalised = (orgName ?? '').trim().toLowerCase()
  if (!normalised) return undefined

  if (normalised.includes('cornwall') || normalised.includes('isles of scilly')) {
    return 'South West'
  }
  if (normalised.includes('north east london')) return 'London'
  if (
    normalised.includes('west yorkshire') ||
    normalised.includes('airedale') ||
    normalised.includes('bradford')
  ) {
    return 'North East and Yorkshire'
  }
  if (normalised.includes('hampshire') || normalised.includes('isle of wight')) {
    return 'South East'
  }
  if (normalised.includes('shropshire') || normalised.includes('telford')) {
    return 'Midlands'
  }

  return undefined
}

export { REGIONS, type Region }
