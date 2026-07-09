import Link from 'next/link'
import type { App } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import type { CommissionerContext } from '@/lib/context/types'
import { contextToSearchParams } from '@/lib/context/types'
import { getLocalReferenceData } from '@/lib/localData/referenceData'
import { getDtxImpactRanges } from '@/lib/localData/workspaceData'
import { PdpSection } from '@/components/PdpSection'
import { IndicativeFinancialContextSection } from '@/components/AppDetailSections'
import { HorizontalBarChart, InsightCallout } from '@/components/charts'

/**
 * Round 2 content migration (quantified value) — Luscii pilot.
 *
 * Confirmed decisions (see /DS/Audits/Luscii-Content-Mig-3):
 *  - R2-1: personalisation via the guided-start context (cookie/URL) + a "Change area" line.
 *  - R2-2: projected impact = high-risk monitored cohort x a conservative->evidence-led range.
 *  - R2-3: ROI runs on a labelled illustrative 500-patient default (not yet funnel-derived).
 *  - R2-4: ROI net shown as a price-band range (price still unverified since Round 1).
 *  - R2-5: context-gated — full sections once an area is set; a teaser + CTA on the national baseline.
 *  - R2-6: minimal charts — horizontal bars + KPI tiles + a "so what" callout.
 *
 * All figures are illustrative prototype data and labelled as such. No verified price is published.
 */

// R2-2 projected-impact model (illustrative)
const MONITORED_SHARE = 0.5 // of the high-risk cohort
const HIGH_RISK_EVENT_RATE = 0.4 // emergency events per high-risk patient / year (illustrative)

// R2-3 ROI runs on a fixed illustrative cohort this round
const ROI_COHORT = 500
const ROI_ADM_RATE = 0.2
const ROI_AE_RATE = 0.25
const ROI_ADM_EFFECT = 0.4 // central
const ROI_AE_EFFECT = 0.25 // central
const ADMISSION_COST = 2655
const AE_COST = 273
const CAPACITY_TO_CASH = 0.4

// R2-4 price band (per patient / year) — spans the two unreconciled Round 1 figures
const PRICE_LOW = 110
const PRICE_HIGH = 360

// When no area is set, project onto a representative example ICB (labelled) so the
// sections still deliver value without setup. West Yorkshire keeps parity with the
// worked example in the migration audit record.
const DEMO_CONTEXT: CommissionerContext = {
  geography_type: 'icb',
  geography_id: 'QWO',
  geography_label: 'West Yorkshire ICB',
  scenario_id: 'central',
}

function formatGbp(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}£${(abs / 1_000_000).toFixed(1)}m`
  if (abs >= 1_000) return `${sign}£${Math.round(abs / 1_000)}k`
  return `${sign}£${abs.toLocaleString()}`
}

function Tile({ value, label, sub, accent }: { value: string; label: string; sub?: string; accent?: string }) {
  return (
    <div className="hs-surface-card-sm bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
      <div className="hs-font-bold" style={{ fontSize: 'var(--text-card-title)', color: accent ?? 'var(--nhs-blue)' }}>{value}</div>
      <div className="hs-text-caption hs-font-bold uppercase tracking-wide mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      {sub && <div className="hs-text-caption mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</div>}
    </div>
  )
}

export default function PdpLocalValue({
  app,
  context,
}: {
  app: App
  narrative: ProductNarrative
  context: CommissionerContext
}) {
  // Scope guard: the ROI model is COPD-specific (R2-7 A = Luscii only).
  const isCopd = app.condition_tags?.includes('copd')
  if (!isCopd) return null

  const localRef = getLocalReferenceData(context)
  const isLocal = context.geography_type !== 'national' && !!context.geography_id && !!localRef

  // When no area is set we still show fully-worked sections, using a representative
  // example ICB rather than a teaser or the (huge, abstract) national baseline. The
  // block is clearly labelled as an example with a "Set your area" affordance.
  const effectiveContext = isLocal ? context : DEMO_CONTEXT
  const ref = isLocal ? localRef! : getLocalReferenceData(DEMO_CONTEXT)
  if (!ref) return null

  const isExample = !isLocal
  const areaLabel = effectiveContext.geography_label
  const changeHref = `/start/place?${contextToSearchParams(context).toString()}`

  const ranges = getDtxImpactRanges()
  const highRisk = ref.high_risk_cohort ?? Math.round(ref.eligible_cohort * 0.2)
  const monitored = Math.round(highRisk * MONITORED_SHARE)

  // R2-2: high-risk monitored cohort x conservative->evidence-led effect range.
  const admLow = Math.round((monitored * HIGH_RISK_EVENT_RATE * ranges.admission_reduction.conservative) / 100)
  const admHigh = Math.round((monitored * HIGH_RISK_EVENT_RATE * ranges.admission_reduction.evidence_led) / 100)
  const aeLow = Math.round((monitored * HIGH_RISK_EVENT_RATE * ranges.ae_reduction.conservative) / 100)
  const aeHigh = Math.round((monitored * HIGH_RISK_EVENT_RATE * ranges.ae_reduction.evidence_led) / 100)

  // R2-3 / R2-4: illustrative 500-patient ROI, net expressed across a price band.
  const admAvoided = Math.round(ROI_COHORT * ROI_ADM_RATE * ROI_ADM_EFFECT)
  const aeAvoided = Math.round(ROI_COHORT * ROI_AE_RATE * ROI_AE_EFFECT)
  const capacity = admAvoided * ADMISSION_COST + aeAvoided * AE_COST
  const cash = Math.round(capacity * CAPACITY_TO_CASH)
  const costLow = ROI_COHORT * PRICE_LOW
  const costHigh = ROI_COHORT * PRICE_HIGH
  const netLow = capacity - costHigh
  const netHigh = capacity - costLow
  const breakEvenPrice = Math.round(capacity / ROI_COHORT)

  return (
    <div className="mb-6 space-y-4">
      {/* R2-1: context line reusing the guided-start place picker */}
      {isExample ? (
        <div
          className="rounded-lg p-3 hs-text-caption"
          style={{ background: '#FFF9EE', border: '1px solid #FFD37A', color: 'var(--text-secondary)', lineHeight: 1.6 }}
        >
          Example figures for <strong>{areaLabel}</strong> — illustrative, so you can see the shape of the value without any
          setup.{' '}
          <Link href={changeHref} className="hs-font-bold" style={{ color: 'var(--nhs-blue)' }}>Set your area</Link>{' '}
          to project onto your own population.
        </div>
      ) : (
        <p className="hs-text-caption" style={{ color: 'var(--text-muted)', margin: 0 }}>
          Showing projected figures for <strong style={{ color: 'var(--text-secondary)' }}>{areaLabel}</strong>.{' '}
          <Link href={changeHref} style={{ color: 'var(--nhs-blue)' }}>Change area</Link>
        </p>
      )}

      <PdpSection
        id="local-impact"
        shareKey="narrative-projected-impact"
        title={isExample ? 'What this could mean for your COPD cohort' : `What this could mean for ${areaLabel}`}
        description="Projections based on published evidence applied to your local eligible population. Not a guarantee — a defensible basis for a business case."
      >
        <HorizontalBarChart
          ariaLabel={`Projected annual events avoided in ${areaLabel}`}
          maxValue={Math.max(admHigh, aeHigh) * 1.25}
          rows={[
            { label: 'Emergency admissions', value: admHigh, displayValue: `${admLow.toLocaleString()}–${admHigh.toLocaleString()} fewer / yr` },
            { label: 'A&E attendances', value: aeHigh, displayValue: `${aeLow.toLocaleString()}–${aeHigh.toLocaleString()} fewer / yr`, color: '#0072ce' },
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <Tile value={monitored.toLocaleString()} label="Monitored cohort" sub={`~50% of ${highRisk.toLocaleString()} high-risk`} />
          <Tile value={`${admLow.toLocaleString()}–${admHigh.toLocaleString()}`} label="Admissions avoided / yr" sub={`vs ${(ref.annual_admissions ?? 0).toLocaleString()} today`} />
          <Tile value={`${aeLow.toLocaleString()}–${aeHigh.toLocaleString()}`} label="A&E avoided / yr" />
        </div>
        <div className="mt-4">
          <InsightCallout variant="good" title="So what does this mean?">
            Monitoring roughly {monitored.toLocaleString()} high-risk patients (about half the high-risk COPD cohort in{' '}
            {areaLabel}) could avoid on the order of {admLow.toLocaleString()}–{admHigh.toLocaleString()} emergency
            admissions a year, against about {(ref.annual_admissions ?? 0).toLocaleString()} today. The range spans conservative
            to evidence-led NHS effect sizes.
          </InsightCallout>
        </div>
      </PdpSection>

      <PdpSection
        id="local-value-worth"
        shareKey="narrative-economics"
        title="What it could be worth"
        description="Illustrative economics for a 500-patient cohort. Cash and capacity are reported separately."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Tile value={formatGbp(capacity)} label="Capacity released / yr" sub="Freed acute beds & clinician time" />
          <Tile value={formatGbp(cash)} label="Cash-releasing / yr" sub="~40% of capacity converted to elective" />
          <Tile
            value={`${formatGbp(netLow)} to ${formatGbp(netHigh)}`}
            label="Net position / yr*"
            sub="*across the indicative price band"
            accent={netLow >= 0 ? '#007f3b' : 'var(--text-secondary)'}
          />
        </div>
        <div className="mt-4">
          <InsightCallout title="Cash vs capacity, and why net is a range">
            Avoided admissions free beds and clinician time first — that is capacity, not cash until you convert it (about 40%
            typically can). The net position is shown as a range because the price is not yet verified: at roughly{' '}
            <strong>{formatGbp(breakEvenPrice)} per patient per year</strong> the pathway breaks even on NHS cost alone; below
            that it is net positive before counting Green Book health and productivity value. Confirm pricing with the supplier
            before using these figures in a business case.
          </InsightCallout>
        </div>
        <p className="mt-3 hs-text-caption" style={{ color: 'var(--text-muted)' }}>
          Illustrative model (v5) &middot; 500-patient cohort &middot; central effect sizes &middot; price band {formatGbp(PRICE_LOW)}&ndash;{formatGbp(PRICE_HIGH)} per patient / year.
        </p>

        <details className="mt-4">
          <summary style={{ cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--nhs-blue)', fontWeight: 700 }}>
            Show indicative financial context
          </summary>
          <div className="mt-3 hs-surface-card-sm bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
            <IndicativeFinancialContextSection app={app} />
          </div>
        </details>
      </PdpSection>
    </div>
  )
}
