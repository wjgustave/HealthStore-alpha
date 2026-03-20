'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

const SUBHEADER_SCROLL_THRESHOLD_PX = 300
const SCROLL_IDLE_MS = 150

export default function Nav({ commissioningContextLabel }: { commissioningContextLabel: string }) {
  const path = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
      setIsScrolling(true)
      if (scrollIdleRef.current) clearTimeout(scrollIdleRef.current)
      scrollIdleRef.current = setTimeout(() => {
        setIsScrolling(false)
        scrollIdleRef.current = null
      }, SCROLL_IDLE_MS)
    }
    setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollIdleRef.current) clearTimeout(scrollIdleRef.current)
    }
  }, [])

  const subheaderHiddenWhileScrolling =
    commissioningContextLabel &&
    scrollY > SUBHEADER_SCROLL_THRESHOLD_PX &&
    isScrolling

  const links = [
    { href: '/', label: 'Home' },
    { href: '/apps', label: 'Browse apps' },
    { href: '/funding', label: 'Funding' },
  ]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: 'var(--border)' }}>
      <div style={{ background: 'var(--nhs-blue)', height: 6 }} />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-base" style={{ color: 'var(--nhs-dark)', fontFamily: 'Frutiger, Arial, sans-serif' }}>
          <Image src="/logos/nhs-blue-alt.svg" alt="" width={56} height={22} className="flex-shrink-0" />
          <span>HealthStore</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{ color: path === l.href ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === l.href ? '#E6F0FB' : 'transparent' }}>
              {l.label}
            </Link>
          ))}
          <span className="ml-2 badge badge-blue">Prototype</span>
          <button onClick={handleLogout}
            className="ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
        <button className="md:hidden p-2 rounded" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen
              ? <><path d="M4 4l12 12M16 4L4 16" stroke="#1A2332" strokeWidth="1.5" strokeLinecap="round"/></>
              : <><rect x="2" y="5" width="16" height="1.5" rx="0.75" fill="#1A2332"/><rect x="2" y="9.25" width="16" height="1.5" rx="0.75" fill="#1A2332"/><rect x="2" y="13.5" width="16" height="1.5" rx="0.75" fill="#1A2332"/></>
            }
          </svg>
        </button>
      </nav>
      {commissioningContextLabel ? (
        <div
          className="border-t px-4 sm:px-6 py-2 transition-opacity duration-200 ease-out"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(240, 244, 245, 0.95)',
            opacity: subheaderHiddenWhileScrolling ? 0 : 1,
            pointerEvents: subheaderHiddenWhileScrolling ? 'none' : 'auto',
          }}
          aria-hidden={subheaderHiddenWhileScrolling}
        >
          <p
            className="max-w-7xl mx-auto text-sm leading-snug"
            style={{ color: '#425563', fontFamily: 'Frutiger, Arial, sans-serif' }}
          >
            {commissioningContextLabel}
          </p>
        </div>
      ) : null}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ color: path === l.href ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === l.href ? '#E6F0FB' : 'transparent' }}>
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-left flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
