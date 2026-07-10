import Link from 'next/link'
import { ProcessSteps } from '@/components/storytelling'

const WHAT_WE_DO = [
  {
    title: 'Assurance and certification',
    body: 'We review each product against clinical safety, information governance, interoperability and evidence standards — a national assurance passport that underpins your local due diligence.',
  },
  {
    title: 'Opportunity identification',
    body: 'We derive local unmet need from published population data — QOF registers, secondary care activity and waiting lists — so you can see where the addressable gap is largest.',
  },
  {
    title: 'Procurement and commercial support',
    body: 'Buyer packs, commercial route notes, standard terms and pricing transparency to reduce procurement lead time from months to weeks.',
  },
  {
    title: 'Deployment and implementation',
    body: 'Every product ships with an implementation playbook — site readiness, the clinical wrapper, IT integration steps and the supplier support available.',
  },
  {
    title: 'Performance and benefit tracking',
    body: 'Once live, your workspace shows coverage, activation, retention and outcomes, benchmarked against peer deployments and categorised by evidential basis.',
  },
  {
    title: 'Ongoing support to improve',
    body: 'Underperforming deployments are flagged with actionable recommendations so invitation, registration and engagement keep improving.',
  },
]

const HOW_IT_WORKS = [
  { title: 'Tell us your area and problem', description: 'A few questions about your geography and service pressure. We derive the population data — you never enter numbers.' },
  { title: 'See the local opportunity', description: 'Eligible cohorts, coverage gaps, admission volumes and modelled impact ranges — all sourced and dated.' },
  { title: 'Compare assured products', description: 'Side-by-side comparison of products for your pathway: evidence, service model, cost, implementation burden and route to buy.' },
  { title: 'Get support to commission', description: 'Buyer materials, supplier introductions and governance guidance. You sign the contract — we make it easier to get there.' },
  { title: 'Track outcomes and improve', description: 'Your workspace shows deployment performance, peer benchmarks and benefit accrual, with alerts when something needs attention.' },
]

const PATHWAYS = [
  { href: '/apps/condition-catalogue?condition=copd', title: 'COPD and respiratory', detail: 'Remote monitoring and self-management', tag: 'NICE HTG736' },
  { href: '/apps/condition-catalogue?condition=cardiac_rehab', title: 'Cardiac rehabilitation', detail: 'Digital post-event rehab programme', tag: 'NICE HTG7' },
  { href: '/apps/condition-catalogue?condition=msk', title: 'MSK and lower back pain', detail: 'Self-management for uncomplicated LBP', tag: 'NICE HTG' },
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
          <h2 className="hs-section-title">What HealthStore does</h2>
          <p className="hs-section-note hs-measure">
            We reduce the burden on local teams by doing nationally what would otherwise be repeated at every ICB. You
            retain all commissioning, clinical safety and deployment accountability.
          </p>
          <div className="hs-card-grid">
            {WHAT_WE_DO.map((item) => (
              <div key={item.title} className="hs-card" style={{ borderLeft: '4px solid var(--nhs-blue)' }}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="hs-section bg-white py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="hs-section-title">How it works</h2>
          <ProcessSteps steps={HOW_IT_WORKS} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-14">
        <section className="hs-section">
          <h2 className="hs-section-title">Pathways we support today</h2>
          <p className="hs-section-note hs-measure">
            Condition pathways with NICE Health Technology Guidance, nationally assured products and full local
            opportunity data.
          </p>
          <div className="hs-supported-pathways">
            {PATHWAYS.map((p) => (
              <Link key={p.href} href={p.href} className="hs-pathway-btn">
                <strong>{p.title}</strong>
                <span>{p.detail}</span>
                <span className="nhsuk-tag nhsuk-tag--blue mt-1 self-start">{p.tag}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default HomeStorytelling
