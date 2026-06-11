import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import { getDashboardPageProps } from '@/lib/dashboardPageData'
import { DashboardV4 } from '@/components/home/dashboard/DashboardV4'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Dashboard — HealthStore' }
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session.isLoggedIn) redirect('/login')
  if (session.requiresCommissioningEntitySelection) redirect('/select-entity')

  const props = getDashboardPageProps(session)

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10">
      <PageBreadcrumb items={[{ label: 'Dashboard' }]} />
      <DashboardV4 {...props} />
    </div>
  )
}
