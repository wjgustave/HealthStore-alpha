import { NextResponse } from 'next/server'
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
