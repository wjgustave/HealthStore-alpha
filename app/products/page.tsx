import { redirect } from 'next/navigation'
import { getAllApps, getConditionAreas } from '@/lib/data'
import AppsDiscoveryClient from '../apps/AppsDiscoveryClient'

export const metadata = {
  title: 'Products — HealthStore',
  description: 'Browse clinically assured digital therapeutics.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ condition?: string; q?: string }>
}) {
  const sp = await searchParams
  if (sp.condition || sp.q) {
    const p = new URLSearchParams()
    if (sp.condition) p.set('condition', sp.condition)
    if (sp.q) p.set('q', sp.q)
    redirect(`/products/condition-catalogue?${p.toString()}`)
  }

  const conditionAreas = getConditionAreas()
  const apps = getAllApps()
  return <AppsDiscoveryClient conditionAreas={conditionAreas} apps={apps} totalAppCount={apps.length} />
}
