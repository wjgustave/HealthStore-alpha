'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import BackToTop from './BackToTop'

export default function AppShell({
  children,
  commissioningContextLabel = '',
}: {
  children: React.ReactNode
  commissioningContextLabel?: string
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav commissioningContextLabel={commissioningContextLabel} />
      <main id="main-content">{children}</main>
      <BackToTop />
      <footer className="mt-20 border-t py-10 px-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm" style={{ color: 'var(--nhs-blue)' }}>HealthStore</span>
              <span className="badge badge-blue">Prototype</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Based on publicly available information as of March 2026.
            </p>
          </div>
          <div className="flex gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            <a href="/apps" className="hover:underline">Browse apps</a>
            <a href="/funding" className="hover:underline">Funding</a>
          </div>
        </div>
      </footer>
    </>
  )
}
