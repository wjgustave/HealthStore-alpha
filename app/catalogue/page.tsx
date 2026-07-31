import { redirect } from 'next/navigation'
import { getAllApps, getConditionAreas } from '@/lib/data'
import AppsDiscoveryClient from '../apps/AppsDiscoveryClient'

export const metadata = {
  title: 'Product catalogue — NHS HealthStore',
  description: 'Browse clinically assured digital therapeutics in the NHS HealthStore catalogue.',
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ condition?: string; q?: string }>
}) {
  const sp = await searchParams
  if (sp.condition || sp.q) {
    const p = new URLSearchParams()
    if (sp.condition) p.set('condition', sp.condition)
    if (sp.q) p.set('q', sp.q)
    redirect(`/catalogue/digital-therapeutics?${p.toString()}`)
  }

  const conditionAreas = getConditionAreas()
  const apps = getAllApps()
  return <AppsDiscoveryClient conditionAreas={conditionAreas} apps={apps} totalAppCount={apps.length} />
}
