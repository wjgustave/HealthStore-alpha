import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { normalizeAndValidateShareKeys } from '@/lib/pdpShareKeys'

const ALG = 'HS256'
const SHARE_EXPIRY = '14d'

function getSecretKey(): Uint8Array {
  const raw =
    process.env.PRODUCT_SHARE_SECRET?.trim() ||
    process.env.SESSION_SECRET?.trim() ||
    ''
  if (!raw) {
    throw new Error('PRODUCT_SHARE_SECRET or SESSION_SECRET must be set for product share links')
  }
  return new TextEncoder().encode(raw)
}

export type ProductShareClaims = {
  slug: string
  keys: string[]
  /** Commissioning entity id, or empty string if none (single-user session). */
  ent: string
}

function isRecord(v: JWTPayload): v is JWTPayload & Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export async function createProductShareToken(claims: ProductShareClaims): Promise<string> {
  const key = getSecretKey()
  return new SignJWT({
    slug: claims.slug,
    keys: claims.keys,
    ent: claims.ent,
  })
    .setProtectedHeader({ alg: ALG })
    .setExpirationTime(SHARE_EXPIRY)
    .sign(key)
}

export async function verifyProductShareToken(token: string): Promise<ProductShareClaims | null> {
  try {
    const key = getSecretKey()
    const { payload } = await jwtVerify(token, key, { algorithms: [ALG] })
    if (!isRecord(payload)) return null
    const slug = payload.slug
    const keys = payload.keys
    const ent = payload.ent
    if (typeof slug !== 'string' || slug.length === 0) return null
    if (!Array.isArray(keys) || keys.length === 0) return null
    if (!keys.every((k): k is string => typeof k === 'string')) return null
    if (typeof ent !== 'string') return null
    const keysNorm = normalizeAndValidateShareKeys(keys)
    if (!keysNorm) return null
    return { slug, keys: keysNorm, ent }
  } catch {
    return null
  }
}
