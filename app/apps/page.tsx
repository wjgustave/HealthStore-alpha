import { getAllApps } from '@/lib/data'
import CatalogueClient from './CatalogueClient'
import { Suspense } from 'react'

export const metadata = { title: 'Browse apps — HealthStore' }

function CatalogueSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div style={{ height: 32, width: 280, background: 'var(--border)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 16, width: 200, background: 'var(--border)', borderRadius: 4 }} />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div style={{ width: 256, flexShrink: 0 }}>
          <div style={{ height: 320, background: 'var(--border)', borderRadius: 12, opacity: 0.4 }} />
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: 240, background: 'var(--border)', borderRadius: 12, opacity: 0.4 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AppsPage() {
  const apps = getAllApps()
  return (
    <Suspense fallback={<CatalogueSkeleton />}>
      <CatalogueClient apps={apps} />
    </Suspense>
  )
}
