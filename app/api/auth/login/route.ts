import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getIronSession } from 'iron-session'
import { resolveBcryptHashFromEnv } from '@/lib/authEnv'
import { sessionOptions, type SessionData } from '@/lib/session'

function jsonWithSession(body: object, res: NextResponse, status = 200) {
  return NextResponse.json(body, { status, headers: res.headers })
}

export async function POST(req: NextRequest) {
  const res = new NextResponse()

  try {
    const raw = await req.json()
    const username =
      typeof raw.username === 'string' ? raw.username.trim() : ''
    const password =
      typeof raw.password === 'string' ? raw.password : ''

    const validUsername = process.env.AUTH_USERNAME?.trim()
    const passwordHash = resolveBcryptHashFromEnv(process.env.AUTH_PASSWORD_HASH)
    const multiUsername = process.env.AUTH_MULTI_USERNAME?.trim()
    const multiPasswordHash = resolveBcryptHashFromEnv(
      process.env.AUTH_MULTI_PASSWORD_HASH
    )

    if (!validUsername || !passwordHash) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    if (username === validUsername) {
      const passwordMatch = await bcrypt.compare(password, passwordHash)
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }
      session.isLoggedIn = true
      session.requiresCommissioningEntitySelection = false
      session.commissioningEntityId = undefined
      await session.save()
      return jsonWithSession({ ok: true, redirect: '/' }, res)
    }

    if (multiUsername && multiPasswordHash && username === multiUsername) {
      const passwordMatch = await bcrypt.compare(password, multiPasswordHash)
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }
      session.isLoggedIn = true
      session.requiresCommissioningEntitySelection = true
      session.commissioningEntityId = undefined
      await session.save()
      return jsonWithSession({ ok: true, redirect: '/select-entity' }, res)
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
