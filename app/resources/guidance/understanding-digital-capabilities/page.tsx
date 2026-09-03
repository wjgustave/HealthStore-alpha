import { DoDontList, GuidanceArticle } from '@/components/resources/GuidanceArticle'

export const metadata = {
  title: "Find ways of understanding patients' digital capabilities — NHS HealthStore",
}

export default function UnderstandingDigitalCapabilitiesPage() {
  return (
    <GuidanceArticle title="Find ways of understanding patients' digital capabilities">
      <p>
        Before recommending a digital therapeutic (DTx), the Roxton Practice assesses each patient, to better understand
        their digital capabilities.
      </p>
      <p>
        The practice asked all 12,500 of its patients (using communication methods that included face-to-face, phone,
        letter, text and online) about their confidence in and preferences for digital care.
      </p>
      <p>
        Patient responses were used to assign each patient a digital readiness level, reflected in their health record,
        and staff use the information to determine how best to reach that patient. A digitally confident person might
        receive a link, and someone less confident might be offered a paper form to complete or face-to-face help.
      </p>
      <p>
        All information obtained is incorporated into the NHS Electronic Patient Record (EPR), and clinicians and
        practice staff must keep it up to date.
      </p>

      <DoDontList
        title="Do"
        type="tick"
        items={[
          'check each patient’s digital confidence before suggesting a DTx',
          'record the patient’s ‘readiness’ in their health record',
          'keep the digital readiness level up to date, in recognition that digital confidence and ability can change over time',
        ]}
      />

      <DoDontList
        title="Do not"
        type="cross"
        items={[
          'assume capability based on someone’s age or background',
          'let the readiness level override the patient’s choice',
          'assume that you will contact everyone in the same way',
        ]}
      />
    </GuidanceArticle>
  )
}
