import { NextRequest, NextResponse } from 'next/server'
import { GATE_COOKIE, GATE_TOKEN, isGatePasswordValid } from '@/lib/siteGate'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  if (!isGatePasswordValid(body?.password)) {
    return NextResponse.json({ error: 'The password is not correct' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(GATE_COOKIE, GATE_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return res
}
