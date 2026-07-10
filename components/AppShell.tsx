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
import NhsFrontendInit from '@/components/nhs/NhsFrontendInit'
import { AUTH_DISABLED } from '@/lib/authMode'

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
  /** Open-access treats everyone as able to use catalogue tools; hide auth/org chrome. */
  const openAccess = AUTH_DISABLED
  const showAuthChrome = !openAccess && isLoggedIn
  const icbSubheaderLabel =
    !openAccess && isLoggedIn && commissioningContextLabel ? commissioningContextLabel : ''

  /** Auth routes render without global nav/footer but still need landmarks + skip link (WCAG 2.4.1, 1.3.1). */
  if (isLoginPage && !openAccess) {
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
                isLoggedIn={showAuthChrome}
                onOpenAiPanel={showAuthChrome && aiProfile ? () => setAiPanelOpen(true) : undefined}
              />
              <main id="main-content" tabIndex={-1}>{children}</main>
              {showAuthChrome && aiProfile && (
                <AiAdvisorPanel
                  open={aiPanelOpen}
                  onClose={() => setAiPanelOpen(false)}
                  profile={aiProfile}
                />
              )}
              {showAuthChrome && (
                <ClearDataModal open={showClearData} onClose={() => setShowClearData(false)} />
              )}
            </EoiProvider>
          </BookmarkProvider>
        </CompareBasketProvider>
      </ToastProvider>
      <BackToTop />
      <NhsFrontendInit />
      {/* [Provenance: NHS] Official NHS Footer markup. */}
      <footer role="contentinfo" className="mt-16">
        <div className="nhsuk-footer-container">
          <div className="nhsuk-width-container">
            <h2 className="nhsuk-u-visually-hidden">Support links</h2>
            <div className="nhsuk-footer">
              <ul className="nhsuk-footer__list">
                <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                  <Link className="nhsuk-footer__list-item-link" href="/product-catalogue">Product catalogue</Link>
                </li>
                <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                  <Link className="nhsuk-footer__list-item-link" href="/funding-index">Funding index</Link>
                </li>
                <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                  <Link className="nhsuk-footer__list-item-link" href="/cookies">Cookies</Link>
                </li>
                {showAuthChrome && (
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
