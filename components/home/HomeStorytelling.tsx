import Link from 'next/link'
import Image from 'next/image'
import { ProcessSteps } from '@/components/storytelling'

const WHAT_WE_DO = [
  {
    title: 'Assurance and certification',
    body: 'Each product is reviewed against clinical safety, information governance, interoperability and evidence standards — national assurance that underpins your local due diligence.',
  },
  {
    title: 'Opportunity identification',
    body: 'We learn of the local, unmet needs from published population data — QOF registers, secondary care activity and waiting lists — helping you address priority unmet needs.',
  },
  {
    title: 'Procurement and commercial support',
    body: 'We provide Buyer Packs and commercial route notes, and standard terms and pricing transparency reduces procurement lead time from months to weeks.',
  },
  {
    title: 'Deployment and implementation',
    body: 'Each product comes with an implementation manual that guides the integration process and offers supplier support.',
  },
  {
    title: 'Performance and benefit tracking',
    body: 'Once live, your workspace shows coverage, activation, retention and outcomes, benchmarked against peer deployments and categorised using an evidential basis.',
  },
  {
    title: 'Ongoing support to improve',
    body: 'Underperforming deployments are brought to your attention with actionable recommendations so that invitation, registration, and engagement continue to improve.',
  },
]

const HOW_IT_WORKS = [
  {
    title: 'Discover the keys to success',
    description: (
      <>
        Eligible cohorts, coverage gaps, admission volumes and modelled impact ranges — all sourced and dated.
        {/* NHS action link [Provenance: NHS — service-manual.nhs.uk/design-system/components/action-link] */}
        <span className="block mt-3">
          <Link className="nhsuk-action-link__link" href="#">
            <svg
              className="nhsuk-icon nhsuk-icon__arrow-right-circle"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              focusable="false"
              aria-hidden="true"
            >
              <path d="M12 2a10 10 0 0 0-10 9h11.7l-4-4a1 1 0 0 1 1.5-1.4l5.6 5.7a1 1 0 0 1 0 1.4l-5.6 5.7a1 1 0 0 1-1.5 0 1 1 0 0 1 0-1.4l4-4H2A10 10 0 1 0 12 2z" />
            </svg>
            <span className="nhsuk-action-link__text">Digital commissioning toolkits</span>
          </Link>
        </span>
      </>
    ),
    media: <Image src="/images/how-it-works-step-1.png" alt="" width={1024} height={829} className="hs-step__img" />,
  },
  {
    title: 'Explore and compare assured products',
    description: 'Side-by-side comparison of products for your pathway: evidence, service model, cost, implementation burden and route to buy.',
    media: <Image src="/images/how-it-works-step-2.png" alt="" width={1024} height={829} className="hs-step__img" />,
  },
  {
    title: 'Get support to commission',
    description: 'We’ll manage buyer materials, supplier introductions and governance guidance.',
    media: <Image src="/images/how-it-works-step-3.png" alt="" width={1021} height={880} className="hs-step__img" />,
  },
  {
    title: 'Track outcomes and improve',
    description: 'We’ll ensure your workspace shows deployment performance, peer benchmarks and benefit accrual, with alerts when something needs attention.',
    media: <Image src="/images/how-it-works-step-4.png" alt="" width={1024} height={829} className="hs-step__img" />,
  },
]

const PATHWAYS = [
  { href: '/product-catalogue/digital-therapeutics?condition=copd', title: 'COPD and pulmonary rehab', detail: 'Remote monitoring and self-management', tags: ['NICE HTG736', 'NICE HTG718'] },
  { href: '/product-catalogue/digital-therapeutics?condition=cardiac_rehab', title: 'Cardiac rehabilitation', detail: 'Digital post-event rehab programme', tags: ['NICE HTG761'] },
]

/**
 * Storytelling intro for the public home — adopts matt_demo's proposition layout
 * (what we do / how it works / pathways) rendered through the NHS-tokenised
 * storytelling classes and the ProcessSteps gap component.
 */
export function HomeStorytelling() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-14">
        <section className="hs-section">
          <h2 className="hs-section-title" style={{ fontSize: 'var(--text-section)' }}>What the NHS HealthStore addresses</h2>
          <p className="hs-section-note" style={{ fontSize: 'var(--text-body)' }}>
            It reduces the burden on local teams by doing nationally what would otherwise be repeated at every Integrated
            Care Board (ICB). Commissioners retain all commissioning, clinical safety and deployment accountability.
          </p>
          <div className="hs-card-grid">
            {WHAT_WE_DO.map((item) => (
              <div key={item.title} className="hs-card" style={{ borderRadius: 'var(--radius-card)' }}>
                <h3 style={{ fontSize: 'var(--text-section-alt)' }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--text-body)' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="hs-section bg-white py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="hs-section-title" style={{ fontSize: 'var(--text-section)' }}>How it works</h2>
          <ProcessSteps steps={HOW_IT_WORKS} className="hs-steps-grid--vertical" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-14">
        <section className="hs-section">
          <h2 className="hs-section-title" style={{ fontSize: 'var(--text-section)' }}>Conditions and pathways we currently support</h2>
          <p className="hs-section-note hs-measure">
            Condition pathways with NICE Health Technology Guidance, nationally assured products and full local
            opportunity data.
          </p>
          <div className="hs-supported-pathways">
            {PATHWAYS.map((p) => (
              <Link key={p.href} href={p.href} className="hs-pathway-btn">
                <strong>{p.title}</strong>
                <span>{p.detail}</span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="nhsuk-tag nhsuk-tag--blue">{tag}</span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default HomeStorytelling
