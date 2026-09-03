import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { AFTER_APPOINTMENT_SECTION } from '../section'

export const metadata = { title: 'Continued access to alternative care — NHS HealthStore' }

export default function ContinuedAccessToAlternativeCarePage() {
  return (
    <GuidanceArticle title="Continued access to alternative care" section={AFTER_APPOINTMENT_SECTION}>
      <p>
        If a patient does not want to use or continue to use a digital therapeutics (DTx) app within the NHS, a
        clinician will still offer standard, non-digital, or face-to-face treatment alternatives. Declining to use a
        digital therapeutic app does not affect a patient&apos;s entitlement to high-quality, standard NHS care.
      </p>
    </GuidanceArticle>
  )
}
