import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import './globals.css'
import AppShell from '@/components/AppShell'
import HotjarRouteTracker from '@/components/HotjarRouteTracker'
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
        <Script id="hotjar-tracking" strategy="afterInteractive">
          {`
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:1527524,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
        <Suspense fallback={null}>
          <HotjarRouteTracker />
        </Suspense>
        <AppShell
          isLoggedIn={isLoggedIn}
          commissioningContextLabel={commissioningContextLabel}
          allApps={allApps}
        >
          {children}
        </AppShell>
      </body>
    </html>
  )
}
