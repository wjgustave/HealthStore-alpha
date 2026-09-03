import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PREPARING_SECTION } from '../section'

export const metadata = {
  title: 'How to introduce digital therapeutics (DTx) to your patients — NHS HealthStore',
}

const LANGUAGE_EXAMPLES = [
  {
    say: "I'm recommending this as part of your treatment",
    avoid: 'There\u2019s an app you might want to try',
  },
  {
    say: 'This has been recommended to help with your recovery',
    avoid: 'You could have a look at this if you want',
  },
  {
    say: "This is part of your care — it's free and approved by the NHS",
    avoid: "It's just a digital thing, give it a go",
  },
] as const

export default function IntroducingDtxToPatientsPage() {
  return (
    <GuidanceArticle
      title="How to introduce digital therapeutics (DTx) to your patients"
      section={PREPARING_SECTION}
    >
      <p>
        Offering Very Brief Advice (VBA) when a patient is diagnosed with a long-term health condition or discharged
        after surgery can help you start embedding DTx with your patients. Very Brief Advice enables you to have a
        conversation with your patients that lasts about 30 seconds to 2 minutes.
      </p>
      <p>To use the VBA technique, you should:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          <strong>Ask</strong> — establish your patient&apos;s situation, how they are feeling, how familiar they are
          with apps, what access they have to technology, what support they have around them to help, and how
          comfortable they are with self-management
        </li>
        <li>
          <strong>Advise</strong> — explain the benefits as short verbal bullets, share what support exists and what
          they need to do
        </li>
        <li>
          <strong>Act</strong> — offer a referral to the DTx
        </li>
      </ul>

      <h2>Language to use</h2>
      <p>
        One of the most important variables in whether a patient engages with a digital therapeutic (DTx) is the
        clinical conversation at the point of referral.
      </p>
      <p>
        Patients who understand from their clinician why they have been recommended a DTx, are significantly more likely
        to onboard and continue using it.
      </p>

      <table className="nhsuk-table">
        <caption className="nhsuk-table__caption">
          Suggested language to use during brief conversations that introduce DTx
        </caption>
        <thead className="nhsuk-table__head">
          <tr className="nhsuk-table__row">
            <th scope="col" className="nhsuk-table__header">
              Say this
            </th>
            <th scope="col" className="nhsuk-table__header">
              Avoid this
            </th>
          </tr>
        </thead>
        <tbody className="nhsuk-table__body">
          {LANGUAGE_EXAMPLES.map(row => (
            <tr key={row.say} className="nhsuk-table__row">
              <td className="nhsuk-table__cell">{row.say}</td>
              <td className="nhsuk-table__cell">{row.avoid}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>During the next clinical contact, ask how the patient is getting on with the app.</p>

      <h2>Digital therapeutics as an integral part of treatment</h2>
      <p>
        We know that some people are sceptical of DTx apps. Research shows that clarifying that DTx is part of their
        treatment can help reduce negative associations with the app.
      </p>
    </GuidanceArticle>
  )
}
