'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { App } from '@/lib/data'
import Nav from './Nav'
import BackToTop from './BackToTop'
import { CompareBasketProvider } from './CompareBasketProvider'
import { BookmarkProvider } from './BookmarkProvider'
import { EoiProvider } from './EoiProvider'
import ClearDataModal from './ClearDataModal'
import AiAdvisorPanel, { type AiAdvisorClientProfile } from './ai/AiAdvisorPanel'

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
  const isLoginPage = pathname === '/login'
  const [showClearData, setShowClearData] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  /** Subheader only when logged in (login route renders no Nav here) */
  const icbSubheaderLabel = isLoggedIn && commissioningContextLabel ? commissioningContextLabel : ''

  /** Auth routes render without global nav/footer but still need landmarks + skip link (WCAG 2.4.1, 1.3.1). */
  if (isLoginPage) {
    return (
      <>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </>
    )
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <CompareBasketProvider allApps={allApps}>
        <BookmarkProvider>
          <EoiProvider>
            <Nav
              commissioningContextLabel={icbSubheaderLabel}
              isLoggedIn={isLoggedIn}
              onOpenAiPanel={isLoggedIn && aiProfile ? () => setAiPanelOpen(true) : undefined}
            />
            <main id="main-content">{children}</main>
            {isLoggedIn && aiProfile && (
              <AiAdvisorPanel
                open={aiPanelOpen}
                onClose={() => setAiPanelOpen(false)}
                profile={aiProfile}
              />
            )}
            {isLoggedIn && (
              <ClearDataModal open={showClearData} onClose={() => setShowClearData(false)} />
            )}
          </EoiProvider>
        </BookmarkProvider>
      </CompareBasketProvider>
      <BackToTop />
      <footer
        className="mt-20 border-t px-4 pt-10 pb-[calc(2.5rem+30px)] sm:px-6"
        style={{ borderColor: 'var(--border)', background: '#fff' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm" style={{ color: 'var(--nhs-blue)' }}>HealthStore</span>
              <span className="badge badge-prototype">Prototype</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Prototype based on publicly available information as of March 2026.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            {isLoggedIn && (
              <>
                <Link href="/apps" className="hover:underline">Find apps</Link>
                <Link href="/funding" className="hover:underline">Funding directory</Link>
              </>
            )}
            <Link href="/cookies" className="hover:underline">Cookies</Link>
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setShowClearData(true)}
                className="hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Manage data
              </button>
            )}
          </div>
        </div>
      </footer>
    </>
  )
}
