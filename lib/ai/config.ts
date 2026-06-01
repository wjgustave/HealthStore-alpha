import OpenAI from 'openai'

let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _client
}

/**
 * Lazily-constructed OpenAI client. Construction is deferred until first use so
 * that importing AI modules (e.g. for offline unit tests) does not require an
 * API key. Real network calls still fail clearly if the key is missing.
 */
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop, receiver) {
    const client = getClient()
    const value = Reflect.get(client as object, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export const AI_MODEL = 'gpt-5.4' as const
export const REASONING_EFFORT = 'medium' as const
export const MAX_TOOL_ROUNDS = 8

/**
 * Model used for non-chat structured tasks (e.g. funding evidence extraction).
 * Prefers OPENAI_MODEL from env, falling back to the chat model.
 */
export const STRUCTURED_MODEL = process.env.OPENAI_MODEL || AI_MODEL
