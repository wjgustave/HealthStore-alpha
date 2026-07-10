import { NextResponse } from 'next/server'
import { AUTH_DISABLED } from '@/lib/authMode'
import { getSession } from '@/lib/session'
import { resolveOrganizationId } from '@/lib/orgIdentity'

type OrgProfileSessionOk = {
  organizationId: string
  userId?: string
}

type OrgProfileSessionErr = {
  error: NextResponse
}

/**
 * Auth guard for the Org Settings API. Like requireBookmarkSession, but resolves
 * the organization id from the session (creating one from the org name if needed)
 * so demo/named accounts without a seeded organizationId can still save.
 */
export async function requireOrgProfileSession(): Promise<
  OrgProfileSessionOk | OrgProfileSessionErr
> {
  const session = await getSession()

  if (AUTH_DISABLED) {
    return {
      error: NextResponse.json(
        { error: 'Organisation settings are disabled while the store is in open-access mode.' },
        { status: 403 },
      ),
    }
  }

  if (!session.isLoggedIn) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (session.requiresCommissioningEntitySelection) {
    return {
      error: NextResponse.json(
        { error: 'Choose a commissioning organisation before editing settings.' },
        { status: 403 },
      ),
    }
  }

  try {
    const organizationId = await resolveOrganizationId(session)
    return { organizationId, userId: session.userId }
  } catch (err) {
    console.error('[OrgProfile] Failed to resolve organization id:', err)
    return {
      error: NextResponse.json(
        { error: 'Organisation settings are temporarily unavailable. Please try again later.' },
        { status: 503 },
      ),
    }
  }
}
