import type { LLMProvider } from './types'
import { OpenAIProvider } from './openai'

export type { LLMProvider } from './types'
export { OpenAIProvider } from './openai'

/**
 * Returns the active LLM provider. To swap providers, implement LLMProvider in a
 * new file (e.g. provider/anthropic.ts) and return it here — nothing else in the
 * funding finder needs to change.
 */
export function getProvider(): LLMProvider {
  return new OpenAIProvider()
}
