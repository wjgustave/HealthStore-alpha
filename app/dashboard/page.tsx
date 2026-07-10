import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/** Dashboard is disabled — send visitors home (catalogue remains in main nav). */
export default function DashboardPage() {
  redirect('/')
}
