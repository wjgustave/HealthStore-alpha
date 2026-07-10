import { permanentRedirect } from 'next/navigation'

/** Legacy `/apps/browse` URLs redirect to Digital therapeutics (query preserved). */
export default async function AppsBrowseLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const p = new URLSearchParams()
  for (const [key, val] of Object.entries(sp)) {
    if (val === undefined) continue
    if (Array.isArray(val)) val.forEach(v => p.append(key, v))
    else p.set(key, val)
  }
  const s = p.toString()
  permanentRedirect(s ? `/product-catalogue/digital-therapeutics?${s}` : '/product-catalogue/digital-therapeutics')
}
