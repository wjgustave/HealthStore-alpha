import { GuidanceArticle } from '@/components/resources/GuidanceArticle'

export const metadata = {
  title: 'Alignment with The NHS 10-Year Health Plan — NHS HealthStore',
}

export default function Nhs10YearHealthPlanPage() {
  return (
    <GuidanceArticle title="Alignment with The NHS 10-Year Health Plan">
      <p>
        The NHS HealthStore is named in The NHS 10-Year Health Plan. Scaling digital therapeutics (DTx) is part of a
        wider NHS move towards digital-first, pathway-led care and will help support a shift from:
      </p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>sickness to prevention</li>
        <li>analogue to digital</li>
        <li>hospital to community</li>
      </ul>
      <p>From sickness to prevention focuses on catching illnesses early.</p>
      <p>From analogue to digital uses apps and data to put patients in control of their health.</p>
      <p>From hospital to community moves care from big buildings to local hubs near your home.</p>
      <p>
        In addition to improving patient outcomes, DTx will be a major contributor to system productivity, workforce
        sustainability, and operational performance.
      </p>
    </GuidanceArticle>
  )
}
