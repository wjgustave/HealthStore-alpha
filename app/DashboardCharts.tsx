'use client'

const maturityLabels: Record<string, string> = {
  scaled: 'Scaled', multi_site_live: 'Multi-site live', limited_live: 'Limited live', pilot: 'Pilot',
}
const maturityColours: Record<string, string> = {
  scaled: '#007F3B', multi_site_live: '#005EB8', limited_live: '#D5840D', pilot: '#768692',
}

type ChartApp = {
  maturity_level?: string
  nice_guidance_refs?: unknown[]
  condition_tags?: string[]
}

interface Props {
  apps: ChartApp[]
  conditions: { id: string; label: string; colour: string; count: number }[]
  /** When true, omit the section title and intro (e.g. when wrapped by Dataset overview on the home page). */
  hideOuterHeading?: boolean
  /** When true, omit the NICE guidance coverage panel (concept home V2). */
  hideNiceGuidance?: boolean
}

export default function DashboardCharts({ apps, conditions, hideOuterHeading, hideNiceGuidance }: Props) {
  const maturityCounts: Record<string, number> = {}
  const niceCoverage = { withNice: 0, withoutNice: 0 }

  apps.forEach(app => {
    const m = app.maturity_level ?? 'unknown'
    maturityCounts[m] = (maturityCounts[m] ?? 0) + 1
    if (app.nice_guidance_refs?.length > 0) niceCoverage.withNice++
    else niceCoverage.withoutNice++
  })

  const maxMaturity = Math.max(...Object.values(maturityCounts), 1)
  const nicePercent = Math.round((niceCoverage.withNice / apps.length) * 100)

  return (
    <section className={hideOuterHeading ? 'mb-0' : 'mb-10'}>
      {!hideOuterHeading && (
        <>
          <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Dataset overview
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Summary of the {apps.length} apps currently in the catalogue.
          </p>
        </>
      )}

      <div className={`grid gap-5 ${hideNiceGuidance ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {/* Condition distribution */}
        <div className="hs-surface-card rounded-xl bg-white border p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="font-bold uppercase tracking-wide mb-4" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
            By condition area
          </div>
          <div className="space-y-3">
            {conditions.map(c => (
              <div key={c.id}>
                <div className="flex justify-between mb-1" style={{ fontSize: 'var(--text-label)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{c.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{c.count}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#F0F2F5' }}>
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(c.count / apps.length) * 100}%`, background: c.colour, minWidth: c.count > 0 ? 8 : 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maturity breakdown */}
        <div className="hs-surface-card rounded-xl bg-white border p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="font-bold uppercase tracking-wide mb-4" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
            By maturity level
          </div>
          <div className="space-y-3">
            {Object.entries(maturityCounts).map(([level, count]) => (
              <div key={level}>
                <div className="flex justify-between mb-1" style={{ fontSize: 'var(--text-label)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {maturityLabels[level] ?? level}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#F0F2F5' }}>
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(count / maxMaturity) * 100}%`, background: maturityColours[level] ?? '#768692' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {!hideNiceGuidance && (
          <div className="hs-surface-card rounded-xl bg-white border p-5" style={{ borderColor: 'var(--border)' }}>
            <div className="font-bold uppercase tracking-wide mb-4" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
              NICE guidance coverage
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="relative" style={{ width: 120, height: 120 }}>
                <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#F0F2F5" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#330072" strokeWidth="12"
                    strokeDasharray={`${(nicePercent / 100) * 314} 314`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {nicePercent}%
                  </div>
                  <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>with NICE</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2" style={{ fontSize: 'var(--text-label)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#330072' }} />
                <span style={{ color: 'var(--text-secondary)' }}>NICE referenced ({niceCoverage.withNice})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F0F2F5' }} />
                <span style={{ color: 'var(--text-muted)' }}>No NICE ref ({niceCoverage.withoutNice})</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
