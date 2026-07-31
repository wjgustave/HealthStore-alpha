import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getIronSession } from 'iron-session'
import { eq } from 'drizzle-orm'
import { resolveBcryptHashFromEnv } from '@/lib/authEnv'
import { findAuthUserAccount, resolveAccountPasswordHash } from '@/lib/authUserAccounts'
import { sessionOptions, type SessionData, clearDemoUserProfile } from '@/lib/session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

function jsonWithSession(body: object, res: NextResponse, status = 200) {
  return NextResponse.json(body, { status, headers: res.headers })
}

async function lookupUserOrgIds(email: string): Promise<{ userId?: string; organizationId?: string }> {
  try {
    const rows = await db().select({
      id: users.id,
      organizationId: users.organizationId,
    }).from(users).where(eq(users.email, email)).limit(1)

    if (rows.length > 0) {
      return { userId: rows[0].id, organizationId: rows[0].organizationId }
    }
  } catch {
    // DB not available — graceful fallback
  }
  return {}
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
      clearDemoUserProfile(session)
      session.isLoggedIn = true
      session.requiresCommissioningEntitySelection = false
      session.commissioningEntityId = undefined
      session.accountKey = validUsername

      const dbIds = await lookupUserOrgIds(validUsername)
      session.userId = dbIds.userId
      session.organizationId = dbIds.organizationId

      await session.save()
      return jsonWithSession({ ok: true, redirect: '/catalogue' }, res)
    }

    const namedAccount = findAuthUserAccount(username)
    if (namedAccount) {
      const accountHash = resolveAccountPasswordHash(namedAccount)
      const passwordMatch = await bcrypt.compare(password, accountHash)
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }
      session.isLoggedIn = true
      session.requiresCommissioningEntitySelection = false
      session.commissioningEntityId = undefined
      session.accountKey = namedAccount.username.trim()
      session.profileDisplayName = namedAccount.displayName
      session.profileRole = namedAccount.role
      session.profileOrganisationName = namedAccount.organisationName
      session.profileEmail = namedAccount.username.trim()

      const dbIds = await lookupUserOrgIds(namedAccount.username.trim())
      session.userId = dbIds.userId
      session.organizationId = dbIds.organizationId

      await session.save()
      return jsonWithSession({ ok: true, redirect: '/catalogue' }, res)
    }

    if (multiUsername && multiPasswordHash && username === multiUsername) {
      const passwordMatch = await bcrypt.compare(password, multiPasswordHash)
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }
      clearDemoUserProfile(session)
      session.isLoggedIn = true
      session.requiresCommissioningEntitySelection = true
      session.commissioningEntityId = undefined
      session.accountKey = multiUsername

      const dbIds = await lookupUserOrgIds(multiUsername)
      session.userId = dbIds.userId
      session.organizationId = dbIds.organizationId

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
