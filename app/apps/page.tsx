import { permanentRedirect } from 'next/navigation'

/** Legacy `/apps` hub — redirects to Product catalogue. */
export default async function AppsPageLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<{ condition?: string; q?: string }>
}) {
  const sp = await searchParams
  if (sp.condition || sp.q) {
    const p = new URLSearchParams()
    if (sp.condition) p.set('condition', sp.condition)
    if (sp.q) p.set('q', sp.q)
    permanentRedirect(`/catalogue/digital-therapeutics?${p.toString()}`)
  }
  permanentRedirect('/catalogue')
}
