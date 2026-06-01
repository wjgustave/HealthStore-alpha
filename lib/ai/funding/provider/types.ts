/**
 * Provider-agnostic LLM interface. The funding finder depends ONLY on this
 * contract — prompt construction, parsing, scoring, ranking and UI are all
 * provider-independent. Add a new provider by implementing this in one file.
 */
export interface LLMProvider {
  /**
   * Returns the model's raw text output. Implementations handle their own auth,
   * request shape, and (if supported) web search / retrieval. If a provider has
   * no web-search tool it should degrade gracefully (answer from model
   * knowledge) and results may be less current.
   */
  generate(input: {
    system: string
    user: string
    webSearch: boolean
    maxTokens: number
  }): Promise<string>
}
