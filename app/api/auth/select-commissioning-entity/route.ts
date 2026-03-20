import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { isCommissioningEntityId } from '@/lib/commissioningEntities'

export async function POST(req: Request) {
  try {
    const { entityId } = await req.json()

    if (typeof entityId !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const session = await getSession()

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.requiresCommissioningEntitySelection) {
      return NextResponse.json({ error: 'Entity already selected' }, { status: 400 })
    }

    if (!isCommissioningEntityId(entityId)) {
      return NextResponse.json({ error: 'Invalid commissioning entity' }, { status: 400 })
    }

    session.commissioningEntityId = entityId
    session.requiresCommissioningEntitySelection = false
    await session.save()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
