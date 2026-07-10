'use client'

/**
 * Global header — NHS.UK frontend Header styling + React-safe “More” overflow menu.
 * Official header.js moves DOM nodes (incompatible with React reconciliation); this
 * mirrors the same visual/interaction pattern with ResizeObserver instead.
 * [Provenance: NHS] service-manual.nhs.uk/design-system/components/header
 */

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCompareBasket } from '@/components/CompareBasketProvider'
import { AUTH_DISABLED } from '@/lib/authMode'
import PhaseBanner from '@/components/PhaseBanner'

const NHS_LOGO = (
  <svg
    className="nhsuk-logo"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 16"
    height={40}
    width={100}
    focusable="false"
    aria-hidden="true"
  >
    <path className="nhsuk-logo__background" fill="#005eb8" d="M0 0h40v16H0z" />
    <path
      className="nhsuk-logo__text"
      fill="#fff"
      d="M3.9 1.5h4.4l2.6 9h.1l1.8-9h3.3l-2.8 13H9l-2.7-9h-.1l-1.8 9H1.1M17.3 1.5h3.6l-1 4.9h4L25 1.5h3.5l-2.7 13h-3.5l1.1-5.6h-4.1l-1.2 5.6h-3.4M37.7 4.4c-.7-.3-1.6-.6-2.9-.6-1.4 0-2.5.2-2.5 1.3 0 1.8 5.1 1.2 5.1 5.1 0 3.6-3.3 4.5-6.4 4.5-1.3 0-2.9-.3-4-.7l.8-2.7c.7.4 2.1.7 3.2.7s2.8-.2 2.8-1.5c0-2.1-5.1-1.3-5.1-5 0-3.4 2.9-4.4 5.8-4.4 1.6 0 3.1.2 4 .6"
    />
  </svg>
)

const CHEVRON_DOWN = (
  <svg
    className="nhsuk-icon nhsuk-icon__chevron-down"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={16}
    height={16}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z" />
  </svg>
)

type NavEntry = {
  id: string
  href?: string
  label: ReactNode
  ariaLabel?: string
  active?: boolean
  onClick?: () => void
}

function flashFocusThenBlur(el: HTMLElement, fromKeyboard: boolean) {
  // Keep keyboard focus for a11y; pointer clicks get a brief yellow flash then clear.
  if (fromKeyboard) return
  window.setTimeout(() => {
    if (document.activeElement === el) el.blur()
  }, 180)
}

function NavLinkContent({
  entry,
  onNavigate,
}: {
  entry: NavEntry
  onNavigate?: () => void
}) {
  if (entry.onClick) {
    return (
      <button
        type="button"
        className="nhsuk-header__navigation-link"
        onClick={e => {
          entry.onClick?.()
          onNavigate?.()
          flashFocusThenBlur(e.currentTarget, e.detail === 0)
        }}
      >
        {entry.label}
      </button>
    )
  }
  return (
    <Link
      className="nhsuk-header__navigation-link"
      href={entry.href ?? '/'}
      aria-current={entry.active ? 'page' : undefined}
      aria-label={entry.ariaLabel}
      onClick={e => {
        onNavigate?.()
        flashFocusThenBlur(e.currentTarget, e.detail === 0)
      }}
    >
      {entry.label}
    </Link>
  )
}

export default function Nav({
  commissioningContextLabel: _commissioningContextLabel,
  isLoggedIn,
  onOpenAiPanel,
}: {
  commissioningContextLabel: string
  isLoggedIn: boolean
  onOpenAiPanel?: () => void
}) {
  const path = usePathname() ?? ''
  const router = useRouter()
  const { ids, count } = useCompareBasket()
  const menuId = useId()

  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  const moreRef = useRef<HTMLLIElement>(null)

  const [overflowIds, setOverflowIds] = useState<string[]>([])
  const [moreOpen, setMoreOpen] = useState(false)

  const compareHref =
    ids.length > 0 ? `/compare?ids=${ids.map(id => encodeURIComponent(id)).join(',')}` : '/compare'

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const primaryEntries: NavEntry[] = [
    {
      id: 'about',
      href: '/about',
      label: 'About',
      active: path === '/about' || path.startsWith('/how-it-helps'),
    },
    {
      id: 'catalogue',
      href: '/product-catalogue',
      label: 'Product catalogue',
      active: path === '/product-catalogue' || path.startsWith('/product-catalogue/') || path === '/apps' || path.startsWith('/apps/'),
    },
    {
      id: 'compare',
      href: compareHref,
      label: (
        <>
          <span className="hs-nav-link-label">Comparison tool</span>
          {count > 0 ? (
            <span className="hs-nav-count" aria-hidden>
              {count}
            </span>
          ) : null}
        </>
      ),
      ariaLabel: count > 0 ? `Comparison tool, ${count} selected` : 'Comparison tool',
      active: path === '/compare',
    },
    {
      id: 'funding',
      href: '/funding-index',
      label: 'Funding index',
      active: path === '/funding-index' || path === '/funding',
    },
    {
      id: 'resources',
      href: '/resources',
      label: 'Resource library',
      active: path === '/resources' || path.startsWith('/resources/'),
    },
  ]

  if (isLoggedIn && onOpenAiPanel) {
    primaryEntries.push({
      id: 'ai',
      label: 'AI Advisor',
      onClick: onOpenAiPanel,
    })
  }

  if (!AUTH_DISABLED) {
    if (isLoggedIn) {
      primaryEntries.push({
        id: 'signout',
        label: 'Sign out',
        onClick: () => {
          void handleLogout()
        },
      })
    } else {
      primaryEntries.push({
        id: 'signin',
        href: '/login',
        label: 'Sign in',
        active: path === '/login',
      })
    }
  }

  const primaryIds = primaryEntries.map(e => e.id).join('|')

  const measure = useCallback(() => {
    const list = listRef.current
    if (!list) return

    // Reveal all primary items so widths are measurable (hidden → offsetWidth 0).
    for (const id of primaryIds.split('|')) {
      const el = itemRefs.current.get(id)
      if (el) {
        el.hidden = false
        el.style.display = ''
      }
    }
    if (moreRef.current) {
      moreRef.current.hidden = false
      moreRef.current.style.display = ''
      moreRef.current.classList.add('nhsuk-mobile-menu-container--visible')
    }

    const available = list.clientWidth
    const moreWidth = moreRef.current?.offsetWidth ?? 72
    const widths: { id: string; width: number }[] = []
    for (const id of primaryIds.split('|')) {
      const el = itemRefs.current.get(id)
      if (el) widths.push({ id, width: el.offsetWidth })
    }

    let used = 0
    const overflow: string[] = []
    for (const item of widths) {
      if (used + item.width > available - moreWidth) overflow.push(item.id)
      else used += item.width
    }

    if (overflow.length === 0) {
      // Fits without More — confirm without reserving More width.
      used = widths.reduce((s, w) => s + w.width, 0)
      if (used <= available) {
        setOverflowIds(prev => (prev.length === 0 ? prev : []))
        setMoreOpen(false)
        return
      }
    }

    setOverflowIds(prev => {
      if (prev.length === overflow.length && prev.every((id, i) => id === overflow[i])) return prev
      return overflow
    })
  }, [primaryIds])

  useLayoutEffect(() => {
    measure()
  }, [measure, path, count, isLoggedIn])

  useEffect(() => {
    document.body.classList.add('js-enabled')
    const onResize = () => {
      window.requestAnimationFrame(measure)
    }
    window.addEventListener('resize', onResize)
    const ro = listRef.current ? new ResizeObserver(onResize) : null
    if (listRef.current && ro) ro.observe(listRef.current)
    return () => {
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [measure])

  useEffect(() => {
    if (!moreOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [moreOpen])

  // Push page content down while More is open (NHS WCAG: do not cover content).
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    if (moreOpen) {
      const dropdown = nav.querySelector('.nhsuk-header__drop-down:not(.nhsuk-header__drop-down--hidden)') as HTMLElement | null
      nav.style.marginBottom = dropdown ? `${dropdown.offsetHeight}px` : '0'
    } else {
      nav.style.marginBottom = '0'
    }
  }, [moreOpen, overflowIds])

  const overflowSet = new Set(overflowIds)
  const moreVisible = overflowIds.length > 0
  const overflowEntries = primaryEntries.filter(e => overflowSet.has(e.id))

  return (
    <header className="nhsuk-header" role="banner">
      <div className="nhsuk-header__container">
        <div className="nhsuk-header__logo">
          <Link
            className="nhsuk-header__link nhsuk-header__link--service"
            href="/"
            aria-label="HealthStore homepage"
            onClick={e => flashFocusThenBlur(e.currentTarget, e.detail === 0)}
          >
            {NHS_LOGO}
            <span className="nhsuk-header__service-name">HealthStore</span>
          </Link>
        </div>
      </div>

      <div className="nhsuk-navigation-container">
        <nav
          ref={navRef}
          className="nhsuk-navigation"
          id="header-navigation"
          role="navigation"
          aria-label="Menu"
        >
          <ul
            ref={listRef}
            className="nhsuk-header__navigation-list nhsuk-header__navigation-list--left-aligned"
          >
            {primaryEntries.map(entry => (
              <li
                key={entry.id}
                ref={el => {
                  if (el) itemRefs.current.set(entry.id, el)
                  else itemRefs.current.delete(entry.id)
                }}
                className={`nhsuk-header__navigation-item${entry.active ? ' nhsuk-header__navigation-item--current' : ''}`}
                hidden={overflowSet.has(entry.id)}
              >
                <NavLinkContent entry={entry} onNavigate={() => setMoreOpen(false)} />
              </li>
            ))}

            <li
              ref={moreRef}
              className={`nhsuk-mobile-menu-container${moreVisible ? ' nhsuk-mobile-menu-container--visible' : ''}`}
              hidden={!moreVisible}
            >
              <button
                type="button"
                className={`nhsuk-header__menu-toggle nhsuk-header__navigation-link${moreVisible ? ' nhsuk-header__menu-toggle--visible' : ''}`}
                id="toggle-menu"
                aria-expanded={moreOpen}
                aria-controls={menuId}
                onClick={() => setMoreOpen(o => !o)}
              >
                <span className="nhsuk-u-visually-hidden">Browse </span>
                More
                {CHEVRON_DOWN}
              </button>
            </li>
          </ul>

          <ul
            id={menuId}
            className={`nhsuk-header__drop-down${moreOpen && moreVisible ? '' : ' nhsuk-header__drop-down--hidden'}`}
          >
            {overflowEntries.map(entry => (
              <li
                key={entry.id}
                className={`nhsuk-header__navigation-item${entry.active ? ' nhsuk-header__navigation-item--current' : ''}`}
              >
                <NavLinkContent entry={entry} onNavigate={() => setMoreOpen(false)} />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* GOV.UK: phase banner sits inside <header>, after service navigation. */}
      <PhaseBanner tag="Alpha" />
    </header>
  )
}
