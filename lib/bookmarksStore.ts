import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orgBookmarks } from '@/lib/db/schema'

export type BookmarkEntry = {
  appId: string
  savedAt: string
}

export async function getBookmarks(organizationId: string): Promise<BookmarkEntry[]> {
  const rows = await db()
    .select({ appId: orgBookmarks.appId, savedAt: orgBookmarks.savedAt })
    .from(orgBookmarks)
    .where(eq(orgBookmarks.organizationId, organizationId))
    .orderBy(desc(orgBookmarks.savedAt))

  return rows.map(r => ({
    appId: r.appId,
    savedAt: r.savedAt?.toISOString() ?? new Date().toISOString(),
  }))
}

export async function addBookmark(
  organizationId: string,
  appId: string,
  userId?: string,
): Promise<BookmarkEntry[]> {
  await db()
    .insert(orgBookmarks)
    .values({
      organizationId,
      appId,
      savedByUserId: userId ?? null,
    })
    .onConflictDoNothing()

  return getBookmarks(organizationId)
}

export async function removeBookmark(organizationId: string, appId: string): Promise<BookmarkEntry[]> {
  await db()
    .delete(orgBookmarks)
    .where(and(eq(orgBookmarks.organizationId, organizationId), eq(orgBookmarks.appId, appId)))

  return getBookmarks(organizationId)
}

export async function toggleBookmark(
  organizationId: string,
  appId: string,
  userId?: string,
): Promise<{ saved: boolean; bookmarks: BookmarkEntry[] }> {
  const existing = await db()
    .select({ id: orgBookmarks.id })
    .from(orgBookmarks)
    .where(and(eq(orgBookmarks.organizationId, organizationId), eq(orgBookmarks.appId, appId)))
    .limit(1)

  if (existing.length > 0) {
    await db()
      .delete(orgBookmarks)
      .where(and(eq(orgBookmarks.organizationId, organizationId), eq(orgBookmarks.appId, appId)))
    return { saved: false, bookmarks: await getBookmarks(organizationId) }
  }

  await db().insert(orgBookmarks).values({
    organizationId,
    appId,
    savedByUserId: userId ?? null,
  })
  return { saved: true, bookmarks: await getBookmarks(organizationId) }
}

export async function clearAllBookmarks(organizationId: string): Promise<void> {
  await db().delete(orgBookmarks).where(eq(orgBookmarks.organizationId, organizationId))
}

export function sanitizeBookmarks(entries: BookmarkEntry[], validAppIds: Set<string>): BookmarkEntry[] {
  return entries.filter(e => validAppIds.has(e.appId))
}
