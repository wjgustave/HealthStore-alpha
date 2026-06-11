import { cookies } from 'next/headers'
import { coerceDesignId, DESIGN_COOKIE, type DesignId } from './config'

/** Reads the active design id from the request cookie (server components only). */
export async function getActiveDesign(): Promise<DesignId> {
  const store = await cookies()
  return coerceDesignId(store.get(DESIGN_COOKIE)?.value)
}
