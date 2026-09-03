import Image from 'next/image'
import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PREPARING_SECTION } from '../section'

export const metadata = { title: 'Using NHS HealthStore — NHS HealthStore' }

export default function UsingNhsHealthstorePage() {
  return (
    <GuidanceArticle title="Using NHS HealthStore" section={PREPARING_SECTION}>
      <h2>Start using NHS HealthStore</h2>
      <p>
        Your commissioning organisation will inform you when it joins The NHS HealthStore. You may be part of clinical
        conversations around what to commission and why.
      </p>
      <p>
        Once a digital therapeutic (DTx) has been commissioned via The NHS HealthStore, the commissioning organisation
        will tell you what DTx has been commissioned and when it will become available. We will provide guidance to help
        you integrate into the service.
      </p>

      <h2>A simplified NHS HealthStore workflow</h2>
      <p>There are five main components that make up The NHS HealthStore service flow; they are the:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>commissioner</li>
        <li>NHS HealthStore service</li>
        <li>clinical setting</li>
        <li>NHS App</li>
        <li>digital therapeutic (DTx) app</li>
      </ul>
      <p>This diagram shows how the entities relate throughout the journey, from commissioning to prescribing.</p>
      <figure style={{ margin: '0 0 var(--space-5)' }}>
        <Image
          src="/images/healthstore-workflow-simplified.png"
          alt="Six stages in order. Commissioning body: procures a digital therapeutic via HealthStore Service. Primary or secondary care: agrees or adopts a clinical pathway for administering the digital therapeutic. Primary or secondary care: prescribes the digital therapeutic via their electronic health record using a DM+D drop down. HealthStore Service: receives the prescription and triggers an NHS App message. Patient's NHS App: notifies the patient and invites them to onboard. Digital therapeutic app: the patient downloads it and creates an account via NHS Login."
          width={901}
          height={243}
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ width: '100%', height: 'auto' }}
        />
        <figcaption style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
          Simplified workflow showing the different organisations involved in prescribing a DTx.
        </figcaption>
      </figure>

      <h3>Example workflow: COPD annual review</h3>
      <p>This diagram shows a referral to a COPD DTx taking place at annual review.</p>

      <h3>Example workflow: referral via cohorting</h3>
      <p>
        This diagram shows a referral to a COPD DTx taking place via a population health management or cohorting route.
      </p>

      <h2>Clinical and information governance</h2>

      <h3>Exemplar pathways</h3>
      <p>
        The NHS HealthStore has worked with clinical bodies and the Getting It Right First Time (GIRFT) group to develop
        exemplar GIRFT pathways when using The NHS HealthStore. Following these pathways is strongly advised but is not
        mandatory.
      </p>

      <h3>Clear clinical lead</h3>
      <p>Each pathway will need its own clinical lead.</p>

      <h3>Information governance</h3>
      <p>
        Clinical pathways will be subject to the normal information governance rules. Your organisation may, however,
        benefit from umbrella legal and data-sharing agreements established between the commissioner and The NHS
        HealthStore as part of its participation in the service.
      </p>
    </GuidanceArticle>
  )
}
