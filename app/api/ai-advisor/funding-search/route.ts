import { getSession } from '@/lib/session'
import {
  runFundingFinder,
  REGIONS,
  CONDITIONS,
  APPS,
  SEARCH_MODE,
  type Region,
  type SearchMode,
} from '@/lib/ai/funding'

export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * Auth-gated DTx Funding Finder endpoint. Accepts { region, mode, selection },
 * runs the provider-agnostic finder, and returns ranked, scored results.
 */
export async function POST(request: Request) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: 'Funding search is not configured (no model API key).' }, { status: 500 })
  }

  let body: { region?: unknown; mode?: unknown; selection?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const region = body.region as Region
  const mode = body.mode as SearchMode
  const selection = body.selection as string

  if (!REGIONS.includes(region)) {
    return Response.json({ error: 'Invalid or missing region' }, { status: 400 })
  }
  if (mode !== SEARCH_MODE.CONDITION && mode !== SEARCH_MODE.APP) {
    return Response.json({ error: 'Invalid or missing search mode' }, { status: 400 })
  }
  const validSelection =
    mode === SEARCH_MODE.APP
      ? APPS.some(a => a.id === selection)
      : CONDITIONS.some(c => c.id === selection)
  if (!validSelection) {
    return Response.json({ error: 'Invalid or missing selection' }, { status: 400 })
  }

  try {
    const results = await runFundingFinder({ region, mode, selection })
    return Response.json({ results })
  } catch (err) {
    console.error('[Funding Finder] Error:', err)
    const message =
      err instanceof Error
        ? err.message
        : 'Search failed — the model returned an unexpected format.'
    return Response.json({ error: message }, { status: 502 })
  }
}
