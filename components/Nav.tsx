'use client'
import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Home, LogOut, Menu, PanelRightOpen, Settings, X } from 'lucide-react'
import { useCompareBasket } from '@/components/CompareBasketProvider'
import { SELECT_ICB_CONTINUE_MESSAGE } from '@/lib/commissioningContextDisplay'
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

  // R7 NAV-02: "Find apps" owns the whole /apps branch — landing, catalogue, and PDPs (/apps/[slug]) —
  // via prefix matching, so a product page no longer leaves the nav with nothing active.
  const browseAppsActive = path === '/apps' || (path?.startsWith('/apps/') ?? false)
  const dashboardActive = path === '/dashboard'
  const homePageActive = path === '/'
  const newsActive = path === '/news'
  const campaignsActive = path === '/campaigns'
  const caseStudiesActive = path === '/case-studies'
  const canOpenOrgSettings =
    isLoggedIn &&
    !!commissioningContextLabel &&
    commissioningContextLabel !== SELECT_ICB_CONTINUE_MESSAGE

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  function navItemStyle(active: boolean): CSSProperties {
    return {
      color: active ? 'var(--nhs-blue)' : 'var(--text-secondary)',
      background: active ? '#E6F0FB' : 'transparent',
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border)', background: 'transparent' }}>
      <div className="bg-white">
        <div style={aiAdvisorBlueStripStyle} />
        <nav className={`relative ${aiAdvisorNavBarClass}`}>
          <div className="absolute inset-y-0 left-0 z-10 hidden items-center px-4 sm:px-5 md:flex">
            <span className="badge badge-prototype">Prototype</span>
          </div>
          {isLoggedIn && onOpenAiPanel && (
            <button
              type="button"
              onClick={onOpenAiPanel}
              className={`absolute inset-y-0 right-0 z-10 hidden md:flex ${aiAdvisorStripButtonClass} border-l`}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              aria-label="Open AI Advisor panel"
            >
              <PanelRightOpen className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--nhs-blue)' }} />
              AI Advisor
            </button>
          )}
          <div className="w-full px-4 sm:px-6">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
              <Link
                href={isLoggedIn ? '/dashboard' : '/'}
                className="flex min-w-0 items-center gap-2 font-bold text-base"
                style={{ color: 'var(--nhs-dark)', fontFamily: 'Frutiger, Arial, sans-serif' }}
              >
                <Image src="/logos/nhs-blue-alt.svg" alt="" width={56} height={22} className="flex-shrink-0" />
                <span>HealthStore</span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link href="/"
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={navItemStyle(homePageActive)}>
                  Home
                </Link>
                <Link href="/news"
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={navItemStyle(newsActive)}>
                  News
                </Link>
                <Link href="/campaigns"
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={navItemStyle(campaignsActive)}>
                  Campaigns
                </Link>
                <Link href="/case-studies"
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={navItemStyle(caseStudiesActive)}>
                  Case studies
                </Link>
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
              </div>
              <button
                className="md:hidden p-2 rounded transition-colors hover:bg-gray-100"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen
                  ? <X className="h-5 w-5" style={{ color: '#1A2332' }} aria-hidden />
                  : <Menu className="h-5 w-5" style={{ color: '#1A2332' }} aria-hidden />
                }
              </button>
            </div>
          </div>
        </nav>
      </div>
      {isLoggedIn ? (
        <div
          className="border-t px-4 sm:px-6 py-2"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(240, 244, 245, 0.9)',
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4 justify-between">
            {canOpenOrgSettings ? (
              <Link
                href="/org-settings"
                className="group inline-flex min-w-0 items-center gap-1.5 text-sm leading-snug hover:underline"
                style={{ color: '#425563', fontFamily: 'Frutiger, Arial, sans-serif' }}
                aria-label={`Organisation settings for ${commissioningContextLabel}`}
                title="Edit organisation settings"
              >
                <span className="truncate">{commissioningContextLabel}</span>
                <Settings
                  className="h-3.5 w-3.5 flex-shrink-0 opacity-60 group-hover:opacity-100"
                  style={{ color: 'var(--nhs-blue)' }}
                />
              </Link>
            ) : commissioningContextLabel ? (
              <p
                className="min-w-0 text-sm leading-snug"
                style={{ color: '#425563', fontFamily: 'Frutiger, Arial, sans-serif' }}
              >
                {commissioningContextLabel}
              </p>
            ) : (
              <span aria-hidden />
            )}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard"
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={navItemStyle(dashboardActive)}>
                Dashboard
              </Link>
              <Link href="/apps"
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={navItemStyle(browseAppsActive)}>
                Find apps
              </Link>
              <CompareNavLink path={path} className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" />
              <Link href="/funding"
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={navItemStyle(path === '/funding')}>
                Funding directory
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <Link href="/" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium"
            style={navItemStyle(homePageActive)}>
            <Home className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--nhs-blue)' }} />
            Home
          </Link>
          <Link href="/news" onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={navItemStyle(newsActive)}>
            News
          </Link>
          <Link href="/campaigns" onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={navItemStyle(campaignsActive)}>
            Campaigns
          </Link>
          <Link href="/case-studies" onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={navItemStyle(caseStudiesActive)}>
            Case studies
          </Link>
          {isLoggedIn && (
            <>
              <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={navItemStyle(dashboardActive)}>
                Dashboard
              </Link>
              <Link href="/apps" onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={navItemStyle(browseAppsActive)}>
                Find apps
              </Link>
              <CompareNavLink
                path={path}
                onNavigate={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
              />
              <Link href="/funding" onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={navItemStyle(path === '/funding')}>
                Funding directory
              </Link>
              {canOpenOrgSettings && (
                <Link href="/org-settings" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium"
                  style={{ color: path === '/org-settings' ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === '/org-settings' ? '#E6F0FB' : 'transparent' }}>
                  <Settings className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--nhs-blue)' }} />
                  Org settings
                </Link>
              )}
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
