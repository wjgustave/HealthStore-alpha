import { DashboardWelcome } from './DashboardWelcome'
import { SavedAppsWidget } from './widgets/SavedAppsWidget'
import { CommissionedAppsWidget } from './widgets/CommissionedAppsWidget'
import { EoiActivityWidget } from './widgets/EoiActivityWidget'
import { DashboardStatTiles } from './widgets/DashboardStatTiles'
import type { DashboardVariantProps } from './types'

/** Version 4 - "Bento grid": quick-stat tiles + widgets in a varied tile grid, then discovery. */
export function DashboardV4(props: DashboardVariantProps) {
  const { apps, conceptGrid, organisationName } = props

  return (
    <div className="flex flex-col gap-12 md:gap-14">
      <DashboardWelcome organisationName={organisationName} />

      <DashboardStatTiles commissionedStatus={conceptGrid.commissioned.status_label} />

      <div className="grid items-stretch gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <EoiActivityWidget limit={6} />
        </div>
        <div className="lg:col-span-5">
          <SavedAppsWidget apps={apps} limit={5} />
        </div>
        <div className="lg:col-span-12">
          <CommissionedAppsWidget commissioned={conceptGrid.commissioned} />
        </div>
      </div>
    </div>
  )
}
