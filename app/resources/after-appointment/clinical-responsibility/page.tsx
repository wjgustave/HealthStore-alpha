import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { AFTER_APPOINTMENT_SECTION } from '../section'

export const metadata = { title: 'Clinical responsibility — NHS HealthStore' }

export default function ClinicalResponsibilityPage() {
  return (
    <GuidanceArticle title="Clinical responsibility" section={AFTER_APPOINTMENT_SECTION}>
      <p>
        Over time, some patients will experience exacerbations of their condition, and others will report changes in how
        they feel or respond to treatment.
      </p>
      <p>
        When patients access digital therapeutics (DTx) via the NHS HealthStore, the named supervising clinician retains
        ultimate clinical responsibility for managing a patient&apos;s condition.
      </p>
      <p>
        If a DTx is integrated into a care pathway, the clinician who recommends it or links the patient to it retains
        the duty of care to monitor suitability.
      </p>
      <p>
        During an exacerbation, if a patient ends up in secondary care, the secondary care team become responsible until
        the patient is discharged back into primary care.
      </p>
    </GuidanceArticle>
  )
}
