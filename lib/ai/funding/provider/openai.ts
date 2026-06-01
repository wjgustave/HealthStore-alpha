import { openai, STRUCTURED_MODEL } from '@/lib/ai/config'
import type { LLMProvider } from './types'

const WEB_SEARCH_TOOL = {
  type: 'web_search' as const,
  user_location: { type: 'approximate' as const, country: 'GB' },
}

/**
 * Concrete OpenAI adapter using the Responses API. Uses the built-in web_search
 * tool when requested; otherwise answers from model knowledge. The API key is
 * injected server-side via the shared client in lib/ai/config.ts — never the
 * client bundle.
 */
export class OpenAIProvider implements LLMProvider {
  async generate(input: {
    system: string
    user: string
    webSearch: boolean
    maxTokens: number
  }): Promise<string> {
    const tools = input.webSearch
      ? ([WEB_SEARCH_TOOL] as unknown as Parameters<
          typeof openai.responses.create
        >[0]['tools'])
      : undefined

    const response = await openai.responses.create({
      model: STRUCTURED_MODEL,
      instructions: input.system,
      input: input.user,
      max_output_tokens: input.maxTokens,
      ...(tools ? { tools } : {}),
    })

    return response.output_text ?? ''
  }
}
