'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const path = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/apps', label: 'Browse apps' },
    { href: '/funding', label: 'Funding' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: 'var(--border)' }}>
      <div style={{ background: 'var(--nhs-blue)', height: 6 }} />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-base" style={{ color: 'var(--nhs-dark)', fontFamily: 'DM Serif Display, serif' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="5" fill="#005EB8"/>
            <path d="M7 8h3.2l2.4 8.4L15 8h3l-4 12h-3L7 8z" fill="white"/>
            <path d="M18.5 8H22v12h-3.5V8z" fill="white"/>
          </svg>
          <span>Commissioner DTx Store</span>
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
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ color: path === l.href ? 'var(--nhs-blue)' : 'var(--text-secondary)', background: path === l.href ? '#E6F0FB' : 'transparent' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
