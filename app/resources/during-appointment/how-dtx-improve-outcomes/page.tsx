import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { DURING_APPOINTMENT_SECTION } from '../section'

export const metadata = {
  title: 'How digital therapeutics (DTx) improve patient outcomes — NHS HealthStore',
}

export default function HowDtxImproveOutcomesPage() {
  return (
    <GuidanceArticle
      title="How digital therapeutics (DTx) improve patient outcomes"
      section={DURING_APPOINTMENT_SECTION}
    >
      <p>
        Digital therapeutics (DTx) are clinically-proven software apps used to prevent, manage, or treat long-term
        health conditions. They improve patient outcomes by delivering tailored behavioural therapies, tracking
        symptoms, and increasing treatment adherence.
      </p>
      <p>Digital therapeutics can improve patient outcomes in several ways, such as:</p>

      <h2>Supporting behaviour changes over time</h2>
      <p>
        Sustained behaviour change in exercise, diet, medication adherence and symptom monitoring is difficult to
        achieve during short appointments. Digital therapeutics provide daily support that can enable lasting change.
      </p>

      <h2>Building confidence to self-manage</h2>
      <p>
        Providing National Institute for Health and Care Excellence (NICE)-approved digital therapy that helps patients
        understand what is safe to do can support engagement in their recovery. A digital therapeutic provides structure
        and reassurance that helps build confidence in managing their health. Feeling able to manage their own health
        can help reduce anxiety-driven contacts and unnecessary appointments.
      </p>

      <h2>Extending the reach of a clinical programme</h2>
      <p>
        For patients who cannot access in-person services due to their location, or work or caring responsibilities, a
        DTx may be the only structured help available. For patients who have completed a clinical programme, it provides
        an opportunity for continued support.
      </p>

      <h2>Reducing pressure on services</h2>
      <p>
        Evidence from deployed digital therapeutics shows that people who engage with structured, digital support reduce
        the likelihood of unplanned GP appointments, emergency department attendances and hospital readmissions.
      </p>
    </GuidanceArticle>
  )
}
