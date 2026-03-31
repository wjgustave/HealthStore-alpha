import { formatPricingModelDisplay } from '@/components/AppDetailSections'

/** Labels shown on catalogue cards when price qualifies (green dot row). */
export type CataloguePriceLabel = 'National pricing' | 'Free (no support)'

/**
 * Free row: flag, enum free_pilot, raw "free", or formatted text containing "free" as a word.
 * National row: enum national_flat or formatted text contains "national".
 * Free takes precedence when both could apply.
 */
export function getCataloguePriceLabel(app: {
  pricing_model?: string
  free_offer_flag?: boolean
}): CataloguePriceLabel | null {
  const raw = app.pricing_model != null ? String(app.pricing_model).trim() : ''
  const rawLower = raw.toLowerCase()
  const formatted = formatPricingModelDisplay(raw || undefined)
  const formattedLower = formatted.toLowerCase()

  const looksFree =
    app.free_offer_flag === true
    || raw === 'free_pilot'
    || rawLower === 'free'
    || /\bfree\b/i.test(formatted)

  if (looksFree) return 'Free (no support)'

  const looksNational = raw === 'national_flat' || formattedLower.includes('national')
  if (looksNational) return 'National pricing'

  return null
}

export function hasLinkedFunding(app: {
  linked_funding_ids?: string[] | null
  funding_ids?: string[] | null
}): boolean {
  const ids = app.linked_funding_ids ?? app.funding_ids ?? []
  return Array.isArray(ids) && ids.length > 0
}

/** Stable ~50% true per app id (SSR-safe catalogue demo row). */
export function stableCatalogueDemoAvailable(appId: string): boolean {
  let h = 0
  for (let i = 0; i < appId.length; i++) {
    h = (Math.imul(31, h) + appId.charCodeAt(i)) | 0
  }
  const u = h >>> 0
  return u % 100 < 50
}

/** Catalogue “Demo available” row: explicit JSON flag overrides hash. */
export function catalogueDemoAvailable(app: {
  id: string
  catalogue_demo_available?: boolean
}): boolean {
  if (app.catalogue_demo_available === true) return true
  if (app.catalogue_demo_available === false) return false
  return stableCatalogueDemoAvailable(app.id)
}
