import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PRIOR_TO_APPOINTMENT_SECTION } from '../section'

export const metadata = {
  title: 'Ensuring Ardens templates are updated to include digital therapeutics (DTx) — NHS HealthStore',
}

export default function ArdensTemplatesPage() {
  return (
    <GuidanceArticle
      title="Ensuring Ardens templates are updated to include digital therapeutics (DTx)"
      section={PRIOR_TO_APPOINTMENT_SECTION}
    >
      <p>
        When you recommend and refer a patient to a DTx, Ardens templates should be amended (with agreed SNOMED codes)
        to capture:
      </p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>whether a DTx has been recommended (&lsquo;Recommended DTx&rsquo;)</li>
        <li>which one has been recommended (&lsquo;DTx name&rsquo;)</li>
        <li>if the patient is actively using it (&lsquo;Patient actively using&rsquo;)</li>
      </ul>

      <p>
        Templates linked to COPD that may also need to be amended to capture whether a DTx has been recommended are:
      </p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>Annual Review</li>
        <li>Asthma-COPD Overlap Syndrome (ACOS)</li>
        <li>Targeted Lung Health Check</li>
        <li>Multi-Morbidity Annual Review</li>
        <li>Communication Needs and Accessible Information</li>
        <li>Respiratory</li>
      </ul>
    </GuidanceArticle>
  )
}
