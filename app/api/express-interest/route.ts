import { NextResponse } from 'next/server'
import { getAllAppsUnfiltered } from '@/lib/data'
import { getSession } from '@/lib/session'
import { requireEoiSession } from '@/lib/eoiAuth'
import { addExpressionOfInterest, clearAllExpressionsOfInterest, getExpressionsOfInterest } from '@/lib/eoiStore'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'
import { getExpressionOfInterestPrefill } from '@/lib/expressionOfInterestPrefill'

const TIMELINE_VALUES = new Set(['', 'immediate', 'medium', 'planning', 'exploratory'])

export async function GET() {
  const auth = await requireEoiSession()
  if ('error' in auth) return auth.error

  const expressionsOfInterest = await getExpressionsOfInterest(auth.organizationId)
  return NextResponse.json({ expressionsOfInterest })
}

export async function POST(req: Request) {
  const auth = await requireEoiSession()
  if ('error' in auth) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const record = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>

  const appId = typeof record.appId === 'string' ? record.appId.trim() : ''
  if (!appId) {
    return NextResponse.json({ error: 'Provide a non-empty appId.' }, { status: 400 })
  }

  const validApp = getAllAppsUnfiltered().find(a => a.id === appId)
  if (!validApp) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const optionalString = (v: unknown): string | undefined => {
    if (typeof v !== 'string') return undefined
    const trimmed = v.trim()
    return trimmed ? trimmed : undefined
  }

  const timelineRaw = typeof record.timeline === 'string' ? record.timeline.trim() : ''
  const timeline = TIMELINE_VALUES.has(timelineRaw) && timelineRaw ? timelineRaw : undefined

  // Authoritative "who/where" resolved server-side from the session, not the client.
  const session = await getSession()
  const organisationLabel = getCommissioningContextLabel(session)
  const prefill = getExpressionOfInterestPrefill(session, organisationLabel)

  const expressionsOfInterest = await addExpressionOfInterest({
    organizationId: auth.organizationId,
    appId: validApp.id,
    appName: validApp.app_name,
    submittedByUserId: auth.userId,
    submittedByName: prefill.name,
    submittedByEmail: prefill.email,
    organisationName: prefill.organisation,
    role: prefill.role,
    phone: optionalString(record.phone),
    populationEstimate: optionalString(record.population_estimate),
    timeline,
    notes: optionalString(record.notes),
  })

  return NextResponse.json({ ok: true, expressionsOfInterest })
}

export async function DELETE() {
  const auth = await requireEoiSession()
  if ('error' in auth) return auth.error
  await clearAllExpressionsOfInterest(auth.organizationId)
  return NextResponse.json({ ok: true, expressionsOfInterest: [] })
}
