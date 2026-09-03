import Link from 'next/link'
import { GuidanceArticle } from '@/components/resources/GuidanceArticle'

export const metadata = {
  title:
    'Utilising local partners and third-sector organisations to help deliver digital inclusion work — NHS HealthStore',
}

export default function LocalPartnersDigitalInclusionPage() {
  return (
    <GuidanceArticle title="Utilising local partners and third-sector organisations to help deliver digital inclusion work">
      <p>
        When the Cornwall and Scilly Integrated Care Board (ICB) ran a 6-month campaign to get more patients onto COPD
        healthcare pathways using digital therapeutics (DTx), they took a multi-agency approach.
      </p>
      <p>
        By working with the local council, charities, and primary and secondary care, the ICB were able to reach more
        patients, offering them tailored support. Some national charities also provide support for those less digitally
        confident.
      </p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          <Link
            href="https://www.goodthingsfoundation.org/"
            className="nhsuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Good Things Foundation (opens in a new tab)
          </Link>
        </li>
        <li>
          <Link
            href="https://digitalpovertyalliance.org/"
            className="nhsuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Digital Poverty Alliance (opens in a new tab)
          </Link>
        </li>
      </ul>
    </GuidanceArticle>
  )
}
