import HorizontalBarChart from '@/components/charts/HorizontalBarChart'

type LusciiMetric = {
  title: string
  todayValue?: number
  low: number
  high: number
  deltaLabel: string
}

function LusciiMetricPanel({
  metric,
  maxValue,
  areaLabel,
}: {
  metric: LusciiMetric
  maxValue: number
  areaLabel: string
}) {
  const range = `${metric.low.toLocaleString()}–${metric.high.toLocaleString()}`
  return (
    <div className="hs-chart-panel">
      <h3>{metric.title}</h3>
      {metric.todayValue != null ? (
        <div className="hs-before-after__cut-meta">
          <span>
            Today <strong>{metric.todayValue.toLocaleString()}</strong>
          </span>
          <span>
            Avoided <strong>{range}</strong>
          </span>
        </div>
      ) : null}
      <HorizontalBarChart
        ariaLabel={`${metric.title} in ${areaLabel}: ${range} ${metric.deltaLabel}. ${
          metric.todayValue != null ? `Today ${metric.todayValue.toLocaleString()}.` : ''
        }`}
        maxValue={maxValue}
        showRowText={false}
        rows={[
          {
            label: 'Avoided per year',
            value: metric.high,
            displayValue: range,
          },
        ]}
      />
      <p className="hs-before-after__delta">
        ≈ {range} {metric.deltaLabel}
      </p>
    </div>
  )
}

/**
 * Luscii projected-impact charts — same two-panel HTML treatment as myCOPD,
 * so SM (below 640px) stays readable and meets WCAG AA.
 */
export default function LusciiImpactCharts({
  eligibleLabel,
  areaLabel,
  admLow,
  admHigh,
  aeLow,
  aeHigh,
  admToday,
  aeToday,
}: {
  eligibleLabel: string
  areaLabel: string
  admLow: number
  admHigh: number
  aeLow: number
  aeHigh: number
  admToday?: number
  aeToday?: number
}) {
  const maxValue = Math.max(admHigh, aeHigh, 1) * 1.25

  return (
    <div>
      <p className="nhsuk-body" style={{ margin: '0 0 16px', color: 'var(--text-secondary)' }}>
        Based on {eligibleLabel} eligible patients enrolled with a 75% uptake.
      </p>
      <div className="hs-chart-section" style={{ marginTop: 0 }}>
        <LusciiMetricPanel
          areaLabel={areaLabel}
          maxValue={maxValue}
          metric={{
            title: 'Emergency admissions',
            todayValue: admToday,
            low: admLow,
            high: admHigh,
            deltaLabel: 'fewer emergency admissions per year',
          }}
        />
        <LusciiMetricPanel
          areaLabel={areaLabel}
          maxValue={maxValue}
          metric={{
            title: 'A&E attendances',
            todayValue: aeToday,
            low: aeLow,
            high: aeHigh,
            deltaLabel: 'fewer A&E attendances per year',
          }}
        />
      </div>
    </div>
  )
}
