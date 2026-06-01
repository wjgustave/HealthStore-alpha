import { NextResponse } from 'next/server'
import { getAllAppsUnfiltered } from '@/lib/data'
import { requireBookmarkSession } from '@/lib/bookmarksAuth'
import {
  clearAllBookmarks,
  getBookmarks,
  sanitizeBookmarks,
  toggleBookmark,
} from '@/lib/bookmarksStore'

function validAppIds(): Set<string> {
  return new Set(getAllAppsUnfiltered().map(a => a.id))
}

export async function GET() {
  const auth = await requireBookmarkSession()
  if ('error' in auth) return auth.error

  const ids = validAppIds()
  const bookmarks = sanitizeBookmarks(await getBookmarks(auth.organizationId), ids)
  return NextResponse.json({ bookmarks })
}

export async function POST(req: Request) {
  const auth = await requireBookmarkSession()
  if ('error' in auth) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const appId =
    typeof body === 'object' && body !== null && 'appId' in body && typeof body.appId === 'string'
      ? body.appId.trim()
      : ''

  if (!appId) {
    return NextResponse.json({ error: 'Provide a non-empty appId.' }, { status: 400 })
  }

  const ids = validAppIds()
  if (!ids.has(appId)) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const { saved, bookmarks } = await toggleBookmark(auth.organizationId, appId, auth.userId)
  return NextResponse.json({
    saved,
    bookmarks: sanitizeBookmarks(bookmarks, ids),
  })
}

export async function DELETE() {
  const auth = await requireBookmarkSession()
  if ('error' in auth) return auth.error
  await clearAllBookmarks(auth.organizationId)
  return NextResponse.json({ ok: true, bookmarks: [] })
}
