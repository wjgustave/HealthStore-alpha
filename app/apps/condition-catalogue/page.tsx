import { Suspense } from 'react'
import { getAllApps } from '@/lib/data'
import CatalogueClient from '../CatalogueClient'
import CatalogueSkeleton from '../CatalogueSkeleton'

export const metadata = { title: 'Condition catalogue — HealthStore' }

export default function ConditionCataloguePage() {
  const apps = getAllApps()
  return (
    <Suspense fallback={<CatalogueSkeleton />}>
      <CatalogueClient apps={apps} />
    </Suspense>
  )
}
