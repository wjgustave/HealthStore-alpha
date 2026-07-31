import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/lib/session'
import { AUTH_DISABLED } from '@/lib/authMode'
import { GATE_COOKIE, GATE_TOKEN } from '@/lib/siteGate'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Site-wide password gate — runs before everything (including open-access mode).
  const gateUnlocked = req.cookies.get(GATE_COOKIE)?.value === GATE_TOKEN
  if (pathname === '/gate' || pathname === '/api/gate') {
    if (pathname === '/gate' && gateUnlocked) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }
  if (!gateUnlocked) {
    const gateUrl = new URL('/gate', req.url)
    if (pathname !== '/') gateUrl.searchParams.set('next', pathname + req.nextUrl.search)
    return NextResponse.redirect(gateUrl)
  }

  // Open-access mode: skip auth gating; send auth/org routes back to the home page.
  if (AUTH_DISABLED) {
    if (
      pathname === '/login' ||
      pathname === '/select-entity' ||
      pathname === '/org-settings' ||
      pathname === '/account/organisation' ||
      pathname === '/dashboard'
    ) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, {
    password: process.env.SESSION_SECRET!,
    cookieName: 'dtx-store-session',
  })

  if (pathname === '/login') {
    if (session.isLoggedIn) {
      if (session.requiresCommissioningEntitySelection) {
        return NextResponse.redirect(new URL('/select-entity', req.url))
      }
      return NextResponse.redirect(new URL('/catalogue', req.url))
    }
    return res
  }

  // Legacy paths stay public so their permanent redirects into /resources/* can fire.
  const publicPaths = ['/', '/cookies', '/about', '/how-it-helps', '/resources', '/news', '/campaigns', '/case-studies', '/guidance']
  if (publicPaths.includes(pathname) || pathname.startsWith('/resources/')) {
    return res
  }

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/catalogue', req.url))
  }

  if (pathname === '/select-entity' && !session.requiresCommissioningEntitySelection) {
    return NextResponse.redirect(new URL('/catalogue', req.url))
  }

  if (session.requiresCommissioningEntitySelection && pathname !== '/select-entity') {
    return NextResponse.redirect(new URL('/select-entity', req.url))
  }

  return res
}

export const config = {
  matcher: [
    // Exclude api/apps, api/ai, api/ai-advisor, api/bookmarks, api/org-profile and api/express-interest so APIs return JSON (401/403) instead of redirecting to /login for fetch clients.
    // `DS` is the standalone, static design-system reference under public/DS — kept publicly reachable and outside auth (not linked from the product).
    '/((?!api/auth|api/apps|api/ai|api/ai-advisor|api/bookmarks|api/org-profile|api/express-interest|DS|_next/static|_next/image|logos|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}
