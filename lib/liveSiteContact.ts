/**
 * Derives placeholder NHS-style contact emails for Live sites rows:
 * `{slug}.pulmonary.sleep@nhs.net`
 */

const DOMAIN = 'nhs.net'
const SUFFIX = 'pulmonary.sleep'

/** Lowercase slug safe for email local-part (RFC-ish: avoid empty). */
export function slugifyLiveSiteLocalPart(name: string): string {
  const raw = typeof name === 'string' ? name.trim() : ''
  if (!raw) return ''

  const normalized = raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug
}

export function liveSiteContactEmail(siteName: string, index: number): string {
  let slug = slugifyLiveSiteLocalPart(siteName)
  if (!slug) slug = `site-${index}`
  return `${slug}.${SUFFIX}@${DOMAIN}`
}
