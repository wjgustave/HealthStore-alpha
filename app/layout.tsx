import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'
import CookieConsentRoot from '@/components/CookieConsentRoot'
import { isAiAdvisorEnabledFromEnv } from '@/lib/aiAdvisor'
import { isAlphaLineFromEnv } from '@/lib/alphaLine'
import { getSession } from '@/lib/session'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'
import { getResolvedOrganisationProfile } from '@/lib/ai/organisationProfileResolver'
import { getAllApps } from '@/lib/data'

export const metadata: Metadata = {
  title: 'HealthStore',
  description: 'Decision-support tool for NHS digital health technology procurement',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const isLoggedIn = session.isLoggedIn
  const commissioningContextLabel = isLoggedIn ? getCommissioningContextLabel(session) : ''
  const allApps = getAllApps()
  const alphaLine = isAlphaLineFromEnv()
  const aiAdvisorEnabled = isAiAdvisorEnabledFromEnv()

  const aiProfile =
    isLoggedIn && aiAdvisorEnabled
      ? await (async () => {
          const profile = await getResolvedOrganisationProfile(session)
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
      <body>
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
