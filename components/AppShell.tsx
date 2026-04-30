'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { App } from '@/lib/data'
import Nav from './Nav'
import BackToTop from './BackToTop'
import { CompareBasketProvider } from './CompareBasketProvider'

export default function AppShell({
  children,
  isLoggedIn = false,
  commissioningContextLabel = '',
  allApps,
}: {
  children: React.ReactNode
  isLoggedIn?: boolean
  commissioningContextLabel?: string
  allApps: App[]
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
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
        <Nav commissioningContextLabel={icbSubheaderLabel} />
        <main id="main-content">{children}</main>
      </CompareBasketProvider>
      <BackToTop />
      <footer className="mt-20 border-t py-10 px-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
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
          <div className="flex gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Link href="/apps" className="hover:underline">Find apps</Link>
            <Link href="/funding" className="hover:underline">Funding directory</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
