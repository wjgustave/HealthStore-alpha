import {
  getAllApps,
  getAppBySlug,
  getConceptFeaturedContent,
  getConceptGridContent,
  getDashboardContent,
  getConditionAreas,
  getRemovedApps,
  getOpenFunding,
  getHomeNews,
  getHomeEvidenceSpotlights,
  getHomeCampaigns,
} from '@/lib/data'
import type { SessionData } from '@/lib/session'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'

/** Shared data bundle for the signed-in Dashboard (V4). */
export function getDashboardPageProps(session: SessionData) {
  return {
    apps: getAllApps(),
    dash: getDashboardContent(),
    conditions: getConditionAreas(),
    removedApps: getRemovedApps(),
    openFunding: getOpenFunding(),
    news: getHomeNews(),
    evidence: getHomeEvidenceSpotlights(),
    campaigns: getHomeCampaigns(),
    conceptGrid: getConceptGridContent(),
    conceptFeatured: getConceptFeaturedContent(),
    featuredApp: getAppBySlug(getConceptFeaturedContent().featured_app_slug),
    displayName: session.profileDisplayName,
    organisationName: getCommissioningContextLabel(session),
  }
}
