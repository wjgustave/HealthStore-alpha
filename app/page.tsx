import Link from 'next/link'
import { getAllApps, getDashboardContent } from '@/lib/data'
import { EvidenceBadge, MaturityBadge, DtacBadge, EffortBadge } from '@/components/Badges'

export default function HomePage() {
  const apps = getAllApps()
  const dash = getDashboardContent()

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #003087 0%, #005EB8 60%, #0072CE 100%)' }}>
        <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: 680 }}>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
              Prototype — March 2026
            </div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.8rem', lineHeight: 1.15, fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              {dash.hero.headline}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {dash.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/apps" className="px-6 py-3 rounded-lg text-sm font-semibold"
                style={{ background: '#fff', color: '#003087' }}>
                Browse all apps
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#003087' }}>
        <div className="max-w-7xl mx-auto px-6 py-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
          {[
            { value: '4', label: 'COPD apps', sub: 'all NICE HTE19 recommended' },
            { value: 'HTE19', label: 'NICE guidance', sub: 'HTG736 — December 2024' },
            { value: '3yr', label: 'Evidence generation', sub: 'ending ~December 2027' },
            { value: '2026', label: 'Last reviewed', sub: 'March 2026' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{s.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">

        {/* NICE context box */}
        <div className="rounded-xl border mt-12 mb-10 p-5" style={{ borderColor: '#005EB8', background: '#E6F0FB' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#003087', marginBottom: 4 }}>
                NICE Health Technology Evaluation HTE19 (HTG736) — COPD digital therapeutics
              </div>
              <p style={{ fontSize: '0.8rem', color: '#003087', lineHeight: 1.6, margin: 0 }}>
                Published December 2024, updated September 2025. All four apps below are recommended for NHS use during a 3-year evidence generation period. Commissioning organisations must: (1) confirm DTAC approval, (2) have evidence generation agreements with NICE, and (3) submit annual reports to NICE.
              </p>
            </div>
            <a href="https://www.nice.org.uk/guidance/htg736" target="_blank" rel="noreferrer"
              className="badge badge-blue" style={{ whiteSpace: 'nowrap', flexShrink: 0, fontSize: 12 }}>
              NICE HTG736 ↗
            </a>
          </div>
        </div>

        {/* App cards */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            NICE HTE19 — COPD digital therapeutics
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Four apps recommended under HTG736. Select any app for the full commissioner assessment including clinical evidence, assurance, deployment footprint and commercial information.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem', marginBottom: '4rem' }}>
          {apps.map((app: any) => (
            <Link key={app.id} href={`/apps/${app.slug}`}
              className="app-card rounded-xl bg-white border flex flex-col"
              style={{ borderColor: 'var(--border)', textDecoration: 'none' }}>
              <div style={{ height: 5, background: '#005EB8', borderRadius: '10px 10px 0 0' }} />
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: 2 }}>{app.app_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.supplier_name}</div>
                  </div>
                  {app.nhse_125k_eligible && (
                    <span className="badge badge-green" style={{ flexShrink: 0, fontSize: 10 }}>★ NHSE £125k</span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                  {app.one_line_value_proposition}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 0.75rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Maturity', badge: <MaturityBadge level={app.maturity_level} /> },
                    { label: 'Evidence', badge: <EvidenceBadge strength={app.evidence_strength} /> },
                    { label: 'Local effort', badge: <EffortBadge level={app.local_wraparound} /> },
                    { label: 'DTAC', badge: <DtacBadge status={app.dtac_status} /> },
                  ].map(({ label, badge }) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
                      {badge}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg py-2 text-sm font-semibold text-center"
                  style={{ background: '#005EB8', color: '#fff' }}>
                  View full assessment →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Impact section */}
        <section className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg,#003087,#00449E)', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Real-world impact, not just theory
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
            Key metrics from NHS deployments — caveats noted on each app page.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { metric: '6,000', unit: 'COPD patients', detail: 'enrolled in NWL ICS remote monitoring — 12 months ahead of target', slug: 'luscii' },
              { metric: '100%', unit: 'of Welsh GP practices', detail: 'using COPDhub — 20,303 tonnes CO₂ reduction from inhaler prescribing shift', slug: 'copdhub' },
              { metric: '67.5%', unit: 'admission reduction', detail: 'in Leicester COPD programme with Clinitouch (observational, COI declared)', slug: 'clinitouch' },
              { metric: '£86k', unit: 'per-ICB saving modelled', detail: 'by NICE MTG68 EAG for myCOPD in AECOPD pathway (CCG-era model)', slug: 'mycopd' },
            ].map(ex => (
              <Link key={ex.slug} href={`/apps/${ex.slug}`}
                style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '1rem', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{ex.metric}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{ex.unit}</div>
                <div style={{ fontSize: '0.72rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)' }}>{ex.detail}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--border)', background: '#F7F9FC', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>About this prototype: </strong>
            {dash.about_note}
          </p>
        </div>

      </div>
    </div>
  )
}
