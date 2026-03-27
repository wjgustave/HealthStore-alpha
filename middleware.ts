import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/lib/session'

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
      return NextResponse.redirect(new URL('/', req.url))
    }
    return res
  }

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname === '/select-entity' && !session.requiresCommissioningEntitySelection) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (session.requiresCommissioningEntitySelection && pathname !== '/select-entity') {
    return NextResponse.redirect(new URL('/select-entity', req.url))
  }

  return res
}

export const config = {
  matcher: [
    // Exclude api/apps so create-share returns JSON (401/403) instead of redirecting to /login for fetch clients.
    '/((?!api/auth|api/apps|_next/static|_next/image|logos|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}
