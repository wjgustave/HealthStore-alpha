import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orgProfiles } from '@/lib/db/schema'
import type { OrgProfileSettings } from '@/lib/orgProfile'

export async function getOrgProfile(organizationId: string): Promise<OrgProfileSettings | null> {
  const rows = await db()
    .select({ profile: orgProfiles.profile })
    .from(orgProfiles)
    .where(eq(orgProfiles.organizationId, organizationId))
    .limit(1)

  if (rows.length === 0) return null
  return rows[0].profile as OrgProfileSettings
}

export async function upsertOrgProfile(
  organizationId: string,
  data: OrgProfileSettings,
  userId?: string,
): Promise<OrgProfileSettings> {
  await db()
    .insert(orgProfiles)
    .values({
      organizationId,
      profile: data,
      updatedByUserId: userId ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: orgProfiles.organizationId,
      set: {
        profile: data,
        updatedByUserId: userId ?? null,
        updatedAt: new Date(),
      },
    })

  return data
}
