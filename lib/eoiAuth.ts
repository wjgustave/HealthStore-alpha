import { NextResponse } from 'next/server'
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
