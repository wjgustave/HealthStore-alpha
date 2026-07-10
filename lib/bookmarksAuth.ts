import { NextResponse } from 'next/server'
import { AUTH_DISABLED } from '@/lib/authMode'
import { resolveOrganizationId } from '@/lib/orgIdentity'
import { getSession } from '@/lib/session'

type BookmarkSessionOk = {
  organizationId: string
  userId?: string
}

type BookmarkSessionErr = {
  error: NextResponse
}

export async function requireBookmarkSession(): Promise<BookmarkSessionOk | BookmarkSessionErr> {
  const session = await getSession()

  if (AUTH_DISABLED) {
    try {
      const organizationId = await resolveOrganizationId(session)
      return { organizationId, userId: undefined }
    } catch (err) {
      console.error('[Bookmarks] Failed to resolve open-access organisation id:', err)
      return {
        error: NextResponse.json(
          { error: 'Saved apps are temporarily unavailable. Please try again later.' },
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
        { error: 'Choose a commissioning organisation before saving apps.' },
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
