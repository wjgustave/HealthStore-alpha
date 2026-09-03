import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PREPARING_SECTION } from '../section'

export const metadata = { title: 'Clinician onboarding guidance — NHS HealthStore' }

export default function ClinicianOnboardingGuidancePage() {
  return (
    <GuidanceArticle title="Clinician onboarding guidance" section={PREPARING_SECTION}>
      <p>
        This guidance supports clinicians who are setting up and using The NHS HealthStore to recommend digital
        therapeutics (DTx) to their patients.
      </p>
    </GuidanceArticle>
  )
}
