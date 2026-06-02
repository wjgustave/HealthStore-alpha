import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getConditionAreas } from '@/lib/data'
import { getOrganisationProfileFromSession } from '@/lib/ai/commissionerProfiles'
import { resolveOrganizationId } from '@/lib/orgIdentity'
import { getOrgProfile } from '@/lib/orgProfileStore'
import { orgProfileSettingsFromProfile, type OrgProfileSettings } from '@/lib/orgProfile'
import OrgSettingsClient from './OrgSettingsClient'

export const dynamic = 'force-dynamic'

export default async function OrgSettingsPage() {
  const session = await getSession()

  if (!session.isLoggedIn) redirect('/login')
  if (session.requiresCommissioningEntitySelection) redirect('/select-entity')

  const staticProfile = getOrganisationProfileFromSession(session)
  const defaults = orgProfileSettingsFromProfile(staticProfile)

  let initial: OrgProfileSettings = defaults
  let savedExists = false
  let dbAvailable = true

  try {
    const organizationId = await resolveOrganizationId(session)
    const saved = await getOrgProfile(organizationId)
    if (saved) {
      initial = saved
      savedExists = true
    }
  } catch (err) {
    console.error('[OrgSettings] Could not load saved profile:', err)
    dbAvailable = false
  }

  const conditionOptions = getConditionAreas().map(c => ({ id: c.id, label: c.label }))

  return (
    <OrgSettingsClient
      initial={initial}
      defaults={defaults}
      savedExists={savedExists}
      dbAvailable={dbAvailable}
      conditionOptions={conditionOptions}
    />
  )
}
