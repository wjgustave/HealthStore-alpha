import { permanentRedirect } from 'next/navigation'

/** Legacy `/products/condition-catalogue` — redirects to Digital therapeutics. */
export default async function ProductsConditionCatalogueLegacyRedirect({
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
  permanentRedirect(s ? `/catalogue/digital-therapeutics?${s}` : '/catalogue/digital-therapeutics')
}
