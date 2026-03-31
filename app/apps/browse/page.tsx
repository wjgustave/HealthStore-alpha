import { Suspense } from 'react'
import { getAllApps } from '@/lib/data'
import CatalogueClient from '../CatalogueClient'
import CatalogueSkeleton from '../CatalogueSkeleton'

export const metadata = { title: 'Browse digital therapeutics — HealthStore' }

export default function AppsBrowsePage() {
  const apps = getAllApps()
  return (
    <Suspense fallback={<CatalogueSkeleton />}>
      <CatalogueClient apps={apps} />
    </Suspense>
  )
}
