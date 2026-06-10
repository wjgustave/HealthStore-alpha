/**
 * AI Advisor panel and chat API.
 *
 * Set `NEXT_PUBLIC_AI_ADVISOR_ENABLED=true` (or `1`) to show the nav control,
 * panel, and `/api/ai/*` routes. Omit or leave unset to hide the feature.
 */
export function isAiAdvisorEnabledFromEnv(): boolean {
  const v = process.env.NEXT_PUBLIC_AI_ADVISOR_ENABLED
  if (v == null || v === '') return false
  const t = v.trim().toLowerCase()
  return t === '1' || t === 'true' || t === 'yes'
}
