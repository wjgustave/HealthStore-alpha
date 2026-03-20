import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'
import { getSession } from '@/lib/session'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'

export const metadata: Metadata = {
  title: 'HealthStore',
  description: 'Decision-support tool for NHS digital health technology procurement',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const commissioningContextLabel = session.isLoggedIn ? getCommissioningContextLabel(session) : ''

  return (
    <html lang="en">
      <head>
      </head>
      <body className="min-h-screen" style={{ background: 'var(--surface)' }}>
        <AppShell commissioningContextLabel={commissioningContextLabel}>{children}</AppShell>
      </body>
    </html>
  )
}
