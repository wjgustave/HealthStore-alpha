/** Client-only: persisted homepage layout key (V2 only; legacy `v1` was retired). */
export const HOME_LAYOUT_STORAGE_KEY = 'healthstore_home_layout'

export function setHomeLayoutPreferenceAfterAuth(variant: 'v2' = 'v2') {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(HOME_LAYOUT_STORAGE_KEY, variant)
  } catch {
    /* ignore */
  }
}
