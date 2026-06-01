import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'
import CookieConsentRoot from '@/components/CookieConsentRoot'
import { isAlphaLineFromEnv } from '@/lib/alphaLine'
import { getSession } from '@/lib/session'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'
import { getCommissionerProfileFromSession } from '@/lib/ai/commissionerProfiles'
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
  const alphaLine = isAlphaLineFromEnv()

  const aiProfile = isLoggedIn
    ? (() => {
        const profile = getCommissionerProfileFromSession(session)
        return {
          commissionerName: profile.commissionerName,
          roleTitle: profile.roleTitle,
          icbName: profile.icbName,
          region: profile.region,
          starterPrompts: profile.starterPrompts,
        }
      })()
    : null

  return (
    <html lang="en">
      <head>
      </head>
      <body className="min-h-screen" style={{ background: 'var(--surface)' }}>
        {alphaLine ? (
          <AppShell
            isLoggedIn={isLoggedIn}
            commissioningContextLabel={commissioningContextLabel}
            allApps={allApps}
            aiProfile={aiProfile}
          >
            {children}
          </AppShell>
        ) : (
          <CookieConsentRoot>
            <AppShell
              isLoggedIn={isLoggedIn}
              commissioningContextLabel={commissioningContextLabel}
              allApps={allApps}
              aiProfile={aiProfile}
            >
              {children}
            </AppShell>
          </CookieConsentRoot>
        )}
      </body>
    </html>
  )
}
