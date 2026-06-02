import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { organizations } from '@/lib/db/schema'
import { COMMISSIONING_ENTITIES } from '@/lib/commissioningEntities'
import { DEFAULT_PRIMARY_ICB_NAME } from '@/lib/commissioningContextDisplay'
import type { SessionData } from '@/lib/session'

/** URL/identity-safe slug. Matches scripts/seed-db.ts so seeded + runtime ids align. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type OrgIdentitySession = Pick<
  SessionData,
  'organizationId' | 'profileOrganisationName' | 'commissioningEntityId'
>

/** Best-effort organisation display name for the active session. */
export function resolveOrganizationName(session: OrgIdentitySession): string {
  if (session.profileOrganisationName) return session.profileOrganisationName
  if (session.commissioningEntityId) {
    const entity = COMMISSIONING_ENTITIES.find(e => e.id === session.commissioningEntityId)
    if (entity) return entity.name
  }
  return DEFAULT_PRIMARY_ICB_NAME
}

/**
 * Resolves the DB organization id for the session, creating the row when needed.
 *
 * Demo/named accounts may not carry a pre-seeded `organizationId`, so we derive a
 * stable slug from the organisation name and upsert an `organizations` row. This is
 * what enables org-level sharing (Option B) for accounts without a seeded org.
 */
export async function resolveOrganizationId(session: OrgIdentitySession): Promise<string> {
  if (session.organizationId) return session.organizationId

  const name = resolveOrganizationName(session)
  const slug = slugify(name)

  const existing = await db()
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .limit(1)

  if (existing.length > 0) return existing[0].id

  const inserted = await db()
    .insert(organizations)
    .values({ name, slug })
    .onConflictDoNothing()
    .returning({ id: organizations.id })

  if (inserted.length > 0) return inserted[0].id

  // Lost an insert race on the unique slug — read the winning row.
  const afterConflict = await db()
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .limit(1)

  if (afterConflict.length === 0) {
    throw new Error(`Failed to resolve organization id for "${name}"`)
  }
  return afterConflict[0].id
}
