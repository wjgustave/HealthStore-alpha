import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/lib/session'

const PUBLIC_PREFIXES = [
  '/',
  '/cookies',
  '/news',
  '/campaigns',
  '/case-studies',
  '/start',
  '/opportunities',
  '/products',
  '/apps',
  '/compare',
  '/how-it-helps',
  '/guidance',
  '/login',
  '/account/verify',
]

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PREFIXES.includes(pathname)) return true
  return PUBLIC_PREFIXES.some((p) => p !== '/' && pathname.startsWith(`${p}/`))
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, {
    password: process.env.SESSION_SECRET!,
    cookieName: 'dtx-store-session',
  })

  const { pathname } = req.nextUrl

  if (pathname === '/login') {
    if (session.isLoggedIn) {
      if (session.requiresCommissioningEntitySelection) {
        return NextResponse.redirect(new URL('/select-entity', req.url))
      }
      return NextResponse.redirect(new URL('/workspace', req.url))
    }
    return res
  }

  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/workspace', req.url))
  }

  if (isPublicPath(pathname)) {
    return res
  }

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname === '/select-entity' && !session.requiresCommissioningEntitySelection) {
    return NextResponse.redirect(new URL('/workspace', req.url))
  }

  if (session.requiresCommissioningEntitySelection && pathname !== '/select-entity') {
    return NextResponse.redirect(new URL('/select-entity', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api/auth|api/apps|api/ai|api/ai-advisor|api/bookmarks|api/org-profile|api/express-interest|api/cases|DS|_next/static|_next/image|logos|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}
