'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCompareBasket } from '@/components/CompareBasketProvider'

const NAV_ITEMS = [
  { href: '/opportunities', label: 'Explore local need', match: (p: string) => p.startsWith('/opportunities') || p.startsWith('/start') },
  { href: '/product-catalogue', label: 'Products', match: (p: string) => p.startsWith('/product-catalogue') || p.startsWith('/products') || p.startsWith('/apps') },
  { href: '/compare', label: 'Compare', match: (p: string) => p.startsWith('/compare') },
  { href: '/how-it-helps', label: 'How it works', match: (p: string) => p.startsWith('/how-it-helps') },
  { href: '/resources/guidance', label: 'Guidance', match: (p: string) => p.startsWith('/resources/guidance') || p === '/resources/case-studies' || p === '/resources/news' },
]

export default function NhsHeader({
  isLoggedIn,
  contextLabel,
}: {
  isLoggedIn: boolean
  contextLabel?: string
}) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { ids: compareIds } = useCompareBasket()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* ─── White NHS service header ─── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #d8dde0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 16" width={80} height={32} role="img" aria-label="NHS">
              <path fill="#005eb8" d="M0 0h40v16H0z" />
              <path fill="#fff" d="M3.9 1.5h4.4l2.6 9h.1l1.8-9h3.3l-2.7 13H9l-2.7-9h-.1l-1.8 9H1.1M17.3 1.5h3.6l-1 4.9h4L25 1.5h3.5l-2.7 13h-3.5l1.1-5.6h-4.1l-1.2 5.6h-3.5M37.7 4.4c-.7-.3-1.6-.6-2.9-.6-1.4 0-2.5.2-2.5 1.3 0 1.8 5.1 1.2 5.1 5.1 0 3.6-3.3 4.5-6.4 4.5-1.3 0-2.9-.3-4-.7l.8-2.7c.7.4 2 .7 3.1.7s2.8-.2 2.8-1.5c0-2.1-5.1-1.3-5.1-5 0-3.4 3-4.4 5.9-4.4 1.6 0 3.1.2 4 .6" />
            </svg>
            <div style={{ borderLeft: '1px solid #d8dde0', paddingLeft: 16 }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: '#212b32', display: 'block' }}>NHS HealthStore</span>
              <span style={{ fontSize: 14, color: '#4c6272' }}>Digital therapeutics decision support</span>
            </div>
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {isLoggedIn ? (
              <>
                <Link href="/workspace" style={{ fontSize: 14, color: '#005eb8', textDecoration: 'underline' }}>Workspace</Link>
                <button onClick={handleLogout} type="button" style={{ fontSize: 14, color: '#4c6272', background: 'none', border: 0, cursor: 'pointer', textDecoration: 'underline' }}>Sign out</button>
              </>
            ) : (
              <Link href="/login" style={{ fontSize: 14, color: '#005eb8', textDecoration: 'underline' }}>Sign in</Link>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hs-menu-toggle"
              aria-label="Show or hide menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Primary nav bar ─── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #d8dde0' }} aria-label="Primary navigation">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', padding: '0 12px' }} className={`hs-nav-inner ${mobileOpen ? 'hs-nav-open' : ''}`}>
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname)
            const isCompare = item.href === '/compare'
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '14px 16px',
                  fontSize: 16,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#005eb8' : '#212b32',
                  textDecoration: 'none',
                  borderBottom: active ? '4px solid #005eb8' : '4px solid transparent',
                  marginBottom: -1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
                {isCompare && compareIds.length > 0 && (
                  <span style={{ background: '#005eb8', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {compareIds.length}
                  </span>
                )}
              </Link>
            )
          })}
          {isLoggedIn ? (
            <Link
              href="/workspace"
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '14px 16px',
                fontSize: 16,
                fontWeight: pathname.startsWith('/workspace') ? 600 : 400,
                color: pathname.startsWith('/workspace') ? '#005eb8' : '#212b32',
                textDecoration: 'none',
                borderBottom: pathname.startsWith('/workspace') ? '4px solid #005eb8' : '4px solid transparent',
                marginBottom: -1,
              }}
            >
              Workspace
            </Link>
          ) : null}
        </div>
      </nav>

      {contextLabel ? (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8px 24px', fontSize: 14, color: '#4c6272' }}>
          <strong>Context:</strong> {contextLabel}
        </div>
      ) : null}
    </>
  )
}
