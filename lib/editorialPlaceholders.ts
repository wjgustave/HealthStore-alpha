export const EDITORIAL_IMAGE_KEYS = ['abstract-a', 'abstract-b', 'abstract-c', 'nhs-ltp-banner'] as const
export type EditorialImageKey = (typeof EDITORIAL_IMAGE_KEYS)[number]

const PATHS: Record<EditorialImageKey, string> = {
  'abstract-a': '/images/home/placeholder-a.svg',
  'abstract-b': '/images/home/placeholder-b.svg',
  'abstract-c': '/images/home/placeholder-c.svg',
  'nhs-ltp-banner': '/images/home/campaign-nhs-long-term-plan.png',
}

export function editorialImageSrc(key: EditorialImageKey): string {
  return PATHS[key]
}

/** Pick placeholder from explicit JSON field or hash of id for variety */
export function resolveEditorialImageKey(itemId: string, explicit?: EditorialImageKey | null): EditorialImageKey {
  if (explicit && EDITORIAL_IMAGE_KEYS.includes(explicit)) return explicit
  let h = 0
  for (let i = 0; i < itemId.length; i++) h = (h * 31 + itemId.charCodeAt(i)) | 0
  return EDITORIAL_IMAGE_KEYS[Math.abs(h) % EDITORIAL_IMAGE_KEYS.length]
}
