import Link from 'next/link'
import { getHomeCaseStudies } from '@/lib/data'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export default function GuidancePage() {
  const studies = getHomeCaseStudies().slice(0, 3)
  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'Resource library', href: '/resources' }, { label: 'Guidance and evidence' }]} />
      <h1 className="page-title-h1">Guidance and evidence</h1>
      <p className="hs-measure" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 40 }}>
        Methods, evidence standards, buyer guidance and programme updates.
      </p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 12 }}>Evidence standards</h2>
        <div className="hs-card-grid">
          <div className="hs-card">
            <h3>Observed operational</h3>
            <p>Data from live NHS deployments with named geography and date.</p>
          </div>
          <div className="hs-card">
            <h3>Evaluated outcome</h3>
            <p>Published or peer-reviewed evaluation with study design and comparator.</p>
          </div>
          <div className="hs-card">
            <h3>Modelled economic</h3>
            <p>Indicative figures from scenario models — assumptions visible, not guaranteed.</p>
          </div>
          <div className="hs-card">
            <h3>Strategic qualitative</h3>
            <p>Expert consensus or policy alignment without quantitative evidence.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40, borderTop: '1px solid #d8dde0', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 16 }}>Case studies</h2>
        <div className="hs-card-grid">
          {studies.map((s) => (
            <Link key={s.id} href={s.href} style={{ textDecoration: 'none' }}>
              <div className="hs-card" style={{ cursor: 'pointer' }}>
                <h3 style={{ color: '#005eb8' }}>{s.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <Link href="/resources/case-studies" style={{ color: '#005eb8' }}>View all case studies</Link>
          {' · '}
          <Link href="/resources/news" style={{ color: '#005eb8' }}>News</Link>
        </p>
      </section>
    </div>
  )
}
