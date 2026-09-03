import Link from 'next/link'
import { DoDontList, GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PREPARING_SECTION } from '../section'

export const metadata = {
  title: 'Embedding digital therapeutics (DTx) into a service or pathway — NHS HealthStore',
}

export default function EmbeddingDtxIntoAPathwayPage() {
  return (
    <GuidanceArticle
      title="Embedding digital therapeutics (DTx) into a service or pathway"
      section={PREPARING_SECTION}
    >
      <p>
        From research, we know that digital therapeutics (DTx) are most successful when embedded into a clinical
        pathway. Patients are referred to a clinical service, and the DTx app is built into that service.
      </p>
      <p>
        When patients are introduced to DTx, but do not receive ongoing support in using them, the benefits of DTx are
        often unclear. An unsupported rollout also risks widening health inequalities.
      </p>
      <p>
        <Link
          href="https://www.kingsfund.org.uk/insight-and-analysis/long-reads/digital-exclusion-inclusion-health-care"
          className="nhsuk-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more from The King&apos;s Fund: Moving from digital exclusion to inclusion in digital health and care
          (opens in a new tab)
        </Link>
      </p>

      <DoDontList
        title="Do"
        type="tick"
        items={[
          'make the digital tool part of an existing care pathway',
          'give one named clinician charge of the whole pathway',
          'place the most support where the need is greatest',
        ]}
      />

      <DoDontList
        title="Do not"
        type="cross"
        items={[
          'refer a DTx to a patient without offering ongoing support',
          'leave it unclear as to who is responsible for safety',
          'assume a digital-only service is accessible to everyone',
        ]}
      />
    </GuidanceArticle>
  )
}
