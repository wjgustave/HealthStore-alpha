import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PREPARING_SECTION } from '../section'

export const metadata = {
  title: 'Identifying suitable patients for digital therapeutics (DTx) inclusion — NHS HealthStore',
}

export default function IdentifyingSuitablePatientsPage() {
  return (
    <GuidanceArticle
      title="Identifying suitable patients for digital therapeutics (DTx) inclusion"
      section={PREPARING_SECTION}
    >
      <p>When identifying suitable patients for DTx inclusion, patients must be:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>registered with a GP in your geographical area</li>
        <li>
          have a confirmed diagnosis of chronic obstructive pulmonary disease (COPD), asthma, or both
        </li>
        <li>
          agreeable with the terms of use, and to patient-initiated follow-up (PIFU) — a carer or relative can also
          agree to this
        </li>
        <li>
          able to use a computer, tablet or smartphone and the DTx app — a relative, friend, or carer can be present and
          support
        </li>
      </ul>

      <p>Patients are not suitable for DTx inclusion if they:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>are under the age of 18</li>
        <li>lack capacity and are unable to consent</li>
        <li>have certain comorbidities</li>
        <li>take certain medications</li>
      </ul>

      <p>
        Additional eligibility criteria depend on the agreed scope of the problem that needs to be solved in that area.
        Therefore, questions are shaped based on what the data needs to answer.
      </p>
    </GuidanceArticle>
  )
}
