import { getAllApps } from '@/lib/data'
import CompareClient from './CompareClient'
import { Suspense } from 'react'

export const metadata = { title: 'Compare apps — NHS Commissioner DTx Store' }

function CompareSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div style={{ height: 32, width: 200, background: 'var(--border)', borderRadius: 6, marginBottom: 20, opacity: 0.4 }} />
      <div style={{ height: 60, background: 'var(--border)', borderRadius: 12, marginBottom: 20, opacity: 0.4 }} />
      <div style={{ height: 400, background: 'var(--border)', borderRadius: 12, opacity: 0.3 }} />
    </div>
  )
}

export default function ComparePage() {
  const apps = getAllApps()
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareClient allApps={apps} />
    </Suspense>
  )
}
