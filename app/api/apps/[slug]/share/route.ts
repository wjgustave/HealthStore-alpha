import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getSession } from '@/lib/session'
import { getAppBySlug } from '@/lib/data'
import { normalizeAndValidateShareKeys } from '@/lib/pdpShareKeys'
import { createProductShareToken } from '@/lib/productShareToken'

/**
 * Creates a signed, short-lived share link (Track A: stateless JWT).
 * Auth-only; commissioning entity is bound into the token for recipients.
 */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.requiresCommissioningEntitySelection) {
    return NextResponse.json(
      { error: 'Choose a commissioning organisation before creating share links.' },
      { status: 403 },
    )
  }

  const { slug } = await ctx.params
  const app = getAppBySlug(slug)
  if (!app) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const keys = normalizeAndValidateShareKeys(
    typeof body === 'object' && body !== null && 'keys' in body
      ? (body as { keys: unknown }).keys
      : null,
  )
  if (!keys) {
    return NextResponse.json(
      { error: 'Provide a non-empty keys array of valid section identifiers.' },
      { status: 400 },
    )
  }

  const ent = session.commissioningEntityId ?? ''
  const token = await createProductShareToken({ slug, keys, ent })

  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? ''
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const base = host ? `${proto}://${host}` : ''
  const path = `/apps/${encodeURIComponent(slug)}/shared?t=${encodeURIComponent(token)}`
  const shareUrl = base ? `${base}${path}` : path

  return NextResponse.json({ shareUrl })
}
