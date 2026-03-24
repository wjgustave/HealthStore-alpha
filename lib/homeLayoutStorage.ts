/** Client-only: persisted homepage layout (`/?home=v1` | `/?home=v2`). */
export const HOME_LAYOUT_STORAGE_KEY = 'healthstore_home_layout'

export function setHomeLayoutPreferenceAfterAuth(variant: 'v1' | 'v2' = 'v1') {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(HOME_LAYOUT_STORAGE_KEY, variant)
  } catch {
    /* ignore */
  }
}
