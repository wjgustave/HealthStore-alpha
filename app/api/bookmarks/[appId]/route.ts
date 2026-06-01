import { NextResponse } from 'next/server'
import { getAllAppsUnfiltered } from '@/lib/data'
import { requireBookmarkSession } from '@/lib/bookmarksAuth'
import { removeBookmark, sanitizeBookmarks } from '@/lib/bookmarksStore'

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ appId: string }> },
) {
  const auth = await requireBookmarkSession()
  if ('error' in auth) return auth.error

  const { appId } = await ctx.params
  const trimmed = appId.trim()
  if (!trimmed) {
    return NextResponse.json({ error: 'Invalid appId.' }, { status: 400 })
  }

  const validIds = new Set(getAllAppsUnfiltered().map(a => a.id))
  const bookmarks = sanitizeBookmarks(await removeBookmark(auth.organizationId, trimmed), validIds)
  return NextResponse.json({ bookmarks })
}
