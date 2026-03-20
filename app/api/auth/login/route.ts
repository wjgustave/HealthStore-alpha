import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const validUsername = process.env.AUTH_USERNAME
    const passwordHash = process.env.AUTH_PASSWORD_HASH
    const multiUsername = process.env.AUTH_MULTI_USERNAME
    const multiPasswordHash = process.env.AUTH_MULTI_PASSWORD_HASH

    if (!validUsername || !passwordHash) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const session = await getSession()

    if (username === validUsername) {
      const passwordMatch = await bcrypt.compare(password, passwordHash)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
      }
      session.isLoggedIn = true
      session.requiresCommissioningEntitySelection = false
      session.commissioningEntityId = undefined
      await session.save()
      return NextResponse.json({ ok: true, redirect: '/' })
    }

    if (multiUsername && multiPasswordHash && username === multiUsername) {
      const passwordMatch = await bcrypt.compare(password, multiPasswordHash)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
      }
      session.isLoggedIn = true
      session.requiresCommissioningEntitySelection = true
      session.commissioningEntityId = undefined
      await session.save()
      return NextResponse.json({ ok: true, redirect: '/select-entity' })
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
