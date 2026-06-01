'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, PanelRightOpen } from 'lucide-react'
import { useCompareBasket } from '@/components/CompareBasketProvider'
import {
  aiAdvisorBlueStripStyle,
  aiAdvisorNavBarClass,
  aiAdvisorStripButtonClass,
} from '@/components/ai/aiAdvisorChrome'


function CompareNavLink({
  path,
  onNavigate,
  className,
}: {
  path: string
  onNavigate?: () => void
  className: string
}) {
  const { ids, count } = useCompareBasket()
  const href =
    ids.length > 0 ? `/compare?ids=${ids.map(id => encodeURIComponent(id)).join(',')}` : '/compare'
  const active = path === '/compare'
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={count > 0 ? `Comparison tool, ${count} selected` : 'Comparison tool'}
      style={{
        color: active ? 'var(--nhs-blue)' : 'var(--text-secondary)',
        background: active ? '#E6F0FB' : 'transparent',
      }}
    >
      Comparison tool
      {count > 0 ? (
        <span
          className="min-w-[1.25rem] h-5 px-1 rounded-md text-[11px] font-bold leading-none inline-flex items-center justify-center"
          style={{ background: 'var(--nhs-blue)', color: '#fff' }}
          aria-hidden
        >
          {count}
        </span>
      ) : null}
    </Link>
  )
}

export default function Nav({
  commissioningContextLabel,
  isLoggedIn,
  onOpenAiPanel,
}: {
  commissioningContextLabel: string
  isLoggedIn: boolean
  onOpenAiPanel?: () => void
}) {
  const path = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const browseAppsActive = path === '/apps' || path === '/apps/condition-catalogue' || path === '/apps/browse'

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border)', background: 'transparent' }}>
      <div className="bg-white">
        <div style={aiAdvisorBlueStripStyle} />
        <nav className={aiAdvisorNavBarClass}>
          <div className="mx-auto flex min-w-0 flex-1 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-base" style={{ color: 'var(--nhs-dark)', fontFamily: 'Frutiger, Arial, sans-serif' }}>
              <Image src="/logos/nhs-blue-alt.svg" alt="" width={56} height={22} className="flex-shrink-0" />
              <span>HealthStore</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/"
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{ color: path === '/' ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === '/' ? '#E6F0FB' : 'transparent' }}>
                Home
              </Link>
              {isLoggedIn && (
                <>
                  <Link href="/apps"
                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    style={{ color: browseAppsActive ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: browseAppsActive ? '#E6F0FB' : 'transparent' }}>
                    Find apps
                  </Link>
                  <CompareNavLink path={path} className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" />
                  <Link href="/funding"
                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    style={{ color: path === '/funding' ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === '/funding' ? '#E6F0FB' : 'transparent' }}>
                    Funding directory
                  </Link>
                </>
              )}
              {isLoggedIn ? (
                <button onClick={handleLogout}
                  className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
                  style={{ color: 'var(--text-muted)' }}>
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{ color: 'var(--nhs-blue)', background: path === '/login' ? '#E6F0FB' : 'transparent' }}
                >
                  Sign in
                </Link>
              )}
              <span className="ml-2 badge badge-prototype">Prototype</span>
            </div>
            <button className="md:hidden p-2 rounded transition-colors hover:bg-gray-100" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {mobileOpen
                  ? <><path d="M4 4l12 12M16 4L4 16" stroke="#1A2332" strokeWidth="1.5" strokeLinecap="round"/></>
                  : <><rect x="2" y="5" width="16" height="1.5" rx="0.75" fill="#1A2332"/><rect x="2" y="9.25" width="16" height="1.5" rx="0.75" fill="#1A2332"/><rect x="2" y="13.5" width="16" height="1.5" rx="0.75" fill="#1A2332"/></>
                }
              </svg>
            </button>
          </div>
          {isLoggedIn && onOpenAiPanel && (
            <button
              type="button"
              onClick={onOpenAiPanel}
              className={`hidden md:flex ${aiAdvisorStripButtonClass} border-l`}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              aria-label="Open AI Advisor panel"
            >
              <PanelRightOpen className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--nhs-blue)' }} />
              AI Advisor
            </button>
          )}
        </nav>
      </div>
      {commissioningContextLabel ? (
        <div
          className="border-t px-4 sm:px-6 py-2"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(240, 244, 245, 0.9)',
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4 justify-between">
            <p
              className="min-w-0 flex-1 text-sm leading-snug"
              style={{ color: '#425563', fontFamily: 'Frutiger, Arial, sans-serif' }}
            >
              {commissioningContextLabel}
            </p>
          </div>
        </div>
      ) : null}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <Link href="/" onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={{ color: path === '/' ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === '/' ? '#E6F0FB' : 'transparent' }}>
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/apps" onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={{ color: browseAppsActive ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: browseAppsActive ? '#E6F0FB' : 'transparent' }}>
                Find apps
              </Link>
              <CompareNavLink
                path={path}
                onNavigate={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
              />
              <Link href="/funding" onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={{ color: path === '/funding' ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === '/funding' ? '#E6F0FB' : 'transparent' }}>
                Funding directory
              </Link>
              {onOpenAiPanel && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    onOpenAiPanel()
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-left"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <PanelRightOpen className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--nhs-blue)' }} />
                  AI Advisor
                </button>
              )}
            </>
          )}
          {isLoggedIn ? (
            <button onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-left flex items-center gap-1.5 transition-colors hover:bg-gray-100"
              style={{ color: 'var(--text-muted)' }}>
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ color: 'var(--nhs-blue)', background: path === '/login' ? '#E6F0FB' : 'transparent' }}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
