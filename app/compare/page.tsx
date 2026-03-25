import { Suspense } from 'react'
import { getAllApps } from '@/lib/data'
import CompareClient from './CompareClient'

export const metadata = { title: 'Compare apps — HealthStore' }

function CompareSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div style={{ height: 36, width: 220, background: 'var(--border)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 18, width: 360, background: 'var(--border)', borderRadius: 4 }} />
      </div>
      <div className="hs-surface-card rounded-xl border p-5 mb-8 bg-white" style={{ borderColor: 'var(--border)' }}>
        <div style={{ height: 16, width: 200, background: 'var(--border)', borderRadius: 4, marginBottom: 16 }} />
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ height: 36, width: 100, background: 'var(--border)', borderRadius: 8, opacity: 0.5 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const allApps = getAllApps()
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareClient allApps={allApps} />
    </Suspense>
  )
}
