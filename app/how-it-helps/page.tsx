import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export default function HowItHelpsPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'How it works' }]} />
      <h1 className="page-title-h1">How the NHS HealthStore helps</h1>
      <p className="hs-measure" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 40 }}>
        A nationally governed assurance and commercial-readiness layer with local commissioning accountability.
      </p>

      <div className="hs-card-grid">
        <div className="hs-card">
          <h3>Assurance Pack</h3>
          <p>Evidence, device regulation, IG assessment — maintained centrally so you don&apos;t duplicate work.</p>
        </div>
        <div className="hs-card">
          <h3>Accountability stays local</h3>
          <p>Clinical safety, procurement, deployment and governance remain your responsibility.</p>
        </div>
        <div className="hs-card">
          <h3>Impact modelling</h3>
          <p>Pathway fit with visible assumptions — conservative, central and evidence-led scenarios.</p>
        </div>
        <div className="hs-card">
          <h3>Commercial route</h3>
          <p>Buyer documentation, supplier conversations under clear roles, framework guidance.</p>
        </div>
      </div>

      <section style={{ marginTop: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 12 }}>What we broker</h2>
        <div style={{ background: '#f0f4f5', borderRadius: 8, padding: 20 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8, lineHeight: 1.6 }}>Pathway fit and impact modelling with visible assumptions</li>
            <li style={{ marginBottom: 8, lineHeight: 1.6 }}>Commercial route guidance and buyer documentation</li>
            <li style={{ marginBottom: 8, lineHeight: 1.6 }}>Supplier conversations under clear roles</li>
            <li style={{ lineHeight: 1.6 }}>Mobilisation and evaluation design support</li>
          </ul>
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 32, borderTop: '1px solid #d8dde0' }}>
        <Link href="/start" className="hs-btn hs-btn-primary">Explore what could help my area</Link>
      </div>
    </div>
  )
}
