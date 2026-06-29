'use client'

import NhsHeader from '@/components/nhs/NhsHeader'
import NhsFooter from '@/components/nhs/NhsFooter'
import BackToTop from './BackToTop'
import { CompareBasketProvider } from './CompareBasketProvider'
import { BookmarkProvider } from './BookmarkProvider'
import { EoiProvider } from './EoiProvider'
import { ToastProvider } from './ui/Toast'
import ClearDataModal from './ClearDataModal'
import AiAdvisorPanel, { type AiAdvisorClientProfile } from './ai/AiAdvisorPanel'
import type { App } from '@/lib/data'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

function PrototypeBanner() {
  return (
    <div style={{ background: '#f0f4f5', borderBottom: '1px solid #d8dde0', fontSize: 14, padding: '10px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <strong>Prototype service.</strong> Decision-support for commissioners — not a purchase channel. Illustrative data unless labelled otherwise.
      </div>
    </div>
  )
}

export default function AppShell({
  children,
  isLoggedIn = false,
  commissioningContextLabel = '',
  allApps,
  aiProfile,
}: {
  children: React.ReactNode
  isLoggedIn?: boolean
  commissioningContextLabel?: string
  allApps: App[]
  aiProfile?: AiAdvisorClientProfile | null
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/select-entity'

  const [showClearData, setShowClearData] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <a href="#main-content" className="nhsuk-skip-link">Skip to main content</a>
      <PrototypeBanner />
      <ToastProvider>
        <CompareBasketProvider allApps={allApps}>
          <BookmarkProvider enabled={isLoggedIn}>
            <EoiProvider enabled={isLoggedIn}>
              <NhsHeader isLoggedIn={isLoggedIn} contextLabel={commissioningContextLabel || undefined} />
              {isLoggedIn && aiProfile ? (
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 24px' }}>
                  <button type="button" className="hs-btn hs-btn-secondary" style={{ fontSize: 14, padding: '8px 16px' }} onClick={() => setAiPanelOpen(true)}>
                    Open AI Advisor
                  </button>
                </div>
              ) : null}
              <main id="main-content" role="main" style={{ minHeight: 'calc(100vh - 200px)' }}>
                <div className="hs-main-content">
                  {children}
                </div>
              </main>
              {isLoggedIn && aiProfile && (
                <AiAdvisorPanel open={aiPanelOpen} onClose={() => setAiPanelOpen(false)} profile={aiProfile} />
              )}
              {isLoggedIn && <ClearDataModal open={showClearData} onClose={() => setShowClearData(false)} />}
            </EoiProvider>
          </BookmarkProvider>
        </CompareBasketProvider>
      </ToastProvider>
      <NhsFooter isLoggedIn={isLoggedIn} />
      <BackToTop />
    </>
  )
}
