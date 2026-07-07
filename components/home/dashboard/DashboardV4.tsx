import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import HomeHeroSearch from '@/components/home/HomeHeroSearch'
import { DashboardWelcome } from './DashboardWelcome'
import { DashboardSessionNotice } from './DashboardSessionNotice'
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

      <DashboardSessionNotice />

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <HomeHeroSearch />
        <span className="hs-text-card-title-sm hs-font-bold sm:px-1" style={{ color: 'var(--text-secondary)' }}>
          Or
        </span>
        <Link
          href="/apps"
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-4 hs-text-label hs-font-bold transition-colors hover:bg-[#F0F4F5]"
          style={{ border: '1px solid var(--border)', color: 'var(--nhs-blue)', background: '#fff' }}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden />
          Find apps
        </Link>
      </div>

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
