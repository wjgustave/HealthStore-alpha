import { cookies } from 'next/headers'
import {
  CommissionerContext,
  DEFAULT_CONTEXT,
  contextFromSearchParams,
  mergeContext,
} from './types'

const COOKIE_NAME = 'hs-commissioner-context'

export async function getServerContext(
  searchParams?: Record<string, string | string[] | undefined>
): Promise<CommissionerContext> {
  let ctx = DEFAULT_CONTEXT

  if (searchParams && Object.keys(searchParams).length > 0) {
    ctx = mergeContext(ctx, contextFromSearchParams(searchParams))
  } else {
    const cookieStore = await cookies()
    const raw = cookieStore.get(COOKIE_NAME)?.value
    if (raw) {
      try {
        ctx = mergeContext(DEFAULT_CONTEXT, JSON.parse(decodeURIComponent(raw)))
      } catch {
        // ignore invalid cookie
      }
    }
  }

  return ctx
}

export function serializeContextCookie(ctx: CommissionerContext): string {
  return encodeURIComponent(JSON.stringify(ctx))
}

export { COOKIE_NAME }
