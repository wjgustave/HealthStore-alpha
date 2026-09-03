import Link from 'next/link'
import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { DURING_APPOINTMENT_SECTION } from '../section'

export const metadata = {
  title: 'Overcoming barriers to using digital therapeutics (DTx) — NHS HealthStore',
}

const KINGS_FUND_HREF =
  'https://www.kingsfund.org.uk/insight-and-analysis/long-reads/digital-exclusion-inclusion-health-care'

function KingsFundLink() {
  return (
    <Link href={KINGS_FUND_HREF} className="nhsuk-link" target="_blank" rel="noopener noreferrer">
      The King&apos;s Fund: Moving from digital exclusion to inclusion in digital health and care (opens in a new tab)
    </Link>
  )
}

export default function OvercomingBarriersPage() {
  return (
    <GuidanceArticle
      title="Overcoming barriers to using digital therapeutics (DTx)"
      section={DURING_APPOINTMENT_SECTION}
    >
      <p>
        Refer to{' '}
        <Link href="/resources/preparing-to-recommend/case-studies-and-best-practice" className="nhsuk-link">
          Case studies and best practice
        </Link>{' '}
        for more examples of best practice.
      </p>

      <h2>Assessing a patient&apos;s digital capabilities</h2>
      <p>
        By assessing a patient&apos;s digital capabilities as part of routine clinical contact, practitioners can
        increase the likelihood of the care pathway being well matched to the patient&apos;s digital capabilities.
      </p>
      <p>
        At the Roxton Practice in North Lincolnshire, they implemented a formal scoring system showing patients&apos;
        digital capabilities.
      </p>
      <p>
        This was then incorporated into pathways that would define the type of communications each patient would
        receive.
      </p>
      <p>More resources:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          <Link href="/resources/guidance/understanding-digital-capabilities" className="nhsuk-link">
            Find ways of understanding patients&apos; digital capabilities
          </Link>
        </li>
        <li>
          <KingsFundLink />
        </li>
      </ul>

      <h2>Using in-person help to support adoption</h2>
      <p>
        Systematic and targeted in-person help can support people in onboarding to apps. This help can be provided by
        people with limited clinical training.
      </p>
      <p>More resources:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          <Link href="/resources/guidance/targeted-human-support" className="nhsuk-link">
            Using targeted human support to enable digital inclusion
          </Link>
        </li>
        <li>
          <KingsFundLink />
        </li>
      </ul>

      <h2>Working with local partners and third-sector organisations</h2>
      <p>
        Many practices that have successfully helped people onboard to DTx using the NHS App have worked with other
        organisations within their neighbourhood or local area. This multi-agency approach enables the sharing and
        addressing of complex health and care needs.
      </p>
    </GuidanceArticle>
  )
}
