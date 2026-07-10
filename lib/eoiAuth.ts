import { NextResponse } from 'next/server'
import { AUTH_DISABLED } from '@/lib/authMode'
import { resolveOrganizationId } from '@/lib/orgIdentity'
import { getSession } from '@/lib/session'

type EoiSessionOk = {
  organizationId: string
  userId?: string
}

type EoiSessionErr = {
  error: NextResponse
}

export async function requireEoiSession(): Promise<EoiSessionOk | EoiSessionErr> {
  const session = await getSession()

  if (AUTH_DISABLED) {
    try {
      const organizationId = await resolveOrganizationId(session)
      return { organizationId, userId: undefined }
    } catch (err) {
      console.error('[EOI] Failed to resolve open-access organisation id:', err)
      return {
        error: NextResponse.json(
          { error: 'Express interest is temporarily unavailable. Please try again later.' },
          { status: 503 },
        ),
      }
    }
  }

  if (!session.isLoggedIn) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (session.requiresCommissioningEntitySelection) {
    return {
      error: NextResponse.json(
        { error: 'Choose a commissioning organisation before expressing interest.' },
        { status: 403 },
      ),
    }
  }

  if (!session.organizationId) {
    return {
      error: NextResponse.json(
        { error: 'No organisation linked to this account. Please sign in again.' },
        { status: 403 },
      ),
    }
  }

  return { organizationId: session.organizationId, userId: session.userId }
}
