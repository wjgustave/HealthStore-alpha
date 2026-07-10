import { Suspense } from 'react'
import { getAllApps } from '@/lib/data'
import CatalogueClient from '../../apps/CatalogueClient'
import CatalogueSkeleton from '../../apps/CatalogueSkeleton'

export const metadata = { title: 'Digital therapeutics — HealthStore' }

export default function DigitalTherapeuticsPage() {
  const apps = getAllApps()
  return (
    <Suspense fallback={<CatalogueSkeleton />}>
      <CatalogueClient apps={apps} />
    </Suspense>
  )
}
