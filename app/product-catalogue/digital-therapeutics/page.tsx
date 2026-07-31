import { permanentRedirect } from 'next/navigation'

/** Legacy `/product-catalogue/digital-therapeutics` — redirects to `/catalogue/digital-therapeutics`. */
export default async function DigitalTherapeuticsLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const p = new URLSearchParams()
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === 'string') p.set(key, value)
    else if (Array.isArray(value)) value.forEach(v => p.append(key, v))
  }
  const qs = p.toString()
  permanentRedirect(qs ? `/catalogue/digital-therapeutics?${qs}` : '/catalogue/digital-therapeutics')
}
