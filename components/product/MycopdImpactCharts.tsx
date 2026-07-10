import BeforeAfterImpact from '@/components/charts/BeforeAfterImpact'
import type { MycopdMetricImpact } from '@/lib/localData/mycopdImpact'

/**
 * myCOPD projected-impact charts — reduction-cut (B) treatment.
 */
export default function MycopdImpactCharts({
  eligibleLabel,
  gp,
  readmit,
}: {
  eligibleLabel: string
  gp: MycopdMetricImpact
  readmit: MycopdMetricImpact
}) {
  return (
    <div>
      <p className="nhsuk-body" style={{ margin: '0 0 16px', color: 'var(--text-secondary)' }}>
        Based on {eligibleLabel} eligible patients enrolled with a 75% uptake.
      </p>
      <div className="hs-chart-section" style={{ marginTop: 0 }}>
        <BeforeAfterImpact
          variant="cut"
          title={gp.title}
          todayLabel={gp.todayLabel}
          todayValue={gp.todayValue}
          withLabel={gp.withLabel}
          withValue={gp.withValue}
          delta={gp.delta}
          deltaLabel={gp.deltaLabel}
        />
        <BeforeAfterImpact
          variant="cut"
          title={readmit.title}
          todayLabel={readmit.todayLabel}
          todayValue={readmit.todayValue}
          withLabel={readmit.withLabel}
          withValue={readmit.withValue}
          delta={readmit.delta}
          deltaLabel={readmit.deltaLabel}
        />
      </div>
    </div>
  )
}
