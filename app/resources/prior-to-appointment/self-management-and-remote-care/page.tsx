import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PRIOR_TO_APPOINTMENT_SECTION } from '../section'

export const metadata = {
  title: 'What we mean by Self-management, Remote Management and Remote Monitoring — NHS HealthStore',
}

export default function SelfManagementAndRemoteCarePage() {
  return (
    <GuidanceArticle
      title="What we mean by Self-management, Remote Management and Remote Monitoring"
      section={PRIOR_TO_APPOINTMENT_SECTION}
    >
      <h2>Self-management</h2>
      <p>
        Self-management of long-term health conditions using digital therapeutics (DTx) apps across the NHS means:
      </p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          patients using clinically validated and evidence-based software independently or alongside conventional care
          to prevent, manage, or treat long-term health conditions
        </li>
        <li>
          empowering individuals by using a digital therapeutic (DTx) to track symptoms, deliver behavioural therapy,
          and guide care choices
        </li>
      </ul>

      <h2>Remote Management</h2>
      <p>To be remotely managed means:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          once discharged from the hospital and into a community care setting (a private home, local clinic, day centre
          or care home), patients are monitored 24/7 by a dedicated team
        </li>
        <li>
          patients are responsible for manually providing their measurements (symptoms, blood pressure, pulse rate and
          oxygen levels) in the DTx app at regular intervals (either preset or individually tailored)
        </li>
        <li>patients have flexibility to provide measurements at any time of day</li>
      </ul>

      <h2>Remote Monitoring (the virtual ward — a grouping of virtually monitored patients)</h2>
      <p>To be remotely monitored means:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>patients are monitored 24/7 by a dedicated team</li>
        <li>
          measurements are automatically recorded in their DTx app using a digital device or a digital diagnostic device
          (known as a wearable) in real-time
        </li>
        <li>
          once a measurement falls outside of the set, safe range, an alert is sent to the monitoring team, who will
          respond and support the patient
        </li>
      </ul>
    </GuidanceArticle>
  )
}
