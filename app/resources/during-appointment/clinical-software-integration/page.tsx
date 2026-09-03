import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { DURING_APPOINTMENT_SECTION } from '../section'

export const metadata = { title: 'Integration with clinical software — NHS HealthStore' }

export default function ClinicalSoftwareIntegrationPage() {
  return (
    <GuidanceArticle title="Integration with clinical software" section={DURING_APPOINTMENT_SECTION}>
      <h2>Prescribing via DM+D</h2>
      <p>
        Conceptually, a digital therapeutic (DTx) recommendation is treated like a prescription. It&apos;s part of a
        care plan and clinical pathway, and, where applicable, should be discussed with the patient before it is
        recommended.
      </p>
      <p>
        Electronic Patient Records (EPR) software (accessed via the DM+D dropdown) triggers the DTx onboarding journey.
      </p>

      <h2>Communications via the NHS App and onboarding journey</h2>
      <p>
        Once you have recommended a DTx to a patient, the NHS HealthStore service will trigger NHS Notify to send the
        patient a message via the NHS App.
      </p>
      <p>
        The patient will then be prompted to download the relevant digital therapeutic and log in using their NHS Login
        details.
      </p>
      <p>
        If the patient does not successfully onboard onto the app within 7 days of the initial prompt, they will receive
        an SMS reminder. This SMS may later be followed up with an email.
      </p>
      <p>The recommendation remains valid for 12 months once recommended.</p>
    </GuidanceArticle>
  )
}
