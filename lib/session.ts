import { getIronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { AUTH_DISABLED } from '@/lib/authMode'

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

export { AUTH_DISABLED }

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  // Open-access mode: present a signed-in guest so all `isLoggedIn` guards pass.
  // Mutated in memory only (never saved). No real user/org binding — bookmarks/EOI
  // resolve to a shared "Open access" org via resolveOrganizationId.
  if (AUTH_DISABLED) {
    session.isLoggedIn = true
    session.requiresCommissioningEntitySelection = false
    session.accountKey = session.accountKey ?? 'guest'
    session.commissioningEntityId = undefined
    session.organizationId = undefined
    session.userId = undefined
    session.profileDisplayName = undefined
    session.profileRole = undefined
    session.profileOrganisationName = 'Open access'
    session.profileEmail = undefined
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
