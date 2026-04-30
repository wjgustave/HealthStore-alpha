import { redirect } from 'next/navigation'

/** Legacy `/apps/browse` URLs redirect to `/apps/condition-catalogue` (query preserved). */
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
  redirect(s ? `/apps/condition-catalogue?${s}` : '/apps/condition-catalogue')
}
