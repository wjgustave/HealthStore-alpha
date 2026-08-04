import { PageBreadcrumb } from '@/components/PageBreadcrumb'

const h2Style = {
  fontSize: 'var(--text-section-alt)',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.375,
  marginBottom: 12,
} as const

export default function AboutPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'How it works' }]} />
      <h1 className="page-title-h1">How the NHS HealthStore helps</h1>
      <p className="hs-measure" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 40 }}>
        A nationally governed assurance and commercial-readiness layer with local commissioning accountability.
      </p>

      <div className="hs-measure" style={{ display: 'grid', gap: 32 }}>
        <section>
          <h2 style={h2Style}>Assurance Pack</h2>
          <p style={{ lineHeight: 1.6 }}>Evidence, device regulation, IG assessment — maintained centrally so you don&apos;t duplicate work.</p>
        </section>
        <section>
          <h2 style={h2Style}>Accountability stays local</h2>
          <p style={{ lineHeight: 1.6 }}>Clinical safety, procurement, deployment and governance remain your responsibility.</p>
        </section>
        <section>
          <h2 style={h2Style}>Impact modelling</h2>
          <p style={{ lineHeight: 1.6 }}>Pathway fit with visible assumptions — conservative, central and evidence-led scenarios.</p>
        </section>
        <section>
          <h2 style={h2Style}>Commercial route</h2>
          <p style={{ lineHeight: 1.6 }}>Buyer documentation, supplier conversations under clear roles, framework guidance.</p>
        </section>
      </div>

      <section className="hs-measure" style={{ marginTop: 32 }}>
        <h2 style={h2Style}>What we broker</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 8, lineHeight: 1.6 }}>Pathway fit and impact modelling with visible assumptions</li>
          <li style={{ marginBottom: 8, lineHeight: 1.6 }}>Commercial route guidance and buyer documentation</li>
          <li style={{ marginBottom: 8, lineHeight: 1.6 }}>Supplier conversations under clear roles</li>
          <li style={{ lineHeight: 1.6 }}>Mobilisation and evaluation design support</li>
        </ul>
      </section>
    </div>
  )
}
