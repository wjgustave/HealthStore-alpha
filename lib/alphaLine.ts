/**
 * HealthStore “alpha” line (e.g. `healthstore-alpha.vercel.app` deploying `main`):
 * no cookie consent banner and no Hotjar.
 *
 * Set `NEXT_PUBLIC_ALPHA_LINE=true` (or `1`) on that Vercel project only.
 * Omit on the v1 / prototype deployment so cookies + Hotjar behaviour stays on.
 */
export function isAlphaLineFromEnv(): boolean {
  const v = process.env.NEXT_PUBLIC_ALPHA_LINE
  if (v == null || v === '') return false
  const t = v.trim().toLowerCase()
  return t === '1' || t === 'true' || t === 'yes'
}
