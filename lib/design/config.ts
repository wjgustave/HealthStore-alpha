/**
 * Switchable visual design system.
 *
 * - Design "a" (v1) — "NHS Digital": modern professional, dense, NHS blue accent.
 * - Design "b" (v2) — "Editorial clean": airy, large type, image-forward.
 *
 * The active design is stored in a cookie so the server can read it during SSR
 * and set `data-design` on <html>, which avoids a flash of the wrong theme.
 */
export type DesignId = 'a' | 'b'

export const DESIGN_IDS: readonly DesignId[] = ['a', 'b'] as const

export const DEFAULT_DESIGN: DesignId = 'a'

/** Cookie name holding the active design id. */
export const DESIGN_COOKIE = 'hs-design'

/** One year in seconds — design preference is long-lived. */
export const DESIGN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const DESIGN_LABELS: Record<DesignId, { short: string; long: string }> = {
  a: { short: 'v1', long: 'v1 · Modern' },
  b: { short: 'v2', long: 'v2 · Editorial' },
}

export function isDesignId(value: unknown): value is DesignId {
  return value === 'a' || value === 'b'
}

/** Normalise an arbitrary cookie value to a valid design id. */
export function coerceDesignId(value: string | undefined | null): DesignId {
  return isDesignId(value) ? value : DEFAULT_DESIGN
}
