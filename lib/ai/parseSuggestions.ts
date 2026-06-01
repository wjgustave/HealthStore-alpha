export type ParsedSuggestion = { label: string; prompt: string }

const SUGGESTION_LINE = /^\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]\s*$/gm

export function parseSuggestions(content: string): {
  body: string
  suggestions: ParsedSuggestion[]
} {
  const suggestions: ParsedSuggestion[] = []

  for (const match of content.matchAll(SUGGESTION_LINE)) {
    const label = match[1]?.trim()
    const prompt = match[2]?.trim() || label
    if (label) {
      suggestions.push({ label, prompt })
    }
  }

  const body = content.replace(SUGGESTION_LINE, '').trimEnd()

  return { body, suggestions }
}
