import Link from 'next/link'

export default function ServiceHomePage() {
  return (
    <div className="hs-page">
      {/* Hero */}
      <section className="hs-hero-visual">
        <div style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.2, margin: '0 0 16px', color: '#212b32' }}>
            Commission digital therapeutics with confidence
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#4c6272', lineHeight: 1.7, margin: '0 0 24px' }}>
            HealthStore supports NHS commissioners and clinical leads through the full lifecycle of a digital therapeutic —
            from identifying local unmet need, through procurement and deployment, to measuring real-world outcomes.
          </p>
          <div className="hs-hero-actions">
            <Link href="/start/role" className="hs-btn hs-btn-primary">Explore opportunities in my area</Link>
            <Link href="/products" className="hs-btn hs-btn-secondary">Browse assured products</Link>
          </div>
        </div>
      </section>

      {/* What HealthStore does — the proposition */}
      <section className="hs-section">
        <h2 className="hs-section-title">What HealthStore does</h2>
        <p style={{ fontSize: 15, color: '#4c6272', maxWidth: 680, lineHeight: 1.7, marginBottom: 24 }}>
          We reduce the burden on local teams by doing nationally what would otherwise be repeated at every ICB.
          You retain all commissioning, clinical safety and deployment accountability.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
            <h3>Assurance and certification</h3>
            <p>We review each product against clinical safety, information governance, interoperability and evidence standards. You get a national assurance passport — not a recommendation, but a foundation for your local due diligence. DTAC compliance, clinical safety case summaries and DPIAs are available to verified buyers.</p>
          </div>
          <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
            <h3>Opportunity identification</h3>
            <p>We derive local unmet need from published population data — QOF registers, secondary care activity, waiting lists. You see where the addressable gap is largest and which pathways have assured products ready to deploy.</p>
          </div>
          <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
            <h3>Procurement and commercial support</h3>
            <p>Buyer packs, commercial route notes, standard terms and pricing transparency. Whether you use a framework or direct award, HealthStore provides the materials to reduce procurement lead time from months to weeks.</p>
          </div>
          <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
            <h3>Deployment and implementation</h3>
            <p>Each product comes with an implementation playbook — what needs to happen at site, the clinical wrapper required, IT integration steps and the human support the supplier provides. We broker introductions and track mobilisation progress.</p>
          </div>
          <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
            <h3>Performance and benefit tracking</h3>
            <p>Once live, your workspace shows coverage, activation, retention and outcomes — benchmarked against peer deployments nationally. Benefits are categorised by evidential basis so you can report accurately to your board.</p>
          </div>
          <div className="hs-card" style={{ borderLeft: '4px solid #005eb8' }}>
            <h3>Ongoing support to improve</h3>
            <p>Deployments that underperform get flagged with actionable recommendations. Our team works with you and the supplier to improve invitation processes, registration rates and clinical engagement — the things that make or break a deployment.</p>
          </div>
        </div>
      </section>

      {/* How the journey works */}
      <section className="hs-section">
        <h2 className="hs-section-title">How it works</h2>
        <div className="hs-steps-grid">
          <div className="hs-step">
            <div className="hs-step-num">1</div>
            <h3>Tell us your area and problem</h3>
            <p>Four questions about your geography and the service pressure you face. We derive the population data — you never need to enter numbers.</p>
          </div>
          <div className="hs-step">
            <div className="hs-step-num">2</div>
            <h3>See the local opportunity</h3>
            <p>Eligible cohorts, current coverage gaps, emergency admission volumes and modelled impact ranges — all sourced and dated.</p>
          </div>
          <div className="hs-step">
            <div className="hs-step-num">3</div>
            <h3>Compare assured products</h3>
            <p>Side-by-side comparison of products that address your pathway: evidence, service model, cost, implementation burden and route to buy.</p>
          </div>
          <div className="hs-step">
            <div className="hs-step-num">4</div>
            <h3>Get support to commission</h3>
            <p>Our commissioning team provides buyer materials, introductions and guides you through governance. You sign the contract — we make it easier to get there.</p>
          </div>
          <div className="hs-step">
            <div className="hs-step-num">5</div>
            <h3>Track outcomes and improve</h3>
            <p>Your workspace shows deployment performance, peer benchmarks and benefit accrual. Actionable alerts when something needs attention.</p>
          </div>
        </div>
      </section>

      {/* Supported pathways — just the 3, as buttons */}
      <section className="hs-section">
        <h2 className="hs-section-title">Pathways we support today</h2>
        <p style={{ fontSize: 15, color: '#4c6272', maxWidth: 640, lineHeight: 1.7, marginBottom: 24 }}>
          Three condition pathways with NICE Health Technology Guidance, nationally assured products and full local opportunity data.
        </p>

        <div className="hs-supported-pathways">
          <Link href="/products/condition-catalogue?condition=copd" className="hs-pathway-btn" style={{ borderColor: '#005eb8' }}>
            <strong>COPD and respiratory</strong>
            <span>Remote monitoring and self-management</span>
            <span className="hs-tag hs-tag-blue">NICE HTG736</span>
          </Link>
          <Link href="/products/condition-catalogue?condition=cardiac_rehab" className="hs-pathway-btn" style={{ borderColor: '#7C2855' }}>
            <strong>Cardiac rehabilitation</strong>
            <span>Digital post-event rehab programme</span>
            <span className="hs-tag hs-tag-blue">NICE HTG7</span>
          </Link>
          <Link href="/products/condition-catalogue?condition=msk_back_pain" className="hs-pathway-btn" style={{ borderColor: '#330072' }}>
            <strong>MSK and lower back pain</strong>
            <span>Self-management for uncomplicated LBP</span>
            <span className="hs-tag hs-tag-blue">NICE HTG</span>
          </Link>
        </div>

        <p style={{ fontSize: 14, color: '#768692', marginTop: 16 }}>
          Additional pathways (insomnia, diabetes, mental health, hypertension) are on our roadmap as evidence and supplier readiness confirm.
        </p>
      </section>

      {/* CTA — no contradictory text */}
      <section className="hs-section" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <h2 className="hs-section-title" style={{ marginBottom: 12 }}>Ready to see what could work in your area?</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/start/role" className="hs-btn hs-btn-primary">Start exploring</Link>
          <Link href="/login" className="hs-btn hs-btn-secondary">Sign in to workspace</Link>
        </div>
      </section>
    </div>
  )
}
