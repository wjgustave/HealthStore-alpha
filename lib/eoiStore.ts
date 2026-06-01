import { eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orgExpressionsOfInterest } from '@/lib/db/schema'

export type ExpressionOfInterestEntry = {
  id: string
  appId: string
  appName: string
  submittedByUserId: string | null
  submittedByName: string | null
  submittedByEmail: string | null
  organisationName: string | null
  role: string | null
  phone: string | null
  populationEstimate: string | null
  timeline: string | null
  notes: string | null
  createdAt: string
}

export type NewExpressionOfInterest = {
  organizationId: string
  appId: string
  appName: string
  submittedByUserId?: string
  submittedByName?: string
  submittedByEmail?: string
  organisationName?: string
  role?: string
  phone?: string
  populationEstimate?: string
  timeline?: string
  notes?: string
}

function toEntry(r: typeof orgExpressionsOfInterest.$inferSelect): ExpressionOfInterestEntry {
  return {
    id: r.id,
    appId: r.appId,
    appName: r.appName,
    submittedByUserId: r.submittedByUserId ?? null,
    submittedByName: r.submittedByName ?? null,
    submittedByEmail: r.submittedByEmail ?? null,
    organisationName: r.organisationName ?? null,
    role: r.role ?? null,
    phone: r.phone ?? null,
    populationEstimate: r.populationEstimate ?? null,
    timeline: r.timeline ?? null,
    notes: r.notes ?? null,
    createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
  }
}

export async function getExpressionsOfInterest(
  organizationId: string,
): Promise<ExpressionOfInterestEntry[]> {
  const rows = await db()
    .select()
    .from(orgExpressionsOfInterest)
    .where(eq(orgExpressionsOfInterest.organizationId, organizationId))
    .orderBy(desc(orgExpressionsOfInterest.createdAt))

  return rows.map(toEntry)
}

export async function clearAllExpressionsOfInterest(organizationId: string): Promise<void> {
  await db()
    .delete(orgExpressionsOfInterest)
    .where(eq(orgExpressionsOfInterest.organizationId, organizationId))
}

export async function addExpressionOfInterest(
  payload: NewExpressionOfInterest,
): Promise<ExpressionOfInterestEntry[]> {
  await db()
    .insert(orgExpressionsOfInterest)
    .values({
      organizationId: payload.organizationId,
      appId: payload.appId,
      appName: payload.appName,
      submittedByUserId: payload.submittedByUserId ?? null,
      submittedByName: payload.submittedByName ?? null,
      submittedByEmail: payload.submittedByEmail ?? null,
      organisationName: payload.organisationName ?? null,
      role: payload.role ?? null,
      phone: payload.phone ?? null,
      populationEstimate: payload.populationEstimate ?? null,
      timeline: payload.timeline ?? null,
      notes: payload.notes ?? null,
    })

  return getExpressionsOfInterest(payload.organizationId)
}
