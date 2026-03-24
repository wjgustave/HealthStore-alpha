export type HomeLayoutVariant = 'v1' | 'v2'

/** Legacy `?home=v3` / `?home=v4` (former editorial / concept) map to V2. */
export function parseHomeVariant(raw: string | string[] | undefined): HomeLayoutVariant {
  const v = Array.isArray(raw) ? raw[0] : raw
  if (v === 'v1' || v === 'v2') return v
  if (v === 'v3' || v === 'v4') return 'v2'
  return 'v1'
}
