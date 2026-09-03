import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PRIOR_TO_APPOINTMENT_SECTION } from '../section'

export const metadata = {
  title: 'Recognition of the challenges patients might have — NHS HealthStore',
}

export default function PatientChallengesPage() {
  return (
    <GuidanceArticle
      title="Recognition of the challenges patients might have"
      section={PRIOR_TO_APPOINTMENT_SECTION}
    >
      <p>
        NHS England is working hard to make digital therapeutics (DTx) within the NHS App easily accessible to its
        users. We recognise that not everyone owns a digital device or feels confident using digital apps, and that some
        DTx app users are older, disabled, or have little support. Additionally, we understand that some people find it
        difficult to locate, understand, and use basic health information and services.
      </p>

      <p>A clinician can support a patient by:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>directing patients to locations with reliable internet and mobile data</li>
        <li>providing onboarding guidance</li>
        <li>helping patients to navigate the DTx or understand automated medical advice</li>
        <li>monitoring patient progress</li>
      </ul>

      <p>NHS England&apos;s digital content supports patients by:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>informing patients how personal health data is stored, shared, or secured</li>
        <li>providing guidance on how to use a DTx effectively</li>
      </ul>
    </GuidanceArticle>
  )
}
