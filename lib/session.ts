import { getIronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  isLoggedIn: boolean
  /** True after multi-user login until they choose an ICB */
  requiresCommissioningEntitySelection?: boolean
  commissioningEntityId?: string
  /** Stable key for per-account server data (e.g. saved apps). Set on login. */
  accountKey?: string
  /** UUID of the user's active organization (from DB). */
  organizationId?: string
  /** UUID of the authenticated user row (from DB). */
  userId?: string
  /** Named demo accounts from `content/auth-user-accounts.json` — nav + expression-of-interest prefill. */
  profileDisplayName?: string
  profileRole?: string
  profileOrganisationName?: string
  profileEmail?: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'dtx-store-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
}

/** When true, auth is bypassed and every visitor is treated as a signed-in guest. */
export const AUTH_DISABLED = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  // Open-access mode: present a signed-in guest so all `isLoggedIn` guards pass.
  // Mutated in memory only (never saved), so it applies to every request without a cookie.
  if (AUTH_DISABLED && !session.isLoggedIn) {
    session.isLoggedIn = true
    session.requiresCommissioningEntitySelection = false
    session.accountKey = session.accountKey ?? 'guest'
    session.profileDisplayName = session.profileDisplayName ?? 'Guest'
    session.profileOrganisationName = session.profileOrganisationName ?? 'HealthStore demo'
  }

  return session
}

/** Clear fields set by configured named accounts (`content/auth-user-accounts.json`). */
export function clearDemoUserProfile(session: SessionData) {
  session.profileDisplayName = undefined
  session.profileRole = undefined
  session.profileOrganisationName = undefined
  session.profileEmail = undefined
}
