import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { isCommissioningEntityId } from '@/lib/commissioningEntities'

export async function POST(req: NextRequest) {
  const res = new NextResponse()

  try {
    const { entityId } = await req.json()

    if (typeof entityId !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.requiresCommissioningEntitySelection) {
      return NextResponse.json(
        { error: 'Entity already selected' },
        { status: 400 }
      )
    }

    if (!isCommissioningEntityId(entityId)) {
      return NextResponse.json(
        { error: 'Invalid commissioning entity' },
        { status: 400 }
      )
    }

    session.commissioningEntityId = entityId
    session.requiresCommissioningEntitySelection = false
    await session.save()

    return NextResponse.json({ ok: true }, { headers: res.headers })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
