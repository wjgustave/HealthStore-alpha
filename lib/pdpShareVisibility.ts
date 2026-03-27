import {
  hasWhatItTakesContent,
  shouldShowImpactSection,
  shouldShowDemoAccess,
} from '@/components/AppDetailSections'

/**
 * Keys the shared view will actually render for this app (matches PDP conditional blocks).
 */
export function sharedKeysWithVisibleContent(app: any, allowed: Set<string>): string[] {
  const k: string[] = []
  if (allowed.has('hero')) k.push('hero')
  if (allowed.has('why-it-matters')) k.push('why-it-matters')
  if (allowed.has('context-of-use') && app.context_of_use) k.push('context-of-use')
  if (allowed.has('scale-and-maturity')) k.push('scale-and-maturity')
  if (allowed.has('what-it-takes-locally') && hasWhatItTakesContent(app)) k.push('what-it-takes-locally')
  if (allowed.has('expected-impact') && shouldShowImpactSection(app)) k.push('expected-impact')
  if (allowed.has('clinical-evidence')) k.push('clinical-evidence')
  if (allowed.has('nice-guidance')) k.push('nice-guidance')
  if (allowed.has('data-quality-flags') && (app.contradictory_evidence?.length ?? 0) > 0) {
    k.push('data-quality-flags')
  }
  if (allowed.has('demo-access') && shouldShowDemoAccess(app)) k.push('demo-access')
  if (allowed.has('nhs-integrations') && app.technical_integrations) k.push('nhs-integrations')
  if (allowed.has('commercial-model')) k.push('commercial-model')
  if (allowed.has('indicative-financial')) k.push('indicative-financial')
  if (allowed.has('related-funding')) k.push('related-funding')
  if (allowed.has('sidebar-summary')) k.push('sidebar-summary')
  return k
}
