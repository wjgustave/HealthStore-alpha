'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, BotMessageSquare } from 'lucide-react'
import HomeHeroLayoutToggle from '@/components/home/HomeHeroLayoutToggle'
import { useCompareBasket } from '@/components/CompareBasketProvider'

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
      aria-label={count > 0 ? `Compare apps, ${count} selected` : 'Compare apps'}
      style={{
        color: active ? 'var(--nhs-blue)' : 'var(--text-secondary)',
        background: active ? '#E6F0FB' : 'transparent',
      }}
    >
      Compare
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

export default function Nav({ commissioningContextLabel }: { commissioningContextLabel: string }) {
  const path = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/apps', label: 'Find apps' },
    { href: '/funding', label: 'Funding' },
  ]

  const browseAppsActive = path === '/apps' || path === '/apps/browse'

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border)', background: 'transparent' }}>
      <div className="bg-white">
        <div style={{ background: 'var(--nhs-blue)', height: 6 }} />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-base" style={{ color: 'var(--nhs-dark)', fontFamily: 'Frutiger, Arial, sans-serif' }}>
            <Image src="/logos/nhs-blue-alt.svg" alt="" width={56} height={22} className="flex-shrink-0" />
            <span>HealthStore</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.slice(0, 2).map(l => {
              const active = l.href === '/apps' ? browseAppsActive : path === l.href
              return (
                <Link key={l.href} href={l.href}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{ color: active ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: active ? '#E6F0FB' : 'transparent' }}>
                  {l.label}
                </Link>
              )
            })}
            <CompareNavLink path={path} className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" />
            <Link href={links[2].href}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{ color: path === links[2].href ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === links[2].href ? '#E6F0FB' : 'transparent' }}>
              {links[2].label}
            </Link>
            <Link href="/ai"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{ color: path === '/ai' ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === '/ai' ? '#E6F0FB' : 'transparent' }}>
              <BotMessageSquare className="w-3.5 h-3.5" />
              AI Advisor
            </Link>
            <button onClick={handleLogout}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
              style={{ color: 'var(--text-muted)' }}>
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
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
        </nav>
      </div>
      {commissioningContextLabel || path === '/' ? (
        <div
          className="border-t px-4 sm:px-6 py-2"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(240, 244, 245, 0.9)',
          }}
        >
          <div
            className={`mx-auto flex max-w-7xl items-center gap-4 ${commissioningContextLabel ? 'justify-between' : 'justify-end'}`}
          >
            {commissioningContextLabel ? (
              <p
                className="min-w-0 flex-1 text-sm leading-snug"
                style={{ color: '#425563', fontFamily: 'Frutiger, Arial, sans-serif' }}
              >
                {commissioningContextLabel}
              </p>
            ) : null}
            {path === '/' ? (
              <Suspense fallback={null}>
                <HomeHeroLayoutToggle surface="header" />
              </Suspense>
            ) : null}
          </div>
        </div>
      ) : null}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          {links.slice(0, 2).map(l => {
            const active = l.href === '/apps' ? browseAppsActive : path === l.href
            return (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={{ color: active ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: active ? '#E6F0FB' : 'transparent' }}>
                {l.label}
              </Link>
            )
          })}
          <CompareNavLink
            path={path}
            onNavigate={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium"
          />
          <Link href={links[2].href} onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={{ color: path === links[2].href ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === links[2].href ? '#E6F0FB' : 'transparent' }}>
            {links[2].label}
          </Link>
          <Link href="/ai" onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium"
            style={{ color: path === '/ai' ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === '/ai' ? '#E6F0FB' : 'transparent' }}>
            <BotMessageSquare className="w-3.5 h-3.5" />
            AI Advisor
          </Link>
          <button onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-left flex items-center gap-1.5 transition-colors hover:bg-gray-100"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
