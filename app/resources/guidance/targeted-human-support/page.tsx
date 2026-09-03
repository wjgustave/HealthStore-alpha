import { DoDontList, GuidanceArticle } from '@/components/resources/GuidanceArticle'

export const metadata = {
  title: 'Using targeted human support to enable digital inclusion — NHS HealthStore',
}

export default function TargetedHumanSupportPage() {
  return (
    <GuidanceArticle title="Using targeted human support to enable digital inclusion">
      <p>
        The Roxton Practice, a large National Health Service (NHS) general practitioner (GP) practice, offers multiple
        ways to access digital therapeutics (DTx), recognising that no single digital route suits everyone.
      </p>
      <p>
        The practice learned that electronic devices fixed to waiting room walls were ineffective, and people who needed
        help did not come forward. What did work was combining technology with human-to-human support.
      </p>
      <p>
        People can use their own phone or computer to access care and share their data. Or they can use a community
        computer or a device at a GP surgery, library, pharmacy or workplace, with someone on hand to help. People move
        between these environments as their needs change.
      </p>
      <p>
        The practice trained helpers and volunteer support workers (sometimes called Care Connectors or Care Navigators)
        to support patients in locations they already visit. They can help patients set up the NHS App, which they can
        use to track their long-term health condition and submit readings.
      </p>
      <p>
        The practice found that using non-clinical staff to assist people with technology in the waiting areas has huge
        benefits. The practice is now considering how to reorganise its lobby areas to offer more rooms for private
        one-to-one digital support.
      </p>

      <DoDontList
        title="Do"
        type="tick"
        items={[
          'offer high-tech, low-tech and ‘no-tech’ ways to use the same service',
          'place trained helpers in locations where people already go, like libraries',
          'let people move between environments as their needs change',
        ]}
      />

      <DoDontList
        title="Don't"
        type="cross"
        items={[
          'assume people have an electronic device, data or confidence',
          'leave technology in public places with no one to help',
          'assume a digital-first rollout of DTx reaches those who need care most',
        ]}
      />
    </GuidanceArticle>
  )
}
