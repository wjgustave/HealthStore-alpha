import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const validUsername = process.env.AUTH_USERNAME
    const passwordHash = process.env.AUTH_PASSWORD_HASH

    if (!validUsername || !passwordHash) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (username !== validUsername) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, passwordHash)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const session = await getSession()
    session.isLoggedIn = true
    await session.save()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
