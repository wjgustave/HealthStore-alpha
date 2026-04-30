/** localStorage key for analytics cookie choice (Hotjar). Not an HTTP cookie. */
export const COOKIE_CONSENT_STORAGE_KEY = 'healthstore_analytics_consent'

export type AnalyticsConsent = 'analytics' | 'rejected'

export function getStoredConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (v === 'analytics' || v === 'rejected') return v
    return null
  } catch {
    return null
  }
}

export function setStoredConsent(value: AnalyticsConsent): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value)
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStoredConsent(): void {
  try {
    localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
