import type { App } from '@/lib/data'
import type { ConceptFeaturedContent } from '@/lib/conceptHomeTypes'
import type { HomeCampaignItem, HomeNewsItem } from '@/lib/homeContentTypes'
import {
  DatasetOverviewBand,
  ImpactSection,
  PrototypeNoteSection,
  type HomeDashboardApp,
  type HomeDashSlice,
} from './HomeFragments'
import {
  FeaturedTherapeuticBand,
  NewsListConcept,
  CampaignsColumnConcept,
} from './HomeLayoutV4'
import ConceptStepsBand from './ConceptStepsBand'

type HomePublicContentProps = {
  apps: HomeDashboardApp[]
  dash: HomeDashSlice
  conditions: { id: string; label: string; colour: string; count: number; icon: string }[]
  news: HomeNewsItem[]
  campaigns: HomeCampaignItem[]
  conceptFeatured: ConceptFeaturedContent
  featuredApp: App | undefined
}

export default function HomePublicContent({
  apps,
  dash,
  conditions,
  news,
  campaigns,
  conceptFeatured,
  featuredApp,
}: HomePublicContentProps) {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-col gap-12 md:gap-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <NewsListConcept news={news} />
            <CampaignsColumnConcept campaigns={campaigns} />
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <FeaturedTherapeuticBand concept={conceptFeatured} app={featuredApp} disableLink />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16 pt-12 md:pt-14">
        <div className="flex flex-col gap-12 md:gap-14">
          <ConceptStepsBand />
          <DatasetOverviewBand apps={apps} conditions={conditions} hideNiceGuidance />
          <ImpactSection dash={dash} />
          <PrototypeNoteSection dash={dash} />
        </div>
      </div>
    </>
  )
}
