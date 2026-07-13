import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { commissioningCases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const PROTOTYPE_OTP = '123456'

function makeReference() {
  return `HS-${Date.now().toString(36).toUpperCase()}`
}

export async function POST(req: Request) {
  const body = await req.json()
  const {
    name,
    email,
    role,
    organisation,
    productSlug,
    productName,
    context,
    supportRequested,
    decisionWindow,
    additionalContext,
    otp,
  } = body

  if (!name || !email || !supportRequested?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (otp !== PROTOTYPE_OTP) {
    return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
  }

  const reference = makeReference()
  try {
    const database = db()
    await database.insert(commissioningCases).values({
      reference,
      submittedByEmail: email,
      submittedByName: name,
      role: role ?? null,
      organisationName: organisation ?? null,
      productSlug: productSlug ?? null,
      productName: productName ?? null,
      contextSnapshot: context,
      supportRequested,
      decisionWindow: decisionWindow ?? null,
      additionalContext: additionalContext ?? null,
      status: 'submitted',
      nextAction: 'The NHS HealthStore will confirm your request within 5 working days',
      ownerQueue: 'Commissioning support triage',
    })
  } catch {
    // Prototype continues without DB — reference still returned
  }

  return NextResponse.json({ reference, status: 'submitted' })
}

export async function GET(req: Request) {
  const ref = new URL(req.url).searchParams.get('reference')
  if (!ref) return NextResponse.json({ error: 'reference required' }, { status: 400 })

  const database = db()
  if (!database) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  const rows = await database.select().from(commissioningCases).where(eq(commissioningCases.reference, ref)).limit(1)
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(rows[0])
}
