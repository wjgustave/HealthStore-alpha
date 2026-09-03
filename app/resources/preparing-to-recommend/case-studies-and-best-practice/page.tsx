import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PREPARING_SECTION } from '../section'

export const metadata = { title: 'Case studies and best practice — NHS HealthStore' }

export default function CaseStudiesAndBestPracticePage() {
  return (
    <GuidanceArticle title="Case studies and best practice" section={PREPARING_SECTION}>
      <p>
        The following case studies show what successful digital therapeutics (DTx) deployment looks like in practice.
      </p>
      <p>
        These case studies draw on examples from Roxton Practice in North East Lincolnshire, Airedale NHS Foundation
        Trust in West Yorkshire and the Cornwall and Scilly Integrated Care Board (ICB). The case studies provide
        information to help you understand which positive actions contributed to good outcomes for patients and clinical
        teams.
      </p>
    </GuidanceArticle>
  )
}
