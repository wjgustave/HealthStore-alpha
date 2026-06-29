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
import { ToastProvider } from './ui/Toast'
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
        <a href="#main-content" className="nhsuk-skip-link">
          Skip to main content
        </a>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </>
    )
  }

  return (
    <>
      <a href="#main-content" className="nhsuk-skip-link">Skip to main content</a>
      <ToastProvider>
        <CompareBasketProvider allApps={allApps}>
          <BookmarkProvider>
            <EoiProvider>
              <Nav
                commissioningContextLabel={icbSubheaderLabel}
                isLoggedIn={isLoggedIn}
                onOpenAiPanel={isLoggedIn && aiProfile ? () => setAiPanelOpen(true) : undefined}
              />
              <main id="main-content" tabIndex={-1}>{children}</main>
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
      </ToastProvider>
      <BackToTop />
      {/* [Provenance: NHS] Official NHS Footer markup. */}
      <footer role="contentinfo" className="mt-16">
        <div className="nhsuk-footer-container">
          <div className="nhsuk-width-container">
            <h2 className="nhsuk-u-visually-hidden">Support links</h2>
            <div className="nhsuk-footer">
              <ul className="nhsuk-footer__list">
                {isLoggedIn && (
                  <>
                    <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                      <Link className="nhsuk-footer__list-item-link" href="/apps">Find apps</Link>
                    </li>
                    <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                      <Link className="nhsuk-footer__list-item-link" href="/funding">Funding directory</Link>
                    </li>
                  </>
                )}
                <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                  <Link className="nhsuk-footer__list-item-link" href="/cookies">Cookies</Link>
                </li>
                {isLoggedIn && (
                  <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                    <button
                      type="button"
                      onClick={() => setShowClearData(true)}
                      className="nhsuk-footer__list-item-link nhsuk-u-padding-0"
                      style={{ background: 'none', border: 0, cursor: 'pointer' }}
                    >
                      Manage data
                    </button>
                  </li>
                )}
              </ul>
              <div>
                <p className="nhsuk-footer__copyright">
                  HealthStore — prototype based on publicly available information as of March 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
