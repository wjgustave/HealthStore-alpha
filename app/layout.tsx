import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'
import CookieConsentRoot from '@/components/CookieConsentRoot'
import { getSession } from '@/lib/session'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'
import { getAllApps } from '@/lib/data'

export const metadata: Metadata = {
  title: 'HealthStore',
  description: 'Decision-support tool for NHS digital health technology procurement',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const isLoggedIn = session.isLoggedIn
  const commissioningContextLabel = isLoggedIn ? getCommissioningContextLabel(session) : ''
  const allApps = getAllApps()

  return (
    <html lang="en">
      <head>
      </head>
      <body className="min-h-screen" style={{ background: 'var(--surface)' }}>
        <CookieConsentRoot>
          <AppShell
            isLoggedIn={isLoggedIn}
            commissioningContextLabel={commissioningContextLabel}
            allApps={allApps}
          >
            {children}
          </AppShell>
        </CookieConsentRoot>
      </body>
    </html>
  )
}
