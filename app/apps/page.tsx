import { redirect } from 'next/navigation'
import { getAllApps, getConditionAreas } from '@/lib/data'
import AppsDiscoveryClient from './AppsDiscoveryClient'

export const metadata = {
  title: 'Browse apps — HealthStore',
  description: 'Search or choose a condition to explore digital therapeutics in the HealthStore catalogue.',
}

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<{ condition?: string; q?: string }>
}) {
  const sp = await searchParams
  if (sp.condition || sp.q) {
    const p = new URLSearchParams()
    if (sp.condition) p.set('condition', sp.condition)
    if (sp.q) p.set('q', sp.q)
    redirect(`/apps/browse?${p.toString()}`)
  }

  const conditionAreas = getConditionAreas()
  const apps = getAllApps()
  return <AppsDiscoveryClient conditionAreas={conditionAreas} apps={apps} totalAppCount={apps.length} />
}
