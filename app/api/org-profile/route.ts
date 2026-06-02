import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getConditionAreas } from '@/lib/data'
import { getOrganisationProfileFromSession } from '@/lib/ai/commissionerProfiles'
import { requireOrgProfileSession } from '@/lib/orgProfileAuth'
import { getOrgProfile, upsertOrgProfile } from '@/lib/orgProfileStore'
import {
  orgProfileSettingsFromProfile,
  sanitizeOrgProfileSettings,
} from '@/lib/orgProfile'

export const runtime = 'nodejs'

function validConditionIds(): Set<string> {
  return new Set(getConditionAreas().map(c => c.id))
}

export async function GET() {
  const auth = await requireOrgProfileSession()
  if ('error' in auth) return auth.error

  const session = await getSession()
  const defaults = orgProfileSettingsFromProfile(getOrganisationProfileFromSession(session))

  try {
    const saved = await getOrgProfile(auth.organizationId)
    return NextResponse.json({ profile: saved ?? defaults, saved: saved !== null })
  } catch (err) {
    console.error('[OrgProfile] GET failed:', err)
    return NextResponse.json(
      { profile: defaults, saved: false, error: 'Could not load saved settings.' },
      { status: 200 },
    )
  }
}

export async function PUT(req: Request) {
  const auth = await requireOrgProfileSession()
  if ('error' in auth) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const clean = sanitizeOrgProfileSettings(body, validConditionIds())

  if (!clean.organisationName) {
    return NextResponse.json(
      { error: 'Organisation name is required.' },
      { status: 400 },
    )
  }

  try {
    const profile = await upsertOrgProfile(auth.organizationId, clean, auth.userId)
    return NextResponse.json({ profile, saved: true })
  } catch (err) {
    console.error('[OrgProfile] PUT failed:', err)
    return NextResponse.json(
      { error: 'Could not save settings. The database may be unavailable.' },
      { status: 503 },
    )
  }
}
