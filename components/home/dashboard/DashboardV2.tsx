import { DatasetOverviewBand, PrototypeNoteSection } from '@/components/home/HomeFragments'
import { NewsListConcept, CampaignsColumnConcept } from '@/components/home/HomeLayoutV4'
import { DashboardWelcome } from './DashboardWelcome'
import { SavedAppsWidget } from './widgets/SavedAppsWidget'
import { CommissionedAppsWidget } from './widgets/CommissionedAppsWidget'
import { EoiActivityWidget } from './widgets/EoiActivityWidget'
import type { DashboardVariantProps } from './types'

/** Version 2 - "Dashboard-first": personal home space widgets up top, discovery below. */
export function DashboardV2(props: DashboardVariantProps) {
  const { apps, conditions, news, campaigns, conceptGrid, dash, displayName, organisationName } = props

  return (
    <div className="flex flex-col gap-12 md:gap-14">
      <DashboardWelcome displayName={displayName} organisationName={organisationName} />

      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        <SavedAppsWidget apps={apps} />
        <CommissionedAppsWidget commissioned={conceptGrid.commissioned} />
        <EoiActivityWidget />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <NewsListConcept news={news} />
        <CampaignsColumnConcept campaigns={campaigns} />
      </div>

      <DatasetOverviewBand apps={apps} conditions={conditions} hideNiceGuidance />
      <PrototypeNoteSection dash={dash} />
    </div>
  )
}
